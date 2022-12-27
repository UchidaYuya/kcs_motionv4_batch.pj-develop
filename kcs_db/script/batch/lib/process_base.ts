//機能：夜間バッチの、親子プロセスの基底型

//作成：森原

import TableNo, {ScriptDB} from './script_db';
import {ScriptArgs, ScriptCommand} from './script_command';
import { fwrite_conv, G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_DEBUG, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from './script_log';
import { G_OPERATOR_LOGFILE } from '../../../db_define/define';
import { G_GZIP } from './script_common';

const fs = require('fs');
const STDIN = "";
export class ProcessTime extends ScriptLogAdaptor {
	m_A_time: any[];
	constructor(listener: ScriptLogBase) {
		super(listener, true);
		this.m_A_time = Array();
	}

	insert(begin:string, end:string) {
		if (4 != begin.length || isNaN(Number(begin))) {
			this.putError(G_SCRIPT_WARNING, `開始時刻書式不正${begin}`);
			return false;
		}

		if (4 != end.length || isNaN(Number(end))) {
			this.putError(G_SCRIPT_WARNING, `終了時刻書式不正${end}`);
			return false;
		}

		if (begin == end) return true;

		if (end < begin) {
			this.putError(G_SCRIPT_WARNING, `開始時間・終了時間不正${begin}/${end}`);
			return false;
		}

		this.m_A_time.push([begin, end]);
		return true;
	}

	insertAll(param: string, delim = ",") {
		var A_param: string[] = param.split(delim);

		if (0 != A_param.length % 2) {
			this.putError(G_SCRIPT_WARNING, `トークン個数不正${param}`);
			return false;
		}

		for (var cnt = 0; cnt < A_param.length; cnt += 2) if (!this.insert(A_param[cnt], A_param[cnt + 1])) return false;

		return true;
	}

	insertSpace(param: string) {
		if (4 != param.toString().length || isNaN(Number(param))) {
			this.putError(G_SCRIPT_WARNING, `実行可能時分不正${param}`);
			return false;
		}

		const begin_hh = new Date().getHours();
		const begin_mm = new Date().getMinutes();
		let end_hh: number = begin_hh +  parseInt(param.toString().substring(0, 2));
		let end_mm: number = begin_mm + parseInt(param.toString().substring(2, 4)); ;

		while (60 <= end_mm) {
			end_mm -= 60;
			++end_hh;
		}

		while (24 <= end_hh) {
			end_hh -= 24;
		}

		var begin = `${begin_hh}${begin_mm}`;
		var end = `${end_hh}${end_mm}`;

		if (begin == end && "0000".localeCompare(param)) //24時間すべてである
			{
				return this.insert("0000", "2400");
			} else if (begin <= end) //日付をまたいでいない
			{
				return this.insert(begin, end);
			} else //日付をまたいだ
			{
				return this.insert(end, "2400") && this.insert("0000", end);
			}
	}

	isOpen(cur = "") {
		if (0 == cur.length) cur = new Date().getHours()+""+new Date().getMinutes();;

		for (var time of this.m_A_time) if (time[0] <= cur && cur <= time[1]) return true;

		return false;
	}

};

export class ProcessLog extends ScriptLogBase {
	m_path: string | undefined;
	m_info: ScriptLogFile | undefined;
	m_debug: ScriptLogFile | undefined;
	m_err: ScriptLogFile | undefined;
	m_sql: ScriptLogFile | undefined;
	constructor(type: number) {
		super(type);
	}

	setPath(listener: ScriptLogBase | undefined, path: string, procname: string) {
		if (!fs.existsSync(path)) {
			var msg = `ログパス不正${path}`;
			if (undefined !== listener) listener.put(G_SCRIPT_ERROR, msg);else fwrite_conv(this.toLabel(G_SCRIPT_ERROR) + msg + "\n");
			return false;
		}

		if (procname.length) {
			if (!fs.existsSync(path + procname) && !fs.mkdirSync(path + procname)) {
				msg = `ログディレクトリ作成失敗${path}${procname}`;
				if (undefined !== listener) listener.put(G_SCRIPT_ERROR, msg);else fwrite_conv(this.toLabel(G_SCRIPT_ERROR) + msg + "\n");
				return false;
			}
		}

		this.m_path = path + procname;
		this.m_err = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, this.m_path + "error.log");
		this.putListener(this.m_err);
		this.m_info = new ScriptLogFile(G_SCRIPT_ALL & ~G_SCRIPT_DEBUG, this.m_path + "info.log");
		this.m_debug = new ScriptLogFile(G_SCRIPT_ALL, this.m_path + "debug.log");
		this.putListener(this.m_debug);
		this.m_sql = new ScriptLogFile(G_SCRIPT_SQL, this.m_path + "sql.log");
		return true;
	}

};


