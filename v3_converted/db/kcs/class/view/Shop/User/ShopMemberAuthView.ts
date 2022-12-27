//
//ショップメンバー権限変更
//
//更新履歴：<br>
//2008/06/04 中西達夫 作成
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
//makeAuthForm
//
//@author nakanita
//@since 2008/05/22
//
//@param mixed $H_user
//@param mixed $H_auth
//@access public
//@return void
//
//
//フォーム（権限チェックボックス）のデフォルト値を返す
//
//@author nakanita
//@since 2008/06/05
//
//@param mixed $H_auth
//@access public
//@return void
//
//
//makeAuthRule
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//checkInputError
//
//@author nakanita
//@since 2008/05/22
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
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class ShopMemberAuthView extends ViewSmarty {
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

	checkCGIParam() //初回はGETでmemidが渡される
	{
		var sess_flg = false;

		if (undefined !== _GET.memid == true) //セッションに入れる
			{
				this.H_Local.get.memid = _GET.memid;
				sess_flg = true;
			}

		if (undefined !== _GET.mode == true) //セッションに入れる
			{
				this.H_Local.get.mode = _GET.mode;
				sess_flg = true;
			}

		if (undefined !== _GET.shopid == true) //セッションに入れる
			{
				this.H_Local.get.shopid = _GET.shopid;
				sess_flg = true;
			}

		if (undefined !== _POST.mode == true && _POST.mode == "update") //var_dump( $_POST ); exit(0); // * DEBUG * チェックボックス値は、チェックしないと飛んでこないようだ。
			//POST値を取得する前に、前回のセッション値をクリアーしておく
			//modeも忘れずに
			{
				if (undefined !== this.H_Local.post == true) //foreach( $this->H_Local["post"] as $key => $val ){
					//print $key . " => " . $val . "<br>";
					//}
					{
						delete this.H_Local.post;
					}

				if (undefined !== _POST.fnccheck == true) {
					{
						let _tmp_0 = _POST.fnccheck;

						for (var key in _tmp_0) //セッションに入れる
						{
							var val = _tmp_0[key];
							this.H_Local.post[key] = val.trim();
							sess_flg = true;
						}
					}
				}

				if (undefined !== _POST.passwd == true) {
					this.H_Local.post.passwd = _POST.passwd.trim();
					sess_flg = true;
				}

				if (undefined !== _POST.passwd2 == true) {
					this.H_Local.post.passwd2 = _POST.passwd2.trim();
					sess_flg = true;
				}

				this.H_Local.post.mode = _POST.mode;
			}

		if (sess_flg == true) //MtExceptReload::raise( null );
			// ここでリロードするとValidateしなくなるぞ！
			{
				this.O_Sess.setSelfAll(this.H_Local);
			}
	}

	makeAuthForm(H_user, H_auth) //フォーム要素の配列作成
	//権限チェックフォームの追加
	//自分に権限のあるチェックボックスしか作成されない
	//クイックフォームオブジェクト生成
	{
		var A_formelement = [{
			name: "loginid",
			label: H_user.loginid,
			inputtype: "header"
		}, {
			name: "username",
			label: H_user.username,
			inputtype: "header"
		}, {
			name: "submitName",
			label: "\u5909\u66F4\u3059\u308B",
			inputtype: "submit"
		}, {
			name: "cancel",
			label: "\u9589\u3058\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:window.close()"
			}
		}, {
			name: "passwd",
			label: "\u65B0\u3057\u3044\u30D1\u30B9\u30EF\u30FC\u30C9",
			inputtype: "password"
		}, {
			name: "passwd2",
			label: "\u65B0\u3057\u3044\u30D1\u30B9\u30EF\u30FC\u30C9\u78BA\u8A8D",
			inputtype: "password"
		}];
		var H_funcs = Array();

		for (var A_auth of Object.values(H_auth)) //ショップメンバー管理は画面に出さない
		{
			if (A_auth.ininame === "fnc_const_adm") {
				continue;
			}

			if (A_auth.ininame === "fnc_substitute") {
				continue;
			}

			H_funcs[A_auth.ininame] = A_auth.fncname + "</div><div style=\"width:200px; float:left\">";
		}

		A_formelement.push({
			name: "fnccheck",
			label: "\u6A29\u9650\u30C1\u30A7\u30C3\u30AF",
			inputtype: "groupcheckbox",
			data: H_funcs
		});
		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	defaultAuthForm(H_auth) {
		var def_value = Array();

		for (var A_auth of Object.values(H_auth)) {
			if (A_auth.is_memid == true) {
				def_value.fnccheck[A_auth.ininame] = "checked";
			}
		}

		this.H_View.O_FormUtil.setDefaultsWrapper(def_value);
	}

	makeAuthRule() //パスワードの最小長さを決める
	//固定で６文字とする
	// ここでは必要なし *
	//$this->H_View["O_FormUtil"]->setJsWarningsWrapper( "以下の項目を入力してください\n", "\n正しく入力してください" );
	//$this->H_View["O_FormUtil"]->setRequiredNoteWrapper( "<font color=red>※は必須項目です</font>") ;
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
		}];
		this.H_View.O_FormUtil.makeFormRule(A_rule);
	}

	checkInputError(old_passwd, new_passwd, H_user) //入力が空の場合はチェックしない、初回アクセス時のため
	//パスワードが前回のものと同じ
	{
		if (old_passwd == "") {
			return;
		}

		var O_crypt = MtCryptUtil.singleton();
		var new_pass_cript = O_crypt.getCrypt(new_passwd);

		if (new_pass_cript == H_user.passwd2nd) {
			this.H_View.O_FormUtil.setElementErrorWrapper("passwd", "\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u524D\u56DE\u306E\u3082\u306E\u3068\u540C\u3058\u3067\u3059");
		}

		if (new_pass_cript == H_user.passwd3rd) {
			this.H_View.O_FormUtil.setElementErrorWrapper("passwd", "\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u524D\u3005\u56DE\u306E\u3082\u306E\u3068\u540C\u3058\u3067\u3059");
		}
	}

	displaySmarty() //表示に必要な項目を設定
	//$this->get_Smarty()->assign( "title", $this->H_View['title'] );
	//$this->get_Smarty()->assign( "shop_submenu", $this->H_View['page_path'] );
	//$this->get_Smarty()->assign( "shop_person",  $this->H_View['shop_person'] );
	//$this->get_Smarty()->assign( "js", $this->H_View["js"] );
	//対象となるメンバーＩＤを設定する
	//フォームを表示
	//QuickFormとSmartyの合体
	//表示
	{
		this.get_Smarty().assign("memid", this.H_View.memid);
		this.get_Smarty().assign("mode", this.H_View.mode);
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("changed", this.H_View.changed);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};