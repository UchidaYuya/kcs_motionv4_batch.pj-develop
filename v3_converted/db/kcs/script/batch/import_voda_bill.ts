//===========================================================================
//機能：請求情報ファイルインポートプロセス（vodafone専用）
//
//作成：中西
//更新履歴
//２重起動防止チェックの不具合修正 2009/3/19 s.maeda
//===========================================================================
//このスクリプトの日本語処理名
//Call1xxxx.txt というファイル名.
//ダミー電話番号の接頭子
//ダミー電話番号の長さ
//レコード１行の長さ
//vodafoneのキャリアID
//-- 地域コードをDBから取得するように変更、2005/03/30
//define("VODA_AREA_ID", 26 );	// vodafoneの地域コード（未確定）
//40 | 未確定            |     4 |   99	<= これで登録すればよい。
//26 | vodafone                |     4 |    4	<= これに変更.
//-- やっぱり「40:voda未確定」に変更、2005/05/10
//define("VODA_AREA_ID", 40 );	// vodafoneの地域コード（未確定）
//地域コードは共通化した 2008/10/28
//define("VODA_CIRCUIT_ID", 11 );	// vodafoneの回線ID
//vodafoneの回線ID
//3G等の種類が増えたのでキャリアIDは「その他」とした. 2005/05/17
//以下はcommonで定義済み
//define("G_AUTH_ASP", 2);	//ASP使用料を表示するか
//define("G_CODE_ASP", "ASP");	//ASP利用料金
//define("G_CODE_ASX", "ASX");	//同税額
//define("G_CODE_TAX", "TAX");//税額（ＤＤＩで使用）
//define("G_EXCISE_RATE", 0.05);//消費税率
//---------------------------------------------------------------------------
//固定長フォーマットの定義
//管理レコード
//明細内訳レコード
//税区分コード表
//---------------------------------------------------------------------------
//"02DWG101"「全国一括大口通話料割引」で固定とする
//"028M3B21"「パケットし放題　割引金額（定額料無料期間）　※」で固定とする
//"080A3002"「未指定調整（外税）※」で固定とする
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//DEBUG * 標準出力に出してみる.
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//開始メッセージ
//メール出力を減らすためコメントアウト 20091109miya
//$logh->putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ . LOG_DELIM . "処理開始.");
//パラメータチェック
//$cnt 0 はスクリプト名のため無視
//END 引数の取得
//請求データファイルがあるディレクトリを指定
//処理する契約ＩＤ配列
//処理が終了した pactid を格納するための配列
//契約ＩＤの指定が全て（all）の時
//テーブル名設定
//出力ファイル作成
//会社名マスターを作成
//処理する契約ＩＤ
//全てのPactについてLOOP.
//END Pactごとの処理.
//出力ファイルクローズ
//ここまでに成功したファイルが無ければ終了する.
//バックアップをとる
//メール出力を減らすためコメントアウト 20091109miya
//$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//. "インポート処理完了." );
//処理済みのデータを移動
//２重起動ロック解除
//終了メッセージ
//メール出力を減らすためコメントアウト 20091109miya
//$logh->putError(G_SCRIPT_END, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//. "処理完了.");
//END Main
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 各ファイルについての処理
//[引　数] $fileName 対象ファイル名
//[返り値] 終了コード　1（失敗）、２（エラーだが継続処理を継続）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 管理レコードのチェック
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）、２（エラーだが継続処理を継続）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 請求先単位レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）、２（エラーだが継続処理を継続）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 会社合計レコードの処理
//[引　数] $line 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話番号登録を行う
//[引　数] $telno 電話番号、$telno_view 電話番号ハイフン付き
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 A_telData, A_telXData の中に telno が含まれているかどうかチェックする
//[引　数] $A_array 配列、$telno 電話番号
//[返り値] 電話番号が存在したらTrue
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 ダミー電話番号登録を行う
//[引　数] $telno ダミー電話番号、$postid ダミー部署ID
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 ルート部署にダミー電話番号登録を行う
//[引　数] $telno ダミー電話番号、$postid ダミー部署ID
//[返り値] ダミー電話番号
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ダミー電話番号の文字列を取得する
//[引　数] $pactid：契約ＩＤ
//[返り値] ダミー電話番号文字列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//データベースよりダミー電話番号を取得する
//[引　数] $pactid：契約ＩＤ、$seikyuNo：請求番号
//[返り値] ダミー電話番号、ダミー電話所属部署
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 部署IDが存在するかどうかを確認する
//[引　数] $pactid、$postid 部署ID、$post_tb
//[返り値] 存在すればその数、無ければ０
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ルート部署のシステム用部署ＩＤを取得する
//[引　数] $pactid：契約ＩＤ
//$table：テーブル名
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 消費税、割引、ＡＳＰ使用料の計算処理を行う
//[引　数] $A_fileData 読み取ったデータ、$A_div 按分用データ、$A_calcData 計算後のデータ（出力）
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話番号登録を行うinsファイルへの書き出し。
//[引　数] $telno 電話番号
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 A_fileDataをソートする関数、usortで使用
//[引　数] $a, $b 比較対象
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
//バックアップをとる
//[引　数] $db
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//旧データをＤＢから削除する
//[引　数] $db
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//旧データをＤＢから削除する
//[引　数] $db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
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
//clamptask_tb にレコードを追加し２重起動を防止する
//[引　数] $is_lock： true：ロックする、false：ロック解除
//&$db： DBハンドル
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
const SCRIPT_NAMEJ = "vodafone\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8";
const SCRIPTNAME = "import_voda_bill.php";

require("lib/script_db.php");

require("lib/script_log.php");

const VODA_DIR = "/vodafone/bill";
const VODA_PAT = "/^Call1/";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const PRE_DUMMY_TEL = "VODA";
const DUMMY_TEL_LENG = 11;
const LINE_LENGTH = 256;
const VODA_CARRIER_ID = 4;
const VODA_AREA_ID = 100;
const VODA_CIRCUIT_ID = 12;
var Kanri_POS = [1, 11, 19, 25, 33, 41, 49];
var Meisai_POS = [1, 3, 13, 26, 86, 95, 155, 165, 166, 176, 186];
var H_Zei_CODE = {
	OT: "\u5916\u7A0E",
	IN: "\u5185\u7A0E",
	EX: " ",
	"  ": " "
};
var G_Code_LargeTuwa = "02DWG101";
var G_Code_PakeHodai = "028M3B21";
var G_Code_MisiteiAdjust = "080A3002";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.PutListener(log_listener_type);
log_listener.PutListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);

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

	if (ereg("^-t=", _SERVER.argv[cnt]) == true) //今月のデータかどうかのチェック
		{
			var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^[no]$", teltable) == false) {
				usage("ERROR: \u4ECA\u6708\u306E\u30C7\u30FC\u30BF\u304B\u3069\u3046\u304B\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			}

			continue;
		}

	usage("", dbh);
}

