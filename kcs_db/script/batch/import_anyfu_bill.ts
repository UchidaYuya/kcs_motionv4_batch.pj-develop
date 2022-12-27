//===========================================================================
//機能：請求情報ファイルインポートプロセス（エニーユーザーFUSION専用）
//
//作成：中西	2007/01/16	初版作成
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

import * as lockfile from "proper-lockfile";
import { URL } from "url";

(async () => {
const SCRIPT_NAMEJ = "エニーユーザーFUSION請求情報ファイルインポート";
const SCRIPTNAME = "import_anyfu_bill.php";

const ANYFU_DIR = "/anyfu/bill";
const ANYFU_PAT = "/^fcc_inv_.*_seikyumr\\.(csv|txt)$/";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const PRE_DUMMY_TEL = "ANY";
const DUMMY_TEL_LENG = 11;
const FUSION_CARRIER_ID = 11;
const ANY_CARRIER_ID = 13;
const ANY_CIRCUIT_ID = 29;
const IS_HIKAZEI = "非課税";
const TAX_KAZEI = "課税";
const TAX_HIKAZEI = "非課税";
const OUT_CODE_DOMES = 300;
const OUT_CODE_INTER = 400;
// 2022cvt_015
var H_special_kamoku = {
	"41-65": 800
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

var _static_doTelRecord_prev_tel = "";
var _static_getDummyTel_H_DummyCache = Array();

if (process.argv.length != 6 + 1)
// if (_SERVER.argv.length != 6) //数が正しくない
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

	if (process.argv[cnt].match(/^-p=/))
	// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		{
// 2022cvt_015
			pactid_in = process.argv[cnt].replace("^-p=", "").toLowerCase();
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
			backup = process.argv[cnt].replace("^-b=", "").toLowerCase();
			// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!backup.match(/-[ny]$/)) {
			// if (ereg("^[ny]$", backup) == false) {
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match(/^-t=/))
	// if (ereg("^-t=", _SERVER.argv[cnt]) == true) //今月のデータかどうかのチェック
		{
// 2022cvt_015
			var teltable = process.argv[cnt].replace("^-t=", "").toLowerCase();
			// var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!teltable.match(/^[no]$/)) {
			// if (ereg("^[no]$", teltable) == false) {
				usage("ERROR: 今月のデータかどうかの指定が不正です", dbh);
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

		for (var fileName of dirh) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
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
sql += "inner join kamoku_rel_utiwake_tb kr on ut.code=kr.code where ut.carid=" + FUSION_CARRIER_ID;
// 2022cvt_015
var H_result = await dbh.getHash(sql, true);
var H_utiwake: Array<any> = [];

for (cnt = 0; cnt < H_result.length; cnt++) //内訳コード => 内訳内容
{
// 2022cvt_015
	var code = H_result[cnt].code;
	H_utiwake[code] = H_result[cnt];
}

sql = "select ut.code, ut.name from utiwake_tb ut ";
sql += "inner join kamoku_rel_utiwake_tb kr on ut.code=kr.code where ut.carid=" + ANY_CARRIER_ID;
H_result = await dbh.getHash(sql, true);

var H_utiwake_ANY: Array<any> = [];
for (cnt = 0; cnt < H_result.length; cnt++) //内訳コード => 内訳内容
{
	code = H_result[cnt].code;
	H_utiwake_ANY[code] = H_result[cnt];
}

sql = "select code, sumflag from utiwake_agent_tb where carid=" + ANY_CARRIER_ID + " and carsrc=" + FUSION_CARRIER_ID;
H_result = await dbh.getHash(sql, true);

var H_sumflag: Array<any> = [];
for (cnt = 0; cnt < H_result.length; cnt++) //内訳コード => 内訳内容
{
	code = H_result[cnt].code;
	H_sumflag[code] = H_result[cnt].sumflag;
}

sql = "select arid from area_tb where carid=" + ANY_CARRIER_ID;
// 2022cvt_015
var ANY_AREA_ID = dbh.getOne(sql, true);
// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var telX_tb = "tel_" + tableNo + "_tb";
// 2022cvt_015
var postX_tb = "post_" + tableNo + "_tb";
// 2022cvt_015
var postrelX_tb = "post_relation_" + tableNo + "_tb";
// 2022cvt_015
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
// 2022cvt_015
var file_teldetails = dataDir + "/" + teldetailX_tb + "_anyfu" + billdate + pactid_in + ".ins";
// 2022cvt_015
var fp_teldetails;
try {
	fp_teldetails = fs.openSync(file_teldetails, "w");
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "の書き込みオープン失敗.");
	throw process.exit(1);// 2022cvt_009
}
// var fp_teldetails = fopen(file_teldetails, "w");

// 2022cvt_015
var file_tel = dataDir + "/" + "tel_tb" + billdate + pactid_in + ".ins";
// 2022cvt_015
var fp_tel;
try {
	fp_tel = fs.openSync(file_tel, "w");
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_tel + "の書き込みオープン失敗.");
	throw process.exit(1);// 2022cvt_009
}
// var fp_tel = fopen(file_tel, "w");

// 2022cvt_015
var file_telX = dataDir + "/" + telX_tb + billdate + pactid_in + ".ins";
// 2022cvt_015
var fp_telX;
try {
	fp_telX = fs.openSync(file_telX, "w");
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "の書き込みオープン失敗.");
	throw process.exit(1);// 2022cvt_009
}
// var fp_telX = fopen(file_telX, "w");

