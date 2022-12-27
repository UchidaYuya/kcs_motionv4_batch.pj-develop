//
//電話予約詳細画面Proccess
//
//更新履歴：<br>
//2008/08/24 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/24
//@filesource
//@uses ManagementDetailProcBase
//
//
//error_reporting(E_ALL|E_STRICT);
//
//電話予約詳細画面Proccess
//
//@package Management
//@author houshiyama
//@since 2008/08/24
//@uses ManagementDetailProcBase
//@uses TelReserveDetailView
//@uses TelReserveDetailModel
//

require("process/Management/ManagementDetailProcBase.php");

require("model/Management/Tel/TelReserveDetailModel.php");

require("view/Management/Tel/TelReserveDetailView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/24
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/08/24
//
//@access protected
//@return void
//@uses TelReserveDetailView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/08/24
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses TelReserveDetailModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/24
//
//@access public
//@return void
//
class TelReserveDetailProc extends ManagementDetailProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new TelReserveDetailView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new TelReserveDetailModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};