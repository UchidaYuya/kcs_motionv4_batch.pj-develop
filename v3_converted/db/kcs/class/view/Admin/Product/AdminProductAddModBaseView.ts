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

require("MtSetting.php");

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("model/CircuitModel.php");

require("model/PlanModel.php");

require("model/PacketModel.php");

require("model/OptionModel.php");

require("model/SmartCircuitModel.php");

require("model/Admin/Price/AdminPriceModel.php");

//
//H_assign
//
//@var mixed
//@access protected
//
//
//O_Sess
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
//H_postdata
//
//@var mixed
//@access protected
//
//
//submitFlag
//
//@var mixed
//@access protected
//
//
//O_cir
//
//@var mixed
//@access protected
//
//
//O_plan
//
//@var mixed
//@access protected
//
//
//O_packet
//
//@var mixed
//@access protected
//
//
//O_option
//
//@var mixed
//@access protected
//
//
//O_price_pattern
//
//@var mixed
//@access protected
//
//protected $O_price_pattern;
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
//O_Ini
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
//getPPIDfromIni
//
//@author katsushi
//@since 2008/08/07
//
//@param mixed $carid
//@param mixed $type
//@access public
//@return void
//
//
//getSubmitFlag
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
//@access public
//@return void
//
//
//makeFormRules
//
//@author katsushi
//@since 2008/07/22
//
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
//getDateFormat
//
//@author katsushi
//@since 2008/07/15
//
//@access public
//@return void
//
//
//addArrayStr
//
//@author katsushi
//@since 2008/07/18
//
//@param mixed $val
//@param string $bef_str
//@param string $aft_str
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
class AdminProductAddModBaseView extends ViewSmarty {
	constructor(H_navi) //$this->O_price_pattern = new AdminPriceModel();
	{
		super({
			site: ViewBaseHtml.SITE_ADMIN
		});
		this.O_Ini = MtSetting.singleton();
		this.O_Ini.loadConfig("price");
		this.O_Ini.loadConfig("product");
		this.O_Sess = MtSession.singleton();
		this.O_Qf = new QuickFormUtil("form");
		this.A_form = Array();
		this.H_postdata = Array();
		this.submitFlag = false;
		this.submit_name = "";
		this.H_assign = Array();
		this.H_assign.admin_fncname = H_navi[""];
		this.H_assign.shop_person = this.gSess().admin_name + " " + this.gSess().admin_personname;
		this.H_assign.admin_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "admin");
		this.addJs("xmlhttprequest.js");
		this.addJs("adminProductAddMod.js");
	}

	setSubmitName(submit_name) {
		this.submit_name = submit_name;
	}

	makeModelObj() //modelオブジェクトの生成
	{
		this.O_cir = new CircuitModel();
		this.O_plan = new PlanModel();
		this.O_packet = new PacketModel();
		this.O_option = new OptionModel();
	}

	checkCGIParam() {
		if (true == (undefined !== _POST.submit) && ("\u78BA\u8A8D\u753B\u9762\u3078" == _POST.submit || String(this.submit_name === _POST.submit))) {
			this.O_Sess.setSelf("submit", _POST.submit);
			delete _POST.submit;

			if (get_magic_quotes_gpc() == true) {
				for (var key in _POST) {
					var val = _POST[key];

					if (Array.isArray(val) == false) {
						_POST[key] = stripslashes(val);
					}

					if (key == "date1" || key == "date2") {
						if (val.Y == "" || val.m == "" || val.d == "") {
							_POST[key] = "";
						}
					}
				}
			}

			_POST.ppid = this.getPPIDfromIni(_POST.carid, _POST.type);
			this.O_Sess.setSelf("postdata", _POST);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == (undefined !== _GET.r)) {
			var productid = this.O_Sess.getSelf("productid");
			this.O_Sess.clearSessionSelf();

			if (productid !== undefined) {
				this.O_Sess.setSelf("productid", productid);
			}

			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.H_postdata = this.getPostData();
		var submit = this.O_Sess.getSelf("submit");

		if (false == !submit && String(this.submit_name === String(submit))) {
			this.submitFlag = true;
		}
	}

	getPPIDfromIni(carid, type) {
		var ppid = this.O_Ini[carid + "_" + type];
		return ppid;
	}

	getSubmitFlag() {
		return this.submitFlag;
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
		return this.O_Sess.getSelf("postdata");
	}

	setPostData(H_data) {
		this.O_Sess.setSelf("postdata", H_data);
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	getPriceNavi() {
		return this.PriceNavi;
	}

	makeFormElements(H_car: {} | any[]) //$H_smarttype = $O_smart->getSmartCircuitKeyHash();
	//戻ってきたときの復元
	{
		var sess = this.O_Sess.getSelf("postdata");
		var O_smart = new SmartCircuitModel();
		var H_smarttype = O_smart.getSmartCircuitNameHash();

		if (undefined !== sess.cirid == true && is_numeric(sess.cirid) == true) //$H_plan = $this->addArrayStr($this->O_plan->getPlanWithBuyselname($sess["carid"], $sess["cirid"]), "", "<br>\n");
			{
				this.makeModelObj();
				var H_cir = this.O_cir.getCircuitKeyHash(sess.carid);
				var H_cir_opt = {
					id: "cir",
					onChange: "chkboxChange()"
				};
				var H_plan = this.addArrayStr(this.O_plan.getPlanWithBuyselname(sess.carid, sess.cirid), "", "<br>\n");
				var H_packet = this.addArrayStr(this.O_packet.getPacketKeyHash(sess.carid, sess.cirid), "", "<br>");
				var H_option = this.addArrayStr(this.O_option.getOptionKeyHash(sess.carid, sess.cirid), "", "<br>");
				var H_service = this.addArrayStr(this.O_option.getDiscountKeyHash(sess.carid, sess.cirid), "", "<br>");
				this.setAssign("onLoad", "allVisible()");
			} else {
			H_cir = {
				"": "\u30AD\u30E3\u30EA\u30A2\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
			};
			H_cir_opt = {
				id: "cir",
				0: "disabled",
				onChange: "chkboxChange()"
			};
			H_plan = Array();
			H_packet = Array();
			H_option = Array();
			H_service = Array();
		}

		this.A_elements = [{
			name: "productname",
			label: "\u5546\u54C1\u540D",
			inputtype: "text",
			options: {
				size: "50"
			}
		}, {
			name: "carid",
			label: "\u30AD\u30E3\u30EA\u30A2",
			inputtype: "select",
			data: H_car,
			options: "onChange=\"cirChange(this)\""
		}, {
			name: "cirid",
			label: "\u56DE\u7DDA\u7A2E\u5225",
			inputtype: "select",
			data: H_cir,
			options: H_cir_opt
		}, {
			name: "seriesname",
			label: "\u30B7\u30EA\u30FC\u30BA\u540D",
			inputtype: "text",
			options: {
				size: "50"
			}
		}, {
			name: "modelnumber",
			label: "\u578B\u756A",
			inputtype: "text",
			options: {
				size: "50"
			}
		}, {
			name: "comment",
			label: "\u5546\u54C1\u8AAC\u660E",
			inputtype: "textarea"
		}, {
			name: "product_url",
			label: "\u5546\u54C1URL",
			inputtype: "text",
			options: {
				size: "50"
			}
		}, {
			name: "img_s",
			label: "\u753B\u50CF\u30D5\u30A1\u30A4\u30EB\u540D\uFF08\u5C0F\uFF09",
			inputtype: "text",
			options: {
				size: "50"
			}
		}, {
			name: "img_l",
			label: "\u753B\u50CF\u30D5\u30A1\u30A4\u30EB\u540D\uFF08\u5927\uFF09",
			inputtype: "text",
			options: {
				size: "50"
			}
		}, {
			name: "type",
			label: "\u5546\u54C1\u7A2E\u5225",
			inputtype: "select",
			data: {
				"\u96FB\u8A71": "\u96FB\u8A71",
				"\u4ED8\u5C5E\u54C1": "\u4ED8\u5C5E\u54C1"
			}
		}, {
			name: "maker",
			label: "\u30E1\u30FC\u30AB\u30FC",
			inputtype: "text",
			options: {
				size: "50"
			}
		}, {
			name: "plan",
			label: "\u4F9D\u5B58\u30D7\u30E9\u30F3",
			inputtype: "groupcheckbox",
			data: H_plan
		}, {
			name: "packet",
			label: "\u4F9D\u5B58\u30D1\u30B1\u30C3\u30C8",
			inputtype: "groupcheckbox",
			data: H_packet
		}, {
			name: "option",
			label: "\u4F9D\u5B58\u30AA\u30D7\u30B7\u30E7\u30F3",
			inputtype: "groupcheckbox",
			data: H_option
		}, {
			name: "service",
			label: "\u4F9D\u5B58\u5272\u5F15\u30B5\u30FC\u30D3\u30B9",
			inputtype: "groupcheckbox",
			data: H_service
		}, {
			name: "text1",
			label: this.O_Ini.product_text1,
			inputtype: "text"
		}, {
			name: "text2",
			label: this.O_Ini.product_text2,
			inputtype: "text"
		}, {
			name: "text3",
			label: this.O_Ini.product_text3,
			inputtype: "text"
		}, {
			name: "text4",
			label: this.O_Ini.product_text4,
			inputtype: "text"
		}, {
			name: "text5",
			label: this.O_Ini.product_text5,
			inputtype: "text"
		}, {
			name: "int1",
			label: this.O_Ini.product_int1,
			inputtype: "text"
		}, {
			name: "int2",
			label: this.O_Ini.product_int2,
			inputtype: "text"
		}, {
			name: "int3",
			label: this.O_Ini.product_int3,
			inputtype: "text"
		}, {
			name: "date1",
			label: this.O_Ini.product_date1,
			inputtype: "date",
			data: this.getDateFormat()
		}, {
			name: "date2",
			label: this.O_Ini.product_date2,
			inputtype: "date",
			data: this.getDateFormat()
		}, {
			name: "smart_type",
			label: "\u7AEF\u672B\u7A2E\u5225",
			inputtype: "select",
			data: H_smarttype
		}];

		if (this.O_Sess.getSelf("submit") == "") {
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
		} else {
			this.A_elements.push({
				name: "submit",
				label: this.submit_name,
				inputtype: "submit"
			});
			this.A_elements.push({
				name: "reset",
				label: "\u623B\u308B",
				options: {
					onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "'"
				},
				inputtype: "button"
			});
			this.O_Qf.freezeWrapper();
			this.O_Sess.clearSessionKeySelf("submit");
		}
	}

	makeFormRules() {
		var A_grouprule = [{
			name: "productname",
			mess: "\u5546\u54C1\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "carid",
			mess: "\u30AD\u30E3\u30EA\u30A2\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "seriesname",
			mess: "\u5546\u54C1\u30B7\u30EA\u30FC\u30BA\u540D\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "int1",
			mess: this.O_Ini.product_int1 + "\u306F\u6570\u5024\uFF08\u6574\u6570\u306E\u307F\uFF09\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		}, {
			name: "int2",
			mess: this.O_Ini.product_int2 + "\u306F\u6570\u5024\uFF08\u6574\u6570\u306E\u307F\uFF09\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		}, {
			name: "int3",
			mess: this.O_Ini.product_int3 + "\u306F\u6570\u5024\uFF08\u6574\u6570\u306E\u307F\uFF09\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "QRIntNumeric",
			format: undefined,
			validation: "client"
		}, {
			name: "date1",
			mess: this.O_Ini.product_date1 + "\u304C\u7121\u52B9\u306A\u65E5\u4ED8\u3067\u3059",
			type: "QRCheckDate",
			format: undefined,
			validation: "client"
		}, {
			name: "date2",
			mess: this.O_Ini.product_date2 + "\u304C\u7121\u52B9\u306A\u65E5\u4ED8\u3067\u3059",
			type: "QRCheckDate",
			format: undefined,
			validation: "client"
		}];
		this.O_Qf.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.O_Qf.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.O_Qf.makeFormRule(A_grouprule);
	}

	setDefaults(H_def = undefined) {
		if (Array.isArray(H_def) == false) {
			H_def = this.O_Sess.getSelf("postdata");
		}

		this.O_Qf.setDefaultsWrapper(H_def);
	}

	assignForm() {
		this.O_Qf.setFormElement(this.A_elements);
		var O_form = this.O_Qf.makeFormObject();
		this.makeFormRules();
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		O_form.accept(O_renderer);
		this.H_assign.O_form = O_renderer.toArray();
	}

	getDateFormat() {
		var H_date = {
			minYear: date("Y") - 20,
			maxYear: date("Y") + 20,
			format: "Y \u5E74 m \u6708 d \u65E5",
			language: "ja",
			addEmptyOption: true,
			emptyOptionValue: "",
			emptyOptionText: "--"
		};
		return H_date;
	}

	addArrayStr(map_array, bef_str = "", aft_str = "") {
		return new Function("$val", "return '" + bef_str + "' . $val . '" + aft_str + "';");
	}

	displayFinish(fnc) //二重登録を防止
	//完了画面
	{
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish(fnc, "/Admin/Product/menu.php", "\u5546\u54C1\u30DE\u30B9\u30BF\u30FC\u4E00\u89A7\u3078");
	}

	clearSessSelf() {
		this.O_Sess.clearSessionSelf();
	}

	__destruct() {
		super.__destruct();
	}

};