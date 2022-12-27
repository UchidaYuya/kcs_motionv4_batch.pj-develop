//===========================================================================
//機能：通話明細ファイルインポートプロセス（DDI POCKET専用）
//
//作成：前田
//ＤＢ２重化対応 ＣＯＰＹ文を廃止 2006/05/25 s.Maeda
//公私分計対応 2006/08/04 s.Maeda
//複数ファイル一括取り込み対応 2006/09/13 s.Maeda
//着信地名がＰＲＩＮで付加サービスが通信時間の明細は通話明細表示が重複となるため除外する 2007/11/15 s.Maeda
// 2022cvt_015
//mb_convert_variablesでオーバーフローしている箇所を対処 2008/08/22 Kenichiro.Uesugi
//パケット料金を算出する際、小数点以下第３を四捨五入するよう変更 2010/06/25 s.maeda
//===========================================================================

// 2022cvt_026
import TableNo, { ScriptDB, TableInserter } from "./lib/script_db";
// require("lib/script_db.php");

// 2022cvt_026
import { G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "./lib/script_log";
// require("lib/script_log.php");

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";
import { G_AUTH_ASP, G_AUTH_KOUSI, G_CARRIER_DDI } from "./lib/script_common";
import { expDataByCursor, pg_copy_from, pg_fetch_array } from "../pg_function";

(async () => {
const DEBUG = 1;
const DDI_DIR = "/DDI/tuwa";
const FIN_DIR = "/fin";
const LOG_DELIM = " ";
const PRE_DUMMY_TEL = "DDI";
const SCRIPTNAME = "import_ddi_tuwa.php";
const PAKEKOMI = 388;
const PACKET_UNIT_PRICE = 0.05;
const PAKEKOMI_UNIT_PRICE = 0.03;
const HEADER_KUBUN = 10;
const KUBUN_START = 1;
const KUBUN_LEN = 2;
const ACCOUNT_START = 5;
const ACCOUNT_LEN = 10;
const BILLDATE_START = 86;
const BILLDATE_LEN = 6;
const TEL_DATA_KUBUN = 30;
const TEL_START = 13;
const TEL_LEN = 16;
const TUWA_DATE_START = 34;
const TUWA_DATE_LEN = 8;
const TUWA_TIME_START = 44;
const TUWA_TIME_LEN = 6;
const FROM_PLACE_START = 50;
const FROM_PLACE_LEN = 10;
const TO_TEL_START = 60;
const TO_TEL_LEN = 16;
const TO_PLACE_START = 76;
const TO_PLACE_LEN = 10;
const TEL_TIME_START = 86;
const TEL_TIME_LEN = 7;
const CHARGE_START = 93;
const CHARGE_LEN = 7;
const CHARGE_SEG_START = 100;
const CHARGE_SEG_LEN = 8;
const FUKA_SERVE_START = 108;
const FUKA_SERVE_LEN = 8;
const PACKET_KUBUN = 31;
const BYTE_START = 86;
const BYTE_LEN = 12;
const TEL_TYPE = "DN";
const PACKET_TYPE = "DP";
const NUM_FETCH = 10000;
const COPY_LINES = 10000;
// 2022cvt_015
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
// 2022cvt_015
var log_listener = new ScriptLogBase(0);
// 2022cvt_016
// 2022cvt_015
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
// 2022cvt_016
log_listener.putListener(log_listener_type);
// 2022cvt_015
var dbh = new ScriptDB(log_listener);
// 2022cvt_015
var logh = new ScriptLogAdaptor(log_listener, true);

var year = 0;
var month = 0;
var pactid = "";
var mode = "";
var backup = "";

if (process.argv.length != 5 + 1) //数が正しい
	{
		usage("");
	} else //$argvCounter 0 はスクリプト名のため無視
	{
// 2022cvt_015
		var argvCnt = process.argv.length;

// 2022cvt_015
		for (var argvCounter = 1 + 1; argvCounter < argvCnt; argvCounter++) //mode を取得
		{
			if (process.argv[argvCounter].match("^-e="))
			// if (ereg("^-e=", _SERVER.argv[argvCounter]) == true) //モード文字列チェック
				{
// 2022cvt_015
					mode = process.argv[argvCounter].replace("^-e=", "").toLowerCase();
					// var mode = ereg_replace("^-e=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (!mode.match("^[ao]$")) {
					// if (ereg("^[ao]$", mode) == false) {
						usage("モードの指定が不正です");
					}

					continue;
				}

			if (process.argv[argvCounter].match("^-y="))
			// if (ereg("^-y=", _SERVER.argv[argvCounter]) == true) //請求年月文字列チェック
				{
// 2022cvt_015
					var billdate = process.argv[argvCounter].replace("^-y=", "");
					// var billdate = ereg_replace("^-y=", "", _SERVER.argv[argvCounter]);

					if (!billdate.match("^[0-9]{6}$")) {
					// if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("請求年月の指定が不正です");
					} else //年月チェック
						{
// 2022cvt_015
							year = parseInt(billdate.substring(0, 4));
// 2022cvt_015
							month = parseInt(billdate.substring(4, 2));

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("請求年月の指定が不正です");
							}
						}

					continue;
				}

			if (process.argv[argvCounter].match("^-p="))
			// if (ereg("^-p=", _SERVER.argv[argvCounter]) == true) //契約ＩＤチェック
				{
// 2022cvt_015
					pactid = process.argv[argvCounter].replace("^-p=", "").toLowerCase();
					// var pactid = ereg_replace("^-p=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (!pactid.match("^all$") && !pactid.match("^[0-9]+$")) {
					// if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("契約ＩＤの指定が不正です");
					}

					continue;
				}

			if (process.argv[argvCounter].match("^-b="))
			// if (ereg("^-b=", _SERVER.argv[argvCounter]) == true) //バックアップの有無のチェック
				{
// 2022cvt_015
					backup = process.argv[argvCounter].replace("^-b=", "").toLowerCase();
					// var backup = ereg_replace("^-b=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (!backup.match("^[ny]$")) {
					// if (ereg("^[ny]$", backup) == false) {
						usage("バックアップの指定が不正です");
					}

					continue;
				}

			usage("");
		}
	}

