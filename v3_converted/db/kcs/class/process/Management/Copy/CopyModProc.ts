//
//コピー機変更Process
//
//更新履歴：<br>
//2008/05/14 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@filesource
//@uses ManagementModProcBase
//@uses CopyModView
//@uses CopyModModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//コピー機変更Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@uses ManagementModProcBase
//@uses CopyModView
//@uses CopyModModel
//

require("process/Management/ManagementModProcBase.php");

require("model/Management/Copy/CopyModModel.php");

require("view/Management/Copy/CopyModView.php");

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
//@uses CopyModView
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
//@uses CopyModModel
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
class CopyModProc extends ManagementModProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new CopyModView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new CopyModModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};