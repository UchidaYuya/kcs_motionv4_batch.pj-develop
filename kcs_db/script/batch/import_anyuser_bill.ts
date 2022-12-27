//===========================================================================
//機能：請求情報ファイルインポートプロセス（エニーユーザー専用）
//
//作成：中西	2007/01/24	初版作成
//===========================================================================

// error_reporting(E_ALL);// 2022cvt_011

// 2022cvt_026
// require("lib/script_db.php");
import TableNo, { ScriptDB, TableInserter } from "../batch/lib/script_db";

// 2022cvt_026
// require("lib/script_log.php");
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_DEBUG, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../batch/lib/script_log";

import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as PATH from "path";
import * as flock from "proper-lockfile";

(async () => {
const SCRIPT_NAMEJ = "エニーユーザー請求情報ファイルインポート";
const SCRIPTNAME = "import_anyuser_bill.php";

const ANYFU_DIR = "/anyfu/bill";
const ANY_PAT = "/^any_[^_]*_.*\\.(csv|txt)$/";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const ANY_CARRIER_ID = 13;
const ANY_CIRCUIT_ID = 29;
// 2022cvt_015
var H_Zei_CODE = {
	0: "非課税",
	1: "課税",
	2: "対象外"
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
var year = 0;
var month = 0;
var billdate = "";
var pactid_in = "";
var backup = "";
var mode = "";
var A_codes = Array();

// 2022cvt_015
for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
{
	if (process.argv[cnt].match(/^-e=/))
	// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
		{
// 2022cvt_015
			mode = process.argv[cnt].replace(/^-e=/, "").toLowerCase();
			// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!mode.match(/^[ao]$/)) {
			// if (ereg("^[ao]$", mode) == false) {
				usage("ERROR: モードの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match(/^-y=/))
	// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		{
// 2022cvt_015
			billdate = process.argv[cnt].replace(/^-y=/, "");
			// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

			if (!billdate.match(/^[0-9]{6}$/)) {
			// if (ereg("^[0-9]{6}$", billdate) == false) {
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
				{
// 2022cvt_015
					year = parseInt(billdate.substring(0, 4));
// 2022cvt_015
					month = parseInt(billdate.substring(4, 2));

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
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

	if (process.argv[cnt].match(/^-p=/))
	// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		{
// 2022cvt_015
			pactid_in = process.argv[cnt].replace(/^-p=/, "").toLowerCase();
			// var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!pactid_in.match(/^all$/) && !pactid_in.match(/^[0-9]+$/)) {
			// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
				usage("ERROR: 契約ＩＤの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match(/^-b=/))
	// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		{
// 2022cvt_015
			backup = process.argv[cnt].replace(/^-b=/, "").toLowerCase();
			// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!backup.match(/[ny]$/)) {
			// if (ereg("^[ny]$", backup) == false) {
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

	usage("", dbh);
}

// 2022cvt_015
var dataDir = DATA_DIR + "/" + billdate + ANYFU_DIR;

if (fs.existsSync(dataDir) == false) {// 2022cvt_003
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません.");
}

// 2022cvt_015
var A_pactid = Array();
// 2022cvt_015
var A_pactDone = Array();

if (pactid_in == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{
// 2022cvt_015
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

// 2022cvt_016
// 2022cvt_015
var sql = "select ut.code, ut.name, ut.taxtype, kr.kamokuid from utiwake_tb ut ";
sql += "inner join kamoku_rel_utiwake_tb kr on ut.code=kr.code where ut.carid=" + ANY_CARRIER_ID;
// 2022cvt_015
var H_result = await dbh.getHash(sql, true);
var H_utiwake = Array();

for (cnt = 0; cnt < H_result.length; cnt++) //内訳コード => 内訳内容
{
// 2022cvt_015
	var code = H_result[cnt].code;
	H_utiwake[code] = H_result[cnt];
}

// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var telX_tb = "tel_" + tableNo + "_tb";
// 2022cvt_015
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
// 2022cvt_015
var file_teldetails = dataDir + "/" + teldetailX_tb + "_anyuser" + billdate + pactid_in + ".ins";
// 2022cvt_015
var fp_teldetails;
try {
	fp_teldetails = fs.openSync(file_teldetails, "w");
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "の書き込みオープン失敗.");
	throw process.exit(1);// 2022cvt_009
}
// var fp_teldetails = fopen(file_teldetails, "w");

sql = "select pactid,compname from pact_tb order by pactid";
H_result = await dbh.getHash(sql, true);
// 2022cvt_015
var pactCnt = H_result.length;
var H_pactid = Array();

for (cnt = 0; cnt < pactCnt; cnt++) //pactid => 会社名
{
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

pactCnt = A_pactid.length;
A_pactid.sort();
// 2022cvt_015
var targetFileCnt = 0;
var A_delData = Array();

var _static_doTelRecord_prev_tel = ""

for (cnt = 0; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
//請求データファイル名を取得する
//処理するファイル名一覧
//請求データファイルがなかった場合
//対象データファイルの数を数える
//現在の電話番号マスター作成
//請求月電話番号マスター作成
//各請求番号・ファイルについての処理 -- ここが読み込みの中心処理
//ファイル毎のデータを保存する
//計算処理後の詳細データ
//削除対象となるデータ
//$A_telData  = array();	// telは不要
//$A_telXData = array();	// telXは不要
//ファイルごとの処理
//END ファイルごとの処理
//電話番号ごとの集計計算を行う。結果は A_calcData に反映
//ファイル毎のデータをクリアーする
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
	var dataDirPact = dataDir + "/" + pactid;

	var dirh = fs.readdirSync(dataDirPact);
	// dirh = openDir(dataDirPact);// 2022cvt_004
// 2022cvt_015
	var target_files: string[] = Array();

	for (var fileName of dirh) {
	// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
		if (fs.statSync(dataDirPact + "/" + fileName).isFile())
		// if (is_file(dataDirPact + "/" + fileName) == true) //ファイル名が適合するものだけ
			{
// 2022cvt_019
				if (fileName.match(ANY_PAT))
				// if (preg_match(ANY_PAT, fileName)) //ファイル名から処理年月日を得る -- any_[請求コード]_[請求年月].(csv|txt)
					//アンダースコア'_'区切りの３番目
					{
// 2022cvt_015
						var path = PATH.parse(fileName + ".csv");
						var path2 = PATH.parse(path.name + ".txt");
						var fname_array = path2.base.split("_");
						// var fname_array = split("_", basename(basename(fileName, ".csv"), ".txt"));
// 2022cvt_015
						var YYYYMM = fname_array[2];

						if (YYYYMM != billdate) //print "DEBUG: $YYYYMM != $billdate \n";
							{
								logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "ファイル名の日付と指定した年月が一致しません、" + dataDirPact + "/" + fileName + "は処理されませんでした.");
								continue;
							}

						target_files.push(fileName);
					} else {
					logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + "は処理されませんでした.");
				}
			}

// 		clearstatcache();// 2022cvt_012
	}

	if (target_files.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "の請求データファイルが見つかりません.");
			// closedir(dirh);
			continue;
		}

	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "処理対象となるファイル：" + target_files.join(","));
	// closedir(dirh);
	targetFileCnt++;
// 2022cvt_015
	var A_telno = Array();
	sql = "select telno from tel_tb where pactid=" + pactid + " and carid=" + ANY_CARRIER_ID;

// 2022cvt_015
	for (var data of await dbh.getHash(sql, true)) {
		A_telno.push(data.telno);
	}

// 2022cvt_015
	var A_telnoX = Array();
	sql = "select telno from " + telX_tb + " where pactid=" + A_pactid[cnt] + " and carid=" + ANY_CARRIER_ID;

// 2022cvt_015
	for (var data of await dbh.getHash(sql, true)) {
		A_telnoX.push(data.telno);
	}

// 2022cvt_015
	var A_fileData = Array();
// 2022cvt_015
	var A_calcData = Array();
// 2022cvt_015
	A_delData = Array();
// 2022cvt_015
	var errFlag = false;

// 2022cvt_015
	for (var fileName of target_files) //print "ファイル名=" . $fileName . "\n";
	//読込処理開始
	//読込電話件数
	//読込明細件数
	//$AddTelCnt = 0;		// 追加する電話数	// 電話追加は無し
	//$AddTelXCnt = 0;	// 追加する電話数	// 電話追加は無し
	//. ":追加電話件数(tel_tb)=" . $AddTelCnt . ":追加電話件数(". $telX_tb .")=" . $AddTelXCnt );
	{
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理開始.");
// 2022cvt_015
		var ReadTelCnt = 0;
// 2022cvt_015
		var ReadMeisaiCnt = 0;
// 2022cvt_015
		var rtn = doEachFile(dataDirPact + "/" + fileName, pactid, billdate, A_fileData, dbh);

		if (rtn == 1) //エラーがあったらそこで中断.
			{
				errFlag = true;
				break;
			} else if (rtn == 2) //エラーだが処理を続行
			{
				errFlag = true;
			}

		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理完了:電話件数=" + ReadTelCnt + ":明細件数=" + ReadMeisaiCnt);
	}

	if (errFlag == true) //ファイル処理で失敗していたら
		//そのまま抜ける
		{
			continue;
		}

	target_files = [];
	// delete target_files;

	if (await doCalc(pactid, A_fileData, dbh) != 0) //エラーがあったらそこで中断.
		{
			errFlag = true;
			break;
		}

	A_fileData = Array();

	if (errFlag == false) //ファイルに書き出す
		//writeTelData( $pactid );	// telは不要
		//fflush($fp_tel);	// telは不要
		//fflush($fp_telX);	// telXは不要
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "データ書出処理開始.");

			if (writeInsFile(pactid, A_calcData) == 1) //次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "ファイルの書き出しに失敗.");
					continue;
				}

			// fflush(fp_teldetails);
			A_pactDone.push(pactid);
		}
}

fs.closeSync(fp_teldetails);
// fclose(fp_teldetails);

if (targetFileCnt == 0) //２重起動ロック解除
	//終了メッセージ
	{
		lock(false, dbh);
		logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
		throw process.exit(0);// 2022cvt_009
	}

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

logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理開始.");

if (mode == "o") //前回のデータを削除する
	{
		doDelete(A_pactDone, dbh);
	}

doDeleteDup(A_delData, dbh);
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理完了.");
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理開始.");
doImport(file_teldetails, dbh);
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

function doEachFile(fileName: string, pactid: number, billdate: string, A_fileData: Array<any>, db: ScriptDB) //エラーだが処理を継続するためのフラグ
//ファイルオープン
//ファイルの全合計
//電話ごとの合計
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
// 2022cvt_015
	var error_flag = false;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(fileName, "utf8");
	} catch (e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のオープン失敗.");
		return 1;
	}
	var text = Encoding.convert(buffer, {
		from: 'SJIS',
		to: 'UNICODE',
		type: 'string'
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
	var TotalUp = 0;
// 2022cvt_015
	var tel_sum = { "value": 0 };

	for (var line of lines)
	// while (line = fgets(fp)) //改行取り
	//カンマ区切りで分割.
	//-- DEBUG -- * 表示してみる
	//print "**** Record **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//レコード数のチェック
	{
		// if (feof(fp) && line == "") //おしまい.
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

		if (record.length != 6) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のレコード数が異常(" + record.length + "!= 6). line=\"" + line + "\"");
			flock.unlockSync(fileName);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return 1;
		}

// 2022cvt_015
		var rtn = doTelRecord(record, pactid, A_fileData, tel_sum);

		if (rtn == 1) {
			flock.unlockSync(fileName);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return 1;
		} else if (rtn == 2) //エラーだが処理を継続する
			{
				error_flag = true;
			}
	}

	flock.unlockSync(fileName);
	// flock(fp, LOCK_UN);
	// fclose(fp);

	if (error_flag) //途中でエラーがあったかどうか
		{
			return 2;
		}

	return 0;
};

function doTelRecord(record: any[], pactid: string | number, A_fileData: any[], sum: { [key: string]: number }) //請求先番号
//読込電話件数
//読込明細件数
//前回の電話番号.
//-- DEBUG -- * 表示してみる
//print "**** doTelRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//レコード内容はこうなっている
//電話番号, 請求コード, 請求項目名, 台数, 金額, 課税フラグ
//電話番号
//'-'ハイフンを除く
//record[2] // 請求項目名
//小数点で来ることもある
//明細データを配列に保持する.
//明細件数カウント.
{
	// if (!("H_utiwake" in global)) H_utiwake = undefined;
	// if (!("A_codes" in global)) A_codes = undefined;
	// if (!("ReadTelCnt" in global)) ReadTelCnt = undefined;
	// if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("_static_doTelRecord_prev_tel" in global)) _static_doTelRecord_prev_tel = "";
// 2022cvt_015
	var telno_view = record[0].trim();
// 2022cvt_015
	var telno = telno_view.replace(/-/g, "");

	if (telno != _static_doTelRecord_prev_tel && telno != "") //前回の電話番号と異なっていれば...
		//電話番号の存在チェック
		//読み込んだレコード数をカウントする.
		{
			if (checkTel(telno) != 0) //エラーだが処理継続
				{
					return 2;
				}

			_static_doTelRecord_prev_tel = telno;
			ReadTelCnt++;
		}

// 2022cvt_015
	var code = record[1].trim();
// 2022cvt_015
	var realcnt = record[3];

	if (!realcnt || realcnt == "") //消費税の場合、数量が設定されていない
		//nullを設定
		//$logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $billdate . LOG_DELIM
		//. "数量が設定されていません、telno=". $telno_view .", code=\"". $code ."\"\n" );
		//return 2;	// エラーだが処理を継続する
		{
			realcnt = "\\N";
		}

// 2022cvt_015
	var charge = record[4];

	if (undefined !== H_utiwake[code]) //print "DEBUG: ". $H_utiwake[$code]["name"] . ", " . $charge . " 円\n";
		//合計値を得る
		{
			sum.value += charge;
		} else //エラーだが処理を継続する
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な内訳コードです(" + code + ").");
			return 2;
		}

// 2022cvt_015
	var taxkubun = record[5];
// 2022cvt_015
	var A_meisai = [telno, code, realcnt, charge, taxkubun];
	A_fileData.push(A_meisai);
	ReadMeisaiCnt++;
	return 0;
};