sql = "select pactid,compname from pact_tb order by pactid";
H_result = await dbh.getHash(sql, true);
// 2022cvt_015
var pactCnt = H_result.length;

var H_pactid: Array<any> = [];
for (cnt = 0; cnt < pactCnt; cnt++) //pactid => 会社名
{
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

pactCnt = A_pactid.length;
A_pactid.sort();

for (cnt = 0; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
//請求データファイル名を取得する
//処理するファイル名一覧
//請求データファイルがなかった場合
//bill_prtel_tb より請求先番号を得る
//親番号チェックフラグの初期化
//現在の電話番号マスター作成
//請求月電話番号マスター作成
//各請求番号・ファイルについての処理 -- ここが読み込みの中心処理
//ファイル毎のデータを保存する
//計算処理後の詳細データ
//ファイルごとの処理
//END ファイルごとの処理
//電話番号ごとの集計計算を行う。結果は A_calcData に反映
//ファイル毎のデータをクリアーする
//親番号が含まれていたかどうかの判定
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
// 2022cvt_015
	var target_files: string[] = Array();

	var dirh = fs.readdirSync(dataDirPact);
		// dirh = openDir(dataDirPact);// 2022cvt_004

	for (var fileName of dirh) {
	// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
		if (fs.statSync(dataDirPact + "/" + fileName).isFile())
		// if (is_file(dataDirPact + "/" + line) == true) //ファイル名が適合するものだけ
			{
// 2022cvt_019
				if (fileName.match(ANYFU_PAT))
				// if (preg_match(ANYFU_PAT, line)) //ファイル名から処理年月日を得る -- fcc_inv_YYYYMMDD_seikyumr.(csv|txt)
					//アンダースコア'_'区切りの３番目
					{
// 2022cvt_015
						var path = PATH.parse(fileName + ".csv");
						var path2 = PATH.parse(path.name + ".txt");
						var fname_array = path2.base.split("_");
						// var fname_array = split("_", basename(basename(line, ".csv"), ".txt"));
// 2022cvt_015
						var YYYYMM = fname_array[2].substring(0, 6);

						if (YYYYMM != billdate) {
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

	if (target_files.length == 0) //たとえ請求データファイルが無くてもデータ消去する
		//これは後でgen_anyuser を行ったときに重複データができないようにするため。
		//成功したpactとして扱う
		//次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "の請求データファイルが見つかりません.");
			// closedir(dirh);
			A_pactDone.push(pactid);
			continue;
		}

	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "処理対象となるファイル：" + target_files.join(","));
	// closedir(dirh);
// 2022cvt_015
	var A_codes = Array();
	sql = "select prtelno from bill_prtel_tb where pactid=" + pactid + " and carid=" + ANY_CARRIER_ID;
	H_result = await dbh.getHash(sql, true);

// 2022cvt_015
	for (var idx = 0; idx < H_result.length; idx++) {
		A_codes.push(H_result[idx].prtelno);
	}

	if (A_codes.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "についての請求先番号がbill_prtel_tbに見つかりません.");
			continue;
		}

// 2022cvt_015
	var PrTelFlag = false;
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
	var A_telData = Array();
// 2022cvt_015
	var A_telXData = Array();
// 2022cvt_015
	var errFlag = false;

// 2022cvt_015
	for (var fileName of target_files) //print "ファイル名=" . $fileName . "\n";
	//読込処理開始
	//読込電話件数
	//読込明細件数
	//追加する電話数
	//追加する電話数
	{
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理開始.");
// 2022cvt_015
		var ReadTelCnt = 0;
// 2022cvt_015
		var ReadMeisaiCnt = 0;
// 2022cvt_015
		var AddTelCnt = 0;
// 2022cvt_015
		var AddTelXCnt = 0;
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

		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "v" + ReadTelCnt + ":明細件数=" + ReadMeisaiCnt + ":追加電話件数(tel_tb)=" + AddTelCnt + ":追加電話件数(" + telX_tb + ")=" + AddTelXCnt);
	}

	if (errFlag == true) //ファイル処理で失敗していたら
		//そのまま抜ける
		{
			continue;
		}

	target_files = [];
	// delete target_files;

	if (doCalc(pactid, A_fileData) != 0) //エラーがあったらそこで中断.
		{
			errFlag = true;
			break;
		}

	A_fileData = Array();

	if (PrTelFlag == false && mode == "o") //上書き時のみチェック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "親番号が登録されていませんでした.");
			errFlag = true;
		}

	if (errFlag == false) //ファイルに書き出す
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "データ書出処理開始.");
			writeTelData(pactid);

			if (writeInsFile(pactid, A_calcData) == 1) //次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "ファイルの書き出しに失敗.");
					continue;
				}

			// fflush(fp_teldetails);
			// fflush(fp_tel);
			// fflush(fp_telX);
			A_pactDone.push(pactid);
		}
}

