//===========================================================================
//機能：tel_details_X_tbにASPとASXのレコードを追加する
//
//作成：森原
//===========================================================================
//処理しないキャリアID(カンマでつないで複数指定可能)
//電話会社からの請求のdetailnoと、ASPのdetailnoの間の余分なレコード数
//---------------------------------------------------------------------------
//機能：utiwake_tbのtaxtypeから、tel_details_X_tbのtaxkubunの値を取り出す
//引数：taxkubunに入れるラベルを返す
//utiwake_tbのtaxtypeの値を受け取る
//返値：未知の値ならfalseを返す
//---------------------------------------------------------------------------
//機能：tel_details_X_tbにASPとASXのレコードを追加する

require("script_db.php");

require("script_common.php");

const EXCLUDE_CARID = "";
const SPACE_COUNT = 1;

function taxtype2taxkubun(taxkubun, taxtype) {
	switch (taxtype) {
		case 0:
			taxkubun = undefined;
			break;

		case 1:
			taxkubun = "\u5408\u7B97";
			break;

		case 2:
			taxkubun = "\u500B\u5225";
			break;

		case 3:
			taxkubun = "\u5185\u7A0E";
			break;

		case 4:
			taxkubun = "\u975E\u5BFE\u8C61\u7B49";
			break;

		case 5:
			taxkubun = "\u5408\u7B97/\u975E\u5BFE\u8C61\u7B49";
			break;

		default:
			return false;
	}

	return true;
};

