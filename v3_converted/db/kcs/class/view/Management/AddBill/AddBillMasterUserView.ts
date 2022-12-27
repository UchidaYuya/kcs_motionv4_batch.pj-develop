//error_reporting(E_ALL);
//TCPDFの読み込み
//require_once("MtSetting.php");
//
//ICCardPrintOutPersonalView
//交通費PDF出力
//@uses ViewSmarty
//@package
//@author date
//@since 2015/11/02
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("view/ViewFinish.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUtil.php");

require("MtUniqueString.php");

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
//O_Form
//フォームオブジェクト
//@var mixed
//@access protected
//
//
//__construct
//コンストラクタ
//@author web
//@since 2015/11/13
//
//@access public
//@return void
//
//
//getLocalSession
//ローカルセッションの取得
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author date
//@since 2015/11/13
//
//@access protected
//@return void
//
//
//getFormDefault
//Formの初期値の設定
//@author web
//@since 2015/12/01
//
//@access private
//@return void
//
//
//makeAddForm
//新規登録ボタンの作成
//@author web
//@since 2015/11/16
//
//@param ManagementUtil $O_manage
//@access public
//@return void
//
//
//validate
//フォームの値チェック
//@author web
//@since 2015/11/27
//
//@access public
//@return void
//
//
//freezeForm
//freece処理を行う
//@author date
//@since 2015/11/27
//
//@access public
//@return void
//
//
//unfreezeForm
//
//@author date
//@since 2015/11/27
//
//@access public
//@return void
//
//
//endAddView
//完了画面
//@author date
//@since 2015/11/27
//
//@param array $H_sess
//@access public
//@return void
//
//
//makePagingHTML
//ページリンクを作成。リンクにonClick仕込んでみた。
//@author web
//@since 2015/12/02
//
//@param mixed $list_cnt
//@param mixed $limit
//@param mixed $offset
//@access private
//@return void
//
//
//displaySmarty
//displaySmarty
//@author date
//@since 2015/11/02
//
//@param array $H_sess
//@param array $A_data
//@param array $A_auth
//@param ManagementUtil $O_manage
//@access public
//@return void
//
//
//endView
//データ設定
//@author web
//@since 2015/12/03
//
//@param mixed $userid
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class AddBillMasterUserView extends ViewSmarty {
	static PUB = "/Management";

	constructor() {
		super();
		this.RecName = "\u8A2D\u5B9A\u3059\u308B";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillMasterUserView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[AddBillMasterUserView.PUB]: this.O_Sess.getPub(AddBillMasterUserView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() //postの値
	//postとかを収納するローカルセッション
	//表示件数がセッションに無ければ作る
	//GETパラメーターは削除する
	{
		var post = undefined;

		if (_POST.length > 0) {
			if (undefined !== _POST.from_uri) {
				post = _POST;
				this.H_Local.from_uri = post.from_uri;
				delete post.from_uri;
				var local = this.O_Sess.getPub(this.H_Local.from_uri);

				if (!(undefined !== local)) {
					local = Array();
				}

				local.post = post;
				this.O_Sess.SetPub(this.H_Local.from_uri, local);
				post = undefined;
			} else {
				this.H_Local.post = _POST;
				post = _POST;
			}
		}

		if (undefined !== post.userid_view && undefined !== this.H_Dir.userid) {
			if (undefined !== post.userid) //チェックが外れてるものをリストから削除
				{
					{
						let _tmp_0 = post.userid_view;

						for (var key in _tmp_0) //チェックされてない？
						{
							var value = _tmp_0[key];

							if (!(-1 !== post.userid.indexOf(value))) //されてないのでチェック外す
								{
									delete this.H_Dir.userid[key];
								}
						}
					}
				} else //チェックされてないので全部外す(一つもチェックされてなく、_POST["userid"]がない状態)
				{
					{
						let _tmp_1 = post.userid_view;

						for (var key in _tmp_1) {
							var value = _tmp_1[key];

							if (-1 !== this.H_Dir.userid.indexOf(value)) {
								delete this.H_Dir.userid[key];
							}
						}
					}
				}
		}

		if (!!post.userid) {
			if (!!this.H_Dir.userid) //前回チェックを付けたユーザーと今回チェックを付けたユーザーの合体
				{
					this.H_Dir.userid = post.userid + this.H_Dir.userid;
				} else {
				this.H_Dir.userid = post.userid;
			}
		} else {
			if (!(undefined !== this.H_Dir.userid)) {
				this.H_Dir.userid = Array();
			}
		}

		if (undefined !== this.H_Local.limit == false) //クッキーに表示件数があればそれを使う
			{
				if (undefined !== _COOKIE.management_limit == true) {
					this.H_Local.limit = _COOKIE.management_limit;
				} else {
					this.H_Local.limit = 10;
				}
			}

		if (undefined !== post.limit) //0以上の時のみ代入する
			{
				if (post.limit > 0) {
					this.H_Local.limit = _POST.limit;
				}
			}

		if (undefined !== this.H_Local.sort == false) {
			this.H_Local.sort = "0,a";
		}

		if (!!_GET.s) {
			this.H_Local.sort = _GET.s;
		}

		if (undefined !== this.H_Local.offset == false) {
			this.H_Local.offset = 1;
		}

		if (!!_GET.p) {
			this.H_Local.offset = _GET.p;
		}

		if (undefined !== post.posttarget) {
			this.H_Dir.posttarget = _POST.posttarget;
		}

		if (undefined !== this.H_Dir.posttarget == false) {
			this.H_Dir.posttarget = 1;
		}

		if (!!_GET.pid) {
			this.H_Dir.pid = _GET.pid;
		}

		if (!this.H_Dir.pid) {
			this.H_Dir.pid = _SESSION.postid;
		}

		this.O_Sess.SetPub(AddBillMasterUserView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (!!_GET) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	getFormElement() //フォーム要素の配列作成
	{
		var elem = Array();
		elem.push({
			name: "limit",
			label: "\u8868\u793A\u4EF6\u6570",
			inputtype: "text",
			options: {
				size: "3",
				maxlength: "3"
			}
		});
		elem.push({
			name: "view",
			label: "\u8868\u793A",
			inputtype: "submit"
		});
		elem.push({
			name: "setuser",
			label: this.RecName,
			inputtype: "submit"
		});
		elem.push({
			name: "back",
			label: "\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='" + this.H_Local.from_uri + "';"
			}
		});
		return elem;
	}

	getFormDefault() {
		var default = Array();
		default.limit = this.H_Local.limit;
		return default;
	}

	makeForm() //フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//フォームに初期値設定。
	//登録するぽよ
	//smartyに設定
	{
		var element = this.getFormElement();
		var util = new QuickFormUtil("form");
		util.setFormElement(element);
		var form = util.makeFormObject();
		var default = this.getFormDefault();
		util.setDefaultsWrapper(default);
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		form.accept(render);
		this.get_Smarty().assign("O_form", render.toArray());
	}

	validate() {
		return this.O_FormUtil.validateWrapper();
	}

	freezeForm() {
		this.O_FormUtil.updateElementAttrWrapper("addsubmit", {
			value: this.RecName
		});
		this.O_FormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.O_FormUtil.freezeWrapper();
	}

	unfreezeForm() {
		this.O_FormUtil.updateElementAttrWrapper("addsubmit", {
			value: this.NextName
		});
	}

	endAddView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u53D7\u6CE8\u5185\u5BB9\u5165\u529B\u30DE\u30B9\u30BF\u306E\u767B\u9332", "/Management/AddBill/menu.php", "\u53D7\u6CE8\u5185\u5BB9\u5165\u529B\u30DE\u30B9\u30BF\u4E00\u89A7\u753B\u9762\u3078");
	}

	makePagingHTML(list_cnt, limit, offset) //ページ枚数の算出。
	//ページリンク作成
	//前のX件を付与
	{
		var page_cnt = +(list_cnt / limit);

		if (list_cnt > page_cnt * limit) {
			page_cnt++;
		}

		if (page_cnt < 10) //10ページ以下
			//ページリンクの左端の値
			{
				var page_link_cnt = page_cnt;
				var page_entry = 0;
			} else //10ページ以上
			//ページリンクの左端の値
			{
				page_link_cnt = 10;

				if (offset + 5 > page_cnt) {
					page_entry = page_cnt - 10;
				} else if (offset - 5 < 0) {
					page_entry = 0;
				} else {
					page_entry = offset - 5;
				}
			}

		var res = "";

		for (var i = 1; i <= page_link_cnt; i++) {
			var page = page_entry + i;

			if (res != "") {
				res += "&nbsp;&nbsp;";
			}

			if (page == offset) {
				res += "<a class=\"csPath\" >" + page + "</a>";
			} else {
				res += "<a onClick=\"pagelink(" + page + ")\" class=\"csPathLink2\" >" + page + "</a>";
			}
		}

		if (offset > 1) {
			page = offset - 1;
			res = "<a onClick=\"javascript:pagelink(" + page + ")\" class=\"csPathLink2\" >\u524D\u306E" + limit + "\u4EF6</a>&nbsp;" + res;
		}

		if (offset < page_cnt) {
			page = offset + 1;
			res = res + "&nbsp;<a onClick=\"javascript:pagelink(" + page + ")\" class=\"csPathLink2\" >\u6B21\u306E" + limit + "\u4EF6</a>";
		} else {
			res += "&nbsp";
		}

		return res;
	}

	displaySmarty(H_tree, tree_js, H_list, list_cnt) //$this->get_Smarty()->assign( "printdate",$printdate);
	//部署指定
	//ユーザー一覧の設定
	//ページング
	//フォームの設定
	//templateの取得
	//表示を返す・・・
	{
		this.get_Smarty().assign("H_tree", H_tree);
		this.get_Smarty().assign("tree_js", tree_js);
		this.get_Smarty().assign("posttarget", this.H_Dir.posttarget);
		this.get_Smarty().assign("H_list", H_list);
		this.get_Smarty().assign("list_cnt", list_cnt);
		this.get_Smarty().assign("userid", this.H_Dir.userid);
		var page_link = this.makePagingHTML(list_cnt, this.H_Local.limit, this.H_Local.offset);
		this.get_Smarty().assign("page_link", page_link);

		switch (this.H_Local.from_uri) {
			case "/Management/AddBill/AddBillMasterAdd.php":
				var H_link = {
					"/Management/AddBill/menu.php": "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u4E00\u89A7",
					"/Management/AddBill/AddBillMasterAdd.php": "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u767B\u9332",
					"": "\u30E6\u30FC\u30B6\u30FC\u8A2D\u5B9A"
				};
				break;

			case "/Management/AddBill/AddBillMasterMod.php":
				H_link = {
					"/Management/AddBill/menu.php": "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u4E00\u89A7",
					"/Management/AddBill/AddBillMasterMod.php": "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u5909\u66F4",
					"": "\u30E6\u30FC\u30B6\u30FC\u8A2D\u5B9A"
				};
				break;
		}

		this.get_Smarty().assign("page_path", MakePankuzuLink.makePankuzuLinkHTML(H_link, "user"));
		this.makeForm();
		var O_setting = this.getSetting();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	endView() //useridを設定する
	//セッションクリア
	{
		var userid = "";

		for (var value of Object.values(this.H_Dir.userid)) //postid:useridとなっているので、useridの部分を抜き出す
		{
			var param = value.split(":");

			if (userid != "") {
				userid += ",";
			}

			userid += param[1];
		}

		var uri = this.H_Local.from_uri;
		var local = this.O_Sess.getPub(uri);
		local.post.userid = userid;
		this.O_Sess.SetPub(uri, local);
		this.O_Sess.clearSessionSelf();
		header("Location: " + uri);
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};