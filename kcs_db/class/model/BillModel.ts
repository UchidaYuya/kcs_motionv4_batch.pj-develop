import ModelBase from './ModelBase';

export default class BillModel extends ModelBase { 
	constructor(O_db = undefined) {
		super(O_db);
	}

	getCardnoList(card_tb: string, pactid: string, delete_flg = false) {
		let sql = "select cardno from " + card_tb + " where pactid=" + pactid;

		if (delete_flg == true) {
			sql += " and delete_flg=true";
		} else {
			sql += " and delete_flg=false";
		}

		return this.getDB().queryCol(sql);
	}

	async getUtiwake(A_Carid: any[]) //内訳種別分処理する
	{
		const sql = "select carid,code,name,taxtype,codetype " + "from utiwake_tb " + "where carid in (" + A_Carid.join(",") + ") " + "order by carid,code";
		
		let H_result = await this.getDB().queryHash(sql);
		H_result =  [
			{
			  carid: 31,
			  code: '1-1',
			  name: 'ＮＴＴ－Ｅ／Ｗ',
			  taxtype: '1',
			  codetype: '0'
			},
			{ carid: 31, code: '61-1', name: '移動体', taxtype: '1', codetype: '0' },
			{
			  carid: 31,
			  code: '71-2',
			  name: '国内専用線',
			  taxtype: '1',
			  codetype: '0'
			},
			{
			  carid: 31,
			  code: '82-1',
			  name: 'ＮＴＴ－Ｃ国内',
			  taxtype: '1',
			  codetype: '0'
			},
			{
			  carid: 31,
			  code: '84-2',
			  name: 'ＮＴＴ－Ｃ国際',
			  taxtype: '0',
			  codetype: '0'
			},
			{
			  carid: 31,
			  code: 'ASP',
			  name: 'ASP使用料',
			  taxtype: '0',
			  codetype: '0'
			},
			{
			  carid: 31,
			  code: 'ASX',
			  name: 'ASP使用料消費税',
			  taxtype: '0',
			  codetype: '0'
			}
		  ]
		  
		// console.log("check data >>>",H_result);
		  
		
		const CodeCnt = H_result.length;
		const H_Utiwake = {};

		for (var CodeCounter = 0; CodeCounter < CodeCnt; CodeCounter++) //array(CARID => array(CODE => array(NAME => XXX, TAXTYPE => YYYY)))
		{
			H_Utiwake[H_result[CodeCounter].carid] = {
				[H_result[CodeCounter].code] : {
					name: H_result[CodeCounter].name,
					taxtype: H_result[CodeCounter].taxtype,
					codetype: H_result[CodeCounter].codetype
				}
			}
		}
		return H_Utiwake;
	}

	async getCardUtiwake(A_cardcoid: any[]) //内訳種別分処理する
	{
		const sql = "select cardcoid,code,name,taxtype " + "from card_utiwake_tb " + "where cardcoid in (" + A_cardcoid.join(",") + ") " + "order by cardcoid,code";
		const H_result = await this.getDB().queryHash(sql);
		const CodeCnt = H_result.length;
		const H_Utiwake = Array();

		for (var CodeCounter = 0; CodeCounter < CodeCnt; CodeCounter++) //array(CARDCOID => array(CODE => array(NAME => XXX, TAXTYPE => YYYY)))
		{
			H_Utiwake[H_result[CodeCounter].cardcoid][H_result[CodeCounter].code] = {
				name: H_result[CodeCounter].name,
				taxtype: H_result[CodeCounter].taxtype
			};
		}

		return H_Utiwake;
	}

	async getPurchaseUtiwake(A_purchcoid: any[]) //内訳種別分処理する
	{
		const sql = "select purchcoid,code,name,taxtype " + "from purchase_utiwake_tb " + "where purchcoid in (" + A_purchcoid.join(",") + ") " + "order by purchcoid,code";
		const H_result = await this.getDB().queryHash(sql);
		const CodeCnt = H_result.length;
		const H_Utiwake = Array();

		for (var CodeCounter = 0; CodeCounter < CodeCnt; CodeCounter++) //array(PURCHCOID => array(CODE => array(NAME => XXX, TAXTYPE => YYYY)))
		{
			H_Utiwake[H_result[CodeCounter].purchcoid][H_result[CodeCounter].code] = {
				name: H_result[CodeCounter].name,
				taxtype: H_result[CodeCounter].taxtype
			};
		}

		return H_Utiwake;
	}

