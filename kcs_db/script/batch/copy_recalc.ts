//===========================================================================
//機能：コピーの再計算プロセス
//
//作成：森原
//===========================================================================
import { G_LOG, G_LOG_RECALC } from "../../db_define/define";
import { G_CLIENT_DB } from "./lib/script_common";
import { ScriptLogBase } from "./lib/script_log";
import {ProcessRecalcBase} from "./lib/update_bill_item";

const G_PROCNAME_RECALC_COPY = "copy_recalc";
const G_OPENTIME_RECALC_COPY = "0000,2400";

export default class ProcessRecalcCopy extends ProcessRecalcBase {
	constructor(procname: string | ScriptLogBase, logpath: string, opentime: string) {
		super(procname, logpath, opentime, "コピー再計算プロセス");
	}

	initName() {
		this.m_O_name.initCopy();
	}

};

// checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_RECALC) {
	log = G_LOG_RECALC;
}

var proc = new ProcessRecalcCopy(G_PROCNAME_RECALC_COPY, log, G_OPENTIME_RECALC_COPY);
proc.initHist();

if (false == proc.readArgs(undefined)) {
	throw process.exit(1);
}

if (false == proc.isRequest()) {
	throw process.exit(0);
}

proc.execute().then((res) => {
	if (false == res) {
		throw process.exit(1);
	}
})

throw process.exit(0);
