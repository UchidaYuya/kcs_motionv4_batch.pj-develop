import TableNo, { ScriptDB, TableInserter } from "../batch/lib/script_db";
// require("lib/script_db.php");

// 2022cvt_026
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../batch/lib/script_log";
// require("lib/script_log.php");

import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as flock from "proper-lockfile";
import { countChars } from "../../class/countChars";

(async () => {
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_etc_corphist.php";
const HNN_COID = 1;
const HANSHIN_COID = 2;
const SHUTO_COID = 3;
const HONSHI_COID = 4;
const CON_TAX = 0.08;
const AFTER_ENCO = "UTF-8";
const BEFORE_ENCO = "SJIS-win";
const KOUSOKU_UTICODE = "001";
const IPPAN_UTICODE = "002";
const KOUSYA_UTICODE = "003";
const TSUKOU_UTICODE = "101";
const BUS_UTICODE = "102";
const BUSDIS_UTICODE = "103";
const CAR_IPPAN_UTICODE = "104";
const CARDIS_IPPAN_UTICODE = "105";
const CAR_KOUSOKU_UTICODE = "106";
const CARDIS_KOUSOKU_UTICODE = "107";
const CHOUSEI_UTICODE = "108";
const SEIKYU_UTICODE = "109";
// 2022cvt_015
var A_corp = ["HNN", "Shutokou", "Hanshin", "HonShi"];
// 2022cvt_015
var A_meisaiform = [10, 15, 5, 8, 3, 5, 20, 5, 20, 2, 6, 6, 6, 6, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9];
// 2022cvt_015
var A_infoform = [10, 5, 6, 14, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1, 10, 1, 10, 15, 15, 15, 6];
// 2022cvt_015
var dbLogFile = DATA_LOG_DIR + "/card_billbat.log";
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
// 2022cvt_015
var A_para = 5;

var mode = "";
var year = 0;
var month = 0;
var month_view = "";
var pactid = "";
var backup = "";
var target = "";

if (process.argv.length != 6 + 1) //数が正しくない
	{
		usage("");
	} else //数が正しい
	//$cnt 0 はスクリプト名のため無視
	//パラメータの指定が無かったものがあった時
	{
// 2022cvt_015
		var argvCnt = process.argv.length;

// 2022cvt_015
		for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
		{
			if (process.argv[cnt].match("^-e="))
			// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード指定変数
				//モード文字列チェック
				{
// 2022cvt_015
					mode = process.argv[cnt].replace("^-e=", "").toLowerCase();
					// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!mode.match("^[ao]$")) {
					// if (ereg("^[ao]$", mode) == false) {
						usage("モードの指定が不正です。" + process.argv[cnt]);
					}

					A_para -= 1;
					continue;
				}

			if (process.argv[cnt].match("^-y="))
			// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //年月指定変数
				//請求年月文字列チェック
				//指定済のパラメータを配列から削除
				{
// 2022cvt_015
					var billdate = process.argv[cnt].replace("^-y=", "");
					// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

					if (!billdate.match("^[0-9]{6}$")) {
					// if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("請求年月の指定が不正です。" + process.argv[cnt]);
					} else //表示用の月
						{
// 2022cvt_015
							year = parseInt(billdate.substring(0, 4));
// 2022cvt_015
							month = parseInt(billdate.substring(4, 2));
// 2022cvt_015
							month_view = billdate.substring(4, 2);

							if (month < 10) {
								month_view = month_view.replace("0", "");
							}

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("請求年月の指定が不正です。" + process.argv[cnt]);
							}

// 2022cvt_015
							var A_riyou = getRiyouYM(year, month);
						}

					A_para -= 1;
					continue;
				}

			if (process.argv[cnt].match("^-p="))
			// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //会社ID指定変数
				//契約ＩＤチェック
				{
// 2022cvt_015
					pactid = process.argv[cnt].replace("^-p=", "").toLowerCase();
					// var pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!pactid.match("^all$") && !pactid.match("^[0-9]+$")) {
					// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("会社コードの指定が不正です。" + process.argv[cnt]);
					}

					A_para -= 1;
					continue;
				}

			if (process.argv[cnt].match("^-b="))
			// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップ指定変数
				//バックアップの有無のチェック
				{
// 2022cvt_015
					backup = process.argv[cnt].replace("^-b=", "").toLowerCase();
					// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!backup.match("^[ny]$")) {
					// if (ereg("^[ny]$", backup) == false) {
						usage("バックアップの指定が不正です。" + process.argv[cnt]);
					}

					A_para -= 1;
					continue;
				}

			if (process.argv[cnt].match("^-t=")) {
			// if (ereg("^-t=", _SERVER.argv[cnt]) == true) {
// 2022cvt_015
				target = process.argv[cnt].replace("^-t=", "").toLowerCase();
				// var target = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

				if (!target.match("^[no]$")) {
				// if (ereg("^[no]$", target) == false) {
					usage("対象月の（最新/過去）の指定が不正です。" + process.argv[cnt]);
				}

				A_para -= 1;
				continue;
			}

			usage("パラメータの指定が不正です。" + process.argv[0]);
		}

		if (A_para != 0) {
			usage("パラメータの指定が不正です。" + process.argv[0]);
		}
	}

// 2022cvt_015
var ETC_DIR = DATA_DIR + "/" + year + month + "/ETC";

if (fs.existsSync(ETC_DIR) == false) {// 2022cvt_003
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレート請求データ取込処理 ETCコーポレートカード請求データディレクトリ（" + ETC_DIR + "）がみつかりません");
	throw process.exit(1);// 2022cvt_009
}

