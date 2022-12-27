//===========================================================================
//機能：ICカードの再計算プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：運輸の再計算プロセス
error_reporting(E_ALL);

require("lib/update_iccard.php");

const G_PROCNAME_RECALC_ICCARD = "iccard_recalc";
const G_OPENTIME_RECALC_ICCARD = "0000,2400";

//日本語のプロセス名
//定数一覧
//UpdateBillHistoryインスタンス
//処理中の顧客ID(ログ出力用)
//処理中の年(ログ出力用)
//処理中の月(ログ出力用)
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：プロセスを初期化する
//機能：現在処理中の顧客IDを返す
//備考：特定の顧客を処理中で無い場合は、ゼロを返す
//機能：現在処理中の年月を返す(yyyy/mm形式)
//備考：特定の年月を処理していない場合は空文字列を返す
//機能：処理すべきデータが無ければfalseを返す
//備考：エラーがあってもログを出さず処理を継続する
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：再計算を行う
//引数：計算パラメータ{pactid,year,month}
//ログ出力先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessRecalcICCard extends ProcessBase {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime);
		this.m_O_name = new UpdateBillNameICCard(this.m_listener, this.m_db, this.m_table_no);
		this.m_procname_long = "IC\u30AB\u30FC\u30C9\u518D\u8A08\u7B97\u30D7\u30ED\u30BB\u30B9";
	}

	getProcname() {
		return this.m_procname_long;
	}

	initHist() {
		this.m_O_name.initICCard();
		this.m_O_hist = new UpdateBillHistory(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, "", true);
	}

	getCurrentPactid() {
		return this.m_cur_pactid;
	}

	getCurrentMonth() {
		return this.m_cur_year + "/" + this.m_cur_month;
	}

	isRequest() {
		return 0 < this.m_O_hist.getLimit();
	}

	do_execute() //処理回数
	{
		var count = 0;
		var all_status = true;

		for (; true; ++count) //計算要求を取り出す
		//ログ保存先フォルダを作成する
		//計算要求のステータスを計算中に変更する
		//計算要求のステータスを計算終了にする
		{
			if (false == this.beginDB()) {
				return false;
			}

			var H_param = Array();
			this.m_O_hist.get(H_param, count, this.m_debugflag);

			if (0 == count(H_param)) {
				if (false == this.endDB(false)) {
					return false;
				}

				break;
			}

			this.m_cur_pactid = H_param.pactid;
			this.m_cur_year = H_param.year;
			this.m_cur_month = H_param.month;
			var log = new ProcessLog();
			log.setPath(this.m_listener, this.m_curpath, H_param.pactid + "_" + sprintf("%04d%02d", H_param.year, H_param.month) + "/");
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(log);
			this.m_listener.putListener(this.m_listener_error);
			this.putError(G_SCRIPT_BEGIN, "\u518D\u8A08\u7B97\u958B\u59CB" + H_param.pactid + "," + H_param.year + H_param.month);
			this.m_O_hist.start(H_param);

			if (false == this.endDB(true)) {
				return false;
			}

			if (false == this.beginDB()) {
				return false;
			}

			var status = this.executeParam(H_param, log.m_path);
			this.m_O_hist.update(H_param.pactid, H_param.year, H_param.month, !status);

			if (false == this.endDB(status)) {
				return false;
			}

			this.putError(G_SCRIPT_BEGIN, "\u518D\u8A08\u7B97\u7D42\u4E86" + H_param.pactid + "," + H_param.year + H_param.month);
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(this.m_listener_process);
			this.m_listener.putListener(this.m_listener_error);
			all_status &= status;
			delete log;

			if (false == status) {
				return status;
			}

			this.m_cur_pactid = 0;
			this.m_cur_year = 0;
			this.m_cur_month = 0;
		}

		return all_status;
	}

	executeParam(H_param, logpath) //bill側の更新型を作る
	//ASP関連情報を読み出す
	//既存のテーブルを削除する
	{
		var pactid = H_param.pactid;
		var year = H_param.year;
		var month = H_param.month;
		var no = this.m_table_no.get(year, month);
		no = this.m_table_no.get(year, month);
		var O_inserter = new TableInserter(this.m_listener, this.m_db, logpath + "iccard_bill_" + no + "_tb.insert", true);
		var O_bill = new UpdateBillICCard(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, O_inserter);
		if (!O_bill.initAsp(pactid)) return false;
		var O_post_bill = new UpdateBillPostICCard(this.m_listener, this.m_db, this.m_table_no, this.m_O_name);
		if (!O_bill.delete(pactid, year, month, logpath + "iccard_bill_" + no + "_tb.delete")) return false;
		if (!O_post_bill.delete(pactid, year, month, logpath + "iccard_post_bill_" + no + "_tb.delete")) return false;
		if (!O_bill.execute(pactid, year, month, false, true)) return false;
		if (!O_post_bill.execute(pactid, year, month)) return false;
		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_RECALC) {
	log = G_LOG_RECALC;
}

var proc = new ProcessRecalcICCard(G_PROCNAME_RECALC_ICCARD, log, G_OPENTIME_RECALC_ICCARD);
proc.initHist();

if (false == proc.readArgs(undefined)) {
	throw die(1);
}

if (false == proc.isRequest()) {
	throw die(0);
}

if (false == proc.execute()) {
	throw die(1);
}

throw die(0);