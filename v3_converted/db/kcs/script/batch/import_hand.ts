#!/usr/local/bin/php
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//$log_listener_type =& new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
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
//２重起動防止ロックをかける 既に起動中は強制終了
//テーブル名設定
//会社毎の処理
//COPY文ファイルCLOSE
//一件も成功していない場合は、ここで終了
//上書きモードの場合、対象年月・対象契約IDのデータを削除
//完了したファイルをFINディレクトリに移動
//２重起動ロック解除
//終了
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
//[返り値] 終了コード　1（失敗）
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
//現在の日付を返す
//DBに書き込む現在日時に使用する
//
//ImportHand{
//
//@package
//@author web
//@since 2018/07/06
//
echo("\n");
error_reporting(E_ALL);
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_hand.php";
const HAND_DIR = "/hand";

require("lib/script_common.php");

require(BAT_DIR + "/lib/script_db.php");

require(BAT_DIR + "/lib/script_log.php");

var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
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

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
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

logh.putError(G_SCRIPT_BEGIN, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
var dataDir = DATA_DIR + "/" + year + month + HAND_DIR;

if (pactid == "all") {
	if (is_dir(dataDir) == false) //エラー終了
		{
			logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die(1);
		}
} else {
	if (is_dir(dataDir + "/" + pactid) == false) //エラー終了
		{
			logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "/" + pactid + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die(1);
		}
}

clearstatcache();

if (pactid == "all") {
	var LocalLogFile = dataDir + "/importhand.log";
} else {
	LocalLogFile = dataDir + "/" + pactid + "/importhand.log";
}

if (DEBUG_FLG) logging("START: \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(import_hand.php)\u3092\u958B\u59CB\u3057\u307E\u3059");
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
		logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093");
		throw die(1);
	}

var ini_carrier = parse_ini_file(KCS_DIR + "/conf_sync/import_hand_carrier.ini", true);

