//
//ポイントテーブル（point_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//
//
//
//ポイントテーブル（point_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $O_db
//@access public
//@return void
//
//
//pointidをキーにpointnameを値にして返す
//
//@author houshiyama
//@since 2008/05/21
//
//@access public
//@return void
//
//
//pointidをキーにpointname_engを値にして返す
//
//@author houshiyama
//@since 2008/12/09
//
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/05/21
//
//@access public
//@return void
//
class PointModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getPointKeyHash(carid, cirid = "") //キャリアのみ指定
	//idをカンマで連結し重複を除く
	{
		var sql = "select pointid,pointname from point_tb ";

		if ("" == cirid) {
			sql += " where carid=" + carid + " ";
		} else {
			sql += " where carid=" + carid + " and cirid=" + cirid + " ";
		}

		sql += " order by sort";
		var H_res = this.get_DB().queryAssoc(sql);

		if ("" == cirid) {
			var H_data = Array();

			for (var oid in H_res) {
				var oname = H_res[oid];
				var hit = false;

				for (var nid in H_data) {
					var nname = H_data[nid];

					if (oname === nname) //IDを連結
						//重複を削除
						{
							var key = nid + "," + oid;
							H_data[key] = nname;
							delete H_data[nid];
							hit = true;
							break;
						}
				}

				if (false === hit) {
					H_data[oid] = oname;
				}
			}
		} else {
			H_data = H_res;
		}

		return H_data;
	}

	getPointEngKeyHash(carid, cirid = "") //キャリアのみ指定
	//idをカンマで連結し重複を除く
	{
		var sql = "select pointid,pointname_eng from point_tb ";

		if ("" == cirid) {
			sql += " where carid=" + carid + " ";
		} else {
			sql += " where carid=" + carid + " and cirid=" + cirid + " ";
		}

		sql += " order by sort";
		var H_res = this.get_DB().queryAssoc(sql);

		if ("" == cirid) {
			var H_data = Array();

			for (var oid in H_res) {
				var oname = H_res[oid];
				var hit = false;

				for (var nid in H_data) {
					var nname = H_data[nid];

					if (oname === nname) //IDを連結
						//重複を削除
						{
							var key = nid + "," + oid;
							H_data[key] = nname;
							delete H_data[nid];
							hit = true;
							break;
						}
				}

				if (false === hit) {
					H_data[oid] = oname;
				}
			}
		} else {
			H_data = H_res;
		}

		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};