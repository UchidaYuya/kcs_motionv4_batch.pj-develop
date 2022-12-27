//
//電話変更Process
//
//更新履歴：<br>
//2008/06/10 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/06/10
//@filesource
//@uses ManagementModProcBase
//@uses TelModView
//@uses TelModModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//電話変更Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/06/10
//@uses ManagementModProcBase
//@uses TelModView
//@uses TelModModel
//

require("process/Management/ManagementModProcBase.php");

require("model/Management/Tel/TelModModel.php");

require("view/Management/Tel/TelModView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/10
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/06/10
//
//@access protected
//@return void
//@uses TelModView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/06/10
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TelModModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/06/10
//
//@access public
//@return void
//
class TelModProc extends ManagementModProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TelModView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new TelModModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};