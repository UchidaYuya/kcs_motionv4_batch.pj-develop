//===========================================================================
//機能：エニーユーザ用決済結果取込バッチ
//対象：コンビニ・銀行・郵便振込決済結果ファイル
//口座振替決済結果ファイル
//
//作成：前田
//更新履歴
//===========================================================================
//define("DEBUG", 1);
//define("BASE_DIR", "/kcs/data");
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//決済結果ファイルがあるディレクトリ
//決済結果ファイルがあるディレクトリチェック
//決済結果ファイル名リスト
//決済結果ファイル名を取得する
//処理開始をログ出力
//初期処理
//口座振替結果マスター
//払込データ種別
//２重起動防止ロックをかける
//現在年月取得
//１ファイルずつ処理する
//ロック解除
//処理終了をログ出力
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//clamptasl_tb にレコードを追加し２重起動を防止する
//[引　数] $is_lock： true：ロックする、false：ロック解除
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//利用月から対象のテーブル番号を取得する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const BASE_DIR = DATA_DIR;
const AGREX_DIR = "/agrex/import";
const FIN_DIR = "/fin";
const COMMON_LOG_DIR = DATA_LOG_DIR;
const LOG_DELIM = " ";
const SCRIPTNAME = "import_agrex_file.php";
const PACTID = 76;
const KEIYAKUCODE = "250001";
const ITAKUCODE = "230477";
var dbLogFile = COMMON_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var dataDir = BASE_DIR + AGREX_DIR;

