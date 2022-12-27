//error_reporting(E_ALL);

require("view/Bill/AddBill/AddBillCopyBulkView.php");

//
//__construct
//
//@author web
//@since 2016/10/03
//
//@access public
//@return void
//
//
//endView
//完了画面
//@author date
//@since 2015/11/27
//
//@param array $H_sess
//@access public
//@return void
//
//
//getPankuzuLink
//
//@author web
//@since 2016/10/03
//
//@access private
//@return void
//
//
//__destruct
//
//@author web
//@since 2016/10/03
//
//@access public
//@return void
//
class AddBillCopyBulkView extends AddBillModBulkView {
	constructor() {
		this.bulk_mode = "copy";
		this.ConfirmName = "\u767B\u9332\u3059\u308B";
		super();
	}

	endView(H_sess: {} | any[], id_list: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//IDについて
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var id_text = "\u767B\u9332\u3055\u308C\u305F\u53D7\u4ED8\u756A\u53F7<br>";

		for (var value of Object.values(id_list)) {
			id_text += "\u30FB" + value.addbillid + "<br>";
		}

		id_text += "\u203B";
		id_text += "\u660E\u7D30\u756A\u53F7\u306F1\u3068\u306A\u308A\u307E\u3059";
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u53D7\u6CE8\u5185\u5BB9\u5165\u529B\u306E\u30B3\u30D4\u30FC", this.menu_uri, "\u8ACB\u6C42\u4E00\u89A7\u753B\u9762\u3078", id_text);
	}

	getPankuzuLink() {
		var H_link = {
			[this.menu_uri]: "\u53D7\u6CE8\u5185\u5BB9\u4E00\u89A7",
			"": "\u53D7\u6CE8\u5185\u5BB9\u5165\u529B\u306E\u30B3\u30D4\u30FC"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	__destruct() {
		super.__destruct();
	}

};