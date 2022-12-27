//===========================================================================
//機能：DBパージスクリプト
//
//作成：前田
//===========================================================================
//ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//削除対象テーブル設定
//テーブル名,検索カラム名,削除しないインターバル,インターバル単位
//sample_tb.recdateが１ヶ月経過したものを削除する場合は以下の用に記述する
//array("sample_tb", "recdate", 1, "months"),
//削除対象テーブル数
//orderid をキーに削除するテーブル
//orderid をキーに削除するテーブル数
//処理開始をログ出力
//テーブル毎に処理する
//処理終了をログ出力
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const LOG_DELIM = " ";
const SCRIPTNAME = "db_purge.php";
var dbLogFile = G_LOG + "/db_purge.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var A_dellist = [["admin_mnglog_tb", "recdate", 13, "months"], ["mnglog_tb", "recdate", 13, "months"], ["telmnglog_tb", "recdate", 13, "months"], ["change_post_tb", "fixdate", 13, "months"], ["post_deleted_tb", "fixdate", 13, "months"], ["post_relation_deleted_tb", "recdate", 13, "months"], ["tel_deleted_tb", "fixdate", 13, "months"], ["user_deleted_tb", "fixdate", 13, "months"], ["order_tb", "recdate", 25, "months"], ["order_tb", "ansdate", 25, "months"], ["tel_reserve_tb", "exe_date", 3, "months"], ["tel_rel_assets_reserve_tb", "reserve_date", 3, "months"], ["assets_reserve_tb", "reserve_date", 3, "months"], ["tel_rel_tel_reserve_tb", "reserve_date", 3, "months"], ["actlog_tb", "recdate", 13, "months"], ["shop_actlog_tb", "recdate", 13, "months"], ["admin_actlog_tb", "recdate", 13, "months"], ["unique_string_tb", "recdate", 1, "months"]];
var cnt_dellist = A_dellist.length;
var A_dellist_sub = ["transfer_tb", "order_plan_tb", "order_history_tb", "order_teldetail_tb"];
var cnt_dellist_sub = A_dellist_sub.length;
print("BEGIN: \uFF24\uFF22\u30D1\u30FC\u30B8\u51E6\u7406\u958B\u59CB\n");
logh.putError(G_SCRIPT_BEGIN, "\uFF24\uFF22\u30D1\u30FC\u30B8\u51E6\u7406\u958B\u59CB");

