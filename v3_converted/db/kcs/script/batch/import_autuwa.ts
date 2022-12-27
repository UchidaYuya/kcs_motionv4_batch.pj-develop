#!/usr/local/bin/php
//公私分計権限
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//パラメータチェック
//スタートログの出力(共通ログ)
//データファイルがあるディレクトリを指定
//通話・通信データファイルのディレクトリチェック
//ローカルログファイル名
//スタートログの出力(ローカルログ)
//処理する契約ＩＤ配列
//契約ＩＤの指定が全て（all）の時
//処理する契約ＩＤ
//対象ユーザーのディレクトリチェック
//テーブル名設定
//COPY文ファイルCLOSE
//2006.08.18 UPDATE 上杉顕一郎
//一件も成功していない場合は、ここで終了
//テーブルバックアップ
//対象pactidを１つの文字列に変換
//上書きモードの場合、対象年月・対象契約IDのデータを削除
//kousi_totel_master_tbのCOPY文実行
//完了したファイルをFINディレクトリに移動
//２重起動ロック解除
//終了
//print "au通話・通信データ取込処理(import_autuwa.php)を終了しました。\n";	// メールに不要なのでコメントアウト 20091106miya
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
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
//通話明細の処理
//[引　数] $infilename：対象ファイル名
//$pactid：対象ファイル名
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//通話明細(分計)の処理
//[引　数] $infilename：対象ファイル名
//$pactid：対象ファイル名
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//explus明細の処理
//[引　数] $infilename：対象ファイル名
//$pactid：対象ファイル名
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//有料情報明細の処理
//[引　数] $infilename：対象ファイル名
//$pactid：対象ファイル名
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//auかんたん決済利用料明細の処理
//[引　数] $infilename：対象ファイル名
//$pactid：対象ファイル名
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルにエクスポートを行う
//[引　数] SQL文、COPY用のファイル名
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//請求先番号が存在しない場合のメール送信予約
//[引　数] $pactid：対象ファイル名
//$message: 文言
//[返り値] 成功：true、失敗：false
//作成日：2010-12-02  森原浩司
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
echo("\n");
error_reporting(E_ALL);
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_autuwa.php";
const AU_DIR = "/au";

require("lib/script_db.php");

require("lib/script_log.php");

const AU_BILL_DIR = AU_DIR + "/bill";
const AU_TUWA_DIR = AU_DIR + "/tuwa";
const FUNCTION_KOUSI = "47";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_typeView);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);

if (_SERVER.argv.length != 5) //数が正しくない
	{
		usage("", dbh);
	} else //数が正しい
	//$cnt 0 はスクリプト名のため無視
	{
		var argvCnt = _SERVER.argv.length;

		for (var cnt = 1; cnt < argvCnt; cnt++) //mode を取得
		{
			if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
				{
					var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

					if (ereg("^[ao]$", mode) == false) {
						usage("\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					}

					continue;
				}

			if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
				{
					var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

					if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					} else //年月チェック
						{
							var year = billdate.substr(0, 4);
							var month = billdate.substr(4, 2);

							if (year < date("Y") - 2 || year > date("Y") || +(month < 1 || +(month > 12))) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							}

							if (date("Y") == year && date("m") < +month) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\uFF08\u672A\u6765\u6708\uFF09\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							}

							if ((date("Y") - year) * 12 + (date("m") - +month) >= 24) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\uFF08\uFF12\uFF14\u30F6\u6708\u4EE5\u524D\uFF09\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							}
						}

					continue;
				}

			if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
				{
					var pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

					if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("\u4F1A\u793E\u30B3\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					}

					continue;
				}

			if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
				{
					var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

					if (ereg("^[ny]$", backup) == false) {
						usage("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					}

					continue;
				}

			usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[0]);
		}
	}

