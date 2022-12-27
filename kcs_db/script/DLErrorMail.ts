//請求DLエラーメール
//2009/07/03 宮澤龍彦 作成
import MtExcept from "../class/MtExcept";
import DLErrorMailProc from "../class/process/script/DLErrorMailProc";

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new DLErrorMailProc();
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
