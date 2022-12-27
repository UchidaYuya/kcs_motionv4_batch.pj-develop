//
//キャリア（carrier_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/04/14
//@uses ModelBase
//
//
//
//キャリア（carrier_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/04/14
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/04/14
//
//@param mixed $O_db
//@access public
//@return void
//
//
//caridをキーにcarnameを値にして返す
//
//@author houshiyama
//@since 2008/04/14
//
//@access public
//@return void
//
//
//getCarrierFromProductTbKeyHash
//
//@author ishizaki
//@since 2008/08/11
//
//@access public
//@return void
//
//
//getCarrierFromProductBranchTbKeyHash
//
//@author ishizaki
//@since 2008/08/11
//
//@access public
//@return void
//
//
//caridをキーにcarnameを値にして返す（使用中のもののみ）
//
//@author houshiyama
//@since 2008/04/14
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $pactid
//@param mixed $A_post（部署一覧）
//@param mixed $tb（tel_tb系のテーブル名）
//@param mixed $carid（検索値）
//@access public
//@return void
//
//
//caridをキーにcarname_engを値にして返す（使用中のもののみ）
//
//@author houshiyama
//@since 2008/12/09
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $pactid
//@param mixed $A_post（部署一覧）
//@param mixed $tb（tel_tb系のテーブル名）
//@param mixed $carid（検索値）
//@access public
//@return void
//
//
//caridをキーにcarnameを値にして返す（使用中のもののみ）
//
//@author houshiyama
//@since 2008/04/14
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $pactid
//@param mixed $A_post（部署一覧）
//@param mixed $tb（tel_tb系のテーブル名）
//@param mixed $carid（検索値）
//@access public
//@return void
//
//
//getOrderCarrierKeyHash
//
//@author katsushi
//@since 2008/07/17
//
//@access public
//@return void
//
//
//caridをキーにcarnameを値にして返す（pact依存のみ、電話新規登録・変更等で使用）
//
//@author houshiyama
//@since 2008/07/30
//
//@param mixed $pactid
//@param mixed $A_post（部署一覧）
//@param mixed $tb（tel_tb系のテーブル名）
//@param mixed $carid（検索値）
//@access public
//@return void
//
//
//caridをキーにcarname_engを値にして返す（pact依存のみ、電話新規登録・変更等で使用）
//
//@author houshiyama
//@since 2008/12/09
//
//@param mixed $pactid
//@param mixed $A_post（部署一覧）
//@param mixed $tb（tel_tb系のテーブル名）
//@param mixed $carid（検索値）
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/14
//
//@access public
//@return void
//
class CarrierModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getCarrierKeyHash() {
		var sql = "select carid,carname from carrier_tb where defaultflg = true order by sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getCarrierFromProductTbKeyHash() {
		var sql = "SELECT product_tb.carid,carrier_tb.carname FROM product_tb INNER JOIN carrier_tb ON product_tb.carid = carrier_tb.carid WHERE carrier_tb.defaultflg = true GROUP BY product_tb.carid, carrier_tb.carname, carrier_tb.sort ORDER BY carrier_tb.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getCarrierFromProductBranchTbKeyHash() {
		var sql = "SELECT product_tb.carid,carrier_tb.carname FROM product_tb INNER JOIN carrier_tb ON product_tb.carid = carrier_tb.carid INNER JOIN product_branch_tb on product_tb.productid=product_branch_tb.productid WHERE carrier_tb.defaultflg = true GROUP BY product_tb.carid, carrier_tb.carname, carrier_tb.sort ORDER BY carrier_tb.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getUseCarrierKeyHash(pactid, A_post, tb, carid = undefined) {
		var sql = "select te.carid,car.carname " + " from " + tb + " as te " + " left join carrier_tb as car on te.carid=car.carid " + " where " + " (te.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and " + " te.postid in (" + A_post.join(",") + "))";

		if (carid != undefined) {
			sql += " or car.carid=" + carid;
		}

		sql += " group by te.carid,car.carname,car.sort" + " order by car.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getUseCarrierEngKeyHash(pactid, A_post, tb, carid = undefined) {
		var sql = "select te.carid,car.carname_eng " + " from " + tb + " as te " + " left join carrier_tb as car on te.carid=car.carid " + " where " + " (te.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and " + " te.postid in (" + A_post.join(",") + "))";

		if (carid != undefined) {
			sql += " or car.carid=" + carid;
		}

		sql += " group by te.carid,car.carname_eng,car.sort" + " order by car.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getUseCarrierFromAssetsTbKeyHash(pactid, A_post, tb, carid = undefined) {
		var sql = "select ass.search_carid,car.carname " + " from " + tb + " as ass " + " left join carrier_tb as car on ass.search_carid=car.carid " + " where " + " (ass.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and " + " ass.postid in (" + A_post.join(",") + "))" + " and " + " ass.delete_flg=false";

		if (carid != undefined) {
			sql += " or car.carid=" + carid;
		}

		sql += " group by ass.search_carid,car.carname,car.sort" + " order by car.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getOrderCarrierKeyHash() {
		var sql = "select carrier_tb.carid,carrier_tb.carname from carrier_tb inner join mt_order_pattern_tb on carrier_tb.carid = mt_order_pattern_tb.carid where carrier_tb.defaultflg = true group by carrier_tb.carid, carrier_tb.carname order by carrier_tb.carid";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getPactCarrierKeyHash(pactid) {
		var sql = "select ca.carid,ca.carname from carrier_tb as ca " + " left outer join (select pactid,carid,relation_flg from pact_rel_carrier_tb where pactid=" + pactid + ") as pr on ca.carid = pr.carid " + " where " + " (pr.relation_flg = true)  or " + " (ca.defaultflg = true and pr.pactid is null) " + " order by ca.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	getPactCarrierEngKeyHash(pactid) {
		var sql = "select ca.carid,ca.carname_eng from carrier_tb as ca " + " left outer join (select pactid,carid,relation_flg from pact_rel_carrier_tb where pactid=" + pactid + ") as pr on ca.carid = pr.carid " + " where " + " (pr.relation_flg = true)  or " + " (ca.defaultflg = true and pr.pactid is null) " + " order by ca.sort";
		var H_data = this.get_DB().queryAssoc(sql);
		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};