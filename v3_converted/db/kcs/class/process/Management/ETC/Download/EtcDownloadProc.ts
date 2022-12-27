//
//ETC管理ダウンロードProccess
//
//更新履歴：<br>
//2008/04/04 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/04
//@filesource
//@uses ManagementDownloadProcBase
//@uses EtcDownloadView
//@uses ManagementEtcMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ETC管理ダウンロードProccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/04
//@uses ManagementDownloadProcBase
//@uses EtcDownloadView
//@uses ManagementEtcMenuModel
//

require("process/Management/ManagementDownloadProcBase.php");

require("view/Management/ETC/Download/EtcDownloadView.php");

require("model/Management/ETC/ManagementEtcMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/04
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/04/04
//
//@abstract
//@access protected
//@return void
//@uses EtcDownloadView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/04/04
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//@uses ManagementEtcMenuModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/04
//
//@access public
//@return void
//
class EtcDownloadProc extends ManagementDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EtcDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementEtcMenuModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};