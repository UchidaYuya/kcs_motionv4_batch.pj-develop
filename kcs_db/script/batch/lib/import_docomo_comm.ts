//===========================================================================
//機能：請求明細をファイルからDBに取り込む(ドコモ専用)
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：通話明細をファイルからDBに取り込む(ドコモ専用)
//備考：クランプファイルの種別は、setTypeメソッドの引数で使用する値と、
//クラス内部で識別に用いる値とで異なる。
//setTypeメソッドに渡す値は、download_docomoのgetTypeTelメソッドが
//返す値を使用する。
// 2022cvt_016
//クラス内部では、commhistory_X_tb.typeの値を識別に用いる。

// 2022cvt_026
// require("import_docomo_base.php");
import { ImportDocomoBase } from "./import_docomo_base"
import { G_AUTH_KOUSI, G_CARRIER_DOCOMO, G_CIRCUIT_DOCOMO_XI, G_CIRCUIT_FOMA, G_CIRCUIT_MOVA, G_CIRCUIT_PHS, G_PACKET_CHARGE, G_PACKET_CHARGE_FOMA, G_PACKET_SIZE, G_SIMWAY_DATA_NEW } from "./script_common";
import { G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING } from "./script_log";

export default class ImportDocomoComm extends ImportDocomoBase {
	m_inserter: any;
	m_inserter_from: any;
	m_inserter_to: any;
	m_A_kousi_type: any[];
	m_A_multinumber_private: any[];
	m_H_kousi_to: any[] = [];
	m_H_kousi_occup: any[] = [];
	m_H_kousi_multinumber: any[] = [];
	m_A_sum: any[] = [];
	m_mova_default: any;
	m_foma_default: any;
	m_A_packet: any[] = [];
	m_base_kousi_stop: boolean = false;
	m_base_kousi_default: boolean = false;
	m_base_kousi: number = 0;
	m_year: number = 0;
	m_month: number = 0;
	m_linetype: any[] = [];
	m_A_param_admin: { yyyymm: number[]; clampid: number[]; } = {
		yyyymm: [],
		clampid: []
	};
	m_param_parent: any[] = [];
	m_insert_charge: boolean = false;
	m_insert_byte: boolean = false;
	m_insert_kousi: boolean = false;
	m_type: string = "";
	m_cirid: number = 0;
	m_linesize: number = 0;
	m_A_param_details: any[][] = [];
	m_A_param_total: any[][] = [];
	m_A_empty: any;
	m_pactid: any;
	m_index_byte: any;
	m_index_telno: any;
	m_index_charge: any;
	m_index_type: any;
	m_index_time: any;
	m_index_byte_mail: any;
	m_index_byte_site: any;
	m_index_byte_other: any;
	m_index_kousi: any;
	m_index_to: any;
	m_index_occup: any;
	m_index_multinumber: any;
	m_force: any;
	m_cur_telno: any;
	m_cur_kousi_stop: boolean = false;
	m_cur_kousi: number = 0;

	constructor(listener: any, db: any, table_no: any, tel_tb: any, check_parent_all: any, force: any, inserter: any, inserter_from: any, inserter_to: any, A_parent_error: any) {
		super(listener, db, table_no, tel_tb, check_parent_all, force, A_parent_error)
		this.m_inserter = inserter;
		this.m_inserter_from = inserter_from;
		this.m_inserter_to = inserter_to;
		// 2022cvt_016
		this.m_A_kousi_type = Array();
		this.m_A_multinumber_private = Array();
		this.ini();
	}

	async ini () {
// 2022cvt_016
// 2022cvt_015
		var sql = "select type from kousi_commtype_tb";
		sql += " where carid=" + G_CARRIER_DOCOMO;
		sql += ";";
// 2022cvt_015
		var result = await this.m_db.getAll(sql);

// 2022cvt_016
// 2022cvt_015
		for (var line of result) {
			this.m_A_kousi_type.push(line[0]);
		}

		this.m_A_multinumber_private = Array();
		sql = " select multinumber" + " from multinumber_private_tb" + ";";
		result = await this.m_db.getAll(sql);

// 2022cvt_015
		for (var line of result) {
			this.m_A_multinumber_private.push("C" + line[0]);
		}
	}

	delete(pactid: any, year: number, month: number, fname: string, fname_from: string, fname_to: string) //公私電話マスター(相手先)の削除
	//公私電話マスター(用途別・マルチナンバー)の削除
	{
// 2022cvt_015
		var table_no = this.getTableNo(year, month);
// 2022cvt_015
		var sqlfrom = " from commhistory_" + table_no + "_tb";
		sqlfrom += " where pactid=" + this.escape(pactid);
		sqlfrom += " and carid=" + this.escape(G_CARRIER_DOCOMO);

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) {
				return false;
			}
		}

