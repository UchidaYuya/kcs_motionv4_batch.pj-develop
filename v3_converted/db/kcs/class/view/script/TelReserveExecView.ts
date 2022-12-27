//
//電話予約処理 （View）
//
//更新履歴：<br>
//2008/09/09 宝子山 作成
//
//SuoImportAlphapurchaseView
//
//@package script
//@subpackage View
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2008/09/08
//@uses ViewBaseScript
//@uses MtScriptArgs
//
//
//error_reporting(E_ALL|E_STRICT);

require("view/script/ViewBaseScript.php");

require("MtScriptArgs.php");

//
//__construct
//
//@author houshiyama
//@since 2008/09/09
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2008/06/05
//
//@access public
//@return void
//
class TelReserveExecView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};