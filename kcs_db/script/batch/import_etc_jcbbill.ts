// 2022cvt_026
import TableNo, { ScriptDB, TableInserter } from "../batch/lib/script_db";
// require("lib/script_db.php");

// 2022cvt_026
import { ScriptLogBase, ScriptLogFile, G_SCRIPT_ERROR, G_SCRIPT_WARNING, G_SCRIPT_ALL, ScriptLogAdaptor, G_SCRIPT_BEGIN, G_SCRIPT_INFO, G_SCRIPT_END } from "../batch/lib/script_log";
// require("lib/script_log.php");

import * as ScriptCommon from "../batch/lib/script_common";

import * as DEFINE from "../../db_define/define";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as flock from "proper-lockfile";
import preg_match_all from "../../class/preg_match_all";

(async () => {
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_etc_jcbbill.php";
const JCB_COID = 5;
const JCB_UTICODE = "001";
const JCB_SEIKYU_UTICODE = "002";
const AFTER_ENCO = "UTF-8";
const BEFORE_ENCO = "SJIS";
// 2022cvt_015
var dbLogFile = DEFINE.DATA_LOG_DIR + "/card_billbat.log";
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
					// delete A_para[0];
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
								// month_view = trim(month, "0");
							}

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("請求年月の指定が不正です。" + process.argv[cnt]);
							}

// 2022cvt_015
							var A_riyou = getRiyouYM(year, month);
						}

					A_para -= 1;
					// delete A_para[1];
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
					// delete A_para[2];
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
					// delete A_para[3];
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
				// delete A_para[4];
				continue;
			}

			usage("パラメータの指定が不正です。" + process.argv[0]);
		}

		if (A_para != 0) {
			usage("パラメータの指定が不正です。" + process.argv[0]);
		}
	}

// 2022cvt_015
var JCB_DIR = DEFINE.DATA_DIR + "/" + year + month + "/ETC/JCB";

if (fs.existsSync(JCB_DIR) == false) {// 2022cvt_003
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人用ETCカード請求データ取込処理 JCB法人用ETCカード請求データディレクトリ（" + JCB_DIR + "）がみつかりません");
	throw process.exit(1);// 2022cvt_009
}

try {
	var dirh = fs.readdirSync(JCB_DIR);
} catch (e)  {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人用ETCカード請求データ取込処理 JCB法人用ETCカード請求データディレクトリ（" + JCB_DIR + "）を開けません");
	throw process.exit(1);// 2022cvt_009
}

logh.putError(G_SCRIPT_BEGIN, SCRIPT_FILENAME + " JCB法人用ETCカード請求データ取込処理 処理を開始します");
// 2022cvt_015
var LocalLogFile = DEFINE.DATA_DIR + "/" + year + month + "/ETC/import_etc_jcb.log";

try {
	var ifp = fs.openSync(LocalLogFile, "a");
	fs.closeSync(ifp);
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人用ETCカード請求データ取込処理 ログファイル（" + LocalLogFile + "）を開けません");
	throw process.exit(1);// 2022cvt_009
}

if (DEBUG_FLG) {
	logging("START: JCB法人用ETCカード請求データ取込処理(" + SCRIPT_FILENAME + ")を開始します");
}

if (pactid == "all") {
	if (fs.existsSync(JCB_DIR) == false) {// 2022cvt_003
		if (DEBUG_FLG) {
			logging(SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "）はみつかりません");
		}
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "）がみつかりません");
		throw process.exit(1);// 2022cvt_009
	} else {
		if (DEBUG_FLG) {
			logging(SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "）はみつかりました");
		}
	}
} else {
	if (fs.existsSync(JCB_DIR + "/" + pactid) == false) {// 2022cvt_003
		if (DEBUG_FLG) {
			logging(SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "/" + pactid + "）はみつかりません");
		}
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "/以下）がみつかりません");
		throw process.exit(1);// 2022cvt_009
	} else {
		if (DEBUG_FLG) {
			logging(SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "/" + pactid + "）はみつかりました");
		}
	}
}

