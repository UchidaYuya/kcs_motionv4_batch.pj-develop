// error_reporting(E_ALL);// 2022cvt_011
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_autuwa.php";
const AU_DIR = "/au";

import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR, sprintf } from "../../db_define/define";
// 2022cvt_026
import TableNo, { ScriptDB, TableInserter } from "../batch/lib/script_db";
// require("lib/script_db.php");

// 2022cvt_026
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../batch/lib/script_log";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as flock from "proper-lockfile";
import { expDataByCursor, pg_fetch_array } from "../pg_function";

// require("lib/script_log.php");

(async () => {
const AU_BILL_DIR = AU_DIR + "/bill";
const AU_TUWA_DIR = AU_DIR + "/tuwa";
const FUNCTION_KOUSI = "47";
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
var backup = "";
var mode = "";

if (process.argv.length != 5 + 1) //数が正しくない
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
					var billdate = process.argv[cnt].replace("^-y=", "");
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
					pactid = process.argv[cnt].replace("^-p=", "").toLowerCase();
					// var pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!pactid.match("^all$") && !pactid.match("^[0-9]+$")) {
					// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("会社コードの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match(/^-b=/))
			// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
				{
// 2022cvt_015
					backup = process.argv[cnt].replace("^-b=", "").toLowerCase();
					// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!backup.match("^[ny]$")) {
					// if (ereg("^[ny]$", backup) == false) {
						usage("バックアップの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			usage("パラメータの指定が不正です。" + process.argv[0]);
		}
	}

logh.putError(G_SCRIPT_BEGIN, "import_autuwa.php au通話・通信データ取込処理 処理を開始します");
// 2022cvt_015
var dataDir = DATA_DIR + "/" + year + month + AU_TUWA_DIR;

if (pactid == "all") {
	if (fs.existsSync(dataDir) == false) //エラー終了// 2022cvt_003
		{
			logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 au請求データディレクトリ（" + dataDir + "）がみつかりません");
			throw process.exit(1);// 2022cvt_009
		}
} else {
	if (fs.existsSync(dataDir + "/" + pactid) == false) //エラー終了// 2022cvt_003
		{
			logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 au請求データディレクトリ（" + dataDir + "/" + pactid + "）がみつかりません");
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
	logging("START: au通話・通信データ取込処理(import_autuwa.php)を開始します");
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
		logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 Pact用データディレクトリが１つもありません");
		throw process.exit(1);// 2022cvt_009
	}

if (await lock(true, dbh) == false) {
	if (DEBUG_FLG) {
		logging("ERROR: import_autuwa.php au通話・通信データ取込処理  既に起動しています");
	}
	logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理  既に起動しています");
	throw process.exit(1);// 2022cvt_009
}

// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var commX_tb = "commhistory_" + tableNo + "_tb";
// 2022cvt_015
var infoX_tb = "infohistory_" + tableNo + "_tb";
// 2022cvt_015
var telX_tb = "tel_" + tableNo + "_tb";
if (DEBUG_FLG) {
	logging("INFO: 対象テーブル " + commX_tb + " & " + infoX_tb);
}
// 2022cvt_015
var comm_xx_filename = dataDir + "/" + commX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var comm_xx_fp;
try {
	comm_xx_fp = fs.openSync(comm_xx_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + comm_xx_filename + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 " + comm_xx_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var comm_xx_fp = fopen(comm_xx_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: commhistory_XX_tbへのcopy文ファイルOPEN" + comm_xx_filename);
}
// 2022cvt_015
var info_xx_filename = dataDir + "/" + infoX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var info_xx_fp;
try {
	info_xx_fp = fs.openSync(info_xx_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + info_xx_fp + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 " + info_xx_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var info_xx_fp = fopen(info_xx_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: infohistory_XX_tbへのcopy文ファイルOPEN " + info_xx_filename);
}
// 2022cvt_015
var kousi_totel_filename = dataDir + "/kousi_totel_master_tb" + year + month + pactid + ".ins";
// 2022cvt_015
var kousi_totel_fp;
try {
	kousi_totel_fp = fs.openSync(kousi_totel_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + kousi_totel_fp + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 " + kousi_totel_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var kousi_totel_fp = fopen(kousi_totel_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: kousi_totel_master_tbへのcopy文ファイルOPEN " + kousi_totel_filename);
}
// 2022cvt_015
var fin_cnt = 0;
var fin_pact: Array<any> = [];

for (cnt = 0; cnt < pactCnt; cnt++) //公私分計対応  2006.08.18 UPDATE 上杉顕一郎
//対象会社の会社名を取得
//対象会社の公私設定情報を取得 2006.08.18 UPDATE 上杉顕一郎
//2006.08.18 UPDATE END
//明細データファイル名を取得する
//処理する明細データファイル名配列
//明細データファイルが１つもなかった場合
//UPDATE END 2009/04/09
//請求先コード（親番号）が１つもなかった場合
//通常エラーの場合はファイルに出力せずに次の会社の処理を行う
//2006.08.18 UPDATE 上杉顕一郎
//2006.08.18 UPDATE 上杉顕一郎
//会社単位に終了ログを出力
{
// 2022cvt_015
	var out_rec_cnt = 0;
// 2022cvt_015
	var error_flg = false;
// 2022cvt_015
	var comm_write_buf = "";
// 2022cvt_015
	var info_write_buf = "";
// 2022cvt_015
	var kousi_totel_buf = "";
// 2022cvt_015
	var PACT_result = await dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) {
			logging("WARNING:  対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象会社の会社名を取得 " + PACT_result);
	}
	if (DEBUG_FLG) {
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "のデータの処理を開始します");
	}
	logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 処理を開始します");
// 2022cvt_015
	var PACT_Koushi_result = await dbh.getOne("select count(*) from fnc_relation_tb where fncid = " + FUNCTION_KOUSI + " and pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_Koushi_result != 1) {
		if (DEBUG_FLG) {
			logging("INFO: 会社権限で公私分計はしません。");
		}
	} else //更に通話判別方式を利用するか？
		{
// 2022cvt_015
			var PACT_Tuwa_result = await dbh.getHash("select kousi_pattern_tb.comhistflg, kousi_pattern_tb.comhistbaseflg from kousi_default_tb join kousi_pattern_tb on (kousi_default_tb.patternid=kousi_pattern_tb.patternid) where kousi_default_tb.pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);
// 2022cvt_015
			var Pact_tuwa_Cnt = PACT_Tuwa_result.length;

			if ((Pact_tuwa_Cnt > 0) && (PACT_Tuwa_result[0].comhistflg != 1)) {
				if (DEBUG_FLG) {
					logging("INFO: 会社権限で公私分計はするが、デフォルトでは通話判別方式を使用しません。");
				}
			} else {
				if (DEBUG_FLG) {
					logging("NFO: 会社権限で公私分計は行い、デフォルトで通話判別方式を使用します。");
				}
			}
		}

// 2022cvt_015
	var A_billFile = Array();
// 2022cvt_015
	var dataDirPact = dataDir + "/" + A_pactid[cnt];
	var dirh = fs.readdirSync(dataDirPact);
	// dirh = openDir(dataDirPact);// 2022cvt_004

	for (var fileName of dirh) {
	// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_019
		if (fileName.match("/^TM.*\\.csv$/i") || fileName.match("/^EM.*\\.csv$/i") || fileName.match("/^YG.*\\.csv$/i") || fileName.match("/^BT.*\\.csv$/i") || fileName.match("/^BU.*\\.csv$/i")) {
		// if (preg_match("/^TM.*\\.csv$/i", fileName) || preg_match("/^EM.*\\.csv$/i", fileName) || preg_match("/^YG.*\\.csv$/i", fileName) || preg_match("/^BT.*\\.csv$/i", fileName) || preg_match("/^BU.*\\.csv$/i", fileName)) {
			A_billFile.push(fileName);
			if (DEBUG_FLG) {
				logging("INFO: 対象明細データファイル名 " + fileName);
			}
		}

// 		clearstatcache();// 2022cvt_012
	}

	// closedir(dirh);
// 2022cvt_015
	var fileCnt = A_billFile.length;

	if (fileCnt == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象ファイルが１つもみつかりません（" + dataDirPact + "）");
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 対象ファイルが１つもみつかりません（" + dataDirPact + "）");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象請求データファイル数 " + fileCnt);
	}
// 2022cvt_015
	var TEL_result = await dbh.getHash("select teltb.telno, teltb.cirid, " + "CASE WHEN plan_tb.charge_mode = NULL THEN packet_tb.charge " + "WHEN plan_tb.charge = NULL THEN packet_tb.charge_mode " + "WHEN plan_tb.charge_mode > packet_tb.charge THEN packet_tb.charge " + "ELSE plan_tb.charge_mode END AS charge " + "from  " + telX_tb + "  teltb LEFT OUTER JOIN plan_tb ON teltb.carid = plan_tb.carid and teltb.arid = plan_tb.arid and teltb.planid = plan_tb.planid " + "LEFT OUTER JOIN packet_tb ON teltb.carid = packet_tb.carid and teltb.arid = packet_tb.arid and teltb.packetid = packet_tb.packetid " + "where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
// 2022cvt_015
	var TEL_result_cnt = TEL_result.length;

	if (TEL_result_cnt == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 電話が１つも登録されていません" + " select teltb.telno, teltb.cirid, packet_tb.charge from " + telX_tb + " teltb LEFT OUTER JOIN packet_tb" + " ON teltb.carid = packet_tb.carid and teltb.arid = packet_tb.arid and teltb.packetid = packet_tb.packetid where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 電話が１つも登録されていません");
		continue;
	}

	var tel_info: { [key: string]: any } = {};

// 2022cvt_015
	for (var acnt = 0; acnt < TEL_result_cnt; acnt++) {
		tel_info.telno[acnt] = TEL_result[acnt].telno;
		tel_info.cirid[acnt] = TEL_result[acnt].cirid;
		tel_info.charge[acnt] = TEL_result[acnt].charge;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象会社の登録電話のリストを取得 " + TEL_result_cnt + "\u4EF6 select teltb.telno, teltb.cirid, packet_tb.charge from " + telX_tb + " teltb LEFT OUTER JOIN packet_tb" + " ON teltb.carid = packet_tb.carid and teltb.arid = packet_tb.arid where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
	}
// 2022cvt_015
	var PrTEL_result = await dbh.getCol("select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
// 2022cvt_015
	var PrTelCnt = PrTEL_result.length;

	if (PrTelCnt == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 請求先コード（親番号）が１つも登録されていません" + "select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 請求先コード（親番号）が１つも登録されていません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 請求先コード（親番号）を取得 " + PrTelCnt + "件 select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(pactid) + " ;");
	}

// 2022cvt_015
	for (var fcnt = 0; fcnt < fileCnt; fcnt++) {
		if (DEBUG_FLG) {
			logging("INFO: 対象ファイルチェック " + A_billFile[fcnt]);
		}

// 2022cvt_019
		if (A_billFile[fcnt].match("/^TM.*\\.csv$/i"))
		// if (preg_match("/^TM.*\\.csv$/i", A_billFile[fcnt])) //通話明細ファイル
			{
				if (DEBUG_FLG) {
					logging("INFO: 通話明細ファイルの取込み開始 " + A_billFile[fcnt]);
				}

				if (await readTMfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt], dbh) == false) {
					error_flg = true;
				}
// 2022cvt_019
			} else if (A_billFile[fcnt].match("/^EM.*\\.csv$/i"))
			//  (preg_match("/^EM.*\\.csv$/i", A_billFile[fcnt])) //explus明細ファイル
			{
				if (DEBUG_FLG) {
					logging("INFO: ezplus明細ファイルの取込み開始 " + A_billFile[fcnt]);
				}

				if (readEMfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
					error_flg = true;
				}
// 2022cvt_019
			} else if (A_billFile[fcnt].match("/^YG.*\\.csv$/i"))
				// preg_match("/^YG.*\\.csv$/i", A_billFile[fcnt])) //有料情報明細ファイル
			{
				if (DEBUG_FLG) {
					logging("INFO: 有料情報明細ファイルの取込み開始 " + A_billFile[fcnt]);
				}

				if (readYGfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
					error_flg = true;
				}
// 2022cvt_019
			} else if (A_billFile[fcnt].match("/^BT.*\\.csv$/i"))
				// preg_match("/^BT.*\\.csv$/i", A_billFile[fcnt])) //通話明細（分計）ファイル
			{
				if (DEBUG_FLG) {
					logging("INFO: 通話明細（分計）ファイルの取込み開始 " + A_billFile[fcnt]);
				}

				if (await readBTfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt], dbh) == false) {
					error_flg = true;
				}
// 2022cvt_019
			} else if (A_billFile[fcnt].match("/^BU.*\\.csv$/i"))
				// preg_match("/^BU.*\\.csv$/i", A_billFile[fcnt])) //通話明細（分計）ファイル
			{
				if (DEBUG_FLG) {
					logging("INFO: auかんたん決済利用料明細ファイルの取込み開始 " + A_billFile[fcnt]);
				}

				if (readBUfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
				// if (readBUfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt], dbh) == false) {
					error_flg = true;
				}
			}
	}

	if (error_flg == true) {
		continue;
	};
	fs.writeFileSync(comm_xx_fp, comm_write_buf);// 2022cvt_006
	// fflush(comm_xx_fp);
	fs.writeFileSync(info_xx_fp, info_write_buf);// 2022cvt_006
	// fflush(info_xx_fp);
	fs.writeFileSync(kousi_totel_fp, kousi_totel_buf);// 2022cvt_006
	// fflush(kousi_totel_fp);
	if (DEBUG_FLG) {
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "件のデータの処理を行いました");
	}
	logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " pactid=" + A_pactid[cnt] + ` . ${out_rec_cnt}` + "件の処理を行いました");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fs.closeSync(comm_xx_fp);
