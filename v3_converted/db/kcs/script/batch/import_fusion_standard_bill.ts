//===========================================================================
//機能：請求情報ファイルインポートプロセス（FUSION専用）
//
//作成：中西	2006/08/08	初版作成
//===========================================================================
//このスクリプトの日本語処理名
//20110414
//define("DATA_LOG_DIR", ".");	// DEBUG
//ダミー電話番号の接頭子
//ダミー電話番号の長さ
//FusionのキャリアID
//Fusionの回線ID
//非課税の場合は '非課税' という文字が入る
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//DEBUG * 標準出力に出してみる.
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
//契約ＩＤの指定が全て（all）の時
//area_tb より地域レコードを取得する.
//テーブルＮＯ取得
//20110414
//テーブル名設定
//出力ファイル作成
//20110414
//pact_tb より登録されている契約ＩＤ、会社名を取得
//会社名マスターを作成
//処理する契約ＩＤ
//全てのPactについてLOOP.
//END Pactごとの処理.
//出力ファイルクローズ
//ここまでに成功したファイルが無ければ終了する.
//バックアップをとる
//処理済みのデータを移動
//２重起動ロック解除
//終了メッセージ
//END Main
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 各ファイルについての処理
//[引　数] $fileName 対象ファイル名
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $record 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話合計レコードの処理
//[引　数] $record 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 会社合計レコードの処理
//[引　数] $record 入力レコード
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
//[引　数] $A_fileData 読み取ったデータ、$A_calcData 計算後のデータ（出力）
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 消費税の端数をダミー電話に追加する
//[引　数] detailNo
//[返り値] なし
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
const SCRIPT_NAMEJ = "FUSION\u8ACB\u6C42\u60C5\u5831\u6A19\u6E96\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8";
const SCRIPTNAME = "import_fusion_standard_bill.php";

require("lib/script_db.php");

require("lib/script_log.php");

require("model/script/TelAmountModel.php");

const FUSION_DIR = "/fusion_standard/bill";
const FUSION_PAT = "/^[A-Z]\\d{11}\\.csv$/";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const PRE_DUMMY_TEL = "FUS";
const DUMMY_TEL_LENG = 11;
const FUSION_CARRIER_ID = 11;
const FUSION_CIRCUIT_ID = 25;
const IS_HIKAZEI = "\u975E\u8AB2\u7A0E";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
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

var dataDir = DATA_DIR + "/" + billdate + FUSION_DIR;

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

var sql = "select ut.code, ut.name, ut.taxtype, kr.kamokuid from utiwake_tb ut ";
sql += "inner join kamoku_rel_utiwake_tb kr on ut.code=kr.code where ut.carid=" + FUSION_CARRIER_ID;
var H_result = dbh.getHash(sql, true);

for (cnt = 0;; cnt < H_result.length; cnt++) //内訳コード => 内訳内容
{
	var code = H_result[cnt].code;
	H_utiwake[code] = H_result[cnt];
}

sql = "select arid from area_tb where carid=" + FUSION_CARRIER_ID;
var FUSION_AREA_ID = dbh.getOne(sql, true);
var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var O_tab = new TelAmountModel(dataDir, logh, _SERVER.argv, SCRIPT_NAMEJ);
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

