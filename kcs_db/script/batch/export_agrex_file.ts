//===========================================================================
//機能：アグレックス用請求データ出力バッチ
//対象：コンビニ・銀行・郵便振込決済ファイル
//口座振替決済ファイル
//
//作成：前田
//更新履歴
//===========================================================================

import TableNo, { ScriptDB } from "../batch/lib/script_db"
const _ = require('lodash');

// require("lib/script_db.php");

import { G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "../batch/lib/script_log";
// require("lib/script_log.php");

import * as DEFINE from "../../db_define/define";

import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import { countChars } from "../../class/countChars";

(async () => {
const DEBUG = 1;
const COMMON_LOG_DIR = DEFINE.DATA_LOG_DIR;
const AGREX_DIR = DEFINE.DATA_DIR + "/agrex/export";
const LOG_DELIM = " ";
const DELIM = ",";
const SCRIPTNAME = "export_agrex_file.php";
const PACTID = 76;
const CARID = 13;
const TAXCODE = "1000";
const HEADER_HEAD = "1,250001,";
const HEADER_TAIL_KOUFURI = "\r\n";
const HEADER_TAIL_HARAIKOMI = ",,,,,\r\n";
const HEADER_COLUMN = 29;
const MEISAI_HEAD = "2,250001,";
const MEISAI_TAIL = ",,,\r\n";
const MEISAI_COLUMN = 10;
const END_HEAD = "9,250001,";
const END_TAIL = "\r\n";
const END_COLUMN = 3;
const NYUKIN_DAY = "14";
const ITAKU_CODE = "230477";
const ITAKU_KUBUN = "00";
const LENGTH_KOUZA = 7;
const MEISAI_TEL_CNT = 4;
const KOUFURI = "口座振替";
const HARAIKOMI = "払込";
const KOUFURI_MEISAI_MAX = 50;
const HARAIKOMI_MEISAI_MAX = 16;
const KOUFURI_TEL_MAX = 152;
const HARAIKOMI_TEL_MAX = 16;
const CHARGE_MAX = 999999999999;
var dbLogFile = COMMON_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.putListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);

var year: number = 0;
var month: number = 0;

if (process.argv.length != 2 + 1) {
	usage("");
} else {
	var billdate = process.argv[1 + 1];
	if (!billdate.match("^[0-9]{6}$")) {
		usage("請求年月の指定が不正です");
	} else {
		year = parseInt(billdate.substring(0, 4));
		month = parseInt(billdate.substring(4, 6));

		if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
			usage("請求年月の指定が不正です");
		}
	}
}

console.log("アグレックス用請求データ作成開始\n");
logh.putError(G_SCRIPT_BEGIN, "アグレックス用請求データ作成開始");
var H_haraikomi = {
	telno: {
		MUST: "false",
		LENGTH: 15,
		PROPERTY: ["half-alphameric"],
		CAPTION: "顧客電話番号"
	},
	ptext3: {
		MUST: "true",
		LENGTH: 15,
		PROPERTY: ["half-alphameric"],
		CAPTION: "顧客コード"
	},
	ptext4: {
		MUST: "true",
		LENGTH: 30,
		PROPERTY: ["full-char"],
		CAPTION: "請求書送付先名"
	},
	ptext5: {
		MUST: "false",
		LENGTH: 60,
		PROPERTY: ["full-char"],
		CAPTION: "請求書送付先部署"
	},
	ptext6: {
		MUST: "true",
		LENGTH: 7,
		PROPERTY: ["half-numeric"],
		CAPTION: "請求書送付先郵便番号"
	},
	ptext7: {
		MUST: "true",
		LENGTH: 100,
		PROPERTY: ["full-char"],
		CAPTION: "請求書送付先住所"
	},
	ptext8: {
		MUST: "false",
		LENGTH: 10,
		PROPERTY: ["half-numeric"],
		CAPTION: "顧客口座番号"
	},
	pdate1: {
		MUST: "true",
		CAPTION: "ご利用開始日"
	}
};
var H_koufuri = {
	telno: {
		MUST: "false",
		LENGTH: 15,
		PROPERTY: ["half-alphameric"],
		CAPTION: "顧客電話番号"
	},
	ptext3: {
		MUST: "true",
		LENGTH: 14,
		PROPERTY: ["half-numeric"],
		CAPTION: "顧客コード"
	},
	ptext4: {
		MUST: "true",
		LENGTH: 30,
		PROPERTY: ["full-char"],
		CAPTION: "請求書送付先名"
	},
	ptext5: {
		MUST: "false",
		LENGTH: 60,
		PROPERTY: ["full-char"],
		CAPTION: "請求書送付先部署"
	},
	ptext6: {
		MUST: "true",
		LENGTH: 7,
		PROPERTY: ["half-numeric"],
		CAPTION: "請求書送付先郵便番号"
	},
	ptext7: {
		MUST: "true",
		LENGTH: 100,
		PROPERTY: ["full-char"],
		CAPTION: "請求書送付先住所"
	},
	ptext8: {
		MUST: "true",
		LENGTH: 7,
		PROPERTY: ["half-numeric", "half-zero-left"],
		CAPTION: "顧客口座番号"
	},
	ptext9: {
		MUST: "true",
		LENGTH: 4,
		PROPERTY: ["half-numeric"],
		CAPTION: "銀行コード"
	},
	ptext10: {
		MUST: "true",
		LENGTH: 3,
		PROPERTY: ["half-numeric"],
		CAPTION: "支店コード"
	},
	ptext11: {
		MUST: "true",
		LENGTH: 1,
		PROPERTY: ["half-numeric"],
		CAPTION: "預金種別"
	},
	ptext12: {
		MUST: "true",
		LENGTH: 30,
		PROPERTY: ["half-kouza"],
		CAPTION: "口座名義"
	},
	pdate1: {
		MUST: "true",
		CAPTION: "ご利用開始日"
	}
};

// ２重起動防止ロックをかける
lock(true);

// テーブルＮＯ取得
var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);

