//===========================================================================
//機能：FJP環境 各種チェックプログラムの共通部分
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//設定定数
//設定ファイルの保存場所のみ、fj_ini_typeの中に記載している
//共通設定ファイルの名前
//SQL文ファイルの名前
//diffの所在
//---------------------------------------------------------------------------
//機能：設定読み出し型
error_reporting(E_ALL);
const FJ_INI_NAME_COMMON = "fjcheck.ini";
const FJ_INI_NAME_SQL = "fjmasterrecout.ini";
const COMMAND_DIFF = "diff";

//機能：設定ファイルの保存場所(右端はパス区切り文字)を返す
//ファイル読みだしに成功していたらtrue
//読み出した内容
//機能：設定を読み出す
//引数：ファイル名
//機能：要素を一つ返す
//引数：セクション名
//キー名
//存在しない場合のデフォルト値
//機能：共通設定をハッシュで返す
//備考：返値は以下の形式
//array(
//"log" => 検査結果の保存先,
//);
//機能：PG差分の設定をハッシュで返す
//備考：返値は以下の形式
//array(
//"sec" => タイムスタンプの、食い違いを容認する秒数,
//"ext" => array(検査対象の拡張子),
//"dir" => array(検査対象のディレクトリ),
//);
//機能：設定テンプレート差分の設定をハッシュで返す
//備考：返値は以下の形式
//array(
//"ext" => array(検査対象の拡張子),
//"dir" => array(検査対象のディレクトリ),
//);
//機能：DB関連の設定をハッシュで返す
//備考：返値は以下の形式
//array(
//"pg_dump" => pg_dumpのフルパス,
//);
class fj_ini_type {
	static get_path() {
		return ["../../conf/", "../../conf_sync/"];
	}

	constructor(fname) {
		this.m_is_ok = false;
		this.m_H_ini = Array();
		var A_path = fj_ini_type.get_path();

		for (var path of Object.values(A_path)) {
			if (!file_exists(path + fname)) continue;
			this.m_H_ini = parse_ini_file(path + fname, true);
			this.m_is_ok = true;
			break;
		}
	}

	get(section, key, defval) {
		return undefined !== this.m_H_ini[section][key] ? this.m_H_ini[section][key] : defval;
	}

	get_common() {
		return {
			log: fj_dir_type.slash(this.get("common", "log_dir", "/tmp"))
		};
	}

	get_pg() {
		return {
			sec: this.get("pg", "sec", 1),
			ext: this.get("pg", "ext", Array()),
			dir: this.get("pg", "dir", Array())
		};
	}

	get_ini() {
		return {
			ext: this.get("ini", "ext", Array()),
			dir: this.get("ini", "dir", Array())
		};
	}

	get_db() {
		return {
			pg_dump: this.get("db", "pg_dump", "pg_dump")
		};
	}

};

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
class fj_dir_compare_base_type {
	compare(path1, path2, fname) {
		return true;
	}

	diff(path1, path2, A_file1: {} | any[], A_file2: {} | any[], A_dir1: {} | any[], A_dir2: {} | any[]) {
		return true;
	}

};

