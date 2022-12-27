//
//雛型新規作成View
//
//更新履歴：<br>
//2008/07/08 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/07/08
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//雛型新規作成View
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/05/19
//@uses MtSetting
//@uses MtSession
//

require("view/Order/OrderFormView.php");

require("model/PlanModel.php");

//
//submitボタン名
//
//
//submitボタン名（確認画面用）
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
//POSTをsessionにセットする<br>
//
//@author miyazawa
//@since 2008/06/09
//
//@access public
//@return none
//
//
//雛型フォームのルール作成 （雛形の場合は電話詳細項目に番号を振らない」）
//
//@author miyazawa
//@since 2008/09/04
//
//@param mixed $H_rules
//@param mixed $telcnt
//@param mixed $A_auth
//@access protected
//@return void
//
//
//フォーム表示項目のうち必要なものを電話詳細表示用に名前を変える（雛形の場合は名前を変えないでそのまま返す）
//
//@author miyazawa
//@since 2008/06/10
//
//@param array $H_items
//@param int $telcount
//@access protected
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
//スタティック表示 <br>	// ※※※作りかけ：今はまだOrderから取ってきただけ※※※
//
//@author miyazawa
//@since 2008/06/16
//
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//既定の雛型選択 <br>
//
//@author miyazawa
//@since 2008/07/28
//
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//hiddenパラメータ <br>
//
//@author miyazawa
//@since 2008/07/15
//
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//雛型用のマスク <br>
//
//@author miyazawa
//@since 2008/07/16
//
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//注文フォームのデフォルト値作成
//
//@author miyazawa
//@since 2008/04/11
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $O_form_model
//@param mixed $H_view
//@access protected
//@return mixed
//
//
//テンプレート取得（order_formとは異なり、DBが無関係なのでViewから取得する）
//
//@author miyazawa
//@since 2008/07/09
//
//@param mixed $H_sess
//@access public
//@return string
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
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//mt_template_tbにINSERTするデータを作成 <br>
//
//@author miyazawa
//@since 2008/06/30
//
//@access public
//@param array $H_g_sess
//@param array $H_sess
//@return mixed
//
//
//完了画面表示 <br>
//
//セッションクリア <br>
//2重登録防止メソッド呼び出し <br>
//完了画面表示 <br>
//
//@author miyazawa
//@since 2008/06/27
//
//@access protected
//@return void
//
//
//雛型削除完了画面表示 <br>
//
//セッションクリア <br>
//2重登録防止メソッド呼び出し <br>
//完了画面表示 <br>
//
//@author miyazawa
//@since 2008/06/27
//
//@access protected
//@return void
//
//
//setCsrfidDel
//
//@author web
//@since 2012/05/10
//
//@param mixed $id
//@access public
//@return void
//
//
//assignPlanList
//
//@author web
//@since 2013/03/29
//
//@param mixed $H_sess
//@access public
//@return void
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
class TemplateAddView extends OrderFormView {
	static NEXTNAME = "\u78BA\u8A8D\u753B\u9762\u3078";
	static NEXTNAME_ENG = "To Confirmation Screen";
	static RECNAME = "\u767B\u9332\u3059\u308B";
	static RECNAME_ENG = "Regist";

	getHeaderJS() {}

	makePankuzuLinkHash() {
		if (MT_SITE == "shop") {
			var H_link = {
				"/Shop/MTHLTemplate/templatemenu.php": "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u96DB\u578B\u767B\u9332",
				"": "\u96DB\u578B\u65B0\u898F\u767B\u9332\uFF08" + this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname + "\uFF09"
			};
		} else //英語化権限 20090210miya
			{
				if (true == this.H_Dir.eng) {
					H_link = {
						"/MTTemplate/menu.php": "Order Template",
						"": "New template registration\uFF08" + this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname + "\uFF09"
					};
				} else {
					H_link = {
						"/MTTemplate/menu.php": "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u96DB\u578B\u767B\u9332",
						"": "\u96DB\u578B\u65B0\u898F\u767B\u9332\uFF08" + this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname + "\uFF09"
					};
				}
			}

		return H_link;
	}

