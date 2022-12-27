//===========================================================================
//機能：請求情報ファイルインポートプロセス（NTT東日本専用）
//
//作成：中西
//===========================================================================

// error_reporting(E_ALL);
const SCRIPT_NAMEJ = "NTT東日本請求情報ファイルインポート";
const SCRIPTNAME = "import_ntteast_bill.php";

import TableNo, { ScriptDB, TableInserter } from "../../script/batch/lib/script_db";

import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../../script/batch/lib/script_log";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR, IMPORT_NTTEAST_DIAL, IMPORT_NTTEAST_PRCS } from "../../db_define/define";
import { expDataByCursor } from "../pg_function";
import { execSync } from "child_process";

(async () => {
const NTTEAST_DIR = "/NTT_east/bill";
const NTTEAST_PAT = "/^[KDP]/i";
const FIN_DIR = "fin";
const LOG_DELIM = " ";
const NTTEAST_CARRIER_ID = 7;
const PHP = "php";

var dbLogFile = DATA_LOG_DIR + "/billbat.log";

var log_listener = new ScriptLogBase(0);


var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);


var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");

log_listener.putListener(log_listener_type);

log_listener.putListener(log_listener_type2);

var dbh = new ScriptDB(log_listener);

var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

if (process.argv.length != 6 + 1)
// if (_SERVER.argv.length != 6) //数が正しくない
	{
		usage("", dbh);
		throw process.exit(1);
	}


var argvCnt = process.argv.length;
// var argvCnt = _SERVER.argv.length;

var year = 0;
var month = 0;
var billdate = "";
var pactid_in = "";
var backup = "";
var mode = "";


for (var cnt = 1 + 1; cnt < argvCnt; cnt++)
// for (var cnt = 1; cnt < argvCnt; cnt++) //mode を取得
{
	if (process.argv[cnt].match("-e="))
	// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
		{

			mode = process.argv[cnt].replace("-e=", "").toLowerCase();
			// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!mode.match("^[ao]$")) {
			// if (ereg("^[ao]$", mode) == false) {
				usage("ERROR: モードの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("-y="))
	// if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		{

			billdate = process.argv[cnt].replace("-y=", "");
			// var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

			if (!billdate.match("^[0-9]{6}$")) {
			// if (ereg("^[0-9]{6}$", billdate) == false) {
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
				{


					year = parseInt(billdate.substring(0, 4));
					// var year = billdate.substr(0, 4);

					month = parseInt(billdate.substring(4, 6));
					// var month = billdate.substr(4, 2);

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
					}
				}

			var diffmon = (new Date().getFullYear() - year) * 12 + (new Date().getMonth() + 1 - month);
			// var diffmon = (date("Y") - year) * 12 + (date("m") - month);

			if (diffmon < 0) {
				usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
			} else if (diffmon >= 24) {
				usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("-p="))
	// if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		{

			pactid_in = process.argv[cnt].replace("-p=", "").toLowerCase();
			// var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!pactid_in.match("^all$") && !pactid_in.match("^[0-9]+$")) {
			// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
				usage("ERROR: 契約ＩＤの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("-b="))
	// if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		{

			backup = process.argv[cnt].replace("-b=", "").toLowerCase();
			// var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!backup.match("^[ny]$")) {
			// if (ereg("^[ny]$", backup) == false) {
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("-t="))
	// if (ereg("^-t=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		{

			var teltable = process.argv[cnt].replace("-t=", "").toLowerCase();
			// var teltable = ereg_replace("^-t=", "", _SERVER.argv[cnt]).toLowerCase();

			if (!teltable.match("^[no]$")) {
			// if (ereg("^[no]$", teltable) == false) {
				usage("ERROR: 今月のデータかどうかの指定が不正です", dbh);
			}

			continue;
		}

	usage("", dbh);
}


var dataDir = DATA_DIR + "/" + billdate + NTTEAST_DIR;
if (fs.existsSync(dataDir) == false) {
	console.log(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません.")
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません.");
}


var A_pactid = Array();

var A_pactDone = Array();

var A_pactFailed = Array();

if (pactid_in == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{

		var dirh = fs.readdirSync(dataDir);
		// var dirh = openDir(dataDir);

		for (var fileName of dirh)
		// while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
		{
			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {
				A_pactid.push(fileName);
			}

// 			clearstatcache();
		}

		// closedir(dirh);
	} else {
	A_pactid.push(pactid_in);
}

if (A_pactid.length == 0) {
	console.log(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Pact用データディレクトリが１つもありません.");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Pact用データディレクトリが１つもありません.");
	throw process.exit(1);
}

if (await lock(true, dbh) == false) {
	console.log(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "２重起動です、前回エラー終了の可能性があります.")
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "２重起動です、前回エラー終了の可能性があります.");
	throw process.exit(1);
}


var O_tableNo = new TableNo();

var tableNo = O_tableNo.get(year, month);

var telX_tb = "tel_" + tableNo + "_tb";

var postrelX_tb = "post_relation_" + tableNo + "_tb";

var teldetailX_tb = "tel_details_" + tableNo + "_tb";

var co_arg = "";


for (var i = 1 + 1; i < process.argv.length; i++) {
	co_arg += " ";
	co_arg += process.argv[i];
}


var status = 0;

var cmd = PHP + " " + IMPORT_NTTEAST_PRCS + co_arg;


// exec(cmd, output, status);
console.log(cmd);
var output;
try{
	console.log(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\"" + cmd + "\"の実行開始")
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\"" + cmd + "\"の実行開始");
	output = execSync(cmd);
}catch(a:any){
	// status = a.status;
	console.log(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + "の実行に失敗.");
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + "の実行に失敗.");
	throw process.exit(1);
}

var lines: string[] = output.toString().split("\r\n");


for (var line of lines) {
// 2022cvt_019
	if (line.match("/^COMPLETE_PACTS/"))
	// if (preg_match("/^COMPLETE_PACTS/", line)) //完了したPactのIDを拾うキーワード
		//１個目はキーワードなので除く
		//完了したPactに追加
		{

			var A_pacts = line.split(",");
			A_pacts.shift();
			A_pactDone.concat(A_pacts);
			// A_pactDone += A_pacts;
// 2022cvt_019
		} else if (line.match("/^FAILED_PACTS/"))
		// } else if (preg_match("/^FAILED_PACTS/", line)) //失敗したPactのIDを拾うキーワード
		//１個目はキーワードなので除く
		//失敗したPactに追加
		{
			A_pacts = line.split(",");
			A_pacts.shift();
			A_pactFailed.concat(A_pacts);
			// A_pactFailed += A_pacts;
		} else //そのまま出力
		{
			console.log(line + "\n");
			// print(line + "\n");
		}
}

// if (status != 0) {
// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + "の実行に失敗.");
// 	throw process.exit(1);
// }

status = 0;
cmd = PHP + " " + IMPORT_NTTEAST_DIAL + co_arg;
// cmd = escapeshellcmd(PHP + " " + IMPORT_NTTEAST_DIAL + co_arg);
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\"" + cmd + "\"の実行開始.");

