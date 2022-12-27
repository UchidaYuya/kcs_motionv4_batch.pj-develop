//===========================================================================
//機能：シミュレーションプロセス(汎用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：シミュレーションプロセス(汎用)
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_recom_au.php");

require("lib/update_recom_docomo.php");

const G_PROCNAME_RECOM = "recom";
const G_OPENTIME_RECOM = "0000,2400";

//処理するキャリアID
//処理する電話番号
//スキップする電話番号
//処理する月数の配列
//追加ログを出すならtrue
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
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客ごと、キャリアごとの処理を行う
//引数：顧客ID
//作業ファイル保存先
//キャリアID
//返値：深刻なエラーが発生したらfalseを返す
class ProcessRecom extends ProcessDefault {
	ProcessRecom(procname, logpath, opentime) {
		this.ProcessDefault(procname, logpath, opentime);
		this.m_args.addSetting({
			c: {
				type: "string"
			},
			t: {
				type: "string"
			},
			T: {
				type: "string"
			},
			s: {
				type: "string"
			},
			D: {
				type: "int"
			}
		});
		this.m_A_telno = Array();
		this.m_A_skip = Array();
		this.m_A_monthcnt = [1, 3, 6, 12];
		this.m_assert = 1;
		this.m_A_carid = [G_CARRIER_ALL];
	}

	getProcname() {
		return "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u30D7\u30ED\u30BB\u30B9(\u6C4E\u7528)";
	}

	checkArg(args) {
		if (!ProcessBase.checkArg(args)) return false;

		switch (args.key) {
			case "s":
				var A_month = args.value.split(",");

				for (var month of Object.values(A_month)) {
					if (month < 1 || 12 < month) {
						this.putError(G_SCRIPT_ERROR, `シミュレーション期間が不正${month}`);
						return false;
					}
				}

				if (0 == A_month.length) {
					this.putError(G_SCRIPT_ERROR, "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u671F\u9593\u304C\u306A\u3044" + args.value);
					return false;
				}

				break;

			case "c":
				var A_carid = args.value.split(",");

				for (var carid of Object.values(A_carid)) {
					if (!ctype_digit(carid)) {
						this.putError(G_SCRIPT_ERROR, "\u30AD\u30E3\u30EA\u30A2ID\u304C\u4E0D\u6B63");
						return false;
					}
				}

				break;
		}

		return true;
	}

	commitArg(args) {
		if (!ProcessDefault.commitArg(args)) return false;

		switch (args.key) {
			case "t":
				var telno = args.value.split(",");

				for (var no of Object.values(telno)) this.m_A_telno.push(no);

				break;

			case "T":
				telno = args.value.split(",");

				for (var no of Object.values(telno)) this.m_A_skip.push(no);

				break;

			case "s":
				this.m_A_monthcnt = Array();
				var A_month = args.value.split(",");

				for (var month of Object.values(A_month)) {
					if (1 <= month && month <= 12) {
						if (!(-1 !== this.m_A_monthcnt.indexOf(month))) this.m_A_monthcnt.push(month);
					}
				}

				break;

			case "c":
				this.m_A_carid = args.value.split(",");
				break;

			case "D":
				this.m_assert = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessDefault.getUsage();
		rval.push(["-t=telno[,telno...]", "\u51E6\u7406\u3059\u308B\u96FB\u8A71\u756A\u53F7(\u5168\u90E8)"]);
		rval.push(["-T=telno[,telno...]", "\u51E6\u7406\u3057\u306A\u3044\u96FB\u8A71\u756A\u53F7(\u306A\u3057)"]);
		rval.push(["-s=num[,num...]", "\u51E6\u7406\u3059\u308B\u6708\u6570(1,3,6,12)"]);
		rval.push(["-D=0,1,2", "\u8FFD\u52A0\u30ED\u30B0\u51FA\u529B\u30EC\u30D9\u30EB"]);
		rval.push(["-c=1,2,3", "\u51E6\u7406\u3059\u308B\u30AD\u30E3\u30EA\u30A2ID(1,3)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessDefault.getManual();
		rval += "\u51E6\u7406\u3059\u308B\u30AD\u30E3\u30EA\u30A2ID";

		for (var carid of Object.values(this.m_A_carid)) rval += "," + carid;

		rval += "\n";

		if (this.m_A_telno.length) {
			rval += "\u51E6\u7406\u3059\u308B\u96FB\u8A71\u756A\u53F7";

			for (var telno of Object.values(this.m_A_telno)) rval += "," + telno;

			rval += "\n";
		}

		if (this.m_A_skip.length) {
			rval += "\u51E6\u7406\u3057\u306A\u3044\u96FB\u8A71\u756A\u53F7";

			for (var telno of Object.values(this.m_A_skip)) rval += "," + telno;

			rval += "\n";
		}

		rval += "\u51E6\u7406\u3059\u308B\u671F\u9593";

		for (var monthcnt of Object.values(this.m_A_monthcnt)) rval += "," + monthcnt;

		rval += "\n";
		rval += "\u8FFD\u52A0\u30ED\u30B0\u51FA\u529B\u30EC\u30D9\u30EB" + this.m_assert + "\n";
		return rval;
	}

	executePactid(pactid, logpath) {
		if (-1 !== this.m_A_carid.indexOf(G_CARRIER_ALL)) this.m_A_carid = [G_CARRIER_DOCOMO, G_CARRIER_AU];

		for (var carid of Object.values(this.m_A_carid)) if (!this.execute_carid(pactid, logpath, carid)) return false;

		return true;
	}

	execute_carid(pactid, logpath, carid) //sim_trend_X_tbにレコードが無ければ処理しない
	{
		var no = this.getTableNo();
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
				var update_recom = new UpdateRecomDocomo(this.m_listener, this.m_db, this.m_table_no, ins_recom, ins_log, Array(), this.m_A_monthcnt, this.m_assert);
				if (!update_recom.delete(pactid, this.m_year, this.m_month, this.m_A_telno, this.m_A_skip, logpath + "plan_recom_tb_" + carid + ".delete", true)) return false;
				if (!update_recom.execute(pactid, this.m_year, this.m_month, this.m_A_telno, this.m_A_skip)) return false;
			} else if (G_CARRIER_AU == carid) //AUを処理する
			//更新型の作成
			//既存レコードの削除
			{
				ins_recom = new TableInserter(this.m_listener, this.m_db, logpath + "plan_recom_tb_" + carid + ".insert", true);
				ins_log = new TableInserter(this.m_listener, this.m_db, logpath + "sim_log_tb_" + carid + ".insert", true);
				update_recom = new UpdateRecomAU(this.m_listener, this.m_db, this.m_table_no, ins_recom, ins_log, Array(), this.m_A_monthcnt, this.m_assert);
				if (!update_recom.delete(pactid, this.m_year, this.m_month, this.m_A_telno, this.m_A_skip, logpath + "plan_recom_tb_" + carid + ".delete", true)) return false;
				if (!update_recom.execute(pactid, this.m_year, this.m_month, this.m_A_telno, this.m_A_skip)) return false;
			} else {
			this.putError(G_SCRIPT_WARNING, "carid(" + carid + ")\u306F\u51E6\u7406\u3067\u304D\u306A\u3044");
		}

		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessRecom(G_PROCNAME_RECOM, log, G_OPENTIME_RECOM);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);