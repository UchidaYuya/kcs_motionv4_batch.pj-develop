//
//MiscTypeModel
//その他の内容の取得
//@uses ModelBase
//@package
//@author web
//@since 2018/09/06
//

require("model/ModelBase.php");

//
//__construct
//
//@author web
//@since 2018/09/06
//
//@access public
//@return void
//
//
//getMiscTypeAll
//その他の内容を全て返す
//@author web
//@since 2018/09/06
//
//@access public
//@return void
//
//
//getMiscTypeAll
//
//@author web
//@since 2018/09/28
//
//@param mixed $carid
//@access public
//@return void
//
//
//getConfigurableCarrier
//設定可能なキャリアを返す
//@author web
//@since 2018/10/03
//
//@access public
//@return void
//
//
//getMiscType
//指定されたgroup、pactid、caridのその他の内容を取得する
//@author web
//@since 2018/09/19
//
//@param mixed $groupid
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//update
//対象で更新する
//@author web
//@since 2018/09/20
//
//@param mixed $groupid
//@param mixed $pactid
//@param mixed $carid
//@param mixed $data
//@access public
//@return void
//
//
//getSwitch
//指定したグループ、会社が、固有のその他内容を使うか調べる
//@author web
//@since 2018/09/25
//
//@param mixed $groupid
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//insertSwitch
//switch追加。既にレコードがある場合はinsertしない
//@author web
//@since 2018/09/21
//
//@param mixed $groupid
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//deleteSwitch
//
//@author web
//@since 2018/09/21
//
//@param mixed $groupid
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//updateSwitch
//更新する
//@author web
//@since 2018/09/21
//
//@param mixed $groupid
//@param mixed $pactid
//@param mixed $carid
//@param mixed $switch
//@access public
//@return void
//
//
//getMiscTypeForSelect
//formのセレクトの内容を取得
//@author web
//@since 2018/09/06
//
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author web
//@since 2018/09/06
//
//@access public
//@return void
//
class MiscModel extends ModelBase {
	constructor() {
		super();
	}

	getMiscTypeName(groupid, carid = 0) //キャリアの指定がされているならやる(ドコモ監査対応でドコモのみ表示することがあるよ・・
	//nullとか帰ってきたら困るので、データがなければ空の配列渡す
	{
		var _groupid = this.get_DB().dbQuote(groupid, "integer", true);

		var sql_where = "";

		if (carid != 0) {
			sql_where = "carid=" + this.get_DB().dbQuote(carid, "integer", true);
		}

		if (sql_where != "") {
			sql_where = " WHERE " + sql_where + " ";
		}

		var sql = "SELECT" + " name" + " FROM misctype_tb" + sql_where + " GROUP BY" + " name";
		var res = this.get_DB().queryCol(sql);

		if (!res) {
			return Array();
		}

		return res;
	}

	getMiscTypeByCarid(carid) {
		var sql = "SELECT" + " miscid" + ",name" + " FROM misctype_tb" + " WHERE" + " carid=" + this.get_DB().dbQuote(carid, "integer", true) + " ORDER BY" + " miscid";
		return this.get_DB().queryHash(sql);
	}

	getConfigurableCarrierId() {
		var sql = "SELECT" + " car.carid" + ",car.carname" + " FROM" + " carrier_tb car" + " JOIN misctype_switch_tb switch ON switch.groupid = 0 AND car.carid = switch.carid" + " ORDER BY" + " car.defaultflg DESC" + ",car.carid";
		return this.get_DB().queryKeyAssoc(sql);
	}

