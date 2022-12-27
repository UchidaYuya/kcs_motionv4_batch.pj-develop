require("MtCryptUtil.php");

var O_crypt = MtCryptUtil.singleton();
var passwd = "password";
print(O_crypt.getCrypt(passwd) + "\n");