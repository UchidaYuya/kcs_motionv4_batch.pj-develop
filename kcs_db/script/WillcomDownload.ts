//WILLCOM DLバッチ
//2013/06/17 上杉勝史 作成
import MtExcept from "../class/MtExcept";
import WillcomDownloadProc from "../class/process/script/WillcomDownloadProc";

try //プロセスオブジェクトの生成
//プロセスの実行
{
  var O_Proc = new WillcomDownloadProc();
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
