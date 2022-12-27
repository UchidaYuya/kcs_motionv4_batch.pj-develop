// 2022cvt_026
// require("lib/script_db.php");
import TableNo, { ScriptDB, TableInserter } from "../batch/lib/script_db";

// 2022cvt_026
// require("lib/script_log.php");
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../batch/lib/script_log";

// 2022cvt_026
// require("model/script/TelAmountModel.php");
import TelAmountModel from "../../class/model/script/TelAmountModel";

// 2022cvt_026
// require("MtOutput.php");
import MtOutput from "../../class/MtOutput";

import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as flock from "proper-lockfile";
import { G_AUTH_ASP, G_CODE_ASP, G_CODE_ASX, G_EXCISE_RATE } from "./lib/script_common";

(async () => {
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_aubill.php";
const AU_DIR = "/au";
const AU_BILL_DIR = AU_DIR + "/bill";
const AU_TUWA_DIR = AU_DIR + "/tuwa";
// 2022cvt_015
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
// 2022cvt_015
var log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
// 2022cvt_016
// 2022cvt_015
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 2022cvt_016
log_listener.putListener(log_listener_typeView);
// 2022cvt_016
log_listener.putListener(log_listener_type);
// 2022cvt_015
var dbh = new ScriptDB(log_listener);
// 2022cvt_015
var logh = new ScriptLogAdaptor(log_listener, true);

var year = 0;
var month = 0;
var pactid = "";
var target = "";
var backup = "";
var mode = "";
var A_checked_code: Array<any>;
var A_unregist_code: Array<any>;
var unregistCode: Array<any> = [];

if (process.argv.length != 6 + 1) //数が正しくない
	{
		usage("");
	} else //数が正しい
	//$cnt 0 はスクリプト名のため無視
	{
// 2022cvt_015
		var argvCnt = process.argv.length;

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
						usage("モードの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match(/^-y=/))
			// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
				{
// 2022cvt_015
					var billdate = process.argv[cnt].replace(/^-y=/, "");
					// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

					if (!billdate.match(/^[0-9]{6}$/)) {
					// if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("請求年月の指定が不正です。" + process.argv[cnt]);
					} else //年月チェック
						{
// 2022cvt_015
							year = parseInt(billdate.substring(0, 4));
// 2022cvt_015
							month = parseInt(billdate.substring(4, 2));

							if (year < new Date().getFullYear() - 2 || year > new Date().getFullYear() || +(month < 1 || +(month > 12))) {
								usage("請求年月の指定が不正です。" + process.argv[cnt]);
							}

							if (new Date().getFullYear() == year && new Date().getMonth() + 1 < +month) {
								usage("請求年月の指定が不正（未来月）です。" + process.argv[cnt]);
							}

							if ((new Date().getFullYear() - year) * 12 + (new Date().getMonth() + 1 - +month) >= 24) {
								usage("請求年月の指定が不正（２４ヶ月以前）です。" + process.argv[cnt]);
							}
						}

					continue;
				}

			if (process.argv[cnt].match(/^-p=/))
			// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
				{
// 2022cvt_015
					pactid = process.argv[cnt].replace(/^-p=/, "").toLowerCase();
					// var pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!pactid.match(/^all$/) && !pactid.match(/^[0-9]+$/)) {
					// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("会社コードの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match(/^-b=/))
			// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
				{
// 2022cvt_015
					backup = process.argv[cnt].replace(/^-b=/, "").toLowerCase();
					// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!backup.match(/^[ny]$/)) {
					// if (ereg("^[ny]$", backup) == false) {
						usage("バックアップの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match(/^-t=/)) {
			// if (ereg("^-t=", _SERVER.argv[cnt]) == true) {
// 2022cvt_015
				target = process.argv[cnt].replace(/^-t=/, "").toLowerCase();
				// var target = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

				if (!target.match(/^[no]$/)) {
				// if (ereg("^[no]$", target) == false) {
					usage("対象月の（最新/過去）の指定が不正です。" + process.argv[cnt]);
				}

				continue;
			}

			usage("パラメータの指定が不正です。" + process.argv[0]);
		}
	}

logh.putError(G_SCRIPT_BEGIN, "import_aubill.php au請求データ取込処理 処理を開始します");
// 2022cvt_015
var dataDir = DATA_DIR + "/" + year + month + AU_BILL_DIR;

if (pactid == "all") {
	if (fs.existsSync(dataDir) == false) //エラー終了// 2022cvt_003
		{
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 au請求データディレクトリ（" + dataDir + "）がみつかりません");
			throw process.exit(1);// 2022cvt_009
		}
} else {
	if (fs.existsSync(dataDir + "/" + pactid) == false) //エラー終了// 2022cvt_003
		{
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 au請求データディレクトリ（" + dataDir + "/" + pactid + "）がみつかりません");
			throw process.exit(1);// 2022cvt_009
		}
}

// clearstatcache();// 2022cvt_012

var LocalLogFile = "";
if (pactid == "all") {
// 2022cvt_015
	LocalLogFile = dataDir + "/importhand.log";
} else {
	LocalLogFile = dataDir + "/" + pactid + "/importaubill.log";
}

if (DEBUG_FLG) {
	logging("START: au請求データ取込処理(import_aubill.php)を開始します");
}
// 2022cvt_015
var A_pactid = Array();

if (pactid == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{
// 2022cvt_015
		// var fileName;
// 2022cvt_015
		var dirh = fs.readdirSync(dataDir);
		// var dirh = openDir(dataDir);// 2022cvt_004

		for (var fileName of dirh)
		// while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
		{
			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {// 2022cvt_003
				A_pactid.push(fileName);
				if (DEBUG_FLG) {
					logging("INFO: 対象ディレクトリ " + fileName);
				}
			}

// 			clearstatcache();// 2022cvt_012
		}

		// closedir(dirh);
	} else {
	A_pactid.push(pactid);
	if (DEBUG_FLG) {
		logging("INFO: 対象ディレクトリ " + pactid);
	}
}

// 2022cvt_015
var pactCnt = A_pactid.length;
A_pactid.sort();

if (pactCnt == 0) //エラー終了
	{
		if (DEBUG_FLG) {
			logging("ERROR: Pact用データディレクトリが１つもありません");
		}
		logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 Pact用データディレクトリが１つもありません");
		throw process.exit(1);// 2022cvt_009
	}

if (lock(true, dbh) == false) {
	if (DEBUG_FLG) {
		logging("ERROR: import_aubill.php au請求データ取込処理  既に起動しています");
	}
	logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理  既に起動しています");
	throw process.exit(1);// 2022cvt_009
}

// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var A_prtelnos = Array();
// 2022cvt_015
var O_tab = new TelAmountModel(dataDir, logh, process.argv, SCRIPT_FILENAME);
// 2022cvt_015
var telX_tb = "tel_" + tableNo + "_tb";
// 2022cvt_015
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
if (DEBUG_FLG) {
	logging("INFO: 対象テーブル " + telX_tb + " & " + teldetailX_tb);
}
// 2022cvt_016
// 2022cvt_015
var au_utiwake_result = await dbh.getHash("select code, name, codetype from utiwake_tb where carid = 3 order by code;", true);
// 2022cvt_015
var au_utiwake_cnt = au_utiwake_result.length;
// 2022cvt_015
var au_utiwake_max = 0;

// 2022cvt_015
// 型がよくわからない（荒木）
var au_utiwake: any

for (var acnt = 0; acnt < au_utiwake_cnt; acnt++) {
	if (!isNaN(au_utiwake_result[acnt].code) == true) {
	// if (is_numeric(au_utiwake_result[acnt].code) == true) {
		au_utiwake.name[au_utiwake_result[acnt].code] = au_utiwake_result[acnt].name;
// 2022cvt_016
		au_utiwake.codetype[au_utiwake_result[acnt].code] = au_utiwake_result[acnt].codetype;
		au_utiwake_max = au_utiwake_result[acnt].code;
	}
}

if (DEBUG_FLG) {
	logging("INFO: auの請求内訳名称のリストを取得 最大コード番号=" + au_utiwake_max);
}
// 2022cvt_016
// 2022cvt_015
au_utiwake = await dbh.getHash("select code, codetype from utiwake_tb where carid = 3 order by code;", true);
var au_utiwakecode = Array();

// 2022cvt_015
for (var val of au_utiwake) {
// 2022cvt_016
	au_utiwakecode[val.code] = val.codetype;
}

// 2022cvt_015
var au_utiwakecode_cnt = au_utiwakecode.length;
if (DEBUG_FLG) {
	logging("INFO: auの請求内訳名称のリストを取得件数 =" + au_utiwakecode_cnt);
}
// 2022cvt_015
var tel_xx_filename = dataDir + "/" + telX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var tel_xx_fp;
try {
	tel_xx_fp = fs.openSync(tel_xx_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + tel_xx_filename + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 " + tel_xx_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var tel_xx_fp = fopen(tel_xx_filename, "w");
var tel_filename: string = "";

if (DEBUG_FLG) {
	logging("INFO: tel_XX_tbへのcopy文ファイルOPEN " + tel_xx_filename);
}

if (target == "n") {
// 2022cvt_015
	tel_filename = dataDir + "/tel_tb" + year + month + pactid + ".ins";
// 2022cvt_015
	var tel_fp;
	try {
		tel_fp = fs.openSync(tel_filename, "w");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("ERROR: " + tel_fp + "のオープン失敗");
		}
		logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 " + tel_fp + "のオープン失敗");
		throw process.exit(1);// 2022cvt_009
	}
	// var tel_fp = fopen(tel_filename, "w");

	if (DEBUG_FLG) {
		logging("INFO: tel_tbへのcopy文ファイルOPEN " + tel_filename);
	}
}

// 2022cvt_015
var teldetail_filename = dataDir + "/" + teldetailX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var teldetail_fp;
try {
	teldetail_fp = fs.openSync(teldetail_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + teldetail_filename + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 " + teldetail_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var teldetail_fp = fopen(teldetail_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: tel_details_XX_tbへのcopy文ファイルOPEN " + teldetail_filename);
}
// 2022cvt_015
var utiwake_filename = dataDir + "/utiwake_tb" + year + month + pactid + ".ins";
// 2022cvt_015
var utiwake_fp;
try {
	utiwake_fp = fs.openSync(utiwake_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + utiwake_filename + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込み処理 " + utiwake_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var utiwake_fp = fopen(utiwake_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: utiwake_tbへのcopyファイル文ファイルオープン " + utiwake_filename);
}
O_tab.makeFile(year, month, pactid);
// 2022cvt_015
var Stop_Error = false;
// 2022cvt_015
var Utiwake_Error = false;
// 2022cvt_015
var fin_cnt = 0;

var fin_pact = Array();

for (cnt = 0; cnt < pactCnt; cnt++) //対象会社の会社名を取得
//請求データファイル名を取得する
//処理する請求データファイル名配列
//請求データファイルが１つもなかった場合
//請求先コード（親番号）が１つもなかった場合
//2009-06-09 UPDATE END
//重大なエラーの場合は直ぐに終了します
//会社単位に終了ログを出力
{

	var out_rec_cnt = 0;

	var total_sum = 0;

	var total_charge = 0;

	var error_flg = false;

	var write_buf = "";

	var tel_xx_write_buf = "";

	var tel_write_buf = "";

	var PACT_result = await dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) {
			logging("WARNING:  対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象会社の会社名を取得 " + PACT_result);
	}
	if (DEBUG_FLG) {
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "のデータの処理を開始します");
	}
	logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 処理を開始します");

	var A_billFile = Array();

	var dataDirPact = dataDir + "/" + A_pactid[cnt];
	var dirh = fs.readdirSync(dataDirPact);
	// dirh = openDir(dataDirPact);// 2022cvt_004

	for (var fileName of dirh) {
	// while (fileName = fs.readdir(dirh)) //2009-06-09 UPDATE START コード付データ対応 k.uesugi// 2022cvt_005

	//if((preg_match("/^IU.*\.csv$/i", $fileName)) || (preg_match("/^SU.*\.csv$/i", $fileName))){

		if (fileName.match(/\/^IU.*\\.csv$\/i/) || fileName.match(/\/^SU.*\\.csv$\/i/) || fileName.match(/\/^IC.*\\.csv$\/i/) || fileName.match(/\/^SC.*\\.csv$\/i/))
		// if (preg_match("/^IU.*\\.csv$/i", fileName) || preg_match("/^SU.*\\.csv$/i", fileName) || preg_match("/^IC.*\\.csv$/i", fileName) || preg_match("/^SC.*\\.csv$/i", fileName)) //2009-06-09 UPDATE END
			{
				A_billFile.push(fileName);
				if (DEBUG_FLG) {
					logging("INFO: 対象請求データファイル名 " + fileName);
				}
			}


	}

	// closedir(dirh);

	var fileCnt = A_billFile.length;

	if (fileCnt == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象ファイルが１つもみつかりません（");
		}
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象請求データファイル数 " + fileCnt);
	}

	var iu_flg = 0;


	for (var fcnt = 0; fcnt < fileCnt; fcnt++) //2009-06-09 UPDATE START コード付データ対応 k.uesugi
// 2022cvt_019
	//if(preg_match("/^IU.*\.csv$/i", $A_billFile[$fcnt])){
	{
// 2022cvt_019
		if (A_billFile[fcnt].match(/\/^IU.*\\.csv$\/i/) || A_billFile[fcnt].match(/\/^IC.*\\.csv$\/i/))
		// if (preg_match("/^IU.*\\.csv$/i", A_billFile[fcnt]) || preg_match("/^IC.*\\.csv$/i", A_billFile[fcnt])) //2009-06-09 UPDATE END
			{
				iu_flg = 1;
				break;
			}
	}

	if (iu_flg == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 一括請求合計内訳ファイルが含まれていません（" + dataDirPact + "）");
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 一括請求合計内訳ファイルが含まれていません（" + dataDirPact + "）");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 一括請求合計内訳ファイル存在 ");
	}

	var TEL_result = await dbh.getCol("select telno from " + telX_tb + " where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	if (DEBUG_FLG) {
		logging("INFO: 対象会社の登録電話のリストを取得 " + TEL_result.length + "件 select telno from " + telX_tb + " where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
	}

	if (target == "n") {

		var TEL_now_result = await dbh.getCol("select telno from tel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
		if (DEBUG_FLG) {
			logging("INFO: 最新の登録電話のリストを取得 " + TEL_now_result.length + "件 select telno from tel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		}
	}


	var trg_post = await dbh.getOne("select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;", true);

	if (trg_post == "") {
		if (DEBUG_FLG) {
			logging("WARNING: ルート部署が正しく登録されていません" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ルート部署が正しく登録されていません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: ルート部署のpostid取得 postid=" + trg_post + " select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
	}

	var aspFlg = false;

	if (await chkAsp(dbh.escape(A_pactid[cnt])) == true) {
		aspFlg = true;
		if (DEBUG_FLG) {
			logging("INFO: ASP利用料表示設定がＯＮ");
		}

		var asp_bill = await dbh.getOne("select charge from asp_charge_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

		if (asp_bill == "") {
			if (DEBUG_FLG) {
				logging("WARNING: ASP利用料が正しく登録されていません" + "select carid, charge from asp_charge_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
			}
			logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ASP利用料が正しく登録されていません");
			continue;
		}


		var asp_tax = +(asp_bill * G_EXCISE_RATE);
		if (DEBUG_FLG) {
			logging("INFO: ASP使用料取得 " + asp_bill);
		}
	}


	var PrTEL_result = await dbh.getCol("select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

	var PrTelCnt = PrTEL_result.length;

	if (PrTelCnt == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 請求先コード（親番号）が１つも登録されていません" + "select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 請求先コード（親番号）が１つも登録されていません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 請求先コード（親番号）を取得 " + PrTelCnt + "件 select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(pactid) + " ;");
	}

	for (fcnt = 0; fcnt < fileCnt; fcnt++) {
		if (DEBUG_FLG) {
			logging("INFO: 対象ファイルチェック " + A_billFile[fcnt]);
		}


		if (A_billFile[fcnt].match(/\/^IC.*\\.csv$\/i/))
		// if (preg_match("/^IC.*\\.csv$/i", A_billFile[fcnt])) //一括請求合計ファイル
			{
				if (DEBUG_FLG) {
					logging("INFO: 一括請求合計ファイル(コード付)の取込み開始 " + A_billFile[fcnt]);
				}

				if (readICfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
					if (!Stop_Error) {
						break;
					}
					error_flg = true;
				}

			} else if (A_billFile[fcnt].match(/\/^SC.*\\.csv$\/i/))
			// } else if (preg_match("/^SC.*\\.csv$/i", A_billFile[fcnt])) //回線別請求内訳ファイル
			{
				if (DEBUG_FLG) {
					logging("INFO: 回線別請求内訳ファイル(コード付)の取込み開始 " + A_billFile[fcnt]);
				}

				if (readSCfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) //$Stop_Errorを$Utiwake_Errorに変更、ここではbreakしない 20091208miya
					{
						if (Utiwake_Error)
						// if (Utiwake_Error == true) //break;
							{
								error_flg = true;
							}
					}

			} else if (A_billFile[fcnt].match(/\/^IU.*\\.csv$\/i/))
			// } else if (preg_match("/^IU.*\\.csv$/i", A_billFile[fcnt])) //コード付データが無いかをチェック
			//コード付データを取込まなかった場合
			{

				var check_flg = 0;

				var check_name = A_billFile[fcnt].replace("IU", "IC");
				// var check_name = mb_ereg_replace("IU", "IC", A_billFile[fcnt]);

				for (var ffcnt = 0; ffcnt < fileCnt; ffcnt++) {
					if (check_name == A_billFile[ffcnt]) {
						check_flg = 1;
						break;
					}
				}

				if (0 == check_flg) //一括請求合計ファイル
					{
						if (DEBUG_FLG) {
							logging("INFO: 一括請求合計ファイル(コード無し)の取込み開始 " + A_billFile[fcnt]);
						}

						if (readIUfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
							if (Stop_Error) {
								break;
							}
							error_flg = true;
						}
					}
			} else if (A_billFile[fcnt].match(/\/^SU.*\\.csv$\/i/))
			// } else if (preg_match("/^SU.*\\.csv$/i", A_billFile[fcnt])) //コード付データが無いかをチェック
			//コード付データを取込まなかった場合
			{
				check_flg = 0;
				check_name = A_billFile[fcnt].replace("SU", "SC");
				// check_name = mb_ereg_replace("SU", "SC", A_billFile[fcnt]);

				for (ffcnt = 0; ffcnt < fileCnt; ffcnt++) {
					if (check_name == A_billFile[ffcnt]) {
						check_flg = 1;
						break;
					}
				}

				if (0 == check_flg) //回線別請求内訳ファイル
					{
						if (DEBUG_FLG) {
							logging("NFO: 回線別請求内訳ファイル(コード無し)の取込み開始 " + A_billFile[fcnt]);
						}

						if (readSUfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
							if (Stop_Error) {
								break;
							}
							error_flg = true;
						}
					}
			}
	}

	if (Stop_Error) {
		break;
	}
	if (error_flg) {
		continue;
	}

	if (total_sum != total_charge) {
		if (DEBUG_FLG) {
			logging("WARNING: 合計金額が異なります 回線別請求：" + total_sum + " 一括請求合計：" + total_charge);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " pactid=" + pactid + "合計金額が異なります 回線別請求：" + total_sum + " 一括請求合計：" + total_charge);
		continue;
	} else {
		for (var prt in A_prtelnos) {
			var prcharge = A_prtelnos[prt];
			var amountdata = {
				pactid: A_pactid[cnt],
				carid: 3,
				prtelno: prt,
				charge: prcharge,
				recdate: getTimestamp()
			};
			O_tab.writeFile(amountdata);
		}

		A_prtelnos = Array();
	}

	if (DEBUG_FLG) {
		logging("INFO: 合計金額  回線別請求：" + total_sum + " 一括請求合計：" + total_charge);
	}
	fs.writeFileSync(tel_xx_fp, tel_xx_write_buf);// 2022cvt_006
	// fflush(tel_xx_fp);

	if (target == "n") {
		fs.writeFileSync(tel_fp, tel_write_buf);// 2022cvt_006
		// fflush(tel_fp);
	}

	fs.writeFileSync(teldetail_fp, write_buf);// 2022cvt_006
	// fflush(teldetail_fp);
	if (DEBUG_FLG) {
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "件のデータの処理を行いました");
	}
	logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理 " + PACT_result + " pactid=" + A_pactid[cnt] + ` . ${out_rec_cnt}` + "件の処理を行いました");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fs.closeSync(tel_xx_fp);
// fclose(tel_xx_fp);

if (target == "n") {
	fs.closeSync(tel_fp);
	// fclose(tel_fp);
}

fs.closeSync(teldetail_fp);
// fclose(teldetail_fp);

fs.closeSync(utiwake_fp);
// fclose(utiwake_fp);

O_tab.closeFile();

if (Stop_Error) {
	throw process.exit(1);// 2022cvt_009
} else if (Utiwake_Error) {
	insertUtiwakeCode(utiwake_filename, logh, dbh);

	if (0 < unregistCode.length) //$O_out->put(SCRIPT_FILENAME . "::仮登録の内訳コードがあります\n", MtOutput::LVL_WARN, array("disp" => 1));
		//$O_out->flushMessage();
		//２重起動ロック解除
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "::仮登録の内訳コードがあります\n");
			lock(false, dbh);
		}

	throw process.exit(1);// 2022cvt_009
}

if (fin_cnt < 1) {
	if (DEBUG_FLG) {
		logging("ERROR: １件も成功しませんでした");
	}
	throw process.exit(1);// 2022cvt_009
}

if (backup == "y") //TEL_DETAILS_X_TBのバックアップ
	//エクスポート失敗した場合
	{
// 2022cvt_015
		var teldetailX_exp = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
// 2022cvt_015
		var sql_str = "select * from " + teldetailX_tb;
// 2022cvt_015
		var rtn = await dbh.backup(teldetailX_exp, sql_str);

		if (rtn == false) {
			if (DEBUG_FLG) {
				logging("ERROR: " + teldetailX_tb + "のデータエクスポートに失敗しました");
			}
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 " + teldetailX_tb + "のデータエクスポートに失敗しました" + teldetailX_exp);
		} else {
			if (DEBUG_FLG) {
				logging("INFO: " + teldetailX_tb + "のデータエクスポートを行いました " + teldetailX_exp);
			}
			logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理 " + teldetailX_tb + "のデータエクスポートを行いました" + teldetailX_exp);
		}
	}

dbh.begin();

if (mode == "o") //対象pactidを１つの文字列に変換
	//TEL_DETAIL_XX_TBの削除
	{
// 2022cvt_015
		var pactin = "";

		for (cnt = 0; cnt < fin_cnt; cnt++) {
			pactin += fin_pact[cnt] + ",";
		}

		pactin = pactin.replace(",", "");
		// pactin = rtrim(pactin, ",");
		dbh.query("delete from " + teldetailX_tb + " where carid = 3 and pactid IN(" + pactin + ");", true);
		if (DEBUG_FLG) {
			logging("INFO: " + teldetailX_tb + "の既存データの削除を行いました " + "delete from " + teldetailX_tb + " where carid = 3 pactid IN(" + pactin + ");");
		}
		logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理 " + teldetailX_tb + "の既存データの削除を行いました");
	}

if (fs.statSync(tel_xx_filename).size != 0)
// if (filesize(tel_xx_filename) != 0) //tel_X_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
		var rtn2 = await doCopyInsert(telX_tb, tel_xx_filename, telX_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + telX_tb + "のデータインポートに失敗しました ");
				};
				logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 " + telX_tb + "のデータインポートに失敗しました " + rtn2);
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + telX_tb + "のデータインポートを行いました " + tel_xx_filename);
			}
			logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理 " + telX_tb + "のデータインポートを行いました " + tel_xx_filename);
		}
	}

if (target == "n") {
	if (fs.statSync(tel_filename).size != 0)
	// if (filesize(tel_filename) != 0) //tel_tb へインポート
		//インポート失敗した場合
		{
// 2022cvt_015
			var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
			var rtn2 = await doCopyInsert("tel_tb", tel_filename, tel_col, dbh);

			if (rtn2 != 0) //ロールバック
				{
					if (DEBUG_FLG) {
						logging("ERROR: tel_tbのデータインポートに失敗しました ");
					}
					logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 tel_tbのデータインポートに失敗しました ");
					dbh.rollback();
					throw process.exit(1);// 2022cvt_009
				} else {
				if (DEBUG_FLG) {
					logging("INFO: tel_tbのデータインポートを行いました " + tel_filename);
				}
				logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理 tel_tbのデータインポートを行いました " + tel_filename);
			}
		}
}

if (fs.statSync(teldetail_filename).size != 0) //tel_details_X_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "tdcomment", "prtelno"];
		var rtn2 = await doCopyInsert(teldetailX_tb, teldetail_filename, teldetailX_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + teldetailX_tb + "のデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 " + teldetailX_tb + "のデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + teldetailX_tb + "のデータインポートを行いました " + teldetail_filename);
			}
			logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理 " + teldetailX_tb + "のデータインポートを行いました " + teldetail_filename);
		}
	}

if (undefined !== utiwake_filename) {
	if (true != await insertUtiwakeCode(utiwake_filename, logh, dbh)) {
		dbh.rollback();
		throw process.exit(1);// 2022cvt_009
	}
}

if (fs.statSync(O_tab.getFilePath()).size != 0) {
	var rtn2 = await doCopyInsert(O_tab.getTableName(), O_tab.getFilePath(), O_tab.getAmountColumn(), dbh);

	if (0 != rtn2) //ロールバック
		{
			if (DEBUG_FLG) {
				logging("ERROR: " + O_tab.getTableName() + "のデータインポートに失敗しました ");
			}
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 " + O_tab.getTableName() + "のデータインポートに失敗しました  ");
			dbh.rollback();
			throw process.exit(1);// 2022cvt_009
		} else {
		if (DEBUG_FLG) {
			logging("INFO: " + O_tab.getTableName() + "のデータインポートを行いました " + O_tab.getFilePath());
		}
		logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理 " + O_tab.getTableName() + "のデータインポートを行いました " + O_tab.getFilePath());
	}
}

dbh.commit();

for (cnt = 0; cnt < fin_cnt; cnt++) //ファイルの移動
{
// 2022cvt_015
	var finDir = dataDir + "/" + fin_pact[cnt] + "/fin";

	if (fs.existsSync(finDir) == false) //完了ディレクトリの作成// 2022cvt_003
		{
			fs.mkdirSync(finDir, 700);
			if (DEBUG_FLG) {
				logging("INFO: 完了ディレクトリの作成しました " + finDir);
			}
			logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理  完了ディレクトリの作成しました " + finDir);

			try {
				fs.mkdirSync(finDir, 700);
				if (DEBUG_FLG) logging("INFO: 完了ディレクトリの作成しました " + finDir);
				logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理  完了ディレクトリの作成しました " + finDir);
			} catch (e) {
				if (DEBUG_FLG) logging("ERROR: 完了ディレクトリの作成に失敗しました " + finDir);
				logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理  完了ディレクトリの作成に失敗しました " + finDir);
				throw process.exit(1);// 2022cvt_009
			}
		}

// 	clearstatcache();// 2022cvt_012
	var dirh = fs.readdirSync(dataDir + "/" + fin_pact[cnt]);
	// dirh = openDir(dataDir + "/" + fin_pact[cnt]);// 2022cvt_004

	for (var copyfileName of dirh) {
	// while (copyfileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
// 2022cvt_019
		if (fs.statSync(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName).isFile() && (copyfileName.match(/\/^IU.*\\.csv$\/i/) || copyfileName.match(/\/^SU.*\\.csv$\/i/) || copyfileName.match(/\/^IC.*\\.csv$\/i/) || copyfileName.match(/\/^SC.*\\.csv$\/i/))) {
		// if (is_file(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName) == true && (preg_match("/^IU.*\\.csv$/i", copyfileName) == true || preg_match("/^SU.*\\.csv$/i", copyfileName) == true || preg_match("/^IC.*\\.csv$/i", copyfileName) == true || preg_match("/^SC.*\\.csv$/i", copyfileName) == true)) {
			try {
				fs.renameSync(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName);
				if (DEBUG_FLG) logging("INFO: ファイルの移動をしました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理  ファイルの移動をしました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			} catch (e) {
				if (DEBUG_FLG) logging("ERROR: ファイルの移動に失敗しました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理  ファイルの移動に失敗しました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				throw process.exit(1);// 2022cvt_009
			}
		}

// 		clearstatcache();// 2022cvt_012
	}

	// closedir(dirh);
}

lock(false, dbh);
if (DEBUG_FLG) {
	logging("END: au請求データ取込処理(import_aubill.php)を終了しました");
}
logh.putError(G_SCRIPT_END, "import_aubill.php au請求データ取込処理 処理を終了しました");
throw process.exit(0);// 2022cvt_009

function usage(comment: string) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} -t={N|O}\n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ	 (Y:バックアップする,N:バックアップしない)\n");
	console.log("		-t 対象月が最新/過去	(N:最新,O:過去) \n\n");
	throw process.exit(1);// 2022cvt_009
};

function lock(is_lock: boolean, db: any) //ロックする
{
	if (db == undefined) {
		return false;
	}

// 2022cvt_015
	var pre = db.escape("batch_" + SCRIPT_FILENAME);

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
// 2022cvt_015
			var sql = "select count(*) from clamptask_tb " + "where command = '" + pre + "' and " + "status = 1;";
// 2022cvt_015
			var count = db.getOne(sql);

			if (count != 0) {
				db.rollback();
				db.putError(G_SCRIPT_WARNING, "多重動作");
				return false;
			}

// 2022cvt_015
			var nowtime = getTimestamp();
			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + pre + "',1,'" + nowtime + "');";
			db.query(sql);
			db.commit();
		} else {
		db.begin();
		db.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + pre + "';";
		db.query(sql);
		db.commit();
	}

	return true;
};

