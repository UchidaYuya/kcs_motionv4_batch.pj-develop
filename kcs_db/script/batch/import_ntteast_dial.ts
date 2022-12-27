//===========================================================================
//機能：請求情報ファイルインポートプロセス（NTT東日本専用）
//
//作成：中西
//===========================================================================

// error_reporting(E_ALL);
const SCRIPT_NAMEJ = "NTT東日本請求ダイアルインインポート";


import TableNo, { ScriptDB } from "../../script/batch/lib/script_db"


import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_DEBUG, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../../script/batch/lib/script_log"

import * as fs from "fs"
import * as Encoding from "encoding-japanese"
import * as lockfile from "proper-lockfile"
import { DATA_DIR, DATA_LOG_DIR } from "../../db_define/define";
import { G_AUTH_ASP, G_CODE_ASP, G_CODE_ASX, G_EXCISE_RATE } from "./lib/script_common";

(async () => {
const NTTEAST_DIR = "/NTT_east/bill";
const NTTEAST_PAT = "/^P/i";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const LINE_LENGTH = 512;
const NTTEAST_CARRIER_ID = 7;
const NTTEAST_AREA_ID = 34;
const NTTEAST_CIRCUIT_ID = 17;
const FILE_EXT = "_dial";

var Kanri_POS = [1, 4, 9, 15, 17, 19, 20, 22];

var Meisai_POS = [1, 7, 11, 13, 15, 16, 22, 26, 34, 46, 58, 70, 82, 94, 106, 118, 130, 142, 154, 166, 178, 190, 202, 214, 226, 238, 250, 262];

var Seikyu_POS = [2, 5];

var Total_POS = [1, 3, 9, 19];

var H_Zei_CODE: { [key: number]: string } = {
	0: "設定無し",
	1: "合算",
	2: "個別",
	3: "内税",
	4: "非対象等"
};

var dbLogFile = DATA_LOG_DIR + "/billbat.log";

var log_listener = new ScriptLogBase(0);


var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);


var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");

log_listener.putListener(log_listener_type);

log_listener.putListener(log_listener_type2);

var dbh = new ScriptDB(log_listener);

var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

if (process.argv.length != 6 + 1) //数が正しくない
	{
		usage("", dbh);
		throw process.exit(1);
	}


var argvCnt = process.argv.length;

var year = 0;
var month = 0;
var billdate = "";
var pactid_in = "";


for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
{
	if (process.argv[cnt].match("^-e="))
	// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
		{

			var mode = process.argv[cnt].replace("^-e=", "").toLowerCase();
			// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!mode.match("^[ao]$")) {
			// if (ereg("^[ao]$", mode) == false) {
				usage("ERROR: モードの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-y="))
	// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		{

			billdate = process.argv[cnt].replace("^-y=", "")
			// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

			if (!billdate.match("^[0-9]{6}$")) {
			// if (ereg("^[0-9]{6}$", billdate) == false) {
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
				{


					// var year = billdate.substr(0, 4);
					year = parseInt(billdate.substring(0, 4))
					// var month = billdate.substr(4, 2);
					month = parseInt(billdate.substring(4, 2))

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
					}
				}

			// var diffmon = (date("Y") - year) * 12 + (date("m") - month);
			var diffmon = (new Date().getFullYear() - year) * 12 + (new Date().getMonth() + 1 - month)

			if (diffmon < 0) {
				usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
			} else if (diffmon >= 24) {
				usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-p="))
	// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		{

			pactid_in = process.argv[cnt].replace("^-p=", "").toLowerCase();
			// var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!pactid_in.match("^all$") && !pactid_in.match("^[0-9]+$")) {
			// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
				usage("ERROR: 契約ＩＤの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-b="))
	// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		{

			var backup = process.argv[cnt].replace("^-b=", "").toLowerCase();
			// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!backup.match("^[ny]$")) {
			// if (ereg("^[ny]$", backup) == false) {
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-t="))
	// if (ereg("^-t=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		{

			var teltable = process.argv[cnt].replace("^-t=", "").toLowerCase();
			// var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!teltable.match("^[no]$")) {
			// if (ereg("^[no]$", teltable) == false) {
				usage("ERROR: 今月のデータかどうかの指定が不正です", dbh);
			}

			continue;
		}

	usage("", dbh);
}


