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
//請求レコード
//
//EOFレコード
//1レコードに含まれる内訳情報数
//1明細の長さ
//const NTTCOM_CARID = 14;
//20110909 杉田さん要望によりcarid変更
//請求番号
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
//doEachFile
//
//@author igarashi
//@since 2009/04/15
//
//@param mixed $H_utiwake
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
//makeTelno
//getBillTelnoが使いにくいので、電話番号の整形関数を作成
//@author web
//@since 2017/11/29
//
//@param mixed $line
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
//writeInsFile
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
//@param mixed $H_utiwake
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
class importNTTComOcnModel extends importNTTComModelBase {
	static BILLDIR = "ocn";
	static REF_TYOSEI = "5000";
	static CODE_WARI = "\u5272\u5F15\u984D";
	static NET_KIND = "5";
	static KIND_MANAGE = "01";
	static KIND_BILL = "11";
	static KIND_TOTAL = "51";
	static KIND_EOF = "91";
	static BILL_CONNOTE = 16;
	static BILL_LENGTH = 21;
	static NTTCOM_CARID = 9;
	static NTTCOM_CIRID = 31;
	static NTTCOM_ARID = 45;
	static NTTCOM_FIX_CARID = 9;
	static NTTCOM_FIX_ARID = 36;
	static NTTCOM_FIX_CIRID = 21;
	static FILE_EXT = "thiocn";
	static TAX_NOT_TAG = "13";