function logging(lstr: string) {
// 2022cvt_015
	var log_buf = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/") + " : " + lstr + "\n";
// 2022cvt_015
	var lfp = fs.openSync(global.LocalLogFile, "a");
	// var lfp = fopen(GLOBALS.LocalLogFile, "a");
	flock.lockSync(global.LocalLogFile);
	// flock(lfp, LOCK_EX);
	fs.writeFileSync(lfp, log_buf);// 2022cvt_006
	flock.lockSync(global.LocalLogFile);
	// flock(lfp, LOCK_UN);
	fs.closeSync(lfp);
	// fclose(lfp);
	return;
};

	async function chkAsp(pactid: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + G_AUTH_ASP;
// 2022cvt_015
	var count = await dbh.getOne(sql_str);

	if (count == 0) {
		return false;
	} else {
		return true;
	}
};

function readIUfile(infilename: string, pactid: string) //対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//20110411
//$inmonth = substr( $readbuff[0], 6, 2);
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("PACT_result" in global)) PACT_result = undefined;
	// if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	// if (!("year" in global)) year = undefined;
	// if (!("month" in global)) month = undefined;
	// if (!("inyear" in global)) inyear = undefined;
	// if (!("inmonth" in global)) inmonth = undefined;
	// if (!("total_charge" in global)) total_charge = undefined;
	// if (!("O_tab" in global)) O_tab = undefined;
	// if (!("A_prtelnos" in global)) A_prtelnos = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(infilename, "utf8");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("WARNING: ファイルのOPENに失敗しました " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " ファイルのOPENに失敗しました " + infilename);
			return false;
		}
	}
	var text = Encoding.convert(buffer, {
		from: "SJIS",
		to: "UNICODE",
		type: "string"
	})
	var lines = text.toString().split("\r\n");
	// var ifp = fopen(infilename, "r");

	if (DEBUG_FLG) {
		logging("INFO: 対象ファイル=" + infilename);
	}
