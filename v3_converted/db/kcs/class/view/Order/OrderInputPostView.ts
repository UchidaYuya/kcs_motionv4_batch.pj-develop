//
//注文必須情報入力View（部署入力）クラス
//
//更新履歴：<br>
//2008/07/18 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/07/18
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//注文必須情報入力View（部署入力）クラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/07/18
//@uses MtSetting
//@uses MtSession
//

require("model/Order/OrderInputModelBase.php");

require("view/Order/OrderInputViewBase.php");

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
//CSSを返す
//
//@author miyazawa
//@since 2008/03/07
//
//@access public
//@return string
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
//CGIパラメータのチェックを行う<br>
//
//配列をセッションに入れる<br>
//
//@author miyazawa
//@since 2008/05/15
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//注文パターンをセッションに入れる
//
//@author miyazawa
//@since 2008/06/16
//
//@param mixed $O_model
//@access protected
//@return void
//
//
//CGIパラメータから部署を取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//CGIパラメータから電話情報を取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//CGIパラメータから番号を取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//CGIパラメータから件数をカウントする
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
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
//フォームのエラーチェック作成
//
//@author miyazawa
//@since 2008/05/14
//
//@access public
//@return void
//
//
//登録部署をセッションにセット（OrderFormViewと重複している、上にまとめるべきか）
//
//@author miyazawa
//@since 2008/06/12
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access public
//@return int
//
//
//スタティック表示 <br>
//
//@author miyazawa
//@since 2008/06/16
//
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//hiddenパラメータ <br>
//
//@author miyazawa
//@since 2008/07/15
//
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/02/20
//
//@param array $H_sesstion（CGIパラメータ）
//@param array $A_auth（権限一覧）
//@param array $A_data（一覧データ）
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
class OrderInputPostView extends OrderInputViewBase {
	constructor() //英語化でテンプレートのディレクトリ変更 20090824miya
	{
		this.O_Sess = MtSession.singleton();
		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(OrderInputPostView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	getLocalSession() {
		var H_sess = {
			[OrderInputPostView.PUB]: this.O_Sess.getPub(OrderInputPostView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	clearUnderSession() //H_product を消す
	{
		this.clearLastForm();
		var A_exc = [OrderInputPostView.PUB + "/order_form.php"];
		this.O_Sess.clearSessionListPub(A_exc);
		var H_pub = this.gSess().getPub(OrderInputPostView.PUB);
		delete H_pub.H_product;
		this.gSess().setPub(OrderInputPostView.PUB, H_pub);
	}

	makePankuzuLinkHash() {
		var H_link = {
			"": this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname
		};
		return H_link;
	}

	getCSS(site_flg) {
		if (site_flg == OrderInputPostView.SITE_SHOP) {
			return "actorderDetail";
		} else {
			return "csOrder";
		}
	}

	get_View() {
		return this.H_View;
	}

	checkCGIParam() //GETパラメータ
	//getパラメータは消す
	{
		if (true == (undefined !== _GET.carid) && true == (undefined !== _GET.cirid) && true == (undefined !== _GET.type)) {
			this.H_Dir.carid = _GET.carid;
			this.H_Dir.cirid = _GET.cirid;
			this.H_Dir.type = _GET.type;
			this.H_Dir.ppid = _GET.ppid;
		}

		for (var i = 0; i < 10; i++) {
			if (true == (undefined !== _POST["telno" + i])) {
				this.H_Local["telno" + i] = _POST["telno" + i];
			}
		}

		this.switchCarrier(_POST);

		if (true == (undefined !== _POST.telcount)) {
			this.H_Dir.telcount = _POST.telcount;
		}

		if (true == (undefined !== _POST.recogpostid)) {
			this.H_Dir.recogpostid = _POST.recogpostid;
		}

		if (true == (undefined !== _POST.recogpostname)) {
			this.H_Dir.recogpostname = _POST.recogpostname;
		}

		this.O_Sess.setPub(OrderInputPostView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	setOrderPatternSession(O_model: OrderInputModelBase) //表示するキャリア名、注文種別をセットしてしまう
	{
		var orderpatern = O_model.getOrderPatternName(this.H_Dir);
		this.H_Dir.carname = orderpatern.carname;
		this.H_Dir.ptnname = orderpatern.ptnname;
		this.H_Dir.shopid = orderpatern.shopid;
		this.H_Dir.memid = orderpatern.memid;
		this.H_Dir.tplfile = orderpatern.tplfile;
		delete this.H_Dir.H_product;
		delete this.H_Dir.price_detailid;
		this.O_Sess.setPub(OrderInputPostView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	setRecogPost() {
		this.H_Dir.recogpostid = this.H_View.recogpostid;
		this.H_Dir.recogpostname = this.H_View.recogpostname;
		this.O_Sess.setPub(OrderInputPostView.PUB, this.H_Dir);
	}

	checkCGIParamNewOrder() {
		var H_telnos = Array();
		return H_telnos;
	}

	setTelInfoSession(H_info) //1件目がなければエラー
	{
		if (false == (undefined !== H_info.telno0)) {
			return false;
		}

		this.H_Dir.telinfo = H_info;
		this.H_Dir.telcount = H_info.length;
		this.O_Sess.setPub(OrderInputPostView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	checkCGIParamTelno() {
		var H_telnos = Array();

		for (var i = 0; i < 10; i++) {
			var telno = "";
			telno = _POST["telno" + i].replace(/ /g, "");
			telno = telno.replace(/\-/g, "");
			telno = telno.replace(/\(/g, "");
			telno = telno.replace(/\)/g, "");

			if (telno != "" && telno != undefined) {
				H_telnos[i] = telno;
			}
		}

		return H_telnos;
	}

	countTel(H_telnos = Array()) {
		var telcount = H_telnos.length;
		return telcount;
	}

	makeInputForm(O_order, O_model, H_sess: {} | any[], H_g_sess) //件数
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//戻りのためのデフォルト値
	{
		var H_selectval = Array();

		for (var i = 1; i <= 10; i++) {
			H_selectval[i] = i;
		}

		var carList = O_model.getOtherCarrierList(H_g_sess.pactid, H_g_sess.postid, true, false);
		var A_formelement = [{
			name: "telcount",
			label: "\u4EF6\u6570",
			inputtype: "select",
			data: H_selectval
		}, {
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
		}, {
			name: "othercarid",
			label: "\u30AD\u30E3\u30EA\u30A2",
			inputtype: "select",
			data: carList
		}];
		this.H_View.O_InputFormUtil = new QuickFormUtil("form");
		this.H_View.O_InputFormUtil.setFormElement(A_formelement);
		this.O_InputForm = this.H_View.O_InputFormUtil.makeFormObject();
		var H_def = Array();

		if (true == Array.isArray(H_sess[OrderInputPostView.PUB])) {
			if ("" != H_sess[OrderInputPostView.PUB].recogpostid) {
				H_def.recogpostid = H_sess[OrderInputPostView.PUB].recogpostid;
			}

			if ("" != H_sess[OrderInputPostView.PUB].recogpostname) {
				H_def.recogpostname = H_sess[OrderInputPostView.PUB].recogpostname;
				this.H_View.recogpostname = H_sess[OrderInputPostView.PUB].recogpostname;
			}

			if ("" != H_sess[OrderInputPostView.PUB].telcount) {
				H_def.telcount = H_sess[OrderInputPostView.PUB].telcount;
			}

			this.O_InputForm.setConstants(H_def);
		}
	}

	makeInputRule() {
		var session = this.O_Sess.getPub(OrderInputPostView.PUB);

		if (OrderInputPostView.OTHER_CARID == session.carid) {
			this.H_View.O_InputFormUtil.O_Form.addRule("othercarid", "\u30AD\u30E3\u30EA\u30A2\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044", "required", undefined, "client");
		}
	}

	makeRecogPostid(H_sess, H_g_sess) //機種変更、移行、付属品は電話の所属部署の住所を取得（付属品は電話番号入力が独立していないので除外していたが、第二階層のためにまた入れた 20060508miya）
	//一件のとき→電話の所属部署を取得
	//複数件のとき→ログインユーザの部署を取得
	//※第二階層権限を持つユーザはデフォルト値を第二階層部署の住所とする	***** ←未実装 *****
	{
		var type = H_sess[OrderInputPostView.PUB].type;
		var telcount = H_sess[OrderInputPostView.PUB].telcount;
		var telinfo_postid = H_sess[OrderInputPostView.PUB].telinfo.telno0.postid;

		if (telinfo_postid != "" && -1 !== ["C", "S", "A"].indexOf(type) == true && telcount == 1) {
			var recogpostid = telinfo_postid;
		} else if ("" != H_sess[OrderInputPostView.PUB].recogpostid && true == (-1 !== ["N"].indexOf(type))) //選択された部署
			{
				recogpostid = H_sess[OrderInputPostView.PUB].recogpostid;
			} else {
			recogpostid = H_g_sess.postid;
		}

		return recogpostid;
	}

	makeFormStatic(H_g_sess: {} | any[]) //スタティック表示部分
	{
		this.H_View.O_InputFormUtil.O_Form.addElement("header", "ptn", this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname);
		this.H_View.O_InputFormUtil.O_Form.addElement("header", "comp", H_g_sess.compname);
		this.H_View.O_InputFormUtil.O_Form.addElement("header", "loginname", H_g_sess.loginname);
	}

	makeHiddenParam() //登録部署
	{
		this.H_View.O_InputFormUtil.O_Form.addElement("hidden", "recogpostname", this.H_View.recogpostname);
		this.H_View.O_InputFormUtil.O_Form.addElement("hidden", "recogpostid", this.H_View.recogpostid);
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[]) //QuickFormとSmartyの合体
	//英語化権限 20090210miya
	//assign
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_InputForm.accept(O_renderer);
		var H_g_sess = this.getGlobalSession();

		if ("ENG" == H_g_sess.language) {
			var eng = true;
		} else {
			eng = false;
		}

		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("css", this.H_View.css);
		this.get_Smarty().assign("cssTh", this.H_View.css + "Th");
		this.get_Smarty().assign("O_form", O_renderer.toArray());

		if ("shop" == MT_SITE) {
			this.get_Smarty().assign("title", this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname);
			this.get_Smarty().assign("shop_submenu", this.H_View.pankuzu_link);
			this.get_Smarty().assign("shop_person", this.gSess().name + " " + this.gSess().personname);
		}

		this.get_Smarty().assign("carname", H_sess[OrderInputPostView.PUB].carname);
		this.get_Smarty().assign("ptnname", H_sess[OrderInputPostView.PUB].ptnname);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js_show_hide", "ShowHide();");
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("recogpostname", this.H_View.recogpostname);
		this.get_Smarty().assign("eng", eng);
		this.get_Smarty().assign("carid", H_sess[OrderInputPostView.PUB].carid);
		var smarty_template = "input_post.tpl";
		this.get_Smarty().display(smarty_template);
	}

	__destruct() {
		super.__destruct();
	}

};