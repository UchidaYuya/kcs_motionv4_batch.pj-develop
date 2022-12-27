import { fj_dir_compare_base_type, fj_file_type, fj_ini_type, fj_dir_type, FJ_INI_NAME_COMMON } from "../batch/lib/fj_check_common";
import * as fs from "fs";
export const PREFIX_INI = "fjinicheck";

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
// 2022cvt_016
export default class fj_dir_compare_ini_type extends fj_dir_compare_base_type {
	m_path1: any;
	m_path2: any;
	m_O_log: fj_file_type;

// 2022cvt_016
	constructor(path1: any, path2: any, O_log: fj_file_type) {
		super();
		this.m_path1 = path1;
		this.m_path2 = path2;
		this.m_O_log = O_log;
	}

	compare(path1: any, path2: any, fname: any) //ファイルを比較する
	{
// 2022cvt_015
		var A_out = Array();

// 2022cvt_016
		if (fj_file_type.diff(path1 + fname, path2 + fname, A_out)) {
			this.m_O_log.put(true, path1 + fname + "の内容が食い違っています");

// 2022cvt_015
			for (var line of (A_out)) this.m_O_log.put(true, line);
		}

		return true;
	}

	diff(path1: any, path2: any, A_file1: any[], A_file2: any[], A_dir1: any[], A_dir2: any[]) {
// 2022cvt_015
		for (var fname of (A_file1)) {
			this.m_O_log.put(true, path2 + fname + "がありません");
		}

// 2022cvt_015
		for (var fname of (A_file2)) {
			this.m_O_log.put(true, path1 + fname + "がありません");
		}

// 2022cvt_015
		for (var fname of (A_dir1)) {
			this.m_O_log.put(true, path2 + fname + "がありません");
		}

// 2022cvt_015
		for (var fname of (A_dir2)) {
			this.m_O_log.put(true, path1 + fname + "がありません");
		}

		return true;
	}

};

(async ()=>{
if (3 != process.argv.length) {
	// throw process.exit("usage: php " + process.argv[0] + " 比較先ディレクトリ 比較元ディレクトリ \n");// 2022cvt_009
	//  process.exitは数字の引数しか受け付けないので0を与えて対応
	throw process.exit(0);
}

// 2022cvt_015
// for (var cnt = 1; cnt < 3; ++cnt) if (!file_exists(argv[cnt]) || !fs.existsSync(argv[cnt])) throw process.exit(argv[cnt] + "が存在しないか、ディレクトリではありません\n");// 2022cvt_003// 2022cvt_009
for (var cnt = 1; cnt < 3; ++cnt) if (!fs.existsSync(process.argv[cnt]) || !fs.existsSync(process.argv[cnt])) {
	// throw process.exit(process.argv[cnt] + "が存在しないか、ディレクトリではありません\n");// 2022cvt_003// 2022cvt_009
	// process.exitは数字の引数しか受け付けないので0を与えて対応
	throw process.exit(0);
} 


// 2022cvt_015
var path1 = process.argv[1];
// 2022cvt_015
var path2 = process.argv[2];
// 2022cvt_016
// 2022cvt_015
var O_ini = new fj_ini_type(FJ_INI_NAME_COMMON);

if (!O_ini.m_is_ok) {
	// throw process.exit("設定ファイル" + FJ_INI_NAME_COMMON + "が存在しません\n");// 2022cvt_009
	// process.exitは数字の引数しか受け付けないので0を与えて対応
	throw process.exit(0)
}

// 2022cvt_015
var H_ini_common = O_ini.get_common();
// 2022cvt_015
var H_ini_ini = O_ini.get_ini();
// 2022cvt_015
var A_dir = H_ini_ini.dir;

if (A_dir.length) {
// 2022cvt_015
	for (var dir of (A_dir)) {
// 2022cvt_016
// 2022cvt_015
		var p1 = fj_dir_type.concat(path1, dir);
// 2022cvt_016
// 2022cvt_015
		var p2 = fj_dir_type.concat(path2, dir);
// 2022cvt_020
// 2022cvt_016
// 2022cvt_015
		// var O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_INI + str_replace("/", "_", p1)), "wt");
		var O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_INI + p1.replace("/", "_")), "wt");

		try {
			!fs.existsSync(p1) || !fs.existsSync(p1);
		} catch (e) {
			O_log.put(true, p1 + "が存在しません");
			continue;
		}
		// if (!file_exists(p1) || !fs.existsSync(p1)) {// 2022cvt_003
		// if (!fs.existsSync(p1) || !fs.existsSync(p1)) {// 2022cvt_003
		// 	O_log.put(true, p1 + "が存在しません");
		// 	continue;
		// }

		try {
			!fs.existsSync(p2) || !fs.existsSync(p2)
		} catch (e) {
			O_log.put(true, p2 + "が存在しません");
			continue;
		}
		// // if (!file_exists(p2) || !fs.existsSync(p2)) {// 2022cvt_003
		// if (!fs.existsSync(p2) || !fs.existsSync(p2)) {// 2022cvt_003
		// 	O_log.put(true, p2 + "が存在しません");
		// 	continue;
		// }

// 2022cvt_016
// 2022cvt_015
		var O_func = new fj_dir_compare_ini_type(p1, p2, O_log);
// 2022cvt_016
		fj_dir_type.all(p1, p2, O_func, H_ini_ini.ext, H_ini_ini.ext);
	}
} else {
	p1 = path1;
	p2 = path2;
// 2022cvt_020
// 2022cvt_016
	// O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_INI + str_replace("/", "_", p1)), "wt");
	O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_INI + p1.replace("/", "_")), "wt");

	try {
		!fs.existsSync(p1) || !fs.existsSync(p1);
	} catch (e) {
		O_log.put(true, p1 + "が存在しません");
	 	throw process.exit(0);
	}
	// if (!file_exists(p1) || !fs.existsSync(p1)) {// 2022cvt_003
	// if (!fs.existsSync(p1) || !fs.existsSync(p1)) {// 2022cvt_003

	// 	O_log.put(true, p1 + "が存在しません");
	// 	throw process.exit(0);// 2022cvt_009
	// }

	try {
		!fs.existsSync(p2) || !fs.existsSync(p2);
	} catch (e) {
		O_log.put(true, p2 + "が存在しません");
	 	throw process.exit(0);
	}
	// if (!file_exists(p2) || !fs.existsSync(p2)) {// 2022cvt_003
	// if (!fs.existsSync(p2) || !fs.existsSync(p2)) {// 2022cvt_003
	// 	O_log.put(true, p2 + "が存在しません");
	// 	throw process.exit(0);// 2022cvt_009
	// }

// 2022cvt_016
	O_func = new fj_dir_compare_ini_type(p1, p2, O_log);
// 2022cvt_016
	fj_dir_type.all(p1, p2, O_func, H_ini_ini.ext, H_ini_ini.ext);
}
})();