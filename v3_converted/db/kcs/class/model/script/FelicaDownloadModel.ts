//
//Felicaダウンロードモデル
//
//@uses ModelBase
//@package FelicaDownload
//@filesource
//@author miyazawa
//@since 2010/04/22
//
//
//
//Felicaダウンロードモデル
//
//@uses ModelBase
//@package FelicaDownload
//@author miyazawa
//@since 2010/04/22
//

require("HTTP/Request.php");

require("model/ModelBase.php");

require("MtDateUtil.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2009/06/05
//
//@param objrct $O_db0
//@access public
//@return void
//
//
//iccard_index_tbから取込失敗した会社のリストを得る
//
//@author miyazawa
//@since 2010/08/06
//
//@access public
//@return void
//
//
//__destruct
//
//@author miyazawa
//@since 2009/06/05
//
//@access public
//@return void
//
class FelicaDownloadModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	checkICCardIndex() {
		var select_sql = "SELECT pactid,dataday FROM iccard_index_tb WHERE is_import=false";
		var H_falselist = this.get_DB().queryHash(select_sql);
		return H_falselist;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};