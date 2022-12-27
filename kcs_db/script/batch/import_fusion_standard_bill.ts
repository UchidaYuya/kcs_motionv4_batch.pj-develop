//===========================================================================
//機能：請求情報ファイルインポートプロセス（FUSION専用）
//
//作成：中西	2006/08/08	初版作成
//===========================================================================

// 2022cvt_026
// require("lib/script_db.php");
import TableNo, { ScriptDB, TableInserter } from "../batch/lib/script_db";

// 2022cvt_026
// require("lib/script_log.php");
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_DEBUG, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../batch/lib/script_log";

// 2022cvt_026
// require("model/script/TelAmountModel.php");
import TelAmountModel from "../../class/model/script/TelAmountModel";
import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import * as PATH from "path";
import * as flock from "proper-lockfile";
import { G_AUTH_ASP, G_CODE_ASP, G_CODE_ASX, G_CODE_TAX, G_EXCISE_RATE } from "./lib/script_common";

(async () => {
const SCRIPT_NAMEJ = "FUSION請求情報標準ファイルインポート";
const SCRIPTNAME = "import_fusion_standard_bill.php";

const FUSION_DIR = "/fusion_standard/bill";
const FUSION_PAT = "/^[A-Z]\\d{11}\\.csv$/";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const PRE_DUMMY_TEL = "FUS";
const DUMMY_TEL_LENG = 11;
const FUSION_CARRIER_ID = 11;
const FUSION_CIRCUIT_ID = 25;
const IS_HIKAZEI = "非課税";
// 2022cvt_015
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
// 2022cvt_015
var log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 2022cvt_016
// 2022cvt_015
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
// 2022cvt_016
log_listener.putListener(log_listener_type);
// 2022cvt_016
log_listener.putListener(log_listener_type2);
// 2022cvt_015
var dbh = new ScriptDB(log_listener);
// 2022cvt_015
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

if (process.argv.length != 6 + 1) //数が正しくない
	{
		usage("", dbh);
		throw process.exit(1);// 2022cvt_009
	}

// 2022cvt_015
var argvCnt = process.argv.length;

var mode = "";
var billdate = "";
var year = 0;
var month = 0;
var pactid_in = "";
var backup = "";
var teltable = "";
var _static_doTelRecord_prev_tel = "";

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
				usage("ERROR: モードの指定が不正です", dbh);
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
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
				{
// 2022cvt_015
					year = parseInt(billdate.substring(0, 4));
// 2022cvt_015
					month = parseInt(billdate.substring(4, 2));

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
					}
				}

// 2022cvt_015
			var diffmon = (new Date().getFullYear() - year) * 12 + (new Date().getMonth() + 1 - year);
			// var diffmon = (date("Y") - year) * 12 + (date("m") - month);

			if (diffmon < 0) {
				usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
			} else if (diffmon >= 24) {
				usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-p="))
	// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		{
// 2022cvt_015
			pactid_in = process.argv[cnt].replace("^-p=", "").toLowerCase();
			// var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!pactid_in.match("^all$") && !pactid_in.match("^[0-9]+$")) {
			// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
				usage("ERROR: 契約ＩＤの指定が不正です", dbh);
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
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-t="))
	// if (ereg("^-t=", _SERVER.argv[cnt]) == true) //今月のデータかどうかのチェック
		{
// 2022cvt_015
			teltable = process.argv[cnt].replace("^-t=", "").toLowerCase();
			// var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!teltable.match("^[no]$")) {
			// if (ereg("^[no]$", teltable) == false) {
				usage("ERROR: 今月のデータかどうかの指定が不正です", dbh);
			}

			continue;
		}

	usage("", dbh);
}

// 2022cvt_015
var dataDir = DATA_DIR + "/" + billdate + FUSION_DIR;

if (fs.existsSync(dataDir) == false) {// 2022cvt_003
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません.");
}

// 2022cvt_015
var A_pactid = Array();
// 2022cvt_015
var A_pactDone = Array();

if (pactid_in == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{
		var dirh = fs.readdirSync(dataDir);
		// var dirh = openDir(dataDir);// 2022cvt_004

		for (var fileName of dirh)
		// while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
		{
			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {// 2022cvt_003
				A_pactid.push(fileName);
			}

// 			clearstatcache();// 2022cvt_012
		}

		// closedir(dirh);
	} else {
	A_pactid.push(pactid_in);
}

if (A_pactid.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Pact用データディレクトリが１つもありません.");
	throw process.exit(1);// 2022cvt_009
}

if (await lock(true, dbh) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "２重起動です、前回エラー終了の可能性があります.");
	throw process.exit(1);// 2022cvt_009
}

// 2022cvt_016
// 2022cvt_015
var sql = "select ut.code, ut.name, ut.taxtype, kr.kamokuid from utiwake_tb ut ";
sql += "inner join kamoku_rel_utiwake_tb kr on ut.code=kr.code where ut.carid=" + FUSION_CARRIER_ID;
// 2022cvt_015
var H_result = await dbh.getHash(sql, true);
var H_utiwake = Array();

for (cnt = 0; cnt < H_result.length; cnt++) //内訳コード => 内訳内容
{
// 2022cvt_015
	var code = H_result[cnt].code;
	H_utiwake[code] = H_result[cnt];
}

sql = "select arid from area_tb where carid=" + FUSION_CARRIER_ID;
// 2022cvt_015
var FUSION_AREA_ID = dbh.getOne(sql, true);
// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var O_tab = new TelAmountModel(dataDir, logh, process.argv, SCRIPT_NAMEJ);
// 2022cvt_015
var telX_tb = "tel_" + tableNo + "_tb";
// 2022cvt_015
var postX_tb = "post_" + tableNo + "_tb";
// 2022cvt_015
var postrelX_tb = "post_relation_" + tableNo + "_tb";
// 2022cvt_015
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
// 2022cvt_015
var file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid_in + ".ins";
// 2022cvt_015

