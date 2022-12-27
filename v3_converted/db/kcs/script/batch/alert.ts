//===========================================================================
//機能：プラン警告更新プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：プラン警告更新プロセス
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_alert.php");

require("lib/guess_docomo.php");

const G_PROCNAME_ALERT = "alert";
const G_OPENTIME_ALERT = "0000,2400";

//CSVファイル名
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
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：CSVファイル名を返す
class ProcessAlert extends ProcessCarid {
	ProcessAlert(procname, logpath, opentime) {
		this.ProcessCarid(procname, logpath, opentime);
		this.m_args.addSetting({
			C: {
				type: "string"
			}
		});
	}

	getProcname() {
		return "\u30D7\u30E9\u30F3\u8B66\u544A\u66F4\u65B0\u30D7\u30ED\u30BB\u30B9";
	}

	commitArg(args) {
		if (!ProcessCarid.commitArg(args)) return false;

		switch (args.key) {
			case "C":
				this.m_csv_name = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessCarid.getUsage();
		rval.push(["-C=fname", "\u30C9\u30B3\u30E2CSV\u30D5\u30A1\u30A4\u30EB\u540D"]);
		return rval;
	}

	getManual() //CSVファイル名が無ければここで作る
	{
		var rval = ProcessCarid.getManual();
		if (0 == this.m_csv_name.length) this.m_csv_name = this.getDocomoCSV();
		rval += "\u30C9\u30B3\u30E2CSV\u30D5\u30A1\u30A4\u30EB\u540D" + this.m_csv_name + "\n";
		return rval;
	}

	executePactid(pactid, logpath) //警告フラグを立てる
	//CSV出力
	{
		var csv_name = this.getDocomoCSV();
		var rval = true;
		var alert = CreateUpdateAlert(this.m_listener, this.m_db, this.m_table_no);
		var A_carid = Array();
		if (this.m_carid.length) A_carid.push(this.m_carid);
		rval = alert.execute([pactid], A_carid, this.m_year, this.m_month, logpath + "tel_tb.delete");
		var O_csv = new GuessDocomoCSV(this.m_listener, this.m_db, this.m_table_no, csv_name);

		if (!O_csv.execute(pactid, this.m_year, this.m_month)) {
			this.putError(G_SCRIPT_WARNING, "CSV\u51FA\u529B\u5931\u6557");
			return false;
		}

		return rval;
	}

	getDocomoCSV() {
		var csv_name = this.m_csv_name;

		if (0 == csv_name.length) {
			csv_name = str_replace("%s", date("YmdHis"), G_DOCOMO_ALERT_CSV);
		}

		return csv_name;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessAlert(G_PROCNAME_ALERT, log, G_OPENTIME_ALERT);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);