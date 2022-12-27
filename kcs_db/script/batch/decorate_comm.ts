//===========================================================================
//機能：通話明細強調表示
//
//作成：森原
//===========================================================================
import { G_LOG, G_LOG_HAND } from "../../db_define/define";
import {ProcessDefault} from "./lib/process_base";
import { G_CARRIER_ALL, G_CARRIER_DOCOMO, G_CLIENT_DB } from "./lib/script_common";
import { G_SCRIPT_ERROR, G_SCRIPT_SQL } from "./lib/script_log";

const G_PROCNAME_DECORATE = "decorate_comm";
const G_OPENTIME_DECORATE = "0000,2400";
const INI_NAME = "../../conf_sync/decorate_comm.ini";
const AUTH_DECORATE = 219;

export default class ProcessDecorate extends ProcessDefault {
	m_A_carid: number[];
	m_A_telno_in: any[];
	m_H_ini: any;
	m_A_carid_all: any[];
	constructor(procname: string, logpath: string, opentime: string) //デフォルト値の設定
	//INIファイルを読み出す
	//全キャリアを読み出す
	{
		super(procname, logpath, opentime);
		this.m_args.addSetting({
			c: {
				type: "string"
			},
			t: {
				type: "string"
			}
		});
		this.m_A_carid = [G_CARRIER_ALL];
		this.m_A_telno_in = Array();
		// this.m_H_ini = parse_ini_file(INI_NAME, true);
		this.m_A_carid_all = Array();
		var sql = "select carid from carrier_tb order by carid;";
		this.m_db.getAll(sql).then((A) => {
			for (var AA of A) {
				var carid = AA[0];
				if (G_CARRIER_ALL == carid) continue;
				if (!(-1 !== this.m_A_carid_all.indexOf(carid))) this.m_A_carid_all.push(carid);
			}
		});
	}

	getProcname() {
		return "通話明細強調表示プロセス";
	}

	checkArg(args) {
		if (!super.checkArg(args)) return false;

		switch (args.key) {
			case "c":
				var result = args.value.split(",");

				for (var item of result) {
					if (isNaN(item)) {
						this.putError(G_SCRIPT_ERROR, "キャリアID不正" + args.value);
						return false;
					}
				}

				break;
		}

		return true;
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "c":
				this.m_A_carid = args.value.split(",");
				break;

			case "t":
				var telno = args.value.split(",");

				for (var no of Object.values(telno)) this.m_A_telno_in.push(no);

				break;
		}

		return true;
	}

	getUsage() {
		var rval = super.getUsage();
		rval.push(["-c=1,2,3", "処理するキャリアID(全部)"]);
		rval.push(["-t=telno[,telno...]", "処理する電話番号(全部)"]);
		return rval;
	}

	getManual() {
		var rval = super.getManual();
		rval += "処理するキャリア:" + this.m_A_carid.join(",") + "\n";

		if (this.m_A_telno_in.length) {
			rval += "処理する電話番号:" + this.m_A_telno_in.join(",") + "\n";
		}

		return rval;
	}

	getIni(pactid) //全社共通と自社の設定が無い場合の値を用意する
	//全社共通と自社の設定を上書きする
	{
		var H_rval = {
			column: "text2",
			A_tel_key: ["◎", "○"],
			A_pactid: [pactid],
			A_comm_type: {
				[G_CARRIER_DOCOMO]: ["f"]
			}
		};
		var A_key = ["common", "pact_" + pactid];
		var H_key = {
			column_name: "column",
			column_value: "A_tel_key",
			pactid: "A_pactid"
		};

		for (var key of A_key) //A_comm_type以外の設定があればコピーする
		//キャリア毎の設定があればコピーする
		{
			if (!(undefined !== this.m_H_ini[key])) continue;
			var H = this.m_H_ini[key];

			for (var from in H_key) {
				var to = H_key[from];

				if (undefined !== H[from]) {
					if ("column" !== to && !Array.isArray(H[from])) //tel_X_tbのカラム名以外は必ず配列にする
						{
							H[from] = [H[from]];
						}

					H_rval[to] = H[from];
				}
			}

			for (var carid of Object.values(this.m_A_carid_all)) {
				var from = "comm_type_" + carid;

				if (undefined !== H[from]) {
					if (!Array.isArray(H[from])) //必ず配列にする
						{
							H[from] = [H[from]];
						}

					H_rval.A_comm_type[carid] = H[from];
				}
			}
		}

		return H_rval;
	}

	async executePactid(pactid, logpath) //この顧客に強調表示権限が無ければ何もしない
	//この顧客のすべての通話明細の強調表示を解除する
	//通話明細の設定があるキャリアに対してループする
	{
		var sql = "select count(*) from fnc_relation_tb" + " where pactid=" + this.m_db.escape(pactid) + " and fncid=" + AUTH_DECORATE + ";";

		if (!this.m_db.getOne(sql)) {
			return true;
		}

		var H_ini = this.getIni(pactid);
		var A_carid: any = this.m_A_carid;
		if (1 == A_carid.length && G_CARRIER_ALL == A_carid[0]) A_carid = Array();
		var no = this.getTableNo();
		var A_telno_in = this.m_A_telno_in;
		sql = "update commhistory_" + no + "_tb" + " set decoratemode=0";
		sql += " where pactid=" + this.m_db.escape(pactid);

		if (A_carid.length) {
			sql += " and carid in (" + A_carid.join(",") + ")";
		}

		if (A_telno_in.length) {
			sql += " and telno in (" + this.implode(A_telno_in) + ")";
		}

		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		{
			let _tmp_0 = H_ini.A_comm_type;

			for (var carid in _tmp_0) //処理すべきキャリアで無ければスキップする
			{
				var A_comm_type = _tmp_0[carid];

				if (A_carid.length && !(-1 !== A_carid.indexOf(carid))) {
					continue;
				}

				sql = "update commhistory_" + no + "_tb" + " set decoratemode=1";
				sql += " where pactid=" + this.m_db.escape(pactid);
				sql += " and carid=" + carid;
				sql += " and telno in (";
				sql += "select telno from tel_" + no + "_tb";
				sql += " where pactid=" + this.m_db.escape(pactid);
				sql += " and carid=" + carid;
				sql += " and " + H_ini.column + " in (" + this.implode(H_ini.A_tel_key) + ")";
				sql += ")";
				sql += " and type in (" + this.implode(A_comm_type) + ")";
				sql += " and translate(totelno, '-', '') in (";
				sql += "select telno from tel_" + no + "_tb";
				sql += " where pactid in (" + H_ini.A_pactid.join(",") + ")";
				sql += " and carid=" + carid;
				sql += " and " + H_ini.column + " in (" + this.implode(H_ini.A_tel_key) + ")";
				sql += ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
			}
		}
		return true;
	}

	implode(A_text) {
		var rval = "";
		var is_first = true;

		for (var text of A_text) {
			if (!is_first) rval += ",";
			is_first = false;
			rval += "'" + this.m_db.escape(text) + "'";
		}

		return rval;
	}

};

// checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessDecorate(G_PROCNAME_DECORATE, log, G_OPENTIME_DECORATE);
if (!proc.readArgs(undefined)) throw process.exit(1);// 2022cvt_009
if (!proc.execute()) throw process.exit(1);// 2022cvt_009
throw process.exit(0);// 2022cvt_009
