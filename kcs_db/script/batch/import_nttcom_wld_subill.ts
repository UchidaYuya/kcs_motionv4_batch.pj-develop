//===========================================================================
//機能：請求情報ファイルインポートプロセス（NTT-Com国際専用）
//import_nttcom_wld.php->import_nttcom_wld_bill.php->import_nttcom_wld_subillで連動して動作
//
//作成：五十嵐
//備考：import_nttcom_int.phpを改変
//改変：要望により、請求明細の内訳コードを「1000:国際通話料」と「5000:割引額」に変更 20070913iga
//tel_X_tbのtelno_viewに入る番号にハイフンをつけるよう修正 20070913iga
//===========================================================================

// error_reporting(E_ALL);

// require("lib/script_db.php");
import TableNo, { ScriptDB, TableInserter } from "../../script/batch/lib/script_db"

// require("lib/script_log.php");
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_DEBUG, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../../script/batch/lib/script_log"

import * as fs from "fs"
// import Encoding from "encoding-japanese"
import * as Encoding from "encoding-japanese";
import * as flock from "proper-lockfile";
// import flock from "proper-lockfile"
import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define"
import { G_AUTH_ASP, G_CODE_ASP, G_CODE_ASX, G_EXCISE_RATE } from "./lib/script_common"
import { expDataByCursor } from "../pg_function"
import { convertToObject } from "typescript";


(async () => {
	
// このスクリプトの日本語処理名
const SCRIPT_NAMEJ = "NTT-Com国際請求情報ファイルインポート";

const NTTCOM_DIR = "/NTT_com/world";
const NTTCOM_PAT = "/^W/i";	// 国際はW
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const LINE_LENGTH = 128;	// レコード１行の長さ 512から129に変更 20070115iga
const NTTCOM_CARRIER_ID = 14;	// NTTコミュニケーションズのキャリアID
const NET_KIND = 4;	// 国際の場合、網種別は"4"
const NTTCOM_AREA_ID = 45;	// NTTコミュニケーションズの地域コード
const NTTCOM_CIRCUIT_ID = 31;	// NTTコミュニケーションズの回線ID
const NTTCOM_TUWA_TYPE = "CW";	// NTTコミュニケーションズの通話種別 20070123
const FILE_EXT = "_wld";	// 国際電話を表す接尾子
const REF_HOUZIN_KIHON = "0009999996";	// 法人向割引基本料金を表す参照番号
const REF_HOUZIN_WARI = "0009999997";	// 法人向割引額を表す参照番号
const REF_TYOUSEI = "0009999999";		// 調整金を表す参照番号
const REF_NTTCOM_TYOSEI = "comtyosei";	// 按分追加 20071005iga
const REF_NTTCOM_WARI = "5000";	// 割引を全て5000に置換 20070913iga
const TAX_RATE = 1.05;	//消費税率
const H_TAX = "h_tax";	// 消費税の内訳コード
const G_CODE_TUWA = "ﾂｳﾜﾘﾖｳｷﾝ";	// 通話料金合計の内訳コード変更 20070913iga
const G_CODE_WARI = "ﾜﾘﾋﾞｷｶﾞｸ";	//20071003iga
const PORTABLE_CARRIER = "1,2,3,4,5,6";
const DATA_KIND = "2";	// データ区分

// 固定長フォーマットの定義
// NTT-comの国際電話取込用 20061226iga
// ヘッダーコード (仕様書では年月日が1項目にまとめられてたのをバラした(33,35,37))
// 振替用
var Furikomi_POS = [1, 2, 3, 32, 39, 45, 50, 54, 57, 58, 66, 81, 101, 128];
// 振込用
var Furikae_POS = [1, 2, 3, 33, 35, 37, 39, 45, 50, 62, 66, 77, 128];
// トレーラレコード
var Trail_POS = [1, 2, 8, 18, 128];
// データレコード
// 料金明細
var Seiky_POS = [1, 13, 13, 25, 29, 52, 60, 68, 78, 91, 106, 107, 127];
// 通話明細
var Tuwa_POS = [1, 13, 25, 29, 33, 46, 52, 60, 61, 67, 68, 78, 91, 106, 107, 114, 126, 127];
// 参照番号の固定値
var FixReferNo = [REF_HOUZIN_KIHON, REF_HOUZIN_WARI, REF_TYOUSEI];
// 税区分コード表 使わない
var H_Zei_CODE: { [key: string]: string } = {
	"10": "課税対象料金",
	"00": ""
};
const TAXATION = "10";
const TAXFREE = "00";
// 共通ログファイル名
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
// ログListener を作成
var log_listener = new ScriptLogBase(0);
// ログファイル名、ログ出力タイプを設定
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
// 標準出力に出してみる.
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
// ログListener にログファイル名、ログ出力タイプを渡す
log_listener.putListener(log_listener_type);
log_listener.putListener(log_listener_type2);
// DBハンドル作成
var dbh = new ScriptDB(log_listener);
// エラー出力用ハンドル
var logh = new ScriptLogAdaptor(log_listener, true);

// 開始メッセージ
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

// global変数
var year = 0;
var month = 0;
var billdate = "";
var pactid_in = "";
var backup = "";
var mode = "";
var g_anbun = "";
var telno = "";
var pactname = "";
var A_commFileData = Array();
var thisyear = "";
var TotalUp = 0;
var allTotalUp = 0;
var H_overTel = {};
var H_regPost = {};
var A_telnoX = Array();
var dummypost = "";
var ReadMeisaiCnt = 0;
var H_TuwaCharge = Array();
var A_codes = Array();
var ReadTelCnt = 0;
// var billno = "";
var billno;
var dummytelno = "";
var H_TeltoCnt = Array();
var H_taxCharge = Array();
var A_telXData = Array();
var AddTelXCnt = 0;
var A_telnoCom = Array();
var A_MemTelno = Array();
var file_telX = "";
var fp_commhistory = 0;
var file_commhistory = "";
var fp_teldetails = 0;
var file_teldetails = "";

// パラメータチェック
// パラメータを1つ削除(NTTcom国際電話は全て当月なので-tをなくした) 20070130iga
// 按分用に一つ増えた 20071003iga
if (process.argv.length != 6 + 1) {
	//数が正しくない
	usage("", dbh);
	throw process.exit(1);
}

var argvCnt = process.argv.length;
// $cnt 0 はスクリプト名のため無視
for (var cnt = 1 + 1; cnt < argvCnt; cnt++) {
	// mode を取得
	if (process.argv[cnt].match("-e=")) {
	// if (ereg("^-e=", _SERVER.argv[cnt]) == true) {

		mode = process.argv[cnt].replace("-e=", "").toLowerCase();
		// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();
		// モード文字列チェック
		if (!mode.match(/^[ao]$/)) {
		// if (ereg("^[ao]$", mode) == false) {
			usage("ERROR: モードの指定が不正です", dbh);
		}

			continue;
		}

	// 請求年月を取得
	if (process.argv[cnt].match("-y=")) {
	// if (ereg("^-y=", _SERVER.argv[cnt]) == true) {

		billdate = process.argv[cnt].replace("-y=", "")
		// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);
		// 請求年月文字列チェック
		if (!billdate.match(/^[0-9]{6}$/)) {

		// if (ereg("^[0-9]{6}$", billdate) == false) {
			usage("ERROR: 請求年月の指定が不正です", dbh);
		} else {
			year = parseInt(billdate.substring(0, 4))
			// var year = billdate.substr(0, 4);
			month = parseInt(billdate.substring(4, 6))
			// var month = billdate.substr(4, 2);
			// 年月チェック
			if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
				usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
			}
		}

		var diffmon = (new Date().getFullYear() - year) * 12 + (new Date().getMonth() + 1 - month)
		// var diffmon = (date("Y") - year) * 12 + (date("m") - month);

		if (diffmon < 0) {
			usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
		} else if (diffmon >= 24) {
			usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
		}

		continue;
	}

	// 契約ＩＤを取得
	if (process.argv[cnt].match("-p=")) {
	// ereg("^-p=", _SERVER.argv[cnt]) == true) {
		pactid_in = process.argv[cnt].replace("-p=", "").toLowerCase();
		// var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

		// 契約ＩＤチェック
		if (!pactid_in.match("^all$") && !pactid_in.match(/^[0-9]+$/)) {
		// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
			usage("ERROR: 契約ＩＤの指定が不正です", dbh);
		}

		continue;
	}

	// バックアップの有無を取得
	if (process.argv[cnt].match("-b=")) {
	// if (ereg("^-b=", _SERVER.argv[cnt]) == true) {

		backup = process.argv[cnt].replace("-b=", "").toLowerCase();
		// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

		// バックアップの有無のチェック
		if (!backup.match(/^[ny]$/)) {
		// if (ereg("^[ny]$", backup) == false) {
			usage("ERROR: バックアップの指定が不正です", dbh);
		}

		continue;
	}

	// 按分 20071003iga
	if (process.argv[cnt].match("-a=")) {
	// if (ereg("^-a=", _SERVER.argv[cnt]) == true) {
		g_anbun = process.argv[cnt].replace("-a=", "").toLowerCase();
		// var g_anbun = ereg_replace("^-a=", "", _SERVER.argv[cnt]).toLowerCase();

		// 按分チェック
		if (!g_anbun.match(/^[ny]$/)) {
		// if (ereg("^[ny]$", g_anbun) == false) {
			usage("ERROR: 按分の指定が不正です", dbh);
		}

		// パラメータの指定が不正の場合のみここを通る
		continue;
	}

	usage("", dbh);
}

console.log('ok...')
// 請求データファイルがあるディレクトリを指定
var dataDir = DATA_DIR + "/" + billdate + NTTCOM_DIR;

if (fs.existsSync(dataDir) == false) {
	console.log(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません.")
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません.");
}

var A_pactid = Array();	// 処理する契約ＩＤ配列
var A_pactDone = Array();	// 処理が終了した pactid を格納するための配列
var A_pactFailed = Array();	// 処理が失敗した pactid を格納するための配列

var fileName = "";

// 契約ＩＤの指定が全て（all）の時
if (pactid_in == "all") {
		var dirh = fs.readdirSync(dataDir);
		// var dirh = openDir(dataDir);

		// 処理する契約ＩＤを取得する
		for (var fileName of dirh) {
		// while (fileName = fs.readdir(dirh)) {
			// カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {
				A_pactid.push(fileName);
			}

// 			clearstatcache();
		}
		// closedir(dirh);

// 契約ＩＤが指定されている場合
} else {
	A_pactid.push(pactid_in);
}

if (A_pactid.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Pact用データディレクトリが１つもありません.");
	throw process.exit(1);
}

// utiwake_tb より内訳レコードを取得する.
var sql = "select code,name, kananame from utiwake_tb where carid=" + NTTCOM_CARRIER_ID;
var H_result = await dbh.getHash(sql, true);
// console.log(H_result)
//単体テスト
H_result = [
	{
		"code": "2",
		"name": "test02",
		"lamoku": "1",
		"point": "ture",
		"taxtype": "123",
		"planflg": "ture",
		"codetype": "1",
		"carid": "14",
		"simkamoku": "2",
		"kananame": "test",
		"username": "test",
		"comment": "test",
		"fixdate": "2022-12-23 08:00:00",
		"recdate": "2022-12-23 17:00:00"
	}
]

// 法人向割引(0009999997)は5000:割引額に置換する 20070913iga
sql = "select code,name, kananame from utiwake_tb where code='" + REF_NTTCOM_WARI + "' and carid=" + NTTCOM_CARRIER_ID;
var H_waribiki = await dbh.getHash(sql, true);
// console.log(H_waribiki)
//単体テスト
H_waribiki = [
	{
		"code": "2",
		"name": "test02",
		"lamoku": "1",
		"point": "ture",
		"taxtype": "123",
		"planflg": "ture",
		"codetype": "1",
		"carid": "14",
		"simkamoku": "2",
		"kananame": "test",
		"username": "test",
		"comment": "test",
		"fixdate": "2022-12-23 08:00:00",
		"recdate": "2022-12-23 17:00:00"
	}
]
var H_utiwake = {};
for (cnt = 0; cnt < H_result.length; cnt++) {
	// ＤＢの内訳コードには"網種別-"が含まれているので、それを除く.
	var code = H_result[cnt].kananame;
	//$code = preg_replace( "/^". NET_KIND . "\-/", "", $code );
	//内訳コード => 内訳内容
	//法人向割引(0009999997)は5000:割引額に置換 20070913iga

	if (-1 !== FixReferNo.indexOf(code) == true) {
		H_utiwake[code] = H_waribiki[0];
	} else {
		H_utiwake[code] = H_result[cnt];
	}
}

// テーブルＮＯ取得
var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);

