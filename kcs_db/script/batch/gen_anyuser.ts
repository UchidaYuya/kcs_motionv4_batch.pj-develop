//機能：基本料の生成処理（エニーユーザー専用）
//
//作成：中西	2007/01/24	初版作成

import { DATA_DIR, DATA_EXP_DIR, DATA_LOG_DIR } from "../../db_define/define";
import { G_EXCISE_RATE } from "./lib/script_common";
import TableNo, { ScriptDB, TableInserter } from "./lib/script_db";
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "./lib/script_log";

const Encoding = require("encoding-japanese");
const SCRIPT_NAMEJ = "エニーユーザー基本料生成";
const SCRIPTNAME = "gen_anyuser.php";

const ANYFU_DIR = "/anyfu/bill";
const LOG_DELIM = " ";
const ANY_CARRIER_ID = 13;
const ANY_CIRCUIT_ID = 29;
const CODE_NOZOMI = 100;
const CODE_GAISEN = 200;
const CODE_DOMES = 300;
const CODE_INTER = 400;
const CODE_TAX = 1000;
const TAX_KAZEI = "課税";
const TAX_HIKAZEI = "非課税";
const TAX_TAISYOGAI = "対象外";
const TAX_KA_HIKAZEI = "課税／非課税";
const fs = require("fs");
const readline = require("readline");

var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.putListener(log_listener_type);
log_listener.putListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var logh: any = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");
var H_utiwake: any
var H_pactid: any
if (process.argv.length != 4) //数が正しくない
	{
		usage("", dbh);
		throw process.exit(1);
	}

var argvCnt = process.argv.length;

