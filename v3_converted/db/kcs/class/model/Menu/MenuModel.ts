//
//メニューModel
//
//@uses ModelBase
//@package Menu
//@filesource
//@author katsushi
//@since 2008/06/17
//
//
//
//メニューModel
//
//@uses ModelBase
//@package Menu
//@author katsushi
//@since 2008/06/17
//

require("model/ModelBase.php");

//
//__construct
//
//@author katsushi
//@since 2008/06/17
//
//@param mixed $O_db
//@access public
//@return void
//
//
//getMenu
//
//@author katsushi
//@since 2008/06/17
//
//@param array $A_funcid
//@access public
//@return void
//
//
//注文可能なキャリアを取得する
//
//@author katsushi
//@since 2008/08/18
//
//@param mixed $pactid
//@param mixed $postid
//@access public
//@return void
//
//
//オーダーパターン取得
//
//@author katsushi
//@since 2008/08/18
//
//@param array $A_car
//@param integer $pactid
//@param text $pattern
//@access public
//@return void
//
//
//オーダー用ヘルプファイル取得
//
//@author katsushi
//@since 2008/08/18
//
//@param array $A_car
//@access public
//@return void
//
//
//設定ファイルのオーダーパターン取得
//
//@author houshiyama
//@since 2011/09/08
//
//@param mixed $pactid
//@param text $pattern
//@access private
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/06/17
//
//@access public
//@return void
//
class MenuModel extends ModelBase {
	constructor() {
		super();
	}

	getMenu(A_funcid: {} | any[]) {
		var sql = "select " + "fncid," + "fncname," + "fncname_eng," + "memo," + "memo_eng," + "css," + "path," + "parent " + "from " + "function_tb " + "where " + "type in ('US','SU') " + "and enable = true " + "and show = true " + "and (path is not null and path != '') " + "and fncid in (" + A_funcid.join(",") + ") " + "order by " + "show_order";
		return this.getDB().queryKeyAssoc(sql);
	}

	getOrderableCarrier(pactid, postid) {
		var select_sql = "SELECT " + "c.carid " + "FROM " + "shop_relation_tb s inner join carrier_tb c on s.carid=c.carid " + "WHERE " + "s.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " " + "AND s.postid = " + this.getDB().dbQuote(postid, "integer", true) + " " + "ORDER BY " + "c.sort," + "c.carid";
		return this.getDB().queryCol(select_sql);
	}

	getOrderPattern(A_car: {} | any[], pactid, pattern) //------------------------------------------------------------------------------
	//対象の回線種別の注文を表示させるための処理
	//show=falseでも表示させる
	//------------------------------------------------------------------------------
	//D82　伊達
	//OR (( cirid = 1 AND type in ('N') ) OR ( cirid = 2 AND type in ('N')))のSQLを作成するよ
	//空でなければ、ORでつなぐ( 想定では、show = trueの後ろに付く )
	//未設定項目は省く
	{
		if (is_null(A_car) || A_car.length == 0) //エラー回避の工夫
			{
				return Array();
			}

		switch (pattern) {
			case undefined:
				pattern = "";
				break;

			default:
				pattern = "_" + pattern;
				break;
		}

		var H_conf = this.getOrderSetting(pactid, pattern);
		var db = this.get_DB();
		var sql_force_cirid = "";
		var demi = "";

		for (var key in H_conf) //cirid数字=注文種別のものを対象として、他を除外する
		//他の条件とつないでいく
		{
			var types = H_conf[key];
			var res = preg_match("/^(cirid)(\\d+)$/", key);

			if (res == 0) {
				continue;
			}

			var cirid = +str_replace("cirid", "", key);
			var demi_type = "";
			var temp = "";

			for (var type of Object.values(types)) {
				temp += demi_type + db.dbQuote(type, "text", true);
				demi_type = ",";
			}

			sql_force_cirid += demi + "( cirid =" + cirid + "  AND type IN (" + temp + "))";
			demi = " OR ";
		}

		if (sql_force_cirid != "") {
			sql_force_cirid = " OR (" + sql_force_cirid + ") ";
		}

		var sql = "select " + "carid," + "cirid," + "ptnname," + "ptnname_eng," + "type," + "ppid," + "menucomment," + "menucomment_eng " + "from " + "mt_order_pattern_tb " + "where " + "carid in (" + A_car.join(",") + ") " + "and (" + " show = true " + sql_force_cirid + ") " + "order by " + "carid," + "ptn_order";
		var H_db = this.getDB().queryHash(sql);
		var H_pattern = Array();

		for (var num in H_db) {
			var H_val = H_db[num];

			if (!(undefined !== H_conf[H_val.carid]) || !Array.isArray(H_conf[H_val.carid])) {
				continue;
			}

			if (-1 !== H_conf[H_val.carid].indexOf(H_val.type)) {
				H_pattern.push(H_val);
			}
		}

		return H_pattern;
	}

	getOrderHelpFile(O_Sess) //会社ごとのヘルプファイルを取得せよと設定されていたら、pactidごとのディレクトリ以下のファイルを取得する
	{
		var sql = "select " + "helpfile " + "from " + "function_tb " + "where " + "path = '/MTOrder' order by fncid";
		var filename = this.getDB().queryOne(sql);

		if (!filename) {
			return false;
		}

		if (undefined !== _SESSION.pacttype == true && _SESSION.pacttype == "H") {
			var helpfile = "Hotline/" + filename;
		} else {
			helpfile = filename;
		}

		if (undefined !== _SESSION.helpfile == true && _SESSION.helpfile == "on" && _SESSION.pactid != "") //存在確認
			{
				if (undefined !== _SESSION.pacttype == true && _SESSION.pacttype == "H") {
					if (file_exists(KCS_DIR + "/htdocs/Help/Hotline/" + _SESSION.pactid + "/" + filename) == true) {
						helpfile = "Hotline/" + _SESSION.pactid + "/" + filename;
					}
				} else {
					if (file_exists(KCS_DIR + "/htdocs/Help/" + _SESSION.pactid + "/" + filename) == true) {
						helpfile = _SESSION.pactid + "/" + filename;
					}
				}
			}

		if (O_Sess.groupid > 1 && false == is_null(O_Sess.groupname)) {
			helpfile = "/" + O_Sess.groupname + "/Help/" + helpfile;
		} else {
			helpfile = "/Help/" + helpfile;
		}

		return helpfile;
	}

	getOrderSetting(pactid, pattern) {
		var key = "orderpattern" + pattern + "_pact" + pactid;

		if (this.getSetting().existsKey(key)) {
			var H_tmp = this.getSetting()[key];
		} else {
			key = "orderpattern_pact0";
			H_tmp = this.getSetting()[key];
		}

		var H_conf = Array();

		for (var carid in H_tmp) {
			var patterns = H_tmp[carid];
			H_conf[carid.replace(/carid/g, "")] = split(",", patterns);
		}

		return H_conf;
	}

	__destruct() {
		super.__destruct();
	}

};