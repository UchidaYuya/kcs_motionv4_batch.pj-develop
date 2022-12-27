//
//ImportCheckListModel
//
//@uses ModelBase
//@package
//@author web
//@since 2012/05/21
//

require("model/ModelBase.php");

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
class ImportCheckListModel extends ModelBase {
	static RECORD_TYPE = "auto";

	constructor() {
		super();
		this._now = this.get_DB().getNow();
	}

	setArgv(argv) {
		for (var value of Object.values(argv)) {
			if (preg_match("/-p=/", value)) {
				this.setPactId(value.replace(/[^0-9]/g, ""));
			}

			if (preg_match("/-y=/", value)) {
				var yyyymm = value.replace(/[^0-9]/g, "");
				this._year = yyyymm.substr(0, 4);
				this._month = yyyymm.substr(4, 6);
			}
		}
	}

	setPactId(pactid) {
		if (is_numeric(pactid)) {
			this._pactid = pactid;
		}
	}

	getTarget() {
		if (!!this._pactid) {
			var target = [this._pactid];
		} else {
			var table = "tel_details_" + this.getTableNo(this._year, this._month) + "_tb";
			var sql = "SELECT pactid FROM " + table + " " + (sql += this.makeWhere("details"));
			sql += " GROUP BY pactid ORDER BY pactid";
			var target1 = this.get_DB().queryCol(sql);
			sql = "SELECT pactid FROM tel_amount_bill_tb WHERE year=" + this._year + " AND month=" + this._month + " GROUP BY pactid ORDER BY pactid";
			var target2 = this.get_DB().queryCol(sql);

			if (!Array.isArray(target1)) {
				target1 = Array();
			}

			if (!Array.isArray(target2)) {
				target2 = Array();
			}

			target = array_merge(target1, target2);
			target = array_unique(target);
			target.sort();
		}

		return target;
	}

	initialize() //$sql = "UPDATE tel_amount_bill_tb SET confirmation=NULL, note=NULL " .$where;
	{
		var where = this.makeWhere("amount");
		var sql = "SELECT pactid, carid, prtelno FROM tel_amount_bill_tb " + where;
		var amData = this.get_DB().queryRow(sql);
		sql = "DELETE FROM import_check_list_tb " + where;
		this.get_DB().query(sql);
		this.get_DB().query(sql);
	}

	makeWhere(table) {
		if (is_numeric(this._pactid) && !!this._pactid) {
			var w = " pactid = " + this._pactid;
		}

		if ("details" != table) {
			if (is_numeric(this._year) && !!this._year) {
				if (!!w) {
					w += " AND";
				}

				w += " year = " + this._year;
			}

			if (is_numeric(this._month) && !!this._month) {
				if (!!w) {
					w += " AND";
				}

				w += " month = " + this._month;
			}
		}

		if (is_numeric(this._carid) && !!this._carid) {
			if (!!w) {
				w += " AND";
			}

			w += " carid = " + this._carid;
		}

		if (undefined !== w) {
			w = "WHERE " + w;
		}

		return w;
	}

