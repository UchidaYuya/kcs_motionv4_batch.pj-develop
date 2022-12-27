//ＳＵＯ ソフトバンクテレコム請求データ取込処理


import MtExcept from "../class/MtExcept";
import SuoImportSoftTeleProc from "../class/process/script/nocheckSuoImportSoftTeleProc";

// require("process/script/nocheckSuoImportSoftTeleProc.php");

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new SuoImportSoftTeleProc();
  O_Proc.doExecute();
} catch (ex) {
  if (ex instanceof MtExcept) //Motion拡張例外はここで受ける、コンストラクターの例外など
    {
      console.log(ex);
    } else if (true) //一般的な例外はここで受ける、基本的には来ないはず
    {
      console.log(ex);
    }
}

throw process.exit(0);