// 2022cvt_015
	// var line = fgets(ifp);
	// line = mb_ereg_replace("\"", "", fgets(ifp));
	// line = mb_convert_encoding(line, "UTF-8", "auto");
// 2022cvt_015
	var line = lines[1].replace("\"", "");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) {
			logging("WARNING: 請求先コード(au)が異なります " + readbuff[1]);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " 請求先コード(au)が異なります " + readbuff[1]);
		// fclose(ifp);
		insertClampError(pactid, "請求先コード(au)が異なります");
		return false;
	}

	O_tab.setPrtelNo(readbuff[1]);

	if (!(undefined !== A_prtelnos[readbuff[1]])) {
		A_prtelnos[readbuff[1]] = 0;
	}

	var inyear = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(0, 4));
	var inmonth = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(4, 2));

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象年月が異なります " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " 対象年月が異なります " + infilename);
		// fclose(ifp);
		return false;
	}

	for (line of lines.splice(2)) {
		readbuff = line.slice(0, -1).split(",");

		if (readbuff[2].replace("\u3000+$", "") == "＜合　計＞")
			{
				total_charge = parseInt(total_charge + readbuff[3]);
				A_prtelnos[readbuff[1]] += readbuff[3];
			}
	}
	return true;
};

function readSUfile(infilename: fs.PathOrFileDescriptor, pactid: string) //対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//20110411
//$inmonth = substr( $readbuff[0], 6, 2);
//現在の日付を得る
//レコード毎の処理
//UPDATE バグ対応 2005/12/12 kenichiro uesugi
//		$tel_xx_write_buf = "";
//		$tel_write_buf = "";
//	UPDATE END
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("asp_bill" in global)) asp_bill = undefined;
	// if (!("asp_tax" in global)) asp_tax = undefined;
	// if (!("target" in global)) target = undefined;
	// if (!("PACT_result" in global)) PACT_result = undefined;
	// if (!("au_utiwake" in global)) au_utiwake = undefined;
	// if (!("TEL_result" in global)) TEL_result = undefined;
	// if (!("TEL_now_result" in global)) TEL_now_result = undefined;
	// if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	// if (!("year" in global)) year = undefined;
	// if (!("month" in global)) month = undefined;
	// if (!("inyear" in global)) inyear = undefined;
	// if (!("inmonth" in global)) inmonth = undefined;
	// if (!("trg_post" in global)) trg_post = undefined;
	// if (!("aspFlg" in global)) aspFlg = undefined;
	// if (!("tel_xx_write_buf" in global)) tel_xx_write_buf = undefined;
	// if (!("tel_write_buf" in global)) tel_write_buf = undefined;
	// if (!("write_buf" in global)) write_buf = undefined;
	// if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	// if (!("total_sum" in global)) total_sum = undefined;
	// if (!("Stop_Error" in global)) Stop_Error = undefined;
	// if (!("O_tab" in global)) O_tab = undefined;
	// if (!("A_prtelnos" in global)) A_prtelnos = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(infilename, "utf8");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("WARNING: ファイルのOPENに失敗しました " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " ファイルのOPENに失敗しました " + infilename);
		return false;
	}
	var text = Encoding.convert(buffer, {
		from: 'SJIS',
		to: 'UNICODE',
		type: 'string'
	});
	var lines = text.toString().split("\r\n");
	// var ifp = fopen(infilename, "r");

	if (DEBUG_FLG) {
		logging("INFO: 対象ファイル=" + infilename);
	}
