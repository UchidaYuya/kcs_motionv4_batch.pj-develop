
const SCRIPT_NAMEJ = "NTT-Com請求情報ファイルインポート";
const SCRIPTNAME = "import_nttcom_bill.php";

import { ScriptDB, TableInserter } from './lib/script_db'
import {ScriptLogBase, ScriptLogFile, G_SCRIPT_ALL, G_SCRIPT_WARNING, G_SCRIPT_ERROR, ScriptLogAdaptor, G_SCRIPT_BEGIN, G_SCRIPT_INFO, G_SCRIPT_END } from './lib/script_log'
import { DATA_LOG_DIR, DATA_DIR, IMPORT_NTTCOM_FIX, IMPORT_NTTCOM_INT, DATA_EXP_DIR } from '../../db_define/define';

import * as fs from 'fs';
import {execSync} from 'child_process';

import { expDataByCursor } from '../pg_function';

import TableNo from './lib/script_db';

import * as Encoding from 'encoding-japanese';

(async () => {
	const NTTCOM_DIR = "/NTT_com/bill";
	const NTTCOM_PAT = "/^[KDYW]/i";
	const FIN_DIR = "fin";
	const LOG_DELIM = " ";
	const NTTCOM_CARRIER_ID = 9;
	const PHP = "php";

	var dbLogFile = DATA_LOG_DIR + "/billbat.log";

	var log_listener = new ScriptLogBase(0);

	var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);

	var log_listener_type2 = new ScriptLogFile(G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
	log_listener.putListener(log_listener_type);
	log_listener.putListener(log_listener_type2);

	var dbh = new ScriptDB(log_listener);

	var logh = new ScriptLogAdaptor(log_listener, true);
	// logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "\u51E6\u7406\u958B\u59CB.");
	logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");

	var d = new Date();

	// if (_SERVER.argv.length != 6) //数が正しくない
	if (process.argv.length != 6 + 1) //数が正しくない
	{
		usage("", dbh);
		throw process.exit(1);
	}

	var argvCnt = process.argv.length;

	var billdate;
	var pactid_in;

	var backup;

	var mode;

	for (var cnt = 1 + 1; cnt < argvCnt; cnt++) //mode を取得
	{
	// if (ereg("^-e=", _SERVER.argv[cnt]) == true) //モード文字列チェック
		if (process.argv[cnt].match("^-e=")) //モード文字列チェック
		{

			// var mode = ereg_replace("^-e=", "", _SERVER.argv[cnt]).toLowerCase();
			mode = process.argv[cnt].replace("^-e=", "").toLowerCase();

			// if (ereg("^[ao]$", mode) == false) {
			if (mode.match("^[ao]$")) {
				// usage("ERROR: \u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
				usage("ERROR: モードの指定が不正です", dbh);
			}

			continue;
		}

	// if (ereg("^-y=", process.argv[cnt]) == true) //請求年月文字列チェック
		if (process.argv[cnt].match("^-y=")) //請求年月文字列チェック
		{

			// var billdate = ereg_replace("^-y=", "", process.argv[cnt]);
			billdate = process.argv[cnt].replace("^-y=", "");

			// if (ereg("^[0-9]{6}$", billdate) == false) {
			if (billdate.match("^[0-9]{6}$")) {
				// usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
			{

				var year = billdate.substring(0, 4);

				var month = billdate.substring(4, 2);

				if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
					// usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059(" + billdate + ")", dbh);
					usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
				}
			}


			// var diffmon = (date("Y") - year) * 12 + (date("m") - month);
			var diffmon = (d.getFullYear() - year) * 12 + (d.getMonth()+1 - month);

			if (diffmon < 0) {
				// usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\u672A\u6765\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")", dbh);
				usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
			} else if (diffmon >= 24) {
				usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
			}

			continue;
		}

	// if (ereg("^-p=", process.argv[cnt]) == true) //契約ＩＤチェック
		if (process.argv[cnt].match("^-p=")) //契約ＩＤチェック
		{

			// var pactid_in = ereg_replace("^-p=", "", process.argv[cnt]).toLowerCase();
			pactid_in = process.argv[cnt].replace("^-p=", "").toLowerCase();

			// if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
			if (pactid_in.match("^all$") && pactid_in.match("^[0-9]+$")) {
				// usage("ERROR: \u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
				usage("ERROR: 契約ＩＤの指定が不正です", dbh);
			}

			continue;
		}

	// if (ereg("^-b=", process.argv[cnt]) == true) //バックアップの有無のチェック
		if (process.argv[cnt].match("^-b=")) //バックアップの有無のチェック
		{

			// var backup = ereg_replace("^-b=", "", process.argv[cnt]).toLowerCase();
			backup = process.argv[cnt].replace("^-b=", "").toLowerCase();

			// if (ereg("^[ny]$", backup) == false) {
			if (backup.match("^[ny]$")) {
				// usage("ERROR: \u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

	// if (ereg("^-t=", process.argv[cnt]) == true) //バックアップの有無のチェック
		if (process.argv[cnt].match("^-t=")) //バックアップの有無のチェック
		{

			// var teltable = ereg_replace("^-t=", "", process.argv[cnt]).toLowerCase();
			var teltable = process.argv[cnt].replace("^-t=", "").toLowerCase();

			// if (ereg("^[no]$", teltable) == false) {
			if (teltable.match("^[no]$")) {
				// usage("ERROR: \u4ECA\u6708\u306E\u30C7\u30FC\u30BF\u304B\u3069\u3046\u304B\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
				usage("ERROR: 今月のデータかどうかの指定が不正です", dbh);
			}

			continue;
		}

		usage("", dbh);
	}

	var dataDir = DATA_DIR + "/" + billdate + NTTCOM_DIR;

	if (fs.existsSync(dataDir) == false) {// 2022cvt_003
		// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093.");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません.");
	}

	var A_pactid = Array();

	var A_pactDone = Array();

	var A_pactFailed = Array();

	if (pactid_in == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{

		var fileName;

		// var dirh = openDir(dataDir);
		var dirh = fs.readdirSync(dataDir);

		// while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		while (fileName = dirh) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		{
			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {// 2022cvt_003
				A_pactid.push(fileName);
			}

// 			clearstatcache();
		}

		// closedir(dirh);
	} else {
		A_pactid.push(pactid_in);
	}

	if (A_pactid.length == 0) {
		// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093.");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Pact用データディレクトリが１つもありません.");
		throw process.exit(1);
	}

	if (await lock(true, dbh) == false) {
		// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\uFF12\u91CD\u8D77\u52D5\u3067\u3059\u3001\u524D\u56DE\u30A8\u30E9\u30FC\u7D42\u4E86\u306E\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059.");
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

	var cmd = (PHP + " " + IMPORT_NTTCOM_FIX + co_arg);
	// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\"" + cmd + "\"\u306E\u5B9F\u884C\u958B\u59CB.");
	// exec(cmd, output, status);
	var output;
	var line;

	try {
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\"" + cmd + "\"の実行開始.");
		output = execSync(cmd);
	} catch (error) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
		throw process.exit(error.status);
	}

	for (line of output.toString().split('\r\n')) {
	// if (preg_match("/^COMPLETE_PACTS/", line)) //完了したPactのIDを拾うキーワード
		if (line.match("/^COMPLETE_PACTS/")) //完了したPactのIDを拾うキーワード
		//１個目はキーワードなので除く
		//完了したPactに追加
		{

			var A_pacts = line.split(",");
			A_pacts.shift();
			A_pactDone += A_pacts;
		} else if (line.match("/^FAILED_PACTS/")) //失敗したPactのIDを拾うキーワード
		//１個目はキーワードなので除く
		//失敗したPactに追加
		{
			A_pacts = line.split(",");
			A_pacts.shift();
			A_pactFailed += A_pacts;
		} else //そのまま出力
		{
			// print(line + "\n");
			console.log(line + "\n");
		}
	}

	// if (status != 0) {
	// 	// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " \u306E\u5B9F\u884C\u306B\u5931\u6557.");
	// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOGstatus_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
	// 	throw process.exit(1);
	// }

	status = 0;
	cmd = (PHP + " " + IMPORT_NTTCOM_INT + co_arg);
	// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\"" + cmd + "\"\u306E\u5B9F\u884C\u958B\u59CB.");
	// exec(cmd, output, status);
	
	try {
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\"" + cmd + "\"の実行開始.");
		output = execSync(cmd);
	} catch (error) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
		throw process.exit(error.status);
	}
	// for (var line of Object.values(output)) {
	for (line of output.toString().Split('\r\n')) {

		if (line.match("/^COMPLETE_PACTS/")) //完了したPactのIDを拾うキーワード
		//１個目はキーワードなので除く
		//完了したPactに追加
		{
			A_pacts = line.split(",");
			A_pacts.shift();
			A_pactDone += A_pacts;
		} else if (line.match("/^FAILED_PACTS/")) //失敗したPactのIDを拾うキーワード
		//１個目はキーワードなので除く
		//失敗したPactに追加
		{
			A_pacts = line.split(",");
			A_pacts.shift();
			A_pactFailed += A_pacts;
		} else //そのまま出力
		{
			// print(line + "\n");
			console.log(line + "\n");
		}
	}

	// if (status != 0) {
	// 	// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " \u306E\u5B9F\u884C\u306B\u5931\u6557.");
	// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + cmd + " の実行に失敗.");
	// 	throw process.exit(1);
	// }

	// A_pactDone = array_unique(A_pactDone);
	A_pactDone.filter(function (value, index, self) {
		return self.indexOf(value) === index;
	});
	// A_pactFailed = array_unique(A_pactFailed);
	A_pactFailed.filter(function (value, index, self) {
		return self.indexOf(value) === index;
	});
	// A_pactDone = array_diff(A_pactDone, A_pactFailed);
	A_pactDone.filter(function (value, index, self) {
		return self.indexOf(value) === index;
	});

	if (A_pactDone.length == 0) //この場合はロック解除する.
	{
		// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u8AAD\u307F\u8FBC\u307F\u306B\u6210\u529F\u3057\u305FPact\u304C\uFF11\u3064\u3082\u7121\u304B\u3063\u305F.");
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "読み込みに成功したPactが１つも無かった.");
		lock(false, dbh);
		throw process.exit(1);
	}

	var A_tmpExt = ["_fix", "_int"];

	// for (var pactid of Object.values(A_pactDone)) //出力ファイル作成
	for (var pactid of A_pactDone) //出力ファイル作成
	{

		var file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + ".ins";

		// var fp_teldetails = fopen(file_teldetails, "w");
		var fp_teldetails;

		try {
			fp_teldetails = fs.openSync("file5.txt", "w");
		} catch (error) {
			logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "の書き込みオープン失敗.");
			throw process.exit(1);
		}

		// if (fp_teldetails == undefined) {
		// 	// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		// 	throw process.exit(1);
		// }

		// for (var ext of Object.values(A_tmpExt)) //tmpファイルを単純に連結する.
		for (var ext of A_tmpExt) //tmpファイルを単純に連結する.
		{

			var tmp_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + ext + ".tmp";

			// if (!file_exists(tmp_teldetails)) //ファイルが存在しなければ処理をスキップ.
			if (!fs.existsSync(tmp_teldetails)) //ファイルが存在しなければ処理をスキップ.
			{
				continue;
			}


			// var fp_tmp_teldetails = fopen(tmp_teldetails, "rb");
			var  buffer;
			try {
				buffer = fs.readFileSync(tmp_teldetails);
			} catch (error) {
				logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + tmp_teldetails + "のオープン失敗.");
				throw process.exit(1);
			}
			const text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE', 
			type: 'string',
			});
			var fp_tmp_teldetails  = text.toString().split('\r\n');

			// if (fp_teldetails == undefined) {
			// 	// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + tmp_teldetails + "\u306E\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
			// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + tmp_teldetails + "のオープン失敗.");
			// 	throw process.exit(1);
			// }

			// while (line = fgets(fp_tmp_teldetails)) {
			for (line of fp_tmp_teldetails){
				// if (feof(fp_tmp_teldetails)) //おしまい.
				// 	{
				// 		break;
				// 	}
				fs.writeSync(fp_teldetails, line);
				// fputs(fp_teldetails, line);
			}

			// fclose(fp_tmp_teldetails);
		}

		// fclose(fp_teldetails);
		fs.closeSync(fp_teldetails);
	}


	// for (var pactid of Object.values(A_pactDone)) //出力ファイル作成
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
			fp_tel = fs.openSync("file5.txt", "w");
		} catch (error) {
			logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_tel + "の書き込みオープン失敗.");
			throw process.exit(1);
		}

		// if (fp_tel == undefined) {
		// 	// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_tel + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		// 	throw process.exit(1);
		// }

		var A_tmpBuf = Array();

		// for (var ext of Object.values(A_tmpExt)) //telの電話番号が重なっているものは除く.
		for (var ext of A_tmpExt) //telの電話番号が重なっているものは除く.
		//一気に配列に読み込む.
		{

			var tmp_tel = dataDir + "/" + "tel_tb" + billdate + pactid + ext + ".tmp";

			// if (!file_exists(tmp_tel)) //ファイルが存在しなければ処理をスキップ.
			if (!fs.existsSync(tmp_tel)) //ファイルが存在しなければ処理をスキップ.
			{
				continue;
			}

			// A_tmpBuf = array_merge(A_tmpBuf, file(tmp_tel));
			A_tmpBuf = A_tmpBuf.concat(fs.readFileSync(tmp_tel).toString().split('\r\n'));
		}

		// A_tmpBuf = array_unique(A_tmpBuf);
		A_tmpBuf = A_tmpBuf.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		});


		// for (var line of Object.values(A_tmpBuf)) {
		for (line of A_tmpBuf) {
			// fputs(fp_tel, line);
			fs.writeSync(fp_tel, line);
		}

		// fclose(fp_tel);
		fs.closeSync(fp_tel);
	}