// 2022cvt_015
		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		sqlfrom = " from kousi_totel_master_tb" + " where pactid=" + this.escape(pactid);
		sqlfrom += " and kousiflg not in ('0', '1')";
		sqlfrom += " and carid=" + this.escape(G_CARRIER_DOCOMO);

		if (fname_to.length) {
			if (!this.m_db.backup(fname_to, "select *" + sqlfrom + ";")) return false;
		}

		sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		sqlfrom = " from kousi_fromtel_master_tb" + " where pactid=" + this.escape(pactid);
		sqlfrom += " and kousiflg not in ('0', '1')";
		sqlfrom += " and carid=" + this.escape(G_CARRIER_DOCOMO);

		if (fname_from.length) {
			if (!this.m_db.backup(fname_from, "select *" + sqlfrom + ";")) return false;
		}

		sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	async begin(pactid: number, year: number, month: number) //パケットパック無しの単価を取り出す
	//FOMAデータプランのパケット単価を取り出す
	//公私権限があるかチェック
	//顧客単位のベース公私を取り出す
	{
		this.m_H_kousi_to = Array();
		this.m_H_kousi_occup = Array();
		this.m_H_kousi_multinumber = Array();
// 2022cvt_015
		var table_no = this.getTableNo(year, month);

		if (!this.setPactid(pactid, year, month)) {
			this.putError(G_SCRIPT_WARNING, `setPactid/${pactid},${year},${month}`);
			return false;
		}

// 2022cvt_015
		var const_0 = {
			pactid: pactid,
			carid: G_CARRIER_DOCOMO
		};

		if (!this.m_inserter.setConst(const_0)) {
			this.putError(G_SCRIPT_WARNING, `inserter->setConst/${pactid},${year},${month}`);
			return false;
		}

		if (!this.m_inserter.begin("commhistory_" + table_no + "_tb")) {
			this.putError(G_SCRIPT_WARNING, `inserter->begin/${pactid},${year},${month}`);
			return false;
		}

		if (!this.m_inserter_from.begin("kousi_fromtel_master_tb")) {
			this.putError(G_SCRIPT_WARNING, `inserter_from->begin/${pactid},${year},${month}`);
			return false;
		}

		if (!this.m_inserter_to.begin("kousi_totel_master_tb")) {
			this.putError(G_SCRIPT_WARNING, `inserter_to->begin/${pactid},${year},${month}`);
			return false;
		}

		this.m_A_sum = Array();
// 2022cvt_015
		var sql = "select charge from packet_tb";
		sql += " where carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and (packetname='" + this.escape("パケットパックなし") + "'";
		sql += " or packetname='" + this.escape("パケットパック無し") + "')";
		sql += ";";
// 2022cvt_015
		var result = await this.m_db.getAll(sql);
		this.m_mova_default = G_PACKET_CHARGE;
		this.m_foma_default = G_PACKET_CHARGE_FOMA;
		if (result.length) this.m_foma_default = result[0][0];
		sql = "select telno";
		sql += ",coalesce(charge_mode,0) as mode";
		sql += ",coalesce(charge_browse,0) as browse";
		sql += ",coalesce(charge_other,0) as other";
		sql += " from tel_" + table_no + "_tb as tel_tb";
		sql += " left join packet_tb";
		sql += " on tel_tb.packetid=packet_tb.packetid";
		sql += " and tel_tb.carid=packet_tb.carid";
		sql += " and tel_tb.cirid=packet_tb.cirid";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and tel_tb.carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and tel_tb.cirid in(" + this.escape(G_CIRCUIT_FOMA) + "," + this.escape(G_CIRCUIT_DOCOMO_XI) + ")";
		sql += " and packet_tb.packetid is not null";
		sql += " order by telno";
		sql += ";";
		result = await this.m_db.getHash(sql);
		this.m_A_packet = Array();

// 2022cvt_015
		for (var line of result) {
// 2022cvt_015
			var telno = line.telno;
			this.m_A_packet[telno] = line;
		}

		sql = "select telno";
		sql += ",coalesce(charge_mode,0) as mode";
		sql += ",coalesce(charge_browse,0) as browse";
		sql += ",coalesce(charge_other,0) as other";
		sql += " from tel_" + table_no + "_tb as tel_tb";
		sql += " left join plan_tb";
		sql += " on tel_tb.planid=plan_tb.planid";
		sql += " and tel_tb.carid=plan_tb.carid";
		sql += " and tel_tb.cirid=plan_tb.cirid";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and tel_tb.carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and tel_tb.cirid in(" + this.escape(G_CIRCUIT_FOMA) + "," + this.escape(G_CIRCUIT_DOCOMO_XI) + ")";
		sql += " and (plan_tb.simway='" + this.escape(G_SIMWAY_DATA_NEW) + "'" + " or plan_tb.is_data=true)";
		sql += " and plan_tb.planid is not null";
		sql += " order by telno";
		sql += ";";
		result = await this.m_db.getHash(sql);

// 2022cvt_015
		for (var line of result) {
			telno = line.telno;
			this.m_A_packet[telno] = line;
		}

		this.m_base_kousi_stop = true;
		sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and fncid=" + this.escape(G_AUTH_KOUSI);
		sql += ";";
		this.m_base_kousi_stop = 0 == await this.m_db.getOne(sql);
		this.m_base_kousi_default = true;
		this.m_base_kousi = 2;
		sql = "select kousiflg,patternid from kousi_default_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += ";";
		result = await this.m_db.getHash(sql);

// 2022cvt_022
		if (result.length && 0 == result[0].kousiflg.localeCompare("0")) {
// 2022cvt_015
			var patid = result[0].patternid;
			sql = "select comhistbaseflg from kousi_pattern_tb";
			sql += " where patternid=" + this.escape(patid);
			sql += ";";
			result = await this.m_db.getAll(sql);

			if (result.length && result[0][0].length) {
				this.m_base_kousi_default = false;
				this.m_base_kousi = result[0][0];
			}
		}

		return true;
	}

