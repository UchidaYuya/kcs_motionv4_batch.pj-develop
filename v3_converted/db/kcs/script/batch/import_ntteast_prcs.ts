//===========================================================================
//機能：請求情報ファイルインポートプロセス（NTT東日本専用）
//
//作成：中西
//===========================================================================
//このスクリプトの日本語処理名
//NTT東日本
//primeは'K'又は'D'、customは'K'
//レコード１行の長さ
//NTT東日本のキャリアID
//網種別は"1"
//NTT東日本の地域コード
//NTT東日本の回線ID
//prime,customを表す接尾子
//以下はcommonで定義済み
//define("G_AUTH_ASP", 2);	//ASP使用料を表示するか
//define("G_CODE_ASP", "ASP");	//ASP利用料金
//define("G_CODE_ASX", "ASX");	//同税額
//define("G_EXCISE_RATE", 0.05);//消費税率
//---------------------------------------------------------------------------
//固定長フォーマットの定義
//管理レコード
//明細内訳レコード
//請求内訳[N]レコード
//請求合計レコード
//会社合計レコード
//税区分コード表
//$H_Zei_CODE = array( '10'=>"内税", '11'=>"合算", '13'=>"非対象等", '15'=>"個別", '16'=>"非対象等", '80'=>"", '90'=>"", '00'=>"" );
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//標準出力に出してみる.
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//開始メッセージ
//パラメータチェック
//$cnt 0 はスクリプト名のため無視
//END 引数の取得
//請求データファイルがあるディレクトリを指定
//処理する契約ＩＤ配列
//処理が終了した pactid を格納するための配列
//処理が失敗した pactid を格納するための配列
//契約ＩＤの指定が全て（all）の時
//テーブルＮＯ取得
//テーブル名設定
//pact_tb より登録されている契約ＩＤ、会社名を取得
//会社名マスターを作成
//処理する契約ＩＤ
//全てのPactについてLOOP.
//END Pactごとの処理.
//成功したファイルのPactをキーワード(COMPLETE_PACTS)と共に標準出力に出す.
//このキーワードを親スクリプト側で拾って処理する.
//失敗したファイルのPactをキーワード(FAILED_PACTS)と共に標準出力に出す.
//このキーワードを親スクリプト側で拾って処理する.
//END Main
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 各ファイルについての処理
//[引　数] $fileName 対象ファイル名
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 管理レコードのチェック
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話番号登録を行う
//[引　数] $telno 電話番号
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話番号登録を行うinsファイルへの書き出し。
//[引　数] $telno 電話番号
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 請求書作成番号合計レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 会社合計レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 インサートファイルに書き出す
//[引　数] $A_fileData 書き出すデータ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $str 元になる文字列
//$A_pos 区切り位置を有する配列
//[返り値] 分割された文字列の配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ルート部署のシステム用部署ＩＤを取得する
//[引　数] $pactid：契約ＩＤ
//$table：テーブル名
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ＡＳＰ利用料表示設定があるかないか
//[引　数] $pactid：契約ＩＤ
//[返り値] ある：true、ない：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ＡＳＰ利用料金の取得
//[引　数] $pactid：契約ＩＤ
//[返り値] ＡＳＰ利用料金
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
error_reporting(E_ALL);
const SCRIPT_NAMEJ = "NTT\u6771\u65E5\u672C\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8";

require("lib/script_db.php");

require("lib/script_log.php");

