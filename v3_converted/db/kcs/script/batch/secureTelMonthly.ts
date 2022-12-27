//===========================================================================
//セキュア電話帳月時バッチ
//
//作成日：2006/04/21
//作成者：大城
//
//更新履歴：2006/05/09		メール送信部分を関数化
//2006/05/11		use_month_dateをtextにした事にともなう修正
//2006/05/13		DBのバックアップを引数で指定できるように修正
//2006/05/30		DB定義が変わった事に伴う修正（seucre_tb,secure_history_tbに電話viewカラムが追加）
//2006/07/25		DB定義が変わった事に伴う修正（iAPLパスワード、認証方法カラムが追加）
//===========================================================================
//require_once("/kcs/script/batch/lib/TableMake.php");
//メール送信先変数
//define("MAIL_TO","ooshiro@motion.co.jp");
//ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//処理開始をログ出力
//契約ＩＤ
//エラーメール送信メッセージ
//パラメータチェック
//数が正しくない
//現在の年、月
//現在の日付
//現在の年月
//ファイル用日付変数
//現在の時間
//２４ヶ月前の日付を取得
//テーブルメイクオブジェクトの作成
/////////////////////////////////////////////////////////
//[-d]パラメータがＤＢバックを取る"y"ならバックアップをとる
////////////////////////////////////////////////////////
//同じ月のレコードがある場合、insertエラーになるので、当月のレコードを削除する
//契約ＩＤ指定がある場合条件を追加
//エラー処理してたらログに書き込み
//セキュア電話帳（secure_tb）に入ってるすべてのレコードをセキュア利用履歴テーブル(sucure_history_tb)に入れる
//契約ＩＤ指定がある場合条件を追加
//secure_tbのレコード数
//挿入文カウントよう変数
//COPY関数で配列の各行をいれる
//失敗してたら
///////////////////////////////////////////////////////////
//セキュア履歴テーブルの25ヶ月以前のレコードの削除
//////////////////////////////////////////////////////////
//エラー処理してたらログに書き込み
/////////////////////////////////////////////////////
//secure_charge_tb に今月分の単価、合計をいれる
////////////////////////////////////////////////////
//secure_pact_tbから全件取得。
//同じ月のレコードがある場合、insertエラーになるので、当月のレコードを削除する
//契約ＩＤ指定がある場合条件を追加
//エラー処理してたらログに書き込み
//pactの使用月のＩＰステータスとポストＩＤでまとめた内容を取得
//契約ＩＤ指定がある場合条件を追加
//レコードの数
//COPY文挿入用配列で使うカウント用変数を初期化
//inner join でセキュア履歴テーブルにレコードがあるレコードのみ処理
//契約ＩＤ指定がある場合条件を追加
///////////////////////////////////////////////////////////////
//削除ステータスのレコードの削除・修正処理
///////////////////////////////////////////////////////////////
//まずは会社と会社のユーザーフラグを取得
//契約ＩＤ指定がある場合条件を追加
//会社毎に処理
///////////////////////////////////////////////////////////////////////////////
//セキュア電話帳テーブルのＩＰステータスが「利用停止」のレコードを空にする
///////////////////////////////////////////////////////////////////////////////
//secure_tbのＩＰステータスが２のレコードをブランクにする
//契約ＩＤ指定がある場合条件を追加
//エラー処理してたらログに書き込み
///////////////////////////////////////////////////////////
//ASP利用料対象企業のセキュア電話帳の料金を追加する
//////////////////////////////////////////////////////////
//対象企業(pactid)がASP利用料対象企業なら、対象電話のtel_details_XX_tbに
//セキュア電話帳の料金を追加する
//まずパクトＩＤを全件取得する
//契約ＩＤ指定がある場合条件を追加
//企業毎に関数を流す
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//////////////////////////////////////////////////////////////////////
//機能: 対象企業(pactid)がASP利用料対象企業なら、対象電話のtel_details_XX_tbに
//セキュア電話帳の料金を追加する
//引数: pactid
//請求年月
//DBハンドル
//返値: 正常：true　エラー:false
//作成日: 2006/04/25	by 上杉顕一郎
//更新日:
//////////////////////////////////////////////////////////////////////
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ローカルのログを出力する
//[引　数] $lstr：出力する文字列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//////////////////////////////////////////////////////////////////////
//機能: ＡＳＰ利用料表示設定があるかないか
//引数: pactid
//DBハンドル
//返値: ある：true、ない：false
//////////////////////////////////////////////////////////////////////
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

require("Mail.php");

const DEBUG = 1;
const LOG_DELIM = " ";
const SCRIPTNAME = "SecureTelMonthly.php";
const SMTP_HOST = "192.168.1.197";
const SCR_HIS_TB = "secure_history_tb";
const SCR_TB = "secure_tb";
const SCR_PAC_TB = "secure_pact_tb";
const SCR_CH_TB = "secure_charge_tb";
const TEL_TB = "tel_tb";
const PACT_TB = "pact_tb";
const SCR_RES_TB = "secure_reserve_tb";
const MAIL_TO = "batch_error@kcs-next-dev.com";
var dbLogFile = G_LOG + "/SecureTelMonthly.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u6708\u6B21\u51E6\u7406\u958B\u59CB");
logh.putError(G_SCRIPT_BEGIN, "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u6708\u6642\u51E6\u7406\u958B\u59CB");
var pactid = "";
var errMailMsg = "";

