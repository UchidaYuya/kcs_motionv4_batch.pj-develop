
export default class MtTableUtil {
	constructor() {}
	static getTableNo(yyyymm:any = undefined, not_bill = false):string //全部数字で6桁でなかったらfalseを返す
	//現在形の処理
	{
		var xx:any = undefined;
		var yyyy:any = undefined;
		var mm:any = undefined;
		var this_yyyy = new Date().getFullYear();
		var this_mm = new Date().getMonth()+1;

		if (!yyyymm && isNaN(Number(yyyymm)) && 6 == yyyymm.length) {
			return "";
		}

		if (yyyymm) {
			yyyy = new Date().getFullYear();
			mm = new Date().getMonth()+1;
		} else {
			yyyy = yyyymm.substr(0, 4);
			mm = +yyyymm.substr(4);

			if (mm > 12) {
				return "";
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

		return ( '00' + xx ).slice( -2 );
	}

	static makeTableName(tablename:string, tableno:string = "") {
		if (tableno == "") {
			return tablename;
		}

		return tablename.replace(/_tb$/g, "_" + tableno + "_tb");
	}
};
