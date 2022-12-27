//===========================================================================
//機能：ドコモのクランプ取り込み機能の共通部分
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：tel_X_tbとtel_tbにすでに存在する電話番号の管理型
//存在しない電話番号のリストを作り、最後にまとめて挿入する

require("script_db.php");

require("script_common.php");

//tel_tbにデータを挿入するならtrue
//データインサート型
//処理中の顧客ID
//処理中の年
//処理中の月
//トップの部署ID
//tel_X_tbに存在する電話番号の配列
//tel_tbに存在する電話番号の配列
//最後に検査した電話番号
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//tel_tbに電話番号が無い時に追加するならtrue
//tel_tbのデータ挿入型
//tel_X_tbのデータ挿入型
//機能：顧客ID、年月で初期化する
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：tel_X_tb,tel_tbに電話番号があるか検査して、なければ追加する
//引数：電話番号
//地域会社ID(null可)
//回線種別ID(null可)
//返値：深刻なエラーが発生したらfalseを返す
//機能：tel_X_tb,tel_tbのどちらかに電話を追加する
//備考：protected
//引数：電話番号
//地域会社ID(null可)
//回線種別ID(null可)
//tel_X_tbに追加するならfalse
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBへの挿入を実行する
//返値：深刻なエラーが発生したらfalseを返す
class ImportDocomoTelno extends ScriptDBAdaptor {
	ImportDocomoTelno(listener, db, table_no, use_tel, insert_tel, insert_tel_X) //電話番号先頭六桁毎の地域会社の読み出し
	//総務省データの消滅に伴い、処理しなくなった
	{
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_use_tel = use_tel;
		this.m_insert_tel = insert_tel;
		this.m_insert_tel_X = insert_tel_X;
	}

	begin(pactid, year, month) //電話番号のリストをtel_X_tb,tel_tbから読み出す
	//全カラムで共通の値を設定
	{
		this.m_pactid = pactid;
		this.m_year = year;
		this.m_month = month;
		var table_no = this.getTableNo(year, month);
		this.m_last_telno = "";

		if (this.m_use_tel) {
			if (!this.m_insert_tel.begin("tel_tb")) {
				this.putError(G_SCRIPT_WARNING, "begin(tel_tb)");
				return false;
			}
		}

		if (!this.m_insert_tel_X.begin("tel_" + table_no + "_tb")) {
			this.putError(G_SCRIPT_WARNING, "begin(tel_" + table_no + "_tb)");
			return false;
		}

		var sql = "select postidparent from post_relation_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and level=0";
		sql += ";";
		var result = this.m_db.getAll(sql);

		if (0 == result.length) {
			this.m_toppostid = "";
			this.putOperator(G_SCRIPT_WARNING, "\u30C8\u30C3\u30D7\u306E\u90E8\u7F72ID\u304C\u7121\u3044" + pactid);
			return false;
		}

		this.m_toppostid = result[0][0];
		sql = "select telno from tel_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(this.m_pactid);
		sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += ";";
		result = this.m_db.getAll(sql);
		this.m_A_tel_X = Array();

		for (var line of Object.values(result)) this.m_A_tel_X.push(line[0]);

		if (this.m_use_tel) {
			sql = "select telno from tel_tb";
			sql += " where pactid=" + this.escape(this.m_pactid);
			sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
			sql += ";";
			result = this.m_db.getAll(sql);
			this.m_A_tel = Array();

			for (var line of Object.values(result)) this.m_A_tel.push(line[0]);
		} else this.m_A_tel_tb = Array();

		var const = {
			pactid: this.m_pactid,
			postid: this.m_toppostid,
			carid: G_CARRIER_DOCOMO,
			recdate: "now()",
			fixdate: "now()",
			handflg: "false"
		};

		if (this.m_use_tel) {
			if (!this.m_insert_tel.setConst(const)) {
				this.putError(G_SCRIPT_WARNING, "setConst(tel_tb)");
				return false;
			}
		}

		if (!this.m_insert_tel_X.setConst(const)) {
			this.putError(G_SCRIPT_WARNING, "setConst(tel_" + table_no + "_tb)");
			return false;
		}

		return true;
	}

	insert(telno, arid, cirid) {
		if (0 == strcmp(this.m_last_telno, telno)) return true;

		if (this.m_use_tel) //tel_tbへの追加
			{
				if (!(-1 !== this.m_A_tel_X.indexOf(telno))) {
					if (!this.insertRaw(telno, arid, cirid, false)) return false;
				}
			}

		if (!this.insertRaw(telno, arid, cirid, true)) return false;
		this.m_last_telno = telno;
		return true;
	}

