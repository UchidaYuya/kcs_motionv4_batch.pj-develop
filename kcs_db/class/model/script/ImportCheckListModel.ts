import ModelBase from "../../model/ModelBase";
import ImportCheckListView from "../../view/script/ImportCheckListView";
const _ = require('lodash');

//
//__construct
//
//@author web
//@since 2012/05/21
//
//@access public
//@return void
//
//
//setArgv
//
//@author web
//@since 2012/05/21
//
//@param mixed $argv
//@access public
//@return void
//
//
//setPactId
//
//@author web
//@since 2012/05/21
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getTarget
//
//@author web
//@since 2012/05/21
//
//@access public
//@return void
//
//
//initialize
//
//@author web
//@since 2012/05/21
//
//@access public
//@return void
//
//
//makeWhere
//
//@author web
//@since 2012/05/21
//
//@access protected
//@return void
//
//
//calc
//
//@author web
//@since 2012/05/24
//
//@access public
//@return void
//
//
//insert
//
//@author web
//@since 2012/05/24
//
//@param mixed $data
//@access protected
//@return void
//
//
//getTelDetailsDataList
//
//@author web
//@since 2012/05/24
//
//@access public
//@return void
//
//
//getLastAmountData
//
//@author web
//@since 2012/05/24
//
//@access protected
//@return void
//
//
//getPhoneCnt
//
//@author web
//@since 2012/05/24
//
//@param mixed $pactid
//@param mixed $carid
//@param string $prtelno
//@access protected
//@return void
//
//
//insertCheckList
//
//@author web
//@since 2012/01/31
//
//@access public
//@return void
//
//
//insertTotalRecord
//
//@author web
//@since 2012/02/13
//
//@access protected
//@return void
//
//
//calcTotalData
//
//@author web
//@since 2012/02/14
//
//@access protected
//@return void
//
//
//makeInsertQuery
//
//@author web
//@since 2012/02/13
//
//@param mixed $data
//@access protected
//@return void
//
//
//getAmountDataList
//
//@author web
//@since 2012/01/31
//
//@access public
//@return void
//
//
//makeUpdateConfirmQuery
//
//@author web
//@since 2012/02/14
//
//@param mixed $value
//@access protected
//@return void
//
//
//setView
//
//@author web
//@since 2012/05/21
//
//@param mixed $view
//@access public
//@return void
//
//
//getTableNo
//
//@author web
//@since 2012/05/21
//
//@param mixed $year
//@param mixed $month
//@access public
//@return void
//
export default class ImportCheckListModel extends ModelBase {
	_now: any;
	_year: any;
	_month: any;
	_pactid: any;
	_carid: any;
	_teldetailsData: any;
	_checkedConfirmation: any;
	view: any;
	m_cur_year: any;
	m_cur_month: any;

	static RECORD_TYPE = "auto";

	constructor() {
		super();
		this._now = this.get_DB().getNow();
	}

	setArgv(argv: any[]) {
// 2022cvt_015
		for (var value of (argv)) {
// 2022cvt_019
			// if (preg_match("/-p=/", value)) {
			if (value.match(/-p=/)) {
				this.setPactId(value.replace(/[^0-9]/g, ""));
			}

// 2022cvt_019
            // if (preg_match("/-y=/", value)) {
			if (value.match(/-y=/)) {
// 2022cvt_015
				var yyyymm = value.replace(/[^0-9]/g, "");
				this._year = yyyymm.substr(0, 4);
				this._month = yyyymm.substr(4, 6);
			}
		}
	}

	setPactId(pactid) {
		// if (is_numeric(pactid)) {
		if (!isNaN(pactid)) {
			this._pactid = pactid;
		}
	}

