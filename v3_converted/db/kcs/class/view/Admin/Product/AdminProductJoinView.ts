//
//管理者：商品マスター：商品関連付け
//
//更新履歴<br>
//2008/07/17 石崎公久 作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@package Product
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/17
//@filesource
//
//
//
//管理者：商品マスター：商品関連付け
//
//@uses ViewSmarty
//@package Product
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/17
//

require("MtSession.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/ViewSmarty.php");

//
//H_assign
//
//@var mixed
//@access private
//
//
//O_Sess
//
//@var mixed
//@access private
//
//
//O_Qf
//
//@var mixed
//@access private
//
//
//A_form
//
//@var mixed
//@access private
//
//
//H_postdata
//
//@var mixed
//@access private
//
//これ、どこかで使ってるの？？？？ 20171016伊達
//
//H_post
//postの値
//@var mixed
//@access private
//
//
//Carid
//
//@var mixed
//@access private
//
//
//getCarID
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
//
//コンストラクタ
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
//
//makeFormElements
//
//@author ishizaki
//@since 2008/07/31
//
//@param array $A_carcir
//@access public
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/05/01
//
//@param mixed $H_productlist
//@param mixed $H_joined_productlist
//@access public
//@return void
//
//
//assignSmarty
//
//@author katsushi
//@since 2008/07/09
//
//@param array $H_assign
//@access private
//@return void
//
//
//setAssign
//
//@author katsushi
//@since 2008/07/09
//
//@param array $H_assign
//@access public
//@return void
//
//
//getPriceNavi
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/07/09
//
//@access public
//@return void
//
class AdminProductJoinView extends ViewSmarty {
	getCarID() {
		return this.Carid;
	}

	getPostData() {
		return this.H_post;
	}

	constructor(H_navi) {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.O_Qf = new QuickFormUtil("form");
		this.O_Sess = MtSession.singleton();
		this.A_form = Array();
		this.H_postdata = Array();
		this.H_post = Array();
		this.H_assign = Array();
		this.H_assign.admin_fncname = "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC\u95A2\u9023\u4ED8\u3051";
		this.H_assign.shop_person = this.gSess().admin_name + " " + this.gSess().admin_personname;
		this.H_assign.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
		this.H_assign.H_jsfile = ["xmlhttprequest.js", "adminProductJoin.js"];
	}

	makeFormElements(H_car: {} | any[], carid = 1) {
		var A_elements = Array();
		A_elements.push({
			name: "car",
			label: "\u30AD\u30E3\u30EA\u30A2",
			inputtype: "select",
			data: H_car,
			options: "onChange=\"document.form.submit()\""
		});
		A_elements.push({
			name: "productname_parent",
			label: "\u5546\u54C1\u540D(\u89AA)",
			inputtype: "text",
			options: {
				style: "width:100%"
			}
		});
		A_elements.push({
			name: "productname_child",
			label: "\u5546\u54C1\u540D(\u5B50)",
			inputtype: "text",
			options: {
				style: "width:100%"
			}
		});
		A_elements.push({
			name: "submit",
			label: "\u691C\u7D22",
			value: "\u691C\u7D22",
			inputtype: "submit"
		});
		this.O_Qf.setFormElement(A_elements);
		var H_post = this.H_post;
		h_post.car = carid;
		this.O_Qf.setDefaultsWrapper(H_post);
		var O_form = this.O_Qf.makeFormObject();
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	checkCGIParam() //post名=>デフォルト値
	{
		var post_list = {
			productname_parent: "",
			productname_child: "",
			car: 1
		};
		var is_post = false;

		for (var key in post_list) {
			var value = post_list[key];

			if (true == (undefined !== _POST[key])) {
				var temp = _POST[key];
				this.O_Sess.setSelf(key, _POST[key]);
				is_post = true;
			} else //postの値がない場合は、セッションから取得
				{
					temp = this.O_Sess.getSelf(key);

					if (is_null(temp)) //セッションの値がない場合はデフォルト値
						//
						{
							temp = value;
							this.O_Sess.setSelf(key, temp);
						}
				}

			this.H_post[key] = temp;
		}

		if (is_post) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.Carid = this.O_Sess.getSelf("car");

		if (true == is_null(this.Carid)) {
			this.Carid = "1";
		}
	}

	displaySmarty(H_productlist_tel, H_productlist_acc, H_joined_productlist) {
		this.H_assign.H_productlist_tel = H_productlist_tel;
		this.H_assign.H_productlist_acc = H_productlist_acc;
		this.H_assign.H_joinedproductlist = H_joined_productlist;
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
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

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	getPriceNavi() {
		return this.PriceNavi;
	}

	__destruct() {
		super.__destruct();
	}

};