try{
	output = execSync(cmd);
}catch(a:any){
	status = a.status;
}

var lines: string[] = output.toString().split("\r\n");


for (var line of lines) {
// 2022cvt_019
	if (line.match("/^COMPLETE_PACTS/"))
	// if (preg_match("/^COMPLETE_PACTS/", line)) //完了したPactのIDを拾うキーワード
		//１個目はキーワードなので除く
		//完了したPactに追加
		{
			A_pacts = line.split(",");
			A_pacts.shift();
			// A_pactDone += A_pacts;
			A_pactDone.concat(A_pacts);
// 2022cvt_019
		} else if (line.match("/^FAILED_PACTS/"))
		// } else if (preg_match("/^FAILED_PACTS/", line)) //失敗したPactのIDを拾うキーワード
		//１個目はキーワードなので除く
		//失敗したPactに追加
		{
			A_pacts = line.split(",");
			A_pacts.shift();
			// A_pactFailed += A_pacts;
			A_pactFailed.concat(A_pacts);
		} else //そのまま出力
		{
			console.log(line + "\n");
			// print(line + "\n");
		}
}

if (status != 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + "\"の実行開始.");
	throw process.exit(1);
}

// A_pactDone = array_unique(A_pactDone);
A_pactDone = A_pactDone.filter(function (value, index, self) { return self.indexOf(value) === index })
// A_pactFailed = array_unique(A_pactFailed);
A_pactFailed = A_pactFailed.filter(function (value, index, self) { return self.indexOf(value) === index })
// A_pactDone = array_diff(A_pactDone, A_pactFailed);
A_pactDone = A_pactDone.filter(x => A_pactFailed.includes(x))

if (A_pactDone.length == 0) //文字化け iga
	//この場合はロック解除する.
	{
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + " の実行に失敗.");
		lock(false, dbh);
		throw process.exit(1);
	}


var A_tmpExt = ["_prcs", "_dial"];


