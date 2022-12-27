//===========================================================================
//機能：通話情報ファイルインポートプロセス（FUSION専用）
//
//作成：中西	2006/08/15	初版作成
//===========================================================================
//このスクリプトの日本語処理名
//define("DATA_LOG_DIR", ".");	// DEBUG
//CD,FD,MOで始まるファイル名.
//FusionのキャリアID
//Fusionの回線ID
//公私分計の権限
//以下はcommonで定義済み
//define("G_AUTH_ASP", 2);	//ASP使用料を表示するか
//define("G_CODE_ASP", "ASP");	//ASP利用料金
//define("G_CODE_ASX", "ASX");	//同税額
//define("G_CODE_TAX", "TAX");//税額（ＤＤＩで使用）
//define("G_EXCISE_RATE", 0.05);//消費税率
//---------------------------------------------------------------------------
//TEL_TYPEコード表
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
//通話明細データファイルがあるディレクトリを指定
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
//使用説明 会社合計レコードの処理
//[引　数] $record 入力レコード
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//電話に対する公私フラグを返す
//[引　数] pactid, 電話番号
//[返り値] 公私フラグ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//バックアップをとる
//[引　数] $db
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//旧データをＤＢから削除する
//[引　数] $db
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//データをＤＢにインポートする
//[引　数] $db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//データをＤＢにインポートする、kousi_totel_master
//[引　数] $db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルにエクスポートを行う
//[引　数] SQL文、COPY用のファイル名
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
//現在の日付を返す
//DBに書き込む現在日時に使用する
error_reporting(E_ALL);
const SCRIPT_NAMEJ = "FUSION\u901A\u8A71\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8";
const SCRIPTNAME = "import_fusion_tuwa.php";

require("lib/script_db.php");

require("lib/script_log.php");

const FUSION_DIR = "/fusion/tuwa";
const FUSION_PAT = "/^[CFM][DO]_.*\\.txt$/";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const FUSION_CARRIER_ID = 11;
const FUSION_CIRCUIT_ID = 25;
const KOUSI_FNCID = 47;
var H_TEL_TYPE = {
	"\u56FD\u5185": "Fu0",
	"\u56FD\u5185\uFF2D\uFF23": "Fu1",
	"\u56FD\u969B": "Fu2",
	"\u56FD\u969B\uFF2D\uFF23": "Fu3"
};
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.PutListener(log_listener_type);
log_listener.PutListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "\u51E6\u7406\u958B\u59CB.");

if (_SERVER.argv.length != 5) //数が正しくない
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

	usage("", dbh);
}

var dataDir = DATA_DIR + "/" + billdate + FUSION_DIR;

if (is_dir(dataDir) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093.");
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
var commhistory_tb = "commhistory_" + tableNo + "_tb";
var telX_tb = "tel_" + tableNo + "_tb";
var commhistoryFile = dataDir + "/" + commhistory_tb + billdate + pactid_in + ".ins";
var fp_comm = fopen(commhistoryFile, "w");

if (fp_comm == undefined) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryFile + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
	throw die(1);
}

var totelmasterFile = dataDir + "/" + "kousi_totel_master_tb" + billdate + pactid_in + ".ins";
var fp_totel = fopen(totelmasterFile, "w");

if (fp_totel == undefined) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + totelmasterFile + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
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