	checkCGIParam() //リセット
	//type_carid_ciridの形式で$_POST["kind"]が入ってきたら必要情報としてセット
	//電話の件数は1を入れておく
	//チェックボックスはここでいったん消してPOSTから入れる（一度入れたwaribiki等でNG/必須エラーが出たとき、空にしてもセッションに残っていてエラーが消えないから） 20090507miya
	//確認画面からの戻りボタンの処理
	//ここで登録部署を設定
	{
		if (_GET.r != "") //商品情報消す
			{
				delete this.H_Dir.price_detailid;
				this.O_Sess.SetPub(TemplateAddView.PUB, this.H_Dir);
				header("Location: " + _SERVER.PHP_SELF);
				throw die();
			}

		var infcnt = 0;
		var A_type_car_cir = Array();

		if (_POST.kind != "") {
			A_type_car_cir = split("-", _POST.kind);
		}

		if (true == (undefined !== A_type_car_cir[0]) && "" != A_type_car_cir[0]) {
			this.H_Dir.type = A_type_car_cir[0];
		}

		if (true == (undefined !== A_type_car_cir[1]) && true == is_numeric(A_type_car_cir[1])) {
			this.H_Dir.carid = A_type_car_cir[1];
		}

		if (true == (undefined !== A_type_car_cir[2]) && true == is_numeric(A_type_car_cir[2])) {
			this.H_Dir.cirid = A_type_car_cir[2];
		}

		if (true == (undefined !== A_type_car_cir[3])) {
			this.H_Dir.ppid = A_type_car_cir[3];
		}

		this.switchCarrier(_POST);

		if (undefined !== _POST.othercarid) {
			this.H_Local.othercarid = _POST.othercarid;
		}

		this.H_Dir.from_template = true;
		this.H_Dir.telcount = 1;
		delete this.H_Local.option;
		delete this.H_Local.waribiki;
		delete this.H_Local.vodalive;
		delete this.H_Local.vodayuryo;

		for (var key in _POST) //買い物カゴ
		{
			var val = _POST[key];

			if (true == (-1 !== this.A_boxinput.indexOf(key))) {
				infcnt++;
			}

			this.H_Local[key] = val;
		}

		if (_POST.submitName != "") {
			delete this.H_Local.backName;
		} else if (_POST.backName) {
			delete this.H_Local.submitName;
		} else if (_POST.length > 0 && !("submitName" in _POST)) {
			delete this.H_Local.submitName;
		}

		if (this.H_Dir.type == "A") //電話から来たとき
			{
				if (this.H_Local.acceradio == "fromtel" && String(this.H_Local.telno != "")) //シリーズ・機種から来たとき
					{
						this.H_Local.boxopen = true;
					} else if (this.H_Local.acceradio == "fromproduct" && String(this.H_Local.series != "" || String(this.H_Local.telproduct != ""))) {
					this.H_Local.boxopen = true;
				}

				if (true == (undefined !== this.H_Local.free_productname) && 0 < this.H_Local.free_productname.length || true == (undefined !== this.H_Local.free_count) && 0 < this.H_Local.free_count.length || true == (undefined !== this.H_Local.free_property) && 0 < this.H_Local.free_property.length) //確認画面に行ったときは自由記入欄のパラメータを無視
					{
						if (false == (undefined !== this.H_Local.submitName) || "" == this.H_Local.submitName || !is_null(this.H_Local.submitName)) {
							var H_free_acce = {
								free_productname: this.H_Local.free_productname,
								free_count: this.H_Local.free_count,
								free_property: this.H_Local.free_property
							};
						}

						delete _POST.free_productname;
						delete _POST.free_count;
						delete _POST.free_property;
						delete this.H_Local.free_productname;
						delete this.H_Local.free_count;
						delete this.H_Local.free_property;
					}

				if (undefined != this.H_Dir.free_acce && true == Array.isArray(this.H_Dir.free_acce)) {
					for (var frcnt = 0; frcnt < this.H_Dir.free_acce.length; frcnt++) {
						if (true == (undefined !== this.H_Local["free_acce" + frcnt]) && true == is_integer(+this.H_Local["free_acce" + frcnt])) {
							this.H_Dir.free_acce[frcnt].free_count = this.H_Local["free_acce" + frcnt];
						}
					}
				}
			} else {
			if (true == (-1 !== ["N", "Nmnp", "C", "S"].indexOf(this.H_Dir.type))) //POSTで飛んでくるhandopenとboxopenの二つのフラグでカゴとカゴ以降の表示・非表示を切り替えている
				//初期はhandopen==0、boxopen==0（「価格表」「直接入力」のボタンが二つ表示されているだけの状態）
				{
					if (false == Array.isArray(this.H_Local) || 1 > this.H_Local.length) //手入力ならhandopen==1、boxopen==0。price_detailidを消す
						{
							if (true == (undefined !== this.H_Dir.price_detailid)) {
								this.H_Local.handopen = 0;
								this.H_Local.boxopen = 1;
							} else {
								this.H_Local.handopen = 0;
								this.H_Local.boxopen = 0;
							}
						} else {
						if (+(this.H_Local.handopen == 1 && +(this.H_Local.boxopen == 0))) //unset($this->H_Local["color"]);
							//手入力フォームの「購入リストに入れる」を押したとき
							{
								delete this.H_Dir.price_detailid;
								delete this.H_Local.productid;
								delete this.H_Local.productname;
								this.H_Local.color = "\u9078\u629E\u306A\u3057";
								delete this.H_Local.buyselid;
								delete this.H_Local.buytype1;
								delete this.H_Local.buytype2;
								delete this.H_Local.downmoney;
								delete this.H_Local.onepay;
								delete this.H_Local.totalprice;
								delete this.H_Local.purchase;
								delete this.H_Local.pay_frequency;
							} else if (+(this.H_Local.handopen == 0 && +(this.H_Local.boxopen == 1))) //それ以外はhandopen==0、boxopen==1
							{
								delete this.H_Local.productid;
								delete this.H_Local.buyselid;
								delete this.H_Local.buytype1;
								delete this.H_Local.buytype2;
								delete this.H_Local.downmoney;
								delete this.H_Local.onepay;
								delete this.H_Local.totalprice;
							} else {
							this.H_Local.handopen = 0;
							this.H_Local.boxopen = 1;
						}
					}
				} else {
				this.H_Local.handopen = undefined;
				this.H_Local.boxopen = undefined;
			}
		}

		if (String(_POST.recogpostid != "")) {
			this.H_View.recogpostid = _POST.recogpostid;
			this.H_View.recogpostname = _POST.recogpostname;
		}

		if (this.H_View.recogpostid == "" || this.H_View.recogpostname == "") {
			this.H_View.recogpostid = this.H_G_sess.postid;
			this.H_View.recogpostname = this.H_G_sess.current_postname;
		}

		if (!!_POST.h_recogcode) {
			this.H_View.recogcode = _POST.h_recogcode;
			this.H_View.recogname = _POST.h_recogname;
		}

		if (!!_POST.h_pbpostcode_h) {
			this.H_View.pbpostcode_h = _POST.h_pbpostcode_h;
		}

		if (!!_POST.h_pbpostcode) {
			this.H_View.pbpostcode = _POST.h_pbpostcode;
		}

		if (!!_POST.h_pbpostname) {
			this.H_View.pbpostname = _POST.h_pbpostname;
		}

		if (!!_POST.h_cfbpostcode_h) {
			this.H_View.cfbpostcode_h = _POST.h_cfbpostcode_h;
		}

		if (!!_POST.h_cfbpostname) {
			this.H_View.cfbpostname = _POST.h_cfbpostname;
		}

		if (!!_POST.h_cfbpostcode) {
			this.H_View.cfbpostcode = _POST.h_cfbpostcode;
		}

		if (!!_POST.h_recoguserid) {
			this.H_View.h_recoguserid = _POST.h_recoguserid;
		}

		if (this.A_boxinput.length == infcnt) {
			this.H_Local.openflg = true;
		} else {
			this.H_Local.openflg = false;
		}

		if (true == (undefined !== H_free_acce)) {
			this.H_Dir.free_acce.push(H_free_acce);
		}

		this.O_Sess.SetPub(TemplateAddView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	makeOrderRule(H_rules, telcnt = 0, A_auth = Array(), ptuni = 0) //QuickFormオブジェクトが作成されているか確認
	//注文の独自ルールをregist
	//clientで表示させる
	//英語化 20090402miya
	//DBから取得したルール配列をフォームオブジェクトに入れる
	//不要なルールを取り除いた配列の空白を詰める
	//$this->H_View["O_OrderFormUtil"]->updateAttributesWrapper(array( "onsubmit" => "" ) );
	{
		this.checkQuickFormObject();
		var A_order_rules = ["CheckboxCompareMultiple", "CheckboxCompareDateBefore", "CheckboxCompare", "CheckboxCompareMulti", "CheckdateRule", "DateBefore", "RadioCompareExSixElement", "RadioCompareExMulti", "RadioCompareExReverse", "checkMultiple", "dateComp", "QRCheckDate", "CheckboxCompare"];
		this.H_View.O_OrderFormUtil.registerOriginalRules(A_order_rules);

		if (true == this.H_Dir.eng) {
			this.H_View.O_OrderFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_OrderFormUtil.setDefaultWarningNote();
		}

		for (var i = 0; i < H_rules.length; i++) //公私分計だったら権限見て、なかったら除去（販売店のときも）
		{
			if (true == ereg("kousi", H_rules[i].name)) {
				if (-1 !== A_auth.indexOf("fnc_kousi") != true || MT_SITE == "shop") {
					H_rules[i] = undefined;
					continue;
				}
			} else if (true == ereg("terminal_del", H_rules[i].name)) {
				if (-1 !== A_auth.indexOf("fnc_assets_manage_adm_co") != true) {
					H_rules[i] = undefined;
					continue;
				}
			} else if (MT_SITE == "shop" && true == ereg("mail", H_rules[i].name)) {
				H_rules[i] = undefined;
				continue;
			}

			if (strpos(H_rules[i].name, "array") === 0) {
				H_rules[i].name = eval("return " + H_rules[i].name + ";");
			}

			if (strpos(H_rules[i].format, "array") === 0) {
				H_rules[i].format = eval("return " + H_rules[i].format + ";");
			}

			if (!H_rules[i].mess) {
				H_rules[i] = undefined;
			}

			if ("point" == H_rules[i].name && "checkMultiple" == H_rules[i].type && this.H_Dir.carid == 1 && ptuni != 0) {
				H_rules[i].format = ptuni;
				H_rules[i].mess = str_replace("100", ptuni, H_rules[i].mess);
			}
		}

		var H_rules_tmp = Array();

		for (var key in H_rules) {
			var val = H_rules[key];

			if ("" != val) {
				H_rules_tmp.push(val);
			}
		}

		H_rules = H_rules_tmp;
		this.H_View.O_OrderFormUtil.makeFormRule(H_rules);
	}

	makeOrderFormItemToTelDetail(H_items: {} | any[], telcount = 1) {
		return H_items;
	}

	freezeForm() //英語化権限
	//ダブルクリック防止
	{
		if (true == this.H_Dir.eng) {
			var recnamestr = TemplateAddView.RECNAME_ENG;
			var backnamestr = TemplateAddView.BACKNAME_ENG;
		} else {
			recnamestr = TemplateAddView.RECNAME;
			backnamestr = TemplateAddView.BACKNAME;
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", recnamestr, {
			id: "submitName",
			value: recnamestr
		});
		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "backName", backnamestr, {
			id: "backName",
			value: backnamestr
		});
		this.H_View.O_OrderFormUtil.updateAttributesWrapper({
			onsubmit: "return stop_w_click();"
		});
		this.H_View.O_OrderFormUtil.freezeWrapper();
	}

