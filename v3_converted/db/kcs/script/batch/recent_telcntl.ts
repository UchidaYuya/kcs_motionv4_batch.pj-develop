//===========================================================================
//機能：ショップの電話件数カウンターを最新に保つ
//
//作成：	2006/05/19	中西	初版
//2007/01/22	キャリア指定、auを再カウントする
//===========================================================================
//このスクリプトの日本語処理名
//---------------------------------------------------------------------------
//!!!! 文字コード変換の注意 !!!!
//入力データは sjis-win で用意して下さい。
//このスクリプトでは sjis-win -> EUC-JP 変換を行っています。
//コード自動判定を指定してもうまく行かなかったので。。。
//mb_detect_order("sjis-win,EUC-JP,eucjp-win,JIS");
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//DEBUG * 標準出力に出してみる.
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//パラメータチェック
//キャリアID,初期値は空
//デバッグモードOFF
//デフォルトで現在の年月を取得
//$cnt 0 はスクリプト名のため無視
//END 引数の取得
//開始メッセージ
//テーブルＮＯ取得
//テーブル名設定
//print "DEBUG: 対象テーブル:". $telX_tb . "\n";
//pact_tbより登録されている契約ＩＤ、会社名を取得
//////// 全てのPactについてLOOP.
//END Pactごとの処理.
//終了メッセージ
//END Main
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//最新の電話台数を更新する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
error_reporting(E_ALL);
const SCRIPT_NAMEJ = "\u6700\u65B0\u96FB\u8A71\u4EF6\u6570\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8";
const SCRIPTNAME = "recent_telcnt.php";

require("lib/script_db.php");

require("lib/script_log.php");

const LOG_DELIM = " ";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.PutListener(log_listener_type);
log_listener.PutListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var argvCnt = _SERVER.argv.length;

if (argvCnt < 3 || 6 < argvCnt) //数が正しくない
	{
		usage("", dbh);
		throw die(1);
	}

var carid = "";
var debug = false;
var tm = localtime(Date.now() / 1000, true);
var year = tm.tm_year + 1900;
var month = tm.tm_mon + 1;

if (month < 10) {
	var month_str = "0" + month;
} else {
	month_str = month;
}

var billdate = year + month_str;

for (var cnt = 1; cnt < argvCnt; cnt++) //請求年月を取得
{
	if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		{
			billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

			if (ereg("^[0-9]{6}$", billdate) == false) {
				usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			} else //年月チェック
				{
					year = billdate.substr(0, 4);
					month = billdate.substr(4, 2);

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

	if (ereg("^-type=", _SERVER.argv[cnt]) == true) //顧客タイプチェック
		{
			var type_in = ereg_replace("^-type=", "", _SERVER.argv[cnt]).toUpperCase();
			print(type_in + "\n");

			if (ereg("^[MH]", type_in) == false) {
				usage("ERROR: \u9867\u5BA2\u30BF\u30A4\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			}

			continue;
		}

	if (ereg("^-c=", _SERVER.argv[cnt]) == true) //キャリアIDチェック
		{
			carid = ereg_replace("^-c=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^[0-9]+$", carid) == false) {
				usage("ERROR: \u30AD\u30E3\u30EA\u30A2ID\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			}

			continue;
		}

	if (ereg("^-d", _SERVER.argv[cnt]) == true) {
		debug = true;
		continue;
	}

	usage("", dbh);
}

logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "\u51E6\u7406\u958B\u59CB.");
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "pact=" + pactid_in + ", carid=" + carid + ", type=" + type_in);
var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var telX_tb = "tel_" + tableNo + "_tb";
var sql = "select pactid,compname from pact_tb ";
sql += " where type='" + type_in + "' ";

if (!preg_match("/all/i", pactid_in)) {
	sql += "and pactid=" + pactid_in + " ";
}

sql += "order by pactid";
var H_result = dbh.getHash(sql, true);
var pactCnt = H_result.length;
pactCnt = H_result.length;

for (cnt = 0;; cnt < pactCnt; cnt++) //電話台数を更新
{
	var pactid = H_result[cnt].pactid;
	var pactname = H_result[cnt].compname;

	if (debug == true) {
		print("Do: " + pactid + " " + pactname + "\n");
	}

	dbh.begin();
	UpRecentTel(dbh, telX_tb, pactid, carid);
	dbh.commit();
}

logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5B8C\u4E86.");
throw die(0);

function UpRecentTel(O_db, tel_X_tb, pactid, carid) //いったんカウントを削除する
{
	if (!("debug" in global)) debug = undefined;
	var sql = "select tel.cirid, count(tel.telno) from " + tel_X_tb + " tel " + " inner join circuit_tb cir on cir.cirid=tel.cirid";

	if (carid != "") //キャリア指定
		{
			sql += " and cir.carid=" + carid;
		}

	sql += " where tel.pactid=" + pactid + " and tel.telno not in " + "(select telno from dummy_tel_tb dmy where dmy.pactid=" + pactid + " and tel.carid=dmy.carid ";

	if (carid != "") //キャリア指定
		{
			sql += " and dmy.carid=" + carid;
		}

	sql += ")" + " group by tel.cirid";
	var H_recent = O_db.getHash(sql);
	var del_sql = "delete from recent_telcnt_tb where pactid=" + pactid;

	if (carid != "") //キャリア指定
		{
			del_sql += " and cirid in (select cirid from circuit_tb where carid=" + carid + ")";
		}

	if (debug == false) {
		O_db.query(del_sql);
	}

	for (var recent_row of Object.values(H_recent)) {
		var circuit = recent_row.cirid;
		var telcnt = recent_row.count;

		if (telcnt != 0) {
			var ins_sql = "insert into recent_telcnt_tb(pactid,cirid,telcnt) " + "values(" + pactid + "," + circuit + "," + telcnt + ")";

			if (debug == false) {
				O_db.query(ins_sql);
			} else {
				print(ins_sql + "\n");
			}
		}
	}
};

function usage(comment, db) {
	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -y=YYYYMM -p={all|PACTID} -type={M|H} [-c=carid] [-d]\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-type \u9867\u5BA2\u30BF\u30A4\u30D7\t(M:\u65E2\u5B58Motion\u578B,H:Hotline\u578B)\n");
	print("\t\t-c \u30AD\u30E3\u30EA\u30A2\u6307\u5B9A\t(\u7701\u7565\u6642\u306B\u306F\u5168\u30AD\u30E3\u30EA\u30A2)\n");
	print("\t\t-d \u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9\t(\u4ED8\u3051\u305F\u5834\u5408\u3001\u5B9F\u969B\u306E\u51E6\u7406\u3092\u884C\u308F\u306A\u3044)\n");
	throw die(1);
};