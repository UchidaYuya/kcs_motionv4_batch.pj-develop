#!/usr/local/bin/php
//require_once("MailUtil.php");
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//MtOutput（V3用）
//$O_out = MtOutput::singleton();
//パラメータチェック
//スタートログの出力(共通ログ)
//データファイルがあるディレクトリを指定
//請求データファイルのディレクトリチェック
//ローカルログファイル名
//スタートログの出力(ローカルログ)
//処理する契約ＩＤ配列
//契約ＩＤの指定が全て（all）の時
//処理する契約ＩＤ
//対象ユーザーのディレクトリチェック
//20110411
//テーブル名設定
//20110511
//20110411
//会社毎の処理
//undefinedのnoticeが出たので追加 201012miya
//COPY文ファイルCLOSE
//重大なエラーの場合は直ぐに終了します
//内訳コードエラーの場合もここでストップ（内訳コードエラーも$Stop_Errorだったが、全社舐めるまで終わらないようエラーを分けた）20091208miya
//if($Stop_Error == true || $Utiwake_Error == true) exit(1);	// 20110511
//上書きモードの場合、対象年月・対象契約IDのデータを削除
//完了したファイルをFINディレクトリに移動
//２重起動ロック解除
//終了
//print "au請求データ取込処理(import_aubill.php)を終了しました。\n";	// メールに不要なのでコメントアウト 20091106miya
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
//ＡＳＰ利用料表示設定があるかないか
//[引　数] $pactid：契約ＩＤ
//[返り値] ある：true、ない：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//一括請求内訳の処理
//[引　数] $infilename：対象ファイル名
//$pactid：対象ファイル名
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//回線別請求内訳の処理
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
//一括請求内訳の処理
//[引　数] $infilename：対象ファイル名
//$pactid：対象ファイル名
//[返り値] 成功：true、失敗：false
//作成日：2009-06-09  上杉顕一郎
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//回線別請求内訳の処理
//[引　数] $infilename：対象ファイル名
//$pactid：対象ファイル名
//[返り値] 成功：true、失敗：false
//作成日：2009-06-09  上杉顕一郎
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//請求先番号が存在しない場合のメール送信予約
//[引　数] $pactid：対象ファイル名
//$message: 文言
//[返り値] 成功：true、失敗：false
//作成日：2010-12-02  森原浩司
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//20110511
echo("\n");
error_reporting(E_ALL);
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_aubill.php";

require("lib/script_db.php");

require("lib/script_log.php");

require("model/script/TelAmountModel.php");

require("MtOutput.php");

const AU_DIR = "/au";
const AU_BILL_DIR = AU_DIR + "/bill";
const AU_TUWA_DIR = AU_DIR + "/tuwa";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_typeView);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);

if (_SERVER.argv.length != 6) //数が正しくない
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

			if (ereg("^-t=", _SERVER.argv[cnt]) == true) {
				var target = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

				if (ereg("^[no]$", target) == false) {
					usage("\u5BFE\u8C61\u6708\u306E\uFF08\u6700\u65B0/\u904E\u53BB\uFF09\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
				}

				continue;
			}

			usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[0]);
		}
	}

logh.putError(G_SCRIPT_BEGIN, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
var dataDir = DATA_DIR + "/" + year + month + AU_BILL_DIR;

if (pactid == "all") {
	if (is_dir(dataDir) == false) //エラー終了
		{
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 au\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die(1);
		}
} else {
	if (is_dir(dataDir + "/" + pactid) == false) //エラー終了
		{
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 au\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "/" + pactid + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die(1);
		}
}

clearstatcache();

if (pactid == "all") {
	var LocalLogFile = dataDir + "/importhand.log";
} else {
	LocalLogFile = dataDir + "/" + pactid + "/importaubill.log";
}

if (DEBUG_FLG) logging("START: au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(import_aubill.php)\u3092\u958B\u59CB\u3057\u307E\u3059");
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
		logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093");
		throw die(1);
	}

