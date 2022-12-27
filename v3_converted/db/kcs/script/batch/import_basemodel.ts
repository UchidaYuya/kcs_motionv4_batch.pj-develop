//==============================================================================
//機能：NTTcom番号明細・OCN・通話明細請求情報インポート
//
//procとかmodelとかややこしい名前がついてますが、作り方をclassにしただけで
//機能はV2時代の物を使っています(import_nttcom_wld*をベースに作ったため)
//
//作成：五十嵐
//==============================================================================
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

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
class importBaseModel {
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
		this.log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, this.dbLogFile);
		this.log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
		this.log_listener.PutListener(this.log_listener_type);
		this.log_listener.PutListener(this.log_listener_type2);
		this.logh = new ScriptLogAdaptor(this.log_listener, true);
		this.dbh = new ScriptDB(this.log_listener);
		this.checkList = ["e", "y", "p", "b", "a"];
	}

	checkArgv(cnt) {
		if (this.H_argv.length != cnt) {
			this.usage("", this.dbh);
			throw die(1);
		}

		return true;
	}

	checkDigit(str) {
		if (1 == str.length) {
			str = "0" + str;
		}

		return str;
	}

	setArgvCheckList(array) {
		this.checkList = array;
	}

	getArgvCheckList() {
		return this.checkList;
	}

	checkArgvDetail() {
		var argmax = this.H_argv.length;

		for (var i = 1; i < argmax; i++) //mode
		{
			if (-1 !== this.checkList.indexOf("e") && preg_match("/^-e=/", this.H_argv[i])) {
				var mode = ereg_replace("^-e=", "", this.H_argv[i]).toLowerCase();

				if (false == ereg("^[ao]$", mode)) {
					this.usage("ERROR: \u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", this.dbh);
				}

				this.H_argv.erase = mode;
				continue;
			}

			if (-1 !== this.checkList.indexOf("y") && preg_match("/^-y=/", this.H_argv[i])) {
				var billdate = ereg_replace("^-y=", "", this.H_argv[i]);

				if (false == ereg("^[0-9]{6}$", billdate)) {
					this.usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u306B\u8AA4\u308A\u304C\u3042\u308A\u307E\u3059", this.dbh);
				} else {
					var year = billdate.substr(0, 4);
					var month = billdate.substr(4, 2);

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						this.usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u306B\u8AA4\u308A\u304C\u3042\u308A\u307E\u3059", this.dbh);
					}
				}

				var diffmon = (date("Y") - year) * 12 + (date("m") - month);

				if (0 > diffmon) {
					this.usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B2\u5E74\u4EE5\u4E0A\u524D\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")", this.dbh);
				} else if (24 <= diffmon) {
					this.usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\u672A\u6765\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")", this.dbh);
				}

				this.H_argv.billdate = billdate;
				continue;
			}

			if (-1 !== this.checkList.indexOf("p") && preg_match("/^-p=/", this.H_argv[i])) {
				var pactarg = ereg_replace("^-p=", "", this.H_argv[i]).toLowerCase();

				if (false == ereg("^all$", pactarg) && false == ereg("^[0-9]+$", pactarg)) {
					this.usage("ERROR: \u5951\u7D04ID\u306E\u6307\u5B9A\u306B\u8AA4\u308A\u304C\u3042\u308A\u307E\u3059", this.dbh);
				}

				this.H_argv.targetpact = pactarg;
				continue;
			}

			if (-1 !== this.checkList.indexOf("b") && preg_match("/^-b=/", this.H_argv[i])) {
				var backup = ereg_replace("^-b=", "", this.H_argv[i]).toLowerCase();

				if (false == ereg("^[ny]$", backup)) {
					this.usage("ERROR: \u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u306B\u8AA4\u308A\u304C\u3042\u308A\u307E\u3059", this.dbh);
				}

				this.H_argv.backup = backup;
				continue;
			}

			if (-1 !== this.checkList.indexOf("a") && preg_match("/^-a=/", this.H_argv[i])) {
				var g_anbun = ereg_replace("^-a=", "", this.H_argv[i]).toLowerCase();

				if (false == ereg("^[ny]$", g_anbun)) {
					this.usage("ERROR: \u6309\u5206\u306E\u6307\u5B9A\u306B\u8AA4\u308A\u304C\u3042\u308A\u307E\u3059", this.dbh);
				}

				this.H_argv.anbun = g_anbun;
				continue;
			}
		}

		return true;
	}

	checkAsp(pactid) {
		var sql = "SELECT count(*) FROM fnc_relation_tb WHERE pactid=" + pactid + " AND fncid=" + importBaseModel.FNC_ASP;

		if (0 == this.dbh.getOne(sql, true)) {
			return false;
		} else {
			return true;
		}
	}

	convAnnoDomini(year) {
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
		var O_table = new TableNo();
		this.tableno = O_table.get(this.H_argv.billdate.substr(0, 4), this.H_argv.billdate.substr(4, 2));
		return this.tableno;
	}

	getTable(name) {
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
		var tm = localtime(Date.now() / 1000, true);
		var year = tm.tm_year + 1900;
		var month = this.checkDigit(tm.tm_mon + 1);
		var day = this.checkDigit(tm.tm_mday + 0);
		var hour = this.checkDigit(tm.tm_hour + 0);
		var min = this.checkDigit(tm.tm_min + 0);
		var sec = this.checkDigit(tm.tm_sec + 0);
		return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + "+09";
	}

	getAsp(pactid, carid) {
		var sql = "SELECT charge FROM asp_charge_tb WHERE pactid=" + pactid + " AND carid=" + carid;
		return this.dbh.getOne(sql, true);
	}

	makeTelnoView(telno) {
		return telno.substr(0, 3) + "-" + telno.substr(3, 4) + "-" + telno.substr(7, 4);
	}

	setArgv(A_array) {
		this.H_argv = A_array;
	}

	setTableName() {
		this.getTableNo();
		this.telX_tb = "tel_" + this.tableno + "_tb";
		this.postrelX_tb = "post_relation_" + this.tableno + "_tb";
		this.teldetailX_tb = "tel_details_" + this.tableno + "_tb";
		this.commhistory_tb = "commhistory_" + this.tableno + "_tb";
	}

	usage(comment, db) {
		if ("" == comment) {
			comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
		}

		print("\n" + comment + "\n\n");
		print("Usage) " + this.H_argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -a={Y|N}\n");
		print("\t\t-e \u30E2\u30FC\u30C9\t\t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
		print("\t\t-y \u8ACB\u6C42\u5E74\u6708\t\t(YYYY:\u5E74, MM:\u6708)\n");
		print("\t\t-p \u5951\u7D04ID\t\t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C, PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04ID\u306E\u307F\u5B9F\u884C)\n");
		print("\t\t-b \u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\t(Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
		print("\t\t-a \u6309\u5206\t\t(Y:\u6309\u5206\u3059\u308B,N:\u6309\u5206\u3057\u306A\u3044)\n");
		throw die(1);
	}

	__destruct() {}

};