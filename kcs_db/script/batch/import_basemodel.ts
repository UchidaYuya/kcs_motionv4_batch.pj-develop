import { DATA_LOG_DIR } from "../../db_define/define";
import TableNo, { ScriptDB } from "./lib/script_db";
import { G_SCRIPT_ALL, G_SCRIPT_ERROR, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "./lib/script_log";

//作業ディレクトリ
//ログ区切り文字
//ASP表示権限
//
//__construct
//
//@author igarashi
//@since 2009/04/09
//
//@param mixed $filename	ログ出力先　絶対パス
//@access public
//@return void
//
//
//引数チェック
//
//@author igarashi
//@since 2009/04/09
//
//@access protected
//@return void
//
//
//checkDigit
//
//@author igarashi
//@since 2009/04/17
//
//@param mixed $str
//@access public
//@return void
//
//
//setArgvCheckList
//
//@author web
//@since 2013/05/01
//
//@param mixed $array
//@access public
//@return void
//
//
//引数の詳細チェック
//
//@author igarashi
//@since 2009/04/09
//
//@access protected
//@return void
//
//
//checkAsp
//
//@author igarashi
//@since 2009/04/19
//
//@param mixed $pactid
//@access public
//@return void
//
//
//convAnnoDomini
//
//@author igarashi
//@since 2009/04/27
//
//@param mixed $year
//@access public
//@return void
//
//
//getArgv
//
//@author igarashi
//@since 2009/04/10
//
//@access public
//@return void
//
//
//getDB
//
//@author igarashi
//@since 2009/04/21
//
//@access public
//@return void
//
//
//getLog
//
//@author igarashi
//@since 2009/04/21
//
//@access public
//@return void
//
//
//getTalbeNo
//
//@author igarashi
//@since 2009/04/13
//
//@access public
//@return void
//
//
//getTable
//
//@author igarashi
//@since 2009/04/21
//
//@param mixed $name
//@access public
//@return void
//
//
//getTimestamp
//
//@author igarashi
//@since 2009/04/17
//
//@access public
//@return void
//
//
//getAsp
//
//@author igarashi
//@since 2009/04/17
//
//@param mixed $pactid
//@access public
//@return void
//
//
//makeTelnoView
//
//@author igarashi
//@since 2009/04/17
//
//@param mixed $telno
//@access public
//@return void
//
//
//setArgv
//
//@author igarashi
//@since 2009/04/21
//
//@param mixed $A_array
//@access public
//@return void
//
//
//setTableName
//
//@author igarashi
//@since 2009/04/13
//
//@access public
//@return void
//
//
//usage
//
//@author igarashi
//@since 2009/04/09
//
//@param mixed $str
//@param mixed $db
//@access protected
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
export class importBaseModel {
	checkList: string | any[];
	dbLogFile: string;
	log_listener: ScriptLogBase;
	log_listener_type: ScriptLogBase | undefined;
	log_listener_type2: ScriptLogBase | undefined;
	logh: ScriptLogAdaptor;
	dbh: ScriptDB;
	H_argv: any;
	tableno!: string;
	telX_tb!: string;
	postrelX_tb!: string;
	teldetailX_tb!: string;
	commhistory_tb!: string;

	static FIN_DIR = "fin";
	static LOG_DELIM = " ";
	static FNC_ASP = 2;

	constructor(filename = "") //ログ周り生成
	//script用DBオブジェクト生成
	{
		this.checkList = Array();

		if ("" == filename) {
			this.dbLogFile = DATA_LOG_DIR + "/billbat.log";
		} else {
			this.dbLogFile = DATA_LOG_DIR + filename;
		}

		this.log_listener = new ScriptLogBase(0);
// 2022cvt_016
		this.log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, this.dbLogFile);
// 2022cvt_016
		this.log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
// 2022cvt_016
		this.log_listener.putListener(this.log_listener_type);
// 2022cvt_016
		this.log_listener.putListener(this.log_listener_type2);
		this.logh = new ScriptLogAdaptor(this.log_listener, true);
		this.dbh = new ScriptDB(this.log_listener);
		this.checkList = ["e", "y", "p", "b", "a"];
	}

	checkArgv(cnt: number) {
		if (this.H_argv.length != cnt) {
			this.usage("", this.dbh);
			throw process.exit(1);// 2022cvt_009
		}

		return true;
	}

	checkDigit(str: string | any[]) {
		if (1 == str.length) {
			str = "0" + str;
		}

		return str;
	}

	setArgvCheckList(array: string[]) {
		this.checkList = array;
	}

	getArgvCheckList() {
		return this.checkList;
	}

	checkArgvDetail() {
// 2022cvt_015
		var argmax = this.H_argv.length;

// 2022cvt_015
		for (var i = 1; i < argmax; i++) //mode
		{
// 2022cvt_019
			// if (-1 !== this.checkList.indexOf("e") && preg_match("/^-e=/", this.H_argv[i])) {
			if (-1 !== this.checkList.indexOf("e") && this.H_argv[i].match("/^-e=/")) {
// 2022cvt_015
				// var mode = ereg_replace("^-e=", "", this.H_argv[i]).toLowerCase();
				var mode = this.H_argv[i].replace("^-e=", "").toLowerCase();

				// if (false == ereg("^[ao]$", mode)) {
				if (false == mode.match("^[ao]$")) {
					this.usage("ERROR: モードの指定が不正です", this.dbh);
				}

				this.H_argv.erase = mode;
				continue;
			}

// 2022cvt_019
			// if (-1 !== this.checkList.indexOf("y") && preg_match("/^-y=/", this.H_argv[i])) {
			if (-1 !== this.checkList.indexOf("y") && this.H_argv[i].match("/^-y=/")) {
// 2022cvt_015
				// var billdate = ereg_replace("^-y=", "", this.H_argv[i]);
				var billdate = this.H_argv[i].replace("^-y=", "");
				let d = new Date();

				// if (false == ereg("^[0-9]{6}$", billdate)) {
				if (false == billdate.match("^[0-9]{6}$")) {
					this.usage("ERROR: 請求年月の指定に誤りがあります", this.dbh);
				} else {
// 2022cvt_015
					var year = billdate.substring(0, 4);
// 2022cvt_015
					var month = billdate.substring(4, 2);

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						this.usage("ERROR: 請求年月の指定に誤りがあります", this.dbh);
					}
				}

// 2022cvt_015
				// var diffmon = (date("Y") - year) * 12 + (date("m") - month);
				var diffmon = (d.getFullYear() - year) * 12 + (d.getMonth() - month);

				if (0 > diffmon) {
					this.usage("ERROR: 請求年月に2年以上前の年月を指定することはできません(" + billdate + ")", this.dbh);
				} else if (24 <= diffmon) {
					this.usage("ERROR: 請求年月に未来を指定することはできません(" + billdate + ")", this.dbh);
				}

				this.H_argv.billdate = billdate;
				continue;
			}

// 2022cvt_019
			// if (-1 !== this.checkList.indexOf("p") && preg_match("/^-p=/", this.H_argv[i])) {
			if (-1 !== this.checkList.indexOf("p") && this.H_argv[i].match("/^-p=/")) {
// 2022cvt_015
				// var pactarg = ereg_replace("^-p=", "", this.H_argv[i]).toLowerCase();
				var pactarg = this.H_argv[i].replace("^-p=", "").toLowerCase();

				// if (false == ereg("^all$", pactarg) && false == ereg("^[0-9]+$", pactarg)) {
				if (false == pactarg.match("^all$") && false == pactarg.match("^[0-9]+$")) {
					this.usage("ERROR: 契約IDの指定に誤りがあります", this.dbh);
				}

				this.H_argv.targetpact = pactarg;
				continue;
			}

// 2022cvt_019
			// if (-1 !== this.checkList.indexOf("b") && preg_match("/^-b=/", this.H_argv[i])) {
			if (-1 !== this.checkList.indexOf("b") && this.H_argv[i].match("/^-b=/")) {
// 2022cvt_015
				// var backup = ereg_replace("^-b=", "", this.H_argv[i]).toLowerCase();
				var backup = this.H_argv[i].replace("^-b=", "").toLowerCase();

				// if (false == ereg("^[ny]$", backup)) {
				if (false == backup.match("^[ny]$")) {
					this.usage("ERROR: バックアップの指定に誤りがあります", this.dbh);
				}

				this.H_argv.backup = backup;
				continue;
			}

// 2022cvt_019
            // if (-1 !== this.checkList.indexOf("a") && preg_match("/^-a=/", this.H_argv[i])) {
			if (-1 !== this.checkList.indexOf("a") && this.H_argv[i].match("/^-a=/")) {
// 2022cvt_015
				// var g_anbun = ereg_replace("^-a=", "", this.H_argv[i]).toLowerCase();
				var g_anbun = this.H_argv[i].replace("^-a=", "").toLowerCase();

				// if (false == ereg("^[ny]$", g_anbun)) {
				if (false == g_anbun.match("^[ny]$")) {
					this.usage("ERROR: 按分の指定に誤りがあります", this.dbh);
				}

				this.H_argv.anbun = g_anbun;
				continue;
			}
		}

		return true;
	}

	async checkAsp(pactid: string) {
// 2022cvt_015
		var sql = "SELECT count(*) FROM fnc_relation_tb WHERE pactid=" + pactid + " AND fncid=" + importBaseModel.FNC_ASP;

		if (0 == await this.dbh.getOne(sql, true)) {
			return false;
		} else {
			return true;
		}
	}

	convAnnoDomini(year: number) {
		return +(year + 1988);
	}

	getArgv() {
		return this.H_argv;
	}

	getDB() {
		return this.dbh;
	}

	getLog() {
		return this.logh;
	}

	getTableNo() {
// 2022cvt_015
		var O_table = new TableNo();
		this.tableno = O_table.get(this.H_argv.billdate.substring(0, 4), this.H_argv.billdate.substring(4, 2));
		return this.tableno;
	}

	getTable(name: any) {
		switch (name) {
			case "tel":
			case "telx":
			case "telX":
				return this.telX_tb;
				break;

			case "postrel":
			case "postrelx":
			case "postrelX":
				return this.postrelX_tb;
				break;

			case "teldetail":
			case "teldetailx":
			case "teldetailX":
				return this.teldetailX_tb;
				break;

			case "commhistory":
			case "commhistoryx":
			case "commhistoryX":
			case "commX":
			case "commx":
				return this.commhistory_tb;
				break;
		}
	}

	getTimestamp() {
		var tm = new Date();
		// var tm = localtime(Date.now() / 1000, true);
	// 2022cvt_015
		var yyyy = tm.getFullYear();
		// var yyyy = tm.tm_year + 1900;
	// 2022cvt_015
		var mm = (tm.getMonth() + 1).toString();
		// var mm = tm.tm_mon + 1;
		if (mm.length == 1) {
			mm = "0" + mm;
		}
		// if (mm < 10) mm = "0" + mm;
	// 2022cvt_015
		var dd = (tm.getDay() + 0).toString();
		// var dd = tm.tm_mday + 0;
		if (dd.length == 1) {
			dd = "0" + dd;
		}
		// if (dd < 10) dd = "0" + dd;
	// 2022cvt_015
		var hh = (tm.getHours() + 0).toString();
		// var hh = tm.tm_hour + 0;
		if (hh.length == 1) {
			hh = "0" + hh;
		}
		// if (hh < 10) hh = "0" + hh;
	// 2022cvt_015
		var nn = (tm.getMinutes() + 0).toString();
		// var nn = tm.tm_min + 0;
		if (nn.length == 1) {
			nn = "0" + nn;
		}
		// if (nn < 10) nn = "0" + nn;
	// 2022cvt_015
		var ss = (tm.getSeconds() + 0).toString();
		if (ss.length == 1) {
			ss = "0" + ss;
		}
		// var ss = tm.tm_sec + 0;
		// if (ss < 10) ss = "0" + ss;
    return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
	}

	getAsp(pactid: string, carid: string) {
// 2022cvt_015
		var sql = "SELECT charge FROM asp_charge_tb WHERE pactid=" + pactid + " AND carid=" + carid;
		return this.dbh.getOne(sql, true);
	}

	makeTelnoView(telno: string) {
		return telno.substring(0, 3) + "-" + telno.substring(3, 4) + "-" + telno.substring(7, 4);
	}

	setArgv(A_array: string[]) {
		this.H_argv = A_array;
	}

	setTableName() {
		this.getTableNo();
		this.telX_tb = "tel_" + this.tableno + "_tb";
		this.postrelX_tb = "post_relation_" + this.tableno + "_tb";
		this.teldetailX_tb = "tel_details_" + this.tableno + "_tb";
		this.commhistory_tb = "commhistory_" + this.tableno + "_tb";
	}

	usage(comment: string, db: ScriptDB) {
		if ("" == comment) {
			comment = "パラメータが不正です";
		}

		console.log("\n" + comment + "\n\n");
		console.log("Usage) " + this.H_argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -a={Y|N}\n");
		console.log("\t\t-e モード\t\t(O:delete後COPY,A:追加)\n");
		console.log("\t\t-y 請求年月\t\t(YYYY:年, MM:月)\n");
		console.log("\t\t-p 契約ID\t\t(all:全顧客分を実行, PACTID:指定した契約IDのみ実行)\n");
		console.log("\t\t-b バックアップ\t(Y:バックアップする,N:バックアップしない)\n");
		console.log("\t\t-a 按分\t\t(Y:按分する,N:按分しない)\n");
		throw process.exit(1);// 2022cvt_009
	}

// 	__destruct() {}// 2022cvt_014

};
