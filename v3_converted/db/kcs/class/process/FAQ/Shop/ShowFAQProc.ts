//
//FAQ表示
//
//更新履歴：<br>
//2008/09/30 石崎 作成
//
//@uses FAQBaseProc
//@uses ShopFAQModel
//@uses ShowFAQView
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//FAQ表示
//
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//

require("process/FAQ/FAQBaseProc.php");

require("model/FAQ/Shop/ShopFAQModel.php");

require("view/FAQ/Shop/ShowFAQView.php");

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
//getView
//
//@author ishizaki
//@since 2008/09/30
//
//@access protected
//@return void
//
//
//getModel
//
//@author ishizaki
//@since 2008/09/30
//
//@access protected
//@return void
//
//
//addNewClass
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
//@since 2008/10/19
//
//@access protected
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
class ShowFAQProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		this.H_param.site = ViewBaseHtml.SITE_SHOP;
		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"": "FAQ\u8A73\u7D30\u95B2\u89A7"
		};
		this.O_view = new ShowFAQView(this.H_param);
	}

	getModel() {
		this.O_model = new ShopFAQModel();
	}

	addNewClass() {}

	selfProcessBody(H_param) //FAQ IDの取得
	//FAQの詳細を取得
	//FAQがデフォルトでない場合は、掲載先を取得
	{
		var id = this.O_view.getID();
		var H_FAQDetail = this.O_model.getFAQDetail(id, H_param);

		if (false === H_FAQDetail.defaultflg) {
			var H_Target = this.O_model.getFAQTarget(id, H_param);
			this.O_view.setAssign("Target", H_Target);
		}

		this.O_view.setAssign("back_url", this.O_view.gSess().getSelf("H_url"));

		if (1 > H_FAQDetail.length) {
			this.O_view.setAssign("err_str", "FAQ\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002");
		} else {
			if (0 == H_FAQDetail.fncid) {
				H_FAQDetail.fncname = "\u305D\u306E\u4ED6";
			}

			this.O_view.setAssign("FAQDetail", H_FAQDetail);
		}
	}

	__destruct() {
		super.__destruct();
	}

};