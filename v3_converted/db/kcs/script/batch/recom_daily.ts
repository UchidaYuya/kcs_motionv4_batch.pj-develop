//===========================================================================
//機能：日次シミュレーション再実行プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//日次シミュレーション再実行プロセス
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_recom_au.php");

require("lib/update_recom_docomo.php");

const G_PROCNAME_RECOM_DAILY = "recom_daily";
const G_OPENTIME_RECOM_DAILY = "0000,2400";

//前月を処理するなら1
//処理中の顧客ID(ログ出力用)
//処理中の年(ログ出力用)
//処理中の月(ログ出力用)
//ショップ毎の実行回数制限を行うならtrue
//追加ログを出すならtrue
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
//機能：現在処理中の顧客IDを返す
//備考：特定の顧客を処理中で無い場合は、ゼロを返す
//機能：現在処理中の年月を返す(yyyy/mm形式)
//備考：特定の年月を処理していない場合は空文字列を返す
//機能：処理すべきデータが無ければfalseを返す
//備考：エラーがあってもログを出さず処理を継続する
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：再実行を行う
//引数：実行パラメータ{pactid,year,month,carid}
//ログ出力先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessRecomDaily extends ProcessBase {
	ProcessRecomDaily(procname, logpath, opentime) {
		this.ProcessBase(procname, logpath, opentime);
		this.m_args.addSetting({
			Y: {
				type: "int"
			},
			a: {
				type: "int"
			},
			D: {
				type: "int"
			}
		});
		this.m_last_month = 0;
		this.m_all_pact = false;
		this.m_assert = 1;
	}

	getProcname() {
		return "\u65E5\u6B21\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u518D\u5B9F\u884C\u30D7\u30ED\u30BB\u30B9";
	}

	commitArg(args) {
		if (!ProcessBase.commitArg(args)) return false;

		switch (args.key) {
			case "Y":
				this.m_last_month = args.value;
				break;

			case "a":
				this.m_all_pact = args.value;
				break;

			case "D":
				this.m_assert = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessBase.getUsage();
		rval.push(["-Y={0|1}", "\u524D\u6708\u3092\u51E6\u7406\u3059\u308B\u306A\u3089true"]);
		rval.push(["-a={0|1}", "\u30B7\u30E7\u30C3\u30D7\u6BCE\u306B\u4E00\u793E\u3057\u304B\u5B9F\u884C\u3057\u306A\u3044\u306A\u30890(0)"]);
		rval.push(["-D=0,1,2", "\u8FFD\u52A0\u30ED\u30B0\u51FA\u529B\u30EC\u30D9\u30EB"]);
		return rval;
	}

	getManual() {
		var rval = ProcessBase.getManual();

		if (this.m_last_month) {
			rval += this.m_last_month;
			rval += "\u30F6\u6708\u524D\u3092\u51E6\u7406\u3059\u308B\n";
		} else {
			rval += "\u4ECA\u6708\u3092\u51E6\u7406\u3059\u308B\n";
		}

		if (this.m_all_pact) rval += "\u30B7\u30E7\u30C3\u30D7\u6BCE\u306E\u5236\u9650\u3092\u884C\u308F\u306A\u3044\n";else rval += "\u30B7\u30E7\u30C3\u30D7\u6BCE\u306B\u4E00\u793E\u306E\u9867\u5BA2\u3057\u304B\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3057\u306A\u3044\n";
		rval += "\u8FFD\u52A0\u30ED\u30B0\u51FA\u529B\u30EC\u30D9\u30EB" + this.m_assert + "\n";
		return rval;
	}

	getCurrentPactid() {
		return this.m_cur_pactid;
	}

	getCurrentMonth() {
		return this.m_cur_year + "/" + this.m_cur_month;
	}

	isRequest() {
		var sql = "select count(*) from plan_history_tb";
		sql += " where status in ('0')";
		sql += ";";
		return 0 < this.m_db.getOne(sql);
	}

	do_execute() //処理済みショップ
	//処理回数
	{
		var A_shopid = Array();
		var count = 0;
		var all_status = true;

		for (; true; ++count) //再実行要求を取り出す
		//処理済みショップを追加する
		//前月を処理するなら一ヶ月巻き戻す
		//ログ保存先フォルダを作成する
		//要求のステータスを実行中に変更する
		//実行要求のステータスを実行終了にする
		{
			sleep(1);
			if (!this.beginDB()) return false;
			var sql = "select pactid,carid,year,month from plan_history_tb";
			sql += " where status in ('0')";

			if (count(A_shopid)) //処理済みショップは無視する
				{
					sql += " and pactid not in (";
					sql += " select pactid from shop_relation_tb";
					sql += " where shopid in (" + A_shopid.join(",") + ")";
					sql += " and carid in(" + G_CARRIER_DOCOMO + "," + G_CARRIER_AU + ")";
					sql += " group by pactid";
					sql += ")";
				}

			sql += " group by pactid,carid,year,month";
			sql += " order by pactid,carid,year,month";
			sql += " limit 1";
			if (this.m_debugflag) sql += " offset " + this.m_db.escape(count);
			sql += ";";
			var param = this.m_db.getHash(sql);

			if (0 == count(param)) {
				if (!this.endDB(false)) return false;
				break;
			}

			param = param[0];
			sql = "select shopid from shop_relation_tb";
			sql += " where pactid=" + param.pactid;
			sql += " and carid in(" + G_CARRIER_DOCOMO + "," + G_CARRIER_AU + ")";
			sql += " group by shopid";
			sql += ";";
			var shop_list = this.m_db.getAll(sql);

			for (var line of Object.values(shop_list)) {
				var shopid = line[0];
				if (!(-1 !== A_shopid.indexOf(shopid)) && !this.m_all_pact) A_shopid.push(shopid);
			}

			var orig_year = param.year;
			var orig_month = param.month;

			for (var cnt = 0; cnt < this.m_last_month; ++cnt) {
				param.month = param.month - 1;

				if (0 == param.month) {
					param.month = 12;
					param.year = param.year - 1;
				}
			}

			this.m_cur_pactid = param.pactid;
			this.m_cur_year = param.year;
			this.m_cur_month = param.month;
			var log = new ProcessLog();
			log.setPath(this.m_listener, this.m_curpath, param.pactid + "_" + sprintf("%04d%02d", param.year, param.month) + "_" + param.carid + "/");
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(log);
			this.m_listener.putListener(this.m_listener_error);
			this.putError(G_SCRIPT_BEGIN, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u518D\u5B9F\u884C\u958B\u59CB" + param.pactid + "," + param.year + param.month + "," + param.carid);
			sql = "update plan_history_tb set status='1'";
			sql += " where status in('0')";
			sql += " and pactid=" + this.m_db.escape(param.pactid);
			sql += " and year=" + this.m_db.escape(orig_year);
			sql += " and month=" + this.m_db.escape(orig_month);
			sql += " and carid=" + this.m_db.escape(param.carid);
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
			if (!this.endDB(true)) return false;
			if (!this.beginDB()) return false;
			var status = this.executeParam(param, log.m_path);
			sql = "update plan_history_tb set status='2'";
			sql += " where status in('1')";
			sql += " and pactid=" + this.m_db.escape(param.pactid);
			sql += " and year=" + this.m_db.escape(orig_year);
			sql += " and month=" + this.m_db.escape(orig_month);
			sql += " and carid=" + this.m_db.escape(param.carid);
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
			if (!this.endDB(status)) return false;
			this.putError(G_SCRIPT_BEGIN, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u518D\u5B9F\u884C\u7D42\u4E86" + param.pactid + "," + param.year + param.month + "," + param.carid);
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

	executeParam(param, logpath) //sim_trend_X_tbにレコードが無ければ処理しない
	{
		var year = param.year;
		var month = param.month;
		var pactid = param.pactid;
		var carid = param.carid;
		var no = this.m_table_no.get(year, month);
		var sql = "select count(*) from sim_trend_" + no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + carid;
		sql += ";";

		if (0 == this.m_db.getOne(sql)) {
			this.putError(G_SCRIPT_INFO, "sim_trend_X_tb\u306Bcarid(" + carid + ")\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u7121\u3044\u306E\u3067\u51E6\u7406\u305B\u305A" + pactid);
			return true;
		}

		if (G_CARRIER_DOCOMO == carid) //更新型の作成
			//既存レコードの削除
			{
				var ins_recom = new TableInserter(this.m_listener, this.m_db, logpath + "plan_recom_tb_" + carid + ".insert", true);
				var ins_log = new TableInserter(this.m_listener, this.m_db, logpath + "sim_log_tb_" + carid + ".insert", true);
				var update_recom = new UpdateRecomDocomo(this.m_listener, this.m_db, this.m_table_no, ins_recom, ins_log, Array(), Array(), this.m_assert);
				if (!update_recom.delete(pactid, year, month, Array(), Array(), logpath + "plan_recom_tb_" + carid + ".delete", true)) return false;
				if (!update_recom.execute(pactid, year, month, Array(), Array())) return false;
			} else if (G_CARRIER_AU == carid) //AUを処理する
			//更新型の作成
			//既存レコードの削除
			{
				ins_recom = new TableInserter(this.m_listener, this.m_db, logpath + "plan_recom_tb_" + carid + ".insert", true);
				ins_log = new TableInserter(this.m_listener, this.m_db, logpath + "sim_log_tb_" + carid + ".insert", true);
				update_recom = new UpdateRecomAU(this.m_listener, this.m_db, this.m_table_no, ins_recom, ins_log, Array(), Array(), this.m_assert);
				if (!update_recom.delete(pactid, year, month, Array(), Array(), logpath + "plan_recom_tb_" + carid + ".delete", true)) return false;
				if (!update_recom.execute(pactid, year, month, Array(), Array())) return false;
			} else {
			this.putError(G_SCRIPT_WARNING, "carid(" + carid + ")\u306F\u51E6\u7406\u3067\u304D\u306A\u3044");
		}

		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_RECALC) log = G_LOG_RECALC;
var proc = new ProcessRecomDaily(G_PROCNAME_RECOM_DAILY, log, G_OPENTIME_RECOM_DAILY);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.isRequest()) throw die(0);
if (!proc.execute()) throw die(1);
throw die(0);