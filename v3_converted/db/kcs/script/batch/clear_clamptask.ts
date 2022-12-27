//===========================================================================
//機能：多重動作レコード削除プロセス
//
//作成：森原
//===========================================================================
//手動動作するならtrue
//batchで始まらないものも対象とするならtrue
//statusが1以外のものも対象とするならtrue
//bothなら両方、dbならclamptask_tbのみ、webならclampweb_function_tbのみ
//起動時オプション
error_reporting(E_ALL);

require("lib/process_base.php");

var err = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
var manual_flag = true;
var all_flag = false;
var status_flag = true;
var way = "both";
var args = new ScriptArgs({
	h: Array(),
	m: {
		type: "int"
	},
	a: {
		type: "int"
	},
	s: {
		type: "int"
	},
	w: {
		type: "string"
	}
});

if (!args.readAll(undefined)) {
	args.writeLog(err);
	throw die(1);
}

for (var arg of Object.values(args.m_A_args)) {
	switch (arg.key) {
		case "m":
			manual_flag = arg.value;
			break;

		case "a":
			all_flag = arg.value;
			break;

		case "s":
			status_flag = arg.value;
			break;

		case "h":
			fwrite_conv("-m={0|1} \u5B9F\u884C\u524D\u306B\u554F\u3044\u5408\u308F\u305B(1)\n");
			fwrite_conv("-s={0|1} status\u304C1\u4EE5\u5916\u306E\u3082\u306E\u3082\u5BFE\u8C61\u3068\u3059\u308B(1)\n");
			fwrite_conv("-a={0|1} \u300Cbatch\u300D\u3067\u59CB\u307E\u3089\u306A\u3044\u3082\u306E\u3082\u5BFE\u8C61\u3068\u3059\u308B(0)\n");
			fwrite_conv("-w={both|db|web} \u4E21\u65B9/clamptask_tb/clampweb_function_tb(both)\n");
			throw die(0);

		case "w":
			switch (arg.value) {
				case "both":
				case "db":
				case "web":
					way = arg.value;
					break;

				default:
					fwrite_conv("-w={both|db|web} \u4E21\u65B9/clamptask_tb/clampweb_function_tb(both)\n");
					throw die(1);
			}

			break;
	}
}

if ("both" == way || "db" == way) {
	var db = new ScriptDB(err);
	db.begin();
	db.lock("clamptask_tb");

	if (!execute_db(db, manual_flag, all_flag, status_flag)) {
		db.rollback();
	} else {
		db.commit();
	}
}

if ("both" == way || "web" == way) {
	if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
		db = new ScriptDB(err, GLOBALS.G_dsn_temp);
	} else db = new ScriptDB(err);

	db.begin();
	db.lock("clampweb_function_tb");

	if (execute_web(db, manual_flag)) {
		db.commit();
	} else {
		db.rollback();
	}

	db.begin();
	db.lock("clampweb_index_tb");

	if (execute_web_index(db, manual_flag)) {
		db.commit();
	} else {
		db.rollback();
	}
}

function execute_web(db, manual_flag) //clampweb_function_tbからlockとrunを削除
{
	var sqlwhere = " where (command like 'lock_%' or command like 'run%')";
	var sql = "select * from clampweb_function_tb";
	sql += sqlwhere;
	sql += ";";
	var result = db.getHash(sql);
	if (0 == result.length) return true;

	if (manual_flag) {
		var H_label = {
			command: "command",
			fixdate: "fixdate"
		};
		var H_len = {
			command: H_label.command.length,
			fixdate: H_label.fixdate.length
		};

		for (var H_line of Object.values(result)) for (var key in H_label) {
			var value = H_label[key];
			if (H_len[key] < H_line[key].length) H_len[key] = H_line[key].length;
		}

		put_line_web(H_label, H_len);

		for (var H_line of Object.values(result)) put_line_web(H_line, H_len);

		fwrite_conv("\u524A\u9664\u3057\u307E\u3059\u304B?(N/y)\n");
		var buf = fgets(STDIN);
		buf = buf.substr(0, 1);

		if (strcmp("y", buf) && strcmp("Y", buf)) {
			fwrite_conv("\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3057\u305F\n");
			return false;
		}
	}

	sql = "delete from clampweb_function_tb";
	sql += sqlwhere;
	sql += ";";
	db.query(sql);
	return true;
};

function put_line_web(H_line, H_len) {
	var gcnt = 0;

	for (var key in H_len) {
		var len = H_len[key];
		if (gcnt) fwrite_conv(" | ");
		++gcnt;
		fwrite_conv(H_line[key]);

		for (var lcnt = H_line[key].length; lcnt < len; ++lcnt) fwrite_conv(" ");
	}

	fwrite_conv("\n");
};

function execute_web_index(db, manual_flag) //clampweb_index_tbのis_runningをtrueにする
{
	var sqlwhere = " where is_running=true";
	var sql = "select * from clampweb_index_tb";
	sql += sqlwhere;
	sql += ";";
	var result = db.getHash(sql);
	if (0 == result.length) return true;

	if (manual_flag) {
		console.log(result);
		fwrite_conv("\u524A\u9664\u3057\u307E\u3059\u304B?(N/y)\n");
		var buf = fgets(STDIN);
		buf = buf.substr(0, 1);

		if (strcmp("y", buf) && strcmp("Y", buf)) {
			fwrite_conv("\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3057\u305F\n");
			return false;
		}
	}

	sql = "update clampweb_index_tb set is_running=false";
	sql += sqlwhere;
	sql += ";";
	db.query(sql);
	return true;
};

function execute_db(db, manual_flag, all_flag, status_flag) {
	var sqlwhere = "";

	if (!all_flag) {
		sqlwhere += sqlwhere.length ? " and" : " where";
		sqlwhere += " command like 'batch%'";
	}

	if (!status_flag) {
		sqlwhere += sqlwhere.length ? " and" : " where";
		sqlwhere += " status=1";
	}

	var sql = "select * from clamptask_tb";
	sql += sqlwhere;
	sql += ";";
	var result = db.getHash(sql);
	if (0 == result.length) return false;

	if (manual_flag) {
		var label_command = "command";
		var label_status = "status";
		var label_recdate = "recdate";
		var max_command = label_command.length;
		var max_status = label_status.length;

		for (var line of Object.values(result)) {
			var len = line.command.length;
			if (max_command < len) max_command = len;
			len = line.status.length;
			if (max_status < len) max_status = len;
		}

		putLine(label_command, label_status, label_recdate, max_command, max_status);

		for (var line of Object.values(result)) putLine(line.command, line.status, line.recdate, max_command, max_status);

		fwrite_conv("\u524A\u9664\u3057\u307E\u3059\u304B?(N/y)\n");
		var buf = fgets(STDIN);
		buf = buf.substr(0, 1);

		if (strcmp("y", buf) && strcmp("Y", buf)) {
			fwrite_conv("\u51E6\u7406\u3092\u4E2D\u65AD\u3057\u307E\u3057\u305F\n");
			return false;
		}
	}

	sql = "delete from clamptask_tb";
	sql += sqlwhere;
	sql += ";";
	db.query(sql);
	return true;
};

throw die(0);

function putLine(command, status, recdate, len_command, len_status) {
	while (command.length < len_command) command = command + " ";

	while (status.length < len_status) status = status + " ";

	fwrite_conv(`${command} ${status} ${recdate}\n`);
};