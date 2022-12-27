#!/usr/local/bin/php
//---------------------------------------------------------------------------
//共通ログファイル名
//ローカルログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//セッションカウント処理の開始をログファイルに出力(共通ログ)
//スタートログの出力(ローカルログ)
//テーブルの数だけループ
//処理終了を出力(共通ログ)
//処理終了を出力(ローカルログ)
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ローカルのログを出力する
//[引　数] $lstr：出力する文字列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
echo("\n");
error_reporting(E_ALL);
const DEBUG_FLG = 1;
const SCRIPT_FILENAME = "check_injustice_data.php";

require("lib/script_db.php");

require("lib/script_log.php");

var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var LocalLogFile = KCS_DIR + "/log/batch/check_injustice_data.log";
var log_listener = new ScriptLogBase(0);
var log_listener_typeView = new ScriptLogFile(G_SCRIPT_ERROR | G_SCRIPT_WARNING, "STDOUT");
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_typeView);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_FILENAME + " \u4E3B\u7AEF\u672B\u3001\u8907\u6570\u540C\u4E00\u56DE\u7DDA\u30C1\u30A7\u30C3\u30AF\u30FB\u4E3B\u7AEF\u672B\u306E\u672A\u767B\u9332\u56DE\u7DDA\u30C1\u30A7\u30C3\u30AF\u3092\u958B\u59CB\u3057\u307E\u3059\u3002\n");
if (DEBUG_FLG) logging("START: \u4E3B\u7AEF\u672B\u3001\u8907\u6570\u540C\u4E00\u56DE\u7DDA\u30C1\u30A7\u30C3\u30AF\u30FB\u4E3B\u7AEF\u672B\u306E\u672A\u767B\u9332\u56DE\u7DDA\u30C1\u30A7\u30C3\u30AF(check_injustice_data.php)\u3092\u958B\u59CB\u3057\u307E\u3059\u3002\n", true);
var err_cnt = 0;

