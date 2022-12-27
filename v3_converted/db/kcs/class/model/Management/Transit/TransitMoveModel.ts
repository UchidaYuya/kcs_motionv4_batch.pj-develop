//
//移動用Model
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementTransitModel
//
//
//
//移動用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2010/02/19
//@uses ManagementTransitModel
//

require("model/Management/Transit/ManagementTransitModel.php");

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
//移動用sql文作成
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
//選択された対象の前月分が権限下にいるかチェック
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $A_data
//@param array $A_prepostid
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
class TransitMoveModel extends ManagementTransitModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeMoveSQLProc(H_post: {} | any[], A_data: {} | any[], cym) {
		var A_sql = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) //過去分も移動
		{
			A_sql.push(this.makeTranMoveSQL(H_post.recogpostid, A_data[cnt]));

			if (undefined !== H_post.pastflg === true && "1" === H_post.pastflg) {
				A_sql.push(this.makeTranMoveSQL(H_post.recogpostid, A_data[cnt], true));
			}

			A_sql.push(this.makeTranMoveLogSQL(A_data[cnt], H_post, cym));
		}

		return A_sql;
	}

	checkPreTrgManageAuth(A_data: {} | any[], A_prepostid: {} | any[]) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //存在チェック
		{
			var res = this.checkPreTranAuth(A_data[cnt].tranid, A_data[cnt].trancoid, A_prepostid);

			if (res < 1) {
				var O_err = new ViewError();
				O_err.display("\u524D\u6708\u306B\u5B58\u5728\u3057\u306A\u3044\u904B\u9001ID\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
				throw die();
			}
		}

		return A_sql;
	}

	__destruct() {
		super.__destruct();
	}

};