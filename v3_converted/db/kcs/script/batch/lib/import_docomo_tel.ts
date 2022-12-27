//===========================================================================
//機能：請求明細をファイルからDBに取り込む(ドコモ専用)
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：請求明細をファイルからDBに取り込む(ドコモ専用)

require("import_docomo_base.php");

require("update_asp_charge.php");

//挿入型
//仮登録以外の内訳コード→{name,kamoku,taxtype}
//"C" . 仮登録で登録済の内訳コード
//"C" . 追加が必要な内訳コード
//不明な内訳コードがあったらtrue
//"C" . エラーを出力済の不明な内訳コード
//ASPを使用するか
//ASP利用料
//処理中の電話番号
//{コード,請求額,ファイル名,行番号}の配列
//この電話番号の請求総額
//契約全体での請求総額
//契約全体での電話回線数
//総額検査結果(0,未検査/1,問題なし/2,問題あり)
//請求情報手動入力済の電話番号
//手動入力した請求情報の削除予定電話番号
//手動入力した請求情報を削除する時の保存ファイル名
//処理年
//処理月
//処理顧客
//"T" . 内訳コードに問題のあった電話番号
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//電話番号の挿入型
//すべての親番号を検査するならtrue
//親番号・会社コードが不正でも処理を実行するならtrue
//DB挿入型
//警告出力済の親番号
//手動入力された請求情報のバックアップファイル名
//機能：tel_details_X_tbから既存のレコードを除去する
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
//機能：utiwake_tbに追加が必要なコードを返す
//機能：不明か仮登録の内訳コードがあったらtrueを返す
//-----------------------------------------------------------------------
//以下protected
//機能：改行文字を含まない文字数を返す
//機能：ファイルから読み出した行を処理する
//引数：ファイル名
//行番号
//SJIS形式のままの行(末尾に\r\n)
//返値：深刻なエラーが発生したらfalseを返す
//機能：ファイルから読み出した内訳行を処理する
//引数：ファイル名
//行番号
//SJIS形式のままの行(末尾に\r\n)
//返値：深刻なエラーが発生したらfalseを返す
//機能：電話番号一個分の処理を行う
//返値：深刻なエラーが発生したらfalseを返す
class ImportDocomoTel extends ImportDocomoBase {
	ImportDocomoTel(listener, db, table_no, tel_tb, check_parent_all, force, inserter, A_parent_error, hand_fname) //utiwake_tbの読み出し
	{
		this.ImportDocomoBase(listener, db, table_no, tel_tb, check_parent_all, force, A_parent_error);
		this.m_inserter = inserter;
		this.m_hand_fname = hand_fname;
		var sql = "select code,name,kamoku,taxtype";
		sql += " from utiwake_tb";
		sql += " where carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and codetype!='4'";
		sql += ";";
		var result = this.m_db.getHash(sql);
		this.m_A_utiwake = Array();

		for (var line of Object.values(result)) {
			var taxname = undefined;

			if (!taxtype2taxkubun(taxname, line.taxtype)) {
				this.putOperator(G_SCRIPT_WARNING, "utiwake_tb\u306B\u672A\u77E5\u306E\u7A0E\u533A\u5206\u304C\u3042\u308B" + line.taxtype);
				return;
			}

			this.m_A_utiwake[line.code] = {
				name: line.name,
				kamoku: line.kamoku,
				taxtype: line.taxtype,
				taxname: taxname
			};
		}

		if (!(undefined !== this.m_A_utiwake[G_CODE_ASP]) || !(undefined !== this.m_A_utiwake[G_CODE_ASX])) {
			this.putOperator(G_SCRIPT_WARNING, "utiwake_tb\u306BASP\u304BASX\u306E\u30C7\u30FC\u30BF\u304C\u306A\u3044");
		}

		sql = "select code";
		sql += " from utiwake_tb";
		sql += " where carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and codetype='4'";
		sql += ";";
		result = this.m_db.getAll(sql);
		this.m_A_utiwake_unknown = Array();

		for (var A_line of Object.values(result)) this.m_A_utiwake_unknown.push("C" + A_line[0]);

		this.m_A_utiwake_insert = Array();
		this.m_utiwake_fail = false;
		this.m_A_utiwake_fail = Array();
		this.m_A_telno_bad = Array();
	}