	async getCopyUtiwake(A_copycoid: any[]) //内訳種別分処理する
	{
		const sql = "select copycoid,code,name,taxtype " + "from copy_utiwake_tb " + "where copycoid in (" + A_copycoid.join(",") + ") " + "order by copycoid,code";
		const H_result = await this.getDB().queryRowHash(sql);
		const CodeCnt = H_result.length;
		const H_Utiwake = {};

		for (var CodeCounter = 0; CodeCounter < CodeCnt; CodeCounter++) //array(COPYCOID => array(CODE => array(NAME => XXX, TAXTYPE => YYYY)))
		{
			H_Utiwake[H_result[CodeCounter].copycoid] = {
				[H_result[CodeCounter].code] : {
					name: H_result[CodeCounter].name,
					taxtype: H_result[CodeCounter].taxtype
				}
			};
		}

		return H_Utiwake;
	}

	async getTransitUtiwake(A_trancoid: any[]) //内訳種別分処理する
	{
		const sql = "SELECT trancoid,code,name,taxtype " + "FROM transit_utiwake_tb " + "WHERE trancoid IN (" + A_trancoid.join(",") + ") " + "ORDER BY trancoid,code";
		const H_result = await this.getDB().queryHash(sql);
		const CodeCnt = H_result.length;
		const H_Utiwake = Array();

		for (var CodeCounter = 0; CodeCounter < CodeCnt; CodeCounter++) //array(TRANCOID => array(CODE => array(NAME => XXX, TAXTYPE => YYYY)))
		{
			H_Utiwake[H_result[CodeCounter].trancoid][H_result[CodeCounter].code] = {
				name: H_result[CodeCounter].name,
				taxtype: H_result[CodeCounter].taxtype
			};
		}

		return H_Utiwake;
	}

	async getMaxDetailnoList(pactid: string, tableno: string, A_carid = Array(), A_exceptCode = Array()) //carid 指定があった場合
	{
		const H_dbData = Array();
		let sql = "select carid,telno,max(detailno) " + "from tel_details_" + tableno + "_tb " + "where pactid = " + pactid + " ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		if (0 != A_exceptCode.length) {
			sql += "and code not in ('" + A_exceptCode.join("','") + "') ";
		}

		sql += "group by carid,telno " + "order by carid,telno";
		const H_result = await this.getDB().queryHash(sql);
		const recCnt = H_result.length;

		for (var recCounter = 0; recCounter < recCnt; recCounter++) {
			H_dbData[H_result[recCounter].carid][H_result[recCounter].telno] = H_result[recCounter].max;
		}