const { setTimeout } = require('timers/promises');
export class ProcessBase {
	m_procname: string;
	m_listener: ScriptLogBase;
	m_listener_error: ScriptLogBase;
	m_listener_process: ProcessLog | undefined;
	m_db: ScriptDB;
	m_table_no: TableNo;
	m_args: ScriptArgs;
	m_manualflag: boolean | undefined;
	m_debugflag: boolean | undefined;
	m_logpath: string;
	m_lockflag: number | undefined;
	m_checktime: boolean;
	m_opentime: ProcessTime;
	m_curpath: string | undefined;
	m_err_common: ScriptLogFile | undefined;
	m_cur_pactname_id!: number;
	m_cur_pactname: string | undefined;

	constructor(procname: string, logpath: string, opentime: string) //この段階では、m_listener_processはnullのまま
	//初期設定
	{
		this.m_procname = procname;
		this.m_listener_error = new ScriptLogBase(0);
		const stdout = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
		this.m_listener_error.putListener(stdout);
		this.m_err_common = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, logpath + "error.log");
		this.m_listener_error.putListener(this.m_err_common);
		this.m_listener = new ScriptLogBase(0);
		this.m_listener.m_operator = this;
		this.m_listener.putListener(this.m_listener_error);
		this.m_db = new ScriptDB(this.m_listener,"");
		this.m_table_no = new TableNo();
		this.m_args = new ScriptArgs({
			m: {
				type: "int"
			},
			d: {
				type: "int"
			},
			l: {
				type: "string"
			},
			k: {
				type: "int"
			},
			o: {
				type: "string"
			},
			O: {
				type: "string"
			},
			h: Array()
		});
		this.m_manualflag = true;
		this.m_debugflag = false;
		this.m_logpath = logpath;
		this.m_lockflag = 1;
		this.m_opentime = new ProcessTime(this.m_listener);