function checkTel(telno: string) //電話番号マスター
//請求月電話番号マスター
//global $teltable;	// -t オプションの値
//global $AddTelCnt;		// 追加する電話数
//global $AddTelXCnt;		// 追加する電話数
//print "DEBUG: 電話番号: " . $telno . "\n";
//tel_tbの存在チェック
{
	// if (!("A_telno" in global)) A_telno = undefined;
	// if (!("A_telnoX" in global)) A_telnoX = undefined;
	// if (!("A_telData" in global)) A_telData = undefined;
	// if (!("A_telXData" in global)) A_telXData = undefined;
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid" in global)) pactid = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var telFlag = true;

	if (-1 !== A_telno.indexOf(telno) == false) //print "INFO: 電話は tel_tb に登録されていません\n";
		{
			telFlag = false;
		}

// 2022cvt_015
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

	if (telXFlag == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "電話番号(" + telno + ")は" + telX_tb + "に登録されていません.");
		return 1;
	}

	return 0;
};

	async function doCalc(pactid: string, A_fileData: any[], db: ScriptDB) //データが空のときは終了.
//電話番号（１回前の）
//各データを書き出す
{
	// if (!("A_calcData" in global)) A_calcData = undefined;
	// if (!("A_delData" in global)) A_delData = undefined;
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	if (A_fileData.length == 0) {
		return 0;
	}

	if (!A_fileData.sort(cmpfileData)) {
	// if (!A_fileData.sort("cmpfileData")) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "明細データの電話番号ソートに失敗しました.");
		return 1;
	}

// 2022cvt_015
	var telno = "";
	A_codes = Array();

// 2022cvt_015
	for (var data of A_fileData) //data : telno, code, realcnt, charge, taxkubun
	//print "DEBUG: ". $data[0] .", ". $data[1] .", ". $data[2] .", ". $data[3] .", ". $data[4] ."\n";
	//電話番号が変わったら（初回を含む）
	//電話番号を得る
	//課税フラグ
	//そのまま登録する
	//順序はコード番号/100という規則
	//もし既存のレコードが在れば
	{
		if (data[0] != telno) //既存の明細データを得る
			//print $sql . "\n";	// DEBUG
			//print_r( $A_codes );	// DEBUG
			{
				A_codes = Array();
// 2022cvt_015
				var sql = "select code from " + teldetailX_tb + " where pactid=" + pactid + " and carid=" + ANY_CARRIER_ID + " and telno='" + data[0] + "'";

// 2022cvt_015
				for (var row of await db.getHash(sql, true)) {
					A_codes.push(row.code);
				}
			}

		telno = data[0];
// 2022cvt_015
		var code = data[1];
// 2022cvt_015
		var realcnt = data[2];
// 2022cvt_015
		var charge = data[3];
// 2022cvt_015
		var taxkubun = data[4];
// 2022cvt_015
		var detailNo = +(code / 100);
// 2022cvt_015
		var A_meisai = [telno, code, realcnt, charge, taxkubun, detailNo];
		A_calcData.push(A_meisai);

		if (-1 !== A_codes.indexOf(code)) //既存のレコードを削除する
			//print "DEBUG: ". $data[0] .", ". $pactid .", ". $telno .", ". $code ."\n";
			{
				A_delData.push([pactid, telno, code]);
			}
	}

	return 0;
};