console.log("BEGIN: ＷＩＬＬＣＯＭ通話明細ファイルインポート処理開始\n");
logh.putError(G_SCRIPT_BEGIN, "ＷＩＬＬＣＯＭ通話明細ファイルインポート処理開始");
// 2022cvt_015
var dataDir = DATA_DIR + "/" + year + month + DDI_DIR;
var A_pactid = Array();

if (fs.existsSync(dataDir) == false) //ディレクトリのパスが正しい場合// 2022cvt_003
	{
		console.log("\nＷＩＬＬＣＯＭ通話明細データファイルディレクトリ（" + dataDir + "）がみつかりません\n");
		logh.putError(G_SCRIPT_ERROR, "ＷＩＬＬＣＯＭ通話明細データファイルディレクトリ（" + dataDir + "）がみつかりません");
	} else //処理する契約ＩＤ配列
	//ディレクトリハンドル
	//契約ＩＤの指定が全て（all）の時
	{
// 2022cvt_015
		A_pactid = Array();
// 2022cvt_015
		var dirh = fs.readdirSync(dataDir);
		// var dirh = openDir(dataDir);// 2022cvt_004

		if (pactid == "all") //処理する契約ＩＤを取得する
			//契約ＩＤが指定されている場合
			{

				for (var fileName of dirh)
				// while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
				{
					if (fs.existsSync(dataDir + "/" + fileName) == true && fileName != "." && fileName != "..") {// 2022cvt_003
						A_pactid.push(fileName);
					}

// 					clearstatcache();// 2022cvt_012
				}
			} else {
			A_pactid.push(pactid);
		}

		// closedir(dirh);
	}

lock(true);
// 2022cvt_015
var H_result = await dbh.getHash("select pactid,compname from pact_tb order by pactid", true);
// 2022cvt_015
var pactCnt = H_result.length;

var H_pactid = Array();

// 2022cvt_015
for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) {
	H_pactid[H_result[pactCounter].pactid] = H_result[pactCounter].compname;
}

// 2022cvt_015
var sql_str = "select pactid from fnc_relation_tb where userid = 0 and fncid = " + G_AUTH_KOUSI;
// 2022cvt_015
var A_kousiPact: any = await dbh.getCol(sql_str);
sql_str = "select patternid,comhistbaseflg from kousi_pattern_tb where carid = " + G_CARRIER_DDI + " and comhistflg = '1' order by patternid";
H_result = await dbh.getHash(sql_str);
// 2022cvt_015
var comhistCnt = H_result.length;

var H_comhist = Array();

// 2022cvt_015
for (var comhistCounter = 0; comhistCounter < comhistCnt; comhistCounter++) {
	H_comhist[H_result[comhistCounter].patternid] = H_result[comhistCounter].comhistbaseflg;
}

// 2022cvt_015
var O_tableNo = new TableNo();
// 2022cvt_015
var tableNo = O_tableNo.get(year, month);
// 2022cvt_015
var commhistory_tb = "commhistory_" + tableNo + "_tb";
// 2022cvt_015
var telX_tb = "tel_" + tableNo + "_tb";
// 2022cvt_015
var totel_tb = "kousi_totel_master_tb";
pactCnt = A_pactid.length;
A_pactid.sort();
// 2022cvt_015
var A_pactDone = Array();
// 2022cvt_015
var commhistoryFile = dataDir + "/" + commhistory_tb + year + month + pactid + ".ins";
// 2022cvt_015
var fp_commhistory = fs.openSync(commhistoryFile, "w");
// var fp_commhistory = fopen(commhistoryFile, "w");
// 2022cvt_015
var totelFile = dataDir + "/" + totel_tb + year + month + pactid + ".ins";
// 2022cvt_015
var fp_totel = fs.openSync(totelFile, "w");
// var fp_totel = fopen(totelFile, "w");
// 2022cvt_016
// 2022cvt_015
var H_commtype = {
	[TEL_DATA_KUBUN]: "DN",
	[PACKET_KUBUN]: "DP"
};
// 2022cvt_016
sql_str = "select type from kousi_commtype_tb where carid = " + G_CARRIER_DDI;
// 2022cvt_016
// 2022cvt_015
var A_commtype = await dbh.getCol(sql_str);

var importFlg: boolean = false;

