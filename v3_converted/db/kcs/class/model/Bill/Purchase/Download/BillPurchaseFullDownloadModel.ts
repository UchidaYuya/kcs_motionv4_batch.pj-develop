//
//購買ID詳細表示Model
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/04/17
//@uses BillPurchaseMenuModel
//
//
//
//購買ID詳細表示Model
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2008/04/17
//@uses BillPurchaseMenuModel
//

require("model/Bill/Purchase/BillPurchaseMenuModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/21
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//一覧データ取得
//
//@author houshiyama
//@since 2008/04/17
//
//@param array $H_sess
//@param mixed $download
//@access public
//@return void
//
//
//請求部署単位の部署ID、flag部分のSQLを返す <br>
//選択部署はflag=0、配下部署はflag=1 <br>
//
//@author houshiyama
//@since 2008/04/23
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $tb
//@access private
//@return void
//
//
//請求部署単位のwhere句作成
//
//@author houshiyama
//@since 2008/04/17
//
//@param mixed $H_post
//@access private
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/17
//
//@access public
//@return void
//
class BillPurchaseFullDownloadModel extends BillPurchaseMenuModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, download = true, O_view = undefined) //選択された部署ID
	//テーブル名の決定
	//配下部署一覧
	//フォーム入力値
	//データ取得
	{
		var postid = H_sess[BillPurchaseFullDownloadModel.PUB].current_postid;
		this.setTableName(H_sess[BillPurchaseFullDownloadModel.PUB].cym);
		var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, postid, this.H_Tb.tableno);
		var H_post = H_sess.SELF.post;
		H_post.purchcoid = H_sess.SELF.purchcoid;
		var A_data = Array();
		A_data = this.get_DB().queryHash(this.makePostBillDataSQL(A_post, postid, H_post, H_sess.SELF.sort));
		return A_data;
	}

	makePostBillPostidWhereSQL(A_post, postid, tb) //部署一覧から選択部署を除く
	{
		if (-1 !== A_post.indexOf(postid) === true) {
			delete A_post[array_search(postid, A_post)];
		}

		var sql = "((" + this.makeCommonWhereSQL(A_post, postid, tb, 2) + " and " + tb + ".flag='0')" + " or " + "(" + this.makeCommonWhereSQL(A_post, postid, tb, 0) + " and " + tb + ".flag='1'))";
		return sql;
	}

	makePostBillWhereSQL(H_post) //請求元
	{
		var A_where = Array();
		A_where.push("ppb.purchcoid=" + H_post.purchcoid);
		return A_where.join(" and ");
	}

	__destruct() {
		super.__destruct();
	}

};