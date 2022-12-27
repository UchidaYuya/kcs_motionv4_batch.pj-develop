
//対応するプロセスを読み込む
import {SuoImportSoftTeleProc} from '../class/process/script/SuoImportSoftTeleProc';
import MtExcept from '../class/MtExcept';
(() => {
try
{
// 2022cvt_015
  var O_Proc = new SuoImportSoftTeleProc(); //プロセスオブジェクトの生成
  O_Proc.execute(); //プロセスの実行
} catch (ex) {
  if (ex instanceof MtExcept)
    {
      //Motion拡張例外はここで受ける、コンストラクターの例外など
      console.log(ex);
    } else if (true)
    {
      //一般的な例外はここで受ける、基本的には来ないはず
      console.log(ex);
    }
}

throw process.exit(0);
})();