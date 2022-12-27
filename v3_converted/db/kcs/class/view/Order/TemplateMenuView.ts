//
//注文雛型メニューViewクラス
//
//更新履歴：<br>
//2008/06/04 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/06/04
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//注文雛型メニューViewクラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/06/04
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("OrderUtil.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

//
//ディレクトリ名
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//
//フォームオブジェクト
//
//@var mixed
//@access protected
//
//
//fncs
//
//@var array
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
//checkCGIParam
//
//@author web
//@since 2013/10/04
//
//@access protected
//@return void
//
//
//setModel
//
//@author web
//@since 2013/10/04
//
//@param mixed $model
//@access public
//@return void
//
//
//ローカルセッションを取得する
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
//
//配下のセッション消し
//
//@author miyazawa
//@since 2008/05/13
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
//表示に使用する物を格納する配列を返す
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return mixed
//
//
//注文権限を返す
//
//@author miyazawa
//@since 2008/06/06
//
//@access public
//@return mixed
//
//
//セッションに英語化のtrue/falseを入れる
//
//@author miyazawa
//@since 2009/03/04
//
//@param boolean $eng
//@access public
//@return void
//
//
//フォームを作成する<br>
//
//@author miyazawa
//@since 2008/05/14
//
//@param mixed $O_order
//@param mixed $O_model
//@param array $H_sess
//@access public
//@return void
//
//
//雛型メニューに表示するフォームを作成する<br>
//
//@author miyazawa
//@since 2008/06/04
//
//@param mixed $H_list
//@param mixed $H_data
//@access public
//@return array
//
//
//Smartyを用いた画面表示<br>
//
//各データをSmartyにassign<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/02/20
//
//@param array $H_sess（CGIパラメータ）
//@param array $H_list（テンプレ一覧）
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
class TemplateMenuView extends ViewSmarty {
	static PUB = "/MTTemplate";

	constructor() //英語化でテンプレートのディレクトリ変更 20090824miya
	{
		this.O_Sess = MtSession.singleton();
		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.fncs = ["fnc_fjp_co", "fnc_tel_division"];
		this.H_Dir = this.O_Sess.getPub(TemplateMenuView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	checkCGIParam() //fnc_fjp_co fnc_tel_division 権限持っていて、
	//区分のセッションが入ってない場合は、選択画面
	//if (!is_null($lSess) and ($lSess['division_pattern'] != "")nd ) {
	{
		for (var fnc of Object.values(this.fncs)) {
			if (!(-1 !== this.model.get_AuthIni().indexOf(fnc))) {
				return false;
			}
		}

		var lSess = this.O_Sess.getPub(TemplateMenuView.PUB);

		if (_GET.pattern === "business" or _GET.pattern === "demo") {
			this.O_Sess.setPub(TemplateMenuView.PUB, {
				division_pattern: _GET.pattern
			});
		} else if (!is_null(lSess) && lSess.division_pattern != "") {
			header("Location: /MTTemplate/menu.php?pattern=" + lSess.division_pattern);
			throw die(0);
		} else {
			var smarty_template = "select.tpl";
			var O_order = OrderUtil.singleton();
			this.get_Smarty().assign("page_path", MakePankuzuLink.makePankuzuLinkHTML({
				"": "\u6CE8\u6587\u96DB\u5F62\u767B\u9332\uFF08\u7528\u9014\u533A\u5206\u9078\u629E\uFF09"
			}));
			this.get_Smarty().display(smarty_template);
			throw die(0);
		}
	}

	setModel(model) {
		this.model = model;
	}

	getLocalSession() {
		var H_sess = {
			[TemplateMenuView.PUB]: this.O_Sess.getPub(TemplateMenuView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [TemplateMenuView.PUB, "/MTOrder", "/MTTemplate/templateadd.php", "/MTTemplate/templatemod.php", "/Shop/MTHLTemplate/templateadd.php", "/Shop/MTHLTemplate/templatemod.php", "/_lastform"];
		this.O_Sess.clearSessionListPub(A_exc);
	}

	makePankuzuLinkHash() //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var H_link = {
				"": "Order Template"
			};
		} else {
			H_link = {
				"": "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u96DB\u578B\u767B\u9332"
			};
		}

		return H_link;
	}

	get_View() {
		return this.H_View;
	}

	makeOrderAuth(A_auth: {} | any[]) {
		var A_orderauth = Array();

		if (-1 !== A_auth.indexOf(fnc_order_docomo) == true) {
			A_orderauth.push(DOCOMOCARID);
		}

		if (-1 !== A_auth.indexOf(fnc_order_au) == true) {
			A_orderauth.push(AUCARID);
		}

		if (-1 !== A_auth.indexOf(fnc_order_willcom) == true) {
			A_orderauth.push(DDICARID);
		}

		if (-1 !== A_auth.indexOf(fnc_order_softbank) == true) {
			A_orderauth.push(VODAFONECARID);
		}

		if (-1 !== A_auth.indexOf(fnc_order_emobile) == true) {
			A_orderauth.push(EMOBILECARID);
		}

		if (-1 !== A_auth.indexOf(fnc_order_smartphone) == true) {
			A_orderauth.push(SMARTPHONECARID);
		}

		if (-1 !== A_auth.indexOf(fnc_order_other) == true) {
			A_orderauth.push(OTHERCARID);
		}

		if (A_orderauth.length < 1) //$this->warningOut(5, "注文雛形を作成できるキャリアがありません", 1, "../../Menu/menu.php", "メニューに戻る");
			{
				this.errorOut(6, "\u6CE8\u6587\u96DB\u5F62\u3092\u4F5C\u6210\u3067\u304D\u308B\u30AD\u30E3\u30EA\u30A2\u304C\u3042\u308A\u307E\u305B\u3093", false, "../../Menu/menu.php");
			}

		return A_orderauth;
	}

	setEnglish(eng = false) {
		this.H_Dir.eng = eng;
		this.O_Sess.SetPub(TemplateMenuView.PUB, this.H_Dir);
	}

	makeTemplateMenuForm(O_order, O_model, H_sess: {} | any[]) //フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	{
		var A_formelement = [{
			name: "movesubmit",
			label: "\u6B21\u3078",
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
		}];
		this.H_View.O_TemplateMenuFormUtil = new QuickFormUtil("form");
		this.H_View.O_TemplateMenuFormUtil.setFormElement(A_formelement);
		this.O_TemplateMenuForm = this.H_View.O_TemplateMenuFormUtil.makeFormObject();
	}

	makeTemplateMenuList(H_list: {} | any[], H_data: {} | any[]) //英語化権限 20090210miya
	{
		var independent = [this.O_Set.car_docomo, this.O_Set.car_willcom, this.O_Set.car_au, this.O_Set.car_softbank, this.O_Set.car_other, this.O_Set.car_emobile, this.O_Set.car_smartphone];
		var otherKey = "N-" + this.O_Set.car_other + "-23-0";

		for (var i = 0; i < H_data.length; i++) //既存のキャリアは個別に、その他のキャリアは「その他」にまとめる
		{
			var key = H_data[i].type + "-" + H_data[i].carid + "-" + H_data[i].cirid + "-" + H_data[i].ppid;

			if (undefined !== H_list[key].list != true) {
				H_list[key].list = Array();
			}

			H_list[key].cnt++;

			if (H_data[i].arname == "\u4E0D\u660E") {
				H_data[i].arname = "\u5730\u57DF\u6307\u5B9A\u306A\u3057";
			}

			if (H_data[i].postname == "") {
				H_data[i].postname = "\u90E8\u7F72\u6307\u5B9A\u306A\u3057";
			}

			if (H_data[i].userpostid != "") {
				H_data[i].userpostid = "(" + H_data[i].userpostid + ")";
			}

			if (H_data[i].defflg != 0) {
				H_data[i].tempname = "\u25CE" + H_list[key].cnt + ".\u3010" + H_data[i].postname + H_data[i].userpostid + "\u3011 " + H_data[i].tempname;
			} else {
				H_data[i].tempname = H_list[key].cnt + ".\u3010" + H_data[i].postname + H_data[i].userpostid + "\u3011 " + H_data[i].tempname;
			}

			if (-1 !== independent.indexOf(H_data[i].carid)) {
				H_list[key].list.push({
					name: H_data[i].tempname,
					val: H_data[i].tempid
				});
			} else {
				if (!(undefined !== H_list[otherKey].list)) {
					H_list[otherKey].list = Array();
				}

				H_list[otherKey].list.push({
					name: H_data[i].tempname,
					val: H_data[i].tempid
				});
			}
		}

		if (true == this.H_Dir.eng) {
			var selectdef_str = "No registration";
		} else {
			selectdef_str = "\u767B\u9332\u306A\u3057";
		}

		for (var ky in H_list) //その他キャリアがを省く
		{
			var val = H_list[ky];

			if (!(-1 !== independent.indexOf(val.carid))) {
				continue;
			}

			H_result[ky] = val;

			if (val.list.length < 1) {
				H_result[ky].list = Array();
				H_result[ky].list.push({
					name: selectdef_str,
					val: ""
				});
				H_result[ky].mod = "NG";
			}
		}

		if (undefined !== H_result) {
			return H_result;
		}

		return H_list;
	}

	displaySmarty(H_sess: {} | any[], H_list: {} | any[]) //assign
	//display
	{
		this.get_Smarty().assign("H_list", H_list);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("OrderByCategory", H_sess[TemplateMenuView.PUB].division_pattern);
		this.O_Sess.setPub(TemplateMenuView.PUB, {
			division_pattern: _GET.pattern
		});
		var smarty_template = "menu.tpl";
		this.get_Smarty().display(smarty_template);
	}

	__destruct() {
		super.__destruct();
	}

};