if (_SERVER.argv.length != 3) {
	usage("");
} else //$argvCounter 0 はスクリプト名のため無視
	{
		var argvCnt = _SERVER.argv.length;

		for (var argvCounter = 1; argvCounter < argvCnt; argvCounter++) //契約ＩＤを取得
		{
			if (ereg("^-p=", _SERVER.argv[argvCounter]) == true) //契約ＩＤチェック
				{
					pactid = ereg_replace("^-p=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("\u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-d=", _SERVER.argv[argvCounter]) == true) //契約ＩＤチェック
				//if((ereg("^all$", $pactid) == false) && (ereg("^[0-9]+$", $pactid) == false)){
				{
					var db_backup = ereg_replace("^-d=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^y$", db_backup) == false && ereg("^n$", db_backup) == false) {
						usage("DB\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}
		}
	}

var now_year = date("Y");
var now_month = date("m");
var now_date = date("d");
var now_hour = date("H");
var now_minuts = date("i");
var now_seconds = date("s");
var now_yyyymmdd = date("Y-m-d", mktime(0, 0, 0, now_month - 1, 1, now_year));
var now_yyyymm = date("Ym", mktime(0, 0, 0, now_month - 1, 1, now_year));
var file_date = now_year + now_month + now_date + now_hour + now_minuts + now_seconds;
var now_yyyymmddhhmmss = now_year + "-" + now_month + "-" + now_date + " " + now_hour + ":" + now_minuts + ":" + now_seconds;
var twenty_five_ago = date("Ym", mktime(0, 0, 0, now_month - 24, 1, now_year));
var O_tblmk = new TableNo();
var this_yymm = O_tblmk.get(now_year, now_month);
var tel_x_tb = "tel_" + this_yymm + "_tb";

if (db_backup == "y") //DBのバックアップを取る
	//secure_tbのバックアップファイル名
	//secure_pact_tbのバックアップファイル名
	//tel_tbのバックアップファイル名
	//try-kcsv2になってたので本番用に修正した 20060901miya
	{
		if (DEBUG) logging("INFO:\uFF24\uFF22\u306E\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3092\u958B\u59CB\u3057\u307E\u3059\u3002\n");
		var scr_filename = DATA_EXP_DIR + "scr_tb.dat_" + file_date;
		var scrp_filename = DATA_EXP_DIR + "scr_pac_tb.dat_" + file_date;
		var scrh_filename = DATA_EXP_DIR + "scr_hist_tb.dat_" + file_date;
		var tel_filename = DATA_EXP_DIR + "tel_tb.dat_" + file_date;
		var scrr_filename = DATA_EXP_DIR + "secure_reserve_tb.dat_" + file_date;
		exec("pg_dump -at " + SCR_TB + " kcsv2 > " + scr_filename);
		exec("pg_dump -at " + SCR_PAC_TB + " kcsv2 > " + scrp_filename);
		exec("pg_dump -at " + SCR_HIS_TB + " kcsv2 > " + scrh_filename);
		exec("pg_dump -at " + TEL_TB + " kcsv2 > " + tel_filename);
		exec("pg_dump -at secure_reserve_tb kcsv2 > " + scrr_filename);
		if (DEBUG) logging("INFO:\uFF24\uFF22\u3092\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u307E\u3057\u305F\u3002");
		logh.putError(G_SCRIPT_INFO, "\uFF24\uFF22\u3092\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u307E\u3057\u305F\u3002");
	}

if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30C6\u30FC\u30D6\u30EB\u306E\u30EC\u30B3\u30FC\u30C9\u3092\u30BB\u30AD\u30E5\u30A2\u5C65\u6B74\u30C6\u30FC\u30D6\u30EB\u306B\u633F\u5165\u3059\u308B\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059\u3002");
dbh.begin();
var del_his_tb = " DELETE FROM " + SCR_HIS_TB + " WHERE use_month_date='" + now_yyyymm + "'";

if (pactid != "" && pactid != "all") {
	del_his_tb = del_his_tb + " AND pactid = " + pactid;
}

var re_del_his = dbh.query(del_his_tb, false);

if ("object" === typeof re_del_his == true) {
	dbh.rollback();
	errMailMsg = "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5C65\u6B74\u30C6\u30FC\u30D6\u30EB\u306E\u5F53\u6708\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
	if (DEBUG) logging("ERROR:" + errMailMag);
	sendErrMail(errMailMsg);
	logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + errMailMsg + re_del_his.userinfo + "SQL:" + del_his_tb);
} else {
	logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5C65\u6B74\u30C6\u30FC\u30D6\u30EB\u306E\u5F53\u6708\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u5B8C\u4E86\u3002");
	if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5C65\u6B74\u30C6\u30FC\u30D6\u30EB\u306E\u5F53\u6708\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u5B8C\u4E86\u3002");
}

var get_select = "SELECT telno,pactid,carid,user_id,user_password";
get_select += ",ip_phone_number,ip_phone_pass,terminal_id";
get_select += ",forward_pnumber2,forward_pnumber3,forward_pnumber4";
get_select += ",forward_pnumber5,forward_pnumber6";
get_select += ",status,secstartdate,fixdate,ip_status";
get_select += ",ip_phone_number_view,forward_pnumber2_view";
get_select += ",forward_pnumber3_view,forward_pnumber4_view";
get_select += ",forward_pnumber5_view,forward_pnumber6_view,iapl_password,authenticate_type";
get_select += " FROM " + SCR_TB;

if (pactid != "" && pactid != "all") {
	get_select = get_select + " WHERE pactid = " + pactid;
}

var H_gotsql = dbh.getHash(get_select, false);
var cnt_scr = H_gotsql.length;
var cnt_arr = 0;

for (var next = 0; next < cnt_scr; next++) //statusがnullの時はnullをインサートする
//予約日がない場合はnullをいれる
//最終更新日
//配列に入れる
{
	var f_write_str = "";
	f_write_str = now_yyyymm + "\t" + H_gotsql[next].telno + "\t" + H_gotsql[next].pactid + "\t";
	f_write_str += H_gotsql[next].carid + "\t" + H_gotsql[next].user_id + "\t";
	f_write_str += H_gotsql[next].user_password + "\t" + H_gotsql[next].ip_phone_number + "\t";
	f_write_str += H_gotsql[next].ip_phone_pass + "\t" + H_gotsql[next].terminal_id + "\t";
	f_write_str += H_gotsql[next].forward_pnumber2 + "\t";
	f_write_str += H_gotsql[next].forward_pnumber3 + "\t" + H_gotsql[next].forward_pnumber4 + "\t";
	f_write_str += H_gotsql[next].forward_pnumber5 + "\t" + H_gotsql[next].forward_pnumber6 + "\t";

	if (H_gotsql[next].status == undefined) {
		f_write_str += "\\N\t";
	} else {
		f_write_str += H_gotsql[next].status + "\t";
	}

	if (H_gotsql[next].secstartdate == undefined) {
		f_write_str += "\\N\t";
	} else {
		f_write_str += H_gotsql[next].secstartdate + "\t";
	}

	f_write_str += now_yyyymmddhhmmss + "\t";

	if (H_gotsql[next].ip_status == undefined) {
		f_write_str += "\\N\t";
	} else {
		f_write_str += H_gotsql[next].ip_status + "\t";
	}

	f_write_str += H_gotsql[next].ip_phone_number_view + "\t";
	f_write_str += H_gotsql[next].forward_pnumber2_view + "\t";
	f_write_str += H_gotsql[next].forward_pnumber3_view + "\t" + H_gotsql[next].forward_pnumber4_view + "\t";
	f_write_str += H_gotsql[next].forward_pnumber5_view + "\t" + H_gotsql[next].forward_pnumber6_view + "\t";
	f_write_str += H_gotsql[next].iapl_password + "\t" + H_gotsql[next].authenticate_type;
	A_ist_arr[next] = f_write_str;
}

var re_copy_d = pg_copy_from(dbh.m_db.connection, SCR_HIS_TB, A_ist_arr);

if (re_copy_d == false) {
	dbh.rollback();
	errMailMsg = "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5C65\u6B74\u633F\u5165\u30A8\u30E9\u30FC \u3002";
	if (DEBUG) logging("ERROR:" + errMailMsg);
	sendErrMail(errMailMsg);
	logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + errMailMsg);
} else {
	logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5C65\u6B74\u633F\u5165\u5B8C\u4E86");
	if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5C65\u6B74\u633F\u5165\u5B8C\u4E86");
}

dbh.commit();
dbh.begin();
if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u5C65\u6B74\u30C6\u30FC\u30D6\u30EB\u306E25\u30F6\u6708\u4EE5\u524D\u306E\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u3092\u958B\u59CB\u3002");
var del_history = "DELETE FROM " + SCR_HIS_TB + " WHERE use_month_date < '" + twenty_five_ago + "'";
var res_delhis = dbh.query(del_history, false);

if ("object" === typeof res_delhis == true) {
	errMailMsg = "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5C65\u6B74\u30C6\u30FC\u30D6\u30EB\u306E25\u30F6\u6708\u524D\u306E\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
	if (DEBUG) logging("ERROR:" + errMailMsg);
	sendErrMail(errMailMsg);
	logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + errMailMsg + res_delhis.userinfo + "SQL:" + del_history);
} else {
	logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5C65\u6B74\u30C6\u30FC\u30D6\u30EB\u306E25\u30F6\u6708\u524D\u306E\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u5B8C\u4E86\u3002");
	if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5C65\u6B74\u30C6\u30FC\u30D6\u30EB\u306E25\u30F6\u6708\u524D\u306E\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u5B8C\u4E86\u3002");
}

dbh.commit();
if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u904E\u53BB\u5206\u4F7F\u7528\u30C6\u30FC\u30D6\u30EB\u306B\u4ECA\u6708\u5206\u306E\u5358\u4FA1\u3001\u5408\u8A08\u3092\u3044\u308C\u308B\u3002");
dbh.begin();
var del_ch_tb = " DELETE FROM " + SCR_CH_TB + " WHERE use_month_date='" + now_yyyymm + "'";

if (pactid != "" && pactid != "all") {
	del_ch_tb = del_ch_tb + " AND pactid = " + pactid;
}

var res_del_ch = dbh.query(del_ch_tb, false);

if ("object" === typeof res_del_ch == true) {
	dbh.rollback();
	errMailMsg = "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u904E\u53BB\u5229\u7528\u5206\u30C6\u30FC\u30D6\u30EB\u306E\u5F53\u6708\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
	if (DEBUG) logging("ERROR:" + errMailMsg);
	sendErrMail(errMailMsg);
	logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + errMailMsg + res_delhis.userinfo + "SQL:" + del_history);
} else {
	logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u904E\u53BB\u5229\u7528\u5206\u30C6\u30FC\u30D6\u30EB\u306E\u5F53\u6708\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002");
	if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u904E\u53BB\u5229\u7528\u5206\u30C6\u30FC\u30D6\u30EB\u306E\u5F53\u6708\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002");
}

