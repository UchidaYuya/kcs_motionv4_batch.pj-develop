//
//コピー機請求Proccess
//
//更新履歴：<br>
//2008/07/09 宝子山浩平 作成
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/07/09
//@filesource
//@uses BillMenuProcBase
//@uses CopyMenuView
//@uses CopyMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報トップページProccess
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/07/09
//@uses BillMenuProcBase
//@uses CopyMenuView
//@uses CopyMenuModel
//

require("process/Bill/BillMenuProcBase.php");

require("model/Bill/Copy/BillCopyMenuModel.php");

require("view/Bill/Copy/BillCopyMenuView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/07/09
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/07/09
//
//@access protected
//@return void
//@uses CopyMenuModel
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/07/09
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses CopyMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/07/09
//
//@access public
//@return void
//
class BillCopyMenuProc extends BillMenuProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillCopyMenuView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new BillCopyMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};