// 2022cvt_016
	setType(type: any, year: number, month: number) //公私関連
	{
		this.m_year = year;
		this.m_month = month;
		this.m_A_sum = Array();
// 2022cvt_016
		this.m_linetype = [11, 2, ["91"], "01", "11", "51"];
		this.m_A_param_admin = {
			yyyymm: [14, 4, 18, 2],
			clampid: [0, 9]
		};
		this.m_param_parent = ["51", 19, 11];
		this.m_insert_charge = false;
		this.m_insert_byte = false;
		this.m_insert_kousi = false;

// 2022cvt_016
		switch (type) {
			case "RMT":
// 2022cvt_016
				this.m_type = "N";
				this.m_cirid = G_CIRCUIT_MOVA;
				this.m_linesize = 86;
				this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 13], 0], ["toplace", "text", [46, 6], 1], ["time", "text", [52, 7], 1], ["charge", "int", [66, 10], 1], ["callseg", "callseg", [76, 1], "callsegname"], ["chargeseg", "text", [77, 4], 1], ["discountseg", "text", [81, 1], 1], ["occupseg", "text", [82, 1], 1]];
				this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 66, 10, 1]];

				if (2005 <= year || 2004 == year && 12 == month) {
// 2022cvt_015
					for (var cnt = 0; cnt < this.m_A_param_details.length; ++cnt) {
// 2022cvt_022
						if (this.m_A_param_details[cnt][0].localeCompare("charge")) {
							continue;
						}
						this.m_A_param_details[cnt][3] = 0.1;
					}

					for (cnt = 0; cnt < this.m_A_param_total.length; ++cnt) {
// 2022cvt_022
						if (this.m_A_param_total[cnt][0].localeCompare("charge")) {
							continue;
						}
						this.m_A_param_total[cnt][3] = 0.1;
					}
				}

				break;

			case "RMP":
// 2022cvt_016
				this.m_type = "P";
				this.m_cirid = G_CIRCUIT_MOVA;
				this.m_insert_charge = true;

				if (2006 <= year || 2005 == year && 5 <= month) //2005年05月以降、通信料の内訳付き
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 4]], ["time", "diffsec", [27, 4, 31, 4]], ["totelno", "text", [35, 40], 0], ["byte_mail", "int", [75, 12], 1], ["byte_site", "int", [87, 12], 1], ["byte_other", "int", [99, 12], 1], ["occupseg", "text", [129, 1], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 99, 12, 1]];
						this.m_insert_byte = true;
					} else {
					this.m_linesize = 86;
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 4]], ["time", "diffsec", [27, 4, 31, 4]], ["totelno", "text", [35, 13], 0], ["byte", "int", [48, 12], 1], ["occupseg", "text", [60, 1], 1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 38, 12, 1]];
				}

				break;

			case "RMK":
// 2022cvt_016
				this.m_type = "I";
				this.m_cirid = G_CIRCUIT_MOVA;
				this.m_linesize = 100;

				if (2007 <= year || 2006 == year && 3 <= month) //2006年3月より、昼夜別と用途別が一桁ずれる
					{
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 21], 0], ["toplace", "text", [54, 20], 1], ["time", "text", [74, 7], 1], ["charge", "int", [81, 10], 1], ["callseg", "callseg", [91, 1], "callsegname"], ["chargeseg", "text", [93, 4], 1], ["occupseg", "text", [97, 1], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 66, 10, 1]];
					} else {
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 21], 0], ["toplace", "text", [54, 20], 1], ["time", "text", [74, 7], 1], ["charge", "int", [81, 10], 1], ["callseg", "callseg", [91, 1], "callsegname"], ["chargeseg", "text", [92, 4], 1], ["occupseg", "text", [96, 1], 1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 66, 10, 1]];
				}

				break;

			case "RML":
// 2022cvt_016
				this.m_type = "W";
				this.m_cirid = G_CIRCUIT_MOVA;
				this.m_linesize = 86;
				this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 21], 0], ["time", "text", [54, 6], 1], ["fromplace", "text", [60, 8], 1], ["charge", "int", [68, 12], 1], ["callsegname", "text", [80, 4], 1]];
				this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 68, 12, 1]];
				break;

			case "RMN":
// 2022cvt_016
				this.m_type = "+";
				this.m_cirid = G_CIRCUIT_MOVA;
				this.m_linesize = 120;
				this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["time", "text", [33, 7], 1], ["fromplace", "text", [40, 20], 1], ["totelno", "text", [60, 26], 0], ["charge", "int", [86, 10], 1], ["callsegname", "text", [96, 4], 1], ["sendrec", "text", [96, 4], 1]];
				this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 86, 10, 1]];
				break;

			case "RMF":
// 2022cvt_016
				this.m_type = "f";
				this.m_cirid = G_CIRCUIT_FOMA;

				if (2017 <= year || 2016 == year && 2 <= month) //2016年5月より光電話にあわせてフォーマット変更
					{
						this.m_linesize = 132;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 26], 0], ["toplace", "text", [59, 6], 1], ["time", "text", [65, 7], 1], ["charge", "int", [72, 11], 0.01], ["chargeseg", "text", [83, 6], 1], ["discountseg", "text", [89, 2], 1], ["kubun1", "text", [91, 10], 1], ["kubun2", "text", [101, 10], 1], ["kubun3", "text", [111, 10], 1], ["multinumber", "text", [121, 1], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 59, 11, 0.01]];
					} else {
					this.m_linesize = 119;
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 13], 0], ["toplace", "text", [46, 6], 1], ["time", "text", [52, 7], 1], ["charge", "int", [59, 11], 0.01], ["chargeseg", "text", [70, 6], 1], ["discountseg", "text", [76, 2], 1], ["kubun1", "text", [78, 10], 1], ["kubun2", "text", [88, 10], 1], ["kubun3", "text", [98, 10], 1], ["multinumber", "text", [108, 1], 1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 59, 11, 0.01]];
				}

				break;

			case "RMA":
