//これを読込むと、なぜかsession_startする・・
//error_reporting(E_ALL);

require("view/ViewBase.php");

require("MtUtil.php");

//
//__construct
//
//@author web
//@since 2018/06/20
//
//@access public
//@return void
//
//
//startCheck
//
//@author web
//@since 2018/06/20
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2018/06/20
//
//@access public
//@return void
//
class HolidayApiView extends ViewBase {
	constructor() {
		super();
	}

	checkLogin() //ブラウザの「キャッシュの有効期限が切れました」を出さない対処
	//セッションチェックしてログイン判定する
	{
		header("Cache-Control: private");

		if (!_SESSION.pactid && !_SESSION.shopid) {
			return false;
		}

		return true;
	}

	__destruct() {
		super.__destruct();
	}

};