// 2022cvt_015
	// var line = fgets(ifp);
	// line = mb_ereg_replace("\"", "", fgets(ifp));
	// line = mb_convert_encoding(line, "UTF-8", "auto");
// 2022cvt_015
	var line = lines[1].replace("\"", "")
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) {
			logging("WARNING: 請求先コード(au)が異なります " + readbuff[1]);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " 請求先コード(au)が異なります " + readbuff[1]);
		// fclose(ifp);
		insertClampError(pactid, "請求先コード(au)が異なります");
		return false;
	}

	O_tab.setPrtelNo(readbuff[1]);

	if (!(undefined !== A_prtelnos[readbuff[1]])) {
		A_prtelnos[readbuff[1]] = 0;
	}

	var inyear = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(0, 4));
	var inmonth = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(4, 2));

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象年月が異なります " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " 対象年月が異なります " + infilename);
		// fclose(ifp);
		return false;
	}

// 2022cvt_015
	var nowtime = getTimestamp();
// 2022cvt_015
	var copy_buf = "";
// 2022cvt_015
	var viewcnt = 1;
// 2022cvt_015
	var old_telno = "";

	for (line of lines.splice(2)) {
		out_rec_cnt++;
		readbuff = line.slice(0, -1).split(",");

		if (old_telno != readbuff[2]) //tel_XX_tbの存在チェック
			{
				if (-1 !== TEL_result.indexOf(readbuff[2]) == false) //エリアコードと種別コードにデフォルト値をセット
					//ハイフン付の電話番号作成
					//tel_tbの存在チェック
					{
// 2022cvt_015
						var area = "39";
// 2022cvt_015
						var circuit = "10";
// 2022cvt_015
						var telno_view = readbuff[2];

// 2022cvt_019
						if (telno_view.match(/\/^0[789]0\//) && telno_view.length >= 11) //070, 080, 090 のいずれかで始まっていたら"-"を入れ込む
							{
								telno_view = telno_view.substring(0, 3) + "-" + telno_view.substring(3, 4) + "-" + telno_view.substring(7);
							}

						tel_xx_write_buf += pactid + "\t" + trg_post + "\t" + readbuff[2] + "\t" + telno_view + "\t3\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";

						if (target == "n") {
							if (-1 !== TEL_now_result.indexOf(readbuff[2]) == false) {
								tel_write_buf += pactid + "\t" + trg_post + "\t" + readbuff[2] + "\t" + telno_view + "\t3\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";
							}
						}
					}

				if (aspFlg == true && old_telno != "") //合計行のために１つ表示順を空ける
					{
						viewcnt++;
						copy_buf += pactid + "\t" + old_telno + "\t" + G_CODE_ASP + "\t" + "ASP使用料" + "\t" + asp_bill + "\t\t" + viewcnt + "\t" + nowtime + "\t3\t\n";
						viewcnt++;
						copy_buf += pactid + "\t" + old_telno + "\t" + G_CODE_ASX + "\t" + "ASP使用料消費税" + "\t" + asp_tax + "\t\t" + viewcnt + "\t" + nowtime + "\t3\t\n";
					}

				if (copy_buf != "") {
					write_buf += copy_buf;
				}

				copy_buf = "";
				viewcnt = 1;
			}

// 2022cvt_015
		var code_name = readbuff[4].replace("\u3000+$", "");

		if (code_name == "") {
			code_name = "\u3000";
		}

		code_name = code_name.replace("(^\"+|\"+$)", "");
// 2022cvt_015
		var codenum = code_name.indexOf(au_utiwake.name);
		// var codenum = array_search(code_name, au_utiwake.name);

		if (codenum == -1) {
			if (DEBUG_FLG) {
				logging("ERROR: 登録されていない請求内訳文字が発見されました " + code_name);
			}
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " 登録されていない請求内訳文字が発見されました " + code_name);
			Stop_Error = true;
			// fclose(ifp);
			return false;
		}

// 2022cvt_015
		var prtelno = "";

// 2022cvt_016
		if (au_utiwake.codetype[codenum] == 0) {
			total_sum += +readbuff[5];
			prtelno = readbuff[1];
		}

		if (readbuff[4] != "") //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
			{
// 2022cvt_015
				var taxkubun = readbuff[6].replace("\u3000+$", "");
// 2022cvt_015
				var comment = readbuff[7].replace("\u3000+$", "");
				comment = comment.replace("(^\"+|\"+$)", "");
				copy_buf += pactid + "\t" + readbuff[2] + "\t" + codenum + "\t" + code_name + "\t" + readbuff[5] + "\t" + taxkubun + "\t" + viewcnt + "\t" + nowtime + "\t" + "3" + "\t" + comment + "\t" + prtelno + "\n";
				viewcnt++;
			}

		old_telno = readbuff[2];
	}

	if (aspFlg == true) //合計行のために１つ表示順を空ける
		{
			viewcnt++;
			copy_buf += pactid + "\t" + readbuff[2] + "\t" + G_CODE_ASP + "\t" + "ASP使用料" + "\t" + asp_bill + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
			viewcnt++;
			copy_buf += pactid + "\t" + readbuff[2] + "\t" + G_CODE_ASX + "\t" + "ASP使用料消費税" + "\t" + asp_tax + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
		}

	if (copy_buf != "") {
		write_buf += copy_buf;
	}

	// fclose(ifp);
	return true;
};

	async function doCopyInsert(table: string, filename: fs.PathOrFileDescriptor, columns: any[], db: ScriptDB) //ファイルを開く
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
				logh.putError(G_SCRIPT_ERROR, filename + "のデータ数が設定と異なります。データ=" + line);
				// fclose(fp);
				return 1;
			}

