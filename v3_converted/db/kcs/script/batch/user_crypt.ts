//===========================================================================
//ユーザパスワード暗号、復号ＳＱＬ出力
//
//
//===========================================================================
//パラメータチェック
//数が正しくない
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//暗号化オブジェクト作成
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
error_reporting(E_ALL);

require("./lib/script_db.php");

require("./lib/script_log.php");

require("./lib/script_common.php");

require("./lib/CryptUtil.php");

const SCRIPTNAME = "user_crypt.php";

if (_SERVER.argv.length != 2) //数が正しい
        {
                usage("");
        } else {
        var pactid = _SERVER.argv[1];
}

var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR, "STDOUT");
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var O_crypt = new CryptUtil();
var select_sql = "select pactid,userid,loginid,passwd from user_tb where pactid = " + pactid;
var H_user = dbh.getHash(select_sql);
var cryptFile = "/kcs/script/batch/passwd/user_crypt_" + pactid + ".sql";
var decryptFile = "/kcs/script/batch/passwd/user_decrypt_" + pactid + ".sql";
var fha = fopen(cryptFile, "w");
var fhb = fopen(decryptFile, "w");

for (var i = 0; i < H_user.length; i++) {
        var decrypt_sql = "";
        var crypt_sql = "";
        var crypt_pwd = O_crypt.getCrypt(H_user[i].passwd);
        crypt_sql = "update user_tb set passwd = '" + crypt_pwd + "' where userid = " + H_user[i].userid + " and pactid = " + H_user[i].pactid + " and loginid = '" + H_user[i].loginid + "';\n";
        fputs(fha, crypt_sql);
        decrypt_sql = "update user_tb set passwd = '" + H_user[i].passwd + "' where userid = " + H_user[i].userid + " and pactid = " + H_user[i].pactid + " and loginid = '" + H_user[i].loginid + "';\n";
        fputs(fhb, decrypt_sql);
}

fclose(fha);
fclose(fhb);
print("\n\uFF33\uFF31\uFF2C\u751F\u6210\u5B8C\u4E86\n");
print(cryptFile + "\n" + decryptFile + "\n\n");
throw die(0);

function usage(comment) {
        if (comment == "") {
                comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
        }

        print("\n" + comment + "\n\n");
        print("Usage) " + SCRIPTNAME + " -p={PACTID}\n");
        print("         -p \u5951\u7D04\uFF29\uFF24     (PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n\n");
        throw die(1);
};

echo("\n");