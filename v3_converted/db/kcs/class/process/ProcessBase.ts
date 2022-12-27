//error_reporting(E_ALL);
//
//全てのプロセスの基底クラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@abstract
//@package Base
//@subpackage Process
//@author nakanita
//@filesource
//@since 2008/02/08
//
//
//
//全てのプロセスの基底クラス
//
//@abstract
//@package Base
//@subpackage Process
//@author nakanita
//@since 2008/02/08
//

require("MtExcept.php");

require("MtOutput.php");

require("MtSetting.php");

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
//@param integer $site	WEB/BATCHのいずれかを指定。省略すると自動判定
//@param array $H_param
//@access public
//@return void
//
//
//基本設定を得る
//
//@author nakanita
//@since 2008/02/08
//
//@access public
//@return void
//
//
//共通出力を得る
//
//@author nakanita
//@since 2008/02/08
//
//@access public
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
//プロセス実行の起点となる関数
//いわゆるメイン関数
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス実行の実質的な部分を請け負う関数
//中身は子クラスで実装する必要がある
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param
//@abstract
//@access protected
//@return void
//
//
//Motion拡張例外を処理するハンドラー
//
//@author nakanita
//@since 2008/02/08
//
//@param MtExcept $ex Motion拡張例外
//@access protected
//@return void
//
//
//一般的な例外を処理するハンドラー
//Motion拡張例外でとりこぼした処理を扱う
//
//@author nakanita
//@since 2008/02/08
//
//@param Exception $ex 一般的な例外
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
class ProcessBase {
	constructor(site = "", H_param: {} | any[] = Array()) //PHP自身の出力したエラーを、自前のエラーハンドラで受ける
	// ToDo * うまく動作していないので、抑制する
	//if( $this->O_Setting->STAGE == MtOutput::STAGE_HON ){ // 本番のみ
	//if( false ){
	//set_error_handler("MtExcept::finalErrorHandler");
	//}
	{
		this.O_Setting = MtSetting.singleton();
		this.O_Out = MtOutput.singleton(site, H_param);
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

	execute(H_param: {} | any[] = Array()) {
		try {
			this.doExecute(H_param);
		} catch (ex) {
			if (ex instanceof MtExcept) {
				this.caught(ex);
			} else if (true) {
				this.caughtUnknown(ex);
			}
		}
	}

	caught(ex: MtExcept) {
		this.errorOut(0, ex.getMessage());
	}

	caughtUnknown(ex: Exception) {
		this.errorOut(0, ex.getMessage());
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