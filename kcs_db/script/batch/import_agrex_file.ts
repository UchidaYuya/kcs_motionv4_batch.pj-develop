import {ScriptDB} from "../batch/lib/script_db";
import {ScriptLogBase, ScriptLogFile, ScriptLogAdaptor,G_SCRIPT_INFO, G_SCRIPT_WARNING,G_SCRIPT_ERROR, G_SCRIPT_BEGIN, G_SCRIPT_END} from "../batch/lib/script_log";
import { DATA_DIR, DATA_LOG_DIR } from "../../db_define/define";
import * as Encoding from "encoding-japanese";
import * as fs from "fs";

export const BASE_DIR = DATA_DIR;
export const AGREX_DIR = "/agrex/import";
export const FIN_DIR = "/fin";
export const COMMON_LOG_DIR = DATA_LOG_DIR;
export const LOG_DELIM = " ";
export const SCRIPTNAME = "import_agrex_file.php";
export const PACTID = 76;
export const KEIYAKUCODE = "250001";
export const ITAKUCODE = "230477";

(async ()=>{

// 2022cvt_015
var dbLogFile = COMMON_LOG_DIR + "/billbat.log";
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
// 2022cvt_015
var dataDir = BASE_DIR + AGREX_DIR;

try {
	if (fs.existsSync(dataDir) == false){
		console.log("\n決済結果ファイルがあるディレクトリ" + dataDir + "がみつかりません\n");
	}
} catch (e) {
    logh.putError(G_SCRIPT_ERROR, "決済結果ファイルがあるディレクトリ" + dataDir + "がみつかりません");
	throw process.exit(1);
}
// if (fs.existsSync(dataDir) == false) {// 2022cvt_003
// 	console.log("\n決済結果ファイルがあるディレクトリ" + dataDir + "がみつかりません\n");
// 	logh.putError(G_SCRIPT_ERROR, "決済結果ファイルがあるディレクトリ" + dataDir + "がみつかりません");
// 	throw process.exit(1);// 2022cvt_009
// }

// 2022cvt_015
// var dirh = openDir(dataDir);// 2022cvt_004
var dirh = fs.readdirSync(dataDir);// 2022cvt_004
// 2022cvt_015
var A_inFile = Array();

// while (fileName = fs.readdir(dirh)) {// 2022cvt_005
for (__filename in dirh) {// 2022cvt_005
// 2022cvt_028
    // if (is_file(dataDir + "/" + fileName) == true) {
	if (fs.statSync(dataDir + "/" + __filename).isFile() == true) {
		A_inFile.push(__filename);
	}

// 	clearstatcache();// 2022cvt_012
}

// closedir(dirh);
console.log("アグレックス決済結果取込開始\n");
logh.putError(G_SCRIPT_BEGIN, "アグレックス決済結果取込開始");
// 2022cvt_015
var H_kouResult = {
	"0": "振替済",
	"1": "資金不足",
	"2": "預金取引なし",
	"3": "預金者都合による振替停止",
	"4": "預金口座振替依頼なし",
	"8": "委託者都合による振替停止",
	"9": "その他"
};
// 2022cvt_016
// 2022cvt_015
var H_harDatatype = {
	"01": "速報",
	"02": "確報",
	"03": "取消"
};
lock(true);
// 2022cvt_017
// 2022cvt_015
let d = new Date();
// var curYear = date("Y");
var curYear = d.getFullYear()+1;
// 2022cvt_015
// var curMonth = date("n");
var curMonth = new Date().getMonth()+1;
// 2022cvt_015
// var curDate = date("d");
var curDate = d.getDay()+1;

// 2022cvt_015
for (var inFile of (A_inFile)) //ファイル読み込み
//１行ずつ処理する
//１カラム目が契約先コードでない場合は口座振替結果でも、払い込み結果でもないため無効なファイルとして扱う
//過去月テーブルで決済結果がnullでないものを配列へ格納
//決済結果を追記するかどうかの判定
//行数を取得
//トランザクション開始
//口座振替の場合
//処理が正常に終わったファイルを移動
//移動先ディレクトリがなければ作成
//ファイルを移動
{
// 2022cvt_015
	// var A_tmpFile = file(dataDir + "/" + inFile);
	var buffer = fs.readFileSync(dataDir + "/" + inFile);
	var text = Encoding.convert(buffer, {
	   from: 'SJIS',
	   to: 'UNICODE', 
	   type: 'string',
	});
	var A_tmpFile = text.toString().split("\r\n");


// 2022cvt_015
	var lineCnt = 0;
// 2022cvt_015
	var A_File = Array();

// 2022cvt_015
	for (var lineData of (A_tmpFile)) //ここで文字コードを変換する
	//カラム毎に配列へ格納
	//先頭カラムの「"」を除去
	//最終カラムの「"」を除去
	{
// 2022cvt_015
		// var lineData = mb_convert_encoding(lineData, "UTF-8", "EUC-JP");
		A_File[lineCnt] = lineData.split("\",\"");
		// A_File[lineCnt][0] = ereg_replace("^\"", "", A_File[lineCnt][0]);
		A_File[lineCnt][0] = A_File[lineCnt][0].replaceall("^\"", "");
		A_File[lineCnt][0] = A_File[lineCnt][0].replaceall("^\"", "");
		// A_File[lineCnt][A_File[lineCnt].length - 1] = ereg_replace("\"\n", "", A_File[lineCnt][A_File[lineCnt].length - 1]);
		A_File[lineCnt][A_File[lineCnt].length - 1] = A_File[lineCnt][A_File[lineCnt].length - 1].replaceall("\"\n", "");
		A_File[lineCnt][A_File[lineCnt].length - 1] = A_File[lineCnt][A_File[lineCnt].length - 1].replaceall("\"\r\n", "");
		lineCnt++;
	}

	if (A_File[0][0] != KEIYAKUCODE.trim()) {
		console.log(inFile + "ファイルは決済結果ファイルでない為、処理をスキップします\n");
		logh.putError(G_SCRIPT_BEGIN, inFile + "ファイルは決済結果ファイルでない為、処理をスキップします");
		continue;
	}

	if (A_File[0][2] == ITAKUCODE.trim()) {
// 2022cvt_016
// 2022cvt_015
		var type = "koufuri";
	} else {
// 2022cvt_016
		type = "haraikomi";
	}

// 2022cvt_015
	for (var cnt = 1; cnt < 25; cnt++) //テーブル番号取得
	//ＳＱＬ作成
	//決済結果が未記入
	//ＳＱＬ実行
	{
		var H_notNullptext14: any;
		var tableNo: any;
		if (cnt < 10) {
// 2022cvt_015
			tableNo = "0" + cnt;
		} else {
			tableNo = cnt;
		}

// 2022cvt_015
		var sql = "select ptext3 from post_" + tableNo + "_tb " + "where ptext1 not in ('0','3') and " + "ptext3 is not null and " + "ptext3 != '' and " + "ptext14 is not null";
		H_notNullptext14[tableNo] = dbh.getCol(sql);
	}

// 2022cvt_015
	var recCnt = A_File.length;
	dbh.begin();

// 2022cvt_016
	if (type == "koufuri") //１行ずつ処理する
		//払込の場合
		{
			for (lineCnt = 0; lineCnt < recCnt; lineCnt++) //受注コードの上４桁から利用年月を取得
			//テーブルＮＯ取得
			//２４ヶ月前のデータがあった場合
			//口座振替結果が「振替済」の場合、決済ステータスを「完了」にする
			//更新用ＳＱＬ作成
			//更新エラーでもプログラム終了させない
			//post_X_tbへの更新が失敗した場合
			{
// 2022cvt_015
				var targetYear = "20" + A_File[lineCnt][1].substring(0, 2);
// 2022cvt_015
				var targetMonth = A_File[lineCnt][1].substring(2, 2);
// 2022cvt_015
				var kokyakucode = A_File[lineCnt][1].substring(4);
				tableNo = getTableNo(curYear, curMonth, targetYear, targetMonth);

				if (tableNo == "") //post_X_tbへの更新をロールバックする
					{
						dbh.rollback();
						console.log(inFile + "ファイルに２４ヶ月以上前のデータが存在している為、処理をスキップします\n");
						logh.putError(G_SCRIPT_BEGIN, inFile + "ファイルに２４ヶ月以上前のデータが存在している為、処理をスキップします");
						continue;
					}

				if (-1 !== H_notNullptext14[tableNo].indexOf(kokyakucode) == true) //決済結果を新規で登録する場合
					{
// 2022cvt_015
						var ptext14_sql = "ptext14 = ptext14 || '->" + curYear + "-" + curMonth + "-" + curDate + " " + H_kouResult[A_File[lineCnt][23]] + "'";
					} else //顧客コードを追加
					{
						ptext14_sql = "ptext14 = '" + curYear + "-" + curMonth + "-" + curDate + " " + H_kouResult[A_File[lineCnt][23]] + "'";
						H_notNullptext14[tableNo].push(kokyakucode);
					}

				if (A_File[lineCnt][23] == "0") //口座振替結果が「振替済」以外の場合、決済ステータスを「請求残」にする
					{
// 2022cvt_015
						var ptext15 = "'2'";
					} else {
					ptext15 = "'1'";
				}

				sql = "update post_" + tableNo + "_tb " + "set " + ptext14_sql + "," + "ptext15 = " + ptext15 + " " + "where pactid = " + PACTID + " and ptext3 = '" + kokyakucode + "'";
// 2022cvt_015
                var rtn: number | any[];
				rtn = await dbh.query(sql);

				// if (DB.isError(rtn) == true) //post_X_tbへの更新をロールバックする
				if (dbh.isError() == true) //post_X_tbへの更新をロールバックする
					//エラーログをはく
					//post_X_tbへの更新が成功した場合
					{
						dbh.rollback();
						// console.log("post_" + tableNo + "_tb更新失敗(口座振替):" + rtn.userinfo + inFile + "ファイルの" + (lineCnt + 1) + "行目 受注コード：" + A_File[lineCnt][1] + " 処理をスキップします\n");
						console.log("post_" + tableNo + "_tb更新失敗(口座振替):" + rtn + inFile + "ファイルの" + (lineCnt + 1) + "行目 受注コード：" + A_File[lineCnt][1] + " 処理をスキップします\n");

						// logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb更新失敗(口座振替):" + rtn.userinfo + inFile + "ファイルの" + (lineCnt + 1) + "行目 受注コード：" + A_File[lineCnt][1]);
						logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb更新失敗(口座振替):" + rtn + inFile + "ファイルの" + (lineCnt + 1) + "行目 受注コード：" + A_File[lineCnt][1]);

						continue;
					} else //更新された件数が０件ならばエラー扱い
					{
						//if (dbh.affectedRows(rtn) == 0) //post_X_tbへの更新をロールバックする
						if (rtn == 0) //post_X_tbへの更新をロールバックする
							//エラーログをはく
							//更新された件数が２件以上ならばエラー扱い
							{
								dbh.rollback();
								console.log("post_" + tableNo + "_tbに" + inFile + "ファイルの" + (lineCnt + 1) + "行目の顧客コード：" + kokyakucode + "が見つかりませんでした(口座振替) 処理をスキップします\n");
								logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb\に" + inFile + "ファイルの" + (lineCnt + 1) + "行目の顧客コード：" + kokyakucode + "が見つかりませんでした(口座振替)");
								continue;
							// } else if (dbh.affectedRows() > 1) //post_X_tbへの更新をロールバックする
						    } else if (rtn > 1) //post_X_tbへの更新をロールバックする
							//エラーログをはく
							{
								dbh.rollback();
								console.log("post_" + tableNo + "_tbに" + inFile + "ファイルの" + (lineCnt + 1) + "行目の顧客コード：" + kokyakucode + "が重複しています(口座振替) 処理をスキップします\n");
								logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb\に" + inFile + "ファイルの" + (lineCnt + 1) + "行目の顧客コード：" + kokyakucode + "が重複しています(口座振替))");
								continue;
							}
					}
			}
// 2022cvt_016
		} else if (type == "haraikomi") //１行ずつ処理する
		{
			for (lineCnt = 0; lineCnt < recCnt; lineCnt++) //受注コードの上４桁から利用年月を取得
			//テーブルＮＯ取得
			//２４ヶ月前のデータがあった場合
			//データ種別が「確報」または空の場合、過不足額が０円なら決済ステータスを「完了」にする
			//更新用ＳＱＬ作成
			//更新エラーでもプログラム終了させない
			//post_X_tbへの更新が失敗した場合
			{
				targetYear = "20" + A_File[lineCnt][1].substring(0, 2);
				targetMonth = A_File[lineCnt][1].substring(2, 2);
				kokyakucode = A_File[lineCnt][1].substring(4);
				tableNo = getTableNo(curYear, curMonth, targetYear, targetMonth);

				if (tableNo == "") {
					dbh.rollback();
					console.log(inFile + "ファイルに２４ヶ月以上前のデータが存在している為、処理をスキップします\n");
					logh.putError(G_SCRIPT_BEGIN, inFile + "ファイルに２４ヶ月以上前のデータが存在している為、処理をスキップします");
					continue;
				}

				if (-1 !== H_notNullptext14[tableNo].indexOf(kokyakucode) == true) //決済結果を新規で登録する場合
					{
// 2022cvt_016
						ptext14_sql = "ptext14 = ptext14 || '->" + curYear + "-" + curMonth + "-" + curDate + " " + H_harDatatype[A_File[lineCnt][2]] + "'";
					} else //顧客コードを追加
					{
// 2022cvt_016
						ptext14_sql = "ptext14 = '" + curYear + "-" + curMonth + "-" + curDate + " " + H_harDatatype[A_File[lineCnt][2]] + "'";
						H_notNullptext14[tableNo].push(kokyakucode);
					}

				if ((A_File[lineCnt][2] == "02" || A_File[lineCnt][2] == "") && A_File[lineCnt][23] == "0") //データ種別が「速報」、「取消」の場合とデータ種別が「確報」または空で過不足金が発生している場合は決済ステータスを「請求残」にする
					{
						ptext15 = "'2'";
					} else {
					ptext15 = "'1'";
				}

				sql = "update post_" + tableNo + "_tb " + "set ptext13 = '" + A_File[lineCnt][20] + "'," + ptext14_sql + "," + "ptext15 = " + ptext15 + "," + "pint3 = " + A_File[lineCnt][23] + " " + "where pactid = " + PACTID + " and ptext3 = '" + kokyakucode + "'";
				rtn = await dbh.query(sql);

				// if (DB.isError(rtn) == true) //post_X_tbへの更新をロールバックする
				if (dbh.isError() == true) //post_X_tbへの更新をロールバックする
					//エラーログをはく
					//post_X_tbへの更新が成功した場合
					{
						dbh.rollback();
						// console.log("post_" + tableNo + "_tb更新失敗(払込):" + rtn.userinfo + inFile + "ファイルの" + (lineCnt + 1) + "行目 受注コード：" + A_File[lineCnt][1] + " 処理をスキップします\n");
						console.log("post_" + tableNo + "_tb更新失敗(払込):" + rtn + inFile + "ファイルの" + (lineCnt + 1) + "行目 受注コード：" + A_File[lineCnt][1] + " 処理をスキップします\n");
						// logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb更新失敗(払込):" + rtn.userinfo + inFile + "ファイルの" + (lineCnt + 1) + "行目 受注コード：" + A_File[lineCnt][1]);
						logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tb更新失敗(払込):" + rtn + inFile + "ファイルの" + (lineCnt + 1) + "行目 受注コード：" + A_File[lineCnt][1]);
						continue;
					} else //更新された件数が０件ならばエラー扱い
					{
						// if (dbh.affectedRows() == 0) //post_X_tbへの更新をロールバックする
						if (rtn == 0) //post_X_tbへの更新をロールバックする
							//エラーログをはく
							//更新された件数が２件以上ならばエラー扱い
							{
								dbh.rollback();
								console.log("post_" + tableNo + "_tbに" + inFile + "ファイルの" + (lineCnt + 1) + "行目の顧客コード：" + kokyakucode + "が見つかりませんでした(払込) 処理をスキップします\n");
								logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tbに" + inFile + "ファイルの" + (lineCnt + 1) + "行目の顧客コード：" + kokyakucode + "が見つかりませんでした(払込)");
								continue;
							// } else if (dbh.affectedRows() > 1) //post_X_tbへの更新をロールバックする
						    } else if (rtn > 1) //post_X_tbへの更新をロールバックする
							//エラーログをはく
							{
								dbh.rollback();
								console.log("post_" + tableNo + "_tbに" + inFile + "ファイルの" + (lineCnt + 1) + "行目の顧客コード：" + kokyakucode + "が重複しています(払込) 処理をスキップします\n");
								logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "post_" + tableNo + "_tbに" + inFile + "ファイルの" + (lineCnt + 1) + "行目の顧客コード：" + kokyakucode + "が重複しています(払込)");
								continue;
							}
					}
			}
		}

	dbh.commit();
// 2022cvt_015
	var finDir = dataDir + FIN_DIR;

	if (fs.existsSync(finDir) == false) //移動先ディレクトリ作成失敗// 2022cvt_003
		{
			try {
				fs.mkdirSync(finDir, 700) == null
					console.log("ERROR: 移動先ディレクトリ(" + finDir + ")の作成に失敗しました\n");
			 	    logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " 移動先ディレクトリ(" + finDir + ")の作成に失敗しました");
			} catch (e) {
				console.log("INFO: 移動先ディレクトリ(" + finDir + ")作成完了\n");
			    logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " 移動先ディレクトリ(" + finDir + ")作成完了");
			}
			// if (mkdir(finDir, 700) == false) {
			// if (fs.mkdirSync(finDir, 700) == null) {
			// 	console.log("ERROR: 移動先ディレクトリ(" + finDir + ")の作成に失敗しました\n");
			// 	logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " 移動先ディレクトリ(" + finDir + ")の作成に失敗しました");
			// } else {
			// 	console.log("INFO: 移動先ディレクトリ(" + finDir + ")作成完了\n");
			// 	logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " 移動先ディレクトリ(" + finDir + ")作成完了");
			// }
		}