// fclose(comm_xx_fp);
fs.closeSync(info_xx_fp);
// fclose(info_xx_fp);
fs.closeSync(kousi_totel_fp);
// fclose(kousi_totel_fp);

if (fin_cnt < 1) {
	if (DEBUG_FLG) {
		logging("ERROR: １件も成功しませんでした");
	}
	logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 １件も成功しませんでした");
	throw process.exit(1);// 2022cvt_009
}

dbh.begin();

if (backup == "y") //commhistory_XX_tbのバックアップ
	//エクスポート失敗した場合
	//infohistory_XX_tbのバックアップ
	//エクスポート失敗した場合
	//2006.08.18 UPDATE 上杉顕一郎
	//kousi_totel_master_tbのバックアップ
	//エクスポート失敗した場合
	//2006.08.18 UPDATE END
	{
// 2022cvt_015
		var commX_exp = DATA_EXP_DIR + "/" + commX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
// 2022cvt_015
		var sql_str = "select * from " + commX_tb;
// 2022cvt_015
		var rtn = expDataByCursor(sql_str, commX_exp, dbh.m_db);

		if (rtn != 1) {
			if (DEBUG_FLG) {
				logging("ERROR: " + commX_tb + "のデータエクスポートに失敗しました ");
			}
			logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 " + commX_tb + "のデータエクスポートに失敗しました" + commX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + commX_tb + "のデータエクスポートを行いました " + commX_exp);
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 " + commX_tb + "のデータエクスポートを行いました" + commX_exp);
		}

// 2022cvt_015
		var infoX_exp = DATA_EXP_DIR + "/" + infoX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
		sql_str = "select * from " + infoX_tb;
		rtn = expDataByCursor(sql_str, infoX_exp, dbh.m_db);

		if (rtn != 1) {
			if (DEBUG_FLG) {
				logging("ERROR: " + infoX_tb + "のデータエクスポートに失敗しました ");
			}
			logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 " + infoX_tb + "のデータエクスポートに失敗しました" + infoX_exp);
		} else {
			if (DEBUG_FLG) {
				logging("INFO: " + infoX_tb + "のデータエクスポートを行いました " + infoX_exp);
			}
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 " + infoX_tb + "のデータエクスポートを行いました" + infoX_exp);
		}

// 2022cvt_015
		var kousi_totel_exp = DATA_EXP_DIR + "/kousi_totel_master_tb" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
		sql_str = "select * from kousi_totel_master_tb";
		rtn = expDataByCursor(sql_str, kousi_totel_exp, dbh.m_db);

		if (rtn != 1) {
			if (DEBUG_FLG) {
				logging("ERROR:kousi_totel_master_tbのデータエクスポートに失敗しました ");
			}
			logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 kousi_totel_master_tbのデータエクスポートに失敗しました" + kousi_totel_exp);
		} else {
			if (DEBUG_FLG) {
				logging("INFO:kousi_totel_master_tbのデータエクスポートを行いました " + kousi_totel_exp);
			}
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 kousi_totel_master_tbのデータエクスポートを行いました" + kousi_totel_exp);
		}
	}

