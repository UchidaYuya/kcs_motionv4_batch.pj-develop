//
//電話新規登録のView
//
//更新履歴：<br>
//2008/05/30 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/05/30
//@filesource
//@uses ManagementAddViewBase
//@uses QuickFormUtil
//@uses ViewFinish
//@uses ExtensionTelModel
//
//
//error_reporting(E_ALL);
//
//電話新規登録のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/05/30
//@uses ManagementAddViewBase
//@uses QuickFormUtil
//@uses ViewFinish
//

require("view/Management/ManagementAddViewBase.php");

require("model/ExtensionTelModel.php");

//
//端末登録フォーム要素につける印
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/05/30
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//各ページ用各権限チェック
//
//@author houshiyama
//@since 2008/05/30
//
//@access protected
//@return void
//
//
//電話新規登録固有のsetDeraultSession <br>
//
//登録タイプがセッションに無ければ作る（デフォルトは今すぐ） <br>
//
//@author houshiyama
//@since 2008/05/30
//
//@access protected
//@return void
//
//
//電話新規登録固有のcheckCGIParam <br>
//
//検索が実行されたらajaxの値をフォーム要素に入れる <br>
//
//@author houshiyama
//@since 2008/05/30
//
//@access protected
//@return void
//
//
//データの取得を兼ねたパラメータチェック <br>
//
//端末情報取得処理 <br>
//予約重複処理 <br>
//
//@author houshiyama
//@since 2008/07/31
//
//@param mixed $O_model
//@param array $H_sess
//@access public
//@return void
//
//
//電話の新規登録フォームを作成する<br>
//
//端末フォームの要素に付ける印決定（ここでは確実にひとつだけど配列で）<br>
//基底クラスから新規登録フォーム要素取得（電話）<br>
//基底クラスから新規登録フォーム要素取得（端末）<br>
//端末フォームに印を付ける<br>
//予約権限あり固有の要素追加<br>
//新規登録固有の要素追加<br>
//フォームのオブジェクト生成<br>
//
//@author houshiyama
//@since 2008/05/30
//
//@param object $O_manage
//@param object $O_model
//@param array $H_sess
//@access public
//@return void
//@uses QuickFormUtil
//
//
//電話新規登録フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/05/30
//
//@access public
//@return void
//
//
//電話新規登録固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/05/30
//
//@param mixed $H_session
//@param mixed $H_tree
//@param mixed $A_data
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/05/30
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/05/30
//
//@access public
//@return void
//
//
//配下フォームの表示・非表示を返す
//
//@author houshiyama
//@since 2008/06/03
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//完了画面表示 <br>
//
//セッションクリア <br>
//2重登録防止メソッド呼び出し <br>
//完了画面表示 <br>
//
//@author houshiyama
//@since 2008/05/30
//
//@param array $H_sess
//@access protected
//@return void
//
//
//FJP用用途の表示制御
//
//@author web
//@since 2013/09/20
//
//@param array $H_sess
//@param array $A_auth
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/30
//
//@access public
//@return void
//
class TelAddView extends ManagementAddViewBase {
	constructor() {
		super();
		this.O_Set.loadConfig("H_employee_number_validation");
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_tel_manage_adm") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() //登録タイプがセッションに無ければ作る（デフォルトは今すぐ）
	{
		if (undefined !== this.H_Local.post.addsubmit == false && undefined !== this.H_Local.post.addtype == false) {
			this.H_Local.post.addtype = "now";
			this.H_Local.post.adddate = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d") + 1, date("Y")));
			this.H_Local.post.kousiflg = "2";
		}
	}

	checkCGIParamPeculiar() //端末情報取得が実行された時
	{
		if (_POST.length > 0) {
			this.H_Local.post = _POST;

			if (undefined !== _POST.recogname && "" != _POST.recogname) {
				_POST.recogname_view = _POST.recogname;
			}

			if (undefined !== _POST.recogcode && "" != _POST.recogcode) {
				_POST.recogcode_view = _POST.recogcode;
			}

			if (undefined !== _POST.pbpostname && "" != _POST.pbpostname) {
				_POST.pbpostname_view = _POST.pbpostname;
			}

			if (undefined !== _POST.pbpostcode_first && "" != _POST.pbpostcode_first) {
				_POST.pbpostcode_view = _POST.pbpostcode_first;
			}

			if (undefined !== _POST.cfbpostname && "" != _POST.cfbpostname) {
				_POST.cfbpostname_view = _POST.cfbpostname;
			}

			if (undefined !== _POST.cfbpostcode_first && "" != _POST.cfbpostcode_first) {
				_POST.cfbpostcode_view = _POST.cfbpostcode_first;
			}
		}

		if (undefined !== _POST.addsubmit == true) //チェックボックス要素
			//ajaxの値をフォーム要素に入れる
			{
				var A_checkBoxElement = ["opaj", "discountaj"];

				for (var key in _POST) {
					var val = _POST[key];

					if (preg_match("/aj/", key) == true) //チェックボックスもの
						{
							var ajkey = key.replace(/aj/g, "id");

							if (-1 !== A_checkBoxElement.indexOf(key) == true) {
								var A_val = this.convertCheckBoxValue(val);
								this.H_Local.post[ajkey] = A_val;
								_POST[ajkey] = A_val;
							} else if (preg_match("/^webreliefaj/", key)) {
								this.H_Local.post.webrelief = val;
							} else {
								this.H_Local.post[ajkey] = val;
							}
						}
				}
			}
	}

	getInfoParamCheck(O_model, H_sess: {} | any[]) //端末情報取得時
	{
		if (undefined !== _POST.get_ass_info_flg === true && "2" === _POST.get_ass_info_flg) //エラーならば画面に表示
			{
				if (undefined !== _POST.asscnt == false) {
					var num = "0";
				} else {
					num = _POST.asscnt - 1;
				}

				var key = "assetsno_" + num;
				O_model.setTableName(H_sess[TelAddView.PUB].cym);
				var H_res = O_model.getAssetsInfoByAssetsNo(_POST[key]);

				if (H_res == false) //表示言語分岐
					//フラグを戻す
					//unset( $_POST );
					{
						if (this.O_Sess.language == "ENG") {
							this.H_View.O_AddFormUtil.setElementErrorWrapper(key, "We could not find handset information");
						} else {
							this.H_View.O_AddFormUtil.setElementErrorWrapper(key, "\u7AEF\u672B\u60C5\u5831\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
						}

						this.H_View.O_AddFormUtil.O_Form._submitValues.get_ass_info_flg = "";
					} else //ポストの値を保持
					//チェックボックス要素
					//ajaxの値をフォーム要素に入れる
					//DBから取得した値を合体
					//キャリアと回線
					//シリーズと機種と色
					//フラグを戻す
					//セッションに入れ
					//リロード
					{
						this.H_Local.post = _POST;
						var A_checkBoxElement = ["opaj", "discountaj"];

						for (var key in _POST) {
							var val = _POST[key];

							if (preg_match("/aj/", key) == true) //チェックボックスもの
								{
									var ajkey = key.replace(/aj/g, "id");

									if (-1 !== A_checkBoxElement.indexOf(key) == true) {
										var A_val = this.convertCheckBoxValue(val);
										this.H_Local.post[ajkey] = A_val;
										_POST[ajkey] = A_val;
									} else {
										this.H_Local.post[ajkey] = val;
									}
								}
						}

						H_res.note = H_res.memo;

						for (var key in H_res) {
							var val = H_res[key];
							this.H_Local.post[key + "_" + num] = val;
						}

						this.H_Local.post["searchcarid_" + num] = this.H_Local.post["search_carid_" + num];
						this.H_Local.post["searchcaraj_" + num] = this.H_Local.post["search_carid_" + num];
						this.H_Local.post["searchcirid_" + num] = this.H_Local.post["search_cirid_" + num];
						this.H_Local.post["searchciraj_" + num] = this.H_Local.post["search_cirid_" + num];
						this.H_Local.post["seriesid_" + num] = this.H_Local.post["seriesname_" + num];
						this.H_Local.post["seriesaj_" + num] = this.H_Local.post["seriesname_" + num];

						if (this.H_Local.post["productid_" + num] != "") {
							this.H_Local.post["productid_" + num] = this.H_Local.post["productid_" + num] + ":" + this.H_Local.post["productname_" + num];
							this.H_Local.post["productaj_" + num] = this.H_Local.post["productid_" + num] + ":" + this.H_Local.post["productname_" + num];
							this.H_Local.post["productname_" + num] = "";
						}

						if (this.H_Local.post["branchid_" + num] != "") {
							this.H_Local.post["branchid_" + num] = this.H_Local.post["branchid_" + num] + ":" + this.H_Local.post["property_" + num];
							this.H_Local.post["branchaj_" + num] = this.H_Local.post["branchid_" + num] + ":" + this.H_Local.post["property_" + num];
							this.H_Local.post["property_" + num] = "";
						}

						this.H_Local.post["get_flg_" + num] = "1";
						this.H_Local.post.get_ass_info_flg = "";
						this.O_Sess.setSelfAll(this.H_Local);
						MtExceptReload.raise(undefined);
					}
			}

		if (undefined !== _POST.extensionno_submit == true && _POST.extensionno_submit == "1") //ポストの値を保持
			{
				this.H_Local.post = _POST;

				if (this.H_Local.post.carid == "") //表示言語分岐
					{
						if (this.O_Sess.language == "ENG") {
							this.H_View.O_AddFormUtil.setElementErrorWrapper("extensionno", "Select telephone carrier");
						} else {
							this.H_View.O_AddFormUtil.setElementErrorWrapper("extensionno", "\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
						}
					} else //フラグを戻す
					{
						this.H_View.O_AddFormUtil.O_Form._submitValues.extensionno_submit = "";
						this.H_Local.post.extensionno_submit = "";
						var O_extention = new ExtensionTelModel();

						if (!(this.H_Local.post.extensionno = O_extention.getExtensionNo(this.O_Sess.pactid, this.H_Local.post.carid))) //表示言語分岐
							{
								if (this.O_Sess.language == "ENG") {
									this.H_View.O_AddFormUtil.setElementErrorWrapper("extensionno", "We could not find extensionno");
								} else {
									this.H_View.O_AddFormUtil.setElementErrorWrapper("extensionno", "\u4F7F\u7528\u3067\u304D\u308B\u5185\u7DDA\u96FB\u8A71\u304C\u3042\u308A\u307E\u305B\u3093");
								}
							} else //セッションに入れ
							//リロード
							{
								this.O_Sess.setSelfAll(this.H_Local);
								MtExceptReload.raise(undefined);
							}
					}
			}

		if (undefined !== _POST.addsubmit === true) {
			O_model.setTableName(H_sess[TelAddView.PUB].cym);

			if (O_model.checkTelReserveExist(O_model.O_Manage.convertNoView(_POST.telno_view), _POST.carid) == true) //表示言語分岐
				{
					if (this.O_Sess.language == "ENG") {
						this.H_View.res_mess = "\u203B\n\t\t\t\t\tNew registration reservation with the same phone carrier and number is already registered. Registered new reservation will be cleared if operation is continued.";
					} else {
						this.H_View.res_mess = "\u203B\n\t\t\t\t\t\u5165\u529B\u3055\u308C\u305F\u96FB\u8A71\u4F1A\u793E\u3001\u96FB\u8A71\u756A\u53F7\u3068\u540C\u3058\u65B0\u898F\u767B\u9332\u4E88\u7D04\u304C\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002 \u3053\u306E\u307E\u307E\u64CD\u4F5C\u3092\u7D9A\u884C\u3059\u308B\u3068\u767B\u9332\u6E08\u306E\u65B0\u898F\u767B\u9332\u4E88\u7D04\u306F\u89E3\u9664\u3055\u308C\u307E\u3059\u3002";
					}
				}
		}
	}

	makeAddForm(O_manage, O_model, H_sess: {} | any[]) //端末フォームの要素に付ける印決定（ここでは確実にひとつだけど配列で）
	//基底クラスから新規登録フォーム要素取得（電話）
	//端末フォームに印を付ける（新規だから1個、ループする必要は今のところ無いが今後を考慮してループしている）
	//Fjp権限あり
	//クイックフォームオブジェクト生成
	{
		this.A_Assform = ["_0"];
		var A_formelement = this.getTelAddModFormElement(O_manage, O_model, H_sess);

		for (var acnt = 0; acnt < this.A_Assform.length; acnt++) //基底クラスから新規登録フォーム要素取得（端末）
		{
			H_sess.SELF.post.searchcarid = H_sess.SELF.post["searchcarid_" + acnt];
			H_sess.SELF.post.searchcirid = H_sess.SELF.post["searchcirid_" + acnt];
			H_sess.SELF.post.seriesid = H_sess.SELF.post["seriesid_" + acnt];
			var A_product = split(":", H_sess.SELF.post["productid_" + acnt]);
			H_sess.SELF.post.productid = A_product[0];
			var A_assetsformelement = this.getAssetsAddModFormElement(O_manage, O_model, H_sess, "tel");

			for (var cnt = 0; cnt < A_assetsformelement.length; cnt++) {
				{
					let _tmp_1 = A_assetsformelement[cnt];

					for (var key in _tmp_1) //name要素
					{
						var val = _tmp_1[key];

						if ("name" === key) {
							A_assetsformelement[cnt][key] = val + this.A_Assform[acnt];
						}

						if ("options" === key) {
							{
								let _tmp_0 = A_assetsformelement[cnt][key];

								for (var okey in _tmp_0) {
									var oval = _tmp_0[okey];

									if ("id" === okey) {
										A_assetsformelement[cnt][key][okey] = oval + this.A_Assform[acnt];
									}
								}
							}
						}
					}
				}
			}
		}

		A_formelement = array_merge(A_formelement, A_assetsformelement);

		if (-1 !== O_model.A_Auth.indexOf("fnc_fjp_co") == true) {
			A_formelement = array_merge(A_formelement, this.getFjpAddModFormElement());

			if (-1 !== O_model.A_Auth.indexOf("fnc_tel_division")) {
				A_formelement = array_merge(A_formelement, this.getDivisionAddModFormElement());
			}
		}

		if (this.O_Sess.language == "ENG") //新規のみの要素追加
			//端末数
			//関連電話数
			{
				if (-1 !== O_model.A_Auth.indexOf("fnc_tel_reserve") == true) //予約用の日付フォーマット取得
					//登録タイプ取得
					//登録日
					{
						this.H_View.H_reservedate = O_manage.getReserveDateFormatEng();
						this.H_View.firstdate = O_manage.makeTommorowdate(1);
						this.H_View.lastdate = O_manage.makeLimitLastdate(2);
						var H_addtype = O_manage.getAddTypeHashEng();
						var A_tmp = {
							name: "addtype",
							label: "Registere date",
							inputtype: "radio",
							options: {
								id: "addtype"
							},
							data: H_addtype
						};
						A_formelement.push(A_tmp);
						A_tmp = {
							name: "adddate",
							label: "Registere date",
							inputtype: "date",
							options: {
								id: "adddate"
							},
							data: this.H_View.H_reservedate
						};
						A_formelement.push(A_tmp);
					} else {
					A_tmp = {
						name: "addtype",
						label: "Registere date",
						inputtype: "hidden",
						options: {
							id: "addtype"
						},
						data: "now"
					};
					A_formelement.push(A_tmp);
				}

				A_tmp = {
					name: "asscnt",
					inputtype: "hidden",
					options: {
						id: "asscnt"
					},
					data: "1"
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "reltelcnt",
					inputtype: "hidden",
					options: {
						id: "reltelcnt"
					},
					data: "1"
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "addsubmit",
					label: this.NextName,
					inputtype: "submit"
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "flag",
					data: "",
					inputtype: "hidden"
				};
				A_formelement.push(A_tmp);
			} else //新規のみの要素追加
			//端末数
			//関連電話数
			{
				if (-1 !== O_model.A_Auth.indexOf("fnc_tel_reserve") == true) //予約用の日付フォーマット取得
					//登録タイプ取得
					//登録日
					{
						this.H_View.H_reservedate = O_manage.getReserveDateFormat();
						this.H_View.firstdate = O_manage.makeTommorowDate(1);
						this.H_View.lastdate = O_manage.makeLimitLastDate(2);
						H_addtype = O_manage.getAddTypeHash();
						A_tmp = {
							name: "addtype",
							label: "\u767B\u9332\u65E5",
							inputtype: "radio",
							options: {
								id: "addtype"
							},
							data: H_addtype
						};
						A_formelement.push(A_tmp);
						A_tmp = {
							name: "adddate",
							label: "\u767B\u9332\u65E5",
							inputtype: "date",
							options: {
								id: "adddate"
							},
							data: this.H_View.H_reservedate
						};
						A_formelement.push(A_tmp);
					} else {
					A_tmp = {
						name: "addtype",
						label: "\u767B\u9332\u65E5",
						inputtype: "hidden",
						options: {
							id: "addtype"
						},
						data: "now"
					};
					A_formelement.push(A_tmp);
				}

				A_tmp = {
					name: "asscnt",
					inputtype: "hidden",
					options: {
						id: "asscnt"
					},
					data: "1"
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "reltelcnt",
					inputtype: "hidden",
					options: {
						id: "reltelcnt"
					},
					data: "1"
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "addsubmit",
					label: this.NextName,
					inputtype: "submit"
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "flag",
					data: "",
					inputtype: "hidden"
				};
				A_formelement.push(A_tmp);
			}

		this.H_View.O_AddFormUtil = new QuickFormUtil("form");
		this.H_View.O_AddFormUtil.setFormElement(A_formelement);
		this.O_AddForm = this.H_View.O_AddFormUtil.makeFormObject();
	}

	makeAddRule(O_manage, O_model, H_sess: {} | any[]) //基底クラスから新規登録フォームルール取得（電話）
	//端末フォームに印を付ける（新規だから1個、ループする必要は今のところ無いが今後を考慮してループしている）
	//FJP権限あり
	//表示言語分岐
	//ここで使用する自作関数の読込
	//表示言語分岐
	{
		var A_rule = this.getTelAddModFormRule(O_model);

		for (var acnt = 0; acnt < this.A_Assform.length; acnt++) //基底クラスから新規登録フォーム要素取得（端末）
		{
			var A_assetsformrule = this.getAssetsAddModFormRule();

			for (var cnt = 0; cnt < A_assetsformrule.length; cnt++) {
				{
					let _tmp_2 = A_assetsformrule[cnt];

					for (var key in _tmp_2) //name要素
					{
						var val = _tmp_2[key];

						if ("name" === key) {
							A_assetsformrule[cnt][key] = val + this.A_Assform[acnt];
						}
					}
				}
			}
		}

		if (-1 !== O_model.A_Auth.indexOf("fnc_fjp_co") == true) {
			A_rule = array_merge(A_rule, this.getFjpAddModFormRule());

			if (-1 !== O_model.A_Auth.indexOf("fnc_tel_division") && this.O_Sess.su == true) {
				A_rule = array_merge(A_rule, this.getDivisionAddModFormRule());
			}
		}

		A_rule = array_merge(A_rule, A_assetsformrule);

		if (this.O_Sess.language == "ENG") //予約権限あり
			{
				if (-1 !== O_model.A_Auth.indexOf("fnc_tel_reserve") == true) //予約日のルール
					//予約日のルール
					{
						var A_tmp = {
							name: ["addtype", "adddate"],
							mess: "Specify the full date, month, and year for the date of registration.  Non-existent dates are not allowed",
							type: "QRCheckReserveDateOnRadio",
							format: "reserve",
							validation: "client"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: ["addtype", "adddate"],
							mess: "Select a registration date between " + this.H_View.firstdate[3] + " and " + this.H_View.lastdate[3],
							type: "QRCheckLimitReserveDateOnRadio",
							format: ["reserve", this.H_View.firstdate, this.H_View.lastdate],
							validation: "client"
						};
						A_rule.push(A_tmp);
					}

				if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
					A_tmp = {
						name: ["kousiflg", "kousiptnaj"],
						mess: "Select the pattern for business and private classification",
						type: "QRCheckDefaultSel",
						format: 0,
						validation: "client"
					};
					A_rule.push(A_tmp);
				}

				if (undefined !== this.O_Set.pacts[this.O_Sess.pactid]) {
					var check_num = this.O_Set.pacts[this.O_Sess.pactid];

					if (ctype_digit(check_num) and check_num > 0) {
						A_tmp = {
							name: "employeecode",
							mess: "\u793E\u54E1\u756A\u53F7\u306F" + check_num + "\u6841\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
							type: "regex",
							format: "/^[\\d\\w-\\/+*=]*$/",
							validation: "client"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: "employeecode",
							mess: "\u793E\u54E1\u756A\u53F7\u306F" + check_num + "\u6841\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
							type: "rangelength",
							format: [check_num, check_num],
							validation: "client"
						};
						A_rule.push(A_tmp);
					}

					if (undefined !== this.O_Set.require_pacts[this.O_Sess.pactid] && true == this.O_Set.require_pacts[this.O_Sess.pactid]) {
						A_tmp = {
							name: "employeecode",
							mess: "\u793E\u54E1\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u4E0B\u3055\u3044",
							type: "required",
							format: undefined,
							validation: "client"
						};
						A_rule.push(A_tmp);
						this.get_Smarty().assign("employeecode_require", true);
					}
				}
			} else //予約権限あり
			{
				if (-1 !== O_model.A_Auth.indexOf("fnc_tel_reserve") == true) //予約日のルール
					//予約日のルール
					{
						A_tmp = {
							name: ["addtype", "adddate"],
							mess: "\u767B\u9332\u65E5\u306E\u5E74\u6708\u65E5\u306F\u3059\u3079\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306F\u6307\u5B9A\u3067\u304D\u307E\u305B\u3093",
							type: "QRCheckReserveDateOnRadio",
							format: "reserve",
							validation: "client"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: ["addtype", "adddate"],
							mess: "\u767B\u9332\u65E5\u306F" + this.H_View.firstdate[3] + "\u304B\u3089" + this.H_View.lastdate[3] + "\u306E\u7BC4\u56F2\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
							type: "QRCheckLimitReserveDateOnRadio",
							format: ["reserve", this.H_View.firstdate, this.H_View.lastdate],
							validation: "client"
						};
						A_rule.push(A_tmp);
					}

				if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
					A_tmp = {
						name: ["kousiflg", "kousiptnaj"],
						mess: "\u516C\u79C1\u5206\u8A08\u3059\u308B\u5834\u5408\u306F\u4F7F\u7528\u3059\u308B\u30D1\u30BF\u30FC\u30F3\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "QRCheckDefaultSel",
						format: 0,
						validation: "client"
					};
					A_rule.push(A_tmp);
				}

				if (undefined !== this.O_Set.pacts[this.O_Sess.pactid]) {
					check_num = this.O_Set.pacts[this.O_Sess.pactid];

					if (ctype_digit(check_num) and check_num > 0) {
						A_tmp = {
							name: "employeecode",
							mess: "\u793E\u54E1\u756A\u53F7\u306F" + check_num + "\u6841\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
							type: "regex",
							format: "/^[\\d\\w-\\/+*=]*$/",
							validation: "client"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: "employeecode",
							mess: "\u793E\u54E1\u756A\u53F7\u306F" + check_num + "\u6841\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
							type: "rangelength",
							format: [check_num, check_num],
							validation: "client"
						};
						A_rule.push(A_tmp);
					}

					if (undefined !== this.O_Set.require_pacts[this.O_Sess.pactid] && true == this.O_Set.require_pacts[this.O_Sess.pactid]) {
						A_tmp = {
							name: "employeecode",
							mess: "\u793E\u54E1\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u4E0B\u3055\u3044",
							type: "required",
							format: undefined,
							validation: "client"
						};
						A_rule.push(A_tmp);
						this.get_Smarty().assign("employeecode_require", true);
					}
				}
			}

		var A_orgrule = ["QRCheckDate", "QRCheckMonth", "QRCheckReserveDateOnRadio", "QRCheckLimitReserveDateOnRadio", "QRcheckDefaultSel", "QRIntNumeric", "QRalnumRegex"];
		this.H_View.O_AddFormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_AddFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_AddFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_AddFormUtil.makeFormRule(A_rule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) //配下フォームの表示・非表示
	//端末フォームのキー
	//関連項目の数
	//メッセージ
	//予約可能範囲
	//新規か？変更か？
	//予約に関するメッセージ
	//受領日について
	{
		this.get_Smarty().assign("showform", this.getShowForm(H_sess.SELF.post));
		this.get_Smarty().assign("A_assform", this.A_Assform);
		this.get_Smarty().assign("reltelcnt", this.H_View.reltelcnt);
		this.get_Smarty().assign("message", this.H_View.message);
		this.get_Smarty().assign("firstdate_view", this.H_View.firstdate[0]);
		this.get_Smarty().assign("lastdate_view", this.H_View.lastdate[3]);
		this.get_Smarty().assign("form_type", "add");
		this.get_Smarty().assign("res_mess", this.H_View.res_mess);
		this.get_Smarty().assign("receiptdate_flg", -1 !== A_auth.indexOf("fnc_receipt") ? true : false);
	}

	makePankuzuLinkHash() {
		if (this.O_Sess.language == "ENG") {
			var H_link = {
				"/Management/Tel/menu.php": "Admin informations",
				"": "Register new telephone"
			};
		} else {
			H_link = {
				"/Management/Tel/menu.php": "\u7BA1\u7406\u60C5\u5831",
				"": "\u96FB\u8A71\u65B0\u898F\u767B\u9332"
			};
		}

		return H_link;
	}

	getHeaderJS() //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var str = "<script language=\"Javascript\" src=\"/js/prototype.js\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/eng/Management/TelAjax.js\"></script>\n";
		} else {
			str = "<script language=\"Javascript\" src=\"/js/prototype.js\"></script>\n\n\t\t\t\t\t<script language=\"Javascript\" src=\"/js/Management/TelAjax.js\"></script>\n";
		}

		return str;
	}