logh.putError(G_SCRIPT_BEGIN, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 処理を開始します");
// 2022cvt_015
var LocalLogFile = ETC_DIR + "/import_etc_corp.log";

try {
	var ifp = fs.openSync(LocalLogFile, "a");
	fs.closeSync(ifp);
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレート請求データ取込処理 ログファイル（" + LocalLogFile + "）を開けません");
	throw process.exit(1);// 2022cvt_009
}

if (DEBUG_FLG) {
	logging("START: ETCコーポレート請求データ取込処理(" + SCRIPT_FILENAME + ")を開始します");
}
// 2022cvt_015
var A_dataDir = Array();

if (pactid == "all") //データディレクトリがひとつもなかったら終了
	{
// 2022cvt_015
		for (var idx = 0; idx < A_corp.length; idx++) {
			if (fs.existsSync(ETC_DIR + "/" + A_corp[idx]) == false) {// 2022cvt_003
				if (DEBUG_FLG) {
					logging(SCRIPT_FILENAME + " ETCコーポレート請求データ取込処理 ETCコーポレートカード請求データディレクトリ（" + ETC_DIR + "/" + A_corp[idx] + "）はみつかりません");
				}
			} else {
				if (DEBUG_FLG) {
					logging(SCRIPT_FILENAME + " ETCコーポレート請求データ取込処理 ETCコーポレートカード請求データディレクトリ（" + ETC_DIR + "/" + A_corp[idx] + "）はみつかりました");
				}
				A_dataDir.push(ETC_DIR + "/" + A_corp[idx]);
			}
		}

		if (A_dataDir.length == 0) {
			logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレート請求データ取込処理 ETCコーポレートカード請求データディレクトリ（" + ETC_DIR + "/以下）がみつかりません");
			throw process.exit(1);// 2022cvt_009
		}
	} else //データディレクトリがひとつもなかったら終了
	{
		for (idx = 0; idx < A_corp.length; idx++) {
			if (fs.existsSync(ETC_DIR + "/" + A_corp[idx] + "/" + pactid) == false) {// 2022cvt_003
				if (DEBUG_FLG) {
					logging(SCRIPT_FILENAME + " ETCコーポレート請求データ取込処理 ETCコーポレートカード請求データディレクトリ（" + ETC_DIR + "/" + A_corp[idx] + "/" + pactid + "）はみつかりません");
				}
			} else {
				if (DEBUG_FLG) {
					logging(SCRIPT_FILENAME + " ETCコーポレート請求データ取込処理 ETCコーポレートカード請求データディレクトリ（" + ETC_DIR + "/" + A_corp[idx] + "/" + pactid + "）はみつかりました");
				}
				A_dataDir.push(ETC_DIR + "/" + A_corp[idx] + "/" + pactid);
			}
		}

		if (A_dataDir.length == 0) {
			logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレート請求データ取込処理 ETCコーポレートカード請求データディレクトリ（" + ETC_DIR + "/以下）がみつかりません");
			throw process.exit(1);// 2022cvt_009
		}
	}

// clearstatcache();// 2022cvt_012
// 2022cvt_015
var A_pactid = Array();

if (pactid == "all") ///kcs/data/yyyymm/ETC以下のディレクトリを開く
	{
		for (idx = 0; idx < A_dataDir.length; idx++) {
			if (fs.existsSync(A_dataDir[idx]) == true) //処理する契約ＩＤを取得する// 2022cvt_003
				{
					var dirh = fs.readdirSync(A_dataDir[idx]);
					// var dirh = openDir(A_dataDir[idx]);// 2022cvt_004

					for (var pactName of dirh)
					// while (pactName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
					{
						if (fs.existsSync(A_dataDir[idx] + "/" + pactName) && pactName != "." && pactName != "..") {// 2022cvt_003
							if (-1 !== A_pactid.indexOf(pactName) == false) {
								A_pactid.push(pactName);
							}

							if (DEBUG_FLG) {
								logging("INFO: 対象ディレクトリ " + A_dataDir[idx] + "/" + pactName);
							}
						}

// 						clearstatcache();// 2022cvt_012
					}

					// closedir(dirh);
				}
		}
	} else ///kcs/data/yyyymm/ETC以下のディレクトリを開く
	{
		A_pactid.push(pactid);

		for (idx = 0; idx < A_dataDir.length; idx++) {
			if (fs.existsSync(A_dataDir[idx]) == true) //処理する契約ＩＤを取得する// 2022cvt_003
				{
					var dirh = fs.readdirSync(A_dataDir[idx]);
					// dirh = openDir(A_dataDir[idx]);// 2022cvt_004

					for (var pactName of dirh)
					// while (pactName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
					{
						if (fs.existsSync(A_dataDir[idx]) && pactName != "." && pactName != "..") {// 2022cvt_003
							if (DEBUG_FLG) {
								logging("INFO: 対象ディレクトリ  " + A_dataDir[idx]);
							}
						}

// 						clearstatcache();// 2022cvt_012
					}

					// closedir(dirh);
				}
		}
	}

A_pactid.sort();

if (A_pactid.length == 0 || undefined !== A_pactid == false) //エラー終了
	{
		if (DEBUG_FLG) {
			logging("ERROR: Pact用データディレクトリが１つもありません");
		}
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 Pact用データディレクトリが１つもありません");
		throw process.exit(1);// 2022cvt_009
	}

if (await lock(true, dbh) == false) {
	if (DEBUG_FLG) {
		logging("ERROR: 既に起動しています");
	}
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理  既に起動しています");
	throw process.exit(1);// 2022cvt_009
}

// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var cardX_tb = "card_" + tableNo + "_tb";
// 2022cvt_015
var cardusehistoryX_tb = "card_usehistory_" + tableNo + "_tb";
if (DEBUG_FLG) {
	logging("INFO: 対象テーブル " + cardX_tb + " & " + cardusehistoryX_tb);
}
// 2022cvt_015
var card_xx_filename = ETC_DIR + "/" + cardX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var card_xx_fp;
try {
	card_xx_fp = fs.openSync(card_xx_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + card_xx_filename + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + card_xx_filename + " ETCコーポレートカード請求データ取込処理 ");
	throw process.exit(1);// 2022cvt_009
}
// var card_xx_fp = fopen(card_xx_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: card_XX_tbへのcopy文ファイルOPEN " + card_xx_filename);
}

var card_fp;
var card_filename = "";

