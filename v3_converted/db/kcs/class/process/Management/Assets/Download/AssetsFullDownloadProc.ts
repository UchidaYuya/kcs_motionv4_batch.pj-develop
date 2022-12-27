//
//資産管理全件ダウンロードProccess
//
//更新履歴：<br>
//2008/08/20 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/20
//@filesource
//@subpackage Proccess
//@uses ManagementDownloadProcBase
//@uses AssetsDownloadView
//@uses AssetsFullDownloadModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//資産管理全件ダウンロードProccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/20
//@uses ManagementDownloadProcBase
//@uses AssetsDownloadView
//@uses AssetsFullDownloadModel
//

require("process/Management/ManagementDownloadProcBase.php");

require("view/Management/Assets/Download/AssetsDownloadView.php");

require("model/Management/Assets/Download/AssetsFullDownloadModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/20
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/08/20
//
//@abstract
//@access protected
//@return void
//@uses AssetsDownloadView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/08/20
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//@uses AssetsFullDownloadModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/20
//
//@access public
//@return void
//
class AssetsFullDownloadProc extends ManagementDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AssetsDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new AssetsFullDownloadModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};