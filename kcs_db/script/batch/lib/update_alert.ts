//===========================================================================
//機能：現行のプラン・パケットパック・回線種別・地域会社を予測する
//
//作成：森原
//===========================================================================
//警告フラグを落とすオーダ種別
//---------------------------------------------------------------------------
//機能：料金プラン警告・パケットパック警告の処理型を生成する
//引数：エラー処理型
//データベース
//テーブル番号計算型
//---------------------------------------------------------------------------
//機能：料金プラン警告・パケットパック警告をたてる
//この型はマスター類の管理を行い、実際の検査は検査型が行う。
//この型のインスタンスは、CreateUpdateAlert関数を使って生成する


// require("lib/script_db.php");
import script_db, { FetchAdaptor, ScriptDB, ScriptDBAdaptor } from "../lib/script_db";


// require("lib/script_common.php");
import { G_AREA_DOCOMO_UNKNOWN, G_CARRIER_ALL, G_CARRIER_AU, G_CARRIER_DOCOMO, G_CARRIER_OTHER, G_CARRIER_UNKNOWN, G_CIRCUIT_DOCOMO_OTHER } from "../lib/script_common";
import { G_SCRIPT_DEBUG, G_SCRIPT_INFO, G_SCRIPT_SQL, ScriptLogBase } from "./script_log";

const ORDER_TYPE = "B,C,N,Nmnp,P,Ppl,S";

export async function CreateUpdateAlert(listener: ScriptLogBase, db: ScriptDB, table_no: script_db) {

	var alert = new UpdateAlert(listener, db, table_no);
	alert.m_checker_def = new CheckAlertBase(listener, db, table_no, G_CARRIER_UNKNOWN);

	var sql = "select carid from carrier_tb;";

	var result = await db.getAll(sql);


	for (var line of result) {

		var carid = line[0];

		switch (carid) {
			case G_CARRIER_DOCOMO:
				alert.m_checker[carid] = new CheckAlertDocomo(listener, db, table_no);
				break;

			case G_CARRIER_AU:
				alert.m_checker[carid] = new CheckAlertAU(listener, db, table_no);
				break;

			default:
				alert.m_checker[carid] = new CheckAlertBase(listener, db, table_no, carid);
				break;
		}
	}

	return alert;
};

