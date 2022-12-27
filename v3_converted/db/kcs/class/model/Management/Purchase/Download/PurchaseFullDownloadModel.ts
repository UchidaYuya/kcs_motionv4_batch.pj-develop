//
//全て一覧ダウンロード用Model
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/03/28
//@uses ManagementPurchaseMenuModel
//
//
//
//全て一覧ダウンロード用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/28
//@uses ManagementPurchaseMenuModel
//

require("model/Management/Purchase/ManagementPurchaseMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/28
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//purchase_tbへのSQL文のwhere句を作成する <br>
//全件DLなので上位クラスのwhere句を消す為のメソッド
//
//@author houshiyama
//@since 2008/03/31
//
//@param array $H_post
//@access protected
//@return void
//
//
//部署の絞込み部分のSQL作成 <br>
//全件DLなので上位クラスのwhere句を消す為のメソッド
//
//@author houshiyama
//@since 2008/02/27
//
//@param array $A_post
//@param mixed $tb
//@access protected
//@return string
//
//
//オーダー句のSQL文を作成する
//全件DLなので上位クラスのorder句を消す為のメソッド
//
//@author houshiyama
//@since 2008/03/04
//
//@param mixed $sortt
//@access protected
//@return string
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/28
//
//@access public
//@return void
//
class PurchaseFullDownloadModel extends ManagementPurchaseMenuModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makePurchWhereSQL(H_post: {} | any[]) {
		var sql = " and pu.delete_flg=false ";
		return sql;
	}

	makePostWhereSQL(A_post, tb) //部署を取得していなければここで取得
	{
		if (A_post.length <= 1) {
			A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid);
		}

		var sql = tb + ".postid in (" + A_post.join(",") + ") ";
		return sql;
	}

	makeOrderBySQL(sort) {
		var sql = " order by pu.postid,pu.purchid,pu.purchcoid ";
		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};