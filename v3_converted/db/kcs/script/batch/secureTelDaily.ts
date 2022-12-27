//===========================================================================
//セキュア電話帳日時バッチ
//
//作成日：2006/04/20
//作成者：前田
//
//更新履歴：
//
//===========================================================================
//require_once("/try_kcs/kcs/script/batch/lib/script_db.php");
//require_once("/try_kcs/kcs/script/batch/lib/script_log.php");
//require_once("/try_kcs/kcs/class/SecureTelSsl.php");
//define("G_LOG", "/try_kcs/kcs/log/batch");
//define("G_SMTP_HOST", "192.168.30.11");		// ＳＭＴＰ設定 // 共通設定から取得
//セキュア電話帳メンテナンス時間（ＡＭ３時～ＡＭ４時）
//スリープ時間
//---------------------------------------------------------------------------
//ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//契約ＩＤ
//エラーメール送信メッセージ
//パラメータチェック
//数が正しくない
//処理開始をログ出力
//SSL通信用オブジェクト作成
//$O_ssl = new SecureTelSsl("https://192.168.2.111/test_dailyServer.php", HTTP_REQUEST_METHOD_POST);
//secure_tbにあってtel_tbにない電話を検索
//ただし、既に削除・停止処理したものは除く
//契約ＩＤの指定があっても無視。常に全ての契約ＩＤを処理する
//対象件数
//検索結果１件ずつ処理する
//新規登録データを取得
//契約ＩＤ指定がある場合条件を追加
//対象件数
//検索結果１件ずつ処理する
//再開
//契約ＩＤ指定がある場合条件を追加
//対象件数
//検索結果１件ずつ処理する
//停止
//契約ＩＤ指定がある場合条件を追加
//対象件数
//検索結果１件ずつ処理する
//削除・解除
//契約ＩＤ指定がある場合条件を追加
//対象件数
//検索結果１件ずつ処理する
//エラーが発生した場合はメール送信する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $H_data null処理を行うカラム名をキー、更新データを値にした連想配列
//[返り値] 無
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//セキュア電話帳メンテナンス時間中はスリープさせる
//[引　数] 無
//[返り値] 無
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

require("lib/SecureTelSsl.php");

require("Mail.php");

const LOG_DELIM = " ";
const SCRIPTNAME = "SecureTelDaily.php";
const MAINTENANCE = 3;
const SLEEPSEC = 300;
var H_errCode = {
	"100001": "\u7BA1\u7406\u8005\u8A8D\u8A3C\u30A8\u30E9\u30FC",
	"100002": "ID\u91CD\u8907",
	"100003": "\u8A72\u5F53ID\u306A\u3057",
	"100004": "\u30B7\u30F3\u30BF\u30C3\u30AF\u30B9\u30A8\u30E9\u30FC\uFF08\u6587\u5B57\u7A2E,\u6587\u5B57\u9577\uFF09",
	"100005": "DB\u30A2\u30AF\u30BB\u30B9\u30A8\u30E9\u30FC",
	"100006": "\u305D\u306E\u4ED6\u306E\u30A8\u30E9\u30FC"
};
var dbLogFile = G_LOG + "/SecureTelDaily.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var pactid = "";
var errMailMsg = "";

