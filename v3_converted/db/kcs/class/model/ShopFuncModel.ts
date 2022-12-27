//
//MtShopAuthorityで使用するモデル
//
//@filesource
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/03/18
//
//
//
//MtShopAuthorityで使用するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/03/18
//

require("model/ModelBase.php");

require("MtDBUtil.php");

require("MtOutput.php");

require("FuncModel.php");

//
//コンストラクタ
//
//@author nakanita
//@since 2008/03/07
//
//@param object $O_DB
//@access public
//@return void
//
//
//単純にショップの全件下一覧を返す
//
//@author nakanita
//@since 2008/11/28
//
//@param string $type
//@access public
//@return void
//
//
//ショップに与えられている権限を返す
//
//@author nakanita
//@since 2008/04/01
//
//@param integer $shopid
//@param string $hhmm default = null
//@param boolean $extend_flg default = false
//@access public
//@return array
//
//
//夜間営業を区別するSQL(where句)を生成する
//
//@author nakanita
//@since 2008/04/01
//
//@param string $hhmm
//@param boolean $extend_flg default = false
//@access public
//@return string
//
//
//ショップメンバーに与えられている権限を返す
//
//@author nakanita
//@since 2008/04/01
//
//@param integer $memid
//@param integer $shopid
//@param string $hhmm default = null
//@param boolean $extend_flg default = false
//@param boolean $su default = false
//@access public
//@return array
//
//
//パスからユーザー権限のfncidを配列で取得する
//
//@author nakanita
//@since 2008/04/10
//
//@param string $path
//@access public
//@return array
//
//
//ショップに属するメンバーの権限の有無を一覧で返す。メンバーの権限管理に用いている。
//
//@author nakanita
//@since 2008/06/05
//
//@param mixed $shopid
//@param mixed $memid
//@access public
//@return void
//
//
//__destruct
//
//@author nakanita
//@since 2008/04/10
//
//@access public
//@return void
//
class ShopFuncModel extends FuncModel {
	static FNC_PRINT_ALWAYS = 27;
	static FNC_PRINT_UPDATE = 28;
	static FNC_ORDERMAIL_SEND = 29;

	constructor(O_db = undefined) {
		super(O_db);
	}

	getAllShopAuth(type = "US") //$this->debugOut( $sql );
	{
		var sql = "select fncid, fncname, ininame from shop_function_tb " + "where type='" + type + "' and enable=true " + "order by show_order";
		return this.get_DB().queryHash(sql);
	}

	getShopFunc(shopid, hhmm = undefined, extend_flg = false) {
		if (is_numeric(shopid) == false) {
			this.getOut().errorOut(0, "ShopFuncModel::getShopFunc() shopid\u304C\u4E0D\u6B63", false);
		}

		var sql = "select " + "fnc.ininame," + "frl.fncid " + "from " + "shop_fnc_relation_tb frl inner join shop_function_tb fnc on frl.fncid = fnc.fncid " + "where " + "frl.shopid = " + shopid + " " + "and frl.memid = 0 " + "and fnc.type = 'CO' " + "and fnc.enable = true ";

		if (hhmm !== undefined) {
			sql += "and " + this.makeExtendSql(hhmm, extend_flg);
		}

		sql += "order by " + "frl.fncid";
		var H_return = this.getDB().queryAssoc(sql);
		return H_return;
	}

	makeExtendSql(hhmm, extend_flg = false) {
		if (is_numeric(hhmm) == false) {
			this.getOut().errorOut(0, "ShopFuncModel::makeExtendSql() \u5F15\u6570\u306E\u6642\u9593(hhmm)\u304C\u4E0D\u6B63", false);
		}

		if (extend_flg == true) {
			var sql_str = "(extend = true or (" + "cast(fnc.starttime as integer) <= " + +(hhmm + " " + "and cast(fnc.endtime as integer) > " + +(hhmm + ")" + ") "));
		} else {
			sql_str = "cast(fnc.starttime as integer) <= " + +(hhmm + " " + "and cast(fnc.endtime as integer) > " + +(hhmm + " "));
		}

		return sql_str;
	}

