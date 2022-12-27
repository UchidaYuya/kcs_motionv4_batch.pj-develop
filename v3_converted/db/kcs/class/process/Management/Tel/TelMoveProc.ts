//
//電話移動Process
//
//更新履歴：<br>
//2008/06/16 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/06/16
//@filesource
//@uses ManagementMoveProcBase
//@uses TelMoveView
//@uses TelMoveModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//電話移動Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/06/16
//@uses ManagementMoveProcBase
//@uses TelMoveView
//@uses TelMoveModel
//

require("process/Management/ManagementMoveProcBase.php");

require("model/Management/Tel/TelMoveModel.php");

require("view/Management/Tel/TelMoveView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/16
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/06/16
//
//@access protected
//@return void
//@uses TelMoveView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/06/16
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TelMoveModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/06/16
//
//@access public
//@return void
//
class TelMoveProc extends ManagementMoveProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TelMoveView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new TelMoveModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};