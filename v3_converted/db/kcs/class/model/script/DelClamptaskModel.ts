//
//clamptask_tb消去モデル
//
//@uses ModelBase
//@package SBDownload
//@filesource
//@author miyazawa
//@since 2009/09/08
//
//
//
//clamptask_tb消去モデル
//
//@uses ModelBase
//@package DelClamptask
//@author miyazawa
//@since 2009/09/08
//

require("model/ModelBase.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2009/09/08
//
//@param objrct $O_db0
//@access public
//@return void
//
//
//__destruct
//
//@author miyazawa
//@since 2009/09/08
//
//@access public
//@return void
//
class DelClamptaskModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};