if (target == "n") {
// 2022cvt_015
	card_filename = ETC_DIR + "/card_tb" + year + month + pactid + ".ins";
// 2022cvt_015
	try {
		card_fp = fs.openSync(card_filename, "w");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("ERROR: " + card_fp + "のオープン失敗");
		}
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + card_fp + "のオープン失敗");
		throw process.exit(1);// 2022cvt_009
	}
	// var card_fp = fopen(card_filename, "w");

	if (DEBUG_FLG) {
		logging("INFO: card_tbへのcopy文ファイルOPEN " + card_filename);
	}
}

// 2022cvt_015
var cardusehistory_filename = ETC_DIR + "/" + cardusehistoryX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var cardusehistory_fp;
try {
	cardusehistory_fp = fs.openSync(cardusehistory_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + cardusehistory_filename + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + cardusehistory_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}

if (DEBUG_FLG) {
	logging("INFO: card_usehistory_XX_tbへのcopy文ファイルOPEN " + cardusehistory_filename);
}
// 2022cvt_015
var fin_cnt = 0;
// 2022cvt_015
var nowtime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
// 2022cvt_015
var A_del_sql = Array();
var fin_pact = Array();
var A_coid = Array();

for (cnt = 0; cnt < A_pactid.length; cnt++) //取り込むデータ数をカウントするための変数
//エラー用フラグ
//card_xx_tbへのcopy文をファイルに一度に書き込むためのバッファ
//card_tbへのcopy文をファイルに一度に書き込むためのバッファ
//対象会社の会社名を取得
//請求データファイル名を取得する
//処理する請求データファイル名配列
//請求データファイルがなかった場合
//ファイル毎のループfor閉じ
//ファイルハンドルが無い時
//最新月を指定している時はcard_tb用のファイルにも書き込み
//会社単位に終了ログを出力
{
// 2022cvt_015
	var out_rec_cnt = 0;
// 2022cvt_015
	var error_flg = false;
// 2022cvt_015
	var write_buf = "";
// 2022cvt_015
	var card_xx_write_buf = "";
// 2022cvt_015
	var usehistory_xx_write_buf = "";
// 2022cvt_015
	var PACT_result = await dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) {
			logging("WARNING:  対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		}
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象会社の会社名を取得 " + PACT_result);
	}
	if (DEBUG_FLG) {
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "のデータの処理を開始します");
	}
	logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 処理を開始します");
// 2022cvt_015
	var A_billFile = Array();
	var dataDirPact = "";

	for (idx = 0; idx < A_dataDir.length; idx++) //全社指定
	{
		if (pactid == "all") {
// 2022cvt_015
			dataDirPact = A_dataDir[idx] + "/" + A_pactid[cnt];
		} else {
			dataDirPact = A_dataDir[idx];
		}

		if (fs.existsSync(dataDirPact) == true) {// 2022cvt_003
// 2022cvt_028
			if (fs.statSync(dataDirPact + "/OTMEISAI.txt").isFile() == false) {
			// if (is_file(dataDirPact + "/OTMEISAI.txt") == false) {
				if (DEBUG_FLG) {
					logging("WARNING: 対象ファイルがみつかりません（" + dataDirPact + "/OTMEISAI.txt）");
				}
				logh.putError(G_SCRIPT_WARNING, "import_etc_corpbill.php ETCコーポレートカード請求データ取込処理 " + dataDirPact + "/以下 対象ファイルがみつかりません（" + dataDirPact + "/OTMEISAI.txt）");
			} else //最初にOTMEISAIを配列に入れる
				{
					A_billFile.push(dataDirPact + "/OTMEISAI.txt");
					if (DEBUG_FLG) {
						logging("INFO: 対象請求データファイル名 " + dataDirPact + "/OTMEISAI.txt");
					}
				}
		}
	}

	if (A_billFile.length == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象ファイルがみつかりません（" + dataDirPact + "/以下）");
		}
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + dataDirPact + "/以下 対象ファイルがみつかりません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象請求データファイル数 " + A_billFile.length);
	}