if (_SERVER.argv.length != 2) //数が正しい
	{
		usage("");
	} else //$argvCounter 0 はスクリプト名のため無視
	{
		var argvCnt = _SERVER.argv.length;

		for (var argvCounter = 1; argvCounter < argvCnt; argvCounter++) //契約ＩＤを取得
		{
			if (ereg("^-p=", _SERVER.argv[argvCounter]) == true) //契約ＩＤチェック
				{
					pactid = ereg_replace("^-p=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("\u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}
		}
	}

var nowdate = "'" + date("Y-m-d") + "'";
print("BEGIN: \u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u65E5\u6642\u51E6\u7406\u958B\u59CB\n");
logh.putError(G_SCRIPT_BEGIN, "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u65E5\u6642\u51E6\u7406\u958B\u59CB");
var O_ssl = new SecureTelSsl();
var sql = "select pactid,carid,telno,user_id,status from secure_tb " + "except " + "select se.pactid,se.carid,se.telno,se.user_id,se.status from secure_tb se inner join tel_tb te " + "on se.pactid = te.pactid and se.carid = te.carid and se.telno = te.telno " + "except " + "select pactid,carid,telno,user_id,status from secure_tb where status = 3";
var H_result = dbh.getHash(sql);
var cnt_result = H_result.length;

for (var recCnt = 0; recCnt < cnt_result; recCnt++) //セキュア電話帳メンテナンス時間中はスリープさせる
//セキュア電話帳へのＰＯＳＴデータ初期化
//セキュア電話帳へのＰＯＳＴデータにＤＢ検索結果をマージ
//現在日時を取得
//トランザクション開始
//ステータスが未登録（null）
//予約があるかどうかはわからないがsecure_reserve_tbのレコードを削除する
//secure_reserve_tbの削除が失敗した場合
//ステータスが未登録（null）の時
{
	chkTime();
	var H_postdata = {
		id: G_SECURE_ADMIN_ID,
		password: G_SECURE_ADMIN_PASSWORD,
		func: "delete"
	};
	H_postdata.user_id = H_result[recCnt].user_id;
	var now = "'" + date("Y-m-d H:i:s") + "'";
	dbh.begin();

	if (H_result[recCnt].status == "") //secure_tbから削除する
		//削除エラーでもプログラム終了させない
		//secure_tbの削除が失敗した場合
		{
			sql = "delete from secure_tb " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
			var rtn = dbh.query(sql, false);

			if (DB.isError(rtn) == true) //secure_tbへの更新をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u30C6\u30FC\u30D6\u30EB\u524A\u9664\u5931\u6557(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1A" + rtn.userinfo + ":pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "\u30BB\u30AD\u30E5\u30A2\u30C6\u30FC\u30D6\u30EB\u524A\u9664\u5931\u6557(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1A" + rtn.userinfo + ":pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		} else //secure_tbのuser_idをnullに、statusを3（削除・解約）に更新する
		//更新エラーでもプログラム終了させない
		//secure_tbへの更新が失敗した場合
		{
			sql = "update secure_tb set " + "user_id = null," + "status = 3," + "fixdate = " + now + " " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
			rtn = dbh.query(sql, false);

			if (DB.isError(rtn) == true) //secure_tbへの更新をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				//secure_tbへの更新が成功した場合
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u30C6\u30FC\u30D6\u30EB\u66F4\u65B0\u5931\u6557(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1A" + rtn.userinfo + ":pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "\u30BB\u30AD\u30E5\u30A2\u30C6\u30FC\u30D6\u30EB\u66F4\u65B0\u5931\u6557(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1A" + rtn.userinfo + ":pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				} else //更新された件数が１件でなければエラー扱い
				{
					if (dbh.affectedRows() != 1) //secure_tbへの更新をロールバックする
						//エラーログをはく
						//エラー通知用メール本文
						{
							dbh.rollback();
							logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u30C6\u30FC\u30D6\u30EB\u66F4\u65B0\u5931\u6557(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
							errMailMsg = errMailMsg + "\u30BB\u30AD\u30E5\u30A2\u30C6\u30FC\u30D6\u30EB\u66F4\u65B0\u5931\u6557(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
							continue;
						}
				}
		}

	sql = "delete from secure_reserve_tb " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //secure_reserve_tbの削除をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		//secure_reserve_tbの削除が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1A" + rtn.userinfo + ":pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //２件以上削除された場合はエラー扱い
		{
			if (dbh.affectedRows() >= 2) //secure_reserve_tbの削除をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	if (H_result[recCnt].status == "") //secure_tbへの更新をコミットする
		//成功ログをはく
		//ステータスが利用中（1）、停止（2）
		{
			dbh.commit();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u30C6\u30FC\u30D6\u30EB\u524A\u9664\u6210\u529F(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
		} else //セキュアサーバーへデータ送信
		//セキュア電話帳サーバーへ登録が正常に終了した場合
		{
			var rtnPost = O_ssl.postParam(H_postdata);

			if (rtnPost == 1) //secure_tbへの更新をコミットする
				//成功ログをはく
				//セキュア電話帳サーバーへ送信自体が失敗した場合
				{
					dbh.commit();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u524A\u9664\u6210\u529F(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
				} else if (rtnPost == false) //secure_tbへの更新をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				//セキュア電話帳サーバーへ通信できたがエラーコードが帰ってきた場合
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u901A\u4FE1\u30A8\u30E9\u30FC(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "\u901A\u4FE1\u30A8\u30E9\u30FC(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
				} else //secure_tbへの更新をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30B5\u30FC\u30D0\u524A\u9664\u30A8\u30E9\u30FC(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1AErrorCode=" + rtnPost + " " + H_errCode[rtnPost] + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30B5\u30FC\u30D0\u524A\u9664\u30A8\u30E9\u30FC(delete[tel_tb\u306B\u7121\u3044\u96FB\u8A71])\uFF1AErrorCode=" + rtnPost + " " + H_errCode[rtnPost] + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
				}
		}
}

sql = "select telno,pactid,carid,new_carid,new_arid,new_cirid,user_id,user_password,ip_phone_number,ip_phone_pass," + "terminal_id,forward_pnumber2,forward_pnumber3,forward_pnumber4,forward_pnumber5,forward_pnumber6,status," + "ip_status,username,username_kana,ip_phone_number_view,forward_pnumber2_view,forward_pnumber3_view," + "forward_pnumber4_view,forward_pnumber5_view,forward_pnumber6_view,telno_view,iapl_password,authenticate_type " + "from secure_reserve_tb " + "where func = 'entry' and date(expectdate) <= " + nowdate;

if (pactid != "" && pactid != "all") {
	sql = sql + " and pactid = " + pactid;
}

H_result = dbh.getHash(sql);
cnt_result = H_result.length;

for (recCnt = 0;; recCnt < cnt_result; recCnt++) //セキュア電話帳メンテナンス時間中はスリープさせる
//セキュア電話帳へのＰＯＳＴデータ初期化
//セキュア電話帳へのＰＯＳＴデータにＤＢ検索結果をマージ
//現在日時を取得
//トランザクション開始
//secure_reserve_tbの内容でsecure_tbを更新する
//secure_tbへの更新が失敗した場合
//secure_reserve_tbの内容でtel_tb.carid,arid,cirid,username,username_kana,fixdateを更新する
//tel_tbへの更新が失敗した場合
//secure_reserve_tbのレコードを削除する
//secure_reserve_tbの削除が失敗した場合
//statusがnullの場合はセキュア電話帳に送信しない
{
	chkTime();
	H_postdata = {
		id: G_SECURE_ADMIN_ID,
		password: G_SECURE_ADMIN_PASSWORD,
		func: "entry",
		user_stop_flag: "0"
	};
	H_postdata.user_id = H_result[recCnt].user_id;
	H_postdata.user_password = H_result[recCnt].user_password;

	if (H_result[recCnt].username != "") {
		H_postdata.user_name = mb_convert_encoding(H_result[recCnt].username, "SJIS-WIN", "UTF-8");
	} else {
		H_postdata.user_name = "";
	}

	if (H_result[recCnt].username_kana != "") {
		H_postdata.user_name_k = mb_convert_encoding(H_result[recCnt].username_kana, "SJIS-WIN", "UTF-8");
	} else {
		H_postdata.user_name_k = "";
	}

	H_postdata.ip_phone_number = H_result[recCnt].ip_phone_number;
	H_postdata.ip_phone_pass = H_result[recCnt].ip_phone_pass;
	H_postdata.terminal_id = H_result[recCnt].terminal_id;
	H_postdata.forward_pnumber1 = H_result[recCnt].telno;
	H_postdata.forward_pnumber2 = H_result[recCnt].forward_pnumber2;
	H_postdata.forward_pnumber3 = H_result[recCnt].forward_pnumber3;
	H_postdata.forward_pnumber4 = H_result[recCnt].forward_pnumber4;
	H_postdata.forward_pnumber5 = H_result[recCnt].forward_pnumber5;
	H_postdata.forward_pnumber6 = H_result[recCnt].forward_pnumber6;
	H_postdata.status = H_result[recCnt].status;
	H_postdata.ip_status = H_result[recCnt].ip_status;
	H_postdata.iapl_password = H_result[recCnt].iapl_password;
	H_postdata.authenticate_type = H_result[recCnt].authenticate_type;
	var H_securedata = Array();
	dataSet(H_result[recCnt]);
	now = "'" + date("Y-m-d H:i:s") + "'";
	dbh.begin();
	sql = "update secure_tb set " + "carid = " + H_result[recCnt].new_carid + "," + "user_id = " + H_securedata.user_id + "," + "user_password = " + H_securedata.user_password + "," + "ip_phone_number = " + H_securedata.ip_phone_number + "," + "ip_phone_number_view = " + H_securedata.ip_phone_number_view + "," + "ip_phone_pass = " + H_securedata.ip_phone_pass + "," + "terminal_id = " + H_securedata.terminal_id + "," + "forward_pnumber2 = " + H_securedata.forward_pnumber2 + "," + "forward_pnumber2_view = " + H_securedata.forward_pnumber2_view + "," + "forward_pnumber3 = " + H_securedata.forward_pnumber3 + "," + "forward_pnumber3_view = " + H_securedata.forward_pnumber3_view + "," + "forward_pnumber4 = " + H_securedata.forward_pnumber4 + "," + "forward_pnumber4_view = " + H_securedata.forward_pnumber4_view + "," + "forward_pnumber5 = " + H_securedata.forward_pnumber5 + "," + "forward_pnumber5_view = " + H_securedata.forward_pnumber5_view + "," + "forward_pnumber6 = " + H_securedata.forward_pnumber6 + "," + "forward_pnumber6_view = " + H_securedata.forward_pnumber6_view + "," + "status = " + H_securedata.status + "," + "secstartdate = " + now + "," + "fixdate = " + now + "," + "ip_status = " + H_securedata.ip_status + "," + "iapl_password = " + H_securedata.iapl_password + "," + "authenticate_type = " + H_securedata.authenticate_type + " " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //secure_tbへの更新をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		//secure_tbへの更新が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(entry)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(entry)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //更新された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //secure_tbへの更新をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(entry)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(entry)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	sql = "update tel_tb set " + "carid = " + H_result[recCnt].new_carid + "," + "arid = " + H_result[recCnt].new_arid + "," + "cirid = " + H_result[recCnt].new_cirid + "," + "telno_view = '" + H_result[recCnt].telno_view + "'," + "username = " + H_securedata.username + "," + "username_kana = " + H_securedata.username_kana + "," + "fixdate = " + now + " " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //エラーログをはく
		//エラー通知用メール本文
		//tel_tbへの更新が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(entry)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(entry)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //更新された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(entry)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(entry)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	sql = "delete from secure_reserve_tb " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //secure_reserve_tbの削除をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		//secure_reserve_tbの削除が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(entry)\uFF1A" + rtn.userinfo + ":pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(entry)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //削除された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //secure_reserve_tbの削除をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(entry)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(entry)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	if (H_result[recCnt].status == "") //secure_tbへの更新をコミットする
		//成功ログをはく
		{
			dbh.commit();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u30C6\u30FC\u30D6\u30EB\u66F4\u65B0\u6210\u529F(entry)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
		} else //セキュアサーバーへデータ送信
		//セキュア電話帳サーバーへ登録が正常に終了した場合
		{
			rtnPost = O_ssl.postParam(H_postdata);

			if (rtnPost == 1) //secure_tbへの更新をコミットする
				//成功ログをはく
				//セキュア電話帳サーバーへ送信自体が失敗した場合
				{
					dbh.commit();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u767B\u9332\u6210\u529F(entry)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
				} else if (rtnPost == false) //secure_tbへの更新をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				//セキュア電話帳サーバーへ通信できたがエラーコードが帰ってきた場合
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u901A\u4FE1\u30A8\u30E9\u30FC(entry)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "\u901A\u4FE1\u30A8\u30E9\u30FC(entry)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
				} else //secure_tbへの更新をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30B5\u30FC\u30D0\u767B\u9332\u30A8\u30E9\u30FC(entry)\uFF1AErrorCode=" + rtnPost + " " + H_errCode[rtnPost] + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30B5\u30FC\u30D0\u767B\u9332\u30A8\u30E9\u30FC(entry)\uFF1AErrorCode=" + rtnPost + " " + H_errCode[rtnPost] + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
				}
		}
}

sql = "select telno,pactid,carid,new_carid,new_arid,new_cirid,user_id,user_password,ip_phone_number,ip_phone_pass," + "terminal_id,forward_pnumber2,forward_pnumber3,forward_pnumber4,forward_pnumber5,forward_pnumber6,status," + "ip_status,username,username_kana,ip_phone_number_view,forward_pnumber2_view,forward_pnumber3_view," + "forward_pnumber4_view,forward_pnumber5_view,forward_pnumber6_view,telno_view,iapl_password,authenticate_type " + "from secure_reserve_tb " + "where func = 'update' and date(expectdate) <= " + nowdate + " and status = 1";

if (pactid != "" && pactid != "all") {
	sql = sql + " and pactid = " + pactid;
}

H_result = dbh.getHash(sql);
cnt_result = H_result.length;

for (recCnt = 0;; recCnt < cnt_result; recCnt++) //セキュア電話帳メンテナンス時間中はスリープさせる
//セキュア電話帳へのＰＯＳＴデータ初期化
//セキュア電話帳へのＰＯＳＴデータにＤＢ検索結果をマージ
//現在日時を取得
//トランザクション開始
//secure_reserve_tbの内容でsecure_tbを更新する
//secure_tbへの更新が失敗した場合
//secure_reserve_tbの内容でtel_tb.carid,arid,cirid,username,username_kana,fixdateを更新する
//tel_tbへの更新が失敗した場合
//secure_reserve_tbのレコードを削除する
//secure_reserve_tbの削除が失敗した場合
//セキュアサーバーへデータ送信
//セキュア電話帳サーバーへ登録が正常に終了した場合
{
	chkTime();
	H_postdata = {
		id: G_SECURE_ADMIN_ID,
		password: G_SECURE_ADMIN_PASSWORD,
		func: "update",
		user_stop_flag: "0"
	};
	H_postdata.user_id = H_result[recCnt].user_id;
	H_postdata.user_password = H_result[recCnt].user_password;

	if (H_result[recCnt].username != "") {
		H_postdata.user_name = mb_convert_encoding(H_result[recCnt].username, "SJIS-WIN", "UTF-8");
	} else {
		H_postdata.user_name = "";
	}

	if (H_result[recCnt].username_kana != "") {
		H_postdata.user_name_k = mb_convert_encoding(H_result[recCnt].username_kana, "SJIS-WIN", "UTF-8");
	} else {
		H_postdata.user_name_k = "";
	}

	H_postdata.ip_phone_number = H_result[recCnt].ip_phone_number;
	H_postdata.ip_phone_pass = H_result[recCnt].ip_phone_pass;
	H_postdata.terminal_id = H_result[recCnt].terminal_id;
	H_postdata.forward_pnumber1 = H_result[recCnt].telno;
	H_postdata.forward_pnumber2 = H_result[recCnt].forward_pnumber2;
	H_postdata.forward_pnumber3 = H_result[recCnt].forward_pnumber3;
	H_postdata.forward_pnumber4 = H_result[recCnt].forward_pnumber4;
	H_postdata.forward_pnumber5 = H_result[recCnt].forward_pnumber5;
	H_postdata.forward_pnumber6 = H_result[recCnt].forward_pnumber6;
	H_postdata.status = H_result[recCnt].status;
	H_postdata.ip_status = H_result[recCnt].ip_status;
	H_postdata.iapl_password = H_result[recCnt].iapl_password;
	H_postdata.authenticate_type = H_result[recCnt].authenticate_type;
	H_securedata = Array();
	dataSet(H_result[recCnt]);
	now = "'" + date("Y-m-d H:i:s") + "'";
	dbh.begin();
	sql = "update secure_tb set " + "carid = " + H_result[recCnt].new_carid + "," + "user_id = " + H_securedata.user_id + "," + "user_password = " + H_securedata.user_password + "," + "ip_phone_number = " + H_securedata.ip_phone_number + "," + "ip_phone_number_view = " + H_securedata.ip_phone_number_view + "," + "ip_phone_pass = " + H_securedata.ip_phone_pass + "," + "terminal_id = " + H_securedata.terminal_id + "," + "forward_pnumber2 = " + H_securedata.forward_pnumber2 + "," + "forward_pnumber2_view = " + H_securedata.forward_pnumber2_view + "," + "forward_pnumber3 = " + H_securedata.forward_pnumber3 + "," + "forward_pnumber3_view = " + H_securedata.forward_pnumber3_view + "," + "forward_pnumber4 = " + H_securedata.forward_pnumber4 + "," + "forward_pnumber4_view = " + H_securedata.forward_pnumber4_view + "," + "forward_pnumber5 = " + H_securedata.forward_pnumber5 + "," + "forward_pnumber5_view = " + H_securedata.forward_pnumber5_view + "," + "forward_pnumber6 = " + H_securedata.forward_pnumber6 + "," + "forward_pnumber6_view = " + H_securedata.forward_pnumber6_view + "," + "status = " + H_securedata.status + "," + "secstartdate = " + now + "," + "fixdate = " + now + "," + "ip_status = " + H_securedata.ip_status + "," + "iapl_password = " + H_securedata.iapl_password + "," + "authenticate_type = " + H_securedata.authenticate_type + " " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //エラーログをはく
		//エラー通知用メール本文
		//secure_tbへの更新が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //更新された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	sql = "update tel_tb set " + "carid = " + H_result[recCnt].new_carid + "," + "arid = " + H_result[recCnt].new_arid + "," + "cirid = " + H_result[recCnt].new_cirid + "," + "telno_view = '" + H_result[recCnt].telno_view + "'," + "username = " + H_securedata.username + "," + "username_kana = " + H_securedata.username_kana + "," + "fixdate = " + now + " " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //エラーログをはく
		//エラー通知用メール本文
		//tel_tbへの更新が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //更新された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	sql = "delete from secure_reserve_tb " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //secure_reserve_tbの削除をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		//secure_reserve_tbの削除が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + rtn.userinfo + ":pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //削除された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //secure_reserve_tbの削除をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	rtnPost = O_ssl.postParam(H_postdata);

	if (rtnPost == 1) //secure_tbへの更新をコミットする
		//成功ログをはく
		//セキュア電話帳サーバーへ送信自体が失敗した場合
		{
			dbh.commit();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u66F4\u65B0\u6210\u529F(update\u518D\u958B)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
		} else if (rtnPost == false) //secure_tbへの更新をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		//セキュア電話帳サーバーへ通信できたがエラーコードが帰ってきた場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u901A\u4FE1\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "\u901A\u4FE1\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
		} else //secure_tbへの更新をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30B5\u30FC\u30D0\u767B\u9332\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1AErrorCode=" + rtnPost + " " + H_errCode[rtnPost] + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30B5\u30FC\u30D0\u767B\u9332\u30A8\u30E9\u30FC(update\u518D\u958B)\uFF1AErrorCode=" + rtnPost + " " + H_errCode[rtnPost] + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
		}
}

sql = "select telno,pactid,carid,new_carid,new_arid,new_cirid,user_id,user_password,ip_phone_number,ip_phone_pass," + "terminal_id,forward_pnumber2,forward_pnumber3,forward_pnumber4,forward_pnumber5,forward_pnumber6,status," + "ip_status,username,username_kana,ip_phone_number_view,forward_pnumber2_view,forward_pnumber3_view," + "forward_pnumber4_view,forward_pnumber5_view,forward_pnumber6_view,telno_view,iapl_password,authenticate_type " + "from secure_reserve_tb " + "where func = 'update' and date(expectdate) <= " + nowdate + " and status = 2";

if (pactid != "" && pactid != "all") {
	sql = sql + " and pactid = " + pactid;
}

H_result = dbh.getHash(sql);
cnt_result = H_result.length;

for (recCnt = 0;; recCnt < cnt_result; recCnt++) //セキュア電話帳メンテナンス時間中はスリープさせる
//セキュア電話帳へのＰＯＳＴデータ初期化
//セキュア電話帳へのＰＯＳＴデータにＤＢ検索結果をマージ
//現在日時を取得
//トランザクション開始
//secure_reserve_tbの内容でsecure_tbを更新する
//secure_tbへの更新が失敗した場合
//secure_reserve_tbの内容でtel_tb.carid,arid,cirid,username,username_kana,fixdateを更新する
//tel_tbへの更新が失敗した場合
//secure_reserve_tbのレコードを削除する
//secure_reserve_tbの削除が失敗した場合
//セキュアサーバーへデータ送信
//セキュア電話帳サーバーへ登録が正常に終了した場合
{
	chkTime();
	H_postdata = {
		id: G_SECURE_ADMIN_ID,
		password: G_SECURE_ADMIN_PASSWORD,
		func: "update",
		user_stop_flag: "1"
	};
	H_postdata.user_id = H_result[recCnt].user_id;
	H_postdata.user_password = H_result[recCnt].user_password;

	if (H_result[recCnt].username != "") {
		H_postdata.user_name = mb_convert_encoding(H_result[recCnt].username, "SJIS-WIN", "UTF-8");
	} else {
		H_postdata.user_name = "";
	}

	if (H_result[recCnt].username_kana != "") {
		H_postdata.user_name_k = mb_convert_encoding(H_result[recCnt].username_kana, "SJIS-WIN", "UTF-8");
	} else {
		H_postdata.user_name_k = "";
	}

	H_postdata.ip_phone_number = H_result[recCnt].ip_phone_number;
	H_postdata.ip_phone_pass = H_result[recCnt].ip_phone_pass;
	H_postdata.terminal_id = H_result[recCnt].terminal_id;
	H_postdata.forward_pnumber1 = H_result[recCnt].telno;
	H_postdata.forward_pnumber2 = H_result[recCnt].forward_pnumber2;
	H_postdata.forward_pnumber3 = H_result[recCnt].forward_pnumber3;
	H_postdata.forward_pnumber4 = H_result[recCnt].forward_pnumber4;
	H_postdata.forward_pnumber5 = H_result[recCnt].forward_pnumber5;
	H_postdata.forward_pnumber6 = H_result[recCnt].forward_pnumber6;
	H_postdata.status = H_result[recCnt].status;
	H_postdata.ip_status = H_result[recCnt].ip_status;
	H_postdata.iapl_password = H_result[recCnt].iapl_password;
	H_postdata.authenticate_type = H_result[recCnt].authenticate_type;
	H_securedata = Array();
	dataSet(H_result[recCnt]);
	now = "'" + date("Y-m-d H:i:s") + "'";
	dbh.begin();
	sql = "update secure_tb set " + "carid = " + H_result[recCnt].new_carid + "," + "user_id = " + H_securedata.user_id + "," + "user_password = " + H_securedata.user_password + "," + "ip_phone_number = " + H_securedata.ip_phone_number + "," + "ip_phone_number_view = " + H_securedata.ip_phone_number_view + "," + "ip_phone_pass = " + H_securedata.ip_phone_pass + "," + "terminal_id = " + H_securedata.terminal_id + "," + "forward_pnumber2 = " + H_securedata.forward_pnumber2 + "," + "forward_pnumber2_view = " + H_securedata.forward_pnumber2_view + "," + "forward_pnumber3 = " + H_securedata.forward_pnumber3 + "," + "forward_pnumber3_view = " + H_securedata.forward_pnumber3_view + "," + "forward_pnumber4 = " + H_securedata.forward_pnumber4 + "," + "forward_pnumber4_view = " + H_securedata.forward_pnumber4_view + "," + "forward_pnumber5 = " + H_securedata.forward_pnumber5 + "," + "forward_pnumber5_view = " + H_securedata.forward_pnumber5_view + "," + "forward_pnumber6 = " + H_securedata.forward_pnumber6 + "," + "forward_pnumber6_view = " + H_securedata.forward_pnumber6_view + "," + "status = " + H_securedata.status + "," + "fixdate = " + now + "," + "ip_status = " + H_securedata.ip_status + "," + "iapl_password = " + H_securedata.iapl_password + "," + "authenticate_type = " + H_securedata.authenticate_type + " " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //エラーログをはく
		//エラー通知用メール本文
		//secure_tbへの更新が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //更新された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	sql = "update tel_tb set " + "carid = " + H_result[recCnt].new_carid + "," + "arid = " + H_result[recCnt].new_arid + "," + "cirid = " + H_result[recCnt].new_cirid + "," + "telno_view = '" + H_result[recCnt].telno_view + "'," + "username = " + H_securedata.username + "," + "username_kana = " + H_securedata.username_kana + "," + "fixdate = " + now + " " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //エラーログをはく
		//エラー通知用メール本文
		//tel_tbへの更新が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //更新された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "tel_tb\u66F4\u65B0\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	sql = "delete from secure_reserve_tb " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //secure_reserve_tbの削除をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		//secure_reserve_tbの削除が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + rtn.userinfo + ":pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //削除された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //secure_reserve_tbの削除をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	rtnPost = O_ssl.postParam(H_postdata);

	if (rtnPost == 1) //secure_tbへの更新をコミットする
		//成功ログをはく
		//セキュア電話帳サーバーへ送信自体が失敗した場合
		{
			dbh.commit();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u66F4\u65B0\u6210\u529F(update\u505C\u6B62)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
		} else if (rtnPost == false) //secure_tbへの更新をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		//セキュア電話帳サーバーへ通信できたがエラーコードが帰ってきた場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u901A\u4FE1\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "\u901A\u4FE1\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
		} else //secure_tbへの更新をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30B5\u30FC\u30D0\u767B\u9332\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1AErrorCode=" + rtnPost + " " + H_errCode[rtnPost] + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30B5\u30FC\u30D0\u767B\u9332\u30A8\u30E9\u30FC(update\u505C\u6B62)\uFF1AErrorCode=" + rtnPost + " " + H_errCode[rtnPost] + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
		}
}