// 2022cvt_015
var pactin = "";

for (cnt = 0; cnt < fin_cnt; cnt++) {
	pactin += fin_pact[cnt] + ",";
}

pactin = pactin.replace(",", "");
// pactin = rtrim(pactin, ",");

if (mode == "o") //commhistory_XX_tbの削除
	//infohistory_XX_tbの削除
	{
		dbh.query("delete from " + commX_tb + " where carid = 3 and pactid IN(" + pactin + ");", true);
		if (DEBUG_FLG) {
			logging("INFO: " + commX_tb + "の既存データの削除を行いました " + "delete from " + commX_tb + " where carid = 3 pactid IN(" + pactin + ");");
		}
		logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 " + commX_tb + "の既存データの削除を行いました");
		dbh.query("delete from " + infoX_tb + " where carid = 3 and pactid IN(" + pactin + ");", true);
		if (DEBUG_FLG) {
			logging("INFO: " + infoX_tb + "の既存データの削除を行いました " + "delete from " + infoX_tb + " where carid = 3 pactid IN(" + pactin + ");");
		}
		logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 " + infoX_tb + "の既存データの削除を行いました");
	}

if (fs.statSync(comm_xx_filename).size != 0)
// if (filesize(comm_xx_filename) != 0) //commhistory_XX_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_016
// 2022cvt_015
		var commhistory_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "byte", "callseg", "callsegname", "discountseg", "occupseg", "carid", "kousiflg", "sendrec", "callsegname"];
		var rtn2 = await doCopyInsert(commX_tb, comm_xx_filename, commhistory_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + commX_tb + "のデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 " + commX_tb + "のデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + commX_tb + "のデータインポートを行いました " + comm_xx_filename);
			}
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 " + commX_tb + "のデータインポートを行いました " + comm_xx_filename);
		}
	}

if (fs.statSync(info_xx_filename).size != 0)
// if (filesize(info_xx_filename) != 0) //commhistory_XX_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var infohistory_col = ["pactid", "telno", "sitename", "fromdate", "accounting", "charge", "carid"];
		var rtn2 = await doCopyInsert(infoX_tb, info_xx_filename, infohistory_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + infoX_tb + "のデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 " + infoX_tb + "のデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + infoX_tb + "のデータインポートを行いました " + info_xx_filename);
			}
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 " + infoX_tb + "のデータインポートを行いました " + info_xx_filename);
		}
	}

dbh.query("delete from kousi_totel_master_tb where carid = 3 and kousiflg = '2' and pactid IN(" + pactin + ");", true);
if (DEBUG_FLG) {
	logging("INFO:kousi_totel_master_tbの既存データで未登録のデータの削除を行いました " + "delete from kousi_totel_master_tb where carid = 3 and kousiflg = '2' and pactid IN(" + pactin + ");");
}
logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 kousi_totel_master_tbの既存データの削除を行いました");

if (fs.statSync(kousi_totel_filename).size != 0) //kousi_totel_master_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var kousi_totel_col = ["pactid", "telno", "carid", "totelno", "kousiflg", "memo"];
		var rtn2 = await doCopyInsert("kousi_totel_master_tb", kousi_totel_filename, kousi_totel_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR:kousi_totel_master_tbのデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理 kousi_totel_master_tbのデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO:kousi_totel_master_tbのデータインポートを行いました " + kousi_totel_filename);
			}
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理 kousi_totel_master_tbのデータインポートを行いました " + kousi_totel_filename);
		}
	}

dbh.commit();

for (cnt = 0; cnt < fin_cnt; cnt++) //ファイルの移動
{
// 2022cvt_015
	var finDir = dataDir + "/" + fin_pact[cnt] + "/fin";

	if (fs.existsSync(finDir) == false) //完了ディレクトリの作成// 2022cvt_003
		{
			try {
				fs.mkdirSync(finDir, 700);
				if (DEBUG_FLG) {
					logging("INFO: 完了ディレクトリの作成しました " + finDir);
				}
				logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理  完了ディレクトリの作成しました " + finDir);
			} catch (e) {
				if (DEBUG_FLG) {
					logging("ERROR: 完了ディレクトリの作成に失敗しました " + finDir);
				}
				logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理  完了ディレクトリの作成に失敗しました " + finDir);
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
		if (fs.statSync(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName) || copyfileName.match("/^EM.*\\.csv$/i") || copyfileName.match("/^YG.*\\.csv$/i") || copyfileName.match("/^BT.*\\.csv$/i") || copyfileName.match("/^BU.*\\.csv$/i")) {
			try {
				fs.renameSync(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName);
				if (DEBUG_FLG) {
					logging("INFO: ファイルの移動をしました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				}
				logh.putError(G_SCRIPT_INFO, "import_autuwa.php au通話・通信データ取込処理  ファイルの移動をしました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			} catch (e) {
				if (DEBUG_FLG) {
					logging("ERROR: ファイルの移動に失敗しました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				}
				logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au通話・通信データ取込処理  ファイルの移動に失敗しました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				throw process.exit(1);// 2022cvt_009
			}
		}

// 		clearstatcache();// 2022cvt_012
	}

	// closedir(dirh);
}

lock(false, dbh);
if (DEBUG_FLG) {
	logging("END: au通話・通信データ取込処理(import_autuwa.php)を終了しました");
}
logh.putError(G_SCRIPT_END, "import_autuwa.php au通話・通信データ取込処理 処理を終了しました");
throw process.exit(0);// 2022cvt_009

function usage(comment: string) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} \n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ	 (Y:バックアップする,N:バックアップしない)\n");
	throw process.exit(1);// 2022cvt_009
};

	async function lock(is_lock: boolean, db: ScriptDB) //ロックする
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
			var count = await db.getOne(sql);

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
	flock.unlockSync(global.LocalLogFile);
	// flock(lfp, LOCK_UN);
	fs.closeSync(lfp);
	// fclose(lfp);
	return;
};

	async function readTMfile(infilename: string, pactid: string, dbh: ScriptDB) //公私分計対応  2006.08.18 UPDATE 上杉顕一郎
//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
//対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//$inmonth = substr( $readbuff[0], 6, 2);
//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("PACT_result" in global)) PACT_result = undefined;
	// if (!("tel_info" in global)) tel_info = undefined;
	// if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	// if (!("year" in global)) year = undefined;
	// if (!("month" in global)) month = undefined;
	// if (!("inyear" in global)) inyear = undefined;
	// if (!("inmonth" in global)) inmonth = undefined;
	// if (!("comm_write_buf" in global)) comm_write_buf = undefined;
	// if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	// if (!("PACT_Koushi_result" in global)) PACT_Koushi_result = undefined;
	// if (!("PACT_Tuwa_result" in global)) PACT_Tuwa_result = undefined;
	// if (!("kousi_totel_buf" in global)) kousi_totel_buf = undefined;
// 2022cvt_015
	var Tel_Tuwa_cnt: number = 0;
	var tel_Tuwa_result: Array<any> = [];
	var buffer;
	try {
		buffer = fs.readFileSync(infilename, "utf8");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("WARNING: ファイルのOPENに失敗しました " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " ファイルのOPENに失敗しました " + infilename);
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
		logging("INFO: 対象ファイル=" + infilename);
	}
// 2022cvt_015
	var line = lines[1].replace("\"", "");
	// var line = fgets(ifp);
	// line = mb_ereg_replace("\"", "", fgets(ifp));
	// line = mb_convert_encoding(line, "UTF-8", "auto");
// 2022cvt_015
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) {
			logging("WARNING: 請求先コード(au)が異なります " + readbuff[1]);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理" + PACT_result + " " + pactid + " 請求先コード(au)が異なります " + readbuff[1]);
		// fclose(ifp);
		insertClampError(pactid, "請求先コード(au)が異なります");
		return false;
	}

	var inyear = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(0, 4));
	var inmonth = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(4, 2));

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象年月が異なります " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " 対象年月が異なります " + infilename);
		// fclose(ifp);
		return false;
	}