for (cnt = 0;; cnt < pactCnt; cnt++) //通話明細データディレクトリにある契約ＩＤがマスターに登録されているか？
//処理する請求データファイル名配列
//通話明細データファイル名を取得する
//通話明細データファイルがなかった場合
//公私分計処理：権限チェック
//公私分計処理：かけ先マスターを保持
//commhistory_X_tb インポートデータファイル出力用配列
//kousi_totel_master_tb インポートデータファイル出力用配列
//END ファイルごとの処理
//正常処理が終わった pactid のみ書き出し処理
{
	if (undefined !== H_pactid[A_pactid[cnt]] == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093.");
		continue;
	}

	var pactid = A_pactid[cnt];
	var pactname = H_pactid[pactid];
	var A_tuwaFile = Array();
	var dataDirPact = dataDir + "/" + pactid;
	dirh = opendir(dataDirPact);

	while (fileName = readdir(dirh)) {
		if (is_file(dataDirPact + "/" + fileName) == true) //ファイル名が適合するものだけ
			{
				if (preg_match(FUSION_PAT, fileName)) {
					A_tuwaFile.push(fileName);
				} else {
					logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + "\u306F\u51E6\u7406\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F.");
				}
			}

		clearstatcache();
	}

	if (A_tuwaFile.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "\u306E\u901A\u8A71\u660E\u7D30\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093.");
			closedir(dirh);
			continue;
		}

	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5BFE\u8C61\u3068\u306A\u308B\u30D5\u30A1\u30A4\u30EB\uFF1A" + A_tuwaFile.join(","));
	closedir(dirh);
	sql = "select count(*) from fnc_relation_tb where pactid=" + pactid + " and fncid=" + KOUSI_FNCID;
	cnt = dbh.getOne(sql, true);

	if (cnt > 0) {
		var EnableKousi = true;
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u516C\u79C1\u5206\u8A08\u51E6\u7406\u958B\u59CB.");
	} else {
		EnableKousi = false;
	}

	if (EnableKousi == true) //kousiflg = 2:未登録 の電話はマスターから削除することになるので拾わない
		//初期化
		//print_r( $H_totel_master );
		//公私フラグの初期化
		{
			sql = "select telno, totelno, kousiflg from kousi_totel_master_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID + "and kousiflg != '2' order by telno, totelno";
			H_result = dbh.getHash(sql, true);
			var totelCnt = H_result.length;
			var H_totel_master = Array();

			for (cnt = 0;; cnt < totelCnt; cnt++) //電話番号 => 相手先電話番号 => 公私フラグ
			//ハイフンを除く
			{
				var telno = H_result[cnt].telno;

				if (undefined !== H_totel_master[telno] == false) {
					H_totel_master[telno] = Array();
				}

				var totelno = H_result[cnt].totelno;
				totelno = totelno.trim().replace(/-/g, "");
				H_totel_master[telno][totelno] = H_result[cnt].kousiflg;
			}

			var H_TelKousi = Array();
		}

	var A_commFileData = Array();
	var A_totelFileData = Array();
	var errFlag = false;

	for (var fileName of Object.values(A_tuwaFile)) //読込処理開始
	//読込明細件数
	//ファイル毎のデータをクリアーする
	{
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u958B\u59CB.");
		var ReadMeisaiCnt = 0;

		if (doEachFile(dataDirPact + "/" + fileName, pactid, billdate, dbh) == 1) //エラーがあったらそこで中断.
			{
				errFlag = true;
				break;
			}

		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + ":\u660E\u7D30\u4EF6\u6570=" + ReadMeisaiCnt);
		var A_fileData = Array();
	}

	if (errFlag == false) //ファイルに書き出す -- comm
		//ファイルに書き出す -- totel
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30FC\u30BF\u66F8\u51FA\u51E6\u7406\u958B\u59CB.");

			for (var value of Object.values(A_commFileData)) {
				if (fwrite(fp_comm, value) == false) //エラーがあったらそこで中断.
					{
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + commhistoryFile + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
						errFlag = true;
						break;
					}
			}

			if (errFlag == true) //次のPactの処理にスキップする.
				{
					continue;
				}

			fflush(fp_comm);

			for (var value of Object.values(A_totelFileData)) {
				if (fwrite(fp_totel, value) == false) //エラーがあったらそこで中断.
					{
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + totelmasterFile + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
						errFlag = true;
						break;
					}
			}

			if (errFlag == true) //次のPactの処理にスキップする.
				{
					continue;
				}

			fflush(fp_totel);
			A_pactDone.push(pactid);
		}
}

fclose(fp_comm);
fclose(fp_totel);

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
doImportComm(commhistoryFile, dbh);
doImportTotel(totelmasterFile, dbh);
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

