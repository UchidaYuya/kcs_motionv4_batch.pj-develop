//
//内訳コードベースプロセス
//
//@uses ProcessBaseHtml
//@package
//@author igarashi
//@since 2011/11/10
//

require("process/ProcessBaseHtml.php");

require("model/Admin/Utiwake/UtiwakeModelBase.php");

require("view/Admin/Utiwake/UtiwakeViewBase.php");

require("AdminLogin.php");

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
//doExecute
//
//@author igarashi
//@since 2011/11/10
//
//@param array $H_param
//@access protected
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
class UtiwakeProcBase extends ProcessBaseHtml {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) {}

	__destruct() {
		super.__destruct();
	}

};