// テーブル名設定
var telX_tb = "tel_" + tableNo + "_tb";
var postrelX_tb = "post_relation_" + tableNo + "_tb";
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
var commhistoryX_tb = "commhistory_" + tableNo + "_tb";
var H_telX_info = Array();

// pact_tb より登録されている契約ＩＤ、会社名を取得
sql = "select pactid,compname from pact_tb order by pactid";
H_result = await dbh.getHash(sql, true);
// console.log(H_result)
//単体テスト
H_waribiki = [
	{
		"pactid": "2",
		"userid_ini": "test02",
		"compname": "1",
		"crg_post": "test",
		"chargername": "test",
		"zip": "test",
		"addr1": "test",
		"addr2": "test",
		"building": "test",
		"telno": "test",
		"faxno": "test",
		"mail": "test.test",
		"logo": "testtest",
		"inquiry": "test",
		"manual": "test",
		"recdate": "2022-12-23 09:00:00",
		"fixdate": "2022-12-23 18:00:00",
		"kousilimitday": "2",
		"helpfile": "off",
		"type": "test",
		"delflg": "ture",
		"groupid": "13",
		"ev_pactcode": "test",
		"ev_agentid": "1234",
		"orderregisttype": "1"
	}
]
var pactCnt = H_result.length;

var H_pactid = Array();
// 会社名マスターを作成
for (cnt = 0; cnt < pactCnt; cnt++) {
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

// utiwake_tbから登録されている内訳半角カナ名称を取得
sql = "SELECT kananame FROM utiwake_tb WHERE carid=" + NTTCOM_CARRIER_ID;
var H_RemarkName = await dbh.getCol(sql, true);
// console.log(H_RemarkName)
//単体テスト
H_RemarkName = [
	{
		"code": "2",
		"name": "test02",
		"lamoku": "1",
		"point": "ture",
		"taxtype": "123",
		"planflg": "ture",
		"codetype": "1",
		"carid": "14",
		"simkamoku": "2",
		"kananame": "test",
		"username": "test",
		"comment": "test",
		"fixdate": "2022-12-23 08:00:00",
		"recdate": "2022-12-23 17:00:00"
	}
]
// 処理する契約ＩＤ
pactCnt = A_pactid.length;
A_pactid.sort();

// 全てのPactについてLOOP.
for (cnt = 0; cnt < pactCnt; cnt++) {
	// if (undefined !== H_pactid[A_pactid[cnt]] == false) {
	// if (H_pactid[A_pactid[cnt]] == false) {
	// 請求データディレクトリにある契約ＩＤがマスターに登録されているか？
	if (!H_pactid[A_pactid[cnt]]) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " は pact_tb に登録されていません.");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " は pact_tb に登録されていません.");
		continue;
	}

	var pactid = A_pactid[cnt];
	pactname = H_pactid[pactid];

	var A_billFile: string[] = Array();	// 処理する請求データファイル名配列
	var dataDirPact = dataDir + "/" + pactid;
	var dirh = fs.readdirSync(dataDirPact);
	// dirh = openDir(dataDirPact);
	// billno = "";	// 請求番号 20070123iga

	// 請求データファイル名を取得する
	for (var fileName of dirh) {
	// while (fileName = fs.readdir(dirh)) {
		if (fs.statSync(dataDirPact + "/" + fileName).isFile()) {
		// if (is_file(dataDirPact + "/" + fileName) == true) {
			A_billFile.push(fileName);
		}
		// clearstatcache();
	}
	// 請求データファイルがなかった場合

	if (A_billFile.length == 0) {
		console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "の請求データファイルが見つかりません.");
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "の請求データファイルが見つかりません.");
			// closedir(dirh);
			continue;	// 次のPactの処理にスキップする.
	}
	// データファイルがあればファイル名から請求番号を取得する 20070115iga
	else {
		// ファイルが複数あればシーケンス番号を削る(下3桁をシーケンス番号とする)
		if (A_billFile.length == 1) {
			// 拡張子削る
			// fileName = A_billFile[0].substr(0, A_billFile[0].length - 4);
			fileName = A_billFile[0].substring(0, A_billFile[0].length - 4);
		} else if (A_billFile.length > 1) {
			// fileName = A_billFile[0].substr(0, A_billFile[0].length - 7);
			fileName = A_billFile[0].substring(0, A_billFile[0].length - 7);
		}
		var billsql = "SELECT prtelno FROM bill_prtel_tb WHERE carid=" + NTTCOM_CARRIER_ID + " AND prtelname='" + fileName + "'";
		billno = await dbh.getOne(billsql, true);
		//単体テスト
		// console.log(billno)
	}

	// ログ出力
	console.log(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "処理対象となるファイル：" + A_billFile.join(","));
	logh.putError(G_SCRIPT_DEBUG, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "処理対象となるファイル：" + A_billFile.join(","));

	// closedir(dirh);
	// bill_prtel_tb より請求番号を得る（ここでは親番号ではない）
	A_codes = Array();
	sql = "select prtelno from bill_prtel_tb where pactid=" + pactid + " and carid=" + NTTCOM_CARRIER_ID;
	H_result = await dbh.getHash(sql, true);
	// console.log(H_result)
	//単体テスト
	H_result = [
		{
			"pactid": "2",
			"prtelno": "14",
			"carid": "14",
			"prtelname": "Test01"
		}
	]

	for (var idx = 0; idx < H_result.length; idx++) {
		A_codes.push(H_result[idx].prtelno);
	}
	if (A_codes.length == 0) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "についての請求番号がbill_prtel_tbに見つかりません.");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + pactid + "についての請求番号がbill_prtel_tbに見つかりません.");
			continue;	// 次のPactの処理にスキップする.
	}
	// 請求番号のチェック 比較対象をrecord[6]からbillnoに変更 20070115iga
	if (-1 !== A_codes.indexOf(billno) == false) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "請求番号が違います(" + billno + ").");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "請求番号が違います(" + billno + ").");
	}

	// 請求月電話番号マスター作成 whereのcaridを=から!=に変更 20070114iga
	A_telnoX = Array();
	sql = "select telno, userid, kousiflg, kousiptn, username, employeecode, mail, machine, color, text1, text2, text3, text4, text5," + " text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, int1, int2, int3, date1, date2, memo, username_kana, kousi_fix_flg" + " from " + telX_tb + " where pactid=" + A_pactid[cnt] + " and carid!=" + NTTCOM_CARRIER_ID;
	// 使用者情報コピー用にtelno以降のカラム追加 20071012iga
	var H_telX_tmp = dbh.getHash(sql, true);
	// console.log(H_telX_tmp)

	for (var key in H_telX_tmp) {
		var dat = H_telX_tmp[key];
		A_telnoX.push(dat.telno);
		// H_telX_info[dat.telno] = [dat.userid, dat.machine, dat.color, dat.employeecode, dat.username, dat.mail, dat.text1, dat.text2, dat.text3, dat.text4, dat.text5, dat.text6, dat.text7, dat.text8, dat.text9, dat.text10, dat.text11, dat.text12, dat.text13, dat.text14, dat.text15, dat.int1, dat.int2, dat.int3, dat.date1, dat.date2, preg_replace("/(\n|\r\n|\r)/", "LFkaigyoLF", dat.memo), dat.kousiflg, dat.kousiptn, dat.username_kana, dat.kousi_fix_flg];
		H_telX_info[dat.telno] = [dat.userid, dat.machine, dat.color, dat.employeecode, dat.username, dat.mail, dat.text1, dat.text2, dat.text3, dat.text4, dat.text5, dat.text6, dat.text7, dat.text8, dat.text9, dat.text10, dat.text11, dat.text12, dat.text13, dat.text14, dat.text15, dat.int1, dat.int2, dat.int3, dat.date1, dat.date2, dat.memo.replace("/(\n|\r\n|\r)/", "LFkaigyoLF"), dat.kousiflg, dat.kousiptn, dat.username_kana, dat.kousi_fix_flg];
	}

	// dummy_tbを取得 20070115iga
	sql = "SELECT postid, telno FROM dummy_tel_tb WHERE pactid=" + A_pactid[cnt] + " AND carid=" + NTTCOM_CARRIER_ID + " AND reqno='" + fileName + "'";
	var dummytmp = dbh.getHash(sql, true);
	// console.log(dummytmp)
	if (undefined !== dummytmp[0] == true) {
		dummytelno = dummytmp[0].telno;
		dummypost = dummytmp[0].postid;
	}

	if (backup == "y") {
		console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理開始.");
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理開始.");
		doBackup(dbh);
		console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理完了.");
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理完了.");
	}

	// デリートする前に必要な情報を確保 20070202iga
	H_overTel = {};	//2件以上登録されている電話の件数と部署ID  key:telno val:登録件数,postid
	H_regPost = {};	//1件登録されている電話の所属先部署ID  key:telno val:postid
	A_billFile.sort();
	console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "デリート前処理開始.");
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "デリート前処理開始.");
	// for (var fileName of Object.values(A_billFile)) {
	for (var fileName of A_billFile) {
		if (await preEachFile(dataDirPact + "/" + fileName, pactid, billdate, dbh) != 0) {
			continue;
		}
	}
	console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "デリート前処理完了.");
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "デリート前処理完了.");
	// デリート処理 20070130iga
	dbh.begin();
	if (mode == "o") {
		console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "デリート処理開始.");
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "デリート処理開始.");
		if (doDelete(pactid, dbh) != 0) {
			continue;
		}
		console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "デリート処理完了.");
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "デリート処理完了.");
	}

	// 請求月電話番号マスター作成(NTTcom専用) mode="o"の時は必ずデリート処理後に行う 20070117iga
	A_telnoCom = Array();
	sql = "SELECT telno FROM " + telX_tb + " WHERE pactid=" + A_pactid[cnt] + " AND carid=" + NTTCOM_CARRIER_ID;
	var A_tmptel = await dbh.getHash(sql, true);
	// for (var data of Object.values(A_tmptel)) {
	for (var data of A_tmptel) {
		A_telnoCom.push(data.telno);
	}

	// 各ファイルについての処理 -- ここが読み込みの中心処理
	var A_fileData = Array();	// 詳細データを保存する
	A_telXData = Array();
	A_commFileData = Array(); // commhistory_X_tbインポートデータ出力用配列 20070122iga
	H_TuwaCharge = Array();	// 電話番号別通話料合算 20070125iga
	H_taxCharge = Array(); // 電話番号別消費税合算 20070201iga
	A_MemTelno = Array();	// 20070125iga
	H_TeltoCnt = Array();	// 20070125iga
	thisyear = ""; // 年月取得用 20070123iga
	TotalUp = 0;
	allTotalUp = 0;
	file_telX = dataDir + "/" + telX_tb + billdate + pactid + FILE_EXT + ".tmp";
	file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + FILE_EXT + ".tmp";
	file_commhistory = dataDir + "/" + commhistoryX_tb + billdate + pactid + FILE_EXT + ".tmp";
	var errFlag = false;
	// for (var fileName of Object.values(A_billFile)) //読込電話件
	for (var fileName of A_billFile) {
		console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理開始.");
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理開始.");
		ReadTelCnt = 0;	// 読込電話件
		ReadMeisaiCnt = 0;	// 読込明細件数
		AddTelXCnt = 0;	// 追加する電話数
console.log(dataDirPact + "/" + fileName)
		if (doEachFile(dataDirPact + "/" + fileName, pactid, billdate, A_fileData, dbh) == 1) {
			dbh.rollback();
			errFlag = true;
			break;	// エラーがあったらそこで中断.
		}
		console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理完了:電話件数" + ReadTelCnt + ":明細件数=" + ReadMeisaiCnt + ":追加電話件数(" + telX_tb + ")=" + AddTelXCnt);
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + dataDirPact + "/" + fileName + LOG_DELIM + "データ読込処理完了:電話件数" + ReadTelCnt + ":明細件数=" + ReadMeisaiCnt + ":追加電話件数(" + telX_tb + ")=" + AddTelXCnt);
	}
