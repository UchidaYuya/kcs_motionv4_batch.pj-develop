//Doocomoヘルスケア取込

import MtExcept from "../class/MtExcept";
import FlatEverySecondMonthProc from "../class/process/script/FlatEverySecondMonthProc"
try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new FlatEverySecondMonthProc();
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
