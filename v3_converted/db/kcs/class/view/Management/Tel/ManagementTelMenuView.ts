//
//電話一覧のView
//
//更新履歴：<br>
//2008/05/21 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/05/21
//@filesource
//@uses ManagementMenuViewBase
//
//
//error_reporting(E_ALL);
//
//電話一覧のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/05/21
//@uses ManagementMenuViewBase
//

require("view/Management/ManagementMenuViewBase.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2008/05/21
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//電話一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/05/21
//
//@access protected
//@return void
//
//
//電話一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/05/21
//
//@access protected
//@return void
//
//
//makeOptionVal
//
//@author houshiyama
//@since 2009/03/10
//
//@param mixed $val
//@access private
//@return void
//
//
//電話一覧の検索フォームを作成する<br>
//
//管理種別の配列を生成<br>
//フォーム要素の配列を作成<br>
//検索フォームのオブジェクト生成<br>
//契約日用のグループの配列作成<br>
//契約日用のグループを検索フォームオブジェクトに追加<br>
//
//@author houshiyama
//@since 2008/05/21
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署一覧）
//@access public
//@return void
//@uses O_ManagementUtil
//@uses QuickFormUtil
//
//
//電話一覧固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_session
//@param mixed $H_tree
//@param mixed $A_data
//@access public
//@return void
//
//
//メニューに拡張表示するカラムの配列生成
//
//@author houshiyama
//@since 2008/05/21
//
//@param array $H_post
//@access private
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/05/21
//
//@access public
//@return array
//
//
//ダウンロードリンクを作成し返す
//
//@author houshiyama
//@since 2008/05/21
//
//@access protected
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/05/21
//
//@access public
//@return void
//
//
//検索フォームのサブ検索フォームの表示・非表示を返す
//
//@author houshiyama
//@since 2008/08/11
//
//@param mixed $name
//@param array $H_post
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/21
//
//@access public
//@return void
//
class ManagementTelMenuView extends ManagementMenuViewBase {
		constructor() {
				super();
		}

		setDefaultSessionPeculiar() //予約のソート条件が無ければ作る
		{
				if (undefined !== this.H_Local.r_sort == false) {
						this.H_Local.r_sort = "0,a";
				}

				if (undefined !== this.H_Local.r_offset == false) {
						this.H_Local.r_offset = 1;
				}

				if (undefined !== this.H_Local.r_mode == false) {
						this.H_Local.r_mode = "0";
				}
		}

		checkCGIParamPeculiar() //検索が実行された時
		{
				if (undefined !== _POST.search == true) //ajaxの値をhiddenに入れる
						{
								for (var key in _POST) {
										var val = _POST[key];

										if (preg_match("/aj$/", key) == true) //オプションと割引サービス
												{
														if (preg_match("/opaj|discountaj/", key) == true) {
																var ajkey = key.replace(/aj$/g, "id");
																_POST[ajkey] = this.makeOptionVal(val);
																this.H_Local.post[ajkey] = val;
														} else {
																ajkey = key.replace(/aj$/g, "id");
																this.H_Local.post[ajkey] = val;
														}
												} else {
												this.H_Local.post[key] = val;
										}
								}
						}

				if (undefined !== _GET.r_s == true) {
						this.H_Local.r_sort = _GET.r_s;
						this.H_Local.r_offset = 1;
				}

				if (undefined !== _GET.r_p == true) {
						this.H_Local.r_offset = _GET.r_p;
				}

				if (undefined !== _GET.r_m == true) {
						this.H_Local.r_mode = _GET.r_m;
						this.H_Local.r_offset = 1;
				}
		}

		makeOptionVal(val) {
				var H_res = Array();
				var A_tmp = val.split(",");

				for (var cnt = 0; cnt < A_tmp.length; cnt++) {
						if (A_tmp[cnt] != "") {
								H_res[A_tmp[cnt]] = "1";
						}
				}

				return H_res;
		}

		makeSearchForm(H_sess: {} | any[], A_post: {} | any[], O_manage: ManagementUtil, O_model) //キャリアの配列を生成
		//キャリアの指定がある時
		//端末種別取得
		//ユーザ設定項目を取得する
		//検索条件の配列を生成
		//表示言語分岐
		//クイックフォームオブジェクト生成
		//ユーザ設定項目の配列生成
		//表示言語分岐
		//2015-01-23
		{
				var H_car = O_model.getUseCarrierData(A_post, H_sess[ManagementTelMenuView.PUB].cym, H_sess.SELF.post);

				if (undefined !== H_sess.SELF.post.carid == true && H_sess.SELF.post.carid != "") //回線の指定あり
						//購入方式の指定あり
						//購入方式取得
						//プラン取得
						//パケット取得
						//ポイントサービス取得
						//割引サービス取得
						//オプション取得
						//地域会社取得
						//公私権限あり
						{
								var carid = H_sess.SELF.post.carid;
								var cirid = "";

								if (undefined !== H_sess.SELF.post.cirid == true && H_sess.SELF.post.cirid != "") {
										cirid = H_sess.SELF.post.cirid;
								}

								var buyselid = "";

								if (undefined !== H_sess.SELF.post.buyselid == true && H_sess.SELF.post.buyselid != "") {
										buyselid = H_sess.SELF.post.buyselid;
								}

								var H_cir = O_model.getCircuitData(carid);
								var H_buysel = O_model.getBuySelData(carid);
								var H_plan = O_model.getPlanData(carid, cirid, buyselid, true);
								var H_packet = O_model.getPacketData(carid, cirid, true);
								var H_point = O_model.getPointData(carid, cirid);
								var H_discount = O_model.getDiscountData(carid, cirid, true);
								var H_option = O_model.getOptionData(carid, cirid, true);
								var H_area = O_model.getAreaData(carid);

								if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
										var H_kousi = O_model.getKousiPtnData(this.O_Sess.pactid, carid, cirid);
								}
						} else //表示言語分岐
						{
								if (this.O_Sess.language == "ENG") //回線種別の配列を生成
										//購入方式の配列を生成
										//プランの配列を生成
										//パケットの配列を生成
										//ポイントサービスの配列を生成
										//割引サービスの配列を生成
										//オプションの配列を生成
										//地域会社の配列を生成
										//公私権限あり
										{
												H_cir = {
														"": "--Please select carrier--"
												};
												H_buysel = {
														"": "--Please select carrier--"
												};
												H_plan = {
														"": "--Please select carrier--"
												};
												H_packet = {
														"": "--Please select carrier--"
												};
												H_point = {
														"": "--Please select carrier--"
												};
												H_discount = Array();
												H_option = Array();
												H_area = {
														"": "--Please select carrier--"
												};

												if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
														H_kousi = {
																"": "--Please select carrier--"
														};
												}
										} else //回線種別の配列を生成
										//購入方式の配列を生成
										//プランの配列を生成
										//パケットの配列を生成
										//ポイントサービスの配列を生成
										//割引サービスの配列を生成
										//オプションの配列を生成
										//地域会社の配列を生成
										//公私権限あり
										{
												H_cir = {
														"": "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
												};
												H_buysel = {
														"": "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
												};
												H_plan = {
														"": "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
												};
												H_packet = {
														"": "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
												};
												H_point = {
														"": "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
												};
												H_discount = Array();
												H_option = Array();
												H_area = {
														"": "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
												};

												if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
														H_kousi = {
																"": "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
														};
												}
										}
						}

				var H_smpcirid = O_model.getSmartCircuitData();
				this.H_Prop = O_model.getManagementProperty(ManagementTelMenuView.TELMID);
				var H_searchcondition = O_manage.getSearchCondition();

				if (this.O_Sess.language == "ENG") //警告状態配列
						//フォーム要素の配列作成
						//公私権限あり
						{
								var H_alert = O_manage.getAlertConditionEng();
								var A_formelement = [{
										name: "telno_view",
										label: "Phone number",
										inputtype: "text",
										options: {
												id: "telno_view",
												size: "25"
										}
								}, {
										name: "carid",
										label: "Carrier",
										inputtype: "select",
										data: H_car,
										options: {
												id: "carid",
												onChange: "javascript:execTelAjax('carid');"
										}
								}, {
										name: "cirid",
										label: "Service type",
										inputtype: "select",
										data: H_cir,
										options: {
												id: "cirid",
												onChange: "javascript:execTelAjax('cirid');"
										}
								}, {
										name: "ciraj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "ciraj"
										}
								}, {
										name: "buyselid",
										label: "Payment method",
										inputtype: "select",
										data: H_buysel,
										options: {
												id: "buyselid",
												onChange: "javascript:execTelAjax('buyselid');"
										}
								}, {
										name: "buyselaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "buyselaj"
										}
								}, {
										name: "planid",
										label: "Billing plan",
										inputtype: "select",
										data: H_plan,
										options: {
												id: "planid",
												onChange: "javascript:setHiddenValue('plan');"
										}
								}, {
										name: "planaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "planaj"
										}
								}, {
										name: "packetid",
										label: "Packetpack",
										inputtype: "select",
										data: H_packet,
										options: {
												id: "packetid",
												onChange: "javascript:setHiddenValue('packet');"
										}
								}, {
										name: "packetaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "packetaj"
										}
								}, {
										name: "pointid",
										label: "Point service",
										inputtype: "select",
										data: H_point,
										options: {
												id: "pointid",
												onChange: "javascript:setHiddenValue('point');"
										}
								}, {
										name: "pointaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "pointaj"
										}
								}, {
										name: "arid",
										label: "Region",
										inputtype: "select",
										data: H_area,
										options: {
												id: "arid",
												onChange: "javascript:setHiddenValue('ar');"
										}
								}, {
										name: "araj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "araj"
										}
								}, {
										name: "discountid",
										label: "Discount service",
										inputtype: "groupcheckbox",
										data: H_discount,
										options: {
												onChange: "javascript:setHiddenCheckBox('discount', this.name);"
										}
								}, {
										name: "discountaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "discountaj"
										}
								}, {
										name: "opid",
										label: "Option",
										inputtype: "groupcheckbox",
										data: H_option,
										options: {
												onChange: "javascript:setHiddenCheckBox('op', this.name);"
										}
								}, {
										name: "opaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "opaj"
										}
								}, {
										name: "simcardno",
										label: "USIM number",
										inputtype: "text",
										options: {
												id: "simcardno",
												size: "25"
										}
								}, {
										name: "username",
										label: "User",
										inputtype: "text",
										options: {
												id: "username",
												size: "25"
										}
								}, {
										name: "employeecode",
										label: "Employee number",
										inputtype: "text",
										options: {
												id: "employeecode",
												size: "25"
										}
								}, {
										name: "userid",
										label: "Viewer for billing",
										inputtype: "text",
										options: {
												id: "userid",
												size: "25"
										}
								}, {
										name: "assetsno",
										label: "Admin number",
										inputtype: "text",
										options: {
												id: "assetsno",
												size: "25"
										}
								}, {
										name: "serialno",
										label: "IMEI No",
										inputtype: "text",
										options: {
												id: "serialno",
												size: "25"
										}
								}, {
										name: "seriesname",
										label: "Series",
										inputtype: "text",
										options: {
												id: "seriesname",
												size: "25"
										}
								}, {
										name: "productname",
										label: "Model",
										inputtype: "text",
										options: {
												id: "memo",
												size: "25"
										}
								}, {
										name: "property",
										label: "Color",
										inputtype: "text",
										options: {
												id: "property",
												size: "25"
										}
								}, {
										name: "bought_price",
										label: "Purchase cost",
										inputtype: "text",
										options: {
												id: "bought_price",
												size: "25"
										}
								}, {
										name: "pay_frequency",
										label: "At the time of installment payment",
										inputtype: "text",
										options: {
												id: "pay_frequency",
												size: "25"
										}
								}, {
										name: "pay_monthly_sum",
										label: "Payment of monthly installment",
										inputtype: "text",
										options: {
												id: "pay_monthly_sum",
												size: "25"
										}
								}, {
										name: "firmware",
										label: "Firmware",
										inputtype: "text",
										options: {
												id: "firmware",
												size: "25"
										}
								}, {
										name: "version",
										label: "Version",
										inputtype: "text",
										options: {
												id: "version",
												size: "25"
										}
								}, {
										name: "smpcirid",
										label: "Handset type",
										inputtype: "select",
										options: {
												id: "smpcirid"
										},
										data: H_smpcirid
								}, {
										name: "accessory",
										label: "Accessories",
										inputtype: "text",
										options: {
												id: "accessory",
												size: "25"
										}
								}, {
										name: "warning_status",
										label: "Warning status",
										inputtype: "select",
										data: H_alert
								}, {
										name: "trgtype",
										label: "Search target",
										inputtype: "advcheckbox",
										data: {
												"1": "Unused line"
										}
								}, {
										name: "search_condition",
										label: "\u691C\u7D22\u6761\u4EF6",
										inputtype: "radio",
										separator: "</td><td>",
										data: H_searchcondition
								}, {
										name: "search",
										label: "Search",
										inputtype: "submit"
								}, {
										name: "reset",
										label: "Reset",
										inputtype: "button",
										options: {
												onClick: "javascript:resetTelFormValue()"
										}
								}];

								if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
										var A_tmp = {
												name: "kousiflg",
												label: "Business and private classification",
												inputtype: "select",
												data: O_manage.getKousiHashEng(),
												options: {
														id: "kousiflg",
														onChange: "javascript:disableKousiSel();"
												}
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "kousiptnid",
												label: "Pattern for business and private classification",
												inputtype: "select",
												data: H_kousi,
												options: {
														id: "kousiptnid",
														onChange: "javascript:setHiddenValue('kousiptn');"
												}
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "kousiptnaj",
												inputtype: "hidden",
												data: "",
												options: {
														id: "kousiptnaj"
												}
										};
										A_formelement.push(A_tmp);
								}

								if (-1 !== O_model.A_Auth.indexOf("fnc_extension_tel_co")) {
										A_tmp = {
												name: "extensionno",
												label: "Extension number",
												inputtype: "text",
												options: {
														id: "recogname",
														size: "25"
												}
										};
										A_formelement.push(A_tmp);
								}

								if (-1 !== O_model.A_Auth.indexOf("fnc_fjp_co") == true) //fjp で用途区分あり
										{
												var temps = [{
														name: "recogname",
														label: "\u627F\u8A8D\u8005\u540D",
														inputtype: "text",
														options: {
																id: "recogname",
																size: "25"
														}
												}, {
														name: "recogcode",
														label: "\u627F\u8A8D\u8005\u30B3\u30FC\u30C9",
														inputtype: "text",
														options: {
																id: "recocode",
																size: "25"
														}
												}, {
														name: "pbpostname",
														label: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u540D",
														inputtype: "text",
														options: {
																id: "pbpostname",
																size: "25"
														}
												}, {
														name: "pbpostcode",
														label: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
														inputtype: "text",
														options: {
																id: "pbpostcode",
																size: "25",
																maxlength: 7
														}
												}, {
														name: "cfbpostname",
														label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u540D",
														inputtype: "text",
														options: {
																id: "cfbpostname",
																size: "25"
														}
												}, {
														name: "cfbpostcode",
														label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
														inputtype: "text",
														options: {
																id: "cfbpostcode",
																size: "25",
																maxlength: 7
														}
												}, {
														name: "ioecode",
														label: "\u8CFC\u5165\u30AA\u30FC\u30C0",
														inputtype: "text",
														options: {
																id: "ioecode",
																size: "25"
														}
												}, {
														name: "coecode",
														label: "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0",
														inputtype: "text",
														options: {
																id: "coecode",
																size: "25"
														}
												}, {
														name: "commflag",
														label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5909\u66F4\u30D5\u30E9\u30B0",
														inputtype: "select",
														data: {
																"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
																auto: "\u81EA\u52D5\u66F4\u65B0\u3059\u308B",
																manual: "\u81EA\u52D5\u66F4\u65B0\u3057\u306A\u3044"
														},
														options: {
																id: "commflag"
														}
												}];

												if (-1 !== O_model.A_Auth.indexOf("fnc_tel_division") == true) {
														temps.push({
																name: "division",
																label: "\u7528\u9014",
																inputtype: "select",
																data: {
																		"": "\u5168\u3066\u8868\u793A",
																		"1": "\u696D\u52D9\u7528",
																		"2": "\u30C7\u30E2\u7528",
																		"-1": "\u306A\u3057"
																},
																options: {
																		id: "division"
																}
														});
												}

												for (var temp of Object.values(temps)) {
														A_formelement.push(temp);
												}
										}
						} else //警告状態配列
						//フォーム要素の配列作成
						//公私権限あり
						{
								H_alert = O_manage.getAlertCondition();
								A_formelement = [{
										name: "telno_view",
										label: "\u96FB\u8A71\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "telno_view",
												size: "25"
										}
								}, {
										name: "carid",
										label: "\u96FB\u8A71\u4F1A\u793E",
										inputtype: "select",
										data: H_car,
										options: {
												id: "carid",
												onChange: "javascript:execTelAjax('carid');"
										}
								}, {
										name: "cirid",
										label: "\u56DE\u7DDA\u7A2E\u5225",
										inputtype: "select",
										data: H_cir,
										options: {
												id: "cirid",
												onChange: "javascript:execTelAjax('cirid');"
										}
								}, {
										name: "ciraj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "ciraj"
										}
								}, {
										name: "buyselid",
										label: "\u8CFC\u5165\u65B9\u5F0F",
										inputtype: "select",
										data: H_buysel,
										options: {
												id: "buyselid",
												onChange: "javascript:execTelAjax('buyselid');"
										}
								}, {
										name: "buyselaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "buyselaj"
										}
								}, {
										name: "planid",
										label: "\u6599\u91D1\u30D7\u30E9\u30F3",
										inputtype: "select",
										data: H_plan,
										options: {
												id: "planid",
												onChange: "javascript:setHiddenValue('plan');"
										}
								}, {
										name: "planaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "planaj"
										}
								}, {
										name: "packetid",
										label: "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF",
										inputtype: "select",
										data: H_packet,
										options: {
												id: "packetid",
												onChange: "javascript:setHiddenValue('packet');"
										}
								}, {
										name: "packetaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "packetaj"
										}
								}, {
										name: "pointid",
										label: "\u30DD\u30A4\u30F3\u30C8\u30B5\u30FC\u30D3\u30B9",
										inputtype: "select",
										data: H_point,
										options: {
												id: "pointid",
												onChange: "javascript:setHiddenValue('point');"
										}
								}, {
										name: "pointaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "pointaj"
										}
								}, {
										name: "arid",
										label: "\u5730\u57DF\u4F1A\u793E",
										inputtype: "select",
										data: H_area,
										options: {
												id: "arid",
												onChange: "javascript:setHiddenValue('ar');"
										}
								}, {
										name: "araj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "araj"
										}
								}, {
										name: "discountid",
										label: "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9",
										inputtype: "groupcheckbox",
										data: H_discount,
										options: {
												onChange: "javascript:setHiddenCheckBox('discount', this.name);"
										}
								}, {
										name: "discountaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "discountaj"
										}
								}, {
										name: "opid",
										label: "\u30AA\u30D7\u30B7\u30E7\u30F3",
										inputtype: "groupcheckbox",
										data: H_option,
										options: {
												onChange: "javascript:setHiddenCheckBox('op', this.name);"
										}
								}, {
										name: "opaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "opaj"
										}
								}, {
										name: "simcardno",
										label: "SIM\u30AB\u30FC\u30C9\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "simcardno",
												size: "25"
										}
								}, {
										name: "username",
										label: "\u4F7F\u7528\u8005",
										inputtype: "text",
										options: {
												id: "username",
												size: "25"
										}
								}, {
										name: "employeecode",
										label: "\u793E\u54E1\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "employeecode",
												size: "25"
										}
								}, {
										name: "userid",
										label: "\u8ACB\u6C42\u95B2\u89A7\u8005",
										inputtype: "text",
										options: {
												id: "userid",
												size: "25"
										}
								}, {
										name: "assetsno",
										label: "\u7BA1\u7406\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "assetsno",
												size: "25"
										}
								}, {
										name: "serialno",
										label: "\u88FD\u9020\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "serialno",
												size: "25"
										}
								}, {
										name: "seriesname",
										label: "\u30B7\u30EA\u30FC\u30BA",
										inputtype: "text",
										options: {
												id: "seriesname",
												size: "25"
										}
								}, {
										name: "productname",
										label: "\u6A5F\u7A2E",
										inputtype: "text",
										options: {
												id: "memo",
												size: "25"
										}
								}, {
										name: "property",
										label: "\u8272",
										inputtype: "text",
										options: {
												id: "property",
												size: "25"
										}
								}, {
										name: "bought_price",
										label: "\u53D6\u5F97\u4FA1\u683C",
										inputtype: "text",
										options: {
												id: "bought_price",
												size: "25"
										}
								}, {
										name: "pay_frequency",
										label: "\u5272\u8CE6\u56DE\u6570",
										inputtype: "text",
										options: {
												id: "pay_frequency",
												size: "25"
										}
								}, {
										name: "pay_monthly_sum",
										label: "\u5272\u8CE6\u6708\u984D",
										inputtype: "text",
										options: {
												id: "pay_monthly_sum",
												size: "25"
										}
								}, {
										name: "firmware",
										label: "\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2",
										inputtype: "text",
										options: {
												id: "firmware",
												size: "25"
										}
								}, {
										name: "version",
										label: "\u30D0\u30FC\u30B8\u30E7\u30F3",
										inputtype: "text",
										options: {
												id: "version",
												size: "25"
										}
								}, {
										name: "smpcirid",
										label: "\u7AEF\u672B\u7A2E\u5225",
										inputtype: "select",
										options: {
												id: "smpcirid"
										},
										data: H_smpcirid
								}, {
										name: "accessory",
										label: "\u4ED8\u5C5E\u54C1",
										inputtype: "text",
										options: {
												id: "accessory",
												size: "25"
										}
								}, {
										name: "warning_status",
										label: "\u8B66\u544A\u72B6\u614B",
										inputtype: "select",
										data: H_alert
								}, {
										name: "trgtype",
										label: "\u691C\u7D22\u5BFE\u8C61",
										inputtype: "advcheckbox",
										data: {
												"1": "\u672A\u4F7F\u7528\u96FB\u8A71"
										}
								}, {
										name: "search_condition",
										label: "\u691C\u7D22\u6761\u4EF6",
										inputtype: "radio",
										separator: "</td><td>",
										data: H_searchcondition
								}, {
										name: "search",
										label: "\u691C\u7D22",
										inputtype: "submit"
								}, {
										name: "reset",
										label: "\u30EA\u30BB\u30C3\u30C8",
										inputtype: "button",
										options: {
												onClick: "javascript:resetTelFormValue()"
										}
								}];

								if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
										A_tmp = {
												name: "kousiflg",
												label: "\u516C\u79C1\u5206\u8A08",
												inputtype: "select",
												data: O_manage.getKousiHash(),
												options: {
														id: "kousiflg",
														onChange: "javascript:disableKousiSel();"
												}
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "kousiptnid",
												label: "\u4F7F\u7528\u3059\u308B\u30D1\u30BF\u30FC\u30F3",
												inputtype: "select",
												data: H_kousi,
												options: {
														id: "kousiptnid",
														onChange: "javascript:setHiddenValue('kousiptn');"
												}
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "kousiptnaj",
												inputtype: "hidden",
												data: "",
												options: {
														id: "kousiptnaj"
												}
										};
										A_formelement.push(A_tmp);
								}

								if (-1 !== O_model.A_Auth.indexOf("fnc_extension_tel_co")) {
										A_tmp = {
												name: "extensionno",
												label: "\u5185\u7DDA\u756A\u53F7",
												inputtype: "text",
												options: {
														id: "recogname",
														size: "25"
												}
										};
										A_formelement.push(A_tmp);
								}

								if (-1 !== O_model.A_Auth.indexOf("fnc_fjp_co") == true) //fjp で用途区分あり
										{
												temps = [{
														name: "recogname",
														label: "\u627F\u8A8D\u8005\u540D",
														inputtype: "text",
														options: {
																id: "recogname",
																size: "25"
														}
												}, {
														name: "recogcode",
														label: "\u627F\u8A8D\u8005\u30B3\u30FC\u30C9",
														inputtype: "text",
														options: {
																id: "recocode",
																size: "25"
														}
												}, {
														name: "pbpostname",
														label: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u540D",
														inputtype: "text",
														options: {
																id: "pbpostname",
																size: "25"
														}
												}, {
														name: "pbpostcode",
														label: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
														inputtype: "text",
														options: {
																id: "pbpostcode",
																size: "25",
																maxlength: 7
														}
												}, {
														name: "cfbpostname",
														label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u540D",
														inputtype: "text",
														options: {
																id: "cfbpostname",
																size: "25"
														}
												}, {
														name: "cfbpostcode",
														label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
														inputtype: "text",
														options: {
																id: "cfbpostcode",
																size: "25",
																maxlength: 7
														}
												}, {
														name: "ioecode",
														label: "\u8CFC\u5165\u30AA\u30FC\u30C0",
														inputtype: "text",
														options: {
																id: "ioecode",
																size: "25"
														}
												}, {
														name: "coecode",
														label: "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0",
														inputtype: "text",
														options: {
																id: "coecode",
																size: "25"
														}
												}, {
														name: "commflag",
														label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5909\u66F4\u30D5\u30E9\u30B0",
														inputtype: "select",
														data: {
																"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
																auto: "\u81EA\u52D5\u66F4\u65B0\u3059\u308B",
																manual: "\u81EA\u52D5\u66F4\u65B0\u3057\u306A\u3044"
														},
														options: {
																id: "commflag"
														}
												}, {
														name: "employee_class",
														label: "\u793E\u54E1\u533A\u5206",
														inputtype: "select",
														data: {
																"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
																"1": "\u4E00\u822C\u793E\u54E1",
																"2": "\u5E79\u90E8\u793E\u54E1"
														},
														options: {
																id: "employee_class"
														}
												}, {
														name: "executive_no",
														label: "\u5E79\u90E8\u793E\u54E1\u5F93\u696D\u54E1\u756A\u53F7",
														inputtype: "text",
														options: {
																id: "executive_no",
																size: 25,
																maxlength: "255"
														}
												}, {
														name: "executive_name",
														label: "\u5E79\u90E8\u793E\u54E1\u6C0F\u540D",
														inputtype: "text",
														options: {
																id: "executive_name",
																size: 25,
																maxlength: "255"
														}
												}, {
														name: "executive_mail",
														label: "\u5E79\u90E8\u793E\u54E1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
														inputtype: "text",
														options: {
																id: "executive_mail",
																size: 25,
																maxlength: "255"
														}
												}, {
														name: "salary_source_name",
														label: "\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u540D",
														inputtype: "text",
														options: {
																id: "salary_source_name",
																size: 25,
																maxlength: "255"
														}
												}, {
														name: "salary_source_code",
														label: "\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
														inputtype: "text",
														options: {
																id: "salary_source_code",
																size: 25,
																maxlength: "255"
														}
												}, {
														name: "office_code",
														label: "\u4E8B\u696D\u6240\u30B3\u30FC\u30C9",
														inputtype: "text",
														options: {
																id: "office_code",
																size: 25,
																maxlength: "255"
														}
												}, {
														name: "office_name",
														label: "\u4E8B\u696D\u6240\u540D",
														inputtype: "text",
														options: {
																id: "office_name",
																size: 25,
																maxlength: "255"
														}
												}, {
														name: "building_name",
														label: "\u30D3\u30EB\u540D",
														inputtype: "text",
														options: {
																id: "building_code",
																size: 25,
																maxlength: "255"
														}
												}];

												if (-1 !== O_model.A_Auth.indexOf("fnc_tel_division") == true) {
														temps.push({
																name: "division",
																label: "\u7528\u9014",
																inputtype: "select",
																data: {
																		"": "\u5168\u3066\u8868\u793A",
																		"1": "\u696D\u52D9\u7528",
																		"2": "\u30C7\u30E2\u7528",
																		"-1": "\u306A\u3057"
																},
																options: {
																		id: "division"
																}
														});
												}

												for (var temp of Object.values(temps)) {
														A_formelement.push(temp);
												}
										}
						}

				this.H_View.O_SearchFormUtil = new QuickFormUtil("searchform");
				this.H_View.O_SearchFormUtil.setFormElement(A_formelement);
				this.O_SearchForm = this.H_View.O_SearchFormUtil.makeFormObject();
				var H_prop = this.makeSearchPropertyElement(this.H_Prop);

				if (this.O_Sess.language == "ENG") {
						H_prop.int.bought_price = "Purchase cost";
						H_prop.int.pay_frequency = "At the time of installment payment";
						H_prop.int.pay_monthly_sum = "Payment of monthly installment";
						H_prop.date.contractdate = "Contracted date";
						H_prop.date.orderdate = "Purchased date of your cuurent phone";
						H_prop.date.bought_date = "Purchase date";
						H_prop.date.pay_startdate = "First month of installment month";
						H_prop.mail.mail = "E-mail address";
				} else {
						H_prop.int.bought_price = "\u53D6\u5F97\u4FA1\u683C";
						H_prop.int.pay_frequency = "\u5272\u8CE6\u56DE\u6570";
						H_prop.int.pay_monthly_sum = "\u5272\u8CE6\u6708\u984D";
						H_prop.date.contractdate = "\u5951\u7D04\u65E5";
						H_prop.date.orderdate = "\u6700\u65B0\u6A5F\u7A2E\u8CFC\u5165\u65E5";
						H_prop.date.bought_date = "\u8CFC\u5165\u65E5";
						H_prop.date.pay_startdate = "\u5272\u8CE6\u958B\u59CB\u6708";
						H_prop.mail.mail = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9";
				}

				if (-1 !== O_model.A_Auth.indexOf("fnc_receipt") == true) {
						if (this.O_Sess.language == "ENG") {
								H_prop.date.receiptdate = "\u2605\u53D7\u9818\u65E5";
						} else {
								H_prop.date.receiptdate = "\u53D7\u9818\u65E5";
						}
				}

				this.makePropertyForm(this.H_View.O_SearchFormUtil, H_prop, O_manage);
		}

		displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_manage: ManagementUtil) //拡張表示項目一覧取得
		//拡張表示項目で検索されたもの取得
		//予約のページリンク作成
		//電話一覧とgetパラメータが被るので置換（r_を付ける）
		//検索サブフォームの表示・非表示
		//拡張表示項目
		//予約件数
		//予約リスト
		//予約ページリンク
		//予約表示モード
		//su
		//警告欄の表示について・・・会社権限「警告欄の表示があれば表示」
		//メール送信にてチェックをつけたもの
		{
				var H_addcol = this.getAddViewColArray(H_sess.SELF.post);
				var H_viewcol = this.getAddViewCol(H_addcol, H_sess.SELF.post);

				if (this.O_Sess.language == "ENG") {
						var r_page_link = O_manage.getPageLinkEng(A_data[2], H_sess.SELF.limit, H_sess.SELF.r_offset);
				} else {
						r_page_link = O_manage.getPageLink(A_data[2], H_sess.SELF.limit, H_sess.SELF.r_offset);
				}

				r_page_link = r_page_link.replace(/\?p=(\d+)/g, "?r_p=$1#reserve_look");
				this.get_Smarty().assign("f_showform", this.getShowSubForm("first", H_sess.SELF.post));
				this.get_Smarty().assign("s_showform", this.getShowSubForm("second", H_sess.SELF.post));
				this.get_Smarty().assign("t_showform", this.getShowSubForm("third", H_sess.SELF.post));
				this.get_Smarty().assign("H_viewcol", H_viewcol);
				this.get_Smarty().assign("r_list_cnt", A_data[2]);
				this.get_Smarty().assign("H_r_list", A_data[3]);
				this.get_Smarty().assign("r_page_link", r_page_link);
				this.get_Smarty().assign("r_m", H_sess.SELF.r_mode);
				this.get_Smarty().assign("su", this.O_Sess.su);
				var is_view_warning = false;

				if (-1 !== A_auth.indexOf("fnc_view_tel_warning")) //ユーザー権限の「警告欄の表示をしない権限」がないか、スーパーユーザーであれば表示する
						{
								if (!(-1 !== A_auth.indexOf("fnc_show_admonition")) || this.O_Sess.su) {
										is_view_warning = true;
								}
						}

				this.get_Smarty().assign("is_view_warning", is_view_warning);

				if (undefined !== H_sess.SELF.checklist) {
						this.get_Smarty().assign("checklist", H_sess.SELF.checklist);
				} else {
						this.get_Smarty().assign("checklist", Array());
				}
		}

		getAddViewColArray(H_post: {} | any[]) //ユーザ設定項目の配列生成
		//bought_dateは固定表示なので除く
		{
				var H_prop = this.makeSearchPropertyElement(this.H_Prop);

				if (undefined !== H_post.text == false) {
						H_post.text.column = "";
				}

				if (undefined !== H_post.int == false) {
						H_post.int.column = "";
				}

				if (undefined !== H_post.date == false) {
						H_post.date.column = "";
				}

				if (undefined !== H_post.mail == false) {
						H_post.mail.column = "";
				}

				if (undefined !== H_post.url == false) {
						H_post.url.column = "";
				}

				if (undefined !== H_post.select_val == false) {
						H_post.select.column = "";
				}

				if (H_post.date.column == "orderdate") {
						var dateview = "\u6700\u65B0\u6A5F\u7A2E\u8CFC\u5165\u65E5";
				} else if (H_post.date.column == "contractdate") {
						dateview = "\u5951\u7D04\u65E5";
				} else {
						dateview = H_prop.date[H_post.date.column];
				}

				var H_addcol = {
						employeecode: "\u793E\u54E1\u756A\u53F7",
						assetsno: "\u7BA1\u7406\u756A\u53F7",
						serialno: "\u88FD\u9020\u756A\u53F7",
						mail: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
						userid: "\u8ACB\u6C42\u95B2\u89A7\u8005",
						text: H_prop.text[H_post.text.column],
						int: H_prop.int[H_post.int.column],
						date: dateview,
						mail: H_prop.mail[H_post.mail.column],
						url: H_prop.url[H_post.url.column],
						select: H_prop.select[H_post.select_val.column]
				};

				if (H_post.date.column == "bought_date") {
						delete H_addcol.date;
				}

				return H_addcol;
		}

		makePankuzuLinkHash() {
				if (this.O_Sess.language == "ENG") {
						var H_link = {
								"": "Admin informations"
						};
				} else {
						H_link = {
								"": "\u7BA1\u7406\u60C5\u5831"
						};
				}

				return H_link;
		}

		getDownloadLink() {}

		getHeaderJS() //表示言語分岐
		{
				if (this.O_Sess.language == "ENG") {
						var str = "<script language=\"Javascript\" src=\"/js/prototype.js\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/eng/Management/ManagementMenu.js?update=20180301\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/eng/Management/TelAjax.js\"></script>\n";
				} else {
						str = "<script language=\"Javascript\" src=\"/js/prototype.js\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/Management/ManagementMenu.js?update=20180301\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/Management/TelAjax.js\"></script>\n";
				}

				return str;
		}

		getShowSubForm(name, H_post: {} | any[]) //フォームごとの要素配列
		{
				var str = "none";
				var A_elm = Array();

				if ("first" == name) {
						A_elm = ["cirid", "buyselid", "planid", "packetid", "pointid", "arid", "discountid", "optionid", "kousiflg", "kousiptnid"];
				} else if ("second" == name) {
						A_elm = ["assetsno", "serialno", "firmware", "version", "seriesname", "productname", "property", "smpcirid", "accessory"];
				} else if ("third" == name) {
						A_elm = ["text", "int", "date"];
				}

				for (var key in H_post) //検索フォームの入力があればフォームを表示
				{
						var val = H_post[key];

						if (-1 !== A_elm.indexOf(key) == true) //グループ要素はcolumnでチェック
								{
										if (Array.isArray(val) == true) {
												if (val.column != "") {
														str = "block";
														break;
												}
										} else {
												if (val != "") {
														str = "block";
														break;
												}
										}
								}
				}

				return str;
		}

		__destruct() {
				super.__destruct();
		}

};