const NTTEAST_DIR = "/NTT_east/bill";
const NTTEAST_PAT = "/^[KD]/i";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const LINE_LENGTH = 512;
const NTTEAST_CARRIER_ID = 7;
const NET_KIND = 1;
const NTTEAST_AREA_ID = 34;
const NTTEAST_CIRCUIT_ID = 17;
const FILE_EXT = "_prcs";
var Kanri_POS = [5, 11, 13, 17, 21, 23, 24, 26, 27, 30, 31, 32];
var Meisai_POS = [6, 10, 11, 13, 15, 17, 27, 33, 34, 35, 47, 51, 55, 59, 63, 67, 71, 126, 136, 141, 163, 185, 207, 229, 251, 273, 295, 317, 339, 361, 383, 405, 427, 449, 471, 493];
var Seikyu_POS = [2, 6, 7, 17, 20];
var Sum_POS = [10, 11, 13, 15, 17, 27, 33, 47, 51, 55, 59, 63, 71, 126, 136, 144, 151, 159, 199, 204, 244];
var Total_POS = [5, 11, 13, 17, 29, 37];
var H_Zei_CODE = {
	"10": "\u5185\u7A0E",
	"11": "\u5408\u7B97",
	"13": "\u975E\u5BFE\u8C61\u7B49",
	"15": "\u500B\u5225",
	"16": "\u975E\u5BFE\u8C61\u7B49",
	"20": "\u5185\u7A0E",
	"21": "\u5408\u7B97",
	"23": "\u975E\u5BFE\u79F0\u7B49",
	"25": "\u500B\u5225",
	"80": "",
	"82": "",
	"90": "",
	"92": "",
	"00": ""
};
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
log_listener.PutListener(log_listener_type);
log_listener.PutListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "\u51E6\u7406\u958B\u59CB.");

if (_SERVER.argv.length != 6) //数が正しくない
	{
		usage("", dbh);
		throw die(1);
	}

var argvCnt = _SERVER.argv.length;

