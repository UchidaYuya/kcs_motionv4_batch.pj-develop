//
//管理者：在庫マスター
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
//@uses CarrierModel
//@uses CircuitModel
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
//

require("process/ProcessBaseHtml.php");

require("model/Admin/Product/AdminProductStockModel.php");

require("view/Admin/Product/AdminProductStockView.php");

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
class AdminProductStockProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AdminProductStockView({
			"/Admin/Product/menu.php": "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC",
			"": "\u5728\u5EAB\u30DE\u30B9\u30BF\u30FC\u4E00\u89A7"
		});
	}

	get_Model() {
		return new AdminProductStockModel();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//セッションに入っている groupid と puroductid の整合性
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var O_model = this.get_Model();
		var res = O_model.chkProductId(O_view.gSess().admin_groupid, O_view.getSProductIdValue());

		if (false === res) {
			this.errorOut(8, "\u4FA1\u683C\u8868\u304C\u898B\u3064\u304B\u3089\u306A\u3044", false);
			throw die(0);
		}

		var branchid = O_view.getBranchID();
		var delflg = O_view.getDelflg();

		if (false == is_null(branchid) && false == is_null(delflg)) {
			O_model.changeDelflg(O_view.getSProductIdValue(), branchid, delflg);
			O_view.clearSessSelf();
		}

		var detail_list = O_model.getAdminDetaillist(O_view.gSess().admin_groupid, O_view.getSProductIdValue());
		O_view.setAssign("productname", O_model.getProductName(O_view.getSProductIdValue()));
		O_view.setAssign("H_detaillist", detail_list);
		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};