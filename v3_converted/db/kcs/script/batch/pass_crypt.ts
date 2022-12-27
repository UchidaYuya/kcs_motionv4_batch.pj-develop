//===========================================================================
//パスワード暗号
//
//
//===========================================================================
//パラメータチェック
//数が正しくない
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
error_reporting(E_ALL);

require("./lib/CryptUtil.php");

const SCRIPTNAME = "user_crypt.php";

if (_SERVER.argv.length != 2) {
        usage("");
}

var O_crypt = new CryptUtil();
print("\n\u6697\u53F7\u30D1\u30B9\u30EF\u30FC\u30C9 ===> " + O_crypt.getCrypt(_SERVER.argv[1]) + "\n\n");
throw die(0);

function usage(comment) {
        if (comment == "") {
                comment = "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
        }

        print("\n" + comment + "\n\n");
        print("Usage) " + SCRIPTNAME + " \u6697\u53F7\u3059\u308B\u30D1\u30B9\u30EF\u30FC\u30C9\n\n");
        throw die(1);
};

echo("\n");