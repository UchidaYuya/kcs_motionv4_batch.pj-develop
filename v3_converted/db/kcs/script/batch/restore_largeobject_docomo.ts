//===========================================================================
//機能：ラージオブジェクトを恒久DBに書き戻すプロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：ラージオブジェクトを恒久DBに書き戻すプロセス(ドコモ専用)
error_reporting(E_ALL);

require("lib/process_base.php");

const G_PROCNAME_RESTORE_DOCOMO = "restore_largeobject_docomo";
const G_OPENTIME_RESTORE_DOCOMO = "0000,2400";

//ファイルを読み出すパス(nullならclampfile_tbから)
//DBから読む場合に、読み出す種別
//既存のfidを事前にクリアするならtrue
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
class ProcessRestoreDocomo extends ProcessDefault {
	ProcessRestoreDocomo(procname, logpath, opentime) {
		this.ProcessDefault(procname, logpath, opentime, true);
		this.m_args.addSetting({
			s: {
				type: "string"
			},
			t: {
				type: "string"
			},
			f: {
				type: "int"
			}
		});
		this.m_srcpath = G_CLAMP_DOCOMO_FIN;
		this.m_A_type = Array();
		this.m_clear_fid = true;
	}

	getProcname() {
		return "\u30E9\u30FC\u30B8\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u3092\u6052\u4E45DB\u306B\u66F8\u304D\u623B\u3059\u30D7\u30ED\u30BB\u30B9(\u30C9\u30B3\u30E2\u5C02\u7528)";
	}