// for (var pactid of Object.values(A_pactDone)) //出力ファイル作成
	for (var pactid of A_pactDone) //出力ファイル作成
	//ファイル内容を保持するバッファ.
	//ファイルの種類ごとの処理.
	//一気に書き出す.
	//重複を除く.
	{

		var file_telX = dataDir + "/" + telX_tb + billdate + pactid + ".ins";

		// var fp_telX = fopen(file_telX, "w");
		var fp_telX;

		try {
			fp_telX = fs.openSync(file_telX, "w");
		} catch (error) {
			logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "の書き込みオープン失敗.");
			throw process.exit(1);
		}

		// if (fp_telX == undefined) {
		// 	// logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_telX + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		// 	throw process.exit(1);
		// }

		A_tmpBuf = Array();

		// for (var ext of Object.values(A_tmpExt)) //telの電話番号が重なっているものは除く.
		for (var ext of A_tmpExt) //telの電話番号が重なっているものは除く.
		//一気に配列に読み込む.
		{

			var tmp_telX = dataDir + "/" + telX_tb + billdate + pactid + ext + ".tmp";

			// if (!file_exists(tmp_telX)) //ファイルが存在しなければ処理をスキップ.
			if (!fs.existsSync(tmp_telX)) //ファイルが存在しなければ処理をスキップ.
				{
					continue;
				}

			// A_tmpBuf = array_merge(A_tmpBuf, file(tmp_telX));
			A_tmpBuf = A_tmpBuf.concat(fs.readFileSync(tmp_telX).toString().split('\r\n'));
		}

		// A_tmpBuf = array_unique(A_tmpBuf);
		A_tmpBuf.filter(function (value, index, self) {
			return self.indexOf(value) === index;
		});

		// for (var line of Object.values(A_tmpBuf)) {
		for (line of A_tmpBuf) {
			// fputs(fp_telX, line);
			fs.writeSync(fp_telX, line);
		}

		// fclose(fp_telX);
		fs.closeSync(fp_telX);
	}

	// for (var pactid of Object.values(A_pactid)) {
	for (var pactid of A_pactid) {

		// for (var ext of Object.values(A_tmpExt)) {
		for (var ext of A_tmpExt) {
			file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + ext + ".tmp";

			// if (file_exists(file_teldetails)) {
			if (fs.existsSync(file_teldetails)) {
				fs.unlinkSync(file_teldetails);// 2022cvt_007
			}

			file_tel = dataDir + "/" + "tel_tb" + billdate + pactid + ext + ".tmp";

			// if (file_exists(file_tel)) {
			if (fs.existsSync(file_tel)) {
				fs.unlinkSync(file_tel);// 2022cvt_007
			}

			file_telX = dataDir + "/" + telX_tb + billdate + pactid + ext + ".tmp";

			// if (file_exists(file_telX)) {
			if (fs.existsSync(file_telX)) {
				fs.unlinkSync(file_telX);// 2022cvt_007
			}
		}
	}

	if (backup == "y") {
		// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u51E6\u7406\u958B\u59CB.");
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理開始.");
		doBackup(dbh);
		// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u51E6\u7406\u5B8C\u4E86.");
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理完了.");
	}


	// for (var pactid of Object.values(A_pactDone)) //コミットポイント開始
	for (var pactid of A_pactDone) //コミットポイント開始
	//データをインポートする前にデリート
	//処理済みのデータを移動
	{
		dbh.begin();

		if (mode == "o") {
			// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u958B\u59CB.");
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理開始.");

			if (await doDelete(pactid, dbh) != 0) //失敗したら次のPactへ.
			{
				continue;
			}

			// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u5B8C\u4E86.");
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理完了.");
		}

		// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB.");
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理開始.");
		file_tel = dataDir + "/" + "tel_tb" + billdate + pactid + ".ins";
		file_telX = dataDir + "/" + telX_tb + billdate + pactid + ".ins";
		file_teldetails = dataDir + "/" + teldetailX_tb + billdate + pactid + ".ins";

		if (await doImport(file_tel, file_telX, file_teldetails, dbh) != 0) //失敗したら次のPactへ.
		{
			continue;
		}

	// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u5B8C\u4E86.");
		logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理完了.");
		dbh.commit();

		var pactDir = dataDir + "/" + pactid;

		var finDir = pactDir + "/" + FIN_DIR;
		finalData(pactid, pactDir, finDir);
	}

	lock(false, dbh);
	// logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5B8C\u4E86.");
	logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
	throw process.exit(0);

	function doBackup(db: ScriptDB) //tel_details_X_tb をエクスポートする
	{
		// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
		// if (!("logh" in global)) logh = undefined;
		// if (!("pactid_in" in global)) pactid_in = undefined;
		// if (!("billdate" in global)) billdate = undefined;

		// var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + date("YmdHis") + ".exp";
		var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";

		var sql = "select * from " + teldetailX_tb;
		db.begin();

		// if (doCopyExp(sql, outfile, db) != 0) //ロールバック
		if (expDataByCursor(sql, outfile, db.m_db) != 0) //ロールバック
		//ロック解除
		{
			// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデータエクスポートに失敗しました.");
			dbh.rollback();
			lock(false, db);
			throw process.exit(1);
		}

		db.commit();
		return 0;
	};

	async function doDelete(pactid, db: ScriptDB) //delte失敗した場合
	{
		// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
		// if (!("logh" in global)) logh = undefined;

		var sql_str = "delete from " + teldetailX_tb + " where pactid=" + pactid + " and carid=" + NTTCOM_CARRIER_ID;

		var rtn = await db.query(sql_str, false);

		// if ("object" === typeof rtn == true) //ロールバック
		if (db.isError()) //ロールバック
		{
			// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデリートに失敗しました、");
			db.rollback();
			return 1;
		}

		return 0;
	};