function doEachFile(fileName, pactid, billdate, db) //ファイルオープン
//アンダースコア'_'区切りの２番目
//１行ずつ読み込む.
//ファイルの全合計
//サービスごとの小計
{
	if (!("A_commFileData" in global)) A_commFileData = undefined;
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

	var fname_array = split("_", basename(fileName, ".txt"));
	var reqNumber = fname_array[1];
	var TotalUp = 0;
	var small_sum = 0;

	while (line = fgets(fp)) //改行取り
	//カンマ区切りで分割.
	//-- DEBUG -- * 表示してみる
	//print "**** Record **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//レコード数のチェック
	//番号.サービス名
	//05. 06. 07. は明細レコード
	//if( $hi_code == "05" || $hi_code == "06" || $hi_code == "07" ){
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

		if (record.length != 15) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u30EC\u30B3\u30FC\u30C9\u6570\u304C\u7570\u5E38(" + record.length + "!= 15).");
			flock(fp, LOCK_UN);
			fclose(fp);
			return 1;
		}

		[hi_code, service_name] = split("\\.", record[4], 2);

		if (hi_code < 10) //１桁のものは明細レコードと見なす
			//サービス小計に追加
			//全合計に追加
			{
				var sum = 0;

				if (doMeisaiRecord(record, reqNumber, pactid, A_commFileData, sum) == 1) {
					flock(fp, LOCK_UN);
					fclose(fp);
					return 1;
				}

				small_sum += sum;
				TotalUp += sum;
			} else if (hi_code == 91) //小計クリア
			{
				if (doTotalRecord(record, hi_code, small_sum) == 1) {
					flock(fp, LOCK_UN);
					fclose(fp);
					return 1;
				}

				small_sum = 0;
			} else if (hi_code == 99) {
			if (doTotalRecord(record, hi_code, TotalUp) == 1) {
				flock(fp, LOCK_UN);
				fclose(fp);
				return 1;
			}
		} else //当面は無視
			{}
	}

	flock(fp, LOCK_UN);
	fclose(fp);
	return 0;
};

function doMeisaiRecord(record, reqNumber, pactid, A_commFileData, sum) //コード表
//読込明細件数
//-- DEBUG -- * 表示してみる
//print "**** doMeisaiRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//請求番号チェック
//ハイフンは原則ないのだが念のため
//'-'ハイフンを除く
//MA名を入れる
//通話時間(分)を HHMM に直す
//通話時間(秒)を SS に直す
//$charge = (int)$record[13];	// 少数が来ることもある * 2009/04/20修正
//数字に変換
//データを配列に保持する.
//公私フラグ
//明細件数カウント.
{
	if (!("H_TEL_TYPE" in global)) H_TEL_TYPE = undefined;
	if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (record[0].trim() != reqNumber) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u756A\u53F7\u304C\u9055\u3044\u307E\u3059.(" + record[0] + "!=" + reqNumner + ").");
		return 1;
	}

	if (record[2].trim() != billdate) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u5E74\u6708\u65E5\u304C\u9055\u3044\u307E\u3059.(" + record[2] + "!=" + billdate + ").");
		return 1;
	}

	var telno_view = record[5].trim();
	var telno = telno_view.replace(/-/g, "");
	var date = record[6].substr(0, 4) + "-" + record[6].substr(4, 2) + "-" + record[6].substr(6, 2) + " " + record[7].substr(0, 2) + ":" + record[7].substr(2, 2) + ":" + record[7].substr(4, 2);
	var totelno = record[9].trim();
	var toplace = record[8].trim();
	var tuwa_min = record[11];
	var tuwa_hour = +(tuwa_min / 60);
	tuwa_min -= tuwa_hour * 60;

	if (tuwa_hour < 10) {
		tuwa_hour = "0" + tuwa_hour;
	}

	if (tuwa_min < 10) {
		tuwa_min = "0" + tuwa_min;
	}

	var tuwa_sec = record[12];

	if (tuwa_sec < 10) {
		tuwa_sec = "0" + tuwa_sec;
	}

	var time = tuwa_hour + tuwa_min + tuwa_sec;
	var charge = record[13] + 0;

	if (undefined !== H_TEL_TYPE[record[14]]) //区分をtypeに入れる
		{
			var type = record[14];
		} else {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u672A\u77E5\u306E\u96FB\u8A71\u533A\u5206\u3067\u3059.(" + record[14] + ").");
		return 1;
	}

	var kousiflg = getTelKousi(pactid, telno, totelno);
	A_commFileData.push(pactid + "\t" + telno + "\t" + type + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + time + "\t" + charge + "\t" + FUSION_CARRIER_ID + "\t" + kousiflg + "\n");
	sum += charge;
	ReadMeisaiCnt++;
	return 0;
};

function doTotalRecord(record, hi_code, TotalUp) //-- DEBUG -- * 表示してみる
//print "==== doTotalRecord ================================\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//数字に変換、少数がくることもある
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactid" in global)) pactid = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var total = record[13] + 0;
	TotalUp += 0;

	if (Math.abs(total - TotalUp) > 0.1) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4F1A\u793E\u5408\u8A08\u91D1\u984D\u304C\u7570\u306A\u308A\u307E\u3059.(" + total + "!=" + TotalUp + ").");
		return 1;
	}

	return 0;
};