fs.closeSync(fp_teldetails);
// fclose(fp_teldetails);
fs.closeSync(fp_tel);
// fclose(fp_tel);
fs.closeSync(fp_telX);
// fclose(fp_telX);

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
doImport(file_tel, file_telX, file_teldetails, dbh);
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

function doEachFile(fileName: string, pactid: string, billdate: string, A_fileData: any[], db: ScriptDB) //エラーだが処理を継続するためのフラグ
//ファイルオープン
//ファイルの全合計
//電話ごとの合計
{
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

	if (lockfile.checkSync(fileName)) {
	// if (flock(fp, LOCK_SH) == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のロックに失敗.");
		// fclose(fp);
		return 1;
	}
	lockfile.lockSync(fileName);

// 2022cvt_015
	var TotalUp = 0;
// 2022cvt_015
	var tel_sum = { "value": 0 };

	for (var line of lines) //改行取り
	//カンマ区切りで分割.
	//-- DEBUG -- * 表示してみる
	//print "**** Record **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//レコード数のチェック
	//番号.サービス名
	//番号.料金内訳名
	//０詰めして長さを２桁に保つ
	//code は 00-00 という形式になる
	//内訳コード = サービス名番号 - 料金内訳名番号
	//上位90番台は全合計レコード
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

		if (record.length != 11) //DEBUG * エニーユーザのものはカラムが１つ少ない
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のレコード数が異常(" + record.length + "!= 11). line=\"" + line + "\"");
				lockfile.unlockSync(fileName);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return 1;
			}

		var hi_code, service_name = record[5 - 1].split("\\.", 2);
		var lo_code, utiwake_name = record[7 - 1].split("\\.", 2);

		while (hi_code.length < 2) {
			hi_code = "0" + hi_code;
		}

		while (lo_code.length < 2) {
			lo_code = "0" + lo_code;
		}

// 2022cvt_015
		var code = hi_code + "-" + lo_code;

		if (hi_code > 90 && 100 > hi_code) {
			if (doTotalRecord(record, hi_code, TotalUp) == 1) {
				lockfile.unlockSync(fileName);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return 1;
			}
		} else if (lo_code == 97) //全合計に追加
			//電話ごとの合計をリセット
			{
				if (doSumRecord(record, pactid, A_fileData, tel_sum) == 1) {
					lockfile.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				}

				TotalUp += tel_sum.value;
				tel_sum.value = 0;
			} else if (lo_code == 98 || lo_code == 99) //合計・課税:98、合計・非課税:99
			//とりあえず無視する
			{} else {
// 2022cvt_015
			var rtn = doTelRecord(record, code, pactid, A_fileData, tel_sum);

			if (rtn == 1) {
				lockfile.unlockSync(fileName);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return 1;
			} else if (rtn == 2) //エラーだが処理を継続する
				{
					error_flag = true;
				}
		}
	}

	lockfile.unlockSync(fileName);
	// flock(fp, LOCK_UN);
	// fclose(fp);

	if (error_flag) //途中でエラーがあったかどうか
		{
			return 2;
		}

	return 0;
};