var fp_teldetails;
try {
	fp_teldetails = fs.openSync(file_teldetails, "w");
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "の書き込みオープン失敗.");
	throw process.exit(1);// 2022cvt_009
}
// var fp_teldetails = fopen(file_teldetails, "w");

// 2022cvt_015
var file_tel = dataDir + "/" + "tel_tb" + billdate + pactid_in + ".ins";
// 2022cvt_015
var fp_tel;
try {
	fp_tel = fs.openSync(file_tel, "w");
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_tel + "の書き込みオープン失敗.");
	throw process.exit(1);// 2022cvt_009
}
// var fp_tel = fopen(file_tel, "w");

// 2022cvt_015
var file_telX = dataDir + "/" + telX_tb + billdate + pactid_in + ".ins";
// 2022cvt_015
var fp_telX;
try {
	fp_telX = fs.openSync(file_telX, "w");
} catch (e) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "の書き込みオープン失敗.");
	throw process.exit(1);// 2022cvt_009
}
// var fp_telX = fopen(file_telX, "w");

O_tab.makeFile(year, month, pactid_in);
sql = "select pactid,compname from pact_tb order by pactid";
H_result = await dbh.getHash(sql, true);
// 2022cvt_015
var pactCnt = H_result.length;

var H_pactid = Array();
for (cnt = 0; cnt < pactCnt; cnt++) //pactid => 会社名
{
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

pactCnt = A_pactid.length;
A_pactid.sort();

for (cnt = 0; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
//処理する請求データファイル名配列
//20110414
//請求データファイル名を取得する
//処理するファイル名一覧
//print_r( $A_billFile );	// DEBUG
//請求データファイルがなかった場合
//bill_prtel_tb より請求先番号を得る
//請求月電話番号マスター作成
//ルート部署を取得
//現在用
//請求月用
//ファイル毎のデータを保存する
//計算処理後の詳細データ
//すでに読み込んだ電話かどうかのチェック
//請求番号ごとの処理
//END 請求番号ごとの処理
//正常処理が終わった pactid のみ書き出し処理
{
	if (undefined !== H_pactid[A_pactid[cnt]] == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " は pact_tb に登録されていません.");
		continue;
	}

// 2022cvt_015
	var pactid = A_pactid[cnt];
// 2022cvt_015
	var pactname = H_pactid[pactid];
// 2022cvt_015
	var A_billFile = Array();
// 2022cvt_015
	var dataDirPact = dataDir + "/" + pactid;
	var dirh = fs.readdirSync(dataDirPact);
	// dirh = openDir(dataDirPact);// 2022cvt_004
	O_tab.setBasicData({
		pactid: pactid,
		carid: FUSION_CARRIER_ID
	});
// 2022cvt_015
	var target_files = Array();

	for (var fileName of dirh) {
	// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
		if (fs.statSync(dataDirPact + "/" + fileName).isFile())
		// if (is_file(dataDirPact + "/" + fileName) == true) //ファイル名が適合するものだけ
			{
// 2022cvt_019
				if (fileName.match(FUSION_PAT))
				// if (preg_match(FUSION_PAT, fileName)) //ファイル名から請求番号を得る
					//請求番号 => 元のファイル名、というリストを作成する
					{
// 2022cvt_015
						var path = PATH.parse(fileName + ".csv");
						var seikyuNo = path.base;
						// var seikyuNo = basename(fileName, ".csv");

						if (undefined !== A_billFile[seikyuNo]) {
// 2022cvt_015
							var fname_array = A_billFile[seikyuNo];
							fname_array.push(fileName);
						} else {
							fname_array = [fileName];
						}

						A_billFile[seikyuNo] = fname_array;
						target_files.push(fileName);
					} else {
					logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + "は処理されませんでした.");
				}
			}

// 		clearstatcache();// 2022cvt_012
	}

	if (A_billFile.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "の請求データファイルが見つかりません.");
			// closedir(dirh);
			continue;
		}

	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "処理対象となるファイル：" + target_files.join(","));
	// delete target_files;
	// closedir(dirh);
// 2022cvt_015
	var A_codes = Array();
	sql = "select prtelno from bill_prtel_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID;
	H_result = await dbh.getHash(sql, true);

// 2022cvt_015
	for (var idx = 0; idx < H_result.length; idx++) {
		A_codes.push(H_result[idx].prtelno);
	}

	if (A_codes.length == 0) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "についての請求先番号がbill_prtel_tbに見つかりません.");
			continue;
		}

// 2022cvt_015
	var A_telno = Array();
	sql = "select telno from tel_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID;

// 2022cvt_015
	for (var data of await dbh.getHash(sql, true)) {
		A_telno.push(data.telno);
	}

// 2022cvt_015
	var A_telnoX = Array();
	sql = "select telno from " + telX_tb + " where pactid=" + A_pactid[cnt] + " and carid=" + FUSION_CARRIER_ID;

// 2022cvt_015
	for (var data of await dbh.getHash(sql, true)) {
		A_telnoX.push(data.telno);
	}

// 2022cvt_015
	var rootPostid = getRootPostid(pactid, "post_relation_tb");
// 2022cvt_015
	var rootPostidX = getRootPostid(pactid, postrelX_tb);

	if (rootPostid == "") //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "post_relation_tbからRoot部署の取得にに失敗.");
			continue;
		}

	if (rootPostidX == "") //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + postrelX_tb + "からRoot部署の取得にに失敗.");
			continue;
		}

// 2022cvt_015
	var A_fileData = Array();
// 2022cvt_015
	var A_calcData = Array();
// 2022cvt_015
	var A_telData = Array();
// 2022cvt_015
	var A_telXData = Array();
// 2022cvt_015
	var A_already = Array();
// 2022cvt_015
	var DummyTel = "";
// 2022cvt_015
	var DummyPost = "";
// 2022cvt_015
	var errFlag = false;

