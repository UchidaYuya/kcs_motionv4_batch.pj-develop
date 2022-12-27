//
//モデル実装のサンプル
//
//@uses ModelBase
//@package Sample
//@filesource
//@author nakanita
//@since 2008/02/08
//
//
//
//モデル実装のサンプル
//
//@uses ModelBase
//@package Sample
//@author nakanita
//@since 2008/02/08
//

require("model/ModelBase.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param object $O_db0
//@access public
//@return void
//
//
//DBをselectし、結果を返す
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_query 検索条件パラメータ
//@param array $H_limit Limit条件パラメータ
//@access public
//@return void
//
class SampleModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	getData(H_query: {} | any[], H_limit: {} | any[] = Array()) //情報表示、printの代わりにこれを使う
	//getHash -> queryHash に変更された
	{
		var sql = "select pactid,compname from pact_tb";

		if (undefined !== H_query.pactid) {
			sql += " where pactid=" + H_query.pactid;
		}

		sql += " order by pactid";

		if (undefined !== H_limit.limit) {
			sql += " limit " + H_limit.limit;
		}

		if (undefined !== H_limit.offset) {
			sql += " offset " + H_limit.offset;
		}

		this.infoOut(sql + "\n");
		return this.get_DB().queryHash(sql);
	}

};