async function doImport(file_tel, file_telX, file_teldetails, db: ScriptDB) //$tel_columns =
//"pactid, postid, telno, telno_view, userid, carid, arid, cirid, machine, color, planid, planalert, packetid, packetalert, pointstage, employeecode, username, mail, orderdate, text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, text11, text12, text13, text14, text15, int1, int2, int3, date1, date2, memo, movepostid, moveteldate, delteldate, recdate, fixdate, options, contractdate, finishing_f, schedule_person_name, schedule_person_userid, schedule_person_postid";
//$teldetail_columns =
//"pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid,tdcomment";
//tel_tbへのインポート
//// 要望により停止
//	if( filesize($file_tel) > 0 )
//	{
//		$tel_col = array(
//			"pactid",		// $pactid
//			"postid",		// $rootPostid
//			"telno",		// $telno
//			"telno_view",	// $telno_view
//			"carid",		// NTTCOM_CARRIER_ID
//			"arid",			// NTTCOM_AREA_ID
//			"cirid",		// NTTCOM_CIRCUIT_ID
//			"recdate",		// $nowtime
//			"fixdate"		// $nowtime
//		);
//
//		if( doCopyInsert("tel_tb", $file_tel, $tel_col, $db) != 0){
//			$logh->putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//				. "tel_tbのインポートに失敗しました." );
//			// ロールバック
//			$db->rollback();
//			// ロック解除
//		//	lock(false, $db);
//			exit(1);
//		}else{
//			$logh->putError(G_SCRIPT_INFO, SCRIPT_NAMEJ . LOG_DELIM . $pactid_in . LOG_DELIM . LOG_DELIM . $billdate . LOG_DELIM
//				. "tel_tb のインポート完了." );
//		}
//	}
//telX_tbへのインポート
	{
		// if (!("telX_tb" in global)) telX_tb = undefined;
		// if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
		// if (!("logh" in global)) logh = undefined;
		// if (!("pactid_in" in global)) pactid_in = undefined;
		// if (!("billdate" in global)) billdate = undefined;

		var stat = fs.statSync(file_telX);
		// if (filesize(file_telX) > 0) {
		if (stat.size != 0) {

			var telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "userid", "machine", "color", "employeecode", "username", "mail", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "date1", "date2", "memo", "kousiflg", "kousiptn", "username_kana", "kousi_fix_flg", "mail1", "mail2", "mail3", "url1", "url2", "url3", "select1", "select2", "select3", "select4", "select5", "select6", "select7", "select8", "select9", "select10", "recdate", "fixdate"];

			if (await doCopyInsert(telX_tb, file_telX, telX_col, db) != 0) //ロールバック
				//ロック解除
				//lock(false, $db);
			{
				// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);
			} else {
			// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + telX_tb + "のインポート完了");
			}
		}

		var stat = fs.statSync(file_teldetails);
		// if (filesize(file_teldetails) > 0) {
		if (stat.size != 0) {

			var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "prtelno"];

			if (await doCopyInsert(teldetailX_tb, file_teldetails, teldetailX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のインポートに失敗しました.");
				db.rollback();
				throw process.exit(1);
			} else {
			// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " のインポート完了");
		}
		} else //ファイルサイズが０？
		{
			// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\uFF10\u3067\u3059.");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "のファイルサイズが０です.");
			return 1;
		}

		return 0;
	};