	getMiscType(groupid, pactid, carid, is_unique_only = true) //各数値をquoteする
	//使用するその他の内容を取得する
	//デフォルト値か、個別設定を使うか
	//優先度・・会社ごとの設定、グループごとの設定、デフォルト値
	//表示するその他の内容を取得
	{
		var _groupid = this.get_DB().dbQuote(groupid, "integer", true);

		var _pactid = this.get_DB().dbQuote(pactid, "integer", true);

		var _carid = this.get_DB().dbQuote(carid, "integer", true);

		if (is_unique_only) //switchがない場合でも、強制的に固有値を取得する
			{
				var sql_switch = "SELECT " + _groupid + " AS groupid" + "," + _pactid + " AS pactid" + "," + _carid + " AS carid";
			} else {
			sql_switch = "SELECT" + " groupid" + ",pactid" + ",carid" + " FROM misctype_switch_tb" + " WHERE" + " (groupid = 0 or groupid = " + _groupid + ")" + " AND ( pactid = 0 or pactid = " + _pactid + " )" + " AND ( carid = 0 or carid = " + _carid + " )" + " ORDER BY" + " carid desc" + ",groupid desc" + ",pactid desc" + " LIMIT 1";
		}

		var sql = "SELECT" + " rel.groupid" + ",rel.pactid" + ",rel.miscid" + ",misc.name" + ",misc.carid" + " FROM misctype_rel_tb AS rel" + " JOIN (" + sql_switch + ") AS switch ON switch.groupid = rel.groupid AND switch.pactid = rel.pactid" + " JOIN misctype_tb misc ON" + " misc.miscid = rel.miscid" + " AND misc.carid = switch.carid" + " ORDER BY" + " rel.sort";
		var types = this.get_DB().queryHash(sql);
		return types;
	}

	updateRelation(groupid, pactid, carid, data, is_use_unique) //削除SQL
	//削除対象のmiscidを取得する
	//削除SQL
	//更新系
	//misctype_switch_tb更新
	//SQL実行しよう
	{
		var __res = Array();

		__res.result = true;
		__res.message = "";
		var sql_ins = "";
		var recdate = this.get_DB().getNow();
		var db = this.get_DB();
		var sql_miscid = "SELECT rel.miscid FROM misctype_rel_tb AS rel" + " JOIN misctype_tb misc ON" + " misc.miscid = rel.miscid" + " AND misc.carid = " + db.dbQuote(carid, "integer", true) + " WHERE" + " rel.groupid = " + db.dbQuote(groupid, "integer", true) + " AND rel.pactid = " + db.dbQuote(pactid, "integer", true);
		var sql_delete = "DELETE FROM misctype_rel_tb WHERE " + " groupid=" + db.dbQuote(groupid, "integer", true) + " AND pactid=" + db.dbQuote(pactid, "integer", true) + " AND miscid IN (" + sql_miscid + ")";
		var sql = "SELECT miscid FROM misctype_tb WHERE carid=" + this.get_DB().dbQuote(carid, "integer", true);
		var target_miscid = this.get_DB().queryCol(sql);

		if (!!data) {
			sql = "";

			for (var key in data) //miscidチェック
			{
				var value = data[key];

				if (!(-1 !== target_miscid.indexOf(value.miscid))) {
					__res.result = false;
					__res.message = "\u5BFE\u8C61\u30AD\u30E3\u30EA\u30A2\u306E\u9055\u3046\u305D\u306E\u4ED6\u5185\u5BB9\u304C\u3042\u308A\u307E\u3059(" + value.miscid + ")";
					return __res;
				}

				var temp = "(" + db.dbQuote(groupid, "integer", true) + "," + db.dbQuote(pactid, "integer", true) + "," + db.dbQuote(value.miscid, "integer", true) + "," + db.dbQuote(value.sort, "integer", true) + "," + db.dbQuote(recdate, "timestamp", true) + ")";

				if (sql != "") {
					sql += ",";
				}

				sql += temp;
			}

			sql_ins = "INSERT INTO misctype_rel_tb (groupid,pactid,miscid,sort,recdate)VALUES" + sql;
		}

		db.beginTransaction();

		if (!is_null(is_use_unique)) {
			switch (is_use_unique) {
				case 0:
					this.deleteSwitch(groupid, pactid, carid);
					break;

				case 1:
					this.insertSwitch(groupid, pactid, carid);
					break;
			}
		}

		db.exec(sql_delete);

		if (sql_ins != "") //更新され数チェキする
			{
				var res = db.exec(sql_ins);

				if (res == data.length) //更新件数が一致している！
					{
						db.commit();
					} else //エラーぽよ
					{
						db.rollback();
						__res.result = false;
					}
			} else {
			db.commit();
		}

		return __res;
	}

