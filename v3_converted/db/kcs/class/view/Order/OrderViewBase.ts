//
//注文Viewの基底クラス
//
//更新履歴：<br>
//2008/04/09 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/09
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//注文Viewの基底クラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/09
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("ManagementUtil.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/ViewFinish.php");

//
//ディレクトリ名
//
//
//承認fncid
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
//電話詳細情報として画面に表示するカラム名配列
//
//@var mixed
//@access protected
//
//
//FJP用オブジェクト
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
//
//
//セッションのpactidを返す
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
//
//セッションのpostidを返す
//
//@author miyazawa
//@since 2008/04/09
//
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
//@param $sess(SESSIONキー名)空の場合はself::pub
//
//@access public
//@return void
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
//Smartyによる表示
//
//@author miyazawa
//@since 2008/04/11
//
//@param mixed $O_form
//@access protected
//@return void
//
//
//最低限必要なセッション情報が無ければエラー表示
//
//@author miyazawa
//@since 2008/04/09
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//プラン変更、名義変更などの注文種別を丸めて返す<BR>
//Ppl（プラン変更）、Pop（オプション変更）、Pdc（割引サービス変更を「P」に<BR>
//Tcp（会社→個人）、Tpc（個人→会社）、Tcc（会社→会社）を「T」に
//
//@author miyazawa
//@since 2008/09/09
//
//@param int $type
//@access public
//@return int
//
//
//setfjpModelObject
//
//@author houshiyama
//@since 2011/06/09
//
//@param mixed $fjp
//@access public
//@return void
//
//
//getfjpModel
//
//@author houshiyama
//@since 2011/06/09
//
//@access protected
//@return void
//
//
//switchCarrier
//
//@author web
//@since 2012/09/27
//
//@param mixed $post
//@access protected
//@return void
//
//
//getBillItems
//
//@author web
//@since 2013/04/04
//
//@access public
//@return void
//
//
//getBillView
//
//@author web
//@since 2013/04/04
//
//@access protected
//@return void
//
//
//assignBillData
//
//@author web
//@since 2013/04/04
//
//@access public
//@return void
//
//
//assignBillLang
//
//@author web
//@since 2013/04/04
//
//@access public
//@return void
//
//
//assignBillView
//
//@author web
//@since 2013/04/08
//
//@access public
//@return void
//
//
//assignRegisterdBillData
//
//@author web
//@since 2013/04/09
//
//@param mixed $data
//@access public
//@return void
//
//
//setOrderByCategory
//
//@author web
//@since 2013/10/02
//
//@param mixed $pattern
//@access public
//@return void
//
//
//setOrderByCategoryFlag
//
//@author web
//@since 2014/02/28
//
//@param mixed $flag
//@access public
//@return void
//
//
//getAuthPact
//
//@author hanashima
//@since 2020/03/16
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
class OrderViewBase extends ViewSmarty {
	static PUB = "/MTOrder";
	static RECOGID = 23;
	static FUNC_EXTENSION = 158;