for (pactCounter = 0; pactCounter < pactCnt; pactCounter++) //通話明細データディレクトリにある契約ＩＤがマスターに登録されている場合
{
	if (undefined !== H_pactid[A_pactid[pactCounter]] == true) //処理する通話明細データファイル名配列
		//通話明細データファイル名を取得する
		//ファイル名順でソート
		//通話明細データファイルがなかった場合
		//通話明細データディレクトリにある契約ＩＤがマスターに登録されていない場合
		{
// 2022cvt_015
			var A_commFile = Array();
// 2022cvt_015
			var dataDirPact = dataDir + "/" + A_pactid[pactCounter];
			var dirh = fs.readdirSync(dataDirPact);
			// dirh = openDir(dataDirPact);// 2022cvt_004

			for (var fileName of dirh) {
			// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
// 2022cvt_028
				if (fs.statSync(dataDirPact + "/" + fileName).isFile()) {
				// if (is_file(dataDirPact + "/" + fileName) == true) {
					A_commFile.push(fileName);
				}

// 				clearstatcache();// 2022cvt_012
			}

			A_commFile.sort();

			if (A_commFile.length == 0) //通話明細データファイルがあった場合
				{
					console.log("WARNING: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の通話明細データファイルが見つかりません\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の通話明細データファイルが見つかりません");
					// closedir(dirh);
					continue;
				} else //ファイルデータ格納配列
				//ファイルデータの契約ＩＤ
				//ファイルデータの請求年月
				//ファイルデータのアカウント
				//commhistory_X_tb インポートデータファイル出力用配列
				//電話のプランマスター
				//公私分計デフォルトパターン
				//「通話記録判定使用する」場合のみの公私分計パターン
				//kousi_totel_master_tb インポートデータファイル出力用配列
				//既に取り込みされているかどうか（false:されていない、true:されている）
				//$commCnt = 0;						// 同月データが既にある登録されている件数
				//$A_totelNoDel = array();			// 同月データが登録された際に登録された掛け先マスターで公私区分が
				//未登録になっている電話番号配列
				//追記モードなら既に別ファイルが取り込まれているかチェックする
				//電話のプランマスターを作成
				//公私分計権限があり、
				//kousi_pattern_tbに通話記録判定を使用するパターンが１件でもあれば
				//デフォルトパターンが通話記録判定を使用するパターンかどうかをチェックする
				//出力件数用変数初期化
				//UPDATE 2008/08/22 Kenichiro Uesugi
// 2022cvt_015
				//mb_convert_variables("UTF-8", "EUC-JP", $A_commOutputBuff);
				//commhistory_X_tb ファイル出力
				//UPDATE END 2008/08/22 Kenichiro Uesugi
				//バッファ出力
				//公私分計権限がある場合
				{
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + A_pactid[pactCounter] + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + LOG_DELIM + year + month + LOG_DELIM + A_commFile.join(","));
// 2022cvt_015
					var A_fileData = Array();
// 2022cvt_015
					var filePact = "";
// 2022cvt_015
					var fileBillDate = "";
// 2022cvt_015
					var fileAccount = "";
// 2022cvt_015
					var A_commOutputBuff = Array();
// 2022cvt_015
					var H_tel = Array();
// 2022cvt_015
					var defaultPtn = "";
// 2022cvt_015
					var H_telKousi = Array();
// 2022cvt_015
					var A_totelOutputBuff = Array();
// 2022cvt_015
					importFlg = false;

					if (mode == "a") //既に取り込みが終了している件数
						//レコードがある場合
						{
							sql_str = "select count(*) from " + commhistory_tb + " where pactid = " + A_pactid[pactCounter] + " and carid = " + G_CARRIER_DDI;
// 2022cvt_015
							var rtn = await dbh.getOne(sql_str);

							if (rtn > 0) //既に取り込みされている
								{
									importFlg = true;
								}
						}

					sql_str = "select telno,planid from " + telX_tb + " where pactid = " + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " order by telno";
					H_result = await dbh.getHash(sql_str);
// 2022cvt_015
					var telCnt = H_result.length;

// 2022cvt_015
					for (var telCounter = 0; telCounter < telCnt; telCounter++) {
						H_tel[H_result[telCounter].telno] = H_result[telCounter].planid;
					}

					if (-1 !== A_kousiPact.indexOf(A_pactid[pactCounter]) == true && comhistCnt != 0) //デフォルトパターンが「公私分計する」でそのパターンが「通話記録判定使用する」場合のみパターンＩＤがセットされる
						//「通話記録判定使用する」パターンが設定されている電話を取得する
						//デフォルトパターンも「通話記録判定使用する」場合はUNIONで連結
						//「通話記録判定使用する」電話の件数
						//通話記録判定使用する電話をキー、パターンＩＤ
						//通話記録判定使用する電話が１件でもあれば
						{
							sql_str = "select patternid from kousi_default_tb " + "where pactid = " + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " and " + "kousiflg = '0' and " + "patternid in (" + Object.keys(H_comhist).join(",") + ")";
							defaultPtn = await dbh.getOne(sql_str, true);
							sql_str = "select telno,kousiptn from " + telX_tb + " " + "where pactid = " + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " and " + "kousiflg = '0' and " + "kousiptn in (" + Object.keys(H_comhist).join(",") + ") ";

							if (defaultPtn != "") {
								sql_str = sql_str + "union " + "select telno," + defaultPtn + " as kousiptn from " + telX_tb + " " + "where pactid = " + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " and " + "kousiflg is null ";
							}

							sql_str = sql_str + "order by telno";
							H_result = await dbh.getHash(sql_str);
// 2022cvt_015
							var telKousiCnt = H_result.length;

							for (telCounter = 0; telCounter < telKousiCnt; telCounter++) {
								H_telKousi[H_result[telCounter].telno] = H_result[telCounter].kousiptn;
							}

							if (telKousiCnt != 0) //kousi_totel_master_tb より通話記録判定使用する電話の掛け先電話番号と公私分計フラグを取得する
								//別ファイルがまだ取り込みされていない場合はkousiflgが未登録は除く
								//別ファイルがまだ取り込みされているが追記モードではない場合はkousiflgが未登録は除く
								//別ファイルが取り込みされており、かつ追記モードの場合はkousiflgが未登録も含む（つまり全件が対象）
								//別ファイルがまだ取り込みされていない場合はkousiflgが未登録は除く
								//別ファイルがまだ取り込みされているが追記モードではない場合はkousiflgが未登録は除く
								//既に登録されている掛け先マスターの件数
								//掛け元をキー、掛け先がキーで公私分計フラグを値にした連想配列が値の連想配列を作成
								{
									sql_str = "select telno,totelno,kousiflg from " + totel_tb + " " + "where pactid = " + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " and " + "telno in ('" + Object.keys(H_telKousi).join("','") + "') ";

									if (importFlg == false || importFlg == true && mode == "o") {
										sql_str = sql_str + "and kousiflg != 2 ";
									}

									sql_str = sql_str + "order by telno,totelno";
									H_result = await dbh.getHash(sql_str);
// 2022cvt_015
									var totelCnt = H_result.length;
// 2022cvt_015
									var oldtelno = "";
									var H_totel = Array();
									var H_totelTmp = Array();

									for (telCounter = 0; telCounter < totelCnt; telCounter++) //前レコードと掛け元電話番号が違う場合
									//掛け元電話番号を退避
									{
										if (oldtelno != "" && oldtelno != H_result[telCounter].telno) {
											H_totel[oldtelno] = H_totelTmp;
// 2022cvt_015
											H_totelTmp = Array();
										}

										H_totelTmp[H_result[telCounter].totelno] = H_result[telCounter].kousiflg;
										oldtelno = H_result[telCounter].telno;
									}

									if (totelCnt != 0) {
										H_totel[oldtelno] = H_totelTmp;
									}
								}
						}

// 2022cvt_015
					for (var fileCounter = 0; fileCounter < A_commFile.length; fileCounter++) //ファイルサイズチェック 固定長128+1 バイト 最終行改行1バイト
					//1行ずつの処理
					{
						if ((fs.statSync(dataDirPact + "/" + A_commFile[fileCounter]).size - 1) % 129 != 0)
						// if ((filesize(dataDirPact + "/" + A_commFile[fileCounter]) - 1) % 129 != 0) //エラーとなった契約ＩＤはとばすが処理は続ける
							{
								console.log("WARNING: " + dataDirPact + "/" + A_commFile[fileCounter] + " ファイルのフォーマットが不正です\n");
								logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の通話明細データファイル（" + dataDirPact + "/" + A_commFile[0] + "）のフォーマットが不正です");
								continue;
							}

						A_fileData[fileCounter] = fs.readFileSync(dataDirPact + "/" + A_commFile[fileCounter]).toString().split("\r\n");
						// A_fileData[fileCounter] = file(dataDirPact + "/" + A_commFile[fileCounter]);

// 2022cvt_015
						for (var lineCounter = 0; lineCounter < A_fileData[fileCounter].length; lineCounter++) //区分を取得
						//区分が10ならヘッダー アカウントと請求年月度を取得する
						{
// 2022cvt_015
							var dataKubun = A_fileData[fileCounter][lineCounter].substring(KUBUN_START - 1, KUBUN_LEN);

							if (dataKubun == HEADER_KUBUN) //パラメータの請求年月の１ヶ月前とファイルの請求年月度が違う場合
								//pactid が見つからなかった場合
								{
									fileAccount = A_fileData[fileCounter][lineCounter].substring(ACCOUNT_START - 1, ACCOUNT_LEN);
									fileBillDate = A_fileData[fileCounter][lineCounter].substring(BILLDATE_START - 1, BILLDATE_LEN);

									if (fileBillDate != new Date(year, month - 1, 1).toJSON().slice(0,8).replace(/-/g, ""))
									// if (fileBillDate != date("Ym", mktime(0, 0, 0, month - 1, 1, year))) //エラーとなった契約ＩＤはとばすが処理は続ける
										{
											console.log("WARNING: " + dataDirPact + "/" + A_commFile[fileCounter] + " ファイルの請求年月が不正です\n");
											logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の通話明細データファイル（" + dataDirPact + "/" + A_commFile[0] + "）請求年月が不正です");
											continue;
										}

// 2022cvt_015
									var sql = "select pactid from bill_prtel_tb where carid = " + G_CARRIER_DDI + " " + "and prtelno = '" + fileAccount + "'";
									filePact = await dbh.getOne(sql, true);

									if (filePact == "") //エラーとなった契約ＩＤはとばすが処理は続ける
										{
											console.log("WARNING: " + dataDirPact + "/" + A_commFile[fileCounter] + " のお客様番号（" + fileAccount + "）が見つかりません\n");
											logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の通話明細データファイル（" + dataDirPact + "/" + A_commFile[0] + "）のお客様番号（" + fileAccount + "）が見つかりません");
											continue;
										}

									if (filePact != A_pactid[pactCounter]) //エラーとなった契約ＩＤはとばすが処理は続ける
										{
											console.log("WARNING: " + dataDirPact + "/" + A_commFile[fileCounter] + " ファイルの契約ＩＤが不正です\n");
											logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") の通話明細データファイル（" + dataDirPact + "/" + A_commFile[0] + "）契約ＩＤが不正です");
											continue;
										}
								} else if (dataKubun == TEL_DATA_KUBUN) //着信地名がＰＲＩＮで付加サービスが通信時間の明細は通話明細表示が重複となるため除外する
								//公私分計フラグを取得
								//区分が31ならパケットまたはＡＰセンタ
								{
// 2022cvt_020
// 2022cvt_015
									var telno = A_fileData[fileCounter][lineCounter].substring(TEL_START - 1, TEL_LEN).replace("-", "").trim();
									// var telno = rtrim(str_replace("-", "", A_fileData[fileCounter][lineCounter].substr(TEL_START - 1, TEL_LEN)));
// 2022cvt_015
									var date = A_fileData[fileCounter][lineCounter].substring(TUWA_DATE_START - 1, TUWA_DATE_LEN) + " " + A_fileData[fileCounter][lineCounter].substring(TUWA_TIME_START - 1, TUWA_TIME_LEN);
// 2022cvt_015
									var fromplace = A_fileData[fileCounter][lineCounter].substring(FROM_PLACE_START - 1, FROM_PLACE_LEN).trim();
									// var fromplace = rtrim(A_fileData[fileCounter][lineCounter].substr(FROM_PLACE_START - 1, FROM_PLACE_LEN));
// 2022cvt_015
									var totelno = A_fileData[fileCounter][lineCounter].substring(TO_TEL_START - 1, TO_TEL_LEN).trim();
									// var totelno = rtrim(A_fileData[fileCounter][lineCounter].substr(TO_TEL_START - 1, TO_TEL_LEN));
// 2022cvt_020
// 2022cvt_015
									var totelRep = totelno.replace("-", "").trim();
									// var totelRep = rtrim(str_replace("-", "", totelno));
// 2022cvt_015
									var toplace = A_fileData[fileCounter][lineCounter].substring(TO_PLACE_START - 1, TO_PLACE_LEN);
// 2022cvt_015
									var time = A_fileData[fileCounter][lineCounter].substring(TEL_TIME_START - 1, TEL_TIME_LEN);
// 2022cvt_015
									var charge: string | number = A_fileData[fileCounter][lineCounter].substring(CHARGE_START - 1, CHARGE_LEN) / 10;
// 2022cvt_015
									var fuka = A_fileData[fileCounter][lineCounter].substring(FUKA_SERVE_START - 1, FUKA_SERVE_LEN);

									// var prinArray = Encoding.stringToCode("ＰＲＩＮ　");
									// var fukaArray = Encoding.stringToCode("通信時間");
									// if (toplace == Encoding.convert(prinArray, { from: "UTF8", to: "SJIS", type: "string" }) && Encoding.convert(fukaArray, { from: "UTF8", to: "SJIS", type: "string" })) {
									// 	continue;
									// }
									// if (toplace == mb_convert_encoding("ＰＲＩＮ　", "CP51932", "UTF-8") && fuka == mb_convert_encoding("通信時間", "CP51932", "UTF-8")) {
									// 	continue;
									// }

									if (charge == 0) {
										charge = "\\N";
									}

// 2022cvt_015
									var chargeseg = A_fileData[fileCounter][lineCounter].substring(CHARGE_SEG_START - 1, CHARGE_SEG_LEN);
// 2022cvt_015
									var kousiflg = getKousiflg(filePact, telno, totelRep, TEL_DATA_KUBUN);
									A_commOutputBuff.push(filePact + "\t" + telno + "\t" + TEL_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t" + time + "\t" + charge + "\t\\N\t" + chargeseg + "\t" + G_CARRIER_DDI + "\t" + kousiflg + "\n");
								} else if (dataKubun == PACKET_KUBUN) //料金が０の場合
								//公私分計フラグを取得
								{
// 2022cvt_020
									telno = A_fileData[fileCounter][lineCounter].substring(TEL_START - 1, TEL_LEN).replace("-", "").trim();
									// telno = rtrim(str_replace("-", "", A_fileData[fileCounter][lineCounter].substr(TEL_START - 1, TEL_LEN)));
									date = A_fileData[fileCounter][lineCounter].substring(TUWA_DATE_START - 1, TUWA_DATE_LEN) + " " + A_fileData[fileCounter][lineCounter].substring(TUWA_TIME_START - 1, TUWA_TIME_LEN);
									fromplace = A_fileData[fileCounter][lineCounter].substring(FROM_PLACE_START - 1, FROM_PLACE_LEN);
									totelno = A_fileData[fileCounter][lineCounter].substring(TO_TEL_START - 1, TO_TEL_LEN);
									toplace = A_fileData[fileCounter][lineCounter].substring(TO_PLACE_START - 1, TO_PLACE_LEN);
// 2022cvt_015
									var byte = A_fileData[fileCounter][lineCounter].substring(BYTE_START - 1, BYTE_LEN);

									if (undefined !== H_tel[telno] == true) //料金プランがパケコミネットの場合
										{
											if (H_tel[telno] == PAKEKOMI) //小数点以下第３を四捨五入するよう変更 2010/06/25 s.maeda
												//変更したのをなかったコトにする 2012/09/12
												//$charge = round($byte / 128 * PAKEKOMI_UNIT_PRICE * 100) / 100;
												{
													charge = +(byte / 128 * PAKEKOMI_UNIT_PRICE);
												} else //小数点以下第３を四捨五入するよう変更 2010/06/25 s.maeda
												//変更したのをなかったコトにする 2012/09/12
												//$charge = round($byte / 128 * PACKET_UNIT_PRICE * 100) / 100;
												{
													charge = +(byte / 128 * PACKET_UNIT_PRICE);
												}
										} else //小数点以下第３を四捨五入するよう変更 2010/06/25 s.maeda
										//変更したのをなかったコトにする 2012/09/12
										//$charge = round($byte / 128 * PACKET_UNIT_PRICE * 100) / 100;
										{
											charge = +(byte / 128 * PACKET_UNIT_PRICE);
										}

									if (charge == 0) {
										charge = "\\N";
									}

									chargeseg = A_fileData[fileCounter][lineCounter].substr(CHARGE_SEG_START - 1, CHARGE_SEG_LEN);
									kousiflg = getKousiflg(filePact, telno, totelRep, PACKET_KUBUN);
									A_commOutputBuff.push(filePact + "\t" + telno + "\t" + PACKET_TYPE + "\t" + date + "\t" + totelno + "\t" + toplace + "\t" + fromplace + "\t\\N\t" + charge + "\t" + byte + "\t" + chargeseg + "\t" + G_CARRIER_DDI + "\t" + kousiflg + "\n");
								}
						}
					}

// 2022cvt_015
					var outCommhistoryCnt = 0;
// 2022cvt_015
					var outTotelCnt = 0;

// 2022cvt_015
					for (var value of A_commOutputBuff) {
// 2022cvt_015
						value = Encoding.convert(value, { from: "EUCJP", to: "UTF8", type: "string" });
						// mb_convert_variables("UTF-8", "EUC-JP", value);
						fs.writeFileSync(fp_commhistory, value);// 2022cvt_006
						outCommhistoryCnt++;
					}

					// fflush(fp_commhistory);
					console.log("INFO: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") インポートファイル出力完了(" + commhistory_tb + ":" + outCommhistoryCnt + "件)\n");
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") インポートファイル出力完了(" + commhistory_tb + ":" + outCommhistoryCnt + "件)");

					if (-1 !== A_kousiPact.indexOf(A_pactid[pactCounter]) == true) //UPDATE 2008/08/22 Kenichiro Uesugi
// 2022cvt_015
						//mb_convert_variables("UTF-8", "EUC-JP", $A_totelOutputBuff);
						//kousi_totel_master_tb ファイル出力
						//UPDATE END 2008/08/22 Kenichiro Uesugi
						//バッファ出力
						{
// 2022cvt_015
							for (var value of A_totelOutputBuff) {
// 2022cvt_015
								value = Encoding.convert(value, { to: "UTF8", from: "EUCJP", type: "string" })
								// mb_convert_variables("UTF-8", "EUC-JP", value);
								fs.writeFileSync(fp_totel, value);// 2022cvt_006
								outTotelCnt++;
							}

							// fflush(fp_totel);
							console.log("INFO: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") インポートファイル出力完了(" + totel_tb + ":" + outTotelCnt + "件)\n");
							logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") インポートファイル出力完了(" + totel_tb + ":" + outTotelCnt + "件)");
						}

					A_pactDone.push(A_pactid[pactCounter]);
				}

			// closedir(dirh);
		} else {
		console.log("WARNING: 契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません\n");
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + " 契約ＩＤ：" + A_pactid[pactCounter] + " は pact_tb に登録されていません");
	}
}

