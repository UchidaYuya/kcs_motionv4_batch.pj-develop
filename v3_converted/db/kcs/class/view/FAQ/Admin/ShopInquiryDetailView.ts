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
//addFormRules
//
//@author ishizaki
//@since 2008/10/22
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
class ShopInquiryDetailView extends InquiryBaseView {
	constructor(H_param = undefined) {
		super(H_param);
		this.id = undefined;
	}

	getID() {
		return this.id;
	}

	checkCGIParam() {
		if (0 < _POST.length && (0 === _POST.fnc || true == (undefined !== _POST.fnc))) {
			this.gSess().setSelf("fnc", _POST.fnc);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (false !== this.gSess().getSelf("fnc")) {
			this.Mode = "editfnc";
		}

		if (0 < _POST.length && true == (undefined !== _POST.status)) {
			this.gSess().setSelf("status", _POST.status);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (false != this.gSess().getSelf("status")) {
			this.Mode = "statusfnc";
		}

		if (0 < _POST.length && true == (undefined !== _POST.publiclevel)) {
			this.gSess().setSelf("publiclevel", _POST.publiclevel);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (false != this.gSess().getSelf("publiclevel")) {
			this.Mode = "publicfnc";
		}

		if (0 < _GET.length && "" != _GET.id) {
			this.gSess().setSelf("id", _GET.id);
			this.gSess().setPub(this.getSetting().faq_inquiryid, _GET.id);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.id = this.gSess().getSelf("id");

		if (false == this.id) {
			this.H_assig.err_str = "\u8868\u793A\u51FA\u6765\u306A\u3044FAQ\u3001\u307E\u305F\u306FFAQ\u304C\u9078\u629E\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002";
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
			name: "attachment",
			label: "\u6DFB\u4ED8",
			inputtype: "file",
			options: {
				size: 50
			}
		});
	}

	addFormRules() {
		this.A_rules.push({
			name: "attachment",
			mess: "\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\u5927\u304D\u3059\u304E\u307E\u3059\u3002",
			type: "maxfilesize",
			format: 5242880,
			validation: "client"
		});
	}

	displayFinish() {
		super.displayFinish("\u304A\u554F\u3044\u5408\u308F\u305B\u306E\u8FD4\u4FE1", "menu.php", "FAQ\u30FB\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7");
	}

	__destruct() {
		super.__destruct();
	}

};