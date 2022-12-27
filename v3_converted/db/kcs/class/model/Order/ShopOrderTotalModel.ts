//
//注文更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/04/01
//@uses OrderModel
//@uses OrderUtil
//
//
//require_once("model/Management/Tel/ManagementTelModel.php");
//require_once("model/Shop/Product/ShopProductModel.php");
//require_once("model/Price/UserPriceModel.php");
//
//注文更新用Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/04/01
//

require("MtDateUtil.php");

require("MtMailUtil.php");

require("ManagementUtil.php");

require("OrderUtil.php");

require("ShopOrderModelBase.php");

require("model//Price/UserPriceModel.php");

require("model/Shop/Product/ShopProductModel.php");

require("model/Management/ManagementModelBase.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/07/02
//
//@param objrct $O_db0
//@param array $H_g_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/07/04
//
//@access public
//@return void
//
class ShopOrderTotalModel extends ShopOrderDetailModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess, ShopOrderTotalModel.SITE_SHOP);
	}

	__destruct() {
		super.__destruct();
	}

};