sql = "select pactid,carid,telno,user_id " + "from secure_reserve_tb " + "where func = 'delete' and date(expectdate) <= " + nowdate;

if (pactid != "" && pactid != "all") {
	sql = sql + " and pactid = " + pactid;
}

H_result = dbh.getHash(sql);
cnt_result = H_result.length;

for (recCnt = 0;; recCnt < cnt_result; recCnt++) //セキュア電話帳メンテナンス時間中はスリープさせる
//セキュア電話帳へのＰＯＳＴデータ初期化
//セキュア電話帳へのＰＯＳＴデータにＤＢ検索結果をマージ
//現在日時を取得
//トランザクション開始
//secure_tbのstatusを3、user_idをnullに更新する
//更新エラーでもプログラム終了させない
//secure_tbへの更新が失敗した場合
//secure_reserve_tbのレコードを削除する
//secure_reserve_tbの削除が失敗した場合
//セキュアサーバーへデータ送信
//セキュア電話帳サーバーへ登録が正常に終了した場合
{
	chkTime();
	H_postdata = {
		id: G_SECURE_ADMIN_ID,
		password: G_SECURE_ADMIN_PASSWORD,
		func: "delete"
	};
	H_postdata.user_id = H_result[recCnt].user_id;
	now = "'" + date("Y-m-d H:i:s") + "'";
	dbh.begin();
	sql = "update secure_tb set " + "user_id = null," + "status = 3," + "fixdate = " + now + " " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //エラーログをはく
		//エラー通知用メール本文
		//secure_tbへの更新が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(delete)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(delete)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //更新された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(delete)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "secure_tb\u66F4\u65B0\u30A8\u30E9\u30FC(delete)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	sql = "delete from secure_reserve_tb " + "where pactid = " + H_result[recCnt].pactid + " and " + "carid = " + H_result[recCnt].carid + " and " + "telno = '" + H_result[recCnt].telno + "'";
	rtn = dbh.query(sql, false);

	if (DB.isError(rtn) == true) //secure_reserve_tbの削除をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		//secure_reserve_tbの削除が成功した場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(delete)\uFF1A" + rtn.userinfo + ":pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(delete)\uFF1A" + rtn.userinfo + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
			continue;
		} else //削除された件数が１件でなければエラー扱い
		{
			if (dbh.affectedRows() != 1) //secure_reserve_tbの削除をロールバックする
				//エラーログをはく
				//エラー通知用メール本文
				{
					dbh.rollback();
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(delete)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
					errMailMsg = errMailMsg + "secure_reserve_tb\u524A\u9664\u30A8\u30E9\u30FC(delete)\uFF1A" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
					continue;
				}
		}

	rtnPost = O_ssl.postParam(H_postdata);

	if (rtnPost == 1) //secure_tbへの更新をコミットする
		//成功ログをはく
		//セキュア電話帳サーバーへ送信自体が失敗した場合
		{
			dbh.commit();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u524A\u9664\u6210\u529F(delete)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
		} else if (rtnPost == false) //secure_tbへの更新をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		//セキュア電話帳サーバーへ通信できたがエラーコードが帰ってきた場合
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u901A\u4FE1\u30A8\u30E9\u30FC(delete)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "\u901A\u4FE1\u30A8\u30E9\u30FC(delete)\uFF1Apactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
		} else //secure_tbへの更新をロールバックする
		//エラーログをはく
		//エラー通知用メール本文
		{
			dbh.rollback();
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30B5\u30FC\u30D0\u524A\u9664\u30A8\u30E9\u30FC(delete)\uFF1AErrorCode=" + rtnPost + " " + H_errCode[rtnPost] + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + ":" + "user_id=" + H_result[recCnt].user_id);
			errMailMsg = errMailMsg + "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u30B5\u30FC\u30D0\u524A\u9664\u30A8\u30E9\u30FC(delete)\uFF1AErrorCode=" + rtnPost + " " + H_errCode[rtnPost] + ":" + "pactid=" + H_result[recCnt].pactid + ":" + "carid=" + H_result[recCnt].carid + ":" + "telno=" + H_result[recCnt].telno + "\n";
		}
}

