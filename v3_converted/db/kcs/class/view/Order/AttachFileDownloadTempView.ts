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
class AttachFileDownloadTempView extends ViewSmarty {
	static PUB_KEY = "/OrderAttach";
	static ERROR_KEY = "/ErrorOrderAttach";

	constructor() {
		super();
	}

	checkCGIParam() {
		if (0 < _GET.length && true == (undefined !== _GET.id)) {
			this._id = _GET.id;
		} else {
			this.getOut().errorOut(8, "\u5BFE\u8C61\u3068\u306A\u308BID\u304C\u4ED8\u52A0\u3055\u308C\u3066\u3044\u306A\u3044\u3002");
		}

		if (undefined !== _GET.type && ("shop" == _GET.type || "hidden" == _GET.type)) {
			this._type = _GET.type;
		} else {
			this._type = "order";
		}
	}

	displayHTML() {
		var file = KCS_DIR + "/files/temp_" + session_id() + "/" + this._type + "/" + this._id;

		var sessionData = this.gSess().getPub(AttachFileDownloadTempView.PUB_KEY);
		var filename = sessionData[this._type][this._id].name;

		if (file != false && file_exists(file) == true) {
			header("Pragma: private");

			if (preg_match("/MSIE/i", _SERVER.HTTP_USER_AGENT) == true) {
				header("Content-Disposition: attachment; filename=\"" + mb_convert_encoding(filename, "SJIS", "UTF-8") + "\"");
			} else {
				header("Content-Disposition: attachment; filename=\"" + filename + "\"");
			}

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
			var errors = this.gSess().getPub(AttachFileDownloadTempView.ERROR_KEY);

			if (is_null(errors)) {
				errors = Array();
			}

			errors.push("E003");
			this.gSess().setPub(AttachFileDownloadTempView.ERROR_KEY, errors);

			if (1 === this.getSiteMode()) {
				header("Location: /Shop/MTActorder/upload.php");
			} else {
				header("Location: /MTOrder/upload.php");
			}

			throw die(0);
		}
	}

	__destruct() {
		super.__destruct();
	}

};