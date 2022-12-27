//
//EV ID変更Process
//
//更新履歴：<br>
//2010/07/23 前田 作成
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/23
//@filesource
//@uses ManagementModProcBase
//@uses EvModView
//@uses EvModModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//EV ID変更Process
//
//@package Management
//@subpackage Proccess
//@author maeda
//@since 2010/07/23
//@uses ManagementModProcBase
//@uses EvModView
//@uses EvModModel
//

require("process/Management/ManagementModProcBase.php");

require("model/Management/Ev/EvModModel.php");

require("view/Management/Ev/EvModView.php");

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
//@uses EvModView
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
//@uses EvModModel
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
class EvModProc extends ManagementModProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EvModView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EvModModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};