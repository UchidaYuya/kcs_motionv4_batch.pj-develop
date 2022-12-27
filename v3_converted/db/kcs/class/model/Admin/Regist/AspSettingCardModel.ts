//
//カードASP使用料設定モデル
//
//更新履歴：
//2009/03/12 北村俊士 作成
//
//@package Admin
//@subpackage Regist
//@author kitamura
//@since 2009/03/12
//@filesource
//@uses AspSettingModelBase
//@uses CardCoModel
//
//
//カードASP使用料設定モデル
//
//@package Admin
//@subpackage Regist
//@author kitamura
//@since 2009/03/12
//@uses AspSettingModelBase
//@uses CardCoModel
//

require("model/Admin/Regist/AspSettingModelBase.php");

require("model/CardCoModel.php");

//
//関連モデルのインスタンス
//
//@var CardCoModel
//@access private
//
//
//コンストラクタ
//
//@author kitamura
//@since 2009/03/12
//
//@access public
//@return void
//
//
//IDをキーとする名称の配列を取得
//
//@author kitamura
//@since 2009/03/12
//
//@access public
//@return array
//
//
//デストラクタ
//
//@author kitamura
//@since 2009/03/12
//
//@access public
//@return void
//
class AspSettingCardModel extends AspSettingModelBase {
	constructor() //接続するテーブル名
	//固有のカラム名
	//関連モデルのインスタンス
	{
		super();
		this.table_name = "card_asp_charge_tb";
		this.coid_name = "cardcoid";
		this.O_model = new CardCoModel();
	}

	getNameList() {
		var result = this.O_model.getCardCoKeyHash();
		return result;
	}

	__destruct() {
		super.__destruct();
	}

};