var select_pac = "SELECT sht.pactid,sht.status,sht.ip_status,tlx.postid,count(tlx.postid) AS cnt_all";
select_pac += " FROM " + SCR_HIS_TB + " sht INNER JOIN " + tel_x_tb + " tlx";
select_pac += " ON sht.telno=tlx.telno AND sht.carid = tlx.carid AND sht.pactid=tlx.pactid ";
select_pac += " WHERE sht.use_month_date='" + now_yyyymm + "'";

if (pactid != "" && pactid != "all") {
	select_pac = select_pac + " AND sht.pactid = " + pactid;
}

select_pac += " GROUP BY sht.pactid,sht.status,sht.ip_status,tlx.postid ORDER BY tlx.postid";
if (DEBUG) logging("INFO:" + select_pac);
var H_rec = dbh.getHash(select_pac, false);
var cnt_status = H_rec.length;
var cnt_arr_pact = 0;
var get_pact = "SELECT scp.pactid,scp.charge,scp.call FROM " + SCR_PAC_TB + " scp ";
get_pact += " INNER JOIN " + SCR_HIS_TB + " sch ON ";
get_pact += " scp.pactid=sch.pactid ";

if (pactid != "" && pactid != "all") {
	get_pact = get_pact + " WHERE scp.pactid = " + pactid;
}