// 2022cvt_015
	for (var SeikyuNo in A_billFile) //print "請求番号=" . $SeikyuNo. "\n";
	//消費税合計
	//請求書にあった消費税
	//親番号チェックフラグの初期化
	//ファイルから得た請求番号の末尾４桁はYYMMとなっているので、これを除く
	//C95999990605 => C9599999 の部分だけを取得
	//末尾4文字をカット
	//ダミー電話とダミー部署を求める
	//print "DEBUG: ダミー電話=" . $DummyTel . " :: " . $DummyPost . "\n";
	//ファイルごとの処理
	//END ファイルごとの処理
	//請求番号ごとに溜めたデータをクリアーする
	//消費税合計をクリアー
	//請求書にあった消費税をクリアー
	//親番号が含まれていたかどうかの判定
	{
// 2022cvt_015
		var file_array: string[] = A_billFile[SeikyuNo];
// 2022cvt_015
		var SumTax = 0;
// 2022cvt_015
		var TotalTax = 0;
// 2022cvt_015
		var PrTelFlag = false;
// 2022cvt_015
		var SeikyuBase = SeikyuNo.substring(0, -4);
// 2022cvt_015
		var H_dummy = selectDummyTel(pactid, SeikyuBase);

		if (H_dummy == undefined) //ダミー電話がＤＢに記録されていなかった
			//ファイルが１個だけでダミー電話が見つからなかったら、ルート部署に登録する
			{
				if (A_billFile.length == 1) //結果をグローバル変数に反映
					{
						DummyTel = await registDummyTel2Root(pactid, dbh);
						DummyPost = rootPostidX;
					} else //請求番号が２個以上あったらエラー
					//エラーがあったらそこで中断.
					{
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "請求番号(" + SeikyuBase + ")に対するダミー電話が登録されていません.");
						errFlag = true;
						break;
					}
			} else //部署の存在チェック
			{
				DummyTel = H_dummy[0].telno;
				DummyPost = H_dummy[0].postid;

				if (await checkPostID(pactid, DummyPost, postX_tb) == 0) //エラーがあったらそこで中断.
					{
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "部署ID(" + DummyPost + ")は" + postX_tb + "に存在しません、dummy_tel_tbを見直して下さい.");
						errFlag = true;
						break;
					}

				registDummyTel(DummyTel, DummyPost);
			}

// 2022cvt_015
		for (var fileName of file_array) //print "ファイル名=" . $fileName . "\n";
		//読込処理開始
		//読込電話件数
		//読込明細件数
		//追加する電話数
		//追加する電話数
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理開始.");
// 2022cvt_015
			var ReadTelCnt = 0;
// 2022cvt_015
			var ReadMeisaiCnt = 0;
// 2022cvt_015
			var AddTelCnt = 0;
// 2022cvt_015
			var AddTelXCnt = 0;

			if (doEachFile(dataDirPact + "/" + fileName, pactid, billdate, A_fileData, dbh) == 1) //エラーがあったらそこで中断.
				{
					errFlag = true;
					break;
				}

			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理完了:電話件数=" + ReadTelCnt + ":明細件数=" + ReadMeisaiCnt + ":追加電話件数(tel_tb)=" + AddTelCnt + ":追加電話件数(" + telX_tb + ")=" + AddTelXCnt);
		}

		if (errFlag == true) //ファイル処理で失敗していたら
			//そのまま抜ける
			{
				break;
			}

		if (await doCalc(pactid, A_fileData) != 0) //エラーがあったらそこで中断.
			{
				errFlag = true;
				break;
			}

		A_fileData = Array();
		SumTax = 0;
		TotalTax = 0;

		if (PrTelFlag == false) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "親番号が登録されていませんでした.");
			errFlag = true;
		}
	}

	if (errFlag == false) //ファイルに書き出す
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "データ書出処理開始.");
			writeTelData(pactid);

			if (writeInsFile(pactid, A_calcData) == 1) //次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "ファイルの書き出しに失敗.");
					continue;
				}

			// fflush(fp_teldetails);
			// fflush(fp_tel);
			// fflush(fp_telX);
			A_pactDone.push(pactid);
		}
}

fs.closeSync(fp_teldetails);
// fclose(fp_teldetails);
fs.closeSync(fp_tel);
// fclose(fp_tel);
fs.closeSync(fp_telX);
// fclose(fp_telX);

if (A_pactDone.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "読み込みに成功したPactが１つも無かった.");
	throw process.exit(1);// 2022cvt_009
}

dbh.begin();

if (backup == "y") {
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理開始.");
	doBackup(dbh);
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理完了.");
}

if (mode == "o") {
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理開始.");
	doDelete(A_pactDone, dbh);
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理完了.");
}

logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理開始.");
doImport(file_tel, file_telX, file_teldetails, dbh);
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理完了.");
dbh.commit();

// 2022cvt_015
for (var pactid of A_pactDone) {
// 2022cvt_015
	var pactDir = dataDir + "/" + pactid;
// 2022cvt_015
	var finDir = pactDir + "/" + FIN_DIR;
	finalData(pactid, pactDir, finDir);
}

lock(false, dbh);
logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
throw process.exit(0);// 2022cvt_009

function doEachFile(fileName: string, pactid: string, billdate: string, A_fileData: any[], db: ScriptDB) //ファイルオープン
//ファイルの全合計
//電話ごとの合計
//電話ごとの課税対象額
//最初の二行は飛ばす
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(fileName, "utf8");
	} catch (e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のオープン失敗.");
		return 1;
	}
	var text = Encoding.convert(buffer, {
		from: "SJIS",
		to: "UNICODE",
		type: "string"
	});
	var lines = text.toString().split("\r\n");
	// var fp = fopen(fileName, "rb");

	if (flock.checkSync(fileName)) {
	// if (flock(fp, LOCK_SH) == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のロックに失敗.");
		// fclose(fp);
		return 1;
	}
	flock.lockSync(fileName);

// 2022cvt_015
	var TotalUp = 0;
// 2022cvt_015
	var tel_sum = { "value": 0 };
// 2022cvt_015
	var kazei_sum = { "value": 0 };
