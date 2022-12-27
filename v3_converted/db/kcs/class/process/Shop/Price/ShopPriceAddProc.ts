//
//管理者：価格表登録
//
//更新履歴：<br>
//2008/08/05 上杉勝史 作成
//
//@package Price
//@subpackage Process
//@author katsushi
//@since 2008/07/15
//@filesource
//@uses ProcessBaseHtml
//@uses AdminPriceAddModBaseProc
//@uses AdminProductModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//価格表Proccess基底
//
//@package Price
//@subpackage Process
//@author katsushi
//@since 2008/08/05
//@uses ProcessBaseHtml
//@uses AdminPriceAddModBaseProc
//@uses AdminProductModel
//

require("process/Admin/Price/AdminPriceAddModBaseProc.php");

require("view/Shop/Price/ShopPriceAddView.php");

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
//setView
//
//@author katsushi
//@since 2008/08/06
//
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//1.Viewオブジェクト作成
//2.ログインチェック
//3.Modelオブジェクト(AdminPriceModel)
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
//setShopid
//
//@author katsushi
//@since 2008/08/08
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
class ShopPriceAddProc extends AdminPriceAddModBaseProc {
	constructor(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	{
		super(H_param);
		this.setView();
		this.setShopid();
	}

	setView() {
		this.O_view = new ShopPriceAddView({
			"/Shop/MTPrice/menu.php": "\u4FA1\u683C\u8868\u4E00\u89A7",
			"": "\u4FA1\u683C\u8868\u65B0\u898F\u767B\u9332"
		});
	}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	{
		this.getView().startCheck();
		this.execFormStep();
	}

	setShopid() {
		if (undefined != this.getSess().getSelf("insertShopid")) {
			this.shopid = this.getSess().getSelf("insertShopid");
		} else {
			this.shopid = this.getSess().shopid;
		}

		this.groupid = this.getSess().groupid;
		this.personname = this.getSess().personname;
	}

	__destruct() {
		super.__destruct();
	}

};