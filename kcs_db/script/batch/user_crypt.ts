import {ScriptDB} from "./lib/script_db";
import {G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING, ScriptLogBase, ScriptLogFile} from "./lib/script_log";
import {} from "./lib/script_common";
import CryptUtil from "./lib/CryptUtil";

const SCRIPTNAME = "user_crypt.ts";
const fs = require("fs");
// パラメータチェック
// 数が正しくない
if (process.argv.length != 3) //数が正しい
        {
                usage("");
        }
        // 数が正しい 
        else {
        var pactid: any = process.argv[2].replace("-p=","");
}
// ログListener を作成
const log_listener = new ScriptLogBase(0);
// ログファイル名、ログ出力タイプを設定
const log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
// ログListener にログファイル名、ログ出力タイプを渡す
log_listener.putListener(log_listener_type);
// DBハンドル作成
const dbh = new ScriptDB(log_listener);
// 暗号化オブジェクト作成
const O_crypt = new CryptUtil();
const select_sql = "select pactid,userid,loginid,passwd from user_tb where pactid = " + pactid;
const cryptFile = "kcs_db/batch/passwd/user_crypt_" + pactid + ".sql";
const decryptFile = "kcs_db/batch/passwd/user_decrypt_" + pactid + ".sql";
const fha = fs.openSync(cryptFile, "w");
const fhb = fs.openSync(decryptFile, "w");
(async ()=>{
        let H_user = await dbh.getHash(select_sql);
        console.log(0,"H_user",H_user); //test DB
        for (let i = 0; i < H_user.length; i++) {
                let decrypt_sql = "";
                let crypt_sql = "";
                let crypt_pwd = O_crypt.getCrypt(H_user[i].passwd);
                crypt_sql = "update user_tb set passwd = '" + crypt_pwd + "' where userid = " + H_user[i].userid + " and pactid = " + H_user[i].pactid + " and loginid = '" + H_user[i].loginid + "';\n";
                fs.writeSync(fha, crypt_sql);
                decrypt_sql = "update user_tb set passwd = '" + H_user[i].passwd + "' where userid = " + H_user[i].userid + " and pactid = " + H_user[i].pactid + " and loginid = '" + H_user[i].loginid + "';\n";
                fs.writeSync(fhb, decrypt_sql);
        }

fs.closeSync(fha); 
fs.closeSync(fhb);
console.log("\nＳＱＬ生成完了\n");
console.log(cryptFile + "\n" + decryptFile + "\n\n");
// throw process.exit(0);
})();


// 使用説明
// [引数] $comment 表示メッセージ
// [返り値] 終了コード1（失敗）
function usage(comment: string) {
        if (comment == "") {
                comment = "パラメータが不正です";
        }

        console.log("\n" + comment + "\n\n");
        console.log("Usage) " + SCRIPTNAME + " -p={PACTID}\n");
        console.log("         -p 契約ＩＤ     (PACTID:指定した契約ＩＤのみ実行)\n\n");
        throw process.exit(1);
};