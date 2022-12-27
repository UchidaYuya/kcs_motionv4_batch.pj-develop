//
//オプションテーブル（option_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//
//
//
//オプションテーブル（option_tb）からデータを取得するModel
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
//@param mixed $O_db
//@access public
//@return void
//
//
//割引サービス
//opidをキーにopnameを値にして返す
//
//@author houshiyama
//@since 2008/06/05
//
//@access public
//@return void
//
//
//割引サービス
//opidをキーにopname_engを値にして返す
//
//@author houshiyama
//@since 2008/12/09
//
//@access public
//@return void
//
//
//オプション
//opidをキーにopnameを値にして返す
//
//@author houshiyama
//@since 2008/05/21
//
//@access public
//@return void
//
//
//オプション
//opidをキーにopname_engを値にして返す
//
//@author houshiyama
//@since 2008/12/09
//
//@access public
//@return void
//
//
//getOptionNameArray
//
//@author katsushi
//@since 2008/07/25
//
//@param array $A_opid
//@access public
//@return void
//
//
//オプション、割引サービス
//opidをキーにopnameを値にして返す
//
//@author houshiyama
//@since 2008/08/15
//
//@access public
//@return void
//
//
//オプション、割引サービス
//opidをキーにopnameを値にして返す（英語）
//
//@author houshiyama
//@since 2008/08/15
//
//@access public
//@return void
//
//
//全てのオプション、割引サービスを取得 <br>
//（シリアライズを表示用に変換する時に使用） <br>
//
//@author houshiyama
//@since 2009/03/03
//
//@access public
//@return void
//
//
//全てのオプション、割引サービスを取得（英語） <br>
//（シリアライズを表示用に変換する時に使用） <br>
//
//@author houshiyama
//@since 2009/03/03
//
//@access public
//@return void
//
//
//全てのオプション、割引サービスを取得 <br>
//（シリアライズを表示用に変換する時に使用） <br>
//（英語） <br>
//
//@author houshiyama
//@since 2009/03/03
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
class OptionModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getDiscountKeyHash(carid, cirid, past = true) //キャリアのみ指定
	//idをカンマで連結し重複を除く
	{
		var sql = "select opid,opname from option_tb where discountflg=1 ";

		if ("" == cirid) {
			sql += " and carid=" + carid;
		} else {
			sql += " and carid=" + carid + " and cirid=" + cirid;
		}

		if (past == false) {
			sql += " and viewflg=true ";
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
							var key = nid + "|" + oid;
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

	getDiscountEngKeyHash(carid, cirid, past = true) //キャリアのみ指定
	//idをカンマで連結し重複を除く
	{
		var sql = "select opid,opname_eng from option_tb where discountflg=1 ";

		if ("" == cirid) {
			sql += " and carid=" + carid;
		} else {
			sql += " and carid=" + carid + " and cirid=" + cirid;
		}

		if (past == false) {
			sql += " and viewflg=true ";
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
							var key = nid + "|" + oid;
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

	getOptionKeyHash(carid, cirid, past = true) //キャリアのみ指定
	//idをカンマで連結し重複を除く
	{
		var sql = "select opid,opname from option_tb where discountflg=0 ";

		if ("" == cirid) {
			sql += " and carid=" + carid;
		} else {
			sql += " and carid=" + carid + " and cirid=" + cirid;
		}

		if (past == false) {
			sql += " and viewflg=true ";
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
							var key = nid + "|" + oid;
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

	getOptionEngKeyHash(carid, cirid, past = true) //キャリアのみ指定
	//idをカンマで連結し重複を除く
	{
		var sql = "select opid,opname_eng from option_tb where discountflg=0 ";

		if ("" == cirid) {
			sql += " and carid=" + carid;
		} else {
			sql += " and carid=" + carid + " and cirid=" + cirid;
		}

		if (past == false) {
			sql += " and viewflg=true ";
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
							var key = nid + "|" + oid;
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

	getOptionNameArray(A_opid: {} | any[]) {
		var sql = "select opname from option_tb where opid in (" + A_opid.join(",") + ") order by sort";
		return this.get_DB().queryCol(sql);
	}

	getOptionDiscountKeyHash(carid, cirid, past = true) //キャリアのみ指定
	//idをカンマで連結し重複を除く
	{
		var sql = "select opid,opname from option_tb where ";

		if ("" == cirid) {
			sql += " carid=" + carid;
		} else {
			sql += " carid=" + carid + " and cirid=" + cirid;
		}

		if (past == false) {
			sql += " and viewflg=true ";
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
							var key = nid + "|" + oid;
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

	getOptionDiscountKeyHashEng(carid, cirid, past = true) //キャリアのみ指定
	//idをカンマで連結し重複を除く
	{
		var sql = "select opid,opname_eng from option_tb where ";

		if ("" == cirid) {
			sql += " carid=" + carid;
		} else {
			sql += " carid=" + carid + " and cirid=" + cirid;
		}

		if (past == false) {
			sql += " and viewflg=true ";
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
							var key = nid + "|" + oid;
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

	getAllOptionDiscountKeyHash() {
		var sql = "select opid,opname from option_tb order by opid";
		var H_res = this.get_DB().queryAssoc(sql);
		return H_res;
	}

	getAllOptionDiscountEngKeyHash() {
		var sql = "select opid,opname_eng from option_tb order by opid";
		var H_res = this.get_DB().queryAssoc(sql);
		return H_res;
	}

	getAllOptionDiscountKeyHashEng() {
		var sql = "select opid,opname_eng from option_tb order by opid";
		var H_res = this.get_DB().queryAssoc(sql);
		return H_res;
	}

	__destruct() {
		super.__destruct();
	}

};