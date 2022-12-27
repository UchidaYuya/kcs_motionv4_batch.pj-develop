//======================================================================================
//NTTcom取込み
//
//procとかmodelとかややこしい名前がついてますが、作り方をclassにしただけで
//機能はV2時代の物を使っています(import_nttcom_wld*をベースに作ったため)
//
//author igarashi
//======================================================================================

require("import_nttcom_modelbase.php");

//管理レコード
//
//請求レコード
//番号別管理レコード
//EOFレコード
//1レコードに含まれる内訳情報数
//1明細の長さ
//
//__construct
//
//@author igarashi
//@since 2009/04/10
//
//@param mixed $A_array
//@access public
//@return void
//
//
//checkBillFileData
//
//@author igarashi
//@since 2009/04/27
//
//@param mixed $line
//@param mixed $manage
//@access protected
//@return void
//
//
//checkEOFRecord
//
//@author igarashi
//@since 2009/04/27
//
//@access protected
//@return void
//
//
//checkRegistTel
//
//@author igarashi
//@since 2009/04/16
//
//@param mixed $telno
//@param mixed $pactid
//@access public
//@return void
//
//
//classifyBillData
//
//@author igarashi
//@since 2009/04/27
//
//@param mixed $data
//@param mixed $kind
//@access protected
//@return void
//
//
//convStartTime
//
//@author igarashi
//@since 2009/04/30
//
//@param mixed $year
//@param mixed $date
//@param mixed $time
//@access protected
//@return void
//
//
//convUseTime
//
//@author igarashi
//@since 2009/04/30
//
//@param mixed $date
//@access protected
//@return void
//
//
//convcountryName
//
//@author igarashi
//@since 2009/04/30
//
//@param mixed $code
//@access protected
//@return void
//
//
//doEachFile
//
//@author igarashi
//@since 2009/04/15
//
//@param mixed $filename
//@param mixed $pactid
//@access private
//@return void
//
//
//doImport
//
//@author igarashi
//@since 2009/04/20
//
//@access protected
//@return void
//
//
//doCopyInsert
//
//@author igarashi
//@since 2009/04/20
//
//@param mixed $table
//@param mixed $filename
//@param mixed $A_col
//@access protected
//@return void
//
//
//execBillDetail
//
//@author igarashi
//@since 2009/04/15
//
//@param mixed $line
//@param mixed $pactid
//@param mixed $filename
//@access private
//@return void
//
//
//execErase
//
//@author igarashi
//@since 2009/04/14
//
//@param mixed $flg
//@access public
//@return void
//
//
//getBillTelno
//
//@author igarashi
//@since 2009/04/16
//
//@param mixed $line
//@param mixed $start
//@param mixed $end
//@access protected
//@return void
//
//
//getTelXInfo
//
//@author igarashi
//@since 2009/04/15
//
//@param mixed $pactid
//@param mixed $carid
//@access protected
//@return void
//
//
//preDeleteProc
//
//@author igarashi
//@since 2009/04/14
//
//@param mixed $A_billFile
//@param mixed $dataDirPact
//@param mixed $pactid
//@access public
//@return void
//
//
//getTaxType
//
//@author igarashi
//@since 2009/04/16
//
//@param mixed $code
//@access public
//@return void
//
//
//getOutTel
//
//@author igarashi
//@since 2009/04/21
//
//@access public
//@return void
//
//
//preEachFile
//
//@author igarashi
//@since 2009/04/15
//
//@param mixed $filename
//@param mixed $pactid
//@access public
//@return void
//
//
//readBillFile
//
//@author igarashi
//@since 2009/04/15
//
//@param mixed $A_billFile
//@param mixed $dataDirPact
//@param mixed $pactid
//@access public
//@return void
//
//
//setBillDir
//
//@author igarashi
//@since 2009/07/23
//
//@param string $carid
//@access public
//@return void
//
//
//setBillDirStr
//
//@author web
//@since 2013/05/01
//
//@param mixed $path
//@access public
//@return void
//
//
//setOutTel
//
//@author igarashi
//@since 2009/04/21
//
//@param mixed $A_array
//@access public
//@return void
//
//
//writeTelData
//
//@author igarashi
//@since 2009/04/17
//
//@param mixed $pactid
//@access protected
//@return void
//
//
//execMainProc
//
//@author igarashi
//@since 2009/04/13
//
//@param mixed $H_pact
//@access public
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2009/04/10
//
//@access public
//@return void
//
class importNTTComTuwaModel extends importNTTComModelBase {
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

