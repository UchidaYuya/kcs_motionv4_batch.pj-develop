//
//EV ID移動Proccess
//
//更新履歴：<br>
//2010/07/28 前田 作成
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/28
//@filesource
//@uses ManagementMoveProcBase
//@uses EvMoveView
//@uses EvMoveModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//EV ID移動Proccess
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/28
//@uses ManagementMoveProcBase
//@uses EvMoveView
//@uses EvMoveModel
//

require("process/Management/ManagementMoveProcBase.php");

require("model/Management/Ev/EvMoveModel.php");

require("view/Management/Ev/EvMoveView.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/28
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author maeda
//@since 2010/07/28
//
//@access protected
//@return void
//@uses EvMoveView
//
//
//各ページのModelオブジェクト取得
//
//@author maeda
//@since 2010/07/28
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses EvMoveModel
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/28
//
//@access public
//@return void
//
class EvMoveProc extends ManagementMoveProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EvMoveView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EvMoveModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};