// 2022cvt_015
	var oldTelno = "";
// 2022cvt_015
	var koushiFlg = false;

	var toTEL_info: { [key: string]: any } = {};
	var toTEL_copy: Array<any> = [];
	var comhistbaseflg = "";

	for (line of lines.splice(2)) {
		out_rec_cnt++;
		// line = mb_convert_encoding(line, "UTF-8", "auto");
		readbuff = line.slice(0, -1).split(",");
		// readbuff = chop(line).split(",");
// 2022cvt_015
		var readbuff_cnt = readbuff.length;

// 2022cvt_015
		for (var acnt = 0; acnt < readbuff_cnt; acnt++) //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
		{
			readbuff[acnt] = readbuff[acnt].replace("(^\u3000+|\u3000+$)", "");
			readbuff[acnt] = readbuff[acnt].replace("(^\\s+|\\s+$)", "");
			readbuff[acnt] = readbuff[acnt].replace("(^\"+|\"+$)", "");
		}

		if (oldTelno != readbuff[2]) //対象電話は公私分計をするか？
			{
// 2022cvt_015
				var tel_Koushi_result = await dbh.getOne("select kousiflg from tel_tb where carid = 3 and pactid = " + pactid + " and telno = '" + readbuff[2] + "';", true);

				if (tel_Koushi_result == 0) //またその電話は通話判別方式か？
					//インポートファイルの空行対策 2007/03/07 UPDATE 石崎
					{
// 2022cvt_015
						tel_Tuwa_result = await dbh.getHash("select kousi_pattern_tb.comhistflg,  kousi_pattern_tb.comhistbaseflg from tel_tb join kousi_pattern_tb on (tel_tb.kousiptn=kousi_pattern_tb.patternid) where tel_tb.kousiflg='0' and kousi_pattern_tb.comhistflg='1' and tel_tb.carid = 3 and tel_tb.pactid = " + pactid + " and tel_tb.telno = '" + readbuff[2] + "';", true);
// 2022cvt_015
						Tel_Tuwa_cnt = tel_Tuwa_result.length;

						if (undefined !== tel_Tuwa_result[0].comhistflg == false) {} else if (Tel_Tuwa_cnt > 0) {
							if (tel_Tuwa_result[0].comhistflg == 1) {
								if (DEBUG_FLG) {
									logging("INFO: 対象電話(" + readbuff[2] + ")は通話判別方式です。");
								}
								if (DEBUG_FLG) {
									logging("INFO: 未登録電話は" + tel_Tuwa_result[0].comhistbaseflg);
								}
								koushiFlg = true;
							} else {
								if (DEBUG_FLG) {
									logging("INFO: 対象電話(" + readbuff[2] + ")は通話判別方式ではありません。");
								}
								koushiFlg = false;
							}
						} else {
							if ((tel_Koushi_result == undefined) && (PACT_Koushi_result == 1) && (PACT_Tuwa_result[0].comhistflg == 1)) //会社の公私設定は設定され、通話判別方式か？
								{
									if (DEBUG_FLG) {
										logging("INFO: 対象電話(" + readbuff[2] + ")は会社の権限に従うため、通話判別方式です。");
									}
									if (DEBUG_FLG) {
										logging("INFO: 未登録電話は" + PACT_Tuwa_result[0].comhistbaseflg);
									}
									koushiFlg = true;
								} else //会社の公私設定は設定され、通話判別方式か？
								{
									if (DEBUG_FLG) {
										logging("INFO: 対象電話(" + readbuff[2] + ")は会社の権限に従うため、公私分計をしないか、通話判別方式ではありません。");
									}
									koushiFlg = false;
								}
						}
					} else if ((tel_Koushi_result == undefined) && (PACT_Koushi_result == 1) && (PACT_Tuwa_result[0].comhistflg == 1)) //会社の公私設定は設定され、通話判別方式か？
					{
						if (DEBUG_FLG) {
							logging("INFO: 対象電話(" + readbuff[2] + ")は会社の権限に従うため、通話判別方式です。");
						}
						if (DEBUG_FLG) {

						} logging("INFO: 未登録電話は" + PACT_Tuwa_result[0].comhistbaseflg);
						koushiFlg = true;
					} else //処理しない
					{
						if (DEBUG_FLG) {
							logging("INFO: 対象電話(" + readbuff[2] + ")は会社の権限に従うため、公私分計をしないか、通話判別方式ではありません。");
						}
						koushiFlg = false;
					}

				if (koushiFlg == true) //通話先マスターの取得
					{
// 2022cvt_015
						var toTEL_master = Array();
// 2022cvt_015
						toTEL_info = {};
						toTEL_master = await dbh.getHash("select totelno,kousiflg from kousi_totel_master_tb where kousiflg != '2' and carid = 3 and pactid = " + pactid + " and telno = '" + readbuff[2] + "';", true);
// 2022cvt_015
						var toTEL_cnt = toTEL_master.length;

						if (toTEL_cnt == 0) {
							if (DEBUG_FLG) {
								logging("INFO: 対象電話(" + readbuff[2] + ")は通話先マスターに１つも登録されていません");
							}
						} else {
// 2022cvt_015
							for (var cnt = 0; cnt < toTEL_cnt; cnt++) {
								toTEL_info.toTELno[cnt] = toTEL_master[cnt].totelno;
								toTEL_info.kousiflg[cnt] = toTEL_master[cnt].kousiflg;
							}
						}
					}

				oldTelno = readbuff[2];
// 2022cvt_015
				comhistbaseflg = "\\N";
// 2022cvt_015
				toTEL_copy = Array();
			}

		if ((koushiFlg == true) && (readbuff[8] != "")) //通話先はマスターに存在するか？
			{
				if ((undefined !== toTEL_info.toTELno == true) && (-1 !== toTEL_info.toTELno.indexOf(readbuff[8]) != false)) //マスターに存在
					{
						if (DEBUG_FLG) {
							logging("INFO: マスターに存在 totel-" + readbuff[8]);
						}
// 2022cvt_015
						var totelnum = readbuff[8].indexOf(toTEL_info.toTELno);
						// var totelnum = array_search(readbuff[8], toTEL_info.toTELno);
						comhistbaseflg = toTEL_info.kousiflg[totelnum];
					} else //コピー文の中も調べる
					{
						if (DEBUG_FLG) {
							logging("INFO: マスターに存在しない totel-" + readbuff[8]);
						}

						if ((Tel_Tuwa_cnt > 0) && (tel_Tuwa_result[0].comhistbaseflg != "")) //電話の公私パターンを使用
							{
								comhistbaseflg = tel_Tuwa_result[0].comhistbaseflg;
							} else //会社の公私パターンを使用
							{
								comhistbaseflg = PACT_Tuwa_result[0].comhistbaseflg;
							}

						if (-1 !== toTEL_copy.indexOf(readbuff[8]) == false) //コピー文の中に存在しない場合は新規に登録
							//通話先マスターのコピー文作成
							//契約ID
							//電話番号
							//キャリアID
							//通話先の電話番号
							//通公私分計フラグ(初期は未登録)
							//備考欄
							{
// 2022cvt_015
								var toTEL_copycnt = toTEL_copy.length;
								toTEL_copy[toTEL_copycnt + 1] = readbuff[8];
								kousi_totel_buf += pactid + "\t";
								kousi_totel_buf += readbuff[2] + "\t";
								kousi_totel_buf += "3\t";
								kousi_totel_buf += readbuff[8] + "\t";
								kousi_totel_buf += "2\t";
								kousi_totel_buf += "\\N\n";
							} else {
							if (DEBUG_FLG) {
								logging("INFO: 既にCOPY文に含まれる totel-" + readbuff[8]);
							}
						}
					}
			}

// 2022cvt_015
		var startTime = readbuff[5].replace("\\/", "-") + " " + readbuff[9].substring(0, 8);
		// var startTime = mb_ereg_replace("\\/", "-", readbuff[5]) + " " + readbuff[9].substr(0, 8);

		if (readbuff[4] == "ａｕ国際電話通話明細") {
// 2022cvt_015
			var toPlace = readbuff[22];
		} else if (readbuff[4] == "Ｃメール送信明細" || readbuff[4] == "プチメール送信明細") {
			toPlace = readbuff[4];
// 2022cvt_019
		} else if (readbuff[4].match("/^パケット通信明細.*\$/i")) {
			toPlace = readbuff[6];
		} else {
			toPlace = readbuff[6] + readbuff[15];
		}

		if (!!readbuff[20]) //国名が入っていたら優先させる 2012/11/28 S-136
			{
// 2022cvt_015
				var fromPlace = readbuff[20];
			} else {
			fromPlace = readbuff[14];
		}

// 2022cvt_015
		var telTimeTemp = readbuff[11].replace(":|\\.", "");
		// var telTimeTemp = ereg_replace(":|\\.", "", readbuff[11]);
// 2022cvt_015
		var telTimeSec = telTimeTemp.substring(4, 3);
// 2022cvt_015
		var telTimeMin = telTimeTemp.substring(0, 4);

		if (parseInt(telTimeMin) > 60) {
// 2022cvt_021
// 2022cvt_015
			var telTimeHour = sprintf("%02d", (parseInt(telTimeMin) / 60).toString());
			// var telTimeHour = sprintf("%02d", telTimeMin / 60);
// 2022cvt_021
			telTimeMin = sprintf("%02d", (parseInt(telTimeMin) % 60).toString());
			// telTimeMin = sprintf("%02d", telTimeMin % 60);
		} else {
			telTimeMin = telTimeTemp.substring(2, 2);
			telTimeHour = telTimeTemp.substring(0, 2);
		}

// 2022cvt_015
		var telTime = telTimeHour + telTimeMin + telTimeSec;

		var dataValue = "";
		var chrgeValue = "";

		if (readbuff[17] == "") {
// 2022cvt_015
			dataValue = "\\N";
// 2022cvt_015
			chrgeValue = readbuff[12];
		} else //登録されているパケットの単価で料金を計算する。
			{
				dataValue = readbuff[17];
// 2022cvt_015
				var telnum = readbuff[2].indexOf(tel_info.telno);
				// var telnum = array_search(readbuff[2], tel_info.telno);

				if (telnum != -1) {
					if (tel_info.charge[telnum] == "") //パケットが登録されていない場合は種別で計算
						{
							if (tel_info.cirid[telnum] == "9") //WINの場合
								{
									chrgeValue = (+(0.2 * parseInt(dataValue) / 128)).toString();
								} else if (tel_info.cirid[telnum] == "8") //CDMA 1Xの場合
								{
									chrgeValue = (+(0.27 * parseInt(dataValue) / 128)).toString();
								} else //その他の場合
								{
									chrgeValue = readbuff[12];
								}
						} else //パケット単価が指定されていない
						{
							chrgeValue = (+(tel_info.charge[telnum] * parseInt(dataValue) / 128)).toString();
						}
				} else //登録されていない電話
					{
						chrgeValue = readbuff[12];
					}
			}

		if (chrgeValue == "") {
			chrgeValue = "0";
		}

		if (readbuff[4] != "") //電話番号
			//通話タイプ = 明細種別
			//開始年月日
			//通話先の電話番号
			//通話先所在地
			//利用地
			//通話時間
			//通話料金
			//データ量
			//通話種別 = 通話種別名称
			//通話種別名又は発着信 = 通話種別名称
			//割引種別
			//用途別区分
			//キャリアID		2006.08.18 UPDATE 上杉顕一郎
			//公私分計フラグ	2006.08.18 UPDATE 上杉顕一郎
			//発着信
			//通話種別名　または発着信
			{
				comm_write_buf += pactid + "\t";
				comm_write_buf += readbuff[2] + "\t";
				comm_write_buf += readbuff[4] + "\t";
				comm_write_buf += startTime + "\t";
				comm_write_buf += readbuff[8] + "\t";
				comm_write_buf += toPlace + "\t";
				comm_write_buf += fromPlace + "\t";
				comm_write_buf += telTime + "\t";
				comm_write_buf += chrgeValue + "\t";
				comm_write_buf += dataValue + "\t";
				comm_write_buf += readbuff[6] + "\t";
				comm_write_buf += readbuff[6] + "\t";
				comm_write_buf += readbuff[23] + "\t";
				comm_write_buf += "0\t";
				comm_write_buf += "3\t";
				comm_write_buf += comhistbaseflg + "\t";
				comm_write_buf += readbuff[19] + "\t";
				comm_write_buf += readbuff[19] + "\n";
			}
	}

	return true;
};

	async function readBTfile(infilename: string, pactid: string, dbh: ScriptDB) //公私分計対応  2006.08.18 UPDATE 上杉顕一郎
