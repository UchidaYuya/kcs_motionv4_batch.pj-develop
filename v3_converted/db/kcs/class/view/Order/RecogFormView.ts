//
//承認フォームViewクラス
//
//更新履歴：<br>
//2008/08/26 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/08/26
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//require_once("view/ViewSmarty.php");
//
//承認フォームViewクラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/08/26
//@uses MtSetting
//@uses MtSession
//

require("OrderDetailFormView.php");

require("model/Order/ShopOrderEditModel.php");

//
//submitボタン名
//
//
//submitボタン名（確認画面用）
//
//
//セッションオブジェクト
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
//CGIパラメータを取得する
//
//@author igarashi
//@since 2008/06/09
//
//@access public
//@return none
//
//
//ページ個別のparamチェック
//
//@author igarashi
//@since 2008/09/18
//
//
//
//販売店専用の個別のparamチェック<br>
//Peculiarとも分けておいた。
//ココには書いちゃダメ。
//
//@author igarashi
//@since 2008/09/18
//
//
//
//orderidから発注種別を取得する<br>
//販売店専用
//
//@author igarashi
//@since 2008/09/18
//
//
//
//かご部分の商品別項目作成（承認用）
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
//販売店用のダミー<br>
//実態はShopOrderEditView
//
//
//
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
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//配下のセッション消し
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
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
//指定されたキーのセルフセッションを消す
//
//@author etoh
//@since 2014/10/03
//
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
class RecogFormView extends OrderDetailFormView {
	static NEXTNAME = "\u78BA\u8A8D\u753B\u9762\u3078";
	static NEXTNAME_ENG = "To Confirmation Screen";
	static RECNAME = "\u6CE8\u6587\u5185\u5BB9\u3092\u5909\u66F4\u3059\u308B";
	static RECNAME_ENG = "Change order contents";

	constructor(H_param = Array()) {
		super(H_param);
	}