var dataDir = DATA_DIR + "/" + billdate + VODA_DIR;

if (is_dir(dataDir) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093.");
}

var A_pactid = Array();
var A_pactDone = Array();

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

if (lock(true, dbh) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\uFF12\u91CD\u8D77\u52D5\u3067\u3059\u3001\u524D\u56DE\u30A8\u30E9\u30FC\u7D42\u4E86\u306E\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059.");
	throw die(1);
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var telX_tb = "tel_" + tableNo + "_tb";
var postX_tb = "post_" + tableNo + "_tb";
var postrelX_tb = "post_relation_" + tableNo + "_tb";
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
var file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid_in + ".ins";
var fp_teldetails = fopen(file_teldetails, "w");

if (fp_teldetails == undefined) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
	throw die(1);
}

var file_tel = dataDir + "/" + "tel_tb" + billdate + pactid_in + ".ins";
var fp_tel = fopen(file_tel, "w");

if (fp_tel == undefined) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_tel + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
	throw die(1);
}

var file_telX = dataDir + "/" + telX_tb + billdate + pactid_in + ".ins";
var fp_telX = fopen(file_telX, "w");

if (fp_telX == undefined) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
	throw die(1);
}

var sql = "select pactid,compname from pact_tb order by pactid";
var H_result = dbh.getHash(sql, true);
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
//utiwake_tb より内訳レコードを取得する -- 2007/05/21 pactごとに個別取得
//UPDATE START kamoku_rel_utiwake_tb じゃなくutiwake_tb から取得 by kenichiro uesugi
//$sql  = "select ut.code, ut.name, ut.taxtype, kr.kamokuid from utiwake_tb ut";
//$sql .= " inner join kamoku_rel_utiwake_tb kr on ut.code=kr.code where ut.carid=". VODA_CARRIER_ID ;
//$sql .= " and (kr.pactid=0 or kr.pactid=". $pactid .")";
//$sql .= " order by ut.code, kr.pactid";	// 0よりもpactidを優先する
//0より後に来たpactidで上書きされる仕組み
//UPDATE END
//bill_prtel_tb より請求先番号を得る
//請求月電話番号マスター作成
//ルート部署を取得
//現在用
//請求月用
//ファイル毎のデータを保存する
//計算処理後の詳細データ
//ダミー電話リスト	20071011 UPDATE
//按分用電話データ
//電話番号指定のない請求 2009/06/15
//END ファイルごとの処理
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
				if (preg_match(VODA_PAT, fileName)) {
					A_billFile.push(fileName);
				} else {
					logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + "\u306F\u51E6\u7406\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F.");
				}
			}

		clearstatcache();
	}

	if (A_billFile.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "\u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093.");
			closedir(dirh);
			continue;
		}

	closedir(dirh);
	var H_utiwake = Array();
	sql = "select code, name, taxtype, kamoku from utiwake_tb ";
	sql += " where carid=" + VODA_CARRIER_ID;
	sql += " order by code ";
	H_result = dbh.getHash(sql, true);

	for (var ucnt = 0; ucnt < H_result.length; ucnt++) //内訳コード => 内訳内容
	{
		var code = H_result[ucnt].code;
		H_utiwake[code] = H_result[ucnt];
	}

	var A_codes = Array();
	sql = "select prtelno from bill_prtel_tb where pactid=" + pactid + " and carid=" + VODA_CARRIER_ID;
	H_result = dbh.getHash(sql, true);

	for (var idx = 0; idx < H_result.length; idx++) {
		A_codes.push(H_result[idx].prtelno);
	}

	if (A_codes.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "\u306B\u3064\u3044\u3066\u306E\u8ACB\u6C42\u5148\u756A\u53F7\u304Cbill_prtel_tb\u306B\u898B\u3064\u304B\u308A\u307E\u305B\u3093.");
			continue;
		}

	var A_telno = Array();
	sql = "select telno from tel_tb where pactid=" + pactid + " and carid=" + VODA_CARRIER_ID;

	for (var data of Object.values(dbh.getHash(sql, true))) {
		A_telno.push(data.telno);
	}

	var A_telnoX = Array();
	sql = "select telno from " + telX_tb + " where pactid=" + A_pactid[cnt] + " and carid=" + VODA_CARRIER_ID;

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
	var A_calcData = Array();
	var A_telData = Array();
	var A_telXData = Array();
	var A_DummyTel = Array();
	var A_div = Array();
	var A_dummyFileData = Array();
	var DummyTel = "";
	var DummyPost = "";
	var errFlag = false;

	for (var fileName of Object.values(A_billFile)) //消費税合計金額
	//法人複数回線割引
	//大口通話料割引 20110315 houshiyama
	//パケットし放題　割引金額 20110315 houshiyama
	//未指定調整（外税））	20071011 UPDATE
	//ファイル名から請求番号を得る -- 2006/07/05
	//ファイル名は Call12006073000000002.txt といった形で来ているので、そこから切り取る.
	//先頭のCall1を除く
	//YYYYMMを除く
	//末尾の.txtを除く
	//ダミー電話とダミー部署を求める
	//print "DEBUG: ダミー電話=" . $DummyTel . " :: " . $DummyPost . "\n";
	//ダミー電話を配列に追加　	20071011 UPDATE
	//読込処理開始
	//メール出力を減らすためコメントアウト 20091109miya
	//$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $billdate . LOG_DELIM
	//. $dataDirPact ."/". $fileName . LOG_DELIM . "データ読込処理開始." );
	//読込電話件数
	//読込明細件数
	//追加する電話数
	//追加する電話数
	//按分用データをクリアーする
	//ファイル毎のデータをクリアーする
	//電話番号なし請求をクリアーする
	{
		var SumTax = 0;
		var MultuHoujin = 0;
		var LargeTuwa = 0;
		var PakeHodai = 0;
		var MisiteiAdjust = 0;
		var SeikyuNo = preg_replace(VODA_PAT, "", fileName);
		SeikyuNo = SeikyuNo.replace(/^[0-9]{6}/gi, "");
		SeikyuNo = SeikyuNo.replace(/\.txt$/gi, "");
		var H_dummy = selectDummyTel(pactid, SeikyuNo);

		if (H_dummy == undefined) //ダミー電話がＤＢに記録されていなかった
			//ファイルが１個だけでダミー電話が見つからなかったら、ルート部署に登録する
			{
				if (A_billFile.length == 1) //結果をグローバル変数に反映
					{
						DummyTel = registDummyTel2Root(pactid, dbh);
						DummyPost = rootPostidX;
					} else //ファイルが２個以上あったらエラー
					//エラーがあったらそこで中断.
					{
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u756A\u53F7(" + SeikyuNo + ")\u306B\u5BFE\u3059\u308B\u30C0\u30DF\u30FC\u96FB\u8A71\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093.");
						errFlag = true;
						break;
					}
			} else //部署の存在チェック
			{
				DummyTel = H_dummy[0].telno;
				DummyPost = H_dummy[0].postid;

				if (checkPostID(pactid, DummyPost, postX_tb) == 0) //エラーがあったらそこで中断.
					{
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u90E8\u7F72ID(" + DummyPost + ")\u306F" + postX_tb + "\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\u3001dummy_tel_tb\u3092\u898B\u76F4\u3057\u3066\u4E0B\u3055\u3044.");
						errFlag = true;
						break;
					}

				registDummyTel(DummyTel, DummyPost);
			}

		A_DummyTel.push(DummyTel);
		var ReadTelCnt = 0;
		var ReadMeisaiCnt = 0;
		var AddTelCnt = 0;
		var AddTelXCnt = 0;
		var rtn = doEachFile(dataDirPact + "/" + fileName, pactid, billdate, A_fileData, dbh);

		if (rtn == 1) //エラーがあったらそこで中断.
			{
				errFlag = true;
				break;
			} else if (rtn == 2) //エラーだが処理を続行
			{
				errFlag = true;
			}

		if (doCalc(pactid, A_fileData, A_div) != 0) //エラーがあったらそこで中断.
			{
				errFlag = true;
				break;
			}

		A_div = Array();
		A_fileData = Array();
		A_dummyFileData = Array();
	}

	if (errFlag == false) //ファイルに書き出す
		//メール出力を減らすためコメントアウト 20091109miya
		//$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $billdate . LOG_DELIM
		//. "データ書出処理開始." );
		{
			writeTelData(pactid);

			if (writeInsFile(pactid, A_calcData) == 1) //次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
					continue;
				}

			fflush(fp_teldetails);
			fflush(fp_tel);
			fflush(fp_telX);
			A_pactDone.push(pactid);
		}
}