get_pact += " GROUP BY scp.pactid,scp.charge,scp.call ";
var H_pac_ch = dbh.getHash(get_pact, false);
var cnt_pac = H_pac_ch.length;

if (cnt_pac != 0) //pactidの数だけループ
	{
		var H_pacts = Array();

		for (next = 0;; next < cnt_pac; next++) //pactの使用月のステータス、ＩＰステータスとポストＩＤでまとめた内容を取得
		{
			select_pac = "SELECT sht.status,sht.ip_status,tlx.postid,count(tlx.postid) AS cnt_all";
			select_pac += " FROM " + SCR_HIS_TB + " sht INNER JOIN " + tel_x_tb + " tlx";
			select_pac += " ON sht.telno=tlx.telno AND sht.carid = tlx.carid AND sht.pactid=tlx.pactid ";
			select_pac += " WHERE sht.pactid=" + H_pac_ch[next].pactid + " AND sht.status IS NOT NULL AND sht.use_month_date='" + now_yyyymm + "'";
			select_pac += " GROUP BY sht.status,sht.ip_status,tlx.postid ORDER BY tlx.postid";
			H_rec = dbh.getHash(select_pac, false);
			cnt_status = H_rec.length;

			if (cnt_status != 0) //ポストＩＤをキーにした配列をつくる。
				{
					for (var next_st = 0; next_st < cnt_status; next_st++) //配列のキーが無ければ初期化する
					//セキュア電話帳利用数
					//ステータスが1なら、セキュア電話帳利用停止除外数に足す
					//次の要素があれば変数に代入
					{
						if (H_rec[next_st].postid + "_scr" in H_pacts == false) {
							H_pacts[H_rec[next_st].postid + "_scr"] = 0;
						}

						if (H_rec[next_st].postid + "_scr_wo_st" in H_pacts == false) {
							H_pacts[H_rec[next_st].postid + "_scr_wo_st"] = 0;
						}

						if (H_rec[next_st].postid + "_ip" in H_pacts == false) {
							H_pacts[H_rec[next_st].postid + "_ip"] = 0;
						}

						if (H_rec[next_st].postid + "_ip_wo_st" in H_pacts == false) {
							H_pacts[H_rec[next_st].postid + "_ip_wo_st"] = 0;
						}

						H_pacts[H_rec[next_st].postid + "_scr"] += H_rec[next_st].cnt_all;

						if (H_rec[next_st].status == 1 or H_rec[next_st].status == 2) {
							H_pacts[H_rec[next_st].postid + "_scr_wo_st"] += H_rec[next_st].cnt_all;
						}

						if (H_rec[next_st].ip_status != undefined) {
							if (H_rec[next_st].ip_status == 1) {
								H_pacts[H_rec[next_st].postid + "_ip_wo_st"] += H_rec[next_st].cnt_all;
							}

							H_pacts[H_rec[next_st].postid + "_ip"] += H_rec[next_st].cnt_all;
						}

						if (H_pacts[H_rec[next_st].postid + "_ip"] == "") {
							H_pacts[H_rec[next_st].postid + "_ip"] = 0;
						}

						if (H_pacts[H_rec[next_st].postid + "_scr_wo_st"] == "") {
							H_pacts[H_rec[next_st].postid + "_scr_wo_st"] = 0;
						}

						if (H_pacts[H_rec[next_st].postid + "_ip_wo_st"] == "") {
							H_pacts[H_rec[next_st].postid + "_ip_wo_st"] = 0;
						}

						var chk_next_arr = 0;

						if (next_st + 1 in H_rec == true) {
							chk_next_arr = H_rec[next_st + 1].postid;
						}

						if (H_rec[next_st].postid != chk_next_arr) //タブ区切りで変数にする
							//配列にいれる
							//配列のカウントを増やす
							//配列を初期化する
							{
								var f_write_ch = now_yyyymm + "\t" + H_pac_ch[next].pactid + "\t" + H_rec[next_st].postid + "\t";
								f_write_ch += H_pacts[H_rec[next_st].postid + "_scr"] + "\t" + H_pac_ch[next].charge + "\t";
								f_write_ch += H_pacts[H_rec[next_st].postid + "_ip"] + "\t" + H_pac_ch[next].call + "\t";
								f_write_ch += H_pacts[H_rec[next_st].postid + "_scr_wo_st"] + "\t";
								f_write_ch += H_pacts[H_rec[next_st].postid + "_ip_wo_st"] + "\n";
								A_ist_pact[cnt_arr_pact] = f_write_ch;
								cnt_arr_pact += 1;
								H_pacts[H_rec[next_st].postid + "_scr"] = 0;
								H_pacts[H_rec[next_st].postid + "_ip"] = 0;
								H_pacts[H_rec[next_st].postid + "_scr_wo_st"] = 0;
								H_pacts[H_rec[next_st].postid + "_ip_wo_st"] = 0;
							}
					}
				}
		}

		var counter_arr = A_ist_pact.length;

		if (counter_arr != 0) //直接いれる
			//エラー処理してたらログに書き込み
			{
				var res_cpfile_ch = pg_copy_from(dbh.m_db.connection, SCR_CH_TB, A_ist_pact);

				if (res_cpfile_ch == false) {
					dbh.rollback();
					errMailMsg = "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u904E\u53BB\u4F7F\u7528\u5206\u633F\u5165\u30A8\u30E9\u30FC \n";
					if (DEBUG) logging("ERROR:" + errMailMsg);
					sendErrMail(errMailMsg);
					logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + errMailMsg + res_cpfile_ch.userinfo);
				} else {
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u904E\u53BB\u4F7F\u7528\u5206\u633F\u5165\u5B8C\u4E86");
					if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u904E\u53BB\u4F7F\u7528\u5206\u633F\u5165\u5B8C\u4E86");
				}
			}
	}

