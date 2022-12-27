//===========================================================================
//機能：科目計算プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：科目計算プロセス
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_tel_bill.php");

require("lib/update_bill.php");

require("lib/update_tel_bill_kousi.php");

require("lib/update_summary.php");

const G_PROCNAME_CALC = "calc";
const G_OPENTIME_CALC = "0000,2400";
ini_set("memory_limit", 2 * 1024 * 1024 * 1024);

//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：顧客毎の処理を開始する
//引数：顧客ID
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客毎の処理を終了する
//引数：顧客ID
//executePactidの実行結果
//返値：深刻なエラーが発生したらfalseを返す
class ProcessCalc extends ProcessCarid {
	ProcessCalc(procname, logpath, opentime) {
		this.ProcessCarid(procname, logpath, opentime);
	}

	getProcname() {
		return "\u79D1\u76EE\u8A08\u7B97\u30D7\u30ED\u30BB\u30B9";
	}

	beginPactid(pactid) //計算中の履歴を作る
	{
		if (!this.beginDB()) return false;
		var sql = "insert into bill_history_tb(pactid,year,month";
		sql += ",carid,username,recdate,status)values";
		sql += "(" + this.m_db.escape(pactid);
		sql += "," + this.m_db.escape(this.m_year);
		sql += "," + this.m_db.escape(this.m_month);
		var carid = this.m_carid;
		if (0 == carid.length) carid = G_CARRIER_ALL;
		sql += "," + this.m_db.escape(carid);
		sql += ",'" + this.m_db.escape(G_PROCNAME_CALC) + "'";
		sql += ",'" + date("Y-m-d H:i:s") + "'";
		sql += ",'1')";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		if (!this.endDB(true)) return false;
		if (!this.beginDB()) return false;
		return true;
	}

	executePactid(pactid, logpath) //合計項目の有無を取り出す
	//tel_bill系---------------------------------------------------------
	//tel_details_X_tbの読み出しインスタンスを作る
	//tel_bill系のインスタンスを解放する
	//bill系-------------------------------------------------------------
	//bill系の一括生成インスタンスを作る
	//bill_X_tbの作成の準備をする
	{
		var no = this.getTableNo();
		var year = this.m_year;
		var month = this.m_month;
		var carid = this.m_carid;
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
		return true;
	}

	endPactid(pactid, status) //通常のトランザクション終了
	{
		if (!this.endDB(status)) return false;
		if (!this.beginDB()) return false;
		var sql = "";
		if (status) sql = "update bill_history_tb set status='2C'";else sql = "delete from bill_history_tb";
		sql += " where pactid=" + this.m_db.escape(pactid);
		sql += " and year=" + this.m_db.escape(this.m_year);
		sql += " and month=" + this.m_db.escape(this.m_month);
		var carid = this.m_carid;
		if (0 == carid.length) carid = G_CARRIER_ALL;
		sql += " and carid=" + this.m_db.escape(carid);
		sql += " and username='" + this.m_db.escape(G_PROCNAME_CALC) + "'";
		sql += " and status='1'";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		if (!this.endDB(true)) return false;
		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessCalc(G_PROCNAME_CALC, log, G_OPENTIME_CALC);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);