	unfreezeForm() //英語化権限
	//$this->H_View["O_OrderFormUtil"]->updateAttributesWrapper( array( "onsubmit" => "return activate_and_submit();" ) );	// カゴ入力項目活性化
	{
		if (true == this.H_Dir.eng) {
			var nextnamestr = TemplateAddView.NEXTNAME_ENG;
		} else {
			nextnamestr = TemplateAddView.NEXTNAME;
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", nextnamestr, {
			id: "submitName",
			value: nextnamestr
		});
	}

	makeFormStatic(H_g_sess: {} | any[]) //スタティック表示部分
	{
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "ptn", this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname);
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "comp", H_g_sess.compname);
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "loginname", H_g_sess.loginname);
	}

	makeFormDefTemp() //スタティック表示部分
	{
		if (true == this.H_Dir.eng) {
			A_deftemp.push(HTML_QuickForm.createElement("radio", undefined, undefined, "Yes", "1"));
			A_deftemp.push(HTML_QuickForm.createElement("radio", undefined, undefined, "No", "0"));
		} else {
			A_deftemp.push(HTML_QuickForm.createElement("radio", undefined, undefined, "\u3059\u308B", "1"));
			A_deftemp.push(HTML_QuickForm.createElement("radio", undefined, undefined, "\u3057\u306A\u3044", "0"));
		}

		this.H_View.O_OrderFormUtil.O_Form.addGroup(A_deftemp, "deftemp", "\u65E2\u5B9A");
	}

	makeHiddenParam() //登録部署
	{
		this.H_View.O_OrderFormUtil.O_Form.addElement("hidden", "recogpostname", this.H_View.recogpostname);
		this.H_View.O_OrderFormUtil.O_Form.addElement("hidden", "recogpostid", this.H_View.recogpostid);
	}

	makeBascketMask() //$this->A_mask[] = &HTML_QuickForm::createElement("checkbox", "sendhow_otodoke", null);
	//$this->A_mask[] = &HTML_QuickForm::createElement("checkbox", "sendhow_takuhai", null);
	//$this->A_mask[] = &HTML_QuickForm::createElement("checkbox", "sendhow_raiten", null);
	{
		this.A_mask.push(HTML_QuickForm.createElement("checkbox", "product", undefined));
		this.A_mask.push(HTML_QuickForm.createElement("checkbox", "listbtn", undefined));
		this.A_mask.push(HTML_QuickForm.createElement("checkbox", "handbtn", undefined));
		this.A_mask.push(HTML_QuickForm.createElement("checkbox", "productname", undefined));
		this.A_mask.push(HTML_QuickForm.createElement("checkbox", "color", undefined));
		this.A_mask.push(HTML_QuickForm.createElement("checkbox", "purchase", undefined));
		this.A_mask.push(HTML_QuickForm.createElement("checkbox", "pay_frequency", undefined));
		this.A_mask.push(HTML_QuickForm.createElement("checkbox", "accessory", undefined));
		this.A_mask.push(HTML_QuickForm.createElement("checkbox", "applyprice", undefined));
		this.H_View.O_OrderFormUtil.O_Form.addGroup(this.A_mask, "mask", "\u30DE\u30B9\u30AF");
	}

	makeOrderDefault(H_g_sess: {} | any[], H_sess: {} | any[], O_form_model: OrderFormModel, H_view) //デフォルト値配列
	//価格表からの入力
	//雛型名称等、価格表からの戻りに対応 20090219miya
	{
		var H_default = Array();

		if (true == (undefined !== H_sess[TemplateAddView.PUB].price_detailid) && true == Array.isArray(H_sess[TemplateAddView.PUB].H_product)) {
			var H_product = H_sess[TemplateAddView.PUB].H_product;

			if ("" != H_product.tel.buyselid) {
				H_default.purchase = H_product.tel.buyselid;
			}

			if ("" != H_product.tel.paycnt) {
				H_default.pay_frequency = H_product.tel.paycnt;
			}
		} else //価格表で選択しないで戻ったときはSELFから取る 20090219miya
			{
				if (true == (undefined !== H_sess.SELF.purchase)) {
					H_default.purchase = H_sess.SELF.purchase;
				}

				if (true == (undefined !== H_sess.SELF.pay_frequency)) {
					H_default.pay_frequency = H_sess.SELF.pay_frequency;
				}
			}

		if (true == (undefined !== H_sess.SELF.tempname)) {
			H_default.tempname = H_sess.SELF.tempname;
		}

		if (true == (undefined !== H_sess.SELF.deftemp)) {
			H_default.deftemp = H_sess.SELF.deftemp;
		}

		if (true == (undefined !== H_sess[TemplateAddView.PUB].recogpostid) && false == (undefined !== H_sess.SELF.recogpostid)) {
			H_default.recogpostid = H_sess[TemplateAddView.PUB].recogpostid;
			H_default.recogpostname = O_form_model.getPostNameString(H_sess[TemplateAddView.PUB].recogpostid);
		}

		if (false == (undefined !== H_sess.SELF.datechange)) {
			H_default.datechange = {
				Y: date("Y"),
				m: date("m"),
				d: date("d"),
				H: date("H")
			};
		}

		if (undefined !== this.H_View.recogcode) {
			H_default.h_recogcode = this.H_View.recogcode;
			H_default.recogcode = this.H_View.recogcode;
			H_default.recogname = this.H_View.recogname;
		}

		if (undefined !== this.H_View.pbpostcode_h) {
			H_default.h_pbpostcode_h = this.H_View.pbpostcode_h;
			H_default.pbpostcode_first = this.H_View.pbpostcode_h;
		}

		if (undefined !== this.H_View.pbpostname) {
			H_default.pbpostname = this.H_View.pbpostname;
		}

		if (undefined !== this.H_View.pbpostcode) {
			H_default.h_pbpostcode = this.H_View.pbpostcode;
		}

		if (undefined !== this.H_View.cfbpostcode_h) {
			H_default.h_cfbpostcode_h = this.H_View.cfbpostcode_h;
			H_default.cfbpostcode_first = this.H_View.cfbpostcode_h;
		}

		if (undefined !== this.H_View.cfbpostcode) {
			H_default.h_cfbpostcode = this.H_View.cfbpostcode;
		}

		if (undefined !== this.H_View.cfbpostname) {
			H_default.cfbpostname = this.H_View.cfbpostname;
		}

		if (undefined !== this.H_View.h_recoguserid) {
			H_default.h_recoguserid = this.H_View.h_recoguserid;
		}

		return H_default;
	}

	getSmartyTemplate(H_info) {
		var template = "";

		switch (H_info.carid) {
			case this.O_Set.car_docomo:
				template = "docomo";
				break;

			case this.O_Set.car_au:
				template = "au";
				break;

			case this.O_Set.car_willcom:
				template = "willcom";
				break;

			case this.O_Set.car_softbank:
				template = "vodafone";
				break;

			case this.O_Set.car_emobile:
				template = "emobile";
				break;

			case this.O_Set.car_smartphone:
				template = "smartphone";
				break;

			default:
				if (is_numeric(H_info.carid)) {
					template = "other";
				} else {
					template = "";
				}

		}

		if (template != "") {
			return template + "_templateadd.tpl";
		}

		return false;
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], H_product: {} | any[], H_message: {} | any[] = Array(), ptuni) //QuickFormとSmartyの合体
	//assign
	//個人別請求
	//資産管理権限 20090317miya
	//電話詳細情報
	//ページ固有の表示処理
	//$this->displaySmartyPeculiar( $H_sess, $A_auth );
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_OrderForm.accept(O_renderer);
		var divi = this.O_Sess.getPub("/MTTemplate");
		this.get_Smarty().assign("OrderByCategory", divi.division_pattern);

		if (MT_SITE == "shop") {
			this.get_Smarty().assign("title", "\u96DB\u578B\u65B0\u898F\u767B\u9332\uFF08" + this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname + "\uFF09");
			this.get_Smarty().assign("shop_submenu", this.H_View.pankuzu_link);
			this.get_Smarty().assign("shop_person", this.gSess().name + " " + this.gSess().personname);
		} else {
			this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		}

		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("recogpostname", this.H_View.recogpostname);
		this.get_Smarty().assign("css", this.H_View.css);
		this.get_Smarty().assign("cssTh", this.H_View.css + "Th");
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js_show_hide", "ShowHide();");
		this.get_Smarty().assign("boxinfo", H_sess.SELF);
		this.get_Smarty().assign("type", this.H_Dir.type);
		this.get_Smarty().assign("cirid", this.H_Dir.cirid);
		this.get_Smarty().assign("point_flg", this.checkPointUseType(H_sess[TemplateAddView.PUB]));
		this.get_Smarty().assign("ordinfo", H_product);
		this.get_Smarty().assign("usept", ptuni);
		this.get_Smarty().assign("H_message", H_message);
		this.get_Smarty().assign("H_free_acce", this.H_Dir.free_acce);
		this.get_Smarty().assign("carid", H_sess[TemplateAddView.PUB].carid);
		this.get_Smarty().assign("identification", "template");
		this.get_Smarty().assign("elementDisp", this.elementDisp);

		if (undefined !== H_sess[TemplateAddView.PUB].carid) {
			this.get_Smarty().assign("othercarid", H_sess[TemplateAddView.PUB].carid);
		}

		this.get_Smarty().assign("csrfid_del", this.csrfid_del);

		if (true == (-1 !== A_auth.indexOf("fnc_kojinbetu_vw"))) {
			this.get_Smarty().assign("useCharge", true);
		}

		if (true == (-1 !== A_auth.indexOf("fnc_kousi"))) {
			var kousiAuth = true;
		} else {
			kousiAuth = false;
		}

		this.get_Smarty().assign("kousiAuth", kousiAuth);

		if (-1 !== A_auth.indexOf("fnc_assets_manage_adm_co") == true) {
			var assetsFlg = true;
		} else {
			assetsFlg = false;
		}

		this.get_Smarty().assign("assetsFlg", assetsFlg);

		if (true == (-1 !== ["N", "Nmnp", "C", "S"].indexOf(this.H_Dir.type))) {
			if (MT_SITE != "shop") {
				this.get_Smarty().assign("telproperty", "on");
			}
		}

		if (-1 !== A_auth.indexOf(TemplateAddView.FNC_FJP_CO)) {
			this.get_Smarty().assign("fjpco", true);
		}

		this.get_Smarty().assign("extension", this.O_fjp.getSelectExtension(H_sess[TemplateAddView.PUB].type));
		this.get_Smarty().assign("boxopen", 1);
		this.get_Smarty().assign("handopen", H_sess.SELF.handopen);
		var smarty_template = this.H_View.smarty_template;
		this.get_Smarty().display(smarty_template);
	}

	makeTemplateData(H_g_sess: {} | any[], H_sess: {} | any[]) //処理を通さずスルーするパラメータ
	//渡されたデータを分解、再配列
	//買い物カゴ
	{
		var key, var;
		var A_throughitem = ["arid", "tempname", "recogpostid", "recogpostname", "kind", "openflg", "boxopen", "handopen", "carid", "cirid", "type", "ppid", "acce", "productid", "buyselid", "buytype1", "buytype2", "downmoney", "onepay", "totalprice", "productname", "submitName", "csrfid"];
		var H_mask = Array();
		var H_value = Array();

		while ([key, var] = each(H_sess.SELF)) //処理を通すかどうかここでチェック
		{
			if (-1 !== A_throughitem.indexOf(key) == false) {
				if (key == "mask") {
					H_mask = var;
				} else {
					if (var != "") {
						H_value[key] = var;
					}
				}
			}
		}

		var tempname = H_sess.SELF.tempname;

		if (H_mask.length > 0) {
			var mask = serialize(H_mask);
		} else {
			mask = "";
		}

		if (H_value.length > 0) {
			var value = serialize(H_value);
		} else {
			value = "";
		}

		if (H_free_acce.length > 0) {
			var free_acce = serialize(H_free_acce);
		} else {
			var H_free_acce = "";
		}

		var product = undefined;
		free_acce = undefined;

		if (true == (undefined !== H_sess[TemplateAddView.PUB].H_product) && true == Array.isArray(H_sess[TemplateAddView.PUB].H_product)) {
			product = serialize(H_sess[TemplateAddView.PUB].H_product);
		}

		if (true == (undefined !== H_sess[TemplateAddView.PUB].free_acce) && true == Array.isArray(H_sess[TemplateAddView.PUB].free_acce)) {
			free_acce = serialize(H_sess[TemplateAddView.PUB].free_acce);
		}

		var H_data = Array();
		H_data.mask = mask;
		H_data.value = value;
		H_data.product = product;
		H_data.free_acce = free_acce;
		return H_data;
	}

	endOrderFormView() //英語化権限 20090210miya
	//セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		if (true == this.H_Dir.eng) {
			var language = "ENG";
		} else {
			language = "JPN";
		}

		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();

		if (MT_SITE == "shop") {
			O_finish.displayFinish("\u6CE8\u6587\u96DB\u578B\u4F5C\u6210", "/Shop/MTHLTemplate/templatemenu.php", "\u6CE8\u6587\u96DB\u578B\u30E1\u30CB\u30E5\u30FC\u3078");
		} else {
			if (true == this.H_Dir.eng) {
				O_finish.displayFinish("New template registration", "/MTTemplate/menu.php", "Back to Order Template Menu", "", language);
			} else {
				O_finish.displayFinish("\u6CE8\u6587\u96DB\u578B\u4F5C\u6210", "/MTTemplate/menu.php", "\u6CE8\u6587\u96DB\u578B\u30E1\u30CB\u30E5\u30FC\u3078", "", language);
			}
		}
	}

	endTemplateDelView() //英語化権限 20090210miya
	//セッションクリア
	//2重削除防止メソッド
	//完了画面表示
	{
		if (true == this.H_Dir.eng) {
			var language = "ENG";
		} else {
			language = "JPN";
		}

		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();

		if (MT_SITE == "shop") {
			O_finish.displayFinish("\u6CE8\u6587\u96DB\u578B\u524A\u9664", "/Shop/MTHLTemplate/templatemenu.php", "\u6CE8\u6587\u96DB\u578B\u30E1\u30CB\u30E5\u30FC\u3078", "", language);
		} else {
			if (true == this.H_Dir.eng) {
				O_finish.displayFinish("Template Delete", "/MTTemplate/menu.php", "Back to Order Template Menu", "", language);
			} else {
				O_finish.displayFinish("\u6CE8\u6587\u96DB\u578B\u524A\u9664", "/MTTemplate/menu.php", "\u6CE8\u6587\u96DB\u578B\u30E1\u30CB\u30E5\u30FC\u3078", "", language);
			}
		}
	}

	setCsrfidDel(id) {
		this.csrfid_del = id;
	}

	assignPlanList(H_sess, H_g_sess) //$this->get_Smarty()->assign("selectedPlan", isset($H_sess["SELF"]["plan"]) ? $H_sess["SELF"]["plan"] : -1);
	{
		var model = new PlanModel(undefined, H_g_sess);
		this.get_Smarty().assign("jsplanlist", model.getPlanHashKeyisBuyselid(H_sess[TemplateAddView.PUB].carid, H_sess[TemplateAddView.PUB].cirid, this.gSess().language));
		this.get_Smarty().assign("selectedPlan", -1);

		if (undefined !== H_sess.SELF.plan && !!H_sess.SELF.plan) {
			this.get_Smarty().assign("selectedPlan", H_sess.SELF.plan);
		}
	}

	__destruct() {
		super.__destruct();
	}

};