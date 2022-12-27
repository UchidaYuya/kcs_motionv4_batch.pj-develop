//
//注文　用途区分設定画面
//
//更新履歴：<br>
//2013/09/20 石崎公久 作成
//
//@package kcsmotion
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2013/09/20
//@filesource
//@uses ProcessBaseHtml
//
//
//error_reporting(E_ALL|E_STRICT);
//
//注文　用途区分設定画面
//
//@package kcsmotion
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2013/09/20
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("view/ViewInsight.php");

require("model/ValidateAuthority/OrderByCategory.php");

require("model/Redirecter/OrderByCategory.php");

require("model/Sessionning/OrderByCategory.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2013/09/20
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理のメイン
//
//@author ishizaki
//@since 2013/09/20
//
//@param array $H_param
//@access protected
//@return void
//
class OrderByCategoryProc extends ProcessBaseHtml {
	constructor() {
		super();
		this.vS = new ViewInsight();
	}

	doExecute(H_param: {} | any[] = Array()) {
		this.vS.startCheck(new ValidateAuthorityOrderByCategory());
		this.junction();
	}

	junction() {
		if (undefined !== _GET.pattern) {
			this.vS.setSessionAndRedirectMenu(new SessionningOrderByCategory(MtSession.singleton(), _GET.pattern), new RedirecterOrderByCategory());
			throw die();
		}

		this.menu();
	}

	menu() {
		this.vS.setNavigation({
			"": "\u3054\u6CE8\u6587\uFF08\u7528\u9014\u533A\u5206\u9078\u629E\uFF09"
		});
		this.vS.displaySmarty();
	}

};