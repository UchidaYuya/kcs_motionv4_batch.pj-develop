#!/usr/local/bin/php
//DLP請求データが置かれるディレクトリ
//NTTドコモDLPサービスのキャリアID
//ファイルのオリジナルエンコード
//消費税
//重複する電話番号があった時表示用行数に加える数
//消費税の表示番目（LU用）
//未登録電話を追加する時のエリア
//未登録電話を追加する時のサーキット
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログファイル名、ログ出力タイプを設定
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
//ソート
//対象ユーザーのディレクトリチェック
//テーブル名設定
//ファイルオープン失敗
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
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//請求月から利用月を返す
//ファイルとオプションのマッチングに使用する
echo("\n");
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_docomoDLP.php";
const DLP_DIR = "/docomoDLP/bill";
const DLP_CARID = 12;
const BEFORE_ENCO = "SJIS";
const CON_TAX = 0.08;
const VIEWCNT = 7;
const TAX_VIEWCNT = 7;
const AREAID = 43;
const CIRID = 27;
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
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

logh.putError(G_SCRIPT_BEGIN, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
var dataDir = DATA_DIR + "/" + year + month + DLP_DIR;

if (pactid == "all") {
	if (is_dir(dataDir) == false) //エラー終了
		{
			logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die(1);
		}
} else {
	if (is_dir(dataDir + "/" + pactid) == false) //エラー終了
		{
			logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "/" + pactid + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die(1);
		}
}

clearstatcache();

if (pactid == "all") {
	var LocalLogFile = dataDir + "/import_docomoDLP.log";
} else {
	LocalLogFile = dataDir + "/" + pactid + "/import_docomoDLP.log";
}

if (DEBUG_FLG) logging("START: docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(import_docomoDLP.php)\u3092\u958B\u59CB\u3057\u307E\u3059");
var A_pactid = Array();

if (pactid == "all") ///kcs/data/yyyymm/docomoDLP/bill/以下のディレクトリを開く
	//処理する契約ＩＤを取得する
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

if (pactCnt == 0 || undefined !== A_pactid == false) //エラー終了
	{
		if (DEBUG_FLG) logging("ERROR: Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093");
		throw die(1);
	}

if (lock(true, dbh) == false) {
	if (DEBUG_FLG) logging("ERROR: \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
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
	logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + tel_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: tel_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + tel_xx_filename);

if (target == "n") {
	var tel_filename = dataDir + "/tel_tb" + year + month + pactid + ".ins";
	var tel_fp = fopen(tel_filename, "w");

	if (tel_fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + tel_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + tel_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		throw die(1);
	}

	if (DEBUG_FLG) logging("INFO: tel_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + tel_filename);
}

var teldetail_filename = dataDir + "/" + teldetailX_tb + year + month + pactid + ".ins";
var teldetail_fp = fopen(teldetail_filename, "w");

if (teldetail_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + teldetail_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetail_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: tel_details_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + teldetail_filename);
var fin_cnt = 0;

for (cnt = 0;; cnt < pactCnt; cnt++) //取り込むデータ数をカウントするための変数
//エラー用フラグ
//tel_xx_tbへのcopy文をファイルに一度に書き込むためのバッファ
//tel_tbへのcopy文をファイルに一度に書き込むためのバッファ
//対象会社の会社名を取得
//請求データファイル名を取得する
//処理する請求データファイル名配列
//請求データファイルがなかった場合
//ファイル毎のループfor閉じ
//ファイルハンドルが無い時
//最新月を指定している時はtel_tb用のファイルにも書き込み
//会社単位に終了ログを出力
{
	var out_rec_cnt = 0;
	var error_flg = false;
	var write_buf = "";
	var tel_xx_write_buf = "";
	var detail_xx_write_buf = "";
	var PACT_result = dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) logging("WARNING:  \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u4F1A\u793E\u540D\u3092\u53D6\u5F97 " + PACT_result);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
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
		logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\uFF08" + dataDirPact + "\uFF09");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u6570 " + fileCnt);
	var get_telx_sql = "select telno from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " and carid = " + DLP_CARID + " ;";
	var TEL_result = dbh.getCol(get_telx_sql, true);
	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u767B\u9332\u96FB\u8A71\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + TEL_result.length + "\u4EF6 select telno from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");

	if (target == "n") {
		var TEL_now_result = dbh.getCol("select telno from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and carid = " + DLP_CARID + ";", true);
		if (DEBUG_FLG) logging("INFO: \u6700\u65B0\u306E\u767B\u9332\u96FB\u8A71\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + TEL_now_result.length + "\u4EF6 select telno from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		var tel_write_buf = "";
	}

	var aspFlg = false;

	if (chkAsp(dbh.escape(A_pactid[cnt])) == true) //ASP使用料が数字以外で返って来た時
		{
			aspFlg = true;
			if (DEBUG_FLG) logging("INFO: ASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u304C\uFF2F\uFF2E");
			var asp_charge = dbh.getOne("select charge from asp_charge_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and carid = " + DLP_CARID + " ;", true);

			if (is_numeric(asp_charge) == false) {
				if (DEBUG_FLG) logging("WARNING: ASP\u4F7F\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 pactid\uFF1A" + A_pactid[cnt]);
				logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " ASP\u4F7F\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 ");
				error_flg = true;
				break;
			}

			var asp_tax = Math.floor(asp_charge * CON_TAX);
			if (DEBUG_FLG) logging("INFO: ASP\u4F7F\u7528\u6599\u53D6\u5F97\u3000" + asp_charge);
		}

	for (var fcnt = 0; fcnt < fileCnt; fcnt++) //対象ファイルオープン
	//-------------------------------------------
	//ファイルのエンコーディングをUTF-8に変更
	//-------------------------------------------
	//ファイルが開けなかった時
	//エラーフラグが立っていたら
	//現在の日付を得る
	//消費税用変数
	//合計金額用変数
	//---------------------------
	//レコード毎の処理（１行毎）
	//---------------------------
	//ファイルポインタを先頭に戻す
	//ファイル１行ずつ処理するwhile閉じ
	//差額処理------------------------------------------------
	//合計金額の差額
	//そしてバッファに追加
	{
		var infilename = dataDirPact + "/" + A_billFile[fcnt];
		var filesorce = file_get_contents(infilename);
		filesorce = mb_convert_encoding(filesorce, "UTF-8", BEFORE_ENCO);
		var ifp = fopen(infilename, "w");

		if (ifp == undefined) {
			if (DEBUG_FLG) logging("ERROR: " + infilename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557\u3002UTF-8\u306B\u5909\u63DB\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
			logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + infilename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557\u3002UTF-8\u306B\u5909\u63DB\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
			throw die(1);
		}

		fwrite(ifp, filesorce);
		fclose(ifp);
		ifp = fopen(infilename, "r");

		if (ifp == undefined) {
			if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + infilename);
			error_flg = true;
			break;
		}

		if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + infilename);
		var lcnt = 0;

		while (line = fgets(ifp)) //１行目を抽出（合計金額、消費税）
		{
			lcnt++;
			var A_column = line.split(",");

			if (lcnt == 1) //１カラム目が合計金額、２カラム目が消費税
				//エラーチェック
				{
					var sum_taxes = A_column[1].trim();
					var sum_amount = A_column[0].trim() - sum_taxes;

					if (is_numeric(sum_amount) == false || is_numeric(sum_taxes) == false) {
						if (DEBUG_FLG) logging("WARNING: \u6D88\u8CBB\u7A0E\u3001\u5408\u8A08\u91D1\u984D\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F " + infilename);
						logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + infilename + " csv\u3001\u6D88\u8CBB\u7A0E\u3001\u5408\u8A08\u91D1\u984D\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002 " + infilename);
						error_flg = true;
						break;
					}
				}

			if (lcnt == 2) //１カラム目の年月を取得する
				//エラーチェック
				{
					var inyear = A_column[0].substr(0, 4);
					var inmonth = mb_substr(A_column[0], 5, 2);

					if (is_numeric(inyear) == false || is_numeric(inmonth) == false) {
						if (DEBUG_FLG) logging("WARNING: \u5229\u7528\u5E74\u6708\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F " + infilename);
						logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + infilename + " csv\u3001\u5229\u7528\u5E74\u6708\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002 " + infilename);
						error_flg = true;
						break;
					}
				}

			if (lcnt == 4) //NO.、LU/MS、ノード識別子、電話番号、料金プラン、登録、参照、通知、検索、測位、小計、アクセス料、月額基本料、合計、備考になってるか？
				{
					if (A_column[0].trim() != "NO." || A_column[1].trim() != "LU/MS" || A_column[2].trim() != "\u30CE\u30FC\u30C9\u8B58\u5225\u5B50" || A_column[3].trim() != "\u96FB\u8A71\u756A\u53F7" || A_column[4].trim() != "\u6599\u91D1\u30D7\u30E9\u30F3" || A_column[5].trim() != "\u767B\u9332" || A_column[6].trim() != "\u53C2\u7167" || A_column[7].trim() != "\u901A\u77E5" || A_column[8].trim() != "\u691C\u7D22" || A_column[9].trim() != "\u6E2C\u4F4D" || A_column[10].trim() != "\u5C0F\u8A08" || A_column[11].trim() != "\u30A2\u30AF\u30BB\u30B9\u6599" || A_column[12].trim() != "\u6708\u984D\u57FA\u672C\u6599" || A_column[13].trim() != "\u5408\u8A08" || A_column[14].trim() != "\u5099\u8003") {
						if (DEBUG_FLG) logging("WARNING: \u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
						logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + infilename + " csv\u30D5\u30A1\u30A4\u30EB\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u7570\u306A\u308A\u307E\u3059\u3002\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002 " + infilename);
						error_flg = true;
						break;
					}
				}

			if (lcnt == 5) //エラーチェック
				//このループは終わり
				{
					if (A_column[1] != "LU") {
						if (DEBUG_FLG) logging("WARNING: 5\u884C\u76EE\u304CLU\u3067\u306F\u3042\u308A\u307E\u305B\u3093 " + infilename);
						logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + infilename + " csv\u30015\u884C\u76EE\u304CLU\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002 " + infilename);
						error_flg = true;
						break;
					}

					var luno = A_column[2];
					break;
				}

			if (lcnt > 5) {
				break;
			}
		}

		if (error_flg == true) {
			break;
		}

		if (-1 !== TEL_result.indexOf(luno) == false) {
			if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306ELU\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u304B\u3001\u767B\u9332\u3055\u308C\u3066\u3044\u308BLU\u756A\u53F7\u3068\u7570\u306A\u308A\u307E\u3059 " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u30D5\u30A1\u30A4\u30EB\u306ELU\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u304B\u3001\u767B\u9332\u3055\u308C\u3066\u3044\u308BLU\u756A\u53F7\u3068\u7570\u306A\u308A\u307E\u3059 " + infilename);
			error_flg = true;
			break;
		}

		var trg_post = dbh.getOne("select postid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " and telno = '" + luno + "' and carid=" + DLP_CARID + ";", true);

		if (trg_post == "") {
			if (DEBUG_FLG) logging("WARNING: \u90E8\u7F72\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + "select postid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " and telno = " + luno + ";");
			logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406" + PACT_result + " " + A_pactid[cnt] + " \u90E8\u7F72\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
			continue;
		}

		if (DEBUG_FLG) logging("INFO: \u90E8\u7F72\u306Epostid\u53D6\u5F97 postid=" + trg_post + " select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and telno = " + luno + ";");

		if (inyear != A_riyou.year || inmonth != A_riyou.month) {
			if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u5BFE\u8C61\u5E74\u6708\u304C\u7570\u306A\u308A\u307E\u3059 " + infilename);
			error_flg = true;
			break;
		}

		var nowtime = getTimestamp();
		var tax_cnt = 0;
		var amount_cnt = 0;
		fseek(ifp, 0);

		while (line = fgets(ifp)) //先頭の項目が数字かつ２つ目の項目がLU/MSだった時のみ実行（その他は無視）
		{
			var readbuff = chop(line).split(",");

			if (is_numeric(readbuff[0]) == true && (readbuff[1] == "LU" || readbuff[1] == "MS")) //最初のデータのみ（LUの時）の処理
				//ハイフン付の電話番号作成
				//-------------------------------------------
				//ドコモに既に登録されているか？のチェック
				//-------------------------------------------
				//既にドコモに登録済み
				//既にドコモに登録済み
				//基本使用料
				{
					out_rec_cnt++;

					if (readbuff[1] == "LU") //電話番号が空なのでノード番号をコピー
						{
							readbuff[3] = readbuff[2];
						}

					readbuff[3] = trim(readbuff[3], "TEL:");

					if (preg_match("/^0[789]0/", readbuff[3]) && readbuff[3].length >= 11) //070, 080, 090 のいずれかで始まっていたら"-"を入れ込む
						{
							var telno_view = readbuff[3].substr(0, 3) + "-" + readbuff[3].substr(3, 4) + "-" + readbuff[3].substr(7);
						} else {
						telno_view = readbuff[3];
					}

					var telX_username = "";
					var telX_post = trg_post;
					var get_telX = "select postid,userid,username from " + telX_tb + " where telno = '" + readbuff[3] + "'";
					var H_telXinfo = dbh.getHash(get_telX);

					if (H_telXinfo.length > 0) {
						telX_post = H_telXinfo[0].postid;
						telX_username = H_telXinfo[0].username;
					}

					if (-1 !== TEL_result.indexOf(readbuff[3]) == false && preg_match("/" + readbuff[3] + "/", tel_xx_write_buf) == false) //tel_xx_tbへのコピー文のバッファ
						//すでにバッファにその電話があれば追加しないが、無ければ追加
						{
							var copy_buf = A_pactid[cnt] + "\t" + telX_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + DLP_CARID + "\t" + AREAID + "\t" + CIRID + "\t" + telX_username + "\t" + nowtime + "\t" + nowtime + "\n";

							if (preg_match("/" + readbuff[3] + "/", tel_xx_write_buf) == false) {
								tel_xx_write_buf += copy_buf;
							}
						}

					var tel_username = "";
					var tel_post = trg_post;
					var get_tel = "select postid,userid,username from tel_tb where telno = '" + readbuff[3] + "'";
					var H_telinfo = dbh.getHash(get_tel);

					if (H_telinfo.length > 0) {
						tel_post = H_telinfo[0].postid;
						tel_username = H_telinfo[0].username;
					}

					if (target == "n") {
						if (undefined !== telno_view == false) {
							telno_view = readbuff[3];
						}

						if (-1 !== TEL_now_result.indexOf(readbuff[3]) == false && preg_match("/" + readbuff[3] + "/", tel_write_buf) == false) {
							copy_buf = A_pactid[cnt] + "\t" + tel_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + DLP_CARID + "\t" + AREAID + "\t" + CIRID + "\t" + tel_username + "\t" + nowtime + "\t" + nowtime + "\n";
							tel_write_buf += copy_buf;
						}
					}

					var viewcnt = 1;
					copy_buf = "";

					if (readbuff[12] != "") //すでにバッファにその電話があれば先に行番号加算
						{
							if (preg_match("/" + readbuff[3] + "/", write_buf) == true) //既にバッファにある電話番号の最後の行カウントを取得する
								//ASP利用料がONの場合
								//検索文字列以降の文字列を取得
								//配列の最後の要素番号
								//必要な数字以外を削除
								//さらに元のASP使用料、ASP消費税があれば消す
								{
									if (aspFlg == true) //検索文字列バターン
										//検索文字列バターン
										{
											var patern_a = A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\tASP\u4F7F\u7528\u6599\t\\d{1,}?\t\t\\d{1,}";
											var patern_b = A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\tASP\u4F7F\u7528\u6599\t\\d{1,}?\t\t";
										} else //検索文字列バターン
										//検索文字列バターン
										{
											patern_a = A_pactid[cnt] + "\t" + readbuff[3] + "\t228\t\u6D88\u8CBB\u7A0E\t\\d{1,}?\t\t\\d{1,}";
											patern_b = A_pactid[cnt] + "\t" + readbuff[3] + "\t228\t\u6D88\u8CBB\u7A0E\t\\d{1,}?\t\t";
										}

									preg_match_all("/" + patern_a + "/", write_buf, A_match, PREG_PATTERN_ORDER);
									var last_num = A_match[0].length - 1;
									viewcnt = preg_replace("/" + patern_b + "/", "", A_match[0][last_num]);

									if (aspFlg == true) {
										viewcnt = viewcnt - 1;
									} else {
										viewcnt = viewcnt + 1;
									}

									delete A_match;

									if (preg_match("/" + A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "/", write_buf) == true) {
										write_buf = preg_replace("/" + A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\t.*?\n/", "", write_buf);
										write_buf = preg_replace("/" + A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASX + "\t.*?\n/", "", write_buf);
									}
								}

							if (undefined !== readbuff[14] == true && readbuff[14] != "") {
								write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t181\tDLP\u30B5\u30FC\u30D3\u30B9\u6708\u984D\u57FA\u672C\u4F7F\u7528\u6599" + month_view + "\u6708\u8ACB\u6C42\uFF08" + readbuff[14] + "\uFF09\t" + readbuff[12] + "\t\u5408\u7B97\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
							} else {
								write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t181\tDLP\u30B5\u30FC\u30D3\u30B9\u6708\u984D\u57FA\u672C\u4F7F\u7528\u6599" + month_view + "\u6708\u8ACB\u6C42\t" + readbuff[12] + "\t\u5408\u7B97\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
							}

							viewcnt++;
						}

					if (readbuff[5] != "") {
						write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t076\tDLP\u30B5\u30FC\u30D3\u30B9\u30A2\u30AF\u30BB\u30B9\u6599\uFF08\u767B\u9332\uFF09\t" + readbuff[5] + "\t\u5408\u7B97\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						viewcnt++;
					}

					if (readbuff[6] != "") {
						write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t004\tDLP\u30B5\u30FC\u30D3\u30B9\u30A2\u30AF\u30BB\u30B9\u6599\uFF08\u53C2\u7167\uFF09\t" + readbuff[6] + "\t\u5408\u7B97\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						viewcnt++;
					}

					if (readbuff[7] != "") {
						write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t036\tDLP\u30B5\u30FC\u30D3\u30B9\u30A2\u30AF\u30BB\u30B9\u6599\uFF08\u901A\u77E5\uFF09\t" + readbuff[7] + "\t\u5408\u7B97\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						viewcnt++;
					}

					if (readbuff[8] != "") {
						write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t131\tDLP\u30B5\u30FC\u30D3\u30B9\u30A2\u30AF\u30BB\u30B9\u6599\uFF08\u691C\u7D22\uFF09\t" + readbuff[8] + "\t\u5408\u7B97\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						viewcnt++;
					}

					if (readbuff[9] != "") {
						write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t009\tDLP\u30B5\u30FC\u30D3\u30B9\u30A2\u30AF\u30BB\u30B9\u6599\uFF08\u6E2C\u4F4D\uFF09\t" + readbuff[9] + "\t\u5408\u7B97\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						viewcnt++;
					}

					if (readbuff[10] != "") //LUの時は後でバッファに追加するので今は消費税だけ取っておく
						//ファイル単位合計の金額を調べる為全ての合計を加えていく
						//合計の消費税を調べる為全ての消費税を加えていく（小数点以下切捨て）
						{
							if (readbuff[1] == "LU") {
								var lu_tax = Math.floor(readbuff[13] * CON_TAX);
							} else {
								write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t228\t\u6D88\u8CBB\u7A0E\t" + Math.floor(readbuff[13] * CON_TAX) + "\t\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
							}

							amount_cnt += readbuff[13];
							tax_cnt += Math.floor(readbuff[13] * CON_TAX);
							viewcnt++;
						}

					if (aspFlg == true) //合計行のために１つ表示順を空ける
						{
							viewcnt++;
							write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\tASP\u4F7F\u7528\u6599\t" + asp_charge + "\t\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
							viewcnt++;
							write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASX + "\tASP\u4F7F\u7528\u6599\u6D88\u8CBB\u7A0E\t" + asp_tax + "\t\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						}
				}
		}

		var amount_sagaku = sum_amount - amount_cnt;

		if (amount_sagaku != 0) {
			if (DEBUG_FLG) logging("WARNING: " + infilename + "  \u30D5\u30A1\u30A4\u30EB\u306E\uFF11\u884C\u76EE\u306E\u5408\u8A08\u91D1\u984D\uFF08" + sum_amount + "\uFF09\u3068\u5404\u30EC\u30B3\u30FC\u30C9\u306E\u5408\u8A08\u91D1\u984D\u304C\u9055\u3044\u307E\u3059\uFF08" + amount_cnt + "\uFF09");
			logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + "  " + infilename + "  \u30D5\u30A1\u30A4\u30EB\u306E\uFF11\u884C\u76EE\u306E\u5408\u8A08\u91D1\u984D\uFF08" + sum_amount + "\uFF09\u3068\u5404\u30EC\u30B3\u30FC\u30C9\u306E\u5408\u8A08\u91D1\u984D\u304C\u9055\u3044\u307E\u3059\uFF08" + amount_cnt + "\uFF09");
			error_flg = true;
			break;
		}

		var tax_sagaku = sum_taxes - tax_cnt;
		lu_tax = lu_tax + tax_sagaku;
		write_buf += A_pactid[cnt] + "\t" + luno + "\t" + "228" + "\t" + "\u6D88\u8CBB\u7A0E" + "\t" + lu_tax + "\t\t" + TAX_VIEWCNT + "\t" + nowtime + "\t" + DLP_CARID + "\n";
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
	logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "\u4EF6\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
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
		logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \uFF11\u4EF6\u3082\u6210\u529F\u3057\u307E\u305B\u3093\u3067\u3057\u305F");
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
			logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + teldetailX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + teldetailX_exp);
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
		dbh.query("delete from " + teldetailX_tb + " where pactid IN(" + pactin + ") and carid=" + DLP_CARID + ";", true);
		if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F " + "delete from" + teldetailX_tb + " where pactid IN(" + pactin + ") and carid=" + DLP_CARID + ";");
		logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F" + teldetailX_tb);
	}

