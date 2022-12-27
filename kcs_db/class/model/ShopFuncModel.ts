//MtShopAuthorityで使用するモデル

import FuncModel from '../model/FuncModel';

export default class ShopFuncModel extends FuncModel {
	static FNC_PRINT_ALWAYS = 27;
	static FNC_PRINT_UPDATE = 28;
	static FNC_ORDERMAIL_SEND = 29;

	constructor(O_db = undefined) {
		super(O_db);
	}

	getAllShopAuth(type = "US") //$this->debugOut( $sql );
	{
		const sql = "select fncid, fncname, ininame from shop_function_tb " + "where type='" + type + "' and enable=true " + "order by show_order";
		return this.get_DB().queryHash(sql);
	}

	getShopFunc(shopid: string, hhmm = undefined, extend_flg = false) {
		if (!isNaN(Number(shopid)) == false) {
			this.getOut().errorOut(0, "ShopFuncModel::makeExtendSql() 引数の時間(hhmm)が不正", false);
		}

		let sql = "select " + "fnc.ininame," + "frl.fncid " + "from " + "shop_fnc_relation_tb frl inner join shop_function_tb fnc on frl.fncid = fnc.fncid " + "where " + "frl.shopid = " + shopid + " " + "and frl.memid = 0 " + "and fnc.type = 'CO' " + "and fnc.enable = true ";

		if (hhmm !== undefined) {
			sql += "and " + this.makeExtendSql(hhmm, extend_flg);
		}

		sql += "order by " + "frl.fncid";
		return this.getDB().queryAssoc(sql);
	}

	makeExtendSql(hhmm: string , extend_flg = false) {
		if (!isNaN(Number(hhmm)) == false) {
			this.getOut().errorOut(0, "ShopFuncModel::makeExtendSql() 引数の時間(hhmm)が不正", false);
		}

		if (extend_flg == true) {
			var sql_str = "(extend = true or (" + "cast(fnc.starttime as integer) <= " + +(hhmm + " " + "and cast(fnc.endtime as integer) > " + +(hhmm + ")" + ") "));
		} else {
			sql_str = "cast(fnc.starttime as integer) <= " + +(hhmm + " " + "and cast(fnc.endtime as integer) > " + +(hhmm + " "));
		}

		return sql_str;
	}

	getUserFunc(memid: string, shopid: string, hhmm: any = undefined, extend_flg = false) //入力チェック
	{
		if (!isNaN(Number(memid)) == false) {
			this.getOut().errorOut(0, "ShopFuncModel::getUserFunc() memidが不正", false);
		}

		if (!isNaN(Number(shopid)) == false) {
			this.getOut().errorOut(0, "ShopFuncModel::getUserFunc() shopidが不正", false);
		}

		let sql = "select " + "fnc.ininame," + "frl.fncid " + "from " + "shop_fnc_relation_tb frl inner join shop_function_tb fnc on frl.fncid = fnc.fncid " + "where " + "frl.memid = " + memid + " " + "and frl.shopid = " + shopid + " " + "and fnc.type != 'CO' " + "and fnc.enable = true " + "and fnc.type != (case when 'SU' = (select " + "type " + "from " + "shop_member_tb " + "where " + "shopid = " + shopid + " " + "and memid = " + memid + ") then 'CO' else 'SU' end" + ") ";

		if (!isNaN(Number(hhmm)) == true) {
			sql += "and " + this.makeExtendSql(hhmm, extend_flg);
		}

		sql += "order by " + "frl.fncid";
		return this.getDB().queryAssoc(sql);
	}

	getFuncidFromPath(path: string) //入力チェック
	{
		if (path == "") {
			this.getOut().errorOut(0, "ShopFuncModel::getFuncidFromPath() pathがない", false);
		}

		let pathwhere = "(";
		const A_path = path.split("/");
		let or = " ";

		var matchpath = "";
		for (var eachpath of Object.values(A_path)) {
			if (eachpath == "") {
				continue;
			}

			matchpath += "/" + eachpath;
			pathwhere += or + "path = '" + matchpath + "' ";
			or = "or ";
		}

		pathwhere += ") ";
		const sql = "select " + "fncid " + "from " + "shop_function_tb " + "where " + pathwhere + "and type != 'CO' " + "and enable = true";
		return this.getDB().queryCol(sql);
	}

	async getUserFuncList(shopid: any, memid: any) //ショップに属しているメンバーと権限を一覧
	{
		let sql  = "SELECT type FROM shop_member_tb WHERE memid=" + this.getDB().dbQuote(memid, "int", true);
		const type = await this.getDB().queryOne(sql);
		sql = "select sfn.ininame, sfn.fncname, sfn.type, sfn.memo, sfr.memid " + "from shop_function_tb sfn " + "left outer join shop_fnc_relation_tb sfr on sfn.fncid=sfr.fncid " + "where (sfr.shopid=" + shopid + " or sfr.shopid is null) " + "and sfn.type != 'CO' " + "and sfn.enable=true ";

		if ("SU" != type) {
			sql += "AND sfn.fncid NOT IN (" + ShopFuncModel.FNC_PRINT_ALWAYS + ", " + ShopFuncModel.FNC_PRINT_UPDATE + ", " + ShopFuncModel.FNC_ORDERMAIL_SEND + ") ";
		}

		sql += "order by sfn.fncid";
		const H_result = await this.getDB().queryHash(sql);
		const H_uniqiname = Array();
		const H_ismemid = Array();

		for (var A_row of H_result) //ininameをキーにまとめる
		{
			let ininame = A_row.ininame;
			H_uniqiname[ininame] = A_row;

			if (A_row.memid == memid) //memid が一致するものを集める
				{
					H_ismemid[ininame] = true;
				}
		}

		var H_return: any = Array();

		for (let ininame in H_uniqiname) {
			var A_row = H_uniqiname[ininame];
			A_row.ininame = ininame;

			if (H_ismemid[ininame] == true) {
				A_row.is_memid = true;
			} else {
				A_row.is_memid = false;
			}

			H_return[ininame] = A_row;
		}

		return H_return;
	}
};
