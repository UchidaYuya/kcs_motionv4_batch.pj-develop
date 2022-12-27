//===========================================================================
//機能：請求情報ファイルインポートプロセス（NTT-Com国際専用）
//import_nttcom_wld.php->import_nttcom_wld_bill.php->import_nttcom_wld_subillで連動して動作
//
//作成：五十嵐
//備考：import_nttcom_int.phpを改変
//改変：要望により、請求明細の内訳コードを「1000:国際通話料」と「5000:割引額」に変更 20070913iga
//tel_X_tbのtelno_viewに入る番号にハイフンをつけるよう修正 20070913iga
//===========================================================================
//このスクリプトの日本語処理名
//国際はW
//レコード１行の長さ 512から129に変更 20070115iga
//NTTコミュニケーションズのキャリアID
//国際の場合、網種別は"4"
//NTTコミュニケーションズの地域コード
//NTTコミュニケーションズの回線ID
//NTTコミュニケーションズの通話種別 20070123
//国際電話を表す接尾子
//法人向割引基本料金を表す参照番号
//法人向割引額を表す参照番号
//調整金を表す参照番号
//按分追加 20071005iga
//割引を全て5000に置換 20070913iga
//消費税率
//消費税の内訳コード
//define("G_CODE_TUWA", "tuwakei");	// 通話料金合計の内訳コード 20070125
//通話料金合計の内訳コード変更 20070913iga
//20071003iga
//データ区分
//以下はcommonで定義済み
//define("G_AUTH_ASP", 2);	//ASP使用料を表示するか
//define("G_CODE_ASP", "ASP");	//ASP利用料金
//define("G_CODE_ASX", "ASX");	//同税額
//define("G_EXCISE_RATE", 0.05);//消費税率
//---------------------------------------------------------------------------
//固定長フォーマットの定義
//NTT-comの国際電話取込用 20061226iga
//ヘッダーコード (仕様書では年月日が1項目にまとめられてたのをバラした(33,35,37))
//振替用
//振込用
//トレーラレコード
//データレコード
//料金明細
//通話明細
//参照番号の固定値
//
//以下旧コード 20070115iga
//// 管理レコード
//$Kanri_POS = array( 5, 11, 13, 17, 21, 23, 24, 26, 27, 30, 31, 32 );
//// 明細内訳レコード
//$Meisai_POS = array( 6, 10, 11, 13, 15, 17, 27, 33, 34, 35, 47, 51, 55, 59, 63, 67, 71, 126, 136, 141, 162, 183, 204, 225, 246, 267, 288, 309, 330, 351, 372, 393, 414, 435, 456, 477, 498 );
//// 請求内訳[N]レコード
//$Seikyu_POS = array( 2, 6, 16, 19 );
//// 請求合計レコード
//$Sum_POS = array( 10, 11, 13, 15, 17, 27, 33, 47, 51, 55, 59, 63, 71, 126, 136, 144, 151, 159, 199, 204, 244 );
//// 会社合計レコード
//$Total_POS = array( 5, 11, 13, 17, 29, 37 );
//税区分コード表 使わない
//レコードだと非課税がスペースなので番号に置き換える(スペースでdefine切りたくない)
//課税対象料金
//非課税
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
//パラメータを1つ削除(NTTcom国際電話は全て当月なので-tをなくした) 20070130iga
//按分用に一つ増えた 20071003iga
//$cnt 0 はスクリプト名のため無視
//END 引数の取得
//請求データファイルがあるディレクトリを指定
//処理する契約ＩＤ配列
//処理が終了した pactid を格納するための配列
//処理が失敗した pactid を格納するための配列
//契約ＩＤの指定が全て（all）の時
//法人向割引(0009999997)は5000:割引額に置換する 20070913iga
//テーブルＮＯ取得
//テーブル名設定
//20070123iga
//pact_tb より登録されている契約ＩＤ、会社名を取得
//会社名マスターを作成
//utiwake_tbから登録されている内訳半角カナ名称を取得
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
//使用説明 各ファイルについての前処理(デリート前に情報を保持する)
//[引　数] $fileName 対象ファイル名
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 管理レコードのチェック
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 通話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//author igarashi 20070122
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話番号登録を行う
//[引　数] $telno 電話番号
//[返り値] 電話が存在すれば0、存在しなければ1
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 消費税を計算する
//[引　数] $税対象額
//[返り値] 消費税
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
//[引　数] $A_commFileData 書き出すデータ
//[返り値] 終了コード　1（失敗）
//20070123iga
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
//テーブルの削除
//[引　数] $pactid：契約ＩＤ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//バックアップをとる
//[引　数] $db
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//データをＤＢにImportする
//[引　数] $db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルにエクスポートを行う
//[引　数] SQL文、COPY用のファイル名、$db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//処理を終えたデータを移動する
//[引　数] $pactid
//[返り値] 終了コード　1（失敗）
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
const SCRIPT_NAMEJ = "NTT-Com\u56FD\u969B\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8";

require("lib/script_db.php");

require("lib/script_log.php");

const NTTCOM_DIR = "/NTT_com/world";
const NTTCOM_PAT = "/^W/i";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const LINE_LENGTH = 128;
const NTTCOM_CARRIER_ID = 14;
const NET_KIND = 4;
const NTTCOM_AREA_ID = 45;
const NTTCOM_CIRCUIT_ID = 31;
const NTTCOM_TUWA_TYPE = "CW";
const FILE_EXT = "_wld";
const REF_HOUZIN_KIHON = "0009999996";
const REF_HOUZIN_WARI = "0009999997";
const REF_TYOUSEI = "0009999999";
const REF_NTTCOM_TYOSEI = "comtyosei";
const REF_NTTCOM_WARI = "5000";
const TAX_RATE = 1.05;
const H_TAX = "h_tax";
const G_CODE_TUWA = "\uFF82\uFF73\uFF9C\uFF98\uFF96\uFF73\uFF77\uFF9D";
const G_CODE_WARI = "\uFF9C\uFF98\uFF8B\uFF9E\uFF77\uFF76\uFF9E\uFF78";
const PORTABLE_CARRIER = "1,2,3,4,5,6";
const DATA_KIND = "2";
var Furikomi_POS = [1, 2, 3, 32, 39, 45, 50, 54, 57, 58, 66, 81, 101, 128];
var Furikae_POS = [1, 2, 3, 33, 35, 37, 39, 45, 50, 62, 66, 77, 128];
var Trail_POS = [1, 2, 8, 18, 128];
var Seiky_POS = [1, 13, 13, 25, 29, 52, 60, 68, 78, 91, 106, 107, 127];
var Tuwa_POS = [1, 13, 25, 29, 33, 46, 52, 60, 61, 67, 68, 78, 91, 106, 107, 114, 126, 127];
var FixReferNo = [REF_HOUZIN_KIHON, REF_HOUZIN_WARI, REF_TYOUSEI];
var H_Zei_CODE = {
	"10": "\u8AB2\u7A0E\u5BFE\u8C61\u6599\u91D1",
	"00": ""
};
const TAXATION = "10";
const TAXFREE = "00";
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

	if (ereg("^-a=", _SERVER.argv[cnt]) == true) //按分チェック
		{
			var g_anbun = ereg_replace("^-a=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^[ny]$", g_anbun) == false) {
				usage("ERROR: \u6309\u5206\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			}

			continue;
		}

	usage("", dbh);
}