// 2022cvt_016
				this.m_type = "p";
				this.m_cirid = G_CIRCUIT_FOMA;
				this.m_insert_charge = true;

				if (2008 <= year || 2007 == year && 7 <= month) //2007年7月以降、合計行のデータ量桁数増量
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["time", "text", [33, 6], 1], ["totelno", "text", [39, 40], 0], ["byte_mail", "int", [79, 12], 1], ["byte_site", "int", [91, 12], 1], ["byte_other", "int", [103, 12], 1], ["comservice", "text", [125, 8], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 99, 14, 1]];
						this.m_insert_byte = true;
					} else if (2006 <= year || 2005 == year && 11 <= month) //2005年11月以降、日付の書式変更
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["time", "text", [33, 6], 1], ["totelno", "text", [39, 40], 0], ["byte_mail", "int", [79, 12], 1], ["byte_site", "int", [91, 12], 1], ["byte_other", "int", [103, 12], 1], ["comservice", "text", [125, 8], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 99, 12, 1]];
						this.m_insert_byte = true;
					} else if (2006 <= year || 2005 == year && 5 <= month) //2005年05月以降、通信料の内訳付き
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 4]], ["time", "text", [31, 4], 1], ["totelno", "text", [35, 40], 0], ["byte_mail", "int", [75, 12], 1], ["byte_site", "int", [87, 12], 1], ["byte_other", "int", [99, 12], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 99, 12, 1]];
						this.m_insert_byte = true;
					} else {
					this.m_linesize = 111;
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["time", "text", [33, 7], 1], ["totelno", "text", [40, 40], 0], ["byte", "int", [80, 12], 1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 38, 12, 1]];
				}

				break;

			case "RMW":
// 2022cvt_016
				this.m_type = "i";
				this.m_cirid = G_CIRCUIT_FOMA;
				this.m_linesize = 122;

				if (2007 <= year || 2006 == year && 3 <= month) //2006年3月より、マルチナンバーが一桁ずれる
					{
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 26], 0], ["toplace", "text", [59, 20], 1], ["time", "text", [79, 7], 1], ["charge", "int", [86, 11], 0.01], ["chargeseg", "text", [97, 6], 1], ["multinumber", "text", [112, 1], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 86, 11, 0.01]];
					} else {
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 26], 0], ["toplace", "text", [59, 20], 1], ["time", "text", [79, 7], 1], ["charge", "int", [86, 11], 0.01], ["chargeseg", "text", [97, 6], 1], ["multinumber", "text", [111, 1], 1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 86, 11, 0.01]];
				}

				break;

			case "RMJ":
// 2022cvt_016
				this.m_type = "w";
				this.m_cirid = G_CIRCUIT_FOMA;
				this.m_linesize = 120;
				this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["time", "text", [33, 7], 1], ["fromplace", "text", [40, 20], 1], ["totelno", "text", [60, 26], 0], ["charge", "int", [86, 10], 0.1], ["callsegname", "text", [96, 4], 1], ["sendrec", "text", [96, 4], 1]];
				this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 86, 10, 0.1]];
				break;

			case "RMS":
// 2022cvt_016
				this.m_type = "n";
				this.m_cirid = G_CIRCUIT_PHS;
				this.m_linesize = 147;
				this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 13], 0], ["toplace", "text", [46, 20, 66, 12], 1], ["time", "text", [81, 7], 1], ["charge", "int", [92, 10], 1], ["callseg", "callseg", [102, 1], "callsegname"], ["chargeseg", "text", [103, 8], 1], ["discountseg", "text", [113, 3], 1]];
				this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 66, 10, 1]];
				break;

			case "RMR":
// 2022cvt_016
				this.m_type = "R";
				this.m_cirid = G_CIRCUIT_MOVA;

				if (2006 <= year || 2005 == year && 5 <= month) //2005年05月以降、通信料の内訳付き
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 7]], ["time", "text", [34, 7], 1], ["totelno", "text", [41, 20], 0], ["byte_mail", "int", [61, 12], 1], ["byte_site", "int", [73, 12], 1], ["byte_other", "int", [85, 12], 1], ["charge", "int", [97, 11], 0.1], ["fromplace", "text", [108, 30], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 97, 11, 0.1]];
						this.m_insert_byte = true;
					} else {
					this.m_linesize = 124;
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 7]], ["time", "text", [34, 7], 1], ["fromplace", "text", [41, 30], 1], ["totelno", "text", [71, 20], 0], ["byte", "int", [91, 12], 1], ["charge", "int", [103, 11], 0.1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 103, 11, 0.1]];
				}

				break;

			case "RMG":
// 2022cvt_016
				this.m_type = "G";
				this.m_cirid = G_CIRCUIT_FOMA;

				if (2006 <= year || 2005 == year && 5 <= month) //2005年05月以降、通信料の内訳付き
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 7]], ["time", "text", [34, 7], 1], ["totelno", "text", [41, 20], 0], ["byte_mail", "int", [61, 12], 1], ["byte_site", "int", [73, 12], 1], ["byte_other", "int", [85, 12], 1], ["charge", "int", [97, 11], 0.1], ["fromplace", "text", [108, 30], 1], ["comorg", "text", [108, 30], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 97, 11, 0.1]];
						this.m_insert_byte = true;
					} else {
					this.m_linesize = 124;
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 7]], ["time", "text", [34, 7], 1], ["fromplace", "text", [41, 30], 1], ["totelno", "text", [71, 20], 0], ["byte", "int", [91, 12], 1], ["charge", "int", [103, 11], 0.1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 103, 11, 0.1]];
				}

				break;

			default:
// 2022cvt_016
				this.putError(G_SCRIPT_ERROR, `setType(${type})未定義タイプ`);
				return false;
		}

		this.m_A_empty = this.m_inserter.getEmpty(false);
		this.m_A_empty[this.m_inserter.getIndex("pactid")] = this.m_pactid;
		this.m_A_empty[this.m_inserter.getIndex("carid")] = G_CARRIER_DOCOMO;
		this.m_index_byte = this.m_inserter.getIndex("byte");
		this.m_index_telno = this.m_inserter.getIndex("telno");
		this.m_index_charge = this.m_inserter.getIndex("charge");
