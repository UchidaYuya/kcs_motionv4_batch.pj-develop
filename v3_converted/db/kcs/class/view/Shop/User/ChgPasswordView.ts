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

require("view/ViewFinish.php");

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
//makePassForm
//
//@author nakanita
//@since 2008/05/22
//
//@param mixed $H_user
//@access public
//@return void
//
//
//フォームのデフォルト値を返す
//
//@author nakanita
//@since 2008/06/10
//
//@param mixed $H_user
//@access public
//@return void
//
//
//makePassRule
//
//@author nakanita
//@since 2008/05/22
//@access public
//@return void
//
//
//入力値のチェックを行う
//
//@author nakanita
//@since 2008/06/12
//
//@param mixed $old_passwd
//@param mixed $new_passwd
//@param mixed $H_user
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
//完了画面の表示を行う
//
//@author nakanita
//@since 2008/06/12
//
//@param mixed $shopid
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
class ChgPasswordView extends ViewSmarty {
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

	getView() {
		return this.H_View;
	}

	checkCGIParam() //CGIパラメーターをセッションに入れる
	{
		var sess_flg = false;

		if (undefined !== _POST.personname == true && _POST.personname != "") {
			this.H_Local.post.personname = _POST.personname;
			sess_flg = true;
		}

		if (undefined !== _POST.mail == true && _POST.mail != "") {
			this.H_Local.post.mail = _POST.mail;
			sess_flg = true;
		}

		if (undefined !== _POST.old_passwd == true && _POST.old_passwd != "") {
			this.H_Local.post.old_passwd = _POST.old_passwd;
			sess_flg = true;
		}

		if (undefined !== _POST.passwd == true && _POST.passwd != "") {
			this.H_Local.post.passwd = _POST.passwd;
			sess_flg = true;
		}

		if (undefined !== _POST.passwd2 == true && _POST.passwd2 != "") {
			this.H_Local.post.passwd2 = _POST.passwd2;
			sess_flg = true;
		}

		if (undefined !== _POST.shopid == true && _POST.shopid != "" || undefined !== _POST.memid == true && _POST.memid != "") //まだ更新しない
			{
				if (undefined !== _POST.shopid == true && _POST.shopid != "") {
					this.H_Local.post.shopid = _POST.shopid;
					sess_flg = true;
				}

				if (undefined !== _POST.memid == true && _POST.memid != "") {
					this.H_Local.post.memid = _POST.memid;
					sess_flg = true;
				}

				this.H_Local.select_flg = true;
			} else //更新する
			{
				this.H_Local.select_flg = false;
			}

		if (sess_flg == true) //MtExceptReload::raise( null );
			// ここでリロードするとValidateしなくなるぞ！
			{
				this.O_Sess.setSelfAll(this.H_Local);
			}
	}

	makePankuzuLinkHash() // ToDo * まだ使っていない
	{
		var H_link = {
			"/Shop/menu.php": "\u30D1\u30B9\u30EF\u30FC\u30C9\u5909\u66F4"
		};
		return H_link;
	}

	getHeaderJS() // ToDo * まだ使っていない
	{}

