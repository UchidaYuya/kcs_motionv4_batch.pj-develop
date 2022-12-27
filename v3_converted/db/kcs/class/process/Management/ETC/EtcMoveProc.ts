//
//ETC移動Process
//
//更新履歴：<br>
//2008/04/02 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/02
//@filesource
//@uses ManagementMoveProcBase
//@uses EtcMoveView
//@uses EtcMoveModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ETC移動Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/02
//@uses ManagementMoveProcBase
//@uses EtcMoveView
//@uses EtcMoveModel
//

require("process/Management/ManagementMoveProcBase.php");

require("model/Management/ETC/EtcMoveModel.php");

require("view/Management/ETC/EtcMoveView.php");

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
//@uses EtcMoveView
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
//@uses EtcMoveModel
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
class EtcMoveProc extends ManagementMoveProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EtcMoveView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EtcMoveModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};