fs.closeSync(fp_commhistory);
// fclose(fp_commhistory);
fs.closeSync(fp_totel);
// fclose(fp_totel);
// 2022cvt_015
var pactDoneCnt = A_pactDone.length;

if (pactDoneCnt == 0) //処理する件数が０件をログ出力
	//処理終了をログ出力
	{
		console.log("WARNING: インポート可能な通話明細データがありませんでした\n");
		logh.putError(G_SCRIPT_WARNING, "インポート可能な通話明細データがありませんでした");
		console.log("END: ＷＩＬＬＣＯＭ通話明細ファイルインポート処理終了\n");
		logh.putError(G_SCRIPT_END, "ＷＩＬＬＣＯＭ通話明細ファイルインポート処理終了");
		lock(false);
		throw process.exit(0);// 2022cvt_009
	}

if (backup == "y") //tel_details_X_tb をエクスポートする
	//トランザクション開始
	//トランザクション内でないとカーソルが使えない
	//エクスポート失敗した場合
	//コミット
	//ＷＩＬＬＣＯＭではとりあえず必要なし
	//	// kousi_fromtel_master_tb をエクスポートする
	//	$sql_str = "select * from " . $fromtel_tb;
	//	$expFile = DATA_EXP_DIR . "/" . $fromtel_tb . date("YmdHis") . ".exp";
	//	// トランザクション開始
	//	// トランザクション内でないとカーソルが使えない
	//	$dbh->begin();
	//	// エクスポート失敗した場合
	//	if(doCopyExp($sql_str, $expFile, $dbh ) != 0){
	//		print "ERROR: " . $fromtel_tb . " のデータエクスポートに失敗しました " . $rtn->userinfo . "\n";
	//		$logh->putError(G_SCRIPT_ERROR, SCRIPTNAME . $fromtel_tb . " のデータエクスポートに失敗しました " . $rtn->userinfo);
	//	}else{
	//		print "INFO: " . $fromtel_tb . " のデータエクスポート完了\n";
	//		$logh->putError(G_SCRIPT_INFO, SCRIPTNAME . $fromtel_tb . " のデータエクスポート完了");
	//	}
	//	// コミット
	//	$dbh->commit();
	//kousi_totel_master_tb をエクスポートする
	//トランザクション開始
	//トランザクション内でないとカーソルが使えない
	//エクスポート失敗した場合
	//コミット
	{
		sql_str = "select * from " + commhistory_tb;
// 2022cvt_015
		var expFile = DATA_EXP_DIR + "/" + commhistory_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
		dbh.begin();

		if (expDataByCursor(sql_str, expFile, dbh.m_db) != 1) {
			console.log("ERROR: " + commhistory_tb + " のデータエクスポートに失敗しました " + rtn.userinfo + "\n");
			logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + commhistory_tb + " のデータエクスポートに失敗しました " + rtn.userinfo);
		} else {
			console.log("INFO: " + commhistory_tb + " のデータエクスポート完了\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + commhistory_tb + " のデータエクスポート完了");
		}

		dbh.commit();
		sql_str = "select * from " + totel_tb;
		expFile = DATA_EXP_DIR + "/" + totel_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
		dbh.begin();

		if (expDataByCursor(sql_str, expFile, dbh.m_db) != 1) {
			console.log("ERROR: " + totel_tb + " のデータエクスポートに失敗しました " + rtn.userinfo + "\n");
			logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + totel_tb + " のデータエクスポートに失敗しました " + rtn.userinfo);
		} else {
			console.log("INFO: " + totel_tb + " のデータエクスポート完了\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + totel_tb + " のデータエクスポート完了");
		}

		dbh.commit();
	}