	insertRaw(telno, arid, cirid, is_X) //すでに電話番号があるか検査
	//地域会社が未定義なら総務省データから地域会社を絞り込む
	//総務省データの消滅に伴い、地域不明とする
	{
		if (is_X) {
			if (-1 !== this.m_A_tel_X.indexOf(telno)) return true;
		} else {
			if (-1 !== this.m_A_tel.indexOf(telno)) return true;
		}

		if (0 == arid.length) arid = G_AREA_DOCOMO_UNKNOWN;

		if (0 == cirid.length) {
			cirid = G_CIRCUIT_DOCOMO_OTHER;
		}

		var telno_view = telno;
		if (11 == telno_view.length && "0" == telno_view.substr(2, 1)) telno_view = telno.substr(0, 3) + "-" + telno.substr(3, 4) + "-" + telno.substr(7, 4);
		var param = {
			telno: telno,
			telno_view: telno_view,
			arid: arid,
			cirid: cirid
		};

		if (is_X) {
			this.m_A_tel_X.push(telno);

			if (!this.m_insert_tel_X.insert(param)) {
				this.putError(G_SCRIPT_WARNING, "insert(tel_" + table_no + `_tb)${telno},${arid},${cirid}`);
				return false;
			}
		} else {
			this.m_A_tel.push(telno);

			if (!this.m_insert_tel.insert(param)) {
				this.putError(G_SCRIPT_WARNING, "insert(tel_tb)" + `${telno},${arid},${cirid}`);
				return false;
			}
		}

		return true;
	}

	end() {
		if (this.m_use_tel) {
			if (!this.m_insert_tel.end()) {
				this.putError(G_SCRIPT_WARNING, "end(tel_tb)");
				return false;
			}
		}

		if (!this.m_insert_tel_X.end()) {
			this.putError(G_SCRIPT_WARNING, "end(tel_" + table_no + "_tb)");
			return false;
		}

		return true;
	}

};

//電話番号の管理型
//すべての親番号を検査するならtrue
//親番号・管理会社が不正でも処理を実行するならtrue
//処理中の顧客ID
//処理中の年
//処理中の月
//detailnoからクランプIDへの変換表
//親番号
//既にエラーメッセージを出力した親番号
//親番号を検査済みならtrue
//親番号の検査に成功していればtrue
//親番号エラーを検出したらtrue
//現在処理中のdetailno(クランプIDチェック用)
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//電話番号の挿入型
//すべての親番号を検査するならtrue
//親番号・管理会社が不正でも処理を実行するならtrue
//警告出力済の親番号
//機能：顧客ID、年月で初期化する
//備考：protected
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：これから処理しようとするdetailnoを設定する(クランプIDチェック用)
//引数：detailno
//機能：複数個のファイルを読み出して処理する
//備考：エラーログは出さない
//引数：アスタリスクなどを含むファイル名
//返値：深刻なエラーが発生したらfalseを返す
//機能：一個のファイルを処理する
//引数：ファイル名
//返値：深刻なエラーが発生したらfalseを返す
//機能：ファイルから読み出した行を処理する
//備考：protected
//引数：ファイル名
//行番号
//SJIS形式のままの行(末尾に\r\n)
//返値：深刻なエラーが発生したらfalseを返す
//機能：改行文字を含まない文字数を返す
//備考：protected
//機能：管理コードの会社コードが正しいか検査する
//備考：protected
//備考：エラーログは出力しない
//引数：管理コードから読み出した会社コード
//返値：会社コードが正しければtrueを返す
//機能：親番号が正しいか検査する
//備考：protected
//備考：エラーログは出力しない
//引数：ファイルから読み出した親番号
//返値：親番号が不正ならfalseを返す
//機能：整数文字列を数値に変換する
//備考：protected
//備考：エラーログは出力しない
//引数：結果の数値を返す
//元の文字列
//返値：深刻なエラーが発生したらfalseを返す
//機能：SJISの文字列をUTF-8に変換して返す
//備考：protected
class ImportDocomoBase extends ScriptDBAdaptor {
	ImportDocomoBase(listener, db, table_no, tel_tb, check_parent_all, force, A_parent_error) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_tel_tb = tel_tb;
		this.m_check_parent_all = check_parent_all;
		this.m_force = force;
		this.m_A_parent_error = A_parent_error;
	}

	setPactid(pactid, year, month) //クランプIDを読み出す
	//親番号を読み出す
	{
		this.m_pactid = pactid;
		this.m_year = year;
		this.m_month = month;
		this.m_parent_ready = false;
		this.m_parent_accept = false;
		this.m_parent_error = false;
		var sql = "select detailno,clampid from clamp_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " order by detailno";
		sql += ";";
		var result = this.m_db.getAll(sql);
		if (result.length) this.m_cur_detailno = result[0][0];else this.m_cur_detailno = -1;
		this.m_A_clampid = Array();

		for (var line of Object.values(result)) this.m_A_clampid[line[0]] = line[1];

		sql = "select prtelno from bill_prtel_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += ";";
		result = this.m_db.getAll(sql);
		this.m_A_parent = Array();

		for (var telno of Object.values(result)) this.m_A_parent.push(str_replace("-", "", telno[0]));

		return true;
	}

	setDetailno(detailno) {
		this.m_cur_detailno = detailno;
	}

	readAll(fname) {
		var flist = Array();
		exec(`ls -1 ${fname} 2> /dev/null`, flist);

		for (var name of Object.values(flist)) if (!this.read(name)) return false;

		return true;
	}

	read(fname) //ファイルの存在チェックと、ファイルサイズの検査
	//改行をのぞく行サイズ
	//戻り値
	{
		this.m_parent_ready = false;

		if (!file_exists(fname)) {
			this.putError(G_SCRIPT_WARNING, `ファイル存在せず(${fname})` + this.m_pactid);
			return false;
		}

		var linesize = this.getLineSize();

		if (0 != filesize(fname) % (linesize + 2)) {
			this.putOperator(G_SCRIPT_WARNING, `ファイルサイズ不正(${fname})` + this.m_pactid + "/" + linesize);
			return false;
		}

		var fp = fopen(fname, "rb");

		if (!fp) {
			this.putError(G_SCRIPT_WARNING, `ファイルオープン失敗(${fname})` + this.m_pactid);
			return false;
		}

		var status = true;

		for (var lineno = 1; status; ++lineno) {
			var line = fread(fp, linesize + 2);
			var size = line.length;
			if (0 == size) break;

			if (size != linesize + 2 || strcmp("\r\n", line.substr(linesize, 2))) {
				this.putOperator(G_SCRIPT_WARNING, `行サイズ不正(${fname}/${lineno})` + this.m_pactid + "/" + this.toUTF(line));
				status = false;
				break;
			}

			if (!this.readLine(fname, lineno, line)) {
				status = false;
				break;
			}
		}

		fclose(fp);
		return status;
	}

	readLine(fname, lineno, line) {
		return true;
	}

	getLineSize() {
		return 0;
	}

	checkClampId(id) //常に成功とする
	//渡されたIDがすべて空白文字なら合格とする
	{
		return true;
		var not_space = false;

		for (var cnt = 0; cnt < id.length; ++cnt) if (strcmp(" ", id[cnt])) not_space = true;

		if (!not_space) return true;
		if (0 == this.m_A_clampid.length) return true;
		if (!(undefined !== this.m_A_clampid[this.m_cur_detailno])) return true;
		var clampid = this.m_A_clampid[this.m_cur_detailno];

		if (clampid.length < id.length) {
			var len_id = id.length;
			var len_clampid = clampid.length;
			id = id.substr(len_id - len_clampid, len_clampid);
		}

		if (id.length < clampid.length) {
			len_id = id.length;
			len_clampid = clampid.length;
			clampid = clampid.substr(len_clampid - len_id, len_id);
		}

		if (strcmp(id, clampid)) return false;
		return true;
	}

	checkParent(telno) {
		telno = telno.trim();
		telno = str_replace("-", "", telno);

		if (this.m_check_parent_all || !this.m_parent_ready) {
			this.m_parent_ready = true;

			if (!(-1 !== this.m_A_parent.indexOf(telno))) {
				this.m_parent_error = true;
				if (-1 !== this.m_A_parent_error.indexOf(telno)) return true;
				this.m_A_parent_error.push(telno);
				return false;
			}

			this.m_parent_accept = true;
		}

		return true;
	}

	toInt(result, src) //$src = trim($src);
	//$minus = false;
	{
		src = src.trim();

		if (0 == src.length) {
			result = 0;
			return true;
		}

		var minus = false;

		if (0 == strcmp("-", src.substr(0, 1))) {
			minus = true;
			src = src.substr(1);
		}

		if (!ctype_digit(src)) return false;
		result = src;
		result += 0;
		if (minus) result = -result;
		return true;
	}

	toUTF(var) {
		return mb_convert_encoding(var, "UTF-8", "SJIS");
	}

};