// 2022cvt_015
		var H_ins = {};
// 2022cvt_015
		var idx = 0;

// 2022cvt_015
		for (var col of columns) {
			H_ins[col] = A_line[idx];
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
	if (ss.length == 1) {
		ss = "0" + ss;
	}
	// var ss = tm.tm_sec + 0;
	// if (ss < 10) ss = "0" + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};

function readICfile(infilename: string, pactid: string) //対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//20110411
//$inmonth = substr( $readbuff[0], 6, 2);
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("PACT_result" in global)) PACT_result = undefined;
	// if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	// if (!("year" in global)) year = undefined;
	// if (!("month" in global)) month = undefined;
	// if (!("inyear" in global)) inyear = undefined;
	// if (!("inmonth" in global)) inmonth = undefined;
	// if (!("total_charge" in global)) total_charge = undefined;
	// if (!("O_tab" in global)) O_tab = undefined;
	// if (!("A_prtelnos" in global)) A_prtelnos = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(infilename, "utf8");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("WARNING: ファイルのOPENに失敗しました " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " ファイルのOPENに失敗しました " + infilename);
		return false;
	}
	var text = Encoding.convert(buffer, {
		from: "SJIS",
		to: "UNICODE",
		type: "string"
	});
	var lines = text.toString().split("\r\n");
	// var ifp = fopen(infilename, "r");

	if (DEBUG_FLG) logging("INFO: 対象ファイル=" + infilename);