dbh.begin();

// 2022cvt_015
for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //ＷＩＬＬＣＯＭではとりあえず必要なし
//	// kousi_fromtel_masterの未登録電話を削除する
//	$sql_str = "delete from " . $fromtel_tb . " where pactid = " . $A_pactDone[$pactDoneCounter]
//			 . " and carid = " . G_CARRIER_DDI . " and kousiflg = '2'";
//	$rtn = $dbh->query($sql_str, false);
//	// delete失敗した場合
//	if(DB::isError($rtn) == true){
//		// ロールバック
//		$dbh->rollback();
//		print "ERROR: "  . $H_pactid[$A_pactid[$pactDoneCounter]] . "(pactid=" . $A_pactid[$pactDoneCounter] .
//			") " . $fromtel_tb . " の未登録電話の削除に失敗しました " . $rtn->userinfo . "\n";
//		$logh->putError(G_SCRIPT_ERROR, SCRIPTNAME . $H_pactid[$A_pactid[$pactDoneCounter]] . "(pactid=" .
//			$A_pactid[$pactDoneCounter] . ") " . $fromtel_tb . " の未登録電話の削除に失敗しました " . $rtn->userinfo);
//	}else{
//		print "INFO: "  . $H_pactid[$A_pactid[$pactDoneCounter]] . "(pactid=" . $A_pactid[$pactDoneCounter] .
//			") " . $fromtel_tb . " の未登録電話の削除完了\n";
//		$logh->putError(G_SCRIPT_INFO, SCRIPTNAME . $H_pactid[$A_pactid[$pactDoneCounter]] . "(pactid=" .
//			$A_pactid[$pactDoneCounter] . ") " . $fromtel_tb . " の未登録電話の削除完了");
//	}
//公私分計権限があり かつ
//別ファイルがまだ取り込みされていない場合　か
//別ファイルがまだ取り込みされているが追記モードではない場合
{
	if (-1 !== A_kousiPact.indexOf(A_pactDone[pactDoneCounter]) == true && (importFlg == false || importFlg == true && mode == "o")) //kousi_totel_masterの未登録電話を削除する
		//delete失敗した場合
		{
			sql_str = "delete from " + totel_tb + " where pactid = " + A_pactDone[pactDoneCounter] + " and carid = " + G_CARRIER_DDI + " and kousiflg = '2'";
			rtn = dbh.query(sql_str, false);

			if (dbh.isError()) //ロールバック
				{
					dbh.rollback();
					console.log("ERROR: " + H_pactid[A_pactid[pactDoneCounter]] + "(pactid=" + A_pactid[pactDoneCounter] + ") " + totel_tb + " の未登録電話の削除に失敗しました " + "\n");
					logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + H_pactid[A_pactid[pactDoneCounter]] + "(pactid=" + A_pactid[pactDoneCounter] + ") " + totel_tb + " の未登録電話の削除に失敗しました ");
				} else {
				console.log("INFO: " + H_pactid[A_pactid[pactDoneCounter]] + "(pactid=" + A_pactid[pactDoneCounter] + ") " + totel_tb + " の未登録電話の削除完了\n");
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + H_pactid[A_pactid[pactDoneCounter]] + "(pactid=" + A_pactid[pactDoneCounter] + ") " + totel_tb + " の未登録電話の削除完了");
			}
		}
}

