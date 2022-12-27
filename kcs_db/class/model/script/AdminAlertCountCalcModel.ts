//au・softbankの警告・電話カウント・計算バッチモデル
//@author miyazawa
//@since 2009/10/27
import ModelBase from "../ModelBase";
export default class AdminAlertCountCalcModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	getCalcList(H_val:any = Array(), is_carid = false) {
		if (true == 0 < Object.values(H_val).length) //tel_details_xx_tbのテーブル名指定に使うため年月整形（clamp_index_tbより1ヶ月ずれる）
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
			//clamp_index_tbアップデート実行
			{
				var sql = "SELECT ci.pactid ";
				sql += "FROM clamp_index_tb ci INNER JOIN pact_tb pa ON ci.pactid=pa.pactid ";
				sql += "WHERE ci.year='" + H_val.year + "' AND ci.month='" + H_val.month + "' AND ci.is_details = true AND ci.is_calc IS NULL ";

				if (undefined !== H_val.pacttype && "H" == H_val.pacttype) {
					sql += "AND pa.type='H'";
				}

				if (is_carid && undefined !== H_val.carid && H_val.carid.length && !isNaN(Number(H_val.carid))) {
					sql += "AND ci.carid=" + H_val.carid + " ";
				}

				sql += "GROUP BY ci.pactid ORDER BY ci.pactid";
				return this.get_DB().queryCol(sql);
			}

		return false;
	}
};
