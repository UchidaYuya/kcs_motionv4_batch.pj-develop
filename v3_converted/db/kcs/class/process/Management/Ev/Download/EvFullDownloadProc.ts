//
//EV ID全件ダウンロードProccess
//
//更新履歴：<br>
//2010/07/29 前田 作成
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/29
//@filesource
//@subpackage Proccess
//@uses ManagementDownloadProcBase
//@uses EvDownloadView
//@uses EvFullDownloadModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報全件ダウンロードProccess
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/29
//@uses ManagementDownloadProcBase
//@uses EvDownloadView
//@uses EvFullDownloadModel
//

require("process/Management/ManagementDownloadProcBase.php");

require("view/Management/Ev/Download/EvDownloadView.php");

require("model/Management/Ev/Download/EvFullDownloadModel.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/29
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author maeda
//@since 2010/07/29
//
//@abstract
//@access protected
//@return void
//@uses EvDownloadView
//
//
//各ページのモデル取得
//
//@author maeda
//@since 2010/07/29
//
//@param array $H_g_sess
//@param mixed $O_manage
//@abstract
//@access protected
//@return void
//@uses EvFullDownloadModel
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/29
//
//@access public
//@return void
//
class EvFullDownloadProc extends ManagementDownloadProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EvDownloadView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EvFullDownloadModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};