	async getTarget() {
		if (this._pactid) {
// 2022cvt_015
			var target = [this._pactid];
		} else {
// 2022cvt_015
			var table = "tel_details_" + this.getTableNo(this._year, this._month) + "_tb";
// 2022cvt_015
			var sql = "SELECT pactid FROM " + table + " " + this.makeWhere("details");
			sql += " GROUP BY pactid ORDER BY pactid";
// 2022cvt_015
			var target1 = await this.get_DB().queryCol(sql);
			sql = "SELECT pactid FROM tel_amount_bill_tb WHERE year=" + this._year + " AND month=" + this._month + " GROUP BY pactid ORDER BY pactid";
// 2022cvt_015

			var target2 = await this.get_DB().queryCol(sql);
			if (!Array.isArray(target1)) {
				target1 = Array();
			}

			if (!Array.isArray(target2)) {
				target2 = Array();
			}

			// target = array_merge(target1, target2);
			target = target1.concat(target2);
			// target = array_unique(target);
			target.filter(function (value, index, self) {
				return self.indexOf(value) === index;
			});
			target.sort();
		}

		return target;
	}

	async initialize() //$sql = "UPDATE tel_amount_bill_tb SET confirmation=NULL, note=NULL " .$where;
	{
// 2022cvt_015
		var where = this.makeWhere("amount");
// 2022cvt_015
		//var sql = "SELECT pactid, carid, prtelno FROM tel_amount_bill_tb " + where;
// 2022cvt_015
		//var amData = await this.get_DB().queryRow(sql);
		const sql = "DELETE FROM import_check_list_tb " + where;
		this.get_DB().query(sql);
		//this.get_DB().query(sql);
	}

	makeWhere(table: string) {
		let w = '';
		// if (is_numeric(this._pactid) && !!this._pactid) {
		if (!isNaN(this._pactid) && this._pactid) {
// 2022cvt_015
			w = " pactid = " + this._pactid;
		}

		if ("details" != table) {
			// if (is_numeric(this._year) && !!this._year) {
			if (!isNaN(this._year) && this._year) {
				if (w) {
					w += " AND";
				}

				w += " year = " + this._year;
			}

			// if (is_numeric(this._month) && !!this._month) {
			if (!isNaN(this._month) && this._month) {
				if (w) {
					w += " AND";
				}

				w += " month = " + this._month;
			}
		}

		// if (is_numeric(this._carid) && !!this._carid) {
		if (!isNaN(this._carid) && this._carid) {
			if (w) {
				w += " AND";
			}

			w += " carid = " + this._carid;
		}

		if ('' !== w) {
			w = "WHERE " + w;
		}

		return w;
	}

	async calc() {
// 2022cvt_015
		var chargeData = await this.getTelDetailsDataList();
		var chargeList :any = {};

// 2022cvt_015
		for (var value of chargeData) {
			_.setWith(
				chargeList,
				`${value.pactid}.${value.carid}.${value.prtelno}`,
				value.charge,
				Object
			)
		}
// 2022cvt_015
		var amountList = await this.getLastAmountData();
// 2022cvt_015
		var j = 0;
		var total = 0;
// 2022cvt_015
		var pactid = amountList[0] && amountList[0].pactid;
// 2022cvt_015
		var carid = amountList[0] && amountList[0].carid;

// 2022cvt_015
		var totalDetails = 0, totalDiff = 0, totalPhoneCnt = 0;
		var pactTotal = 0, pactTotalDetails = 0, pactTotalDiff = 0, pactTotalPhoneCnt = 0;
		for (var key in amountList) {
// 2022cvt_015
			var value = amountList[key];
			if ("小計" == value.prtelno) {
				await this.insert({
					pactid: pactid,
					carid: carid,
					prtelno: value.prtelno,
					charge: totalDetails,
					diff: totalDiff,
					count: totalPhoneCnt
				});
				total = 0;
				totalDetails = 0;
				totalDiff = 0;
				totalPhoneCnt = 0;
			}

			if ("合計" == value.prtelno) {
// 2022cvt_015
				await this.insert({
					pactid: pactid,
					carid: 0,
					prtelno: value.prtelno,
					charge: pactTotalDetails,
					diff: pactTotalDiff,
					count: pactTotalPhoneCnt
				});
// 2022cvt_015
				pactTotal = 0;
				pactTotalDetails = 0;
				pactTotalDiff = 0;
				pactTotalPhoneCnt = 0;
			}

// 2022cvt_015
			var result = value;
			result.difference = 0;

			if ("小計" != value.prtelno && "合計" != value.prtelno) {
				total = total + value.charge;
				pactTotal = pactTotal + value.charge;
				totalDetails = totalDetails + Number(chargeList[value.pactid][value.carid][value.prtelno]);
				pactTotalDetails = pactTotalDetails + Number(chargeList[value.pactid][value.carid][value.prtelno]);
				result.phoneCnt = Number(await this.getPhoneCnt(value.pactid, value.carid, value.prtelno));
				totalPhoneCnt += result.phoneCnt;
				pactTotalPhoneCnt += result.phoneCnt;

				if (value.charge != chargeList[value.pactid][value.carid][value.prtelno]) {
					result.difference = value.charge - chargeList[value.pactid][value.carid][value.prtelno];
					totalDiff = totalDiff + result.difference;
					pactTotalDiff = pactTotalDiff + result.difference;
				}

				await this.insert({
					pactid: value.pactid,
					carid: value.carid,
					prtelno: value.prtelno,
					charge: result.charge,
					diff: result.difference,
					count: result.phoneCnt
				});
			}

			pactid = value.pactid;
			carid = value.carid;
			this._now = this.get_DB().getNow();
		}

		return result;
	}