function cmpfileData(a: string, b: string) //data : telno, code, realcnt, charge, taxkubun
//先頭の telno で比較する
{
// 2022cvt_015
	var telA = a[0];
// 2022cvt_015
	var telB = b[0];

	if (telA == telB) {
		return 0;
	}

	return telA < telB ? -1 : 1;
};

function writeInsFile(pactid: string, A_calcData: any[]) //データが空のときは終了.
//現在の日付を得る
//各データを書き出す
{
	// if (!("H_utiwake" in global)) H_utiwake = undefined;
	// if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	// if (!("fp_teldetails" in global)) fp_teldetails = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	if (A_calcData.length == 0) {
		return 0;
	}

// 2022cvt_015
	var nowtime = getTimestamp();

// 2022cvt_015
	for (var data of A_calcData) //data : telno, code, realcnt, charge, taxkubun, detailNo
	//内訳コード.
	//内訳コード名
	//末尾の空白を除く
	//数量
	//金額
	//税区分
	//課税フラグ
	//表示順序
	//realcnt １回線あたりの端末台数
	{
// 2022cvt_015
		var telno = data[0];
// 2022cvt_015
		var ut_code = data[1];
// 2022cvt_015
		var ut_name = H_utiwake[ut_code].name;
		ut_name = ut_name.replace("\u3000 ", "");
		// ut_name = rtrim(ut_name, "\u3000 ");
// 2022cvt_015
		var realcnt = data[2];
// 2022cvt_015
		var charge = data[3];
// 2022cvt_015
		var taxkubun = H_Zei_CODE[data[4]];
// 2022cvt_015
		var detailNo = data[5];
		fs.writeFileSync(fp_teldetails, pactid + "\t" + telno + "\t" + ut_code + "\t" + ut_name + "\t" + charge + "\t" + taxkubun + "\t" + detailNo + "\t" + nowtime + "\t" + ANY_CARRIER_ID + "\t" + realcnt + "\n");// 2022cvt_006
	}

	return 0;
};

	async function doBackup(db: ScriptDB) //tel_details_X_tb をエクスポートする
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("")	+ ".exp";
// 2022cvt_015
	var sql = "select * from " + teldetailX_tb;
