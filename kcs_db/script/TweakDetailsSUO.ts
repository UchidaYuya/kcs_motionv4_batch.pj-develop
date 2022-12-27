//SUO割引額調整
//2008/03/26 石崎公久 作成
import MtExcept from "../class/MtExcept";
import TweakDetailsSUOProc from "../class/process/script/TweakDetailsSUOProc";

try //プロセスオブジェクトの生成
//プロセスの実行
{
// 2022cvt_015
  var O_Proc = new TweakDetailsSUOProc();
  O_Proc.execute();
} catch (ex) {
  if (ex instanceof MtExcept) //Motion拡張例外はここで受ける、コンストラクターの例外など
    {
      MtExcept.finalMtExceptHandler(ex);
    } else if (true) //一般的な例外はここで受ける、基本的には来ないはず
    {
      MtExcept.finalExceptHandler(ex);
    }
}

throw process.exit(0);
