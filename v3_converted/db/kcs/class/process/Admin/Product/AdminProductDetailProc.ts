//
//管理者：商品マスター詳細
//
//更新履歴：<br>
//2008/07/24 上杉勝史 作成
//
//@package Product
//@subpackage Process
//@author katsushi
//@since 2008/07/24
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

require("process/ProcessBaseHtml.php");

require("model/Admin/Product/AdminProductModel.php");

require("view/Admin/Product/AdminProductDetailView.php");

require("model/PlanModel.php");

require("model/PacketModel.php");

require("model/OptionModel.php");

//
//O_model
//
//@var mixed
//@access protected
//
//
//O_plan
//
//@var mixed
//@access protected
//
//
//O_packet
//
//@var mixed
//@access protected
//
//
//O_option
//
//@var mixed
//@access protected
//
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
//makeModelObj
//
//@author katsushi
//@since 2008/07/25
//
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
class AdminProductDetailProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.makeModelObj();
	}

	get_View() {
		return new AdminProductDetailView({
			"/Admin/Product/menu.php": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC",
			"": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC\u8A73\u7D30"
		});
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//Smartyによる表示
	{
		var O_view = this.get_View("\u5546\u54C1\u30DE\u30B9\u30BF\u30FC\u8A73\u7D30");
		O_view.startCheck();
		O_view.setAssign("H_product", this.O_model.getProductDetailFull(O_view.gSess().admin_groupid, O_view.getProductId()));
		O_view.setAssign("H_stock", this.O_model.getProductStock(O_view.getProductId(), O_view.gSess().admin_groupid));
		O_view.displaySmarty();
	}

	makeModelObj() //modelオブジェクトの生成
	{
		this.O_model = new AdminProductModel();
		this.O_plan = new PlanModel();
		this.O_packet = new PacketModel();
		this.O_option = new OptionModel();
	}

	__destruct() {
		super.__destruct();
	}

};