O_tab.makeFile(year, month, pactid_in);
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
//20110414
//請求データファイル名を取得する
//処理するファイル名一覧
//print_r( $A_billFile );	// DEBUG
//請求データファイルがなかった場合
//bill_prtel_tb より請求先番号を得る
//請求月電話番号マスター作成
//ルート部署を取得
//現在用
//請求月用
//ファイル毎のデータを保存する
//計算処理後の詳細データ
//すでに読み込んだ電話かどうかのチェック
//請求番号ごとの処理
//END 請求番号ごとの処理
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
	O_tab.setBasicData({
		pactid: pactid,
		carid: FUSION_CARRIER_ID
	});
	var target_files = Array();

	while (fileName = readdir(dirh)) {
		if (is_file(dataDirPact + "/" + fileName) == true) //ファイル名が適合するものだけ
			{
				if (preg_match(FUSION_PAT, fileName)) //ファイル名から請求番号を得る
					//請求番号 => 元のファイル名、というリストを作成する
					{
						var seikyuNo = basename(fileName, ".csv");

						if (undefined !== A_billFile[seikyuNo]) {
							var fname_array = A_billFile[seikyuNo];
							fname_array.push(fileName);
						} else {
							fname_array = [fileName];
						}

						A_billFile[seikyuNo] = fname_array;
						target_files.push(fileName);
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

	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5BFE\u8C61\u3068\u306A\u308B\u30D5\u30A1\u30A4\u30EB\uFF1A" + target_files.join(","));
	delete target_files;
	closedir(dirh);
	var A_codes = Array();
	sql = "select prtelno from bill_prtel_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID;
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
	sql = "select telno from tel_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID;

	for (var data of Object.values(dbh.getHash(sql, true))) {
		A_telno.push(data.telno);
	}

	var A_telnoX = Array();
	sql = "select telno from " + telX_tb + " where pactid=" + A_pactid[cnt] + " and carid=" + FUSION_CARRIER_ID;

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

	var A_fileData = Array();
	var A_calcData = Array();
	var A_telData = Array();
	var A_telXData = Array();
	var A_already = Array();
	var DummyTel = "";
	var DummyPost = "";
	var errFlag = false;

	for (var SeikyuNo in A_billFile) //print "請求番号=" . $SeikyuNo. "\n";
	//消費税合計
	//請求書にあった消費税
	//親番号チェックフラグの初期化
	//ファイルから得た請求番号の末尾４桁はYYMMとなっているので、これを除く
	//C95999990605 => C9599999 の部分だけを取得
	//末尾4文字をカット
	//ダミー電話とダミー部署を求める
	//print "DEBUG: ダミー電話=" . $DummyTel . " :: " . $DummyPost . "\n";
	//ファイルごとの処理
	//END ファイルごとの処理
	//請求番号ごとに溜めたデータをクリアーする
	//消費税合計をクリアー
	//請求書にあった消費税をクリアー
	//親番号が含まれていたかどうかの判定
	{
		var file_array = A_billFile[SeikyuNo];
		var SumTax = 0;
		var TotalTax = 0;
		var PrTelFlag = false;
		var SeikyuBase = SeikyuNo.substr(0, -4);
		var H_dummy = selectDummyTel(pactid, SeikyuBase);

		if (H_dummy == undefined) //ダミー電話がＤＢに記録されていなかった
			//ファイルが１個だけでダミー電話が見つからなかったら、ルート部署に登録する
			{
				if (A_billFile.length == 1) //結果をグローバル変数に反映
					{
						DummyTel = registDummyTel2Root(pactid, dbh);
						DummyPost = rootPostidX;
					} else //請求番号が２個以上あったらエラー
					//エラーがあったらそこで中断.
					{
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u756A\u53F7(" + SeikyuBase + ")\u306B\u5BFE\u3059\u308B\u30C0\u30DF\u30FC\u96FB\u8A71\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093.");
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

		for (var fileName of Object.values(file_array)) //print "ファイル名=" . $fileName . "\n";
		//読込処理開始
		//読込電話件数
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

		if (errFlag == true) //ファイル処理で失敗していたら
			//そのまま抜ける
			{
				break;
			}

		if (doCalc(pactid, A_fileData) != 0) //エラーがあったらそこで中断.
			{
				errFlag = true;
				break;
			}

		A_fileData = Array();
		SumTax = 0;
		TotalTax = 0;

		if (PrTelFlag == false) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u89AA\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3067\u3057\u305F.");
			errFlag = true;
		}
	}

	if (errFlag == false) //ファイルに書き出す
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30FC\u30BF\u66F8\u51FA\u51E6\u7406\u958B\u59CB.");
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

if (backup == "y") {
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u51E6\u7406\u958B\u59CB.");
	doBackup(dbh);
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u51E6\u7406\u5B8C\u4E86.");
}

if (mode == "o") {
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u958B\u59CB.");
	doDelete(A_pactDone, dbh);
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u5B8C\u4E86.");
}

logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB.");
doImport(file_tel, file_telX, file_teldetails, dbh);
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u5B8C\u4E86.");
dbh.commit();

for (var pactid of Object.values(A_pactDone)) {
	var pactDir = dataDir + "/" + pactid;
	var finDir = pactDir + "/" + FIN_DIR;
	finalData(pactid, pactDir, finDir);
}

lock(false, dbh);
logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5B8C\u4E86.");
throw die(0);

function doEachFile(fileName, pactid, billdate, A_fileData, db) //ファイルオープン
//ファイルの全合計
//電話ごとの合計
//電話ごとの課税対象額
//最初の二行は飛ばす
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

	var TotalUp = 0;
	var tel_sum = 0;
	var kazei_sum = 0;
	var line = fgets(fp);
	line = fgets(fp);

	while (line = fgets(fp)) //改行取り
	//カンマ区切りで分割.
	//-- DEBUG -- * 表示してみる
	//print "**** Record **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//レコード数のチェック
	//番号.サービス名
	//番号.料金内訳名
	//０詰めして長さを２桁に保つ -- Modify * 2007/01/31
	//code は 00-00 という形式になる
	//内訳コード = サービス名番号 - 料金内訳名番号
	//上位90番台は全合計レコード
	{
		if (feof(fp)) //おしまい.
			{
				break;
			}

		line = rtrim(line, "\r\n");

		if (line == "") //空行は除く
			{
				continue;
			}

		line = mb_convert_encoding(line, "UTF-8", "sjis-win");
		var record = split(",", line);

		if (record.length != 11) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u30EC\u30B3\u30FC\u30C9\u6570\u304C\u7570\u5E38(" + record.length + "!= 11).");
			flock(fp, LOCK_UN);
			fclose(fp);
			return 1;
		}

		[hi_code, service_name] = split("\\.", record[4], 2);
		[lo_code, utiwake_name] = split("\\.", record[6], 2);

		while (hi_code.length < 2) {
			hi_code = "0" + hi_code;
		}

		while (lo_code.length < 2) {
			lo_code = "0" + lo_code;
		}

		var code = hi_code + "-" + lo_code;

		if (hi_code != 92 && hi_code > 90 && 100 > hi_code && "91-11" != hi_code + "-" + lo_code) {
			if (doTotalRecord(record, hi_code, TotalUp, lo_code) == 1) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059(" + code + ").");
				flock(fp, LOCK_UN);
				fclose(fp);
				return 1;
			}
		} else if (lo_code == 97) //全合計に追加
			//電話ごとの合計をリセット
			//電話ごとの課税対象額をリセット
			{
				if (doSumRecord(record, pactid, A_fileData, tel_sum, kazei_sum) == 1) {
					flock(fp, LOCK_UN);
					fclose(fp);
					return 1;
				}

				TotalUp += tel_sum;
				tel_sum = 0;
				kazei_sum = 0;
			} else if (lo_code == 98 || lo_code == 99) //合計・課税:98、合計・非課税:99
			//とりあえず無視する
			{} else {
			if (doTelRecord(record, code, pactid, A_fileData, tel_sum, kazei_sum) == 1) {
				flock(fp, LOCK_UN);
				fclose(fp);
				return 1;
			}
		}
	}

	flock(fp, LOCK_UN);
	fclose(fp);
	return 0;
};

function doTelRecord(record, code, pactid, A_fileData, sum, kazei_sum) //請求先番号
//読込電話件数
//読込明細件数
//親番号チェックフラグ
//20110414
//前回の電話番号.
//-- DEBUG -- * 表示してみる
//print "**** doTelRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//請求番号チェック
//ハイフン付きの電話番号を保持
//'-'ハイフンを除く
//非課税の場合
//明細件数カウント.
{
	if (!("SeikyuNo" in global)) SeikyuNo = undefined;
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("A_codes" in global)) A_codes = undefined;
	if (!("ReadTelCnt" in global)) ReadTelCnt = undefined;
	if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("PrTelFlag" in global)) PrTelFlag = undefined;
	if (!("DummyTel" in global)) DummyTel = undefined;
	if (!("O_tab" in global)) O_tab = undefined;
	if (!("_static_doTelRecord_prev_tel" in global)) _static_doTelRecord_prev_tel = "";

	if (record[0].trim() != SeikyuNo) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u756A\u53F7\u304C\u9055\u3044\u307E\u3059.(" + record[0] + "!=" + SeikyuNo + ").");
		return 1;
	}

	if (record[2].trim() != billdate) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u5E74\u6708\u65E5\u304C\u9055\u3044\u307E\u3059.(" + record[2] + "!=" + billdate + ").");
		return 1;
	}

	var telno_view = record[5].trim();
	var telno = telno_view.replace(/-/g, "");

	if (telno != _static_doTelRecord_prev_tel && telno != "") //前回の電話番号と異なっていれば...
		//電話番号の登録
		//読み込んだレコード数をカウントする.
		{
			registTel(telno, telno_view);
			_static_doTelRecord_prev_tel = telno;
			ReadTelCnt++;
		}

	if (PrTelFlag == false && telno != "") //まだ親番号が含まれていない
		{
			for (var a_code of Object.values(A_codes)) {
				var a_code = a_code.trim().replace(/-/g, "");

				if (telno == a_code) //親番号チェックフラグＯＮ
					{
						PrTelFlag = true;
						O_tab.setPrtelNo(telno);
						break;
					}
			}
		}

	var charge = +record[7];

	if (undefined !== H_utiwake[code]) //print "DEBUG: ".  $H_utiwake[$code]["name"] . ", " . $charge . " 円\n";
		//合計値を得る
		{
			sum += charge;
		} else {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059(" + code + ").");
		return 1;
	}

	var hikazei = false;

	if (record[10] == IS_HIKAZEI) {
		hikazei = true;
	}

	if (telno == "") //特定番号通知等、グループ全体にかかる請求は電話番号なしでやってくる。
		{
			telno = DummyTel;
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u96FB\u8A71\u756A\u53F7\u306E\u7121\u3044\u660E\u7D30\u3092\u30C0\u30DF\u30FC\u96FB\u8A71\u306B\u4ED8\u52A0\u3001code=" + code + ", charge=" + charge);
		} else if (hikazei == false) //電話番号があって課税対象のもの
		//電話ごとの課税対象合計を求める -> 消費税の算出に使用
		//print "DEBUG: kazei_sum:" . $kazei_sum . " += charge:". $charge . "\n";
		{
			kazei_sum += charge;
		}

	var A_meisai = [telno, code, charge, hikazei];
	A_fileData.push(A_meisai);
	ReadMeisaiCnt++;
	return 0;
};

