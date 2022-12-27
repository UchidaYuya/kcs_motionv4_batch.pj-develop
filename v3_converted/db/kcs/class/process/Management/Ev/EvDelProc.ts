//
//EV ID削除Proccess
//
//更新履歴：<br>
//2010/07/27 前田 作成
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/27
//@filesource
//@uses ManagementDelProcBase
//@uses EvDelView
//@uses EvDelModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//EV ID削除Proccess
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/27
//@uses ManagementDelProcBase
//@uses EvDelView
//@uses EvDelModel
//

require("process/Management/ManagementDelProcBase.php");

require("model/Management/Ev/EvDelModel.php");

require("view/Management/Ev/EvDelView.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/27
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author maeda
//@since 2010/07/27
//
//@access protected
//@return void
//@uses EvDelView
//
//
//各ページのModelオブジェクト取得
//
//@author maeda
//@since 2010/07/27
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses EvDelModel
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/27
//
//@access public
//@return void
//
class EvDelProc extends ManagementDelProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EvDelView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EvDelModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};