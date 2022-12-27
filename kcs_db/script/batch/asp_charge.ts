import { ProcessCarid }from "../batch/lib/process_base";
import { G_LOG, G_LOG_HAND } from "../../db_define/define";
import { ScriptDB, TableInserter } from "../batch/lib/script_db";
import { UpdateAspCharge } from "../batch/lib/update_asp_charge";

export const G_PROCNAME_ASP_CHARGE = "asp_charge";
export const G_OPENTIME_ASP_CHARGE = "0000,2400";

//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
export default class ProcessAspCharge extends ProcessCarid {
	ProcessCarid: any;
	getTableNo: any;
	m_listener: any
	m_db!: ScriptDB;
	m_carid: string = "";
	m_year: any;
	m_month: any;
	readArgs: any;
	execute: any;

	// ProcessAspCharge(procname, logpath, opentime) {
	// 	this.ProcessCarid(procname, logpath, opentime);
	constructor(procname: string, logpath: string, opentime: string) {
		super(procname, logpath, opentime);
	}

	getProcname() {
		return "ASPASP利用料挿入プロセス";
	}

	async executePactid(pactid: any, logpath: string) //既存レコードを削除する
	{
// 2022cvt_015
		var no = this.getTableNo();
// 2022cvt_015
		var O_ins = new TableInserter(this.m_listener, this.m_db, logpath + "tel_details_" + no + "_tb.insert", true);
// 2022cvt_015
		var O_asp_charge = new UpdateAspCharge(this.m_listener, this.m_db, this.m_table_no, O_ins);
		if (!O_asp_charge.delete(pactid, this.m_carid, this.m_year, this.m_month, logpath + "tel_details_" + no + "_tb.delete")) return false;
		if (!O_asp_charge.execute(pactid, this.m_carid, this.m_year, this.m_month)) return false;
		return true;
	}

};

(async ()=>{
// checkClient(G_CLIENT_DB);
// 2022cvt_015
var log = G_LOG;
// 2022cvt_016
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
// 2022cvt_015
var proc = new ProcessAspCharge(G_PROCNAME_ASP_CHARGE, log, G_OPENTIME_ASP_CHARGE);
if (!proc.readArgs(undefined)) throw process.exit(1);// 2022cvt_009
if (!proc.execute()) throw process.exit(1);// 2022cvt_009
throw process.exit(0);// 2022cvt_009
})();