// 2022cvt_015
	// var line = fgets(fp);
	// line = fgets(fp);

	for (var line of lines.splice(2))
	// while (line = fgets(fp)) //改行取り
	//カンマ区切りで分割.
	//-- DEBUG -- * 表示してみる
	//print "**** Record **********************************\n";
	//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
	//レコード数のチェック
	//番号.サービス名
	//番号.料金内訳名
	//０詰めして長さを２桁に保つ -- Modify * 2007/01/31
	//code は 00-00 という形式になる
	//内訳コード = サービス名番号 - 料金内訳名番号
	//上位90番台は全合計レコード
	{
		// if (feof(fp)) //おしまい.
		// 	{
		// 		break;
		// 	}

		// line = rtrim(line, "\r\n");

		if (line == "") //空行は除く
			{
				continue;
			}

		// line = mb_convert_encoding(line, "UTF-8", "sjis-win");
// 2022cvt_015
		var record = line.split(",");
		// var record = split(",", line);

		if (record.length != 11) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のレコード数が異常(" + record.length + "!= 11).");
			flock.unlockSync(fileName);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return 1;
		}

		var hi_code, service_name = record[4].split("\\.", 2);
		// [hi_code, service_name] = split("\\.", record[4], 2);
		var lo_code, utiwake_name = record[6].split("\\.", 2);
		// [lo_code, utiwake_name] = split("\\.", record[6], 2);

		while (hi_code.length < 2) {
			hi_code = "0" + hi_code;
		}

		while (lo_code.length < 2) {
			lo_code = "0" + lo_code;
		}

// 2022cvt_015
		var code = hi_code + "-" + lo_code;

		if (hi_code != 92 && hi_code > 90 && 100 > hi_code && "91-11" != hi_code + "-" + lo_code) {
			if (doTotalRecord(record, hi_code, TotalUp, lo_code) == 1) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な内訳コードです(" + code + ").");
				flock.unlockSync(fileName);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return 1;
			}
		} else if (lo_code == 97) //全合計に追加
			//電話ごとの合計をリセット
			//電話ごとの課税対象額をリセット
			{
				if (doSumRecord(record, pactid, A_fileData, tel_sum, kazei_sum) == 1) {
					flock.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				}

				TotalUp += tel_sum.value;
				tel_sum.value = 0;
				kazei_sum.value = 0;
			} else if (lo_code == 98 || lo_code == 99) //合計・課税:98、合計・非課税:99
			//とりあえず無視する
			{} else {
			if (doTelRecord(record, code, pactid, A_fileData, tel_sum, kazei_sum) == 1) {
				flock.unlockSync(fileName);
				// flock(fp, LOCK_UN);
				// fclose(fp);
				return 1;
			}
		}
	}

	flock.unlockSync(fileName);
	// flock(fp, LOCK_UN);
	// fclose(fp);
	return 0;
};

function doTelRecord(record: string[], code: string, pactid: string, A_fileData: any[], sum: { [key: string]: number }, kazei_sum: { [key: string]: number }) //請求先番号
//読込電話件数
//読込明細件数
//親番号チェックフラグ
//20110414
//前回の電話番号.
//-- DEBUG -- * 表示してみる
//print "**** doTelRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//請求番号チェック
//ハイフン付きの電話番号を保持
//'-'ハイフンを除く
//非課税の場合
//明細件数カウント.
{
	// if (!("SeikyuNo" in global)) SeikyuNo = undefined;
	// if (!("H_utiwake" in global)) H_utiwake = undefined;
	// if (!("A_codes" in global)) A_codes = undefined;
	// if (!("ReadTelCnt" in global)) ReadTelCnt = undefined;
	// if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("PrTelFlag" in global)) PrTelFlag = undefined;
	// if (!("DummyTel" in global)) DummyTel = undefined;
	// if (!("O_tab" in global)) O_tab = undefined;
	// if (!("_static_doTelRecord_prev_tel" in global)) _static_doTelRecord_prev_tel = "";

	if (record[0].trim() != SeikyuNo) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "請求番号が違います.(" + record[0] + "!=" + SeikyuNo + ").");
		return 1;
	}

	if (record[2].trim() != billdate) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "請求年月日が違います.(" + record[2] + "!=" + billdate + ").");
		return 1;
	}

// 2022cvt_015
	var telno_view = record[5].trim();
// 2022cvt_015
	var telno = telno_view.replace(/-/g, "");

	if (telno != _static_doTelRecord_prev_tel && telno != "") //前回の電話番号と異なっていれば...
		//電話番号の登録
		//読み込んだレコード数をカウントする.
		{
			registTel(telno, telno_view);
			_static_doTelRecord_prev_tel = telno;
			ReadTelCnt++;
		}

	if (PrTelFlag == false && telno != "") //まだ親番号が含まれていない
		{
// 2022cvt_015
			for (var a_code of A_codes) {
// 2022cvt_015
				var a_code = a_code.trim().replace(/-/g, "");

				if (telno == a_code) //親番号チェックフラグＯＮ
					{
						PrTelFlag = true;
						O_tab.setPrtelNo(telno);
						break;
					}
			}
		}

// 2022cvt_015
	var charge = +record[7];

	if (undefined !== H_utiwake[code]) //print "DEBUG: ".  $H_utiwake[$code]["name"] . ", " . $charge . " 円\n";
		//合計値を得る
		{
			sum.value += charge;
		} else {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な内訳コードです(" + code + ").");
		return 1;
	}

// 2022cvt_015
	var hikazei = false;

	if (record[10] == IS_HIKAZEI) {
		hikazei = true;
	}

	if (telno == "") //特定番号通知等、グループ全体にかかる請求は電話番号なしでやってくる。
		{
			telno = DummyTel;
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "電話番号の無い明細をダミー電話に付加、code=" + code + ", charge=" + charge);
		} else if (hikazei == false) //電話番号があって課税対象のもの
		//電話ごとの課税対象合計を求める -> 消費税の算出に使用
		//print "DEBUG: kazei_sum:" . $kazei_sum . " += charge:". $charge . "\n";
		{
			kazei_sum.value += charge;
		}

// 2022cvt_015
	var A_meisai = [telno, code, charge, hikazei];
	A_fileData.push(A_meisai);
	ReadMeisaiCnt++;
	return 0;
};

