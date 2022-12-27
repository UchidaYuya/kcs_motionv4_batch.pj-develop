//内線番号（extension_tel_tb）を扱うModel
//2011/10/13 宝子山浩平 作成
import ModelBase from "./ModelBase";

export default class ExtensionTelModel extends ModelBase {
	extension_tel_tb:string
	tel_tb:string
	constructor(O_db = undefined) {
		super(O_db);
		this.extension_tel_tb = "extension_tel_tb";
		this.tel_tb = "tel_tb";
	}

	setTableNo(tableno = undefined) {
		if (!tableno) {
			this.extension_tel_tb = "extension_tel_tb";
			this.tel_tb = "tel_tb";
		} else {
			this.extension_tel_tb = "extension_tel_" + tableno + "_tb";
			this.tel_tb = "tel_" + tableno + "_tb";
		}
	}

	async getExtensionNo(pactid, carid) //設定取得
	//復帰日
	//設定があるキャリア
	//桁揃え
	{
		var sql = "select carid,* from extension_setting_tb" + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " order by min_no";
		var H_setting = this.getDB().queryKeyAssoc(sql);
		let date_minus = new Date().getDate() - this.getSetting().get("return_extensionno");
		var date = new Date(new Date().getFullYear(), new Date().getMonth(),date_minus).toISOString().replace(/T/, ' ').replace(/\..+/, '') ;

		if (carid in H_setting) //削除済み番号の最小値
			//設定がないキャリア
			{
				sql = "select min(extensionno) from " + this.extension_tel_tb + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and extensionno >=" + H_setting[carid].min_no + " and extensionno <=" + H_setting[carid].max_no + " and deldate<" + this.getDB().dbQuote(date, "timestamp", true) + " and enable=false";
				var min = await this.getDB().queryOne(sql);

				if (!!min && !isNaN(Number(min))) //無ければそのキャリアで空き番最小値
					{
						var num = min;
					} else {
					sql = "select min(t1.seq) from\n\t\t\t\t\t(select extensionno + 1 as seq from " + this.extension_tel_tb + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and extensionno >=" + H_setting[carid].min_no + " and extensionno <=" + H_setting[carid].max_no + " union all select " + H_setting[carid].min_no + ") as t1\n\t\t\t\t\twhere not exists\n\t\t\t\t\t(select extensionno from  " + this.extension_tel_tb + " t2" + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and extensionno >=" + H_setting[carid].min_no + " and extensionno <=" + H_setting[carid].max_no + " and t1.seq = t2.extensionno)";
					num = this.getDB().queryOne(sql);

					if (num < H_setting[carid].min_no || num > H_setting[carid].max_no) {
						return false;
					}
				}
			} else //他のキャリアに使われて居ない範囲で使用済み番号の最小値
			{
				var A_where = Array();
				for (var H_car of await H_setting) {
					A_where.push("extensionno not between " + H_car.min_no + " and " + H_car.max_no);
				}

				sql = "select min(extensionno) from " + this.extension_tel_tb + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and deldate<" + this.getDB().dbQuote(date, "timestamp", true) + " and enable=false";

				if (!!A_where) {
					sql += " and " + A_where.join(" and ");
				}

				min = this.getDB().queryOne(sql);

				if (!!min && !isNaN(Number(min))) //無ければ空き番号の最小値
					{
						num = min;
					} else {
					sql = "select min(t1.seq) from\n\t\t\t\t\t(select extensionno + 1 as seq from " + this.extension_tel_tb + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true);

					if (!!A_where) {
						sql += " and " + A_where.join(" and ");
					}

					sql += " union all select extensionno from " + this.extension_tel_tb + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true);

					if (!!A_where) {
						sql += " and " + A_where.join(" and ");
					}

					sql += ") as t1" + " where not exists\n\t\t\t\t\t(select extensionno from  " + this.extension_tel_tb + " t2" + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true);

					if (!!A_where) {
						sql += " and " + A_where.join(" and ");
					}