if (filesize(tel_xx_filename) != 0) //tel_X_tb へインポート
	//インポート失敗した場合
	{
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "username", "recdate", "fixdate"];
		rtn = doCopyInsert(telX_tb, tel_xx_filename, telX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_xx_filename);
			logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_xx_filename);
		}
	}

if (target == "n") {
	if (filesize(tel_filename) != 0) //tel_tb へインポート
		//インポート失敗した場合
		{
			var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "username", "recdate", "fixdate"];
			rtn = doCopyInsert("tel_tb", tel_filename, tel_col, dbh);

			if (rtn != 0) //ロールバック
				{
					if (DEBUG_FLG) logging("ERROR: TEL_TB\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
					logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 TEL_TB\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
					dbh.rollback();
					throw die(1);
				} else {
				if (DEBUG_FLG) logging("INFO: TEL_TB\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_filename);
				logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 TEL_TB\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + tel_filename);
			}
		}
}

if (filesize(teldetail_filename) != 0) //tel_details_X_tb へインポート
	//インポート失敗した場合
	{
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid"];
		rtn = doCopyInsert(teldetailX_tb, teldetail_filename, teldetailX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + teldetail_filename);
			logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + teldetail_filename);
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
				logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + finDir);
				throw die(1);
			} else {
				if (DEBUG_FLG) logging("INFO: \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
				logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
			}
		}

	clearstatcache();
	dirh = opendir(dataDir + "/" + fin_pact[cnt]);

	while (copyfileName = readdir(dirh)) {
		if (is_file(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName) == true && preg_match("/\\.csv$/i", copyfileName) == true) {
			if (rename(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName) == false) {
				if (DEBUG_FLG) logging("ERROR: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				throw die(1);
			} else {
				if (DEBUG_FLG) logging("INFO: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			}
		}

		clearstatcache();
	}

	closedir(dirh);
}

lock(false, dbh);
print("docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(import_docomoDLP.php)\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002\n");
if (DEBUG_FLG) logging("END: docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(import_docomoDLP.php)\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
logh.putError(G_SCRIPT_END, "import_docomoDLP.php docomoDLP\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
throw die(0);

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