//
//お問い合わせ　一覧
//
//更新履歴：<br>
//2008/08/27	石崎公久	作成
//
//@uses InquiryBaseView
//@uses ViewFinish
//@uses MakePankuzuLink
//@uses MtSession
//@uses QuickFormUtil
//@package FAQ
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//
//
//
//お問い合わせ　一覧
//
//@uses InquiryBaseView
//@uses ViewFinish
//@uses MakePankuzuLink
//@uses MtSession
//@uses QuickFormUtil
//@package FAQ
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("view/FAQ/InquiryBaseView.php");

require("view/ViewFinish.php");

require("view/MakePankuzuLink.php");

require("MtAuthority.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

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
class AddInquiryView extends InquiryBaseView {
	constructor(H_param) {
		super(H_param);
		this.MySess = this.getSetting().faq_sess;
		this.S_pub = this.gSess().getPub(this.MySess);
	}

	checkCGIParam() //親のチェックを起動
	{
		if (true == is_null(this.S_pub) || false == (undefined !== this.S_pub.fncid)) {
			this.getOut().errorOut(8, "\u524D\u30DA\u30FC\u30B8\u304B\u3089\u306E\u30BB\u30C3\u30B7\u30E7\u30F3\u30C7\u30FC\u30BF\u304C\u53D6\u5F97\u3067\u304D\u306A\u3044", false);
			throw die(0);
		}

		this.Fncid = this.S_pub.fncid;
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
		super.displayFinish("\u65B0\u898F\u304A\u554F\u3044\u5408\u308F\u305B", "/FAQ/list.php", "\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7");
	}

	__destruct() {
		super.__destruct();
	}

};