var dataDir = DATA_DIR + "/" + billdate + NTTCOM_DIR;

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

var sql = "select code,name, kananame from utiwake_tb where carid=" + NTTCOM_CARRIER_ID;
var H_result = dbh.getHash(sql, true);
sql = "select code,name, kananame from utiwake_tb where code='" + REF_NTTCOM_WARI + "' and carid=" + NTTCOM_CARRIER_ID;
var H_waribiki = dbh.getHash(sql, true);

for (cnt = 0;; cnt < H_result.length; cnt++) //ＤＢの内訳コードには"網種別-"が含まれているので、それを除く.
//$code = preg_replace( "/^". NET_KIND . "\-/", "", $code );
//内訳コード => 内訳内容
//法人向割引(0009999997)は5000:割引額に置換 20070913iga
{
	var code = H_result[cnt].kananame;

	if (-1 !== FixReferNo.indexOf(code) == true) {
		H_utiwake[code] = H_waribiki[0];
	} else {
		H_utiwake[code] = H_result[cnt];
	}
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var telX_tb = "tel_" + tableNo + "_tb";
var postrelX_tb = "post_relation_" + tableNo + "_tb";
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
var commhistoryX_tb = "commhistory_" + tableNo + "_tb";
var H_telX_info = Array();
sql = "select pactid,compname from pact_tb order by pactid";
H_result = dbh.getHash(sql, true);
var pactCnt = H_result.length;

for (cnt = 0;; cnt < pactCnt; cnt++) //pactid => 会社名
{
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

sql = "SELECT kananame FROM utiwake_tb WHERE carid=" + NTTCOM_CARRIER_ID;
var H_RemarkName = dbh.getCol(sql, true);
pactCnt = A_pactid.length;
A_pactid.sort();

for (cnt = 0;; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
//処理する請求データファイル名配列
//請求番号 20070123iga
//請求データファイル名を取得する
//請求データファイルがなかった場合
//ログ出力
//bill_prtel_tb より請求番号を得る（ここでは親番号ではない）
//使用者情報コピー用にtelno以降のカラム追加 20071012iga
//dummy_tbを取得 20070115iga
//$dummypost = null;
//2件以上登録されている電話の件数と部署ID  key:telno val:登録件数,postid
//1件登録されている電話の所属先部署ID  key:telno val:postid
//デリート処理 20070130iga
//各ファイルについての処理 -- ここが読み込みの中心処理
//詳細データを保存する
//commhistory_X_tbインポートデータ出力用配列 20070122iga
//電話番号別通話料合算 20070125iga
//電話番号別消費税合算 20070201iga
//20070125iga
//20070125iga
//年月取得用 20070123iga
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
	var billno = "";

	while (fileName = readdir(dirh)) {
		if (is_file(dataDirPact + "/" + fileName) == true) {
			A_billFile.push(fileName);
		}

		clearstatcache();
	}

	if (A_billFile.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "\u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093.");
			closedir(dirh);
			continue;
		} else //ファイルが複数あればシーケンス番号を削る(下3桁をシーケンス番号とする)
		{
			if (A_billFile.length == 1) //拡張子削る
				{
					fileName = A_billFile[0].substr(0, A_billFile[0].length - 4);
				} else if (A_billFile.length > 1) {
				fileName = A_billFile[0].substr(0, A_billFile[0].length - 7);
			}

			var billsql = "SELECT prtelno FROM bill_prtel_tb WHERE carid=" + NTTCOM_CARRIER_ID + " AND prtelname='" + fileName + "'";
			billno = dbh.getOne(billsql, true);
		}

	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5BFE\u8C61\u3068\u306A\u308B\u30D5\u30A1\u30A4\u30EB\uFF1A" + A_billFile.join(","));
	closedir(dirh);
	var A_codes = Array();
	sql = "select prtelno from bill_prtel_tb where pactid=" + pactid + " and carid=" + NTTCOM_CARRIER_ID;
	H_result = dbh.getHash(sql, true);

	for (var idx = 0; idx < H_result.length; idx++) {
		A_codes.push(H_result[idx].prtelno);
	}

	if (A_codes.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "\u306B\u3064\u3044\u3066\u306E\u8ACB\u6C42\u756A\u53F7\u304Cbill_prtel_tb\u306B\u898B\u3064\u304B\u308A\u307E\u305B\u3093.");
			continue;
		}

	if (-1 !== A_codes.indexOf(billno) == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u756A\u53F7\u304C\u9055\u3044\u307E\u3059(" + billno + ").");
	}

	var A_telnoX = Array();
	sql = "select telno, userid, kousiflg, kousiptn, username, employeecode, mail, machine, color, text1, text2, text3, text4, text5," + " text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, int1, int2, int3, date1, date2, memo, username_kana, kousi_fix_flg" + " from " + telX_tb + " where pactid=" + A_pactid[cnt] + " and carid!=" + NTTCOM_CARRIER_ID;
	var H_telX_tmp = dbh.getHash(sql, true);

	for (var key in H_telX_tmp) {
		var dat = H_telX_tmp[key];
		A_telnoX.push(dat.telno);
		H_telX_info[dat.telno] = [dat.userid, dat.machine, dat.color, dat.employeecode, dat.username, dat.mail, dat.text1, dat.text2, dat.text3, dat.text4, dat.text5, dat.text6, dat.text7, dat.text8, dat.text9, dat.text10, dat.text11, dat.text12, dat.text13, dat.text14, dat.text15, dat.int1, dat.int2, dat.int3, dat.date1, dat.date2, preg_replace("/(\n|\r\n|\r)/", "LFkaigyoLF", dat.memo), dat.kousiflg, dat.kousiptn, dat.username_kana, dat.kousi_fix_flg];
	}

	sql = "SELECT postid, telno FROM dummy_tel_tb WHERE pactid=" + A_pactid[cnt] + " AND carid=" + NTTCOM_CARRIER_ID + " AND reqno='" + fileName + "'";
	var dummytmp = dbh.getHash(sql, true);

	if (undefined !== dummytmp[0] == true) {
		var dummytelno = dummytmp[0].telno;
		var dummypost = dummytmp[0].postid;
	}

	if (backup == "y") {
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u51E6\u7406\u958B\u59CB.");
		doBackup(dbh);
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u51E6\u7406\u5B8C\u4E86.");
	}

	var H_overTel = Array();
	var H_regPost = Array();
	A_billFile.sort();
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u524D\u51E6\u7406\u958B\u59CB.");

	for (var fileName of Object.values(A_billFile)) {
		if (preEachFile(dataDirPact + "/" + fileName, pactid, billdate, dbh) != 0) {
			continue;
		}
	}

	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u524D\u51E6\u7406\u5B8C\u4E86.");
	dbh.begin();

	if (mode == "o") {
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u958B\u59CB.");

		if (doDelete(pactid, dbh) != 0) {
			continue;
		}

		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u5B8C\u4E86.");
	}

	var A_telnoCom = Array();
	sql = "SELECT telno FROM " + telX_tb + " WHERE pactid=" + A_pactid[cnt] + " AND carid=" + NTTCOM_CARRIER_ID;
	var A_tmptel = dbh.getHash(sql, true);

	for (var data of Object.values(A_tmptel)) {
		A_telnoCom.push(data.telno);
	}

	var A_fileData = Array();
	var A_telXData = Array();
	var A_commFileData = Array();
	var H_TuwaCharge = Array();
	var H_taxCharge = Array();
	var A_MemTelno = Array();
	var H_TeltoCnt = Array();
	var thisyear = "";
	var TotalUp = 0;
	var allTotalUp = 0;
	var file_telX = dataDir + "/" + telX_tb + billdate + pactid + FILE_EXT + ".tmp";
	var file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + FILE_EXT + ".tmp";
	var file_commhistory = dataDir + "/" + commhistoryX_tb + billdate + pactid + FILE_EXT + ".tmp";
	var errFlag = false;

	for (var fileName of Object.values(A_billFile)) //読込電話件
	//読込明細件数
	//追加する電話数
	{
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u958B\u59CB.");
		var ReadTelCnt = 0;
		var ReadMeisaiCnt = 0;
		var AddTelXCnt = 0;

		if (doEachFile(dataDirPact + "/" + fileName, pactid, billdate, A_fileData, dbh) == 1) //エラーがあったらそこで中断.
			{
				dbh.rollback();
				errFlag = true;
				break;
			}

		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u5B8C\u4E86:\u96FB\u8A71\u4EF6\u6570=" + ReadTelCnt + ":\u660E\u7D30\u4EF6\u6570=" + ReadMeisaiCnt + ":\u8FFD\u52A0\u96FB\u8A71\u4EF6\u6570(" + telX_tb + ")=" + AddTelXCnt);
	}

	if (errFlag == false) //ファイルに書き出す
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30FC\u30BF\u66F8\u51FA\u51E6\u7406\u958B\u59CB.");

			if (writeTelData(pactid) != 0) //失敗を記録する.
				//次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_telX + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
					A_pactFailed.push(pactid);
					dbh.rollback();
					continue;
				}

			if (writeInsFile(pactid, billdate, A_fileData) != 0) //失敗を記録する.
				//次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
					A_pactFailed.push(pactid);
					dbh.rollback();
					continue;
				}

			if (writeTuwaFile(pactid, billdate, A_commFileData) != 0) //失敗を記録する.
				//次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
					A_pactFailed.push(pactid);
					dbh.rollback();
					continue;
				}

			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB.");

			if (doImport(file_telX, file_teldetails, file_commhistory, dbh) != 0) //失敗したら次のPactへ.
				{
					dbh.rollback();
					continue;
				}

			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u5B8C\u4E86.");
			dbh.commit();
			var pactDir = dataDir + "/" + pactid;
			var finDir = pactDir + "/" + FIN_DIR;
			finalData(pactid, pactDir, finDir);
			A_pactDone.push(pactid);
		} else //失敗を記録する
		{
			dbh.rollback();
			A_pactFailed.push(pactid);
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

function doEachFile(fileName, pactid, billdate, A_fileData, dbh) //ファイルオープン
//管理レコードのチェック
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("A_commFileData" in global)) A_commFileData = undefined;
	if (!("thisyear" in global)) thisyear = undefined;
	if (!("TotalUp" in global)) TotalUp = undefined;
	if (!("allTotalUp" in global)) allTotalUp = undefined;
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

	if (checkKanriRecord(line, fileName, pactid, billdate, dbh) == 1) {
		flock(fp, LOCK_UN);
		fclose(fp);
		return 1;
	}

	var ChargeSum = 0;
	var CompSum = 0;

	while (line = fgets(fp)) //改行取り
	//１行の長さチェック
	//データレコード(通話明細、請求明細)
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

		var dataKind = line.substr(0, 1);

		if (dataKind == "2") //通話明細か請求明細か判断する
			//対話地域が入っていたら通話明細
			{
				var sum = 0;
				var recKind = line.substr(34, 13).trim();

				if (recKind.trim() != "") {
					if (doTuwaRecord(line, pactid, A_commFileData, sum, dbh) == 1) {
						flock(fp, LOCK_UN);
						fclose(fp);
						return 1;
					}
				} else {
					if (doTelRecord(line, pactid, A_fileData, sum, dbh, recKind) == 1) {
						flock(fp, LOCK_UN);
						fclose(fp);
						return 1;
					}
				}

				TotalUp += sum;
			} else if (dataKind == "3") //合計額を保存後、ファイル毎の合計額用にTotalUpをリセットする
			{
				if (doTotalRecord(line, TotalUp, dbh) == 1) {
					flock(fp, LOCK_UN);
					fclose(fp);
					return 1;
				}

				allTotalUp = allTotalUp + TotalUp;
				TotalUp = 0;
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

function preEachFile(fileName, pactid, billdate, dbh) //ファイルオープン
{
	if (!("H_overTel" in global)) H_overTel = undefined;
	if (!("H_regPost" in global)) H_regPost = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("A_telnoX" in global)) A_telnoX = undefined;
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("dummypost" in global)) dummypost = undefined;
	var fp = fopen(fileName, "rb");

	if (fp == undefined) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557(preEachFile).");
		return 1;
	}

	if (flock(fp, LOCK_SH) == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u30ED\u30C3\u30AF\u306B\u5931\u6557(preEachFile).");
		fclose(fp);
		return 1;
	}

	var line = fgets(fp);

	while (line = fgets(fp)) //改行取り
	//１行の長さチェック
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

		if (line.substr(0, 1) == DATA_KIND) //電話番号とる
			//telX_tbのNTTコム以外の登録済み存在&登録数チェック
			//telX_tbに複数登録されている電話だけ処理する
			{
				var telno = line.substr(13, 12).trim().replace(/[^0-9]/g, "");
				var A_telCount = Array();
				A_telCount = array_count_values(A_telnoX);

				if (undefined !== A_telCount[telno] == true) {
					if (A_telCount[telno] > 1) //複数登録されている電話のpostidが違うものだけ抜き出す
						//複数登録の電話番号がすべて同じ部署に所属していたらその部署を保存する
						{
							var sql = "SELECT postid FROM " + telX_tb + " WHERE pactid=" + pactid + "and telno='" + telno + "' and carid!=" + NTTCOM_CARRIER_ID;
							var A_postid = dbh.getCol(sql, true);
							var A_cnt = array_count_values(A_postid);

							if (A_cnt[A_postid[0]] == A_postid.length) {
								H_overTel[telno] = {
									no: 1,
									post: A_postid[0]
								};
							} else //所属部署が同じでなければダミー部署に上げる
								{
									if (undefined !== dummypost == false || dummypost == "") {
										logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u672A\u767B\u9332\u756A\u53F7\uFF1Adummy_tel_tb\u306B\u8ACB\u6C42\u5148\u90E8\u7F72\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + telno + ")");
										flock(fp, LOCK_UN);
										fclose(fp);
										return 1;
									} else {
										H_overTel[telno] = {
											no: A_postid.length,
											post: dummypost
										};
									}
								}
						} else if (A_telCount[telno] == 1) {
						sql = "SELECT postid FROM " + telX_tb + " WHERE pactid=" + pactid + "and telno='" + telno + "' and carid!=" + NTTCOM_CARRIER_ID;
						var regpost = dbh.getOne(sql, true);
						H_regPost[telno] = regpost;
					}
				}
			}
	}

	flock(fp, LOCK_UN);
	fclose(fp);
	return 0;
};

