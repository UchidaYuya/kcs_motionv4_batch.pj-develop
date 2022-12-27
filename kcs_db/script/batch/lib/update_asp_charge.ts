import { G_AUTH_ASP, G_CARRIER_ALL, G_CODE_ASP, G_CODE_ASX, G_EXCISE_RATE } from "../../batch/lib/script_common";
import { ScriptDBAdaptor } from "../../batch/lib/script_db";
import { G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING } from "../../batch/lib/script_log";

export const EXCLUDE_CARID = "";
export const SPACE_COUNT = 1;

// 2022cvt_016
export function taxtype2taxkubun(taxkubun, taxtype) {
// 2022cvt_016
	switch (taxtype) {
		case 0:
			taxkubun = undefined;
			break;

		case 1:
			taxkubun = "合算";
			break;

		case 2:
			taxkubun = "個別";
			break;

		case 3:
			taxkubun = "内税";
			break;

		case 4:
			taxkubun = "非対象等";
			break;

		case 5:
			taxkubun = "合算/非対象等";
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
export class UpdateAspCharge extends ScriptDBAdaptor {
	m_inserter: any;
	m_A_exclude_carid: any;
	// UpdateAspCharge(listener, db, table_no, inserter) {
	constructor(listener, db, table_no, inserter) {
		// this.ScriptDBAdaptor(listener, db, table_no);
		super(listener, db, table_no);
		this.m_inserter = inserter;
		this.m_A_exclude_carid = Array();
		if (EXCLUDE_CARID.length) this.m_A_exclude_carid = EXCLUDE_CARID.split(",");
	}

	async delete(pactid, carid, year, month, fname) //検索条件部分を作る
	{
		if (G_CARRIER_ALL == carid) carid = "";
// 2022cvt_015
		var sql = "select carid,telno from dummy_tel_tb" + " where pactid=" + this.escape(pactid);
		if (carid.length) sql += " and carid=" + this.escape(carid);
		sql += ";";
// 2022cvt_015
		var A_dummy = await this.m_db.getHash(sql);
// 2022cvt_015
		var table_no = this.getTableNo(year, month);
// 2022cvt_015
		var sqlfrom = " from tel_details_" + table_no + "_tb" + " where code in ('" + G_CODE_ASP + "','" + G_CODE_ASX + "')" + " and pactid=" + this.escape(pactid);
		if (carid.length) sqlfrom += " and carid=" + this.escape(carid);
		if (this.m_A_exclude_carid.length) sqlfrom += " and carid not in(" + this.m_A_exclude_carid.join(",") + ")";

// 2022cvt_015
		for (var H_dummy of (A_dummy)) {
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

	async execute(pactid, carid, year, month) //ASP権限があるか確認する
	//内訳を取り出す
	//処理が必要なキャリアIDのASP利用料と内訳がそろっているか確認する
	//挿入準備を行う
	{
// 2022cvt_015
		var table_no = this.getTableNo(year, month);
// 2022cvt_015
		var table_name = "tel_details_" + table_no + "_tb";
// 2022cvt_015
		var sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and fncid=" + this.escape(G_AUTH_ASP);
		sql += ";";

		// if (0 == this.m_db.getOne(sql)) {
		if (!this.m_db.getOne(sql)) {
			this.putError(G_SCRIPT_INFO, "ASP権限が無いので追加せず(削除のみ実行)");
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
// 2022cvt_015
		var result = await this.m_db.getAll(sql);
// 2022cvt_015
		var A_carid = Array();

// 2022cvt_015
		for (var A_line of (result)) A_carid.push(A_line[0]);

		if (!A_carid.length) {
			this.putError(G_SCRIPT_INFO, "処理すべき電話が存在しない");
			return true;
		}

		sql = "select carid,charge from asp_charge_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += ";";
		result = await this.m_db.getHash(sql);
// 2022cvt_015
		var H_charge = Array();

// 2022cvt_015
		for (var H_line of (result)) H_charge[H_line.carid] = H_line.charge;

		sql = "select * from utiwake_tb";
		sql += " where code in ('" + G_CODE_ASP + "','" + G_CODE_ASX + "')";
		sql += " and carid in (" + A_carid.join(",") + ")";
		sql += " order by carid,code";
		sql += ";";
		result = await this.m_db.getHash(sql);
// 2022cvt_015
		var H_utiwake = Array();

// 2022cvt_015
		for (var H_line of (result)) {
// 2022cvt_015
			var taxkubun: any;

// 2022cvt_016
			if (!taxtype2taxkubun(taxkubun, H_line.taxtype)) {
				this.putOperator(G_SCRIPT_WARNING, "utiwake_tbutiwake_tbに未知の税区分がある" + H_line.code);
				return false;
			}

			if (!(undefined !== taxkubun)) taxkubun = "";
			H_line.taxkubun = taxkubun;
			if (!(undefined !== H_utiwake[H_line.carid])) H_utiwake[H_line.carid] = Array();
			H_utiwake[H_line.carid][H_line.code] = H_line;
		}

// 2022cvt_015
		for (var id of (A_carid)) {
			if (!(undefined !== H_charge[id])) {
				this.putError(G_SCRIPT_WARNING, "ASP権限があるがASP利用料が無い(carid:=" + id);
				return true;
			}

			if (!(undefined !== H_utiwake[id]) || !(undefined !== H_utiwake[id][G_CODE_ASP]) || !(undefined !== H_utiwake[id][G_CODE_ASX])) {
				this.putError(G_SCRIPT_WARNING, "ASP権限があるが内訳が無い(carid:=" + id);
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

	async do_execute(pactid, table_no, A_carid, H_charge, H_utiwake) //挿入が必要な電話番号のリストを作成する
	//挿入が必要な電話に対して追加を行う
	{
// 2022cvt_015
		var table_name = "tel_details_" + table_no + "_tb";
// 2022cvt_015
		var sql = "select tel_details_X_tb.telno" + ",tel_details_X_tb.carid" + ",max(tel_details_X_tb.detailno)" + " from " + table_name + " as tel_details_X_tb" + " left join dummy_tel_tb" + " on tel_details_X_tb.pactid=dummy_tel_tb.pactid" + " and tel_details_X_tb.carid=dummy_tel_tb.carid" + " and tel_details_X_tb.telno=dummy_tel_tb.telno";
		sql += " where tel_details_X_tb.pactid=" + this.escape(pactid);
		if (A_carid.length) sql += " and tel_details_X_tb.carid in (" + A_carid.join(",") + ")";
		sql += " and dummy_tel_tb.telno is null";
		sql += " group by tel_details_X_tb.telno,tel_details_X_tb.carid";
		sql += ";";
// 2022cvt_015
		var result = await this.m_db.getAll(sql);

// 2022cvt_015
		for (var A_line of (result)) //電話会社からの請求の後にスペースを空ける
		//ASPとASXを追加する
		{
// 2022cvt_015
			var telno = A_line[0];
// 2022cvt_015
			var carid = A_line[1];
// 2022cvt_015
			var detailno = A_line[2];
// 2022cvt_015
			var charge = H_charge[carid];
// 2022cvt_015
			var excise = +(charge * G_EXCISE_RATE);
			detailno += SPACE_COUNT;

// 2022cvt_015
			for (var cnt = 0; cnt < 2; ++cnt) {
				++detailno;
// 2022cvt_015
				var price = cnt ? excise : charge;
// 2022cvt_015
				var code = cnt ? G_CODE_ASX : G_CODE_ASP;
// 2022cvt_015
				var H_line = H_utiwake[carid][code];
// 2022cvt_015
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
