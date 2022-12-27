//
//使用説明
//
//@author houshiyama
//@since 2008/09/03
//
//@param mixed $comment
//@access public
//@return void
//
//
//clamptasl_tb にレコードを追加し２重起動を防止する
//
//@author houshiyama
//@since 2008/09/03
//
//@param mixed $is_lock
//@param mixed $db
//@access public
//@return void
//
//
//現在の日付を返す
//DBに書き込む現在日時に使用する
//
//@author houshiyama
//@since 2008/09/03
//
//@access public
//@return void
//
//
//logging
//ローカルのログを出力する
//
//@author houshiyama
//@since 2008/09/03
//
//@param mixed $lstr
//@access public
//@return void
//
//
//sql実行関数
//
//@author houshiyama
//@since 2008/09/05
//
//@param mixed $mode
//@param mixed $sql
//@param mixed $fp
//@access public
//@return void
//

function usage(comment) {
	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -p={PACTID}\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u3092\u5B9F\u884C)\n");
	print("\t\t-m \u5B9F\u884C\u30E2\u30FC\u30C9\uFF08\u7701\u7565\u3057\u305F\u3089f\uFF09\n");
	print("\t\t \t\t\t\tf:\u30D5\u30A1\u30A4\u30EB\u306BSQL\u6587\u66F8\u304F\u3060\u3051\n");
	print("\t\t\t\t\t \td:\u30D5\u30A1\u30A4\u30EB\u306BSQL\u6587\u66F8\u304D\u3064\u3064\u5B9F\u884C\n");
	throw die(1);
};

function lock(is_lock, db) //ロックする
{
	if (db == undefined) {
		return false;
	}

	var pre = db.escape("batch_" + SCRIPT_NAME);

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command = '" + pre + "' and " + "status = 1;";
			var count = db.getOne(sql);

			if (count != 0) {
				db.rollback();
				db.putError(G_SCRIPT_WARNING, "\u591A\u91CD\u52D5\u4F5C");
				return false;
			}

			var nowtime = getTimestamp();
			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + pre + "',1,'" + nowtime + "');";
			db.query(sql);
			db.commit();
		} else {
		db.begin();
		db.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + pre + "';";
		db.query(sql);
		db.commit();
	}

	return true;
};

function getTimestamp() {
	var tm = localtime(Date.now() / 1000, true);
	var yyyy = tm.tm_year + 1900;
	var mm = tm.tm_mon + 1;
	if (mm < 10) mm = "0" + mm;
	var dd = tm.tm_mday + 0;
	if (dd < 10) dd = "0" + dd;
	var hh = tm.tm_hour + 0;
	if (hh < 10) hh = "0" + hh;
	var nn = tm.tm_min + 0;
	if (nn < 10) nn = "0" + nn;
	var ss = tm.tm_sec + 0;
	if (ss < 10) ss = "0" + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};

function logging(lstr) {
	var log_buf = date("Y/m/d H:i:s") + " : " + lstr + "\n";
	var lfp = fopen(GLOBALS.LocalLogFile, "a");
	flock(lfp, LOCK_EX);
	fwrite(lfp, log_buf);
	fclose(lfp);
	return;
};

function execFunction(mode, sql, fp) //ファイルに書き出す
//その場で実行モードならば
{
	fwrite(fp, sql + ";\n");

	if ("d" == mode) {
		var res = GLOBALS.dbh.query(sql);

		if (res == false || res != 1) {
			fwrite(STDOUT, "ERROR: sql\u30A8\u30E9\u30FC:" + sql + "\n");
			if (DEBUG_FLG) logging("ERROR: sql\u30A8\u30E9\u30FC:" + sql + "\n");
			GLOBALS.dbh.rollback();
			throw die();
		}
	}
};