//
//au brossデータ ダウンロード （Model）
//
//更新履歴：<br>
//2009/06/01 前田 聡 作成
//
//AuDownloadModel
//
//@package script
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/06/01
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author maeda
//@since 2009/06/01
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//__destruct
//
//@author maeda
//@since 2009/06/01
//
//@access public
//@return void
//
class AuDownloadModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};