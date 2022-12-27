//error_reporting(E_ALL);
//
//ICCardPrintOutPersonalView
//交通費PDF出力
//@uses ViewSmarty
//@package
//@author date
//@since 2015/11/02
//

require("view/Bill/AddBill/AddBillAddView.php");

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
//checkCGIParam
//
//@author date
//@since 2015/11/13
//
//@access protected
//@return void
//
//
//makePankuzuLinkHash
//パンくずリスト
//@author date
//@since 2015/11/12
//
//@access public
//@return void
//
//
//setMasterData
//postにMasterData設定する
//@author web
//@since 2015/11/27
//
//@param mixed $H_master_data
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
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class AddBillModView extends AddBillAddView {
	constructor() {
		super();
		this.RecName = "\u5909\u66F4\u3059\u308B";
		this.FuncName = "\u5909\u66F4";
	}

	checkCGIParam() //リセット
	//GETパラメーターは削除する
	{
		var menu_sess = this.O_Sess.getPub(dirname(_SERVER.PHP_SELF) + "/menu.php");
		this.menu_uri = menu_sess.menu_uri;

		if (_GET.r != "") {
			delete this.H_Local.post;
			this.O_Sess.SetSelfAll(this.H_Local);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (_GET.id != "" && _GET.id_sub != "") {
			this.H_Local.id = _GET.id;
			this.H_Local.id_sub = _GET.id_sub;
			delete this.H_Local.post;
		}

		if (_POST.length > 0) {
			this.H_Local.post = _POST;
		}

		if (!!_GET.pid) {
			this.H_Dir.pid = _GET.pid;
		}

		if (!this.H_Dir.pid) {
			this.H_Dir.pid = _SESSION.postid;
		}

		if (!!_POST) {
			this.H_Local.post = _POST;
		}

		if (!(undefined !== this.H_Local.tempid)) {
			this.H_Local.tempid = "";
		}

		if (undefined !== _POST.submit_elem) {
			if (_POST.submit_elem == "tempsubmit") {
				this.H_Local.tempid = _POST.templist;
			}
		}

		this.O_Sess.SetPub(AddBillModView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (!!_GET) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	getPankuzuLink() //return  MakePankuzuLink::makePankuzuLinkHTMLEng( $H_link,"user");
	{
		var H_link = {
			[this.menu_uri]: "\u53D7\u6CE8\u5185\u5BB9\u4E00\u89A7",
			"": "\u8FFD\u52A0\u5206\u5909\u66F4"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	setAddBillData(H_data) //postに値が入っているか確認
	//プロダクトコードはマスタIdで扱う。
	//プロダクト名はマスタIdで扱う。
	//マスタ選択
	//値設定する
	{
		if (!this.H_Local.post == false) //値が入っているなら何もしない
			{
				return;
			}

		for (var key in H_data) //その他の値入れる
		{
			var value = H_data[key];
			this.H_Local.post[key] = value;
		}

		this.H_Local.post.productcode = H_data.tempid;
		this.H_Local.post.productname = H_data.tempid;
		this.H_Local.post.templist = H_data.tempid;
		this.H_Dir.pid = H_data.postid;
		this.O_Sess.SetPub(AddBillModView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	endAddView(id, id_sub) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		var comment = "<div align='left'>";
		comment += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\u53D7\u4ED8\u756A\u53F7 " + id + "<br>";
		comment += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\u660E\u7D30\u756A\u53F7 " + id_sub;
		comment += "</div>";
		comment += "\u8FFD\u52A0\u5206\u306E\u5909\u66F4";
		O_finish.displayFinish(comment, this.menu_uri, "\u8ACB\u6C42\u4E00\u89A7\u753B\u9762\u3078");
	}

	__destruct() {
		super.__destruct();
	}

};