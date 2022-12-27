//機能：FJP人事マスタファイルの、コピーバッチ
//作成：森原
//プロセス解説文字列
//実行可能時間
//機能：FJP人事マスタファイルの、コピーバッチ
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/fjp_hrm_const.php");

require("lib/fjp_hrm_common.php");

const G_PROCNAME_FJP_HRM_COPY = "fjp_hrm_copy";
const G_OPENTIME_FJP_HRM_COPY = "0000,2400";

//ロックファイルができるのを待つならtrue
//親プロセスを使わず単独動作ならtrue
//設定ファイル名(省略したらデフォルト値)
//0ならチェックのみ/1なら移動/2ならコピー
//ロックファイルを削除するならtrue
//コピー元のディレクトリ(省略したらデフォルト値)
//コピー先のディレクトリ(省略したらデフォルト値)
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
//-----------------------------------------------------------------------
//機能：DB挿入プロセスが完了するまで待機する
//備考：動作可能時刻が設定されていなければ無限ループに陥る可能性がある
//引数：モデル
//返値：コピー可能になったらtrueを返す
//タイムオーバーしたらfalseを返す
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
class ProcessFJPHRMCopy extends ProcessBase {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime);
		this.m_is_wait_for_lock = true;
		this.m_is_standalone = true;
		this.m_fname_setting = "";
		this.m_finish_mode = 1;
		this.m_is_delete_lock = true;
		this.m_dir_to = "";
		this.m_dir_from = "";
		this.m_args.addSetting({
			w: {
				type: "int"
			},
			a: {
				type: "int"
			},
			s: {
				type: "string"
			},
			M: {
				type: "int"
			},
			W: {
				type: "int"
			},
			f: {
				type: "string"
			},
			F: {
				type: "string"
			}
		});
	}

	getProcname() {
		return "FJP\u4EBA\u4E8B\u30DE\u30B9\u30BF\u30B3\u30D4\u30FC\u30D7\u30ED\u30BB\u30B9";
	}

	commitArg(args) {
		if (!super.commitArg(args)) return false;

		switch (args.key) {
			case "w":
				this.m_is_wait_for_lock = 0 != args.value;
				break;

			case "a":
				this.m_is_standalone = 0 != args.value;
				break;

			case "s":
				this.m_fname_setting = args.value;
				break;

			case "M":
				this.m_finish_mode = args.value + 0;
				break;

			case "W":
				this.m_is_delete_lock = 0 != args.value;
				break;

			case "f":
				this.m_dir_to = args.value;
				break;

			case "F":
				this.m_dir_from = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessBase.getUsage();
		rval.push(["-w={0|1}", "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u304C\u3067\u304D\u308B\u306E\u3092\u5F85\u3064\u304B(1)"]);
		rval.push(["-a={0|1}", "\u89AA\u30D7\u30ED\u30BB\u30B9\u304B\u3089\u547C\u3076\u306A\u30890(1)"]);
		rval.push(["-s=fname", "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB(\u30D5\u30EB\u30D1\u30B9)\u7701\u7565\u3057\u305F\u3089\u30C7\u30D5\u30A9\u30EB\u30C8\u5024"]);
		rval.push(["-M={0|1|2}", "\u30C1\u30A7\u30C3\u30AF\u306A\u30890/\u79FB\u52D5\u306A\u30891/\u30B3\u30D4\u30FC\u306A\u30892(1)"]);
		rval.push(["-W={0|1}", "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u3092\u524A\u9664\u3059\u308B\u306A\u30891(1)"]);
		rval.push(["-f=dir/", "\u30B3\u30D4\u30FC\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(\u53F3\u7AEF\u306F/)"]);
		rval.push(["-F=dir/", "\u30B3\u30D4\u30FC\u5143\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(\u53F3\u7AEF\u306F/)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessBase.getManual();
		rval += "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u304C\u3067\u304D\u308B\u306E\u3092";
		rval += this.m_is_wait_for_lock ? "\u5F85\u3064" : "\u5F85\u305F\u306A\u3044";
		rval += "\n";
		rval += (this.m_is_standalone ? "\u5358\u72EC\u52D5\u4F5C" : "\u89AA\u30D7\u30ED\u30BB\u30B9\u304B\u3089\u547C\u3073\u51FA\u3057") + "\n";
		rval += "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306F" + (this.m_fname_setting.length ? this.m_fname_setting : "\u30C7\u30D5\u30A9\u30EB\u30C8\u5024") + "\n";
		rval += "\u5B9F\u884C\u30E2\u30FC\u30C9\u306F";

		switch (this.m_finish_mode) {
			case 0:
				rval += "\u30C1\u30A7\u30C3\u30AF\u306E\u307F";
				break;

			case 1:
				rval += "\u79FB\u52D5";
				break;

			case 2:
				rval += "\u30B3\u30D4\u30FC";
				break;
		}

		rval += "\n";
		rval += "\u30ED\u30C3\u30AF\u30D5\u30A1\u30A4\u30EB\u3092\u524A\u9664" + (this.m_is_delete_lock ? "\u3059\u308B" : "\u3057\u306A\u3044") + "\n";
		rval += "\u30B3\u30D4\u30FC\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA" + (this.m_dir_to.length ? this.m_dir_to : "\u30C7\u30D5\u30A9\u30EB\u30C8\u5024") + "\n";
		rval += "\u30B3\u30D4\u30FC\u5143\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA" + (this.m_dir_from.length ? this.m_dir_from : "\u30C7\u30D5\u30A9\u30EB\u30C8\u5024") + "\n";
		return rval;
	}

	wait(O_model: FJPProcCopyType) {
		if (!this.m_is_wait_for_lock) return true;

		while (true) //タイムアウトしたらfalseを返す
		{
			if (!this.isOpen()) return false;
			if (O_model.isReadyLock()) break;
			sleep(10);
		}

		return true;
	}

	do_execute() //モデルを生成する
	//設定ファイルが開けなかったら終了する
	//トランザクション開始
	//移動を実行する
	//トランザクション破棄または反映
	{
		var O_model = new FJPProcCopyType(this.m_listener, this.m_db, this.m_table_no, date("Y"), date("n"), this.m_listener_process.m_path, this.m_is_standalone, this.m_fname_setting, this.m_finish_mode, this.m_is_delete_lock && this.m_is_wait_for_lock, this.m_dir_from, this.m_dir_to);
		if (O_model.isFailSetting()) return false;
		var is_timeout = !this.wait(O_model);
		this.beginDB();
		var is_ok = O_model.execute(is_timeout);
		this.endDB(is_ok);
		return is_ok;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessFJPHRMCopy(G_PROCNAME_FJP_HRM_COPY, log, G_OPENTIME_FJP_HRM_COPY);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);