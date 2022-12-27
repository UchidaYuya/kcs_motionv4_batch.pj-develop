//
//管理者：在庫マスター追加
//
//更新履歴：<br>
//2008/06/26 石崎公久 作成
//
//@package Product
//@subpackage process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/10
//@filesource
//@uses ProcessBaseHtml
//@uses MtSession
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理者：在庫マスター
//
//@package Product
//@subpackage process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/10
//@uses ProcessBaseHtml
//@uses MtSession
//

require("MtSession.php");

require("process/ProcessBaseHtml.php");

require("model/Admin/Product/AdminProductStockModel.php");

require("view/Admin/Product/AdminProductAddStockView.php");

//
//O_Sess
//
//@var mixed
//@access private
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
class AdminProductAddStockProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
	}

	get_View() {
		return new AdminProductAddStockView({
			"/Admin/Product/menu.php": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC",
			"/Admin/Product/stock_menu.php": "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u4E00\u89A7",
			"": "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u65B0\u898F\u767B\u9332"
		});
	}

	get_Model() {
		return new AdminProductStockModel();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//セッションに入っている groupid と puroductid の整合性
	//登録する前
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var O_model = this.get_Model();
		var res = O_model.chkProductId(O_view.gSess().admin_groupid, O_view.getSProductIdValue());

		if (false === res) {
			this.errorOut(8, "\u4FA1\u683C\u8868\u304C\u898B\u3064\u304B\u3089\u306A\u3044", false);
			throw die(0);
		}

		var err = false;

		if (0 != O_model.checkProductProperty(O_view.getSProductIdValue(), O_view.getBranchProperty()).length) {
			err = true;
		}

		O_view.makeFormElements(err);

		if (false == O_view.getSubmitFlag()) {
			O_view.setAssign("productname", O_model.getProductName(O_view.getSProductIdValue()));
			O_view.displaySmarty();
		} else {
			O_model.insertProductBranch(O_view.getSProductIdValue(), O_view.getBranchProperty());
			O_view.clearSessSelf();
			O_view.displayFinish();
		}
	}

	__destruct() {
		super.__destruct();
	}

};