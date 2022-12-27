//
//Pactに関するモデル
//
//@uses ModelBase
//@filesource
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/04/01
//
//
//
//Pactに関するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/04/01
//

require("MtSetting.php");

require("MtDBUtil.php");

require("MtOutput.php");

require("ModelBase.php");

//
//コンストラクタ
//
//@author katsushi
//@since 2008/04/01
//
//@param object $O_DB
//@access public
//@return void
//
//
//ユーザーIDからpactidを調べる
//
//@author katsushi
//@since 2008/04/01
//
//@param integer $userid
//@access public
//@return pactid
//
//
//pact_tb より登録されている契約ＩＤ、会社名を取得
//
//@author maeda
//@since 2008/04/08
//
//@access public
//@return 契約ＩＤをキー、会社名を値とした連想配列
//
//
//pact_tb よりショップに関連付いた顧客情報を取得する
//
//@author nakanita
//@since 2008/05/28
//
//@param integer $shopid
//@access public
//@return 契約ＩＤをキー、顧客情報を値とした連想配列
//
//
//pact_tb よりショップメンバーが成り代わることができる顧客情報を取得する
//
//@author nakanita
//@since 2008/10/30
//
//@param integer $memid
//@access public
//@return void
//
//
//販売店に割り当てられた企業の一覧をハッシュで取得
//
//@author ishizaki
//@since 2008/08/05
//
//@param mixed $shopid
//@access public
//@return void
//
//
//PactIDから会社名を返す
//
//@author ishizaki
//@since 2008/08/07
//
//@param mixed $pactid
//@access public
//@return void
//
//
//PactIDから会社タイプを返す
//
//@author miyazawa
//@since 2009/10/16
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getGroupId
//
//@author katsushi
//@since 2008/09/02
//
//@param integer $pactid
//@param boolean $array
//@access public
//@return integer or array
//
//
//getAllPactId
//
//@author katsushi
//@since 2008/09/02
//
//@access public
//@return void
//
//
//pactcodeを持つ会社の情報取得
//
//@author houshiyama
//@since 2010/08/06
//
//@access public
//@return void
//
//
//pactidからpactcode取得
//
//@author houshiyama
//@since 2010/08/06
//
//@param mixed $pactid
//@access public
//@return void
//
//
//ev_agentid, ev_pactcode から pactidを取得
//
//@author
//@since 2010/08/06
//
//@param mixed $agentid
//@param mixed $ev_pactcode
//@access public
//@return void
//
//
//pactcode、agentidからpactid取得
//
//@author houshiyama
//@since 2010/08/10
//
//@param mixed $ev_agentid
//@param mixed $ev_pactcode
//@access public
//@return void
//
//
//getUseridIniFromPactid
//
//@author ishizaki
//@since 2011/10/21
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getPactSerach
//会社一覧を取得
//@author web
//@since 2018/09/25
//
//@param int $groupid 		グループID
//@param int $offset 		オフセット
//@param int $limit 		件数
//@param array $select 	検索条件
//@param array $search 	検索条件
//@param array $order	 	検索条件
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author nakanita
//@since 2008/05/28
//
//@access public
//@return void
//
class PactModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPactIdFromUser(userid) {
		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "PactModel::getPactIdFromUser() userid\u304C\u4E0D\u6B63", false);
		}

		var sql = "select " + "pactid " + "from " + "user_tb " + "where " + "userid = " + userid;
		return this.getDB().queryOne(sql);
	}

	getPactIdCompNameFromPact() {
		var sql = "select pactid,compname " + "from pact_tb " + "where delflg=false " + "order by pactid";
		return this.getDB().queryKeyAssoc(sql);
	}

	getPactListFromShop(shopid) {
		if (is_numeric(shopid) == false) {
			this.getOut().errorOut(0, "PactModel::getPactListFromShop() shopid\u304C\u4E0D\u6B63", false);
		}

		var sql = "select pact.pactid, pact.userid_ini, pact.compname " + "from pact_tb pact " + "inner join pact_rel_shop_tb shrel on pact.pactid=shrel.pactid " + "where shrel.shopid=" + shopid + " " + "and pact.delflg=false " + "order by pact.pactid";
		return this.getDB().queryKeyAssoc(sql);
	}

	getPactListFromShopMember(memid) {
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(0, "PactModel::getPactListFromShop() shopid\u304C\u4E0D\u6B63", false);
		}

		var sql = "select pact.pactid, pact.userid_ini, pact.compname, pact.groupid " + "from pact_tb pact " + "inner join joker_member_rel_pact_tb jkmem on pact.pactid=jkmem.pactid " + "where jkmem.memid=" + memid + " " + "and pact.delflg=false " + "order by pact.pactid";
		return this.getDB().queryKeyAssoc(sql);
	}

	getPactHash(type, shopid, where_car = "") {
		if ("" != where_car) {
			where_car = " AND srel.carid = " + this.getDB().dbQuote(where_car, "integer", true) + " ";
		}

		var pact_sql = "select " + "pa.pactid," + "pa.compname " + "from " + "shop_relation_tb srel inner join pact_tb pa on srel.pactid = pa.pactid " + "where " + "srel.shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " " + "AND pa.delflg = false " + where_car + "group by pa.pactid,pa.compname " + "order by pa.pactid";

		if (type == "assoc") {
			return this.getDB().queryAssoc(pact_sql);
		} else if (type == "col") {
			return this.getDB().queryCol(pact_sql);
		} else {
			return this.getDB().aueryHash(pact_sql);
		}
	}

	getCompname(pactid) {
		var select_sql = "SELECT compname FROM pact_tb WHERE pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getPactType(pactid) {
		var select_sql = "SELECT type FROM pact_tb WHERE pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		return this.getDB().queryOne(select_sql);
	}

	getGroupId(pactid, array = false) {
		var sql = "select " + "sh.groupid " + "from " + "shop_tb sh inner join pact_rel_shop_tb prs on sh.shopid = prs.shopid " + "where " + "prs.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " " + "group by " + "sh.groupid " + "order by " + "sh.groupid";

		if (array === true) {
			var A_ret = this.getDB().queryCol(sql);

			if (Array.isArray(A_ret) == true) {
				return A_ret;
			}

			return [A_ret];
		}

		return this.getDB().queryOne(sql);
	}

	getAllPactId() {
		var sql = "select pactid from pact_tb order by pactid";
		return this.getDB().queryCol(sql);
	}

	getAllEvPact() {
		var sql = "select * from pact_tb where coalesce(ev_pactcode,'') != '' and ev_agentid is not null;";
		return this.getDB().queryHash(sql);
	}

	getPactCodeFromPactId(pactid) {
		var sql = "select ev_pactcode from pact_tb where pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getPactidRootPostIdFromAgentIdPactcode(ev_agentid, ev_pactcode) {
		var sql = "SELECT " + "pact.pactid, rootpost.postid  " + "FROM " + "pact_tb AS pact " + "INNER JOIN  " + "(SELECT pactid, postidparent AS postid FROM post_relation_tb where level = 0 AND postidparent = postidchild) AS rootpost ON pact.pactid = rootpost.pactid " + "WHERE " + "pact.ev_agentid = " + this.getDB().dbQuote(ev_agentid, "integer", true) + " AND " + "pact.ev_pactcode = " + this.getDB().dbQuote(ev_pactcode, "text", true);
		return this.getDB().queryRowHash(sql);
	}

	getPactIdFromAgentIdPactcode(ev_agentid, ev_pactcode) {
		var sql = "select pactid from pact_tb " + " where " + "ev_agentid = " + this.getDB().dbQuote(ev_agentid, "integer", true) + " and " + "ev_pactcode = " + this.getDB().dbQuote(ev_pactcode, "text", true);
		return this.getDB().queryOne(sql);
	}

	getUseridIniFromPactid(pactid) {
		var sql = "SELECT userid_ini FROM pact_tb WHERE pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getPactSerach(offset, limit, select: {} | any[] = Array(), search: {} | any[] = Array(), option: {} | any[] = Array()) //$select=array()の値
	//			pact_tb						pact.カラム
	//			bill_restriction_tb			bill_rest.カラム
	//検索条件(searchに以下のkeyで値を入れておくと検索される)
	//			$search["groupid"]		=	グループID
	//			$search["type"]			=	HかM
	//			$search["compname"]		=	顧客名
	//			$search["pactid"]		=	pactid
	//			$search["userid_ini"]	=	会社コード
	//			$search["fncid"]		=	array( 権限ID,権限ID )
	//$optionの値・・・必要なら設定すること。必要なければ設定しなくていい
	//			//	現状optionは何もない(昔は使ってたけど消した)
	//------------------------------------------------------------------------------------
	//pactidの0はみない
	//------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------
	//グループID
	//------------------------------------------------------------------------------------
	//search["pactid"] を調べたい時は pact.pactidを参照して調べるという指定
	//------------------------------------------------------------------------------------
	//指定された権限を持つ会社を検索する
	//20190423に追加。権限で絞りたかった
	//------------------------------------------------------------------------------------
	//$search["fncid"] = array(権限ID,権限ID,権限ID・・・);
	//------------------------------------------------------------------------------------
	//select
	//------------------------------------------------------------------------------------
	////	使われなくなり申した
	//		if( isset( $option[""] ) ){
	//			$sql_join = " LEFT JOIN";
	//		}
	//------------------------------------------------------------------------------------
	//SQL
	//------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------
	//オフセットとリミット
	//------------------------------------------------------------------------------------
	{
		var db = this.get_DB();
		var sql_serach = Array();
		sql_search.push("(pact.pactid != 0)");

		if (undefined !== search.groupid) {
			sql_search.push("(pact.groupid = " + db.dbQuote(search.groupid, "integer", true) + ")");
		}

		if (!!search.type) {
			sql_search.push("pact.type = " + db.dbQuote(search.type, "string", true));
		}

		var s = {
			pactid: "pact.pactid"
		};

		for (var name in s) {
			var column = s[name];

			if (!!search[name]) {
				sql_search.push("(" + column + " = " + db.dbQuote(search[name], "integer", true) + ")");
			}
		}

		if (undefined !== search.fncid) {
			var temp = "";
			var con = "";
			{
				let _tmp_0 = search.fncid;

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					temp += con;
					temp += this.get_DB().dbQuote(value, "integer", true);
					con = ",";
				}
			}
			sql_search.push("pact.pactid IN (SELECT pactid FROM fnc_relation_tb WHERE fncid IN (" + temp + ") GROUP BY pactid)");
		}

		s = {
			compname: "pact.compname",
			userid_ini: "pact.userid_ini"
		};

		for (var name in s) {
			var column = s[name];

			if (!!search[name]) {
				sql_search.push("(" + column + " like " + db.dbQuote("%" + search[name] + "%", "string", true) + ")");
			}
		}

		var sql_select = "";

		if (!!select) {
			sql_select = "," + select.join(",");
		}

		var sql_join = "";
		var sql = "SELECT" + " pact.groupid" + ",pact.userid_ini" + ",pact.pactid" + ",pact.compname" + ",pact.type" + sql_select + ",count(*) over() as pcnt" + " FROM" + " pact_tb pact" + sql_join + " WHERE" + " " + sql_search.join(" AND ") + " ORDER BY" + " pact.pactid";
		db.setLimit(limit, (offset - 1) * limit);
		return db.queryHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};