class UpdateAlert extends ScriptDBAdaptor {
	m_plan: Array<any>;
	m_packet: Array<any>;
	m_plan_count: Array<any>;
	m_packet_count: Array<any>;
	m_circuit: Array<any>;
	m_area: Array<any>;
	m_cur_key: string = "";
	m_A_cur: Array<any> = Array();
	m_checker_def!: CheckAlertBase;
	m_checker: Array<any> = Array();

	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: script_db) //プランマスター
	//プラン第二基本料をプランマスターに追加する
	//プランとパケットの連係情報を読み出す
	//パケットマスター
	//パケット第二定額使用料をパケットマスターに追加する
	//プラン個数マスター
	//パケット個数マスター
	//回線種別
	//地域会社
	//電話番号先頭六桁は総務省データの消滅に伴い削除した
	{
		super(listener, db, table_no);
		this.m_plan = Array();
		this.m_packet = Array();
		this.m_plan_count = Array();
		this.m_packet_count = Array();
		this.m_area = Array();
		this.m_circuit = Array();
		this.ini()
	}

	async ini () {

		var sql = "select planid,basic,arid,cirid";
		sql += ",(case when is_data then 1 else 0 end) as is_empty";
		sql += ",(case when viewflg then 1 else 0 end) as viewflg";
		sql += " from plan_tb";
		sql += ";";

		var result = await this.m_db.getAll(sql);


		for (var line of result) {

			var info: { [key: string]: any } = {
				charge: [line[1]],
				arid: line[2],
				cirid: line[3],
				is_data: line[4],
				viewflg: line[5],
				rel_packet: Array()
			};
			this.m_plan[line[0]] = info;
		}

		sql = "select planid,basic from plan_basic_tb;";
		result = await this.m_db.getAll(sql);


		for (var line of result) {

			var planid = line[0];

			var basic = line[1];
			if (!(undefined !== this.m_plan[planid])) continue;
			this.m_plan[planid].charge.push(basic);
		}

		sql = "select planid,packetid from plan_rel_packet_tb;";
		result = await this.m_db.getAll(sql);


		for (var line of result) {
			planid = line[0];

			var packetid = line[1];
			if (undefined !== this.m_plan[planid] && !(-1 !== this.m_plan[planid].rel_packet.indexOf(packetid))) this.m_plan[planid].rel_packet.push(packetid);
		}

		this.m_packet = Array();
		sql = "select packetid,fixcharge,arid,cirid";
		sql += ",(case when is_empty then 1 else 0 end) as is_empty";
		sql += ",(case when viewflg then 1 else 0 end) as viewflg";
		sql += " from packet_tb";
		sql += ";";
		result = await this.m_db.getAll(sql);


		for (var line of result) {
			info = {
				charge: [line[1]],
				arid: line[2],
				cirid: line[3],
				is_empty: line[4],
				viewflg: line[5]
			};
			this.m_packet[line[0]] = info;
		}

		sql = "select packetid,fixcharge from packet_basic_tb;";
		result = await this.m_db.getAll(sql);


		for (var line of result) {
			packetid = line[0];

			var fix = line[1];
			if (!(undefined !== this.m_packet[packetid])) continue;
			this.m_packet[packetid].charge.push(fix);
		}

		this.m_plan_count = Array();
		sql = "select carid,cirid,count(*) as count";
		sql += " from plan_tb";
		sql += " group by carid,cirid";
		sql += ";";
		result = await this.m_db.getHash(sql);


		for (var line of result) {

			var key = line.carid + "," + line.cirid;
			this.m_plan_count[key] = line.count;
		}

		this.m_packet_count = Array();
		sql = "select carid,cirid,count(*) as count";
		sql += " from packet_tb";
		sql += " group by carid,cirid";
		sql += ";";
		result = await this.m_db.getHash(sql);


		for (var line of result) {
			key = line.carid + "," + line.cirid;
			this.m_packet_count[key] = line.count;
		}

		this.m_circuit = Array();
		sql = "select carid,cirid";
		sql += " from circuit_tb";
		sql += ";";
		result = await this.m_db.getAll(sql);


		for (var line of result) {
			if (!(undefined !== this.m_circuit[line[0]])) this.m_circuit[line[0]] = Array();
			this.m_circuit[line[0]].push(line[1]);
		}

		this.m_area = Array();
		sql = "select carid,arid";
		sql += " from area_tb";
		sql += ";";
		result = await this.m_db.getAll(sql);


		for (var line of result) {
			if (!(undefined !== this.m_area[line[0]])) this.m_area[line[0]] = Array();
			this.m_area[line[0]].push(line[1]);
		}
	}

	async execute(A_pactid: Array<any>, A_carid: Array<any>, year: number, month: number, fname: string) //電話番号のリストを取得
	//明細の読み出し
	//プラン・パケットの変わった電話番号のリストを取り出す
	//前月のオーダーを取り出す
	//前月のオーダーは、前月の1日から当月の14日の23:59:59まで
	//電話に対してループ
	//未出力のバッファがあれば出力する
	{

		var table_no = this.getTableNo(year, month);

		if (fname.length) {

			var sql = "select * from tel_tb";
			sql += this.getSQLWhere(A_carid, A_pactid);
			sql += ";";
			if (!this.m_db.backup(fname, sql)) return false;
		}

		sql = "update tel_tb set finishing_f=false";
		sql += ",planalert='0',packetalert='0'";
		sql += ",fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
		sql += this.getSQLWhere(A_carid, A_pactid, true, "", year, month);
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		sql = "select pactid,carid,telno";
		sql += ",(pactid || ',' || carid || ',' || telno) as key";
		sql += ",arid,cirid,planid,packetid";
		sql += " from tel_tb";
		sql += this.getSQLWhere(A_carid, A_pactid);
		sql += " order by key";
		sql += ";";

		var A_telinfo = await this.m_db.getHash(sql);

		var O_detail = new FetchAdaptor(this.m_listener, this.m_db, "key");
		sql = "select code,charge";
		sql += ",(pactid || ',' || carid || ',' || telno) as key";
		sql += " from tel_details_" + table_no + "_tb as tel_details_tb";
		sql += this.getSQLWhere(A_carid, A_pactid);
		sql += " order by key";
		sql += ";";
		O_detail.query(sql);

		var lastyear = year;

		var lastmonth = month - 1;

		if (0 == lastmonth) {
			lastmonth = 12;
			--lastyear;
		}


		var last_table_no = this.getTableNo(lastyear, lastmonth);
		sql = "select (pactid || ',' || carid || ',' || telno) as key";
		sql += ",planchange,packetchange from (";
		sql += "select newtb.telno as telno";
		sql += ",newtb.pactid as pactid";
		sql += ",newtb.carid as carid";
		sql += ",oldtb.telno as oldtelno";
		sql += ",(case when newtb.planid!=oldtb.planid then 1";
		sql += " when newtb.planid is null" + " and oldtb.planid is not null then 1";
		sql += " when newtb.planid is not null" + " and oldtb.planid is null then 1";
		sql += " else 0 end) as planchange";
		sql += ",(case when newtb.packetid!=oldtb.packetid then 1";
		sql += " when newtb.packetid is null" + " and oldtb.packetid is not null then 1";
		sql += " when newtb.packetid is not null" + " and oldtb.packetid is null then 1";
		sql += " else 0 end) as packetchange";
		sql += " from tel_" + table_no + "_tb as newtb";
		sql += " left join tel_" + last_table_no + "_tb as oldtb";
		sql += " on newtb.pactid=oldtb.pactid";
		sql += " and newtb.carid=oldtb.carid";
		sql += " and newtb.telno=oldtb.telno";
		sql += this.getSQLWhere(A_carid, A_pactid, false, "newtb");
		sql += " ) as subtb";
		sql += " where (planchange=1 or packetchange=1)";
		sql += " and length(oldtelno)>1";
		sql += " order by key";

		var O_sup = new FetchAdaptor(this.m_listener, this.m_db, "key");
		O_sup.query(sql);
		sql = "select (p.pactid || ',' || p.carid || ',' || d.telno) as key";
		sql += " from mt_order_tb as p";
		sql += " left join mt_order_teldetail_tb as d";
		sql += " on p.orderid=d.orderid";
		sql += " where p.status>=130";
// 2022cvt_016
		sql += " and p.ordertype in (";
// 2022cvt_016

		var A_ordertype = ORDER_TYPE.split(",");

		var comma = false;

// 2022cvt_016

		for (var type of A_ordertype) {
			if (comma) sql += ",";
			comma = true;
// 2022cvt_016
			sql += "'" + this.escape(type) + "'";
		}

		sql += ")";
		sql += " and p.fixdate>='" + lastyear + "/" + lastmonth + "/01'";
		sql += " and p.fixdate<'" + year + "/" + month + "/15'";

		if (A_pactid.length) {
			sql += " and p.pactid in (";
			comma = false;


			for (var pactid of A_pactid) {
				if (comma) sql += ",";
				comma = true;
				sql += this.escape(pactid);
			}

			sql += ")";
		}

		if (A_carid.length) {
			sql += " and p.carid in (";
			comma = false;


			for (var carid of A_carid) {
				if (comma) sql += ",";
				comma = true;
				sql += this.escape(carid);
			}

			sql += ")";
		}

		sql += " and d.telno is not null";
		sql += " order by key";
		sql += ";";
// 2022cvt_016

		var A_mt_order_type = this.m_db.getHash(sql);

		var O_order = new FetchAdaptor(this.m_listener, this.m_db, "key");
		O_order.query(sql);

		var status = true;
		this.m_cur_key = "";
		this.m_A_cur = Array();


		for (var telinfo of A_telinfo) {
			if (!this.updateTelno(telinfo, O_detail, O_sup, O_order)) {
				status = false;
				break;
			}
		}

		if (this.m_cur_key.length && this.m_A_cur.length) status &&= this.flushUpdate("");
		this.m_cur_key = "";
		this.m_A_cur = Array();
		O_order.free();
		O_sup.free();
		O_detail.free();
		return status;
	}

	updateTelno(telinfo: { key: any; carid: string; telno: any; pactid: string; }, O_detail: FetchAdaptor, O_sup: FetchAdaptor, O_order: FetchAdaptor) {

		var line;

		var A_detail = Array();

		while (line = O_detail.fetch(telinfo.key)) A_detail.push(line);


		var checker = this.m_checker_def;
		if (undefined !== this.m_checker[telinfo.carid]) checker = this.m_checker[telinfo.carid];

		var planalert = { "value": false };

		var packetalert = { "value": false };

		var sup_plan = false;

		var sup_packet = false;
		if (!checker!.check(planalert, packetalert, telinfo, A_detail)) return false;

		var is_plan_change = false;

		var is_packet_change = false;

		var is_order = false;

		if (line = O_sup.fetch(telinfo.key)) {
			if (line.planchange) is_plan_change = true;
			if (line.packetchange) is_packet_change = true;
		}

		if (line = O_order.fetch(telinfo.key)) {
			is_order = true;
		}

		if (planalert.value) {
			if (is_order) {
				this.putError(G_SCRIPT_INFO, "オーダがあったのでプラン警告を弱に" + `(${telinfo.carid},${telinfo.telno})`);
				sup_plan = true;
			}
		}

		if (packetalert.value) {
			if (is_order) {
				this.putError(G_SCRIPT_INFO, "オーダがあったのでパケット警告を弱に" + `(${telinfo.carid},${telinfo.telno})`);
				sup_packet = true;
			}
		}


		var finishing_f = 0 < A_detail.length;
		if (!finishing_f) return true;

		var key = telinfo.pactid + "," + telinfo.carid;

// 2022cvt_022
		if (this.m_cur_key.length && this.m_A_cur.length && this.m_cur_key.localeCompare(key)) //顧客ID・電話会社のどちらかが切り替わったので、バッファを出力
			{
				if (!this.flushUpdate("")) return false;
				this.m_cur_key = "";
				this.m_A_cur = Array();
			}

		this.m_cur_key = key;
		var planalert_2 = planalert.value ? sup_plan ? "3" : "1" : "0";
		var packetalert_2 = packetalert.value ? sup_packet ? "3" : "1" : "0";
		key = (finishing_f ? "1" : "0") + "," + planalert_2 + "," + packetalert_2;
		if (!(undefined !== this.m_A_cur[key])) this.m_A_cur[key] = Array();

		if (100 < this.m_A_cur[key].length) //バッファがある程度たまったら、バッファを出力
			{
				if (!this.flushUpdate(key)) return false;
				this.m_A_cur[key] = Array();
			}

		this.m_A_cur[key].push(telinfo.telno);
		return true;
	}

	flushUpdate(where: string) {
		{
			let _tmp_0 = this.m_A_cur;


			for (var key in _tmp_0) {

				var value = _tmp_0[key];
// 2022cvt_022
				if (where.length && where.localeCompare(key)) continue;
				if (0 == value.length) continue;

				var A = this.m_cur_key.split(",");

				var pactid = A[0];

				var carid = A[1];
				A = key.split(",");

				var finishing_f = A[0].length ? A[0] : "0";

				var planalert = A[1].length ? A[1] : "0";

				var packetalert = A[2].length ? A[2] : "0";

				var sql = "update tel_tb set";
				sql += " planalert='" + planalert + "'";
				sql += ",packetalert='" + packetalert + "'";
				sql += ",finishing_f=" + (finishing_f ? "true" : "false");
				sql += ",fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
				sql += " where carid=" + this.escape(carid);
				sql += " and pactid=" + this.escape(pactid);
				sql += " and telno in (";

				var comma = false;


				for (var telno of value) {
					if (comma) sql += ",";
					comma = true;
					sql += "'" + this.escape(telno) + "'";
				}

				sql += ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
			}
		}
		return true;
	}

	getSQLWhere(A_carid: Array<any>, A_pactid: Array<any>, check_contract = false, tablename = "", contract_year = 0, contract_month = 0) {

		var sql = "";
		if (A_carid.length || A_pactid.length) sql += " where";

		if (1 == A_carid.length) {
			sql += " ";
			if (tablename.length) sql += tablename + ".";
			sql += "carid=" + this.escape(A_carid[0]);
		} else if (1 < A_carid.length) {
			sql += " ";
			if (tablename.length) sql += tablename + ".";
			sql += "carid in(";

			var comma = false;


			for (var carid of A_carid) {
				if (comma) sql += ",";
				comma = true;
				sql += this.escape(carid);
			}

			sql += ")";
		}

		if (A_carid.length && A_pactid.length) {
			sql += " and";
		}

		if (1 == A_pactid.length) {
			sql += " ";
			if (tablename.length) sql += tablename + ".";
			sql += "pactid=" + this.escape(A_pactid[0]);
		} else if (1 < A_pactid.length) {
			sql += " ";
			if (tablename.length) sql += tablename + ".";
			sql += "pactid in(";
			comma = false;


			for (var pactid of Object.values(A_pactid)) {
				if (comma) sql += ",";
				comma = true;
				sql += this.escape(pactid);
			}

			sql += ")";
		}

		if (check_contract) {
			if (A_carid.length || A_pactid.length) sql += " and";
			sql += " ";
			sql += "(";
			if (tablename.length) sql += tablename + ".";
			sql += "contractdate is null or ";
			if (tablename.length) sql += tablename + ".";
			sql += "contractdate<'" + contract_year + "/" + contract_month + "/01'";
			sql += ")";
		}

		return sql;
	}

};