console.log(errFlag)
	// 正常処理が終わった pactid のみ書き出し処理
	if (!errFlag == false) {
			// ファイルに書き出す
			console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "データ書出処理開始.");
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "データ書出処理開始.");

			if (writeTelData(pactid) != 0) {
				console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_telX + "ファイルの書き出しに失敗.");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_telX + "ファイルの書き出しに失敗.");
				A_pactFailed.push(pactid);	// 失敗を記録する.
				dbh.rollback();
				continue;	// 次のPactの処理にスキップする.
			}

			if ((await writeInsFile(pactid, billdate, A_fileData)) != 0) {
				console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "ファイルの書き出しに失敗.");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "ファイルの書き出しに失敗.");
				A_pactFailed.push(pactid);	// 失敗を記録する.
				dbh.rollback();
				continue;	// 次のPactの処理にスキップする.
			}

			if (writeTuwaFile(pactid, billdate, A_commFileData) != 0) {
				console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "ファイルの書き出しに失敗.");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "ファイルの書き出しに失敗.");
				A_pactFailed.push(pactid);	// 失敗を記録する.
				dbh.rollback();
				continue;	// 次のPactの処理にスキップする.
			}
			// インポート処理
			console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理開始.");
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理開始.");

			if (await doImport(file_telX, file_teldetails, file_commhistory, dbh) != 0) {
				dbh.rollback();
				continue; // 失敗したら次のPactへ.
			}

			console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理完了.");
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理完了.");
			dbh.commit();
			var pactDir = dataDir + "/" + pactid;
			var finDir = pactDir + "/" + FIN_DIR;
			finalData(pactid, pactDir, finDir);
			A_pactDone.push(pactid);
		}
		else { // 失敗を記録する
			dbh.rollback();
			A_pactFailed.push(pactid);
	}
}

// 成功したファイルのPactをキーワード(COMPLETE_PACTS)と共に標準出力に出す.
// このキーワードを親スクリプト側で拾って処理する.
console.log(A_pactDone.length)                                       //コメントコメントコメント
if (A_pactDone.length > 0) {
	console.log("COMPLETE_PACTS," + A_pactDone.join(",") + "\n");
	// print("COMPLETE_PACTS," + A_pactDone.join(",") + "\n");
} else {
	console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "読み込みに成功したPactが１つも無かった.");
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "読み込みに成功したPactが１つも無かった.");
}

// 失敗したファイルのPactをキーワード(FAILED_PACTS)と共に標準出力に出す.
// このキーワードを親スクリプト側で拾って処理する.
if (A_pactFailed.length > 0) {
	console.log("FAILED_PACTS," + A_pactFailed.join(",") + "\n");
	// print("FAILED_PACTS," + A_pactFailed.join(",") + "\n");
}

// 終了メッセージ
console.log(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
throw process.exit(0);

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 各ファイルについての処理
// [引　数] $fileName 対象ファイル名
// [返り値] 終了コード　1（失敗）
function doEachFile(fileName: string, pactid: string, billdate: string, A_fileData: Array<any>, dbh: ScriptDB) //ファイルオープン
//管理レコードのチェック
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("A_commFileData" in global)) A_commFileData = undefined;
	// if (!("thisyear" in global)) thisyear = undefined;
	// if (!("TotalUp" in global)) TotalUp = undefined;
	// if (!("allTotalUp" in global)) allTotalUp = undefined;

	// var fp = fopen(fileName, "rb");
	var buffer;
	try {
		buffer = fs.readFileSync(fileName)
	} catch (e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のオープン失敗.");
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のオープン失敗.");
		return 1;
	}
	var text = Encoding.convert(buffer, {
		from: 'SJIS',
		to: 'UNICODE',
		type: 'string'
	});
	var lines = text.toString().split("\r\n");

	// if (flock(fp, LOCK_SH) == false) {
	if (flock.checkSync(fileName)) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のロックに失敗.");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のロックに失敗.");
		// fclose(fp);
		return 1;
	}
	flock.lockSync(fileName);

	// var line = fgets(fp);
	// line = rtrim(line, "\r\n");

	// 管理レコードのチェック
	console.log("入り")
	if (checkKanriRecord(lines[0], fileName, pactid, billdate, dbh) == 1) {
		flock.unlockSync(text)
		// flock(fp, LOCK_UN);
		// fclose(fp);
		return 1;
	}

	// １行ずつ読み込む.
	var ChargeSum = 0;
	var CompSum = 0;
	for (var line of lines) {
		// if (feof(fp)) //おしまい.
		// 	{
		// 		break;
		// 	}

		// line = rtrim(line, "\r\n");

		// 一行の長さをチェック
		console.log(line.length)
		if (line.length != LINE_LENGTH) {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の一行の長さが異常(" + line.length + "!=" + LINE_LENGTH + ").");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の一行の長さが異常(" + line.length + "!=" + LINE_LENGTH + ").");
			flock.unlockSync(fileName);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return 1;
		}

		// データ種類を見分ける
		// var dataKind = line.substr(0, 1);
		var datakind = line.substring(0, 1);

		// データレコード(通話明細、請求明細)
		if (datakind == "2") {
			// 参照渡し（荒木）
			var sum = { "value": 0 };
			// 通話明細か請求明細か判断する
			// var recKind = line.substr(34, 13).trim();
			var recKind = line.substring(34, 13).trim();

			// 対話地域が入っていたら通話明細
			if (recKind.trim() != "") {
				if (doTuwaRecord(line, pactid, A_commFileData, sum, dbh) == 1) {
					flock.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				}
			}
			// 対話地域がなければ請求明細
			else {
				if (doTelRecord(line, pactid, A_fileData, sum, dbh, recKind) == 1) {
					flock.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				}
			}

			TotalUp += sum.value;
		}
		// 会社合計レコード
		else if (datakind == "3") {
				if (doTotalRecord(line, TotalUp, dbh) == 1) {
					flock.unlockSync(fileName);
					// flock(fp, LOCK_UN);
					// fclose(fp);
					return 1;
				}
				// 複数ファイルの調整額を計算するため、合計額を保存する
				allTotalUp = allTotalUp + TotalUp;
				// 合計額を保存後、ファイル毎の合計額用にTotalUpをリセットする
				TotalUp = 0;
		}
		// 予期しないデータはエラーにする
		else {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "未知のデータ種類(" + datakind + ").");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "未知のデータ種類(" + datakind + ").");
			flock.unlockSync(fileName);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return 1;
		}
	}

	flock.unlockSync(fileName);
	// flock(fp, LOCK_UN);
	// fclose(fp);
	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 各ファイルについての前処理(デリート前に情報を保持する)