for (var cnt = 1; cnt < argvCnt; cnt++) //請求年月を取得
{
	if (process.argv[cnt].match("^-y=") !== null) //請求年月文字列チェック
		{
			const billdate = process.argv[cnt].replace("^-y=", "");

			if (billdate.match("^[0-9]{6}$") == null) {
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
				{
					let year = Number(billdate.substr(0, 4));
					let month = Number(billdate.substr(4, 2));

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
					}
					var diffmon = (new Date().getFullYear() - year) * 12 + ((new Date().getMonth() + 1) - month);
		
					if (diffmon < 0) {
						usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
					} else if (diffmon >= 24) {
						usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
					}
				}


			continue;
		}

	if (process.argv[cnt].match("^-p=") !== null) //契約ＩＤチェック
		{
			let pactid_in = process.argv[cnt].replace("^-p=", "").toLowerCase();

			if (pactid_in.match("^all$") == null && pactid_in.match("^[0-9]+$") == null) {
				usage("ERROR: 契約ＩＤの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-b=") !== null) //バックアップの有無のチェック
		{
			let backup = process.argv[cnt].replace("^-b=", "").toLowerCase();

			if (backup.match("^[ny]$") == null) {
				usage("ERROR: バックアップの指定が不正です", dbh);
			}

			continue;
		}

	usage("", dbh);
}

const billdate = "";
var dataDir = DATA_DIR + "/" + billdate + ANYFU_DIR;

// if (fs.existsSync(dataDir) == false) {// 2022cvt_003
// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "請求データファイルディレクトリ（" + dataDir + "）がみつかりません.");
// }

var A_pactid = Array();
var A_pactDone = Array();

// if (pactid_in == "all") //処理する契約ＩＤを取得する
// 	{
// 		var fileName;
// 		var dirh = fs.readdirSync(dataDir);// 2022cvt_004

// 		while (fileName = fs.readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する// 2022cvt_005
// 		{
// 			if (fs.existsSync(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {// 2022cvt_003
// 				A_pactid.push(fileName);
// 			}

// 		}

// 		// closedir(dirh);
// 	} else {
// 	A_pactid.push(pactid_in);
// }

// if (A_pactid.length == 0) {
// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Pact用データディレクトリが１つもありません.");
// 	throw process.exit(1);
// }

// if (lock(true, dbh) == false) {
// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "２重起動です、前回エラー終了の可能性があります.");
// 	throw process.exit(1);
// }
(async () => {
var sql = "select ut.code, ut.name, ut.taxtype, kr.kamokuid from utiwake_tb ut ";
sql += "inner join kamoku_rel_utiwake_tb kr on ut.code=kr.code where ut.carid=" + ANY_CARRIER_ID;

var H_result = await dbh.getHash(sql, true);

for (cnt = 0; cnt < H_result.length; cnt++) 
{
	var code = H_result[cnt].code;
	H_utiwake[code] = H_result[cnt];
}

var O_tableNo = new TableNo();
// var tableNo = O_tableNo.get(year, month);
var tableNo = "";
var telX_tb = "tel_" + tableNo + "_tb";
var postX_tb = "post_" + tableNo + "_tb";
var postrelX_tb = "post_relation_" + tableNo + "_tb";
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
// var file_teldetails = dataDir + "/" + teldetailX_tb + "_gen" + billdate + pactid_in + ".ins";
var file_teldetails = "";
var fp_teldetails = fs.readFileSync(file_teldetails, "w");

// if (fp_teldetails == undefined) {
// 	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "の書き込みオープン失敗.");
// 	throw process.exit(1);// 2022cvt_009
// }

sql = "select pactid,compname from pact_tb order by pactid";
H_result = await dbh.getHash(sql, true);
var pactCnt = H_result.length;

for (cnt = 0; cnt < pactCnt; cnt++) //pactid => 会社名
{
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

pactCnt = A_pactid.length;
A_pactid.sort();

for (cnt = 0; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
{
	// if (undefined !== H_pactid[A_pactid[cnt]] == false) {
	// 	logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093.");
	// 	continue;
	// }

	var pactid = A_pactid[cnt];
	var pactname = H_pactid[pactid];
	var dataDirPact = dataDir + "/" + pactid;

	if (fs.existsSync(dataDirPact) == false) //次のPactの処理にスキップする.// 2022cvt_003
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + "" + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "データディレクトリ" + dataDirPact + "が存在しません.");
			continue;
		}

	var A_calcData = Array();
	let A_delData = Array();
	var errFlag = false;
	var colums1 = "tel.telno, tel.postid, tel.text1, tel.int1, tel.int2, tel.int3, to_char(tel.date1,'yyyy-mm-dd') as date1, post.ptext1, post.pint1, post.pint2";
	var colums2 = "tel.telno, tel.postid, tel.text1, tel.int1, tel.int2, tel.int3, tel.date1, post.ptext1, post.pint1, post.pint2";
	var A_telnoX = Array();
	sql = "select " + colums1 + " from " + telX_tb + " tel " + " inner join " + postX_tb + " post on tel.pactid=post.pactid and tel.postid=post.postid " + " where tel.pactid=" + A_pactid[cnt] + " and tel.carid=" + ANY_CARRIER_ID + " and (tel.text8 != '1' or tel.text8 is null)" + " and tel.telno not in (select telno from dummy_tel_tb where carid=" + ANY_CARRIER_ID + ")";

	for (var data of Object.values(dbh.getHash(sql, true))) {
		A_telnoX.push(data);
	}

	sql = "select " + colums1 + " from " + telX_tb + " tel " + " inner join " + postX_tb + " post on tel.pactid=post.pactid and tel.postid=post.postid " + " inner join " + teldetailX_tb + " td on tel.telno=td.telno and tel.carid=td.carid" + " where tel.pactid=" + A_pactid[cnt] + " and tel.carid=" + ANY_CARRIER_ID + " and tel.text8 = '1'" + " and tel.telno not in (select telno from dummy_tel_tb where carid=" + ANY_CARRIER_ID + ")" + " group by " + colums2;

	for (var data of Object.values(dbh.getHash(sql, true))) //停止中の電話は警告を出す
	{
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + "" + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "電話番号(" + data.telno + ")は停止中ですが、請求が上がっています.");
		A_telnoX.push(data);
	}

	for (var A_data of Object.values(A_telnoX)) //消費税を生成するかどうか
	{
		var telno = A_data.telno;
		var nozomi_done = false;
		var gaisen_done = false;
		var zei_done = false;
		var H_domes = Array();
		var H_inter = Array();
		var taxsum = 0;
		sql = "select code, charge, taxkubun, realcnt from " + teldetailX_tb + " where pactid=" + pactid + " and carid=" + ANY_CARRIER_ID + " and telno='" + telno + "'";
		var H_detail = dbh.getHash(sql, true);

		for (var A_detail of Object.values(H_detail)) //各コードごとの処理
		{
			switch (A_detail.code) {
				case CODE_NOZOMI:
					nozomi_done = true;
					break;

				case CODE_GAISEN:
					gaisen_done = true;
					break;

				case CODE_DOMES:
					H_domes.push(A_detail);
					break;

				case CODE_INTER:
					H_inter.push(A_detail);
					break;

				case CODE_TAX:
					zei_done = true;
					break;

				default:
					break;
			}

			if (A_detail.charge == 0) {
				A_delData.push([pactid, telno, A_detail.code]);
			} else //消費税合計に加算
				{
					if (A_detail.taxkubun == TAX_KAZEI && A_detail.code != CODE_TAX) //課税分の合計
						{
							taxsum += +A_detail.charge;
						}
				}
		}

		if (nozomi_done == false || gaisen_done == false) //のぞみと外線、両方上がっていたら自動生成しない
			{
				if (A_data.ptext1 == "0") //代理店であれば ＝ 個人の場合：（代理店直下の場合）
					{
						var nozomi_charge = A_data.int2;
						var gaisen_charge = A_data.int3;
					} else if (A_data.ptext1 == "1" || A_data.ptext1 == "2") //そうでなければ ＝ 法人の場合：（個人で複数回線所有の場合も含む）
					{
						nozomi_charge = A_data.pint1;
						gaisen_charge = A_data.pint2;
					} else if (A_data.ptext1 == "3") //部署であれば、上にさかのぼって代理店/法人の別を取得する
					{
						var kubun, nozomi_tmp, gaisen_tmp, postid_tmp;
						[kubun, nozomi_tmp, gaisen_tmp, postid_tmp] = getParentKubun(pactid, A_data.postid, dbh);

						if (kubun == "0") //"電話"管理の「のぞみサーバ利用料金」
							{
								nozomi_charge = A_data.int2;
								gaisen_charge = A_data.int3;
							} else if (kubun == "1" || kubun == "2")
							{
								nozomi_charge = nozomi_tmp;
								gaisen_charge = gaisen_tmp;
							} else {
							logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + "" + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "親部署の登録区分が不明です(" + kubun + "), telno=" + telno + ", postid=" + postid_tmp);
							throw process.exit(1);// 2022cvt_009
						}
					} else //不明の区分
					{
						logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + "" + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "登録区分が不明です(" + A_data.ptext1 + "), telno=" + telno + ", postid=" + A_data.postid);
						throw process.exit(1);// 2022cvt_009
					}

				if (nozomi_done == false) //電話管理の「端末台数」
					{
						var realcnt = A_data.int1;

						if (realcnt && realcnt != 0) //(請求金額) = (のぞみサーバ利用料金)ｘ(端末台数)
							{
								nozomi_charge = nozomi_charge * realcnt;
								nozomi_charge = DailyRate(A_data.date1, billdate, nozomi_charge);

								if (nozomi_charge != 0) //順序はコード番号/100という規則
									{
										var detailNo = +(CODE_NOZOMI / 100);
										var A_meisai = [telno, CODE_NOZOMI, nozomi_charge, TAX_KAZEI, detailNo, realcnt];
										A_calcData.push(A_meisai);
										taxsum += nozomi_charge;
									}
							}
					}

				if (gaisen_done == false) //電話管理の「端末台数」
					{
						realcnt = A_data.int1;

						if (!realcnt || realcnt == 0) {
							realcnt = 1;
						}

						gaisen_charge = DailyRate(A_data.date1, billdate, gaisen_charge);

						if (gaisen_charge != 0) //順序はコード番号/100という規則
							{
								detailNo = +(CODE_GAISEN / 100);
								A_meisai = [telno, CODE_GAISEN, gaisen_charge, TAX_KAZEI, detailNo, realcnt];
								A_calcData.push(A_meisai);
								taxsum += gaisen_charge;
							}
					}
			}

		if (H_domes.length >= 2) //課税/非課税２レコード（以上）だったら１レコードにまとめる
			{
				var sum_charge = 0;

				for (var A_detail of Object.values(H_domes)) //既存のレコードを集計
				{
					sum_charge += +A_detail.charge;
				}

				detailNo = +(CODE_DOMES / 100);
				A_meisai = [telno, CODE_DOMES, sum_charge, TAX_KA_HIKAZEI, detailNo, "\\N"];
				A_calcData.push(A_meisai);
				A_delData.push([pactid, telno, CODE_DOMES]);
			}

		if (H_inter.length >= 2) //課税/非課税２レコード（以上）だったら１レコードにまとめる
			{
				sum_charge = 0;

				for (var A_detail of Object.values(H_inter)) //既存のレコードを集計
				{
					sum_charge += +A_detail.charge;
				}

				detailNo = +(CODE_INTER / 100);
				A_meisai = [telno, CODE_INTER, sum_charge, TAX_KA_HIKAZEI, detailNo, "\\N"];
				A_calcData.push(A_meisai);
				A_delData.push([pactid, telno, CODE_INTER]);
			}

		if (taxsum != 0 && zei_done == false) //切り捨て(課税対象額 * 0.05)
			{
				var tax = Math.floor(taxsum * G_EXCISE_RATE);

				if (tax != 0) //消費税金額が0円の場合は生成しない -- 2007/04/12
					{
						detailNo = +(CODE_TAX / 100);
						A_meisai = [telno, CODE_TAX, tax, "", detailNo, "\\N"];
						A_calcData.push(A_meisai);
					}
			}
	}

	if (errFlag == false) //ファイルに書き出す
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "データ書出処理開始.");

			if (writeInsFile(pactid, A_calcData) == 1) //次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + "" + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "ファイルの書き出しに失敗.");
					continue;
				}

			// fflush(fp_teldetails);
			A_pactDone.push(pactid);
		}
}