function getTelKousi(pactid, telno, totelno) //権限が無ければ何もしない
//かけ先マスターに登録されているか？
//'-'ハイフンを除く
{
	if (!("H_totel_master" in global)) H_totel_master = undefined;
	if (!("H_TelKousi" in global)) H_TelKousi = undefined;
	if (!("EnableKousi" in global)) EnableKousi = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("dbh" in global)) dbh = undefined;
	if (!("logh" in global)) logh = undefined;

	if (EnableKousi == false) //print "DEBUG_00: No permission for kousi\n";
		{
			return undefined;
		}

	if (undefined !== H_TelKousi[telno]) //公私分計しないのであれば、そこで終了
		//print "DEBUG_07: H_TelKousi, comhistbaseflg=". $comhistbaseflg ."\n";
		{
			if (H_TelKousi[telno] == -1) {
				return undefined;
			}

			var comhistbaseflg = H_TelKousi[telno];
		} else //tel_tb から kousiflg を得る
		//print "DEBUG_01: tel_kousiflg=". $tel_kousiflg .", and  pattern_id=". $pattern_id ."\n";
		//null だったら会社のデフォルト値を適用
		//公私分計ありと決定。ここで comhistbaseflg の公私パターン(A) を記録する
		{
			var sql = "select kousiptn, COALESCE(kousiflg,'(null)') as nkflag from tel_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID + " and telno='" + telno + "'";
			var H_result = dbh.getHash(sql, true);

			for (var idx = 0; idx < H_result.length; idx++) //nullの場合は'(null)'と入る
			{
				var pattern_id = H_result[idx].kousiptn;
				var tel_kousiflg = H_result[idx].nkflag;
			}

			if (undefined !== tel_kousiflg == false || tel_kousiflg == "(null)") //print "DEBUG_02: default_kousiflg=". $default_kousiflg .", and  pattern_id=". $pattern_id ."\n";
				//kousiflg 公私分計フラグ(0:する、1:しない)
				//0: するなら、patternid を保持して処理を続ける
				{
					sql = "select kousiflg, patternid from kousi_default_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID;
					H_result = dbh.getHash(sql, true);

					if (H_result.length == 0) //公私フラグをハッシュに登録、nullの代わりに-1とする
						{
							logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "kousi_default_tb \u304C\u672A\u8A2D\u5B9A\u3067\u3059. telno=" + telno);
							H_TelKousi[telno] = -1;
							return undefined;
						}

					for (idx = 0;; idx < H_result.length; idx++) {
						var default_kousiflg = H_result[idx].kousiflg;
						pattern_id = H_result[idx].patternid;
					}

					if (default_kousiflg == 0) //引き続き次の処理に持ち込みたいので、tel_kousiflgを書き換える
						{
							tel_kousiflg = 0;
						} else //if( $default_kousiflg == 1 )
						//nullの代わりに-1とする
						{
							H_TelKousi[telno] = -1;
							return undefined;
						}
				}

			if (tel_kousiflg == 0) //kousi_pattern_tb からフラグを取得
				//print "DEBUG_03: comhistflg=". $comhistflg .", and comhistbaseflg=". $comhistbaseflg ."\n";
				//通話記録を使用しないのであれば、処理終了。
				{
					sql = "select comhistflg, comhistbaseflg from kousi_pattern_tb where patternid=" + pattern_id + " and carid=" + FUSION_CARRIER_ID;
					H_result = dbh.getHash(sql, true);

					for (idx = 0;; idx < H_result.length; idx++) //comhistflg = 通話記録判定(0:使用しない、1:使用する)
					//未登録の通話明細を公私のどちらとみなすか(0:公、1:私、2:未登録), 公私パターンを記憶する。(A)
					{
						var comhistflg = H_result[idx].comhistflg;
						comhistbaseflg = H_result[idx].comhistbaseflg;
					}

					if (comhistflg == 0) //公私フラグをハッシュに登録、nullの代わりに-1とする
						{
							H_TelKousi[telno] = -1;
							return undefined;
						}
				} else //if( $tel_kousiflg == 1 )
				//公私フラグをハッシュに登録、nullの代わりに-1とする
				{
					H_TelKousi[telno] = -1;
					return undefined;
				}

			H_TelKousi[telno] = comhistbaseflg;
		}

	totelno = totelno.trim().replace(/-/g, "");

	if (totelno != "" && undefined !== H_totel_master[telno][totelno]) //あれば、マスターの値を用いる
		//print "DEBUG_04: found in H_totel_master, kousiflg=". $kousiflg ."\n";
		{
			var kousiflg = H_totel_master[telno][totelno];
		} else //print "DEBUG_06: comhistbaseflg base, kousiflg=". $kousiflg ."\n";
		{
			if (totelno != "") //「未登録」で kousi_totel_master に電話を登録する。
				//公私分計フラグ(0:公、1:私、2:未登録)
				//同一の登録を行わないように、かけ先マスターに追加登録する
				//2:未登録
				//print "DEBUG_05: kousi_totel_master: totelno=". $totelno ."\n";
				{
					A_totelFileData.push(pactid + "\t" + telno + "\t" + FUSION_CARRIER_ID + "\t" + totelno + "\t" + "2" + "\n");

					if (undefined !== H_totel_master[telno] == false) {
						H_totel_master[telno] = Array();
					}

					H_totel_master[telno][totelno] = 2;
				}

			kousiflg = comhistbaseflg;
		}

	return kousiflg;
};