function checkKanriRecord(line, fileName, pactid, billdate, dbh) //１行の長さチェック
//データ種類チェック
//西暦が2桁なので4桁に。(年チェックは実質下2桁で行う) 20070122iga
//doTuwaRecordで使用(commhistory_X_tbの通話開始時間に年を入れるため(月日しかレコードにない)) 20070122iga
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("Furikomi_POS" in global)) Furikomi_POS = undefined;
	if (!("thisyear" in global)) thisyear = undefined;

	if (line.length != LINE_LENGTH) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u4E00\u884C\u306E\u9577\u3055\u304C\u7570\u5E38(" + line.length + "!=" + LINE_LENGTH + ").");
		return 1;
	}

	var record = splitFix(line, Furikomi_POS);

	if (record[0] != "1") //管理レコードは"01"
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u7BA1\u7406\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
			return 1;
		}

	var target_yyyymm = date("Y").substr(0, 2);
	target_yyyymm += record[4].substr(0, 4);
	thisyear = target_yyyymm.substr(0, 4);

	if (target_yyyymm != billdate) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u30D5\u30A1\u30A4\u30EB\u306E\u5E74\u6708\u304C\u5BFE\u8C61\u5E74\u6708\u3068\u7570\u306A\u308A\u307E\u3059(" + target_yyyymm + "!=" + billdate + ").");
		return 1;
	}

	return 0;
};

