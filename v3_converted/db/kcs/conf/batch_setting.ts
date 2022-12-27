//===========================================================================
//機能：マシン毎に異なる設定
//
//作成：森原
//===========================================================================
//バッチの内部動作はEUC-JP
//KCS(DB)ディレクトリ
//標準出力をUTF-8にするための設定
//以下のini_setは効かないことがある。
//確実のため、設定はphp.iniの中に記述した
//ini_set("output_buffering","1");	//出力文字コード変換有効
//ini_set("output_handler","mb_output_handler");
//ini_set("mbstring.http_output","UTF-8");
//try環境なら1/本番環境なら0
//try・本番の識別番号
//ログインチェック用に用いるpactid
//V2へのエラーメールのタイトル
//接続先のDBタイプ
//DBマシンのIPとポート番号
//define("G_DB_USER", "web");//DB接続ユーザ名
//define("G_DB_PASS", trim(file_get_contents("/nfs/web/kcs/conf/dbpassw")));//DB接続パスワード
//DB接続ユーザ名
//DB接続パスワード
//使用するデータベース名
//一時TBの接続先のDBタイプ
//一時TBのDBマシンのIPとポート番号
//一時TBのDB接続ユーザ名
//DB接続パスワード
//一時TBの使用するデータベース名
//メール送信元ファセット
//開発者エラーメール
//au、SBのエラーメールが飛ぶ管理者メールアドレス 20100909miya
//pg_poolを利用していれば1
putenv("PGCLIENTENCODING=UTF-8");
const KCS_DIR = "/kcs_db";

require("define.php");

const G_IS_TRY = 0;
const G_CLAMP_ENV = 0;
const G_CLAMP_ADMIN = 4;
const G_SUBJECT_V2 = "\u30D0\u30C3\u30C1\u30A8\u30E9\u30FC(KMCheck\u74B0\u5883)";
const G_DB_TYPE = "pgsql";
const G_DB_HOST = "localhost:5432";
const G_DB_USER = "postgres";
const G_DB_PASS = file_get_contents("/kcs/conf/dbpassp").trim();
const G_DB_NAME = "check-kcsmotion";
GLOBALS.G_dsn = G_DB_TYPE + "://" + G_DB_USER + ":" + G_DB_PASS + "@" + G_DB_HOST + "/" + G_DB_NAME;
const G_DB_TYPE_TEMP = "pgsql";
const G_DB_HOST_TEMP = "localhost:5432";
const G_DB_USER_TEMP = "web";
const G_DB_PASS_TEMP = file_get_contents("/kcs/conf/dbpassw").trim();
const G_DB_NAME_TEMP = "check-kcsmotion-storage";
GLOBALS.G_dsn_temp = G_DB_TYPE_TEMP + "://" + G_DB_USER_TEMP + ":" + G_DB_PASS_TEMP + "@" + G_DB_HOST_TEMP + "/" + G_DB_NAME_TEMP;
const G_MAIL_TYPE = "KMCheck\u74B0\u5883";
const G_MAIL_SUBJECT = "\u30D0\u30C3\u30C1\u30A8\u30E9\u30FC(KMCheck\u74B0\u5883)";
const G_MAIL_ADMIN = "kcsmotion@kcs.ne.jp";
const G_USE_PG_POOL_DSN = 0;