for (var pactid of A_pactDone) //出力ファイル作成
{

	var file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + ".ins";

	var fp_teldetails;
	try {
		fp_teldetails = fs.openSync(file_teldetails, "w")
	} catch (e) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "読み込みに成功したPactが１つも無かった.");
		throw process.exit(1);
	}
	// var fp_teldetails = fopen(file_teldetails, "w");


	for (var ext of A_tmpExt) //tmpファイルを単純に連結する.
	{

		var tmp_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + ext + ".tmp";

		if (!fs.existsSync(tmp_teldetails))
		// if (!file_exists(tmp_teldetails)) //ファイルが存在しなければ処理をスキップ.
			{
				continue;
			}


		var buffer;
		try {
			buffer = fs.readFileSync(tmp_teldetails);
		} catch (e) {
			logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + tmp_teldetails + "の書き込みオープン失敗.");
			throw process.exit(1);
		}
		var text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE',
			type: 'string'
		})
		var lines = text.toString().split("\r\n")
		// var fp_tmp_teldetails = fopen(tmp_teldetails, "rb");

		for (var line of lines) {
		// while (line = fgets(fp_tmp_teldetails)) {
			// if (feof(fp_tmp_teldetails)) //おしまい.
			// 	{
			// 		break;
			// 	}
			fs.writeSync(fp_teldetails, line)
			// fputs(fp_teldetails, line);
		}

		// fclose(fp_tmp_teldetails);
	}

	fs.closeSync(fp_teldetails);
	// fclose(fp_teldetails);
}


for (var pactid of A_pactDone) //出力ファイル作成
//ファイル内容を保持するバッファ.
//ファイルの種類ごとの処理.
//一気に書き出す.
//重複を除く.
{

	var file_tel = dataDir + "/" + "tel_tb" + billdate + pactid + ".ins";

	// var fp_tel = fopen(file_tel, "w");
	var fp_tel;
	try {
		fp_tel = fs.openSync(file_tel, "w");
	} catch (e) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_tel + "のオープン失敗.");
		throw process.exit(1);
	}


	var A_tmpBuf: string[] = Array();


	for (var ext of A_tmpExt) //telの電話番号が重なっているものは除く.
	//一気に配列に読み込む.
	{

		var tmp_tel = dataDir + "/" + "tel_tb" + billdate + pactid + ext + ".tmp";

		if (!fs.existsSync(tmp_tel))
		// if (!file_exists(tmp_tel)) //ファイルが存在しなければ処理をスキップ.
			{
				continue;
			}

		A_tmpBuf = A_tmpBuf.concat(fs.readFileSync(tmp_tel).toString().split("\r\n"))
		// A_tmpBuf = array_merge(A_tmpBuf, file(tmp_tel));
	}

	// A_tmpBuf = array_unique(A_tmpBuf);
	A_tmpBuf = A_tmpBuf.filter(function (value, index, self) { return self.indexOf(value) === index })


	for (var line of A_tmpBuf) {
		fs.writeSync(fp_tel, line)
		// fputs(fp_tel, line);
	}

	fs.closeSync(fp_tel);
	// fclose(fp_tel);
}


for (var pactid of A_pactDone) //出力ファイル作成
//ファイル内容を保持するバッファ.
//ファイルの種類ごとの処理.
//一気に書き出す.
//重複を除く.
{

	var file_telX = dataDir + "/" + telX_tb + billdate + pactid + ".ins";

	var fp_telX;
	try {
		fp_telX = fs.openSync(file_telX, "w")
	} catch (e) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "の書き込みオープン失敗.");
		throw process.exit(1);
	}
	// var fp_telX = fopen(file_telX, "w");

	A_tmpBuf = Array();


	for (var ext of A_tmpExt) //telの電話番号が重なっているものは除く.
	//一気に配列に読み込む.
	{

		var tmp_telX = dataDir + "/" + telX_tb + billdate + pactid + ext + ".tmp";

		if (!fs.existsSync(tmp_telX))
		// if (!file_exists(tmp_telX)) //ファイルが存在しなければ処理をスキップ.
			{
				continue;
			}

		A_tmpBuf = A_tmpBuf.concat(fs.readFileSync(tmp_telX).toString().split("\r\n"))
		// A_tmpBuf = array_merge(A_tmpBuf, file(tmp_telX));
	}

	A_tmpBuf = A_tmpBuf.filter(function (value, index, self) { return self.indexOf(value) === index })
	// A_tmpBuf = array_unique(A_tmpBuf);


	for (var line of A_tmpBuf) {
		fs.writeSync(fp_telX, line)
		// fputs(fp_telX, line);
	}

	fs.closeSync(fp_telX);
	// fclose(fp_telX);
}