function doTuwaRecord(line, pactid, A_commFileData, sum, dbh) //電話番号がなければエラー
//開始日付を取得
//通話先電話番号
//通話先地域
//通話時間
//通話料金
//マルチナンバー
{
	if (!("Tuwa_POS" in global)) Tuwa_POS = undefined;
	if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	if (!("thisyear" in global)) thisyear = undefined;
	if (!("H_TuwaCharge" in global)) H_TuwaCharge = undefined;
	var record = splitFix(line, Tuwa_POS);
	var telno = record[2].replace(/[^0-9]/g, "");
	var registflg = 0;

	if (telno == "") {
		return 1;
	} else {
		registTel(telno, pactid, dbh);
	}

	var date = thisyear + "-" + record[3].substr(0, 2) + "-" + record[3].substr(2, 4) + " " + record[9].substr(0, 2) + ":" + record[9].substr(2, 2) + ":" + record[9].substr(4, 2);
	var totelno = rtrim(record[13]).replace(/[^0-9]/g, "");
	var toplace = record[5].trim();
	var time = record[15].trim().substr(0, 3);
	time += ":";
	time += record[15].trim().substr(3, 2);
	time += ":";
	time += record[15].trim().substr(5, 2);
	var charge = +record[7].trim();

	if (undefined !== H_TuwaCharge[telno] == false) {
		H_TuwaCharge[telno] = {
			telno: telno,
			charge: 0
		};
	}

	H_TuwaCharge[telno].charge = H_TuwaCharge[telno].charge + charge;
	A_commFileData.push(pactid + "\t" + telno + "\t" + NTTCOM_TUWA_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + "\\N" + "\t" + time + "\t" + charge + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + NTTCOM_CARRIER_ID + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\n");
	ReadMeisaiCnt++;
	sum += charge;
	return 0;
};

function doTelRecord(line, pactid, A_fileData, sum, dbh, taxKind) //global $Meisai_POS; 使わない 20070115iga
//参照番号の固定値 20070117iga
//備考欄の入力文字	20070117iga
//pactごとの請求番号
//ご請求金額
//請求内訳の合計
//読込電話件数
//読込明細件数
//請求番号 20070115iga
//ダミー番号
//分割してみる.
//半角文字をエンコード 20070123iga
//DEBUG * 表示してみる
//print "**** doTelRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//データレコードの種類チェック 20070117iga
//法人向明細
//電話番号があれば番号の存在チェックをする
//内訳処理する
//レコードの情報が内訳テーブルになかったらエラー
//合計を保持する.
{
	if (!("Seiky_POS" in global)) Seiky_POS = undefined;
	if (!("FixReferNo" in global)) FixReferNo = undefined;
	if (!("H_RemarkName" in global)) H_RemarkName = undefined;
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
	if (!("billno" in global)) billno = undefined;
	if (!("dummypost" in global)) dummypost = undefined;
	if (!("dummytelno" in global)) dummytelno = undefined;
	if (!("H_TeltoCnt" in global)) H_TeltoCnt = undefined;
	if (!("H_taxCharge" in global)) H_taxCharge = undefined;
	var record = splitFix(line, Seiky_POS);
	record[8] = record[8].trim();
	record[10] = record[10].trim();
	record[10] = mb_convert_encoding(record[10], "UTF-8", "SJIS-win").trim();

	if (-1 !== FixReferNo.indexOf(record[8]) == false && -1 !== H_RemarkName.indexOf(record[10]) == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059(" + record[8] + " : " + record[10] + ").");
		return 1;
	}

	var telno = record[3].replace(/[^0-9]/g, "").trim();

	if (telno != "") {
		registTel(telno, pactid, dbh);
	}

	if (telno == "") {
		if (undefined !== dummytelno == false || dummytelno == "") {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "dummy_tel_tb\u306B\u8ACB\u6C42\u5148\u5148\u96FB\u8A71\u756A\u53F7\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + telno + ").");
			return 1;
		}

		telno = dummytelno;
	}

	if (record[11] == " ") {
		var taxkind = TAXFREE;
	} else if (record[11] == "*") {
		taxkind = TAXATION;
	} else {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4E0D\u660E\u306A\u7A0E\u30B3\u30FC\u30C9\u3067\u3059(" + record[11] + ").");
		return 1;
	}

	if (undefined !== H_utiwake[record[8]] == false && undefined !== H_utiwake[record[10]] == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059(" + record[8] + ":" + record[10] + ").");
		return 1;
	}

	var charge = +record[6];

	if (record[8] == REF_HOUZIN_KIHON) //明細データを配列に保持する.
		//読み込んだレコード数をカウントする.
		{
			var code = H_utiwake[REF_HOUZIN_KIHON].code;
			var A_meisai = [telno, code, charge, taxkind, REF_HOUZIN_KIHON];
			A_fileData.push(A_meisai);
			ReadMeisaiCnt++;
		} else if (record[8] == REF_HOUZIN_WARI) {
		code = H_utiwake[REF_HOUZIN_WARI].code;
		A_meisai = [telno, code, charge, taxkind, REF_HOUZIN_WARI];
		A_fileData.push(A_meisai);
		ReadMeisaiCnt++;
	} else if (record[8] == REF_TYOUSEI) {
		code = H_utiwake[REF_TYOUSEI].code;
		A_meisai = [telno, code, charge, taxkind, REF_TYOUSEI];
		A_fileData.push(A_meisai);
		ReadMeisaiCnt++;
	} else if (-1 !== H_RemarkName.indexOf(record[10])) //税対象になりうる定額料金、一時料金の場合は課税対象かチェックする
		{
			if (taxkind == 13) {
				code = H_utiwake[record[10]].code;
				A_meisai = [telno, code, charge, taxkind, record[10]];
				A_fileData.push(A_meisai);
				ReadMeisaiCnt++;
			} else if (taxkind == 10) //消費税を追加
				//消費税対象を追加
				{
					var taxcharge = CalcTax(charge);

					if (undefined !== H_taxCharge[telno] == false) {
						H_taxCharge[telno] = {
							telno: telno,
							tax: 0
						};
					}

					H_taxCharge[telno].tax = H_taxCharge[telno].tax + taxcharge;
					code = H_utiwake[record[10]].code;
					var fixcharge = charge - taxcharge;
					A_meisai = [telno, code, fixcharge, taxkind, record[10]];
					A_fileData.push(A_meisai);
					ReadMeisaiCnt++;
				}
		}

	ReadTelCnt++;
	sum += charge;
	return 0;
};

