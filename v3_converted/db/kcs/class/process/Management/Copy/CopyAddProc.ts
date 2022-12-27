//
//コピー機新規登録Process
//
//更新履歴：<br>
//2008/05/14 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@filesource
//@uses ManagementAddProcBase
//@uses CopyAddView
//@uses CopyAddModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//コピー機新規登録Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@uses ManagementAddProcBase
//@uses CopyAddView
//@uses CopyAddModel
//

require("process/Management/ManagementAddProcBase.php");

require("model/Management/Copy/CopyAddModel.php");

require("view/Management/Copy/CopyAddView.php");

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
//@uses CopyAddView
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
//@uses CopyAddModel
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
class CopyAddProc extends ManagementAddProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new CopyAddView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new CopyAddModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};