for (var cnt = 1; cnt < argvCnt; cnt++) //mode を取得
{
	if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
		{
			var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^[ao]$", mode) == false) {
				usage("ERROR: \u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			}

			continue;
		}

	if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		{
			var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

			if (ereg("^[0-9]{6}$", billdate) == false) {
				usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			} else //年月チェック
				{
					var year = billdate.substr(0, 4);
					var month = billdate.substr(4, 2);

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059(" + billdate + ")", dbh);
					}
				}

			var diffmon = (date("Y") - year) * 12 + (date("m") - month);

			if (diffmon < 0) {
				usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\u672A\u6765\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")", dbh);
			} else if (diffmon >= 24) {
				usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\uFF12\u5E74\u4EE5\u4E0A\u524D\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")", dbh);
			}

			continue;
		}

	if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		{
			var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
				usage("ERROR: \u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			}

			continue;
		}

	if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		{
			var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^[ny]$", backup) == false) {
				usage("ERROR: \u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			}

			continue;
		}

	if (ereg("^-t=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		{
			var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^[no]$", teltable) == false) {
				usage("ERROR: \u4ECA\u6708\u306E\u30C7\u30FC\u30BF\u304B\u3069\u3046\u304B\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			}

			continue;
		}

	usage("", dbh);
}

var dataDir = DATA_DIR + "/" + billdate + NTTEAST_DIR;

if (is_dir(dataDir) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093.");
}

var A_pactid = Array();
var A_pactDone = Array();
var A_pactFailed = Array();

if (pactid_in == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{
		var fileName;
		var dirh = opendir(dataDir);

		while (fileName = readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		{
			if (is_dir(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {
				A_pactid.push(fileName);
			}

			clearstatcache();
		}

		closedir(dirh);
	} else {
	A_pactid.push(pactid_in);
}

if (A_pactid.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093.");
	throw die(1);
}

var sql = "select code,name,codetype from utiwake_tb where carid=" + NTTEAST_CARRIER_ID;
var H_result = dbh.getHash(sql, true);

for (cnt = 0;; cnt < H_result.length; cnt++) //ＤＢの内訳コードには"網種別-"が含まれているので、それを除く.
//内訳コード => 内訳内容
{
	var code = H_result[cnt].code;
	code = preg_replace("/^" + NET_KIND + "\\-/", "", code);
	H_utiwake[code] = H_result[cnt];
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var telX_tb = "tel_" + tableNo + "_tb";
var postrelX_tb = "post_relation_" + tableNo + "_tb";
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
sql = "select pactid,compname from pact_tb order by pactid";
H_result = dbh.getHash(sql, true);
var pactCnt = H_result.length;

for (cnt = 0;; cnt < pactCnt; cnt++) //pactid => 会社名
{
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

pactCnt = A_pactid.length;
A_pactid.sort();

for (cnt = 0;; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
//処理する請求データファイル名配列
//請求データファイル名を取得する
//請求データファイルがなかった場合
//bill_prtel_tb より請求番号を得る（ここでは親番号ではない）
//請求月電話番号マスター作成
//ルート部署を取得
//現在用
//請求月用
//詳細データを保存する
//正常処理が終わった pactid のみ書き出し処理
{
	if (undefined !== H_pactid[A_pactid[cnt]] == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093.");
		continue;
	}

	var pactid = A_pactid[cnt];
	var pactname = H_pactid[pactid];
	var A_billFile = Array();
	var dataDirPact = dataDir + "/" + pactid;
	dirh = opendir(dataDirPact);

	while (fileName = readdir(dirh)) {
		if (is_file(dataDirPact + "/" + fileName) == true) //ファイル名の先頭文字が適合するものだけ
			{
				if (preg_match(NTTEAST_PAT, fileName)) {
					A_billFile.push(fileName);
				} else {
					logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + "\u306F\u51E6\u7406\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F.");
				}
			}

		clearstatcache();
	}

	if (A_billFile.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "\u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093.");
			closedir(dirh);
			continue;
		}

	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5BFE\u8C61\u3068\u306A\u308B\u30D5\u30A1\u30A4\u30EB\uFF1A" + A_billFile.join(","));
	closedir(dirh);
	var A_codes = Array();
	sql = "select prtelno from bill_prtel_tb where pactid=" + pactid + " and carid=" + NTTEAST_CARRIER_ID;
	H_result = dbh.getHash(sql, true);

	for (var idx = 0; idx < H_result.length; idx++) {
		A_codes.push(H_result[idx].prtelno);
	}

	if (A_codes.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "\u306B\u3064\u3044\u3066\u306E\u8ACB\u6C42\u756A\u53F7\u304Cbill_prtel_tb\u306B\u898B\u3064\u304B\u308A\u307E\u305B\u3093.");
			continue;
		}

	var A_telno = Array();
	sql = "select telno from tel_tb where pactid=" + pactid + " and carid=" + NTTEAST_CARRIER_ID;

	for (var data of Object.values(dbh.getHash(sql, true))) {
		A_telno.push(data.telno);
	}

	var A_telnoX = Array();
	sql = "select telno from " + telX_tb + " where pactid=" + A_pactid[cnt] + " and carid=" + NTTEAST_CARRIER_ID;

	for (var data of Object.values(dbh.getHash(sql, true))) {
		A_telnoX.push(data.telno);
	}

	var rootPostid = getRootPostid(pactid, "post_relation_tb");
	var rootPostidX = getRootPostid(pactid, postrelX_tb);

	if (rootPostid == "") //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "post_relation_tb\u304B\u3089Root\u90E8\u7F72\u306E\u53D6\u5F97\u306B\u306B\u5931\u6557.");
			continue;
		}

	if (rootPostidX == "") //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + postrelX_tb + "\u304B\u3089Root\u90E8\u7F72\u306E\u53D6\u5F97\u306B\u306B\u5931\u6557.");
			continue;
		}

	A_billFile.sort();
	var A_fileData = Array();
	var A_telData = Array();
	var A_telXData = Array();
	var errFlag = false;

	for (var fileName of Object.values(A_billFile)) //読込電話件数
	//読込明細件数
	//追加する電話数
	//追加する電話数
	{
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u958B\u59CB.");
		var ReadTelCnt = 0;
		var ReadMeisaiCnt = 0;
		var AddTelCnt = 0;
		var AddTelXCnt = 0;

		if (doEachFile(dataDirPact + "/" + fileName, pactid, billdate, A_fileData, dbh) == 1) //エラーがあったらそこで中断.
			{
				errFlag = true;
				break;
			}

		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u5B8C\u4E86:\u96FB\u8A71\u4EF6\u6570=" + ReadTelCnt + ":\u660E\u7D30\u4EF6\u6570=" + ReadMeisaiCnt + ":\u8FFD\u52A0\u96FB\u8A71\u4EF6\u6570(tel_tb)=" + AddTelCnt + ":\u8FFD\u52A0\u96FB\u8A71\u4EF6\u6570(" + telX_tb + ")=" + AddTelXCnt);
	}

	if (errFlag == false) //ファイルに書き出す
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30FC\u30BF\u66F8\u51FA\u51E6\u7406\u958B\u59CB.");

			if (writeTelData(pactid) != 0 || writeInsFile(pactid, billdate, A_fileData) != 0) //失敗を記録する.
				//次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
					A_pactFailed.push(pactid);
					continue;
				}

			A_pactDone.push(pactid);
		} else //失敗を記録する
		{
			A_pactFiled.push(pactid);
		}
}

if (A_pactDone.length > 0) {
	print("COMPLETE_PACTS," + A_pactDone.join(",") + "\n");
} else {
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u8AAD\u307F\u8FBC\u307F\u306B\u6210\u529F\u3057\u305FPact\u304C\uFF11\u3064\u3082\u7121\u304B\u3063\u305F.");
}

if (A_pactFailed.length > 0) {
	print("FAILED_PACTS," + A_pactFailed.join(",") + "\n");
}

logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5B8C\u4E86.");
throw die(0);

function doEachFile(fileName, pactid, billdate, A_fileData, db) //ファイルオープン
//管理レコードのチェック
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	var fp = fopen(fileName, "rb");

	if (fp == undefined) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	if (flock(fp, LOCK_SH) == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u30ED\u30C3\u30AF\u306B\u5931\u6557.");
		fclose(fp);
		return 1;
	}

	var line = fgets(fp);
	line = rtrim(line, "\r\n");

	if (checkKanriRecord(line, fileName, pactid, billdate, db) == 1) {
		flock(fp, LOCK_UN);
		fclose(fp);
		return 1;
	}

	var ChargeSum = 0;
	var CompSum = 0;
	var TotalUp = 0;

	while (line = fgets(fp)) //改行取り
	//１行の長さチェック
	//データ種類を見分ける
	//電話明細内訳レコード
	{
		if (feof(fp)) //おしまい.
			{
				break;
			}

		line = rtrim(line, "\r\n");

		if (line.length != LINE_LENGTH) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u4E00\u884C\u306E\u9577\u3055\u304C\u7570\u5E38(" + line.length + "!=" + LINE_LENGTH + ").");
			flock(fp, LOCK_UN);
			fclose(fp);
			return 1;
		}

		line = mb_convert_encoding(line, "UTF-8");
		var dataKind = line.substr(11, 2);

		if (dataKind == "11") {
			var sum = 0;

			if (doTelRecord(line, pactid, A_fileData, sum, db) == 1) {
				flock(fp, LOCK_UN);
				fclose(fp);
				return 1;
			}

			TotalUp += sum;
		} else if (dataKind == "51") {
			if (doSumRecord(line, db) == 1) {
				flock(fp, LOCK_UN);
				fclose(fp);
				return 1;
			}
		} else if (dataKind == "91") {
			if (doTotalRecord(line, TotalUp, db) == 1) {
				flock(fp, LOCK_UN);
				fclose(fp);
				return 1;
			}
		} else {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u672A\u77E5\u306E\u30C7\u30FC\u30BF\u7A2E\u985E(" + dataKind + ").");
			flock(fp, LOCK_UN);
			fclose(fp);
			return 1;
		}
	}

	flock(fp, LOCK_UN);
	fclose(fp);
	return 0;
};

function checkKanriRecord(line, fileName, pactid, billdate, db) //１行の長さチェック
//データ種類チェック
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;

	if (line.length != LINE_LENGTH) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u4E00\u884C\u306E\u9577\u3055\u304C\u7570\u5E38(" + line.length + "!=" + LINE_LENGTH + ").");
		return 1;
	}

	if (!("Kanri_POS" in global)) Kanri_POS = undefined;
	var record = splitFix(line, Kanri_POS);

	if (record[2] != "01") //管理レコードは"01"
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u7BA1\u7406\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[2] + ").");
			return 1;
		}

	if (record[8] != NET_KIND) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u7DB2\u7A2E\u5225\u306B\u7570\u5E38(" + record[8] + ").");
		return 1;
	}

	var target_yyyymm = record[4] + record[5];

	if (target_yyyymm != billdate) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u30D5\u30A1\u30A4\u30EB\u306E\u5E74\u6708\u304C\u5BFE\u8C61\u5E74\u6708\u3068\u7570\u306A\u308A\u307E\u3059(" + target_yyyymm + "!=" + billdate + ").");
		return 1;
	}

	return 0;
};

