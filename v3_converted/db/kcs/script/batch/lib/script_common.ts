//===========================================================================
//機能：定数定義
//
//作成：森原
//===========================================================================
//この設定ファイルには、本番とtryで同一の設定のみ記載して下さい。
//本番とtryで異なる内容は、../../conf/batch_setting.phpに記載して下さい。
//以下の相対パスを、絶対パスに修正しないで下さい。
//このscript_common.phpはWEB側とDB側で全く同一のファイルを使っています。
//絶対パスにした場合、WEB側のtry用バッチが本番DBを修正して危険です。
//---------------------------------------------------------------------------
//psqlへのパス
//nkfへのパス
//phpへのパス
//gzipへのパス
//lhaへのパス
//ドコモインポート時のCSVファイル出力先(%sはyyyymmddhhmmssに置換される)
//科目が無い場合に使用する顧客ID
//按分を使用しない権限ID
//複数回按分を使用する権限ID
//消費税率
//ドコモポイント算出比率
//ドコモMOVAのパケット単価
//ドコモFOMAのパケット単価
//パケットのバイト数
//すべての電話会社
//DOCOMO
//DDI
//AU
//Vodafone=Softbank
//KDDI固定
//不明な電話会社
//その他の電話会社
//DOCOMOの回線種別
//AUの回線種別
//ドコモ地域会社その他
//地域会社不明
//回線種別不明
//基本料の科目
//未定義の科目
//消費税の科目
//科目総数
//省略時科目の割引金額
//ASP利用料金
//ASP利用料金（税込）
//同税額
//税額（ＤＤＩで使用）
//ASP使用料を表示するか
//相手先種別がドコモから見て不明
//相手先種別がドコモから見て自社携帯
//相手先種別がドコモから見て他社携帯
//相手先種別がドコモから見て自社PHS
//相手先種別がドコモから見て他社PHS
//相手先種別がドコモから見て固定電話
//統計種別が通話秒数
//統計種別が相手先種別
//統計種別が時間帯
//統計種別がパケット種別(iモードか否か)
//clampfile_tbが未ダウンロード
//clampfile_tbがダウンロード中
//clampfile_tbがダウンロード完了
//clampfile_tbがコピー中
//clampfile_tbがインポート完了
//clampfile_tbがエラー
//clampfile_tbがDLファイルが無かった
//clampfile_tbが科目計算まで終わった
//clampfile_tbがシミュレーションまで終わった
//ドコモの通話明細の種別一覧
//同・請求明細と情報料明細の種別
//同・請求書情報の種別
//パケホーダイと組み合わせて使用可能なプラン名
//パケホーダイのパケットパック名
//旧標準プランを表すplan_tb.simway
//旧拡張プランを表すplan_tb.simway
//旧長得プランを表すplan_tb.simway
//旧データプランを表すplan_tb.simway
//2005年6月より追加されたデータプランを表すplan_tb.simway
//2005年11月より追加された標準プランを表すplan_tb.simway
//2005年11月より追加された拡張プランを表すplan_tb.simway
//AUデータプランを表すplan_tb.simway
//AU旧プランを表すplan_tb.simway
//AUシミュレーションの平日昼間利用率のデフォルト値
//顧客単位のデフォルト値も無い場合に使用する
//シミュレーションに通信料として扱う内訳(カンマで区切って複数指定)
//顧客単位でのベースとなる公私が未設定の場合の値
//公私権限
//基本料がマイナスの場合に、別コードに置き換えるための対応表。
//キャリアIDと置換前コードと置換後コードをカンマで区切り、
//それらをスラッシュでつないだものを使用する。
//たとえば「1,001,ZZ1/2,002,ZZ2」なら、
//キャリアIDが1のコード001のマイナスはZZ1になり、
//キャリアIDが2のコード002のマイナスはZZ2に置き換えられる。
//暗号化キー
//WEBマシンで動作可能
//DBマシンで動作可能
//WEBマシンとDBマシンの両方で動作可能
//機能：クライアントの動作環境が正しいか検査する
//引数：クライアントの動作環境("web"か"db"か"both")
//備考：正しくなければエラーメッセージを出して異常終了する

require("../../conf/batch_setting.php");

