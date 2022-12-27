//
//グラフページview基底クラス
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
//ページリンクを作る
//
//グラフページview基底クラス
//
//@package Graph
//@subpackage View
//@author houshiyama
//@since 2008/12/18
//@uses ViewSmarty
//

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

require("Image/Graph.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

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
//自身のセッションを取得する
//（ここでは空を返すので継承先でおのおの取得）
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return array
//
//
//セッションが無い時デフォルト値を入れる
//
//@author houshiyama
//@since 2008/12/18
//
//@access private
//@return void
//
//
//パラメータのチェックを行う<br>
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/12/18
//
//@access public
//@return void
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
//グラフ表示ボタンのフォーム
//
//@author houshiyama
//@since 2008/12/22
//
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
//パンくずリンクを返す
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//チャートのURL生成
//
//@author houshiyama
//@since 2008/12/19
//
//@param mixed $H_param
//@access public
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/12/19
//
//@param array $H_sess
//@param array $H_data
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
class GraphViewBase extends ViewSmarty {
	static PUB = "/Graph";

	constructor(H_param) {
		this.O_Sess = MtSession.singleton();
		H_param.language = this.O_Sess.language;
		super(H_param);
	}

	getSelfSession() {
		var H_sess = this.H_Local;
		return H_sess;
	}

	setDefaultSession() {}

	checkCGIParam() {}

	getHeaderJS() {}

	checkParamError(H_sess, H_g_sess) {}

	makeViewForm() //ボタンだけのフォーム作成（ラベル、値はおのおの設定）
	//クイックフォームオブジェクト生成
	{
		var A_formelement = [{
			name: "viewbutton",
			label: this.ButtonLabel,
			inputtype: "submit"
		}, {
			name: "hidden_val",
			inputtype: "hidden",
			data: this.HiddenVal
		}];
		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	get_View() {
		return this.H_View;
	}

	makePankuzuLink() {
		var H_link = Array();
		return O_link.makePankuzuLinkHTML(H_link);
	}

	makeChartLinkURL(H_param) {}

	displaySmarty(H_sess: {} | any[], H_data: {} | any[]) //QuickFormとSmartyの合体
	//assaign
	//ページ固有の表示処理
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());

		if (this.getSiteMode() == ViewBaseHtml.SITE_SHOP) {
			this.get_Smarty().assign("shop_person", this.gSess().name + " " + this.gSess().personname);
			this.get_Smarty().assign("shop_submenu", this.H_View.pankuzu_link);
		} else {
			this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		}

		this.get_Smarty().assign("H_sess", H_sess);
		this.get_Smarty().assign("H_data", H_data);
		this.displaySmartyPeculiar(H_sess, H_data);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};