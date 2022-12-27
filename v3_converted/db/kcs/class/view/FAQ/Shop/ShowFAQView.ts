//
//お問い合わせ履歴一覧
//
//更新履歴：<br>
//2008/09/30	石崎公久	作成
//
//@package FAQ
//@uses FAQViewBase
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//
//
//
//お問い合わせ　一覧
//
//@package FAQ
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//

require("view/FAQ/FAQViewBase.php");

//
//選択されているFAQのID
//
//@var mixed
//@access private
//
//
//__construct
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $H_navi
//@access public
//@return void
//
//
//getID
//
//@author ishizaki
//@since 2008/10/19
//
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
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class ShowFAQView extends FAQViewBase {
	constructor(H_param = undefined) {
		super(H_param);
		this.gSess().setSelf("H_url", parse_url(_SERVER.HTTP_REFERER));
		this.id = undefined;
	}

	getID() {
		return this.id;
	}

	checkCGIParam() {
		super.checkCGIParam();

		if (0 < _GET.length && "" != _GET.id) {
			this.gSess().setSelf("id", _GET.id);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.id = this.gSess().getSelf("id");

		if (false == this.id) {
			this.H_assig.err_str = "\u8868\u793A\u51FA\u6765\u306A\u3044FAQ\u3001\u307E\u305F\u306FFAQ\u304C\u9078\u629E\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002";
		}
	}

	__destruct() {
		super.__destruct();
	}

};