//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
//対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//$inmonth = substr( $readbuff[0], 6, 2);
//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("PACT_result" in global)) PACT_result = undefined;
	// if (!("tel_info" in global)) tel_info = undefined;
	// if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	// if (!("year" in global)) year = undefined;
	// if (!("month" in global)) month = undefined;
	// if (!("inyear" in global)) inyear = undefined;
	// if (!("inmonth" in global)) inmonth = undefined;
	// if (!("comm_write_buf" in global)) comm_write_buf = undefined;
	// if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	// if (!("PACT_Koushi_result" in global)) PACT_Koushi_result = undefined;
	// if (!("PACT_Tuwa_result" in global)) PACT_Tuwa_result = undefined;
	// if (!("kousi_totel_buf" in global)) kousi_totel_buf = undefined;
// 2022cvt_015
	var buffer = "";
	try {
		buffer = fs.readFileSync(infilename, "utf8");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("WARNING: ファイルのOPENに失敗しました " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " ファイルのOPENに失敗しました " + infilename);
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
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " 請求先コード(au)が異なります " + readbuff[1]);
		// fclose(ifp);
		insertClampError(pactid, "請求先コード(au)が異なります");
		return false;
	}

	var inyear = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(0, 4));
	var inmonth = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(4, 2));

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象年月が異なります " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " 対象年月が異なります " + infilename);
		// fclose(ifp);
		return false;
	}

