//===========================================================================
//機能：FJP環境 設定・テンプレートファイル差分チェックプログラム
//
//作成：森原
//===========================================================================
//出力ファイルのプリフィックス
//---------------------------------------------------------------------------
//機能：ファイル比較機能
//設定ファイルを読み出す
//比較を行う
error_reporting(E_ALL);

require("lib/fj_check_common.php");

const PREFIX_INI = "fjinicheck";

//パスその1
//パスその2
//出力先
//機能：コンストラクタ
//引数：パスその1
//パスその2
//出力先
//機能：比較を行う
//引数：パス1
//パス2
//ファイル名
//返値：処理を打ち切るならfalseを返す
//機能：片方にしかないファイルとディレクトリを受け取る
//引数：パス1
//パス2
//パス1にしかないファイル
//パス2にしかないファイル
//パス1にしかないディレクトリ
//パス2にしかないディレクトリ
//返値：処理を打ち切るならfalseを返す
class fj_dir_compare_ini_type extends fj_dir_compare_base_type {
	constructor(path1, path2, O_log: fj_file_type) {
		this.m_path1 = path1;
		this.m_path2 = path2;
		this.m_O_log = O_log;
	}

	compare(path1, path2, fname) //ファイルを比較する
	{
		var A_out = Array();

		if (fj_file_type.diff(path1 + fname, path2 + fname, A_out)) {
			this.m_O_log.put(true, path1 + fname + "\u306E\u5185\u5BB9\u304C\u98DF\u3044\u9055\u3063\u3066\u3044\u307E\u3059");

			for (var line of Object.values(A_out)) this.m_O_log.put(true, line);
		}

		return true;
	}

	diff(path1, path2, A_file1: {} | any[], A_file2: {} | any[], A_dir1: {} | any[], A_dir2) {
		for (var fname of Object.values(A_file1)) {
			this.m_O_log.put(true, path2 + fname + "\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		for (var fname of Object.values(A_file2)) {
			this.m_O_log.put(true, path1 + fname + "\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		for (var fname of Object.values(A_dir1)) {
			this.m_O_log.put(true, path2 + fname + "\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		for (var fname of Object.values(A_dir2)) {
			this.m_O_log.put(true, path1 + fname + "\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		return true;
	}

};

if (3 != argv.length) {
	throw die("usage: php " + argv[0] + " \u6BD4\u8F03\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA \u6BD4\u8F03\u5143\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA \n");
}

for (var cnt = 1; cnt < 3; ++cnt) if (!file_exists(argv[cnt]) || !is_dir(argv[cnt])) throw die(argv[cnt] + "\u304C\u5B58\u5728\u3057\u306A\u3044\u304B\u3001\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3067\u306F\u3042\u308A\u307E\u305B\u3093\n");

var path1 = argv[1];
var path2 = argv[2];
var O_ini = new fj_ini_type(FJ_INI_NAME_COMMON);

if (!O_ini.m_is_ok) {
	throw die("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB" + FJ_INI_NAME_COMMON + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\n");
}

var H_ini_common = O_ini.get_common();
var H_ini_ini = O_ini.get_ini();
var A_dir = H_ini_ini.dir;

if (A_dir.length) {
	for (var dir of Object.values(A_dir)) {
		var p1 = fj_dir_type.concat(path1, dir);
		var p2 = fj_dir_type.concat(path2, dir);
		var O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_INI + str_replace("/", "_", p1)), "wt");

		if (!file_exists(p1) || !is_dir(p1)) {
			O_log.put(true, p1 + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
			continue;
		}

		if (!file_exists(p2) || !is_dir(p2)) {
			O_log.put(true, p2 + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
			continue;
		}

		var O_func = new fj_dir_compare_ini_type(p1, p2, O_log);
		fj_dir_type.all(p1, p2, O_func, H_ini_ini.ext, H_ini_ini.ext);
	}
} else {
	p1 = path1;
	p2 = path2;
	O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_INI + str_replace("/", "_", p1)), "wt");

	if (!file_exists(p1) || !is_dir(p1)) {
		O_log.put(true, p1 + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
		throw die(0);
	}

	if (!file_exists(p2) || !is_dir(p2)) {
		O_log.put(true, p2 + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
		throw die(0);
	}

	O_func = new fj_dir_compare_ini_type(p1, p2, O_log);
	fj_dir_type.all(p1, p2, O_func, H_ini_ini.ext, H_ini_ini.ext);
}