//
//資産変更Process
//
//更新履歴：<br>
//2008/08/18 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@filesource
//@uses ManagementModProcBase
//@uses AssetsModView
//@uses AssetsModModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//資産変更Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@uses ManagementModProcBase
//@uses AssetsModView
//@uses AssetsModModel
//

require("process/Management/ManagementModProcBase.php");

require("model/Management/Assets/AssetsModModel.php");

require("view/Management/Assets/AssetsModView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/18
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return void
//@uses AssetsModView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/08/18
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses AssetsModModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/18
//
//@access public
//@return void
//
class AssetsModProc extends ManagementModProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AssetsModView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new AssetsModModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};