	makePassForm(H_user) //フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	{
		var A_formelement = [{
			name: "loginid",
			label: H_user.loginid,
			inputtype: "header"
		}, {
			name: "submitName",
			label: "\u5909\u66F4\u3059\u308B",
			inputtype: "submit"
		}, {
			name: "cancel",
			label: "\u30E1\u30CB\u30E5\u30FC\u306B\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:ask_cancel()"
			}
		}, {
			name: "personname",
			label: "\u540D\u524D",
			inputtype: "text",
			options: {
				size: 40
			}
		}, {
			name: "mail",
			label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
			inputtype: "text",
			options: {
				size: 40
			}
		}, {
			name: "old_passwd",
			label: "\u73FE\u5728\u306E\u30D1\u30B9\u30EF\u30FC\u30C9",
			inputtype: "password"
		}, {
			name: "passwd",
			label: "\u65B0\u3057\u3044\u30D1\u30B9\u30EF\u30FC\u30C9",
			inputtype: "password"
		}, {
			name: "passwd2",
			label: "\u65B0\u3057\u3044\u30D1\u30B9\u30EF\u30FC\u30C9\u78BA\u8A8D",
			inputtype: "password"
		}];
		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	defaultPassForm(H_user) {
		var def_value = Array();
		def_value.personname = H_user.username;
		def_value.mail = H_user.mail;
		return def_value;
	}

	makePassRule() //パスワードの最小長さを決める
	//とりあえず固定で入れた
	{
		var pass_length = 6;
		var A_rule = [{
			name: "passwd",
			mess: "\u30D1\u30B9\u30EF\u30FC\u30C9\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u6570\u5B57\u3001\u534A\u89D2\u30A2\u30EB\u30D5\u30A1\u30D9\u30C3\u30C8\u306E\u307F\u3067\u3059",
			type: "regex",
			format: "/^[a-zA-Z0-9]+$/",
			validation: "client"
		}, {
			name: "passwd",
			mess: "\u30D1\u30B9\u30EF\u30FC\u30C9\u306F" + pass_length + "\u6587\u5B57\u4EE5\u4E0A\u300130\u6587\u5B57\u4EE5\u5185\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "rangelength",
			format: [pass_length, 30],
			validation: "client"
		}, {
			name: ["passwd", "passwd2"],
			mess: "\u78BA\u8A8D\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093",
			type: "compare",
			format: undefined,
			validation: "client"
		}, {
			name: ["old_passwd", "passwd"],
			mess: "\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u5909\u66F4\u3055\u308C\u3066\u3044\u307E\u305B\u3093",
			type: "compare",
			format: "neq",
			validation: "client"
		}];
		this.H_View.O_FormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.H_View.O_FormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.H_View.O_FormUtil.makeFormRule(A_rule);
	}

	checkInputError(old_passwd, new_passwd, H_user) //入力が空の場合はチェックしない、初回アクセス時のため
	//パスワードが前回のものと同じ
	{
		if (old_passwd == "") {
			return;
		}

		var O_crypt = MtCryptUtil.singleton();

		if (is_null(old_passwd) == false || old_passwd != "") {
			var old_pass_crypt = O_crypt.getCrypt(old_passwd);
		} else {
			old_pass_crypt = "";
		}

		if (old_pass_crypt != H_user.passwd) {
			this.H_View.O_FormUtil.setElementErrorWrapper("old_passwd", "\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u9055\u3044\u307E\u3059");
		}

		if (is_null(new_passwd) == false || new_passwd != "") {
			var new_pass_crypt = O_crypt.getCrypt(new_passwd);
		} else {
			new_pass_crypt = "";
		}

		if (new_pass_crypt == H_user.passwd2nd) {
			this.H_View.O_FormUtil.setElementErrorWrapper("passwd", "\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u524D\u56DE\u306E\u3082\u306E\u3068\u540C\u3058\u3067\u3059");
		}

		if (new_pass_crypt == H_user.passwd3rd) {
			this.H_View.O_FormUtil.setElementErrorWrapper("passwd", "\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u524D\u3005\u56DE\u306E\u3082\u306E\u3068\u540C\u3058\u3067\u3059");
		}
	}

	displaySmarty() //表示に必要な項目を設定
	//包括対応 20081212miya
	//フォームを表示
	//QuickFormとSmartyの合体
	//表示
	{
		this.get_Smarty().assign("title", this.H_View.title);
		this.get_Smarty().assign("shop_submenu", this.H_View.page_path);
		this.get_Smarty().assign("shop_person", this.H_View.shop_person);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("changed", this.H_View.changed);
		this.get_Smarty().assign("H_support", this.H_View.H_support);
		this.get_Smarty().assign("H_member", this.H_View.H_member);
		this.get_Smarty().assign("selected_shopid", this.H_View.selected_shopid);
		this.get_Smarty().assign("selected_memid", this.H_View.selected_memid);
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	endView(shopid) //セッションクリア
	//2重登録防止メソッド
	//$this->writeLastForm();
	//完了画面表示 * 別画面に飛ぶのは止めにした。
	//$O_finishView = new ViewFinish( $shopid );
	//$O_finishView->displayFinish("パスワード変更", "/Shop/menu.php", "メニューに戻る" );
	{
		this.O_Sess.clearSessionSelf();
	}

	__destruct() {
		super.__destruct();
	}

};