		if (0 < opentime.length) {
			this.m_checktime = true;
			if (!this.m_opentime.insertAll(opentime)) throw process.exit(1);
		} else this.m_checktime = false;
	}

	processGzip(path: string, is_comp: string) {
		const proc = new ScriptCommand(this.m_listener,true);
		let line = G_GZIP + " -f";
		if (!is_comp) line += " -d";
		line += " " + path;
		return proc.executeCommand(line);
	}

	putError(type: number, message: string) {
		if (G_SCRIPT_SQL & type) this.m_listener.put(type, message);else this.m_listener.put(type, this.m_procname + "::" + message);
		if (G_SCRIPT_ERROR & type) throw process.exit(1);
	}

	putOperator(type: number, message: string) {
		const procname = this.getProcname();
		const pactid:number = this.getCurrentPactid();
		let pactname: any = "";
		if ( pactid == this.m_cur_pactname_id )
			pactname = this.m_cur_pactname;
		else if (undefined !== this.m_db && pactid) {
			var sql = "select compname from pact_tb";
			sql += " where pactid=" + pactid;
			sql += ";";
			pactname = this.m_db.getOne(sql);
			this.m_cur_pactname = pactname;
			this.m_cur_pactname_id = pactid;
		}
		const yyyymm = this.getCurrentMonth();
		const fname = this.getCurrentFilename();
		const subject = this.m_listener.toLabel(type) + ` ${procname} ${pactid} ${pactname} ${yyyymm} ${fname} ${message}`;
		this.putOperatorRaw(subject + "\n");
		this.putError(type, subject);
	}

	putOperatorRaw(subject: string) {
		const fp = fs.createReadStream(G_OPERATOR_LOGFILE,{flag: "at"})

		if (!fp) {
			fp.write(subject);
			return;
		}

		fp.write(subject, fp);
		fp.end();
	}

	getProcname() {
		return this.m_procname;
	}

	getCurrentPactid() {
		return 0;
	}

	getCurrentMonth() {
		return "";
	}

	getCurrentFilename() {
		return "";
	}

	readArgs(A_argv: any, skip_first = true) {
		if (!this.m_args.readAll(A_argv, skip_first)) {
			this.m_args.writeLog(this.m_listener);
			return false;
		}

		if (!this.checkArgs() || !this.commitArgs()) return false;
		this.m_args.writeLog(this.m_listener);
		return true;
	}

	checkArgs() {
		for (var arg of this.m_args.m_A_args) if (!this.checkArg(arg)) return false;

		return true;
	}

	checkArg(args: string) {
		return true;
	}

	commitArgs() {
		for (var arg of this.m_args.m_A_args) if (!this.commitArg(arg)) return false;

		return this.commitArgsAfter();
	}

	commitArgsAfter() {
		return true;
	}

	commitArg(args:any) {
		switch (args.key) {
			case "m":
				this.m_manualflag = args.value;
				break;

			case "d":
				this.m_debugflag = args.value;
				break;

			case "l":
				this.m_logpath = args.value;
				break;

			case "k":
				this.m_lockflag = args.value;
				break;

			case "o":
				if (0 == args.value.length) {
					this.m_checktime = false;
				} else {
					this.m_checktime = true;
					this.m_opentime.m_A_time = Array();
					if (!this.m_opentime.insertAll(args.value)) return false;
				}

				break;

			case "O":
				this.m_checktime = true;
				this.m_opentime.m_A_time = Array();
				if (!this.m_opentime.insertSpace(args.value)) return false;
				break;

			case "h":
				var A_usage = this.getUsage();
				var maxlength = 0;

				for (var usage of Object.values(A_usage)) {
					var len = usage[0].length;
					if (maxlength < len) maxlength = len;
				}

				++maxlength;
				var body = "";

				for (var usage of Object.values(A_usage)) {
					var line = "\t" + usage[0];

					while (line.length < maxlength) line += " ";

					line += usage[1];
					body += line + "\n";
				}

				console.log(body);
				throw process.exit(0);
		}

		return true;
	}

	getUsage() {
		return [["-m={0|1}", "実行前に問い合わせ(1)"], ["-l=path", "ログ出力パス(右端は区切り文字/実在する事"], ["-k={0|1|2}", "ロック無し/自分ロック/全部ロック(1)"], ["-o=hhmm,hhmm,hhmm,hhmm", "動作許可時刻(開始,終了...)"], ["-O=hhmm", "実行可能時分"], ["-h", "このヘルプを表示して終了"]];
	}

	getManual() {
		var rval = "";
		if (this.m_debugflag) rval += "デバッグモード\n";
		rval += "ログ保存先" + this.m_logpath + "\n";

		switch (this.m_lockflag) {
			case 0:
				rval += "ロック制御無し\n";
				break;

			case 1:
				rval += "ロック制御(自プロセスのみ)\n";
				break;

			case 2:
				rval += "ロック制御(全プロセス対象)\n";
				break;
		}

		rval += "動作許可時刻";

		if (this.m_checktime) {
			for (var pair of this.m_opentime.m_A_time) rval += "/" + pair[0] + "-" + pair[1];
		} else rval += "せず";

		rval += "\n";
		return rval;
	}

	init() {
		this.m_listener_process = new ProcessLog(0);
		if (!this.m_listener_process.setPath(this.m_listener, this.m_logpath, this.m_procname + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + "/")) return false;
		this.m_curpath = this.m_listener_process.m_path;
		this.m_listener_error.putListener(this.m_listener_process.m_err);
		this.m_listener.m_A_listener = Array();
		this.m_listener.putListener(this.m_listener_process);
		this.m_listener.putListener(this.m_listener_error);
		return true;
	}

	async execute() {
		if (!this.askManual()) return true;

		if (!this.isOpen()) {
			this.putOperator(G_SCRIPT_WARNING, "動作可能時間外");
		}

		if (!this.init()) return false;
		this.putError(G_SCRIPT_BEGIN, "実行開始");
		let manual:any = this.getManual();
		manual = manual.split("\n");

		for (var line of manual) if (line.length) this.putError(G_SCRIPT_INFO, line);

		if (!this.lock(true)) return false;

		if (!this.begin()) {
			if (!this.lock(false)) return false;
			return false;
		}

		let status = await this.do_execute();
		status = this.end(status);
		status = await this.lock(false);
		this.putError(G_SCRIPT_END, "実行完了");
		return status;
	}

	async askManual() {
		if (!this.m_manualflag) return true;
		fwrite_conv(this.getManual());
		fwrite_conv("実行を継続しますか?(N/y)\n");
		let buf = fs.createReadStream(STDIN);
		buf = buf.substr(0, 1);

		if ("y".localeCompare(buf) && "Y".localeCompare(buf)) {
			fwrite_conv("処理を中断しました\n");
			return false;
		}

		return true;
	}

	isOpen() {
		if (!this.m_checktime) return true;
		return this.m_opentime.isOpen();
	}

	begin() {
		return true;
	}

	async do_execute() {
		return true;
	}

	end(status: boolean) {
		return true;
	}

	async lock(is_lock: boolean) {
		if (!this.m_lockflag) return true;
		var pre = "batch";

		if (is_lock) {
			const unique_key = "_" + this.getUniqueKey();
			const command_name = this.m_db.escape(pre + "_" + this.m_procname + unique_key);
			this.m_db.begin();
			let sql = "insert into clamptask_tb(command,status,recdate)";
			sql += "values('" + command_name + "'";
			sql += ",1,'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "')";
			sql += ";";
			this.m_db.query(sql);
			sql = "select * from clamptask_tb";

			if (2 == this.m_lockflag) //全プロセスに対してロック
				{
					sql += " where command like '" + this.m_db.escape(pre + "%") + "'";
				} else //自プロセスに対してロック
				{
					sql += " where command like '" + this.m_db.escape(pre + "_" + this.m_procname) + "%'";
				}

			sql += " and status=1";
			sql += ";";
			const result = await this.m_db.getHash(sql);
			let is_match = false;

			for (var H_line of result) {
				const command = H_line.command;
				const pos = command.indexOf(unique_key);
				if (false === pos) continue;
				if (unique_key.length + pos == command.length) is_match = true;
			}

			if (1 != result.length) is_match = false;

			if (!is_match) {
				sql = "delete from clamptask_tb" + " where command='" + this.m_db.escape(command_name) + "'" + ";";
				this.m_db.query(sql);
				this.m_db.commit();
			}

			this.m_db.commit();

			if (!is_match) {
				let msg = "";

				for (var cnt = 0; cnt < result.length; ++cnt) {
					let _tmp_0 = result[cnt];

					for (var key in _tmp_0) {
						var value = _tmp_0[key];
						msg += `/${key}=${value}`;
					}
				}

				this.putError(G_SCRIPT_ERROR, `多重動作${msg}`);
				return false;
			}
		} else {
			this.m_db.begin();
			this.m_db.lock("clamptask_tb");
			let sql = "delete from clamptask_tb";
			sql += " where command like '" + this.m_db.escape(pre + "_" + this.m_procname) + "%'";
			sql += ";";
			this.m_db.query(sql);
			this.m_db.commit();
		}

		return true;
	}

	beginDB() {
		this.m_db.begin();
		return true;
	}

	endDB(status: boolean) {
		if (this.m_debugflag) {
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollbackデバッグモード");
		} else if (!status) this.m_db.rollback();else this.m_db.commit();

		return true;
	}

	async lockWeb(O_db: ScriptDB, key: string, needle = "lock%") {
		const unique_key = "_" + this.getUniqueKey();

		while (true) {
			{
				O_db.begin();
				let sql = "insert into clampweb_function_tb";
				sql += " (command,fixdate)";
				sql += " values(";
				sql += "'" + O_db.escape(key + unique_key) + "'";
				sql += ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'";
				sql += ")";
				sql += ";";
				O_db.query(sql);
				sql = "select * from clampweb_function_tb";
				sql += " where command like '" + O_db.escape(needle) + "'";
				sql += ";";
				const result = await O_db.getHash(sql);
				O_db.commit();
				let is_match = false;

				for (var H_line of result) {
					var command = H_line.command;
					var pos = command.indexOf(unique_key);
					if (false === pos) continue;
					if (unique_key.length + pos == command.length) is_match = true;
				}

				if (1 != result.length) is_match = false;
				if (is_match) break;
			}

			await setTimeout(60);
		}

		return true;
	}

	unlockWeb(O_db: ScriptDB, needle = "lock%") {
		O_db.begin();
		O_db.lock("clampweb_function_tb");
		let sql = "delete from clampweb_function_tb";
		sql += " where command like '" + O_db.escape(needle) + "'";
		sql += ";";
		O_db.query(sql);
		O_db.commit();
		return true;
	}

	getUniqueKey() {
		let rval = Math.floor((Math.random() * 100000000000) + 1) + Math.floor((Math.random() * 100000000000) + 1);
		// if ("function" === typeof getmypid) rval += getmypid();
		const fp = fs.createReadStream("/proc/self/stat",{flag: "r"})

		if (false !== fp) {
			var c: number;

			while (!isNaN(c = fs.createReadStream(fp))) rval += c;

			fp.end();
		}

		return rval;
	}
};

