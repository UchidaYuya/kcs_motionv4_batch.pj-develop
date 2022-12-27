//
//ショップ側成り代わりＶｉｅｗ
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ViewSmarty
//@package Shop
//@subpackage View
//@author nakanita
//@since 2008/02/08
//
//
//error_reporting(E_ALL);
//パンくずリンクを作る
//require_once("view/MakePageLink.php");	// ページリンクを作る
//
//ショップ側成り代わりＶｉｅｗ
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/02/08
//

require("MtSetting.php");

require("MtOutput.php");

require("model/Shop/Substitute/ShopSubstituteModel.php");

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/MakePankuzuLink.php");

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
//成り代わりを実行する
//
//@author nakanita
//@since 2008/06/03
//
//@param mixed $H_sess 成り代わり後のパラメータを含んでいる
//@access private
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
class ShopSubstituteView extends ViewSmarty {
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

	checkCGIParam() //成り代る
	{
		var sess_flg = false;

		if (undefined !== _POST.mode == true && _POST.mode == "user") //必須チェック
			{
				if (undefined !== _POST.userid_ini == false || undefined !== _POST.loginid == false || undefined !== _POST.postid == false || undefined !== _POST.postname == false || undefined !== _POST.userid_j == false || undefined !== _POST.username_j == false) // ToDo * なんとかしよう
					{
						this.errorOut(0, "ERROR: \u5FC5\u9808\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u304C\u3042\u308A\u307E\u305B\u3093(\u6210\u308A\u4EE3\u308A)");
						throw die(-1);
					}

				this.H_Local.post.mode = _POST.mode;
				this.H_Local.post.userid_ini = _POST.userid_ini;
				this.H_Local.post.loginid = _POST.loginid;
				this.H_Local.post.postid = _POST.postid;
				this.H_Local.post.postname = _POST.postname;
				this.H_Local.post.userid_j = _POST.userid_j;
				this.H_Local.post.username_j = _POST.username_j;
				sess_flg = true;
			}

		if (undefined !== _POST.mode == true && _POST.mode == "pact") //必須チェック
			{
				if (undefined !== _POST.pactid == false || undefined !== _POST.userid_ini == false || undefined !== _POST.compname == false || undefined !== _POST.groupid == false) // ToDo * なんとかしよう
					{
						this.errorOut(0, "ERROR: \u5FC5\u9808\u30D1\u30E9\u30E1\u30FC\u30BF\u30FC\u304C\u3042\u308A\u307E\u305B\u3093(\u90E8\u7F72\u9078\u629E)");
						throw die(-1);
					}

				this.H_Local.post.pactid = _POST.pactid;
				this.H_Local.post.userid_ini = _POST.userid_ini;
				this.H_Local.post.compname = _POST.compname;
				this.H_Local.post.groupid = _POST.groupid;
				sess_flg = true;
			}

		if (sess_flg == true) // ここでリロードするとValidateしなくなるぞ！
			{
				this.O_Sess.setSelfAll(this.H_Local);
				MtExceptReload.raise(undefined);
			}
	}

	makePankuzuLink() {
		var H_link = {
			"": "\u6210\u308A\u4EE3\u308F\u308A"
		};
		var O_link = new MakePankuzuLink();
		return O_link.makePankuzuLinkHTML(H_link, "shop", true);
	}

	getHeaderJS() // ToDo *
	{}

	doNarikawari(H_sess) //セッション値のチェック
	//販売店管理記録へ書き込み
	//成り代り後のユーザ名は成り代わりを行ったユーザ名にする
	//成り代わり判定を示す
	{
		if (H_sess.userid_ini == "" || H_sess.loginid == "" || H_sess.groupid == "") //print "DEBUG: userid_ini=" . $H_sess["userid_ini"] . ", loginid=" , $H_sess["loginid"] . "<br/>";
			{
				this.errorOut(0, "ShopSubstituteProc::doNarikawari, \u5FC5\u8981\u306A\u30BB\u30C3\u30B7\u30E7\u30F3\u5024\u304C\u7121\u3044");
				throw die(1);
			}

		if (basename(_SERVER.HTTP_REFERER) != basename(_SERVER.PHP_SELF)) {
			this.errorOut(0, "ShopSubstituteProc::doNarikawari, \u4E0D\u6B63\u306A\u6210\u308A\u4EE3\u308F\u308A\u30A2\u30AF\u30BB\u30B9");
			throw die(1);
		}

		var O_submodel = new ShopSubstituteModel();
		O_submodel.writeJokerLog(H_sess, _SESSION);
		var H_mnglog = {
			shopid: this.gSess().shopid,
			groupid: this.gSess().groupid,
			memid: this.gSess().memid,
			name: this.gSess().personname,
			postcode: this.gSess().postcode,
			comment1: "ID:" + this.gSess().memid,
			comment2: H_sess.compname + " " + H_sess.postname + " " + H_sess.username_j + "\u306B\u6210\u308A\u4EE3\u308A",
			kind: "Substitute",
			type: "\u30B7\u30E7\u30C3\u30D7\u30E6\u30FC\u30B6\u6210\u308A\u4EE3\u308A",
			joker_flag: 0
		};
		this.getOut().writeShopMnglog(H_mnglog);

		require("MtLogin.php");

		var loginname = "KCS Motion\u904B\u55B6\u4FC2";
		var O_login = MtLogin.singleton();
		O_login.JokerLogin(H_sess.userid_ini, H_sess.loginid, H_sess.groupid, loginname);
		_SESSION.narikawari = "on";
		header("Location: /Menu/menu.php");
	}

	displaySmarty() //表示に必要な項目を設定
	{
		this.get_Smarty().assign("title", this.H_View.title);
		this.get_Smarty().assign("shop_submenu", this.H_View.page_path);
		this.get_Smarty().assign("shop_person", this.H_View.shop_person);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("H_pactdata", this.H_View.pactdata);

		if (undefined !== this.H_View.pactid == true) {
			this.get_Smarty().assign("curpactid", this.H_View.pactid);
			this.get_Smarty().assign("H_userdata", this.H_View.userdata);
		}

		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};