//挿入型
//除外するキャリアID
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//tel_details_X_tbへの挿入型
//機能：ASPとASXのレコードを削除する
//引数：顧客ID
//キャリアID(空文字列なら全キャリア)
//年
//月
//保存先ファイル名(空文字列ならファイル保存せず)
//返値：深刻なエラーが発生したらfalseを返す
//機能：ASPとASXのレコードを追加する
//引数：顧客ID
//キャリアID(空文字列なら全キャリア)
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：実際の挿入を行う
//引数：顧客ID
//テーブル番号
//処理が必要なキャリアID
//キャリアID => ASP利用料
//キャリアID => (ASP => ASPの内訳, ASX => ASXの内訳)
//返値：深刻なエラーが発生したらfalseを返す
class UpdateAspCharge extends ScriptDBAdaptor {
	UpdateAspCharge(listener, db, table_no, inserter) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_inserter = inserter;
		this.m_A_exclude_carid = Array();
		if (EXCLUDE_CARID.length) this.m_A_exclude_carid = EXCLUDE_CARID.split(",");
	}

	delete(pactid, carid, year, month, fname) //検索条件部分を作る
	{
		if (G_CARRIER_ALL == carid) carid = "";
		var sql = "select carid,telno from dummy_tel_tb" + " where pactid=" + this.escape(pactid);
		if (carid.length) sql += " and carid=" + this.escape(carid);
		sql += ";";
		var A_dummy = this.m_db.getHash(sql);
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from tel_details_" + table_no + "_tb" + " where code in ('" + G_CODE_ASP + "','" + G_CODE_ASX + "')" + " and pactid=" + this.escape(pactid);
		if (carid.length) sqlfrom += " and carid=" + this.escape(carid);
		if (this.m_A_exclude_carid.length) sqlfrom += " and carid not in(" + this.m_A_exclude_carid.join(",") + ")";

		for (var H_dummy of Object.values(A_dummy)) {
			sqlfrom += " and (telno!='" + this.escape(H_dummy.telno) + "'" + " or carid!=" + this.escape(H_dummy.carid) + ")";
		}

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
		}

		sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	execute(pactid, carid, year, month) //ASP権限があるか確認する
	//内訳を取り出す
	//処理が必要なキャリアIDのASP利用料と内訳がそろっているか確認する
	//挿入準備を行う
	{
		var table_no = this.getTableNo(year, month);
		var table_name = "tel_details_" + table_no + "_tb";
		var sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and fncid=" + this.escape(G_AUTH_ASP);
		sql += ";";

		if (0 == this.m_db.getOne(sql)) {
			this.putError(G_SCRIPT_INFO, "ASP\u6A29\u9650\u304C\u7121\u3044\u306E\u3067\u8FFD\u52A0\u305B\u305A(\u524A\u9664\u306E\u307F\u5B9F\u884C)");
			return true;
		}

		sql = "select tel_details_X_tb.carid from " + table_name + " as tel_details_X_tb";
		sql += " left join dummy_tel_tb" + " on tel_details_X_tb.pactid=dummy_tel_tb.pactid" + " and tel_details_X_tb.carid=dummy_tel_tb.carid" + " and tel_details_X_tb.telno=dummy_tel_tb.telno";
		sql += " where tel_details_X_tb.pactid=" + this.escape(pactid);
		sql += " and dummy_tel_tb.telno is null";
		if (carid.length) sql += " and tel_details_X_tb.carid=" + this.escape(carid);
		if (this.m_A_exclude_carid.length) sql += " and tel_details_X_tb.carid not in(" + this.m_A_exclude_carid.join(",") + ")";
		sql += " group by tel_details_X_tb.carid";
		sql += ";";
		var result = this.m_db.getAll(sql);
		var A_carid = Array();

		for (var A_line of Object.values(result)) A_carid.push(A_line[0]);

		if (!A_carid.length) {
			this.putError(G_SCRIPT_INFO, "\u51E6\u7406\u3059\u3079\u304D\u96FB\u8A71\u304C\u5B58\u5728\u3057\u306A\u3044");
			return true;
		}

		sql = "select carid,charge from asp_charge_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += ";";
		result = this.m_db.getHash(sql);
		var H_charge = Array();

		for (var H_line of Object.values(result)) H_charge[H_line.carid] = H_line.charge;

		sql = "select * from utiwake_tb";
		sql += " where code in ('" + G_CODE_ASP + "','" + G_CODE_ASX + "')";
		sql += " and carid in (" + A_carid.join(",") + ")";
		sql += " order by carid,code";
		sql += ";";
		result = this.m_db.getHash(sql);
		var H_utiwake = Array();

		for (var H_line of Object.values(result)) {
			var taxkubun = undefined;

			if (!taxtype2taxkubun(taxkubun, H_line.taxtype)) {
				this.putOperator(G_SCRIPT_WARNING, "utiwake_tb\u306B\u672A\u77E5\u306E\u7A0E\u533A\u5206\u304C\u3042\u308B" + H_line.code);
				return false;
			}

			if (!(undefined !== taxkubun)) taxkubun = "";
			H_line.taxkubun = taxkubun;
			if (!(undefined !== H_utiwake[H_line.carid])) H_utiwake[H_line.carid] = Array();
			H_utiwake[H_line.carid][H_line.code] = H_line;
		}

		for (var id of Object.values(A_carid)) {
			if (!(undefined !== H_charge[id])) {
				this.putError(G_SCRIPT_WARNING, "ASP\u6A29\u9650\u304C\u3042\u308B\u304CASP\u5229\u7528\u6599\u304C\u7121\u3044(carid:=" + id);
				return true;
			}

			if (!(undefined !== H_utiwake[id]) || !(undefined !== H_utiwake[id][G_CODE_ASP]) || !(undefined !== H_utiwake[id][G_CODE_ASX])) {
				this.putError(G_SCRIPT_WARNING, "ASP\u6A29\u9650\u304C\u3042\u308B\u304C\u5185\u8A33\u304C\u7121\u3044(carid:=" + id);
				return true;
			}
		}

		if (!this.m_inserter.begin(table_name)) {
			this.putError(G_SCRIPT_WARNING, "begin(" + table_name + ")");
			return false;
		}

		if (!this.do_execute(pactid, table_no, A_carid, H_charge, H_utiwake)) {
			this.putError(G_SCRIPT_WARNING, "execute(" + table_name + ")");
			return false;
		}

		if (!this.m_inserter.end()) {
			this.putError(G_SCRIPT_WARNING, "end(" + table_name + ")");
			return false;
		}

		return true;
	}

	do_execute(pactid, table_no, A_carid, H_charge, H_utiwake) //挿入が必要な電話番号のリストを作成する
	//挿入が必要な電話に対して追加を行う
	{
		var table_name = "tel_details_" + table_no + "_tb";
		var sql = "select tel_details_X_tb.telno" + ",tel_details_X_tb.carid" + ",max(tel_details_X_tb.detailno)" + " from " + table_name + " as tel_details_X_tb" + " left join dummy_tel_tb" + " on tel_details_X_tb.pactid=dummy_tel_tb.pactid" + " and tel_details_X_tb.carid=dummy_tel_tb.carid" + " and tel_details_X_tb.telno=dummy_tel_tb.telno";
		sql += " where tel_details_X_tb.pactid=" + this.escape(pactid);
		if (A_carid.length) sql += " and tel_details_X_tb.carid in (" + A_carid.join(",") + ")";
		sql += " and dummy_tel_tb.telno is null";
		sql += " group by tel_details_X_tb.telno,tel_details_X_tb.carid";
		sql += ";";
		var result = this.m_db.getAll(sql);

		for (var A_line of Object.values(result)) //電話会社からの請求の後にスペースを空ける
		//ASPとASXを追加する
		{
			var telno = A_line[0];
			var carid = A_line[1];
			var detailno = A_line[2];
			var charge = H_charge[carid];
			var excise = +(charge * G_EXCISE_RATE);
			detailno += SPACE_COUNT;

			for (var cnt = 0; cnt < 2; ++cnt) {
				++detailno;
				var price = cnt ? excise : charge;
				var code = cnt ? G_CODE_ASX : G_CODE_ASP;
				var H_line = H_utiwake[carid][code];
				var H_record = {
					pactid: pactid,
					telno: telno,
					code: code,
					codename: H_line.name,
					charge: price,
					taxkubun: H_line.taxkubun,
					detailno: detailno,
					recdate: "now()",
					carid: carid
				};
				this.m_inserter.insert(H_record);
			}
		}

		return true;
	}

};