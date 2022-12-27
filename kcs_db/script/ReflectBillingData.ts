//請求データからプラン、パケット等を電話管理に反映する


import MtExcept from "../class/MtExcept";
import ReflectBillingDataProc from "../class/process/script/ReflectBillingDataProc";


try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new ReflectBillingDataProc();
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