var dataDir = DATA_DIR + "/" + billdate + NTTEAST_DIR;

if (fs.existsSync(dataDir) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません.");
}


var A_pactid = Array();

var A_pactDone = Array();

var A_pactFailed = Array();

if (pactid_in == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{
		var dirh = fs.readdirSync(dataDir);
		// var dirh = openDir(dataDir);

		for (let fileName in dirh)
		// while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		{
			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {
				A_pactid.push(fileName);
			}

// 			clearstatcache();// 2022cvt_012
		}

		// closedir(dirh);
	} else {
	A_pactid.push(pactid_in);
}

if (A_pactid.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Pact用データディレクトリが１つもありません.");
	throw process.exit(1);
}



var sql = "select code,name,codetype,taxtype from utiwake_tb where carid=" + NTTEAST_CARRIER_ID;

var H_result = await dbh.getHash(sql, true);

var H_utiwake = Array();
for (cnt = 0; cnt < H_result.length; cnt++) //ダイアルインに網種別はないので、先頭に "網種別"- が付いているものを除く.
{

	var code = H_result[cnt].code;

	if (code.length < 2 || code[1] == "-") {
		continue;
	}

	H_utiwake[code] = H_result[cnt];
}


var O_tableNo = new TableNo();

var tableNo = O_tableNo.get(year, month);

var telX_tb = "tel_" + tableNo + "_tb";

var postrelX_tb = "post_relation_" + tableNo + "_tb";

var teldetailX_tb = "tel_details_" + tableNo + "_tb";
sql = "select pactid,compname from pact_tb order by pactid";
H_result = await dbh.getHash(sql, true);

var pactCnt = H_result.length;

var H_pactid: { [key: string]: any } = {}

for (cnt = 0; cnt < pactCnt; cnt++) //pactid => 会社名
{
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

pactCnt = A_pactid.length;
A_pactid.sort();

var file_teldetails = "";
for (cnt = 0; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
//処理する請求データファイル名配列
//請求データファイル名を取得する
//請求データファイルがなかった場合
//bill_prtel_tb より請求番号を得る（ここでは親番号ではない）
//請求月電話番号マスター作成
//ルート部署を取得
//現在用
//請求月用
//詳細データを保存する
//正常処理が終わった pactid のみ書き出し処理
{
	if (undefined !== H_pactid[A_pactid[cnt]] == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " は pact_tb に登録されていません.");
		continue;
	}


	var pactid = A_pactid[cnt];

	var pactname = H_pactid[pactid];

	var A_billFile: string[] = Array();

	var dataDirPact = dataDir + "/" + pactid;
		var dirh = fs.readdirSync(dataDirPact);
	// dirh = openDir(dataDirPact);

	for (var fileName in dirh) {
	// while (fileName = fs.readdir(dirh)) {
// 2022cvt_028
		if (fs.statSync(dataDirPact + "/" + fileName).isFile())
		// if (is_file(dataDirPact + "/" + fileName) == true) //ファイル名の先頭文字が適合するものだけ
			{
// 2022cvt_019
				if (fileName.match(NTTEAST_PAT)) {
				// if (preg_match(NTTEAST_PAT, fileName)) {
					A_billFile.push(fileName);
				} else {
					logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + "は処理されませんでした.");
				}
			}

// 		clearstatcache();// 2022cvt_012
	}

	if (A_billFile.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "の請求データファイルが見つかりません.");
			// closedir(dirh);
			continue;
		}

	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "処理対象となるファイル：" + A_billFile.join(","));
	// closedir(dirh);

	var A_codes = Array();
	sql = "select prtelno from bill_prtel_tb where pactid=" + pactid + " and carid=" + NTTEAST_CARRIER_ID;
	H_result = await dbh.getHash(sql, true);


	for (var idx = 0; idx < H_result.length; idx++) {
		A_codes.push(H_result[idx].prtelno);
	}

	if (A_codes.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "についての請求番号がbill_prtel_tbに見つかりません.");
			continue;
		}


	var A_telno = Array();
	sql = "select telno from tel_tb where pactid=" + pactid + " and carid=" + NTTEAST_CARRIER_ID;


	for (var data of await dbh.getHash(sql, true)) {
		A_telno.push(data.telno);
	}


	var A_telnoX = Array();
	sql = "select telno from " + telX_tb + " where pactid=" + A_pactid[cnt] + " and carid=" + NTTEAST_CARRIER_ID;


	for (var data of await dbh.getHash(sql, true)) {
		A_telnoX.push(data.telno);
	}


	var rootPostid = getRootPostid(pactid, "post_relation_tb");

	var rootPostidX = getRootPostid(pactid, postrelX_tb);

	if (rootPostid == "") //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "post_relation_tbからRoot部署の取得にに失敗.");
			continue;
		}

	if (rootPostidX == "") //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + postrelX_tb + "からRoot部署の取得にに失敗.");
			continue;
		}

	A_billFile.sort();

	var A_fileData = Array();

	var A_telData = Array();

	var A_telXData = Array();

	var errFlag = false;


	for (var fileName of A_billFile) //読込電話件数
	//読込明細件数
	//追加する電話数
	//追加する電話数
	{
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理開始.");

		var ReadTelCnt = 0;

		var ReadMeisaiCnt = 0;

		var AddTelCnt = 0;

		var AddTelXCnt = 0;

		if (doEachFile(dataDirPact + "/" + fileName, pactid, billdate, A_fileData, dbh) == 1) //エラーがあったらそこで中断.
			{
				errFlag = true;
				break;
			}

		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理完了:電話件数=" + ReadTelCnt + ":明細件数=" + ReadMeisaiCnt + ":追加電話件数(tel_tb)=" + AddTelCnt + ":追加電話件数(" + telX_tb + ")=" + AddTelXCnt);
	}

	if (errFlag == false) //ファイルに書き出す
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "データ書出処理開始.");

			if (writeTelData(pactid) != 0 || await writeInsFile(pactid, billdate, A_fileData) != 0) //失敗を記録する.
				//次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "ファイルの書き出しに失敗.");
					A_pactFailed.push(pactid);
					continue;
				}

			A_pactDone.push(pactid);
		} else //失敗を記録する
		{
			A_pactFailed.push(pactid);
		}
}

