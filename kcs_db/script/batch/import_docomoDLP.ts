// 2022cvt_026
import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";
import TableNo, { ScriptDB, TableInserter } from "../batch/lib/script_db";
// require("lib/script_db.php");

// 2022cvt_026
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../batch/lib/script_log";
// require("lib/script_log.php");

import * as Encoding from "encoding-japanese";
import * as fs from "fs";
import { G_AUTH_ASP, G_CODE_ASP } from "./lib/script_common";
import * as flock from "proper-lockfile";
import preg_match_all from "../../class/preg_match_all";

(async () => {

const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "import_docomoDLP.php";
const DLP_DIR = "/docomoDLP/bill";
const DLP_CARID = 12;
const BEFORE_ENCO = "SJIS";
const CON_TAX = 0.08;
const VIEWCNT = 7;
const TAX_VIEWCNT = 7;
const AREAID = 43;
const CIRID = 27;
// 2022cvt_015
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
// 2022cvt_015
var log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
// 2022cvt_016
// 2022cvt_015
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 2022cvt_016
log_listener.putListener(log_listener_typeView);
// 2022cvt_016
log_listener.putListener(log_listener_type);
// 2022cvt_015
var dbh = new ScriptDB(log_listener);
// 2022cvt_015
var logh = new ScriptLogAdaptor(log_listener, true);
// 2022cvt_015
var A_para = 5;

var year = 0;
var month = 0;
var pactid = "";
var mode = "";
var target = "";
var month_view = "";
var backup = "";
var A_riyou: { [key: string]: any } = {};

if (process.argv.length != 6 + 1) //数が正しくない
	{
		usage("");
	} else //数が正しい
	//$cnt 0 はスクリプト名のため無視
	//パラメータの指定が無かったものがあった時
	{
// 2022cvt_015
		var argvCnt = process.argv.length;

// 2022cvt_015
		for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
		{
			if (process.argv[cnt].match("^-e="))
			// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード指定変数
				//モード文字列チェック
				{
// 2022cvt_015
					mode = process.argv[cnt].replace("^-e=", "").toLowerCase();
					// ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!mode.match("^[ao]$")) {
					// if (ereg("^[ao]$", mode) == false) {
						usage("モードの指定が不正です。" + process.argv[cnt]);
					}

					A_para -= 1;
					continue;
				}

			if (process.argv[cnt].match("^-y="))
			// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //年月指定変数
				//請求年月文字列チェック
				//指定済のパラメータを配列から削除
				{
// 2022cvt_015
					var billdate = process.argv[cnt].replace("^-y=", "");
					// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

					if (!billdate.match("^[0-9]{6}$")) {
					// if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("請求年月の指定が不正です。" + process.argv[cnt]);
					} else //表示用の月
						{
// 2022cvt_015
							year = parseInt(billdate.substring(0, 4));
// 2022cvt_015
							month = parseInt(billdate.substring(4, 2));
// 2022cvt_015
							month_view = billdate.substring(4, 2);

							if (month < 10) {
								month_view = billdate.substring(4, 2).replace("0", "");
								// month_view = trim(month, "0");
							}

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("請求年月の指定が不正です。" + process.argv[cnt]);
							}

// 2022cvt_015
							A_riyou = getRiyouYM(year, month);
						}

						A_para -= 1;
					continue;
				}

			if (process.argv[cnt].match("^-p="))
			// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //会社ID指定変数
				//契約ＩＤチェック
				{
// 2022cvt_015
					pactid = process.argv[cnt].replace("^-p=", "").toLowerCase();
					// var pactid = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!pactid.match("^all$") && !pactid.match("^[0-9]+$")) {
					// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("会社コードの指定が不正です。" + process.argv[cnt]);
					}

					A_para -= 1;
					continue;
				}

			if (process.argv[cnt].match("^-b="))
			// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップ指定変数
				//バックアップの有無のチェック
				{
// 2022cvt_015
					backup = process.argv[cnt].replace("^-b=", "").toLowerCase();
					// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

					if (!backup.match("^[ny]$")) {
					// if (ereg("^[ny]$", backup) == false) {
						usage("バックアップの指定が不正です。" + process.argv[cnt]);
					}

					A_para -= 1;
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

				A_para -= 1;
				continue;
			}

			usage("パラメータの指定が不正です。" + process.argv[0]);
		}

		if (A_para != 0) {
			usage("パラメータの指定が不正です。" + process.argv[0]);
		}
	}

