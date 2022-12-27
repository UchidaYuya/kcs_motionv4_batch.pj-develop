//===========================================================================
//機能：通話情報ファイルインポートプロセス（FUSION専用）
//
//作成：中西	2006/08/15	初版作成
//===========================================================================

import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";
// 2022cvt_026
import TableNo, { ScriptDB, TableInserter } from "../batch/lib/script_db";
// require("lib/script_db.php");

// 2022cvt_026
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_DEBUG, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../batch/lib/script_log";
// require("lib/script_log.php");

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as flock from "proper-lockfile";
import * as PATH from "path";
import { expDataByCursor } from "../pg_function";

(async () => {
const SCRIPT_NAMEJ = "FUSION通話情報標準ファイルインポート";
const SCRIPTNAME = "import_fusion_standard_tuwa.php";

const FUSION_DIR = "/fusion_standard/tuwa";
const FUSION_PAT = "/^[A-Z]\\d{11}\\.txt$/";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const FUSION_CARRIER_ID = 11;
const FUSION_CIRCUIT_ID = 25;
const KOUSI_FNCID = 47;
// 2022cvt_015
var H_TEL_TYPE = {
	"国内": "Fu0",
	"国内ＭＣ": "Fu1",
	"国際": "Fu2",
	"国際ＭＣ": "Fu3",
	"Ｗ－通話": "Fu4"
};
// 2022cvt_015
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
// 2022cvt_015
var log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 2022cvt_016
// 2022cvt_015
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
// 2022cvt_016
log_listener.putListener(log_listener_type);
// 2022cvt_016
log_listener.putListener(log_listener_type2);
// 2022cvt_015
var dbh = new ScriptDB(log_listener);
// 2022cvt_015
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

if (process.argv.length != 5 + 1) //数が正しくない
	{
		usage("", dbh);
		throw process.exit(1);// 2022cvt_009
	}

// 2022cvt_015
var argvCnt = process.argv.length;

var mode = "";
var billdate = "";
var year = 0;
var month = 0;
var pactid_in = "";
var backup = "";

// 2022cvt_015
for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
{
	if (process.argv[cnt].match("^-e="))
	// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
		{
// 2022cvt_015
			mode = process.argv[cnt].replace("^-e=", "").toLowerCase();
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
// 2022cvt_015
			billdate = process.argv[cnt].replace("^-y=", "");
			// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

			if (!billdate.match("^[0-9]{6}$")) {
			// if (ereg("^[0-9]{6}$", billdate) == false) {
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
				{
// 2022cvt_015
					year = parseInt(billdate.substring(0, 4));
// 2022cvt_015
					month = parseInt(billdate.substring(4, 2));

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
					}
				}

// 2022cvt_015
			var diffmon = (new Date().getFullYear() - year) * 12 + (new Date().getMonth() + 1 - month);
			// var diffmon = (date("Y") - year) * 12 + (date("m") - month);

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
// 2022cvt_015
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
// 2022cvt_015
			backup = process.argv[cnt].replace("^-b=", "").toLowerCase();
			// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!backup.match("^[ny]$")) {
			// if (ereg("^[ny]$", backup) == false) {
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

	usage("", dbh);
}

// 2022cvt_015
var dataDir = DATA_DIR + "/" + billdate + FUSION_DIR;

if (fs.existsSync(dataDir) == false) {// 2022cvt_003
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "通話明細データファイルディレクトリ（" + dataDir + "）がみつかりません.");
}

// 2022cvt_015
var A_pactid = Array();
// 2022cvt_015
var A_pactDone = Array();

if (pactid_in == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{
		var dirh = fs.readdirSync(dataDir);
		// var dirh = openDir(dataDir);// 2022cvt_004

		for (var fileName of dirh)
		// while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
		{
			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {// 2022cvt_003
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
	throw process.exit(1);// 2022cvt_009
}

if (await lock(true, dbh) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "２重起動です、前回エラー終了の可能性があります.");
	throw process.exit(1);// 2022cvt_009
}

// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var commhistory_tb = "commhistory_" + tableNo + "_tb";
// 2022cvt_015
var telX_tb = "tel_" + tableNo + "_tb";
// 2022cvt_015
var commhistoryFile = dataDir + "/" + commhistory_tb + billdate + pactid_in + ".ins";
// 2022cvt_015
var fp_comm;
try {
	fp_comm = fs.openSync(commhistoryFile, "w");
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryFile + "の書き込みオープン失敗.");
	throw process.exit(1);// 2022cvt_009
}
// var fp_comm = fopen(commhistoryFile, "w");

// 2022cvt_015
var totelmasterFile = dataDir + "/" + "kousi_totel_master_tb" + billdate + pactid_in + ".ins";
// 2022cvt_015
var fp_totel;
try {
	fp_totel = fs.openSync(totelmasterFile, "w");
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + totelmasterFile + "の書き込みオープン失敗.");
	throw process.exit(1);// 2022cvt_009
}
// var fp_totel = fopen(totelmasterFile, "w");

// 2022cvt_015
var sql = "select pactid,compname from pact_tb order by pactid";
// 2022cvt_015
var H_result = await dbh.getHash(sql, true);
// 2022cvt_015
var pactCnt = H_result.length;

var H_pactid = Array();
for (cnt = 0; cnt < pactCnt; cnt++) //pactid => 会社名
{
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

pactCnt = A_pactid.length;
A_pactid.sort();

for (cnt = 0; cnt < pactCnt; cnt++) //通話明細データディレクトリにある契約ＩＤがマスターに登録されているか？
//処理する請求データファイル名配列
//通話明細データファイル名を取得する
//通話明細データファイルがなかった場合
//公私分計処理：権限チェック
//公私分計処理：かけ先マスターを保持
//commhistory_X_tb インポートデータファイル出力用配列
//kousi_totel_master_tb インポートデータファイル出力用配列
//END ファイルごとの処理
//正常処理が終わった pactid のみ書き出し処理
{
	if (undefined !== H_pactid[A_pactid[cnt]] == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " は pact_tb に登録されていません.");
		continue;
	}

// 2022cvt_015
	var pactid = A_pactid[cnt];
// 2022cvt_015
	var pactname = H_pactid[pactid];
// 2022cvt_015
	var A_tuwaFile: string[] = Array();
// 2022cvt_015
	var dataDirPact = dataDir + "/" + pactid;
	var dirh = fs.readdirSync(dataDirPact);
	// dirh = openDir(dataDirPact);// 2022cvt_004

	for (var fileName of dirh) {
	// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
		if (fs.statSync(dataDirPact + "/" + fileName).isFile())
		// if (is_file() == true) //ファイル名が適合するものだけ
			{
// 2022cvt_019
				if (fileName.match(FUSION_PAT)) {
				// if (preg_match(FUSION_PAT, fileName)) {
					A_tuwaFile.push(fileName);
				} else {
					logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + "は処理されませんでした.");
				}
			}

// 		clearstatcache();// 2022cvt_012
	}

	if (A_tuwaFile.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "の通話明細データファイルが見つかりません.");
			// closedir(dirh);
			continue;
		}

	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "処理対象となるファイル：" + A_tuwaFile.join(","));
	// closedir(dirh);
	sql = "select count(*) from fnc_relation_tb where pactid=" + pactid + " and fncid=" + KOUSI_FNCID;
	cnt = await dbh.getOne(sql, true);

	if (cnt > 0) {
// 2022cvt_015
		var EnableKousi = true;
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "公私分計処理開始.");
	} else {
		EnableKousi = false;
	}

	if (EnableKousi == true) //kousiflg = 2:未登録 の電話はマスターから削除することになるので拾わない
		//初期化
		//print_r( $H_totel_master );
		//公私フラグの初期化
		{
			sql = "select telno, totelno, kousiflg from kousi_totel_master_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID + "and kousiflg != '2' order by telno, totelno";
			H_result = await dbh.getHash(sql, true);
// 2022cvt_015
			var totelCnt = H_result.length;
// 2022cvt_015
			var H_totel_master = Array();

			for (cnt = 0; cnt < totelCnt; cnt++) //電話番号 => 相手先電話番号 => 公私フラグ
			//ハイフンを除く
			{
// 2022cvt_015
				var telno = H_result[cnt].telno;

				if (undefined !== H_totel_master[telno] == false) {
					H_totel_master[telno] = Array();
				}

// 2022cvt_015
				var totelno = H_result[cnt].totelno;
				totelno = totelno.trim().replace(/-/g, "");
				H_totel_master[telno][totelno] = H_result[cnt].kousiflg;
			}

// 2022cvt_015
			var H_TelKousi = Array();
		}

