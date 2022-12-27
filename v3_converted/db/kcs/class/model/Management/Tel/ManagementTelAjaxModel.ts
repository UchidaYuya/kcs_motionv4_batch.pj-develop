//
//電話管理用Ajaxモデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/05/28
//@uses ManagementTelModel
//
//
//
//電話管理用Ajaxモデル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/05/28
//@uses ManagementTelModel
//

require("model/Management/Tel/ManagementTelModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/28
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
//@since 2008/05/28
//
//@access public
//@return void
//
class ManagementTelAjaxModel extends ManagementTelModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};