logh.putError(G_SCRIPT_BEGIN, "import_docomoDLP.php docomoDLP請求データ取込処理 処理を開始します");
// 2022cvt_015
var dataDir = DATA_DIR + "/" + year + month + DLP_DIR;

if (pactid == "all") {
	if (fs.existsSync(dataDir) == false) //エラー終了// 2022cvt_003
		{
			logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 docomoDLP請求データディレクトリ（" + dataDir + "）がみつかりません");
			throw process.exit(1);// 2022cvt_009
		}
} else {
	if (fs.existsSync(dataDir + "/" + pactid) == false) //エラー終了// 2022cvt_003
		{
			logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 docomoDLP請求データディレクトリ（" + dataDir + "/" + pactid + "）がみつかりません");
			throw process.exit(1);// 2022cvt_009
		}
}

// clearstatcache();// 2022cvt_012

var LocalLogFile = "";
if (pactid == "all") {
// 2022cvt_015
	LocalLogFile = dataDir + "/import_docomoDLP.log";
} else {
	LocalLogFile = dataDir + "/" + pactid + "/import_docomoDLP.log";
}

if (DEBUG_FLG) {
	logging("START: docomoDLP請求データ取込処理(import_docomoDLP.php)を開始します");
}
// 2022cvt_015
var A_pactid = Array();

if (pactid == "all") ///kcs/data/yyyymm/docomoDLP/bill/以下のディレクトリを開く
	//処理する契約ＩＤを取得する
	{
// 2022cvt_015
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

if (pactCnt == 0 || undefined !== A_pactid == false) //エラー終了
	{
		if (DEBUG_FLG) {
			logging("ERROR: Pact用データディレクトリが１つもありません");
		}
		logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 Pact用データディレクトリが１つもありません");
		throw process.exit(1);// 2022cvt_009
	}

if (await lock(true, dbh) == false) {
	if (DEBUG_FLG) {
		logging("ERROR: 既に起動しています");
	}
	logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理  既に起動しています");
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
	logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 " + tel_xx_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var tel_xx_fp = fopen(tel_xx_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: tel_XX_tbへのcopy文ファイルOPEN " + tel_xx_filename);
}

