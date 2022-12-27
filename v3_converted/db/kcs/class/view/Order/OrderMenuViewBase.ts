//
//注文メニューViewの基底クラス
//
//更新履歴：<br>
//2008/04/16 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/16
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//注文メニューViewの基底クラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/16
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

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
//注文メニュー作成
//
//@author miyazawa
//@since 2008/04/16
//
//@param mixed $H_sess
//@access protected
//@return mixed
//
//
//Smartyを用いた画面表示<br>
//
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author miyazawa
//@since 2008/05/13
//
//@param array $H_sess（CGIパラメータ）
//@param array $H_data（一覧データ）
//@param array $A_auth（権限一覧）
//@param array $O_order（関数集オブジェクト）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
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
class OrderMenuViewBase extends ViewSmarty {
	static PUB = "/MTOrder";
	static RECOGID = 23;

	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(OrderMenuViewBase.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	getLocalSession() {
		var H_sess = {
			[OrderMenuViewBase.PUB]: this.O_Sess.getPub(OrderMenuViewBase.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [OrderMenuViewBase.PUB, OrderMenuViewBase.PUB + "/menu.php", OrderMenuViewBase.PUB + "/select.php", OrderMenuViewBase.PUB + "/order_form.php"];
		this.O_Sess.clearSessionListPub(A_exc);
	}

	makePankuzuLinkHash() {
		var H_link = {
			"": "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C"
		};
		return H_link;
	}

	get_View() {
		return this.H_View;
	}

	checkBaseParamError(H_sess, H_g_sess) //最低限必要なセッションが無ければエラー
	{
		if (undefined !== H_sess[OrderMenuViewBase.PUB].orderid == false || undefined !== H_sess[OrderMenuViewBase.PUB].type == false || undefined !== H_sess[OrderMenuViewBase.PUB].carid == false || undefined !== H_sess[OrderMenuViewBase.PUB].cirid == false) {
			this.errorOut(8, "session\u304C\u7121\u3044", false, "../Menu/menu.php");
			throw die();
		}
	}

	makeOrderMenu(H_pattern: {} | any[], A_fnc: {} | any[]) //この数値が0だったら「ご注文をする販売店が指定されていません」のメッセージを表示
	{
		for (var i = 0; i < H_pattern.length; i++) //Docomo
		{
			if (H_pattern[i].carid == 1) {
				H_docomo.push(H_pattern[i]);
			} else if (H_pattern[i].carid == 2) {
				H_willcom.push(H_pattern[i]);
			} else if (H_pattern[i].carid == 3) {
				H_au.push(H_pattern[i]);
			} else if (H_pattern[i].carid == 4) {
				H_vodafone.push(H_pattern[i]);
			} else if (H_pattern[i].carid == 15) {
				H_emobile.push(H_pattern[i]);
			} else if (H_pattern[i].carid == 28) {
				H_smartphone.push(H_pattern[i]);
			}
		}

		var notorder = 0;

		if (H_docomo.length > 0) {
			_SESSION[dirname(_SERVER.PHP_SELF) + ",docomo"] = H_docomo;
			notorder++;
		}

		if (H_willcom.length > 0) {
			_SESSION[dirname(_SERVER.PHP_SELF) + ",willcom"] = H_willcom;
			notorder++;
		}

		if (H_au.length > 0) {
			_SESSION[dirname(_SERVER.PHP_SELF) + ",au"] = H_au;
			notorder++;
		}

		if (H_vodafone.length > 0) {
			_SESSION[dirname(_SERVER.PHP_SELF) + ",vodafone"] = H_vodafone;
			notorder++;
		}

		if (H_emobile.length > 0) {
			_SESSION[dirname(_SERVER.PHP_SELF) + ",emobile"] = H_emobile;
			notorder++;
		}

		if (H_smartphone.length > 0) {
			_SESSION[dirname(_SERVER.PHP_SELF) + ",smartphone"] = H_smartphone;
			notorder++;
		}

		var H_display = Array();

		if (-1 !== A_fnc.indexOf(fnc_order_docomo) == true) {
			H_disp.H_docomo = H_docomo;
		}

		if (-1 !== A_fnc.indexOf(fnc_order_willcom) == true) {
			H_disp.H_willcom = H_willcom;
		}

		if (-1 !== A_fnc.indexOf(fnc_order_au) == true) {
			H_disp.H_au = H_au;
		}

		if (-1 !== A_fnc.indexOf(fnc_order_softbank) == true) {
			H_disp.H_vodafone = H_vodafone;
		}

		if (-1 !== A_fnc.indexOf(fnc_order_emobile) == true) {
			H_disp.H_emobile = H_emobile;
		}

		if (-1 !== A_fnc.indexOf(fnc_order_smartphone) == true) {
			H_disp.H_smartphone = H_smartphone;
		}

		H_disp.notorder = notorder;
		return H_disp;
	}

	displaySmarty(H_sess: {} | any[], H_data: {} | any[], A_auth: {} | any[], O_order: OrderUtil) //QuickFormとSmartyの合体
	//$this->O_HeaderForm->accept( $O_headrenderer );
	//$this->O_SearchForm->accept( $O_renderer );
	//assign
	//注文メニュー
	//display
	{
		var O_headrenderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("current_script", _SERVER.PHP_SELF);
		this.get_Smarty().assign("H_sess", H_sess);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("A_auth", A_auth);

		for (var key in H_data) {
			var val = H_data[key];
			this.get_Smarty().assign(key, val);
		}

		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};