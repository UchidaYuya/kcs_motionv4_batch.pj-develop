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
//
//注文更新用Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/04/01
//

require("OrderUtil.php");

require("OrderModifyModelBase.php");

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
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class ShopOrderModifyModel extends OrderModifyModelBase {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess, ShopOrderModifyModel.SITE_SHOP);
	}

	__destruct() {
		super.__destruct();
	}

};