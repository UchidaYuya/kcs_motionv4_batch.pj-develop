
import { DB_FETCHMODE_ASSOC } from "../../../class/MtDBUtil";
import { G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_SQL, ScriptLogAdaptor,ScriptLogBase} from "./script_log";
import { Client } from 'pg';

const PGPOOL_NO_INSERT_LOCK = "/*NO INSERT LOCK*/";
const copyFrom = require('pg-copy-streams').from;
const fs = require('fs');
export default class TableNo {
	m_cur_year: number;
	m_cur_month: number;
	constructor(curyear:any = undefined, curmonth:any = undefined) {
		if (!(undefined !== curyear)) {
			curyear = new Date().getFullYear();
		}
		if (!(undefined !== curmonth)){
			curmonth = new Date().getMonth()+1;
		}
		this.m_cur_year = curyear;
		this.m_cur_month = curmonth;
	}

	get(year: number, month: number) {
		const diff = 12 * (this.m_cur_year - year) + this.m_cur_month - month + 1;

		if (diff < 13) {
			if (1 == month) {
				return 12;
			} else {
				let rval:any = month - 1;
				if (rval < 10) rval = "0" + rval;
				return rval;
			}
		} else {
			if (1 == month) {
				return 24;
			} else {
				return month - 1 + 12;
			}
		}
	}

};

export class ScriptDB extends ScriptLogAdaptor {
	m_db: Client;

	constructor(listener:ScriptLogBase , dsn:any = "") {
		super(listener , true);
		if (0 == dsn.length){
			dsn = global.G_dsn;
		}
		this.m_db = new Client(dsn);
		this.m_db.connect((err) => {
            if (err) {
				console.log('DB接続失敗: ' + err.stack)
            } else {
                console.log('DB接続: connected !')
            }
        });

		if (this.m_db == null) {
			this.putError(G_SCRIPT_INFO, `connect(${dsn})`);
			this.putError(G_SCRIPT_ERROR, "connect");
		}
	}

	//DB.isErrorの代わりに、エラーが発生したときに立てたフラグを返す
	error_occur: boolean = false;
	isError():boolean{
		return this.error_occur;
	}

	async query(sql: string, check = true) {
		this.error_occur = false;
		try {
			const result = await this.m_db.query(sql);
			if (sql.replace(PGPOOL_NO_INSERT_LOCK, "").match("/^\\s*(delete|update|insert)/i")) return result.rowCount;

		} catch (e) {
			this.error_occur = true;
			if (!check) return Array();
			await this.m_db.query('ROLLBACK')
			this.putError(G_SCRIPT_ERROR, `query(${sql})`);
		}

		return Array();
	}

	async query_by_val(sql: string, values : any[], check = true) {
		try {
			const result = await this.m_db.query(sql, values);
			if (sql.replace(PGPOOL_NO_INSERT_LOCK, "").match("/^\\s*(delete|update|insert)/i")) return result.rowCount;
			return result.rows;
		} catch (e) {
			if (!check) return Array();
			await this.m_db.query('ROLLBACK')
			this.putError(G_SCRIPT_ERROR, `query_by_val(${sql})`);
		}

		return Array();
	}

	affectedRows(result) {
		return result.rowCount;
	}

	async getAll(sql: string, check = true) {
		try {
			const result = await this.m_db.query({text: sql , rowMode: 'array'});
			return result.rows;
		} catch (e) {
			if (!check) return Array();
			await this.m_db.query('ROLLBACK')
			this.putError(G_SCRIPT_ERROR, `getAll(${sql})`);
		}

		return Array();
	}

	async getHash(sql: string, check = true) {
		try {
			const result = await this.m_db.query(sql);
			return result.rows;
		} catch (e) {
			if (!check) return Array();
			await this.m_db.query('ROLLBACK')
			this.putError(G_SCRIPT_ERROR, `getHash(${sql})`);
		}

		return Array();
	}

	getObject(sql: string, check = true) {
		// 使用箇所がないので、空の関数を用意する。
	}

	async getOne(sql: string, check = true)  {
		try {
			const result = await this.m_db.query(sql);
			return result.rows[0];
		} catch (e) {
			if (!check) return null;
			await this.m_db.query('ROLLBACK')
			this.putError(G_SCRIPT_ERROR, `getOne(${sql})`);
		}

		return null;
	}

