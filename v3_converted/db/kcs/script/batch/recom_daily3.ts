//===========================================================================
//機能：シミュレーションプロセス(手動入力部分実行)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//===========================================================================
//機能：シミュレーションプロセス(手動入力部分実行)
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_recom_base3.php");

require("lib/update_recom_docomo3.php");

require("lib/update_recom_au3.php");

require("lib/update_recom_softbank3.php");

require("lib/update_recom_index3.php");

const G_PROCNAME_RECOM_DAILY3 = "recom_daily3v";
const G_OPENTIME_RECOM_DAILY3 = "0000,2400";

//追加ログ出力レベル
//sim_log_tbを保存するならtrue
//一社だけ処理して終了するならtrue
//実行待機を実行するならtrue
//処理中の顧客ID(ログ出力用)
//処理中の年(ログ出力用)
//処理中の月(ログ出力用)
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：一個のARGVの内容を確認する
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
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
//-----------------------------------------------------------------------
//機能：処理すべきデータが無ければfalseを返す
//備考：エラーがあってもログを出さず処理を継続する
//機能：sim_index_tbから条件にあった最初の顧客IDを取り出す
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客一個分の処理を行う
//返値：深刻なエラーが発生したらfalseを返す
class ProcessRecomDaily extends ProcessBase {
	constructor(procname, logpath, opentime) //デフォルト値の設定
	{
		super(procname, logpath, opentime);
		this.m_args.addSetting({
			D: {
				type: "int"
			},
			L: {
				type: "int"
			},
			a: {
				type: "int"
			},
			A: {
				type: "int"
			}
		});
		this.m_level = 3;
		this.m_is_write_log = false;
		this.m_is_once = true;
		this.m_is_exec_wait = false;
	}

	getProcname() {
		return "\u65E5\u6B21\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u518D\u5B9F\u884C\u30D7\u30ED\u30BB\u30B9";
	}

	checkArg(args) {
		if (!super.checkArg(args)) return false;
		return true;
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "D":
				this.m_level = args.value;
				break;

			case "L":
				this.m_is_write_log = args.value;
				break;

			case "a":
				this.m_is_once = !args.value;
				break;

			case "A":
				this.m_is_exec_wait = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = super.getUsage();
		rval.push(["-D=0,1,2", "\u8FFD\u52A0\u30ED\u30B0\u51FA\u529B\u30EC\u30D9\u30EB"]);
		rval.push(["-L={0,1}", "sim_log_tb\u3092\u4FDD\u5B58\u3059\u308B\u306A\u30891(0)"]);
		rval.push(["-a={0|1}", "\u4E00\u793E\u3057\u304B\u5B9F\u884C\u3057\u306A\u3044\u306A\u30890(0)"]);
		rval.push(["-A={0|1}", "\u5B9F\u884C\u5F85\u6A5F\u306A\u30891/\u672A\u5B9F\u884C\u306A\u30890(0)"]);
		return rval;
	}

	getManual() {
		var rval = super.getManual();
		rval += "\u8FFD\u52A0\u30ED\u30B0\u51FA\u529B\u30EC\u30D9\u30EB:" + this.m_level + "\n";
		rval += "sim_log_tb\u306B\u4FDD\u5B58" + (this.m_is_write_log ? "\u3059\u308B" : "\u3057\u306A\u3044") + "\n";
		rval += "\u4E00\u793E\u3060\u3051\u51E6\u7406\u3057\u3066\u7D42\u4E86" + (this.m_is_once ? "\u3059\u308B" : "\u3057\u306A\u3044") + "\n";
		rval += (this.m_is_exec_wait ? "\u5B9F\u884C\u5F85\u6A5F" : "\u672A\u5B9F\u884C") + "\u3092\u5B9F\u884C\n";
		return rval;
	}

	getCurrentPactid() {
		return this.m_cur_pactid;
	}

	getCurrentMonth() {
		return this.m_cur_year + "/" + this.m_cur_month;
	}

	isRequest() {
		var O_index = new UpdateRecomIndex(this.m_listener, this.m_db, this.m_table_no);
		var pactid = undefined;
		var A_simid = Array();
		this.getFirstPactid(O_index, pactid, A_simid, Array());
		return undefined !== pactid;
	}

	getFirstPactid(O_index: UpdateRecomIndex, pactid, A_simid: {} | any[], A_pactid_out: {} | any[]) //未実行
	//is_saveがfalse
	//is_manualがtrue
	//全顧客
	//顧客IDがあれば処理すべきシミュレーションIDを取り出す
	{
		var A_status = [this.m_is_exec_wait ? UpdateRecomIndex.g_status_wait : UpdateRecomIndex.g_status_begin];
		var A_is_save = [false];
		var A_is_manual = [true];
		pactid = O_index.getPactid(A_status, A_is_save, A_is_manual, Array(), Array());
		A_simid = Array();

		if (undefined !== pactid) {
			A_simid = O_index.getSimID(pactid, A_status, undefined, undefined, A_is_save, A_is_manual);
		}
	}