// 2022cvt_015
	var A_commFileData = Array();
// 2022cvt_015
	var A_totelFileData = Array();
// 2022cvt_015
	var errFlag = false;

// 2022cvt_015
	for (var fileName of A_tuwaFile) //読込処理開始
	//読込明細件数
	//ファイル毎のデータをクリアーする
	{
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理開始.");
// 2022cvt_015
		var ReadMeisaiCnt = 0;

		if (doEachFile(dataDirPact + "/" + fileName, pactid, billdate, dbh) == 1) //エラーがあったらそこで中断.
			{
				errFlag = true;
				break;
			}

		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + ":明細件数=" + ReadMeisaiCnt);
// 2022cvt_015
		var A_fileData = Array();
	}

	if (errFlag == false) //ファイルに書き出す -- comm
		//ファイルに書き出す -- totel
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "データ書出処理開始.");

// 2022cvt_015
			for (var value of A_commFileData) {
				try {
					fs.writeFileSync(fp_comm, value)
				} catch (e) {
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + commhistoryFile + "ファイルの書き出しに失敗.");
					errFlag = true;
					break;
				}
			}

			if (errFlag == true) //次のPactの処理にスキップする.
				{
					continue;
				}

			// fflush(fp_comm);

// 2022cvt_015
			for (var value of A_totelFileData) {
				try {
					fs.writeFileSync(fp_totel, value)
				} catch (e) {
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + totelmasterFile + "ファイルの書き出しに失敗.");
					errFlag = true;
					break;
				}
			}

			if (errFlag == true) //次のPactの処理にスキップする.
				{
					continue;
				}

			// fflush(fp_totel);
			A_pactDone.push(pactid);
		}
}