var useMonth: string;
var useYear: string;
var nextYear: string;
var nextMonth: string;

// 利用年月を取得
if (month > 1) {
  useYear = year.toString();

	if (month < 11) {
		useMonth = "0" + (month - 1);
	} else {
		useMonth = (month - 1).toString();
	}
} else {
	useYear = (year - 1).toString();
	useMonth = "12";
}
// 翌月の年月を取得
if (month == 12) {
	nextYear = (year + 1).toString();
	nextMonth = "1";
} else {
	nextYear = year.toString();
	nextMonth = (month + 1).toString();
}

if (parseInt(nextMonth) < 10) {
	nextMonth = "0" + nextMonth;
}

// 内訳コードを取得
var sql = "select code,name from utiwake_tb where carid = " + CARID + " order by cast(code as integer)";
var H_result = await dbh.getHash(sql);
console.log(H_result);
// 単体テスト用の処理(12/22 荒木)
H_result = [
	{
		"code": "code",
		"name": "name"
	}
]
// ---------------------------

var utiwakeCnt = H_result.length;

var H_utiwake = {};

// 内訳コードマスター
for (var cnt = 0; cnt < utiwakeCnt; cnt++) {
	H_utiwake[H_result[cnt].code] = H_result[cnt].name;
}

// 請求書発行するための会社または個人情報を取得
var sql = "select po.postid,po.postname,po.telno,po.ptext1,po.ptext2,po.ptext3,po.ptext4,po.ptext5," + "po.ptext6,po.ptext7,po.ptext8,po.ptext9,po.ptext10,po.ptext11,po.ptext12," + "date(po.pdate1) as pdate1,date(po.pdate2) as pdate2 " + "from post_" + tableNo + "_tb po inner join post_relation_" + tableNo + "_tb pr " + "on po.pactid = pr.pactid and po.postid = pr.postidchild " + "where po.pactid = " + PACTID + " " + "and po.ptext1 in ('1','2') " + "order by pr.level,po.ptext2,po.postid";
H_result = await dbh.getHash(sql);
console.log("B===============================");
console.log(H_result);
// 単体テスト用の処理(12/22 荒木)
H_result = [
	{
		"postid": 45095,
		"postname": "あいうえお",
		"telno": "telno",
		"ptext1": "ptext1",
		"ptext2": "口座振替",
		"ptext3": "678910",
		"ptext4": "かきくけこ",
		"ptext5": "さしすせそ",
		"ptext6": "123456",
		"ptext7": "なにぬねの",
		"ptext8": "789",
		"ptext9": "1213",
		"ptext10": "141",
		"ptext11": "1",
		"ptext12": "kouza1",
		"pdate1": "2022-12-22 00:00:00",
		"pdate2": "2022-12-22 00:00:00"
	}
]
// ---------------------------

// 請求書発行する会社件数
var postCnt = H_result.length;

var A_postid = Array();			// 配下全ての部署ＩＤ格納用
var A_postidDone = Array();		// 処理が済んだ部署ＩＤを格納用
var A_koufuriBuff = Array();		// 口座振替用出力ファイルバッファ
var A_haraikomiBuff = Array();		// 払込用出力ファイルバッファ

var H_postdata = {};

