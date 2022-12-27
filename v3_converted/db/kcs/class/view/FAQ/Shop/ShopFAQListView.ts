//
//お問い合わせ履歴一覧
//
//更新履歴：<br>
//2008/09/30	石崎公久	作成
//
//@uses MtSession
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

require("MtSession.php");

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
//addDefaults
//
//@author ishizaki
//@since 2008/11/04
//
//@access public
//@return void
//
//
//addFormRules
//
//@author ishizaki
//@since 2008/11/04
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
		if (0 < _POST.length && true == (undefined !== _POST.fid)) {
			var O_g = MtSession.singleton();
			O_g.setSelf("fid", _POST.fid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		super(H_param);
	}

	checkCGIParam() {
		super.checkCGIParam();
		var p = this.gSess().getSelf("p");
		var fid = this.gSess().getSelf("fid");
		var POST = this.gSess().getSelf("POST");
		this.gSess().clearSessionMenu();

		if (undefined != p) {
			this.gSess().setSelf("p", p);
		}

		if (undefined != fid) {
			this.gSess().setSelf("fid", fid);
		}

		if (undefined != POST) {
			this.gSess().setSelf("POST", POST);
		}
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

	addDefaults() {}

	addFormRules() {}

	__destruct() {
		super.__destruct();
	}

};