	async insert(data: { pactid: any; carid: any; prtelno: any; charge: any; diff: any; count: any; }) {
// 2022cvt_015
		var status = 0;

		if (0 != data.diff) {
			status = 1;
		}

// 2022cvt_015
		var sql = "INSERT INTO import_check_list_tb VALUES(" + this.get_DB().dbQuote(data.pactid, "int", true) + ", " + this.get_DB().dbQuote(data.carid, "int", true) + ", " + this.get_DB().dbQuote(data.prtelno, "text", false) + ", " + this.get_DB().dbQuote(this._year, "int", true) + ", " + this.get_DB().dbQuote(this._month, "int", true) + ", " + this.get_DB().dbQuote(data.count, "int", false) + ", " + this.get_DB().dbQuote(data.charge, "int", true) + ", " + this.get_DB().dbQuote(data.diff, "int", false) + ", " + this.get_DB().dbQuote(this._now, "date", false) + ")";
		await this.get_DB().query(sql);
	}

	async getTelDetailsDataList() {
		// if (is_null(this._teldetailsData)) {
		if (!this._teldetailsData) {
// 2022cvt_015
			var table = "tel_details_" + this.getTableNo(this._year, this._month) + "_tb";
// 2022cvt_016
// 2022cvt_015
			var sql = "SELECT d.pactid, d.carid, d.prtelno, SUM(charge) AS charge, " + "CASE " + "WHEN d.code LIKE 'h_%' THEN 'hand' " + "ELSE " + "'batch' END AS importtype " + "FROM " + table + " d " + "INNER JOIN utiwake_tb u ON d.code=u.code AND d.carid=u.carid AND (u.codetype='0' OR u.carid=3) " + "WHERE " + "d.code NOT IN ('ASP', 'ASX', '', 'C50000') " + "AND ((d.prtelno IS NOT NULL AND d.prtelno <> '') OR d.code like ('h_%'))";

			if (this._pactid) {
				sql += " AND d.pactid=" + this.get_DB().dbQuote(this._pactid, "int", true) + " ";
			}

// 2022cvt_016
			sql += "GROUP BY " + "d.pactid, d.carid, d.prtelno, importtype " + "ORDER BY " + "d.pactid";
			this._teldetailsData = await this.get_DB().queryHash(sql);

			// console.log(this._teldetailsData)
		}

		return this._teldetailsData;
	}