for (var pactid of A_pactid) {

	for (var ext of A_tmpExt) {
		file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + ext + ".tmp";

		if (fs.existsSync(file_teldetails)) {
		// if (file_exists(file_teldetails)) {
			fs.unlinkSync(file_teldetails)
			// fs.unlink(file_teldetails);// 2022cvt_007
		}

		file_tel = dataDir + "/" + "tel_tb" + billdate + pactid + ext + ".tmp";

		if (fs.existsSync(file_tel)) {
		// if (file_exists(file_tel)) {
			fs.unlinkSync(file_tel)
			// fs.unlink(file_tel);// 2022cvt_007
		}

		file_telX = dataDir + "/" + telX_tb + billdate + pactid + ext + ".tmp";

		if (fs.existsSync(file_telX)) {
		// if (file_exists(file_telX)) {
			fs.unlinkSync(file_telX)
			// fs.unlink(file_telX);// 2022cvt_007
		}
	}
}

if (backup == "y") {
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理開始.");
	doBackup(dbh);
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理完了.");
}


for (var pactid of A_pactDone) //コミットポイント開始
//データをインポートする前にデリート
//処理済みのデータを移動
{
	dbh.begin();

	if (mode == "o") {
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理開始.");

		if (doDelete(pactid, dbh) != 0) //失敗したら次のPactへ.
			{
				continue;
			}

		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理完了.");
	}

	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理開始.");
	file_tel = dataDir + "/" + "tel_tb" + billdate + pactid + ".ins";
	file_telX = dataDir + "/" + telX_tb + billdate + pactid + ".ins";
	file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + ".ins";

	if (await doImport(file_tel, file_telX, file_teldetails, dbh) != 0) //失敗したら次のPactへ.
		{
			continue;
		}

	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理完了.");
	dbh.commit();

	var pactDir = dataDir + "/" + pactid;

	var finDir = pactDir + "/" + FIN_DIR;
	finalData(pactid, pactDir, finDir);
}

lock(false, dbh);
console.log(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.")
logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
throw process.exit(0);

function doBackup(db: ScriptDB) //tel_details_X_tb をエクスポートする
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp"
	// var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + date("YmdHis") + ".exp";

	var sql = "select * from " + teldetailX_tb;
	db.begin();

	if (expDataByCursor(sql, outfile, db.m_db) != 1) //ロールバック
		//ロック解除
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデータエクスポートに失敗しました.");
			dbh.rollback();
			lock(false, db);
			throw process.exit(1);
		}

	db.commit();
	return 0;
};

function doDelete(pactid: string, db: ScriptDB) //delte失敗した場合
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;

	var sql_str = "delete from " + teldetailX_tb + " where pactid=" + pactid + " and carid=" + NTTEAST_CARRIER_ID;

	var rtn = db.query(sql_str, false);


	if (db.isError())
	// if ("object" === typeof rtn == true) //ロールバック
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデリートに失敗しました、");
			db.rollback();
			return 1;
		}

	return 0;
};

async function doImport(file_tel: string, file_telX: string, file_teldetails: string, db: ScriptDB) //$tel_columns =
//"pactid, postid, telno, telno_view, userid, carid, arid, cirid, machine, color, planid, planalert, packetid, packetalert, pointstage, employeecode, username, mail, orderdate, text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, int1, int2, int3, date1, date2, memo, movepostid, moveteldate, delteldate, recdate, fixdate, options, contractdate, finishing_f, schedule_person_name, schedule_person_userid, schedule_person_postid";
//$teldetail_columns =
//"pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid,tdcomment,prtelno";
//tel_tbへのインポート
{
	// if (!("telX_tb" in global)) telX_tb = undefined;
	// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	if (fs.statSync(file_tel).size > 0) {
	// if (filesize(file_tel) > 0) {

		var tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];

		if (await doCopyInsert("tel_tb", file_tel, tel_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "tel_tbのインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "tel_tb のインポート完了.");
		}
	}

	if (fs.statSync(file_telX).size > 0) {
	// if (filesize(file_telX) > 0) {

		var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];

		if (await doCopyInsert(telX_tb, file_telX, telX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポート完了");
		}
	}

	if (fs.statSync(file_teldetails).size > 0) {
	// if (filesize(file_teldetails) > 0) {

		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "prtelno"];

		if (await doCopyInsert(teldetailX_tb, file_teldetails, teldetailX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " のインポート完了");
		}
	} else //ファイルサイズが０？
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "のファイルサイズが０です.");
			return 1;
		}

	return 0;
};

