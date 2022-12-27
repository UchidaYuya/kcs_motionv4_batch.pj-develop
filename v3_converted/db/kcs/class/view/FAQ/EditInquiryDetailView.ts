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
//選択されているお問い合わせのdetaiID
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
//getDetailID
//
//@author ishizaki
//@since 2008/10/21
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
class EditInquiryDetailView extends InquiryBaseView {
	constructor(H_param = undefined) {
		super(H_param);
		this.detailid = undefined;
	}

	getDetailID() {
		return this.detailid;
	}

	checkCGIParam() {
		if (0 < _GET.length && "" != _GET.detailid) {
			this.gSess().setSelf("detailid", _GET.detailid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.detailid = this.gSess().getSelf("detailid");

		if (false == this.detailid) {
			this.H_assign.err_str = "\u8868\u793A\u51FA\u6765\u306A\u3044FAQ\u3001\u307E\u305F\u306FFAQ\u304C\u9078\u629E\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002";
		}

		super.checkCGIParam();
	}

	addDefaults() {
		var H_SessPost = this.gSess().getSelf("POST");

		if (false == H_SessPost) {
			H_SessPost = this.H_assign.formdefaults;

			if (H_SessPost.anonymous == true) {
				H_SessPost.anonymous = Array();
				H_SessPost.anonymous[0] = "1";
			} else {
				delete H_SessPost.anonymous;
			}
		}

		if (false == is_null(H_SessPost.anonymous[0])) {
			this.O_Qf.setDefaultsWrapper({
				anonymous: H_SessPost.anonymous[0]
			});
		}
	}

	addFormElements() {
		if (1 == this.H_assign.formdefaults.authtype) {
			this.A_elements.push({
				name: "anonymous",
				label: "\u540D\u524D\u306E\u8868\u793A",
				inputtype: "groupcheckbox",
				data: {
					"0": "\u533F\u540D\u306B\u3059\u308B"
				}
			});
		} else {
			this.A_elements.push({
				name: "attachment",
				label: "\u6DFB\u4ED8",
				inputtype: "file",
				options: {
					size: 50
				}
			});
		}
	}

	displayFinish() {
		super.displayFinish("\u304A\u554F\u3044\u5408\u308F\u305B\u306E\u7DE8\u96C6", "list.php", "\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7");
	}

	__destruct() {
		super.__destruct();
	}

};