function doSumRecord(record: Array<any>, pactid: string, A_fileData: any[], sum: { [key: string]: number }, kazei_sum: { [key: string]: number }) //-- DEBUG -- * 表示してみる
//print "**** doSumRecord **********************************\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//電話番号
//ハイフン付きの電話番号を保持
//'-'ハイフンを除く
//電話番号のない.97は、グループ全体にかかるサービス合計なので無視する
//整数切り捨て
//消費税合計に加える
//print "DEBUG: 消費税：". $telno ." :: ". $kazei_sum ." * 0.05 = ". $tax ."\n";
//明細データを配列に保持する.
{
	// if (!("SumTax" in global)) SumTax = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var telno_view = record[5].trim();
// 2022cvt_015
	var telno = telno_view.replace(/-/g, "");

	if (telno == "") {
		return 0;
	}

// 2022cvt_015
	var charge = +record[7];

	if (charge != sum.value) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "合計金額が異なります." + telno + " (" + charge + "!=" + sum.value + ").");
		return 1;
	}

// 2022cvt_015
	var tax = Math.floor(kazei_sum.value * G_EXCISE_RATE);
	SumTax += tax;
// 2022cvt_015
	var A_meisai = [telno, G_CODE_TAX, tax, false];
	A_fileData.push(A_meisai);
	return 0;
};

function doTotalRecord(record: (string | number)[], hi_code: string | number, TotalUp: number, lo_code = undefined) //請求書に記載されている消費税合計
//global $logh;
//global $pactid;
//global $pactname;
//global $billdate;
//20110414
//-- DEBUG -- * 表示してみる
//print "==== doTotalRecord ================================\n";
//foreach( $record as $item ){ print "\"" .  $item . "\"\n"; }
//開発中、そのままでは動作しません.
//if( $total != $TotalUp ){
//$logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid . LOG_DELIM . $pactname . LOG_DELIM . $billdate . LOG_DELIM
//. "会社合計金額が異なります.(". $total ."!=". $TotalUp .")." );
//return 1;
//}
{
	// if (!("TotalTax" in global)) TotalTax = undefined;
	// if (!("O_tab" in global)) O_tab = undefined;
	// if (!("logh" in global)) logh = undefined;
// 2022cvt_015
	var total = +record[7];

	if (hi_code == 99) //消費税合計を記録する
		{
			TotalTax += total;
		} else if ("98" == hi_code) {
// 2022cvt_015
		var amountdata = O_tab.makeAmountData({
			charge: total,
			recdate: getTimestamp()
		});
		O_tab.writeFile(amountdata);
	} else {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "処理対応外のコードです。取込結果に以上がある場合、このコードが原因の可能性があります(" + hi_code + "-" + lo_code + ").");
	}

	return 0;
};

function registTel(telno: string, telno_view: string) //電話番号マスター
//請求月電話番号マスター
//-t オプションの値
//root部署
//請求月root部署
//追加する電話数
//追加する電話数
//print "DEBUG: 電話番号: " . $telno . "\n";
//tel_tbの存在チェック
{
	// if (!("A_telno" in global)) A_telno = undefined;
	// if (!("A_telnoX" in global)) A_telnoX = undefined;
	// if (!("A_telData" in global)) A_telData = undefined;
	// if (!("A_telXData" in global)) A_telXData = undefined;
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("teltable" in global)) teltable = undefined;
	// if (!("rootPostid" in global)) rootPostid = undefined;
	// if (!("rootPostidX" in global)) rootPostidX = undefined;
	// if (!("AddTelCnt" in global)) AddTelCnt = undefined;
	// if (!("AddTelXCnt" in global)) AddTelXCnt = undefined;
// 2022cvt_015
	var telFlag = true;

	if (-1 !== A_telno.indexOf(telno) == false) //print "INFO: 電話は tel_tb に登録されていません\n";
		{
			telFlag = false;
		}

// 2022cvt_015
	var telXFlag = true;

	if (-1 !== A_telnoX.indexOf(telno) == false) //print "INFO: 電話は". $telX_tb ."に登録されていません\n";
		{
			telXFlag = false;
		}

	if (telFlag && telXFlag) //print "INFO: 電話は両方にありました、何もしません.\n";
		{
			return 0;
		}

	if (telFlag == false && telXFlag) //print "INFO: 電話はtel_tbに無くて、telX_tbにありました、何もしません.\n";
		{
			return 0;
		}

	if (telXFlag == false) //print "INFO: 電話はtelX_tbに無かったので追加します.\n";
		{
			if (!inTelData(A_telXData, telno)) //tel_XX_tb に追加する電話を出力
				//追加する電話数のカウント
				{
					A_telXData.push([rootPostidX, telno, telno_view]);
					AddTelXCnt++;
				} else {
				console.log("INFO: 電話" + telno + "はすでにtelX_tbに登録しました、スキップします.\n");
			}
		}

	if (telFlag == false && telXFlag == false && teltable == "n") //print "INFO: 電話はtel_tbに無かったので追加します.\n";
		{
			if (!inTelData(A_telData, telno)) //tel_tb に追加する電話を出力
				//追加する電話数のカウント
				{
					A_telData.push([rootPostid, telno, telno_view]);
					AddTelCnt++;
				} else {
				console.log("INFO: 電話" + telno + "はすでにtel_tbに登録しました、スキップします.\n");
			}
		}
};

function inTelData(A_array: any[], telno: any) //存在しなかった
{
// 2022cvt_015
	for (var A_line of A_array) //$A_line は array( $postid, $telno, $telno_view )
	{
		if (A_line[1] == telno) //電話番号が存在した
			{
				return true;
			}
	}

	return false;
};

function registDummyTel(telno: string, postid: string) //請求月電話番号マスター
//telX_tb になかったら追加
{
	// if (!("A_telnoX" in global)) A_telnoX = undefined;
	// if (!("A_telXData" in global)) A_telXData = undefined;

	if (-1 !== A_telnoX.indexOf(telno) == false) {
		A_telXData.push([postid, telno, telno]);
	}
};

	async function registDummyTel2Root(pactid: string, db: ScriptDB) //請求月電話番号マスター
