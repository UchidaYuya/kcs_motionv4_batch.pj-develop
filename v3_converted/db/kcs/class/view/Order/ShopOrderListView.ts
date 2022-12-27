//
//受注集計用view
//
//更新履歴：<br>
//2008/05/28 igarashi
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/05/28
//@filesource
//@uses OrderListViewBase
//@uses QuickFormUtil
//
//
//error_reporting(E_ALL);
//
//受注集計用view
//
//@package Order
//@subpackage View
//@author igarashi
//@since 2008/05/28
//@uses OrderListViewBase
//@uses QuickFormUtil
//

require("view/Order/AdminOrderListView.php");

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
//パン屑リンクを返す
//
//@author igarashi
//@since 2008/11/12
//
//
//
//smartyで表示
//
//@author igarashi
//@since 2008/11/12
//
//@param $H_view
//
//@access public
//@return none
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
class ShopOrderListView extends AdminOrderListView {
	static PUB = "/MTOrderList";

	constructor(H_param: {} | any[] = Array()) {
		H_param.site = ViewBaseHTML.SITE_SHOP;
		super(H_param);
	}

	makeFormShop(A_shopid, A_mode, H_pact, flg) //包括販売店なら販売店選択メニューを追加
	{
		var A_form = [{
			name: "modesel",
			label: "",
			inputtype: "select",
			data: A_mode
		}, {
			name: "modechng",
			label: "\u8868\u793A\u5909\u66F4",
			inputtype: "submit"
		}, {
			name: "pactsel",
			label: "",
			inputtype: "select",
			data: H_pact
		}, {
			name: "pactchng",
			label: "\u304A\u5BA2\u69D8\u306E\u5909\u66F4",
			inputtype: "submit"
		}];

		if (true == flg) {
			var A_temp = [{
				name: "shopsel",
				label: "",
				inputtype: "select",
				data: A_shopid
			}, {
				name: "shopchng",
				label: "\u8CA9\u58F2\u5E97\u306E\u5909\u66F4",
				inputtype: "submit"
			}];
			A_form = array_merge(A_form, A_temp);
		}

		var H_form = new QuickFormUtil("detailform");
		H_form.setFormElement(A_form);
		this.O_form = H_form.makeFormObject();
	}

	makePankuzuLinkHash() {
		var H_link = {
			"": "\u53D7\u6CE8\u96C6\u8A08"
		};
		return H_link;
	}

	displaySmarty(H_g_sess, H_view) //QuickFormとSmartyの合体
	//assaign
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_form.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("shop_person", H_g_sess.shopname + " " + H_g_sess.personname);
		this.get_Smarty().assign("shop_name", H_g_sess.shopname);
		this.get_Smarty().assign("shop_submenu", H_view.pankuzu_link);
		this.get_Smarty().assign("title", "\u53D7\u6CE8\u96C6\u8A08");
		this.get_Smarty().assign("current_script", _SERVER.PHP_SELF);
		this.get_Smarty().assign("datacnt", H_view.data.length);
		this.get_Smarty().assign("H_data", H_view.data);
		this.get_Smarty().assign("A_datetree", H_view.monthtree);
		this.get_Smarty().assign("A_kisyo", H_view.kisyo);
		this.get_Smarty().assign("shopflg", true);
		this.get_Smarty().assign("unify", H_view.unify);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};