					sql += " and t1.seq = t2.extensionno)";
					num = this.getDB().queryOne(sql);
				}
			}

		if (H_setting) {
			for (var H_car of await H_setting) {
				var digit_number = H_car.digit_number;
			}

			if (num.length > digit_number) {
				return false;
			}

			num = ( '00' + num ).slice( -digit_number );
		} else {
			return false;
		}

		return num;
	}

	async checkExtensionNoExists(pactid, telno, carid, extensionno, exclude = false) {
		var sql = "select telno,carid from " + this.tel_tb + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and" + " extensionno=" + this.getDB().dbQuote(extensionno, "text", true);
		var H_res = await this.getDB().queryHash(sql);

		if (H_res.length > 0) {
			if (exclude) {
				for (var H_row of H_res) {
					if (H_row.telno == telno && H_row.carid == carid) //特になし
						{} else {
						return true;
					}
				}
			} else {
				return true;
			}
		}

		let date_minus = new Date().getDate() - this.getSetting().get("return_extensionno");
		var date = new Date(new Date().getFullYear(), new Date().getMonth(),date_minus).toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
		sql = "select count(extensionno) from " + this.extension_tel_tb + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and extensionno=" + this.getDB().dbQuote(extensionno.split("0").join(''), "integer", true) + " and (enable = true or (enable =false " + " and deldate>" + this.getDB().dbQuote(date, "timestamp", true) + "))";
		var cnt = await this.getDB().queryOne(sql);

		if (exclude && cnt > 1 || !exclude && cnt > 0) {
			return true;
		} else {
			return false;
		}
	}

	async activateExtensionNo(pactid, extensionno, carid) {
		this.getDB().query(await this.makeActivateExtensionNoSQL(pactid, extensionno, carid));
	}

	async makeActivateExtensionNoSQL(pactid, extensionno, carid) {
		let no = Math.round(extensionno.split("0").join(""));
		this.getDB().beginTransaction();
		let sql = "select count(extensionno) from " + this.extension_tel_tb + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and extensionno=" + this.getDB().dbQuote(no, "integer", true);
		let cnt = await this.getDB().queryOne(sql);

		if (!!cnt && cnt > 0) {
			sql = "update " + this.extension_tel_tb + " set" + " carid=" + this.getDB().dbQuote(carid, "integer", true) + ",enable=true,deldate=null,fixdate=" + this.getDB().dbQuote(this.getNow(), "timestamp", true) + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and extensionno=" + this.getDB().dbQuote(no, "integer", true);
		} else {
			var A_values = [this.getDB().dbQuote(pactid, "integer", true), this.getDB().dbQuote(String(no), "text", true), this.getDB().dbQuote(carid, "integer", true), this.getDB().dbQuote("true", "boolean", true), "null", this.getDB().dbQuote(this.getNow(), "timestamp", true), this.getDB().dbQuote(this.getNow(), "timestamp", true)];
			sql = "insert into " + this.extension_tel_tb + " values (" + A_values.join(",") + ")";
		}

		return sql;
	}
	getNow() 
	{
		return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	}

	getToday() 
	{
		return new Date().toJSON().slice(0,10).replace(/-/g,'-');
	}

	disactivateExtensionNo(pactid, extensionno) {
		this.getDB().query(this.makeDisactivateExtensionNoSQL(pactid, extensionno));
	}

	makeDisactivateExtensionNoSQL(pactid, extensionno) {
		var no = Math.round(extensionno.split("0").join(""));
		var sql = "update " + this.extension_tel_tb + " set" + " enable=false" + ",deldate=" + this.getDB().dbQuote(this.getNow(), "timestamp", true) + ",fixdate=" + this.getDB().dbQuote(this.getNow(), "timestamp", true) + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and extensionno=" + this.getDB().dbQuote(extensionno, "integer", true);
		return sql;
	}

	deleteExtensionNo(pactid, extensionno) {
		this.getDB().query(this.makeDeleteExtensionNoSQL(pactid, extensionno));
	}

	makeDeleteExtensionNoSQL(pactid, extensionno) {
		var no = Math.round(extensionno.split("0").join(""));
		var sql = "delete from " + this.extension_tel_tb + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and extensionno=" + this.getDB().dbQuote(extensionno, "integer", true);
		return sql;
	}

	async getUseExtensionNo(pactid, telno, carid) {
		var sql = "select extensionno from " + this.tel_tb + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and" + " telno=" + this.getDB().dbQuote(telno, "text", true) + " and" + " carid=" + this.getDB().dbQuote(carid, "integer", true);
		var extensionno = await this.getDB().queryOne(sql);

		if (!extensionno || "" == extensionno) {
			return false;
		} else {
			return extensionno;
		}
	}

	checkRange(data, min, max) {
		if (!data.trim().length) {
			return true;
		}

		if (isNaN(Number(data))) {
			return false;
		}

		if (Math.round(data) >= min && Math.round(data) <= max) {
			return true;
		} else {
			return false;
		}
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