	getShowForm(H_post: {} | any[]) {
		var str = "none";

		for (var key in H_post) {
			var val = H_post[key];

			if (key == "addsubmit") {
				str = "block";
				break;
			}
		}

		return str;
	}

	endAddView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();

		if (this.O_Sess.language == "ENG") //予約時
			{
				if (H_sess.SELF.post.addtype == "reserve") {
					O_finish.displayFinish("Reservation of new phone registration", "/Management/Tel/menu.php", "To list screen", "", "ENG");
				} else {
					O_finish.displayFinish("Register new telephone", "/Management/Tel/menu.php", "To list screen", "", "ENG");
				}
			} else //予約時
			{
				if (H_sess.SELF.post.addtype == "reserve") {
					O_finish.displayFinish("\u96FB\u8A71\u65B0\u898F\u767B\u9332\u4E88\u7D04", "/Management/Tel/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
				} else {
					O_finish.displayFinish("\u96FB\u8A71\u65B0\u898F\u767B\u9332", "/Management/Tel/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
				}
			}
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[]) {
		if (-1 !== A_auth.indexOf("fnc_fjp_co") == true && -1 !== A_auth.indexOf("fnc_tel_division") == true) {
			if (!this.O_Sess.su) {
				if (!Array.isArray(this.O_AddForm.getElement("division")._values)) {
					this.O_AddForm.getElement("division")._values = [""];
				}

				this.O_AddForm.getElement("division")._options[0].text = "";
				this.O_AddForm.freeze("division");
			}
		}

		super.displaySmarty(H_sess, A_auth);
	}

	__destruct() {
		super.__destruct();
	}

};