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
class AttachFileDeleteOrderListView extends ViewSmarty {
	static ORDER_KEY = "/MTOrder";
	static PUB_KEY = "/OrderAttach";

	constructor() {
		super();
	}

	checkCGIParam() {
		if (undefined !== _POST.filenumber && undefined !== _POST.type) {
			var orderdata = this.gSess().getPub(AttachFileDeleteOrderListView.ORDER_KEY);
			var filebasedir = KCS_DIR + "/files/OrderFiles/" + orderdata.orderid + "/";
			var fileinfo = unserialize(file_get_contents(filebasedir + "attach_" + _POST.type + ".txt"));
			var dir = filebasedir + _POST.type;

			if (is_dir(dir) && is_file(dir + "/" + _POST.filenumber)) {
				unlink(dir + "/" + _POST.filenumber);
			}

			delete fileinfo[_POST.filenumber];
			var fh = fopen(filebasedir + "attach_" + _POST.type + ".txt", "w+");
			fwrite(fh, serialize(fileinfo));
			fclose(fh);
		}

		header("Location: /MTOrderList/upload.php");
		throw die(0);
	}

	__destruct() {
		super.__destruct();
	}

};