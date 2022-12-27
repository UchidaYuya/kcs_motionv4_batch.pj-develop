//
//注文必須情報入力Proc基底クラス
//
//更新履歴：<br>
//2008/04/17 宮澤龍彦 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/04/17
//
//
//error_reporting(E_ALL|E_STRICT);
//
//注文必須情報入力Proc基底クラス
//
//@uses ProcessBaseHtml
//@package Order
//@author miyazawa
//@since 2008/04/17
//

require("process/ProcessBaseHtml.php");

require("model/Order/OrderModelBase.php");

require("model/Order/OrderTelInfoModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author miyazawa
//@since 2008/04/01
//
//@abstract
//@access protected
//@return void
//
//
//get_Model
//
//@author katsushi
//@since 2008/09/12
//
//@param array $H_g_sess
//@param mixed $site_flg
//@access protected
//@return void
//
//
//get_TelInfoModel
//
//@author katsushi
//@since 2008/09/12
//
//@param array $H_g_sess
//@param mixed $site_flg
//@access protected
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
class OrderInputProcBase extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_Model(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new OrderInputModelBase(O_db0, H_g_sess, site_flg);
	}

	get_TelInfoModel(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new OrderTelInfoModel(O_db0, H_g_sess, site_flg);
	}

	__destruct() {
		super.__destruct();
	}

};