// 2022cvt_016
		this.m_index_type = this.m_inserter.getIndex("type");
		this.m_index_time = this.m_inserter.getIndex("time");

		if (2006 <= year || 2005 == year && 5 <= month) {
			this.m_index_byte_mail = this.m_inserter.getIndex("byte_mail");
			this.m_index_byte_site = this.m_inserter.getIndex("byte_site");
			this.m_index_byte_other = this.m_inserter.getIndex("byte_other");
		}

		for (cnt = 0; cnt < this.m_A_param_details.length; ++cnt) {
// 2022cvt_015
			var tgt = this.m_A_param_details[cnt];
// 2022cvt_015
			var idx = [-1, -1];
			idx[0] = this.m_inserter.getIndex(tgt[0]);
// 2022cvt_022
			if (0 == "callseg".localeCompare(tgt[1])) {
				idx[1] = this.m_inserter.getIndex(tgt[3]);
			} else {
				idx[1] = 0;
			}

			if (idx[0] < 0 || idx[1] < 0) {
				this.putError(G_SCRIPT_ERROR, "添え字不正" + tgt[0]);
				return false;
			}

			tgt[4] = idx;
		}

		for (cnt = 0; cnt < this.m_A_param_total.length; ++cnt) {
			tgt = this.m_A_param_total[cnt];
			tgt[4] = this.m_inserter.getIndex(tgt[0]);

			if (tgt[4] < 0) {
				this.putError(G_SCRIPT_ERROR, "添え字不正" + tgt[0]);
				return false;
			}
		}