var tel_filename = "";
var tel_fp;
if (target == "n") {
// 2022cvt_015
	tel_filename = dataDir + "/tel_tb" + year + month + pactid + ".ins";
// 2022cvt_015
	try {
		tel_fp = fs.openSync(tel_filename, "w");
	} catch (e) {
		if (DEBUG_FLG) {
			logging("ERROR: " + tel_fp + "のオープン失敗");
		}
		logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 " + tel_fp + "のオープン失敗");
		throw process.exit(1);// 2022cvt_009
	}
	// var tel_fp = fopen(tel_filename, "w");

	if (DEBUG_FLG) {
		logging("NFO: tel_tbへのcopy文ファイルOPEN " + tel_filename);
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
	logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 " + teldetail_filename + "のオープン失敗");
	throw process.exit(1);// 2022cvt_009
}
// var teldetail_fp = fopen(teldetail_filename, "w");

if (DEBUG_FLG) {
	logging("INFO: tel_details_XX_tbへのcopy文ファイルOPEN " + teldetail_filename);
}
// 2022cvt_015
var fin_cnt = 0;
var fin_pact = Array();

for (cnt = 0; cnt < pactCnt; cnt++) //取り込むデータ数をカウントするための変数
//エラー用フラグ
//tel_xx_tbへのcopy文をファイルに一度に書き込むためのバッファ
//tel_tbへのcopy文をファイルに一度に書き込むためのバッファ
//対象会社の会社名を取得
//請求データファイル名を取得する
//処理する請求データファイル名配列
//請求データファイルがなかった場合
//ファイル毎のループfor閉じ
//ファイルハンドルが無い時
//最新月を指定している時はtel_tb用のファイルにも書き込み
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
	var detail_xx_write_buf = "";
// 2022cvt_015
	var PACT_result = await dbh.getOne("select compname from pact_tb where pactid = " + dbh.escape(A_pactid[cnt]) + ";", true);

	if (PACT_result == "") {
		if (DEBUG_FLG) {
			logging("WARNING:  対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		}
		logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 対象会社コード（" + A_pactid[cnt] + "）は登録されていません");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象会社の会社名を取得 " + PACT_result);
	}
	if (DEBUG_FLG) logging("INFO: " + PACT_result + " " + A_pactid[cnt] + "のデータの処理を開始します");
	logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 処理を開始します");
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
		if (fs.statSync(dataDirPact + "/" + fileName).isFile() && fileName.match("/\\.csv$/i")) {
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
		logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 対象ファイルがみつかりません（" + dataDirPact + "）");
		continue;
	}

	if (DEBUG_FLG) {
		logging("INFO: 対象請求データファイル数 " + fileCnt);
	}
// 2022cvt_015
	var get_telx_sql = "select telno from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " and carid = " + DLP_CARID + " ;";
// 2022cvt_015
	var TEL_result = await dbh.getCol(get_telx_sql, true);
	var TEL_now_result = Array();
	if (DEBUG_FLG) {
		logging("INFO: 対象会社の登録電話のリストを取得 " + TEL_result.length + "件 select telno from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
	}

	var tel_write_buf = "";
	if (target == "n") {
// 2022cvt_015
		TEL_now_result = await dbh.getCol("select telno from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and carid = " + DLP_CARID + ";", true);
		if (DEBUG_FLG) {
			logging("INFO: 最新の登録電話のリストを取得 " + TEL_now_result.length + "件 select telno from tel_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " ;");
		}
// 2022cvt_015
		tel_write_buf = "";
	}

// 2022cvt_015
	var aspFlg = false;
	var asp_tax = 0;

	if (await chkAsp(dbh.escape(A_pactid[cnt])) == true) //ASP使用料が数字以外で返って来た時
		{
			aspFlg = true;
			if (DEBUG_FLG) {
				logging("INFO: ASP利用料表示設定がＯＮ");
			}
// 2022cvt_015
			var asp_charge = await dbh.getOne("select charge from asp_charge_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and carid = " + DLP_CARID + " ;", true);

			if (!isNaN(asp_charge) == false) {
			// if (is_numeric(asp_charge) == false) {
				if (DEBUG_FLG) {
					logging("WARNING: ASP使用料が設定されていません pactid：" + A_pactid[cnt]);
				}
				logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ASP使用料が設定されていません ");
				error_flg = true;
				break;
			}

// 2022cvt_015
			asp_tax = Math.floor(asp_charge * CON_TAX);
			if (DEBUG_FLG) {
				logging("INFO: ASP使用料取得　" + asp_charge);
			}
		}

// 2022cvt_015
	for (var fcnt = 0; fcnt < fileCnt; fcnt++) //対象ファイルオープン
	//-------------------------------------------
	//ファイルのエンコーディングをUTF-8に変更
	//-------------------------------------------
	//ファイルが開けなかった時
	//エラーフラグが立っていたら
	//現在の日付を得る
	//消費税用変数
	//合計金額用変数
	//---------------------------
	//レコード毎の処理（１行毎）
	//---------------------------
	//ファイルポインタを先頭に戻す
	//ファイル１行ずつ処理するwhile閉じ
	//差額処理------------------------------------------------
	//合計金額の差額
	//そしてバッファに追加
	{
// 2022cvt_015
		var infilename = dataDirPact + "/" + A_billFile[fcnt];
// 2022cvt_015
		var buffer = fs.readFileSync(infilename, "utf8");
		var text = Encoding.convert(buffer, {
			from: BEFORE_ENCO,
			to: "UNICODE",
			type: "string"
		});
		// var filesorce = file_get_contents(infilename);
		// filesorce = mb_convert_encoding(filesorce, "UTF-8", BEFORE_ENCO);
// 2022cvt_015
		var ifp;
		try {
			ifp = fs.openSync(infilename, "w");
		} catch (e) {
			if (DEBUG_FLG) {
				logging("ERROR: " + infilename + "のオープン失敗。UTF-8に変換できませんでした。");
			}
			logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 " + infilename + "のオープン失敗。UTF-8に変換できませんでした。");
			throw process.exit(1);// 2022cvt_009
		}
		// var ifp = fopen(infilename, "w");

		fs.writeFileSync(ifp, text);
		// fs.writeFileSync(ifp, filesorce);// 2022cvt_006
		fs.closeSync(ifp);
		// fclose(ifp);
		var buffer = "";
		try {
			buffer = fs.readFileSync(infilename, "utf8");
		} catch (e) {
			if (DEBUG_FLG) {
				logging("WARNING: ファイルのOPENに失敗しました" + infilename);
			}
			logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ファイルのOPENに失敗しました " + infilename);
			error_flg = true;
			break;
		}
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var lines = text.toString().split("\r\n");
		// ifp = fopen(infilename, "r");

		if (DEBUG_FLG) {
			logging("INFO: 対象ファイル=" + infilename);
		}
// 2022cvt_015
		var lcnt = 0;
		var sum_amount = 0;

		var luno = "";
		var inyear = 0;
		var inmonth = 0;
		var sum_taxes = 0;

		for (var line of lines)
		// while (line = fgets(ifp)) //１行目を抽出（合計金額、消費税）
		{
			lcnt++;
// 2022cvt_015
			var A_column = line.split(",");

			if (lcnt == 1) //１カラム目が合計金額、２カラム目が消費税
				//エラーチェック
				{
// 2022cvt_015
					sum_taxes = parseFloat(A_column[1].trim());
// 2022cvt_015
					sum_amount = parseFloat(A_column[0].trim()) - sum_taxes;

					if (!isNaN(sum_amount) == false || !isNaN(sum_taxes) == false) {
					// if (is_numeric(sum_amount) == false || is_numeric(sum_taxes) == false) {
						if (DEBUG_FLG) {
							logging("WARNING: 消費税、合計金額が取得できませんでした " + infilename);
						}
						logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + infilename + " csv、消費税、合計金額が取得できませんでした。処理を中断します。１件も取込ませんでした。 " + infilename);
						error_flg = true;
						break;
					}
				}

			if (lcnt == 2) //１カラム目の年月を取得する
				//エラーチェック
				{
// 2022cvt_015
					inyear = parseInt(A_column[0].substring(0, 4));
// 2022cvt_015
					inmonth = parseInt(A_column[0].substring(5, 2));

					if (!isNaN(inyear) == false || !isNaN(inmonth) == false) {
					// if (is_numeric(inyear) == false || is_numeric(inmonth) == false) {
						if (DEBUG_FLG) {
							logging("WARNING: 利用年月が取得できませんでした " + infilename);
						}
						logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + infilename + " csv、利用年月が取得できませんでした。１件も取込ませんでした。 " + infilename);
						error_flg = true;
						break;
					}
				}

			if (lcnt == 4) //NO.、LU/MS、ノード識別子、電話番号、料金プラン、登録、参照、通知、検索、測位、小計、アクセス料、月額基本料、合計、備考になってるか？
				{
					if (A_column[0].trim() != "NO." || A_column[1].trim() != "LU/MS" || A_column[2].trim() != "ノード識別子" || A_column[3].trim() != "電話番号" || A_column[4].trim() != "料金プラン" || A_column[5].trim() != "登録" || A_column[6].trim() != "参照" || A_column[7].trim() != "通知" || A_column[8].trim() != "検索" || A_column[9].trim() != "測位" || A_column[10].trim() != "小計" || A_column[11].trim() != "アクセス料" || A_column[12].trim() != "月額基本料" || A_column[13].trim() != "合計" || A_column[14].trim() != "備考") {
						if (DEBUG_FLG) {
							logging("WARNING: フォーマットが異なります " + infilename);
						}
						logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + infilename + " csvファイルのフォーマットが異なります。処理を中断します。１件も取込ませんでした。 " + infilename);
						error_flg = true;
						break;
					}
				}

			if (lcnt == 5) //エラーチェック
				//このループは終わり
				{
					if (A_column[1] != "LU") {
						if (DEBUG_FLG) {
							logging("WARNING: 5行目がLUではありません " + infilename);
						}
						logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + infilename + " csv、5行目がLUではありません。処理を中断します。１件も取込ませんでした。 " + infilename);
						error_flg = true;
						break;
					}

// 2022cvt_015
					luno = A_column[2];
					break;
				}

			if (lcnt > 5) {
				break;
			}
		}

		if (error_flg == true) {
			break;
		}

		if (-1 !== TEL_result.toString().indexOf(luno) == false) {
			if (DEBUG_FLG) {
				logging("WARNING: ファイルのLU番号が登録されていないか、登録されているLU番号と異なります " + infilename);
			}
			logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " ファイルのLU番号が登録されていないか、登録されているLU番号と異なります " + infilename);
			error_flg = true;
			break;
		}