//検索したディレクトリのパス
//含まれるファイル(パス無し)
//含まれるディレクトリ(パス無し)(右端はパス区切り文字)
//機能：コンストラクタ
//引数：検索するディレクトリのパス
//機能：ファイル共通部分・差異部分を抜き出して返す
//引数：比較対象のインスタンス
//ファイルの存在チェックの対象となる拡張子
//備考：戻り値は以下の形式
//array(
//"file" => array(
//"common" => array(
//共通するファイル(パス無し),
//...
//),
//"add" => array(
//こちらのインスタンスにのみ存在するファイル,
//...
//),
//"sub" => array(
//引数のインスタンスにのみ存在するファイル,
//...
//),
//),
//"dir" => array(
//"common" => array(
//共通するディレクトリ(パス無し),
//...
//),
//"add" => array(
//こちらのインスタンスにのみ存在するディレクトリ,
//...
//),
//"sub" => array(
//引数のインスタンスにのみ存在するディレクトリ,
//...
//),
//),
//);
//機能：再帰的に比較を行う
//引数：ルートディレクトリその1
//その2
//比較インスタンス
//ファイルの存在チェックの対象の拡張子(空配列ならすべて)
//内容比較チェックの対象の拡張子(空配列ならすべて)
//機能：ファイル名が拡張子に含まれるならtrueを返す
//引数：ファイル名(フルパスでもパス無しでも可)
//拡張子(空配列なら必ずtrueを返す)
//返値：拡張子が含まれていたらtrueを返す
//機能：右端がパス区切り文字で無ければ、パス区切り文字を追加して返す
//引数：パス
//変更したパス
//機能：パスを接続する
class fj_dir_type {
	constructor(root) {
		var fname;
		root = fj_dir_type.slash(root);
		this.m_root = root;
		this.m_A_file = Array();
		this.m_A_dir = Array();
		var O_dir = opendir(root);
		if (false === O_dir) return;

		while (false !== (fname = readdir(O_dir))) {
			if ("." === fname || ".." === fname) continue;
			if (is_link(root + fname)) continue;else if (is_dir(root + fname)) {
				fname = fj_dir_type.slash(fname);
				this.m_A_dir.push(fname);
			} else if (is_file(root + fname)) {
				this.m_A_file.push(fname);
			}
		}

		closedir(O_dir);
	}

	compare(O_dir: fj_dir_type, A_ext: {} | any[]) {
		var H_rval = {
			file: {
				common: Array(),
				add: Array(),
				sub: Array()
			},
			dir: {
				common: Array(),
				add: Array(),
				sub: Array()
			}
		};

		for (var gcnt = 0; gcnt < 2; ++gcnt) {
			var gkey = gcnt ? "dir" : "file";
			var A1 = gcnt ? this.m_A_dir : this.m_A_file;
			var A2 = gcnt ? O_dir.m_A_dir : O_dir.m_A_file;
			H_rval[gkey].common = array_intersect(A1, A2);
			H_rval[gkey].add = array_diff(A1, H_rval[gkey].common);
			H_rval[gkey].sub = array_diff(A2, H_rval[gkey].common);
		}

		{
			let _tmp_0 = H_rval.file;

			for (var key in _tmp_0) {
				var A_from = _tmp_0[key];
				var A_to = Array();

				for (var fname of Object.values(A_from)) if (fj_dir_type.is_ext(fname, A_ext)) A_to.push(fname);

				H_rval.file[key] = A_to;
			}
		}
		return H_rval;
	}

	static all(root1, root2, O_func: fj_dir_compare_base_type, A_ext_exists: {} | any[], A_ext_contents: {} | any[]) //ファイルやディレクトリの差異を伝える
	//共通するディレクトリを順に再帰呼び出しする
	{
		var O_1 = new fj_dir_type(root1);
		var O_2 = new fj_dir_type(root2);
		var H = O_1.compare(O_2, A_ext_exists);

		if (H.file.add.length || H.file.sub.length || H.dir.add.length || H.dir.sub.length) {
			if (!O_func.diff(O_1.m_root, O_2.m_root, H.file.add, H.file.sub, H.dir.add, H.dir.sub)) return;
		}

		for (var fname of Object.values(H.file.common)) //拡張子を検査する
		{
			if (!fj_dir_type.is_ext(fname, A_ext_contents)) continue;
			if (!O_func.compare(O_1.m_root, O_2.m_root, fname)) return;
		}

		for (var fname of Object.values(H.dir.common)) {
			fj_dir_type.all(O_1.m_root + fname, O_2.m_root + fname, O_func, A_ext_exists, A_ext_contents);
		}
	}

