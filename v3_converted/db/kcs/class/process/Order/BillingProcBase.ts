//
//注文の請求管理用プロセスベース
//
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2013/03/22
//

require("process/ProcessBaseHtml.php");

//
//__construct
//
//@author web
//@since 2013/03/22
//
//@param array $H_param
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/03/22
//
//@access public
//@return void
//
class BillingProcBase extends ProcessBaseHtml {
	static PUB = "/MTOrder";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	__destruct() {
		super.__destruct();
	}

};