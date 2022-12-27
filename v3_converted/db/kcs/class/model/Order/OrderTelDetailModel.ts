//
//オーダー電話詳細情報取得・更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/04/01
//@uses OrderModel
//@uses ManagementUtil	// （***名前変わる予定***）
//
//
//
//オーダー電話詳細情報取得・更新用Model
//
//@uses ModelBase
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("model/Order/OrderFormModel.php");

require("ManagementUtil.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
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
class OrderTelDetailModel extends ModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};