// 2022cvt_015
	var CARD_result = await dbh.getCol("select cardno from " + cardX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (Array.isArray(CARD_result) == false) {
		CARD_result = Array();
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象会社の登録ETCカードのリストを取得 " + CARD_result.length + "件 select cardno from " + cardX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
	}

	var CARD_now_result = Array();
	var card_write_buf = "";
	var CARD_now_delete_result = Array();

	if (target == "n") //削除されていないカード
		{
// 2022cvt_015
			CARD_now_result = await dbh.getCol("select cardno from card_tb where delete_flg = false and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

			if (Array.isArray(CARD_now_result) == false) {
				CARD_now_result = Array();
			}

			if (DEBUG_FLG) {
				logging("INFO: 最新の登録ETCカードのリストを取得 " + CARD_now_result.length + "件 select cardno from card_tb where delete_flg = false and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
			}
// 2022cvt_015
			CARD_now_delete_result = await dbh.getCol("select cardno from card_tb where delete_flg = true and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

			if (Array.isArray(CARD_now_delete_result) == false) {
				CARD_now_delete_result = Array();
			}

			if (DEBUG_FLG) {
				logging("INFO: 最新の登録ETCカードのリストを取得（削除済み） " + CARD_now_delete_result.length + "件 select cardno from card_tb where delete_flg=true and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
			}
// 2022cvt_015
			card_write_buf = "";
		}

// 2022cvt_015
	var A_prcardno = await dbh.getCol("select card_master_no from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid in (" + HNN_COID + "," + HANSHIN_COID + "," + SHUTO_COID + "," + HONSHI_COID + ");", true);

	if (A_prcardno.length == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 請求先コード（親番号）が１つも登録されていません" + "select card_master_no from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid in (" + HNN_COID + "," + HANSHIN_COID + "," + SHUTO_COID + "," + HONSHI_COID + ";");
		}
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 請求先コード（親番号）が１つも登録されていません");
		continue;
	}

// 2022cvt_015
	A_coid = Array();
	var coid = 0;

// 2022cvt_015
	for (var fcnt = 0; fcnt < A_billFile.length; fcnt++) //-------------------------
	//対象ファイルのcoidの決定
	//-------------------------
	//東中西
	//ファイルが開けなかった時
	//ファイル１行ずつ処理するwhile閉じ
	{
// 2022cvt_019
		if (A_billFile[fcnt].match("/\\/HNN\\//")) {
		// if (preg_match("/\\/HNN\\//", A_billFile[fcnt]) == true) {
			if (-1 !== A_coid.indexOf(HNN_COID) == false) {
// 2022cvt_015
				coid = HNN_COID;
				A_coid.push(HNN_COID);
			}
		}

// 2022cvt_019
		if (A_billFile[fcnt].match("/\\/Hanshin\\//")) {
		// if (preg_match("/\\/Hanshin\\//", A_billFile[fcnt]) == true) {
			if (-1 !== A_coid.indexOf(HANSHIN_COID) == false) {
				coid = HANSHIN_COID;
				A_coid.push(HANSHIN_COID);
			}
		}

// 2022cvt_019
		if (A_billFile[fcnt].match("/\\/Shutokou\\//")) {
		// if (preg_match("/\\/Shutokou\\//", A_billFile[fcnt]) == true) {
			if (-1 !== A_coid.indexOf(SHUTO_COID) == false) {
				coid = SHUTO_COID;
				A_coid.push(SHUTO_COID);
			}
		}

// 2022cvt_019
		if (A_billFile[fcnt].match("/\\/HonShi\\//")) {
		// if (preg_match("/\\/HonShi\\//", A_billFile[fcnt]) == true) {
			if (-1 !== A_coid.indexOf(HONSHI_COID) == false) {
				coid = HONSHI_COID;
				A_coid.push(HONSHI_COID);
			}
		}

// 2022cvt_015
		var buffer = "";
		try {
			buffer = fs.readFileSync(A_billFile[fcnt], "utf8");
		} catch (e) {
			if (DEBUG_FLG) {
				logging("WARNING: ファイルのOPENに失敗しました" + A_billFile[fcnt]);
			}
			logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ファイルのOPENに失敗しました " + A_billFile[fcnt]);
			error_flg = true;
			break;
		}
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var lines = text.toString().split("\r\n");
		// var ifp = fopen(A_billFile[fcnt], "r");

		if (DEBUG_FLG) {
			logging("INFO: 対象ファイル=" + A_billFile[fcnt]);
		}

		for (var line of lines)
		// while (line = fgets(ifp)) //-----------------------------------------------
		//ファイルのエンコーディングを変更（バッファ上）
		//-----------------------------------------------
		//路線名
		//大口・多頻度割引
		//その他割引
		//備考
		//利用日付
		//東中西
		//---------------------------------------------
		//card_XX_tbに各行のcardnoがあるか？存在チェック
		//---------------------------------------------
		{
			// line = mb_convert_encoding(line, AFTER_ENCO, BEFORE_ENCO);
// 2022cvt_015
			var A_line = makeMeisaiLineArray(line, A_meisaiform);

			if (checkMeisaiFormat(A_line) == false) {
				if (DEBUG_FLG) {
					logging("WARNING: フォーマットが異なります " + A_billFile[fcnt]);
				}
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + PACT_result + " " + A_billFile[fcnt] + " データファイルのフォーマットが異なります。処理を中断します。１件も取込ませんでした。 " + A_billFile[fcnt]);
				error_flg = true;
				break;
			}

			if (-1 !== A_prcardno.indexOf(A_line[0]) == false) {
				if (DEBUG_FLG) {
					logging("ERROR: ファイルに記載されているお客様番号(" + A_line[0] + ")と登録されたお客様番号(" + A_prcardno.join(",") + ")が異なります " + A_billFile[fcnt] + "(" + A_line[1] + "の行)");
				}
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + PACT_result + " " + A_billFile[fcnt] + " ファイルに記載されているお客様番号(" + A_line[0] + ")と登録されたお客様番号(" + A_prcardno.join(",") + ")が異なります。処理を中断します。１件も取込ませんでした。 " + A_billFile[fcnt] + "(" + A_line[1] + "の行)");
				error_flg = true;
				break;
			}

// 2022cvt_015
			var trg_post = await dbh.getOne("select postid from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and card_master_no = '" + A_line[0] + "' and cardcoid = " + coid + ";", true);

			if (trg_post == "") {
				if (DEBUG_FLG) {
					logging("ERROR: 未登録カードの登録先部署が取得できません" + "select postid from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and card_master_no = '" + A_line[0] + "' and cardcoid = " + coid + ";");
				}
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 未登録カードの登録先部署が取得できません");
				error_flg = true;
				break;
			}

// 2022cvt_015
			var copy_buf = "";
// 2022cvt_015
			var route = "";
// 2022cvt_015
			var discount1 = "";
// 2022cvt_015
			var discount2 = "";
// 2022cvt_015
			var note = "";
// 2022cvt_016
// 2022cvt_015
			var car_type = "";
// 2022cvt_015
			var usedate = "\"" + A_line[3].substring(0, 4) + "-" + A_line[3].substring(4, 2) + "-" + A_line[3].substring(6, 2) + "\"";

// 2022cvt_019
			if (A_billFile[fcnt].match("/\\/HNN\\//"))
			// if (preg_match("/\\/HNN\\//", A_billFile[fcnt]) == true) //路線名
				//大口割引
				{
					if (A_line[12] != "000000") {
						route = "一般有料道路";
					} else if (A_line[13] != "000000") {
						route = "公社道路";
					} else {
						route = "東中西";
					}

					if (A_line[14] == "00") {
						discount1 = "大口・多頻度割引摘要　通常（割引対象） ";
					} else if (A_line[14] == "01") {
						discount1 = "";
					} else if (A_line[14] == "02") {
						discount1 = "大口・多頻度割引摘要　車両不一致 ";
					}

					if (A_line[15] == "1") {
						note = "通行止めによる通行料金の調整有 ";
					}

					if (A_line[16] == "0") {
						discount2 += "通勤割引 ";
					}

					if (A_line[17] == "0") {
						discount2 += "早朝／夜間割引 ";
					}

					if (A_line[18] == "0") {
						discount2 += "深夜割引 ";
					}

					if (A_line[19] == "0") {
						discount2 += "名古屋高速道路公社の夜間、日曜・祝日割引 ";
					}

					if (A_line[20] == "0") {
						discount2 += "名古屋高速道路公社の路線バス割引 ";
					}
// 2022cvt_019
				} else if (A_billFile[fcnt].match("/\\/Shutokou\\//")) //路線名
				{
					if (A_line[4] == "012") {
						route = "首都高";
					}

					if (A_line[29] == "1") {
						discount2 += "環境割引 ";
					} else if (A_line[29] == "2") {
						discount2 += "首都高速モニター ";
					} else if (A_line[29] == "3") {
						discount2 += "首都高速モニター終 ";
					} else if (A_line[29] == "4") {
						discount2 += "環境・モニター ";
					} else if (A_line[29] == "5") {
						discount2 += "環境・モニター終 ";
					} else if (A_line[29] == "6") {
						discount2 += "特別割引 ";
					} else if (A_line[29] == "7") {
						discount2 += "特割・モニター ";
					} else if (A_line[29] == "8") {
						discount2 += "特割・モニター終 ";
					} else if (A_line[29] == "9") {
						discount2 += "環境・特別割引 ";
					}

					if (A_line[30] == "1") {
						discount2 += "環境・特割・モニター ";
					} else if (A_line[30] == "1") {
						discount2 += "環境・特割・モニター終 ";
					}
// 2022cvt_019
				} else if (A_billFile[fcnt].match("/\\/Hanshin\\//")) //路線名
				{
					if (A_line[4] == "013") {
						route = "阪神高速";
					}

					if (A_line[14] == "00") {
						discount1 = "阪神高速多頻度割引（事業者向け）摘要　通常（割引対象） ";
					}

					if (A_line[29] == "1") {
						discount2 += "環境割引 ";
					} else if (A_line[29] == "2") {
						discount2 += "路線バス割引 ";
					} else if (A_line[29] == "3") {
						discount2 += "回数券付替 ";
					} else if (A_line[29] == "4") {
						discount2 += "環境割引・回数券付替 ";
					}
				}

// 2022cvt_019
			if (A_billFile[fcnt].match("/\\/HonShi\\//"))
			// if (preg_match("/\\/HonShi\\//", A_billFile[fcnt]) == true) //路線名
				{
					if (A_line[4] == "001") {
						route = "神戸淡路鳴門";
					} else if (A_line[4] == "002") {
						route = "瀬戸中央";
					} else if (A_line[4] == "003") {
						route = "西瀬戸";
					}

					if (A_line[14] == "00") {
						discount1 = "大口・多頻度割引摘要　通常（割引対象） ";
					} else if (A_line[14] == "01") {
						discount1 = "";
					} else if (A_line[14] == "02") {
						discount1 = "大口・多頻度割引摘要　車両不一致 ";
					}

					if (A_line[15] == "1") {
						note = "通行止めによる通行料金の調整有 ";
					}

					if (A_line[33] == "0") {
						discount2 += "ETC特別割引 ";
					}
				}

			if (A_line[9] == "01") {
// 2022cvt_016
				car_type = "普通車";
			} else if (A_line[9] == "02") {
// 2022cvt_016
				car_type = "大型車";
			} else if (A_line[9] == "03") {
// 2022cvt_016
				car_type = "特大車";
			} else if (A_line[9] == "04") {
// 2022cvt_016
				car_type = "中型車";
			} else if (A_line[9] == "05") {
// 2022cvt_016
				car_type = "軽自動車等";
			}

// 2022cvt_016
			write_buf += A_pactid[cnt] + "\t" + A_line[1] + "\t" + A_line[0] + "\t" + route + "\t" + A_line[5] + "\t" + A_line[6] + "\t" + A_line[7] + "\t" + A_line[8] + "\t" + usedate + "\t" + A_line[11] + "\t" + discount1 + "\t" + discount2 + "\t" + note + "\t" + car_type + "\t" + coid + "\n";

// 2022cvt_019
			if (-1 !== CARD_result.indexOf(A_line[1]) == false && !card_xx_write_buf.match("/" + A_line[1] + "/")) //card_xx_tbへのコピー文のバッファ
				{
					copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + A_line[1] + "\t" + A_line[1] + "\t" + A_line[0] + "\t" + nowtime + "\t" + nowtime + "\tfalse\n";
					card_xx_write_buf += copy_buf;
				}

			if (target == "n") //card_tbにデータが無いときはコピー文作成
				{
// 2022cvt_019
					if (-1 !== CARD_now_result.indexOf(A_line[1]) == false && !card_write_buf.match("/" + A_line[1] + "/")) {
						copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + A_line[1] + "\t" + A_line[1] + "\t" + A_line[0] + "\t" + nowtime + "\t" + nowtime + "\tfalse\n";
						card_write_buf += copy_buf;
					}

					if (-1 !== CARD_now_delete_result.indexOf(A_line[1]) == true) {
// 2022cvt_015
						var del_sql = "delete from card_tb where cardno='" + A_line[1] + "' and pactid=" + A_pactid[cnt] + " and delete_flg=true";

						if (-1 !== A_del_sql.indexOf(del_sql) == false) {
							A_del_sql.push(del_sql);
						}
					}
				}
		}
	}

	// if (ifp != undefined) {
	// 	fclose(ifp);
	// }

	if (error_flg == true) {
		continue;
	}

	fs.writeFileSync(card_xx_fp, card_xx_write_buf);// 2022cvt_006
	// fflush(card_xx_fp);

	if (target == "n") {
		fs.writeFileSync(card_fp, card_write_buf);// 2022cvt_006
		// fflush(card_fp);
	}

	fs.writeFileSync(cardusehistory_fp, write_buf);// 2022cvt_006
	// fflush(cardusehistory_fp);
	if (DEBUG_FLG) {
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "件のデータの処理を行いました");
	};
	logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "件の処理を行いました");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fs.closeSync(card_xx_fp);
// fclose(card_xx_fp);

if (target == "n") {
	fs.closeSync(card_fp);
	// fclose(card_fp);
}

fs.closeSync(cardusehistory_fp);

if (fin_cnt < 1) //２重起動ロック解除
	{
		lock(false, dbh);
		if (DEBUG_FLG) {
			logging("ERROR: １件も成功しませんでした");
		}
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 １件も成功しませんでした");
		throw process.exit(1);// 2022cvt_009
	}

if (backup == "y") //CARD_usehistory_X_TBのバックアップ
	//エクスポート失敗した場合
	{
// 2022cvt_015
		var cardusehistoryX_exp = DATA_EXP_DIR + "/" + cardusehistoryX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
// 2022cvt_015
		var sql_str = "select * from " + cardusehistoryX_tb;
// 2022cvt_015
		var rtn = await dbh.backup(cardusehistoryX_exp, sql_str);

		if (rtn == false) {
			if (DEBUG_FLG) {
				logging("ERROR: " + cardusehistoryX_tb + "のデータエクスポートに失敗しました ");
			}
			logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + cardusehistoryX_tb + "のデータエクスポートに失敗しました" + cardusehistoryX_exp);
		} else {
			if (DEBUG_FLG) {
				logging("INFO: " + cardusehistoryX_tb + "のデータエクスポートを行いました " + cardusehistoryX_exp);
			}
		}
	}