function doTelRecord(line, pactid, A_fileData, sum, db) //pactごとの請求番号
//ご請求金額
//請求内訳の合計
//読込電話件数
//読込明細件数
//分割してみる.
//DEBUG * 表示してみる
//print "**** doTelRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//請求番号のチェック
//レコードMo.
//Type1のレコード = 複数レコードの先頭.
//合計を保持する.
{
	if (!("Meisai_POS" in global)) Meisai_POS = undefined;
	if (!("Seikyu_POS" in global)) Seikyu_POS = undefined;
	if (!("A_codes" in global)) A_codes = undefined;
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	if (!("ChargeSum" in global)) ChargeSum = undefined;
	if (!("CompSum" in global)) CompSum = undefined;
	if (!("ReadTelCnt" in global)) ReadTelCnt = undefined;
	if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var record = splitFix(line, Meisai_POS);

	if (-1 !== A_codes.indexOf(record[6]) == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u756A\u53F7\u304C\u9055\u3044\u307E\u3059(" + record[6] + ").");
		return 1;
	}

	var telno = rtrim(record[0]) + rtrim(record[1]);
	var recNo = +record[4];

	if (recNo == 1) //電話番号の登録
		//読み込んだレコード数をカウントする.
		//１つ前の電話の請求金額をチェック.
		//print "DEBUG: ご請求金額=" . $ChargeSum . "\n";
		{
			registTel(telno);
			ReadTelCnt++;

			if (ChargeSum != 0) {
				if (ChargeSum != CompSum) {
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u3054\u8ACB\u6C42\u91D1\u984D\u304C\u5185\u8A33\u306E\u5408\u8A08\u306B\u4E00\u81F4\u3057\u307E\u305B\u3093.(" + ChargeSum + "!=" + CompSum + ").");
					return 1;
				}
			}

			ChargeSum = +record[18];
			CompSum = 0;
		}

	for (var n = 0; n < 16; n++) //最大16レコード
	//内訳コードが空白だったらスキップ
	//請求内訳コードを調べる
	//税コードのチェック
	//明細データを配列に保持する.
	//読み込んだレコード数をカウントする.
	{
		var seikyu = record[20 + n];

		if (seikyu[0] == " " && seikyu[1] == " ") {
			continue;
		}

		var s_rec = splitFix(seikyu, Seikyu_POS);
		var code = s_rec[1];
		var charge = +s_rec[3];
		var zei = s_rec[5];

		if (!(undefined !== H_Zei_CODE[zei])) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4E0D\u660E\u306A\u7A0E\u30B3\u30FC\u30C9\u3067\u3059(" + zei + ").");
			return 1;
		}

		if (undefined !== H_utiwake[code]) //print "DEBUG: ".  $H_utiwake[$code]["name"] . ", " . $charge . " 円\n";
			{
				if (H_utiwake[code].codetype == 0) //0のみ合計計算対象
					//合計値を得る
					{
						sum += charge;
					}
			} else {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059(" + code + ").");
			return 1;
		}

		var A_meisai = [telno, code, charge, zei, record[6]];
		A_fileData.push(A_meisai);
		ReadMeisaiCnt++;
	}

	CompSum += sum;
	return 0;
};