// clearstatcache();// 2022cvt_012
// 2022cvt_015
var A_pactid = Array();

if (pactid == "all") ///kcs/data/yyyymm/ETC以下のディレクトリを開く
	//処理する契約ＩＤを取得する
	{
		var dirh = fs.readdirSync(JCB_DIR);
		// var dirh = openDir(JCB_DIR);// 2022cvt_004

		for (var pactName of dirh)
		// while (pactName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
		{
			if (fs.existsSync(JCB_DIR + "/" + pactName) && pactName != "." && pactName != "..") {// 2022cvt_003
				if (-1 !== A_pactid.indexOf(pactName) == false) {
					A_pactid.push(pactName);
				}

				if (DEBUG_FLG) {
					logging("INFO: 対象ディレクトリ " + JCB_DIR + "/" + pactName);
				}
			}

// 			clearstatcache();// 2022cvt_012
		}

		// closedir(dirh);
	} else ///kcs/data/yyyymm/ETC/JCB/pact以下のディレクトリを開く
	//処理する契約ＩＤを取得する
	{
		A_pactid.push(pactid);
		var dirh = fs.readdirSync(JCB_DIR + "/" + pactid);
		// dirh = openDir(JCB_DIR + "/" + pactid);// 2022cvt_004

		for (var pactName of dirh)
		// while (pactName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
		{
			if (fs.existsSync(JCB_DIR + "/" + pactid + "/" + pactName) && pactName != "." && pactName != "..") {// 2022cvt_003
				if (DEBUG_FLG) {
					logging("INFO: 対象ディレクトリ " + JCB_DIR);
				}
			}

// 			clearstatcache();// 2022cvt_012
		}

		// closedir(dirh);
	}

A_pactid.sort();

if (A_pactid.length == 0 || undefined !== A_pactid == false) //エラー終了
	{
		if (DEBUG_FLG) {
			logging("ERROR: Pact用データディレクトリが１つもありません");
		}
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 Pact用データディレクトリが１つもありません");
		throw process.exit(1);// 2022cvt_009
	}

if (await lock(true, dbh) == false) {
	if (DEBUG_FLG) {
		logging("ERROR: 既に起動しています");
	}
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理  既に起動しています");
	throw process.exit(1);// 2022cvt_009
}

// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var cardX_tb = "card_" + tableNo + "_tb";
// 2022cvt_015
var carddetailX_tb = "card_details_" + tableNo + "_tb";
if (DEBUG_FLG) {
	logging("INFO: 対象テーブル " + cardX_tb + " & " + carddetailX_tb);
}
// 2022cvt_015
var card_xx_filename = JCB_DIR + "/" + cardX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var card_xx_fp;
try {
	card_xx_fp = fs.openSync(card_xx_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + card_xx_filename + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + card_xx_filename + "のオープン失敗");
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
	card_filename = JCB_DIR + "/card_tb" + year + month + pactid + ".ins";
// 2022cvt_015
	try {
		card_fp = fs.openSync(card_filename, "w");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("ERROR: " + card_fp + "のオープン失敗");
		}
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + card_fp + "のオープン失敗");
		throw process.exit(1);// 2022cvt_009
	}
	// var card_fp = fopen(card_filename, "w");

	if (DEBUG_FLG) {
		logging("INFO: card_tbへのcopy文ファイルOPEN " + card_filename);
	}
}

