import { ProcessBase } from './process_base';



// const fs = require('fs');
// const util = require('util');
// const openDir = util.promisify(fs.opendir);

export const G_SCRIPT_DEBUG = 1;
export const G_SCRIPT_INFO = 2;
export const G_SCRIPT_WARNING = 4;
export const G_SCRIPT_ERROR = 8;
export const G_SCRIPT_BEGIN = 16;
export const G_SCRIPT_END = 32;
export const G_SCRIPT_SQL = 64;
export const G_SCRIPT_ALL = 127;
export const G_SCRIPT_BATCH = 255;//もともとどこにも定義がないが、admin_docomo_webで使われているため定義しておく。
export const STDERR = process.stderr;
export const STDOUT = process.stdout;

const fs = require("fs");
export function fwrite_conv(msg: string, fd:any = STDOUT) {
	// if ("mb_output_handler" == ini_get("output_handler") && (STDERR === fd || STDOUT === fd)) {
	// 	fs.writeFileSync(fd, msg);
	// } else {
	// 	fs.writeFileSync(fd, msg);
	// }
};

export class ScriptLogBase {
	m_type: number;
	m_A_counter: any;
	m_A_listener: any;
	m_operator: undefined | ProcessBase;
	m_err: ScriptLogBase | undefined;
	m_path: string | undefined;
	constructor(type: number) {
		this.m_type = type;
		this.m_A_counter = Array();
		this.m_A_listener = Array();
	}

	putListener(listener: ScriptLogBase | undefined) {
		if (undefined !== listener) this.m_A_listener.push(listener);
	}

	put(type: number, message: string) {
		for (var listener of this.m_A_listener) if (undefined !== listener) listener.put(type, message);

		if (type & this.m_type) {
			if (!(undefined !== this.m_A_counter[type])) this.m_A_counter[type] = 1;else this.m_A_counter[type] = 1 + this.m_A_counter[type];
			this.do_put(type, message);
		}
	}

	putRaw(message: string) {}

	do_put(type: number, message: string) {
		var subject = this.toLabel(type) + ">" + message + "\n";
		if (G_SCRIPT_SQL == type) subject = message + "\n";
		this.putRaw(subject);
	}

	toLabel(type: number) {
		switch (type) {
			case G_SCRIPT_DEBUG:
				return "@DEBUG" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

			case G_SCRIPT_INFO:
				return "@INFO" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

			case G_SCRIPT_WARNING:
				return "@WARNING" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

			case G_SCRIPT_ERROR:
				return "@ERROR" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

			case G_SCRIPT_BEGIN:
				return "@BEGIN" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

			case G_SCRIPT_END:
				return "@END" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

			case G_SCRIPT_SQL:
				return "";
		}

		return `unknown(${type})`;
	}

	isLabel(message: { match: (arg0: string) => any; }) {
		if (message.match("/@DEBUG/")) return true;
		if (message.match("/@INFO/")) return true;
		if (message.match("/@WARNING/")) return true;
		if (message.match("/@ERROR/")) return true;
		if (message.match("/@BEGIN/")) return true;
		if (message.match("/@END/")) return true;
		return false;
	}

	putOperator(type: number, message: string) {
		if (undefined !== this.m_operator) this.m_operator.putOperator(type, message);
	}

	setPath(m_listener, m_curpath, pactid) {

	}

};

export class ScriptLogFile extends ScriptLogBase {
	m_file_name: any;
	makeFileName(tgtname: string) {
		var nowdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("");
		return tgtname.replace("%s",nowdate);
	}

	constructor(type: number, tgtname: string) {
		super(type);
		this.m_file_name = tgtname;
	}

	putRaw(message: string) {
		var mfilename:any = this.m_file_name;
		if ((mfilename.toUpperCase() === "stdout".toUpperCase()) == false) {
			fwrite_conv(message);
			return;
		}

		if ((mfilename.toUpperCase() === "stderr".toUpperCase()) == false) {
			fwrite_conv(message, STDERR);
			return;
		}

		var fp = fs.createReadStream(this.m_file_name,{flag: "at"});

		if (!fp) {
			fwrite_conv(message);
			return;
		}

		fwrite_conv(message, fp);
		fp.end("\n");
	}

};

export class ScriptLogAdaptor {
	m_listener: ScriptLogBase;
	m_exit_on_error: boolean;
	constructor(listener: ScriptLogBase, exit_on_error: boolean) {
		this.m_listener = listener;
		this.m_exit_on_error = exit_on_error;
	}

	putError(type: number, message: string) {
		if (G_SCRIPT_SQL == type) this.m_listener.put(type, message);else this.m_listener.put(type, this.constructor.name + "::" + message);
		if (this.m_exit_on_error && G_SCRIPT_ERROR & type) throw process.exit(1);
	}

	putOperator(type: number, message: string) {
		this.m_listener.putOperator(type, message);
	}


};