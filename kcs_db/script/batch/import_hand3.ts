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

	initializeCarrier(carid, H_hand_kamoku) //内訳コードの読込
	{
		if (!(undefined !== this.utiwake_tb[carid])) //ASPとASXいれた
			{
				H_hand_kamoku.ASP = "ASP";
				H_hand_kamoku.ASX = "ASX";
				this.utiwake_tb[carid] = this.get_utiwake_info(carid, Object.keys(H_hand_kamoku));
			}
	}

	getTaxKubun(carid: number, code: string) //キャリアの内訳コードが読み込まれている？
	//内訳コード登録されている？
	//iniに税区分設定されてる？
	{
		var utiwake;

		if (!this.utiwake_tb[carid]) //ない
			{
				return "";
			}

		utiwake = this.utiwake_tb[carid];

		if (!(undefined !== utiwake[code])) //ない
			{
				return "";
			}

		var ini;

		if (undefined !== this.ini[carid]) {
			ini = this.ini[carid];
		} else if (undefined !== this.ini[0]) {
			ini = this.ini[0];
		} else //デフォルト値もないし、キャリアの設定もない
			{
				return "";
			}

		if (!(undefined !== ini.tax_kubun)) //ない
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

if (process.argv.length != 6) //数が正しくない
	{
		usage("");
	} else //数が正しい
	//$cnt 0 はスクリプト名のため無視
	{
		var argvCnt = process.argv.length;

		for (var cnt = 1; cnt < argvCnt; cnt++) //mode を取得
		{
			if (process.argv[cnt].match("^-e=")) //モード文字列チェック
				{
					let mode = process.argv[cnt].replace("^-e=", "").toLowerCase();

					if (!mode.match("^[ao]$")) {
						usage("モードの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match("^-y=")) //請求年月文字列チェック
				{
					var billdate = process.argv[cnt].replace("^-y=", "");

					if (!billdate.match("^[0-9]{6}$")) {
						usage("請求年月の指定が不正です。" + process.argv[cnt]);
					} else //年月チェック
						{
							let year = parseInt(billdate.substring(0, 4))
							let month = parseInt(billdate.substring(4, 2))

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("請求年月の指定が不正です。" + process.argv[cnt]);
							}
						}

					continue;
				}

			if (process.argv[cnt].match("^-p=")) //契約ＩＤチェック
				{
					let pactid = process.argv[cnt].replace("^-p=", "").toLowerCase();

					if (!pactid.match("^all$") && !pactid.match("^[0-9]+$")) {
						usage("会社コードの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match("^-b=")) //バックアップの有無のチェック
				{
					let backup: string = process.argv[cnt].replace("^-b=", "").toLowerCase();

					if (!backup.match("^[ny]$")) {
						usage("バックアップの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match("^-t=") == null) {
				let target = process.argv[cnt].replace("^-t=", "").toLowerCase();

				if (target.match("^[no]$") == null) {
					usage("対象月の（最新/過去）の指定が不正です。" + process.argv[cnt]);
				}

				continue;
			}

			usage("パラメータの指定が不正です。" + process.argv[0]);
		}
	}

logh.putError(G_SCRIPT_BEGIN, "import_hand.php 手入力請求データ取込処理 処理を開始します");
(async () => {
let year;
let month;
var dataDir = DATA_DIR + "/" +  year + month + HAND_DIR;
let pactid;
if (pactid == "all") {
	if (fs.existsSync(dataDir) == false) //エラー終了
		{
			logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 手入力請求データディレクトリ（" + dataDir + "）がみつかりません");
			throw process.exit(1);
		}
} else {
	if (fs.existsSync(dataDir + "/" + pactid) == false) //エラー終了.
		{
			logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 手入力請求データディレクトリ（" + dataDir + "/" + pactid + "）がみつかりません");
			throw process.exit(1);
		}
}

// clearstatcache();

if (pactid == "all") {
	var LocalLogFile = dataDir + "/importhand.log";
} else {
	LocalLogFile = dataDir + "/" + pactid + "/importhand.log";
}

if (DEBUG_FLG) logging("START: 手入力請求データ取込処理(import_hand.php)を開始します");
var A_pactid = Array();

if (pactid == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{
		var fileName;
		var dirh = fs.readdirSync(dataDir);

		while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		{
			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {
				A_pactid.push(fileName);
				if (DEBUG_FLG) logging("INFO: 対象ディレクトリ " + fileName);
			}

			// clearstatcache();
		}

		// closedir(dirh);
	} else {
	A_pactid.push(pactid);
	if (DEBUG_FLG) logging("INFO: 対象ディレクトリ " + pactid);
}

var pactCnt = A_pactid.length;
A_pactid.sort();

if (pactCnt == 0) //エラー終了
	{
		if (DEBUG_FLG) logging("ERROR: Pact用データディレクトリが１つもありません");
		logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 Pact用データディレクトリが１つもありません");
		throw process.exit(1);
	}

// var ini_carrier = parse_ini_file(KCS_DIR + "/conf_sync/import_hand_carrier.ini", true); // 一旦コメンアウト
let ini_carrier; 
let lock_boolean = await lock(true, dbh)
if (lock_boolean == false) {
	if (DEBUG_FLG) logging("ERROR: 既に起動しています1");
	logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理  既に起動しています2");
	throw process.exit(1);
}

const O_tableNo = new TableNo();
const tableNo = O_tableNo.get(year, month);
const telX_tb = "tel_" + tableNo + "_tb";
const teldetailX_tb = "tel_details_" + tableNo + "_tb";
if (DEBUG_FLG) logging("INFO: 対象テーブル " + telX_tb + " & " + teldetailX_tb);
const tel_xx_filename = dataDir + "/" + telX_tb + year + month + pactid + ".ins";
const tel_xx_fp = fs.openSync(tel_xx_filename, "w");

if (tel_xx_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + tel_xx_filename + "のオープン失敗");
	logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + tel_xx_filename + "のオープン失敗");
	throw process.exit(1);
}

if (DEBUG_FLG) logging("INFO: tel_tbへのcopy文ファイルOPEN " + tel_xx_filename);
if (target == "n") {
	let tel_filename = dataDir + "/tel_tb" + year + month + pactid + ".ins";
	var tel_fp = fs.openSync(tel_filename, "w");

	if (tel_fp == undefined) {
		if (DEBUG_FLG) logging("ERROR: " + tel_fp + "のオープン失敗");
		logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + tel_fp + "のオープン失敗");
		throw process.exit(1);
	}

	if (DEBUG_FLG) logging("INFO: tel_tbへのcopy文ファイルOPEN " + tel_filename);
}

var teldetail_filename = dataDir + "/" + teldetailX_tb + year + month + pactid + ".ins";
var teldetail_fp = fs.openSync(teldetail_filename, "w");

if (teldetail_fp == undefined) {
	if (DEBUG_FLG) logging("ERROR: " + teldetail_filename + "のオープン失敗");
	logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + teldetail_filename + "のオープン失敗");
	throw process.exit(1);
}

if (DEBUG_FLG) logging("INFO: tel_details_XX_tbへのcopy文ファイルOPEN " + teldetail_filename);
var SOUMU_result = await dbh.getHash("select telno6, arid, carid from soumu_tel_tb;", true);
var soumu_cnt = SOUMU_result.length;
var soumu_tbl;
for (cnt = 0; cnt < soumu_cnt; cnt++) {
	soumu_tbl[SOUMU_result[cnt].telno6][0] = SOUMU_result[cnt].arid;
	soumu_tbl[SOUMU_result[cnt].telno6][1] = SOUMU_result[cnt].carid;
}

if (DEBUG_FLG) logging("INFO: 総務省のデータ取得 " + "select telno6, arid, carid from soumu_tel_tb;");
var import_hand = new ImportHand(dbh);
var fin_cnt = 0;

for (cnt = 0; cnt < pactCnt; cnt++) //対象会社の会社名を取得
{
	var out_rec_cnt = 0;
	var error_flg = false;
	var write_buf = "";
	var tel_xx_write_buf = "";
	var tel_write_buf = "";
	var PACT_result = await dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) logging("WARNING:  対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: 対象会社の会社名を取得 " + PACT_result);
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "のデータの処理を開始します");
	logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 処理を開始します");
	var A_billFile = Array();
	var dataDirPact = dataDir + "/" + A_pactid[cnt];
	dirh = fs.readdirSync(dataDirPact);

	while (fileName = fs.readdirSync(dirh)) {
		if (fs.statSync(dataDirPact + "/" + fileName).isDirectory() == true && fileName.match("/\\.csv$/i") == true) {
			A_billFile.push(fileName);
			if (DEBUG_FLG) logging("INFO: 対象請求データファイル名 " + fileName);
		}

		// clearstatcache();
	}

	// closedir(dirh);
	var fileCnt = A_billFile.length;

	if (fileCnt == 0) {
		if (DEBUG_FLG) logging("WARNING: WARNING: 対象ファイルがみつかりません（" + dataDirPact + "）");
		logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 対象ファイルがみつかりません（" + dataDirPact + "）");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: 対象請求データファイル数 " + fileCnt);
	var TEL_result = await dbh.getHash("select telno,carid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	if (DEBUG_FLG) logging("INFO: 対象会社の登録電話のリストを取得 " + TEL_result.length + "件 select telno,carid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");

	if (target == "n") //$TEL_now_result = $dbh->getCol("select telno from tel_tb where pactid = " . $dbh->escape($A_pactid[$cnt]) . " ;" , true);
		//if(DEBUG_FLG) logging( "INFO: 最新の登録電話のリストを取得 " . count($TEL_now_result) . "件 select telno,carid from tel_tb where pactid = " . $dbh->escape($A_pactid[$cnt]) . " ;" );
		//キャリアIDを見ていなかったので修正 20071009miya
		{
			let TEL_now_result = await dbh.getHash("select telno,carid from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
			if (DEBUG_FLG) logging("INFO: 最新の登録電話のリストを取得 " + TEL_now_result.length + "件 select telno,carid from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		}

	var trg_post = await dbh.getOne("select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;", true);

	if (trg_post == "") {
		if (DEBUG_FLG) logging("WARNING: ルート部署が正しく登録されていません" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
		logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ルート部署が正しく登録されていません");
		continue;
	}

	if (DEBUG_FLG) logging("INFO: ルート部署のpostid取得 postid=" + trg_post + " select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
	var aspFlg = false;
	let chkAsp_dt = await chkAsp(dbh.escape(A_pactid[cnt]));
	if ((chkAsp_dt) == true) {
		aspFlg = true;
		if (DEBUG_FLG) logging("INFO: ASP利用料表示設定がＯＮ");
		var asp_charge = await dbh.getHash("select carid, charge from asp_charge_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
		var asp_charge_cnt = asp_charge.length;

		for (var acnt = 0; acnt < asp_charge_cnt; acnt++) {
			asp_tbl[asp_charge[acnt].carid] = asp_charge[acnt].charge;
			if (DEBUG_FLG) logging("INFO: ASP利用料 " + asp_charge[acnt].carid + "=" + asp_charge[acnt].charge);
		}

		if (DEBUG_FLG) logging("INFO: ASP使用料取得");
	}

	var H_dummy_tel = await dbh.getHash("SELECT telno, carid FROM dummy_tel_tb WHERE pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	if (DEBUG_FLG) logging("INFO: ダミー電話番号取得");

	for (var fcnt = 0; fcnt < fileCnt; fcnt++) //対象ファイルオープン
	//パラメータとファイルの内容に差異がないかチェック
	//PACTIDチェック
	//現在の日付を得る
	//レコード毎の処理
	{
		var infilename = dataDirPact + "/" + A_billFile[fcnt];
		var ifp =  fs.openSync(infilename, "r");

		if (ifp == undefined) {
			if (DEBUG_FLG) logging("WARNING: ファイルのOPENに失敗しました " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ファイルのOPENに失敗しました " + infilename);
			error_flg = true;
			break;
		}

		if (DEBUG_FLG) logging("INFO: 対象ファイル=" + infilename);
		var line = fs.readdirSync(ifp);
		var readbuff = line.split("\t");

		if (readbuff[0] != A_pactid[cnt]) {
			if (DEBUG_FLG) logging("WARNING: 契約IDが異なります " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 契約IDが異なります " + infilename);
			error_flg = true;
			break;
		}

		var inyear = readbuff[1].substr(0, 4);
		var inmonth = readbuff[1].substr(5, 2);

		if (inyear != year || inmonth != month) {
			if (DEBUG_FLG) logging("WARNING: 対象年月が異なります " + infilename);
			logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 対象年月が異なります " + infilename);
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

			if (-1 !== TEL_result.indexOf(H_needle) == false) //エリアコードと種別コードにデフォルト値をセット
				{
					if (undefined !== ini_carrier[readbuff[2]]) //iniに設定されているキャリア情報を取得する
						//総務省のデータと比較
						//tel_tbの存在チェック
						{
							var temp = ini_carrier[readbuff[2]];
							var area = temp.area;

							if (undefined !== temp.circuit070) {
								var circuit = readbuff[3].substr(0, 3) == "070" ? temp.circuit070 : temp.circuit;
							} else {
								circuit = temp.circuit;
							}

							if (undefined !== soumu_tbl[readbuff[3].substr(0, 6)] == true) {
								if (readbuff[2] == soumu_tbl[readbuff[3].substr(0, 6)][1]) //入力データとキャリアが同じ場合は総務省のデータからエリアコードを取得
									{
										area = soumu_tbl[readbuff[3].substr(0, 6)][0];
									}
							}

							var telno_view = readbuff[3];

							if (telno_view.match("/^0[789]0/") && telno_view.length >= 11) //070, 080, 090 のいずれかで始まっていたら"-"を入れ込む
								{
									telno_view = telno_view.substr(0, 3) + "-" + telno_view.substr(3, 4) + "-" + telno_view.substr(7);
								}

							var copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + readbuff[2] + "\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";
							tel_xx_write_buf += copy_buf;
							let TEL_now_result;
							if (target == "n") {
								if (-1 !== TEL_now_result.indexOf(H_needle) == false) //存在チェックの条件にcarid（$readbuff[2]も追加）20071009miya
									{
										copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + readbuff[2] + "\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";
										tel_write_buf += copy_buf;
									}
							}
						} else //未設定のキャリアIDの場合・・
						{
							if (DEBUG_FLG) {
								logging("WARNING: 予定外のキャリアコードです(" + H_needle.carid + ")" + " \"" + KCS_DIR + "/conf_sync/import_hand_carrier.ini\"に設定を追加してください " + infilename);
							}

							logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 予定外のキャリアコードです " + infilename);
							error_flg = true;
						}
				}

			var H_hand_kamoku = {
				h_basic: "基本料計",
				h_disbasic: "基本料割引",
				h_packetfix: "パケット定額料",
				h_talk_normal: "通話料 国内音声通話",
				h_talk_inter: "通話料 国際通話",
				h_talk_other: "通話料 その他",
				h_distalk: "通話料割引",
				h_com_mode: "通信料 パケットサービス",
				h_com_inter: "通信料 国際パケット通信",
				h_discom: "通信料割引",
				h_free: "無料通話・通信",
				h_exempt: "端末代金等（非課税）",
				h_include: "端末代金等（内税）",
				h_ex_other: "その他（非課税）",
				h_in_other: "その他（内税）",
				h_other: "その他計",
				h_tax: "消費税計"
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

			if (aspFlg == true) //ASP使用料を調べる
				{	
					var asp_tbl;
					if (undefined !== asp_tbl[readbuff[2]] == true) //ダミー電話番号のときはASP使用料をカウントしない（0にする）ように分岐を追加 20071009miya
						{
							var H_tel: any[string] = Array();
							H_tel.telno = readbuff[3];
							H_tel.carid = readbuff[2];
							var asp_is_counted = true;

							if (-1 !== H_dummy_tel.indexOf(H_tel) == true) {
								var asp_bill = 0;
								var asp_tax = 0;
								asp_is_counted = false;
								if (DEBUG_FLG) logging("INFO: ダミー電話番号につきASP使用料カウントせず pactid=" + A_pactid[cnt] + " carid=" + readbuff[2] + " telno=" + readbuff[3]);
							} else {
								asp_bill = asp_tbl[readbuff[2]];
								asp_tax = +(asp_bill * G_EXCISE_RATE);
							}
						} else {
						if (DEBUG_FLG) {
							logging("WARNING: ASP使用料が設定されていません " + infilename);
						}

						logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ASP使用料が設定されていません " + infilename);
						error_flg = true;
						area = 0;
						circuit = 0;
						break;
					}

					if (asp_is_counted == true) {
						tax_kubun = import_hand.getTaxKubun(carid, "ASP");
						viewcnt++;
						copy_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\t" + "ASP使用料" + "\t" + asp_bill + "\t" + viewcnt + "\t" + nowtime + "\t" + readbuff[2] + "\t" + tax_kubun + "\n";
						tax_kubun = import_hand.getTaxKubun(carid, "ASX");
						viewcnt++;
						copy_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASX + "\t" + "ASP使用料消費税" + "\t" + asp_tax + "\t" + viewcnt + "\t" + nowtime + "\t" + readbuff[2] + "\t" + tax_kubun + "\n";
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
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "件のデータの処理を行いました");
	logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "件の処理を行いました");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fs.closeSync(tel_xx_fp);
var target;
if (target == "n") {
	fs.closeSync(tel_fp);
}

fs.closeSync(teldetail_fp);

if (fin_cnt < 1) //２重起動ロック解除
	{
		lock(false, dbh);
		if (DEBUG_FLG) logging("ERROR: １件も成功しませんでした");
		logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 １件も成功しませんでした");
		throw process.exit(1);
	}
let backup;
let rtn;
if (backup == "y") //TEL_DETAILS_X_TBのバックアップ
	{
		var teldetailX_exp = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
		var sql_str = "select * from " + teldetailX_tb;
		rtn = await dbh.backup(teldetailX_exp, sql_str);

		if (rtn == false) {
			if (DEBUG_FLG) logging("ERROR: " + teldetailX_tb + "のデータエクスポートに失敗しました ");
			// if (DEBUG_FLG) logging("ERROR: " + teldetailX_tb + "のデータエクスポートに失敗しました " + rtn.userinfo);
			logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + teldetailX_tb + "のデータエクスポートに失敗しました" + teldetailX_exp);
		} else {
			if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "のデータエクスポートを行いました " + teldetailX_exp);
			logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + teldetailX_tb + "のデータエクスポートを行いました" + teldetailX_exp);
		}
	}

dbh.begin();
var mode;
if (mode == "o") //対象pactidを１つの文字列に変換
	{
		var pactin = "";
		var fin_pact;
		for (cnt = 0; cnt < fin_cnt; cnt++) {
			pactin += fin_pact[cnt] + ",";
		}

		pactin = pactin.replace(",","");
		dbh.query("delete from " + teldetailX_tb + " where pactid IN(" + pactin + ");", true);
		if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "の既存データの削除を行いました " + "delete from" + teldetailX_tb + " where pactid IN(" + pactin + ");");
		logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + teldetailX_tb + "の既存データの削除を行いました" + teldetailX_tb);
	}

if (fs.statSync(tel_xx_filename) != 0) //tel_X_tb へインポート
	//インポート失敗した場合
	{
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
		rtn = await doCopyInsert(telX_tb, tel_xx_filename, telX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + telX_tb + "のデータインポートに失敗しました " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + telX_tb + "のデータインポートに失敗しました " + rtn.userinfo);
				dbh.rollback();
				throw process.exit(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + telX_tb + "のデータインポートを行いました " + tel_xx_filename);
			logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + telX_tb + "のデータインポートを行いました " + tel_xx_filename);
		}
	}

if (target == "n") {
	let tel_filename;
	if (fs.statSync(tel_filename) != 0) //tel_tb へインポート
		{
			var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
			rtn = doCopyInsert("tel_tb", tel_filename, tel_col, dbh);

			if (rtn != 0) //ロールバック
				{
					if (DEBUG_FLG) logging("ERROR: TEL_TBのデータインポートに失敗しました " + rtn.userinfo);
					logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 TEL_TBのデータインポートに失敗しました " + rtn.userinfo);
					dbh.rollback();
					throw process.exit(1);
				} else {
				if (DEBUG_FLG) logging("INFO: TEL_TBのデータインポートを行いました " + tel_filename);
				logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 TEL_TBのデータインポートを行いました " + tel_filename);
			}
		}
}

if (fs.statSync(teldetail_filename) != 0) //tel_details_X_tb へインポート
	//インポート失敗した場合
	{
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "detailno", "recdate", "carid", "taxkubun"];
		rtn = doCopyInsert(teldetailX_tb, teldetail_filename, teldetailX_col, dbh);

		if (rtn != 0) //ロールバック
			{
				if (DEBUG_FLG) logging("ERROR: " + teldetailX_tb + "のデータインポートに失敗しました " + rtn.userinfo);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + teldetailX_tb + "のデータインポートに失敗しました " + rtn.userinfo);
				dbh.rollback();
				throw process.exit(1);
			} else {
			if (DEBUG_FLG) logging("INFO: " + teldetailX_tb + "のデータインポートを行いました " + teldetail_filename);
			logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + teldetailX_tb + "のデータインポートを行いました " + teldetail_filename);
		}
	}

dbh.commit();

for (cnt = 0; cnt < fin_cnt; cnt++) //ファイルの移動
{
	var finDir = dataDir + "/" + fin_pact[cnt] + "/fin";

	if (fs.existsSync(finDir) == false) //完了ディレクトリの作成
		{
			if (fs.mkdirSync(finDir, 700) == false) {
				if (DEBUG_FLG) logging("ERROR: 完了ディレクトリの作成に失敗しました " + finDir);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理  完了ディレクトリの作成に失敗しました " + finDir);
				throw process.exit(1);
			} else {
				if (DEBUG_FLG) logging("INFO: 完了ディレクトリの作成しました " + finDir);
				logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理  完了ディレクトリの作成しました " + finDir);
			}
		}

	// clearstatcache();
	dirh = fs.readdir(dataDir + "/" + fin_pact[cnt]);
		let copyfileName;
	while (copyfileName = fs.readdir(dirh)) {
		if (fs.statSync(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName).isDirectory() == true && copyfileName.match("/\\.csv$/i") == true) {
			if (fs.renameSync(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName) == false) {
				if (DEBUG_FLG) logging("ERROR: ファイルの移動に失敗しました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理  ファイルの移動に失敗しました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				throw process.exit(1);
			} else {
				if (DEBUG_FLG) logging("INFO: ファイルの移動をしました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理  ファイルの移動をしました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			}
		}

		// clearstatcache();
	}

	// closedir(dirh);
}

lock(false, dbh);
console.log("手入力請求データ取込処理(import_hand.php)を終了しました。\n");
if (DEBUG_FLG) logging("END: 手入力請求データ取込処理(import_hand.php)を終了しました");
logh.putError(G_SCRIPT_END, "import_hand.php 手入力請求データ取込処理 処理を終了しました");
throw process.exit(0);
})();
async function doCopyInsert(table: string, filename: string, columns: string | any[], db: ScriptDB) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	if (!("logh" in global)) logh = undefined;
	var fp = fs.openSync(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_ERROR, filename + "のファイルオープン失敗.");
		return 1;
	}

	var ins:any = new TableInserter(logh, db, filename + ".sql", true);
	ins.begin(table);

	// while (line = fgets(fp)) //データはtab区切り
	fp = fs.readFileSync(filename);
	const text = Encoding.convert(fp, {
	from: 'SJIS',
	to: 'UNICODE', 
	type: 'string',
	});
	var lines  = text.toString().split('\r\n');
	for(var line of lines)
	//インサート行の追加
	{
		var A_line = line.replace("\n","").split("\t");

		if (A_line.length != columns.length) //要素数が異なっていたら
			{
				logh.putError(G_SCRIPT_ERROR, filename + "のデータ数が設定と異なります。データ=" + line);
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
			logh.putError(G_SCRIPT_ERROR, filename + "のインサート中にエラー発生、データ=" + line);
			fs.closeSync(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_ERROR, filename + "のインサート処理に失敗.");
		fs.closeSync(fp);
		return 1;
	}

	fs.closeSync(fp);
	return 0;
};

function usage(comment: string) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} -t={N|O}\n");
	console.log("\t\t-e モード \t(O:delete後COPY,A:追加)\n");
	console.log("\t\t-y 請求年月 \t(YYYY:年,MM:月)\n");
	console.log("\t\t-p 契約ＩＤ \t(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("\t\t-b バックパップ\t (Y:バックアップする,N:バックアップしない)\n");
	console.log("\t\t-t \対象月が最新/過去	(N:最新,O:過去) \n\n");
	throw process.exit(1);
};

async function lock(is_lock: boolean, db: ScriptDB) //ロックする
{
	if (db == undefined) {
		return false;
	}

	var pre = db.escape("batch_" + SCRIPT_FILENAME);

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command = '" + pre + "' and " + "status = 1;";
			var count = await db.getOne(sql);

			if (count != 0) {
				db.rollback();
				db.putError(G_SCRIPT_WARNING, "多重動作");
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
