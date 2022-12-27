//
//管理者：価格表登録修正BaseView
//
//更新履歴<br>
//2008/08/05 勝史 作成
//
//@uses ViewSmarty
//@uses MakePankuzuLink
//@package Price
//@subpackage View
//@author katsushi
//@since 2008/08/05
//@filesource
//
//
//
//管理者：価格表登録修正BaseView
//
//@uses ViewSmarty
//@package Price
//@subpackage View
//@author katsushi
//@since 2008/08/05
//

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("model/Admin/Product/AdminProductModel.php");

//
//H_assign
//
//@var mixed
//@access protected
//
//
//O_Qf
//
//@var mixed
//@access protected
//
//
//A_form
//
//@var mixed
//@access protected
//
//
//form_step
//
//@var mixed
//@access protected
//
//
//submit_name
//
//@var mixed
//@access protected
//
//
//A_elements
//
//@var mixed
//@access protected
//
//
//A_rule
//
//@var mixed
//@access protected
//
//
//finish_name
//
//@var mixed
//@access protected
//
//
//back_url
//
//@var mixed
//@access protected
//
//
//back_name
//
//@var mixed
//@access protected
//
//
//exec_site
//
//@var mixed
//@access protected
//
//
//コンストラクタ
//
//@author ishizaki
//@since 2008/06/26
//
//@param mixed $H_navi
//@param mixed $site
//@access public
//@return void
//
//
//getSiteStr
//
//@author katsushi
//@since 2008/08/13
//
//@access public
//@return void
//
//
//setSubmitName
//
//@author katsushi
//@since 2008/07/22
//
//@param mixed $submit_name
//@access public
//@return void
//
//
//makeModelObj
//
//@author katsushi
//@since 2008/07/17
//
//@access protected
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
//setFormStep
//
//@author katsushi
//@since 2008/08/07
//
//@param mixed $form_step
//@access public
//@return void
//
//
//getFormStep
//
//@author katsushi
//@since 2008/07/17
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
//addJs
//
//@author katsushi
//@since 2008/07/15
//
//@param mixed $jsfile
//@access protected
//@return void
//
//
//assignSmarty
//
//@author katsushi
//@since 2008/07/09
//
//@param array $H_assign
//@access protected
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
//setPostData
//
//@author katsushi
//@since 2008/07/22
//
//@param mixed $H_data
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
//setPPName
//
//@author katsushi
//@since 2008/08/06
//
//@param mixed $ppname
//@access protected
//@return void
//
//
//商品選択画面用のフォーム
//
//@author katsushi
//@since 2008/08/06
//
//@param mixed $H_product
//@access public
//@return void
//
//
//makeFormPriceListStep
//
//@author katsushi
//@since 2008/08/07
//
//@access public
//@return void
//
//
//addFormPriceListStep
//
//@author katsushi
//@since 2008/08/10
//
//@access protected
//@return void
//
//
//getProductIDList
//
//@author katsushi
//@since 2008/08/09
//
//@access protected
//@return void
//
//
//makePriceFormElements
//
//@author katsushi
//@since 2008/08/07
//
//@access protected
//@return void
//
//
//makeFormDocomo
//
//@author katsushi
//@since 2008/08/08
//
//@param array $A_productid
//@param array $H_product
//@access protected
//@return void
//
//
//makeFormPublic
//
//@author katsushi
//@since 2008/08/26
//
//@param array $A_productid
//@param array $H_product
//@param int $buyselid
//@access protected
//@return void
//
//
//makeFormAu
//
//@author katsushi
//@since 2008/08/08
//
//@param array $A_productid
//@param array $H_product
//@access protected
//@return void
//
//
//makeFormSoftbank
//
//@author katsushi
//@since 2008/08/08
//
//@param array $A_productid
//@param array $H_product
//@access protected
//@return void
//
//
//makeFormWillcom
//
//@author katsushi
//@since 2008/08/08
//
//@param array $A_productid
//@param array $H_product
//@access protected
//@return void
//
//
//makeFormEmobile
//
//@author katsushi
//@since 2008/08/08
//
//@param array $A_productid
//@param array $H_product
//@access protected
//@return void
//
//
//addNumericRule
//
//@author katsushi
//@since 2008/08/07
//
//@param mixed $name
//@param string $mess
//@access protected
//@return void
//
//
//makeFormButton
//
//@author katsushi
//@since 2008/08/06
//
//@param mixed $btnname
//@access public
//@return void
//
//
//makeFromBackButton
//
//@author katsushi
//@since 2008/08/09
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
//@access public
//@return void
//
//
//setDefaults
//
//@author katsushi
//@since 2008/07/22
//
//@param mixed $H_def
//@access public
//@return void
//
//
//assignForm
//
//@author katsushi
//@since 2008/07/22
//
//@access public
//@return void
//
//
//makeFormRules
//
//@author katsushi
//@since 2008/08/06
//
//@access protected
//@return void
//
//
//getDateFormat
//
//@author katsushi
//@since 2008/07/15
//
//@param boolean
//@access public
//@return void
//
//
//setFinishArg
//
//@author katsushi
//@since 2008/08/06
//
//@param string $finish_name
//@param string $back_url
//@param string $back_name
//@access protected
//@return void
//
//
//displayFinish
//
//@author katsushi
//@since 2008/07/22
//
//@param mixed $fnc
//@access public
//@return void
//
//
//clearSessSelf
//
//@author katsushi
//@since 2008/07/19
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
class AdminPriceAddModBaseView extends ViewSmarty {
	constructor(H_navi, site) {
		super({
			site: site
		});
		this.O_Qf = new QuickFormUtil("form");
		this.A_form = Array();
		this.form_step = false;
		this.submit_name = "";
		this.A_elements = Array();
		this.A_rule = Array();
		this.H_assign = Array();
		this.exec_site = "";

		if (site == ViewBaseHtml.SITE_ADMIN) {
			this.exec_site = "admin";
			this.H_assign.admin_fncname = H_navi[""];
		} else if (site == ViewBaseHtml.SITE_SHOP) {
			this.exec_site = "shop";
			this.H_assign.title = H_navi[""];
		}

		this.H_assign.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, this.exec_site);
		this.H_assign.shop_person = this.gSess().admin_name + " " + this.gSess().admin_personname;
	}

	getSiteStr() {
		return this.exec_site;
	}

	setSubmitName(submit_name) {
		this.submit_name = submit_name;
	}

	makeModelObj() //modelオブジェクトの生成
	{}

	checkCGIParam() //リセット
	{
		if (true == (undefined !== _GET.r)) {
			this.gSess().clearSessionSelf();
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (undefined !== _POST.step == true) //商品選択画面から来た場合
			{
				if (String(_POST.step === "" || String(_POST.step === "select_product"))) {
					this.gSess().setSelf("step", "input_pricelist");
					_POST.step = "input_pricelist";

					if (get_magic_quotes_gpc() == true) {
						for (var key in _POST) {
							var val = _POST[key];

							if (Array.isArray(val) == false) {
								_POST[key] = stripslashes(val);
							}
						}
					}

					var H_post = this.getPostData();
					this.gSess().setSelf("postdata", _POST + Array.from(H_post));
					header("Location: " + _SERVER.PHP_SELF);
					throw die(0);
				} else if (String(_POST.step === "back_product_select")) {
					this.gSess().setSelf("step", "select_product");
					_POST.step = "select_product";

					if (get_magic_quotes_gpc() == true) {
						for (var key in _POST) {
							var val = _POST[key];

							if (Array.isArray(val) == false) {
								_POST[key] = stripslashes(val);
							}
						}
					}

					H_post = this.getPostData();
					delete H_post.defaultflg;
					delete H_post.copy;
					this.gSess().setSelf("postdata", _POST + Array.from(H_post));
					header("Location: " + _SERVER.PHP_SELF);
					throw die(0);
				} else if (String(_POST.step === "input_pricelist")) {
					this.gSess().setSelf("step", "confirm_pricelist");
					_POST.step = "confirm_pricelist";

					if (get_magic_quotes_gpc() == true) {
						for (var key in _POST) {
							var val = _POST[key];

							if (Array.isArray(val) == false) {
								_POST[key] = stripslashes(val);
							}
						}
					}

					H_post = this.getPostData();
					delete H_post.defaultflg;
					delete H_post.copy;
					this.gSess().setSelf("postdata", _POST + Array.from(H_post));
					header("Location: " + _SERVER.PHP_SELF);
					throw die(0);
				} else if (String(_POST.step === "back_input_pricelist")) {
					this.gSess().setSelf("step", "input_pricelist");
					header("Location: " + _SERVER.PHP_SELF);
					throw die(0);
				} else if (String(_POST.step === "confirm_pricelist")) {
					this.gSess().setSelf("step", "finish_pricelist");
					_POST.step = "finish_pricelist";
				}
			}

		this.setFormStep(this.gSess().getSelf("step"));
	}

	setFormStep(form_step) {
		this.form_step = form_step;
	}

	getFormStep() {
		return this.form_step;
	}

	displaySmarty() {
		this.assignSmarty();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	addJs(jsfile) {
		if (Array.isArray(this.H_assign.H_jsfile) == false) {
			this.H_assign.H_jsfile = Array();
		}

		this.H_assign.H_jsfile.push(jsfile);
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
		return this.gSess().getSelf("postdata");
	}

	setPostData(H_data) {
		this.gSess().setSelf("postdata", H_data);
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	setPPName(ppname) {
		this.setAssign("ppname", ppname);
	}

	makeFormSelectProductStep(H_product) {
		this.A_elements = [{
			name: "productid",
			label: "\u30A2\u30A4\u30C6\u30E0",
			inputtype: "groupcheckbox",
			separator: "</div><div style='float:left;width:200px'>",
			data: H_product
		}, {
			name: "step",
			inputtype: "hidden",
			data: this.getFormStep()
		}];
		this.A_rule = [{
			name: "productid",
			mess: "\u63B2\u8F09\u3059\u308B\u30A2\u30A4\u30C6\u30E0\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		}];
		this.makeFormButton();
	}

	makeFormPriceListStep() //価格表のフォームエレメント生成
	//ボタン生成
	//追加要素は継承先で上書きすること
	//javascript読み込み
	{
		this.A_elements = [{
			name: "pricename",
			label: "\u4FA1\u683C\u8868\u540D\u79F0",
			inputtype: "text",
			options: "size=50"
		}, {
			name: "listheader",
			label: "\u30D8\u30C3\u30C0\u30FC\u5165\u529B\u6B04",
			inputtype: "textarea",
			options: {
				rows: "5",
				cols: "100"
			}
		}, {
			name: "sortcomment",
			label: "\u9806\u5E8F",
			inputtype: "text",
			options: {
				size: "3",
				maxlength: "7"
			}
		}, {
			name: "listcomment",
			label: "\u8AAC\u660E\u5165\u529B\u6B04",
			inputtype: "textarea",
			options: {
				rows: "5",
				cols: "80"
			}
		}, {
			name: "listfooter",
			label: "\u30D5\u30C3\u30BF\u30FC\u5165\u529B\u6B04",
			inputtype: "textarea",
			options: {
				rows: "5",
				cols: "100"
			}
		}, {
			name: "datefrom",
			label: "\u4FA1\u683C\u8868\u63B2\u8F09\u958B\u59CB\u65E5",
			inputtype: "date",
			data: this.getDateFormat()
		}, {
			name: "dateto",
			label: "\u4FA1\u683C\u8868\u63B2\u8F09\u7D42\u4E86\u65E5",
			inputtype: "date",
			data: this.getDateFormat(true)
		}, {
			name: "defaultflg",
			label: "\u30C7\u30D5\u30A9\u30EB\u30C8\u306E\u4FA1\u683C\u8868\u3068\u3057\u3066\u767B\u9332\u3059\u308B",
			inputtype: "groupcheckbox",
			data: {
				"1": "\u30C7\u30D5\u30A9\u30EB\u30C8\u306E\u4FA1\u683C\u8868\u3068\u3057\u3066\u767B\u9332\u3059\u308B"
			}
		}, {
			name: "mailstatus",
			label: "\u30E1\u30FC\u30EB\u9001\u4FE1\u306E\u6709\u7121",
			inputtype: "radio",
			data: {
				"0": ["\u9001\u4FE1\u3057\u306A\u3044"],
				"1": ["\u9001\u4FE1\u3059\u308B"]
			}
		}, {
			name: "step",
			inputtype: "hidden",
			data: this.getFormStep()
		}];
		this.A_rule = [{
			name: "pricename",
			mess: "\u4FA1\u683C\u8868\u540D\u79F0\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "datefrom",
			mess: "\u63B2\u8F09\u958B\u59CB\u65E5\u304C\u7121\u52B9\u306A\u65E5\u4ED8\u3067\u3059",
			type: "QRCheckDate",
			format: undefined,
			validation: "client"
		}, {
			name: "dateto",
			mess: "\u63B2\u8F09\u7D42\u4E86\u65E5\u304C\u7121\u52B9\u306A\u65E5\u4ED8\u3067\u3059",
			type: "QRCheckDate",
			format: undefined,
			validation: "client"
		}, {
			name: ["dateto", "datefrom"],
			mess: "\u63B2\u8F09\u7D42\u4E86\u65E5\u4ED8\u306F\u958B\u59CB\u65E5\u4ED8\u3088\u308A\u3042\u3068\u306B\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRDatecompareRule",
			format: "gt",
			validation: "client"
		}, {
			name: ["defaultflg", "dateto"],
			mess: "\u30C7\u30D5\u30A9\u30EB\u30C8\u3067\u306F\u306A\u3044\u5834\u5408\u3001\u63B2\u8F09\u7D42\u4E86\u65E5\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRChkboxRequireDateRule",
			format: "",
			validation: "client"
		}, {
			name: "sortcomment",
			mess: "\u9806\u5E8F\u306F\u534A\u89D2\u6570\u5B57\uFF08\u6574\u6570\u306E\u307F\uFF09\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRIntNumeric",
			format: "",
			validation: "client"
		}];
		this.makePriceFormElements();
		this.makeFormButton();
		this.addFormPriceListStep();
		this.addJs("pricelistAddMod.js");
		this.setAssign("onLoad", "setSort()");
	}

	addFormPriceListStep() {}

	getProductIDList() {
		var H_postdata = this.gSess().getSelf("postdata");
		var A_productid = Object.keys(H_postdata.productid);
		var H_list = H_postdata.productid;
		var tmp_cnt = 1;

		for (var productid in H_list) {
			var val = H_list[productid];

			if (undefined !== H_postdata["_" + productid + "_sort"] == true && H_postdata["_" + productid + "_sort"] != "") {
				H_list[productid] = H_postdata["_" + productid + "_sort"];
			} else {
				H_list[productid] = "no" + tmp_cnt;
				tmp_cnt++;
			}
		}

		asort(H_list);
		return Object.keys(H_list);
	}

	makePriceFormElements() //5G対応 20200610 hanashima
	//$H_product = $O_product->getProductNameList($A_productid);
	//docomo
	{
		var ppid = this.gSess().getSelf("pattern");
		var A_productid = this.getProductIDList();
		var O_product = new AdminProductModel();
		var H_product = O_product.getProductNameAndCiridList(A_productid);

		if (ppid == 1) {
			this.makeFormDocomo(A_productid, H_product);
		} else if (ppid == 2) {
			this.makeFormPublic(A_productid, H_product, 1);
		} else if (ppid == 3) {
			this.makeFormAu(A_productid, H_product);
		} else if (ppid == 4) {
			this.makeFormPublic(A_productid, H_product, 7);
		} else if (ppid == 5) {
			this.makeFormSoftbank(A_productid, H_product);
		} else if (ppid == 6) {
			this.makeFormPublic(A_productid, H_product, 10);
		} else if (ppid == 7) {
			this.makeFormWillcom(A_productid, H_product);
		} else if (ppid == 8) {
			this.makeFormPublic(A_productid, H_product, 4);
		} else if (ppid == 9) {
			this.makeFormEmobile(A_productid, H_product);
		} else if (ppid == 10) {
			this.makeFormPublic(A_productid, H_product, 13);
		} else if (ppid == 11) {
			this.makeFormPublic(A_productid, H_product, 19);
		} else if (ppid == 12) {
			this.makeFormPublic(A_productid, H_product, 19);
		}
	}

	makeFormDocomo(A_productid: {} | any[], H_product: {} | any[]) {
		for (var i in A_productid) //5G対応 hanashima 20200610
		//5G: 93
		//バリュー: 2
		//array_push($this->A_elements, array("name" => "_" . $productid . "_0-0_3_1", "inputtype" => "text", "options" => array("size" => "4", "maxlength" => "7")));
		//$this->addNumericRule("_" . $productid . "_0-0_3_1");
		//array_push($this->A_elements, array("name" => "_" . $productid . "_0-100_3_1", "inputtype" => "text", "options" => array("size" => "4", "maxlength" => "7")));
		//$this->addNumericRule("_" . $productid . "_0-100_3_1");
		//array_push($this->A_elements, array("name" => "_" . $productid . "_13-100_3_1", "inputtype" => "text", "options" => array("size" => "4", "maxlength" => "7")));
		//$this->addNumericRule("_" . $productid . "_13-100_3_1");
		//array_push($this->A_elements, array("name" => "_" . $productid . "_1-12_3_1", "inputtype" => "text", "options" => array("size" => "4", "maxlength" => "7")));
		//$this->addNumericRule("_" . $productid . "_1-12_3_1");
		{
			var productid = A_productid[i];
			var buyselid = H_product[productid][1] == 96 ? 93 : 2;
			this.A_elements.push({
				name: "_" + productid + "_sort",
				label: H_product[productid][0],
				inputtype: "text",
				options: {
					size: "3",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_sort", "required", H_product[productid][0] + "-\u9806\u5E8F\u306F");
			this.A_elements.push({
				name: "_" + productid + "_0-0_" + buyselid + "_1",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_" + buyselid + "_1");
			this.A_elements.push({
				name: "_" + productid + "_0-0_" + buyselid + "_downmoney",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_" + buyselid + "_downmoney");
			this.A_elements.push({
				name: "_" + productid + "_0-0_" + buyselid + "_12",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_" + buyselid + "_12");
			this.A_elements.push({
				name: "_" + productid + "_0-0_" + buyselid + "_24",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_" + buyselid + "_24");
			this.A_elements.push({
				name: "_" + productid + "_0-0_" + buyselid + "_36",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_" + buyselid + "_36");
			this.A_elements.push({
				name: "_" + productid + "_0-100_" + buyselid + "_1",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-100_" + buyselid + "_1");
			this.A_elements.push({
				name: "_" + productid + "_0-100_" + buyselid + "_downmoney",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-100_" + buyselid + "_downmoney");
			this.A_elements.push({
				name: "_" + productid + "_0-100_" + buyselid + "_12",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-100_" + buyselid + "_12");
			this.A_elements.push({
				name: "_" + productid + "_0-100_" + buyselid + "_24",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-100_" + buyselid + "_24");
			this.A_elements.push({
				name: "_" + productid + "_0-100_" + buyselid + "_36",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-100_" + buyselid + "_36");
			this.A_elements.push({
				name: "_" + productid + "_13-100_" + buyselid + "_1",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_13-100_" + buyselid + "_1");
			this.A_elements.push({
				name: "_" + productid + "_13-100_" + buyselid + "_downmoney",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_13-100_" + buyselid + "_downmoney");
			this.A_elements.push({
				name: "_" + productid + "_13-100_" + buyselid + "_12",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_13-100_" + buyselid + "_12");
			this.A_elements.push({
				name: "_" + productid + "_13-100_" + buyselid + "_24",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_13-100_" + buyselid + "_24");
			this.A_elements.push({
				name: "_" + productid + "_13-100_" + buyselid + "_36",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_13-100_" + buyselid + "_36");
			this.A_elements.push({
				name: "_" + productid + "_1-12_" + buyselid + "_1",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-12_" + buyselid + "_1");
			this.A_elements.push({
				name: "_" + productid + "_1-12_" + buyselid + "_downmoney",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-12_" + buyselid + "_downmoney");
			this.A_elements.push({
				name: "_" + productid + "_1-12_" + buyselid + "_12",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-12_" + buyselid + "_12");
			this.A_elements.push({
				name: "_" + productid + "_1-12_" + buyselid + "_24",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-12_" + buyselid + "_24");
			this.A_elements.push({
				name: "_" + productid + "_1-12_" + buyselid + "_36",
				inputtype: "text",
				options: {
					size: "4",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-12_" + buyselid + "_36");
			this.A_elements.push({
				name: "_" + productid + "_memo",
				label: "_END_",
				inputtype: "textarea",
				options: {
					rows: "2",
					cols: "20"
				}
			});
		}
	}

	makeFormPublic(A_productid: {} | any[], H_product: {} | any[], buyselid = 1) {
		for (var i in A_productid) {
			var productid = A_productid[i];
			this.A_elements.push({
				name: "_" + productid + "_sort",
				label: H_product[productid][0],
				inputtype: "text",
				options: {
					size: "3",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_sort", "required", "\u9806\u5E8F\u306F");
			this.A_elements.push({
				name: "_" + productid + "_0-0_" + buyselid + "_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_" + buyselid + "_1");
			this.A_elements.push({
				name: "_" + productid + "_memo",
				label: "_END_",
				inputtype: "textarea",
				options: {
					rows: "2",
					cols: "20"
				}
			});
		}
	}

	makeFormAu(A_productid: {} | any[], H_product: {} | any[]) {
		for (var i in A_productid) //5G対応 hanashima 20200610
		//5G:94
		//シンプル:8
		//array_push($this->A_elements, array("name" => "_" . $productid . "_0-0_27_1", "inputtype" => "text", "options" => array("size" => "7", "maxlength" => "7")));
		//$this->addNumericRule("_" . $productid . "_0-0_27_1");
		//array_push($this->A_elements, array("name" => "_" . $productid . "_0-100_27_1", "inputtype" => "text", "options" => array("size" => "7", "maxlength" => "7")));
		//$this->addNumericRule("_" . $productid . "_0-100_27_1");
		//array_push($this->A_elements, array("name" => "_" . $productid . "_1-100_27_1", "inputtype" => "text", "options" => array("size" => "7", "maxlength" => "7")));
		//$this->addNumericRule("_" . $productid . "_1-100_27_1");
		{
			var productid = A_productid[i];
			var buyselid = H_product[productid][1] == 97 ? 94 : 8;
			this.A_elements.push({
				name: "_" + productid + "_sort",
				label: H_product[productid][0],
				inputtype: "text",
				options: {
					size: "3",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_sort", "required", "\u9806\u5E8F\u306F");
			this.A_elements.push({
				name: "_" + productid + "_0-0_" + buyselid + "_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_" + buyselid + "_1");
			this.A_elements.push({
				name: "_" + productid + "_0-100_" + buyselid + "_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-100_" + buyselid + "_1");
			this.A_elements.push({
				name: "_" + productid + "_1-100_" + buyselid + "_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-100_" + buyselid + "_1");
			this.A_elements.push({
				name: "_" + productid + "_memo",
				label: "_END_",
				inputtype: "textarea",
				options: {
					rows: "2",
					cols: "20"
				}
			});
		}
	}

	makeFormSoftbank(A_productid: {} | any[], H_product: {} | any[]) {
		for (var i in A_productid) //新規
		//機変
		{
			var productid = A_productid[i];
			this.A_elements.push({
				name: "_" + productid + "_sort",
				label: H_product[productid][0],
				inputtype: "text",
				options: {
					size: "3",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_sort", "required", "\u9806\u5E8F\u306F");
			this.A_elements.push({
				name: "_" + productid + "_0-993_11_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-993_11_1");
			this.A_elements.push({
				name: "_" + productid + "_0-994_11_24",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-994_11_24");
			this.A_elements.push({
				name: "_" + productid + "_0-995_12_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-995_12_1");
			this.A_elements.push({
				name: "_" + productid + "_0-0_12_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_12_1");
			this.A_elements.push({
				name: "_" + productid + "_1-997_11_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-997_11_1");
			this.A_elements.push({
				name: "_" + productid + "_1-998_11_24",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-998_11_24");
			this.A_elements.push({
				name: "_" + productid + "_24-101_12_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_24-101_12_1");
			this.A_elements.push({
				name: "_" + productid + "_24-100_12_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_24-100_12_1");
			this.A_elements.push({
				name: "_" + productid + "_18-23_12_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_18-23_12_1");
			this.A_elements.push({
				name: "_" + productid + "_12-17_12_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_12-17_12_1");
			this.A_elements.push({
				name: "_" + productid + "_3-11_12_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_3-11_12_1");
			this.A_elements.push({
				name: "_" + productid + "_memo",
				label: "_END_",
				inputtype: "textarea",
				options: {
					rows: "2",
					cols: "20"
				}
			});
		}
	}

	makeFormWillcom(A_productid: {} | any[], H_product: {} | any[]) {
		for (var i in A_productid) //array_push($this->A_elements, array("name" => "_" . $productid . "_0-0_5_1", "inputtype" => "text", "options" => array("size" => "7", "maxlength" => "7")));
		//			$this->addNumericRule("_" . $productid . "_0-0_5_1");
		//			array_push($this->A_elements, array("name" => "_" . $productid . "_0-0_6_1", "inputtype" => "text", "options" => array("size" => "7", "maxlength" => "7")));
		//			$this->addNumericRule("_" . $productid . "_0-0_6_1");
		{
			var productid = A_productid[i];
			this.A_elements.push({
				name: "_" + productid + "_sort",
				label: H_product[productid][0],
				inputtype: "text",
				options: {
					size: "3",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_sort", "required", "\u9806\u5E8F\u306F");
			this.A_elements.push({
				name: "_" + productid + "_0-0_4_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_4_1");
			this.A_elements.push({
				name: "_" + productid + "_6-9_4_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_6-9_4_1");
			this.A_elements.push({
				name: "_" + productid + "_10-100_4_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_10-100_4_1");
			this.A_elements.push({
				name: "_" + productid + "_memo",
				label: "_END_",
				inputtype: "textarea",
				options: {
					rows: "2",
					cols: "20"
				}
			});
		}
	}

	makeFormEmobile(A_productid: {} | any[], H_product: {} | any[]) {
		for (var i in A_productid) {
			var productid = A_productid[i];
			this.A_elements.push({
				name: "_" + productid + "_sort",
				label: H_product[productid][0],
				inputtype: "text",
				options: {
					size: "3",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_sort", "required", "\u9806\u5E8F\u306F");
			this.A_elements.push({
				name: "_" + productid + "_0-0_18_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_18_1");
			this.A_elements.push({
				name: "_" + productid + "_0-0_51_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_51_1");
			this.A_elements.push({
				name: "_" + productid + "_0-0_52_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_52_1");
			this.A_elements.push({
				name: "_" + productid + "_0-0_89_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_89_1");
			this.A_elements.push({
				name: "_" + productid + "_0-0_90_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_90_1");
			this.A_elements.push({
				name: "_" + productid + "_0-0_91_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_0-0_91_1");
			this.A_elements.push({
				name: "_" + productid + "_1-100_18_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-100_18_1");
			this.A_elements.push({
				name: "_" + productid + "_1-100_51_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-100_51_1");
			this.A_elements.push({
				name: "_" + productid + "_1-100_52_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-100_52_1");
			this.A_elements.push({
				name: "_" + productid + "_1-100_89_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-100_89_1");
			this.A_elements.push({
				name: "_" + productid + "_1-100_90_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-100_90_1");
			this.A_elements.push({
				name: "_" + productid + "_1-100_91_1",
				inputtype: "text",
				options: {
					size: "7",
					maxlength: "7"
				}
			});
			this.addNumericRule("_" + productid + "_1-100_91_1");
			this.A_elements.push({
				name: "_" + productid + "_memo",
				label: "_END_",
				inputtype: "textarea",
				options: {
					rows: "2",
					cols: "20"
				}
			});
		}
	}

	addNumericRule(name, format = undefined, name_str = "\u4FA1\u683C\u306F", mess = "\u534A\u89D2\u6570\u5B57\uFF08\u6574\u6570\u306E\u307F\uFF09\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044") //array_push($this->A_rule,  array("name" => $name, "mess" => $mess, "type" => "numeric", "format" => null, "validation" => "client"));
	{
		this.A_rule.push({
			name: name,
			mess: name_str + mess,
			type: "QRIntNumeric",
			format: format,
			validation: "client"
		});
	}

	makeFormButton() {
		this.setAssign("submit_name", this.submit_name);
		this.A_elements.push({
			name: "submit",
			label: this.submit_name,
			inputtype: "submit"
		}, {
			name: "cancel",
			label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
			inputtype: "button",
			options: {
				onClick: "ask_cancel()"
			}
		});
	}

	makeFromBackButton() {
		this.A_elements.push({
			name: "back",
			label: "\u5165\u529B\u753B\u9762\u306B\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "goFormStep('back_input_pricelist')"
			}
		});
	}

	makeFormElements() {
		var sess = this.gSess().getSelf("postdata");
		this.A_elements.push({
			name: "submit",
			label: "\u78BA\u8A8D\u753B\u9762\u3078",
			inputtype: "submit"
		});
		this.A_elements.push({
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			options: {
				onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "?r=1'"
			},
			inputtype: "button"
		});
		this.A_elements.push({
			name: "submit",
			label: this.submit_name,
			inputtype: "submit"
		});
		this.O_Qf.freezeWrapper();
		this.gSess().clearSessionKeySelf("submit");
	}

	setDefaults(H_def = undefined) {
		if (Array.isArray(H_def) == false) {
			H_def = this.gSess().getSelf("postdata");

			if (is_null(H_def.defaultflg) && H_def.defaultflg == true) {
				H_def.defaultflg[1] = 1;
			}

			H_def = Array.from(H_def + {
				datefrom: {
					Y: date("Y"),
					m: date("m"),
					d: date("d")
				},
				dateto: {
					Y: date("Y"),
					m: date("m"),
					d: date("d") + 1
				}
			});

			if (false == (undefined !== H_def.mailstatus)) {
				H_def.mailstatus = 0;
			}
		}

		this.O_Qf.setDefaultsWrapper(H_def);
	}

	assignForm() //if($this->O_Qf->validateWrapper() == true){
	{
		this.O_Qf.setFormElement(this.A_elements);
		var O_form = this.O_Qf.makeFormObject();
		this.makeFormRules();

		if (this.getFormStep() == "confirm_pricelist") {
			this.O_Qf.freezeWrapper();
		}

		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	makeFormRules() {
		this.O_Qf.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.O_Qf.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.O_Qf.makeFormRule(this.A_rule);
	}

	getDateFormat(empty_opt = false) {
		var temp = this.gSess().getSelf("postdata");

		if (true == is_null(temp.datefrom.Y)) {
			var date = date("Y");
		} else {
			if (+(temp.datefrom.Y > date("Y"))) {
				date = date("Y");
			} else {
				date = temp.datefrom.Y;
			}
		}

		var H_date = {
			minYear: date,
			maxYear: date("Y") + 1,
			format: "Y \u5E74 m \u6708 d \u65E5",
			language: "ja"
		};

		if (empty_opt === true) {
			H_date.addEmptyOption = true;
			H_date.emptyOptionValue = "";
			H_date.emptyOptionText = "--";
		}

		return H_date;
	}

	setFinishArg(finish_name = "", back_url = "", back_name = "") {
		this.finish_name = finish_name;
		this.back_url = back_url;
		this.back_name = back_name;
	}

	displayFinish() //二重登録を防止
	//完了画面
	{
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish(this.finish_name, this.back_url, this.back_name);
	}

	clearSessSelf() {
		this.gSess().clearSessionSelf();
	}

	__destruct() {
		super.__destruct();
	}

};