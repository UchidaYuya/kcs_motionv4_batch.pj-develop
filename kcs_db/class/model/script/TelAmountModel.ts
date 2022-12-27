// import MtDBUtil from "../../MtDBUtil";
// import MtSetting from "../../MtSetting";
import MtMailUtil from "../../MtMailUtil";
import * as fs from "fs";
import {loadIniFile} from "read-ini-file";
import * as Encoding from "encoding-japanese";
import { pg_query, pg_connect } from "../../../script/pg_function";
import { ScriptLogAdaptor } from "../../../script/batch/lib/script_log";
// const fs = require('fs');
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
export default class TelAmountModel {
	tableName: string;
	dataDir: string;
	scriptname: string;
	logh: ScriptLogAdaptor;
	H_argv: { [key: string]: any };
	pactid!: number;
	year!: number;
	month!: number;
	carid!: number;
	prtelno!: string;
	filePath!: string;
	fp: any;

	constructor(dir: string, logh: ScriptLogAdaptor, H_argv: { [key: string]: any }, scriptname = "") {
		this.tableName = "tel_amount_bill_tb";
		this.dataDir = dir;
		this.scriptname = scriptname;

		if (!scriptname) {
// 			echo("\u30B9\u30AF\u30EA\u30D7\u30C8\u540D\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n");// 2022cvt_010
			throw process.exit(0);// 2022cvt_009
		}

		this.logh = logh;
		this.H_argv = H_argv;
	}

	setLogHandler(logh: ScriptLogAdaptor) {
		this.logh = logh;
	}

	getAmountColumn() //テーブル構成通りに書かないと動かない
	{
// 2022cvt_016
		return ["pactid", "carid", "prtelno", "charge", "year", "month", "note", "recdate", "confirmation", "recordtype"];
	}

// 2022cvt_016
	makeAmountData(data: { [key: string]: any }, rtntype = "string") {
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

// 2022cvt_016
		data.recordtype = "batch";
// 2022cvt_015
		var addmode = false;

		if (undefined !== this.H_argv.erase && "a" == this.H_argv.erase) {
			addmode = true;
		} else if (Array.isArray(this.H_argv)) {
// 2022cvt_015
			for (var value of (this.H_argv)) {
// 2022cvt_019
				// if (preg_match("/^-e/", value) && !preg_match("/o$|O$/", value)) {
				if (value.match("/^-e/") && !value.match("/o$|O$/")) {
					addmode = true;
				}
			}
		}

		if (addmode) {
// 2022cvt_015
            var ini = loadIniFile.sync("/kcs/conf/db.ini");
			// var ini = parse_ini_file("/kcs/conf/db.ini");
// 2022cvt_015
            // var fp = fopen(ini.db_pass, "r");
			var buffer = fs.readFileSync(ini.db_pass, "utf8");
			var text = Encoding.convert(buffer, {
				from: "SJIS",
				to: "UNICODE",
				type: "string"
			});
			var lines = text.toString().split("\r\n");
// 2022cvt_015
            //var passwd = fgets(fp);
			var passwd = lines[0];
			// fclose(fp);
// 2022cvt_015
			// var dbh = pg_connect("host=" + ini.db_host + " port=" + ini.db_port + " dbname=" + ini.db_name + " password=" + passwd + " user=" + ini.db_user);
			var dbh = pg_connect(ini.db_host ,ini.db_port ,ini.db_name , passwd , ini.db_user);
// 2022cvt_015
			var sql = "SELECT charge FROM tel_amount_bill_tb " + "WHERE " + "pactid=" + data.pactid + " " + " AND carid=" + data.carid + " " + " AND prtelno='" + data.prtelno + "' " + " AND year=" + data.year + " " + " AND month=" + data.month + " " + "ORDER BY " + "recdate DESC";
// 2022cvt_015
			// var buff = pg_query(dbh, sql);
			var result = pg_query(dbh, sql);

// 2022cvt_015
			// var result = pg_fetch_row(buff);
			// data.charge = data.charge + result[0];
			data.charge = data.charge + result[0]['charge'];
		}

// 2022cvt_016
    var amountData: string = "";
		if ("string" == rtntype) {
// 2022cvt_015
			amountData = data.pactid + "\t" + data.carid + "\t" + data.prtelno + "\t" + data.charge + "\t" + data.year + "\t" + data.month + "\t" + data.note + "\t" + data.recdate + "\t" + 0 + "\t" + "batch" + "\n";
// 2022cvt_016
		} else if ("array" == rtntype) //テーブル構成順に並び替える
			{
// 2022cvt_015
				var column = this.getAmountColumn();

// 2022cvt_015
				for (var val of (column)) {
					amountData[val] = data[val];
				}
			}

		return amountData;
	}

