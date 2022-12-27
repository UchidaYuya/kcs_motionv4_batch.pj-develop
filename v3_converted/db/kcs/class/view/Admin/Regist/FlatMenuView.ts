//
//ShopメニューViewクラス
//
//@uses ViewSmarty
//@package ShopMenu
//@filesource
//@author houshiyama
//@since 2008/10/16
//
//
//error_reporting(E_ALL);
//
//ShopメニューViewクラス
//
//@uses ViewSmarty
//@package ShopMenu
//@author houshiyama
//@since 2008/10/16
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("MtSession.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//__construct
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//セッションが無い時デフォルト値を入れる
//
//年月セッションが無ければ作る（デフォルトは今月）<br>
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//表示件数セッションが無ければ作る（デフォルトは10）<br>
//ソート条件セッションが無ければ作る（デフォルトは部署降順）<br>
//カレントページがセッションに無ければ作る<br>
//
//@author houshiyama
//@since 2009/01/08
//
//@access private
//@return void
//
//
//パラメータのチェック <br>
//
//デフォルト値を入れる<br>
//
//表示年月の変更がされたら配列に入れる <br>
//表示件数が変更されたら配列に入れるCookieも書き換える） <br>
//ソート条件が変更されたら配列に入れる<br>
//カレントページが変更されたら配列に入れる<br>
//
//配列をセッションに入れる<br>
//ページが指定された時以外はページを１に戻す<br>
//CGIパラメータがあればリロード<br>
//
//@author nakanita
//@since 2009/01/08
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return mixed
//
//
//checkAuth
//
//@author houshiyama
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//getAuthBase
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//getAuthPact
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/03/11
//
//@access public
//@return void
//
//
//setAssign
//
//@author houshiyama
//@since 2008/10/16
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//addJs
//
//@author houshiyama
//@since 2008/10/16
//
//@param mixed $jsfile
//@access protected
//@return void
//
//
//フォーム作成<br>
//
//@author houshiyama
//@since 2008/03/30
//
//@param mixed $O_model
//@access public
//@return void
//
//
//フォームのデフォルト値を作成
//
//@author houshiyama
//@since 2008/03/30
//
//@param mixed $H_sess
//@access protected
//@return array
//
//
//メンバー変数をsmarty assign
//
//@author houshiyama
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//画面表示
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2008/10/16
//
//@access public
//@return void
//
class FlatMenuView extends ViewSmarty {
	constructor() //ショップ属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.O_Sess = MtSession.singleton();
		this.H_Local = this.O_Sess.getSelfAll();
		this.H_js = Array();
		this.H_assign = Array();
		this.clearLastForm();
	}

	setDefaultSession() //カレント部署がセッションに無ければ作る（デフォルトは自部署）
	//呼び出し元
	{
		if (undefined !== this.H_Dir.current_postid == false) {
			this.H_Dir.current_postid = _SESSION.postid;
		}

		this.H_Local.groupid = this.O_Sess.admin_groupid;
		this.H_Local.mode = "admin";
	}

	checkCGIParam() {
		this.setDefaultSession();

		if (undefined !== _GET.pactid) {
			this.H_Local.pactid = _GET.pactid;
		}

		this.O_Sess.setSelfAll(this.H_Local);

		if (_POST.length > 0 || _GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	get_View() {
		return this.H_View;
	}

	checkAuth() {
		this.checkCustomAuth();
	}

	getAuthBase() {
		return this.getAuth().getUserFuncId(this.gSess().memid);
	}

	getAuthShop() {
		return this.getAuth().getShopFuncId();
	}

	getLocalSession() {
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	addJs(jsfile) {
		if (Array.isArray(this.H_assign.H_jsfile) == false) {
			this.H_assign.H_jsfile = Array();
		}

		this.H_assign.H_jsfile.push(jsfile);
	}

	makeForm(pactid, flat_esm) //フォーム要素の配列作成
	//pactidを渡す
	//$A_formelement[] = array(	"name" => "pactid","inputtype" => "hidden"	);
	//クイックフォームオブジェクト生成
	{
		var A_formelement = Array();

		if (!!flat_esm) {
			A_formelement.push({
				name: "flat_esm_change",
				label: "\u5909\u66F4",
				inputtype: "button",
				options: {
					onClick: "doTranslate('mod'," + pactid + ")"
				}
			});
			A_formelement.push({
				name: "flat_esm_delete",
				label: "\u524A\u9664",
				inputtype: "button",
				options: {
					onClick: "doTranslate('del'," + pactid + ")"
				}
			});
		} else {
			A_formelement.push({
				name: "flat_esm_new",
				label: "\u65B0\u898F\u767B\u9332",
				inputtype: "button",
				options: {
					onClick: "doTranslate('add'," + pactid + ")"
				}
			});
		}

		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	makeDefaultValue(H_sess: {} | any[]) {
		var H_default = Array();
		H_default.pactid = H_sess.pactid;
		return H_default;
	}

	assignSmarty() {
		{
			let _tmp_0 = this.H_assign;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				this.get_Smarty().assign(key, value);
			}
		}
	}

	displaySmarty() {
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.setAssign("O_form", O_renderer.toArray());
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};