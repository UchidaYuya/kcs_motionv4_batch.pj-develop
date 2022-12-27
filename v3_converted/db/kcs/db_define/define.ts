//===========================================================================
//機能：DB用　定数　グローバル変数集
//
//作成：石崎
//===========================================================================
//KCS(data)
//ログ出力先
//admin_docomo_db>ログ出力先
//admin_docomo_webログ出力先
//手動import_docomo>ログ出力先
//recalc>ログ出力先
//作業フォルダ
//インポート後の移動先
//メール送信先
//define("G_MAIL_TO", "batch_error@mail.localnetwork");//警告メール送付アドレス
//警告メール送付アドレス
//警告メール送信先メーリングリスト
//mail_sender_add_kcs.php用 20130605前田
//警告メール送信元
//警告メール送信アドレス(Bcc専用)
//メールサーバー設定
//メール送信先
//メール送信ポート
//セキュア電話帳管理者ＩＤ
//セキュア電話帳管理者パスワード
//バッチのディレクトリ
//au取り込み
//Fusion 定数
//請求情報処理スクリプト.
//通話明細処理スクリプト.
//NTT-Com 定数
//請求情報処理スクリプト.
//通話明細処理スクリプト.
//NTTCOM
//固定電話処理スクリプト.
//国際電話処理スクリプト.
//請求情報処理スクリプト.
//固定電話処理スクリプト.
//NTT東日本
//請求情報処理スクリプト.
//通話明細処理スクリプト.
//prime,custrom処理スクリプト.
//ダイアルイン処理スクリプト.
//NTT西日本
//請求情報処理スクリプト.
//通話明細処理スクリプト.
//prime,custrom処理スクリプト.
//ダイアルイン処理スクリプト.
//SoftBank
//請求情報処理スクリプト.
//請求情報処理スクリプト.
//通話明細処理スクリプト.
//金額調整バッチ（adjust_bill_batch.php）で使う割引率
const DATA_DIR = KCS_DIR + "/data";
const DATA_LOG_DIR = DATA_DIR + "/log";
const DATA_EXP_DIR = DATA_DIR + "/exp";
const G_LARGEOBJECT_PATH = KCS_DIR + "/data/strage/";
const G_LOG = KCS_DIR + "/log/batch/";
const G_LOG_ADMIN_DOCOMO_DB = KCS_DIR + "/log/batch_clamp/";
const G_LOG_ADMIN_DOCOMO_WEB = KCS_DIR + "/log/batch_web/";
const G_LOG_HAND = KCS_DIR + "/log/batch_hand/";
const G_LOG_RECALC = KCS_DIR + "/log/batch_recalc/";
const G_WORK_DIR = KCS_DIR + "/log/batch_work/";
const G_OPERATOR_LOGFILE = KCS_DIR + "/data/log/billbat.log";
const G_CLAMP_DOCOMO_FIN = KCS_DIR + "/data/@y/docomo/@p/fin/";
const G_MAIL_TO = "batch_error@kcs-next-dev.com";
const G_MAILINGLIST = "batch_error@kcs-next-dev.com";
const G_MAILINGLIST_ADD_KCS = "batch_error@kcs-next-dev.com,kcsmotion@kcs.ne.jp";
const G_MAIL_FROM = "batch_error@kcs-next-dev.com";
const G_MAIL_BCC = "bcc@kcs-next-dev.com,kcsmotion@kcs.ne.jp";
const G_SMTP_HOST = "localhost";
const G_SMTP_PORT = 25;
const G_SECURE_ADMIN_ID = "admin";
const G_SECURE_ADMIN_PASSWORD = "8kzdbbk";
const BAT_DIR = KCS_DIR + "/script/batch";
const SCRIPT_DIR = KCS_DIR + "/script";
const SCRIPT_AU_BILL = BAT_DIR + "/import_aubill.php";
const SCRIPT_AU_TUWA = BAT_DIR + "/import_autuwa.php";
const IMPORT_FUSION_BILL = BAT_DIR + "/import_fusion_bill.php";
const IMPORT_FUSION_TUWA = BAT_DIR + "/import_fusion_tuwa.php";
const IMPORT_NTTCOM_BILL = BAT_DIR + "/import_nttcom_bill.php";
const IMPORT_NTTCOM_TUWA = BAT_DIR + "/import_nttcom_tuwa.php";
const IMPORT_NTTCOM_FIX = BAT_DIR + "/import_nttcom_fix.php";
const IMPORT_NTTCOM_INT = BAT_DIR + "/import_nttcom_int.php";
const IMPORT_NTTCOM_WLD_BILL = BAT_DIR + "/import_nttcom_wld_bill.php";
const IMPORT_NTTCOM_WLD = BAT_DIR + "/import_nttcom_wld_subill.php";
const IMPORT_NTTEAST_BILL = BAT_DIR + "/import_ntteast_bill.php";
const IMPORT_NTTEAST_TUWA = BAT_DIR + "/import_ntteast_tuwa.php";
const IMPORT_NTTEAST_PRCS = BAT_DIR + "/import_ntteast_prcs.php";
const IMPORT_NTTEAST_DIAL = BAT_DIR + "/import_ntteast_dial.php";
const IMPORT_NTTWEST_BILL = BAT_DIR + "/import_nttwest_bill.php";
const IMPORT_NTTWEST_TUWA = BAT_DIR + "/import_nttwest_tuwa.php";
const IMPORT_NTTWEST_PRCS = BAT_DIR + "/import_nttwest_prcs.php";
const IMPORT_NTTWEST_DIAL = BAT_DIR + "/import_nttwest_dial.php";
const IMPORT_VODA_BILL = BAT_DIR + "/import_voda_bill.php";
const IMPORT_SOFTBANK_BILL = SCRIPT_DIR + "/ImportSoftBankBill.php";
const IMPORT_VODA_TUWA = BAT_DIR + "/import_voda_tuwa.php";
const ADJUSTMENT_RATE = 0.05;