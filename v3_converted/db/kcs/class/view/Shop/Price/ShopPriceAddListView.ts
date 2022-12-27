//
//ショップ：価格表リレーション登録
//
//更新履歴：<br>
//2008/07/18 石崎公久 作成
//
//@uses ViewSmarty
//@package Price
//@subpackage View
//@author ishizaki <ishizaki@motion.co.jp>
//@since 2008/07/18
//
//
//error_reporting(E_ALL);
//
//ショップ：価格表登録
//
//@uses ViewSmarty
//@package Price
//@subpackage View
//@author ishizaki
//@since 2008/02/08
//

require("MtSession.php");

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("view/MakePankuzuLink.php");

//
//H_assign
//
//@var mixed
//@access private
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//PricelistID
//
//@var mixed
//@access private
//
//
//Mode
//
//@var mixed
//@access private
//
//
//A_postid
//
//@var mixed
//@access private
//
//
//PactID
//
//@var mixed
//@access private
//
//
//getPostlist
//
//@author ishizaki
//@since 2008/08/08
//
//@access public
//@return void
//
//
//setPostlist
//
//@author ishizaki
//@since 2008/08/11
//
//@param mixed $A_postlist
//@access public
//@return void
//
//
//displayFinish
//
//@author ishizaki
//@since 2008/08/11
//
//@access public
//@return void
//
//
//getMode
//
//@author ishizaki
//@since 2008/08/06
//
//@access public
//@return void
//
//
//getPactID
//
//@author ishizaki
//@since 2008/08/07
//
//@access public
//@return void
//
//
//setPactID
//
//@author ishizaki
//@since 2008/08/11
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getPricelistID
//
//@author ishizaki
//@since 2008/08/11
//
//@access public
//@return void
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//CGIパラメータのチェックを行う
//
//セッションにCGIパラメーターを付加する<br/>
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//setAssign
//
//@author ishizaki
//@since 2008/08/08
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//displaySmarty
//
//@author ishizaki
//@since 2008/07/18
//
//@param mixed $A_stocklist
//@access public
//@return void
//
//
//assignSmarty
//
//@author ishizaki
//@since 2008/07/18
//
//@access private
//@return void
//
//
//displayPactHTML
//
//@author ishizaki
//@since 2008/08/06
//
//@param mixed $H_pactname
//@param mixed $H_pactfunc
//@access public
//@return void
//
//
//displayPactConfHTML
//
//@author ishizaki
//@since 2008/08/07
//
//@param mixed $H_pactname
//@access public
//@return void
//
//
//displayPostConfHTML
//
//@author ishizaki
//@since 2008/08/08
//
//@access public
//@return void
//
//
//displayPostHTML
//
//@author ishizaki
//@since 2008/08/07
//
//@param mixed $H_post_all
//@param mixed $H_post_incarid
//@access public
//@return void
//
//
//clearSessSelf
//
//@author ishizaki
//@since 2008/08/11
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class ShopPriceAddListView extends ViewSmarty {
	getPostlist() {
		return this.A_postid;
	}

	setPostlist(A_postlist) {
		this.A_postid = A_postlist;
	}

	displayFinish() //二重登録を防止
	//完了画面
	{
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u63B2\u8F09\u90E8\u7F72\u8A2D\u5B9A", "/Shop/MTPrice/menu.php", "\u4FA1\u683C\u8868\u4E00\u89A7");
	}

	getMode() {
		return this.Mode;
	}

	getPactID() {
		return this.PactID;
	}

	setPactID(pactid) {
		this.PactID = pactid;
	}

	getPricelistID() {
		return this.PricelistID;
	}

	constructor(H_navi) //ショップ属性を付ける
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.H_postdata = Array();
		this.O_Sess = MtSession.singleton();
		this.H_assign.title = "\u4FA1\u683C\u8868\u767B\u9332";
		this.H_assign.shop_person = this.gSess().name + " " + this.gSess().personname;
		this.H_assign.shop_submenu = MakePankuzuLink.makePankuzuLinkHTML(H_navi, "shop");
		this.H_assign.H_jsfile = ["shopPriceSelect.js"];
	}

	checkCGIParam() //メニューから
	{
		if (true == (undefined !== _GET.pricelistid)) {
			this.O_Sess.setSelf("PricelistID", _GET.pricelistid);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.PricelistID = this.O_Sess.getSelf("PricelistID");

		if (true == is_null(this.PricelistID)) {
			header("Location: /Shop/MTPrice/menu.php");
			throw die(0);
		}

		if (true == (undefined !== _GET.pactid)) {
			this.O_Sess.setSelf("pactid", _GET.pactid);
			this.O_Sess.setSelf("mode", "post");
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == (undefined !== _POST.mode) && "pactconf" == _POST.mode) {
			this.O_Sess.setSelf("A_pactlist", _POST.pactid);
			this.O_Sess.setSelf("mode", _POST.mode);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		if (true == (undefined !== _POST.mode) && "postconf" == _POST.mode) {
			this.O_Sess.setSelf("A_postlist", _POST.postid);
			this.O_Sess.setSelf("mode", _POST.mode);
			header("Location: " + _SERVER.PHP_SELF);
		}

		if (true == (undefined !== _POST.mode) && ("pact" == _POST.mode || "registpact" == _POST.mode || "post" == _POST.mode || "registpost" == _POST.mode)) {
			this.O_Sess.setSelf("mode", _POST.mode);
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		this.Mode = this.O_Sess.getSelf("mode");
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	displaySmarty(err_str) {
		this.assignSmarty();
		this.get_Smarty().assign("err_str", err_str);
		this.get_Smarty().display(this.get_Smarty().template_dir + "/select_pact.tpl");
		throw die(0);
	}

	assignSmarty() {
		{
			let _tmp_0 = this.H_assign;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				this.get_Smarty().assign(key, value);
			}
		}
	}

	displayPactHTML(H_pactname, H_pactfunc) //データベースからのデファルとチェック
	{
		this.O_Sess.setSelf("mode", undefined);
		this.assignSmarty();
		var A_pactlist = Object.keys(H_pactname);
		var pactlist_count = A_pactlist.length;
		var pactlist_mod = +(pactlist_count % 3);

		for (var i = pactlist_mod; i < 3; i++) {
			A_pactlist.push("");
		}

		this.get_Smarty().assign("A_pactlist", A_pactlist);

		if (false == is_null(this.O_Sess.getSelf("A_pactlist"))) {
			this.get_Smarty().assign("A_checked", this.O_Sess.getSelf("A_pactlist"));
		} else if (false == is_null(this.H_assign.A_pactid)) {
			this.get_Smarty().assign("A_checked", array_combine(this.H_assign.A_pactid, this.H_assign.A_pactid));
		}

		this.get_Smarty().assign("H_pactname", H_pactname);
		this.get_Smarty().assign("H_pactfunc", H_pactfunc);
		this.get_Smarty().display(this.get_Smarty().template_dir + "/select_pact.tpl");
	}

	displayPactConfHTML(H_pactname) {
		this.assignSmarty();
		this.get_Smarty().assign("type", "conf");
		this.get_Smarty().assign("H_pactname", H_pactname);
		this.get_Smarty().assign("A_pactlist", this.O_Sess.getSelf("A_pactlist"));
		this.get_Smarty().display(this.get_Smarty().template_dir + "/select_pact.tpl");
	}

	displayPostConfHTML() {
		this.H_assign.type = "conf";
		this.H_assign.A_postlist = this.O_Sess.getSelf("A_postlist");
		this.assignSmarty();
		this.get_Smarty().display(this.get_Smarty().template_dir + "/select_post.tpl");
	}

	displayPostHTML(H_post_all, H_post_incarid, compname) {
		var A_postid = this.O_Sess.getSelf("A_postlist");

		if (false == is_null(A_postid)) {
			var H_selected_postlist = A_postid;
		} else if (false == is_null(this.H_assign.A_postid)) {
			H_selected_postlist = array_combine(this.H_assign.A_postid, this.H_assign.A_postid);
		}

		var check_box_tree = "";
		var count_H_post_all = H_post_all.length;

		for (var cnt = 0; cnt < count_H_post_all; cnt++) {
			if (true == (undefined !== H_post_incarid[H_post_all[cnt].postidchild])) //セッションからデフォルトを入れる
				//ユーザー部署コードがある場合は表示
				{
					check_box_tree += "<tr>\n<td bgcolor=\"whitesmoke\" colspan=\"2\">";

					for (var tabcnt = 0; tabcnt < H_post_all[cnt].level; tabcnt++) {
						check_box_tree += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					}

					check_box_tree += "<input name=\"postid[" + H_post_all[cnt].postidchild + "]\" type=\"checkbox\" value=\"1\" ";

					if (true == (undefined !== H_selected_postlist) && false == is_null(H_selected_postlist[H_post_all[cnt].postidchild])) {
						check_box_tree += "checked";
					}

					check_box_tree += " />&nbsp;" + H_post_all[cnt].postname;

					if (H_post_all[cnt].userpostid != "") {
						check_box_tree += "(" + H_post_all[cnt].userpostid + ")";
					}

					check_box_tree += "</td>\n</tr>";
				} else //ユーザー部署コードがある場合は表示
				{
					check_box_tree += "<tr>\n<td bgcolor=\"whitesmoke\" colspan=\"2\">";

					for (tabcnt = 0;; tabcnt < H_post_all[cnt].level; tabcnt++) {
						check_box_tree += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					}

					check_box_tree += "&nbsp;[-]&nbsp;" + H_post_all[cnt].postname;

					if (H_post_all[cnt].userpostid != "") {
						check_box_tree += "(" + H_post_all[cnt].userpostid + ")";
					}

					check_box_tree += "</td>\n</tr>";
				}
		}

		this.assignSmarty();
		this.get_Smarty().assign("compname", compname);
		this.get_Smarty().assign("check_box_tree", check_box_tree);
		this.get_Smarty().display(this.get_Smarty().template_dir + "/select_post.tpl");
	}

	clearSessSelf() {
		this.O_Sess.clearSessionSelf();
	}

	__destruct() {
		super.__destruct();
	}

};