// [引　数] $fileName 対象ファイル名
// [返り値] 終了コード　1（失敗）
async function preEachFile(fileName: string, pactid: string, billdate: string, dbh: ScriptDB) {
// 	if (!("H_overTel" in global)) H_overTel = undefined;
// 	if (!("H_regPost" in global)) H_regPost = undefined;
// 	if (!("logh" in global)) logh = undefined;
// 	if (!("pactname" in global)) pactname = undefined;
// 	if (!("A_telnoX" in global)) A_telnoX = undefined;
// 	if (!("telX_tb" in global)) telX_tb = undefined;
// 	if (!("dummypost" in global)) dummypost = undefined;

	// ファイルオープン
	// var fp = fopen(fileName, "rb");
	var buffer;
	try {
		buffer = fs.readFileSync(fileName);
	} catch (e) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のオープン失敗(preEachFile).");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のオープン失敗(preEachFile).");
		return 1;
	}
	const text = Encoding.convert(buffer, {
		from: 'SJIS',
		to: 'UNICODE',
		type: 'string'
	});
	var lines = text.toString().split("\r\n")

	if (flock.checkSync(fileName)) {
	// if (flock(fp, LOCK_SH) == false) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のロックに失敗(preEachFile).");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "のロックに失敗(preEachFile).");
		// fclose(fp);
		return 1;
	}
	flock.lockSync(fileName);

	// var line = fgets(fp);

	// １行目は無視する
	for (var line of lines.splice(1)) {
	// while (line = fgets(fp)) {
		// if (feof(fp)) //おしまい.
		// 	{
		// 		break;
		// 	}

		// line = rtrim(line, "\r\n");

		// １行の長さチェック
		console.log(line.length)
		if (line.length != LINE_LENGTH) {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の一行の長さが異常(" + line.length + "!=" + LINE_LENGTH + ").");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の一行の長さが異常(" + line.length + "!=" + LINE_LENGTH + ").");
			flock.unlockSync(fileName);
			// flock(fp, LOCK_UN);
			// fclose(fp);
			return 1;
		}

		// ヘッダーとトレーラは無視
		// if (line.substr(0, 1) == DATA_KIND)
		if (line.substring(0, 1) == DATA_KIND) {
			// 電話番号とる
			telno = line.substring(13, 12).trim().replace("/[^0-9]/", "")
			// var telno = line.substr(13, 12).trim().replace(/[^0-9]/g, "");

			// telX_tbのNTTコム以外の登録済み存在&登録数チェック
			var A_telCount: { [key: string]: number } = {};
			for (var i=0; i < A_telnoX.length; i++) {
				var key = A_telnoX[i];
				A_telCount[key] = (A_telCount[key]) ? A_telCount[key] + 1 : 1;
			}
			// A_telCount = array_count_values(A_telnoX);

			//telX_tbに複数登録されている電話だけ処理する
			if (undefined !== A_telCount[telno] == true) {
				if (A_telCount[telno] > 1) {
					var sql = "SELECT postid FROM " + telX_tb + " WHERE pactid=" + pactid + "and telno='" + telno + "' and carid!=" + NTTCOM_CARRIER_ID;
					var A_postid = await dbh.getCol(sql, true);
					var A_cnt: { [key: string]: number } = {};
					for (var i=0; i < A_postid.length; i++) {
						var key = A_postid[i];
						A_cnt[key] = (A_cnt[key]) ? A_cnt[key] + 1 : 1;
					}
					// var A_cnt = array_count_values(A_postid);

					if (A_cnt[A_postid[0]] == A_postid.length) {
						H_overTel[telno] = {
							no: 1,
							post: A_postid[0]
						};
					} else {
						//所属部署が同じでなければダミー部署に上げる
						if (undefined !== dummypost == false || dummypost == "") {
							console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "未登録番号：dummy_tel_tbに請求先部署が設定されていません(" + telno + ")");
							logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "未登録番号：dummy_tel_tbに請求先部署が設定されていません(" + telno + ")");
							flock.unlockSync(fileName);
							// flock(fp, LOCK_UN);
							// fclose(fp);
							return 1;
						} else {
							H_overTel[telno] = {
								no: A_postid.length,
								post: dummypost
							};
						}
					}
				} //1件だけなら部署IDを保存しておく
				else if (A_telCount[telno] == 1) {
						sql = "SELECT postid FROM " + telX_tb + " WHERE pactid=" + pactid + "and telno='" + telno + "' and carid!=" + NTTCOM_CARRIER_ID;
						var regpost = dbh.getOne(sql, true);
						H_regPost[telno] = regpost;
					}
				}
			}
	}

	flock.unlockSync(fileName);
	// flock(fp, LOCK_UN);
	// fclose(fp);
	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 管理レコードのチェック
// [引　数] $line 入力レコード
// [返り値] 終了コード　1（失敗）
function checkKanriRecord(line: string, fileName: string, pactid: string, billdate: string, dbh: ScriptDB) {
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("Furikomi_POS" in global)) Furikomi_POS = undefined;
	// if (!("thisyear" in global)) thisyear = undefined;

	// １行の長さチェック
	console.log(line.length)
	console.log(LINE_LENGTH)
	if (line.length != LINE_LENGTH) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の一行の長さが異常(" + line.length + "!=" + LINE_LENGTH + ").");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の一行の長さが異常(" + line.length + "!=" + LINE_LENGTH + ").");
		return 1;
	}

	// 管理レコードの位置設定
	var record = splitFix(line, Furikomi_POS);

	// データ種類チェック
	if (record[0] != "1") {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の管理レコードに異常(" + record[0] + ").");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "の管理レコードに異常(" + record[0] + ").");
		return 1;
	}

	// 年月チェック
	var target_yyyymm = new Date().getFullYear().toString().substring(0, 2);	// 西暦が2桁なので4桁に。(年チェックは実質下2桁で行う) 20070122iga
	// var target_yyyymm = date("Y").substr(0, 2);
	target_yyyymm += record[4].substring(0, 4);
	// target_yyyymm += record[4].substr(0, 4);
	thisyear = target_yyyymm.substring(0, 4);	// doTuwaRecordで使用(commhistory_X_tbの通話開始時間に年を入れるため(月日しかレコードにない)) 20070122iga
	// thisyear = target_yyyymm.substr(0, 4);

	if (target_yyyymm != billdate) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "ファイルの年月が対象年月と異なります(" + target_yyyymm + "!=" + billdate + ").");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + fileName + "ファイルの年月が対象年月と異なります(" + target_yyyymm + "!=" + billdate + ").");
		return 1;
	}

	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 通話明細内訳レコードの処理
