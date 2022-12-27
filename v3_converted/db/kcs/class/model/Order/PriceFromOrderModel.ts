//
//価格表メニュー用Model
//
//@package Price
//@subpackage Model
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//
//
//
//価格表メニュー用Model
//
//@package Price
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//

require("model/Price/UserPriceModel.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class PriceFromOrderModel extends UserPriceModel {
	constructor(pactid) {
		super(pactid);
	}

	__destruct() {
		super.__destruct();
	}

};