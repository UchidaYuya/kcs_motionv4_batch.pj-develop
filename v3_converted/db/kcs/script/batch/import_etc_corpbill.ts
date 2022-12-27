#!/usr/local/bin/php
//東中西のcoid
//阪神のcoid
//首都高のcoid
//本州四国のcoid
//ファイルの変更後のエンコード
//ファイルのオリジナルエンコード
//通行料金（カード単位合計）の内訳コード
//請求金額の内訳コード
//調整金額の内訳コード
//路線バス割引対象額の内訳コード
//路線バス割引額の内訳コード
//車両単位割引対象額（高速道路）の内訳コード
//車両単位割引額（高速道路）の内訳コード
//車両単位割引対象額（一般有料道路）の内訳コード
//車両単位割引額（一般有料道路）の内訳コード
//HNN:東中西、Shutokou:首都高、Hanshin:阪神、HS:本州四国、HK:福岡北九州
//MEISAIのデータフォーマット
//INFOのデータフォーマット
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//内訳テーブルから内訳コード一覧を取得
//cardcoidをキーにした配列に変換
//
//  パラメータチェック
//
//ETCデータディレクトリ
//ETCデータディレクトリが存在しない
//ローカルログファイル名
//ログファイルを開けない
//データディレクトリが存在する公団名を入れる配列
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
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//読み込んだファイルの1行毎を項目別にばらした配列にする
//[引　数] ファイル内の1行、フォーマット
//[返り値] 項目毎に分けられた配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//読み込んだファイルの1行毎を項目別にばらした配列にする
//[引　数] ファイル内の1行、フォーマット
//[返り値] 項目毎に分けられた配列
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
const SCRIPT_FILENAME = "import_etc_corpbill.php";
const HNN_COID = 1;
const HANSHIN_COID = 2;
const SHUTO_COID = 3;
const HONSHI_COID = 4;
const AFTER_ENCO = "UTF-8";
const BEFORE_ENCO = "SJIS";
const TSUKOU_UTICODE = "001";
const SEIKYU_UTICODE = "002";
const CHOUSEI_UTICODE = "003";
const BUS_UTICODE = "101";
const BUSDIS_UTICODE = "-111";
const CAR_KOUSOKU_UTICODE = "102";
const CARDIS_KOUSOKU_UTICODE = "-112";
const CAR_IPPAN_UTICODE = "103";
const CARDIS_IPPAN_UTICODE = "-113";
var A_corp = ["HNN", "Shutokou", "Hanshin", "HonShi"];
var A_meisaiform = [10, 15, 5, 8, 3, 5, 20, 5, 20, 2, 6, 6, 6, 6, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9];
var A_infoform = [10, 5, 6, 14, 10, 10, 10, 10, 10, 10, 10, 10, 10, 1, 10, 1, 10, 15, 15, 15, 6];
var dbLogFile = DATA_LOG_DIR + "/card_billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_typeView);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var A_alluticode = dbh.getHash("select cardcoid,code from card_utiwake_tb order by cardcoid;", true);
var A_uticode = Array();

for (var ccnt = 0; ccnt < A_alluticode.length; ccnt++) {
	if (undefined !== A_uticode[A_alluticode[ccnt].cardcoid] == false) {
		A_uticode[A_alluticode[ccnt].cardcoid] = Array();
	}

	for (var key in A_uticode) {
		var val = A_uticode[key];

		if (A_alluticode[ccnt].cardcoid == key) {
			A_uticode[key].push(A_alluticode[ccnt].code);
		}
	}
}

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

var ETC_DIR = DATA_DIR + "/" + year + month + "/ETC";

if (is_dir(ETC_DIR) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + ETC_DIR + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
	throw die(1);
}

