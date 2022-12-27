///////////////////////////////////////////////////////
//機能：電話管理　予約処理バッチ
//作成：2006/09/26　石崎
//2007/06/12 宝子山　管理記録に成り代わりフラグを記録
//2007/06/20 石崎	対象部署を検索後、部署が存在しなかった場合の対応を修正
//2007/07/17 石崎	in_array 第三引数にtrue を追加（2箇所）型チェックをするようになる
//
//デバッグ中1 本番0
//
//本番用
//編集データベース用　定数
//以下２つの定義は共通設定から取得するようにした
//define("G_MAIL_TYPE", "（Try環境）");
//define("G_SMTP_HOST", "192.168.1.197");
//以下の２つが ../../conf/common.conf に定義されている
//define("G_MAIL_TYPE", "本番環境(代官山)");//メール送信元ファセット
//define("G_SMTP_HOST", "localhost");//メール送信先
//カレントディレクトリ変更
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//予約日のデータ格納用ハッシュ
//tel_tb からのデータ受け取り
//データベースからの結果を取得
//電話管理記録に残すコメント用
//電話管理記録に残す作業タイプ
//処理中の電話データをtel_tb内の電話データから存在を確認するための比較用変数
//tel_tb から抜き出した値を検索用に整形したものを格納 pactid - telno - carid
//tel_reserve_tb から抜き出した値を $this_tel と比較するために整形したもの
//DBへの操作タイプ INSERT UPDATE
//実際処理した件数
//新規予約
//新規予約でも、手動で移動させられていたもの
//変更予約
//変更予約実行時に、既に手動で削除をされていて、tel_tb に存在しない電話
//新規予約時、対象部署が存在しないとき
//エラーログのテキスト格納用
//
//初期化完了
//
//プログラム開始ログ
//予約データ取得用SQL 実行日の予約情報を全て引き出します。
//本番
//予約件数
//error_log_textが空ではない場合は、今回の実行で出力された
//エラーログをメールする
//機能：SQL用に値を初期化する
//備考：空データにNULL、文字列をシングルクオートで囲う 数値は編集なし（空はNULLへ）
//引数：処理対象の変数 処理タイプ
//戻値：整形処理後のデータを返す
//2006/09/28 石崎
//機能：tel_reserve_tb の予約フラグを変更する
//引数：DBハンドル、ログハンドル、登録者のpactid、登録者のpostid、
//変更する電話情報（pactid postid telno）、変更フラグ、実行日、予約日、予約登録日時
//戻値：tel_reserve_tb への予約フラグアップデートの件数が1の時に true それ以外は全て false
//2006/09/28 石崎
//機能：予約実行の結果を telmnglog_tb へ書き込む
//引数：DBハンドル、logハンドル
//pactid, 予約実行者のpostid, 予約実行者のuserid, 予約実行者の名前, 対象電話番号,
//実行内容, 対象電話のpostid, 実行種類（追加、変更、対象なし）, 実行日, 対象電話のpactid,
//対象電話のpostid, 対象電話のcarid
//戻値：telmnglog_tb へのログ書き込み時に、INSERTエラーが出なかった場合はtrue でたら全てfalse
//2006/09/28 石崎
//function setTelmnglog($dbhx,$loghx,$pactx,$postx,$useridx,$namex,$postnamex,$telnox,$commentx,$telpostidx,$typex,$recdatex,$telpactidx,$telpostidx,$caridx){
//機能：予約処理のUPDATE送信用関数（新規予約で手動登録済み or 変更予約）
//引数：DBハンドル LOGハンドル 処理中の予約データハッシュ 現在処理中の番号
//管理記録のコメント欄に記載する文字列（新規予約登録（実行）or変更予約登録（実行））
//現在までのアップデート件数 現在までの0件アップデート件数（省略可）
//現在のレコード処理開始時間
//戻値：boolean アップデートカウント アップデート済みだった場合のカウント エラーログ
//booleanは、tel_tb、tel_reserve_tb、telmnglog_tb 全ての書き込みに以上がない場合のみtrue
//tel_tb は アップデートが 0or1 ならば正常
//tel_reserve_tb は changeReserveState() 参照
//telmnglog_tb は setTelmnglog() 参照
//2006/10/04 石崎

require("lib/script_common.php");

const DEBUG = 1;

require("Mail.php");

require(BAT_DIR + "/lib/script_db.php");

const TELRES_TB = "tel_reserve_tb";
const TEL_TB = "tel_tb";
const TELMNG_TB = "telmnglog_tb";
const SUMI = 1;
const NASI = 2;
error_reporting(E_ALL);
chdir(BAT_DIR);
var dbLogFile = G_LOG + "/tel_reserve_batch" + date("Ym") + ".log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var H_reserve = Array();
var H_get_tel = Array();
var result = "";
var setcomment = "";
var settype = "";
var this_tel = "";
var reserve_tel = "";
var db_access_type = "";
var insert_c = 0;
var insert_update_c = 0;
var update_c = 0;
var update_0_c = 0;
var insert_no_post = 0;
if (!("G_error_log_text" in global)) G_error_log_text = undefined;
G_error_log_text = "";
logh.putError(G_SCRIPT_BEGIN, "start://tel_reserve_batch/");
print("====================\u30D7\u30ED\u30B0\u30E9\u30E0\u3092\u958B\u59CB\u3057\u307E\u3059=============================" + date("Y-m-d H:i:s") + "\n\n");
var today_str = date("Y-m-d");
var sqlstr = "SELECT * from tel_reserve_tb where reserve_date <= '" + today_str + "' AND exe_state = 0 AND add_edit_flg in (0,1) order by reserve_date, add_edit_flg";
logh.putError(G_SCRIPT_INFO, "run://tel_reserve_tb\u691C\u7D22/");
print("*               tel_reserve_tb\u3092\u691C\u7D22\u3057\u307E\u3057\u305F               *" + date("Y-m-d H:i:s") + "\n\n");
H_reserve = dbh.getHash(sqlstr);
var reserve_count = H_reserve.length;

