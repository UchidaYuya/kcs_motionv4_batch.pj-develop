
import { ImportDocomoCsvBase } from './import_docomo_base';
import { G_CARRIER_DOCOMO, G_NKF } from './script_common';
import { G_SCRIPT_SQL, G_SCRIPT_WARNING } from './script_log';
import * as Encoding from 'encoding-japanese';
import * as fs from 'fs';

export class ImportDocomoBill extends ImportDocomoCsvBase {

	m_inserter: any;
	getTableNo: any;
	escape: any;
	m_db: any;

	m_parent_ready: any;
	m_pactid: any;

	// ImportDocomoBill(listener, db, table_no, tel_tb, check_parent_all, force, inserter, A_parent_error) {
	constructor(listener, db, table_no, tel_tb, check_parent_all, force, inserter, A_parent_error) {
		//super(listener, db, table_no, tel_tb)
		super(listener, db, table_no, tel_tb, check_parent_all, force, inserter);
		this.m_inserter = inserter;
	}

	delete(pactid, year, month, fname) {
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from billhistory_" + table_no + "_tb";
		sqlfrom += " where pactid=" + this.escape(pactid);
		sqlfrom += " and carid=" + this.escape(G_CARRIER_DOCOMO);

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
		}

		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	begin(pactid, year, month) {
		var table_no = this.getTableNo(year, month);

		if (!this.setPactid(pactid, year, month)) {
			this.putError(G_SCRIPT_WARNING, `setPactid/${pactid},${year},${month}`);
			return false;
		}

		var const_0 = {
			pactid: pactid,
			carid: G_CARRIER_DOCOMO
		};

		if (!this.m_inserter.setConst(const_0)) {
			this.putError(G_SCRIPT_WARNING, `setConst/${pactid},${year},${month}`);
			return false;
		}

		if (!this.m_inserter.begin("billhistory_" + table_no + "_tb")) {
			this.putError(G_SCRIPT_WARNING, `inserter->begin/${pactid},${year},${month}`);
			return false;
		}

		return true;
	}

	end() {
		return this.m_inserter.end();
	}

	read(fname) //ファイルを開いて一行づつ読み出す
	//戻り値
	{
		this.m_parent_ready = false;
		var cmd = G_NKF + " -w -S " + fname;
		// var fp = popen(cmd, "r");
		// var fp = fs.readFileSync(cmd);
		// const text = Encoding.convert(fp, {
		// 	from: 'SJIS',
		// 	to: 'UNICODE', 
		// 	type: 'string',
		// });
		// var texts = text.toString().split('\r\n');

		var fp;
		try {
			const fp = fs.readFileSync(fname)
		} catch (error) {
			this.putError(G_SCRIPT_WARNING, `ファイルオープン失敗(${cmd})` + this.m_pactid);
			return false;
		}
		const text = Encoding.convert(fp, {
			from: 'SJIS',
			to: 'UNICODE', 
			type: 'string',
		});
		const options = {escape: '\\'} 
		const csvdata = csv.parse(text, options) 
		// if (!fp) {
		// 	this.putError(G_SCRIPT_WARNING, `ファイルオープン失敗(${cmd})` + this.m_pactid);
		// 	return false;
		// }
		// const buffer = fs.readFileSync('utf8.txt', 'utf8');


		var status = true;
		var detailno = 0;
		var cur_telno = "";

		// var csv;

		// for (var lineno = 1; status && false !== (csv = ImportDocomoBill.fgetcsv(fp)); ++lineno) {
		for (var lineno = 1; status && lineno < csvdata.length; ++lineno) {
			var csv = csvdata[lineno]
			   
			if (1 == lineno) {
				if (!this.readLineHeader(fname, lineno, csv)) {
					status = false;
					break;
				}
			} else {
				if (!this.readLineBody(fname, lineno, csv, detailno, cur_telno)) {
					status = false;
					break;
				}
			}
		}

		// pclose(fp);
		return status;
	}