// 請求書発行するための会社または個人情報を１件ずつ処理する
for (cnt = 0; cnt < postCnt; cnt++) {

		// 会社情報が正しく設定されているかどうか
	var chkflg = true;

	// 部署情報
	let _tmp_0 = H_result[cnt];
	var postid;
	for (var key in _tmp_0) {
		var val = _tmp_0[key];
		// キーが部署ＩＤ
		if (key == "postid") {
			// 部署ＩＤを退避
			postid = val;
			// 部署ＩＤリストに追加
			A_postid.push(val);
		} else {
			// 部署ＩＤをキー、部署情報を値とした配列につみなおす
		//	H_postdata[postid][key] = val;
			_.setWith(
				H_postdata,
				`${postid}.${key}`,
				val,
				Object
			)
		}
	}


	if (-1 !== A_postidDone.indexOf(postid) == true) {
		continue;
	}

	// 請求書発行する会社配下の部署を取得
	var A_followerPostid = await getFollowerPost(PACTID, postid, tableNo);
	// 処理済部署ＩＤリストへ追加
	A_postidDone = A_postidDone.concat(A_followerPostid);

	// 請求のある電話番号一覧を取得
	sql = "select distinct td.telno " + "from tel_details_" + tableNo + "_tb td inner join tel_" + tableNo + "_tb te " + "on td.pactid = te.pactid and td.carid = te.carid and td.telno = te.telno " + "where td.pactid = " + PACTID + " " + "and td.carid = " + CARID + " " + "and te.postid in (" + A_followerPostid.join(",") + ")";

	var A_telresult = await dbh.getCol(sql);

	// 単体テスト用
	A_telresult = ["telno", "telno1", "telno2", "telno3"]
	// -------------

	// 請求がある場合
	if (A_telresult.length != 0) {

		// 請求があれば会社情報をチェック
		// 口座振替
		if (H_postdata[postid].ptext2 == KOUFURI) {
			// 配列のキーを１つずつ抜き取る
			for (var key of Object.keys(H_postdata[postid])) {
				// データ規則がある
				if (undefined !== H_koufuri[key] == true) {
					var data = { "value": H_postdata[postid][key] }
					// 会社データに不備がある場合
					//console.log(123)
					if (chkData(data, H_koufuri[key], H_postdata[postid].postname, H_postdata[postid].ptext3, postid) == false) {
						chkflg = false;
					}
				}
			}
		// 払い込み
		} else if (H_postdata[postid].ptext2 == HARAIKOMI) {
			// 配列のキーを１つずつ抜き取る
			for (var key of Object.keys(H_postdata[postid])) {
				// データ規則がある
				if (undefined !== H_haraikomi[key] == true) {
					var data = { "value": H_postdata[postid][key] }
					// 会社データに不備がある場合
					console.log(222)
					if (chkData(data, H_haraikomi[key], H_postdata[postid].postname, H_postdata[postid].ptext3, postid) == false) {
						chkflg = false;
					}
				}
			}

			// ご利用開始日を配列へ格納
			var A_useStartDate = H_postdata[postid].pdate1.split("-");

			// ご利用開始年が利用年より大きい場合と年は同じだが月が大きい場合は処理をスキップする
			if (useYear < A_useStartDate[0] || useYear == A_useStartDate[0] && useMonth < A_useStartDate[1]) {
				console.log("顧客名:" + H_postdata[postid].postname + ",顧客コード:" + H_postdata[postid].ptext3 + ",システム部署ＩＤ:" + postid + "のご利用開始日が不正の為、スキップします\n");
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + H_postdata[postid].postname + ",顧客コード:" + H_postdata[postid].ptext3 + ",システム部署ＩＤ:" + postid + "のご利用開始日が不正の為、スキップします");
				chkflg = false;
			}

		// 指定無し
		} else if (H_postdata[postid].ptext2 == "") {
			console.log("顧客名:" + H_postdata[postid].postname + ",顧客コード:" + H_postdata[postid].ptext3 + ",システム部署ＩＤ:" + postid + "に決済方法が設定されていない為、スキップします\n");
			print();
			logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + H_postdata[postid].postname + ",顧客コード:" + H_postdata[postid].ptext3 + ",システム部署ＩＤ:" + postid + "に決済方法が設定されていない為、スキップします");
			continue;
		}

		// 会社情報が正しければ科目毎に金額と端末台数を集計
		if (chkflg == true) {
			sql = "select td.code,sum(td.charge) as charge,sum(td.realcnt) as realcnt " + "from tel_details_" + tableNo + "_tb td inner join tel_" + tableNo + "_tb te " + "on td.pactid = te.pactid and td.carid = te.carid and td.telno = te.telno " + "where td.pactid = " + PACTID + " " + "and td.carid = " + CARID + " " + "and te.postid in (" + A_followerPostid.join(",") + ") " + "group by td.code " + "order by cast(td.code as integer)";
			var H_billresult = await dbh.getHash(sql);
			console.log("D===============================");
			console.log(H_billresult);
			// 単体テスト用のデータ
			H_billresult = [
				{
					"code": "code",
					"charge": "charge",
					"realcnt": "realcnt"
				}
			];
			// -----------------

			// 作業用配列
			var A_tmpBuff = Array();
			// 受注コード
			var ordercode = useYear.toString().substring(2) + useMonth + H_postdata[postid].ptext3;
			// 合計、税抜き合計、消費税用変数を初期化
			var totalCharge = { "value": 0 };
			var subTotalCharge = { "value": 0 };
			var tax = { "value": 0 };

			// 口座振替
			if (H_postdata[postid].ptext2 == KOUFURI) {
				// ヘッダーレコード作成
				var header = HEADER_HEAD + ordercode + DELIM + ITAKU_CODE + DELIM + ITAKU_KUBUN + DELIM + H_postdata[postid].ptext3 + DELIM + H_postdata[postid].ptext6 + DELIM + H_postdata[postid].ptext7 + DELIM + DELIM + DELIM + H_postdata[postid].ptext5 + DELIM + H_postdata[postid].ptext4 + DELIM + DELIM + H_postdata[postid].telno + DELIM + H_postdata[postid].ptext8 + DELIM + DELIM + DELIM;
				// ご利用期間を作業用バッファに格納
				A_tmpBuff.push(makeDateSpan(useYear, useMonth, ordercode, H_postdata[postid].pdate1));
				// ご利用電話番号を作業用バッファに格納
				A_tmpBuff = A_tmpBuff.concat(makeTelList(ordercode, KOUFURI_TEL_MAX, tableNo, useYear, useMonth, A_followerPostid));
				// 請求情報明細を作業用バッファに格納
				A_tmpBuff = A_tmpBuff.concat(makeBill(ordercode, H_billresult, H_utiwake, totalCharge, subTotalCharge, tax));

				// 明細行数をチェック
				if (A_tmpBuff.length > KOUFURI_MEISAI_MAX) {
					console.log("顧客名:" + H_postdata[postid].postname + ",顧客コード:" + H_postdata[postid].ptext3 + ",システム部署ＩＤ:" + postid + "の口座振替明細行数がオーバーした為、スキップします\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + H_postdata[postid].postname + ",顧客コード:" + H_postdata[postid].ptext3 + ",システム部署ＩＤ:" + postid + "口座振替明細行数がオーバーした為、スキップします");
					continue;
				}

				// 消費税込み合計金額、消費税抜き合計金額、消費税額をチェック
				if (chkBill(H_postdata[postid].postname, H_postdata[postid].ptext3, postid, totalCharge, subTotalCharge, tax) == false) {
					continue;
				}

				// 預金種別チェック
				if (H_postdata[postid].ptext11 != 1 && H_postdata[postid].ptext11 != 2) {
					console.log("顧客名:" + H_postdata[postid].postname + ",顧客コード:" + H_postdata[postid].ptext3 + ",システム部署ＩＤ:" + postid + "の預金種別が不正の為、スキップします\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + H_postdata[postid].postname + ",顧客コード:" + H_postdata[postid].ptext3 + ",システム部署ＩＤ:" + postid + "預金種別が不正の為、スキップします");
					continue;
				}

				// ヘッダーレコードに金額以降を追加
				header += totalCharge.value + DELIM + subTotalCharge.value + DELIM + tax.value + DELIM + H_postdata[postid].ptext9 + DELIM + H_postdata[postid].ptext10 + DELIM + H_postdata[postid].ptext11 + DELIM + H_postdata[postid].ptext12 + DELIM;

				var newAccount = 0;
				// 口座開始年月が設定されていない
				if (H_postdata[postid].pdate2 == "") {
					newAccount = 2;
				// 口座開始年月が設定されている
				} else {
					var A_date = H_postdata[postid].pdate2.split("-");

					// 当月以前
					if (year > A_date[0] || year == A_date[0] && month >= A_date[1]) {
						newAccount = 2;
					// 来月
					} else {
						newAccount = 1;
					}
				}

				//  ヘッダーレコードに新規コードを追加
				header += newAccount + HEADER_TAIL_KOUFURI;
				// 出力用配列に格納
				A_koufuriBuff.push(header);
				// 作業用配列を出力用配列にマージ
				A_koufuriBuff = A_koufuriBuff.concat(A_tmpBuff);
				// エンドレコードを出力用配列に格納
				A_koufuriBuff.push(makeEnd(ordercode));

			// 払い込み
			} else if (H_postdata[postid].ptext2 == HARAIKOMI) {
				// ヘッダーレコード作成
				header = HEADER_HEAD + ordercode + DELIM + H_postdata[postid].ptext3 + DELIM + H_postdata[postid].ptext6 + DELIM + H_postdata[postid].ptext7 + DELIM + DELIM + DELIM + H_postdata[postid].ptext5 + DELIM + H_postdata[postid].ptext4 + DELIM + DELIM + H_postdata[postid].telno + DELIM + H_postdata[postid].ptext8 + DELIM + DELIM + nextYear + nextMonth + NYUKIN_DAY + DELIM + DELIM + DELIM + DELIM + DELIM + DELIM + DELIM;
				// ご利用期間を作業用バッファに格納
				A_tmpBuff.push(makeDateSpan(useYear, useMonth, ordercode, A_useStartDate));
				// ご利用電話番号を作業用バッファに格納
				A_tmpBuff = A_tmpBuff.concat(makeTelList(ordercode, HARAIKOMI_TEL_MAX, tableNo, useYear, useMonth, A_followerPostid));
				// 請求情報明細を作業用バッファに格納
				A_tmpBuff = A_tmpBuff.concat(makeBill(ordercode, H_billresult, H_utiwake, totalCharge, subTotalCharge, tax));

				// 明細行数をチェック
				if (A_tmpBuff.length > HARAIKOMI_MEISAI_MAX) {
					console.log("顧客名:" + H_postdata[postid].postname + ",顧客コード:" + H_postdata[postid].ptext3 + ",顧客コード:" + postid + "の払込明細行数がオーバーした為、スキップします\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + H_postdata[postid].postname + ",顧客コード:" + H_postdata[postid].ptext3 + ",システム部署ＩＤ:" + postid + "払込明細行数がオーバーした為、スキップします");
					continue;
				}

				// 消費税込み合計金額、消費税抜き合計金額、消費税額をチェック
				if (chkBill(H_postdata[postid].postname, H_postdata[postid].ptext3, postid, totalCharge, subTotalCharge, tax) == false) {
					continue;
				}

				// ヘッダーレコードに金額を追加
				header += totalCharge.value + DELIM + subTotalCharge.value + DELIM + tax.value + HEADER_TAIL_HARAIKOMI;
				// 出力用配列に格納
				A_haraikomiBuff.push(header);
				// 作業用配列を出力用配列にマージ
				A_haraikomiBuff = A_haraikomiBuff.concat(A_tmpBuff);
				// エンドレコードを出力用配列に格納
				A_haraikomiBuff.push(makeEnd(ordercode));
			}
		}
	}
}

// 出力ファイル作成
var koufuriFile = AGREX_DIR + "/250001" + year + month + "01f.csv";
var haraikomiFile = AGREX_DIR + "/250001" + year + month + "01.csv";

// ファイルオープン
var fp_koufuri = fs.openSync(koufuriFile, "w");
// var fp_koufuri = fopen(koufuriFile, "w");
var fp_haraikomi = fs.openSync(haraikomiFile, "w");
// var fp_haraikomi = fopen(haraikomiFile, "w");

// 口座振替ファイル出力
for (var value of A_koufuriBuff) {
	fs.writeFileSync(fp_koufuri, Encoding.convert(value, {from: "UNICODE", to: "SJIS", type: "string"}));
	// fs.writeFileSync(fp_koufuri, mb_convert_encoding(value, "SJIS-win", "UTF-8"));// 2022cvt_006
}

// fflush(fp_koufuri);

// 払い込みファイル出力
for (var value of A_haraikomiBuff) {
	fs.writeFileSync(fp_koufuri, Encoding.convert(value, {from: "UNICODE", to: "SJIS", type: "string"}));
	// fs.writeFileSync(fp_haraikomi, mb_convert_encoding(value, "SJIS-win", "UTF-8"));// 2022cvt_006
}

// ファイルクローズ
// fflush(fp_haraikomi);
fs.close(fp_koufuri);
// fclose(fp_koufuri);
fs.close(fp_haraikomi);
// fclose(fp_haraikomi);

// ロック解除
lock(false);

// 処理終了をログ出力
console.log("アグレックス用請求データ作成終了\n");
logh.putError(G_SCRIPT_END, "アグレックス用請求データ作成終了");
// throw process.exit(0);

function usage(comment: string) {

	if (comment == "") {
		comment = "請求年月を指定してください";
	}

	console.log("\n" + comment + "\n\n");
	console.log("Usage) " + SCRIPTNAME + " 請求年月(YYYYMM)\n\n");
	dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw process.exit(1);// 2022cvt_009
};

async function lock(is_lock: boolean) {
	var pre = "batch";
	var now = getTimestamp();

	// ロックする
	if (is_lock == true) {
		dbh.begin();
		dbh.lock("clamptask_tb");

		var sql = "select count(*) from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
		var count = await dbh.getOne(sql);

		// 単体テストの為、追記
		count = 0;
		// -----------------

		// 既に起動中
		if (count != 0) {
			dbh.rollback();
			console.log("\n既に起動しています\n\n");
			dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + "多重動作");
			return false;
		}

		sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + dbh.escape(pre + "_" + SCRIPTNAME) + "',1,'" + now + "');";
		dbh.query(sql);
		dbh.commit();
	// ロック解除
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
	var yyyy = tm.getFullYear();
	var mm = (tm.getMonth() + 1).toString();
	if (mm.length == 1) {
		mm = "0" + mm;
	}
	var dd = (tm.getDate() + 0).toString();
	if (dd.length == 1) {
		dd = "0" + dd;
	}
	var hh = (tm.getHours() + 0).toString();
	if (hh.length == 1) {
		hh = "0" + hh;
	}
	var nn = (tm.getMinutes() + 0).toString();
	if (nn.length == 1) {
		nn = "0" + nn;
	}
// 2022cvt_015
	var ss = (tm.getSeconds() + 0).toString();
	if (ss.length == 1) {
		ss = "0" + ss;
	}
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};

function getTableNo(currentYear: number, currentMonth: number, targetYear: number, targetMonth: number) {
	var calc = 12 * (currentYear - targetYear) + currentMonth - targetMonth;

	if (calc < 12) {
			var tableNo = targetMonth.toString();
		} else if (calc > 23) {
		tableNo = "";
	} else {
		tableNo = (targetMonth + 12).toString();
	}

	return tableNo;
};

async function getFollowerPost(pactid: number | string, postid: string, tableNo = "") {

	if (pactid == "" || postid == "") {
		return Array();
	}

	var sql = "select postidparent,postidchild,level from ";

	if (tableNo == "") {
		sql += "post_relation_tb";
	} else {
		sql += "post_relation_" + tableNo + "_tb";
	}

	sql += " where pactid = " + pactid + " order by level";
	var H_return = await dbh.getHash(sql);
	// 単体テスト用（荒木）
	H_return = [
		{ "postidparent": 45095, "postidchild": 45095, "level": 0 },
		{ "postidparent": 45095, "postidchild": 45096, "level": 1 },
		{ "postidparent": 45096, "postidchild": 45102, "level": 2 },
		{ "postidparent": 45096, "postidchild": 70593, "level": 2 },
		{ "postidparent": 70593, "postidchild": 70596, "level": 3 },
		{ "postidparent": 70593, "postidchild": 82954, "level": 3 },
		{ "postidparent": 70593, "postidchild": 131769, "level": 3 },
		{ "postidparent": 70593, "postidchild": 149046, "level": 3 }
	]
	// --------------
	var H_postid = Array();
	var A_postid_list = Array();
	var target_find = false;

	for (var cnt = 0; cnt < H_return.length; cnt++) {
		var level = H_return[cnt].level;
		var parentid = H_return[cnt].postidparent;
		var childid = H_return[cnt].postidchild;

		var target_level;
		if (target_find == false) {
			if (postid == childid) {
				target_level = level;
				H_postid[childid] = true;
				A_postid_list.push(childid);
				target_find = true;
			}
		} else {
			if (target_level < level) {
				if (undefined !== H_postid[parentid] && H_postid[parentid] == true) {
					H_postid[childid] = true;
					A_postid_list.push(childid);
				}
			}
		}
	}

	H_postid = [];
	// delete H_postid;
	return A_postid_list;
};

function chkData(data: { [key: string]: string }, H_kisoku: { [x: string]: any; CAPTION: string; PROPERTY: string[]; }, postname: string, kokyakucode: string, postid: string) {

	var chkflg = true;

	for (var key in H_kisoku) {
		var val = H_kisoku[key];

		// 必須項目なのに値が設定されていない場合
		if (key == "MUST" && val == "true" && data.value == "") {
			console.log("顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "に値が設定されていない為、スキップします\n");
			logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "に値が設定されていない為、スキップします");
			chkflg = false;

		// 桁数チェック
		} else if (key == "LENGTH") {
			// 全角文字のみ指定がある場合
			if (-1 !== H_kisoku.PROPERTY.indexOf("full-char") == true) {
				// 文字数、ＳＪＩＳ変換後のバイト数、半角文字の混在をチェック
				if (countChars(data.value) > val / 2 || Encoding.convert(Encoding.stringToCode(data.value), { from: "UNICODE", to: "SJIS", type: "string" }).length > val || countChars(data.value) * 2 != Encoding.convert(Encoding.stringToCode(data.value), { from: "UNICODE", to: "SJIS", type: "string" }).length) {
				// if (mb_strlen(data) > val / 2 || mb_convert_encoding(data, "SJIS-win", "UTF-8").length > val || mb_strlen(data) * 2 != mb_convert_encoding(data, "SJIS-win", "UTF-8").length) {
					console.log("顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "が半角数字" + val / 2 + "文字以内で設定されていない為、スキップします\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "が半角数字" + val / 2 + "文字以内で設定されていない為、スキップします");
					chkflg = false;
				}

			// 半角数字のみの指定がある場合
			} else if (-1 !== H_kisoku.PROPERTY.indexOf("half-numeric") == true) {
				// 文字数、全角文字の混在チェック、数字以外の混在チェック
				if (countChars(data.value) > val || countChars(data.value) !== data.value.length || data.value.match("[^0-9]")) {
				// if (mb_strlen(data) > val || mb_strlen(data) != data.length || data.match(/[^0-9]/)) {
					console.log("顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "が半角数字" + val + "文字以内で設定されていない為、スキップします\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "が半角数字" + val + "文字以内で設定されていない為、スキップします");
					chkflg = false;
				}

			// 口座名義の指定がある場合
			} else if (-1 !== H_kisoku.PROPERTY.indexOf("half-kouza") == true) {
				// 文字数、ＳＪＩＳ変換後のバイト数、半角カナ以外の混在をチェック
				if (countChars(data.value) > val || countChars(data.value) !== Encoding.convert(Encoding.stringToCode(data.value), { from: "SJIS", to: "UNICODE", type: "string" }).length || data.value.match("/[^A-Z0-9ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ.()-ﾞﾟ]/")) {
				// if (mb_strlen(data) > val || mb_strlen(data) != mb_convert_encoding(data, "SJIS-win", "UTF-8").length ||
				// data.match(/[a-z]/)) {
					console.log("顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "が半角文字（数字、大文字アルファベット、ヲを除く大文字カタカナ、ピリオド、括弧、ハイフン、濁点、半濁点）" + val + "文字以内で設定されていない為、スキップします\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "が半角文字（数字、大文字アルファベット、ヲを除く大文字カタカナ、ピリオド、括弧、ハイフン、濁点、半濁点）" + val + "文字以内で設定されていない為、スキップします");
					chkflg = false;
				}

				// 一旦処理を通すために、コメントアウト
				// if (data.value.match("[a-z]")) {
				// 	console.log("顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "が半角文字（数字、大文字アルファベット、ヲを除く大文字カタカナ、ピリオド、括弧、ハイフン、濁点、半濁点）" + val + "文字以内で設定されていない為、スキップします\n");
				// 	logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "が半角文字（数字、大文字アルファベット、ヲを除く大文字カタカナ、ピリオド、括弧、ハイフン、濁点、半濁点）" + val + "文字以内で設定されていない為、スキップします");
				// 	chkflg = false;
				// }

			// 半角文字の場合
			} else {
				// 文字数、全角文字の混在をチェック
				if (countChars(data.value) > val || countChars(data.value) != data.value.length) {
				// if (mb_strlen(data) > val || mb_strlen(data) != data.length) {
					console.log("顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "が半角文字" + val + "文字以内で設定されていない為、スキップします\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の" + H_kisoku.CAPTION + "が半角文字" + val + "文字以内で設定されていない為、スキップします");
					chkflg = false;
				}
			}

			// 半角０左埋め指定がある場合
			if (-1 !== H_kisoku.PROPERTY.indexOf("half-zero-left") == true) {
				// 実データ文字数を取得
				var length = data.value.length;

				// 実データ文字数が指定文字数に満たない場合
				if (length < val) {
					var addstr = "";
					// 不足文字数分０を追加する
					for (var cnt = 0; cnt < val - length; cnt++) {
						addstr += "0";
					}
					// 実データに０を追加
					data.value = addstr + data.value;
				}
			}
		}
	}

	return chkflg;
};

function getMonthEnd(year: number, month: number) {
	var leapYearFlg: boolean;
	// ４年で割り切れれば閏年
	if (year % 4 == 0) {
		leapYearFlg = true;

		// １００年で割り切れれば閏年ではない
		if (year % 100 == 0) {
			leapYearFlg = false;
		}

		// ２０００年で割り切れれば閏年
		if (year % 2000 == 0) {
			leapYearFlg = true;
		}
	} else {
		leapYearFlg = false;
	}

	// 末日３０日
	if (month == 4 || month == 6 || month == 9 || month == 11) {
		return "30";
	// ２月
	} else if (month == 2) {
		if (leapYearFlg == true) {
			return "29";
		} else {
			return "28";
		}
	} else {
		return "31";
	}
};

function makeDateSpan(useYear: string, useMonth: string, ordercode: string, A_date: string[]) {

	// ご利用期間
	var meisai = MEISAI_HEAD + ordercode + DELIM + DELIM + "ご利用期間 ";

	// 利用開始日が利用年月より前なら利用期間開始日を１日にする
	if (useYear > A_date[0] || useYear == A_date[0] && useMonth > A_date[1]) {
			var dateSpan = useYear + "年" + useMonth + "月01日 - " + useYear + "年" + useMonth + "月" + getMonthEnd(parseInt(useYear), parseInt(useMonth)) + "日";
	// 利用開始日が利用年月より後なら利用期間開始日を利用開始日から取得日する
	} else {
		var dateSpan = useYear + "年" + useMonth + "月" + A_date[2] + "日 - " + useYear + "年" + useMonth + "月" + getMonthEnd(parseInt(useYear), parseInt(useMonth)) + "日";
	}

	meisai += dateSpan + DELIM + DELIM + MEISAI_TAIL;
	return meisai;
};

async function makeTelList(ordercode: string, telMax: number, tableNo: string, useYear: string, useMonth: string, A_followerPostid: any[]) {
	// バッファ
	var A_buff = Array();
	var meisai = "";
	var sql = "select telno " + "from tel_" + tableNo + "_tb " + "where pactid = " + PACTID + " " + "and carid = " + CARID + " " + "and (text8 is null or  text8 != '1') " + "and date(date1) <= '" + useYear + "-" + useMonth + "-" + getMonthEnd(parseInt(useYear), parseInt(useMonth)) + "' " + "and postid in (" + A_followerPostid.join(",") + ")";
	var A_tel = await dbh.getCol(sql);
	A_tel = [
		"123456789",
		"23456789",
		"3456789",
		"456789",
		"567890"
	]
	// ご利用電話番号
	var telCnt = A_tel.length;
	var roopCnt = A_tel.length;

	// 電話件数が最大電話件数より大きかった場合
	if (telCnt > telMax) {
		roopCnt = telMax;
	}

	// 電話番号を１件ずつ処理
	for (var cnt = 0; cnt < roopCnt; cnt++) {
		// １件目の処理（電話番号は１行４件まで）
		if ((cnt + 1) % MEISAI_TEL_CNT == 1) {
			meisai = MEISAI_HEAD + ordercode + DELIM + DELIM + "ご利用電話番号 " + A_tel[cnt];
		// １行４件になったら改行処理
		} else if ((cnt + 1) % MEISAI_TEL_CNT == 0) {
			meisai += " " + A_tel[cnt];

			// 電話の最大値に達した場合
			if (cnt == telMax - 1) {
				meisai += "・・・";
			}

			// １行目だけ電話件数を出力
			if ((cnt + 1) / MEISAI_TEL_CNT == 1) {
					meisai += "," + telCnt + DELIM + MEISAI_TAIL;
			// ２行目以降は電話件数は出力しない
			} else {
				meisai += DELIM + DELIM + MEISAI_TAIL;
			}

			// 作業用バッファに格納
			A_buff.push(meisai);
			meisai = "";
		// 電話番号を追記
		} else {
			meisai += " " + A_tel[cnt];
		}
	}

	// 最終行の処理
	if (meisai != "") {
		// 電話番号が３件以下の場合は電話件数を追加
		if (telCnt < 4) {
				meisai += "," + telCnt + DELIM + MEISAI_TAIL;
		// 電話番号が３件以下の場合は電話件数を追加
		} else {
			meisai += DELIM + DELIM + MEISAI_TAIL;
		}

		// 作業用バッファに格納
		A_buff.push(meisai);
	}

	return A_buff;
};

function makeBill(ordercode: string, H_bill: any[], H_utiwake: { [key: string]: any }, totalCharge: { [key: string]: number }, subTotalCharge: { [key: string]: number }, tax: { [key: string]: number }) {
	// バッファ
	var A_buff = Array();
	// 請求件数
	var billCnt = H_bill.length;

	// 請求情報を1件ずつ処理
	for (var cnt = 0; cnt < billCnt; cnt++) {
		var meisai = MEISAI_HEAD + ordercode + DELIM + DELIM + H_utiwake[H_bill[cnt].code] + DELIM + H_bill[cnt].realcnt + DELIM + H_bill[cnt].charge + MEISAI_TAIL;
		// 作業用バッファに格納
		A_buff.push(meisai);

		// コードが消費税
		if (H_bill[cnt].code == TAXCODE) {
			tax.value = H_bill[cnt].charge;
		// コードが消費税以外
		} else {
			// 税抜き合計
			subTotalCharge.value += H_bill[cnt].charge;
		}

		// 合計
		totalCharge.value += H_bill[cnt].charge;
	}

	return A_buff;
};

function makeEnd(ordercode: string) {
	// エンドレコード作成
	var end = END_HEAD + ordercode + END_TAIL;
	return end;
};

function chkBill(postname: string, kokyakucode: string, postid: string, totalCharge: { [key: string]: number }, subTotalCharge: { [key: string]: number }, tax: { [key: string]: number }) {
	var chkFlg = true;

	// 消費税込み合計金額をチェック
	if (totalCharge.value > CHARGE_MAX) {
		console.log("顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の消費税込み合計金額が最大値をオーバーした為、スキップします\n");
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の消費税込み合計金額が最大値をオーバーした為、スキップします");
		chkFlg = false;
	}

	// 消費税抜き合計金額をチェック
	if (subTotalCharge.value > CHARGE_MAX) {
		console.log("顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の消費税抜き合計金額が最大値をオーバーした為、スキップします\n");
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の消費税抜き合計金額が最大値をオーバーした為、スキップします");
		chkFlg = false;
	}

	// 消費税額をチェック
	if (tax.value > CHARGE_MAX) {
		console.log("顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の消費税額が最大値をオーバーした為、スキップします\n");
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "顧客名:" + postname + ",顧客コード:" + kokyakucode + ",システム部署ＩＤ:" + postid + "の消費税額が最大値をオーバーした為、スキップします");
		chkFlg = false;
	}

	return chkFlg;
};

})();