if (lock(true, dbh) == false) {
	if (DEBUG_FLG) logging("ERROR: \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u30591");
	logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u30592");
	throw die(1);
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var telX_tb = "tel_" + tableNo + "_tb";
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C6\u30FC\u30D6\u30EB " + telX_tb + " & " + teldetailX_tb);
var tel_xx_filename = dataDir + "/" + telX_tb + year + month + pactid + ".ins";
var tel_xx_fp = fopen(tel_xx_filename, "w");

if (tel_xx_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + tel_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + tel_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: tel_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + tel_xx_filename);

if (target == "n") {
	var tel_filename = dataDir + "/tel_tb" + year + month + pactid + ".ins";
	var tel_fp = fopen(tel_filename, "w");

	if (tel_fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + tel_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + tel_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		throw die(1);
	}

	if (DEBUG_FLG) logging("INFO: tel_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + tel_filename);
}

var teldetail_filename = dataDir + "/" + teldetailX_tb + year + month + pactid + ".ins";
var teldetail_fp = fopen(teldetail_filename, "w");

if (teldetail_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + teldetail_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetail_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: tel_details_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + teldetail_filename);
var SOUMU_result = dbh.getHash("select telno6, arid, carid from soumu_tel_tb;", true);
var soumu_cnt = SOUMU_result.length;

for (cnt = 0;; cnt < soumu_cnt; cnt++) {
	soumu_tbl[SOUMU_result[cnt].telno6][0] = SOUMU_result[cnt].arid;
	soumu_tbl[SOUMU_result[cnt].telno6][1] = SOUMU_result[cnt].carid;
}

if (DEBUG_FLG) logging("INFO: \u7DCF\u52D9\u7701\u306E\u30C7\u30FC\u30BF\u53D6\u5F97 " + "select telno6, arid, carid from soumu_tel_tb;");
var import_hand = new ImportHand(dbh);
var fin_cnt = 0;

for (cnt = 0;; cnt < pactCnt; cnt++) //対象会社の会社名を取得
//請求データファイル名を取得する
//処理する請求データファイル名配列
//請求データファイルがなかった場合
//会社単位に終了ログを出力
{
	var out_rec_cnt = 0;
	var error_flg = false;
	var write_buf = "";
	var tel_xx_write_buf = "";
	var tel_write_buf = "";
	var PACT_result = dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) logging("WARNING:  \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_WARNING, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u4F1A\u793E\u540D\u3092\u53D6\u5F97 " + PACT_result);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	logh.putError(G_SCRIPT_INFO, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	var A_billFile = Array();
	var dataDirPact = dataDir + "/" + A_pactid[cnt];
	dirh = opendir(dataDirPact);

	while (fileName = readdir(dirh)) {
		if (is_file(dataDirPact + "/" + fileName) == true && preg_match("/\\.csv$/i", fileName) == true) {
			A_billFile.push(fileName);
			if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u540D " + fileName);
		}

		clearstatcache();
	}

	closedir(dirh);
	var fileCnt = A_billFile.length;

	if (fileCnt == 0) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\uFF08" + dataDirPact + "\uFF09");
		logh.putError(G_SCRIPT_WARNING, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\uFF08" + dataDirPact + "\uFF09");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u6570 " + fileCnt);
	var TEL_result = dbh.getHash("select telno,carid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u767B\u9332\u96FB\u8A71\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + TEL_result.length + "\u4EF6 select telno,carid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");

	if (target == "n") //$TEL_now_result = $dbh->getCol("select telno from tel_tb where pactid = " . $dbh->escape($A_pactid[$cnt]) . " ;" , true);
		//if(DEBUG_FLG) logging( "INFO: 最新の登録電話のリストを取得 " . count($TEL_now_result) . "件 select telno,carid from tel_tb where pactid = " . $dbh->escape($A_pactid[$cnt]) . " ;" );
		//キャリアIDを見ていなかったので修正 20071009miya
		{
			var TEL_now_result = dbh.getHash("select telno,carid from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
			if (DEBUG_FLG) logging("INFO: \u6700\u65B0\u306E\u767B\u9332\u96FB\u8A71\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + TEL_now_result.length + "\u4EF6 select telno,carid from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		}

	var trg_post = dbh.getOne("select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;", true);

	if (trg_post == "") {
		if (DEBUG_FLG) logging("WARNING: \u30EB\u30FC\u30C8\u90E8\u7F72\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
		logh.putError(G_SCRIPT_WARNING, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u30EB\u30FC\u30C8\u90E8\u7F72\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u30EB\u30FC\u30C8\u90E8\u7F72\u306Epostid\u53D6\u5F97 postid=" + trg_post + " select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
	var aspFlg = false;

	if (chkAsp(dbh.escape(A_pactid[cnt])) == true) {
		aspFlg = true;
		if (DEBUG_FLG) logging("INFO: ASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u304C\uFF2F\uFF2E");
		var asp_charge = dbh.getHash("select carid, charge from asp_charge_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
		var asp_charge_cnt = asp_charge.length;

		for (var acnt = 0; acnt < asp_charge_cnt; acnt++) {
			asp_tbl[asp_charge[acnt].carid] = asp_charge[acnt].charge;
			if (DEBUG_FLG) logging("INFO: ASP\u5229\u7528\u6599 " + asp_charge[acnt].carid + "=" + asp_charge[acnt].charge);
		}

		if (DEBUG_FLG) logging("INFO: ASP\u4F7F\u7528\u6599\u53D6\u5F97");
	}

	var H_dummy_tel = dbh.getHash("SELECT telno, carid FROM dummy_tel_tb WHERE pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	if (DEBUG_FLG) logging("INFO: \u30C0\u30DF\u30FC\u96FB\u8A71\u756A\u53F7\u53D6\u5F97");

	for (var fcnt = 0; fcnt < fileCnt; fcnt++) //対象ファイルオープン
	//パラメータとファイルの内容に差異がないかチェック
	//PACTIDチェック
	//現在の日付を得る
	//レコード毎の処理
	{
		var infilename = dataDirPact + "/" + A_billFile[fcnt];
		var ifp = fopen(infilename, "r");

		if (ifp == undefined) {
			if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
			error_flg = true;
			break;
		}

		if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
		var line = fgets(ifp);
		var readbuff = line.split("\t");

		if (readbuff[0] != A_pactid[cnt]) {
			if (DEBUG_FLG) logging("WARNING: \u5951\u7D04ID\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u5951\u7D04ID\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
			error_flg = true;
			break;
		}

		var inyear = readbuff[1].substr(0, 4);
		var inmonth = readbuff[1].substr(5, 2);

		if (inyear != year || inmonth != month) {
			if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
			error_flg = true;
			break;
		}

		var nowtime = getTimestamp();

		do //2007/12/05 chopから修正 by T.Naka
		//tel_XX_tbの存在チェック
		//このin_arrayだと処理が重すぎるので、TEL_result[carid][telno]とかにしたほうがいいかもしれない
		//キャリアの内訳コード初期化する
		//tel_detaols_XX_tbのCOPY文出力
		//ASP利用料がONの場合
		{
			out_rec_cnt++;
			readbuff = rtrim(line, "\r\n").split("\t");
			var H_needle = Array();
			H_needle.telno = readbuff[3];
			H_needle.carid = readbuff[2];

			if (-1 !== TEL_result.indexOf(H_needle) == false) //エリアコードと種別コードにデフォルト値をセット
				{
					if (undefined !== ini_carrier[readbuff[2]]) //iniに設定されているキャリア情報を取得する
						//総務省のデータと比較
						//tel_tbの存在チェック
						{
							var temp = ini_carrier[readbuff[2]];
							var area = temp.area;

							if (undefined !== temp.circuit070) {
								var circuit = readbuff[3].substr(0, 3) == "070" ? temp.circuit070 : temp.circuit;
							} else {
								circuit = temp.circuit;
							}

							if (undefined !== soumu_tbl[readbuff[3].substr(0, 6)] == true) {
								if (readbuff[2] == soumu_tbl[readbuff[3].substr(0, 6)][1]) //入力データとキャリアが同じ場合は総務省のデータからエリアコードを取得
									{
										area = soumu_tbl[readbuff[3].substr(0, 6)][0];
									}
							}

							var telno_view = readbuff[3];

							if (preg_match("/^0[789]0/", telno_view) && telno_view.length >= 11) //070, 080, 090 のいずれかで始まっていたら"-"を入れ込む
								{
									telno_view = telno_view.substr(0, 3) + "-" + telno_view.substr(3, 4) + "-" + telno_view.substr(7);
								}

							var copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + readbuff[2] + "\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";
							tel_xx_write_buf += copy_buf;

							if (target == "n") {
								if (-1 !== TEL_now_result.indexOf(H_needle) == false) //存在チェックの条件にcarid（$readbuff[2]も追加）20071009miya
									{
										copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + readbuff[2] + "\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";
										tel_write_buf += copy_buf;
									}
							}
						} else //未設定のキャリアIDの場合・・
						{
							if (DEBUG_FLG) {
								logging("WARNING: \u4E88\u5B9A\u5916\u306E\u30AD\u30E3\u30EA\u30A2\u30B3\u30FC\u30C9\u3067\u3059(" + H_needle.carid + ")" + " \"" + KCS_DIR + "/conf_sync/import_hand_carrier.ini\"\u306B\u8A2D\u5B9A\u3092\u8FFD\u52A0\u3057\u3066\u304F\u3060\u3055\u3044 " + infilename);
							}

							logh.putError(G_SCRIPT_WARNING, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u4E88\u5B9A\u5916\u306E\u30AD\u30E3\u30EA\u30A2\u30B3\u30FC\u30C9\u3067\u3059 " + infilename);
							error_flg = true;
						}
				}

			var H_hand_kamoku = {
				h_basic: "\u57FA\u672C\u6599\u8A08",
				h_disbasic: "\u57FA\u672C\u6599\u5272\u5F15",
				h_packetfix: "\u30D1\u30B1\u30C3\u30C8\u5B9A\u984D\u6599",
				h_talk_normal: "\u901A\u8A71\u6599 \u56FD\u5185\u97F3\u58F0\u901A\u8A71",
				h_talk_inter: "\u901A\u8A71\u6599 \u56FD\u969B\u901A\u8A71",
				h_talk_other: "\u901A\u8A71\u6599 \u305D\u306E\u4ED6",
				h_distalk: "\u901A\u8A71\u6599\u5272\u5F15",
				h_com_mode: "\u901A\u4FE1\u6599 \u30D1\u30B1\u30C3\u30C8\u30B5\u30FC\u30D3\u30B9",
				h_com_browse: "\u901A\u4FE1\u6599 \u30D6\u30E9\u30A6\u30B8\u30F3\u30B0",
				h_com_other: "\u901A\u4FE1\u6599 \u4E00\u822C\u30D1\u30B1\u30C3\u30C8\u901A\u4FE1",
				h_com_inter: "\u901A\u4FE1\u6599 \u56FD\u969B\u30D1\u30B1\u30C3\u30C8\u901A\u4FE1",
				h_com_digi: "\u901A\u4FE1\u6599 \u30C7\u30B8\u30BF\u30EB\u901A\u4FE1(64K)",
				h_com_interdigi: "\u901A\u4FE1\u6599 \u56FD\u969B\u30C7\u30B8\u30BF\u30EB\u901A\u4FE1",
				h_discom: "\u901A\u4FE1\u6599\u5272\u5F15",
				h_free: "\u7121\u6599\u901A\u8A71\u30FB\u901A\u4FE1",
				h_other: "\u305D\u306E\u4ED6\u8A08",
				h_tax: "\u6D88\u8CBB\u7A0E\u8A08"
			};
			var carid = readbuff[2];
			import_hand.initializeCarrier(carid, H_hand_kamoku);
			var viewcnt = 1;
			copy_buf = "";
			var idx = 4;

			for (var h_code in H_hand_kamoku) {
				var h_name = H_hand_kamoku[h_code];

				if (readbuff[idx] != "") {
					var tax_kubun = import_hand.getTaxKubun(carid, h_code);
					copy_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + h_code + "\t" + h_name + "\t" + readbuff[idx] + "\t" + viewcnt + "\t" + nowtime + "\t" + readbuff[2] + "\t" + tax_kubun + "\n";
					viewcnt++;
				}

				idx++;
			}

			if (aspFlg == true) //ASP使用料を調べる
				//合計行のために１つ表示順を空ける
				{
					if (undefined !== asp_tbl[readbuff[2]] == true) //ダミー電話番号のときはASP使用料をカウントしない（0にする）ように分岐を追加 20071009miya
						{
							var H_tel = Array();
							H_tel.telno = readbuff[3];
							H_tel.carid = readbuff[2];
							var asp_is_counted = true;

							if (-1 !== H_dummy_tel.indexOf(H_tel) == true) {
								var asp_bill = 0;
								var asp_tax = 0;
								asp_is_counted = false;
								if (DEBUG_FLG) logging("INFO: \u30C0\u30DF\u30FC\u96FB\u8A71\u756A\u53F7\u306B\u3064\u304DASP\u4F7F\u7528\u6599\u30AB\u30A6\u30F3\u30C8\u305B\u305A pactid=" + A_pactid[cnt] + " carid=" + readbuff[2] + " telno=" + readbuff[3]);
							} else {
								asp_bill = asp_tbl[readbuff[2]];
								asp_tax = +(asp_bill * G_EXCISE_RATE);
							}
						} else {
						if (DEBUG_FLG) {
							logging("WARNING: ASP\u4F7F\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 " + infilename);
						}

						logh.putError(G_SCRIPT_WARNING, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " ASP\u4F7F\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 " + infilename);
						error_flg = true;
						area = 0;
						circuit = 0;
						break;
					}

					if (asp_is_counted == true) {
						tax_kubun = import_hand.getTaxKubun(carid, "ASP");
						viewcnt++;
						copy_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\t" + "ASP\u4F7F\u7528\u6599" + "\t" + asp_bill + "\t" + viewcnt + "\t" + nowtime + "\t" + readbuff[2] + "\t" + tax_kubun + "\n";
						tax_kubun = import_hand.getTaxKubun(carid, "ASX");
						viewcnt++;
						copy_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASX + "\t" + "ASP\u4F7F\u7528\u6599\u6D88\u8CBB\u7A0E" + "\t" + asp_tax + "\t" + viewcnt + "\t" + nowtime + "\t" + readbuff[2] + "\t" + tax_kubun + "\n";
					}
				}

			if (copy_buf != "") {
				write_buf += copy_buf;
			}
		} while (line = fgets(ifp));
	}

	if (ifp == undefined) {
		fclose(ifp);
	}

	if (error_flg == true) {
		continue;
	}

	fwrite(tel_xx_fp, tel_xx_write_buf);
	fflush(tel_xx_fp);

	if (target == "n") {
		fwrite(tel_fp, tel_write_buf);
		fflush(tel_fp);
	}

	fwrite(teldetail_fp, write_buf);
	fflush(teldetail_fp);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "\u4EF6\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
	logh.putError(G_SCRIPT_INFO, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "\u4EF6\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fclose(tel_xx_fp);

if (target == "n") {
	fclose(tel_fp);
}

fclose(teldetail_fp);

if (fin_cnt < 1) //２重起動ロック解除
	{
		lock(false, dbh);
		if (DEBUG_FLG) logging("ERROR: \uFF11\u4EF6\u3082\u6210\u529F\u3057\u307E\u305B\u3093\u3067\u3057\u305F");
		logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \uFF11\u4EF6\u3082\u6210\u529F\u3057\u307E\u305B\u3093\u3067\u3057\u305F");
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
			logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + teldetailX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + teldetailX_exp);
			logh.putError(G_SCRIPT_INFO, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F" + teldetailX_exp);
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
		dbh.query("delete from " + teldetailX_tb + " where pactid IN(" + pactin + ");", true);
		if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F " + "delete from" + teldetailX_tb + " where pactid IN(" + pactin + ");");
		logh.putError(G_SCRIPT_INFO, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F" + teldetailX_tb);
	}

if (filesize(tel_xx_filename) != 0) //tel_X_tb へインポート
	//インポート失敗した場合
	{
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
		rtn = doCopyInsert(telX_tb, tel_xx_filename, telX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_xx_filename);
			logh.putError(G_SCRIPT_INFO, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_xx_filename);
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
					if (DEBUG_FLG) logging("ERROR: TEL_TB\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
					logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 TEL_TB\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
					dbh.rollback();
					throw die(1);
				} else {
				if (DEBUG_FLG) logging("INFO: TEL_TB\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_filename);
				logh.putError(G_SCRIPT_INFO, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 TEL_TB\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_filename);
			}
		}
}

if (filesize(teldetail_filename) != 0) //tel_details_X_tb へインポート
	//インポート失敗した場合
	{
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "detailno", "recdate", "carid", "taxkubun"];
		rtn = doCopyInsert(teldetailX_tb, teldetail_filename, teldetailX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + teldetail_filename);
			logh.putError(G_SCRIPT_INFO, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + teldetail_filename);
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
				logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + finDir);
				throw die(1);
			} else {
				if (DEBUG_FLG) logging("INFO: \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
				logh.putError(G_SCRIPT_INFO, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
			}
		}

	clearstatcache();
	dirh = opendir(dataDir + "/" + fin_pact[cnt]);

	while (copyfileName = readdir(dirh)) {
		if (is_file(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName) == true && preg_match("/\\.csv$/i", copyfileName) == true) {
			if (rename(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName) == false) {
				if (DEBUG_FLG) logging("ERROR: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				throw die(1);
			} else {
				if (DEBUG_FLG) logging("INFO: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_INFO, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			}
		}

		clearstatcache();
	}

	closedir(dirh);
}

lock(false, dbh);
print("\u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(import_hand.php)\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002\n");
if (DEBUG_FLG) logging("END: \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(import_hand.php)\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
logh.putError(G_SCRIPT_END, "import_hand.php \u624B\u5165\u529B\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
throw die(0);

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

//初期化
//ini読込
//初期化
//iniの読込
//対象のキャリアの内訳を取得
//何かしらの機能追加でカラムを足す必要がある場合は、自由に足していい
//キャリアのutiwakeコード読込
//指定されたキャリア、内訳コードのと税区分を返す
class ImportHand {
	constructor(dbh) {
		this.utiwake_tb = Array();
		this.import_hand_ini = undefined;
		this.dbh = undefined;
		this.ini = this.read_ini();
		this.dbh = dbh;
	}

	read_ini() {
		var import_hand_ini = parse_ini_file(KCS_DIR + "/conf_sync/import_hand.ini", true);
		var res = Array();

		for (var carid in import_hand_ini) {
			var col = import_hand_ini[carid];
			var temp = Array();

			if (!!col.tax_kubun) {
				var kubun = col.tax_kubun.split(",");
				temp.tax_kubun = kubun;
			}

			if (!!temp) {
				res[carid] = temp;
			}
		}

		return res;
	}

	get_utiwake_info(carid, utiwake) {
		var sql = "SELECT code,taxtype FROM utiwake_tb WHERE" + " carid=" + carid + " AND code IN (";
		var separate = "";

		for (var code of Object.values(utiwake)) {
			sql += separate + "'" + code + "'";
			separate = ",";
		}

		sql += ")";
		var result = this.dbh.getHash(sql);
		var res = Array();

		for (var key in result) {
			var value = result[key];
			res[value.code] = value;
		}

		return res;
	}

	initializeCarrier(carid, H_hand_kamoku) //内訳コードの読込
	{
		if (!(undefined !== this.utiwake_tb[carid])) //ASPとASXいれた
			{
				H_hand_kamoku.ASP = "ASP";
				H_hand_kamoku.ASX = "ASX";
				this.utiwake_tb[carid] = this.get_utiwake_info(carid, Object.keys(H_hand_kamoku));
			}
	}

	getTaxKubun(carid, code) //キャリアの内訳コードが読み込まれている？
	//内訳コード登録されている？
	//iniに税区分設定されてる？
	{
		var utiwake = undefined;

		if (!this.utiwake_tb[carid]) //ない
			{
				return "";
			}

		utiwake = this.utiwake_tb[carid];

		if (!(undefined !== utiwake[code])) //ない
			{
				return "";
			}

		var ini = undefined;

		if (undefined !== this.ini[carid]) {
			ini = this.ini[carid];
		} else if (undefined !== this.ini[0]) {
			ini = this.ini[0];
		} else //デフォルト値もないし、キャリアの設定もない
			{
				return "";
			}

		if (!(undefined !== ini.tax_kubun)) //ない
			{
				return "";
			}

		var taxtype = utiwake[code].taxtype;

		if (undefined !== ini.tax_kubun[taxtype]) {
			return ini.tax_kubun[taxtype];
		}

		return "";
	}

};