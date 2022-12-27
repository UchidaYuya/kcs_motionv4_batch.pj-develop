//======================================================================================
//NTTcom取込み
//
//procとかmodelとかややこしい名前がついてますが、作り方をclassにしただけで
//機能はV2時代の物を使っています(import_nttcom_wld*をベースに作ったため)
//
//author igarashi
//======================================================================================

// 2022cvt_026
import importNTTComModelBase from "../batch/import_nttcom_modelbase";
import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as flock from "proper-lockfile";
import { TableInserter } from "./lib/script_db";
// require("import_nttcom_modelbase.php");

export default class importNTTComTuwaModel extends importNTTComModelBase {
	static BILLDIR = "tuwa";
	static FIX_BILLDIR = "fixtuwa";
	static NET_KIND = "9";
	static KIND_MANAGE = "1";
	static KIND_TELMAN = "2";
	static KIND_BILL = "3";
	static KIND_NOEND = "5";
	static KIND_EOF = "9";
	static BILL_CONNOTE = 1;
	static BILL_LENGTH = 58;
	static NTTCOM_CARID = 14;
	static NTTCOM_CIRID = 21;
	static NTTCOM_ARID = 36;
	static NTTCOM_TUWA_TYPE = "CW";
	static FILE_EXT = "thituw";

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
	O_base: any;
	H_argv: any;
	endlist: any;
	A_telnoX: any;
	dummypost: undefined;
	carid: any;
	alltotalbil: number = 0;
	commhist: string = "";
	billdir: any;
	dummytelno: undefined;
	datadir: string = "";
	carkind: string = "";
	A_pactid: any;
	H_eracepact: any;