if (errMailMsg != "") {
	var O_mail = Mail.factory("smtp", {
		host: G_SMTP_HOST,
		port: G_SMTP_PORT
	});
	var to = "batch_error@kcs-next-dev.com";
	var from = "batch_error@kcs-next-dev.com";
	var subject = "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u65E5\u6B21\u51E6\u7406\u30A8\u30E9\u30FC\u5831\u544A\uFF08\u672C\u756A\u74B0\u5883\uFF09";
	var message = mb_convert_encoding(errMailMsg, "JIS");
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

print("BEGIN: \u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u65E5\u6642\u51E6\u7406\u7D42\u4E86\n");
logh.putError(G_SCRIPT_END, "\u30BB\u30AD\u30E5\u30A2\u96FB\u8A71\u5E33\u65E5\u6642\u51E6\u7406\u7D42\u4E86");
throw die(0);

function usage(comment) {
	if (!("dbh" in global)) dbh = undefined;

	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + SCRIPTNAME + " -p={all|PACTID}\n");
	print("     -p \u5951\u7D04\uFF29\uFF24     (all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw die(1);
};

function dataSet(H_data) {
	if (!("H_securedata" in global)) H_securedata = undefined;

	if (H_data.user_id == "") {
		H_securedata.user_id = "null";
	} else {
		H_securedata.user_id = "'" + H_data.user_id + "'";
	}

	if (H_data.user_password == "") {
		H_securedata.user_password = "null";
	} else {
		H_securedata.user_password = "'" + H_data.user_password + "'";
	}

	if (H_data.username == "") {
		H_securedata.username = "null";
	} else {
		H_securedata.username = "'" + H_data.username + "'";
	}

	if (H_data.username_kana == "") {
		H_securedata.username_kana = "null";
	} else {
		H_securedata.username_kana = "'" + H_data.username_kana + "'";
	}

	if (H_data.ip_phone_number == "") {
		H_securedata.ip_phone_number = "null";
	} else {
		H_securedata.ip_phone_number = "'" + H_data.ip_phone_number + "'";
	}

	if (H_data.ip_phone_number_view == "") {
		H_securedata.ip_phone_number_view = "null";
	} else {
		H_securedata.ip_phone_number_view = "'" + H_data.ip_phone_number_view + "'";
	}

	if (H_data.ip_phone_pass == "") {
		H_securedata.ip_phone_pass = "null";
	} else {
		H_securedata.ip_phone_pass = "'" + H_data.ip_phone_pass + "'";
	}

	if (H_data.terminal_id == "") {
		H_securedata.terminal_id = "null";
	} else {
		H_securedata.terminal_id = "'" + H_data.terminal_id + "'";
	}

	if (H_data.forward_pnumber2 == "") {
		H_securedata.forward_pnumber2 = "null";
	} else {
		H_securedata.forward_pnumber2 = "'" + H_data.forward_pnumber2 + "'";
	}

	if (H_data.forward_pnumber2_view == "") {
		H_securedata.forward_pnumber2_view = "null";
	} else {
		H_securedata.forward_pnumber2_view = "'" + H_data.forward_pnumber2_view + "'";
	}

	if (H_data.forward_pnumber3 == "") {
		H_securedata.forward_pnumber3 = "null";
	} else {
		H_securedata.forward_pnumber3 = "'" + H_data.forward_pnumber3 + "'";
	}

	if (H_data.forward_pnumber3_view == "") {
		H_securedata.forward_pnumber3_view = "null";
	} else {
		H_securedata.forward_pnumber3_view = "'" + H_data.forward_pnumber3_view + "'";
	}

	if (H_data.forward_pnumber4 == "") {
		H_securedata.forward_pnumber4 = "null";
	} else {
		H_securedata.forward_pnumber4 = "'" + H_data.forward_pnumber4 + "'";
	}

	if (H_data.forward_pnumber4_view == "") {
		H_securedata.forward_pnumber4_view = "null";
	} else {
		H_securedata.forward_pnumber4_view = "'" + H_data.forward_pnumber4_view + "'";
	}

	if (H_data.forward_pnumber5 == "") {
		H_securedata.forward_pnumber5 = "null";
	} else {
		H_securedata.forward_pnumber5 = "'" + H_data.forward_pnumber5 + "'";
	}

	if (H_data.forward_pnumber5_view == "") {
		H_securedata.forward_pnumber5_view = "null";
	} else {
		H_securedata.forward_pnumber5_view = "'" + H_data.forward_pnumber5_view + "'";
	}

	if (H_data.forward_pnumber6 == "") {
		H_securedata.forward_pnumber6 = "null";
	} else {
		H_securedata.forward_pnumber6 = "'" + H_data.forward_pnumber6 + "'";
	}

	if (H_data.forward_pnumber6_view == "") {
		H_securedata.forward_pnumber6_view = "null";
	} else {
		H_securedata.forward_pnumber6_view = "'" + H_data.forward_pnumber6_view + "'";
	}

	if (H_data.status == "") {
		H_securedata.status = "null";
	} else {
		H_securedata.status = H_data.status;
	}

	if (H_data.ip_status == "") {
		H_securedata.ip_status = "null";
	} else {
		H_securedata.ip_status = H_data.ip_status;
	}

	if (H_data.iapl_password == "") {
		H_securedata.iapl_password = "null";
	} else {
		H_securedata.iapl_password = "'" + H_data.iapl_password + "'";
	}

	if (H_data.authenticate_type == "") {
		H_securedata.authenticate_type = "null";
	} else {
		H_securedata.authenticate_type = "'" + H_data.authenticate_type + "'";
	}
};

function chkTime() {
	if (date("G") == MAINTENANCE) {
		sleep(SLEEPSEC);
		chkTime();
	}
};