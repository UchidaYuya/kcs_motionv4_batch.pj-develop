//
//管理者：商品マスター画面のView
//
//更新履歴<br>
//2008/07/08 石崎公久 作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@package Product
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/06/29
//@filesource
//
//
//
//管理者：商品マスター画面のView
//
//@uses ViewSmarty
//@package Product
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/07/09
//

require("MtSession.php");

require("view/ViewSmarty.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/MakePageLink.php");

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
//O_Qt
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
//
//m_limit
//件数
//@var mixed
//@access private
//
//
//getDelflg
//
//@author ishizaki
//@since 2008/07/16
//
//@access public
//@return void
//
//
//getProductID
//
//@author ishizaki
//@since 2008/07/16
//
//@access public
//@return void
//
//
//clearSessSelf
//
//@author ishizaki
//@since 2008/07/16
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
//checkCGIParam
//
//@author ishizaki
//@since 2008/07/02
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
//@access public
//@return void
//
//
//getLocalSession
//ローカルセッション(´･ω･`)ディレクトリセッションなど存在しない
//@author web
//@since 2018/11/20
//
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
//getPostData
//
//@author katsushi
//@since 2008/07/09
//
//@access public
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
//makeFormElements
//
//@author katsushi
//@since 2008/07/09
//
//@param array $H_carcir
//@access private
//@return void
//
//
//makeFormElements2
//件数など表示
//@author web
//@since 2018/11/20
//
//@access public
//@return void
//
//
//makeHierSelectCircuit
//
//@author katsushi
//@since 2008/07/09
//
//@param array $A_circuit
//@access public
//@return array
//
//
//setFreeze
//
//@author ishizaki
//@since 2008/07/15
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
class AdminProductMenuView extends ViewSmarty {
	getDelflg() {
		return this.O_Sess.getSelf("delflg");
	}

	getProductID() {
		return this.O_Sess.getSelf("productid");
	}

	clearSessSelf() {
		this.O_Sess.clearSessionSelf();
	}

	constructor(H_navi) {
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.O_Qt = new QuickFormUtil("form");
		this.O_Sess = MtSession.singleton();
		this.A_form = Array();
		this.H_postdata = Array();
		this.H_assign.admin_fncname = "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC";
		this.H_assign.shop_person = this.gSess().admin_name + " " + this.gSess().admin_personname;
		this.H_assign.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
		this.H_assign.H_jsfile = ["adminProductDelete.js"];
	}

