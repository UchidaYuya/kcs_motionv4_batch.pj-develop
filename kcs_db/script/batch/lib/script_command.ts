//===========================================================================
//機能：外部プロセス実行と、起動時パラメータの取得型
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：ARGV処理型

import { G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase } from "./script_log";


const Iconv  = require('iconv').Iconv
const fs  = require("fs");
export class ScriptArgs {
	m_A_setting: any;
	m_A_args: any[];
	m_A_error: any[];
	constructor(A_setting: any) {
		this.m_A_setting = Array();
		this.addSetting(A_setting);
		this.m_A_args = Array();
		this.m_A_error = Array();
	}

	addSetting(A_setting: any) {
		for (var key in A_setting) {
			var value = A_setting[key];
			this.m_A_setting[key] = value;
		}
	}

	putError(type: any, message: string) {
		this.m_A_error.push({
			type: type,
			message: message
		});
	}

	readAll(A_argv: any, skip_first = true) {
		if (!(undefined !== A_argv)) A_argv = process.argv;
		var first = true;
		if (!skip_first) first = false;

		for (var argv of A_argv) {
			if (first) {
				first = false;
				continue;
			}

			if (!this.read(argv)) return false;
		}

		return true;
	}

	read(argv:any) {
		{
			let _tmp_0 = this.m_A_setting;

			for (var key in _tmp_0) {
				var setting = _tmp_0[key];
				if (0 == key.localeCompare("*")) var key = "";

				if (key.length) {
					var sub = argv.substr(1, key.length);
					if (sub.localeCompare(key)) continue;
				}

				var param:any = Array();
				param.key = key;
				if (key.length) argv = argv.substr(1 + key.length);

				if (undefined !== setting.keytype) {
					var pos = argv.indexOf("=");

					if (0 == pos.length) {
						this.putError(G_SCRIPT_ERROR, `追加固定部の後にイコールがない${argv}`);
						return false;
					}
					
					param.addkey = argv.substr(0, pos);
					if (!this.checkType(param.addkey, setting.keytype)) return false;
					argv = argv.substr(pos);
				}

				if (undefined !== setting.type) {
					pos = argv.indexOf("=");

					if (0 == pos.length) {
						if (key.length) {
							this.putError(G_SCRIPT_ERROR, `値部の前にイコールがない${argv}`);
							return false;
						}

						pos = -1;
					}

					param.value = argv.substr(pos + 1);
					if (!this.checkType(param.value, setting.type)) return false;
				}

				this.m_A_args.push(param);
				return true;
			}
		}
		this.putError(G_SCRIPT_ERROR, `未定義引数${argv}`);
		return false;
	}

	checkType(value: number, type: any) {
		switch (type) {
			case "string":
				break;

			case "int":
				if (!(!isNaN(value))) {
					this.putError(G_SCRIPT_ERROR, `型チェック失敗int(${value})`);
					return false;
				}

				break;

			default:
				this.putError(G_SCRIPT_ERROR, `未定義の型${type}`);
				return false;
		}

		return true;
	}

	writeLog(log: { put: (arg0: any, arg1: any) => void; }, clear_log = true) {
		for (var error of Object.values(this.m_A_error)) log.put(error.type, error.message);

		if (clear_log) this.m_A_error = Array();
	}

};

export class ScriptCommand extends ScriptLogAdaptor {
	m_stdout_fault: any;
	m_unknown_type: any;
	m_stop_warning: any;
	putError: any;
	constructor(listener: ScriptLogBase, stdout_fault = false, unknown_type = G_SCRIPT_WARNING) {
		super(listener, false);
		this.m_stdout_fault = stdout_fault;
		this.m_unknown_type = unknown_type;
		this.m_stop_warning = false;
	}

	execute(cmd: any, A_args: any, A_addargs: any) {
		var A_newargs = Array();
		var all_args = [A_args, A_addargs];

		for (var one_args of all_args) {
			for (var args of one_args) {
				var arg = "";
				if (undefined !== args.key) arg += "-" + args.key;
				if (undefined !== args.addkey) arg += args.addkey;

				if (undefined !== args.value) {
					if (undefined !== args.key && args.key.length) arg += "=";
					arg += args.value;
				}

				if (arg.length) A_newargs.push(arg);
			}
		}

		return this.executeRaw(cmd, A_newargs);
	}

	executeRaw(cmd: any, A_args: { [s: string]: unknown; } | ArrayLike<unknown>) {
		var line = cmd;

		for (var arg of Object.values(A_args)) line += " " + this.escape(arg);

		return this.executeCommand(line);
	}

	executeCommand(line: string) //実行結果がエラーならログ出力
	{
		var A_rval = Array();
		var rval = undefined;
		// exec(line, A_rval, rval);
		var A_temp = Array();

		for (var msg of Object.values(A_rval)) {
			if (msg.length) A_temp.push(msg);
		}

		A_rval = A_temp;
		var status = true;

		if (0 != rval) {
			if (this.m_stop_warning) this.putError(G_SCRIPT_INFO, `プロセス実行結果${rval}(${line})`);else this.putError(G_SCRIPT_WARNING, `プロセス実行結果${rval}(${line})`);
			status = false;
		}

		for (var msg of Object.values(A_rval)) {

			const Encoding = require('encoding-japanese');
			const buffer = fs.readFileSync(msg);
			const detected = Encoding.detect(buffer);
			const enc = Encoding.convert(buffer, {
				from: detected,  to: 'UNICODE',  type: 'string',
			});

			const iconv = new Iconv("UTF-8" , enc);
			var msg = iconv.convert(msg);
			if (this.m_stdout_fault) status = false;
			if (this.m_listener.isLabel(msg)) this.m_listener.put(this.m_unknown_type, msg);else if (0 != this.m_unknown_type) this.putError(this.m_unknown_type, `未定義出力 ${msg}`);
		}

		return status;
	}

	escape(var_0: any) {
		// return escapeshellcmd(escapeshellarg(var_0)); 変更書き方がわからないので、一時放流
	}

};