fs.closeSync(fp_comm);
// fclose(fp_comm);
fs.closeSync(fp_totel);
// fclose(fp_totel);

if (A_pactDone.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "読み込みに成功したPactが１つも無かった.");
	throw process.exit(1);// 2022cvt_009
}

dbh.begin();

if (backup == "y") {
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理開始.");
	doBackup(dbh);
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理完了.");
}

if (mode == "o") {
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理開始.");
	doDelete(A_pactDone, dbh);
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理完了.");
}

logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理開始.");
doImportComm(commhistoryFile, dbh);
doImportTotel(totelmasterFile, dbh);
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理完了.");
dbh.commit();

// 2022cvt_015
for (var pactid of A_pactDone) {
// 2022cvt_015
	var pactDir = dataDir + "/" + pactid;
// 2022cvt_015
	var finDir = pactDir + "/" + FIN_DIR;
	finalData(pactid, pactDir, finDir);
}

lock(false, dbh);
logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
throw process.exit(0);// 2022cvt_009

function doEachFile(fileName: string, pactid: string, billdate: string, db: ScriptDB) //ファイルオープン
//アンダースコア'_'区切りの２番目
//１行ずつ読み込む.
//ファイルの全合計
//サービスごとの小計
{
	// if (!("A_commFileData" in global)) A_commFileData = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(fileName, "utf8");
	} catch (e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のオープン失敗.");
		return 1;
	}
	var text = Encoding.convert(buffer, {
		from: "SJIS",
		to: "UNICODE",
		type: "string"
	});
	var lines = text.toString().split("\r\n");
	// var fp = fopen(fileName, "rb");

	if (flock.checkSync(fileName)) {
	// if (flock(fp, LOCK_SH) == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のロックに失敗.");
		// fclose(fp);
		return 1;
	}
	flock.lockSync(fileName);

// 2022cvt_015
	var path = PATH.parse(fileName + ".txt");
	var fname_array = path.base.split("_");
	// var fname_array = split("_", basename(fileName, ".txt"));
// 2022cvt_015
	var reqNumber = fname_array[0];
// 2022cvt_015
	var TotalUp = 0;