//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//電話番号の挿入型
//すべての親番号を検査するならtrue
//親番号・管理会社・年月が不正でも処理を実行するならtrue
//警告出力済の親番号
//-----------------------------------------------------------------------
//以下protected
//機能：CSVから一行だけ取り出す
class ImportDocomoCsvBase extends ImportDocomoBase {
	ImportDocomoCsvBase(listener, db, table_no, tel_tb, check_parent_all, force, A_parent_error) {
		this.ImportDocomoBase(listener, db, table_no, tel_tb, check_parent_all, force, A_parent_error);
	}

	static fgetcsv(fp) {
		if (feof(fp)) return false;
		var line = "";

		while (!feof(fp)) {
			var buf = fgets(fp);
			line += buf;
			var A_match = Array();
			if (0 == preg_match_all("/\"/", line, A_match) % 2) break;
		}

		if (!line.length) return false;
		var A_csv = Array();
		line = preg_replace("/(?:\\x0D\\x0A|[\\x0D\\x0A])?$/", ",", line, 1);
		A_match = Array();
		preg_match_all("/(\"[^\"]*(?:\"\"[^\"]*)*\"|[^,]*),/", line, A_match);

		for (var cnt = 0; cnt < A_match[1].length; ++cnt) {
			var A_sub = Array();

			if (preg_match("/^\"(.*)\"$/s", A_match[1][cnt], A_sub)) {
				A_match[1][cnt] = A_sub[1].replace(/""/g, "\"");
			}

			A_csv.push(A_match[1][cnt]);
		}

		return A_csv;
	}

};