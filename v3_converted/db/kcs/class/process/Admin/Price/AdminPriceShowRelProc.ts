//
//管理者：価格表
//
//更新履歴：<br>
//2008/07/29 勝史 作成
//
//@package Price
//@subpackage Process
//@author katsushi
//@since 2008/07/29
//@filesource
//@uses ProcessBaseHtml
//@uses AdminPriceModel
//@uses AdminPriceMenuView
//
//
//error_reporting(E_ALL|E_STRICT);
//
//価格表Proccess基底
//
//@package Price
//@subpackage Process
//@author katsushi
//@since 2008/07/29
//@uses ProcessBaseHtml
//

require("MtSession.php");

require("process/ProcessBaseHtml.php");

require("model/Admin/Price/AdminPriceModel.php");

require("view/Admin/Price/AdminPriceShowRelView.php");

//
//O_view
//
//@var mixed
//@access protected
//
//
//O_Sess
//
//@var mixed
//@access private
//
//
//__construct
//
//@author katsushi
//@since 2008/07/29
//
//@param array $H_param
//@access public
//@return void
//
//
//view取得
//
//@author katsushi
//@since 2008/07/29
//
//@access protected
//@return void
//
//
//model取得
//
//@author ishizaki
//@since 2008/07/08
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
//@uses CarrierModel::getCarrierKeyHash()
//@uses CircuitModel::getCircuitCarrier()
//
//
//デストラクタ
//
//@author katsushi
//@since 2008/07/29
//
//@access public
//@return void
//
class AdminPriceShowRelProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
	}

	get_View() {
		return new AdminPriceShowRelView({
			"/Admin/Price/menu.php": "\u4FA1\u683C\u8868\u4E00\u89A7",
			"": "\u4FA1\u683C\u8868\u63B2\u8F09\u5148\u4E00\u89A7"
		});
	}

	get_Model() {
		return new AdminPriceModel();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//価格表とグループIDの整合性
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var O_model = this.get_Model();

		if (false === O_model.chkPriceListId(O_view.gSess().admin_groupid, this.O_Sess.getSelf("pricelistid"))) {
			this.errorOut(8, "\u5B58\u5728\u3057\u306A\u3044\u4FA1\u683C\u8868\u3067\u3059", false);
			throw die(0);
		}

		O_view.setAssign("pricelistname", O_model.getPriceListName(this.O_Sess.getSelf("pricelistid")));
		O_view.setAssign("H_list", O_model.getPriceRelation(this.O_Sess.getSelf("pricelistid")));
		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};