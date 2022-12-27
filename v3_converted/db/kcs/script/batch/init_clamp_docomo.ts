//===========================================================================
//機能：クランプファイルテーブル初期化プロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：クランプファイルテーブル初期化プロセス(ドコモ専用)
//2007/07/16 移行に伴い変更
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/clampfile_tb.php");

const G_PROCNAME_INIT_CLAMP_DOCOMO = "init_clamp_docomo";
const G_OPENTIME_INIT_CLAMP_DOCOMO = "0000,2400";

//既存のクランプテーブルを削除するならtrue
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
class ProcessInitClampDocomo extends ProcessDefault {
	ProcessInitClampDocomo(procname, logpath, opentime) {
		this.ProcessDefault(procname, logpath, opentime);
		this.m_args.addSetting({
			f: {
				type: "int"
			}
		});
		this.m_force = false;
	}

	getProcname() {
		return "\u30AF\u30E9\u30F3\u30D7\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30EA\u30B9\u30C8\u521D\u671F\u5316\u30D7\u30ED\u30BB\u30B9(\u30C9\u30B3\u30E2\u5C02\u7528)";
	}

	commitArg(args) {
		if (!ProcessDefault.commitArg(args)) return false;

		switch (args.key) {
			case "f":
				this.m_force = args.value ? true : false;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessDefault.getUsage();
		rval.push(["-f={0|1}", "\u65E2\u5B58\u30EC\u30B3\u30FC\u30C9\u3092\u524A\u9664\u3059\u308B\u306A\u30891(0)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessDefault.getManual();
		rval += "\u65E2\u5B58\u306E\u30C6\u30FC\u30D6\u30EB\u3092\u524A\u9664" + (this.m_force ? "\u3059\u308B" : "\u3057\u306A\u3044") + "\n";
		return rval;
	}

	executePactid(pactid, logpath) {
		var no = this.getTableNo();

		if (this.m_force) //クランプファイルテーブルから既存のレコードを削除
			{
				var clampfile = new ClampFileTb(this.m_listener, this.m_db, this.m_table_no, "clampfile_tb", ".cla.gz");
				if (!clampfile.init(pactid, G_CARRIER_DOCOMO, this.m_year, this.m_month)) return false;
				if (!clampfile.unlink()) return false;
			}

		var sql = "select clampid as id,clamppasswd as pass,detailno";
		sql += " from clamp_tb";
		sql += " where pactid=" + this.m_db.escape(pactid);
		sql += " and carid=" + this.m_db.escape(G_CARRIER_DOCOMO);
		sql += " order by detailno";
		sql += ";";
		var result = this.m_db.getHash(sql);
		var passsize = 0;

		for (var line of Object.values(result)) if (line.id.length && line.pass.length) ++passsize;

		if (0 == result.length || 0 == passsize) {
			this.putError(G_SCRIPT_INFO, `クランプIDが無いのでスキップ${pactid}`);
			return true;
		}

		var A_type = G_CLAMP_DOCOMO_TEL_TYPE.split(",");
		var temp = G_CLAMP_DOCOMO_COMM_TYPE.split(",");

		for (var type of Object.values(temp)) A_type.push(type);

		temp = G_CLAMP_DOCOMO_INFO_TYPE.split(",");

		for (var type of Object.values(temp)) A_type.push(type);

		for (var line of Object.values(result)) //未挿入のレコードだけを追加する
		{
			if (0 == line.id.length || 0 == line.pass.length) continue;
			sql = "select type from clampfile_tb";
			sql += " where pactid=" + pactid;
			sql += " and year=" + this.m_year;
			sql += " and month=" + this.m_month;
			sql += " and carid=" + G_CARRIER_DOCOMO;
			sql += " and detailno=" + line.detailno;
			sql += ";";
			var H_temp = this.m_db.getHash(sql);
			var ready = Array();

			for (var temp of Object.values(H_temp)) ready.push(temp.type);

			for (var type of Object.values(A_type)) {
				if (-1 !== ready.indexOf(type)) continue;
				sql = "insert into clampfile_tb";
				sql += "(pactid,year,month,carid";
				sql += ",fid,status,recdate,fixdate";
				sql += ",type,detailno";
				sql += ")values";
				sql += "(" + pactid;
				sql += "," + this.m_year + "," + this.m_month;
				sql += "," + G_CARRIER_DOCOMO;
				sql += "," + "''";
				sql += "," + G_CLAMPFILE_STATUS_START;
				sql += ",'" + date("Y-m-d H:i:s") + "'";
				sql += ",'" + date("Y-m-d H:i:s") + "'";
				sql += ",'" + type + "'";
				sql += "," + line.detailno;
				sql += ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
			}
		}

		return true;
	}

};

checkClient(G_CLIENT_BOTH);
var proc = new ProcessInitClampDocomo(G_PROCNAME_INIT_CLAMP_DOCOMO, G_LOG, G_OPENTIME_INIT_CLAMP_DOCOMO);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);