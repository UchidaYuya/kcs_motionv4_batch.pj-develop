//===========================================================================
//機能：VACUUMDB（pgpool対応版）
//
//作成：前田
//===========================================================================
//define("VACUUM_FULL_START_TIME", 0);	// VACUUM FULLは最も強いロックがかかる為、夜間のみ指定する（開始時間０時）
//define("VACUUM_FULL_END_TIME", 7);		// VACUUM FULLは最も強いロックがかかる為、夜間のみ指定する（終了時間７時）
//日曜日でもFULLオプションを禁止する日
//ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//処理開始をログ出力
//１日、２５日以外の日曜日のみFULLオプションを許可する
//// 00:00-0700の間はFULLオプションを許可する
//if(date("H") >= VACUUM_FULL_START_TIME && date("H") < VACUUM_FULL_END_TIME){
//	$sql = "vacuum full analyze";
//// 07:00-24:00の間はFULLオプションを禁止する
//}else{
//	$sql = "vacuum analyze";
//}
//SQLをログ出力
//VACUUM失敗した場合
//処理終了をログ出力
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const LOG_DELIM = " ";
const SCRIPTNAME = "vacuum.php";
var A_exceptDay = [1, 25];
var dbLogFile = DATA_LOG_DIR + "/vacuumphp.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var day = date("Y/m/d-H:i:s");
print("BEGIN:VACUUM\u958B\u59CB at " + day + "\n");
logh.putError(G_SCRIPT_BEGIN, "VACUUM\u958B\u59CB at " + day);

if (-1 !== A_exceptDay.indexOf(date("j")) == false && date("w") == 0) //$sql = "vacuum full analyze";
	//終わらないことがあったので当面FULLは行わない
	//上記条件以外はFULLオプションを禁止する
	{
		var sql = "vacuum analyze";
	} else {
	sql = "vacuum analyze";
}

print("INFO: " + sql + "\n");
logh.putError(G_SCRIPT_INFO, sql);
var rtn = dbh.query(sql, false);

if (DB.isError(rtn) == true) {
	print("WARNING: VACUUM\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo + "\n");
	logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "VACCUM\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + LOG_DELIM + rtn.userinfo);
} else {
	print("INFO: VACUUM\u5B8C\u4E86\u3057\u307E\u3057\u305F\n");
	logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "VACUUM\u5B8C\u4E86\u3057\u307E\u3057\u305F");
}

day = date("Y/m/d-H:i:s");
print("END: VACUUM\u7D42\u4E86 at " + day + "\n");
logh.putError(G_SCRIPT_END, "VACUUM\u7D42\u4E86 at " + day);
throw die(0);