import ImportCheckListProc from "../class/process/script/ImportCheckListProc";
import MtExcept from "../class/MtExcept";
import { argv } from "process";

(async ()=>{
var process: any;
try {
// 2022cvt_015
	process = new ImportCheckListProc(argv);
	process.execute();
} catch (ex) {
	if (ex instanceof MtExcept) {
		console.log(ex);
	} else if (true) {
		console.log(ex);
	}
}

 //throw process.exit(0);// 2022cvt_009
})();
