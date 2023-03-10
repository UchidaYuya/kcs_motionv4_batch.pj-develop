import { KCS_DIR } from "../../conf/batch_setting";
import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";
import { G_AUTH_ASP, G_CODE_ASP, G_CODE_ASX, G_EXCISE_RATE } from "./lib/script_common";
import TableNo, { ScriptDB, TableInserter } from "./lib/script_db";
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "./lib/script_log";

export const DEBUG_FLG = 1;
export const SCRIPT_FILENAME = "import_hand.php";
export const HAND_DIR = "/hand";


const fs = require('fs')
const lockfile = require('proper-lockfile');
const Encoding = require('encoding-japanese');

const dbLogFile = DATA_LOG_DIR + "/billbat.log";
const log_listener = new ScriptLogBase(0);
const log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.putListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh: any = new ScriptLogAdaptor(log_listener, true);

export default class ImportHand {
	import_hand_ini: undefined;
	dbh: ScriptDB;
	utiwake_tb: any[];
	ini: any[];
	constructor(dbh: ScriptDB) {
		this.utiwake_tb = Array();
		this.import_hand_ini = undefined;
		this.ini = this.read_ini();
		this.dbh = dbh;
	}

	read_ini() {
		// var import_hand_ini = parse_ini_file(KCS_DIR + "/conf_sync/import_hand.ini", true);
		var import_hand_ini= Array() ;
		var res = Array();

		for (var carid in import_hand_ini) {
			var col = import_hand_ini[carid];
			var temp = Array();

			if (col.tax_kubun) {
				var kubun = col.tax_kubun.split(",");
				// temp.tax_kubun = kubun;
			}

			if (!!temp) {
				res[carid] = temp;
			}
		}

		return res;
	}

	get_utiwake_info(carid, utiwake) {
		var sql = "SELECT code,taxtype FROM utiwake_tb WHERE" + " carid=" + carid + " AND code IN (";
		var separate = "";

		for (var code of Object.values(utiwake)) {
			sql += separate + "'" + code + "'";
			separate = ",";
		}

		sql += ")";
		var result = this.dbh.getHash(sql);
		var res = Array();

		for (var key in result) {
			var value = result[key];
			res[value.code] = value;
		}

		return res;
	}

	initializeCarrier(carid, H_hand_kamoku) //????????????????????????
	{
		if (!(undefined !== this.utiwake_tb[carid])) //ASP???ASX?????????
			{
				H_hand_kamoku.ASP = "ASP";
				H_hand_kamoku.ASX = "ASX";
				this.utiwake_tb[carid] = this.get_utiwake_info(carid, Object.keys(H_hand_kamoku));
			}
	}

	getTaxKubun(carid: number, code: string) //????????????????????????????????????????????????????????????
	//???????????????????????????????????????
	//ini?????????????????????????????????
	{
		var utiwake;

		if (!this.utiwake_tb[carid]) //??????
			{
				return "";
			}

		utiwake = this.utiwake_tb[carid];

		if (!(undefined !== utiwake[code])) //??????
			{
				return "";
			}

		var ini;

		if (undefined !== this.ini[carid]) {
			ini = this.ini[carid];
		} else if (undefined !== this.ini[0]) {
			ini = this.ini[0];
		} else //???????????????????????????????????????????????????????????????
			{
				return "";
			}

		if (!(undefined !== ini.tax_kubun)) //??????
			{
				return "";
			}

		var taxtype = utiwake[code].taxtype;

		if (undefined !== ini.tax_kubun[taxtype]) {
			return ini.tax_kubun[taxtype];
		}

		return "";
	}

};