const G_PSQL = "/usr/local/pgsql/bin/psql";
const G_NKF = "/usr/bin/nkf";
const G_PHP = "/usr/local/bin/php";
const G_GZIP = "/bin/gzip";
const G_LHA = "/usr/bin/lha";
const G_DOCOMO_ALERT_CSV = KCS_DIR + "/data/outcsv/docomo_alert_%s.csv";
const G_PACTID_DEFAULT = 0;
const G_FNCID_STOP_MT = 45;
const G_FNCID_MULTI_MT = 46;
const G_EXCISE_RATE = 0.08;
const G_POINT_RATIO = 0.01;
const G_PACKET_CHARGE = 0.3;
const G_PACKET_CHARGE_FOMA = 0.2;
const G_PACKET_SIZE = 128;
const G_CARRIER_ALL = 0;
const G_CARRIER_DOCOMO = 1;
const G_CARRIER_DDI = 2;
const G_CARRIER_AU = 3;
const G_CARRIER_VODA = 4;
const G_CARRIER_KDDI_KOTEI = 16;
const G_CARRIER_UNKNOWN = 99;
const G_CARRIER_OTHER = 10;
const G_CIRCUIT_FOMA = 1;
const G_CIRCUIT_MOVA = 2;
const G_CIRCUIT_PHS = 3;
const G_CIRCUIT_CITY = 4;
const G_CIRCUIT_DOCOMO_OTHER = 5;
const G_CIRCUIT_DOCOMO_EISEI = 24;
const G_CIRCUIT_DOCOMO_XI = 79;
const G_CIRCUIT_AU_CDMA = 8;
const G_CIRCUIT_AU_WIN = 9;
const G_CIRCUIT_AU_OTHER = 10;
const G_CIRCUIT_AU_LTE = 78;
const G_AREA_DOCOMO_UNKNOWN = 29;
const G_AREA_UNKNOWN = 0;
const G_CIRCUIT_UNKNOWN = 0;
const G_KAMOKU_BASIC = 0;
const G_KAMOKU_DEFAULT = 8;
const G_KAMOKU_EXCISE = 9;
const G_KAMOKU_LIMIT = 10;
const G_KAMOKU_DISCOUNT = 2;
const G_CODE_ASP = "ASP";
const G_CODE_ASPX = "ASPX";
const G_CODE_ASX = "ASX";
const G_CODE_TAX = "TAX";
const G_AUTH_ASP = 2;
const G_RECID_DOCOMO_OTHER = 0;
const G_RECID_DOCOMO_OWN = 1;
const G_RECID_DOCOMO_AWAY = 2;
const G_RECID_DOCOMO_OWN_PHS = 3;
const G_RECID_DOCOMO_AWAY_PHS = 4;
const G_RECID_DOCOMO_FIX = 5;
const G_TREND_SEC = 0;
const G_TREND_RECID = 1;
const G_TREND_TIMEZONE = 2;
const G_TREND_PACKET = 3;
const G_CLAMPFILE_STATUS_START = 0;
const G_CLAMPFILE_STATUS_RUNNING = 1;
const G_CLAMPFILE_STATUS_DOWNLOAD = 2;
const G_CLAMPFILE_STATUS_COPY = 3;
const G_CLAMPFILE_STATUS_IMPORT = 4;
const G_CLAMPFILE_STATUS_ERROR = 5;
const G_CLAMPFILE_STATUS_EMPTY = 6;
const G_CLAMPFILE_STATUS_CALC = 7;
const G_CLAMPFILE_STATUS_SIM = 8;
const G_CLAMP_DOCOMO_COMM_TYPE = "RMT,RMP,RMK,RML,RMS,RMF,RMA,RMW,RMJ,RMN,RMR,RMG";
const G_CLAMP_DOCOMO_TEL_TYPE = "MB";
const G_CLAMP_DOCOMO_INFO_TYPE = "RMI";
const G_CLAMP_DOCOMO_BILL_TYPE = "BL";
const G_PAKEHODAI_PLANNAME = "\u30BF\u30A4\u30D7SS,\u30BF\u30A4\u30D7S,\u30BF\u30A4\u30D7M,\u30BF\u30A4\u30D7L,\u30BF\u30A4\u30D7LL,\u30BF\u30A4\u30D7\uFF33,\u30BF\u30A4\u30D7\uFF33\uFF33,\u30BF\u30A4\u30D7\uFF2D,\u30BF\u30A4\u30D7\uFF2C,\u30BF\u30A4\u30D7\uFF2C\uFF2C,\u30BF\u30A4\u30D7\u30D3\u30B8\u30CD\u30B9";
const G_PAKEHODAI_PACKETNAME = "\u30D1\u30B1\u30FB\u30DB\u30FC\u30C0\u30A4";
const G_SIMWAY_OLD_STANDARD = 0;
const G_SIMWAY_OLD_EXTEND = 1;
const G_SIMWAY_OLD_CHOTOKU = 2;
const G_SIMWAY_DATA_OLD = 4;
const G_SIMWAY_DATA_NEW = 5;
const G_SIMWAY_NEW_STANDARD = 6;
const G_SIMWAY_NEW_EXTEND = 7;
const G_SIMWAY_AU_DATA = 3;
const G_SIMWAY_AU_OLD = 8;
const G_AU_SIM_DAYTIME_RATIO = 70;
const G_DOCOMO_SIM_DAYTIME_RATIO = 70;
const G_UTIWAKE_COMM = "2P6,2P7";
const G_BASE_KOUSI = "0";
const G_AUTH_KOUSI = 47;
const G_CALC_MINUS_REPLACE = "1,001,D001/1,200,D200/1,F02,DF02/1,F04,DF04";
const KCSMOTION_KEY = "kcsmotion";
const G_CLIENT_WEB = "web";
const G_CLIENT_DB = "db";
const G_CLIENT_BOTH = "both";

function checkClient(req_env) //何もしない
{};