//error_reporting(E_ALL);

require("view/ViewSmarty.php");

require("MtSession.php");

//
//setFileName
//
//@author web
//@since 2015/09/28
//
//@param mixed $name
//@access public
//@return void
//
//
//mbConvertEncodingDL
//
//@author web
//@since 2015/09/28
//
//@param mixed $str
//@access protected
//@return void
//
//
//outputDataLine
//
//@author web
//@since 2015/09/28
//
//@param array $H_data
//@param mixed $O_model
//@access protected
//@return void
//
//
//displayCSV
//
//@author web
//@since 2015/09/28
//
//@param array $H_data
//@param mixed $O_model
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2015/09/28
//
//@access public
//@return void
//
class FlatExemptDownloadView extends ViewSmarty {
	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.setSiteMode(FlatExemptDownloadView.SITE_ADMIN);
	}

	getLocalSession() {
		return this.O_Sess.getPub("/Admin/Regist/flat_menu.php");
	}

	setFileName(name) {
		this.filename = mb_convert_encoding(name, "SJIS-win", "UTF-8");
	}

	mbConvertEncodingDL(str) {
		return mb_convert_encoding(str, "SJIS-win", "UTF-8");
	}

	outputDataLine(H_data: {} | any[], O_model) {
		for (var line of Object.values(H_data)) {
			var str = line + "\n";
			print(this.mbConvertEncodingDL(str));
		}
	}

	displayCSV(H_data: {} | any[], O_model) //if( self::DEBUG != "on" ){
	//}
	//データ行の出力
	{
		header("Pragma: private");
		header("Content-disposition: attachment; filename=" + this.filename);
		header("Content-type: application/octet-stream; name=" + this.filename);
		this.outputDataLine(H_data, O_model);
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};