function doTelRecord(record: string[], code: string, pactid: string, A_fileData: any[], sum: { [key: string]: number }) //請求先番号
//読込電話件数
//読込明細件数
//親番号チェックフラグ
//前回の電話番号.
//-- DEBUG -- * 表示してみる
//print "**** doTelRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//ここで請求番号を取得する -- この番号はダミー電話の参照に用いる
//請求年月チェック
//ハイフン付きの電話番号を保持
//'-'ハイフンを除く
//小数点で来ることもある
//コードを集約する
//特殊な科目、ユニバーサルサービス料など
//まだout_codeが決まっていなければ
//明細件数カウント.
{
	// if (!("H_utiwake" in global)) H_utiwake = undefined;
	// if (!("H_sumflag" in global)) H_sumflag = undefined;
	// if (!("A_codes" in global)) A_codes = undefined;
	// if (!("ReadTelCnt" in global)) ReadTelCnt = undefined;
	// if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("PrTelFlag" in global)) PrTelFlag = undefined;
	// if (!("postX_tb" in global)) postX_tb = undefined;
	// if (!("H_special_kamoku" in global)) H_special_kamoku = undefined;
	// if (!("_static_doTelRecord_prev_tel" in global)) _static_doTelRecord_prev_tel = "";
// 2022cvt_015
	var seikyuNo = record[0].trim();

	if (record[3].trim() != billdate) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "請求年月日が違います.(" + record[3] + "!=" + billdate + ").");
		return 1;
	}

// 2022cvt_015
	var telno_view = record[6 - 1].trim();
// 2022cvt_015
	var telno = telno_view.replace(/-/g, "");

	if (telno != _static_doTelRecord_prev_tel && telno != "") //前回の電話番号と異なっていれば...
		//請求コードからダミー部署を求める
		//電話番号の登録
		//読み込んだレコード数をカウントする.
		{
// 2022cvt_015
			var H_dummy = getDummyTel(pactid, seikyuNo);

			if (H_dummy == undefined) //失敗
				{
					return 1;
				}

// 2022cvt_015
			var dummy_pact = H_dummy[1];
			registTel(telno, telno_view, dummy_pact);
			_static_doTelRecord_prev_tel = telno;
			ReadTelCnt++;
		}

	if (PrTelFlag == false && telno != "") //まだ親番号が含まれていない
		{
// 2022cvt_015
			for (var a_code of A_codes) {
// 2022cvt_015
				var a_code = a_code.trim().replace(/-/g, "");

				if (telno == a_code) //親番号チェックフラグＯＮ
					{
						PrTelFlag = true;
						break;
					}
			}
		}

// 2022cvt_015
	var charge = parseInt(record[8 - 1]);

	if (undefined !== H_utiwake[code]) //print "DEBUG: ".  $H_utiwake[$code]["name"] . ", " . $charge . " 円\n";
		//合計値を得る --> この合計値は電話ごとの合計チェックに用いる
		{
			sum.value += charge;
		} else //こちらでも合計値は出す
		//エラーだが処理を継続する
		{
			sum.value += charge;
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な内訳コードです(" + code + ").");
			return 2;
		}

// 2022cvt_015
	var out_code = "";

// 2022cvt_015
	for (var key in H_special_kamoku) {
// 2022cvt_015
		var value = H_special_kamoku[key];

		if (code == key) {
			out_code = value;
			break;
		}
	}

	if (out_code == "") //科目ごとに[0:捨て,1:国内,2:国際]に分けて集計する
		{
			if (undefined !== H_sumflag[code] == false) //設定なきコードはエラー、処理は継続する
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "この内訳コードに対する処理が指定されていません(" + code + ")、utiwake_agent_tbを見直してください.");
					return 2;
				} else if (H_sumflag[code] == 1) //"使用料（国内）";
				{
					out_code = OUT_CODE_DOMES.toString();
				} else if (H_sumflag[code] == 2) //"使用料（国際）";
				{
					out_code = OUT_CODE_INTER.toString();
				} else //print "DEBUG: " . $H_sumflag[$code] . " : " . $H_utiwake[$code]["name"] . " : " . $charge ."円は捨てます.\n";
				//処理は継続する
				{
					return 0;
				}
		}

