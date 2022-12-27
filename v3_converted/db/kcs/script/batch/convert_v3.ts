#!/usr/local/bin/php
//スクリプト名
//Wホワイトオプション
//DB名
//$dbname = "kcsmotion";
//DBのpostgresパスワード
//購入方式があるキャリア
//Web のホームディレクトリに.pgpass を作成する
//0：通常　1:デバッグ
//実行モード
//バックアップモード
//---------------------------------------------------------------------------
//ローカルログファイル名（月単位）
//ログファイルを開けない
//パラメータチェック
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
//権限一覧取得
//権限一覧をバッファに
//ループしてコンバート
//コンバート対象のfncidの配列
//インサート用日付
//V3注文履歴（$A_fnc_cnvに入れていたが、旧HL注文履歴はそのまま残す必要があるため、ここで改めて入れるようにした） 20100104miya
//無ければ付与
//buysel変換表作成
//buyselidがキー、buyselnameが値の配列を作る
//plan変換表作成
//planidがキー、plannameが値の配列を作る
//packet変換表作成
//割引サービス
//電話コンバート------------------------------------------------------------------------------------------------
//25テーブル分ループして処理します
//HotLineは直近だけ
//電話管理記録コンバート------------------------------------------------------------------------
//既に管理記録が一つでもあればコンバートしない
//電話ユーザ設定項目コンバート------------------------------------------------------------------------
//.pgpass を削除する
echo("\n");
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

require("convert_v3_function.php");

const SCRIPT_NAME = "convert_v3.php";
const LOG_DIR = KCS_DIR + "/log/convertV3";
const DOCOMOCARID = 1;
const WILLCARID = 2;
const AUCARID = 3;
const SBCARID = 4;
const EMCARID = 15;
const SMCARID = 28;
const WWHITE = 124;

if (file_exists("/tmp/.s.PGSQL.6543") === true) {
	var port = "6543";
} else {
	port = "5432";
}

var dbpass = file_get_contents("/kcs/conf/dbpassp").trim();
var A_buycar = [DOCOMOCARID, WILLCARID, AUCARID, SBCARID, EMCARID, SMCARID];
var fp_pass = fopen("/home/web/.pgpass", "w+");
fwrite(fp_pass, "*:*:*:*:" + dbpass);
fclose(fp_pass);
exec("/bin/chmod 600 /home/web/.pgpass");
const DEBUG_FLG = 0;
var mode = "f";
var backup = "Y";
var LocalLogFile = LOG_DIR + "/convert_v3.log";

if (fopen(LocalLogFile, "a") == false) {
	logh.putError(G_SCRIPT_ERROR, "V3\u30B3\u30F3\u30D0\u30FC\u30C8 \u30ED\u30B0\u30D5\u30A1\u30A4\u30EB\uFF08" + LocalLogFile + "\uFF09\u3092\u958B\u3051\u307E\u305B\u3093");
	throw die(1);
}

var A_fnc_cnv = {
	"13": "104",
	"14": "103",
	"36": "111",
	"37": "112",
	"68": "106",
	"69": "105",
	"70": "105",
	"71": "112",
	"21": "120",
	"24": "124",
	"31": "121",
	"48": "120",
	"23": "123",
	"55": "133",
	"15": "141",
	"49": "26",
	"50": "27",
	"51": "39",
	"52": "28",
	"86": "85",
	"139": "138",
	"57": "140"
};

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
	fwrite(STDOUT, " V3\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n");
	logging(" V3\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406  \u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n");
	throw die(1);
}

var get_pactname = "select compname,type from pact_tb where pactid=" + GLOBALS.pactid;
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
	fwrite(STDOUT, pactname + "\u306E\u30C7\u30FC\u30BF\u3092v3\u7528\u306B\u30B3\u30F3\u30D0\u30FC\u30C8\u3057\u307E\u3059\n\n\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F\uFF08N/y\uFF09> ");
	var stdin = fopen("php://stdin", "r");
	var line = fgets(stdin, 64).trim();

	if (line == "y" or line == "Y" == false) {
		lock(false, GLOBALS.dbh);
		fwrite(STDOUT, line + "\uFF1A\u51E6\u7406\u3092\u4E2D\u6B62\u3057\u307E\u3059\n\n");
		throw die(0);
	}
}

echo("start:" + date("Y-m-d H:i:s") + "\n");
fwrite(STDOUT, "START:" + pactname + " \u306E\u30C7\u30FC\u30BF\u3092V3\u7528\u306B\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059\n");
logging("START:" + pactname + " \u306E\u30C7\u30FC\u30BF\u3092V3\u7528\u306B\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059");
const PACT_DIR = LOG_DIR + "/" + pactid;