fclose(fp_teldetails);
fclose(fp_tel);
fclose(fp_telX);

if (A_pactDone.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u8AAD\u307F\u8FBC\u307F\u306B\u6210\u529F\u3057\u305FPact\u304C\uFF11\u3064\u3082\u7121\u304B\u3063\u305F.");
	throw die(1);
}

dbh.begin();

if (backup == "y") //メール出力を減らすためコメントアウト 20091109miya
	//$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
	//. "バックアップ処理開始." );
	//メール出力を減らすためコメントアウト 20091109miya
	//$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
	//. "バックアップ処理完了." );
	{
		doBackup(dbh);
	}

if (mode == "o") //メール出力を減らすためコメントアウト 20091109miya
	//$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
	//. "デリート処理開始." );
	//メール出力を減らすためコメントアウト 20091109miya
	//$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
	//. "デリート処理完了." );
	{
		doDelete(A_pactDone, dbh);
	}

doImport(file_tel, file_telX, file_teldetails, dbh);
dbh.commit();

for (var pactid of Object.values(A_pactDone)) {
	var pactDir = dataDir + "/" + pactid;
	var finDir = pactDir + "/" + FIN_DIR;
	finalData(pactid, pactDir, finDir);
}

lock(false, dbh);
throw die(0);

function doEachFile(fileName, pactid, billdate, A_fileData, db) //2006/12/21 エラーだが処理を継続するためのフラグ
//ファイルオープン
//管理レコードのチェック
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	var error_flag = false;
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

	var TotalUp = 0;

	while (line = fgets(fp)) //改行取り
	//１行の長さチェック
	//10:通話単位、20:請求先単位、30:請求先合計料
	//10:通話単位
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

		var dataKind = line.substr(1, 2);

		if (dataKind == "10") {
			var sum = 0;
			var rtn = doTelRecord(line, pactid, A_fileData, sum, db);

			if (rtn == 1) {
				flock(fp, LOCK_UN);
				fclose(fp);
				return 1;
			} else if (rtn == 2) //2006/12/21 -- エラーだが処理を継続する
				{
					error_flag = true;
				}

			TotalUp += sum;
		} else if (dataKind == "20") {
			sum = 0;
			rtn = doSumRecord(line, pactid, A_fileData, sum, db);

			if (rtn == 1) {
				flock(fp, LOCK_UN);
				fclose(fp);
				return 1;
			} else if (rtn == 2) //2006/12/21 -- エラーだが処理を継続する
				{
					error_flag = true;
				}

			TotalUp += sum;
		} else if (dataKind == "30") {
			if (doTotalRecord(line, TotalUp) == 1) {
				flock(fp, LOCK_UN);
				fclose(fp);
				return 1;
			}
		} else {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u672A\u77E5\u306E\u8868\u793A\u533A\u5206(" + dataKind + ").");
			flock(fp, LOCK_UN);
			fclose(fp);
			return 1;
		}
	}

	flock(fp, LOCK_UN);
	fclose(fp);

	if (error_flag) //途中でエラーがあったかどうか
		{
			return 2;
		}

	return 0;
};

function checkKanriRecord(line, fileName, pactid, billdate, db) //１行の長さチェック
//データ種類チェック
//締日が遅い会社もある、１ヶ月前まで許容範囲とする -- 2006/07/21
//請求年月 = 利用年月 + 1.
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;

	if (line.length != LINE_LENGTH) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u4E00\u884C\u306E\u9577\u3055\u304C\u7570\u5E38(" + line.length + "!=" + LINE_LENGTH + ").");
		return 1;
	}

	if (!("Kanri_POS" in global)) Kanri_POS = undefined;
	var record = splitFix(line, Kanri_POS);

	if (record[0] != "1") //管理レコードは"1"
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u7BA1\u7406\u30EC\u30B3\u30FC\u30C9\u306B\u7570\u5E38(" + record[0] + ").");
			return 1;
		}

	var target_yyyy = record[3].substr(0, 4);
	var target_mm = record[3].substr(4, 2);
	var target_yyyymm0 = target_yyyy + target_mm;
	target_mm += 1;

	if (target_mm > 12) {
		target_mm = 1;
		target_yyyy++;
	}

	if (target_mm < 10) //２桁にする.
		{
			target_mm = "0" + target_mm;
		}

	var target_yyyymm = target_yyyy + target_mm;

	if (target_yyyymm != billdate && target_yyyymm0 != billdate) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u30D5\u30A1\u30A4\u30EB\u306E\u5E74\u6708\u304C\u5BFE\u8C61\u5E74\u6708\u3068\u7570\u306A\u308A\u307E\u3059(" + target_yyyymm + "!=" + billdate + ").");
		return 1;
	}

	return 0;
};

