
import { fj_dir_compare_base_type, fj_file_type, FJ_INI_NAME_COMMON, fj_ini_type, fj_dir_type } from './lib/fj_check_common';
import * as fs from 'fs';

const PREFIX_PG = "fjpgfilecheck";

export class fj_dir_compare_pg_type extends fj_dir_compare_base_type {

	m_path1: any;
	m_path2: any;
	m_sec: any;
	m_O_log: any;

	constructor(path1, path2, O_log: fj_file_type, sec) {
		super();
		this.m_path1 = path1;
		this.m_path2 = path2;
		this.m_sec = sec;
		this.m_O_log = O_log;
	}

	compare(path1, path2, fname) //それぞれのタイムスタンプの差を求める
	{
		var sec = fj_file_type.timestamp(path1 + fname) - fj_file_type.timestamp(path2 + fname);
		if (sec < 0) sec = -sec;

		if (this.m_sec < sec) //制限秒数より違いが大きい
			{
				// this.m_O_log.put(true, path1 + fname + "\u306E\u30D5\u30A1\u30A4\u30EB\u306E\u30BF\u30A4\u30E0\u30B9\u30BF\u30F3\u30D7\u304C\u98DF\u3044\u9055\u3063\u3066\u3044\u307E\u3059");
				this.m_O_log.put(true, path1 + fname + "のファイルのタイムスタンプが食い違っています");
			}

		return true;
	}

	// diff(path1, path2, A_file1: {} | any[], A_file2: {} | any[], A_dir1: {} | any[], A_dir2) {
		diff(path1, path2, A_file1: Array <any>, A_file2: Array <any>, A_dir1: Array <any>, A_dir2) {
		// for (var fname of Object.values(A_file1)) {
		for (var fname of A_file1) {
			// this.m_O_log.put(true, path2 + fname + "\u304C\u3042\u308A\u307E\u305B\u3093");
			this.m_O_log.put(true, path2 + fname + "がありません");
		}

		// for (var fname of Object.values(A_file2)) {
		for (var fname of A_file2) {
			// this.m_O_log.put(true, path1 + fname + "\u304C\u3042\u308A\u307E\u305B\u3093");
			this.m_O_log.put(true, path1 + fname + "がありません");
		}

		// for (var fname of Object.values(A_dir1)) {
		for (var fname of A_dir1) {
			// this.m_O_log.put(true, path2 + fname + "\u304C\u3042\u308A\u307E\u305B\u3093");
			this.m_O_log.put(true, path2 + fname + "がありません");
		}

		// for (var fname of Object.values(A_dir2)) {
		for (var fname of A_dir2) {
			// this.m_O_log.put(true, path1 + fname + "\u304C\u3042\u308A\u307E\u305B\u3093");
			this.m_O_log.put(true, path1 + fname + "がありません");
		}

		return true;
	}

};

(() => {
var argv: any;

if (3 != argv.length) {
	// throw process.exit("usage: php " + argv[0] + " \u6BD4\u8F03\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA \u6BD4\u8F03\u5143\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA \n");
	throw process.exit(0);
}

// for (var cnt = 1; cnt < 3; ++cnt) if (!file_exists(argv[cnt]) || !fs.existsSync(argv[cnt])) throw process.exit(argv[cnt] + "\u304C\u5B58\u5728\u3057\u306A\u3044\u304B\u3001\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3067\u306F\u3042\u308A\u307E\u305B\u3093\n");
for (var cnt = 1 + 1; cnt < 3; ++cnt) if (!fs.existsSync(argv[cnt]) || !fs.existsSync(argv[cnt])) throw process.exit(0);

var path1 = argv[1];
var path2 = argv[2];
var O_ini = new fj_ini_type(FJ_INI_NAME_COMMON);

if (!O_ini.m_is_ok) {
	// throw process.exit("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB" + FJ_INI_NAME_COMMON + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\n");
	throw process.exit(0);
}

var H_ini_common = O_ini.get_common();
var H_ini_pg = O_ini.get_pg();
var A_dir = H_ini_pg.dir;

if (A_dir.length) {
	// for (var dir of Object.values(A_dir)) {
	for (var dir of A_dir) {
		var p1 = fj_dir_type.concat(path1, dir);
		var p2 = fj_dir_type.concat(path2, dir);

		// var O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_PG + str_replace("/", "_", p1)), "wt");
		var O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_PG + p1.replaceAll("/", "_")), "wt");

		// if (!file_exists(p1) || !fs.existsSync(p1)) {
		if (!fs.existsSync(p1) || !fs.existsSync(p1)) {
			// O_log.put(true, p1 + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
			O_log.put(true, p1 + "が存在しません");
			continue;
		}

		// if (!file_exists(p2) || !fs.existsSync(p2)) {
		if (!fs.existsSync(p2) || !fs.existsSync(p2)) {
			// O_log.put(true, p2 + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
			O_log.put(true, p2 + "が存在しません");
			continue;
		}

		var O_func = new fj_dir_compare_pg_type(p1, p2, O_log, H_ini_pg.sec);
		fj_dir_type.all(p1, p2, O_func, H_ini_pg.ext, H_ini_pg.ext);
	}
} else {
	p1 = path1;
	p2 = path2;

	// O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_PG + str_replace("/", "_", p1)), "wt");
	O_log = new fj_file_type(fj_file_type.logname(H_ini_common.log + PREFIX_PG +  p1.replace("/", "_")), "wt");

	// if (!file_exists(p1) || !fs.existsSync(p1)) {
	if (!fs.existsSync(p1) || !fs.existsSync(p1)) {
		// O_log.put(true, p1 + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
		O_log.put(true, p1 + "が存在しません");
		throw process.exit(0);
	}

	// if (!file_exists(p2) || !fs.existsSync(p2)) {
	if (!fs.existsSync(p2) || !fs.existsSync(p2)) {
		// O_log.put(true, p2 + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
		O_log.put(true, p2 + "が存在しません");
		throw process.exit(0);
	}

	O_func = new fj_dir_compare_pg_type(p1, p2, O_log, H_ini_pg.sec);
	fj_dir_type.all(p1, p2, O_func, H_ini_pg.ext, H_ini_pg.ext);
}
})();