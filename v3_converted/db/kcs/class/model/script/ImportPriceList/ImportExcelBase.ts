//
//ImportExcelBase
//
//@package Excel
//@author katsushi
//@since 2008/11/06
//

require("Spreadsheet/Excel/reader.php");

//
//O_excel
//
//@var mixed
//@access protected
//
//
//filename
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
//setReadFile
//
//@author katsushi
//@since 2008/11/06
//
//@param mixed $filename
//@access private
//@return void
//
//
//getFilename
//
//@author katsushi
//@since 2008/11/06
//
//@access public
//@return void
//
//
//getExcel
//
//@author katsushi
//@since 2008/11/06
//
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
class ImportExcelBase {
	constructor(filename) {
		this.O_excel = new Spreadsheet_Excel_Reader();
		this.O_excel.setUTFEncoder("mb");
		this.O_excel.setOutputEncoding("UTF-8");
		this.setReadFile(filename);
		this.O_excel.read(this.filename);
	}

	setReadFile(filename) {
		if (file_exists(filename) == false) {
			echo("\u6307\u5B9A\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\n");
			throw die();
		} else {
			var H_file = pathinfo(filename);

			if (preg_match("/^xls$/i", H_file.extension) == false) {
				echo("\u6307\u5B9A\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u306FEXCEL\u30D5\u30A1\u30A4\u30EB(\u62E1\u5F35\u5B50:xls)\u3067\u306F\u3042\u308A\u307E\u305B\u3093\n");
				throw die();
			}

			this.filename = filename;
		}
	}

	getFilename() {
		return basename(this.filename);
	}

	getExcel() {
		return this.O_excel;
	}

	__destruct() {}

};