async function doCopyInsert(table, filename, columns, db: ScriptDB) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
	{
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	// var fp = fopen(filename, "rt");
		var buffer;
		try {
			buffer = fs.readFileSync(filename);
		} catch (error) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
			return 1;
		}
		const text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE', 
			type: 'string',
		});
		var fp  = text.toString().split('\r\n');

		// if (!fp) {
		// 	// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		// 	logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
		// 	return 1;
		// }


	// var ins = new TableInserter(logh, db, filename + ".sql", true);
		var ins = new TableInserter(logh.m_listener, db, filename + ".sql", true);
		ins.begin(table);

		// while (line = fgets(fp)) //データはtab区切り
		for (line in fp) //データはtab区切り
		//インサート行の追加
		{

			// var A_line = split("\t", rtrim(line, "\n"));
			var A_line = line.replace("\n", "").split("\t");

			if (A_line.length != columns.length) //要素数が異なっていたら
			{
				// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002\u30C7\u30FC\u30BF=" + line);
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のデータ数が設定と異なります。データ=" + line);
				// fclose(fp);
				return 1;
			}


		// var H_ins = Array();
			var H_ins: {[key: string]: any} = {};

			var idx = 0;


			// for (var col of Object.values(columns)) {
			for (var col of columns) {
				if (A_line[idx] != "\\N") //\N の場合はハッシュに追加しない
				{
					H_ins[col] = A_line[idx];
				}

				idx++;
			}

			if (await ins.insert(H_ins) == false) {
				// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F\u3001\u30C7\u30FC\u30BF=" + line);
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート中にエラー発生、データ=" + line);
				// fclose(fp);
				return 1;
			}
		}

		if (ins.end() == false) {
			// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557.");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート処理に失敗.");
			// fclose(fp);
			return 1;
		}

		// fclose(fp);
		return 0;
	};

