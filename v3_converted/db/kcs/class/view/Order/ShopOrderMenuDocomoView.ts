//
//受注一覧View
//
//更新履歴：<br>
//2008/05/28 igarashi
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/05/28
//@filesource
//@uses OrderListViewBase
//@uses QuickFormUtil
//
//
//error_reporting(E_ALL);
//
//受注一覧View
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/05/28
//@uses OrderListViewBase
//@uses QuickFormUtil
//

require("view/Order/OrderListMenuView.php");

require("OrderUtil.php");

require("view/Order/ShopOrderMenuView.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author igarashi
//@since 2008/03/03
//
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author miyazawa
//@since 2008/05/28
//
//@access public
//@return array
//
// 初回表示時の検索条件をセット
//
// @author igarashi
// @since 2008/07/08
//
// @access public
// @return hash
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ShopOrderMenuDocomoView extends ShopOrderMenuView {
	constructor(H_param: {} | any[] = Array()) //$this->O_Sess->setSelfAll( $this->H_Local );
	{
		super();
		this.O_Sess.setGlobal("docomo_only", true);
	}

	makePankuzuLinkHash() {
		var H_link = {
			"": "\u30AA\u30FC\u30C0\u4E00\u89A7"
		};
		return H_link;
	}

	setDefaultSearchSession(H_sess, H_date) //$H_sess["carid"] = array("1", "1", "1", "1", "1", "1", "1");
	//どこものみにする
	{
		if (undefined != H_sess.post) {
			return H_sess;
		}

		H_sess.expectexec = {
			Y: H_date.y,
			m: H_date.m,
			d: H_date.d
		};
		H_sess.seldate = "ansdate";
		var H_status = [0, 1, 2, 3, 4, 11, 15];

		for (var val of Object.values(H_status)) {
			H_sess.status[val] = "1";
		}

		H_sess.ordertype = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"];
		H_sess.carid[0] = "1";
		H_sess.buyselid = ["1", "1", "1"];
		H_sess.receipt = ["1", "1", "1"];
		return H_sess;
	}

	__destruct() {
		super.__destruct();
	}

};