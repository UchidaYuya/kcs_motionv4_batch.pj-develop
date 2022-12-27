//
//お問合わせのステータス自動更新
//
//更新履歴：<br>
//2011/03/09 K49 実装 石崎
//
//@package script
//@subpackage View
//@author ishizaki
//@filesource
//@since 2011/03/09
//@uses ViewBaseScript
//@uses MtScriptArgs
//
//
//error_reporting(E_ALL|E_STRICT);
//
//お問合わせのステータス自動更新
//
//@uses ViewBaseScript
//@package
//@author ishizaki
//@since 2011/03/09
//

require("view/script/ViewBaseScript.php");

require("MtScriptArgs.php");

//
//スクリプト実行オプション処理クラス
//
//@var mixed
//@access public
//
//
//コンストラクタ
//
//@author houshiyama
//@since 2010/08/05
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/08/05
//
//@access public
//@return void
//
class ChangeStatusForInquiryView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};