export class ProcessDefault extends ProcessBase {
	m_ignorepact: boolean;
	m_A_skippactid: any[];
	m_year: number;
	m_month: number;
	m_last_month: number;
	m_repeatflag: boolean;
	m_current_pactid!: number;
	m_is_skip_delflg: boolean;
	m_pact_type: string;
	m_pactid!: string;


	constructor(procname: string, logpath: string, opentime: string, ignorepact = false) //デフォルト値の設定
	{
		super(procname, logpath, opentime);
		this.m_ignorepact = ignorepact;
		this.m_args.addSetting({
			p: {
				type: "int"
			},
			y: {
				type: "int"
			},
			Y: {
				type: "int"
			},
			r: {
				type: "int"
			},
			P: {
				type: "string"
			},
			t: {
				type: "string"
			}
		});
		this.m_year = new Date().getFullYear();
		this.m_month = new Date().getMonth()+1;
		this.m_last_month = 0;
		this.m_repeatflag = true;
		this.m_A_skippactid = Array();
		this.m_is_skip_delflg = true;
		this.m_pact_type = "a";
	}

	getTableNo() {
		return this.m_table_no.get(this.m_year, this.m_month);
	}

	checkArg(args: any) {
		if (!super.checkArg(args)) return false;

		switch (args.key) {
			case "y":
				const src = args.value;

				if (6 != src.length) {
					this.putError(G_SCRIPT_ERROR, `起動年月不正${src}`);
					return false;
				}

				const yyyy = src.substr(0, 4);
				const mm = src.substr(4, 2);

				if (mm < 1 || 12 < mm) {
					this.putError(G_SCRIPT_ERROR, `起動月不正${src}`);
					return false;
				}

				if (yyyy < 2000 || 2100 < yyyy) {
					this.putError(G_SCRIPT_ERROR, `起動年不正${src}`);
					return false;
				}

				break;

			case "P":
				const result = args.value.split(",");

				for (const item of result) {
					if (!(!isNaN(item))) {
						this.putError(G_SCRIPT_ERROR, "スキップ顧客ID不正" + args.value);
						return false;
					}
				}

				break;

			case "t":
				if (!(-1 !== ["a", "m", "h"].indexOf(args.value))) {
					this.putError(G_SCRIPT_ERROR, "顧客タイプ不正(以下を指定すること-t={a|m|h})");
					return false;
				}

				break;
		}

		return true;
	}