	static is_ext(fname, A_ext: {} | any[]) {
		if (!A_ext.length) return true;

		for (var ext of Object.values(A_ext)) {
			if (fname.length < ext.length) continue;
			var sub = fname.substr(fname.length - ext.length, ext.length);
			if (sub.toUpperCase() === ext.toUpperCase()) return true;
		}

		return false;
	}

	static slash(fname) {
		if (fname.length && "/" !== fname[fname.length - 1]) fname += "/";
		return fname;
	}

	static concat(root, dir) {
		return fj_dir_type.slash(root) + dir;
	}

};

//ファイルハンドル
//機能：ファイルを開くコンストラクタ
//引数：ファイル名
//モード
//機能：デストラクタ
//機能：ファイルを開いていたら閉じる
//機能：一行を出力する
//引数：同時に標準出力にも出力するならtrue
//出力する内容
//機能：ファイルのタイムスタンプを取得する
//引数：ファイル名
//返値：UNIXタイムスタンプ
//機能：プリフィックスと現在の日付から、ファイル名を返す
//引数：プリフィックス
//機能：ファイルを比較する
//引数：パス1
//パス2
//食い違いの内容を返す
//返値：ファイルに食い違いがなければfalseを返す
class fj_file_type {
	constructor(fname, mode) {
		this.m_O_handle = false;
		this.m_O_handle = fopen(fname, mode);
	}

	__destruct() {
		this.close();
	}

	close() {
		if (false !== this.m_O_handle) {
			fclose(this.m_O_handle);
			this.m_O_handle = false;
		}
	}

	put(is_stdout, line) //改行文字を追加する
	{
		if (!line.length || "\n" !== line.substr(line.length - 1, 1)) line += "\n";

		if (false !== this.m_O_handle) {
			fwrite(this.m_O_handle, line);
		}

		if (is_stdout) {
			fwrite(STDOUT, line);
		}
	}

	static timestamp(fname) {
		return filemtime(fname);
	}

	static logname(prefix) {
		return prefix + date("Ymd") + ".txt";
	}

	static diff(path1, path2, A_out) {
		var cmd = COMMAND_DIFF + " " + escapeshellarg(path1) + " " + escapeshellarg(path2);
		A_out = Array();
		var rval = 0;
		exec(cmd, A_out, rval);
		return 0 != rval;
	}

};

//ファイル名
//機能：コンストラクタ
//引数：ファイルの保存先
//プリフィックス
//機能：デストラクタ
//備考：ファイルは閉じておくこと
class fj_workfile_type {
	constructor(path, pre) {
		this.m_name = tempnam(path, pre);
	}

	__destruct() {
		if (file_exists(this.m_name)) {
			unlink(this.m_name);
		}
	}

};

//コマンド(フルパス)
//起動時オプション
//環境変数
//機能：コンストラクタ
//引数：コマンド(フルパス)
//起動時オプション(空配列ならデフォルト値を使用する)
//環境変数(空配列ならデフォルト値を使用する)
//機能：pg_dumpを呼び出す
//引数：実行結果を文字列で返す
//論理DB名
//ユーザ名
//パスワード
//pg_dumpがstderrに出力した内容を保存するファイル名
//その書き込みモード
//作業ディレクトリ
//返値：pg_dumpの返値
class fj_pg_dump_type {
	constructor(cmd, H_arg: {} | any[], H_env: {} | any[]) {
		this.m_command = cmd;
		this.m_H_arg = H_arg;
		this.m_H_env = H_env;
	}

