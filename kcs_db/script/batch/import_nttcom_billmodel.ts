//======================================================================================
//NTTcom取込み
//
//procとかmodelとかややこしい名前がついてますが、作り方をclassにしただけで
//機能はV2時代の物を使っています(import_nttcom_wld*をベースに作ったため)
//
//author igarashi
//======================================================================================

// 2022cvt_026
// require("import_nttcom_modelbase.php");
import importNTTComModelBase from "../batch/import_nttcom_modelbase"

// 2022cvt_026
// require("model/script/TelAmountModel.php");
import TelAmountModel from "../../class/model/script/TelAmountModel";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as flock from "proper-lockfile";
import { TableInserter } from "./lib/script_db";

export default class importNTTComBillModel extends importNTTComModelBase {
	static BILLDIR = "bill";
	static FIX_BILLDIR = "fixbill";
	static REF_TYOSEI = "5000";
	static CODE_WARI = "割引額";
	static BILL_CONNOTE = 16;
	static BILL_LENGTH = 21;
	static NET_KIND = "4";
	static TAX_NOT_TAG = "13";

	billname: string;
	readtelcnt: number;
	readmeisaicnt: number;
	addtelcnt: number;
	linelength: number;
	totalbill: number;
	alltotalbill: number;
	H_overtel: Array<any>;
	H_regpost: Array<any>;
	A_filedata: Array<any>;
	A_teldata: Array<any>;
	A_pactDone: Array<any>;
	A_pactfail: Array<any>;
	A_telnoCom: Array<any>;
	A_outtel: Array<any>;
	endlist: any;
	dummypost: undefined;
	carid: any;
	A_telnoX: any;
	H_argv: any;
	O_tab: any;
	O_base: any;
	billno: any;
	teldetail: any;
	telxfile: any;
	tellX_tb: string = "";
	billdir: string = "";
	dummytelno: undefined | string;
	datadir: string = "";
	carkind: string = "";
	H_telXinfo: any;
	arid: string = "";
	cirid: string = "";
	A_pactid: any;
	H_eracepact: any;

	constructor(O_base: any) {
		super(O_base);
		this.billname = "番号明細";
		this.readtelcnt = 0;
		this.readmeisaicnt = 0;
		this.addtelcnt = 0;
		this.linelength = 512;
		this.totalbill = 0;
		this.alltotalbill = 0;
		this.H_overtel = Array();
		this.H_regpost = Array();
		this.A_filedata = Array();
		this.A_teldata = Array();
		this.A_pactDone = Array();
		this.A_pactfail = Array();
		this.A_telnoCom = Array();
		this.A_outtel = Array();
	}

	initialize() {
		this.readtelcnt = 0;
		this.readmeisaicnt = 0;
		this.addtelcnt = 0;
		this.totalbill = 0;
		this.alltotalbill = 0;
		this.H_overtel = Array();
		this.H_regpost = Array();
		this.A_filedata = Array();
		this.A_teldata = Array();
		this.A_pactDone = Array();
		this.A_pactfail = Array();
		this.A_telnoCom = Array();
		this.A_outtel = Array();
	}

	checkRegistTel(telno: string, pactid: any) {
		if (false == (undefined !== this.endlist[telno])) {
			this.endlist[telno] = telno;

			if (true == (-1 !== this.A_telnoCom.indexOf(telno))) {
				return true;
			}

// 2022cvt_015
			var A_telCount = {};
			for (var i = 0; i < this.A_telnoX.length; i++) {
				var key = this.A_telnoX[i];
				A_telCount[key] = A_telCount[key] ? A_telCount[key] + 1 : 1;
			}

			// A_telCount = array_count_values(this.A_telnoX);

			if (false == (undefined !== A_telCount[telno])) {
				if (false == (undefined !== this.dummypost) || "" == this.dummypost) {
					this.outWarning("未登録番号：dummy_tel_tbに請求先部署が設定されていません(" + telno + ")(" + this.billname + ")");
					return false;
				} else {
					this.A_teldata.push([this.dummypost, telno, this.carid]);
				}

				this.addtelcnt++;
				return false;
			} else if (1 == A_telCount[telno]) {
				this.A_teldata.push([this.H_regpost[telno], telno, this.carid]);
				this.addtelcnt++;
				return true;
			} else if (1 < A_telCount[telno]) {
				if (false != (undefined !== this.H_overtel[telno].post) && "" != this.H_overtel[telno].post) {
					this.A_teldata.push([this.H_overtel[telno].post, telno]);
					return false;
				} else {
					if (false == (undefined !== this.dummypost) || "" == this.dummypost) {
						this.outWarning("未登録番号：dummy_tel_tbに請求先部署が設定されていません(" + telno + ")(" + this.billname + ")");
						return false;
					} else {
						this.A_teldata.push([this.dummypost, telno]);
					}

					this.addtelcnt++;
					return false;
				}
			}
		} else {
			return true;
		}
	}

