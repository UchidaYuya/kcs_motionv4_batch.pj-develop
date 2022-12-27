//価格表種別型


import MtDBUtil from "../MtDBUtil";

export default class PricePatternModel {
	static myself: PricePatternModel;
	O_db: MtDBUtil;
	H_ppid: any[] | undefined;

	constructor() {
		this.O_db = MtDBUtil.singleton();
		// this.H_ppid = this.getPatternList();

		new Promise(async resolve => {
			const result  = await this.getPatternList();
			resolve(result);
		}).then(result => {
 			if(result instanceof Array){
				this.H_ppid = result;
			}
		})
	}

	static singleton() {
		if (!PricePatternModel.myself) {
			PricePatternModel.myself = new PricePatternModel();
		}

		return PricePatternModel.myself;
	}

	async getPatternList() {
		const sql = "SELECT " + "ppid, carid " + "FROM " + "price_pattern_tb " + "WHERE " + "ppid != 0 " + "ORDER BY " + "ppid ";
		const AH_temp = await this.O_db.queryHash(sql);
		const count_temp = AH_temp.length;

		if (1 > count_temp) {
			return false;
		} else //$H_return[ppid][ppid];
			{
				var H_return = Array();

				for (var cnt = 0; cnt < count_temp; cnt++) {
					H_return[AH_temp[cnt].ppid].ppid = AH_temp[cnt].ppid;
					H_return[AH_temp[cnt].ppid].carid = AH_temp[cnt].carid;
				}
			}

		return H_return;
	}
};