// [引　数] $line 入力レコード
// [返り値] 終了コード　1（失敗）
// author igarashi 20070122
function doTuwaRecord(line: string, pactid: string, A_commFileData: Array<string>, sum: { [key: string]: number }, dbh: ScriptDB) {
	// if (!("Tuwa_POS" in global)) Tuwa_POS = undefined;
	// if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	// if (!("thisyear" in global)) thisyear = undefined;
	// if (!("H_TuwaCharge" in global)) H_TuwaCharge = undefined;

	var record = splitFix(line, Tuwa_POS);
	var telno = record[2].replace(/[^0-9]/g, "");

	// 電話番号がなければエラー
	var registflg = 0;
	if (telno == "") {
		return 1;
	} else {
		registTel(telno, pactid, dbh);
	}

	// 開始日付を取得
	var date = thisyear + "-" + record[3].substring(0, 2) + "-" + record[3].substring(2, 4) + " " + record[9].substring(0, 2) + ":" + record[9].substring(2, 2) + ":" + record[9].substring(4, 2);
	// var date = thisyear + "-" + record[3].substr(0, 2) + "-" + record[3].substr(2, 4) + " " + record[9].substr(0, 2) + ":" + record[9].substr(2, 2) + ":" + record[9].substr(4, 2);

	// 通話先電話番号
	var totelno = record[13].trim().replace(/\/[^0-9]\/g/, "")
	// var totelno = rtrim(record[13]).replace(/[^0-9]/g, "");

	// 通話先地域
	var toplace = record[5].trim();

	// 通話時間
	// var time = record[15].trim().substr(0, 3);
	var time = record[15].trim().substring(0, 3);
	time += ":";
	// time += record[15].trim().substr(3, 2);
	time += record[15].trim().substring(3, 2);
	time += ":";
	time += record[15].trim().substring(5, 2);
	// time += record[15].trim().substr(5, 2);

	// 通話料金
	var charge = +record[7].trim();

	if (undefined !== H_TuwaCharge[telno] == false) {
		H_TuwaCharge[telno] = {
			telno: telno,
			charge: 0
		};
	}

	H_TuwaCharge[telno].charge = H_TuwaCharge[telno].charge + charge;
	A_commFileData.push(pactid + "\t" + telno + "\t" + NTTCOM_TUWA_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + "\\N" + "\t" + time + "\t" + charge + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + NTTCOM_CARRIER_ID + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\t" + "\\N" + "\n");
	ReadMeisaiCnt++;
	sum.value += charge;
	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 電話明細内訳レコードの処理
// [引　数] $line 入力レコード
// [返り値] 終了コード　1（失敗）
function doTelRecord(line: string, pactid: string, A_fileData: Array<any[]>, sum: { [key: string]: number }, dbh: ScriptDB, taxkind: string)
{
	// if (!("Seiky_POS" in global)) Seiky_POS = undefined;
	// if (!("FixReferNo" in global)) FixReferNo = undefined;
	// if (!("H_RemarkName" in global)) H_RemarkName = undefined;
	// if (!("A_codes" in global)) A_codes = undefined;
	// if (!("H_utiwake" in global)) H_utiwake = undefined;
	// if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	// if (!("ChargeSum" in global)) ChargeSum = undefined;
	// if (!("CompSum" in global)) CompSum = undefined;
	// if (!("ReadTelCnt" in global)) ReadTelCnt = undefined;
	// if (!("ReadMeisaiCnt" in global)) ReadMeisaiCnt = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("billno" in global)) billno = undefined;
	// if (!("dummypost" in global)) dummypost = undefined;
	// if (!("dummytelno" in global)) dummytelno = undefined;
	// if (!("H_TeltoCnt" in global)) H_TeltoCnt = undefined;
	// if (!("H_taxCharge" in global)) H_taxCharge = undefined;

	// 分割してみる.
	var record = splitFix(line, Seiky_POS);
	record[8] = record[8].trim();
	record[10] = record[10].trim();
	record[10] = Encoding.convert(record[10], { from: "SJIS", to: "UNICODE", type: "string" }).trim();

	// データレコードの種類チェック 20070117iga
	// 法人向明細
	if (-1 !== FixReferNo.indexOf(record[8]) == false && -1 !== H_RemarkName.indexOf(record[10]) == false) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な内訳コードです(" + record[8] + " : " + record[10] + ").");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な内訳コードです(" + record[8] + " : " + record[10] + ").");
		return 1;
	}

	// 電話番号
	var telno = record[3].replace(/[^0-9]/g, "").trim();

	// 電話番号があれば番号の存在チェックをする
	if (telno != "") {
		registTel(telno, pactid, dbh);
	}

	// 電話番号がレコードにない場合はdummy_telに上げる
	if (telno == "") {
		if (!(typeof dummytelno !== undefined && typeof dummytelno !== null) || dummytelno == "") {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "dummy_tel_tbに請求先先電話番号が設定されていません(" + telno + ").");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "dummy_tel_tbに請求先先電話番号が設定されていません(" + telno + ").");
			return 1;
		}

		telno = dummytelno;
	}

	// 税区分 10:内税 13:非課税
	if (record[11] == " ") {
		taxkind = TAXFREE;
	} else if (record[11] == "*") {
		taxkind = TAXATION;
	} else {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な税コードです(" + record[11] + ").");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な税コードです(" + record[11] + ").");
		return 1;
	}

	// 内訳処理する
	// レコードの情報が内訳テーブルになかったらエラー
	if (undefined !== H_utiwake[record[8]] == false && undefined !== H_utiwake[record[10]] == false) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な内訳コードです(" + record[8] + ":" + record[10] + ").");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "不明な内訳コードです(" + record[8] + ":" + record[10] + ").");
		return 1;
	}

	// 金額
	var charge = +record[6];

	if (record[8] == REF_HOUZIN_KIHON) {
		// 明細データを配列に保持する.
		var code = H_utiwake[REF_HOUZIN_KIHON].code;
		var A_meisai = [telno, code, charge, taxkind, REF_HOUZIN_KIHON];
		A_fileData.push(A_meisai);
		// 読み込んだレコード数をカウントする.
		ReadMeisaiCnt++;
	} else if (record[8] == REF_HOUZIN_WARI) {
		code = H_utiwake[REF_HOUZIN_WARI].code;
		A_meisai = [telno, code, charge, taxkind, REF_HOUZIN_WARI];
		A_fileData.push(A_meisai);
		ReadMeisaiCnt++;
	} else if (record[8] == REF_TYOUSEI) {
		code = H_utiwake[REF_TYOUSEI].code;
		A_meisai = [telno, code, charge, taxkind, REF_TYOUSEI];
		A_fileData.push(A_meisai);
		ReadMeisaiCnt++;
	} else if (-1 !== H_RemarkName.indexOf(record[10])) {
		// 税対象になりうる定額料金、一時料金の場合は課税対象かチェックする
		// if (taxkind == 13) {
		if (taxkind == "13") {
			code = H_utiwake[record[10]].code;
			A_meisai = [telno, code, charge, taxkind, record[10]];
			A_fileData.push(A_meisai);
			ReadMeisaiCnt++;
		// } else if (taxkind == 10) //消費税を追加
		} else if (taxkind == "10") {
			// 消費税を追加
			var taxcharge = CalcTax(charge);
			if (undefined !== H_taxCharge[telno] == false) {
				H_taxCharge[telno] = {
					telno: telno,
					tax: 0
				};
			}
			H_taxCharge[telno].tax = H_taxCharge[telno].tax + taxcharge;

			// 消費税対象を追加
			code = H_utiwake[record[10]].code;
			var fixcharge = charge - taxcharge;
			A_meisai = [telno, code, fixcharge, taxkind, record[10]];
			A_fileData.push(A_meisai);
			ReadMeisaiCnt++;
		}
	}
	ReadTelCnt++;
	sum.value += charge;
	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 電話番号登録を行う
// [引　数] $telno 電話番号
// [返り値] 電話が存在すれば0、存在しなければ1
function registTel(telno: string, pactid: string, dbh: ScriptDB) {
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("A_telnoX" in global)) A_telnoX = undefined;
	// if (!("A_telXData" in global)) A_telXData = undefined;
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("AddTelXCnt" in global)) AddTelXCnt = undefined;
	// if (!("A_telnoCom" in global)) A_telnoCom = undefined;
	// if (!("dummypost" in global)) dummypost = undefined;
	// if (!("A_MemTelno" in global)) A_MemTelno = undefined;
	// if (!("H_overTel" in global)) H_overTel = undefined;
	// if (!("H_regPost" in global)) H_regPost = undefined;
	// if (!("logh" in global)) logh = undefined;

	// 処理済みの番号は無視する 20070129iga
	if (-1 !== A_MemTelno.indexOf(telno) == false) {
		// 処理済みの配列に入れる
		A_MemTelno.push(telno);

		// telX_tbのNTTコム登録済み存在チェック 20070117iga
		if (-1 !== A_telnoCom.indexOf(telno) == true) {
			return 0;
		}

		// telX_tbのNTTコム以外の登録済み存在&登録数チェック
		var A_telCount: { [key: string]: number } = {};
		for (var i=0; i < A_telnoX.length; i++) {
			var key = A_telnoX[i];
			A_telCount[key] = (A_telCount[key]) ? A_telCount[key] + 1 : 1;
		}
		// var A_telCount = Array();
		// A_telCount = array_count_values(A_telnoX);

		// telX_tbに1件も登録されていない場合tel_X_tbに登録する
		if (undefined !== A_telCount[telno] == false) {
			if (undefined !== dummypost == false || dummypost == "") {
				console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "未登録番号：dummy_tel_tbに請求先部署が設定されていません(" + telno + ")");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "未登録番号：dummy_tel_tbに請求先部署が設定されていません(" + telno + ")");
				return 1;
			} else {
				A_telXData.push([dummypost, telno, NTTCOM_CARRIER_ID]);
			}
			// 追加する電話数のカウント
			AddTelXCnt++;
			return 1;
		}
		// telX_tbに1件だけ登録されている場合
		else if (A_telCount[telno] == 1) {
			A_telXData.push([H_regPost[telno], telno, NTTCOM_CARRIER_ID]);
			// 追加する電話数のカウント
			AddTelXCnt++;
			return 0;
		}
		// telX_tbに複数件登録されている場合
		else if (A_telCount[telno] > 1) {
			//複数登録されている電話のpostidが全て同じなら1件登録と見なす 20070125iga
			if (H_overTel[telno].no == 1) {
				A_telXData.push([H_overTel[telno].post, telno]);
				AddTelXCnt++;
				return 0;
			} else {
				if (!(typeof dummypost !== undefined && typeof dummypost !== null) || dummypost == "") {
					console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "未登録番号：dummy_tel_tbに請求先部署が設定されていません(" + telno + ")");
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "未登録番号：dummy_tel_tbに請求先部署が設定されていません(" + telno + ")");
					return 1;
				} else {
					A_telXData.push([dummypost, telno]);
				}
				// 追加する電話数のカウント
				AddTelXCnt++;
				return 1;
			}
		}
	} else {
		return 0;
	}
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 消費税を計算する
// [引　数] $税対象額
// [返り値] 消費税
function CalcTax(charge: number) {
	var tax = charge - Math.ceil(charge / TAX_RATE);
	return tax;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 電話番号登録を行うinsファイルへの書き出し。
// [引　数] $telno 電話番号
// [返り値] 終了コード　1（失敗）
function writeTelData(pactid: string) {
	// if (!("A_telXData" in global)) A_telXData = undefined;
	// if (!("dataDir" in global)) dataDir = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("dummypost" in global)) dummypost = undefined;
	// if (!("dummytelno" in global)) dummytelno = undefined;
	// if (!("file_telX" in global)) file_telX = undefined;
	// if (!("A_telnoCom" in global)) A_telnoCom = undefined;
	// if (!("H_telX_info" in global)) H_telX_info = undefined;

	// dummy_telが登録されていなければtel_X_tbに登録する
	if (undefined !== dummytelno != false || dummytelno != "") {
		if (-1 !== A_telnoCom.indexOf(dummytelno) == false) {
			A_telXData.push([dummypost, dummytelno, NTTCOM_CARRIER_ID]);
		}
	}

	// 現在の日付を得る
	var nowtime = getTimestamp();

	var fp_telX;
	try {
		fp_telX = fs.openSync(file_telX, "w")
	} catch (e) {
		console.log(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "の書き込みオープン失敗.");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "の書き込みオープン失敗.");
		return 1;
	}
	// var fp_telX = fopen(file_telX, "w");

	// 空のboxを用意しておく 20071012iga
	var A_nullbox = Array();
	for (var i = 0; i <= 31; i++) {
		A_nullbox[i] = "\\N";
	}

	// tel_X_tb に追加する電話を出力
	for (var A_data of A_telXData) {
		var postid = A_data[0];
		var telno = A_data[1];

		// telno_view用にハイフンをつける 20070913iga
		if (telno.match("/^0[789]0/") && telno.length >= 11) {
		// if (preg_match("/^0[789]0/", telno) && telno.length >= 11) {
			// var telno_view = telno.substr(0, 3) + "-" + telno.substr(3, 4) + "-" + telno.substr(7);
			var telno_view = telno.substring(0, 3) + "-" + telno.substring(3, 4) + "-" + telno.substring(7);
		} else {
			telno_view = telno;
		}

		// tel_XX_tbに1件だけ登録済みの電話で、電話情報を持っていたらコピーする
		if (undefined !== H_telX_info[telno] == true) {
			// nullは\\nに置換
			var H_tmp_info = H_telX_info[telno];
			var endcnt = H_tmp_info.length;
			for (var cnt = 0; cnt < endcnt; cnt++) {
				if (H_tmp_info[cnt] == undefined || H_tmp_info[cnt] == "") {
					H_tmp_info[cnt] = "\\N";
				}
			}
		} else {
			H_tmp_info = A_nullbox;
		}

		// 公私分計をする電話は、すべて「会社設定に従う」に変更
		if (H_tmp_info[27] == 0) {
			H_tmp_info[27] = "\\N";
		}

		H_tmp_info[28] = "\\N";
		fs.writeFileSync(fp_telX, pactid + "\t" + postid + "\t" + telno + "\t" + telno_view + "\t" + H_tmp_info[0] + "\t" + NTTCOM_CARRIER_ID + "\t" + NTTCOM_AREA_ID + "\t" + NTTCOM_CIRCUIT_ID + "\t" + H_tmp_info[1] + "\t" + H_tmp_info[2] + "\t" + H_tmp_info[3] + "\t" + H_tmp_info[4] + "\t" + H_tmp_info[5] + "\t" + H_tmp_info[6] + "\t" + H_tmp_info[7] + "\t" + H_tmp_info[8] + "\t" + H_tmp_info[9] + "\t" + H_tmp_info[10] + "\t" + H_tmp_info[11] + "\t" + H_tmp_info[12] + "\t" + H_tmp_info[13] + "\t" + H_tmp_info[14] + "\t" + H_tmp_info[15] + "\t" + H_tmp_info[16] + "\t" + H_tmp_info[17] + "\t" + H_tmp_info[18] + "\t" + H_tmp_info[19] + "\t" + H_tmp_info[20] + "\t" + H_tmp_info[21] + "\t" + H_tmp_info[22] + "\t" + H_tmp_info[23] + "\t" + H_tmp_info[24] + "\t" + H_tmp_info[25] + "\t" + H_tmp_info[26] + "\t" + H_tmp_info[27] + "\t" + H_tmp_info[28] + "\t" + H_tmp_info[29] + "\t" + H_tmp_info[30] + "\t" + nowtime + "\t" + nowtime + "\n");
	}

	fs.closeSync(fp_telX);
	// fclose(fp_telX);
	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 請求書作成番号合計レコードの処理
// [引　数] $line 入力レコード
// [返り値] 終了コード　1（失敗）
function doSumRecord(line: string, dbh: ScriptDB) {
	// if (!("Sum_POS" in global)) Sum_POS = undefined;
	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 会社合計レコードの処理
// [引　数] $line 入力レコード
// [返り値] 終了コード　1（失敗）
function doTotalRecord(line: string, TotalUp: number, dbh: ScriptDB) {
	// if (!("Trail_POS" in global)) Trail_POS = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid" in global)) pactid = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// if (!("allTotalUp" in global)) allTotalUp = undefined;

	// 分割してみる.
	var record = splitFix(line, Trail_POS);

	var total = +record[3];

	if (total != TotalUp) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "会社合計金額が異なります.(" + total + "!=" + TotalUp + ").");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "会社合計金額が異なります.(" + total + "!=" + TotalUp + ").");
		return 1;
	}

	return 0;
};