	calc() {
		var chargeData = this.getTelDetailsDataList();

		for (var value of Object.values(chargeData)) {
			chargeList[value.pactid][value.carid][value.prtelno] = value.charge;
		}

		var amountList = this.getLastAmountData();
		var j = total = 0;
		var pactid = amountList[0].pactid;
		var carid = amountList[0].carid;

		for (var key in amountList) {
			var value = amountList[key];

			if ("\u5C0F\u8A08" == value.prtelno) {
				var totalDetails, totalDiff, totalPhoneCnt;
				this.insert({
					pactid: pactid,
					carid: carid,
					prtelno: value.prtelno,
					charge: totalDetails,
					diff: totalDiff,
					count: totalPhoneCnt
				});
				total = totalDetails = totalDiff = totalPhoneCnt = 0;
			}

			if ("\u5408\u8A08" == value.prtelno) {
				var pactTotalDetails, pactTotalDiff, pactTotalPhoneCnt;
				this.insert({
					pactid: pactid,
					carid: 0,
					prtelno: value.prtelno,
					charge: pactTotalDetails,
					diff: pactTotalDiff,
					count: pactTotalPhoneCnt
				});
				var pactTotal = pactTotalDetails = pactTotalDiff = pactTotalPhoneCnt = 0;
			}

			var result = value;
			result.difference = 0;

			if ("\u5C0F\u8A08" != value.prtelno && "\u5408\u8A08" != value.prtelno) {
				total = total + value.charge;
				pactTotal = pactTotal + value.charge;
				totalDetails = totalDetails + chargeList[value.pactid][value.carid][value.prtelno];
				pactTotalDetails = pactTotalDetails + chargeList[value.pactid][value.carid][value.prtelno];
				result.phoneCnt = this.getPhoneCnt(value.pactid, value.carid, value.prtelno);
				totalPhoneCnt += result.phoneCnt;
				pactTotalPhoneCnt += result.phoneCnt;

				if (value.charge != chargeList[value.pactid][value.carid][value.prtelno]) {
					result.difference = value.charge - chargeList[value.pactid][value.carid][value.prtelno];
					totalDiff = totalDiff + result.difference;
					pactTotalDiff = pactTotalDiff + result.difference;
				}

				this.insert({
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

	insert(data) {
		var status = 0;

		if (0 != data.diff) {
			status = 1;
		}

		var sql = "INSERT INTO import_check_list_tb VALUES(" + this.get_DB().dbQuote(data.pactid, "int", true) + ", " + this.get_DB().dbQuote(data.carid, "int", true) + ", " + this.get_DB().dbQuote(data.prtelno, "text", false) + ", " + this.get_DB().dbQuote(this._year, "int", true) + ", " + this.get_DB().dbQuote(this._month, "int", true) + ", " + this.get_DB().dbQuote(data.count, "int", false) + ", " + this.get_DB().dbQuote(data.charge, "int", true) + ", " + this.get_DB().dbQuote(data.diff, "int", false) + ", " + this.get_DB().dbQuote(this._now, "date", false) + ")";
		this.get_DB().query(sql);
	}

	getTelDetailsDataList() {
		if (is_null(this._teldetailsData)) {
			var table = "tel_details_" + this.getTableNo(this._year, this._month) + "_tb";
			var sql = "SELECT d.pactid, d.carid, d.prtelno, SUM(charge) AS charge, " + "CASE " + "WHEN d.code LIKE 'h_%' THEN 'hand' " + "ELSE " + "'batch' END AS importtype " + "FROM " + table + " d " + "INNER JOIN utiwake_tb u ON d.code=u.code AND d.carid=u.carid AND (u.codetype='0' OR u.carid=3) " + "WHERE " + "d.code NOT IN ('ASP', 'ASX', '', 'C50000') " + "AND ((d.prtelno IS NOT NULL AND d.prtelno <> '') OR d.code like ('h_%'))";

			if (!!this._pactid) {
				sql += " AND d.pactid=" + this.get_DB().dbQuote(this._pactid, "int", true) + " ";
			}

			sql += "GROUP BY " + "d.pactid, d.carid, d.prtelno, importtype " + "ORDER BY " + "d.pactid";
			this._teldetailsData = this.get_DB().queryHash(sql);
		}

		return this._teldetailsData;
	}

	getLastAmountData() {
		var sql = "SELECT a.*, " + "CASE " + "WHEN a.carid = 0 THEN 999 " + "ELSE " + "a.carid END AS sortcarid, " + "CASE " + "WHEN a.prtelno IS NULL THEN '0' " + "ELSE " + "a.prtelno END AS sortprtelno " + "FROM " + "(SELECT am.*,p.compname,c.carname, RANK() OVER(PARTITION BY am.pactid,am.carid,am.prtelno ORDER BY am.recdate DESC) rank FROM tel_amount_bill_tb am " + "INNER JOIN pact_tb p ON am.pactid=p.pactid " + "INNER JOIN carrier_tb c ON am.carid=c.carid " + "WHERE " + "am.year=" + this._year + " AND am.month=" + this._month;

		if (!!this._pactid) {
			sql += " AND p.pactid=" + this.get_DB().dbQuote(this._pactid, "int", true);
		}

		sql += ") a " + "WHERE " + "a.rank = 1" + " ORDER BY a.pactid, sortcarid, sortprtelno";
		return this.get_DB().queryHash(sql);
	}

	getPhoneCnt(pactid, carid, prtelno = "undefined") {
		var dummyTelSql = "SELECT telno FROM dummy_tel_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " " + "AND carid=" + this.get_DB().dbQuote(carid, "int", true);
		var dummyTelno = this.get_DB().queryCol(dummyTelSql);
		var table = "tel_details_" + this.getTableNo(this._year, this._month) + "_tb";
		var sql = "SELECT COUNT(*) FROM (SELECT count(telno) FROM " + table + " " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND code NOT IN ('ASP', 'ASX')";

		if (0 < COUNT(dummyTelno)) {
			sql += "AND telno NOT IN ('" + "', '".join(dummyTelno) + "')";
		}

		if (!is_null(prtelno)) {
			if ("hand" == prtelno) {
				sql += " AND code LIKE " + this.get_DB().dbQuote("h_%", "text", false);
			} else {
				sql += " AND prtelno=" + this.get_DB().dbQuote(prtelno, "text", false);
			}
		} else {
			var avoid;
			var avoidSql = sql;
			avoidSql += " AND prtelno IS NULL GROUP BY telno) g";

			if (0 != (avoid = this.get_DB().queryOne(avoidSql))) {
				return avoid;
			}

			sql += " AND prtelno=''";
		}

		sql += " GROUP BY telno) g";
		return this.get_DB().queryOne(sql);
	}

	insertCheckList() {
		var amountList = this.getAmountDataList();
		var detailsList = this.getTelDetailsDataList();
		var upList = Array();

		for (var value of Object.values(detailsList)) {
			if (!(undefined !== amountList[value.pactid][value.carid][value.prtelno])) {
				var sql;

				if (false !== (sql = this.makeInsertQuery(value))) {
					this.get_DB().query(sql);
				}
			} else //差額があっても、前回と前々回の値が同じで確認済みなら引き継ぐ
				{
					if (value.charge != amountList[value.pactid][value.carid][value.prtelno][1]) {
						if (undefined !== amountList[value.pactid][value.carid][value.prtelno][1] && undefined !== amountList[value.pactid][value.carid][value.prtelno][2]) {
							if (amountList[value.pactid][value.carid][value.prtelno][1].charge == amountList[value.pactid][value.carid][value.prtelno][2].charge && 1 == amountList[value.pactid][value.carid][value.prtelno][1].confirmation) {
								sql = this.makeUpdateConfirmQuery(value, amountList);
								this.get_DB().query(sql);
							}
						} else if (undefined !== amountList[value.pactid][value.carid][value.prtelno][1]) {
							if (0 == amountList[value.pactid][value.carid][value.prtelno][1].confirmation && value.charge == amountList[value.pactid][value.carid][value.prtelno][1].charge) {
								sql = this.makeUpdateConfirmQuery(value, amountList);
								this.get_DB().query(sql);
							}
						}
					}
				}
		}

		this.insertTotalRecord();
	}

	insertTotalRecord() {
		var amountList = this.getLastAmountData();
		amountList.push({
			pactid: 0,
			carid: 0,
			year: 0,
			month: 0,
			charge: 0
		});
		var calcData = this.calcTotalData();
		var insertData = Array();
		var pactid = amountList[0].pactid;
		var carid = amountList[0].carid;

		for (var value of Object.values(amountList)) {
			if ("\u5408\u8A08" == value.prtelno || "\u5C0F\u8A08" == value.prtelno) {
				oldData[value.pactid][value.carid][value.prtelno] = value.charge;
				continue;
			}

			if (pactid != value.pactid || carid != value.carid) {
				var temp = {
					pactid: pactid,
					carid: carid,
					prtelno: "\u5C0F\u8A08",
					charge: total,
					confirmation: 0
				};

				if (calcData[value.pactid][value.carid].total != total) {
					temp.confirmation = 0;
				}

				insertData.push(temp);
				var total = totalDetails = totalDiff = 0;
			}

			if (pactid != value.pactid) {
				temp = {
					pactid: pactid,
					carid: 0,
					prtelno: "\u5408\u8A08",
					charge: pactTotal,
					confirmation: 0
				};

				if (calcData[value.pactid].pactTotal != pactTotal) {
					temp.confirmation = 0;
				}

				insertData.push(temp);
				var pactTotal = pactTotalDetails = pactTotalDiff = 0;
			}

			total = total + value.charge;
			pactTotal = pactTotal + value.charge;
			pactid = value.pactid;
			carid = value.carid;
		}

		for (var data of Object.values(insertData)) {
			if (!(undefined !== oldData[data.pactid][data.carid]["\u5C0F\u8A08"]) || !(undefined !== oldData[data.pactid][0]["\u5408\u8A08"])) {
				if (!is_null(data.charge)) {
					var sql;

					if (false !== (sql = this.makeInsertQuery(data))) {
						this.get_DB().query(sql);
					}
				}
			} else if (oldData[data.pactid][data.carid][data.prtelno] != data.charge) {
				sql = "UPDATE tel_amount_bill_tb " + "SET " + "charge=" + this.get_DB().dbQuote(data.charge, "int", false) + ", " + "confirmation=0 " + "WHERE " + "pactid=" + data.pactid + " AND carid=" + data.carid + " AND prtelno=" + this.get_DB().dbQuote(data.prtelno, "text", false) + " AND year=" + this.get_DB().dbQuote(this._year, "int", true) + " AND month=" + this.get_DB().dbQuote(this._month, "int", true);
				this.get_DB().query(sql);
			}
		}
	}

	calcTotalData() {
		var detailsData = this.getTelDetailsDataList();

		for (var value of Object.values(detailsData)) {
			result[value.pactid].pactTotal += value.charge;
			result[value.pactid][value[carid]].total += value.charge;
		}
	}

	makeInsertQuery(data) {
		if (!data.prtelno && "batch" == data.importtype) {
			return false;
		}

		var nowTime = this.get_DB().getNow();

		if (!(undefined !== data.confirmation) || !is_numeric(data.confirmation)) {
			data.confirmation = 0;
		}

		var confirmation = data.confirmation;

		if (undefined !== this._checkedConfirmation[data.pactid][data.carid][data.prtelno]) {
			confirmation = 1;
		}

		var prtelno = data.prtelno;

		if ("hand" == data.importtype) {
			prtelno = "hand";
		}

		var sql = "INSERT INTO tel_amount_bill_tb (pactid, carid, prtelno, year, month, charge, recdate, confirmation, recordtype) " + "VALUES(" + this.get_DB().dbQuote(data.pactid, "int", true) + ", " + this.get_DB().dbQuote(data.carid, "int", true) + ", " + this.get_DB().dbQuote(prtelno, "text", false) + ", " + this.get_DB().dbQuote(this._year, "int", true) + ", " + this.get_DB().dbQuote(this._month, "int", true) + ", " + this.get_DB().dbQuote(data.charge, "int", true) + ", " + this.get_DB().dbQuote(nowTime, "date", true) + ", " + this.get_DB().dbQuote(confirmation, "int", false) + ", " + this.get_DB().dbQuote(ImportCheckListModel.RECORD_TYPE, "text", false) + ")";
		return sql;
	}

	getAmountDataList() {
		var sql = "SELECT a.* " + "FROM " + "(SELECT am.*, RANK() OVER(PARTITION BY am.prtelno,am.pactid,am.carid ORDER BY am.recdate DESC) rank FROM tel_amount_bill_tb am " + "WHERE " + "am.year=" + this._year + " AND am.month=" + this._month;

		if (!!this._pactid) {
			sql += " AND am.pactid=" + this.get_DB().dbQuote(this._pactid, "int", true);
		}

		sql += ") a " + "WHERE " + " a.rank = 1" + " ORDER BY a.pactid, a.prtelno";
		var temp = this.get_DB().queryHash(sql);

		for (var val of Object.values(temp)) {
			result[val.pactid][val.carid][val.prtelno][val.rank] = {
				charge: val.charge,
				confirmation: val.confirmation,
				recdate: val.recdate
			};
		}

		return result;
	}

	makeUpdateConfirmQuery(value, amountList) {
		var sql = "UPDATE tel_amount_bill_tb SET confirmation=1 " + "WHERE " + "pactid=" + this.get_DB().dbQuote(value.pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(value.carid, "int", true) + " AND month=" + this.get_DB().dbQuote(this._month, "int", true) + " AND year=" + this.get_DB().dbQuote(this._year, "int", true) + " AND recdate=" + this.get_DB().dbQuote(amountList[value.pactid][value.carid][value.prtelno][1].recdate, "date", true);

		if (!value.prtelno) {
			sql += " AND prtelno IS NULL ";
		} else {
			sql += " AND prtelno=" + this.get_DB().dbQuote(value.prtelno, "text", false);
		}

		return sql;
	}

	setView(view) {
		this.view = view;
	}

	getTableNo(year, month) {
		var diff = 12 * (this.m_cur_year - year) + this.m_cur_month - month + 1;

		if (diff < 13) {
			if (1 == month) return 12;else {
				var rval = month - 1;
				if (rval < 10) rval = "0" + rval;
				return rval;
			}
		} else {
			if (1 == month) return 24;else return month - 1 + 12;
		}
	}

};