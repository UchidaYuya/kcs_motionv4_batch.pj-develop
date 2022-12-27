//
//ETC新規登録Proccess
//
//更新履歴：<br>
//2008/04/02 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/02
//@filesource
//@uses ManagementAddProcBase
//@uses EtcAddView
//@uses EtcAddModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ETC新規登録Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/02
//@uses ManagementAddProcBase
//@uses EtcAddView
//@uses EtcAddModel
//

require("process/Management/ManagementAddProcBase.php");

require("model/Management/ETC/EtcAddModel.php");

require("view/Management/ETC/EtcAddView.php");

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
//@uses EtcAddView
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
//@uses EtcAddModel
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
class EtcAddProc extends ManagementAddProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EtcAddView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EtcAddModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};