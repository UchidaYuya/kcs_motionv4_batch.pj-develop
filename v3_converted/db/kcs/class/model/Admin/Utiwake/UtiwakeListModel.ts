//
//仮登録内訳コード一覧モデル
//
//@uses UtiwakeListModelBase
//@package
//@author igarashi
//@since 2011/11/10
//

require("model/Admin/Utiwake/UtiwakeModelBase.php");

//
//getCodeList
//
//@author igarashi
//@since 2011/11/10
//
//@access public
//@return void
//
//
//getCodeListSet
//
//@author igarashi
//@since 2011/11/11
//
//@access public
//@return void
//
//
//makeForm
//
//@author igarashi
//@since 2011/11/10
//
//@access public
//@return void
//
//
//getDefault
//
//@author igarashi
//@since 2011/11/14
//
//@access public
//@return void
//
//
//getCarrerList
//
//@author igarashi
//@since 2011/11/11
//
//@access protected
//@return void
//
//
//setView
//
//@author igarashi
//@since 2011/11/10
//
//@param mixed $view
//@access public
//@return void
//
//
//deleteCode
//
//@author igarashi
//@since 2011/11/16
//
//@access public
//@return void
//
//
//setBulkButton
//
//@author igarashi
//@since 2011/11/17
//
//@param mixed $cnt
//@access public
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/11/16
//
//@access public
//@return void
//
class UtiwakeListModel extends UtiwakeModelBase {
	getCodeList(offsetflag = false) {
		var sql = "SELECT carid FROM utiwake_tb GROUP BY carid ORDER BY carid";
		var inputData = this.view.gSess().getPub(this.view.getPubKey());

		if (!is_numeric(inputData.search_carid) || 0 == inputData.search_carid) {
			var carrierList = this.get_DB().queryCol(sql);
		} else {
			carrierList = [inputData.search_carid];
		}

		sql = "SELECT u.*, c.carname, k.kamokuid, " + "CASE " + "WHEN u.kamoku = '0' THEN '\u57FA\u672C\u6599' " + "WHEN u.kamoku = '1' THEN '\u57FA\u672C\u6599\u5272\u5F15' " + "WHEN u.kamoku = '2' THEN '\u901A\u8A71\u6599' " + "WHEN u.kamoku = '3' THEN '\u901A\u8A71\u6599\u5272\u5F15' " + "WHEN u.kamoku = '4' THEN '\u901A\u4FE1\u6599' " + "WHEN u.kamoku = '5' THEN '\u901A\u4FE1\u6599\u5272\u5F15' " + "WHEN u.kamoku = '6' THEN '\u305D\u306E\u4ED6' " + "WHEN u.kamoku = '7' THEN '\u6D88\u8CBB\u7A0E' " + "WHEN u.kamoku = '8' THEN '\u5272\u5F15\u7387\u306B\u63DB\u7B97\u3057\u306A\u3044\u5272\u5F15' " + "END AS kamokuname, " + "CASE " + "WHEN u.simkamoku = '100' THEN '\u57FA\u672C\u6599' " + "WHEN u.simkamoku = '110' THEN '\u57FA\u672C\u6599\u5272\u5F15' " + "WHEN u.simkamoku = '121' THEN '\u901A\u8A71\u6599' " + "WHEN u.simkamoku = '122' THEN '\u901A\u8A71\u6599' " + "WHEN u.simkamoku = '123' THEN '\u901A\u8A71\u6599' " + "WHEN u.simkamoku = '130' THEN '\u901A\u8A71\u6599\u5272\u5F15' " + "WHEN u.simkamoku = '140' THEN '\u901A\u4FE1\u6599' " + "WHEN u.simkamoku = '141' THEN '\u901A\u4FE1\u6599' " + "WHEN u.simkamoku = '142' THEN '\u901A\u4FE1\u6599' " + "WHEN u.simkamoku = '143' THEN '\u901A\u4FE1\u6599' " + "WHEN u.simkamoku = '144' THEN '\u901A\u4FE1\u6599' " + "WHEN u.simkamoku = '145' THEN '\u901A\u4FE1\u6599' " + "WHEN u.simkamoku = '146' THEN '\u901A\u4FE1\u6599' " + "WHEN u.simkamoku = '147' THEN '\u901A\u4FE1\u6599' " + "WHEN u.simkamoku = '148' THEN '\u901A\u4FE1\u6599' " + "WHEN u.simkamoku = '150' THEN '\u901A\u4FE1\u6599\u5272\u5F15' " + "WHEN u.simkamoku = '160' THEN '\u5272\u5F15\u7387\u306B\u63DB\u7B97\u3057\u306A\u3044\u5272\u5F15' " + "WHEN u.simkamoku = '171' THEN '\u5B9A\u984D\u6599' " + "WHEN u.simkamoku = '172' THEN '\u5B9A\u984D\u6599' " + "WHEN u.simkamoku = '181' THEN '\u305D\u306E\u4ED6' " + "WHEN u.simkamoku = '182' THEN '\u305D\u306E\u4ED6' " + "WHEN u.simkamoku = '190' THEN '\u6D88\u8CBB\u7A0E' " + "ELSE '\u672A\u5B9A\u7FA9' " + "END AS simname, " + "CASE " + "WHEN u.taxtype = '0' THEN '\u8A2D\u5B9A\u306A\u3057' " + "WHEN u.taxtype = '1' THEN '\u5408\u7B97' " + "WHEN u.taxtype = '2' THEN '\u500B\u5225' " + "WHEN u.taxtype = '3' THEN '\u5185\u7A0E' " + "WHEN u.taxtype = '4' THEN '\u5408\u7B97' " + "WHEN u.taxtype = '5' THEN '\u5408\u7B97\uFF0F\u975E\u5BFE\u8C61\u7B49' " + "ELSE '\u672A\u5B9A\u7FA9' " + "END AS taxname, " + "CASE " + "WHEN u.codetype = '0' THEN '\u901A\u5E38' " + "WHEN u.codetype = '1' THEN '\u518D\u63B2' " + "WHEN u.codetype = '2' THEN '\u518D\u3005\u63B2' " + "WHEN u.codetype = '3' THEN '\u53C2\u7167\u50240\u306E\u307F\u5408\u8A08\u8A08\u7B97\u5BFE\u8C61' " + "WHEN u.codetype = '4' THEN '\u4EEE\u767B\u9332' " + "ELSE '\u672A\u5B9A\u7FA9' " + "END AS codetypename, " + "CASE " + "WHEN u.planflg = true THEN '\u3059\u308B' " + "WHEN u.planflg = false THEN '\u3057\u306A\u3044' " + "ELSE '\u672A\u5B9A\u7FA9' " + "END AS plantype " + "FROM " + "utiwake_tb u " + "INNER JOIN carrier_tb c ON u.carid=c.carid " + "LEFT JOIN kamoku_rel_utiwake_tb k ON k.pactid=0 AND u.carid=k.carid AND u.code=k.code " + "WHERE " + "u.carid in (" + ",".join(carrierList) + ") ";

		if ("" != inputData.search_code) {
			sql += " AND u.code LIKE " + this.getDB().dbQuote("%" + inputData.search_code + "%", "text", true);
		}

		if ("" != inputData.search_kamoku) {
			sql += " AND u.kamoku =" + this.getDB().dbQuote(inputData.search_kamoku, "text", true);
		}

		if ("" != inputData.search_simkamoku) {
			sql += " AND u.simkamoku =" + this.getDB().dbQuote(inputData.search_simkamoku, "text", true);
		}

		if ("" != inputData.search_taxtype) {
			sql += " AND u.taxtype =" + this.getDB().dbQuote(inputData.search_taxtype, "text", true);
		}

		if ("" != inputData.search_codetype) {
			sql += " AND u.codetype =" + this.getDB().dbQuote(inputData.search_codetype, "text", true);
		}

		if ("" != inputData.orderby) {
			sql += "ORDER BY " + "u." + inputData.orderby;
		} else {
			sql += "ORDER BY " + "u.carid, u.code";
		}

		if (offsetflag) {
			var offset = this.view.getPage();

			if (0 < offset) {
				offset--;
			}

			offset = offset * this.view.getLimit();
			sql += " LIMIT " + this.view.getLimit() + " " + "OFFSET " + offset;
		}

		return this.get_DB().queryHash(sql);
	}