dbh.begin();

if (mode == "o") //対象pactidを１つの文字列に変換
	//CARD_usehistory_XX_TBの削除
	{
// 2022cvt_015
		var pactin = "";

		for (cnt = 0; cnt < fin_cnt; cnt++) {
			pactin += fin_pact[cnt] + ",";
		}

		pactin = pactin.replace(",", "");
		// pactin = rtrim(pactin, ",");
		dbh.query("delete from " + cardusehistoryX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + A_coid.join(",") + ");", true);
		if (DEBUG_FLG) {
			logging("INFO: " + cardusehistoryX_tb + "の既存データの削除を行いました " + "delete from " + cardusehistoryX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + A_coid.join(",") + ");");
		}
		logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + cardusehistoryX_tb + "の既存データの削除を行いました" + cardusehistoryX_tb);
	}

if (fs.statSync(card_xx_filename).size != 0)
// if (filesize(card_xx_filename) != 0) //card_X_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var cardX_col = ["pactid", "postid", "cardno", "cardno_view", "card_corpno", "recdate", "fixdate", "delete_flg"];
		var rtn2 = await doCopyInsert(cardX_tb, card_xx_filename, cardX_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + cardX_tb + "のデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + cardX_tb + "のデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + cardX_tb + "のデータインポートを行いました " + card_xx_filename);
			}
			logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + cardX_tb + "のデータインポートを行いました " + card_xx_filename);
		}
	}

