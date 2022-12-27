//===========================================================================
//機能：請求書情報をファイルからDBに取り込む(ドコモ専用)
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：請求書情報をファイルからDBに取り込む(ドコモ専用)

require("import_docomo_bill.php");

//挿入型
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//電話番号の挿入型
//すべての親番号を検査するならtrue
//親番号・管理会社・年月が不正でも処理を実行するならtrue
//DB挿入型
//警告出力済の親番号
//機能：billhistory_X_tbから既存のレコードを除去する
//引数：顧客ID
//年
//月
//保存先ファイル名(省略可能)
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客ID、年月で初期化する
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客IDの処理を終了する
//備考：tel_tb,tel_X_tbへの挿入は事前に行っておく事
//返値：深刻なエラーが発生したらfalseを返す
//機能：一個のファイルを処理する
//引数：ファイル名
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
//機能：ファイルから読み出したヘッダ行を処理する
//引数：ファイル名
//行番号
//CSV行から読み出した配列
//返値：深刻なエラーが発生したらfalseを返す
//機能：ファイルから読み出した行を処理する
//引数：ファイル名
//行番号
//CSV行から読み出した配列
//現在の出現順を受け取り、更新して返す
//処理中の電話番号を受け取り、更新して返す
//返値：深刻なエラーが発生したらfalseを返す
class ImportDocomoBill extends ImportDocomoCsvBase {
	ImportDocomoBill(listener, db, table_no, tel_tb, check_parent_all, force, inserter, A_parent_error) {
		this.ImportDocomoCsvBase(listener, db, table_no, tel_tb, check_parent_all, force, A_parent_error);
		this.m_inserter = inserter;
	}

	delete(pactid, year, month, fname) {
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from billhistory_" + table_no + "_tb";
		sqlfrom += " where pactid=" + this.escape(pactid);
		sqlfrom += " and carid=" + this.escape(G_CARRIER_DOCOMO);

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
		}

		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	begin(pactid, year, month) {
		var table_no = this.getTableNo(year, month);

		if (!this.setPactid(pactid, year, month)) {
			this.putError(G_SCRIPT_WARNING, `setPactid/${pactid},${year},${month}`);
			return false;
		}

		var const = {
			pactid: pactid,
			carid: G_CARRIER_DOCOMO
		};

		if (!this.m_inserter.setConst(const)) {
			this.putError(G_SCRIPT_WARNING, `setConst/${pactid},${year},${month}`);
			return false;
		}

		if (!this.m_inserter.begin("billhistory_" + table_no + "_tb")) {
			this.putError(G_SCRIPT_WARNING, `inserter->begin/${pactid},${year},${month}`);
			return false;
		}

		return true;
	}

	end() {
		return this.m_inserter.end();
	}

	read(fname) //ファイルを開いて一行づつ読み出す
	//戻り値
	{
		this.m_parent_ready = false;
		var cmd = G_NKF + " -w -S " + fname;
		var fp = popen(cmd, "r");

		if (!fp) {
			this.putError(G_SCRIPT_WARNING, `ファイルオープン失敗(${cmd})` + this.m_pactid);
			return false;
		}

		var status = true;
		var detailno = 0;
		var cur_telno = "";

		for (var lineno = 1; status && false !== (csv = ImportDocomoBill.fgetcsv(fp)); ++lineno) {
			if (1 == lineno) {
				if (!this.readLineHeader(fname, lineno, csv)) {
					status = false;
					break;
				}
			} else {
				if (!this.readLineBody(fname, lineno, csv, detailno, cur_telno)) {
					status = false;
					break;
				}
			}
		}

		pclose(fp);
		return status;
	}

