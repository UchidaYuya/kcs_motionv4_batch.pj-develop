//
//管理情報移動Proccess
//
//更新履歴：<br>
//2008/03/17 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/17
//@filesource
//@uses ManagementMoveProcBase
//@uses ManagementMoveView
//@uses ManagementMoveModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//管理情報移動Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/17
//@uses ManagementMoveProcBase
//@uses ManagementMoveView
//@uses ManagementMoveModel
//

require("process/Management/ManagementMoveProcBase.php");

require("model/Management/ManagementMoveModel.php");

require("view/Management/ManagementMoveView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/03/17
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/17
//
//@access public
//@return void
//
class ManagementMoveProc extends ManagementMoveProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ManagementMoveView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new ManagementMoveModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};