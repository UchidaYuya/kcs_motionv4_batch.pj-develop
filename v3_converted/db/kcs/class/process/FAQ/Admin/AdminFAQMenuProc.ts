//
//お問い合わせメニュー
//
//更新履歴：<br>
//2008/08/27 石崎 作成
//
//@uses FAQBaseProc
//@uses AdminFAQModel
//@user AdminFAQMenuView
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//お問い合わせメニュー
//
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("process/FAQ/FAQBaseProc.php");

require("model/FAQ/Admin/AdminFAQModel.php");

require("view/FAQ/Admin/AdminFAQMenuView.php");

//
//O_model
//
//@var mixed
//@access private
//
//
//コンストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//Viewクラスの生成
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//Modelクラスの生成
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//必要クラスの生成
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//selfProcessBody
//
//@author ishizaki
//@since 2008/08/27
//
//@param array $H_param
//@access public
//@return void
//
//
//デストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class AdminFAQMenuProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		this.H_param.site = ViewBaseHtml.SITE_ADMIN;
		this.H_param.navi = {
			"": "FAQ\u4E00\u89A7"
		};
		this.O_view = new AdminFAQMenuView(this.H_param);
	}

	getModel() {
		this.O_model = new AdminFAQModel();
	}

	addNewClass() {}

	selfProcessBody(H_param: {} | any[] = Array()) //モードの確認
	{
		if (false == is_null(this.O_view.getMode())) //そのFAQの一覧を取得
			{
				this.O_view.setAssign("AH_faqlist", this.O_model.getFAQListAtGroupid(this.O_view.getFncid(), this.O_view.gSess().admin_groupid));
			}

		var H_order = this.O_model.getOrderableList();
		var H_auth = this.O_model.getFunctionList();
		this.O_view.setAssign("H_order", H_order);
		this.O_view.setAssign("H_auth", H_auth);
	}

	__destruct() {
		super.__destruct();
	}

};