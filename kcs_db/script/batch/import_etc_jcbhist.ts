import {G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogFile} from "./lib/script_log"
import TableNo, {ScriptDB} from "./lib/script_db"
import {ScriptLogAdaptor} from "./lib/script_log"
import {ScriptLogBase} from "./lib/script_log"
import {TableInserter} from "./lib/script_db"
import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define"

const Iconv  = require('iconv').Iconv;
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_etc_jcbhist.php";
const JCB_COID = 5;
const CON_TAX = 0.08;
const AFTER_ENCO = "UTF-8";
const BEFORE_ENCO = "SJIS";
const fs = require('fs');

var dbLogFile = DATA_LOG_DIR + "/card_billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.putListener(log_listener_typeView);
log_listener.putListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh:any = new ScriptLogAdaptor(log_listener, true);
var A_para = ["-e", "-y", "-p", "-b", "-t"];

if (process.argv.length != 6) //数が正しくない
	{
		usage(dbh);
	} else //数が正しい
	//$cnt 0 はスクリプト名のため無視
	//パラメータの指定が無かったものがあった時
	{
		var argvCnt = process.argv.length;

		for (var cnt = 2; cnt < argvCnt; cnt++) //mode を取得
		{
			if (process.argv[cnt].match("^-e=", ) != null) //モード指定変数
				//モード文字列チェック
				{
					var mode:any = process.argv[cnt].replace("^-e=", "").toLowerCase();

					if (mode.match("^[ao]$") == null) {
						usage("モードの指定が不正です。" + process.argv[cnt]);
					}

					delete A_para[0];
					continue;
				}

			if (process.argv[cnt].match("^-y=") != null) //年月指定変数
				//請求年月文字列チェック
				//指定済のパラメータを配列から削除
				{
					var billdate = process.argv[cnt].replace("^-y=", "");

					if (billdate.match("^[0-9]{6}$") == null) {
						usage("請求年月の指定が不正です。" + process.argv[cnt]);
					} else //表示用の月
						{
							var year: any = billdate.substr(0, 4);
							var month:any = billdate.substr(4, 2);
							var month_view = month;

							if (month < 10) {
								month_view = month.split("0");
							}

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("請求年月の指定が不正です。" + process.argv[cnt]);
							}

							var A_riyou = getRiyouYM(year, month);
						}

					delete A_para[1];
					continue;
				}

			if (process.argv[cnt].match("^-p=") != null) //会社ID指定変数
				//契約ＩＤチェック
				{
					var pactid: any = process.argv[cnt].replace("^-p=", "").toLowerCase();

					if (pactid.match("^all$") == null && pactid.match("^[0-9]+$") == null) {
						usage("会社コードの指定が不正です。" + process.argv[cnt]);
					}

					delete A_para[2];
					continue;
				}

			if (process.argv[cnt].match("^-b=") != null) //バックアップ指定変数
				//バックアップの有無のチェック
				{
					var backup:any = process.argv[cnt].replace("^-b=", "").toLowerCase();

					if (backup.match("^[ny]$") == null) {
						usage("バックアップの指定が不正です。" + process.argv[cnt]);
					}

					delete A_para[3];
					continue;
				}

			if (process.argv[cnt].match("^-t=") != null) {
				var target:any = process.argv[cnt].replace("^-t=", "").toLowerCase();

				if (target.match("^[no]$") == null) {
					usage("対象月の（最新/過去）の指定が不正です。" + process.argv[cnt]);
				}

				delete A_para[4];
				continue;
			}

			usage("パラメータの指定が不正です。" + process.argv[0]);
		}

		if (A_para.length != 0) {
			usage("パラメータの指定が不正です。" + process.argv[0]);
		}
	}

var JCB_DIR = DATA_DIR + "/" + year + month + "/ETC/JCB";

if (fs.existsSync(JCB_DIR) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人用ETCカード請求データ取込処理 JCB法人用ETCカード請求データディレクトリ（" + JCB_DIR + "）がみつかりません");
	throw process.exit(1);
}

// if (openDir(JCB_DIR) == false) {
// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人用ETCカード請求データ取込処理 JCB法人用ETCカード請求データディレクトリ（" + JCB_DIR + "）を開けません");
// 	throw process.exit(1);
// }

