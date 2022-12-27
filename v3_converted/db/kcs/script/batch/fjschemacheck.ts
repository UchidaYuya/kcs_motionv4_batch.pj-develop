//===========================================================================
//機能：FJP環境 DBテーブル構成差分チェックプログラム
//
//作成：森原
//===========================================================================
//出力ファイルのプリフィックス
//---------------------------------------------------------------------------
//引数の個数を確認する
//設定ファイルを読み出す
//pg_dumpプロセスを呼び出す
//ファイルを比較する
//pg_dumpが標準エラーに出力した内容を表示する
error_reporting(E_ALL);

require("lib/fj_check_common.php");

const PREFIX_SCHEMACHECK = "fjschemacheck";

if (argv.length < 4) {
	throw die("usage: php " + argv[0] + " \u6BD4\u8F03\u5143\u30B9\u30AD\u30FC\u30DE\u51FA\u529B\u30D5\u30A1\u30A4\u30EB \u8AD6\u7406DB\u540D \u30E6\u30FC\u30B6\u30FC\u540D [\u30D1\u30B9\u30EF\u30FC\u30C9]\n");
}

var src = argv[1];
if (!file_exists(src)) throw die(src + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
var db = argv[2];
var user = argv[3];
var pass = 5 <= argv.length ? argv[4] : "";
var cwd = "/tmp";
var O_ini = new fj_ini_type(FJ_INI_NAME_COMMON);

if (!O_ini.m_is_ok) {
	throw die("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB" + FJ_INI_NAME_COMMON + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\n");
}

var H_ini_common = O_ini.get_common();
var H_ini_db = O_ini.get_db();
var O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_SCHEMACHECK), "wt");
var O_stderr_name = new fj_workfile_type(cwd, PREFIX_SCHEMACHECK);
var O_dump = new fj_pg_dump_type(H_ini_db.pg_dump, Array(), Array());
var out = "";
var rval = O_dump.execute(out, db, user, pass, O_stderr_name.m_name, "wt", cwd);

if (rval) //pg_dumpが正常終了しなかった
	{
		O_log.put(true, H_ini_db.pg_dump + "\u304C\u6B63\u5E38\u7D42\u4E86\u3057\u307E\u305B\u3093\u3067\u3057\u305F(" + rval + ")");
		throw die(0);
	}

var stdout_name = fj_file_type.logname(H_ini_common.log + PREFIX_SCHEMACHECK + "data");
var O_stdout = new fj_file_type(stdout_name, "wt");
O_stdout.put(false, out);
O_stdout.close();
var A_out = Array();
rval = fj_file_type.diff(src, stdout_name, A_out);

if (rval) {
	O_log.put(true, "DB\u30C6\u30FC\u30D6\u30EB\u69CB\u6210\u306B\u5DEE\u7570\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F\n");

	for (var line of Object.values(A_out)) O_log.put(true, line);
} else {
	fwrite(STDOUT, "DB\u30C6\u30FC\u30D6\u30EB\u69CB\u6210\u306B\u5DEE\u7570\u306F\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n");
}

fwrite(STDERR, file_get_contents(O_stderr_name.m_name));