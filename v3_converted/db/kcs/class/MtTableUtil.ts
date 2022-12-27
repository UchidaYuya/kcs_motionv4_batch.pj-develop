//
//テーブルに関する情報を取得するユーティリティ
//
//@package Base
//@subpackage Table
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/01
//
//
//
//テーブルに関する情報を取得するユーティリティ
//
//@package Base
//@subpackage Table
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/01
//

//
//コンストラクト
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
//
//XX系テーブルの使用するNoを生成する<br>
//staticな呼び出しが可能<br>
//
//$yyyymm には、６桁の数字を渡さなければfalseを返す<br>
//後ろ2桁が12より多い場合もfalseを返す<br>
//過去形のテーブルを処理する場合は $not_billをtrue
//
//@author ishizaki
//@since 2008/04/01
//
//@param string $yyyymm default null
//@param boolean $not_bill default false
//@access public
//@return string
//
//
//テーブル名を整形する<br>
//staticな呼び出しが可能
//
//@author katsushi
//@since 2008/04/02
//
//@param string $tablename
//@param string $tableno default ""
//@access public
//@return string
//
//
//デストラクト
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
class MtTableUtil {
	constructor() {}

	getTableNo(yyyymm = undefined, not_bill = false) //全部数字で6桁でなかったらfalseを返す
	//現在形の処理
	{
		var xx = undefined;
		var yyyy = undefined;
		var mm = undefined;
		var this_yyyy = date("Y");
		var this_mm = date("n");

		if (false == is_null(yyyymm) && false == is_numeric(yyyymm) && 6 == yyyymm.length) {
			return false;
		}

		if (true == is_null(yyyymm)) {
			yyyy = date("Y");
			mm = date("n");
		} else {
			yyyy = yyyymm.substr(0, 4);
			mm = +yyyymm.substr(4);

			if (mm > 12) {
				return false;
			}
		}

		var calc = 12 * (this_yyyy - yyyy) - mm + 1 + this_mm;

		if (not_bill == false) //選択した年月が１年以上前でない場合
			//過去分データ修正用
			{
				if (calc < 13) //選択した月が１月の場合
					{
						if (mm == 1) {
							xx = 12;
						} else {
							xx = mm - 1;
						}
					} else //選択した月が１月の場合
					{
						if (mm == 1) {
							xx = 24;
						} else {
							xx = mm - 1 + 12;
						}
					}
			} else //選択した年月が１年以上前でない場合
			{
				if (calc < 14) {
					xx = mm;
				} else {
					xx = mm + 12;
				}
			}

		return str_pad(xx, 2, "0", STR_PAD_LEFT);
	}

	makeTableName(tablename, tableno = "") {
		if (tableno == "") {
			return tablename;
		}

		return tablename.replace(/_tb$/g, "_" + tableno + "_tb");
	}

	__destruct() {}

};