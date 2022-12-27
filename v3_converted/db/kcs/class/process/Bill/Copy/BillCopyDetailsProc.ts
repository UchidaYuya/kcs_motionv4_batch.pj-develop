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
//@uses BillDetailsProcBase
//@uses CopyDetailsView
//@uses CopyDetailsModel
//

require("process/Bill/BillDetailsProcBase.php");

require("model/Bill/Copy/BillCopyDetailsModel.php");

require("view/Bill/Copy/BillCopyDetailsView.php");

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
//@uses CopyDetailsModel
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/07/09
//
//@param array $H_g_sess
//@param mixed $O_bill
//@access protected
//@return void
//@uses CopyDetailsModel
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
class BillCopyDetailsProc extends BillDetailsProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new BillCopyDetailsView();
	}

	get_Model(H_g_sess: {} | any[], O_bill) {
		return new BillCopyDetailsModel(this.get_DB(), H_g_sess, O_bill);
	}

	__destruct() {
		super.__destruct();
	}

};