// 2022cvt_015
		var trg_post = await dbh.getOne("select postid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " and telno = '" + luno + "' and carid=" + DLP_CARID + ";", true);

		if (trg_post == "") {
			if (DEBUG_FLG) {
				logging("WARNING: 部署が正しく登録されていません" + "select postid from " + telX_tb + " where pactid = " + dbh.escape(A_pactid[cnt]) + " and telno = " + luno + ";");
			}
			logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理" + PACT_result + " " + A_pactid[cnt] + " 部署が正しく登録されていません");
			continue;
		}

		if (DEBUG_FLG) {
			logging("INFO: 部署のpostid取得 postid=" + trg_post + " select postidparent from post_relation_tb where pactid = " + dbh.escape(A_pactid[cnt]) + " and telno = " + luno + ";");
		}

		if (inyear != A_riyou.year || inmonth != A_riyou.month) {
			if (DEBUG_FLG) {
				logging("WARNING: 対象年月が異なります " + infilename);
			}
			logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + " 対象年月が異なります " + infilename);
			error_flg = true;
			break;
		}

// 2022cvt_015
		var nowtime = getTimestamp();
// 2022cvt_015
		var tax_cnt = 0;
// 2022cvt_015
		var amount_cnt = 0;
		// fseek(ifp, 0);

		var lu_tax = 0;

		for (line of lines)
		// while (line = fgets(ifp)) //先頭の項目が数字かつ２つ目の項目がLU/MSだった時のみ実行（その他は無視）
		{
// 2022cvt_015
			var readbuff = line.split(",");
			// var readbuff = chop(line).split(",");

			if (!isNaN(parseInt(readbuff[0])) == true && (readbuff[1] == "LU" || readbuff[1] == "MS"))
			// if (is_numeric(readbuff[0]) == true && (readbuff[1] == "LU" || readbuff[1] == "MS")) //最初のデータのみ（LUの時）の処理
				//ハイフン付の電話番号作成
				//-------------------------------------------
				//ドコモに既に登録されているか？のチェック
				//-------------------------------------------
				//既にドコモに登録済み
				//既にドコモに登録済み
				//基本使用料
				{
					out_rec_cnt++;

					if (readbuff[1] == "LU") //電話番号が空なのでノード番号をコピー
						{
							readbuff[3] = readbuff[2];
						}

					readbuff[3] = readbuff[3].replace("TEL:", "");
					// readbuff[3] = trim(readbuff[3], "TEL:");

// 2022cvt_019
					if (readbuff[3].match("/^0[789]0/") && readbuff[3].length >= 11)
					// if (preg_match("/^0[789]0/", readbuff[3]) && readbuff[3].length >= 11) //070, 080, 090 のいずれかで始まっていたら"-"を入れ込む
						{
// 2022cvt_015
							var telno_view = readbuff[3].substring(0, 3) + "-" + readbuff[3].substring(3, 4) + "-" + readbuff[3].substring(7);
						} else {
						telno_view = readbuff[3];
					}

// 2022cvt_015
					var telX_username = "";
// 2022cvt_015
					var telX_post = trg_post;
// 2022cvt_015
					var get_telX = "select postid,userid,username from " + telX_tb + " where telno = '" + readbuff[3] + "'";
// 2022cvt_015
					var H_telXinfo = await dbh.getHash(get_telX);

					if (H_telXinfo.length > 0) {
						telX_post = H_telXinfo[0].postid;
						telX_username = H_telXinfo[0].username;
					}

// 2022cvt_019
					if (-1 !== TEL_result.toString().indexOf(readbuff[3]) == false && !tel_xx_write_buf.match("/" + readbuff[3] + "/"))
					// if (-1 !== TEL_result.indexOf(readbuff[3]) == false && preg_match("/" + readbuff[3] + "/", tel_xx_write_buf) == false) //tel_xx_tbへのコピー文のバッファ
						//すでにバッファにその電話があれば追加しないが、無ければ追加
						{
// 2022cvt_015
							var copy_buf = A_pactid[cnt] + "\t" + telX_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + DLP_CARID + "\t" + AREAID + "\t" + CIRID + "\t" + telX_username + "\t" + nowtime + "\t" + nowtime + "\n";

// 2022cvt_019
							if (!tel_xx_write_buf.match("/" + readbuff[3] + "/")) {
							// if (preg_match("/" + readbuff[3] + "/", tel_xx_write_buf) == false) {
								tel_xx_write_buf += copy_buf;
							}
						}

// 2022cvt_015
					var tel_username = "";
// 2022cvt_015
					var tel_post = trg_post;
// 2022cvt_015
					var get_tel = "select postid,userid,username from tel_tb where telno = '" + readbuff[3] + "'";
// 2022cvt_015
					var H_telinfo = await dbh.getHash(get_tel);

					if (H_telinfo.length > 0) {
						tel_post = H_telinfo[0].postid;
						tel_username = H_telinfo[0].username;
					}

					if (target == "n") {
						if (undefined !== telno_view == false) {
							telno_view = readbuff[3];
						}

// 2022cvt_019
						if(-1 !== TEL_now_result.toString().indexOf(readbuff[3]) == false && !tel_write_buf.match("/" + readbuff[3] + "/")) {
						// if (-1 !== TEL_now_result.indexOf(readbuff[3]) == false && preg_match("/" + readbuff[3] + "/", tel_write_buf) == false) {
							copy_buf = A_pactid[cnt] + "\t" + tel_post + "\t" + readbuff[3] + "\t" + telno_view + "\t" + DLP_CARID + "\t" + AREAID + "\t" + CIRID + "\t" + tel_username + "\t" + nowtime + "\t" + nowtime + "\n";
							tel_write_buf += copy_buf;
						}
					}

// 2022cvt_015
					var viewcnt = 1;
					copy_buf = "";

					if (readbuff[12] != "") //すでにバッファにその電話があれば先に行番号加算
						{
// 2022cvt_019
							if (write_buf.match("/" + readbuff[3] + "/"))
							// if (preg_match("/" + readbuff[3] + "/", write_buf) == true) //既にバッファにある電話番号の最後の行カウントを取得する
								//ASP利用料がONの場合
								//検索文字列以降の文字列を取得
								//配列の最後の要素番号
								//必要な数字以外を削除
								//さらに元のASP使用料、ASP消費税があれば消す
								{
									if (aspFlg == true) //検索文字列バターン
										//検索文字列バターン
										{
// 2022cvt_015
											var patern_a = A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\tASP使用料\t\d{1,}?\t\t\d{1,}";
// 2022cvt_015
											var patern_b = A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\tASP使用料\t\d{1,}?\t\t";
										} else //検索文字列バターン
										//検索文字列バターン
										{
											patern_a = A_pactid[cnt] + "\t" + readbuff[3] + "\t228\t消費税\t\d{1,}?\t\t\d{1,}";
											patern_b = A_pactid[cnt] + "\t" + readbuff[3] + "\t228\t消費税\t\d{1,}?\t\t";
										}

									var A_match = "";
									preg_match_all("/" + patern_a + "/", write_buf, A_match);
									// preg_match_all("/" + patern_a + "/", write_buf, A_match, PREG_PATTERN_ORDER);
// 2022cvt_015
									var last_num = A_match[0].length - 1;
									viewcnt = parseInt(A_match[0][last_num].replace("/" + patern_b + "/", ""));
									// viewcnt = preg_replace("/" + patern_b + "/", "", A_match[0][last_num]);

									if (aspFlg == true) {
										viewcnt = viewcnt - 1;
									} else {
										viewcnt = viewcnt + 1;
									}

									A_match = "";
									// delete A_match;

// 2022cvt_019
									if (write_buf.match("/" + A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "/")) {
									// if (preg_match("/" + A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "/", write_buf) == true) {
										write_buf = write_buf.replace("/" + A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\t.*?\n/", "",);
										// write_buf = preg_replace("/" + A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\t.*?\n/", "", write_buf);
										write_buf = write_buf.replace("/" + A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\t.*?\n/", "");
										// write_buf = preg_replace("/" + A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\t.*?\n/", "", write_buf);
									}
								}

							if (undefined !== readbuff[14] == true && readbuff[14] != "") {
								write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t181\tDLPサービス月額基本使用料" + month_view + "月請求（" + readbuff[14] + "）\t" + readbuff[12] + "\t合算\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
							} else {
								write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t181\tDLPサービス月額基本使用料" + month_view + "月請求\t" + readbuff[12] + "\t合算\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
							}

							viewcnt++;
						}

					if (readbuff[5] != "") {
						write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t076\tDLPサービスアクセス料（登録）\t" + readbuff[5] + "\t合算\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						viewcnt++;
					}

					if (readbuff[6] != "") {
						write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t004\tDLPサービスアクセス料（参照）\t" + readbuff[6] + "\t合算\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						viewcnt++;
					}

					if (readbuff[7] != "") {
						write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t036\tDLPサービスアクセス料（通知）\t" + readbuff[7] + "\t合算\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						viewcnt++;
					}

					if (readbuff[8] != "") {
						write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t131\tDLPサービスアクセス料（検索）\t" + readbuff[8] + "\t合算\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						viewcnt++;
					}

					if (readbuff[9] != "") {
						write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t009\tDLPサービスアクセス料（測位）\t" + readbuff[9] + "\t合算\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						viewcnt++;
					}

					if (readbuff[10] != "") //LUの時は後でバッファに追加するので今は消費税だけ取っておく
						//ファイル単位合計の金額を調べる為全ての合計を加えていく
						//合計の消費税を調べる為全ての消費税を加えていく（小数点以下切捨て）
						{
							if (readbuff[1] == "LU") {
// 2022cvt_015
								lu_tax = Math.floor(parseFloat(readbuff[13]) * CON_TAX);
							} else {
								write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t228\t消費税\t" + Math.floor(parseFloat(readbuff[13]) * CON_TAX) + "\t\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
							}

							amount_cnt += parseFloat(readbuff[13]);
							tax_cnt += Math.floor(parseFloat(readbuff[13]) * CON_TAX);
							viewcnt++;
						}

					if (aspFlg == true) //合計行のために１つ表示順を空ける
						{
							viewcnt++;
							write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\tASP使用料\t" + asp_charge + "\t\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
							viewcnt++;
							write_buf += A_pactid[cnt] + "\t" + readbuff[3] + "\t" + G_CODE_ASP + "\tASP使用料消費税\t" + asp_tax + "\t\t" + viewcnt + "\t" + nowtime + "\t" + DLP_CARID + "\n";
						}
				}
		}

// 2022cvt_015
		var amount_sagaku = sum_amount - amount_cnt;

		if (amount_sagaku != 0) {
			if (DEBUG_FLG) {
				logging("WARNING: " + infilename + "  ファイルの１行目の合計金額（" + sum_amount + "）と各レコードの合計金額が違います（" + amount_cnt + "）");
			}
			logh.putError(G_SCRIPT_WARNING, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + "  " + infilename + "  ファイルの１行目の合計金額（" + sum_amount + "）と各レコードの合計金額が違います（" + amount_cnt + "）");
			error_flg = true;
			break;
		}

// 2022cvt_015
		var tax_sagaku = sum_taxes - tax_cnt;
		lu_tax = lu_tax + tax_sagaku;
		write_buf += A_pactid[cnt] + "\t" + luno + "\t" + "228" + "\t" + "消費税" + "\t" + lu_tax + "\t\t" + TAX_VIEWCNT + "\t" + nowtime + "\t" + DLP_CARID + "\n";
	}

	if (ifp == undefined) {
		fs.closeSync(ifp);
	}

	if (error_flg == true) {
		continue;
	}

	fs.writeFileSync(tel_xx_fp, tel_xx_write_buf);// 2022cvt_006
	// fflush(tel_xx_fp);

	if (target == "n") {
		fs.writeFileSync(tel_fp!, tel_write_buf);// 2022cvt_006
		// fflush(tel_fp);
	}

	fs.writeFileSync(teldetail_fp, write_buf);// 2022cvt_006
	// fflush(teldetail_fp);
	if (DEBUG_FLG) {
		logging("INFO: " + PACT_result + " " + A_pactid[cnt] + " " + out_rec_cnt + "件のデータの処理を行いました");
	}
	logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP請求データ取込処理 " + PACT_result + " " + A_pactid[cnt] + ` . ${out_rec_cnt}` + "件の処理を行いました");
	fin_pact = Array();
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
		logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 １件も成功しませんでした");
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
			logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 " + teldetailX_tb + "のデータエクスポートに失敗しました" + teldetailX_exp);
		} else {
			if (DEBUG_FLG) {
				logging("INFO: " + teldetailX_tb + "のデータエクスポートを行いました " + teldetailX_exp);
			}
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
		dbh.query("delete from " + teldetailX_tb + " where pactid IN(" + pactin + ") and carid=" + DLP_CARID + ";", true);
		if (DEBUG_FLG) {
			logging("INFO: " + teldetailX_tb + "の既存データの削除を行いました " + "delete from" + teldetailX_tb + " where pactid IN(" + pactin + ") and carid=" + DLP_CARID + ";");
		}
		logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP請求データ取込処理 " + teldetailX_tb + "の既存データの削除を行いました" + teldetailX_tb);
	}