// 2022cvt_015
	// var line = fgets(ifp);
	// line = mb_ereg_replace("\"", "", fgets(ifp));
	// line = mb_convert_encoding(line, "UTF-8", "auto");
// 2022cvt_015
	var line = lines[1].replace("\"", "");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) {
			logging("WARNING: 請求先コード(au)が異なります " + readbuff[1]);
		}
		logh.putError(G_SCRIPT_WARNING, "WARNING: 請求先コード(au)が異なります " + PACT_result + " " + pactid + " 請求先コード(au)が異なります " + readbuff[1]);
		// fclose(ifp);
		insertClampError(pactid, "請求先コード(au)が異なります");
		return false;
	}

	O_tab.setPrtelNo(readbuff[1]);

	if (!(undefined !== A_prtelnos[readbuff[1]])) {
		A_prtelnos[readbuff[1]] = 0;
	}

	var inyear = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(0, 4));
	var inmonth = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(4, 2));

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象年月が異なります " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " 対象年月が異なります " + infilename);
		// fclose(ifp);
		return false;
	}

	for (line of lines.splice(2)) {
		readbuff = line.slice(0, -1).split(",");

		if (readbuff[6].replace("\u3000+$", "") == "1" && readbuff[7].replace("\u3000+$", "") == "C50000") {
			total_charge = parseInt(total_charge + readbuff[3]);
			A_prtelnos[readbuff[1]] += readbuff[3];
		}
	}

	return true;
};