function doTelRecord(line, pactid, A_fileData, sum, db) //請求先番号
//読込電話件数
//読込明細件数
//按分用電話データ
//前回の電話番号.
//分割してみる.
//-- DEBUG -- * 表示してみる
//print "**** doTelRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//請求先番号、チェックする
//ハイフン付きの電話番号を保持
//'-'ハイフンを除く
//消費税の処理
//対象回線の課税対象合計金額を求めておく
//電話番号 -> 請求金額
//大口通話料割引指定額按分
//対象回線数を求めておく = 電話件数に等しい.
//パケットし放題割引按分
//「パケットし放題定額料」だけを集計する。特別ルール：コードは "028M3900"
//明細件数カウント.
{
	if (!("Meisai_POS" in global)) Meisai_POS = undefined;
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("A_codes" in global)) A_codes = undefined;
	if (!("ReadTelCnt" in global)) ReadTelCnt = undefined;
	if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("A_div" in global)) A_div = undefined;
	if (!("dbh" in global)) dbh = undefined;
	if (!("_static_doTelRecord_prev_tel" in global)) _static_doTelRecord_prev_tel = "";
	var record = splitFix(line, Meisai_POS);
	var prtelno = record[2].trim();
	var errFlag = true;

	for (var a_code of Object.values(A_codes)) {
		var a_code = a_code.trim().replace(/-/g, "");

		if (prtelno == a_code) {
			errFlag = false;
			break;
		}
	}

	if (errFlag == true) //請求先番号が存在しない場合のメール送信予約追加20101202morihara
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u5148\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u89AA\u756A\u53F7\u3068\u7570\u306A\u3063\u3066\u3044\u307E\u3059(" + prtelno + ").");
			var sql = "insert into clamp_error_tb" + "(pactid,carid,error_type,message,is_send,recdate,fixdate)" + "values" + "(" + pactid + "," + VODA_CARRIER_ID + ",'prtelno'" + ",'\u30BD\u30D5\u30C8\u30D0\u30F3\u30AF\u306E\u8ACB\u6C42\u5148\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u89AA\u756A\u53F7\u3068\u7570\u306A\u3063\u3066\u3044\u307E\u3059'" + ",false" + ",'" + date("Y/m/d H:i:s") + "'" + ",'" + date("Y/m/d H:i:s") + "'" + ")" + ";";
			dbh.query(sql);
			return 1;
		}

	var telno_view = record[3].trim();
	var telno = telno_view.replace(/-/g, "");

	if (telno != _static_doTelRecord_prev_tel) //前回の電話番号と異なっていれば...
		//電話番号の登録
		//読み込んだレコード数をカウントする.
		//按分用の記録配列を作成する
		{
			registTel(telno, telno_view);
			_static_doTelRecord_prev_tel = telno;
			ReadTelCnt++;
			A_div[telno] = [0, 0, 0, 0];
		}

	var code = record[5].trim();
	var charge = +record[7];

	if (undefined !== H_utiwake[code]) //print "DEBUG: code=".  $code . ", ". $H_utiwake[$code]["name"] . ", " . $charge . " 円\n";
		//合計値を得る
		{
			sum += charge;
		} else //2006/12/21 -- エラーだが処理を継続する
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059(" + code + ").");
			return 2;
		}

	var div_array = A_div[telno];

	if (H_utiwake[code].taxtype == "OT") //外税のものだけ.
		//電話番号 -> 課税対象額
		{
			div_array[0] += charge;
		}

	if (H_utiwake[code].kamoku == "0") //基本料
		//電話番号 -> 基本使用料
		{
			div_array[1] += charge;
		}

	div_array[2] += charge;

	if (code == "028M3900" || preg_match("/\u30D1\u30B1\u30C3\u30C8\u3057\u653E\u984C\u3000\u5B9A\u984D\u6599/", record[6])) //電話番号 -> パケットし放題　定額料
		{
			div_array[3] += charge;
		}

	var A_meisai = [telno, code, charge];
	A_fileData.push(A_meisai);
	ReadMeisaiCnt++;
	A_div[telno] = div_array;
	return 0;
};