if (fs.statSync(tel_xx_filename).size != 0)
// if (filesize(tel_xx_filename) != 0) //tel_X_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "username", "recdate", "fixdate"];
		var rtn2 = await doCopyInsert(telX_tb, tel_xx_filename, telX_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + telX_tb + "のデータインポートに失敗しました ");
					logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 " + telX_tb + "のデータインポートに失敗しました ");
				}
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + telX_tb + "のデータインポートを行いました " + tel_xx_filename);
			}
			logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP請求データ取込処理 " + telX_tb + "のデータインポートを行いました " + tel_xx_filename);
		}
	}

if (target == "n") {
	if (fs.statSync(tel_filename).size != 0)
	// if (filesize(tel_filename) != 0) //tel_tb へインポート
		//インポート失敗した場合
		{
// 2022cvt_015
			var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "username", "recdate", "fixdate"];
			rtn2 = await doCopyInsert("tel_tb", tel_filename, tel_col, dbh);

			if (rtn2 != 0) //ロールバック
				{
					if (DEBUG_FLG) {
						logging("ERROR: TEL_TBのデータインポートに失敗しました ");
					}
					logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 TEL_TBのデータインポートに失敗しました ");
					dbh.rollback();
					throw process.exit(1);// 2022cvt_009
				} else {
				if (DEBUG_FLG) {
					logging("INFO: TEL_TBのデータインポートを行いました " + tel_filename);
				}
				logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP請求データ取込処理 TEL_TBのデータインポートを行いました " + tel_filename);
			}
		}
}

