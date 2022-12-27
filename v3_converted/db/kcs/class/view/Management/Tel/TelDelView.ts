//
//電話削除用のView
//
//更新履歴：<br>
//2008/06/18 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/06/18
//@filesource
//@uses ManagementDelViewBase
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//電話削除用のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/06/18
//@uses ManagementDelViewBase
//@uses ViewFinish
//

require("view/Management/ManagementDelViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/06/18
//
//@access public
//@return void
//
//
//各ページ用各権限チェック
//
//@author houshiyama
//@since 2008/06/18
//
//@access protected
//@return void
//
//
//全て一覧移動固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/06/18
//
//@access protected
//@return void
//
//
//電話移動固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/06/18
//
//@access protected
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/06/18
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/06/18
//
//@access public
//@return void
//
//
//削除フォームを作成する<br>
//
//@author houshiyama
//@since 2008/08/07
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
//@since 2008/06/18
//
//@param mixed $H_sess
//@param mixed $A_auth
//@access public
//@return void
//
//
//エラー画面表示
//
//@author houshiyama
//@since 2008/04/02
//
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
//@since 2008/09/04
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//freeze処理をする <br>
//
//ボタン名の変更 <br>
//エラーチェックを外す <br>
//freezeする <br>
//
//@author houshiyama
//@since 2008/08/07
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
//@since 2008/08/07
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/06/18
//
//@access public
//@return void
//
class TelDelView extends ManagementDelViewBase {
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
			this.H_Local.post.delmethod = "only";
			this.H_Local.post.deldate = this.Today;
		}
	}

	checkCGIParamPeculiar() {}

	makePankuzuLinkHash() {
		if (this.O_Sess.language == "ENG") {
			var H_link = {
				"/Management/Tel/menu.php": "Admin informations",
				"": "Phone deletion"
			};
		} else {
			H_link = {
				"/Management/Tel/menu.php": "\u7BA1\u7406\u60C5\u5831",
				"": "\u96FB\u8A71\u524A\u9664"
			};
		}

		return H_link;
	}

	getHeaderJS() {}

	makeDelForm(O_manage, O_model, H_sess: {} | any[]) //表示言語分岐
	//ユニーク文字列生成用
	//クイックフォームオブジェクト生成
	{
		if (this.O_Sess.language == "ENG") //日付型のフォーマット配列を生成、取込前
			//予約権限ありならば２月後まで
			//フォーム要素の配列作成
			//削除タイプ取得
			//現在の削除のとき
			{
				if (this.A_Time[2] < this.O_Set.manage_clamp_date && this.YM == H_sess[TelDelView.PUB].cym) {
					this.H_View.H_deldate = O_manage.getMoveDelDateFormatEng(1, 2);
					this.H_View.firstdate = O_manage.makeLimitFirstdate(1);
					this.H_View.billflg = false;
				} else {
					this.H_View.H_deldate = O_manage.getMoveDelDateFormatEng(0, 2);
					this.H_View.firstdate = O_manage.makeLimitFirstdate(0);
					this.H_View.billflg = true;
				}

				if (-1 !== this.getAllAuth().indexOf("fnc_tel_reserve") == true) {
					this.H_View.lastdate = O_manage.makeLimitLastdate(2);
				} else {
					this.H_View.lastdate = this.A_Time;
					this.H_View.lastdate[3] = this.A_Time[0] + "/" + this.A_Time[1] + "/" + this.A_Time[2];
				}

				var A_formelement = [{
					name: "delsubmit",
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
					name: "recogpostid",
					label: "",
					inputtype: "hidden"
				}, {
					name: "recogpostname",
					label: "",
					inputtype: "hidden"
				}];

				if (-1 !== O_model.A_Auth.indexOf("fnc_assets_manage_adm_co") == true) {
					var A_tmp = {
						name: "delmethod",
						label: "Deletion method",
						inputtype: "radio",
						separator: "<br>",
						data: O_manage.getDelMethodHashEng()
					};
					A_formelement.push(A_tmp);
				} else {
					A_tmp = {
						name: "delmethod",
						label: "",
						inputtype: "hidden",
						data: "all"
					};
					A_formelement.push(A_tmp);
				}

				if (this.YM === H_sess[TelDelView.PUB].cym) {
					A_tmp = {
						name: "deldate",
						label: "Date of deletion (reservation)",
						inputtype: "date",
						data: this.H_View.H_deldate
					};
					A_formelement.push(A_tmp);
				}
			} else //日付型のフォーマット配列を生成、取込前
			//予約権限ありならば２月後まで
			//フォーム要素の配列作成
			//削除タイプ取得
			//現在の削除のとき
			{
				if (this.A_Time[2] < this.O_Set.manage_clamp_date && this.YM == H_sess[TelDelView.PUB].cym) {
					this.H_View.H_deldate = O_manage.getMoveDelDateFormat(1, 2);
					this.H_View.firstdate = O_manage.makeLimitFirstdate(1);
					this.H_View.billflg = false;
				} else {
					this.H_View.H_deldate = O_manage.getMoveDelDateFormat(0, 2);
					this.H_View.firstdate = O_manage.makeLimitFirstdate(0);
					this.H_View.billflg = true;
				}

				if (-1 !== this.getAllAuth().indexOf("fnc_tel_reserve") == true) {
					this.H_View.lastdate = O_manage.makeLimitLastdate(2);
				} else {
					this.H_View.lastdate = this.A_Time;
					this.H_View.lastdate[3] = this.A_Time[0] + "\u5E74" + this.A_Time[1] + "\u6708" + this.A_Time[2] + "\u65E5";
				}

				A_formelement = [{
					name: "delsubmit",
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
					name: "recogpostid",
					label: "",
					inputtype: "hidden"
				}, {
					name: "recogpostname",
					label: "",
					inputtype: "hidden"
				}];

				if (-1 !== O_model.A_Auth.indexOf("fnc_assets_manage_adm_co") == true) {
					A_tmp = {
						name: "delmethod",
						label: "\u524A\u9664\u5F62\u5F0F",
						inputtype: "radio",
						separator: "<br>",
						data: O_manage.getDelMethodHash()
					};
					A_formelement.push(A_tmp);
				} else {
					A_tmp = {
						name: "delmethod",
						label: "",
						inputtype: "hidden",
						data: "all"
					};
					A_formelement.push(A_tmp);
				}

				if (this.YM === H_sess[TelDelView.PUB].cym) {
					A_tmp = {
						name: "deldate",
						label: "\u524A\u9664\uFF08\u4E88\u7D04\uFF09\u65E5",
						inputtype: "date",
						data: this.H_View.H_deldate
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

		this.H_View.O_DelFormUtil = new QuickFormUtil("form");
		this.H_View.O_DelFormUtil.setFormElement(A_formelement);
		this.O_DelForm = this.H_View.O_DelFormUtil.makeFormObject();
	}

	makeDelRule(O_manage, O_model, H_sess: {} | any[], A_data: {} | any[]) //現在の移動のとき
	//表示言語分岐
	{
		var A_rule = Array();

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
								this.H_View.res_mess = "\u203B\nSome telephones in the target have already been reserved.<br>Any reservation after the date of deletion (reservation) will be cleared when deletion (reservation) is completed.<br>Already registered deletion reservation will be cleared when deletion is completed.\n";
							} else {
								this.H_View.res_mess = "\u203B\n\t\u5BFE\u8C61\u96FB\u8A71\u306E\u4E2D\u306B\u65E2\u306B\u4E88\u7D04\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u3082\u306E\u304C\u3042\u308A\u307E\u3059\u3002<br>\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u4E88\u7D04\u3067\u524A\u9664\uFF08\u4E88\u7D04\uFF09\u65E5\u4EE5\u964D\u306E\u3082\u306E\u306F\u3001\u524A\u9664\uFF08\u4E88\u7D04\uFF09\u64CD\u4F5C\u5B8C\u4E86\u6642\u306B\u4E88\u7D04\u89E3\u9664\u3055\u308C\u307E\u3059\u3002\u65E2\u306B\u767B\u9332\u6E08\u307F\u306E\u524A\u9664\u4E88\u7D04\u306F\u64CD\u4F5C\u5B8C\u4E86\u6642\u306B\u4E88\u7D04\u89E3\u9664\u3055\u308C\u307E\u3059\u3002\n";
							}
						}
				}

				if (this.O_Sess.language == "ENG") {
					A_tmp = {
						name: "deldate",
						mess: "Specify the full date, month, and year for the date of deletion.  Non-existent dates are not allowed",
						type: "QRCheckDate",
						format: "shitei",
						validation: "client"
					};
					A_rule.push(A_tmp);
					A_tmp = {
						name: "deldate",
						mess: "Select a date of deletion between " + this.H_View.firstdate[3] + " and " + this.H_View.lastdate[3],
						type: "QRCheckLimitReserveDate",
						format: [this.H_View.firstdate, this.H_View.lastdate],
						validation: "client"
					};
					A_rule.push(A_tmp);
				} else {
					A_tmp = {
						name: "deldate",
						mess: "\u524A\u9664\u65E5\u306E\u5E74\u6708\u65E5\u306F\u5168\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306F\u6307\u5B9A\u3067\u304D\u307E\u305B\u3093\u3002",
						type: "QRCheckDate",
						format: "shitei",
						validation: "client"
					};
					A_rule.push(A_tmp);
					A_tmp = {
						name: "deldate",
						mess: "\u524A\u9664\u65E5\u306F" + this.H_View.firstdate[3] + "\u304B\u3089" + this.H_View.lastdate[3] + "\u306E\u7BC4\u56F2\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "QRCheckLimitReserveDate",
						format: [this.H_View.firstdate, this.H_View.lastdate],
						validation: "client"
					};
					A_rule.push(A_tmp);
				}
			}

		var A_orgrule = ["QRCheckDate", "QRCheckLimitReserveDate"];
		this.H_View.O_DelFormUtil.registerOriginalRules(A_orgrule);

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_DelFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_DelFormUtil.setDefaultWarningNote();
		}

		this.H_View.O_DelFormUtil.makeFormRule(A_rule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) //取込前、後フラグ
	//指定日可能範囲
	{
		this.get_Smarty().assign("billflg", this.H_View.billflg);
		this.get_Smarty().assign("firstdate_view", this.H_View.firstdate[3]);
		this.get_Smarty().assign("lastdate_view", this.H_View.lastdate[3]);
		this.get_Smarty().assign("res_mess", this.H_View.res_mess);
	}

	viewCanNotError() //エラー画面表示
	//表示言語分岐
	{
		var O_err = new ViewError();

		if (this.O_Sess.language == "ENG") {
			O_err.display("Unable to delete a billed telephone", 0, "./menu.php", "Back");
		} else {
			O_err.display("\u8ACB\u6C42\u304C\u3042\u308B\u96FB\u8A71\u306E\u524A\u9664\u306F\u3067\u304D\u307E\u305B\u3093\u3002", 0, "./menu.php", "\u623B\u308B");
		}
	}

	endDelView(O_manage, H_sess) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	//削除日（現在削除）
	//表示言語分岐
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		var today = this.Today.replace(/-/g, "");

		if (undefined !== H_sess.SELF.post.deldate === true) {
			var deldate = O_manage.convertDatetime(H_sess.SELF.post.deldate).replace(/-/g, "");
		} else {
			deldate = cym + "01";
		}

		if (this.O_Sess.language == "ENG") {
			if (undefined !== H_sess.SELF.post.deldate === true && today < deldate) {
				O_finish.displayFinish("Reservation of phone deletion", "/Management/Tel/menu.php", "To list screen", "", "ENG");
			} else {
				O_finish.displayFinish("Phone deletion", "/Management/Tel/menu.php", "To list screen", "", "ENG");
			}
		} else {
			if (undefined !== H_sess.SELF.post.deldate === true && today < deldate) {
				O_finish.displayFinish("\u96FB\u8A71\u524A\u9664\u4E88\u7D04", "/Management/Tel/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
			} else {
				O_finish.displayFinish("\u96FB\u8A71\u524A\u9664", "/Management/Tel/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
			}
		}
	}

	freezeForm() {
		this.H_View.O_DelFormUtil.updateElementAttrWrapper("delsubmit", {
			value: this.RecName
		});
		this.H_View.O_DelFormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.H_View.O_DelFormUtil.freezeWrapper();
	}

	unfreezeForm() {
		this.H_View.O_DelFormUtil.updateElementAttrWrapper("delsubmit", {
			value: this.NextName
		});
	}

	__destruct() {
		super.__destruct();
	}

};