//請求月root部署
//ダミー電話番号.
{
	// if (!("A_telnoX" in global)) A_telnoX = undefined;
	// if (!("A_telXData" in global)) A_telXData = undefined;
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("rootPostidX" in global)) rootPostidX = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var telno = getDummyTel(pactid);

	if (-1 !== A_telnoX.indexOf(telno) == false) //telX_tb になかったら追加
		{
			A_telXData.push([rootPostidX, telno, telno]);
		}

	db.begin();
// 2022cvt_015
	var sql = "select count(telno) from dummy_tel_tb where pactid=" + pactid + " and carid=" + FUSION_CARRIER_ID + " and telno='" + telno + "'";
// 2022cvt_015
	var count = await db.getOne(sql);

	if (count == 0) //無ければ登録を行う
		{
			sql = "insert into dummy_tel_tb (pactid, telno, carid) values (" + pactid + ",'" + telno + "'," + FUSION_CARRIER_ID + ")";
			db.escape(sql);
			db.query(sql);
			db.commit();
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "ダミー電話" + telno + "を dummy_tel_tbに登録しました.");
		} else {
		db.rollback();
	}

	return telno;
};

function getDummyTel(pactid: string | any[]) {
// 2022cvt_015
	var preLeng = PRE_DUMMY_TEL.length;
// 2022cvt_015
	var pactLeng = pactid.length;
// 2022cvt_015
	var zeroCnt = DUMMY_TEL_LENG - preLeng - pactLeng;
// 2022cvt_015
	var getStr = PRE_DUMMY_TEL;

// 2022cvt_015
	for (var zeroCounter = 0; zeroCounter < zeroCnt; zeroCounter++) {
		getStr = getStr + "0";
	}

	getStr = getStr + pactid;
	return getStr;
};

function selectDummyTel(pactid: string, seikyuNo: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql_str = "select telno,postid from dummy_tel_tb where pactid = " + pactid + " and carid = " + FUSION_CARRIER_ID + " and reqno = '" + seikyuNo + "'";
	return dbh.getHash(sql_str);
};

function checkPostID(pactid: string, postid: string, post_tb: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql = "select count(postid) from " + post_tb + " where pactid=" + pactid + " and postid=" + postid;
	return dbh.getOne(sql);
};

function getRootPostid(pactid: string, table: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql_str = "select postidparent from " + table + " where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
	rootPostid = dbh.getOne(sql_str, true);
	return rootPostid;
};

	async function doCalc(pactid: string, A_fileData: any[]) //読み込んだ電話を追加してゆく
//ASP利用料金
//データが空のときは終了.
//電話番号（１回前の）
//電話毎の消費税
//各データを書き出す
//最後の電話について消費税を表示する
//最後の電話についてASP使用料を表示する.
//ただし一度出現した電話にＡＳＰ利用料は付けない
{
	// if (!("A_calcData" in global)) A_calcData = undefined;
	// if (!("A_already" in global)) A_already = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("DummyTel" in global)) DummyTel = undefined;
// 2022cvt_015
	var aspCharge = 0;
// 2022cvt_015
	var aspFlg = false;

	if (A_fileData.length == 0) {
		return 0;
	}

	if (await chkAsp(pactid) == true) //ASP利用料を取得
		//ASP利用料が設定されていない場合
		{
			aspFlg = true;
			aspCharge = await getAsp(pactid);

			if (!isNaN(aspCharge)) {
			// if (is_null(aspCharge)) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "ＡＳＰ利用料が設定されていません.");
				return 1;
			}
		}

	if (!A_fileData.sort(cmpfileData)) {
	// if (A_fileData.sort("cmpfileData") == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "明細データの電話番号ソートに失敗しました.");
		return 1;
	}

// 2022cvt_015
	var detailNo = { "value": 0 };
// 2022cvt_015
	var telno = "";
// 2022cvt_015
	var tax = 0;

// 2022cvt_015
	for (var data of A_fileData) //data : telno, code, charge, hikazei
	//print "DEBUG: ". $data[0] .", ". $data[1] .", ". $data[2] .", ". $data[3] ."\n";
	//電話番号が変わったら
	//END 電話番号が変わったら
	//電話番号を得る
	//消費税はそのまま出力せず、最後にまとめて出す
	//電話が複数ファイルに分かれていると消費税が複数行出てしまうため、ここで１つにまとめる。
	{
		if (data[0] != telno && telno != "") //一度出現した電話にＡＳＰ利用料は付けない
			{
				if (telno != DummyTel) //ダミー電話でなければ
					//消費税を表示する
					{
						detailNo.value++;
// 2022cvt_015
						var A_meisai = [telno, G_CODE_TAX, tax, false, detailNo.value];
						A_calcData.push(A_meisai);
					} else {
					adjustTax(detailNo);
				}

				if (-1 !== A_already.indexOf(telno) == false) //ASP利用料表示する
					{
						detailNo.value++;

						if (aspFlg == true && telno != DummyTel) //合計用に１つ進める
							//ASP利用料を出力
							//ASP利用料消費税を出力
							{
								detailNo.value++;
								A_meisai = [telno, G_CODE_ASP, aspCharge, false, detailNo.value];
								A_calcData.push(A_meisai);
								detailNo.value++;
								A_meisai = [telno, G_CODE_ASX, +(aspCharge * G_EXCISE_RATE), false, detailNo.value];
								A_calcData.push(A_meisai);
							}

						A_already.push(telno);
					}

				detailNo.value = 0;
				tax = 0;
			} else //電話はそのまま
			{
				detailNo.value++;
			}

		telno = data[0];

		if (data[1] == G_CODE_TAX) //print "DEBUG: *Tax=" . $tax . "\n";
			{
				tax += data[2];
			} else //通常の請求について
			//$detailNo を付け足す
			{
				data.push(detailNo.value);
				A_calcData.push(data);
			}
	}

	if (telno != DummyTel) {
		detailNo.value++;
		A_meisai = [telno, G_CODE_TAX, tax, false, detailNo.value];
		A_calcData.push(A_meisai);
	} else {
		adjustTax(detailNo);
	}

	if (-1 !== A_already.indexOf(telno) == false) {
		detailNo.value++;

		if (aspFlg == true && telno != DummyTel) //合計用に１つ進める
			//ASP利用料を出力
			//ASP利用料消費税を出力
			{
				detailNo.value++;
				A_meisai = [telno, G_CODE_ASP, aspCharge, false, detailNo.value];
				A_calcData.push(A_meisai);
				detailNo.value++;
				A_meisai = [telno, G_CODE_ASX, +(aspCharge * G_EXCISE_RATE), false, detailNo.value];
				A_calcData.push(A_meisai);
			}

		A_already.push(telno);
	}

	return 0;
};

