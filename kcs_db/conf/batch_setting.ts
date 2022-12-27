const fs = require("fs");
const path = require("path");

export const KCS_DIR = "./kcs_db";
export const G_IS_TRY = 0;
export const G_CLAMP_ENV = 0;
export const G_CLAMP_ADMIN = 4;
export const G_SUBJECT_V2 = "バッチエラー(KMCheck環境)";
export const G_DB_USER = "web";
export const G_DB_HOST = "aurora-dev-motion.cluster-cmwdfdtv91eu.ap-northeast-1.rds.amazonaws.com";
export const G_DB_TYPE = "pgsql";
export const G_DB_PASS = fs.readFileSync(path.join("../../conf/dbpassw"), "utf-8").trim();
export const G_DB_NAME = "motion-v4batch";
global.G_dsn = {
    user: G_DB_USER,
    host: G_DB_HOST,
    database: G_DB_NAME,
    password: G_DB_PASS,
    port: 5432
}
export const G_DB_USER_TEMP = "web";
export const G_DB_HOST_TEMP = "aurora-dev-motion.cluster-cmwdfdtv91eu.ap-northeast-1.rds.amazonaws.com";
export const G_DB_TYPE_TEMP = "pgsql";
export const G_DB_PASS_TEMP = fs.readFileSync(path.join("../../conf/dbpassw"), "utf-8").trim();
export const G_DB_NAME_TEMP = "motion-v4batch";
global.G_dsn_temp = {
    user: G_DB_USER_TEMP,
    host: G_DB_HOST_TEMP,
    database: G_DB_NAME_TEMP,
    password: G_DB_PASS_TEMP,
    port: 5432
}
export const G_MAIL_TYPE = "KMCheck環境";
export const G_MAIL_SUBJECT = "バッチエラー(KMCheck環境)";
export const G_MAIL_ADMIN = "kcsmotion@kcs.ne.jp";
export const G_USE_PG_POOL_DSN = 0;

export const PGPOOL_NO_INSERT_LOCK = ""; // 見つかりませんので、とりあえず　””　にする