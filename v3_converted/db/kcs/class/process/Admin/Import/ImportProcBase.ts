//
//取込金額確認プロセス
//
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2012/01/30
//

require("process/ProcessBaseHtml.php");

require("model/Admin/Import/ImportModelBase.php");

require("view/Admin/Import/ImportViewBase.php");

require("AdminLogin.php");

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
//doExecute
//
//@author web
//@since 2012/01/30
//
//@param array $H_param
//@access protected
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
class ImportProcBase extends ProcessBaseHtml {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) {}

	__destruct() {
		super.__destruct();
	}

};