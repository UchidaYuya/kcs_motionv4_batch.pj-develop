//
//管理情報トップページ用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/06/06
//@uses ManagementAssetsModel
//
//
//
//モデル実装のサンプル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/06/06
//@uses ManagementAssetsModel
//

require("model/Management/Assets/ManagementAssetsModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/06/06
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
//@since 2008/06/06
//
//@param array $H_post
//@access public
//@return void
//
//
//既に登録済みか調べる
//
//@author houshiyama
//@since 2008/06/06
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
//@since 2008/06/06
//
//@access public
//@return void
//
class AssetsAddModel extends ManagementAssetsModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeAddLogSQL(H_post: {} | any[]) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var A_val = [AssetsAddModel.ASSMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_post.assetsno, H_post.assetsno, H_post.assetstypeid, "\u8CC7\u7523\u65B0\u898F\u767B\u9332", "New Assets", H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u65B0\u898F\u767B\u9332", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	checkInputError(H_post, O_form) {
		this.setTableName(this.YM);

		if (undefined !== H_post.assetsno == true && "" != H_post.assetstypeid && undefined !== H_post.flag == true) {
			if (this.checkAssetsNoExist(H_post.assetsno, "add") == true) {
				if (this.H_G_Sess.language == "ENG") {
					O_form.setElementErrorWrapper("assetsno", "Management No. has already been registered.");
				} else {
					O_form.setElementErrorWrapper("assetsno", "\u767B\u9332\u6E08\u307F\u306E\u7BA1\u7406\u756A\u53F7\u3067\u3059");
				}
			}
		}
	}

	checkDataAuth(H_view: {} | any[], H_sess: {} | any[]) {}

	__destruct() {
		super.__destruct();
	}

};