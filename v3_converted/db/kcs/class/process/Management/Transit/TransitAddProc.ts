//
//運送ID新規登録Process
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementAddProcBase
//@uses TransitAddView
//@uses TransitAddModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送ID新規登録Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@uses ManagementAddProcBase
//@uses TransitAddView
//@uses TransitAddModel
//

require("process/Management/ManagementAddProcBase.php");

require("model/Management/Transit/TransitAddModel.php");

require("view/Management/Transit/TransitAddView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//@uses TransitAddView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TransitAddModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class TransitAddProc extends ManagementAddProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TransitAddView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new TransitAddModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};