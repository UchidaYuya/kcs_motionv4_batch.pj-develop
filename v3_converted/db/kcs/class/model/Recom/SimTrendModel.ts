//
//シミュレーション統計情報
//
//@uses ModelBase
//@package Recom
//@filesource
//@author nakanita
//@since 2009/01/13
//
//
//
//シミュレーション統計情報
//
//@uses ModelBase
//@package Recom
//@author nakanita
//@since 2008/11/21
//

require("model/ModelBase.php");

//
//__construct
//
//@author nakanita
//@since 2009/01/13
//
//@param mixed $O_db
//@access public
//@return void
//
//
//getDisratio
//
//@author nakanita
//@since 2009/01/14
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return void
//
//
//getAveDisratioBasic
//
//@author nakanita
//@since 2009/01/14
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $month
//@access public
//@return void
//
//
//getAveDisratioTalk
//
//@author nakanita
//@since 2009/01/14
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $month
//@access public
//@return void
//
//
//getAveIsmobile
//
//@author nakanita
//@since 2009/01/14
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $month
//@access public
//@return void
//
//
//getAveSameCarier
//
//@author nakanita
//@since 2009/01/14
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $month
//@access public
//@return void
//
//
//getAveTimezone
//
//@author nakanita
//@since 2009/01/14
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $month
//@access public
//@return void
//
//
//NewestSimTrendTb
//
//@author nakanita
//@since 2009/01/14
//
//@param mixed $month
//@access private
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2009/01/13
//
//@access public
//@return void
//
class SimTrendModel extends ModelBase {
	constructor() {
		super();
	}

	getDisratio(pactid, carid, cirid = undefined) {
		var sql = "select disratiotalk from disratio_tb " + " where pactid=" + pactid + " and carid=" + carid;

		if (cirid != undefined) //回線種別がある場合には入れる
			{
				sql += " and cirid=" + cirid;
			}

		return this.get_DB().queryOne(sql);
	}

	getAveDisratioBasic(pactid, carid, month) {
		var sim_trend_tb = this.NewestSimTrendTb(month);
		var sql = "select avg(value) from " + sim_trend_tb + " where pactid=" + pactid + " and carid=" + carid + " and code='predata_disratiobasic'";
		return this.get_DB().queryOne(sql);
	}

	getAveDisratioTalk(pactid, carid, month) {
		var sim_trend_tb = this.NewestSimTrendTb(month);
		var sql = "select avg(value) from " + sim_trend_tb + " where pactid=" + pactid + " and carid=" + carid + " and code='predata_disratiotalk'";
		return this.get_DB().queryOne(sql);
	}

	getAveIsmobile(pactid, carid, month) //結果がなければ
	{
		var sim_trend_tb = this.NewestSimTrendTb(month);
		var sql = "select key, avg(value) as val from " + sim_trend_tb + " where pactid=" + pactid + " and carid=" + carid + " and code='ismobile'" + " group by key";
		var H_result = this.get_DB().queryOne(sql);

		if (H_result == undefined || H_result.length == 0) //デフォルト値=50%
			{
				return 50;
			} else if (H_result.length == 1) {
			if (H_result.key == 0) //０の場合は0%
				{
					return 0;
				} else //１の場合は100%
				{
					return 100;
				}
		}

		var val0 = val1 = 0;

		for (var A_row of Object.values(H_result)) {
			if (A_row.key == 0) {
				val0 = A_row.val;
			}

			if (A_row.key == 1) {
				val1 = A_row.val;
			}
		}

		if (val0 + val1 <= 0) {
			return 0;
		}

		return val1 * 100 / (val0 + val1);
	}

	getAveSameCarier(pactid, carid, month) //実は sim_trend_X_tb には無い、
	//単純にデフォルト値を返す
	//デフォルト値=50%
	{
		return 50;
	}

	getAveTimezone(pactid, carid, month) //結果がなければ
	{
		var sim_trend_tb = this.NewestSimTrendTb(month);
		var sql = "select key, avg(value) as val from " + sim_trend_tb + " where pactid=" + pactid + " and carid=" + carid + " and code='timezone'" + " group by key";
		var H_result = this.get_DB().queryOne(sql);

		if (H_result == undefined || H_result.length == 0) //デフォルト値=70%
			{
				return 70;
			} else if (H_result.length == 1) {
			if (H_result.key == 0) //０の場合は0%
				{
					return 0;
				} else //１の場合は100%
				{
					return 100;
				}
		}

		var val0 = val1 = 0;

		for (var A_row of Object.values(H_result)) {
			if (A_row.key == 0) {
				val0 = A_row.val;
			}

			if (A_row.key == 1) {
				val1 = A_row.val;
			}
		}

		if (val0 + val1 <= 0) {
			return 0;
		}

		return val1 * 100 / (val0 + val1);
	}

	NewestSimTrendTb(month) //シミュレーション対象のsim_trend_X_tbを求める
	//対象月は month - 1 です.
	//最新の tel_XX_tb 名を得る
	{
		var rec_month = month;

		if (--rec_month <= 0) {
			rec_month += 12;
		}

		if (rec_month < 10) {
			var rec_month_str = "0" + rec_month;
		} else {
			rec_month_str = rec_month;
		}

		return "sim_trend_" + rec_month_str + "_tb";
	}

	__destruct() {
		super.__destruct();
	}

};