// 2022cvt_015
	var oldTelno = "";
// 2022cvt_015
	var koushiFlg = false;
// 2022cvt_015
	var fromFlg = false;

	var toTEL_info: { [key: string]: any } = {};
	var toTEL_copy = Array();
	var comhistbaseflg = "";
	var Tel_Tuwa_cnt: number = 0;
	var tel_Tuwa_result: Array<any> = [];

	for (line of lines.splice(2)) {
		out_rec_cnt++;
		readbuff = line.slice(0, -1).split(",");
// 2022cvt_015
		var readbuff_cnt = readbuff.length;

// 2022cvt_015
		for (var acnt = 0; acnt < readbuff_cnt; acnt++) //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
		{
			readbuff[acnt] = readbuff[acnt].replace("(^\u3000+|\u3000+$)", "");
			readbuff[acnt] = readbuff[acnt].replace("(^\\s+|\\s+$)", "");
			readbuff[acnt] = readbuff[acnt].replace("(^\"+|\"+$)", "");
		}

		if (oldTelno != readbuff[2]) //対象電話は公私分計をするか？
			{
// 2022cvt_015
				comhistbaseflg = "\\N";
// 2022cvt_015
				var tel_Koushi_result = await dbh.getOne("select kousiflg from tel_tb where carid = 3 and pactid = " + pactid + " and telno = '" + readbuff[2] + "';", true);

				if (tel_Koushi_result == 0) //またその電話は通話判別方式か？
					{
// 2022cvt_015
						tel_Tuwa_result = await dbh.getHash("select kousi_pattern_tb.comhistflg,  kousi_pattern_tb.comhistbaseflg from tel_tb join kousi_pattern_tb on (tel_tb.kousiptn=kousi_pattern_tb.patternid) where tel_tb.kousiflg='0' and kousi_pattern_tb.comhistflg='1' and tel_tb.carid = 3 and tel_tb.pactid = " + pactid + " and tel_tb.telno = '" + readbuff[2] + "';", true);
// 2022cvt_015
						Tel_Tuwa_cnt = tel_Tuwa_result.length;

						if (Tel_Tuwa_cnt > 0) {
							if (tel_Tuwa_result[0].comhistflg == 1) {
								if (DEBUG_FLG) {
									logging("INFO: 対象電話(" + readbuff[2] + ")は通話判別方式です。");
								}
								if (DEBUG_FLG) {
									logging("INFO: 未登録電話は" + tel_Tuwa_result[0].comhistbaseflg);
								}
								koushiFlg = true;
							} else {
								if (DEBUG_FLG) {
									logging("INFO: 対象電話(" + readbuff[2] + ")は通話判別方式ではありません。");
								}
								koushiFlg = false;
							}
						} else {
							if ((tel_Koushi_result == undefined) && (PACT_Koushi_result == 1) && (PACT_Tuwa_result[0].comhistflg == 1)) //会社の公私設定は設定され、通話判別方式か？
								{
									if (DEBUG_FLG) {
										logging("INFO: 対象電話(" + readbuff[2] + ")は会社の権限に従うため、通話判別方式です。");
									}
									if (DEBUG_FLG) {
										logging("INFO: 未登録電話は" + PACT_Tuwa_result[0].comhistbaseflg);
									}
									koushiFlg = true;
								} else //会社の公私設定は設定され、通話判別方式か？
								{
									if (DEBUG_FLG) {
										logging("INFO: 対象電話(" + readbuff[2] + ")は会社の権限に従うため、公私分計をしないか、通話判別方式ではありません。");
									}
									koushiFlg = false;
								}
						}
					} else if ((tel_Koushi_result == undefined) && (PACT_Koushi_result == 1) && (PACT_Tuwa_result[0].comhistflg == 1)) //会社の公私設定は設定され、通話判別方式か？
					{
						if (DEBUG_FLG) {
							logging("INFO: 対象電話(" + readbuff[2] + ")は会社の権限に従うため、通話判別方式です。");
						}
						if (DEBUG_FLG) {
							logging("INFO: 未登録電話は" + PACT_Tuwa_result[0].comhistbaseflg);
						}
						koushiFlg = true;
					} else //処理しない
					{
						if (DEBUG_FLG) {
							logging("INFO: 対象電話(" + readbuff[2] + ")は会社の権限に従うため、公私分計をしないか、通話判別方式ではありません。");
						}
						koushiFlg = false;
					}

				if (koushiFlg == true) //通話元マスターの取得
					{
// 2022cvt_016
// 2022cvt_015
						var fromTEL_master = await dbh.getOne("select kousiflg from kousi_fromtel_master_tb where fromtelno = '1' and type = 'O' and carid = 3 and pactid = " + pactid + " and telno = '" + readbuff[2] + "';", true);

						if (fromTEL_master.length == 1) {
							fromFlg = true;
							comhistbaseflg = fromTEL_master.kousiflg;
							if (DEBUG_FLG) {
								logging("INFO: 対象電話(" + readbuff[2] + ")は分計（用途別=1)が設定されています。");
							}
							if (DEBUG_FLG) {
								logging("INFO: 対象電話(" + readbuff[2] + ")の公私分計フラグは" + fromTEL_master.kousiflg);
							}
						} else //通話先マスターの取得
							{
								fromFlg = false;
								if (DEBUG_FLG) {
									logging("INFO: 対象電話(" + readbuff[2] + ")は分計（用途別=1)が設定されていません。");
								}
// 2022cvt_015
								var toTEL_master = Array();
// 2022cvt_015
								toTEL_info = {};
								toTEL_master = await dbh.getHash("select totelno,kousiflg from kousi_totel_master_tb where kousiflg != '2' and carid = 3 and pactid = " + pactid + " and telno = '" + readbuff[2] + "';", true);
// 2022cvt_015
								var toTEL_cnt = toTEL_master.length;

								if (toTEL_cnt == 0) {
									if (DEBUG_FLG) {
										logging("INFO: 対象電話(" + readbuff[2] + ")は通話先マスターに１つも登録されていません");
									}
								} else {
// 2022cvt_015
									for (var cnt = 0; cnt < toTEL_cnt; cnt++) {
										toTEL_info.toTELno[cnt] = toTEL_master[cnt].totelno;
										toTEL_info.kousiflg[cnt] = toTEL_master[cnt].kousiflg;
									}
								}
							}
					}

				oldTelno = readbuff[2];
// 2022cvt_015
				toTEL_copy = Array();
			}

		if ((koushiFlg == true) && (readbuff[8] != "") && (fromFlg == false)) //通話先はマスターに存在するか？
			{
				if ((undefined !== toTEL_info.toTELno == true) && (-1 !== toTEL_info.toTELno.indexOf(readbuff[8]) != false)) //マスターに存在
					{
						if (DEBUG_FLG) {
							logging("INFO: マスターに存在 totel-" + readbuff[8]);
						}
// 2022cvt_015
						var totelnum = readbuff[8].indexOf(toTEL_info.toTELno);
						// var totelnum = array_search(readbuff[8], toTEL_info.toTELno);
						comhistbaseflg = toTEL_info.kousiflg[totelnum];
					} else //コピー文の中も調べる
					{
						if (DEBUG_FLG) {
							logging("INFO: マスターに存在しない totel-" + readbuff[8]);
						}

						if ((Tel_Tuwa_cnt > 0) && (tel_Tuwa_result[0].comhistbaseflg != "")) //電話の公私パターンを使用
							{
								comhistbaseflg = tel_Tuwa_result[0].comhistbaseflg;
							} else //会社の公私パターンを使用
							{
								comhistbaseflg = PACT_Tuwa_result[0].comhistbaseflg;
							}

						if (-1 !== toTEL_copy.indexOf(readbuff[8]) == false) //コピー文の中に存在しない場合は新規に登録
							//通話先マスターのコピー文作成
							//契約ID
							//電話番号
							//キャリアID
							//通話先の電話番号
							//通公私分計フラグ(初期は未登録)
							//備考欄
							{
// 2022cvt_015
								var toTEL_copycnt = toTEL_copy.length;
								toTEL_copy[toTEL_copycnt + 1] = readbuff[8];
								kousi_totel_buf += pactid + "\t";
								kousi_totel_buf += readbuff[2] + "\t";
								kousi_totel_buf += "3\t";
								kousi_totel_buf += readbuff[8] + "\t";
								kousi_totel_buf += "2\t";
								kousi_totel_buf += "\\N\n";
							} else {
							if (DEBUG_FLG) {
								logging("INFO: 既にCOPY文に含まれる totel-" + readbuff[8]);
							}
						}
					}
			}

// 2022cvt_015
		var startTime = readbuff[5].replace("\\/", "-") + " " + readbuff[9].substring(0, 8);
		// var startTime = mb_ereg_replace("\\/", "-", readbuff[5]) + " " + readbuff[9].substr(0, 8);

		if (readbuff[4] == "ａｕ国際電話通話明細") {
// 2022cvt_015
			var toPlace = readbuff[22];
		} else if (readbuff[4] == "Ｃメール送信明細" || readbuff[4] == "プチメール送信明細") {
			toPlace = readbuff[4];
// 2022cvt_019
		} else if (readbuff[4].match("/^パケット通信明細.*\$/i")) {
			toPlace = readbuff[6];
		} else {
			toPlace = readbuff[6] + readbuff[15];
		}

		if (readbuff[4] == "グローバルパスポート通話明細") {
// 2022cvt_015
			var fromPlace = readbuff[20];
		} else {
			fromPlace = readbuff[14];
		}

// 2022cvt_015
		var telTimeTemp = readbuff[11].replace(":|\\.", "");
		// var telTimeTemp = ereg_replace(":|\\.", "", readbuff[11]);
// 2022cvt_015
		var telTimeSec = telTimeTemp.substring(4, 3);
// 2022cvt_015
		var telTimeMin = telTimeTemp.substring(0, 4);
		var telTimeMin = telTimeTemp.substring(0, 4);

		if (parseInt(telTimeMin) > 60) {
// 2022cvt_021
// 2022cvt_015
			var telTimeHour = sprintf("%02d", (parseInt(telTimeMin) / 60).toString());
// 2022cvt_021
			telTimeMin = sprintf("%02d", (parseInt(telTimeMin) % 60).toString());
		} else {
			telTimeMin = telTimeTemp.substring(2, 2);
			telTimeHour = telTimeTemp.substring(0, 2);
		}

// 2022cvt_015
		var telTime = telTimeHour + telTimeMin + telTimeSec;
		var dataValue = "";
		var chrgeValue = "";

		if (readbuff[17] == "") {
// 2022cvt_015
			var dataValue = "\\N";
// 2022cvt_015
			var chrgeValue = readbuff[12];
		} else //登録されているパケットの単価で料金を計算する。
			{
				dataValue = readbuff[17];
// 2022cvt_015
				var telnum = readbuff[2].indexOf(tel_info.telno);
				// var telnum = array_search(readbuff[2], tel_info.telno);

				if (telnum != -1) {
					if (tel_info.charge[telnum] == "") //パケットが登録されていない場合は種別で計算
						{
							if (tel_info.cirid[telnum] == "9") //WINの場合
								{
									chrgeValue = (+(0.2 * parseInt(dataValue) / 128)).toString();
								} else if (tel_info.cirid[telnum] == "8") //CDMA 1Xの場合
								{
									chrgeValue = (+(0.27 * parseInt(dataValue) / 128)).toString();
								} else //その他の場合
								{
									chrgeValue = readbuff[12];
								}
						} else //パケット単価が指定されていない
						{
							chrgeValue = (+(tel_info.charge[telnum] * parseInt(dataValue) / 128)).toString();
						}
				} else //登録されていない電話
					{
						chrgeValue = readbuff[12];
					}
			}

		if (chrgeValue == "") {
			chrgeValue = "0";
		}

		if (readbuff[4] != "") //電話番号
			//通話タイプ = 明細種別
			//開始年月日
			//通話先の電話番号
			//通話先所在地
			//利用地
			//通話時間
			//通話料金
			//データ量
			//通話種別 = 通話種別名称
			//通話種別名又は発着信 = 通話種別名称
			//割引種別
			//用途別区分
			//キャリアID		2006.08.18 UPDATE 上杉顕一郎
			//公私分計フラグ	2006.08.18 UPDATE 上杉顕一郎
			//発着信
			//通話種別名　または発着信
			{
				comm_write_buf += pactid + "\t";
				comm_write_buf += readbuff[2] + "\t";
				comm_write_buf += readbuff[4] + "\t";
				comm_write_buf += startTime + "\t";
				comm_write_buf += readbuff[8] + "\t";
				comm_write_buf += toPlace + "\t";
				comm_write_buf += fromPlace + "\t";
				comm_write_buf += telTime + "\t";
				comm_write_buf += chrgeValue + "\t";
				comm_write_buf += dataValue + "\t";
				comm_write_buf += readbuff[6] + "\t";
				comm_write_buf += readbuff[6] + "\t";
				comm_write_buf += readbuff[23] + "\t";
				comm_write_buf += "1\t";
				comm_write_buf += "3\t";
				comm_write_buf += comhistbaseflg + "\t";
				comm_write_buf += "\t";
				comm_write_buf += "\n";
			}
	}

	return true;
};