if (A_pactDone.length > 0) {
	console.log("COMPLETE_PACTS," + A_pactDone.join(",") + "\n");
	// print("COMPLETE_PACTS," + A_pactDone.join(",") + "\n");
} else {
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "読み込みに成功したPactが１つも無かった.");
}

if (A_pactFailed.length > 0) {
	console.log("FAILED_PACTS," + A_pactFailed.join(",") + "\n");
	// print("FAILED_PACTS," + A_pactFailed.join(",") + "\n");
}

logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
throw process.exit(0);

function doEachFile(fileName: string, pactid: string, billdate: string, A_fileData: Array<any>, db: ScriptDB) //ファイルオープン
//管理レコードのチェック
{

	// var fp = fopen(fileName, "rb");
	var buffer;
	try {
		buffer = fs.readFileSync(fileName, 'utf8');
	} catch (e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のオープン失敗.");
		return 1;
	}
	var text = Encoding.convert(buffer, {
		from: 'SJIS',
		to: 'UNICODE',
		type: 'string'
	})
	var lines = text.toString().split("\r\n");

	if (lockfile.checkSync(fileName)) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のロックに失敗.");
		// fclose(fp);
		return 1;
	}

	lockfile.lockSync(fileName)


	// var line = fgets(fp);
	// line = rtrim(line, "\r\n");

	if (checkKanriRecord(lines[0], fileName, pactid, billdate, db) == 1) {
		lockfile.unlockSync(fileName);
		// flock(fp, LOCK_UN);
		// fclose(fp);
		return 1;
	}


	var TotalUp = 0;

	for (var line of lines.splice(1))
	// while (line = fgets(fp)) //改行取り
	//１行の長さチェック
	//データ種類を見分ける -- ダイアルインはここが違う.
	//課金電話番号レコード
	{
		// if (feof(fp)) //おしまい.
		// 	{
		// 		break;
		// 	}

		// line = rtrim(line, "\r\n");

		if (line.length != LINE_LENGTH) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の一行の長さが異常(" + line.length + "!=" + LINE_LENGTH + ").");
			lockfile.unlockSync(fileName);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return 1;
		}

		// line = mb_convert_encoding(line, "UTF-8");

		// var dataKind = line.substr(0, 1);
		var dataKind = line.substring(0, 1);

		if (dataKind == "2") //ここは特に見ない
			//print "DEBUG: *** 課金電話番号レコード\n";
			{
				continue;
			} else if (dataKind == "5") {

			var sum = { "value": 0 };

			if (doTelRecord(line, pactid, A_fileData, sum, db) == 1) {
				lockfile.unlockSync(fileName);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return 1;
			}

			TotalUp += sum.value;
		} else if (dataKind == "9") {
			if (doTotalRecord(line, TotalUp, db) == 1) {
				lockfile.unlockSync(fileName);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return 1;
			}
		} else {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "未知のデータ種類(" + dataKind + ").");
			lockfile.unlockSync(fileName);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return 1;
		}
	}

	lockfile.unlockSync(fileName);
	// flock(fp, LOCK_UN);
	// fclose(fp);
	return 0;
};