if (target == "n") {
	if (fs.statSync(card_filename).size != 0)
	// if (filesize(card_filename) != 0) //削除フラグが立っている電話でコピー文に含まれる電話はcard_tbから消す
		//card_tb へインポート
		//インポート失敗した場合
		{
// 2022cvt_015
			for (var sql of A_del_sql) {
				dbh.query(sql, true);
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 card_tbの削除済カードの削除を行いました(" + sql + ")");
				if (DEBUG_FLG) {
					logging("INFO: ETCコーポレートカード請求データ取込処理 card_tbの削除済カードの削除を行いました(" + sql + ")");
				}
			}

// 2022cvt_015
			var card_col = ["pactid", "postid", "cardno", "cardno_view", "card_corpno", "recdate", "fixdate", "delete_flg"];
			rtn2 = await doCopyInsert("card_tb", card_filename, card_col, dbh);

			if (rtn2 != 0) //ロールバック
				{
					if (DEBUG_FLG) {
						logging("ERROR: card_tbのデータインポートに失敗しました ");
					}
					logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 card_tbのデータインポートに失敗しました ");
					dbh.rollback();
					throw process.exit(1);// 2022cvt_009
				} else {
				if (DEBUG_FLG) {
					logging("INFO: card_tbのデータインポートを行いました " + card_filename);
				}
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 card_tbのデータインポートを行いました " + card_filename);
			}
		}
}

if (fs.statSync(cardusehistory_filename).size != 0) //card_usehistory_X_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_016
// 2022cvt_015
		var cardusehistoryX_col = ["pactid", "cardno", "card_corpno", "route_name", "in_id", "in_name", "out_id", "out_name", "date", "charge", "discount1", "discount2", "note", "car_type", "cardcoid"];
		rtn2 = await doCopyInsert(cardusehistoryX_tb, cardusehistory_filename, cardusehistoryX_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + cardusehistoryX_tb + "のデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + cardusehistoryX_tb + "のデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + cardusehistoryX_tb + "のデータインポートを行いました " + cardusehistory_filename);
			}
			logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 " + cardusehistoryX_tb + "のデータインポートを行いました " + cardusehistory_filename);
		}
	}

dbh.commit();

for (cnt = 0; cnt < fin_cnt; cnt++) //請求元毎に処理
{
	for (idx = 0; idx < A_dataDir.length; idx++) //データディレクトリがある時
	//全件指定
	{
		if (pactid == "all") {
// 2022cvt_015
			var dataDir = A_dataDir[idx] + "/" + fin_pact[cnt];
		} else {
			dataDir = A_dataDir[idx];
		}

		if (fs.existsSync(dataDir) == true) //ファイルの移動// 2022cvt_003
			{
// 2022cvt_015
				var finDir = dataDir + "/fin";

				if (fs.existsSync(finDir) == false) //完了ディレクトリの作成// 2022cvt_003
					{
						try {
							fs.mkdirSync(finDir, 700);
							if (DEBUG_FLG) {
								logging("ERROR: 完了ディレクトリの作成に失敗しました " + finDir);
							}
							logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理  完了ディレクトリの作成に失敗しました " + finDir);
						} catch (e) {
							if (DEBUG_FLG) {
								logging("INFO: 完了ディレクトリの作成しました " + finDir);
							}
							logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理  完了ディレクトリの作成しました " + finDir);
							throw process.exit(1);// 2022cvt_009
						}
					}

// 				clearstatcache();// 2022cvt_012
					var dirh = fs.readdirSync(dataDir);
				// dirh = openDir(dataDir);// 2022cvt_004

				for (var copyfileName of dirh) {
				// while (copyfileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
// 2022cvt_019
					if (fs.statSync(dataDir + "/" + copyfileName).isFile() && copyfileName.match("/\\OTMEISAI.txt$/i")) {
					// if (is_file(dataDir + "/" + copyfileName) == true && preg_match("/\\OTMEISAI.txt$/i", copyfileName) == true) {
						try {
							fs.renameSync(dataDir + "/" + copyfileName, finDir + "/" + copyfileName);
							if (DEBUG_FLG) {
								logging("INFO: ファイルの移動をしました " + dataDir + "/" + copyfileName);
							}
							logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理  ファイルの移動をしました " + dataDir + "/" + copyfileName);
						} catch (e) {
							if (DEBUG_FLG) {
								logging("ERROR: ファイルの移動に失敗しました " + dataDir + "/" + copyfileName);
							}
							logh.putError(G_SCRIPT_ERROR, "import_etc_coprhist.php ETCコーポレートカード請求データ取込処理  ファイルの移動に失敗しました " + dataDir + "/" + copyfileName);
							throw process.exit(1);// 2022cvt_009
						}
// 						clearstatcache();// 2022cvt_012
					}
				}

				// closedir(dirh);
			}
	}
}

