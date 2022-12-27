//
//clamp_index_tbアップデートモデル
//
//@uses ModelBase
//@package UpdateClampIndex
//@filesource
//@author miyazawa
//@since 2009/10/27
//
//
//
//UpdateHolidayModel
//
//@uses ModelBase
//@package
//@author web
//@since 2017/12/14
//

require("model/ModelBase.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2009/10/27
//
//@param objrct $O_db0
//@access public
//@return mixed
//
//
//insertHoliday
//祝日の追加
//@author web
//@since 2017/12/14
//
//@param array $holiday_list
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2017/12/14
//
//@access public
//@return void
//
class ImportPostModel extends ModelBase {
	constructor() {
		super();
	}

	updateHoliday(holiday_list: {} | any[]) //// トランザクション開始
	//		$this->get_DB()->beginTransaction();
	//		//	DB取込
	//		$res = $this->get_DB()->query( $sql );
	//		$res = $this->get_DB()->query( $sql );
	//		// コミット
	//		$this->get_DB()->commit();
	{
		return true;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};