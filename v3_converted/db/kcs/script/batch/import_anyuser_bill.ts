//===========================================================================
//機能：請求情報ファイルインポートプロセス（エニーユーザー専用）
//
//作成：中西	2007/01/24	初版作成
//===========================================================================
//このスクリプトの日本語処理名
//define("DATA_LOG_DIR", ".");	// DEBUG
//any_[請求コード]_[請求年月].txt
//define("PRE_DUMMY_TEL", "ANY");	// ダミー電話番号の接頭子
//define("DUMMY_TEL_LENG", 11 );	// ダミー電話番号の長さ
//エニーユーザーのキャリアID
//エニーユーザーの回線ID
//以下はcommonで定義済み
//define("G_CODE_ASX", "ASX");	//同税額
//define("G_CODE_TAX", "TAX");	//税額（ＤＤＩで使用）
//define("G_EXCISE_RATE", 0.05);	//消費税率
//税区分コード表
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
//area_tb より地域レコードを取得する -- 電話登録が無いので未使用
//$sql = "select arid from area_tb where carid=". ANY_CARRIER_ID ;
//$ANY_AREA_ID =  $dbh->getOne($sql, true);
//テーブルＮＯ取得
//テーブル名設定
//$postX_tb      = "post_" . $tableNo . "_tb";
//$postrelX_tb   = "post_relation_" . $tableNo . "_tb";
//出力ファイル作成
//teldetailsのファイル名が重ならないように
//会社名マスターを作成
//処理する契約ＩＤ
//対象データファイルの数を数える
//全てのPactについてLOOP.
//END Pactごとの処理.
//出力ファイルクローズ
//fclose($fp_tel);	// telは不要
//fclose($fp_telX);	// telXは不要
//対象ファイルが0件だったら正常終了する
//バックアップをとる
//重複データを削除する
//インポートを実行する
//処理済みのデータを移動
//２重起動ロック解除
//終了メッセージ
//END Main
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 各ファイルについての処理
//[引　数] $fileName 対象ファイル名
//[返り値] 終了コード　1（失敗）、２（エラーだが継続処理を継続）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話明細内訳レコードの処理
//[引　数] $record 入力レコード
//[返り値] 終了コード　1（失敗）、２（エラーだが継続処理を継続）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話番号の登録があるかどうか調べる
//[引　数] $telno 電話番号
//[返り値] 終了コード　０（成功）、1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 電話番号ごとの集計計算を行う
//[引　数] $A_fileData 読み取ったデータ、$A_calcData 計算後のデータ（出力）
//[返り値] 終了コード　1（失敗）
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
//[備　考] FUSION経由のデータを削除しないよう、特定の科目だけを消去する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//不要な重複データをＤＢから削除する
//[引　数] 削除する電話データ（pact, telno, code）
//[返り値] なし
//[備　考] 使用料をまとめた分の、特定の電話、科目だけを消去する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//データをＤＢに登録する
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
//現在の日付を返す
//DBに書き込む現在日時に使用する
error_reporting(E_ALL);
const SCRIPT_NAMEJ = "\u30A8\u30CB\u30FC\u30E6\u30FC\u30B6\u30FC\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8";
const SCRIPTNAME = "import_anyuser_bill.php";

require("lib/script_db.php");

require("lib/script_log.php");

