//
//EV ID詳細表示Model
//
//更新履歴：<br>
//2010/07/23 前田 作成
//
//@package Management
//@subpackage Model
//@author maeda
//@filesource
//@since 2010/07/23
//@uses ManagementEvModel
//
//
//
//EV ID詳細表示Model
//
//@package Management
//@subpackage Model
//@author maeda
//@since 2010/07/23
//@uses ManagementEvModel
//

require("model/Management/Ev/ManagementEvModel.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/23
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//sql文作成
//
//@author maeda
//@since 2010/07/23
//
//@param array $H_sess
//@access public
//@return void
//
//
//EV用の設定項目取得
//
//@author maeda
//@since 2010/07/23
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/23
//
//@access public
//@return void
//
class EvDetailModel extends ManagementEvModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getDetail(H_sess) //テーブル名の決定
	//配下の部署一覧取得
	{
		var A_id = split(":", H_sess.SELF.id);
		var evid = A_id[0];
		var evcoid = A_id[1];
		this.setTableName(H_sess[EvDetailModel.PUB].cym);
		var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.tableno);
		var H_data = this.get_db().queryRowHash(this.makeEvSelectOneSQL(evid, evcoid));
		var H_co = this.getEvCoData();

		if (H_data.length > 1) //tablenoもviewに渡す
			//配下のEV IDで無ければ消す
			{
				H_data.tableno = this.H_Tb.tableno;
				H_data.evconame = H_co[H_data.evcoid];

				if (-1 !== A_post.indexOf(H_data.postid) == false) {
					delete H_data;
				}
			}

		return H_data;
	}

	getViewProperty() {
		var H_prop = this.getManagementProperty(EvDetailModel.EVMID);
		return H_prop;
	}

	__destruct() {
		super.__destruct();
	}

};