if (reserve_count == 0) //実行日に予約が一件も無かった場合の処理
	{
		logh.putError(G_SCRIPT_INFO, "run://tel_reserve_tb\u691C\u7D22/\u8A72\u5F53\u30EC\u30B3\u30FC\u30C9\u7121\u3057/");
		print("*               tel_reserve_tb\u306B\u672C\u65E5\u4EE5\u524D\u306E\u672A\u5B9F\u884C\u306E\u4E88\u7D04\u306F\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F               *" + date("Y-m-d H:i:s") + "\n\n");
	} else //予約が一件以上あった場合の処理
	//tel_tb に予約内容と同じ電話が設定されているか確認するためのSQL
	//tel_tb から受け取る pactid telno carid をハイフンでつないだ要素を持つ配列を作成
	//その配列
	//tel_tbのレコード件数
	//新規予約を登録する際に、所属部署が存在しているかのチェック
	//post_tbから受け取った値を配列に格納する
	{
		logh.putError(G_SCRIPT_INFO, "run://tel_reserve_tb\u691C\u7D22/\u8A72\u5F53\u30EC\u30B3\u30FC\u30C9\uFF1A" + reserve_count + "\u4EF6/");
		print("*               tel_reserve_tb\u306B\u672C\u65E5\u4EE5\u524D\u306E\u672A\u5B9F\u884C\u306E\u4E88\u7D04\u306F" + reserve_count + "\u4EF6\u3042\u308A\u307E\u3057\u305F               *" + date("Y-m-d H:i:s") + "\n\n");
		var get_tel_sql = "SELECT pactid, telno, carid from tel_tb";
		logh.putError(G_SCRIPT_INFO, "run://tel_tb\u691C\u7D22/");
		print("*               tel_tb\u3092\u691C\u7D22\uFF1A\u96FB\u8A71\u60C5\u5831\u3092\u53D6\u5F97\u3057\u307E\u3059               *" + date("Y-m-d H:i:s") + "\n\n");
		H_get_tel = dbh.getHash(get_tel_sql);
		var A_pact_tel_car = Array();
		var tel_tb_count = H_get_tel.length;

		for (var array_make_count = 0; array_make_count < tel_tb_count; array_make_count++) {
			A_pact_tel_car[array_make_count] = H_get_tel[array_make_count].pactid + "-" + H_get_tel[array_make_count].telno + "-" + H_get_tel[array_make_count].carid;
		}

		var get_post_sql = "select pactid || '-' || postid as pactpost from post_tb";
		logh.putError(G_SCRIPT_INFO, "run://post_tb\u691C\u7D22/");
		print("*               post_tb\u3092\u691C\u7D22\uFF1A\u90E8\u7F72\u60C5\u5831\u3092\u53D6\u5F97\u3057\u307E\u3059               *" + date("Y-m-d H:i:s") + "\n\n");
		var H_get_post = dbh.getHash(get_post_sql);
		var A_all_post = Array();
		var post_tb_count = H_get_post.length;

		for (var post_cnt = 0; post_cnt < post_tb_count; post_cnt++) {
			A_all_post[post_cnt] = H_get_post[post_cnt].pactpost;
		}

		for (var Hcount = 0; Hcount < reserve_count; Hcount++) //予約件数の全件処理
		//escape
		//トランザクション開始
		//現在時刻の取得
		//処理中の $H_reserve を整形
		//telno は文字列なので、前後にクオート追加
		//telno_view は文字列なので、前後にクオート追加
		//userid 空の場合は null を代入
		//machine は文字列なので、前後にクオート追加 NOT NULL でもないので、空文字の場合は NULL に
		//color は文字列なので、前後にクオート追加 NOT NULL でも無いので、空文字の場合は NULL に
		//planid は NOT NULL ではないので、空の場合はNULL を代入する
		//packetid は NOT NULL ではないので、空の場合はNULL を代入する
		//pointstage は NUT NULL ではないので
		//employeecode は文字列かつ NOT NULL ではないので・・・
		//username は文字列かつ NOT NULLではない
		//mail は文字列かつ NOT NULLではない
		//orderdate は Timestamp型 NOT NULLではない
		//text1-15 の処理
		//int1-3 の処理
		//date 1-2 処理
		//memo 文字列かつ NOT NULL ではない
		//recdatex Timestamp
		//fixdate Timestamp型reserve_date
		//options 文字型 NOT NULL ではない
		//contractdate Timestamp型 NOT NULL ではない
		//kousiflg 文字列 NOT NULL ではない
		//kousiptn NOT NULL ではない
		//username_kana 文字列　NOT NULL ではない
		//reserve_date Timestamp型 NOT NULL ではない
		//joker_flag integer型 NOT NULL ではない
		//新規登録の予約の場合 add_edit_flg == 0
		{
			{
				let _tmp_0 = H_reserve[Hcount];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];
					H_reserve[Hcount][key] = dbh.escape(val);
				}
			}
			dbh.begin();
			logh.putError(G_SCRIPT_INFO, "run://\u4E88\u7D04\u51E6\u7406\uFF1A" + (Hcount + 1) + "\u4EF6\u76EE/");
			print("*               \u4E88\u7D04\u51E6\u7406\uFF1A" + (Hcount + 1) + "\u4EF6\u76EE               *" + date("Y-m-d H:i:s") + "\n\n\n");
			var now_time = "'" + date("Y-m-d H:i:s") + "'";
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

			for (cnt = 1;; cnt <= 3; cnt++) {
				H_reserve[Hcount]["int" + cnt] = formatValueToSQL(H_reserve[Hcount]["int" + cnt], "num");
			}

			for (cnt = 1;; cnt <= 2; cnt++) {
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
				//予約された電話の固有値 pactid - telno - carid この値はユニーク
				//予約された電話の pactid と post をハイフンでつないだ値
				//予約された電話の所属部署が存在する場合
				{
					setcomment = "\u65B0\u898F\u4E88\u7D04\u767B\u9332\uFF08\u5B9F\u884C\uFF09";
					reserve_tel = H_reserve[Hcount].pactid + "-" + trim(H_reserve[Hcount].telno, "'") + "-" + H_reserve[Hcount].carid;
					var reserve_pactpost = H_reserve[Hcount].pactid + "-" + H_reserve[Hcount].postid;

					if (-1 !== A_all_post.indexOf(reserve_pactpost) == true) //第三引数にTrue を追加
						//tel_tb に新規予約登録であるにもかかわらず、既に登録されていないかの確認
						{
							if (-1 !== A_pact_tel_car.indexOf(reserve_tel) == true) //手動で登録されている// 第三引数にTrue を追加
								//管理記録の作業内容に表示される文言を変更
								//tel_tb へのアップデート処理
								//UPDATE処理：良
								{
									setcomment = "\u65B0\u898F\u4E88\u7D04\u767B\u9332\uFF08\u5909\u66F4\u306B\u5207\u308A\u66FF\u3048\u5B9F\u884C\uFF09";
									logh.putError(G_SCRIPT_INFO, "run://\u65B0\u898F\u767B\u9332\u304B\u3064tel_tb\u306B\u767B\u9332\u6E08\u307F\u3067\u3042\u308B\u3053\u3068\u3092\u78BA\u8A8D\u3002\u30A2\u30AF\u30BB\u30B9\u30BF\u30A4\u30D7\u3092UPDATE\u306B\u8A2D\u5B9A/");
									print("*               tel_tb\u306B\u65E2\u306B\u4E88\u7D04\u30C7\u30FC\u30BF\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\uFF1A\u767B\u9332\u30BF\u30A4\u30D7\u3092UPDATE\u306B\u8A2D\u5B9A\u3057\u307E\u3059               *" + date("Y-m-d H:i:s") + "\n\n");
									result = telTbUpdateFunction(dbh, logh, H_reserve[Hcount], setcomment, insert_update_c, update_0_c, now_time);

									if (result[0] == true) {
										insert_update_c = result[1];
										update_0_c = result[2];
										logh.putError(G_SCRIPT_INFO, "run://tel_tb\u3078\u306EUPDATE\u6587\u3092commit/");
										print("*               tel_tb\u3078\u306EUPDATE\u6587\u3092commit               *" + date("Y-m-d H:i:s") + "\n\n");
										dbh.commit();
									} else {
										G_error_log_text += result[3];
										logh.putError(G_SCRIPT_WARNING, "warning://tel_tb\u3078\u306EUPDATE\u3092\u5931\u6557rollback\u3057\u307E\u3059/");
										print("*               tel_tb\u3078\u306EUPDATE\u3092\u5931\u6557rollback\u3057\u307E\u3059               *" + date("Y-m-d H:i:s") + "\n\n");
										G_error_log_text += "warning://tel_tb\u3078\u306EUPDATE\u3092\u5931\u6557rollback\u3057\u307E\u3059/\n";
										dbh.rollback();
									}
								} else //管理記録の type カラムに記入
								//tel_tb に INSERT 送信
								//INSERT 結果が１以外のとき（エラー処理）
								{
									settype = "\u8FFD\u52A0";
									sqlstr = "INSERT INTO " + TEL_TB + "(pactid,postid,telno,telno_view,userid,carid,arid,cirid,machine,color,planid,packetid,pointstage,employeecode,username,mail,orderdate,text1,text2,text3,text4,text5,text6,text7,text8,text9,text10,text11,text12,text13,text14,text15,int1,int2,int3,date1,date2,memo,recdate,fixdate,options,contractdate,kousiflg,kousiptn,username_kana) ";
									sqlstr += "values(" + H_reserve[Hcount].pactid + "," + H_reserve[Hcount].postid + "," + H_reserve[Hcount].telno + "," + H_reserve[Hcount].telno_view + "," + H_reserve[Hcount].userid + "," + H_reserve[Hcount].carid + "," + H_reserve[Hcount].arid + "," + H_reserve[Hcount].cirid + "," + H_reserve[Hcount].machine + "," + H_reserve[Hcount].color + "," + H_reserve[Hcount].planid + "," + H_reserve[Hcount].packetid + "," + H_reserve[Hcount].pointstage + "," + H_reserve[Hcount].employeecode + "," + H_reserve[Hcount].username + "," + H_reserve[Hcount].mail + "," + H_reserve[Hcount].orderdate + "," + H_reserve[Hcount].text1 + "," + H_reserve[Hcount].text2 + "," + H_reserve[Hcount].text3 + "," + H_reserve[Hcount].text4 + "," + H_reserve[Hcount].text5 + "," + H_reserve[Hcount].text6 + "," + H_reserve[Hcount].text7 + "," + H_reserve[Hcount].text8 + "," + H_reserve[Hcount].text9 + "," + H_reserve[Hcount].text10 + "," + H_reserve[Hcount].text11 + "," + H_reserve[Hcount].text12 + "," + H_reserve[Hcount].text13 + "," + H_reserve[Hcount].text14 + "," + H_reserve[Hcount].text15 + "," + H_reserve[Hcount].int1 + "," + H_reserve[Hcount].int2 + "," + H_reserve[Hcount].int3 + "," + H_reserve[Hcount].date1 + "," + H_reserve[Hcount].date2 + "," + H_reserve[Hcount].memo + "," + H_reserve[Hcount].recdate + "," + H_reserve[Hcount].fixdate + "," + H_reserve[Hcount].options + "," + H_reserve[Hcount].contractdate + "," + H_reserve[Hcount].kousiflg + "," + H_reserve[Hcount].kousiptn + "," + H_reserve[Hcount].username_kana;
									sqlstr += ")";
									logh.putError(G_SCRIPT_INFO, "run://tel_tb\u306BINSERT/SQL:" + sqlstr + "/");
									print("*               tel_tb\u306BINSERT\u3057\u307E\u3059\u3002SQL\u6587\uFF1A" + sqlstr + "               *" + date("Y-m-d H:i:s") + "\n\n");
									result = dbh.query(sqlstr, false);

									if (DB.isError(result)) {
										logh.putError(G_SCRIPT_WARNING, "warning://INSERT\u306B\u5931\u6557\u3057\u307E\u3057\u305F/" + reserve_tel + "/" + result.message + ": " + result.userinfo + "/");
										print("*               INSERT\u306B\u5931\u6557\u3057\u307E\u3057\u305F:" + reserve_tel + "/" + result.message + ": " + result.userinfo + "               *" + date("Y-m-d H:i:s") + "\n\n");
										G_error_log_text += "warning://INSERT\u306B\u5931\u6557\u3057\u307E\u3057\u305F/" + reserve_tel + "/" + result.message + ": " + result.userinfo + "/\n";
										dbh.rollback();
									} else //予約テーブルに実行日とステータスの変更 管理記録 telmnglog_tb に書き込み
										//共に正常動作であれば commit
										{
											if (changeReserveState(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].postid, H_reserve[Hcount].telno, SUMI, now_time, H_reserve[Hcount].reserve_date, H_reserve[Hcount].recdate) == true && setTelmnglog(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].exe_postid, H_reserve[Hcount].exe_userid, H_reserve[Hcount].exe_name, H_reserve[Hcount].telno, setcomment, H_reserve[Hcount].postid, settype, now_time, H_reserve[Hcount].pactid, H_reserve[Hcount].postid, H_reserve[Hcount].carid, H_reserve[Hcount].joker_flag) == true) //新規予約件数
												{
													logh.putError(G_SCRIPT_INFO, "run://tel_reserve_tb telmnglog_tb \u5171\u306B\u51E6\u7406\u5B8C\u4E86/");
													print("*               tel_reserve_tb telmnglog_tb \u5171\u306B\u51E6\u7406\u5B8C\u4E86               *" + date("Y-m-d H:i:s") + "\n\n");
													logh.putError(G_SCRIPT_INFO, "run://tel_tb\u3078\u306EINSERT\u3092commit/");
													print("*               tel_tb\u3078\u306EINSERT\u3092commit               *" + date("Y-m-d H:i:s") + "\n\n");
													dbh.commit();
													insert_c++;
												} else {
												logh.putError(G_SCRIPT_WARNING, "warning://tel_reserve_tb telmnglog_tb \u306E\u51E6\u7406\u3067\u554F\u984C\u767A\u751F/");
												print("*               tel_reserve_tb telmnglog_tb  \u306E\u51E6\u7406\u3067\u554F\u984C\u767A\u751F               *" + date("Y-m-d H:i:s") + "\n\n");
												G_error_log_text += "warning://tel_reserve_tb telmnglog_tb \u306E\u51E6\u7406\u3067\u554F\u984C\u767A\u751F/\n";
												logh.putError(G_SCRIPT_WARNING, "warning://tel_tb\u3078\u306EINSERT\u306B\u5931\u6557rollback\u3057\u307E\u3059/");
												print("*               tel_tb\u3078\u306EINSERT\u306B\u5931\u6557rollback\u3057\u307E\u3059               *" + date("Y-m-d H:i:s") + "\n\n");
												G_error_log_text += "warning://INSERT\u306B\u5931\u6557rollback\u3057\u307E\u3059/\n";
												dbh.rollback();
											}
										}
								}
						} else //管理予約の type カラムに記入
						//管理予約の comment カラムに記入
						//予約テーブルに実行日とステータスの変更 管理記録 telmnglog_tb に書き込み
						//共に正常動作であれば commit
						{
							logh.putError(G_SCRIPT_INFO, "info://\u4E88\u7D04\u96FB\u8A71\u306E\u5BFE\u8C61\u90E8\u7F72\u304C\u5B58\u5728\u3057\u307E\u305B\u3093/" + reserve_pactpost);
							print("*               \u4E88\u7D04\u96FB\u8A71\u306E\u5BFE\u8C61\u90E8\u7F72\u304C\u5B58\u5728\u3057\u307E\u305B\u3093/" + reserve_pactpost + "               *" + date("Y-m-d H:i:s") + "\n\n");
							settype = "\u5BFE\u8C61\u306A\u3057";
							setcomment = "\u65B0\u898F\u4E88\u7D04\u767B\u9332\uFF08\u5BFE\u8C61\u90E8\u7F72\u306A\u3057\uFF09";

							if (changeReserveState(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].postid, H_reserve[Hcount].telno, NASI, now_time, H_reserve[Hcount].reserve_date, H_reserve[Hcount].recdate) == true && setTelmnglog(dbh, logh, H_reserve[Hcount].pactid, H_reserve[Hcount].exe_postid, H_reserve[Hcount].exe_userid, H_reserve[Hcount].exe_name, H_reserve[Hcount].telno, setcomment, H_reserve[Hcount].postid, settype, now_time, H_reserve[Hcount].pactid, H_reserve[Hcount].postid, H_reserve[Hcount].carid, H_reserve[Hcount].joker_flag) == true) //新規予約件数
								{
									logh.putError(G_SCRIPT_INFO, "run://tel_reserve_tb telmnglog_tb \u5171\u306B\u51E6\u7406\u5B8C\u4E86/");
									print("*               tel_reserve_tb telmnglog_tb \u5171\u306B\u51E6\u7406\u5B8C\u4E86               *" + date("Y-m-d H:i:s") + "\n\n");
									logh.putError(G_SCRIPT_INFO, "run://tel_tb\u3078\u306EINSERT\u6587\u3092commit/");
									print("*               tel_tb\u3078\u306EINSERT\u6587\u3092commit               *" + date("Y-m-d H:i:s") + "\n\n");
									dbh.commit();
									insert_no_post++;
								} else {
								logh.putError(G_SCRIPT_WARNING, "warning://tel_reserve_tb telmnglog_tb \u306E\u51E6\u7406\u3067\u554F\u984C\u767A\u751F/");
								print("*               tel_reserve_tb telmnglog_tb  \u306E\u51E6\u7406\u3067\u554F\u984C\u767A\u751F               *" + date("Y-m-d H:i:s") + "\n\n");
								G_error_log_text += "warning://tel_reserve_tb telmnglog_tb \u306E\u51E6\u7406\u3067\u554F\u984C\u767A\u751F/\n";
								logh.putError(G_SCRIPT_WARNING, "warning://tel_tb\u3078\u306EINSERT\u306B\u5931\u6557rollback\u3057\u307E\u3059/");
								print("*               tel_tb\u3078\u306EINSERT\u306B\u5931\u6557rollback\u3057\u307E\u3059               *" + date("Y-m-d H:i:s") + "\n\n");
								G_error_log_text += "warning://INSERT\u306B\u5931\u6557rollback\u3057\u307E\u3059/\n";
								dbh.rollback();
							}
						}
				} else if (H_reserve[Hcount].add_edit_flg == 1) //予約フラグ変更用
				//tel_tb へのアップデート処理
				//UPDATE処理：成功
				{
					setcomment = "\u5909\u66F4\u4E88\u7D04\u767B\u9332\uFF08\u5B9F\u884C\uFF09";
					result = telTbUpdateFunction(dbh, logh, H_reserve[Hcount], setcomment, update_c, update_0_c, now_time);

					if (result[0] == true) {
						update_c = result[1];
						update_0_c = result[2];
						logh.putError(G_SCRIPT_INFO, "run://tel_tb\u3078\u306EUPDATE\u6587\u3092commit/");
						print("*               tel_tb\u3078\u306EUPDATE\u6587\u3092commit               *" + date("Y-m-d H:i:s") + "\n\n");
						dbh.commit();
					} else //error_log_text に telTbUpdateFunction からのエラー文を追加
						{
							G_error_log_text += result[3];
							logh.putError(G_SCRIPT_WARNING, "warning://tel_tb\u3078\u306EUPDATE\u306Bcommit\u5931\u6557rollback\u3057\u307E\u3059/");
							print("*               tel_tb\u3078\u306EUPDATE\u306B\u5931\u6557rollback\u3057\u307E\u3059               *" + date("Y-m-d H:i:s") + "\n\n");
							G_error_log_text += "warning://tel_tb\u3078\u306EUPDATE\u306B\u5931\u6557rollback\u3057\u307E\u3059/" + reserve_tel + "/" + result.message + ": " + result.userinfo + "/\n";
							dbh.rollback();
						}
				} else {
				logh.putError(G_SCRIPT_WARNING, "warning://add_edit_flg\u304B\u3089\u4E88\u671F\u305B\u306C\u5024\u304C\u8FD4\u308A\u307E\u3057\u305F/\u4E88\u7D04\u30BF\u30A4\u30D7:" + H_reserve[Hcount].add_edit_flg + "/");
				print("*               add_edit_flg\u304B\u3089\u4E88\u671F\u305B\u306C\u5024\u304C\u8FD4\u308A\u307E\u3057\u305F/\u4E88\u7D04\u30BF\u30A4\u30D7:" + H_reserve[Hcount].add_edit_flg + "               *" + date("Y-m-d H:i:s") + "\n\n");
				G_error_log_text += "warning://add_edit_flg\u304B\u3089\u4E88\u671F\u305B\u306C\u5024\u304C\u8FD4\u308A\u307E\u3057\u305F/\u4E88\u7D04\u30BF\u30A4\u30D7:" + H_reserve[Hcount].add_edit_flg + "/\n";
			}
		}
	}