const ANYFU_DIR = "/anyfu/bill";
const ANY_PAT = "/^any_[^_]*_.*\\.(csv|txt)$/";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const ANY_CARRIER_ID = 13;
const ANY_CIRCUIT_ID = 29;
var H_Zei_CODE = {
	0: "\u975E\u8AB2\u7A0E",
	1: "\u8AB2\u7A0E",
	2: "\u5BFE\u8C61\u5916"
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

var dataDir = DATA_DIR + "/" + billdate + ANYFU_DIR;

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
sql += "inner join kamoku_rel_utiwake_tb kr on ut.code=kr.code where ut.carid=" + ANY_CARRIER_ID;
var H_result = dbh.getHash(sql, true);

for (cnt = 0;; cnt < H_result.length; cnt++) //内訳コード => 内訳内容
{
	var code = H_result[cnt].code;
	H_utiwake[code] = H_result[cnt];
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var telX_tb = "tel_" + tableNo + "_tb";
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
var file_teldetails = dataDir + "/" + teldetailX_tb + "_anyuser" + billdate + pactid_in + ".ins";
var fp_teldetails = fopen(file_teldetails, "w");

if (fp_teldetails == undefined) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
	throw die(1);
}

sql = "select pactid,compname from pact_tb order by pactid";
H_result = dbh.getHash(sql, true);
var pactCnt = H_result.length;

for (cnt = 0;; cnt < pactCnt; cnt++) //pactid => 会社名
{
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

pactCnt = A_pactid.length;
A_pactid.sort();
var targetFileCnt = 0;

for (cnt = 0;; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
//請求データファイル名を取得する
//処理するファイル名一覧
//請求データファイルがなかった場合
//対象データファイルの数を数える
//現在の電話番号マスター作成
//請求月電話番号マスター作成
//各請求番号・ファイルについての処理 -- ここが読み込みの中心処理
//ファイル毎のデータを保存する
//計算処理後の詳細データ
//削除対象となるデータ
//$A_telData  = array();	// telは不要
//$A_telXData = array();	// telXは不要
//ファイルごとの処理
//END ファイルごとの処理
//電話番号ごとの集計計算を行う。結果は A_calcData に反映
//ファイル毎のデータをクリアーする
//正常処理が終わった pactid のみ書き出し処理
{
	if (undefined !== H_pactid[A_pactid[cnt]] == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093.");
		continue;
	}

	var pactid = A_pactid[cnt];
	var pactname = H_pactid[pactid];
	var dataDirPact = dataDir + "/" + pactid;
	dirh = opendir(dataDirPact);
	var target_files = Array();

	while (fileName = readdir(dirh)) {
		if (is_file(dataDirPact + "/" + fileName) == true) //ファイル名が適合するものだけ
			{
				if (preg_match(ANY_PAT, fileName)) //ファイル名から処理年月日を得る -- any_[請求コード]_[請求年月].(csv|txt)
					//アンダースコア'_'区切りの３番目
					{
						var fname_array = split("_", basename(basename(fileName, ".csv"), ".txt"));
						var YYYYMM = fname_array[2];

						if (YYYYMM != billdate) //print "DEBUG: $YYYYMM != $billdate \n";
							{
								logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30D5\u30A1\u30A4\u30EB\u540D\u306E\u65E5\u4ED8\u3068\u6307\u5B9A\u3057\u305F\u5E74\u6708\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\u3001" + dataDirPact + "/" + fileName + "\u306F\u51E6\u7406\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F.");
								continue;
							}

						target_files.push(fileName);
					} else {
					logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + "\u306F\u51E6\u7406\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F.");
				}
			}

		clearstatcache();
	}

	if (target_files.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "\u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093.");
			closedir(dirh);
			continue;
		}

	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5BFE\u8C61\u3068\u306A\u308B\u30D5\u30A1\u30A4\u30EB\uFF1A" + target_files.join(","));
	closedir(dirh);
	targetFileCnt++;
	var A_telno = Array();
	sql = "select telno from tel_tb where pactid=" + pactid + " and carid=" + ANY_CARRIER_ID;

	for (var data of Object.values(dbh.getHash(sql, true))) {
		A_telno.push(data.telno);
	}

	var A_telnoX = Array();
	sql = "select telno from " + telX_tb + " where pactid=" + A_pactid[cnt] + " and carid=" + ANY_CARRIER_ID;

	for (var data of Object.values(dbh.getHash(sql, true))) {
		A_telnoX.push(data.telno);
	}

	var A_fileData = Array();
	var A_calcData = Array();
	var A_delData = Array();
	var errFlag = false;

	for (var fileName of Object.values(target_files)) //print "ファイル名=" . $fileName . "\n";
	//読込処理開始
	//読込電話件数
	//読込明細件数
	//$AddTelCnt = 0;		// 追加する電話数	// 電話追加は無し
	//$AddTelXCnt = 0;	// 追加する電話数	// 電話追加は無し
	//. ":追加電話件数(tel_tb)=" . $AddTelCnt . ":追加電話件数(". $telX_tb .")=" . $AddTelXCnt );
	{
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u958B\u59CB.");
		var ReadTelCnt = 0;
		var ReadMeisaiCnt = 0;
		var rtn = doEachFile(dataDirPact + "/" + fileName, pactid, billdate, A_fileData, dbh);

		if (rtn == 1) //エラーがあったらそこで中断.
			{
				errFlag = true;
				break;
			} else if (rtn == 2) //エラーだが処理を続行
			{
				errFlag = true;
			}

		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u5B8C\u4E86:\u96FB\u8A71\u4EF6\u6570=" + ReadTelCnt + ":\u660E\u7D30\u4EF6\u6570=" + ReadMeisaiCnt);
	}

	if (errFlag == true) //ファイル処理で失敗していたら
		//そのまま抜ける
		{
			continue;
		}

	delete target_files;

	if (doCalc(pactid, A_fileData, dbh) != 0) //エラーがあったらそこで中断.
		{
			errFlag = true;
			break;
		}

	A_fileData = Array();

	if (errFlag == false) //ファイルに書き出す
		//writeTelData( $pactid );	// telは不要
		//fflush($fp_tel);	// telは不要
		//fflush($fp_telX);	// telXは不要
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30FC\u30BF\u66F8\u51FA\u51E6\u7406\u958B\u59CB.");

			if (writeInsFile(pactid, A_calcData) == 1) //次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
					continue;
				}

			fflush(fp_teldetails);
			A_pactDone.push(pactid);
		}
}

