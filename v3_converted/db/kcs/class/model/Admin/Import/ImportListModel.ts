//
//取込金額確認一覧モデル
//
//@uses ImportModelBase
//@package
//@author web
//@since 2012/01/30
//

require("model/Admin/Import/ImportModelBase.php");

//
//__construct
//
//@author web
//@since 2012/01/30
//
//@access public
//@return void
//
//
//setTargetDate
//
//@author web
//@since 2012/01/31
//
//@access public
//@return void
//
//
//historyBar
//
//@author web
//@since 2012/01/30
//
//@access public
//@return void
//
//
//getList
//
//@author web
//@since 2012/05/25
//
//@access public
//@return void
//
//
//getTelDetailsDataList
//
//@author web
//@since 2012/01/31
//
//@access public
//@return void
//
//
//getLastAmountData
//
//@author web
//@since 2012/02/13
//
//@access protected
//@return void
//
//
//updateconfirmation
//
//@author web
//@since 2012/02/02
//
//@access public
//@return void
//
//
//saveConfirmation
//
//@author web
//@since 2012/04/25
//
//@access public
//@return void
//
//
//getTargetYear
//
//@author web
//@since 2012/02/17
//
//@access public
//@return void
//
//
//getTargetMonth
//
//@author web
//@since 2012/02/17
//
//@access public
//@return void
//
//
//setForm
//
//@author web
//@since 2012/02/23
//
//@access public
//@return void
//
//
//getCarrierKeyHash
//
//@author web
//@since 2013/03/14
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2012/01/30
//
//@access public
//@return void
//
class ImportListModel extends ImportModelBase {
	static RECORD_TYPE = "auto";

	constructor() {
		super();
		this._teldetailsData = undefined;
		this._targetCarriers = [this.getSetting().car_docomo, this.getSetting().car_willcom, this.getSetting().car_au, this.getSetting().car_softbank, this.getSetting().car_emobile, this.getSetting().car_fusion];
	}

	setTargetDate() {
		this.year = this.view.gSess().getSelf("y");

		if (is_null(this.year)) {
			this.year = date("Y");
		}

		this.month = this.view.gSess().getSelf("m");

		if (is_null(this.month)) {
			this.month = date("m");
		}
	}

	historyBar() {
		for (var i = 23; i >= 0; i--) {
			var timestamp = mktime(0, 0, 0, date("m") - i, 1, date("Y"));
			bar[date("Y", timestamp)][date("m", timestamp)] = false;
		}

		if (undefined !== bar[this.view.gSess().getSelf("y")][this.view.gSess().getSelf("m")]) {
			bar[this.view.gSess().getSelf("y")][this.view.gSess().getSelf("m")] = true;
		} else {
			bar[date("Y")][date("m")] = true;
		}

		this.view.assigns.history = bar;
	}

	getList() {
		var amtable = this.getLastAmountData("sql");
		var col = "i.pactid, a.carid, i.prtelno, i.charge, i.diff, a.compname, a.carname, i.count, a.recdate, a.note, a.confirmation, a.sortprtelno";
		var sql = "SELECT " + col + ", a.charge AS total, " + "CASE WHEN a.carid=0 THEN 999 ELSE a.carid END AS sortcarid " + "FROM " + "import_check_list_tb i " + "INNER JOIN pact_tb p ON p.pactid=i.pactid ";

		if (0 != this.groupId) {
			sql += "AND p.groupid=" + this.view.gSess().admin_groupid + " ";
		}

		sql += "INNER JOIN (" + amtable + ") a ON a.pactid=i.pactid AND a.carid=i.carid AND a.prtelno=i.prtelno " + "WHERE " + "i.carid IN (" + this._targetCarriers.join(", ") + ")" + " AND i.year=" + this.get_DB().dbQuote(this.year, "int", true) + " AND i.month=" + this.get_DB().dbQuote(this.month, "int", true);

		if (undefined !== this.searchForm.compname && !!this.searchForm.compname) {
			sql += " AND p.compname like " + this.get_DB().dbQuote("%" + this.searchForm.compname + "%", "text", false);
		}

		if (undefined !== this.searchForm.carname && 0 != this.searchForm.carname) {
			sql += " AND i.carid=" + this.get_DB().dbQuote(this.searchForm.carname, "int", false);
		}

		sql += " GROUP BY " + col + ",total,i.pactid,a.carid " + "ORDER BY " + "i.pactid, sortcarid, a.sortprtelno ASC";
		return this.get_DB().queryHash(sql);
	}