	constructor(O_base) {
		super(O_base);
		this.billname = "\u901A\u8A71\u660E\u7D30";
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

	Initialize() {
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

	checkBillFileData(line, manage) {
		if (true == manage) {
			var kind = line.substr(0, 1);

			if (importNTTComTuwaModel.KIND_MANAGE != kind) {
				this.outWarning("\u30D5\u30A1\u30A4\u30EB\u5185\u5BB9\u304C\u4ED5\u69D8\u3068\u7570\u306A\u308A\u307E\u3059\uFF081\u884C\u76EE\u304C\u7BA1\u7406\u30EC\u30B3\u30FC\u30C9\u4EE5\u5916)(" + this.billname + ")");
				return false;
			}
		}

		var year = line.substr(15, 2);
		var month = line.substr(17, 2);
		year = this.O_base.convAnnoDomini(year);

		if (this.H_argv.billdate != year + month) {
			this.outWarning("\u8ACB\u6C42\u30D5\u30A1\u30A4\u30EB\u306E\u65E5\u4ED8\u304C\u6307\u5B9A\u3057\u305F\u5024\u3068\u7570\u306A\u308A\u307E\u3059(" + year + month + "!=" + this.H_argv.billdate + ")(" + this.billname + ")");
			return false;
		}

		return true;
	}

	checkEOFRecord(line) {
		var total = +line.substr(69, 9);

		if (this.totalbill != total) {
			this.outWarning("\u8ACB\u6C42\u30D5\u30A1\u30A4\u30EB\u306E\u5408\u8A08\u984D\u3068\u53D6\u8FBC\u307F\u7D50\u679C\u304C\u7570\u306A\u308A\u307E\u3059(" + total + "!=" + this.totalbill + ")" + this.billname + ")");
			return false;
		}

		return true;
	}

	checkRegistTel(telno, pactid) {
		if (false == (undefined !== this.endlist[telno])) {
			this.endlist[telno] = telno;

			if (true == (-1 !== this.A_telnoCom.indexOf(telno))) {
				return true;
			}

			var A_telCount = Array();
			A_telCount = array_count_values(this.A_telnoX);

			if (false == (undefined !== A_telCount[telno])) {
				if (false == (undefined !== this.dummypost) || "" == this.dummypost) {
					this.outWarning("\u672A\u767B\u9332\u756A\u53F7\uFF1Adummy_tel_tb\u306B\u8ACB\u6C42\u5148\u90E8\u7F72\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + telno + ")(" + this.billname + ")");
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
						this.outWarning("\u672A\u767B\u9332\u756A\u53F7\uFF1Adummy_tel_tb\u306B\u8ACB\u6C42\u5148\u90E8\u7F72\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + telno + ")(" + this.billname + ")");
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

	classifyBillData(data, kind = "") //通話料金の下一桁は小数点
	{
		H_bill.mmdd = data.substr(45, 4);
		H_bill.st_time = data.substr(49, 6);
		H_bill.totel = data.substr(55, 15).trim();
		H_bill.country = data.substr(70, 2);
		H_bill.usetime = data.substr(72, 8);
		H_bill.bill = +data.substr(80, 9);
		var min = +data.substr(89, 1);

		if (0 != min) {
			H_bill.bill = H_bill.bill + min * 0.1;
		}

		return H_bill;
	}

	convStartTime(year, date, time) {
		if ("12" == date.substr(0, 2)) {
			year = year - 1;
		}

		var result = year + "-";
		result += date.substr(0, 2) + "-" + date.substr(2, 2) + " ";
		result += time.substr(0, 2) + ":" + time.substr(2, 2) + ":" + time.substr(4, 2);
		return result;
	}

	convUseTime(date) {
		var hour = ltrim(date.substr(0, 3), "0");

		if (2 > hour.length) {
			hour = str_pad(hour, 2, "0", STR_PAD_LEFT);
		} else if (2 < hour.length) {
			hour = "99";
		}

		var min = date.substr(3, 2);

		if (2 > min.length) {
			min += str_pad(min, 2, "0", STR_PAD_LEFT);
		}

		var sec = date.substr(5, 3);
		return hour + min + sec;
	}

	convCountryName(code, carid) {
		var sql = "SELECT name FROM country_tb WHERE carid=" + carid + " AND code='" + code + "'";
		return this.getDB().getOne(sql, true);
	}

	doEachFile(filename, pactid) {
		var fp = fopen(filename, "rb");

		if (undefined == fp) {
			this.outWarning(filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557");
			return false;
		}

		if (false == flock(fp, LOCK_SH)) {
			this.outWarning(filename + "\u306E\u30ED\u30C3\u30AF\u306B\u5931\u6557");
			fclose(fp);
			return false;
		}

		var line = fgets(fp);
		line = rtrim(line, "\r\n");

		if (false == this.checkLineLength(filename, line, this.linelength)) {
			flock(fp, LOCK_UN);
			fclose(fp);
			return false;
		}

		if (false == this.checkBillFileData(line, true)) {
			flock(fp, LOCK_UN);
			fclose(fp);
			return false;
		}

		while (line = fgets(fp)) {
			if (feof(fp)) {
				break;
			}

			line = rtrim(line, "\r\n");

			if (false == this.checkLineLength(filename, line, this.linelength)) {
				flock(fp, LOCK_UN);
				fclose(fp);
				return false;
			}

			var datakind = line.substr(0, 1);

			if (importNTTComTuwaModel.KIND_BILL == datakind) {
				if (false == this.execBillDetail(H_code, line, pactid, filename)) {
					flock(fp, LOCK_UN);
					fclose(fp);
					return false;
				}
			} else if (importNTTComTuwaModel.KIND_TELMAN == datakind) //特にチェックしない
				{} else if (importNTTComTuwaModel.KIND_NOEND == datakind) {
				if (false == this.checkEOFRecord(line, pactid, filename)) {
					flock(fp, LOCK_UN);
					fclose(fp);
					return false;
				}

				this.alltotalbil = this.alltotalbill + this.totalbill;
				this.totalbill = 0;
			} else if (importNTTComTuwaModel.KIND_EOF) //得にチェックしない
				{} else {
				this.outWarning("\u672A\u77E5\u306E\u30C7\u30FC\u30BF\u7A2E\u985E(" + datakind + ")(" + this.billname + ")");
				flock(fp, LOCK_UN);
				fclose(fp);
				return false;
			}
		}

		flock(fp, LOCK_UN);
		fclose(fp);
		return true;
	}

	doImport() {
		if (0 < filesize(this.commhist)) {
			var A_telcol = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "byte", "callseg", "callsegname", "chageseg", "discountseg", "occupseg", "kubun1", "kubun2", "kubun3", "carid", "byte_mail", "byte_site", "byte_other", "kousiflg", "multinumber"];

			if (false == this.doCopyInsert(this.O_base.getTable("commhistory"), this.commhist, A_telcol)) {
				this.outWarning(this.commhist + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557");
				this.getDB().rollback();
				throw die(1);
			} else {
				this.outInfo(this.commhist + "\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
			}
		}

		return true;
	}

	doCopyInsert(table, filename, A_col) {
		var fp = fopen(filename, "rt");

		if (undefined == fp) {
			this.outWarning(filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557");
			return false;
		}

		var O_ins = new TableInserter(this.getLog(), this.getDB(), filename + ".sql", true);
		O_ins.begin(table);

		while (line = fgets(fp)) {
			var A_line = split("\t", rtrim(line, "\n"));

			if (A_line.length != A_col.length) {
				this.outWarning(filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059(" + A_line.length + "=" + A_col.length + ")(" + this.billname + ")");
				fclose(fp);
				return false;
			}

			var H_ins = Array();
			var idx = 0;

			for (var val of Object.values(A_col)) {
				if ("\\N" != A_line[idx]) {
					H_ins[val] = A_line[idx];
				}

				idx++;
			}

			if (false == O_ins.insert(H_ins)) {
				this.outWarning(filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F (" + line + ")(" + this.billname + ")");
				fclose(fp);
				return false;
			}
		}

		if (false == O_ins.end()) {
			this.outWarning(filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557");
			fclose(fp);
			return false;
		}

		fclose(fp);
		return true;
	}

	execBillDetail(H_code, line, pactid, filename) //内訳情報を取得する
	//if(false == isset($H_code[$H_bill["code"]])){
	//			$this->outWarning("不明な内訳コードです(" .$this->billname. ").telno=" .$telno. " code=" .$H_bill["code"]);
	//			return false;
	//		}
	//		$taxkind = $this->getTaxType($H_bill["taxtype"]);
	//		if("error" == $taxkind){
	//			return false;
	//		}
	{
		var allbill = line.substr(32, importNTTComTuwaModel.BILL_LENGTH);
		var telno = line.substr(32, 13).replace(/[^0-9]/g, "");
		telno = telno.trim();

		if ("" != telno) {
			this.checkRegistTel(telno, pactid);
		}

		var H_bill = this.classifyBillData(line, importNTTComTuwaModel.NET_KIND + "-");
		this.totalbill = this.totalbill + H_bill.bill;
		var start = this.convStartTime(this.H_argv.billdate.substr(0, 4), H_bill.mmdd, H_bill.st_time);
		var country = this.convCountryName(H_bill.country, this.carid);
		var usetime = this.convUsetime(H_bill.usetime);
		this.A_filedata.push([pactid, telno, start, H_bill.totel, country, usetime, H_bill.bill]);
		this.readmeisaicnt++;
		return true;
	}

	execErase(flg, pactid) {
		if ("o" != flg && "O" != flg) {
			return true;
		}

		this.outInfo("\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u958B\u59CB(" + this.billname + ")");
		this.setEraceFlag(this.carid, pactid);
		this.getDB().begin();
		var sql = "DELETE FROM " + this.O_base.getTable("commhistory") + " WHERE pactid=" + pactid + " AND carid=" + this.carid;
		var result = this.getDB().query(sql, false);

		if (true == ("object" === typeof result)) {
			this.outError(this.O_base.getTable("commhistory") + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + result.userinfo);
			this.getDB().rollback();
			return false;
		}

		this.getDB().commit();
		this.outInfo("\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u7D42\u4E86(" + this.billname + ")");
		return true;
	}

	getBillTelno(line, start, end) {
		var telno = "0";
		telno += line.substr(start, end);
		return telno;
	}

	getTelXInfo(pactid, carid) {
		var sql = "SELECT telno FROM " + this.O_base.getTable("telX") + " WHERE pactid=" + pactid + " AND carid=" + carid;
		var A_tmptel = this.getDB().getHash(sql, true);

		for (var data of Object.values(A_tmptel)) {
			this.A_telnoCom.push(data.telno);
		}
	}

	preDeleteProc(A_billFile, dataDirPact, pactid) {
		A_billFile.sort();
		this.outInfo("\u524D\u51E6\u7406\u958B\u59CB");

		for (var filename of Object.values(A_billFile)) {
			if (false != this.preEachFile(dataDirPact + "/" + filename, pactid, this.H_argv.billdate, this.getDB())) {
				continue;
			} else {
				this.outError("\u524D\u51E6\u7406\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + filename + ")");
			}
		}

		this.outInfo("\u524D\u51E6\u7406\u7D42\u4E86");
	}

	getTaxType(code) {
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
				this.outWarning("\u4E0D\u660E\u306A\u7A0E\u30B3\u30FC\u30C9\u3067\u3059(" + code + ")(" + this.billname + ")");
				break;
		}

		return "error";
	}

	getOutTel() {
		return this.A_outtel;
	}

	preEachFile(filename, pactid) //1行ずつ取得
	{
		var fp = fopen(filename, "rb");

		if (fp == undefined) {
			this.outWarning(filename + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557(preEachFile)");
			return false;
		}

		if (false == flock(fp, LOCK_SH)) {
			this.outWarning(filename + "\u306E\u30ED\u30C3\u30AF\u306B\u5931\u6557");
			fclose(fp);
			return false;
		}

		var line = fgets(fp);

		while (line = fgets(fp)) //telX_tbに登録されている電話だけ処理
		{
			if (feof(fp)) {
				break;
			}

			line = rtrim(line, "\r\n");

			if (false == this.checkLineLength(filename, line, this.linelength)) {
				flock(fp, LOCK_UN);
				fclose(fp);
				return false;
			}

			var datakind = line.substr(0, 1);

			if (importNTTComTuwaModel.KIND_BILL != datakind) {
				continue;
			}

			var telno = line.substr(32, 13).replace(/[^0-9]/g, "");
			var A_telCount = Array();
			A_telCount = array_count_values(this.A_telnoX);

			if (true == (undefined !== A_telCount[telno])) {
				if (1 < A_telCount[telno]) //複数登録されている電話で、postidが違うものを取り出す
					//複数登録の電話番号全て同じ部署に所属していたらその部署に請求
					{
						var sql = "SELECT postid FROM " + this.O_base.getTable("telx") + " WHERE pactid=" + pactid + " AND telno='" + telno + "' AND carid !=" + this.carid;
						var A_postid = this.getDB().getCol(sql, true);
						var A_cnt = array_count_values(A_postid);

						if (A_cnt[A_postid[0]] == A_postid.length) {
							this.H_overtel[telno] = {
								no: 1,
								post: A_postid[0]
							};
						} else {
							var inspostid = this.getMinimamCarrierPost(telno);

							if (false == is_null(inspostid)) {
								this.H_overtel[telno] = {
									no: A_postid.length,
									post: inspostid
								};
							} else {
								if (false == (undefined !== this.dummypost) || "" == this.dummypost) {
									this.outWarning("\u672A\u767B\u9332\u756A\u53F7\uFF1Adummy_tel_tb\u306B\u8ACB\u6C42\u90E8\u7F72\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + telno + ")(" + this.billname + ")");
									flock(fp, LOCK_UN);
									fclose(fp);
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
					var regpost = this.getDB().getOne(sql, true);
					this.H_regpost[telno] = regpost;
				}
			}
		}

		flock(fp, LOCK_UN);
		fclose(fp);
		return true;
	}

	readBillFile(A_billFile, dataDirPact, pactid) {
		var errflag = false;

		for (var filename of Object.values(A_billFile)) {
			this.outInfo(dataDirPact + "/" + filename + importNTTComTuwaModel.LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u958B\u59CB");

			if (false == this.doEachFile(dataDirPact + "/" + filename, pactid)) {
				this.getDB().rollback();
				errflag = true;
				break;
			}

			this.outInfo(dataDirPact + "/" + filename + importNTTComTuwaModel.LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u5B8C\u4E86\uFF1A\u96FB\u8A71\u4EF6\u6570=" + this.readtelcnt + ": \u660E\u7D30\u4EF6\u6570=" + this.readmeisaicnt + ":\u8FFD\u52A0\u96FB\u8A71\u4EF6\u6570(" + this.O_base.getTable("commhistory") + ")=" + this.addtelcnt);
		}

		if (false == errflag) {
			this.outInfo("\u30C7\u30FC\u30BF\u66F8\u51FA\u51E6\u7406\u958B\u59CB");

			if (false == this.writeTelData(pactid)) {
				this.outWarning(this.commhist + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u51FA\u306B\u5931\u6557");
				this.A_pactfail.push(pactid);
				this.getDB().rollback();
				return false;
			}

			this.outInfo("\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB(" + this.billname + ")");

			if (false == this.doImport()) {
				this.getDB().rollback();
				return false;
			}

			this.outInfo("\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86(" + this.billname + ")");
			this.getDB().commit();
			this.moveFinishDir(this.billdir, pactid);
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
			case importNTTComTuwaModel.NTTCOM_CARID:
				this.billdir = importNTTComTuwaModel.BILLDIR;
				break;

			case importNTTComTuwaModel.NTTCOM_FIX_CARID:
				this.billdir = importNTTComTuwaModel.FIX_BILLDIR;
				break;
		}
	}

	setBillDirStr(path) {
		this.billdir = path;
	}

	setOutTel(A_array) {
		if (Array() == this.A_outtel) {
			this.A_outtel = A_array();
		} else if (true == Array.isArray(this.A_outtel)) {
			this.A_outtel = array_merge(this.A_outtel, A_array);
		}
	}

	writeTelData(pactid) //commhistory_x_tbに追加する電話を出力
	{
		if (false != (undefined !== this.dummytelno) || "" != this.dummytelno) {
			if (false == (-1 !== this.A_telnoCom.indexOf(this.dummytelno))) {
				this.A_teldata.push([this.dummypost, this.dummytelno, this.carid]);
			}
		}

		var nowtime = this.O_base.getTimestamp();
		this.commhist = this.datadir + "/" + this.O_base.getTable("commhistory") + pactid + importNTTComTuwaModel.FILE_EXT + this.carkind + ".tmp";
		var fp_telx = fopen(this.commhist, "w");

		if (undefined == fp_telx) {
			this.outError(this.commhist + "\u306E\u66F8\u8FBC\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
			return false;
		}

		var A_nullbox = Array();

		for (var i = 0; i <= 31; i++) {
			A_nullbox[i] = "\\N";
		}

		for (var val of Object.values(this.A_filedata)) {
			var postid = val[0];
			var telno = val[1];

			if (true == preg_match("/^0[789]0/", telno) && 11 <= telno.length) {
				var telno_view = this.O_base.makeTelnoView(telno);
			} else {
				telno_view = telno;
			}

			fwrite(fp_telx, val[0] + "\t" + telno + "\t" + importNTTComTuwaModel.NTTCOM_TUWA_TYPE + "\t" + val[2] + "\t" + val[3] + "\t" + val[4] + "\t" + "\\N" + "\t" + val[5] + "\t" + val[6] + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + this.carid + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\n");
		}

		fclose(fp_telx);
		return true;
	}

	execMainProc(H_pact, H_erace) //指定されたpact分ループ
	{
		var pactcnt = this.A_pactid.length;
		this.H_eracepact = H_erace;
		this.A_pactid.sort();

		for (var i = 0; i < pactcnt; i++) //マスターになければ次へ進む
		//$dataDirPact = $this->datadir. "/". $pactid. "/" .$this->billdir;
		//請求データファイル名取得
		//請求ファイルがなければ次の会社へ
		{
			if (false == (undefined !== H_pact[this.A_pactid[i]])) {
				this.outWarning("pactid=" + this.A_pactid[i] + "\u306Fpact_tb\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + this.billname + ")");
				continue;
			}

			var pactid = this.A_pactid[i];
			var pactname = H_pact[pactid];
			var A_billFile = Array();
			var dataDirPact = this.datadir + "/" + this.billdir + "/" + pactid;

			if (false == is_dir(dataDirPact)) {
				continue;
			}

			var dirh = opendir(dataDirPact);
			var billno = "";

			while (fileName = readdir(dirh)) {
				if (true == is_file(dataDirPact + "/" + fileName)) {
					A_billFile.push(fileName);
				}

				clearstatcache();
			}

			if (Array() == A_billFile) {
				this.outWarning("pactid=" + pactid + "\u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093(" + this.billname + ")");
				closedir(dirh);
				continue;
			} else {
				fileName = this.getFileName(A_billFile, A_billFile.length);
			}

			billno = this.getBillNo(this.carid, pactid);

			if (undefined == billno) {
				this.outWarning(fileName + "\u306B\u3064\u3044\u3066\u306E\u8ACB\u6C42\u756A\u53F7\u304Cbill_prtel_tb\u306B\u898B\u3064\u304B\u308A\u307E\u305B\u3093(" + this.billname + ")");
				continue;
			}

			var A_code = this.getBillCode(this.carid, pactid);

			if (Array() == A_code) {
				this.outWarning("pactid=" + pactid + "\u306B\u3064\u3044\u3066\u306E\u8ACB\u6C42\u756A\u53F7\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093(" + this.billname + ")");
				continue;
			}

			this.getTelInfo(this.carid, pactid);
			this.getDummyTel(this.carid, pactid, "WLD");
			this.execBackup(this.H_argv.backup);
			this.preDeleteProc(A_billFile, dataDirPact, pactid);

			if (false == (undefined !== this.H_eracepact[this.carid][pactid])) {
				this.execErase(this.H_argv.erase, pactid);
			}

			this.getTelXInfo(pactid, this.carid);

			if (false == this.readBillFile(A_billFile, dataDirPact, pactid)) {
				continue;
			}

			this.outResult();
			this.outDebug("\u51E6\u7406\u5BFE\u8C61\u30D5\u30A1\u30A4\u30EB:" + A_billFile.join(", "));
			closedir(dirh);
		}

		return true;
	}

	__destruct() {}

};