logh.putError(G_SCRIPT_BEGIN, SCRIPT_FILENAME + " JCB法人用ETCカード請求データ取込処理 処理を開始します");
var LocalLogFile = DATA_DIR + "/" + year + month + "/ETC/import_etc_jcb.log";
const fd = fs.openSync(LocalLogFile, "a");
if (fd == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人用ETCカード請求データ取込処理 ログファイル（" + LocalLogFile + "）を開けません");
	throw process.exit(1);
}

if (DEBUG_FLG) logging("START: JCB法人用ETCカード請求データ取込処理(" + SCRIPT_FILENAME + ")を開始します");

if (pactid == "all") {
	if (fs.existsSync(JCB_DIR) == false) {
		if (DEBUG_FLG) logging(SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "）はみつかりません");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "）がみつかりません");
		throw process.exit(1);
	} else {
		if (DEBUG_FLG) logging(SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "/以下）がみつかりません");
	}
} else {
	if (fs.existsSync(JCB_DIR + "/" + pactid) == false) {
		if (DEBUG_FLG) logging(SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "/" + pactid + "）はみつかりました");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "/以下）がみつかりません");
		throw process.exit(1);
	} else {
		if (DEBUG_FLG) logging(SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 JCB法人ETCカード請求データディレクトリ（" + JCB_DIR + "/" + pactid + "）はみつかりました");
	}
}

// clearstatcache();
var A_pactid = Array();

if (pactid == "all") ///kcs/data/yyyymm/ETC以下のディレクトリを開く
	//処理する契約ＩＤを取得する
	{
		var pactName;
		// var dirh = openDir(JCB_DIR);

		while (pactName = fs.readdir(JCB_DIR)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		{
			if (fs.existsSync(JCB_DIR + "/" + pactName) && pactName.match("/\\./") == false) {
				if (-1 !== A_pactid.indexOf(pactName) == false) {
					A_pactid.push(pactName);
				}

				if (DEBUG_FLG) logging("INFO: 対象ディレクトリ " + JCB_DIR + "/" + pactName);
			}

// 			clearstatcache();
		}

		// closedir(dirh);
	} else ///kcs/data/yyyymm/ETC以下のディレクトリを開く
	//処理する契約ＩＤを取得する
	{
		A_pactid.push(pactid);
		// dirh = openDir(JCB_DIR + "/" + pactid);

		while (pactName = fs.readdir(JCB_DIR + "/" + pactid)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		{
			if (fs.existsSync(JCB_DIR + "/" + pactid + "/" + pactName) && pactName != "." && pactName != "..") {
				if (DEBUG_FLG) logging("INFO: 対象ディレクトリ " + JCB_DIR);
			}

// 			clearstatcache();
		}

		// closedir(dirh);
	}

A_pactid.sort();

if (A_pactid.length == 0 || undefined !== A_pactid == false) //エラー終了
	{
		if (DEBUG_FLG) logging("ERROR: Pact用データディレクトリが１つもありません");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 Pact用データディレクトリが１つもありません");
		throw process.exit(1);
	}

if (lock(true, dbh) == false) {
	if (DEBUG_FLG) logging("ERROR: 既に起動しています");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理  既に起動しています");
	throw process.exit(1);
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var cardX_tb = "card_" + tableNo + "_tb";
var cardusehistoryX_tb = "card_usehistory_" + tableNo + "_tb";
if (DEBUG_FLG) logging("INFO: 対象テーブル " + cardX_tb + " & " + cardusehistoryX_tb);
var card_xx_filename = JCB_DIR + "/" + cardX_tb + year + month + pactid + ".ins";
var card_xx_fp = fs.openSync(card_xx_filename, "w");

if (card_xx_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + card_xx_filename + "のオープン失敗");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + card_xx_filename + "のオープン失敗");
	throw process.exit(1);
}

if (DEBUG_FLG) logging("INFO: card_XX_tbへのcopy文ファイルOPEN " + card_xx_filename);

if (target == "n") {
	var card_filename: any = JCB_DIR + "/card_tb" + year + month + pactid + ".ins";
	var card_fp = fs.openSync(card_filename, "w");

	if (card_fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + card_fp + "のオープン失敗");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + card_fp + "のオープン失敗");
		throw process.exit(1);
	}

	if (DEBUG_FLG) logging("INFO: card_tbへのcopy文ファイルOPEN " + card_filename);
}

