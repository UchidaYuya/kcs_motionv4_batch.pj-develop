//ソフトバンクDLバッチ

import MtExcept from "../class/MtExcept";
import SBDownloadProc from "../class/process/script/SBDownloadProc";


try //プロセスオブジェクトの生成
{
  var O_Proc = new SBDownloadProc();
  O_Proc.execute();
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
