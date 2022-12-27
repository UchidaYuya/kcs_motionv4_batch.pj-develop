//
//ショップ側成り代わり記録Ｖｉｅｗ
//
//更新履歴：<br>
//2008/08/26 中西達夫 作成
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
//ショップ側成り代わり記録Ｖｉｅｗ
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/08/26
//

require("MtSetting.php");

require("MtOutput.php");

require("model/Shop/Substitute/ShopSubstituteModel.php");

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
//protected function checkCGIParam(){
//特にチェック無し
//}
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
class ShopJokerLogView extends ViewSmarty {
	static PUB = "/Shop/Substitute";

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

	getView() {
		return this.H_View;
	}

	displaySmarty() //表示に必要な項目を設定
	//$this->get_Smarty()->assign( "js", $this->H_View["js"] );
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
		this.get_Smarty().assign("H_logdata", this.H_View.logdata);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};