//
//Voltaデータ取込処理 （View）
//
//更新履歴：<br>
//2010/08/05 宝子山浩平 作成
//
//@package script
//@subpackage View
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2010/08/05
//@uses ViewBaseScript
//@uses MtScriptArgs
//
//
//error_reporting(E_ALL|E_STRICT);
//
//Voltaデータ取込処理 （View）
//
//@uses ViewBaseScript
//@package
//@author houshiyama
//@since 2010/08/05
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
class DeleteAttachFilesView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};