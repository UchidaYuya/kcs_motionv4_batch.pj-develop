//
//資産新規登録Proccess
//
//更新履歴：<br>
//2008/08/18 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@filesource
//@uses ManagementAddProcBase
//@uses AssetsAddView
//@uses AssetsAddModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//資産新規登録Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@uses ManagementAddProcBase
//@uses AssetsAddView
//@uses AssetsAddModel
//

require("process/Management/ManagementAddProcBase.php");

require("model/Management/Assets/AssetsAddModel.php");

require("view/Management/Assets/AssetsAddView.php");

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
//@uses AssetsAddView
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
//@uses AssetsAddModel
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
class AssetsAddProc extends ManagementAddProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AssetsAddView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new AssetsAddModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};