//
//メニューよく使う項目のAJAX
//
//更新履歴：<br>
//2008/08/17 上杉勝史	作成
//
//@uses ProcessBaseHtml
//@package Menu
//@subpackage process
//@filesource
//@author katsushi
//@since 2008/08/17
//@uses ProcessBaseHtml
//@uses FavoriteModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//メニューよく使う項目のAJAX
//
//@uses ProcessBaseHtml
//@package Menu
//@subpackage process
//@author katsushi
//@since 2008/08/17
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("view/Menu/MenuAjaxView.php");

require("model/FavoriteModel.php");

//
//O_model
//
//@var mixed
//@access private
//
//
//O_view
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
//makeModelObj
//
//@author katsushi
//@since 2008/07/15
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
//getModel
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
//setResponseType
//
//@author katsushi
//@since 2008/07/15
//
//@access protected
//@return void
//@uses FavoriteModel::addFavoriteMenu()
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
class MenuAjaxProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	makeViewObj() {
		this.O_view = new MenuAjaxView();
	}

	makeModelObj() //modelオブジェクトの生成
	{
		this.O_model = new FavoriteModel();
	}

	getView() {
		return this.O_view;
	}

	getModel() {
		return this.O_model;
	}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	//出力
	{
		this.makeViewObj();
		this.makeModelObj();
		this.getView().startCheck();
		this.setResponseType();
		this.getView().put();
	}

	setResponseType() //エラーの場合HTTPのレスポンスにnullを返す
	{
		var H_param = this.getView().getData();

		if (undefined !== H_param.type == false) {
			this.getView().setResponse(undefined);
			return false;
		}

		if (H_param.type == "add") {
			var ins = this.getModel().addFavoriteMenu(this.getView().gSess().pactid, this.getView().gSess().userid, H_param.fncid);

			if (PEAR.isError(ins) == true) {
				var res = "addNg";
			} else {
				res = "addFavoriteOK";
			}
		} else if (H_param.type == "del") {
			ins = this.getModel().delFavoriteMenu(this.getView().gSess().pactid, this.getView().gSess().userid, H_param.fncid);

			if (PEAR.isError(ins) == true) {
				res = "delNg";
			} else {
				res = "delFavoriteOK";
			}
		} else {
			res = "pubNg";
		}

		this.getView().setResponse(res);
	}

	__destruct() {
		super.__destruct();
	}

};