	checkCGIParam() //初期化周りは全てなおしました(;´･ω･)　 20181207
	//検索の値いれましょう
	//--------------------------------------------------------------------------
	//値が設定されてない場合はいれておく
	//デフォ値
	//初期値いれる
	//--------------------------------------------------------------------------
	//検索値の更新
	//--------------------------------------------------------------------------
	//表示が押された(´･ω･`)
	//--------------------------------------------------------------------------
	{
		this.H_Local = this.O_Sess.getSelfAll();

		if (undefined !== _GET.p) {
			this.H_Local.page = _GET.p;
			this.O_Sess.SetSelfAll(this.H_Local);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == (undefined !== _POST.productid) && true == (undefined !== _POST.delflg)) {
			this.O_Sess.setSelf("productid", _POST.productid);
			this.O_Sess.setSelf("delflg", _POST.delflg);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (undefined !== this.H_Local.search) {
			this.H_postdata = this.H_Local.search;
		} else {
			this.H_postdata = Array();
		}

		if (_POST.search) //検索時にはページは先頭にする
			{
				this.H_Local.search_post = _POST;
				if (undefined !== _POST.carcir[0]) this.H_postdata.carid = +_POST.carcir[0];
				if (undefined !== _POST.carcir[1]) this.H_postdata.cirid = +_POST.carcir[1];
				if (undefined !== _POST.productname) this.H_postdata.productname = _POST.productname;
				if (undefined !== _POST.type) this.H_postdata.type = _POST.type;

				if (undefined !== _POST.delflg) {
					this.H_postdata.delflg = true;
				} else {
					this.H_postdata.delflg = false;
				}

				this.H_Local.page = 1;
			} else {
			this.H_postdata = this.H_Local.search;
		}

		var default = {
			carid: undefined,
			cirid: undefined,
			productname: "",
			delflg: false,
			type: ""
		};

		for (var key in default) {
			var value = default[key];

			if (!(undefined !== this.H_postdata[key])) {
				this.H_postdata[key] = value;
			}
		}

		this.H_Local.search = this.H_postdata;

		if (undefined !== _POST.limitbutton) {
			if (undefined !== _POST.limit && is_numeric(_POST.limit) && _POST.limit > 0 && this.H_Local.limit != _POST.limit) //
				//ページを先頭にする
				{
					this.H_Local.limit = _POST.limit;
					this.H_Local.page = 1;
				}
		}

		default = {
			limit: 50,
			page: 1
		};

		for (var key in default) {
			var value = default[key];

			if (!this.H_Local[key]) {
				this.H_Local[key] = value;
			}
		}

		this.O_Sess.SetSelfAll(this.H_Local);
	}

	displaySmarty(list_count) {
		this.assignSmarty();
		var page_link = MakePageLink.makePageLinkHTML(list_count, this.H_Local.limit, this.H_Local.page);
		this.get_Smarty().assign("page_link", page_link);
		this.get_Smarty().assign("list_cnt", list_count);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	getLocalSession() {
		return {
			SELF: this.O_Sess.getSelfAll()
		};
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

	getPostData() {
		return this.H_postdata;
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	getPriceNavi() {
		return this.PriceNavi;
	}

	makeFormElements(A_carcir: {} | any[], H_search = Array()) //default値新しく作り直す 20181120伊達
	//if( isset( $H_search["productname"] ) ){		$default["productname"] = $H_search["productname"];	}
	//		if( isset( $H_search["delflg"] ) ){				$default["delflg"]		= $H_search["delflg"];		}
	//		if( !empty( $H_search["carid"] ) ){
	//			$default["carcir"] = array();
	//			$default["carcir"][0] =  $H_search["carid"];
	//			if( !empty( $H_search["cirid"] ) ){
	//				$default["carcir"][1] =  $H_search["cirid"];
	//			}			
	//		}
	//			
	//		if( isset( $H_search["delflg"] ) ){
	//			$default["delflg"]	= $H_search["delflg"];	
	//		}
	//formを作り直す
	//POSTの値を直接使うのはやめたい
	//$this->O_Qt->setDefaultsWrapper( $default );
	{
		var A_elements = [{
			name: "carcir",
			label: "\u30AD\u30E3\u30EA\u30A2",
			inputtype: "hierselect",
			separator: "&nbsp;&nbsp;\u56DE\u7DDA\u7A2E\u5225&nbsp;",
			data: A_carcir
		}, {
			name: "productname",
			label: "\u5546\u54C1\u540D",
			inputtype: "text"
		}, {
			name: "search",
			label: "\u691C\u7D22",
			inputtype: "submit"
		}, {
			name: "delflg",
			inputtype: "checkbox",
			data: "\u524A\u9664\u5546\u54C1\u8868\u793A"
		}, {
			name: "type",
			label: "\u5546\u54C1\u7A2E\u5225",
			inputtype: "select",
			data: {
				"": "----",
				"\u96FB\u8A71": "\u96FB\u8A71",
				"\u4ED8\u5C5E\u54C1": "\u4ED8\u5C5E\u54C1"
			}
		}];
		var default = Array();
		this.O_Qt.setFormElement(A_elements);
		this.O_Qt.setDefaultsWrapper(this.H_Local.search_post);
		var O_form = this.O_Qt.makeFormObject();
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	makeFormElements2(limit) {
		var A_elements = Array();
		A_elements.push({
			name: "limitbutton",
			label: "\u8868\u793A",
			inputtype: "submit"
		});
		A_elements.push({
			name: "limit",
			label: "\u6570\u91CF",
			inputtype: "text",
			options: {
				size: 3,
				maxlength: 3
			}
		});
		var default = Array();
		default.limit = limit;
		var O_QuickForm = new QuickFormUtil("form2");
		O_QuickForm.setFormElement(A_elements);
		O_QuickForm.setDefaultsWrapper(default);
		var O_form = O_QuickForm.makeFormObject();
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form2 = O_renderer.toArray();
	}

	makeHierSelectCircuit(A_circuit: {} | any[]) {
		var H_return = Array();
		var cirid_prev = 0;

		for (var i = 0; i < A_circuit.length; i++) //回線種別を指定しないやつ入れる(´･ω･`) 20181207
		{
			var carid = A_circuit[i].carid;
			var cirid = A_circuit[i].cirid;

			if (cirid_prev != cirid) {
				H_return[carid][0] = "----";
				cirid_prev = cirid;
			}

			H_return[carid][cirid] = A_circuit[i].cirname;
		}

		return H_return;
	}

	setFreeze() {
		this.H_assign.O_form.freezeWrapper();
	}

	__destruct() {
		super.__destruct();
	}

};