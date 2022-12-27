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

require("MtAuthority.php");

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
//@since 2008/10/29
//
//@access public
//@return void
//
//
//addDefaults
//
//@author ishizaki
//@since 2008/11/02
//
//@access public
//@return void
//
//
//addFormRules
//
//@author ishizaki
//@since 2008/11/02
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
class FAQListView extends FAQListViewBase {
	constructor(H_param = undefined) {
		super(H_param);
	}

	checkCGIParam() {
		super.checkCGIParam();
	}

	addFormElements() {
		this.H_assign.fncnamelist = {
			"": "\u3059\u3079\u3066\u304B\u3089\u691C\u7D22"
		} + this.H_assign.fncnamelist;
		this.A_elements.push({
			name: "kubun",
			label: "\u533A\u5206",
			inputtype: "select",
			data: this.H_assign.fncnamelist
		});
	}

	addDefaults() {}

	addFormRules() {}

	__destruct() {
		super.__destruct();
	}

};