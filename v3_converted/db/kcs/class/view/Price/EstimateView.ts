//
//見積Viewの基底クラス
//
//更新履歴：<br>
//2008/12/03 宮澤龍彦 作成
//
//@package Price
//@subpackage View
//@author miyazawa
//@since 2008/12/03
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//
//見積Viewの基底クラス
//
//@package Price
//@subpackage View
//@author miyazawa
//@since 2008/05/19
//@uses MtSetting
//@uses MtSession
//

require("view/Order/OrderFormView.php");

//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//買い物カゴに使う配列
//
//@var mixed
//@access protected
//
//
//デフォルトでフリーズに使う配列
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
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author miyazawa
//@since 2008/05/13
//
//@access public
//@return array
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
//POSTをsessionにセットする<br>
//
//@author igarashi
//@since 2008/06/09
//
//@access public
//@return none
//
//
//ディレクトリセッションにカゴの情報を入れる
//
//@author miyazawa
//@since 2008/08/18
//
//@param mixed $H_product
//@access public
//@return void
//
//
//ディレクトリセッションに付属品直接入力の情報を入れる
//
//@author miyazawa
//@since 2008/08/18
//
//@param mixed $H_product
//@access public
//@return void
//
//
//かご部分の商品別項目作成
//
//@author igarashi
//@since 2008/06/18
//
//@param object $O_model(OrderFormModel)
//@param int $H_sess(セッション情報)
//
//@access public
//@return boolean
//
//
//かご部分の計算ボタンと付属品別項目作成
//
//@author igarashi
//@since 2008/06/18
//
//@param array $H_sess
//@param array $H_sess
//@access protected
//@return void
//
//
//注文フォームを作成する<br>
//
//@author miyazawa
//@since 2008/05/20
//
//@access public
//@return void
//
//
//かご部分の商品別項目に渡すQuickFormオプション
//
//@author igarashi
//@since 2008/06/18
//
//@param array $H_sess
//@access protected
//@return void
//
//
//デフォルト値作成
//
//@author miyazawa
//@since 2008/12/10
//
//@param mixed $H_sess
//@access public
//@return mixed
//
//
//freeze処理をする <br>
//
//ボタン名の変更 <br>
//エラーチェックを外す <br>
//freezeする <br>
//
//@author miyazawa
//@since 2008/03/11
//
//@access public
//@return void
//
//
//freezeさせない時の処理 <br>
//
//ボタン名の変更 <br>
//
//@author houshiyama
//@since 2008/03/12
//
//@access public
//@return void
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
//@param array $H_Product（カゴの情報）
//@param array $H_g_sess（グローバル変数）
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
class EstimateView extends OrderFormView {
	constructor(H_param = Array()) {
		super(H_param);
		this.A_ordinput = ["applyprice", "acce", "pointradio", "point", "submitName"];
		this.A_boxinput = ["productname", "purchase", "color", "pay_frequency", "boxopen"];
	}

	getHeaderJS() {}