	async getCol(sql: string, check = true) {
		try {
			const result = await this.m_db.query(sql);
			let cols = Array();
			result.rows.forEach(row => {
				cols.push(row[0]);
			});
			return cols;
		} catch (e) {
			if (!check) return [];
			await this.m_db.query('ROLLBACK')
			this.putError(G_SCRIPT_ERROR, `getCol(${sql})`);
		}

		return Array();
	}

	escape(sql: string) {
		return this.m_db.escapeIdentifier(sql);
	}

	async begin() {
		await this.m_db.query('BEGIN')
		if (!this.m_db) this.putError(G_SCRIPT_ERROR, "begin");
	}

	async rollback() {
		await this.m_db.query('COMMIT')
		if (!this.m_db) this.putError(G_SCRIPT_ERROR, "rollback");
	}

	async commit() {
		await this.m_db.query('ROLLBACK')
		if (!this.m_db) this.putError(G_SCRIPT_ERROR, "commit");
	}

	lock(table_name: string) //2007/06/22 * DEBUG * pg_poolの二重化が外れるため抑制 by T.Naka
	//$this->query("lock $table_name in row exclusive mode;");
	//if (DB::isError($this->m_db))
	//$this->putError(G_SCRIPT_ERROR, "lock $table_name");
	{}

	async tableInfo(sql: string, check = true) {
		try {
			const result = await this.m_db.query(sql);
			let fields = Array();
			result.fields.forEach(field => {
				fields.push(field.name);
			});
			return fields;
		} catch (e) {
			if (!check) return {};
			await this.m_db.query('ROLLBACK')
			this.putError(G_SCRIPT_ERROR, `getCol(${sql})`);
		}

		return Array();
	}

	getQuote(sql: string) {
		// バッチでは呼び出しがないので実装しない。
	}

	backupAll(fname: string, table_name: string) //copy to filenameを使わないようにした
	//pg_poolの二重化対策
	//binaryでなければ大丈夫かも知れないが念のため
	{
		return this.backup(fname, `select * from ${table_name};`);
	}

	async backup(fname: string, sql: string) {
		const fp = fs.createReadStream(fname,{flag: "wt"})

		if (!fp) {
			this.putError(G_SCRIPT_ERROR, "backup/ファイルオープン失敗" + fname + "/" + sql);
			return false;
		}

		const result = await this.m_db.query(sql);

		if (!result) {
			fs.close(fp);
			this.rollback();
			this.putError(G_SCRIPT_ERROR, `backup(${sql})`);
		}

		result.rows.forEach( row => {
			let line = "";
			const data = Array();
			row.forEach( feild => {
				data.push(this.backupEscape(feild));
			})
			line += data.join("\t");
			line += "\n";

			if (line.length != fs.writeFileSync(fp, line)) {
				this.putError(G_SCRIPT_ERROR, "backup/ファイル書き込み失敗" + fname + "/" + sql);
				fs.close(fp);
				return false;
			}
		})

		fp.end();
		return true;
	}

	backupEscape(var_0: any, type: string = ''){
		var_0 = var_0.replace("\\", "\\\\");
		var_0 = var_0.replace("\t", "\\\t");
		return var_0;
	}

	loImport(path: string) //ラージオブジェクトが使えないので、一時的にNFS経由とする
	//SQL文先頭の空白文字はpgpool経由で両方のDBに反映するために必要
	//if ("db_pgsql" != get_class($this->m_db))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/DB接続がpostgresではない" . get_class($this->m_db));
	//		}
	//####
	//		if ("db_pgsql" != get_class($this->m_db))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/DB接続がpostgresではない(oid=$oid)");
	//		}
	//		$oid = pg_lo_create($this->m_db->connection);
	//		if ( ! $oid)
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/インポート失敗create");
	//		}
	//		$tgt = pg_lo_open($this->m_db->connection, $oid, "w");
	//		if ( ! $tgt)
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/インポート失敗lo_open($oid)");
	//		}
	//		$src = fopen($path, "rb");
	//		if ( ! $src)
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/インポート失敗fopen($path)");
	//		}
	//		$bufsize = 1024 * 64;
	//		while (true)
	//		{
	//			$buf = fread($src, $bufsize);
	//			$len = strlen($buf);
	//			if (0 == $len) break;
	//			if ($len != pg_lo_write($tgt, $buf))
	//			{
	//				$this->putError(G_SCRIPT_ERROR,
	//					"loImport/インポート失敗lo_write($len)");
	//			}
	//		}
	//		if ( ! fclose($src))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/インポート失敗fclose($path)");
	//		}
	//		if ( ! pg_lo_close($tgt))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loImport/インポート失敗lo_close($oid)");
	//		}
	//		return $oid;
	//####
	{
		// 10/26 S3に保存するかもしれないので保留
		return "";
	}