	constructor(O_base) {
		super(O_base);
		this.billname = "OCN";
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

	checkRegistTel(telno, pactid) {
		if (false == (undefined !== this.endlist[telno])) {
			this.endlist[telno] = telno;

			if (true == (-1 !== this.A_telnoCom.indexOf(telno))) {
				return true;
			}

			var A_telcount = Array();
			A_telcount = array_count_values(this.A_telnoX);

			if (false == (undefined !== A_telCount[telno])) {
				if (false == (undefined !== this.dummypost) || "" == this.dummypost) {
					this.outWarning("\u672A\u767B\u9332\u756A\u53F7\uFF1Adummy_tel_tb\u306B\u8ACB\u6C42\u5148\u90E8\u7F72\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + telno + ")");
					return false;
				} else {
					this.A_teldata.push([this.dummypost, telno, importNTTComOcnModel.NTTCOM_FIX_CARID]);
				}

				this.addtelcnt++;
				return false;
			} else if (1 == A_telCount[telno]) {
				this.A_teldata.push([this.H_regpost[telno], telno, importNTTComOcnModel.NTTCOM_FIX_CARID]);
				this.addtelcnt++;
				return true;
			} else if (1 < A_telCount[telno]) {
				if (1 == this.H_overtel[telno]) {
					this.A_teldata.push([this.H_overtel[telno].post, telno]);
					return false;
				} else {
					if (false == (undefined !== this.dummypost) || "" == this.dummypost) {
						this.outWarning("\u672A\u767B\u9332\u756A\u53F7\uFF1Adummy_tel_tb\u306B\u8ACB\u6C42\u5148\u90E8\u7F72\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + telno + ")");
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

	doEachFile(H_utiwake, filename, pactid) //請求部分
	{
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

		var H_code = this.getHashCode(H_utiwake);

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

			var datakind = line.substr(11, 2);

			if (importNTTComOcnModel.KIND_BILL == datakind) {
				if (false == this.execBillDetail(H_utiwake, H_code, line, pactid, filename)) {
					flock(fp, LOCK_UN);
					fclose(fp);
					return false;
				}
			} else if (importNTTComOcnModel.KIND_TOTAL == datakind) //特にチェックしない
				{} else if (importNTTComOcnModel.KIND_EOF == datakind) {
				if (false == this.checkEOFRecord(line, pactid, filename)) {
					flock(fp, LOCK_UN);
					fclose(fp);
					return false;
				}

				this.alltotalbill = this.alltotalbill + this.totalbill;
				this.totalbill = 0;
			} else {
				this.outWarning("\u672A\u77E5\u306E\u30C7\u30FC\u30BF\u7A2E\u985E(" + datakind + ")");
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
		if (0 < filesize(this.telxfile)) {
			var A_telcol = ["pactid", "postid", "telno", "telno_view", "userid", "carid", "arid", "cirid", "machine", "color", "employeecode", "username", "mail", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "date1", "date2", "memo", "kousiflg", "kousiptn", "username_kana", "kousi_fix_flg", "mail1", "mail2", "mail3", "url1", "url2", "url3", "recdate", "fixdate"];

			if (false == this.doCopyInsert(this.O_base.getTable("telX"), this.telxfile, A_telcol)) {
				this.outWarning(this.telxfile + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557");
				this.getDB().rollback();
				throw die(1);
			} else {
				this.outInfo(this.telxfile + "\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
			}
		}

		if (0 < filesize(this.teldetail)) {
			A_telcol = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "prtelno"];

			if (false == this.doCopyInsert(this.O_base.getTable("teldetailX"), this.teldetail, A_telcol)) {
				this.outWarning(this.teldetail + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557");
				this.getDB().rollback();
				throw die(1);
			} else {
				this.outInfo(this.teldetail + "\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
			}
		} else {
			this.outWarning(this.teldetail + "\u306E\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C0\u3067\u3059");
			return false;
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
				this.outWarning(filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F (" + line + ")");
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

	execBillDetail(H_utiwake, H_code, line, pactid, filename) //内訳情報を取得する
	//$telno = substr($line, 0, 10);
	//		$telno = trim($telno);
	//		//	頭に0を付ける
	//		if(preg_match("/^[5789]/", $telno )){
	//        	$telno =  "0".$telno;
	//	    }
	{
		var allbill = line.substr(142, 336);
		var telno = this.makeTelno(line);

		if ("" != telno) {
			this.checkRegistTel(telno, pactid);
		}

		for (var i = 0; i < importNTTComOcnModel.BILL_CONNOTE; i++) //請求部分を1件ずつ取得
		{
			var indivbill = line.substr(i * importNTTComOcnModel.BILL_LENGTH + 141, importNTTComOcnModel.BILL_LENGTH);
			var nullcheck = indivbill.replace(/ /g, "");

			if (0 == nullcheck.length) {
				continue;
			}

			var H_bill = this.classifyBillData(indivbill, importNTTComOcnModel.NET_KIND + "-");

			if (false == (undefined !== H_code[H_bill.code])) {
				this.outWarning("\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\u3067\u3059(" + this.billname + ").telno=" + telno + " code=" + H_bill.code);
				return false;
			}

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

	execErase(flg, pactid) {
		if ("o" != flg) {
			return true;
		}

		this.outInfo("\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u958B\u59CB(" + this.billname + ")");
		this.setEraceFlag(this.carid, pactid);
		this.getDB().begin();
		var sql = "DELETE FROM " + this.O_base.getTable("teldetailX") + " WHERE pactid=" + pactid + " AND carid=" + importNTTComOcnModel.NTTCOM_FIX_CARID;
		var result = this.getDB().query(sql, false);

		if (true == ("object" === typeof result)) {
			this.outError(this.O_base.getTable("teldetailX") + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F" + result.userinfo);
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

	makeTelno(line) //頭に0を付ける
	{
		var telno = line.substr(0, 10);
		telno = telno.trim();

		if (preg_match("/^[5789]0/", telno)) {
			telno = "0" + telno;
		}

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
			case "20":
				return "\u5185\u7A0E";
				break;

			case "11":
			case "21":
				return "\u5408\u7B97";
				break;

			case "13":
			case "23":
				return "\u975E\u5BFE\u8C61\u7B49";
				break;

			case "15":
			case "25":
				return "\u500B\u5225";
				break;

			case "80":
			case "82":
			case "90":
			case "92":
				return "\u8A2D\u5B9A\u306A\u3057";
				break;

			default:
				this.outWarning("\u4E0D\u660E\u306A\u7A0E\u30B3\u30FC\u30C9\u3067\u3059(" + code + ")");
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

			var datakind = line.substr(12, 2);

			if (importNTTComOcnModel.KIND_BILL != datakind) {
				continue;
			}

			var telno = this.makeTelno(line);
			var A_telCount = Array();
			A_telCount = array_count_values(this.A_telnoX);

			if (true == (undefined !== A_telCount[telno])) {
				if (1 < A_telCount[telno]) //複数登録されている電話で、postidが違うものを取り出す
					//複数登録の電話番号全て同じ部署に所属していたらその部署に請求
					{
						var sql = "SELECT postid FROM " + this.O_base.getTable("telx") + " WHERE pactid=" + pactid + " AND telno='" + telno + "' AND carid !=" + importNTTComOcnModel.NTTCOM_FIX_CARID;
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
									this.outWarning("\u672A\u767B\u9332\u756A\u53F7\uFF1Adummy_tel_tb\u306B\u8ACB\u6C42\u90E8\u7F72\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093(" + telno + ")");
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
					sql = "SELECT postid FROM " + this.O_base.getTable("telX") + " WHERE pactid=" + pactid + " AND telno='" + telno + "' AND carid !=" + importNTTComOcnModel.NTTCOM_FIX_CARID;
					var regpost = this.getDB().getOne(sql, true);
					this.H_regpost[telno] = regpost;
				}
			}
		}

		flock(fp, LOCK_UN);
		fclose(fp);
		return true;
	}

	readBillFile(A_billFile, H_utiwake, dataDirPact, pactid) {
		var errflag = false;

		for (var filename of Object.values(A_billFile)) {
			this.outInfo(dataDirPact + "/" + filename + importNTTComOcnModel.LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u958B\u59CB");

			if (false == this.doEachFile(H_utiwake, dataDirPact + "/" + filename, pactid)) {
				this.getDB().rollback();
				errflag = true;
				break;
			}

			this.outInfo(dataDirPact + "/" + filename + importNTTComOcnModel.LOG_DELIM + "\u30C7\u30FC\u30BF\u8AAD\u8FBC\u51E6\u7406\u5B8C\u4E86\uFF1A\u96FB\u8A71\u4EF6\u6570=" + this.readtelcnt + ": \u660E\u7D30\u4EF6\u6570=" + this.readmeisaicnt + ":\u8FFD\u52A0\u96FB\u8A71\u4EF6\u6570(" + this.O_base.getTable("telX") + ")=" + this.addtelcnt);
		}

		if (false == errflag) {
			this.outInfo("\u30C7\u30FC\u30BF\u66F8\u51FA\u51E6\u7406\u958B\u59CB");

			if (false == this.writeTelData(pactid)) {
				this.outWarning(this.telxfile + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u51FA\u306B\u5931\u6557");
				this.A_pactfail.push(pactid);
				this.getDB().rollback();
				return false;
			}

			if (false == this.writeInsFile(pactid)) {
				this.outWarning(this.teldetail + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u51FA\u306B\u5931\u6557");
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
			this.moveFinishDir(importNTTComOcnModel.BILLDIR, pactid);
			this.A_pactDone.push(pactid);
		} else {
			this.O_base.getDB().commit();
			this.A_pactfail.push(pactid);
		}
	}

	setOutTel(A_array) {
		if (Array() == this.A_outtel) {
			this.A_outtel = A_array();
		} else if (true == Array.isArray(this.A_outtel)) {
			this.A_outtel = array_merge(this.A_outtel, A_array);
		}
	}

	writeTelData(pactid) //tel_x_tbに追加する電話を出力
	{
		if (false != (undefined !== this.dummytelno) || "" != this.dummytelno) {
			if (false == (-1 !== this.A_telnoCom.indexOf(this.dummytelno))) {
				this.A_teldata.push([this.dummypost, this.dummytelno, importNTTComOcnModel.NTTCOM_FIX_CARID]);
			}
		}

		var nowtime = this.O_base.getTimestamp();
		this.telxfile = this.datadir + "/" + this.O_base.getTable("telX") + pactid + importNTTComOcnModel.FILE_EXT + ".tmp";
		var fp_telx = fopen(this.telxfile, "w");

		if (undefined == fp_telx) {
			this.outError(this.telxfile + "\u306E\u66F8\u8FBC\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
			return false;
		}

		var A_nullbox = Array();

		for (var i = 0; i <= 36; i++) {
			A_nullbox[i] = "\\N";
		}

		for (var A_data of Object.values(this.A_teldata)) //tel_x_tbに1件だけ登録済みで電話情報があればコピー
		//公私分計をする電話は全て「会社設定にしたがう」にする
		{
			var postid = A_data[0];
			var telno = A_data[1];

			if (11 <= preg_match("/^0[789]0/", telno) && 11 <= telno.length) {
				var telno_view = this.O_base.makeTelnoView(telno);
			} else {
				telno_view = telno;
			}

			if (true == (undefined !== this.H_telXinfo[telno])) {
				var sql = "SELECT " + "userid, machine, color, employeecode, username, mail, " + "text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, " + "int1, int2, int3, date1, date2, memo, kousiflg, kousiptn, username_kana, kousi_fix_flg, " + "mail1, mail2, mail3, url1, url2, url3 " + "FROM " + this.O_base.getTable("telX") + " " + "WHERE " + "pactid=" + pactid + " AND carid !=" + this.carid + " AND telno='" + telno + "' " + "LIMIT 1";
				var H_telinfo = this.getDB().getAll(sql, true);
				var H_tmp_info = H_telinfo[0];

				if (!!H_tmp_info[26]) {
					H_tmp_info[26] = preg_replace("/(\n|\r\n|\r)/", "LFkaigyoLF", H_tmp_info[26]);
				}

				var endcnt = H_tmp_info.length;

				for (var cnt = 0; cnt < endcnt; cnt++) {
					if (undefined == H_tmp_info[cnt] || "" == H_tmp_info[cnt]) {
						H_tmp_info[cnt] = "\\N";
					} else {
						H_tmp_info[cnt] = H_tmp_info[cnt].replace(/	/g, "");
					}
				}
			} else {
				H_tmp_info = A_nullbox;
			}

			if (0 == H_tmp_info[27]) {
				H_tmp_info[27] = "\\N";
			}

			H_tmp_info[28] = "\\N";

			for (var key in H_tmp_info) {
				var value = H_tmp_info[key];
				H_tmp_info[key] = value.replace(/	/g, "");
			}

			fwrite(fp_telx, pactid + "\t" + postid + "\t" + telno + "\t" + telno_view + "\t" + H_tmp_info[0] + "\t" + importNTTComOcnModel.NTTCOM_FIX_CARID + "\t" + importNTTComOcnModel.NTTCOM_FIX_ARID + "\t" + importNTTComOcnModel.NTTCOM_FIX_CIRID + "\t" + H_tmp_info[1] + "\t" + H_tmp_info[2] + "\t" + H_tmp_info[3] + "\t" + H_tmp_info[4] + "\t" + H_tmp_info[5] + "\t" + H_tmp_info[6] + "\t" + H_tmp_info[7] + "\t" + H_tmp_info[8] + "\t" + H_tmp_info[9] + "\t" + H_tmp_info[10] + "\t" + H_tmp_info[11] + "\t" + H_tmp_info[12] + "\t" + H_tmp_info[13] + "\t" + H_tmp_info[14] + "\t" + H_tmp_info[15] + "\t" + H_tmp_info[16] + "\t" + H_tmp_info[17] + "\t" + H_tmp_info[18] + "\t" + H_tmp_info[19] + "\t" + H_tmp_info[20] + "\t" + H_tmp_info[21] + "\t" + H_tmp_info[22] + "\t" + H_tmp_info[23] + "\t" + H_tmp_info[24] + "\t" + H_tmp_info[25] + "\t" + H_tmp_info[26] + "\t" + H_tmp_info[27] + "\t" + H_tmp_info[28] + "\t" + H_tmp_info[29] + "\t" + H_tmp_info[30] + "\t" + H_tmp_info[31] + "\t" + H_tmp_info[32] + "\t" + H_tmp_info[33] + "\t" + H_tmp_info[34] + "\t" + H_tmp_info[35] + "\t" + H_tmp_info[36] + "\t" + nowtime + "\t" + nowtime + "\n");
		}

		fclose(fp_telx);
		return true;
	}

	writeInsFile(pactid) //番号明細
	//按分
	{
		var aspcharge = 0;
		var aspflg = false;
		var totalwari = 0;
		var totalprice = 0;

		if (0 == this.A_filedata.length) {
			return false;
		}

		if (false == (undefined !== this.dummytelno) || "" == this.dummytelno) {
			this.dummytelno = "";
		}

		if ("y" == this.H_argv.anbun) {
			totalwari = 0;
			var etcwari = 0;
			{
				let _tmp_0 = this.A_filedata;

				for (var key in _tmp_0) {
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
				this.outWarning("\u5272\u5F15\u984D\u304C\u7570\u5E38\u3067\u3059(" + totalwari + ")");
				return false;
			}

			var discount = totalwari / totalprice;
			discount = Math.ceil(discount * 10000) / 10000;
			var H_anbun = Array();
			var totalanbun = 0;
			{
				let _tmp_1 = this.A_filedata;

				for (var key in _tmp_1) {
					var val = _tmp_1[key];

					if (false == (undefined !== H_anbun[val[0]])) {
						H_anbun[val[0]] = {
							telno: val[0],
							charge: 0
						};
					}

					H_anbun[val[0]].charge = Math.round(val[2] * discount);
					H_anbun[val[0]].code = importNTTComOcnModel.REF_TYOSEI;
					H_anbun[val[0]].name = importNTTComOcnModel.CODE_WARI;
					totalanbun += H_anbun[val[0]].charge;
				}
			}

			if (this.alltotalbill != totalprice + totalanbun) {
				var charge = (totalprice + totalanbun - this.alltotalbill) * -1;
				this.A_filedata.push([this.dummytelno, importNTTComOcnModel.REF_TYOSEI, charge, importNTTComOcnModel.TAX_NOT_TAG, importNTTComOcnModel.CODE_WARI]);
			}

			var H_anbundata = Array();

			if (0 < H_anbun.length) {
				for (var val of Object.values(H_anbun)) {
					H_anbundata.push([val.telno, val.code, val.charge, importNTTComOcnModel.TAX_NOT_TAG, val.code, val.name]);
				}
			}
		}

		if (true == this.O_base.checkAsp(pactid)) {
			aspflg = true;
			aspcharge = this.O_base.getAsp(pactid, importNTTComOcnModel.NTTCOM_FIX_CARID);

			if (undefined == aspcharge) {
				this.outWarning("ASP\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
				return false;
			}
		}

		this.teldetail = this.datadir + "/" + this.O_base.getTable("teldetailX") + pactid + importNTTComOcnModel.FILE_EXT + ".tmp";
		var fp = fopen(this.teldetail, "w");

		if (undefined == fp) {
			this.outWarning(this.teldetail + "\u306E\u66F8\u8FBC\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
			return false;
		}

		var detailno = 0;
		var A_detail = Array();
		var nowtime = this.O_base.getTimestamp();

		for (var val of Object.values(this.A_filedata)) {
			if (false == (-1 !== this.A_outtel.indexOf(val[0]))) {
				this.A_outtel.push(val[0]);
			}

			fwrite(fp, pactid + "\t" + val[0] + "\t" + val[1] + "\t" + val[4] + "\t" + val[2] + "\t" + val[3] + "\t" + detailno + "\t" + nowtime + "\t" + importNTTComOcnModel.NTTCOM_FIX_CARID + "\t" + this.billno + "\n");
			A_detail[val[0]] = 1;
		}

		if ("y" == this.H_argv.anbun) {
			if (true == (undefined !== A_detail[val[0]])) {
				detailno = A_detail[val[0]];
			} else {
				detailno = 0;
			}

			for (var val of Object.values(H_anbundata)) {
				fwrite(fp, pactid + "\t" + val[0] + "\t" + val[1] + "\t" + val[5] + "\t" + val[2] + "\t" + "\u975E\u5BFE\u8C61\u7B49\t" + detailno + "\t" + nowtime + "\t" + importNTTComOcnModel.NTTCOM_FIX_CARID + "\t" + this.billno + "\n");
				detailno++;
				A_detail[val[0]] = detailno;

				if (false == (-1 !== this.A_outtel.indexOf(val[0]))) {
					this.A_outtel.push(val[0]);
				}
			}
		}

		for (var val of Object.values(this.A_outtel)) {
			if (this.dummytelno != val) {
				detailno = A_detail[val];
				detailno++;

				if (true == aspflg) {
					fwrite(fp, pactid + "\t" + val + "\t" + importNTTComOcnModel.REF_ASP + "\t" + importNTTComOcnModel.REF_ASP_NAME + "\t" + aspcharge + "\t" + "\\N\t" + detailno + "\t" + nowtime + "\t" + importNTTComOcnModel.NTTCOM_FIX_CARID + "\t" + "\n");
					detailno++;
					fwrite(fp, pactid + "\t" + val + "\t" + importNTTComOcnModel.REF_ASX + "\t" + importNTTComOcnModel.REF_ASX_NAME + "\t" + +(aspcharge * importNTTComOcnModel.EXCISE_RATE + "\t" + "\\N\t" + detailno + "\t" + nowtime + "\t" + importNTTComOcnModel.NTTCOM_FIX_CARID + "\t" + "\n"));
				}
			}
		}

		fclose(fp);
		return true;
	}

	execMainProc(H_pact, H_utiwake, H_erace) //指定されたpact分ループ
	{
		var pactcnt = this.A_pactid.length;
		this.H_eracepact = H_erace;
		this.A_pactid.sort();

		for (var i = 0; i < pactcnt; i++) //マスターになければ次へ進む
		//$dataDirPact = $this->datadir. "/". $pactid. "/" .self::BILLDIR;
		//請求データファイル名取得
		//請求ファイルがなければ次の会社へ
		//$billno = $this->getBillNo(self::NTTCOM_CARID, $fileName);
		{
			if (false == (undefined !== H_pact[this.A_pactid[i]])) {
				this.outWarning("pactid=" + this.A_pactid[i] + "\u306Fpact_tb\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
				continue;
			}

			var pactid = this.A_pactid[i];
			var pactname = H_pact[pactid];
			var A_billFile = Array();
			var dataDirPact = this.datadir + "/" + importNTTComOcnModel.BILLDIR + "/" + pactid;

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

			billno = this.getBillNo(importNTTComOcnModel.NTTCOM_CARID, pactid);

			if (undefined == billno) {
				this.outWarning(fileName + "\u306B\u3064\u3044\u3066\u306E\u8ACB\u6C42\u756A\u53F7\u304Cbill_prtel_tb\u306B\u898B\u3064\u304B\u308A\u307E\u305B\u3093(" + this.billname + ")");
				continue;
			}

			var A_code = this.getBillCode(importNTTComOcnModel.NTTCOM_CARID, pactid);

			if (Array() == A_code) {
				this.outWarning("pactid=" + pactid + "\u306B\u3064\u3044\u3066\u306E\u8ACB\u6C42\u756A\u53F7\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093(" + this.billname + ")");
				continue;
			}

			this.billno = billno;
			this.getTelInfo(importNTTComOcnModel.NTTCOM_FIX_CARID, pactid);
			this.getDummyTel(importNTTComOcnModel.NTTCOM_FIX_CARID, pactid, "OCN");
			this.execBackup(this.H_argv.backup);
			this.preDeleteProc(A_billFile, dataDirPact, pactid);

			if (false == (undefined !== this.H_eracepact[this.carid][pactid])) {
				this.execErase(this.H_argv.erase, pactid);
			}

			this.getTelXInfo(pactid, importNTTComOcnModel.NTTCOM_FIX_CARID);

			if (false == this.readBillFile(A_billFile, H_utiwake, dataDirPact, pactid)) {
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