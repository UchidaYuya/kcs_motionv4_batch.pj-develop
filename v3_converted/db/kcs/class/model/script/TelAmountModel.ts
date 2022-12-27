require("MtDBUtil.php");

require("MtSetting.php");

//
//__construct
//
//@author igarashi
//@since 2011/04/11
//
//@param mixed $dir
//@access public
//@return void
//
//
//setLogHandler
//
//@author igarashi
//@since 2011/04/12
//
//@param mixed $logh
//@access public
//@return void
//
//
//getAmountColumn
//
//@author igarashi
//@since 2011/04/11
//
//@access public
//@return void
//
//
//setAmountData
//
//@author igarashi
//@since 2011/04/11
//
//@param array $data
//@access public
//@return void
//
//
//writeFile
//
//@author igarashi
//@since 2011/04/11
//
//@param mixed $data
//@access public
//@return void
//
//
//makeFile
//
//@author igarashi
//@since 2011/04/11
//
//@param string $extension
//@access public
//@return void
//
//
//setBasicData
//
//@author igarashi
//@since 2011/04/13
//
//@param mixed $data
//@access public
//@return void
//
//
//getBasicData
//
//@author igarashi
//@since 2011/04/14
//
//@access public
//@return void
//
//
//closeFile
//
//@author igarashi
//@since 2011/04/11
//
//@access public
//@return void
//
//
//getTableName
//
//@author igarashi
//@since 2011/04/11
//
//@access public
//@return void
//
//
//getFilePath
//
//@author igarashi
//@since 2011/04/11
//
//@access public
//@return void
//
//
//setPrtelNo
//
//@author igarashi
//@since 2011/04/12
//
//@param mixed $prtelno
//@access public
//@return void
//
//
//getPrtelNo
//
//@author igarashi
//@since 2011/04/12
//
//@access public
//@return void
//
//
//send
//
//@author igarashi
//@since 2011/05/18
//
//@param mixed $to
//@param mixed $message
//@param string $from
//@param string $subj
//@param string $from_name
//@param string $to_name
//@access public
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/04/11
//
//@access public
//@return void
//
class TelAmountModel {
	constructor(dir, logh, H_argv, scriptname = "") {
		this.tableName = "tel_amount_bill_tb";
		this.dataDir = dir;
		this.scriptname = scriptname;

		if (!scriptname) {
			echo("\u30B9\u30AF\u30EA\u30D7\u30C8\u540D\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n");
			throw die(0);
		}

		this.logh = logh;
		this.H_argv = H_argv;
	}

	setLogHandler(logh) {
		this.logh = logh;
	}

	getAmountColumn() //テーブル構成通りに書かないと動かない
	{
		return ["pactid", "carid", "prtelno", "charge", "year", "month", "note", "recdate", "confirmation", "recordtype"];
	}

	makeAmountData(data: {} | any[], rtntype = "string") {
		if (!(undefined !== data.pactid) || !data.pactid) {
			data.pactid = this.pactid;
		}

		if (!(undefined !== data.year) || !data.year) {
			data.year = this.year;
		}

		if (!(undefined !== data.month) || !data.month) {
			data.month = this.month;
		}

		if (!(undefined !== data.note) || !data.note) {
			data.note = undefined;
		}

		if (!(undefined !== data.carid) || !data.carid) {
			data.carid = this.carid;
		}

		if (!(undefined !== data.prtelno) || !data.prtelno) {
			data.prtelno = this.prtelno;
		}

		data.recordtype = "batch";
		var addmode = false;

		if (undefined !== this.H_argv.erase && "a" == this.H_argv.erase) {
			addmode = true;
		} else if (Array.isArray(this.H_argv)) {
			for (var value of Object.values(this.H_argv)) {
				if (preg_match("/^-e/", value) && !preg_match("/o$|O$/", value)) {
					addmode = true;
				}
			}
		}

		if (addmode) {
			var ini = parse_ini_file("/kcs/conf/db.ini");
			var fp = fopen(ini.db_pass, "r");
			var passwd = fgets(fp);
			fclose(fp);
			var dbh = pg_connect("host=" + ini.db_host + " port=" + ini.db_port + " dbname=" + ini.db_name + " password=" + passwd + " user=" + ini.db_user);
			var sql = "SELECT charge FROM tel_amount_bill_tb " + "WHERE " + "pactid=" + data.pactid + " " + " AND carid=" + data.carid + " " + " AND prtelno='" + data.prtelno + "' " + " AND year=" + data.year + " " + " AND month=" + data.month + " " + "ORDER BY " + "recdate DESC";
			var buff = pg_query(dbh, sql);
			var result = pg_fetch_row(buff);
			data.charge = data.charge + result[0];
		}

		if ("string" == rtntype) {
			var amountData = data.pactid + "\t" + data.carid + "\t" + data.prtelno + "\t" + data.charge + "\t" + data.year + "\t" + data.month + "\t" + data.note + "\t" + data.recdate + "\t" + 0 + "\t" + "batch" + "\n";
		} else if ("array" == rtntype) //テーブル構成順に並び替える
			{
				var column = this.getAmountColumn();

				for (var val of Object.values(column)) {
					amountData[val] = data[val];
				}
			}

		return amountData;
	}

