//
//お問い合わせの返信編集
//
//更新履歴：<br>
//2008/09/30	石崎公久	作成
//
//@package FAQ
//@uses InquiryBaseView
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

require("view/FAQ/InquiryBaseView.php");

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
//addDefaults
//
//@author ishizaki
//@since 2008/09/10
//
//@access public
//@return void
//
//
//ベースが保有するQFオブジェクトに要素を追加
//
//@author ishizaki
//@since 2008/09/05
//
//@access public
//@return void
//
//
//displayFinish
//
//@author ishizaki
//@since 2008/10/20
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
class InquiryDetailView extends InquiryBaseView {
	constructor(H_param = undefined) {
		super(H_param);
		this.id = undefined;
	}

	getID() {
		return this.id;
	}

	checkCGIParam() {
		if (0 < _GET.length && "" != _GET.id) {
			this.gSess().setSelf("id", _GET.id);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.id = this.gSess().getSelf("id");

		if (false == this.id) {
			this.getOut().errorOut(8, "\u554F\u3044\u5408\u308F\u305BID\u304C\u5B58\u5728\u3057\u306A\u3044", false);
		}

		super.checkCGIParam();
	}

	addDefaults() {
		var H_SessPost = this.gSess().getSelf("POST");

		if (false == is_null(H_SessPost.anonymous[0])) {
			this.O_Qf.setDefaultsWrapper({
				anonymous: H_SessPost.anonymous[0]
			});
		}
	}

	addFormElements() {
		this.A_elements.push({
			name: "anonymous",
			label: "\u540D\u524D\u306E\u8868\u793A",
			inputtype: "groupcheckbox",
			data: {
				"0": "\u533F\u540D\u306B\u3059\u308B"
			}
		});
	}

	displayFinish() {
		super.displayFinish("\u304A\u554F\u3044\u5408\u308F\u305B\u306E\u8FD4\u4FE1", "/FAQ/list.php", "\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7");
	}

	__destruct() {
		super.__destruct();
	}

};