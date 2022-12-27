//
//内訳コード編集モデル
//
//@uses UtiwakeEntryModel
//@package
//@author igarashi
//@since 2011/11/15
//

require("model/Admin/Utiwake/UtiwakeEntryModel.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/15
//
//@access public
//@return void
//
//
//getCodeInfo
//
//@author igarashi
//@since 2011/11/15
//
//@access public
//@return void
//
//
//makeForm
//
//@author igarashi
//@since 2011/11/15
//
//@access public
//@return void
//
//
//updateUtiwake
//
//@author igarashi
//@since 2011/11/15
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
class UtiwakeEditModel extends UtiwakeEntryModel {
	constructor() {
		super();
	}

	getCodeInfo() {
		var sql = "SELECT u.*, r.kamokuid, c.carname " + "FROM " + "utiwake_tb u " + "INNER JOIN carrier_tb c ON u.carid=c.carid " + "LEFT JOIN kamoku_rel_utiwake_tb r ON u.code=r.code AND u.carid=r.carid " + "WHERE " + "u.code=" + this.getDB().dbQuote(this.view.gSess().getSelf("orgcode"), "text", true) + " " + "AND u.carid=" + this.getDB().dbQuote(this.view.gSess().getSelf("orgcarid"), "int", true);

		if (is_null(this.view.gSess().getSelf("confirm"))) {
			return this.getDB().queryRowHash(sql);
		} else {
			var inputData = this.view.gSess().getSelfAll();
			var codeInfo = this.getDB().queryRowHash(sql);

			if (!(undefined !== inputData.code)) {
				inputData.code = codeInfo.code;
			}

			if (!(undefined !== inputData.carname)) {
				inputData.carname = codeInfo.carname;
			}

			return inputData;
		}
	}

	makeFormPeculiar() {
		var form = this.makeForm();
		form.push({
			name: "reset",
			label: "\u5165\u529B\u753B\u9762\u3078",
			inputtype: "button",
			options: {
				onClick: "location.href=\"./edit.php\""
			}
		});
		form.push({
			name: "confirm",
			label: "\u78BA\u8A8D",
			inputtype: "submit",
			options: {
				action: "./"
			}
		});
		return form;
	}

	updateUtiwake() {
		if (is_null(this.view.gSess().getSelf("regist"))) {
			return undefined;
		}

		var sqls = this.makeUpdateSqls(this.view.gSess().getSelfAll());

		if (Array.isArray(sqls)) {
			this.getDB().beginTransaction();

			for (var sql of Object.values(sqls)) {
				if (PEAR.isError(this.getDB().exec(sql))) {
					this.getDB().rollback();
					this.view.unRegisterSmarty();
				}
			}

			this.getDB().commit();
			this.view.registerSmarty();
		}
	}

	__destruct() {
		super.__destruct();
	}

};