function registTel(telno, pactid, dbh) //global $A_telno;	// 電話番号マスター
//請求月電話番号マスター
//global $rootPostid;		// root部署 20070125iga
//global $rootPostidX;	// 請求月root部署 使わない 20070125iga
//追加する電話数
//Comに登録済みの電話
//dummy_tel_tbに登録されてる部署
//print "DEBUG: 電話番号: " . $telno . "\n";
//処理済みの番号は無視する 20070129iga
{
	if (!("billdate" in global)) billdate = undefined;
	if (!("A_telnoX" in global)) A_telnoX = undefined;
	if (!("A_telXData" in global)) A_telXData = undefined;
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("AddTelXCnt" in global)) AddTelXCnt = undefined;
	if (!("A_telnoCom" in global)) A_telnoCom = undefined;
	if (!("dummypost" in global)) dummypost = undefined;
	if (!("A_MemTelno" in global)) A_MemTelno = undefined;
	if (!("H_overTel" in global)) H_overTel = undefined;
	if (!("H_regPost" in global)) H_regPost = undefined;
	if (!("logh" in global)) logh = undefined;

	if (-1 !== A_MemTelno.indexOf(telno) == false) //処理済みの配列に入れる
		//telX_tbのNTTコム登録済み存在チェック 20070117iga
		//telX_tbに1件も登録されていない場合tel_X_tbに登録する
		{
			A_MemTelno.push(telno);

			if (-1 !== A_telnoCom.indexOf(telno) == true) {
				return 0;
			}

			var A_telCount = Array();
			A_telCount = array_count_values(A_telnoX);

			if (undefined !== A_telCount[telno] == false) //追加する電話数のカウント
				{
					if (undefined !== dummypost == false || dummypost == "") {
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u672A\u767B\u9332\u756A\u53F7\uFF1Adummy_tel_tb\u306B\u8ACB\u6C42\u5148\u90E8\u7F72\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + telno + ")");
						return 1;
					} else {
						A_telXData.push([dummypost, telno, NTTCOM_CARRIER_ID]);
					}

					AddTelXCnt++;
					return 1;
				} else if (A_telCount[telno] == 1) //追加する電話数のカウント
				{
					A_telXData.push([H_regPost[telno], telno, NTTCOM_CARRIER_ID]);
					AddTelXCnt++;
					return 0;
				} else if (A_telCount[telno] > 1) //複数登録されている電話のpostidが全て同じなら1件登録と見なす 20070125iga
				{
					if (H_overTel[telno].no == 1) {
						A_telXData.push([H_overTel[telno].post, telno]);
						AddTelXCnt++;
						return 0;
					} else //追加する電話数のカウント
						{
							if (undefined !== dummypost == false || dummypost == "") {
								logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u672A\u767B\u9332\u756A\u53F7\uFF1Adummy_tel_tb\u306B\u8ACB\u6C42\u5148\u90E8\u7F72\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + telno + ")");
								return 1;
							} else {
								A_telXData.push([dummypost, telno]);
							}

							AddTelXCnt++;
							return 1;
						}
				}
		} else {
		return 0;
	}
};

function CalcTax(charge) {
	var tax = charge - Math.ceil(charge / TAX_RATE);
	return tax;
};

