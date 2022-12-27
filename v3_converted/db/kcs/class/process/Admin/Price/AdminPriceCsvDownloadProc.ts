//
//価格表CSVダウンロードプロセス
//
//更新履歴：
//2009/09/08 北村俊士 作成
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/08
//@filesource
//@uses ProcessBaseHtml
//@uses AdminPriceCsvDownloadView
//
//
//価格表CSVダウンロードプロセス
//
//更新履歴：
//2009/09/08 北村俊士 作成
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/08
//@uses ProcessBaseHtml
//@uses AdminPriceCsvDownloadView
//

require("process/ProcessBaseHtml.php");

require("view/Admin/Price/AdminPriceCsvDownloadView.php");

require("model/Admin/Price/AdminPriceModel.php");

//
//O_model
//
//@var AdminPriceModel
//@access protected
//
//
//O_view
//
//@var AdminPriceCsvDownloadView
//@access protected
//
//
//pricelistidを絞り込むIDを返すメソッド名
//
//@var string
//@access protected
//
//
//Modelの取得
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return AdminPriceModel
//
//
//Viewの取得
//
//@author kitamura
//@since 2009/09/08
//
//@access public
//@return AdminPriceCsvDownloadView
//
//
//メイン処理
//
//@author kitamura
//@since 2009/09/08
//
//@access protected
//@return void
//
class AdminPriceCsvDownloadProc extends ProcessBaseHtml {
	constructor() {
		super(...arguments);
		this.id_method = "getGroupId";
	}

	getModel() {
		if (false == (undefined !== this.O_model)) {
			this.O_model = new AdminPriceModel();
		}

		return this.O_model;
	}

	getView() {
		if (false == (undefined !== this.O_view)) {
			this.O_view = new AdminPriceCsvDownloadView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) //モデルとビューの取得
	//ログインチェック
	//価格表ID
	//価格表データの設定
	//出力
	{
		var O_view = this.getView();
		var O_model = this.getModel();
		O_view.startCheck();
		var pricelistid = O_view.getPriceListId();
		var restrictid = O_view[this.id_method]();

		if (false == O_model.chkPriceListId(restrictid, pricelistid)) {
			this.errorOut(15, "pricelistid\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093");
		}

		var H_list = O_model.getPriceListSimple(pricelistid);
		var A_detail = O_model.getPriceDetailSimple(pricelistid);
		var A_memo = O_model.getPriceMemoSimple(pricelistid, "productid_hash_notdelete");
		O_view.setPriceList(H_list);
		O_view.setPriceDetail(A_detail);
		O_view.setPriceMemo(A_memo);
		O_view.display();
	}

};