// 2022cvt_015
var carddetail_filename = JCB_DIR + "/" + carddetailX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var carddetail_fp;
try {
	carddetail_fp = fs.openSync(carddetail_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + carddetail_filename + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + carddetail_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var carddetail_fp = fopen(carddetail_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: card_details_XX_tbへのcopy文ファイルOPEN " + carddetail_filename);
}
// 2022cvt_015
var fin_cnt = 0;
// 2022cvt_015
var nowtime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
// 2022cvt_015
var A_del_sql = Array();

var fin_pact = Array();

for (cnt = 0; cnt < A_pactid.length; cnt++) //取り込むデータ数をカウントするための変数
//エラー用フラグ
//card_xx_tbへのcopy文をファイルに一度に書き込むためのバッファ
//card_tbへのcopy文をファイルに一度に書き込むためのバッファ
//対象会社の会社名を取得
//請求データファイル名を取得する
//処理する請求データファイル名配列
//データディレクトリ
//対象ファイルを配列に入れる
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
	var detail_xx_write_buf = "";
// 2022cvt_015
	var PACT_result = await dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) {
			logging("WARNING:  対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		}
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象会社の会社名を取得 " + PACT_result);
	}
	if (DEBUG_FLG) {
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "のデータの処理を開始します");
	}
	logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 処理を開始します");
// 2022cvt_015
	var A_billFile = Array();
// 2022cvt_015
	var dataDirPact = JCB_DIR + "/" + A_pactid[cnt];

	if (fs.existsSync(dataDirPact) == true) {// 2022cvt_003

		dirh = fs.readdirSync(dataDirPact);
		// dirh = openDir(dataDirPact);// 2022cvt_004

		for (var fileName of dirh) {
		// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
// 2022cvt_019
			if (fs.statSync(dataDirPact + "/" + fileName).isFile() && fileName.match("/\\.txt/")) {
			// if (is_file(dataDirPact + "/" + fileName) == true && preg_match("/\\.txt/", fileName) == true) {
				A_billFile.push(dataDirPact + "/" + fileName);
				if (DEBUG_FLG) {
					logging("INFO: 対象請求データファイル名 " + dataDirPact + "/" + fileName);
				}
			}

// 			clearstatcache();// 2022cvt_012
		}

		// closedir(dirh);
	}

	if (A_billFile.length == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象ファイルがみつかりません（" + dataDirPact + "/以下）");
		}
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + dataDirPact + "/以下 対象ファイルがみつかりません（" + dataDirPact + "）");
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

	var CARD_now_result: { [key: string]: any } = {};
	var card_write_buf = "";
	var CARD_now_delete_result: { [key: string]: any } = {};

	if (target == "n") {
// 2022cvt_015
		CARD_now_result = await dbh.getCol("select cardno from card_tb where delete_flg = false and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

		if (Array.isArray(CARD_now_result) == false) {
			CARD_now_result = Array();
		}

		if (DEBUG_FLG) {
			logging("INFO: 最新の登録ETCカードのリストを取得 " + CARD_now_result.length + "件 select cardno from card_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
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
	var A_prcardno = await dbh.getCol("select card_master_no from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid in (" + JCB_COID + ");", true);

	if (A_prcardno.length == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 請求先コード（法人番号）が１つも登録されていません" + "select card_master_no from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid = " + JCB_COID + ";");
		}
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 請求先コード（法人番号）が１つも登録されていません");
		continue;
	}

// 2022cvt_015
	for (var fcnt = 0; fcnt < A_billFile.length; fcnt++) //------------------------------------------------------------
	//ASP権限チェック 「ASP利用料表示設定」 がＯＮになっているか
	//------------------------------------------------------------
	//ファイルが開けなかった時
	//ファイル１行ずつ処理するwhile閉じ
	{
// 2022cvt_015
		var aspFlg = false;

		if (await chkAsp(dbh.escape(A_pactid[cnt])) == true) //ASP使用料が数字以外で返って来た時
			{
				aspFlg = true;
				if (DEBUG_FLG) {
					logging("INFO: ASP利用料表示設定がＯＮ");
				}
// 2022cvt_015
				var asp_charge = await dbh.getOne("select charge from card_asp_charge_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid = " + JCB_COID + " ;", true);

				if (!isNaN(asp_charge) == false) {
				// if (is_numeric(asp_charge) == false) {
					if (DEBUG_FLG) {
						logging("WARNING: ASP使用料が設定されていません pactid：" + A_pactid[cnt]);
					}
					logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ASP使用料が設定されていません ");
					error_flg = true;
					break;
				}

				if (DEBUG_FLG) {
					logging("INFO: ASP使用料取得　" + asp_charge);
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
			logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ファイルのOPENに失敗しました " + A_billFile[fcnt]);
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
		//タブで区切って配列に
		//通行料金
		//ASP利用料がONの場合
		{
			// line = mb_convert_encoding(line, AFTER_ENCO, BEFORE_ENCO);
// 2022cvt_015
			var A_line = line.split("\t");
			// var A_line = split("\t", line);

// 2022cvt_019
			if (!A_line[0].match("/^(\\d){0,}$/")) {
			// if (preg_match("/^(\\d){0,}$/", A_line[0]) == false) {
				if (DEBUG_FLG) {
					logging("INFO:１行目は飛ばす " + A_line[0]);
				}
				continue;
			}

			if (checkFormat(A_line) == false) {
				if (DEBUG_FLG) {
					logging("WARNING: フォーマットが異なります " + A_billFile[fcnt]);
				}
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_billFile[fcnt] + " データファイルのフォーマットが異なります。処理を中断します。１件も取込ませんでした。 " + A_billFile[fcnt]);
				error_flg = true;
				break;
			}

			if (-1 !== A_prcardno.indexOf(A_line[0]) == false) {
				if (DEBUG_FLG) {
					logging("ERROR: ファイルに記載されている法人番号(" + A_line[0] + ")と登録された法人番号(" + A_prcardno.join(",") + ")が異なります " + A_billFile[fcnt] + "(" + A_line[1] + "の行)");
				}
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_billFile[fcnt] + " ファイルに記載されている法人番号(" + A_line[0] + ")と登録された法人番号(" + A_prcardno.join(",") + ")が異なります。処理を中断します。１件も取込ませんでした。 " + A_billFile[fcnt] + "(" + A_line[1] + "の行)");
				error_flg = true;
				break;
			}

// 2022cvt_015
			var trg_post = await dbh.getOne("select postid from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and card_master_no = '" + A_line[0] + "';", true);

			if (trg_post == "") {
				if (DEBUG_FLG) {
					logging("ERROR: 未登録カードの登録先部署が取得できません" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
				}
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 未登録カードの登録先部署が取得できません");
				error_flg = true;
				break;
			}

// 2022cvt_015
			var viewcnt = 1;
// 2022cvt_015
			var copy_buf = "";

// 2022cvt_019
			if (!write_buf.match("/" + A_pactid[cnt] + "\t" + A_line[4] + "\t" + JCB_UTICODE + "\t通行料金\t/")) {
			// if (preg_match("/" + A_pactid[cnt] + "\t" + A_line[4] + "\t" + JCB_UTICODE + "\t\u901A\u884C\u6599\u91D1\t/", write_buf) == false) {
				write_buf += A_pactid[cnt] + "\t" + A_line[4] + "\t" + JCB_UTICODE + "\t通行料金\t/" + A_line[16].replace(/(,|")/g, "") + "\t\t" + viewcnt + "\t" + nowtime + "\t" + JCB_COID + "\t" + A_line[0] + "\n";
				viewcnt++;
				write_buf += A_pactid[cnt] + "\t" + A_line[4] + "\t" + JCB_SEIKYU_UTICODE + "\t通行料金\t" + A_line[16].replace(/(,|")/g, "") + "\t\t" + viewcnt + "\t" + nowtime + "\t" + JCB_COID + "\t" + A_line[0] + "\n";
			} else //通行料金、請求金額の置き換え
				//通行料金加算
				//通行料置き換え
				//請求金額置き換え
				{
					var A_match = preg_match_all("/" + A_pactid[cnt] + "\t" + A_line[4] + "\t" + JCB_UTICODE + "\t.*\n/", write_buf, "")
// 2022cvt_015
					var A_match_col = A_match[0][0].split("\t");
					// var A_match_col = split("\t", A_match[0][0]);
					A_match_col[4] = A_match_col[4] + A_line[16].replace(/(,|")/g, "");
// 2022cvt_015
					var new_buf = A_match_col.join("\t");
					write_buf = write_buf.replace("/" + A_pactid[cnt] + "\t" + A_line[4] + "\t" + JCB_UTICODE + "\t.*\n/", new_buf);
					// write_buf = preg_replace("/" + A_pactid[cnt] + "\t" + A_line[4] + "\t" + JCB_UTICODE + "\t.*\n/", new_buf, write_buf);
					A_match_col[2] = JCB_SEIKYU_UTICODE;
					A_match_col[3] = "請求金額";
					A_match_col[6]++;
					new_buf = A_match_col.join("\t");
					write_buf = write_buf.replace("/" + A_pactid[cnt] + "\t" + A_line[4] + "\t" + JCB_SEIKYU_UTICODE + "\t.*\n/", new_buf);
					// write_buf = preg_replace("/" + A_pactid[cnt] + "\t" + A_line[4] + "\t" + JCB_SEIKYU_UTICODE + "\t.*\n/", new_buf, write_buf);
				}

// 2022cvt_019
			if (aspFlg == true && !write_buf.match("/" + A_pactid[cnt] + "\t" + A_line[4] + "\t" + ScriptCommon.G_CODE_ASPX + "\tASP使用料/"))
			// if (aspFlg == true && preg_match("/" + A_pactid[cnt] + "\t" + A_line[4] + "\t" + G_CODE_ASPX + "\tASP\u4F7F\u7528\u6599/", write_buf) == false) //合計行のために１つ表示順を空ける
				{
					write_buf += A_pactid[cnt] + "\t" + A_line[4] + "\t" + ScriptCommon.G_CODE_ASPX + "\tASP使用料\t" + asp_charge + "\t\t100\t" + nowtime + "\t" + JCB_COID + "\t" + A_line[0] + "\n";
				}

// 2022cvt_019
			if (-1 !== CARD_result.indexOf(A_line[4]) == false && !card_xx_write_buf.match("/" + A_line[4] + "/"))
			// if (-1 !== CARD_result.indexOf(A_line[4]) == false && preg_match("/" + A_line[4] + "/", card_xx_write_buf) == false) //card_xx_tbへのコピー文のバッファ
				{
					copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + A_line[4] + "\t" + A_line[4] + "\t" + A_line[3] + "\t" + A_line[3] + "\t" + A_line[0] + "\t" + A_line[1] + "\t" + A_line[5] + "\t" + A_line[2] + "\t" + A_line[7] + "\t" + JCB_COID + "\t" + nowtime + "\t" + nowtime + "\tfalse\n";
					card_xx_write_buf += copy_buf;
				}

			if (target == "n") //card_tbにデータが無いときはコピー文作成
				{
// 2022cvt_019
					if (-1 !== CARD_now_result.indexOf(A_line[4]) == false && !card_write_buf.match("/" + A_line[4] + "/")) {
					// if (-1 !== CARD_now_result.indexOf(A_line[4]) == false && preg_match("/" + A_line[4] + "/", card_write_buf) == false) {
						copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + A_line[4] + "\t" + A_line[4] + "\t" + A_line[3] + "\t" + A_line[3] + "\t" + A_line[0] + "\t" + A_line[1] + "\t" + A_line[5] + "\t" + A_line[2] + "\t" + A_line[7] + "\t" + JCB_COID + "\t" + nowtime + "\t" + nowtime + "\tfalse\n";
						card_write_buf += copy_buf;
					}

					if (-1 !== CARD_now_delete_result.indexOf(A_line[4]) == true) {
// 2022cvt_015
						var del_sql = "delete from card_tb where cardno='" + A_line[4] + "' and pactid=" + A_pactid[cnt] + " and delete_flg=true";

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
		fs.writeFileSync(card_fp!, card_write_buf);// 2022cvt_006
		// fflush(card_fp);
	}

	fs.writeFileSync(carddetail_fp, write_buf);// 2022cvt_006
	// fflush(carddetail_fp);
	if (DEBUG_FLG) {
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "件のデータの処理を行いました");
	}
	logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "件の処理を行いました");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fs.closeSync(card_xx_fp);
// fclose(card_xx_fp);

if (target == "n") {
	fs.closeSync(card_fp);
	// fclose(card_fp);
}

fs.closeSync(carddetail_fp);
// fclose(carddetail_fp);

if (fin_cnt < 1) //２重起動ロック解除
	{
		lock(false, dbh);
		if (DEBUG_FLG) {
			logging("ERROR: １件も成功しませんでした");
		}
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 １件も成功しませんでした");
		throw process.exit(1);// 2022cvt_009
	}

if (backup == "y") //CARD_DETAILS_X_TBのバックアップ
	//エクスポート失敗した場合
	{
// 2022cvt_015
		var carddetailX_exp = DEFINE.DATA_EXP_DIR + "/" + carddetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
// 2022cvt_015
		var sql_str = "select * from " + carddetailX_tb;
// 2022cvt_015
		var rtn = await dbh.backup(carddetailX_exp, sql_str);

		if (rtn == false) {
			if (DEBUG_FLG) {
				logging("ERROR: " + carddetailX_tb + "のデータエクスポートに失敗しました ");
			}
			logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + carddetailX_tb + "のデータエクスポートに失敗しました" + carddetailX_exp);
		} else {
			if (DEBUG_FLG) {
				logging("INFO: " + carddetailX_tb + "のデータエクスポートを行いました " + carddetailX_exp);
			}
		}
	}

dbh.begin();

if (mode == "o") //対象pactidを１つの文字列に変換
	//CARD_DETAIL_XX_TBの削除
	{
// 2022cvt_015
		var pactin = "";

		for (cnt = 0; cnt < fin_cnt; cnt++) {
			pactin += fin_pact[cnt] + ",";
		}

		pactin = pactin.replace(",", "");
		// pactin = rtrim(pactin, ",");
		dbh.query("delete from " + carddetailX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + JCB_COID + ");", true);
		if (DEBUG_FLG) {
			logging("INFO: " + carddetailX_tb + "の既存データの削除を行いました " + "delete from " + carddetailX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + JCB_COID + ");");
		}
		logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + carddetailX_tb + "の既存データの削除を行いました" + carddetailX_tb);
	}

if (fs.statSync(card_xx_filename).size != 0)
// if (filesize(card_xx_filename) != 0) //card_X_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var cardX_col = ["pactid", "postid", "cardno", "cardno_view", "bill_cardno", "bill_cardno_view", "card_corpno", "card_corpname", "card_meigi", "card_membername", "car_no", "cardcoid", "recdate", "fixdate", "delete_flg"];
		var rtn2 = await doCopyInsert(cardX_tb, card_xx_filename, cardX_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + cardX_tb + "のデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + cardX_tb + "のデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + cardX_tb + "のデータインポートを行いました " + card_xx_filename);
			}
			logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + cardX_tb + "のデータインポートを行いました " + card_xx_filename);
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
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 card_tbの削除済カードの削除を行いました(" + sql + ")");
				if (DEBUG_FLG) {
					logging("INFO: JCB法人ETCカード請求データ取込処理 card_tbの削除済カードの削除を行いました(" + sql + ")");
				}
			}

// 2022cvt_015
			var card_col = ["pactid", "postid", "cardno", "cardno_view", "bill_cardno", "bill_cardno_view", "card_corpno", "card_corpname", "card_meigi", "card_membername", "car_no", "cardcoid", "recdate", "fixdate", "delete_flg"];
			rtn2 = await doCopyInsert("card_tb", card_filename, card_col, dbh);

			if (rtn2 != 0) //ロールバック
				{
					if (DEBUG_FLG) {
						logging("ERROR: card_tbのデータインポートに失敗しました ");
					}
					logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 card_tbのデータインポートに失敗しました ");
					dbh.rollback();
					throw process.exit(1);// 2022cvt_009
				} else {
				if (DEBUG_FLG) {
					logging("INFO: card_tbのデータインポートを行いました " + card_filename);
				}
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 card_tbのデータインポートを行いました " + card_filename);
			}
		}
}

if (fs.statSync(carddetail_filename).size != 0)
// if (filesize(carddetail_filename) != 0) //card_details_X_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var carddetailX_col = ["pactid", "cardno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "cardcoid", "card_corpno"];
		rtn2 = await doCopyInsert(carddetailX_tb, carddetail_filename, carddetailX_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + carddetailX_tb + "のデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + carddetailX_tb + "のデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + carddetailX_tb + "のデータインポートを行いました " + carddetail_filename);
			}
			logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + carddetailX_tb + "のデータインポートを行いました " + carddetail_filename);
		}
	}

