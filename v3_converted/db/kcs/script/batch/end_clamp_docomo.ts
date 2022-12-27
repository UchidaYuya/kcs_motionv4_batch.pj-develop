//===========================================================================
//機能：クランプダウンロード済みファイルコピー(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：クランプダウンロード済みファイルコピー(ドコモ専用)
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/clampfile_tb.php");

const G_PROCNAME_END_CLAMP_DOCOMO = "end_clamp_docomo";
const G_OPENTIME_END_CLAMP_DOCOMO = "0000,2400";

//clamptemp_tbの接続用
//顧客ID
//処理しない顧客ID
//年
//月
//一度だけ起動するならtrue
//falseなら、実行可能時間の間は動作し続ける
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
//機能：DBのセッションを開始する
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBのセッションを終了する
//引数：commitするならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：現在処理中の顧客IDを返す
//備考：特定の顧客を処理中で無い場合は、ゼロを返す
//機能：現在処理中の年月を返す(yyyy/mm形式)
//備考：特定の年月を処理していない場合は空文字列を返す
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
//機能：転送を一回行う
//返値：深刻なエラーが発生したらfalseを返す
//機能：転送可能なファイル情報を取り出す
//引数：{pactid,type,fid}*を返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：clamptempからclampfileへファイルコピーを行う
//引数：{pactid,type,fid,detailno}*を受け取りfidを更新して返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：clamptempとclampfileのステータスを更新する
//引数：{pactid,type,fid,detailno}*
//返値：深刻なエラーが発生したらfalseを返す
//機能：SQL文のWHERE節を返す
class ProcessEndClampDocomo extends ProcessBase {
	ProcessEndClampDocomo(procname, logpath, opentime) {
		this.ProcessBase(procname, logpath, opentime);

		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
			this.m_db_temp = new ScriptDB(this.m_listener, GLOBALS.G_dsn_temp);
		} else this.m_db_temp = this.m_db;