function doSumRecord(line, pactid, A_fileData, sum, db) //読込明細件数
//消費税合計金額
//法人複数回線割引
//法人複数回線割引のコード
//大口通話料割引
//大口通話料割引のコード
//パケットし放題割引
//パケットし放題割引のコード
//未指定調整（外税）	20071011 UPDATE
//未指定調整（外税））	20071011 UPDATE
//分割してみる.
//-- DEBUG -- * 表示してみる
//print "**** doSumRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//料金項目ＩＤ
//レコードを処理したかどうか。
//名前で見分けるしかないか。。。「法人複数回線割引」
//明細件数カウント.
{
	if (!("Meisai_POS" in global)) Meisai_POS = undefined;
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("SumTax" in global)) SumTax = undefined;
	if (!("MultuHoujin" in global)) MultuHoujin = undefined;
	if (!("G_Code_MultuHoujin" in global)) G_Code_MultuHoujin = undefined;
	if (!("LargeTuwa" in global)) LargeTuwa = undefined;
	if (!("G_Code_LargeTuwa" in global)) G_Code_LargeTuwa = undefined;
	if (!("PakeHodai" in global)) PakeHodai = undefined;
	if (!("G_Code_PakeHodai" in global)) G_Code_PakeHodai = undefined;
	if (!("MisiteiAdjust" in global)) MisiteiAdjust = undefined;
	if (!("G_Code_MisiteiAdjust" in global)) G_Code_MisiteiAdjust = undefined;
	if (!("A_dummyFileData" in global)) A_dummyFileData = undefined;
	var record = splitFix(line, Meisai_POS);
	var code = record[5].trim();
	var charge = +record[7];

	if (undefined !== H_utiwake[code]) //print "DEBUG: ".  $H_utiwake[$code]["name"] . ", " . $charge . " 円\n";
		//合計値を得る
		{
			sum += charge;
		} else //2006/12/21 -- エラーだが処理を継続する
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059(" + code + ").");
			return 2;
		}

	var sum_done = false;

	if (preg_match("/\u6CD5\u4EBA\u8907\u6570\u56DE\u7DDA\u5272\u5F15/", record[6])) //コードを取得しておく、最初の１個を取る。
		{
			MultuHoujin += charge;

			if (G_Code_MultuHoujin == "") //税コードのチェック
				//税コード
				{
					G_Code_MultuHoujin = code;
					var ut_zei = H_utiwake[G_Code_MultuHoujin].taxtype;

					if (!ut_zei || !H_Zei_CODE[ut_zei]) {
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u7A0E\u30B3\u30FC\u30C9\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (" + G_Code_MultuHoujin + ").");
						return 1;
					}
				}

			sum_done = true;
		}

	if (preg_match("/\u5927\u53E3\u901A\u8A71\u6599\u5272\u5F15/", record[6])) //コードを取得しておく、最初の１個を取る。
		{
			LargeTuwa += charge;

			if (G_Code_LargeTuwa == "") //$G_Code_LargeTuwa = $code ;	// 2006/04/17 廃止
				//税コードのチェック
				//税コード
				{
					ut_zei = H_utiwake[G_Code_LargeTuwa].taxtype;

					if (!ut_zei || !H_Zei_CODE[ut_zei]) {
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u7A0E\u30B3\u30FC\u30C9\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (" + G_Code_LargeTuwa + ").");
						return 1;
					}
				}

			sum_done = true;
		}

	if (preg_match("/\u30D1\u30B1\u30C3\u30C8\u3057\u653E\u984C\u3000\u5272\u5F15\u91D1\u984D/", record[6])) //コードを取得しておく、最初の１個を取る。
		{
			PakeHodai += charge;

			if (G_Code_PakeHodai == "") //税コードのチェック
				//税コード
				{
					ut_zei = H_utiwake[G_Code_PakeHodai].taxtype;

					if (!ut_zei || !H_Zei_CODE[ut_zei]) {
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u7A0E\u30B3\u30FC\u30C9\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (" + G_Code_PakeHodai + ").");
						return 1;
					}
				}

			sum_done = true;
		}

	if (preg_match("/\u672A\u6307\u5B9A\u8ABF\u6574\uFF08\u5916\u7A0E\uFF09/", record[6])) //コードを取得しておく、最初の１個を取る。
		{
			MisiteiAdjust += charge;

			if (MisiteiAdjust == "") //税コードのチェック
				//税コード
				{
					ut_zei = H_utiwake[G_Code_MisiteiAdjust].taxtype;

					if (!ut_zei || !H_Zei_CODE[ut_zei]) {
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u7A0E\u30B3\u30FC\u30C9\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (" + G_Code_MisiteiAdjust + ").");
						return 1;
					}
				}

			sum_done = true;
		}

	if (record[8] == "Y") //消費税インジケータ=='Y'
		{
			SumTax += charge;
			sum_done = true;
		}

	if (sum_done == false) //税コードのチェック
		//税コード
		{
			var A_meisai = {
				code: code,
				charge: charge
			};
			A_dummyFileData.push(A_meisai);
			ut_zei = H_utiwake[code].taxtype;

			if (!ut_zei || !H_Zei_CODE[ut_zei]) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u7A0E\u30B3\u30FC\u30C9\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (" + code + ").");
				return 1;
			}
		}

	ReadMeisaiCnt++;
	return 0;
};

function doTotalRecord(line, TotalUp) //分割してみる.
//-- DEBUG -- * 表示してみる
//print "==== doTotalRecord ================================\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//9-前受金取り込み額, 10-延滞利息額
{
	if (!("Meisai_POS" in global)) Meisai_POS = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid" in global)) pactid = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("A_dummyFileData" in global)) A_dummyFileData = undefined;
	var record = splitFix(line, Meisai_POS);
	var total = +record[7];
	total = total + +(record[9] + +record[10]);

	if (total != TotalUp) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4F1A\u793E\u5408\u8A08\u91D1\u984D\u304C\u7570\u306A\u308A\u307E\u3059.(" + total + "!=" + TotalUp + ").");
		return 1;
	}

	var sonota = -+(record[9] + +record[10]);

	if (!!sonota) {
		var A_meisai = {
			code: "sonotakei",
			charge: sonota
		};
		A_dummyFileData.push(A_meisai);
	}

	return 0;
};

function registTel(telno, telno_view) //電話番号マスター
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
		{
			if (!inTelData(A_telXData, telno)) //tel_XX_tb に追加する電話を出力
				//追加する電話数のカウント
				{
					A_telXData.push([rootPostidX, telno, telno_view]);
					AddTelXCnt++;
				} else {
				print("INFO: \u96FB\u8A71" + telno + "\u306F\u3059\u3067\u306BtelX_tb\u306B\u767B\u9332\u3057\u307E\u3057\u305F\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059.\n");
			}
		}

	if (telFlag == false && telXFlag == false && teltable == "n") //print "INFO: 電話はtel_tbに無かったので追加します.\n";
		{
			if (!inTelData(A_telData, telno)) //tel_tb に追加する電話を出力
				//追加する電話数のカウント
				{
					A_telData.push([rootPostid, telno, telno_view]);
					AddTelCnt++;
				} else {
				print("INFO: \u96FB\u8A71" + telno + "\u306F\u3059\u3067\u306Btel_tb\u306B\u767B\u9332\u3057\u307E\u3057\u305F\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059.\n");
			}
		}
};

function inTelData(A_array, telno) //存在しなかった
{
	for (var A_line of Object.values(A_array)) //$A_line は array( $postid, $telno, $telno_view )
	{
		if (A_line[1] == telno) //電話番号が存在した
			{
				return true;
			}
	}

	return false;
};

function registDummyTel(telno, postid) //請求月電話番号マスター
//telX_tb になかったら追加
{
	if (!("A_telnoX" in global)) A_telnoX = undefined;
	if (!("A_telXData" in global)) A_telXData = undefined;

	if (-1 !== A_telnoX.indexOf(telno) == false) {
		A_telXData.push([postid, telno, telno]);
	}
};

function registDummyTel2Root(pactid, db) //請求月電話番号マスター
//請求月root部署
//ダミー電話番号.
{
	if (!("A_telnoX" in global)) A_telnoX = undefined;
	if (!("A_telXData" in global)) A_telXData = undefined;
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("rootPostidX" in global)) rootPostidX = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var telno = getDummyTel(pactid);

	if (-1 !== A_telnoX.indexOf(telno) == false) //telX_tb になかったら追加
		{
			A_telXData.push([rootPostidX, telno, telno]);
		}

	db.begin();
	var sql = "select count(telno) from dummy_tel_tb where pactid=" + pactid + " and carid=" + VODA_CARRIER_ID + " and telno='" + telno + "'";
	var count = db.getOne(sql);

	if (count == 0) //無ければ登録を行う
		{
			sql = "insert into dummy_tel_tb (pactid, telno, carid) values (" + pactid + ",'" + telno + "'," + VODA_CARRIER_ID + ")";
			db.escape(sql);
			db.query(sql);
			db.commit();
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30C0\u30DF\u30FC\u96FB\u8A71" + telno + "\u3092 dummy_tel_tb\u306B\u767B\u9332\u3057\u307E\u3057\u305F.");
		} else {
		db.rollback();
	}

	return telno;
};