	isMiscTypeUnique(groupid, pactid, carid) //既に該当のレコードが存在しているか確認する
	//SQL実行しよう
	{
		var db = this.get_DB();

		var _pactid = db.dbQuote(pactid, "pactid", true);

		var _groupid = db.dbQuote(groupid, "groupid", true);

		var _carid = db.dbQuote(carid, "carid", true);

		var sql = "SELECT true FROM misctype_switch_tb WHERE groupid=" + _groupid + " AND pactid=" + _pactid + " AND carid=" + _carid;
		var res = db.queryOne(sql);

		if (!res) {
			return false;
		}

		return true;
	}

	insertSwitch(groupid, pactid, carid) //既に該当のレコードが存在しているか確認する
	//pactid=0 を指定された場合、指定されたgroupに会社が存在していればinsertする
	//pactidが0以外を指定されている場合は、対象のpactidが存在しているかを調べる
	//グループ、顧客IDが存在し、まだレコードがなければ追加する
	//SQL実行しよう
	//レコードが既にある場合は0件(´･ω･`)
	{
		var db = this.get_DB();
		var recdate = db.getNow();

		var _recdate = db.dbQuote(recdate, "timestamp", true);

		var _pactid = db.dbQuote(pactid, "pactid", true);

		var _groupid = db.dbQuote(groupid, "groupid", true);

		var _carid = db.dbQuote(carid, "carid", true);

		var sql_check = "SELECT true FROM misctype_switch_tb WHERE groupid=" + _groupid + " AND pactid=" + _pactid + " AND carid=" + _carid;
		var sql_where_pactid = pactid == 0 ? "" : " AND pactid=" + _pactid;
		var sql_ins = "INSERT INTO misctype_switch_tb(groupid,pactid,carid,recdate)" + " SELECT" + " groupid" + "," + _pactid + "," + _carid + "," + _recdate + " FROM pact_tb" + " WHERE" + " groupid=" + _groupid + sql_where_pactid + " AND (" + sql_check + ") is null" + " LIMIT 1";
		var res = db.exec(sql_ins);

		if (res == 0) {
			return false;
		}

		return true;
	}

	deleteSwitch(groupid, pactid, carid) {
		var db = this.get_DB();
		var recdate = db.getNow();

		var _recdate = db.dbQuote(recdate, "timestamp", true);

		var _pactid = db.dbQuote(pactid, "pactid", true);

		var _groupid = db.dbQuote(groupid, "groupid", true);

		var _carid = db.dbQuote(carid, "carid", true);

		var sql_del = "DELETE FROM misctype_switch_tb WHERE" + " groupid=" + _groupid + " AND pactid=" + _pactid + " AND carid=" + _carid;
		var res = db.exec(sql_del);

		if (res == 0) //対象がなかった
			{
				return false;
			}

		return true;
	}

	updateSwitch(groupid, pactid, carid, switch) {
		var res = false;

		if (switch) //追加
			{
				res = this.insertSwitch(groupid, pactid, carid);
			} else //削除
			{
				res = this.deleteSwitch(groupid, pactid, carid);
			}

		return res;
	}

	getMiscTypeForSelect(groupid, pactid, carid) //注文時のその他の内容で使うよ
	//件数を取得
	{
		var res = Array();
		var types = this.getMiscType(groupid, pactid, carid, false);
		var nums = types.length;

		if (nums != 1) {
			res[""] = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
		}

		for (var key in types) //その他の内容 => その他の内容にするぽよ
		{
			var value = types[key];
			res[value.name] = value.name;
		}

		return res;
	}

	__destruct() {
		super.__destruct();
	}

};