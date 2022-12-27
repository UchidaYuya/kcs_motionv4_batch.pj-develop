//ＫＧ請求データ（転送用内線別月報ファイル）取込処理

import MtExcept from "../class/MtExcept";
import KgImportBillProc from "../class/process/script/KgImportBillProc"

try //プロセスオブジェクトの生成
//プロセスの実行
{
  const O_Proc = new KgImportBillProc();
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