	constructor(H_param = Array()) //英語化でテンプレートのディレクトリ変更 20090824miya
	{
		this.O_Sess = MtSession.singleton();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(OrderViewBase.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
		this.O_Set.loadConfig("subtract_point_from_subtotal");
		var carrior_list = this.O_Set.A_carrior_list;
		var m = carrior_list.length;
		this.get_Smarty().assign("subtract_point_from_subtotal", false);

		if (m > 0) {
			for (var i = 0; i < m; i++) {
				carrior_list[i] = +carrior_list[i];
			}

			if (-1 !== carrior_list.indexOf(this.H_Dir.carid)) {
				this.get_Smarty().assign("subtract_point_from_subtotal", true);
			}
		}

		this.A_teldetail_colname = ["mail", "telusername", "employeecode", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "int4", "int5", "int6", "date1", "date2", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "select1", "select2", "select3", "select4", "select5", "select6", "select7", "select8", "select9", "select10", "memo", "kousiradio", "kousi", "memo", "extensionno", "simcardno"];
	}

	get_Pactid() {
		return this.pactid;
	}

	get_Postid() {
		return this.postid;
	}

	getLocalSession() {
		var H_sess = {
			[OrderViewBase.PUB]: this.O_Sess.getPub(OrderViewBase.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	clearUnderSession(sess = OrderViewBase.PUB) {
		this.clearLastForm();
		var A_exc = [sess];
		this.O_Sess.clearSessionExcludeListPub(A_exc);
	}

	get_View() {
		return this.H_View;
	}

	displaySmarty() {}

	checkBaseParamError(H_sess, H_g_sess) //最低限必要なセッションが無ければエラー
	{
		if (undefined !== H_sess[OrderViewBase.PUB].orderid == false || undefined !== H_sess[OrderViewBase.PUB].type == false || undefined !== H_sess[OrderViewBase.PUB].carid == false || undefined !== H_sess[OrderViewBase.PUB].cirid == false) {
			this.errorOut(8, "session\u304C\u7121\u3044", false, "../Menu/menu.php");
			throw die();
		}
	}

	cutOrderType(type) {
		if (true == ereg("^P", type)) {
			type = "P";
		} else if (true == ereg("^T", type)) {
			type = "T";
		}

		return type;
	}

	setfjpModelObject(fjp) {
		if (!fjp instanceof fjpModel) {
			return false;
		}

		return this.O_fjp = fjp;
	}

	_getfjpModel() {
		if (!this.O_fjp instanceof fjpModel) {
			return false;
		}

		return this.O_fjp;
	}

	switchCarrier(post) {
		if (undefined !== post.othercarid && preg_match("/[0-9].*-[0-9].*/", post.othercarid)) {
			this.H_Dir.carid = post.othercarid.replace(/-[0-9].*$/g, "");
			this.H_Dir.cirid = post.othercarid.replace(/^[0-9].*-/g, "");
			this.H_Dir.othercarid = post.othercarid;
		}
	}

	getBillItems() {
		var order = ["billname", "billpost", "receiptname", "zip1", "zip2", "addr1", "addr2", "building", "billtel", "billhow", "billhowview", "tableName"];
		var lang = this.getBillView().getLangLists();

		for (var key of Object.values(order)) {
			var langMode = this.gSess().language;

			if (!!langMode) {
				langLists[key] = lang[key][this.gSess().language];
			} else {
				langLists[key] = lang[key].JPN;
			}
		}

		return langLists;
	}

	getBillView() {
		require("view/Order/BillingViewBase.php");

		if (!this.billView instanceof BillingViewBase) {
			this.billView = new BillingViewBase();
		}

		return this.billView;
	}

	assignBillData(data) {
		this.get_Smarty().assign("billData", data);
	}

	assignBillLang() {
		this.get_Smarty().assign("billLang", this.getBillItems());
	}

	assignBillView() {
		var billView = this.getBillView().assignBillView();
		this.get_Smarty().assign("billView", billView);
		return billView;
	}

	assignRegisterdBillData(data) {
		var items = this.getBillItems();

		for (var key in items) {
			var item = items[key];

			switch (key) {
				case "zip1":
				case "zip2":
				case "addr1":
				case "addr2":
					rel[key] = "bill" + key;
					break;

				case "building":
					rel[key] = "billbuild";
					break;

				default:
					rel[key] = key;
					break;
			}
		}

		for (var key in rel) {
			var label = rel[key];

			if (undefined !== data[label]) {
				billData[key] = data[label];
			}
		}

		this.get_Smarty().assign("billData", billData);
		return billData;
	}

	setOrderByCategory(pattern) {
		this.get_Smarty().assign("OrderByCategory", pattern);
	}

	setOrderByCategoryFlag(flag) {
		this.get_Smarty().assign("OrderByCategoryFlag", flag);
	}

	getAuthPact() {
		return this.getAuth().getPactFuncId();
	}

	__destruct() {
		super.__destruct();
	}

};