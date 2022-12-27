//
//発送先画面View
//
//更新履歴：<br>
//2009/08/14 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2009/08/14
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//発送先画面View
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2009/08/14
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("OrderUtil.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/Rule/OrderRule.php");

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
//@access public
//
//
//セッティングオブジェクト
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
//コンストラクタ <br>
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//ローカルセッションを取得する
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
//
//配下のセッション消し
//
//@author miyazawa
//@since 2008/05/13
//
//@access public
//@return void
//
//
//CSSを返す
//
//@author miyazawa
//@since 2008/03/07
//
//@access public
//@return string
//
//
//表示に使用する物を格納する配列を返す
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return mixed
//
//
//CGIパラメータのチェックを行う<br>
//
//配列をセッションに入れる<br>
//
//@author miyazawa
//@since 2008/05/15
//
//@access public
//@return void
//@uses MtExceptReload
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
//@since 2008/02/20
//
//@param array $H_sesstion（CGIパラメータ）
//@param array $A_auth（権限一覧）
//@param array $A_alert（警告）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
class ShiptoView extends ViewSmarty {
	static PUB = "/MTOrder";

	constructor() //英語化でテンプレートのディレクトリ変更 20090824miya
	{
		this.O_Sess = MtSession.singleton();
		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_View.pactid = undefined;
		this.H_View.unittype = "P";
		this.H_View.unitid = undefined;
		this.H_View.message = "";
		this.H_View.ins = 0;
		this.H_View.del = 0;
		this.H_View.username = "";
		this.H_View.postname = "";
		this.H_View.ziphead = "";
		this.H_View.ziptail = "";
		this.H_View.pref = "";
		this.H_View.addr = "";
		this.H_View.building = "";
		this.H_View.telno = "";
		this.H_View.shiptoid = undefined;
		this.H_View.error_message = "";
		this.H_View.table = "";
		this.H_View.disableflg = "";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(ShiptoView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	getLocalSession() {
		var H_sess = {
			[ShiptoView.PUB]: this.O_Sess.getPub(ShiptoView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [ShiptoView.PUB + "/order_form.php"];
		this.O_Sess.clearSessionListPub(A_exc);
	}

	getCSS(site_flg) {
		if (site_flg == ShiptoView.SITE_SHOP) {
			return "actorderDetail";
		} else {
			return "csOrder";
		}
	}

	get_View() {
		return this.H_View;
	}

	checkCGIParam() {
		var _GET = _POST;

		if (_GET.postid != "") //GETを変数格納
			{
				this.H_View.pactid = _GET.pactid;
				this.H_View.unitid = _GET.postid;
				this.H_View.ins = _GET.ins;
				this.H_View.del = _GET.del;
				this.H_View.set = _GET.set;
				this.H_View.username = _GET.username;
				this.H_View.postname = _GET.postname;
				this.H_View.ziphead = _GET.ziphead;
				this.H_View.ziptail = _GET.ziptail;
				this.H_View.pref = _GET.pref;
				this.H_View.addr = _GET.addr;
				this.H_View.building = _GET.building;
				this.H_View.telno = _GET.telno;
				this.H_View.shiptoid = _GET.shiptoid;
			} else //英語化権限
			//お客様か販売店か
			{
				if (1 == this.H_View.site_flg) {
					var H_g_sess = this.getGlobalShopSession();
				} else {
					H_g_sess = this.getGlobalSession();
				}

				if ("ENG" == H_g_sess.language) {
					this.H_View.error_message = "<p><img src='/images/navi.gif' border=0 align=absmiddle>No Data</p>";
				} else {
					this.H_View.error_message = "<p><img src='/images/navi.gif' border=0 align=absmiddle>\u767A\u9001\u5148\u306F\u307E\u3060\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093</p>";
				}
			}
	}

	displaySmarty() //QuickFormとSmartyの合体
	//英語化権限
	//お客様か販売店か
	//assign
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());

		if (1 == this.H_View.site_flg) {
			var H_g_sess = this.getGlobalShopSession();
		} else {
			H_g_sess = this.getGlobalSession();
		}

		if ("ENG" == H_g_sess.language) {
			var eng = true;
		} else {
			eng = false;
		}

		this.get_Smarty().assign("H_shiprow", this.H_View.H_shiprow);
		this.get_Smarty().assign("error_message", this.H_View.error_message);
		this.get_Smarty().assign("message", this.H_View.message);
		this.get_Smarty().assign("H_list", this.H_View.H_list);
		this.get_Smarty().assign("listcnt", this.H_View.H_list.length);
		this.get_Smarty().assign("pactid", this.H_View.pactid);
		this.get_Smarty().assign("unitid", this.H_View.unitid);
		this.get_Smarty().assign("disableflg", this.H_View.disableflg);
		var smarty_template = "shipto.tpl";

		if (1 == this.H_View.site_flg) {
			smarty_template = "../../MTOrder/" + smarty_template;
		}

		this.get_Smarty().display(smarty_template);
	}

	__destruct() {
		super.__destruct();
	}

};