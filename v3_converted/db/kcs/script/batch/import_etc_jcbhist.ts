#!/usr/local/bin/php
//JCBのcoid
//消費税
//ファイルの変更後のエンコード
//ファイルのオリジナルエンコード
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//
//  パラメータチェック
//
//ETCデータディレクトリ
//ETCデータディレクトリが存在しない
//ローカルログファイル名
//ログファイルを開けない
//処理する契約ＩＤ配列
//契約ＩＤの指定が全て（all）の時
//ソート
//対象ユーザーのディレクトリチェック
//テーブル名設定
//ファイルオープン失敗
//card_tbへのdelete文を入れる配列
//COPY文ファイルCLOSE
//一件も成功していない場合は、ここで終了
//上書きモードの場合、対象年月・対象契約IDのデータを削除
//完了したファイルをFINディレクトリに移動
//２重起動ロック解除
//終了
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//フォーマットが正しいかチェックする（MEISAIファイル）
//[引　数] ファイル内の1行を分割した配列
//[返り値] フォーマットが正しければtrue正しくなければfalse
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//フォーマットが正しいかチェックする（INFOファイル）
//[引　数] ファイル内の1行を分割した配列
//[返り値] フォーマットが正しければtrue正しくなければfalse
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//clamptasl_tb にレコードを追加し２重起動を防止する
//[引　数] $is_lock： true：ロックする、false：ロック解除
//&$db： DBハンドル
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ローカルのログを出力する
//[引　数] $lstr：出力する文字列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//請求月から利用月を返す
//ファイルとオプションのマッチングに使用する
echo("\n");
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_etc_jcbhist.php";
const JCB_COID = 5;
const CON_TAX = 0.08;
const AFTER_ENCO = "UTF-8";
const BEFORE_ENCO = "SJIS";
var dbLogFile = DATA_LOG_DIR + "/card_billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_typeView);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var A_para = ["-e", "-y", "-p", "-b", "-t"];

