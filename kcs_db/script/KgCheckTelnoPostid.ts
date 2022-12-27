//ＫＧ対応 KCS Motion上の電話の所属部署がＦＥＳＴＡ上の電話の部署情報と同じかをチェックする

import MtExcept from '../class/MtExcept';
import KgCheckTelnoPostidProc from '../class/process/script/KgCheckTelnoPostidProc';

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new KgCheckTelnoPostidProc();
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
