//
//添付ファイルダウンロード
//
//更新履歴：<br>
//2008/10/23	石崎公久	作成
//
//@uses FAQViewBase
//@package FAQ
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/10/23
//
//
//
//お問い合わせ　一覧
//
//@uses FAQViewBase
//@package FAQ
//@subpackage View
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/10/23
//

require("view/FAQ/FAQViewBase.php");

//
//$ID
//
//@var mixed
//@access public
//
//
//__construct
//
//@author ishizaki
//@since 2008/07/31
//
//@param mixed $H_param
//@access public
//@return void
//
//
//checkCGIParam
//
//@author ishizaki
//@since 2008/07/31
//
//@access public
//@return void
//
//
//displayHTML
//
//@author ishizaki
//@since 2008/08/01
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
class GetAttachmentView extends FAQViewBase {
	constructor(H_param = undefined) {
		super(H_param);
	}

	checkCGIParam() {
		if (0 < _GET.length && true == (undefined !== _GET.id)) {
			this.ID = _GET.id;
		} else {
			this.getOut().errorOut(8, "\u5BFE\u8C61\u3068\u306A\u308BID\u304C\u4ED8\u52A0\u3055\u308C\u3066\u3044\u306A\u3044\u3002");
		}
	}

	displayHTML() {
		var file = this.H_assign.attachment;
		var filename = this.H_assign.attachmentname;

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
		}
	}

	__destruct() {
		super.__destruct();
	}

};