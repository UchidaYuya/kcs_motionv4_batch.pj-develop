import FixingTelmnglogProc from "../class/process/script/FixingTelmnglogProc";
import MtExcept from "../class/MtExcept";

(async ()=>{
  try {
    var O_Proc = new FixingTelmnglogProc();	// プロセスオブジェクトの生成
    O_Proc.execute();	// プロセスの実行
  } catch (ex) {
    if (ex instanceof MtExcept) {
      // Motion拡張例外はここで受ける、コンストラクターの例外など
      MtExcept.finalMtExceptHandler(ex);
    } else if (true) {
      // 一般的な例外はここで受ける、基本的には来ないはず
      MtExcept.finalExceptHandler(ex);
    }
  }
  // throw process.exit(0);
})();
