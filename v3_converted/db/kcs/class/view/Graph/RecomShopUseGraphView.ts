//
//利用状況グラフviewクラス（shop用）
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
//利用状況グラフviewクラス（shop用）
//
//@package Graph
//@subpackage View
//@author houshiyama
//@since 2008/12/18
//@uses ViewSmarty
//

require("view/Graph/RecomUseGraphView.php");

require("MtPostUtil.php");

//
//ディレクトリ名
//
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
//Hotline側の操作に必要なグローバルセッションを返す<br/>
//
//Shopでログインしつつ、ユーザー側と共通プログラムを扱うための処理<br/>
//ここでグローバルセッションを上書きしている、成り代わりに近い<br/>
//
//@author houshiyama
//@since 2009/01/27
//
//@access public
//@return void
//
//
//パンくずリンクを返す
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
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
class RecomShopUseGraphView extends RecomUseGraphView {
	static PUB = "/Shop/Graph";

	constructor() //ショップ属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.ChartURLTuwa = "/Shop/Graph/RecomUseGraphChart.php?mode=1";
		this.ChartURLPacket = "/Shop/Graph/RecomUseGraphChart.php?mode=2";
	}

	getGlobalSession() //pactid が無ければ異常
	//現行部署が設定されていなければ付ける。初回は必ずrootが付く。
	//もしあれば、そのまま使う -- 部署ツリーで部署変更が行えるので。
	{
		if (is_null(_SESSION.pactid) == true || is_numeric(_SESSION.pactid) == false) {
			return;
		}

		var O_post_model = new PostModel();
		var root = O_post_model.getRootPostid(_SESSION.pactid);
		this.O_Sess.setGlobal("postid", root);

		if (is_null(_SESSION.current_postid) || _SESSION.current_postid == "") {
			this.O_Sess.setGlobal("current_postid", root);
		}

		if (is_null(_SESSION.compname) || _SESSION.compname == "") {
			var O_pact_model = new PactModel();
			var compname = O_pact_model.getCompname(_SESSION.pactid);
			this.O_Sess.setGlobal("compname", compname);
		}

		return _SESSION;
	}

	makePankuzuLink() {
		var H_link = {
			"/Shop/MTHotline/list.php": "\u304A\u5BA2\u69D8\u4E00\u89A7\u30FB\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
			"/Shop/MTHotline/Recom3/menu.php": "\u6599\u91D1\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
			"": "\u5229\u7528\u72B6\u6CC1\u30B0\u30E9\u30D5"
		};
		var O_link = new MakePankuzuLink();
		return O_link.makePankuzuLinkHTML(H_link, "shop");
	}

	__destruct() {
		super.__destruct();
	}

};