	doEachFile(H_utiwake: any, filename: string, pactid: any) //請求部分
	{
// 2022cvt_015
		var buffer;
		try {
			buffer = fs.readFileSync(filename, "utf8");
		} catch (e) {
			this.outWarning(filename + "のオープンに失敗");
			return false;
		}
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var lines = text.toString().split("\r\n");
		// var fp = fopen(filename, "rb");

		if (flock.checkSync(filename)) {
		// if (false == flock(fp, LOCK_SH)) {
			this.outWarning(filename + "のロックに失敗");
			// fclose(fp);
			return false;
		}
		flock.lockSync(filename);

// 2022cvt_015
		// var line = fgets(fp);
		// line = rtrim(line, "\r\n");

		if (false == this.checkLineLength(filename, lines[0], this.linelength)) {
			flock.unlockSync(filename);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return false;
		}

		if (false == this.checkBillFileData(lines[0], true)) {
			flock.unlockSync(filename);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return false;
		}

// 2022cvt_015
		var H_code = this.getHashCode(H_utiwake);

		for (var line of lines.splice(1)) {
		// while (line = fgets(fp)) {
			// if (feof(fp)) {
			// 	break;
			// }

			// line = rtrim(line, "\r\n");

			if (false == this.checkLineLength(filename, line, this.linelength)) {
				flock.unlockSync(filename);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return false;
			}

// 2022cvt_015
			var datakind = line.substring(11, 2);

			if (importNTTComBillModel.KIND_BILL == datakind) {
				if (false == this.execBillDetail(H_utiwake, H_code, line, pactid, filename)) {
					flock.unlockSync(filename);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return false;
				}
			} else if (importNTTComBillModel.KIND_TOTAL == datakind) //特にチェックしない
				{} else if (importNTTComBillModel.KIND_EOF == datakind) {
				if (false == this.checkEOFRecord(line, pactid, filename)) {
					flock.unlockSync(filename);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return false;
				}

				this.alltotalbill = this.alltotalbill + this.totalbill;
// 2022cvt_015
				var amountData = {
					year: this.H_argv.billdate.substring(0, 4),
					month: this.H_argv.billdate.substring(4, 2),
					pactid: pactid,
					carid: this.carid
				};
				this.O_tab.setBasicData(amountData);
				this.O_tab.makeFile(amountData.year, amountData.month, pactid);
				this.O_tab.writeFile({
					charge: this.totalbill,
					prtelno: this.billno,
					recdate: this.O_base.getTimestamp()
				});
				this.totalbill = 0;
			} else {
				this.outWarning("未知のデータ種類(" + datakind + ")(" + this.billname + ")");
				flock.unlockSync(filename);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return false;
			}
		}

		flock.unlockSync(filename);
		// flock(fp, LOCK_UN);
		// fclose(fp);
		return true;
	}

	async doImport() //20110516
	{
		this.teldetail;
		this.telxfile;

		if (0 < fs.statSync(this.telxfile).size) {
		// if (0 < filesize(this.telxfile)) {
// 2022cvt_015
			var A_telcol = ["pactid", "postid", "telno", "telno_view", "userid", "carid", "arid", "cirid", "machine", "color", "employeecode", "username", "mail", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "date1", "date2", "memo", "kousiflg", "kousiptn", "username_kana", "kousi_fix_flg", "mail1", "mail2", "mail3", "url1", "url2", "url3", "recdate", "fixdate"];

			if (false == await this.doCopyInsert(this.O_base.getTable("telX"), this.telxfile, A_telcol)) {
				this.outWarning(this.telxfile + "のインポートに失敗");
				this.getDB().rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
				this.outInfo(this.telxfile + "インポート完了");
			}
		}

		if (0 < fs.statSync(this.teldetail).size) {
		// if (0 < filesize(this.teldetail)) {
			A_telcol = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "prtelno"];

			if (false == await this.doCopyInsert(this.O_base.getTable("teldetailX"), this.teldetail, A_telcol)) {
				this.outWarning(this.teldetail + "のインポートに失敗");
				this.getDB().rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
				this.outInfo(this.teldetail + "インポート完了");
			}
		} else {
			this.outWarning(this.teldetail + "のファイルサイズが0です");
			return false;
		}