function registTel(telno) //電話番号マスター
//請求月電話番号マスター
//-t オプションの値
//root部署
//請求月root部署
//追加する電話数
//追加する電話数
//print "DEBUG: 電話番号: " . $telno . "\n";
//tel_tbの存在チェック
{
	if (!("A_telno" in global)) A_telno = undefined;
	if (!("A_telnoX" in global)) A_telnoX = undefined;
	if (!("A_telData" in global)) A_telData = undefined;
	if (!("A_telXData" in global)) A_telXData = undefined;
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("teltable" in global)) teltable = undefined;
	if (!("rootPostid" in global)) rootPostid = undefined;
	if (!("rootPostidX" in global)) rootPostidX = undefined;
	if (!("AddTelCnt" in global)) AddTelCnt = undefined;
	if (!("AddTelXCnt" in global)) AddTelXCnt = undefined;
	var telFlag = true;

	if (-1 !== A_telno.indexOf(telno) == false) //print "INFO: 電話は tel_tb に登録されていません\n";
		{
			telFlag = false;
		}

	var telXFlag = true;

	if (-1 !== A_telnoX.indexOf(telno) == false) //print "INFO: 電話は". $telX_tb ."に登録されていません\n";
		{
			telXFlag = false;
		}

	if (telFlag && telXFlag) //print "INFO: 電話は両方にありました、何もしません.\n";
		{
			return 0;
		}

	if (telFlag == false && telXFlag) //print "INFO: 電話はtel_tbに無くて、telX_tbにありました、何もしません.\n";
		{
			return 0;
		}

	if (telXFlag == false) //print "INFO: 電話はtelX_tbに無かったので追加します.\n";
		//tel_XX_tb に追加する電話を出力
		//追加する電話数のカウント
		{
			A_telXData.push([rootPostidX, telno]);
			AddTelXCnt++;
		}

	if (telFlag == false && telXFlag == false && teltable == "n") //tel_tb に追加する電話を出力
		//print "INFO: 電話はtel_tbに無かったので追加します.\n";
		//追加する電話数のカウント
		{
			A_telData.push([rootPostid, telno]);
			AddTelCnt++;
		}
};