if (mode == "o") //delete失敗した場合
	{
		sql_str = "delete from " + commhistory_tb + " where pactid in (" + A_pactDone.join(",") + ") and " + "carid = " + G_CARRIER_DDI;
		rtn = dbh.query(sql_str, false);

		if (dbh.isError()) //ロールバック
			{
				dbh.rollback();
				console.log("ERROR: " + commhistory_tb + " の削除に失敗しました " + "\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + commhistory_tb + " の削除に失敗しました ");
			} else {
			console.log("INFO: " + commhistory_tb + " の削除完了\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + commhistory_tb + " の削除完了");
		}
	}

if (fs.statSync(commhistoryFile).size != 0)
// if (filesize(commhistoryFile) != 0) //commhistory_X_tb へのインポートが失敗した場合
	{
// 2022cvt_016
// 2022cvt_015
		var A_commhist_col = ["pactid", "telno", "type", "date", "totelno", "toplace", "fromplace", "time", "charge", "byte", "chargeseg", "carid", "kousiflg"];

		if (await doCopyInsert(commhistory_tb, commhistoryFile, A_commhist_col, dbh) != 0) //if(doCopyIn($commhistory_tb, $commhistoryFile, $dbh) != 0){
			//ロールバック
			{
				dbh.rollback();
				console.log("ERROR: " + commhistory_tb + " へのデータインポートが失敗しました " + "\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + commhistory_tb + " へのデータインポートが失敗しました ");
			} else {
			console.log("INFO: " + commhistory_tb + " へのデータインポート完了\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + commhistory_tb + " へのデータインポート完了");
		}
	}

if (fs.statSync(totelFile).size != 0)
// if (filesize(totelFile) != 0) //totel_tb へのインポートが失敗した場合
	{
// 2022cvt_015
		var A_totel_col = ["pactid", "telno", "carid", "totelno", "kousiflg"];

		if (await doCopyInsert(totel_tb, totelFile, A_totel_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				console.log("ERROR: " + totel_tb + " へのデータインポートが失敗しました " + "\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + totel_tb + " へのデータインポートが失敗しました ");
			} else {
			console.log("INFO: " + totel_tb + " へのデータインポート完了\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + totel_tb + " へのデータインポート完了");
		}
	}

dbh.commit();

var finDir = "";

for (pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動先ディレクトリ
//移動先ディレクトリがなければ作成
//ファイルの移動
{
// 2022cvt_015
	finDir = dataDir + "/" + A_pactDone[pactDoneCounter] + FIN_DIR;

	if (fs.existsSync(finDir) == false) //移動先ディレクトリ作成失敗// 2022cvt_003
		{
			try {
				fs.mkdirSync(finDir, 700);
				console.log("INFO: 移動先ディレクトリ(" + finDir + ")作成完了\n");
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " 移動先ディレクトリ(" + finDir + ")作成完了");
			} catch (e) {
				console.log("ERROR: 移動先ディレクトリ(" + finDir + ")の作成に失敗しました\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " 移動先ディレクトリ(" + finDir + ")の作成に失敗しました");
			}
		}

// 	clearstatcache();// 2022cvt_012
	var dirh = fs.readdirSync(dataDir + "/" + A_pactDone[pactDoneCounter]);
	// dirh = openDir(dataDir + "/" + A_pactDone[pactDoneCounter]);// 2022cvt_004

	for (var mvFileName of dirh)
	// while (mvFileName = fs.readdir(dirh)) //ファイルなら移動する// 2022cvt_005
	{
		if (fs.statSync(dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName))
		// if (is_file(dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName) == true) //移動が失敗した場合
			{
				try {
					fs.renameSync(dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName, finDir + "/" + mvFileName);
					console.log("ERROR: ファイルの移動に失敗しました(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")\n");
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " ファイルの移動に失敗しました(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")");
				} catch (e) {
					console.log("ERROR: ファイルの移動に失敗しました(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")\n");
					logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " ファイルの移動に失敗しました(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")");
				}
			}

// 		clearstatcache();// 2022cvt_012
	}

	// closedir(dirh);
}

lock(false);
console.log("END: ＷＩＬＬＣＯＭ通話明細ファイルインポート処理終了\n");
logh.putError(G_SCRIPT_END, "ＷＩＬＬＣＯＭ通話明細ファイルインポート処理終了");
throw process.exit(0);// 2022cvt_009

function usage(comment: string) {
	// if (!("dbh" in global)) dbh = undefined;

	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + SCRIPTNAME + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N}\n");
	console.log("		-e モード 	(O:delete後COPY,A:追加)\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
	dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw process.exit(1);// 2022cvt_009
};

async function lock(is_lock: boolean) //ロックする
{
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var pre = "batch";
// 2022cvt_015
	var now = getTimestamp();

	if (is_lock == true) //既に起動中
		//ロック解除
		{
			dbh.begin();
			dbh.lock("clamptask_tb");
// 2022cvt_015
			var sql = "select count(*) from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
// 2022cvt_015
			var count = await dbh.getOne(sql);

			if (count != 0) {
				dbh.rollback();
				console.log("\n既に起動しています\n\n");
				dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + "多重動作");
				return false;
			}

			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + dbh.escape(pre + "_" + SCRIPTNAME) + "',1,'" + now + "');";
			dbh.query(sql);
			dbh.commit();
		} else {
		dbh.begin();
		dbh.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "';";
		dbh.query(sql);
		dbh.commit();
	}

	return true;
};

// function getDummyTel(pactid: string) {
// // 2022cvt_015
// 	var preLeng = PRE_DUMMY_TEL.length;
// // 2022cvt_015
// 	var pactLeng = pactid.length;
// // 2022cvt_015
// 	var zeroCnt = DUMMY_TEL_LENG - preLeng - pactLeng;
// // 2022cvt_015
// 	var getStr = PRE_DUMMY_TEL;

// // 2022cvt_015
// 	for (var zeroCounter = 0; zeroCounter < zeroCnt; zeroCounter++) {
// 		getStr = getStr + "0";
// 	}

// 	getStr = getStr + pactid;
// 	return getStr;
// };

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

function getAsp(pactid: string) {
	// if (!("dbh" in global)) dbh = undefined;
// 2022cvt_015
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + G_AUTH_ASP;
// 2022cvt_015
	var charge = dbh.getOne(sql_str);
	return charge;
};

// function doCopyExp(sql: string, filename: fs.PathLike, db: ScriptDB) //ログファイルハンドラ
// //エクスポートファイルを開く
// //エクスポートファイルオープン失敗
// //無限ループ
// //カーソルを開放
// {
// 	// if (!("logh" in global)) logh = undefined;
// // 2022cvt_015
// 	var fp;
// 	try {
// 		fp = fs.openSync(filename, "wt");
// 	} catch (e) {
// 		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "のファイルオープン失敗");
// 		return 1;
// 	}
// 	// var fp = fopen(filename, "wt");

// 	db.query("declare exp_cur cursor for " + sql);

// 	for (; ; ) //ＤＢから結果取得
// 	{
// // 2022cvt_015
// 		var result = pg_query(db.m_db.connection, "fetch " + NUM_FETCH + " in exp_cur");

// 		if (result == false) //ファイルクローズ
// 			//カーソルを開放
// 			{
// 				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "Fetch error, " + sql);
// 				fs.closeSync(fp);
// 				// fclose(fp);
// 				db.query("close exp_cur");
// 				return 1;
// 			}

// // 2022cvt_015
// 		var A_line = pg_fetch_array(result);

// 		if (A_line == false) //ループ終了
// 			{
// 				break;
// 			}

// // 2022cvt_015
// 		var str = "";

// 		do //データ区切り記号、初回のみ空
// 		{
// // 2022cvt_015
// 			var delim = "";

// // 2022cvt_015
// 			for (var item of A_line) //データ区切り記号
// 			//値がない場合はヌル（\N）をいれる
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
// 			logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "への書き込み失敗、" + str);
// 			fs.closeSync(fp);
// 			// fclose(fp);
// 			db.query("CLOSE exp_cur");
// 			return 1;
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
	// if (!("pactid" in global)) pactid = undefined;
	// if (!("billdate" in global)) billdate = undefined;
// 2022cvt_015
	var buffer = "";
	try {
		buffer = fs.readFileSync(filename, "utf8");
	} catch (e) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
		return 1;
	}

	var text = Encoding.convert(buffer, { from: "SJIS", to: "UNICODE", type: "string" });
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
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のデータ数が設定と異なります。データ=" + line);
				// fclose(fp);
				return 1;
			}

// 2022cvt_015
		var H_ins: { [key: string]: any } = {};
// 2022cvt_015
		var idx = 0;

// 2022cvt_015
		for (var col of columns) //\N の場合はハッシュに追加しない
		{
			if (A_line[idx] != "\\N") {
				H_ins[col] = A_line[idx];
			}

			idx++;
		}

		if (await ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート中にエラー発生、データ=" + line);
			// fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート処理に失敗.");
		// fclose(fp);
		return 1;
	}

	// fclose(fp);
	return 0;
};

// function doCopyIn(table: string, filename: string, db: ScriptDB) //ログファイルハンドラ
// //インポートファイルを開く
// //最後のあまり行を処理する
// {
// 	// if (!("logh" in global)) logh = undefined;
// // 2022cvt_015
// 	var buffer = "";
// 	try {
// 		buffer = fs.readFileSync(filename, "utf8");
// 	} catch (e) {
// 		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "のファイルオープン失敗");
// 		return 1;
// 	}
// 	var text = Encoding.convert(buffer, {
// 		from: "SJIS",
// 		to: "UNICODE",
// 		type: "string"
// 	});
// 	var lines = text.toString().split("\r\n");
// 	// var fp = fopen(filename, "rt");

// // 2022cvt_015
// 	var line_cnt = 0;
// // 2022cvt_015
// 	var H_lines = Array();

// 	for (var line of lines)
// 	// while (line = fgets(fp)) //COPY文の文字列そのものを取得して配列に溜める
// 	//array_push( $H_lines, $line );
// 	//...こっちの方が速いらしい。
// 	//一定行数読み込んだら処理を行う
// 	{
// 		H_lines.push(line);
// 		line_cnt++;

// 		if (line_cnt >= COPY_LINES) //コピー処理を行う
// 			//空にする
// 			{
// // 2022cvt_015
// 				var res_cpfile = pg_copy_from(db.m_db.connection, table, H_lines);

// 				if (res_cpfile == false) {
// 					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "のコピー中にエラー発生.");
// 					// fclose(fp);
// 					return 1;
// 				}

// 				H_lines = Array();
// 				line_cnt = 0;
// 			}
// 	}

// 	if (line_cnt > 0) //コピー処理を行う
// 		{
// 			res_cpfile = pg_copy_from(db.m_db.connection, table, H_lines);

// 			if (res_cpfile == false) {
// 				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "のコピー中にエラー発生.");
// 				// fclose(fp);
// 				return 1;
// 			}
// 		}

// 	// fclose(fp);
// 	return 0;
// };

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

function getKousiflg(pactid: string, telno: string, totelRep: string, kubun: number) //通話明細のタイプが公私分計対象 ＆＆ 通話記録判定使用する電話
{
// 	{
// // 2022cvt_016
// 		if (!("A_commtype" in global)) A_commtype = undefined;
// 		if (!("A_totelOutputBuff" in global)) A_totelOutputBuff = undefined;
// 	}
// 	{
// // 2022cvt_016
// 		if (!("H_commtype" in global)) H_commtype = undefined;
// 		if (!("H_telKousi" in global)) H_telKousi = undefined;
// 		if (!("H_totel" in global)) H_totel = undefined;
// 		if (!("H_comhist" in global)) H_comhist = undefined;
// 	}

// 2022cvt_016
	if (-1 !== A_commtype.toString().indexOf(H_commtype[kubun]) == true && -1 !== Object.keys(H_telKousi).indexOf(telno) == true) //通話明細データに掛け先がある場合
		//通話明細のタイプが公私分計対象外 か 通話記録判定使用しない電話
		{
			if (totelRep != "") //kousi_totel_master_tb に掛け先が登録されている場合
				//通話明細データに掛け先がない場合
				{
					if (undefined !== H_totel[telno] == true && -1 !== Object.keys(H_totel[telno]).indexOf(totelRep) == true) //kousi_totel_master_tb のkousiflgをセットする
						//kousi_totel_master_tb に掛け先が未登録の場合
						{
// 2022cvt_015
							var kousiflg = H_totel[telno][totelRep];
						} else //電話に紐づいている公私分計パターンの公私分計フラグをセットする
						{
							kousiflg = H_comhist[H_telKousi[telno]];
// 2022cvt_015
							var buff = pactid + "\t" + telno + "\t" + G_CARRIER_DDI + "\t" + totelRep + "\t2\n";

							if (-1 !== A_totelOutputBuff.indexOf(buff) == false) //kousi_totel_master_tb に公私分計フラグを未登録でマスター登録する
								{
									A_totelOutputBuff.push(buff);
								}
						}
				} else //電話に紐づいている公私分計パターンの公私分計フラグをセットする
				{
					kousiflg = H_comhist[H_telKousi[telno]];
				}
		} else {
		kousiflg = "\\N";
	}

	return kousiflg;
};
})();
