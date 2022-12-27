//===========================================================================
//機能：請求情報ファイルインポートプロセス（NTT-Com専用）
//
//作成：五十嵐
//===========================================================================
//このスクリプトの日本語処理名
//固定＋国際
//NTTコミュニケーションズのキャリアID
//PHPのパス -- パスが通っているものとする.
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
//パラメータ数を1つ削減(-tは使わない) 20070130iga -aが増えて6に 20071003iga
//$cnt 0 はスクリプト名のため無視
//END 引数の取得
//請求データファイルがあるディレクトリを指定
//処理する契約ＩＤ配列
//処理が終了した pactid を格納するための配列
//処理が失敗した pactid を格納するための配列
//契約ＩＤの指定が全て（all）の時
//テーブル名設定
//子スクリプトに渡す引数の作成、このスクリプトに渡されたものと全く同じ引数を渡す.
//固定回線の処理.
//実行結果を出力
//重複を除く.
//print "DEBUG: 成功したPact\n";
//print_r( $A_pactDone );
//print "DEBUG: 失敗したPact\n";
//print_r( $A_pactFailed );
//失敗したPactは成功から除く.
//print "DEBUG: 完了したPact\n";
//print_r( $A_pactDone );
//ここまでに成功したファイルが無ければ終了する.
//固定、国際のファイル名前接尾子
//成功したPactのtmpファイルを順次読み込む
//成功したPactのtmpファイルを順次読み込む
//成功したPactのtmpファイルを順次読み込む
//// tmpファイルの削除.
//foreach( $A_pactid as $pactid ){
//	foreach( $A_tmpExt as $ext ){
//		$file_teldetails = $dataDir ."/". $teldetailX_tb . $billdate . $pactid . $ext . ".tmp";
//		if( file_exists( $file_teldetails ) ){
//			unlink( $file_teldetails );
//		}
//		$file_tel = $dataDir ."/". "tel_tb" . $billdate . $pactid . $ext . ".tmp";
//		if( file_exists( $file_tel ) ){
//			unlink( $file_tel );
//		}
//		$file_telX = $dataDir ."/". $telX_tb . $billdate . $pactid . $ext . ".tmp";
//		if( file_exists( $file_telX ) ){
//			unlink( $file_telX );
//		}
//		$file_commhistory = $dataDir ."/". $commhistory_tb . $billdate . $pactid . $ext . ".tmp";
//		if(file_exists($file_commhistory)){
//			unlink($file_commhistory);
//		}
//	}
//}
//// バックアップをとる
//if($backup == "y"){
//	$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//		. "バックアップ処理開始." );
//	doBackup($dbh);
//	$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//		. "バックアップ処理完了." );
//}
//// PactごとのImport処理.
//foreach( $A_pactDone as $pactid ){
//	// コミットポイント開始
//// debag中はインポートしない 20070126iga
//	$dbh->begin();
//	// データをインポートする前にデリート
//	if($mode == "o"){
//		$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//			. "デリート処理開始." );
//		if( doDelete($pactid, $dbh) != 0 ){
//			continue;	// 失敗したら次のPactへ.
//		}
//		$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//			. "デリート処理完了." );
//	}
//	// インポートを実行する
//	$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//		. "インポート処理開始." );
//	
////	$file_tel  = $dataDir ."/". "tel_tb" . $billdate . $pactid . ".ins";
//	$file_telX = $dataDir ."/". $telX_tb . $billdate . $pactid . ".ins";
//	$file_teldetails = $dataDir ."/". $teldetailX_tb . $billdate . $pactid . ".ins";
//	$file_commhistory = $dataDir ."/". $commhistory_tb . $billdate . $pactid . ".ins";
//	if( doImport($file_telX, $file_teldetails, $file_commhistory, $dbh) != 0 ){
//		continue;	// 失敗したら次のPactへ.
//	}
//	$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//		. "インポート処理完了." );
//	
//	$dbh->commit();
//	
//	// 処理済みのデータを移動
//	$pactDir = $dataDir ."/". $pactid;
//	$finDir = $pactDir . "/" . FIN_DIR;
//	finalData( $pactid, $pactDir, $finDir );
//}
//２重起動ロック解除
//終了メッセージ
//END Main
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//バックアップをとる
//[引　数] $db
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//旧データをＤＢから削除する
//[引　数] $pact, $db
//[返り値] 終了コード　1（失敗）
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
//clamptask_tb にレコードを追加し２重起動を防止する
//[引　数] $is_lock： true：ロックする、false：ロック解除
//&$db： DBハンドル
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
error_reporting(E_ALL);
const SCRIPT_NAMEJ = "NTT-Com\u56FD\u969B\u96FB\u8A71\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8";
const SCRIPTNAME = "import_nttcom_wld_bill.php";

require("lib/script_db.php");

require("lib/script_log.php");