		return H_dbData;
	}

	async getTelDetailsData(pactid: string, tableno: string, A_carid = Array(), A_code = Array()) //carid 指定があった場合
	{
		const H_dbData = Array();
		let sql = "select * " + "from tel_details_" + tableno + "_tb " + "where pactid = " + pactid + " ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		if (0 != A_code.length) {
			sql += "and code in ('" + A_code.join("','") + "') ";
		}

		sql += "order by carid,telno,detailno";
		const H_result = await this.getDB().queryHash(sql);
		const recCnt = H_result.length;

		for (var recCounter = 0; recCounter < recCnt; recCounter++) {
			H_dbData[H_result[recCounter].carid][H_result[recCounter].telno][H_result[recCounter].detailno] = {
				pactid: H_result[recCounter].pactid,
				code: H_result[recCounter].code,
				codename: H_result[recCounter].codename,
				charge: H_result[recCounter].charge,
				taxkubun: H_result[recCounter].taxkubun,
				recdate: H_result[recCounter].recdate,
				tdcomment: H_result[recCounter].tdcomment,
				prtelno: H_result[recCounter].prtelno,
				realcnt: H_result[recCounter].realcnt
			};
		}

		return H_dbData;
	}

	delTelDetailsData(A_pactid: any[], tableno: string, A_carid = Array(), A_code = Array()) //carid 指定があった場合
	{
		let sql = "delete from tel_details_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";
		
		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		if (0 != A_code.length) {
			sql += "and code in ('" + A_code.join("','") + "') ";
		}

		return this.getDB().exec(sql);
	}

	delCommhistoryData(A_pactid: any[], tableno: string, A_carid = Array()) //carid 指定があった場合
	{
		let sql = "delete from commhistory_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_carid.length) {
			sql += "and carid in (" + A_carid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delCardDetailsData(A_pactid: any[], tableno: string, A_coid = Array(), A_code = Array()) //cardcoid 指定があった場合
	{
		let sql = "delete from card_details_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_coid.length) {
			sql += "and cardcoid in (" + A_coid.join(",") + ") ";
		}

		if (0 != A_code.length) {
			sql += "and code in ('" + A_code.join("','") + "') ";
		}

		return this.getDB().exec(sql);
	}

	delCardUsehistoryData(A_pactid: any[], tableno: string, A_coid = Array()) //carid 指定があった場合
	{
		let sql = "delete from card_usehistory_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_coid.length) {
			sql += "and cardcoid in (" + A_coid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delPurchaseDetailsData(A_pactid: any[], tableno: string, A_purchcoid = Array(), A_code = Array()) //purchcoid 指定があった場合
	{
		let sql = "delete from purchase_details_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_purchcoid.length) {
			sql += "and purchcoid in (" + A_purchcoid.join(",") + ") ";
		}

		if (0 != A_code.length) {
			sql += "and code in ('" + A_code.join("','") + "') ";
		}

		return this.getDB().exec(sql);
	}

	delCopyDetailsData(A_pactid: any[], tableno: string, A_copycoid = Array(), A_code = Array()) //copycoid 指定があった場合
	{
		var sql = "delete from copy_details_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_copycoid.length) {
			sql += "and copycoid in (" + A_copycoid.join(",") + ") ";
		}

		if (0 != A_code.length) {
			sql += "and code in ('" + A_code.join("','") + "') ";
		}

		return this.getDB().exec(sql);
	}

	delCopyHistoryData(A_pactid: any[], tableno: string, A_copycoid = Array()) //copycoid 指定があった場合
	{
		let sql = "delete from copy_history_" + tableno + "_tb " + "where pactid in (" + A_pactid.join(",") + ") ";

		if (0 != A_copycoid.length) {
			sql += "and copycoid in (" + A_copycoid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delTransitUseHistoryData(A_pactid: any[], tableno: string, A_trancoid = Array()) //trancoid 指定があった場合
	{
		let sql = "DELETE from transit_usehistory_" + tableno + "_tb " + "WHERE pactid IN (" + A_pactid.join(",") + ") ";

		if (0 != A_trancoid.length) {
			sql += "and trancoid in (" + A_trancoid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delTransitDetailsData(A_pactid: any[], tableno: string, A_trancoid = Array()) //trancoid 指定があった場合
	{
		let sql = "DELETE from transit_details_" + tableno + "_tb " + "WHERE pactid IN (" + A_pactid.join(",") + ") ";

		if (0 != A_trancoid.length) {
			sql += "and trancoid in (" + A_trancoid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delEvUseHistoryData(A_pactid: any[], tableno: string, A_coid = Array()) //未確定に対応 20100924miya
	{
		let table: string;
		if ("" == tableno) {
			table = "ev_usehistory_tb";
		} else {
			table = "ev_usehistory_" + tableno + "_tb";
		}

		let sql = "DELETE from " + table + " " + "WHERE pactid IN (" + A_pactid.join(",") + ") ";

		if (0 != A_coid.length) {
			sql += "and evcoid in (" + A_coid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delEvDetailsData(A_pactid: any[], tableno: string, A_coid = Array()) //未確定に対応 20100924miya
	{
		let table: string;
		if ("" == tableno) {
			table = "ev_details_tb";
		} else {
			table = "ev_details_" + tableno + "_tb";
		}

		let sql = "DELETE from " + table + " " + "WHERE pactid IN (" + A_pactid.join(",") + ") ";

		if (0 != A_coid.length) {
			sql += "and evcoid in (" + A_coid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	delHealthcareRecHistoryData(A_pactid: any[], tableno: string, A_healthcoid = Array()) //trancoid 指定があった場合
	{
		let sql = "DELETE from healthcare_rechistory_" + tableno + "_tb " + "WHERE pactid IN (" + A_pactid.join(",") + ") ";

		if (0 != A_healthcoid.length) {
			sql += "and healthcoid in (" + A_healthcoid.join(",") + ") ";
		}

		return this.getDB().exec(sql);
	}

	getAspCharge(pactid: string, carid: string) {
		const sql = "select charge from asp_charge_tb " + "where pactid = " + pactid + " " + "and carid = " + carid;
		return this.getDB().queryOne(sql);
	}

	getCardAspCharge(pactid: string, cardcoid: string) {
		const sql = "select charge from card_asp_charge_tb " + "where pactid = " + pactid + " " + "and cardcoid = " + cardcoid;
		return this.getDB().queryOne(sql);
	}

	getPurchaseAspCharge(pactid: string, purchcoid: string) {
		const sql = "select charge from purchase_asp_charge_tb " + "where pactid = " + pactid + " " + "and purchcoid = " + purchcoid;
		return this.getDB().queryOne(sql);
	}

	getCopyAspCharge(pactid: string, copycoid: string) {
		var sql = "select charge from copy_asp_charge_tb " + "where pactid = " + pactid + " " + "and copycoid = " + copycoid;
		return this.getDB().queryOne(sql);
	}

	getTransitAspCharge(pactid: string, trancoid: string) {
		const sql = "SELECT charge FROM transit_asp_charge_tb " + "WHERE pactid = " + pactid + " " + "AND trancoid = " + trancoid;
		return this.getDB().queryOne(sql);
	}

	getEvAspCharge(pactid: string, coid: string) {
		const sql = "SELECT charge FROM ev_asp_charge_tb " + "WHERE pactid = " + pactid + " " + "AND evcoid = " + coid;
		return this.getDB().queryOne(sql);
	}

	async getDummy(pactid: string, carid: string, reqno = "", tableNo = "") //親番号が指定されている場合
	//dummy_tb から所属部署ＩＤが取得できた場合
	{
		let sql = "select telno,postid from dummy_tel_tb " + "where pactid = " + pactid + " and " + "carid = " + carid;

		if ("" != reqno.trim()) {
			sql = sql + " and reqno = '" + reqno + "'";
		}

		var H_data = await this.getDB().queryHash(sql);

		if (H_data.length != 0 && H_data[0].postid != "") //本当にpost_X_tb に存在しているかチェックする
			{
				var tableName = "post_";

				if (tableNo != "") {
					tableName = tableName + tableNo + "_tb";
				} else {
					tableName = tableName + "_tb";
				}

				sql = "select postid from " + tableName + " where pactid = " + pactid + " and postid = " + H_data[0].postid;
				var rtn = await this.getDB().queryOne(sql);

				if ("" == rtn) {
					H_data[0].postid = "";
				}
			}

		return H_data;
	}

	async getPactid(carid: string, prtelno: string) //親番号の登録が無かった場合
	{
		const sql = "select pactid from bill_prtel_tb " + "where carid = " + carid + " and " + "prtelno = '" + prtelno + "'";
		const rtn = await this.getDB().queryOne(sql);

		if ("" == rtn) //親番号の登録があった場合
			{
				return false;
			} else {
			return rtn;
		}
	}

	getTelCnt(pactid: string, tableno: string, carid: string) {
		const sql = "select count(distinct telno) from tel_details_" + tableno + "_tb " + "where pactid = " + pactid + " and " + "carid = " + carid;
		return this.getDB().queryOne(sql);
	}

	getSumCharge(pactid: string, tableno: string, carid: string, A_code = Array(), A_telno = Array()) {
		let sql = "select sum(charge) from tel_details_" + tableno + "_tb " + "where pactid = " + pactid + " and " + "carid = " + carid;

		if (0 != A_code.length) {
			sql += " and code in ('" + A_code.join("','") + "') ";
		}

		if (0 != A_telno.length) {
			sql += " and telno in ('" + A_telno.join("','") + "') ";
		}

		return this.getDB().queryOne(sql);
	}

	async getPostidTelno(pactid: string, tableno: string, carid: string) {
		const sql = "select distinct te.postid,td.telno " + "from tel_details_" + tableno + "_tb td inner join tel_" + tableno + "_tb te " + "on td.carid = te.carid and td.pactid = te.pactid and td.telno = te.telno " + "where td.pactid = " + pactid + " and " + "td.carid = " + carid + " " + "order by te.postid,td.telno";
		const H_rtn = await this.getDB().queryHash(sql);
		const recCnt = H_rtn.length;
		const H_data = Array();

		for (var counter = 0; counter < recCnt; counter++) {
			if (false == (undefined !== H_data[H_rtn[counter].postid])) {
				H_data[H_rtn[counter].postid] = [H_rtn[counter].telno];
			} else {
				H_data[H_rtn[counter].postid].push(H_rtn[counter].telno);
			}
		}

		return H_data;
	}
};