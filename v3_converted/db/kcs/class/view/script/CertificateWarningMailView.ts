//
//証明書期限切れ警告メール
//
//更新履歴：<br>
//2010/06/17 宮澤龍彦 作成
//
//@package CertificateWarningMail
//@subpackage View
//@users ViewBaseScript
//@uses MtSetting
//@uses MtOutput
//@uses MtScriptArgs
//@filesource
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2010/06/17
//
//
//error_reporting(E_ALL);
//
//証明書期限切れ警告メール
//
//@package CertificateWarningMail
//@subpackage View
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2010/06/17
//

require("view/script/ViewBaseScript.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgs.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2010/06/17
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/06/17
//
//@access public
//@return void
//
class CertificateWarningMailView extends ViewBaseScript {
	constructor() {
		super();
	}

	__destruct() {
		super.__destruct();
	}

};