	commitArg(args) {
		if (!ProcessDefault.commitArg(args)) return false;

		switch (args.key) {
			case "s":
				this.m_srcpath = args.value;

				if (0 == this.m_srcpath.length) //「-s=」オプションなら/kcs/data/@y/docomo/@p/fin/から読み出す
					{
						this.m_srcpath = G_CLAMP_DOCOMO_FIN;
					}

				break;

			case "t":
				if (args.value.length) {
					var result = args.value.split(",");

					for (var line of Object.values(result)) if (line.length) this.m_A_type.push(line);
				}

				break;

			case "f":
				this.m_clear_fid = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessDefault.getUsage();
		rval.push(["-s=path", "\u30BD\u30FC\u30B9\u30D5\u30A9\u30EB\u30C0\u306E\u30D1\u30B9(\u7121\u6307\u5B9A\u306A\u3089" + G_CLAMP_DOCOMO_FIN + ")(\u7121\u6307\u5B9A)"]);
		rval.push(["-t=type[,type...]", "\u8AAD\u307F\u51FA\u3059type"]);
		rval.push(["-f={0|1}", "\u4E8B\u524D\u306Bfid\u3092\u7A7A\u767D\u306B\u3059\u308B\u304B(1)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessDefault.getManual();
		rval += "\u30BD\u30FC\u30B9\u30D5\u30A9\u30EB\u30C0" + this.m_srcpath + "\n";

		if (this.m_A_type.length) {
			rval += "DB\u306B\u66F8\u304D\u8FBC\u3080type";

			for (var type of Object.values(this.m_A_type)) rval += "," + type;

			rval += "\n";
		}

		rval += "\u4E8B\u524D\u306Bfid\u3092\u7A7A\u767D\u306B" + (this.m_clear_fid ? "\u3059\u308B" : "\u3057\u306A\u3044") + "\n";
		return rval;
	}

	executePactid(pactid, logpath) {
		var srcpath = this.m_srcpath;
		srcpath = str_replace("@p", pactid, srcpath);
		srcpath = str_replace("@y", sprintf("%04d%02d", this.m_year, this.m_month), srcpath);
		var sqlwhere = " where pactid=" + this.m_db.escape(pactid);
		sqlwhere += " and year=" + this.m_db.escape(this.m_year);
		sqlwhere += " and month=" + this.m_db.escape(this.m_month);
		sqlwhere += " and carid=" + this.m_db.escape(G_CARRIER_DOCOMO);

		if (this.m_A_type.length) {
			sqlwhere += " and type in (";
			var comma = false;

			for (var type of Object.values(this.m_A_type)) {
				if (comma) sqlwhere += ",";
				comma = true;
				sqlwhere += "'" + this.m_db.escape(type) + "'";
			}

			sqlwhere += ")";
		}

		if (this.m_clear_fid) {
			var sql = "select fid from clampfile_tb";
			sql += sqlwhere;
			sql += " and status not in (" + G_CLAMPFILE_STATUS_IMPORT + "," + G_CLAMPFILE_STATUS_CALC + "," + G_CLAMPFILE_STATUS_SIM + ")";
			sql += " and length(fid)>0";
			sql += ";";
			var result = this.m_db.getAll(sql);

			for (var line of Object.values(result)) {
				var A_fid = line[0].split(",");

				for (var fid of Object.values(A_fid)) if (fid.length) this.m_db.loUnlink(fid);
			}

			sql = "update clampfile_tb set fid='',fixdate=now()";
			sql += ",status=" + G_CLAMPFILE_STATUS_START;
			sql += sqlwhere;
			sql += " and status not in (" + G_CLAMPFILE_STATUS_IMPORT + "," + G_CLAMPFILE_STATUS_CALC + "," + G_CLAMPFILE_STATUS_SIM + ")";
			sql += " and length(fid)>0";
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		sql = "select detailno,type,fid from clampfile_tb";
		sql += sqlwhere;
		sql += " and status in (" + G_CLAMPFILE_STATUS_IMPORT + "," + G_CLAMPFILE_STATUS_CALC + "," + G_CLAMPFILE_STATUS_SIM + ")";
		sql += ";";
		var A_list = this.m_db.getHash(sql);

		for (var line of Object.values(A_list)) //既存ファイルを削除する
		//fidを更新する
		{
			A_fid = line.fid.split(",");

			for (var fid of Object.values(A_fid)) if (fid.length) this.m_db.loUnlink(fid);

			A_fid = Array();
			var fname = srcpath + line.type + line.detailno + "*.cla";
			var flist = Array();
			exec(`ls -1 ${fname} 2> /dev/null`, flist);

			for (var src of Object.values(flist)) //一時ディレクトリに移してgzip
			//DBに格納
			//gzipファイルを削除する
			{
				var tgt = G_WORK_DIR + basename(src);

				if (!copy(src, tgt)) {
					this.putError(G_SCRIPT_WARNING, "\u4E00\u6642\u30D5\u30A1\u30A4\u30EB\u30B3\u30D4\u30FC\u5931\u6557" + tgt + "<-" + src);
					return false;
				}

				if (!this.processGzip(tgt, true)) {
					this.putError(G_SCRIPT_WARNING, "\u4E00\u6642\u30D5\u30A1\u30A4\u30EBgzip\u5727\u7E2E\u5931\u6557" + tgt);
					return false;
				}

				tgt += ".gz";
				var fid = this.m_db.loImport(tgt);
				A_fid.push(fid);

				if (!unlink(tgt)) {
					this.putError(G_SCRIPT_WARNING, "\u4E00\u6642\u30D5\u30A1\u30A4\u30EB\u524A\u9664\u5931\u6557" + tgt);
					return false;
				}
			}

			fid = A_fid.join(",");
			sql = "update clampfile_tb";
			sql += " set fid='" + this.m_db.escape(fid) + "'";
			sql += ",fixdate=now()";
			sql += sqlwhere;
			sql += " and type='" + this.m_db.escape(line.type) + "'";
			sql += " and detailno=" + line.detailno;
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		return true;
	}

};

checkClient(G_CLIENT_DB);
var proc = new ProcessRestoreDocomo(G_PROCNAME_RESTORE_DOCOMO, G_LOG, G_OPENTIME_RESTORE_DOCOMO);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);