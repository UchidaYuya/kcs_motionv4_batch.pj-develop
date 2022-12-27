//au・softbankの警告・電話カウント・計算バッチ
//2009/10/28 宮澤龍彦 作成
import MtExcept from "../../class/MtExcept";
import AdminAlertCountCalcProc from "../../class/process/script/AdminAlertCountCalcProc";

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new AdminAlertCountCalcProc();
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

// throw process.exit(0);