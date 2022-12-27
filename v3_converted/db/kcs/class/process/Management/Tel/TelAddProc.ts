//
//電話新規登録Proccess
//
//更新履歴：<br>
//2008/05/30 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/30
//@filesource
//@uses ManagementAddProcBase
//@uses TelAddView
//@uses TelAddModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//電話新規登録Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/30
//@uses ManagementAddProcBase
//@uses TelAddView
//@uses TelAddModel
//

require("process/Management/ManagementAddProcBase.php");

require("model/Management/Tel/TelAddModel.php");

require("view/Management/Tel/TelAddView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/30
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/05/30
//
//@access protected
//@return void
//@uses TelAddView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/05/30
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TelAddModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/30
//
//@access public
//@return void
//
class TelAddProc extends ManagementAddProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TelAddView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new TelAddModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};