		if (0 < fs.statSync(this.O_tab.getFilePath()).size) {
		// if (0 < filesize(this.O_tab.getFilePath())) {
			if (false == await this.doCopyInsert(this.O_tab.getTableName(), this.O_tab.getFilePath(), this.O_tab.getAmountColumn())) {
				this.outWarning(this.O_tab.getTableName() + "のインポートに失敗");
				this.getDB().rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
				this.outInfo(this.O_tab.getTableName() + "インポート完了");
			}
		} else {
			this.outWarning(this.O_tab.getTableName() + "のファイルサイズが0です");
		}

		return true;
	}

	async doCopyInsert(table: any, filename: string, A_col: Array<any>) {
// 2022cvt_015
		var buffer;
		try {
			buffer = fs.readFileSync(filename, "utf8");
		} catch (e) {
			this.outWarning(filename + "のオープンに失敗");
			return false;
		}
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var lines = text.toString().split("\r\n");

// 2022cvt_015
		var O_ins = new TableInserter(this.getLog(), this.getDB(), filename + ".sql", true);
		O_ins.begin(table);

		for (var line of lines) {
		// while (line = fgets(fp)) {
// 2022cvt_015
			var A_line = line.split("\t");
			// var A_line = split("\t", rtrim(line, "\n"));

			if (A_line.length != A_col.length) {
				this.outWarning(filename + "のデータ数が設定と異なります(" + A_line.length + "=" + A_col.length + ")(" + this.billname + ")");
				// fclose(fp);
				return false;
			}

// 2022cvt_015
			var H_ins = {};
// 2022cvt_015
			var idx = 0;

// 2022cvt_015
			for (var val of A_col) {
				if ("\\N" != A_line[idx]) {
					H_ins[val] = A_line[idx];
				}

				idx++;
			}

			if (false == await O_ins.insert(H_ins)) {
				this.outWarning(filename + "のインサート中にエラー発生 (" + line + ")(" + this.billname + ")");
				// fclose(fp);
				return false;
			}
		}

		if (false == O_ins.end()) {
			this.outWarning(filename + "のインサート処理に失敗");
			// fclose(fp);
			return false;
		}

		// fclose(fp);
		return true;
	}

	execBillDetail(H_utiwake: any, H_code: any[], line: string, pactid: any, filename: string) //内訳情報を取得する
	{
// 2022cvt_015
		var allbill = line.substring(142, 336);
// 2022cvt_015
		var telno = this.getBillTelno(line, 0, 10);
		telno = telno.trim();

// 2022cvt_019
		if (!telno.match("/^0[789]0/") && telno.match("/^00/")) {
		// if (true != preg_match("/^0[789]0/", telno) && true == preg_match("/^00/", telno)) {
			telno = telno.substring(1, telno.length);
		}

		if ("" != telno) {
			this.checkRegistTel(telno, pactid);
		}

// 2022cvt_015
		for (var i = 0; i < importNTTComBillModel.BILL_CONNOTE; i++) //請求部分を1件ずつ取得
		{
// 2022cvt_015
			var indivbill = line.substring(i * importNTTComBillModel.BILL_LENGTH + 141, importNTTComBillModel.BILL_LENGTH);
// 2022cvt_015
			var nullcheck = indivbill.replace(/ /g, "");

			if (0 == nullcheck.length) {
				continue;
			}

// 2022cvt_015
			var H_bill = this.classifyBillData(indivbill, importNTTComBillModel.NET_KIND + "-");

			if (false == (undefined !== H_code[H_bill.code])) {
				this.outWarning("不明な内訳コードです(" + this.billname + ").telno=" + telno + " code=" + H_bill.code);
				return false;
			}

// 2022cvt_016
// 2022cvt_015
			var taxkind = this.getTaxType(H_bill.taxtype);

			if ("error" == taxkind) {
				return false;
			}

			this.A_filedata.push([telno, H_bill.code, H_bill.bill, taxkind, H_code[H_bill.code]]);
			this.readmeisaicnt++;
			this.totalbill = this.totalbill + H_bill.bill;
		}

		return true;
	}

	execErase(flg: string, pactid: string) {
		if ("o" != flg) {
			return true;
		}

		this.outInfo("デリート処理開始(" + this.billname + ")");
		this.setEraceFlag(this.carid, pactid);
		this.getDB().begin();
// 2022cvt_015
		var sql = "DELETE FROM " + this.O_base.getTable("teldetailX") + " WHERE pactid=" + pactid + " AND carid=" + this.carid;
// 2022cvt_015
		var result = this.getDB().query(sql, false);

// 2022cvt_016
		if (true == ("object" === typeof result)) {
			this.outError(this.O_base.getTable("teldetailX") + "のデリートに失敗しました" + result.userinfo);
			this.getDB().rollback();
			return false;
		}

		sql = "DELETE FROM " + this.O_base.getTable("telX") + " WHERE pactid=" + pactid + " AND carid=" + this.carid;
		result = this.getDB().query(sql, false);

// 2022cvt_016
		if (true == ("object" === typeof result)) {
			this.outError(this.tellX_tb + "のデリートに失敗しました" + result.userinfo);
			this.getDB().rollback();
			return false;
		}

		this.getDB().commit();
		this.outInfo("デリート処理終了(" + this.billname + ")");
		return true;
	}

	getBillTelno(line: string, start: number, end: number) {
// 2022cvt_015
		var telno = "0";
		telno += line.substring(start, end);
		return telno;
	}

	getTelXInfo(pactid: string, carid: string) {
// 2022cvt_015
		var sql = "SELECT telno FROM " + this.O_base.getTable("telX") + " WHERE pactid=" + pactid + " AND carid=" + carid;
// 2022cvt_015
		var A_tmptel = this.getDB().getHash(sql, true);

// 2022cvt_015
		for (var data of A_tmptel) {
			this.A_telnoCom.push(data.telno);
		}
	}

	preDeleteProc(A_billFile: Array<any>, dataDirPact: string, pactid: any) {
		A_billFile.sort();
		this.outInfo("前処理開始");

// 2022cvt_015
		for (var filename of A_billFile) {
			// PHPファイルのpreEachFile関数は引数がふたつだった為
			if (false != this.preEachFile(dataDirPact + "/" + filename, pactid)) {
			// if (false != this.preEachFile(dataDirPact + "/" + filename, pactid, this.H_argv.billdate, this.getDB())) {
				continue;
			} else {
				this.outError("前処理に失敗しました(" + filename + ")");
			}
		}

		this.outInfo("前処理終了");
	}

	getTaxType(code: string) {
		switch (code) {
			case "10":
			case "20":
				return "内税";
				break;

			case "11":
			case "21":
				return "合算";
				break;

			case "13":
			case "23":
				return "非対象等";
				break;

			case "15":
			case "25":
				return "個別";
				break;

			case "80":
			case "82":
			case "90":
			case "92":
				return "個別";
				break;

			default:
				this.outWarning("不明な税コードです(" + code + ")(" + this.billname + ")");
				break;
		}

		return "error";
	}

	getOutTel() {
		return this.A_outtel;
	}

	preEachFile(filename: string, pactid: string) //1行ずつ取得
	{
// 2022cvt_015
		var buffer;
		try {
			buffer = fs.readFileSync(filename, "utf8");
		} catch (e) {
			this.outWarning(filename + "のオープン失敗(preEachFile)");
			return false;
		}
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var lines = text.toString().split("\r\n");
		// var fp = fopen(filename, "rb");

		if (flock.checkSync(filename)) {
			this.outWarning(filename + "のロックに失敗");
			// fclose(fp);
			return false;
		}
		flock.lockSync(filename);

// 2022cvt_015
		// var line = fgets(fp);

		for (var line of lines.splice(1))
		// while (line = fgets(fp)) //telX_tbに登録されている電話だけ処理
		{
			// if (feof(fp)) {
			// 	break;
			// }

			// line = rtrim(line, "\r\n");

			if (false == this.checkLineLength(filename, line, this.linelength)) {
				flock.unlockSync(filename);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return false;
			}

// 2022cvt_015
			var datakind = line.substring(11, 2);

			if (importNTTComBillModel.KIND_BILL != datakind) {
				continue;
			}

// 2022cvt_015
			var telno = this.getBillTelno(line, 0, 10);
// 2022cvt_015
			var A_telCount = {};
			for (var i = 0; i < this.A_telnoX.length; i++) {
				var key = this.A_telnoX[i];
				A_telCount[key] = A_telCount[key] ? A_telCount[key] + 1 : 1;
			}
			// A_telCount = array_count_values(this.A_telnoX);

			if (true == (undefined !== A_telCount[telno])) {
				if (1 < A_telCount[telno]) //複数登録されている電話で、postidが違うものを取り出す
					//複数登録の電話番号全て同じ部署に所属していたらその部署に請求
					{
// 2022cvt_015
						var sql = "SELECT postid FROM " + this.O_base.getTable("telx") + " WHERE pactid=" + pactid + " AND telno='" + telno + "' AND carid !=" + this.carid;
// 2022cvt_015
						var A_postid = this.getDB().getCol(sql, true);
// 2022cvt_015
						var A_cnt = {};
						for (var i = 0; i < A_postid.length; i++) {
							var key = A_postid[i];
							A_cnt[key] = A_cnt[key] ? A_cnt[key] + 1 : 1;
						}
						// var A_cnt = array_count_values(A_postid);

						if (A_cnt[A_postid[0]] == A_postid.length) {
							this.H_overtel[telno] = {
								no: 1,
								post: A_postid[0]
							};
						} else {
// 2022cvt_015
							var inspostid = this.getMinimamCarrierPost(telno);

							if (false == !inspostid) {
								this.H_overtel[telno] = {
									no: A_postid.length,
									post: inspostid
								};
							} else {
								if (false == (undefined !== this.dummypost) || "" == this.dummypost) {
									this.outWarning("未登録番号：dummy_tel_tbに請求部署が登録されていません(" + telno + ")(" + this.billname + ")");
									flock.unlockSync(filename);
									// flock(fp, LOCK_UN);
									// fclose(fp);
									return false;
								} else {
									this.H_overtel[telno] = {
										no: A_postid.length,
										post: this.dummypost
									};
								}
							}
						}
					} else if (1 == A_telCount[telno]) {
					sql = "SELECT postid FROM " + this.O_base.getTable("telX") + " WHERE pactid=" + pactid + " AND telno='" + telno + "' AND carid !=" + this.carid;
// 2022cvt_015
					var regpost = this.getDB().getOne(sql, true);
					this.H_regpost[telno] = regpost;
				}
			}
		}

		flock.unlockSync(filename);
		// flock(fp, LOCK_UN);
		// fclose(fp);
		return true;
	}

	async readBillFile(A_billFile: any[], H_utiwake: any, dataDirPact: string, pactid: { [key: string]: string }) {
// 2022cvt_015
		var errflag = false;

// 2022cvt_015
		for (var filename of A_billFile) {
			this.outInfo(dataDirPact + "/" + filename + importNTTComBillModel.LOG_DELIM + "データ読込処理開始");

			if (false == this.doEachFile(H_utiwake, dataDirPact + "/" + filename, pactid.value)) {
				errflag = true;
				break;
			}

			this.outInfo(dataDirPact + "/" + filename + importNTTComBillModel.LOG_DELIM + "データ読込処理完了：電話件数=" + this.readtelcnt + ": 明細件数=" + this.readmeisaicnt + ":追加電話件数(" + this.O_base.getTable("telX") + ")=" + this.addtelcnt);
		}

		if (false == errflag) //$this->moveFinishDir($this->billdir, $pactid);
			{
				this.outInfo("データ書出処理開始");

				if (false == this.writeTelData(pactid.value)) {
					this.outWarning(this.telxfile + "ファイルの書出に失敗(1)");
					this.A_pactfail.push(pactid.value);
					this.getDB().rollback();
					return false;
				}

				if (false == this.writeInsFile(pactid.value)) {
					this.outWarning(this.teldetail + "ファイルの書出に失敗(2)");
					this.A_pactfail.push(pactid.value);
					this.getDB().rollback();
					return false;
				}

				this.outInfo("インポート処理開始(" + this.billname + ")");
				this.getDB().begin();

				if (false == await this.doImport()) {
					this.getDB().rollback();
					return false;
				}

				this.outInfo("インポート処理終了(" + this.billname + ")");
				this.getDB().commit();
				this.A_pactDone.push(pactid);
			} else {
			this.O_base.getDB().commit();
			this.A_pactfail.push(pactid);
		}
	}

	setBillDir(carid = "") {
		if ("" == carid) {
			carid = this.carid;
		}

		switch (carid) {
			case (importNTTComModelBase.NTTCOM_CARID).toString():
				this.billdir = importNTTComBillModel.BILLDIR;
				break;

			case (importNTTComModelBase.NTTCOM_FIX_CARID).toString():
				this.billdir = importNTTComBillModel.FIX_BILLDIR;
				break;
		}
	}

	setOutTel(A_array: () => any[]) {
		if (Array() == this.A_outtel) {
			this.A_outtel = A_array();
		} else if (true == Array.isArray(this.A_outtel)) {
			this.A_outtel = this.A_outtel.concat(A_array);
			// this.A_outtel = array_merge(this.A_outtel, A_array);
		}
	}

	writeTelData(pactid: string) //tel_x_tbに追加する電話を出力
	{
		if (false != (undefined !== this.dummytelno) || "" != this.dummytelno) {
			if (false == (-1 !== this.A_telnoCom.indexOf(this.dummytelno))) {
				this.A_teldata.push([this.dummypost, this.dummytelno, this.carid]);
			}
		}

// 2022cvt_015
		var nowtime = this.O_base.getTimestamp();
		this.telxfile = this.datadir + "/" + this.O_base.getTable("telX") + pactid + importNTTComBillModel.FILE_EXT + this.carkind + ".tmp";
// 2022cvt_015
		var fp_telx = fs.openSync(this.telxfile, "w");
		// var fp_telx = fopen(this.telxfile, "w");

		if (undefined == fp_telx) {
			this.outError(this.telxfile + "の書込オープン失敗");
			return false;
		}

// 2022cvt_015
		var A_nullbox = Array();

// 2022cvt_015
		for (var i = 0; i <= 36; i++) {
			A_nullbox[i] = "\\N";
		}

// 2022cvt_015
		for (var A_data of this.A_teldata) //tel_x_tbに1件だけ登録済みで電話情報があればコピー
		//公私分計をする電話は全て「会社設定にしたがう」にする
		{
// 2022cvt_015
			var postid = A_data[0];
// 2022cvt_015
			var telno = A_data[1];

// 2022cvt_019
			if (true == telno.match("/^0[789]0/") && 11 <= telno.length) {
			// if (true == preg_match("/^0[789]0/", telno) && 11 <= telno.length) {
// 2022cvt_015
				var telno_view = this.O_base.makeTelnoView(telno);
			} else {
				telno_view = telno;
			}

			if (true == (undefined !== this.H_telXinfo[telno])) {
// 2022cvt_015
				var sql = "SELECT " + "userid, machine, color, employeecode, username, mail, " + "text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, " + "int1, int2, int3, date1, date2, memo, kousiflg, kousiptn, username_kana, kousi_fix_flg, " + "mail1, mail2, mail3, url1, url2, url3 " + "FROM " + this.O_base.getTable("telX") + " " + "WHERE " + "pactid=" + pactid + " AND carid !=" + this.carid + " AND telno='" + telno + "' " + "LIMIT 1";
// 2022cvt_015
				var H_telinfo = this.getDB().getAll(sql, true);
// 2022cvt_015
				var H_tmp_info = H_telinfo[0];

				if (!!H_tmp_info[26]) {
					H_tmp_info[26] = H_tmp_info[26].replace("/(\n|\r\n|\r)/", "LFkaigyoLF");
					// H_tmp_info[26] = preg_replace("/(\n|\r\n|\r)/", "LFkaigyoLF", H_tmp_info[26]);
				}

// 2022cvt_015
				var endcnt = H_tmp_info.length;

				for (i = 0; i < endcnt; i++) {
					if (undefined == H_tmp_info[i] || "" == H_tmp_info[i]) {
						H_tmp_info[i] = "\\N";
					}
				}
			} else {
				H_tmp_info = A_nullbox;
			}

			if (0 == H_tmp_info[27]) {
				H_tmp_info[27] = "\\N";
			}

			H_tmp_info[28] = "\\N";

// 2022cvt_015
			for (var key in H_tmp_info) {
// 2022cvt_015
				var value = H_tmp_info[key];
				H_tmp_info[key] = value.replace(/	/g, "");
			}

			fs.writeFileSync(fp_telx, pactid + "\t" + postid + "\t" + telno + "\t" + telno_view + "\t" + H_tmp_info[0] + "\t" + this.carid + "\t" + this.arid + "\t" + this.cirid + "\t" + H_tmp_info[1] + "\t" + H_tmp_info[2] + "\t" + H_tmp_info[3] + "\t" + H_tmp_info[4] + "\t" + H_tmp_info[5] + "\t" + H_tmp_info[6] + "\t" + H_tmp_info[7] + "\t" + H_tmp_info[8] + "\t" + H_tmp_info[9] + "\t" + H_tmp_info[10] + "\t" + H_tmp_info[11] + "\t" + H_tmp_info[12] + "\t" + H_tmp_info[13] + "\t" + H_tmp_info[14] + "\t" + H_tmp_info[15] + "\t" + H_tmp_info[16] + "\t" + H_tmp_info[17] + "\t" + H_tmp_info[18] + "\t" + H_tmp_info[19] + "\t" + H_tmp_info[20] + "\t" + H_tmp_info[21] + "\t" + H_tmp_info[22] + "\t" + H_tmp_info[23] + "\t" + H_tmp_info[24] + "\t" + H_tmp_info[25] + "\t" + H_tmp_info[26] + "\t" + H_tmp_info[27] + "\t" + H_tmp_info[28] + "\t" + H_tmp_info[29] + "\t" + H_tmp_info[30] + "\t" + H_tmp_info[31] + "\t" + H_tmp_info[32] + "\t" + H_tmp_info[33] + "\t" + H_tmp_info[34] + "\t" + H_tmp_info[35] + "\t" + H_tmp_info[36] + "\t" + nowtime + "\t" + nowtime + "\n");// 2022cvt_006
		}

		fs.closeSync(fp_telx);
		// fclose(fp_telx);
		return true;
	}

	writeInsFile(pactid: string) //番号明細
	//按分
	{
// 2022cvt_015
		var aspcharge = 0;
// 2022cvt_015
		var aspflg = false;
// 2022cvt_015
		var totalwari = 0;
// 2022cvt_015
		var totalprice = 0;

		var H_anbundata = Array();

		if (0 == this.A_filedata.length) {
			return false;
		}

		if (false == (undefined !== this.dummytelno) || "" == this.dummytelno) {
			this.dummytelno = "";
		}

		if ("y" == this.H_argv.anbun) //按分して合計額に差がでたらダミーに入れる
			{
				totalwari = 0;
// 2022cvt_015
				var etcwari = 0;
				{
					let _tmp_0 = this.A_filedata;

// 2022cvt_015
					for (var key in _tmp_0) {
// 2022cvt_015
						var val = _tmp_0[key];

						if (0 >= val[2]) {
							totalwari += val[2];
							delete this.A_filedata[key];
						} else {
							totalprice += val[2];
						}
					}
				}

				if (0 < totalwari) {
					this.outWarning("割引額が異常です(" + totalwari + ")");
					return false;
				}

// 2022cvt_015
				var discount = totalwari / totalprice;
				discount = Math.ceil(discount * 10000) / 10000;
// 2022cvt_015
				var H_anbun = Array();
// 2022cvt_015
				var totalanbun = 0;
				{
					let _tmp_1 = this.A_filedata;

// 2022cvt_015
					for (var key in _tmp_1) {
// 2022cvt_015
						var val = _tmp_1[key];

						if (false == (undefined !== H_anbun[val[0]])) {
							H_anbun[val[0]] = {
								telno: val[0],
								charge: 0
							};
						}

						H_anbun[val[0]].charge = Math.round(val[2] * discount);
						H_anbun[val[0]].code = importNTTComBillModel.REF_TYOSEI;
						H_anbun[val[0]].name = importNTTComBillModel.CODE_WARI;
						H_anbun[val[0]].taxkubun = importNTTComBillModel.TAX_NOT_TAG;
						totalanbun += H_anbun[val[0]].charge;
					}
				}

				if (this.alltotalbill != totalprice + totalanbun) {
// 2022cvt_015
					var charge = (totalprice + totalanbun - this.alltotalbill) * -1;
					this.A_filedata.push([this.dummytelno, importNTTComBillModel.REF_TYOSEI, charge, importNTTComBillModel.TAX_NOT_TAG, importNTTComBillModel.CODE_WARI]);
				}

// 2022cvt_015
				H_anbundata = Array();

				if (0 < H_anbun.length) {
// 2022cvt_015
					for (var val of H_anbun) {
						H_anbundata.push([val.telno, val.code, val.charge, importNTTComBillModel.TAX_NOT_TAG, val.code, val.name]);
					}
				}
			}

		if (true == this.O_base.checkAsp(pactid)) {
			aspflg = true;
			aspcharge = this.O_base.getAsp(pactid, this.carid);

			if (undefined == aspcharge) {
				this.outWarning("ASP利用料が設定されていません");
				return false;
			}
		}

		this.teldetail = this.datadir + "/" + this.O_base.getTable("teldetailX") + pactid + importNTTComBillModel.FILE_EXT + this.carkind + ".tmp";
// 2022cvt_015
		var fp;
		try {
			fp = fs.openSync(this.teldetail, "w");
		} catch (e) {
			this.outWarning(this.teldetail + "の書込オープン失敗");
			return false;
		}
		// var fp = fopen(this.teldetail, "w");

// 2022cvt_015
		var detailno = 0;
// 2022cvt_015
		var A_detail = Array();
// 2022cvt_015
		var nowtime = this.O_base.getTimestamp();

// 2022cvt_015
		for (var val of this.A_filedata) {
			if (false == (-1 !== this.A_outtel.indexOf(val[0]))) {
				this.A_outtel.push(val[0]);
			}

			fs.writeFileSync(fp, pactid + "\t" + val[0] + "\t" + val[1] + "\t" + val[4] + "\t" + val[2] + "\t" + val[3] + "\t" + detailno + "\t" + nowtime + "\t" + this.carid + "\t" + this.billno + "\n");// 2022cvt_006
			A_detail[val[0]] = 1;
		}

		if ("y" == this.H_argv.anbun) {
// 2022cvt_015
			for (var val of H_anbundata) {
				if (true == (undefined !== A_detail[val[0]])) {
					detailno = A_detail[val[0]];
				} else {
					detailno = 0;
				}

				fs.writeFileSync(fp, pactid + "\t" + val[0] + "\t" + val[1] + "\t" + val[5] + "\t" + val[2] + "\t" + "非対象等\t" + detailno + "\t" + nowtime + "\t" + this.carid + "\t" + this.billno + "\n");// 2022cvt_006
				detailno++;
				A_detail[val[0]] = detailno;

				if (false == (-1 !== this.A_outtel.indexOf(val[0]))) {
					this.A_outtel.push(val[0]);
				}
			}
		}

// 2022cvt_015
		for (var val of this.A_outtel) {
			if (this.dummytelno != val) {
				detailno = A_detail[val];
				detailno++;

				if (true == aspflg) {
					fs.writeFileSync(fp, pactid + "\t" + val + "\t" + importNTTComBillModel.REF_ASP + "\t" + importNTTComBillModel.REF_ASP_NAME + "\t" + aspcharge + "\t" + "\\N\t" + detailno + "\t" + nowtime + "\t" + this.carid + "\t" + "\\N" + "\n");// 2022cvt_006
					detailno++;
					fs.writeFileSync(fp, pactid + "\t" + val + "\t" + importNTTComBillModel.REF_ASX + "\t" + importNTTComBillModel.REF_ASX_NAME + "\t" + +(aspcharge * importNTTComBillModel.EXCISE_RATE + "\t" + "\\N\t" + detailno + "\t" + nowtime + "\t" + this.carid + "\t" + "\\N" + "\n"));// 2022cvt_006
				}
			}
		}

		fs.closeSync(fp);
		// fclose(fp);
		return true;
	}

	async execMainProc(H_pact: { [x: string]: any; }, H_utiwake: any, H_erace: any) //指定されたpact分ループ
	{
		this.O_tab = new TelAmountModel(this.datadir, this.getLog(), this.H_argv, importNTTComBillModel.SCRIPT_NAMEJ);
// 2022cvt_015
		var pactcnt = this.A_pactid.length;
		this.H_eracepact = H_erace;
		this.A_pactid.sort();

// 2022cvt_015
		for (var i = 0; i < pactcnt; i++) //20110516
		//マスターになければ次へ進む
		//$dataDirPact = $this->datadir. "/". $pactid. "/" .$this->billdir;
		//請求データファイル名取得
		//請求ファイルがなければ次の会社へ
		//$billno = $this->getBillNo($this->carid, $fileName);
		//削除してなければ実行
		{
			this.initialize();

			if (false == (undefined !== H_pact[this.A_pactid[i]])) {
				this.outWarning("pactid=" + this.A_pactid[i] + "はpact_tbに登録されていません");
				continue;
			}

// 2022cvt_015
			var pactid = { "value": this.A_pactid[i] };
// 2022cvt_015
			var pactname = H_pact[pactid.value];
// 2022cvt_015
			var A_billFile = Array();
// 2022cvt_015
			var dataDirPact = this.datadir + "/" + this.billdir + "/" + pactid.value;

			if (false == fs.existsSync(dataDirPact)) {// 2022cvt_003
				continue;
			}

// 2022cvt_015
			var dirh = fs.readdirSync(dataDirPact);
			// var dirh = openDir(dataDirPact);// 2022cvt_004
			this.billno = "";

			for (var fileName of dirh) {
			// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
				if (fs.statSync(dataDirPact + "/" + fileName).isFile()) {
				// if (true == is_file(dataDirPact + "/" + fileName)) {
					A_billFile.push(fileName);
				}

// 				clearstatcache();// 2022cvt_012
			}

			if (Array() == A_billFile) {
				this.outWarning("pactid=" + pactid.value + "の請求データファイルが見つかりません");
				// closedir(dirh);
				continue;
			} else {
				fileName = this.getFileName(A_billFile, A_billFile.length);
			}

			this.billno = this.getBillNo(this.carid, pactid.value);

			if (undefined == this.billno) {
				this.outWarning(fileName + "についての請求番号がbill_prtel_tbに見つかりません(" + this.billname + ")");
				continue;
			}

// 2022cvt_015
			var A_code = this.getBillCode(this.carid, pactid);

			if (Array() == A_code) {
				this.outWarning("pactid=" + pactid.value + "についての請求番号が見つかりません(" + this.billname + ")");
				continue;
			}

			this.outLog(this.carid + "--" + pactid);
			this.getTelInfo(this.carid, pactid);
			this.getDummyTel(this.carid, pactid, "WLD");
			this.execBackup(this.H_argv.backup);
			this.preDeleteProc(A_billFile, dataDirPact, pactid);

			if (false == (undefined !== this.H_eracepact[this.carid][pactid.value])) {
				this.execErase(this.H_argv.erase, pactid.value);
			}

			this.getTelXInfo(pactid.value, this.carid);

			if (false == await this.readBillFile(A_billFile, H_utiwake, dataDirPact, pactid)) {
				continue;
			}

			this.outResult();
			this.outDebug("処理対象ファイル:" + A_billFile.join(", "));
			// closedir(dirh);
		}

		return true;
	}

// 	__destruct() {}// 2022cvt_014

};
