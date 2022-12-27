//
//注文ファイルアップロード
//
//更新履歴：<br>
//2010/12/07	石崎公久	作成<br>
//
//@uses ViewSmarty
//@uses QuickFormUtil
//@package Order
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/12/07
//
//
//
//注文ファイルアップロード
//
//@uses ViewSmarty
//@package Order
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2010/12/03
//

require("view/ViewSmarty.php");

//
//_id
//
//@var mixed
//@access protected
//
//
//_type
//
//@var mixed
//@access protected
//
//
//__construct
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author
//@since 2010/12/07
//
//@access public
//@return void
//
//
//displayHTML
//
//@author
//@since 2010/12/07
//
//@access public
//@return void
//
//
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class AttachFileDownloadView extends ViewSmarty {
	static ORDER_KEY = "/MTOrder";
	static ERROR_KEY = "/ErrorOrderAttach";

	constructor() {
		super();
	}

	checkCGIParam() {
		if (0 < _GET.length && true == (undefined !== _GET.id) && true == (undefined !== _GET.type)) {
			this._id = _GET.id;
			this._type = _GET.type;
		} else {
			this.getOut().errorOut(8, "\u5BFE\u8C61\u3068\u306A\u308BID\u304C\u4ED8\u52A0\u3055\u308C\u3066\u3044\u306A\u3044\u3002");
		}
	}

	displayHTML() {
		var orderdata = this.gSess().getPub(AttachFileDownloadView.ORDER_KEY);
		var file = KCS_DIR + "/files/OrderFiles/" + orderdata.orderid + "/" + this._type + "/" + this._id;
		var attach = KCS_DIR + "/files/OrderFiles/" + orderdata.orderid + "/attach_" + this._type + ".txt";

		if (!file_exists(attach)) {
			throw new Error();
		}

		var fileInfo = unserialize(file_get_contents(attach));
		var filename = fileInfo[this._id].name;

		if (file != false && file_exists(file) == true) {
			header("Pragma: private");

			var __filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");

			header("Content-Disposition: attachment; filename=\"" + __filename + "\"");
			header("Content-type: application/octet-stream; name=\"" + basename(file) + "\"");
			header("Content-Length: " + filesize(file));
			header("Content-Transfer-Encoding: binary");
			var fp = fopen(file, "rb");

			while (!feof(fp)) {
				echo(fread(fp, 4096));
				flush();
			}

			fclose(fp);
		} else {
			var errors = this.gSess().getPub(AttachFileDownloadView.ERROR_KEY);

			if (is_null(errors)) {
				errors = Array();
			}

			errors.push("E003");
			this.gSess().setPub(AttachFileDownloadView.ERROR_KEY, errors);

			if (preg_match("/Shop\\/MTOrder/", _SERVER.PHP_SELF)) {
				header("Location: /Shop/MTOrder/upload.php");
			} else if (preg_match("/MTOrderList/", _SERVER.PHP_SELF)) {
				header("Location: /MTOrderList/upload.php");
			} else if (preg_match("/MTRecog/", _SERVER.PHP_SELF)) {
				header("Location: /MTRecog/upload.php");
			}

			throw die(0);
		}
	}

	__destruct() {
		super.__destruct();
	}

};