dbh.commit();
if (DEBUG) logging("INFO:\u524A\u9664\u30B9\u30C6\u30FC\u30BF\u30B9\u306E\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u30FB\u4FEE\u6B63\u51E6\u7406\u306E\u958B\u59CB\n");
dbh.begin();
var select_pacts = "SELECT pactid,v2userflg FROM " + SCR_PAC_TB;

if (pactid != "" && pactid != "all") {
	select_pacts = select_pacts + " WHERE pactid = " + pactid;
}

H_pacts = dbh.getHash(select_pacts);
var count_pacts = H_pacts.length;

for (var cnt_pact = 0; cnt_pact < count_pacts; cnt_pact++) //とりあえず全部のステータスが削除のレコードをとる
//セキュア電話帳削除のＳＱＬ
//セキュア電話帳ステータス変更のＳＱＬ
//セキュア電話帳の削除ステータスを削除する
{
	var select_scr = "SELECT telno,carid FROM " + SCR_TB + " WHERE status=3 AND pactid =" + H_pacts[cnt_pact].pactid;
	var H_alltelno = dbh.getHash(select_scr);
	var count_telno = H_alltelno.length;
	var delete_scr = "DELETE FROM " + SCR_TB + " WHERE status=3 AND pactid =" + H_pacts[cnt_pact].pactid + " AND(";
	var update_scr = "UPDATE " + SCR_TB + " set status=null WHERE status=3 AND pactid=" + H_pacts[cnt_pact].pactid + " AND(";
	var del_tel = "DELETE FROM " + TEL_TB + " where pactid=" + H_pacts[cnt_pact].pactid + " AND(";
	var counter_delscr = 0;
	var counter_upscr = 0;
	var counter_deltel = 0;

	for (var cnt_tel = 0; cnt_tel < count_telno; cnt_tel++) //予約テーブルにレコードがあるか確認
	//予約テーブルに予約がある時
	{
		var select_reserve = "SELECT count(telno) as telcnt FROM secure_reserve_tb ";
		select_reserve += " WHERE telno='" + H_alltelno[cnt_tel].telno + "' AND carid=" + H_alltelno[cnt_tel].carid;
		var cnt_reserve = dbh.getOne(select_reserve);

		if (cnt_reserve > 0) {
			if (counter_upscr != 0) {
				update_scr += " OR ";
			}

			update_scr += " ( telno ='" + H_alltelno[cnt_tel].telno + "' AND ";
			update_scr += " carid =" + H_alltelno[cnt_tel].carid + ")";
			counter_upscr += 1;
		} else //セキュアテーブルのレコードを削除
			{
				if (counter_delscr != 0) {
					delete_scr += " OR ";
				}

				delete_scr += " ( telno ='" + H_alltelno[cnt_tel].telno + "' AND ";
				delete_scr += " carid =" + H_alltelno[cnt_tel].carid + ")";
				counter_delscr += 1;
				if (DEBUG) logging(H_pacts[cnt_pact].v2userflg + "\n");

				if (H_pacts[cnt_pact].v2userflg == "f") {
					if (counter_deltel != 0) {
						del_tel += " OR ";
					}

					del_tel += " ( telno ='" + H_alltelno[cnt_tel].telno + "' AND ";
					del_tel += " carid =" + H_alltelno[cnt_tel].carid + ")";
					counter_deltel += 1;
				}
			}
	}

	delete_scr += " )";
	update_scr += " )";
	del_tel += ")";

	if (counter_delscr > 0) //エラー処理してたらログに書き込み
		{
			if (DEBUG) logging(delete_scr);
			var res_scr = dbh.query(delete_scr, false);

			if ("object" === typeof res_scr == true) {
				dbh.rollback();
				errMailMsg = "\u524A\u9664\u30B9\u30C6\u30FC\u30BF\u30B9\u306E\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3059\u308B\u306E\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u4F1A\u793E\uFF29\uFF24:" + H_pacts[cnt_pact].pactid + "\n";
				if (DEBUG) logging("ERROR:" + errMailMsg + delete_scr);
				sendErrMail(errMailMsg);
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + errMailMsg + delete_scr.userinfo + "SQL:" + update_dl_st);
			} else {
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u524A\u9664\u30B9\u30C6\u30FC\u30BF\u30B9\u306E\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002");
				if (DEBUG) logging("INFO:\u524A\u9664\u30B9\u30C6\u30FC\u30BF\u30B9\u306E\u30EC\u30B3\u30FC\u30C9\u3067\u4E88\u7D04\u65E5\u304C\u3042\u308B\u30EC\u30B3\u30FC\u30C9\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002\u4F1A\u793E\uFF29\uFF24:" + H_pacts[cnt_pact].pactid + "\n");
			}
		}

	if (counter_upscr > 0) //エラー処理してたらログに書き込み
		{
			if (DEBUG) logging(update_scr);
			var res_up = dbh.query(update_scr, false);

			if ("object" === typeof res_up == true) {
				dbh.rollback();
				errMailMsg = "\u524A\u9664\u30B9\u30C6\u30FC\u30BF\u30B9\u306E\u30EC\u30B3\u30FC\u30C9\u3067\u4E88\u7D04\u65E5\u304C\u3042\u308B\u30EC\u30B3\u30FC\u30C9\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u306E\u5909\u66F4\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u4F1A\u793E\uFF29\uFF24:" + H_pacts[cnt_pact].pactid + "\n";
				if (DEBUG) logging("ERROR:" + errMailMsg + update_scr);
				sendErrMail(errMailMsg);
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + errMailMsg + update_scr.userinfo + "SQL:" + update_scr);
			} else {
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u524A\u9664\u30B9\u30C6\u30FC\u30BF\u30B9\u306E\u30EC\u30B3\u30FC\u30C9\u3067\u4E88\u7D04\u65E5\u304C\u3042\u308B\u30EC\u30B3\u30FC\u30C9\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002\u4F1A\u793E\uFF29\uFF24\uFF1A" + H_pacts[cnt_pact].pactid + "\n");
				if (DEBUG) logging("INFO:\u524A\u9664\u30B9\u30C6\u30FC\u30BF\u30B9\u306E\u30EC\u30B3\u30FC\u30C9\u3067\u4E88\u7D04\u65E5\u304C\u3042\u308B\u30EC\u30B3\u30FC\u30C9\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4\u3057\u307E\u3057\u305F\u3002");
			}
		}

	if (counter_deltel > 0) //tel_tb delete SQL実行
		//エラー処理してたらログに書き込み
		{
			var res_deltel = dbh.query(del_tel, false);

			if ("object" === typeof res_deltel == true) {
				dbh.rollback();
				errMailMsg = "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u306E\u307F\u3054\u5229\u7528\u306E\u304A\u5BA2\u69D8\u306Etel_tb\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u4F1A\u793E\uFF29\uFF24:" + H_pacts[cnt_pact].pactid + "\n";
				if (DEBUG) logging("ERROR:" + errMailMsg + delete_teltb);
				sendErrMail(errMailMsg);
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + errMailMsg + update_scr.userinfo + "SQL:" + delete_teltb);
			} else {
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u306E\u307F\u3054\u5229\u7528\u306E\u304A\u5BA2\u69D8\u306Etel_tb\u306E\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002\n");
				if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u306E\u307F\u3054\u5229\u7528\u306E\u304A\u5BA2\u69D8\u306Etel_tb\u306E\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002\u4F1A\u793E\uFF29\uFF24\uFF1A" + H_pacts[cnt_pact].pactid + "\n");
			}
		}
}

