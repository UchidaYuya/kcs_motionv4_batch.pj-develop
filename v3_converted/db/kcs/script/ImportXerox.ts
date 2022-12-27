//
//Xeroxインポートバッチ
//
//更新履歴：<br>
//2013/04/18 五十嵐 作成
//
//@package script
//@author igarashi
//@filesource
//@since 2013/04/18
//@uses ImportXeroxProc
//
error_reporting(E_ALL);

require("process/script/ImportXeroxProc.php");

try {
  var proc = new ImportXeroxProc();
  proc.execute();
} catch (ex) {
  if (ex instanceof MtExcept) {
    console.log(ex);
  } else if (true) {
    console.log(ex);
  }
}

throw die(0);