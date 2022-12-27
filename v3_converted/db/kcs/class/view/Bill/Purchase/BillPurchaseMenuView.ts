//
//購買請求のView
//
//更新履歴：<br>
//2008/03/07 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/04/11
//@uses BillMenuViewBase
//
//
//error_reporting(E_ALL);
//
//購買請求のView
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/04/11
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
//@since 2008/04/11
//
//@access public
//@return void
//@uses BillUtil
//
//
//購買一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2008/04/11
//
//@access protected
//@return void
//
//
//購買一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2008/04/11
//
//@access protected
//@return void
//
//
//購買一覧の検索フォームを作成する<br>
//
//管理種別の配列を生成<br>
//フォーム要素の配列を作成<br>
//検索フォームのオブジェクト生成<br>
//契約日用のグループの配列作成<br>
//契約日用のグループを検索フォームオブジェクトに追加<br>
//
//@author houshiyama
//@since 2008/04/11
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
//@since 2008/04/11
//
//@access public
//@return void
//
//
//購買一覧固有のdisplaySmarty <br>
//
//拡張表示項目一覧取得 <br>
//拡張表示項目で検索されたもの取得 <br>
//拡張表示項目assign <br>
//
//@author houshiyama
//@since 2008/04/11
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
//@since 2008/05/19
//
//@abstract
//@access protected
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2008/04/11
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/04/11
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/11
//
//@access public
//@return void
//
class BillPurchaseMenuView extends BillMenuViewBase {
	constructor() {
		super();
	}

	setDefaultSessionPeculiar() //購買先がセッションに無ければ作る
	{
		if (undefined !== this.H_Local.purchcoid === false) {
			this.H_Local.purchcoid = "0";
		}
	}

	checkCGIParamPeculiar() //購買先が変更された時
	{
		if (undefined !== _POST.purchcoid === true) {
			this.H_Local.purchcoid = _POST.purchcoid;
		}
	}

	makeSearchForm(H_sess, O_bill: BillUtil, O_model) //管理種別の配列を生成
	//科目の配列を生成
	//金額条件の配列を取得
	//表示形式の配列を取得
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	{
		var H_co = O_model.getBillPurchCoData(H_sess);
		var H_kamoku = O_model.getKamokuData(true, this.O_Sess.pactid);
		var H_cond = O_bill.getMoneyCondition();
		var H_mode = O_bill.getPurchViewMode();
		var A_formelement = [{
			name: "purchid",
			label: "\u8CFC\u8CB7ID",
			inputtype: "text",
			options: {
				id: "purchid",
				size: "25"
			}
		}, {
			name: "username",
			label: "\u62C5\u5F53",
			inputtype: "text",
			options: {
				id: "username",
				size: "25"
			}
		}, {
			name: "kamoku",
			label: "\u79D1\u76EE\u304C",
			inputtype: "select",
			data: H_kamoku,
			options: {
				id: "kamoku"
			}
		}, {
			name: "kamokuprice",
			label: "\u91D1\u984D\u304C",
			inputtype: "text",
			options: {
				id: "kamokuprice",
				size: "25",
				maxlength: "20"
			}
		}, {
			name: "kamokuprice_condition",
			label: "\u6761\u4EF6",
			inputtype: "select",
			data: H_cond,
			options: {
				id: "kamokucondition"
			}
		}, {
			name: "slipno",
			label: "\u4F1D\u7968\u756A\u53F7",
			inputtype: "text",
			options: {
				id: "slipno",
				size: "25"
			}
		}, {
			name: "itemcode",
			label: "\u5546\u54C1\u30B3\u30FC\u30C9",
			inputtype: "text",
			options: {
				id: "itemcode",
				size: "25"
			}
		}, {
			name: "search",
			label: "\u691C\u7D22",
			inputtype: "submit"
		}, {
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "button",
			options: {
				onClick: "javascript:resetFormValue()"
			}
		}, {
			name: "purchcoid",
			label: "\u8CFC\u8CB7\u5148",
			inputtype: "select",
			data: H_co,
			options: {
				id: "purchcoid"
			}
		}, {
			name: "comodbutton",
			label: "\u5909\u66F4",
			inputtype: "button",
			options: {
				onClick: "javascript:submitCoForm()"
			}
		}, {
			name: "mode",
			label: "\u8868\u793A\u5F62\u5F0F",
			inputtype: "select",
			data: H_mode,
			options: {
				id: "mode"
			}
		}, {
			name: "modebutton",
			label: "\u5909\u66F4",
			inputtype: "button",
			options: {
				onClick: "javascript:submitModeForm()"
			}
		}, {
			name: "limit",
			label: "\u691C\u7D22\u7D50\u679C\u3092",
			inputtype: "text",
			options: {
				id: "limit",
				size: "3",
				maxlength: "3"
			}
		}, {
			name: "limitbutton",
			label: "\u8868\u793A",
			inputtype: "button",
			options: {
				onClick: "javascript:submitLimitForm()"
			}
		}];
		this.H_View.O_SearchFormUtil = new QuickFormUtil("searchform");
		this.H_View.O_SearchFormUtil.setFormElement(A_formelement);
		this.O_SearchForm = this.H_View.O_SearchFormUtil.makeFormObject();
	}

	makeSearchRule() {
		var A_rule = [{
			name: "kamokuprice",
			mess: "\u91D1\u984D\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "numeric",
			format: undefined,
			validation: "client"
		}];
		this.H_View.O_SearchFormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.H_View.O_SearchFormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.H_View.O_SearchFormUtil.makeFormRule(A_rule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_model, O_smarty, O_renderer) //部署ツリー
	//再計算権限
	//再計算処理
	//部署ツリー
	//科目情報取得
	//詳細情報表示権限
	//display
	//再計算中の画面表示
	{
		var year = H_sess[BillPurchaseMenuView.PUB].cym.substr(0, 4);
		var month = H_sess[BillPurchaseMenuView.PUB].cym.substr(4, 2);
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

		createTabBill5(this.get_Smarty(), year, month, H_sess[BillPurchaseMenuView.PUB].current_postid, false, "purchase", O_auth, this.O_Sess.userid);
		applyRecalc(O_smarty, O_renderer, year, month, H_sess.SELF.purchcoid, "purchase", auth_recalc, false, "\u8CFC\u8CB7");
		this.get_Smarty().assign("use_tree", use_tree);
		this.get_Smarty().assign("H_headerline", O_model.getKamokuData(false, this.O_Sess.pactid));
		var manage_detail = false;

		if (-1 !== A_auth.indexOf("fnc_purch_manage_vw") === true) {
			manage_detail = true;
		}

		this.get_Smarty().assign("manage_detail", manage_detail);

		if (O_model.checkInRecalc(year, month) == true) {
			this.get_Smarty().display("purch_bill_underconst.tpl");
		} else {
			this.get_Smarty().display(this.getDefaultTemplate());
		}
	}

	makeDefaultValuePeculiar(H_sess, H_default) //購買先
	{
		H_default.purchcoid = H_sess.SELF.purchcoid;
	}

	makePankuzuLinkHash() {
		var H_link = {
			"": "\u8ACB\u6C42\u60C5\u5831"
		};
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