function writeTelData(pactid) //現在の日付を得る
//tel_XX_tb に追加する電話を出力
{
	if (!("A_telData" in global)) A_telData = undefined;
	if (!("A_telXData" in global)) A_telXData = undefined;
	if (!("dataDir" in global)) dataDir = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("telX_tb" in global)) telX_tb = undefined;
	var nowtime = getTimestamp();
	var file_tel = dataDir + "/" + "tel_tb" + billdate + pactid + FILE_EXT + ".tmp";
	var fp_tel = fopen(file_tel, "w");

	if (fp_tel == undefined) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_tel + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var file_telX = dataDir + "/" + telX_tb + billdate + pactid + FILE_EXT + ".tmp";
	var fp_telX = fopen(file_telX, "w");

	if (fp_telX == undefined) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	for (var A_data of Object.values(A_telXData)) {
		rootPostid = A_data[0];
		var telno = A_data[1];
		fwrite(fp_telX, pactid + "\t" + rootPostid + "\t" + telno + "\t" + telno + "\t" + NTTEAST_CARRIER_ID + "\t" + NTTEAST_AREA_ID + "\t" + NTTEAST_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");
	}

	for (var A_data of Object.values(A_telData)) {
		rootPostid = A_data[0];
		telno = A_data[1];
		fwrite(fp_tel, pactid + "\t" + rootPostid + "\t" + telno + "\t" + telno + "\t" + NTTEAST_CARRIER_ID + "\t" + NTTEAST_AREA_ID + "\t" + NTTEAST_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");
	}

	fclose(fp_tel);
	fclose(fp_telX);
	return 0;
};

function doSumRecord(line, db) //
// このレコードの合計値の意味がいまひとつ不明。
// 会社合計等でもチェックしているので、ここは無視する。
//	
//	// 分割してみる.
//	$record = splitFix($line, $Sum_POS);
//	
//	// DEBUG * 表示してみる
//	print "==== doSumRecord ==================================\n";
////	foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//	
//	// レコードMo.
//	$recNo = (int)$record[4];
//	print "DEBUG: レコードNo.=" . $recNo . "\n";	
//	print "DEBUG: 請求番号=" . $record[0] . "\n";
//	print "DEBUG: 請求合計額=" . (int)$record[14] . "\n";
//
{
	if (!("Sum_POS" in global)) Sum_POS = undefined;
	return 0;
};

function doTotalRecord(line, TotalUp, db) //分割してみる.
//DEBUG * 表示してみる
//print "==== doTotalRecord ================================\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
{
	if (!("Total_POS" in global)) Total_POS = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid" in global)) pactid = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var record = splitFix(line, Total_POS);
	var total = +record[4];

	if (total != TotalUp) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4F1A\u793E\u5408\u8A08\u91D1\u984D\u304C\u7570\u306A\u308A\u307E\u3059.(" + total + "!=" + TotalUp + ").");
		return 1;
	}

	return 0;
};