	writeFile(data: string) {
		if (Array.isArray(data)) {
			data = this.makeAmountData(data);
		}

		fs.writeFileSync(this.fp, data);// 2022cvt_006
	}

	makeFile(year: number, month: number, pactid: number, extension = "ins") {
		this.filePath = this.dataDir + "/" + this.getTableName() + year + month + pactid + "." + extension;

		// if (file_exists(this.filePath)) {
		if (fs.existsSync(this.filePath)) {
			fs.unlinkSync(this.filePath);// 2022cvt_007
		}

		// if (!(this.fp = fopen(this.filePath, "a"))) //if ($this->logh instanceof ProcessBaseBatch) {
		try {
			this.fp = fs.openSync(this.filePath, "a");
		} catch (e) {
			console.log("ERROR: " + this.getTableName() + " のファイルオープンに失敗しました\n");
		}

		// try {
		// 	fs.writeSync();
		// } catch (e) {
		// 	fs.unlinkSync();
		// }
		// if (!(this.fp = fs.openSync(this.filePath, "a"))) //if ($this->logh instanceof ProcessBaseBatch) {
			//				$this->logh->errorOut();
			//			}
			//			else {
			//				$this->logh->putError(G_SCRIPT_ERROR, SCRIPTNAME . $this->tableName . " のファイルオープンに失敗しました");
			//			}
			// {
			// }

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
		// return fclose(this.fp);
		return fs.closeSync(this.fp);
	}

	getTableName() {
		return this.tableName;
	}

	getFilePath() {
		return this.filePath;
	}

	setPrtelNo(prtelno) {
		if ("all" != prtelno) {
// 2022cvt_015
			var temp = prtelno.trim();
			this.prtelno = temp.replace(/"/g, "");
		}
	}

	getPrtelNo() {
		return this.prtelno;
	}

	send(message: string, subj = "", to = "", from_name = "", to_name = "") {
// 2022cvt_015
// 		var err_rep = error_reporting();// 2022cvt_011
// 		error_reporting(E_ALL ^ E_NOTICE);// 2022cvt_011

// 2022cvt_026
		// require("MtMailUtil.php");
// 2022cvt_015
        var Mail = new MtMailUtil();
		var from: any;

		if (!to) {
			to = "batch_error@kcs-next-dev.com";
		}

		if (!from) {
// 2022cvt_015
			from = to;
		}

		if (!subj) {
			// subj = mb_convert_encoding(G_MAIL_SUBJECT, "JIS");
			// subj = mb_convert_encoding(G_MAIL_SUBJECT, "JIS");
		}

		if (!from_name) {
			from_name = to;
		} else {
			// from_name = mb_convert_encoding(from_name, "JIS", "UTF-8");
		}

		if (Array.isArray(message)) {
// 2022cvt_015
			var msg = "";

// 2022cvt_015
			for (var code of (message)) {
				if (code[1] == "unregist") {
					msg += "内訳コード：" + code[0] + "が仮登録されました\n";
				} else if (code[1] == "interim") {
					msg += "内訳コード：" + code[0] + "が仮登録のままです\n";
				}
			}
		} else {
			msg = message;
		}

		Mail.sendByFlg(to, msg, from, subj, from_name, to_name);
// 		error_reporting(err_rep);// 2022cvt_011
	}

// 	__destruct() {}// 2022cvt_014

};
