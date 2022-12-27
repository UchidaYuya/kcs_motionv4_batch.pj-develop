//
//資産詳細画面Proccess
//
//更新履歴：<br>
//2008/08/18 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@filesource
//@uses ManagementDetailProcBase
//
//
//error_reporting(E_ALL|E_STRICT);
//
//資産詳細画面Proccess
//
//@package Management
//@author houshiyama
//@since 2008/08/18
//@uses ManagementDetailProcBase
//@uses AssetsDetailView
//@uses AssetsDetailModel
//

require("process/Management/ManagementDetailProcBase.php");

require("model/Management/Assets/AssetsDetailModel.php");

require("view/Management/Assets/AssetsDetailView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/18
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return void
//@uses AssetsDetailView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/08/18
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses AssetsDetailModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/18
//
//@access public
//@return void
//
class AssetsDetailProc extends ManagementDetailProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AssetsDetailView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new AssetsDetailModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};