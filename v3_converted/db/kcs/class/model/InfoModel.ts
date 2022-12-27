//
//お知らせ関連を取得するModel
//
//20081217 ishizaki getAllInfoList グループ化
//
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/08/17
//@uses ModelBase
//
//
//
//お知らせ関連を取得するModel
//
//@package Base
//@subpackage Model
//@author katsushi
//@since 2008/08/17
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author katsushi
//@since 2008/08/17
//
//@param mixed $O_db
//@access public
//@return void
//
//
//getAllInfoList
//
//@author katsushi
//@since 2008/08/18
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $userid
//@param mixed $su
//@param mixed $limit
//@access public
//@return void
//
//
//ショップメニューに表示する 販売店間のお知らせ取得<BR>
//
//@author miyazawa
//@since 2008/12/18
//
//@param mixed $shopid
//@param mixed $memid
//@param mixed $su
//@param mixed $limit
//@access public
//@return void
//
//
//デストラクト
//
//@author katsushi
//@since 2008/08/17
//
//@access public
//@return void
//
class InfoModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getAllInfoList(pactid, postid, userid, su = false, limit = undefined) //キャリアごとの販売店をしぼり込む
	//グループID追加 ishizaki 20081217
	//管理者のお知らせをココで登録
	//array_push($A_where, " (info_tb.carid = -1 and info_tb.shopid=0) ");
	//グループID追加 ishizaki 20081217
	//登録画面にY-m-d 0時までってかいてあるので合わせる 20100902iga
	//$enddate = date("Y-m-d 23:59:59");
	{
		var pre_sql = "select carid,shopid from shop_relation_tb where postid=" + postid + " and pactid=" + pactid;
		var H_srel = this.getDB().queryAssoc(pre_sql);
		var pag_sql = "SELECT groupid FROM pact_tb WHERE pactid = " + pactid;
		var groupid = this.getDB().queryOne(pag_sql);
		var A_where = Array();

		for (var carid in H_srel) {
			var shopid = H_srel[carid];
			A_where.push(" (srel.postid = " + postid + " and info_tb.carid in (-1," + carid + ") and info_tb.shopid=" + shopid + ") ");
		}

		A_where.push(" (info_tb.carid = -1 and (info_tb.shopid=0 OR shop_tb.groupid = " + groupid + " )) ");

		if (A_where.length > 0) {
			var where = "and (" + A_where.join("or") + ") ";
		}

		var firstdate = date("Y-m-d 00:00:00");
		var enddate = date("Y-m-d H:i:s", mktime(0, 0, 0, date("m"), date("d"), date("Y")));
		var sql = "select " + "'s' as flg," + "info_tb.infoid," + "info_tb.title," + "info_tb.firstdate," + "info_tb.recdate," + "info_tb.status " + "from " + "info_tb " + "inner join " + "info_relation_tb on info_tb.infoid = info_relation_tb.infoid " + "inner join " + "shop_tb on info_tb.shopid = shop_tb.shopid " + "left join " + "shop_relation_tb srel on info_tb.shopid = srel.shopid " + "where " + "(" + "info_relation_tb.pactid = " + pactid + " " + "and (info_relation_tb.postid = " + postid + " or info_relation_tb.postid = 0) " + "and info_tb.firstdate <= '" + firstdate + "' and info_tb.enddate >= '" + enddate + "'" + "and info_tb.status != '2' " + where + ") " + "group by " + "info_tb.infoid," + "info_tb.title," + "info_tb.firstdate," + "info_tb.recdate," + "info_tb.status " + "union select " + "'u' as flg," + "user_info_tb.infoid," + "user_info_tb.title," + "user_info_tb.firstdate," + "user_info_tb.recdate," + "user_info_tb.status " + "from " + "user_info_tb inner join user_info_rel_tb on user_info_tb.infoid = user_info_rel_tb.infoid " + "where " + "user_info_rel_tb.pactid = " + pactid + " ";

		if (su != true) {
			sql += "and (user_info_tb.userid = " + userid + " or (user_info_rel_tb.postid = " + postid + " or user_info_rel_tb.postid = 0)) ";
		}

		sql += "and user_info_tb.firstdate <= '" + firstdate + "' and user_info_tb.enddate >= '" + enddate + "' " + "group by " + "user_info_tb.infoid," + "user_info_tb.title," + "user_info_tb.firstdate," + "user_info_tb.recdate," + "user_info_tb.status " + "order by " + "recdate desc," + "firstdate desc";

		if (limit !== undefined && is_numeric(limit) == true && limit > 0) {
			sql += " limit " + limit;
		}

		return this.getDB().queryHash(sql);
	}

	getAllShopInfoList(shopid, memid, su = false, limit = undefined) //登録画面にY-m-d 0時までってかいてあるので合わせる 20100902iga
	//$enddate = date("Y-m-d 23:59:59");
	//既読チェック
	{
		var A_res = Array();
		var firstdate = date("Y-m-d 00:00:00");
		var enddate = date("Y-m-d H:i:s", mktime(0, 0, 0, date("m"), date("d") + 1, date("Y")));
		var sql = "SELECT " + "inf.infoid, inf.title, to_char(inf.recdate, 'yyyy/mm/dd hh24:mi') AS recdate, inf.status, rel.readmem " + "FROM info_shop_tb inf INNER JOIN info_relation_shop_tb rel ON inf.infoid=rel.infoid AND rel.memid=0 WHERE " + "rel.shopid = " + shopid + " AND inf.status != '2' " + "AND inf.firstdate <= '" + firstdate + "' AND inf.enddate >= '" + enddate + "' " + "ORDER BY inf.firstdate DESC, inf.recdate DESC";

		if (limit != undefined) {
			sql += " LIMIT " + limit;
		}

		A_res = this.getDB().queryHash(sql);

		if (true == Array.isArray(A_res) && true == 0 < A_res.length) {
			for (var key in A_res) {
				var val = A_res[key];
				var A_readmem = unserialize(val.readmem);

				if (true == Array.isArray(A_readmem) && true == (-1 !== A_readmem.indexOf(memid))) {
					A_res[key].readflg = true;
				} else {
					A_res[key].readflg = false;
				}
			}
		}

		return A_res;
	}

	__destruct() {
		super.__destruct();
	}

};