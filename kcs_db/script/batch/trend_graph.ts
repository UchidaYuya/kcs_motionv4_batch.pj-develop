//機能：電話利用グラフのために統計情報を電話ごとに集計する(ドコモ、au、Softbank対応)//作成：中西
//日付：2009/01/13	新規作成

import { G_LOG } from "../../db_define/define";
import { ProcessBase, ProcessCarid } from "./lib/process_base";
import { G_CARRIER_AU, G_CARRIER_DOCOMO, G_CARRIER_VODA, G_CLIENT_DB } from "./lib/script_common";
import { G_SCRIPT_ERROR } from "./lib/script_log";
import updateTrendGraph from "./lib/update_trend_graph";

const G_PROCNAME_TREND_ALL = "trend_graph";
const G_OPENTIME_TREND_ALL = "0000,2400";

export default class ProcessTrendGraph extends ProcessCarid {
	IS_CARID: boolean = false;

	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime);
	}

	getProcname() {
		return "電話利用グラフのための統計情報集計";
	}

	checkArgCnt(args: string | any[]) {
		if (args.length <= 1) {
			this.putError(G_SCRIPT_ERROR, "キャリアID指定は必須です、-c=(" + G_CARRIER_DOCOMO + ":ドコモ, " + G_CARRIER_AU + ":au, " + G_CARRIER_VODA + ":Softbank)");
			return false;
		}

		return true;
	}

	checkIsCarid() {
		if (this.IS_CARID == false) {
			this.putError(G_SCRIPT_ERROR, "キャリアID指定は必須です、-c=(" + G_CARRIER_DOCOMO + ":ドコモ, " + G_CARRIER_AU + ":au, " + G_CARRIER_VODA + ":Softbank)");
			return false;
		}

		return true;
	}

	checkArg(args: { key: any; value: string; }) {
		if (super.checkArg(args)) return false;

		switch (args.key) {
			case "c":
				if (0 == args.value.length) {
					this.putError(G_SCRIPT_ERROR, "キャリアIDがない");
				}

				var A_carid:any = args.value.split(",");

				for (var carid of A_carid) {
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

	async executePactid(pactid: number, logpath: string) //既存レコードの削除
	{
		var update_trend = new updateTrendGraph(this.m_listener, this.m_db, this.m_table_no);

		if (!update_trend.delete(pactid, this.m_carid, this.m_year, this.m_month)) {
			return false;
		}

		if (!update_trend.execute(pactid, this.m_carid, this.m_year, this.m_month)) {
			return false;
		}

		return true;
	}

};

// checkClient(G_CLIENT_DB);
var proc = new ProcessTrendGraph(G_PROCNAME_TREND_ALL, G_LOG, G_OPENTIME_TREND_ALL);
if (!proc.checkArgCnt(process.argv)) throw process.exit(1);
if (!proc.readArgs(undefined)) throw process.exit(1);
if (!proc.checkIsCarid()) throw process.exit(1);
if (!proc.execute()) throw process.exit(1);
throw process.exit(0);