	constructor(O_base: any) {
		super(O_base);
		this.billname = "通話明細";
		this.readtelcnt = 0;
		this.readmeisaicnt = 0;
		this.addtelcnt = 0;
		this.linelength = 128;
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

	checkBillFileData(line: string, manage: boolean) {
		if (true == manage) {
// 2022cvt_015
			var kind = line.substring(0, 1);

			if (importNTTComTuwaModel.KIND_MANAGE != kind) {
				this.outWarning("ファイル内容が仕様と異なります（1行目が管理レコード以外)(" + this.billname + ")");
				return false;
			}
		}

// 2022cvt_015
		var year = line.substring(15, 2);
// 2022cvt_015
		var month = line.substring(17, 2);
		year = this.O_base.convAnnoDomini(year);

		if (this.H_argv.billdate != year + month) {
			this.outWarning("請求ファイルの日付が指定した値と異なります(" + year + month + "!=" + this.H_argv.billdate + ")(" + this.billname + ")");
			return false;
		}

		return true;
	}

	checkEOFRecord(line: string) {
// 2022cvt_015
		var total = +line.substring(69, 9);

		if (this.totalbill != total) {
			this.outWarning("請求ファイルの合計額と取込み結果が異なります(" + total + "!=" + this.totalbill + ")" + this.billname + ")");
			return false;
		}

		return true;
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
				if (1 == this.H_overtel[telno]) {
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

	classifyBillData(data: string, kind = "") //通話料金の下一桁は小数点
	{
		var H_bill: {
			mmdd: string,
			st_time: string
			totel: string
			country: string
			usetime: string
			bill: number
		} = {
			mmdd: "",
			st_time: "",
			totel: "",
			country: "",
			usetime: "",
			bill: 0
		};
		H_bill.mmdd = data.substring(45, 4);
		H_bill.st_time = data.substring(49, 6);
		H_bill.totel = data.substring(55, 15).trim();
		H_bill.country = data.substring(70, 2);
		H_bill.usetime = data.substring(72, 8);
		H_bill.bill = +data.substring(80, 9);
// 2022cvt_015
		var min = +data.substring(89, 1);

		if (0 != min) {
			H_bill.bill = H_bill.bill + min * 0.1;
		}

		return H_bill;
	}

	convStartTime(year: number, date: string, time: string) {
		if ("12" == date.substring(0, 2)) {
			year = year - 1;
		}

// 2022cvt_015
		var result = year + "-";
		result += date.substring(0, 2) + "-" + date.substring(2, 2) + " ";
		result += time.substring(0, 2) + ":" + time.substring(2, 2) + ":" + time.substring(4, 2);
		return result;
	}

	convUseTime(date: string) {
// 2022cvt_015
		var hour = date.substring(0, 3).replace("0", "");
		// var hour = ltrim(date.substring(0, 3), "0");

		if (2 > hour.length) {
			hour = hour.padStart(2, "0");
			// hour = str_pad(hour, 2, "0", STR_PAD_LEFT);
		} else if (2 < hour.length) {
			hour = "99";
		}

// 2022cvt_015
		var min = date.substring(3, 2);

		if (2 > min.length) {
			min += hour.padStart(2, "0");
			// min += str_pad(min, 2, "0", STR_PAD_LEFT);
		}

// 2022cvt_015
		var sec = date.substring(5, 3);
		return hour + min + sec;
	}

	convCountryName(code: string, carid: string) {
// 2022cvt_015
		var sql = "SELECT name FROM country_tb WHERE carid=" + carid + " AND code='" + code + "'";
		return this.getDB().getOne(sql, true);
	}

	doEachFile(filename: string, pactid: any) {
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

		if(flock.checkSync(filename)) {
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
			var datakind = line.substring(0, 1);

			if (importNTTComTuwaModel.KIND_BILL == datakind) {
				// this.execBillDetailの第一引数であるH_codeがPHPでコメントアウトされているため、比較対象なしでコメントアウト（荒木）
				// if (false == this.execBillDetail(H_code, line, pactid, filename)) {
				// 	flock.unlockSync(filename);
				// 	// flock(fp, LOCK_UN);
				// 	// fclose(fp);
				// 	return false;
				// }
			} else if (importNTTComTuwaModel.KIND_TELMAN == datakind) //特にチェックしない
				{} else if (importNTTComTuwaModel.KIND_NOEND == datakind) {
				// PHPファイル側でcheckEOFRecordは引数を1つしか受け取っていないため、他の引数は削除
				if (false == this.checkEOFRecord(line)) {
				// if (false == this.checkEOFRecord(line, pactid, filename)) {
					flock.unlockSync(filename);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return false;
				}

				this.alltotalbil = this.alltotalbill + this.totalbill;
				this.totalbill = 0;
			} else if (importNTTComTuwaModel.KIND_EOF) //得にチェックしない
				{} else {
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

	async doImport() {
		if (0 < fs.statSync(this.commhist).size) {
		// if (0 < filesize(this.commhist)) {
// 2022cvt_016
// 2022cvt_015
			var A_telcol = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "byte", "callseg", "callsegname", "chageseg", "discountseg", "occupseg", "kubun1", "kubun2", "kubun3", "carid", "byte_mail", "byte_site", "byte_other", "kousiflg", "multinumber"];

			if (false == await this.doCopyInsert(this.O_base.getTable("commhistory"), this.commhist, A_telcol)) {
				this.outWarning(this.commhist + "のインポートに失敗");
				this.getDB().rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
				this.outInfo(this.commhist + "インポート完了");
			}
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
		// var fp = fopen(filename, "rt");

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

	execBillDetail(H_code: any, line: string, pactid: any, filename: string) //内訳情報を取得する
	//if(false == isset($H_code[$H_bill["code"]])){
	//			$this->outWarning("不明な内訳コードです(" .$this->billname. ").telno=" .$telno. " code=" .$H_bill["code"]);
	//			return false;
	//		}
// 2022cvt_016
	//		$taxkind = $this->getTaxType($H_bill["taxtype"]);
	//		if("error" == $taxkind){
	//			return false;
	//		}
	{
// 2022cvt_015
		var allbill = line.substring(32, importNTTComTuwaModel.BILL_LENGTH);
// 2022cvt_015
		var telno = line.substring(32, 13).replace(/[^0-9]/g, "");
		telno = telno.trim();

		if ("" != telno) {
			this.checkRegistTel(telno, pactid);
		}

// 2022cvt_015
		var H_bill = this.classifyBillData(line, importNTTComTuwaModel.NET_KIND + "-");
		this.totalbill = this.totalbill + H_bill.bill;
// 2022cvt_015
		var start = this.convStartTime(this.H_argv.billdate.substring(0, 4), H_bill.mmdd, H_bill.st_time);
// 2022cvt_015
		var country = this.convCountryName(H_bill.country, this.carid);
// 2022cvt_015
		var usetime = this.convUseTime(H_bill.usetime);
		this.A_filedata.push([pactid, telno, start, H_bill.totel, country, usetime, H_bill.bill]);
		this.readmeisaicnt++;
		return true;
	}

	execErase(flg: string, pactid: string) {
		if ("o" != flg && "O" != flg) {
			return true;
		}

		this.outInfo("デリート処理開始(" + this.billname + ")");
		this.setEraceFlag(this.carid, pactid);
		this.getDB().begin();
// 2022cvt_015
		var sql = "DELETE FROM " + this.O_base.getTable("commhistory") + " WHERE pactid=" + pactid + " AND carid=" + this.carid;
// 2022cvt_015
		var result = this.getDB().query(sql, false);

// 2022cvt_016
		if (true == ("object" === typeof result)) {
			this.outError(this.O_base.getTable("commhistory") + "のデリートに失敗しました" + result.userinfo);
			this.getDB().rollback();
			return false;
		}

		this.getDB().commit();
		this.outInfo("デリート処理終了(" + this.billname + ")");
		return true;
	}

	getBillTelno(line: string, start: any, end: any) {
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

	preDeleteProc(A_billFile: any[], dataDirPact: string, pactid: string) {
		A_billFile.sort();
		this.outInfo("前処理開始");

// 2022cvt_015
		for (var filename of A_billFile) {
			// PHP側のファイルでpreEachFileの引数はふたつしか受け取らない為
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
				return "3";
				break;

			case "11":
				return "1";
				break;

			case "13":
				return "4";
				break;

			case "15":
				return "2";
				break;

			case "80":
			case "90":
				return "0";
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
		// if (false == flock(fp, LOCK_SH)) {
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
			var datakind = line.substring(0, 1);

			if (importNTTComTuwaModel.KIND_BILL != datakind) {
				continue;
			}

// 2022cvt_015
			var telno = line.substring(32, 13).replace(/[^0-9]/g, "");
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

	async readBillFile(A_billFile: Array<any>, dataDirPact: string, pactid: { [key: string]: string }) {
// 2022cvt_015
		var errflag = false;

// 2022cvt_015
		for (var filename of A_billFile) {
			this.outInfo(dataDirPact + "/" + filename + importNTTComTuwaModel.LOG_DELIM + "データ読込処理開始");

			if (false == this.doEachFile(dataDirPact + "/" + filename, pactid)) {
				this.getDB().rollback();
				errflag = true;
				break;
			}

			this.outInfo(dataDirPact + "/" + filename + importNTTComTuwaModel.LOG_DELIM + "データ読込処理完了：電話件数=" + this.readtelcnt + ": 明細件数=" + this.readmeisaicnt + ":追加電話件数(" + this.O_base.getTable("commhistory") + ")=" + this.addtelcnt);
		}

		if (false == errflag) {
			this.outInfo("データ書出処理開始");

			if (false == this.writeTelData(pactid.value)) {
				this.outWarning(this.commhist + "ファイルの書出に失敗");
				this.A_pactfail.push(pactid.value);
				this.getDB().rollback();
				return false;
			}

			this.outInfo("インポート処理開始(" + this.billname + ")");

			if (false == await this.doImport()) {
				this.getDB().rollback();
				return false;
			}

			this.outInfo("インポート処理終了(" + this.billname + ")");
			this.getDB().commit();
			this.moveFinishDir(this.billdir, pactid.value);
			this.A_pactDone.push(pactid.value);
		} else {
			this.O_base.getDB().commit();
			this.A_pactfail.push(pactid.value);
		}
	}

	setBillDir(carid = "") {
		if ("" == carid) {
			carid = this.carid;
		}

		switch (carid) {
			case (importNTTComModelBase.NTTCOM_CARID).toString():
				this.billdir = importNTTComTuwaModel.BILLDIR;
				break;

			case (importNTTComModelBase.NTTCOM_FIX_CARID).toString():
				this.billdir = importNTTComTuwaModel.FIX_BILLDIR;
				break;
		}
	}

	setBillDirStr(path: any) {
		this.billdir = path;
	}

	setOutTel(A_array: () => any[]) {
		if (Array() == this.A_outtel) {
			this.A_outtel = A_array();
		} else if (true == Array.isArray(this.A_outtel)) {
			this.A_outtel = this.A_outtel.concat(A_array);
			// this.A_outtel = array_merge(this.A_outtel, A_array);
		}
	}

	writeTelData(pactid: string) //commhistory_x_tbに追加する電話を出力
	{
		if (false != (undefined !== this.dummytelno) || "" != this.dummytelno) {
			if (false == (-1 !== this.A_telnoCom.indexOf(this.dummytelno))) {
				this.A_teldata.push([this.dummypost, this.dummytelno, this.carid]);
			}
		}

// 2022cvt_015
		var nowtime = this.O_base.getTimestamp();
		this.commhist = this.datadir + "/" + this.O_base.getTable("commhistory") + pactid + importNTTComTuwaModel.FILE_EXT + this.carkind + ".tmp";
// 2022cvt_015
		var fp_telx;
		try {
			fp_telx = fs.openSync(this.commhist, "w");
		} catch (e) {
			this.outError(this.commhist + "の書込オープン失敗");
			return false;
		}
		// var fp_telx = fopen(this.commhist, "w");

// 2022cvt_015
		var A_nullbox = Array();

// 2022cvt_015
		for (var i = 0; i <= 31; i++) {
			A_nullbox[i] = "\\N";
		}

// 2022cvt_015
		for (var val of this.A_filedata) {
// 2022cvt_015
			var postid = val[0];
// 2022cvt_015
			var telno = val[1];

// 2022cvt_019
			if (true == telno.match("/^0[789]0/") && 11 <= telno.length) {
			// if (true == preg_match("/^0[789]0/", telno) && 11 <= telno.length) {
// 2022cvt_015
				var telno_view = this.O_base.makeTelnoView(telno);
			} else {
				telno_view = telno;
			}

			fs.writeFileSync(fp_telx, val[0] + "\t" + telno + "\t" + importNTTComTuwaModel.NTTCOM_TUWA_TYPE + "\t" + val[2] + "\t" + val[3] + "\t" + val[4] + "\t" + "\\N" + "\t" + val[5] + "\t" + val[6] + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + this.carid + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\n");// 2022cvt_006
		}

		fs.closeSync(fp_telx);
		// fclose(fp_telx);
		return true;
	}

	async execMainProc(H_pact: { [x: string]: any; }, H_erace: any) //指定されたpact分ループ
	{
// 2022cvt_015
		var pactcnt = this.A_pactid.length;
		this.H_eracepact = H_erace;
		this.A_pactid.sort();

// 2022cvt_015
		for (var i = 0; i < pactcnt; i++) //マスターになければ次へ進む
		//$dataDirPact = $this->datadir. "/". $pactid. "/" .$this->billdir;
		//請求データファイル名取得
		//請求ファイルがなければ次の会社へ
		{
			if (false == (undefined !== H_pact[this.A_pactid[i]])) {
				this.outWarning("pactid=" + this.A_pactid[i] + "はpact_tbに登録されていません(" + this.billname + ")");
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
// 2022cvt_015
			var billno = "";

			for (var fileName of dirh) {
			// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
				if (true == fs.statSync(dataDirPact + "/" + fileName).isFile()) {
				// if (true == is_file(dataDirPact + "/" + fileName)) {
					A_billFile.push(fileName);
				}

// 				clearstatcache();// 2022cvt_012
			}

			if (Array() == A_billFile) {
				this.outWarning("pactid=" + pactid.value + "の請求データファイルが見つかりません(" + this.billname + ")");
				// closedir(dirh);
				continue;
			} else {
				fileName = this.getFileName(A_billFile, A_billFile.length);
			}

			billno = this.getBillNo(this.carid, pactid.value);

			if (undefined == billno) {
				this.outWarning(fileName + "についての請求番号がbill_prtel_tbに見つかりません(" + this.billname + ")");
				continue;
			}

// 2022cvt_015
			var A_code = this.getBillCode(this.carid, pactid.value);

			if (Array() == A_code) {
				this.outWarning("pactid=" + pactid.value + "についての請求番号が見つかりません(" + this.billname + ")");
				continue;
			}

			this.getTelInfo(this.carid, pactid.value);
			this.getDummyTel(this.carid, pactid.value, "WLD");
			this.execBackup(this.H_argv.backup);
			this.preDeleteProc(A_billFile, dataDirPact, pactid.value);

			if (false == (undefined !== this.H_eracepact[this.carid][pactid.value])) {
				this.execErase(this.H_argv.erase, pactid.value);
			}

			this.getTelXInfo(pactid.value, this.carid);

			if (false == await this.readBillFile(A_billFile, dataDirPact, pactid)) {
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
