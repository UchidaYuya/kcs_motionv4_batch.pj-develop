//
//見積用Model
//
//@package Price
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/12/03
//@uses OrderFormModel
//
//
//
//見積用Model
//
//@uses OrderFormModel
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("model/Order/OrderFormModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//テンプレート取得
//
//@author miyazawa
//@since 2008/05/21
//
//@param mixed $H_sess
//@access public
//@return string
//
//
//価格表からの注文の詳細を取得
//
//@author miyazawa
//@since 2008/08/05
//
//@param integer $H_sess
//@access public
//@return array
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class EstimateModel extends OrderFormModel {
	constructor(O_db0, H_g_sess, site_flg = EstimateModel.SITE_USER) {
		super(O_db0, H_g_sess, site_flg);
	}

	getSmartyTemplate() {
		return "estimate.tpl";
	}

	getPriceDetail(H_sess) {
		if (true == H_sess[EstimateModel.PUB].eng) {
			var buyselname_str = "buyselname_eng AS buyselname";
		} else {
			buyselname_str = "buyselname";
		}

		var sql = "SELECT pr.productname, de.productid, de.pricelistid, de.buytype1, de.buytype2, de.paycnt, de.downmoney, de.onepay, de.totalprice, de.buyselid, bs." + buyselname_str + ", pr.type ";
		sql += "FROM price_detail_tb de INNER JOIN product_tb pr ON de.productid = pr.productid ";
		sql += "LEFT JOIN buyselect_tb bs ON de.buyselid = bs.buyselid ";
		sql += "WHERE de.price_detailid = " + H_sess[EstimateModel.PUB].price_detailid;
		return this.get_DB().queryRowHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};