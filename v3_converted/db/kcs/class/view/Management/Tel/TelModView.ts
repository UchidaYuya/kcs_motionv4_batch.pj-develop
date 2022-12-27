//
//電話変更のView
//
//更新履歴：<br>
//2008/05/14 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/05/14
//@uses ManagementModViewBase
//@uses QuickFormUtil
//@uses ManagementUtil
//@uses ViewError
//@uses ViewFinish
//@uses ExtensionTelModel
//
//
//error_reporting(E_ALL);
//
//電話変更のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/05/14
//@uses ManagementModViewBase
//@uses QuickFormUtil
//@uses ManagementUtil
//@uses ViewError
//@uses ViewFinish
//

require("view/Management/ManagementModViewBase.php");

require("model/ExtensionTelModel.php");

//
//端末登録フォーム要素につける印
//
//@var mixed
//@access protected
//
//
//予約一覧
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
//@since 2008/05/14
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//各ページ用各権限チェック
//
//@author houshiyama
//@since 2008/05/14
//
//@access protected
//@return void
//
//
//電話変更固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/05/14
//
//@access protected
//@return void
//
//
//電話変更固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/05/14
//
//@access protected
//@return void
//
//
//データの取得を兼ねたパラメータチェック <br>
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
//電話変更規登録フォームを作成する<br>
//
//基底クラスから新規登録フォーム要素取得（電話）
//基底クラスから新規登録フォーム要素取得（端末）
//フォーム要素の配列を作成<br>
//フォームのオブジェクト生成<br>
//
//@author houshiyama
//@since 2008/05/14
//
//@param object $O_manage
//@param object $O_model
//@param array $H_sess
//@access public
//@return void
//@uses O_ManagementUtil
//@uses QuickFormUtil
//
//
//電話変更フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/05/14
//
//@access public
//@return void
//
//
//キーカラムの変更が無ければfalse <br>
//キーカラムの変更があればtrue <br>
//キーカラムの変更があれば変更前のキーを保持（DBに書込むため） <br>
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//電話変更固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/05/14
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
//@since 2008/05/14
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/05/14
//
//@access public
//@return void
//
//
//エラー画面表示
//
//@author houshiyama
//@since 2008/05/14
//
//@access protected
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
//@since 2008/05/14
//
//@param array $H_sess
//@access protected
//@return void
//@uses ViewFinish
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
//@since 2008/05/14
//
//@access public
//@return void
//
class TelModView extends ManagementModViewBase {
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
		if (undefined !== this.H_Local.post.modsubmit == false && undefined !== this.H_Local.post.modtype == false) {
			this.H_Local.post.modtype = "now";
			this.H_Local.post.moddate = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d") + 1, date("Y")));
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

			for (var cnt = 0; cnt < this.H_Local.post.asscnt; cnt++) {
				if (undefined !== this.H_Local.post["ass_rel_check_" + cnt][1] == true && "" == this.H_Local.post["ass_rel_check_" + cnt][1]) {
					this.H_Local.post["ass_rel_check_" + cnt][1] = "1";
					_POST["ass_rel_check_" + cnt][1] = "1";
				}

				if (undefined !== this.H_Local.post["ass_rel_check_" + cnt][2] == true && "" == this.H_Local.post["ass_rel_check_" + cnt][2]) {
					this.H_Local.post["ass_rel_check_" + cnt][2] = "1";
					_POST["ass_rel_check_" + cnt][2] = "1";
				}
			}
		}