// 2022cvt_015
	var hikazei = false;

	if (record[11 - 1] == IS_HIKAZEI) //Modify * エニーユーザーのカラムは１つ少ない
		{
			hikazei = true;
		}

	if (telno == "") //請求コードからダミー電話とダミー部署を求める
		//特定番号通知等、グループ全体にかかる請求は電話番号なしでやってくる。
		{
			H_dummy = getDummyTel(pactid, seikyuNo);

			if (H_dummy == undefined) //失敗
				{
					return 1;
				}

			telno = H_dummy[0];
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "電話番号の無い明細をダミー電話に付加、code=" + code + ", charge=" + charge);
		}

// 2022cvt_015
	var A_meisai = [telno, out_code, charge, hikazei];
	A_fileData.push(A_meisai);
	ReadMeisaiCnt++;
	return 0;
};

function doSumRecord(record: string[], pactid: string, A_fileData: any[], sum: { [key: string]: number }) //-- DEBUG -- * 表示してみる
//print "**** doSumRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//電話番号	// Modify * エニーユーザーのカラムは１つ少ない
//ハイフン付きの電話番号を保持
//'-'ハイフンを除く
//電話番号のない.97は、グループ全体にかかるサービス合計なので無視する
{
	// if (!("SumTax" in global)) SumTax = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var telno_view = record[6 - 1].trim();
// 2022cvt_015
	var telno = telno_view.replace(/-/g, "");

	if (telno == "") {
		return 0;
	}

// 2022cvt_015
	var charge = +record[8 - 1];

	if (charge != +sum.value) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "合計金額が異なります." + telno + " (" + charge + "!=" + sum.value + ").");
		return 1;
	}

	return 0;
};

function doTotalRecord(record: string[], hi_code: any, TotalUp: number) //global $TotalTax;	// 請求書に記載されている消費税合計
//global $logh;
//global $pactid;
//global $pactname;
//global $billdate;
//-- DEBUG -- * 表示してみる
//print "==== doTotalRecord ================================\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//Modify * エニーユーザーのカラムは１つ少ない
//if( $hi_code == 99 ) // 消費税の合計
//{
//$TotalTax += $total;	// 消費税合計を記録する
//}
//if( $total != $TotalUp ){
//$logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $billdate . LOG_DELIM
//. "会社合計金額が異なります.(". $total ."!=". $TotalUp .")." );
//return 1;
//}
{
// 2022cvt_015
	var total = +record[8 - 1];
	return 0;
};

function registTel(telno: string, telno_view: string, dummy_pact: any) //電話番号マスター
//請求月電話番号マスター
//-t オプションの値
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
	// if (!("AddTelCnt" in global)) AddTelCnt = undefined;
	// if (!("AddTelXCnt" in global)) AddTelXCnt = undefined;
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

	if (telXFlag == false) //print "INFO: 電話はtelX_tbに無かったので追加します.\n";
		{
			if (!inTelData(A_telXData, telno)) //tel_XX_tb に追加する電話を出力
				//追加する電話数のカウント
				{
					A_telXData.push([dummy_pact, telno, telno_view]);
					AddTelXCnt++;
				} else {
				console.log("INFO: 電話" + telno + "はすでにtelX_tbに登録しました、スキップします.\n");
			}
		}

	if (telFlag == false && telXFlag == false && teltable == "n") //print "INFO: 電話はtel_tbに無かったので追加します.\n";
		{
			if (!inTelData(A_telData, telno)) //tel_tb に追加する電話を出力
				//追加する電話数のカウント
				{
					A_telData.push([dummy_pact, telno, telno_view]);
					AddTelCnt++;
				} else {
				console.log("INFO: 電話" + telno + "はすでにtel_tbに登録しました、スキップします.\n");
			}
		}
};