	getCodeListSet() {
		result.allCodeList = this.getCodeList(false);
		result.count = COUNT(result.allCodeList);
		result.codeList = this.getCodeList(true);
		return result;
	}

	makeForm() {
		var form = Array();
		var carrierList = this.getCarrierList(true);
		form.push({
			name: "search_carid",
			label: "\u30AD\u30E3\u30EA\u30A2",
			inputtype: "select",
			data: this.getCarrierList()
		});
		form.push({
			name: "search_code",
			label: "\u30B3\u30FC\u30C9",
			inputtype: "text"
		});
		form.push({
			name: "search_kamoku",
			label: "\u79D1\u76EE",
			inputtype: "select",
			data: this.makeKamokuValue()
		});
		form.push({
			name: "search_simkamoku",
			label: "sim\u79D1\u76EE",
			inputtype: "select",
			data: this.makeSimkamokuValue()
		});
		form.push({
			name: "search_taxtype",
			label: "\u7A0E\u533A\u5206",
			inputtype: "select",
			data: this.makeTaxtypeValue()
		});
		form.push({
			name: "search_codetype",
			label: "\u30B3\u30FC\u30C9\u7A2E\u5225",
			inputtype: "select",
			data: this.makeCodetypeValue()
		});
		form.push({
			name: "search",
			label: "\u691C\u7D22",
			inputtype: "submit",
			options: {
				action: "./"
			}
		});
		form.push({
			name: "display",
			label: "\u8868\u793A\u4EF6\u6570",
			inputtype: "text",
			options: {
				size: 3,
				maxlength: 2
			}
		});
		form.push({
			name: "bulkbutton",
			label: "\u691C\u7D22\u7D50\u679C\u306E\u4E00\u62EC\u5909\u66F4\u753B\u9762\u3078\u79FB\u52D5",
			inputtype: "button",
			options: {
				onClick: "location.href=\"./bulkedit.php\""
			}
		});
		return form;
	}

