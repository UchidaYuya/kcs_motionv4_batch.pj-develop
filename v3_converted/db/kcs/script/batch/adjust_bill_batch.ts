#!/usr/local/bin/php
//スクリプト名
//金額調整用ディレクトリ
//DoCoMoのキャリアID
//auのキャリアID
//SoftBankのキャリアID
//DoCoMoの消費税相当額コード
//auの消費税相当額コード（旧）
//auの消費税相当額コード
//SoftBankの消費税相当額コード
//DoCoMoの新コードの税区分
//DoCoMoの税区分個別
//auの新コードの税区分
//SoftBankの新コードの税区分
//付替え後の内訳コード
//付替え後の内訳名称
//auの無視する内訳コード（旧）
//auの無視する内訳コード
//auの無視する内訳コード
//auの＜合計＞の内訳コード（旧）
//auの＜合計＞の内訳コード
//消費税率
//ASP内訳コード
//ASX内訳コード
//0：通常　1:デバッグ
//現在時刻
//テーブル構造
//共通ログファイル名
//---------------------------------------------------------------------------
//パラメータチェック
//調整率チェック
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//ローカルログファイル名（月単位）
//DBハンドル作成
//エラー出力用ハンドル
//テーブルＮＯ取得
//２重起動防止ロックをかける 既に起動中は強制終了
//取得できなければエラー終了
//請求情報が取得出来なければエラー終了
//DoCoMo実行済みチェックフラグ（false：未実行）
//au実行済みチェックフラグ（false：未実行）
//SoftBank実行済みチェックフラグ（false：未実行）
//既に実行済みならここで終了----------------------------------------------------------------------------------------
//調整対象が取得出来なければエラー終了
//トランザクション開始
//DoCoMoの金額調整（未実行の時のみ実行）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//DoCoMoの金額調整
//[引　数] $H_detail（請求データ）、$A_code（調整対象コード）
//[返り値] true、false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//SoftBankの金額調整
//[引　数] $H_detail（請求データ）、$A_code（調整対象コード）
//[返り値] true、false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//AUの金額調整
//[引　数] $H_detail（請求データ）、$A_code（調整対象コード）
//[返り値] true、false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//表示順を調整する
//[引　数] $A_val（請求情報）、$target_cnt（対象の配列ポインタ）、+（表示順を加える）or-（表示順を引く）
//[返り値] $A_val
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//消費税を調整する
//[引　数] $A_val（請求情報）、$tax_code（消費税のコード）、$trg_intax（合算請求金額）、$trg_kobetsutax（個別請求金額）
//[返り値] $A_val
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//挿入する新コードの表示順を取得する
//[引　数] $A_val（請求情報）、$tax_code（消費税のコード）
//[返り値] $detailno
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//子明細を調整したらその親明細を調整する
//[引　数] $A_val（auの請求情報）、$A_code（auの調整対象）、
//$target_cnt（対象の配列ポインタ）, $charge（修正後の親明細請求額）
//[返り値] 書き換えた$A_val
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//AUの合計金額を調整する
//[引　数] $A_val（請求情報）、$val（合計金額）
//[返り値] $A_val
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
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
//現在の日付を返す
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//COPY用文字列作成用関数
//[引　数] $A_val：調整済み請求情報配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//usortソート関数用定義関数
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
echo("\n");
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const SCRIPT_NAME = "adjust_bill_batch.php";
const BILL_ADJUSTMENT_DIR = DATA_DIR + "/bill_adjustment";
const DOCOMO_CARID = 1;
const AU_CARID = 3;
const SOFTBANK_CARID = 4;
const DOCOMO_TAX_CODE = "955";
const AU_TAX_CODE1 = "228";
const AU_TAX_CODE2 = "G01090";
const SOFTBANK_TAX_CODE = "TAX";
const DOCOMO_TAXKUBUN = "\u5408\u7B97";
const DOCOMO_TAXKUBUN_KOBETSU = "\u500B\u5225";
const AU_TAXKUBUN = "\uFF08\u8AB2\u7A0E\u3000\uFF09";
const SOFTBANK_TAXKUBUN = "\u5916\u7A0E";
const DIS_UTIWAKE_CODE = "D100";
const DIS_UTIWAKE_NAME = "\u5272\u5F15\u984D";
const AU_OUT_CODE1 = "000";
const AU_OUT_CODE2 = "C30000";
const AU_OUT_CODE3 = "C40000";
const AU_GOUKEI_CODE1 = "124";
const AU_GOUKEI_CODE2 = "C50000";
const TAX_RATE = 0.08;
const ASP_CODE = "ASP";
const ASX_CODE = "ASX";
const DEBUG_FLG = 1;
GLOBALS.nowtime = date("Y-m-d H:i:s");
GLOBALS.A_column = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "tdcomment", "prtelno"];
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var A_para = ["-y", "-p"];

if (_SERVER.argv.length != 3) //数が正しくない
	{
		usage("", _SERVER.argv.length);
	} else //$cnt 0 はスクリプト名のため無視
	//パラメータの指定が無かったものがあった時
	{
		for (var cnt = 1; cnt < _SERVER.argv.length; cnt++) //請求年月を取得
		{
			if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
				{
					var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

					if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					} else //年月チェック
						{
							GLOBALS.year = billdate.substr(0, 4);
							GLOBALS.month = billdate.substr(4, 2);

							if (GLOBALS.year < date("Y") - 2 || GLOBALS.year > date("Y") || +(GLOBALS.month < 1 || +(GLOBALS.month > 12))) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							}

							if (date("Y") == GLOBALS.year && date("m") < +GLOBALS.month) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\uFF08\u672A\u6765\u6708\uFF09\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							}

							if ((date("Y") - GLOBALS.year) * 12 + (date("m") - +GLOBALS.month) >= 24) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\uFF08\uFF12\uFF14\u30F6\u6708\u4EE5\u524D\uFF09\u3067\u3059\u3002" + _SERVER.argv[cnt]);
							}
						}

					delete A_para[0];
					continue;
				}

			if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
				{
					GLOBALS.pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

					if (ereg("^[0-9]+$", GLOBALS.pactid) == false) {
						usage("\u4F1A\u793E\u30B3\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[cnt]);
					}

					delete A_para[1];
					continue;
				}

			usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[0]);
		}

		if (A_para.length != 0) {
			usage("\u30D1\u30E9\u30E1\u30FC\u30BF\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + _SERVER.argv[0]);
		}
	}