function writeTelData(pactid) //dummy部署
//dummy_telno
//carid=14の電話一覧
//dummy_telが登録されていなければtel_X_tbに登録する
//現在の日付を得る
//$file_telX = $dataDir ."/". $telX_tb . $billdate . $pactid . FILE_EXT . ".tmp";
//tel_X_tb に追加する電話を出力
{
	if (!("A_telXData" in global)) A_telXData = undefined;
	if (!("dataDir" in global)) dataDir = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("dummypost" in global)) dummypost = undefined;
	if (!("dummytelno" in global)) dummytelno = undefined;
	if (!("file_telX" in global)) file_telX = undefined;
	if (!("A_telnoCom" in global)) A_telnoCom = undefined;
	if (!("H_telX_info" in global)) H_telX_info = undefined;

	if (undefined !== dummytelno != false || dummytelno != "") {
		if (-1 !== A_telnoCom.indexOf(dummytelno) == false) {
			A_telXData.push([dummypost, dummytelno, NTTCOM_CARRIER_ID]);
		}
	}

	var nowtime = getTimestamp();
	var fp_telX = fopen(file_telX, "w");

	if (fp_telX == undefined) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var A_nullbox = Array();

	for (var i = 0; i <= 31; i++) {
		A_nullbox[i] = "\\N";
	}

	for (var A_data of Object.values(A_telXData)) //telno_view用にハイフンをつける 20070913iga
	//tel_XX_tbに1件だけ登録済みの電話で、電話情報を持っていたらコピーする
	//公私分計をする電話は、すべて「会社設定に従う」に変更
	{
		var postid = A_data[0];
		var telno = A_data[1];

		if (preg_match("/^0[789]0/", telno) && telno.length >= 11) {
			var telno_view = telno.substr(0, 3) + "-" + telno.substr(3, 4) + "-" + telno.substr(7);
		} else {
			telno_view = telno;
		}

		if (undefined !== H_telX_info[telno] == true) //nullは\\nに置換
			{
				var H_tmp_info = H_telX_info[telno];
				var endcnt = H_tmp_info.length;

				for (var cnt = 0; cnt < endcnt; cnt++) {
					if (H_tmp_info[cnt] == undefined || H_tmp_info[cnt] == "") {
						H_tmp_info[cnt] = "\\N";
					}
				}
			} else {
			H_tmp_info = A_nullbox;
		}

		if (H_tmp_info[27] == 0) {
			H_tmp_info[27] = "\\N";
		}

		H_tmp_info[28] = "\\N";
		fwrite(fp_telX, pactid + "\t" + postid + "\t" + telno + "\t" + telno_view + "\t" + H_tmp_info[0] + "\t" + NTTCOM_CARRIER_ID + "\t" + NTTCOM_AREA_ID + "\t" + NTTCOM_CIRCUIT_ID + "\t" + H_tmp_info[1] + "\t" + H_tmp_info[2] + "\t" + H_tmp_info[3] + "\t" + H_tmp_info[4] + "\t" + H_tmp_info[5] + "\t" + H_tmp_info[6] + "\t" + H_tmp_info[7] + "\t" + H_tmp_info[8] + "\t" + H_tmp_info[9] + "\t" + H_tmp_info[10] + "\t" + H_tmp_info[11] + "\t" + H_tmp_info[12] + "\t" + H_tmp_info[13] + "\t" + H_tmp_info[14] + "\t" + H_tmp_info[15] + "\t" + H_tmp_info[16] + "\t" + H_tmp_info[17] + "\t" + H_tmp_info[18] + "\t" + H_tmp_info[19] + "\t" + H_tmp_info[20] + "\t" + H_tmp_info[21] + "\t" + H_tmp_info[22] + "\t" + H_tmp_info[23] + "\t" + H_tmp_info[24] + "\t" + H_tmp_info[25] + "\t" + H_tmp_info[26] + "\t" + H_tmp_info[27] + "\t" + H_tmp_info[28] + "\t" + H_tmp_info[29] + "\t" + H_tmp_info[30] + "\t" + nowtime + "\t" + nowtime + "\n");
	}

	fclose(fp_telX);
	return 0;
};

function doSumRecord(line, dbh) //
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

function doTotalRecord(line, TotalUp, dbh) //分割してみる.
//DEBUG * 表示してみる
//print "==== doTotalRecord ================================\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
{
	if (!("Trail_POS" in global)) Trail_POS = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid" in global)) pactid = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("allTotalUp" in global)) allTotalUp = undefined;
	var record = splitFix(line, Trail_POS);
	var total = +record[3];

	if (total != TotalUp) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4F1A\u793E\u5408\u8A08\u91D1\u984D\u304C\u7570\u306A\u308A\u307E\u3059.(" + total + "!=" + TotalUp + ").");
		return 1;
	}

	return 0;
};

function writeTuwaFile(pactid, billdate, A_commFileData) //データがなければ終了
{
	if (!("H_pactid" in global)) H_pactid = undefined;
	if (!("fp_commhistory" in global)) fp_commhistory = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("dataDir" in global)) dataDir = undefined;
	if (!("commhistoryX_tb" in global)) commhistoryX_tb = undefined;
	if (!("file_commhistory" in global)) file_commhistory = undefined;

	if (A_commFileData.length == 0) {
		return 0;
	}

	fp_commhistory = fopen(file_commhistory, "w");

	if (fp_commhistory == undefined) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	for (var data of Object.values(A_commFileData)) {
		fwrite(fp_commhistory, data);
	}

	fclose(fp_commhistory);
	return 0;
};