// function doCopyExp(sql: string, filename: string, db: any) //ログファイルハンドラ
// //一度にFETCHする行数
// //ファイルを開く
// {
// 	// if (!("logh" in global)) logh = undefined;
// 	// if (!("pactid_in" in global)) pactid_in = undefined;
// 	// if (!("billdate" in global)) billdate = undefined;
//
// 	var NUM_FETCH = 10000;
//
// 	var fp;
// 	try {
// 		fp = fs.openSync(filename, "wt")
// 	} catch (e) {
// 		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
// 		return 1;
// 	}
// 	// var fp = fopen(filename, "wt");

// 	db.query("DECLARE exp_cur CURSOR FOR " + sql);

// 	for (; ; ) //ＤＢから１行ずつ結果取得
// 	{
//
// 		var result = pg_query(db.m_db.connection, "FETCH " + NUM_FETCH + " IN exp_cur");

// 		if (result == undefined) {
// 			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Fetch error, " + sql);
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
// 		}
// 	}

// 	db.query("CLOSE exp_cur");
// 	fs.closeSync(fp);
// 	// fclose(fp);
// 	return 0;
// };

async function doCopyInsert(table: string, filename: string, columns: Array<any>, db: ScriptDB) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	var buffer;
	try {
		buffer = fs.readFileSync(filename, "utf8");
	} catch (e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
		return 1;
	}
	const text = Encoding.convert(buffer, {
		from: 'SJIS',
		to: 'UNICODE',
		type: 'string'
	})
	var lines = text.toString().split("\r\n");
	// var fp = fopen(filename, "rt");


	var ins = new TableInserter(log_listener, db, filename + ".sql", true);
	ins.begin(table);

	for (var line of lines)
	// while (line = fgets(fp)) //データはtab区切り
	//インサート行の追加
	{

		var A_line = line.split("\t")
		// var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) //要素数が異なっていたら
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のデータ数が設定と異なります。データ=" + line);
				// fclose(fp);
				return 1;
			}


		var H_ins = {};

		var idx = 0;


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

function finalData(pactid: string, pactDir: string, finDir: string) //同名のファイルが無いか
{
	// if (!("logh" in global)) logh = undefined;
	// if (!("billdate" in global)) billdate = undefined;

// 2022cvt_028
	if (fs.statSync(finDir).isFile()) {
	// if (is_file(finDir) == true) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + finDir + "はディレクトリではありません.");
		return 1;
	}

	if (fs.existsSync(finDir) == false) //なければ作成する
		{
			try {
				fs.mkdirSync(finDir)
			} catch (e) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "異動先の" + finDir + "が作成できなかった.");
				return 1;
			}
		}


	var retval = 0;

	var dirh = fs.readdirSync(pactDir);
	// var dirh = openDir(pactDir);

	for (var fname of dirh) {
	// while (fname = fs.readdir(dirh)) {// 2022cvt_005

		var fpath = pactDir + "/" + fname;

// 2022cvt_028
		if (fs.statSync(fpath).isFile())
		// if (is_file(fpath)) //ファイル名の先頭文字が適合するものだけ
			{
// 2022cvt_019
				if (fname.match(NTTEAST_PAT))
				// if (preg_match(NTTEAST_PAT, fname)) //ファイル移動
					{
						try {
							fs.renameSync(fpath, finDir + "/" + fname)
						} catch (e) {
							logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "の異動失敗.");
							retval = 1;
						}
					}
			}

// 		clearstatcache();
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
	// print("\n" + comment + "\n\n");
	// print("Usage) " + _SERVER.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	// print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	// print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	// print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	// print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	// print("\t\t-t \u5F53\u6708\u30C7\u30FC\u30BF\t(N:\u30C7\u30FC\u30BF\u306F\u4ECA\u6708\u306E\u3082\u306E,O:\u30C7\u30FC\u30BF\u306F\u5148\u6708\u306E\u3082\u306E)\n\n");
	lock(false, db);
	throw process.exit(1);
};

async function lock(is_lock: boolean, db: ScriptDB) //ロックする
{
	if (db == undefined) {
		return false;
	}


	var pre = "batch";

	if (is_lock == true) //既に起動中
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");

			var sql = "select count(*) from clamptask_tb " + "where command = '" + db.escape(pre + "%") + "' and " + "status = 1;";

			var count = await db.getOne(sql);

			if (count != 0) {
				db.rollback();
				return false;
			}

			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + db.escape(pre + "_" + SCRIPTNAME) + "',1,'now()');";
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
})();