if (is_dir(dataDir) == false) {
	print("\n\u6C7A\u6E08\u7D50\u679C\u30D5\u30A1\u30A4\u30EB\u304C\u3042\u308B\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n");
	logh.putError(G_SCRIPT_ERROR, "\u6C7A\u6E08\u7D50\u679C\u30D5\u30A1\u30A4\u30EB\u304C\u3042\u308B\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
	throw die(1);
}

var dirh = opendir(dataDir);
var A_inFile = Array();

while (fileName = readdir(dirh)) {
	if (is_file(dataDir + "/" + fileName) == true) {
		A_inFile.push(fileName);
	}

	clearstatcache();
}

closedir(dirh);
print("\u30A2\u30B0\u30EC\u30C3\u30AF\u30B9\u6C7A\u6E08\u7D50\u679C\u53D6\u8FBC\u958B\u59CB\n");
logh.putError(G_SCRIPT_BEGIN, "\u30A2\u30B0\u30EC\u30C3\u30AF\u30B9\u6C7A\u6E08\u7D50\u679C\u53D6\u8FBC\u958B\u59CB");
var H_kouResult = {
	"0": "\u632F\u66FF\u6E08",
	"1": "\u8CC7\u91D1\u4E0D\u8DB3",
	"2": "\u9810\u91D1\u53D6\u5F15\u306A\u3057",
	"3": "\u9810\u91D1\u8005\u90FD\u5408\u306B\u3088\u308B\u632F\u66FF\u505C\u6B62",
	"4": "\u9810\u91D1\u53E3\u5EA7\u632F\u66FF\u4F9D\u983C\u306A\u3057",
	"8": "\u59D4\u8A17\u8005\u90FD\u5408\u306B\u3088\u308B\u632F\u66FF\u505C\u6B62",
	"9": "\u305D\u306E\u4ED6"
};
var H_harDatatype = {
	"01": "\u901F\u5831",
	"02": "\u78BA\u5831",
	"03": "\u53D6\u6D88"
};
lock(true);
var curYear = date("Y");
var curMonth = date("n");
var curDate = date("d");

for (var inFile of Object.values(A_inFile)) //ファイル読み込み
//１行ずつ処理する
//１カラム目が契約先コードでない場合は口座振替結果でも、払い込み結果でもないため無効なファイルとして扱う
//過去月テーブルで決済結果がnullでないものを配列へ格納
//決済結果を追記するかどうかの判定
//行数を取得
//トランザクション開始
//口座振替の場合
//処理が正常に終わったファイルを移動
//移動先ディレクトリがなければ作成
//ファイルを移動
{
	var A_tmpFile = file(dataDir + "/" + inFile);
	var lineCnt = 0;
	var A_File = Array();

	for (var lineData of Object.values(A_tmpFile)) //ここで文字コードを変換する
	//カラム毎に配列へ格納
	//先頭カラムの「"」を除去
	//最終カラムの「"」を除去
	{
		var lineData = mb_convert_encoding(lineData, "UTF-8", "EUC-JP");
		A_File[lineCnt] = lineData.split("\",\"");
		A_File[lineCnt][0] = ereg_replace("^\"", "", A_File[lineCnt][0]);
		A_File[lineCnt][0] = ereg_replace("^\"", "", A_File[lineCnt][0]);
		A_File[lineCnt][A_File[lineCnt].length - 1] = ereg_replace("\"\n", "", A_File[lineCnt][A_File[lineCnt].length - 1]);
		A_File[lineCnt][A_File[lineCnt].length - 1] = ereg_replace("\"\r\n", "", A_File[lineCnt][A_File[lineCnt].length - 1]);
		lineCnt++;
	}

	if (A_File[0][0] != KEIYAKUCODE.trim()) {
		print(inFile + "\u30D5\u30A1\u30A4\u30EB\u306F\u6C7A\u6E08\u7D50\u679C\u30D5\u30A1\u30A4\u30EB\u3067\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
		logh.putError(G_SCRIPT_BEGIN, inFile + "\u30D5\u30A1\u30A4\u30EB\u306F\u6C7A\u6E08\u7D50\u679C\u30D5\u30A1\u30A4\u30EB\u3067\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
		continue;
	}

	if (A_File[0][2] == ITAKUCODE.trim()) {
		var type = "koufuri";
	} else {
		type = "haraikomi";
	}

	for (var cnt = 1; cnt < 25; cnt++) //テーブル番号取得
	//ＳＱＬ作成
	//決済結果が未記入
	//ＳＱＬ実行
	{
		if (cnt < 10) {
			var tableNo = "0" + cnt;
		} else {
			tableNo = cnt;
		}

		var sql = "select ptext3 from post_" + tableNo + "_tb " + "where ptext1 not in ('0','3') and " + "ptext3 is not null and " + "ptext3 != '' and " + "ptext14 is not null";
		H_notNullptext14[tableNo] = dbh.getCol(sql);
	}

	var recCnt = A_File.length;
	dbh.begin();

	if (type == "koufuri") //１行ずつ処理する
		//払込の場合
		{
			for (lineCnt = 0;; lineCnt < recCnt; lineCnt++) //受注コードの上４桁から利用年月を取得
			//テーブルＮＯ取得
			//２４ヶ月前のデータがあった場合
			//口座振替結果が「振替済」の場合、決済ステータスを「完了」にする
			//更新用ＳＱＬ作成
			//更新エラーでもプログラム終了させない
			//post_X_tbへの更新が失敗した場合
			{
				var targetYear = "20" + A_File[lineCnt][1].substr(0, 2);
				var targetMonth = A_File[lineCnt][1].substr(2, 2);
				var kokyakucode = A_File[lineCnt][1].substr(4);
				tableNo = getTableNo(curYear, curMonth, targetYear, targetMonth);

				if (tableNo == "") //post_X_tbへの更新をロールバックする
					{
						dbh.rollback();
						print(inFile + "\u30D5\u30A1\u30A4\u30EB\u306B\uFF12\uFF14\u30F6\u6708\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u3066\u3044\u308B\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
						logh.putError(G_SCRIPT_BEGIN, inFile + "\u30D5\u30A1\u30A4\u30EB\u306B\uFF12\uFF14\u30F6\u6708\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u3066\u3044\u308B\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
						continue;
					}

				if (-1 !== H_notNullptext14[tableNo].indexOf(kokyakucode) == true) //決済結果を新規で登録する場合
					{
						var ptext14_sql = "ptext14 = ptext14 || '->" + curYear + "-" + curMonth + "-" + curDate + " " + H_kouResult[A_File[lineCnt][23]] + "'";
					} else //顧客コードを追加
					{
						ptext14_sql = "ptext14 = '" + curYear + "-" + curMonth + "-" + curDate + " " + H_kouResult[A_File[lineCnt][23]] + "'";
						H_notNullptext14[tableNo].push(kokyakucode);
					}

				if (A_File[lineCnt][23] == "0") //口座振替結果が「振替済」以外の場合、決済ステータスを「請求残」にする
					{
						var ptext15 = "'2'";
					} else {
					ptext15 = "'1'";
				}

				sql = "update post_" + tableNo + "_tb " + "set " + ptext14_sql + "," + "ptext15 = " + ptext15 + " " + "where pactid = " + PACTID + " and ptext3 = '" + kokyakucode + "'";
				var rtn = dbh.query(sql);

				if (DB.isError(rtn) == true) //post_X_tbへの更新をロールバックする
					//エラーログをはく
					//post_X_tbへの更新が成功した場合
					{
						dbh.rollback();
						print("post_" + tableNo + "_tb\u66F4\u65B0\u5931\u6557(\u53E3\u5EA7\u632F\u66FF)\uFF1A" + rtn.userinfo + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE \u53D7\u6CE8\u30B3\u30FC\u30C9\uFF1A" + A_File[lineCnt][1] + " \u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
						logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb\u66F4\u65B0\u5931\u6557(\u53E3\u5EA7\u632F\u66FF)\uFF1A" + rtn.userinfo + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE \u53D7\u6CE8\u30B3\u30FC\u30C9\uFF1A" + A_File[lineCnt][1]);
						continue;
					} else //更新された件数が０件ならばエラー扱い
					{
						if (dbh.affectedRows() == 0) //post_X_tbへの更新をロールバックする
							//エラーログをはく
							//更新された件数が２件以上ならばエラー扱い
							{
								dbh.rollback();
								print("post_" + tableNo + "_tb\u306B" + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE\u306E\u9867\u5BA2\u30B3\u30FC\u30C9\uFF1A" + kokyakucode + "\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F(\u53E3\u5EA7\u632F\u66FF) \u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
								logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb\u306B" + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE\u306E\u9867\u5BA2\u30B3\u30FC\u30C9\uFF1A" + kokyakucode + "\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F(\u53E3\u5EA7\u632F\u66FF)");
								continue;
							} else if (dbh.affectedRows() > 1) //post_X_tbへの更新をロールバックする
							//エラーログをはく
							{
								dbh.rollback();
								print("post_" + tableNo + "_tb\u306B" + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE\u306E\u9867\u5BA2\u30B3\u30FC\u30C9\uFF1A" + kokyakucode + "\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059(\u53E3\u5EA7\u632F\u66FF) \u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
								logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb\u306B" + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE\u306E\u9867\u5BA2\u30B3\u30FC\u30C9\uFF1A" + kokyakucode + "\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059(\u53E3\u5EA7\u632F\u66FF)");
								continue;
							}
					}
			}
		} else if (type == "haraikomi") //１行ずつ処理する
		{
			for (lineCnt = 0;; lineCnt < recCnt; lineCnt++) //受注コードの上４桁から利用年月を取得
			//テーブルＮＯ取得
			//２４ヶ月前のデータがあった場合
			//データ種別が「確報」または空の場合、過不足額が０円なら決済ステータスを「完了」にする
			//更新用ＳＱＬ作成
			//更新エラーでもプログラム終了させない
			//post_X_tbへの更新が失敗した場合
			{
				targetYear = "20" + A_File[lineCnt][1].substr(0, 2);
				targetMonth = A_File[lineCnt][1].substr(2, 2);
				kokyakucode = A_File[lineCnt][1].substr(4);
				tableNo = getTableNo(curYear, curMonth, targetYear, targetMonth);

				if (tableNo == "") {
					dbh.rollback();
					print(inFile + "\u30D5\u30A1\u30A4\u30EB\u306B\uFF12\uFF14\u30F6\u6708\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u3066\u3044\u308B\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
					logh.putError(G_SCRIPT_BEGIN, inFile + "\u30D5\u30A1\u30A4\u30EB\u306B\uFF12\uFF14\u30F6\u6708\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u3066\u3044\u308B\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
					continue;
				}

				if (-1 !== H_notNullptext14[tableNo].indexOf(kokyakucode) == true) //決済結果を新規で登録する場合
					{
						ptext14_sql = "ptext14 = ptext14 || '->" + curYear + "-" + curMonth + "-" + curDate + " " + H_harDatatype[A_File[lineCnt][2]] + "'";
					} else //顧客コードを追加
					{
						ptext14_sql = "ptext14 = '" + curYear + "-" + curMonth + "-" + curDate + " " + H_harDatatype[A_File[lineCnt][2]] + "'";
						H_notNullptext14[tableNo].push(kokyakucode);
					}

				if ((A_File[lineCnt][2] == "02" || A_File[lineCnt][2] == "") && A_File[lineCnt][23] == "0") //データ種別が「速報」、「取消」の場合とデータ種別が「確報」または空で過不足金が発生している場合は決済ステータスを「請求残」にする
					{
						ptext15 = "'2'";
					} else {
					ptext15 = "'1'";
				}

				sql = "update post_" + tableNo + "_tb " + "set ptext13 = '" + A_File[lineCnt][20] + "'," + ptext14_sql + "," + "ptext15 = " + ptext15 + "," + "pint3 = " + A_File[lineCnt][23] + " " + "where pactid = " + PACTID + " and ptext3 = '" + kokyakucode + "'";
				rtn = dbh.query(sql);

				if (DB.isError(rtn) == true) //post_X_tbへの更新をロールバックする
					//エラーログをはく
					//post_X_tbへの更新が成功した場合
					{
						dbh.rollback();
						print("post_" + tableNo + "_tb\u66F4\u65B0\u5931\u6557(\u6255\u8FBC)\uFF1A" + rtn.userinfo + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE \u53D7\u6CE8\u30B3\u30FC\u30C9\uFF1A" + A_File[lineCnt][1] + " \u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
						logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb\u66F4\u65B0\u5931\u6557(\u6255\u8FBC)\uFF1A" + rtn.userinfo + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE \u53D7\u6CE8\u30B3\u30FC\u30C9\uFF1A" + A_File[lineCnt][1]);
						continue;
					} else //更新された件数が０件ならばエラー扱い
					{
						if (dbh.affectedRows() == 0) //post_X_tbへの更新をロールバックする
							//エラーログをはく
							//更新された件数が２件以上ならばエラー扱い
							{
								dbh.rollback();
								print("post_" + tableNo + "_tb\u306B" + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE\u306E\u9867\u5BA2\u30B3\u30FC\u30C9\uFF1A" + kokyakucode + "\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F(\u6255\u8FBC) \u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
								logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb\u306B" + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE\u306E\u9867\u5BA2\u30B3\u30FC\u30C9\uFF1A" + kokyakucode + "\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F(\u6255\u8FBC)");
								continue;
							} else if (dbh.affectedRows() > 1) //post_X_tbへの更新をロールバックする
							//エラーログをはく
							{
								dbh.rollback();
								print("post_" + tableNo + "_tb\u306B" + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE\u306E\u9867\u5BA2\u30B3\u30FC\u30C9\uFF1A" + kokyakucode + "\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059(\u6255\u8FBC) \u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
								logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb\u306B" + inFile + "\u30D5\u30A1\u30A4\u30EB\u306E" + (lineCnt + 1) + "\u884C\u76EE\u306E\u9867\u5BA2\u30B3\u30FC\u30C9\uFF1A" + kokyakucode + "\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059(\u6255\u8FBC)");
								continue;
							}
					}
			}
		}

	dbh.commit();
	var finDir = dataDir + FIN_DIR;

	if (is_dir(finDir) == false) //移動先ディレクトリ作成失敗
		{
			if (mkdir(finDir, 700) == false) {
				print("ERROR: \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			} else {
				print("INFO: \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u4F5C\u6210\u5B8C\u4E86\n");
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u4F5C\u6210\u5B8C\u4E86");
			}
		}

	clearstatcache();

	if (is_file(dataDir + "/" + inFile) == true) //移動が失敗した場合
		{
			if (rename(dataDir + "/" + inFile, finDir + "/" + inFile) == false) {
				print("ERROR: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + dataDir + "/" + inFile + ")\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + dataDir + "/" + inFile + ")");
			} else {
				print("INFO: \u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u5B8C\u4E86(" + dataDir + "/" + inFile + ")\n");
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " \u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u5B8C\u4E86(" + dataDir + "/" + inFile + ")");
			}
		}

	clearstatcache();
}

lock(false);
print("\u30A2\u30B0\u30EC\u30C3\u30AF\u30B9\u6C7A\u6E08\u7D50\u679C\u53D6\u8FBC\u7D42\u4E86\n");
logh.putError(G_SCRIPT_END, "\u30A2\u30B0\u30EC\u30C3\u30AF\u30B9\u6C7A\u6E08\u7D50\u679C\u53D6\u8FBC\u7D42\u4E86");
throw die(0);

function usage(comment) {
	if (!("dbh" in global)) dbh = undefined;

	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + SCRIPTNAME + " \u6C7A\u6E08\u7D50\u679C\uFF23\uFF33\uFF36\u30D5\u30A1\u30A4\u30EB\u540D\n\n");
	dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw die(1);
};

function lock(is_lock) //ロックする
{
	if (!("dbh" in global)) dbh = undefined;
	var pre = "batch";
	var now = getTimestamp();

	if (is_lock == true) //既に起動中
		//ロック解除
		{
			dbh.begin();
			dbh.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
			var count = dbh.getOne(sql);

			if (count != 0) {
				dbh.rollback();
				print("\n\u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n\n");
				dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + "\u591A\u91CD\u52D5\u4F5C");
				return false;
			}

			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + dbh.escape(pre + "_" + SCRIPTNAME) + "',1,'" + now + "');";
			dbh.query(sql);
			dbh.commit();
		} else {
		dbh.begin();
		dbh.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "';";
		dbh.query(sql);
		dbh.commit();
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

function getTableNo(currentYear, currentMonth, targetYear, targetMonth) //１年以内は利用月をそのまま返す（０補完）
{
	var calc = 12 * (currentYear - targetYear) + currentMonth - targetMonth;

	if (calc < 12) //２年以上前は空文字を返す
		{
			var tableNo = targetMonth;
		} else if (calc > 23) {
		tableNo = "";
	} else {
		tableNo = targetMonth + 12;
	}

	return tableNo;
};