//
//管理記録の異動先部署名補完
//
//更新履歴：<br>
//2014/11/12 石崎公久 作成
//
//@package script
//@subpackage Process
//@author Ishizaki<ishizaki@motion.co.jp>
//@filesource
//@since 2014/11/12
//@uses MtTableUtil
//@uses ProcessBaseBatch
//
//error_reporting(E_ALL|E_STRICT);
//
//起動クラス
//
//@author Ishizaki<ishizaki@motion.co.jp>
//@package script
//@author Ishizaki
//@since 2014/11/12
//

require("MtTableUtil.php");

require("process/ProcessBaseBatch.php");

class FixingTelmnglogProc extends ProcessBaseBatch {
	constructor() {
		super();
		this.db = MtDBUtil.singleton();
		this.table = new MtTableUtil();
	}

	doExecute(H_param: {} | any[] = Array()) //件数抜出
	{
		this.set_Dirs("FixingTelmnglog");
		var res = this.db.queryHash("select * from management_log_tb where trg_postid_aft is not NULL and trg_postname_aft is NULL and type = '\u79FB\u52D5' and recdate >= '2013-12-01'");
		var i = 0;

		for (var line of Object.values(res)) {
			var z = line.recdate.split(" ");
			var y = z[0].split("-");
			var tno = this.table.getTableNo(y[0] + y[1], true);
			var postname = this.db.queryHash("select * from post_" + tno + "_tb where postid = " + line.trg_postid_aft);

			if (postname.length == 0) {
				echo("/**\n");
				console.log(line);
				echo("*/\n");
			} else {
				var sql = "UPDATE management_log_tb SET trg_postname_aft = '" + line.trg_postname + " -> " + postname[0].postname + "' WHERE pactid = " + line.pactid + " and postid = " + line.postid + " and userid = " + line.userid + " and manageno = " + this.db.dbQuote(line.manageno, "text") + " and recdate = " + this.db.dbQuote(line.recdate, "text") + ";\n";
				echo(sql);
			}
		}
	}

};