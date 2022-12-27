//
//テストプロセス
//
//更新履歴：<br>
//2008/06/25 上杉勝史 作成
//
//@uses ProcessBaseHtml
//@package TEST
//@filesource
//@author katsushi
//@since 2008/06/25
//
//error_reporting(E_ALL|E_STRICT);
//
//
//テストプロセス
//
//@uses ProcessBaseHtml
//@package TEST
//@author katsushi
//@since 2008/06/25
//

require("process/ProcessBaseHtml.php");

require("model/TEST/TESTModel.php");

require("view/TEST/TESTView.php");

//
//__construct
//
//@author katsushi
//@since 2008/06/25
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author katsushi
//@since 2008/06/25
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/06/25
//
//@access public
//@return void
//
class TESTProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //// view の生成
	//$O_view->startCheck();
	//$A_auth = $O_view->getAuthBase();
	//// model の生成
	//Smartyによる表示
	{
		var O_view = new TESTView();
		var O_model = new TESTmodel();
		var H_pact = O_model.getPact();
		O_view.displaySmarty(H_pact);
	}

	__destruct() {
		super.__destruct();
	}

};