	getDefaults() {
		var inputData = this.view.gSess().getPub(this.view.getPubKey());
		var default = {
			search_carid: this.view.getSearchCarrier(),
			search_code: inputData.search_code,
			search_kamoku: inputData.search_kamoku,
			search_simkamoku: inputData.search_simkamoku,
			search_taxtype: inputData.search_taxtype,
			search_codetype: inputData.search_codetype,
			display: this.view.getLimit()
		};
		return default;
	}

	getCarrierList(selectFlag = true) //if ($selectFlag) {
	//			$temp[0] = "--選択してください--";
	//			return array_merge($temp, $this->getDB()->queryAssoc($sql));
	//		} else {
	//			return $this->getDB()->queryAssoc($sql);
	//		}
	{
		var sql = "SELECT u.carid, c.carname " + "FROM " + "utiwake_tb u " + "INNER JOIN carrier_tb c ON u.carid=c.carid " + "GROUP BY " + "u.carid, c.carname " + "ORDER BY " + "u.carid";
		var res = this.getDB().queryAssoc(sql);

		if (selectFlag) {
			var temp = Array();
			temp[0] = "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";

			for (var key in res) {
				var value = res[key];
				temp[key] = value;
			}

			return temp;
		}

		return res;
	}

	setView(view = undefined) {
		if ("object" === typeof view) {
			this.view = view;
		}
	}

	deleteCode() {
		var inputData = this.view.gSess().getPub(this.view.getPubKey());

		if (1 <= this.getTargetCount(inputData) && inputData.delete) {
			if (!is_null(inputData.delcode) && !is_null(inputData.delcarid)) {
				var sqls = Array();
				sqls.push("DELETE FROM kamoku_rel_utiwake_tb " + "WHERE " + "code=" + this.getDB().dbQuote(inputData.delcode, "text", true) + " " + "AND carid=" + this.getDB().dbQuote(inputData.delcarid, "int", true));
				sqls.push("DELETE FROM utiwake_tb " + "WHERE " + "code=" + this.getDB().dbQuote(inputData.delcode, "text", true) + " " + "AND carid=" + this.getDB().dbQuote(inputData.delcarid, "int", true));
				this.getDB().beginTransaction();

				for (var sql of Object.values(sqls)) {
					if (PEAR.isError(this.getDB().exec(sql))) {
						this.getDB().rollback();
						return false;
					}
				}

				this.getDB().commit();
				header("Location: " + _SERVER.PHP_SELF);
				throw die();
			}
		}

		return undefined;
	}

	setBulkButton(cnt) {
		var inputData = this.view.gSess().getPub(this.view.getPubKey());

		if (0 != inputData.search_carid) {
			if (0 < cnt) {
				this.view.assigns.bulkbutton = true;
				return true;
			}
		}

		this.view.assigns.bulkbutton = false;
		return false;
	}

	__destruct() {
		super.__destruct();
	}

};