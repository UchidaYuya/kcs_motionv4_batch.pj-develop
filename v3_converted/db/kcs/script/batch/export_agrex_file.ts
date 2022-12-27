//===========================================================================
//機能：アグレックス用請求データ出力バッチ
//対象：コンビニ・銀行・郵便振込決済ファイル
//口座振替決済ファイル
//
//作成：前田
//更新履歴
//===========================================================================
//define("COMMON_LOG_DIR", "/kcs/data/log");
//define("AGREX_DIR", "/kcs/data/agrex/export");
//ヘッダーレコード行頭
//ヘッダーレコード行末（口座振替）
//ヘッダーレコード行末（払込）
//ヘッダーレコードカラム数
//明細レコード行頭
//明細レコード行末
//明細レコードカラム数
//エンドレコード行頭
//エンドレコード行末
//エンドレコードカラム数
//入金期限日
//委託者コード
//委託者区分
//口座番号桁数
//明細１行に表示する電話番号の数
//決済方法識別文字列
//決済方法識別文字列
//口座振替明細最大行数
//払込明細最大行数（圧着使用時１６行を想定）
//口座振替で表示する最大電話件数
//払込明細で表示する最大電話件数（圧着使用時を想定）
//請求または振替金額、合計、消費税の最大値
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//パラメータチェック
//処理開始をログ出力
//初期処理
//プロパティ種類
//half-numeric：半角数字
//half-alphameric：半角英数字
//half-kouza：半角カナ
//full-char：全角文字
//half-zero-left:半角０左埋め
//払込ＣＳＶファイルフォーマット
//口座振替ＣＳＶファイルフォーマット
//２重起動防止ロックをかける
//テーブルＮＯ取得
//利用年月を取得
//翌月の年月を取得
//ＳＱＬ実行
//内訳コードマスター
//請求書発行するための会社または個人情報を取得
//階層、決済方法、部署ＩＤ順でソート
//請求書発行する会社件数
//配下全ての部署ＩＤ格納用
//処理が済んだ部署ＩＤを格納用
//口座振替用出力ファイルバッファ
//払込用出力ファイルバッファ
//請求書発行するための会社または個人情報を１件ずつ処理する
//出力ファイル作成
//ファイルオープン
//口座振替ファイル出力
//バッファ出力
//払い込みファイル出力
//バッファ出力
//ファイルクローズ
//ロック解除
//処理終了をログ出力
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//clamptasl_tb にレコードを追加し２重起動を防止する
//[引　数] $is_lock： true：ロックする、false：ロック解除
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//利用月から対象のテーブル番号を取得する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された部署配下の部署IDを配列で返す
//
//[引　数] $postid：部署ＩＤ, $pactid：企業コード
//$tableno：post_relation_X_tbのXに入る数値(空文字列なら現在)
//[返り値] 部署IDの配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された部署配下の部署IDを配列で返す
//
//[引　数] &$data：検査するデータ
//$H_kisoku：検査項目の連想配列
//$postname:顧客会社名
//$kokyakucode:顧客コード
//$postid:システム部署ＩＤ
//[返り値] 部署IDの配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定年月の末日を返す
//
//[引　数] $year:年
//$month:月
//[返り値] 月末日
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//明細レコードのご利用期間行を返す
//
//[引　数] $useYear:年
//$useMonth:月
//$ordercode:受注コード
//$A_date:ご利用開始日
//[返り値] ご利用期間行
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//明細レコードの電話番号一覧行を返す
//
//[引　数] $ordercode:受注コード
//$telMax:最大電話件数
//$tableNo:対象テーブル番号
//$useYear:利用年
//$useMonth:利用月
//$A_followerPostid:配下の部署ＩＤリスト
//[返り値] 電話番号一覧行配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//明細レコードの請求情報明細行を返す
//
//[引　数] $ordercode:受注コード
//$H_bill:請求明細
//$H_utiwake:内訳種別マスター
//&$totalCharge:合計
//&$subTotalCharge:税抜き合計
//&$tax:消費税
//[返り値] 請求情報明細行配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//エンドレコードを返す
//
//[引　数] $ordercode:受注コード
//[返り値] エンドレコード
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//消費税込み合計金額、消費税抜き合計金額、消費税額が最大値を超えていないかチェック
//
//[引　数] $totalCharge:消費税込み合計金額
//$subTotalCharge:消費税抜き合計金額
//$tax:消費税額
//[返り値] true:チェックＯＫ、false:チェックＮＧ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

const DEBUG = 1;
const COMMON_LOG_DIR = DATA_LOG_DIR;
const AGREX_DIR = DATA_DIR + "/agrex/export";
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
const KOUFURI = "\u53E3\u5EA7\u632F\u66FF";
const HARAIKOMI = "\u6255\u8FBC";
const KOUFURI_MEISAI_MAX = 50;
const HARAIKOMI_MEISAI_MAX = 16;
const KOUFURI_TEL_MAX = 152;
const HARAIKOMI_TEL_MAX = 16;
const CHARGE_MAX = 999999999999;
var dbLogFile = COMMON_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);

if (_SERVER.argv.length != 2) {
	usage("");
} else //請求年月文字列チェック
	{
		var billdate = _SERVER.argv[1];

		if (ereg("^[0-9]{6}$", billdate) == false) {
			usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
		} else //年月チェック
			{
				var year = billdate.substr(0, 4);
				var month = billdate.substr(4, 2);

				if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
					usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
				}
			}
	}