dbh.commit();
lock(false, dbh);
console.log("JCB法人ETCカード請求データ取込処理(" + SCRIPT_FILENAME + ")を終了しました。\n");
if (DEBUG_FLG) {
	logging("END: JCB法人ETCカード請求データ取込処理(" + SCRIPT_FILENAME + ")を終了しました");
}
logh.putError(G_SCRIPT_END, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 処理を終了しました");
throw process.exit(0);// 2022cvt_009

function checkFormat(A_line: string[]) //1,法人番号
{
// 2022cvt_015
	var errcnt = 0;

// 2022cvt_019
	if (!A_line[0].match("/^(\\d){0,}$/")) {
	// if (preg_match("/^(\\d){0,}$/", A_line[0]) == false) {
		if (DEBUG_FLG) {
			logging("法人番号のフォーマットが違います " + A_line[0] + "(" + A_line[4] + ")");
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[3].match("/^(\\d){0,}$/")) {
	// if (preg_match("/^(\\d){0,}$/", A_line[3]) == false) {
		if (DEBUG_FLG) {
			logging("JCB会員番号のフォーマットが違います " + A_line[3] + "(" + A_line[4] + ")");
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[4].match("/^(\\d){0,}$/")) {
	// if (preg_match("/^(\\d){0,}$/", A_line[4]) == false) {
		if (DEBUG_FLG) {
			logging("ETCカード番号のフォーマットが違います " + A_line[4] + "(" + A_line[4] + ")");
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[8].match("/^(\\d){0,8}$/")) {
	// if (preg_match("/^(\\d){0,8}$/", A_line[8]) == false) {
		if (DEBUG_FLG) {
			logging("利用日付のフォーマットが違います " + A_line[8] + "(" + A_line[4] + ")");
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[9].match("/^(\\d){0,}$/")) {
	// if (preg_match("/^(\\d){0,}$/", A_line[9]) == false) {
		if (DEBUG_FLG) {
			logging("時間のフォーマットが違います " + A_line[9] + "(" + A_line[4] + ")");
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[18].match("/^(\\d){0,}$/")) {
	// if (preg_match("/^(\\d){0,}$/", A_line[18]) == false) {
		if (DEBUG_FLG) {
			logging("入り口ICコードのフォーマットが違います " + A_line[18] + "(" + A_line[4] + ")");
		}
		errcnt++;
	}

// 2022cvt_019
	if (!A_line[19].match("/^(\\d){0,}$/")) {
	// if (preg_match("/^(\\d){0,}$/", A_line[19]) == false) {
		if (DEBUG_FLG) {
			logging("出口ICコードのフォーマットが違います " + A_line[19] + "(" + A_line[4] + ")");
		}
		errcnt++;
	}

	if (errcnt != 0) {
		return false;
	} else {
		return true;
	}
};

function checkInfoFormat(A_line: string) //1,法人番号
{
// 2022cvt_015
	var errcnt = 0;

// 2022cvt_019
	if (!A_line[0].match("/^(\\d){10}$/")) {
	// if (preg_match("/^(\\d){10}$/", A_line[0]) == false) {
		if (DEBUG_FLG) {
			logging("法人番号のフォーマットが違います " + A_line[0]);
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
	if (!A_line.match("/^(\\d){10}$/")) {
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
	if (!A_line[15].match("/^(\\+|\\-)$/")) {
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

	async function chkAsp(pactid: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + ScriptCommon.G_AUTH_ASP;
// 2022cvt_015
	var count = await dbh.getOne(sql_str);

	if (count == 0) {
		return false;
	} else {
		return true;
	}
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
	var A_riyou: { year: number, month: number } = { year: 0, month: 0 };
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
