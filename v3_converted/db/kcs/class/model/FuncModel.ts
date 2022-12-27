//
//MtAuthorityで使用するモデル
//
//@filesource
//@uses ModelBase
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/03/18
//
//
//
//MtAuthorityで使用するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/03/18
//

require("model/ModelBase.php");

require("MtDBUtil.php");

require("MtOutput.php");

//
//コンストラクタ
//
//@author katsushi
//@since 2008/03/07
//
//@param object $O_DB
//@access public
//@return void
//
//
//getPactFunc
//
//@author katsushi
//@since 2008/04/01
//
//@param integer $pactid
//@param string $hhmm default = null
//@param boolean $extend_flg default = false
//@access public
//@return array
//
//
//夜間営業を区別するSQL(where句)を生成する
//
//@author katsushi
//@since 2008/04/01
//
//@param string $hhmm
//@param boolean $extend_flg default = false
//@access public
//@return string
//
//
//顧客リストの中から権限リストの権限が一つでも含む会社の一覧を返す
//
//@author ishizaki
//@since 2008/08/05
//
//@param mixed $A_pactidlist
//@param mixed $A_funclist
//@access public
//@return void
//
//
//getUserFunc
//
//@author katsushi
//@since 2008/04/01
//
//@param integer $userid
//@param integer $pactid
//@param string $hhmm default = null
//@param boolean $extend_flg default = false
//@param boolean $su default = false
//@access public
//@return array
//
//
//パスからユーザー権限のfncidを配列で取得する
//
//@author katsushi
//@since 2008/04/10
//
//Ev対応 2010/08/19 s.maeda
//
//@param string $path
//@access public
//@return array
//
//
//getHelpFromId
//
//@author katsushi
//@since 2008/11/10
//
//@param mixed $fncid
//@access public
//@return void
//
//
//getHelpFromIni
//
//@author katsushi
//@since 2008/11/10
//
//@param mixed $ininame
//@access public
//@return void
//
//
//getAdminFuncs
//指定された管理者ユーザーの権限を配列で返す
//@author web
//@since 2018/09/27
//
//@param mixed $shopid
//@param mixed $memid
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/04/10
//
//@access public
//@return void
//
class FuncModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPactFunc(pactid, hhmm = undefined, extend_flg = false) {
		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(0, "FuncModel::getPactFunc() pactid\u304C\u4E0D\u6B63", false);
		}

		var sql = "select " + "fnc.ininame," + "frl.fncid " + "from " + "fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where " + "frl.pactid = " + pactid + " " + "and frl.userid = 0 " + "and fnc.type = 'CO' " + "and fnc.enable = true ";

		if (hhmm !== undefined) {
			sql += "and " + this.makeExtendSql(hhmm, extend_flg);
		}

		sql += "order by " + "frl.fncid";
		var H_return = this.getDB().queryAssoc(sql);
		return H_return;
	}

	makeExtendSql(hhmm, extend_flg = false) {
		if (is_numeric(hhmm) == false) {
			this.getOut().errorOut(0, "FuncModel::makeExtendSql() \u5F15\u6570\u306E\u6642\u9593(hhmm)\u304C\u4E0D\u6B63", false);
		}

		if (extend_flg == true) {
			var sql_str = "(extend = true or (" + "cast(fnc.starttime as integer) <= " + +(hhmm + " " + "and cast(fnc.endtime as integer) > " + +(hhmm + ")" + ") "));
		} else {
			sql_str = "cast(fnc.starttime as integer) <= " + +(hhmm + " " + "and cast(fnc.endtime as integer) > " + +(hhmm + " "));
		}

		return sql_str;
	}

	getPactHadFunction(type, A_funcnamelist, A_pactidlist = undefined) {
		var where_pactid = "";

		if (false == is_null(A_pactidlist)) {
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

	getUserFunc(userid, pactid, hhmm = undefined, extend_flg = false) //入力チェック
	//時間指定があればSQL(where句)追加
	{
		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "FuncModel::getUserFunc() userid\u304C\u4E0D\u6B63", false);
		}

		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(0, "FuncModel::getUserFunc() pactid\u304C\u4E0D\u6B63", false);
		}

		var sql = "select " + "fnc.ininame," + "frl.fncid " + "from " + "fnc_relation_tb frl inner join function_tb fnc on frl.fncid = fnc.fncid " + "where " + "frl.userid = " + userid + " " + "and frl.pactid = " + pactid + " " + "and fnc.type != 'CO' " + "and fnc.enable = true " + "and fnc.type != (case when 'SU' = (select " + "type " + "from " + "user_tb " + "where " + "pactid = " + pactid + " " + "and userid = " + userid + ") then 'CO' else 'SU' end" + ") ";

		if (is_numeric(hhmm) == true) {
			sql += "and " + this.makeExtendSql(hhmm, extend_flg);
		}

		sql += "order by " + "frl.fncid";
		var H_return = this.getDB().queryAssoc(sql);
		return H_return;
	}

	getFuncidFromPath(path) //入力チェック
	///Management,/Billの権限があると全部見えてしまう不具合修正
	//文字列連結から配列で処理する様に修正） 20100303 houshiyama
	//上から順番にマッチするパスを切り出す
	//$this->getOut()->debugOut( $sql );
	{
		if (path == "") {
			this.getOut().errorOut(0, "FuncModel::getFuncidFromPath() path\u304C\u306A\u3044", false);
		}

		var A_path = split("/", path);
		var A_where = Array();

		for (var eachpath of Object.values(A_path)) {
			if (eachpath == "") {
				continue;
			}

			matchpath += "/" + eachpath;

			if ("/Management/Tel" == matchpath || "/Management/ETC" == matchpath || "/Management/Purchase" == matchpath || "/Management/Copy" == matchpath || "/Management/Assets" == matchpath || "/Management/Transit" == matchpath || "/Management/Ev" == matchpath || "/Bill/Tel" == matchpath || "/Bill/ETC" == matchpath || "/Bill/Purchase" == matchpath || "/Bill/Copy" == matchpath || "/Bill/Transit" == matchpath || "/Bill/Ev" == matchpath) {
				A_where = Array();
			}

			A_where.push("path = '" + matchpath + "'");
		}

		var pathwhere = "(" + A_where.join(" or ") + ")";
		var sql = "select " + "fncid " + "from " + "function_tb " + "where " + pathwhere + "and type != 'CO' " + "and enable = true";
		return this.getDB().queryCol(sql);
	}

	getHelpFromId(fncid) {
		var sql = "select helpfile from function_tb where fncid = " + this.getDB().dbQuote(fncid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getHelpFromIni(ininame) {
		var sql = "select helpfile from function_tb where ininame = " + this.getDB().dbQuote(ininame, "text", true);
		return this.getDB().queryOne(sql);
	}

	getAdminFuncs(shopid, memid) {
		var db = this.get_DB();
		var sql = "SELECT fncid FROM admin_fnc_relation_tb WHERE" + " shopid=" + db.dbQuote(shopid, "integer", true) + " AND memid=" + db.dbQuote(memid, "integer", true);
		return this.get_DB().queryCol(sql);
	}

	__destruct() {
		super.__destruct();
	}

};