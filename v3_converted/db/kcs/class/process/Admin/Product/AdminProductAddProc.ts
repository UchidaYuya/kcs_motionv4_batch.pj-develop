//
//管理者：商品マスター登録
//
//更新履歴：<br>
//2008/07/15 上杉勝史 作成
//
//@package Product
//@subpackage Process
//@author katsushi
//@since 2008/07/15
//@filesource
//@uses ProcessBaseHtml
//@uses CarrierModel
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

require("AdminProductAddModBaseProc.php");

require("view/Admin/Product/AdminProductAddView.php");

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
//get_View
//
//@author katsushi
//@since 2008/07/22
//
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//1.Viewオブジェクト作成
//2.ログインチェック
//3.Modelオブジェクト(AdminProductModel)
//4.Modelオブジェクト(CarrierModel)
//5.キャリア一覧の取得
//6.キャリア一覧に空(未選択)を加える
//7.検索フォームの作成(QuickForm)
//8.ViewからPOSTの値を取得
//9.検索結果をViewへ渡す
//10.smarty出力
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
class AdminProductAddProc extends AdminProductAddModBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AdminProductAddView({
			"/Admin/Product/menu.php": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC",
			"": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC\u65B0\u898F\u767B\u9332"
		});
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//登録する前
	{
		var O_view = this.get_View("\u5546\u54C1\u30DE\u30B9\u30BF\u30FC\u65B0\u898F\u767B\u9332");
		O_view.setSubmitName("\u767B\u9332\u3059\u308B");
		O_view.startCheck();
		var O_model = this.get_Model();
		var O_CarModel = new CarrierModel();

		if (false == O_view.getSubmitFlag()) //キャリア一覧の取得
			//フォーム作成
			//Smartyによる表示
			{
				var H_car = O_CarModel.getOrderCarrierKeyHash();
				H_car = {
					"": "----"
				} + H_car;
				O_view.makeFormElements(H_car);
				O_view.setDefaults();
				O_view.assignForm();
				O_view.displaySmarty();
			} else {
			O_model.insertProduct(O_view.gSess().admin_groupid, O_view.getPostData());
			O_view.clearSessSelf();
			O_view.displayFinish("\u5546\u54C1\u30DE\u30B9\u30BF\u30FC\u306E\u65B0\u898F\u767B\u9332");
		}
	}

	__destruct() {
		super.__destruct();
	}

};