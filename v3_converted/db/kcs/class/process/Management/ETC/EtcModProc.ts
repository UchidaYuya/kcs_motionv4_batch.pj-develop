//
//ETC変更Proccess
//
//更新履歴：<br>
//2008/04/02 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/02
//@filesource
//@uses ManagementModProcBase
//@uses EtcModView
//@uses EtcModModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ETC変更Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/02
//@uses ManagementModProcBase
//@uses EtcModView
//@uses EtcModModel
//

require("process/Management/ManagementModProcBase.php");

require("model/Management/ETC/EtcModModel.php");

require("view/Management/ETC/EtcModView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/04/02
//
//@access protected
//@return void
//@uses EtcModView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses EtcModModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/02
//
//@access public
//@return void
//
class EtcModProc extends ManagementModProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EtcModView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EtcModModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};