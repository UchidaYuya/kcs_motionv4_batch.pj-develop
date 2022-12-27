//
//コピー機削除用Model
//
//更新履歴：<br>
//2008/05/14 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/05/14
//@uses ManagementCopyModel
//
//
//
//コピー機削除用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/05/14
//@uses ManagementCopyModel
//

require("model/Management/Copy/ManagementCopyModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/14
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
//@since 2008/05/14
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
//@since 2008/05/14
//
//@access public
//@return void
//
class CopyDelModel extends ManagementCopyModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeDelSQL(H_post: {} | any[], A_data: {} | any[], cym) {
		var A_sql = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) {
			A_sql.push(this.makeCopyDelSQL(A_data[cnt]));
			A_sql.push(this.makeCopyDelLogSQL(A_data[cnt], H_post, cym));
		}

		return A_sql;
	}

	__destruct() {
		super.__destruct();
	}

};