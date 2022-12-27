//
//ショップスーパーユーザー権限作成
//
//更新履歴：<br>
//2008/12/02 中西達夫 作成
//
//@uses ViewSmarty
//@package Admin
//@subpackage Shop
//@author nakanita
//@since 2008/12/02
//
//
//error_reporting(E_ALL);
//
//ショップスーパーユーザー権限作成
//
//@uses ViewSmarty
//@package Admin
//@subpackage Shop
//@author nakanita
//@since 2008/12/02
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//ディレクトリ名
//
//セッションを付加するターゲットページ名
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
//@since 2008/12/02
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
//現行管理者のグループIDを得る
//
//@author nakanita
//@since 2008/12/03
//
//@access public
//@return void
//
//
//makeAuthForm
//
//@author nakanita
//@since 2008/05/22
//
//@param mixed $H_allauth
//@access public
//@return void
//
//
//フォーム（権限チェックボックス）のデフォルト値を返す
//
//@author nakanita
//@since 2008/06/05
//
//@param mixed $H_allauth
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
//public function makeAuthRule(){
//// 特になし
//}
//
//ターゲットページにセッションを付加する
//
//@author nakanita
//@since 2008/12/02
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//Smartyを用いた画面表示
//
//@author nakanita
//@since 2008/12/02
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
class ShopSUAddView extends ViewSmarty {
	static PUB = "/Admin/Shop";
	static TGT_SESS = "/Admin/Shop/shop_add.php";

	constructor(H_param: {} | any[] = Array()) //ショップ属性を付ける
	//$this->H_Dir = $this->O_Sess->getPub( self::PUB );
	{
		H_param.site = ViewBaseHtml.SITE_ADMIN;
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

	checkCGIParam() //初回に引数からgroupidを取得
	{
		var sess_flg = false;

		if (undefined !== _GET.groupid == true && is_numeric(_GET.groupid)) //セッションに入れる
			{
				this.H_Local.get.groupid = _GET.groupid;
				sess_flg = true;
			}

		if (undefined !== _GET.frozen == true && is_numeric(_GET.frozen)) //セッションに入れる
			{
				this.H_Local.get.frozen = _GET.frozen;
				sess_flg = true;
			}

		if (undefined !== _POST.mode == true && _POST.mode == "update") //var_dump( $_POST ); exit(0); // * DEBUG * チェックボックス値は、チェックしないと飛んでこないようだ。
			//POST値を取得する前に、前回のセッション値をクリアーしておく
			//modeも忘れずに
			//ここで引数のモードはクリアーする
			//セッションに入れる
			{
				if (undefined !== this.H_Local.post == true) //foreach( $this->H_Local["post"] as $key => $val ){
					//print $key . " => " . $val . "<br>";
					//}
					{
						delete this.H_Local.post;
					}

				if (Array.isArray(_POST.fnccheck) == true) {
					{
						let _tmp_0 = _POST.fnccheck;

						for (var key in _tmp_0) {
							var val = _tmp_0[key];
							this.H_Local.post[key] = val.trim();
						}
					}
				}

				this.H_Local.post.mode = _POST.mode;
				delete _POST.mode;
				sess_flg = true;
			}

		if (sess_flg == true) //MtExceptReload::raise( null );
			// ここでリロードするとValidateしなくなるぞ！
			{
				this.O_Sess.setSelfAll(this.H_Local);
			}
	}

	getAdminGroupId() {
		return this.O_Sess.admin_groupid;
	}

	makeAuthForm(H_allauth, disabled = 0) //フォーム要素の配列作成
	//権限チェックフォームの追加
	//全ての権限についてチェックボックスを作成する
	//クイックフォームオブジェクト生成
	{
		var A_formelement = [{
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
		}];
		var H_funcs = Array();

		if (Array.isArray(H_allauth) == true) {
			for (var A_auth of Object.values(H_allauth)) //ininame => 権限名称、というチェックボックスを作成する
			//各チェックボックスを上手い具合にdivで囲って表組みに出すテクニック
			{
				H_funcs[A_auth.ininame] = A_auth.fncname + "</div><div style=\"width:200px; float:left\">";
			}
		}

		if (disabled == 1) {
			var H_options = {
				disabled: true
			};
		} else {
			H_options = Array();
		}

		A_formelement.push({
			name: "fnccheck",
			label: "\u6A29\u9650\u30C1\u30A7\u30C3\u30AF",
			inputtype: "groupcheckbox",
			data: H_funcs,
			options: H_options
		});
		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	defaultAuthForm(H_allauth) //ターゲットページのセッションから値を取得する、セッションを直接操作
	{
		var def_value = Array();

		if (undefined !== _SESSION[ShopSUAddView.TGT_SESS + ",fnccheck"] == true && Array.isArray(_SESSION[ShopSUAddView.TGT_SESS + ",fnccheck"]) == true) {
			var H_auth = _SESSION[ShopSUAddView.TGT_SESS + ",fnccheck"];

			for (var key in H_auth) {
				var val = H_auth[key];
				def_value.fnccheck[key] = "checked";
			}
		} else //まだセッションが無かったとき
			//引数で与えた権限は全てチェックONにする
			{
				for (var A_row of Object.values(H_allauth)) {
					def_value.fnccheck[A_row.ininame] = "checked";
				}
			}

		this.H_View.O_FormUtil.setDefaultsWrapper(def_value);
	}

	setAuthSession(H_sess) //$H_sessの中からfnc_の付いたものをコピーする
	//var_dump( $H_auth );
	//ターゲットページのセッションに値を追加する、セッションを直接操作
	{
		var H_auth = Array();

		for (var key in H_sess) //print $key . " : " . $val . "\n";
		{
			var val = H_sess[key];

			if (preg_match("/^fnc_/", key) == true) {
				H_auth[key] = val;
			}
		}

		_SESSION[ShopSUAddView.TGT_SESS + ",fnccheck"] = H_auth;
	}

	displaySmarty() //表示に必要な項目を設定
	//$this->get_Smarty()->assign( "title", $this->H_View['title'] );
	//$this->get_Smarty()->assign( "shop_submenu", $this->H_View['page_path'] );
	//$this->get_Smarty()->assign( "shop_person",  $this->H_View['shop_person'] );
	//$this->get_Smarty()->assign( "js", $this->H_View["js"] );
	//フォームを表示
	//QuickFormとSmartyの合体
	//表示
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("changed", this.H_View.changed);
		this.get_Smarty().assign("frozen", this.H_View.frozen);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};