function adjustTax(detailNo: { [key: string]: number }) //端数をダミー電話に出力
//グローバル変数から取得
//消費税の差額を得る
{
	// if (!("A_calcData" in global)) A_calcData = undefined;
	// if (!("DummyTel" in global)) DummyTel = undefined;
	// if (!("SumTax" in global)) SumTax = undefined;
	// if (!("TotalTax" in global)) TotalTax = undefined;
// 2022cvt_015
	var telno = DummyTel;
// 2022cvt_015
	var tax = TotalTax - SumTax;

	if (tax != 0) {
		detailNo.value++;
// 2022cvt_015
		var A_meisai = [telno, G_CODE_TAX, tax, false, detailNo.value];
		A_calcData.push(A_meisai);
	}
};

function writeTelData(pactid: string) //現在の日付を得る
//tel_XX_tb に追加する電話を出力
//tel_tb に追加する電話を出力
{
	// if (!("A_telData" in global)) A_telData = undefined;
	// if (!("A_telXData" in global)) A_telXData = undefined;
	// if (!("fp_tel" in global)) fp_tel = undefined;
	// if (!("fp_telX" in global)) fp_telX = undefined;
	// if (!("FUSION_AREA_ID" in global)) FUSION_AREA_ID = undefined;
// 2022cvt_015
	var nowtime = getTimestamp();

// 2022cvt_015
	for (var A_data of A_telXData) {
		rootPostid = A_data[0];
// 2022cvt_015
		var telno = A_data[1];
// 2022cvt_015
		var telno_view = A_data[2];
		fs.writeFileSync(fp_telX, pactid + "\t" + rootPostid + "\t" + telno + "\t" + telno_view + "\t" + FUSION_CARRIER_ID + "\t" + FUSION_AREA_ID + "\t" + FUSION_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");// 2022cvt_006
	}

// 2022cvt_015
	for (var A_data of A_telData) {
		rootPostid = A_data[0];
		telno = A_data[1];
		telno_view = A_data[2];
		fs.writeFileSync(fp_tel, pactid + "\t" + rootPostid + "\t" + telno + "\t" + telno_view + "\t" + FUSION_CARRIER_ID + "\t" + FUSION_AREA_ID + "\t" + FUSION_CIRCUIT_ID + "\t" + nowtime + "\t" + nowtime + "\n");// 2022cvt_006
	}
};

function cmpfileData(a: string, b: string) //data : telno, code, charge, hikazei
//先頭の telno で比較する
{
	var telA = a[0];
	var telB = b[0];

	if (telA == telB) {
		return 0;
	}

	return telA < telB ? -1 : 1;
};

function writeInsFile(pactid: string, A_calcData: any[]) //20110414
//データが空のときは終了.
//現在の日付を得る
//各データを書き出す
{
	// if (!("H_utiwake" in global)) H_utiwake = undefined;
	// if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	// if (!("fp_teldetails" in global)) fp_teldetails = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("O_tab" in global)) O_tab = undefined;

	if (A_calcData.length == 0) {
		return 0;
	}

// 2022cvt_015
	var nowtime = getTimestamp();

// 2022cvt_015
	for (var data of A_calcData) //data : telno, code, charge, hikazei, detailNo
	//内訳コード.
	//内訳コード名
	//末尾の空白を除く
	//非課税フラグ
	//表示順序
	//20110413
	//carid キャリアID
	{
// 2022cvt_015
		var telno = data[0];
// 2022cvt_015
		var ut_code = data[1];
// 2022cvt_015
		var ut_name = H_utiwake[data[1]].name;
		ut_name = ut_name.replace("\u3000 ");
		// ut_name = rtrim(ut_name, "\u3000 ");
// 2022cvt_015
		var hikazei = data[3];
// 2022cvt_015
		var detailNo = data[4];

		if (hikazei == true) {
// 2022cvt_015
			var ut_zei_str = "非課税";
		} else {
			if (ut_code == G_CODE_TAX || ut_code == G_CODE_ASX) //消費税には何も付けない
				{
					ut_zei_str = "";
				} else //それ以外は全て「外税」とする
				{
					ut_zei_str = "外税";
				}
		}

// 2022cvt_015
		var prtelno = "\n";

		if (G_CODE_ASP != ut_code && G_CODE_ASX != ut_code) {
			prtelno = O_tab.getPrtelNo() + "\n";
		}

		fs.writeFileSync(fp_teldetails, pactid + "\t" + telno + "\t" + ut_code + "\t" + ut_name + "\t" + data[2] + "\t" + ut_zei_str + "\t" + detailNo + "\t" + nowtime + "\t" + FUSION_CARRIER_ID + "\t" + prtelno);// 2022cvt_006
	}

	return 0;
};

	async function doBackup(db: ScriptDB) //tel_details_X_tb をエクスポートする
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("")	+ ".exp";
// 2022cvt_015
	var sql = "select * from " + teldetailX_tb;
// 2022cvt_015
	var rtn = await db.backup(outfile, sql);

	if (rtn == false) //ロールバック
		//ロック解除
		//lock(false, $db);
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデータエクスポートに失敗しました.");
			db.rollback();
			throw process.exit(1);// 2022cvt_009
		}

	return 0;
};

	async function doDelete(A_pactDone: any[], db: ScriptDB) //delte失敗した場合
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
// 2022cvt_015
	var sql_str = "delete from " + teldetailX_tb + " where pactid in (" + A_pactDone.join(",") + ") and carid=" + FUSION_CARRIER_ID;