function checkKanriRecord(line: string, fileName: string, pactid: string, billdate: string, db: ScriptDB) //１行の長さチェック
//データ種類チェック
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;

	if (line.length != LINE_LENGTH) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の一行の長さが異常(" + line.length + "!=" + LINE_LENGTH + ").");
		return 1;
	}

	// if (!("Kanri_POS" in global)) Kanri_POS = undefined;

	var record = splitFix(line, Kanri_POS);

	if (record[0] != "1") //管理レコードは"1"
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の管理レコードに異常(" + record[0] + ").");
			return 1;
		}


	var target_yyyymm = Hei2Sei(record[4]) + record[5];

	if (target_yyyymm != billdate) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "ファイルの年月が対象年月と異なります(" + target_yyyymm + "!=" + billdate + ").");
		return 1;
	}

	return 0;
};

function doTelRecord(line: string, pactid: string, A_fileData: Array<any>, sum: { [key: string]: number }, db: ScriptDB) //pactごとの請求番号
//読込電話件数
//読込明細件数
//分割してみる.
//DEBUG * 表示してみる
//print "**** doTelRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//請求番号のチェック
//電話番号の登録
//読み込んだレコード数をカウントする.
//ご請求金額
//print "DEBUG: tel=". $telno . " ご請求金額=" . $chargeSum . "\n";
//請求内訳
//ここで合計金額チェックする.
{
	// if (!("Meisai_POS" in global)) Meisai_POS = undefined;
	// if (!("Seikyu_POS" in global)) Seikyu_POS = undefined;
	// if (!("A_codes" in global)) A_codes = undefined;
	// if (!("H_utiwake" in global)) H_utiwake = undefined;
	// if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	// if (!("ReadTelCnt" in global)) ReadTelCnt = undefined;
	// if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	var record = splitFix(line, Meisai_POS);

	if (-1 !== A_codes.indexOf(record[6]) == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "請求番号が違います(" + record[6] + ").");
		return 1;
	}


	var telno = record[1].trimEnd() + record[2].trimEnd();
	// var telno = rtrim(record[1]) + rtrim(record[2]);
	registTel(telno);
	ReadTelCnt++;

	var chargeSum = +record[8];


	for (var n = 0; n < 20; n++) //最大20レコード
	//内訳コードが空白だったらスキップ
	//請求内訳コードを調べる
	//税コードのチェック
	//読み込んだレコード数をカウントする.
	{

		var seikyu = record[9 + n];

		if (seikyu[0] == " " && seikyu[1] == " ") {
			continue;
		}


		var s_rec = splitFix(seikyu, Seikyu_POS);

		var code = s_rec[1];

		var charge = +s_rec[2];

		if (undefined !== H_utiwake[code]) //print "DEBUG: ".  $H_utiwake[$code]["name"] . ", " . $charge . " 円\n";
			{

				if (H_utiwake[code].codetype == 0) //0のみ合計計算対象
					//合計値を得る
					{
						sum.value += charge;
					}
			} else {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な内訳コードです(" + code + ").");
			return 1;
		}



		var zei = H_utiwake[code].taxtype;

		if (!(undefined !== H_Zei_CODE[zei])) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な税コードです(" + zei + ").");
			return 1;
		}


		var A_meisai = [telno, code, charge, zei, record[6]];
		A_fileData.push(A_meisai);
		ReadMeisaiCnt++;
	}

	if (chargeSum != sum.value) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "ご請求金額が内訳の合計に一致しません.(" + chargeSum + "!=" + sum.value + ").");
		return 1;
	}

	return 0;
};