fs.closeSync(fp_teldetails);
H_pactid = undefined;
A_telnoX = [];
A_calcData = [];
let A_delData = Array();
if (A_pactDone.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + "" + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "読み込みに成功したPactが１つも無かった.");
	throw process.exit(1);
}
dbh.begin();

// if (backup == "y") {
// 	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理開始.");
// 	doBackup(dbh);
// 	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "バックアップ処理完了.");
// }

// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理開始.");
// doDelete(A_pactDone, A_delData, dbh);
// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "デリート処理完了.");
// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理開始.");
// doImport(file_teldetails, dbh);
// logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "インポート処理完了.");
// dbh.commit();
// lock(false, dbh);
// logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
// throw process.exit(0);

function getParentKubun(pactid, postid, db) //取得に失敗
{
	if (!("postX_tb" in global)) postX_tb = "";
	if (!("postrelX_tb" in global)) postrelX_tb = "";
	var level = 0;
	var kubun = "";

	do {
		var sql = "select post.postid, post.ptext1, post.pint1, post.pint2, rel.postidparent, rel.level from " + postX_tb + " post " + " inner join " + postrelX_tb + " rel on post.pactid=rel.pactid and post.postid=rel.postidchild " + " where post.pactid=" + pactid + " and post.postid=" + postid;
		var H_postrel = db.getHash(sql, true);

		for (var A_postrel of H_postrel) {
			kubun = A_postrel.ptext1;

			if (kubun == "0" || kubun == "1" || kubun == "2") {
				return [kubun, A_postrel.pint1, A_postrel.pint2, postid];
			} else if (kubun == "3") //１つ上に上がる
				{
					postid = A_postrel.postidparent;
					level = A_postrel.level;
				} else //不明な区分、そのまま返す
				{
					return [kubun, A_postrel.pint1, A_postrel.pint2, postid];
				}
		}
	} while (level > 0);

	return [kubun, 0, 0, postid];
};
})();

