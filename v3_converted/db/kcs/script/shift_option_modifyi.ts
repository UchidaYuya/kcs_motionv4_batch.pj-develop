//var_dump($H_option);

require("MtDBUtil.php");

var db = MtDBUtil.singleton();
var H_option = db.queryHash("SELECT pactid,carid,cirid,telno,options from tel_tb where (options like '%put%' OR options like '%stay%' OR options like '%remove%')");

for (var key in H_option) {
	var val = H_option[key];
	var H_each = unserialize(val.options);
	var H_insop = Array();

	for (var id in H_each) {
		var how = H_each[id];

		if ("put" == how) {
			H_insop[id] = "1";
		}
	}

	if (0 < H_insop.length) {
		var result = db.exec("UPDATE tel_tb SET options='" + serialize(H_insop) + "' WHERE pactid=" + val.pactid + " AND carid=" + val.carid + " AND cirid=" + val.cirid + " AND telno='" + val.telno + "'");
		console.log(val.telno + " : " + result);
	} else {
		result = db.exec("UPDATE tel_tb SET options=null WHERE pactid=" + val.pactid + " AND carid=" + val.carid + " AND cirid=" + val.cirid + " AND telno='" + val.telno + "'");
		console.log(val.telno + " : " + result);
	}
}