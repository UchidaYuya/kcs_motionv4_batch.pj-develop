//
//運送ID削除用Model
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2010/02/19
//@uses ManagementTransitModel
//
//
//
//運送ID削除用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2010/02/19
//@uses ManagementTransitModel
//

require("model/Management/Healthcare/ManagementHealthcareModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2010/02/19
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
//@since 2010/02/19
//
//@param array $H_post
//@param array $A_data
//@param mixed $cym
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class HealthcareDelModel extends ManagementHealthcareModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeDelSQL(H_post: {} | any[], A_data: {} | any[], cym) {
		var A_sql = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) {
			A_sql.push(this.makeHealthDelSQL(A_data[cnt]));
			A_sql.push(this.makeHealthDelLogSQL(A_data[cnt], H_post, cym));
		}

		return A_sql;
	}

	__destruct() {
		super.__destruct();
	}

};