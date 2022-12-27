//
//利用者グラフ画像表示Procクラス
//
//更新履歴：<br>
//2008/12/18 宝子山浩平 作成
//
//@package Graph
//@subpackage Proccess
//@author houshiyama
//@since 2008/12/18
//@filesource
//@uses GraphChartProcBase
//@uses RecomUserGraphView
//@uses RecomUserGraphModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//利用者グラフ画像表示Procクラス
//
//@package Graph
//@subpackage Proccess
//@author houshiyama
//@since 2008/12/18
//@uses GraphChartProcBase
//@uses RecomUserGraphView
//@uses RecomUserGraphModel
//

require("process/Graph/GraphChartProcBase.php");

require("view/Graph/RecomShopUseGraphChartView.php");

require("model/Graph/RecomUseGraphModel.php");

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
class RecomShopUseGraphChartProc extends GraphChartProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new RecomShopUseGraphChartView(H_param);
	}

	get_Model(H_g_sess: {} | any[]) {
		return new RecomUseGraphModel(this.get_DB(), H_g_sess);
	}

	__destruct() {
		super.__destruct();
	}

};