if (_SERVER.argv.length != 6) //数が正しくない
	{
		usage("", dbh);
	} else //数が正しい
	//$cnt 0 はスクリプト名のため無視
	//パラメータの指定が無かったものがあった時
	{
		var argvCnt = _SERVER.argv.length;

		for (var cnt = 1; cnt < argvCnt; cnt++) //mode を取得
		{
			if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード指定変数
				//モード文字列チェック
				{
					var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

					if (ereg("^[ao]$", mode) == false) {
						usage("\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					}

					delete A_para[0];
					continue;
				}

			if (ereg("^-y=", _SERVER.argv[cnt]) == true) //年月指定変数
				//請求年月文字列チェック
				//指定済のパラメータを配列から削除
				{
					var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

					if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					} else //表示用の月
						{
							var year = billdate.substr(0, 4);
							var month = billdate.substr(4, 2);
							var month_view = month;

							if (month < 10) {
								month_view = trim(month, "0");
							}

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							}

							var A_riyou = getRiyouYM(year, month);
						}

					delete A_para[1];
					continue;
				}

			if (ereg("^-p=", _SERVER.argv[cnt]) == true) //会社ID指定変数
				//契約ＩＤチェック
				{
					var pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

					if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("\u4F1A\u793E\u30B3\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					}

					delete A_para[2];
					continue;
				}

			if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップ指定変数
				//バックアップの有無のチェック
				{
					var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

					if (ereg("^[ny]$", backup) == false) {
						usage("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					}

					delete A_para[3];
					continue;
				}

			if (ereg("^-t=", _SERVER.argv[cnt]) == true) {
				var target = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

				if (ereg("^[no]$", target) == false) {
					usage("\u5BFE\u8C61\u6708\u306E\uFF08\u6700\u65B0/\u904E\u53BB\uFF09\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
				}

				delete A_para[4];
				continue;
			}

			usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[0]);
		}

		if (A_para.length != 0) {
			usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[0]);
		}
	}

var JCB_DIR = DATA_DIR + "/" + year + month + "/ETC/JCB";

if (is_dir(JCB_DIR) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBA\u7528ETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 JCB\u6CD5\u4EBA\u7528ETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + JCB_DIR + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
	throw die(1);
}

if (opendir(JCB_DIR) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBA\u7528ETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 JCB\u6CD5\u4EBA\u7528ETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + JCB_DIR + "\uFF09\u3092\u958B\u3051\u307E\u305B\u3093");
	throw die(1);
}

logh.putError(G_SCRIPT_BEGIN, SCRIPT_FILENAME + " JCB\u6CD5\u4EBA\u7528ETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
var LocalLogFile = DATA_DIR + "/" + year + month + "/ETC/import_etc_jcb.log";

if (fopen(LocalLogFile, "a") == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBA\u7528ETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u30ED\u30B0\u30D5\u30A1\u30A4\u30EB\uFF08" + LocalLogFile + "\uFF09\u3092\u958B\u3051\u307E\u305B\u3093");
	throw die(1);
}

if (DEBUG_FLG) logging("START: JCB\u6CD5\u4EBA\u7528ETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(" + SCRIPT_FILENAME + ")\u3092\u958B\u59CB\u3057\u307E\u3059");

if (pactid == "all") {
	if (is_dir(JCB_DIR) == false) {
		if (DEBUG_FLG) logging(SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + JCB_DIR + "\uFF09\u306F\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + JCB_DIR + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
		throw die(1);
	} else {
		if (DEBUG_FLG) logging(SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + JCB_DIR + "\uFF09\u306F\u307F\u3064\u304B\u308A\u307E\u3057\u305F");
	}
} else {
	if (is_dir(JCB_DIR + "/" + pactid) == false) {
		if (DEBUG_FLG) logging(SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + JCB_DIR + "/" + pactid + "\uFF09\u306F\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + JCB_DIR + "/\u4EE5\u4E0B\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
		throw die(1);
	} else {
		if (DEBUG_FLG) logging(SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + JCB_DIR + "/" + pactid + "\uFF09\u306F\u307F\u3064\u304B\u308A\u307E\u3057\u305F");
	}
}

clearstatcache();
var A_pactid = Array();

if (pactid == "all") ///kcs/data/yyyymm/ETC以下のディレクトリを開く
	//処理する契約ＩＤを取得する
	{
		var pactName;
		var dirh = opendir(JCB_DIR);

		while (pactName = readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		{
			if (is_dir(JCB_DIR + "/" + pactName) && preg_match("/\\./", pactName) == false) {
				if (-1 !== A_pactid.indexOf(pactName) == false) {
					A_pactid.push(pactName);
				}

				if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA " + JCB_DIR + "/" + pactName);
			}

			clearstatcache();
		}

		closedir(dirh);
	} else ///kcs/data/yyyymm/ETC以下のディレクトリを開く
	//処理する契約ＩＤを取得する
	{
		A_pactid.push(pactid);
		dirh = opendir(JCB_DIR + "/" + pactid);

		while (pactName = readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		{
			if (is_dir(JCB_DIR + "/" + pactid + "/" + pactName) && pactName != "." && pactName != "..") {
				if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA " + JCB_DIR);
			}

			clearstatcache();
		}

		closedir(dirh);
	}

A_pactid.sort();

if (A_pactid.length == 0 || undefined !== A_pactid == false) //エラー終了
	{
		if (DEBUG_FLG) logging("ERROR: Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093");
		throw die(1);
	}

if (lock(true, dbh) == false) {
	if (DEBUG_FLG) logging("ERROR: \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	throw die(1);
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var cardX_tb = "card_" + tableNo + "_tb";
var cardusehistoryX_tb = "card_usehistory_" + tableNo + "_tb";
if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C6\u30FC\u30D6\u30EB " + cardX_tb + " & " + cardusehistoryX_tb);
var card_xx_filename = JCB_DIR + "/" + cardX_tb + year + month + pactid + ".ins";
var card_xx_fp = fopen(card_xx_filename, "w");

if (card_xx_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + card_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + card_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: card_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + card_xx_filename);

if (target == "n") {
	var card_filename = JCB_DIR + "/card_tb" + year + month + pactid + ".ins";
	var card_fp = fopen(card_filename, "w");

	if (card_fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + card_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + card_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		throw die(1);
	}

	if (DEBUG_FLG) logging("INFO: card_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + card_filename);
}

var cardusehistory_filename = JCB_DIR + "/" + cardusehistoryX_tb + year + month + pactid + ".ins";
var cardusehistory_fp = fopen(cardusehistory_filename, "w");

if (cardusehistory_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + cardusehistory_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + cardusehistory_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: card_usehistory_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + cardusehistory_filename);
var fin_cnt = 0;
var nowtime = date("Y-m-d H:i:s");
var A_del_sql = Array();

for (cnt = 0;; cnt < A_pactid.length; cnt++) //取り込むデータ数をカウントするための変数
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
	var PACT_result = dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) logging("WARNING:  \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u4F1A\u793E\u540D\u3092\u53D6\u5F97 " + PACT_result);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	var A_billFile = Array();
	var dataDirPact = JCB_DIR + "/" + A_pactid[cnt];

	if (is_dir(dataDirPact) == true) {
		var fileName;
		dirh = opendir(dataDirPact);

		while (fileName = readdir(dirh)) {
			if (is_file(dataDirPact + "/" + fileName) == true && preg_match("/\\.txt/", fileName) == true) {
				A_billFile.push(dataDirPact + "/" + fileName);
				if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u540D " + dataDirPact + "/" + fileName);
			}

			clearstatcache();
		}

		closedir(dirh);
	}

	if (A_billFile.length == 0) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\uFF08" + dataDirPact + "/\u4EE5\u4E0B\uFF09");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + dataDirPact + "/\u4EE5\u4E0B \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\uFF08" + dataDirPact + "\uFF09");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u6570 " + A_billFile.length);
	var CARD_result = dbh.getCol("select cardno from " + cardX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (Array.isArray(CARD_result) == false) {
		CARD_result = Array();
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u767B\u9332ETC\u30AB\u30FC\u30C9\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + CARD_result.length + "\u4EF6 select cardno from " + cardX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");

	if (target == "n") {
		var CARD_now_result = dbh.getCol("select cardno from card_tb where delete_flg = false and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

		if (Array.isArray(CARD_now_result) == false) {
			CARD_now_result = Array();
		}

		if (DEBUG_FLG) logging("INFO: \u6700\u65B0\u306E\u767B\u9332ETC\u30AB\u30FC\u30C9\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + CARD_now_result.length + "\u4EF6 select cardno from card_tb where delete_flg = false and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		var CARD_now_delete_result = dbh.getCol("select cardno from card_tb where delete_flg = true and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

		if (Array.isArray(CARD_now_delete_result) == false) {
			CARD_now_delete_result = Array();
		}

		if (DEBUG_FLG) logging("INFO: \u6700\u65B0\u306E\u767B\u9332ETC\u30AB\u30FC\u30C9\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97\uFF08\u524A\u9664\u6E08\u307F\uFF09 " + CARD_now_delete_result.length + "\u4EF6 select cardno from card_tb where delete_flg=true and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		var card_write_buf = "";
	}

	var trg_post = dbh.getOne("select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;", true);

	if (trg_post == "") {
		if (DEBUG_FLG) logging("WARNING: \u30EB\u30FC\u30C8\u90E8\u7F72\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u30EB\u30FC\u30C8\u90E8\u7F72\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	var A_prcardno = dbh.getCol("select card_master_no from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid in (" + JCB_COID + ");", true);

	if (A_prcardno.length == 0) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9\uFF08\u6CD5\u4EBA\u756A\u53F7\uFF09\u304C\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + "select card_master_no from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid = " + JCB_COID + ";");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9\uFF08\u6CD5\u4EBA\u756A\u53F7\uFF09\u304C\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	for (var fcnt = 0; fcnt < A_billFile.length; fcnt++) //------------------------------------
	//レコード毎の処理（１行毎）
	//------------------------------------
	//対象ファイルオープン
	//ファイルが開けなかった時
	//ファイル１行ずつ処理するwhile閉じ
	{
		var ifp = fopen(A_billFile[fcnt], "r");

		if (ifp == undefined) {
			if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + A_billFile[fcnt]);
			logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + A_billFile[fcnt]);
			error_flg = true;
			break;
		}

		if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + A_billFile[fcnt]);

		while (line = fgets(ifp)) //-----------------------------------------------
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
			line = mb_convert_encoding(line, AFTER_ENCO, BEFORE_ENCO);
			var A_line = split("\t", line);

			if (preg_match("/^(\\d){0,}$/", A_line[0]) == false) {
				if (DEBUG_FLG) logging("INFO:\uFF11\u884C\u76EE\u306F\u98DB\u3070\u3059");
				continue;
			}

			if (checkFormat(A_line) == false) {
				if (DEBUG_FLG) logging("WARNING: \u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u7570\u306A\u308A\u307E\u3059 " + A_billFile[fcnt]);
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_billFile[fcnt] + " \u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u7570\u306A\u308A\u307E\u3059\u3002\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002 " + A_billFile[fcnt]);
				error_flg = true;
				break;
			}

			if (-1 !== A_prcardno.indexOf(A_line[0]) == false) {
				if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306B\u8A18\u8F09\u3055\u308C\u3066\u3044\u308B\u304A\u5BA2\u69D8\u756A\u53F7(" + A_line[0] + ")\u3068\u767B\u9332\u3055\u308C\u305F\u304A\u5BA2\u69D8\u756A\u53F7(" + A_prcardno.join(",") + ")\u304C\u7570\u306A\u308A\u307E\u3059 " + A_billFile[fcnt] + "(" + A_line[1] + "\u306E\u884C)");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_billFile[fcnt] + " \u30D5\u30A1\u30A4\u30EB\u306B\u8A18\u8F09\u3055\u308C\u3066\u3044\u308B\u304A\u5BA2\u69D8\u756A\u53F7(" + A_line[0] + ")\u3068\u767B\u9332\u3055\u308C\u305F\u304A\u5BA2\u69D8\u756A\u53F7(" + A_prcardno.join(",") + ")\u304C\u7570\u306A\u308A\u307E\u3059\u3002\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002 " + A_billFile[fcnt] + "(" + A_line[1] + "\u306E\u884C)");
				error_flg = true;
				break;
			}

			trg_post = dbh.getOne("select postid from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and card_master_no = '" + A_line[0] + "';", true);

			if (trg_post == "") {
				if (DEBUG_FLG) logging("WARNING: \u30EB\u30FC\u30C8\u90E8\u7F72\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u672A\u767B\u9332\u30AB\u30FC\u30C9\u306E\u767B\u9332\u5148\u90E8\u7F72\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093");
				error_flg = true;
				break;
			}

			var copy_buf = "";
			var usedate = "\"" + A_line[8].substr(0, 4) + "-" + A_line[8].substr(4, 2) + "-" + A_line[8].substr(6, 2) + "\"";
			var usetime = A_line[9].substr(0, 2) + ":" + A_line[9].substr(2, 2);
			write_buf += A_pactid[cnt] + "\t" + A_line[4] + "\t" + A_line[0] + "\t" + A_line[10] + "\t" + A_line[18] + "\t" + A_line[11] + "\t" + A_line[19] + "\t" + A_line[13] + "\t" + usedate + "\t" + usetime + "\t" + A_line[16].replace(/(,|")/g, "") + "\t" + A_line[17] + "\t" + A_line[6] + "\t" + A_line[15] + "\t" + JCB_COID + "\n";

			if (-1 !== CARD_result.indexOf(A_line[4]) == false && preg_match("/" + A_line[4] + "/", card_xx_write_buf) == false) //card_xx_tbへのコピー文のバッファ
				{
					copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + A_line[4] + "\t" + A_line[4] + "\t" + A_line[3] + "\t" + A_line[3] + "\t" + A_line[0] + "\t" + A_line[1] + "\t" + A_line[5] + "\t" + A_line[2] + "\t" + A_line[7] + "\t" + JCB_COID + "\t" + nowtime + "\t" + nowtime + "\tfalse\n";
					card_xx_write_buf += copy_buf;
				}

			if (target == "n") //card_tbにデータが無いときはコピー文作成
				{
					if (-1 !== CARD_now_result.indexOf(A_line[4]) == false && preg_match("/" + A_line[4] + "/", card_write_buf) == false) {
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
		fclose(ifp);
	}

	if (error_flg == true) {
		continue;
	}

	fwrite(card_xx_fp, card_xx_write_buf);
	fflush(card_xx_fp);

	if (target == "n") {
		fwrite(card_fp, card_write_buf);
		fflush(card_fp);
	}

	fwrite(cardusehistory_fp, write_buf);
	fflush(cardusehistory_fp);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "\u4EF6\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
	logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "\u4EF6\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fclose(card_xx_fp);

if (target == "n") {
	fclose(card_fp);
}

fclose(cardusehistory_fp);

if (fin_cnt < 1) //２重起動ロック解除
	{
		lock(false, dbh);
		if (DEBUG_FLG) logging("ERROR: \uFF11\u4EF6\u3082\u6210\u529F\u3057\u307E\u305B\u3093\u3067\u3057\u305F");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \uFF11\u4EF6\u3082\u6210\u529F\u3057\u307E\u305B\u3093\u3067\u3057\u305F");
		throw die(1);
	}

if (backup == "y") //CARD_usehistory_X_TBのバックアップ
	//エクスポート失敗した場合
	{
		var cardusehistoryX_exp = DATA_EXP_DIR + "/" + cardusehistoryX_tb + date("YmdHis") + ".exp";
		var sql_str = "select * from " + cardusehistoryX_tb;
		var rtn = dbh.backup(cardusehistoryX_exp, sql_str);

		if (rtn == false) {
			if (DEBUG_FLG) logging("ERROR: " + cardusehistoryX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + cardusehistoryX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + cardusehistoryX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + cardusehistoryX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + cardusehistoryX_exp);
		}
	}

dbh.begin();

if (mode == "o") //対象pactidを１つの文字列に変換
	//CARD_usehistory_XX_TBの削除
	{
		var pactin = "";

		for (cnt = 0;; cnt < fin_cnt; cnt++) {
			pactin += fin_pact[cnt] + ",";
		}

		pactin = rtrim(pactin, ",");
		dbh.query("delete from " + cardusehistoryX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + JCB_COID + ");", true);
		if (DEBUG_FLG) logging("INFO: " + cardusehistoryX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F " + "delete from " + cardusehistoryX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + JCB_COID + ");");
		logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + cardusehistoryX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F" + cardusehistoryX_tb);
	}

if (filesize(card_xx_filename) != 0) //card_X_tb へインポート
	//インポート失敗した場合
	{
		var cardX_col = ["pactid", "postid", "cardno", "cardno_view", "bill_cardno", "bill_cardno_view", "card_corpno", "card_corpname", "card_meigi", "card_membername", "car_no", "cardcoid", "recdate", "fixdate", "delete_flg"];
		rtn = doCopyInsert(cardX_tb, card_xx_filename, cardX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + cardX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + cardX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + cardX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + card_xx_filename);
			logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + cardX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + card_xx_filename);
		}
	}

if (target == "n") {
	if (filesize(card_filename) != 0) //削除フラグが立っている電話でコピー文に含まれる電話はcard_tbから消す
		//card_tb へインポート
		//インポート失敗した場合
		{
			for (var sql of Object.values(A_del_sql)) {
				dbh.query(sql, true);
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 card_tb\u306E\u524A\u9664\u6E08\u30AB\u30FC\u30C9\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F(" + sql + ")");
				if (DEBUG_FLG) logging("INFO: JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 card_tb\u306E\u524A\u9664\u6E08\u30AB\u30FC\u30C9\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F(" + sql + ")");
			}

			var card_col = ["pactid", "postid", "cardno", "cardno_view", "bill_cardno", "bill_cardno_view", "card_corpno", "card_corpname", "card_meigi", "card_membername", "car_no", "cardcoid", "recdate", "fixdate", "delete_flg"];
			rtn = doCopyInsert("card_tb", card_filename, card_col, dbh);

			if (rtn != 0) //ロールバック
				{
					if (DEBUG_FLG) logging("ERROR: card_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
					logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 card_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
					dbh.rollback();
					throw die(1);
				} else {
				if (DEBUG_FLG) logging("INFO: card_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + card_filename);
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 card_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + card_filename);
			}
		}
}

if (filesize(cardusehistory_filename) != 0) //card_usehistory_X_tb へインポート
	//インポート失敗した場合
	{
		var cardusehistoryX_col = ["pactid", "cardno", "card_corpno", "route_name", "in_id", "in_name", "out_id", "out_name", "date", "time", "charge", "discount1", "note", "car_type", "cardcoid"];
		rtn = doCopyInsert(cardusehistoryX_tb, cardusehistory_filename, cardusehistoryX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + cardusehistoryX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + cardusehistoryX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + cardusehistoryX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + cardusehistory_filename);
			logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + cardusehistoryX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + cardusehistory_filename);
		}
	}

dbh.commit();

for (cnt = 0;; cnt < fin_cnt; cnt++) //データディレクトリがある時
{
	var dataDir = JCB_DIR + "/" + fin_pact[cnt];

	if (is_dir(dataDir) == true) //ファイルの移動
		{
			var finDir = dataDir + "/fin";

			if (is_dir(finDir) == false) //完了ディレクトリの作成
				{
					if (mkdir(finDir, 700) == false) {
						if (DEBUG_FLG) logging("ERROR: \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + finDir);
						logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + finDir);
						throw die(1);
					} else {
						if (DEBUG_FLG) logging("INFO: \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
						logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
					}
				}

			clearstatcache();
			dirh = opendir(dataDir);

			while (copyfileName = readdir(dirh)) {
				if (is_file(JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName) == true && preg_match("/\\.txt$/i", copyfileName) == true) {
					if (rename(JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName) == false) {
						if (DEBUG_FLG) logging("ERROR: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
						logh.putError(G_SCRIPT_ERROR, "import_etc_coprhist.php JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
						throw die(1);
					} else {
						if (DEBUG_FLG) logging("INFO: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
						logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + JCB_DIR + "/" + fin_pact[cnt] + "/" + copyfileName);
					}

					clearstatcache();
				}
			}

			closedir(dirh);
		}
}

lock(false, dbh);
print("JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(" + SCRIPT_FILENAME + ")\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002\n");
if (DEBUG_FLG) logging("END: JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(" + SCRIPT_FILENAME + ")\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
logh.putError(G_SCRIPT_END, SCRIPT_FILENAME + " JCB\u6CD5\u4EBAETC\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
throw die(0);

function checkFormat(A_line) //1,法人番号
{
	var errcnt = 0;

	if (preg_match("/^(\\d){0,}$/", A_line[0]) == false) {
		if (DEBUG_FLG) logging("\u6CD5\u4EBA\u756A\u53F7\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[0] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (preg_match("/^(\\d){0,}$/", A_line[3]) == false) {
		if (DEBUG_FLG) logging("JCB\u4F1A\u54E1\u756A\u53F7\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[3] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (preg_match("/^(\\d){0,}$/", A_line[4]) == false) {
		if (DEBUG_FLG) logging("ETC\u30AB\u30FC\u30C9\u756A\u53F7\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[4] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (preg_match("/^(\\d){0,8}$/", A_line[8]) == false) {
		if (DEBUG_FLG) logging("\u5229\u7528\u65E5\u4ED8\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[8] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (preg_match("/^(\\d){0,}$/", A_line[9]) == false) {
		if (DEBUG_FLG) logging("\u6642\u9593\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[9] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (preg_match("/^(\\d){0,}$/", A_line[18]) == false) {
		if (DEBUG_FLG) logging("\u5165\u308A\u53E3IC\u30B3\u30FC\u30C9\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[18] + "(" + A_line[4] + ")");
		errcnt++;
	}

	if (preg_match("/^(\\d){0,}$/", A_line[19]) == false) {
		if (DEBUG_FLG) logging("\u51FA\u53E3IC\u30B3\u30FC\u30C9\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[19] + "(" + A_line[4] + ")");
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

	if (preg_match("/^(\\d){10}$/", A_line[0]) == false) {
		if (DEBUG_FLG) logging("\u304A\u5BA2\u69D8\u756A\u53F7\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[0]);
		errcnt++;
	}

	if (preg_match("/^(\\d){5}$/", A_line[1]) == false) {
		if (DEBUG_FLG) logging("\u7D44\u5408\u54E1\u756A\u53F7\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[1]);
		errcnt++;
	}

	if (preg_match("/^(\\d){6}$/", A_line[2]) == false) {
		if (DEBUG_FLG) logging("\u8ACB\u6C42\u5E74\u6708\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[2]);
		errcnt++;
	}

	if (preg_match("/^(\\d){14}$/", A_line[3]) == false) {
		if (DEBUG_FLG) logging("\u30AB\u30FC\u30C9\u5358\u4F4D\u7BA1\u7406\u756A\u53F7\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[3]);
		errcnt++;
	}

	if (preg_match("/^(\\d){10}$/", A_line[4]) == false) {
		if (DEBUG_FLG) logging("\u901A\u884C\u6599\u91D1\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[4]);
		errcnt++;
	}

	if (preg_match("/^(\\d){10}$/", A_line[5]) == false) {
		if (DEBUG_FLG) logging("\u8DEF\u7DDA\u30D0\u30B9\u5272\u5F15\u5BFE\u8C61\u984D\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[5]);
		errcnt++;
	}

	if (preg_match("/^(\\d){10}$/", A_line[7]) == false) {
		if (DEBUG_FLG) logging("\u8DEF\u7DDA\u30D0\u30B9\u5272\u5F15\u984D\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[7]);
		errcnt++;
	}

	if (preg_match("/^(\\d){10}$/", A_line[9]) == false) {
		if (DEBUG_FLG) logging("\u8ECA\u4E21\u5358\u4F4D\u5272\u5F15\u5BFE\u8C61\u984D\uFF08\u9AD8\u901F\u9053\u8DEF\uFF09\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[9]);
		errcnt++;
	}

	if (preg_match("/^(\\d){10}$/", A_line[10]) == false) {
		if (DEBUG_FLG) logging("\u8ECA\u4E21\u5358\u4F4D\u5272\u5F15\u5BFE\u8C61\u984D\uFF08\u4E00\u822C\u6709\u6599\u9053\u8DEF\uFF09\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[10]);
		errcnt++;
	}

	if (preg_match("/^(\\d){10}$/", A_line[11]) == false) {
		if (DEBUG_FLG) logging("\u8ECA\u4E21\u5358\u4F4D\u5272\u5F15\u984D\uFF08\u9AD8\u901F\u9053\u8DEF\uFF09\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[11]);
		errcnt++;
	}

	if (preg_match("/^(\\d){10}$/", A_line[12]) == false) {
		if (DEBUG_FLG) logging("\u8ECA\u4E21\u5358\u4F4D\u5272\u5F15\u984D\uFF08\u4E00\u822C\u6709\u6599\u9053\u8DEF\uFF09\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[12]);
		errcnt++;
	}

	if (preg_match("/^(\\+|\\-)$/", A_line[13]) == false) {
		if (DEBUG_FLG) logging("\u8ABF\u6574\u7B26\u53F7\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[13]);
		errcnt++;
	}

	if (preg_match("/^(\\d){10}$/", A_line[14]) == false) {
		if (DEBUG_FLG) logging("\u8ABF\u6574\u91D1\u984D\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[14]);
		errcnt++;
	}

	if (preg_match("/^(\\+|\\-)$/", A_line[15]) == false) {
		if (DEBUG_FLG) logging("\u8ABF\u6574\u7B26\u53F7\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[15]);
		errcnt++;
	}

	if (preg_match("/^(\\d){10}$/", A_line[16]) == false) {
		if (DEBUG_FLG) logging("\u8ACB\u6C42\u91D1\u984D\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[16]);
		errcnt++;
	}

	if (preg_match("/^(\\d){15}$/", A_line[17]) == false) {
		if (DEBUG_FLG) logging("\u96C6\u8A08\u5BFE\u8C61\u30AB\u30FC\u30C9\u756A\u53F7\uFF11\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[17]);
		errcnt++;
	}

	if (preg_match("/^(\\d){15}$/", A_line[18]) == false) {
		if (DEBUG_FLG) logging("\u96C6\u8A08\u5BFE\u8C61\u30AB\u30FC\u30C9\u756A\u53F7\uFF12\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[18]);
		errcnt++;
	}

	if (preg_match("/^(\\d){15}$/", A_line[19]) == false) {
		if (DEBUG_FLG) logging("\u96C6\u8A08\u5BFE\u8C61\u30AB\u30FC\u30C9\u756A\u53F7\uFF13\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[19]);
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
	var fp = fopen(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var ins = new TableInserter(logh, db, filename + ".sql", true);
	ins.begin(table);

	while (line = fgets(fp)) //tabで区切り配列に
	//要素数チェック
	//カラム名をキーにした配列を作る
	//インサート行の追加
	{
		var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) {
			logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}

		var H_ins = Array();
		var idx = 0;

		for (var col of Object.values(columns)) {
			H_ins[col] = A_line[idx];
			idx++;
		}

		if (ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F\u3001\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557.");
		fclose(fp);
		return 1;
	}

	fclose(fp);
	return 0;
};

function usage(comment) {
	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} -t={N|O}\n");
	print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7\t (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	print("\t\t-t \u5BFE\u8C61\u6708\u304C\u6700\u65B0/\u904E\u53BB\t(N:\u6700\u65B0,O:\u904E\u53BB) \n\n");
	throw die(1);
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
				db.putError(G_SCRIPT_WARNING, "\u591A\u91CD\u52D5\u4F5C");
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

function logging(lstr) {
	var log_buf = date("Y/m/d H:i:s") + " : " + lstr + "\n";
	var lfp = fopen(GLOBALS.LocalLogFile, "a");
	flock(lfp, LOCK_EX);
	fwrite(lfp, log_buf);
	flock(lfp, LOCK_UN);
	fclose(lfp);
	return;
};

function getTimestamp() {
	var tm = localtime(Date.now() / 1000, true);
	var yyyy = tm.tm_year + 1900;
	var mm = tm.tm_mon + 1;
	if (mm < 10) mm = "0" + mm;
	var dd = tm.tm_mday + 0;
	if (dd < 10) dd = "0" + dd;
	var hh = tm.tm_hour + 0;
	if (hh < 10) hh = "0" + hh;
	var nn = tm.tm_min + 0;
	if (nn < 10) nn = "0" + nn;
	var ss = tm.tm_sec + 0;
	if (ss < 10) ss = "0" + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
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