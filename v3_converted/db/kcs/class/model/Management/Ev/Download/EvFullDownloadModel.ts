//
//EV ID一覧ダウンロード用Model
//
//更新履歴：<br>
//2010/07/29 前田 作成
//
//@package Management
//@subpackage Model
//@author maeda
//@filesource
//@since 2010/07/29
//@uses ManagementEvMenuModel
//
//
//
//EV ID一覧ダウンロード用Model
//
//@package Management
//@subpackage Model
//@author maeda
//@since 2010/07/29
//@uses ManagementEvMenuModel
//

require("model/Management/Ev/ManagementEvMenuModel.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/29
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//ev_tbへのSQL文のwhere句を作成する <br>
//全件DLなので上位クラスのwhere句を消す為のメソッド
//
//@author maeda
//@since 2010/07/29
//
//@param array $H_post
//@access protected
//@return void
//
//
//部署の絞込み部分のSQL作成 <br>
//全件DLなので上位クラスのwhere句を消す為のメソッド
//
//@author maeda
//@since 2010/07/29
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
//@author maeda
//@since 2010/07/29
//
//@param mixed $sort
//@access protected
//@return string
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
class EvFullDownloadModel extends ManagementEvMenuModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeEvWhereSQL(H_post: {} | any[]) {
		var sql = " and ev.delete_flg=false ";
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
		var sql = " order by ev.postid,ev.evid,ev.evcoid ";
		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};