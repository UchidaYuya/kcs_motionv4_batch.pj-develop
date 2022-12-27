//
//Ｖｉｅｗ実装のサンプル
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/02/08
//
//
//error_reporting(E_ALL);
//
//Ｖｉｅｗ実装のサンプル
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/02/08
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

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
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//protected $H_Dir;
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//フォームオブジェクト
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//自身のセッションを取得する
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//登録・変更・削除処理終了時に処理タイプをセッションから削除
//
//@author miyazawa
//@since 2008/12/12
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return mixed
//
//
//ログインのチェックを行う
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//protected function checkLogin(){
//// ログインチェックを行わないときには、何もしないメソッドで親を上書きする
//}
//
//CGIパラメータのチェックを行う
//
//セッションにCGIパラメーターを付加する<br/>
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//Smartyを用いた画面表示
//
//@author nakanita
//@since 2008/02/08
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class ShopMemberView extends ViewSmarty {
	static PUB = "/Shop/User";

	constructor(H_param: {} | any[] = Array()) //ショップ属性を付ける
	//$this->H_Dir = $this->O_Sess->getPub( self::PUB );
	{
		H_param.site = ViewBaseHtml.SITE_SHOP;
		super(H_param);
		this.O_Sess = MtSession.singleton();
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getSelfSession() //$H_sess = array( self::PUB => $this->O_Sess->getPub( self::PUB ),
	//"SELF" => $this->O_Sess->getSelfAll() );
	{
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	resetSelfSessionTyp() {
		var H_sess = this.O_Sess.getSelfAll();
		delete H_sess.post.typ;
		this.O_Sess.setSelfAll(H_sess);
	}

	getView() {
		return this.H_View;
	}

	checkCGIParam() //ユーザー修正
	{
		var sess_flg = false;

		if (undefined !== _POST.typ == true && _POST.typ === "mod") //必須チェック
			{
				if (undefined !== _POST.personname == false || undefined !== _POST.mail == false || undefined !== _POST.memid == false || undefined !== _POST.idx == false) // ToDo * なんとかしよう
					{
						this.errorOut(0, "ERROR: \u5FC5\u9808\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u304C\u3042\u308A\u307E\u305B\u3093(mod)");
						throw die(-1);
					}

				this.H_Local.post.personname = _POST.personname;
				this.H_Local.post.mail = _POST.mail;
				this.H_Local.post.memid = _POST.memid;
				this.H_Local.post.idx = _POST.idx;
				this.H_Local.post.typ = _POST.typ;
				sess_flg = true;
			} else if (undefined !== _POST.typ == true && _POST.typ === "new") //必須チェック
			{
				if (undefined !== _POST.loginid == false || undefined !== _POST.personname == false || undefined !== _POST.mail == false || undefined !== _POST.passwd == false) // ToDo * なんとかしよう
					{
						this.errorOut(0, "ERROR: \u5FC5\u9808\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u304C\u3042\u308A\u307E\u305B\u3093(new)");
						throw die(-1);
					}

				this.H_Local.post.loginid = _POST.loginid;
				this.H_Local.post.personname = _POST.personname;
				this.H_Local.post.mail = _POST.mail;
				this.H_Local.post.passwd = _POST.passwd;
				this.H_Local.post.typ = _POST.typ;
				sess_flg = true;
			} else if (undefined !== _POST.typ == true && _POST.typ === "del") //必須チェック
			{
				if (undefined !== _POST.memid == false) // ToDo * なんとかしよう
					{
						this.errorOut(0, "ERROR: \u5FC5\u9808\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u304C\u3042\u308A\u307E\u305B\u3093(del)");
						throw die(-1);
					}

				this.H_Local.post.memid = _POST.memid;
				this.H_Local.post.typ = _POST.typ;
				sess_flg = true;
			}

		if ("" != _POST.shopid) {
			this.H_Local.post.shopid = _POST.shopid;
			sess_flg = true;
		}

		if (sess_flg == true) // ここでリロードするとValidateしなくなるぞ！
			{
				this.O_Sess.setSelfAll(this.H_Local);
				MtExceptReload.raise(undefined);
			}
	}

	makePankuzuLinkHash() // ToDo *
	{
		var H_link = {
			"/Management/menu.php": "\u7BA1\u7406\u60C5\u5831",
			"": "\u7BA1\u7406\u60C5\u5831\u79FB\u52D5"
		};
		return H_link;
	}

	getHeaderJS() // ToDo *
	{}

	displaySmarty() //表示に必要な項目を設定
	//包括対応 20081212miya
	//フォームを表示
	//QuickFormとSmartyの合体 -- QuickForm は使っていない
	//$O_renderer = new HTML_QuickForm_Renderer_ArraySmarty( $this->get_Smarty() );
	//$this->O_Form->accept( $O_renderer );
	//$this->get_Smarty()->assign( "O_form", $O_renderer->toArray() );
	//表示
	{
		this.get_Smarty().assign("title", this.H_View.title);
		this.get_Smarty().assign("shop_submenu", this.H_View.page_path);
		this.get_Smarty().assign("shop_person", this.H_View.shop_person);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("message", this.H_View.message);
		this.get_Smarty().assign("message2", this.H_View.message2);
		this.get_Smarty().assign("H_member", this.H_View.members);
		this.get_Smarty().assign("H_support", this.H_View.H_support);
		this.get_Smarty().assign("selected_shopid", this.H_View.selected_shopid);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};