//WILLCOMダウンロードモデル
//@author miyazawa
//@since 2013/06/18
import ModelBase from "../ModelBase";
import MtDateUtil from "../../MtDateUtil";

export default class WillcomDownloadModel extends ModelBase {
	constructor(O_db0: undefined) {
		super(O_db0);
	}

	getID(pactid = "") //pactid指定
	{
// 2022cvt_015
		var sql = "SELECT pactid, clampid, clamppasswd FROM clamp_tb WHERE carid=" + this.getSetting().get("car_willcom") + " AND login_status != 1";

		if (true == (undefined !== pactid) && true == !isNaN(Number(pactid))) {
			sql += " AND pactid=" + pactid;
		}

		return this.get_DB().queryHash(sql);
	}

	getClampIndexCount(H_outClampIndex = Array()) {
// 2022cvt_015
		var H_data = H_outClampIndex[0];
// 2022cvt_015
		var sql = "SELECT count(*) FROM clamp_index_tb WHERE pactid=" + H_data.pactid + " AND carid=" + H_data.carid + " AND year='" + H_data.year + "' AND month='" + H_data.month + "'";

		if (true == (undefined !== H_data.detailno) && "" != H_data.detailno) {
			sql += " AND detailno=" + H_data.detailno;
		}

// 2022cvt_016
		if (true == (undefined !== H_data.type) && "" != H_data.type) {
// 2022cvt_016
			sql += " AND type='" + H_data.type + "'";
		}

		return this.get_DB().queryOne(sql);
	}

	updateClamp(pactid: string, detailno: string, login: boolean) //clamp_tbアップデート文作成
	//clamp_tbアップデート実行
	//$this->debugOut( $upd_sql."\n" );	// デバッグ表示
	//$this->infoOut( $upd_sql."\n" );	// 情報表示、printの代わりにこれを使う
	{
		if (true == login) {
// 2022cvt_015
			var login_status = 1;
		} else {
			login_status = 2;
		}

// 2022cvt_015
		var upd_sql = "UPDATE clamp_tb SET login_status = " + login_status + " WHERE carid=" + this.getSetting().get("car_willcom") + " AND pactid=" + pactid + " AND detailno=" + detailno;
		this.get_DB().query(upd_sql);
		return this.get_DB().query(upd_sql);
	}

	updateClampIndexFixdate(H_outClampIndex = Array()) {
// 2022cvt_015
		var H_data = H_outClampIndex[0];
// 2022cvt_015
		var sql = "UPDATE clamp_index_tb SET fixdate='" + H_data.fixdate + "'";

		if (true == (undefined !== H_data.dldate) && "" != H_data.dldate) {
			sql += ", dldate='" + H_data.dldate + "'";
		}

		if (true == (undefined !== H_data.dldate) && "" != H_data.is_ready) {
// 2022cvt_015
			var is_ready = H_data.is_ready;

			if (1 == is_ready) {
				is_ready = "true";
			} else if (0 == is_ready) {
				is_ready = "false";
			}

			sql += ", is_ready=" + is_ready;
		}

		sql += " WHERE pactid=" + H_data.pactid + " AND carid=" + H_data.carid + " AND year='" + H_data.year + "' AND month='" + H_data.month + "'";

		if (true == (undefined !== H_data.detailno) && "" != H_data.detailno) {
			sql += " AND detailno=" + H_data.detailno;
		}

// 2022cvt_016
		if (true == (undefined !== H_data.type) && "" != H_data.type) {
// 2022cvt_016
			sql += " AND type='" + H_data.type + "'";
		}

		return this.get_DB().query(sql);
	}

	InsertClampError(pactid: string, carid: string, H_error = Array()) //clamp_tbインサート文作成
	{
		if (true == H_error.length > 0) //clamp_tbインサート実行
			{
// 2022cvt_015
				var ins_sql = "";

// 2022cvt_015
				for (var A_row of H_error) {
// 2022cvt_016
					ins_sql += "INSERT INTO clamp_error_tb (pactid, carid, error_type, message, recdate) VALUES (";
					ins_sql += pactid + ", ";
					ins_sql += carid + ", ";
// 2022cvt_016
					ins_sql += "'" + A_row.type + "',";
					ins_sql += "'" + A_row.message + "',";
					ins_sql += "'" + MtDateUtil.getNow() + "'";
					ins_sql += "); ";
				}

				this.get_DB().query(ins_sql);
			}
	}
};