	loExport(path: string, oid: number, check: boolean = true) //ラージオブジェクトが使えないので、一時的にNFS経由とする
	//####
	//		if ("db_pgsql" != get_class($this->m_db))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loExport/DB接続がpostgresではない(oid=$oid)");
	//		}
	//		$sql = "select count(loid) from pg_catalog.pg_largeobject";
	//		$sql .= " where loid=" . $oid;
	//		$sql .= ";";
	//		if (0 == $this->getOne($sql)) return false;
	//		if ( ! pg_loexport($oid, $path, $this->m_db->connection))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loExport/エクスポート失敗($path)$oid");
	//			return false;
	//		}
	//		return true;
	//####
	{
		// 10/26 S3に保存するかもしれないので保留
		return true
	}

	loUnlink(oid: number, check: boolean = true) //ラージオブジェクトが使えないので、一時的にNFS経由とする
	//####
	//		if ("db_pgsql" != get_class($this->m_db))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loUnlink/DB接続がpostgresではない(oid=$oid)");
	//		}
	//		$sql = "select count(loid) from pg_catalog.pg_largeobject";
	//		$sql .= " where loid=" . $oid;
	//		$sql .= ";";
	//		if (0 == $this->getOne($sql)) return;
	//		if ( ! pg_lounlink($this->m_db->connection, $oid))
	//		{
	//			$this->putError(G_SCRIPT_ERROR,
	//				"loUnlink/削除失敗(oid=$oid)");
	//		}
	//####
	{
		// 10/26 S3に保存するかもしれないので保留

		return true;
	}

	pg_copy_from(table_name: string, filename : string){
		const fileStream = fs.createReadStream(filename);
		if (!fileStream) {
			this.putError(G_SCRIPT_ERROR, "ファイル読み出しオープン失敗(" + filename + "/" + table_name + ")");
			return false;
		}
		const stream = this.m_db.query(copyFrom(`COPY ${table_name} FROM STDIN`))
		fileStream.on('error', () => { return false })
		stream.on('error', () => { return false })
		stream.on('finish', () => { return true })
		fileStream.pipe(stream)
		return true;
	}
};

export class ScriptDBAdaptor extends ScriptLogAdaptor {
	m_db: ScriptDB;
	m_table_no: TableNo;
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, exit_on_error = true) {
		super(listener, exit_on_error);
		this.m_db = db;
		this.m_table_no = table_no;
	}

	escape(var_0: any) {
		return this.m_db.escape(var_0);
	}

	getTableNo(year: number, month: number) {
		return this.m_table_no.get(year, month);
	}
};


export class TableInserterBase extends ScriptLogAdaptor {
	m_debug: any;
	m_is_no_insert_lock: any;
	m_db: ScriptDB;
	m_A_const: any;
	m_A_col: any;
	m_table_name: any;
	escapeStr(var_0:string){}
	setDebug(debug: string) {
		this.m_debug = debug;
	}

	setUnlock() {
		this.m_is_no_insert_lock = true;
	}

	constructor(adaptor: ScriptLogBase, db: ScriptDB) {
		super(adaptor, true);
		this.m_db = db;
		this.m_A_const = Array();
		this.m_A_col = Array();
		this.m_is_no_insert_lock = false;
	}

	begin(table_name: string) {
		this.m_table_name = table_name;
		var sql = `select * from ${table_name} where 1=0;`;
		this.m_A_col = this.m_db.getQuote(sql);
		return true;
	}

	setConst(consts: any) {
		this.m_A_const = consts;
		return true;
	}

	async insert(H_line: any) {
		return true;
	}

	end() {
		return true;
	}

	getTimestamp() {
		var tm = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')+'+09';
		return tm;
	}