// 2022cvt_015
	var small_sum = 0;

	for (var line of lines)
	// while (line = fgets(fp)) //改行取り
	//カンマ区切りで分割.
	//-- DEBUG -- * 表示してみる
	//print "**** Record **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//レコード数のチェック
	//番号.サービス名
	//05. 06. 07. は明細レコード
	//if( $hi_code == "05" || $hi_code == "06" || $hi_code == "07" ){
	{
		// if (feof(fp)) //おしまい.
		// 	{
		// 		break;
		// 	}

		// line = rtrim(line, "\r\n");

		if (line == "") //空行は除く
			{
				continue;
			}

		// line = mb_convert_encoding(line, "UTF-8", "sjis-win");
// 2022cvt_015
		var record = line.split(",");
		// var record = split(",", line);

		if (record.length != 15) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のレコード数が異常(" + record.length + "!= 15).");
			flock.unlockSync(fileName);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return 1;
		}

		var hi_code, service_name = record[4].split("\\.", 2);
		// [hi_code, service_name] = split("\\.", record[4], 2);

		if (hi_code < 10) //１桁のものは明細レコードと見なす
			//サービス小計に追加
			//全合計に追加
			{
// 2022cvt_015
				var sum = { "value": 0 };

				if (doMeisaiRecord(record, reqNumber, pactid, A_commFileData, sum) == 1) {
					flock.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				}

				small_sum += sum.value;
				TotalUp += sum.value;
			} else if (hi_code == 91) //小計クリア
			{
				if (doTotalRecord(record, hi_code, small_sum) == 1) {
					flock.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				}

				small_sum = 0;
			} else if (hi_code == 99) {
			if (doTotalRecord(record, hi_code, TotalUp) == 1) {
				flock.unlockSync(fileName);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return 1;
			}
		} else //当面は無視
			{}
	}

	flock.unlockSync(fileName);
	// flock(fp, LOCK_UN);
	// fclose(fp);
	return 0;
};

function doMeisaiRecord(record: Array<any>, reqNumber: string, pactid: string, A_commFileData: any[], sum: { [key: string]: number }) //コード表
//読込明細件数
//-- DEBUG -- * 表示してみる
//print "**** doMeisaiRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//請求番号チェック
//ハイフンは原則ないのだが念のため
//'-'ハイフンを除く
//MA名を入れる
//通話時間(分)を HHMM に直す
//通話時間(秒)を SS に直す
//$charge = (int)$record[13];	// 少数が来ることもある * 2009/04/20修正
//数字に変換
//$kousiflg = getTelKousi( $pactid, $telno, $totelno );
//FUSIONでは現在公私分計を行っていない 20091106naka
//getTelKousi 関数のみ、コメント状態で残してある.
//データを配列に保持する.
//公私フラグ
//明細件数カウント.
{
	// if (!("H_TEL_TYPE" in global)) H_TEL_TYPE = undefined;
	// if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	if (record[0].trim() != reqNumber) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "請求番号が違います.(" + record[0] + "!=" + reqNumber + ").");
		return 1;
	}

	if (record[2].trim() != billdate) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "請求年月日が違います.(" + record[2] + "!=" + billdate + ").");
		return 1;
	}

// 2022cvt_015
	var telno_view = record[5].trim();
// 2022cvt_015
	var telno = telno_view.replace(/-/g, "");
// 2022cvt_015
	var date = record[6].substring(0, 4) + "-" + record[6].substring(4, 2) + "-" + record[6].substring(6, 2) + " " + record[7].substring(0, 2) + ":" + record[7].substring(2, 2) + ":" + record[7].substring(4, 2);
// 2022cvt_015
	var totelno = record[9].trim();
// 2022cvt_015
	var toplace = record[8].trim();
// 2022cvt_015
	var tuwa_min = record[11];
// 2022cvt_015
	var tuwa_hour = +(tuwa_min / 60);
	var tuwa_hour_2 = (+(tuwa_min / 60)).toString();
	tuwa_min -= tuwa_hour * 60;
	var tuwa_min_2= "";

	if (tuwa_hour < 10) {
		tuwa_hour_2 = "0" + tuwa_hour;
	}

	if (tuwa_min < 10) {
		tuwa_min_2 = "0" + tuwa_min;
	}

// 2022cvt_015
	var tuwa_sec = record[12];
	var tuwa_sec_2 = "";

	if (tuwa_sec < 10) {
		tuwa_sec_2 = "0" + tuwa_sec;
	}

// 2022cvt_015
	var time = tuwa_hour_2 + tuwa_min_2 + tuwa_sec_2;
// 2022cvt_015
	var charge = record[13] + 0;

// 2022cvt_016
	if (undefined !== H_TEL_TYPE[record[14]]) //区分をtypeに入れる
		{
// 2022cvt_016
// 2022cvt_015
			var type = record[14];
		} else {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "未知の電話区分です.(" + record[14] + ").");
		return 1;
	}

