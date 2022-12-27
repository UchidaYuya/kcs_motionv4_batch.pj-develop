//電話予約実行処理
//2008/06/05 前田 聡 作成

import MtExcept from '../class/MtExcept';
import TelReserveExecProc from '../class/process/script/TelReserveExecProc';
try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new TelReserveExecProc();
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
