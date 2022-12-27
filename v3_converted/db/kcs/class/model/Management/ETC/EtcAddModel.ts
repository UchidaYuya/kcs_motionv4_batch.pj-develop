//
//ETC新規登録Model
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/04/03
//@uses ManagementEtcModel
//
//
//
//ETC新規登録Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/04/03
//@uses ManagementEtcModel
//

require("model/Management/ETC/ManagementEtcModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/04/03
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param MtOutput $O_manage
//@access public
//@return void
//
//
//管理記録用insert文作成
//
//@author houshiyama
//@since 2008/04/03
//
//@param array $H_post
//@access public
//@return void
//
//
//既に登録済みか調べる
//
//@author houshiyama
//@since 2008/04/03
//
//@param mixed $H_post
//@param mixed $O_form
//@access public
//@return void
//
//
//DBが必要なデータ、権限チェックを行う <br>
//
//@author houshiyama
//@since 2008/08/01
//
//@param mixed $H_view
//@param array $H_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/03
//
//@access public
//@return void
//
class EtcAddModel extends ManagementEtcModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeAddLogSQL(H_post: {} | any[]) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var A_val = [EtcAddModel.ETCMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, this.O_Manage.convertNoView(H_post.cardno_view), H_post.cardno_view, H_post.purchcoid, "\u30AB\u30FC\u30C9\u65B0\u898F\u767B\u9332", "New card", H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u65B0\u898F\u767B\u9332", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	checkInputError(H_post, O_form) {
		this.setTableName(date("Ym"));

		if (undefined !== H_post.cardno_view == true && "" != H_post.cardno_view && undefined !== H_post.flag == true) {
			if (this.checkEtcExist(this.O_Manage.convertNoView(H_post.cardno_view)) == true) {
				O_form.setElementErrorWrapper("cardno_view", "\u767B\u9332\u6E08\u307F\u306EETC\u30AB\u30FC\u30C9\u756A\u53F7\u3067\u3059");
			}
		}

		this.checkAddAuth(H_post);
	}

	checkDataAuth(H_view: {} | any[], H_sess: {} | any[]) {}

	__destruct() {
		super.__destruct();
	}

};