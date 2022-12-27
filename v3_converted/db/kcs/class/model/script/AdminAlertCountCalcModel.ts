//
//au・softbankの警告・電話カウント・計算バッチモデル
//
//@uses ModelBase
//@package AdminAlertCountCalc
//@filesource
//@author miyazawa
//@since 2009/10/27
//
//
//
//au・softbankの警告・電話カウント・計算バッチモデル
//
//@uses ModelBase
//@package AdminAlertCountCalc
//@author miyazawa
//@since 2009/10/27
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
//@return void
//
//
//取込状況取得
//
//@author miyazawa
//@since 2009/10/27
//
//@param mixed $H_val
//@param $is_carid boolean キャリアで絞り込むならtrue(20140530森原追加)
//@access public
//@return array
//
//
//__destruct
//
//@author miyazawa
//@since 2009/10/27
//
//@access public
//@return void
//
class AdminAlertCountCalcModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	getCalcList(H_val = Array(), is_carid = false) {
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
			//clamp_index_tbアップデート実行
			{
				var sql = "SELECT ci.pactid ";
				sql += "FROM clamp_index_tb ci INNER JOIN pact_tb pa ON ci.pactid=pa.pactid ";
				sql += "WHERE ci.year='" + H_val.year + "' AND ci.month='" + H_val.month + "' AND ci.is_details = true AND ci.is_calc IS NULL ";

				if (undefined !== H_val.pacttype && "H" == H_val.pacttype) {
					sql += "AND pa.type='H'";
				}

				if (is_carid && undefined !== H_val.carid && H_val.carid.length && is_numeric(H_val.carid)) {
					sql += "AND ci.carid=" + H_val.carid + " ";
				}

				sql += "GROUP BY ci.pactid ORDER BY ci.pactid";
				return this.get_DB().queryCol(sql);
			}

		return false;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};