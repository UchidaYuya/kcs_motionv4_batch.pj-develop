//
//あらゆるＶＩＥＷの基底となるクラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@package Base
//@subpackage View
//@filesource
//@author nakanita
//@since 2008/02/08
//
//
//error_reporting(E_ALL|E_STRICT);
//
//あらゆるＶＩＥＷの基底となるクラス
//
//@package Base
//@subpackage View
//@author nakanita
//@since 2008/02/08
//

require("MtSetting.php");

require("MtOutput.php");

require("MtDateUtil.php");

//
//共通設定クラス
//
//@var MtSetting
//@access private
//
//
//共通出力クラス
//
//@var MtOutput
//@access private
//
//
//共通日付操作クラス
//
//@var mixed
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param	機能拡張のための引数
//@access public
//@return void
//
//
//共通設定を得る
//
//@author nakanita
//@since 2008/02/08
//
//@access protected
//@return void
//
//
//共通出力を得る
//
//@author nakanita
//@since 2008/02/08
//
//@access protected
//@return void
//
//
//日付操作クラスを得る
//
//@author nakanita
//@since 2008/06/30
//
//@access public
//@return void
//
//
//DEBUG出力
//
//@author nakanita
//@since 2008/02/08
//
//@param string $msg
//@param integer $disp
//@access protected
//@return void
//
//
//INFO出力
//
//@author nakanita
//@since 2008/02/08
//
//@param string $msg
//@param integer $disp
//@access protected
//@return void
//
//
//WARN出力
//
//@author nakanita
//@since 2008/02/08
//
//@param integer $code
//@param string $errstr
//@param integer $disp
//@access protected
//@return void
//
//
//ERROR出力
//
//@author nakanita
//@since 2008/02/08
//
//@param integer $code
//@param string $errstr
//@param integer $mailflg default=1 メール送信有り/無し
//@param string $goto
//@param string $buttonstr
//@access protected
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class ViewBase {
	constructor(H_param: {} | any[] = Array()) {
		this.O_Setting = MtSetting.singleton();
		this.O_Out = MtOutput.singleton();
		this.O_DateUtil = MtDateUtil.singleton();
	}

	getSetting() {
		return this.O_Setting;
	}

	getOut() {
		return this.O_Out;
	}

	getDateUtil() {
		return this.O_DateUtil;
	}

	debugOut(msg, disp = 1) {
		this.getOut().debugOut(msg, disp);
	}

	infoOut(msg, disp = 1) {
		this.getOut().infoOut(msg, disp);
	}

	warningOut(code, errstr = "", disp = 0) {
		this.getOut().warningOut(code, errstr, disp);
	}

	errorOut(code, errstr = "", mailflg = 1, goto = "", buttonstr = "") {
		this.getOut().errorOut(code, errstr, mailflg, goto, buttonstr);
	}

	__destruct() {}

};