function inTelData(A_array: any[], telno: string) //存在しなかった
{
// 2022cvt_015
	for (var A_line of A_array) //$A_line は array( $postid, $telno, $telno_view )
	{
		if (A_line[1] == telno) //電話番号が存在した
			{
				return true;
			}
	}

	return false;
};

function selectDummyTel(pactid: string, seikyuNo: string) //請求番号は'C95560250611'といった形式
//末尾の4文字はYYMMなので、これを除く
{
	// if (!("dbh" in global)) dbh = undefined;
	seikyuNo = seikyuNo.substring(0, seikyuNo.length - 4);
// 2022cvt_015
	var sql_str = "select telno,postid from dummy_tel_tb where pactid = " + pactid + " and carid = " + ANY_CARRIER_ID + " and reqno = '" + seikyuNo + "'";
	return dbh.getHash(sql_str);
};

	async function getDummyTel(pactid: string, seikyuNo: string) //-t オプションの値
//pactid,請求コード => ダミー電話番号/部署のキャッシュテーブル
//既にキャッシュに登録されているか？
//キャッシュに登録する
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("postX_tb" in global)) postX_tb = undefined;
	// if (!("teltable" in global)) teltable = undefined;
	// if (!("_static_getDummyTel_H_DummyCache" in global)) _static_getDummyTel_H_DummyCache = Array();
// 2022cvt_015
	var key = pactid + "::" + seikyuNo;

	if (undefined !== _static_getDummyTel_H_DummyCache[key]) //キャッシュから答を返す
		{
			return _static_getDummyTel_H_DummyCache[key];
		}

// 2022cvt_015
	var H_dummy = await selectDummyTel(pactid, seikyuNo);

	if (H_dummy == undefined) //ダミー電話がＤＢに記録されていなかった
		//失敗
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "ダミー部署がDBに登録されていません、請求コード=(" + seikyuNo + ")、dummy_tel_tbを見直して下さい.");
			return undefined;
		} else //ダミー電話が2件以上登録されていた
		//部署の存在チェック
		{
			if (H_dummy.length > 2) //失敗
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "請求番号(" + seikyuNo + ")に対するダミー部署が複数存在します、dummy_tel_tbを見直して下さい.");
					return undefined;
				}

// 2022cvt_015
			var DummyTel = H_dummy[0].telno;
// 2022cvt_015
			var DummyPost = H_dummy[0].postid;

			if (checkPostID(pactid, DummyPost, postX_tb) == 0) //失敗
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "部署ID(" + DummyPost + ")は" + postX_tb + "に存在しません、dummy_tel_tbを見直して下さい.");
					return undefined;
				}

			if (teltable == "n" && checkPostID(pactid, DummyPost, "post_tb") == 0) //失敗
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "部署ID(" + DummyPost + ")は post_tb に存在しません、dummy_tel_tbを見直して下さい.");
					return undefined;
				}
		}

	_static_getDummyTel_H_DummyCache[key] = [DummyTel, DummyPost];
	return _static_getDummyTel_H_DummyCache[key];
};

function checkPostID(pactid: string, postid: string, post_tb: string) {
	// if (!("dbh" in global)) dbh = undefined;

	if (!postid || postid == "") {
		return 0;
	}

// 2022cvt_015
	var sql = "select count(postid) from " + post_tb + " where pactid=" + pactid + " and postid=" + postid;
	return dbh.getOne(sql);
};

function doCalc(pactid: string, A_fileData: any[]) //データが空のときは終了.
//電話番号（１回前の）
//国内課税
//国内非課税
//国際課税（実際にはおそらく使用しない）
//国際非課税
//各データを書き出す
//最後の電話について処理を行う
//国内課税を登録
{
	// if (!("A_calcData" in global)) A_calcData = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	if (A_fileData.length == 0) {
		return 0;
	}

	if (!A_fileData.sort(cmpfileData)) {
	// if (A_fileData.sort("cmpfileData") == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "明細データの電話番号ソートに失敗しました.");
		return 1;
	}

// 2022cvt_015
	var telno = "";
// 2022cvt_015
	var charge_domes_tax = 0;
// 2022cvt_015
	var charge_domes_non = 0;
// 2022cvt_015
	var charge_inter_tax = 0;
// 2022cvt_015
	var charge_inter_non = 0;
