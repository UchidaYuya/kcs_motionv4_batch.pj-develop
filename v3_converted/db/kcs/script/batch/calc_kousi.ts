//===========================================================================
//機能：公私計算プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：公私計算プロセス
//2007/03/16 -- 移行に伴い変更
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_tel_bill.php");

require("lib/update_tel_bill_kousi.php");

const G_PROCNAME_CALC_KOUSI = "calc_kousi";
const G_OPENTIME_CALC_KOUSI = "0000,2400";

//処理する電話番号
//多重動作ならtrue
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：ロックの施錠と解除を行う
//引数：ロックをかけるならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessCalcKousi extends ProcessCarid {
	ProcessCalcKousi(procname, logpath, opentime) {
		this.ProcessCarid(procname, logpath, opentime);
		this.m_is_lock = false;
		this.m_args.addSetting({
			t: {
				type: "string"
			}
		});
		this.m_telno = "";
	}

	getProcname() {
		return "\u516C\u79C1\u8A08\u7B97\u30D7\u30ED\u30BB\u30B9(\u96FB\u8A71)";
	}

	commitArg(args) {
		if (!ProcessCarid.commitArg(args)) return false;

		switch (args.key) {
			case "t":
				this.m_telno = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessCarid.getUsage();
		rval.push(["-t=telno", "\u51E6\u7406\u3059\u308B\u96FB\u8A71\u756A\u53F7(\u5168\u90E8)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessCarid.getManual();
		rval += "\u51E6\u7406\u3059\u308B\u96FB\u8A71\u756A\u53F7" + (this.m_telno.length ? this.m_telno : "\u5168\u90E8") + "\n";
		return rval;
	}

	lock(is_lock) //ロック無しの場合、キャリアIDと電話番号を追加して、
	//自プロセスとロックする
	{
		var procname = this.m_procname;

		if (0 == this.m_lockflag) {
			procname = procname + "," + this.m_year + "," + this.m_month + "," + this.m_carid + "," + this.m_telno;
			this.m_lockflag = 1;
		}

		if (!this.m_lockflag) return true;
		var pre = "batch";

		if (is_lock) {
			var unique_key = "_" + this.getUniqueKey();
			var command_name = this.m_db.escape(pre + "_" + procname + unique_key);
			this.m_db.begin();
			var sql = "insert into clamptask_tb(command,status,recdate)";
			sql += "values('" + command_name + "'";
			sql += ",1,'" + date("Y-m-d H:i:s") + "')";
			sql += ";";
			this.m_db.query(sql);
			sql = "select * from clamptask_tb";

			if (2 == this.m_lockflag) //全プロセスに対してロック
				{
					sql += " where command like '" + this.m_db.escape(pre + "%") + "'";
				} else //自プロセスに対してロック
				{
					sql += " where command like '" + this.m_db.escape(pre + "_" + procname) + "%'";
				}

			sql += " and status=1";
			sql += ";";
			var result = this.m_db.getHash(sql);
			var is_match = false;

			for (var H_line of Object.values(result)) {
				var command = H_line.command;
				var pos = strpos(command, unique_key);
				if (false === pos) continue;
				if (unique_key.length + pos == command.length) is_match = true;
			}

			if (1 != result.length) is_match = false;

			if (!is_match) {
				sql = "delete from clamptask_tb" + " where command='" + this.m_db.escape(command_name) + "'" + ";";
				this.m_db.query(sql);
				this.m_db.commit();
			}

			this.m_db.commit();

			if (!is_match) {
				var msg = "";

				for (var cnt = 0; cnt < result.length; ++cnt) {
					let _tmp_0 = result[cnt];

					for (var key in _tmp_0) {
						var value = _tmp_0[key];
						msg += `/${key}=${value}`;
					}
				}

				this.putError(G_SCRIPT_WARNING, `多重動作${msg}`);
				this.m_is_lock = true;
				return false;
			}
		} else {
			this.m_db.begin();
			this.m_db.lock("clamptask_tb");
			sql = "delete from clamptask_tb";
			sql += " where command like '" + this.m_db.escape(pre + "_" + this.m_procname) + "%'";
			sql += ";";
			this.m_db.query(sql);
			this.m_db.commit();
		}

		return true;
	}

	executePactid(pactid, logpath) //bill_history_tbに計算中の記録があれば、多重動作とする
	//kousi_tel_bill_X_tbの後始末をする
	{
		var no = this.getTableNo();
		var sql = "select count(*) from bill_history_tb";
		sql += " where pactid=" + this.m_db.escape(pactid);
		sql += " and year=" + this.m_db.escape(this.m_year);
		sql += " and month=" + this.m_db.escape(this.m_month);
		sql += " and status='1'";

		if (G_CARRIER_ALL != this.m_carid) {
			sql += " and (carid=" + this.m_db.escape(this.m_carid) + " or carid=" + G_CARRIER_ALL + ")";
		}

		sql += ";";

		if (0 < this.m_db.getOne(sql)) {
			this.putError(G_SCRIPT_WARNING, "\u591A\u91CD\u52D5\u4F5C(\u9867\u5BA2\u6BCE\u79D1\u76EE\u8A08\u7B97\u5B9F\u884C\u4E2D)");
			this.m_is_lock = true;
			return false;
		}

		var year = this.m_year;
		var month = this.m_month;
		var carid = this.m_carid;
		var telno = this.m_telno;
		if (G_CARRIER_ALL == carid) carid = "";
		sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.m_db.escape(pactid);
		sql += " and fncid=" + this.m_db.escape(G_AUTH_KOUSI);
		sql += " and userid=0";
		sql += ";";
		var is_kousi = 0 < this.m_db.getOne(sql);

		if (!is_kousi) //公私権限がない
			{
				return true;
			}

		var O_cache = new TelDetailsCache(this.m_listener, this.m_db, this.m_table_no);

		if (!O_cache.begin(pactid, year, month, carid, telno)) {
			this.putError(G_SCRIPT_WARNING, "tel_details_X_tb\u8AAD\u307F\u51FA\u3057\u5931\u6557" + pactid + "/" + year + "/" + month);
			return false;
		}

		var O_inserter_kousi_tel_bill = new TableInserter(this.m_listener, this.m_db, logpath + "kousi_tel_bill_" + no + "_tb.insert", true);
		var O_kousi_tel_bill = new UpdateTelBillKousi(this.m_listener, this.m_db, this.m_table_no, O_inserter_kousi_tel_bill);
		if (!O_kousi_tel_bill.fetch(O_cache)) return false;
		if (!O_kousi_tel_bill.delete(O_cache, logpath + "kousi_tel_bill_" + no + "_tb.dump")) return false;
		if (!O_kousi_tel_bill.begin(O_cache)) return false;

		while (!O_cache.eof()) {
			telno = "";
			var H_carid_details = Array();
			var H_carid_telinfo = Array();
			if (!O_cache.getDetails(telno, H_carid_details, H_carid_telinfo)) return false;
			if (!O_kousi_tel_bill.executeTelno(O_cache, telno, H_carid_details, H_carid_telinfo, 2)) return false;
		}

		if (!O_kousi_tel_bill.end()) return false;
		return true;
	}

};

checkClient(G_CLIENT_BOTH);
var proc = new ProcessCalcKousi(G_PROCNAME_CALC_KOUSI, G_LOG, G_OPENTIME_CALC_KOUSI);
if (!proc.readArgs(undefined)) throw die(1);

if (!proc.execute()) {
	if (proc.m_is_lock) {
		throw die(2);
	} else {
		throw die(1);
	}
}

throw die(0);