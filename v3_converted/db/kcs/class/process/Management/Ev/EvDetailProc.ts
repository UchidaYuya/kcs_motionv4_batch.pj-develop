//
//EV ID詳細画面Proccess
//
//更新履歴：<br>
//2010/07/23 前田 作成
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/23
//@filesource
//@uses ManagementDetailProcBase
//
//
//error_reporting(E_ALL|E_STRICT);
//
//EV ID詳細画面Proccess
//
//@package Management
//@author maeda
//@since 2010/07/23
//@uses ManagementDetailProcBase
//@uses EvDetailView
//@uses EvDetailModel
//

require("process/Management/ManagementDetailProcBase.php");

require("model/Management/Ev/EvDetailModel.php");

require("view/Management/Ev/EvDetailView.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/23
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author maeda
//@since 2010/07/23
//
//@access protected
//@return void
//@uses EvDetailView
//
//
//各ページのModelオブジェクト取得
//
//@author maeda
//@since 2010/07/23
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses EvDetailModel
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/23
//
//@access public
//@return void
//
class EvDetailProc extends ManagementDetailProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EvDetailView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EvDetailModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};