function getDummyTel(pactid) {
	var preLeng = PRE_DUMMY_TEL.length;
	var pactLeng = pactid.length;
	var zeroCnt = DUMMY_TEL_LENG - preLeng - pactLeng;
	var getStr = PRE_DUMMY_TEL;

	for (var zeroCounter = 0; zeroCounter < zeroCnt; zeroCounter++) {
		getStr = getStr + "0";
	}

	getStr = getStr + pactid;
	return getStr;
};

function selectDummyTel(pactid, seikyuNo) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select telno,postid from dummy_tel_tb where pactid = " + pactid + " and carid = " + VODA_CARRIER_ID + " and reqno = '" + seikyuNo + "'";
	return dbh.getHash(sql_str);
};

function checkPostID(pactid, postid, post_tb) {
	if (!("dbh" in global)) dbh = undefined;
	var sql = "select count(postid) from " + post_tb + " where pactid=" + pactid + " and postid=" + postid;
	return dbh.getOne(sql);
};

function getRootPostid(pactid, table) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select postidparent from " + table + " where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
	rootPostid = dbh.getOne(sql_str, true);
	return rootPostid;
};

function doCalc(pactid, A_fileData, A_div) //消費税合計金額
//法人複数回線割引
//法人複数回線割引のコード
//大口通話料割引
//大口通話料割引のコード
//パケットし放題割引
//パケットし放題割引のコード
//ダミー電話番号
//未指定調整（外税）	20071011 UPDATE
//未指定調整（外税））	20071011 UPDATE
//電話番号のない請求 20090615
//消費税の差額用積算
//法人複数回線割引の差額積算
//大口通話料割引の差額積算
//パケットし放題割引の差額積算
//未指定調整（外税）の差額積算	20071011 UPDATE
//ASP利用料金
//データが空のときは終了.
//基本使用料合計金額
//請求合計金額
//パケットし放題合計
//権限チェック「ASP利用料表示設定」がＯＮになっているか
//電話番号（１回前の）
//各データを書き出す
//最後の電話についての按分など
//法人複数回線割引を出力
//グローバル変数から取得
//法人複数回線割引を出力
{
	if (!("A_calcData" in global)) A_calcData = undefined;
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("SumTax" in global)) SumTax = undefined;
	if (!("MultuHoujin" in global)) MultuHoujin = undefined;
	if (!("G_Code_MultuHoujin" in global)) G_Code_MultuHoujin = undefined;
	if (!("LargeTuwa" in global)) LargeTuwa = undefined;
	if (!("G_Code_LargeTuwa" in global)) G_Code_LargeTuwa = undefined;
	if (!("PakeHodai" in global)) PakeHodai = undefined;
	if (!("G_Code_PakeHodai" in global)) G_Code_PakeHodai = undefined;
	if (!("DummyTel" in global)) DummyTel = undefined;
	if (!("MisiteiAdjust" in global)) MisiteiAdjust = undefined;
	if (!("G_Code_MisiteiAdjust" in global)) G_Code_MisiteiAdjust = undefined;
	if (!("A_dummyFileData" in global)) A_dummyFileData = undefined;
	var diffTax = 0;
	var diffHoujin = 0;
	var diffLarge = 0;
	var diffPacket = 0;
	var diffAdjust = 0;
	var aspCharge = 0;
	var aspFlg = false;

	if (A_fileData.length == 0) {
		return 0;
	}

	var sum_basic = 0;
	var sum_up = 0;
	var sum_packet = 0;

	for (var div_array of Object.values(A_div)) //$sum_tax   += $div_array[0];
	{
		sum_basic += div_array[1];
		sum_up += div_array[2];
		sum_packet += div_array[3];
	}

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

	if (A_fileData.sort("cmpfileData") == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u660E\u7D30\u30C7\u30FC\u30BF\u306E\u96FB\u8A71\u756A\u53F7\u30BD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
		return 1;
	}

	var detailNo = 0;
	var telno = "";

	for (var data of Object.values(A_fileData)) //data : telno, code, charge
	//電話番号が変わったら
	//END 電話番号が変わったら
	//電話番号を得る
	//通常の請求について
	//$detailNo を付け足す
	{
		if (data[0] != telno && telno != "") //法人複数回線割引を出力
			{
				var div_array = A_div[telno];

				if (div_array[1] != 0 && MultuHoujin != 0) //比例配分
					//税コード
					//端数を積算する
					{
						var multi_houjin = +(MultuHoujin * div_array[1] / sum_basic);
						var ut_zei = H_utiwake[G_Code_MultuHoujin].taxtype;
						detailNo++;
						var A_meisai = [telno, G_Code_MultuHoujin, multi_houjin, detailNo];
						A_calcData.push(A_meisai);
						diffHoujin += multi_houjin;

						if (ut_zei == "OT") //外税であれば
							//消費税に反映する
							{
								div_array[0] += multi_houjin;
							}
					}

				if (div_array[2] != 0 && LargeTuwa != 0) //比例配分
					//税コード
					//端数を積算する
					{
						var large_tuwa = +(LargeTuwa * div_array[2] / sum_up);
						ut_zei = H_utiwake[G_Code_LargeTuwa].taxtype;
						detailNo++;
						A_meisai = [telno, G_Code_LargeTuwa, large_tuwa, detailNo];
						A_calcData.push(A_meisai);
						diffLarge += large_tuwa;

						if (ut_zei == "OT") //外税であれば
							//消費税に反映する
							{
								div_array[0] += large_tuwa;
							}
					}

				if (div_array[3] != 0 && PakeHodai != 0 && sum_packet != 0) //比例配分
					//税コード
					//端数を積算する
					{
						var pake_hodai = +(PakeHodai * div_array[3] / sum_packet);
						ut_zei = H_utiwake[G_Code_PakeHodai].taxtype;
						detailNo++;
						A_meisai = [telno, G_Code_PakeHodai, pake_hodai, detailNo];
						A_calcData.push(A_meisai);
						diffPacket += pake_hodai;

						if (ut_zei == "OT") //外税であれば
							//消費税に反映する
							{
								div_array[0] += pake_hodai;
							}
					}

				if (div_array[1] != 0 && MisiteiAdjust != 0) //比例配分
					//税コード
					//print "DEBUG1::telno=" . $telno . "| div_array[1]=" . $div_array[1] ."| " . $MisiteiAdjust/$sum_basic  . "\n";
					//端数を積算する
					{
						var misitei_adjust = +(MisiteiAdjust * div_array[1] / sum_basic);
						ut_zei = H_utiwake[G_Code_MisiteiAdjust].taxtype;
						detailNo++;
						A_meisai = [telno, G_Code_MisiteiAdjust, misitei_adjust, detailNo];
						A_calcData.push(A_meisai);
						diffAdjust += misitei_adjust;

						if (ut_zei == "OT") //外税であれば
							//消費税に反映する
							{
								div_array[0] += misitei_adjust;
							}
					}

				if (div_array[0] != 0) //整数切り捨て
					//端数を積算する
					{
						var tax = Math.floor(div_array[0] * G_EXCISE_RATE);
						detailNo++;
						A_meisai = [telno, G_CODE_TAX, tax, detailNo];
						A_calcData.push(A_meisai);
						diffTax += tax;
					}

				detailNo++;

				if (aspFlg == true) //合計用に１つ進める
					//ASP利用料を出力
					//ASP利用料消費税を出力
					{
						detailNo++;
						A_meisai = [telno, G_CODE_ASP, aspCharge, detailNo];
						A_calcData.push(A_meisai);
						detailNo++;
						A_meisai = [telno, G_CODE_ASX, +(aspCharge * G_EXCISE_RATE), detailNo];
						A_calcData.push(A_meisai);
					}

				detailNo = 0;
			} else //電話はそのまま
			{
				detailNo++;
			}

		telno = data[0];
		data.push(detailNo);
		A_calcData.push(data);
	}

	div_array = A_div[telno];

	if (div_array[1] != 0 && MultuHoujin != 0) //比例配分
		//税コード
		//端数を積算する
		{
			multi_houjin = +(MultuHoujin * div_array[1] / sum_basic);
			ut_zei = H_utiwake[G_Code_MultuHoujin].taxtype;
			detailNo++;
			A_meisai = [telno, G_Code_MultuHoujin, multi_houjin, detailNo];
			A_calcData.push(A_meisai);
			diffHoujin += multi_houjin;

			if (ut_zei == "OT") //外税であれば
				//消費税に反映する
				{
					div_array[0] += multi_houjin;
				}
		}

	if (div_array[2] != 0 && LargeTuwa != 0) //比例配分
		//税コード
		//端数を積算する
		{
			large_tuwa = +(LargeTuwa * div_array[2] / sum_up);
			ut_zei = H_utiwake[G_Code_LargeTuwa].taxtype;
			detailNo++;
			A_meisai = [telno, G_Code_LargeTuwa, large_tuwa, detailNo];
			A_calcData.push(A_meisai);
			diffLarge += large_tuwa;

			if (ut_zei == "OT") //外税であれば
				//消費税に反映する
				{
					div_array[0] += large_tuwa;
				}
		}

	if (div_array[3] != 0 && PakeHodai != 0 && sum_packet != 0) //比例配分
		//税コード
		//端数を積算する
		{
			pake_hodai = +(PakeHodai * div_array[3] / sum_packet);
			ut_zei = H_utiwake[G_Code_PakeHodai].taxtype;
			detailNo++;
			A_meisai = [telno, G_Code_PakeHodai, pake_hodai, detailNo];
			A_calcData.push(A_meisai);
			diffPacket += pake_hodai;

			if (ut_zei == "OT") //外税であれば
				//消費税に反映する
				{
					div_array[0] += pake_hodai;
				}
		}

	if (div_array[1] != 0 && MisiteiAdjust != 0) //比例配分
		//税コード
		//print "DEBUG2::telno=" . $telno . "| div_array[1]=" . $div_array[1] ."| " . $MisiteiAdjust/$sum_basic  . "\n";
		//端数を積算する
		{
			misitei_adjust = +(MisiteiAdjust * div_array[1] / sum_basic);
			ut_zei = H_utiwake[G_Code_MisiteiAdjust].taxtype;
			detailNo++;
			A_meisai = [telno, G_Code_MisiteiAdjust, misitei_adjust, detailNo];
			A_calcData.push(A_meisai);
			diffAdjust += misitei_adjust;

			if (ut_zei == "OT") //外税であれば
				//消費税に反映する
				{
					div_array[0] += misitei_adjust;
				}
		}

	if (div_array[0] != 0) //整数切り捨て
		//明細データを配列に保持する.
		//端数を積算する
		{
			tax = Math.floor(div_array[0] * G_EXCISE_RATE);
			detailNo++;
			A_meisai = [telno, G_CODE_TAX, tax, detailNo];
			A_calcData.push(A_meisai);
			diffTax += tax;
		}

	detailNo++;

	if (aspFlg == true) //合計用に１つ進める
		//ASP利用料を出力
		//ASP利用料消費税を出力
		{
			detailNo++;
			A_meisai = [telno, G_CODE_ASP, aspCharge, detailNo];
			A_calcData.push(A_meisai);
			detailNo++;
			A_meisai = [telno, G_CODE_ASX, +(aspCharge * G_EXCISE_RATE), detailNo];
			A_calcData.push(A_meisai);
		}

	telno = DummyTel;
	detailNo = 0;
	multi_houjin = MultuHoujin - diffHoujin;

	if (multi_houjin != 0) {
		detailNo++;
		A_meisai = [telno, G_Code_MultuHoujin, multi_houjin, detailNo];
		A_calcData.push(A_meisai);
	}

	large_tuwa = LargeTuwa - diffLarge;

	if (large_tuwa != 0) {
		detailNo++;
		A_meisai = [telno, G_Code_LargeTuwa, large_tuwa, detailNo];
		A_calcData.push(A_meisai);
	}

	pake_hodai = PakeHodai - diffPacket;

	if (pake_hodai != 0) {
		detailNo++;
		A_meisai = [telno, G_Code_PakeHodai, pake_hodai, detailNo];
		A_calcData.push(A_meisai);
	}

	misitei_adjust = MisiteiAdjust - diffAdjust;

	if (multi_houjin != 0) {
		detailNo++;
		A_meisai = [telno, G_Code_MisiteiAdjust, misitei_adjust, detailNo];
		A_calcData.push(A_meisai);
	}

	if (A_dummyFileData.length > 0) {
		for (var data of Object.values(A_dummyFileData)) {
			detailNo++;
			A_meisai = [telno, data.code, data.charge, detailNo];
			A_calcData.push(A_meisai);
		}
	}

	tax = SumTax - diffTax;

	if (tax != 0) {
		detailNo++;
		A_meisai = [telno, G_CODE_TAX, tax, detailNo];
		A_calcData.push(A_meisai);
	}

	return 0;
};