if (fs.statSync(teldetail_filename).size != 0)
// if (filesize(teldetail_filename) != 0) //tel_details_X_tb へインポート
	//インポート失敗した場合
	{
// 2022cvt_015
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid"];
		rtn2 = await doCopyInsert(teldetailX_tb, teldetail_filename, teldetailX_col, dbh);

		if (rtn2 != 0) //ロールバック
			{
				if (DEBUG_FLG) {
					logging("ERROR: " + teldetailX_tb + "のデータインポートに失敗しました ");
				}
				logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理 " + teldetailX_tb + "のデータインポートに失敗しました ");
				dbh.rollback();
				throw process.exit(1);// 2022cvt_009
			} else {
			if (DEBUG_FLG) {
				logging("INFO: " + teldetailX_tb + "のデータインポートを行いました " + teldetail_filename);
			}
			logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP請求データ取込処理 " + teldetailX_tb + "のデータインポートを行いました " + teldetail_filename);
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
				if (DEBUG_FLG) logging("INFO: 完了ディレクトリの作成しました " + finDir);
				logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP請求データ取込処理  完了ディレクトリの作成しました " + finDir);
			} catch (e) {
				if (DEBUG_FLG) logging("ERROR: 完了ディレクトリの作成に失敗しました " + finDir);
				logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理  完了ディレクトリの作成に失敗しました " + finDir);
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
				if (DEBUG_FLG) logging("INFO: ファイルの移動をしました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_INFO, "import_docomoDLP.php docomoDLP請求データ取込処理  ファイルの移動をしました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			} catch (e) {
				if (DEBUG_FLG) logging("ERROR: ファイルの移動に失敗しました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
				logh.putError(G_SCRIPT_ERROR, "import_docomoDLP.php docomoDLP請求データ取込処理  ファイルの移動に失敗しました " + dataDir + "/" + fin_pact[cnt] + "/" + copyfileName);
			}
		}

// 		clearstatcache();// 2022cvt_012
	}

	// closedir(dirh);
}

