//===========================================================================
//機能：FJP環境 マスターレコードSQL出力プログラム(確認用)
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//設定ファイルを読み出す
//設定ファイル中に含まれるSQL文を表示する
//SQLを生成する
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/fj_check_common.php");

var O_sql = new fj_sql_type(FJ_INI_NAME_SQL);

if (!O_sql.m_is_ok) {
	throw die("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB" + FJ_INI_NAME_SQL + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\n");
}

var O_log = new ScriptLogFile(G_SCRIPT_ALL, "stderr");
var O_db = new ScriptDB(O_log);

for (var sql of Object.values(O_sql.m_A_sql)) {
	echo(O_sql.semi(sql) + "\n");
}

echo("\n");

for (var cnt = 0; cnt < O_sql.m_A_table.length; ++cnt) {
	var sql = O_sql.create(cnt, O_db);
	if (!sql) echo("SQL\u6587\u306E\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + O_sql.m_A_table[cnt].raw + "\n");else echo(O_sql.semi(sql) + "\n");
}