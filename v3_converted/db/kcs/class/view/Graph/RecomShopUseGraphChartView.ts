//
//利用状況グラフviewクラス
//
//更新履歴：<br>
//2008/12/18 宝子山浩平 作成
//
//@package Graph
//@subpackage View
//@author houshiyama
//@since 2008/12/18
//@filesource
//@uses ViewSmarty
//
//
//error_reporting(E_ALL);
//
//利用状況グラフviewクラス
//
//@package Graph
//@subpackage View
//@author houshiyama
//@since 2008/12/18
//@uses ViewSmarty
//

require("view/Graph/RecomUseGraphChartView.php");

//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
//@uses ManagementUtil
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
class RecomShopUseGraphChartView extends RecomUseGraphChartView {
	constructor(H_param) //元ページのURL
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.H_Local = this.O_Sess.getSelfAll();
		this.ParentURL = "/Shop/Graph/RecomUseGraph.php";
	}

	__destruct() {
		super.__destruct();
	}

};