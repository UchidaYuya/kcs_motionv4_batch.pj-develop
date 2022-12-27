//
//内訳コードベースモデル
//
//@uses ModelBase
//@package
//@author igarashi
//@since 2011/11/10
//

require("model/ModelBase.php");

require("MtSetting.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/10
//
//@access public
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
//makeKamokuidValue
//
//@author igarashi
//@since 2011/11/15
//
//@access protected
//@return void
//
//
//makeKamokuValue
//
//@author igarashi
//@since 2011/11/15
//
//@access protected
//@return void
//
//
//makeCodetypeValue
//
//@author igarashi
//@since 2011/11/15
//
//@param int $carid
//@access protected
//@return void
//
//
//makeSimkamokuValue
//
//@author igarashi
//@since 2011/11/14
//
//@access protected
//@return void
//
//
//makePointValue
//
//@author igarashi
//@since 2011/11/14
//
//@access protected
//@return void
//
//
//makePlanflgValue
//
//@author igarashi
//@since 2011/11/14
//
//@access protected
//@return void
//
//
//makeSelectBool
//
//@author igarashi
//@since 2011/11/14
//
//@access protected
//@return void
//
//
//makeUpdateSqls
//
//@author igarashi
//@since 2011/11/18
//
//@param mixed $updateData
//@access protected
//@return void
//
//
//checkOverlap
//
//@author igarashi
//@since 2011/11/18
//
//@param mixed $checkData
//@param mixed $value
//@access protected
//@return void
//
//
//getTargetCount
//
//@author igarashi
//@since 2011/11/28
//
//@param mixed $targetData
//@access protected
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/11/17
//
//@access public
//@return void
//
class UtiwakeModelBase extends ModelBase {
	static CODETYPE_PROVISIONAL = 4;

	constructor() {
		super();
		this.utiwakeColumnList = ["code", "name", "kamoku", "point", "taxtype", "planflg", "codetype", "carid", "simkamoku", "kananame", "username", "comment", "fixdate", "recdate"];
		this.O_Set = MtSetting.singleton();
	}

	setView(view) {
		this.view = view;
	}

	makeKamokuidValue() {
		return {
			"": "\u30FC\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u30FC",
			"0": "\u57FA\u672C\u6599\u91D1",
			"1": "\u901A\u8A71\u6599\u91D1",
			"2": "\u5272\u5F15\u984D",
			"3": "\u305D\u306E\u4ED62",
			"8": "\u305D\u306E\u4ED6",
			"9": "\u6D88\u8CBB\u7A0E"
		};
	}

	makeKamokuValue() {
		return {
			"": "\u30FC\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u30FC",
			"0": "\u57FA\u672C\u6599",
			"1": "\u57FA\u672C\u6599\u5F15",
			"2": "\u901A\u8A71\u6599",
			"3": "\u901A\u8A71\u6599\u5272\u5F15",
			"4": "\u901A\u4FE1\u6599",
			"5": "\u901A\u4FE1\u6599\u5272\u5F15",
			"6": "\u305D\u306E\u4ED6",
			"7": "\u6D88\u8CBB\u7A0E",
			"8": "\u5272\u5F15\u7387\u306B\u63DB\u7B97\u3057\u306A\u3044\u5272\u5F15"
		};
	}

	makeCodetypeValue(carid = undefined) {
		if (-1 !== [undefined, 3, 15].indexOf(carid)) {
			return {
				"": "\u30FC\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u30FC",
				"0": "\u901A\u5E38",
				"1": "\u518D\u63B2",
				"2": "\u518D\u3005\u63B2",
				"3": "\u53C2\u7167\u50240\u306E\u307F\u5408\u8A08\u8A08\u7B97\u5BFE\u8C61",
				"4": "\u4EEE\u767B\u9332\u72B6\u614B"
			};
		} else {
			return {
				"": "\u30FC\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u30FC",
				"0": "\u901A\u5E38",
				"2": "\u518D\u3005\u63B2",
				"3": "\u53C2\u7167\u50240\u306E\u307F\u5408\u8A08\u8A08\u7B97\u5BFE\u8C61",
				"4": "\u4EEE\u767B\u9332\u72B6\u614B"
			};
		}
	}

	makeSimkamokuValue() {
		return {
			"": "\u30FC\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u30FC",
			"100": "\u57FA\u672C\u6599",
			"110": "\u57FA\u672C\u6599\u5272\u5F15",
			"121": "\u901A\u8A71\u6599(\u97F3\u58F0\u901A\u8A71)",
			"122": "\u901A\u8A71\u6599(\u56FD\u969B\u901A\u8A71)",
			"123": "\u901A\u8A71\u6599(\u305D\u306E\u4ED6)",
			"130": "\u901A\u8A71\u6599\u5272\u5F15",
			"140": "\u901A\u4FE1\u6599(\u672A\u5206\u985E)",
			"141": "\u901A\u4FE1\u6599(\u30E1\u30FC\u30EB)",
			"142": "\u901A\u4FE1\u6599(\u30D6\u30E9\u30A6\u30B6)",
			"143": "\u901A\u4FE1\u6599(\u305D\u306E\u4ED6)",
			"144": "\u901A\u4FE1\u6599(\u30D6\u30E9\u30A6\u30B8\u30F3\u30B0)",
			"145": "\u901A\u4FE1\u6599(\u4E00\u822C\u30D1\u30B1\u30C3\u30C8\u901A\u4FE1)",
			"146": "\u901A\u4FE1\u6599(\u56FD\u969B\u30D1\u30B1\u30C3\u30C8\u901A\u4FE1)",
			"147": "\u901A\u4FE1\u6599(\u30C7\u30B8\u30BF\u30EB\u901A\u4FE1(64K\u30FBTV\u96FB\u8A71))",
			"148": "\u901A\u4FE1\u6599(\u56FD\u969B\u30C7\u30B8\u30BF\u30EB\u901A\u4FE1)",
			"150": "\u901A\u4FE1\u6599\u5272\u5F15",
			"160": "\u5272\u5F15\u7387\u306B\u63DB\u7B97\u3057\u306A\u3044\u5272\u5F15",
			"171": "\u5B9A\u984D\u6599(\u901A\u8A71\u6599\u5B9A\u984D)",
			"172": "\u5B9A\u984D\u6599(\u901A\u4FE1\u5B9A\u984D\u6599)",
			"181": "\u305D\u306E\u4ED6",
			"182": "\u305D\u306E\u4ED6(\u9664\u5916)",
			"190": "\u6D88\u8CBB\u7A0E"
		};
	}

	makePointValue() {
		return {
			"": "\u30FC\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u30FC",
			[true]: "\u5BFE\u8C61",
			[false]: "\u5BFE\u8C61\u5916"
		};
	}

	makePlanflgValue() {
		return {
			"": "\u30FC\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u30FC",
			[true]: "\u3059\u308B",
			[false]: "\u3057\u306A\u3044"
		};
	}

	makeTaxtypeValue() {
		return {
			"": "\u30FC\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u30FC",
			0: "\u8A2D\u5B9A\u7121\u3057",
			1: "\u5408\u7B97",
			2: "\u500B\u5225",
			3: "\u5185\u7A0E",
			4: "\u975E\u5BFE\u79F0\u7B49",
			5: "\u5408\u7B97\uFF0F\u975E\u5BFE\u79F0\u306A\u3069"
		};
	}

	makeUpdateSqls(updateData) {
		var nowtime = this.getDB().getNow();
		var sqls = Array();
		var utiwakesql = "UPDATE utiwake_tb SET ";

		for (var keyName in updateData) {
			var element = updateData[keyName];

			if (-1 !== this.utiwakeColumnList.indexOf(keyName)) {
				if ("point" == keyName || "planflg" == name) {
					utiwakesql += keyName + "=" + this.getDB().dbQuote(element, "bool", false) + ", ";
				} else {
					var nullflg = false;

					if ("" == element) {
						var element = undefined;
					}

					if ("name" == keyName || "codetype" == keyName || "kamoku" == keyName) {
						nullflg = true;
					}

					utiwakesql += keyName + "=" + this.getDB().dbQuote(element, "text", nullflg) + ", ";
				}
			}
		}

		utiwakesql += "fixdate=" + this.getDB().dbQuote(nowtime, "date", true) + " " + "WHERE " + "carid=" + this.getDB().dbQuote(updateData.orgcarid, "int", true) + " " + "AND code=" + this.getDB().dbQuote(updateData.orgcode, "text", true);
		sqls.push(utiwakesql);
		sqls.push("UPDATE kamoku_rel_utiwake_tb SET " + "kamokuid=" + this.getDB().dbQuote(updateData.kamokuid, "int", true) + ", " + "fixdate=" + this.getDB().dbQuote(nowtime, "text", true) + " " + "WHERE " + "carid=" + this.getDB().dbQuote(updateData.orgcarid, "int", true) + " " + "AND code=" + this.getDB().dbQuote(updateData.orgcode, "text", true) + " " + "AND pactid=0");
		return sqls;
	}

	checkOverlap(checkData, value) {
		var count = this.getTargetCount(checkData);

		if (is_numeric(count) && count < value) {
			return true;
		}

		this.view.assigns.error = "\u30B3\u30FC\u30C9[" + checkData.code + "]\u306F\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059";
		return false;
	}

	getTargetCount(targetData) {
		if (undefined !== targetData.orgcarid) {
			var carid = targetData.orgcarid;
		} else if (targetData.delcarid) {
			carid = targetData.delcarid;
		} else {
			carid = targetData.carid;
		}

		if (undefined !== targetData.delcode) {
			var code = targetData.delcode;
		} else {
			code = targetData.code;
		}

		if (!(undefined !== carid) || !(undefined !== code)) {
			return false;
		}

		var sql = "SELECT COUNT(*) " + "FROM " + "utiwake_tb " + "WHERE " + "code=" + this.getDB().dbQuote(code, "text", true) + " " + "AND carid=" + this.getDB().dbQuote(carid, "int", true);
		return this.getDB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};