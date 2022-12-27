//
//コピー機詳細画面Proccess
//
//更新履歴：<br>
//2008/05/14 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/05/14
//@filesource
//@uses ManagementDetailProcBase
//
//
//error_reporting(E_ALL|E_STRICT);
//
//コピー機詳細画面Proccess
//
//@package Management
//@author houshiyama
//@since 2008/05/14
//@uses ManagementDetailProcBase
//@uses CopyDetailView
//@uses CopyDetailModel
//

require("process/Management/ManagementDetailProcBase.php");

require("model/Management/Copy/CopyDetailModel.php");

require("view/Management/Copy/CopyDetailView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/05/14
//
//@access protected
//@return void
//@uses CopyDetailView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses CopyDetailModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/14
//
//@access public
//@return void
//
class CopyDetailProc extends ManagementDetailProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new CopyDetailView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new CopyDetailModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};