#!/usr/local/bin/php
//スクリプト名
//DB名
//$dbname = "kcsmotion";
//DBのpostgresパスワード
//Web のホームディレクトリに.pgpass を作成する
//0：通常　1:デバッグ
//実行モード
//バックアップモード
//---------------------------------------------------------------------------
//ローカルログファイル名（月単位）
//ログファイルを開けない
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//他に起動中のバッチが無いかチェック
//他のバッチが起動中ならば強制終了
//取得できなければエラー終了
//スタートログの出力
//指定pact専用ディレクトリ
//各pact用ディレクトリ作成---------------------------
//コンバート用ファイル名
//V2お客様情報備考取得
//２重起動ロック解除
//.pgpass を削除する
echo("\n");
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

require("convert_v3_function.php");

const SCRIPT_NAME = "convert_knowledge.php";
const LOG_DIR = KCS_DIR + "/log/convertV3";

if (file_exists("/tmp/.s.PGSQL.6543") === true) {
	var port = "6543";
} else {
	port = "5432";
}

var dbpass = file_get_contents("/kcs/conf/dbpassp").trim();
var fp_pass = fopen("/home/web/.pgpass", "w+");
fwrite(fp_pass, "*:*:*:*:" + dbpass);
fclose(fp_pass);
exec("/bin/chmod 600 /home/web/.pgpass");
const DEBUG_FLG = 0;
var mode = "f";
var backup = "Y";
var LocalLogFile = LOG_DIR + "/convert_knowledge.log";

if (fopen(LocalLogFile, "a") == false) {
	logh.putError(G_SCRIPT_ERROR, "V3\u304A\u5BA2\u69D8\u60C5\u5831\u5099\u8003\u30B3\u30F3\u30D0\u30FC\u30C8 \u30ED\u30B0\u30D5\u30A1\u30A4\u30EB\uFF08" + LocalLogFile + "\uFF09\u3092\u958B\u3051\u307E\u305B\u3093");
	throw die(1);
}

