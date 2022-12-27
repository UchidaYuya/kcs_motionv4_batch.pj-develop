//
//EV ID新規登録Process
//
//更新履歴：<br>
//2010/07/29 前田 作成
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/29
//@filesource
//@uses ManagementAddProcBase
//@uses EvAddView
//@uses EvAddModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//EV ID新規登録Process
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/29
//@uses ManagementAddProcBase
//@uses EvAddView
//@uses EvAddModel
//

require("process/Management/ManagementAddProcBase.php");

require("model/Management/Ev/EvAddModel.php");

require("view/Management/Ev/EvAddView.php");

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
//各ページのViewオブジェクト取得
//
//@author maeda
//@since 2010/07/29
//
//@access protected
//@return void
//@uses EvAddView
//
//
//各ページのModelオブジェクト取得
//
//@author maeda
//@since 2010/07/29
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses EvAddModel
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
class EvAddProc extends ManagementAddProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EvAddView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EvAddModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};