var cardusehistory_filename = JCB_DIR + "/" + cardusehistoryX_tb + year + month + pactid + ".ins";
var cardusehistory_fp = fs.openSync(cardusehistory_filename, "w");

if (cardusehistory_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + cardusehistory_filename + "のオープン失敗");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + cardusehistory_filename + "のオープン失敗");
	throw process.exit(1);
}

if (DEBUG_FLG) logging("INFO: card_usehistory_XX_tbへのcopy文ファイルOPEN " + cardusehistory_filename);
var fin_cnt = 0;
var nowtime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
var A_del_sql = Array();

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
	var out_rec_cnt = 0;
	var error_flg = false;
	var write_buf = "";
	var card_xx_write_buf = "";
	var usehistory_xx_write_buf = "";
	var PACT_result:any = dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) logging("WARNING:  対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: 対象会社の会社名を取得 " + PACT_result);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "のデータの処理を開始します");
	logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 処理を開始します");
	var A_billFile = Array();
	var dataDirPact = JCB_DIR + "/" + A_pactid[cnt];

	if (fs.existsSync(dataDirPact) == true) {
		var fileName;
		// dirh = openDir(dataDirPact);

		while (fileName = fs.readdir(dataDirPact)) {
		const stat = fs.statSync(dataDirPact);
			if (stat.isDirectory()(dataDirPact + "/" + fileName) == true && fileName.match("/\\.txt/") == true) {
				A_billFile.push(dataDirPact + "/" + fileName);
				if (DEBUG_FLG) logging("INFO: 対象請求データファイル名 " + dataDirPact + "/" + fileName);
			}

// 			clearstatcache();
		}

		// closedir(dirh);
	}

	if (A_billFile.length == 0) {
		if (DEBUG_FLG) logging("WARNING: 対象ファイルがみつかりません（" + dataDirPact + "/以下）");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + dataDirPact + "/以下 対象ファイルがみつかりません（" + dataDirPact + "）");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: 対象請求データファイル数 " + A_billFile.length);
	var CARD_result:any = dbh.getCol("select cardno from " + cardX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (Array.isArray(CARD_result) == false) {
		CARD_result = Array();
	}

	if (DEBUG_FLG) logging("INFO: 対象会社の登録ETCカードのリストを取得 " + CARD_result.length + "件 select cardno from " + cardX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");

	if (target == "n") {
		var CARD_now_result:any = dbh.getCol("select cardno from card_tb where delete_flg = false and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

		if (Array.isArray(CARD_now_result) == false) {
			CARD_now_result = Array();
		}

		if (DEBUG_FLG) logging("INFO: 最新の登録ETCカードのリストを取得 " + CARD_now_result.length + "件 select cardno from card_tb where delete_flg = false and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		var CARD_now_delete_result: any = dbh.getCol("select cardno from card_tb where delete_flg = true and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

		if (Array.isArray(CARD_now_delete_result) == false) {
			CARD_now_delete_result = Array();
		}

		if (DEBUG_FLG) logging("INFO: 最新の登録ETCカードのリストを取得（削除済み） " + CARD_now_delete_result.length + "件 select cardno from card_tb where delete_flg=true and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		var card_write_buf:any = "";
	}

	var trg_post: any = dbh.getOne("select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;", true);

	if (trg_post == "") {
		if (DEBUG_FLG) logging("WARNING: ルート部署が正しく登録されていません" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " au請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ルート部署が正しく登録されていません");
		continue;
	}

	var A_prcardno:any = dbh.getCol("select card_master_no from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid in (" + JCB_COID + ");", true);

	if (A_prcardno.length == 0) {
		if (DEBUG_FLG) logging("WARNING: 請求先コード（法人番号）が１つも登録されていません" + "select card_master_no from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid = " + JCB_COID + ";");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " au請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 請求先コード（法人番号）が１つも登録されていません");
		continue;
	}

	for (var fcnt = 0; fcnt < A_billFile.length; fcnt++) //------------------------------------
	//レコード毎の処理（１行毎）
	//------------------------------------
	//対象ファイルオープン
	//ファイルが開けなかった時
	//ファイル１行ずつ処理するwhile閉じ
	{
		var ifp = fs.openSync(A_billFile[fcnt], "r");

		if (ifp == undefined) {
			if (DEBUG_FLG) logging("WARNING: ファイルのOPENに失敗しました" + A_billFile[fcnt]);
			logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ファイルのOPENに失敗しました " + A_billFile[fcnt]);
			error_flg = true;
			break;
		}

		if (DEBUG_FLG) logging("INFO: 対象ファイル=" + A_billFile[fcnt]);
		var line;
		while (line = fs.createReadStream(ifp)) //-----------------------------------------------
		//ファイルのエンコーディングを変更（バッファ上）
		//-----------------------------------------------
		//タブで区切って配列に
		//利用日付
		//利用時間
		//利用明細
		//---------------------------------------------
		//card_XX_tbに各行のcardnoがあるか？存在チェック
		//---------------------------------------------
		{
			const iconv = new Iconv(AFTER_ENCO, BEFORE_ENCO);
			const after = iconv.convert(line);
			var A_line = line.split("\t");

			if (A_line[0].match("/^(\\d){0,}$/") == false) {
				if (DEBUG_FLG) logging("INFO:１行目は飛ばす");
				continue;
			}

			if (checkFormat(A_line) == false) {
				if (DEBUG_FLG) logging("WARNING: フォーマットが異なります " + A_billFile[fcnt]);
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_billFile[fcnt] + " データファイルのフォーマットが異なります。処理を中断します。１件も取込ませんでした。 " + A_billFile[fcnt]);
				error_flg = true;
				break;
			}

			if (-1 !== A_prcardno.indexOf(A_line[0]) == false) {
				if (DEBUG_FLG) logging("WARNING: ファイルに記載されているお客様番号(" + A_line[0] + ")と登録されたお客様番号(" + A_prcardno.join(",") + ")が異なります " + A_billFile[fcnt] + "(" + A_line[1] + "の行)");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_billFile[fcnt] + " ファイルに記載されているお客様番号(" + A_line[0] + ")と登録されたお客様番号(" + A_prcardno.join(",") + ")が異なります。処理を中断します。１件も取込ませんでした。 " + A_billFile[fcnt] + "(" + A_line[1] + "の行)");
				error_flg = true;
				break;
			}

			trg_post = dbh.getOne("select postid from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and card_master_no = '" + A_line[0] + "';", true);

			if (trg_post == "") {
				if (DEBUG_FLG) logging("WARNING: ルート部署が正しく登録されていません" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 未登録カードの登録先部署が取得できません");
				error_flg = true;
				break;
			}

			var copy_buf = "";
			var usedate = "\"" + A_line[8].substr(0, 4) + "-" + A_line[8].substr(4, 2) + "-" + A_line[8].substr(6, 2) + "\"";
			var usetime = A_line[9].substr(0, 2) + ":" + A_line[9].substr(2, 2);
			write_buf += A_pactid[cnt] + "\t" + A_line[4] + "\t" + A_line[0] + "\t" + A_line[10] + "\t" + A_line[18] + "\t" + A_line[11] + "\t" + A_line[19] + "\t" + A_line[13] + "\t" + usedate + "\t" + usetime + "\t" + A_line[16].replace(/(,|")/g, "") + "\t" + A_line[17] + "\t" + A_line[6] + "\t" + A_line[15] + "\t" + JCB_COID + "\n";

			if (-1 !== CARD_result.indexOf(A_line[4]) == false && card_xx_write_buf.match("/" + A_line[4] + "/") == null) //card_xx_tbへのコピー文のバッファ
				{
					copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + A_line[4] + "\t" + A_line[4] + "\t" + A_line[3] + "\t" + A_line[3] + "\t" + A_line[0] + "\t" + A_line[1] + "\t" + A_line[5] + "\t" + A_line[2] + "\t" + A_line[7] + "\t" + JCB_COID + "\t" + nowtime + "\t" + nowtime + "\tfalse\n";
					card_xx_write_buf += copy_buf;
				}

			if (target == "n") //card_tbにデータが無いときはコピー文作成
				{
					if (-1 !== CARD_now_result.indexOf(A_line[4]) == false && card_write_buf.match("/" + A_line[4] + "/") == null) {
						copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + A_line[4] + "\t" + A_line[4] + "\t" + A_line[3] + "\t" + A_line[3] + "\t" + A_line[0] + "\t" + A_line[1] + "\t" + A_line[5] + "\t" + A_line[2] + "\t" + A_line[7] + "\t" + JCB_COID + "\t" + nowtime + "\t" + nowtime + "\tfalse\n";
						card_write_buf += copy_buf;
					}

					if (-1 !== CARD_now_delete_result.indexOf(A_line[4]) == true) {
						var del_sql = "delete from card_tb where cardno='" + A_line[4] + "' and pactid=" + A_pactid[cnt] + " and delete_flg=true";

						if (-1 !== A_del_sql.indexOf(del_sql) == false) {
							A_del_sql.push(del_sql);
						}
					}
				}
		}
	}

	if (ifp != undefined) {
		fs.closeSync(ifp);
	}

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
	var fin_pact:any;
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "件のデータの処理を行いました");
	logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "件の処理を行いました");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fs.closeSync(card_xx_fp);

if (target == "n") {
	fs.closeSync(card_fp);
}

fs.closeSync(cardusehistory_fp);

if (fin_cnt < 1) //２重起動ロック解除
	{
		lock(false, dbh);
		if (DEBUG_FLG) logging("ERROR: １件も成功しませんでした");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 １件も成功しませんでした");
		throw process.exit(1);
	}

if (backup == "y") //CARD_usehistory_X_TBのバックアップ
	//エクスポート失敗した場合
	{
		var cardusehistoryX_exp = DATA_EXP_DIR + "/" + cardusehistoryX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join(""); + ".exp";
		var sql_str = "select * from " + cardusehistoryX_tb;
		var rtn:any = dbh.backup(cardusehistoryX_exp, sql_str);

		if (rtn == false) {
			if (DEBUG_FLG) logging("ERROR: " + cardusehistoryX_tb + "のデータエクスポートに失敗しました " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理" + cardusehistoryX_tb + "のデータエクスポートに失敗しました" + cardusehistoryX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + cardusehistoryX_tb + "のデータエクスポートを行いました " + cardusehistoryX_exp);
		}
	}

dbh.begin();

if (mode == "o") //対象pactidを１つの文字列に変換
	//CARD_usehistory_XX_TBの削除
	{
		var pactin = "";

		for (cnt = 0; cnt < fin_cnt; cnt++) {
			pactin += fin_pact[cnt] + ",";
		}

		pactin = pactin.replace(",","");
		dbh.query("delete from " + cardusehistoryX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + JCB_COID + ");", true);
		if (DEBUG_FLG) logging("INFO: " + cardusehistoryX_tb + "の既存データの削除を行いました " + "delete from " + cardusehistoryX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + JCB_COID + ");");
		logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + cardusehistoryX_tb + "の既存データの削除を行いました" + cardusehistoryX_tb);
	}
var stat = fs.statSync(card_xx_filename);
if (stat.size != 0) //card_X_tb へインポート
	//インポート失敗した場合
	{
		var cardX_col = ["pactid", "postid", "cardno", "cardno_view", "bill_cardno", "bill_cardno_view", "card_corpno", "card_corpname", "card_meigi", "card_membername", "car_no", "cardcoid", "recdate", "fixdate", "delete_flg"];
		rtn = doCopyInsert(cardX_tb, card_xx_filename, cardX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + cardX_tb + "のデータインポートに失敗しました" + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + cardX_tb + "のデータインポートに失敗しました" + rtn.userinfo);
				dbh.rollback();
				throw process.exit(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + cardX_tb + "のデータインポートを行いました " + card_xx_filename);
			logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + cardX_tb + "のデータインポートを行いました " + card_xx_filename);
		}
	}

if (target == "n") {
	var stat = fs.statSync(card_filename);
	if (stat.size != 0) //削除フラグが立っている電話でコピー文に含まれる電話はcard_tbから消す
		//card_tb へインポート
		//インポート失敗した場合
		{
			for (var sql of A_del_sql) {
				dbh.query(sql, true);
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 card_tbの削除済カードの削除を行いました(" + sql + ")");
				if (DEBUG_FLG) logging("INFO: JCB法人ETCカード請求データ取込処理 card_tbの削除済カードの削除を行いました(" + sql + ")");
			}

			var card_col = ["pactid", "postid", "cardno", "cardno_view", "bill_cardno", "bill_cardno_view", "card_corpno", "card_corpname", "card_meigi", "card_membername", "car_no", "cardcoid", "recdate", "fixdate", "delete_flg"];
			rtn = doCopyInsert("card_tb", card_filename, card_col, dbh);

			if (rtn != 0) //ロールバック
				{
					if (DEBUG_FLG) logging("ERROR: card_tbのデータインポートに失敗しました " + rtn.userinfo);
					logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 card_tbのデータインポートに失敗しました " + rtn.userinfo);
					dbh.rollback();
					throw process.exit(1);
				} else {
				if (DEBUG_FLG) logging("INFO: card_tbのデータインポートを行いました " + card_filename);
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 card_tbのデータインポートを行いました " + card_filename);
			}
		}
}
var stat = fs.statSync(cardusehistory_filename);
if (stat.size != 0) //card_usehistory_X_tb へインポート
	//インポート失敗した場合
	{
		var cardusehistoryX_col = ["pactid", "cardno", "card_corpno", "route_name", "in_id", "in_name", "out_id", "out_name", "date", "time", "charge", "discount1", "note", "car_type", "cardcoid"];
		rtn = doCopyInsert(cardusehistoryX_tb, cardusehistory_filename, cardusehistoryX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + cardusehistoryX_tb + "のデータインポートに失敗しました " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + cardusehistoryX_tb + "のデータインポートに失敗しました " + rtn.userinfo);
				dbh.rollback();
				throw process.exit(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + cardusehistoryX_tb + "のデータインポートを行いました " + cardusehistory_filename);
			logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 " + cardusehistoryX_tb + "のデータインポートを行いました " + cardusehistory_filename);
		}
	}

