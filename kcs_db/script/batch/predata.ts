//機能：標準割引率など算出プロセス(ドコモ、au、Softbank対応)
//
//作成：中西	2006/11/15


import { G_LOG } from '../../db_define/define';
import { ProcessCarid } from './lib/process_base';
import { G_CARRIER_DOCOMO, G_CARRIER_AU, G_CARRIER_VODA, G_CLIENT_DB } from './lib/script_common';
import { TableInserter } from './lib/script_db';
import { G_SCRIPT_ERROR, ScriptLogAdaptor } from './lib/script_log';
import UpdatePredata from './lib/update_predata';

export const G_PROCNAME_PREDATA = "predata";
export const G_OPENTIME_PREDATA = "0000,2400";

export default class ProcessPredata extends ProcessCarid {
	IS_CARID: boolean;
	m_A_telno: any;
	m_A_skip: any;

	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime);
		this.IS_CARID = false;
		this.m_args.addSetting({
			t: {
				type: "string"
			},
			T: {
				type: "string"
			}
		});
		this.m_A_telno = Array();
		this.m_A_skip = Array();
	}

	getProcname() {
		return "標準割引率など算出プロセス(ドコモ、au、Softbank対応)";
	}

	checkArgCnt(args: string | string[]) {
		if (args.length <= 1) {
			this.putError(G_SCRIPT_ERROR, "キャリアID指定は必須です、-c=(" + G_CARRIER_DOCOMO + ":ドコモ, " + G_CARRIER_AU + ":au, " + G_CARRIER_VODA + ":Softbank)");
			return false;
		}

		return true;
	}

	checkIsCarid() {
		if (this.IS_CARID == false) {
			this.putError(G_SCRIPT_ERROR, "\キャリアID指定は必須です、-c=(" + G_CARRIER_DOCOMO + ":ドコモ, " + G_CARRIER_AU + ":au, " + G_CARRIER_VODA + ":Softbank)");
			return false;
		}

		return true;
	}

	checkArg(args: { key: any; value: string; }) {
		if (!super.checkArg(args)) return false;

		switch (args.key) {
			case "c":
				if (0 == args.value.length) {
					this.putError(G_SCRIPT_ERROR, "キャリアIDがない");
				}

				var A_carid: any = args.value.split(",");

				for (var carid of Object.values(A_carid)) {
					switch (carid) {
						case G_CARRIER_DOCOMO:
						case G_CARRIER_AU:
						case G_CARRIER_VODA:
							this.IS_CARID = true;
							break;

						default:
							this.putError(G_SCRIPT_ERROR, `対象外のキャリアID,${carid}`);
							return false;
					}
				}

				break;
		}

		return true;
	}

	commitArg(args: any) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "t":
				var telno = args.value.split(",");

				for (var no of Object.values(telno)) this.m_A_telno.push(no);

				break;

			case "T":
				telno = args.value.split(",");

				for (var no of Object.values(telno)) this.m_A_skip.push(no);

				break;
		}

		return true;
	}

	getUsage() {
		var rval = super.getUsage();
		rval.push(["-t=telno[,telno...]", "処理する電話番号(全部)"]);
		rval.push(["-T=telno[,telno...]", "処理しない電話番号(なし)"]);
		return rval;
	}

	getManual() {
		var rval = super.getManual();

		if (this.m_A_telno.length) {
			rval += "処理する電話番号";

			for (var telno of Object.values(this.m_A_telno)) rval += "," + telno;

			rval += "\n";
		}

		if (this.m_A_skip.length) {
			rval += "処理しない電話番号";

			for (var telno of Object.values(this.m_A_skip)) rval += "," + telno;

			rval += "\n";
		}

		return rval;
	}

	async executePactid(pactid: number, logpath: string) //更新型の作成
	//既存レコードの削除
	{
		var no = this.getTableNo();
		var ins_predata = new TableInserter(this.m_listener, this.m_db, logpath + "sim_trend_" + no + "_tb.insert", "true");
		var update_predata = new UpdatePredata(this.m_listener, this.m_db, this.m_table_no, ins_predata);
		if (!update_predata.delete(pactid, Number(this.m_carid), this.m_year, this.m_month, this.m_A_telno, this.m_A_skip, logpath + "sim_trend_" + no + "_tb.delete")) return false;
		if (!update_predata.execute(pactid, Number(this.m_carid), this.m_year, this.m_month, this.m_A_telno, this.m_A_skip)) return false;
		return true;
	}

};

// checkClient(G_CLIENT_DB);
var proc = new ProcessPredata(G_PROCNAME_PREDATA, G_LOG, G_OPENTIME_PREDATA);
if (!proc.checkArgCnt(process.argv)) throw process.exit(1);
if (!proc.readArgs(undefined)) throw process.exit(1);
if (!proc.checkIsCarid()) throw process.exit(1);
if (!proc.execute()) throw process.exit(1);
throw process.exit(0);
