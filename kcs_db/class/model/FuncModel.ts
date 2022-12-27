import ModelBase from './ModelBase';

export default class FuncModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPactFunc(pactid: string, hhmm = undefined, extend_flg = false) {
		if (isNaN(Number(pactid))) {
			this.getOut().errorOut(0, "FuncModel::getPactFunc() pactidが不正", false);
		}

		var sql = "select " + "fnc.ininame," + "frl.fncid " + "from " + "fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where " + "frl.pactid = " + pactid + " " + "and frl.userid = 0 " + "and fnc.type = 'CO' " + "and fnc.enable = true ";

		if (hhmm !== undefined) {
			sql += "and " + this.makeExtendSql(hhmm, extend_flg);
		}

		sql += "order by " + "frl.fncid";
		return this.getDB().queryAssoc(sql);
	}

	makeExtendSql(hhmm: string | undefined, extend_flg = false) {
		if (isNaN(Number(hhmm))) {
			this.getOut().errorOut(0, "FuncModel::makeExtendSql() 引数の時間(hhmm)が不正", false);
		}

		if (extend_flg == true) {
			var sql_str = "(extend = true or (" + "cast(fnc.starttime as integer) <= " + +(hhmm + " " + "and cast(fnc.endtime as integer) > " + +(hhmm + ")" + ") "));
		} else {
			sql_str = "cast(fnc.starttime as integer) <= " + +(hhmm + " " + "and cast(fnc.endtime as integer) > " + +(hhmm + " "));
		}

		return sql_str;
	}

	getPactHadFunction(type: string, A_funcnamelist: any[], A_pactidlist:any = undefined) {
		var where_pactid = "";

		if (A_pactidlist) {
			where_pactid = "fnc_relation_tb.pactid in (" + A_pactidlist.join(",") + ") AND ";
		}

		var select_sql = "SELECT fnc_relation_tb.pactid, function_tb.ininame FROM " + "fnc_relation_tb " + "INNER JOIN " + "function_tb ON fnc_relation_tb.fncid = function_tb.fncid " + "WHERE " + where_pactid + "function_tb.ininame in ('" + A_funcnamelist.join("','") + "') " + "ORDER BY " + "fnc_relation_tb.pactid, function_tb.fncid";

		if (type == "assoc") {
			return this.getDB().queryAssoc(select_sql);
		} else if (type == "col") {
			return this.getDB().queryCol(select_sql);
		} else {
			return this.getDB().queryHash(select_sql);
		}
	}

	getUserFunc(userid: string, pactid: string, hhmm = undefined, extend_flg = false) //入力チェック
	//時間指定があればSQL(where句)追加
	{
		if (isNaN(Number(userid)) ) {
			this.getOut().errorOut(0, "FuncModel::getUserFunc() useridが不正", false);
		}

		if (isNaN(Number(pactid))) {
			this.getOut().errorOut(0, "FuncModel::getUserFunc() pactidが不正", false);
		}

		var sql = "select " + "fnc.ininame," + "frl.fncid " + "from " + "fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where " + "frl.userid = " + userid + " " + "and frl.pactid = " + pactid + " " + "and fnc.type != 'CO' " + "and fnc.enable = true " + "and fnc.type != (case when 'SU' = (select " + "type " + "from " + "user_tb " + "where " + "pactid = " + pactid + " " + "and userid = " + userid + ") then 'CO' else 'SU' end" + ") ";

		if (!isNaN(Number(hhmm))) {
			sql += "and " + this.makeExtendSql(hhmm, extend_flg);
		}

		sql += "order by " + "frl.fncid";
		return this.getDB().queryAssoc(sql);
	}

	getFuncidFromPath(path: string) //入力チェック
	///Management,/Billの権限があると全部見えてしまう不具合修正
	//文字列連結から配列で処理する様に修正） 20100303 houshiyama
	//上から順番にマッチするパスを切り出す
	//$this->getOut()->debugOut( $sql );
	{
		if (path == "") {
			this.getOut().errorOut(0, "FuncModel::getFuncidFromPath() pathがない", false);
		}

		var A_path = path.split("/");
		var A_where = Array();

		for (var eachpath of Object.values(A_path)) {
			if (eachpath == "") {
				continue;
			}

			var matchpath: string = "/" + eachpath;

			if ("/Management/Tel" == matchpath || "/Management/ETC" == matchpath || "/Management/Purchase" == matchpath || "/Management/Copy" == matchpath || "/Management/Assets" == matchpath || "/Management/Transit" == matchpath || "/Management/Ev" == matchpath || "/Bill/Tel" == matchpath || "/Bill/ETC" == matchpath || "/Bill/Purchase" == matchpath || "/Bill/Copy" == matchpath || "/Bill/Transit" == matchpath || "/Bill/Ev" == matchpath) {
				A_where = Array();
			}

			A_where.push("path = '" + matchpath + "'");
		}

		var pathwhere = "(" + A_where.join(" or ") + ")";
		var sql = "select " + "fncid " + "from " + "function_tb " + "where " + pathwhere + "and type != 'CO' " + "and enable = true";
		return this.getDB().queryCol(sql);
	}

	getHelpFromId(fncid: string) {
		var sql = "select helpfile from function_tb where fncid = " + this.getDB().dbQuote(fncid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getHelpFromIni(ininame: string) {
		var sql = "select helpfile from function_tb where ininame = " + this.getDB().dbQuote(ininame, "text", true);
		return this.getDB().queryOne(sql);
	}

	getAdminFuncs(shopid: string, memid: string) {
		var db = this.get_DB();
		var sql = "SELECT fncid FROM admin_fnc_relation_tb WHERE" + " shopid=" + db.dbQuote(shopid, "integer", true) + " AND memid=" + db.dbQuote(memid, "integer", true);
		return this.get_DB().queryCol(sql);
	}
};