//===========================================================================
//機能：交通費手動ダウンロード実行プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：交通費手動ダウンロード実行プロセス
error_reporting(E_ALL);

require("lib/process_base.php");

const G_PROCNAME_ICCARD_HAND_DOWNLOAD = "iccard_hand_download";
const G_OPENTIME_ICCARD_HAND_DOWNLOAD = "0000,2400";

//処理中の顧客ID(ログ出力用)
//実行環境
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
//機能：処理すべきデータが無ければfalseを返す
//備考：エラーがあってもログを出さず処理を継続する
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：ダウンロードを実行する
//引数：iccard_download_request_tbのレコード
//返値：深刻なエラーが発生したらfalseを返す
//機能：ステータスを更新する
//引数：iccard_download_request_tbのレコード
//元のステータス
//更新後のステータス
class ProcessICCardHandDownload extends ProcessBase {
	constructor(procname, logpath, opentime) {
		this.ProcessBase(procname, logpath, opentime);
		this.m_args.addSetting({
			E: {
				type: "string"
			}
		});
		this.m_env = "";
	}

	getProcname() {
		return "\u4EA4\u901A\u8CBB\u624B\u52D5\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5B9F\u884C\u30D7\u30ED\u30BB\u30B9";
	}

	checkArg(args) {
		if (!super.checkArg(args)) return false;
		return true;
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "E":
				this.m_env = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = super.getUsage();
		rval.push(["-E=env", "\u5B9F\u884C\u74B0\u5883(\u8A2D\u5B9A\u7121\u3057)"]);
		return rval;
	}

	getManual() {
		var rval = super.getManual();
		rval += "\u5B9F\u884C\u74B0\u5883";
		if (this.m_env.length) rval += this.m_env;else rval += "\u7121\u3057";
		rval += "\n";
		return rval;
	}

	getCurrentPactid() {
		return this.m_cur_pactid;
	}

	isRequest() {
		var sql = "select count(*) from iccard_download_request_tb";
		sql += " where status='0'";
		sql += ";";
		return 0 < this.m_db.getOne(sql);
	}

	do_execute() //処理回数
	{
		var count = 0;
		var all_status = true;

		for (; true; ++count) //計算要求を取り出す
		//ダウンロード要求のステータスをダウンロード中に変更する
		//ダウンロード中のステータスをダウンロード完了にする
		{
			if (!this.beginDB()) return false;
			var sql = "select pactid from iccard_download_request_tb";
			sql += " where status='0'";
			sql += " order by recdate,pactid";
			sql += " limit 1";
			if (this.m_debugflag) sql += " offset " + this.m_db.escape(count);
			sql += ";";
			var A_param = this.m_db.getHash(sql);

			if (0 == count(A_param)) {
				if (!this.endDB(false)) return false;
				break;
			}

			var H_param = A_param[0];
			this.putError(G_SCRIPT_BEGIN, "\u51E6\u7406\u958B\u59CB" + "/pactid:=" + H_param.pactid);
			this.updateStatus(H_param, 0, 1);
			if (!this.endDB(true)) return false;
			var status = this.executeParam(H_param);
			if (!this.beginDB()) return false;
			this.updateStatus(H_param, 1, 2);
			if (!this.endDB(status)) return false;
			all_status &= status;
			this.putError(G_SCRIPT_BEGIN, "\u51E6\u7406\u7D42\u4E86" + "/pactid:=" + H_param.pactid);
			this.m_cur_pactid = 0;
		}

		return all_status;
	}

	executeParam(H_param: {} | any[]) //外部プロセスを実行する
	{
		var O_proc = new ScriptCommand(this.m_listener, false);
		var A_arg = Array();
		var arg = " -p " + H_param.pactid + " -s N";
		if (this.m_env.length) arg += " -e " + this.m_env;
		var status = O_proc.execute("./felica_dl.sh" + arg, A_arg, Array());
		return status;
	}

	updateStatus(H_param: {} | any[], from, to) {
		var sql = "update iccard_download_request_tb set status='" + to + "'";
		sql += " where status='" + from + "'";
		sql += " and pactid=" + this.m_db.escape(H_param.pactid);
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
var proc = new ProcessICCardHandDownload(G_PROCNAME_ICCARD_HAND_DOWNLOAD, log, G_OPENTIME_ICCARD_HAND_DOWNLOAD);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.isRequest()) throw die(0);
if (!proc.execute()) throw die(1);
throw die(0);