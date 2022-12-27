//
//運送請求のView
//
//更新履歴：<br>
//2010/02/25 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2010/02/25
//@uses BillMenuViewBase
//
//
//error_reporting(E_ALL);
//
//運送請求のView
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2010/02/25
//@uses BillMenuViewBase
//

require("view/Bill/BillMenuViewBase.php");

require("MtAuthority.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2010/02/25
//
//@access public
//@return void
//@uses BillUtil
//
//
//運送一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2010/02/25
//
//@access protected
//@return void
//
//
//運送一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2010/02/25
//
//@access protected
//@return void
//
//
//運送一覧の検索フォームを作成する<br>
//
//管理種別の配列を生成<br>
//フォーム要素の配列を作成<br>
//検索フォームのオブジェクト生成<br>
//契約日用のグループの配列作成<br>
//契約日用のグループを検索フォームオブジェクトに追加<br>
//
//@author houshiyama
//@since 2010/02/25
//
//@param array $H_sess
//@param object $O_manage
//@param object $O_model
//@access public
//@return void
//@uses BillUtil
//@uses QuickFormUtil
//
//
//検索フォームのルール作成
//
//@author houshiyama
//@since 2010/02/25
//
//@access public
//@return void
//
//
//運送一覧固有のdisplaySmarty <br>
//
//拡張表示項目一覧取得 <br>
//拡張表示項目で検索されたもの取得 <br>
//拡張表示項目assign <br>
//
//@author houshiyama
//@since 2010/02/25
//
//@param mixed $H_sess
//@param mixed $A_data
//@param mixed $A_auth
//@param mixed $O_model
//@access public
//@return void
//
//
//各ページ固有のmakeDefaultValue
//
//@author houshiyama
//@since 2010/02/25
//
//@abstract
//@access protected
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2010/02/25
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2010/02/25
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/25
//
//@access public
//@return void
//
class BillTransitMenuView extends BillMenuViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() //運送会社がセッションに無ければ作る
	{
		if (undefined !== this.H_Local.trancoid === false) {
			this.H_Local.trancoid = "0";
		}
	}

	checkCGIParamPeculiar() //運送会社が変更された時
	{
		if (undefined !== _POST.trancoid === true) {
			this.H_Local.trancoid = _POST.trancoid;
		}
	}

	makeSearchForm(H_sess, O_bill: BillUtil, O_model) //英語化 20090702miya
	//英語化 20090702miya
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	{
		if ("ENG" == this.O_Sess.language) //管理種別の配列を生成
			//科目の配列を生成
			//金額条件の配列を取得
			//表示形式の配列を取得
			{
				var H_co = O_model.getBillTranCoData(H_sess, this.O_Sess.language);
				var H_kamoku = O_model.getKamokuData(true, this.O_Sess.pactid, this.O_Sess.language);
				var H_cond = O_bill.getMoneyConditionEng();
				var H_mode = O_bill.getTranViewModeEng();
			} else //管理種別の配列を生成
			//科目の配列を生成
			//金額条件の配列を取得
			//表示形式の配列を取得
			{
				H_co = O_model.getBillTranCoData(H_sess, this.O_Sess.language);
				H_kamoku = O_model.getKamokuData(true, this.O_Sess.pactid, this.O_Sess.language);
				H_cond = O_bill.getMoneyCondition();
				H_mode = O_bill.getTranViewMode();
			}

		if ("ENG" == this.O_Sess.language) {
			var tranid_label = "\u2605\u904B\u9001ID";
			var username_label = "\u2605\u62C5\u5F53";
			var kamoku_label = "Account is";
			var kamokuprice_label = "Billing amount is";
			var kamokuprice_condition_label = "\u6761\u4EF6";
			var sendcount_label = "\u2605 \u904B\u9001\u6570\u91CF";
			var search_label = "Search";
			var reset_label = "Reset";
			var trancoid_label = "\u2605\u904B\u9001\u4F1A\u793E";
			var comodbutton_label = "Edit";
			var mode_label = "Display format";
			var modebutton_label = "Edit";
			var limit_label = "search results ";
			var limitbutton_label = "Display";
		} else {
			tranid_label = "\u904B\u9001ID";
			username_label = "\u62C5\u5F53";
			kamoku_label = "\u79D1\u76EE\u304C";
			kamokuprice_label = "\u91D1\u984D\u304C";
			kamokuprice_condition_label = "\u6761\u4EF6";
			var weight_label = "\u91CD\u91CF\u304C";
			var weightval_condition_label = "\u6761\u4EF6";
			sendcount_label = "\u6570\u91CF\u304C";
			var sendcount_condition_label = "\u6761\u4EF6";
			search_label = "\u691C\u7D22";
			reset_label = "\u30EA\u30BB\u30C3\u30C8";
			trancoid_label = "\u904B\u9001\u4F1A\u793E";
			comodbutton_label = "\u5909\u66F4";
			mode_label = "\u8868\u793A\u5F62\u5F0F";
			modebutton_label = "\u5909\u66F4";
			limit_label = "\u691C\u7D22\u7D50\u679C\u3092";
			limitbutton_label = "\u8868\u793A";
		}

		var A_formelement = [{
			name: "tranid",
			label: tranid_label,
			inputtype: "text",
			options: {
				id: "tranid",
				size: "25"
			}
		}, {
			name: "username",
			label: username_label,
			inputtype: "text",
			options: {
				id: "username",
				size: "25"
			}
		}, {
			name: "kamoku",
			label: kamoku_label,
			inputtype: "select",
			data: H_kamoku,
			options: {
				id: "kamoku"
			}
		}, {
			name: "kamokuprice",
			label: kamokuprice_label,
			inputtype: "text",
			options: {
				id: "kamokuprice",
				size: "25",
				maxlength: "20"
			}
		}, {
			name: "kamokuprice_condition",
			label: kamokuprice_condition_label,
			inputtype: "select",
			data: H_cond,
			options: {
				id: "kamokucondition"
			}
		}, {
			name: "weight",
			label: weight_label,
			inputtype: "text",
			options: {
				id: "weight",
				size: "5",
				maxlength: "5"
			}
		}, {
			name: "weight_condition",
			label: weight_condition_label,
			inputtype: "select",
			data: H_cond,
			options: {
				id: "weightcondition"
			}
		}, {
			name: "sendcount",
			label: sendcount_label,
			inputtype: "text",
			options: {
				id: "sendcount",
				size: "5",
				maxlength: "5"
			}
		}, {
			name: "sendcount_condition",
			label: sendcount_condition_label,
			inputtype: "select",
			data: H_cond,
			options: {
				id: "sendcountcondition"
			}
		}, {
			name: "search",
			label: search_label,
			inputtype: "submit"
		}, {
			name: "reset",
			label: reset_label,
			inputtype: "button",
			options: {
				onClick: "javascript:resetFormValue()"
			}
		}, {
			name: "trancoid",
			label: trancoid_label,
			inputtype: "select",
			data: H_co,
			options: {
				id: "trancoid"
			}
		}, {
			name: "comodbutton",
			label: comodbutton_label,
			inputtype: "button",
			options: {
				onClick: "javascript:submitCoForm()"
			}
		}, {
			name: "mode",
			label: mode_label,
			inputtype: "select",
			data: H_mode,
			options: {
				id: "mode"
			}
		}, {
			name: "modebutton",
			label: modebutton_label,
			inputtype: "button",
			options: {
				onClick: "javascript:submitModeForm()"
			}
		}, {
			name: "limit",
			label: limit_label,
			inputtype: "text",
			options: {
				id: "limit",
				size: "3",
				maxlength: "3"
			}
		}, {
			name: "limitbutton",
			label: limitbutton_label,
			inputtype: "button",
			options: {
				onClick: "javascript:submitLimitForm()"
			}
		}];
		this.H_View.O_SearchFormUtil = new QuickFormUtil("searchform");
		this.H_View.O_SearchFormUtil.setFormElement(A_formelement);
		this.O_SearchForm = this.H_View.O_SearchFormUtil.makeFormObject();
	}

	makeSearchRule() //英語化 20090702miya
	{
		if ("ENG" == this.O_Sess.language) {
			var kamokuprice_mess = "Enter Billing amount in single-byte characters.";
			kamokuprice_mess = "\u91D1\u984D\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
			var weight_mess = "\u91D1\u984D\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
			var warn1 = "Please enter following contents\n";
			var warn2 = "\nPlease enter correctly";
			var warn3 = "<font color=red>Items with \u203B are required.</font>";
		} else {
			kamokuprice_mess = "\u91D1\u984D\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
			weight_mess = "\u91CD\u91CF\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
			var sendcount_mess = "\u6570\u91CF\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
			warn1 = "\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n";
			warn2 = "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
			warn3 = "<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>";
		}

		var A_rule = [{
			name: "kamokuprice",
			mess: kamokuprice_mess,
			type: "numeric",
			format: undefined,
			validation: "client"
		}, {
			name: "weight",
			mess: weight_mess,
			type: "numeric",
			format: undefined,
			validation: "client"
		}, {
			name: "sendcount",
			mess: sendcount_mess,
			type: "numeric",
			format: undefined,
			validation: "client"
		}];
		this.H_View.O_SearchFormUtil.setJsWarningsWrapper(warn1, warn2);
		this.H_View.O_SearchFormUtil.setRequiredNoteWrapper(warn3);
		this.H_View.O_SearchFormUtil.makeFormRule(A_rule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_model, O_smarty, O_renderer) //部署ツリー
	//再計算権限
	//再計算処理
	//部署ツリー
	//科目情報取得
	//詳細情報表示権限
	//英語化 20090702miya
	//利用明細の表示DLについて20141225date
	//display
	//再計算中の画面表示
	{
		var year = H_sess[BillTransitMenuView.PUB].cym.substr(0, 4);
		var month = H_sess[BillTransitMenuView.PUB].cym.substr(4, 2);
		var O_auth = MtAuthority.singleton(this.O_Sess.pactid);
		var use_tree = true;
		var auth_recalc = false;

		if (-1 !== A_auth.indexOf("fnc_recalc") == true) //再計算中の時は非表示
			{
				auth_recalc = true;

				if (O_model.checkInRecalc(year, month) == true) {
					auth_recalc = false;
					use_tree = false;
				}

				if (0 == A_data[0]) {
					auth_recalc = false;
				}
			}

		createTabBill5(this.get_Smarty(), year, month, H_sess[BillTransitMenuView.PUB].current_postid, false, "transit", O_auth, this.O_Sess.userid);
		applyRecalc(O_smarty, O_renderer, year, month, H_sess.SELF.trancoid, "transit", auth_recalc, false, "\u904B\u9001");
		this.get_Smarty().assign("use_tree", use_tree);
		this.get_Smarty().assign("H_headerline", O_model.getKamokuData(false, this.O_Sess.pactid));
		var manage_detail = false;

		if (-1 !== A_auth.indexOf("fnc_tran_manage_vw") === true) {
			manage_detail = true;
		}

		this.get_Smarty().assign("manage_detail", manage_detail);
		this.get_Smarty().assign("lang", this.O_Sess.language);
		var dl_usage_detail = O_model.isDownloadUsageDetails();

		if (dl_usage_detail) {
			this.get_Smarty().assign("dl_usage_detail", dl_usage_detail);
		} else {
			this.get_Smarty().assign("dl_usage_detail", dl_usage_detail);
		}

		if (O_model.checkInRecalc(year, month) == true) {
			this.get_Smarty().display("tran_bill_underconst.tpl");
		} else {
			this.get_Smarty().display("menu.tpl");
		}
	}

	makeDefaultValuePeculiar(H_sess, H_default) //運送会社
	{
		H_default.trancoid = H_sess.SELF.trancoid;
	}

	makePankuzuLinkHash() //英語化 20090702miya
	{
		if ("ENG" == this.O_Sess.language) {
			var H_link = {
				"": "Bill information"
			};
		} else {
			H_link = {
				"": "\u8ACB\u6C42\u60C5\u5831"
			};
		}

		return H_link;
	}

	getHeaderJS() {
		var str = "<script language=\"Javascript\" src=\"/js/Bill/BillMenu.js\"></script>";
		return str;
	}

	__destruct() {
		super.__destruct();
	}

};