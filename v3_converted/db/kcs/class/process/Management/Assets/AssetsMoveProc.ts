//
//資産移動Process
//
//更新履歴：<br>
//2008/08/18 宝子山浩平 作成
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@filesource
//@uses ManagementMoveProcBase
//@uses AssetsMoveView
//@uses AssetsMoveModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//資産移動Process
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2008/08/18
//@uses ManagementMoveProcBase
//@uses AssetsMoveView
//@uses AssetsMoveModel
//

require("process/Management/ManagementMoveProcBase.php");

require("model/Management/Assets/AssetsMoveModel.php");

require("view/Management/Assets/AssetsMoveView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/18
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return void
//@uses AssetsMoveView
//
//
//各ページのModelオブジェクト取得
//
//@author houshiyama
//@since 2008/08/18
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses AssetsMoveModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/08/18
//
//@access public
//@return void
//
class AssetsMoveProc extends ManagementMoveProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AssetsMoveView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new AssetsMoveModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};