function registTel(telno: string) //電話番号マスター
//請求月電話番号マスター
//-t オプションの値
//root部署
//請求月root部署
//追加する電話数
//追加する電話数
//print "DEBUG: 電話番号: " . $telno . "\n";
//tel_tbの存在チェック
{
	// if (!("A_telno" in global)) A_telno = undefined;
	// if (!("A_telnoX" in global)) A_telnoX = undefined;
	// if (!("A_telData" in global)) A_telData = undefined;
	// if (!("A_telXData" in global)) A_telXData = undefined;
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("teltable" in global)) teltable = undefined;
	// if (!("rootPostid" in global)) rootPostid = undefined;
	// if (!("rootPostidX" in global)) rootPostidX = undefined;
	// if (!("AddTelCnt" in global)) AddTelCnt = undefined;
	// if (!("AddTelXCnt" in global)) AddTelXCnt = undefined;

	var telFlag = true;

	if (-1 !== A_telno.indexOf(telno) == false) //print "INFO: 電話は tel_tb に登録されていません\n";
		{
			telFlag = false;
		}


	var telXFlag = true;

	if (-1 !== A_telnoX.indexOf(telno) == false) //print "INFO: 電話は". $telX_tb ."に登録されていません\n";
		{
			telXFlag = false;
		}

	if (telFlag && telXFlag) //print "INFO: 電話は両方にありました、何もしません.\n";
		{
			return 0;
		}

	if (telFlag == false && telXFlag) //print "INFO: 電話はtel_tbに無くて、telX_tbにありました、何もしません.\n";
		{
			return 0;
		}

	if (telXFlag == false) //print "INFO: 電話はtelX_tbに無かったので追加します.\n";
		//tel_XX_tb に追加する電話を出力
		//追加する電話数のカウント
		{
			A_telXData.push([rootPostidX, telno]);
			AddTelXCnt++;
		}

	if (telFlag == false && telXFlag == false && teltable == "n") //tel_tb に追加する電話を出力
		//print "INFO: 電話はtel_tbに無かったので追加します.\n";
		//追加する電話数のカウント
		{
			A_telData.push([rootPostid, telno]);
			AddTelCnt++;
		}
};

function writeTelData(pactid: string) //現在の日付を得る
//tel_XX_tb に追加する電話を出力
{
	// if (!("A_telData" in global)) A_telData = undefined;
	// if (!("A_telXData" in global)) A_telXData = undefined;
	// if (!("dataDir" in global)) dataDir = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("telX_tb" in global)) telX_tb = undefined;

	var nowtime = getTimestamp();

	var file_tel = dataDir + "/" + "tel_tb" + billdate + pactid + FILE_EXT + ".tmp";

	var fp_tel;
	try {
		fp_tel = fs.openSync(file_tel, "w");
	} catch (e) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_tel + "の書き込みオープン失敗.");
		return 1;
	}
	// var fp_tel = fopen(file_tel, "w");


	var file_telX = dataDir + "/" + telX_tb + billdate + pactid + FILE_EXT + ".tmp";

	var fp_telX;
	try {
		fp_telX = fs.openSync(file_telX, "w");
	} catch (e) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "の書き込みオープン失敗.");
		return 1;
	}
	// var fp_telX = fopen(file_telX, "w");


	for (var A_data of A_telXData) {
		rootPostid = A_data[0];

		var telno = A_data[1];
		fs.writeFileSync(fp_telX, pactid + "\t" + rootPostid + "\t" + telno + "\t" + telno + "\t" + NTTEAST_CARRIER_ID + "\t" + NTTEAST_AREA_ID + "\t" + NTTEAST_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");// 2022cvt_006
	}


	for (var A_data of A_telData) {
		rootPostid = A_data[0];
		telno = A_data[1];
		fs.writeFileSync(fp_tel, pactid + "\t" + rootPostid + "\t" + telno + "\t" + telno + "\t" + NTTEAST_CARRIER_ID + "\t" + NTTEAST_AREA_ID + "\t" + NTTEAST_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");// 2022cvt_006
	}

	fs.closeSync(fp_tel);
	// fclose(fp_tel);
	fs.closeSync(fp_telX);
	// fclose(fp_telX);
	return 0;
};

function doTotalRecord(line: string, TotalUp: number, db: ScriptDB) //分割してみる.
//DEBUG * 表示してみる
//print "==== doTotalRecord ================================\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//$rec_cnt = (int)$record[2];
//print "DEBUG: レコード数=" . $rec_cnt . "\n";
{
	// if (!("Total_POS" in global)) Total_POS = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid" in global)) pactid = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	var record = splitFix(line, Total_POS);

	var total = +record[3];

	if (total != TotalUp) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "会社合計金額が異なります.(" + total + "!=" + TotalUp + ").");
		return 1;
	}

	return 0;
};

	async function writeInsFile(pactid: string, billdate: string, A_fileData: Array<any>) //ASP利用料金