	delete(pactid, year, month, fname) {
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from tel_details_" + table_no + "_tb";
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

	begin(pactid, year, month) //ASP使用料金を読み出す
	//請求情報手動入力済の電話番号を取得しておく
	{
		var table_no = this.getTableNo(year, month);
		this.m_year = year;
		this.m_month = month;
		this.m_pactid = pactid;

		if (!this.setPactid(pactid, year, month)) {
			this.putError(G_SCRIPT_WARNING, `setPactid/${pactid},${year},${month}`);
			return false;
		}

		var const = {
			recdate: "now()",
			pactid: pactid,
			carid: G_CARRIER_DOCOMO
		};

		if (!this.m_inserter.setConst(const)) {
			this.putError(G_SCRIPT_WARNING, `setConst/${pactid},${year},${month}`);
			return false;
		}

		if (!this.m_inserter.begin("tel_details_" + table_no + "_tb")) {
			this.putError(G_SCRIPT_WARNING, `inserter->begin/${pactid},${year},${month}`);
			return false;
		}

		this.m_telno = "";
		this.m_A_code = Array();
		this.m_total = 0;
		this.m_all_total = 0;
		this.m_all_count = 0;
		this.m_bad_total = 0;
		var sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and fncid=" + this.escape(G_AUTH_ASP);
		sql += ";";

		if (0 < this.m_db.getOne(sql)) {
			this.m_use_asp = true;
			sql = "select charge from asp_charge_tb";
			sql += " where pactid=" + this.escape(pactid);
			sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
			sql += ";";
			var result = this.m_db.getAll(sql);

			if (result.length) {
				this.m_asp_charge = result[0][0];
			} else {
				this.m_asp_charge = 0;
				this.putOperator(G_SCRIPT_WARNING, "ASP\u8868\u793A\u3060\u304CASP\u4F7F\u7528\u6599\u91D1\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044" + pactid);
			}
		} else {
			this.m_use_asp = false;
			this.m_asp_charge = 0;
		}

		this.m_A_hand_detail = Array();
		this.m_A_hand_erase = Array();
		sql = "select telno from tel_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and coalesce(hand_detail_flg,false)=true";
		sql += ";";
		result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) this.m_A_hand_detail.push(line.telno);

		return true;
	}

	end() {
		if (this.m_telno.length) {
			if (!this.feedTelno()) return false;
		}

		if (2 == this.m_bad_total) {
			this.putError(G_SCRIPT_INFO, "\u8ACB\u6C42\u660E\u7D30\u4F1A\u793E\u5408\u8A08\u30EC\u30B3\u30FC\u30C9" + "\u4E00\u500B\u3082\u7DCF\u984D\u30FB\u4EF6\u6570\u5408\u81F4\u305B\u305A");
		}

		if (this.m_A_hand_erase.length) //手動入力済の請求情報を削除
			//手動入力された請求情報を削除した場合に、tel_X_tbのフラグを落とす
			{
				var table_no = this.getTableNo(this.m_year, this.m_month);
				var sqlfrom = " from tel_details_" + table_no + "_tb";
				sqlfrom += " where pactid=" + this.escape(this.m_pactid);
				sqlfrom += " and carid=" + this.escape(G_CARRIER_DOCOMO);
				sqlfrom += " and telno in (";
				var comma = false;

				for (var telno of Object.values(this.m_A_hand_erase)) {
					if (comma) sqlfrom += ",";
					comma = true;
					sqlfrom += "'" + this.escape(telno) + "'";
				}

				sqlfrom += ")";

				if (this.m_hand_fname.length) {
					if (!this.m_db.backup(this.m_hand_fname, "select *" + sqlfrom + ";")) return false;
				}

				var sql = "delete" + sqlfrom;
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
				sql = "update tel_" + table_no + "_tb";
				sql += " set hand_detail_flg=false";
				sql += " where pactid=" + this.escape(this.m_pactid);
				sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
				sql += " and telno in (";
				comma = false;

				for (var telno of Object.values(this.m_A_hand_erase)) {
					if (comma) sql += ",";
					comma = true;
					sql += "'" + this.escape(telno) + "'";
				}

				sql += ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
			}

		return this.m_inserter.end();
	}

	getUtiwakeInsert() {
		return this.m_A_utiwake_insert;
	}

	isUtiwakeFail() {
		return this.m_utiwake_fail;
	}

	getLineSize() {
		return 256;
	}

