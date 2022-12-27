//
//電話管理ダウンロードProccess
//
//更新履歴：<br>
//2008/08/15 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/15
//@filesource
//@uses ManagementDownloadProcBase
//@uses TelDownloadView
//@uses ManagementTelMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//電話管理ダウンロードProccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/15
//@uses ManagementDownloadProcBase
//@uses TelDownloadView
//@uses ManagementTelMenuModel
//

require("process/Management/ManagementDownloadProcBase.php");

require("view/Management/Tel/Download/TelDownloadView.php");

require("model/Management/Tel/ManagementTelMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/15
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/08/15
//
//@abstract
//@access protected
//@return void
//@uses TelDownloadView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/08/15
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//@uses ManagementTelMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/15
//
//@access public
//@return void
//
class TelDownloadProc extends ManagementDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TelDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementTelMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};