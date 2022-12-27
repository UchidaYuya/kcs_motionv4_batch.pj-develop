//
//EV ID新規登録モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author maeda
//@since 2010/07/29
//@uses ManagementEvModel
//
//
//
//モデル実装のサンプル
//
//@package Management
//@subpackage Model
//@author maeda
//@since 2010/07/29
//@uses ManagementEvModel
//

require("model/Management/Ev/ManagementEvModel.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/29
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
//@author maeda
//@since 2010/07/29
//
//@param array $H_post
//@access public
//@return void
//
//
//既に登録済みか調べる
//
//@author maeda
//@since 2010/07/29
//
//@param mixed $H_post
//@param mixed $O_form
//@access public
//@return void
//
//
//DBが必要なデータ、権限チェックを行う <br>
//
//@author maeda
//@since 2010/07/29
//
//@param mixed $H_view
//@param array $H_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/29
//
//@access public
//@return void
//
class EvAddModel extends ManagementEvModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeAddLogSQL(H_post: {} | any[]) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var A_val = [EvAddModel.EVMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_post.evid, H_post.evid, H_post.evcoid, "EV ID\u65B0\u898F\u767B\u9332", "New EV ID", H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u65B0\u898F\u767B\u9332", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	checkInputError(H_post, O_form) {
		this.setTableName(date("Ym"));

		if (undefined !== H_post.evid == true && "" != H_post.evcoid && undefined !== H_post.flag == true) {
			if (this.checkEvExist(H_post.evid, H_post.evcoid) == true) {
				O_form.setElementErrorWrapper("evid", "\u767B\u9332\u6E08\u307F\u306EID\u3067\u3059");
			}
		}

		this.checkAddAuth(H_post);
	}

	checkDataAuth(H_view: {} | any[], H_sess: {} | any[]) {}

	__destruct() {
		super.__destruct();
	}

};