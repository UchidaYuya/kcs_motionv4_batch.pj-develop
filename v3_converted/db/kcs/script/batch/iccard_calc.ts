//===========================================================================
//機能：ICカードの計算プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：ICカードの計算プロセス
error_reporting(E_ALL);

require("lib/update_iccard.php");

const G_PROCNAME_CALC_ICCARD = "iccard_calc";
const G_OPENTIME_CALC_ICCARD = "0000,2400";

//日本語のプロセス名
//計算履歴のユーザ名
//定数一覧
//UpdateBillHistoryインスタンス
//0ならclose_tbに従う
//1なら強制締め日,2なら強制集計日,3なら両方
//現在の日付の補正日数
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：このプロセスの日本語処理名を返す
//機能：プロセスを初期化する
//-----------------------------------------------------------------------
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客単位の処理を行う
//引数：顧客ID
//返値：深刻なエラーが発生したらfalseを返す
//備考：トランザクションの内部ではない
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//締め日の操作を行うならtrue
//当月の集計日の操作を行うならtrue
//前月の集計日の操作を行うならtrue
//返値：深刻なエラーが発生したらfalseを返す
//備考：トランザクション内部ではない
//機能：顧客毎の処理を実行する(トランザクション内部)
//引数：顧客ID
//作業ファイル保存先
//締め日の操作を行うならtrue
//集計日の操作を行うならtrue
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
class ProcessCalcICCard extends ProcessDefault {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime);
		this.m_procname_long = "IC\u30AB\u30FC\u30C9\u8A08\u7B97\u30D7\u30ED\u30BB\u30B9";
		var username = "";

		if (0 == username.length) {
			username = procname;
		}

		this.m_username = username;
		this.m_O_name = new UpdateBillNameICCard(this.m_listener, this.m_db, this.m_table_no);
		this.m_args.addSetting({
			M: {
				type: "int"
			}
		});
		this.m_args.addSetting({
			D: {
				type: "string"
			}
		});
		this.m_mode = 0;
		this.m_diff_days = 0;
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "M":
				this.m_mode = args.value;
				break;

			case "D":
				this.m_diff_days = args.value + 0;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = super.getUsage();
		rval.push(["-M=mode", "\u52D5\u4F5C\u30E2\u30FC\u30C9(0)"]);
		rval.push(["", "0\u306A\u3089iccard_close_tb\u306B\u5F93\u3046"]);
		rval.push(["", "1\u306A\u3089\u5F37\u5236\u7684\u306B\u7DE0\u3081\u65E5\u306E\u52D5\u4F5C\u3092\u884C\u3046"]);
		rval.push(["", "2\u306A\u3089\u5F37\u5236\u7684\u306B\u96C6\u8A08\u65E5\u306E\u52D5\u4F5C\u3092\u884C\u3046"]);
		rval.push(["", "3\u306A\u3089\u5F37\u5236\u7684\u306B\u7DE0\u3081\u65E5\u3068\u96C6\u8A08\u65E5\u306E\u52D5\u4F5C\u3092\u884C\u3046"]);
		rval.push(["-D=days", "\u73FE\u5728\u306E\u65E5\u4ED8\u306E\u88DC\u6B63\u65E5\u6570(0)"]);
		rval.push(["", "\u55B6\u696D\u958B\u59CB\u524D\u306A\u3089\u6307\u5B9A\u3057\u306A\u3044"]);
		rval.push(["", "\u55B6\u696D\u7D42\u4E86\u5F8C\u304B\u3089\u65E5\u4ED8\u304C\u5909\u308F\u308B\u307E\u3067\u306B" + "\u5B9F\u884C\u3059\u308B\u306A\u3089-D=1\u3092\u6307\u5B9A\u3059\u308B"]);
		return rval;
	}

	getManual() {
		var rval = ProcessDefault.getManual();
		rval += "\u52D5\u4F5C\u30E2\u30FC\u30C9:";

		switch (this.m_mode) {
			case 0:
				rval += "iccard_close_tb\u306B\u5F93\u3046";
				break;

			case 1:
				rval += "\u5F37\u5236\u7684\u306B\u7DE0\u3081\u65E5";
				break;

			case 2:
				rval += "\u5F37\u5236\u7684\u306B\u96C6\u8A08\u65E5";
				break;

			default:
				rval += "\u5F37\u5236\u7684\u306B\u7DE0\u3081\u65E5\u3068\u96C6\u8A08\u65E5";
				break;
		}

		rval += "\n";
		rval += "\u73FE\u5728\u306E\u65E5\u4ED8\u306E\u88DC\u6B63\u65E5\u6570" + this.m_diff_days + "\u65E5\n";
		return rval;
	}

	getProcname() {
		return this.m_procname_long;
	}

	initHist() {
		this.m_O_name.initICCard();
		this.m_O_hist = new UpdateBillHistory(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, this.m_username, false);
	}

	do_execute() //実行すべき顧客IDリストを作成する
	//顧客IDに対してループする
	{
		var A_pactid = Array();
		if (this.m_pactid.length) A_pactid = [this.m_pactid];else {
			var sql = "select pactid from pact_tb";
			sql += " where pactid!=0";
			if (this.m_is_skip_delflg) sql += " and delflg=false";

			if (0 < this.m_last_month) {
				sql += " and coalesce(type,'')='H'";
			}

			sql += " order by pactid";
			sql += ";";
			var result = this.m_db.getAll(sql);

			for (var line of Object.values(result)) A_pactid.push(line[0]);
		}
		var all_status = true;

		for (var pactid of Object.values(A_pactid)) {
			this.m_current_pactid = pactid;
			if (-1 !== this.m_A_skippactid.indexOf(pactid)) continue;

			if (this.m_ignorepact) {
				if (!this.isOpen()) break;
			}

			var status = this.do_execute_pact(pactid);
			all_status &= status;
			if (!this.m_repeatflag && !status) return status;
			this.m_current_pactid = 0;
		}

		return all_status;
	}

	do_execute_pact(pactid) //権限がなければ何もしない
	//締め日も集計日も無いなら何もしない
	//処理を行う
	//ログを元に戻す
	{
		if (!this.m_O_name.isICCard(pactid)) {
			if (this.m_pactid.length) {
				this.putError(G_SCRIPT_WARNING, "\u6A29\u9650(" + AUTH_ICCARD_CO + ")\u304C\u306A\u3044\u306E\u3067\u4F55\u3082\u3057\u306A\u3044" + "/pactid:=" + this.m_pactid);
			}

			return true;
		}

		var A_close = this.m_O_name.getClose(pactid, this.m_diff_days);

		if (!A_close.length) {
			if (!this.m_mode) {
				this.putError(G_SCRIPT_WARNING, "iccard_close_tb\u306B\u30EC\u30B3\u30FC\u30C9\u304C\u7121\u3044\u304B\u4E0D\u6B63\u306A\u306E\u3067\u51E6\u7406\u3067\u304D\u306A\u3044" + "/pactid:=" + pactid);
				return false;
			} else {
				this.putError(G_SCRIPT_WARNING, "iccard_close_tb\u306B\u30EC\u30B3\u30FC\u30C9\u304C\u7121\u3044\u304B\u4E0D\u6B63(\u51E6\u7406\u306F\u884C\u3046)" + "/pactid:=" + pactid);
			}
		}

		var is_close = false;
		var is_calc = false;
		var is_last = false;

		switch (this.m_mode) {
			case 0:
				is_close = this.m_O_name.isClose();
				is_calc = this.m_O_name.isCalc(false);
				is_last = this.m_O_name.isCalc(true);
				break;

			case 1:
				is_close = true;
				break;

			case 2:
				is_calc = true;
				break;

			default:
				is_close = true;
				is_calc = true;
				break;
		}

		this.putError(G_SCRIPT_DEBUG, "\u51E6\u7406\u5185\u5BB9" + (is_close ? "/\u7DE0\u3081\u52D5\u4F5C" : "") + (is_calc ? "/\u96C6\u8A08\u52D5\u4F5C(\u5F53\u6708)" : "") + (is_last ? "/\u96C6\u8A08\u52D5\u4F5C(\u524D\u6708)" : ""));
		if (!is_close && !is_calc && !is_last) return true;
		var log = new ProcessLog();
		log.setPath(this.m_listener, this.m_curpath, pactid + "_" + sprintf("%04d%02d", this.m_year, this.m_month) + "/");
		this.m_listener.m_A_listener = Array();
		this.m_listener.putListener(log);
		this.m_listener.putListener(this.m_listener_error);
		var status = this.executePactid(pactid, log.m_path, is_close, is_calc, is_last);
		this.m_listener.m_A_listener = Array();
		this.m_listener.putListener(this.m_listener_process);
		this.m_listener.putListener(this.m_listener_error);
		return status;
	}

	executePactid(pactid, logpath, is_close, is_calc, is_last) {
		var last_year = this.m_year;
		var last_month = this.m_month;
		--last_month;

		if (!last_month) {
			--last_year;
			last_month = 12;
		}

		if (is_calc || is_last) {
			if (false == this.beginDB()) {
				return false;
			}

			if (is_calc) {
				if (false == this.m_O_hist.insert(pactid, this.m_year, this.m_month)) {
					this.endDB(false);
					return false;
				}
			}

			if (is_last) {
				if (false == this.m_O_hist.insert(pactid, last_year, last_month)) {
					this.endDB(false);
					return false;
				}
			}

			if (false == this.endDB(true)) {
				return false;
			}
		}

		if (false == this.beginDB()) {
			return false;
		}

		var status = true;

		if (is_last) //前月を処理する
			{
				if (status) status = this.executePactidInTransaction(pactid, logpath, false, true, last_year, last_month);
			}

		if (is_close || is_calc) {
			if (status) status = this.executePactidInTransaction(pactid, logpath, is_close, is_calc, this.m_year, this.m_month);
		}

		if (false == this.endDB(status)) {
			return false;
		}

		if (is_calc || is_last) {
			if (false == this.beginDB()) {
				return false;
			}

			var is_fail = !status;

			if (is_calc) {
				if (false == this.m_O_hist.update(pactid, this.m_year, this.m_month, is_fail)) {
					this.endDB(false);
					return false;
				}
			}

			if (is_last) {
				if (false == this.m_O_hist.update(pactid, last_year, last_month, is_fail)) {
					this.endDB(false);
					return false;
				}
			}

			if (false == this.endDB(true)) {
				return false;
			}
		}

		return true;
	}

	executePactidInTransaction(pactid, logpath, is_close, is_calc, year, month) //bill側の更新型を作る
	//ASP関連情報を読み出す
	{
		var no = this.m_table_no.get(year, month);
		var O_inserter = new TableInserter(this.m_listener, this.m_db, logpath + "iccard_bill_" + no + "_tb.insert", true);
		var O_bill = new UpdateBillICCard(this.m_listener, this.m_db, this.m_table_no, this.m_O_name, O_inserter);
		if (!O_bill.initAsp(pactid)) return false;

		if (is_close) //締め日の処理を行う
			{
				if (!O_bill.execute(pactid, year, month, true, false, this.m_diff_days)) return false;
			}

		if (is_calc) //集計日の処理を行う
			//部署単位の更新型を作る
			//既存のテーブルを削除する
			{
				var O_post_bill = new UpdateBillPostICCard(this.m_listener, this.m_db, this.m_table_no, this.m_O_name);
				if (!O_bill.delete(pactid, year, month, logpath + "iccard_bill_" + no + "_tb.delete")) return false;
				if (!O_post_bill.delete(pactid, year, month, logpath + "iccard_post_bill_" + no + "_tb.delete")) return false;
				if (!O_bill.execute(pactid, year, month, false, true)) return false;
				if (!O_post_bill.execute(pactid, year, month)) return false;
			}

		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_HAND) {
	log = G_LOG_HAND;
}

var proc = new ProcessCalcICCard(G_PROCNAME_CALC_ICCARD, log, G_OPENTIME_CALC_ICCARD);
proc.initHist();

if (false == proc.readArgs(undefined)) {
	throw die(1);
}

if (false == proc.execute()) {
	throw die(1);
}

throw die(0);