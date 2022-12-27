//機能：購買の再計算プロセス
//作成：森原

import { G_LOG, G_LOG_RECALC } from '../../db_define/define';
import { ProcessRecalcBase } from './lib/update_bill_item';

const G_PROCNAME_RECALC_PURCHASE = "purchase_recalc";
const G_OPENTIME_RECALC_PURCHASE = "0000,2400";

export class ProcessRecalcPurchase extends ProcessRecalcBase {
	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime, true);
	}

	initName() {
		this.m_O_name.initPurchase();
	}

};

var log = G_LOG;

if ("undefined" !== typeof G_LOG_RECALC) {
	log = G_LOG_RECALC;
}

const proc = new ProcessRecalcPurchase(G_PROCNAME_RECALC_PURCHASE, log, G_OPENTIME_RECALC_PURCHASE);
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
