//
//コピー機移動Proccess
//
//更新履歴：<br>
//2008/05/14 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@filesource
//@uses ManagementMoveProcBase
//@uses CopyMoveView
//@uses CopyMoveModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//コピー機移動Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@uses ManagementMoveProcBase
//@uses CopyMoveView
//@uses CopyMoveModel
//

require("process/Management/ManagementMoveProcBase.php");

require("model/Management/Copy/CopyMoveModel.php");

require("view/Management/Copy/CopyMoveView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/05/14
//
//@access protected
//@return void
//@uses CopyMoveView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses CopyMoveModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/14
//
//@access public
//@return void
//
class CopyMoveProc extends ManagementMoveProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new CopyMoveView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new CopyMoveModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};