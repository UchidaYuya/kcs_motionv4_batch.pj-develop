import ImportXeroxProc from "../class/process/script/ImportXeroxProc";
import MtExcept from "../class/MtExcept";

(async ()=>{
try {
// 2022cvt_015
  var proc = new ImportXeroxProc();
  proc.doExecute();
} catch (ex) {
  if (ex instanceof MtExcept) {
    console.log(ex);
  } else if (true) {
    console.log(ex);
  }
}

// throw process.exit(0);// 2022cvt_009
})();