	getEmpty(is_escape: any) {
		var rval = Array();

		for (var col of this.m_A_col) {
			var var_0:any = undefined;
			if (!is_escape) var_0 = "\\N";
			rval.push(var_0);
		}

		return rval;
	}

	getIndex(name: string) {
		var idx = 0;

		for (var col of this.m_A_col) {
			if (0 == name.localeCompare(col[0])) return idx;
			++idx;
		}

		return -1;
	}

	insertRaw(A_line: string, is_escape: boolean) {
		return true;
	}

};

export class TableInserterSlow extends TableInserterBase {
	constructor(listener: ScriptLogBase,  db: ScriptDB) {
		super(listener, db);
	}

	async insert(H_line: any) {
		let _tmp_0 = this.m_A_const;

		for (var key in _tmp_0) {
			const value = _tmp_0[key];
			if (!(key in H_line)) H_line[key] = value;
		}

		let sql = "insert into " + this.m_table_name;
		sql += "(" + this.m_A_col.join() + ") values(";

		const values = Array();
		const temp_values = Array();
		for (let [cnt, col] of this.m_A_col) {
			const colname = col[0];
			if (undefined !== H_line[colname]) {
				temp_values.push("$" + (cnt + 1));
				const var_0 = this.m_db.escape(H_line[colname]);

				if (0 == "now()".localeCompare( var_0)) {
					values.push(this.getTimestamp());
				} else {
					values.push(var_0);
				}
			} else{
				values.push(null);
			}
		}

		sql += temp_values.join();
		sql += ")";
		if (this.m_is_no_insert_lock) sql = PGPOOL_NO_INSERT_LOCK + sql;
		this.putError(G_SCRIPT_SQL, sql);
		await this.m_db.query_by_val(sql, values);
		return true;
	}

	is_quote(name: string) {
		switch (name.toLowerCase()) {
			case "integer":
			case "boolean":
			case "double":
			case "float":
			case "int":
				return false;

			default:
				return true;
		}
	}

};


export class TableInserter extends TableInserterBase {
	m_interval: number;
	m_fp: any;
	m_filename: string;
	m_erase: any;
	m_static: any;
	//constructor(adaptor: ScriptLogAdaptor, db: ScriptDB, fname: string, erase: any) {
	constructor(adaptor: ScriptLogBase, db: ScriptDB, fname: string, erase: any) {
		super(adaptor, db);
		this.m_filename = fname;
		this.m_erase = erase;
		this.m_interval = 1024;
	}

	begin(table_name:string) {
		if (!super.begin(table_name)) return false;

		if (this.m_erase || !fs.existsSync(this.m_filename)) {
			var fp = fs.createReadStream(this.m_filename,{flag: "wb"});

			if (!fp) {
				this.putError(G_SCRIPT_ERROR, "ファイル消去失敗(" + this.m_filename + "/" + this.m_table_name + ")");
				return false;
			}

			fs.close(fp);
		}

		if (this.m_static) {
			this.m_fp = fs.createReadStream(this.m_filename,{flag: "wt"});
			if (!this.m_fp) {
				this.putError(G_SCRIPT_ERROR, "ファイル作成失敗(" + this.m_filename + "/" + this.m_table_name + ")");
				return false;
			}
		}

		return true;
	}

	//insert(H_line: string) {
	async insert(H_line: {[index: string]: string}) {
		var line = "";
		if (!this.toLine(line, H_line)) return false;
		if (!this.putLine(line + "\n")) return false;
		return true;
	}

	//toLine(line: string, H_line: string) {
	toLine(line: string, H_line: {[index: string]: string}) {
		var comma = false;

		for (var col of this.m_A_col) {
			var colname = col[0];
			if (comma) line += "\t";
			comma = true;

			if (undefined !== H_line[colname]) {
				line += this.escape(H_line[colname]);
			} else if (undefined !== this.m_A_const[colname]) {
				line += this.escape(this.m_A_const[colname]);
			} else line += "\\N";
		}

		return true;
	}

	escape(var_0:string) {
		if (!(undefined !== var_0)) return "\\N";

		if (0 == "now()".localeCompare(var_0)) {
			var_0 = this.getTimestamp();
		}

		return this.escapeStr(var_0);
	}