// 	clearstatcache();// 2022cvt_012

// 2022cvt_028
	// if (is_file(dataDir + "/" + inFile) == true) //移動が失敗した場合
	if ( fs.statSync(dataDir + "/" + inFile).isFile() == true) //移動が失敗した場合
		{
			try {
				fs.renameSync(dataDir + "/" + inFile, finDir + "/" + inFile) == null
					console.log("ERROR: ファイルの移動に失敗しました(" + dataDir + "/" + inFile + ")\n");
					logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + "ファイルの移動に失敗しました(" + dataDir + "/" + inFile + ")");
			} catch (e) {
				console.log("INFO: ファイル移動完了(" + dataDir + "/" + inFile + ")\n");
			 	logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " ファイル移動完了(" + dataDir + "/" + inFile + ")");
			}
			// // if (rename(dataDir + "/" + inFile, finDir + "/" + inFile) == false) {
			// if (fs.renameSync(dataDir + "/" + inFile, finDir + "/" + inFile) == null) {
			// 	console.log("ERROR: ファイルの移動に失敗しました(" + dataDir + "/" + inFile + ")\n");
			// 	logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + "ファイルの移動に失敗しました(" + dataDir + "/" + inFile + ")");
			// } else {
			// 	console.log("INFO: ファイル移動完了(" + dataDir + "/" + inFile + ")\n");
			// 	logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " ファイル移動完了(" + dataDir + "/" + inFile + ")");
			// }
		}

// 	clearstatcache();// 2022cvt_012
}

lock(false);
console.log("アグレックス決済結果取込終了\n");
logh.putError(G_SCRIPT_END, "アグレックス決済結果取込終了");
throw process.exit(0);// 2022cvt_009

function usage(comment: string) {
	if (!("dbh" in global)) dbh;

	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + SCRIPTNAME + " 決済結果ＣＳＶファイル名\n\n");
	dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw process.exit(1);// 2022cvt_009
};

async function lock(is_lock: boolean) //ロックする
{
	if (!("dbh" in global)) dbh;
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
			var count = dbh.getOne(sql);

			if (await count != 0) {
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
    var dd = (tm.getDay() + 0).toString();
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
    return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;};

function getTableNo(currentYear: number, currentMonth: number, targetYear:any, targetMonth:any) //１年以内は利用月をそのまま返す（０補完）
{
// 2022cvt_015
	var calc = 12 * (currentYear - targetYear) + currentMonth - targetMonth;

	if (calc < 12) //２年以上前は空文字を返す
		{
// 2022cvt_015
			var tableNo = targetMonth;
		} else if (calc > 23) {
		tableNo = "";
	} else {
		tableNo = targetMonth + 12;
	}

	return tableNo;
};

})();