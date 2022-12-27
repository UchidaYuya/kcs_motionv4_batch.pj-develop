//===========================================================================
//機能：シミュレーションのsim_index_tb部
//
//作成：森原
//===========================================================================
//===========================================================================
//機能：統計情報からシミュレーションを行う(全キャリア)

import TableNo, { ScriptDB, ScriptDBAdaptor, TableInserterBase } from "./script_db";
import { G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogBase } from "./script_log";
import { UpdateRecomBase } from "./update_recom_base3";

//未実行のステータス
//実行中のステータス
//実行済みのステータス
//エラーのステータス
//実行待機のステータス
//キャリアIDからシミュレーションインスタンスへのハッシュ
//機能：コンストラクタ
//機能：キャリア別の機能を追加する
//-----------------------------------------------------------------------
//機能：目的の顧客に統計情報があればtrueを返す
//機能：sim_index_tbから、特定のpactidを一個取り出す
//備考：H_ymがある場合は、前月以前のレコードだけを取り出す
//機能：sim_index_tbから、simidを取り出して配列にして返す
//機能：SQL文のboolean型のin節を作る
//機能：指定されたsimidのレコードをsim_index_tbかdetailsから削除する
//返値：深刻なエラーが発生したらfalseを返す
//機能：指定されたシミュレーションIDのステータスと日時を更新する
//機能：インデックスの内容を取り出す
//機能：夜間実行用のインデックスの内容を作る
//機能：次のシミュレーションIDをシーケンスから取得する
//機能：インデックスをsim_index_tbに挿入する
//機能：インデックスの内容を、統計情報の期間毎に集計する
//備考：戻り値は以下の形式
//array(
//array(
//"pactid" => 顧客ID,
//"year" => 年,
//"month" => 月,
//"carid_before" => 現在のキャリアID,
//"select_way" => 対象電話の集計方法,
//"postid" => 集計方法の部署ID
//"telno" => 集計方法の電話番号
//"is_change_carrier" => 自キャリアなら0/他キャリアなら1
//"A_monthcnt" => array(
//"monthcnt" => 集計期間,
//"A_carid_after" => array(
//"carid_after" => 結果のキャリアID
//"A_param" => array(
//is_change_courseとis_change_packet_free以外の
//キー名 => 値
//"A_is_change" => array(
//sim_index_tbから読み出したハッシュ
//...
//)
//)
//...
//)
//...
//)
//...
//)
//...
//)
//-----------------------------------------------------------------------
//機能：シミュレーションを行う
//返値：深刻なエラーが発生したらtrueを返す
//機能：電話単位のシミュレーションを行う
//返値：深刻なエラーが発生したらtrueを返す
//機能：実行条件でシミュレーションを行う
//返値：深刻なエラーが発生したらtrueを返す
export default class UpdateRecomIndex extends ScriptDBAdaptor {
	static g_status_begin = 0;
	static g_status_running = 1;
	static g_status_end = 2;
	static g_status_error = 3;
	static g_status_wait = 4;
	m_H_recom: any[];
	PutError: any;

	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo) {
		super(listener, db, table_no);
		this.m_H_recom = Array();
	}

	addCarrier(carid, O_recom: UpdateRecomBase) {
		this.m_H_recom[carid] = O_recom;
	}

	isReadyTrend(H_ym: any, pactid, A_carid = Array()) {
// 2022cvt_015
		var no = this.m_table_no.get(H_ym.year, H_ym.month);
// 2022cvt_015
		var sql = "select count(*) from sim_trend_" + no + "_tb";
		sql += " where pactid=" + pactid;
		if (A_carid.length) sql += " and carid in (" + A_carid.join(",") + ")";
		sql += ";";
		return 0 < this.m_db.getOne(sql);
	}

	getPactid(A_status, A_is_save: any, A_is_manual: any, H_ym: any, A_pactid_out: any, offset = 0) {
// 2022cvt_015
		var sql = "select pactid from sim_index_tb";
		sql += " where status in (" + A_status.join(",") + ")";
		if (A_is_save.length) sql += " and " + this.getSQLInBoolean("is_save", A_is_save);
		if (A_is_manual.length) sql += " and " + this.getSQLInBoolean("is_manual", A_is_manual);

		if (undefined !== H_ym.year && undefined !== H_ym.month) {
			sql += " and (";
			sql += " year<" + this.escape(H_ym.year);
			sql += " or (";
			sql += " year=" + this.escape(H_ym.year);
			sql += " and month<" + this.escape(H_ym.month);
			sql += ")";
			sql += ")";
		}

		if (A_pactid_out.length) sql += " and pactid not in (" + A_pactid_out.join(",") + ")";
		sql += " group by pactid";
		sql += " order by pactid";
		sql += " limit 1";
		sql += " offset " + offset;
		sql += ";";
// 2022cvt_015
		var A_result = this.m_db.getAll(sql);
		if (!A_result.length || !A_result[0].length) return undefined;
		return A_result[0][0];
	}

	getSimID(pactid, A_status, carid_before, carid_after, A_is_save: any, A_is_manual: any, H_ym_cur: any = Array(), A_auto_carrier: any[] = Array(), A_is_hotline: any[] = Array()) {
// 2022cvt_015
		var sql = "select simid from sim_index_tb";
		sql += " where status in (" + A_status.join(",") + ")";
		sql += " and pactid=" + this.escape(pactid);
		if (carid_before.length) sql += " and carid_before=" + this.escape(carid_before);
		if (carid_after.length) sql += " and coalesce(carid_after,carid_before)=" + this.escape(carid_after);
		if (A_is_save.length) sql += " and " + this.getSQLInBoolean("is_save", A_is_save);
		if (A_is_manual.length) sql += " and " + this.getSQLInBoolean("is_manual", A_is_manual);

		if (undefined !== H_ym_cur.year && undefined !== H_ym_cur.month) {
			sql += " and year=" + this.escape(H_ym_cur.year);
			sql += " and month=" + this.escape(H_ym_cur.month);
		}

		if (A_auto_carrier.length) {
			sql += " and is_change_carrier=false";
			sql += " and carid_before=coalesce(carid_after,carid_before)";
			sql += " and carid_before in (" + A_auto_carrier.join(",") + ")";
		}

		if (A_is_hotline.length) sql += " and " + this.getSQLInBoolean("is_hotline", A_is_hotline);
		sql += " order by simid";
		sql += ";";
// 2022cvt_015
		var A_simid = Array();
// 2022cvt_015
		var result = this.m_db.getAll(sql);

// 2022cvt_015
		for (var A_line of result) A_simid.push(A_line[0]);

		return A_simid;
	}

	getSQLInBoolean(name, A_is: any[]) {
		if (!A_is.length) return "";
// 2022cvt_015
		var sql = " " + name + " in (";
// 2022cvt_015
		var comma = false;

// 2022cvt_015
		for (var is of Object.values(A_is)) {
			if (comma) sql += ",";
			comma = true;
			sql += is ? "true" : "false";
		}

		sql += ")";
		return sql;
	}

	deleteSimID(A_simid: any[], fname, is_index) {
// 2022cvt_015
		if (is_index) var sqlfrom = " from sim_index_tb";else sqlfrom = " from sim_details_tb";
		if (A_simid.length) sqlfrom += " where simid in (" + A_simid.join(",") + ")";

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
		}

