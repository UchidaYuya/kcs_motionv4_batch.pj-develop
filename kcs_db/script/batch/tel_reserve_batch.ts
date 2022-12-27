//機能：電話管理　予約処理バッチ
//作成：2006/09/26　石崎

// require("Mail.php");
// require(BAT_DIR + "/lib/script_db.php");

import { chdir } from "process";
import { G_MAIL_TYPE } from "../../conf/batch_setting";
import { BAT_DIR, G_LOG, G_SMTP_HOST, G_SMTP_PORT } from "../../db_define/define";
import {} from "../../script/batch/lib/script_common";
import { ScriptDB } from "./lib/script_db";
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "./lib/script_log";

const Iconv  = require('iconv').Iconv;
const DEBUG = 1;
const TELRES_TB = "tel_reserve_tb";
const TEL_TB = "tel_tb";
const TELMNG_TB = "telmnglog_tb";
const SUMI = 1;
const NASI = 2;
chdir(BAT_DIR);
let dbLogFile = G_LOG + "/tel_reserve_batch" + (new Date().getFullYear() + '' + (new Date().getMonth() + 1)) + ".log";
let log_listener = new ScriptLogBase(0);
let log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.putListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
let logh = new ScriptLogAdaptor(log_listener, true);
let H_reserve = Array();
let H_get_tel = Array();
let result: any = "";
let setcomment = "";
let settype = "";
let this_tel = "";
let reserve_tel = "";
let db_access_type = "";
let insert_c = 0;
let insert_update_c = 0;
let update_c = 0;
let update_0_c = 0;
let insert_no_post = 0;
if (!("G_error_log_text" in global)) 
var G_error_log_text:string;
G_error_log_text = "";
logh.putError(G_SCRIPT_BEGIN, "start://tel_reserve_batch/");
console.log("====================プログラムを開始します=============================" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))  + "\n\n");
let today_str = new Date().toJSON().slice(0,10).replace(/-/g,'-');;
let sqlstr = "SELECT * from tel_reserve_tb where reserve_date <= '" + today_str + "' AND exe_state = 0 AND add_edit_flg in (0,1) order by reserve_date, add_edit_flg";
logh.putError(G_SCRIPT_INFO, "run://tel_reserve_tb検索/");
console.log("*               tel_reserve_tbを検索しました               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
dbh.getHash(sqlstr).then((res) => {
	H_reserve = res;
});
let reserve_count = H_reserve.length;

if (reserve_count == 0) //実行日に予約が一件も無かった場合の処理
	{
		logh.putError(G_SCRIPT_INFO, "run://tel_reserve_tb検索/該当レコード無し/");
		console.log("*               tel_reserve_tbに本日以前の未実行の予約はありませんでした               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
	} else //予約が一件以上あった場合の処理
	{
		logh.putError(G_SCRIPT_INFO, "run://tel_reserve_tb検索/該当レコード：" + reserve_count + "件/");
		console.log("*               tel_reserve_tbに本日以前の未実行の予約は" + reserve_count + "件ありました              *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
		let get_tel_sql = "SELECT pactid, telno, carid from tel_tb";
		logh.putError(G_SCRIPT_INFO, "run://tel_tb検索/");
		console.log("*               tel_tbを検索：電話情報を取得します               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
		dbh.getHash(get_tel_sql).then((res) => {
			H_get_tel = res;
		});
		let A_pact_tel_car = Array();
		let tel_tb_count = H_get_tel.length;

		for (var array_make_count = 0; array_make_count < tel_tb_count; array_make_count++) {
			A_pact_tel_car[array_make_count] = H_get_tel[array_make_count].pactid + "-" + H_get_tel[array_make_count].telno + "-" + H_get_tel[array_make_count].carid;
		}

		let get_post_sql = "select pactid || '-' || postid as pactpost from post_tb";
		logh.putError(G_SCRIPT_INFO, "run://post_tb検索/");
		console.log("*               post_tbを検索：部署情報を取得します               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
		dbh.getHash(get_post_sql).then(async (H_get_post) => {
			let post_tb_count = H_get_post.length;
			var A_all_post = Array();
	
			for (let post_cnt = 0; post_cnt < post_tb_count; post_cnt++) {
				A_all_post[post_cnt] = H_get_post[post_cnt].pactpost;
			}

			for (let Hcount = 0; Hcount < reserve_count; Hcount++) //予約件数の全件処理
			{
				{
					let _tmp_0 = H_reserve[Hcount];

					for (var key in _tmp_0) {
						var val = _tmp_0[key];
						H_reserve[Hcount][key] = dbh.escape(val);
					}
				}
				dbh.begin();
				logh.putError(G_SCRIPT_INFO, "run://予約処理：" + (Hcount + 1) + "件目/");
				console.log("*               予約処理：" + (Hcount + 1) + "件目              *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n\n");
				var now_time = "'" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "'";
				H_reserve[Hcount].telno = formatValueToSQL(H_reserve[Hcount].telno);
				H_reserve[Hcount].telno_view = formatValueToSQL(H_reserve[Hcount].telno_view);
				H_reserve[Hcount].userid = formatValueToSQL(H_reserve[Hcount].userid, "num");
				H_reserve[Hcount].machine = formatValueToSQL(H_reserve[Hcount].machine);
				H_reserve[Hcount].color = formatValueToSQL(H_reserve[Hcount].color);
				H_reserve[Hcount].planid = formatValueToSQL(H_reserve[Hcount].planid, "num");
				H_reserve[Hcount].packetid = formatValueToSQL(H_reserve[Hcount].packetid, "num");
				H_reserve[Hcount].pointstage = formatValueToSQL(H_reserve[Hcount].pointstage, "num");
				H_reserve[Hcount].employeecode = formatValueToSQL(H_reserve[Hcount].employeecode);
				H_reserve[Hcount].username = formatValueToSQL(H_reserve[Hcount].username);
				H_reserve[Hcount].mail = formatValueToSQL(H_reserve[Hcount].mail);
				H_reserve[Hcount].orderdate = formatValueToSQL(H_reserve[Hcount].orderdate);

				for (var cnt = 1; cnt <= 15; cnt++) {
					H_reserve[Hcount]["text" + cnt] = formatValueToSQL(H_reserve[Hcount]["text" + cnt]);
				}

				for (cnt = 1; cnt <= 3; cnt++) {
					H_reserve[Hcount]["int" + cnt] = formatValueToSQL(H_reserve[Hcount]["int" + cnt], "num");
				}

				for (cnt = 1; cnt <= 2; cnt++) {
					H_reserve[Hcount]["date" + cnt] = formatValueToSQL(H_reserve[Hcount]["date" + cnt]);
				}

				H_reserve[Hcount].memo = formatValueToSQL(H_reserve[Hcount].memo);
				H_reserve[Hcount].recdate = formatValueToSQL(H_reserve[Hcount].recdate);
				H_reserve[Hcount].fixdate = now_time;
				H_reserve[Hcount].options = formatValueToSQL(H_reserve[Hcount].options);
				H_reserve[Hcount].contractdate = formatValueToSQL(H_reserve[Hcount].contractdate);
				H_reserve[Hcount].kousiflg = formatValueToSQL(H_reserve[Hcount].kousiflg);
				H_reserve[Hcount].kousiptn = formatValueToSQL(H_reserve[Hcount].kousiptn);
				H_reserve[Hcount].username_kana = formatValueToSQL(H_reserve[Hcount].username_kana);
				H_reserve[Hcount].reserve_date = formatValueToSQL(H_reserve[Hcount].reserve_date);
				H_reserve[Hcount].joker_flag = formatValueToSQL(H_reserve[Hcount].joker_flag, "num");

				if (H_reserve[Hcount].add_edit_flg == 0) //予約フラグ変更用
					{
						setcomment = "新規予約登録（実行）";
						reserve_tel = H_reserve[Hcount].pactid + "-" + H_reserve[Hcount].telno.replace("'", "") + "-" + H_reserve[Hcount].carid;
						var reserve_pactpost = H_reserve[Hcount].pactid + "-" + H_reserve[Hcount].postid;

						if (-1 !== A_all_post.indexOf(reserve_pactpost) == true) //第三引数にTrue を追加
							{
								if (-1 !== A_pact_tel_car.indexOf(reserve_tel) == true) //手動で登録されている// 第三引数にTrue を追加
									{
										setcomment = "新規予約登録（変更に切り替え実行）";
										logh.putError(G_SCRIPT_INFO, "run://新規登録かつtel_tbに登録済みであることを確認。アクセスタイプをUPDATEに設定/");
										console.log("*               tel_tbに既に予約データが登録されています：登録タイプをUPDATEに設定します               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
										result = telTbUpdateFunction(dbh, logh, H_reserve[Hcount], setcomment, insert_update_c, update_0_c, now_time);

										if (result[0] == true) {
											insert_update_c = result[1];
											update_0_c = result[2];
											logh.putError(G_SCRIPT_INFO, "run://tel_tbへのUPDATE文をcommit/");
											console.log("*               tel_tbへのUPDATE文をcommit               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
											dbh.commit();
										} else {
											G_error_log_text += result[3];
											logh.putError(G_SCRIPT_WARNING, "warning://tel_tbへのUPDATEを失敗rollbackします/");
											console.log("*               tel_tbへのUPDATEを失敗rollbackします               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
											G_error_log_text += "warning://tel_tbへのUPDATEを失敗rollbackします/\n";
											dbh.rollback();
										}
									} else //管理記録の type カラムに記入
									//tel_tb に INSERT 送信
									//INSERT 結果が１以外のとき（エラー処理）
									{
										settype = "追加";
										sqlstr = "INSERT INTO " + TEL_TB + "(pactid,postid,telno,telno_view,userid,carid,arid,cirid,machine,color,planid,packetid,pointstage,employeecode,username,mail,orderdate,text1,text2,text3,text4,text5,text6,text7,text8,text9,text10,text11,text12,text13,text14,text15,int1,int2,int3,date1,date2,memo,recdate,fixdate,options,contractdate,kousiflg,kousiptn,username_kana) ";
										sqlstr += "values(" + H_reserve[Hcount].pactid + "," + H_reserve[Hcount].postid + "," + H_reserve[Hcount].telno + "," + H_reserve[Hcount].telno_view + "," + H_reserve[Hcount].userid + "," + H_reserve[Hcount].carid + "," + H_reserve[Hcount].arid + "," + H_reserve[Hcount].cirid + "," + H_reserve[Hcount].machine + "," + H_reserve[Hcount].color + "," + H_reserve[Hcount].planid + "," + H_reserve[Hcount].packetid + "," + H_reserve[Hcount].pointstage + "," + H_reserve[Hcount].employeecode + "," + H_reserve[Hcount].username + "," + H_reserve[Hcount].mail + "," + H_reserve[Hcount].orderdate + "," + H_reserve[Hcount].text1 + "," + H_reserve[Hcount].text2 + "," + H_reserve[Hcount].text3 + "," + H_reserve[Hcount].text4 + "," + H_reserve[Hcount].text5 + "," + H_reserve[Hcount].text6 + "," + H_reserve[Hcount].text7 + "," + H_reserve[Hcount].text8 + "," + H_reserve[Hcount].text9 + "," + H_reserve[Hcount].text10 + "," + H_reserve[Hcount].text11 + "," + H_reserve[Hcount].text12 + "," + H_reserve[Hcount].text13 + "," + H_reserve[Hcount].text14 + "," + H_reserve[Hcount].text15 + "," + H_reserve[Hcount].int1 + "," + H_reserve[Hcount].int2 + "," + H_reserve[Hcount].int3 + "," + H_reserve[Hcount].date1 + "," + H_reserve[Hcount].date2 + "," + H_reserve[Hcount].memo + "," + H_reserve[Hcount].recdate + "," + H_reserve[Hcount].fixdate + "," + H_reserve[Hcount].options + "," + H_reserve[Hcount].contractdate + "," + H_reserve[Hcount].kousiflg + "," + H_reserve[Hcount].kousiptn + "," + H_reserve[Hcount].username_kana;
										sqlstr += ")";
										logh.putError(G_SCRIPT_INFO, "run://tel_tbにINSERT/SQL:" + sqlstr + "/");
										console.log("*               tel_tbにINSERTします。SQL文：" + sqlstr + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
										result = dbh.query(sqlstr, false);

										if (result) {
											logh.putError(G_SCRIPT_WARNING, "warning://INSERTに失敗しました/" + reserve_tel + "/" + result.message + ": " + result.userinfo + "/");
											console.log("*               INSERTに失敗しました:" + reserve_tel + "/" + result.message + ": " + result.userinfo + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
											G_error_log_text += "warning://INSERTに失敗しました/" + reserve_tel + "/" + result.message + ": " + result.userinfo + "/\n";
											dbh.rollback();
										} else //予約テーブルに実行日とステータスの変更 管理記録 telmnglog_tb に書き込み
											//共に正常動作であれば commit
											{
												// if (changeReserveState(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].postid, H_reserve[Hcount].telno, SUMI, now_time, H_reserve[Hcount].reserve_date, H_reserve[Hcount].recdate) == true && await setTelmnglog(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].exe_postid, H_reserve[Hcount].exe_userid, H_reserve[Hcount].exe_name, H_reserve[Hcount].telno, setcomment, H_reserve[Hcount].postid, settype, now_time, H_reserve[Hcount].pactid, H_reserve[Hcount].postid, H_reserve[Hcount].carid, H_reserve[Hcount].joker_flag) == true) //新規予約件数
												if (await changeReserveState(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].postid, H_reserve[Hcount].telno, SUMI, now_time, H_reserve[Hcount].reserve_date, H_reserve[Hcount].recdate) == true && await setTelmnglog(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].exe_postid, H_reserve[Hcount].exe_userid, H_reserve[Hcount].exe_name, H_reserve[Hcount].telno, setcomment, H_reserve[Hcount].postid, settype, now_time, H_reserve[Hcount].pactid, H_reserve[Hcount].carid, H_reserve[Hcount].joker_flag) == true) //新規予約件数
													{
														logh.putError(G_SCRIPT_INFO, "run://tel_reserve_tb telmnglog_tb 共に処理完了/");
														console.log("*               tel_reserve_tb telmnglog_tb 共に処理完了               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
														logh.putError(G_SCRIPT_INFO, "run://tel_tbへのINSERTをcommit/");
														console.log("*               tel_tbへのINSERTをcommit               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
														dbh.commit();
														insert_c++;
													} else {
													logh.putError(G_SCRIPT_WARNING, "warning://tel_reserve_tb telmnglog_tb の処理で問題発生/");
													console.log("*               tel_reserve_tb telmnglog_tb  の処理で問題発生               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
													G_error_log_text += "warning://tel_reserve_tb telmnglog_tb の処理で問題発生/\n";
													logh.putError(G_SCRIPT_WARNING, "warning://tel_tbへのINSERTに失敗rollbackします/");
													console.log("*               tel_tbへのINSERTに失敗rollbackします               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
													G_error_log_text += "warning://INSERTに失敗rollbackします/\n";
													dbh.rollback();
												}
											}
									}
							} else //管理予約の type カラムに記入
							//管理予約の comment カラムに記入
							//予約テーブルに実行日とステータスの変更 管理記録 telmnglog_tb に書き込み
							//共に正常動作であれば commit
							{
								logh.putError(G_SCRIPT_INFO, "info://予約電話の対象部署が存在しません/" + reserve_pactpost);
								console.log("*               予約電話の対象部署が存在しません/" + reserve_pactpost + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
								settype = "対象なし";
								setcomment = "新規予約登録（対象部署なし）";

								// if (changeReserveState(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].postid, H_reserve[Hcount].telno, NASI, now_time, H_reserve[Hcount].reserve_date, H_reserve[Hcount].recdate) == true && await setTelmnglog(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].exe_postid, H_reserve[Hcount].exe_userid, H_reserve[Hcount].exe_name, H_reserve[Hcount].telno, setcomment, H_reserve[Hcount].postid, settype, now_time, H_reserve[Hcount].pactid, H_reserve[Hcount].postid, H_reserve[Hcount].carid, H_reserve[Hcount].joker_flag) == true) //新規予約件数
								if (await changeReserveState(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].postid, H_reserve[Hcount].telno, NASI, now_time, H_reserve[Hcount].reserve_date, H_reserve[Hcount].recdate) == true && await setTelmnglog(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].exe_postid, H_reserve[Hcount].exe_userid, H_reserve[Hcount].exe_name, H_reserve[Hcount].telno, setcomment, H_reserve[Hcount].postid, settype, now_time, H_reserve[Hcount].pactid, H_reserve[Hcount].carid, H_reserve[Hcount].joker_flag) == true) //新規予約件数
									{
										logh.putError(G_SCRIPT_INFO, "run://tel_reserve_tb telmnglog_tb 共に処理完了/");
										console.log("*               tel_reserve_tb telmnglog_tb 共に処理完了               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
										logh.putError(G_SCRIPT_INFO, "run://tel_tbへのINSERT文をcommit/");
										console.log("*               tel_tbへのINSERT文をcommit               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
										dbh.commit();
										insert_no_post++;
									} else {
									logh.putError(G_SCRIPT_WARNING, "warning://tel_reserve_tb telmnglog_tb の処理で問題発生/");
									console.log("*               tel_reserve_tb telmnglog_tb  の処理で問題発生               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
									G_error_log_text += "warning://tel_reserve_tb telmnglog_tb の処理で問題発生/\n";
									logh.putError(G_SCRIPT_WARNING, "warning://tel_tbへのINSERTに失敗rollbackします/");
									console.log("*               tel_tbへのINSERTに失敗rollbackします               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
									G_error_log_text += "warning://INSERTに失敗rollbackします/\n";
									dbh.rollback();
								}
							}
					} else if (H_reserve[Hcount].add_edit_flg == 1) //予約フラグ変更用
					//tel_tb へのアップデート処理
					//UPDATE処理：成功
					{
						setcomment = "変更予約登録（実行）";
						result = telTbUpdateFunction(dbh, logh, H_reserve[Hcount], setcomment, update_c, update_0_c, now_time);

						if (result[0] == true) {
							update_c = result[1];
							update_0_c = result[2];
							logh.putError(G_SCRIPT_INFO, "run://tel_tbへのUPDATE文をcommit/");
							console.log("*               tel_tbへのUPDATE文をcommit               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
							dbh.commit();
						} else //error_log_text に telTbUpdateFunction からのエラー文を追加
							{
								G_error_log_text += result[3];
								logh.putError(G_SCRIPT_WARNING, "warning://tel_tbへのUPDATEにcommit失敗rollbackします/");
								console.log("*               tel_tbへのUPDATEに失敗rollbackします               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
								G_error_log_text += "warning://tel_tbへのUPDATEに失敗rollbackします/" + reserve_tel + "/" + result.message + ": " + result.userinfo + "/\n";
								dbh.rollback();
							}
					} else {
					logh.putError(G_SCRIPT_WARNING, "warning://add_edit_flgから予期せぬ値が返りました/予約タイプ:" + H_reserve[Hcount].add_edit_flg + "/");
					console.log("*               add_edit_flgから予期せぬ値が返りました/予約タイプ:" + H_reserve[Hcount].add_edit_flg + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
					G_error_log_text += "warning://add_edit_flgから予期せぬ値が返りました/予約タイプ:" + H_reserve[Hcount].add_edit_flg + "/\n";
				}
			}
		});
	}

if (G_error_log_text != "") {
	// var O_mail = Mail.factory("smtp", {
	// 	host: G_SMTP_HOST,
	// 	port: G_SMTP_PORT
	// });
	var to = "batch_error@kcs-next-dev.com";
	if (DEBUG == 1) to = "houshiyama@motion.ne.jp";
	var from = "info@motion.ne.jp";
	var subject = G_MAIL_TYPE + "電話管理予約処理バッチエラー";
	const iconv = new Iconv('UTF-8','JIS');
	const after = iconv.convert(G_error_log_text);
	var H_headers = {
		Date: new Date(),
		To: to,
		From: from
	};
	H_headers["Return-Path"] = from;
	H_headers["MIME-Version"] = "1.0";
	// H_headers.Subject = mb_encode_mimeheader(subject, "JIS");
	H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
	H_headers["Content-Transfer-Encoding"] = "7bit";
	H_headers["X-Mailer"] = "Motion Mailer v2";
	// var rval = O_mail.send([to], H_headers, message);
}

logh.putError(G_SCRIPT_INFO, "info://新規予約：" + insert_c + "/新規予約・登録済み：" + insert_update_c + "/変更予約：" + update_c + "/変更予約・移動済み：" + update_0_c + "/新規予約部署なし：" + insert_no_post + "/");
logh.putError(G_SCRIPT_END, "end://tel_reserve_batch/");
throw process.exit(0);// 2022cvt_009

function formatValueToSQL(value: string, type = "") {
	if (value == "") {
		return "NULL";
	}

	if (type == "") {
		value = "'" + value + "'";
		return value;
	}

	return value;
};

async function changeReserveState(dbhx: ScriptDB, loghx: ScriptLogAdaptor, pactx: string, postx: string, telnox: string, exe_statex: string | number, now_timex: string, reserve_datex: string, recdatex: string) //予約登録の処理ステータスを確認
//tel_reserve_tb のステータス、実行日を書き換え
//ステータスのアップデートの際、エラー発生した場合
{
	if (!("G_error_log_text" in global)) G_error_log_text;

	if (exe_statex != 1 && exe_statex != 2) {
		loghx.putError(G_SCRIPT_WARNING, "warning://予約登録の処理ステータスに予期せぬ値が渡されました/exe_state" + exe_statex + "/");
		console.log("*               予約登録の処理ステータスに予期せぬ値が渡されました。exe_state：" + exe_statex + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
		G_error_log_text += "warning://予約登録の処理ステータスに予期せぬ値が渡されました/exe_state" + exe_statex + "/\n";
		return false;
	}

	var sql = "UPDATE tel_reserve_tb SET exe_state = " + exe_statex + ", fixdate =" + now_timex + ", exe_date =" + now_timex + " WHERE " + "pactid = " + pactx + " AND " + "postid = " + postx + " AND " + "telno = " + telnox + " AND " + "reserve_date = " + reserve_datex + " AND " + "recdate = " + recdatex + " AND " + "exe_state = 0";
	loghx.putError(G_SCRIPT_INFO, "run://tel_reserve_tbにUPDATE/SQL:" + sql + "/");
	console.log("*               tel_reserve_tb にUPDATEします。SQL文:" + sql + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
	var	resultx: any = await dbhx.query(sql, false);

	if (!resultx) {
		// loghx.putError(G_SCRIPT_WARNING, "warning://tel_reserve_tbの書き換えに失敗しました/" + resultx.message + ":" + resultx.userinfo + "/SQL：" + sql + "/");
		// console.log("*               tel_reserve_tbの書き換えに失敗しました。：" + resultx.message + ":" + resultx.userinfo + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
		// G_error_log_text += "warning://tel_reserve_tbの書き換えに失敗しました/" + resultx.message + ":" + resultx.userinfo + "/SQL：" + sql + "/\n";
		return false;
	} else //処理件数
		//ステータスのアップデートの際、1件以外の件数が帰ってきた場合
		{
			var resultx_num = dbhx.affectedRows(resultx);

			if (resultx_num != 1) {
				loghx.putError(G_SCRIPT_WARNING, "warning://tel_reserve_tbの書き換え対象に複数のレコードが存在しました/" + resultx_num + "/SQL：" + sql + "/");
				console.log("*               tel_reserve_tbの書き換え対象に複数のレコードが存在しました。返り値：" + resultx_num + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
				G_error_log_text += "warning://tel_reserve_tbの書き換え対象に複数のレコードが存在しました/" + resultx_num + "/SQL：" + sql + "/";
				return false;
			}
		}

	return true;
};

// async function setTelmnglog(dbhx: ScriptDB, loghx: ScriptLogAdaptor, pactx: string, postx: string, useridx: string, namex: string, telnox: string, commentx: string, telpostidx: string, typex: string, recdatex: string, telpactidx: string, telpostidx: any, caridx: string, joker_flg: string) //DBからの返り値を受け取る
async function setTelmnglog(dbhx: ScriptDB, loghx: ScriptLogAdaptor, pactx: string, postx: string, useridx: string, namex: string, telnox: string, commentx: string, telpostidx: string, typex: string, recdatex: string, telpactidx: string, caridx: string, joker_flg: string) //DBからの返り値を受け取る
//対象電話の部署名、部署IDを取得するため
//post_tb より 対応電話の部署名を取得
//電話管理へ処理情報を追記
//telmnglog_tb へインサートの際にエラーが発生した場合。
{
	if (!("G_error_log_text" in global)) G_error_log_text;
	var resultx: any = "";
	var sql = "SELECT postname, userpostid FROM post_tb WHERE " + "pactid = " + telpactidx + " AND " + "postid = " + telpostidx;
	console.log(sql + "\n\n");
	loghx.putError(G_SCRIPT_INFO, "run://post_tbより対象電話の部署名、部署IDを取得/SQL:" + sql + "/");
	console.log("===========post_tb より、対象携帯電話の部署を検索==================" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
	var H_result = await dbhx.getHash(sql);

	if (H_result.length != 1) //$loghx->putError(G_SCRIPT_ERROR, "error://post_tbより、対応する部署を発見できませんでした。/SQL：" . $sql . "/");
		{
			loghx.putError(G_SCRIPT_INFO, "error://post_tbより、対応する部署を発見できませんでした。/SQL：" + sql + "/");
			console.log("============post_tbより対応する部署を発見できませんでした。SQL文" + sql + "================" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
			sql = "SELECT postname, userpostid FROM post_tb WHERE " + "pactid = " + telpactidx + " AND " + "postid = " + postx;
			console.log(sql + "\n\n");
			loghx.putError(G_SCRIPT_INFO, "run://post_tbより登録ユーザの部署名、部署IDを取得/SQL:" + sql + "/");
			console.log("===========post_tb より、登録ユーザの部署を検索==================" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
			H_result = await dbhx.getHash(sql);
		}

	var postnamex = H_result[0].postname;

	if (H_result[0].userpostid != "") {
		postnamex = postnamex + "(" + H_result[0].userpostid + ")";
	}

	namex = "'" + namex + "'";
	commentx = "'" + commentx + "'";
	typex = "'" + typex + "'";
	postnamex = "'" + postnamex + "'";
	sql = "INSERT INTO telmnglog_tb (pactid, postid, userid, name, telno, comment, telpostid, type, recdate, telpostname, carid, joker_flag) values(" + pactx + "," + postx + "," + useridx + "," + namex + "," + telnox + "," + commentx + "," + telpostidx + "," + typex + "," + recdatex + "," + postnamex + "," + caridx + "," + joker_flg + ")";
	loghx.putError(G_SCRIPT_INFO, "run://telmnglog_tbへINSERT/SQL:" + sql + "/");
	console.log("*               telmnglog_tbへINSERTします。SQL文：" + sql + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
	resultx = dbhx.query(sql, false);

	if (resultx == null) {
		loghx.putError(G_SCRIPT_WARNING, "warning://telmnglog_tbへINSERTが失敗しました/" + resultx.message + ":" + resultx.userinfo + "/");
		console.log("*               telmnglogへINSERTが失敗しました：返り値" + resultx.message + ":" + resultx.userinfo + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
		G_error_log_text += "warning://telmnglog_tbへINSERTが失敗しました/" + resultx.message + ":" + resultx.userinfo + "/\n";
		return false;
	}

	return true;
};

async function telTbUpdateFunction(dbh: ScriptDB, logh: ScriptLogAdaptor, H_reserve: { userid: string; arid: string; cirid: string; machine: string; color: string; planid: string; packetid: string; pointstage: string; employeecode: string; username: string; mail: string; orderdate: string; text1: string; text2: string; text3: string; text4: string; text5: string; text6: string; text7: string; text8: string; text9: string; text10: string; text11: string; text12: string; text13: string; text14: string; text15: string; int1: string; int2: string; int3: string; date1: string; date2: string; memo: string; fixdate: string; options: string; contractdate: string; kousiflg: string; kousiptn: string; username_kana: string; telno_view: string; pactid: string; postid: string; carid: string; telno: string; reserve_date: any; recdate: any; exe_postid: any; exe_userid: any; exe_name: any; joker_flag: any; }, setcomment: string, update_c: number, update_0_c: number, now_time: string) //エラーログ格納用
//アップデート用 SQL:作成
//正常にSQLを発行できた場合
{
	var error_log_text = "";
	var sqlstr = "UPDATE " + TEL_TB + " SET ";

	if (H_reserve.userid != "NULL") {
		sqlstr += "userid = " + H_reserve.userid + ",";
	}

	sqlstr += "arid = " + H_reserve.arid + ",";
	sqlstr += "cirid = " + H_reserve.cirid + ",";

	if (H_reserve.machine != "NULL") {
		sqlstr += "machine = " + H_reserve.machine + ",";
	}

	if (H_reserve.color != "NULL") {
		sqlstr += "color = " + H_reserve.color + ",";
	}

	sqlstr += "planid = " + H_reserve.planid + ",";
	sqlstr += "packetid = " + H_reserve.packetid + ",";
	sqlstr += "pointstage = " + H_reserve.pointstage + ",";

	if (H_reserve.employeecode != "NULL") {
		sqlstr += "employeecode = " + H_reserve.employeecode + ",";
	}

	if (H_reserve.username != "NULL") {
		sqlstr += "username = " + H_reserve.username + ",";
	}

	if (H_reserve.mail != "NULL") {
		sqlstr += "mail = " + H_reserve.mail + ",";
	}

	sqlstr += "orderdate = " + H_reserve.orderdate + ",";

	if (H_reserve.text1 != "NULL") {
		sqlstr += "text1 = " + H_reserve.text1 + ",";
	}

	if (H_reserve.text2 != "NULL") {
		sqlstr += "text2 = " + H_reserve.text2 + ",";
	}

	if (H_reserve.text3 != "NULL") {
		sqlstr += "text3 = " + H_reserve.text3 + ",";
	}

	if (H_reserve.text4 != "NULL") {
		sqlstr += "text4 = " + H_reserve.text4 + ",";
	}

	if (H_reserve.text5 != "NULL") {
		sqlstr += "text5 = " + H_reserve.text5 + ",";
	}

	if (H_reserve.text6 != "NULL") {
		sqlstr += "text6 = " + H_reserve.text6 + ",";
	}

	if (H_reserve.text7 != "NULL") {
		sqlstr += "text7 = " + H_reserve.text7 + ",";
	}

	if (H_reserve.text8 != "NULL") {
		sqlstr += "text8 = " + H_reserve.text8 + ",";
	}

	if (H_reserve.text9 != "NULL") {
		sqlstr += "text9 = " + H_reserve.text9 + ",";
	}

	if (H_reserve.text10 != "NULL") {
		sqlstr += "text10 = " + H_reserve.text10 + ",";
	}

	if (H_reserve.text11 != "NULL") {
		sqlstr += "text11 = " + H_reserve.text11 + ",";
	}

	if (H_reserve.text12 != "NULL") {
		sqlstr += "text12 = " + H_reserve.text12 + ",";
	}

	if (H_reserve.text13 != "NULL") {
		sqlstr += "text13 = " + H_reserve.text13 + ",";
	}

	if (H_reserve.text14 != "NULL") {
		sqlstr += "text14 = " + H_reserve.text14 + ",";
	}

	if (H_reserve.text15 != "NULL") {
		sqlstr += "text15 = " + H_reserve.text15 + ",";
	}

	if (H_reserve.int1 != "NULL") {
		sqlstr += "int1 = " + H_reserve.int1 + ",";
	}

	if (H_reserve.int2 != "NULL") {
		sqlstr += "int2 = " + H_reserve.int2 + ",";
	}

	if (H_reserve.int3 != "NULL") {
		sqlstr += "int3 = " + H_reserve.int3 + ",";
	}

	if (H_reserve.date1 != "NULL") {
		sqlstr += "date1 = " + H_reserve.date1 + ",";
	}

	if (H_reserve.date2 != "NULL") {
		sqlstr += "date2 = " + H_reserve.date2 + ",";
	}

	if (H_reserve.memo != "NULL") {
		sqlstr += "memo = " + H_reserve.memo + ",";
	}

	sqlstr += "fixdate = " + H_reserve.fixdate + ",";
	sqlstr += "options = " + H_reserve.options + ",";
	sqlstr += "contractdate = " + H_reserve.contractdate + ",";

	if (H_reserve.kousiflg != "NULL") {
		sqlstr += "kousiflg = " + H_reserve.kousiflg + ",";
	}

	if (H_reserve.kousiptn != "NULL") {
		sqlstr += "kousiptn = " + H_reserve.kousiptn + ",";
	}

	if (H_reserve.username_kana != "NULL") {
		sqlstr += "username_kana = " + H_reserve.username_kana + ",";
	}

	sqlstr += "telno_view = " + H_reserve.telno_view;
	sqlstr += " WHERE ";
	sqlstr += "pactid = " + H_reserve.pactid + " AND ";
	sqlstr += "postid = " + H_reserve.postid + " AND ";
	sqlstr += "carid = " + H_reserve.carid + " AND ";
	sqlstr += "telno = " + H_reserve.telno;
	logh.putError(G_SCRIPT_INFO, "run://tel_tbにUPDATESQL:" + sqlstr + "/");
	console.log("*               tel_tbにUPDATEします。SQL文：" + sqlstr + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
	var get_result: any = await dbh.query(sqlstr, false);

	if (get_result != null) //affectedRows()でUPDATE件数を取得、UPDATE の結果が 1だった場合は正常
		{
			if (dbh.affectedRows(get_result) == 1) //管理予約の type カラムに記入
				//予約テーブルに実行日とステータスの変更 管理記録 telmnglog_tb に書き込み
				//共に正常動作であれば、telTbUpdateFunction()呼び出し元にtrue と カウントデータを返送
				{
					var settype = "変更";

					// if (changeReserveState(dbh, logh, H_reserve.pactid, H_reserve.postid, H_reserve.telno, SUMI, now_time, H_reserve.reserve_date, H_reserve.recdate) == true && setTelmnglog(dbh, logh, H_reserve.pactid, H_reserve.exe_postid, H_reserve.exe_userid, H_reserve.exe_name, H_reserve.telno, setcomment, H_reserve.postid, settype, now_time, H_reserve.pactid, H_reserve.postid, H_reserve.carid, H_reserve.joker_flag) == true) //アップデート件数をインクリメント
					if (await changeReserveState(dbh, logh, H_reserve.pactid, H_reserve.postid, H_reserve.telno, SUMI, now_time, H_reserve.reserve_date, H_reserve.recdate) == true && await setTelmnglog(dbh, logh, H_reserve.pactid, H_reserve.exe_postid, H_reserve.exe_userid, H_reserve.exe_name, H_reserve.telno, setcomment, H_reserve.postid, settype, now_time, H_reserve.pactid, H_reserve.carid, H_reserve.joker_flag) == true) //アップデート件数をインクリメント
						{
							update_c++;
							logh.putError(G_SCRIPT_INFO, `run://tel_reserve_tb telmnglog_tb 共に処理完了/$settype：${settype}`);
							console.log(`*               tel_reserve_tb telmnglog_tb 共に処理完了/$settype：${settype}               *` + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
							return [true, update_c, update_0_c, error_log_text];
						} else {
						logh.putError(G_SCRIPT_WARNING, `warning://tel_reserve_tb telmnglog_tb の処理で問題発生/$settype：${settype}`);
						console.log(`*               tel_reserve_tb telmnglog_tb  の処理で問題発生/$settype：${settype}               *` + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
						G_error_log_text = `warning://tel_reserve_tb telmnglog_tb の処理で問題発生/$settype：${settype}/\n`;
						return [false, update_c, update_0_c, error_log_text];
					}
				// } else if (dbh.affectedRows() == 0) //管理予約の type カラムに記入
				// //予約テーブルに実行日とステータスの変更 管理記録 telmnglog_tb に書き込み
				// //共に正常動作であれば、telTbUpdateFunction()呼び出し元にtrue と カウントデータを返送
				// {
				// 	setcomment = "変更予約登録（対象なし）";
				// 	settype = "対象なし";

				// 	// if (changeReserveState(dbh, logh, H_reserve.pactid, H_reserve.postid, H_reserve.telno, NASI, now_time, H_reserve.reserve_date, H_reserve.recdate) == true && setTelmnglog(dbh, logh, H_reserve.pactid, H_reserve.exe_postid, H_reserve.exe_userid, H_reserve.exe_name, H_reserve.telno, setcomment, H_reserve.postid, settype, now_time, H_reserve.pactid, H_reserve.postid, H_reserve.carid, H_reserve.joker_flag) == true) //0件アップデート件数をインクリメント
				// 	if (await changeReserveState(dbh, logh, H_reserve.pactid, H_reserve.postid, H_reserve.telno, NASI, now_time, H_reserve.reserve_date, H_reserve.recdate) == true && setTelmnglog(dbh, logh, H_reserve.pactid, H_reserve.exe_postid, H_reserve.exe_userid, H_reserve.exe_name, H_reserve.telno, setcomment, H_reserve.postid, settype, now_time, H_reserve.pactid, H_reserve.carid, H_reserve.joker_flag) == true) //0件アップデート件数をインクリメント
				// 		{
				// 			update_0_c++;
				// 			logh.putError(G_SCRIPT_INFO, `run://tel_reserve_tb telmnglog_tb 共に処理完了/$settype：${settype}`);
				// 			console.log(`*               tel_reserve_tb telmnglog_tb 共に処理完了/$settype：${settype}               *` + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
				// 			return [true, update_c, update_0_c, error_log_text];
				// 		} else {
				// 		logh.putError(G_SCRIPT_WARNING, `warning://tel_reserve_tb telmnglog_tb の処理で問題発生/$settype：${settype}`);
				// 		console.log(`*               tel_reserve_tb telmnglog_tb  の処理で問題発生/$settype：${settype}               *` + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
				// 		G_error_log_text = `warning://tel_reserve_tb telmnglog_tb の処理で問題発生/$settype：${settype}/\n`;
				// 		return [false, update_c, update_0_c, error_log_text];
				// 	}
				// } 
				// else {
				// var resultx = "";
				// logh.putError(G_SCRIPT_WARNING, "warning://UPDATEに失敗しました/" + sqlstr + "/" + get_result.message + ": " + get_result.userinfo + "/");
				// console.log("*               UPDATEに失敗しました:" + sqlstr + "/" + get_result.message + ": " + get_result.userinfo + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
				// G_error_log_text += "warning://telmnglog_tbへINSERTが失敗しました/" + resultx.message + ":" + resultx.userinfo + "/\n";
				// return [false, update_c, update_0_c, error_log_text];
			}
		} else {
		logh.putError(G_SCRIPT_WARNING, "warning://UPDATEに失敗しました/" + sqlstr + "/" + get_result.message + ": " + get_result.userinfo + "/");
		console.log("*               UPDATEに失敗しました:" + sqlstr + "/" + get_result.message + ": " + get_result.userinfo + "               *" + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "\n\n");
		G_error_log_text = "warning://UPDATEに失敗しました/" + sqlstr + "/" + get_result.message + ": " + get_result.userinfo + "/\n";
		return [false, update_c, update_0_c, error_log_text];
	}
};
