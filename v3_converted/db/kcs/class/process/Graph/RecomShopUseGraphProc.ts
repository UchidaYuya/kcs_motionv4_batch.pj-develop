//
//利用者グラフProcクラス（shop用）
//
//更新履歴：<br>
//2008/12/18 宝子山浩平 作成
//
//@package Graph
//@subpackage Proccess
//@author houshiyama
//@since 2008/12/18
//@filesource
//@uses ProcessBaseHtml
//@uses RecomUserGraphView
//@uses RecomUserGraphModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//利用者グラフProcクラス（shop用）
//
//@package Graph
//@subpackage Proccess
//@author houshiyama
//@since 2008/12/18
//@uses ProcessBaseHtml
//@uses RecomUserGraphView
//@uses RecomUserGraphModel
//

require("process/Graph/GraphProcBase.php");

require("model/Graph/RecomUseGraphModel.php");

require("view/Graph/RecomShopUseGraphView.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/12/18
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author houshiyama
//@since 2008/12/18
//
//@access protected
//@return void
//@uses RecomUserGraphView
//
//
//各ページのモデル取得
//
//@author houshiyama
//@since 2008/12/18
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//@uses RecomUserGraphModel
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
//
class RecomShopUseGraphProc extends GraphProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new RecomShopUseGraphView();
	}

	get_Model(H_g_sess: {} | any[], O_manage) {
		return new RecomUseGraphModel(this.get_DB(), H_g_sess, O_manage);
	}

	__destruct() {
		super.__destruct();
	}

};