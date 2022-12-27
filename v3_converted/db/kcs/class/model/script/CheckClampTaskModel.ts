//error_reporting(E_ALL|E_STRICT);
//
//
//

require("MtTableUtil.php");

require("model/ModelBase.php");

//
//__construct
//コンストラクタ
//@author web
//@since 2017/01/26
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author web
//@since 2017/01/26
//
//@access public
//@return void
//
class CheckClampTaskModel extends ModelBase {
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
	}

	getClampTask() {
		var sql = "select * from clamptask_tb order by recdate";
		return this.get_DB().queryHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};