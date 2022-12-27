//
//運送ID全件ダウンロードProccess
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@filesource
//@subpackage Proccess
//@uses ManagementDownloadProcBase
//@uses TransitDownloadView
//@uses TransitFullDownloadModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報全件ダウンロードProccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@uses ManagementDownloadProcBase
//@uses TransitDownloadView
//@uses TransitFullDownloadModel
//

require("process/Management/ManagementDownloadProcBase.php");

require("view/Management/Transit/Download/TransitDownloadView.php");

require("model/Management/Transit/Download/TransitFullDownloadModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2010/02/19
//
//@abstract
//@access protected
//@return void
//@uses TransitDownloadView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//@uses TransitFullDownloadModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class TransitFullDownloadProc extends ManagementDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TransitDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new TransitFullDownloadModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};