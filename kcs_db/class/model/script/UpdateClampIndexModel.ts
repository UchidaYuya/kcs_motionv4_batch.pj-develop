//clamp_index_tbアップデートモデル
//@author miyazawa
//@since 2009/10/27

import ModelBase from "../ModelBase";

export default class UpdateClampIndexModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	async updateIndex(H_val:any = Array()) {
		if (Object.keys(H_val).length > 0) //既にtrueだったらfalseにしない（複数の枝番がある場合、後に処理されたものにデータがないとtrueがfalseで上書きされてしまう）20100115miya
			{
				let sql = "SELECT count(pactid) FROM clamp_index_tb ";
				sql += "WHERE " + H_val.column + " = true AND year='" + H_val.year + "' AND month='" + H_val.month + "' AND carid=" + H_val.carid + " AND pactid=" + H_val.pactid;
				
				const true_cnt = await this.get_DB().queryOne(sql);
				
				if (1 > true_cnt) //clamp_index_tbアップデート文作成
					{
						let upd_sql = "UPDATE clamp_index_tb SET " + H_val.column + " = " + H_val.result + " ";
						upd_sql += "WHERE year='" + H_val.year + "' AND month='" + H_val.month + "' AND carid=" + H_val.carid + " AND pactid=" + H_val.pactid;
						return this.get_DB().query(upd_sql);
					} else {
					return true;
				}
			}

		return false;
	}
};
