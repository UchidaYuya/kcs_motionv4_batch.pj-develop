//
//シミュレーション結果モデル
//
//@uses ModelBase
//@filesource
//@package Recom
//@subpackage Model
//@author kitamura
//@since 2010/02/18
//
//
//シミュレーション結果モデル
//
//@uses ModelBase
//@package Recom
//@subpackage Model
//@author kitamura
//@since 2010/02/18
//

require("MtSetting.php");

require("MtDBUtil.php");

require("MtOutput.php");

require("model/ModelBase.php");

//
//プロパティモデル
//
//@var RecomPropertyModel
//@access protected
//
//
//シミュレーション結果SQLのSelect部分
//
//@var string
//@access protected
//
//
//シミュレーション集計SQLのSelect部分
//
//@var string
//@access protected
//
//
//ダウンロードSQLのSelect部分
//
//@var string
//@access protected
//
//
//共通From
//
//@var string
//@access protected
//
//
//共通Where
//
//@var string
//@access protected
//
//
//共通Order
//
//@var string
//@access protected
//
//
//共通Limit
//
//@var string
//@access protected
//
//
//除外電話番号
//
//@var array
//@access protected
//
//
//コンストラクタ
//
//@author kitamura
//@since 2010/02/18
//
//@param MtDbUtil $O_db
//@access public
//@return void
//
//
//デストラクタ
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return void
//
//
//除外電話番号の設定
//
//@author morihara
//@since 2011/04/13
//
//@param array $A_skip_telno
//@access public
//
//
//プロパティモデルの設定
//
//@author kitamura
//@since 2010/02/19
//
//@param RecomPropertyModel $O_property
//@access public
//@return RecomResultModel
//
//
//プロパティモデルの取得
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return RecomPropertyModel
//
//
//シミュレーション結果の取得
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return array
//
//
//シミュレーション結果数の取得
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return array
//
//
//ダウンロード用シミュレーション結果の取得
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return array
//
//
//simidの取得
//
//@author kitamura
//@since 2010/03/09
//
//@access public
//@return integer
//
//
//シミュレーション結果SQLのSelect部分を取得
//
//@author kitamura
//@since 2010/02/22
//
//@access public
//@return string
//
//
//シミュレーション集計SQLのSelect部分の取得
//
//@author kitamura
//@since 2010/02/22
//
//@access public
//@return string
//
//
//ダウンロードSQLのSelect部分の取得
//
//@author kitamura
//@since 2010/02/22
//
//@access public
//@return string
//
//
//共通Fromの取得
//
//@author kitamura
//@since 2010/02/22
//
//@access public
//@return string
//
//
//共通Whereの取得
//
//@author kitamura
//@since 2010/02/22
//
//@access public
//@return string
//
//
//共通Orderの取得
//
//@author kitamura
//@since 2010/02/22
//
//@access public
//@return string
//
//
//共通Limitの取得
//
//@author kitamura
//@since 2010/02/22
//
//@access public
//@return void
//
//
//英語表記の場合に引数の末尾に_engを付ける
//
//@author kitamura
//@since 2010/02/22
//
//@param string $column
//@access public
//@return string
//
//
//SQLの生成
//
//@author kitamura
//@since 2010/02/22
//
//@access protected
//@return RecomResultModel
//
//
//カラムの配列からSelect句を生成
//
//@author kitamura
//@since 2010/02/22
//
//@param array $H_columns
//@access protected
//@return string
//
//
//シミュレーション結果SQLのSelect部分を生成
//
//@author kitamura
//@since 2010/02/22
//
//@access protected
//@return string
//
//
//シミュレーション集計SQLのSelect部分を生成
//
//@author kitamura
//@since 2010/02/22
//
//@access protected
//@return string
//
//
//ダウンロードSQLのSelect部分を生成
//
//@author kitamura
//@since 2010/02/22
//
//@access protected
//@return string
//
//
//共通Fromの生成
//
//@author kitamura
//@since 2010/02/22
//
//@access protected
//@return string
//
//
//共通Whereの生成
//
//@author kitamura
//@since 2010/02/22
//
//@access protected
//@return string
//
//
//共通Orderの生成
//
//@author kitamura
//@since 2010/02/22
//
//@access protected
//@return string
//
//
//共通Limitの生成
//
//@author kitamura
//@since 2010/02/22
//
//@access protected
//@return string
//
//
//シミュレーション結果絞込SQLの取得
//
//@author kitamura
//@since 2010/03/01
//
//@access protected
//@return string
//
//
//シミュレーション結果絞込SQLのSelect句を取得
//
//@author kitamura
//@since 2010/03/01
//
//@access protected
//@return string
//
//
//シミュレーション結果絞込SQLのFrom句を取得
//
//@author kitamura
//@since 2010/03/01
//
//@access protected
//@return void
//
//
//シミュレーション結果絞込SQLのWhere句を取得
//
//@author kitamura
//@since 2010/03/01
//
//@access protected
//@return string
//
//
//キャリア間シミュレーションか判別
//
//@author kitamura
//@since 2010/03/09
//
//@access protected
//@return boolean
//
//
//getExtensionNo
//
//@author igarashi
//@since 2011/11/09
//
//@param mixed $H_data
//@access public
//@return void
//
//
//checkFile
//
//@author web
//@since 2013/01/30
//
//@param mixed $simid
//@access public
//@return void
//
//
//writeHeader
//
//@author web
//@since 2013/01/30
//
//@param mixed $H_cond
//@param mixed $H_view
//@access public
//@return void
//
class RecomResultModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
		this.A_skip_telno = Array();
	}

	__destruct() {
		super.__destruct();
	}

	setSkipTelno(A_skip_telno: {} | any[]) {
		this.A_skip_telno = A_skip_telno;
	}

	setProperty(O_property: RecomPropertyModel) {
		this.O_property = O_property;
		return this;
	}

	getProperty() {
		if (false == (undefined !== this.O_property)) {
			this.getOut().errorOut(11, "\u30D7\u30ED\u30D1\u30C6\u30A3\u30E2\u30C7\u30EB\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044", 0);
		}

		return this.O_property;
	}

	getRecomResult() {
		var sql = this.getResultSelectSql() + this.getFromSql() + this.getWhereSql() + this.getOrderSql() + this.getLimitSql();
		return this.getDb().queryHash(sql);
	}

	getResultCnt() {
		var sql = this.getCntSelectSql() + this.getFromSql() + this.getWhereSql();
		return this.getDb().queryHash(sql);
	}

	getDownloadData() {
		var sql = this.getDownloadSelectSql() + this.getFromSql() + this.getWhereSql();
		return this.getDb().queryHash(sql);
	}

	getSimId() {
		var sql = "SELECT si.simid " + this._getSimFromSql() + this._getSimWhereSql();

		if (false == this._isCarAfter()) {
			sql += "AND si.carid_before = " + this.getProperty().getCarId() + " ";
		}

		return this.getDb().queryOne(sql);
	}

	getResultSelectSql() {
		this._makeSql();

		return this.resultSelectSql;
	}

	getCntSelectSql() {
		this._makeSql();

		return this.cntSelectSql;
	}

	getDownloadSelectSql() {
		this._makeSql();

		return this.downloadSelectSql;
	}

	getFromSql() {
		this._makeSql();

		return this.fromSql;
	}

	getWhereSql() {
		this._makeSql();

		return this.whereSql;
	}

	getOrderSql() {
		this._makeSql();

		return this.orderSql;
	}

	getLimitSql() {
		this._makeSql();

		return this.limitSql;
	}

	translateColumn(column) {
		if (true == this.getProperty().isEng()) {
			return column + "_eng";
		}

		return column;
	}

	_makeSql() {
		var O_property = this.getProperty();

		if (true == O_property.getRenew()) {
			this.resultSelectSql = this._makeResultSelectSql();
			this.cntSelectSql = this._makeCntSelectSql();
			this.downloadSelectSql = this._makeDownloadSelectSql();
			this.fromSql = this._makeFromSql();
			this.whereSql = this._makeWhereSql();
			this.orderSql = this._makeOrderSql();
			this.limitSql = this._makeLimitSql();
			O_property.setRenew(false);
		}

		return this;
	}

	_makeSelectSql(H_columns) {
		var sql = "SELECT ";

		for (var table in H_columns) {
			var H_column = H_columns[table];

			if (true == is_numeric(table) || false == ("string" === typeof table)) {
				var table = "";
			} else {
				table += ".";
			}

			for (var alias in H_column) {
				var column = H_column[alias];
				sql += table + column;

				if (false == is_numeric(alias) && true == ("string" === typeof alias)) {
					sql += " AS " + alias;
				}

				sql += ",";
			}
		}

		return rtrim(sql, ",") + " ";
	}

	_makeResultSelectSql() //tel_XX_tb
	//tel_tb
	//post_tb
	//現在の回線種別 - circuit_tb
	//現在のプラン - plan_tb
	//現在の買い方 - buyselect_tb
	//現在のパケット - packet_tb
	//sim系のカラム
	//除外理由（全て表示のみ）
	//0-正常
	//1-プランがすでに変更されています
	//2-警告フラグあり
	//3-シミュレーション対象外
	//nullの場合は0とするカラム
	{
		H_columns.tel = ["telno", "telno_view", "carid", "employeecode", "username", "arid", "extensionno", "division"];
		H_columns.telnow_tel = ["planalert", "packetalert"];
		H_columns.post = ["postid", "postname", "userpostid"];
		H_columns.cir = ["cirid", "cirname", "cirname_eng", "sort"];
		H_columns.plan = ["planid", "planname", "planname_eng", "buyselid"];
		H_columns.bsel = ["buyselname", "buyselname_eng"];
		H_columns.packet = ["packetid", "packetname", "packetname_eng"];
		H_columns.sim = ["simid", "fixdate", "basic_before", "tel_before", "etc_before", "basic_after", "basic_after_poor", "tel_after", "tel_after_poor", "etc_after", "etc_after_poor", "charge_after", "charge_after_poor", "mass_target_1", "mass_target_2", "mass_target_3", "mass_target_4", "mass_target_5", "is_poor", "recplanid", "recplanname", "recplanname_eng", "recbuyselid", "recbuyselname", "recbuyselname_eng", "recpacketid", "recpacketname", "recpacketname_eng", "recplanid_poor", "recplanname_poor", "recplanname_poor_eng", "recbuyselid_poor", "recbuyselname_poor", "recbuyselname_poor_eng", "recpacketid_poor", "recpacketname_poor", "recpacketname_poor_eng", "diffcharge", "diffcharge_poor"];
		H_columns[0] = {
			exception: "CASE " + "WHEN sim.simid IS NULL THEN 3 " + "WHEN " + "(pact.type != 'H' AND sim.planalert IS NOT NULL AND sim.planalert IN('1', '3')) " + "OR (pact.type != 'H' AND sim.packetalert IS NOT NULL AND sim.packetalert IN ('1', '3')) " + "THEN 2 " + "WHEN " + "sim.planid = sim.recplanid " + "AND (sim.packetid = sim.recpacketid " + "OR (sim.packetid IS NULL AND (sim.rec_is_empty IS NULL OR sim.rec_is_empty = true)))" + "THEN 1 " + "ELSE 0 " + "END"
		};
		H_columns[1] = {
			charge_before: "CASE " + "WHEN sim.charge_before IS NULL THEN 0 " + "ELSE sim.charge_before " + "END",
			penalty_money: "CASE " + "WHEN sim.penalty_money IS NULL THEN 0 " + "ELSE sim.penalty_money " + "END",
			penalty_monthcnt: "CASE " + "WHEN sim.penalty_monthcnt IS NULL THEN 0 " + "ELSE sim.penalty_monthcnt " + "END",
			diffcharge_sort: "CASE " + "WHEN sim.diffcharge_sort IS NULL THEN 0 " + "ELSE sim.diffcharge_sort " + "END"
		};
		return this._makeSelectSql(H_columns);
	}

	_makeCntSelectSql() {
		var H_columns = [{
			count: "COUNT(tel.telno)",
			basicbefore: "SUM(sim.basic_before)",
			tuwabefore: "SUM(sim.tel_before)",
			etcbefore: "SUM(sim.etc_before)",
			basicafter: "SUM(CASE " + "WHEN sim.is_poor = false THEN " + "sim.basic_after " + "WHEN sim.is_poor = true THEN " + "sim.basic_after_poor " + "END)",
			tuwaafter: "SUM(CASE " + "WHEN sim.is_poor = false THEN " + "sim.tel_after " + "WHEN sim.is_poor = true THEN " + "sim.tel_after_poor " + "END)",
			etcafter: "SUM(CASE " + "WHEN sim.is_poor = false THEN " + "sim.etc_after " + "WHEN sim.is_poor = true THEN " + "sim.etc_after_poor " + "END)",
			max_fixdate: "MAX(sim.fixdate)"
		}];
		return this._makeSelectSql(H_columns);
	}

	_makeDownloadSelectSql() //この順序でCSVに出力される
	{
		var H_columns = [{
			0: "tel.telno_view",
			1: "sim.basic_before",
			basic_after: "CASE " + "WHEN sim.is_poor THEN sim.basic_after_poor " + "ELSE sim.basic_after " + "END",
			2: "sim.tel_before",
			tel_after: "CASE " + "WHEN sim.is_poor THEN sim.tel_after_poor " + "ELSE sim.tel_after " + "END",
			3: "sim.etc_before",
			etc_after: "CASE " + "WHEN sim.is_poor THEN sim.etc_after_poor " + "ELSE sim.etc_after " + "END",
			4: "post.postname",
			5: "post.userpostid",
			cirname: "cir." + this.translateColumn("cirname"),
			6: "tel.username",
			7: "tel.employeecode",
			buyselname: "bsel." + this.translateColumn("buyselname"),
			planname: "plan." + this.translateColumn("planname"),
			packetname: "packet." + this.translateColumn("packetname"),
			recbuyselname: "CASE " + "WHEN sim.is_poor THEN " + "sim." + this.translateColumn("recbuyselname_poor") + " " + "ELSE " + "sim." + this.translateColumn("recbuyselname") + " " + "END",
			recplanname: "CASE " + "WHEN sim.is_poor THEN " + "sim." + this.translateColumn("recplanname_poor") + " " + "ELSE " + "sim." + this.translateColumn("recplanname") + " " + "END",
			recpacketname: "CASE " + "WHEN sim.is_poor THEN " + "sim." + this.translateColumn("recpacketname_poor") + " " + "ELSE " + "sim." + this.translateColumn("recpacketname") + " " + "END",
			8: "sim.charge_before",
			diffcharge: "CASE " + "WHEN sim.is_poor THEN " + "sim.diffcharge_poor " + "ELSE " + "sim.diffcharge " + "END",
			9: "sim.money_penalty",
			10: "sim.monthcnt_penalty"
		}];
		return this._makeSelectSql(H_columns);
	}

	_makeFromSql() {
		var O_property = this.getProperty();
		var newestTelTb = O_property.getNewestTelTb();
		var sql = "FROM (" + this._getSimSql() + ") AS sim ";

		if (true == O_property.getAllFlag()) {
			sql += "RIGHT ";
		}

		sql += "JOIN " + newestTelTb + " AS tel " + "ON tel.pactid = sim.pactid " + "AND tel.telno = sim.telno " + "AND tel.carid = sim.carid_before " + "LEFT JOIN tel_tb as telnow_tel " + "ON tel.pactid = telnow_tel.pactid " + "AND tel.telno = telnow_tel.telno " + "AND tel.carid = telnow_tel.carid " + "JOIN post_tb AS post " + "ON tel.pactid = post.pactid " + "AND tel.postid = post.postid " + "JOIN pact_tb AS pact " + "ON tel.pactid = pact.pactid " + "LEFT JOIN circuit_tb AS cir " + "ON tel.cirid = cir.cirid " + "LEFT JOIN plan_tb AS plan " + "ON tel.planid = plan.planid " + "LEFT JOIN packet_tb AS packet " + "ON tel.packetid = packet.packetid " + "LEFT JOIN buyselect_tb AS bsel " + "ON plan.buyselid = bsel.buyselid " + "AND plan.carid = bsel.carid ";
		return sql;
	}

	_makeWhereSql() //キャリア間シミュレーションでなければキャリアで絞込
	{
		var O_property = this.getProperty();
		var sql = "WHERE " + "tel.pactid = " + O_property.getPactId() + " " + "AND (tel.dummy_flg = false OR tel.dummy_flg IS NULL) ";

		if (false == this._isCarAfter()) {
			sql += "AND tel.carid = " + O_property.getCarId() + " ";
		}

		if (false == O_property.isDownload() && true == O_property.isSimId()) {
			return sql;
		}

		if (false == O_property.getAllFlag()) {
			sql += "AND plan.simbefore = true ";
		}

		switch (O_property.getRange()) {
			case "one":
				sql += "AND tel.telno='" + O_property.getTelNo() + "' ";
				break;

			case "self":
				sql += "AND tel.postid = " + O_property.getCurrentPostId() + " ";
				break;

			case "all":
			default:
				if (false == O_property.isRoot()) {
					var A_postid = O_property.getChildList();

					if (A_postid.length < 1) {
						this.getOut().errorOut(0, "postid\u304C\u4E00\u4EF6\u3082\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093", 0);
					}

					sql += "AND tel.postid IN(" + A_postid.join(",") + ") ";
				}

				break;
		}

		if (O_property.isDivision()) {
			var division = O_property.getDivision();

			if (division.length && -1 != division) {
				sql += "AND tel.division=" + division + " ";
			}
		}

		return sql;
	}

	_makeOrderSql() {
		var O_property = this.getProperty();
		var A_order = ["post.userpostid", "tel.telno"];
		var A_sort = ["post.userpostid", "cir.sort", "tel.telno", "plan.planname", "packet.packetname", "sim.recplanname", "sim.recpacketname", "tel.telno", "charge_before", "diffcharge_sort", "penalty_money", "penalty_monthcnt", "tel.division"];

		if (true == O_property.isSort()) {
			var A_key = O_property.getSort().split("|");

			if (A_key[1] === "d") {
				A_order = [A_sort[A_key[0]] + " DESC"];
			} else {
				A_order = [A_sort[A_key[0]]];
			}

			if (false == array_search(A_key[0], [2, 7])) {
				A_order.push("tel.telno");
			}
		}

		return "ORDER BY " + A_order.join(",") + " ";
	}

	_makeLimitSql() {
		var O_property = this.getProperty();
		var sql = "LIMIT " + O_property.getLimit() + " " + "OFFSET " + O_property.getOffset();
		return sql;
	}

	_getSimSql() {
		var sql = this._getSimSelectSql() + this._getSimFromSql() + this._getSimWhereSql();

		return sql;
	}

	_getSimSelectSql() //sim_index_tb
	//sim_details_tb
	//tel_tb
	//推奨のプラン - plan_tb
	//推奨の買い方 - buyselect_tb
	//推奨のパケット - packet_tb
	//推奨のプラン（買い替え） - plan_tb
	//推奨の買い方（買い替え） - buyselect_tb
	//推奨のパケット（買い替え） - packet_tb
	//条件・計算により求めるカラム
	{
		H_columns.si = ["pactid", "carid_before", "carid_after", "simid", "fixdate"];
		H_columns.sd = {
			0: "telno",
			1: "basic_before",
			2: "tel_before",
			3: "etc_before",
			4: "basic_after",
			5: "basic_after_poor",
			6: "tel_after",
			7: "tel_after_poor",
			8: "etc_after",
			9: "etc_after_poor",
			10: "charge_before",
			11: "charge_after",
			12: "charge_after_poor",
			13: "mass_target_1",
			14: "mass_target_2",
			15: "mass_target_3",
			16: "mass_target_4",
			17: "mass_target_5",
			is_poor: "is_poor",
			18: "money_penalty",
			19: "monthcnt_penalty"
		};
		H_columns.telnow = ["planid", "packetid", "planalert", "packetalert"];
		H_columns.recplan = {
			recplanid: "planid",
			recplanname: "planname",
			recplanname_eng: "planname_eng",
			recbuyselid: "buyselid"
		};
		H_columns.recbsel = {
			recbuyselname: "buyselname",
			recbuyselname_eng: "buyselname_eng"
		};
		H_columns.recpacket = {
			recpacketid: "packetid",
			recpacketname: "packetname",
			recpacketname_eng: "packetname_eng",
			rec_is_empty: "is_empty"
		};
		H_columns.recplan_p = {
			recplanid_poor: "planid",
			recplanname_poor: "planname",
			recplanname_poor_eng: "planname_eng",
			recbuyselid_poor: "buyselid"
		};
		H_columns.recbsel_p = {
			recbuyselname_poor: "buyselname",
			recbuyselname_poor_eng: "buyselname_eng"
		};
		H_columns.recpacket_p = {
			recpacketid_poor: "packetid",
			recpacketname_poor: "packetname",
			recpacketname_poor_eng: "packetname_eng"
		};
		H_columns.push({
			diffcharge: "sd.charge_before - sd.charge_after",
			diffcharge_poor: "sd.charge_before - sd.charge_after_poor",
			penalty_money: "COALESCE(sd.money_penalty, 0)",
			penalty_monthcnt: "COALESCE(sd.monthcnt_penalty, 0)",
			diffcharge_sort: "CASE " + "WHEN is_poor = false THEN " + "sd.charge_before - sd.charge_after " + "WHEN is_poor = true THEN " + "sd.charge_before - sd.charge_after_poor " + "END"
		});
		return this._makeSelectSql(H_columns);
	}

	_getSimFromSql() {
		var sql = "FROM " + "sim_index_tb AS si " + "JOIN sim_details_tb AS sd " + "ON si.simid = sd.simid " + "JOIN pact_tb AS pact " + "ON si.pactid = pact.pactid " + "JOIN tel_tb AS telnow " + "ON si.pactid = telnow.pactid " + "AND sd.telno = telnow.telno " + "AND si.carid_before = telnow.carid " + "LEFT JOIN plan_tb AS recplan " + "ON sd.planid = recplan.planid " + "LEFT JOIN packet_tb AS recpacket " + "ON sd.packetid = recpacket.packetid " + "LEFT JOIN buyselect_tb AS recbsel " + "ON recplan.buyselid = recbsel.buyselid " + "AND recplan.carid = recbsel.carid " + "LEFT JOIN plan_tb AS recplan_p " + "ON sd.planid_poor = recplan_p.planid " + "LEFT JOIN packet_tb AS recpacket_p " + "ON sd.packetid_poor = recpacket_p.packetid " + "LEFT JOIN buyselect_tb AS recbsel_p " + "ON recplan_p.buyselid = recbsel_p.buyselid " + "AND recplan_p.carid = recbsel_p.carid ";
		return sql;
	}

	_getSimWhereSql() //20111109morihara追加
	//simidがある場合に、条件指定シミュレーションかどうかを検査する
	//予測削減額
	//全て表示ではない場合
	//パケット変更の有無
	//除外電話番号
	{
		var O_property = this.getProperty();
		var is_manual = false;

		if (true == O_property.isSimId()) {
			var simid = O_property.getSimId();
			var sql = "select count(*) from sim_index_tb" + " where (simid = " + simid + " OR parent_simid = " + simid + ") " + " and is_manual = true" + ";";
			is_manual = 0 < this.getDb().queryOne(sql);
		}

		sql = "WHERE " + "si.pactid = " + O_property.getPactId() + " " + "AND si.status = 2 ";

		if (false == O_property.getAllFlag()) //買い替えの有無
			{
				var border = O_property.getBorder();

				if (true == O_property.getChangeCourse()) {
					var slash;
					sql += "AND ((sd.charge_before - sd.charge_after >= " + border + " AND sd.is_poor = false) " + "OR (sd.charge_before - sd.charge_after_poor >= " + border + " AND sd.is_poor=true)) ";

					if (true == O_property.isSlash() && (slash = O_property.getSlash()) > 0) {
						sql += "AND money_penalty <= " + slash + " ";
					}
				} else {
					sql += "AND sd.charge_before - sd.charge_after >= " + border + " ";
				}
			}

		if (true == O_property.isDownload()) //ダウンロードならsimidが指定されているので、ここでWHERE句を返す
			//ただし、条件シミュレーションの場合のみ
			{
				simid = O_property.getSimId();
				sql += "AND si.is_save = true " + "AND (si.simid = " + simid + " OR si.parent_simid = " + simid + ") ";
				if (is_manual) return sql;
			} else //simidが指定された場合はここでWHERE句を返す
			{
				sql += "AND si.is_save = false ";

				if (true == O_property.isSimId()) {
					simid = O_property.getSimId();
					sql += "AND (si.simid = " + simid + " OR si.parent_simid = " + simid + ") ";
					return sql;
				}

				sql += "AND (si.is_manual = false OR si.is_hotline = true) ";
			}

		sql += "AND si.year = " + O_property.getYear() + " " + "AND si.month = " + O_property.getMonth() + " " + "AND si.monthcnt = " + O_property.getMonthcnt() + " ";

		if (false == O_property.getAllFlag()) //予測削減額が1円以上の場合
			{
				if (O_property.getBorder() > 0) {
					sql += "AND (telnow.planid != recplan.planid " + "OR (recpacket.packetid IS NOT NULL AND (telnow.packetid != recpacket.packetid " + "OR (telnow.packetid IS NULL AND recpacket.is_empty = false)))) ";
				}

				sql += "AND recplan.simafter = true " + "AND (pact.type = 'H' OR telnow.planalert IS NULL OR telnow.planalert NOT IN('1', '3')) " + "AND (pact.type = 'H' OR telnow.packetalert IS NULL OR telnow.packetalert NOT IN('1', '3')) ";
			}

		if (true == O_property.getChangeCourse()) {
			sql += "AND si.is_change_course = true ";
		} else {
			sql += "AND si.is_change_course = false ";
		}

		sql += "AND si.change_packet_free_mode = " + +(O_property.getChangePacketFree() + " ");

		if (this.A_skip_telno.length) {
			sql += "AND sd.telno not in(";
			var is_first = true;

			for (var telno of Object.values(this.A_skip_telno)) {
				if (!is_first) sql += ",";
				is_first = false;
				sql += this.get_DB().dbQuote(telno, "text", true);
			}

			sql += ") ";
		}

		return sql;
	}

	_isCarAfter() {
		var O_property = this.getProperty();

		if (true == O_property.isSimId()) {
			var simid = O_property.getSimId();
			var subSql = "SELECT carid_after, carid_before " + "FROM sim_index_tb " + "WHERE pactid = " + O_property.getPactId() + " " + "AND is_manual = true " + "AND status = 2 " + "AND (simid = " + simid + " OR parent_simid = " + simid + ") ";
			var H_row = this.getDb().queryHash(subSql);

			if (H_row.length > 1 || H_row[0].carid_before != H_row[0].carid_after) {
				return true;
			}
		}

		return false;
	}

	getExtensionNo(H_data, pactid) {
		if (Array.isArray(H_data)) {
			var result = "";

			for (var val of Object.values(H_data)) {
				if (!!val.telno) {
					result += this.getDb().dbQuote(val.telno, "text", true);
				}
			}

			var orderData = reset(H_data);
		}

		if (!!result && is_numeric(pactid) && is_numeric(orderData.carid)) {
			result = result.replace(/''/g, "','");
			var sql = "SELECT telno, extensionno FROM tel_tb " + "WHERE " + "pactid=" + this.getDb().dbQuote(pactid, "int", true) + " " + "AND carid=" + this.getDb().dbQuote(orderData.carid, "int", true) + " " + "AND telno in (" + result + ")";
			return this.getDb().queryAssoc(sql);
		}

		return false;
	}

	checkFile(simid, lang) {
		if (!("string" === typeof lang)) {
			lang = "JPN";
		}

		return file_exists(KCS_DIR + "/files/Recom_" + simid + "_" + lang + ".csv");
	}

	outputFile(H_g_sess, H_view, H_cond, lang = "JPN") //計算日
	//カラムヘッダを出力
	//コンテンツを出力
	{
		H_cond = H_view.cond[0];
		var fixdate = strtotime(H_cond.fixdate);
		var fp = fopen(KCS_DIR + "/files/Recom_" + H_cond.simid + "_" + lang + ".csv", "w");
		fwrite(fp, mb_convert_encoding(H_g_sess.compname + "\t" + H_g_sess.postid + "\t" + H_cond.select_way_disp, "SJIS") + "\t" + H_view.H_data.length + "\t" + H_cond.year + "\t" + H_cond.month + "\t" + H_cond.monthcnt + "\t" + date("Y", fixdate) + "\t" + date("m", fixdate) + "\t" + date("d", fixdate) + "\r\n");

		if (H_g_sess.language === "ENG") {
			fwrite(fp, mb_convert_encoding("Telephone number" + "\tBasic charge (current plan)" + "\tBasic charge (suggested plan)" + "\tCall charge (current plan)" + "\tCall charge (suggested plan)" + "\tMisc. (current plan)" + "\tMisc. (suggested plan)" + "\tDepartment name" + "\tUser department ID" + "\tService type" + "\tUser" + "\tEmployee number" + "\tCurrent purchase method" + "\tCurrent billing plan" + "\tCurrent packet" + "\tRecommended purchase method" + "\tRecommended billing plan" + "\tRecommended billing packet" + "\tAverage statement amount" + "\tEstimated cutback amount" + "\tPenalty" + "\tNumber of break-even months", "SJIS") + "\r\n");
		} else {
			fwrite(fp, mb_convert_encoding("\u96FB\u8A71\u756A\u53F7" + "\t\u57FA\u672C\u6599(\u524D)" + "\t\u57FA\u672C\u6599(\u5F8C)" + "\t\u901A\u8A71\u6599(\u524D)" + "\t\u901A\u8A71\u6599(\u5F8C)" + "\t\u305D\u306E\u4ED6(\u524D)" + "\t\u305D\u306E\u4ED6(\u5F8C)" + "\t\u90E8\u7F72\u540D" + "\t\u30E6\u30FC\u30B6\u30FC\u90E8\u7F72ID" + "\t\u56DE\u7DDA\u7A2E\u5225" + "\t\u4F7F\u7528\u8005" + "\t\u793E\u54E1\u756A\u53F7" + "\t\u73FE\u884C\u8CFC\u5165\u65B9\u5F0F" + "\t\u73FE\u884C\u6599\u91D1\u30D7\u30E9\u30F3" + "\t\u73FE\u884C\u30D1\u30B1\u30C3\u30C8" + "\t\u63A8\u5968\u8CFC\u5165\u65B9\u5F0F" + "\t\u63A8\u5968\u6599\u91D1\u30D7\u30E9\u30F3" + "\t\u63A8\u5968\u30D1\u30B1\u30C3\u30C8" + "\t\u5E73\u5747\u3054\u5229\u7528\u984D" + "\t\u4E88\u6E2C\u524A\u6E1B\u984D" + "\t\u9055\u7D04\u91D1" + "\t\u63A1\u7B97\u5206\u5C90\u6708\u6570", "SJIS") + "\r\n");
		}

		for (var A_row of Object.values(H_view.H_data)) {
			var delim = "";
			var idx = 0;

			for (var item of Object.values(A_row)) //タブ区切り
			{
				fwrite(fp, delim + mb_convert_encoding(item, "SJIS"));
				delim = "\t";
			}

			fwrite(fp, "\r\n");
		}
	}

};