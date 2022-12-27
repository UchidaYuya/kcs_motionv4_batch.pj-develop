//
//Canonインポートバッチ
//
//更新履歴：<br>
//2013/06/18 五十嵐 作成
//
//@package script
//@author igarashi
//@filesource
//@since 2013/06/18
//@uses ImportXeroxProc
//
// error_reporting(E_ALL);// 2022cvt_011


import MtExcept from "../class/MtExcept";
import ImportCanonProc from "../class/process/script/ImportCanonProc"

try {

  var proc = new ImportCanonProc();
  proc.doExecute();
} catch (ex) {
  if (ex instanceof MtExcept) {
    console.log(ex);
  } else if (true) {
    console.log(ex);
  }
}

throw process.exit(0);
