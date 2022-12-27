require("process/script/ImportCheckListProc.php");

try {
	var process = new ImportcheckListProc(argv);
	process.execute();
} catch (ex) {
	if (ex instanceof MtExcept) {
		console.log(ex);
	} else if (true) {
		console.log(ex);
	}
}

throw die(0);