	writeFile(data) {
		if (Array.isArray(data)) {
			data = this.makeAmountData(data);
		}

		fwrite(this.fp, data);
	}

	makeFile(year, month, pactid, extension = "ins") {
		this.filePath = this.dataDir + "/" + this.getTableName() + year + month + pactid + "." + extension;

		if (file_exists(this.filePath)) {
			unlink(this.filePath);
		}

		if (!(this.fp = fopen(this.filePath, "a"))) //if ($this->logh instanceof ProcessBaseBatch) {
			//				$this->logh->errorOut();
			//			}
			//			else {
			//				$this->logh->putError(G_SCRIPT_ERROR, SCRIPTNAME . $this->tableName . " のファイルオープンに失敗しました");
			//			}
			{
				print("ERROR: " + this.getTableName() + " \u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n");
			}

		this.year = year;
		this.month = month;
		this.pactid = pactid;
	}

	setBasicData(data) {
		if (undefined !== data.year) {
			this.year = data.year;
		}

		if (undefined !== data.month) {
			this.month = data.month;
		}

		if (undefined !== data.pactid) {
			this.pactid = data.pactid;
		}

		if (undefined !== data.carid) {
			this.carid = data.carid;
		}
	}

	getBasicData() {
		return {
			year: this.year,
			month: this.month,
			pactid: this.pactid,
			carid: this.carid
		};
	}

	closeFile() {
		return fclose(this.fp);
	}

	getTableName() {
		return this.tableName;
	}

	getFilePath() {
		return this.filePath;
	}

	setPrtelNo(prtelno) {
		if ("all" != prtelno) {
			var temp = prtelno.trim();
			this.prtelno = temp.replace(/"/g, "");
		}
	}

	getPrtelNo() {
		return this.prtelno;
	}

	send(message, subj = "", to = "", from_name = "", to_name = "") {
		var err_rep = error_reporting();
		error_reporting(E_ALL ^ E_NOTICE);

		require("MtMailUtil.php");

		var Mail = new MtMailUtil();

		if (!to) {
			to = "batch_error@kcs-next-dev.com";
		}

		if (!from) {
			var from = to;
		}

		if (!subj) {
			subj = mb_convert_encoding(G_MAIL_SUBJECT, "JIS");
		}

		if (!from_name) {
			from_name = to;
		} else {
			from_name = mb_convert_encoding(from_name, "JIS", "UTF-8");
		}

		if (Array.isArray(message)) {
			var msg = "";

			for (var code of Object.values(message)) {
				if (code[1] == "unregist") {
					msg += "\u5185\u8A33\u30B3\u30FC\u30C9\uFF1A" + code[0] + "\u304C\u4EEE\u767B\u9332\u3055\u308C\u307E\u3057\u305F\n";
				} else if (code[1] == "interim") {
					msg += "\u5185\u8A33\u30B3\u30FC\u30C9\uFF1A" + code[0] + "\u304C\u4EEE\u767B\u9332\u306E\u307E\u307E\u3067\u3059\n";
				}
			}
		} else {
			msg = message;
		}

		Mail.sendByFlg(to, msg, from, subj, from_name, to_name);
		error_reporting(err_rep);
	}

	__destruct() {}

};