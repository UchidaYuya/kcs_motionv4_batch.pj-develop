//
//お問い合わせメニュー
//
//更新履歴：<br>
//2008/08/27 石崎 作成
//
//@uses FAQBaseProc
//@uses UserFAQModel
//@uses MenuModel
//@uses PactModel
//@uses PostModel
//@uses FAQMenuView
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

require("model/FAQ/UserFAQModel.php");

require("model/Menu/MenuModel.php");

require("model/PactModel.php");

require("model/PostModel.php");

require("view/FAQ/FAQMenuView.php");

//
//O_model
//
//@var mixed
//@access private
//
//
//O_Pact
//
//@var mixed
//@access private
//
//
//O_menu
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
class FAQMenuProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("menu");
	}

	getView() {
		this.H_param.navi = {
			"": "FAQ\u4E00\u89A7"
		};
		this.O_view = new FAQMenuView(this.H_param);
	}

	getModel() {
		this.O_model = new UserFAQModel();
	}

	addNewClass() {
		this.O_menu = new MenuModel();
		this.O_Pact = new PactModel();
		this.O_Post = new PostModel();
		this.O_auth = MtAuthority.singleton(this.O_view.gSess().pactid);
	}

	selfProcessBody(H_param: {} | any[] = Array()) //モードの確認
	//除外区分を排除
	{
		if (false == is_null(this.O_view.getMode())) //groupid
			//$groupid = $this->O_Pact->getGroupId($this->O_view->gSess()->pactid);
			//そのFAQの一覧を取得
			{
				var groupid = this.O_view.gSess().groupid;

				if (true == is_null(groupid)) {
					this.errorOut(8, "\u30B0\u30EB\u30FC\u30D7ID\u306E\u53D6\u5F97\u306B\u5931\u6557");
					throw die(0);
				}

				var H_car_shop = this.O_Post.getCarRelShopFromPost(this.O_view.gSess().postid);
				this.O_view.setAssign("AH_faqlist", this.O_model.getFAQlist(this.O_view.getFncid(), groupid, this.O_view.gSess().pactid, H_car_shop));
			}

		var A_auth = this.O_view.getAuthUser();
		var temp = A_auth.length;

		for (var i = 0; i < temp; i++) {
			if (true == (-1 !== this.getSetting().A_exclude_fnc.indexOf(String(A_auth[i])))) {
				delete A_auth[i];
			}
		}

		var H_auth = this.O_menu.getMenu(A_auth);
		var H_order = this.filteringFunctionOrder(this.O_menu.getOrderableCarrier(this.O_view.gSess().pactid, this.O_view.gSess().postid));
		H_auth = this.filteringFunction(H_auth);
		this.O_view.setAssign("H_order", H_order);
		this.O_view.setAssign("H_auth", H_auth);
	}

	__destruct() {
		super.__destruct();
	}

};