fclose(fp_teldetails);

if (targetFileCnt == 0) //２重起動ロック解除
	//終了メッセージ
	{
		lock(false, dbh);
		logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5B8C\u4E86.");
		throw die(0);
	}

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

logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u958B\u59CB.");

if (mode == "o") //前回のデータを削除する
	{
		doDelete(A_pactDone, dbh);
	}

doDeleteDup(A_delData, dbh);
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u5B8C\u4E86.");
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB.");
doImport(file_teldetails, dbh);
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

function doEachFile(fileName, pactid, billdate, A_fileData, db) //エラーだが処理を継続するためのフラグ
//ファイルオープン
//ファイルの全合計
//電話ごとの合計
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

	var TotalUp = 0;
	var tel_sum = 0;

	while (line = fgets(fp)) //改行取り
	//カンマ区切りで分割.
	//-- DEBUG -- * 表示してみる
	//print "**** Record **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//レコード数のチェック
	{
		if (feof(fp) && line == "") //おしまい.
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

		if (record.length != 6) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "\u306E\u30EC\u30B3\u30FC\u30C9\u6570\u304C\u7570\u5E38(" + record.length + "!= 6). line=\"" + line + "\"");
			flock(fp, LOCK_UN);
			fclose(fp);
			return 1;
		}

		var rtn = doTelRecord(record, pactid, A_fileData, tel_sum);

		if (rtn == 1) {
			flock(fp, LOCK_UN);
			fclose(fp);
			return 1;
		} else if (rtn == 2) //エラーだが処理を継続する
			{
				error_flag = true;
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

function doTelRecord(record, pactid, A_fileData, sum) //請求先番号
//読込電話件数
//読込明細件数
//前回の電話番号.
//-- DEBUG -- * 表示してみる
//print "**** doTelRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//レコード内容はこうなっている
//電話番号, 請求コード, 請求項目名, 台数, 金額, 課税フラグ
//電話番号
//'-'ハイフンを除く
//record[2] // 請求項目名
//小数点で来ることもある
//明細データを配列に保持する.
//明細件数カウント.
{
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("A_codes" in global)) A_codes = undefined;
	if (!("ReadTelCnt" in global)) ReadTelCnt = undefined;
	if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
	if (!("_static_doTelRecord_prev_tel" in global)) _static_doTelRecord_prev_tel = "";
	var telno_view = record[0].trim();
	var telno = telno_view.replace(/-/g, "");

	if (telno != _static_doTelRecord_prev_tel && telno != "") //前回の電話番号と異なっていれば...
		//電話番号の存在チェック
		//読み込んだレコード数をカウントする.
		{
			if (checkTel(telno) != 0) //エラーだが処理継続
				{
					return 2;
				}

			_static_doTelRecord_prev_tel = telno;
			ReadTelCnt++;
		}

	var code = record[1].trim();
	var realcnt = record[3];

	if (is_null(realcnt) || realcnt == "") //消費税の場合、数量が設定されていない
		//nullを設定
		//$logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $billdate . LOG_DELIM
		//. "数量が設定されていません、telno=". $telno_view .", code=\"". $code ."\"\n" );
		//return 2;	// エラーだが処理を継続する
		{
			realcnt = "\\N";
		}

	var charge = record[4];

	if (undefined !== H_utiwake[code]) //print "DEBUG: ". $H_utiwake[$code]["name"] . ", " . $charge . " 円\n";
		//合計値を得る
		{
			sum += charge;
		} else //エラーだが処理を継続する
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059(" + code + ").");
			return 2;
		}

	var taxkubun = record[5];
	var A_meisai = [telno, code, realcnt, charge, taxkubun];
	A_fileData.push(A_meisai);
	ReadMeisaiCnt++;
	return 0;
};

function checkTel(telno) //電話番号マスター
//請求月電話番号マスター
//global $teltable;	// -t オプションの値
//global $AddTelCnt;		// 追加する電話数
//global $AddTelXCnt;		// 追加する電話数
//print "DEBUG: 電話番号: " . $telno . "\n";
//tel_tbの存在チェック
{
	if (!("A_telno" in global)) A_telno = undefined;
	if (!("A_telnoX" in global)) A_telnoX = undefined;
	if (!("A_telData" in global)) A_telData = undefined;
	if (!("A_telXData" in global)) A_telXData = undefined;
	if (!("telX_tb" in global)) telX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid" in global)) pactid = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;
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

	if (telXFlag == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u96FB\u8A71\u756A\u53F7(" + telno + ")\u306F" + telX_tb + "\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093.");
		return 1;
	}

	return 0;
};

