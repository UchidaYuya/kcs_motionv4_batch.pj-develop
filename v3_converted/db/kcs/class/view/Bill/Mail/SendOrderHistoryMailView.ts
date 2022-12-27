require("view/Bill/Mail/SendMailView.php");

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
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class SendOrderHistoryMailView extends SendMailView {
	constructor() {
		super();
	}

	getLocalSession() {
		var H_sess = {
			[SendOrderHistoryMailView.PUB]: this.O_Sess.getPub(SendOrderHistoryMailView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	__destruct() {
		super.__destruct();
	}

};