//
//管理情報トップページ用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/05/14
//@uses ManagementCopyModel
//
//
//
//モデル実装のサンプル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/05/14
//@uses ManagementCopyModel
//

require("model/Management/Copy/ManagementCopyModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/14
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
//@since 2008/05/14
//
//@param array $H_post
//@access public
//@return void
//
//
//既に登録済みか調べる
//
//@author houshiyama
//@since 2008/05/14
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
//@since 2008/05/14
//
//@access public
//@return void
//
class CopyAddModel extends ManagementCopyModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeAddLogSQL(H_post: {} | any[]) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var A_val = [CopyAddModel.COPYMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_post.copyid, H_post.copyid, H_post.copycoid, "\u30B3\u30D4\u30FC\u6A5F\u65B0\u898F\u767B\u9332", "New CopyID", H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u65B0\u898F\u767B\u9332", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	checkInputError(H_post, O_form) {
		this.setTableName(date("Ym"));

		if (undefined !== H_post.copyid == true && "" != H_post.copycoid && undefined !== H_post.flag == true) {
			if (this.checkCopyExist(H_post.copyid, H_post.copycoid) == true) {
				O_form.setElementErrorWrapper("copyid", "\u767B\u9332\u6E08\u307F\u306E\u30B3\u30D4\u30FC\u6A5F\uFF29\uFF24\u3067\u3059");
			}
		}

		this.checkAddAuth(H_post);
	}

	checkDataAuth(H_view: {} | any[], H_sess: {} | any[]) {}

	__destruct() {
		super.__destruct();
	}

};