function doCalc(pactid, A_fileData, db) //データが空のときは終了.
//電話番号（１回前の）
//各データを書き出す
{
	if (!("A_calcData" in global)) A_calcData = undefined;
	if (!("A_delData" in global)) A_delData = undefined;
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (A_fileData.length == 0) {
		return 0;
	}

	if (A_fileData.sort("cmpfileData") == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u660E\u7D30\u30C7\u30FC\u30BF\u306E\u96FB\u8A71\u756A\u53F7\u30BD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
		return 1;
	}

	var telno = "";
	A_codes = Array();

	for (var data of Object.values(A_fileData)) //data : telno, code, realcnt, charge, taxkubun
	//print "DEBUG: ". $data[0] .", ". $data[1] .", ". $data[2] .", ". $data[3] .", ". $data[4] ."\n";
	//電話番号が変わったら（初回を含む）
	//電話番号を得る
	//課税フラグ
	//そのまま登録する
	//順序はコード番号/100という規則
	//もし既存のレコードが在れば
	{
		if (data[0] != telno) //既存の明細データを得る
			//print $sql . "\n";	// DEBUG
			//print_r( $A_codes );	// DEBUG
			{
				A_codes = Array();
				var sql = "select code from " + teldetailX_tb + " where pactid=" + pactid + " and carid=" + ANY_CARRIER_ID + " and telno='" + data[0] + "'";

				for (var row of Object.values(db.getHash(sql, true))) {
					A_codes.push(row.code);
				}
			}

		telno = data[0];
		var code = data[1];
		var realcnt = data[2];
		var charge = data[3];
		var taxkubun = data[4];
		var detailNo = +(code / 100);
		var A_meisai = [telno, code, realcnt, charge, taxkubun, detailNo];
		A_calcData.push(A_meisai);

		if (-1 !== A_codes.indexOf(code)) //既存のレコードを削除する
			//print "DEBUG: ". $data[0] .", ". $pactid .", ". $telno .", ". $code ."\n";
			{
				A_delData.push([pactid, telno, code]);
			}
	}

	return 0;
};

function cmpfileData(a, b) //data : telno, code, realcnt, charge, taxkubun
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

	for (var data of Object.values(A_calcData)) //data : telno, code, realcnt, charge, taxkubun, detailNo
	//内訳コード.
	//内訳コード名
	//末尾の空白を除く
	//数量
	//金額
	//税区分
	//課税フラグ
	//表示順序
	//realcnt １回線あたりの端末台数
	{
		var telno = data[0];
		var ut_code = data[1];
		var ut_name = H_utiwake[ut_code].name;
		ut_name = rtrim(ut_name, "\u3000 ");
		var realcnt = data[2];
		var charge = data[3];
		var taxkubun = H_Zei_CODE[data[4]];
		var detailNo = data[5];
		fwrite(fp_teldetails, pactid + "\t" + telno + "\t" + ut_code + "\t" + ut_name + "\t" + charge + "\t" + taxkubun + "\t" + detailNo + "\t" + nowtime + "\t" + ANY_CARRIER_ID + "\t" + realcnt + "\n");
	}

	return 0;
};

function doBackup(db) //tel_details_X_tb をエクスポートする
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var outfile = DATA_EXP_DATA + "/" + teldetailX_tb + date("YmdHis") + ".exp";
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
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var sql_str = "delete from " + teldetailX_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid=" + ANY_CARRIER_ID + " and code not in (" + "'300', " + "'400', " + "'800' " + ")";
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

function doDeleteDup(A_delData, db) //// 使用料を消去
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;

	for (var A_data of Object.values(A_delData)) //print "DEBUG: " . $sql_str . "\n";
	//delte失敗した場合
	{
		var pact = A_data[0];
		var telno = A_data[1];
		var code = A_data[2];
		var sql_str = "delete from " + teldetailX_tb + " where pactid=" + pact + " and telno='" + telno + "'" + " and code='" + code + "'" + " and carid=" + ANY_CARRIER_ID;
		var rtn = db.query(sql_str, false);

		if ("object" === typeof rtn == true) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
				db.rollback();
				throw die(1);
			}
	}

	return 0;
};

function doImport(file_teldetails, db) //teldetailX_tbへのインポート
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (filesize(file_teldetails) > 0) {
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "realcnt"];

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
				if (preg_match(ANY_PAT, fname)) //ファイル移動
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
			var sql = "select count(*) from clamptask_tb " + "where command = '" + db.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
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