// 2022cvt_016
	A_commFileData.push(pactid + "\t" + telno + "\t" + type + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + time + "\t" + charge + "\t" + FUSION_CARRIER_ID + "\t" + undefined + "\n");
	sum.value += charge;
	ReadMeisaiCnt++;
	return 0;
};

function doTotalRecord(record: string[], hi_code: any, TotalUp: number) //-- DEBUG -- * 表示してみる
//print "==== doTotalRecord ================================\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//数字に変換、少数がくることもある
{
// 2022cvt_015
	var total = parseFloat(record[13]) + 0;
	TotalUp += 0;

	if (Math.abs(total - TotalUp) > 0.1) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "会社合計金額が異なります.(" + total + "!=" + TotalUp + ").");
		return 1;
	}

	return 0;
};

	async function getTelKousi(pactid: string, telno: string, totelno: string) //権限が無ければ何もしない
//かけ先マスターに登録されているか？
//'-'ハイフンを除く
{
	// if (!("H_totel_master" in global)) H_totel_master = undefined;
	// if (!("H_TelKousi" in global)) H_TelKousi = undefined;
	// if (!("EnableKousi" in global)) EnableKousi = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("dbh" in global)) dbh = undefined;
	// if (!("logh" in global)) logh = undefined;

	if (EnableKousi == false) //print "DEBUG_00: No permission for kousi\n";
		{
			return undefined;
		}

	if (undefined !== H_TelKousi[telno]) //公私分計しないのであれば、そこで終了
		//print "DEBUG_07: H_TelKousi, comhistbaseflg=". $comhistbaseflg ."\n";
		{
			if (H_TelKousi[telno] == -1) {
				return undefined;
			}

// 2022cvt_015
			var comhistbaseflg = H_TelKousi[telno];
		} else //tel_tb から kousiflg を得る
		//print "DEBUG_01: tel_kousiflg=". $tel_kousiflg .", and  pattern_id=". $pattern_id ."\n";
		//null だったら会社のデフォルト値を適用
		//公私分計ありと決定。ここで comhistbaseflg の公私パターン(A) を記録する
		{
// 2022cvt_015
			var sql = "select kousiptn, COALESCE(kousiflg,'(null)') as nkflag from tel_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID + " and telno='" + telno + "'";
// 2022cvt_015
			var H_result = await dbh.getHash(sql, true);

// 2022cvt_015
			for (var idx = 0; idx < H_result.length; idx++) //nullの場合は'(null)'と入る
			{
// 2022cvt_015
				var pattern_id = H_result[idx].kousiptn;
// 2022cvt_015
				var tel_kousiflg = H_result[idx].nkflag;
			}

			if (undefined !== tel_kousiflg == false || tel_kousiflg == "(null)") //print "DEBUG_02: default_kousiflg=". $default_kousiflg .", and  pattern_id=". $pattern_id ."\n";
				//kousiflg 公私分計フラグ(0:する、1:しない)
				//0: するなら、patternid を保持して処理を続ける
				{
					sql = "select kousiflg, patternid from kousi_default_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID;
					H_result = await dbh.getHash(sql, true);

					if (H_result.length == 0) //公私フラグをハッシュに登録、nullの代わりに-1とする
						{
							logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "kousi_default_tb が未設定です. telno=" + telno);
							H_TelKousi[telno] = -1;
							return undefined;
						}

					for (idx = 0; idx < H_result.length; idx++) {
// 2022cvt_015
						var default_kousiflg = H_result[idx].kousiflg;
						pattern_id = H_result[idx].patternid;
					}

					if (default_kousiflg == 0) //引き続き次の処理に持ち込みたいので、tel_kousiflgを書き換える
						{
							tel_kousiflg = 0;
						} else //if( $default_kousiflg == 1 )
						//nullの代わりに-1とする
						{
							H_TelKousi[telno] = -1;
							return undefined;
						}
				}

			if (tel_kousiflg == 0) //kousi_pattern_tb からフラグを取得
				//print "DEBUG_03: comhistflg=". $comhistflg .", and comhistbaseflg=". $comhistbaseflg ."\n";
				//通話記録を使用しないのであれば、処理終了。
				{
					sql = "select comhistflg, comhistbaseflg from kousi_pattern_tb where patternid=" + pattern_id + " and carid=" + FUSION_CARRIER_ID;
					H_result = await dbh.getHash(sql, true);

					for (idx = 0; idx < H_result.length; idx++) //comhistflg = 通話記録判定(0:使用しない、1:使用する)
					//未登録の通話明細を公私のどちらとみなすか(0:公、1:私、2:未登録), 公私パターンを記憶する。(A)
					{
// 2022cvt_015
						var comhistflg = H_result[idx].comhistflg;
						comhistbaseflg = H_result[idx].comhistbaseflg;
					}

					if (comhistflg == 0) //公私フラグをハッシュに登録、nullの代わりに-1とする
						{
							H_TelKousi[telno] = -1;
							return undefined;
						}
				} else //if( $tel_kousiflg == 1 )
				//公私フラグをハッシュに登録、nullの代わりに-1とする
				{
					H_TelKousi[telno] = -1;
					return undefined;
				}

			H_TelKousi[telno] = comhistbaseflg;
		}

	totelno = totelno.trim().replace(/-/g, "");

	if (totelno != "" && undefined !== H_totel_master[telno][totelno]) //あれば、マスターの値を用いる
		//print "DEBUG_04: found in H_totel_master, kousiflg=". $kousiflg ."\n";
		{
// 2022cvt_015
			var kousiflg = H_totel_master[telno][totelno];
		} else //print "DEBUG_06: comhistbaseflg base, kousiflg=". $kousiflg ."\n";
		{
			if (totelno != "") //「未登録」で kousi_totel_master に電話を登録する。
				//公私分計フラグ(0:公、1:私、2:未登録)
				//同一の登録を行わないように、かけ先マスターに追加登録する
				//2:未登録
				//print "DEBUG_05: kousi_totel_master: totelno=". $totelno ."\n";
				{
					A_totelFileData.push(pactid + "\t" + telno + "\t" + FUSION_CARRIER_ID + "\t" + totelno + "\t" + "2" + "\n");

					if (undefined !== H_totel_master[telno] == false) {
						H_totel_master[telno] = Array();
					}

					H_totel_master[telno][totelno] = 2;
				}

			kousiflg = comhistbaseflg;
		}

	return kousiflg;
};