function writeInsFile(pactid, billdate, A_fileData) //ASP利用料金
//データが空のときは終了.
//通話料の合算を請求明細データに入れる 20070126iga
//現在の日付を得る
//権限チェック「ASP利用料表示設定」がONになっているか
//電話番号別detailNo保持
//処理済み電話番号記録用
//通話料金の合計だけ先に書き出す
//各請求データを書き出す
//消費税を書き出す
//ASP利用料を書き出す
{
	if (!("H_pactid" in global)) H_pactid = undefined;
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	if (!("fp_teldetails" in global)) fp_teldetails = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("dummytelno" in global)) dummytelno = undefined;
	if (!("dataDir" in global)) dataDir = undefined;
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("H_TuwaCharge" in global)) H_TuwaCharge = undefined;
	if (!("H_taxCharge" in global)) H_taxCharge = undefined;
	if (!("file_teldetails" in global)) file_teldetails = undefined;
	if (!("g_anbun" in global)) g_anbun = undefined;
	if (!("TotalUp" in global)) TotalUp = undefined;
	if (!("allTotalUp" in global)) allTotalUp = undefined;
	var aspCharge = 0;
	var aspFlg = false;

	if (A_fileData.length == 0) {
		return 0;
	}

	if (undefined !== dummytelno == false || dummytelno == "") {
		dummytelno = "";
	}

	if (g_anbun == "y") //割引総額を算出
		//通話料総額を算出
		//割引額を計算用に調整.割引が1以上(割引じゃなく加算になる)時はエラー
		//割引率 小数点5位で四捨五入
		//debug
		//		print $master_discount."\n";
		//		print $TotalTuwa."\n";
		//		print $TotalWari."\n";
		//割引額を入れる
		//按分後の請求額とNTTcomからの請求額に差があれば調整金を設定
		{
			var TotalWari = 0;
			var EtcWari = 0;

			for (var anbun_key in A_fileData) {
				var anbun_val = A_fileData[anbun_key];

				if (anbun_val[4] == REF_HOUZIN_WARI || anbun_val[4] == REF_HOUZIN_KIHON) //按分したら割引額は削除する
					{
						TotalWari += anbun_val[2];
						delete A_fileData[anbun_key];
					} else if (anbun_val[4] == REF_TYOUSEI) {
					EtcWari += anbun_val[2];
				}
			}

			var anbun_key = anbun_val = 0;
			var TotalTuwa = 0;

			for (var anbun_key in H_TuwaCharge) {
				var anbun_val = H_TuwaCharge[anbun_key];
				TotalTuwa += anbun_val.charge;
			}

			if (TotalWari > 0) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u5272\u5F15\u984D\u304C\u7570\u5E38\u3067\u3059.");
				return 1;
			}

			TotalTuwa = TotalTuwa + EtcWari;
			var master_discount = TotalWari / TotalTuwa;
			master_discount = Math.ceil(master_discount * 10000) / 10000;
			anbun_key = anbun_val = TotalAnbun = 0;
			var H_AnbunData = Array();

			for (var anbun_key in H_TuwaCharge) {
				var anbun_val = H_TuwaCharge[anbun_key];

				if (undefined !== H_AnbunData[anbun_key] == false) {
					H_AnbunData[anbun_key] = {
						telno: anbun_key,
						charge: 0
					};
				}

				H_AnbunData[anbun_key].charge = Math.round(anbun_val.charge * master_discount);
				TotalAnbun += H_AnbunData[anbun_key].charge;
			}

			var tel_cnt = H_TuwaCharge.length;

			if (TotalTuwa + TotalAnbun != allTotalUp) //反転しないと請求額が増える
				//調整額が回線数を超えたらエラー(回線毎に四捨五入なので、最大でも1台あたり1円にしかならない)
				{
					var code = REF_NTTCOM_TYOSEI;
					var charge = (TotalTuwa + TotalAnbun - allTotalUp) * -1;

					if (charge > tel_cnt || 0 - charge > tel_cnt) {
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u8ABF\u6574\u984D\u304C\u7570\u5E38\u3067\u3059.(" + tel_cnt + ":" + charge + ")");
					}

					var A_meisai = [dummytelno, code, charge, TAXFREE, REF_NTTCOM_TYOSEI];
					A_fileData.push(A_meisai);
				}
		}

	var A_TuwaData = Array();

	if (H_TuwaCharge.length > 0) {
		for (var data of Object.values(H_TuwaCharge)) {
			code = H_utiwake[G_CODE_TUWA].code;
			A_meisai = [data.telno, code, data.charge, TAXFREE, G_CODE_TUWA];
			A_TuwaData.push(A_meisai);
		}
	}

	if (g_anbun == "y") {
		var A_AnbunData = Array();

		if (H_AnbunData.length > 0) {
			for (var data of Object.values(H_AnbunData)) {
				code = H_utiwake[G_CODE_WARI].code;
				A_meisai = [data.telno, code, data.charge, TAXFREE, G_CODE_WARI];
				A_TuwaData.push(A_meisai);
			}
		}
	}

	var A_taxData = Array();

	if (H_taxCharge.length > 0) {
		for (var data of Object.values(H_taxCharge)) {
			A_meisai = [data.telno, H_TAX, data.tax, 13, H_TAX];
			A_taxData.push(A_meisai);
		}
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

	fp_teldetails = fopen(file_teldetails, "w");

	if (fp_teldetails == undefined) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var detailNo = 0;
	var A_detail = Array();
	var A_outTel = Array();

	for (var data of Object.values(A_TuwaData)) //初処理の電話番号は処理済み配列に加える
	{
		fwrite(fp_teldetails, pactid + "\t" + data[0] + "\t" + data[1] + "\t" + H_utiwake[data[4]].name + "\t" + data[2] + "\t" + H_Zei_CODE[data[3]] + "\t" + detailNo + "\t" + nowtime + "\t" + NTTCOM_CARRIER_ID + "\n");
		A_detail[data[0]] = 1;

		if (-1 !== A_outTel.indexOf(data[0]) == false) {
			A_outTel.push(data[0]);
		}
	}

	for (var data of Object.values(A_fileData)) //通話料合計が処理された番号ならdetailNoを引き継ぐ
	//初めて処理される番号は処理済み番号記録用の配列に追加
	//初処理の電話番号は処理済み配列に加える
	{
		if (undefined !== A_detail[data[0]] == true) {
			detailNo = A_detail[data[0]];
		} else {
			detailNo = 0;
		}

		if (-1 !== A_outTel.indexOf(data[0]) == false) {
			A_outTel.push(data[0]);
		}

		fwrite(fp_teldetails, pactid + "\t" + data[0] + "\t" + data[1] + "\t" + H_utiwake[data[4]].name + "\t" + data[2] + "\t" + H_Zei_CODE[data[3]] + "\t" + detailNo + "\t" + nowtime + "\t" + NTTCOM_CARRIER_ID + "\n");
		detailNo++;
		A_detail[data[0]] = detailNo;

		if (-1 !== A_outTel.indexOf(data[0]) == false) {
			A_outTel.push(data[0]);
		}
	}

	for (var data of Object.values(A_taxData)) //初処理の電話番号は処理済み配列に加える
	{
		detailNo = A_detail[data[0]];
		fwrite(fp_teldetails, pactid + "\t" + data[0] + "\t" + data[1] + "\t" + H_utiwake[data[4]].name + "\t" + data[2] + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTCOM_CARRIER_ID + "\n");
		detailNo++;
		A_detail[data[0]] = detailNo;

		if (-1 !== A_outTel.indexOf(data[0]) == false) {
			A_outTel.push(data[0]);
		}
	}

	for (var data of Object.values(A_outTel)) //dummy電話にはASP利用料はつけない
	{
		if (dummytelno != data) //電話料合計用に+1する
			{
				detailNo = A_detail[data];
				detailNo++;

				if (aspFlg == true) //ASP利用料を出力
					//ASP利用料消費税を出力
					{
						fwrite(fp_teldetails, pactid + "\t" + data + "\t" + G_CODE_ASP + "\t" + H_utiwake[G_CODE_ASP].name + "\t" + aspCharge + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTCOM_CARRIER_ID + "\n");
						detailNo++;
						fwrite(fp_teldetails, pactid + "\t" + data + "\t" + G_CODE_ASX + "\t" + H_utiwake[G_CODE_ASX].name + "\t" + +(aspCharge * G_EXCISE_RATE + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTCOM_CARRIER_ID + "\n"));
					}
			}
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

function doDelete(pactid, dbh) //tel_Detail_X_tbから削除
//delte失敗した場合
//delte失敗した場合
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("commhistoryX_tb" in global)) commhistoryX_tb = undefined;
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var sql_str = "delete from " + teldetailX_tb + " where pactid=" + pactid + " and carid=" + NTTCOM_CARRIER_ID;
	var rtn = dbh.query(sql_str, false);

	if ("object" === typeof rtn == true) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			dbh.rollback();
			return 1;
		}

	sql_str = "delete from " + commhistoryX_tb + " where pactid=" + pactid + " and carid=" + NTTCOM_CARRIER_ID;
	rtn = dbh.query(sql_str, false);

	if ("object" === typeof rtn == true) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			dbh.rollback();
			return 1;
		}

	return 0;
};