// 2022cvt_016
		if (-1 !== this.m_A_kousi_type.indexOf(this.m_type)) {
			this.m_insert_kousi = true;
			this.m_index_kousi = this.m_inserter.getIndex("kousiflg");
			this.m_index_to = this.m_inserter.getIndex("totelno");
			this.m_index_occup = this.m_inserter.getIndex("occupseg");
			this.m_index_multinumber = this.m_inserter.getIndex("multinumber");
		}

		return true;
	}

	end() {
		return this.m_inserter.end() && this.m_inserter_from.end() && this.m_inserter_to.end();
	}

	getLineSize() {
		return this.m_linesize;
	}

	getTypeName() {
// 2022cvt_016
		switch (this.m_type) {
			case "N":
				return "携帯通話";

			case "P":
				return "携帯パケット";

			case "I":
				return "携帯国際";

			case "W":
				return "WorldWalker";

			case "+":
				return "WorldWalkerPlus";

			case "f":
				return "FOMA通話";

			case "p":
				return "FOMAパケット";

			case "i":
				return "FOMA国際";

			case "w":
				return "WorldWing";

			case "n":
				return "PHS";

			case "R":
				return "WORLD_WALKERパケット";

			case "G":
				return "WORLD_WINGパケット";
		}

		return "未定義ファイル種別";
	}

	toCirid(cirid: number, telno: any) //PHSの処理は除去した
	{
		cirid = this.m_cirid;
		return true;
	}

	readLine(fname: string, lineno: string, line: string) //親番号の検査
	{
// 2022cvt_016
// 2022cvt_015
		var linetype = line.substring(this.m_linetype[0], this.m_linetype[1]);

// 2022cvt_022
// 2022cvt_016
		if (0 == this.m_param_parent[0].localeCompare(linetype)) {
// 2022cvt_015
			var parent = line.substring(this.m_param_parent[1], this.m_param_parent[2]).trim();

			if (!this.checkParent(parent)) //親番号は一個でも合致したら処理継続
				{
					this.putOperator(G_SCRIPT_INFO, `親番号(${parent})見つからず` + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
				}
		}

// 2022cvt_022
// 2022cvt_016
		if (0 == this.m_linetype[3].localeCompare(linetype)) {
			return this.readLineAdmin(fname, lineno, line);
// 2022cvt_022
// 2022cvt_016
		} else if (0 == this.m_linetype[4].localeCompare(linetype)) {
			return this.readLineDetails(fname, lineno, line);
// 2022cvt_022
// 2022cvt_016
		} else if (0 == this.m_linetype[5].localeCompare(linetype)) {
			return this.readLineTotal(fname, lineno, line);
// 2022cvt_016
		} else if (!(-1 !== this.m_linetype[2].indexOf(linetype))) {
			this.putOperator(G_SCRIPT_WARNING, "不明な行種別" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
			return false;
		}

		return true;
	}

	readLineAdmin(fname: string, lineno: string, line: string) {
		if (undefined !== this.m_A_param_admin.yyyymm) {
// 2022cvt_015
			var param = this.m_A_param_admin.yyyymm;
// 2022cvt_015
			var year = 0 + parseInt(line.substring(param[0], param[1]));
// 2022cvt_015
			var month = 0 + parseInt(line.substring(param[2], param[3]));

			if (year != this.m_year || month != this.m_month) {
				this.putOperator(G_SCRIPT_WARNING, `管理レコード年月不正${year}/${month}(` + this.getTypeName() + `/${fname}/${lineno})` + this.toUTF(line));
				return false;
			}
		}

		if (undefined !== this.m_A_param_admin.clampid) {
			param = this.m_A_param_admin.clampid;

			if (!this.checkClampId(line.substring(param[0], param[1]))) {
				this.putOperator(G_SCRIPT_WARNING, "管理レコード年月不正" + this.getTypeName() + `/${fname}/${lineno})` + this.toUTF(line));
				if (!this.m_force) {
					return false;
				}
			}
		}

		return true;
	}

	readLineDetails(fname: string, lineno: string, line: string) //DBに挿入する値
	//timeが4桁以上で6桁未満ならゼロを足す
	//公私の計算
	{
// 2022cvt_015
		var A_value = this.m_A_empty;

// 2022cvt_015
		for (var param of this.m_A_param_details) {
// 2022cvt_015
			var src = Array();

// 2022cvt_015
			for (var cnt = 0; cnt < param[2].length; cnt += 2) {
				if (0 == param[2][cnt + 1]) {
					src.push("");
				}
				src.push(line.substring(param[2][cnt], param[2][cnt + 1]));
			}

			switch (param[1]) {
				case "text":
// 2022cvt_015
					var text = "";

// 2022cvt_015
					for (var value of src) {
						text += this.toUTF(value).trim();
					}

					if (0 == param[3] || text.length) {
						A_value[param[4][0]] = this.m_inserter.escapeStr(text);
					}
					break;

				case "int":
// 2022cvt_015
					var int = 0;

					if (!this.toInt(int, src[0])) {
						this.putError(G_SCRIPT_WARNING, "詳細レコード" + "数値変換失敗" + param[0] + "/" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
						return false;
					}

					int *= param[3];
// 2022cvt_022
					if ("charge".localeCompare(param[0])) {
						int = +Math.round(int);
					}
					A_value[param[4][0]] = int;
					break;

				case "timestamp":
// 2022cvt_015
					var tm = "";

					if (!this.readLineDetailsTimestamp(tm, src) || !("" !== tm)) {
						this.putError(G_SCRIPT_WARNING, "詳細レコード" + "年月時刻変換失敗" + param[0] + "/" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
						return false;
					}

					A_value[param[4][0]] = tm;
					break;

				case "diffsec":
// 2022cvt_015
					var sec = "";

					if (!this.readLineDetailsDiffsec(sec, src) || !("" !== sec)) {
						this.putError(G_SCRIPT_WARNING, "詳細レコード" + "秒数変換失敗" + param[0] + "/" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
						return false;
					}

					A_value[param[4][0]] = sec;
					break;

				case "callseg":
// 2022cvt_015
					var seg = "";
// 2022cvt_015
					var segname = "";

					if (!this.readLineDetailsCallseg(seg, segname, src) || !("" !== seg) || !("" !== segname)) {
						this.putError(G_SCRIPT_WARNING, "詳細レコード" + "callseg変換失敗" + param[0] + "/" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
						return false;
					}

					A_value[param[4][0]] = seg;
					if (param[3].length) {
						A_value[param[4][1]] = segname;
					}
					break;

				default:
// 2022cvt_016
					this.putError(G_SCRIPT_ERROR, "readLineDetails(未定義type)" + this.getTypeName() + "/" + param[0] + "/" + param[1]);
					return false;
			}
		}

		if (undefined !== A_value[this.m_index_time] && 4 <= A_value[this.m_index_time].length) {
			while (A_value[this.m_index_time].length < 6) {
				A_value[this.m_index_time] = A_value[this.m_index_time] + "0";
			}
		}

		if (this.m_insert_byte) {
// 2022cvt_015
			var byte = 0;
			if (undefined !== A_value[this.m_index_byte_mail]) {
				byte += A_value[this.m_index_byte_mail];
			}
			if (undefined !== A_value[this.m_index_byte_site]) {
				byte += A_value[this.m_index_byte_site];
			}
			if (undefined !== A_value[this.m_index_byte_other]) {
				byte += A_value[this.m_index_byte_other];
			}
			A_value[this.m_index_byte] = byte;
		}

		if (this.m_insert_charge) //パケット数を取り出す
			//単価を掛けて金額を求める
			//四捨五入を行う
			//合計して保存する
			{
// 2022cvt_015
				var A_key = ["mail", "site", "other"];
// 2022cvt_015
				var H_packet: { [key: string]: any } = {};
				H_packet.mail = 1 * A_value[this.m_index_byte_mail] / G_PACKET_SIZE;
				H_packet.site = 1 * A_value[this.m_index_byte_site] / G_PACKET_SIZE;
				H_packet.other = 1 * A_value[this.m_index_byte_other] / G_PACKET_SIZE;

				if (undefined !== this.m_A_packet[A_value[this.m_index_telno]]) //その他は、フルブラウザか否かで判断する
					{
// 2022cvt_015
						var H_master = this.m_A_packet[A_value[this.m_index_telno]];
						H_packet.mail = H_packet.mail * H_master.mode;
						H_packet.site = H_packet.site * H_master.mode;
// 2022cvt_015
						var totelno = "";
						if (undefined !== A_value[this.m_index_to]) {
							totelno = A_value[this.m_index_to];
						}

						// if ((false === totelno.localeCompare("ﾌﾙﾌﾞﾗｳｻﾞ")) && (false === totelno.localeCompare("フルブラウザ"))) {
						if ((1 === totelno.localeCompare("ﾌﾙﾌﾞﾗｳｻﾞ")) && (1 === totelno.localeCompare("フルブラウザ"))) {
							H_packet.other = H_packet.other * H_master.browse;
						} else {
							H_packet.other = H_packet.other * H_master.other;
						}
					} else {
// 2022cvt_022
// 2022cvt_016
// 2022cvt_015
					if (0 == this.m_type.localeCompare("P")) {
						var master = this.m_mova_default;
					} else {
						master = this.m_foma_default;
					}

// 2022cvt_015
					for (var key of A_key) {
						H_packet[key] = H_packet[key] * master;
					}
				}

// 2022cvt_015
				for (var key of A_key) {
					H_packet[key] = +Math.round(H_packet[key]);
				}

// 2022cvt_015
				var packet = 0;

// 2022cvt_015
				for (var key of A_key) {
					packet += H_packet[key];
				}

				A_value[this.m_index_charge] = packet;
			}

// 2022cvt_015
		for (var param of this.m_A_param_total) {
// 2022cvt_015
			var key: string = param[0];
// 2022cvt_015
			var idx = param[4];
			if (!(undefined !== A_value[idx])) {
				continue;
			};
			if (!(undefined !== this.m_A_sum[key])) {
				this.m_A_sum[key] = 0;
			}
// 2022cvt_022
			if (0 == "telno".localeCompare(key)) {
				this.m_A_sum[key] += 1;
			} else {
				this.m_A_sum[key] += A_value[idx];
			}
		}

// 2022cvt_016
		A_value[this.m_index_type] = this.m_type;
		if (!this.readLineDetailsKousi(A_value)) {
			return false;
		}
		return this.m_inserter.insertRaw(A_value, false);
	}

	readLineDetailsTimestamp(tm: string, src: string | any[]) {
		if (8 != src[0].length) return false;
// 2022cvt_015
		var yyyy = src[0].substring(0, 4);
// 2022cvt_015
		var mm = src[0].substring(4, 2);
// 2022cvt_015
		var dd = src[0].substring(6, 2);

		if (1 < src.length) {
			if (6 != src[1].length && 7 != src[1].length && 4 != src[1].length) {
				return false;
			}
// 2022cvt_015
			var hh = src[1].substring(0, 2);
// 2022cvt_015
			var nn = src[1].substring(2, 2);
// 2022cvt_015
			var ss = src[1].substring(4, 2);
			if (0 == ss.length) {
				ss = "00";
			}

			if (6 < src[1].length) {
// 2022cvt_015
				var sub = 0 + src[1].substr(6, 1);
				tm = `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}.${sub}`;
			} else {
				tm = `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}`;
			}
		} else {
			tm = `${yyyy}-${mm}-${dd}`;
		}

		return true;
	}

	readLineDetailsDiffsec(sec: string, src: any[]) {
// 2022cvt_015
		for (var cnt = 0; cnt < 2; ++cnt) {
			if (4 != src[cnt].length) {
				return false;
			}
		}

// 2022cvt_015
		var hh = "";
		var hh_num = parseInt(src[1].substring(0, 2)) - parseInt(src[0].substring(0, 2));
// 2022cvt_015
		var mm = "";
		var mm_num = parseInt(src[1].substring(2, 2)) - parseInt(src[0].substring(2, 2));

		if (mm_num < 0) {
			mm_num += 60;
			--hh_num;
		}

		if (hh_num < 0) {
			hh_num += 24;
		};
		if (hh_num < 10) {
			hh = "0" + hh_num;
		};
		if (mm_num < 10) {
			mm = "0" + mm_num;
		}
		sec = hh + mm + "000";
		return true;
	}

	readLineDetailsCallseg(seg: string, segname: string, src: Array<any>) {
		seg = src[0];

		switch (seg) {
			case "0":
				segname = "その他";
				break;

			case "1":
				segname = "分割呼";
				break;

			case "4":
				segname = "衛星";
				break;

			case "5":
				segname = "着転送";
				break;

			case "8":
				segname = "８００ＭＨｚ（留守電遠隔操作）";
				break;

			case "9":
				segname = "１．５ＧＨｚ（留守電遠隔操作）";
				break;

			case "A":
				segname = "ＦＯＭＡ（留守電遠隔操作）";
				break;

			case "B":
				segname = "衛星（留守電遠隔操作）";
				break;

			case "C":
				segname = "通常電話（留守電遠隔操作）";
				break;

			default:
				return false;
		}

		return true;
	}

	async readLineDetailsKousi(A_value: Array<any>) {
		if (this.m_base_kousi_stop) {
			return true;
		}
		if (!this.m_insert_kousi) {
			return true;
		}
// 2022cvt_015
		var telno = A_value[this.m_index_telno];

// 2022cvt_022
		if (telno.localeCompare(this.m_cur_telno))
		// if (strcmp(telno, this.m_cur_telno)) //ベースとなる公私と、公私の有無を読み出す
			{
				this.m_cur_telno = telno;
				this.m_cur_kousi_stop = this.m_base_kousi_default;
				this.m_cur_kousi = this.m_base_kousi;
// 2022cvt_015
				var table_no = this.getTableNo(this.m_year, this.m_month);
// 2022cvt_015
				var sql = "select kousiflg,kousiptn";
				sql += " from tel_" + table_no + "_tb as tel_tb";
				sql += " where pactid=" + this.escape(this.m_pactid);
				sql += " and telno='" + this.escape(this.m_cur_telno) + "'";
				sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
				sql += ";";
// 2022cvt_015
				var result = await this.m_db.getHash(sql);

// 2022cvt_022
				if (result.length && 0 == result[0].kousiflg.localeCompare("0") && 0 < result[0].kousiptn.length) {
// 2022cvt_015
					var patid = result[0].kousiptn;
					sql = "select comhistbaseflg";
					sql += ",coalesce(comhistflg,'0')";
					sql += " from kousi_pattern_tb";
					sql += " where patternid=" + this.escape(patid);
					sql += ";";
					result = await this.m_db.getAll(sql);

					if (result.length && result[0][0].length) {
						this.m_cur_kousi_stop = false;
						this.m_cur_kousi = result[0][0];
					}

// 2022cvt_022
					if (result.length && result[0][1].length) {
						this.m_cur_kousi_stop = 0 == "0".localeCompare(result[0][1]);
					}
				}

				if (!(undefined !== this.m_H_kousi_to[telno]) && !(undefined !== this.m_H_kousi_occup[telno]) && !(undefined !== this.m_H_kousi_multinumber[telno])) {
					this.m_H_kousi_to[telno] = Array();
					this.m_H_kousi_occup[telno] = Array();
					this.m_H_kousi_multinumber[telno] = Array();

					if (!this.m_cur_kousi_stop) //相手先マスターを読み出す
						//用途別・マルチナンバーマスターを読み出す
						{
							sql = "select totelno,kousiflg from kousi_totel_master_tb";
							sql += " where pactid=" + this.escape(this.m_pactid);
							sql += " and telno='" + this.escape(this.m_cur_telno) + "'";
							sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
							sql += ";";
							result = await this.m_db.getHash(sql);

// 2022cvt_015
							for (var line of result) {
// 2022cvt_015
								var key = line.totelno;
// 2022cvt_015
								var value = line.kousiflg;
								if (0 == value.length) {
									continue;
								}
								this.m_H_kousi_to[telno][key] = value;
							}

// 2022cvt_016
							sql = "select fromtelno,kousiflg,type" + " from kousi_fromtel_master_tb";
							sql += " where pactid=" + this.escape(this.m_pactid);
							sql += " and telno='" + this.escape(this.m_cur_telno) + "'";
							sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
							sql += ";";
							result = await this.m_db.getHash(sql);

// 2022cvt_015
							for (var line of result) {
								key = line.fromtelno;
								value = line.kousiflg;
								if (0 == value.length) {
									continue;
								}
// 2022cvt_016
// 2022cvt_015
								var type = line.type;
// 2022cvt_022
// 2022cvt_016
								if (0 == type.localeCompare("M")) {
									this.m_H_kousi_multinumber[telno][key] = value;
								}else if (0 == type.localeCompare("O")) {
									this.m_H_kousi_occup[telno][key] = value;
								}
							}
						}
				}
			}

		if (this.m_cur_kousi_stop) {
			return true;
		}
// 2022cvt_015
		var kousi = this.m_cur_kousi;
// 2022cvt_015
		var kousi_ready = false;

// 2022cvt_022
		if (undefined !== A_value[this.m_index_multinumber] && A_value[this.m_index_multinumber].length && A_value[this.m_index_multinumber].localeCompare("\\N") && -1 !== this.m_A_multinumber_private.indexOf("C" + A_value[this.m_index_multinumber])) //マルチナンバーから予測
			{
				key = A_value[this.m_index_multinumber];

				if (!(undefined !== this.m_H_kousi_multinumber[telno][key])) {
					this.m_inserter_from.insert({
						pactid: this.m_pactid,
						telno: telno,
						carid: G_CARRIER_DOCOMO,
						fromtelno: key,
						kousiflg: "2",
// 2022cvt_016
						type: "M"
					});
					this.m_H_kousi_multinumber[telno][key] = this.m_cur_kousi;
				} else {
// 2022cvt_015
					var flag = this.m_H_kousi_multinumber[telno][key];

// 2022cvt_022
					if (0 == "0".localeCompare(flag) || 0 == "1".localeCompare(flag)) {
					// if (0 == strcmp("0", flag) || 0 == strcmp("1", flag)) {
						kousi = flag;
						kousi_ready = true;
					}
				}
			}

// 2022cvt_022
		if (!kousi_ready && undefined !== A_value[this.m_index_occup] && A_value[this.m_index_occup].length && A_value[this.m_index_occup].localeCompare("\\N") && A_value[this.m_index_occup].localeCompare("0")) //用途別から予測
			{
				key = A_value[this.m_index_occup];

				if (!(undefined !== this.m_H_kousi_occup[telno][key])) {
					this.m_inserter_from.insert({
						pactid: this.m_pactid,
						telno: telno,
						carid: G_CARRIER_DOCOMO,
						fromtelno: key,
						kousiflg: "2",
// 2022cvt_016
						type: "O"
					});
					this.m_H_kousi_occup[telno][key] = this.m_cur_kousi;
				} else {
					flag = this.m_H_kousi_occup[telno][key];

// 2022cvt_022
					if (0 == "0".localeCompare(flag) || 0 == "1".localeCompare(flag)) {
					// if (0 == strcmp("0", flag) || 0 == strcmp("1", flag)) {
						kousi = flag;
						kousi_ready = true;
					}
				}
			}

// 2022cvt_022
		if (!kousi_ready && undefined !== A_value[this.m_index_to] && A_value[this.m_index_to].length && A_value[this.m_index_to].localeCompare("\\N")) //相手先から予測
			{
				key = A_value[this.m_index_to];

				if (!(undefined !== this.m_H_kousi_to[telno][key])) {
					this.m_inserter_to.insert({
						pactid: this.m_pactid,
						telno: telno,
						carid: G_CARRIER_DOCOMO,
						totelno: key,
						kousiflg: "2",
						memo: ""
					});
					this.m_H_kousi_to[telno][key] = this.m_cur_kousi;
				} else {
					flag = this.m_H_kousi_to[telno][key];

// 2022cvt_022
					if (0 == "0".localeCompare(flag) || 0 == "1".localeCompare(flag)) {
					// if (0 == strcmp("0", flag) || 0 == strcmp("1", flag)) {
						kousi = flag;
						kousi_ready = true;
					}
				}
			}

		A_value[this.m_index_kousi] = kousi;
		return true;
	}

	readLineTotal(fname: string, lineno: string, line: string) {
// 2022cvt_015
		var sum = this.m_A_sum;
		this.m_A_sum = Array();

// 2022cvt_015
		for (var param of this.m_A_param_total) {
// 2022cvt_015
			var src = line.substring(param[1], param[2]);
// 2022cvt_015
			var int = 0;

			if (!this.toInt(int, src) || !(undefined !== int)) {
				this.putError(G_SCRIPT_WARNING, "合計レコード" + "数値変換失敗" + param[0] + "/" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
				return false;
			}

			int *= param[3];
// 2022cvt_022
			if ("charge".localeCompare(param[0])) {
				int = +Math.round(int);
			}

			if (0.0001 < Math.abs(int - sum[param[0]])) {
				this.putError(G_SCRIPT_INFO, "合計レコード" + "合計合致せず" + param[0] + "/" + int + "," + sum[param[0]] + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
			}
		}

		return true;
	}

};