dbh.commit();

for (cnt = 0; cnt < fin_cnt; cnt++) //データディレクトリがある時
{
	var dataDir = JCB_DIR + "/" + fin_pact[cnt];

	if (fs.existsSync(dataDir) == true) //ファイルの移動
		{
			var finDir = dataDir + "/fin";

			if (fs.existsSync(finDir) == false) //完了ディレクトリの作成
				{
					if (fs.mkdirSync(finDir, 700) == false) {
						if (DEBUG_FLG) logging("ERROR: 完了ディレクトリの作成に失敗しました " + finDir);
						logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理  完了ディレクトリの作成に失敗しました " + finDir);
						throw process.exit(1);
					} else {
						if (DEBUG_FLG) logging("INFO: 完了ディレクトリの作成しました " + finDir);
						logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理  完了ディレクトリの作成しました " + finDir);
					}
				}

// 			clearstatcache();
			// dirh = openDir(dataDir);
			var copyfileName:string;
			while (copyfileName = fs.readdir(dataDir)) {
				const stat = fs.statSync(dataDir);
				if (stat.isDirectory()(JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName) == true && copyfileName.match("/\\.txt$/i") != null) {
					if (fs.renameSync(JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName) == false) {
						if (DEBUG_FLG) logging("ERROR: ファイルの移動に失敗しました " + JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
						logh.putError(G_SCRIPT_ERROR, "import_etc_coprhist.php JCB法人ETCカード請求データ取込処理  ファイルの移動に失敗しました  " + JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
						throw process.exit(1);
					} else {
						if (DEBUG_FLG) logging("INFO: ファイルの移動をしました " + JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
						logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理  ファイルの移動をしました " + JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
					}

// 					clearstatcache();
				}
			}

			// closedir(dirh);
		}
}

lock(false, dbh);
console.log("JCB法人ETCカード請求データ取込処理(" + SCRIPT_FILENAME + ")を終了しました。\n");
if (DEBUG_FLG) logging("END: JCB法人ETCカード請求データ取込処理(" + SCRIPT_FILENAME + ")を終了しました");
logh.putError(G_SCRIPT_END, SCRIPT_FILENAME + " JCB法人ETCカード請求データ取込処理 処理を終了しました");
throw process.exit(0);

function checkFormat(A_line) //1,法人番号
{
	var errcnt = 0;

	if (A_line[0].match("/^(\\d){0,}$/") == false) {
		if (DEBUG_FLG) logging("法人番号のフォーマットが違います " + A_line[0] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (A_line[3].match("/^(\\d){0,}$/") == false) {
		if (DEBUG_FLG) logging("JCB会員番号のフォーマットが違います " + A_line[3] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (A_line[4].match("/^(\\d){0,}$/") == false) {
		if (DEBUG_FLG) logging("ETCカード番号のフォーマットが違います " + A_line[4] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (A_line[8].match("/^(\\d){0,8}$/") == false) {
		if (DEBUG_FLG) logging("利用日付のフォーマットが違います " + A_line[8] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (A_line[9].match("/^(\\d){0,}$/") == false) {
		if (DEBUG_FLG) logging("時間のフォーマットが違います " + A_line[9] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (A_line[18].match("/^(\\d){0,}$/") == false) {
		if (DEBUG_FLG) logging("入り口ICコードのフォーマットが違います " + A_line[18] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (A_line[19].match("/^(\\d){0,}$/") == false) {
		if (DEBUG_FLG) logging("出口ICコードのフォーマットが違います " + A_line[19] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (errcnt != 0) {
		return false;
	} else {
		return true;
	}
};

function checkInfoFormat(A_line) //1,お客様番号
{
	var errcnt = 0;

	if (A_line[0].match("/^(\\d){10}$/") == false) {
		if (DEBUG_FLG) logging("お客様番号のフォーマットが違います " + A_line[0]);
		errcnt++;
	}

	if (A_line[1].match("/^(\\d){5}$/") == false) {
		if (DEBUG_FLG) logging("組合員番号のフォーマットが違います " + A_line[1]);
		errcnt++;
	}

	if (A_line[2].match("/^(\\d){6}$/") == false) {
		if (DEBUG_FLG) logging("請求年月のフォーマットが違います " + A_line[2]);
		errcnt++;
	}

	if (A_line[3].match("/^(\\d){14}$/") == false) {
		if (DEBUG_FLG) logging("カード単位管理番号のフォーマットが違います " + A_line[3]);
		errcnt++;
	}

	if (A_line[4].match("/^(\\d){10}$/") == false) {
		if (DEBUG_FLG) logging("通行料金のフォーマットが違います " + A_line[4]);
		errcnt++;
	}

	if (A_line[5].match("/^(\\d){10}$/") == false) {
		if (DEBUG_FLG) logging("路線バス割引対象額のフォーマットが違います " + A_line[5]);
		errcnt++;
	}

	if (A_line[7].match("/^(\\d){10}$/") == false) {
		if (DEBUG_FLG) logging("路線バス割引額のフォーマットが違います " + A_line[7]);
		errcnt++;
	}

	if (A_line[9].match("/^(\\d){10}$/") == false) {
		if (DEBUG_FLG) logging("車両単位割引対象額（高速道路）のフォーマットが違います " + A_line[9]);
		errcnt++;
	}

	if (A_line[10].match("/^(\\d){10}$/") == false) {
		if (DEBUG_FLG) logging("車両単位割引対象額（一般有料道路）のフォーマットが違います " + A_line[10]);
		errcnt++;
	}

	if (A_line[11].match("/^(\\d){10}$/") == false) {
		if (DEBUG_FLG) logging("車両単位割引額（高速道路）のフォーマットが違います " + A_line[11]);
		errcnt++;
	}

	if (A_line[12].match("/^(\\d){10}$/") == false) {
		if (DEBUG_FLG) logging("車両単位割引額（一般有料道路）のフォーマットが違います " + A_line[12]);
		errcnt++;
	}

	if (A_line[13].match("/^(\\+|\\-)$/") == false) {
		if (DEBUG_FLG) logging("調整符号のフォーマットが違います " + A_line[13]);
		errcnt++;
	}

	if (A_line[14].match("/^(\\d){10}$/") == false) {
		if (DEBUG_FLG) logging("調整金額のフォーマットが違います " + A_line[14]);
		errcnt++;
	}

	if (A_line[15].match("/^(\\+|\\-)$/") == false) {
		if (DEBUG_FLG) logging("調整符号のフォーマットが違います " + A_line[15]);
		errcnt++;
	}

	if (A_line[16].match("/^(\\d){10}$/") == false) {
		if (DEBUG_FLG) logging("請求金額のフォーマットが違います " + A_line[16]);
		errcnt++;
	}

	if (A_line[17].match("/^(\\d){15}$/") == false) {
		if (DEBUG_FLG) logging("集計対象カード番号１のフォーマットが違います " + A_line[17]);
		errcnt++;
	}

	if (A_line[18].match("/^(\\d){15}$/") == false) {
		if (DEBUG_FLG) logging("集計対象カード番号２のフォーマットが違います " + A_line[18]);
		errcnt++;
	}

	if (A_line[19].match("/^(\\d){15}$/") == false) {
		if (DEBUG_FLG) logging("集計対象カード番号３のフォーマットが違います " + A_line[19]);
		errcnt++;
	}

	if (errcnt != 0) {
		return false;
	} else {
		return true;
	}
};

function doCopyInsert(table, filename, columns, db) //ファイルを開く
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	if (!("logh" in global)) logh = undefined;
	var fp = fs.openSync(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_ERROR, filename + "のファイルオープン失敗.");
		return 1;
	}

	var ins:any = new TableInserter(logh, db, filename + ".sql", true);
	ins.begin(table);

	while (line = fs.createReadStream(fp)) //tabで区切り配列に
	//要素数チェック
	//カラム名をキーにした配列を作る
	//インサート行の追加
	{
		var A_line = line.replace("\n", "").split("\t").join(""); 

		if (A_line.length != columns.length) {
			logh.putError(G_SCRIPT_ERROR, filename + "のデータ数が設定と異なります。データ=" + line);
			fs.closeSync(fp);
			return 1;
		}

		var H_ins = Array();
		var idx = 0;

		for (var col of columns) {
			H_ins[col] = A_line[idx];
			idx++;
		}

		if (ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_ERROR, filename + "のインサート中にエラー発生、データ=" + line);
			fs.closeSync(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_ERROR, filename + "のインサート処理に失敗.");
		fs.closeSync(fp);
		return 1;
	}

	fs.closeSync(fp);
	return 0;
};

function usage(comment) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} -t={N|O}\n");
	console.log("\t\t-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("\t\t-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("\t\t-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("\t\t-b バックパップ	 (Y:バックアップする,N:バックアップしない)\n");
	console.log("\t\t-t 対象月が最新/過去	(N:最新,O:過去) \n\n");
	throw process.exit(1);
};

function lock(is_lock, db) //ロックする
{
	if (db == undefined) {
		return false;
	}

	var pre = db.escape("batch_" + SCRIPT_FILENAME);

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		{
			db.begin();
			db.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command = '" + pre + "' and " + "status = 1;";
			var count = db.getOne(sql);

			if (count != 0) {
				db.rollback();
				db.putError(G_SCRIPT_WARNING, "多重動作");
				return false;
			}

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

async function logging(lstr) {
	var log_buf = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/,'/').replace(/-/,'/')  + " : " + lstr + "\n";
	var lfp = fs.openSync(global.LocalLogFile, "a");
	const lockfile = require('proper-lockfile');
	await lockfile.lock(lfp);
	fs.writeFileSync(lfp, log_buf);
	lockfile.unlockSync(lfp);
	fs.closeSync(lfp);
	return;
};

function getTimestamp() {
	var tm_time = new Date().toISOString().replace('T',' ');
		var tm = tm_time.substring(0, tm_time.length - 5) + ' +09';
		return tm;
};

function getRiyouYM(year, month) //１月請求の時は１２月、年も－１
{
	var A_riyoy = Array();
	var riyou_year = year;
	var riyou_month = month - 1;

	if (month == 1) {
		riyou_month = 12;
		riyou_year = year - 1;
	}

	A_riyou.year = riyou_year;
	A_riyou.month = riyou_month;
	return A_riyou;
};