function doBackup(db: ScriptDB) //commhistory_X_tb をエクスポートする
//kousi_totel_master_tb をエクスポートする
{
	// if (!("commhistory_tb" in global)) commhistory_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var day = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("");
	db.begin();
// 2022cvt_015
	var sql = "select * from " + commhistory_tb;
// 2022cvt_015
	var filename = DATA_EXP_DIR + "/" + commhistory_tb + day + ".exp";

	if (expDataByCursor(sql, filename, db.m_db) != 1) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + "のデータエクスポートに失敗しました.");
			db.rollback();
			throw process.exit(1);// 2022cvt_009
		}

	db.commit();
	db.begin();
	sql = "select * from kousi_totel_master_tb";
	filename = DATA_EXP_DIR + "/" + "kousi_totel_master_tb" + day + ".exp";

	if (expDataByCursor(sql, filename, db.m_db) != 1) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "kousi_totel_master_tbのデータエクスポートに失敗しました.");
			db.rollback();
			throw process.exit(1);// 2022cvt_009
		}

	db.commit();
	return 0;
};

	async function doDelete(A_pactDone: any[], db: ScriptDB) //commhistory_X_tb から削除する
//delete失敗した場合
//未登録電話のみ削除する
//delete失敗した場合
{
	// if (!("commhistory_tb" in global)) commhistory_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
// 2022cvt_015
	var sql_str = "delete from " + commhistory_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid = " + FUSION_CARRIER_ID;
// 2022cvt_015
	var rtn = await db.query(sql_str, false);

// 2022cvt_016
	if (db.isError())
	// if ("object" === typeof rtn == true) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + "のデリートに失敗しました、");
			db.rollback();
			throw process.exit(1);// 2022cvt_009
		}

	sql_str = "delete from kousi_totel_master_tb where pactid in (" + A_pactDone.join(",") + ") and carid = " + FUSION_CARRIER_ID + " and kousiflg = '2'";
	rtn = await db.query(sql_str, false);