// 2022cvt_015
	var is_domes_tax = false;
// 2022cvt_015
	var is_domes_non = false;
// 2022cvt_015
	var is_inter_tax = false;
// 2022cvt_015
	var is_inter_non = false;

// 2022cvt_015
	for (var data of A_fileData) //data : telno, code, charge, hikazei
	//print "DEBUG: ". $data[0] .", ". $data[1] .", ". $data[2] .", ". $data[3] ."\n";
	//電話番号が変わったら
	//電話番号を得る
	//非課税フラグ
	//国内をまとめる
	{
		if (data[0] != telno && telno != "") //国内課税を登録
			{
				if (is_domes_tax) //順序はコード番号/100という規則
					{
// 2022cvt_015
						var detailNo = +(OUT_CODE_DOMES / 100);
// 2022cvt_015
						var A_meisai = [telno, OUT_CODE_DOMES, charge_domes_tax, false, detailNo];
						A_calcData.push(A_meisai);
					}

				if (is_domes_non) //順序はコード番号/100という規則
					{
						detailNo = +(OUT_CODE_DOMES / 100);
						A_meisai = [telno, OUT_CODE_DOMES, charge_domes_non, true, detailNo];
						A_calcData.push(A_meisai);
					}

				if (is_inter_tax) //順序はコード番号/100という規則
					{
						detailNo = +(OUT_CODE_INTER / 100);
						A_meisai = [telno, OUT_CODE_INTER, charge_inter_tax, false, detailNo];
						A_calcData.push(A_meisai);
					}

				if (is_inter_non) //順序はコード番号/100という規則
					{
						detailNo = +(OUT_CODE_INTER / 100);
						A_meisai = [telno, OUT_CODE_INTER, charge_inter_non, true, detailNo];
						A_calcData.push(A_meisai);
					}

				charge_domes_tax = 0;
				charge_domes_non = 0;
				charge_inter_tax = 0;
				charge_inter_non = 0;
				is_domes_tax = false;
				is_domes_non = false;
				is_inter_tax = false;
				is_inter_non = false;
			}

		telno = data[0];
// 2022cvt_015
		var code = data[1];
// 2022cvt_015
		var charge = data[2];
// 2022cvt_015
		var hikazei = data[3];

		if (data[1] == OUT_CODE_DOMES) {
			if (hikazei) //非課税
				{
					charge_domes_non += charge;
					is_domes_non = true;
				} else //課税
				{
					charge_domes_tax += charge;
					is_domes_tax = true;
				}
		} else if (data[1] == OUT_CODE_INTER) {
			if (hikazei) //非課税
				{
					charge_inter_non += charge;
					is_inter_non = true;
				} else //課税
				{
					charge_inter_tax += charge;
					is_inter_tax = true;
				}
		} else //順序はコード番号/100という規則
			{
				detailNo = +(code / 100);
				A_meisai = [telno, code, charge, hikazei, detailNo];
				A_calcData.push(A_meisai);
			}
	}

	if (is_domes_tax) //順序はコード番号/100という規則
		{
			detailNo = +(OUT_CODE_DOMES / 100);
			A_meisai = [telno, OUT_CODE_DOMES, charge_domes_tax, false, detailNo];
			A_calcData.push(A_meisai);
		}

	if (is_domes_non) //順序はコード番号/100という規則
		{
			detailNo = +(OUT_CODE_DOMES / 100);
			A_meisai = [telno, OUT_CODE_DOMES, charge_domes_non, false, detailNo];
			A_calcData.push(A_meisai);
		}

	if (is_inter_tax) //順序はコード番号/100という規則
		{
			detailNo = +(OUT_CODE_INTER / 100);
			A_meisai = [telno, OUT_CODE_INTER, charge_inter_tax, false, detailNo];
			A_calcData.push(A_meisai);
		}

	if (is_inter_non) //順序はコード番号/100という規則
		{
			detailNo = +(OUT_CODE_INTER / 100);
			A_meisai = [telno, OUT_CODE_INTER, charge_inter_non, false, detailNo];
			A_calcData.push(A_meisai);
		}

	return 0;
};

