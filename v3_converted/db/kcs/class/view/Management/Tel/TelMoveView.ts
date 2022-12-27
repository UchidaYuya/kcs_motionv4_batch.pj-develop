//
//電話移動のView
//
//更新履歴：<br>
//2008/04/03 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/06/16
//@filesource
//@uses ManagementUtil
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//電話移動のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/06/16
//@uses ManagementMoveViewBase
//@uses ViewFinish
//

require("view/Management/ManagementMoveViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/06/16
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//各ページ用各権限チェック
//
//@author houshiyama
//@since 2008/06/16
//
//@access protected
//@return void
//
//
//電話移動固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/06/16
//
//@access protected
//@return void
//
//
//全て一覧移動固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/06/16
//
//@access protected
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/06/16
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/06/16
//
//@access public
//@return void
//
//
//移動フォームを作成する<br>
//
//@author houshiyama
//@since 2008/03/13
//
//@param mixed $O_manage
//@param mixed $O_model
//@param array $H_sess
//@access public
//@return void
//
//
//移動フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/03/13
//
//@param mixed $O_manage
//@param mixed $O_model
//@param array $H_sess
//@param array $A_data
//@access public
//@return void
//
//
//各ページ固有のdisplaySmarty
//
//@author houshiyama
//@since 2008/06/16
//
//@param mixed $H_sess
//@param mixed $A_auth
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
//@author houshiyama
//@since 2008/06/16
//
//@param mixed $O_manage
//@param mixed $H_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/06/16
//
//@access public
//@return void
//
class TelMoveView extends ManagementMoveViewBase {
	constructor() {
		super();
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_tel_manage_adm") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() //登録タイプがセッションに無ければ作る（デフォルトは今すぐ）
	{
		if (undefined !== this.H_Local.post == false) {
			this.H_Local.post.movemethod = "only";
			this.H_Local.post.movetype = "first";
			this.H_Local.post.movedate = date("Y-m-d", mktime(0, 0, 0, date("m"), 1, date("Y")));
		}
	}

	checkCGIParamPeculiar() //submitが実行された時
	{
		if (undefined !== _POST.movesubmit == true) {
			if ("first" == _POST.movetype) {
				this.H_Local.post.movedate = date("Y-m-01");
			}
		}
	}

	makePankuzuLinkHash() //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var H_link = {
				"/Management/Tel/menu.php": "Admin informations",
				"": "Phone shift"
			};
		} else {
			H_link = {
				"/Management/Tel/menu.php": "\u7BA1\u7406\u60C5\u5831",
				"": "\u96FB\u8A71\u79FB\u52D5"
			};
		}

		return H_link;
	}

	getHeaderJS() {}

	makeMoveForm(O_manage, O_model, H_sess: {} | any[]) //表示言語分岐
	//ユニーク文字列生成用
	//クイックフォームオブジェクト生成
	{
		if (this.O_Sess.language == "ENG") //日付型のフォーマット配列を生成、取込前
			//予約権限ありならば２月後まで
			//移動タイプ取得
			//按分権限あり
			//フォーム要素の配列作成
			//現在の移動のとき
			{
				if (this.A_Time[2] < this.O_Set.manage_clamp_date && this.YM == H_sess[TelMoveView.PUB].cym) {
					this.H_View.H_movedate = O_manage.getMoveDelDateFormatEng(1, 2);
					this.H_View.firstdate = O_manage.makeLimitFirstdate(1);
					this.H_View.billflg = false;
				} else {
					this.H_View.H_movedate = O_manage.getMoveDelDateFormatEng(0, 2);
					this.H_View.firstdate = O_manage.makeLimitFirstdate(0);
					this.H_View.billflg = true;
				}

				if (-1 !== this.getAllAuth().indexOf("fnc_tel_reserve") == true) {
					this.H_View.lastdate = O_manage.makeLimitLastdate(2);
				} else {
					this.H_View.lastdate = this.A_Time;
					this.H_View.lastdate[3] = this.A_Time[0] + "/" + this.A_Time[1] + "/" + this.A_Time[2];
				}

				var H_movetype = O_manage.getMoveTypeHashEng();

				if (-1 !== this.getAllAuth().indexOf("fnc_multi_anbun") == true) {
					H_movetype.first[0] = H_movetype.first[0] + "(mid-month apportionment is not applied)";
					H_movetype.shitei[0] = H_movetype.shitei[0] + "(mid-month apportionment is applied)";
				}

				var H_movemethod = O_manage.getMoveMethodHashEng();
				var A_formelement = [{
					name: "movesubmit",
					label: this.NextName,
					inputtype: "submit"
				}, {
					name: "cancel",
					label: "Cancel",
					inputtype: "button",
					options: {
						onClick: "javascript:ask_cancel()"
					}
				}, {
					name: "reset",
					label: "Reset",
					inputtype: "button",
					options: {
						onClick: "javascript:location.href='?r=1'"
					}
				}, {
					name: "back",
					label: "To entry screen",
					inputtype: "button",
					options: {
						onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
					}
				}, {
					name: "movemethod",
					label: "Shift method",
					inputtype: "radio",
					separator: "<br>",
					data: H_movemethod
				}, {
					name: "recogpostid",
					label: "",
					inputtype: "hidden"
				}, {
					name: "recogpostname",
					label: "",
					inputtype: "hidden"
				}];

				if (this.YM === H_sess[TelMoveView.PUB].cym) {
					var A_tmp = {
						name: "movedate",
						label: "Shift (reserve) date",
						inputtype: "date",
						data: this.H_View.H_movedate
					};
					A_formelement.push(A_tmp);
					A_tmp = {
						name: "movetype",
						label: "Date of shift",
						inputtype: "radio",
						separator: "<br>",
						data: H_movetype
					};
					A_formelement.push(A_tmp);
				}
			} else //日付型のフォーマット配列を生成、取込前
			//予約権限ありならば２月後まで
			//移動タイプ取得
			//按分権限あり
			//フォーム要素の配列作成
			//現在の移動のとき
			{
				if (this.A_Time[2] < this.O_Set.manage_clamp_date && this.YM == H_sess[TelMoveView.PUB].cym) {
					this.H_View.H_movedate = O_manage.getMoveDelDateFormat(1, 2);
					this.H_View.firstdate = O_manage.makeLimitFirstdate(1);
					this.H_View.billflg = false;
				} else {
					this.H_View.H_movedate = O_manage.getMoveDelDateFormat(0, 2);
					this.H_View.firstdate = O_manage.makeLimitFirstdate(0);
					this.H_View.billflg = true;
				}

				if (-1 !== this.getAllAuth().indexOf("fnc_tel_reserve") == true) {
					this.H_View.lastdate = O_manage.makeLimitLastdate(2);
				} else {
					this.H_View.lastdate = this.A_Time;
					this.H_View.lastdate[3] = this.A_Time[0] + "\u5E74" + this.A_Time[1] + "\u6708" + this.A_Time[2] + "\u65E5";
				}

				H_movetype = O_manage.getMoveTypeHash();

				if (-1 !== this.getAllAuth().indexOf("fnc_multi_anbun") == true) {
					H_movetype.first[0] = H_movetype.first[0] + "\uFF08\u6708\u4E2D\u6309\u5206\u3057\u306A\u3044\uFF09";
					H_movetype.shitei[0] = H_movetype.shitei[0] + "\uFF08\u6708\u4E2D\u6309\u5206\u3059\u308B\uFF09";
				}

				H_movemethod = O_manage.getMoveMethodHash();
				A_formelement = [{
					name: "movesubmit",
					label: this.NextName,
					inputtype: "submit"
				}, {
					name: "cancel",
					label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
					inputtype: "button",
					options: {
						onClick: "javascript:ask_cancel()"
					}
				}, {
					name: "reset",
					label: "\u30EA\u30BB\u30C3\u30C8",
					inputtype: "button",
					options: {
						onClick: "javascript:location.href='?r=1'"
					}
				}, {
					name: "back",
					label: "\u5165\u529B\u753B\u9762\u3078",
					inputtype: "button",
					options: {
						onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
					}
				}, {
					name: "movemethod",
					label: "\u79FB\u52D5\u5F62\u5F0F",
					inputtype: "radio",
					separator: "<br>",
					data: H_movemethod
				}, {
					name: "recogpostid",
					label: "",
					inputtype: "hidden"
				}, {
					name: "recogpostname",
					label: "",
					inputtype: "hidden"
				}];

				if (this.YM === H_sess[TelMoveView.PUB].cym) {
					A_tmp = {
						name: "movedate",
						label: "\u79FB\u52D5\uFF08\u4E88\u7D04\uFF09\u65E5",
						inputtype: "date",
						data: this.H_View.H_movedate
					};
					A_formelement.push(A_tmp);
					A_tmp = {
						name: "movetype",
						label: "\u79FB\u52D5\u65E5",
						inputtype: "radio",
						separator: "<br>",
						data: H_movetype
					};
					A_formelement.push(A_tmp);
				}
			}

		var O_unique = MtUniqueString.singleton();

		if (!(undefined !== H_sess.SELF.post.uniqueid)) {
			A_tmp = {
				name: "uniqueid",
				inputtype: "hidden",
				data: O_unique.getNewUniqueId(),
				options: {
					id: "uniqueid"
				}
			};
			A_formelement.push(A_tmp);
		} else {
			A_tmp = {
				name: "uniqueid",
				inputtype: "hidden",
				data: H_sess.SELF.post.uniqueid,
				options: {
					id: "uniqueid"
				}
			};
			A_formelement.push(A_tmp);
		}

		this.H_View.O_MoveFormUtil = new QuickFormUtil("form");
		this.H_View.O_MoveFormUtil.setFormElement(A_formelement);
		this.O_MoveForm = this.H_View.O_MoveFormUtil.makeFormObject();
	}

	makeMoveRule(O_manage, O_model, H_sess: {} | any[], A_data: {} | any[]) //表示言語分岐
	//現在の移動のとき
	//表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var A_rule = [{
				name: "recogpostid",
				mess: "Select department",
				type: "required",
				format: undefined,
				validation: "client"
			}];
		} else {
			A_rule = [{
				name: "recogpostid",
				mess: "\u90E8\u7F72\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
				type: "required",
				format: undefined,
				validation: "client"
			}];
		}

		if (this.YM === H_sess.cym) //削除予約があればそこがlimit
			//表示言語分岐
			{
				var A_lastdate = this.H_View.lastdate;
				this.H_View.lastdate_view = this.H_View.lastdate[3];
				var lastdate = this.H_View.lastdate[0] + this.H_View.lastdate[1] + this.H_View.lastdate[2];

				for (var cnt = 0; cnt < A_data.length; cnt++) {
					var A_tmp = A_data[cnt];

					if (undefined !== A_tmp.reserve == true && A_tmp.reserve.length > 0) //表示言語分岐
						{
							if (this.O_Sess.language == "ENG") {
								this.H_View.res_mess = "\u203B\n\tSome phones in the target has already been reserved.<br>If the date of deletion reservation has been registered, you cannot specify the date on or after the reserved deletion date.  Already reserved shift will be cleared after the operation is completed.\n";
							} else {
								this.H_View.res_mess = "\u203B\n\t\u5BFE\u8C61\u96FB\u8A71\u306E\u4E2D\u306B\u65E2\u306B\u4E88\u7D04\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u3082\u306E\u304C\u3042\u308A\u307E\u3059\u3002<br>\u524A\u9664\u4E88\u7D04\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u5834\u5408\u306F\u524A\u9664\u4E88\u7D04\u65E5\u4EE5\u964D\u306E\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u51FA\u6765\u307E\u305B\u3093\u3002\u65E2\u306B\u767B\u9332\u6E08\u307F\u306E\u79FB\u52D5\u4E88\u7D04\u306F\u64CD\u4F5C\u5B8C\u4E86\u6642\u306B\u4E88\u7D04\u89E3\u9664\u3055\u308C\u307E\u3059\u3002\n";
							}

							for (var rcnt = 0; rcnt < A_tmp.reserve.length; rcnt++) //削除予約があるか
							{
								if (A_tmp.reserve[rcnt].add_edit_flg == TelMoveView.DELMODE) //予約可能最終日を更新
									{
										var res_date = A_tmp.reserve[rcnt].reserve_date.replace(/-/g, "");

										if (res_date < lastdate) //表示言語分岐
											{
												lastdate = res_date;
												A_tmp = split("-", A_tmp.reserve[rcnt].reserve_date);
												var tmp_date = date("Y-m-d", mktime(0, 0, 0, A_tmp[1], A_tmp[2] - 1, A_tmp[0]));
												A_lastdate = split("-", tmp_date);

												if (this.O_Sess.language == "ENG") {
													this.H_View.lastdate_view = A_lastdate[0] + "-" + A_lastdate[1] + "-" + A_lastdate[2];
												} else {
													this.H_View.lastdate_view = A_lastdate[0] + "\u5E74" + A_lastdate[1] + "\u6708" + A_lastdate[2] + "\u65E5";
												}
											}
									}
							}
						}
				}

				if (this.O_Sess.language == "ENG") {
					A_tmp = {
						name: ["movetype", "movedate"],
						mess: "Specify the full date, month, and year for the date of shift.  Non-existent dates are not allowed.",
						type: "QRCheckReserveDateOnRadio",
						format: "shitei",
						validation: "client"
					};
					A_rule.push(A_tmp);
					A_tmp = {
						name: ["movetype", "movedate"],
						mess: "Select a date of shift between " + this.H_View.firstdate[3] + " and " + this.H_View.lastdate_view,
						type: "QRCheckLimitReserveDateOnRadio",
						format: ["shitei", this.H_View.firstdate, A_lastdate],
						validation: "client"
					};
					A_rule.push(A_tmp);
				} else {
					A_tmp = {
						name: ["movetype", "movedate"],
						mess: "\u79FB\u52D5\u65E5\u306E\u5E74\u6708\u65E5\u306F\u3059\u3079\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306F\u6307\u5B9A\u3067\u304D\u307E\u305B\u3093\u3002",
						type: "QRCheckReserveDateOnRadio",
						format: "shitei",
						validation: "client"
					};
					A_rule.push(A_tmp);
					A_tmp = {
						name: ["movetype", "movedate"],
						mess: "\u79FB\u52D5\u65E5\u306F" + this.H_View.firstdate[3] + "\u304B\u3089" + this.H_View.lastdate_view + "\u306E\u7BC4\u56F2\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "QRCheckLimitReserveDateOnRadio",
						format: ["shitei", this.H_View.firstdate, A_lastdate],
						validation: "client"
					};
					A_rule.push(A_tmp);
				}
			}

		var A_orgrule = ["QRCheckReserveDateOnRadio", "QRCheckLimitReserveDateOnRadio"];
		this.H_View.O_MoveFormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_MoveFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_MoveFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_MoveFormUtil.makeFormRule(A_rule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) //取込前、後フラグ
	//指定日可能範囲
	{
		this.get_Smarty().assign("billflg", this.H_View.billflg);
		this.get_Smarty().assign("firstdate_view", this.H_View.firstdate[3]);
		this.get_Smarty().assign("lastdate_view", this.H_View.lastdate_view);
		this.get_Smarty().assign("res_mess", this.H_View.res_mess);
	}

	endMoveView(O_manage, H_sess) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	//削除日（現在削除）
	//表示言語分岐
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		var today = this.Today.replace(/-/g, "");

		if (undefined !== H_sess.SELF.post.movedate === true) {
			var movedate = O_manage.convertDatetime(H_sess.SELF.post.movedate).replace(/-/g, "");
		} else {
			movedate = cym + "01";
		}

		if (this.O_Sess.language == "ENG") {
			if (undefined !== H_sess.SELF.post.movedate === true && today < movedate) {
				O_finish.displayFinish("Reservation of phone shift", "/Management/Tel/menu.php", "To list screen", "", "ENG");
			} else {
				O_finish.displayFinish("Phone shift", "/Management/Tel/menu.php", "To list screen", "", "ENG");
			}
		} else {
			if (undefined !== H_sess.SELF.post.movedate === true && today < movedate) {
				O_finish.displayFinish("\u96FB\u8A71\u79FB\u52D5\u4E88\u7D04", "/Management/Tel/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
			} else {
				O_finish.displayFinish("\u96FB\u8A71\u79FB\u52D5", "/Management/Tel/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
			}
		}
	}

	__destruct() {
		super.__destruct();
	}

};