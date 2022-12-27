//
//移動用Model
//
//更新履歴：<br>
//2010/07/28 前田 作成
//
//@package Management
//@subpackage Model
//@author maeda
//@since 2010/07/28
//@filesource
//@uses ManagementEvModel
//
//
//
//移動用Model
//
//@package Management
//@subpackage Model
//@author maeda
//@since 2010/07/28
//@uses ManagementEvModel
//

require("model/Management/Ev/ManagementEvModel.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/28
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//移動用sql文作成
//
//@author maeda
//@since 2010/07/28
//
//@param array $H_post
//@param array $A_data
//@param mixed $cym
//@access public
//@return void
//
//
//選択された対象の前月分が権限下にいるかチェック
//
//@author maeda
//@since 2010/08/09
//
//@param array $A_data
//@param array $A_prepostid
//@access public
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/28
//
//@access public
//@return void
//
class EvMoveModel extends ManagementEvModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeMoveSQLProc(H_post: {} | any[], A_data: {} | any[], cym) {
		var A_sql = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) //過去分も移動
		{
			A_sql.push(this.makeEvMoveSQL(H_post.recogpostid, A_data[cnt]));

			if (undefined !== H_post.pastflg === true && "1" === H_post.pastflg) {
				A_sql.push(this.makeEvMoveSQL(H_post.recogpostid, A_data[cnt], true));
			}

			A_sql.push(this.makeEvMoveLogSQL(A_data[cnt], H_post, cym));
		}

		return A_sql;
	}

	checkPreTrgManageAuth(A_data: {} | any[], A_prepostid: {} | any[]) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //存在チェック
		{
			var res = this.checkPreEvAuth(A_data[cnt].evid, A_data[cnt].evcoid, A_prepostid);

			if (res < 1) {
				var O_err = new ViewError();
				O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044EV ID\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
				throw die();
			}
		}

		return A_sql;
	}

	__destruct() {
		super.__destruct();
	}

};