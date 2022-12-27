//
//運送ID移動Proccess
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementMoveProcBase
//@uses TransitMoveView
//@uses TransitMoveModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送ID移動Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@uses ManagementMoveProcBase
//@uses TransitMoveView
//@uses TransitMoveModel
//

require("process/Management/ManagementMoveProcBase.php");

require("model/Management/Healthcare/HealthcareMoveModel.php");

require("view/Management/Healthcare/HealthcareMoveView.php");

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
//@uses TransitMoveView
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
//@uses TransitMoveModel
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
class HealthcareMoveProc extends ManagementMoveProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new HealthcareMoveView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new HealthcareMoveModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};