//データが空のときは終了.
//現在の日付を得る
//権限チェック「ASP利用料表示設定」がＯＮになっているか
//電話番号（１回前の）
//各データを書き出す
//最後の電話についてASP使用料を表示する.
{
	// if (!("H_pactid" in global)) H_pactid = undefined;
	// if (!("H_utiwake" in global)) H_utiwake = undefined;
	// if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	// if (!("fp_teldetails" in global)) fp_teldetails = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("dataDir" in global)) dataDir = undefined;
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;

	var aspCharge = 0;

	var aspFlg = false;

	if (A_fileData.length == 0) {
		return 0;
	}


	var nowtime = getTimestamp();

	if (await chkAsp(pactid) == true) //ASP利用料を取得
		//ASP利用料が設定されていない場合
		{
			aspFlg = true;
			aspCharge = await getAsp(pactid);

			if (!aspCharge) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "ＡＳＰ利用料が設定されていません.");
				return 1;
			}
		}


	var file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + FILE_EXT + ".tmp";
	var fp_teldetails;
	try {
		fp_teldetails = fs.openSync(file_teldetails, "w");
	} catch (e) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "の書き込みオープン失敗.");
		return 1;
	}
	// fp_teldetails = fopen(file_teldetails, "w");


	var detailNo = 0;

	var telno = "";


	for (var data of A_fileData) //data : telno, code, charge, zei, billcode
	//電話番号が変わったら
	//内訳コード名
	//末尾の空白を除く
	//carid キャリアID
	{
		if (data[0] != telno && telno != "") //ASP利用料表示する
			{
				detailNo++;

				if (aspFlg == true) //合計用に１つ進める
					//ASP利用料を出力
					//ASP利用料消費税を出力
					{
						detailNo++;
						fs.writeFileSync(fp_teldetails, pactid + "\t" + telno + "\t" + G_CODE_ASP + "\t" + H_utiwake[G_CODE_ASP].name + "\t" + aspCharge + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTEAST_CARRIER_ID + "\t" + "\n");// 2022cvt_006
						detailNo++;
						fs.writeFileSync(fp_teldetails, pactid + "\t" + telno + "\t" + G_CODE_ASX + "\t" + H_utiwake[G_CODE_ASX].name + "\t" + +(aspCharge * G_EXCISE_RATE + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTEAST_CARRIER_ID + "\t" + "\n"));// 2022cvt_006
					}

				detailNo = 0;
			} else //電話はそのまま
			{
				detailNo++;
			}

		telno = data[0];

		var ut_name = H_utiwake[data[1]].name;
		ut_name = ut_name.replace("\u3000 ", "")
		// ut_name = rtrim(ut_name, "\u3000 ");
		fs.writeFileSync(fp_teldetails, pactid + "\t" + telno + "\t" + data[1] + "\t" + ut_name + "\t" + data[2] + "\t" + H_Zei_CODE[data[3]] + "\t" + detailNo + "\t" + nowtime + "\t" + NTTEAST_CARRIER_ID + "\t" + data[4] + "\n");// 2022cvt_006
	}

	detailNo++;

	if (aspFlg == true) //合計用に１つ進める
		//ASP利用料を出力
		//ASP利用料消費税を出力
		{
			detailNo++;
			fs.writeFileSync(fp_teldetails, pactid + "\t" + telno + "\t" + G_CODE_ASP + "\t" + H_utiwake[G_CODE_ASP].name + "\t" + aspCharge + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTEAST_CARRIER_ID + "\t" + "\n");// 2022cvt_006
			detailNo++;
			fs.writeFileSync(fp_teldetails, pactid + "\t" + telno + "\t" + G_CODE_ASX + "\t" + H_utiwake[G_CODE_ASX].name + "\t" + +(aspCharge * G_EXCISE_RATE + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTEAST_CARRIER_ID + "\t" + "\n"));// 2022cvt_006
		}

	fs.closeSync(fp_teldetails);
	// fclose(fp_teldetails);
	return 0;
};

