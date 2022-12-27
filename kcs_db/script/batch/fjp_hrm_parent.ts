
import { ProcessBase, ProcessLog } from './lib/process_base';
// import {  } from './lib/fjp_hrm_const';
import { FJPProcParentType } from './lib/fjp_hrm_common';
import { G_SCRIPT_WARNING, G_SCRIPT_DEBUG } from './lib/script_log'
import { G_PHP } from './lib/script_common';
import { G_LOG } from '../../db_define/define';

const G_PROCNAME_FJP_HRM_PARENT = "fjp_hrm_parent";
const G_OPENTIME_FJP_HRM_PARENT = "0000,2400";

export class ProcessFJPHRMParent extends ProcessBase {

	m_command: any;
	m_is_create_log: any;
	m_A_option: any;

	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime);
		this.m_command = "";
		this.m_is_create_log = true;
		this.m_A_option = Array();
		this.m_args.addSetting({
			X: {
				type: "string"
			},
			x: {
				type: "string"
			},
			c: {
				type: "int"
			}
		});
	}

	getProcname() {
		// return "FJP\u4EBA\u4E8B\u30DE\u30B9\u30BF\u89AA\u30D7\u30ED\u30BB\u30B9";
		return "FJP人事マスタ親プロセス";
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "X":
				this.m_command = args.value;
				break;

			case "x":
				this.m_A_option.push(args.value);

			case "c":
				this.m_is_create_log = "0" != args.value;
				break;
		}

		return true;
	}

	getUsage() {
		// var rval = ProcessBase.getUsage();
		var rval = this.getUsage();
		// rval.push(["-X=...", "\u5B9F\u884C\u3059\u308Bphp\u30D5\u30A1\u30A4\u30EB"]);
		// rval.push(["-x=...", "\u8D77\u52D5\u6642\u30AA\u30D7\u30B7\u30E7\u30F3"]);
		// rval.push(["-c={0|1}", "\u30ED\u30B0\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3092\u5165\u308C\u5B50\u306B\u3059\u308B\u306A\u30891(1)"]);

		rval.push(["-X=...", "実行するphpファイル"]);
		rval.push(["-x=...", "起動時オプション"]);
		rval.push(["-c={0|1}", "ログディレクトリを入れ子にするなら1(1)"]);
		return rval;
	}

	getManual() {
		// var rval = ProcessBase.getManual();
		var rval = this.getManual();
		// rval += "\u5B9F\u884C\u30B3\u30DE\u30F3\u30C9 " + this.m_command + "\n";
		// rval += "\u8D77\u52D5\u6642\u30AA\u30D7\u30B7\u30E7\u30F3" + (this.m_A_option.length ? "" : "\u7121\u3057") + "\n";
		rval += "実行コマンド" + this.m_command + "\n";
		rval += "起動時オプション" + (this.m_A_option.length ? "" : "無し") + "\n";

		// for (var option of Object.values(this.m_A_option)) rval += "\t" + option + "\n";
		for (var option of this.m_A_option) rval += "\t" + option + "\n";

		// rval += "\u30ED\u30B0\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3092\u5165\u308C\u5B50\u306B" + (this.m_is_create_log ? "\u3059\u308B" : "\u3057\u306A\u3044") + "\n";
		rval += "ログディレクトリを入れ子に" + (this.m_is_create_log ? "する" : "\しない") + "\n";
		return rval;
	}

	init() {

		// var procname = str_replace(".php", "", this.m_command);
		var procname = this.m_command.replaceAll(".php", "");

		// procname = str_replace("fjp_hrm", procname, this.m_procname);
		procname = this.m_procname.replace("fjp_hrm", procname);
		this.m_listener_process = new ProcessLog(0);
		// if (!this.m_listener_process.setPath(this.m_listener, this.m_logpath, procname + date("YmdHis") + "/")) return false;
		if (!this.m_listener_process.setPath(this.m_listener, this.m_logpath, procname + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + "/")) return false;
		this.m_curpath = this.m_listener_process.m_path;
		this.m_listener_error.putListener(this.m_listener_process.m_err);
		this.m_listener.m_A_listener = Array();
		this.m_listener.putListener(this.m_listener_process);
		this.m_listener.putListener(this.m_listener_error);
		return true;
	}

	async do_execute() //実行コマンドがなければ終了
	//モデルを作成する
	//子プロセスを実行する
	//トランザクション破棄または反映
	{
		if (!this.m_command.length) {
			// this.putError(G_SCRIPT_WARNING, "\u5B9F\u884C\u30B3\u30DE\u30F3\u30C9\u304C\u5B58\u5728\u3057\u306A\u3044");
			this.putError(G_SCRIPT_WARNING, "実行コマンドが存在しない");
			return false;
		}

		var exectype = -1;
		var label = "";

		// if (false !== strpos(this.m_command, "fjp_hrm_precheck.php")) {
		if (false !== this.m_command.indexOf("fjp_hrm_precheck.php")) {
			exectype = 1;
			label = "事前チェック";
		// } else if (false !== strpos(this.m_command, "fjp_hrm_import.php")) {
		} else if (false !== this.m_command.indexOf("fjp_hrm_import.php")) {
			exectype = 0;
			label = "取込";
		// } else if (false !== strpos(this.m_command, "fjp_hrm_copy.php")) {
		} else if (false !== this.m_command.indexOf("fjp_hrm_copy.php")) {
			exectype = 2;
			label = "コピー";
		}

		if (exectype < 0) {
			// this.putError(G_SCRIPT_WARNING, "FJP\u306E\u6709\u52B9\u306A\u5B50\u30D7\u30ED\u30BB\u30B9\u3067\u306F\u306A\u3044" + this.m_command);
			this.putError(G_SCRIPT_WARNING, "FJPの有効な子プロセスではない" + this.m_command);
			return false;
		}

		var cmd = this.m_command;

		// for (var option of Object.values(this.m_A_option)) cmd += " '" + option + "'";
		for (var option of this.m_A_option) cmd += " '" + option + "'";

		if (this.m_is_create_log) cmd += " '-l=" + this.m_listener_process!.m_path + "'";
		cmd = G_PHP + " " + cmd;
		// this.putError(G_SCRIPT_DEBUG, "\u5B9F\u884C\u30B3\u30DE\u30F3\u30C9 " + cmd);
		this.putError(G_SCRIPT_DEBUG, "実行コマンド " + cmd);
		var O_model = new FJPProcParentType(this.m_listener, this.m_db, this.m_table_no, this.m_listener_process!.m_path, cmd, label, exectype.toString());
		var status = -1;
		var H_result = Array();
		var A_buffer = Array();
		if (!O_model.executeChild(status, H_result, A_buffer)) return false;
		if (-1 == status) return true;
		this.beginDB();
		var is_ok = await O_model.executeInsert(status.toString(), H_result, A_buffer);
		this.endDB(is_ok);
		return is_ok;
	}

};
(() => {
	// checkClient(G_CLIENT_DB);
	var log = G_LOG;
	// if ("undefined" !== typeof G_LOG_CLAMP) log = G_LOG_CLAMP;
	var proc = new ProcessFJPHRMParent(G_PROCNAME_FJP_HRM_PARENT, log, G_OPENTIME_FJP_HRM_PARENT);
	if (!proc.readArgs(undefined)) throw process.exit(1);
	if (!proc.execute()) throw process.exit(1);
	throw process.exit(0);
})();