print("\u30A2\u30B0\u30EC\u30C3\u30AF\u30B9\u7528\u8ACB\u6C42\u30C7\u30FC\u30BF\u4F5C\u6210\u958B\u59CB\n");
logh.putError(G_SCRIPT_BEGIN, "\u30A2\u30B0\u30EC\u30C3\u30AF\u30B9\u7528\u8ACB\u6C42\u30C7\u30FC\u30BF\u4F5C\u6210\u958B\u59CB");
var H_haraikomi = {
	telno: {
		MUST: "false",
		LENGTH: 15,
		PROPERTY: ["half-alphameric"],
		CAPTION: "\u9867\u5BA2\u96FB\u8A71\u756A\u53F7"
	},
	ptext3: {
		MUST: "true",
		LENGTH: 15,
		PROPERTY: ["half-alphameric"],
		CAPTION: "\u9867\u5BA2\u30B3\u30FC\u30C9"
	},
	ptext4: {
		MUST: "true",
		LENGTH: 30,
		PROPERTY: ["full-char"],
		CAPTION: "\u8ACB\u6C42\u66F8\u9001\u4ED8\u5148\u540D"
	},
	ptext5: {
		MUST: "false",
		LENGTH: 60,
		PROPERTY: ["full-char"],
		CAPTION: "\u8ACB\u6C42\u66F8\u9001\u4ED8\u5148\u90E8\u7F72"
	},
	ptext6: {
		MUST: "true",
		LENGTH: 7,
		PROPERTY: ["half-numeric"],
		CAPTION: "\u8ACB\u6C42\u66F8\u9001\u4ED8\u5148\u90F5\u4FBF\u756A\u53F7"
	},
	ptext7: {
		MUST: "true",
		LENGTH: 100,
		PROPERTY: ["full-char"],
		CAPTION: "\u8ACB\u6C42\u66F8\u9001\u4ED8\u5148\u4F4F\u6240"
	},
	ptext8: {
		MUST: "false",
		LENGTH: 10,
		PROPERTY: ["half-numeric"],
		CAPTION: "\u9867\u5BA2\u53E3\u5EA7\u756A\u53F7"
	},
	pdate1: {
		MUST: "true",
		CAPTION: "\u3054\u5229\u7528\u958B\u59CB\u65E5"
	}
};
var H_koufuri = {
	telno: {
		MUST: "false",
		LENGTH: 15,
		PROPERTY: ["half-alphameric"],
		CAPTION: "\u9867\u5BA2\u96FB\u8A71\u756A\u53F7"
	},
	ptext3: {
		MUST: "true",
		LENGTH: 14,
		PROPERTY: ["half-numeric"],
		CAPTION: "\u9867\u5BA2\u30B3\u30FC\u30C9"
	},
	ptext4: {
		MUST: "true",
		LENGTH: 30,
		PROPERTY: ["full-char"],
		CAPTION: "\u8ACB\u6C42\u66F8\u9001\u4ED8\u5148\u540D"
	},
	ptext5: {
		MUST: "false",
		LENGTH: 60,
		PROPERTY: ["full-char"],
		CAPTION: "\u8ACB\u6C42\u66F8\u9001\u4ED8\u5148\u90E8\u7F72"
	},
	ptext6: {
		MUST: "true",
		LENGTH: 7,
		PROPERTY: ["half-numeric"],
		CAPTION: "\u8ACB\u6C42\u66F8\u9001\u4ED8\u5148\u90F5\u4FBF\u756A\u53F7"
	},
	ptext7: {
		MUST: "true",
		LENGTH: 100,
		PROPERTY: ["full-char"],
		CAPTION: "\u8ACB\u6C42\u66F8\u9001\u4ED8\u5148\u4F4F\u6240"
	},
	ptext8: {
		MUST: "true",
		LENGTH: 7,
		PROPERTY: ["half-numeric", "half-zero-left"],
		CAPTION: "\u9867\u5BA2\u53E3\u5EA7\u756A\u53F7"
	},
	ptext9: {
		MUST: "true",
		LENGTH: 4,
		PROPERTY: ["half-numeric"],
		CAPTION: "\u9280\u884C\u30B3\u30FC\u30C9"
	},
	ptext10: {
		MUST: "true",
		LENGTH: 3,
		PROPERTY: ["half-numeric"],
		CAPTION: "\u652F\u5E97\u30B3\u30FC\u30C9"
	},
	ptext11: {
		MUST: "true",
		LENGTH: 1,
		PROPERTY: ["half-numeric"],
		CAPTION: "\u9810\u91D1\u7A2E\u5225"
	},
	ptext12: {
		MUST: "true",
		LENGTH: 30,
		PROPERTY: ["half-kouza"],
		CAPTION: "\u53E3\u5EA7\u540D\u7FA9"
	},
	pdate1: {
		MUST: "true",
		CAPTION: "\u3054\u5229\u7528\u958B\u59CB\u65E5"
	}
};
lock(true);
var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);

if (month > 1) {
	var useYear = year;

	if (month < 11) {
		var useMonth = "0" + (month - 1);
	} else {
		useMonth = month - 1;
	}
} else {
	useYear = year - 1;
	useMonth = 12;
}

