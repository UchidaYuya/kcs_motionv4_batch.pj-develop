import ImportWillcomBillProc from "../class/process/script/ImportWillcomBillProc";
import MtExcept from "../class/MtExcept";

(async ()=>{
try //プロセスオブジェクトの生成
//プロセスの実行
{
// 2022cvt_015
  var O_Proc = new ImportWillcomBillProc();
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
})();