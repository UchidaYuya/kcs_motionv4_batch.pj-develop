//
//交通費ASP使用料設定モデル
//
//更新履歴：
//2010/07/07 宮澤龍彦 作成
//
//@package Admin
//@subpackage Regist
//@author miyazawa
//@since 2010/07/07
//@filesource
//@uses AspSettingModelBase
//@uses ICCardCoModel
//
//
//
//交通費ASP使用料設定モデル
//
//@package Admin
//@subpackage Regist
//@author miyazawa
//@since 2010/07/07
//@uses AspSettingModelBase
//@uses ICCardCoModel
//
//

require("model/Admin/Regist/AspSettingModelBase.php");

require("model/ICCardCoModel.php");

//
//関連モデルのインスタンス
//
//@var ICCardCoModel
//@access private
//
//
//
//コンストラクタ
//
//@author miyazawa
//@since 2010/07/07
//
//@access public
//@return void
//
//
//
//IDをキーとする名称の配列を取得
//
//@author miyazawa
//@since 2010/07/07
//
//@access public
//@return array
//
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/07/07
//
//@access public
//@return void
//
//
class AspSettingICCardModel extends AspSettingModelBase {
	constructor() //接続するテーブル名
	//固有のカラム名
	//関連モデルのインスタンス
	{
		super();
		this.table_name = "iccard_asp_charge_tb";
		this.coid_name = "iccardcoid";
		this.O_model = new ICCardCoModel();
	}

	getNameList() {
		var result = this.O_model.getICCardCoKeyHash();
		return result;
	}

	__destruct() {
		super.__destruct();
	}

};