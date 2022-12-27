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
//__destruct
//
//@author ishizaki
//@since 2008/07/30
//
//@access public
//@return void
//
class AttachFileDeleteView extends ViewSmarty {
	static PUB_KEY = "/OrderAttach";

	constructor() {
		super();
	}

	checkCGIParam() {
		if (undefined !== _POST.filenumber && undefined !== _POST.type) {
			if ("order" == _POST.type || "shop" == _POST.type || "hidden" == _POST.type) {
				var session = this.gSess().getPub(AttachFileDeleteView.PUB_KEY);

				var dir = KCS_DIR + "/files/temp_" + session_id() + "/" + _POST.type;

				if (is_dir(dir) && is_file(dir + "/" + _POST.filenumber)) {
					unlink(dir + "/" + _POST.filenumber);
					delete session[_POST.type][_POST.filenumber];
					this.gSess().setPub(AttachFileDeleteView.PUB_KEY, session);
				}
			}
		}

		if (1 === this.getSiteMode()) {
			header("Location: /Shop/MTActorder/upload.php");
		} else {
			header("Location: /MTOrder/upload.php");
		}

		throw die(0);
	}

	__destruct() {
		super.__destruct();
	}

};