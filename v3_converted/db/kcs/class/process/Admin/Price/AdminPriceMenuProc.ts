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

require("view/Admin/Price/AdminPriceMenuView.php");

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
class AdminPriceMenuProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
	}

	get_View() {
		return new AdminPriceMenuView({
			"": "\u4FA1\u683C\u8868\u4E00\u89A7"
		});
	}

	get_Model() {
		return new AdminPriceModel();
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//価格表削除
	//デフォルトではない価格表の一覧
	//セッションの消去（自分SELFは除く）
	//Smartyによる表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var O_model = this.get_Model();
		var pricelistid = this.O_Sess.getSelf("pricelistid");
		var delflag = this.O_Sess.getSelf("delflag");

		if (false == is_null(pricelistid) && false == is_null(delflag)) {
			if (false === O_model.chkPriceListId(O_view.gSess().admin_groupid, pricelistid, true)) {
				this.errorOut(8, "\u6307\u5B9A\u3055\u308C\u305F\u4FA1\u683C\u8868\u306F\u5B58\u5728\u3057\u307E\u305B\u3093", false);
			}

			O_model.changePricelistDelflag(pricelistid, delflag);
			var H_mnglog = {
				shopid: O_view.gSess().admin_shopid,
				shopname: O_view.gSess().admin_name,
				username: O_view.gSess().admin_personname,
				kind: "Price",
				type: "\u4FA1\u683C\u8868\u524A\u9664",
				comment: "pricelistid" + pricelistid + "\u306E\u4FA1\u683C\u8868\u3092\u524A\u9664"
			};
			this.getOut().writeAdminMnglog(H_mnglog);
			this.O_Sess.setSelf("pricelistid", undefined);
			this.O_Sess.setSelf("delflag", undefined);
		}

		O_view.setAssign("H_opt", O_model.getPricePatternAssoc());
		var H_pricelist = O_model.getAdminAllPricelistOutline(O_view.gSess().admin_groupid);
		var A_search_pact = O_model.getAdminPriceList("col", O_view.gSess().admin_groupid, " pricelist_tb.defaultflg = false AND ");
		var H_search_pact = Array();
		var count_search_pact = A_search_pact.length;

		for (var cnt = 0; cnt < count_search_pact; cnt++) {
			H_search_pact[A_search_pact[cnt]] = O_model.getPublishedPactCount(A_search_pact[cnt]).length;
		}

		O_view.setAssign("H_search_pact", H_search_pact);
		var H_ppid_name = O_model.getNewestDefaultPricelist(O_view.gSess().admin_groupid);
		O_view.setAssign("H_ppid_name", H_ppid_name);
		O_view.setAssign("H_pricelist", H_pricelist);
		O_view.gSess().clearSessionMenu();
		O_view.gSess().setSelfAll();
		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};