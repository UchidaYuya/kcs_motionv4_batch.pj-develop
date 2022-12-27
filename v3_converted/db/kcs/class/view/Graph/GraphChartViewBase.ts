//
//グラフview基底クラス
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
//グラフview基底クラス
//
//@package Graph
//@subpackage View
//@author houshiyama
//@since 2008/12/18
//@uses ViewSmarty
//

require("view/ViewSmarty.php");

require("Image/Graph.php");

//
//ディレクトリ名
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//グラフ用
//
//@var mixed
//@access protected
//
//
//元ページのURL
//
//@var mixed
//@access protected
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
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
//
//
//元URLのセッションを取得する
//
//@author nakanita
//@since 2008/12/18
//
//@access public
//@return array
//
//
//パラメータチェック <br>
//
//@author houshiyama
//@since 2008/12/18
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2008/12/19
//
//@access public
//@return mixed
//
//
//グラフの元生成
//
//@author houshiyama
//@since 2008/12/19
//
//@access private
//@return void
//
//
//グラフ生成、表示
//
//@author houshiyama
//@since 2008/12/19
//
//@access public
//@return void
//
//
//グラフにデータをセット
//
//@author houshiyama
//@since 2008/12/19
//
//@param mixed $H_data
//@param mixed $O_plotarea
//@param mixed $A_tick
//@access private
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
class GraphChartViewBase extends ViewSmarty {
	static PUB = "/Graph";

	constructor(H_param) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
	}

	getLocalSession() {
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	getParentSession() {
		var H_sess = this.O_Sess.getPub(this.ParentURL);
		return H_sess;
	}

	checkParamError(H_sess, H_g_sess) {}

	get_View() {
		return this.H_View;
	}

	setGraphBase() {}

	displayChart(H_data) {}

	setGraphData(H_data, O_plotarea, A_tick) {}

	__destruct() {
		super.__destruct();
	}

};