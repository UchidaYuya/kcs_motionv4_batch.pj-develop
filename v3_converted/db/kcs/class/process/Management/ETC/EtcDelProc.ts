//
//ETC削除Proccess
//
//更新履歴：<br>
//2008/04/01 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/01
//@filesource
//@uses ManagementDelProcBase
//@uses EtcDelView
//@uses EtcDelModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ETC削除Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/01
//@uses ManagementDelProcBase
//@uses EtcDelView
//@uses EtcDelModel
//

require("process/Management/ManagementDelProcBase.php");

require("model/Management/ETC/EtcDelModel.php");

require("view/Management/ETC/EtcDelView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/01
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/04/01
//
//@access protected
//@return void
//@uses EtcDelView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/04/01
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses EtcDelModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/01
//
//@access public
//@return void
//
class EtcDelProc extends ManagementDelProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EtcDelView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EtcDelModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};