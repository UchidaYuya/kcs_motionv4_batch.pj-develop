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
//
//端末があるか調べる
//
//@author houshiyama
//@since 2008/10/08
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $telno
//@access public
//@return void
//
//
//doCopyInsert
//
//@author houshiyama
//@since 2008/10/10
//
//@param mixed $table
//@param mixed $filename
//@param mixed $columns
//@param mixed $db
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

function checkRelExist(pactid, carid, telno, rel_tb) {
	var sql = "select coalesce(count(pactid),0) from " + rel_tb + " where pactid=" + pactid + " and carid=" + carid + " and telno='" + telno + "'";
	var cnt = GLOBALS.dbh.getOne(sql);

	if (cnt > 0) {
		return true;
	} else {
		return false;
	}
};

function doCopyInsert(table, filename, columns, db) //ファイルを開く
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	if (!("logh" in global)) logh = undefined;
	var fp = fopen(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var ins = new TableInserter(logh, db, filename + ".sql", true);
	ins.begin(table);

	while (line = fgets(fp)) //tabで区切り配列に
	//要素数チェック
	//カラム名をキーにした配列を作る
	//インサート行の追加
	{
		var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) {
			logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}

		var H_ins = Array();
		var idx = 0;

		for (var col of Object.values(columns)) {
			H_ins[col] = A_line[idx];
			idx++;
		}

		if (ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F\u3001\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557.");
		fclose(fp);
		return 1;
	}

	fclose(fp);
	return 0;
};