if (process.argv.length != 6) //?????????????????????
	{
		usage("");
	} else //???????????????
	//$cnt 0 ????????????????????????????????????
	{
		var argvCnt = process.argv.length;

		for (var cnt = 1; cnt < argvCnt; cnt++) //mode ?????????
		{
			if (process.argv[cnt].match("^-e=")) //??????????????????????????????
				{
					let mode = process.argv[cnt].replace("^-e=", "").toLowerCase();

					if (!mode.match("^[ao]$")) {
						usage("????????????????????????????????????" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match("^-y=")) //?????????????????????????????????
				{
					var billdate = process.argv[cnt].replace("^-y=", "");

					if (!billdate.match("^[0-9]{6}$")) {
						usage("???????????????????????????????????????" + process.argv[cnt]);
					} else //??????????????????
						{
							let year = parseInt(billdate.substring(0, 4))
							let month = parseInt(billdate.substring(4, 2))

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("???????????????????????????????????????" + process.argv[cnt]);
							}
						}

					continue;
				}

			if (process.argv[cnt].match("^-p=")) //????????????????????????
				{
					let pactid = process.argv[cnt].replace("^-p=", "").toLowerCase();

					if (!pactid.match("^all$") && !pactid.match("^[0-9]+$")) {
						usage("??????????????????????????????????????????" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match("^-b=")) //??????????????????????????????????????????
				{
					let backup: string = process.argv[cnt].replace("^-b=", "").toLowerCase();

					if (!backup.match("^[ny]$")) {
						usage("?????????????????????????????????????????????" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match("^-t=") == null) {
				let target = process.argv[cnt].replace("^-t=", "").toLowerCase();

				if (target.match("^[no]$") == null) {
					usage("?????????????????????/????????????????????????????????????" + process.argv[cnt]);
				}

				continue;
			}

			usage("??????????????????????????????????????????" + process.argv[0]);
		}
	}

logh.putError(G_SCRIPT_BEGIN, "import_hand.php ???????????????????????????????????? ????????????????????????");
(async () => {
let year;
let month;
var dataDir = DATA_DIR + "/" +  year + month + HAND_DIR;
let pactid;
if (pactid == "all") {
	if (fs.existsSync(dataDir) == false) //???????????????
		{
			logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? ?????????????????????????????????????????????" + dataDir + "???????????????????????????");
			throw process.exit(1);
		}
} else {
	if (fs.existsSync(dataDir + "/" + pactid) == false) //???????????????.
		{
			logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? ?????????????????????????????????????????????" + dataDir + "/" + pactid + "???????????????????????????");
			throw process.exit(1);
		}
}

// clearstatcache();

if (pactid == "all") {
	var LocalLogFile = dataDir + "/importhand.log";
} else {
	LocalLogFile = dataDir + "/" + pactid + "/importhand.log";
}

if (DEBUG_FLG) logging("START: ????????????????????????????????????(import_hand.php)??????????????????");
var A_pactid = Array();

if (pactid == "all") //???????????????????????????????????????
	//??????????????????????????????????????????
	{
		var fileName;
		var dirh = fs.readdirSync(dataDir);

		while (fileName = fs.readdir(dirh)) //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
		{
			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {
				A_pactid.push(fileName);
				if (DEBUG_FLG) logging("INFO: ???????????????????????? " + fileName);
			}

			// clearstatcache();
		}

		// closedir(dirh);
	} else {
	A_pactid.push(pactid);
	if (DEBUG_FLG) logging("INFO: ???????????????????????? " + pactid);
}

var pactCnt = A_pactid.length;
A_pactid.sort();

if (pactCnt == 0) //???????????????
	{
		if (DEBUG_FLG) logging("ERROR: Pact?????????????????????????????????????????????????????????");
		logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? Pact?????????????????????????????????????????????????????????");
		throw process.exit(1);
	}

// var ini_carrier = parse_ini_file(KCS_DIR + "/conf_sync/import_hand_carrier.ini", true); // ????????????????????????
let ini_carrier; 
let lock_boolean = await lock(true, dbh)
if (lock_boolean == false) {
	if (DEBUG_FLG) logging("ERROR: ???????????????????????????1");
	logh.putError(G_SCRIPT_ERROR, "import_hand.php ????????????????????????????????????  ???????????????????????????2");
	throw process.exit(1);
}

const O_tableNo = new TableNo();
const tableNo = O_tableNo.get(year, month);
const telX_tb = "tel_" + tableNo + "_tb";
const teldetailX_tb = "tel_details_" + tableNo + "_tb";
if (DEBUG_FLG) logging("INFO: ?????????????????? " + telX_tb + " & " + teldetailX_tb);
const tel_xx_filename = dataDir + "/" + telX_tb + year + month + pactid + ".ins";
const tel_xx_fp = fs.openSync(tel_xx_filename, "w");

if (tel_xx_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + tel_xx_filename + "?????????????????????");
	logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? " + tel_xx_filename + "?????????????????????");
	throw process.exit(1);
}

if (DEBUG_FLG) logging("INFO: tel_tb??????copy???????????????OPEN " + tel_xx_filename);
if (target == "n") {
	let tel_filename = dataDir + "/tel_tb" + year + month + pactid + ".ins";
	var tel_fp = fs.openSync(tel_filename, "w");

	if (tel_fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + tel_fp + "?????????????????????");
		logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? " + tel_fp + "?????????????????????");
		throw process.exit(1);
	}

	if (DEBUG_FLG) logging("INFO: tel_tb??????copy???????????????OPEN " + tel_filename);
}

var teldetail_filename = dataDir + "/" + teldetailX_tb + year + month + pactid + ".ins";
var teldetail_fp = fs.openSync(teldetail_filename, "w");

if (teldetail_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + teldetail_filename + "?????????????????????");
	logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? " + teldetail_filename + "?????????????????????");
	throw process.exit(1);
}

if (DEBUG_FLG) logging("INFO: tel_details_XX_tb??????copy???????????????OPEN " + teldetail_filename);
var SOUMU_result = await dbh.getHash("select telno6, arid, carid from soumu_tel_tb;", true);
var soumu_cnt = SOUMU_result.length;
var soumu_tbl;
for (cnt = 0; cnt < soumu_cnt; cnt++) {
	soumu_tbl[SOUMU_result[cnt].telno6][0] = SOUMU_result[cnt].arid;
	soumu_tbl[SOUMU_result[cnt].telno6][1] = SOUMU_result[cnt].carid;
}

if (DEBUG_FLG) logging("INFO: ??????????????????????????? " + "select telno6, arid, carid from soumu_tel_tb;");
var import_hand = new ImportHand(dbh);
var fin_cnt = 0;

for (cnt = 0; cnt < pactCnt; cnt++) //?????????????????????????????????
{
	var out_rec_cnt = 0;
	var error_flg = false;
	var write_buf = "";
	var tel_xx_write_buf = "";
	var tel_write_buf = "";
	var PACT_result = await dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) logging("WARNING:  ????????????????????????" + A_pactid[cnt] + "?????????????????????????????????");
		logh.putError(G_SCRIPT_WARNING, "import_hand.php ???????????????????????????????????? ????????????????????????" + A_pactid[cnt] + "?????????????????????????????????");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: ????????????????????????????????? " + PACT_result);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "???????????????????????????????????????");
	logh.putError(G_SCRIPT_INFO, "import_hand.php ???????????????????????????????????? " + PACT_result + " " + A_pactid[cnt] + " ????????????????????????");
	var A_billFile = Array();
	var dataDirPact = dataDir + "/" + A_pactid[cnt];
	dirh = fs.readdirSync(dataDirPact);

	while (fileName = fs.readdirSync(dirh)) {
		if (fs.statSync(dataDirPact + "/" + fileName).isDirectory() == true && fileName.match("/\\.csv$/i") == true) {
			A_billFile.push(fileName);
			if (DEBUG_FLG) logging("INFO: ???????????????????????????????????? " + fileName);
		}

		// clearstatcache();
	}

	// closedir(dirh);
	var fileCnt = A_billFile.length;

	if (fileCnt == 0) {
		if (DEBUG_FLG) logging("WARNING: WARNING: ?????????????????????????????????????????????" + dataDirPact + "???");
		logh.putError(G_SCRIPT_WARNING, "import_hand.php ???????????????????????????????????? " + PACT_result + " " + A_pactid[cnt] + " ?????????????????????????????????????????????" + dataDirPact + "???");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: ???????????????????????????????????? " + fileCnt);
	var TEL_result = await dbh.getHash("select telno,carid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	if (DEBUG_FLG) logging("INFO: ???????????????????????????????????????????????? " + TEL_result.length + "??? select telno,carid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");

	if (target == "n") //$TEL_now_result = $dbh->getCol("select telno from tel_tb where pactid = " . $dbh->escape($A_pactid[$cnt]) . " ;" , true);
		//if(DEBUG_FLG) logging( "INFO: ?????????????????????????????????????????? " . count($TEL_now_result) . "??? select telno,carid from tel_tb where pactid = " . $dbh->escape($A_pactid[$cnt]) . " ;" );
		//????????????ID???????????????????????????????????? 20071009miya
		{
			let TEL_now_result = await dbh.getHash("select telno,carid from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
			if (DEBUG_FLG) logging("INFO: ?????????????????????????????????????????? " + TEL_now_result.length + "??? select telno,carid from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		}

	var trg_post = await dbh.getOne("select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;", true);

	if (trg_post == "") {
		if (DEBUG_FLG) logging("WARNING: ??????????????????????????????????????????????????????" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
		logh.putError(G_SCRIPT_WARNING, "import_hand.php ???????????????????????????????????? " + PACT_result + " " + A_pactid[cnt] + " ??????????????????????????????????????????????????????");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: ??????????????????postid?????? postid=" + trg_post + " select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
	var aspFlg = false;
	let chkAsp_dt = await chkAsp(dbh.escape(A_pactid[cnt]));
	if ((chkAsp_dt) == true) {
		aspFlg = true;
		if (DEBUG_FLG) logging("INFO: ASP??????????????????????????????");
		var asp_charge = await dbh.getHash("select carid, charge from asp_charge_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
		var asp_charge_cnt = asp_charge.length;

		for (var acnt = 0; acnt < asp_charge_cnt; acnt++) {
			asp_tbl[asp_charge[acnt].carid] = asp_charge[acnt].charge;
			if (DEBUG_FLG) logging("INFO: ASP????????? " + asp_charge[acnt].carid + "=" + asp_charge[acnt].charge);
		}

		if (DEBUG_FLG) logging("INFO: ASP???????????????");
	}

	var H_dummy_tel = await dbh.getHash("SELECT telno, carid FROM dummy_tel_tb WHERE pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	if (DEBUG_FLG) logging("INFO: ???????????????????????????");

	for (var fcnt = 0; fcnt < fileCnt; fcnt++) //??????????????????????????????
	//????????????????????????????????????????????????????????????????????????
	//PACTID????????????
	//????????????????????????
	//????????????????????????
	{
		var infilename = dataDirPact + "/" + A_billFile[fcnt];
		var ifp =  fs.openSync(infilename, "r");

		if (ifp == undefined) {
			if (DEBUG_FLG) logging("WARNING: ???????????????OPEN????????????????????? " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_hand.php ???????????????????????????????????? " + PACT_result + " " + A_pactid[cnt] + " ???????????????OPEN????????????????????? " + infilename);
			error_flg = true;
			break;
		}

		if (DEBUG_FLG) logging("INFO: ??????????????????=" + infilename);
		var line = fs.readdirSync(ifp);
		var readbuff = line.split("\t");

		if (readbuff[0] != A_pactid[cnt]) {
			if (DEBUG_FLG) logging("WARNING: ??????ID?????????????????? " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_hand.php ???????????????????????????????????? " + PACT_result + " " + A_pactid[cnt] + " ??????ID?????????????????? " + infilename);
			error_flg = true;
			break;
		}

		var inyear = readbuff[1].substr(0, 4);
		var inmonth = readbuff[1].substr(5, 2);

		if (inyear != year || inmonth != month) {
			if (DEBUG_FLG) logging("WARNING: ?????????????????????????????? " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_hand.php ???????????????????????????????????? " + PACT_result + " " + A_pactid[cnt] + " ?????????????????????????????? " + infilename);
			error_flg = true;
			break;
		}

		var nowtime = getTimestamp();
		
		do 
		{
			out_rec_cnt++;
			readbuff = line.replace("\r\n","");
			var H_needle: any[string] = Array();
			H_needle.telno = readbuff[3];
			H_needle.carid = readbuff[2];

			if (-1 !== TEL_result.indexOf(H_needle) == false) //?????????????????????????????????????????????????????????????????????
				{
					if (undefined !== ini_carrier[readbuff[2]]) //ini?????????????????????????????????????????????????????????
						//??????????????????????????????
						//tel_tb?????????????????????
						{
							var temp = ini_carrier[readbuff[2]];
							var area = temp.area;

							if (undefined !== temp.circuit070) {
								var circuit = readbuff[3].substr(0, 3) == "070" ? temp.circuit070 : temp.circuit;
							} else {
								circuit = temp.circuit;
							}

							if (undefined !== soumu_tbl[readbuff[3].substr(0, 6)] == true) {
								if (readbuff[2] == soumu_tbl[readbuff[3].substr(0, 6)][1]) //??????????????????????????????????????????????????????????????????????????????????????????????????????
									{
										area = soumu_tbl[readbuff[3].substr(0, 6)][0];
									}
							}

							var telno_view = readbuff[3];

							if (telno_view.match("/^0[789]0/") && telno_view.length >= 11) //070, 080, 090 ???????????????????????????????????????"-"???????????????
								{
									telno_view = telno_view.substr(0, 3) + "-" + telno_view.substr(3, 4) + "-" + telno_view.substr(7);
								}

							var copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + readbuff[2] + "\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";
							tel_xx_write_buf += copy_buf;
							let TEL_now_result;
							if (target == "n") {
								if (-1 !== TEL_now_result.indexOf(H_needle) == false) //??????????????????????????????carid???$readbuff[2]????????????20071009miya
									{
										copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + readbuff[2] + "\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";
										tel_write_buf += copy_buf;
									}
							}
						} else //????????????????????????ID???????????????
						{
							if (DEBUG_FLG) {
								logging("WARNING: ???????????????????????????????????????(" + H_needle.carid + ")" + " \"" + KCS_DIR + "/conf_sync/import_hand_carrier.ini\"???????????????????????????????????? " + infilename);
							}

							logh.putError(G_SCRIPT_WARNING, "import_hand.php ???????????????????????????????????? " + PACT_result + " " + A_pactid[cnt] + " ??????????????????????????????????????? " + infilename);
							error_flg = true;
						}
				}

			var H_hand_kamoku = {
				h_basic: "????????????",
				h_disbasic: "???????????????",
				h_packetfix: "?????????????????????",
				h_talk_normal: "????????? ??????????????????",
				h_talk_inter: "????????? ????????????",
				h_talk_other: "????????? ?????????",
				h_distalk: "???????????????",
				h_com_mode: "????????? ????????????????????????",
				h_com_inter: "????????? ????????????????????????",
				h_discom: "???????????????",
				h_free: "?????????????????????",
				h_exempt: "??????????????????????????????",
				h_include: "???????????????????????????",
				h_ex_other: "????????????????????????",
				h_in_other: "?????????????????????",
				h_other: "????????????",
				h_tax: "????????????"
			};
			var carid = readbuff[2];
			import_hand.initializeCarrier(carid, H_hand_kamoku);
			var viewcnt = 1;
			copy_buf = "";
			var idx = 4;

			for (var h_code in H_hand_kamoku) {
				var h_name = H_hand_kamoku[h_code];

				if (readbuff[idx] != "") {
					var tax_kubun = import_hand.getTaxKubun(carid, h_code);
					copy_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + h_code + "\t" + h_name + "\t" + readbuff[idx] + "\t" + viewcnt + "\t" + nowtime + "\t" + readbuff[2] + "\t" + tax_kubun + "\n";
					viewcnt++;
				}

				idx++;
			}

			if (aspFlg == true) //ASP?????????????????????
				{	
					var asp_tbl;
					if (undefined !== asp_tbl[readbuff[2]] == true) //?????????????????????????????????ASP????????????????????????????????????0???????????????????????????????????? 20071009miya
						{
							var H_tel: any[string] = Array();
							H_tel.telno = readbuff[3];
							H_tel.carid = readbuff[2];
							var asp_is_counted = true;

							if (-1 !== H_dummy_tel.indexOf(H_tel) == true) {
								var asp_bill = 0;
								var asp_tax = 0;
								asp_is_counted = false;
								if (DEBUG_FLG) logging("INFO: ??????????????????????????????ASP??????????????????????????? pactid=" + A_pactid[cnt] + " carid=" + readbuff[2] + " telno=" + readbuff[3]);
							} else {
								asp_bill = asp_tbl[readbuff[2]];
								asp_tax = +(asp_bill * G_EXCISE_RATE);
							}
						} else {
						if (DEBUG_FLG) {
							logging("WARNING: ASP??????????????????????????????????????? " + infilename);
						}

						logh.putError(G_SCRIPT_WARNING, "import_hand.php ???????????????????????????????????? " + PACT_result + " " + A_pactid[cnt] + " ASP??????????????????????????????????????? " + infilename);
						error_flg = true;
						area = 0;
						circuit = 0;
						break;
					}

					if (asp_is_counted == true) {
						tax_kubun = import_hand.getTaxKubun(carid, "ASP");
						viewcnt++;
						copy_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\t" + "ASP?????????" + "\t" + asp_bill + "\t" + viewcnt + "\t" + nowtime + "\t" + readbuff[2] + "\t" + tax_kubun + "\n";
						tax_kubun = import_hand.getTaxKubun(carid, "ASX");
						viewcnt++;
						copy_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASX + "\t" + "ASP??????????????????" + "\t" + asp_tax + "\t" + viewcnt + "\t" + nowtime + "\t" + readbuff[2] + "\t" + tax_kubun + "\n";
					}
				}

			if (copy_buf != "") {
				write_buf += copy_buf;
			}
		} 
		while (line = fs.createReadStream(ifp));
	}

	if (ifp == undefined) {
		fs.closeSync(ifp);
	}

	if (error_flg == true) {
		continue;
	}

	fs.writeSync(tel_xx_fp, tel_xx_write_buf);
	// fflush(tel_xx_fp);

	if (target == "n") {
		fs.writeSync(tel_fp, tel_write_buf);
		// fflush(tel_fp);
	}

	fs.writeFileSync(teldetail_fp, write_buf);
	fs.writeSync(teldetail_fp);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "??????????????????????????????????????????");
	logh.putError(G_SCRIPT_INFO, "import_hand.php ???????????????????????????????????? " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "??????????????????????????????");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fs.closeSync(tel_xx_fp);
var target;
if (target == "n") {
	fs.closeSync(tel_fp);
}

fs.closeSync(teldetail_fp);

if (fin_cnt < 1) //???????????????????????????
	{
		lock(false, dbh);
		if (DEBUG_FLG) logging("ERROR: ????????????????????????????????????");
		logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? ????????????????????????????????????");
		throw process.exit(1);
	}
let backup;
let rtn;
if (backup == "y") //TEL_DETAILS_X_TB?????????????????????
	{
		var teldetailX_exp = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
		var sql_str = "select * from " + teldetailX_tb;
		rtn = await dbh.backup(teldetailX_exp, sql_str);

		if (rtn == false) {
			if (DEBUG_FLG) logging("ERROR: " + teldetailX_tb + "??????????????????????????????????????????????????? ");
			// if (DEBUG_FLG) logging("ERROR: " + teldetailX_tb + "??????????????????????????????????????????????????? " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? " + teldetailX_tb + "???????????????????????????????????????????????????" + teldetailX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "???????????????????????????????????????????????? " + teldetailX_exp);
			logh.putError(G_SCRIPT_INFO, "import_hand.php ???????????????????????????????????? " + teldetailX_tb + "????????????????????????????????????????????????" + teldetailX_exp);
		}
	}

dbh.begin();
var mode;
if (mode == "o") //??????pactid??????????????????????????????
	{
		var pactin = "";
		var fin_pact;
		for (cnt = 0; cnt < fin_cnt; cnt++) {
			pactin += fin_pact[cnt] + ",";
		}

		pactin = pactin.replace(",","");
		dbh.query("delete from " + teldetailX_tb + " where pactid IN(" + pactin + ");", true);
		if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "????????????????????????????????????????????? " + "delete from" + teldetailX_tb + " where pactid IN(" + pactin + ");");
		logh.putError(G_SCRIPT_INFO, "import_hand.php ???????????????????????????????????? " + teldetailX_tb + "?????????????????????????????????????????????" + teldetailX_tb);
	}

if (fs.statSync(tel_xx_filename) != 0) //tel_X_tb ??????????????????
	//?????????????????????????????????
	{
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
		rtn = await doCopyInsert(telX_tb, tel_xx_filename, telX_col, dbh);

		if (rtn != 0) //??????????????????
			{
				if (DEBUG_FLG) logging("ERROR: " + telX_tb + "???????????????????????????????????????????????? " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? " + telX_tb + "???????????????????????????????????????????????? " + rtn.userinfo);
				dbh.rollback();
				throw process.exit(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + telX_tb + "????????????????????????????????????????????? " + tel_xx_filename);
			logh.putError(G_SCRIPT_INFO, "import_hand.php ???????????????????????????????????? " + telX_tb + "????????????????????????????????????????????? " + tel_xx_filename);
		}
	}

if (target == "n") {
	let tel_filename;
	if (fs.statSync(tel_filename) != 0) //tel_tb ??????????????????
		{
			var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
			rtn = doCopyInsert("tel_tb", tel_filename, tel_col, dbh);

			if (rtn != 0) //??????????????????
				{
					if (DEBUG_FLG) logging("ERROR: TEL_TB???????????????????????????????????????????????? " + rtn.userinfo);
					logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? TEL_TB???????????????????????????????????????????????? " + rtn.userinfo);
					dbh.rollback();
					throw process.exit(1);
				} else {
				if (DEBUG_FLG) logging("INFO: TEL_TB????????????????????????????????????????????? " + tel_filename);
				logh.putError(G_SCRIPT_INFO, "import_hand.php ???????????????????????????????????? TEL_TB????????????????????????????????????????????? " + tel_filename);
			}
		}
}

if (fs.statSync(teldetail_filename) != 0) //tel_details_X_tb ??????????????????
	//?????????????????????????????????
	{
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "detailno", "recdate", "carid", "taxkubun"];
		rtn = doCopyInsert(teldetailX_tb, teldetail_filename, teldetailX_col, dbh);

		if (rtn != 0) //??????????????????
			{
				if (DEBUG_FLG) logging("ERROR: " + teldetailX_tb + "???????????????????????????????????????????????? " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php ???????????????????????????????????? " + teldetailX_tb + "???????????????????????????????????????????????? " + rtn.userinfo);
				dbh.rollback();
				throw process.exit(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "????????????????????????????????????????????? " + teldetail_filename);
			logh.putError(G_SCRIPT_INFO, "import_hand.php ???????????????????????????????????? " + teldetailX_tb + "????????????????????????????????????????????? " + teldetail_filename);
		}
	}

dbh.commit();

for (cnt = 0; cnt < fin_cnt; cnt++) //?????????????????????
{
	var finDir = dataDir + "/" + fin_pact[cnt] + "/fin";

	if (fs.existsSync(finDir) == false) //?????????????????????????????????
		{
			if (fs.mkdirSync(finDir, 700) == false) {
				if (DEBUG_FLG) logging("ERROR: ?????????????????????????????????????????????????????? " + finDir);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php ????????????????????????????????????  ?????????????????????????????????????????????????????? " + finDir);
				throw process.exit(1);
			} else {
				if (DEBUG_FLG) logging("INFO: ????????????????????????????????????????????? " + finDir);
				logh.putError(G_SCRIPT_INFO, "import_hand.php ????????????????????????????????????  ????????????????????????????????????????????? " + finDir);
			}
		}

	// clearstatcache();
	dirh = fs.readdir(dataDir + "/" + fin_pact[cnt]);
		let copyfileName;
	while (copyfileName = fs.readdir(dirh)) {
		if (fs.statSync(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName).isDirectory() == true && copyfileName.match("/\\.csv$/i") == true) {
			if (fs.renameSync(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName) == false) {
				if (DEBUG_FLG) logging("ERROR: ?????????????????????????????????????????? " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php ????????????????????????????????????  ?????????????????????????????????????????? " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				throw process.exit(1);
			} else {
				if (DEBUG_FLG) logging("INFO: ???????????????????????????????????? " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_INFO, "import_hand.php ????????????????????????????????????  ???????????????????????????????????? " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			}
		}

		// clearstatcache();
	}

	// closedir(dirh);
}

lock(false, dbh);
console.log("????????????????????????????????????(import_hand.php)????????????????????????\n");
if (DEBUG_FLG) logging("END: ????????????????????????????????????(import_hand.php)?????????????????????");
logh.putError(G_SCRIPT_END, "import_hand.php ???????????????????????????????????? ???????????????????????????");
throw process.exit(0);
})();
async function doCopyInsert(table: string, filename: string, columns: string | any[], db: ScriptDB) //?????????????????????
//$ins->setDebug( true );
//???????????????????????????
//??????????????????????????????????????????????????????????????????????????????.
{
	if (!("logh" in global)) logh = undefined;
	var fp = fs.openSync(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_ERROR, filename + "?????????????????????????????????.");
		return 1;
	}

	var ins:any = new TableInserter(logh, db, filename + ".sql", true);
	ins.begin(table);

	// while (line = fgets(fp)) //????????????tab?????????
	fp = fs.readFileSync(filename);
	const text = Encoding.convert(fp, {
	from: 'SJIS',
	to: 'UNICODE', 
	type: 'string',
	});
	var lines  = text.toString().split('\r\n');
	for(var line of lines)
	//???????????????????????????
	{
		var A_line = line.replace("\n","").split("\t");

		if (A_line.length != columns.length) //?????????????????????????????????
			{
				logh.putError(G_SCRIPT_ERROR, filename + "??????????????????????????????????????????????????????=" + line);
				fs.closeSync(fp);
				return 1;
			}

		var H_ins = Array();
		var idx = 0;

		// for (var col of columns) {
		// 	H_ins[col] = A_line[idx];
		// 	idx++;
		// }

		if (await ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_ERROR, filename + "???????????????????????????????????????????????????=" + line);
			fs.closeSync(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_ERROR, filename + "?????????????????????????????????.");
		fs.closeSync(fp);
		return 1;
	}

	fs.closeSync(fp);
	return 0;
};

function usage(comment: string) {
	if (comment == "") {
		comment = "??????????????????????????????";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} -t={N|O}\n");
	console.log("\t\t-e ????????? \t(O:delete???COPY,A:??????)\n");
	console.log("\t\t-y ???????????? \t(YYYY:???,MM:???)\n");
	console.log("\t\t-p ???????????? \t(all:?????????????????????,PACTID:????????????????????????????????????)\n");
	console.log("\t\t-b ??????????????????\t (Y:????????????????????????,N:???????????????????????????)\n");
	console.log("\t\t-t \??????????????????/??????	(N:??????,O:??????) \n\n");
	throw process.exit(1);
};

async function lock(is_lock: boolean, db: ScriptDB) //???????????????
{
	if (db == undefined) {
		return false;
	}

	var pre = db.escape("batch_" + SCRIPT_FILENAME);

	if (is_lock == true) //???????????????
		//????????????????????????
		//???????????????
		{
			db.begin();
			db.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command = '" + pre + "' and " + "status = 1;";
			var count = await db.getOne(sql);

			if (count != 0) {
				db.rollback();
				db.putError(G_SCRIPT_WARNING, "????????????");
				return false;
			}

			var nowtime = getTimestamp();
			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + pre + "',1,'" + nowtime + "');";
			db.query(sql);
			db.commit();
		} else {
		db.begin();
		db.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + pre + "';";
		db.query(sql);
		db.commit();
	}

	return true;
};

function logging(lstr: string) {
	var log_buf = new Date().toISOString().replace(/T/, ' ').split("-").join("/").replace(/\..+/, '') + " : " + lstr + "\n";
	var lfp = fs.openSync(global.LocalLogFile, "a");
	lockfile.lock(lfp);
	fs.writeSync(lfp, log_buf);
	lockfile.unlock(lfp);
	fs.closeSync(lfp);
	return;
};

async function chkAsp(pactid: string) {
	// if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + G_AUTH_ASP;
	var count = await dbh.getOne(sql_str);

	if (count == 0) {
		return false;
	} else {
		return true;
	}
};

function getTimestamp() {
	// var tm = localtime(Date.now() / 1000, true);
	// var yyyy = tm.tm_year + 1900;
	// var mm = tm.tm_mon + 1;
	// if (mm < 10) mm = "0" + mm;
	// var dd = tm.tm_mday + 0;
	// if (dd < 10) dd = "0" + dd;
	// var hh = tm.tm_hour + 0;
	// if (hh < 10) hh = "0" + hh;
	// var nn = tm.tm_min + 0;
	// if (nn < 10) nn = "0" + nn;
	// var ss = tm.tm_sec + 0;
	// if (ss < 10) ss = "0" + ss;
	// return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
	return  new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') +'+09';
};