function writeTelData(pactid) //global $Voda_area_id;	// 2005/05/10 廃止
//global $DummyTel;	// ダミー電話番号.			20071011 UPDATE
//ダミー電話番号リスト	20071011 UPDATE
//現在の日付を得る
//tel_XX_tb に追加する電話を出力
//tel_tb に追加する電話を出力
{
	if (!("A_telData" in global)) A_telData = undefined;
	if (!("A_telXData" in global)) A_telXData = undefined;
	if (!("fp_tel" in global)) fp_tel = undefined;
	if (!("fp_telX" in global)) fp_telX = undefined;
	if (!("A_DummyTel" in global)) A_DummyTel = undefined;
	var nowtime = getTimestamp();

	for (var A_data of Object.values(A_telXData)) //ダミー電話のusernameを「Softbank調整金」とする
	//if( $telno == $DummyTel ){				// 	20071011 UPDATE
	{
		rootPostid = A_data[0];
		var telno = A_data[1];
		var telno_view = A_data[2];

		if (-1 !== A_DummyTel.indexOf(telno)) //20071011 UPDATE
			//2007/02/09 修正
			{
				var username = "Softbank\u8ABF\u6574\u91D1";
			} else //空にする
			{
				username = "";
			}

		fwrite(fp_telX, pactid + "\t" + rootPostid + "\t" + telno + "\t" + telno_view + "\t" + VODA_CARRIER_ID + "\t" + VODA_AREA_ID + "\t" + VODA_CIRCUIT_ID + "\t" + username + "\t" + nowtime + "\t" + nowtime + "\n");
	}

	for (var A_data of Object.values(A_telData)) {
		rootPostid = A_data[0];
		telno = A_data[1];
		telno_view = A_data[2];
		fwrite(fp_tel, pactid + "\t" + rootPostid + "\t" + telno + "\t" + telno_view + "\t" + VODA_CARRIER_ID + "\t" + VODA_AREA_ID + "\t" + VODA_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");
	}
};

function cmpfileData(a, b) //data : telno, code, charge
//先頭の telno で比較する
{
	var telA = a[0];
	var telB = b[0];

	if (a == b) {
		return 0;
	}

	return a < b ? -1 : 1;
};

function writeInsFile(pactid, A_calcData) //データが空のときは終了.
//現在の日付を得る
//各データを書き出す
{
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	if (!("fp_teldetails" in global)) fp_teldetails = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (A_calcData.length == 0) {
		return 0;
	}

	var nowtime = getTimestamp();

	for (var data of Object.values(A_calcData)) //data : telno, code, charge, detailNo
	//内訳コード.
	//内訳コード名
	//末尾の空白を除く
	//表示順序
	//消費税、ASP利用料、ASP利用料消費税 には税コードが付かない
	//carid キャリアID
	{
		var telno = data[0];
		var ut_code = data[1];
		var ut_name = H_utiwake[data[1]].name;
		ut_name = rtrim(ut_name, "\u3000 ");
		var detailNo = data[3];

		if (ut_code == G_CODE_TAX || ut_code == G_CODE_ASP || ut_code == G_CODE_ASX) //空にする
			{
				var ut_zei_str = "";
			} else //税コード
			{
				var ut_zei = H_utiwake[data[1]].taxtype;

				if (!ut_zei || !H_Zei_CODE[ut_zei]) {
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u7A0E\u30B3\u30FC\u30C9\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093 (" + ut_zei + ").");
					return 1;
				}

				ut_zei_str = H_Zei_CODE[ut_zei];
			}

		fwrite(fp_teldetails, pactid + "\t" + telno + "\t" + ut_code + "\t" + ut_name + "\t" + data[2] + "\t" + ut_zei_str + "\t" + detailNo + "\t" + nowtime + "\t" + VODA_CARRIER_ID + "\n");
	}

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
	mb_convert_variables("UTF-8", "SJIS-win", A_ret);
	return A_ret;
};

function doBackup(db) //tel_details_X_tb をエクスポートする
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + date("YmdHis") + ".exp";
	var sql = "select * from " + teldetailX_tb;
	var rtn = db.backup(outfile, sql);

	if (rtn == false) //ロールバック
		//ロック解除
		//lock(false, $db);
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
			db.rollback();
			throw die(1);
		}

	return 0;
};