// 2022cvt_016
	if (db.isError())
	// if ("object" === typeof rtn == true) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "kousi_totel_master_tb のデリートに失敗しました、");
			db.rollback();
			throw process.exit(1);// 2022cvt_009
		}

	return 0;
};

	async function doImportComm(commhistoryFile: string, db: ScriptDB) //commhistory_XX_tbへのインポート
{
	// if (!("commhistory_tb" in global)) commhistory_tb = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("logh" in global)) logh = undefined;

	if (fs.statSync(commhistoryFile).size > 0) {
	// if (filesize(commhistoryFile) > 0) {
// 2022cvt_016
// 2022cvt_015
		var commhistory_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "time", "charge", "carid", "kousiflg"];

		if (await doCopyInsert(commhistory_tb, commhistoryFile, commhistory_col, db) != 0) //ロールバック
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + " のインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + " のインポート完了.");
		}
	}

	return 0;
};

	async function doImportTotel(totelmasterFile: string, db: ScriptDB) //kousi_totel_master_tbへのインポート
{
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("logh" in global)) logh = undefined;

	if (fs.statSync(totelmasterFile).size > 0) {
	// if (filesize(totelmasterFile) > 0) {
// 2022cvt_015
		var totel_col = ["pactid", "telno", "carid", "totelno", "kousiflg"];

		if (await doCopyInsert("kousi_totel_master_tb", totelmasterFile, totel_col, db) != 0) //ロールバック
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "kousi_totel_master_tb のインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "kousi_totel_master_tb のインポート完了.");
		}
	}

	return 0;
};

	async function doCopyInsert(table: string, filename: string, columns: Array<any>, db: ScriptDB) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	// if (!("logh" in global)) logh = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(filename, "utf8");
	} catch (e) {
		logh.putError(G_SCRIPT_ERROR, filename + "のファイルオープン失敗.");
		return 1;
	}
	var text = Encoding.convert(buffer, {
		from: "SJIS",
		to: "UNICODE",
		type: "string"
	});
	var lines = text.toString().split("\r\n");
	// var fp = fopen(filename, "rt");

// 2022cvt_015
	var ins = new TableInserter(log_listener, db, filename + ".sql", true);
	ins.begin(table);

	for (var line of lines)
	// while (line = fgets(fp)) //データはtab区切り
	//インサート行の追加
	{
// 2022cvt_015
		var A_line = line.split("\t");
		// var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) //要素数が異なっていたら
			{
				logh.putError(G_SCRIPT_ERROR, filename + "のデータ数が設定と異なります。(" + A_line.length + "!=" + columns.length + "), データ=" + line);
				// fclose(fp);
				return 1;
			}

// 2022cvt_015
		var H_ins = {};
// 2022cvt_015
		var idx = 0;

// 2022cvt_015
		for (var col of columns) {
			if (A_line[idx] != "\\N") //\N の場合はハッシュに追加しない
				{
					H_ins[col] = A_line[idx];
				}

			idx++;
		}

		if (await ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_ERROR, filename + "のインサート中にエラー発生、データ=" + line);
			// fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_ERROR, filename + "のインサート処理に失敗.");
		// fclose(fp);
		return 1;
	}

	// fclose(fp);
	return 0;
};

// function doCopyExp(sql: string, filename: string, db: ScriptDB) //一度にFETCHする行数
// //ファイルを開く
// {
// 	// if (!("logh" in global)) logh = undefined;
// // 2022cvt_015
// 	var NUM_FETCH = 100000;
// // 2
// 	var fp;
// 	try {
// 		fp = fs.openSync(filename, "wt");
// 	} catch (e) {
// 		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
// 		return 1;
// 	}
// 	// var fp = fopen(filename, "wt");

// 	db.query("DECLARE exp_cur CURSOR FOR " + sql);

// 	for (; ; ) //ＤＢから１行ずつ結果取得
// 	{
// // 2022cvt_015
// 		var result = pg_query(db.m_db.connection, "FETCH " + NUM_FETCH + " IN exp_cur");

// 		if (result == undefined) {
// 			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Fetch error, " + sql);
// 			fs.closeSync(fp);
// 			// fclose(fp);
// 			return 1;
// 		}

// 		var A_line = pg_fetch_array(result)
// 		if (A_line == undefined) //ループ終了
// 			{
// 				break;
// 			}

// // 2022cvt_015
// 		var str = "";

// 		do //データ区切り記号、初回のみ空
// 		{
// // 2022cvt_015
// 			var delim = "";

// // 2022cvt_015
// 			for (var item of A_line) //データ区切り記号
// 			{
// 				str += delim;
// 				delim = "\t";

// 				if (item == undefined) //nullを表す記号
// 					{
// 						str += "\\N";
// 					} else {
// 					str += item;
// 				}
// 			}

// 			str += "\n";
// 		} while (A_line = pg_fetch_array(result));

