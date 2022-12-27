//
//受注更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/07/18
//@uses ShopOrderDetail
//
//
//
//注文更新用Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/07/18
//

require("OrderUtil.php");

require("ShopOrderModelBase.php");

//
//価格表から現在の価格を取得する
//
//@author igarashi
//@since 2008/07/18
//
//@access public
//@return hash
//
//
//キャリアのポイント使用単位とレートを取得する
//
//@author igarashi
//@since 2008/07/18
//
//@access public
//@return hash
//
// 1オーダーのうち、端末の件数を取得する
//
// @author igarashi
// @since 2008/07/18
//
// @param $orderid
//
// @access public
// @return integer
//
//デストラクタ
//
//@author igarashi
//@since 2008/07/18
//
//@access public
//@return none
//
class ShopOrderRegisterModel extends ShopOrderModelBase {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess, ShopOrderRegisterModel.SITE_SHOP);
	}

	getOrderListPriceNow() //return $this->get_DB()->queryHash($sql);
	{
		var sql = "SELECT " + "" + "FROM " + "" + "WHERE " + "";
		return undefined;
	}

	getCarrierPointInfo(carid) {
		var sql = "SELECT unit, rate FROM carrier_tb WHERE carid=" + carid;
		var A_result = this.get_DB().queryRowHash(sql);

		if (undefined == A_result.unit) {
			A_result.unit = 0;
		}

		if (undefined == A_result.rate) {
			A_result.rate = 0;
		}

		return A_result;
	}

	getOrderMachineNumber(orderid) {
		var sql = "SELECT telcnt" + " FROM " + ShopOrderRegisterModel.ORD_TB + " WHERE orderid=" + orderid;
		return this.get_DB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};