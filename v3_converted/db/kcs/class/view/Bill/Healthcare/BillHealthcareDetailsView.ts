//
//ヘルスケア取得のView
//
//更新履歴：<br>
//2010/02/25 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author date
//@since 2010/02/25
//@uses BillDetailsViewBase
//
//
//error_reporting(E_ALL);
//
//ヘルスケア取得のView
//
//@package Bill
//@subpackage View
//@author date
//@since 2015/07/01
//@uses BillDetailsViewBase
//

require("view/Bill/BillDetailsViewBase.php");

require("MtAuthority.php");

require("MtTableUtil.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author date
//@since 2015/07/01
//
//@access public
//@return void
//@uses BillUtil
//
//
//運送一覧固有のsetDeraultSession
//
//@author date
//@since 2010/02/25
//
//@access protected
//@return void
//
//
//運送一覧固有のcheckCGIParam
//
//@author date
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
//@author date
//@since 2010/02/25
//
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
//@author date
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
//@author date
//@since 2010/02/25
//
//@param mixed $H_session
//@param mixed $A_data
//@param mixed $A_auth
//@param mixed $O_model
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author date
//@since 2010/02/25
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author date
//@since 2010/02/25
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author date
//@since 2010/02/25
//
//@access public
//@return void
//
class BillHealthcareDetailsView extends BillDetailsViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() //表示条件がセッションに無ければ作る
	{
		if (undefined !== this.H_Local.mode == false) {
			this.H_Local.mode = "0";
		}

		if (undefined !== this.H_Local.graph == false) {
			this.H_Local.graph = "0";
		}
	}

	checkCGIParamPeculiar() //初期アクセス時ＩＤをセッションに入れリロード
	{
		if (undefined !== _GET.id == true) {
			var A_id = split(":", _GET.id);
			this.H_Local.get.healthid = A_id[0];
			this.H_Local.get.healthcoid = A_id[1];
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}

		if (undefined !== this.H_Local.get == false) {
			this.errorOut(15, "get\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u7121\u3044", false);
		}

		if (undefined !== _GET.graph === true) {
			this.H_Local.graph = _GET.graph;
		}

		if (undefined !== _GET.mode === true) {
			this.H_Local.mode = _GET.mode;
			this.O_Sess.setSelfAll(this.H_Local);
		}
	}

	makeSearchForm(O_bill: BillUtil, O_model) //管理種別の配列を生成
	//科目の配列を生成
	//金額条件の配列を取得
	//表示形式の配列を取得
	//英語化 20090702miya
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	{
		var H_co = O_model.getHealthcareCoData();
		var H_kamoku = O_model.getKamokuData(false, this.O_Sess.pactid);
		var H_cond = O_bill.getMoneyCondition();
		var H_mode = O_bill.getTranViewMode();

		if ("ENG" == this.O_Sess.language) {
			var tranid_label = "\u2605\u904B\u9001ID";
			var username_label = "\u2605\u62C5\u5F53";
			var kamoku_label = "Account is";
			var kamokuprice_label = "Billing amount is";
			var kamokuprice_condition_label = "\u6761\u4EF6";
			var slipno_label = "\u2605\u4F1D\u7968\u756A\u53F7";
			var search_label = "Search";
			var reset_label = "Reset";
			var trancoid_label = "\u2605\u4F1A\u793E";
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
			slipno_label = "\u4F1D\u7968\u756A\u53F7";
			search_label = "\u691C\u7D22";
			reset_label = "\u30EA\u30BB\u30C3\u30C8";
			trancoid_label = "\u4F1A\u793E";
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
				size: "25"
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
			name: "slipno",
			label: slipno_label,
			inputtype: "text",
			options: {
				id: "slipno",
				size: "25"
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
	//ここで使用する自作関数の読込
	{
		if ("ENG" == this.O_Sess.language) {
			var int_mess = "Enter number content in single-byte characters.";
			var date_mess = "Please specify day, month, and year for date content.  Non-existent date is not allowed.";
			var warn1 = "Please enter following contents\n";
			var warn2 = "\nPlease enter correctly";
			var warn3 = "<font color=red>Items with \u203B are required.</font>";
		} else {
			int_mess = "\u6570\u5024\u9805\u76EE\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
			date_mess = "\u65E5\u4ED8\u9805\u76EE\u306F\u5E74\u6708\u65E5\u3092\u5168\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u51FA\u6765\u307E\u305B\u3093\u3002";
			warn1 = "\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n";
			warn2 = "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
			warn3 = "<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>";
		}

		var A_grouprule = [{
			name: "int",
			mess: int_mess,
			type: "QRSelectAndNumeric",
			format: undefined,
			validation: "client"
		}, {
			name: "date",
			mess: date_mess,
			type: "QRSelectAndCheckDate",
			format: undefined,
			validation: "client"
		}];
		var A_orgrule = ["QRSelectAndNumeric", "QRSelectAndCheckDate"];
		this.H_View.O_SearchFormUtil.registerOriginalRules(A_orgrule);
		this.H_View.O_SearchFormUtil.setJsWarningsWrapper(warn1, warn2);
		this.H_View.O_SearchFormUtil.setRequiredNoteWrapper(warn3);
		this.H_View.O_SearchFormUtil.makeFormRule(A_grouprule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_model) //タブ作成
	//表示モード
	//ヘルスケアID
	//会社
	//英語化 20090702miya
	////	セッションからとるようにしたよ
	//		// 対象テーブル番号の取得
	//		$O_table = new MtTableUtil;
	//		$tableno = $O_table->getTableNo( $H_sess[self::PUB]["cym"] );
	//		$this->get_Smarty()->assign( "tableno",$tableno );
	//		$this->get_Smarty()->assign( "pactid",$this->O_Sess->pactid);
	{
		var year = H_sess[BillHealthcareDetailsView.PUB].cym.substr(0, 4);
		var month = H_sess[BillHealthcareDetailsView.PUB].cym.substr(4, 2);
		var O_auth = MtAuthority.singleton(this.O_Sess.pactid);
		createTabBill5(this.get_Smarty(), year, month, H_sess[BillHealthcareDetailsView.PUB].current_postid, false, "healthcare", O_auth, this.O_Sess.userid);
		this.get_Smarty().assign("mode", H_sess.SELF.mode);
		this.get_Smarty().assign("graph", H_sess.SELF.graph);
		this.get_Smarty().assign("employeecode", H_sess.SELF.get.employeecode);
		var A_co = O_model.getHealthcareCoData(this.O_Sess.language);
		this.get_Smarty().assign("healthconame", A_co[H_sess.SELF.get.healthcoid]);
		this.get_Smarty().assign("lang", this.O_Sess.language);
		this.get_Smarty().assign("healthid", H_sess.SELF.get.healthid);
		this.get_Smarty().assign("healthcoid", H_sess.SELF.get.healthcoid);
	}

	makePankuzuLinkHash() //英語化 20090702miya
	{
		if ("ENG" == this.O_Sess.language) {
			var H_link = {
				"/Bill/Healthcare/menu.php": "Bill information",
				"": "Billing statement"
			};
		} else {
			H_link = {
				"/Bill/Healthcare/menu.php": "\u53D6\u5F97\u60C5\u5831",
				"": "\u53D6\u5F97\u660E\u7D30"
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