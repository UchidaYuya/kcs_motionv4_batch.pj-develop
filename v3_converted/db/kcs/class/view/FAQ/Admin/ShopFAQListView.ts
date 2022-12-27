//
//お問い合わせ履歴一覧
//
//更新履歴：<br>
//2008/09/30	石崎公久	作成
//
//@package FAQ
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//
//
//
//お問い合わせ　一覧
//
//@uses FAQListViewBase
//@package FAQ
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//

require("view/FAQ/FAQListViewBase.php");

//
//__construct
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $H_param
//@access public
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
//
//addFormElements
//
//@author ishizaki
//@since 2008/10/31
//
//@access public
//@return void
//
//
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class ShopFAQListView extends FAQListViewBase {
	constructor(H_param = undefined) {
		super(H_param);
	}

	checkCGIParam() {
		super.checkCGIParam();
		this.gSess().clearSessionMenu();
	}

	addFormElements() {
		this.A_elements.push({
			name: "kubun",
			label: "\u533A\u5206",
			inputtype: "select",
			data: this.H_assign.fncnamelist
		});
		this.A_elements.push({
			name: "compname",
			label: "\u4F1A\u793E\u540D",
			inputtype: "text",
			options: "size=20"
		});
	}

	__destruct() {
		super.__destruct();
	}

};