logh.putError(G_SCRIPT_BEGIN, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
var LocalLogFile = ETC_DIR + "/import_etc_corp.log";

if (fopen(LocalLogFile, "a") == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u30ED\u30B0\u30D5\u30A1\u30A4\u30EB\uFF08" + LocalLogFile + "\uFF09\u3092\u958B\u3051\u307E\u305B\u3093");
	throw die(1);
}

if (DEBUG_FLG) logging("START: ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(" + SCRIPT_FILENAME + "\u3092\u958B\u59CB\u3057\u307E\u3059");
var A_dataDir = Array();

if (pactid == "all") //データディレクトリがひとつもなかったら終了
	{
		for (var idx = 0; idx < A_corp.length; idx++) {
			if (is_dir(ETC_DIR + "/" + A_corp[idx]) == false) {
				if (DEBUG_FLG) logging(SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + ETC_DIR + "/" + A_corp[idx] + "\uFF09\u306F\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			} else {
				if (DEBUG_FLG) logging(SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + ETC_DIR + "/" + A_corp[idx] + "\uFF09\u306F\u307F\u3064\u304B\u308A\u307E\u3057\u305F");
				A_dataDir.push(ETC_DIR + "/" + A_corp[idx]);
			}
		}

		if (A_dataDir.length == 0) {
			logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + ETC_DIR + "/\u4EE5\u4E0B\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die(1);
		}
	} else //データディレクトリがひとつもなかったら終了
	{
		for (idx = 0;; idx < A_corp.length; idx++) {
			if (is_dir(ETC_DIR + "/" + A_corp[idx] + "/" + pactid) == false) {
				if (DEBUG_FLG) logging(SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + ETC_DIR + "/" + A_corp[idx] + "/" + pactid + "\uFF09\u306F\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			} else {
				if (DEBUG_FLG) logging(SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + ETC_DIR + "/" + A_corp[idx] + "/" + pactid + "\uFF09\u306F\u307F\u3064\u304B\u308A\u307E\u3057\u305F");
				A_dataDir.push(ETC_DIR + "/" + A_corp[idx] + "/" + pactid);
			}
		}

		if (A_dataDir.length == 0) {
			logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + ETC_DIR + "/\u4EE5\u4E0B\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die(1);
		}
	}

clearstatcache();
var A_pactid = Array();

if (pactid == "all") ///kcs/data/yyyymm/ETC以下のディレクトリを開く
	{
		for (idx = 0;; idx < A_dataDir.length; idx++) {
			if (is_dir(A_dataDir[idx]) == true) //処理する契約ＩＤを取得する
				{
					var pactName;
					var dirh = opendir(A_dataDir[idx]);

					while (pactName = readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
					{
						if (is_dir(A_dataDir[idx] + "/" + pactName) && pactName != "." && pactName != "..") {
							if (-1 !== A_pactid.indexOf(pactName) == false) {
								A_pactid.push(pactName);
							}

							if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA " + A_dataDir[idx] + "/" + pactName);
						}

						clearstatcache();
					}

					closedir(dirh);
				}
		}
	} else ///kcs/data/yyyymm/ETC以下のディレクトリを開く
	{
		A_pactid.push(pactid);

		for (idx = 0;; idx < A_dataDir.length; idx++) {
			if (is_dir(A_dataDir[idx]) == true) //処理する契約ＩＤを取得する
				{
					dirh = opendir(A_dataDir[idx]);

					while (pactName = readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
					{
						if (is_dir(A_dataDir[idx]) && pactName != "." && pactName != "..") {
							if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA " + A_dataDir[idx]);
						}

						clearstatcache();
					}

					closedir(dirh);
				}
		}
	}

A_pactid.sort();

if (A_pactid.length == 0 || undefined !== A_pactid == false) //エラー終了
	{
		if (DEBUG_FLG) logging("ERROR: Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093");
		throw die(1);
	}

if (lock(true, dbh) == false) {
	if (DEBUG_FLG) logging("ERROR: \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	throw die(1);
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var cardX_tb = "card_" + tableNo + "_tb";
var carddetailX_tb = "card_details_" + tableNo + "_tb";
if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30C6\u30FC\u30D6\u30EB " + cardX_tb + " & " + carddetailX_tb);
var card_xx_filename = ETC_DIR + "/" + cardX_tb + year + month + pactid + ".ins";
var card_xx_fp = fopen(card_xx_filename, "w");

if (card_xx_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + card_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + card_xx_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: card_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + card_xx_filename);

if (target == "n") {
	var card_filename = ETC_DIR + "/card_tb" + year + month + pactid + ".ins";
	var card_fp = fopen(card_filename, "w");

	if (card_fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + card_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + card_fp + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		throw die(1);
	}

	if (DEBUG_FLG) logging("INFO: card_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + card_filename);
}

var carddetail_filename = ETC_DIR + "/" + carddetailX_tb + year + month + pactid + ".ins";
var carddetail_fp = fopen(carddetail_filename, "w");

if (carddetail_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + carddetail_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + carddetail_filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
	throw die(1);
}

if (DEBUG_FLG) logging("INFO: card_details_XX_tb\u3078\u306Ecopy\u6587\u30D5\u30A1\u30A4\u30EBOPEN " + carddetail_filename);
var fin_cnt = 0;
var nowtime = date("Y-m-d H:i:s");
var A_del_sql = Array();

for (cnt = 0;; cnt < A_pactid.length; cnt++) //取り込むデータ数をカウントするための変数
//エラー用フラグ
//card_xx_tbへのcopy文をファイルに一度に書き込むためのバッファ
//card_tbへのcopy文をファイルに一度に書き込むためのバッファ
//対象会社の会社名を取得
//請求データファイルを取得する
//処理する請求データファイル名配列
//請求データファイルがなかった場合
//ファイル毎のループfor閉じ
//ファイルハンドルがある時
//最新月を指定している時はcard_tb用のファイルにも書き込み
//会社単位に終了ログを出力
{
	var out_rec_cnt = 0;
	var error_flg = false;
	var write_buf = "";
	var card_xx_write_buf = "";
	var detail_xx_write_buf = "";
	var PACT_result = dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) logging("WARNING:  \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u5BFE\u8C61\u4F1A\u793E\u30B3\u30FC\u30C9\uFF08" + A_pactid[cnt] + "\uFF09\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u4F1A\u793E\u540D\u3092\u53D6\u5F97 " + PACT_result);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
	var A_billFile = Array();

	for (idx = 0;; idx < A_dataDir.length; idx++) //全社指定
	{
		if (pactid == "all") {
			var dataDirPact = A_dataDir[idx] + "/" + A_pactid[cnt];
		} else {
			dataDirPact = A_dataDir[idx];
		}

		if (is_dir(dataDirPact) == true) {
			var data_filename;
			var tmp_dh = opendir(dataDirPact);

			while (data_filename = readdir(tmp_dh)) {
				if (preg_match("/^OTINFO\\.txt$/i", data_filename) == true) //OTINFOを配列に入れる
					{
						A_billFile.push(dataDirPact + "/" + data_filename);
						if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u540D " + dataDirPact + "/" + data_filename);
						break;
					}
			}
		}
	}

	if (A_billFile.length == 0) {
		if (DEBUG_FLG) logging("WARNING: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\uFF08" + dataDirPact + "/\u4EE5\u4E0B\uFF09");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " \u4EE5\u4E0B \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\uFF08" + dataDirPact + "/\u4EE5\u4E0B\uFF09");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u6570 " + A_billFile.length);
	var CARD_result = dbh.getCol("select cardno from " + cardX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (Array.isArray(CARD_result) == false) {
		CARD_result = Array();
	}

	if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u4F1A\u793E\u306E\u767B\u9332ETC\u30AB\u30FC\u30C9\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + CARD_result.length + "\u4EF6 select cardno from " + cardX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");

	if (target == "n") //削除されていないカード
		{
			var CARD_now_result = dbh.getCol("select cardno from card_tb where delete_flg = false and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

			if (Array.isArray(CARD_now_result) == false) {
				CARD_now_result = Array();
			}

			if (DEBUG_FLG) logging("INFO: \u6700\u65B0\u306E\u767B\u9332ETC\u30AB\u30FC\u30C9\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97 " + CARD_now_result.length + "\u4EF6 select cardno from card_tb where delete_flg=false and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
			var CARD_now_delete_result = dbh.getCol("select cardno from card_tb where delete_flg = true and pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);

			if (Array.isArray(CARD_now_delete_result) == false) {
				CARD_now_delete_result = Array();
			}

			if (DEBUG_FLG) logging("INFO: \u6700\u65B0\u306E\u767B\u9332ETC\u30AB\u30FC\u30C9\u306E\u30EA\u30B9\u30C8\u3092\u53D6\u5F97\uFF08\u524A\u9664\u6E08\u307F\uFF09 " + CARD_now_delete_result.length + "\u4EF6 select cardno from card_tb where delete_flg=true and pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
			var card_write_buf = "";
		}

	var A_prcardno = dbh.getCol("select card_master_no from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid in (" + HNN_COID + "," + HANSHIN_COID + "," + SHUTO_COID + "," + HONSHI_COID + ");", true);

	if (A_prcardno.length == 0) {
		if (DEBUG_FLG) logging("WARNING: \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9\uFF08\u89AA\u756A\u53F7\uFF09\u304C\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093" + "select card_master_no from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid in (" + HNN_COID + "," + HANSHIN_COID + "," + SHUTO_COID + "," + HONSHI_COID + ");");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u8ACB\u6C42\u5148\u30B3\u30FC\u30C9\uFF08\u89AA\u756A\u53F7\uFF09\u304C\uFF11\u3064\u3082\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		continue;
	}

	var A_coid = Array();

	for (var fcnt = 0; fcnt < A_billFile.length; fcnt++) //-------------------------
	//対象ファイルのcoidの決定
	//-------------------------
	//東中西
	//ファイルが開けなかった時
	{
		if (preg_match("/\\/HNN\\//", A_billFile[fcnt]) == true) {
			if (-1 !== A_coid.indexOf(HNN_COID) == false) {
				var coid = HNN_COID;
				A_coid.push(HNN_COID);
			}
		}

		if (preg_match("/\\/Hanshin\\//", A_billFile[fcnt]) == true) {
			if (-1 !== A_coid.indexOf(HANSHIN_COID) == false) {
				coid = HANSHIN_COID;
				A_coid.push(HANSHIN_COID);
			}
		}

		if (preg_match("/\\/Shutokou\\//", A_billFile[fcnt]) == true) {
			if (-1 !== A_coid.indexOf(SHUTO_COID) == false) {
				coid = SHUTO_COID;
				A_coid.push(SHUTO_COID);
			}
		}

		if (preg_match("/\\/HonShi\\//", A_billFile[fcnt]) == true) {
			if (-1 !== A_coid.indexOf(HONSHI_COID) == false) {
				coid = HONSHI_COID;
				A_coid.push(HONSHI_COID);
			}
		}

		var aspFlg = false;

		if (chkAsp(dbh.escape(A_pactid[cnt])) == true) //ASP使用料が数字以外で返って来た時
			{
				aspFlg = true;
				if (DEBUG_FLG) logging("INFO: ASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u304C\uFF2F\uFF2E");
				var asp_charge = dbh.getOne("select charge from card_asp_charge_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and cardcoid = " + coid + " ;", true);

				if (is_numeric(asp_charge) == false) {
					if (DEBUG_FLG) logging("WARNING: ASP\u4F7F\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 pactid\uFF1A" + A_pactid[cnt]);
					logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " ASP\u4F7F\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 ");
					error_flg = true;
					break;
				}

				if (DEBUG_FLG) logging("INFO: ASP\u4F7F\u7528\u6599\u53D6\u5F97\u3000" + asp_charge);
			}

		var ifp = fopen(A_billFile[fcnt], "r");

		if (ifp == undefined) {
			if (DEBUG_FLG) logging("WARNING: \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + A_billFile[fcnt]);
			logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u30D5\u30A1\u30A4\u30EB\u306EOPEN\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + A_billFile[fcnt]);
			error_flg = true;
			break;
		}

		if (DEBUG_FLG) logging("INFO: \u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB=" + A_billFile[fcnt]);

		while (line = fgets(ifp)) //-----------------------------------------------
		//ファイルのエンコーディングを変更（バッファ上）
		//-----------------------------------------------
		//通行料金
		{
			line = mb_convert_encoding(line, AFTER_ENCO, BEFORE_ENCO);
			var A_line = makeInfoLineArray(line, A_infoform);

			if (checkInfoFormat(A_line, coid) == false) {
				if (DEBUG_FLG) logging("WARNING: \u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u7570\u306A\u308A\u307E\u3059 " + A_billFile[fcnt]);
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_billFile[fcnt] + " \u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u7570\u306A\u308A\u307E\u3059\u3002\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002 " + A_billFile[fcnt]);
				error_flg = true;
				break;
			}

			if (-1 !== A_prcardno.indexOf(A_line[0]) == false) {
				if (DEBUG_FLG) logging("ERROR: \u30D5\u30A1\u30A4\u30EB\u306B\u8A18\u8F09\u3055\u308C\u3066\u3044\u308B\u304A\u5BA2\u69D8\u756A\u53F7(" + A_line[0] + ")\u3068\u767B\u9332\u3055\u308C\u305F\u304A\u5BA2\u69D8\u756A\u53F7(" + A_prcardno.join(",") + ")\u304C\u7570\u306A\u308A\u307E\u3059 " + A_billFile[fcnt] + "(" + A_line[1] + "\u306E\u884C)");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_billFile[fcnt] + " \u30D5\u30A1\u30A4\u30EB\u306B\u8A18\u8F09\u3055\u308C\u3066\u3044\u308B\u304A\u5BA2\u69D8\u756A\u53F7(" + A_line[0] + ")\u3068\u767B\u9332\u3055\u308C\u305F\u304A\u5BA2\u69D8\u756A\u53F7(" + A_prcardno.join(",") + ")\u304C\u7570\u306A\u308A\u307E\u3059\u3002\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3059\u3002\uFF11\u4EF6\u3082\u53D6\u8FBC\u307E\u305B\u3093\u3067\u3057\u305F\u3002 " + A_billFile[fcnt] + "(" + A_line[1] + "\u306E\u884C)");
				error_flg = true;
				break;
			}

			var trg_post = dbh.getOne("select postid from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and card_master_no = '" + A_line[0] + "' and cardcoid = " + coid + ";", true);

			if (trg_post == "") {
				if (DEBUG_FLG) logging("ERROR: \u672A\u767B\u9332\u30AB\u30FC\u30C9\u306E\u767B\u9332\u5148\u90E8\u7F72\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\uFF08\u304A\u5BA2\u69D8\u756A\u53F7\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\uFF09" + "select postid from card_bill_master_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and card_master_no = '" + A_line[0] + "' and cardcoid = " + coid + ";");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + " \u672A\u767B\u9332\u30AB\u30FC\u30C9\u306E\u767B\u9332\u5148\u90E8\u7F72\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\uFF08\u304A\u5BA2\u69D8\u756A\u53F7\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\uFF09");
				error_flg = true;
				break;
			}

			var viewcnt = 1;
			var copy_buf = "";

			if (A_line[4] != "0000000000") //内訳コード正当性チェック
				{
					if (-1 !== A_uticode[coid].indexOf(TSUKOU_UTICODE) == false) {
						if (DEBUG_FLG) logging("WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + TSUKOU_UTICODE);
						logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + TSUKOU_UTICODE);
						error_flg = true;
						break;
					}

					write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + TSUKOU_UTICODE + "\t\u901A\u884C\u6599\u91D1\t" + A_line[4] + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					viewcnt++;
				}

			if (A_line[5] != "0000000000") //内訳コード正当性チェック
				{
					if (-1 !== A_uticode[coid].indexOf(BUS_UTICODE) == false) {
						if (DEBUG_FLG) logging("WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + BUS_UTICODE);
						logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + BUS_UTICODE);
						error_flg = true;
						break;
					}

					write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + BUS_UTICODE + "\t\u3000\u8DEF\u7DDA\u30D0\u30B9\u5272\u5F15\u5BFE\u8C61\u984D\uFF08\u9AD8\u901F\u9053\u8DEF\uFF09\t" + A_line[5] + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					viewcnt++;
				}

			if (A_line[7] != "0000000000") //内訳コード正当性チェック
				{
					if (-1 !== A_uticode[coid].indexOf(BUSDIS_UTICODE) == false) {
						if (DEBUG_FLG) logging("WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + BUSDIS_UTICODE);
						logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + BUSDIS_UTICODE);
						error_flg = true;
						break;
					}

					write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + BUSDIS_UTICODE + "\t\u8DEF\u7DDA\u30D0\u30B9\u5272\u5F15\u984D\uFF08\u9AD8\u901F\u9053\u8DEF\uFF09\t" + A_line[7] * -1 + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					viewcnt++;
				}

			if (A_line[9] != "0000000000") //内訳コード正当性チェック
				{
					if (-1 !== A_uticode[coid].indexOf(CAR_KOUSOKU_UTICODE) == false) {
						if (DEBUG_FLG) logging("WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + CAR_KOUSOKU_UTICODE);
						logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + CAR_KOUSOKU_UTICODE);
						error_flg = true;
						break;
					}

					if (coid == HONSHI_COID) {
						write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + CAR_KOUSOKU_UTICODE + "\t\u3000\u5927\u53E3\u30FB\u591A\u983B\u5EA6\u5272\u5F15\u5BFE\u8C61\u984D\t" + A_line[9] + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					} else {
						write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + CAR_KOUSOKU_UTICODE + "\t\u3000\u8ECA\u4E21\u5358\u4F4D\u5272\u5F15\u5BFE\u8C61\u984D\uFF08\u9AD8\u901F\u9053\u8DEF\uFF09\t" + A_line[9] + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					}

					viewcnt++;
				}

			if (A_line[10] != "0000000000") //内訳コード正当性チェック
				{
					if (-1 !== A_uticode[coid].indexOf(CAR_IPPAN_UTICODE) == false) {
						if (DEBUG_FLG) logging("WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + CAR_IPPAN_UTICODE);
						logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + CAR_IPPAN_UTICODE);
						error_flg = true;
						break;
					}

					write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + CAR_IPPAN_UTICODE + "\t\u3000\u8ECA\u4E21\u5358\u4F4D\u5272\u5F15\u5BFE\u8C61\u984D\uFF08\u4E00\u822C\u6709\u6599\u9053\u8DEF\uFF09\t" + A_line[10] + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					viewcnt++;
				}

			if (A_line[11] != "0000000000") //内訳コード正当性チェック
				{
					if (-1 !== A_uticode[coid].indexOf(CARDIS_KOUSOKU_UTICODE) == false) {
						if (DEBUG_FLG) logging("WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + CARDIS_KOUSOKU_UTICODE);
						logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + CARDIS_KOUSOKU_UTICODE);
						error_flg = true;
						break;
					}

					if (coid == HONSHI_COID) {
						write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + CARDIS_KOUSOKU_UTICODE + "\t\u5927\u53E3\u30FB\u591A\u983B\u5EA6\u5272\u5F15\u984D\t" + A_line[11] * -1 + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					} else {
						write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + CARDIS_KOUSOKU_UTICODE + "\t\u8ECA\u4E21\u5358\u4F4D\u5272\u5F15\u984D\uFF08\u9AD8\u901F\u9053\u8DEF\uFF09\t" + A_line[11] * -1 + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					}

					viewcnt++;
				}

			if (A_line[12] != "0000000000") //内訳コード正当性チェック
				{
					if (-1 !== A_uticode[coid].indexOf(CARDIS_IPPAN_UTICODE) == false) {
						if (DEBUG_FLG) logging("WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + CARDIS_IPPAN_UTICODE);
						logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + CARDIS_IPPAN_UTICODE);
						error_flg = true;
						break;
					}

					write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + CARDIS_IPPAN_UTICODE + "\t\u8ECA\u4E21\u5358\u4F4D\u5272\u5F15\u984D\uFF08\u4E00\u822C\u6709\u6599\u9053\u8DEF\uFF09\t" + A_line[12] * -1 + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					viewcnt++;
				}

			if (A_line[14] != "0000000000") //内訳コード正当性チェック
				{
					if (-1 !== A_uticode[coid].indexOf(CHOUSEI_UTICODE) == false) {
						if (DEBUG_FLG) logging("WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + CHOUSEI_UTICODE);
						logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + CHOUSEI_UTICODE);
						error_flg = true;
						break;
					}

					write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + CHOUSEI_UTICODE + "\t\u8ABF\u6574\u91D1\u984D\t" + A_line[13] + A_line[14] + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					viewcnt++;
				}

			if (A_line[16] != "0000000000") //内訳コード正当性チェック
				{
					if (-1 !== A_uticode[coid].indexOf(SEIKYU_UTICODE) == false) {
						if (DEBUG_FLG) logging("WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + SEIKYU_UTICODE);
						logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + SEIKYU_UTICODE);
						error_flg = true;
						break;
					}

					write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + SEIKYU_UTICODE + "\t\u8ACB\u6C42\u91D1\u984D\t" + A_line[15] + A_line[16] + "\t\t" + viewcnt + "\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
					viewcnt++;
				}

			if (-1 !== A_uticode[coid].indexOf(G_CODE_ASPX) == false) {
				if (DEBUG_FLG) logging("WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + G_CODE_ASPX);
				logh.putError(G_SCRIPT_WARNING, SCRIPT_FILENAME + "WARNING: \u672A\u8A2D\u5B9A\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059 cardcoid:" + coid + "  \u5185\u8A33\u30B3\u30FC\u30C9:" + G_CODE_ASPX);
				error_flg = true;
				break;
			}

			if (aspFlg == true && preg_match("/" + A_pactid[cnt] + "\t" + A_line[17] + "\t" + G_CODE_ASPX + "\tASP\u4F7F\u7528\u6599\t.*\t.*\t.*\t.*\t" + coid + "\t/", write_buf) == false) //合計行のために表示順を沢山空ける
				{
					write_buf += A_pactid[cnt] + "\t" + A_line[17] + "\t" + G_CODE_ASPX + "\tASP\u4F7F\u7528\u6599\t" + asp_charge + "\t\t100\t" + nowtime + "\t" + coid + "\t" + A_line[0] + "\n";
				}

			if (-1 !== CARD_result.indexOf(A_line[17]) == false && preg_match("/" + A_line[17] + "/", card_xx_write_buf) == false) //card_xx_tbへのコピー文のバッファ
				{
					copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + A_line[17] + "\t" + A_line[17] + "\t" + A_line[0] + "\t" + nowtime + "\t" + nowtime + "\tfalse\n";
					card_xx_write_buf += copy_buf;
				}

			if (target == "n") //card_tbにデータが無いときはコピー文作成
				{
					if (-1 !== CARD_now_result.indexOf(A_line[17]) == false && preg_match("/" + A_line[17] + "/", card_write_buf) == false) {
						copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + A_line[17] + "\t" + A_line[17] + "\t" + A_line[0] + "\t" + nowtime + "\t" + nowtime + "\tfalse\n";
						card_write_buf += copy_buf;
					}

					if (-1 !== CARD_now_delete_result.indexOf(A_line[17]) == true) {
						var del_sql = "delete from card_tb where cardno='" + A_line[17] + "' and pactid=" + A_pactid[cnt] + " and delete_flg=true";

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

	fwrite(carddetail_fp, write_buf);
	fflush(carddetail_fp);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "\u4EF6\u306E\u30C7\u30FC\u30BF\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
	logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "\u4EF6\u306E\u51E6\u7406\u3092\u884C\u3044\u307E\u3057\u305F");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fclose(card_xx_fp);

if (target == "n") {
	fclose(card_fp);
}

fclose(carddetail_fp);

if (fin_cnt < 1) //２重起動ロック解除
	{
		lock(false, dbh);
		if (DEBUG_FLG) logging("ERROR: \uFF11\u4EF6\u3082\u6210\u529F\u3057\u307E\u305B\u3093\u3067\u3057\u305F");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \uFF11\u4EF6\u3082\u6210\u529F\u3057\u307E\u305B\u3093\u3067\u3057\u305F");
		throw die(1);
	}

if (backup == "y") //CARD_DETAILS_X_TBのバックアップ
	//エクスポート失敗した場合
	{
		var carddetailX_exp = DATA_EXP_DIR + "/" + carddetailX_tb + date("YmdHis") + ".exp";
		var sql_str = "select * from " + carddetailX_tb;
		var rtn = dbh.backup(carddetailX_exp, sql_str);

		if (rtn == false) {
			if (DEBUG_FLG) logging("ERROR: " + carddetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + carddetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + carddetailX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + carddetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + carddetailX_exp);
		}
	}

dbh.begin();

if (mode == "o") //対象pactidを１つの文字列に変換
	//CARD_DETAIL_XX_TBの削除
	{
		var pactin = "";

		for (cnt = 0;; cnt < fin_cnt; cnt++) {
			pactin += fin_pact[cnt] + ",";
		}

		pactin = rtrim(pactin, ",");
		dbh.query("delete from " + carddetailX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + A_coid.join(",") + ");", true);
		if (DEBUG_FLG) logging("INFO: " + carddetailX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F " + "delete from " + carddetailX_tb + " where pactid IN (" + pactin + ") and cardcoid in (" + A_coid.join(",") + ");");
		logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + carddetailX_tb + "\u306E\u65E2\u5B58\u30C7\u30FC\u30BF\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F" + carddetailX_tb);
	}

if (filesize(card_xx_filename) != 0) //card_X_tb へインポート
	//インポート失敗した場合
	{
		var cardX_col = ["pactid", "postid", "cardno", "cardno_view", "card_corpno", "recdate", "fixdate", "delete_flg"];
		rtn = doCopyInsert(cardX_tb, card_xx_filename, cardX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + cardX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + cardX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + cardX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + card_xx_filename);
			logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + cardX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + card_xx_filename);
		}
	}

if (target == "n") {
	if (filesize(card_filename) != 0) //削除フラグが立っている電話でコピー文に含まれる電話はcard_tbから消す
		//card_tb へインポート
		//インポート失敗した場合
		{
			for (var sql of Object.values(A_del_sql)) {
				dbh.query(sql, true);
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 card_tb\u306E\u524A\u9664\u6E08\u30AB\u30FC\u30C9\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F(" + sql + ")");
				if (DEBUG_FLG) logging("INFO: ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 card_tb\u306E\u524A\u9664\u6E08\u30AB\u30FC\u30C9\u306E\u524A\u9664\u3092\u884C\u3044\u307E\u3057\u305F(" + sql + ")");
			}

			var card_col = ["pactid", "postid", "cardno", "cardno_view", "card_corpno", "recdate", "fixdate", "delete_flg"];
			rtn = doCopyInsert("card_tb", card_filename, card_col, dbh);

			if (rtn != 0) //ロールバック
				{
					if (DEBUG_FLG) logging("ERROR: card_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
					logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 card_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
					dbh.rollback();
					throw die(1);
				} else {
				if (DEBUG_FLG) logging("INFO: card_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + card_filename);
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 card_tb\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + card_filename);
			}
		}
}

if (filesize(carddetail_filename) != 0) //card_details_X_tb へインポート
	//インポート失敗した場合
	{
		var carddetailX_col = ["pactid", "cardno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "cardcoid", "card_corpno"];
		rtn = doCopyInsert(carddetailX_tb, carddetail_filename, carddetailX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + carddetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + carddetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
				dbh.rollback();
				throw die(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + carddetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + carddetail_filename);
			logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 " + carddetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u3092\u884C\u3044\u307E\u3057\u305F " + carddetail_filename);
		}
	}

dbh.commit();

for (cnt = 0;; cnt < fin_cnt; cnt++) //請求元毎に処理
{
	for (idx = 0;; idx < A_dataDir.length; idx++) //データディレクトリがある時
	//全件指定
	{
		if (pactid == "all") {
			var dataDir = A_dataDir[idx] + "/" + fin_pact[cnt];
		} else {
			dataDir = A_dataDir[idx];
		}

		if (is_dir(dataDir) == true) //ファイルの移動
			{
				var finDir = dataDir + "/fin";

				if (is_dir(finDir) == false) //完了ディレクトリの作成
					{
						if (mkdir(finDir, 700) == false) {
							if (DEBUG_FLG) logging("ERROR: \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + finDir);
							logh.putError(G_SCRIPT_ERROR, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + finDir);
							throw die(1);
						} else {
							if (DEBUG_FLG) logging("INFO: \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
							logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u5B8C\u4E86\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u3057\u307E\u3057\u305F " + finDir);
						}
					}

				clearstatcache();
				dirh = opendir(dataDir);

				while (copyfileName = readdir(dirh)) {
					if (is_file(dataDir + "/" + copyfileName) == true && preg_match("/OTINFO\\.txt$/i", copyfileName) == true) {
						if (rename(dataDir + "/" + copyfileName, finDir + "/" + copyfileName) == false) {
							if (DEBUG_FLG) logging("ERROR: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + dataDir + "/" + copyfileName);
							logh.putError(G_SCRIPT_ERROR, "import_etc_coprhist.php ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + dataDir + "/" + copyfileName);
							throw die(1);
						} else {
							if (DEBUG_FLG) logging("INFO: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + dataDir + "/" + copyfileName);
							logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406  \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u3092\u3057\u307E\u3057\u305F " + dataDir + "/" + copyfileName);
						}

						clearstatcache();
					}
				}

				closedir(dirh);
			}
	}
}

lock(false, dbh);
print("ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(" + SCRIPT_FILENAME + ")\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002\n");
if (DEBUG_FLG) logging("END: ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406(" + SCRIPT_FILENAME + ")\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
logh.putError(G_SCRIPT_END, SCRIPT_FILENAME + " ETC\u30B3\u30FC\u30DD\u30EC\u30FC\u30C8\u30AB\u30FC\u30C9\u8ACB\u6C42\u30C7\u30FC\u30BF\u53D6\u8FBC\u51E6\u7406 \u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F");
throw die(0);

function makeMeisaiLineArray(line, A_form) {
	var A_line = Array();
	var A_used = Array();
	var start = 0;

	for (var idx = 0; idx < A_form.length; idx++) {
		A_line.push(line.substr(start, A_form[idx]));
		A_used.push(A_form[idx]);
		start = array_sum(A_used);
	}

	return A_line;
};

function makeInfoLineArray(line, A_form) {
	var A_line = Array();
	var A_used = Array();
	var start = 0;

	for (var idx = 0; idx < A_form.length; idx++) {
		A_line.push(line.substr(start, A_form[idx]));
		A_used.push(A_form[idx]);
		start = array_sum(A_used);
	}

	return A_line;
};

function checkInfoFormat(A_line, coid) //1,お客様番号
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

	if (coid == HONSHI_COID && A_line[10] != "0000000000") {
		if (DEBUG_FLG) logging("\u30C0\u30DF\u30FC\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[10]);
		errcnt++;
	}

	if (coid == HONSHI_COID && A_line[12] != "0000000000") {
		if (DEBUG_FLG) logging("\u30C0\u30DF\u30FC\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u9055\u3044\u307E\u3059 " + A_line[12]);
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