for (var l_cnt = 0; l_cnt < 25; l_cnt++) //1番はじめのループにて、最新のテーブルをセット(_XXがないため)
//テーブル名をセット
//テーブルに登録されているレコードを全てセット
//主端末として登録されているレコードをセット
//同一回線にて、複数主端末として登録されているデータをセット
//上記レコードをカウント
//同一回線にて、主端末が未登録のデータをセット
//上記レコードをカウント
//1件目のデータだったときのみ、ヘッダーを出力
//テーブルに登録されているレコードの総件数と、主端末として登録されているレコードを出力(共通ログ)
//同一回線にて、複数主端末として登録されているレコードの件数を出力(共通ログ)
//同一回線にて、複数主端末として登録されているレコードのデータを格納する変数
//入れ子の連想配列からデータをセット($key1:変数、$H_count:連想配列)
//主端末が未登録な回線の総件数が0件ではない場合に出力(共通ログ)
//主端末が未登録な件数を出力(共通ログ)
//主端末が未登録な回線のデータを格納する変数
//入れ子の連想配列からデータをセット($key3:変数、$H_count2:連想配列)
{
    if (l_cnt == 0) {
        var tableNo = "";
    } else if (l_cnt > 0 and l_cnt < 10) {
        tableNo = "0" + l_cnt + "_";
    } else {
        tableNo = l_cnt + "_";
    }

    var telrelassetsX_tb = "tel_rel_assets_" + tableNo + "tb";
    var tel_cnt_all = dbh.getOne("select count(*) from " + telrelassetsX_tb + ";", true);
    var tel_cnt = dbh.getOne("select count(*) from " + telrelassetsX_tb + " where main_flg='t';", true);
    var H_tel_count = dbh.getHash("select pactid, telno, carid from " + telrelassetsX_tb + " where main_flg='t' group by pactid, telno, carid having count(*) >= 2;", true);
    var tel_cnt_count = H_tel_count.length;
    var H_tel_count2 = dbh.getHash("select pactid, telno, carid from " + telrelassetsX_tb + " where (pactid, telno, carid) in (select pactid, telno, carid from " + telrelassetsX_tb + " group by pactid, telno, carid having count(*) = 1) and main_flg = 'f';", true);
    var tel_cnt_count2 = H_tel_count2.length;

    if (err_cnt == 0) //テーブルに登録されているレコードの総件数が0件ではない、もしくは、主端末として登録されているレコードが0件ではない場合のみ処理開始を出力(共通ログ)
        {
            if (tel_cnt_count != 0 or tel_cnt_count2 != 0) {
                logh.putError(G_SCRIPT_WARNING, "\u4E3B\u7AEF\u672B\u3001\u8907\u6570\u540C\u4E00\u56DE\u7DDA\u3001\u3082\u3057\u304F\u306F\u4E3B\u7AEF\u672B\u306E\u672A\u767B\u9332\u56DE\u7DDA\u304C\u3054\u3056\u3044\u307E\u3059\u3002\n\u8A73\u3057\u304F\u306F\u3001" + KCS_DIR + "/log/batch/check_injustice_data.log\u3092\u3054\u89A7\u304F\u3060\u3055\u3044\u3002\n");
                err_cnt = 1;
            }
        }

    if (tel_cnt_count != 0) {
        logh.putError(G_SCRIPT_WARNING, telrelassetsX_tb + " \u306E\u4E3B\u7AEF\u672B\u3001\u8907\u6570\u540C\u4E00\u56DE\u7DDA\u306F" + tel_cnt_count + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01");
    }

    if (DEBUG_FLG) logging("INFO : " + telrelassetsX_tb + " \u306E\u767B\u9332\u7DCF\u6570\u3001\u5168" + tel_cnt_all + "\u4EF6\u4E2D\u3001\u4E3B\u7AEF\u672B\u306F" + tel_cnt + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01", false);

    if (tel_cnt_count != 0) {
        if (DEBUG_FLG) logging("INFO : " + telrelassetsX_tb + " \u306E\u4E3B\u7AEF\u672B\u3001\u8907\u6570\u540C\u4E00\u56DE\u7DDA\u306F" + tel_cnt_count + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01", false);
    } else {
        if (DEBUG_FLG) logging("INFO : \u91CD\u8907\u306F\u3042\u308A\u307E\u305B\u3093", false);
    }

    logh.putError(G_SCRIPT_INFO, telrelassetsX_tb + "\u767B\u9332\u7DCF\u6570\u3001\u5168" + tel_cnt_all + "\u4EF6\u4E2D\u3001\u4E3B\u7AEF\u672B\u306F" + tel_cnt + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01");
    logh.putError(G_SCRIPT_INFO, telrelassetsX_tb + " \u306E\u4E3B\u7AEF\u672B\u3001\u8907\u6570\u540C\u4E00\u56DE\u7DDA\u306F" + tel_cnt_count + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01");
    var d_cnt = "";

    for (var key1 in H_tel_count) //連想配列からデータをセット($key2:カラムの表題、カラムの内容)
    //$cは0からはじまるため、件数表示の為に+1をしてセット
    //エラー内容を出力(ローカルログ)
    {
        var H_count = H_tel_count[key1];

        for (var key2 in H_count) //カラムの区切り(,)を判別(1カラム目の場合のみ区切りを入れない)
        //表題=カラム内容となるようにセット
        {
            var val2 = H_count[key2];

            if (d_cnt == "") {} else {
                d_cnt = d_cnt + ", ";
            }

            d_cnt = d_cnt + key2 + " = " + val2;
        }

        var no_cnt = key1 + 1;
        if (DEBUG_FLG) logging("INFO : " + no_cnt + "\u4EF6\u76EE\uFF1A" + d_cnt, false);
        d_cnt = "";
    }

    if (tel_cnt_count2 != 0) {
        logh.putError(G_SCRIPT_WARNING, telrelassetsX_tb + " \u306E\u4E3B\u7AEF\u672B\u304C\u672A\u767B\u9332\u306A\u56DE\u7DDA\u306F" + tel_cnt_count2 + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01");
    }

    if (tel_cnt_count2 != 0) {
        if (DEBUG_FLG) logging("INFO : " + telrelassetsX_tb + " \u306E\u4E3B\u7AEF\u672B\u304C\u672A\u767B\u9332\u306A\u56DE\u7DDA\u306F" + tel_cnt_count2 + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01", false);
    } else {
        if (DEBUG_FLG) logging("INFO : \u672A\u767B\u9332\u306E\u56DE\u7DDA\u306F\u3042\u308A\u307E\u305B\u3093", false);
    }

    logh.putError(G_SCRIPT_INFO, telrelassetsX_tb + " \u306E\u4E3B\u7AEF\u672B\u304C\u672A\u767B\u9332\u306A\u56DE\u7DDA\u306F" + tel_cnt_count2 + "\u4EF6\u3042\u308A\u307E\u3057\u305F\uFF01");
    var d_cnt2 = "";

    for (var key3 in H_tel_count2) //連想配列からデータをセット($key2:カラムの表題、カラムの内容)
    //$cは0からはじまるため、件数表示の為に+1をしてセット
    //エラー内容を出力(ローカルログ)
    {
        var H_count2 = H_tel_count2[key3];

        for (var key4 in H_count2) //カラムの区切り(,)を判別(1カラム目の場合のみ区切りを入れない)
        //表題=カラム内容となるようにセット
        {
            var val3 = H_count2[key4];

            if (d_cnt2 == "") {} else {
                d_cnt2 = d_cnt2 + ", ";
            }

            d_cnt2 = d_cnt2 + key4 + " = " + val3;
        }

        var no_cnt2 = key3 + 1;
        if (DEBUG_FLG) logging("INFO : " + no_cnt2 + "\u4EF6\u76EE\uFF1A" + d_cnt2, false);
        d_cnt2 = "";
    }
}

logh.putError(G_SCRIPT_END, SCRIPT_FILENAME + " \u4E3B\u7AEF\u672B\u3001\u8907\u6570\u540C\u4E00\u56DE\u7DDA\u30C1\u30A7\u30C3\u30AF\u30FB\u4E3B\u7AEF\u672B\u306E\u672A\u767B\u9332\u56DE\u7DDA\u30C1\u30A7\u30C3\u30AF\u3092\u7D42\u4E86\u3057\u307E\u3057\u305F\u3002\n");
if (DEBUG_FLG) logging("END: \u4E3B\u7AEF\u672B\u3001\u8907\u6570\u540C\u4E00\u56DE\u7DDA\u30C1\u30A7\u30C3\u30AF\u30FB\u4E3B\u7AEF\u672B\u306E\u672A\u767B\u9332\u56DE\u7DDA\u30C1\u30A7\u30C3\u30AF(check_injustice_data.php)\u3092\u7D42\u4E86\u3057\u307E\u3059\u3002", false);
throw die(0);

function logging(lstr, clear_txt) //日時をエラー内容の前に出力
//1行目の出力の前にlogファイルの中身を削除
{
    var log_buf = date("Y/m/d H:i:s") + " : " + lstr + "\n";

    if (clear_txt == true) {
        var lfp = fopen(GLOBALS.LocalLogFile, "w");
    } else {
        lfp = fopen(GLOBALS.LocalLogFile, "a");
    }

    flock(lfp, LOCK_EX);
    fwrite(lfp, log_buf);
    flock(lfp, LOCK_UN);
    fclose(lfp);
    return;
};