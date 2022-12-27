
import { KCS_DIR } from "../../../conf/batch_setting";

//人事マスタファイルが転送されてくるディレクトリ
// error_reporting(E_ALL);// 2022cvt_011
export const FJP_DIR_FROM = KCS_DIR + "/data/hrpro/";
//人事マスタファイルをコピーする先の、前半部分(この下にYYYYMMディレクトリ)
export const FJP_DIR_TO_PRE = KCS_DIR + "/data/";
//人事マスタファイルのインポート成功後に移動する先(FJP_DIR_TO_PREの後に付く)
export const FJP_DIR_TO_FIN = "fin/";
//人事マスタファイルのインポート失敗後に移動する先(FJP_DIR_TO_PREの後に付く)
export const FJP_DIR_TO_FAIL = "fail/";
//人事マスタファイルをコピーする先の、後半部分
export const FJP_DIR_TO_POST = "/fjp_hrm/";
//設定ファイルが存在するディレクトリ(KCS_DIRの後に付く)
export const FJP_SETTING_DIR = "conf/";
//設定ファイル名
export const FJP_SETTING_NAME = "fjp_hrm_setting.csv";
//共通のエラーメッセージ
// const FJP_ERRMSG_COMMON = "\u4E88\u671F\u3057\u306A\u3044\u539F\u56E0\u3067\u3001\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30D5\u30A1\u30A4\u30EB\u306E\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u7FCC\u65E5\u306B\u518D\u5EA6\u5B9F\u884C\u3055\u308C\u307E\u3059";
export const FJP_ERRMSG_COMMON = "予期しない原因で、人事マスタファイルの取込に失敗しました。翌日に再度実行されます";
//人事ファイル名のデフォルト値
const FJP_FNAME_MASTER = "HRPRO_JINJI.CSV";
//ロックファイル名のデフォルト値
const FJP_FNAME_LOCK = "HRPRO_STATUS.CSV";
