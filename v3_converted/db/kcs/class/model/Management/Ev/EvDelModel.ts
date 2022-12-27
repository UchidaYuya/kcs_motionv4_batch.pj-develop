//
//EV ID削除用Model
//
//更新履歴：<br>
//2010/07/19 前田 作成
//
//@package Management
//@subpackage Model
//@author maeda
//@filesource
//@since 2010/07/19
//@uses ManagementEvModel
//
//
//
//EV ID削除用Model
//
//@package Management
//@subpackage Model
//@author maeda
//@since 2010/07/19
//@uses ManagementEvModel
//

require("model/Management/Ev/ManagementEvModel.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/19
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
//@author maeda
//@since 2010/07/19
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
//@author maeda
//@since 2010/07/19
//
//@access public
//@return void
//
class EvDelModel extends ManagementEvModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeDelSQL(H_post: {} | any[], A_data: {} | any[], cym) {
		var A_sql = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) {
			A_sql.push(this.makeEvDelSQL(A_data[cnt]));
			A_sql.push(this.makeEvDelLogSQL(A_data[cnt], H_post, cym));
		}

		return A_sql;
	}

	__destruct() {
		super.__destruct();
	}

};