//===========================================================================
//機能：FJP環境 マスターレコード出力プログラム
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//設定ファイルを読み出す
//DBを開く
//SQL文を作る
//SQLを生成する
//比較を実行する
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/fj_check_common.php");

const PREFIX_MASTERRECOUT = "fjmasterrecout";
var O_ini = new fj_ini_type(FJ_INI_NAME_COMMON);

if (!O_ini.m_is_ok) {
	throw die("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB" + FJ_INI_NAME_COMMON + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\n");
}

var H_ini_common = O_ini.get_common();
var O_sql = new fj_sql_type(FJ_INI_NAME_SQL);

if (!O_sql.m_is_ok) {
	throw die("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB" + FJ_INI_NAME_SQL + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\n");
}

var O_file = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_MASTERRECOUT), "wt");
var O_log = new ScriptLogFile(G_SCRIPT_ALL, "stderr");
var O_db = new ScriptDB(O_log);
var A_sql = Array();

for (var sql of Object.values(O_sql.m_A_sql)) {
	A_sql.push(sql);
}

for (var cnt = 0; cnt < O_sql.m_A_table.length; ++cnt) {
	var sql = O_sql.create(cnt, O_db);
	if (sql.length) A_sql.push(sql);else O_file.put(true, "SQL\u6587\u306E\u751F\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + O_sql.m_A_table[cnt].raw);
}

for (var sql of Object.values(A_sql)) {
	O_file.put(false, sql);
	var A = O_db.getHash(sql);
	var is_first = true;

	for (var H of Object.values(A)) {
		if (is_first) O_file.put(false, ",".join(Object.keys(H)));
		is_first = false;
		O_file.put(false, ",".join(H));
	}

	O_file.put(false, "");
}