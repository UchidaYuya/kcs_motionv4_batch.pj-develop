//機能：ショップの電話件数カウンターを最新に保つ
//
//作成：	2006/05/19	中西	初版

import { DATA_LOG_DIR } from "../../db_define/define";
import TableNo, { ScriptDB } from "./lib/script_db";
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "./lib/script_log";

// error_reporting(E_ALL);// 2022cvt_011
export const SCRIPT_NAMEJ = "最新電話件数アップデート";
export const SCRIPTNAME = "recent_telcnt.php";


const LOG_DELIM = " ";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.putListener(log_listener_type);
log_listener.putListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var argvCnt = process.argv.length;

if (argvCnt < 3 || 6 < argvCnt) //数が正しくない
	{
		usage("", dbh);
		throw process.exit(1);
	}

var carid = "";
var debug = false;
var tm = new Date();
var year = tm.getFullYear();
var month_str = tm.getMonth()+1;

var billdate = year +""+ month_str;

for (var cnt = 1; cnt < argvCnt; cnt++) //請求年月を取得
{
	if (process.argv[cnt].match("^-y=") != null) //請求年月文字列チェック
		{
			billdate = process.argv[cnt].replace("^-y=", "");

			if (billdate.match("^[0-9]{6}$") == undefined) {
				usage("ERROR: 請求年月の指定が不正です", dbh);
			} else //年月チェック
				{

				 	var year = parseInt(billdate.substring(0, 4));  
				 	var month: any = parseInt(billdate.substring(4, 2));  

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: 請求年月の指定が不正です(" + billdate + ")", dbh);
					}
				}

			var diffmon = (new Date().getFullYear() - year) * 12 + (new Date().getMonth()+1 - month);

			if (diffmon < 0) {
				usage("ERROR: 請求年月に未来の年月を指定することはできません(" + billdate + ")", dbh);
			} else if (diffmon >= 24) {
				usage("ERROR: 請求年月に２年以上前の年月を指定することはできません(" + billdate + ")", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-p=") != null) //契約ＩＤチェック
		{
			var pactid_in: any =  process.argv[cnt].replace("^-p=", "").toLowerCase();

			if (pactid_in.match("^all$") == false && pactid_in.match("^[0-9]+$") == false) {
				usage("ERROR: 契約ＩＤの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-type=") != null) //顧客タイプチェック
		{
			var type_in: any = process.argv[cnt].replace("^-type=", "").toUpperCase();
			console.log(type_in + "\n");

			if (type_in.match("^[MH]") == null) {
				usage("ERROR: 顧客タイプの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-c=") != null) //キャリアIDチェック
		{
			carid = process.argv[cnt].replace("^-c=", "").toLowerCase();

			if (carid.match("^[0-9]+$") == undefined) {
				usage("ERROR: キャリアIDの指定が不正です", dbh);
			}

			continue;
		}

	if (process.argv[cnt].match("^-d") != null) {
		debug = true;
		continue;
	}

	usage("", dbh);
}

logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "処理開始.");
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "pact=" + pactid_in + ", carid=" + carid + ", type=" + type_in);
var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var telX_tb = "tel_" + tableNo + "_tb";
var sql = "select pactid,compname from pact_tb ";
sql += " where type='" + type_in + "' ";

if (!pactid_in.match("/all/i")) {
	sql += "and pactid=" + pactid_in + " ";
}

sql += "order by pactid";

dbh.getHash(sql, true).then((H_result) => {
	var pactCnt = H_result.length;
	for (cnt = 0; cnt < pactCnt; cnt++) //電話台数を更新
	{
	var pactid = H_result[cnt].pactid;
	var pactname = H_result[cnt].compname;

	if (debug == true) {
	console.log("Do: " + pactid + " " + pactname + "\n");
	}

	dbh.begin();
	UpRecentTel(dbh, telX_tb, pactid, carid);
	dbh.commit();
	}
});



logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "処理完了.");
throw process.exit(0);

async function UpRecentTel(O_db: ScriptDB, tel_X_tb: string, pactid: string, carid: string) //いったんカウントを削除する
{
	if (!("debug" in global)) debug = false;
	var sql = "select tel.cirid, count(tel.telno) from " + tel_X_tb + " tel " + " inner join circuit_tb cir on cir.cirid=tel.cirid";

	if (carid != "") //キャリア指定
		{
			sql += " and cir.carid=" + carid;
		}

	sql += " where tel.pactid=" + pactid + " and tel.telno not in " + "(select telno from dummy_tel_tb dmy where dmy.pactid=" + pactid + " and tel.carid=dmy.carid ";

	if (carid != "") //キャリア指定
		{
			sql += " and dmy.carid=" + carid;
		}

	sql += ")" + " group by tel.cirid";
	var H_recent = await O_db.getHash(sql);
	var del_sql = "delete from recent_telcnt_tb where pactid=" + pactid;

	if (carid != "") //キャリア指定
		{
			del_sql += " and cirid in (select cirid from circuit_tb where carid=" + carid + ")";
		}

	if (debug == false) {
		O_db.query(del_sql);
	}

	for (var recent_row of H_recent) {
		var circuit = recent_row.cirid;
		var telcnt = recent_row.count;

		if (telcnt != 0) {
			var ins_sql = "insert into recent_telcnt_tb(pactid,cirid,telcnt) " + "values(" + pactid + "," + circuit + "," + telcnt + ")";

			if (debug == false) {
				O_db.query(ins_sql);
			} else {
				console.log(ins_sql + "\n");
			}
		}
	}
};

function usage(comment: string, db: ScriptDB) {
	if (comment == "") {
		comment = "パラメータが不正です";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + process.argv[0] + " -y=YYYYMM -p={all|PACTID} -type={M|H} [-c=carid] [-d]\n");
	console.log("		-y 請求年月 	(YYYY:年,MM:月)\n");
	console.log("		-p 契約ＩＤ 	(all:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行)\n");
	console.log("		-type 顧客タイプ	(M:既存Motion型,H:Hotline型)\n");
	console.log("		-c キャリア指定	(省略時には全キャリア)\n");
	console.log("		-d デバッグモード	(付けた場合、実際の処理を行わない)\n");
	throw process.exit(1);
};
