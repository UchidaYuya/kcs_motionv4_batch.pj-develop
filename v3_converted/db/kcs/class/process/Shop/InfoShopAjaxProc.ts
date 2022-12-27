//
//販売店：販売店向けのお知らせ表示AJAX
//
//更新履歴：<br>
//2008/12/19 宮澤龍彦	作成
//
//@uses ProcessBaseHtml
//@package Product
//@subpackage process
//@filesource
//@author katsushi
//@since 2008/07/15
//@uses ProcessBaseHtml
//@uses CircuitModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//商品マスターAJAX
//
//@uses ProcessBaseHtml
//@package Product
//@subpackage process
//@author katsushi
//@since 2008/07/15
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("view/Shop/InfoShopAjaxView.php");

require("model/InfoModel.php");

//
//O_view
//
//@var mixed
//@access private
//
//
//O_info
//
//@var mixed
//@access private
//
//
//コンストラクター
//
//@author katsushi
//@since 2008/07/15
//
//@param array $H_param
//@access public
//@return void
//
//
//makeViewObj
//
//@author katsushi
//@since 2008/07/15
//
//@access protected
//@return void
//
//
//makeInfoModelObj
//
//@author miyazawa
//@since 2008/12/19
//
//@access protected
//@return void
//
//
//getView
//
//@author katsushi
//@since 2008/07/15
//
//@access protected
//@return void
//
//
//getInfoModel
//
//@author katsushi
//@since 2008/07/15
//
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//１．Viewオブジェクト作成
//２．ログインチェック
//３．Modelオブジェクト
//４．現在有効である価格表の取得
//５．価格表表示
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/04/10
//
//@access public
//@return void
//
class InfoShopAjaxProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	makeViewObj() {
		this.O_view = new InfoShopAjaxView();
	}

	makeInfoModelObj() //modelオブジェクトの生成
	{
		this.O_Info = new InfoModel();
	}

	getView() {
		return this.O_view;
	}

	getInfoModel() {
		return this.O_Info;
	}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	//これを入れるとエラーになるのでコメントアウト、代わりに下でパラメータチェック
	//$this->getView()->startCheck();
	//お知らせ取得
	//limitは3にしておくが、販売店によって変更する必要があれば$this->getSetting()->shop_menu_info_countなどを使う 20081218miya
	//JSON形式で出力
	{
		this.makeViewObj();
		this.makeInfoModelObj();
		var A_info = Array();

		if ("" != this.getView().gSess().shopid) {
			A_info = this.O_Info.getAllShopInfoList(this.getView().gSess().shopid, this.getView().gSess().memid, this.getView().gSess().su, 3);
		}

		this.getView().setResponse(A_info);
		this.getView().putJSON();
	}

	__destruct() {
		super.__destruct();
	}

};