	do_execute() //インデックスインスタンスを作る
	//処理済み顧客ID
	//処理回数
	{
		var O_index = new UpdateRecomIndex(this.m_listener, this.m_db, this.m_table_no);
		var A_pactid_out = Array();
		var count = 0;
		var all_status = true;

		for (; true; ++count) //一社のみ実行で実行済みならループを抜ける
		//再実行要求を取り出す
		//ログ保存先フォルダを作成する
		//要求のステータスを実行中に変更する
		//前月であっても、年月は元のままとする
		//実行要求のステータスを実行終了にする
		//前月であっても、年月は元のままとする
		{
			if (this.m_is_once && count) break;
			sleep(1);
			if (!this.beginDB()) return false;
			var pactid = undefined;
			var A_simid = Array();
			this.getFirstPactid(O_index, pactid, A_simid, A_pactid_out);

			if (!(undefined !== pactid)) {
				if (!this.endDB(false)) return false;
				break;
			}

			if (!this.isOpen()) {
				this.putError(G_SCRIPT_WARNING, "\u624B\u52D5\u5165\u529B\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u5B9F\u884C\u4E2D\u306B\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u3092\u30AA\u30FC\u30D0\u30FC");
				if (!this.endDB(false)) return false;
				break;
			}

			A_pactid_out.push(pactid);
			var log = new ProcessLog();
			log.setPath(this.m_listener, this.m_curpath, pactid + "/");
			this.m_listener.m_A_listener = Array();
			this.m_listener.putListener(log);
			this.m_listener.putListener(this.m_listener_error);
			this.putError(G_SCRIPT_BEGIN, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u518D\u5B9F\u884C\u958B\u59CB" + pactid);
			O_index.updateStatus(A_simid, UpdateRecomIndex.g_status_running);
			if (!this.endDB(true)) return false;
			if (!this.beginDB()) return false;
			var status = true;
			var A_simid_error = Array();
			status = this.executeParam(A_simid_error, pactid, A_simid, log.m_path);
			O_index.updateStatus(A_simid, UpdateRecomIndex.g_status_end, Array(), A_simid_error);
			if (!this.endDB(status)) return false;
			this.putError(G_SCRIPT_BEGIN, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u518D\u5B9F\u884C\u7D42\u4E86" + pactid);
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

	executeParam(A_simid_error: {} | any[], pactid, A_simid: {} | any[], logpath) //更新型を作成する
	//挿入インスタンスを作成する
	//挿入準備を行う
	//sim_details_tbから該当するシミュレーションIDのレコードを削除する
	//後処理バッチの処理リストを作る
	{
		var O_index = new UpdateRecomIndex(this.m_listener, this.m_db, this.m_table_no);
		var O_inserter_details = new TableInserter(this.m_listener, this.m_db, logpath + "sim_details_tb.insert", true);
		O_inserter_details.setUnlock();
		var O_inserter_index = new TableInserter(this.m_listener, this.m_db, logpath + "sim_index_tb.insert", true);
		O_inserter_index.setUnlock();
		var O_inserter_log = new TableInserter(this.m_listener, this.m_db, logpath + "sim_log_tb.insert", true);
		O_inserter_log.setUnlock();

		if (!O_inserter_index.begin("sim_index_tb")) {
			this.putError(G_SCRIPT_ERROR, "sim_index_tb->begin\u5931\u6557");
			return false;
		}

		if (!O_inserter_details.begin("sim_details_tb")) {
			this.putError(G_SCRIPT_ERROR, "sim_details_tb->begin\u5931\u6557");
			return false;
		}

		if (!O_inserter_log.begin("sim_log_tb")) {
			this.putError(G_SCRIPT_ERROR, "sim_log_tb->begin\u5931\u6557");
			return false;
		}

		var O_docomo = new UpdateRecomDocomo(this.m_listener, this.m_db, this.m_table_no, O_inserter_log, this.m_level);
		O_index.addCarrier(G_CARRIER_DOCOMO, O_docomo);
		var O_au = new UpdateRecomAU(this.m_listener, this.m_db, this.m_table_no, O_inserter_log, this.m_level);
		O_index.addCarrier(G_CARRIER_AU, O_au);
		var O_softbank = new UpdateRecomSoftbank(this.m_listener, this.m_db, this.m_table_no, O_inserter_log, this.m_level);
		O_index.addCarrier(UpdateRecomSoftbank.g_carid, O_softbank);

		if (!O_index.deleteSimID(A_simid, logpath + "sim_details_tb.delete", false)) {
			this.putError(G_SCRIPT_WARNING, "sim_details_tb\u524A\u9664\u5931\u6557");
			return false;
		}

		var A_param = O_index.getIndex(A_simid);
		var H_part = O_index.partIndex(A_param);
		A_simid_error = Array();

		if (!O_index.execute(O_inserter_details, A_simid_error, H_part, Array(), Array(), strftime("%Y-%m-%d"))) {
			this.putError(G_SCRIPT_WARNING, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u5931\u6557" + pactid);
			return false;
		}

		if (!O_inserter_index.end()) {
			this.putError(G_SCRIPT_ERROR, "sim_index_tb->end\u5931\u6557");
			return false;
		}

		if (!O_inserter_details.end()) {
			this.putError(G_SCRIPT_ERROR, "sim_details_tb->end\u5931\u6557");
			return false;
		}

		if (this.m_is_write_log) {
			if (!O_inserter_log.end()) {
				this.putError(G_SCRIPT_ERROR, "sim_log_tb->end\u5931\u6557");
				return false;
			}
		} else {
			this.putError(G_SCRIPT_INFO, "sim_log_tb\u3078\u306F\u66F8\u304D\u8FBC\u307E\u305A");
		}

		for (var H_param of Object.values(A_param)) {
			if (H_param.is_change_carrier) {
				var sql = PGPOOL_NO_INSERT_LOCK + "insert into sim_postprocess_tb";
				sql += "(simid,status,recdate)";
				sql += "values(" + H_param.simid;
				sql += ",0";
				sql += ",'" + date("Y-m-d H:i:s") + "'";
				sql += ");";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
			}
		}

		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_RECALC) log = G_LOG_RECALC;
var proc = new ProcessRecomDaily(G_PROCNAME_RECOM_DAILY3, log, G_OPENTIME_RECOM_DAILY3);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.isRequest()) throw die(0);
if (!proc.execute()) throw die(1);
throw die(0);