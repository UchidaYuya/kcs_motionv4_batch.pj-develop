//
//運送ID削除Proccess
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementDelProcBase
//@uses TransitDelView
//@uses TransitDelModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送ID削除Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@uses ManagementDelProcBase
//@uses TransitDelView
//@uses TransitDelModel
//

require("process/Management/ManagementDelProcBase.php");

require("model/Management/Healthcare/HealthcareDelModel.php");

require("view/Management/Healthcare/HealthcareDelView.php");

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
//@uses TransitDelView
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
//@uses TransitDelModel
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
class HealthcareDelProc extends ManagementDelProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new HealthcareDelView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new HealthcareDelModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};