function readEMfile(infilename: fs.PathOrFileDescriptor, pactid: string) //対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//$inmonth = substr( $readbuff[0], 6, 2);
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("PACT_result" in global)) PACT_result = undefined;
	// if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	// if (!("year" in global)) year = undefined;
	// if (!("month" in global)) month = undefined;
	// if (!("inyear" in global)) inyear = undefined;
	// if (!("inmonth" in global)) inmonth = undefined;
	// if (!("comm_write_buf" in global)) comm_write_buf = undefined;
	// if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
// 2022cvt_015
	var buffer = "";
	try {
		buffer = fs.readFileSync(infilename, "utf8");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("WARNING: ファイルのOPENに失敗しました " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " ファイルのOPENに失敗しました " + infilename);
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
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " 請求先コード(au)が異なります " + readbuff[1]);
		// fclose(ifp);
		insertClampError(pactid, "請求先コード(au)が異なります");
		return false;
	}

	var inyear = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(0, 4));
	var inmonth = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(4, 2));

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象年月が異なります " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " 対象年月が異なります " + infilename);
		// fclose(ifp);
		return false;
	}

	for (var line of lines.splice(2)) {
		out_rec_cnt++;
		readbuff = line.slice(0, -1).split(",");
// 2022cvt_015
		var readbuff_cnt = readbuff.length;

// 2022cvt_015
		for (var acnt = 0; acnt < readbuff_cnt; acnt++) //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
		{
			readbuff[acnt] = readbuff[acnt].replace("(^\\s+|\\s+$)", "");
			readbuff[acnt] = readbuff[acnt].replace("(^\"+|\"+$)", "");
		}

// 2022cvt_015
		var startTime = readbuff[5].replace("\\/", "-") + " " + readbuff[8].substring(0, 8);
// 2022cvt_015
		var toPlace = readbuff[4] + " " + readbuff[6];
// 2022cvt_015
		var chrgeValue = readbuff[9];

		if (chrgeValue == "") {
			chrgeValue = "0";
		}

// 2022cvt_015
		var comhistbaseflg = "\\N";

		if (readbuff[4] != "") //電話番号
			//通話タイプ = 明細種別
			//開始年月日
			//通話先の電話番号
			//通話先所在地
			//利用地
			//通話時間
			//通話料金
			//データ量
			//通話種別 = 通話種別名称
			//通話種別名又は発着信 = 通話種別名称
			//割引種別
			//用途別区分
			//キャリアID
			//公私分計フラグ	2009.11.13 UPDATE T.中西
			//発着信
			//通話種別名　または発着信
			{
				comm_write_buf += pactid + "\t";
				comm_write_buf += readbuff[2] + "\t";
				comm_write_buf += readbuff[4] + "\t";
				comm_write_buf += startTime + "\t";
				comm_write_buf += "\t";
				comm_write_buf += toPlace + "\t";
				comm_write_buf += "\t";
				comm_write_buf += "\t";
				comm_write_buf += chrgeValue + "\t";
				comm_write_buf += "\\N\t";
				comm_write_buf += readbuff[7] + "\t";
				comm_write_buf += readbuff[7] + "\t";
				comm_write_buf += "\t";
				comm_write_buf += "0\t";
				comm_write_buf += "3\t";
				comm_write_buf += comhistbaseflg + "\t";
				comm_write_buf += "\t";
				comm_write_buf += "\n";
			}
	}

	return true;
};