function doBackup(db) //commhistory_X_tb をエクスポートする
//kousi_totel_master_tb をエクスポートする
{
	if (!("commhistory_tb" in global)) commhistory_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var day = date("YmdHis");
	db.begin();
	var sql = "select * from " + commhistory_tb;
	var filename = DATA_EXP_DIR + "/" + commhistory_tb + day + ".exp";

	if (doCopyExp(sql, filename, db) != 0) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
			db.rollback();
			throw die(1);
		}

	db.commit();
	db.begin();
	sql = "select * from kousi_totel_master_tb";
	filename = DATA_EXP_DIR + "/" + "kousi_totel_master_tb" + day + ".exp";

	if (doCopyExp(sql, filename, db) != 0) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "kousi_totel_master_tb\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
			db.rollback();
			throw die(1);
		}

	db.commit();
	return 0;
};

function doDelete(A_pactDone, db) //commhistory_X_tb から削除する
//delete失敗した場合
//未登録電話のみ削除する
//delete失敗した場合
{
	if (!("commhistory_tb" in global)) commhistory_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	var sql_str = "delete from " + commhistory_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid = " + FUSION_CARRIER_ID;
	var rtn = db.query(sql_str, false);

	if ("object" === typeof rtn == true) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			db.rollback();
			throw die(1);
		}

	sql_str = "delete from kousi_totel_master_tb where pactid in (" + A_pactDone.join(",") + ") and carid = " + FUSION_CARRIER_ID + " and kousiflg = '2'";
	rtn = db.query(sql_str, false);

	if ("object" === typeof rtn == true) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "kousi_totel_master_tb \u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			db.rollback();
			throw die(1);
		}

	return 0;
};

function doImportComm(commhistoryFile, db) //commhistory_XX_tbへのインポート
{
	if (!("commhistory_tb" in global)) commhistory_tb = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("logh" in global)) logh = undefined;

	if (filesize(commhistoryFile) > 0) {
		var commhistory_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "time", "charge", "carid", "kousiflg"];

		if (doCopyInsert(commhistory_tb, commhistoryFile, commhistory_col, db) != 0) //ロールバック
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + " \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistory_tb + " \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86.");
		}
	}

	return 0;
};

function doImportTotel(totelmasterFile, db) //kousi_totel_master_tbへのインポート
{
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("logh" in global)) logh = undefined;

	if (filesize(totelmasterFile) > 0) {
		var totel_col = ["pactid", "telno", "carid", "totelno", "kousiflg"];

		if (doCopyInsert("kousi_totel_master_tb", totelmasterFile, totel_col, db) != 0) //ロールバック
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "kousi_totel_master_tb \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "kousi_totel_master_tb \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86.");
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
				logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002(" + A_line.length + "!=" + columns.length + "), \u30C7\u30FC\u30BF=" + line);
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

function doCopyExp(sql, filename, db) //一度にFETCHする行数
//ファイルを開く
{
	if (!("logh" in global)) logh = undefined;
	var NUM_FETCH = 100000;
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
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Fetch error, " + sql);
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
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557\u3001" + str);
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