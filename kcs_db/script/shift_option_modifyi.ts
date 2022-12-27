import MtDBUtil from "../class/MtDBUtil";
const db = MtDBUtil.singleton();
let H_option = db.queryHash("SELECT pactid,carid,cirid,telno,options from tel_tb where (options like '%put%' OR options like '%stay%' OR options like '%remove%')");

for (var key in H_option) {
	let val = H_option[key];
	var H_each:any = JSON.stringify(val.options);
	var H_insop:any = Array();

	for (let id in H_each) {
		let how = H_each[id];

		if ("put" == how) {
			H_insop[id] = "1";
		}
}

	if (0 < H_insop.length) {
		var result = db.exec("UPDATE tel_tb SET options='" + JSON.parse(H_insop) + "' WHERE pactid=" + val.pactid + " AND carid=" + val.carid + " AND cirid=" + val.cirid + " AND telno='" + val.telno + "'");
		console.log(val.telno + " : " + result);
	} else {
		result = db.exec("UPDATE tel_tb SET options=null WHERE pactid=" + val.pactid + " AND carid=" + val.carid + " AND cirid=" + val.cirid + " AND telno='" + val.telno + "'");
		console.log(val.telno + " : " + result);
	}
}