lock(false, dbh);
console.log("docomoDLP請求データ取込処理(import_docomoDLP.php)を終了しました。\n");
if (DEBUG_FLG) {
	logging("END: docomoDLP請求データ取込処理(import_docomoDLP.php)を終了しました");
}
logh.putError(G_SCRIPT_END, "import_docomoDLP.php docomoDLP請求データ取込処理 処理を終了しました");
throw process.exit(0);// 2022cvt_009

	async function doCopyInsert(table: string, filename: string, columns: Array<any>, db: ScriptDB) //ファイルを開く
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	// if (!("logh" in global)) logh = undefined;
// 2022cvt_015
	var buffer = "";
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
	// while (line = fgets(fp)) //tabで区切り配列に
	//要素数チェック
	//カラム名をキーにした配列を作る
	//インサート行の追加
	{
// 2022cvt_015
		var A_line = line.split("\t");
		// var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) {
			logh.putError(G_SCRIPT_ERROR, filename + "のデータ数が設定と異なります。データ=" + line);
			// fclose(fp);
			return 1;
		}

// 2022cvt_015
		var H_ins: { [key: string]: any } = {};
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
	var log_buf = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + " : " + lstr + "\n";
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

function getRiyouYM(year: number, month: number) //１月請求の時は１２月、年も－１
{
// 2022cvt_015
	var A_riyou: { [key: string]: any } = {};
// 2022cvt_015
	var riyou_year = year;
// 2022cvt_015
	var riyou_month = month - 1;

	if (month == 1) {
		riyou_month = 12;
		riyou_year = year - 1;
	}

	A_riyou.year = riyou_year;
	A_riyou.month = riyou_month;
	return A_riyou;
};
})();
