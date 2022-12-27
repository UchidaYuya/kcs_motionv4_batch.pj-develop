//error_reporting(E_ALL);
//
//ICCardPrintOutPersonalView
//交通費PDF出力
//@uses ViewSmarty
//@package
//@author date
//@since 2015/11/02
//

require("view/Management/AddBill/AddBillMasterAddView.php");

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
class AddBillMasterModView extends AddBillMasterAddView {
	constructor() {
		super();
	}

	checkCGIParam() //リセット
	{
		if (undefined !== _GET.tempid) {
			this.H_Local.tempid = _GET.tempid;
			delete this.H_Local.post;
			this.O_Sess.SetSelfAll(this.H_Local);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (_GET.r != "") {
			delete this.H_Local.post;
			this.O_Sess.SetSelfAll(this.H_Local);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (_POST.length > 0) {
			this.H_Local.post = _POST;
		}

		this.O_Sess.SetPub(AddBillMasterModView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	getPankuzuLink() //return  MakePankuzuLink::makePankuzuLinkHTMLEng( $H_link,"user");
	{
		var H_link = {
			"/Management/AddBill/menu.php": "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u4E00\u89A7",
			"": "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u5909\u66F4"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	setAddBillTempData(H_data, H_user) //postに値が入っているか確認
	//ユーザーID入れていく
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

		this.H_Local.post.userid = "";
		this.H_Dir.userid = Array();

		for (var value of Object.values(H_user)) {
			if (this.H_Local.post.userid != "") {
				this.H_Local.post.userid += ",";
			}

			this.H_Local.post.userid += value.userid;
			this.H_Dir.userid[value.postid + ":" + value.userid] = value.postid + ":" + value.userid;
		}

		this.O_Sess.SetPub(AddBillMasterModView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	endAddView(H_sess: {} | any[]) //セッションクリア
	//一時的に無効化。あとでコメント外しといて
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u53D7\u6CE8\u5185\u5BB9\u5165\u529B\u30DE\u30B9\u30BF\u3092\u5909\u66F4", "/Management/AddBill/menu.php", "\u53D7\u6CE8\u5185\u5BB9\u5165\u529B\u30DE\u30B9\u30BF\u4E00\u89A7\u753B\u9762\u3078");
	}

	__destruct() {
		super.__destruct();
	}

};