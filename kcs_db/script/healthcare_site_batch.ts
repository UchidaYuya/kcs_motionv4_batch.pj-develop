//追加請求計算
//更新履歴：<br>
//2016/01/08 伊達幸祐 作成

import MtExcept from "../class/MtExcept";
import HealthcareSiteBatchProc from "../class/process/script/HealthcareSiteBatchProc"
try //プロセスオブジェクトの生成
//プロセスの実行
{
// 2022cvt_015
  var O_Proc = new HealthcareSiteBatchProc();
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

throw process.exit(0);// 2022cvt_009