if (is_dir(PACT_DIR) == false) {
	if (mkdir(PACT_DIR) == false) {
		fwrite(STDOUT, "ERROR: \u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
		logging("ERROR: \u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
		lock(false, GLOBALS.dbh);
		throw die();
	}
}

var get_su = "select userid from user_tb where type='SU' and pactid=" + pactid;
var A_suid = GLOBALS.dbh.getCol(get_su, true);

if (A_suid.length < 1) {
	fwrite(STDOUT, "ERROR: \u30B9\u30FC\u30D1\u30FC\u30E6\u30FC\u30B6\u306EID\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
	logging("ERROR: \u30B9\u30FC\u30D1\u30FC\u30E6\u30FC\u30B6\u306EID\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n");
	lock(false, GLOBALS.dbh);
	throw die();
}

if (backup == "Y") //権限テーブルをpg_dumpしておく
	//指定pactだけ抜き出す（リカバリー用）
	//リカバリー用ファイル名
	//delete文
	//insert文
	{
		var command = "/usr/local/pgsql/bin/pg_dump -p " + port + " " + G_DB_NAME + " -U postgres -d -at fnc_relation_tb -f " + LOG_DIR + "/fnc_relation_tb_bk.sql";
		var res = exec(command);
		var fncbkfile = PACT_DIR + "/fnc_relation_tb_bk_" + pactid + ".sql";
		var fp = fopen(fncbkfile, "w");
		fwrite(fp, "delete from fnc_relation_tb where pactid=" + pactid + "\n\n");
		fclose(fp);
		command = "/bin/cat " + LOG_DIR + "/fnc_relation_tb_bk.sql |grep '(" + pactid + ",' >>" + fncbkfile;
		res = exec(command);
	}

GLOBALS.dbh.begin();
var fnccnvfile = PACT_DIR + "/convert_fnc_relation_tb_" + pactid + ".sql";
fp = fopen(fnccnvfile, "w");
var sql = "select fr.* from fnc_relation_tb as fr inner join function_tb as ft on fr.fncid=ft.fncid where fr.pactid=" + pactid + " order by ft.show_order";
var A_fnc = GLOBALS.dbh.getHash(sql);
var A_tmp = Object.keys(A_fnc_cnv);
var basetime = date("Y-m-d H:i:s");
var A_basetime = split("-| |:", basetime);

for (var cnt = 0; cnt < A_fnc.length; cnt++) //お気に入り用
//既にそのお気に入りが登録されてないか調べる
{
	var fncid = A_fnc[cnt].fncid;

	if (-1 !== A_tmp.indexOf(A_fnc[cnt].fncid) == true) //お気に入り用
		//既にその権限が付いていないか調べる
		{
			fncid = A_fnc_cnv[A_fnc[cnt].fncid];
			var chk_sql = "select count(fncid) from fnc_relation_tb " + " where " + " pactid=" + pactid + " and userid=" + A_fnc[cnt].userid + " and fncid=" + A_fnc_cnv[A_fnc[cnt].fncid];
			var fnccnt = GLOBALS.dbh.getOne(chk_sql);

			if (fnccnt < 1) //sql実行
				//移行プラス追加の処理---------------
				//電話管理
				{
					sql = "update fnc_relation_tb as fr set fncid=" + A_fnc_cnv[A_fnc[cnt].fncid] + " where " + " pactid=" + pactid + " and userid=" + A_fnc[cnt].userid + " and fncid=" + A_fnc[cnt].fncid;
					execFunction(mode, sql, fp);

					if (A_fnc[cnt].fncid == 13) //既にその権限が付いていないか調べる
						{
							chk_sql = "select count(fncid) from fnc_relation_tb " + " where " + " pactid=" + pactid + " and userid=" + A_fnc[cnt].userid + " and fncid=102";
							fnccnt = GLOBALS.dbh.getOne(chk_sql);

							if (fnccnt < 1) //sql実行
								{
									sql = "insert into fnc_relation_tb values (" + pactid + "," + A_fnc[cnt].userid + ",102)";
									execFunction(mode, sql, fp);
								}
						}

					if (A_fnc[cnt].fncid == 14) //既にその権限が付いていないか調べる
						{
							chk_sql = "select count(fncid) from fnc_relation_tb " + " where " + " pactid=" + pactid + " and userid=" + A_fnc[cnt].userid + " and fncid=101";
							fnccnt = GLOBALS.dbh.getOne(chk_sql);

							if (fnccnt < 1) //sql実行
								{
									sql = "insert into fnc_relation_tb values (" + pactid + "," + A_fnc[cnt].userid + ",101)";
									execFunction(mode, sql, fp);
								}
						}

					if (A_fnc[cnt].fncid == 55) //既にその権限が付いていないか調べる
						{
							chk_sql = "select count(fncid) from fnc_relation_tb " + " where " + " pactid=" + pactid + " and userid=0" + " and fncid=135";
							fnccnt = GLOBALS.dbh.getOne(chk_sql);

							if (fnccnt < 1) //sql実行
								{
									sql = "insert into fnc_relation_tb values (" + pactid + ",0,135)";
									execFunction(mode, sql, fp);
								}
						}

					if (A_fnc[cnt].fncid == 17) //既にその権限が付いていないか調べる
						{
							chk_sql = "select count(fncid) from fnc_relation_tb " + " where " + " pactid=" + pactid + " and userid=" + A_fnc[cnt].userid + " and fncid=116";
							fnccnt = GLOBALS.dbh.getOne(chk_sql);

							if (fnccnt < 1) //sql実行
								{
									sql = "insert into fnc_relation_tb values (" + pactid + "," + A_fnc[cnt].userid + ",116)";
									execFunction(mode, sql, fp);
								}
						}

					if (A_fnc[cnt].fncid == 38) //既にその権限が付いていないか調べる
						{
							chk_sql = "select count(fncid) from fnc_relation_tb " + " where " + " pactid=" + pactid + " and userid=" + A_fnc[cnt].userid + " and fncid=117";
							fnccnt = GLOBALS.dbh.getOne(chk_sql);

							if (fnccnt < 1) //sql実行
								{
									sql = "insert into fnc_relation_tb values (" + pactid + "," + A_fnc[cnt].userid + ",117)";
									execFunction(mode, sql, fp);
								}
						}
				} else {
				fwrite(STDOUT, "WARNING: \u65E2\u306B\u767B\u9332\u6E08\u307F\u306EV3\u578B\u306E\u6A29\u9650\u3067\u3059\u3002\t(" + A_fnc[cnt].fncid + ")\tuserid:" + A_fnc[cnt].userid + "\n");
				logging("WARNING: \u65E2\u306B\u767B\u9332\u6E08\u307F\u306EV3\u578B\u306E\u6A29\u9650\u3067\u3059\t(" + A_fnc[cnt].fncid + ")\tuserid:" + A_fnc[cnt].userid + "\n");
			}
		}

	var fav_chk = "select count(pactid) from favorite_usermenu_tb " + " where " + " pactid=" + pactid + " and userid=" + A_fnc[cnt].userid + " and fncid=" + fncid;
	var favcnt = GLOBALS.dbh.getOne(fav_chk);

	if (favcnt < 1 && fncid != 101 && fncid != 102) //sql実行
		{
			var recdate = date("Y-m-d H:i:s", mktime(A_basetime[3], A_basetime[4], A_basetime[5] + cnt, A_basetime[1], A_basetime[2], A_basetime[0]));
			sql = "insert into favorite_usermenu_tb values(" + pactid + "," + A_fnc[cnt].userid + "," + fncid + ",'" + recdate + "')";
			execFunction(mode, sql, fp);
		} else {
		fwrite(STDOUT, "WARNING: \u65E2\u306B\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u6E08\u307F\u306E\u6A29\u9650\u3067\u3059\u3002\t(" + fncid + ")\tuserid:" + A_fnc[cnt].userid + "\n");
		logging("WARNING: \u65E2\u306B\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u6E08\u307F\u306E\u6A29\u9650\u3067\u3059\t(" + fncid + ")\tuserid:" + A_fnc[cnt].userid + "\n");
	}
}

var chk_v3ordlist = "select userid from fnc_relation_tb " + " where " + " pactid=" + pactid + " and fncid=53";
var H_v3ordlistfnc = GLOBALS.dbh.getCol(chk_v3ordlist);

if (0 < H_v3ordlistfnc.length) {
	for (var userid of Object.values(H_v3ordlistfnc)) //既にその権限が登録されてないか調べる
	{
		var fnc_chk = "select count(pactid) from fnc_relation_tb " + " where " + " pactid=" + pactid + " and userid=" + userid + " and fncid=" + 121;
		fnccnt = GLOBALS.dbh.getOne(fnc_chk);

		if (fnccnt < 1) //sql実行
			{
				sql = "insert into fnc_relation_tb values (" + pactid + "," + userid + ",121)";
				execFunction(mode, sql, fp);
			}
	}
}

var fav_v3ordlist = "select pactid,userid from favorite_usermenu_tb " + " where " + " pactid=" + pactid + " and fncid=53";
var H_v3ordlistfav = GLOBALS.dbh.getHash(fav_v3ordlist);

if (0 < H_v3ordlistfav.length) {
	for (var olfav of Object.values(H_v3ordlistfav)) //既にそのお気に入りが登録されてないか調べる
	{
		fav_chk = "select count(pactid) from favorite_usermenu_tb " + " where " + " pactid=" + pactid + " and userid=" + olfav.userid + " and fncid=" + 121;
		favcnt = GLOBALS.dbh.getOne(fav_chk);

		if (favcnt < 1) //sql実行
			{
				recdate = date("Y-m-d H:i:s", mktime(A_basetime[3], A_basetime[4], A_basetime[5] + cnt, A_basetime[1], A_basetime[2], A_basetime[0]));
				sql = "insert into favorite_usermenu_tb values(" + pactid + "," + olfav.userid + ",121,'" + recdate + "')";
				execFunction(mode, sql, fp);
			} else {
			fwrite(STDOUT, "WARNING: \u65E2\u306B\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u6E08\u307F\u306E\u6A29\u9650\u3067\u3059\u3002\t(121)\tuserid:" + olfav.userid + "\n");
			logging("WARNING: \u65E2\u306B\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u6E08\u307F\u306E\u6A29\u9650\u3067\u3059\t(121)\tuserid:" + olfav.userid + "\n");
		}
	}
}

chk_sql = "select count(fncid) from fnc_relation_tb where pactid=" + pactid + " and userid=0 and fncid=79";
var res_cnt = GLOBALS.dbh.getOne(chk_sql);

if (res_cnt == 0) //sql実行
	{
		sql = "insert into fnc_relation_tb values (" + pactid + ",0,79)";
		execFunction(mode, sql, fp);
	}

fclose(fp);
sql = "select carid,buyselname,buyselid from buyselect_tb order by sort";
var A_buysel = GLOBALS.dbh.getHash(sql);
var H_buysel_d = Array();
var H_buysel_w = Array();
var H_buysel_a = Array();
var H_buysel_s = Array();
var H_buysel_e = Array();

for (cnt = 0;; cnt < A_buysel.length; cnt++) //ドコモ
{
	if (A_buysel[cnt].carid == DOCOMOCARID) {
		H_buysel_d[A_buysel[cnt].buyselname] = A_buysel[cnt].buyselid;
	}

	if (A_buysel[cnt].carid == WILLCARID) {
		H_buysel_w[A_buysel[cnt].buyselname] = A_buysel[cnt].buyselid;
	}

	if (A_buysel[cnt].carid == AUCARID) {
		H_buysel_a[A_buysel[cnt].buyselname] = A_buysel[cnt].buyselid;
	}

	if (A_buysel[cnt].carid == SBCARID) {
		H_buysel_s[A_buysel[cnt].buyselname] = A_buysel[cnt].buyselid;
	}

	if (A_buysel[cnt].carid == EMCARID) {
		H_buysel_e[A_buysel[cnt].buyselname] = A_buysel[cnt].buyselid;
	}
}

sql = "select planname,planid from plan_tb where planid < 3000 order by planid";
var A_plan_old = GLOBALS.dbh.getHash(sql);
var H_plan_old = Array();

for (cnt = 0;; cnt < A_plan_old.length; cnt++) {
	H_plan_old[A_plan_old[cnt].planid] = A_plan_old[cnt].planname;
}

sql = "select packetname,packetid from packet_tb where packetid > 3000";
var A_packet_new = GLOBALS.dbh.getHash(sql);
var H_packet_new = Array();

for (cnt = 0;; cnt < A_packet_new.length; cnt++) {
	H_packet_new[A_packet_new[cnt].packetname] = A_packet_new[cnt].packetid;
}

sql = "select opid from option_tb where discountflg=1";
var A_discount = GLOBALS.dbh.getCol(sql);

if (type == "H") {
	var limit = 3;
} else {
	limit = 25;
}

for (cnt = 0;; cnt <= limit; cnt++) //電話一覧取得
//電話毎に処理
{
	if (type == "H") {
		if (0 == cnt) {
			var tb = "tel_tb";
			var ass_tb = "assets_tb";
			var rel_tb = "tel_rel_assets_tb";
		} else {
			var num = date("m", mktime(0, 0, 0, date("m") - cnt, 1, date("Y")));
			tb = "tel_" + num + "_tb";
			ass_tb = "assets_" + num + "_tb";
			rel_tb = "tel_rel_assets_" + num + "_tb";
		}
	} else {
		if (0 == cnt) {
			tb = "tel_tb";
			ass_tb = "assets_tb";
			rel_tb = "tel_rel_assets_tb";
		} else if (25 == cnt) {
			tb = "tel_reserve_tb";
			ass_tb = "assets_reserve_tb";
			rel_tb = "tel_rel_assets_reserve_tb";
		} else {
			tb = "tel_" + str_pad(cnt, 2, "0", STR_PAD_LEFT) + "_tb";
			ass_tb = "assets_" + str_pad(cnt, 2, "0", STR_PAD_LEFT) + "_tb";
			rel_tb = "tel_rel_assets_" + str_pad(cnt, 2, "0", STR_PAD_LEFT) + "_tb";
		}
	}

	if (backup == "Y") //テーブルをpg_dumpしておく
		//指定pactだけ抜き出す（リカバリー用）
		//リカバリー用ファイル名
		//delete文
		//insert文
		{
			command = "/usr/local/pgsql/bin/pg_dump -p " + port + " " + G_DB_NAME + " -U postgres -d -at " + tb + " -f " + LOG_DIR + "/" + tb + "_bk.sql";
			res = exec(command);
			var telbkfile = PACT_DIR + "/" + tb + "_bk_" + pactid + ".sql";
			fp = fopen(telbkfile, "w");
			fwrite(fp, "delete from " + tb + " where pactid=" + pactid + "\n\n");
			fclose(fp);
			command = "/bin/cat " + LOG_DIR + "/" + tb + "_bk.sql |grep '(" + pactid + ",' >>" + telbkfile;
			res = exec(command);
		}

	var telcnvfile = PACT_DIR + "/convert_" + tb + "_" + pactid + ".sql";
	fp = fopen(telcnvfile, "w");
	sql = "select te.*,pl.planname,pa.packetname from " + tb + " as te " + "left outer join plan_tb as pl on te.planid=pl.planid " + "left outer join packet_tb as pa on te.packetid=pa.packetid " + " where pactid=" + pactid;
	var A_tel = GLOBALS.dbh.getHash(sql);

	for (var tcnt = 0; tcnt < A_tel.length; tcnt++) //メッセージ用
	//更新文字列を格納する配列
	//tel_X_tb
	//assets_X_tbにレコードを作るか否か
	//購入方式コンバート
	{
		var messkey = tb + ":" + A_tel[tcnt].telno + ":" + A_tel[tcnt].carid;
		var A_up = ["dummy_flg=false"];
		var ass_flg = false;

		if (A_tel[tcnt].planid != "" && A_tel[tcnt].planid != undefined && A_tel[tcnt].planid < 3000) //ドコモ
			{
				if (A_tel[tcnt].carid == DOCOMOCARID) //バリュー
					{
						if (preg_match("/(\\s|\u3000)\u30D0\u30EA\u30E5\u30FC/", H_plan_old[A_tel[tcnt].planid]) == true) {
							var buyselid = H_buysel_d["\u30D0\u30EA\u30E5\u30FC"];
						} else {
							if (preg_match("/905|906|705|905|\uFF19\uFF10\uFF15|\uFF19\uFF10\uFF16|\uFF17\uFF10\uFF15|\uFF17\uFF10\uFF16/", A_tel[tcnt].machine) == true) {
								buyselid = H_buysel_d["\u30D9\u30FC\u30B7\u30C3\u30AF"];
							} else {
								buyselid = H_buysel_d["\u9078\u629E\u306A\u3057"];
							}
						}
					} else if (A_tel[tcnt].carid == AUCARID) //フルサポート
					{
						if (preg_match("/\uFF08\u30D5\u30EB\u30B5\u30DD\u30FC\u30C8\uFF09/", H_plan_old[A_tel[tcnt].planid]) == true) {
							buyselid = H_buysel_a["\u30D5\u30EB\u30B5\u30DD\u30FC\u30C8"];
						} else if (preg_match("/\uFF08\u30B7\u30F3\u30D7\u30EB\uFF09|\u30B7\u30F3\u30D7\u30EB\uFF33|\u30B7\u30F3\u30D7\u30EB\uFF2C/", H_plan_old[A_tel[tcnt].planid]) == true) {
							buyselid = H_buysel_a["\u30B7\u30F3\u30D7\u30EB"];
						} else {
							buyselid = H_buysel_a["\u9078\u629E\u306A\u3057"];
						}
					} else if (A_tel[tcnt].carid == SBCARID) //新スーパーボーナス
					{
						if (preg_match("/\\s\u30D0\u30EA\u30E5\u30FC|\u30B7\u30F3\u30D7\u30EB\u30AA\u30EC\u30F3\u30B8/", H_plan_old[A_tel[tcnt].planid]) == true) {
							buyselid = H_buysel_s["24\u30F6\u6708\u5951\u7D04100\u52A0\u5165"];
						} else {
							buyselid = H_buysel_s["24\u30F6\u6708\u5951\u7D04100\u672A\u52A0\u5165"];
						}
					} else if (A_tel[tcnt].carid == WILLCARID) {
					buyselid = H_buysel_w["\u9078\u629E\u306A\u3057"];
				} else if (A_tel[tcnt].carid == EMCARID) {
					buyselid = H_buysel_e["\u9078\u629E\u306A\u3057"];
				} else if (A_tel[tcnt].carid == SMCARID) {
					buyselid = H_buysel_e["\u9078\u629E\u306A\u3057"];
				} else {
					buyselid = "NULL";
				}

				if (buyselid != "") {
					A_up.push("buyselid=" + buyselid);
				}
			}

		if (A_tel[tcnt].planid != "" && A_tel[tcnt].planid != undefined && A_tel[tcnt].planid < 3000) //購入方式があるキャリア
			{
				if (-1 !== A_buycar.indexOf(A_tel[tcnt].carid) == true) //buyselid未取得
					{
						if (buyselid == "") {
							var get_sql = "select buyselid from buyselect_tb where carid=" + A_tel[tcnt].carid + " and buyselname='\u9078\u629E\u306A\u3057'";
							buyselid = GLOBALS.dbh.getOne(get_sql);

							if (is_numeric(buyselid) == false) {
								fwrite(STDOUT, "WARNING: \u8CFC\u5165\u65B9\u5F0F\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30D7\u30E9\u30F3\u306E\u30B3\u30F3\u30D0\u30FC\u30C8\u306F\u3057\u307E\u305B\u3093\t" + messkey + "\n");
								logging("WARNING: \u8CFC\u5165\u65B9\u5F0F\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30D7\u30E9\u30F3\u306E\u30B3\u30F3\u30D0\u30FC\u30C8\u306F\u3057\u307E\u305B\u3093\t" + messkey + "\n");
							}
						}

						var planname = H_plan_old[A_tel[tcnt].planid];

						if (A_tel[tcnt].carid == SBCARID) {
							var H_option = unserialize(A_tel[tcnt].options);

							if (Array.isArray(H_option) == true && H_option.length > 0) {
								for (var key in H_option) //Wホワイトオプションは消すのでスキップ
								{
									var val = H_option[key];

									if (key == WWHITE) {
										planname = "\u30DB\u30EF\u30A4\u30C8\u30D7\u30E9\u30F3\uFF08\uFF37\u30DB\u30EF\u30A4\u30C8\u4ED8\uFF09";
									}
								}
							}
						}

						if (buyselid != "" && is_numeric(buyselid) == true) {
							sql = "select planid from plan_tb where planid > 3000 and carid=" + A_tel[tcnt].carid + " and cirid=" + A_tel[tcnt].cirid + " and buyselid=" + buyselid + " and planname='" + planname + "'";
							var planid = GLOBALS.dbh.getOne(sql);

							if (is_numeric(planid) == false) {
								fwrite(STDOUT, "WARNING: \u30B3\u30F3\u30D0\u30FC\u30C8\u3067\u304D\u306A\u3044\u30D7\u30E9\u30F3\u3067\u3059\u3002(" + A_tel[tcnt].planid + ")\t" + messkey + "\n");
								logging("WARNING: \u30B3\u30F3\u30D0\u30FC\u30C8\u3067\u304D\u306A\u3044\u30D7\u30E9\u30F3\u3067\u3059\u3002(" + A_tel[tcnt].planid + ")\t" + messkey + "\n");
							} else {
								A_up.push("planid=" + planid);
							}
						}
					} else {
					sql = "select planid from plan_tb where planid > 3000 and carid=" + A_tel[tcnt].carid + " and cirid=" + A_tel[tcnt].cirid + " and planname='" + H_plan_old[A_tel[tcnt].planid] + "'";
					planid = GLOBALS.dbh.getOne(sql);

					if (is_numeric(planid) == false) {
						fwrite(STDOUT, "WARNING: \u30B3\u30F3\u30D0\u30FC\u30C8\u3067\u304D\u306A\u3044\u30D7\u30E9\u30F3\u3067\u3059\u3002(" + A_tel[tcnt].planid + ")\t" + messkey + "\n");
						logging("WARNING: \u30B3\u30F3\u30D0\u30FC\u30C8\u3067\u304D\u306A\u3044\u30D7\u30E9\u30F3\u3067\u3059\u3002(" + A_tel[tcnt].planid + ")\t" + messkey + "\n");
					} else {
						A_up.push("planid=" + planid);
					}
				}
			}

		if (A_tel[tcnt].packetid != "" && A_tel[tcnt].packetid != undefined && A_tel[tcnt].packetid < 3000) //特殊処理
			{
				if (A_tel[tcnt].packetname == "\u30D1\u30B1\u30C3\u30C8\u5272\u5F15\u306A\u3057") {
					A_tel[tcnt].packetname = "\u30D1\u30B1\u30C3\u30C8\u5272\u5F15\u306A\u3057(\u30DB\u30EF\u30A4\u30C8)";
				}

				if (undefined !== H_packet_new[A_tel[tcnt].packetname] == false) {
					fwrite(STDOUT, "WARNING: \u30B3\u30F3\u30D0\u30FC\u30C8\u3067\u304D\u306A\u3044\u30D1\u30B1\u30C3\u30C8\u3067\u3059\u3002(" + A_tel[tcnt].packetid + ")\t" + messkey + "\n");
					logging("WARNING: \u30B3\u30F3\u30D0\u30FC\u30C8\u3067\u304D\u306A\u3044\u30D1\u30B1\u30C3\u30C8\u3067\u3059\u3002(" + A_tel[tcnt].packetid + ")\t" + messkey + "\n");
				} else {
					A_up.push("packetid=" + H_packet_new[A_tel[tcnt].packetname]);
				}
			}

		if (A_tel[tcnt].options != "" && A_tel[tcnt].options != undefined) {
			var H_di_new = Array();
			var H_op_new = Array();
			H_option = unserialize(A_tel[tcnt].options);

			if (H_option.length > 0) {
				for (var key in H_option) //Wホワイトオプションは消すのでスキップ
				{
					var val = H_option[key];

					if (key == WWHITE) {
						continue;
					}

					if (-1 !== A_discount.indexOf(key) == true) {
						H_di_new[key] = val;
					} else {
						H_op_new[key] = val;
					}
				}

				A_up.push("discounts='" + serialize(H_di_new) + "'");
				A_up.push("options='" + serialize(H_op_new) + "'");
			}
		}

		if (checkRelExist(pactid, A_tel[tcnt].carid, A_tel[tcnt].telno, rel_tb) == false) //機種名あり
			{
				if (A_tel[tcnt].machine != "" && A_tel[tcnt].machine != undefined) {
					ass_flg = true;
				}

				if (A_tel[tcnt].color != "" && A_tel[tcnt].color != undefined) {
					ass_flg = true;
				}

				if (A_tel[tcnt].orderdate != "" && A_tel[tcnt].orderdate != undefined) {
					ass_flg = true;
				}
			}

		if (A_up.length > 0) //sql実行
			{
				sql = "update " + tb + " set " + A_up.join(",") + " where pactid=" + pactid + " and telno='" + A_tel[tcnt].telno + "'" + " and carid=" + A_tel[tcnt].carid;
				execFunction(mode, sql, fp);
			}

		if (true == ass_flg) //資産ID取得
			{
				var now = date("Y-m-d H:i:s");
				sql = "select nextval('assets_parent_tb_assetsid_seq')";
				var assetsid = GLOBALS.dbh.getOne(sql);

				if (A_tel[tcnt].orderdate == "" && A_tel[tcnt].orderdate == undefined) {
					var orderdate = "NULL";
				} else {
					orderdate = "'" + A_tel[tcnt].orderdate + "'";
				}

				if (25 == cnt) //sql実行
					//sql実行
					{
						sql = "insert into " + ass_tb + " (assetsid,pactid,postid,assetstypeid,productname,property,bought_date,recdate,fixdate,add_edit_flg,reserve_date,exe_state)" + " values (" + assetsid + "," + pactid + "," + A_tel[tcnt].postid + ",1,'" + A_tel[tcnt].machine.replace(/\\\\\'/g, "'") + "','" + A_tel[tcnt].color + "'," + orderdate + ",'" + now + "','" + now + "'," + A_tel[tcnt].add_edit_flg + ",'" + A_tel[tcnt].reserve_date + "'," + A_tel[tcnt].exe_state + ")";
						execFunction(mode, sql, fp);
						sql = "insert into " + rel_tb + " (pactid,telno,carid,assetsid,add_edit_flg,reserve_date,exe_state)" + " values (" + pactid + ",'" + A_tel[tcnt].telno + "'," + A_tel[tcnt].carid + "," + assetsid + "," + A_tel[tcnt].add_edit_flg + ",'" + A_tel[tcnt].reserve_date + "'," + A_tel[tcnt].exe_state + ")";
						execFunction(mode, sql, fp);
					} else //sql実行
					//sql実行
					{
						sql = "insert into " + ass_tb + " (assetsid,pactid,postid,assetstypeid,productname,property,bought_date,recdate,fixdate)" + " values (" + assetsid + "," + pactid + "," + A_tel[tcnt].postid + ",1,'" + A_tel[tcnt].machine.replace(/\\\\\'/g, "'") + "','" + A_tel[tcnt].color + "'," + orderdate + ",'" + now + "','" + now + "')";
						execFunction(mode, sql, fp);
						sql = "insert into " + rel_tb + " (pactid,telno,carid,assetsid)" + " values (" + pactid + ",'" + A_tel[tcnt].telno + "'," + A_tel[tcnt].carid + "," + assetsid + ")";
						execFunction(mode, sql, fp);
					}
			}
	}

	fclose(fp);
}

var logchksql = "select count(pactid) from management_log_tb where pactid=" + pactid + " and mid=1";
var logcnt = GLOBALS.dbh.getOne(logchksql);

if (logcnt < 1) //テーブルをpg_dumpコピー用
	//指定pactだけ抜き出す（リカバリー用）
	//リカバリー用ファイル名
	{
		command = "/usr/local/pgsql/bin/pg_dump -p " + port + " " + G_DB_NAME + " -U postgres -at telmnglog_tb -f " + LOG_DIR + "/telmnglog_tb_copy.sql";
		res = exec(command);
		var tmpfile = PACT_DIR + "/telmnglog_tb_tmp_" + pactid + ".sql";
		command = "/bin/cat " + LOG_DIR + "/telmnglog_tb_copy.sql |grep '^SET ' > " + tmpfile;
		res = exec(command);
		command = "/bin/cat " + LOG_DIR + "/telmnglog_tb_copy.sql |grep '^COPY ' >> " + tmpfile;
		res = exec(command);
		command = "/bin/cat " + LOG_DIR + "/telmnglog_tb_copy.sql |grep '^" + pactid + "\t' >> " + tmpfile;
		res = exec(command);
		var file = PACT_DIR + "/management_log_tb_copy_" + pactid + ".sql";
		fp = fopen(file, "w");
		var A_file = file(tmpfile);

		for (cnt = 0;; cnt < A_file.length; cnt++) {
			if (preg_match("/COPY telmnglog_tb \\(pactid,/", A_file[cnt]) == true) {
				var contents = A_file[cnt].replace(/COPY telmnglog_tb \(pactid, /g, "COPY management_log_tb (mid, pactid, ");
				contents = contents.replace(/ name,/g, " username,");
				contents = contents.replace(/ telno,/g, " manageno, manageno_view,");
				contents = contents.replace(/ telpostid,/g, " trg_postid,");
				contents = contents.replace(/ telpostidaft,/g, " trg_postid_aft,");
				contents = contents.replace(/ carid,/g, " coid,");
				contents = contents.replace(/ telpostname,/g, " trg_postname,");
				contents = contents.replace(/ telpostnameaft,/g, " trg_postname_aft,");
			} else if (preg_match("/^" + pactid + "\t/", A_file[cnt]) == true) //$telno = preg_replace( "/\t|\s|(|)|-/", "", $telno_view );
				//デバッグ用印付き
				{
					contents = preg_replace("/^" + pactid + "\t/", "1\t" + pactid + "\t", A_file[cnt]);
					var tmp = contents.replace(/^([^	]+	){5}/g, "");
					var telno_view = tmp.replace(/	.+$/g, "").trim();
					var telno = telno_view.replace(/	|\s|(|)|-/g, "") + "xyz";
					contents = preg_replace("/\t" + telno_view + "\t/", "\t" + telno + "\t" + telno_view + "\t", contents);
				} else {
				contents = A_file[cnt];
			}

			fwrite(fp, contents);
		}

		fclose(fp);
		command = "/bin/rm -f " + tmpfile;
		res = exec(command);

		if (mode == "d") //ファイルのコピー文を実行
			{
				command = "/usr/local/pgsql/bin/psql " + G_DB_NAME + " -U postgres -f " + file;
				res = exec(command);
			}
	} else {
	fwrite(STDOUT, "WARNING: \u3059\u3067\u306B\u7BA1\u7406\u8A18\u9332\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u3072\u3068\u3064\u4EE5\u4E0A\u3042\u308B\u306E\u3067\u7BA1\u7406\u8A18\u9332\u306F\u79FB\u884C\u3057\u307E\u305B\u3093\u3002\n");
	logging("WARNING: \u3059\u3067\u306B\u7BA1\u7406\u8A18\u9332\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u3072\u3068\u3064\u4EE5\u4E0A\u3042\u308B\u306E\u3067\u7BA1\u7406\u8A18\u9332\u306F\u79FB\u884C\u3057\u307E\u305B\u3093\u3002\n");
}

get_sql = "select colid,colname from tel_property_tb where pactid=" + pactid;
var A_prop = GLOBALS.dbh.getHash(get_sql);

if (A_prop.length > 0) //colidをキー、colnameを値に
	//コンバート用ファイル名
	//コンバート
	{
		var H_prop = Array();

		for (cnt = 0;; cnt < A_prop.length; cnt++) {
			H_prop[A_prop[cnt].colid] = A_prop[cnt].colname;
		}

		var propcnvfile = PACT_DIR + "/convert_management_property_tb_" + pactid + ".sql";
		fp = fopen(propcnvfile, "w");

		for (var key in H_prop) //文字列項目
		{
			var val = H_prop[key];

			if (key >= 1 && key <= 15) {
				var col = "text" + key;
			} else if (key >= 16 && key <= 18) {
				col = "int" + (key - 15);
			} else if (key >= 19 && key <= 20) {
				col = "date" + (key - 18);
			}

			chk_sql = "select count(pactid) from management_property_tb where " + " pactid=" + pactid + " and mid=1 and col='" + col + "'";
			var mcnt = GLOBALS.dbh.getOne(chk_sql);

			if (mcnt < 1) {
				sql = "insert into management_property_tb values (" + pactid + ",1,'" + col + "','" + val + "')";
				execFunction(mode, sql, fp);
			} else {
				fwrite(STDOUT, "WARNING: \u65E2\u306B\u767B\u9332\u6E08\u307F\u306E\u8A2D\u5B9A\u9805\u76EE\u3067\u3059\u3002\t(" + col + "\t" + val + ")\n");
				logging("WARNING: \u65E2\u306B\u767B\u9332\u6E08\u307F\u306E\u8A2D\u5B9A\u9805\u76EE\u3067\u3059\t(" + col + "\t" + val + ")\n");
			}
		}

		fclose(fp);
	}

lock(false, GLOBALS.dbh);
exec("/bin/rm -f /home/web/.pgpass");

if (DEBUG_FLG == 1) //ロールバック
	{
		GLOBALS.dbh.rollback();
	}

fwrite(STDOUT, "START:" + pactname + " \u306E\u30C7\u30FC\u30BF\u3092V3\u7528\u306B\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
logging("START:" + pactname + " \u306E\u30C7\u30FC\u30BF\u3092V3\u7528\u306B\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n");
echo("end:" + date("Y-m-d H:i:s") + "\n");