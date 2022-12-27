//
//注文履歴一覧のView
//
//更新履歴：<br>
//2008/05/28 igarashi
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/05/28
//@filesource
//@uses OrderListViewBase
//@uses QuickFormUtil
//
//
//error_reporting(E_ALL);
//
//注文一覧のView
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/05/28
//@uses OrderListViewBase
//@uses QuickFormUtil
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author igarashi
//@since 2008/03/03
//
//@access public
//@return void
//
//
//パラメータチェック
//
//@author igarashi
//@since 2008/10/19
//
//@access public
//@return none
//
//
//パンくずリンク用配列を返す
//
//@author miyazawa
//@since 2008/05/28
//
//@access public
//@return array
//
//
//入力フォームを作成する
//
//@author igarashi
//@since 2008/10/1
//
//@param $A_shopid
//@param $A_mode
//
//@access public
//@return none
//
//
//配下のセッション消し
//
//@author igarashi
//@since 2008/06/23
//
//@access public
//@return void
//
//
//ローカルセッションを取得する
//
//@author igarashi
//@since 2008/10/19
//
//@access public
//@return none
//
//
//Smartyを用いた画面表示<br>
//
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author igarashi
//@since 2008/09/01
//
//@param $H_view
//
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//各ページ固有のsetDefaultSession
//
//@author houshiyama
//@since 2008/03/10
//
//@access protected
//@return void
//
//
//グローバルセッション以外を消す<br>
//基底のを呼んでるだけ。
//
//
//
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class AdminOrderListView extends ViewSmarty {
	static PUB = "/MTOrderList";

	constructor(H_param: {} | any[] = {
		site: ViewBaseHTML.SITE_ADMIN
	}) //$H_param["site"] = ViewBaseHTML::SITE_ADMIN;
	{
		super(H_param);
	}

	checkCGIParam() {
		if (true == (undefined !== _POST.shopsel)) {
			this.H_Local.shopsel = _POST.shopsel;
		} else {
			this.H_Local.shopsel = 0;
		}

		if (true == (undefined !== _POST.modesel)) {
			this.H_Local.modesel = _POST.modesel;
		} else {
			this.H_Local.modesel = 1;
		}

		if (true == (undefined !== _POST.pactsel)) {
			this.H_Local.pactsel = _POST.pactsel;
		} else {
			this.H_Local.pactsel = 0;
		}

		this.gSess().setSelfAll(this.H_Local);
		this.gSess().setPub(AdminOrderListView.PUB, this.H_Dir);
	}

	makePankuzuLinkHash() {
		var H_link = {
			"": "\u53D7\u6CE8\u96C6\u8A08"
		};
		return H_link;
	}

	makeForm(A_shopid, A_mode) {
		var A_form = [{
			name: "shopsel",
			label: "",
			inputtype: "select",
			data: A_shopid
		}, {
			name: "modesel",
			label: "",
			inputtype: "select",
			data: A_mode
		}, {
			name: "shopchng",
			label: "\u8CA9\u58F2\u5E97\u306E\u5909\u66F4",
			inputtype: "submit"
		}, {
			name: "modechng",
			label: "\u8868\u793A\u5909\u66F4",
			inputtype: "submit"
		}];
		var H_form = new QuickFormUtil("detailform");
		H_form.setFormElement(A_form);
		this.O_form = H_form.makeFormObject();
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [AdminOrderListView.PUB, "/Admin/MTOrder/orderlist.php"];
		this.gSess().clearSessionExcludeListPub(A_exc);
	}

	getLocalSession() {
		var H_sess = {
			[AdminOrderListView.PUB]: this.gSess().getPub(AdminOrderListView.PUB),
			SELF: this.gSess().getSelfAll()
		};
		return H_sess;
	}

	displaySmarty(H_view) //QuickFormとSmartyの合体
	//assaign
	//ページ固有の表示処理
	//$this->displaySmartyPeculiar( $H_sess, $A_data, $A_auth, $O_manage );
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_form.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("admin_fncname", "\u53D7\u6CE8\u96C6\u8A08");
		this.get_Smarty().assign("shop_person", this.gSess().admin_personname);
		this.get_Smarty().assign("shop_name", H_g_sess.shopname);
		this.get_Smarty().assign("admin_submenu", H_view.pankuzu_link);
		this.get_Smarty().assign("title", "\u53D7\u6CE8\u96C6\u8A08");
		this.get_Smarty().assign("current_script", _SERVER.PHP_SELF);
		this.get_Smarty().assign("datacnt", H_view.data.length);
		this.get_Smarty().assign("H_data", H_view.data);
		this.get_Smarty().assign("A_datetree", H_view.monthtree);
		this.get_Smarty().assign("shopflg", false);
		this.get_Smarty().assign("unify", H_flg.unify);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	setDefaultSessionPeculiar() {}

	clearSessionMenu() {
		this.O_Sess.clearSessionMenu();
	}

	__destruct() {
		super.__destruct();
	}

};