	getTelDetailsDataList() {
		if (is_null(this._teldetailsData)) {
			var table = "tel_details_" + this.getTableNo(this.year, this.month) + "_tb";
			var sql = "SELECT d.pactid, d.carid, d.prtelno, SUM(charge) AS charge, " + "CASE " + "WHEN d.code LIKE 'h_%' THEN 'hand' " + "ELSE " + "'batch' END AS importtype " + "FROM " + table + " d " + "INNER JOIN pact_tb p ON p.pactid=d.pactid ";

			if (0 != this.groupId) {
				sql += "AND p.groupid=" + this.view.gSess().admin_groupid + " ";
			}

			sql += "WHERE " + "d.code NOT IN ('ASP', 'ASX', 'C50000', '') " + "AND ((d.prtelno IS NOT NULL AND d.prtelno <> '') OR d.code like ('h_%'))";

			if (undefined !== this.searchForm.compname && !!this.searchForm.compname) {
				sql += " AND p.compname like " + this.get_DB().dbQuote("%" + this.searchForm.compname + "%", "text", false);
			}

			if (undefined !== this.searchForm.carname && 0 != this.searchForm.carname) {
				sql += "AND d.carid=" + this.get_DB().dbQuote(this.searchForm.carname, "int", false);
			}

			sql += "GROUP BY " + "d.pactid, d.carid, d.prtelno, importtype " + "ORDER BY " + "d.pactid";
			this._teldetailsData = this.get_DB().queryHash(sql);
		}

		return this._teldetailsData;
	}

	getLastAmountData(type = undefined) {
		var sql = "SELECT a.*, " + "CASE " + "WHEN a.carid = 0 THEN 999 " + "ELSE " + "a.carid END AS sortcarid, " + "CASE " + "WHEN a.prtelno IS NULL THEN '0' " + "ELSE " + "a.prtelno END AS sortprtelno " + "FROM " + "(SELECT am.*,p.compname,c.carname, RANK() OVER(PARTITION BY am.pactid,am.carid,am.prtelno ORDER BY am.recdate DESC) rank FROM tel_amount_bill_tb am " + "INNER JOIN pact_tb p ON am.pactid=p.pactid ";

		if (0 != this.groupId) {
			sql += "AND p.groupid=" + this.view.gSess().admin_groupid + " ";
		}

		sql += "INNER JOIN carrier_tb c ON am.carid=c.carid " + "WHERE " + "am.year=" + this.year + " AND am.month=" + this.month;

		if (undefined !== this.searchForm.compname && !!this.searchForm.compname) {
			sql += " AND p.compname like " + this.get_DB().dbQuote("%" + this.searchForm.compname + "%", "text", false);
		}

		if (undefined !== this.searchForm.carname && 0 != this.searchForm.carname) {
			sql += " AND am.carid=" + this.get_DB().dbQuote(this.searchForm.carname, "int", false);
		}

		sql += ") a " + "WHERE " + "a.rank = 1" + " ORDER BY a.pactid, sortcarid, sortprtelno";

		if (is_null(type)) {
			return this.get_DB().queryHash(sql);
		} else {
			return sql;
		}
	}

	updateConfirmation() {
		var submit = this.view.gSess().getSelf("submit");

		if (!is_null(submit)) {
			var upData = this.view.gSess().getSelfAll();

			if (!(undefined !== upData.y)) {
				upData.y = date("Y");
			}

			if (!(undefined !== upData.m)) {
				upData.m = date("m");
			}

			for (var key in upData) {
				var value = upData[key];
				var param = key.split("_");

				if (6 == param.length) {
					var top = "UPDATE tel_amount_bill_tb " + "SET ";

					if ("t" == param[0]) {
						var set = "note=" + this.get_DB().dbQuote(value, "text", false);
					} else {
						if (undefined !== upData["cb_" + param[1] + "_" + param[2] + "_" + param[3] + "_" + param[4] + "_" + param[5]]) {
							set += "confirmation=" + this.get_DB().dbQuote(1, "int", false);
						} else {
							set += "confirmation=" + this.get_DB().dbQuote(0, "int", false);
						}
					}

					if (!!set) {
						var sql = top += set + " WHERE " + "pactid=" + this.get_DB().dbQuote(param[1], "int", true) + " AND carid=" + this.get_DB().dbQuote(param[2], "int", true) + " AND prtelno=" + this.get_DB().dbQuote(param[3], "text", false) + " AND year=" + this.get_DB().dbQuote(upData.y, "int", true) + " AND month=" + this.get_DB().dbQuote(upData.m, "int", true) + " AND recdate=" + this.get_DB().dbQuote(param[4] + " " + param[5], "date", true);
						this.get_DB().query(sql);
					}

					sql = set = undefined;
				}
			}

			var searchSession = this.view.gSess().getSelfAll();
			this.view.gSess().clearSessionSelf();

			for (var key in searchSession) {
				var value = searchSession[key];

				if (key == "carname" || key == "compname" || key == "display") {
					this.view.gSess().setSelf(key, value);
				}
			}
		}
	}

	saveConfirmation() {
		var amountList = this.getLastAmountData();

		for (var amount of Object.values(amountList)) {
			if (1 == amount.confirmation) {
				this._checkedConfirmation[amount.pactid][amount.carid][amount.prtelno] = 1;
			}
		}
	}

	getTargetYear() {
		return this.year;
	}

	getTargetMonth() {
		return this.month;
	}

	setForm() {
		this.searchForm = this.view.gSess().getSelfAll();
	}

	getCarrierKeyHash() {
		var sql = "SELECT carid, carname FROM carrier_tb WHERE carid IN (" + this._targetCarriers.join(", ") + ") ORDER BY sort";
		return this.get_DB().queryAssoc(sql);
	}

	__destruct() {
		super.__destruct();
	}

};