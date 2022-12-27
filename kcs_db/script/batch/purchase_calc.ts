//機能：購買の計算プロセス

import { G_LOG, G_LOG_HAND } from '../../db_define/define';
import { ProcessCalcBase } from './lib/update_bill_item';

export const G_PROCNAME_CALC_PURCHASE = "purchase_calc";
export const G_OPENTIME_CALC_PURCHASE = "0000,2400";

export default class ProcessCalcPurchase extends ProcessCalcBase {
	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime,true);
	}

	initName() {
		this.m_O_name.initPurchase();
	}

};

let log = G_LOG;


if ("undefined" !== typeof G_LOG_HAND) {
	log = G_LOG_HAND;
}

const proc = new ProcessCalcPurchase(G_PROCNAME_CALC_PURCHASE, log, G_OPENTIME_CALC_PURCHASE);
proc.initHist();

if (false == proc.readArgs(undefined)) {
	throw process.exit(1);
}
proc.execute().then((res) => {
	if (res == false) {
		throw process.exit(1);
	}
})
throw process.exit(0);
