
import MtTableUtil from '../../MtTableUtil';
import ProcessBaseBatch from '../ProcessBaseBatch';

import MtDBUtil from '../../MtDBUtil';

export default class FixingTelmnglogProc extends ProcessBaseBatch {

	db: MtDBUtil;
	table: MtTableUtil;

	constructor() {
		super();
		this.db = MtDBUtil.singleton();
		this.table = new MtTableUtil();
	}

	// doExecute(H_param: {} | any[] = Array()) //件数抜出
	async doExecute(H_param: {} | any[] = Array()) //件数抜出
	{
		this.set_Dirs("FixingTelmnglog");
		// var res = await this.db.queryHash("select * from management_log_tb where trg_postid_aft is not NULL and trg_postname_aft is NULL and type = '\u79FB\u52D5' and recdate >= '2013-12-01'");

		var res = await this.db.queryHash("select * from management_log_tb where trg_postid_aft is not NULL and trg_postname_aft is NULL and type = '移動' and recdate >= '2013-12-01'");
		console.log(res);
		// 単体テスト用（荒木）
		// res = [
		// 	{
		// 		"mid": 1,
		// 		"pactid": 1,
		// 		"postid": 1,
		// 		"userid": 1,
		// 		"username": "username",
		// 		"manageno": "manageno",
		// 		"manageno_view": "manageno_view",
		// 		"coid": 1,
		// 		"comment": "comment",
		// 		"trg_postid": 1,
		// 		"trg_postid_aft": 1,
		// 		"trg_postname": "trg_postname",
		// 		"trg_postname_aft": "trg_postname_aft",
		// 		"joker_flag": 1,
		// 		"type": "type",
		// 		"recdate": "2022-12-22 00:00:00"
		// 	}
		// ]
		// ------------------

		var i = 0;

		// for (var line of Object.values(res)) {
		for (var line of res) {
			var z = line.recdate.split(" ");
			var y = z[0].split("-");
			var tno = MtTableUtil.getTableNo(y[0] + y[1], true);

			var postname = await this.db.queryHash("select * from post_" + tno + "_tb where postid = " + line.trg_postid_aft);
			console.log(postname);

			// 単体テスト用
			// postname = [
			// 	{
			// 		"pactid": 1,
			// 		"postid": 1,
			// 		"userpostid": "userpostid",
			// 		"postname": "postname",
			// 		"zip": "zip",
			// 		"addr1": "addr1",
			// 		"addr2": "building",
			// 		"telno": "telno",
			// 		"faxno": "faxno",
			// 		"recdate": "2022-12-22 00:00:00",
			// 		"fixdate": "2022-12-22 00:00:00",
			// 		"ptext1": "ptext1",
			// 		"ptext2": "ptext2",
			// 		"ptext3": "ptext3",
			// 		"ptext4": "ptext4",
			// 		"ptext5": "ptext5",
			// 		"ptext6": "ptext6",
			// 		"ptext7": "ptext7",
			// 		"ptext8": "ptext8",
			// 		"ptext9": "ptext9",
			// 		"ptext10": "ptext10",
			// 		"ptext11": "ptext11",
			// 		"ptext12": "ptext12",
			// 		"ptext13": "ptext13",
			// 		"ptext14": "ptext14",
			// 		"ptext15": "ptext15",
			// 		"pint1": 1,
			// 		"pint2": 1,
			// 		"pint3": 1,
			// 		"pdate1": "2022-12-22 00:00:00",
			// 		"pdate2": "2022-12-22 00:00:00",
			// 		"fix_flag": false
			// 	}
			// ]
			// -----------------

			if (postname.length == 0) {
// 				echo("/**\n");
				console.log(line);
// 				echo("*/\n");
			} else {
				var sql = "UPDATE management_log_tb SET trg_postname_aft = '" + line.trg_postname + " -> " + postname[0].postname + "' WHERE pactid = " + line.pactid + " and postid = " + line.postid + " and userid = " + line.userid + " and manageno = " + this.db.dbQuote(line.manageno, "text") + " and recdate = " + this.db.dbQuote(line.recdate, "text") + ";\n";
// 				echo(sql);
			}
		}
	}

};