function readYGfile(infilename: string, pactid: string) //対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//$inmonth = substr( $readbuff[0], 6, 2);
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("PACT_result" in global)) PACT_result = undefined;
	// if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	// if (!("year" in global)) year = undefined;
	// if (!("month" in global)) month = undefined;
	// if (!("inyear" in global)) inyear = undefined;
	// if (!("inmonth" in global)) inmonth = undefined;
	// if (!("info_write_buf" in global)) info_write_buf = undefined;
	// if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
// 2022cvt_015
	var buffer = "";
	try {
		buffer = fs.readFileSync(infilename, "utf8");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("WARNING: ファイルのOPENに失敗しました " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " ファイルのOPENに失敗しました " + infilename);
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
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " 請求先コード(au)が異なります " + readbuff[1]);
		// fclose(ifp);
		insertClampError(pactid, "請求先コード(au)が異なります");
		return false;
	}

	var inyear = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(0, 4));
	var inmonth = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(4, 2));

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象年月が異なります " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " 対象年月が異なります " + infilename);
		// fclose(ifp);
		return false;
	}

	for (line of lines.splice(2)) {
		out_rec_cnt++;
		readbuff = line.slice(0, -1).split(",");
// 2022cvt_015
		var readbuff_cnt = readbuff.length;

// 2022cvt_015
		for (var acnt = 0; acnt < readbuff_cnt; acnt++) //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
		{
			readbuff[acnt].replace("(^\\s+|\\s+$)", "");
			readbuff[acnt].replace("(^\"+|\"+$)", "");
		}

// 2022cvt_015
		var chrgeValue = readbuff[9];

		if (chrgeValue == "") {
			chrgeValue = "0";
		}

		if (readbuff[4] != "") //電話番号
			//サイト名
			//開始日
			//課金方法
			//情報料
			//キャリアID
			{
				info_write_buf += pactid + "\t";
				info_write_buf += readbuff[2] + "\t";
				info_write_buf += readbuff[7] + "\t";
				info_write_buf += "\\N\t";
				info_write_buf += readbuff[6] + "\t";
				info_write_buf += chrgeValue + "\t";
				info_write_buf += "3\n";
			}
	}

	return true;
};

function readBUfile(infilename: string, pactid: string) //対象ファイルオープン
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("PACT_result" in global)) PACT_result = undefined;
	// if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	// if (!("year" in global)) year = undefined;
	// if (!("month" in global)) month = undefined;
	// if (!("inyear" in global)) inyear = undefined;
	// if (!("inmonth" in global)) inmonth = undefined;
	// if (!("info_write_buf" in global)) info_write_buf = undefined;
	// if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
// 2022cvt_015
	var buffer = "";
	try {
		buffer = fs.readFileSync(infilename, "utf8");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("WARNING: ファイルのOPENに失敗しました " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " ファイルのOPENに失敗しました " + infilename);
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
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " 請求先コード(au)が異なります " + readbuff[1]);
		// fclose(ifp);
		insertClampError(pactid, "請求先コード(au)が異なります");
		return false;
	}

	var inyear = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(0, 4));
	var inmonth = parseInt(readbuff[0].replace(/[^0-9]/g, "").substring(4, 2));

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象年月が異なります " + infilename);
		}
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au通話・通信データ取込処理 " + PACT_result + " " + pactid + " 対象年月が異なります " + infilename);
		// fclose(ifp);
		return false;
	}

	for (line of lines.splice(2)) {
		out_rec_cnt++;
		readbuff = line.slice(0, -1).split(",");
// 2022cvt_015
		var readbuff_cnt = readbuff.length;

// 2022cvt_015
		for (var acnt = 0; acnt < readbuff_cnt; acnt++) //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
		{
			readbuff[acnt] = readbuff[acnt].replace("(^\\s+|\\s+$)", "");
			readbuff[acnt] = readbuff[acnt].replace("(^\"+|\"+$)", "");
		}

// 2022cvt_015
		var startTime = readbuff[7].replace("\\/", "-") + " 00:00:00";
// 2022cvt_015
		var chrgeValue = readbuff[6];

		if (chrgeValue == "") {
			chrgeValue = "0";
		}

		if (readbuff[0] != "") //電話番号
			//サイト名
			//開始日
			//課金方法
			//情報料
			//キャリアID
			{
				info_write_buf += pactid + "\t";
				info_write_buf += readbuff[2] + "\t";
				info_write_buf += readbuff[4] + "\t";
				info_write_buf += startTime + "\t";
				info_write_buf += "auかんたん決済\t";
				info_write_buf += chrgeValue + "\t";
				info_write_buf += "3\n";
			}
	}

	return true;
};

	async function doCopyInsert(table: string, filename: string, columns: Array<any>, db: ScriptDB) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	// if (!("logh" in global)) logh = undefined;
// 2022cvt_015
	var buffer = "";
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
				logh.putError(G_SCRIPT_ERROR, filename + "のデータ数が設定と異なります。データ=" + line + ":" + A_line.length + ":" + columns.length);
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

// function doCopyExp(sql: string, filename: string, db: any) //一度にFETCHする行数
// //ファイルを開く
// {
// // 2022cvt_015
// 	var NUM_FETCH = 100000;
// // 2022cvt_015
// 	var fp = fs.openSync(filename, "wt");
// 	// var fp = fopen(filename, "wt");

// 	if (!fp) {
// 		return false;
// 	}

// 	db.query("DECLARE exp_cur CURSOR FOR " + sql);

// 	for (; ; ) //ＤＢから１行ずつ結果取得
// 	{
// // 2022cvt_015
// 		var result = pg_query(db.m_db.connection, "FETCH " + NUM_FETCH + " IN exp_cur");

// 		if (result == undefined) {
// 			// fclose(fp);
// 			return false;
// 		}

// 		var A_line = pg_fetch_array(result);
// 		if (A_line == undefined) //ループ終了
// 			{
// 				break;
// 			}

// // 2022cvt_015
// 		var str = "";
// 		var A_line = pg_fetch_array(result);

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
// 		} while (A_line);

// 		try {
// 			fs.writeSync(fp, str);
// 		} catch (e) {
// 			fs.closeSync(fp);
// 			return false;
// 		}
// 	}

// 	db.query("CLOSE exp_cur");
// 	// fclose(fp);
// 	return true;
// };

function insertClampError(pactid: string, message: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_016
// 2022cvt_015
	var sql = "insert into clamp_error_tb" + "(pactid,carid,error_type,message,is_send,recdate,fixdate)" + "values" + "(" + pactid + "," + 3 + ",'prtelno'" + ",'" + message + "'" + ",false" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/") + "'" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/") + "'" + ")" + ";";
	dbh.query(sql);
	return true;
};
})();