for (var tableCnt = 0; tableCnt < cnt_dellist; tableCnt++) //order 系テーブル
{
	if (A_dellist[tableCnt][0] == "order_tb") //副問い合わせ用SQL
		//検索条件
		//顧客側で止まっているもの（ステータスが承認待ち、保留、申請却下）
		//transfer_tb,order_plan_tb,order_history_tbを削除
		//order_tb を削除
		//delete失敗した場合
		//clampfile_tb
		{
			var sub_sql_str = "select orderid from " + A_dellist[tableCnt][0];
			var where_sql = " where date(" + A_dellist[tableCnt][1] + ") < current_date - ('" + A_dellist[tableCnt][2] + " " + A_dellist[tableCnt][3] + "')::interval";

			if (A_dellist[tableCnt][1] == "recdate") //販売店側で止まっているもの（ステータスが未処理、処理中、処理済み、保留（SS用）、出荷済、請求済、入金済、完了			// 取消、発注キャンセル）
				{
					var sub_where_sql = " and status < '40'";
				} else if (A_dellist[tableCnt][1] == "ansdate") {
				sub_where_sql = " and status >= '40'";
			}

			sub_sql_str = sub_sql_str + where_sql + sub_where_sql;

			for (var orderCnt = 0; orderCnt < cnt_dellist_sub; orderCnt++) //delete失敗した場合
			{
				dbh.begin();
				var sql_str = "delete from " + A_dellist_sub[orderCnt] + " where orderid in (" + sub_sql_str + ")";
				var rtn = dbh.query(sql_str, false);

				if (DB.isError(rtn) == true) {
					print("WARNING: " + A_dellist_sub[orderCnt] + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo + "\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + A_dellist_sub[orderCnt] + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo);
					dbh.rollback();
				} else {
					print("INFO: " + A_dellist_sub[orderCnt] + "\u306E" + A_dellist[tableCnt][1] + "\u304C" + A_dellist[tableCnt][2] + A_dellist[tableCnt][3] + "\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u3092\u524A\u9664\u3057\u307E\u3057\u305F\n");
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + A_dellist_sub[orderCnt] + "\u306E" + A_dellist[tableCnt][1] + "\u304C" + A_dellist[tableCnt][2] + A_dellist[tableCnt][3] + "\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u3092\u524A\u9664\u3057\u307E\u3057\u305F");
					dbh.commit();
				}
			}

			dbh.begin();
			sql_str = "delete from " + A_dellist[tableCnt][0] + where_sql + sub_where_sql;
			rtn = dbh.query(sql_str, false);

			if (DB.isError(rtn) == true) {
				print("WARNING: " + A_dellist[tableCnt][0] + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo + "\n");
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + A_dellist[tableCnt][0] + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo);
				dbh.rollback();
			} else {
				print("INFO: " + A_dellist[tableCnt][0] + "\u306E" + A_dellist[tableCnt][1] + "\u304C" + A_dellist[tableCnt][2] + A_dellist[tableCnt][3] + "\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u3092\u524A\u9664\u3057\u307E\u3057\u305F\n");
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + A_dellist[tableCnt][0] + "\u306E" + A_dellist[tableCnt][1] + "\u304C" + A_dellist[tableCnt][2] + A_dellist[tableCnt][3] + "\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u3092\u524A\u9664\u3057\u307E\u3057\u305F");
				dbh.commit();
			}
		} else if (A_dellist[tableCnt][0] == "clampfile_tb") //オブジェクトＩＤを取得
		//オブジェクトＩＤ数
		//オブジェクトＩＤが設定されているレコードを削除
		//オブジェクトＩＤが設定されていないレコードを削除
		//delete失敗した場合
		{
			sql_str = "select fid from " + A_dellist[tableCnt][0];
			where_sql = " where date(" + A_dellist[tableCnt][1] + ") < current_date - ('" + A_dellist[tableCnt][2] + " " + A_dellist[tableCnt][3] + "')::interval";
			sql_str = sql_str + where_sql + " and fid is not null and fid != ''";
			var A_fid = dbh.getcol(sql_str, false);
			var cnt_fid = A_fid.length;

			for (var cntFid = 0; cntFid < cnt_fid; cntFid++) //ロールバックしたかどうか true:した、false：しない
			//オブジェクトＩＤ複数対応
			//ラージオブジェクト削除
			//ラージオブジェクトの削除が成功している（ロールバックしていない）時のみclampfile_tbデータを削除する
			{
				var flg_rollback = false;
				var A_tmp = A_fid[cntFid].split(",");
				dbh.begin();

				for (var tmp of Object.values(A_tmp)) //delete失敗した場合
				{
					sql_str = "select lo_unlink(" + tmp + ")";
					rtn = dbh.query(sql_str, false);

					if (DB.isError(rtn) == true) //ロールバック
						{
							print("WARNING: \u30E9\u30FC\u30B8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8 " + tmp + " \u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo + "\n");
							logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u30E9\u30FC\u30B8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8" + tmp + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo);
							dbh.rollback();
							flg_rollback = true;
							break;
						}
				}

				if (flg_rollback == false) //delete失敗した場合
					{
						sql_str = "delete from " + A_dellist[tableCnt][0] + where_sql + " and fid = '" + A_fid[cntFid] + "'";
						rtn = dbh.query(sql_str, false);

						if (DB.isError(rtn) == true) {
							print("WARNING: " + A_dellist[tableCnt][0] + "\u306E\u30E9\u30FC\u30B8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8" + A_fid[cntFid] + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo + "\n");
							logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + A_dellist[tableCnt][0] + "\u306E\u30E9\u30FC\u30B8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8" + A_fid[cntFid] + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo);
							dbh.rollback();
							continue;
						} else {
							print("INFO: " + A_dellist[tableCnt][0] + "\u306E" + A_dellist[tableCnt][1] + "\u304C" + A_dellist[tableCnt][2] + A_dellist[tableCnt][3] + "\u4EE5\u4E0A\u524D\u306E\u30E9\u30FC\u30B8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8" + A_fid[cntFid] + "\u3092\u524A\u9664\u3057\u307E\u3057\u305F\n");
							logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + A_dellist[tableCnt][0] + "\u306E" + A_dellist[tableCnt][1] + "\u304C" + A_dellist[tableCnt][2] + A_dellist[tableCnt][3] + "\u4EE5\u4E0A\u524D\u306E\u30E9\u30FC\u30B8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8" + A_fid[cntFid] + "\u3092\u524A\u9664\u3057\u307E\u3057\u305F");
							dbh.commit();
						}
					}
			}

			dbh.begin();
			sql_str = "delete from " + A_dellist[tableCnt][0] + where_sql;
			rtn = dbh.query(sql_str, false);

			if (DB.isError(rtn) == true) {
				print("WARNING: " + A_dellist[tableCnt][0] + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo + "\n");
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + A_dellist[tableCnt][0] + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo);
				dbh.rollback();
			} else {
				print("INFO: " + A_dellist[tableCnt][0] + "\u306E" + A_dellist[tableCnt][1] + "\u304C" + A_dellist[tableCnt][2] + A_dellist[tableCnt][3] + "\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u3092\u524A\u9664\u3057\u307E\u3057\u305F\n");
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + A_dellist[tableCnt][0] + "\u306E" + A_dellist[tableCnt][1] + "\u304C" + A_dellist[tableCnt][2] + A_dellist[tableCnt][3] + "\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u3092\u524A\u9664\u3057\u307E\u3057\u305F");
				dbh.commit();
			}
		} else //delete失敗した場合
		{
			dbh.begin();
			sql_str = "delete from " + A_dellist[tableCnt][0] + " where date(" + A_dellist[tableCnt][1] + ") < current_date - ('" + A_dellist[tableCnt][2] + " " + A_dellist[tableCnt][3] + "')::interval";
			rtn = dbh.query(sql_str, false);

			if (DB.isError(rtn) == true) {
				print("WARNING: " + A_dellist[tableCnt][0] + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo + "\n");
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + A_dellist[tableCnt][0] + "\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo);
				dbh.rollback();
			} else {
				print("INFO: " + A_dellist[tableCnt][0] + "\u306E" + A_dellist[tableCnt][1] + "\u304C" + A_dellist[tableCnt][2] + A_dellist[tableCnt][3] + "\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u3092\u524A\u9664\u3057\u307E\u3057\u305F\n");
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + A_dellist[tableCnt][0] + "\u306E" + A_dellist[tableCnt][1] + "\u304C" + A_dellist[tableCnt][2] + A_dellist[tableCnt][3] + "\u4EE5\u4E0A\u524D\u306E\u30C7\u30FC\u30BF\u3092\u524A\u9664\u3057\u307E\u3057\u305F");
				dbh.commit();
			}
		}
}

print("END: \uFF24\uFF22\u30D1\u30FC\u30B8\u51E6\u7406\u7D42\u4E86\n");
logh.putError(G_SCRIPT_END, "\uFF24\uFF22\u30D1\u30FC\u30B8\u51E6\u7406\u7D42\u4E86");
throw die(0);