function writeInsFile(pactid, billdate, A_fileData) //ASP利用料金
//データが空のときは終了.
//現在の日付を得る
//権限チェック「ASP利用料表示設定」がＯＮになっているか
//電話番号（１回前の）
//各データを書き出す
//最後の電話についてASP使用料を表示する.
{
	if (!("H_pactid" in global)) H_pactid = undefined;
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	if (!("fp_teldetails" in global)) fp_teldetails = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("dataDir" in global)) dataDir = undefined;
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	var aspCharge = 0;
	var aspFlg = false;

	if (A_fileData.length == 0) {
		return 0;
	}

	var nowtime = getTimestamp();

	if (chkAsp(pactid) == true) //ASP利用料を取得
		//ASP利用料が設定されていない場合
		{
			aspFlg = true;
			aspCharge = getAsp(pactid);

			if (is_null(aspCharge)) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093.");
				return 1;
			}
		}

	var file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + FILE_EXT + ".tmp";
	fp_teldetails = fopen(file_teldetails, "w");

	if (fp_teldetails == undefined) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var detailNo = 0;
	var telno = "";

	for (var data of Object.values(A_fileData)) //data : telno, code, charge, zei, billcode
	//電話番号が変わったら
	//内訳コード、"網種別-"が付く.
	//内訳コード名
	//末尾の空白を除く
	//carid キャリアID
	{
		if (data[0] != telno && telno != "") //ASP利用料表示する
			{
				detailNo++;

				if (aspFlg == true) //合計用に１つ進める
					//ASP利用料を出力
					//ASP利用料消費税を出力
					{
						detailNo++;
						fwrite(fp_teldetails, pactid + "\t" + telno + "\t" + G_CODE_ASP + "\t" + H_utiwake[G_CODE_ASP].name + "\t" + aspCharge + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTEAST_CARRIER_ID + "\t" + "\n");
						detailNo++;
						fwrite(fp_teldetails, pactid + "\t" + telno + "\t" + G_CODE_ASX + "\t" + H_utiwake[G_CODE_ASX].name + "\t" + +(aspCharge * G_EXCISE_RATE + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTEAST_CARRIER_ID + "\t" + "\n"));
					}

				detailNo = 0;
			} else //電話はそのまま
			{
				detailNo++;
			}

		telno = data[0];
		var ut_code = NET_KIND + "-" + data[1];
		var ut_name = H_utiwake[data[1]].name;
		ut_name = rtrim(ut_name, "\u3000 ");
		fwrite(fp_teldetails, pactid + "\t" + telno + "\t" + ut_code + "\t" + ut_name + "\t" + data[2] + "\t" + H_Zei_CODE[data[3]] + "\t" + detailNo + "\t" + nowtime + "\t" + NTTEAST_CARRIER_ID + "\t" + data[4] + "\n");
	}

	detailNo++;

	if (aspFlg == true) //合計用に１つ進める
		//ASP利用料を出力
		//ASP利用料消費税を出力
		{
			detailNo++;
			fwrite(fp_teldetails, pactid + "\t" + telno + "\t" + G_CODE_ASP + "\t" + H_utiwake[G_CODE_ASP].name + "\t" + aspCharge + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTEAST_CARRIER_ID + "\t" + "\n");
			detailNo++;
			fwrite(fp_teldetails, pactid + "\t" + telno + "\t" + G_CODE_ASX + "\t" + H_utiwake[G_CODE_ASX].name + "\t" + +(aspCharge * G_EXCISE_RATE + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTEAST_CARRIER_ID + "\t" + "\n"));
		}

	fclose(fp_teldetails);
	return 0;
};

function splitFix(str, A_pos) //１個目の要素
//中間の要素
//最後の要素
{
	var A_ret = Array();
	var total_len = str.length;
	A_ret[0] = str.substr(0, A_pos[0]);

	for (var i = 0; i < A_pos.length - 1; i++) {
		A_ret[i + 1] = str.substr(A_pos[i], A_pos[i + 1] - A_pos[i]);
	}

	A_ret[i + 1] = str.substr(A_pos[i]);
	return A_ret;
};

function usage(comment, db) {
	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	print("\t\t-t \u5F53\u6708\u30C7\u30FC\u30BF\t(N:\u30C7\u30FC\u30BF\u306F\u4ECA\u6708\u306E\u3082\u306E,O:\u30C7\u30FC\u30BF\u306F\u5148\u6708\u306E\u3082\u306E)\n\n");
	throw die(1);
};

function getRootPostid(pactid, table) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select postidparent from " + table + " where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
	rootPostid = dbh.getOne(sql_str, true);
	return rootPostid;
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

function getAsp(pactid) //if(is_null($charge)){
//print "charge no\n";
//}else{
//}
{
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + NTTEAST_CARRIER_ID;
	var charge = dbh.getOne(sql_str);
	return charge;
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