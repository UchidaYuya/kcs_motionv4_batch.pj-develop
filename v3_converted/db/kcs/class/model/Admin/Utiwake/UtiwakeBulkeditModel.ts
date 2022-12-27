//
//内訳コード一括変更モデル
//
//@uses UtiwakeListModel
//@package
//@author igarashi
//@since 2011/11/17
//

require("model/Admin/Utiwake/UtiwakeListModel.php");

require("model/Admin/Utiwake/UtiwakeEditModel.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/17
//
//@access public
//@return void
//
//
//makeFormBulk
//
//@author igarashi
//@since 2011/11/18
//
//@access public
//@return void
//
//
//makeDefaults
//
//@author igarashi
//@since 2011/11/18
//
//@param mixed $codeList
//@access public
//@return void
//
//
//updateCodes
//
//@author igarashi
//@since 2011/11/18
//
//@param mixed $codeList
//@access public
//@return void
//
//
//makeRule
//
//@author igarashi
//@since 2011/11/25
//
//@access public
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
class UtiwakeBulkeditModel extends UtiwakeListModel {
	constructor() {
		super();
	}

	makeFormBulk(codeList) {
		var model = new UtiwakeEditModel();
		model.setView(this.view);
		var baseForm = model.makeForm();
		var form = Array();
		{
			let _tmp_0 = codeList.codeList;

			for (var key in _tmp_0) {
				var codeData = _tmp_0[key];

				for (var formData of Object.values(baseForm)) {
					if ("button" != formData.inputtype && "submit" != formData.inputtype) {
						formData.name = formData.name + "_" + key;
						form.push(formData);
					}
				}
			}
		}

		for (var formData of Object.values(baseForm)) {
			if ("button" == formData.inputtype || "submit" == formData.inputtype) {
				form.push(formData);
			}
		}

		return form;
	}

	makeDefaults(codeList) {
		if (!Array.isArray(codeList.codeList)) {
			return false;
		}

		{
			let _tmp_1 = codeList.codeList;

			for (var key in _tmp_1) {
				var codeData = _tmp_1[key];

				for (var name in codeData) {
					var element = codeData[name];
					defaults[name + "_" + key] = element;
				}
			}
		}
		return defaults;
	}

	updateCodes(codeList) {
		var inputData = this.view.gSess().getSelfAll();

		if (!(undefined !== inputData.regist)) {
			return false;
		}

		var searchData = this.view.gSess().getPub(this.view.getPubKey());
		var sqls = Array();

		for (var i = 0; i < codeList.count; i++) {
			var updateData = {
				kamoku: inputData["kamoku_" + i],
				kamokuid: inputData["kamokuid_" + i],
				simkamoku: inputData["simkamoku_" + i],
				taxtype: inputData["taxtype_" + i],
				codetype: inputData["codetype_" + i],
				username: inputData["username_" + i],
				comment: inputData["comment_" + i],
				orgcode: inputData["orgcode_" + i],
				orgcarid: searchData.search_carid
			};
			var sql = this.makeUpdateSqls(updateData);

			if (!sql) {
				return false;
			}

			sqls.push(sql);
		}

		this.getDB().beginTransaction();

		for (var sql of Object.values(sqls)) {
			for (var exec of Object.values(sql)) {
				if (PEAR.isError(this.getDB().exec(exec))) {
					this.getDB().rollback();
					this.view.unRegisterSmarty();
				}
			}
		}

		this.getDB().commit();
		this.view.registerSmarty();
	}

	makeRule(codeList) {
		var count = count(codeList.codeList);
		var rules = Array();

		for (var i = 0; i < count; i++) {
			rules.push({
				element: "kamoku_" + i,
				message: "\u79D1\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
				type: "required",
				format: undefined,
				validation: "client"
			});
			rules.push({
				element: "kamokuid_" + i,
				message: "\u79D1\u76EEID\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
				type: "required",
				format: undefined,
				validation: "client"
			});
			rules.push({
				element: "codetype_" + i,
				message: "\u30B3\u30FC\u30C9\u30BF\u30A4\u30D7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
				type: "required",
				format: undefined,
				validation: "client"
			});
			rules.push({
				element: "username_" + i,
				message: "\u5165\u529B\u8005\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
				type: "required",
				format: undefined,
				validation: "client"
			});
		}

		for (var rule of Object.values(rules)) {
			this.view.quickform.addRuleWrapper(rule.element, rule.message, rule.type, rule.format, rule.validation);
		}
	}

	__destruct() {
		super.__destruct();
	}

};