function readSCfile(infilename: string, pactid: string) //内訳コードのエラー 20091208miya
//チェック済みの内訳コード 20091208miya
//20110511
//20110411
//20110511
//20110516
//チェック済みの内訳コード 20091208miya
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//20110411
//現在の日付を得る
//レコード毎の処理
//UPDATE バグ対応 2005/12/12 kenichiro uesugi
//		$tel_xx_write_buf = "";
//		$tel_write_buf = "";
//	UPDATE END
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("asp_bill" in global)) asp_bill = undefined;
	// if (!("asp_tax" in global)) asp_tax = undefined;
	// if (!("target" in global)) target = undefined;
	// if (!("PACT_result" in global)) PACT_result = undefined;
	// if (!("au_utiwakecode" in global)) au_utiwakecode = undefined;
	// if (!("TEL_result" in global)) TEL_result = undefined;
	// if (!("TEL_now_result" in global)) TEL_now_result = undefined;
	// if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	// if (!("year" in global)) year = undefined;
	// if (!("month" in global)) month = undefined;
	// if (!("inyear" in global)) inyear = undefined;
	// if (!("inmonth" in global)) inmonth = undefined;
	// if (!("trg_post" in global)) trg_post = undefined;
	// if (!("aspFlg" in global)) aspFlg = undefined;
	// if (!("tel_xx_write_buf" in global)) tel_xx_write_buf = undefined;
	// if (!("tel_write_buf" in global)) tel_write_buf = undefined;
	// if (!("write_buf" in global)) write_buf = undefined;
	// if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	// if (!("total_sum" in global)) total_sum = undefined;
	// if (!("Stop_Error" in global)) Stop_Error = undefined;
	// if (!("Utiwake_Error" in global)) Utiwake_Error = undefined;
	// if (!("A_checked_code" in global)) A_checked_code = undefined;
	// if (!("A_unregist_code" in global)) A_unregist_code = undefined;
	// if (!("O_tab" in global)) O_tab = undefined;
	// if (!("utiwake_fp" in global)) utiwake_fp = undefined;
	// if (!("unregistCode" in global)) unregistCode = undefined;
	// if (!("A_prtelnos" in global)) A_prtelnos = undefined;
// 2022cvt_016
// 2022cvt_015
	var H_taxtype = {
		"1": "1",
		"0": "4",
		"2": "3",
		"9": "0",
		"": "0"
	};

	if (false == Array.isArray(A_checked_code)) {
		A_checked_code = Array();
	}

	if (false == Array.isArray(A_unregist_code)) //20110511
		{
			A_unregist_code = Array();
		}

	if (!Array.isArray(unregistCode)) {
		unregistCode = Array();
	}

// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(infilename, "utf8");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("WARNING: ファイルのOPENに失敗しました " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " ファイルのOPENに失敗しました " + infilename);
		return false;
	}
	var text = Encoding.convert(buffer, {
		from: "SJIS",
		to: "UNICODE",
		type: "string"
	});
	var lines = text.toString().split("\r\n");
	// var ifp = fopen(infilename, "r");

	if (DEBUG_FLG) {
		logging("v" + infilename);
	}
// 2022cvt_015
	// var line = fgets(ifp);
	// line = mb_ereg_replace("\"", "", fgets(ifp));
	// line = mb_convert_encoding(line, "UTF-8", "auto");
// 2022cvt_015
	var line = lines[1].replace("\"", "");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) {
			logging("WARNING: 請求先コード(au)が異なります " + readbuff[1]);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " 請求先コード(au)が異なります " + readbuff[1]);
		// fclose(ifp);
		insertClampError(pactid, "請求先コード(au)が異なります");
		return false;
	}

	O_tab.setPrtelNo(readbuff[1]);

	if (!(undefined !== A_prtelnos[readbuff[1]])) {
		A_prtelnos[readbuff[1]] = 0;
	}

	var inyear = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(0, 4));
	var inmonth = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(4, 2));

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象年月が異なります " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " 対象年月が異なります " + infilename);
		// fclose(ifp);
		return false;
	}

// 2022cvt_015
	var nowtime = getTimestamp();
// 2022cvt_015
	var copy_buf = "";
// 2022cvt_015
	var viewcnt = 1;
