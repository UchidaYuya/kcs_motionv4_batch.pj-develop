//===========================================================================
//機能：情報料明細をファイルからDBに取り込む(ドコモ専用)
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：情報料明細をファイルからDBに取り込む(ドコモ専用)

require("import_docomo_base.php");

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
//機能：infohistory_X_tbから既存のレコードを除去する
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
//返値：深刻なエラーが発生したらfalseを返す
//機能：請求期間を取り出す
//引数：ファイル名
//行番号
//CSV行から読み出した請求期間
//結果を返す配列
//返値：fromとtoに変換できなかったらfalseを返す
class ImportDocomoInfo extends ImportDocomoCsvBase {
	ImportDocomoInfo(listener, db, table_no, tel_tb, check_parent_all, force, inserter, A_parent_error) {
		this.ImportDocomoCsvBase(listener, db, table_no, tel_tb, check_parent_all, force, A_parent_error);
		this.m_inserter = inserter;
	}

	delete(pactid, year, month, fname) {
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from infohistory_" + table_no + "_tb";
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

		if (!this.m_inserter.begin("infohistory_" + table_no + "_tb")) {
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

		for (var lineno = 1; status && false !== (csv = ImportDocomoInfo.fgetcsv(fp)); ++lineno) {
			if (1 == lineno) {
				if (!this.readLineHeader(fname, lineno, csv)) {
					status = false;
					break;
				}
			} else {
				if (!this.readLineBody(fname, lineno, csv)) {
					status = false;
					break;
				}
			}
		}

		pclose(fp);
		return status;
	}

	readLineHeader(fname, lineno, csv) //csvのセルの末尾の、英文を取り除く
	//2007年7月以降、親番号が無くなった
	{
		for (var cnt = 0; cnt < csv.length; ++cnt) {
			csv[cnt] = csv[cnt].replace(/\([A-Z ]+\)$/g, "");
		}

		var check = ["\u89AA\u96FB\u8A71\u756A\u53F7", "\u96FB\u8A71\u756A\u53F7", "\u30B5\u30A4\u30C8\u540D", "\u8AB2\u91D1\u65B9\u6CD5", "\u30B5\u30A4\u30C8\u5229\u7528\u671F\u9593", "\u60C5\u5831\u6599", "\uFF29\uFF30\u533A\u5206"];

		if (check.length - 1 == csv.length) {
			csv.unshift("\u89AA\u96FB\u8A71\u756A\u53F7");
		}

		if (check.length != csv.length) {
			this.putOperator(G_SCRIPT_WARNING, "\u60C5\u5831\u660E\u7D30\u30D8\u30C3\u30C0\u884C" + `レコード数異常(${fname},${lineno})` + csv.length);
			return false;
		}

		for (cnt = 0;; cnt < check.length; ++cnt) {
			if (4 == cnt && 0 == strcmp(csv[cnt], "\u30B5\u30A4\u30C8\u5229\u7528\u671F\u9593\u7B49")) continue;
			if (1 == cnt && 0 == strcmp(csv[cnt], "\u5BFE\u8C61\u96FB\u8A71\u756A\u53F7")) continue;
			if (6 == cnt && 0 == strcmp(csv[cnt], "IP\u533A\u5206")) continue;
			if (5 == cnt && 0 == strcmp(csv[cnt], "\u60C5\u5831\u6599\uFF08\u5185\u7A0E\uFF09")) continue;

			if (strcmp(check[cnt], csv[cnt])) {
				this.putOperator(G_SCRIPT_WARNING, "\u60C5\u5831\u660E\u7D30\u30D8\u30C3\u30C0\u884C" + `レコード異常(${fname},${lineno})` + cnt + "/" + check[cnt] + "/" + csv[cnt]);
				return false;
			}
		}

		return true;
	}

	readLineBody(fname, lineno, csv) //2007年7月以降、親番号が無くなった
	//請求額取り出し
	{
		var check_parent = true;

		if (6 == csv.length) {
			csv.unshift("");
			check_parent = false;
		}

		if (7 != csv.length) {
			this.putOperator(G_SCRIPT_WARNING, "\u60C5\u5831\u660E\u7D30\u8A73\u7D30\u884C" + `レコード数異常(${fname},${lineno})` + csv.length);
			return false;
		}

		var parent = str_replace("-", "", csv[0].trim());

		if (check_parent && !this.checkParent(parent)) //親番号は一個でも合致したら処理継続
			{
				this.putOperator(G_SCRIPT_WARNING, "\u60C5\u5831\u660E\u7D30\u8A73\u7D30\u884C" + `親番号(${parent})見つからず(${fname},${lineno})` + csv[0]);
			}

		var H_line = Array();
		H_line.telno = str_replace("-", "", csv[1].trim());

		if (0 == H_line.telno.length) {
			this.putOperator(G_SCRIPT_WARNING, "\u60C5\u5831\u660E\u7D30\u8A73\u7D30\u884C" + `電話番号が無い(${fname},${lineno})` + csv[1]);
			return false;
		}

		H_line.sitename = csv[2].trim();
		if (0 == H_line.sitename.length) H_line.sitename = "\u30B5\u30A4\u30C8\u540D\u306A\u3057";
		H_line.accounting = csv[3].trim();
		H_line.ipkubun = csv[6].trim();
		H_line.charge = csv[5].trim();

		if (0 == H_line.charge.length || !ctype_digit(H_line.charge)) {
			this.putOperator(G_SCRIPT_WARNING, "\u60C5\u5831\u660E\u7D30\u8A73\u7D30\u884C" + `請求額不正(${fname},${lineno})` + csv[5]);
			return false;
		}

		if (!this.readFromTo(fname, lineno, csv[4], H_line)) {
			H_line.from_to = csv[4].trim();
		}

		return this.m_inserter.insert(H_line);
	}

	readFromTo(fname, lineno, src, H_line) //全角数値を半角に変換する
	//空白と「日」を取り除き、開始と終了に分割する
	{
		var zen = "\uFF10,\uFF11,\uFF12,\uFF13,\uFF14,\uFF15,\uFF16,\uFF17,\uFF18,\uFF19".split(",");
		var han = "0,1,2,3,4,5,6,7,8,9".split(",");

		for (var cnt = 0; cnt < 10; ++cnt) src = str_replace(zen[cnt], han[cnt], src);

		src = str_replace(" ", "", src);
		src = str_replace("\u3000", "", src);
		src = str_replace("\u65E5", "", src);
		var c_from = mb_convert_encoding(pack("N", 12316), mb_internal_encoding(), "UCS-4BE");
		var c_to = mb_convert_encoding(pack("N", 65374), mb_internal_encoding(), "UCS-4BE");
		src = str_replace(c_from, c_to, src);
		var A_src = src.split("\uFF5E");
		if (2 != A_src.length) return false;
		var A_key = ["fromdate", "todate"];

		for (cnt = 0;; cnt < 2; ++cnt) //月と日に分割
		{
			var A_mmdd = A_src[cnt].split("\u6708");
			if (2 != A_mmdd.length) return false;
			var mm = A_mmdd[0];
			var dd = A_mmdd[1];
			if (0 == mm.length || !ctype_digit(mm) || 0 == dd.length || !ctype_digit(dd)) return false;
			var yyyy = this.m_year;
			if (12 == mm && 1 == this.m_month) --yyyy;
			if (mm < 10) mm = "0" + mm;
			if (dd < 10) dd = "0" + dd;
			var result = `${yyyy}-${mm}-${dd} 00:00:00+09`;
			H_line[A_key[cnt]] = result;
		}

		return true;
	}

};