	getLastAmountData() {
// 2022cvt_015
		var sql = "SELECT a.*, " + "CASE " + "WHEN a.carid = 0 THEN 999 " + "ELSE " + "a.carid END AS sortcarid, " + "CASE " + "WHEN a.prtelno IS NULL THEN '0' " + "ELSE " + "a.prtelno END AS sortprtelno " + "FROM " + "(SELECT am.*,p.compname,c.carname, RANK() OVER(PARTITION BY am.pactid,am.carid,am.prtelno ORDER BY am.recdate DESC) rank FROM tel_amount_bill_tb am " + "INNER JOIN pact_tb p ON am.pactid=p.pactid " + "INNER JOIN carrier_tb c ON am.carid=c.carid " + "WHERE " + "am.year=" + this._year + " AND am.month=" + this._month;

		if (this._pactid) {
			sql += " AND p.pactid=" + this.get_DB().dbQuote(this._pactid, "int", true);
		}

		sql += ") a " + "WHERE " + "a.rank = 1" + " ORDER BY a.pactid, sortcarid, sortprtelno";
		return this.get_DB().queryHash(sql);
	}

	async getPhoneCnt(pactid: any, carid: any, prtelno = "undefined") {
// 2022cvt_015
		var dummyTelSql = "SELECT telno FROM dummy_tel_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " " + "AND carid=" + this.get_DB().dbQuote(carid, "int", true);
// 2022cvt_015
		var dummyTelno = await this.get_DB().queryCol(dummyTelSql);
// 2022cvt_015
		var table = "tel_details_" + this.getTableNo(this._year, this._month) + "_tb";
// 2022cvt_015
		var sql = "SELECT COUNT(*) FROM (SELECT count(telno) FROM " + table + " " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND code NOT IN ('ASP', 'ASX')";

		// if (0 < COUNT(dummyTelno)) {
		if (0 < dummyTelno.length) {
			// sql += "AND telno NOT IN ('" + "', '".join(dummyTelno) + "')";
			sql += "AND telno NOT IN (" + dummyTelno.join(",") + ")";
		}

		// if (!is_null(prtelno)) {
		if (prtelno) {

			if ("hand" == prtelno) {
				sql += " AND code LIKE " + this.get_DB().dbQuote("h_%", "text", false);
			} else {
				sql += " AND prtelno=" + this.get_DB().dbQuote(prtelno, "text", false);
			}
		} else {
// 2022cvt_015
			var avoid;
// 2022cvt_015
			var avoidSql = sql;
			avoidSql += " AND prtelno IS NULL GROUP BY telno) g";

			if (!(avoid = this.get_DB().queryOne(avoidSql))) {
				return avoid;
			}

			sql += " AND prtelno=''";
		}

		sql += " GROUP BY telno) g";
		return this.get_DB().queryOne(sql);
	}

	async insertCheckList() {
// 2022cvt_015
		var amountList = await this.getAmountDataList();
		
// 2022cvt_015
		var detailsList = await this.getTelDetailsDataList();
// 2022cvt_015
		var upList = Array();

// 2022cvt_015
		for (var value of detailsList) {
			if (!amountList[value.pactid][value.carid][value.prtelno]) {
// 2022cvt_015
				var sql;

				if (false !== (sql = this.makeInsertQuery(value))) {
					await this.get_DB().query(sql);
				}
			} else //差額があっても、前回と前々回の値が同じで確認済みなら引き継ぐ
			{
				//console.log(amountList[value.pactid][value.carid][value.prtelno][1])
				if (value.charge != amountList[value.pactid][value.carid][value.prtelno][1]) {
					if (undefined !== amountList[value.pactid][value.carid][value.prtelno][1] && undefined !== amountList[value.pactid][value.carid][value.prtelno][2]) {
						if (amountList[value.pactid][value.carid][value.prtelno][1].charge == amountList[value.pactid][value.carid][value.prtelno][2].charge && 1 == amountList[value.pactid][value.carid][value.prtelno][1].confirmation) {
							sql = this.makeUpdateConfirmQuery(value, amountList);
							await this.get_DB().query(sql);
						}
					} else if (undefined !== amountList[value.pactid][value.carid][value.prtelno][1]) {
						if (0 == amountList[value.pactid][value.carid][value.prtelno][1].confirmation && value.charge == amountList[value.pactid][value.carid][value.prtelno][1].charge) {
							sql = this.makeUpdateConfirmQuery(value, amountList);
							await this.get_DB().query(sql);
						}
					}
				}
			}
		}

		await this.insertTotalRecord();
	}

