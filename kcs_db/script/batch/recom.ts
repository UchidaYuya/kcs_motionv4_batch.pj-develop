//===========================================================================
//機能：シミュレーションプロセス(汎用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：シミュレーションプロセス(汎用)
// error_reporting(E_ALL);// 2022cvt_011

import { G_LOG, G_LOG_HAND } from "../../db_define/define";
import { ProcessBase, ProcessDefault } from "./lib/process_base";
import { G_CARRIER_ALL, G_CARRIER_AU, G_CARRIER_DOCOMO, G_CLIENT_DB } from "./lib/script_common";
import { TableInserter } from "./lib/script_db";
import { G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING } from "./lib/script_log";
import UpdateRecomAU from './lib/update_recom_au';
import UpdateRecomDocomo from './lib/update_recom_au';
// 2022cvt_026
// require("lib/process_base.php");

// 2022cvt_026
// require("lib/update_recom_au.php");

// 2022cvt_026
// require("lib/update_recom_docomo.php");

export const G_PROCNAME_RECOM = "recom";
export const G_OPENTIME_RECOM = "0000,2400";

//処理するキャリアID
//処理する電話番号
//スキップする電話番号
//処理する月数の配列
//追加ログを出すならtrue
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：一個のARGVの内容を確認する
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客ごと、キャリアごとの処理を行う
//引数：顧客ID
//作業ファイル保存先
//キャリアID
//返値：深刻なエラーが発生したらfalseを返す
export default class ProcessRecom extends ProcessDefault {
	m_A_telno: any[];
	m_A_skip: any[];
	m_A_monthcnt: number[];
	m_assert: number;
	m_A_carid: any[];
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime);
		this.m_args.addSetting({
			c: {
// 2022cvt_016
				type: "string"
			},
			t: {
// 2022cvt_016
				type: "string"
			},
			T: {
// 2022cvt_016
				type: "string"
			},
			s: {
// 2022cvt_016
				type: "string"
			},
			D: {
// 2022cvt_016
				type: "int"
			}
		});
		this.m_A_telno = Array();
		this.m_A_skip = Array();
		this.m_A_monthcnt = [1, 3, 6, 12];
		this.m_assert = 1;
		this.m_A_carid = [G_CARRIER_ALL];
	}

	getProcname() {
		return "シミュレーションプロセス(汎用)";
	}

	checkArg(args) {
		if (!ProcessBase.checkArg(args)) return false;

		switch (args.key) {
			case "s":
// 2022cvt_015
				var A_month = args.value.split(",");

// 2022cvt_015
				for (var month of A_month) {
					if (month < 1 || 12 < month) {
						this.putError(G_SCRIPT_ERROR, `シミュレーション期間が不正${month}`);
						return false;
					}
				}

				if (0 == A_month.length) {
					this.putError(G_SCRIPT_ERROR, "シミュレーション期間がない" + args.value);
					return false;
				}

				break;

			case "c":
// 2022cvt_015
				var A_carid = args.value.split(",");

// 2022cvt_015
				for (var carid of A_carid) {
// 2022cvt_016
					if (!isNaN(carid)) {
						this.putError(G_SCRIPT_ERROR, "キャリアIDが不正");
						return false;
					}
				}

				break;
		}

		return true;
	}

	commitArg(args) {
		if (!ProcessDefault.commitArg(args)) return false;

		switch (args.key) {
			case "t":
// 2022cvt_015
				var telno = args.value.split(",");

// 2022cvt_015
				for (var no of Object.values(telno)) this.m_A_telno.push(no);

				break;

			case "T":
				telno = args.value.split(",");

// 2022cvt_015
				for (var no of Object.values(telno)) this.m_A_skip.push(no);

				break;

			case "s":
				this.m_A_monthcnt = Array();
// 2022cvt_015
				var A_month = args.value.split(",");

// 2022cvt_015
				for (var month of A_month) {
					if (1 <= month && month <= 12) {
						if (!(-1 !== this.m_A_monthcnt.indexOf(month))) this.m_A_monthcnt.push(month);
					}
				}

				break;

			case "c":
				this.m_A_carid = args.value.split(",");
				break;

			case "D":
				this.m_assert = args.value;
				break;
		}

		return true;
	}

	getUsage() {
// 2022cvt_015
		var rval = ProcessDefault.getUsage();
		rval.push(["-t=telno[,telno...]", "処理する電話番号(全部)"]);
		rval.push(["-T=telno[,telno...]", "処理しない電話番号(なし)"]);
		rval.push(["-s=num[,num...]", "処理する月数(1,3,6,12)"]);
		rval.push(["-D=0,1,2", "追加ログ出力レベル"]);
		rval.push(["-c=1,2,3", "処理するキャリアID(1,3)"]);
		return rval;
	}

	getManual() {
// 2022cvt_015
		var rval = ProcessDefault.getManual();
		rval += "処理するキャリアID";

// 2022cvt_015
		for (var carid of Object.values(this.m_A_carid)) rval += "," + carid;

		rval += "\n";

		if (this.m_A_telno.length) {
			rval += "処理する電話番号";

// 2022cvt_015
			for (var telno of Object.values(this.m_A_telno)) rval += "," + telno;

			rval += "\n";
		}

		if (this.m_A_skip.length) {
			rval += "処理しない電話番号";

// 2022cvt_015
			for (var telno of Object.values(this.m_A_skip)) rval += "," + telno;

			rval += "\n";
		}

		rval += "処理する期間";

// 2022cvt_015
		for (var monthcnt of Object.values(this.m_A_monthcnt)) rval += "," + monthcnt;

		rval += "\n";
		rval += "追加ログ出力レベル" + this.m_assert + "\n";
		return rval;
	}

	executePactid(pactid, logpath) {
		if (-1 !== this.m_A_carid.indexOf(G_CARRIER_ALL)) this.m_A_carid = [G_CARRIER_DOCOMO, G_CARRIER_AU];

// 2022cvt_015
		for (var carid of Object.values(this.m_A_carid)) if (!this.execute_carid(pactid, logpath, carid)) return false;

		return true;
	}

	execute_carid(pactid, logpath, carid) //sim_trend_X_tbにレコードが無ければ処理しない
	{
// 2022cvt_015
		var no = this.getTableNo();
// 2022cvt_015
		var sql = "select count(*) from sim_trend_" + no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + carid;
		sql += ";";

		if (0 == this.m_db.getOne(sql)) {
			this.putError(G_SCRIPT_INFO, "sim_trend_X_tbにcarid(" + carid + ")のレコードが無いので処理せず" + pactid);
			return true;
		}

		if (G_CARRIER_DOCOMO == carid) //更新型の作成
			//既存レコードの削除
			{
// 2022cvt_015
				var ins_recom = new TableInserter(this.m_listener, this.m_db, logpath + "plan_recom_tb_" + carid + ".insert", true);
// 2022cvt_015
				var ins_log = new TableInserter(this.m_listener, this.m_db, logpath + "sim_log_tb_" + carid + ".insert", true);
// 2022cvt_015
				var update_recom = new UpdateRecomDocomo(this.m_listener, this.m_db, this.m_table_no, ins_recom, ins_log, Array(), this.m_A_monthcnt, this.m_assert);
				if (!update_recom.delete(pactid, this.m_year, this.m_month, this.m_A_telno, this.m_A_skip, logpath + "plan_recom_tb_" + carid + ".delete", true)) return false;
				if (!update_recom.execute(pactid, this.m_year, this.m_month, this.m_A_telno, this.m_A_skip)) return false;
			} else if (G_CARRIER_AU == carid) //AUを処理する
			//更新型の作成
			//既存レコードの削除
			{
				ins_recom = new TableInserter(this.m_listener, this.m_db, logpath + "plan_recom_tb_" + carid + ".insert", true);
				ins_log = new TableInserter(this.m_listener, this.m_db, logpath + "sim_log_tb_" + carid + ".insert", true);
				update_recom = new UpdateRecomAU(this.m_listener, this.m_db, this.m_table_no, ins_recom, ins_log, Array(), this.m_A_monthcnt, this.m_assert);
				if (!update_recom.delete(pactid, this.m_year, this.m_month, this.m_A_telno, this.m_A_skip, logpath + "plan_recom_tb_" + carid + ".delete", true)) return false;
				if (!update_recom.execute(pactid, this.m_year, this.m_month, this.m_A_telno, this.m_A_skip)) return false;
			} else {
			this.putError(G_SCRIPT_WARNING, "carid(" + carid + ")は処理できない");
		}

		return true;
	}

};

// checkClient(G_CLIENT_DB);
// 2022cvt_015
var log = G_LOG;
// 2022cvt_016
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
// 2022cvt_015
var proc = new ProcessRecom(G_PROCNAME_RECOM, log, G_OPENTIME_RECOM);
if (!proc.readArgs(undefined)) throw process.exit(1);// 2022cvt_009
if (!proc.execute()) throw process.exit(1);// 2022cvt_009
throw process.exit(0);// 2022cvt_009