if (lock(true, dbh) == false) {
	if (DEBUG_FLG) logging("ERROR: import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	throw die(1);
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var A_prtelnos = Array();
var O_tab = new TelAmountModel(dataDir, logh, _SERVER.argv, SCRIPT_FILENAME);
var telX_tb = "tel_" + tableNo + "_tb";
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C6\u30FC\u30D6\u30EB " + telX_tb + " & " + teldetailX_tb);
var au_utiwake_result = dbh.getHash("select code, name, codetype from utiwake_tb where carid = 3 order by code;", true);
var au_utiwake_cnt = au_utiwake_result.length;
var au_utiwake_max = 0;

for (var acnt = 0; acnt < au_utiwake_cnt; acnt++) {
	if (is_numeric(au_utiwake_result[acnt].code) == true) {
		au_utiwake.name[au_utiwake_result[acnt].code] = au_utiwake_result[acnt].name;
		au_utiwake.codetype[au_utiwake_result[acnt].code] = au_utiwake_result[acnt].codetype;
		au_utiwake_max = au_utiwake_result[acnt].code;
	}
}

if (DEBUG_FLG) logging("INFO: au\u306E\u8ACB\u6C42\u5185\u8A33\u540D\u79F0\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 \u6700\u5927\u30B3\u30FC\u30C9\u756A\u53F7=" + au_utiwake_max);
var au_utiwake = dbh.getHash("select code, codetype from utiwake_tb where carid = 3 order by code;", true);

for (var val of Object.values(au_utiwake)) {
	au_utiwakecode[val.code] = val.codetype;
}

var au_utiwakecode_cnt = au_utiwakecode.length;
if (DEBUG_FLG) logging("INFO: au\u306E\u8ACB\u6C42\u5185\u8A33\u540D\u79F0\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97\u4EF6\u6570 =" + au_utiwakecode_cnt);
var tel_xx_filename = dataDir + "/" + telX_tb + year + month + pactid + ".ins";
var tel_xx_fp = fopen(tel_xx_filename, "w");

if (tel_xx_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + tel_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + tel_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: tel_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + tel_xx_filename);

if (target == "n") {
	var tel_filename = dataDir + "/tel_tb" + year + month + pactid + ".ins";
	var tel_fp = fopen(tel_filename, "w");

	if (tel_fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + tel_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + tel_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		throw die(1);
	}

	if (DEBUG_FLG) logging("INFO: tel_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + tel_filename);
}

var teldetail_filename = dataDir + "/" + teldetailX_tb + year + month + pactid + ".ins";
var teldetail_fp = fopen(teldetail_filename, "w");

if (teldetail_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + teldetail_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetail_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: tel_details_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + teldetail_filename);
var utiwake_filename = dataDir + "/utiwake_tb" + year + month + pactid + ".ins";
var utiwake_fp = fopen(utiwake_filename, "w");

if (undefined == utiwake_fp || !utiwake_fp) {
	if (DEBUG_FLG) logging("ERROR: " + utiwake_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u307F\u51E6\u7406 " + utiwake_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: utiwake_tb\u3078\u306Ecopy\u30D5\u30A1\u30A4\u30EB\u6587\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3 " + utiwake_filename);
O_tab.makeFile(year, month, pactid);
var Stop_Error = false;
var Utiwake_Error = false;
var fin_cnt = 0;

for (cnt = 0;; cnt < pactCnt; cnt++) //対象会社の会社名を取得
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
	var PACT_result = dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) logging("WARNING:  \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u4F1A\u793E\u540D\u3092\u53D6\u5F97 " + PACT_result);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	var A_billFile = Array();
	var dataDirPact = dataDir + "/" + A_pactid[cnt];
	dirh = opendir(dataDirPact);

	while (fileName = readdir(dirh)) //2009-06-09 UPDATE START コード付データ対応 k.uesugi
	//if((preg_match("/^IU.*\.csv$/i", $fileName)) || (preg_match("/^SU.*\.csv$/i", $fileName))){
	{
		if (preg_match("/^IU.*\\.csv$/i", fileName) || preg_match("/^SU.*\\.csv$/i", fileName) || preg_match("/^IC.*\\.csv$/i", fileName) || preg_match("/^SC.*\\.csv$/i", fileName)) //2009-06-09 UPDATE END
			{
				A_billFile.push(fileName);
				if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u540D " + fileName);
			}

		clearstatcache();
	}

	closedir(dirh);
	var fileCnt = A_billFile.length;

	if (fileCnt == 0) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u304C\uFF11\u3064\u3082\u307F\u3064\u304B\u308A\u307E\u305B\u3093\uFF08" + dataDirPact + "\uFF09");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u6570 " + fileCnt);
	var iu_flg = 0;

	for (var fcnt = 0; fcnt < fileCnt; fcnt++) //2009-06-09 UPDATE START コード付データ対応 k.uesugi
	//if(preg_match("/^IU.*\.csv$/i", $A_billFile[$fcnt])){
	{
		if (preg_match("/^IU.*\\.csv$/i", A_billFile[fcnt]) || preg_match("/^IC.*\\.csv$/i", A_billFile[fcnt])) //2009-06-09 UPDATE END
			{
				iu_flg = 1;
				break;
			}
	}

	if (iu_flg == 0) {
		if (DEBUG_FLG) logging("WARNING: \u4E00\u62EC\u8ACB\u6C42\u5408\u8A08\u5185\u8A33\u30D5\u30A1\u30A4\u30EB\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u305B\u3093\uFF08" + dataDirPact + "\uFF09");
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u4E00\u62EC\u8ACB\u6C42\u5408\u8A08\u5185\u8A33\u30D5\u30A1\u30A4\u30EB\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u305B\u3093\uFF08" + dataDirPact + "\uFF09");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u4E00\u62EC\u8ACB\u6C42\u5408\u8A08\u5185\u8A33\u30D5\u30A1\u30A4\u30EB\u5B58\u5728 ");
	var TEL_result = dbh.getCol("select telno from " + telX_tb + " where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u767B\u9332\u96FB\u8A71\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + TEL_result.length + "\u4EF6 select telno from " + telX_tb + " where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");

	if (target == "n") {
		var TEL_now_result = dbh.getCol("select telno from tel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
		if (DEBUG_FLG) logging("INFO: \u6700\u65B0\u306E\u767B\u9332\u96FB\u8A71\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + TEL_now_result.length + "\u4EF6 select telno from tel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
	}

	var trg_post = dbh.getOne("select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;", true);

	if (trg_post == "") {
		if (DEBUG_FLG) logging("WARNING: \u30EB\u30FC\u30C8\u90E8\u7F72\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u30EB\u30FC\u30C8\u90E8\u7F72\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u30EB\u30FC\u30C8\u90E8\u7F72\u306Epostid\u53D6\u5F97 postid=" + trg_post + " select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
	var aspFlg = false;

	if (chkAsp(dbh.escape(A_pactid[cnt])) == true) {
		aspFlg = true;
		if (DEBUG_FLG) logging("INFO: ASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u304C\uFF2F\uFF2E");
		var asp_bill = dbh.getOne("select charge from asp_charge_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

		if (asp_bill == "") {
			if (DEBUG_FLG) logging("WARNING: ASP\u5229\u7528\u6599\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + "select carid, charge from asp_charge_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
			logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " ASP\u5229\u7528\u6599\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
			continue;
		}

		var asp_tax = +(asp_bill * G_EXCISE_RATE);
		if (DEBUG_FLG) logging("INFO: ASP\u4F7F\u7528\u6599\u53D6\u5F97 " + asp_bill);
	}

	var PrTEL_result = dbh.getCol("select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	var PrTelCnt = PrTEL_result.length;

	if (PrTelCnt == 0) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9\uFF08\u89AA\u756A\u53F7\uFF09\u304C\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + "select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9\uFF08\u89AA\u756A\u53F7\uFF09\u304C\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9\uFF08\u89AA\u756A\u53F7\uFF09\u3092\u53D6\u5F97 " + PrTelCnt + "\u4EF6 select prtelno from bill_prtel_tb where carid = 3 and pactid = " + dbh.escape(pactid) + " ;");

	for (fcnt = 0;; fcnt < fileCnt; fcnt++) {
		if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u30C1\u30A7\u30C3\u30AF " + A_billFile[fcnt]);

		if (preg_match("/^IC.*\\.csv$/i", A_billFile[fcnt])) //一括請求合計ファイル
			{
				if (DEBUG_FLG) logging("INFO: \u4E00\u62EC\u8ACB\u6C42\u5408\u8A08\u30D5\u30A1\u30A4\u30EB(\u30B3\u30FC\u30C9\u4ED8)\u306E\u53D6\u8FBC\u307F\u958B\u59CB " + A_billFile[fcnt]);

				if (readICfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
					if (Stop_Error == true) break;
					error_flg = true;
				}
			} else if (preg_match("/^SC.*\\.csv$/i", A_billFile[fcnt])) //回線別請求内訳ファイル
			{
				if (DEBUG_FLG) logging("INFO: \u56DE\u7DDA\u5225\u8ACB\u6C42\u5185\u8A33\u30D5\u30A1\u30A4\u30EB(\u30B3\u30FC\u30C9\u4ED8)\u306E\u53D6\u8FBC\u307F\u958B\u59CB " + A_billFile[fcnt]);

				if (readSCfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) //$Stop_Errorを$Utiwake_Errorに変更、ここではbreakしない 20091208miya
					{
						if (Utiwake_Error == true) //break;
							{
								error_flg = true;
							}
					}
			} else if (preg_match("/^IU.*\\.csv$/i", A_billFile[fcnt])) //コード付データが無いかをチェック
			//コード付データを取込まなかった場合
			{
				var check_flg = 0;
				var check_name = mb_ereg_replace("IU", "IC", A_billFile[fcnt]);

				for (var ffcnt = 0; ffcnt < fileCnt; ffcnt++) {
					if (check_name == A_billFile[ffcnt]) {
						check_flg = 1;
						break;
					}
				}

				if (0 == check_flg) //一括請求合計ファイル
					{
						if (DEBUG_FLG) logging("INFO: \u4E00\u62EC\u8ACB\u6C42\u5408\u8A08\u30D5\u30A1\u30A4\u30EB(\u30B3\u30FC\u30C9\u7121\u3057)\u306E\u53D6\u8FBC\u307F\u958B\u59CB " + A_billFile[fcnt]);

						if (readIUfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
							if (Stop_Error == true) break;
							error_flg = true;
						}
					}
			} else if (preg_match("/^SU.*\\.csv$/i", A_billFile[fcnt])) //コード付データが無いかをチェック
			//コード付データを取込まなかった場合
			{
				check_flg = 0;
				check_name = mb_ereg_replace("SU", "SC", A_billFile[fcnt]);

				for (ffcnt = 0;; ffcnt < fileCnt; ffcnt++) {
					if (check_name == A_billFile[ffcnt]) {
						check_flg = 1;
						break;
					}
				}

				if (0 == check_flg) //回線別請求内訳ファイル
					{
						if (DEBUG_FLG) logging("INFO: \u56DE\u7DDA\u5225\u8ACB\u6C42\u5185\u8A33\u30D5\u30A1\u30A4\u30EB(\u30B3\u30FC\u30C9\u7121\u3057)\u306E\u53D6\u8FBC\u307F\u958B\u59CB " + A_billFile[fcnt]);

						if (readSUfile(dataDirPact + "/" + A_billFile[fcnt], A_pactid[cnt]) == false) {
							if (Stop_Error == true) break;
							error_flg = true;
						}
					}
			}
	}

	if (Stop_Error == true) break;
	if (error_flg == true) continue;

	if (total_sum != total_charge) {
		if (DEBUG_FLG) logging("WARNING: \u5408\u8A08\u91D1\u984D\u304C\u7570\u306A\u308A\u307E\u3059 \u56DE\u7DDA\u5225\u8ACB\u6C42\uFF1A" + total_sum + " \u4E00\u62EC\u8ACB\u6C42\u5408\u8A08\uFF1A" + total_charge);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " pactid=" + pactid + "\u5408\u8A08\u91D1\u984D\u304C\u7570\u306A\u308A\u307E\u3059 \u56DE\u7DDA\u5225\u8ACB\u6C42\uFF1A" + total_sum + " \u4E00\u62EC\u8ACB\u6C42\u5408\u8A08\uFF1A" + total_charge);
		continue;
	} else {
		for (var prt in A_prtelnos) {
			var prcharge = A_prtelnos[prt];
			var amountdata = {
				pactid: A_pactid[cnt],
				carid: 3,
				prtelno: prt,
				charge: prcharge,
				recdate: getTimeStamp()
			};
			O_tab.writeFile(amountdata);
		}

		A_prtelnos = Array();
	}

	if (DEBUG_FLG) logging("INFO: \u5408\u8A08\u91D1\u984D  \u56DE\u7DDA\u5225\u8ACB\u6C42\uFF1A" + total_sum + " \u4E00\u62EC\u8ACB\u6C42\u5408\u8A08\uFF1A" + total_charge);
	fwrite(tel_xx_fp, tel_xx_write_buf);
	fflush(tel_xx_fp);

	if (target == "n") {
		fwrite(tel_fp, tel_write_buf);
		fflush(tel_fp);
	}

	fwrite(teldetail_fp, write_buf);
	fflush(teldetail_fp);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "\u4EF6\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
	logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " pactid=" + A_pactid[cnt] + ` . ${out_rec_cnt}` + "\u4EF6\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fclose(tel_xx_fp);

if (target == "n") {
	fclose(tel_fp);
}

fclose(teldetail_fp);

if (undefined !== utiwake_fp) {
	fclose(utiwake_fp);
}

O_tab.closeFile();

if (Stop_Error == true) {
	throw die(1);
} else if (Utiwake_Error == true) {
	insertUtiwakeCode(utiwake_filename, logh, dbh);

	if (0 < unregistCode.length) //$O_out->put(SCRIPT_FILENAME . "::仮登録の内訳コードがあります\n", MtOutput::LVL_WARN, array("disp" => 1));
		//$O_out->flushMessage();
		//２重起動ロック解除
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "::\u4EEE\u767B\u9332\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u3059\n");
			lock(false, dbh);
		}

	throw die(1);
}

if (fin_cnt < 1) {
	if (DEBUG_FLG) logging("ERROR: \uFF11\u4EF6\u3082\u6210\u529F\u3057\u307E\u305B\u3093\u3067\u3057\u305F");
	throw die(1);
}

if (backup == "y") //TEL_DETAILS_X_TBのバックアップ
	//エクスポート失敗した場合
	{
		var teldetailX_exp = DATA_EXP_DIR + "/" + teldetailX_tb + date("YmdHis") + ".exp";
		var sql_str = "select * from " + teldetailX_tb;
		var rtn = dbh.backup(teldetailX_exp, sql_str);

		if (rtn == false) {
			if (DEBUG_FLG) logging("ERROR: " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + teldetailX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + teldetailX_exp);
			logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F" + teldetailX_exp);
		}
	}

dbh.begin();

if (mode == "o") //対象pactidを１つの文字列に変換
	//TEL_DETAIL_XX_TBの削除
	{
		var pactin = "";

		for (cnt = 0;; cnt < fin_cnt; cnt++) {
			pactin += fin_pact[cnt] + ",";
		}

		pactin = rtrim(pactin, ",");
		dbh.query("delete from " + teldetailX_tb + " where carid = 3 and pactid IN(" + pactin + ");", true);
		if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F " + "delete from " + teldetailX_tb + " where carid = 3 pactid IN(" + pactin + ");");
		logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F");
	}

if (filesize(tel_xx_filename) != 0) //tel_X_tb へインポート
	//インポート失敗した場合
	{
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
		rtn = doCopyInsert(telX_tb, tel_xx_filename, telX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_xx_filename);
			logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_xx_filename);
		}
	}

if (target == "n") {
	if (filesize(tel_filename) != 0) //tel_tb へインポート
		//インポート失敗した場合
		{
			var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
			rtn = doCopyInsert("tel_tb", tel_filename, tel_col, dbh);

			if (rtn != 0) //ロールバック
				{
					if (DEBUG_FLG) logging("ERROR: tel_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
					logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 tel_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
					dbh.rollback();
					throw die(1);
				} else {
				if (DEBUG_FLG) logging("INFO: tel_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_filename);
				logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 tel_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_filename);
			}
		}
}

if (filesize(teldetail_filename) != 0) //tel_details_X_tb へインポート
	//インポート失敗した場合
	{
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "tdcomment", "prtelno"];
		rtn = doCopyInsert(teldetailX_tb, teldetail_filename, teldetailX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + teldetail_filename);
			logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + teldetail_filename);
		}
	}

if (undefined !== utiwake_filename) {
	if (true != insertUtiwakecode(utiwake_filename, logh, dbh)) {
		dbh.rollback();
		throw die(1);
	}
}

if (filesize(O_tab.getFilePath()) != 0) {
	rtn = doCopyInsert(O_tab.getTableName(), O_tab.getFilePath(), O_tab.getAmountColumn(), dbh);

	if (0 != rtn) //ロールバック
		{
			if (DEBUG_FLG) logging("ERROR: " + O_tab.getTableName() + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + O_tab.getTableName() + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			dbh.rollback();
			throw die(1);
		} else {
		if (DEBUG_FLG) logging("INFO: " + O_tab.getTableName() + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + O_tab.getFilePath());
		logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + O_tab.getTableName() + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + O_tab.getFilePath());
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
				logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + finDir);
				throw die(1);
			} else {
				if (DEBUG_FLG) logging("INFO: \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
				logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
			}
		}

	clearstatcache();
	dirh = opendir(dataDir + "/" + fin_pact[cnt]);

	while (copyfileName = readdir(dirh)) {
		if (is_file(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName) == true && (preg_match("/^IU.*\\.csv$/i", copyfileName) == true || preg_match("/^SU.*\\.csv$/i", copyfileName) == true || preg_match("/^IC.*\\.csv$/i", copyfileName) == true || preg_match("/^SC.*\\.csv$/i", copyfileName) == true)) {
			if (rename(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName) == false) {
				if (DEBUG_FLG) logging("ERROR: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				throw die(1);
			} else {
				if (DEBUG_FLG) logging("INFO: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			}
		}

		clearstatcache();
	}

	closedir(dirh);
}

lock(false, dbh);
if (DEBUG_FLG) logging("END: au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(import_aubill.php)\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
logh.putError(G_SCRIPT_END, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
throw die(0);

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

function chkAsp(pactid) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + G_AUTH_ASP;
	var count = dbh.getOne(sql_str);

	if (count == 0) {
		return false;
	} else {
		return true;
	}
};

function readIUfile(infilename, pactid) //対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//20110411
//$inmonth = substr( $readbuff[0], 6, 2);
{
	if (!("logh" in global)) logh = undefined;
	if (!("PACT_result" in global)) PACT_result = undefined;
	if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	if (!("year" in global)) year = undefined;
	if (!("month" in global)) month = undefined;
	if (!("inyear" in global)) inyear = undefined;
	if (!("inmonth" in global)) inmonth = undefined;
	if (!("total_charge" in global)) total_charge = undefined;
	if (!("O_tab" in global)) O_tab = undefined;
	if (!("A_prtelnos" in global)) A_prtelnos = undefined;
	var ifp = fopen(infilename, "r");

	if (ifp == undefined) {
		if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		return false;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
	var line = fgets(ifp);
	line = mb_ereg_replace("\"", "", fgets(ifp));
	line = mb_convert_encoding(line, "UTF-8", "auto");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		fclose(ifp);
		insertClampError(pactid, "\u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059");
		return false;
	}

	O_tab.setPrtelNo(readbuff[1]);

	if (!(undefined !== A_prtelnos[readbuff[1]])) {
		A_prtelnos[readbuff[1]] = 0;
	}

	inyear = readbuff[0].replace(/[^0-9]/g, "").substr(0, 4);
	inmonth = readbuff[0].replace(/[^0-9]/g, "").substr(4, 2);

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		fclose(ifp);
		return false;
	}

	do //2009.07.16 UPDATE 上杉顕一郎
	//文字コード変換
	//UPDATE-END
	{
		line = mb_convert_encoding(line, "UTF-8", "auto");
		readbuff = chop(line).split(",");

		if (mb_ereg_replace("\u3000+$", "", readbuff[2]) == "\uFF1C\u5408\u3000\u8A08\uFF1E") //UPDATE 2005/12/12	kenichiro uesugi
			{
				total_charge = total_charge + readbuff[3];
				A_prtelnos[readbuff[1]] += readbuff[3];
			}
	} while (line = mb_ereg_replace("\"", "", fgets(ifp)));

	fclose(ifp);
	return true;
};

function readSUfile(infilename, pactid) //対象ファイルオープン
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
	if (!("logh" in global)) logh = undefined;
	if (!("asp_bill" in global)) asp_bill = undefined;
	if (!("asp_tax" in global)) asp_tax = undefined;
	if (!("target" in global)) target = undefined;
	if (!("PACT_result" in global)) PACT_result = undefined;
	if (!("au_utiwake" in global)) au_utiwake = undefined;
	if (!("TEL_result" in global)) TEL_result = undefined;
	if (!("TEL_now_result" in global)) TEL_now_result = undefined;
	if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	if (!("year" in global)) year = undefined;
	if (!("month" in global)) month = undefined;
	if (!("inyear" in global)) inyear = undefined;
	if (!("inmonth" in global)) inmonth = undefined;
	if (!("trg_post" in global)) trg_post = undefined;
	if (!("aspFlg" in global)) aspFlg = undefined;
	if (!("tel_xx_write_buf" in global)) tel_xx_write_buf = undefined;
	if (!("tel_write_buf" in global)) tel_write_buf = undefined;
	if (!("write_buf" in global)) write_buf = undefined;
	if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	if (!("total_sum" in global)) total_sum = undefined;
	if (!("Stop_Error" in global)) Stop_Error = undefined;
	if (!("O_tab" in global)) O_tab = undefined;
	if (!("A_prtelnos" in global)) A_prtelnos = undefined;
	var ifp = fopen(infilename, "r");

	if (ifp == undefined) {
		if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		return false;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
	var line = fgets(ifp);
	line = mb_ereg_replace("\"", "", fgets(ifp));
	line = mb_convert_encoding(line, "UTF-8", "auto");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		fclose(ifp);
		insertClampError(pactid, "\u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059");
		return false;
	}

	O_tab.setPrtelNo(readbuff[1]);

	if (!(undefined !== A_prtelnos[readbuff[1]])) {
		A_prtelnos[readbuff[1]] = 0;
	}

	inyear = readbuff[0].replace(/[^0-9]/g, "").substr(0, 4);
	inmonth = readbuff[0].replace(/[^0-9]/g, "").substr(4, 2);

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		fclose(ifp);
		return false;
	}

	var nowtime = getTimestamp();
	var copy_buf = "";
	var viewcnt = 1;
	var old_telno = "";

	do //2009.07.16 UPDATE 上杉顕一郎
	//文字コード変換
	//UPDATE-END
	//新規番号
	//UPDATE START 20071113 k.uesugi 空文字の場合は、全角スペースに置き換える
	//UPDATE END
	//20110411
	//合計を計算
	{
		out_rec_cnt++;
		line = mb_convert_encoding(line, "UTF-8", "auto");
		readbuff = chop(line).split(",");

		if (old_telno != readbuff[2]) //tel_XX_tbの存在チェック
			{
				if (-1 !== TEL_result.indexOf(readbuff[2]) == false) //エリアコードと種別コードにデフォルト値をセット
					//ハイフン付の電話番号作成
					//tel_tbの存在チェック
					{
						var area = "39";
						var circuit = "10";
						var telno_view = readbuff[2];

						if (preg_match("/^0[789]0/", telno_view) && telno_view.length >= 11) //070, 080, 090 のいずれかで始まっていたら"-"を入れ込む
							{
								telno_view = telno_view.substr(0, 3) + "-" + telno_view.substr(3, 4) + "-" + telno_view.substr(7);
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
						copy_buf += pactid + "\t" + old_telno + "\t" + G_CODE_ASP + "\t" + "ASP\u4F7F\u7528\u6599" + "\t" + asp_bill + "\t\t" + viewcnt + "\t" + nowtime + "\t3\t\n";
						viewcnt++;
						copy_buf += pactid + "\t" + old_telno + "\t" + G_CODE_ASX + "\t" + "ASP\u4F7F\u7528\u6599\u6D88\u8CBB\u7A0E" + "\t" + asp_tax + "\t\t" + viewcnt + "\t" + nowtime + "\t3\t\n";
					}

				if (copy_buf != "") {
					write_buf += copy_buf;
				}

				copy_buf = "";
				viewcnt = 1;
			}

		var code_name = mb_ereg_replace("\u3000+$", "", readbuff[4]);

		if (code_name == "") {
			code_name = "\u3000";
		}

		code_name = mb_ereg_replace("(^\"+|\"+$)", "", code_name);
		var codenum = array_search(code_name, au_utiwake.name);

		if (codenum == false) {
			if (DEBUG_FLG) logging("ERROR: \u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u8ACB\u6C42\u5185\u8A33\u6587\u5B57\u304C\u767A\u898B\u3055\u308C\u307E\u3057\u305F " + code_name);
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u8ACB\u6C42\u5185\u8A33\u6587\u5B57\u304C\u767A\u898B\u3055\u308C\u307E\u3057\u305F " + code_name);
			Stop_Error = true;
			fclose(ifp);
			return false;
		}

		var prtelno = undefined;

		if (au_utiwake.codetype[codenum] == 0) {
			total_sum += +readbuff[5];
			prtelno = readbuff[1];
		}

		if (readbuff[4] != "") //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
			{
				var taxkubun = mb_ereg_replace("\u3000+$", "", readbuff[6]);
				var comment = mb_ereg_replace("\u3000+$", "", readbuff[7]);
				comment = mb_ereg_replace("(^\"+|\"+$)", "", comment);
				copy_buf += pactid + "\t" + readbuff[2] + "\t" + codenum + "\t" + code_name + "\t" + readbuff[5] + "\t" + taxkubun + "\t" + viewcnt + "\t" + nowtime + "\t" + "3" + "\t" + comment + "\t" + prtelno + "\n";
				viewcnt++;
			}

		old_telno = readbuff[2];
	} while (line = mb_ereg_replace("\"", "", fgets(ifp)));

	if (aspFlg == true) //合計行のために１つ表示順を空ける
		{
			viewcnt++;
			copy_buf += pactid + "\t" + readbuff[2] + "\t" + G_CODE_ASP + "\t" + "ASP\u4F7F\u7528\u6599" + "\t" + asp_bill + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
			viewcnt++;
			copy_buf += pactid + "\t" + readbuff[2] + "\t" + G_CODE_ASX + "\t" + "ASP\u4F7F\u7528\u6599\u6D88\u8CBB\u7A0E" + "\t" + asp_tax + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
		}

	if (copy_buf != "") {
		write_buf += copy_buf;
	}

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

function readICfile(infilename, pactid) //対象ファイルオープン
//2009.07.16 UPDATE 上杉顕一郎
//文字コード変換
//UPDATE-END
//パラメータとファイルの内容に差異がないかチェック
//請求先コード(au)から対象企業に間違いがないかをチェック
//20110411
//$inmonth = substr( $readbuff[0], 6, 2);
{
	if (!("logh" in global)) logh = undefined;
	if (!("PACT_result" in global)) PACT_result = undefined;
	if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	if (!("year" in global)) year = undefined;
	if (!("month" in global)) month = undefined;
	if (!("inyear" in global)) inyear = undefined;
	if (!("inmonth" in global)) inmonth = undefined;
	if (!("total_charge" in global)) total_charge = undefined;
	if (!("O_tab" in global)) O_tab = undefined;
	if (!("A_prtelnos" in global)) A_prtelnos = undefined;
	var ifp = fopen(infilename, "r");

	if (ifp == undefined) {
		if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		return false;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
	var line = fgets(ifp);
	line = mb_ereg_replace("\"", "", fgets(ifp));
	line = mb_convert_encoding(line, "UTF-8", "auto");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		fclose(ifp);
		insertClampError(pactid, "\u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059");
		return false;
	}

	O_tab.setPrtelNo(readbuff[1]);

	if (!(undefined !== A_prtelnos[readbuff[1]])) {
		A_prtelnos[readbuff[1]] = 0;
	}

	inyear = readbuff[0].replace(/[^0-9]/g, "").substr(0, 4);
	inmonth = readbuff[0].replace(/[^0-9]/g, "").substr(4, 2);

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		fclose(ifp);
		return false;
	}

	do //2009.07.16 UPDATE 上杉顕一郎
	//文字コード変換
	//UPDATE-END
	{
		line = mb_convert_encoding(line, "UTF-8", "auto");
		readbuff = chop(line).split(",");

		if (mb_ereg_replace("\u3000+$", "", readbuff[6]) == "1" && mb_ereg_replace("\u3000+$", "", readbuff[7]) == "C50000") {
			total_charge = total_charge + readbuff[3];
			A_prtelnos[readbuff[1]] += readbuff[3];
		}
	} while (line = mb_ereg_replace("\"", "", fgets(ifp)));

	fclose(ifp);
	return true;
};

function readSCfile(infilename, pactid) //内訳コードのエラー 20091208miya
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
	if (!("logh" in global)) logh = undefined;
	if (!("asp_bill" in global)) asp_bill = undefined;
	if (!("asp_tax" in global)) asp_tax = undefined;
	if (!("target" in global)) target = undefined;
	if (!("PACT_result" in global)) PACT_result = undefined;
	if (!("au_utiwakecode" in global)) au_utiwakecode = undefined;
	if (!("TEL_result" in global)) TEL_result = undefined;
	if (!("TEL_now_result" in global)) TEL_now_result = undefined;
	if (!("PrTEL_result" in global)) PrTEL_result = undefined;
	if (!("year" in global)) year = undefined;
	if (!("month" in global)) month = undefined;
	if (!("inyear" in global)) inyear = undefined;
	if (!("inmonth" in global)) inmonth = undefined;
	if (!("trg_post" in global)) trg_post = undefined;
	if (!("aspFlg" in global)) aspFlg = undefined;
	if (!("tel_xx_write_buf" in global)) tel_xx_write_buf = undefined;
	if (!("tel_write_buf" in global)) tel_write_buf = undefined;
	if (!("write_buf" in global)) write_buf = undefined;
	if (!("out_rec_cnt" in global)) out_rec_cnt = undefined;
	if (!("total_sum" in global)) total_sum = undefined;
	if (!("Stop_Error" in global)) Stop_Error = undefined;
	if (!("Utiwake_Error" in global)) Utiwake_Error = undefined;
	if (!("A_checked_code" in global)) A_checked_code = undefined;
	if (!("A_unregist_code" in global)) A_unregist_code = undefined;
	if (!("O_tab" in global)) O_tab = undefined;
	if (!("utiwake_fp" in global)) utiwake_fp = undefined;
	if (!("unregistCode" in global)) unregistCode = undefined;
	if (!("A_prtelnos" in global)) A_prtelnos = undefined;
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

	var ifp = fopen(infilename, "r");

	if (ifp == undefined) {
		if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
		return false;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
	var line = fgets(ifp);
	line = mb_ereg_replace("\"", "", fgets(ifp));
	line = mb_convert_encoding(line, "UTF-8", "auto");
	var readbuff = line.split(",");

	if (-1 !== PrTEL_result.indexOf(readbuff[1]) == false) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059 " + readbuff[1]);
		fclose(ifp);
		insertClampError(pactid, "\u8ACB\u6C42\u5148\u30B3\u30FC\u30C9(au)\u304C\u7570\u306A\u308A\u307E\u3059");
		return false;
	}

	O_tab.setPrtelNo(readbuff[1]);

	if (!(undefined !== A_prtelnos[readbuff[1]])) {
		A_prtelnos[readbuff[1]] = 0;
	}

	inyear = readbuff[0].replace(/[^0-9]/g, "").substr(0, 4);
	inmonth = readbuff[0].replace(/[^0-9]/g, "").substr(4, 2);

	if (inyear != year || inmonth != month) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
		fclose(ifp);
		return false;
	}

	var nowtime = getTimestamp();
	var copy_buf = "";
	var viewcnt = 1;
	var old_telno = "";

	do //2009.07.16 UPDATE 上杉顕一郎
	//文字コード変換
	//UPDATE-END
	//AUの請求読み込みがエラーになる問題。mb_ereg_replaceで"が削除出来てない時がある。
	//UTF-8変換後に"の削除を行う。update 20150909伊達
	//update end 20150909 伊達
	//新規番号
	//20110411
	//合計を計算
	{
		out_rec_cnt++;
		line = mb_convert_encoding(line, "UTF-8", "auto");
		line = str_replace("\"", "", line);
		readbuff = chop(line).split(",");

		if (old_telno != readbuff[2]) //tel_XX_tbの存在チェック
			{
				if (-1 !== TEL_result.indexOf(readbuff[2]) == false) //エリアコードと種別コードにデフォルト値をセット
					//ハイフン付の電話番号作成
					//tel_tbの存在チェック
					{
						var area = "39";
						var circuit = "10";
						var telno_view = readbuff[2];

						if (preg_match("/^0[789]0/", telno_view) && telno_view.length >= 11) //070, 080, 090 のいずれかで始まっていたら"-"を入れ込む
							{
								telno_view = telno_view.substr(0, 3) + "-" + telno_view.substr(3, 4) + "-" + telno_view.substr(7);
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
						copy_buf += pactid + "\t" + old_telno + "\t" + G_CODE_ASP + "\t" + "ASP\u4F7F\u7528\u6599" + "\t" + asp_bill + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
						viewcnt++;
						copy_buf += pactid + "\t" + old_telno + "\t" + G_CODE_ASX + "\t" + "ASP\u4F7F\u7528\u6599\u6D88\u8CBB\u7A0E" + "\t" + asp_tax + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
					}

				if (copy_buf != "") {
					write_buf += copy_buf;
				}

				copy_buf = "";
				viewcnt = 1;
			}

		if (!(undefined !== au_utiwakecode[readbuff[9]])) {
			if (DEBUG_FLG) logging("ERROR: \u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u8ACB\u6C42\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u767A\u898B\u3055\u308C\u307E\u3057\u305F " + readbuff[9] + "-" + readbuff[2]);

			if (false == (-1 !== A_checked_code.indexOf(readbuff[9]))) //20110511
				{
					A_checked_code.push(readbuff[9]);
					logh.putError(G_SCRIPT_WARNING, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + pactid + " \u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u8ACB\u6C42\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u767A\u898B\u3055\u308C\u307E\u3057\u305F " + readbuff[9] + "-" + readbuff[2]);
					fwrite(utiwake_fp, readbuff[9] + "\t" + readbuff[4] + "\t" + H_taxtype[readbuff[10].trim()] + "\t" + "6\t" + "4\t" + "3\t" + nowtime + "\t" + nowtime + "\n");
					unregistCode.push([readbuff[9] + "-" + readbuff[2], "unregist", pactid, 3]);
					Utiwake_Error = true;
				}
		} else if ("4" == au_utiwakecode[readbuff[9]]) {
			if (false == (-1 !== A_unregist_code.indexOf(readbuff[9]))) {
				A_unregist_code.push(readbuff[9]);
				if (DEBUG_FLG) logging("ERROR: \u5185\u8A33\u30B3\u30FC\u30C9\uFF1A" + readbuff[2] + "\u306Ecodetype\u304C\u4EEE\u767B\u9332\u306E\u307E\u307E\u3067\u3059");
				unregistCode.push([readbuff[9] + "-" + readbuff[2], "interim", pactid, 3]);
				unregistCode.push([readbuff[9] + "-" + readbuff[2], "unregist", pactid, 3]);
				Utiwake_Error = true;
			}
		}

		var prtelno = undefined;

		if (1 == readbuff[8] && "C50000" != readbuff[9]) {
			total_sum += +readbuff[5];
			prtelno = readbuff[1];
		} else if ("C50000" == readbuff[9]) {
			prtelno = readbuff[1];
		}

		if (readbuff[4] != "") //前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
			//前後のダブルクォーテーションを除去	 UPDATE 2009-09-10 k.uesugi
			{
				var code_name = mb_ereg_replace("\u3000+$", "", readbuff[4]);
				code_name = mb_ereg_replace("(^\"+|\"+$)", "", code_name);
				var taxkubun = mb_ereg_replace("\u3000+$", "", readbuff[6]);
				var comment = mb_ereg_replace("\u3000+$", "", readbuff[7]);
				comment = mb_ereg_replace("(^\"+|\"+$)", "", comment);
				copy_buf += pactid + "\t" + readbuff[2] + "\t" + readbuff[9] + "\t" + code_name + "\t" + readbuff[5] + "\t" + taxkubun + "\t" + viewcnt + "\t" + nowtime + "\t" + "3" + "\t" + comment + "\t" + prtelno + "\n";
				viewcnt++;
			}

		old_telno = readbuff[2];
	} while (line = mb_ereg_replace("\"", "", fgets(ifp)));

	if (aspFlg == true) //合計行のために１つ表示順を空ける
		{
			viewcnt++;
			copy_buf += pactid + "\t" + readbuff[2] + "\t" + G_CODE_ASP + "\t" + "ASP\u4F7F\u7528\u6599" + "\t" + asp_bill + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
			viewcnt++;
			copy_buf += pactid + "\t" + readbuff[2] + "\t" + G_CODE_ASX + "\t" + "ASP\u4F7F\u7528\u6599\u6D88\u8CBB\u7A0E" + "\t" + asp_tax + "\t" + "\t" + viewcnt + "\t" + nowtime + "\t" + "3\t" + "\t" + "\n";
		}

	if (copy_buf != "") {
		write_buf += copy_buf;
	}

	fclose(ifp);
	return true;
};

function insertClampError(pactid, message) {
	if (!("dbh" in global)) dbh = undefined;
	var sql = "insert into clamp_error_tb" + "(pactid,carid,error_type,message,is_send,recdate,fixdate)" + "values" + "(" + pactid + "," + 3 + ",'prtelno'" + ",'" + message + "'" + ",false" + ",'" + date("Y/m/d H:i:s") + "'" + ",'" + date("Y/m/d H:i:s") + "'" + ")" + ";";
	dbh.query(sql);
	return true;
};

function insertUtiwakeCode(utiwake_filename, logh, dbh) {
	if (0 != filesize(utiwake_filename)) {
		var utiwake_col = ["code", "name", "taxtype", "kamoku", "codetype", "carid", "fixdate", "recdate"];
		var rtn = doCopyInsert("utiwake_tb", utiwake_filename, utiwake_col, dbh);

		if (0 != rtn) {
			if (DEBUG_FLG) logging("ERROR: utiwake_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 utiwake_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			return false;
		} else {
			if (DEBUG_FLG) logging("INFO: utiwake_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + utiwake_filename);
			logh.putError(G_SCRIPT_INFO, "import_aubill.php au\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 utiwake_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + utiwake_filename);
		}
	}

	return true;
};