function doDelete(A_pactDone, db) //delte失敗した場合
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	var sql_str = "delete from " + teldetailX_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid=" + VODA_CARRIER_ID;
	var rtn = db.query(sql_str, false);

	if (DB.isError(rtn) == true) //ロールバック
		//ロック解除
		//lock(false, $db);
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			db.rollback();
			throw die(1);
		}

	return 0;
};

function doImport(file_tel, file_telX, file_teldetails, db) //tel_tbへのインポート
{
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (filesize(file_tel) > 0) {
		var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];

		if (doCopyInsert("tel_tb", file_tel, tel_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "tel_tb\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			} else //メール出力を減らすためコメントアウト 20091109miya
			//$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
			//. "tel_tb のインポート完了." );
			{}
	}

	if (filesize(file_telX) > 0) {
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "username", "recdate", "fixdate"];

		if (doCopyInsert(telX_tb, file_telX, telX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			} else //メール出力を減らすためコメントアウト 20091109miya
			//$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
			//. $telX_tb . "のインポート完了");
			{}
	}

	if (filesize(file_teldetails) > 0) {
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid"];

		if (doCopyInsert(teldetailX_tb, file_teldetails, teldetailX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			} else //メール出力を減らすためコメントアウト 20091109miya
			//$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
			//. $teldetailX_tb . " のインポート完了");
			{}
	} else //ファイルサイズが０？
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\uFF10\u3067\u3059.");
			return 1;
		}

	return 0;
};

function doCopyInsert(table, filename, columns, db) //ファイルを開く
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

	var ins = new TableInserter(logh, db, filename + ".sql", true);
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
			H_ins[col] = A_line[idx];
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

		if (is_file(fpath)) //ファイル名の先頭文字が適合するものだけ
			{
				if (preg_match(VODA_PAT, fname)) //ファイル移動
					{
						if (rename(fpath, finDir + "/" + fname) == false) {
							logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "\u306E\u7570\u52D5\u5931\u6557.");
							retval = 1;
						}
					}
			}

		clearstatcache();
	}

	closedir(dirh);
	return retval;
};

function usage(comment, db) //ロック解除
{
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
	lock(false, db);
	throw die(1);
};

function lock(is_lock, db) //ロックする
{
	if (db == undefined) {
		return false;
	}

	var pre = "batch";

	if (is_lock == true) //２重起動防止チェックの不具合修正 2009/3/19 s.maeda
		//既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command like '" + db.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
			var count = db.getOne(sql);

			if (count != 0) {
				db.rollback();
				return false;
			}

			var nowtime = getTimestamp();
			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + db.escape(pre + "_" + SCRIPTNAME) + "', 1, '" + nowtime + "');";
			db.query(sql);
			db.commit();
		} else {
		db.begin();
		db.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + db.escape(pre + "_" + SCRIPTNAME) + "';";
		db.query(sql);
		db.commit();
	}

	return true;
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
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + VODA_CARRIER_ID;
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