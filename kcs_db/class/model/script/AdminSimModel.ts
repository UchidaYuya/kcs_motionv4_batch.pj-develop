
import ModelBase from "../ModelBase";
const V3ORDER = 120;

export class AdminSimModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	// getTrendList(H_val = Array()) {
	getTrendList(H_val: { [key: string]: any } = {}) {
		if (true == 0 < H_val.length) //tel_details_xx_tbのテーブル名指定に使うため年月整形（clamp_index_tbより1ヶ月ずれる）
			//clamp_index_tbから状況を取ることにしたので使わないが一応残しておく
			//			$month = (int)$H_val["month"] -1;
			//			$year = (int)$H_val["year"];
			//			if (true == $month < 1) {
			//				$month = 12;
			//				$year = (int)$year -1
			//			}
			//			$month = str_pad($month, 2, "0", STR_PAD_LEFT);
			//			$year = (string)$year;
			//sql作成
			//20110725morihara is_trendがfalseの場合もNULLと同じ扱いに変更した
			//clamp_index_tbアップデート実行
			{
				var sql = "SELECT ci.pactid ";
				sql += "FROM clamp_index_tb ci INNER JOIN pact_tb pa ON ci.pactid=pa.pactid ";
				// sql += "WHERE ci.year='" + H_val.year + "' AND ci.month='" + H_val.month + "' AND ci.is_calc = true AND coalesce(ci.is_trend,false)=false ";
				sql += "WHERE ci.year='" + H_val.year + "' AND ci.month='" + H_val.month + "' AND ci.is_calc = true AND coalesce(ci.is_trend,false)=false ";

				if ("H" == H_val.pacttype) {
					sql += "AND pa.type='H'";
				}

				sql += "GROUP BY ci.pactid ORDER BY ci.pactid";
				return this.get_DB().queryCol(sql);
			}

		return [];
	}

	async getOrdFnc(A_pact = Array()) {
		var H_ordfnc = Array();

		if (true == 0 < A_pact.length) {
			// for (var pactid of Object.values(A_pact)) {
			for (var pactid of A_pact) {
				var sql = "SELECT pactid FROM fnc_relation_tb WHERE pactid=" + pactid + " AND fncid = " + V3ORDER;
				var H_fnc = await this.get_DB().queryHash(sql);

				// if (is_null(H_fnc) == false && H_fnc.length > 0) //V3型
				if (!H_fnc == false && H_fnc.length > 0) //V3型
					{
						H_ordfnc[pactid] = "V3";
					} else //V2型
					{
						H_ordfnc[pactid] = "V2";
					}
			}
		}

		return H_ordfnc;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
