//===========================================================================
//機能：再計算プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：再計算プロセス
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_tel_bill.php");

require("lib/update_bill.php");

require("lib/update_tel_bill_kousi.php");

require("lib/update_summary.php");

const G_PROCNAME_RECALC = "recalc";
const G_OPENTIME_RECALC = "0000,2400";
ini_set("memory_limit", 2 * 1024 * 1024 * 1024);

//処理中の顧客ID(ログ出力用)
//処理中の年(ログ出力用)
//処理中の月(ログ出力用)
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：現在処理中の顧客IDを返す
//備考：特定の顧客を処理中で無い場合は、ゼロを返す
//機能：現在処理中の年月を返す(yyyy/mm形式)
//備考：特定の年月を処理していない場合は空文字列を返す
//機能：処理すべきデータが無ければfalseを返す
//備考：エラーがあってもログを出さず処理を継続する
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：再計算を行う
//引数：計算パラメータ{pactid,year,month,carid}
//ログ出力先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessRecalc extends ProcessBase {
	ProcessRecalc(procname, logpath, opentime) {
		this.ProcessBase(procname, logpath, opentime);
	}

	getProcname() {
		return "\u518D\u8A08\u7B97\u30D7\u30ED\u30BB\u30B9";
	}

	getCurrentPactid() {
		return this.m_cur_pactid;
	}

	getCurrentMonth() {
		return this.m_cur_year + "/" + this.m_cur_month;
	}

	isRequest() {
		var sql = "select count(*) from bill_history_tb";
		sql += " where status='0'";
		sql += ";";
		return 0 < this.m_db.getOne(sql);
	}

	do_execute() //処理回数
	{
		var count = 0;
		var all_status = true;

		for (; true; ++count) //計算要求を取り出す
		//ログ保存先フォルダを作成する
		//計算要求のステータスを計算中に変更する
		{
			if (!this.beginDB()) return false;
			var sql = "select pactid,year,month,carid from bill_history_tb";
			sql += " where status='0'";
			sql += " order by recdate,year,month,pactid";
			sql += " limit 1";
			if (this.m_debugflag) sql += " offset " + this.m_db.escape(count);
			sql += ";";
			var param = this.m_db.getHash(sql);

			if (0 == count(param)) {
				if (!this.endDB(false)) return false;
				break;
			}

			param = param[0];
			this.m_cur_pactid = param.pactid;
			this.m_cur_year = param.year;
			this.m_cur_month = param.month;
			var log = new ProcessLog();
			log.setPath(this.m_listener, this.m_curpath, param.pactid + "_" + sprintf("%04d%02d", param.year, param.month) + "_" + param.carid + "/");
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(log);
			this.m_listener.putListener(this.m_listener_error);
			this.putError(G_SCRIPT_BEGIN, "\u518D\u8A08\u7B97\u958B\u59CB" + param.pactid + "," + param.year + param.month + "," + param.carid);
			sql = "update bill_history_tb set status='1'";
			sql += " where status='0'";
			sql += " and pactid=" + this.m_db.escape(param.pactid);
			sql += " and year=" + this.m_db.escape(param.year);
			sql += " and month=" + this.m_db.escape(param.month);
			sql += " and carid=" + this.m_db.escape(param.carid);
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
			if (!this.endDB(true)) return false;
			if (!this.beginDB()) return false;
			var status = this.executeParam(param, log.m_path);
			if (!this.endDB(status)) return false;
			this.putError(G_SCRIPT_BEGIN, "\u518D\u8A08\u7B97\u7D42\u4E86" + param.pactid + "," + param.year + param.month + "," + param.carid);
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(this.m_listener_process);
			this.m_listener.putListener(this.m_listener_error);
			all_status &= status;
			delete log;
			if (!status) return status;
			this.m_cur_pactid = 0;
			this.m_cur_year = 0;
			this.m_cur_month = 0;
		}

		return all_status;
	}

	executeParam(param, logpath) //合計項目の有無を取り出す
	//tel_bill系---------------------------------------------------------
	//tel_details_X_tbの読み出しインスタンスを作る
	//tel_bill系のインスタンスを解放する
	//bill系-------------------------------------------------------------
	//bill系の一括生成インスタンスを作る
	//bill_X_tbの作成の準備をする
	{
		var pactid = param.pactid;
		var no = this.m_table_no.get(param.year, param.month);
		var year = param.year;
		var month = param.month;
		var carid = param.carid;
		var telno = "";
		if (G_CARRIER_ALL == carid) carid = "";
		var sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.m_db.escape(pactid);
		sql += " and fncid=" + this.m_db.escape(G_AUTH_KOUSI);
		sql += " and userid=0";
		sql += ";";
		var is_kousi = 0 < this.m_db.getOne(sql);
		sql = "select count(*) from summary_formula_tb" + " where pactid=" + this.m_db.escape(pactid) + ";";
		var is_summary = 0 < this.m_db.getOne(sql);
		var O_cache = new TelDetailsCache(this.m_listener, this.m_db, this.m_table_no);

		if (!O_cache.begin(pactid, year, month, carid, telno)) {
			this.putError(G_SCRIPT_WARNING, "tel_details_X_tb\u8AAD\u307F\u51FA\u3057\u5931\u6557" + pactid + "/" + year + "/" + month);
			return false;
		}

		var O_inserter_tel_bill = new TableInserter(this.m_listener, this.m_db, logpath + "tel_bill_" + no + "_tb.insert", true);
		var O_tel_bill = new UpdateTelBill(this.m_listener, this.m_db, this.m_table_no, O_inserter_tel_bill);
		if (!O_tel_bill.delete(O_cache, "")) return false;
		if (!O_tel_bill.begin(O_cache)) return false;
		var O_kousi_tel_bill = undefined;

		if (is_kousi) {
			var O_inserter_kousi_tel_bill = new TableInserter(this.m_listener, this.m_db, logpath + "kousi_tel_bill_" + no + "_tb.insert", true);
			O_kousi_tel_bill = new UpdateTelBillKousi(this.m_listener, this.m_db, this.m_table_no, O_inserter_kousi_tel_bill);
			if (!O_kousi_tel_bill.fetch(O_cache)) return false;
			if (!O_kousi_tel_bill.delete(O_cache, "")) return false;
			if (!O_kousi_tel_bill.begin(O_cache)) return false;
		}

		var H_summary = Array();
		var O_summary_tel_bill = undefined;

		if (is_summary) {
			var O_inserter_summary_tel_bill = new TableInserter(this.m_listener, this.m_db, logpath + "summary_tel_bill_" + no + "_tb.insert", true);
			O_summary_tel_bill = new UpdateTelBillSummary(this.m_listener, this.m_db, this.m_table_no, O_inserter_summary_tel_bill);
			if (!O_summary_tel_bill.delete(O_cache, "")) return false;
			if (!O_summary_tel_bill.begin(O_cache)) return false;
			H_summary = O_summary_tel_bill.getSummary();
		}

		while (!O_cache.eof()) {
			telno = "";
			var H_carid_details = Array();
			var H_carid_telinfo = Array();
			if (!O_cache.getDetails(telno, H_carid_details, H_carid_telinfo)) return false;
			var H_tel_bill = Array();
			if (!O_tel_bill.executeTelno(O_cache, telno, H_carid_details, H_carid_telinfo, H_tel_bill)) return false;

			if (is_kousi) {
				if (!O_kousi_tel_bill.executeTelno(O_cache, telno, H_carid_details, H_carid_telinfo, 2)) return false;
			}

			if (is_summary) {
				if (!O_summary_tel_bill.executeTelno(O_cache, telno, H_carid_details, H_carid_telinfo, H_tel_bill)) return false;
			}
		}

		if (!O_tel_bill.end()) return false;
		delete O_tel_bill;
		delete O_inserter_tel_bill;

		if (is_kousi) {
			if (!O_kousi_tel_bill.end()) return false;
			delete O_kousi_tel_bill;
			delete O_inserter_kousi_tel_bill;
		}

		if (is_summary) {
			if (!O_summary_tel_bill.end()) return false;
			delete O_summary_tel_bill;
			delete O_inserter_summary_tel_bill;
		}

		if (!O_cache.end()) return false;
		delete O_cache;
		var O_bill = new UpdateBill(this.m_listener, this.m_db, this.m_table_no);
		var O_inserter_bill = new TableInserter(this.m_listener, this.m_db, logpath + "bill_" + no + "_tb.insert", true);
		O_bill.setInserter(0, O_inserter_bill);
		if (!O_bill.delete(pactid, carid, year, month, "", 0)) return false;

		if (is_kousi) {
			var O_inserter_kousi_bill = new TableInserter(this.m_listener, this.m_db, logpath + "kousi_bill_" + no + "_tb.insert", true);
			O_bill.setInserter(1, O_inserter_kousi_bill);
			if (!O_bill.delete(pactid, carid, year, month, "", 1)) return false;
		}

		if (is_summary) {
			var O_inserter_summary_bill = new TableInserter(this.m_listener, this.m_db, logpath + "summary_bill_" + no + "_tb.insert", true);
			O_bill.setInserter(2, O_inserter_summary_bill);
			if (!O_bill.delete(pactid, carid, year, month, "", 2)) return false;
		}

		var is_details_only = true;
		if (!O_bill.execute(pactid, is_details_only, carid, year, month, H_summary)) return false;
		sql = "update bill_history_tb set status='2'";
		sql += " where status='1'";
		sql += " and pactid=" + this.m_db.escape(pactid);
		sql += " and year=" + this.m_db.escape(year);
		sql += " and month=" + this.m_db.escape(month);
		if (carid.length) sql += " and carid=" + this.m_db.escape(carid);
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_RECALC) log = G_LOG_RECALC;
var proc = new ProcessRecalc(G_PROCNAME_RECALC, log, G_OPENTIME_RECALC);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.isRequest()) throw die(0);
if (!proc.execute()) throw die(1);
throw die(0);