function doBackup(dbh) //tel_details_X_tb をエクスポートする
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("commhistoryX_tb" in global)) commhistoryX_tb = undefined;
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + date("YmdHis") + ".exp";
	var sql = "select * from " + teldetailX_tb;
	dbh.begin();

	if (doCopyExp(sql, outfile, dbh) != 0) //ロールバック
		//ロック解除
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
			dbh.rollback();
			lock(false, dbh);
			throw die(1);
		}

	outfile = DATA_EXP_DIR + "/" + commhistoryX_tb + date("YmdHis") + ".exp";
	sql = "select * from " + commhistoryX_tb;

	if (doCopyExp(sql, outfile, dbh) != 0) //ロールバック
		//ロック解除
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
			dbh.rollback();
			lock(false, dbh);
			throw die(1);
		}

	outfile = DATA_EXP_DIR + "/" + telX_tb + date("YmdHis") + ".exp";
	sql = "select * from " + telX_tb;

	if (doCopyExp(sql, outfile, dbh) != 0) //ロールバック
		//ロック解除
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
			dbh.rollback();
			lock(false, dbh);
			throw die(1);
		}

	dbh.commit();
	return 0;
};

function doImport(file_telX, file_teldetails, file_commhistory, dbh) //使用者情報を追加 20071012iga
//commhistory_tbへのインポート
{
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("commhistoryX_tb" in global)) commhistoryX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (filesize(file_telX) > 0) {
		var telX_col = ["pactid", "postid", "telno", "telno_view", "userid", "carid", "arid", "cirid", "machine", "color", "employeecode", "username", "mail", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "date1", "date2", "memo", "kousiflg", "kousiptn", "username_kana", "kousi_fix_flg", "recdate", "fixdate"];

		if (doCopyInsert(telX_tb, file_telX, telX_col, dbh) != 0) //ロールバック
			//ロック解除
			//lock(false, $dbh);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				dbh.rollback();
				throw die(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

	if (filesize(file_teldetails) > 0) {
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid"];

		if (doCopyInsert(teldetailX_tb, file_teldetails, teldetailX_col, dbh) != 0) //ロールバック
			//ロック解除
			//lock(false, $dbh);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				dbh.rollback();
				throw die(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	} else //ファイルサイズが０？
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\uFF10\u3067\u3059.");
			return 1;
		}

	if (filesize(file_commhistory) > 0) {
		var commhisotry_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "byte", "callseg", "callsegname", "chageseg", "discountseg", "occupseg", "kubun1", "kubun2", "kubun3", "carid", "byte_mail", "byte_site", "byte_other", "kousiflg", "multinumber"];

		if (doCopyInsert(commhistoryX_tb, file_commhistory, commhisotry_col, dbh) != 0) //ロールバック
			//ロック解除
			//lock(false, $dbh);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				dbh.rollback();
				throw die(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + " \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	} else //ファイルサイズが０？
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "\u306E\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\uFF10\u3067\u3059.");
			return 1;
		}

	return 0;
};

function doCopyInsert(table, filename, columns, dbh) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var fp = fopen(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var ins = new TableInserter(logh, dbh, filename + ".sql", true);
	ins.begin(table);

	while (line = fgets(fp)) //データはtab区切り
	//インサート行の追加
	{
		var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) //要素数が異なっていたら
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002\u30C7\u30FC\u30BF=" + line);
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
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F\u3001\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557.");
		fclose(fp);
		return 1;
	}

	fclose(fp);
	return 0;
};

function doCopyExp(sql, filename, dbh) //ログファイルハンドラ
//一度にFETCHする行数
//ファイルを開く
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var NUM_FETCH = 10000;
	var fp = fopen(filename, "wt");

	if (!fp) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	dbh.query("DECLARE exp_cur CURSOR FOR " + sql);

	for (; ; ) //ＤＢから１行ずつ結果取得
	{
		var result = pg_query(dbh.m_db.connection, "FETCH " + NUM_FETCH + " IN exp_cur");

		if (result == undefined) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Fetch error, " + sql);
			fclose(fp);
			return 1;
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
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557\u3001" + str);
			fclose(fp);
			return 1;
		}
	}

	dbh.query("CLOSE exp_cur");
	fclose(fp);
	return 0;
};

function finalData(pactid, pactDir, finDir) //同名のファイルが無いか
{
	if (!("logh" in global)) logh = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (is_file(finDir) == true) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + finDir + "\u306F\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3067\u306F\u3042\u308A\u307E\u305B\u3093.");
		return 1;
	}

	if (is_dir(finDir) == false) //なければ作成する
		{
			if (mkdir(finDir) == false) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u7570\u52D5\u5148\u306E" + finDir + "\u304C\u4F5C\u6210\u3067\u304D\u306A\u304B\u3063\u305F.");
				return 1;
			}
		}

	var retval = 0;
	var dirh = opendir(pactDir);

	while (fname = readdir(dirh)) {
		var fpath = pactDir + "/" + fname;

		if (is_file(fpath)) //ファイル移動
			{
				if (rename(fpath, finDir + "/" + fname) == false) {
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "\u306E\u7570\u52D5\u5931\u6557.");
					retval = 1;
				}
			}

		clearstatcache();
	}

	closedir(dirh);
	return retval;
};

function usage(comment, dbh) //print "Usage) " . $_SERVER["argv"][0] . " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n";
//print "		-t 当月データ	(N:データは今月のもの,O:データは先月のもの)\n\n";
{
	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -a={Y|N}\n");
	print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	print("\t\t-a \u6309\u5206 (Y:\u6309\u5206\u3059\u308B,N:\u6309\u5206\u3057\u306A\u3044)\n\n");
	throw die(1);
};

function getRootPostid(pactid, table) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select postidparent from " + table + " where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
	var rootPostid = dbh.getOne(sql_str, true);
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
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + NTTCOM_CARRIER_ID;
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