	escapeStr(var_0:string) //20071206iga
	{
		var_0 = var_0.replace("\\", "\\\\");
		var_0 = var_0.replace("\t", "\\\t");
		var_0 = var_0.replace("LFkaigyoLF", "\\n");
		return var_0;
	}

	putLine(line:string) {
		if (this.m_fp) var fp = this.m_fp;else {
			fp = fs.createReadStream(this.m_filename,{flag: "at"});

			if (!fp) {
				this.putError(G_SCRIPT_ERROR, "ファイル作成失敗(" + this.m_filename + "/" + this.m_table_name + ")");
				return false;
			}
		}

		if (line.length != fp.write(line)) {
			this.putError(G_SCRIPT_ERROR, "ファイル書き込み失敗(" + this.m_filename + "/" + this.m_table_name + ")");
			fs.close(fp);
			return false;
		}

		if (!this.m_fp) fp.end("\n");
		return true;
	}

	insertRaw(A_line: any, is_escape: boolean) {
		var line = "";

		if (is_escape) {
			var comma = false;

			for (var cell of A_line) {
				if (comma) line += "\t";
				comma = true;
				line += this.escape(cell);
			}
		} else line = A_line.join("\t");

		if (!this.putLine(line + "\n")) return false;
		return true;
	}

	end() {
		if (this.m_fp) {
			this.m_fp.end("\n");
			this.m_fp = undefined;
		}

		if (this.m_debug) {
			this.putError(G_SCRIPT_INFO, "DB挿入実行せず(" + this.m_filename + "/" + this.m_table_name + ")");
			return true;
		}

		if (false === this.m_db.pg_copy_from(this.m_table_name, this.m_filename)) {
			this.putError(G_SCRIPT_ERROR, `pg_copy_from失敗` + this.m_table_name);
		}

		// fs.close(fp);
		// fp = undefined;
		return true;
	}

};

export class FetchAdaptor extends ScriptLogAdaptor {
	m_db: ScriptDB;
	m_key: string;
	m_result: any;
	m_eof: boolean | undefined;
	m_fetch: any;
	ScriptLogAdaptor: any;
	constructor(listener: ScriptLogBase, db: ScriptDB, key: string, exit_on_error = true) {
		super(listener, exit_on_error);
		this.m_db = db;
		this.m_key = key;
	}

	query(sql: string) {
		this.free();
		this.m_result = this.m_db.query(sql);
		// this.m_eof = undefined !== result ? false : true;
	}

	set(result: string) {
		this.free();
		this.m_result = result;
		this.m_eof = undefined !== result ? false : true;
	}

	free() {
		delete this.m_result;
		this.m_eof = true;
		delete this.m_fetch;
	}

	fetch(value: string) //最後まで取り出したが、合致する値がなかった
	//最後まで取り出したが合致するレコードがなかった
	{
		if (undefined !== this.m_fetch) //↓新しい値を取りに行く
			{
				if (0 == this.m_fetch[this.m_key].localeCompare(value)) //フェッチずみの値があるのでそれを返す
					{
						var rval = this.m_fetch;
						delete this.m_fetch;
						return rval;
					} else if (0 < this.m_fetch[this.m_key].localeCompare(value)) //フェッチずみレコードは今のキーよりも大きい
					//(ので、将来的にフェッチずみレコードが使える可能性がある)
					{
						return undefined;
					}

				delete this.m_fetch;
			}

		if (!(undefined !== this.m_result)) return undefined;

		while (this.m_fetch = this.m_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (0 == this.m_fetch[this.m_key].localeCompare(value)) //合致する値があった
				{
					rval = this.m_fetch;
					delete this.m_fetch;
					return rval;
				} else if (0 < this.m_fetch[this.m_key].localeCompare(value)) //キーより大きい値をフェッチしてしまった
				{
					return undefined;
				}
		}

		delete this.m_fetch;
		this.m_eof = true;
		return undefined;
	}

	fetchNext() {
		if (undefined !== this.m_fetch) {
			var rval = this.m_fetch;
			delete this.m_fetch;
			return rval;
		}

		return this.m_result.fetchRow(DB_FETCHMODE_ASSOC);
	}

	eof() {
		if (!(undefined !== this.m_result) && !(undefined !== this.m_fetch)) return true;
		return this.m_eof;
	}

};
