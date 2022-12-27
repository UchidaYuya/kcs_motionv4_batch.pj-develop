import { BAT_DIR, DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";
import { G_AUTH_ASP, G_CODE_ASP, G_CODE_ASX, G_EXCISE_RATE } from "../batch/lib/script_common";
import TableNo, { ScriptDB, TableInserter } from "../batch/lib/script_db";
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../batch/lib/script_log";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as loadIniFile from "read-ini-file";
import { KCS_DIR } from "../../conf/batch_setting";
import * as flock from "proper-lockfile";

// 2022cvt_026
// require("lib/script_common.php");

// 2022cvt_026
// require(BAT_DIR + "/lib/script_db.php");

// 2022cvt_026
// require(BAT_DIR + "/lib/script_log.php");

(async () => {
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_hand.php";
const HAND_DIR = "/hand";

// 2022cvt_015
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
// 2022cvt_015
var log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 2022cvt_016
log_listener.putListener(log_listener_type);
// 2022cvt_015
var dbh = new ScriptDB(log_listener);
// 2022cvt_015
var logh = new ScriptLogAdaptor(log_listener, true);

var mode = "";
var billdate = "";
var year = 0;
var month = 0;
var pactid = "";
var backup = "";
var target = "";

if (process.argv.length != 6 + 1) //数が正しくない
	{
		usage("");
	} else //数が正しい
	//$cnt 0 はスクリプト名のため無視
	{
// 2022cvt_015
		var argvCnt = process.argv.length;

// 2022cvt_015
		for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
		{
			if (process.argv[cnt].match("^-e="))
			// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
				{
// 2022cvt_015
					mode = process.argv[cnt].replace("^-e=", "").toLowerCase();
					// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!mode.match("^[ao]$")) {
					// if (ereg("^[ao]$", mode) == false) {
						usage("モードの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match("^-y="))
			// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
				{
// 2022cvt_015
					billdate = process.argv[cnt].replace("^-y=", "");
					// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

					if (!billdate.match("^[0-9]{6}$")) {
					// if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("請求年月の指定が不正です。" + process.argv[cnt]);
					} else //年月チェック
						{
// 2022cvt_015
							year = parseInt(billdate.substring(0, 4));
// 2022cvt_015
							month = parseInt(billdate.substring(4, 2));

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("請求年月の指定が不正です。" + process.argv[cnt]);
							}
						}

					continue;
				}

			if (process.argv[cnt].match("^-p="))
			// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
				{
// 2022cvt_015
					pactid = process.argv[cnt].replace("^-p=", "").toLowerCase();
					// var pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!pactid.match("^all$") && !pactid.match("^[0-9]+$")) {
					// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("会社コードの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match("^-b="))
			// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
				{
// 2022cvt_015
					backup = process.argv[cnt].replace("^-b=", "").toLowerCase();
					// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!backup.match("^[ny]$")) {
					// if (ereg("^[ny]$", backup) == false) {
						usage("バックアップの指定が不正です。" + process.argv[cnt]);
					}

					continue;
				}

			if (process.argv[cnt].match("^-t=")) {
			// if (ereg("^-t=", _SERVER.argv[cnt]) == true) {
// 2022cvt_015
				target = process.argv[cnt].replace("^-t=", "").toLowerCase();
				// var target = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

				if (!target.match("^[no]$")) {
				// if (ereg("^[no]$", target) == false) {
					usage("対象月の（最新/過去）の指定が不正です。" + process.argv[cnt]);
				}

				continue;
			}

			usage("パラメータの指定が不正です。" + process.argv[0]);
		}
	}

logh.putError(G_SCRIPT_BEGIN, "import_hand.php 手入力請求データ取込処理 処理を開始します");
// 2022cvt_015
var dataDir = DATA_DIR + "/" + year + month + HAND_DIR;

if (pactid == "all") {
	if (fs.existsSync(dataDir) == false) //エラー終了// 2022cvt_003
		{
			logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 手入力請求データディレクトリ（" + dataDir + "）がみつかりません");
			throw process.exit(1);// 2022cvt_009
		}
} else {
	if (fs.existsSync(dataDir + "/" + pactid) == false) //エラー終了// 2022cvt_003
		{
			logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 手入力請求データディレクトリ（" + dataDir + "/" + pactid + "）がみつかりません");
			throw process.exit(1);// 2022cvt_009
		}
}

// clearstatcache();// 2022cvt_012

if (pactid == "all") {
// 2022cvt_015
	var LocalLogFile = dataDir + "/importhand.log";
} else {
	LocalLogFile = dataDir + "/" + pactid + "/importhand.log";
}

if (DEBUG_FLG) {
	logging("START: 手入力請求データ取込処理(import_hand.php)を開始します");
}
// 2022cvt_015
var A_pactid = Array();

if (pactid == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{
		var dirh = fs.readdirSync(dataDir);
		// var dirh = openDir(dataDir);// 2022cvt_004

		for (var fileName of dirh)
		// while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
		{
			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {// 2022cvt_003
				A_pactid.push(fileName);
				if (DEBUG_FLG) {
					logging("INFO: 対象ディレクトリ " + fileName);
				}
			}

// 			clearstatcache();// 2022cvt_012
		}

		// closedir(dirh);
	} else {
	A_pactid.push(pactid);
	if (DEBUG_FLG) {
		logging("INFO: 対象ディレクトリ " + pactid);
	}
}

// 2022cvt_015
var pactCnt = A_pactid.length;
A_pactid.sort();

if (pactCnt == 0) //エラー終了
	{
		if (DEBUG_FLG) {
			logging("ERROR: Pact用データディレクトリが１つもありません");
			logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 Pact用データディレクトリが１つもありません");
		}
		throw process.exit(1);// 2022cvt_009
	}

// 2022cvt_015
var ini_carrier = loadIniFile.sync(KCS_DIR + "/conf_sync/import_hand_carrier.ini", true);
// var ini_carrier = parse_ini_file(KCS_DIR + "/conf_sync/import_hand_carrier.ini", true);

if (await lock(true, dbh) == false) {
	if (DEBUG_FLG) {
		logging("ERROR: 既に起動しています1");
	}
	logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理  既に起動しています2");
	throw process.exit(1);// 2022cvt_009
}

// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var telX_tb = "tel_" + tableNo + "_tb";
// 2022cvt_015
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
if (DEBUG_FLG) {
	logging("INFO: 対象テーブル " + telX_tb + " & " + teldetailX_tb);
}
// 2022cvt_015
var tel_xx_filename = dataDir + "/" + telX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var tel_xx_fp;
try {
	tel_xx_fp = fs.openSync(tel_xx_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + tel_xx_filename + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + tel_xx_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var tel_xx_fp = fopen(tel_xx_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: tel_XX_tbへのcopy文ファイルOPEN " + tel_xx_filename);
}

var tel_filename = "";
if (target == "n") {
// 2022cvt_015
	tel_filename = dataDir + "/tel_tb" + year + month + pactid + ".ins";
// 2022cvt_015
	var tel_fp;
	try {
		tel_fp = fs.openSync(tel_filename, "w");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("ERROR: " + tel_fp + "のオープン失敗");
		}
		logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + tel_fp + "のオープン失敗");
		throw process.exit(1);// 2022cvt_009
	}
	// var tel_fp = fopen(tel_filename, "w");

	if (DEBUG_FLG) {
		logging("INFO: tel_tbへのcopy文ファイルOPEN " + tel_filename);
	}
}

// 2022cvt_015
var teldetail_filename = dataDir + "/" + teldetailX_tb + year + month + pactid + ".ins";
// 2022cvt_015
var teldetail_fp;
try {
	teldetail_fp = fs.openSync(teldetail_filename, "w");
} catch (e) {
	if (DEBUG_FLG) {
		logging("ERROR: " + teldetail_filename + "のオープン失敗");
	}
	logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + teldetail_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var teldetail_fp = fopen(teldetail_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: tel_details_XX_tbへのcopy文ファイルOPEN " + teldetail_filename);
}
// 2022cvt_015
var SOUMU_result = await dbh.getHash("select telno6, arid, carid from soumu_tel_tb;", true);
// 2022cvt_015
var soumu_cnt = SOUMU_result.length;

var soumu_tbl = Array();
for (cnt = 0; cnt < soumu_cnt; cnt++) {
	soumu_tbl[SOUMU_result[cnt].telno6][0] = SOUMU_result[cnt].arid;
	soumu_tbl[SOUMU_result[cnt].telno6][1] = SOUMU_result[cnt].carid;
}

if (DEBUG_FLG) {
	logging("INFO: 総務省のデータ取得 " + "select telno6, arid, carid from soumu_tel_tb;");
}
// 2022cvt_015
var import_hand = new ImportHand(dbh);
// 2022cvt_015
var fin_cnt = 0;
var fin_pact = Array();

for (cnt = 0; cnt < pactCnt; cnt++) //対象会社の会社名を取得
//請求データファイル名を取得する
//処理する請求データファイル名配列
//請求データファイルがなかった場合
//会社単位に終了ログを出力
{
// 2022cvt_015
	var out_rec_cnt = 0;
// 2022cvt_015
	var error_flg = false;
// 2022cvt_015
	var write_buf = "";
// 2022cvt_015
	var tel_xx_write_buf = "";
// 2022cvt_015
	var tel_write_buf = "";
// 2022cvt_015
	var PACT_result = await dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) {
			logging("WARNING:  対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		}
		logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象会社の会社名を取得 " + PACT_result);
	}
	if (DEBUG_FLG) {
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "のデータの処理を開始します");
	}
	logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 処理を開始します");
// 2022cvt_015
	var A_billFile = Array();
// 2022cvt_015
	var dataDirPact = dataDir + "/" + A_pactid[cnt];
	var dirh = fs.readdirSync(dataDirPact);
	// dirh = openDir(dataDirPact);// 2022cvt_004

	for (var fileName of dirh) {
	// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
// 2022cvt_019
		if (fs.statSync(dataDirPact + "/" + fileName) && fileName.match("/\\.csv$/i")) {
		// if (is_file(dataDirPact + "/" + fileName) == true && preg_match("/\\.csv$/i", fileName) == true) {
			A_billFile.push(fileName);
			if (DEBUG_FLG) {
				logging("INFO: 対象請求データファイル名 " + fileName);
			}
		}

// 		clearstatcache();// 2022cvt_012
	}

	// closedir(dirh);
// 2022cvt_015
	var fileCnt = A_billFile.length;

	if (fileCnt == 0) {
		if (DEBUG_FLG) {
			logging("WARNING: 対象ファイルがみつかりません（" + dataDirPact + "）");
		}
		logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 対象ファイルがみつかりません（" + dataDirPact + "）");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象請求データファイル数 " + fileCnt);
	}
// 2022cvt_015
	var TEL_result = await dbh.getHash("select telno,carid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	if (DEBUG_FLG) {
		logging("INFO: 対象会社の登録電話のリストを取得 " + TEL_result.length + "件 select telno,carid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
	}

	var TEL_now_result = Array();
	if (target == "n") //$TEL_now_result = $dbh->getCol("select telno from tel_tb where pactid = " . $dbh->escape($A_pactid[$cnt]) . " ;" , true);
		//if(DEBUG_FLG) logging( "INFO: 最新の登録電話のリストを取得 " . count($TEL_now_result) . "件 select telno,carid from tel_tb where pactid = " . $dbh->escape($A_pactid[$cnt]) . " ;" );
		//キャリアIDを見ていなかったので修正 20071009miya
		{
// 2022cvt_015
			TEL_now_result = await dbh.getHash("select telno,carid from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
			if (DEBUG_FLG) {
				logging("INFO: 最新の登録電話のリストを取得 " + TEL_now_result.length + "件 select telno,carid from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
			}
		}

// 2022cvt_015
	var trg_post = await dbh.getOne("select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;", true);

	if (trg_post == "") {
		if (DEBUG_FLG) {
			logging("WARNING: ルート部署が正しく登録されていません" + "select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
		}
		logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ルート部署が正しく登録されていません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: ルート部署のpostid取得 postid=" + trg_post + " select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and level = 0;");
	}
// 2022cvt_015
	var aspFlg = false;

	var asp_tbl = Array();
	if (await chkAsp(dbh.escape(A_pactid[cnt])) == true) {
		aspFlg = true;
		if (DEBUG_FLG) {
			logging("INFO: ASP利用料表示設定がＯＮ");
		}
// 2022cvt_015
		var asp_charge = await dbh.getHash("select carid, charge from asp_charge_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
// 2022cvt_015
		var asp_charge_cnt = asp_charge.length;

// 2022cvt_015
		for (var acnt = 0; acnt < asp_charge_cnt; acnt++) {
			asp_tbl[asp_charge[acnt].carid] = asp_charge[acnt].charge;
			if (DEBUG_FLG) {
				logging("INFO: ASP使用料取得" + asp_charge[acnt].carid + "=" + asp_charge[acnt].charge);
			}
		}

		if (DEBUG_FLG) {
			logging("INFO: ASP使用料取得");
		}
	}

// 2022cvt_015
	var H_dummy_tel = await dbh.getHash("SELECT telno, carid FROM dummy_tel_tb WHERE pactid = " + dbh.escape(A_pactid[cnt]) + " ;", true);
	if (DEBUG_FLG) {
		logging("INFO: ダミー電話番号取得");
	}

// 2022cvt_015
	for (var fcnt = 0; fcnt < fileCnt; fcnt++) //対象ファイルオープン
	//パラメータとファイルの内容に差異がないかチェック
	//PACTIDチェック
	//現在の日付を得る
	//レコード毎の処理
	{
// 2022cvt_015
		var infilename = dataDirPact + "/" + A_billFile[fcnt];
// 2022cvt_015
		var buffer = "";
		try {
			buffer = fs.readFileSync(infilename, "utf8");
		} catch (e) {
			if (DEBUG_FLG) {
				logging("WARNING: ファイルのOPENに失敗しました " + infilename);
			}
			logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ファイルのOPENに失敗しました " + infilename);
			error_flg = true;
			break;
		}
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var lines = text.toString().split("\r\n");
		// var ifp = fopen(infilename, "r");

		if (DEBUG_FLG) {
			logging("INFO: 対象ファイル=" + infilename);
		}
// 2022cvt_015
		var line = lines[0];
		// var line = fgets(ifp);
// 2022cvt_015
		var readbuff = line.split("\t");

		if (readbuff[0] != A_pactid[cnt]) {
			if (DEBUG_FLG) {
				logging("WARNING: 契約IDが異なります " + infilename);
			}
			logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 契約IDが異なります " + infilename);
			error_flg = true;
			break;
		}

// 2022cvt_015
		var inyear = parseInt(readbuff[1].substring(0, 4));
// 2022cvt_015
		var inmonth = parseInt(readbuff[1].substring(5, 2));

		if (inyear != year || inmonth != month) {
			if (DEBUG_FLG) {
				logging("WARNING: 対象年月が異なります " + infilename);
			}
			logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 対象年月が異なります " + infilename);
			error_flg = true;
			break;
		}

// 2022cvt_015
		var nowtime = getTimestamp();

		for (line of lines.splice(1)) {
			out_rec_cnt++;
			readbuff = line.split("\t");
			// readbuff = rtrim(line, "\r\n").split("\t");
// 2022cvt_015
			var H_needle: { [key: string]: any } = {};
			H_needle.telno = readbuff[3];
			H_needle.carid = readbuff[2];

			if (-1 !== TEL_result.indexOf(H_needle) == false) //エリアコードと種別コードにデフォルト値をセット
				{
					if (undefined !== ini_carrier[readbuff[2]]) //iniに設定されているキャリア情報を取得する
						//総務省のデータと比較
						//tel_tbの存在チェック
						{
// 2022cvt_015
							var temp = ini_carrier[readbuff[2]];
// 2022cvt_015
							var area = temp.area;

							if (undefined !== temp.circuit070) {
// 2022cvt_015
								var circuit = readbuff[3].substring(0, 3) == "070" ? temp.circuit070 : temp.circuit;
							} else {
								circuit = temp.circuit;
							}

							if (undefined !== soumu_tbl[readbuff[3].substring(0, 6)] == true) {
								if (readbuff[2] == soumu_tbl[readbuff[3].substring(0, 6)][1]) //入力データとキャリアが同じ場合は総務省のデータからエリアコードを取得
									{
										area = soumu_tbl[readbuff[3].substring(0, 6)][0];
									}
							}

// 2022cvt_015
							var telno_view = readbuff[3];

// 2022cvt_019
							if (telno_view.match("/^0[789]0/") && telno_view.length >= 11)
							// if (preg_match("/^0[789]0/", telno_view) && telno_view.length >= 11) //070, 080, 090 のいずれかで始まっていたら"-"を入れ込む
								{
									telno_view = telno_view.substring(0, 3) + "-" + telno_view.substring(3, 4) + "-" + telno_view.substring(7);
								}

// 2022cvt_015
							var copy_buf = A_pactid[cnt] + "\t" + trg_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + readbuff[2] + "\t" + area + "\t" + circuit + "\t" + nowtime + "\t" + nowtime + "\n";
							tel_xx_write_buf += copy_buf;

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
								logging("WARNING: 予定外のキャリアコードです(" + H_needle.carid + ")" + " \"" + KCS_DIR + '/conf_sync/import_hand_carrier.ini"に設定を追加してください ' + infilename);
							}

							logh.putError(G_SCRIPT_WARNING, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 予定外のキャリアコードです " + infilename);
							error_flg = true;
						}
				}

// 2022cvt_015
			var H_hand_kamoku = {
				h_basic: "基本料計",
				h_disbasic: "基本料割引",
				h_packetfix: "パケット定額料",
				h_talk_normal: "通話料 国内音声通話",
				h_talk_inter: "通話料 国際通話",
				h_talk_other: "通話料 その他",
				h_distalk: "通話料割引",
				h_com_mode: "通信料 パケットサービス",
				h_com_browse: "通信料 ブラウジング",
				h_com_other: "通信料 一般パケット通信",
				h_com_inter: "通信料 国際パケット通信",
				h_com_digi: "通信料 デジタル通信(64K)",
				h_com_interdigi: "通信料 国際デジタル通信",
				h_discom: "通信料割引",
				h_free: "無料通話・通信",
				h_other: "その他計",
				h_tax: "消費税計"
			};
// 2022cvt_015
			var carid = readbuff[2];
			import_hand.initializeCarrier(carid, H_hand_kamoku);
// 2022cvt_015
			var viewcnt = 1;
			copy_buf = "";
// 2022cvt_015
			var idx = 4;

// 2022cvt_015
			for (var h_code in H_hand_kamoku) {
// 2022cvt_015
				var h_name = H_hand_kamoku[h_code];

				if (readbuff[idx] != "") {
// 2022cvt_015
					var tax_kubun = import_hand.getTaxKubun(carid, h_code);
					copy_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + h_code + "\t" + h_name + "\t" + readbuff[idx] + "\t" + viewcnt + "\t" + nowtime + "\t" + readbuff[2] + "\t" + tax_kubun + "\n";
					viewcnt++;
				}

				idx++;
			}

			if (aspFlg == true) //ASP使用料を調べる
				//合計行のために１つ表示順を空ける
				{
					if (undefined !== asp_tbl[readbuff[2]] == true) //ダミー電話番号のときはASP使用料をカウントしない（0にする）ように分岐を追加 20071009miya
						{
// 2022cvt_015
							var H_tel: { [key: string]: any } = {};
							H_tel.telno = readbuff[3];
							H_tel.carid = readbuff[2];
// 2022cvt_015
							var asp_is_counted = true;

							if (-1 !== H_dummy_tel.indexOf(H_tel) == true) {
// 2022cvt_015
								var asp_bill = 0;
// 2022cvt_015
								var asp_tax = 0;
								asp_is_counted = false;
								if (DEBUG_FLG) {
									logging("INFO: ダミー電話番号につきASP使用料カウントせず pactid=" + A_pactid[cnt] + " carid=" + readbuff[2] + " telno=" + readbuff[3]);
								}
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
	}

	// if (ifp == undefined) {
	// 	fclose(ifp);
	// }

	if (error_flg == true) {
		continue;
	}

	fs.writeFileSync(tel_xx_fp, tel_xx_write_buf);// 2022cvt_006
	// fflush(tel_xx_fp);

	if (target == "n") {
		fs.writeFileSync(tel_fp, tel_write_buf);// 2022cvt_006
		// fflush(tel_fp);
	}

	fs.writeFileSync(teldetail_fp, write_buf);// 2022cvt_006
	// fflush(teldetail_fp);
	if (DEBUG_FLG){
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "件のデータの処理を行いました");
	}
	logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "件の処理を行いました");
	fin_pact[fin_cnt] = A_pactid[cnt];
	fin_cnt++;
}

fs.closeSync(tel_xx_fp);
// fclose(tel_xx_fp);

if (target == "n") {
	fs.closeSync(tel_fp);
	// fclose(tel_fp);
}

fs.closeSync(teldetail_fp);
// fclose(teldetail_fp);

if (fin_cnt < 1) //２重起動ロック解除
	{
		lock(false, dbh);
		if (DEBUG_FLG) {
			logging("ERROR: １件も成功しませんでした");
		}
		logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 １件も成功しませんでした");
		throw process.exit(1);// 2022cvt_009
	}

if (backup == "y") //TEL_DETAILS_X_TBのバックアップ
	//エクスポート失敗した場合
	{
// 2022cvt_015
		var teldetailX_exp = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
// 2022cvt_015
		var sql_str = "select * from " + teldetailX_tb;
// 2022cvt_015
		var rtn = await dbh.backup(teldetailX_exp, sql_str);

		if (rtn == false) {
			if (DEBUG_FLG) {
				logging("ERROR: " + teldetailX_tb + "のデータエクスポートに失敗しました ");
			}
			logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理" + teldetailX_tb + "のデータエクスポートに失敗しました" + teldetailX_exp);
		} else {
			if (DEBUG_FLG) {
				logging("INFO: " + teldetailX_tb + "のデータエクスポートを行いました " + teldetailX_exp);
			}
			logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + teldetailX_tb + "のデータエクスポートを行いました" + teldetailX_exp);
		}
	}

dbh.begin();

if (mode == "o") //対象pactidを１つの文字列に変換
	//TEL_DETAIL_XX_TBの削除
	{
// 2022cvt_015
		var pactin = "";

		for (cnt = 0; cnt < fin_cnt; cnt++) {
			pactin += fin_pact[cnt] + ",";
		}

		pactin = pactin.replace(",", "");
		// pactin = rtrim(pactin, ",");
		dbh.query("delete from " + teldetailX_tb + " where pactid IN(" + pactin + ");", true);
		if (DEBUG_FLG) {
			logging("INFO: " + teldetailX_tb + "の既存データの削除を行いました " + "delete from" + teldetailX_tb + " where pactid IN(" + pactin + ");");
		}
		logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + teldetailX_tb + "の既存データの削除を行いました" + teldetailX_tb);
	}

if (fs.statSync(tel_xx_filename).size != 0)
// if (filesize(tel_xx_filename) != 0) //tel_X_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
		var rtn_2 = await doCopyInsert(telX_tb, tel_xx_filename, telX_col, dbh);

		if (rtn_2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + telX_tb + "のデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + telX_tb + "のデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + telX_tb + "のデータインポートを行いました " + tel_xx_filename);
			}
			logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + telX_tb + "のデータインポートを行いました " + tel_xx_filename);
		}
	}

if (target == "n") {
	if (fs.statSync(tel_filename).size != 0)
	// if (filesize(tel_filename) != 0) //tel_tb へインポート
		//インポート失敗した場合
		{
// 2022cvt_015
			var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];
			rtn_2 = await doCopyInsert("tel_tb", tel_filename, tel_col, dbh);

			if (rtn_2 != 0) //ロールバック
				{
					if (DEBUG_FLG) {
						logging("ERROR: TEL_TBのデータインポートに失敗しました ");
					}
					logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 TEL_TBのデータインポートに失敗しました ");
					dbh.rollback();
					throw process.exit(1);// 2022cvt_009
				} else {
				if (DEBUG_FLG) {
					logging("INFO: TEL_TBのデータインポートを行いました " + tel_filename);
				}
				logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 TEL_TBのデータインポートを行いました " + tel_filename);
			}
		}
}

if (fs.statSync(teldetail_filename).size != 0)
// if (filesize(teldetail_filename) != 0) //tel_details_X_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "detailno", "recdate", "carid", "taxkubun"];
		rtn_2 = await doCopyInsert(teldetailX_tb, teldetail_filename, teldetailX_col, dbh);

		if (rtn_2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + teldetailX_tb + "のデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理 " + teldetailX_tb + "のデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + teldetailX_tb + "のデータインポートを行いました " + teldetail_filename);
			}
			logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理 " + teldetailX_tb + "のデータインポートを行いました " + teldetail_filename);
		}
	}

dbh.commit();

for (cnt = 0; cnt < fin_cnt; cnt++) //ファイルの移動
{
// 2022cvt_015
	var finDir = dataDir + "/" + fin_pact[cnt] + "/fin";

	if (fs.existsSync(finDir) == false) //完了ディレクトリの作成// 2022cvt_003
		{
			try {
				fs.mkdirSync(finDir, 700);
				if (DEBUG_FLG) {
					logging("INFO: 完了ディレクトリの作成しました " + finDir);
				}
				logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理  完了ディレクトリの作成しました " + finDir);
			} catch (e) {
				if (DEBUG_FLG) {
					logging("ERROR: 完了ディレクトリの作成に失敗しました " + finDir);
				}
				logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理  完了ディレクトリの作成に失敗しました " + finDir);
				throw process.exit(1);// 2022cvt_009
			}
		}

// 	clearstatcache();// 2022cvt_012
	var dirh = fs.readdirSync(dataDir + "/" + fin_pact[cnt]);
	// dirh = openDir(dataDir + "/" + fin_pact[cnt]);// 2022cvt_004

	for (var copyfileName of dirh) {
	// while (copyfileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
// 2022cvt_019
		if (fs.statSync(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName).isFile() && copyfileName.match("/\\.csv$/i")) {
		// if (is_file(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName) == true && preg_match("/\\.csv$/i", copyfileName) == true) {
			try {
				fs.renameSync(dataDir + "/" + fin_pact[cnt] + "/" + copyfileName, finDir + "/" + copyfileName);
				if (DEBUG_FLG) {
					logging("INFO: ファイルの移動をしました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				}
				logh.putError(G_SCRIPT_INFO, "import_hand.php 手入力請求データ取込処理  ファイルの移動をしました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			} catch (e) {
				if (DEBUG_FLG) {
					logging("ERROR: ファイルの移動に失敗しました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				}
				logh.putError(G_SCRIPT_ERROR, "import_hand.php 手入力請求データ取込処理  ファイルの移動に失敗しました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				throw process.exit(1);// 2022cvt_009
			}
		}

// 		clearstatcache();// 2022cvt_012
	}

	// closedir(dirh);
}

lock(false, dbh);
console.log("手入力請求データ取込処理(import_hand.php)を終了しました。\n");
if (DEBUG_FLG) {
	logging("END: 手入力請求データ取込処理(import_hand.php)を終了しました");
}
logh.putError(G_SCRIPT_END, "import_hand.php 手入力請求データ取込処理 処理を終了しました");
throw process.exit(0);// 2022cvt_009

	async function doCopyInsert(table: string, filename: string, columns: Array<any>, db: ScriptDB) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	// if (!("logh" in global)) logh = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(filename, "utf8");
	} catch (e) {
		logh.putError(G_SCRIPT_ERROR, filename + "のファイルオープン失敗.");
		return 1;
	}
	var text = Encoding.convert(buffer, {
		from: "SJIS",
		to: "UNICODE",
		type: "string"
	});
	var lines = text.toString().split("\r\n");
	// var fp = fopen(filename, "rt");

// 2022cvt_015
	var ins = new TableInserter(log_listener, db, filename + ".sql", true);
	ins.begin(table);

	for (var line of lines)
	// while (line = fgets(fp)) //データはtab区切り
	//インサート行の追加
	{
// 2022cvt_015
		var A_line = line.split("\t");
		// var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) //要素数が異なっていたら
			{
				logh.putError(G_SCRIPT_ERROR, filename + "のデータ数が設定と異なります。データ=" + line);
				// fclose(fp);
				return 1;
			}

// 2022cvt_015
		var H_ins = {};
// 2022cvt_015
		var idx = 0;

// 2022cvt_015
		for (var col of columns) {
			H_ins[col] = A_line[idx];
			idx++;
		}

		if (await ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_ERROR, filename + "のインサート中にエラー発生、データ=" + line);
			// fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_ERROR, filename + "のインサート処理に失敗.");
		// fclose(fp);
		return 1;
	}

	// fclose(fp);
	return 0;
};

function usage(comment: string) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={PACTID} -b={Y|N} -t={N|O}\n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ	 (Y:バックアップする,N:バックアップしない)\n");
	console.log("		-t 対象月が最新/過去	(N:最新,O:過去) \n\n");
	throw process.exit(1);// 2022cvt_009
};

	async function lock(is_lock: boolean, db: ScriptDB) //ロックする
{
	if (db == undefined) {
		return false;
	}

// 2022cvt_015
	var pre = db.escape("batch_" + SCRIPT_FILENAME);

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
// 2022cvt_015
			var sql = "select count(*) from clamptask_tb " + "where command = '" + pre + "' and " + "status = 1;";
// 2022cvt_015
			var count = await db.getOne(sql);

			if (count != 0) {
				db.rollback();
				db.putError(G_SCRIPT_WARNING, "多重動作");
				return false;
			}

// 2022cvt_015
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
// 2022cvt_015
	var log_buf = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/") + " : " + lstr + "\n";
// 2022cvt_015
	var lfp = fs.openSync(global.LocalLogFile, "a");
	// var lfp = fopen(GLOBALS.LocalLogFile, "a");
	flock.lockSync(global.LocalLogFile);
	// flock(lfp, LOCK_EX);
	fs.writeFileSync(lfp, log_buf);// 2022cvt_006
	flock.unlockSync(global.LocalLogFile);
	// flock(lfp, LOCK_UN);
	fs.closeSync(lfp);
	// fclose(lfp);
	return;
};

	async function chkAsp(pactid: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + G_AUTH_ASP;
// 2022cvt_015
	var count = await dbh.getOne(sql_str);

	if (count == 0) {
		return false;
	} else {
		return true;
	}
};

function getTimestamp() {
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
	var dd = (tm.getDate() + 0).toString();
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
};
})();

//初期化
//ini読込
//初期化
//iniの読込
//対象のキャリアの内訳を取得
//何かしらの機能追加でカラムを足す必要がある場合は、自由に足していい
//キャリアのutiwakeコード読込
//指定されたキャリア、内訳コードのと税区分を返す
export default class ImportHand {
	utiwake_tb: any[];
	import_hand_ini: undefined;
	dbh: { getHash: (arg0: string) => any; } | undefined;
	ini: any[];

	constructor(dbh: ScriptDB | { getHash: (arg0: string) => any; } | undefined) {
		this.utiwake_tb = Array();
		this.import_hand_ini = undefined;
		this.dbh = undefined;
		this.ini = this.read_ini();
		this.dbh = dbh;
	}

	read_ini() {
// 2022cvt_015
		var import_hand_ini = loadIniFile(KCS_DIR + "/conf_sync/import_hand.ini", true);
		// var import_hand_ini = parse_ini_file(KCS_DIR + "/conf_sync/import_hand.ini", true);
// 2022cvt_015
		var res = Array();

// 2022cvt_015
		for (var carid in import_hand_ini) {
// 2022cvt_015
			var col = import_hand_ini[carid];
// 2022cvt_015
			var temp: { [key: string]: any } = {};

			if (!!col.tax_kubun) {
// 2022cvt_015
				var kubun = col.tax_kubun.split(",");
				temp.tax_kubun = kubun;
			}

			if (!!temp) {
				res[carid] = temp;
			}
		}

		return res;
	}

	async get_utiwake_info(carid: string, utiwake: Array<any>) {
// 2022cvt_016
// 2022cvt_015
		var sql = "SELECT code,taxtype FROM utiwake_tb WHERE" + " carid=" + carid + " AND code IN (";
// 2022cvt_015
		var separate = "";

// 2022cvt_015
		for (var code of utiwake) {
			sql += separate + "'" + code + "'";
			separate = ",";
		}

		sql += ")";
// 2022cvt_015
		var result = await this.dbh!.getHash(sql);
// 2022cvt_015
		var res = Array();

// 2022cvt_015
		for (var key in result) {
// 2022cvt_015
			var value = result[key];
			res[value.code] = value;
		}

		return res;
	}

	initializeCarrier(carid: string, H_hand_kamoku: { h_basic?: string; h_disbasic?: string; h_packetfix?: string; h_talk_normal?: string; h_talk_inter?: string; h_talk_other?: string; h_distalk?: string; h_com_mode?: string; h_com_browse?: string; h_com_other?: string; h_com_inter?: string; h_com_digi?: string; h_com_interdigi?: string; h_discom?: string; h_free?: string; h_other?: string; h_tax?: string; ASP?: any; ASX?: any; }) //内訳コードの読込
	{
		if (!(undefined !== this.utiwake_tb[carid])) //ASPとASXいれた
			{
				H_hand_kamoku.ASP = "ASP";
				H_hand_kamoku.ASX = "ASX";
				this.utiwake_tb[carid] = this.get_utiwake_info(carid, Object.keys(H_hand_kamoku));
			}
	}

	getTaxKubun(carid: string, code: string) //キャリアの内訳コードが読み込まれている？
	//内訳コード登録されている？
	//iniに税区分設定されてる？
	{
// 2022cvt_015
		var utiwake = Array();

		if (!this.utiwake_tb[carid]) //ない
			{
				return "";
			}

		utiwake = this.utiwake_tb[carid];

		if (!(undefined !== utiwake[code])) //ない
			{
				return "";
			}

// 2022cvt_015
		var ini: { [key: string]: any } = {};

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

// 2022cvt_016
// 2022cvt_015
		var taxtype = utiwake[code].taxtype;

// 2022cvt_016
		if (undefined !== ini.tax_kubun[taxtype]) {
// 2022cvt_016
			return ini.tax_kubun[taxtype];
		}

		return "";
	}

};