if (G_error_log_text != "") {
	var O_mail = Mail.factory("smtp", {
		host: G_SMTP_HOST,
		port: G_SMTP_PORT
	});
	var to = "batch_error@kcs-next-dev.com";
	if (DEBUG == 1) to = "houshiyama@motion.ne.jp";
	var from = "info@motion.ne.jp";
	var subject = G_MAIL_TYPE + "\u96FB\u8A71\u7BA1\u7406\u4E88\u7D04\u51E6\u7406\u30D0\u30C3\u30C1\u30A8\u30E9\u30FC";
	var message = mb_convert_encoding(G_error_log_text, "JIS");
	var H_headers = {
		Date: date("r"),
		To: to,
		From: from
	};
	H_headers["Return-Path"] = from;
	H_headers["MIME-Version"] = "1.0";
	H_headers.Subject = mb_encode_mimeheader(subject, "JIS");
	H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
	H_headers["Content-Transfer-Encoding"] = "7bit";
	H_headers["X-Mailer"] = "Motion Mailer v2";
	var rval = O_mail.send([to], H_headers, message);
}

logh.putError(G_SCRIPT_INFO, "info://\u65B0\u898F\u4E88\u7D04\uFF1A" + insert_c + "/\u65B0\u898F\u4E88\u7D04\u30FB\u767B\u9332\u6E08\u307F\uFF1A" + insert_update_c + "/\u5909\u66F4\u4E88\u7D04\uFF1A" + update_c + "/\u5909\u66F4\u4E88\u7D04\u30FB\u79FB\u52D5\u6E08\u307F\uFF1A" + update_0_c + "/\u65B0\u898F\u4E88\u7D04\u90E8\u7F72\u306A\u3057\uFF1A" + insert_no_post + "/");
logh.putError(G_SCRIPT_END, "end://tel_reserve_batch/");
throw die(0);

