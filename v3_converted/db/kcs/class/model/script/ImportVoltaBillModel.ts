//
//Voltaデータ取込処理 （Model）
//
//更新履歴：<br>
//2010/08/05 宝子山浩平 作成
//
//@package script
//@subpackage Model
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2010/08/05
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);
//
//Voltaデータ取込処理 （Model）
//
//@uses ModelBase
//@package script
//@author houshiyama
//@since 2010/08/05
//

require("model/script/ImportVoltaModel.php");

//
//__construct
//
//@author houshiyama
//@since 2010/08/05
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//科目名取得
//
//@author houshiyama
//@since 2010/08/09
//
//@param mixed $pactid
//@access public
//@return void
//
//
//PactModel取得
//
//@author houshiyama
//@since 2010/08/06
//
//@access protected
//@return void
//
//
//取り込んだ会社をev_index_tbに記録
//
//@author miyazawa
//@since 2010/09/24
//
//@param mixed $A_output	取込データ
//@param string $is_import
//@access public
//@return void
//
class ImportVoltaBillModel extends ImportVoltaModel {
	static ASP_KAMOKUID = 1;
	static ASX_KAMOKUID = 2;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super(O_MtScriptAmbient);
	}

	getKamokuName(pactid) {
		var H_kamoku;
		var sql = "select kamokuid,kamokuname from ev_kamoku_tb ";
		var where = " where pactid = " + pactid;

		if (!(H_kamoku = this.getDB().queryKeyAssoc(sql + where))) {
			where = " where pactid = 0";

			if (!(H_kamoku = this.getDB().queryKeyAssoc(sql + where))) {
				throw new Error("kamoku\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\n");
			}
		}

		return H_kamoku;
	}

	getPactModel() {
		if (!this.O_Pact instanceof PactModel) {
			this.O_Pact = new PactModel();
		}

		return this.O_Pact;
	}

	recordEvIndex(A_output = Array(), is_import) //チェック済の会社
	{
		var A_recorded = Array();

		if (true == 0 < A_output.length) {
			for (var A_pactdata of Object.values(A_output)) //timestampのYYYY-MM-DD部分取得
			{
				var pactid = A_pactdata.pactid;
				var evcoid = A_pactdata.evcoid;
				var recdate = A_pactdata.recdate;
				var dataday = A_pactdata.charge_date.substr(0, 10);

				if (undefined != pactid && undefined != evcoid && undefined != recdate && undefined != dataday) {
					var select_sql = "SELECT count(pactid) FROM ev_index_tb WHERE pactid=" + pactid + " AND evcoid=" + evcoid + " AND dataday = '" + dataday + "'";
					var pactcnt = this.get_DB().queryOne(select_sql);

					if (true == 0 < pactcnt) {
						var index_sql = "UPDATE ev_index_tb SET recdate='" + recdate + "', is_import=" + is_import + " WHERE pactid=" + pactid + " AND evcoid=" + evcoid + " AND dataday = '" + dataday + "'";
					} else {
						index_sql = "INSERT INTO ev_index_tb (pactid,evcoid,dataday,is_import,recdate) VALUES (" + pactid + "," + evcoid + ",'" + dataday + "'," + is_import + ",'" + recdate + "')";
					}

					this.get_DB().query(index_sql);
				}
			}
		}
	}

};