function DailyRate(theDate, billdate, charge)
{
	// if (!theDate || theDate == "") 
	// 	{
	// 		return charge;
	// 	}

	// [year, month, day] = theDate.split("-");
	// var billyear = billdate.substr(0, 4);
	// var billmon = billdate.substr(4, 2);
	// --billmon;

	// if (+(billmon < 1)) {
	// 	billmon = 12;
	// 	--billyear;
	// }

	// if (billyear < year) 
	// 	{
	// 		return 0;
	// 	} else if (billyear == year && billmon < month) 
	// 	{
	// 		return 0;
	// 	}

	// if (billyear != year || billmon != month) 
	// 	{
	// 		return charge;
	// 	}

	// var tailday = TailDate(year, month);
	// return Math.floor(charge * (tailday - day + 1) / tailday);
};

function TailDate(yyyy: number, mm: number) 
{
	// ++mm;

	// if (mm > 12) {
	// 	++yyyy;
	// 	mm -= 12;
	// }

	// var tsuitachi = mktime(0, 0, 0, mm, 1, yyyy);
	// var tailday = tsuitachi - 24 * 60 * 60;
	// [h, mi, s, d, mo, y] = localtime(tailday);
	const d = new Date(yyyy,mm,1,0,0,0).getDay();
	return d;
};