function formatValueToSQL(value, type = "") {
	if (value == "") {
		return "NULL";
	}

	if (type == "") {
		value = "'" + value + "'";
		return value;
	}

	return value;
};

function changeReserveState(dbhx, loghx, pactx, postx, telnox, exe_statex, now_timex, reserve_datex, recdatex) //予約登録の処理ステータスを確認
//tel_reserve_tb のステータス、実行日を書き換え
//ステータスのアップデートの際、エラー発生した場合
{
	if (!("G_error_log_text" in global)) G_error_log_text = undefined;

	if (exe_statex != 1 && exe_statex != 2) {
		loghx.putError(G_SCRIPT_WARNING, "warning://\u4E88\u7D04\u767B\u9332\u306E\u51E6\u7406\u30B9\u30C6\u30FC\u30BF\u30B9\u306B\u4E88\u671F\u305B\u306C\u5024\u304C\u6E21\u3055\u308C\u307E\u3057\u305F/exe_state" + exe_statex + "/");
		print("*               \u4E88\u7D04\u767B\u9332\u306E\u51E6\u7406\u30B9\u30C6\u30FC\u30BF\u30B9\u306B\u4E88\u671F\u305B\u306C\u5024\u304C\u6E21\u3055\u308C\u307E\u3057\u305F\u3002exe_state\uFF1A" + exe_statex + "               *" + date("Y-m-d H:i:s") + "\n\n");
		G_error_log_text += "warning://\u4E88\u7D04\u767B\u9332\u306E\u51E6\u7406\u30B9\u30C6\u30FC\u30BF\u30B9\u306B\u4E88\u671F\u305B\u306C\u5024\u304C\u6E21\u3055\u308C\u307E\u3057\u305F/exe_state" + exe_statex + "/\n";
		return false;
	}

	var resultx = "";
	var sql = "UPDATE tel_reserve_tb SET exe_state = " + exe_statex + ", fixdate =" + now_timex + ", exe_date =" + now_timex + " WHERE " + "pactid = " + pactx + " AND " + "postid = " + postx + " AND " + "telno = " + telnox + " AND " + "reserve_date = " + reserve_datex + " AND " + "recdate = " + recdatex + " AND " + "exe_state = 0";
	loghx.putError(G_SCRIPT_INFO, "run://tel_reserve_tb\u306BUPDATE/SQL:" + sql + "/");
	print("*               tel_reserve_tb \u306BUPDATE\u3057\u307E\u3059\u3002SQL\u6587:" + sql + "               *" + date("Y-m-d H:i:s") + "\n\n");
	resultx = dbhx.query(sql, false);

	if (DB.isError(resultx)) {
		loghx.putError(G_SCRIPT_WARNING, "warning://tel_reserve_tb\u306E\u66F8\u304D\u63DB\u3048\u306B\u5931\u6557\u3057\u307E\u3057\u305F/" + resultx.message + ":" + resultx.userinfo + "/SQL\uFF1A" + sql + "/");
		print("*               tel_reserve_tb\u306E\u66F8\u304D\u63DB\u3048\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\uFF1A" + resultx.message + ":" + resultx.userinfo + "               *" + date("Y-m-d H:i:s") + "\n\n");
		G_error_log_text += "warning://tel_reserve_tb\u306E\u66F8\u304D\u63DB\u3048\u306B\u5931\u6557\u3057\u307E\u3057\u305F/" + resultx.message + ":" + resultx.userinfo + "/SQL\uFF1A" + sql + "/\n";
		return false;
	} else //処理件数
		//ステータスのアップデートの際、1件以外の件数が帰ってきた場合
		{
			var resultx_num = dbhx.affectedRows();

			if (resultx_num != 1) {
				loghx.putError(G_SCRIPT_WARNING, "warning://tel_reserve_tb\u306E\u66F8\u304D\u63DB\u3048\u5BFE\u8C61\u306B\u8907\u6570\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u5B58\u5728\u3057\u307E\u3057\u305F/" + resultx_num + "/SQL\uFF1A" + sql + "/");
				print("*               tel_reserve_tb\u306E\u66F8\u304D\u63DB\u3048\u5BFE\u8C61\u306B\u8907\u6570\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u5B58\u5728\u3057\u307E\u3057\u305F\u3002\u8FD4\u308A\u5024\uFF1A" + resultx_num + "               *" + date("Y-m-d H:i:s") + "\n\n");
				G_error_log_text += "warning://tel_reserve_tb\u306E\u66F8\u304D\u63DB\u3048\u5BFE\u8C61\u306B\u8907\u6570\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u5B58\u5728\u3057\u307E\u3057\u305F/" + resultx_num + "/SQL\uFF1A" + sql + "/";
				return false;
			}
		}

	return true;
};