		if (undefined !== _POST.modsubmit == true) //チェックボックス要素
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
							} else {
								this.H_Local.post[ajkey] = val;
							}
						}
				}
			}
	}

	getInfoParamCheck(O_model, H_sess: {} | any[]) //端末情報取得実行時
	{
		if (undefined !== _POST.get_ass_info_flg === true && "2" === _POST.get_ass_info_flg) //エラーならば画面に表示
			{
				if (undefined !== _POST.asscnt == false) {
					var num = "0";
				} else {
					num = _POST.asscnt - 1;
				}

				var key = "assetsno_" + num;
				O_model.setTableName(H_sess[TelModView.PUB].cym);
				var H_res = O_model.getAssetsInfoByAssetsNo(_POST[key]);

				if (H_res == false) //表示言語分岐
					//フラグを戻す
					{
						if (this.O_Sess.language == "ENG") {
							this.H_View.O_ModFormUtil.setElementErrorWrapper(key, "We could not find handset information");
						} else {
							this.H_View.O_ModFormUtil.setElementErrorWrapper(key, "\u7AEF\u672B\u60C5\u5831\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F");
						}

						this.H_View.O_ModFormUtil.O_Form._submitValues.get_ass_info_flg = "";
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

		if (undefined !== _POST.relform_cnt == true && _POST.relform_cnt != "") //更新失敗
			{
				O_model.setTableName(H_sess[TelModView.PUB].cym);
				var del_telno = _POST["rel_telno_" + _POST.relform_cnt];
				var del_carid = _POST["rel_carid_" + _POST.relform_cnt];
				var res = O_model.deleteTelRelTelProc(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, del_telno, del_carid);

				if (res < 1) //エラー画面表示
					//表示言語分岐
					{
						var O_err = new ViewError();

						if (this.O_Sess.language == "ENG") {
							O_err.display("Processing of related phone failed", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						} else {
							O_err.display("\u95A2\u9023\u96FB\u8A71\u306E\u51E6\u7406\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						}

						throw die();
					} else {
					MtExceptReload.raise(undefined);
				}
			}

		if (undefined !== _POST.extensionno_submit == true && _POST.extensionno_submit == "1") //ポストの値を保持
			//フラグを戻す
			{
				this.H_Local.post = _POST;
				this.H_View.O_ModFormUtil.O_Form._submitValues.extensionno_submit = "";
				this.H_Local.post.extensionno_submit = "";
				var O_extention = new ExtensionTelModel();

				if (!(this.H_Local.post.extensionno = O_extention.getExtensionNo(this.O_Sess.pactid, this.H_Local.post.carid))) //表示言語分岐
					{
						if (this.O_Sess.language == "ENG") {
							this.H_View.O_ModFormUtil.setElementErrorWrapper("extensionno", "We could not find extensionno");
						} else {
							this.H_View.O_ModFormUtil.setElementErrorWrapper("extensionno", "\u4F7F\u7528\u3067\u304D\u308B\u5185\u7DDA\u96FB\u8A71\u304C\u3042\u308A\u307E\u305B\u3093");
						}
					} else //セッションに入れ
					//リロード
					{
						this.O_Sess.setSelfAll(this.H_Local);
						MtExceptReload.raise(undefined);
					}
			}

		if (this.A_Reserve.length > 0) //表示言語分岐
			{
				var A_str = Array();

				if (this.O_Sess.language == "ENG") {
					for (var rcnt = 0; rcnt < this.A_Reserve.length; rcnt++) //予約アラート
					{
						var A_date = split("-", this.A_Reserve[rcnt].reserve_date);
						var date_view = A_date[0] + "-" + A_date[1] + "-" + A_date[2];
						A_str.push(date_view + "[" + this.convertReserveTypeEng(this.A_Reserve[rcnt].add_edit_flg) + "]");
					}

					this.H_View.res_mess = "\u203B\n\t\t\t\tReservation already registered. \uFF08" + A_str.join("\u3001") + "\uFF09 Duplicate date of reservation can not be added.";
				} else {
					for (rcnt = 0;; rcnt < this.A_Reserve.length; rcnt++) //予約アラート
					{
						A_date = split("-", this.A_Reserve[rcnt].reserve_date);
						date_view = A_date[0] + "\u5E74" + A_date[1] + "\u6708" + A_date[2] + "\u6708";
						A_str.push(date_view + "\u3010" + this.convertReserveType(this.A_Reserve[rcnt].add_edit_flg) + "\u3011");
					}

					this.H_View.res_mess = "\u203B\n\t\t\t\t\u65E2\u306B\u767B\u9332\u6E08\u307F\u306E\u4E88\u7D04\u304C\u3042\u308A\u307E\u3059\uFF08" + A_str.join("\u3001") + "\uFF09\u3002\u4E88\u7D04\u65E5\u304C\u91CD\u8907\u3059\u308B\u5834\u5408\u306F\u65B0\u305F\u306B\u4E88\u7D04\u3067\u304D\u307E\u305B\u3093\u3002";
				}
			}
	}

	makeModForm(O_manage, O_model, H_sess: {} | any[]) //端末フォームに付ける印配列生成
	//基底クラスから変更フォーム要素取得（電話）
	//必要な数の端末フォーム数ループ
	//Fjp権限あり
	//クイックフォームオブジェクト生成
	{
		this.A_Assform = Array();

		for (var fcnt = 0; fcnt < H_sess.SELF.post.asscnt; fcnt++) {
			this.A_Assform.push("_" + strval(fcnt));
		}

		var A_formelement = this.getTelAddModFormElement(O_manage, O_model, H_sess);

		for (var acnt = 0; acnt < this.A_Assform.length; acnt++) //基底クラスから新規登録フォーム要素取得（端末）
		//端末フォームに印を付ける
		{
			H_sess.SELF.post.searchcarid = H_sess.SELF.post["searchcarid_" + acnt];
			H_sess.SELF.post.searchcirid = H_sess.SELF.post["searchcirid_" + acnt];
			H_sess.SELF.post.seriesid = H_sess.SELF.post["seriesid_" + acnt];
			var A_product = split(":", H_sess.SELF.post["productid_" + acnt]);
			H_sess.SELF.post.productid = A_product[0];
			var A_assetsformelement = this.getAssetsAddModFormElement(O_manage, O_model, H_sess, "tel", "mod");

			for (var cnt = 0; cnt < A_assetsformelement.length; cnt++) {
				{
					let _tmp_1 = A_assetsformelement[cnt];

					for (var key in _tmp_1) {
						var val = _tmp_1[key];

						if ("name" == key) {
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

			A_formelement = array_merge(A_formelement, A_assetsformelement);
		}

		if (-1 !== O_model.A_Auth.indexOf("fnc_fjp_co") == true) {
			A_formelement = array_merge(A_formelement, this.getFjpAddModFormElement());

			if (-1 !== O_model.A_Auth.indexOf("fnc_tel_division")) {
				A_formelement = array_merge(A_formelement, this.getDivisionAddModFormElement());
			}
		}

		if (this.O_Sess.language == "ENG") //端末数
			//実行ボタン
			//現在の変更のとき
			{
				if (this.YM == H_sess[TelModView.PUB].cym && -1 !== O_model.A_Auth.indexOf("fnc_tel_reserve") == true) //予約用の日付フォーマット取得
					//削除予約があればそこがリミット
					//2015-08-13 不具合対応
					//予約用の日付フォーマット取得
					{
						this.H_View.H_reservedate = O_manage.getReserveDateFormatEng();
						this.H_View.firstdate = O_manage.makeTommorowdate(1);
						this.H_View.lastdate = O_manage.makeLimitLastdate(2);
						this.A_Reserve = O_model.getTelReserveList(O_model.O_Manage.convertNoView(H_sess.SELF.get.manageno), H_sess.SELF.get.coid);

						if (this.A_Reserve.length > 0) {
							for (var rcnt = 0; rcnt < this.A_Reserve.length; rcnt++) {
								if (TelModView.DELMODE == this.A_Reserve[rcnt].add_edit_flg) {
									var A_rdate = split("-", this.A_Reserve[rcnt].reserve_date);
									this.H_View.lastdate[3] = date("Y-m-d", mktime(0, 0, 0, A_rdate[1], A_rdate[2] - 1, A_rdate[0]));
								}
							}
						}

						var H_modtype = O_manage.getModTypeHashEng();

						if (O_model.checkShopReceivingOrder(H_sess.SELF.post.telno, H_sess.SELF.post.carid)) {
							delete H_modtype.now[1];
							this.get_Smarty().assign("shopReceivingOrder", true);
							H_modtype.reserve[1] = "disabled";
						}

						var A_tmp = {
							name: "modtype",
							label: "Date of phone change",
							inputtype: "radio",
							options: {
								id: "modtype"
							},
							data: H_modtype
						};
						A_formelement.push(A_tmp);
						A_tmp = {
							name: "moddate",
							label: "Date of phone change",
							inputtype: "date",
							options: {
								id: "moddate"
							},
							data: this.H_View.H_reservedate
						};
						A_formelement.push(A_tmp);
					} else {
					A_tmp = {
						name: "modtype",
						label: "Date of phone change",
						inputtype: "hidden",
						options: {
							id: "modtype"
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
					data: ""
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "modsubmit",
					label: this.NextName,
					inputtype: "submit"
				};
				A_formelement.push(A_tmp);

				if (this.YM === H_sess[TelModView.PUB].cym) {
					A_tmp = {
						name: "pastflg",
						label: "Check to update last month's data as well.",
						inputtype: "checkbox",
						options: "1"
					};
					A_formelement.push(A_tmp);
				}
			} else //端末数
			//実行ボタン
			//現在の変更のとき
			{
				if (this.YM == H_sess[TelModView.PUB].cym && -1 !== O_model.A_Auth.indexOf("fnc_tel_reserve") == true) //予約用の日付フォーマット取得
					//削除予約があればそこがリミット
					//2015-08-13 不具合対応
					//予約用の日付フォーマット取得
					{
						this.H_View.H_reservedate = O_manage.getReserveDateFormat();
						this.H_View.firstdate = O_manage.makeTommorowDate(1);
						this.H_View.lastdate = O_manage.makeLimitLastDate(2);
						this.A_Reserve = O_model.getTelReserveList(O_model.O_Manage.convertNoView(H_sess.SELF.get.manageno), H_sess.SELF.get.coid);

						if (this.A_Reserve.length > 0) {
							for (rcnt = 0;; rcnt < this.A_Reserve.length; rcnt++) {
								if (TelModView.DELMODE == this.A_Reserve[rcnt].add_edit_flg) {
									A_rdate = split("-", this.A_Reserve[rcnt].reserve_date);
									this.H_View.lastdate[3] = date("Y-m-d", mktime(0, 0, 0, A_rdate[1], A_rdate[2] - 1, A_rdate[0]));
								}
							}
						}

						H_modtype = O_manage.getModTypeHash();

						if (O_model.checkShopReceivingOrder(H_sess.SELF.post.telno, H_sess.SELF.post.carid)) {
							delete H_modtype.now[1];
							this.get_Smarty().assign("shopReceivingOrder", true);
							H_modtype.reserve[1] = "disabled";
						}

						A_tmp = {
							name: "modtype",
							label: "\u96FB\u8A71\u5909\u66F4\u65E5",
							inputtype: "radio",
							options: {
								id: "modtype"
							},
							data: H_modtype
						};
						A_formelement.push(A_tmp);
						A_tmp = {
							name: "moddate",
							label: "\u96FB\u8A71\u5909\u66F4\u65E5",
							inputtype: "date",
							options: {
								id: "moddate"
							},
							data: this.H_View.H_reservedate
						};
						A_formelement.push(A_tmp);
					} else {
					A_tmp = {
						name: "modtype",
						label: "\u96FB\u8A71\u5909\u66F4\u65E5",
						inputtype: "hidden",
						options: {
							id: "modtype"
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
					data: ""
				};
				A_formelement.push(A_tmp);
				A_tmp = {
					name: "modsubmit",
					label: this.NextName,
					inputtype: "submit"
				};
				A_formelement.push(A_tmp);

				if (this.YM === H_sess[TelModView.PUB].cym) {
					A_tmp = {
						name: "pastflg",
						label: "\u524D\u6708\u5206\u3082\u5909\u66F4\u3059\u308B\u5834\u5408\u306F\u30C1\u30A7\u30C3\u30AF\u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044",
						inputtype: "checkbox",
						options: "1"
					};
					A_formelement.push(A_tmp);
				}
			}

		this.H_View.O_ModFormUtil = new QuickFormUtil("form");
		this.H_View.O_ModFormUtil.setFormElement(A_formelement);
		this.O_ModForm = this.H_View.O_ModFormUtil.makeFormObject();
	}

	makeModRule(O_manage, O_model, H_sess: {} | any[]) //基底クラスから新規登録フォームルール取得
	//必要な数の端末フォーム数ループ
	//FJP権限あり
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

			A_rule = array_merge(A_rule, A_assetsformrule);
		}

		if (-1 !== O_model.A_Auth.indexOf("fnc_fjp_co") == true) {
			A_rule = array_merge(A_rule, this.getFjpAddModFormRule());

			if (-1 !== O_model.A_Auth.indexOf("fnc_tel_division") && this.O_Sess.su == true) {
				A_rule = array_merge(A_rule, this.getDivisionAddModFormRule());
			}
		}

		if (this.O_Sess.language == "ENG") //予約権限あり
			{
				if (-1 !== O_model.A_Auth.indexOf("fnc_tel_reserve") == true) //予約日のルール
					//予約日のルール
					{
						var A_tmp = {
							name: ["modtype", "moddate"],
							mess: "Specify the full date, month, and year for the date of change.  Non-existent dates are not allowed",
							type: "QRCheckReserveDateOnRadio",
							format: "reserve",
							validation: "client"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: ["modtype", "moddate"],
							mess: "Select a registration date between " + this.H_View.firstdate[3] + " and " + this.H_View.lastdate[3],
							type: "QRCheckLimitReserveDateOnRadio",
							format: ["reserve", this.H_View.firstdate, this.H_View.lastdate],
							validation: "client"
						};
						A_rule.push(A_tmp);
					}

				if (-1 !== O_model.A_Auth.indexOf("fnc_assets_manage_adm_co") == true && -1 !== O_model.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) {
					A_tmp = {
						name: ["main_flg_0", "main_flg_0"],
						mess: "Select your current handset",
						type: "QRCheckMainFlgRadio",
						format: H_sess.SELF.post.asscnt,
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
							name: ["modtype", "moddate"],
							mess: "\u5909\u66F4\u65E5\u306E\u5E74\u6708\u65E5\u306F\u3059\u3079\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306F\u6307\u5B9A\u3067\u304D\u307E\u305B\u3093",
							type: "QRCheckReserveDateOnRadio",
							format: "reserve",
							validation: "client"
						};
						A_rule.push(A_tmp);
						A_tmp = {
							name: ["modtype", "moddate"],
							mess: "\u5909\u66F4\u65E5\u306F" + this.H_View.firstdate[3] + "\u304B\u3089" + this.H_View.lastdate[3] + "\u306E\u7BC4\u56F2\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
							type: "QRCheckLimitReserveDateOnRadio",
							format: ["reserve", this.H_View.firstdate, this.H_View.lastdate],
							validation: "client"
						};
						A_rule.push(A_tmp);
					}

				if (-1 !== O_model.A_Auth.indexOf("fnc_assets_manage_adm_co") == true && -1 !== O_model.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) {
					A_tmp = {
						name: ["main_flg_0", "main_flg_0"],
						mess: "\u4F7F\u7528\u4E2D\u7AEF\u672B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "QRCheckMainFlgRadio",
						format: H_sess.SELF.post.asscnt,
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
							type: "rangelength",
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

		var A_orgrule = ["QRCheckDate", "QRCheckMonth", "QRCheckReserveDateOnRadio", "QRCheckLimitReserveDateOnRadio", "QRCheckMainFlgRadio", "QRCheckDefaultSel", "QRIntNumeric", "QRalnumRegex"];
		this.H_View.O_ModFormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_ModFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_ModFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_ModFormUtil.makeFormRule(A_rule);
	}

	checkModKeyCol(H_sess, O_manage) //キーカラムの変更無し
	{
		if (O_manage.convertNoView(H_sess.post.telno_view) == H_sess.get.manageno && H_sess.post.carid == H_sess.get.coid) {
			H_sess.post.pre_telno_view = "";
			H_sess.post.pre_carid = "";
			return false;
		} else //予約の時はメッセージ表記
			{
				H_sess.post.pre_telno_view = H_sess.get.manageno;
				H_sess.post.pre_carid = H_sess.get.coid;

				if ("reserve" == H_sess.post.modtype) //表示言語分岐
					//$this->H_View["chgkey_res_mess"] = "電話番号、又は電話会社が変更されているので予約日に削除、新規で予約が実行されます。予約一覧をご確認ください。";
					{
						if (this.O_Sess.language == "ENG") {
							if (H_sess.post.telno_view != H_sess.get.manageno) {
								this.H_View.O_ModFormUtil.setElementErrorWrapper("telno_view", "Phone number cannot be changed when making a reservation.");
							}

							if (H_sess.post.carid != H_sess.get.coid) {
								this.H_View.O_ModFormUtil.setElementErrorWrapper("carid", "Telephone carrier cannot be changed when making a reservation.");
							}
						} else {
							if (H_sess.post.telno_view != H_sess.get.manageno) {
								this.H_View.O_ModFormUtil.setElementErrorWrapper("telno_view", "\u4E88\u7D04\u767B\u9332\u306E\u6642\u306F\u96FB\u8A71\u756A\u53F7\u306E\u5909\u66F4\u306F\u3067\u304D\u307E\u305B\u3093");
							}

							if (H_sess.post.carid != H_sess.get.coid) {
								this.H_View.O_ModFormUtil.setElementErrorWrapper("carid", "\u4E88\u7D04\u767B\u9332\u306E\u6642\u306F\u96FB\u8A71\u4F1A\u793E\u306E\u5909\u66F4\u306F\u3067\u304D\u307E\u305B\u3093");
							}
						}
					}

				return true;
			}
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) //配下フォームの表示・非表示
	//端末フォームのキー
	//関連項目の数
	//予約可能範囲
	//新規か？変更か？
	//関連電話
	//予約に関するメッセージ
	//予約に関するメッセージ
	//受領日について
	{
		this.get_Smarty().assign("showform", this.getShowForm(H_sess.SELF.post));
		this.get_Smarty().assign("A_assform", this.A_Assform);
		this.get_Smarty().assign("reltelcnt", this.H_View.reltelcnt);
		this.get_Smarty().assign("firstdate_view", this.H_View.firstdate[3]);
		this.get_Smarty().assign("lastdate_view", this.H_View.lastdate[3]);
		this.get_Smarty().assign("form_type", "mod");
		this.get_Smarty().assign("A_reltel", H_sess.SELF.rel_tel);
		this.get_Smarty().assign("res_mess", this.H_View.res_mess);
		this.get_Smarty().assign("chgkey_res_mess", this.H_View.chgkey_res_mess);
		this.get_Smarty().assign("H_post", H_sess.SELF.post);
		this.get_Smarty().assign("receiptdate_flg", -1 !== A_auth.indexOf("fnc_receipt") ? true : false);
	}

	makePankuzuLinkHash() {
		if (this.O_Sess.language == "ENG") {
			var H_link = {
				"/Management/Tel/menu.php": "Admin informations",
				"": "Change phone"
			};
		} else {
			H_link = {
				"/Management/Tel/menu.php": "\u7BA1\u7406\u60C5\u5831",
				"": "\u96FB\u8A71\u5909\u66F4"
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

	viewChgKeyError() //エラー画面表示
	{
		var O_err = new ViewError();

		if (this.O_Sess.language == "ENG") {
			O_err.display("Phone number and carrier of the billed phone can not be changed", 0, _SERVER.PHP_SELF, "Back");
		} else {
			O_err.display("\u8ACB\u6C42\u304C\u3042\u308B\u96FB\u8A71\u306E\u96FB\u8A71\u756A\u53F7\u3001\u96FB\u8A71\u4F1A\u793E\u306F\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002", 0, _SERVER.PHP_SELF, "\u623B\u308B");
		}
	}

	getShowForm(H_post: {} | any[]) {
		var str = "block";

		for (var key in H_post) {
			var val = H_post[key];

			if (key == "modsubmit") {
				str = "block";
				break;
			}
		}

		return str;
	}

	endModView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	//予約時
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();

		if (this.O_Sess.language == "ENG") {
			if (H_sess.SELF.post.modtype == "reserve") {
				O_finish.displayFinish("Reservation of phone change", "/Management/Tel/menu.php", "To list screen", "", "ENG");
			} else {
				O_finish.displayFinish("Change phone", "/Management/Tel/menu.php", "To list screen", "", "ENG");
			}
		} else {
			if (H_sess.SELF.post.modtype == "reserve") {
				O_finish.displayFinish("\u96FB\u8A71\u5909\u66F4\u4E88\u7D04", "/Management/Tel/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
			} else {
				O_finish.displayFinish("\u96FB\u8A71\u5909\u66F4", "/Management/Tel/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
			}
		}
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[]) {
		if (-1 !== A_auth.indexOf("fnc_fjp_co") == true && -1 !== A_auth.indexOf("fnc_tel_division") == true) {
			if (!this.O_Sess.su) {
				if (!Array.isArray(this.O_ModForm.getElement("division")._values)) {
					this.O_ModForm.getElement("division")._values = [""];
				}

				this.O_ModForm.getElement("division")._options[0].text = "";
				this.O_ModForm.freeze("division");
			}
		}

		super.displaySmarty(H_sess, A_auth);
	}

	__destruct() {
		super.__destruct();
	}

};