if (is_numeric(ADJUSTMENT_RATE) == false || ADJUSTMENT_RATE < 0) {
	print("\u5272\u5F15\u7387\u306E\u5024\u304C\u4E0D\u6B63\u3067\u3059 " + ADJUSTMENT_RATE + "\n");
	print("/kcs/db_define/define.php\u306E\u5B9A\u6570\"ADJUSTMENT_RATE\"\u306E\u5024\u3092\u4FEE\u6B63\u3057\u3066\u304F\u3060\u3055\u3044\n");
	throw die(1);
}

var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_typeView);
log_listener.PutListener(log_listener_type);
var LocalLogFile = BILL_ADJUSTMENT_DIR + "/adjust_bill_batch" + GLOBALS.year + GLOBALS.month + ".log";
GLOBALS.dbh = new ScriptDB(log_listener);
GLOBALS.logh = new ScriptLogAdaptor(log_listener, true);
O_GLOBALS.tableNo = new TableNo();
GLOBALS.tableNo = O_GLOBALS.tableNo.get(GLOBALS.year, GLOBALS.month);

if (lock(true, GLOBALS.dbh) == false) {
	if (DEBUG_FLG) logging("ERROR: \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	GLOBALS.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " \u8ACB\u6C42\u91D1\u984D\u8ABF\u6574\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059");
	throw die(1);
}

var get_pactname = "select compname from pact_tb where pactid=" + GLOBALS.pactid;
var pactname = GLOBALS.dbh.getOne(get_pactname, true);

if (undefined !== pactname == false || pactname == "") {
	lock(false, GLOBALS.dbh);
	if (DEBUG_FLG) logging("ERROR: \u4F1A\u793E\u540D\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	GLOBALS.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " \u4F1A\u793E\u540D\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	throw die(1);
}

fwrite(STDOUT, pactname + "\u306E" + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306E\u8ACB\u6C42\u91D1\u984D\u3092\u8ABF\u6574\u3057\u307E\u3059\n\n\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F\uFF08N/y\uFF09> ");
var stdin = fopen("php://stdin", "r");
var line = fgets(stdin, 64).trim();

if (line == "y" or line == "Y" == false) {
	lock(false, GLOBALS.dbh);
	fwrite(STDOUT, line + "\uFF1A\u51E6\u7406\u3092\u4E2D\u6B62\u3057\u307E\u3059\n\n");
	throw die(0);
}

GLOBALS.logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAME + " " + pactname + " " + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u306E\u91D1\u984D\u8ABF\u6574\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
if (DEBUG_FLG) logging("START:" + pactname + " " + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u306E\u91D1\u984D\u8ABF\u6574\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
var get_details = "select td.pactid,td.telno,td.code,td.codename,td.charge,td.taxkubun,td.detailno,td.recdate,td.carid,td.tdcomment,td.prtelno\n\t\t\t\t from tel_details_" + GLOBALS.tableNo + "_tb as td left join utiwake_tb as ut on td.code = ut.code and td.carid = ut.carid\n\t\t\t\t where td.pactid=" + GLOBALS.pactid + " order by td.telno,td.detailno";
var A_details = GLOBALS.dbh.getHash(get_details, true);

if (A_details.length < 1) {
	lock(false, GLOBALS.dbh);
	if (DEBUG_FLG) logging("ERROR:" + pactname + " \u306E\u5BFE\u8C61\u6708\u306E\u8ACB\u6C42\u60C5\u5831\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	GLOBALS.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " " + pactname + " \u306E\u5BFE\u8C61\u6708\u306E\u8ACB\u6C42\u60C5\u5831\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	throw die(1);
}

var H_details_docomo = Array();
var H_details_au = Array();
var H_details_softbank = Array();
var docomo_adjusted_flg = false;
var au_adjusted_flg = false;
var softbank_adjusted_flg = false;

for (cnt = 0;; cnt < A_details.length; cnt++) //既にDoCoMoの金額調整が実行済み
{
	if (A_details[cnt].carid == DOCOMO_CARID && A_details[cnt].code == DIS_UTIWAKE_CODE && docomo_adjusted_flg == false) {
		docomo_adjusted_flg = true;
		if (DEBUG_FLG) logging("ERROR:" + pactname + " \u306E" + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306EDoCoMo\u306E\u91D1\u984D\u8ABF\u6574\u306F\u65E2\u306B\u884C\u308F\u308C\u3066\u3044\u307E\u3059\u3002");
		GLOBALS.logh.putError(G_SCRIPT_INFO, SCRIPT_NAME + " " + pactname + " \u306E" + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306EDoCoMo\u306E\u91D1\u984D\u8ABF\u6574\u306F\u65E2\u306B\u884C\u308F\u308C\u3066\u3044\u307E\u3059\u3002");
		continue;
	}

	if (A_details[cnt].carid == AU_CARID && A_details[cnt].code == DIS_UTIWAKE_CODE && au_adjusted_flg == false) {
		au_adjusted_flg = true;
		if (DEBUG_FLG) logging("ERROR:" + pactname + " \u306E" + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306Eau\u306E\u91D1\u984D\u8ABF\u6574\u306F\u65E2\u306B\u884C\u308F\u308C\u3066\u3044\u307E\u3059\u3002");
		GLOBALS.logh.putError(G_SCRIPT_INFO, SCRIPT_NAME + " " + pactname + " \u306E" + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306Eau\u306E\u91D1\u984D\u8ABF\u6574\u306F\u65E2\u306B\u884C\u308F\u308C\u3066\u3044\u307E\u3059\u3002");
		continue;
	}

	if (A_details[cnt].carid == SOFTBANK_CARID && A_details[cnt].code == DIS_UTIWAKE_CODE && softbank_adjusted_flg == false) {
		softbank_adjusted_flg = true;
		if (DEBUG_FLG) logging("ERROR:" + pactname + " \u306E" + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306ESoftBank\u306E\u91D1\u984D\u8ABF\u6574\u306F\u65E2\u306B\u884C\u308F\u308C\u3066\u3044\u307E\u3059\u3002");
		GLOBALS.logh.putError(G_SCRIPT_INFO, SCRIPT_NAME + " " + pactname + " \u306E" + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306ESoftBank\u306E\u91D1\u984D\u8ABF\u6574\u306F\u65E2\u306B\u884C\u308F\u308C\u3066\u3044\u307E\u3059\u3002");
		continue;
	}

	if (A_details[cnt].carid == DOCOMO_CARID && docomo_adjusted_flg == false) {
		if (undefined !== H_details_docomo[A_details[cnt].telno] == false) //電話番号をキーにした配列を作る
			{
				H_details_docomo[A_details[cnt].telno] = Array();
			}

		H_details_docomo[A_details[cnt].telno].push(A_details[cnt]);
	}

	if (A_details[cnt].carid == AU_CARID && au_adjusted_flg == false) {
		if (undefined !== H_details_au[A_details[cnt].telno] == false) //電話番号をキーにした配列を作る
			{
				H_details_au[A_details[cnt].telno] = Array();
			}

		H_details_au[A_details[cnt].telno].push(A_details[cnt]);
	}

	if (A_details[cnt].carid == SOFTBANK_CARID && softbank_adjusted_flg == false) {
		if (undefined !== H_details_softbank[A_details[cnt].telno] == false) //電話番号をキーにした配列を作る
			{
				H_details_softbank[A_details[cnt].telno] = Array();
			}

		H_details_softbank[A_details[cnt].telno].push(A_details[cnt]);
	}
}

delete A_details;

if (docomo_adjusted_flg == true && au_adjusted_flg == true && softbank_adjusted_flg == true) {
	lock(false, GLOBALS.dbh);
	if (DEBUG_FLG) logging("ERROR:" + pactname + " \u306E" + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306E\u91D1\u984D\u8ABF\u6574\u306F\u65E2\u306B\u884C\u308F\u308C\u3066\u3044\u307E\u3059\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	GLOBALS.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " " + pactname + " \u306E" + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u306E\u91D1\u984D\u8ABF\u6574\u306F\u65E2\u306B\u884C\u308F\u308C\u3066\u3044\u307E\u3059\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	throw die(1);
}

var get_adjustcode = "select carid,code from adjust_utiwake_tb where pactid=" + GLOBALS.pactid + " order by carid,code";
var A_adjustcode = GLOBALS.dbh.getHash(get_adjustcode, true);

if (A_adjustcode.length < 1) {
	lock(false, GLOBALS.dbh);
	if (DEBUG_FLG) logging("ERROR:" + pactname + " \u306E\u8ABF\u6574\u5BFE\u8C61\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	GLOBALS.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " " + pactname + " \u306E\u8ABF\u6574\u5BFE\u8C61\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
	throw die(1);
}

var A_code_docomo = Array();
var A_code_au = Array();
var A_code_softbank = Array();

for (cnt = 0;; cnt < A_adjustcode.length; cnt++) //DoCoMoの対象コード
{
	if (A_adjustcode[cnt].carid == DOCOMO_CARID) {
		A_code_docomo.push(A_adjustcode[cnt].code);
	} else if (A_adjustcode[cnt].carid == AU_CARID) {
		A_code_au.push(A_adjustcode[cnt].code);
	} else if (A_adjustcode[cnt].carid == SOFTBANK_CARID) {
		A_code_softbank.push(A_adjustcode[cnt].code);
	}
}

delete A_adjustcode;
GLOBALS.dbh.begin();

if (docomo_adjusted_flg == false && H_details_docomo.length > 0 && A_code_docomo.length > 0) {
	if (DEBUG_FLG) logging("INFO:" + pactname + " DoCoMo\u306E\u91D1\u984D\u8ABF\u6574\u3092\u5B9F\u884C\u3057\u307E\u3059");
	GLOBALS.logh.putError(G_SCRIPT_INFO, SCRIPT_NAME + " " + pactname + " DoCoMo\u306E\u91D1\u984D\u8ABF\u6574\u3092\u5B9F\u884C\u3057\u307E\u3059");
	var res_docomo = adjustDocomo(H_details_docomo, A_code_docomo, GLOBALS.dbh);

	if (res_docomo == false) //ロールバック
		{
			GLOBALS.dbh.rollback();
			lock(false, GLOBALS.dbh);
			if (DEBUG_FLG) logging("ERROR:" + pactname + " DoCoMo\u306E\u91D1\u984D\u8ABF\u6574\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
			GLOBALS.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " " + pactname + " DoCoMo\u306E\u91D1\u984D\u8ABF\u6574\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
			throw die(1);
		}
}

if (au_adjusted_flg == false && H_details_au.length > 0 && A_code_au.length > 0) {
	if (DEBUG_FLG) logging("INFO:" + pactname + " au\u306E\u91D1\u984D\u8ABF\u6574\u3092\u5B9F\u884C\u3057\u307E\u3059");
	GLOBALS.logh.putError(G_SCRIPT_INFO, SCRIPT_NAME + " " + pactname + " au\u306E\u91D1\u984D\u8ABF\u6574\u3092\u5B9F\u884C\u3057\u307E\u3059");
	var res_au = adjustAu(H_details_au, A_code_au, GLOBALS.dbh);

	if (res_au == false) //ロールバック
		{
			GLOBALS.dbh.rollback();
			lock(false, GLOBALS.dbh);
			if (DEBUG_FLG) logging("ERROR:" + pactname + " au\u306E\u91D1\u984D\u8ABF\u6574\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
			GLOBALS.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " " + pactname + " au\u306E\u91D1\u984D\u8ABF\u6574\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
			throw die(1);
		}
}

if (softbank_adjusted_flg == false && H_details_softbank.length > 0 && A_code_softbank.length > 0) {
	if (DEBUG_FLG) logging("INFO:" + pactname + " softbank\u306E\u91D1\u984D\u8ABF\u6574\u3092\u5B9F\u884C\u3057\u307E\u3059");
	GLOBALS.logh.putError(G_SCRIPT_INFO, SCRIPT_NAME + " " + pactname + " softbank\u306E\u91D1\u984D\u8ABF\u6574\u3092\u5B9F\u884C\u3057\u307E\u3059");
	var res_softbank = adjustSoftBank(H_details_softbank, A_code_softbank, GLOBALS.dbh);

	if (res_softbank == false) //ロールバック
		{
			GLOBALS.dbh.rollback();
			lock(false, GLOBALS.dbh);
			if (DEBUG_FLG) logging("ERROR:" + pactname + " SoftBank\u306E\u91D1\u984D\u8ABF\u6574\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
			GLOBALS.logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " " + pactname + " SoftBank\u306E\u91D1\u984D\u8ABF\u6574\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
			throw die(1);
		}
}

GLOBALS.dbh.commit();
if (DEBUG_FLG) logging("END:" + pactname + " " + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u8ACB\u6C42\u5206\u306E\u91D1\u984D\u8ABF\u6574\u304C\u6B63\u5E38\u306B\u7D42\u4E86\u3057\u307E\u3057\u305F");
GLOBALS.logh.putError(G_SCRIPT_INFO, SCRIPT_NAME + " " + pactname + " " + GLOBALS.year + "\u5E74" + GLOBALS.month + "\u6708\u8ACB\u6C42\u5206\u306E\u91D1\u984D\u8ABF\u6574\u304C\u6B63\u5E38\u306B\u7D42\u4E86\u3057\u307E\u3057\u305F");
lock(false, GLOBALS.dbh);
throw die(0);

function adjustDocomo(H_detail, A_code, dbh) //元の請求情報を削除
//log出力
//ファイル名の決定
//ファイルオープン
//ファイルオープン失敗
//レコード数（確認用）
//削除したレコード数と配列の数が違っていたらエラー
{
	var del_sql = "delete from tel_details_" + GLOBALS.tableNo + "_tb " + "where pactid = " + GLOBALS.pactid + " and carid=" + DOCOMO_CARID;
	if (DEBUG_FLG) logging("INFO:DoCoMo\u306E\u5143\u306E\u8ACB\u6C42\u60C5\u5831\u3092\u524A\u9664\u3057\u307E\u3059 " + del_sql);
	var res_cnt = dbh.query(del_sql, true);

	if (res_cnt == false || is_numeric(res_cnt) == false) {
		if (DEBUG_FLG) logging("ERROR:" + key + " sql\u30A8\u30E9\u30FC:" + del_sql);
		print(key + " sql\u30A8\u30E9\u30FC:" + del_sql + "\n");
		return false;
	}

	res_cnt = dbh.affectedRows();
	var filename = BILL_ADJUSTMENT_DIR + "/tel_details_" + GLOBALS.tableNo + "_tb" + GLOBALS.year + GLOBALS.month + GLOBALS.pactid + "docomo.ins";
	var fp = fopen(filename, "w");

	if (fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " \u91D1\u984D\u8ABF\u6574\u51E6\u7406 " + filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		return false;
	}

	var record_cnt = 0;

	for (var key in H_detail) //調整対象以外の請求金額合計
	//調整対象の割引金額合計
	//表示行の一番最後
	//消費税が登場してたらtrue
	//合算の請求金額合計
	//個別の請求金額合計
	//その電話の請求レコード分ループ
	//新コードの表示順を取得
	//表示順の調整
	//割引額＝調整対象割引合計額 - 全体の請求額*0.05（端数切捨て）
	//割引額が0以上は0
	//消費税の調整
	//デバッグ
	//log出力
	//関数でファイルに書き込み
	//ファイルに書き込み
	{
		var A_val = H_detail[key];
		record_cnt += A_val.length;
		var amount_normal = 0;
		var amount_adjust = 0;
		var max_line = 0;
		var tax_appear = false;
		var trg_intax = 0;
		var trg_kobetsutax = 0;

		for (var cnt = 0; cnt < A_val.length; cnt++) //ASPはスキップ（ASPは無いはずだがスキップ）
		{
			if (A_val[cnt].code == ASP_CODE || A_val[cnt].code == ASX_CODE) {
				continue;
			}

			if (A_val[cnt].code == DOCOMO_TAX_CODE) //既に消費税が登場済み（複数消費税があった場合の2個目以降）ならば消費税を削除
				{
					if (tax_appear == true) //表示順の調整
						//log出力
						{
							var A_val = adjustDetailno(A_val, cnt, "-");
							if (DEBUG_FLG) logging("INFO:" + key + " \uFF12\u500B\u76EE\u4EE5\u964D\u306E\u6D88\u8CBB\u7A0E\u3092\u524A\u9664\u3057\u307E\u3059 " + A_val[cnt].code);
							delete A_val[cnt];
							A_val.sort("compareFunction");
							cnt--;
						} else {
						tax_appear = true;
					}

					continue;
				}

			if (-1 !== A_code.indexOf(A_val[cnt].code) == true && A_val[cnt].charge < 0) //調整金額加算
				//表示順の調整
				//log出力
				{
					amount_adjust += A_val[cnt].charge;
					A_val = adjustDetailno(A_val, cnt, "-");
					if (DEBUG_FLG) logging("INFO:" + key + " \u8ABF\u6574\u5BFE\u8C61\u306E\u5185\u8A33\u3092\u524A\u9664\u3057\u307E\u3059 " + A_val[cnt].code);
					delete A_val[cnt];
					A_val.sort("compareFunction");
					cnt--;
				} else //消費税対応
				{
					amount_normal += A_val[cnt].charge;
					var taxkubun = A_val[cnt].taxkubun.replace(/　/g, "");

					if (taxkubun.trim() == DOCOMO_TAXKUBUN) {
						trg_intax += A_val[cnt].charge;
					} else if (taxkubun.trim() == DOCOMO_TAXKUBUN_KOBETSU) {
						trg_kobetsutax += A_val[cnt].charge;
					}
				}
		}

		var A_res = getInsDetailno(A_val, DOCOMO_TAX_CODE);
		var target_cnt = A_res[0];
		var detailno = A_res[1];
		A_val = adjustDetailno(A_val, target_cnt, "+");
		var discount_val = Math.floor(amount_adjust + amount_normal * ADJUSTMENT_RATE);

		if (discount_val > 0) {
			discount_val = 0;
		}

		trg_intax += discount_val;
		A_val = adjustTax(A_val, DOCOMO_TAX_CODE, trg_intax, trg_kobetsutax);
		if (DEBUG_FLG) logging("INFO:" + key + " \u975E\u8ABF\u6574\u5BFE\u8C61\u5408\u8A08:" + amount_normal + " \u8ABF\u6574\u5BFE\u8C61\u5408\u8A08:" + amount_adjust + " \u4E0A\u4E57\u305B\u984D:" + amount_normal * ADJUSTMENT_RATE + " \u5272\u5F15\u984D:" + discount_val + " \u6D88\u8CBB\u7A0E\u5BFE\u8C61\u984D:" + trg_intax);
		var A_tmp_new = {
			pactid: A_val[0].pactid,
			telno: key,
			code: DIS_UTIWAKE_CODE,
			codename: DIS_UTIWAKE_NAME,
			charge: discount_val,
			taxkubun: DOCOMO_TAXKUBUN,
			detailno: detailno,
			recdate: GLOBALS.nowtime,
			carid: DOCOMO_CARID,
			tdcomment: "",
			prtelno: A_val[0].prtelno
		};
		if (DEBUG_FLG) logging("INFO:" + key + " \u65B0\u305F\u306B\u5272\u5F15\u984D\u306E\u5185\u8A33\u3092\u8FFD\u52A0\u3057\u307E\u3059 " + DIS_UTIWAKE_CODE);
		A_val.push(A_tmp_new);
		A_val.sort("compareFunction");
		var write_str = makeCopyfile(A_val);
		fwrite(fp, write_str);
		fflush(fp);
	}

	fclose(fp);

	if (res_cnt != record_cnt) {
		if (DEBUG_FLG) logging("ERROR:l\u524A\u9664\u3057\u305F\u30EC\u30B3\u30FC\u30C9\u3068\u51E6\u7406\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9\u306B\u5DEE\u304C\u3042\u308A\u307E\u3059\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
		return false;
	}

	if (doCopyInsert("tel_details_" + GLOBALS.tableNo + "_tb", filename, GLOBALS.A_column, dbh) != 0) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " \u91D1\u984D\u8ABF\u6574\u51E6\u7406 DoCoMo\u306E\u30B3\u30D4\u30FC\u5931\u6557");
		return false;
	}

	return true;
};

function adjustSoftBank(H_detail, A_code, dbh) //元の請求情報を削除
//log出力
//ファイル名の決定
//ファイルオープン
//ファイルオープン失敗
//レコード数（確認用）
//削除したレコード数と配列の数が違っていたらエラー
{
	var del_sql = "delete from tel_details_" + GLOBALS.tableNo + "_tb " + "where pactid = " + GLOBALS.pactid + " and carid=" + SOFTBANK_CARID;
	if (DEBUG_FLG) logging("INFO:SoftBank\u306E\u5143\u306E\u8ACB\u6C42\u60C5\u5831\u3092\u524A\u9664\u3057\u307E\u3059 " + del_sql);
	var res_cnt = dbh.query(del_sql, true);

	if (res_cnt == false || is_numeric(res_cnt) == false) {
		if (DEBUG_FLG) logging("ERROR:" + key + " sql\u30A8\u30E9\u30FC:" + del_sql);
		print(key + " sql\u30A8\u30E9\u30FC:" + del_sql + "\n");
		return false;
	}

	res_cnt = dbh.affectedRows();
	var filename = BILL_ADJUSTMENT_DIR + "/tel_details_" + GLOBALS.tableNo + "_tb" + GLOBALS.year + GLOBALS.month + GLOBALS.pactid + "softbank.ins";
	var fp = fopen(filename, "w");

	if (fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " \u91D1\u984D\u8ABF\u6574\u51E6\u7406 " + filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		return false;
	}

	var record_cnt = 0;

	for (var key in H_detail) //調整対象以外の請求金額合計
	//調整対象の割引金額合計
	//表示行の一番最後
	//消費税が登場してたらtrue
	//外税の請求金額合計
	//その電話の請求レコード分ループ
	//新コードの表示順を取得
	//表示順の調整
	//割引額＝調整対象割引合計額 - 全体の請求額*0.05（端数切捨て）
	//割引額が0以上は0
	//消費税の調整
	//log出力
	//関数でファイルに書き込み
	//ファイルに書き込み
	{
		var A_val = H_detail[key];
		record_cnt += A_val.length;
		var amount_normal = 0;
		var amount_adjust = 0;
		var max_line = 0;
		var tax_appear = false;
		var trg_intax = 0;

		for (var cnt = 0; cnt < A_val.length; cnt++) //ASPはスキップ（ASPは無いはずだがスキップ）
		{
			if (A_val[cnt].code == ASP_CODE || A_val[cnt].code == ASX_CODE) {
				continue;
			}

			if (A_val[cnt].code == SOFTBANK_TAX_CODE) //既に消費税が登場済み（複数消費税があった場合の2個目以降）ならば消費税を削除
				{
					if (tax_appear == true) //表示順の調整
						//log出力
						{
							var A_val = adjustDetailno(A_val, cnt, "-");
							if (DEBUG_FLG) logging("INFO:" + key + " \uFF12\u500B\u76EE\u4EE5\u964D\u306E\u6D88\u8CBB\u7A0E\u3092\u524A\u9664\u3057\u307E\u3059 " + A_val[cnt].code);
							delete A_val[cnt];
							A_val.sort("compareFunction");
							cnt--;
						} else {
						tax_appear = true;
					}

					continue;
				}

			if (-1 !== A_code.indexOf(A_val[cnt].code) == true && A_val[cnt].charge < 0) //調整金額加算
				//表示順の調整
				//log出力
				{
					amount_adjust += A_val[cnt].charge;
					A_val = adjustDetailno(A_val, cnt, "-");
					if (DEBUG_FLG) logging("INFO:" + key + " \u8ABF\u6574\u5BFE\u8C61\u306E\u5185\u8A33\u3092\u524A\u9664\u3057\u307E\u3059 " + A_val[cnt].code);
					delete A_val[cnt];
					A_val.sort("compareFunction");
					cnt--;
				} else //消費税対応
				{
					amount_normal += A_val[cnt].charge;
					var taxkubun = A_val[cnt].taxkubun.replace(/　/g, "");

					if (taxkubun.trim() == SOFTBANK_TAXKUBUN) {
						trg_intax += A_val[cnt].charge;
					}
				}
		}

		var A_res = getInsDetailno(A_val, SOFTBANK_TAX_CODE);
		var target_cnt = A_res[0];
		var detailno = A_res[1];
		A_val = adjustDetailno(A_val, target_cnt, "+");
		var discount_val = Math.floor(amount_adjust + amount_normal * ADJUSTMENT_RATE);

		if (discount_val > 0) {
			discount_val = 0;
		}

		trg_intax += discount_val;
		A_val = adjustTax(A_val, SOFTBANK_TAX_CODE, trg_intax);
		if (DEBUG_FLG) logging("INFO:" + key + " \u975E\u8ABF\u6574\u5BFE\u8C61\u5408\u8A08:" + amount_normal + " \u8ABF\u6574\u5BFE\u8C61\u5408\u8A08:" + amount_adjust + " \u4E0A\u4E57\u305B\u984D:" + amount_normal * ADJUSTMENT_RATE + " \u5272\u5F15\u984D:" + discount_val + " \u6D88\u8CBB\u7A0E\u5BFE\u8C61\u984D:" + trg_intax);
		var A_tmp_new = {
			pactid: A_val[0].pactid,
			telno: key,
			code: DIS_UTIWAKE_CODE,
			codename: DIS_UTIWAKE_NAME,
			charge: discount_val,
			taxkubun: SOFTBANK_TAXKUBUN,
			detailno: detailno,
			recdate: GLOBALS.nowtime,
			carid: SOFTBANK_CARID,
			tdcomment: "",
			prtelno: A_val[0].prtelno
		};
		if (DEBUG_FLG) logging("INFO:" + key + " \u65B0\u305F\u306B\u5272\u5F15\u984D\u306E\u5185\u8A33\u3092\u8FFD\u52A0\u3057\u307E\u3059 " + DIS_UTIWAKE_CODE);
		A_val.push(A_tmp_new);
		A_val.sort("compareFunction");
		var write_str = makeCopyfile(A_val);
		fwrite(fp, write_str);
		fflush(fp);
	}

	fclose(fp);

	if (res_cnt != record_cnt) {
		if (DEBUG_FLG) logging("ERROR:l\u524A\u9664\u3057\u305F\u30EC\u30B3\u30FC\u30C9\u3068\u51E6\u7406\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9\u306B\u5DEE\u304C\u3042\u308A\u307E\u3059\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
		return false;
	}

	if (doCopyInsert("tel_details_" + GLOBALS.tableNo + "_tb", filename, GLOBALS.A_column, dbh) != 0) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " \u91D1\u984D\u8ABF\u6574\u51E6\u7406 SoftBank\u306E\u30B3\u30D4\u30FC\u5931\u6557");
		return false;
	}

	return true;
};

function adjustAu(H_detail, A_code, dbh) //元の請求情報を削除
//log出力
//ファイル名の決定
//ファイルオープン
//ファイルオープン失敗
//レコード数（確認用）
//古いコードを使うか否か
//削除したレコード数と配列の数が違っていたらエラー
{
	var del_sql = "delete from tel_details_" + GLOBALS.tableNo + "_tb " + "where pactid = " + GLOBALS.pactid + " and carid=" + AU_CARID;
	if (DEBUG_FLG) logging("INFO:au\u306E\u5143\u306E\u8ACB\u6C42\u60C5\u5831\u3092\u524A\u9664\u3057\u307E\u3059 " + del_sql);
	var res_cnt = dbh.query(del_sql, true);

	if (res_cnt == false || is_numeric(res_cnt) == false) {
		if (DEBUG_FLG) logging("ERROR:" + key + " sql\u30A8\u30E9\u30FC:" + del_sql);
		print(key + " sql\u30A8\u30E9\u30FC:" + del_sql + "\n");
		return false;
	}

	res_cnt = dbh.affectedRows();
	var filename = BILL_ADJUSTMENT_DIR + "/tel_details_" + GLOBALS.tableNo + "_tb" + GLOBALS.year + GLOBALS.month + GLOBALS.pactid + "au.ins";
	var fp = fopen(filename, "w");

	if (fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " \u91D1\u984D\u8ABF\u6574\u51E6\u7406 " + filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		return false;
	}

	var record_cnt = 0;
	var old_flg = false;

	for (var key in H_detail) //調整対象以外の請求金額合計
	//調整対象以外の親明細金額合計
	//調整対象の割引金額合計
	//消費税が登場してたらtrue
	//このフラグがtrueの間は削除し続ける（親明細が調整対象中）
	//課税の請求額合計
	//元の消費税
	//その電話の請求レコード分ループ
	//明細ごとのforループ閉じ
	//新コードの表示順を取得
	//表示順の調整
	//割引額＝調整対象割引合計額 - 全体の請求額*0.05（端数切捨て）
	//割引額が0以上は0
	//消費税の調整
	//log出力
	//合計金額を更新（レコード削除によってずれているので）
	//配列に追加
	//関数でファイルに書き込み
	//ファイルに書き込み
	{
		var A_val = H_detail[key];
		record_cnt += A_val.length;
		var amount_normal = 0;
		var amount_pare = 0;
		var amount_adjust = 0;
		var tax_appear = false;
		var pare_flg = false;
		var trg_intax = 0;
		var tax_org = 0;

		for (var cnt = 0; cnt < A_val.length; cnt++) //<合計＞、コード000、ASPはスキップ（ASPは無いはずだがスキップ）
		{
			if (A_val[cnt].code == AU_GOUKEI_CODE1 || A_val[cnt].code == AU_GOUKEI_CODE2 || A_val[cnt].code == AU_OUT_CODE1 || A_val[cnt].code == AU_OUT_CODE2 || A_val[cnt].code == AU_OUT_CODE3 || A_val[cnt].code == ASP_CODE || A_val[cnt].code == ASX_CODE) {
				continue;
			}

			if (A_val[cnt].code == AU_TAX_CODE1 || A_val[cnt].code == AU_TAX_CODE2) //古いコードか？新しいコードか？
				//既に消費税が登場済み（複数消費税があった場合の2個目以降）ならば消費税を削除
				{
					if (A_val[cnt].code == AU_TAX_CODE1) {
						old_flg = true;
					} else {
						old_flg = false;
					}

					if (tax_appear == true) //元の消費税
						//表示順の調整
						//log出力
						{
							tax_org += A_val[cnt].charge;
							var A_val = adjustDetailno(A_val, cnt, "-");
							if (DEBUG_FLG) logging("INFO:" + key + " \uFF12\u500B\u76EE\u4EE5\u964D\u306E\u6D88\u8CBB\u7A0E\u3092\u524A\u9664\u3057\u307E\u3059 " + A_val[cnt].code);
							delete A_val[cnt];
							A_val.sort("compareFunction");
							cnt--;
						} else //元の消費税
						{
							tax_org += A_val[cnt].charge;
							tax_appear = true;
						}

					continue;
				}

			if (preg_match("/^\u3000/", A_val[cnt].codename) == false) //調整対象に入っていたら調整する
				{
					if (-1 !== A_code.indexOf(A_val[cnt].code) == true && A_val[cnt].charge < 0) //親明細対象中フラグを立てる（子明細の削除が必要）
						//調整金額加算
						//表示順の調整
						//log出力
						{
							pare_flg = true;
							amount_adjust += A_val[cnt].charge;
							A_val = adjustDetailno(A_val, cnt, "-");
							if (DEBUG_FLG) logging("INFO:" + key + " \u8ABF\u6574\u5BFE\u8C61\u306E\u5185\u8A33\u3092\u524A\u9664\u3057\u307E\u3059 " + A_val[cnt].code);
							delete A_val[cnt];
							A_val.sort("compareFunction");
							cnt--;
						} else //子明細が無い時（次が再掲載ではない）
						{
							pare_flg = false;

							if (preg_match("/^\u3000/", A_val[cnt + 1].codename) == false) //非調整対象額加算
								{
									amount_normal += A_val[cnt].charge;
								}

							if (A_val[cnt].taxkubun == AU_TAXKUBUN) {
								trg_intax += A_val[cnt].charge;
							}
						}
				} else if (preg_match("/^\u3000/", A_val[cnt].codename) == true) //調整対象に入っていたら調整する
				{
					if (-1 !== A_code.indexOf(A_val[cnt].code) == true && A_val[cnt].charge < 0) //親明細を調整する
						//親明細も調整対象の時
						//log出力
						{
							amount_adjust += A_val[cnt].charge;
							A_val = rewriteAuPareAmount(A_val, A_code, cnt, A_val[cnt].charge);

							if (pare_flg == true || A_val == false) //log出力
								{
									if (DEBUG_FLG) logging("ERROR:" + key + " \u89AA\u660E\u7D30\u3001\u5B50\u660E\u7D30\u5171\u306B\u8ABF\u6574\u5BFE\u8C61\u306B\u306A\u3063\u3066\u307E\u3059\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059 " + A_val[cnt].code);
									return false;
								}

							A_val = adjustDetailno(A_val, cnt, "-");
							if (DEBUG_FLG) logging("INFO:" + key + " \u8ABF\u6574\u5BFE\u8C61\u306E\u305F\u3081\u524A\u9664\u3057\u307E\u3059 " + A_val[cnt].code);
							delete A_val[cnt];
							A_val.sort("compareFunction");
							cnt--;
						} else //親明細が調整中ならば削除処理
						//消費税対象額
						{
							if (pare_flg == true) //表示順の調整
								//log出力
								{
									A_val = adjustDetailno(A_val, cnt, "-");
									if (DEBUG_FLG) logging("INFO:" + key + " \u89AA\u660E\u7D30\u304C\u8ABF\u6574\u5BFE\u8C61\u306E\u305F\u3081\u524A\u9664\u3057\u307E\u3059 " + A_val[cnt].code);
									delete A_val[cnt];
									A_val.sort("compareFunction");
									cnt--;
								} else {
								amount_normal += A_val[cnt].charge;
							}

							if (A_val[cnt].taxkubun == AU_TAXKUBUN) {
								trg_intax += A_val[cnt].charge;
							}
						}
				}
		}

		if (old_flg == true) {
			var A_res = getInsDetailno(A_val, AU_TAX_CODE1);
		} else {
			A_res = getInsDetailno(A_val, AU_TAX_CODE2);
		}

		var target_cnt = A_res[0];
		var detailno = A_res[1];
		A_val = adjustDetailno(A_val, target_cnt, "+");
		var discount_val = Math.floor(amount_adjust + amount_normal * ADJUSTMENT_RATE);

		if (discount_val > 0) {
			discount_val = 0;
		}

		trg_intax += discount_val;

		if (old_flg == true) {
			A_val = adjustTax(A_val, AU_TAX_CODE1, trg_intax);
		} else {
			A_val = adjustTax(A_val, AU_TAX_CODE2, trg_intax);
		}

		if (DEBUG_FLG) logging("INFO:" + key + " \u975E\u8ABF\u6574\u5BFE\u8C61\u5408\u8A08:" + amount_normal + " \u8ABF\u6574\u5BFE\u8C61\u5408\u8A08:" + amount_adjust + " \u4E0A\u4E57\u305B\u984D:" + amount_normal * ADJUSTMENT_RATE + " \u5272\u5F15\u984D:" + discount_val + " \u6D88\u8CBB\u7A0E\u5BFE\u8C61\u984D:" + trg_intax);
		var A_tmp_new = {
			pactid: A_val[0].pactid,
			telno: key,
			code: DIS_UTIWAKE_CODE,
			codename: DIS_UTIWAKE_NAME,
			charge: discount_val,
			taxkubun: AU_TAXKUBUN,
			detailno: detailno,
			recdate: GLOBALS.nowtime,
			carid: AU_CARID,
			tdcomment: "",
			prtelno: A_val[0].prtelno
		};
		if (DEBUG_FLG) logging("INFO:" + key + " \u65B0\u305F\u306B\u5272\u5F15\u984D\u306E\u5185\u8A33\u3092\u8FFD\u52A0\u3057\u307E\u3059 " + DIS_UTIWAKE_CODE);
		var goukei_val = amount_normal + discount_val + Math.floor(trg_intax * TAX_RATE);
		A_val = adjustAuGoukei(A_val, goukei_val);
		A_val.push(A_tmp_new);
		A_val.sort("compareFunction");
		var write_str = makeCopyfile(A_val);
		fwrite(fp, write_str);
		fflush(fp);
	}

	fclose(fp);

	if (res_cnt != record_cnt) {
		if (DEBUG_FLG) logging("ERROR:l\u524A\u9664\u3057\u305F\u30EC\u30B3\u30FC\u30C9\u3068\u51E6\u7406\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9\u306B\u5DEE\u304C\u3042\u308A\u307E\u3059\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059");
		return false;
	}

	if (doCopyInsert("tel_details_" + GLOBALS.tableNo + "_tb", filename, GLOBALS.A_column, dbh) != 0) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAME + " \u91D1\u984D\u8ABF\u6574\u51E6\u7406 au\u306E\u30B3\u30D4\u30FC\u5931\u6557");
		return false;
	}

	return true;
};

function adjustDetailno(A_val, target_cnt, type) {
	for (var cnt = target_cnt; cnt < A_val.length; cnt++) {
		if (type == "+") {
			A_val[cnt].detailno++;
		}

		if (type == "-") {
			A_val[cnt].detailno--;
		}
	}

	return A_val;
};

function adjustTax(A_val, tax_code, trg_intax, trg_kobetsutax = 0) {
	var intax = Math.floor(trg_intax * TAX_RATE);
	var kobetsutax = Math.floor(trg_kobetsutax * TAX_RATE);

	for (var cnt = 0; cnt < A_val.length; cnt++) {
		if (A_val[cnt].code == tax_code) {
			A_val[cnt].charge = intax + kobetsutax;
		}
	}

	return A_val;
};

function getInsDetailno(A_val, tax_code) //もし消費税が無かったら最大の表示順
{
	for (var cnt = 0; cnt < A_val.length; cnt++) {
		if (A_val[cnt].code == tax_code) {
			return [cnt, A_val[cnt].detailno];
		}
	}

	return [cnt, A_val[cnt - 1].detailno + 1];
};

function rewriteAuPareAmount(A_val, A_code, target_cnt, charge) //対象の配列ポインタからキーの値を減らし、最初に現れる通常内訳が基本料ならOK
{
	for (var cnt = target_cnt; cnt >= 0; cnt--) //最初に現れる再掲載以外
	{
		if (preg_match("/^\u3000/", A_val[cnt].codename) == false && A_val[cnt].code != AU_OUT_CODE1 && A_val[cnt].code != AU_OUT_CODE2 && A_val[cnt].code != AU_OUT_CODE3) //これが調整対象ならばエラー
			{
				if (-1 !== A_code.indexOf(A_val[cnt].code) == true) {
					return false;
					break;
				}

				if (DEBUG_FLG) logging("INFO:" + A_val[cnt].telno + " \u5B50\u660E\u7D30\u306E\u984D\u304C\u5909\u308F\u3063\u305F\u306E\u3067\u89AA\u660E\u7D30\u306E\u984D\u3092\u8ABF\u6574\u3057\u307E\u3059 " + A_val[cnt].charge + " " + charge);
				A_val[cnt].charge -= charge;
				return A_val;
				break;
			}
	}

	return false;
};

function adjustAuGoukei(A_val, val) {
	for (var cnt = 0; cnt < A_val.length; cnt++) {
		if (A_val[cnt].code == AU_GOUKEI_CODE1 || A_val[cnt].code == AU_GOUKEI_CODE2) {
			A_val[cnt].charge = val;
			break;
		}
	}

	return A_val;
};

function usage(comment) {
	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -y=YYYYMM -p={PACTID}\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u3092\u5B9F\u884C)\n");
	throw die(1);
};

function lock(is_lock, db) //ロックする
{
	if (db == undefined) {
		return false;
	}

	var pre = db.escape("batch_" + SCRIPT_NAME);

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

function makeCopyfile(A_val) {
	var str_all = "";

	for (var cnt = 0; cnt < A_val.length; cnt++) {
		var str = A_val[cnt].join("\t") + "\n";
		str_all += str;
	}

	return str_all;
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

function compareFunction(val1, val2) {
	if (val1.detailno == val2.detailno) {
		return 0;
	}

	if (val1.detailno < val2.detailno) {
		return -1;
	}

	if (val1.detailno > val2.detailno) {
		return 1;
	}
};