	readLine(fname, lineno, line) //データ種類の取得
	{
		var linetype = line.substr(12, 2);

		if (0 == strcmp("01", linetype)) //年月の検査
			{
				var year = 0 + line.substr(18, 4);
				var month = 0 + line.substr(22, 2);

				if (year != this.m_year || month != this.m_month) {
					this.putOperator(G_SCRIPT_WARNING, "\u8ACB\u6C42\u660E\u7D30\u7BA1\u7406\u30EC\u30B3\u30FC\u30C9" + `年月不正${year}/${month}(${fname}/${lineno})` + this.toUTF(line));
					return false;
				}

				if (!this.checkClampId(line.substr(0, 9))) {
					this.putOperator(G_SCRIPT_WARNING, "\u8ACB\u6C42\u660E\u7D30\u7BA1\u7406\u30EC\u30B3\u30FC\u30C9" + `送付先コード不正(${fname}/${lineno})` + this.toUTF(line));
					if (!this.m_force) return false;
				}
			} else if (0 == strcmp("11", linetype)) {
			if (!this.readLineDetails(fname, lineno, line)) return false;
		} else if (0 == strcmp("51", linetype)) //何もしない
			{} else if (0 == strcmp("91", linetype)) //会社全体の総額を検査
			{
				var total = 0;
				var count = 0;

				if (!this.toInt(total, line.substr(18, 10)) || !this.toInt(count, line.substr(28, 5))) {
					this.putError(G_SCRIPT_WARNING, "\u8ACB\u6C42\u660E\u7D30\u4F1A\u793E\u5408\u8A08\u30EC\u30B3\u30FC\u30C9" + `総額・件数不正${total},${count}(${fname}/${lineno})` + this.toUTF(line));
					return false;
				}

				if (this.m_all_total != total || this.m_all_count != count) {
					this.putError(G_SCRIPT_INFO, "\u8ACB\u6C42\u660E\u7D30\u4F1A\u793E\u5408\u8A08\u30EC\u30B3\u30FC\u30C9" + `総額・件数合致せず${total},${count}` + `/${this.m_all_total},${this.m_all_count}` + `(${fname}/${lineno})` + this.toUTF(line));
					if (0 == this.m_bad_total) this.m_bad_total = 2;
				} else this.m_bad_total = 1;

				this.m_all_total = 0;
				this.m_all_count = 0;
			} else {
			this.putError(G_SCRIPT_WARNING, `未知のデータ種類(${fname}/${lineno})` + this.toUTF(line));
			return false;
		}

		return true;
	}

