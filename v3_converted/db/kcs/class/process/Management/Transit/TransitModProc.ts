//
//運送ID変更Process
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementModProcBase
//@uses TransitModView
//@uses TransitModModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送ID変更Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@uses ManagementModProcBase
//@uses TransitModView
//@uses TransitModModel
//

require("process/Management/ManagementModProcBase.php");

require("model/Management/Transit/TransitModModel.php");

require("view/Management/Transit/TransitModView.php");

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
//@uses TransitModView
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
//@uses TransitModModel
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
class TransitModProc extends ManagementModProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TransitModView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new TransitModModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};