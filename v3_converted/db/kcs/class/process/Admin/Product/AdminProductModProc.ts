//
//管理者：商品マスター修正
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

require("view/Admin/Product/AdminProductModView.php");

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
//@param string $fnc
//@access private
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
//makeCheckBoxData
//
//@author katsushi
//@since 2008/07/22
//
//@param mixed $H_data
//@access private
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
class AdminProductModProc extends AdminProductAddModBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AdminProductModView({
			"/Admin/Product/menu.php": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC",
			"": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC\u767B\u9332\u5909\u66F4"
		});
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	{
		var O_view = this.get_View();
		O_view.setSubmitName("\u767B\u9332\u5909\u66F4");
		O_view.startCheck();
		var O_model = this.get_Model();
		var postdata = O_view.getPostData();
		var O_CarModel = new CarrierModel();
		var productid = O_view.getProductId();

		if (is_numeric(productid) == true && Array.isArray(postdata) == false) {
			var H_detail = O_model.getProductDetail(O_view.gSess().admin_groupid, O_view.getProductId());
			O_view.setPostData(this.makeCheckBoxData(H_detail));
		}

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
			O_model.updateProduct(O_view.gSess().admin_groupid, O_view.getProductId(), O_view.getPostData());
			O_view.clearSessSelf();
			O_view.displayFinish("\u5546\u54C1\u30DE\u30B9\u30BF\u30FC\u306E\u767B\u9332\u5909\u66F4");
		}
	}

	makeCheckBoxData(H_data) {
		for (var key in H_data) {
			var val = H_data[key];

			if (preg_match("/^(plan|packet|option|service|smartoption)$/", key) == true) {
				var data = unserialize(val);
				H_data[key] = Array();

				if (Array.isArray(data) == true) {
					for (var i = 0; i < data.length; i++) {
						H_data[key][data[i]] = 1;
					}
				} else {
					H_data[key] = undefined;
				}
			}
		}

		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};