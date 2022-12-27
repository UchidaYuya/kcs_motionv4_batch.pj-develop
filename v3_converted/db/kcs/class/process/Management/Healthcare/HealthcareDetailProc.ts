//
//運送ID詳細画面Proccess
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementDetailProcBase
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送ID詳細画面Proccess
//
//@package Management
//@author houshiyama
//@since 2010/02/19
//@uses ManagementDetailProcBase
//@uses TransitDetailView
//@uses TransitDetailModel
//

require("process/Management/ManagementDetailProcBase.php");

require("model/Management/Healthcare/HealthcareDetailModel.php");

require("view/Management/Healthcare/HealthcareDetailView.php");

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
//@uses TransitDetailView
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
//@uses TransitDetailModel
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
class HealthcareDetailProc extends ManagementDetailProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new HealthcareDetailView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new HealthcareDetailModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};