class CheckAlertBase extends ScriptDBAdaptor {
	m_carid: number;
	m_A_basic: Array<any>;
	m_A_fix: Array<any>;
	m_check_soumu_tel_tb_arid: boolean;
	m_A_cirid_foma: Array<any>;
	m_A_basic_option: Array<any>
	m_packet: Array<any> = Array();
	m_plan: Array<any> = Array();
	m_packet_count: Array<any> = Array();
	m_plan_count: any;

	constructor(listener: any, db: any, table_no: any, carid: number) //基本料を読み出す
	//パケットパックが存在する回線種別
	//基本料と付加利用料
	{
		super(listener, db, table_no);
		this.m_carid = carid;
		this.m_A_basic = Array();
		this.m_A_fix = Array();
		this.m_A_cirid_foma = Array();
		this.m_A_basic_option = Array();
		this.m_check_soumu_tel_tb_arid = false;

		this.ini(carid);
	}

	async ini (carid: number) {

		if (G_CARRIER_UNKNOWN != carid) {
// 2022cvt_016

			var sql = "select code from utiwake_tb" + " where carid=" + carid + " and simkamoku in ('100')" + " and coalesce(codetype,'')='0'" + ";";

			var result = await this.m_db.getAll(sql);


			for (var line of result) this.m_A_basic.push(line[0]);
		}

		this.m_A_fix = Array();

		if (G_CARRIER_UNKNOWN != carid) {
// 2022cvt_016
			sql = "select code from utiwake_tb" + " where carid=" + carid + " and simkamoku in ('172')" + " and coalesce(codetype,'')='0'" + ";";
			result = await this.m_db.getAll(sql);


			for (var line of result) this.m_A_fix.push(line[0]);
		}

		this.m_check_soumu_tel_tb_arid = false;
		this.m_A_cirid_foma = Array();
		sql = "select cirid from packet_tb where carid=" + carid + " group by cirid;";
		result = await this.m_db.getAll(sql);


		for (var line of result) this.m_A_cirid_foma.push(line[0]);

		this.m_A_basic_option = Array();
		sql = "select code_src,code_dst from plan_option_code_tb" + " where carid=" + carid + ";";
		result = await this.m_db.getAll(sql);


		for (var line of result) {
			this.m_A_basic_option.push({
				basic: line[0],
				option: line[1]
			});
		}
	}

