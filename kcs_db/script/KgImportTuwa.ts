//ＫＧ通話明細データ（転送用詳細ファイル）取込処理

import MtExcept from '../class/MtExcept';
import KgImportTuwaProc from '../class/process/script/KgImportTuwaProc';

try //プロセスオブジェクトの生成
//プロセスの実行
{
  const O_Proc = new KgImportTuwaProc();
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