// function doCopyExp(sql, filename, db: ScriptDB) //ログファイルハンドラ
// //一度にFETCHする行数
// //ファイルを開く
// {
// 	// if (!("logh" in global)) logh = undefined;
// 	// if (!("pactid_in" in global)) pactid_in = undefined;
// 	// if (!("billdate" in global)) billdate = undefined;
// 
// 	var NUM_FETCH = 10000;
// 
// 	// var fp = fopen(filename, "wt");
// 	const fp = fs.openSync(filename, "w");

// 	if (!fp) {
// 		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
// 		return 1;
// 	}

// 	db.query("DECLARE exp_cur CURSOR FOR " + sql);

// 	for (; ; ) //ＤＢから１行ずつ結果取得
// 	{
// 
// 		var result = pg_query(db.m_db.connection, "FETCH " + NUM_FETCH + " IN exp_cur");

// 		if (result == undefined) {
// 			// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Fetch error, " + sql);
// 			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Fetch error, " + sql);
// 			// fclose(fp);
// 			return 1;
// 		}
// 		var A_line = pg_fetch_array(result, 0)
// 		// if ((A_line = pg_fetch_array(result)) == undefined) //ループ終了
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
// 			// for (var item of Object.values(A_line)) //データ区切り記号
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
// 		} while (A_line = pg_fetch_array(result, 0));