	check(planalert: { [key: string]: boolean }, packetalert: { [key: string]: boolean }, telinfo: any, A_detail: any[]) {
		if (!this.checkTel(planalert, packetalert, telinfo, A_detail)) return false;
		if (!this.checkPlan(planalert, packetalert, telinfo, A_detail)) return false;
		if (!this.checkPacket(planalert, packetalert, telinfo, A_detail)) return false;
		if (!this.checkAdd(planalert, packetalert, telinfo, A_detail)) return false;
		return true;
	}

	checkTel(planalert: { [key: string]: boolean }, packetalert: { [key: string]: boolean }, telinfo: { carid: number; telno: any; }, A_detail: any[]) //キャリアが全て・不正・その他の場合はプラン警告
	{
		if (G_CARRIER_ALL == telinfo.carid) {
			planalert.value = true;
			this.putError(G_SCRIPT_INFO, "キャリアIDが全て" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (G_CARRIER_UNKNOWN == telinfo.carid) {
			planalert.value = true;
			this.putError(G_SCRIPT_INFO, "キャリアIDが不明" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (G_CARRIER_OTHER == telinfo.carid) {
			planalert.value = true;
			this.putError(G_SCRIPT_INFO, "キャリアIDがその他" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (!this.checkTelno6(planalert, telinfo)) return false;
		return true;
	}

	checkTelno6(alert: { [key: string]: boolean }, telinfo: { carid: number; telno: any; }) //総務省データの消滅に伴い、チェックを行わなくなった
	{
		return true;
	}

	checkPlan(planalert: { [key: string]: boolean }, packetalert: { [key: string]: boolean }, telinfo: { carid: any; cirid?: any; telno: any; planid?: any; }, A_detail: any[]) //プラン情報
	//プランIDと地域会社が食い違う場合も容認するように変更した
	{

		var key = telinfo.carid + "," + telinfo.cirid;

		if (!(undefined !== this.m_plan_count[key]) || 0 == this.m_plan_count[key]) {
			this.putError(G_SCRIPT_INFO, "プランマスター無し" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}

		if (0 == telinfo.planid.length) {
			planalert.value = true;
			this.putError(G_SCRIPT_INFO, "プランID未定義" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}

		if (!(undefined !== this.m_plan[telinfo.planid])) {
			planalert.value = true;
			this.putError(G_SCRIPT_INFO, "プランIDに合致するマスターが無い" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}


		var plan = this.m_plan[telinfo.planid];

		if (plan.cirid != telinfo.cirid) {
			planalert.value = true;
			this.putError(G_SCRIPT_INFO, "プランIDと回線種別が食い違う" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (!plan.viewflg) {
			planalert.value = true;
			this.putError(G_SCRIPT_INFO, "プランのviewflgがfalse" + `(${telinfo.carid},${telinfo.telno})`);
		}


		var is_basic_option = { "value": false };
		if (!this.checkPlanBasicWithOption(planalert, plan, telinfo, A_detail, is_basic_option)) return false;

		if (!is_basic_option.value) {
			if (!this.checkPlanBasic(planalert, plan, telinfo, A_detail)) return false;
		}

		return true;
	}

	checkPlanBasic(planalert: { [key: string]: boolean }, plan: { charge: string | any[]; }, telinfo: { carid: any; telno: any; }, A_detail: any[]) //基本料を表すコード
	//合致する基本料があればtrue
	{

		var A_basic = this.getBasic();

		var match = false;


		for (var detail of A_detail) {
			if (!(-1 !== A_basic.indexOf(detail.code))) continue;

			if (-1 !== plan.charge.indexOf(detail.charge)) //合致した
				{
					match = true;
					break;
				}
		}

		if (A_detail.length && A_basic.length && !match) {
			planalert.value = true;
			this.putError(G_SCRIPT_INFO, "プランIDと基本料が食い違う" + `(${telinfo.carid},${telinfo.telno})`);
		}

		return true;
	}

	checkPlanBasicWithOption(planalert: { [key: string]: boolean }, plan: { charge: string | any[]; }, telinfo: { carid: any; telno: any; }, A_detail: any[], is_basic_option: { [key: string]: boolean }) //基本料と付加利用料のペア
	//合致する基本料があればtrue
	{

		var A_pair = this.m_A_basic_option;

		var match = false;


		for (var H_pair of A_pair) //明細に対してループ(外側/付加利用料)
		{

			var code_basic = H_pair.basic;

			var code_option = H_pair.option;


			for (var gcnt = 0; gcnt < A_detail.length; ++gcnt) //付加利用料でなければ無視
			{
// 2022cvt_022
				if (code_option.localeCompare(A_detail[gcnt].code)) continue;
				// if (strcmp(code_option, A_detail[gcnt].code)) continue;


				for (var lcnt = 0; lcnt < A_detail.length; ++lcnt) //ペアが存在した
				//基本料が合致するか
				{
					if (gcnt == lcnt) continue;
// 2022cvt_022
					if (code_basic.localeCompare(A_detail[lcnt].code)) continue;
					// if (strcmp(code_basic, A_detail[lcnt].code)) continue;
					is_basic_option.value = true;

					var charge = A_detail[gcnt].charge + A_detail[lcnt].charge;

					if (-1 !== plan.charge.indexOf(charge)) {
						match = true;
						break;
					}
				}

				if (match) break;
			}

			if (match) break;
		}

		if (is_basic_option.value) {
			this.putError(G_SCRIPT_DEBUG, "基本料+付加利用料が存在した" + `(${telinfo.carid},${telinfo.telno})`);

			if (!match) {
				planalert.value = true;
				this.putError(G_SCRIPT_INFO, "プランIDと基本料+付加利用料が食い違う" + `(${telinfo.carid},${telinfo.telno})`);
			}
		}

		return true;
	}

	checkPacket(planalert: { [key: string]: boolean }, packetalert: { [key: string]: boolean }, telinfo: { [key: string]: any }, A_detail: Array<any>) //パケット情報
	//パケットIDと地域会社が食い違う場合も容認するように変更した
	//定額通信料を表すコード
	//合致する基本料があればtrue
	//パケット定額使用料があればtrue
	{
		if (!(-1 !== this.getFoma().indexOf(telinfo.cirid))) //パケットパックが存在しない回線種別である
			//パケットパックが存在し、それがパケットパック無しでなければ
			//パケット警告とする
			{
				if (undefined !== telinfo.packetid && telinfo.packetid.length) {
					if (undefined !== this.m_packet[telinfo.packetid] && this.m_packet[telinfo.packetid].is_empty) //パケットパック無しなので問題なし
						{} else {
						this.putError(G_SCRIPT_INFO, "パケットパックが" + "存在しない回線種別だが、パケットパックが存在する" + `(${telinfo.carid},${telinfo.telno})`);
						packetalert.value = true;
					}
				}

				return true;
			}

		if (undefined !== telinfo.planid && telinfo.planid.length && undefined !== this.m_plan[telinfo.planid] && this.m_plan[telinfo.planid].is_data) //データ専用プランである
			{

				var is_empty = false;

				if (undefined !== telinfo.packetid && telinfo.packetid.length) {
					if (undefined !== this.m_packet[telinfo.packetid] && this.m_packet[telinfo.packetid].is_empty) is_empty = true;
				} else is_empty = true;

				if (is_empty) //パケットパックが存在しない
					//正常終了とする
					{
						return true;
					} else //パケットパックが存在する
					{
						this.putError(G_SCRIPT_INFO, "データ専用プランなのに" + "パケットパックが存在する" + `(${telinfo.carid},${telinfo.telno})`);
						packetalert.value = true;
						return true;
					}
			}


		var key = telinfo.carid + "," + telinfo.cirid;

		if (!(undefined !== this.m_packet_count[key]) || 0 == this.m_packet_count[key]) {
			this.putError(G_SCRIPT_INFO, "パケットマスター無し" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}

		if (0 == telinfo.packetid.length) {
			packetalert.value = true;
			this.putError(G_SCRIPT_INFO, "パケットIDが無い" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}

		if (!(undefined !== this.m_packet[telinfo.packetid])) {
			packetalert.value = true;
			this.putError(G_SCRIPT_INFO, "パケットIDに合致するマスターが無い" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}


		var packet = this.m_packet[telinfo.packetid];

		if (packet.cirid != telinfo.cirid) {
			packetalert.value = true;
			this.putError(G_SCRIPT_INFO, "パケットIDと回線種別が食い違う" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (!packet.viewflg) {
			packetalert.value = true;
			this.putError(G_SCRIPT_INFO, "パケットのviewflgがfalse" + `(${telinfo.carid},${telinfo.telno})`);
		}


		var A_fix = this.getFix();

		var match = false;

		var is_fix = false;


		for (var detail of A_detail) {
			if (!(-1 !== A_fix.indexOf(detail.code))) continue;
			is_fix = true;

			if (-1 !== packet.charge.indexOf(detail.charge)) //合致した
				{
					match = true;
					break;
				}
		}

		if (A_detail.length && A_fix.length && !match && packet.charge.length && 0 != packet.charge[0]) {
			packetalert.value = true;
			this.putError(G_SCRIPT_INFO, "パケットIDとパケット定額通信料が食い違う" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (is_fix && packet.is_empty) {
			packetalert.value = true;
			this.putError(G_SCRIPT_INFO, "パケットパックなしだが定額通信料の請求がある" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (undefined !== this.m_plan[telinfo.planid] && Array.isArray(this.m_plan[telinfo.planid].rel_packet) && this.m_plan[telinfo.planid].rel_packet.length && !(-1 !== this.m_plan[telinfo.planid].rel_packet.indexOf(telinfo.packetid))) {
			packetalert.value = true;
			this.putError(G_SCRIPT_INFO, "プランとパケットの連係情報が食い違う" + `(${telinfo.carid},${telinfo.telno})`);
		}

		return true;
	}

	checkAdd(planalert: { [key: string]: boolean }, packetalert: { [key: string]: boolean }, telinfo: any, A_detail: any[]) {
		return true;
	}

	getFoma() {
		return this.m_A_cirid_foma;
	}

	getBasic() {
		return this.m_A_basic;
	}

	getFix() {
		return this.m_A_fix;
	}

};

//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：派生型で、追加の検査を行う
//引数：プラン警告を返す
//パケット警告を返す
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//返値：深刻なエラーがおきたらfalseを返す
class CheckAlertDocomo extends CheckAlertBase {
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: script_db) {
		super(listener, db, table_no, G_CARRIER_DOCOMO);
	}

	checkAdd(planalert: { [key: string]: boolean }, packetalert: { [key: string]: boolean }, telinfo: { arid: any; carid: any; telno: any; cirid: any; }, A_detail: any[]) //地域会社がその他でないか
	{
		if (G_AREA_DOCOMO_UNKNOWN == telinfo.arid) {
			planalert.value = true;
			this.putError(G_SCRIPT_INFO, "地域会社がその他" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (G_CIRCUIT_DOCOMO_OTHER == telinfo.cirid) {
			planalert.value = true;
			this.putError(G_SCRIPT_INFO, "回線種別がその他" + `(${telinfo.carid},${telinfo.telno})`);
		}

		return true;
	}

};

//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：派生型で、追加の検査を行う
//引数：プラン警告を返す
//パケット警告を返す
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//返値：深刻なエラーがおきたらfalseを返す
class CheckAlertAU extends CheckAlertBase {
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: script_db) //パケット定額通信料の内訳を読み出す処理は除去した
	{
		super(listener, db, table_no, G_CARRIER_AU);
	}

	checkAdd(planalert: { [key: string]: boolean }, packetalert: { [key: string]: boolean }, telinfo: any, A_detail: any[]) //請求明細による検査は除去した
	//cdmaのパケット定額通信料があれば確実にCDMA
	//winのパケット定額通信料があれば確実にWIN
	{
		return true;
	}

};
