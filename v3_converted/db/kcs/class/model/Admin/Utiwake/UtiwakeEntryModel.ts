//
//内訳コード登録モデル
//
//@uses UtiwakeModelBase
//@package
//@author igarashi
//@since 2011/11/14
//

require("model/Admin/Utiwake/UtiwakeModelBase.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/14
//
//@access public
//@return void
//
//
//insertUtiwake
//
//@author igarashi
//@since 2011/11/15
//
//@access public
//@return void
//
//
//makeRule
//
//@author igarashi
//@since 2011/11/15
//
//@access public
//@return void
//
//
//makeFormPeculiar
//
//@author igarashi
//@since 2011/11/28
//
//@access protected
//@return void
//
//
//makeForm
//
//@author igarashi
//@since 2011/11/14
//
//@access public
//@return void
//
//
//makeCarrierValue
//
//@author igarashi
//@since 2011/11/14
//
//@access protected
//@return void
//
//
//getCarrierId
//
//@author igarashi
//@since 2011/11/30
//
//@access protected
//@return void
//
//
//getDefault
//
//@author igarashi
//@since 2011/11/22
//
//@access public
//@return void
//
//
//validate
//
//@author igarashi
//@since 2011/11/22
//
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
class UtiwakeEntryModel extends UtiwakeModelBase {
	constructor() {
		super();
	}

	insertUtiwake() {
		if (is_null(this.view.gSess().getSelf("regist"))) {
			return undefined;
		}

		if (!this.checkOverlap({
			code: this.view.gSess().getSelf("code"),
			orgcarid: this.view.gSess().getSelf("carid")
		}, 1)) {
			return false;
		}

		var nowtime = this.getDB().getNow();
		var sqls = Array();
		sqls.push("INSERT INTO utiwake_tb " + "(code, name, kamoku, point, taxtype, planflg, codetype, carid, simkamoku, kananame, username, comment, fixdate, recdate) " + "VALUES(" + this.getDB().dbQuote(this.view.gSess().getSelf("code"), "text", true) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("name"), "text", true) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("kamoku"), "text", true) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("point"), "bool", false) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("taxtype"), "text", false) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("planflg"), "bool", false) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("codetype"), "text", true) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("carid"), "int", true) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("simkamoku"), "text", false) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("kananame"), "text", false) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("username"), "text", true) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("comment"), "text", false) + ", " + this.getDB().dbQuote(nowtime, "date", true) + ", " + this.getDB().dbQuote(nowtime, "date", true) + ")");
		sqls.push("INSERT INTO kamoku_rel_utiwake_tb " + "(pactid, kamokuid, code, carid, fixdate) " + "VALUES(" + "0," + this.getDB().dbQuote(this.view.gSess().getSelf("kamokuid"), "int", true) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("code"), "text", true) + ", " + this.getDB().dbQuote(this.view.gSess().getSelf("carid"), "int", true) + ", " + this.getDB().dbQuote(nowtime, "date", true) + ")");
		this.getDB().beginTransaction();

		for (var sql of Object.values(sqls)) {
			if (PEAR.isError(this.getDB().exec(sql))) {
				this.getDB().rollback;
				this.view.unRegisterSmarty();
			}
		}

		this.getDB().commit();
		this.view.registerSmarty();
	}

	makeRule() {
		var rules = Array();
		rules.push({
			element: "code",
			message: "\u30B3\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		});
		rules.push({
			element: "name",
			message: "\u540D\u524D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		});
		rules.push({
			element: "kamoku",
			message: "\u79D1\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		});
		rules.push({
			element: "kamokuid",
			message: "\u79D1\u76EEID\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		});
		rules.push({
			element: "codetype",
			message: "\u30B3\u30FC\u30C9\u30BF\u30A4\u30D7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		});
		rules.push({
			element: "carid",
			message: "\u30AD\u30E3\u30EA\u30A2\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		});
		rules.push({
			element: "username",
			message: "\u5165\u529B\u8005\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		});

		for (var rule of Object.values(rules)) {
			this.view.quickform.addRuleWrapper(rule.element, rule.message, rule.type, rule.format, rule.validation);
		}
	}

	makeFormPeculiar() {
		form.push({
			name: "code",
			label: "\u30B3\u30FC\u30C9",
			inputtype: "text"
		});
		form.push({
			name: "carid",
			label: "\u30AD\u30E3\u30EA\u30A2",
			inputtype: "select",
			data: this.makeCarrierValue()
		});
		form.push({
			name: "reset",
			label: "\u5165\u529B\u753B\u9762\u3078",
			inputtype: "button",
			options: {
				onClick: "location.href=\"./entry.php\""
			}
		});
		form.push({
			name: "confirm",
			label: "\u78BA\u8A8D",
			inputtype: "submit",
			options: {
				action: "./",
				onClick: "return checkCarrierCode(this.form)"
			}
		});
		var form = array_merge(form, this.makeForm());
		return form;
	}

	makeForm() {
		var form = Array();
		form.push({
			name: "name",
			label: "\u540D\u524D",
			inputtype: "text"
		});
		form.push({
			name: "kamoku",
			label: "\u79D1\u76EE",
			inputtype: "select",
			data: this.makeKamokuValue()
		});
		form.push({
			name: "kamokuid",
			label: "\u79D1\u76EEID",
			inputtype: "select",
			data: this.makeKamokuidValue()
		});
		form.push({
			name: "point",
			label: "\u30DD\u30A4\u30F3\u30C8",
			inputtype: "select",
			data: this.makePointValue()
		});
		form.push({
			name: "taxtype",
			label: "\u7A0E\u533A\u5206",
			inputtype: "select",
			data: this.makeTaxtypeValue()
		});
		form.push({
			name: "planflg",
			label: "\u30D7\u30E9\u30F3\u8A08\u7B97",
			inputtype: "select",
			data: this.makePlanflgValue()
		});
		form.push({
			name: "codetype",
			label: "\u30B3\u30FC\u30C9\u7A2E\u5225",
			inputtype: "select",
			data: this.makeCodetypeValue(this.getCarrierId())
		});
		form.push({
			name: "simkamoku",
			label: "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u79D1\u76EE",
			inputtype: "select",
			data: this.makeSimkamokuValue()
		});
		form.push({
			name: "kananame",
			label: "NTTcom\u53D6\u8FBC\u7528kananame",
			inputtype: "text"
		});
		form.push({
			name: "username",
			label: "\u5165\u529B\u8005\u540D",
			inputtype: "text"
		});
		form.push({
			name: "comment",
			label: "\u30B3\u30E1\u30F3\u30C8",
			inputtype: "textarea"
		});
		form.push({
			name: "back",
			label: "\u4E00\u89A7\u3078",
			inputtype: "button",
			options: {
				onClick: "location.href=\"./utiwake_list.php\""
			}
		});
		form.push({
			name: "regist",
			label: "\u767B\u9332",
			inputtype: "submit",
			options: {
				action: "./"
			}
		});
		return form;
	}

	makeCarrierValue() {
		var sql = "SELECT carid, carname FROM carrier_tb WHERE carid <> 0 ORDER BY sort, carid";
		var carrierList = this.getDB().queryAssoc(sql);
		return {
			"": "\u30FC\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u30FC"
		} + carrierList;
	}

	getCarrierId() {
		var carid = this.view.gSess().getSelf("orgcarid");

		if (is_null(carid)) {
			carid = this.view.gSess().getPub(this.view.getPubKey());
			carid = carid.search_carid;
		}

		if (!is_numeric(carid)) {
			carid = undefined;
		}

		return carid;
	}

	getDefaults() {
		var lclSess = this.view.gSess().getSelfAll();

		if (is_null(lclSess)) {
			var glbSess = this.view.getGlobalAdminSession();
			return {
				username: glbSess.admin_personname
			};
		}

		return lclSess;
	}

	validate() {
		var inputData = this.view.gSess().getSelfAll();

		if (undefined !== inputData.confirm) {
			this.view.validate();

			if (this.checkOverlap(this.view.gSess().getSelfAll(), 1)) {
				return true;
			}
		}

		return false;
	}

	__destruct() {
		super.__destruct();
	}

};