// 		// if (fputs(fp, str) == false) {
// 		if (fs.writeSync(fp, str) == false) {
// 			// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557\u3001" + str);
// 			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "への書き込み失敗、" + str);
// 			// fclose(fp);
// 			fs.closeSync(fp);
// 			return 1;
// 		}
// 	}

// 	db.query("CLOSE exp_cur");
// 	// fclose(fp);
// 	fs.closeSync(fp);
// 	return 0;
// };

function finalData(pactid, pactDir, finDir) //同名のファイルが無いか
	{
		// if (!("logh" in global)) logh = undefined;
		// if (!("billdate" in global)) billdate = undefined;

		if (fs.statSync(finDir).isFile() == true) {
		// if (is_file(finDir) == true) {
			// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + finDir + "\u306F\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3067\u306F\u3042\u308A\u307E\u305B\u3093.");
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + finDir + "はディレクトリではありません.");
			return 1;
		}

		if (fs.existsSync(finDir) == false) //なければ作成する// 2022cvt_003
		{
			try {
				fs.mkdirSync(finDir)
			} catch (error) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "異動先の" + finDir + "が作成できなかった..");
				return 1;
			}
			// if (mkdir(finDir) == false) {
			// if (fs.mkdirSync(finDir)) {
			// 	// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u7570\u52D5\u5148\u306E" + finDir + "\u304C\u4F5C\u6210\u3067\u304D\u306A\u304B\u3063\u305F.");
			// 	logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "異動先の" + finDir + "が作成できなかった..");
			// 	return 1;
			// }
		}


		var retval = 0;

		// var dirh = openDir(pactDir);
		var dirh = fs.readdirSync(pactDir);

		// while (fname = fs.readdir(dirh)) {
		for (var fname of dirh) {

			var fpath = pactDir + "/" + fname;

			if (fs.statSync(fpath).isFile()) //ファイル名の先頭文字が適合するものだけ
			{
				// if (preg_match(NTTCOM_PAT, fname)) //ファイル移動
				if (fname.match(NTTCOM_PAT)) //ファイル移動
				{
					try {
						fs.renameSync(fpath, finDir + "/" + fname)
					} catch (error) {
						logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "の異動失敗.");
						retval = 1;
					}
						// if (rename(fpath, finDir + "/" + fname) == false) {
						// if (fs.renameSync(fpath, finDir + "/" + fname)) {
						// 	// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "\u306E\u7570\u52D5\u5931\u6557.");
						// 	logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "の異動失敗.");
						// 	retval = 1;
						// }
				}
			}

// 		clearstatcache();
		}

	// closedir(dirh);
		return retval;
	};

	function usage(comment, db: ScriptDB) //ロック解除
	{
		if (comment == "") {
			// comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
			comment = "パラメータが不正です";
		}

	// print("\n" + comment + "\n\n");
	// print("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
	// print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	// print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	// print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	// print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	// print("\t\t-t \u5F53\u6708\u30C7\u30FC\u30BF\t(N:\u30C7\u30FC\u30BF\u306F\u4ECA\u6708\u306E\u3082\u306E,O:\u30C7\u30FC\u30BF\u306F\u5148\u6708\u306E\u3082\u306E)\n\n");
		console.log("\n" + comment + "\n\n");
		console.log("Usage) " + process.argv[0] + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O}\n");
		console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
		console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
		console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
		console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
		console.log("		-t 当月データ	(N:データは今月のもの,O:データは先月のもの)\n\n");

		lock(false, db);
		throw process.exit(1);
	};

	async function lock(is_lock, db: ScriptDB) //ロックする
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

			var sql = "select count(*) from clamptask_tb " + "where command like '" + db.escape(pre + "%") + "' and " + "status = 1;";

			var count = db.getOne(sql);

			if (await count != 0) {
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
