//
//管理者：商品マスター
//
//更新履歴：<br>
//2008/06/26 石崎公久 作成
//
//@package Product
//@subpackage process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//@filesource
//@uses ProcessBaseHtml
//@uses CarrierModel
//@uses CircuitModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//価格表Proccess基底
//
//@package Product
//@subpackage process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/26
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("model/Admin/Product/AdminProductModel.php");

require("view/Admin/Product/AdminProductMenuView.php");

require("model/CircuitModel.php");

require("model/CarrierModel.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//view取得
//
//@author ishizaki
//@since 2008/07/08
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
//@author ishizaki
//@since 2008/04/10
//
//@access public
//@return void
//
class AdminProductMenuProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AdminProductMenuView({
			"": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC"
		});
	}

	get_Model() {
		return new AdminProductModel();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//ローカルセッション取得するよ
	//$H_car = $O_CarModel->getCarrierKeyHash();
	//件数表示のやつ(´･ω･`)
	//セッションの消去（自分SELFは除く）
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var O_model = this.get_Model();
		var O_CarModel = new CarrierModel();
		var O_CirModel = new CircuitModel();
		var H_sess = O_view.getLocalSession();
		var productid = O_view.getProductID();
		var delflg = O_view.getDelflg();

		if (false == is_null(productid) && false == is_null(delflg)) //$O_view->clearSessSelf();
			{
				O_model.changeDelflg(O_view.gSess().admin_groupid, productid, delflg);
			}

		var H_search = O_view.getPostData();
		var H_car = O_CarModel.getCarrierFromProductTbKeyHash();

		if (H_car.length > 0) {
			var A_cir = O_CirModel.getCircuitCarrier(Object.keys(H_car));
		} else {
			A_cir = Array();
		}

		H_car = {
			0: "----"
		} + H_car;
		O_view.makeFormElements([H_car, O_view.makeHierSelectCircuit(A_cir)], H_search);
		O_view.makeFormElements2(H_sess.SELF.limit);
		var H_product_list = O_model.getAdminProductlist(O_view.gSess().admin_groupid, H_search, H_sess.SELF.limit, H_sess.SELF.page);
		O_view.setAssign("H_productlist", H_product_list);
		var H_self = O_view.gSess().getSelfAll();
		O_view.gSess().clearSessionMenu();
		O_view.gSess().setSelfAll(H_self);
		O_view.displaySmarty(undefined !== H_product_list[0] ? H_product_list[0].cnt : 0, H_sess.SELF.limit, H_sess.SELF.page);
	}

	__destruct() {
		super.__destruct();
	}

};