if (_SERVER.argv.length != 2 && _SERVER.argv.length != 3 && _SERVER.argv.length != 4) //数が正しくない
	{
		usage("", _SERVER.argv.length);
	} else {
	{
		let _tmp_0 = _SERVER.argv;

		for (var key in _tmp_0) {
			var val = _tmp_0[key];

			if (key == 1) {
				if (preg_match("/^-p=/", val) == false) {
					usage("\u4F1A\u793E\u30B3\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + val);
				} else {
					var pactid = val.replace(/^-p=/g, "");

					if (preg_match("/(\\D)/", pactid) == true) {
						usage("\u4F1A\u793E\u30B3\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + pactid);
					}
				}
			}

			if (key == 2) {
				if (preg_match("/^-m=/", val) == false) {
					usage("\u5B9F\u884C\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + val);
				} else {
					var str = val.replace(/^-m=/g, "");

					if (str != "f" && str != "d" && str != "fy" && str != "dy") {
						usage("\u5B9F\u884C\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + mode);
					}

					mode = str.replace(/y$/g, "");
					var ans = str.replace(/f|d/g, "");
				}
			}

			if (key == 3) {
				if (preg_match("/^-b=/", val) == false) {
					usage("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + val);
				} else {
					backup = val.replace(/^-b=/g, "").toUpperCase();

					if (backup != "N" && backup != "n" && backup != "Y" && backup != "y") {
						usage("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002" + backup);
					}
				}
			}
		}
	}
}

var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
log_listener.PutListener(log_listener_typeView);
log_listener.PutListener(log_listener_type);
GLOBALS.dbh = new ScriptDB(log_listener);
var b_sql = "select count(command) from clamptask_tb where command !='batch_" + SCRIPT_NAME + "'";
var b_cnt = GLOBALS.dbh.getOne(b_sql);

if (b_cnt > 0) {
	fwrite(STDOUT, "\u4ED6\u306B\u8D77\u52D5\u4E2D\u306E\u30D0\u30C3\u30C1\u304C\u3042\u308A\u307E\u3059\n\u5168\u3066\u306E\u30D0\u30C3\u30C1\u304C\u7D42\u4E86\u3057\u3066\u304B\u3089\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\n");
	logging("\u4ED6\u306B\u8D77\u52D5\u4E2D\u306E\u30D0\u30C3\u30C1\u304C\u3042\u308A\u307E\u3059\n\u5168\u3066\u306E\u30D0\u30C3\u30C1\u304C\u7D42\u4E86\u3057\u3066\u304B\u3089\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\n");
	throw die(1);
}

if (lock(true, GLOBALS.dbh) == false) {
	fwrite(STDOUT, " V3\u304A\u5BA2\u69D8\u60C5\u5831\u5099\u8003\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n");
	logging(" V3\u304A\u5BA2\u69D8\u60C5\u5831\u5099\u8003\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n");
	throw die(1);
}

var get_pactname = "select compname,type from pact_tb where pactid=" + pactid;
var A_pact = GLOBALS.dbh.getHash(get_pactname, true);
var pactname = A_pact[0].compname;
var type = A_pact[0].type;

if (undefined !== pactname == false || pactname == "") {
	lock(false, GLOBALS.dbh);
	fwrite(STDOUT, "ERROR: \u4F1A\u793E\u540D\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
	logging("ERROR: \u4F1A\u793E\u540D\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
	throw die(1);
}

if (undefined !== ans == true && ans != "y") {
	fwrite(STDOUT, pactname + "\u306E\u304A\u5BA2\u69D8\u60C5\u5831\u5099\u8003\u3092v3\u7528\u306B\u30B3\u30F3\u30D0\u30FC\u30C8\u3057\u307E\u3059\n\n\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F\uFF08N/y\uFF09> ");
	var stdin = fopen("php://stdin", "r");
	var line = fgets(stdin, 64).trim();

	if (line == "y" or line == "Y" == false) {
		lock(false, GLOBALS.dbh);
		fwrite(STDOUT, line + "\uFF1A\u51E6\u7406\u3092\u4E2D\u6B62\u3057\u307E\u3059\n\n");
		throw die(0);
	}
}

echo("start:" + date("Y-m-d H:i:s") + "\n");
fwrite(STDOUT, "START:" + pactname + " \u306E\u304A\u5BA2\u69D8\u60C5\u5831\u5099\u8003V3\u7528\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059\n");
logging("START:" + pactname + " \u306E\u304A\u5BA2\u69D8\u60C5\u5831\u5099\u8003V3\u7528\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
const PACT_DIR = LOG_DIR + "/" + pactid;

if (is_dir(PACT_DIR) == false) {
	if (mkdir(PACT_DIR) == false) {
		fwrite(STDOUT, "ERROR: \u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
		logging("ERROR: \u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
		lock(false, GLOBALS.dbh);
		throw die();
	}
}

GLOBALS.dbh.begin();
var fnccnvfile = PACT_DIR + "/convert_post_rel_shop_info_tb_" + pactid + ".sql";
var fp = fopen(fnccnvfile, "w");
var get_v2_sql = "SELECT shopid,knowledge FROM pact_rel_shop_tb WHERE pactid=" + pactid + " GROUP BY shopid,knowledge";
var H_v2_knowledge = GLOBALS.dbh.getHash(get_v2_sql);

if (true == Array.isArray(H_v2_knowledge) && true == 0 < H_v2_knowledge.length) //同じ販売店でknowledgeに差がないか調べる
	//作業用配列
	//販売店ごとにV3のデータへコンバート
	{
		var H_temp = Array();

		for (var val of Object.values(H_v2_knowledge)) //作業用配列にすでにその販売店のknowledgeが入ってたらおかしいので空にして出る
		{
			if (true == (undefined !== H_temp[val.shopid])) //そうでなければ配列に情報を入れる
				{
					fwrite(STDOUT, "WARNING: V2\u306E\u5099\u8003\u30C7\u30FC\u30BF\u304C\u4E00\u3064\u306E\u8CA9\u58F2\u5E97\u5185\u3067\u30AD\u30E3\u30EA\u30A2\u306B\u3088\u3063\u3066\u7570\u306A\u308B\u305F\u3081\u79FB\u884C\u3057\u307E\u305B\u3093\u3002pact_rel_shop_tb\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\tpactid=" + pactid + "\tshopid=" + val.shopid + "\n");
					logging("WARNING: V2\u306E\u5099\u8003\u30C7\u30FC\u30BF\u304C\u4E00\u3064\u306E\u8CA9\u58F2\u5E97\u5185\u3067\u30AD\u30E3\u30EA\u30A2\u306B\u3088\u3063\u3066\u7570\u306A\u308B\u305F\u3081\u79FB\u884C\u3057\u307E\u305B\u3093\u3002pact_rel_shop_tb\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\tpactid=" + pactid + "\tshopid=" + val.shopid + "\n");
					H_temp = Array();
					lock(false, GLOBALS.dbh);
					throw die(1);
				} else {
				H_temp[val.shopid] = val.knowledge;
			}
		}

		for (var shopid in H_temp) //ルート部署IDを取得
		{
			var knowledge = H_temp[shopid];
			var get_rootpostid = "SELECT postidparent from post_relation_tb where level=0 and pactid=" + pactid;
			var rootpostid = GLOBALS.dbh.getOne(get_rootpostid);

			if ("" != rootpostid) //その情報がV3で既存かどうか確認
				//まだなかったらインサート
				{
					var get_v3_knowledge = "SELECT count(knowledge) FROM post_rel_shop_info_tb WHERE shopid=" + shopid + " AND pactid=" + pactid + " AND postid=" + rootpostid;
					var k_cnt = GLOBALS.dbh.getOne(get_v3_knowledge);

					if (0 == k_cnt) {
						var ins_sql = "INSERT INTO post_rel_shop_info_tb (pactid, postid, shopid, knowledge) VALUES(" + pactid + ", " + rootpostid + ", " + shopid + ", '" + knowledge + "')";
						execFunction(mode, ins_sql, fp);
					} else {
						fwrite(STDOUT, "NOTICE: \u65E2\u306BV3\u306E\u5099\u8003\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3059\u308B\u305F\u3081\u79FB\u884C\u3057\u307E\u305B\u3093\u3002post_rel_shop_info_tb\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\tpactid=" + pactid + "\tshopid=" + shopid + "\tpostid=" + rootpostid + "\n");
						logging("NOTICE: \u65E2\u306BV3\u306E\u5099\u8003\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3059\u308B\u305F\u3081\u79FB\u884C\u3057\u307E\u305B\u3093\u3002post_rel_shop_info_tb\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\tpactid=" + pactid + "\tshopid=" + shopid + "\tpostid=" + rootpostid + "\n");
						lock(false, GLOBALS.dbh);
						throw die(1);
					}
				} else {
				fwrite(STDOUT, "ERROR: \u30EB\u30FC\u30C8\u90E8\u7F72ID\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
				logging("ERROR: \u30EB\u30FC\u30C8\u90E8\u7F72ID\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
				lock(false, GLOBALS.dbh);
			}
		}
	} else {
	fwrite(STDOUT, "NOTICE: V2\u306E\u304A\u5BA2\u69D8\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093\tpactid=" + pactid + "\n");
	logging("NOTICE: V2\u306E\u304A\u5BA2\u69D8\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093\tpactid=" + pactid + "\n");
}

fclose(fp);
lock(false, GLOBALS.dbh);
exec("/bin/rm -f /home/web/.pgpass");

if (DEBUG_FLG == 1) //ロールバック
	{
		GLOBALS.dbh.rollback();
	}

fwrite(STDOUT, "START:" + pactname + "(" + pactid + ") \u306E\u304A\u5BA2\u69D8\u60C5\u5831\u5099\u8003V3\u7528\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
logging("START:" + pactname + "(" + pactid + ") \u306E\u304A\u5BA2\u69D8\u60C5\u5831\u5099\u8003V3\u7528\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
echo("end:" + date("Y-m-d H:i:s") + "\n");