//
//資産削除Model
//
//更新履歴：<br>
//2008/08/12 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/08/12
//@uses ManagementAssetsModel
//
//
//
//資産除用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/08/12
//@uses ManagementAssetsModel
//

require("model/Management/Assets/ManagementAssetsModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/08/12
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
//@since 2008/08/12
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
//@since 2008/08/12
//
//@access public
//@return void
//
class AssetsDelModel extends ManagementAssetsModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	makeDelSQL(H_post: {} | any[], A_data: {} | any[], cym) {
		var A_sql = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) //携帯端末の時
		//削除記録
		{
			if (A_data[cnt].assetstypeid == 1) //携帯端末ならば紐付きも削除
				//あれば削除
				//あれば削除
				{
					var A_rel = this.getAllTelRelAssetsList(A_data[cnt].assetsid);

					if (A_rel.length > 0) {
						for (var lcnt = 0; lcnt < A_rel.length; lcnt++) {
							A_sql.push(this.makeDelTelRelAssetsSQL(A_rel[lcnt].telno, A_rel[lcnt].carid, A_rel[lcnt].assetsid));
						}
					}

					var A_reserve = this.getAllAssetsReserveList(A_data[cnt].assetsid);

					if (A_reserve.length > 0) {
						for (var acnt = 0; acnt < A_reserve.length; acnt++) //予約削除のログ
						{
							A_sql.push(this.makeDelAssetsReserveSQL(A_reserve[acnt].assetsid, A_reserve[acnt].reserve_date, A_reserve[acnt].add_edit_flg));
							A_sql.push(this.makeDelAssetsReserveLogSQL(A_reserve[acnt], "\u643A\u5E2F\u7AEF\u672B\u524A\u9664\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "\u524A\u9664"));
						}
					}

					var A_relreserve = this.getAllTelRelAssetsReserveList(A_data[cnt].assetsid);

					if (A_relreserve.length > 0) {
						for (var rcnt = 0; rcnt < A_relreserve.length; rcnt++) {
							A_sql.push(this.makeDelTelRelAssetsReserveSQL(A_relreserve[rcnt].telno, A_relreserve[rcnt].carid, A_relreserve[rcnt].assetsid, A_relreserve[rcnt].reserve_date, A_relreserve[rcnt].add_edit_flg));
						}
					}
				}

			A_sql.push(this.makeAssetsDelSQL(A_data[cnt]));
			A_sql.push(this.makeAssetsDelLogSQL(A_data[cnt], H_post, cym));
		}

		return A_sql;
	}

	__destruct() {
		super.__destruct();
	}

};