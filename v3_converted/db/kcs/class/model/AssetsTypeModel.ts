//
//資産種別テーブル（assets_type_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/06/09
//@uses ModelBase
//
//
//
//キャリア（carrier_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/06/09
//@uses ModelBase
//

require("ModelBase.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2008/06/09
//
//@param mixed $O_db
//@access public
//@return void
//
//
//assetstypeidをキーにassetstypenameを値にして返す
//
//@author houshiyama
//@since 2008/06/09
//
//@param mixed $pactid
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/06/09
//
//@access public
//@return void
//
class AssetsTypeModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getAssetsTypeKeyHash(pactid) //指定pactの設定を取得
	//固有の設定が無い時はpact=0を取得
	{
		var sql = "select assetstypeid,assetstypename from assets_type_tb" + " where pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " order by sort";
		var H_data = this.get_DB().queryAssoc(sql);

		if (H_data.length < 1) {
			sql = "select assetstypeid,assetstypename from assets_type_tb" + " where pactid = 0 order by sort";
			H_data = this.get_DB().queryAssoc(sql);
		}

		return H_data;
	}

	__destruct() {
		super.__destruct();
	}

};