function writeInsFile(pactid, A_calcData) //データが空のときは終了.
{
	// if (!("H_utiwake" in global)) H_utiwake = undefined;
	// if (!("fp_teldetails" in global)) fp_teldetails = undefined;
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactname" in global)) pactname = undefined;
	// if (!("billdate" in global)) billdate = "";

	if (A_calcData.length == 0) {
		return 0;
	}

	var nowtime = getTimestamp();

	for (var data of A_calcData) //data : telno, code, charge, taxkubun, detailNo
	{
		var telno = data[0];
		var ut_code = data[1];
		var charge = data[2];
		var ut_name = H_utiwake[ut_code].name;
		ut_name = ut_name.replace("\　 ","");
		var taxkubun = data[3];
		var detailNo = data[4];
		var realcnt = data[5];
		// fs.writeFileSync(fp_teldetails, pactid + "\t" + telno + "\t" + ut_code + "\t" + ut_name + "\t" + charge + "\t" + taxkubun + "\t" + detailNo + "\t" + nowtime + "\t" + ANY_CARRIER_ID + "\t" + realcnt + "\n");// 2022cvt_006
	}

	return 0;
};

function doBackup(db) //tel_details_X_tb をエクスポートする
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = "";
	// if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".exp";
	// var sql = "select * from " + teldetailX_tb;
	// var rtn = db.backup(outfile, sql);

	// if (rtn == false) //ロールバック
	// 	{
	// 		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデータエクスポートに失敗しました.");
	// 		db.rollback();
	// 		throw process.exit(1);
	// 	}

	return 0;
};

async function doDelete(A_pactDone: any[], A_delData: any[], db: ScriptDB) //// 消費税を消去 -- 繰り返し処理したときにも問題無いように
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = "";
	if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	// var sql_str = "delete from " + teldetailX_tb + " where pactid in (" + A_pactDone.join(",") + ")" + " and code='" + CODE_TAX + "'" + " and carid=" + ANY_CARRIER_ID;
	// var rtn: any = await db.query(sql_str, false);

	// if ("object" === typeof rtn == true) //ロールバック
	// 	{
	// 		// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデリートに失敗しました、" + rtn.userinfo);
	// 		db.rollback();
	// 		throw process.exit(1);// 2022cvt_009
	// 	}

	for (var A_data of A_delData) //print "DEBUG: " . $sql_str . "\n";
	{
		var pact = A_data[0];
		var telno = A_data[1];
		var code = A_data[2];
		// ssql_str = "delete from " + teldetailX_tb + " where pactid=" + pact + " and telno='" + telno + "'" + " and code='" + code + "'" + " and carid=" + ANY_CARRIER_ID;
		// rtn = await db.query(sql_str, false);

		// if ("object" === typeof rtn == true) //ロールバック
		// 	{
		// 		// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のデリートに失敗しました、" + rtn.userinfo);
		// 		db.rollback();
		// 		throw process.exit(1);
		// 	}
	}

	return 0;
};

async function doImport(file_teldetails, db) //teldetailX_tbへのインポート
{
	// if (!("teldetailX_tb" in global)) teldetailX_tb = "";
	if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	if (fs.statSync(file_teldetails).size > 0) {
		// var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "realcnt"];

		// if (await doCopyInsert(teldetailX_tb, file_teldetails, teldetailX_col, db) != 0) //ロールバック
		// 	{
		// 		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + "" + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "のインポートに失敗しました.");
		// 		db.rollback();
		// 		throw process.exit(1);
		// 	} else {
		// 	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + "" + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " のインポート完了");
		// }
	} else //ファイルサイズが０？
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + "" + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "のファイルサイズが０です.");
			return 1;
		}

	return 0;
};

