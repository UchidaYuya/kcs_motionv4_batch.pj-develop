//
//ImportPriceList
//
//@uses ImportExcelBase
//@package
//@author katsushi
//@since 2008/11/06
//

require("MtSetting.php");

require("model/script/ImportPriceList/ImportExcelBase.php");

require("model/script/ImportPriceList/ReadSheetDocomo.php");

require("model/script/ImportPriceList/ReadSheetAu.php");

require("model/script/ImportPriceList/ReadSheetSoftBank.php");

require("model/script/ImportPriceList/ReadSheetWillcom.php");

require("model/script/ImportPriceList/ReadSheetEmobile.php");

require("model/script/ImportPriceList/ReadSheetPublic.php");

//
//O_model
//
//@var mixed
//@access protected
//
//
//O_ini
//
//@var mixed
//@access protected
//
//
//H_sheets
//
//@var mixed
//@access protected
//
//
//groupid
//
//@var mixed
//@access protected
//
//
//shopid
//
//@var mixed
//@access protected
//
//
//__construct
//
//@author katsushi
//@since 2008/11/06
//
//@access public
//@return void
//
//
//getModel
//
//@author katsushi
//@since 2008/11/07
//
//@access protected
//@return void
//
//
//getSheets
//
//@author katsushi
//@since 2008/11/10
//
//@access public
//@return void
//
//
//readAll
//
//@author katsushi
//@since 2008/11/06
//
//@access public
//@return void
//
//
//getAuther
//
//@author katsushi
//@since 2008/11/07
//
//@param mixed $groupid
//@param mixed $shopid
//@access protected
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/11/06
//
//@access public
//@return void
//
class ImportPriceList extends ImportExcelBase {
	constructor(filename, groupid, shopid) {
		super(filename);
		this.O_ini = MtSetting.singleton();
		this.O_ini.loadConfig("pricelist_import");
		this.H_sheets = Array();
		this.groupid = groupid;
		this.shopid = shopid;
		this.O_model = new AdminPriceModel();
	}

	getModel() {
		return this.O_model;
	}

	getSheets() {
		var A_sheet_obj = this.getExcel().boundsheets;
		var A_sheets = Array();

		for (var i = 0; i < A_sheet_obj.length; i++) {
			A_sheets[i] = A_sheet_obj[i].name.trim();
		}

		return A_sheets;
	}

	readAll() {
		for (var i = 0; i < this.getExcel().boundsheets.length; i++) //シート名で処理の振り分け
		{
			switch (this.getExcel().boundsheets[i].name.trim()) {
				case this.O_ini.sheet_docomo:
					this.H_sheets[i] = new ReadSheetDocomo(this.O_excel, i, this.groupid);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_docomo_acc:
					this.H_sheets[i] = new ReadSheetPublic(this.O_excel, i, this.groupid, 1, 2);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_au:
					this.H_sheets[i] = new ReadSheetAu(this.O_excel, i, this.groupid);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_au_acc:
					this.H_sheets[i] = new ReadSheetPublic(this.O_excel, i, this.groupid, 7, 4);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_softbank:
					this.H_sheets[i] = new ReadSheetSoftBank(this.O_excel, i, this.groupid);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_softbank_acc:
					this.H_sheets[i] = new ReadSheetPublic(this.O_excel, i, this.groupid, 10, 6);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_willcom:
					this.H_sheets[i] = new ReadSheetWillcom(this.O_excel, i, this.groupid);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_willcom_acc:
					this.H_sheets[i] = new ReadSheetPublic(this.O_excel, i, this.groupid, 4, 8);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_emobile:
					this.H_sheets[i] = new ReadSheetEmobile(this.O_excel, i, this.groupid);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_emobile_acc:
					this.H_sheets[i] = new ReadSheetPublic(this.O_excel, i, this.groupid, 13, 10);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_smartphone:
					this.H_sheets[i] = new ReadSheetPublic(this.O_excel, i, this.groupid, 19, 11);
					this.H_sheets[i].readSheet();
					break;

				case this.O_ini.sheet_smartphone_acc:
					this.H_sheets[i] = new ReadSheetPublic(this.O_excel, i, this.groupid, 19, 12);
					this.H_sheets[i].readSheet();
					break;

				default:
					break;
			}
		}

		var A_ins_sheets = Array();
		{
			let _tmp_0 = this.H_sheets;

			for (var key in _tmp_0) {
				var O_obj = _tmp_0[key];

				if ("object" === typeof O_obj == true) {
					A_ins_sheets[key].H_pricelist = O_obj.getPriceListBase();
					A_ins_sheets[key].H_pricelist.shopid = this.shopid;
					A_ins_sheets[key].H_pricelist.auther = "[EXCEL\u53D6\u8FBC]" + this.getAuther(this.groupid, this.shopid);
					A_ins_sheets[key].H_data = O_obj.getPriceDetail();
					A_ins_sheets[key].H_error = O_obj.getErrorStack();
				}
			}
		}
		return A_ins_sheets;
	}

	getAuther(groupid, shopid) {
		return undefined;
	}

	__destruct() {}

};