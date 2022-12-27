//価格表お知らせメール

import MtExcept from '../class/MtExcept';

import PriceMailProc from '../class/process/script/PriceMailProc';

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new PriceMailProc();
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

throw process.exit(0);// 2022cvt_009