	commitArg(args:any) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "p":
				this.m_pactid = args.value;
				break;

			case "y":
				const src:any = args.value;
				this.m_year = 0 + src.substr(0, 4);
				this.m_month = 0 + src.substr(4, 2);
				break;

			case "Y":
				this.m_last_month = args.value;
				break;

			case "r":
				this.m_repeatflag = args.value;
				break;

			case "P":
				const result = args.value.split(",");

				for (const item of Object.values(result)) this.m_A_skippactid.push(item);

				break;

			case "t":
				this.m_pact_type = args.value;
				break;
		}

		return true;
	}

	commitArgsAfter() {
		for (var cnt = 0; cnt < this.m_last_month; ++cnt) {
			this.m_month = this.m_month - 1;

			if (0 == this.m_month) {
				this.m_month = 12;
				this.m_year = this.m_year - 1;
			}
		}

		return true;
	}

	getUsage() {
		let rval = super.getUsage();
		rval.push(["-p=pactid", "処理対象顧客(全顧客)"]);
		rval.push(["-y=yyyymm", "処理対象年月(現在の年月)"]);
		rval.push(["-Y={0|1|2}", "nヶ月前の処理(ホットライン専用)(0)"]);
		rval.push(["-r={0|1}", "特定顧客でエラーが発生しても処理継続するか(1)"]);
		rval.push(["-t={a|m|h}", "顧客タイプの指定(all(a) モーションのみ(m) ホットラインのみ(h))"]);
		return rval;
	}

	getManual() {
		let rval = super.getManual();
		rval += "顧客";
		if (0 == this.m_pactid.length) rval += "ログ保存先";else rval += this.m_pactid;
		rval += "\n";

		if (this.m_A_skippactid.length) {
			rval += "スキップ顧客";

			for (var item of Object.values(this.m_A_skippactid)) rval += "," + item;

			rval += "\n";
		}

		switch (this.m_pact_type) {
			case "m":
				rval += "モーションユーザーのみ実行\n";
				break;

			case "h":
				rval += "ホットラインユーザーのみ実行\n";
				break;
		}

		rval += "年月" + this.m_year + "/" + this.m_month + "\n";
		if (0 < this.m_last_month) rval += this.m_last_month + "ヶ月前\n";
		rval += "特定顧客でエラーが発生した場合";
		if (this.m_repeatflag) rval += "処理継続する";else rval += "処理継続しない";
		rval += "\n";
		return rval;
	}

	async do_Execute() //実行すべき顧客IDリスト作成
	//顧客IDに対してループ
	{
		var A_pactid = Array();
		if (this.m_pactid.length) A_pactid = [this.m_pactid];else {
			var sql = "select pactid from pact_tb";
			sql += " where pactid!=0";
			if (this.m_is_skip_delflg) sql += " and delflg=false";

			if (0 < this.m_last_month) {
				sql += " and coalesce(type,'')='H'";
			}

			switch (this.m_pact_type) {
				case "h":
					sql += " and coalesce(type,'')='H'";
					break;

				case "m":
					sql += " and coalesce(type,'')='M'";
					break;
			}

			sql += " order by pactid";
			sql += ";";
			const result = await this.m_db.getAll(sql);

			for (var line of result) A_pactid.push(line[0]);
		}
		var all_status = true;

		for (var pactid of A_pactid) //処理
		//ログを元に戻す
		{
			this.m_current_pactid = pactid;
			if (-1 !== this.m_A_skippactid.indexOf(pactid)) continue;

			if (this.m_ignorepact) {
				if (!this.isOpen()) break;
			}

			var log:any = new ProcessLog(0);
			log.setPath(this.m_listener, this.m_curpath, pactid + "_" + `${this.m_year}04d${this.m_month}02d` + "/");
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(log);
			this.m_listener.putListener(this.m_listener_error);
			if (!this.beginPactid(pactid)) return false;
			this.putError(G_SCRIPT_BEGIN, `顧客処理開始(${pactid})`);
			var status: boolean = await this.executePactid(pactid, log.m_path);
			this.putError(G_SCRIPT_END, "顧客処理終了" + `(${pactid})` + (status ? "正常終了" : "異常終了"));
			status = this.endPactid(pactid, status);
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(this.m_listener_process);
			this.m_listener.putListener(this.m_listener_error);
			all_status = status;

			// delete log;
			log = undefined;
			if (!this.m_repeatflag && !status) return status;
			this.m_current_pactid = 0;
		}

		return all_status;
	}

	beginPactid(pactid: number) {
		return this.beginDB();
	}

	async executePactid(pactid: number, logpath: string) {
		return true;
	}

	endPactid(pactid: number, status: boolean) {
		return this.endDB(status);
	}

	getCurrentPactid() {
		return this.m_current_pactid;
	}

	getCurrentMonth() {
		return this.m_year + "/" + this.m_month;
	}

};

export class ProcessCarid extends ProcessDefault {
	m_carid!: string;
	constructor(procname: string, logpath: string, opentime: any) {
		super(procname, logpath, opentime);
		this.m_args.addSetting({
			c: {
				type: "int"
			}
		});
	}

	commitArg(args: { key: string; value: string; }) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "c":
				this.m_carid = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		const rval = super.getUsage();
		rval.push(["-c=carid", "処理対象キャリアID(全キャリア)"]);
		return rval;
	}

	getManual() {
		let rval = super.getManual();
		rval += "キャリア";
		if (this.m_carid.length) rval += this.m_carid;else rval += "すべて";
		rval += "\n";
		return rval;
	}
};