		this.m_args.addSetting({
			p: {
				type: "int"
			},
			P: {
				type: "text"
			},
			y: {
				type: "int"
			},
			x: {
				type: "int"
			}
		});
		this.m_year = date("Y");
		this.m_month = date("n");
		this.m_A_skippostid = Array();
		this.m_oneshot = true;
	}

	getProcname() {
		return "\u30AF\u30E9\u30F3\u30D7\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u6E08\u307F\u30D5\u30A1\u30A4\u30EB\u30B3\u30D4\u30FC\u30D7\u30ED\u30BB\u30B9(\u30C9\u30B3\u30E2\u5C02\u7528)";
	}

	checkArg(args) {
		if (!ProcessBase.checkArg(args)) return false;

		switch (args.key) {
			case "y":
				var src = args.value;

				if (6 != src.length) {
					this.putError(G_SCRIPT_ERROR, `起動年月不正${src}`);
					return false;
				}

				var yyyy = src.substr(0, 4);
				var mm = src.substr(4, 2);

				if (mm < 1 || 12 < mm) {
					this.putError(G_SCRIPT_ERROR, `起動月不正${src}`);
					return false;
				}

				if (yyyy < 2000 || 2100 < yyyy) {
					this.putError(G_SCRIPT_ERROR, `起動年不正${src}`);
					return false;
				}

				break;

			case "P":
				var result = args.value.split(",");

				for (var item of Object.values(result)) {
					if (!ctype_digit(item)) {
						this.putError(G_SCRIPT_ERROR, "\u30B9\u30AD\u30C3\u30D7\u9867\u5BA2ID\u4E0D\u6B63" + args.value);
						return false;
					}
				}

				break;
		}

		return true;
	}

	commitArg(args) {
		if (!ProcessBase.commitArg(args)) return false;

		switch (args.key) {
			case "p":
				this.m_pactid = args.value;
				break;

			case "P":
				var result = args.value.split(",");

				for (var item of Object.values(result)) this.m_A_skippactid.push(item);

				break;

			case "y":
				var src = args.value;
				this.m_year = 0 + src.substr(0, 4);
				this.m_month = 0 + src.substr(4, 2);
				break;

			case "x":
				this.m_oneshot = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessBase.getUsage();
		rval.push(["-p=pactid", "\u51E6\u7406\u5BFE\u8C61\u9867\u5BA2(\u5168\u9867\u5BA2)"]);
		rval.push(["-x={0|1}", "\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u306E\u9593\u306F\u52D5\u4F5C\u3057\u7D9A\u3051\u308B\u304B(0)"]);
		rval.push(["-y=yyyymm", "\u51E6\u7406\u5BFE\u8C61\u5E74\u6708(\u73FE\u5728\u306E\u5E74\u6708)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessBase.getManual();
		rval += "\u9867\u5BA2";
		if (0 == this.m_pactid.length) rval += "\u5168\u90E8";else rval += this.m_pactid;
		rval += "\n";

		if (this.m_A_skippactid.length) {
			rval += "\u30B9\u30AD\u30C3\u30D7\u9867\u5BA2";

			for (var item of Object.values(this.m_A_skippactid)) rval += "," + item;

			rval += "\n";
		}

		rval += "\u5E74\u6708" + this.m_year + "/" + this.m_month + "\n";
		if (this.m_oneshot) rval += "\u4E00\u56DE\u3060\u3051\u79FB\u52D5\u3092\u5B9F\u884C\n";else rval += "\u5B9F\u884C\u53EF\u80FD\u6642\u9593\u306E\u9593\u306F\u52D5\u4F5C\u3057\u7D9A\u3051\u308B\n";
		return rval;
	}

	beginDB() {
		this.m_db.begin();
		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.begin();
		return true;
	}

	endDB(status) {
		if (this.m_debugflag) {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.rollback();
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollback\u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9");
		} else if (!status) {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.rollback();
			this.m_db.rollback();
		} else {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.commit();
			this.m_db.commit();
		}

		return true;
	}

	getCurrentPactid() {
		return this.m_pactid.length ? this.m_pactid : 0;
	}

	getCurrentMonth() {
		return this.m_year + "/" + this.m_month;
	}

	do_execute() {
		if (!this.isOpen()) return true;

		if (this.m_oneshot) {
			return this.executeOnce();
		} else {
			while (true) {
				if (!this.isOpen()) break;
				if (!this.executeOnce()) return false;
				sleep(60);
			}
		}

		return true;
	}

	executeOnce() //コピーが可能なpactid,fid,typeを取り出す
	//{pactid,type,fid,detailno}*
	//トランザクション開始
	//トランザクション反映
	{
		var A_param = Array();
		if (!this.beginDB()) return false;

		if (!this.getSrc(A_param)) {
			if (!this.endDB(false)) return false;
			return false;
		}

		if (!this.endDB(true)) return false;
		if (0 == A_param.length) return true;
		this.beginDB();

		if (!this.copyFile(A_param)) //トランザクション解放
			{
				this.endDB(false);
				return false;
			}

		if (!this.update(A_param)) //トランザクション解放
			{
				this.endDB(false);
				return false;
			}

		this.endDB(true);
		return true;
	}

	getSrc(A_param) {
		var sql = "select pactid,type,fid,detailno from clamptemp_tb";
		sql += this.getSQLWhere();
		if (this.m_pactid.length) sql += " and pactid=" + this.m_db.escape(this.m_pactid);else if (0 < this.m_A_skippactid.length) {
			sql += " and pactid not in(";
			var comma = false;

			for (var pactid of Object.values(this.m_A_skippactid)) {
				if (comma) sql += ",";
				comma = true;
				sql += this.m_db.escape(pactid);
			}

			sql += ")";
		}
		sql += " and status=" + this.m_db.escape(G_CLAMPFILE_STATUS_DOWNLOAD);
		sql += " order by pactid,type";
		sql += ";";
		this.m_db_temp.lock("clamptemp_tb");
		A_param = this.m_db_temp.getHash(sql);
		return true;
	}

	copyFile(A_param) {
		for (var cnt = 0; cnt < A_param.length; ++cnt) {
			var param = A_param[cnt];
			var src = param.fid;
			if (0 == src.length) continue;
			src = src.split(",");
			if (0 == src.length) continue;
			var tgt = Array();

			for (var id of Object.values(src)) {
				var fname = this.m_curpath + "0.cla.gz";

				if (!this.m_db_temp.loExport(fname, id)) {
					this.putError(G_SCRIPT_INFO, "\u30E9\u30FC\u30B8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u7121\u3057" + id);
					continue;
				}

				var fid = this.m_db.loImport(fname);
				if (fid) tgt.push(fid);
				unlink(fname);
			}

			param.fid = tgt.join(",");
		}

		return true;
	}

	update(A_param) {
		this.m_db_temp.lock("clamptemp_tb");
		this.m_db.lock("clampfile_tb");

		for (var param of Object.values(A_param)) //clampfileのfidとステータスを更新する
		//clamptempのステータスを更新する
		{
			var sqlwhere = this.getSQLWhere();
			sqlwhere += " and pactid=" + this.m_db.escape(param.pactid);
			sqlwhere += " and type='" + this.m_db.escape(param.type) + "'";
			sqlwhere += " and detailno=" + this.m_db.escape(param.detailno);
			var sql = "update clamptemp_tb";
			sql += " set status=" + this.m_db.escape(G_CLAMPFILE_STATUS_IMPORT);
			sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
			sql += sqlwhere;
			sql += " and status=" + this.m_db.escape(G_CLAMPFILE_STATUS_DOWNLOAD);
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db_temp.query(sql);
			if (0 == param.fid.length) continue;
			sql = "update clampfile_tb";
			sql += " set status=" + this.m_db.escape(G_CLAMPFILE_STATUS_DOWNLOAD);
			sql += ",fid='" + param.fid + "'";
			sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
			sql += sqlwhere;
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		return true;
	}

	getSQLWhere() {
		var sql = " where carid=" + this.m_db.escape(G_CARRIER_DOCOMO);
		sql += " and year=" + this.m_db.escape(this.m_year);
		sql += " and month=" + this.m_db.escape(this.m_month);
		return sql;
	}

};

checkClient(G_CLIENT_BOTH);
var proc = new ProcessEndClampDocomo(G_PROCNAME_END_CLAMP_DOCOMO, G_LOG, G_OPENTIME_END_CLAMP_DOCOMO);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);