dbh.commit();
dbh.begin();
var update_ip_st = "UPDATE " + SCR_TB + " set ip_status = NULL WHERE ip_status = 2";

if (pactid != "" && pactid != "all") {
	update_ip_st = update_ip_st + " AND pactid = " + pactid;
}

var res_upst = dbh.query(update_ip_st);

if ("object" === typeof res_upst == true) {
	dbh.rollback();
	errMailMsg += "\uFF29\uFF30\u30B9\u30C6\u30FC\u30BF\u30B9\u304C\u505C\u6B62\u4E2D\u306E\u30EC\u30B3\u30FC\u30C9\u306E\u521D\u671F\u5316\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u30A8\u30E9\u30FC\n";
	if (DEBUG) logging("ERROR:" + errMailMsg);
	sendErrMail(errMailMsg);
	logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + errMailMsg + res_upst.userinfo + "SQL:" + update_ip_st);
} else {
	logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\uFF29\uFF30\u30B9\u30C6\u30FC\u30BF\u30B9\u304C\u505C\u6B62\u4E2D\u306E\u30EC\u30B3\u30FC\u30C9\u3092\u521D\u671F\u5316\u3057\u307E\u3057\u305F\u3002\n");
	if (DEBUG) logging("INFO: \uFF29\uFF30\u30B9\u30C6\u30FC\u30BF\u30B9\u304C\u505C\u6B62\u4E2D\u306E\u30EC\u30B3\u30FC\u30C9\u3092\u521D\u671F\u5316\u3057\u307E\u3057\u305F\u3002\n");
}

dbh.commit();
var sql_pact = "SELECT pactid FROM " + SCR_PAC_TB;

if (pactid != "" && pactid != "all") {
	sql_pact = sql_pact + " WHERE pactid = " + pactid;
}

var H_allpact = dbh.getHash(sql_pact);
cnt_pact = H_allpact.length;

for (var next_pac = 0; next_pac < cnt_pact; next_pac++) {
	if (DEBUG) logging("INFO: \u5BFE\u8C61\u4F01\u696D\u306E\u30D1\u30AF\u30C8\uFF29\uFF24" + H_allpact[next_pac].pactid);
	var res_telde = insert_teldetails(H_allpact[next_pac].pactid, now_year, now_month, dbh);

	if (res_telde == false) {
		errMailMsg = "\u5BFE\u8C61\u96FB\u8A71\u306Etel_details_" + this_yymm + "_tb\u306B\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u306E\u6599\u91D1\u3092\u8FFD\u52A0\u3059\u308B\u306E\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u30A8\u30E9\u30FC \n";
		if (DEBUG) logging("ERROR: \u5BFE\u8C61\u4F01\u696D\u306E\u30D1\u30AF\u30C8\uFF29\uFF24" + H_allpact[next_pac].pactid);
		sendErrMail(errMailMsg);
		logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + errMailMsg);
	}
}

logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u5BFE\u8C61\u96FB\u8A71\u306Etel_details_XX_tb\u306B\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u306E\u6599\u91D1\u3092\u8FFD\u52A0\u3059\u308B\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F \n");
logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u6708\u6B21\u30D0\u30C3\u30C1\u304C\u6B63\u5E38\u306B\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002\n");
if (DEBUG) logging("INFO:\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u6708\u6B21\u30D0\u30C3\u30C1\u304C\u6B63\u5E38\u306B\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002");