function writeTelData(pactid: string) //現在の日付を得る
//tel_XX_tb に追加する電話を出力
//tel_tb に追加する電話を出力
{
	// if (!("A_telData" in global)) A_telData = undefined;
	// if (!("A_telXData" in global)) A_telXData = undefined;
	// if (!("fp_tel" in global)) fp_tel = undefined;
	// if (!("fp_telX" in global)) fp_telX = undefined;
	// if (!("ANY_AREA_ID" in global)) ANY_AREA_ID = undefined;

// 2022cvt_015
	var nowtime = getTimestamp();

// 2022cvt_015
	for (var A_data of A_telXData) {
// 2022cvt_015
		var registPostid = A_data[0];
// 2022cvt_015
		var telno = A_data[1];
// 2022cvt_015
		var telno_view = A_data[2];
		fs.writeFileSync(fp_telX, pactid + "\t" + registPostid + "\t" + telno + "\t" + telno_view + "\t" + ANY_CARRIER_ID + "\t" + ANY_AREA_ID + "\t" + ANY_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");// 2022cvt_006
	}

// 2022cvt_015
	for (var A_data of A_telData) {
		registPostid = A_data[0];
		telno = A_data[1];
		telno_view = A_data[2];
		fs.writeFileSync(fp_tel, pactid + "\t" + registPostid + "\t" + telno + "\t" + telno_view + "\t" + ANY_CARRIER_ID + "\t" + ANY_AREA_ID + "\t" + ANY_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");// 2022cvt_006
	}
};

function cmpfileData(a: string, b: string) //data : telno, code, charge, hikazei
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
	// if (!("H_utiwake_ANY" in global)) H_utiwake_ANY = undefined;
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
	for (var data of A_calcData) //data : telno, code, charge, taxkubun, detailNo
	//書き出しの内訳にはANY_CARRIER_IDのものを用いる
	//内訳コード.
	//内訳コード名
	//末尾の空白を除く
	//税区分 -- DoCoMo型に変換して表示する
	//表示順序
	//carid キャリアID
	{
// 2022cvt_015
		var telno = data[0];
// 2022cvt_015
		var ut_code = data[1];
// 2022cvt_015
		var ut_name = H_utiwake_ANY[ut_code].name;
		ut_name = ut_name.replace("\u3000 ", "");
		// ut_name = rtrim(ut_name, "\u3000 ");

		if (data[3] == true) //IS_HIKAZAI
			//非課税
			{
// 2022cvt_015
				var taxkubun = TAX_HIKAZEI;
			} else //課税
			{
				taxkubun = TAX_KAZEI;
			}

// 2022cvt_015
		var detailNo = data[4];
		fs.writeFileSync(fp_teldetails, pactid + "\t" + telno + "\t" + ut_code + "\t" + ut_name + "\t" + data[2] + "\t" + detailNo + "\t" + taxkubun + "\t" + nowtime + "\t" + ANY_CARRIER_ID + "\n");// 2022cvt_006
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
	var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
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
// 2022cvt_015
	var sql_str = "delete from " + teldetailX_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid=" + ANY_CARRIER_ID;
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

	async function doImport(file_tel: fs.PathLike, file_telX: fs.PathLike, file_teldetails: fs.PathLike, db: ScriptDB) //tel_tbへのインポート
{
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	if (fs.statSync(file_tel).size > 0) {
	// if (filesize(file_tel) > 0) {
// 2022cvt_015
		var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];

		if (await doCopyInsert("tel_tb", file_tel, tel_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "tel_tbのインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "tel_tb のインポート完了.");
		}
	}

	if (fs.statSync(file_telX).size > 0) {
	// if (filesize(file_telX) > 0) {
// 2022cvt_015
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];

		if (await doCopyInsert(telX_tb, file_telX, telX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポート完了");
		}
	}

	if (fs.statSync(file_teldetails).size > 0) {
	// if (filesize(file_teldetails) > 0) {
// 2022cvt_015
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "detailno", "taxkubun", "recdate", "carid"];

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

	async function doCopyInsert(table: string, filename: string | number | Buffer | URL, columns: string[], db: ScriptDB) //ファイルを開く
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
		buffer = fs.readFileSync(filename, 'utf8');
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
				if (fname.match(ANYFU_PAT))
				// if (preg_match(ANYFU_PAT, fname)) //ファイル移動
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
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
	console.log("		-t 当月データ	(N:データは今月のもの,O:データは先月のもの)\n\n");
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
