//
//注文フォーム表示View
//
//更新履歴：<br>
//2008/04/17 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//require_once("model/Order/OrderTelInfoModel.php"); // いらない？
//require_once("model/Order/OrderMakeFormModel.php"); // いらない？
//
//電話フォーム表示View
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("view/QuickFormUtil.php");

require("model/Order/OrderFormModel.php");

require("HTML/QuickForm.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//submitボタン名（入力画面用）
//
//
//submitボタン名（確認画面用）
//
//
//注文フォームオブジェクト
//
//@var mixed
//@access protected
//
//
//注文フォーム関連クラスオブジェクト
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
//注文フォームを作成する<br>
//
//@author miyazawa
//@since 2008/05/20
//
//@param mixed $O_order
//@param array $H_items
//@param array $H_dir
//@param array $H_g_sess
//@access public
//@return void
//
//
//注文フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/03/13
//
//@param array $H_rules
//@access public
//@return void
//
//
//注文フォームのデフォルト値作成
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@access protected
//@return void
//
//
//フォーム表示項目作成
//
//@author miyazawa
//@since 2008/05/20
//
//@param mixed $O_order
//@param array $H_items
//@param array $H_dir
//@param array $H_g_sess
//@access protected
//@return void
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
//デストラクタ
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
class OrderMakeFormView extends OrderViewBase {
	static NEXTNAME = "\u78BA\u8A8D\u753B\u9762\u3078";
	static RECNAME = "\u6CE8\u6587\u3059\u308B";

	constructor() {
		super();
	}

	makeOrderForm(O_order, O_form_model: OrderFormModel, O_telinfo_model: OrderTelInfoModel, H_items: {} | any[], H_dir: {} | any[], H_g_sess: {} | any[]) //クイックフォームオブジェクト生成
	//$this->H_View["O_OrderFormUtil"]->setFormElement( $H_items );	// 注文は特殊な処理が多いのでそのままじゃ使えない
	{
		this.H_View.O_OrderFormUtil = new QuickFormUtil("form");
		this.makeOrderFormItem(O_order, O_form_model, O_telinfo_model, H_items, H_dir, H_g_sess);
		this.O_OrderForm = this.H_View.O_OrderFormUtil.makeFormObject();
	}

	makeOrderRule(H_rules) {
		this.H_View.O_OrderFormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.H_View.O_OrderFormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.H_View.O_OrderFormUtil.makeFormRule(H_rules);
	}

	makeDefaultValue(H_sess) {
		var hoge = "";
		return hoge;
	}

	makeOrderFormItem(O_order, O_form_model: OrderFormModel, O_telinfo_model: OrderTelInfoModel, H_items: {} | any[], H_dir: {} | any[], H_g_sess: {} | any[]) //キャリアの代表エリア(関東圏)を取得
	//回す
	{
		var pactid = H_g_sess.pactid;
		var recogpostid = H_dir.recogpostid;
		var carid = H_dir.carid;
		var cirid = H_dir.cirid;
		var type = H_dir.type;
		var arid = O_telinfo_model.getAreatoCarrier(carid);

		for (var i = 0; i < H_items.length; i++) //select
		//入力しないものは最初から確定
		{
			if (H_items[i].inputtype == "select") {
				var H_selectdef = {
					"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
				};

				switch (H_items[i].inputname) {
					case "userid":
						var H_selectval = {
							"": "\u6307\u5B9A\u306A\u3057"
						};
						+O_form_model.getOrderBelongUser(pactid, recogpostid);
						break;

					case "plan":
						H_selectval = H_selectdef + O_form_model.getOrderPlan(cirid, carid, arid);
						break;

					case "packet":
						H_selectval = H_selectdef + O_form_model.getOrderPacket(H_dir);
						break;

					case "parent":
						H_selectval = H_selectdef + O_form_model.getParentTelno(pactid, carid);
						break;

					case "kousi":
						H_selectdef = {
							"": "\u4F7F\u7528\u3059\u308B\u30D1\u30BF\u30FC\u30F3\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
						};
						var H_kousi = Array();
						var H_kousitmp = O_telinfo_model.getKousi(pactid, carid);

						for (var key in H_kousitmp) {
							var value = H_kousitmp[key];

							if (value.kousiflg != "" && value.kousiflg == 0) //kousiflg（0はする、1はしない。nullはデフォルト設定ではない）
								{
									value.patternname = "\u25CE" + value.patternname + "\uFF08\u4F1A\u793E\u521D\u671F\u8A2D\u5B9A\uFF09";
								}

							H_kousi[value.patternid] = value.patternname;
						}

						H_selectval = Array.from(H_selectdef + Array.from(H_kousi));
						break;

					case "formercarid":
						H_selectval = H_selectdef + O_telinfo_model.getPortableCarrier(carid);
						break;

					default:
						H_selectval = H_selectdef;
						break;
				}

				this.H_View.O_OrderFormUtil.O_Form.addElement(H_items[i].inputtype, H_items[i].inputname, H_items[i].itemname, H_selectval);
			} else if (H_items[i].inputtype == "checkbox") //オプションの場合
				{
					switch (H_items[i].inputname) {
						case "option":
							var H_option = O_form_model.getOrderOption(cirid, carid);

							if (carid == 2) //WILLCOMの割引サービス
								{
									var H_waribiki = H_option;

									for (var key in H_option) {
										var value = H_option[key];

										if (-1 !== GLOBALS.G_WARIBIKI_OP.indexOf(value.opid) == true) {
											delete H_option[key];
										}
									}

									for (var key in H_waribiki) {
										var value = H_waribiki[key];

										if (-1 !== GLOBALS.G_WARIBIKI_OP.indexOf(value.opid) == false) {
											delete H_waribiki[key];
										}
									}

									for (var key in H_waribiki) {
										var value = H_waribiki[key];
										A_waribiki.push(HTML_QuickForm.createElement("checkbox", value.opid, undefined, "<span style=\"width:160px\">" + value.opname + "</span>"));
									}

									this.H_View.O_OrderFormUtil.O_Form.addGroup(A_waribiki, "waribiki", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "<br />"]);
								} else if (carid == 4) {
								var H_vodalive = Array();
								var H_vodayuryo = Array();

								for (var key in H_option) {
									var value = H_option[key];

									if (-1 !== GLOBALS.G_VODA_LIVE_OP.indexOf(value.opid) == true) {
										H_vodalive[key] = value;
										delete H_option[key];
									} else if (-1 !== GLOBALS.G_VODA_YURYO_OP.indexOf(value.opid) == true) {
										H_vodayuryo[key] = value;
										delete H_option[key];
									}
								}

								for (var key in H_vodalive) {
									var value = H_vodalive[key];
									A_vodalive.push(HTML_QuickForm.createElement("checkbox", value.opid, undefined, "<span style=\"width:250px\">" + value.opname + "</span>"));
								}

								for (var key in H_vodayuryo) {
									var value = H_vodayuryo[key];
									A_vodayuryo.push(HTML_QuickForm.createElement("checkbox", value.opid, undefined, "<span style=\"width:250px\">" + value.opname + "</span>"));
								}

								this.H_View.O_OrderFormUtil.O_Form.addGroup(A_vodalive, "vodalive", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "<br />"]);
								this.H_View.O_OrderFormUtil.O_Form.addGroup(A_vodayuryo, "vodayuryo", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "<br />"]);
							}

							for (var key in H_option) {
								var value = H_option[key];
								A_option.push(HTML_QuickForm.createElement("checkbox", value.opid, undefined, "<span style=\"width:160px\">" + value.opname + "</span>"));
							}

							if (H_templatevalue != "" && H_templatevalue.option[7] == 0) {
								H_opt_def[7] = 0;
							} else {
								H_opt_def[7] = 1;
							}

							if (H_templatevalue != "" && H_templatevalue.option[17] == 0) {
								H_opt_def[17] = 0;
							} else {
								H_opt_def[17] = 1;
							}

							this.H_View.O_OrderFormUtil.O_Form.addGroup(A_option, "option", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "<br />"]);
							break;

						case "accessory":
							if (type == "A") {
								var H_accessory = O_form_model.getOrderAccessory(H_dir);

								for (var key in H_accessory) {
									var value = H_accessory[key];
									H_acce_per_cirid[value.cirid].push({
										acceid: value.acceid,
										accename: value.accename
									});
								}

								for (var key in H_acce_per_cirid) //付属品画面用ciridlist
								{
									var value = H_acce_per_cirid[key];

									for (var ky in value) {
										var val = value[ky];
										A_accessory[key].push(HTML_QuickForm.createElement("checkbox", val.acceid, undefined, "<span style=\"width:160px\">" + val.accename + "</span>"));
									}

									A_ciridlist.push(key);
									this.H_View.O_OrderFormUtil.O_Form.addGroup(A_accessory[key], "accessory[" + key + "]", "\u4ED8\u5C5E\u54C1", ["&nbsp;", "<br />"]);
								}

								break;
							} else {
								H_accessory = O_form_model.getOrderAccessory(H_dir);

								for (var key in H_accessory) {
									var value = H_accessory[key];
									A_accessory.push(HTML_QuickForm.createElement("checkbox", value.acceid, undefined, "<span style=\"width:160px\">" + value.accename + "</span>"));
								}

								this.H_View.O_OrderFormUtil.O_Form.addGroup(A_accessory, "accessory", "\u4ED8\u5C5E\u54C1", ["&nbsp;", "<br />"]);
								break;
							}

						default:
							this.H_View.O_OrderFormUtil.O_Form.addGroup(A_option, "option", "\u30A8\u30E9\u30FC", ["&nbsp;", "&nbsp;", "<br />"]);
							break;
					}
				} else if (H_items[i].inputtype == "radio_child") {
				global[H_items[i].inputname].push(HTML_QuickForm.createElement("radio", undefined, undefined, H_items[i].itemname, H_items[i].inputdef, H_items[i].property));
			} else if (H_items[i].inputtype == "radio") {
				if (H_items[i].inputname == "option") //WILLCOMの割引サービス
					//オプションがラジオボタンであることを示すフラグ（フォームに初期値を入れるときに使う）
					{
						H_option = O_form_model.getOrderOption(cirid, carid);

						if (carid == 2) {
							H_waribiki = H_option;

							for (var key in H_option) {
								var value = H_option[key];

								if (-1 !== GLOBALS.G_WARIBIKI_OP.indexOf(value.opid) == true) {
									delete H_option[key];
								}
							}

							for (var key in H_waribiki) {
								var value = H_waribiki[key];

								if (-1 !== GLOBALS.G_WARIBIKI_OP.indexOf(value.opid) == false) {
									delete H_waribiki[key];
								}
							}

							for (var key in H_waribiki) {
								var value = H_waribiki[key];
								A_wariradio.push(HTML_QuickForm.createElement("radio", value.opid, value.opname, "\u5909\u66F4\u306A\u3057", "stay"));
								A_wariradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, "\u3064\u3051\u308B", "put"));
								A_wariradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, "\u5916\u3059", "remove"));
								H_wari_def[value.opid] = "stay";
							}

							this.H_View.O_OrderFormUtil.O_Form.addGroup(A_wariradio, "waribiki", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "&nbsp;", "<br />"]);
						} else if (carid == 4) {
							H_vodalive = Array();
							H_vodayuryo = Array();

							for (var key in H_option) {
								var value = H_option[key];

								if (-1 !== GLOBALS.G_VODA_LIVE_OP.indexOf(value.opid) == true) {
									H_vodalive[key] = value;
									delete H_option[key];
								} else if (-1 !== GLOBALS.G_VODA_YURYO_OP.indexOf(value.opid) == true) {
									H_vodayuryo[key] = value;
									delete H_option[key];
								}
							}

							for (var key in H_vodalive) {
								var value = H_vodalive[key];
								A_vodaliveradio.push(HTML_QuickForm.createElement("radio", value.opid, value.opname, "\u5909\u66F4\u306A\u3057", "stay"));
								A_vodaliveradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, "\u3064\u3051\u308B", "put"));
								A_vodaliveradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, "\u5916\u3059", "remove"));
								H_vodalive_def[value.opid] = "stay";
							}

							this.H_View.O_OrderFormUtil.O_Form.addGroup(A_vodaliveradio, "vodalive", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "&nbsp;", "<br />"]);

							for (var key in H_vodayuryo) {
								var value = H_vodayuryo[key];
								A_vodayuryoradio.push(HTML_QuickForm.createElement("radio", value.opid, value.opname, "\u5909\u66F4\u306A\u3057", "stay"));
								A_vodayuryoradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, "\u3064\u3051\u308B", "put"));
								A_vodayuryoradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, "\u5916\u3059", "remove"));
								H_vodayuryo_def[value.opid] = "stay";
							}

							this.H_View.O_OrderFormUtil.O_Form.addGroup(A_vodayuryoradio, "vodayuryo", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "&nbsp;", "<br />"]);
						}

						for (var key in H_option) {
							var value = H_option[key];
							A_optradio.push(HTML_QuickForm.createElement("radio", value.opid, value.opname, "\u5909\u66F4\u306A\u3057", "stay"));
							A_optradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, "\u3064\u3051\u308B", "put"));
							A_optradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, "\u5916\u3059", "remove"));
							H_opt_def[value.opid] = "stay";
						}

						this.H_View.O_OrderFormUtil.O_Form.addGroup(A_optradio, "option", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "&nbsp;", "<br />"]);
						var option_is_radio = true;
					} else {
					this.H_View.O_OrderFormUtil.O_Form.addGroup(global[H_items[i].inputname], H_items[i].inputname, H_items[i].itemname, H_items[i].property);
				}
			} else {
				var H_property = unserialize(H_items[i].property);

				if (H_property == "") {
					H_property = H_items[i].property;
				}

				if (H_items[i].inputtype == "date") {
					H_property = Array.from(H_property + Array.from(H_def_year));
				}

				this.H_View.O_OrderFormUtil.O_Form.addElement(H_items[i].inputtype, H_items[i].inputname, H_items[i].itemname, H_property);
			}

			if (H_items[i].inputdef == "frz") {
				A_frz.push(H_items[i].inputname);
			}
		}
	}

	freezeForm() //$this->H_View["O_OrderFormUtil"]->updateElementAttrWrapper( "submit", array( "value" => self::RECNAME ) );
	{
		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", OrderMakeFormView.RECNAME);
		this.H_View.O_OrderFormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.H_View.O_OrderFormUtil.freezeWrapper();
	}

	unfreezeForm() //$this->H_View["O_OrderFormUtil"]->updateElementAttrWrapper( "submit", array( "value" => self::NEXTNAME ) );
	{
		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", OrderMakeFormView.NEXTNAME);
	}

	__destruct() {
		super.__destruct();
	}

};