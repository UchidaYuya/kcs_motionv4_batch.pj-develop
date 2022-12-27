import SuoImportTanmatsuProc from "../class/process/script/SuoImportTanmatsuProc";
import MtExcept from "../class/MtExcept";

(async ()=>{
try //プロセスオブジェクトの生成
//プロセスの実行
{
// 2022cvt_015
  var O_Proc = new SuoImportTanmatsuProc();
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

process.exit(0);// 2022cvt_009
})();