// 2022cvt_015
	var old_telno = "";

	for (var line of lines.splice(2)) {
		out_rec_cnt++;
		readbuff = line.slice(0, -1).split(",");

		if (old_telno != readbuff[2]) //tel_XX_tbの存在チェック
			{
				if (-1 !== TEL_result.indexOf(readbuff[2]) == false) //エリアコードと種別コードにデフォルト値をセット
					//ハイフン付の電話番号作成
					//tel_tbの存在チェック
					{
// 2022cvt_015
						var area = "39";
// 2022cvt_015
						var circuit = "10";
// 2022cvt_015
						var telno_view = readbuff[2];

// 2022cvt_019
						if (telno_view.match(/\/^0[789]0\//) && telno_view.length >= 11)
						// if (preg_match("/^0[789]0/", telno_view) && telno_view.length >= 11) //070, 080, 090 のいずれかで始まっていたら"-"を入れ込む
							{
								telno_view = telno_view.substring(0, 3) + "-" + telno_view.substring(3, 4) + "-" + telno_view.substring(7);
							}

						tel_xx_write_buf += pactid + "\t" + trg_post + "\t" + readbuff[2] + "\t" + telno_view + "\t3\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";

						if (target == "n") {
							if (-1 !== TEL_now_result.indexOf(readbuff[2]) == false) {
								tel_write_buf += pactid + "\t" + trg_post + "\t" + readbuff[2] + "\t" + telno_view + "\t3\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";
							}
						}
					}

				if (aspFlg == true && old_telno != "") //合計行のために１つ表示順を空ける
					{
						viewcnt++;
						copy_buf += pactid + "\t" + old_telno + "\t" + G_CODE_ASP + "\t" + "ASP使用料" + "\t" + asp_bill + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
						viewcnt++;
						copy_buf += pactid + "\t" + old_telno + "\t" + G_CODE_ASX + "\t" + "ASP使用料消費税" + "\t" + asp_tax + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
					}

				if (copy_buf != "") {
					write_buf += copy_buf;
				}

				copy_buf = "";
				viewcnt = 1;
			}

		if (!(undefined !== au_utiwakecode[readbuff[9]])) {
			if (DEBUG_FLG) {
				logging("ERROR: 登録されていない請求内訳コードが発見されました " + readbuff[9] + "-" + readbuff[2]);
			}

			if (false == (-1 !== A_checked_code.indexOf(readbuff[9]))) //20110511
				{
					A_checked_code.push(readbuff[9]);
					logh.putError(G_SCRIPT_WARNING, "import_aubill.php au請求データ取込処理 " + PACT_result + " " + pactid + " 登録されていない請求内訳コードが発見されました " + readbuff[9] + "-" + readbuff[2]);
// 2022cvt_016
					fs.writeFileSync(utiwake_fp, readbuff[9] + "\t" + readbuff[4] + "\t" + H_taxtype[readbuff[10].trim()] + "\t" + "6\t" + "4\t" + "3\t" + nowtime + "\t" + nowtime + "\n");// 2022cvt_006
					unregistCode.push([readbuff[9] + "-" + readbuff[2], "unregist", pactid, 3]);
					Utiwake_Error = true;
				}
		} else if ("4" == au_utiwakecode[readbuff[9]]) {
			if (false == (-1 !== A_unregist_code.indexOf(readbuff[9]))) {
				A_unregist_code.push(readbuff[9]);
// 2022cvt_016
				if (DEBUG_FLG) {
					logging("v" + readbuff[2] + "のcodetypeが仮登録のままです");
				}
				unregistCode.push([readbuff[9] + "-" + readbuff[2], "interim", pactid, 3]);
				unregistCode.push([readbuff[9] + "-" + readbuff[2], "unregist", pactid, 3]);
				Utiwake_Error = true;
			}
		}

// 2022cvt_015
		var prtelno = "";

		if ("1" == readbuff[8] && "C50000" != readbuff[9]) {
			total_sum += +readbuff[5];
			prtelno = readbuff[1];
		} else if ("C50000" == readbuff[9]) {
			prtelno = readbuff[1];
		}

		if (readbuff[4] != "") //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
			//前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
			{
// 2022cvt_015
				var code_name = readbuff[4].replace("\u3000+$", "");
				code_name = code_name.replace("(^\"+|\"+$)", "");
// 2022cvt_015
				var taxkubun = readbuff[6].replace("\u3000+$", "");
// 2022cvt_015
				var comment = readbuff[7].replace("\u3000+$", "");
				comment = comment.replace("(^\"+|\"+$)", "");
				copy_buf += pactid + "\t" + readbuff[2] + "\t" + readbuff[9] + "\t" + code_name + "\t" + readbuff[5] + "\t" + taxkubun + "\t" + viewcnt + "\t" + nowtime + "\t" + "3" + "\t" + comment + "\t" + prtelno + "\n";
				viewcnt++;
			}

		old_telno = readbuff[2];
	}

	if (aspFlg == true) //合計行のために１つ表示順を空ける
		{
			viewcnt++;
			copy_buf += pactid + "\t" + readbuff[2] + "\t" + G_CODE_ASP + "\t" + "ASP使用料" + "\t" + asp_bill + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
			viewcnt++;
			copy_buf += pactid + "\t" + readbuff[2] + "\t" + G_CODE_ASX + "\t" + "ASP使用料消費税" + "\t" + asp_tax + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
		}

	if (copy_buf != "") {
		write_buf += copy_buf;
	}

	// fclose(ifp);
	return true;
};

function insertClampError(pactid: string, message: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_016
// 2022cvt_015
	var sql = "insert into clamp_error_tb" + "(pactid,carid,error_type,message,is_send,recdate,fixdate)" + "values" + "(" + pactid + "," + 3 + ",'prtelno'" + ",'" + message + "'" + ",false" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/") + "'" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/") + "'" + ")" + ";";
	dbh.query(sql);
	return true;
};

	async function insertUtiwakeCode(utiwake_filename: string, logh: ScriptLogAdaptor, dbh: ScriptDB) {
	if (0 != fs.statSync(utiwake_filename).size) {
	// if (0 != filesize(utiwake_filename)) {
// 2022cvt_016
// 2022cvt_015
		var utiwake_col = ["code", "name", "taxtype", "kamoku", "codetype", "carid", "fixdate", "recdate"];
// 2022cvt_015
		var rtn = await doCopyInsert("utiwake_tb", utiwake_filename, utiwake_col, dbh);

		if (0 != rtn) {
			if (DEBUG_FLG) {
				logging("ERROR: utiwake_tbのデータインポートに失敗しました ");
			}
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au請求データ取込処理 utiwake_tbのデータインポートに失敗しました ");
			return false;
		} else {
			if (DEBUG_FLG) {
				logging("INFO: utiwake_tbのデータインポートを行いました " + utiwake_filename);
			}
			logh.putError(G_SCRIPT_INFO, "import_aubill.php au請求データ取込処理 utiwake_tbのデータインポートを行いました " + utiwake_filename);
		}
	}

	return true;
};
})();
