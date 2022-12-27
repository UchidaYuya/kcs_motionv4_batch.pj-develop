//
//電話詳細画面Proccess
//
//更新履歴：<br>
//2008/06/17 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/06/17
//@filesource
//@uses ManagementDetailProcBase
//
//
//error_reporting(E_ALL|E_STRICT);
//
//電話詳細画面Proccess
//
//@package Management
//@author houshiyama
//@since 2008/06/17
//@uses ManagementDetailProcBase
//@uses TelDetailView
//@uses TelDetailModel
//

require("process/Management/ManagementDetailProcBase.php");

require("model/Management/Tel/TelDetailModel.php");

require("view/Management/Tel/TelDetailView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/17
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/06/17
//
//@access protected
//@return void
//@uses TelDetailView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/06/17
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TelDetailModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/06/17
//
//@access public
//@return void
//
class TelDetailProc extends ManagementDetailProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TelDetailView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new TelDetailModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};