	getUserFunc(memid, shopid, hhmm = undefined, extend_flg = false) //入力チェック
	//時間指定があればSQL(where句)追加
	{
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(0, "ShopFuncModel::getUserFunc() memid\u304C\u4E0D\u6B63", false);
		}

		if (is_numeric(shopid) == false) {
			this.getOut().errorOut(0, "ShopFuncModel::getUserFunc() shopid\u304C\u4E0D\u6B63", false);
		}

		var sql = "select " + "fnc.ininame," + "frl.fncid " + "from " + "shop_fnc_relation_tb frl inner join shop_function_tb fnc on frl.fncid = fnc.fncid " + "where " + "frl.memid = " + memid + " " + "and frl.shopid = " + shopid + " " + "and fnc.type != 'CO' " + "and fnc.enable = true " + "and fnc.type != (case when 'SU' = (select " + "type " + "from " + "shop_member_tb " + "where " + "shopid = " + shopid + " " + "and memid = " + memid + ") then 'CO' else 'SU' end" + ") ";

		if (is_numeric(hhmm) == true) {
			sql += "and " + this.makeExtendSql(hhmm, extend_flg);
		}

		sql += "order by " + "frl.fncid";
		var H_return = this.getDB().queryAssoc(sql);
		return H_return;
	}

	getFuncidFromPath(path) //入力チェック
	//上から順番にマッチするパスを切り出す
	//$this->getOut()->debugOut( $sql );
	{
		if (path == "") {
			this.getOut().errorOut(0, "ShopFuncModel::getFuncidFromPath() path\u304C\u306A\u3044", false);
		}

		var pathwhere = "(";
		var A_path = split("/", path);
		var or = " ";

		for (var eachpath of Object.values(A_path)) {
			if (eachpath == "") {
				continue;
			}

			matchpath += "/" + eachpath;
			pathwhere += or + "path = '" + matchpath + "' ";
			or = "or ";
		}

		pathwhere += ") ";
		var sql = "select " + "fncid " + "from " + "shop_function_tb " + "where " + pathwhere + "and type != 'CO' " + "and enable = true";
		return this.getDB().queryCol(sql);
	}

	getUserFuncList(shopid, memid) //ショップに属しているメンバーと権限を一覧
	//k-60で追加した権限はSUの時だけ表示
	//$this->getOut()->debugOut( $sql );
	//ininame単位でユニークにする。memid には、権限の有無が入る
	//ininameでユニークな配列を作る
	//権限ありのininame
	//var_dump( $H_uniqiname );
	//var_dump( $H_ismemid );
	//ininameでユニークな配列と、memidに一致する配列から、結果を生成する
	//var_dump( $H_return );
	{
		var sql = "SELECT type FROM shop_member_tb WHERE memid=" + this.getDB().dbQuote(memid, "int", true);
		var type = this.getDB().queryOne(sql);
		sql = "select sfn.ininame, sfn.fncname, sfn.type, sfn.memo, sfr.memid " + "from shop_function_tb sfn " + "left outer join shop_fnc_relation_tb sfr on sfn.fncid=sfr.fncid " + "where (sfr.shopid=" + shopid + " or sfr.shopid is null) " + "and sfn.type != 'CO' " + "and sfn.enable=true ";

		if ("SU" != type) {
			sql += "AND sfn.fncid NOT IN (" + ShopFuncModel.FNC_PRINT_ALWAYS + ", " + ShopFuncModel.FNC_PRINT_UPDATE + ", " + ShopFuncModel.FNC_ORDERMAIL_SEND + ") ";
		}

		sql += "order by sfn.fncid";
		var H_result = this.getDB().queryHash(sql);
		var H_uniqiname = Array();
		var H_ismemid = Array();

		for (var A_row of Object.values(H_result)) //ininameをキーにまとめる
		{
			var ininame = A_row.ininame;
			H_uniqiname[ininame] = A_row;

			if (A_row.memid == memid) //memid が一致するものを集める
				{
					H_ismemid[ininame] = true;
				}
		}

		var H_return = Array();

		for (var ininame in H_uniqiname) {
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

	__destruct() {
		super.__destruct();
	}

};