function doSumRecord(record, pactid, A_fileData, sum, kazei_sum) //-- DEBUG -- * 表示してみる
//print "**** doSumRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//電話番号
//ハイフン付きの電話番号を保持
//'-'ハイフンを除く
//電話番号のない.97は、グループ全体にかかるサービス合計なので無視する
//整数切り捨て
//消費税合計に加える
//print "DEBUG: 消費税：". $telno ." :: ". $kazei_sum ." * 0.05 = ". $tax ."\n";
//明細データを配列に保持する.
{
	if (!("SumTax" in global)) SumTax = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var telno_view = record[5].trim();
	var telno = telno_view.replace(/-/g, "");

	if (telno == "") {
		return 0;
	}

	var charge = +record[7];

	if (charge != sum) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u5408\u8A08\u91D1\u984D\u304C\u7570\u306A\u308A\u307E\u3059." + telno + " (" + charge + "!=" + sum + ").");
		return 1;
	}

	var tax = Math.floor(kazei_sum * G_EXCISE_RATE);
	SumTax += tax;
	var A_meisai = [telno, G_CODE_TAX, tax, false];
	A_fileData.push(A_meisai);
	return 0;
};

function doTotalRecord(record, hi_code, TotalUp, lo_code = undefined) //請求書に記載されている消費税合計
//global $logh;
//global $pactid;
//global $pactname;
//global $billdate;
//20110414
//-- DEBUG -- * 表示してみる
//print "==== doTotalRecord ================================\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//開発中、そのままでは動作しません.
//if( $total != $TotalUp ){
//$logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $billdate . LOG_DELIM
//. "会社合計金額が異なります.(". $total ."!=". $TotalUp .")." );
//return 1;
//}
{
	if (!("TotalTax" in global)) TotalTax = undefined;
	if (!("O_tab" in global)) O_tab = undefined;
	if (!("logh" in global)) logh = undefined;
	var total = +record[7];

	if (hi_code == 99) //消費税合計を記録する
		{
			TotalTax += total;
		} else if ("98" == hi_code) {
		var amountdata = O_tab.makeAmountData({
			charge: total,
			recdate: getTimeStamp()
		});
		O_tab.writeFile(amountdata);
	} else {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5BFE\u5FDC\u5916\u306E\u30B3\u30FC\u30C9\u3067\u3059\u3002\u53D6\u8FBC\u7D50\u679C\u306B\u4EE5\u4E0A\u304C\u3042\u308B\u5834\u5408\u3001\u3053\u306E\u30B3\u30FC\u30C9\u304C\u539F\u56E0\u306E\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059(" + hi_code + "-" + lo_code + ").");
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
	var sql = "select count(telno) from dummy_tel_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID + " and telno='" + telno + "'";
	var count = db.getOne(sql);

	if (count == 0) //無ければ登録を行う
		{
			sql = "insert into dummy_tel_tb (pactid, telno, carid) values (" + pactid + ",'" + telno + "'," + FUSION_CARRIER_ID + ")";
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
	var sql_str = "select telno,postid from dummy_tel_tb where pactid = " + pactid + " and carid = " + FUSION_CARRIER_ID + " and reqno = '" + seikyuNo + "'";
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

function doCalc(pactid, A_fileData) //読み込んだ電話を追加してゆく
//ASP利用料金
//データが空のときは終了.
//電話番号（１回前の）
//電話毎の消費税
//各データを書き出す
//最後の電話について消費税を表示する
//最後の電話についてASP使用料を表示する.
//ただし一度出現した電話にＡＳＰ利用料は付けない
{
	if (!("A_calcData" in global)) A_calcData = undefined;
	if (!("A_already" in global)) A_already = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("DummyTel" in global)) DummyTel = undefined;
	var aspCharge = 0;
	var aspFlg = false;

	if (A_fileData.length == 0) {
		return 0;
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
	var tax = 0;

	for (var data of Object.values(A_fileData)) //data : telno, code, charge, hikazei
	//print "DEBUG: ". $data[0] .", ". $data[1] .", ". $data[2] .", ". $data[3] ."\n";
	//電話番号が変わったら
	//END 電話番号が変わったら
	//電話番号を得る
	//消費税はそのまま出力せず、最後にまとめて出す
	//電話が複数ファイルに分かれていると消費税が複数行出てしまうため、ここで１つにまとめる。
	{
		if (data[0] != telno && telno != "") //一度出現した電話にＡＳＰ利用料は付けない
			{
				if (telno != DummyTel) //ダミー電話でなければ
					//消費税を表示する
					{
						detailNo++;
						var A_meisai = [telno, G_CODE_TAX, tax, false, detailNo];
						A_calcData.push(A_meisai);
					} else {
					adjustTax(detailNo);
				}

				if (-1 !== A_already.indexOf(telno) == false) //ASP利用料表示する
					{
						detailNo++;

						if (aspFlg == true && telno != DummyTel) //合計用に１つ進める
							//ASP利用料を出力
							//ASP利用料消費税を出力
							{
								detailNo++;
								A_meisai = [telno, G_CODE_ASP, aspCharge, false, detailNo];
								A_calcData.push(A_meisai);
								detailNo++;
								A_meisai = [telno, G_CODE_ASX, +(aspCharge * G_EXCISE_RATE), false, detailNo];
								A_calcData.push(A_meisai);
							}

						A_already.push(telno);
					}

				detailNo = 0;
				tax = 0;
			} else //電話はそのまま
			{
				detailNo++;
			}

		telno = data[0];

		if (data[1] == G_CODE_TAX) //print "DEBUG: *Tax=" . $tax . "\n";
			{
				tax += data[2];
			} else //通常の請求について
			//$detailNo を付け足す
			{
				data.push(detailNo);
				A_calcData.push(data);
			}
	}

	if (telno != DummyTel) {
		detailNo++;
		A_meisai = [telno, G_CODE_TAX, tax, false, detailNo];
		A_calcData.push(A_meisai);
	} else {
		adjustTax(detailNo);
	}

	if (-1 !== A_already.indexOf(telno) == false) {
		detailNo++;

		if (aspFlg == true && telno != DummyTel) //合計用に１つ進める
			//ASP利用料を出力
			//ASP利用料消費税を出力
			{
				detailNo++;
				A_meisai = [telno, G_CODE_ASP, aspCharge, false, detailNo];
				A_calcData.push(A_meisai);
				detailNo++;
				A_meisai = [telno, G_CODE_ASX, +(aspCharge * G_EXCISE_RATE), false, detailNo];
				A_calcData.push(A_meisai);
			}

		A_already.push(telno);
	}

	return 0;
};

function adjustTax(detailNo) //端数をダミー電話に出力
//グローバル変数から取得
//消費税の差額を得る
{
	if (!("A_calcData" in global)) A_calcData = undefined;
	if (!("DummyTel" in global)) DummyTel = undefined;
	if (!("SumTax" in global)) SumTax = undefined;
	if (!("TotalTax" in global)) TotalTax = undefined;
	var telno = DummyTel;
	var tax = TotalTax - SumTax;

	if (tax != 0) {
		detailNo++;
		var A_meisai = [telno, G_CODE_TAX, tax, false, detailNo];
		A_calcData.push(A_meisai);
	}
};

function writeTelData(pactid) //現在の日付を得る
//tel_XX_tb に追加する電話を出力
//tel_tb に追加する電話を出力
{
	if (!("A_telData" in global)) A_telData = undefined;
	if (!("A_telXData" in global)) A_telXData = undefined;
	if (!("fp_tel" in global)) fp_tel = undefined;
	if (!("fp_telX" in global)) fp_telX = undefined;
	if (!("FUSION_AREA_ID" in global)) FUSION_AREA_ID = undefined;
	var nowtime = getTimestamp();

	for (var A_data of Object.values(A_telXData)) {
		rootPostid = A_data[0];
		var telno = A_data[1];
		var telno_view = A_data[2];
		fwrite(fp_telX, pactid + "\t" + rootPostid + "\t" + telno + "\t" + telno_view + "\t" + FUSION_CARRIER_ID + "\t" + FUSION_AREA_ID + "\t" + FUSION_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");
	}

	for (var A_data of Object.values(A_telData)) {
		rootPostid = A_data[0];
		telno = A_data[1];
		telno_view = A_data[2];
		fwrite(fp_tel, pactid + "\t" + rootPostid + "\t" + telno + "\t" + telno_view + "\t" + FUSION_CARRIER_ID + "\t" + FUSION_AREA_ID + "\t" + FUSION_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");
	}
};

function cmpfileData(a, b) //data : telno, code, charge, hikazei
//先頭の telno で比較する
{
	var telA = a[0];
	var telB = b[0];

	if (a == b) {
		return 0;
	}

	return a < b ? -1 : 1;
};

function writeInsFile(pactid, A_calcData) //20110414
//データが空のときは終了.
//現在の日付を得る
//各データを書き出す
{
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	if (!("fp_teldetails" in global)) fp_teldetails = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("O_tab" in global)) O_tab = undefined;

	if (A_calcData.length == 0) {
		return 0;
	}

	var nowtime = getTimestamp();

	for (var data of Object.values(A_calcData)) //data : telno, code, charge, hikazei, detailNo
	//内訳コード.
	//内訳コード名
	//末尾の空白を除く
	//非課税フラグ
	//表示順序
	//20110413
	//carid キャリアID
	{
		var telno = data[0];
		var ut_code = data[1];
		var ut_name = H_utiwake[data[1]].name;
		ut_name = rtrim(ut_name, "\u3000 ");
		var hikazei = data[3];
		var detailNo = data[4];

		if (hikazei == true) {
			var ut_zei_str = "\u975E\u8AB2\u7A0E";
		} else {
			if (ut_code == G_CODE_TAX || ut_code == G_CODE_ASX) //消費税には何も付けない
				{
					ut_zei_str = "";
				} else //それ以外は全て「外税」とする
				{
					ut_zei_str = "\u5916\u7A0E";
				}
		}

		var prtelno = "\n";

		if (G_CODE_ASP != ut_code && G_CODE_ASX != ut_code) {
			prtelno = O_tab.getPrtelNo() + "\n";
		}

		fwrite(fp_teldetails, pactid + "\t" + telno + "\t" + ut_code + "\t" + ut_name + "\t" + data[2] + "\t" + ut_zei_str + "\t" + detailNo + "\t" + nowtime + "\t" + FUSION_CARRIER_ID + "\t" + prtelno);
	}

	return 0;
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
	var sql_str = "delete from " + teldetailX_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid=" + FUSION_CARRIER_ID;
	var rtn = db.query(sql_str, false);

	if ("object" === typeof rtn == true) //ロールバック
		//ロック解除
		//lock(false, $db);
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			db.rollback();
			throw die(1);
		}

	return 0;
};

function doImport(file_tel, file_telX, file_teldetails, db) //20110414
//tel_tbへのインポート
//20110414
{
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("O_tab" in global)) O_tab = undefined;

	if (filesize(file_tel) > 0) {
		var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];

		if (doCopyInsert("tel_tb", file_tel, tel_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "tel_tb\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "tel_tb \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86.");
		}
	}

	if (filesize(file_telX) > 0) {
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];

		if (doCopyInsert(telX_tb, file_telX, telX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

	if (filesize(file_teldetails) > 0) {
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "prtelno"];

		if (doCopyInsert(teldetailX_tb, file_teldetails, teldetailX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	} else //ファイルサイズが０？
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\uFF10\u3067\u3059.");
			return 1;
		}

	if (0 < filesize(O_tab.getFilePath())) {
		if (0 != doCopyInsert(O_tab.getTableName(), O_tab.getFilePath(), O_tab.getAmountColumn(), db)) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + O_tab.getTableName() + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			db.rollback();
			throw die(1);
		} else {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + O_tab.getFilePath() + "\u306E\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C0\u3067\u3059");
			return 1;
		}
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
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002(" + A_line.length + "!=" + columns.length + "), \u30C7\u30FC\u30BF=" + line);
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

		if (is_file(fpath)) //ファイル名が適合するものだけ
			{
				if (preg_match(FUSION_PAT, fname)) //ファイル移動
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

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command like '" + db.escape(pre + "%") + "' and " + "status = 1;";
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
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + FUSION_CARRIER_ID;
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