if (month == 12) {
	var nextYear = year + 1;
	var nextMonth = 1;
} else {
	nextYear = year;
	nextMonth = month + 1;
}

if (nextMonth < 10) {
	nextMonth = "0" + nextMonth;
}

var sql = "select code,name from utiwake_tb where carid = " + CARID + " order by cast(code as integer)";
var H_result = dbh.getHash(sql);
var utiwakeCnt = H_result.length;

for (var cnt = 0; cnt < utiwakeCnt; cnt++) {
	H_utiwake[H_result[cnt].code] = H_result[cnt].name;
}

sql = "select po.postid,po.postname,po.telno,po.ptext1,po.ptext2,po.ptext3,po.ptext4,po.ptext5," + "po.ptext6,po.ptext7,po.ptext8,po.ptext9,po.ptext10,po.ptext11,po.ptext12," + "date(po.pdate1) as pdate1,date(po.pdate2) as pdate2 " + "from post_" + tableNo + "_tb po inner join post_relation_" + tableNo + "_tb pr " + "on po.pactid = pr.pactid and po.postid = pr.postidchild " + "where po.pactid = " + PACTID + " " + "and po.ptext1 in ('1','2') " + "order by pr.level,po.ptext2,po.postid";
H_result = dbh.getHash(sql);
var postCnt = H_result.length;
var A_postid = Array();
var A_postidDone = Array();
var A_koufuriBuff = Array();
var A_haraikomiBuff = Array();