	async insertTotalRecord() {
// 2022cvt_015
		var amountList = await this.getLastAmountData();
		amountList.push({
			pactid: 0,
			carid: 0,
			year: 0,
			month: 0,
			charge: 0
		});
// 2022cvt_015
		var calcData = await this.calcTotalData();
// 2022cvt_015
		var insertData = Array();
// 2022cvt_015
		var pactid = amountList[0].pactid;
// 2022cvt_015
		var carid = amountList[0].carid;

		var total = 0;
		var oldData = {};
		var totalDetails = 0;
		var totalDiff = 0;

// 2022cvt_015
		for (var value of amountList) {
			var pactTotal = 0;
			var pactTotalDetails: any;
			var pactTotalDiff: any;

			if ("合計" == value.prtelno || "小計" == value.prtelno) {
				_.setWith(
					oldData
					, `${value.pactid}.${value.carid}.${value.prtelno}`
					, value.charge
					, Object
				)
				continue;
			}

			if (pactid != value.pactid || carid != value.carid) {
// 2022cvt_015
				var temp = {
					pactid: pactid,
					carid: carid,
					prtelno: "小計",
					charge: total,
					confirmation: 0
				};

				if (calcData[value.pactid] && calcData[value.pactid][value.carid].total != total) {
				 	temp.confirmation = 0;
				}

				insertData.push(temp);
// 2022cvt_015
				total = 0;
				totalDetails = 0;
				totalDiff = 0;
			}

			if (pactid != value.pactid) {
				temp = {
					pactid: pactid,
					carid: 0,
					prtelno: "合計",
					charge: pactTotal,
					confirmation: 0
				};

				// if (calcData[value.pactid].pactTotal != pactTotal) {
				// 	temp.confirmation = 0;
				// }

				insertData.push(temp);
// 2022cvt_015
				pactTotal = 0;
				pactTotalDetails = 0;
				pactTotalDiff = 0;
			}

			total = total + value.charge;
			pactTotal = pactTotal + value.charge;
			pactid = value.pactid;
			carid = value.carid;
		}

// 2022cvt_015
		for (var data of insertData) {
			if (!oldData[data.pactid][data.carid]["小計"] || !oldData[data.pactid][0]["合計"]) {
				// if (!is_null(data.charge)) {
				if (data.charge) {
// 2022cvt_015
					var sql;

					if (false !== (sql = this.makeInsertQuery(data))) {
						await this.get_DB().query(sql);
					}
				}
			} else if (oldData[data.pactid][data.carid][data.prtelno] != data.charge) {
				sql = "UPDATE tel_amount_bill_tb " + "SET " + "charge=" + this.get_DB().dbQuote(data.charge, "int", false) + ", " + "confirmation=0 " + "WHERE " + "pactid=" + data.pactid + " AND carid=" + data.carid + " AND prtelno=" + this.get_DB().dbQuote(data.prtelno, "text", false) + " AND year=" + this.get_DB().dbQuote(this._year, "int", true) + " AND month=" + this.get_DB().dbQuote(this._month, "int", true);
				await this.get_DB().query(sql);
			}
		}
	}

	async calcTotalData() {
// 2022cvt_015
		var detailsData = await this.getTelDetailsDataList();
		var result: any = {}; 
// 2022cvt_015
		for (var value of detailsData) {
			_.setWith(
				result,
				`${value.pactid}.pactTotal`,
				_.get(result, `${value.pactid}.pactTotal` , 0) + Number(value.charge),
				Object
			)
			_.setWith(
				result,
				`${value.pactid}.${value.carid}.total`,
				_.get(result, `${value.pactid}.${value.carid}.total` , 0) + Number(value.charge),
				Object
			)
		}

		return result;
	}

