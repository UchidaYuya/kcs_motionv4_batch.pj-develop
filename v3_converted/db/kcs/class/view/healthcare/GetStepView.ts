//error_reporting(E_ALL);
//TCPDFの読み込み
//require_once("MtSetting.php");
//
//ICCardPrintOutPersonalView
//交通費PDF出力
//@uses ViewSmarty
//@package
//@author date
//@since 2015/11/02
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("view/ViewFinish.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUtil.php");

require("MtUniqueString.php");

//
//__construct
//コンストラクタ
//@author web
//@since 2015/11/13
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author date
//@since 2015/11/13
//
//@access protected
//@return void
//
//
//startCheck
//ログインできていればOK
//@author web
//@since 2016/03/28
//
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class getStepView extends ViewSmarty {
	static PUB = "/Const";

	constructor() {
		super();
		this.H_Param = Array();
	}

	checkCGIParam() //$fp = fopen( "/kcs/htdocs/healthcare.log", 'a' );
	//        fputs( $fp,"@".date("Y-m-d H:i:s")."@".$data."\n" );
	//        fclose($fp);
	{
		var data = file_get_contents("php://input");
		this.H_Param = JSON.parse(data);
	}

	getParam() {
		return this.H_Param;
	}

	makeError(message, code, id) {
		var res = Array();
		res.jsonrpc = "2.0";
		res.error = {
			code: code,
			message: message
		};

		if (is_null(id)) {
			res.id = "null";
		} else {
			res.id = id;
		}

		return res;
	}

	checkParam(param) {
		var error_list = Array();

		if (!(undefined !== param.jsonrpc)) {
			error_list.push("jsonrpc\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (!(undefined !== param.siteid)) {
			error_list.push("siteid\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (!(undefined !== param.execno)) {
			error_list.push("execno\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (!(undefined !== param.params)) {
			error_list.push("params\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (!(undefined !== param.params.datefrom)) {
			error_list.push("\u958B\u59CB\u65E5\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (!(undefined !== param.id)) {
			errot_list.push("id\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (undefined !== param.params.datefrom) {
			var year = +param.params.datefrom.substr(0, 4);
			var month = +param.params.datefrom.substr(4, 2);
			var day = +param.params.datefrom.substr(6, 2);

			if (!checkdate(month, day, year)) {
				error_list.push("datefrom\u306E\u65E5\u4ED8\u304C\u6B63\u3057\u304F\u306A\u3044\u3067\u3059");
			}
		}

		if (undefined !== param.params.dateto) {
			year = +param.params.dateto.substr(0, 4);
			month = +param.params.dateto.substr(4, 2);
			day = +param.params.dateto.substr(6, 2);

			if (!checkdate(month, day, year)) {
				error_list.push("dateto\u306E\u65E5\u4ED8\u304C\u6B63\u3057\u304F\u306A\u3044\u3067\u3059");
			}
		}

		return error_list.join(",");
	}

	startCheck() //ブラウザの「キャッシュの有効期限が切れました」を出さない対処
	//header("Cache-Control: private");		//	いらなそう
	{
		this.checkCGIParam();
	}

	__destruct() {
		super.__destruct();
	}

};