	makePankuzuLinkHash() //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var H_link = {
				"/MTRecog/menu.php": "Approval",
				"": "Details"
			};
		} else {
			H_link = {
				"/MTRecog/menu.php": "\u627F\u8A8D",
				"": "\u627F\u8A8D\u8A73\u7D30"
			};
		}

		return H_link;
	}

	getCSS() {
		return "csRecog";
	}

	checkCGIParam() //件数が変更されたとき（GETだと数百件のときURLが長すぎるのでPOSTに変更） 20100212miya
	//is_numeric条件追加 20100216miya
	//空の場合1にする 20090129miya
	//付属品
	{
		this.setDefaultSession();
		var sess = this.getLocalSession();

		if (true == (undefined !== _GET.o)) {
			this.H_Dir.orderid = _GET.o;
			this.O_Sess.SetPub(RecogFormView.PUB, this.H_Dir);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (true == (undefined !== _POST.o)) {
			this.H_Dir.orderid = _POST.o;
			this.O_Sess.SetPub(RecogFormView.PUB, this.H_Dir);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (undefined !== _POST.p == true && is_numeric(_POST.p) == true) {
			this.H_Dir.offset = _POST.p;
		}

		for (var gky in _POST) {
			var gvl = _POST[gky];

			if (ereg("^acce", gky)) {
				if (gky != stripslashes(gky)) {
					_POST[stripslashes(gky)] = gvl;
					delete _POST[gky];
				}
			}
		}

		if (undefined !== _POST.limit == true && true == is_numeric(_POST.limit)) {
			if (this.H_Dir.limit != _POST.limit) //ローカルセッションに入れて読み込み直し
				{
					this.H_Dir.limit = _POST.limit;
					this.H_Dir.offset = 1;
					delete _POST.limit;

					for (var gky in _POST) {
						var gvl = _POST[gky];
						this.H_Local[gky] = gvl;
					}

					this.O_Sess.SetPub(RecogFormView.PUB, this.H_Dir);
					this.O_Sess.SetSelfAll(this.H_Local);
					header("Location: " + _SERVER.PHP_SELF);
					throw die();
				}
		} else //isset条件追加 20100216miya
			{
				if (false == (undefined !== _POST.recover) && false == (undefined !== _POST.del)) {
					this.H_Dir.offset = 1;
				}
			}

		if ("" == this.H_Dir.offset) {
			this.H_Dir.offset = 1;
		}

		if (false == (undefined !== this.H_Dir.orderid)) //getShopOrderTypeの後にあったが、それではorderidがnullだったときにSQLになってしまうので上に持ってきた 20100716miya
			{
				this.getOut().errorOut(0, "orderid\u304C\u3042\u308A\u307E\u305B\u3093", false);
			}

		if (false == is_numeric(this.H_Dir.orderid)) //orderidにArrayが入ってくることがある現象に対策 20100716miya
			{
				this.getOut().errorOut(0, "orderid\u304C\u7279\u5B9A\u3067\u304D\u307E\u305B\u3093", false);
			}

		if (false == (undefined !== this.H_Dir.type) || undefined == this.H_Dir.type) {
			this.H_Dir.type = this.getShopOrderType(this.H_Dir.orderid);
		}

		if (_POST.submitName) {
			delete _POST.backName;
			delete this.H_Local.backName;
		}

		if (_POST.backName) //一括プラン変更のため追加 20090129miya
			{
				delete _POST.submitName;
				delete this.H_Local.submitName;
			}

		var A_reason_mongon = ["\u8CA9\u58F2\u5E97\u3078\u306E\u9023\u7D61\u306F\u6CE8\u6587\u5185\u5BB9\u6B04\u306B\u3054\u8A18\u5165\u304F\u3060\u3055\u3044", "\u8CA9\u58F2\u5E97\u3078\u306E\u9023\u7D61\u306F\u5099\u8003\u6B04\u306B\u3054\u8A18\u5165\u304F\u3060\u3055\u3044", "Leave any comments for the store in the Content of Order column.", "Leave any comments for the store in the Notes column."];

		if (true == (-1 !== A_reason_mongon.indexOf(_POST.reason))) {
			_POST.reason = undefined;
		}

		var infcnt = 0;

		for (var key in _POST) {
			var val = _POST[key];

			if (true == (-1 !== this.A_boxinput.indexOf(key))) {
				infcnt++;
			}

			this.H_Local[key] = val;
		}

		if (this.A_boxinput.length == infcnt) {
			this.H_Local.openflg = true;
		} else {
			this.H_Local.openflg = false;
		}

		if (this.H_Dir.type == "A") //自由記入欄に入力があったとき
			{
				if (true == (undefined !== this.H_Local.free_productname) && 0 < this.H_Local.free_productname.length || true == (undefined !== this.H_Local.free_count) && 0 < this.H_Local.free_count.length || true == (undefined !== this.H_Local.free_property) && 0 < this.H_Local.free_property.length) //確認画面に行ったときは自由記入欄のパラメータを無視
					{
						if (false == (undefined !== this.H_Local.submitName) || "" == this.H_Local.submitName) {
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
			if (true == (-1 !== ["N", "Nmnp", "C", "S"].indexOf(this.H_Dir.type))) //直接入力ボタンを押してから、価格表ボタンを押して商品を選択したときはhandopenを消さないとフォーム本体が閉じたままになるのを防ぐためフラグリセット 20090114miya
				{
					if (false == (undefined !== _POST.handopen) && true == (undefined !== this.H_Local.handopen) && 1 == +(this.H_Local.handopen && true == (undefined !== this.H_Dir.price_detailid))) {
						this.H_Local.handopen = 0;
						this.H_Local.boxopen = 1;
					}

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
				} else {
				this.H_Local.handopen = undefined;
				this.H_Local.boxopen = undefined;
			}
		}

		this.H_Dir.carid = +this.H_Dir.carid;
		this.H_Dir.cirid = +this.H_Dir.cirid;
		this.H_Dir.orderid = +this.H_Dir.orderid;
		this.H_Local.applyprice = +this.H_Local.applyprice;
		this.H_Local.point = +this.H_Local.point;

		if (true == (undefined !== H_free_acce)) {
			this.H_Dir.free_acce.push(H_free_acce);
		}

		if (!(undefined !== this.H_Local.csrfid) && undefined !== sess.SELF.csrfid) {
			this.H_Local.csrfid = sess.SELF.csrfid;
		}

		this.O_Sess.SetPub(RecogFormView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	checkCGIParamPeculiar() {}

	checkCGIParamForShop() {}

	getShopOrderType() {}

	makeOrderBoxInputForm(O_model, H_sess, site = "", H_sub) //カゴの情報
	//英語化権限 20090210miya
	//全キャリア共通
	//承認で注文の中身を作り直す場合
	//emobile以外
	{
		var H_order = H_sess[RecogFormView.PUB].H_product;

		if (false == Array.isArray(H_order)) {
			H_order = Array();
		}

		if (site == 1) {
			var listbtn_jsname = "openProductListShop";
		} else {
			listbtn_jsname = "openProductList";
		}

		if (true == this.H_Dir.eng) {
			var eng = true;
			var listbtn_str = "Order from Price List";
			var handbtn_str = "Enter Directly";
			var handbtn_acce_str = "Enter Directly";
			var applyprc_str = "Total";
			var purchase_str = "Method of Purchase";
			var payfreq_str = "No. of Installments";
			var listnamestr = RecogFormView.LISTNAME_ENG;
			var colorstr = "Color";
			var productnamestr = "Model";
			var telno_str = "Mobile Number";
			var property_str = "Please select";
			var property_any = "Any color";
		} else {
			eng = false;
			listbtn_str = "\u4FA1\u683C\u8868\u304B\u3089\u9078\u629E\u3057\u3066\u6CE8\u6587";
			handbtn_str = "\u76F4\u63A5\u5165\u529B\u3067\u6CE8\u6587";
			handbtn_acce_str = "\u5546\u54C1\u78BA\u5B9A";
			applyprc_str = "\u7533\u8ACB\u91D1\u984D";
			purchase_str = "\u8CFC\u5165\u65B9\u5F0F";
			payfreq_str = "\u5272\u8CE6\u56DE\u6570";
			listnamestr = RecogFormView.LISTNAME;
			colorstr = "\u8272";
			productnamestr = "\u6A5F\u7A2E";
			telno_str = "\u643A\u5E2F\u756A\u53F7";
			property_str = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
			property_any = "\u6307\u5B9A\u306A\u3057";
		}

		var A_form = [{
			name: "productid",
			inputtype: "hidden"
		}, {
			name: "buyselid",
			inputtype: "hidden"
		}, {
			name: "buytype1",
			inputtype: "hidden"
		}, {
			name: "buytype2",
			inputtype: "hidden"
		}, {
			name: "downmoney",
			inputtype: "hidden"
		}, {
			name: "onepay",
			inputtype: "hidden"
		}, {
			name: "totalprice",
			inputtype: "hidden"
		}, {
			name: "listbtn",
			label: listbtn_str,
			inputtype: "button",
			options: {
				onClick: listbtn_jsname + "('" + H_sess[RecogFormView.PUB].type + "'," + H_sess[RecogFormView.PUB].carid + "," + H_sess[RecogFormView.PUB].cirid + "," + H_sess[RecogFormView.PUB].ppid + ")"
			}
		}, {
			name: "handbtn",
			label: handbtn_str,
			inputtype: "button",
			options: {
				onClick: "enableHand('" + H_sess[RecogFormView.PUB].type + "')"
			}
		}, {
			name: "applyrpice",
			label: applyprc_str,
			inputtype: "text"
		}, {
			name: "insbox",
			label: listnamestr,
			inputtype: "button",
			options: {
				onClick: "checkOrderInput()"
			}
		}];

		if (+(this.H_Local.handopen == 1 && +(this.H_Local.boxopen == 0 && false == (undefined !== this.H_Dir.price_detailid)))) //価格表からの注文
			//価格表からの注文
			{
				if (true == (undefined !== this.H_Dir.price_detailid)) {
					if (true == (undefined !== H_order.tel.productid)) //機種名はhidden
						{
							var A_disable = {
								disabled: "true"
							};
							var colorlists = Array.from(O_model.getProductProperty(H_order.tel.productid));

							if (undefined !== colorlists[H_sub.property]) //色はselect
								{
									A_form.push({
										name: "color",
										label: colorstr,
										inputtype: "select",
										data: {
											"": property_str,
											[property_any]: property_any
										} + colorlists
									});
								} else //色はtext
								{
									A_form.push({
										name: "color",
										label: colorstr,
										inputtype: "text"
									});
								}

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

				if (true == (undefined !== this.H_Dir.price_detailid)) //価格表ではなく手動入力での注文
					{
						var idx = 0;
						A_form = array_merge(A_form, A_temp);
					} else {}
			} else //価格表からの注文
			{
				if (true == (undefined !== H_order.tel.productid)) //2013-11-06
					//機種名はhidden
					//手動入力
					{
						A_disable = {
							disabled: "true"
						};
						colorlists = Array.from(O_model.getProductProperty(H_order.tel.productid));

						if (undefined !== colorlists[H_sub.property] || property_any == H_sub.property || !H_sub.property) //色はselect
							{
								A_form.push({
									name: "color",
									label: colorstr,
									inputtype: "select",
									data: {
										"": property_str,
										[property_any]: property_any
									} + Array.from(O_model.getProductProperty(H_order.tel.productid))
								});
							} else //色はtext
							{
								A_form.push({
									name: "color",
									label: colorstr,
									inputtype: "text"
								});
							}

						A_form.push({
							name: "productname",
							inputtype: "hidden"
						});
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
			}

		if (H_sess[RecogFormView.PUB].carid != O_Set.car_emobile) {
			var A_temp = [{
				name: "purchase",
				label: purchase_str,
				inputtype: "select",
				data: O_model.getPurchaseId(H_sess[RecogFormView.PUB].carid, eng),
				options: {
					onChange: "disablePayCount(\"del\")"
				}
			}, {
				name: "pay_frequency",
				label: payfreq_str,
				inputtype: "select",
				data: O_model.getPayCountId(H_sess[RecogFormView.PUB].carid, eng),
				options: A_disable
			}];
			A_form = array_merge(A_form, A_temp);
		}

		if (H_sess[RecogFormView.PUB].type == "A") {
			A_form.push({
				name: "free_productname",
				label: "\u81EA\u7531\u8A18\u5165\u6B04\uFF1A\u5546\u54C1\u540D",
				inputtype: "text",
				options: ""
			});
			A_form.push({
				name: "free_price",
				label: "\u81EA\u7531\u8A18\u5165\u6B04\uFF1A\u4FA1\u683C",
				inputtype: "text",
				options: {
					size: "3"
				}
			});
			A_form.push({
				name: "free_count",
				label: "\u81EA\u7531\u8A18\u5165\u6B04\uFF1A\u6570\u91CF",
				inputtype: "text",
				options: {
					size: "3"
				}
			});
			A_form.push({
				name: "free_property",
				label: "\u81EA\u7531\u8A18\u5165\u6B04\uFF1A\u5099\u8003",
				inputtype: "text",
				options: {
					size: "60"
				}
			});
			A_form.push({
				name: "free_insacce",
				label: handbtn_acce_str,
				inputtype: "button",
				options: {
					onClick: "insAcceFree()"
				}
			});
		}

		A_form = array_merge(A_form, this.makeOrderBoxDetailForm(H_sess, H_order));
		var A_shopform = this.makeOrderHistoryForm();

		if (0 < A_shopform.length) {
			A_form = array_merge(A_form, A_shopform);
		}

		this.checkQuickFormObject();
		this.H_View.O_OrderFormUtil.setFormElement(A_form);
		this.InputForm = this.H_View.O_OrderFormUtil.makeFormObject();
	}

	makeOrderHistoryForm() {}

	freezeForm() //英語化権限
	//ダブルクリック防止
	{
		if (true == this.H_Dir.eng) {
			var recnamestr = RecogFormView.RECNAME_ENG;
			var backnamestr = RecogFormView.BACKNAME_ENG;
		} else {
			recnamestr = RecogFormView.RECNAME;
			backnamestr = RecogFormView.BACKNAME;
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
	//activate_and_submitは使わなくなったのでここを書き換える必要はない 20090909miya
	//$this->H_View["O_OrderFormUtil"]->updateAttributesWrapper( array( "onsubmit" => "return activate_and_submit();" ) );	// カゴ入力項目活性化
	//承認の名義変更、付属品、その他は電話番号変えちゃダメ
	{
		if (true == this.H_Dir.eng) {
			var nextnamestr = RecogFormView.NEXTNAME_ENG;
		} else {
			nextnamestr = RecogFormView.NEXTNAME;
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", nextnamestr, {
			id: "submitName",
			value: nextnamestr
		});
		this.A_frz.push("telno");

		if (this.A_frz.length > 0) {
			this.H_View.O_OrderFormUtil.O_Form.freeze(this.A_frz);
		}
	}

	displaySmarty(H_g_sess: {} | any[], H_sess: {} | any[], A_auth: {} | any[], H_order: {} | any[], H_message: {} | any[] = Array(), H_param: {} | any[], ptuni) //顧客入力者担当メールアドレス編集権限がない場合は凍結しておく
	//個人別請求権限
	//公私分計権限
	//資産管理権限 20090317miya
	//販売店の受注内容変更では表示する 20090324miya
	//使用者と社員番号 20090410miya
	//RecogFormProcで、一件のみの電話で電話情報取り直したときは↑の[0]ではなく[telno0]に入ってくる……ややこしいが 20090410miya
	//RecogFromProcで再取得しないようにしたのでコメントアウト 20090410miya
	//		if ("" == $telusername && "" != $H_sess["/MTOrder"]["telinfo"][telno0]["telusername"]) {
	//			$telusername = $H_sess["/MTOrder"]["telinfo"][telno0]["telusername"];
	//		}
	//		if ("" == $employeecode && "" != $H_sess["/MTOrder"]["telinfo"][telno0]["employeecode"]) {
	//			$employeecode = $H_sess["/MTOrder"]["telinfo"][telno0]["employeecode"];
	//		}
	//$this->get_Smarty()->assign( "boxopen", true);
	//暫定
	//暫定
	//資産管理権限 20090317miya
	//地域会社 20090128miya
	//地域会社をhiddenで持っておく電話番号 20090128miya
	//上記「使用者と社員番号」の修正に伴って変更 20090410miya
	//上記「使用者と社員番号」の修正に伴って変更 20090410miya
	//直接入力は計算ボタンを消すのでprice_detailidを渡す 20091030miya
	//MotionとHotlineの表示分けのため 20100325miya
	//S224 解約注文時電話詳細項目表示 hanashima 20200717
	{
		if (!(-1 !== A_auth.indexOf("fnc_chargermail_edit"))) {
			this.O_OrderForm.freeze("chargermail");
		}

		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_OrderForm.accept(O_renderer);

		if (-1 !== A_auth.indexOf("fnc_kojinbetu_vw") == true) {
			var useCharge = true;
		} else {
			useCharge = false;
		}

		if (-1 !== A_auth.indexOf("fnc_kousi") == true) {
			var kousiFlg = true;
		} else {
			kousiFlg = false;
		}

		if (-1 !== A_auth.indexOf("fnc_assets_manage_adm_co") == true || site == 1) {
			var assetsFlg = true;
		} else {
			assetsFlg = false;
		}

		var telusername = H_sess["/MTOrder"].telinfo[0].telusername;
		var employeecode = H_sess["/MTOrder"].telinfo[0].employeecode;

		if (false == is_null(this.gSess().memid)) {
			this.H_View.smarty_template = "../" + this.H_View.smarty_template;
		}

		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("postname", H_order.order.postname);
		this.get_Smarty().assign("css", this.H_View.css);
		this.get_Smarty().assign("cssTh", this.H_View.css + "Th");
		this.get_Smarty().assign("handopen", H_sess.SELF.handopen);
		this.get_Smarty().assign("boxopen", H_sess.SELF.boxopen);
		this.get_Smarty().assign("boxinfo", H_sess.SELF);
		this.get_Smarty().assign("ordinfo", H_order.product);
		this.get_Smarty().assign("H_sub", H_order.sub);
		this.get_Smarty().assign("teldisplay", this.H_View.teldisplay);

		if ("M" == H_sess[RecogFormView.PUB].type) {
			this.get_Smarty().assign("telcount", 1);
		} else {
			this.get_Smarty().assign("telcount", H_sess[RecogFormView.PUB].telcount);
		}

		var detailCnt = 0;

		for (var sub of Object.values(H_order.sub)) {
			if (sub.machineflg) {
				detailCnt++;
			}
		}

		this.get_Smarty().assign("detailcnt", detailCnt);
		this.get_Smarty().assign("telpropertyjsflg", 1);
		this.get_Smarty().assign("smartphone", true);
		this.get_Smarty().assign("type", H_sess[RecogFormView.PUB].type);
		this.get_Smarty().assign("H_tax", H_order.tax);
		this.get_Smarty().assign("disptype", this.H_View.smarty_template);
		this.get_Smarty().assign("kousiFlg", kousiFlg);
		this.get_Smarty().assign("assetsFlg", assetsFlg);
		this.get_Smarty().assign("useCharge", useCharge);
		this.get_Smarty().assign("point_flg", this.checkPointUseType(H_sess[RecogFormView.PUB]));
		this.get_Smarty().assign("telpenalty", this.H_View.telpenalty);
		this.get_Smarty().assign("shopflg", H_param.site);
		this.get_Smarty().assign("usept", ptuni);
		this.get_Smarty().assign("H_free_acce", this.H_Dir.free_acce);
		this.get_Smarty().assign("H_message", H_message);
		this.get_Smarty().assign("pactid", H_g_sess.pactid);
		this.get_Smarty().assign("loginpostid", H_g_sess.postid);
		this.get_Smarty().assign("bulkplan", this.H_View.bulkplan);
		this.get_Smarty().assign("mnpalert", this.H_View.mnpalert);
		this.get_Smarty().assign("limit", H_sess[RecogFormView.PUB].limit);
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("area", this.H_View.area);
		this.get_Smarty().assign("A_nodisptel", this.H_View.A_nodisptel);
		this.get_Smarty().assign("telusername", telusername);
		this.get_Smarty().assign("employeecode", employeecode);
		this.get_Smarty().assign("price_detailid", this.H_Dir.price_detailid);
		this.get_Smarty().assign("pacttype", H_g_sess.pacttype);
		this.get_Smarty().assign("carid", H_order.order.carid);

		if (undefined !== this.H_View.deleteOrderDisplayTelDetaile) {
			this.get_Smarty().assign("deleteOrderDisplayTelDetaile", this.H_View.deleteOrderDisplayTelDetaile);
		}

		if (1 == H_param.site) //注文時の情報表示のため 20100107miya
			//注文時の情報表示のため 20100107miya
			{
				this.get_Smarty().assign("shop_submenu", this.H_View.pankuzu_link);
				this.get_Smarty().assign("shop_name", H_g_sess.shopname);
				this.get_Smarty().assign("shop_person", H_g_sess.personname);
				this.get_Smarty().assign("title", "\u53D7\u6CE8\u60C5\u5831\u4FEE\u6B63");
				this.get_Smarty().assign("firstprice", H_order.firstprice);
				this.get_Smarty().assign("reordflg", this.H_View.reordflg);
			}

		this.getExtensionDisplay(H_order);

		if (this.O_fjp.checkAuth("co")) {
			this.get_Smarty().assign("fjpco", true);
		}

		this.get_Smarty().assign("extension", this.O_fjp.getSelectExtension(H_sess[RecogFormView.PUB].type));
		this.get_Smarty().assign("pagetype", "recog");

		if (preg_match("/^\\/Shop\\//", _SERVER.PHP_SELF)) {
			this.get_Smarty().assign("listpath", "../");
		}

		var url = "";

		if (true == this.H_Dir.eng) {
			url = KCS_DIR + "/template/eng/MTRecog/";
		} else {
			url = KCS_DIR + "/template/MTRecog/";
		}

		this.get_Smarty().display(url + "recog_form.tpl");
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [RecogFormView.PUB];
		this.O_Sess.clearSessionExcludeListPub(A_exc);
	}

	endOrderFormView(orderid) //英語化権限
	//セッションクリア
	//直接入力の付属品を消しておかないともう一度修正画面を開いたときに二重に表示される 20090826miya
	//2重登録防止メソッド
	//完了画面表示
	{
		if (true == this.H_Dir.eng) {
			var backbtn0 = "Back";
			var fintxt0_1 = "Change order contents";
			var language = "ENG";
		} else {
			backbtn0 = "\u623B\u308B";
			fintxt0_1 = "\u6CE8\u6587\u5185\u5BB9\u306E\u5909\u66F4";
			language = "JPN";
		}

		this.O_Sess.clearSessionSelf();
		delete this.H_Dir.free_acce;
		this.O_Sess.SetPub(RecogFormView.PUB, this.H_Dir);
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish(fintxt0_1, "/MTRecog/recog_detail.php", backbtn0, "", language);
	}

	clearSessionKeySelf(key) {
		this.O_Sess.clearSessionKeySelf(key);
	}

	__destruct() {
		super.__destruct();
	}

};