for (cnt = 0;; cnt < postCnt; cnt++) //会社情報が正しく設定されているかどうか
//部署情報
//既に処理済の部署なら処理をスキップする（顧客の下の顧客で２重請求させないための処理）
//処理済部署ＩＤリストへ追加
//請求のある電話番号一覧を取得
//請求がある場合
{
	var chkflg = true;
	{
		let _tmp_0 = H_result[cnt];

		for (var key in _tmp_0) //キーが部署ＩＤ
		{
			var val = _tmp_0[key];

			if (key == "postid") //部署ＩＤを退避
				//部署ＩＤリストに追加
				{
					var postid = val;
					A_postid.push(val);
				} else //部署ＩＤをキー、部署情報を値とした配列につみなおす
				{
					H_postdata[postid][key] = val;
				}
		}
	}

	if (-1 !== A_postidDone.indexOf(postid) == true) {
		continue;
	}

	var A_followerPostid = getFollowerPost(PACTID, postid, tableNo);
	A_postidDone = array_merge(A_postidDone, A_followerPostid);
	sql = "select distinct td.telno " + "from tel_details_" + tableNo + "_tb td inner join tel_" + tableNo + "_tb te " + "on td.pactid = te.pactid and td.carid = te.carid and td.telno = te.telno " + "where td.pactid = " + PACTID + " " + "and td.carid = " + CARID + " " + "and te.postid in (" + A_followerPostid.join(",") + ")";
	var A_telresult = dbh.getCol(sql);

	if (A_telresult.length != 0) //請求があれば会社情報をチェック
		//口座振替
		{
			if (H_postdata[postid].ptext2 == KOUFURI) //配列のキーを１つずつ抜き取る
				//払い込み
				{
					for (var key of Object.values(Object.keys(H_postdata[postid]))) //データ規則がある
					{
						if (undefined !== H_koufuri[key] == true) //会社データに不備がある場合
							{
								if (chkData(H_postdata[postid][key], H_koufuri[key], H_postdata[postid].postname, H_postdata[postid].ptext3, postid) == false) {
									chkflg = false;
								}
							}
					}
				} else if (H_postdata[postid].ptext2 == HARAIKOMI) //配列のキーを１つずつ抜き取る
				//ご利用開始日を配列へ格納
				//ご利用開始年が利用年より大きい場合と年は同じだが月が大きい場合は処理をスキップする
				{
					for (var key of Object.values(Object.keys(H_postdata[postid]))) //データ規則がある
					{
						if (undefined !== H_haraikomi[key] == true) //会社データに不備がある場合
							{
								if (chkData(H_postdata[postid][key], H_haraikomi[key], H_postdata[postid].postname, H_postdata[postid].ptext3, postid) == false) {
									chkflg = false;
								}
							}
					}

					var A_useStartDate = split("-", H_postdata[postid].pdate1);

					if (useYear < A_useStartDate[0] || useYear == A_useStartDate[0] && useMonth < A_useStartDate[1]) {
						print("\u9867\u5BA2\u540D:" + H_postdata[postid].postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + H_postdata[postid].ptext3 + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u3054\u5229\u7528\u958B\u59CB\u65E5\u304C\u4E0D\u6B63\u306E\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
						logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + H_postdata[postid].postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + H_postdata[postid].ptext3 + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u3054\u5229\u7528\u958B\u59CB\u65E5\u304C\u4E0D\u6B63\u306E\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
						chkflg = false;
					}
				} else if (H_postdata[postid].ptext2 == "") {
				print("\u9867\u5BA2\u540D:" + H_postdata[postid].postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + H_postdata[postid].ptext3 + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306B\u6C7A\u6E08\u65B9\u6CD5\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + H_postdata[postid].postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + H_postdata[postid].ptext3 + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306B\u6C7A\u6E08\u65B9\u6CD5\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
				continue;
			}

			if (chkflg == true) //作業用配列
				//受注コード
				//合計、税抜き合計、消費税用変数を初期化
				//口座振替
				{
					var subTotalCharge, tax;
					sql = "select td.code,sum(td.charge) as charge,sum(td.realcnt) as realcnt " + "from tel_details_" + tableNo + "_tb td inner join tel_" + tableNo + "_tb te " + "on td.pactid = te.pactid and td.carid = te.carid and td.telno = te.telno " + "where td.pactid = " + PACTID + " " + "and td.carid = " + CARID + " " + "and te.postid in (" + A_followerPostid.join(",") + ") " + "group by td.code " + "order by cast(td.code as integer)";
					var H_billresult = dbh.getHash(sql);
					var A_tmpBuff = Array();
					var ordercode = useYear.substr(2) + useMonth + H_postdata[postid].ptext3;
					var totalCharge = subTotalCharge = tax = 0;

					if (H_postdata[postid].ptext2 == KOUFURI) //ヘッダーレコード作成
						//ご利用期間を作業用バッファに格納
						//ご利用電話番号を作業用バッファに格納
						//$A_tmpBuff = array_merge($A_tmpBuff,makeTelList($ordercode,$A_telresult,KOUFURI_TEL_MAX));
						//請求情報明細を作業用バッファに格納
						//明細行数をチェック
						//口座開始年月が設定されていない
						//ヘッダーレコードに新規コードを追加
						//出力用配列に格納
						//作業用配列を出力用配列にマージ
						//エンドレコードを出力用配列に格納
						//払い込み
						{
							var header = HEADER_HEAD + ordercode + DELIM + ITAKU_CODE + DELIM + ITAKU_KUBUN + DELIM + H_postdata[postid].ptext3 + DELIM + H_postdata[postid].ptext6 + DELIM + H_postdata[postid].ptext7 + DELIM + DELIM + DELIM + H_postdata[postid].ptext5 + DELIM + H_postdata[postid].ptext4 + DELIM + DELIM + H_postdata[postid].telno + DELIM + H_postdata[postid].ptext8 + DELIM + DELIM + DELIM;
							A_tmpBuff.push(makeDateSpan(useYear, useMonth, ordercode, H_postdata[postid].pdate1));
							A_tmpBuff = array_merge(A_tmpBuff, makeTelList(ordercode, KOUFURI_TEL_MAX, tableNo, useYear, useMonth, A_followerPostid));
							A_tmpBuff = array_merge(A_tmpBuff, makeBill(ordercode, H_billresult, H_utiwake, totalCharge, subTotalCharge, tax));

							if (A_tmpBuff.length > KOUFURI_MEISAI_MAX) {
								print("\u9867\u5BA2\u540D:" + H_postdata[postid].postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + H_postdata[postid].ptext3 + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u53E3\u5EA7\u632F\u66FF\u660E\u7D30\u884C\u6570\u304C\u30AA\u30FC\u30D0\u30FC\u3057\u305F\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
								logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + H_postdata[postid].postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + H_postdata[postid].ptext3 + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u53E3\u5EA7\u632F\u66FF\u660E\u7D30\u884C\u6570\u304C\u30AA\u30FC\u30D0\u30FC\u3057\u305F\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
								continue;
							}

							if (chkBill(H_postdata[postid].postname, H_postdata[postid].ptext3, postid, totalCharge, subTotalCharge, tax) == false) {
								continue;
							}

							if (H_postdata[postid].ptext11 != 1 && H_postdata[postid].ptext11 != 2) {
								print("\u9867\u5BA2\u540D:" + H_postdata[postid].postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + H_postdata[postid].ptext3 + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u9810\u91D1\u7A2E\u5225\u304C\u4E0D\u6B63\u306E\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
								logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + H_postdata[postid].postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + H_postdata[postid].ptext3 + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u9810\u91D1\u7A2E\u5225\u304C\u4E0D\u6B63\u306E\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
								continue;
							}

							header += totalCharge + DELIM + subTotalCharge + DELIM + tax + DELIM + H_postdata[postid].ptext9 + DELIM + H_postdata[postid].ptext10 + DELIM + H_postdata[postid].ptext11 + DELIM + H_postdata[postid].ptext12 + DELIM;

							if (H_postdata[postid].pdate2 == "") //口座開始年月が設定されている
								{
									var newAccount = 2;
								} else //当月以前
								{
									var A_date = split("-", H_postdata[postid].pdate2);

									if (year > A_date[0] || year == A_date[0] && month >= A_date[1]) //来月
										{
											newAccount = 2;
										} else {
										newAccount = 1;
									}
								}

							header += newAccount + HEADER_TAIL_KOUFURI;
							A_koufuriBuff.push(header);
							A_koufuriBuff = array_merge(A_koufuriBuff, A_tmpBuff);
							A_koufuriBuff.push(makeEnd(ordercode));
						} else if (H_postdata[postid].ptext2 == HARAIKOMI) //ヘッダーレコード作成
						//ご利用期間を作業用バッファに格納
						//ご利用電話番号を作業用バッファに格納
						//$A_tmpBuff = array_merge($A_tmpBuff,makeTelList($ordercode,$A_telresult,HARAIKOMI_TEL_MAX));
						//請求情報明細を作業用バッファに格納
						//明細行数をチェック
						//出力用配列に格納
						//作業用配列を出力用配列にマージ
						//エンドレコードを出力用配列に格納
						{
							header = HEADER_HEAD + ordercode + DELIM + H_postdata[postid].ptext3 + DELIM + H_postdata[postid].ptext6 + DELIM + H_postdata[postid].ptext7 + DELIM + DELIM + DELIM + H_postdata[postid].ptext5 + DELIM + H_postdata[postid].ptext4 + DELIM + DELIM + H_postdata[postid].telno + DELIM + H_postdata[postid].ptext8 + DELIM + DELIM + nextYear + nextMonth + NYUKIN_DAY + DELIM + DELIM + DELIM + DELIM + DELIM + DELIM + DELIM;
							A_tmpBuff.push(makeDateSpan(useYear, useMonth, ordercode, A_useStartDate));
							A_tmpBuff = array_merge(A_tmpBuff, makeTelList(ordercode, HARAIKOMI_TEL_MAX, tableNo, useYear, useMonth, A_followerPostid));
							A_tmpBuff = array_merge(A_tmpBuff, makeBill(ordercode, H_billresult, H_utiwake, totalCharge, subTotalCharge, tax));

							if (A_tmpBuff.length > HARAIKOMI_MEISAI_MAX) {
								print("\u9867\u5BA2\u540D:" + H_postdata[postid].postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + H_postdata[postid].ptext3 + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u6255\u8FBC\u660E\u7D30\u884C\u6570\u304C\u30AA\u30FC\u30D0\u30FC\u3057\u305F\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
								logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + H_postdata[postid].postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + H_postdata[postid].ptext3 + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u6255\u8FBC\u660E\u7D30\u884C\u6570\u304C\u30AA\u30FC\u30D0\u30FC\u3057\u305F\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
								continue;
							}

							if (chkBill(H_postdata[postid].postname, H_postdata[postid].ptext3, postid, totalCharge, subTotalCharge, tax) == false) {
								continue;
							}

							header += totalCharge + DELIM + subTotalCharge + DELIM + tax + HEADER_TAIL_HARAIKOMI;
							A_haraikomiBuff.push(header);
							A_haraikomiBuff = array_merge(A_haraikomiBuff, A_tmpBuff);
							A_haraikomiBuff.push(makeEnd(ordercode));
						}
				}
		}
}

var koufuriFile = AGREX_DIR + "/250001" + year + month + "01f.csv";
var haraikomiFile = AGREX_DIR + "/250001" + year + month + "01.csv";
var fp_koufuri = fopen(koufuriFile, "w");
var fp_haraikomi = fopen(haraikomiFile, "w");

for (var value of Object.values(A_koufuriBuff)) {
	fwrite(fp_koufuri, mb_convert_encoding(value, "SJIS-win", "UTF-8"));
}

fflush(fp_koufuri);

for (var value of Object.values(A_haraikomiBuff)) {
	fwrite(fp_haraikomi, mb_convert_encoding(value, "SJIS-win", "UTF-8"));
}

fflush(fp_haraikomi);
fclose(fp_koufuri);
fclose(fp_haraikomi);
lock(false);
print("\u30A2\u30B0\u30EC\u30C3\u30AF\u30B9\u7528\u8ACB\u6C42\u30C7\u30FC\u30BF\u4F5C\u6210\u7D42\u4E86\n");
logh.putError(G_SCRIPT_END, "\u30A2\u30B0\u30EC\u30C3\u30AF\u30B9\u7528\u8ACB\u6C42\u30C7\u30FC\u30BF\u4F5C\u6210\u7D42\u4E86");
throw die(0);

function usage(comment) {
	if (!("dbh" in global)) dbh = undefined;

	if (comment == "") {
		comment = "\u8ACB\u6C42\u5E74\u6708\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + SCRIPTNAME + " \u8ACB\u6C42\u5E74\u6708(YYYYMM)\n\n");
	dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw die(1);
};

function lock(is_lock) //ロックする
{
	if (!("dbh" in global)) dbh = undefined;
	var pre = "batch";
	var now = getTimestamp();

	if (is_lock == true) //既に起動中
		//ロック解除
		{
			dbh.begin();
			dbh.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
			var count = dbh.getOne(sql);

			if (count != 0) {
				dbh.rollback();
				print("\n\u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n\n");
				dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + "\u591A\u91CD\u52D5\u4F5C");
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
	var tm = localtime(Date.now() / 1000, true);
	var yyyy = tm.tm_year + 1900;
	var mm = tm.tm_mon + 1;
	if (mm < 10) mm = "0" + mm;
	var dd = tm.tm_mday + 0;
	if (dd < 10) dd = "0" + dd;
	var hh = tm.tm_hour + 0;
	if (hh < 10) hh = "0" + hh;
	var nn = tm.tm_min + 0;
	if (nn < 10) nn = "0" + nn;
	var ss = tm.tm_sec + 0;
	if (ss < 10) ss = "0" + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};

function getTableNo(currentYear, currentMonth, targetYear, targetMonth) //１年以内は利用月をそのまま返す（０補完）
{
	var calc = 12 * (currentYear - targetYear) + currentMonth - targetMonth;

	if (calc < 12) //２年以上前は空文字を返す
		{
			var tableNo = targetMonth;
		} else if (calc > 23) {
		tableNo = "";
	} else {
		tableNo = targetMonth + 12;
	}

	return tableNo;
};

function getFollowerPost(pactid, postid, tableNo = "") //pactid か postid が空の場合は空の配列を返す
//テーブルＮＯが無い場合は現在
//指定された部署が見つかったかどうか true：見つかった、false：見つかっていない
{
	if (!("dbh" in global)) dbh = undefined;

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
	var H_return = dbh.getHash(sql);
	var H_postid = Array();
	var A_postid_list = Array();
	var target_find = false;

	for (var cnt = 0; cnt < H_return.length; cnt++) //指定された部署が見つかっていない場合
	{
		var level = H_return[cnt].level;
		var parentid = H_return[cnt].postidparent;
		var childid = H_return[cnt].postidchild;

		if (target_find == false) //指定された部署が見つかった場合の処理
			{
				if (postid == childid) //指定された部署の階層
					{
						var target_level = level;
						H_postid[childid] = true;
						A_postid_list.push(childid);
						target_find = true;
					}
			} else //指定された部署配下
			{
				if (target_level < level) {
					if (undefined !== H_postid[parentid] && H_postid[parentid] == true) {
						H_postid[childid] = true;
						A_postid_list.push(childid);
					}
				}
			}
	}

	delete H_postid;
	return A_postid_list;
};

function chkData(data, H_kisoku, postname, kokyakucode, postid) {
	if (!("logh" in global)) logh = undefined;
	var chkflg = true;

	for (var key in H_kisoku) //必須項目なのに値が設定されていない場合
	{
		var val = H_kisoku[key];

		if (key == "MUST" && val == "true" && data == "") //桁数チェック
			{
				print("\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u306B\u5024\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u306B\u5024\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
				chkflg = false;
			} else if (key == "LENGTH") //全角文字のみ指定がある場合
			//半角０左埋め指定がある場合
			{
				if (-1 !== H_kisoku.PROPERTY.indexOf("full-char") == true) //文字数、ＳＪＩＳ変換後のバイト数、半角文字の混在をチェック
					{
						if (mb_strlen(data) > val / 2 || mb_convert_encoding(data, "SJIS-win", "UTF-8").length > val || mb_strlen(data) * 2 != mb_convert_encoding(data, "SJIS-win", "UTF-8").length) {
							print("\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u304C\u5168\u89D2\u6587\u5B57" + val / 2 + "\u6587\u5B57\u4EE5\u5185\u3067\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
							logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u304C\u5168\u89D2\u6587\u5B57" + val / 2 + "\u6587\u5B57\u4EE5\u5185\u3067\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
							chkflg = false;
						}
					} else if (-1 !== H_kisoku.PROPERTY.indexOf("half-numeric") == true) //文字数、全角文字の混在チェック、数字以外の混在チェック
					{
						if (mb_strlen(data) > val || mb_strlen(data) != data.length || ereg("[^0-9]", data) == true) {
							print("\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u304C\u534A\u89D2\u6570\u5B57" + val + "\u6587\u5B57\u4EE5\u5185\u3067\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
							logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u304C\u534A\u89D2\u6570\u5B57" + val + "\u6587\u5B57\u4EE5\u5185\u3067\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
							chkflg = false;
						}
					} else if (-1 !== H_kisoku.PROPERTY.indexOf("half-kouza") == true) //文字数、ＳＪＩＳ変換後のバイト数、半角カナ以外の混在をチェック
					{
						if (mb_strlen(data) > val || mb_strlen(data) != mb_convert_encoding(data, "SJIS-win", "UTF-8").length || preg_match("/[^A-Z0-9\uFF71\uFF72\uFF73\uFF74\uFF75\uFF76\uFF77\uFF78\uFF79\uFF7A\uFF7B\uFF7C\uFF7D\uFF7E\uFF7F\uFF80\uFF81\uFF82\uFF83\uFF84\uFF85\uFF86\uFF87\uFF88\uFF89\uFF8A\uFF8B\uFF8C\uFF8D\uFF8E\uFF8F\uFF90\uFF91\uFF92\uFF93\uFF94\uFF95\uFF96\uFF97\uFF98\uFF99\uFF9A\uFF9B\uFF9C\uFF9D.()-\uFF9E\uFF9F]/", data) == true) {
							print("\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u304C\u534A\u89D2\u6587\u5B57\uFF08\u6570\u5B57\u3001\u5927\u6587\u5B57\u30A2\u30EB\u30D5\u30A1\u30D9\u30C3\u30C8\u3001\u30F2\u3092\u9664\u304F\u5927\u6587\u5B57\u30AB\u30BF\u30AB\u30CA\u3001\u30D4\u30EA\u30AA\u30C9\u3001\u62EC\u5F27\u3001\u30CF\u30A4\u30D5\u30F3\u3001\u6FC1\u70B9\u3001\u534A\u6FC1\u70B9\uFF09" + val + "\u6587\u5B57\u4EE5\u5185\u3067\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
							logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u304C\u534A\u89D2\u6587\u5B57\uFF08\u6570\u5B57\u3001\u5927\u6587\u5B57\u30A2\u30EB\u30D5\u30A1\u30D9\u30C3\u30C8\u3001\u30F2\u3092\u9664\u304F\u5927\u6587\u5B57\u30AB\u30BF\u30AB\u30CA\u3001\u30D4\u30EA\u30AA\u30C9\u3001\u62EC\u5F27\u3001\u30CF\u30A4\u30D5\u30F3\u3001\u6FC1\u70B9\u3001\u534A\u6FC1\u70B9\uFF09" + val + "\u6587\u5B57\u4EE5\u5185\u3067\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
							chkflg = false;
						}

						if (ereg("[a-z]", data) == true) {
							print("\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u304C\u534A\u89D2\u6587\u5B57\uFF08\u6570\u5B57\u3001\u5927\u6587\u5B57\u30A2\u30EB\u30D5\u30A1\u30D9\u30C3\u30C8\u3001\u30F2\u3092\u9664\u304F\u5927\u6587\u5B57\u30AB\u30BF\u30AB\u30CA\u3001\u30D4\u30EA\u30AA\u30C9\u3001\u62EC\u5F27\u3001\u30CF\u30A4\u30D5\u30F3\u3001\u6FC1\u70B9\u3001\u534A\u6FC1\u70B9\uFF09" + val + "\u6587\u5B57\u4EE5\u5185\u3067\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
							logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u304C\u534A\u89D2\u6587\u5B57\uFF08\u6570\u5B57\u3001\u5927\u6587\u5B57\u30A2\u30EB\u30D5\u30A1\u30D9\u30C3\u30C8\u3001\u30F2\u3092\u9664\u304F\u5927\u6587\u5B57\u30AB\u30BF\u30AB\u30CA\u3001\u30D4\u30EA\u30AA\u30C9\u3001\u62EC\u5F27\u3001\u30CF\u30A4\u30D5\u30F3\u3001\u6FC1\u70B9\u3001\u534A\u6FC1\u70B9\uFF09" + val + "\u6587\u5B57\u4EE5\u5185\u3067\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
							chkflg = false;
						}
					} else //文字数、全角文字の混在をチェック
					{
						if (mb_strlen(data) > val || mb_strlen(data) != data.length) {
							print("\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u304C\u534A\u89D2\u6587\u5B57" + val + "\u6587\u5B57\u4EE5\u5185\u3067\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
							logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E" + H_kisoku.CAPTION + "\u304C\u534A\u89D2\u6587\u5B57" + val + "\u6587\u5B57\u4EE5\u5185\u3067\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
							chkflg = false;
						}
					}

				if (-1 !== H_kisoku.PROPERTY.indexOf("half-zero-left") == true) //実データ文字数を取得
					//実データ文字数が指定文字数に満たない場合
					{
						var length = data.length;

						if (length < val) //不足文字数分０を追加する
							//実データに０を追加
							{
								var addstr = "";

								for (var cnt = 0; cnt < val - length; cnt++) {
									addstr += "0";
								}

								data = addstr + data;
							}
					}
			}
	}

	return chkflg;
};

function getMonthEnd(year, month) //４年で割り切れれば閏年
//末日３０日
{
	if (year % 4 == 0) //１００年で割り切れれば閏年ではない
		{
			var leapYearFlg = true;

			if (year % 100 == 0) {
				leapYearFlg = false;
			}

			if (year % 2000 == 0) {
				leapYearFlg = true;
			}
		} else {
		leapYearFlg = false;
	}

	if (month == 4 || month == 6 || month == 9 || month == 11) //２月
		{
			return "30";
		} else if (month == 2) //末日３１日
		{
			if (leapYearFlg == true) {
				return "29";
			} else {
				return "28";
			}
		} else {
		return "31";
	}
};

function makeDateSpan(useYear, useMonth, ordercode, A_date) //ご利用期間
//利用開始日が利用年月より前なら利用期間開始日を１日にする
{
	var meisai = MEISAI_HEAD + ordercode + DELIM + DELIM + "\u3054\u5229\u7528\u671F\u9593 ";

	if (useYear > A_date[0] || useYear == A_date[0] && useMonth > A_date[1]) //利用開始日が利用年月より後なら利用期間開始日を利用開始日から取得日する
		{
			var dateSpan = useYear + "\u5E74" + useMonth + "\u670801\u65E5 - " + useYear + "\u5E74" + useMonth + "\u6708" + getMonthEnd(useYear, useMonth) + "\u65E5";
		} else {
		dateSpan = useYear + "\u5E74" + useMonth + "\u6708" + A_date[2] + "\u65E5 - " + useYear + "\u5E74" + useMonth + "\u6708" + getMonthEnd(useYear, useMonth) + "\u65E5";
	}

	meisai += dateSpan + DELIM + DELIM + MEISAI_TAIL;
	return meisai;
};

function makeTelList(ordercode, telMax, tableNo, useYear, useMonth, A_followerPostid) //バッファ
//ご利用開始日がご利用年月以前、かつご利用停止フラグがたっていない電話番号一覧を取得
//配下の部署全て
//ご利用電話番号
//電話件数が最大電話件数より大きかった場合
//最終行の処理
{
	var roopCnt;
	if (!("dbh" in global)) dbh = undefined;
	var A_buff = Array();
	var meisai = "";
	var sql = "select telno " + "from tel_" + tableNo + "_tb " + "where pactid = " + PACTID + " " + "and carid = " + CARID + " " + "and (text8 is null or  text8 != '1') " + "and date(date1) <= '" + useYear + "-" + useMonth + "-" + getMonthEnd(useYear, useMonth) + "' " + "and postid in (" + A_followerPostid.join(",") + ")";
	var A_tel = dbh.getCol(sql);
	var telCnt = roopCnt = A_tel.length;

	if (telCnt > telMax) {
		roopCnt = telMax;
	}

	for (var cnt = 0; cnt < roopCnt; cnt++) //１件目の処理（電話番号は１行４件まで）
	{
		if ((cnt + 1) % MEISAI_TEL_CNT == 1) //１行４件になったら改行処理
			{
				meisai = MEISAI_HEAD + ordercode + DELIM + DELIM + "\u3054\u5229\u7528\u96FB\u8A71\u756A\u53F7 " + A_tel[cnt];
			} else if ((cnt + 1) % MEISAI_TEL_CNT == 0) //電話の最大値に達した場合
			//作業用バッファに格納
			//電話番号を追記
			{
				meisai += " " + A_tel[cnt];

				if (cnt == telMax - 1) {
					meisai += "\u30FB\u30FB\u30FB";
				}

				if ((cnt + 1) / MEISAI_TEL_CNT == 1) //２行目以降は電話件数は出力しない
					{
						meisai += "," + telCnt + DELIM + MEISAI_TAIL;
					} else {
					meisai += DELIM + DELIM + MEISAI_TAIL;
				}

				A_buff.push(meisai);
				meisai = "";
			} else {
			meisai += " " + A_tel[cnt];
		}
	}

	if (meisai != "") //電話番号が３件以下の場合は電話件数を追加
		//作業用バッファに格納
		{
			if (telCnt < 4) //電話番号が５件以上で１行に電話が４件無い場合
				{
					meisai += "," + telCnt + DELIM + MEISAI_TAIL;
				} else {
				meisai += DELIM + DELIM + MEISAI_TAIL;
			}

			A_buff.push(meisai);
		}

	return A_buff;
};

function makeBill(ordercode, H_bill, H_utiwake, totalCharge, subTotalCharge, tax) //バッファ
//請求件数
//請求情報を1件ずつ処理
{
	var A_buff = Array();
	var billCnt = H_bill.length;

	for (var cnt = 0; cnt < billCnt; cnt++) //作業用バッファに格納
	//コードが消費税
	//合計
	{
		var meisai = MEISAI_HEAD + ordercode + DELIM + DELIM + H_utiwake[H_bill[cnt].code] + DELIM + H_bill[cnt].realcnt + DELIM + H_bill[cnt].charge + MEISAI_TAIL;
		A_buff.push(meisai);

		if (H_bill[cnt].code == TAXCODE) //コードが消費税以外
			{
				tax = H_bill[cnt].charge;
			} else //税抜き合計
			{
				subTotalCharge += H_bill[cnt].charge;
			}

		totalCharge += H_bill[cnt].charge;
	}

	return A_buff;
};

function makeEnd(ordercode) //エンドレコード作成
{
	var end = END_HEAD + ordercode + END_TAIL;
	return end;
};

function chkBill(postname, kokyakucode, postid, totalCharge, subTotalCharge, tax) //消費税込み合計金額をチェック
{
	if (!("logh" in global)) logh = undefined;
	var chkFlg = true;

	if (totalCharge > CHARGE_MAX) {
		print("\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u6D88\u8CBB\u7A0E\u8FBC\u307F\u5408\u8A08\u91D1\u984D\u304C\u6700\u5927\u5024\u3092\u30AA\u30FC\u30D0\u30FC\u3057\u305F\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u6D88\u8CBB\u7A0E\u8FBC\u307F\u5408\u8A08\u91D1\u984D\u304C\u6700\u5927\u5024\u3092\u30AA\u30FC\u30D0\u30FC\u3057\u305F\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
		chkFlg = false;
	}

	if (subTotalCharge > CHARGE_MAX) {
		print("\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u6D88\u8CBB\u7A0E\u629C\u304D\u5408\u8A08\u91D1\u984D\u304C\u6700\u5927\u5024\u3092\u30AA\u30FC\u30D0\u30FC\u3057\u305F\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u6D88\u8CBB\u7A0E\u629C\u304D\u5408\u8A08\u91D1\u984D\u304C\u6700\u5927\u5024\u3092\u30AA\u30FC\u30D0\u30FC\u3057\u305F\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
		chkFlg = false;
	}

	if (tax > CHARGE_MAX) {
		print("\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u6D88\u8CBB\u7A0E\u984D\u304C\u6700\u5927\u5024\u3092\u30AA\u30FC\u30D0\u30FC\u3057\u305F\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n");
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "\u9867\u5BA2\u540D:" + postname + ",\u9867\u5BA2\u30B3\u30FC\u30C9:" + kokyakucode + ",\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72\uFF29\uFF24:" + postid + "\u306E\u6D88\u8CBB\u7A0E\u984D\u304C\u6700\u5927\u5024\u3092\u30AA\u30FC\u30D0\u30FC\u3057\u305F\u70BA\u3001\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059");
		chkFlg = false;
	}

	return chkFlg;
};