// 2022cvt_015
		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	updateStatus(A_simid: {} | any[], status, H_ym: any = Array(), A_simid_error: any[] = Array(), fixdate = "") {
		if (!fixdate.length) fixdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
// 2022cvt_015
		var A_A_simid = [Array(), Array()];

// 2022cvt_015
		for (var simid of Object.values(A_simid)) {
			if (-1 !== A_simid_error.indexOf(simid)) A_A_simid[1].push(simid);else A_A_simid[0].push(simid);
		}

// 2022cvt_015
		for (var cnt = 0; cnt < 2; ++cnt) {
			if (!A_A_simid[cnt].length) continue;
// 2022cvt_015
			var sql = "update sim_index_tb";
			if (cnt) sql += " set status=" + UpdateRecomIndex.g_status_error;else sql += " set status=" + this.escape(status);
			sql += ",fixdate='" + this.escape(fixdate) + "'";

			if (!cnt) //正常終了側は年月を変更する
				{
					if (undefined !== H_ym.year) sql += ",year=" + this.escape(H_ym.year);
					if (undefined !== H_ym.month) sql += ",month=" + this.escape(H_ym.month);
				}

			sql += " where simid in (" + A_A_simid[cnt].join(",") + ")";
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}
	}

	getIndex(A_simid: any[], H_ym: any = Array()) {
// 2022cvt_015
		var A_keys = ["simid", "status", "recdate", "fixdate", "label", "pactid", "carid_before", "carid_after", "year", "month", "select_way", "postid", "telno", "monthcnt", "discount_way", "discount_base", "discount_tel", "ratio_cellular", "ratio_same_carrier", "ratio_daytime", "ratio_increase_tel", "ratio_increase_comm", "change_packet_free_mode"];
// 2022cvt_015
		var A_keys_boolean = ["is_manual", "is_change_course", "is_change_carrier"];
// 2022cvt_015
		var sql = "select";

// 2022cvt_015
		for (var cnt = 0; cnt < A_keys.length; ++cnt) {
			sql += cnt ? "," : " ";
			sql += A_keys[cnt];
		}

// 2022cvt_015
		for (var key of Object.values(A_keys_boolean)) {
			sql += ",(case when " + key + " then 1 else 0 end) as " + key;
		}

		sql += " from sim_index_tb";
		if (!A_simid.length) return Array();
		sql += " where simid in (" + A_simid.join(",") + ")";
		sql += " order by simid";
		sql += ";";
// 2022cvt_015
		var A_result = this.m_db.getHash(sql);

		for (cnt = 0; cnt < A_result.length; ++cnt) {
			if (undefined !== H_ym.year) A_result[cnt].year = H_ym.year;
			if (undefined !== H_ym.month) A_result[cnt].month = H_ym.month;
			if (!(undefined !== A_result[cnt].carid_after) || !A_result[cnt].carid_after.length) A_result[cnt].carid_after = A_result[cnt].carid_before;
		}

		return A_result;
	}

	createIndex(pactid, carid_before, carid_after, year, month, A_monthcnt: {} | any[], A_is_change_packet_free: {} | any[], A_is_change_course: {} | any[]) //月数に対してループする
	{
// 2022cvt_015
		var A_param = Array();

// 2022cvt_015
		for (var monthcnt of Object.values(A_monthcnt)) //パケット定額フラグに対してループする
		{
// 2022cvt_015
			for (var is_change_packet_free of Object.values(A_is_change_packet_free)) //買い換えフラグに対してループする
			{
// 2022cvt_015
				for (var is_change_course of Object.values(A_is_change_course)) {
// 2022cvt_015
					var H_param = {
						simid: this.getNextID(),
						status: UpdateRecomIndex.g_status_begin,
						recdate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ,
						fixdate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ,
						is_manual: false,
						is_save: false,
						label: "",
						pactid: pactid,
						carid_before: carid_before,
						carid_after: carid_after,
						year: year,
						month: month,
						select_way: 0,
						monthcnt: monthcnt,
						is_change_course: is_change_course ? 1 : 0,
						is_change_packet_free: false,
						is_change_carrier: 0,
						change_packet_free_mode: is_change_packet_free
					};
					A_param.push(H_param);
				}
			}
		}

		return A_param;
	}

	getNextID() {
// 2022cvt_015
		var sql = "select nextval('sim_index_tb_simid_seq');";
		return this.m_db.getOne(sql);
	}

	putIndex(O_inserter_index: TableInserterBase, A_param: any, A_simid_error:any[], fixdate = "", status = UpdateRecomIndex.g_status_end) {
// 2022cvt_015
		var A_keys_boolean = ["is_manual", "is_save", "is_change_course", "is_change_packet_free", "is_change_carrier"];

// 2022cvt_015
		for (var H_param of A_param) {
			if (Object.values(status).length) H_param.status = status;
			if (-1 !== A_simid_error.indexOf(H_param.simid)) H_param.status = UpdateRecomIndex.g_status_error;
			if (fixdate.length) H_param.fixdate = fixdate;

// 2022cvt_015
			for (var key of Object.values(A_keys_boolean)) if (undefined !== H_param[key]) H_param[key] = H_param[key] ? "true" : "false";

			H_param.border = 1;
			H_param.slash = 0;

			if (!O_inserter_index.Insert(H_param)) {
				this.PutError(G_SCRIPT_WARNING, "sim_index_tbへの挿入失敗");
				return false;
			}
		}

		return true;
	}

	partIndex(A_param: {} | any[]) {
// 2022cvt_015
		var A_param_all = Array();
// 2022cvt_015
		var H_keys_all = {
			A_monthcnt: ["pactid", "year", "month", "carid_before", "select_way", "postid", "telno", "is_change_carrier"],
			A_carid_after: ["monthcnt"],
			A_param: ["carid_after"],
			A_is_change: ["discount_way", "discount_base", "discount_tel", "ratio_cellular", "ratio_same_carrier", "ratio_daytime", "ratio_increase_tel", "ratio_increase_comm"]
		};

// 2022cvt_015
		for (var H_param of Object.values(A_param)) //実行パラメータを追加する配列を作る
		//要素を追加する
		{
// 2022cvt_015
			var A_target = A_param_all;

// 2022cvt_015
			for (var target in H_keys_all) //該当の条件の要素がすでにあるか確認する
			{
// 2022cvt_015
				var A_keys = H_keys_all[target];
// 2022cvt_015
				var H_keys = Array();

// 2022cvt_015
				for (var key of A_keys) H_keys[key] = undefined !== H_param[key] ? H_param[key] : "";

// 2022cvt_015
				var idx = -1;

// 2022cvt_015
				for (var cnt = 0; cnt < A_target.length; ++cnt) {
// 2022cvt_015
					var is_fail = false;

// 2022cvt_015
					for (var key in H_keys) {
// 2022cvt_015
						var value = H_keys[key];

// 2022cvt_022
						if (A_target[cnt][key].localeCompare(value)) {
							is_fail = true;
							break;
						}
					}

					if (!is_fail) {
						idx = cnt;
						break;
					}
				}

				if (idx < 0) {
					idx = A_target.length;
					H_keys[target] = Array();
					A_target.push(H_keys);
				}

				A_target = A_target[idx][target];
			}

			A_target.push(H_param);
		}

		return A_param_all;
	}

	execute(O_inserter_details: TableInserterBase, A_simid_error: {} | any[], A_param_all: {} | any[], A_telno_in: any, A_telno_out: {} | any[], cur_date) {
		A_simid_error = Array();

// 2022cvt_015
		for (var H_param_all of Object.values(A_param_all)) //元になるキャリアのシミュレータを取り出す
		//顧客単位の割引率を取り出す
		//電話番号に対してループする
		//統計情報を解放する
		{
// 2022cvt_015
			var carid_before = H_param_all.carid_before;

			if (!(undefined !== this.m_H_recom[carid_before])) {
				this.putError(G_SCRIPT_WARNING, "このキャリアのシミュレータが無い" + carid_before);
				continue;
			}

			this.putError(G_SCRIPT_INFO, "シミュレーション:元のキャリア" + carid_before);
// 2022cvt_015
			var O_from = this.m_H_recom[carid_before];
// 2022cvt_015
			var H_disratio = Array();
			if (!O_from.getDisratio(H_disratio, H_param_all.pactid)) continue;
// 2022cvt_015
			var no = this.m_table_no.get(H_param_all.year, H_param_all.month);
// 2022cvt_015
			var A_postid = Array();
// 2022cvt_015
			var select_way = H_param_all.select_way;
			if (!select_way.length) select_way = 0;

			switch (select_way) {
				case 0:
					this.putError(G_SCRIPT_INFO, "シミュレーション実行開始:全電話" + "/" + H_param_all.pactid + "/" + H_param_all.year + "/" + H_param_all.month);
					break;

				case 1:
					this.putError(G_SCRIPT_INFO, "シミュレーション実行開始:配下部署" + "/" + H_param_all.pactid + "/" + H_param_all.year + "/" + H_param_all.month + "/" + H_param_all.postid);
// 2022cvt_015
					var postid = H_param_all.postid;
					if (postid.length) A_postid = O_from.getRelationPost(H_param_all.pactid, no, postid);
					break;

				case 2:
					this.putError(G_SCRIPT_INFO, "シミュレーション実行開始:直下部署" + "/" + H_param_all.pactid + "/" + H_param_all.year + "/" + H_param_all.month + "/" + H_param_all.postid);
					postid = H_param_all.postid;
					if (postid.length) A_postid = [postid];
					break;

				case 3:
					this.putError(G_SCRIPT_INFO, "シミュレーション実行開始:電話限定" + "/" + H_param_all.pactid + "/" + H_param_all.year + "/" + H_param_all.month + "/" + H_param_all.telno);
// 2022cvt_015
					var telno = H_param_all.telno;

					if (A_telno_in.length) {
						if (!(-1 !== A_telno_in.indexOf(telno))) continue;
						A_telno_in = [telno];
					} else A_telno_in = [telno];

					break;
			}

// 2022cvt_015
			var H_fetch = Array();
			O_from.fetchHist(H_fetch, H_param_all.pactid, H_param_all.year, H_param_all.month, A_telno_in, A_telno_out, A_postid, O_from.get_carid_after(), O_from.get_cirid_after());
// 2022cvt_015
			var H_hist: any = Array();

			while (O_from.fetchHistTel(H_hist, H_fetch)) //電話単位の処理を行う
			{
				this.putError(G_SCRIPT_INFO, "電話処理開始" + H_hist.tel.telno);
				if (!this.executeTelno(O_inserter_details, A_simid_error, O_from, H_param_all.A_monthcnt, H_hist, H_disratio, cur_date, H_param_all.pactid, H_param_all.is_change_carrier)) return false;
			}

			O_from.freeHist(H_fetch);
		}

		return true;
	}

	executeTelno(O_inserter_details: TableInserterBase, A_simid_error: any, O_from: UpdateRecomBase, A_param_monthcnt: {} | any[], H_hist: any, H_disratio: {} | any[], cur_date, pactid, is_change_carrier) //平均期間に対してループする
	{
// 2022cvt_015
		for (var H_param_monthcnt of Object.values(A_param_monthcnt)) //平均期間で平均を取る
		//結果のキャリアに対してループする
		{
			this.putError(G_SCRIPT_INFO, "平均期間" + H_param_monthcnt.monthcnt);
// 2022cvt_015
			var H_ave = Array();
			O_from.calcAve(H_ave, H_hist.predata, H_hist.trend, H_hist.top, H_param_monthcnt.monthcnt, is_change_carrier);

// 2022cvt_015
			for (var H_param_carid_after of H_param_monthcnt.A_carid_after) //シミュレーション後のシミュレータを取り出す
			//実行条件に対してループ
			{
// 2022cvt_015
				var carid_after = H_param_carid_after.carid_after;

				if (!(undefined !== this.m_H_recom[carid_after])) {
					this.putError(G_SCRIPT_WARNING, "このキャリアのシミュレータが無い" + carid_after);
					continue;
				}

				this.putError(G_SCRIPT_INFO, "シミュレーション後キャリア" + carid_after);
// 2022cvt_015
				var O_to = this.m_H_recom[carid_after];

// 2022cvt_015
				for (var H_param_param of H_param_carid_after.A_param) //実行条件でシミュレーションを行う
				{
// 2022cvt_015
					var msg = "シミュレーション数値パラメータ";

// 2022cvt_015
					for (var key in H_param_param) {
// 2022cvt_015
						var value = H_param_param[key];
// 2022cvt_022
						if (!key.localeCompare("A_is_change")) continue;
						if (!value.length) continue;
						msg += "/";
						msg += key;
						msg += "=";
						msg += value;
					}

					this.putError(G_SCRIPT_INFO, msg);
					if (!this.executeParam(O_inserter_details, A_simid_error, O_to, H_hist.tel, H_ave, H_param_param.A_is_change, H_disratio, cur_date, pactid, is_change_carrier, H_param_monthcnt.monthcnt)) return false;
				}
			}
		}

		return true;
	}

	executeParam(O_inserter_details: TableInserterBase, A_simid_error: any[], O_to: UpdateRecomBase, H_tel: {} | any[], H_ave: {} | any[], A_param: {} | any[], H_disratio: {} | any[], cur_date, pactid, is_change_carrier, monthcnt) //シミュレーションを行う
	{
// 2022cvt_015
		var is_error = false;
// 2022cvt_015
		var A_details = Array();
		if (!O_to.calc(is_error, A_details, H_tel, H_ave, A_param, H_disratio, pactid, monthcnt, cur_date, is_change_carrier)) return false;

		if (is_error) {
// 2022cvt_015
			for (var H_param of Object.values(A_param)) A_simid_error.push(H_param.simid);

			return true;
		}

// 2022cvt_015
		for (var H_details of Object.values(A_details)) {
			if (!O_inserter_details.insert(H_details)) {
				this.putError(G_SCRIPT_WARNING, "sim_details_tbへの挿入失敗");
				return false;
			}
		}

		return true;
	}

};