const NTTCOM_DIR = "/NTT_com/world";
const NTTCOM_PAT = "/^[KDYW]/i";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const NTTCOM_CARRIER_ID = 14;
const PHP = "php";
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

	if (ereg("^-a=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
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

if (lock(true, dbh) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\uFF12\u91CD\u8D77\u52D5\u3067\u3059\u3001\u524D\u56DE\u30A8\u30E9\u30FC\u7D42\u4E86\u306E\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059.");
	throw die(1);
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var telX_tb = "tel_" + tableNo + "_tb";
var postrelX_tb = "post_relation_" + tableNo + "_tb";
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
var commhistory_tb = "commhistory_" + tableNo + "_tb";
var co_arg = "";

for (var i = 1; i < _SERVER.argv.length; i++) {
	co_arg += " ";
	co_arg += _SERVER.argv[i];
}

var status = 0;
var cmd = escapeshellcmd(PHP + " " + IMPORT_NTTCOM_WLD + co_arg);
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\"" + cmd + "\"\u306E\u5B9F\u884C\u958B\u59CB.");
exec(cmd, output, status);

for (var line of Object.values(output)) {
	if (preg_match("/^COMPLETE_PACTS/", line)) //完了したPactのIDを拾うキーワード
		//１個目はキーワードなので除く
		//完了したPactに追加
		{
			var A_pacts = line.split(",");
			A_pacts.shift();
			A_pactDone += A_pacts;
		} else if (preg_match("/^FAILED_PACTS/", line)) //失敗したPactのIDを拾うキーワード
		//１個目はキーワードなので除く
		//失敗したPactに追加
		{
			A_pacts = line.split(",");
			A_pacts.shift();
			A_pactFailed += A_pacts;
		} else //そのまま出力
		{
			print(line + "\n");
		}
}

if (status != 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " \u306E\u5B9F\u884C\u306B\u5931\u6557.");
	throw die(1);
}

A_pactDone = array_unique(A_pactDone);
A_pactFailed = array_unique(A_pactFailed);
A_pactDone = array_diff(A_pactDone, A_pactFailed);

if (A_pactDone.length == 0) //この場合はロック解除する.
	{
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u8AAD\u307F\u8FBC\u307F\u306B\u6210\u529F\u3057\u305FPact\u304C\uFF11\u3064\u3082\u7121\u304B\u3063\u305F.");
		lock(false, dbh);
		throw die(1);
	}

var A_tmpExt = ["_wld"];

for (var pactid of Object.values(A_pactDone)) //出力ファイル作成
{
	var file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + ".ins";
	var fp_teldetails = fopen(file_teldetails, "w");

	if (fp_teldetails == undefined) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		throw die(1);
	}

	for (var ext of Object.values(A_tmpExt)) //tmpファイルを単純に連結する.
	{
		var tmp_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + ext + ".tmp";

		if (!file_exists(tmp_teldetails)) //ファイルが存在しなければ処理をスキップ.
			{
				continue;
			}

		var fp_tmp_teldetails = fopen(tmp_teldetails, "rb");

		if (fp_teldetails == undefined) {
			logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + tmp_teldetails + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
			throw die(1);
		}

		while (line = fgets(fp_tmp_teldetails)) {
			if (feof(fp_tmp_teldetails)) //おしまい.
				{
					break;
				}

			fputs(fp_teldetails, line);
		}

		fclose(fp_tmp_teldetails);
	}

	fclose(fp_teldetails);
}

for (var pactid of Object.values(A_pactDone)) //出力ファイル作成
//ファイル内容を保持するバッファ.
//ファイルの種類ごとの処理.
//一気に書き出す.
//重複を除く.
{
	var file_telX = dataDir + "/" + telX_tb + billdate + pactid + ".ins";
	var fp_telX = fopen(file_telX, "w");

	if (fp_telX == undefined) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		throw die(1);
	}

	var A_tmpBuf = Array();

	for (var ext of Object.values(A_tmpExt)) //telの電話番号が重なっているものは除く.
	//一気に配列に読み込む.
	{
		var tmp_telX = dataDir + "/" + telX_tb + billdate + pactid + ext + ".tmp";

		if (!file_exists(tmp_telX)) //ファイルが存在しなければ処理をスキップ.
			{
				continue;
			}

		A_tmpBuf = array_merge(A_tmpBuf, file(tmp_telX));
	}

	A_tmpBuf = array_unique(A_tmpBuf);

	for (var line of Object.values(A_tmpBuf)) {
		fputs(fp_telX, line);
	}

	fclose(fp_telX);
}

for (var pactid of Object.values(A_pactDone)) //出力ファイル作成
//ファイル内容を保持するバッファ.
//ファイルの種類ごとの処理.
//一気に書き出す.
//重複を除く.
{
	var file_commhistory = dataDir + "/" + commhistory_tb + billdate + pactid + ".ins";
	var fp_commhistory = fopen(file_commhistory, "w");

	if (fp_commhistory == undefined) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		throw die(1);
	}

	A_tmpBuf = Array();

	for (var ext of Object.values(A_tmpExt)) //telの電話番号が重なっているものは除く.
	//一気に配列に読み込む.
	{
		var tmp_commhistory = dataDir + "/" + commhistory_tb + billdate + pactid + ext + ".tmp";

		if (!file_exists(tmp_commhistory)) //ファイルが存在しなければ処理をスキップ.
			{
				continue;
			}

		A_tmpBuf = array_merge(A_tmpBuf, file(tmp_commhistory));
	}

	A_tmpBuf = array_unique(A_tmpBuf);

	for (var line of Object.values(A_tmpBuf)) {
		fputs(fp_commhistory, line);
	}

	fclose(fp_commhistory);
}