function setTelmnglog(dbhx, loghx, pactx, postx, useridx, namex, telnox, commentx, telpostidx, typex, recdatex, telpactidx, telpostidx, caridx, joker_flg) //DBからの返り値を受け取る
//対象電話の部署名、部署IDを取得するため
//post_tb より 対応電話の部署名を取得
//電話管理へ処理情報を追記
//telmnglog_tb へインサートの際にエラーが発生した場合。
{
	if (!("G_error_log_text" in global)) G_error_log_text = undefined;
	var resultx = "";
	var sql = "SELECT postname, userpostid FROM post_tb WHERE " + "pactid = " + telpactidx + " AND " + "postid = " + telpostidx;
	print(sql + "\n\n");
	loghx.putError(G_SCRIPT_INFO, "run://post_tb\u3088\u308A\u5BFE\u8C61\u96FB\u8A71\u306E\u90E8\u7F72\u540D\u3001\u90E8\u7F72ID\u3092\u53D6\u5F97/SQL:" + sql + "/");
	print("===========post_tb \u3088\u308A\u3001\u5BFE\u8C61\u643A\u5E2F\u96FB\u8A71\u306E\u90E8\u7F72\u3092\u691C\u7D22==================" + date("Y-m-d H:i:s") + "\n\n");
	var H_result = dbhx.getHash(sql);

	if (H_result.length != 1) //$loghx->putError(G_SCRIPT_ERROR, "error://post_tbより、対応する部署を発見できませんでした。/SQL：" . $sql . "/");
		{
			loghx.putError(G_SCRIPT_INFO, "error://post_tb\u3088\u308A\u3001\u5BFE\u5FDC\u3059\u308B\u90E8\u7F72\u3092\u767A\u898B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002/SQL\uFF1A" + sql + "/");
			print("============post_tb\u3088\u308A\u5BFE\u5FDC\u3059\u308B\u90E8\u7F72\u3092\u767A\u898B\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002SQL\u6587" + sql + "================" + date("Y-m-d H:i:s") + "\n\n");
			sql = "SELECT postname, userpostid FROM post_tb WHERE " + "pactid = " + telpactidx + " AND " + "postid = " + postx;
			print(sql + "\n\n");
			loghx.putError(G_SCRIPT_INFO, "run://post_tb\u3088\u308A\u767B\u9332\u30E6\u30FC\u30B6\u306E\u90E8\u7F72\u540D\u3001\u90E8\u7F72ID\u3092\u53D6\u5F97/SQL:" + sql + "/");
			print("===========post_tb \u3088\u308A\u3001\u767B\u9332\u30E6\u30FC\u30B6\u306E\u90E8\u7F72\u3092\u691C\u7D22==================" + date("Y-m-d H:i:s") + "\n\n");
			H_result = dbhx.getHash(sql);
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
	loghx.putError(G_SCRIPT_INFO, "run://telmnglog_tb\u3078INSERT/SQL:" + sql + "/");
	print("*               telmnglog_tb\u3078INSERT\u3057\u307E\u3059\u3002SQL\u6587\uFF1A" + sql + "               *" + date("Y-m-d H:i:s") + "\n\n");
	resultx = dbhx.query(sql, false);

	if (DB.isError(resultx)) {
		loghx.putError(G_SCRIPT_WARNING, "warning://telmnglog_tb\u3078INSERT\u304C\u5931\u6557\u3057\u307E\u3057\u305F/" + resultx.message + ":" + resultx.userinfo + "/");
		print("*               telmnglog\u3078INSERT\u304C\u5931\u6557\u3057\u307E\u3057\u305F\uFF1A\u8FD4\u308A\u5024" + resultx.message + ":" + resultx.userinfo + "               *" + date("Y-m-d H:i:s") + "\n\n");
		G_error_log_text += "warning://telmnglog_tb\u3078INSERT\u304C\u5931\u6557\u3057\u307E\u3057\u305F/" + resultx.message + ":" + resultx.userinfo + "/\n";
		return false;
	}

	return true;
};

function telTbUpdateFunction(dbh, logh, H_reserve, setcomment, update_c, update_0_c, now_time) //エラーログ格納用
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
	logh.putError(G_SCRIPT_INFO, "run://tel_tb\u306BUPDATE/SQL:" + sqlstr + "/");
	print("*               tel_tb\u306BUPDATE\u3057\u307E\u3059\u3002SQL\u6587\uFF1A" + sqlstr + "               *" + date("Y-m-d H:i:s") + "\n\n");
	var get_result = dbh.query(sqlstr, false);

	if (DB.isError(get_result) == false) //affectedRows()でUPDATE件数を取得、UPDATE の結果が 1だった場合は正常
		{
			if (dbh.affectedRows() == 1) //管理予約の type カラムに記入
				//予約テーブルに実行日とステータスの変更 管理記録 telmnglog_tb に書き込み
				//共に正常動作であれば、telTbUpdateFunction()呼び出し元にtrue と カウントデータを返送
				{
					var settype = "\u5909\u66F4";

					if (changeReserveState(dbh, logh, H_reserve.pactid, H_reserve.postid, H_reserve.telno, SUMI, now_time, H_reserve.reserve_date, H_reserve.recdate) == true && setTelmnglog(dbh, logh, H_reserve.pactid, H_reserve.exe_postid, H_reserve.exe_userid, H_reserve.exe_name, H_reserve.telno, setcomment, H_reserve.postid, settype, now_time, H_reserve.pactid, H_reserve.postid, H_reserve.carid, H_reserve.joker_flag) == true) //アップデート件数をインクリメント
						{
							update_c++;
							logh.putError(G_SCRIPT_INFO, `run://tel_reserve_tb telmnglog_tb 共に処理完了/$settype：${settype}`);
							print(`*               tel_reserve_tb telmnglog_tb 共に処理完了/$settype：${settype}               *` + date("Y-m-d H:i:s") + "\n\n");
							return [true, update_c, update_0_c, error_log_text];
						} else {
						logh.putError(G_SCRIPT_WARNING, `warning://tel_reserve_tb telmnglog_tb の処理で問題発生/$settype：${settype}`);
						print(`*               tel_reserve_tb telmnglog_tb  の処理で問題発生/$settype：${settype}               *` + date("Y-m-d H:i:s") + "\n\n");
						G_error_log_text = `warning://tel_reserve_tb telmnglog_tb の処理で問題発生/$settype：${settype}/\n`;
						return [false, update_c, update_0_c, error_log_text];
					}
				} else if (dbh.affectedRows() == 0) //管理予約の type カラムに記入
				//予約テーブルに実行日とステータスの変更 管理記録 telmnglog_tb に書き込み
				//共に正常動作であれば、telTbUpdateFunction()呼び出し元にtrue と カウントデータを返送
				{
					setcomment = "\u5909\u66F4\u4E88\u7D04\u767B\u9332\uFF08\u5BFE\u8C61\u306A\u3057\uFF09";
					settype = "\u5BFE\u8C61\u306A\u3057";

					if (changeReserveState(dbh, logh, H_reserve.pactid, H_reserve.postid, H_reserve.telno, NASI, now_time, H_reserve.reserve_date, H_reserve.recdate) == true && setTelmnglog(dbh, logh, H_reserve.pactid, H_reserve.exe_postid, H_reserve.exe_userid, H_reserve.exe_name, H_reserve.telno, setcomment, H_reserve.postid, settype, now_time, H_reserve.pactid, H_reserve.postid, H_reserve.carid, H_reserve.joker_flag) == true) //0件アップデート件数をインクリメント
						{
							update_0_c++;
							logh.putError(G_SCRIPT_INFO, `run://tel_reserve_tb telmnglog_tb 共に処理完了/$settype：${settype}`);
							print(`*               tel_reserve_tb telmnglog_tb 共に処理完了/$settype：${settype}               *` + date("Y-m-d H:i:s") + "\n\n");
							return [true, update_c, update_0_c, error_log_text];
						} else {
						logh.putError(G_SCRIPT_WARNING, `warning://tel_reserve_tb telmnglog_tb の処理で問題発生/$settype：${settype}`);
						print(`*               tel_reserve_tb telmnglog_tb  の処理で問題発生/$settype：${settype}               *` + date("Y-m-d H:i:s") + "\n\n");
						G_error_log_text = `warning://tel_reserve_tb telmnglog_tb の処理で問題発生/$settype：${settype}/\n`;
						return [false, update_c, update_0_c, error_log_text];
					}
				} else {
				logh.putError(G_SCRIPT_WARNING, "warning://UPDATE\u306B\u5931\u6557\u3057\u307E\u3057\u305F/" + sqlstr + "/" + get_result.message + ": " + get_result.userinfo + "/");
				print("*               UPDATE\u306B\u5931\u6557\u3057\u307E\u3057\u305F:" + sqlstr + "/" + get_result.message + ": " + get_result.userinfo + "               *" + date("Y-m-d H:i:s") + "\n\n");
				G_error_log_text += "warning://telmnglog_tb\u3078INSERT\u304C\u5931\u6557\u3057\u307E\u3057\u305F/" + resultx.message + ":" + resultx.userinfo + "/\n";
				return [false, update_c, update_0_c, error_log_text];
			}
		} else {
		logh.putError(G_SCRIPT_WARNING, "warning://UPDATE\u306B\u5931\u6557\u3057\u307E\u3057\u305F/" + sqlstr + "/" + get_result.message + ": " + get_result.userinfo + "/");
		print("*               UPDATE\u306B\u5931\u6557\u3057\u307E\u3057\u305F:" + sqlstr + "/" + get_result.message + ": " + get_result.userinfo + "               *" + date("Y-m-d H:i:s") + "\n\n");
		G_error_log_text = "warning://UPDATE\u306B\u5931\u6557\u3057\u307E\u3057\u305F/" + sqlstr + "/" + get_result.message + ": " + get_result.userinfo + "/\n";
		return [false, update_c, update_0_c, error_log_text];
	}
};