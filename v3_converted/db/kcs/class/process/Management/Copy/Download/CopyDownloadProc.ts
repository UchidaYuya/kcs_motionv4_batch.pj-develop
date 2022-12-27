//
//コピー機管理ダウンロードProccess
//
//更新履歴：<br>
//2008/05/14 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@filesource
//@uses ManagementDownloadProcBase
//@uses CopyDownloadView
//@uses ManagementCopyMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//コピー機管理ダウンロードProccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@uses ManagementDownloadProcBase
//@uses CopyDownloadView
//@uses ManagementCopyMenuModel
//

require("process/Management/ManagementDownloadProcBase.php");

require("view/Management/Copy/Download/CopyDownloadView.php");

require("model/Management/Copy/ManagementCopyMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/05/14
//
//@abstract
//@access protected
//@return void
//@uses CopyDownloadView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//@uses ManagementCopyMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/14
//
//@access public
//@return void
//
class CopyDownloadProc extends ManagementDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new CopyDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementCopyMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};