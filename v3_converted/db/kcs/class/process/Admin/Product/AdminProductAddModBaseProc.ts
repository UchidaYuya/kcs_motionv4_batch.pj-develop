//
//管理者：商品マスター登録変更ベース
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
//価格表Proccessベース
//
//@package Product
//@subpackage Process
//@author katsushi
//@since 2008/06/26
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("model/Admin/Product/AdminProductModel.php");

require("view/Admin/Product/AdminProductAddView.php");

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
//get_View
//
//@author katsushi
//@since 2008/07/22
//
//@abstract
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
//protected function doExecute( array $H_param = array() ){
//	}
//
//デストラクタ
//
//@author ishizaki
//@since 2008/04/10
//
//@access public
//@return void
//
class AdminProductAddModBaseProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_Model() {
		return new AdminProductModel();
	}

	__destruct() {
		super.__destruct();
	}

};