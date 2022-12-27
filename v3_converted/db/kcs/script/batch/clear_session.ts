#!/usr/local/bin/php
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//セッションに登録されている件数を取得
//パラメータがあるかチェック
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
echo("\n");
error_reporting(E_ALL);
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "clear_session.php";

require("lib/script_db.php");

require("lib/script_log.php");

var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_typeView);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var session_result = dbh.getHash("select * from php_session;", true);
var session_cnt = session_result.length;

if (_SERVER.argv.length != 2) //ない
	{
		usage("\u30BB\u30C3\u30B7\u30E7\u30F3\u306F" + session_cnt + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01\n\n");
	} else //パラメータが"-x"かどうかチェック
	{
		if (_SERVER.argv[1] != "-x") //違う
			{
				usage("\u30BB\u30C3\u30B7\u30E7\u30F3\u306F" + session_cnt + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01\n\n");
			} else //セッションカウント処理の開始をログファイルに出力
			//セッションに登録されている件数をログファイルに出力
			{
				logh.putError(G_SCRIPT_BEGIN, SCRIPT_FILENAME + " \u30BB\u30C3\u30B7\u30E7\u30F3\u524A\u9664\u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059\u3002");
				logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + "\u30BB\u30C3\u30B7\u30E7\u30F3\u306F" + session_cnt + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01");

				if (session_cnt > 0) //セッションに登録されている行を削除しつつ、ログファイルに出力
					//$dbh->query("TRUNCATE TABLE php_session;" , true);
					//truncateで上手く削除できない？ようなのでdeleteに変更してみる 2010/09/06 s.maeda
					//delete 失敗したとき
					{
						dbh.begin();
						var rtn = dbh.query("delete from php_session", false);

						if (DB.isError(rtn) == true) {
							dbh.rollback();
							logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u524A\u9664\u306B\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
						} else {
							dbh.commit();
							logh.putError(G_SCRIPT_INFO, SCRIPT_FILENAME + "\u30BB\u30C3\u30B7\u30E7\u30F3\u3092" + session_cnt + "\u4EF6\u524A\u9664\u3057\u307E\u3057\u305F\u3002");
						}
					}

				logh.putError(G_SCRIPT_END, SCRIPT_FILENAME + " \u30BB\u30C3\u30B7\u30E7\u30F3\u30AB\u30A6\u30F3\u30C8\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002\n");
			}

		throw die(0);
	}

function usage(comment) {
	var comment_de = "\u3053\u306E\u30D0\u30C3\u30C1\u306F\u3001php_session\u30C6\u30FC\u30D6\u30EB\u3092\u30AF\u30EA\u30A2\u3059\u308B\u305F\u3081\u306E\u3082\u306E\u3067\u3059\u3002\u5B9F\u884C\u3092\u3059\u308B\u5834\u5408\u306B\u306F\u4E0B\u8A18\u30D1\u30E9\u30E1\u30FC\u30BF\u3092\u3064\u3051\u3066\u304F\u3060\u3055\u3044\u3002";
	print("\n" + comment + comment_de + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -x\n");
	print("\t\t-x \u524A\u9664\u5B9F\u884C\n");
	throw die(1);
};