lock(false, dbh);
console.log("ETCコーポレートカード請求データ取込処理(" + SCRIPT_FILENAME + ")を終了しました。\n");
if (DEBUG_FLG) {
	logging("END: ETCコーポレートカード請求データ取込処理(" + SCRIPT_FILENAME + ")を終了しました");
}
logh.putError(G_SCRIPT_END, SCRIPT_FILENAME + " ETCコーポレートカード請求データ取込処理 処理を終了しました");
throw process.exit(0);// 2022cvt_009

function makeMeisaiLineArray(line: string, A_form: Array<any>) {
// 2022cvt_015
	var A_line = Array();
// 2022cvt_015
	var A_used = Array();
// 2022cvt_015
	var start = 0;

// 2022cvt_015
	for (var idx = 0; idx < A_form.length; idx++) {
		A_line.push(line.substring(start, A_form[idx]));
		A_used.push(A_form[idx]);
		start = A_used.reduce((accumulator, currentValue) => { return accumulator + currentValue });
		// start = array_sum(A_used);
	}

	return A_line;
};

function makeInfoLineArray(line: string, A_form: Array<any>) {
// 2022cvt_015
	var A_line = Array();
// 2022cvt_015
	var A_used = Array();
// 2022cvt_015
	var start = 0;

// 2022cvt_015
	for (var idx = 0; idx < A_form.length; idx++) {
		A_line.push(line.substring(start, A_form[idx]));
		A_used.push(A_form[idx]);
		start = A_used.reduce((accumulator, currentValue) => { return accumulator + currentValue });
	}

	return A_line;
};