async function doCopyInsert(table, filename, columns, db) //ファイルを開く
{
	if (!("logh" in global)) logh = undefined;
	// if (!("pactid_in" in global)) pactid_in = undefined;
	// if (!("billdate" in global)) billdate = undefined;
	var fp = fs.openSync(filename, "rt");

	if (!fp) {
		// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のファイルオープン失敗.");
		return 1;
	}

	var ins = new TableInserter(logh, db, filename + ".sql", true);
	ins.begin(table);


	var buffer = fs.readFileSync(fp);
	const text = Encoding.convert(buffer, {
	from: 'SJIS',
	to: 'UNICODE', 
	type: 'string',
	});
	const lines  = text.toString().split('\r\n');

	// for(line of lines) //データはtab区切り
	// {
	// 	// var A_line = line.replace("\n","").split("\t");
	// 	var A_line = "";

	// 	if (A_line.length != columns.length) //要素数が異なっていたら
	// 		{
	// 			// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のデータ数が設定と異なります。(" + A_line.length + "!=" + columns.length + "), データ=" + line);
	// 			// fs.closeSync(fp);
	// 			return 1;
	// 		}

	// 	var H_ins: any = Array();
	// 	var idx = 0;

	// 	for (var col of columns) {
	// 		if (A_line[idx] != "\\N") //\N の場合はハッシュに追加しない
	// 			{
	// 				H_ins[col] = A_line[idx];
	// 			}

	// 		idx++;
	// 	}

	// 	if (await ins.insert(H_ins) == false) {
	// 		// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート中にエラー発生、データ=" + line);
	// 		fs.closeSync(fp);
	// 		return 1;
	// 	}
	// }

	// if (ins.end() == false) {
	// 	// logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "のインサート処理に失敗.");
	// 	fs.closeSync(fp);
	// 	return 1;
	// }

	// fs.closeSync(fp);
	return 0;
};

function finalData(pactid, pactDir, finDir) //同名のファイルが無いか
{
	if (!("logh" in global)) logh = undefined;
	// if (!("billdate" in global)) billdate = undefined;

	if (fs.statSync(finDir).isFile() == true) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + finDir + "はディレクトリではありません.");
		return 1;
	}

	if (fs.existsSync(finDir) == false) //なければ作成する// 2022cvt_003
		{
			if (fs.mkdirSync(finDir) == false) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "異動先の" + finDir + "が作成できなかった.");
				return 1;
			}
		}

	var retval = 0;
	var dirh = fs.openSync(pactDir);
	var fname = fs.readdir(dirh)
	while (fname) {
		var fpath = pactDir + "/" + fname;

		if (fs.statSync(fpath).isFile()) //ファイル名が適合するものだけ
			{
				// if (fname.match(ANY_PAT)) //ファイル移動
					{
						if (fs.renameSync(fpath, finDir + "/" + fname) == false) {
							logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "の異動失敗.");
							retval = 1;
						}
					}
			}

	}

	// closedir(dirh);
	return retval;
};

function usage(comment, db) //ロック解除
{
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -y=YYYYMM -p={all|PACTID} -b={Y|N}\n");
	console.log("\t\t-y 請求年月 \t(YYYY:年,MM:月)\n");
	console.log("\t\t-p 契約ＩＤ \t(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("\t\t-b バックパップ (Y:バックアップする,N:バックアップしない)\n");
	lock(false, db);
	throw process.exit(1);
};

function lock(is_lock, db) //ロックする
{
	if (db == undefined) {
		return false;
	}

	var pre = "batch";

	if (is_lock == true) //既に起動中
	{
		db.begin();
		db.lock("clamptask_tb");
		var sql = "select count(*) from clamptask_tb " + "where command like '" + db.escape(pre + "%") + "' and " + "status = 1;";
		var count = db.getOne(sql);

		if (count != 0) {
			db.rollback();
			return false;
		}

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

function getTimestamp() {
	var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') 
	return `${date}+09`;
};