lock(false, dbh);
logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5B8C\u4E86.");
throw die(0);

function doBackup(db) //tel_details_X_tb をエクスポートする
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + date("YmdHis") + ".exp";
	var sql = "select * from " + teldetailX_tb;
	db.begin();

	if (doCopyExp(sql, outfile, db) != 0) //ロールバック
		//ロック解除
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
			dbh.rollback();
			lock(false, db);
			throw die(1);
		}

	db.commit();
	return 0;
};

function doDelete(pactid, db) //tel_Detail_X_tbから削除
//delte失敗した場合
//delte失敗した場合
//delte失敗した場合
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("commhistory_tb" in global)) commhistory_tb = undefined;
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	var sql_str = "delete from " + teldetailX_tb + " where pactid=" + pactid + " and carid=" + NTTCOM_CARRIER_ID;
	var rtn = db.query(sql_str, false);

	if ("object" === typeof rtn == true) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			db.rollback();
			return 1;
		}

	sql_str = "delete from " + commhistory_tb + " where pactid=" + pactid + " and carid=" + NTTCOM_CARRIER_ID;
	rtn = db.query(sql_str, false);

	if ("object" === typeof rtn == true) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			db.rollback();
			return 1;
		}

	sql_str = "delete from " + telX_tb + " where pactid=" + pactid + " and carid=" + NTTCOM_CARRIER_ID;
	rtn = db.query(sql_str, false);

	if ("object" === typeof rtn == true) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			db.rollback();
			return 1;
		}

	return 0;
};

function doImport(file_telX, file_teldetails, file_commhistory, db) //$tel_columns =
//"pactid, postid, telno, telno_view, userid, carid, arid, cirid, machine, color, planid, planalert, packetid, packetalert, pointstage, employeecode, username, mail, orderdate, text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, int1, int2, int3, date1, date2, memo, movepostid, moveteldate, delteldate, recdate, fixdate, options, contractdate, finishing_f, schedule_person_name, schedule_person_userid, schedule_person_postid";
//$teldetail_columns =
//"pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid,tdcomment";
//tel_tbは無視 20070128iga
//	// tel_tbへのインポート
//	if( filesize($file_tel) > 0 )
//	{
//		$tel_col = array(
//			"pactid",		// $pactid
//			"postid",		// $rootPostid
//			"telno",		// $telno
//			"telno_view",	// $telno_view
//			"carid",		// NTTCOM_CARRIER_ID
//			"arid",			// NTTCOM_AREA_ID
//			"cirid",		// NTTCOM_CIRCUIT_ID
//			"recdate",		// $nowtime
//			"fixdate"		// $nowtime
//		);
//		
//		if( doCopyInsert("tel_tb", $file_tel, $tel_col, $db) != 0){
//			$logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//				. "tel_tbのインポートに失敗しました." );
//			// ロールバック
//			$db->rollback();
//			// ロック解除
//		//	lock(false, $db);
//			exit(1);
//		}else{
//			$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//				. "tel_tb のインポート完了." );
//		}
//	}
//telX_tbへのインポート
//teldetailX_tbへのインポート
//commhistory_tbへのインポート
{
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("commhistory_tb" in global)) commhistory_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (filesize(file_telX) > 0) {
		var telX_col = ["pactid", "postid", "telno", "telno_view", "userid", "carid", "arid", "cirid", "machine", "color", "employeecode", "username", "mail", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "date1", "date2", "memo", "kousiflg", "kousiptn", "username_kana", "kousi_fix_flg", "recdate", "fixdate"];

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
	} else {
		print("debag");
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

		if (doCopyInsert(commhistory_tb, file_commhistory, commhisotry_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + " \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	} else //ファイルサイズが０？
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "\u306E\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\uFF10\u3067\u3059.");
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

function doCopyExp(sql, filename, db) //ログファイルハンドラ
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

	db.query("DECLARE exp_cur CURSOR FOR " + sql);

	for (; ; ) //ＤＢから１行ずつ結果取得
	{
		var result = pg_query(db.m_db.connection, "FETCH " + NUM_FETCH + " IN exp_cur");

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

	db.query("CLOSE exp_cur");
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
				if (preg_match(NTTCOM_PAT, fname)) //ファイル移動
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

function usage(comment, db) //print "Usage) " . $_SERVER["argv"][0] . " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n";
//print "		-t 当月データ	(N:データは今月のもの,O:データは先月のもの)\n\n";
//ロック解除
{
	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N}\n");
	print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n\n");
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

			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + db.escape(pre + "_" + SCRIPTNAME) + "',1,'now()');";
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