//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 インサートファイルに書き出す
// [引　数] $A_commFileData 書き出すデータ
// [返り値] 終了コード　1（失敗）
// 20070123iga
function writeTuwaFile(pactid: string, billdate: string, A_commFileData: Array<any>) //データがなければ終了
{
	// if (!("H_pactid" in global)) H_pactid = undefined;
	// if (!("fp_commhistory" in global)) fp_commhistory = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("dataDir" in global)) dataDir = undefined;
	// if (!("commhistoryX_tb" in global)) commhistoryX_tb = undefined;
	// if (!("file_commhistory" in global)) file_commhistory = undefined;

	// データがなければ終了
	if (A_commFileData.length == 0) {
		return 0;
	}

	try {
		fp_commhistory = fs.openSync(file_commhistory, "w")
	} catch (e) {
		console.log(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "の書き込みオープン失敗.");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "の書き込みオープン失敗.");
		return 1;
	}
	// fp_commhistory = fopen(file_commhistory, "w");

	// データを書き出す
	for (var data of A_commFileData) {
		fs.writeFileSync(fp_commhistory, data);// 2022cvt_006
	}

	fs.closeSync(fp_commhistory);
	// fclose(fp_commhistory);
	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明 インサートファイルに書き出す
// [引　数] $A_fileData 書き出すデータ
// [返り値] 終了コード　1（失敗）
async function writeInsFile(pactid: string, billdate: string, A_fileData: Array<any>) {
	// if (!("H_pactid" in global)) H_pactid = undefined;
	// if (!("H_utiwake" in global)) H_utiwake = undefined;
	// if (!("H_Zei_CODE" in global)) H_Zei_CODE = undefined;
	// if (!("fp_teldetails" in global)) fp_teldetails = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("dummytelno" in global)) dummytelno = undefined;
	// if (!("dataDir" in global)) dataDir = undefined;
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("H_TuwaCharge" in global)) H_TuwaCharge = undefined;
	// if (!("H_taxCharge" in global)) H_taxCharge = undefined;
	// if (!("file_teldetails" in global)) file_teldetails = undefined;
	// if (!("g_anbun" in global)) g_anbun = undefined;
	// if (!("TotalUp" in global)) TotalUp = undefined;
	// if (!("allTotalUp" in global)) allTotalUp = undefined;

	var aspCharge = 0;	// ASP利用料金
	var aspFlg = false;

	// データが空のときは終了.
	if (A_fileData.length == 0) {
		return 0;
	}

	// dummy電話が無い会社の場合は空文字を入れておく
	if (undefined !== dummytelno == false || dummytelno == "") {
		dummytelno = "";
	}

	var H_AnbunData = Array();

	// 按分開始 20071003iga
	if (g_anbun == "y") {
		// 割引総額を算出
		var TotalWari = 0;
		var EtcWari = 0;

		var anbun_key;
		var anbun_val;

		for (anbun_key in A_fileData) {
			anbun_val = A_fileData[anbun_key];

			if (anbun_val[4] == REF_HOUZIN_WARI || anbun_val[4] == REF_HOUZIN_KIHON) //按分したら割引額は削除する
				{
					TotalWari += anbun_val[2];
					// 按分したら割引額は削除する
					delete A_fileData[anbun_key];
				} else if (anbun_val[4] == REF_TYOUSEI) {
				EtcWari += anbun_val[2];
			}
		}

		anbun_key = 0;
		anbun_val = 0;
		// 通話料総額を算出
		var TotalTuwa = 0;
		for (anbun_key in H_TuwaCharge) {
			var anbun_val = H_TuwaCharge[anbun_key];
			TotalTuwa += anbun_val.charge;
		}

		// 割引額を計算用に調整.割引が1以上(割引じゃなく加算になる)時はエラー
		if (TotalWari > 0) {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "割引額が異常です.");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "割引額が異常です.");
			return 1;
		}

		// [その他調整金]の適用前の額で割引率を出す
		TotalTuwa = TotalTuwa + EtcWari;
		// 割引率 小数点5位で四捨五入
		var master_discount = TotalWari / TotalTuwa;
		master_discount = Math.ceil(master_discount * 10000) / 10000;

		// anbun_key = anbun_val = TotalAnbun = 0;
		anbun_key = 0;
		anbun_val = 0;
		var TotalAnbun = 0;
		H_AnbunData = Array();

		// 割引額を入れる
		for (anbun_key in H_TuwaCharge) {
			var anbun_val = H_TuwaCharge[anbun_key];

			if (undefined !== H_telX_info[telno] == false || H_telX_info[telno] == "") {
				H_AnbunData[anbun_key] = {
					telno: anbun_key,
					charge: 0
				};
			}

			H_AnbunData[anbun_key].charge = Math.round(anbun_val.charge * master_discount);
			TotalAnbun += H_AnbunData[anbun_key].charge;
		}

		var tel_cnt = H_TuwaCharge.length;

		// 按分後の請求額とNTTcomからの請求額に差があれば調整金を設定
		if (TotalTuwa + TotalAnbun != allTotalUp) {
			var code = REF_NTTCOM_TYOSEI;
			var charge = (TotalTuwa + TotalAnbun - allTotalUp) * -1;	// 反転しないと請求額が増える
			// 調整額が回線数を超えたらエラー(回線毎に四捨五入なので、最大でも1台あたり1円にしかならない)
			if (charge > tel_cnt || 0 - charge > tel_cnt) {
				console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "調整額が異常です.(" + tel_cnt + ":" + charge + ")");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "調整額が異常です.(" + tel_cnt + ":" + charge + ")");
			}

			var A_meisai = [dummytelno, code, charge, TAXFREE, REF_NTTCOM_TYOSEI];
			A_fileData.push(A_meisai);
		}
	}

	var A_TuwaData = Array();
	// 通話料の合算を請求明細データに入れる 20070126iga
	if (H_TuwaCharge.length > 0) {
		for (var data of H_TuwaCharge) {
			code = H_utiwake[G_CODE_TUWA].code;
			A_meisai = [data.telno, code, data.charge, TAXFREE, G_CODE_TUWA];
			A_TuwaData.push(A_meisai);
		}
	}

	// 按分データを請求明細データに入れる 20071003iga
	if (g_anbun == "y") {
		var A_AnbunData = Array();

		if (H_AnbunData.length > 0) {
			for (var data of H_AnbunData) {
				code = H_utiwake[G_CODE_WARI].code;
				A_meisai = [data.telno, code, data.charge, TAXFREE, G_CODE_WARI];
				A_TuwaData.push(A_meisai);
			}
		}
	}

	// 消費税の合算を請求明細データに入れる 20070201iga
	var A_taxData = Array();
	if (H_taxCharge.length > 0) {
		for (var data of H_taxCharge) {
			A_meisai = [data.telno, H_TAX, data.tax, 13, H_TAX];
			A_taxData.push(A_meisai);
		}
	}

	var nowtime = getTimestamp();	// 現在の日付を得る

	// 権限チェック「ASP利用料表示設定」がONになっているか
	if (await chkAsp(pactid) == true) {
		aspFlg = true;
		// ASP利用料を取得
		aspCharge = await getAsp(pactid);
		// ASP利用料が設定されていない場合
		if (aspCharge) {
		// if (is_null(aspCharge)) {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "ＡＳＰ利用料が設定されていません.");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "ＡＳＰ利用料が設定されていません.");
			return 1;
		}
	}

	try {
		// 出力ファイルオープン
		fp_teldetails = fs.openSync(file_teldetails, "w")
	} catch (e) {
		console.log(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "の書き込みオープン失敗.");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "の書き込みオープン失敗.");
		return 1;
	}
	// fp_teldetails = fopen(file_teldetails, "w");

	// ファイルへ書きだす(ここだけNTTcomの引用ではなく総書き換え) 20070201iga
	// 通話料金の合計金額は必ずdetailnoが0でDBに登録される
	var detailNo = 0;
	var A_detail = Array();	// 電話番号別detailNo保持
	var A_outTel = Array();	// 処理済み電話番号記録用

	// 通話料金の合計だけ先に書き出す
	for (var data of A_TuwaData) {
		fs.writeFileSync(fp_teldetails, pactid + "\t" + data[0] + "\t" + data[1] + "\t" + H_utiwake[data[4]].name + "\t" + data[2] + "\t" + H_Zei_CODE[data[3]] + "\t" + detailNo + "\t" + nowtime + "\t" + NTTCOM_CARRIER_ID + "\n");// 2022cvt_006
		A_detail[data[0]] = 1;

		// 初処理の電話番号は処理済み配列に加える
		if (-1 !== A_outTel.indexOf(data[0]) == false) {
			A_outTel.push(data[0]);
		}
	}

	// 各請求データを書き出す
	for (var data of A_fileData) {
		// 通話料合計が処理された番号ならdetailNoを引き継ぐ
		if (undefined !== A_detail[data[0]] == true) {
			detailNo = A_detail[data[0]];
		} else {
			detailNo = 0;
		}

		// 初めて処理される番号は処理済み番号記録用の配列に追加
		if (-1 !== A_outTel.indexOf(data[0]) == false) {
			A_outTel.push(data[0]);
		}

		fs.writeFileSync(fp_teldetails, pactid + "\t" + data[0] + "\t" + data[1] + "\t" + H_utiwake[data[4]].name + "\t" + data[2] + "\t" + H_Zei_CODE[data[3]] + "\t" + detailNo + "\t" + nowtime + "\t" + NTTCOM_CARRIER_ID + "\n");// 2022cvt_006
		detailNo++;
		A_detail[data[0]] = detailNo;

		// 初処理の電話番号は処理済み配列に加える
		if (-1 !== A_outTel.indexOf(data[0]) == false) {
			A_outTel.push(data[0]);
		}
	}

	// 消費税を書き出す
	for (var data of A_taxData) {
		detailNo = A_detail[data[0]];
		fs.writeFileSync(fp_teldetails, pactid + "\t" + data[0] + "\t" + data[1] + "\t" + H_utiwake[data[4]].name + "\t" + data[2] + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTCOM_CARRIER_ID + "\n");// 2022cvt_006
		detailNo++;
		A_detail[data[0]] = detailNo;

		// 初処理の電話番号は処理済み配列に加える
		if (-1 !== A_outTel.indexOf(data[0]) == false) {
			A_outTel.push(data[0]);
		}
	}

	// ASP利用料を書き出す
	for (var data of A_outTel) {
		//dummy電話にはASP利用料はつけない
		if (dummytelno != data) //電話料合計用に+1する
			{
				detailNo = A_detail[data];
				// 電話料合計用に+1する
				detailNo++;

				if (aspFlg == true) {
						// ASP利用料を出力
						fs.writeFileSync(fp_teldetails, pactid + "\t" + data + "\t" + G_CODE_ASP + "\t" + H_utiwake[G_CODE_ASP].name + "\t" + aspCharge + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTCOM_CARRIER_ID + "\n");// 2022cvt_006
						detailNo++;
						// ASP利用料消費税を出力
						fs.writeFileSync(fp_teldetails, pactid + "\t" + data + "\t" + G_CODE_ASX + "\t" + H_utiwake[G_CODE_ASX].name + "\t" + +(aspCharge * G_EXCISE_RATE + "\t" + "\\N\t" + detailNo + "\t" + nowtime + "\t" + NTTCOM_CARRIER_ID + "\n"));// 2022cvt_006
					}
			}
	}

	// fclose(fp_teldetails);
	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明