function checkMeisaiFormat(A_line: Array<any>) //1,お客様番号
//ダミー
{
// 2022cvt_015
	var errcnt = 0;

// 2022cvt_019
	if (!A_line[0].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[0]) == false) {
		if (DEBUG_FLG) {
			logging("お客様番号のフォーマットが違います " + A_line[0]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[1].match("/^(\\d){15}$/")) {
	// if (preg_match("/^(\\d){15}$/", A_line[1]) == false) {
		if (DEBUG_FLG) {
			logging("カード番号のフォーマットが違います " + A_line[1]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[2].match("/^(\\d){5}$/")) {
	// if (preg_match("/^(\\d){5}$/", A_line[2]) == false) {
		if (DEBUG_FLG) {
			logging("組合員番号のフォーマットが違います " + A_line[2]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[3].match("/^(\\d){8}$/")) {
	// if (preg_match("/^(\\d){8}$/", A_line[3]) == false) {
		if (DEBUG_FLG) {
			logging("利用日付のフォーマットが違います " + A_line[3]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[4].match("/^0(\\d){2}$/")) {
	// if (preg_match("/^0(\\d){2}$/", A_line[4]) == false) {
		if (DEBUG_FLG) {
			logging("路線のフォーマットが違います " + A_line[4]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (A_line[5].match("/^00(\\d){3}$/")) {
	// if (preg_match("/^00(\\d){3}$/", A_line[5]) == false) {
		if (DEBUG_FLG) {
			logging("入り口ICのフォーマットが違います " + A_line[5]);
		}
		errcnt++;
	}

	if (countChars(A_line[6]) != 10) {
	// if (mb_strlen(A_line[6], "UTF-8") != 10) {
		if (DEBUG_FLG) {
			logging("入り口IC名のフォーマットが違います " + A_line[6]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[7].match("/^00(\\d){3}$/")) {
	// if (preg_match("/^00(\\d){3}$/", A_line[7]) == false) {
		if (DEBUG_FLG) {
			logging("出口IC番号のフォーマットが違います " + A_line[7]);
		}
		errcnt++;
	}

	if (countChars(A_line[8]) != 10) {
	// if (mb_strlen(A_line[8], "UTF-8") != 10) {
		if (DEBUG_FLG) {
			logging("出口ID名のフォーマットが違います " + A_line[8]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[9].match("/^0(\\d){1}$/")) {
	// if (preg_match("/^0(\\d){1}$/", A_line[9]) == false) {
		if (DEBUG_FLG) {
			logging("車種のフォーマットが違います " + A_line[9]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[10].match("/^(\\d){6}$/")) {
	// if (preg_match("/^(\\d){6}$/", A_line[10]) == false) {
		if (DEBUG_FLG) {
			logging("通行料金のフォーマットが違います " + A_line[10]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[11].match("/^(\\d){6}$/")) {
	// if (preg_match("/^(\\d){6}$/", A_line[11]) == false) {
		if (DEBUG_FLG) {
			logging("高速料金のフォーマットが違います " + A_line[11]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[12].match("/^(\\d){6}$/")) {
	// if (preg_match("/^(\\d){6}$/", A_line[12]) == false) {
		if (DEBUG_FLG) {
			logging("一般道路料金のフォーマットが違います " + A_line[12]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[13].match("/^(\\d){6}$/")) {
	// if (preg_match("/^(\\d){6}$/", A_line[13]) == false) {
		if (DEBUG_FLG) {
			logging("公社料金等のフォーマットが違います " + A_line[13]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[14].match("/^(00|01|02)$/")) {
	// if (preg_match("/^(00|01|02)$/", A_line[14]) == false) {
		if (DEBUG_FLG) {
			logging("割引有無区分のフォーマットが違います " + A_line[14]);
		}
		errcnt++;
	}

// 2022cvt_015
	for (var iii = 15; iii <= 34; iii++) {
// 2022cvt_019
		if (!A_line[iii].match("/^(\\d){1}$/")) {
		// if (preg_match("/^(\\d){1}$/", A_line[iii]) == false) {
			if (DEBUG_FLG) {
				logging("区分" + iii + 1 + "のフォーマットが違います " + A_line[iii]);
			}
			errcnt++;
		}
	}

	if (countChars(A_line[35]) != 9) {
	// if (mb_strlen(A_line[35]) != 9) {
		if (DEBUG_FLG) {
			logging("お客様番号のフォーマットが違います " + A_line[16]);
		}
		errcnt++;
	}

	if (errcnt != 0) {
		return false;
	} else {
		return true;
	}
};

function checkInfoFormat(A_line: string) //1,お客様番号
{
// 2022cvt_015
	var errcnt = 0;

// 2022cvt_019
	if (!A_line[0].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[0]) == false) {
		if (DEBUG_FLG) {
			logging("お客様番号のフォーマットが違います " + A_line[0]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[1].match("/^(\\d){5}$/")) {
	// if (preg_match("/^(\\d){5}$/", A_line[1]) == false) {
		if (DEBUG_FLG) {
			logging("組合員番号のフォーマットが違います " + A_line[1]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[2].match("/^(\\d){6}$/")) {
	// if (preg_match("/^(\\d){6}$/", A_line[2]) == false) {
		if (DEBUG_FLG) {
			logging("請求年月のフォーマットが違います " + A_line[2]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[3].match("/^(\\d){14}$/")) {
	// if (preg_match("/^(\\d){14}$/", A_line[3]) == false) {
		if (DEBUG_FLG) {
			logging("カード単位管理番号のフォーマットが違います " + A_line[3]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[4].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[4]) == false) {
		if (DEBUG_FLG) {
			logging("通行料金のフォーマットが違います " + A_line[4]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (A_line[5].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[5]) == false) {
		if (DEBUG_FLG) {
			logging("路線バス割引対象額のフォーマットが違います " + A_line[5]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[7].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[7]) == false) {
		if (DEBUG_FLG) {
			logging("路線バス割引額のフォーマットが違います " + A_line[7]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[9].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[9]) == false) {
		if (DEBUG_FLG) {
			logging("車両単位割引対象額（高速道路）のフォーマットが違います " + A_line[9]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[10].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[10]) == false) {
		if (DEBUG_FLG) {
			logging("車両単位割引対象額（一般有料道路）のフォーマットが違います " + A_line[10]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[11].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[11]) == false) {
		if (DEBUG_FLG) {
			logging("車両単位割引額（高速道路）のフォーマットが違います " + A_line[11]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[12].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[12]) == false) {
		if (DEBUG_FLG) {
			logging("車両単位割引額（一般有料道路）のフォーマットが違います " + A_line[12]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[13].match("/^(\\+|\\-)$/")) {
	// if (preg_match("/^(\\+|\\-)$/", A_line[13]) == false) {
		if (DEBUG_FLG) {
			logging("調整符号のフォーマットが違います " + A_line[13]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[14].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[14]) == false) {
		if (DEBUG_FLG) {
			logging("調整金額のフォーマットが違います " + A_line[14]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[16].match("/^(\\+|\\-)$/")) {
	// if (preg_match("/^(\\+|\\-)$/", A_line[15]) == false) {
		if (DEBUG_FLG) {
			logging("調整符号のフォーマットが違います " + A_line[15]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[16].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[16]) == false) {
		if (DEBUG_FLG) {
			logging("請求金額のフォーマットが違います " + A_line[16]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[17].match("/^(\\d){15}$/")) {
	// if (preg_match("/^(\\d){15}$/", A_line[17]) == false) {
		if (DEBUG_FLG) {
			logging("集計対象カード番号１のフォーマットが違います " + A_line[17]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[18].match("/^(\\d){15}$/")) {
	// if (preg_match("/^(\\d){15}$/", A_line[18]) == false) {
		if (DEBUG_FLG) {
			logging("集計対象カード番号２のフォーマットが違います " + A_line[18]);
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[19].match("/^(\\d){15}$/")) {
	// if (preg_match("/^(\\d){15}$/", A_line[19]) == false) {
		if (DEBUG_FLG) {
			logging("集計対象カード番号３のフォーマットが違います " + A_line[19]);
		}
		errcnt++;
	}

	if (errcnt != 0) {
		return false;
	} else {
		return true;
	}
};

	async function doCopyInsert(table: string, filename: string, columns: Array<any>, db: ScriptDB) //ファイルを開く
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
	// while (line = fgets(fp)) //tabで区切り配列に
	//要素数チェック
	//カラム名をキーにした配列を作る
	//インサート行の追加
	{
// 2022cvt_015
		var A_line = line.split("\t");
		// var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) {
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
			logh.putError(G_SCRIPT_ERROR, filename + "のデータ数が設定と異なります。データ=" + line);
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

	async function lock(is_lock: boolean, db: ScriptDB) //ロックする
{
	if (db == undefined) {
		return false;
	}

// 2022cvt_015
	var pre = db.escape("batch_" + SCRIPT_FILENAME);

	if (is_lock == true) //既に起動中
		//現在の日付を得る
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

function getRiyouYM(year: number, month: number) //１月請求の時は１２月、年も－１
{
// 2022cvt_015
	var A_riyou: { [key: string]: any } = {};
// 2022cvt_015
	var riyou_year = year;
// 2022cvt_015
	var riyou_month = month - 1;

	if (month == 1) {
		riyou_month = 12;
		riyou_year = year - 1;
	}

	A_riyou.year = riyou_year;
	A_riyou.month = riyou_month;
	return A_riyou;
};
})();
