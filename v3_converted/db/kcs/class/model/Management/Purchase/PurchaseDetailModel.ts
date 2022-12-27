//
//購買ID詳細表示Model
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/03/21
//@uses ManagementPurchaseModel
//
//
//
//購買ID詳細表示Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/21
//@uses ManagementPurchaseModel
//

require("model/Management/Purchase/ManagementPurchaseModel.php");

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
//削除用sql文作成
//
//@author houshiyama
//@since 2008/03/27
//
//@param array $H_H_sess
//@access public
//@return void
//
//
//購買用の設定項目取得
//
//@author houshiyama
//@since 2008/03/27
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/21
//
//@access public
//@return void
//
class PurchaseDetailModel extends ManagementPurchaseModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getDetail(H_sess) //テーブル名の決定
	//配下の部署一覧取得
	{
		var A_id = split(":", H_sess.SELF.id);
		var purchid = A_id[0];
		var purchcoid = A_id[1];
		this.setTableName(H_sess[PurchaseDetailModel.PUB].cym);
		var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.tableno);
		var H_data = this.get_db().queryRowHash(this.makePurchSelectOneSQL(purchid, purchcoid));
		var H_co = this.getPurchCoData();

		if (H_data.length > 1) //tablenoもviewに渡す
			//配下の購買IDで無ければ消す
			{
				H_data.tableno = this.H_Tb.tableno;
				H_data.purchconame = H_co[H_data.purchcoid];

				if (-1 !== A_post.indexOf(H_data.postid) == false) {
					delete H_data;
				}
			}

		return H_data;
	}

	getViewProperty() {
		var H_prop = this.getManagementProperty(PurchaseDetailModel.PURCHMID);
		return H_prop;
	}

	__destruct() {
		super.__destruct();
	}

};