// 		try {
// 			fs.writeSync(fp, str);
// 		} catch (e) {
// 			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "への書き込み失敗、" + str);
// 			fs.closeSync(fp);
// 			// fclose(fp);
// 			return 1;
// 		}
// 	}

// 	db.query("CLOSE exp_cur");
// 	fs.closeSync(fp);
// 	// fclose(fp);
// 	return 0;
// };

function finalData(pactid: string, pactDir: string, finDir: fs.PathLike) //同名のファイルが無いか
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("billdate" in global)) billdate = undefined;

// 2022cvt_028
	if (fs.statSync(finDir).isFile()) {
	// if (is_file(finDir) == true) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + finDir + "はディレクトリではありません.");
		return 1;
	}

	if (fs.existsSync(finDir) == false) //なければ作成する// 2022cvt_003
		{
			try {
				fs.mkdirSync(finDir);
			} catch (e) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "異動先の" + finDir + "が作成できなかった.");
				return 1;
			}
		}

// 2022cvt_015
	var retval = 0;
// 2022cvt_015
	var dirh = fs.readdirSync(pactDir);
	// var dirh = openDir(pactDir);// 2022cvt_004

	for (var fname of dirh) {
	// while (fname = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_015
		var fpath = pactDir + "/" + fname;

// 2022cvt_028
		if (fs.statSync(fpath).isFile())
		// if (is_file(fpath)) //ファイル名が適合するものだけ
			{
// 2022cvt_019
				if (fname.match(FUSION_PAT))
				// if (preg_match(FUSION_PAT, fname)) //ファイル移動
					{
						try {
							fs.renameSync(fpath, finDir + "/" + fname);
						} catch (e) {
							logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "の異動失敗.");
							retval = 1;
						}
					}
			}

// 		clearstatcache();// 2022cvt_012
	}

	// closedir(dirh);
	return retval;
};

function usage(comment: string, db: ScriptDB) //ロック解除
{
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N}\n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n\n");
	lock(false, db);
	throw process.exit(1);// 2022cvt_009
};

	async function lock(is_lock: boolean, db: ScriptDB) //ロックする
{
	if (db == undefined) {
		return false;
	}

// 2022cvt_015
	var pre = "batch";

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
// 2022cvt_015
			var sql = "select count(*) from clamptask_tb " + "where command like '" + db.escape(pre + "%") + "' and " + "status = 1;";
// 2022cvt_015
			var count = await db.getOne(sql);

			if (count != 0) {
				db.rollback();
				return false;
			}

// 2022cvt_015
			var nowtime = getTimestamp();
			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + db.escape(pre + "_" + SCRIPTNAME) + "', 1, '" + nowtime + "');";
			db.query(sql);
			db.commit();
		} else {
		db.begin();
		db.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + db.escape(pre + "_" + SCRIPTNAME) + "';";
		db.query(sql);
		db.commit();
	}

	return true;
};

function getTimestamp() {
	var tm = new Date();
	// var tm = localtime(Date.now() / 1000, true);
// 2022cvt_015
	var yyyy = tm.getFullYear();
	// var yyyy = tm.tm_year + 1900;
// 2022cvt_015
	var mm = (tm.getMonth() + 1).toString();
	// var mm = tm.tm_mon + 1;
	if (mm.length == 1) {
		mm = "0" + mm;
	}
	// if (mm < 10) mm = "0" + mm;
// 2022cvt_015
	var dd = (tm.getDate() + 0).toString();
	// var dd = tm.tm_mday + 0;
	if (dd.length == 1) {
		dd = "0" + dd;
	}
	// if (dd < 10) dd = "0" + dd;
// 2022cvt_015
	var hh = (tm.getHours() + 0).toString();
	// var hh = tm.tm_hour + 0;
	if (hh.length == 1) {
		hh = "0" + hh;
	}
	// if (hh < 10) hh = "0" + hh;
// 2022cvt_015
	var nn = (tm.getMinutes() + 0).toString();
	// var nn = tm.tm_min + 0;
	if (nn.length == 1) {
		nn = "0" + nn;
	}
	// if (nn < 10) nn = "0" + nn;
// 2022cvt_015
	var ss = (tm.getSeconds() + 0).toString();
	if (ss.length == 1) {
		ss = "0" + ss;
	}
	// var ss = tm.tm_sec + 0;
	// if (ss < 10) ss = "0" + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};
})();