function splitFix(str: string, A_pos: Array<any>) //１個目の要素
//中間の要素
//最後の要素
{

	var A_ret = Array();

	var total_len = str.length;

	// A_ret[0] = str.substr(0, A_pos[0]);
	A_ret[0] = str.substring(0, A_pos[0]);


	for (var i = 0; i < A_pos.length - 1; i++) {
		// A_ret[i + 1] = str.substr(A_pos[i], A_pos[i + 1] - A_pos[i]);
		A_ret[i + 1] = str.substring(A_pos[i], A_pos[i + 1] - A_pos[i]);
	}

	// A_ret[i + 1] = str.substr(A_pos[i]);
	A_ret[i + 1] = str.substring(A_pos[i]);
	return A_ret;
};

function Hei2Sei(hei: number) {
	return hei + 1988;
};

function usage(comment: string, db: ScriptDB) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
	console.log("		-t 当月データ	(N:データは今月のもの,O:データは先月のもの)\n\n");

	// print("\n" + comment + "\n\n");
	// print("Usage) " + _SERVER.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	// print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	// print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	// print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	// print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	// print("\t\t-t \u5F53\u6708\u30C7\u30FC\u30BF\t(N:\u30C7\u30FC\u30BF\u306F\u4ECA\u6708\u306E\u3082\u306E,O:\u30C7\u30FC\u30BF\u306F\u5148\u6708\u306E\u3082\u306E)\n\n");
	throw process.exit(1);
};

function getRootPostid(pactid: string, table: string) {
	// if (!("dbh" in global)) dbh = undefined;

	var sql_str = "select postidparent from " + table + " where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
	rootPostid = dbh.getOne(sql_str, true);
	return rootPostid;
};

	async function chkAsp(pactid: string) {
	// if (!("dbh" in global)) dbh = undefined;

	var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + G_AUTH_ASP;

	var count = await dbh.getOne(sql_str);

	if (count == 0) {
		return false;
	} else {
		return true;
	}
};

function getAsp(pactid: string) //if(is_null($charge)){
//print "charge no\n";
//}else{
//}
{
	// if (!("dbh" in global)) dbh = undefined;

	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + NTTEAST_CARRIER_ID;

	var charge = dbh.getOne(sql_str);
	return charge;
};

function getTimestamp() {

	// var tm = localtime(Date.now() / 1000, true);
	var tm = new Date();

	// var yyyy = tm.tm_year + 1900;
	var yyyy = tm.getFullYear();

	// var mm = tm.tm_mon + 1;
	var mm = (tm.getMonth() + 1).toString();

	var dd = (tm.getDate() + 0).toString();

	var hh = (tm.getHours() + 0).toString();

	var nn = (tm.getMinutes() + 0).toString();

	var ss = (tm.getSeconds() + 0).toString();

	// if (mm < 10) mm = "0" + mm;

	if (mm.length == 1) {
	// if (mm < 10) {
		mm = "0" + mm;
	}

	// var dd = tm.tm_mday + 0;
	// if (dd < 10) dd = "0" + dd;
	if (dd.length == 1) {
		dd = "0" + dd;
	}

	// var hh = tm.tm_hour + 0;
	// if (hh < 10) hh = "0" + hh;
	if (hh.length == 1) {
		hh = "0" + hh;
	}

	// var nn = tm.tm_min + 0;
	// if (nn < 10) nn = "0" + nn;
	if (nn.length == 1) {
		nn = "0" + nn;
	}

	// var ss = tm.tm_sec + 0;
	// if (ss < 10) ss = "0" + ss;
	if (ss.length == 1) {
		ss = "0" + ss;
	}

	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};
})();
