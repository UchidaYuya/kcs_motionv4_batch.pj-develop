//===========================================================================
//機能：ホットライン電話追加プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：プラン警告更新プロセス
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/guess_docomo.php");

const G_PROCNAME_INSERT_TEL_DOCOMO = "insert_tel_docomo";
const G_OPENTIME_INSERT_TEL_DOCOMO = "0000,2400";

//CSVファイル名
//tel_tbにレコードを追加するか
//yearとmonthからaddtelflagを再設定するならtrue
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
class ProcessInsertTelDocomo extends ProcessDefault {
	ProcessInsertTelDocomo(procname, logpath, opentime) {
		this.ProcessDefault(procname, logpath, opentime);
		this.m_args.addSetting({
			C: {
				type: "string"
			},
			a: {
				type: "int"
			}
		});
		this.m_defaultadd = true;
	}

	getProcname() {
		return "\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u96FB\u8A71\u8FFD\u52A0\u30D7\u30ED\u30BB\u30B9";
	}

	commitArg(args) {
		if (!ProcessDefault.commitArg(args)) return false;

		switch (args.key) {
			case "C":
				this.m_csv_name = args.value;
				break;

			case "a":
				this.m_addtelflag = args.value;
				this.m_defaultadd = false;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessDefault.getUsage();
		rval.push(["-C=fname", "\u30C9\u30B3\u30E2CSV\u30D5\u30A1\u30A4\u30EB\u540D"]);
		rval.push(["-a={0|1}", "tel_tb\u306B\u8FFD\u52A0\u3059\u308B\u304B(-y\u304C\u73FE\u5728\u306A\u30891,\u3067\u306A\u3051\u308C\u30700)"]);
		return rval;
	}

	getManual() //CSVファイル名が無ければここで作る
	{
		var rval = ProcessDefault.getManual();
		if (0 == this.m_csv_name.length) this.m_csv_name = this.getDocomoCSV();
		rval += "\u30C9\u30B3\u30E2CSV\u30D5\u30A1\u30A4\u30EB\u540D" + this.m_csv_name + "\n";

		if (this.m_defaultadd) {
			if (date("Y") == this.m_year && date("n") == this.m_month) this.m_addtelflag = true;else this.m_addtelflag = false;
		}

		rval += "tel_tb\u306B\u96FB\u8A71\u8FFD\u52A0";
		rval += this.m_addtelflag ? "\u3059\u308B" : "\u3057\u306A\u3044";
		rval += "\n";
		return rval;
	}

	executePactid(pactid, logpath) //ホットラインか
	//現在月ならtel_tbにも追加するが、起動時オプションがあればそちらを優先
	{
		var csv_name = this.getDocomoCSV();
		var is_hotline = false;
		var sql = "select count(*) from pact_tb";
		sql += " where pactid=" + pactid;
		sql += " and coalesce(type,'')='H'";
		sql += ";";
		if (0 < this.m_db.getOne(sql)) is_hotline = true;

		if (!is_hotline) {
			this.putError(G_SCRIPT_INFO, "\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u3067\u7121\u3044\u306E\u3067\u7D42\u4E86" + pactid);
			return true;
		}

		var use_tel_X = true;
		var use_tel = this.m_addtelflag;
		var O_ins_tel = new GuessDocomoTel(this.m_listener, this.m_db, this.m_table_no);

		if (!O_ins_tel.execute(pactid, this.m_year, this.m_month, logpath, use_tel, use_tel_X, csv_name)) {
			this.putError(G_SCRIPT_WARNING, "\u96FB\u8A71\u8FFD\u52A0\u5931\u6557");
			return false;
		}

		return true;
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
var proc = new ProcessInsertTelDocomo(G_PROCNAME_INSERT_TEL_DOCOMO, log, G_OPENTIME_INSERT_TEL_DOCOMO);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);
echo("\n");