function sendErrMail(err_str) //文字化けしてたので修正 20060901miya
//$message = mb_convert_encoding($err_str, "JIS", "EUC-JP");
{
	var O_mail = Mail.factory("smtp", {
		host: SMTP_HOST,
		port: G_SMTP_PORT
	});
	var to = "batch_error@kcs-next-dev.com";
	to = MAIL_TO;
	var from = "batch@kcs-next-dev.com";
	var subject = "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u6708\u6642\u51E6\u7406\u30A8\u30E9\u30FC\u5831\u544A(\u672C\u756A\u74B0\u5883)";
	subject = mb_convert_encoding(subject, "JIS", "EUC-JP");
	var H_headers = {
		Date: date("r"),
		To: to,
		From: from
	};
	H_headers.To = "=?ISO-2022-JP?B?" + base64_encode(mb_convert_encoding(to, "JIS")) + "?=<" + to + ">";
	H_headers.From = "=?ISO-2022-JP?B?" + base64_encode(mb_convert_encoding(from, "JIS")) + "?=<" + from + ">";
	H_headers.Subject = "=?ISO-2022-JP?B?" + base64_encode(mb_convert_encoding(subject, "JIS")) + "?=";
	var message = mb_convert_encoding(err_str, "SJIS-WIN", "EUC-JP");
	H_headers["Return-Path"] = from;
	H_headers["MIME-Version"] = "1.0";
	H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP";
	H_headers["Content-Transfer-Encoding"] = "7bit";
	H_headers["X-Mailer"] = "Motion Mailer v2";
	var rval = O_mail.send([to], H_headers, message);
};

function usage(comment) {
	if (!("dbh" in global)) dbh = undefined;

	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + SCRIPTNAME + " -p={all|PACTID}\n");
	print("\t -p \u5951\u7D04\uFF29\uFF24\t \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t -d DB\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7   (y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,n:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw die(1);
};