	execute(out, db, user, pass, stderr, stderr_mode, cwd) //コマンドを組み立てる
	//環境変数を用意する
	{
		var cmd = this.m_command;
		var H_arg = this.m_H_arg;

		if (!H_arg.length) {
			H_arg = {
				"-s": "",
				"-x": ""
			};
		}

		if (user.length) H_arg["-U"] = "postgres";

		for (var key in H_arg) {
			var value = H_arg[key];
			cmd += " " + key;
			if (value.length) cmd += " " + value;
		}

		cmd += " " + db;
		var H_env = this.m_H_env;
		if (pass.length) H_env.PGPASSWORD = pass;
		var A_desc = {
			0: ["pipe", "r"],
			1: ["pipe", "w"],
			2: ["file", stderr, stderr_mode]
		};
		var A_pipe = Array();
		var O_proc = proc_open(cmd, A_desc, A_pipe, cwd, H_env);
		if (!is_resource(O_proc)) return false;
		fclose(A_pipe[0]);
		out = stream_get_contents(A_pipe[1]);
		fclose(A_pipe[1]);
		var rval = proc_close(O_proc);
		return rval;
	}

};

//ファイル読みだしに成功していたらtrue
//SQL文
//array(
//array(
//"raw" => iniファイル中の元の文字列,
//"name" => "テーブル名",
//"order" => array(ソートするカラム名, ...),
//"except" => array(除外するカラム名, ...),
//"where" => "特別な検索条件",
//),
//...
//);
//機能：コンストラクタ
//引数：ファイル名
//機能：DBからカラム情報を取得して一個のSQL文を組み立てる
//引数：$this->m_A_tableの添え字
//ScriptDDのインスタンス
//機能：一個のSQL文を組み立てる
//引数：$this->m_A_tableの要素
//そのテーブルの全てのカラム名
//返値：組み立てたSQL文を返す(失敗したら空文字列を返す)
//機能：SQL文の末尾にセミコロンを付けて返す
class fj_sql_type {
	constructor(fname) {
		this.m_is_ok = false;
		this.m_A_sql = Array();
		this.m_A_table = Array();
		var A_path = fj_ini_type.get_path();

		for (var path of Object.values(A_path)) {
			if (!file_exists(path + fname)) continue;
			var H_ini = parse_ini_file(path + fname, true);
			if (undefined !== H_ini.sql.sql) this.m_A_sql = H_ini.sql.sql;

			if (undefined !== H_ini.table.table && Array.isArray(H_ini.table.table)) {
				for (var src of Object.values(H_ini.table.table)) {
					var A_src = src.split("|");
					var H_tgt = {
						raw: src,
						name: "",
						order: Array(),
						except: Array(),
						where: ""
					};
					if (A_src.length < 1) continue;
					H_tgt.name = A_src[0];

					if (2 <= A_src.length) {
						var A = A_src[1].split(",");

						for (var item of Object.values(A)) if (item.length) H_tgt.order.push(item);
					}

					if (3 <= A_src.length) {
						A = A_src[2].split(",");

						for (var item of Object.values(A)) if (item.length) H_tgt.except.push(item);
					}

					if (4 <= A_src.length) H_tgt.where = A_src[3];
					this.m_A_table.push(H_tgt);
				}
			}

			this.m_is_ok = true;
			break;
		}
	}

	create(idx, O_db) {
		var H_table = this.m_A_table[idx];
		var A_column = O_db.tableInfo("select * from " + H_table.name + " limit 1;");
		return this.create_raw(H_table, A_column);
	}

	create_raw(H_table, A_column) //カラムをソートする
	//取り出すカラムまでを組み立てる
	//whereを追加する
	{
		A_column.sort();
		var sql = "select ";
		var is_first = true;

		for (var col of Object.values(A_column)) {
			if (-1 !== H_table.except.indexOf(col)) continue;
			if (!is_first) sql += ",";
			is_first = false;
			sql += col;
		}

		if (is_first) //取り出すカラムがまったく無かった
			{
				return "";
			}

		sql += " from " + H_table.name;
		if (H_table.where.length) sql += " where " + H_table.where;
		is_first = true;

		for (var col of Object.values(H_table.order)) {
			if (is_first) sql += " order by ";else sql += ",";
			is_first = false;
			sql += col;
		}

		sql += ";";
		return sql;
	}

	static semi(sql) {
		if (sql.length && ";" !== sql.substr(sql.length - 1, 1)) sql += ";";
		return sql;
	}

};