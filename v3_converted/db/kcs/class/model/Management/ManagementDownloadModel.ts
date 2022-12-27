//
//全て一覧ダウンロード用Model
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/28
//@filesource
//@uses ManagementMenuModel
//
//
//
//全て一覧ダウンロード用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/28
//@uses ManagementMenuModel
//

require("model/Management/ManagementModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/28
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/28
//
//@access public
//@return void
//
class ManagementDownloadModel extends ManagementMenuModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};