	readLineHeader(fname, lineno, csv) {
		var check = ["\u96FB\u8A71\u756A\u53F7", "\u7B2C\u4E00\u968E\u5C64\u90E8\u9580\u540D", "\u7B2C\u4E8C\u968E\u5C64\u90E8\u9580\u540D", "\u7B2C\u4E09\u968E\u5C64\u90E8\u9580\u540D", "\u5185\u8A33\u9805\u76EE", "\u91D1\u984D(\u5186)", "\u91D1\u984D\u8A73\u7D30(\u5186)", "\u7A2E\u76EE\u30B3\u30FC\u30C9", "\u8ACB\u6C42\u66F8\u5185\u8A33\u7B49\u8A73\u7D301", "\u8ACB\u6C42\u66F8\u5185\u8A33\u7B49\u8A73\u7D302", "\u7A0E\u533A\u5206"];
		var check_1205 = ["\u96FB\u8A71\u756A\u53F7", "\u7B2C\u4E00\u968E\u5C64\u90E8\u9580", "\u7B2C\u4E8C\u968E\u5C64\u90E8\u9580", "\u7B2C\u4E09\u968E\u5C64\u90E8\u9580", "\u5185\u8A33\u9805\u76EE", "\u91D1\u984D(\u5186)", "\u91D1\u984D\u8A73\u7D30(\u5186)", "\u7A2E\u76EE\u30B3\u30FC\u30C9", "\u5185\u8A33\u7B49\u8A73\u7D301", "\u5185\u8A33\u7B49\u8A73\u7D302", "\u7A0E\u533A\u5206"];

		if (check.length != csv.length) {
			this.putOperator(G_SCRIPT_WARNING, "\u8ACB\u6C42\u66F8\u60C5\u5831\u30D8\u30C3\u30C0\u884C" + `レコード数異常(${fname},${lineno})` + csv.length);
			return false;
		}

		for (var cnt = 0; cnt < check.length; ++cnt) //古い書式のデータをインポートする事があるので、
		//どちらか一方でも合致すれば成功と見なす
		{
			if (strcmp(check[cnt], csv[cnt]) && strcmp(check_1205[cnt], csv[cnt])) {
				this.putOperator(G_SCRIPT_WARNING, "\u8ACB\u6C42\u66F8\u60C5\u5831\u30D8\u30C3\u30C0\u884C" + `レコード異常(${fname},${lineno})` + cnt + "/" + check[cnt] + "/" + check_1205[cnt] + "/" + csv[cnt]);
				return false;
			}
		}

		return true;
	}

	readLineBody(fname, lineno, csv, detailno, cur_telno) //第一・第二・第三の階層部門名取り出し
	//内訳項目取り出し
	//金額と金額詳細取り出し
	//請求明細追加
	{
		if (11 != csv.length) {
			this.putOperator(G_SCRIPT_WARNING, "\u8ACB\u6C42\u66F8\u60C5\u5831\u8A73\u7D30\u884C" + `レコード数異常(${fname},${lineno})` + csv.length);
			return false;
		}

		var H_line = Array();
		H_line.telno = str_replace("-", "", csv[0].trim());

		if (0 == H_line.telno.length) {
			this.putOperator(G_SCRIPT_WARNING, "\u8ACB\u6C42\u66F8\u60C5\u5831\u8A73\u7D30\u884C" + `電話番号が無い(${fname},${lineno})` + csv[0]);
			return false;
		}

		if (strcmp(cur_telno, H_line.telno)) {
			cur_telno = H_line.telno;
			detailno = 0;
		} else ++detailno;

		H_line.detailno = detailno;
		H_line.level1 = csv[1].trim();
		H_line.level2 = csv[2].trim();
		H_line.level3 = csv[3].trim();
		H_line.label = csv[4].trim();
		H_line.charge_orig = csv[5].trim();
		if (is_numeric(H_line.charge_orig)) H_line.charge = 0 + H_line.charge_orig;
		H_line.charge_details_orig = csv[6].trim();
		if (is_numeric(H_line.charge_details_orig)) H_line.charge_details = 0 + H_line.charge_details_orig;
		H_line.code = csv[7].trim();
		H_line.details1 = csv[8].trim();
		H_line.details2 = csv[9].trim();
		H_line.taxtype = csv[10].trim();
		return this.m_inserter.insert(H_line);
	}

};