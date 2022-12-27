//
//管理情報ダウンロードProccess
//
//更新履歴：<br>
//2008/03/21 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/28
//@filesource
//@uses ManagementDownloadProcBase
//@uses ManagementDownloadView
//@uses ManagementMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報ダウンロードProccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/28
//@uses ManagementDownloadProcBase
//@uses ManagementDownloadView
//@uses ManagementMenuModel
//

require("process/Management/ManagementDownloadProcBase.php");

require("view/Management/Download/ManagementDownloadView.php");

require("model/Management/ManagementMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/27
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/03/27
//
//@abstract
//@access protected
//@return void
//@uses ManagementDownloadView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/03/27
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//@uses ManagementMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementDownloadProc extends ManagementDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};