// [引　数] $str 元になる文字列
//          $A_pos 区切り位置を有する配列
// [返り値] 分割された文字列の配列
function splitFix(str: string, A_pos: Array<any>) {
	var A_ret = Array();
	var total_len = str.length;

	// １個目の要素
	A_ret[0] = str.substring(0, A_pos[0]);
	// A_ret[0] = str.substr(0, A_pos[0]);

	// 中間の要素
	for (var i = 0; i < A_pos.length - 1; i++) {
		// A_ret[i + 1] = str.substr(A_pos[i], A_pos[i + 1] - A_pos[i]);
		A_ret[i + 1] = str.substring(A_pos[i], A_pos[i + 1] - A_pos[i]);
	}

	// 最後の要素
	// A_ret[i + 1] = str.substr(A_pos[i]);
	A_ret[i + 1] = str.substring(A_pos[i]);
	return A_ret;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// テーブルの削除
// [引　数] $pactid：契約ＩＤ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
function doDelete(pactid: string, dbh: ScriptDB) {
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("commhistoryX_tb" in global)) commhistoryX_tb = undefined;
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	// tel_Detail_X_tbから削除
	var sql_str = "delete from " + teldetailX_tb + " where pactid=" + pactid + " and carid=" + NTTCOM_CARRIER_ID;
	var rtn = dbh.query(sql_str, false);

	// delte失敗した場合
	if (dbh.isError()) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデリートに失敗しました、");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデリートに失敗しました、");

		// ロールバック
		dbh.rollback();
		return 1;
	}

	// commhistory_X_tbから削除 20070129iga
	sql_str = "delete from " + commhistoryX_tb + " where pactid=" + pactid + " and carid=" + NTTCOM_CARRIER_ID;
	rtn = dbh.query(sql_str, false);

// 2022cvt_016
	if (dbh.isError()) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + "のデリートに失敗しました、");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + "のデリートに失敗しました、");
			// ロールバック
			dbh.rollback();
			return 1;
		}

	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// バックアップをとる
// [引　数] $db
// [返り値] なし
function doBackup(dbh: ScriptDB) {

	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("commhistoryX_tb" in global)) commhistoryX_tb = undefined;
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

  // tel_details_X_tb をエクスポートする
	// var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + date("YmdHis") + ".exp";
	var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";

	var sql = "select * from " + teldetailX_tb;
	dbh.begin();

	if (expDataByCursor(sql, outfile, dbh.m_db) != 1) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデータエクスポートに失敗しました.");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデータエクスポートに失敗しました.");
		// ロールバック
		dbh.rollback();
    // ロック解除
		dbh.lock(teldetailX_tb);
		throw process.exit(1);
	}

	// commhistory_X_tbをエクスポートする
	outfile = DATA_EXP_DIR + "/" + commhistoryX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
	sql = "select * from " + commhistoryX_tb;

	if (expDataByCursor(sql, outfile, dbh.m_db) != 1) {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + "のデータエクスポートに失敗しました.");
      // ロールバック
			dbh.rollback();
      // ロック解除
			dbh.lock(commhistoryX_tb);
			throw process.exit(1);
	}

	// tel_X_tbをエクスポートする
	outfile = DATA_EXP_DIR + "/" + telX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
	sql = "select * from " + telX_tb;

	if (expDataByCursor(sql, outfile, dbh.m_db) != 1) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のデータエクスポートに失敗しました.");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のデータエクスポートに失敗しました.");
      // ロールバック
			dbh.rollback();
      // ロック解除
			dbh.lock(telX_tb);
			throw process.exit(1);
		}

	dbh.commit();
	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// データをＤＢにImportする