// 2022cvt_015
	var rtn = await db.query(sql_str, false);

// 2022cvt_016
	if (db.isError())
	// if ("object" === typeof rtn == true) //ロールバック
		//ロック解除
		//lock(false, $db);
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデリートに失敗しました、");
			db.rollback();
			throw process.exit(1);// 2022cvt_009
		}

	return 0;
};

	async function doImport(file_tel: string, file_telX: string, file_teldetails: string, db: ScriptDB) //20110414
//tel_tbへのインポート
//20110414
{
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("O_tab" in global)) O_tab = undefined;

	if (fs.statSync(file_tel).size > 0) {
	// if (filesize(file_tel) > 0) {
// 2022cvt_015
		var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];

		if (await doCopyInsert("tel_tb", file_tel, tel_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "tel_tbのインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "tel_tb のインポート完了.");
		}
	}

	if (fs.statSync(file_telX).size > 0) {
	// if (filesize(file_telX) > 0) {
// 2022cvt_015
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];

		if (await doCopyInsert(telX_tb, file_telX, telX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポート完了");
		}
	}

	if (fs.statSync(file_teldetails).size > 0) {
	// if (filesize(file_teldetails) > 0) {
// 2022cvt_015
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "prtelno"];

		if (await doCopyInsert(teldetailX_tb, file_teldetails, teldetailX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " のインポート完了");
		}
	} else //ファイルサイズが０？
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "のファイルサイズが０です.");
			return 1;
		}

	if (0 < fs.statSync(O_tab.getFilePath()).size) {
	// if (0 < filesize(O_tab.getFilePath())) {
		if (0 != await doCopyInsert(O_tab.getTableName(), O_tab.getFilePath(), O_tab.getAmountColumn(), db)) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + O_tab.getTableName() + "のインポートに失敗しました");
			db.rollback();
			throw process.exit(1);// 2022cvt_009
		} else {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + O_tab.getFilePath() + "のファイルサイズが0です");
			return 1;
		}
	}

	return 0;
};

	async function doCopyInsert(table: string, filename: string, columns: Array<any>, db: ScriptDB) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var buffer;
	try {
		buffer = fs.readFileSync(filename, "utf8");
	} catch (e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
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
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のデータ数が設定と異なります。(" + A_line.length + "!=" + columns.length + "), データ=" + line);
				// fclose(fp);
				return 1;
			}

// 2022cvt_015
		var H_ins = {};
// 2022cvt_015
		var idx = 0;

// 2022cvt_015
		for (var col of columns) {
			if (A_line[idx] != "\\N") //\N の場合はハッシュに追加しない
				{
					H_ins[col] = A_line[idx];
				}

			idx++;
		}

		if (await ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート中にエラー発生、データ=" + line);
			// fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート処理に失敗.");
		// fclose(fp);
		return 1;
	}

	// fclose(fp);
	return 0;
};

function finalData(pactid: string, pactDir: string, finDir: fs.PathLike) //同名のファイルが無いか
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("billdate" in global)) billdate = undefined;

// 2022cvt_028
	if (fs.statSync(finDir).isFile()) {
	// if (is_file(finDir) == true) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + finDir + "はディレクトリではありません.");
		return 1;
	}

	if (fs.existsSync(finDir) == false) //なければ作成する// 2022cvt_003
		{
			try {
				fs.mkdirSync(finDir);
			} catch (e) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "異動先の" + finDir + "が作成できなかった.");
				return 1;
			}
		}

// 2022cvt_015
	var retval = 0;
// 2022cvt_015
	// var dirh = openDir(pactDir);// 2022cvt_004
	var dirh = fs.readdirSync(pactDir);

	for (var fname of dirh) {
	// while (fname = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_015
		var fpath = pactDir + "/" + fname;

// 2022cvt_028
		if (fs.statSync(fpath).isFile())
		// if (is_file(fpath)) //ファイル名が適合するものだけ
			{
// 2022cvt_019
				if (fname.match(FUSION_PAT))
				// if (preg_match(FUSION_PAT, fname)) //ファイル移動
					{
						try {
							fs.renameSync(fpath, finDir + "/" + fname);
						} catch (e) {
							logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "の異動失敗.");
							retval = 1;
						}
					}
			}

// 		clearstatcache();// 2022cvt_012
	}

	// closedir(dirh);
	return retval;
};

function usage(comment: string, db: ScriptDB) //ロック解除
{
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
	console.log("		-t 当月データ	(N:データは今月のもの,O:データは先月のもの)\n\n");
	lock(false, db);
	throw process.exit(1);// 2022cvt_009
};

	async function lock(is_lock: boolean, db: ScriptDB) //ロックする
{
	if (db == undefined) {
		return false;
	}

// 2022cvt_015
	var pre = "batch";

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
// 2022cvt_015
			var sql = "select count(*) from clamptask_tb " + "where command like '" + db.escape(pre + "%") + "' and " + "status = 1;";
// 2022cvt_015
			var count = await db.getOne(sql);

			if (count != 0) {
				db.rollback();
				return false;
			}

// 2022cvt_015
			var nowtime = getTimestamp();
			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + db.escape(pre + "_" + SCRIPTNAME) + "', 1, '" + nowtime + "');";
			db.query(sql);
			db.commit();
		} else {
		db.begin();
		db.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + db.escape(pre + "_" + SCRIPTNAME) + "';";
		db.query(sql);
		db.commit();
	}

	return true;
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

function getAsp(pactid: string) //if(is_null($charge)){
//print "charge no\n";
//}else{
//}
{
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + FUSION_CARRIER_ID;
// 2022cvt_015
	var charge = dbh.getOne(sql_str);
	return charge;
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