	makePankuzuLinkHash() //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var H_link = {
				"/Price/menu.php": "Price List",
				"": "Estimate"
			};
		} else {
			H_link = {
				"/Price/menu.php": "\u4FA1\u683C\u8868",
				"": "\u898B\u7A4D"
			};
		}

		return H_link;
	}

	getCSS(site_flg = "") {
		if (site_flg == EstimateView.SITE_SHOP) {
			return "actorderDetail";
		} else {
			return "csOrder";
		}
	}

	checkCGIParam() //GETパラメータ
	//リセット
	{
		if (_GET.r != "") //商品情報消す
			//数量、色等の入力データもクリア 20090508miya
			//数量、色等の入力データもクリア 20090508miya
			{
				delete this.H_Dir.price_detailid;
				delete this.H_Dir.free_acce;
				delete this.H_Local;
				this.O_Sess.SetPub(EstimateView.PUB, this.H_Dir);
				this.O_Sess.SetSelfAll(this.H_Local);
				header("Location: " + _SERVER.PHP_SELF);
				throw die();
			}

		var infcnt = 0;

		for (var key in _POST) //買い物カゴ
		//確認画面からの戻り対策
		{
			var val = _POST[key];

			if (true == (-1 !== this.A_boxinput.indexOf(key))) {
				infcnt++;
			}

			this.H_Local[key] = val;

			if ("" != _POST.backName && "" != this.H_Local.submitName) {
				delete this.H_Local.submitName;
			} else if ("" != _POST.submitName && "" != this.H_Local.backName) {
				delete this.H_Local.backName;
			}
		}

		this.H_Dir.carid = +this.H_Dir.carid;
		this.H_Dir.cirid = +this.H_Dir.cirid;

		if (true == (undefined !== this.H_Local.applyprice)) {
			this.H_Local.applyprice = +this.H_Local.applyprice;
		}

		if (true == (undefined !== this.H_Local.point)) {
			this.H_Local.point = +this.H_Local.point;
		}

		if (true == (undefined !== H_free_acce)) {
			this.H_Dir.free_acce.push(H_free_acce);
		}

		this.O_Sess.SetPub(EstimateView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	setProductInfo(H_product: {} | any[]) {
		this.H_Dir.H_product = H_product;
		this.O_Sess.SetPub(EstimateView.PUB, this.H_Dir);
	}

	setFreeAcce(H_free_acce: {} | any[]) {
		this.H_Dir.free_acce = H_free_acce;
		this.O_Sess.SetPub(EstimateView.PUB, this.H_Dir);
	}

	makeOrderBoxInputForm(O_model, H_sess, site) //英語化権限 20090210miya
	//カゴの情報
	//価格表からの注文
	//価格表からの注文
	//かご部分の計算ボタンと付属品別項目作成
	//$A_form = array_merge($A_form, $this->makeOrderBoxDetailForm($H_sess, $H_order, $O_model));
	//QuickFormUtilObjectがあるかチェック
	//ルールもここで作ってしまう
	//英語化 20090402miya
	{
		if (true == this.H_Dir.eng) {
			var eng = true;
			var colorstr = "Color";
			var property_str = "Any Color";
		} else {
			eng = false;
			colorstr = "\u8272";
			property_str = "\u6307\u5B9A\u306A\u3057";
		}

		var H_order = H_sess[EstimateView.PUB].H_product;

		if (false == Array.isArray(H_order)) {
			H_order = Array();
		}

		var A_form = [{
			name: "applyrpice",
			label: applyprc_str,
			inputtype: "text"
		}];
		var A_rule = Array();

		if (true == (undefined !== H_sess[EstimateView.PUB].price_detailid)) {
			if (true == (undefined !== H_order.tel.productid)) //色はselect
				//機種名はhidden
				{
					var A_disable = {
						disabled: "true"
					};
					A_form.push({
						name: "color",
						label: colorstr,
						inputtype: "select",
						data: {
							"\u6307\u5B9A\u306A\u3057": property_str
						} + Array.from(O_model.getProductProperty(H_order.tel.productid))
					});
					A_form.push({
						name: "productname",
						inputtype: "hidden"
					});
				}
		} else //機種名はtext
			//色はtext
			{
				A_disable = {
					disabled: "false"
				};
				A_form.push({
					name: "productname",
					label: productnamestr,
					inputtype: "text"
				});
				A_form.push({
					name: "color",
					label: colorstr,
					inputtype: "text"
				});
			}

		if (true == (undefined !== H_sess[EstimateView.PUB].price_detailid)) //価格表ではなく手動入力での注文
			{
				var idx = 0;
			} else {}

		var H_temp = this.makeOrderBoxDetailForm(H_sess, H_order, O_model);
		A_form = array_merge(A_form, H_temp.A_elem);
		A_rule = array_merge(A_rule, H_temp.A_rule);
		this.checkQuickFormObject();
		this.H_View.O_OrderFormUtil.setFormElement(A_form);
		this.InputForm = this.H_View.O_OrderFormUtil.makeFormObject();

		if (true == this.H_Dir.eng) {
			this.H_View.O_OrderFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_OrderFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_OrderFormUtil.makeFormRule(A_rule);
	}

	makeOrderBoxDetailForm(H_sess, H_order, O_model) //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var property_str = "Any Color";
			var calc_str = "Calculate";
			var rule_isnum_str = ": Enter Qty in single-byte numbers.";
		} else {
			property_str = "\u6307\u5B9A\u306A\u3057";
			calc_str = "\u8A08\u7B97\u3059\u308B";
			rule_isnum_str = "\u306E\u6570\u91CF\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
		}

		if (H_sess[EstimateView.PUB].telcount != "") {
			var telcount = H_sess[EstimateView.PUB].telcount;
		} else {
			telcount = 0;
		}

		var A_elem = [{
			name: "calc",
			label: calc_str,
			inputtype: "button",
			options: {
				onClick: "calcOrder(3, " + H_sess[EstimateView.PUB].carid + ", " + telcount + ")"
			}
		}];
		var A_rule = Array();

		if (0 < H_order.acce.length) {
			{
				let _tmp_0 = H_order.acce;

				for (var key in _tmp_0) //色はselect
				//入力チェック
				{
					var val = _tmp_0[key];
					var A_color = {
						"\u6307\u5B9A\u306A\u3057": property_str
					};
					var A_colortmp = Array.from(O_model.getProductProperty(val.productid));

					for (var cky in A_colortmp) {
						var cvl = A_colortmp[cky];

						if ("" == cky) {
							delete A_colortmp[cky];
						}
					}

					if (true == 0 < A_colortmp.length) {
						A_color = A_color + A_colortmp;
					}

					A_elem.push({
						name: "acce" + val.productid,
						label: val.productname,
						inputtype: "text",
						options: this.makeItemDetailFormOption(val.productid)
					});
					A_elem.push({
						name: "color" + val.productid,
						label: "\u8272",
						inputtype: "select",
						data: A_color
					});
					A_rule.push({
						name: "acce" + val.productid,
						mess: val.productname + rule_isnum_str,
						type: "regex",
						format: "/^[0-9]+$/",
						validation: "client",
						reset: false,
						force: false
					});
				}
			}
		}

		var H_result = {
			A_elem: A_elem,
			A_rule: A_rule
		};
		return H_result;
	}

	makeOrderForm() //英語化権限 20090210miya
	//クイックフォームオブジェクト生成
	{
		if (true == this.H_Dir.eng) {
			var applyprc_str = "Total";
		} else {
			applyprc_str = "\u7533\u8ACB\u91D1\u984D";
		}

		this.checkQuickFormObject();
		this.H_View.O_OrderFormUtil.O_Form.addElement("text", "applyprice", applyprc_str, {
			size: "25",
			maxlength: 9
		});
		this.O_OrderForm = this.H_View.O_OrderFormUtil.makeFormObject();
	}

	makeItemDetailFormOption(idx) {
		return {
			size: "3",
			maxlength: "2",
			id: "acce" + idx
		};
	}

	makeEstimateDefault(H_sess: {} | any[]) //数量と色は価格表から戻ってきたときに入力値をデフォルトセット
	//申請金額は間違いを防ぐためにセットしないでおく
	{
		var H_def = Array();

		if (true == Array.isArray(H_sess.SELF)) {
			{
				let _tmp_1 = H_sess.SELF;

				for (var key in _tmp_1) {
					var val = _tmp_1[key];

					if (true == preg_match("/^acce/", key) || true == preg_match("/^color/", key)) {
						H_def[key] = val;
					}
				}
			}
		}

		return H_def;
	}

	freezeForm() //英語化権限
	{
		if (true == this.H_Dir.eng) {
			var backnamestr = EstimateView.BACKNAME_ENG;
		} else {
			backnamestr = EstimateView.BACKNAME;
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "backName", backnamestr, {
			id: "backName",
			value: backnamestr
		});
		this.H_View.O_OrderFormUtil.freezeWrapper();
	}

	unfreezeForm() //英語化権限
	//$this->H_View["O_OrderFormUtil"]->updateElementAttrWrapper( "submit", array( "value" => self::NEXTNAME ) );
	{
		if (true == this.H_Dir.eng) {
			var nextnamestr = EstimateView.NEXTNAME_ENG;
		} else {
			nextnamestr = EstimateView.NEXTNAME;
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", nextnamestr, {
			id: "submitName",
			value: nextnamestr
		});

		if (this.A_frz.length > 0) {
			this.H_View.O_OrderFormUtil.O_Form.freeze(this.A_frz);
		}
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], H_product: {} | any[], H_g_sess: {} | any[] = Array(), ptuni = 0) //QuickFormとSmartyの合体
	//assign
	//display
	{
		this.getOut().debugOut("view/Order/OrderFormView::displaySmarty()", false);
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_OrderForm.accept(O_renderer);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("css", this.H_View.css);
		this.get_Smarty().assign("cssTh", this.H_View.css + "Th");
		this.get_Smarty().assign("ordinfo", H_product);
		this.get_Smarty().display(this.H_View.smarty_template);
	}

	__destruct() {
		super.__destruct();
	}

};