	readLineDetails(fname, lineno, line) //電話番号を取得
	{
		var telno = line.substr(0, 11).trim();

		if (0 == telno.length) {
			this.putError(G_SCRIPT_WARNING, "\u8ACB\u6C42\u660E\u7D30\u5185\u8A33\u30EC\u30B3\u30FC\u30C9" + `不正な電話番号(${fname}/${lineno})` + this.toUTF(line));
			return false;
		}

		if (strcmp(telno, this.m_telno)) //電話の存在チェック
			{
				if (this.m_telno.length) {
					if (!this.feedTelno()) return false;
				}

				if (!this.toInt(this.m_total, line.substr(97, 10))) {
					this.putError(G_SCRIPT_WARNING, "\u8ACB\u6C42\u660E\u7D30\u5185\u8A33\u30EC\u30B3\u30FC\u30C9\u8ACB\u6C42\u7DCF\u984D\u4E0D\u6B63" + this.m_total + `(${fname}/${lineno})` + this.toUTF(line));
					return false;
				}

				this.m_telno = telno;

				if (!this.m_tel_tb.insert(this.m_telno, undefined, undefined)) {
					this.putError(G_SCRIPT_WARNING, "\u96FB\u8A71\u8FFD\u52A0\u5931\u6557" + this.m_telno + `(${this.m_telno}/${fname}/${lineno})`);
					return false;
				}
			}

		var parent = line.substr(18, 11);

		if (!this.checkParent(parent)) //親番号は一個でも合致したら処理継続
			{
				this.putOperator(G_SCRIPT_INFO, "\u8ACB\u6C42\u660E\u7D30\u5185\u8A33\u30EC\u30B3\u30FC\u30C9" + `親番号(${parent})見つからず(${fname}/${lineno})` + this.toUTF(line));
			}

		for (var cnt = 0; cnt < 9; ++cnt) {
			var code = line.substr(112 + cnt * 16, 3).trim();
			if (0 == code.length) continue;
			var charge = 0;

			if (!this.toInt(charge, line.substr(115 + cnt * 16, 10))) {
				this.putError(G_SCRIPT_WARNING, "\u8ACB\u6C42\u660E\u7D30\u5185\u8A33\u30EC\u30B3\u30FC\u30C9\u8ACB\u6C42\u91D1\u984D\u6574\u6570\u5909\u63DB\u5931\u6557" + `${code},${charge}(${fname}/${lineno})` + this.toUTF(line));
				return false;
			}

			if (!(undefined !== this.m_A_utiwake[code])) //失敗を記録する
				{
					this.m_utiwake_fail = true;
					if (!(-1 !== this.m_A_telno_bad.indexOf("T" + telno))) this.m_A_telno_bad.push("T" + telno);
					var key = "C" + code;

					if (!(-1 !== this.m_A_utiwake_fail.indexOf(key))) //まだエラーを出力していない内訳コードである
						{
							this.m_A_utiwake_fail.push(key);

							if (-1 !== this.m_A_utiwake_unknown.indexOf(key)) //仮登録で記録済である
								//警告メッセージを表示する
								{
									this.putError(G_SCRIPT_WARNING, "\u5185\u8A33\u30B3\u30FC\u30C9" + code + "\u306Ecodetype\u304C\u4EEE\u767B\u9332\u306E\u307E\u307E\u3067\u3059");
								} else //仮登録で記録されていない
								//追加予定リストに追加する
								//警告メッセージを表示する
								{
									this.m_A_utiwake_insert.push(key);
									this.putError(G_SCRIPT_WARNING, "\u8ACB\u6C42\u660E\u7D30\u5185\u8A33\u30EC\u30B3\u30FC\u30C9\u672A\u77E5\u306E\u5185\u8A33\u30B3\u30FC\u30C9" + code);
								}
						}

					continue;
				}

			this.m_A_code.push({
				code: code,
				charge: charge,
				fname: fname,
				lineno: lineno,
				prtelno: parent
			});
		}

		return true;
	}

	feedTelno() //ASP使用料金の追加
	//手動入力済の電話番号があれば削除予定リストに追加する
	{
		if (0 == this.m_telno.length) return true;
		var total = 0;

		for (var pair of Object.values(this.m_A_code)) total += pair.charge;

		if (total != this.m_total && !(-1 !== this.m_A_telno_bad.indexOf("T" + this.m_telno))) //警告は出すが、正常動作を続ける
			{
				var fname = "";
				var lineno = "";

				if (this.m_A_code.length) {
					fname = this.m_A_code[0].fname;
					lineno = this.m_A_code[0].lineno;
				}

				this.putError(G_SCRIPT_WARNING, "\u8ACB\u6C42\u660E\u7D30\u5185\u8A33\u30EC\u30B3\u30FC\u30C9\u8ACB\u6C42\u91D1\u984D\u4E0D\u6B63" + `${total},${this.m_total}(${this.m_telno}/${fname}/${lineno})`);
			}

		this.m_all_total += total;
		++this.m_all_count;
		this.m_total = 0;

		if (this.m_use_asp) {
			this.m_A_code.push({
				code: ""
			});
			this.m_A_code.push({
				code: G_CODE_ASP,
				charge: this.m_asp_charge
			});
			this.m_A_code.push({
				code: G_CODE_ASX,
				charge: +(this.m_asp_charge * G_EXCISE_RATE)
			});
		}

		var detailno = 0;

		for (var pair of Object.values(this.m_A_code)) {
			var code = pair.code;

			if (0 == code.length) {
				++detailno;
				continue;
			}

			if (!(undefined !== this.m_A_utiwake[code])) continue;
			var utiwake = this.m_A_utiwake[code];
			var prtelno = "";
			if (undefined !== pair.prtelno) prtelno = pair.prtelno;
			var H_line = {
				telno: this.m_telno,
				code: code,
				codename: utiwake.name,
				charge: pair.charge,
				taxkubun: utiwake.taxname,
				detailno: detailno,
				prtelno: prtelno
			};
			this.m_inserter.insert(H_line);
			++detailno;
		}

		if (-1 !== this.m_A_hand_detail.indexOf(this.m_telno) && !(-1 !== this.m_A_hand_erase.indexOf(this.m_telno))) this.m_A_hand_erase.push(this.m_telno);
		this.m_telno = "";
		this.m_A_code = Array();
		return true;
	}

};