	makeInsertQuery(data: { prtelno: string | number; importtype: string; confirmation: number | undefined; pactid: string | number; carid: string | number; charge: any; }) {
// 2022cvt_016
		if (!data.prtelno && "batch" == data.importtype) {
			return false;
		}

// 2022cvt_015
		var nowTime = this.get_DB().getNow();

		// if (!(undefined !== data.confirmation) || !is_numeric(data.confirmation)) {
		if (!(undefined !== data.confirmation) || isNaN(data.confirmation)) {
			data.confirmation = 0;
		}

// 2022cvt_015
		var confirmation = data.confirmation;

		if (this._checkedConfirmation?.[data.pactid]?.[data.carid]?.[data.prtelno]) {
			confirmation = 1;
		}

// 2022cvt_015
		var prtelno = data.prtelno;

// 2022cvt_016
		if ("hand" == data.importtype) {
			prtelno = "hand";
		}

// 2022cvt_016
// 2022cvt_015
		var sql = "INSERT INTO tel_amount_bill_tb (pactid, carid, prtelno, year, month, charge, recdate, confirmation, recordtype) " + "VALUES(" + this.get_DB().dbQuote(data.pactid, "int", true) + ", " + this.get_DB().dbQuote(data.carid, "int", true) + ", " + this.get_DB().dbQuote(prtelno, "text", false) + ", " + this.get_DB().dbQuote(this._year, "int", true) + ", " + this.get_DB().dbQuote(this._month, "int", true) + ", " + this.get_DB().dbQuote(data.charge, "int", true) + ", " + this.get_DB().dbQuote(nowTime, "date", true) + ", " + this.get_DB().dbQuote(confirmation, "int", false) + ", " + this.get_DB().dbQuote(ImportCheckListModel.RECORD_TYPE, "text", false) + ")";
		return sql;
	}

	async getAmountDataList() {
// 2022cvt_015
		var sql = "SELECT a.* " + "FROM " + "(SELECT am.*, RANK() OVER(PARTITION BY am.prtelno,am.pactid,am.carid ORDER BY am.recdate DESC) rank FROM tel_amount_bill_tb am " + "WHERE " + "am.year=" + this._year + " AND am.month=" + this._month;

		if (!!this._pactid) {
			sql += " AND am.pactid=" + this.get_DB().dbQuote(this._pactid, "int", true);
		}

		sql += ") a " + "WHERE " + " a.rank = 1" + " ORDER BY a.pactid, a.prtelno";
// 2022cvt_015
		var temp = await this.get_DB().queryRowHash(sql);
		// console.log(temp)

		var result: any = {};

// 2022cvt_015
		for (var val of temp) {
			_.setWith(
				result,
				`${val.pactid}.${val.carid}.${val.prtelno}.${val.rank}`,
				{
					charge: val.charge,
					confirmation: val.confirmation,
					recdate: val.recdate
				}, Object
			)
		}

		return result;
	}

	makeUpdateConfirmQuery(value: { pactid: string | number; carid: string | number; prtelno: string | number; }, amountList: Promise<any>) {
// 2022cvt_015
		var sql = "UPDATE tel_amount_bill_tb SET confirmation=1 " + "WHERE " + "pactid=" + this.get_DB().dbQuote(value.pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(value.carid, "int", true) + " AND month=" + this.get_DB().dbQuote(this._month, "int", true) + " AND year=" + this.get_DB().dbQuote(this._year, "int", true) + " AND recdate=" + this.get_DB().dbQuote(new Date(amountList[value.pactid][value.carid][value.prtelno][1].recdate).toISOString(), "date", true);

		if (!value.prtelno) {
			sql += " AND prtelno IS NULL ";
		} else {
			sql += " AND prtelno=" + this.get_DB().dbQuote(value.prtelno, "text", false);
		}

		return sql;
	}

	setView(view: ImportCheckListView) {
		this.view = view;
	}

	getTableNo(year: number, month: number) {
// 2022cvt_015
		var diff = 12 * (this.m_cur_year - year) + this.m_cur_month - month + 1;
		var rval: any;

		if (diff < 13) {
			if (1 == month) return 12;else {
// 2022cvt_015
				rval = month - 1;
				if (rval < 10) rval = "0" + rval;
				return rval;
			}
		} else {
			if (1 == month) return 24;else return month - 1 + 12;
		}
	}

};