// [引　数] $db
// [返り値] 終了コード　1（失敗）
async function doImport(file_telX: string, file_teldetails: string, file_commhistory: string, dbh: ScriptDB) {
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("commhistoryX_tb" in global)) commhistoryX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	// 使用者情報を追加 20071012iga
	if (fs.statSync(file_telX).size > 0) {
	// if (filesize(file_telX) > 0) {
		var telX_col = ["pactid", "postid", "telno", "telno_view", "userid", "carid", "arid", "cirid", "machine", "color", "employeecode", "username", "mail", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "date1", "date2", "memo", "kousiflg", "kousiptn", "username_kana", "kousi_fix_flg", "recdate", "fixdate"];

		if (await doCopyInsert(telX_tb, file_telX, telX_col, dbh) != 0) {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポートに失敗しました.");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポートに失敗しました.");
			// ロールバック
			dbh.rollback();
			throw process.exit(1);
		} else {
			console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポート完了");
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポート完了");
		}
	}

	// teldetailX_tbへのインポート
	if (fs.statSync(file_teldetails).size > 0) {
	// if (filesize(file_teldetails) > 0) {
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid"];

		if (await doCopyInsert(teldetailX_tb, file_teldetails, teldetailX_col, dbh) != 0) {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のインポートに失敗しました.");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のインポートに失敗しました.");
			// ロールバック
			dbh.rollback();
			throw process.exit(1);
		} else {
			console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " のインポート完了");
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " のインポート完了");
		}
	} else { // ファイルサイズが０？
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "のファイルサイズが０です.");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "のファイルサイズが０です.");
		return 1;
	}

	// commhistory_tbへのインポート
	if (fs.statSync(file_commhistory).size > 0) {
	// if (filesize(file_commhistory) > 0) {
		var commhisotry_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "byte", "callseg", "callsegname", "chageseg", "discountseg", "occupseg", "kubun1", "kubun2", "kubun3", "carid", "byte_mail", "byte_site", "byte_other", "kousiflg", "multinumber"];

		if (await doCopyInsert(commhistoryX_tb, file_commhistory, commhisotry_col, dbh) != 0) {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + "のインポートに失敗しました.");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + "のインポートに失敗しました.");
			// ロールバック
			dbh.rollback();
			throw process.exit(1);
		} else {
			console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + " のインポート完了");
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + commhistoryX_tb + " のインポート完了");
		}
	} else { //ファイルサイズが０？
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "のファイルサイズが０です.");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_commhistory + "のファイルサイズが０です.");
			return 1;
	}

	return 0;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
// [引　数] テーブル名、入力ファイル名、カラム名の配列
// [返り値] 終了コード　1（失敗）
async function doCopyInsert(table: string, filename: string, columns: Array<any>, dbh: ScriptDB) {
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	var buffer;
	try {
		// ファイルを開く
		buffer = fs.readFileSync(filename);
	} catch (e) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
		return 1;
	}
	var text = Encoding.convert(buffer, {
		from: 'SJIS',
		to: 'UNICODE',
		type: 'string'
	})
	var lines = text.toString().split("\r\n")
	// var fp = fopen(filename, "rt");

	// テーブルインサーター作成
	// ログ出力、ＤＢ、テンポラリファイル名、最初にファイルを削除するならtrue
	var ins = new TableInserter(log_listener, dbh, filename + ".sql", true);
	ins.begin(table);    // インサート処理開始

	for (var line of lines) {
		var A_line = line.split("\t") // データはtab区切り

		if (A_line.length != columns.length) {   // 要素数が異なっていたら
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のデータ数が設定と異なります。データ=" + line);
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のデータ数が設定と異なります。データ=" + line);
			// fclose(fp);
			return 1;
		}

		// インサート用のハッシュを用意する
		var H_ins = {};
		var idx = 0;
		for (var col of columns) {
			if (A_line[idx] != "\\N") {  //\N の場合はハッシュに追加しない
				H_ins[col] = A_line[idx];
			}

			idx++;
		}

		// インサート行の追加
		if (await ins.insert(H_ins) == false) {
			console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート中にエラー発生、データ=" + line);
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート中にエラー発生、データ=" + line);
			// fclose(fp);
			return 1;
		}
	}

	// インサート処理おしまい、実質的な処理はここで行われる.
	if (ins.end() == false) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート処理に失敗.");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート処理に失敗.");
		// fclose(fp);
		return 1;
	}

	// fclose(fp);
	return 0;
};

// function doCopyExp(sql: string, filename: string, dbh: any) //ログファイルハンドラ
// //一度にFETCHする行数
// //ファイルを開く
// {
// 	var logh = new ScriptLogAdaptor(log_listener, true);
// 	var pactid_in;
// 	var billdate;
// 	// if (!("logh" in global)) logh = undefined;
// 	// if (!("pactid_in" in global)) pactid_in = undefined;
// 	// if (!("billdate" in global)) billdate = undefined;
//
// 	var NUM_FETCH = 10000;
//
// 	var fp;
// 	try {
// 		fp = fs.openSync(filename, "wt");
// 	} catch (e) {
// 		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
// 		return 1;
// 	}
// 	// var fp = fopen(filename, "wt");

// 	dbh.query("DECLARE exp_cur CURSOR FOR " + sql);

// 	for (; ; ) //ＤＢから１行ずつ結果取得
// 	{
//

// 		// 保留
// 		var result = pg_query(dbh.m_db.connection, "FETCH " + NUM_FETCH + " IN exp_cur");

// 		if (result == undefined) {
// 			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Fetch error, " + sql);
// 			fs.closeSync(fp);
// 			// fclose(fp);
// 			return 1;
// 		}

// 		var A_line = pg_fetch_array(result)
// 		if (A_line == undefined) //ループ終了
// 			{
// 				break;
// 			}

//
// 		var str = "";

// 		do //データ区切り記号、初回のみ空
// 		{
//
// 			var delim = "";

//
// 			for (var item of A_line) //データ区切り記号
// 			{
// 				str += delim;
// 				delim = "\t";

// 				if (item == undefined) //nullを表す記号
// 					{
// 						str += "\\N";
// 					} else {
// 					str += item;
// 				}
// 			}

// 			str += "\n";
// 		} while (A_line = pg_fetch_array(result));

// 		try {
// 			fs.writeSync(fp, str)
// 		} catch (e) {
// 			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "への書き込み失敗、" + str);
// 			fs.closeSync(fp);
// 			// fclose(fp);
// 			return 1;
// 		}
// 	}

// 	dbh.query("CLOSE exp_cur");
// 	fs.closeSync(fp);
// 	// fclose(fp);
// 	return 0;
// };

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 処理を終えたデータを移動する
// [引　数] $pactid
// [返り値] 終了コード　1（失敗）
function finalData(pactid: string, pactDir: string, finDir: string) {
	// if (!("logh" in global)) logh = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	// 同名のファイルが無いか
	if (fs.statSync(finDir).isFile()) {
	// if (is_file(finDir) == true) {
		console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + finDir + "はディレクトリではありません.");
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + finDir + "はディレクトリではありません.");
		return 1;
	}

	// 異動先ディレクトリの存在チェック
	if (fs.existsSync(finDir) == false) {
			try {
				// なければ作成する
				fs.mkdirSync(finDir);
			} catch (e) {
				console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "異動先の" + finDir + "が作成できなかった.");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "異動先の" + finDir + "が作成できなかった.");
				return 1;
			}
		}

	// 各ディレクトリごとの処理
	var retval = 0;
	var dirh = fs.readdirSync(pactDir);
	// var dirh = openDir(pactDir);

	for (var fname in dirh) {
	// while (fname = fs.readdir(dirh)) {// 2022cvt_005
		var fpath = pactDir + "/" + fname;

		if (fs.statSync(fpath).isFile()) //ファイル移動
			{
				try {
					// ファイル移動
					fs.renameSync(fpath, finDir + "/" + fname)
				} catch (e) {
					console.log(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "の異動失敗.");
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "の異動失敗.");
					retval = 1;
				}
			}

// 		clearstatcache();
	}

	// closedir(dirh);
	return retval;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 使用説明
// [引　数] $comment 表示メッセージ
// [返り値] 終了コード　1（失敗）
function usage(comment: string, dbh: ScriptDB) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -a={Y|N}\n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
	console.log("		-a 按分 (Y:按分する,N:按分しない)\n\n");

	// print("\n" + comment + "\n\n");
	// print("Usage) " + _SERVER.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -a={Y|N}\n");
	// print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	// print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	// print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	// print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	// print("\t\t-a \u6309\u5206 (Y:\u6309\u5206\u3059\u308B,N:\u6309\u5206\u3057\u306A\u3044)\n\n");
	throw process.exit(1);
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// ルート部署のシステム用部署ＩＤを取得する
// [引　数] $pactid：契約ＩＤ
//          $table：テーブル名
// [返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
function getRootPostid(pactid: string, table: string) {
	// if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select postidparent from " + table + " where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
	var rootPostid = dbh.getOne(sql_str, true);
	return rootPostid;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// ＡＳＰ利用料表示設定があるかないか
// [引　数] $pactid：契約ＩＤ
// [返り値] ある：true、ない：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
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

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// ＡＳＰ利用料金の取得
// [引　数] $pactid：契約ＩＤ
// [返り値] ＡＳＰ利用料金
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
function getAsp(pactid: string) {
	// if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + NTTCOM_CARRIER_ID;
	var charge = dbh.getOne(sql_str);
	return charge;
};

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 現在の日付を返す
// DBに書き込む現在日時に使用する
function getTimestamp() {
	// var tm = localtime(Date.now() / 1000, true);
	var tm = new Date();
	// var yyyy = tm.tm_year + 1900;
	var yyyy = tm.getFullYear();
	// var mm = tm.tm_mon + 1;
	var mm = (tm.getMonth() + 1).toString();

	var dd = (tm.getDay() + 0).toString();

	var hh = (tm.getHours() + 0).toString();

	var nn = (tm.getMinutes() + 0).toString();

	var ss = (tm.getSeconds() + 0).toString();

	// if (mm < 10) mm = "0" + mm;

	if (mm.length == 1) {
	// if (mm < 10) {
		mm = "0" + mm;
	}
	// var dd = tm.tm_mday + 0;
	// if (dd < 10) dd = "0" + dd;
	if (dd.length == 1) {
		dd = "0" + dd;
	}
	// var hh = tm.tm_hour + 0;
	// if (hh < 10) hh = "0" + hh;
	if (hh.length == 1) {
		hh = "0" + hh;
	}
	// var nn = tm.tm_min + 0;
	// if (nn < 10) nn = "0" + nn;
	if (nn.length == 1) {
		nn = "0" + nn;
	}
	// var ss = tm.tm_sec + 0;
	// if (ss < 10) ss = "0" + ss;
	if (ss.length == 1) {
		ss = "0" + ss;
	}

	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};
})();