	readLineHeader(fname, lineno, csv) {
		// var check = ["\u96FB\u8A71\u756A\u53F7", "\u7B2C\u4E00\u968E\u5C64\u90E8\u9580\u540D", "\u7B2C\u4E8C\u968E\u5C64\u90E8\u9580\u540D", "\u7B2C\u4E09\u968E\u5C64\u90E8\u9580\u540D", "\u5185\u8A33\u9805\u76EE", "\u91D1\u984D(\u5186)", "\u91D1\u984D\u8A73\u7D30(\u5186)", "\u7A2E\u76EE\u30B3\u30FC\u30C9", "\u8ACB\u6C42\u66F8\u5185\u8A33\u7B49\u8A73\u7D301", "\u8ACB\u6C42\u66F8\u5185\u8A33\u7B49\u8A73\u7D302", "\u7A0E\u533A\u5206"];
		var check = ["電話番号", "第一階層部門名", "第二階層部門名", "第三階層部門名", "内訳項目", "金額(円)", "金額詳細(円)", "種目コード", "請求書内訳等詳細1", "請求書内訳等詳細2", "税区分"];
		// var check_1205 = ["\u96FB\u8A71\u756A\u53F7", "\u7B2C\u4E00\u968E\u5C64\u90E8\u9580", "\u7B2C\u4E8C\u968E\u5C64\u90E8\u9580", "\u7B2C\u4E09\u968E\u5C64\u90E8\u9580", "\u5185\u8A33\u9805\u76EE", "\u91D1\u984D(\u5186)", "\u91D1\u984D\u8A73\u7D30(\u5186)", "\u7A2E\u76EE\u30B3\u30FC\u30C9", "\u5185\u8A33\u7B49\u8A73\u7D301", "\u5185\u8A33\u7B49\u8A73\u7D302", "\u7A0E\u533A\u5206"];
		var check_1205 = ["電話番号", "第一階層部門", "第二階層部門", "第三階層部門", "内訳項目", "金額(円)", "金額詳細(円)", "種目コード", "内訳等詳細1", "内訳等詳細2", "税区分"];

		if (check.length != csv.length) {
			// this.putOperator(ScriptLog.G_SCRIPT_WARNING, "\u8ACB\u6C42\u66F8\u60C5\u5831\u30D8\u30C3\u30C0\u884C" + `レコード数異常(${fname},${lineno})` + csv.length);
			this.putOperator(G_SCRIPT_WARNING, "請求書情報ヘッダ行" + `レコード数異常(${fname},${lineno})` + csv.length);
			return false;
		}

		for (var cnt = 0; cnt < check.length; ++cnt) //古い書式のデータをインポートする事があるので、
		//どちらか一方でも合致すれば成功と見なす
		{
			// if (strcmp(check[cnt], csv[cnt]) && strcmp(check_1205[cnt], csv[cnt])) {
			if (check[cnt].localeCompare(csv[cnt]) && check_1205[cnt].localeCompare(csv[cnt])) {
				// this.putOperator(ScriptLog.G_SCRIPT_WARNING, "\u8ACB\u6C42\u66F8\u60C5\u5831\u30D8\u30C3\u30C0\u884C" + `レコード異常(${fname},${lineno})` + cnt + "/" + check[cnt] + "/" + check_1205[cnt] + "/" + csv[cnt]);
				this.putOperator(G_SCRIPT_WARNING, "請求書情報ヘッダ行" + `レコード異常(${fname},${lineno})` + cnt + "/" + check[cnt] + "/" + check_1205[cnt] + "/" + csv[cnt]);
				return false;
			}
		}

		return true;
	}

	readLineBody(fname: string, lineno, csv, detailno, cur_telno) //第一・第二・第三の階層部門名取り出し
	//内訳項目取り出し
	//金額と金額詳細取り出し
	//請求明細追加
	{
		if (11 != csv.length) {
			// this.putOperator(ScriptLog.G_SCRIPT_WARNING, "\u8ACB\u6C42\u66F8\u60C5\u5831\u8A73\u7D30\u884C" + `レコード数異常(${fname},${lineno})` + csv.length);
			this.putOperator(G_SCRIPT_WARNING, "請求書情報詳細行" + `レコード数異常(${fname},${lineno})` + csv.length);
			return false;
		}

		// var H_line = Array();
		var H_line: { [key: string]: any } = {};
		// H_line.telno = str_replace("-", "", csv[0].trim());
		H_line.telno = csv[0].trim().replace("-", "");

		if (0 == H_line.telno.length) {
			// this.putOperator(ScriptLog.G_SCRIPT_WARNING, "\u8ACB\u6C42\u66F8\u60C5\u5831\u8A73\u7D30\u884C" + `電話番号が無い(${fname},${lineno})` + csv[0]);
			this.putOperator(G_SCRIPT_WARNING, "請求書情報詳細行" + `電話番号が無い(${fname},${lineno})` + csv[0]);
			return false;
		}

		// if (strcmp(cur_telno, H_line.telno)) {
		if (cur_telno.localeCompare(H_line.telno)) {
			cur_telno = H_line.telno;
			detailno = 0;
		} else ++detailno;

		H_line.detailno = detailno;
		H_line.level1 = csv[1].trim();
		H_line.level2 = csv[2].trim();
		H_line.level3 = csv[3].trim();
		H_line.label = csv[4].trim();
		H_line.charge_orig = csv[5].trim();
		// if (is_numeric(H_line.charge_orig)) H_line.charge = 0 + H_line.charge_orig;
		if (!isNaN(Number(H_line.charge_orig))) H_line.charge = 0 + H_line.charge_orig;
		H_line.charge_details_orig = csv[6].trim();
		// if (is_numeric(H_line.charge_details_orig)) H_line.charge_details = 0 + H_line.charge_details_orig;
		if (!isNaN(Number(H_line.charge_details_orig))) H_line.charge_details = 0 + H_line.charge_details_orig;
		H_line.code = csv[7].trim();
		H_line.details1 = csv[8].trim();
		H_line.details2 = csv[9].trim();
		H_line.taxtype = csv[10].trim();
		return this.m_inserter.insert(H_line);
	}

};