// 2022cvt_015
	var rtn = await db.backup(outfile, sql);

	if (rtn == false) //ロールバック
		//ロック解除
		//lock(false, $db);
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデータエクスポートに失敗しました.");
			db.rollback();
			throw process.exit(1);// 2022cvt_009
		}

	return 0;
};

function doDelete(A_pactDone: any[], db: ScriptDB) //delte失敗した場合
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var sql_str = "delete from " + teldetailX_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid=" + ANY_CARRIER_ID + " and code not in (" + "'300', " + "'400', " + "'800' " + ")";
// 2022cvt_015
	var rtn = db.query(sql_str, false);

// 2022cvt_016
	if (db.isError())
	// if ("object" === typeof rtn == true) //ロールバック
		//ロック解除
		//lock(false, $db);
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデリートに失敗しました、");
			db.rollback();
			throw process.exit(1);// 2022cvt_009
		}

	return 0;
};

function doDeleteDup(A_delData: any[], db: ScriptDB) //// 使用料を消去
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

// 2022cvt_015
	for (var A_data of A_delData) //print "DEBUG: " . $sql_str . "\n";
	//delte失敗した場合
	{
// 2022cvt_015
		var pact = A_data[0];
// 2022cvt_015
		var telno = A_data[1];
// 2022cvt_015
		var code = A_data[2];
// 2022cvt_015
		var sql_str = "delete from " + teldetailX_tb + " where pactid=" + pact + " and telno='" + telno + "'" + " and code='" + code + "'" + " and carid=" + ANY_CARRIER_ID;
// 2022cvt_015
		var rtn = db.query(sql_str, false);

// 2022cvt_016
		if (db.isError())
		// if ("object" === typeof rtn == true) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデリートに失敗しました、");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			}
	}

	return 0;
};

	async function doImport(file_teldetails: string, db: ScriptDB) //teldetailX_tbへのインポート
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	if (fs.statSync(file_teldetails).size > 0) {
	// if (filesize(file_teldetails) > 0) {
// 2022cvt_015
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "realcnt"];

		if (await doCopyInsert(teldetailX_tb, file_teldetails, teldetailX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " のインポート完了");
		}
	} else //ファイルサイズが０？
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "のファイルサイズが０です.");
			return 1;
		}

	return 0;
};

	async function doCopyInsert(table: string, filename: string, columns: string[], db: ScriptDB) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(fileName, "utf8");
	} catch (e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
		return 1;
	}
	var text = Encoding.convert(buffer, {
		from: 'SJIS',
		to: 'UNICODE',
		type: 'string'
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
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のデータ数が設定と異なります。(" + A_line.length + "!=" + columns.length + "), データ=" + line);
				// fclose(fp);
				return 1;
			}

// 2022cvt_015
		var H_ins: { [key: string]: any } = {};
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
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート中にエラー発生、データ=" + line);
			// fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート処理に失敗.");
		// fclose(fp);
		return 1;
	}

	// fclose(fp);
	return 0;
};

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
				if (fname.match(ANY_PAT))
				// if (preg_match(ANY_PAT, fname)) //ファイル移動
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

	async function lock(is_lock: boolean, db: ScriptDB | undefined) //ロックする
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
			var sql = "select count(*) from clamptask_tb " + "where command = '" + db.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
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
// 2022cvt_015
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
	// var ss = tm.tm_sec + 0;
	if (ss.length == 1) {
		ss = "0" + ss;
	}
	// if (ss < 10) ss = "0" + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};
})();
