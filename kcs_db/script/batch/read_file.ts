//
//引数で渡されたファイルを読み出すだけのphp
//mail_sender.phpにphpの出力結果を渡すために作成
//作成 20090910miya
//
// system("cat " + argv[1]);
const fs = require('fs');
fs.readdirSync("cat " + process.argv[1]);

