//
//ETC詳細画面Proccess
//
//更新履歴：<br>
//2008/03/21 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/21
//@filesource
//@uses ManagementDetailProcBase
//@uses EtcDetailView
//@uses EtcDetailModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ETC詳細画面Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/03/21
//@uses ManagementDetailProcBase
//@uses EtcDetailView
//@uses EtcDetailModel
//

require("process/Management/ManagementDetailProcBase.php");

require("model/Management/ETC/EtcDetailModel.php");

require("view/Management/ETC/EtcDetailView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/21
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/03/21
//
//@access protected
//@return void
//@uses EtcDetailView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/03/21
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses EtcDetailModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/21
//
//@access public
//@return void
//
class EtcDetailProc extends ManagementDetailProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new EtcDetailView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new EtcDetailModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};