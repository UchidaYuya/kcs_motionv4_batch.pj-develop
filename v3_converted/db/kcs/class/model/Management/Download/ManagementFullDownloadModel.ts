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
//@uses ManagementMenuModel
//
//
//
//全て一覧ダウンロード用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/28
//@uses ManagementMenuModel
//

require("model/Management/ManagementMenuModel.php");

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
//全て一覧のデータを生成する <br>
//
//電話一覧取得<br>
//Etc一覧取得<br>
//各データの結合<br>
//
//@author houshiyama
//@since 2008/02/26
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署一覧（上書きされる））
//@param mixed $dounload
//@access public
//@return array
//
//
//tel_tbへのSQL文のwhere句を作成する <br>
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
//card_tbへのSQL文のwhere句を作成する <br>
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
//copy_tbへのSQL文のwhere句を作成する <br>
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
//assets_tbへのSQL文のwhere句を作成する <br>
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
//transit_tbへのSQL文のwhere句を作成する <br>
//全件DLなので上位クラスのwhere句を消す為のメソッド
//
//@author houshiyama
//@since 2010/02/24
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
//@access private
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
class ManagementFullDownloadModel extends ManagementMenuModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess: {} | any[], A_post: {} | any[], download = false) //管理情報の絞込みに電話が含まれている時
	//ダウンロード時はデータ一覧のみ
	{
		var A_listsql = Array();
		var A_data = Array();
		var mid = "";

		if (undefined !== H_sess.SELF.post == false) {
			H_sess.SELF.post = Array();
		}

		if (undefined !== H_sess.SELF.post.mid == true) {
			mid = H_sess.SELF.post.mid;
		}

		var postid = H_sess[ManagementFullDownloadModel.PUB].current_postid;
		var trg = H_sess[ManagementFullDownloadModel.PUB].posttarget;
		A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid);
		this.setTableName(H_sess[ManagementFullDownloadModel.PUB].cym);

		if (-1 !== this.A_Auth.indexOf("fnc_tel_manage_vw") == true) {
			A_listsql.push(this.makeTelListSQL(A_post, H_sess.SELF.post));
		}

		if (-1 !== this.A_Auth.indexOf("fnc_etc_manage_vw") == true) {
			A_listsql.push(this.makeEtcListSQL(A_post, H_sess.SELF.post));
		}

		if (-1 !== this.A_Auth.indexOf("fnc_purch_manage_vw") == true) {
			A_listsql.push(this.makePurchListSQL(A_post, H_sess.SELF.post));
		}

		if (-1 !== this.A_Auth.indexOf("fnc_copy_manage_vw") == true) {
			A_listsql.push(this.makeCopyListSQL(A_post, H_sess.SELF.post));
		}

		if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_vw") == true) {
			A_listsql.push(this.makeAssetsListSQL(A_post, H_sess.SELF.post));
		}

		if (-1 !== this.A_Auth.indexOf("fnc_tran_manage_vw") == true) {
			A_listsql.push(this.makeTranListSQL(A_post, H_sess.SELF.post));
		}

		if (A_listsql.length > 0) {
			var listsql = A_listsql.join(" union all ") + this.makeOrderBySQL(H_sess.SELF.sort);
		}

		A_data = this.get_DB().queryHash(listsql);
		return A_data;
	}

	makeTelWhereSQL(H_post: {} | any[]) {
		var sql = " and (te.dummy_flg = false or te.dummy_flg is null) ";
		return sql;
	}

	makeEtcWhereSQL(H_post: {} | any[]) {
		var sql = " and ca.delete_flg=false ";
		return sql;
	}

	makePurchWhereSQL(H_post: {} | any[]) {
		var sql = " and pu.delete_flg=false and pu.dummy_flg=false ";
		return sql;
	}

	makeCopyWhereSQL(H_post: {} | any[]) {
		var sql = " and co.delete_flg=false and co.dummy_flg=false ";
		return sql;
	}

	makeAssetsWhereSQL(H_post: {} | any[]) {
		var sql = " and ass.delete_flg=false and ass.dummy_flg=false ";
		return sql;
	}

	makeTranWhereSQL(H_post: {} | any[]) {
		var sql = " and tr.delete_flg=false and tr.dummy_flg=false ";
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
		var sql = " order by postid,mid,manageno ";
		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};