function insert_teldetails(pactid, targetYY, targetMM, db) //現在の時間を取得
//ここを修正
//$targetYYMM = $targetYY . $targetMM;
//DBハンドルの確認
//$tarTblNo = $O_tblmk->getTableNo(substr($targetYYMM, 0, 4),substr($targetYYMM, 4, 2),false);
//$tarTblNo = $O_tblmk->getTableNo($targetYY,$targetMM,false);
//--------------------------------------------------
//ASP権限チェック 「ASP利用料表示設定」 がＯＮになっているか
//削除
//対象電話番号を取得
{
	var nowdate = date("Y-m-d H:i:s");
	var targetYYMM = date("Ym", mktime(0, 0, 0, targetMM - 1, 1, targetYY));

	if (db == undefined) {
		return false;
	}

	var O_tblmk = new TableNo();
	var tarTblNo = O_tblmk.get(targetYY, targetMM, false);
	var targetTbl = "tel_details_" + tarTblNo + "_tb";
	var targetTelTbl = "tel_" + tarTblNo + "_tb";

	if (chkAsp(pactid, db) == false) //ASP利用料表示設定」 がＯＦＦ
		{
			if (DEBUG) logging("INFO: ASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u304C\uFF2F\uFF26\uFF26");
			return true;
		}

	if (DEBUG) logging("INFO: ASP\u5229\u7528\u6599\u8868\u793A\u8A2D\u5B9A\u304C\uFF2F\uFF2E");
	var A_charge = db.getHash("SELECT charge, call FROM " + SCR_PAC_TB + " WHERE pactid = " + pactid, false);
	var secure_bill = A_charge[0].charge;
	var call_bill = A_charge[0].call;

	if (secure_bill == "") {
		if (DEBUG) logging("WARNING: \u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u4F7F\u7528\u6599\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_WARNING, "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u306E\u6599\u91D1\u8FFD\u52A0\u51E6\u7406 " + pactid + " \u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u4F7F\u7528\u6599\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		return false;
	}

	var secure_bill_tax = +(secure_bill * G_EXCISE_RATE);
	if (DEBUG) logging("INFO: \u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u4F7F\u7528\u6599\u53D6\u5F97\u5B8C\u4E86 " + secure_bill);

	if (call_bill == "") {
		if (DEBUG) logging("WARNING: \u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u4F7F\u7528\u6599\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		logh.putError(G_SCRIPT_WARNING, "\u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u306E\u6599\u91D1\u8FFD\u52A0\u51E6\u7406 " + pactid + " \u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u4F7F\u7528\u6599\u304C\u6B63\u3057\u304F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
	}

	var call_bill_tax = +(call_bill * G_EXCISE_RATE);
	if (DEBUG) logging("INFO: \u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u4F7F\u7528\u6599\u53D6\u5F97\u5B8C\u4E86 " + call_bill);
	db.begin();
	var sql = "DELETE FROM " + targetTbl + " WHERE pactid = " + pactid + " AND code IN ('SECTEL','SECCAL','SECTELX','SECCALX' );";
	db.query(sql);
	if (DEBUG) logging("INFO: \u65E2\u5B58\u306E" + targetTbl + "\u306E\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5229\u7528\u6599\u91D1\u306E\u524A\u9664\u5B8C\u4E86 ");
	var A_utiwake_result = db.getHash("SELECT code,name,carid,taxtype FROM utiwake_tb WHERE code IN ('SECTEL','SECCAL','SECTELX','SECCALX' );", true);
	var A_utiwake_cnt = A_utiwake_result.length;

	for (var cnt = 0; cnt < A_utiwake_cnt; cnt++) {
		A_utiwake_name[A_utiwake_result[cnt].code][A_utiwake_result[cnt].carid] = A_utiwake_result[cnt].name;
		A_utiwake_tax[A_utiwake_result[cnt].code][A_utiwake_result[cnt].carid] = A_utiwake_result[cnt].taxtype;
	}

	var A_secure_tel = db.getHash("SELECT telno, carid, status, ip_status FROM secure_history_tb WHERE pactid = " + pactid + " AND use_month_date = '" + targetYYMM + "' AND  status is not NULL  ", true);
	var A_secure_cnt = A_secure_tel.length;
	if (DEBUG) logging("INFO: \u5BFE\u8C61\u30EC\u30B3\u30FC\u30C9\u4EF6\u6570:" + A_secure_cnt);

	for (cnt = 0;; cnt < A_secure_cnt; cnt++) //セキュア電話帳利用料金の追加
	{
		sql = "INSERT INTO " + targetTbl + " (pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid) VALUES (" + pactid + ", " + "'" + A_secure_tel[cnt].telno + "', " + "'SECTEL', " + "'" + A_utiwake_name.SECTEL[A_secure_tel[cnt].carid] + "', " + secure_bill + ", " + "'" + A_utiwake_tax.SECTEL[A_secure_tel[cnt].carid] + "', " + "500, " + "'" + nowdate + "', " + A_secure_tel[cnt].carid + ")";
		var ret = db.query(sql);

		if (DB.isError(ret) == true) {
			if (DEBUG) logging("WARNING: \u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5229\u7528\u6599\u91D1\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			logh.putError(G_SCRIPT_WARNING, "\u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u306E\u6599\u91D1\u8FFD\u52A0\u51E6\u7406 " + pactid + " \u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5229\u7528\u6599\u91D1\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			db.rollback();
		}

		sql = "INSERT INTO " + targetTbl + " (pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid) VALUES (" + pactid + ", " + "'" + A_secure_tel[cnt].telno + "', " + "'SECTELX', " + "'" + A_utiwake_name.SECTELX[A_secure_tel[cnt].carid] + "', " + secure_bill_tax + ", " + "'" + A_utiwake_tax.SECTELX[A_secure_tel[cnt].carid] + "', " + "501, " + "'" + nowdate + "', " + A_secure_tel[cnt].carid + ")";
		ret = db.query(sql);

		if (DB.isError(ret) == true) {
			if (DEBUG) logging("WARNING: \u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5229\u7528\u6599\u6D88\u8CBB\u7A0E\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			logh.putError(G_SCRIPT_WARNING, "\u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u306E\u6599\u91D1\u8FFD\u52A0\u51E6\u7406 " + pactid + " \u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5229\u7528\u6599\u6D88\u8CBB\u7A0E\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			db.rollback();
		}

		if (A_secure_tel[cnt].ip_status == "1" or A_secure_tel[cnt].ip_status == "2") //セキュアコール利用料金の追加
			{
				sql = "INSERT INTO " + targetTbl + " (pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid) VALUES (" + pactid + ", " + "'" + A_secure_tel[cnt].telno + "', " + "'SECCAL', " + "'" + A_utiwake_name.SECCAL[A_secure_tel[cnt].carid] + "', " + call_bill + ", " + "'" + A_utiwake_tax.SECCAL[A_secure_tel[cnt].carid] + "', " + "502, " + "'" + nowdate + "', " + A_secure_tel[cnt].carid + ")";
				ret = db.query(sql);

				if (DB.isError(ret) == true) {
					if (DEBUG) logging("WARNING: \u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u5229\u7528\u6599\u91D1\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
					logh.putError(G_SCRIPT_WARNING, "\u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u306E\u6599\u91D1\u8FFD\u52A0\u51E6\u7406 " + pactid + " \u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u5229\u7528\u6599\u91D1\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
					db.rollback();
				}

				sql = "INSERT INTO " + targetTbl + " (pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid) VALUES (" + pactid + ", " + "'" + A_secure_tel[cnt].telno + "', " + "'SECCALX', " + "'" + A_utiwake_name.SECCALX[A_secure_tel[cnt].carid] + "', " + call_bill_tax + ", " + "'" + A_utiwake_tax.SECCALX[A_secure_tel[cnt].carid] + "', " + "503, " + "'" + nowdate + "', " + A_secure_tel[cnt].carid + ")";
				ret = db.query(sql);

				if (DB.isError(ret) == true) {
					if (DEBUG) logging("WARNING: \u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u5229\u7528\u6599\u6D88\u8CBB\u7A0E\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
					logh.putError(G_SCRIPT_WARNING, "\u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u306E\u6599\u91D1\u8FFD\u52A0\u51E6\u7406 " + pactid + " \u30BB\u30AD\u30E5\u30A2\u30B3\u30FC\u30EB\u5229\u7528\u6599\u6D88\u8CBB\u7A0E\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
					db.rollback();
				}
			}
	}

	db.commit();
	if (DEBUG) logging("INFO: " + targetTbl + "\u306B\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u5229\u7528\u6599\u91D1\u306E\u8FFD\u52A0\u5B8C\u4E86 ");
	return true;
};

function logging(lstr) //$log_buf = date('Y/m/d H:i:s') . " : " . $lstr . "\n";
//	$lfp = fopen( $GLOBALS["LocalLogFile"], "a" );
//	flock($lfp, LOCK_EX);
//	fwrite($lfp, $log_buf);
//	flock($lfp, LOCK_UN);
//	fclose($lfp);
//	return;
{
	print(lstr + "\n");
};

function chkAsp(pactid, db) {
	var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + G_AUTH_ASP;
	var count = db.getOne(sql_str);

	if (count == 0) {
		return false;
	} else {
		return true;
	}
};