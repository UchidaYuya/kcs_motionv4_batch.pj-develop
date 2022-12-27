//
//管理者：商品マスター：商品関連付け
//
//更新履歴：<br>
//2008/07/17 石崎公久 作成
//
//@package Product
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/17
//@filesource
//@uses ProcessBaseHtml
//
//
//error_reporting(E_ALL|E_STRICT);
//
//価格表Proccess基底
//
//@package Product
//@subpackage Process
//@author katsushi
//@since 2008/06/26
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("model/Admin/Product/AdminProductModel.php");

require("view/Admin/Product/AdminProductJoinView.php");

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
//-Viewオブジェクト作成
//-ログインチェック
//-Modelオブジェクト(AdminProductModel)
//-smarty出力
//
//@author katsushi
//@since 2008/07/10
//
//@param array $H_param
//@access protected
//@return void
//@uses CarrierModel::getCarrierKeyHash()
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
class AdminProductJoinProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AdminProductJoinView({
			"/Admin/Product/menu.php": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC",
			"": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC\u95A2\u9023\u4ED8\u3051"
		});
	}

	get_Model() {
		return new AdminProductModel();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//フォーム作成
	//関連付け可能なプロダクトの一覧
	//関連済みプロダクトの一覧
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var O_model = this.get_Model();
		var O_CarModel = new CarrierModel();
		var H_car = O_CarModel.getOrderCarrierKeyHash();
		O_view.makeFormElements(H_car, O_view.getCarID());
		var H_postdata = O_view.getPostData();
		var H_productlist_tel = O_model.enableProductListTel(O_view.gSess().admin_groupid, O_view.getCarID(), H_postdata.productname_parent);
		var H_productlist_acc = O_model.enableProductListAcc(O_view.gSess().admin_groupid, O_view.getCarID(), H_postdata.productname_child);
		var H_joined_productlist = O_model.enableJoinedProductList(O_view.gSess().admin_groupid, O_view.getCarID());
		O_view.displaySmarty(H_productlist_tel, H_productlist_acc, H_joined_productlist);
	}

	__destruct() {
		super.__destruct();
	}

};