logh.putError(G_SCRIPT_BEGIN, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
var dataDir = DATA_DIR + "/" + year + month + AU_TUWA_DIR;

if (pactid == "all") {
	if (is_dir(dataDir) == false) //エラー終了
		{
			logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 au\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die(1);
		}
} else {
	if (is_dir(dataDir + "/" + pactid) == false) //エラー終了
		{
			logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 au\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "/" + pactid + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die(1);
		}
}

clearstatcache();

if (pactid == "all") {
	var LocalLogFile = dataDir + "/importhand.log";
} else {
	LocalLogFile = dataDir + "/" + pactid + "/importaubill.log";
}

if (DEBUG_FLG) logging("START: au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(import_autuwa.php)\u3092\u958B\u59CB\u3057\u307E\u3059");
var A_pactid = Array();

if (pactid == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{
		var fileName;
		var dirh = opendir(dataDir);

		while (fileName = readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		{
			if (is_dir(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {
				A_pactid.push(fileName);
				if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA " + fileName);
			}

			clearstatcache();
		}

		closedir(dirh);
	} else {
	A_pactid.push(pactid);
	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA " + pactid);
}

var pactCnt = A_pactid.length;
A_pactid.sort();

if (pactCnt == 0) //エラー終了
	{
		if (DEBUG_FLG) logging("ERROR: Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093");
		throw die(1);
	}

if (lock(true, dbh) == false) {
	if (DEBUG_FLG) logging("ERROR: import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	throw die(1);
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var commX_tb = "commhistory_" + tableNo + "_tb";
var infoX_tb = "infohistory_" + tableNo + "_tb";
var telX_tb = "tel_" + tableNo + "_tb";
if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C6\u30FC\u30D6\u30EB " + commX_tb + " & " + infoX_tb);
var comm_xx_filename = dataDir + "/" + commX_tb + year + month + pactid + ".ins";
var comm_xx_fp = fopen(comm_xx_filename, "w");

if (comm_xx_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + comm_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + comm_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: commhistory_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + comm_xx_filename);
var info_xx_filename = dataDir + "/" + infoX_tb + year + month + pactid + ".ins";
var info_xx_fp = fopen(info_xx_filename, "w");

if (info_xx_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + info_xx_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + info_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: infohistory_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + info_xx_filename);
var kousi_totel_filename = dataDir + "/kousi_totel_master_tb" + year + month + pactid + ".ins";
var kousi_totel_fp = fopen(kousi_totel_filename, "w");

if (kousi_totel_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + kousi_totel_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + kousi_totel_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: kousi_totel_master_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + kousi_totel_filename);
var fin_cnt = 0;

for (cnt = 0;; cnt < pactCnt; cnt++) //公私分計対応  2006.08.18 UPDATE 上杉顕一郎
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
	var out_rec_cnt = 0;
	var error_flg = false;
	var comm_write_buf = "";
	var info_write_buf = "";
	var kousi_totel_buf = "";
	var PACT_result = dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) logging("WARNING:  \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u4F1A\u793E\u540D\u3092\u53D6\u5F97 " + PACT_result);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	var PACT_Koushi_result = dbh.getOne("select count(*) from fnc_relation_tb where fncid = " + FUNCTION_KOUSI + " and pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_Koushi_result != 1) {
		if (DEBUG_FLG) logging("INFO: \u4F1A\u793E\u6A29\u9650\u3067\u516C\u79C1\u5206\u8A08\u306F\u3057\u307E\u305B\u3093\u3002");
	} else //更に通話判別方式を利用するか？
		{
			var PACT_Tuwa_result = dbh.getHash("select kousi_pattern_tb.comhistflg, kousi_pattern_tb.comhistbaseflg from kousi_default_tb join kousi_pattern_tb on (kousi_default_tb.patternid=kousi_pattern_tb.patternid) where kousi_default_tb.pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);
			var Pact_tuwa_Cnt = PACT_Tuwa_result.length;

			if (Pact_tuwa_Cnt > 0 and PACT_Tuwa_result[0].comhistflg != 1) {
				if (DEBUG_FLG) logging("INFO: \u4F1A\u793E\u6A29\u9650\u3067\u516C\u79C1\u5206\u8A08\u306F\u3059\u308B\u304C\u3001\u30C7\u30D5\u30A9\u30EB\u30C8\u3067\u306F\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3092\u4F7F\u7528\u3057\u307E\u305B\u3093\u3002");
			} else {
				if (DEBUG_FLG) logging("INFO: \u4F1A\u793E\u6A29\u9650\u3067\u516C\u79C1\u5206\u8A08\u306F\u884C\u3044\u3001\u30C7\u30D5\u30A9\u30EB\u30C8\u3067\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3092\u4F7F\u7528\u3057\u307E\u3059\u3002");
			}
		}

	var A_billFile = Array();
	var dataDirPact = dataDir + "/" + A_pactid[cnt];
	dirh = opendir(dataDirPact);

	while (fileName = readdir(dirh)) {
		if (preg_match("/^TM.*\\.csv$/i", fileName) || preg_match("/^EM.*\\.csv$/i", fileName) || preg_match("/^YG.*\\.csv$/i", fileName) || preg_match("/^BT.*\\.csv$/i", fileName) || preg_match("/^BU.*\\.csv$/i", fileName)) {
			A_billFile.push(fileName);
			if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u540D " + fileName);
		}

		clearstatcache();
	}

	closedir(dirh);
	var fileCnt = A_billFile.length;

	if (fileCnt == 0) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u304C\uFF11\u3064\u3082\u307F\u3064\u304B\u308A\u307E\u305B\u3093\uFF08" + dataDirPact + "\uFF09");
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u304C\uFF11\u3064\u3082\u307F\u3064\u304B\u308A\u307E\u305B\u3093\uFF08" + dataDirPact + "\uFF09");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u6570 " + fileCnt);
	var TEL_result = dbh.getHash("select teltb.telno, teltb.cirid, " + "CASE WHEN plan_tb.charge_mode = NULL THEN packet_tb.charge " + "WHEN plan_tb.charge = NULL THEN packet_tb.charge_mode " + "WHEN plan_tb.charge_mode > packet_tb.charge THEN packet_tb.charge " + "ELSE plan_tb.charge_mode END AS charge " + "from  " + telX_tb + "  teltb LEFT OUTER JOIN plan_tb ON teltb.carid = plan_tb.carid and teltb.arid = plan_tb.arid and teltb.planid = plan_tb.planid " + "LEFT OUTER JOIN packet_tb ON teltb.carid = packet_tb.carid and teltb.arid = packet_tb.arid and teltb.packetid = packet_tb.packetid " + "where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	var TEL_result_cnt = TEL_result.length;

	if (TEL_result_cnt == 0) {
		if (DEBUG_FLG) logging("WARNING: \u96FB\u8A71\u304C\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + " select teltb.telno, teltb.cirid, packet_tb.charge from " + telX_tb + " teltb LEFT OUTER JOIN packet_tb" + " ON teltb.carid = packet_tb.carid and teltb.arid = packet_tb.arid and teltb.packetid = packet_tb.packetid where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u96FB\u8A71\u304C\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	for (var acnt = 0; acnt < TEL_result_cnt; acnt++) {
		tel_info.telno[acnt] = TEL_result[acnt].telno;
		tel_info.cirid[acnt] = TEL_result[acnt].cirid;
		tel_info.charge[acnt] = TEL_result[acnt].charge;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u767B\u9332\u96FB\u8A71\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + TEL_result_cnt + "\u4EF6 select teltb.telno, teltb.cirid, packet_tb.charge from " + telX_tb + " teltb LEFT OUTER JOIN packet_tb" + " ON teltb.carid = packet_tb.carid and teltb.arid = packet_tb.arid where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
	var PrTEL_result = dbh.getCol("select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	var PrTelCnt = PrTEL_result.length;

	if (PrTelCnt == 0) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9\uFF08\u89AA\u756A\u53F7\uFF09\u304C\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + "select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9\uFF08\u89AA\u756A\u53F7\uFF09\u304C\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9\uFF08\u89AA\u756A\u53F7\uFF09\u3092\u53D6\u5F97 " + PrTelCnt + "\u4EF6 select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(pactid) + " ;");

	for (var fcnt = 0; fcnt < fileCnt; fcnt++) {
		if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u30C1\u30A7\u30C3\u30AF " + A_billFile[fcnt]);

		if (preg_match("/^TM.*\\.csv$/i", A_billFile[fcnt])) //通話明細ファイル
			{
				if (DEBUG_FLG) logging("INFO: \u901A\u8A71\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u306E\u53D6\u8FBC\u307F\u958B\u59CB " + A_billFile[fcnt]);

				if (readTMfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt], dbh) == false) {
					error_flg = true;
				}
			} else if (preg_match("/^EM.*\\.csv$/i", A_billFile[fcnt])) //explus明細ファイル
			{
				if (DEBUG_FLG) logging("INFO: ezplus\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u306E\u53D6\u8FBC\u307F\u958B\u59CB " + A_billFile[fcnt]);

				if (readEMfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
					error_flg = true;
				}
			} else if (preg_match("/^YG.*\\.csv$/i", A_billFile[fcnt])) //有料情報明細ファイル
			{
				if (DEBUG_FLG) logging("INFO: \u6709\u6599\u60C5\u5831\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u306E\u53D6\u8FBC\u307F\u958B\u59CB " + A_billFile[fcnt]);

				if (readYGfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
					error_flg = true;
				}
			} else if (preg_match("/^BT.*\\.csv$/i", A_billFile[fcnt])) //通話明細（分計）ファイル
			{
				if (DEBUG_FLG) logging("INFO: \u901A\u8A71\u660E\u7D30\uFF08\u5206\u8A08\uFF09\u30D5\u30A1\u30A4\u30EB\u306E\u53D6\u8FBC\u307F\u958B\u59CB " + A_billFile[fcnt]);

				if (readBTfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt], dbh) == false) {
					error_flg = true;
				}
			} else if (preg_match("/^BU.*\\.csv$/i", A_billFile[fcnt])) //通話明細（分計）ファイル
			{
				if (DEBUG_FLG) logging("INFO: au\u304B\u3093\u305F\u3093\u6C7A\u6E08\u5229\u7528\u6599\u660E\u7D30\u30D5\u30A1\u30A4\u30EB\u306E\u53D6\u8FBC\u307F\u958B\u59CB " + A_billFile[fcnt]);

				if (readBUfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt], dbh) == false) {
					error_flg = true;
				}
			}
	}

	if (error_flg == true) continue;
	fwrite(comm_xx_fp, comm_write_buf);
	fflush(comm_xx_fp);
	fwrite(info_xx_fp, info_write_buf);
	fflush(info_xx_fp);
	fwrite(kousi_totel_fp, kousi_totel_buf);
	fflush(kousi_totel_fp);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "\u4EF6\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
	logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " pactid=" + A_pactid[cnt] + ` . ${out_rec_cnt}` + "\u4EF6\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fclose(comm_xx_fp);
fclose(info_xx_fp);
fclose(kousi_totel_fp);

if (fin_cnt < 1) {
	if (DEBUG_FLG) logging("ERROR: \uFF11\u4EF6\u3082\u6210\u529F\u3057\u307E\u305B\u3093\u3067\u3057\u305F");
	logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \uFF11\u4EF6\u3082\u6210\u529F\u3057\u307E\u305B\u3093\u3067\u3057\u305F");
	throw die(1);
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
		var commX_exp = DATA_EXP_DIR + "/" + commX_tb + date("YmdHis") + ".exp";
		var sql_str = "select * from " + commX_tb;
		var rtn = doCopyExp(sql_str, commX_exp, dbh);

		if (rtn == false) {
			if (DEBUG_FLG) logging("ERROR: " + commX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + commX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + commX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + commX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + commX_exp);
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + commX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F" + commX_exp);
		}

		var infoX_exp = DATA_EXP_DIR + "/" + infoX_tb + date("YmdHis") + ".exp";
		sql_str = "select * from " + infoX_tb;
		rtn = doCopyExp(sql_str, infoX_exp, dbh);

		if (rtn == false) {
			if (DEBUG_FLG) logging("ERROR: " + infoX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + infoX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + infoX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + infoX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + infoX_exp);
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + infoX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F" + infoX_exp);
		}

		var kousi_totel_exp = DATA_EXP_DIR + "/kousi_totel_master_tb" + date("YmdHis") + ".exp";
		sql_str = "select * from kousi_totel_master_tb";
		rtn = doCopyExp(sql_str, kousi_totel_exp, dbh);

		if (rtn == false) {
			if (DEBUG_FLG) logging("ERROR:kousi_totel_master_tb\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 kousi_totel_master_tb\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + kousi_totel_exp);
		} else {
			if (DEBUG_FLG) logging("INFO:kousi_totel_master_tb\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + kousi_totel_exp);
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 kousi_totel_master_tb\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F" + kousi_totel_exp);
		}
	}

var pactin = "";

for (cnt = 0;; cnt < fin_cnt; cnt++) {
	pactin += fin_pact[cnt] + ",";
}

pactin = rtrim(pactin, ",");

if (mode == "o") //commhistory_XX_tbの削除
	//infohistory_XX_tbの削除
	{
		dbh.query("delete from " + commX_tb + " where carid = 3 and pactid IN(" + pactin + ");", true);
		if (DEBUG_FLG) logging("INFO: " + commX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F " + "delete from " + commX_tb + " where carid = 3 pactid IN(" + pactin + ");");
		logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + commX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F");
		dbh.query("delete from " + infoX_tb + " where carid = 3 and pactid IN(" + pactin + ");", true);
		if (DEBUG_FLG) logging("INFO: " + infoX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F " + "delete from " + infoX_tb + " where carid = 3 pactid IN(" + pactin + ");");
		logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + infoX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F");
	}

if (filesize(comm_xx_filename) != 0) //commhistory_XX_tb へインポート
	//インポート失敗した場合
	{
		var commhistory_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "byte", "callseg", "callsegname", "discountseg", "occupseg", "carid", "kousiflg", "sendrec", "callsegname"];
		rtn = doCopyInsert(commX_tb, comm_xx_filename, commhistory_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + commX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + commX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + commX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + comm_xx_filename);
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + commX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + comm_xx_filename);
		}
	}

if (filesize(info_xx_filename) != 0) //commhistory_XX_tb へインポート
	//インポート失敗した場合
	{
		var infohistory_col = ["pactid", "telno", "sitename", "fromdate", "accounting", "charge", "carid"];
		rtn = doCopyInsert(infoX_tb, info_xx_filename, infohistory_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + infoX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + infoX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + infoX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + info_xx_filename);
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + infoX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + info_xx_filename);
		}
	}

dbh.query("delete from kousi_totel_master_tb where carid = 3 and kousiflg = '2' and pactid IN(" + pactin + ");", true);
if (DEBUG_FLG) logging("INFO:kousi_totel_master_tb\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u3067\u672A\u767B\u9332\u306E\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F " + "delete from kousi_totel_master_tb where carid = 3 and kousiflg = '2' and pactid IN(" + pactin + ");");
logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 kousi_totel_master_tb\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F");

if (filesize(kousi_totel_filename) != 0) //kousi_totel_master_tb へインポート
	//インポート失敗した場合
	{
		var kousi_totel_col = ["pactid", "telno", "carid", "totelno", "kousiflg", "memo"];
		rtn = doCopyInsert("kousi_totel_master_tb", kousi_totel_filename, kousi_totel_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR:kousi_totel_master_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 kousi_totel_master_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO:kousi_totel_master_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + kousi_totel_filename);
			logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 kousi_totel_master_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + kousi_totel_filename);
		}
	}

dbh.commit();

for (cnt = 0;; cnt < fin_cnt; cnt++) //ファイルの移動
{
	var finDir = dataDir + "/" + fin_pact[cnt] + "/fin";

	if (is_dir(finDir) == false) //完了ディレクトリの作成
		{
			if (mkdir(finDir, 700) == false) {
				if (DEBUG_FLG) logging("ERROR: \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + finDir);
				logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + finDir);
				throw die(1);
			} else {
				if (DEBUG_FLG) logging("INFO: \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
				logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
			}
		}

	clearstatcache();
	dirh = opendir(dataDir + "/" + fin_pact[cnt]);

	while (copyfileName = readdir(dirh)) {
		if (is_file(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName) == true && (preg_match("/^TM.*\\.csv$/i", copyfileName) || preg_match("/^EM.*\\.csv$/i", copyfileName) || preg_match("/^YG.*\\.csv$/i", copyfileName) || preg_match("/^BT.*\\.csv$/i", copyfileName) || preg_match("/^BU.*\\.csv$/i", copyfileName))) {
			if (rename(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName) == false) {
				if (DEBUG_FLG) logging("ERROR: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_ERROR, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				throw die(1);
			} else {
				if (DEBUG_FLG) logging("INFO: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_INFO, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			}
		}

		clearstatcache();
	}

	closedir(dirh);
}

lock(false, dbh);
if (DEBUG_FLG) logging("END: au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(import_autuwa.php)\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
logh.putError(G_SCRIPT_END, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
throw die(0);

function usage(comment) {
	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} \n");
	print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7\t (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
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
		//ロック解除
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

function readTMfile(infilename, pactid, dbh) //公私分計対応  2006.08.18 UPDATE 上杉顕一郎
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
	if (!("logh" in global)) logh = undefined;
	if (!("PACT_result" in global)) PACT_result = undefined;
	if (!("tel_info" in global)) tel_info = undefined;
	if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	if (!("year" in global)) year = undefined;
	if (!("month" in global)) month = undefined;
	if (!("inyear" in global)) inyear = undefined;
	if (!("inmonth" in global)) inmonth = undefined;
	if (!("comm_write_buf" in global)) comm_write_buf = undefined;
	if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	if (!("PACT_Koushi_result" in global)) PACT_Koushi_result = undefined;
	if (!("PACT_Tuwa_result" in global)) PACT_Tuwa_result = undefined;
	if (!("kousi_totel_buf" in global)) kousi_totel_buf = undefined;
	var ifp = fopen(infilename, "r");

	if (ifp == undefined) {
		if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		return false;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
	var line = fgets(ifp);
	line = mb_ereg_replace("\"", "", fgets(ifp));
	line = mb_convert_encoding(line, "UTF-8", "auto");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		fclose(ifp);
		insertClampError(pactid, "\u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059");
		return false;
	}

	inyear = readbuff[0].replace(/[^0-9]/g, "").substr(0, 4);
	inmonth = readbuff[0].replace(/[^0-9]/g, "").substr(4, 2);

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		fclose(ifp);
		return false;
	}

	var oldTelno = "";
	var koushiFlg = false;

	do //2009.07.16 UPDATE 上杉顕一郎
	//文字コード変換
	//UPDATE-END
	//前後の全角スペースを除去
	//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
	//新しい電話か？
	//通話先
	//利用地
	//if( $readbuff[4] == "グローバルパスポート通話明細" ){
	//aaa
	//通話時間
	//2007-08-23 UPDATE k.uesugi 通話時間をドコモに合わせて整形 START
	//$telTime = ereg_replace(":|\.","",$readbuff[11]);
	//2007-08-23 UPDATE END
	//データ量と料金
	//数値型の場合には明示的に0とする
	{
		out_rec_cnt++;
		line = mb_convert_encoding(line, "UTF-8", "auto");
		readbuff = chop(line).split(",");
		var readbuff_cnt = readbuff.length;

		for (var acnt = 0; acnt < readbuff_cnt; acnt++) //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
		{
			readbuff[acnt] = mb_ereg_replace("(^\u3000+|\u3000+$)", "", readbuff[acnt]);
			readbuff[acnt] = mb_ereg_replace("(^\\s+|\\s+$)", "", readbuff[acnt]);
			readbuff[acnt] = mb_ereg_replace("(^\"+|\"+$)", "", readbuff[acnt]);
		}

		if (oldTelno != readbuff[2]) //対象電話は公私分計をするか？
			{
				var tel_Koushi_result = dbh.getOne("select kousiflg from tel_tb where carid = 3 and pactid = " + pactid + " and telno = '" + readbuff[2] + "';", true);

				if (tel_Koushi_result == 0) //またその電話は通話判別方式か？
					//インポートファイルの空行対策 2007/03/07 UPDATE 石崎
					{
						var tel_Tuwa_result = dbh.getHash("select kousi_pattern_tb.comhistflg,  kousi_pattern_tb.comhistbaseflg from tel_tb join kousi_pattern_tb on (tel_tb.kousiptn=kousi_pattern_tb.patternid) where tel_tb.kousiflg='0' and kousi_pattern_tb.comhistflg='1' and tel_tb.carid = 3 and tel_tb.pactid = " + pactid + " and tel_tb.telno = '" + readbuff[2] + "';", true);
						var Tel_Tuwa_cnt = tel_Tuwa_result.length;

						if (undefined !== tel_Tuwa_result[0].comhistflg == false) {} else if (Tel_Tuwa_cnt > 0) {
							if (tel_Tuwa_result[0].comhistflg == 1) {
								if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u3059\u3002");
								if (DEBUG_FLG) logging("INFO: \u672A\u767B\u9332\u96FB\u8A71\u306F" + tel_Tuwa_result[0].comhistbaseflg);
								koushiFlg = true;
							} else {
								if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
								koushiFlg = false;
							}
						} else {
							if (tel_Koushi_result == undefined and PACT_Koushi_result == 1 and PACT_Tuwa_result[0].comhistflg == 1) //会社の公私設定は設定され、通話判別方式か？
								{
									if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u4F1A\u793E\u306E\u6A29\u9650\u306B\u5F93\u3046\u305F\u3081\u3001\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u3059\u3002");
									if (DEBUG_FLG) logging("INFO: \u672A\u767B\u9332\u96FB\u8A71\u306F" + PACT_Tuwa_result[0].comhistbaseflg);
									koushiFlg = true;
								} else //会社の公私設定は設定され、通話判別方式か？
								{
									if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u4F1A\u793E\u306E\u6A29\u9650\u306B\u5F93\u3046\u305F\u3081\u3001\u516C\u79C1\u5206\u8A08\u3092\u3057\u306A\u3044\u304B\u3001\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
									koushiFlg = false;
								}
						}
					} else if (tel_Koushi_result == undefined and PACT_Koushi_result == 1 and PACT_Tuwa_result[0].comhistflg == 1) //会社の公私設定は設定され、通話判別方式か？
					{
						if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u4F1A\u793E\u306E\u6A29\u9650\u306B\u5F93\u3046\u305F\u3081\u3001\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u3059\u3002");
						if (DEBUG_FLG) logging("INFO: \u672A\u767B\u9332\u96FB\u8A71\u306F" + PACT_Tuwa_result[0].comhistbaseflg);
						koushiFlg = true;
					} else //処理しない
					{
						if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u4F1A\u793E\u306E\u6A29\u9650\u306B\u5F93\u3046\u305F\u3081\u3001\u516C\u79C1\u5206\u8A08\u3092\u3057\u306A\u3044\u304B\u3001\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
						koushiFlg = false;
					}

				if (koushiFlg == true) //通話先マスターの取得
					{
						var toTEL_master = Array();
						var toTEL_info = Array();
						toTEL_master = dbh.getHash("select totelno,kousiflg from kousi_totel_master_tb where kousiflg != '2' and carid = 3 and pactid = " + pactid + " and telno = '" + readbuff[2] + "';", true);
						var toTEL_cnt = toTEL_master.length;

						if (toTEL_cnt == 0) {
							if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u901A\u8A71\u5148\u30DE\u30B9\u30BF\u30FC\u306B\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
						} else {
							for (var cnt = 0; cnt < toTEL_cnt; cnt++) {
								toTEL_info.toTELno[cnt] = toTEL_master[cnt].totelno;
								toTEL_info.kousiflg[cnt] = toTEL_master[cnt].kousiflg;
							}
						}
					}

				oldTelno = readbuff[2];
				var comhistbaseflg = "\\N";
				var toTEL_copy = Array();
			}

		if (koushiFlg == true and readbuff[8] != "") //通話先はマスターに存在するか？
			{
				if (undefined !== toTEL_info.toTELno == true and -1 !== toTEL_info.toTELno.indexOf(readbuff[8]) != false) //マスターに存在
					{
						if (DEBUG_FLG) logging("INFO: \u30DE\u30B9\u30BF\u30FC\u306B\u5B58\u5728 totel-" + readbuff[8]);
						var totelnum = array_search(readbuff[8], toTEL_info.toTELno);
						comhistbaseflg = toTEL_info.kousiflg[totelnum];
					} else //コピー文の中も調べる
					{
						if (DEBUG_FLG) logging("INFO: \u30DE\u30B9\u30BF\u30FC\u306B\u5B58\u5728\u3057\u306A\u3044 totel-" + readbuff[8]);

						if (Tel_Tuwa_cnt > 0 and tel_Tuwa_result[0].comhistbaseflg != "") //電話の公私パターンを使用
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
								var toTEL_copycnt = toTEL_copy.length;
								toTEL_copy[toTEL_copycnt + 1] = readbuff[8];
								kousi_totel_buf += pactid + "\t";
								kousi_totel_buf += readbuff[2] + "\t";
								kousi_totel_buf += "3\t";
								kousi_totel_buf += readbuff[8] + "\t";
								kousi_totel_buf += "2\t";
								kousi_totel_buf += "\\N\n";
							} else {
							if (DEBUG_FLG) logging("INFO: \u65E2\u306BCOPY\u6587\u306B\u542B\u307E\u308C\u308B totel-" + readbuff[8]);
						}
					}
			}

		var startTime = mb_ereg_replace("\\/", "-", readbuff[5]) + " " + readbuff[9].substr(0, 8);

		if (readbuff[4] == "\uFF41\uFF55\u56FD\u969B\u96FB\u8A71\u901A\u8A71\u660E\u7D30") {
			var toPlace = readbuff[22];
		} else if (readbuff[4] == "\uFF23\u30E1\u30FC\u30EB\u9001\u4FE1\u660E\u7D30" || readbuff[4] == "\u30D7\u30C1\u30E1\u30FC\u30EB\u9001\u4FE1\u660E\u7D30") {
			toPlace = readbuff[4];
		} else if (preg_match("/^\u30D1\u30B1\u30C3\u30C8\u901A\u4FE1\u660E\u7D30.*$/i", readbuff[4])) {
			toPlace = readbuff[6];
		} else {
			toPlace = readbuff[6] + readbuff[15];
		}

		if (!!readbuff[20]) //国名が入っていたら優先させる 2012/11/28 S-136
			{
				var fromPlace = readbuff[20];
			} else {
			fromPlace = readbuff[14];
		}

		var telTimeTemp = ereg_replace(":|\\.", "", readbuff[11]);
		var telTimeSec = telTimeTemp.substr(4, 3);
		var telTimeMin = telTimeTemp.substr(0, 4);

		if (telTimeMin > 60) {
			var telTimeHour = sprintf("%02d", telTimeMin / 60);
			telTimeMin = sprintf("%02d", telTimeMin % 60);
		} else {
			telTimeMin = telTimeTemp.substr(2, 2);
			telTimeHour = telTimeTemp.substr(0, 2);
		}

		var telTime = telTimeHour + telTimeMin + telTimeSec;

		if (readbuff[17] == "") {
			var dataValue = "\\N";
			var chrgeValue = readbuff[12];
		} else //登録されているパケットの単価で料金を計算する。
			{
				dataValue = readbuff[17];
				var telnum = array_search(readbuff[2], tel_info.telno);

				if (telnum != false) {
					if (tel_info.charge[telnum] == "") //パケットが登録されていない場合は種別で計算
						{
							if (tel_info.cirid[telnum] == "9") //WINの場合
								{
									chrgeValue = +(0.2 * dataValue / 128);
								} else if (tel_info.cirid[telnum] == "8") //CDMA 1Xの場合
								{
									chrgeValue = +(0.27 * dataValue / 128);
								} else //その他の場合
								{
									chrgeValue = readbuff[12];
								}
						} else //パケット単価が指定されていない
						{
							chrgeValue = +(tel_info.charge[telnum] * dataValue / 128);
						}
				} else //登録されていない電話
					{
						chrgeValue = readbuff[12];
					}
			}

		if (chrgeValue == "") {
			chrgeValue = 0;
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
	} while (line = mb_ereg_replace("\"", "", fgets(ifp)));

	fclose(ifp);
	return true;
};

function readBTfile(infilename, pactid, dbh) //公私分計対応  2006.08.18 UPDATE 上杉顕一郎
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
	if (!("logh" in global)) logh = undefined;
	if (!("PACT_result" in global)) PACT_result = undefined;
	if (!("tel_info" in global)) tel_info = undefined;
	if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	if (!("year" in global)) year = undefined;
	if (!("month" in global)) month = undefined;
	if (!("inyear" in global)) inyear = undefined;
	if (!("inmonth" in global)) inmonth = undefined;
	if (!("comm_write_buf" in global)) comm_write_buf = undefined;
	if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	if (!("PACT_Koushi_result" in global)) PACT_Koushi_result = undefined;
	if (!("PACT_Tuwa_result" in global)) PACT_Tuwa_result = undefined;
	if (!("kousi_totel_buf" in global)) kousi_totel_buf = undefined;
	var ifp = fopen(infilename, "r");

	if (ifp == undefined) {
		if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		return false;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
	var line = fgets(ifp);
	line = mb_ereg_replace("\"", "", fgets(ifp));
	line = mb_convert_encoding(line, "UTF-8", "auto");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		fclose(ifp);
		insertClampError(pactid, "\u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059");
		return false;
	}

	inyear = readbuff[0].replace(/[^0-9]/g, "").substr(0, 4);
	inmonth = readbuff[0].replace(/[^0-9]/g, "").substr(4, 2);

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		fclose(ifp);
		return false;
	}

	var oldTelno = "";
	var koushiFlg = false;
	var fromFlg = false;

	do //2009.07.16 UPDATE 上杉顕一郎
	//文字コード変換
	//UPDATE-END
	//前後の全角スペースを除去
	//公私分計対応  2006.08.18 UPDATE 上杉顕一郎
	//新しい電話か？
	//通話先
	//利用地
	//通話時間
	//2007-08-23 UPDATE k.uesugi 通話時間をドコモに合わせて整形 START
	//$telTime = ereg_replace(":|\.","",$readbuff[11]);
	//2007-08-23 UPDATE END
	//データ量と料金
	//数値型の場合には明示的に0とする
	{
		out_rec_cnt++;
		line = mb_convert_encoding(line, "UTF-8", "auto");
		readbuff = chop(line).split(",");
		var readbuff_cnt = readbuff.length;

		for (var acnt = 0; acnt < readbuff_cnt; acnt++) //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
		{
			readbuff[acnt] = mb_ereg_replace("(^\u3000+|\u3000+$)", "", readbuff[acnt]);
			readbuff[acnt] = mb_ereg_replace("(^\\s+|\\s+$)", "", readbuff[acnt]);
			readbuff[acnt] = mb_ereg_replace("(^\"+|\"+$)", "", readbuff[acnt]);
		}

		if (oldTelno != readbuff[2]) //対象電話は公私分計をするか？
			{
				var comhistbaseflg = "\\N";
				var tel_Koushi_result = dbh.getOne("select kousiflg from tel_tb where carid = 3 and pactid = " + pactid + " and telno = '" + readbuff[2] + "';", true);

				if (tel_Koushi_result == 0) //またその電話は通話判別方式か？
					{
						var tel_Tuwa_result = dbh.getHash("select kousi_pattern_tb.comhistflg,  kousi_pattern_tb.comhistbaseflg from tel_tb join kousi_pattern_tb on (tel_tb.kousiptn=kousi_pattern_tb.patternid) where tel_tb.kousiflg='0' and kousi_pattern_tb.comhistflg='1' and tel_tb.carid = 3 and tel_tb.pactid = " + pactid + " and tel_tb.telno = '" + readbuff[2] + "';", true);
						var Tel_Tuwa_cnt = tel_Tuwa_result.length;

						if (Tel_Tuwa_cnt > 0) {
							if (tel_Tuwa_result[0].comhistflg == 1) {
								if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u3059\u3002");
								if (DEBUG_FLG) logging("INFO: \u672A\u767B\u9332\u96FB\u8A71\u306F" + tel_Tuwa_result[0].comhistbaseflg);
								koushiFlg = true;
							} else {
								if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
								koushiFlg = false;
							}
						} else {
							if (tel_Koushi_result == undefined and PACT_Koushi_result == 1 and PACT_Tuwa_result[0].comhistflg == 1) //会社の公私設定は設定され、通話判別方式か？
								{
									if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u4F1A\u793E\u306E\u6A29\u9650\u306B\u5F93\u3046\u305F\u3081\u3001\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u3059\u3002");
									if (DEBUG_FLG) logging("INFO: \u672A\u767B\u9332\u96FB\u8A71\u306F" + PACT_Tuwa_result[0].comhistbaseflg);
									koushiFlg = true;
								} else //会社の公私設定は設定され、通話判別方式か？
								{
									if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u4F1A\u793E\u306E\u6A29\u9650\u306B\u5F93\u3046\u305F\u3081\u3001\u516C\u79C1\u5206\u8A08\u3092\u3057\u306A\u3044\u304B\u3001\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
									koushiFlg = false;
								}
						}
					} else if (tel_Koushi_result == undefined and PACT_Koushi_result == 1 and PACT_Tuwa_result[0].comhistflg == 1) //会社の公私設定は設定され、通話判別方式か？
					{
						if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u4F1A\u793E\u306E\u6A29\u9650\u306B\u5F93\u3046\u305F\u3081\u3001\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u3059\u3002");
						if (DEBUG_FLG) logging("INFO: \u672A\u767B\u9332\u96FB\u8A71\u306F" + PACT_Tuwa_result[0].comhistbaseflg);
						koushiFlg = true;
					} else //処理しない
					{
						if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u4F1A\u793E\u306E\u6A29\u9650\u306B\u5F93\u3046\u305F\u3081\u3001\u516C\u79C1\u5206\u8A08\u3092\u3057\u306A\u3044\u304B\u3001\u901A\u8A71\u5224\u5225\u65B9\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
						koushiFlg = false;
					}

				if (koushiFlg == true) //通話元マスターの取得
					{
						var fromTEL_master = dbh.getOne("select kousiflg from kousi_fromtel_master_tb where fromtelno = '1' and type = 'O' and carid = 3 and pactid = " + pactid + " and telno = '" + readbuff[2] + "';", true);

						if (fromTEL_master.length == 1) {
							fromFlg = true;
							comhistbaseflg = fromTEL_master.kousiflg;
							if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u5206\u8A08\uFF08\u7528\u9014\u5225=1)\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002");
							if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306E\u516C\u79C1\u5206\u8A08\u30D5\u30E9\u30B0\u306F" + fromTEL_master.kousiflg);
						} else //通話先マスターの取得
							{
								fromFlg = false;
								if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u5206\u8A08\uFF08\u7528\u9014\u5225=1)\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002");
								var toTEL_master = Array();
								var toTEL_info = Array();
								toTEL_master = dbh.getHash("select totelno,kousiflg from kousi_totel_master_tb where kousiflg != '2' and carid = 3 and pactid = " + pactid + " and telno = '" + readbuff[2] + "';", true);
								var toTEL_cnt = toTEL_master.length;

								if (toTEL_cnt == 0) {
									if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u96FB\u8A71(" + readbuff[2] + ")\u306F\u901A\u8A71\u5148\u30DE\u30B9\u30BF\u30FC\u306B\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
								} else {
									for (var cnt = 0; cnt < toTEL_cnt; cnt++) {
										toTEL_info.toTELno[cnt] = toTEL_master[cnt].totelno;
										toTEL_info.kousiflg[cnt] = toTEL_master[cnt].kousiflg;
									}
								}
							}
					}

				oldTelno = readbuff[2];
				var toTEL_copy = Array();
			}

		if (koushiFlg == true and readbuff[8] != "" and fromFlg == false) //通話先はマスターに存在するか？
			{
				if (undefined !== toTEL_info.toTELno == true and -1 !== toTEL_info.toTELno.indexOf(readbuff[8]) != false) //マスターに存在
					{
						if (DEBUG_FLG) logging("INFO: \u30DE\u30B9\u30BF\u30FC\u306B\u5B58\u5728 totel-" + readbuff[8]);
						var totelnum = array_search(readbuff[8], toTEL_info.toTELno);
						comhistbaseflg = toTEL_info.kousiflg[totelnum];
					} else //コピー文の中も調べる
					{
						if (DEBUG_FLG) logging("INFO: \u30DE\u30B9\u30BF\u30FC\u306B\u5B58\u5728\u3057\u306A\u3044 totel-" + readbuff[8]);

						if (Tel_Tuwa_cnt > 0 and tel_Tuwa_result[0].comhistbaseflg != "") //電話の公私パターンを使用
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
								var toTEL_copycnt = toTEL_copy.length;
								toTEL_copy[toTEL_copycnt + 1] = readbuff[8];
								kousi_totel_buf += pactid + "\t";
								kousi_totel_buf += readbuff[2] + "\t";
								kousi_totel_buf += "3\t";
								kousi_totel_buf += readbuff[8] + "\t";
								kousi_totel_buf += "2\t";
								kousi_totel_buf += "\\N\n";
							} else {
							if (DEBUG_FLG) logging("INFO: \u65E2\u306BCOPY\u6587\u306B\u542B\u307E\u308C\u308B totel-" + readbuff[8]);
						}
					}
			}

		var startTime = mb_ereg_replace("\\/", "-", readbuff[5]) + " " + readbuff[9].substr(0, 8);

		if (readbuff[4] == "\uFF41\uFF55\u56FD\u969B\u96FB\u8A71\u901A\u8A71\u660E\u7D30") {
			var toPlace = readbuff[22];
		} else if (readbuff[4] == "\uFF23\u30E1\u30FC\u30EB\u9001\u4FE1\u660E\u7D30" || readbuff[4] == "\u30D7\u30C1\u30E1\u30FC\u30EB\u9001\u4FE1\u660E\u7D30") {
			toPlace = readbuff[4];
		} else if (preg_match("/^\u30D1\u30B1\u30C3\u30C8\u901A\u4FE1\u660E\u7D30.*$/i", readbuff[4])) {
			toPlace = readbuff[6];
		} else {
			toPlace = readbuff[6] + readbuff[15];
		}

		if (readbuff[4] == "\u30B0\u30ED\u30FC\u30D0\u30EB\u30D1\u30B9\u30DD\u30FC\u30C8\u901A\u8A71\u660E\u7D30") {
			var fromPlace = readbuff[20];
		} else {
			fromPlace = readbuff[14];
		}

		var telTimeTemp = ereg_replace(":|\\.", "", readbuff[11]);
		var telTimeSec = telTimeTemp.substr(4, 3);
		var telTimeMin = telTimeTemp.substr(0, 4);

		if (telTimeMin > 60) {
			var telTimeHour = sprintf("%02d", telTimeMin / 60);
			telTimeMin = sprintf("%02d", telTimeMin % 60);
		} else {
			telTimeMin = telTimeTemp.substr(2, 2);
			telTimeHour = telTimeTemp.substr(0, 2);
		}

		var telTime = telTimeHour + telTimeMin + telTimeSec;

		if (readbuff[17] == "") {
			var dataValue = "\\N";
			var chrgeValue = readbuff[12];
		} else //登録されているパケットの単価で料金を計算する。
			{
				dataValue = readbuff[17];
				var telnum = array_search(readbuff[2], tel_info.telno);

				if (telnum != false) {
					if (tel_info.charge[telnum] == "") //パケットが登録されていない場合は種別で計算
						{
							if (tel_info.cirid[telnum] == "9") //WINの場合
								{
									chrgeValue = +(0.2 * dataValue / 128);
								} else if (tel_info.cirid[telnum] == "8") //CDMA 1Xの場合
								{
									chrgeValue = +(0.27 * dataValue / 128);
								} else //その他の場合
								{
									chrgeValue = readbuff[12];
								}
						} else //パケット単価が指定されていない
						{
							chrgeValue = +(tel_info.charge[telnum] * dataValue / 128);
						}
				} else //登録されていない電話
					{
						chrgeValue = readbuff[12];
					}
			}

		if (chrgeValue == "") {
			chrgeValue = 0;
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
	} while (line = mb_ereg_replace("\"", "", fgets(ifp)));

	fclose(ifp);
	return true;
};

function readEMfile(infilename, pactid) //対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//$inmonth = substr( $readbuff[0], 6, 2);
{
	if (!("logh" in global)) logh = undefined;
	if (!("PACT_result" in global)) PACT_result = undefined;
	if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	if (!("year" in global)) year = undefined;
	if (!("month" in global)) month = undefined;
	if (!("inyear" in global)) inyear = undefined;
	if (!("inmonth" in global)) inmonth = undefined;
	if (!("comm_write_buf" in global)) comm_write_buf = undefined;
	if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	var ifp = fopen(infilename, "r");

	if (ifp == undefined) {
		if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		return false;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
	var line = fgets(ifp);
	line = mb_ereg_replace("\"", "", fgets(ifp));
	line = mb_convert_encoding(line, "UTF-8", "auto");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		fclose(ifp);
		insertClampError(pactid, "\u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059");
		return false;
	}

	inyear = readbuff[0].replace(/[^0-9]/g, "").substr(0, 4);
	inmonth = readbuff[0].replace(/[^0-9]/g, "").substr(4, 2);

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		fclose(ifp);
		return false;
	}

	do //2009.07.16 UPDATE 上杉顕一郎
	//文字コード変換
	//UPDATE-END
	//前後の全角スペースを除去
	//開始時間
	//通話先
	//数値型の場合には明示的に0とする
	//commhistory_XX_tbのCOPY文出力
	{
		out_rec_cnt++;
		line = mb_convert_encoding(line, "UTF-8", "auto");
		readbuff = chop(line).split(",");
		var readbuff_cnt = readbuff.length;

		for (var acnt = 0; acnt < readbuff_cnt; acnt++) //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
		{
			readbuff[acnt] = mb_ereg_replace("(^\\s+|\\s+$)", "", readbuff[acnt]);
			readbuff[acnt] = mb_ereg_replace("(^\"+|\"+$)", "", readbuff[acnt]);
		}

		var startTime = mb_ereg_replace("\\/", "-", readbuff[5]) + " " + readbuff[8].substr(0, 8);
		var toPlace = readbuff[4] + " " + readbuff[6];
		var chrgeValue = readbuff[9];

		if (chrgeValue == "") {
			chrgeValue = 0;
		}

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
	} while (line = mb_ereg_replace("\"", "", fgets(ifp)));

	fclose(ifp);
	return true;
};

function readYGfile(infilename, pactid) //対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//$inmonth = substr( $readbuff[0], 6, 2);
{
	if (!("logh" in global)) logh = undefined;
	if (!("PACT_result" in global)) PACT_result = undefined;
	if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	if (!("year" in global)) year = undefined;
	if (!("month" in global)) month = undefined;
	if (!("inyear" in global)) inyear = undefined;
	if (!("inmonth" in global)) inmonth = undefined;
	if (!("info_write_buf" in global)) info_write_buf = undefined;
	if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	var ifp = fopen(infilename, "r");

	if (ifp == undefined) {
		if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		return false;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
	var line = fgets(ifp);
	line = mb_ereg_replace("\"", "", fgets(ifp));
	line = mb_convert_encoding(line, "UTF-8", "auto");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		fclose(ifp);
		insertClampError(pactid, "\u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059");
		return false;
	}

	inyear = readbuff[0].replace(/[^0-9]/g, "").substr(0, 4);
	inmonth = readbuff[0].replace(/[^0-9]/g, "").substr(4, 2);

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		fclose(ifp);
		return false;
	}

	do //2009.07.16 UPDATE 上杉顕一郎
	//文字コード変換
	//UPDATE-END
	//前後の全角スペースを除去
	//数値型の場合には明示的に0とする
	{
		out_rec_cnt++;
		line = mb_convert_encoding(line, "UTF-8", "auto");
		readbuff = chop(line).split(",");
		var readbuff_cnt = readbuff.length;

		for (var acnt = 0; acnt < readbuff_cnt; acnt++) //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
		{
			readbuff[acnt] = mb_ereg_replace("(^\\s+|\\s+$)", "", readbuff[acnt]);
			readbuff[acnt] = mb_ereg_replace("(^\"+|\"+$)", "", readbuff[acnt]);
		}

		var chrgeValue = readbuff[9];

		if (chrgeValue == "") {
			chrgeValue = 0;
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
	} while (line = mb_ereg_replace("\"", "", fgets(ifp)));

	fclose(ifp);
	return true;
};

function readBUfile(infilename, pactid) //対象ファイルオープン
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
{
	if (!("logh" in global)) logh = undefined;
	if (!("PACT_result" in global)) PACT_result = undefined;
	if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	if (!("year" in global)) year = undefined;
	if (!("month" in global)) month = undefined;
	if (!("inyear" in global)) inyear = undefined;
	if (!("inmonth" in global)) inmonth = undefined;
	if (!("info_write_buf" in global)) info_write_buf = undefined;
	if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	var ifp = fopen(infilename, "r");

	if (ifp == undefined) {
		if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		return false;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
	var line = fgets(ifp);
	line = mb_ereg_replace("\"", "", fgets(ifp));
	line = mb_convert_encoding(line, "UTF-8", "auto");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		fclose(ifp);
		insertClampError(pactid, "\u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059");
		return false;
	}

	inyear = readbuff[0].replace(/[^0-9]/g, "").substr(0, 4);
	inmonth = readbuff[0].replace(/[^0-9]/g, "").substr(4, 2);

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_autuwa.php au\u901A\u8A71\u30FB\u901A\u4FE1\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		fclose(ifp);
		return false;
	}

	do //文字コード変換
	//UPDATE-END
	//前後の全角スペースを除去
	//開始時間
	//数値型の場合には明示的に0とする
	{
		out_rec_cnt++;
		line = mb_convert_encoding(line, "UTF-8", "auto");
		readbuff = chop(line).split(",");
		var readbuff_cnt = readbuff.length;

		for (var acnt = 0; acnt < readbuff_cnt; acnt++) //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
		{
			readbuff[acnt] = mb_ereg_replace("(^\\s+|\\s+$)", "", readbuff[acnt]);
			readbuff[acnt] = mb_ereg_replace("(^\"+|\"+$)", "", readbuff[acnt]);
		}

		var startTime = mb_ereg_replace("\\/", "-", readbuff[7]) + " 00:00:00";
		var chrgeValue = readbuff[6];

		if (chrgeValue == "") {
			chrgeValue = 0;
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
				info_write_buf += "au\u304B\u3093\u305F\u3093\u6C7A\u6E08\t";
				info_write_buf += chrgeValue + "\t";
				info_write_buf += "3\n";
			}
	} while (line = mb_ereg_replace("\"", "", fgets(ifp)));

	fclose(ifp);
	return true;
};

function doCopyInsert(table, filename, columns, db) //ファイルを開く
//$ins->setDebug( true );
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

	while (line = fgets(fp)) //データはtab区切り
	//インサート行の追加
	{
		var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) //要素数が異なっていたら
			{
				logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002\u30C7\u30FC\u30BF=" + line + ":" + A_line.length + ":" + columns.length);
				fclose(fp);
				return 1;
			}

		var H_ins = Array();
		var idx = 0;

		for (var col of Object.values(columns)) {
			if (A_line[idx] != "\\N") //\N の場合はハッシュに追加しない
				{
					H_ins[col] = A_line[idx];
				}

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

function doCopyExp(sql, filename, db) //一度にFETCHする行数
//ファイルを開く
{
	var NUM_FETCH = 100000;
	var fp = fopen(filename, "wt");

	if (!fp) {
		return false;
	}

	db.query("DECLARE exp_cur CURSOR FOR " + sql);

	for (; ; ) //ＤＢから１行ずつ結果取得
	{
		var result = pg_query(db.m_db.connection, "FETCH " + NUM_FETCH + " IN exp_cur");

		if (result == undefined) {
			fclose(fp);
			return false;
		}

		if ((A_line = pg_fetch_array(result)) == undefined) //ループ終了
			{
				break;
			}

		var str = "";

		do //データ区切り記号、初回のみ空
		{
			var delim = "";

			for (var item of Object.values(A_line)) //データ区切り記号
			{
				str += delim;
				delim = "\t";

				if (item == undefined) //nullを表す記号
					{
						str += "\\N";
					} else {
					str += item;
				}
			}

			str += "\n";
		} while (A_line = pg_fetch_array(result));

		if (fputs(fp, str) == false) {
			fclose(fp);
			return false;
		}
	}

	db.query("CLOSE exp_cur");
	fclose(fp);
	return true;
};

function insertClampError(pactid, message) {
	if (!("dbh" in global)) dbh = undefined;
	var sql = "insert into clamp_error_tb" + "(pactid,carid,error_type,message,is_send,recdate,fixdate)" + "values" + "(" + pactid + "," + 3 + ",'prtelno'" + ",'" + message + "'" + ",false" + ",'" + date("Y/m/d H:i:s") + "'" + ",'" + date("Y/m/d H:i:s") + "'" + ")" + ";";
	dbh.query(sql);
	return true;
};