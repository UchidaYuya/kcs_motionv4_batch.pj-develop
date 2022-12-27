//===========================================================================
//機能：テーブルの順送り
//
//作成：森原
//===========================================================================

import { KCS_DIR } from "../../../conf/batch_setting";
import { sprintf } from "../../../db_define/define";
import { G_AREA_UNKNOWN, G_CARRIER_UNKNOWN, G_CIRCUIT_UNKNOWN } from "./script_common";
import TableNo, {ScriptDBAdaptor,ScriptDB,TableInserter} from "./script_db";
import { G_SCRIPT_DEBUG, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogBase } from "./script_log";

const CHANGEOVER_TMP_PATH = "/tmp/";

export default class ChangeoverDB extends ScriptDBAdaptor {
	m_A_param: any[];
	m_pactid!: number;
	m_year!: number;
	m_month!: number;
	m_toppostid!: string;
	m_A_relation!: any[];
	m_filename!: string;
	m_is_exec_copy: boolean;
	m_is_exec_other: boolean;
	m_A_truncate!: any[];
	m_is_save: boolean;
	m_dsn_copy: string;
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, path: boolean, is_save = true, is_exec_copy = true, is_exec_other = true, dsn_copy = "") //デフォルトのパラメータを準備
	{
		super(listener, db, table_no);
		this.m_is_exec_copy = is_exec_copy;
		this.m_is_exec_other = is_exec_other;
		this.m_is_save = is_save;
		this.m_dsn_copy = dsn_copy;
		var A_param_copy:any[] = [{
			method: "backup",
			table: "tel_tb"
		}, {
			method: "backup",
			table: "card_tb"
		}, {
			method: "backup",
			table: "purchase_tb"
		}, {
			method: "backup",
			table: "copy_tb"
		}, {
			method: "backup",
			table: "assets_tb"
		}, {
			method: "backup",
			table: "transit_tb"
		}, {
			method: "backup",
			table: "iccard_tb"
		}, {
			method: "backup",
			table: "iccard_history_tb"
		}, {
			method: "backup",
			table: "ev_tb"
		}, {
			method: "backup",
			table: "ev_bill_tb"
		}, {
			method: "backup",
			table: "ev_post_bill_tb"
		}, {
			method: "backup",
			table: "ev_details_tb"
		}, {
			method: "backup",
			table: "ev_usehistory_tb"
		}, {
			method: "backup",
			table: "healthcare_tb"
		}, {
			method: "backup",
			table: "addbill_tb"
		}, {
			method: "log",
			context: "二年前削除"
		}, {
			method: "delete",
			table: "bill_%2_tb"
		}, {
			method: "delete",
			table: "tel_bill_%2_tb"
		}, {
			method: "delete",
			table: "kousi_bill_%2_tb"
		}, {
			method: "delete",
			table: "kousi_tel_bill_%2_tb"
		}, {
			method: "delete",
			table: "tel_details_%2_tb"
		}, {
			method: "delete",
			table: "tel_rel_tel_%2_tb"
		}, {
			method: "delete",
			table: "tel_rel_assets_%2_tb"
		}, {
			method: "delete",
			table: "sim_trend_%2_tb"
		}, {
			method: "delete",
			table: "trend_%2_tb"
		}, {
			method: "delete",
			table: "assets_%2_tb"
		}, {
			method: "delete",
			table: "tel_%2_tb"
		}, {
			method: "delete",
			table: "card_%2_tb"
		}, {
			method: "delete",
			table: "card_details_%2_tb"
		}, {
			method: "delete",
			table: "card_post_bill_%2_tb"
		}, {
			method: "delete",
			table: "card_bill_%2_tb"
		}, {
			method: "delete",
			table: "purchase_details_%2_tb"
		}, {
			method: "delete",
			table: "purchase_post_bill_%2_tb"
		}, {
			method: "delete",
			table: "purchase_bill_%2_tb"
		}, {
			method: "delete",
			table: "purchase_%2_tb"
		}, {
			method: "delete",
			table: "copy_details_%2_tb"
		}, {
			method: "delete",
			table: "copy_post_bill_%2_tb"
		}, {
			method: "delete",
			table: "copy_bill_%2_tb"
		}, {
			method: "delete",
			table: "copy_%2_tb"
		}, {
			method: "delete",
			table: "transit_details_%2_tb"
		}, {
			method: "delete",
			table: "transit_post_bill_%2_tb"
		}, {
			method: "delete",
			table: "transit_bill_%2_tb"
		}, {
			method: "delete",
			table: "transit_%2_tb"
		}, {
			method: "delete",
			table: "iccard_history_%2_tb"
		}, {
			method: "delete",
			table: "iccard_%2_tb"
		}, {
			method: "delete",
			table: "iccard_bill_%2_tb"
		}, {
			method: "delete",
			table: "iccard_post_bill_%2_tb"
		}, {
			method: "delete",
			table: "ev_post_bill_%2_tb"
		}, {
			method: "delete",
			table: "ev_bill_%2_tb"
		}, {
			method: "delete",
			table: "ev_details_%2_tb"
		}, {
			method: "delete",
			table: "ev_usehistory_%2_tb"
		}, {
			method: "delete",
			table: "ev_%2_tb"
		}, {
			method: "delete",
			table: "summary_bill_%2_tb"
		}, {
			method: "delete",
			table: "summary_tel_bill_%2_tb"
		}, {
			method: "delete",
			table: "extension_tel_%2_tb"
		}, {
			method: "delete",
			table: "post_relation_%2_tb"
		}, {
			method: "delete",
			table: "post_%2_tb"
		}, {
			method: "delete",
			table: "healthcare_post_bill_%2_tb"
		}, {
			method: "delete",
			table: "healthcare_bill_%2_tb"
		}, {
			method: "delete",
			table: "healthcare_rechistory_%2_tb"
		}, {
			method: "delete",
			table: "healthcare_%2_tb"
		}, {
			method: "delete",
			table: "addbill_%2_tb"
		}, {
			method: "delete",
			table: "addbill_post_bill_%2_tb"
		}, {
			method: "log",
			context: "一年前を二年前にコピー"
		}, {
			method: "copy",
			from: "post_%1_tb",
			to: "post_%2_tb"
		}, {
			method: "copy",
			from: "post_relation_%1_tb",
			to: "post_relation_%2_tb"
		}, {
			method: "copy",
			from: "tel_%1_tb",
			to: "tel_%2_tb"
		}, {
			method: "copy",
			from: "tel_details_%1_tb",
			to: "tel_details_%2_tb"
		}, {
			method: "copy",
			from: "tel_bill_%1_tb",
			to: "tel_bill_%2_tb"
		}, {
			method: "copy",
			from: "bill_%1_tb",
			to: "bill_%2_tb"
		}, {
			method: "copy",
			from: "extension_tel_%1_tb",
			to: "extension_tel_%2_tb"
		}, {
			method: "copy",
			from: "summary_tel_bill_%1_tb",
			to: "summary_tel_bill_%2_tb"
		}, {
			method: "copy",
			from: "summary_bill_%1_tb",
			to: "summary_bill_%2_tb"
		}, {
			method: "copy",
			from: "kousi_tel_bill_%1_tb",
			to: "kousi_tel_bill_%2_tb"
		}, {
			method: "copy",
			from: "kousi_bill_%1_tb",
			to: "kousi_bill_%2_tb"
		}, {
			method: "copy",
			from: "trend_%1_tb",
			to: "trend_%2_tb"
		}, {
			method: "copy",
			from: "card_%1_tb",
			to: "card_%2_tb"
		}, {
			method: "copy",
			from: "card_details_%1_tb",
			to: "card_details_%2_tb"
		}, {
			method: "copy",
			from: "card_post_bill_%1_tb",
			to: "card_post_bill_%2_tb"
		}, {
			method: "copy",
			from: "card_bill_%1_tb",
			to: "card_bill_%2_tb"
		}, {
			method: "copy",
			from: "purchase_details_%1_tb",
			to: "purchase_details_%2_tb"
		}, {
			method: "copy",
			from: "purchase_post_bill_%1_tb",
			to: "purchase_post_bill_%2_tb"
		}, {
			method: "copy",
			from: "purchase_bill_%1_tb",
			to: "purchase_bill_%2_tb"
		}, {
			method: "copy",
			from: "purchase_%1_tb",
			to: "purchase_%2_tb"
		}, {
			method: "copy",
			from: "copy_details_%1_tb",
			to: "copy_details_%2_tb"
		}, {
			method: "copy",
			from: "copy_post_bill_%1_tb",
			to: "copy_post_bill_%2_tb"
		}, {
			method: "copy",
			from: "copy_bill_%1_tb",
			to: "copy_bill_%2_tb"
		}, {
			method: "copy",
			from: "copy_%1_tb",
			to: "copy_%2_tb"
		}, {
			method: "copy",
			from: "transit_details_%1_tb",
			to: "transit_details_%2_tb"
		}, {
			method: "copy",
			from: "transit_post_bill_%1_tb",
			to: "transit_post_bill_%2_tb"
		}, {
			method: "copy",
			from: "transit_bill_%1_tb",
			to: "transit_bill_%2_tb"
		}, {
			method: "copy",
			from: "transit_%1_tb",
			to: "transit_%2_tb"
		}, {
			method: "copy",
			from: "iccard_%1_tb",
			to: "iccard_%2_tb"
		}, {
			method: "copy",
			from: "iccard_history_%1_tb",
			to: "iccard_history_%2_tb"
		}, {
			method: "copy",
			from: "iccard_bill_%1_tb",
			to: "iccard_bill_%2_tb"
		}, {
			method: "copy",
			from: "iccard_post_bill_%1_tb",
			to: "iccard_post_bill_%2_tb"
		}, {
			method: "copy",
			from: "ev_post_bill_%1_tb",
			to: "ev_post_bill_%2_tb"
		}, {
			method: "copy",
			from: "ev_bill_%1_tb",
			to: "ev_bill_%2_tb"
		}, {
			method: "copy",
			from: "ev_details_%1_tb",
			to: "ev_details_%2_tb"
		}, {
			method: "copy",
			from: "ev_usehistory_%1_tb",
			to: "ev_usehistory_%2_tb"
		}, {
			method: "copy",
			from: "ev_%1_tb",
			to: "ev_%2_tb"
		}, {
			method: "copy",
			from: "sim_trend_%1_tb",
			to: "sim_trend_%2_tb"
		}, {
			method: "copy",
			from: "assets_%1_tb",
			to: "assets_%2_tb"
		}, {
			method: "copy",
			from: "tel_rel_tel_%1_tb",
			to: "tel_rel_tel_%2_tb"
		}, {
			method: "copy",
			from: "tel_rel_assets_%1_tb",
			to: "tel_rel_assets_%2_tb"
		}, {
			method: "copy",
			from: "healthcare_post_bill_%1_tb",
			to: "healthcare_post_bill_%2_tb"
		}, {
			method: "copy",
			from: "healthcare_bill_%1_tb",
			to: "healthcare_bill_%2_tb"
		}, {
			method: "copy",
			from: "healthcare_%1_tb",
			to: "healthcare_%2_tb"
		}, {
			method: "copy",
			from: "healthcare_rechistory_%1_tb",
			to: "healthcare_rechistory_%2_tb"
		}, {
			method: "copy",
			from: "addbill_%1_tb",
			to: "addbill_%2_tb"
		}, {
			method: "copy",
			from: "addbill_post_bill_%1_tb",
			to: "addbill_post_bill_%2_tb"
		}, {
			method: "log",
			context: "一年前削除"
		}, {
			method: "delete",
			table: "infohistory_%1_tb"
		}, {
			method: "delete",
			table: "commhistory_%1_tb"
		}, {
			method: "delete",
			table: "bill_%1_tb"
		}, {
			method: "delete",
			table: "tel_bill_%1_tb"
		}, {
			method: "delete",
			table: "kousi_bill_%1_tb"
		}, {
			method: "delete",
			table: "kousi_tel_bill_%1_tb"
		}, {
			method: "delete",
			table: "tel_details_%1_tb"
		}, {
			method: "delete",
			table: "tel_rel_tel_%1_tb"
		}, {
			method: "delete",
			table: "tel_rel_assets_%1_tb"
		}, {
			method: "delete",
			table: "sim_trend_%1_tb"
		}, {
			method: "delete",
			table: "trend_%1_tb"
		}, {
			method: "delete",
			table: "assets_%1_tb"
		}, {
			method: "delete",
			table: "tel_%1_tb"
		}, {
			method: "delete",
			table: "yuyu_telno_%1_tb"
		}, {
			method: "delete",
			table: "card_%1_tb"
		}, {
			method: "delete",
			table: "card_details_%1_tb"
		}, {
			method: "delete",
			table: "card_usehistory_%1_tb"
		}, {
			method: "delete",
			table: "card_post_bill_%1_tb"
		}, {
			method: "delete",
			table: "card_bill_%1_tb"
		}, {
			method: "delete",
			table: "purchase_details_%1_tb"
		}, {
			method: "delete",
			table: "purchase_post_bill_%1_tb"
		}, {
			method: "delete",
			table: "purchase_bill_%1_tb"
		}, {
			method: "delete",
			table: "purchase_%1_tb"
		}, {
			method: "delete",
			table: "copy_details_%1_tb"
		}, {
			method: "delete",
			table: "copy_history_%1_tb"
		}, {
			method: "delete",
			table: "copy_post_bill_%1_tb"
		}, {
			method: "delete",
			table: "copy_bill_%1_tb"
		}, {
			method: "delete",
			table: "copy_%1_tb"
		}, {
			method: "delete",
			table: "transit_details_%1_tb"
		}, {
			method: "delete",
			table: "transit_post_bill_%1_tb"
		}, {
			method: "delete",
			table: "transit_bill_%1_tb"
		}, {
			method: "delete",
			table: "transit_%1_tb"
		}, {
			method: "delete",
			table: "transit_usehistory_%1_tb"
		}, {
			method: "delete",
			table: "iccard_history_%1_tb"
		}, {
			method: "delete",
			table: "iccard_%1_tb"
		}, {
			method: "delete",
			table: "iccard_bill_%1_tb"
		}, {
			method: "delete",
			table: "iccard_post_bill_%1_tb"
		}, {
			method: "delete",
			table: "ev_post_bill_%1_tb"
		}, {
			method: "delete",
			table: "ev_bill_%1_tb"
		}, {
			method: "delete",
			table: "ev_details_%1_tb"
		}, {
			method: "delete",
			table: "ev_usehistory_%1_tb"
		}, {
			method: "delete",
			table: "ev_%1_tb"
		}, {
			method: "delete",
			table: "summary_bill_%1_tb"
		}, {
			method: "delete",
			table: "summary_tel_bill_%1_tb"
		}, {
			method: "delete",
			table: "extension_tel_%1_tb"
		}, {
			method: "delete",
			table: "post_relation_%1_tb"
		}, {
			method: "delete",
			table: "post_%1_tb"
		}, {
			method: "delete",
			table: "billhistory_%1_tb"
		}, {
			method: "delete",
			table: "healthcare_post_bill_%1_tb"
		}, {
			method: "delete",
			table: "healthcare_bill_%1_tb"
		}, {
			method: "delete",
			table: "healthcare_%1_tb"
		}, {
			method: "delete",
			table: "healthcare_rechistory_%1_tb"
		}, {
			method: "delete",
			table: "addbill_%1_tb"
		}, {
			method: "delete",
			table: "addbill_post_bill_%1_tb"
		}, {
			method: "log",
			context: "現行を一年前にコピー"
		}, {
			method: "copy",
			from: "post_tb",
			to: "post_%1_tb"
		}, {
			method: "copy",
			from: "post_relation_tb",
			to: "post_relation_%1_tb"
		}, {
			method: "copy",
			from: "tel_tb",
			to: "tel_%1_tb"
		}, {
			method: "copy",
			from: "assets_tb",
			to: "assets_%1_tb"
		}, {
			method: "copy",
			from: "tel_rel_assets_tb",
			to: "tel_rel_assets_%1_tb"
		}, {
			method: "copy",
			from: "tel_rel_tel_tb",
			to: "tel_rel_tel_%1_tb"
		}, {
			method: "copy",
			from: "card_tb",
			to: "card_%1_tb"
		}, {
			method: "copy",
			from: "purchase_tb",
			to: "purchase_%1_tb"
		}, {
			method: "copy",
			from: "copy_tb",
			to: "copy_%1_tb"
		}, {
			method: "copy",
			from: "transit_tb",
			to: "transit_%1_tb"
		}, {
			method: "copy",
			from: "ev_post_bill_tb",
			to: "ev_post_bill_%1_tb"
		}, {
			method: "copy",
			from: "ev_bill_tb",
			to: "ev_bill_%1_tb"
		}, {
			method: "copy",
			from: "ev_details_tb",
			to: "ev_details_%1_tb"
		}, {
			method: "copy",
			from: "ev_usehistory_tb",
			to: "ev_usehistory_%1_tb"
		}, {
			method: "copy",
			from: "ev_tb",
			to: "ev_%1_tb"
		}, {
			method: "copy",
			from: "healthcare_tb",
			to: "healthcare_%1_tb"
		}, {
			method: "copy",
			from: "extension_tel_tb",
			to: "extension_tel_%1_tb"
		}, {
			method: "log",
			context: "現行を削除"
		}, {
			method: "delete",
			table: "ev_post_bill_tb"
		}, {
			method: "delete",
			table: "ev_bill_tb"
		}, {
			method: "delete",
			table: "ev_details_tb"
		}, {
			method: "delete",
			table: "ev_usehistory_tb"
		}];
		var A_param_other:any = [{
			method: "log",
			context: "削除部署・電話を復活"
		}, {
			method: "restore_tel"
		}, {
			method: "log",
			context: "ETC削除復活・削除"
		}, {
			method: "restore_card"
		}, {
			method: "log",
			context: "購買削除復活・削除"
		}, {
			method: "restore_purchase"
		}, {
			method: "log",
			context: "コピー削除復活・削除"
		}, {
			method: "restore_copy"
		}, {
			method: "log",
			context: "運送削除復活・削除"
		}, {
			method: "restore_transit"
		}, {
			method: "log",
			context: "交通費削除復活・削除"
		}, {
			method: "restore_iccard"
		}, {
			method: "log",
			context: "EV削除復活・削除"
		}, {
			method: "restore_ev"
		}, {
			method: "log",
			context: "資産削除復活・削除"
		}, {
			method: "restore_healthcare"
		}, {
			method: "log",
			context: "ヘルスケア復活・削除"
		}, {
			method: "restore_assets"
		}, {
			method: "log",
			context: "シミュレーション保存条件削除"
		}, {
			method: "delete_sim"
		}, {
			method: "log",
			context: "前月の顧客単位統計情報のコピー"
		}, {
			method: "copy_trend"
		}];
		this.m_A_param = Array();
		if (this.m_is_exec_copy) for (var H_param of A_param_copy) this.m_A_param.push(H_param);
		if (this.m_is_exec_other) for (var H_param of A_param_other) this.m_A_param.push(H_param);
	}

	async begin(pactid: number, year: number, month: number) //コピーに使用するファイル名を決定する
	//来月を処理可能にする
	{
		this.m_pactid = pactid;
		this.m_year = year;
		this.m_month = month;
		this.m_filename = KCS_DIR + "/data/changeover/" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join(""); + "_" + this.m_pactid + "_" + sprintf("%04d%02d", String(this.m_year), String(this.m_month)) + "_";
		// this.m_filename = KCS_DIR + "/data/changeover/" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join(""); + "_" + this.m_pactid + "_" + sprintf("%04d%02d", String(this.m_year), String(this.m_month)) + "_" + process.pid();
		this.putError(G_SCRIPT_INFO, "作業ファイル名のプリフィックス" + this.m_filename);

		if (this.m_table_no.m_cur_year == new Date().getFullYear() && this.m_table_no.m_cur_month == new Date().getMonth()+1) {
			var y = this.m_table_no.m_cur_year;
			var m = this.m_table_no.m_cur_month;
			++m;

			if (13 == m) {
				++y;
				m = 1;
			}

			if (year == y && month == m) {
				this.m_table_no.m_cur_year = y;
				this.m_table_no.m_cur_month = m;
			}
		}

		if (this.m_pactid) {
			var table_no = this.getTableNo(year, month);
			var sql = "select postidparent,postidchild,level";
			sql += " from post_relation_tb";
			sql += " where pactid=" + this.escape(pactid);
			sql += ";";
			this.m_A_relation = await this.m_db.getHash(sql);
			this.m_toppostid = "";

			for (var rel of this.m_A_relation) {
				if (0 == rel.level) {
					this.m_toppostid = rel.postidparent;
					break;
				}
			}

			if (0 == this.m_toppostid.length) {
				this.putOperator(G_SCRIPT_WARNING, "トップの部署が無い" + `${pactid},${year},${month}`);
				return false;
			}
		}

		return true;
	}

	execute(A_param: string | { [s: string]: unknown; } | ArrayLike<unknown> | undefined|any, path: any, ext = ".delete") //一年目と二年目のテーブル連番
	//バックアップ以外の処理を行う
	//残っている削除予定ファイルを削除する
	{
		this.m_A_truncate = Array();
		var no1 = this.getTableNo(this.m_year, this.m_month);
		var no2 = this.getTableNo(this.m_year - 1, this.m_month);
		if (!(undefined !== A_param) || 0 == A_param.length) A_param = this.m_A_param;

		if (this.m_is_save) //copy専用の接続先
			{
				this.putError(G_SCRIPT_INFO, "テーブルのバックアップ実行/" + (this.m_dsn_copy.length ? "pg_poolのクラスタに接続" : "通常の接続先"));
				var O_db_copy: ScriptDB | undefined = this.m_db;

				if (this.m_dsn_copy.length) {
					O_db_copy = new ScriptDB(this.m_listener, this.m_dsn_copy);
					O_db_copy.begin();
				}

				for (var param of A_param) {
					switch (param.method) {
						case "delete":
						case "backup":
							var table = this.replace(param.table, no1, no2);
							var file = table;
							if (undefined !== param.file) file = param.file;
							file = file + ext;
							if (!this.backup(table, file, O_db_copy)) return false;
							break;
					}
				}

				if (this.m_dsn_copy.length) {
					O_db_copy.rollback();
				}

				O_db_copy = undefined;
			} else this.putError(G_SCRIPT_INFO, "テーブルのバックアップ行わず");

		for (var param of A_param) {
			switch (param.method) {
				case "copy":
					if (!this.truncate()) return false;
					var from = this.replace(param.from, no1, no2);
					var to = this.replace(param.to, no1, no2);
					var keys = "*";
					if (undefined !== param.keys) keys = param.keys;
					if (!this.copy(to, from, keys)) return false;
					break;

				case "delete":
					table = this.replace(param.table, no1, no2);
					if (!this.delete(table)) return false;
					break;

				case "backup":
					break;

				case "restore_tel":
					if (!this.restore_tel()) return false;
					break;

				case "restore_card":
					if (!this.restore_common(String(this.m_pactid), no1, this.m_year, this.m_month, "card_tb", "card_%X_tb", "deleted_date")) return false;
					break;

				case "restore_purchase":
					if (!this.restore_common(String(this.m_pactid), no1, this.m_year, this.m_month, "purchase_tb", "purchase_%X_tb", "delete_date")) return false;
					break;

				case "restore_copy":
					if (!this.restore_common(String(this.m_pactid), no1, this.m_year, this.m_month, "copy_tb", "copy_%X_tb", "delete_date")) return false;
					break;

				case "restore_transit":
					if (!this.restore_common(String(this.m_pactid), no1, this.m_year, this.m_month, "transit_tb", "transit_%X_tb", "deletedate")) return false;
					break;

				case "restore_iccard":
					if (!this.restore_iccard(this.m_pactid, no1, this.m_year, this.m_month)) return false;
					if (!this.restore_common(String(this.m_pactid), no1, this.m_year, this.m_month, "iccard_tb", "iccard_%X_tb", "fixdate", "delflg")) return false;
					break;

				case "restore_ev":
					if (!this.restore_common(String(this.m_pactid), no1, this.m_year, this.m_month, "ev_tb", "ev_%X_tb", "delete_date")) return false;
					break;

				case "restore_healthcare":
					if (!this.restore_common(String(this.m_pactid), no1, this.m_year, this.m_month, "healthcare_tb", "healthcare_%X_tb", "deletedate")) return false;
					break;

				case "restore_assets":
					if (!this.restore_common(String(this.m_pactid), no1, this.m_year, this.m_month, "assets_tb", "assets_%X_tb", "delete_date")) return false;
					if (!this.restore_assets(this.m_pactid, this.m_year, this.m_month, path)) return false;
					break;

				case "log":
					var ctx = param.context;
					var type = G_SCRIPT_DEBUG;
					if (undefined !== param.type) type = param.type;
					this.putError(type, ctx + "(" + this.m_pactid + "," + this.m_year + "," + this.m_month + ")");
					break;

				case "delete_sim":
					if (!this.delete_sim(this.m_pactid, this.m_year, this.m_month, path, ext)) return false;
					break;

				case "copy_trend":
					if (!this.copy_trend(this.m_pactid, this.m_year, this.m_month, no1)) return false;
					break;

				default:
					this.putError(G_SCRIPT_ERROR, "未定義動作種別" + param.method + "(" + this.m_pactid + "," + this.m_year + "," + this.m_month + ")");
					return false;
			}
		}

		if (!this.truncate()) return false;
		return true;
	}

	end() {
		return true;
	}

	replace(vars: any, no1: any, no2: any) {
// 2022cvt_020
		vars = vars.replace("%1" ,no1);
		// vars = str_replace("%1", no1, vars);
// 2022cvt_020
		vars = vars.replace("%2" ,no2);
		return vars;
	}

	backup(table_name: string, fname: string | any[], O_db: { query: (arg0: string) => void; }) {
		if (fname.length) //copy文を使って高速にコピーする
			{
				var sql = "copy (select * from " + table_name;
				if (this.m_pactid) sql += " where pactid=" + this.escape(this.m_pactid);
				sql += ") to '" + this.m_filename + fname + "' ";
				sql += ";";
				O_db.query(sql);
			}

		return true;
	}

	delete(table_name: string) {
		if (this.m_pactid) {
			var sql = "delete from " + table_name + " where pactid=" + this.escape(this.m_pactid);
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		} else //削除予定リストに追加する
			{
				this.m_A_truncate.push(table_name);
			}

		return true;
	}

	truncate() {
		if (!this.m_A_truncate.length) return true;
		var sql = "truncate " + this.m_A_truncate.join(",");
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		this.m_A_truncate = Array();
		return true;
	}

	copy(to: any, from: any, keys: string) //従来型のコピーを行う
	{
		var sql = `insert into ${to}`;
		if (keys!="*") sql += `(${keys})`;
		sql += ` select ${keys} from ${from}`;
		if (this.m_pactid) sql += " where pactid=" + this.escape(this.m_pactid);
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	async restore_tel() //電話削除と部署削除の情報を読み出す
	//削除された部署
	//削除された電話
	//削除された電話に対してループ
	{
		var sql = "select date,status,postid,postname,telno,carid,postidaft";
		sql += " from change_post_tb";
		sql += " where date<'" + this.m_year + "-" + this.m_month + "-1'";
		var month2 = this.m_month;
		var year2 = this.m_year;
		--month2;

		if (0 == month2) {
			month2 = 12;
			--year2;
		}

		sql += " and date>='" + year2 + "-" + month2 + "-1'";
		sql += " and (status='DP' or status='DT')";
		sql += " and pactid=" + this.escape(this.m_pactid);
		sql += " order by date desc";
		sql += ";";
		var result = await this.m_db.getHash(sql);
		var A_post = Array();
		var A_tel = Array();

		for (var line of result) {
			if (0 ==  line.status.localeCompare("DT")) A_tel.push({
				date: line.date,
				postid: line.postid,	
				telno: line.telno,
				carid: line.carid
			});else {
				if (line.postid == line.postidaft) {
					this.putError(G_SCRIPT_INFO, "削除部署と親部署が同一" + this.m_pactid + "/" + line.postid + "/" + this.m_year + "/" + this.m_month);
					continue;
				}

				A_post.push({
					date: line.date,
					postid: line.postid,
					postidparent: line.postidaft,
					postname: line.postname
				});
			}
		}

		var table_no = this.getTableNo(this.m_year, this.m_month);

		for (var tel of A_tel) {
			sql = "select count(*) from tel_" + table_no + "_tb";
			sql += " where pactid=" + this.escape(this.m_pactid);
			if (tel.carid.length) sql += " and carid=" + this.escape(tel.carid);
			sql += " and telno='" + this.escape(tel.telno) + "'";
			sql += ";";
			const sql_dt = await this.m_db.getOne(sql);
			if (0 < sql_dt) {
				this.putError(G_SCRIPT_INFO, "電話番号復活済み" + this.m_pactid + "/" + tel.carid + "/" + tel.telno);
				continue;
			}

			if (!this.restorePost(tel.postid, A_post)) return false;
			if (!this.insertTel(tel.postid, tel.carid, tel.telno)) return false;
		}

		return true;
	}

	async restorePost(postid: string, A_post: any[]) //既に部署があるか確認
	{
		var table_no = this.getTableNo(this.m_year, this.m_month);
		var sql = "select count(*) from post_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(this.m_pactid);
		sql += " and postid=" + this.escape(postid);
		sql += ";";
		const sql_dt = await this.m_db.getOne(sql);
		if (0 < sql_dt) {
			this.putError(G_SCRIPT_INFO, "部署復活済み" + this.m_pactid + "/" + postid);
			return true;
		}

		var A_route = Array();
		var rval = this.connectPost(A_route, postid, A_post, 0);

		if (!(undefined !== rval)) //既存部署にたどり着かなかったので、電話は親部署に追加する
			{
				this.putError(G_SCRIPT_INFO, "復活部署がつながらなかった" + `(${this.m_pactid},${this.m_year},${this.m_month})` + `/${postid}`);
				postid = this.m_toppostid;
				return true;
			}

		for (var route of A_route) {
			if (!this.insertPost(table_no, route.postid, route.postidparent, route.level, route.postname)) return false;
		}

		return true;
	}

	connectPost(A_route: any[], postid: any, A_post: any, level: number):any //削除情報に部署がなかった
	{
		if (128 <= level) return undefined;

		for (var post of A_post) //既存部署につながらなければnull
		{
			if (post.postid != postid) continue;
			var parent = post.postidparent;
			var postname = post.postname;
			var match:any = undefined;

			for (var rel of this.m_A_relation) {
				if (parent == rel.postidchild) {
					match = rel;
					break;
				}
			}

			if (undefined !== match) {
				A_route.push({
					postid: postid,
					postidparent: parent,
					level: match.level + 1,
					postname: postname
				});
				return match.level + 1;
			}

			var rval = this.connectPost(A_route, parent, A_post, level + 1);

			if (undefined !== rval) {
				A_route.push({
					postid: postid,
					postidparent: parent,
					level: rval + 1,
					postname: postname
				});
				return rval + 1;
			}
		}

		return undefined;
	}

	async insertPost(table_no: string, postid: string, postidparent: string, level: string, postname: string) //既に部署があるか確認
	//部署を復活
	//部署連結を復活
	{
		var sql = "select count(*) from post_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(this.m_pactid);
		sql += " and postid=" + this.escape(postid);
		sql += ";";
		const sql_dt = await this.m_db.getOne(sql);
		if (0 < sql_dt) {
			this.putError(G_SCRIPT_INFO, "部署復活済み" + this.m_pactid + "/" + postid);
			return true;
		}

		sql = "select *";
		sql += " from post_deleted_tb";
		sql += " where pactid=" + this.escape(this.m_pactid);
		sql += " and postid=" + this.escape(postid);
		var month2 = this.m_month;
		var year2 = this.m_year;
		--month2;

		if (0 == month2) {
			month2 = 12;
			--year2;
		}

		sql += " and fixdate<'" + this.m_year + "-" + this.m_month + "-1'";
		sql += " and fixdate>='" + year2 + "-" + month2 + "-1'";
		sql += " order by fixdate desc";
		sql += ";";
		var result = await this.m_db.getHash(sql);

		if (0 < result.length) //post_deleted_tbの情報を挿入する
			{
				sql = "insert into post_" + table_no + "_tb";
				sql += " select * from post_deleted_tb";
				sql += " where pactid=" + this.escape(this.m_pactid);
				sql += " and postid=" + this.escape(postid);
				month2 = this.m_month;
				year2 = this.m_year;
				--month2;

				if (0 == month2) {
					month2 = 12;
					--year2;
				}

				sql += " and fixdate<'" + this.m_year + "-" + this.m_month + "-1'";
				sql += " and fixdate>='" + year2 + "-" + month2 + "-1'";
				sql += " order by fixdate desc limit 1";
			} else //デフォルトの内容を挿入する
			{
				sql = "insert into post_" + table_no + "_tb";
				sql += "(pactid,postid,";
				sql += "userpostid,postname,recdate,fixdate)values(";
				sql += this.escape(this.m_pactid);
				sql += "," + this.escape(postid);
				sql += ",'','" + this.escape(postname) + "'";
				sql += ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
				sql += ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
				sql += ");";
			}

		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		sql = "insert into post_relation_" + table_no + "_tb";
		sql += "(pactid,postidparent,postidchild,level)values";
		sql += "(" + this.escape(this.m_pactid);
		sql += "," + this.escape(postidparent);
		sql += "," + this.escape(postid);
		sql += "," + this.escape(level);
		sql += ");";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		this.putError(G_SCRIPT_INFO, "部署復活" + this.m_pactid + "/" + postid + "/" + postidparent + "/" + level);
		return true;
	}

	async insertTel(postid: string, carid: string | any[], telno: string) //既に電話があるか確認
	{
		var table_no = this.getTableNo(this.m_year, this.m_month);
		var sql = "select count(*) from tel_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(this.m_pactid);
		if (carid.length) sql += " and carid=" + this.escape(carid);
		sql += " and telno='" + this.escape(telno) + "'";
		sql += ";";
		const sql_dt = await this.m_db.getOne(sql);
		if (0 < sql_dt) {
			this.putError(G_SCRIPT_INFO, "電話復活済み" + this.m_pactid + "/" + postid + "/" + carid + "/" + telno);
			// this.putError(G_SCRIPT_INFO, "電話復活済み" + this.m_pactid + "/" + postid + "/" + carid + "/" + this.telno);
			return true;
		}

		sql = "select * from tel_deleted_tb";
		sql += " where pactid=" + this.escape(this.m_pactid);
		sql += " and postid=" + this.escape(postid);
		if (carid.length) sql += " and carid=" + this.escape(carid);
		sql += " and telno='" + this.escape(telno) + "'";
		var month2 = this.m_month;
		var year2 = this.m_year;
		--month2;

		if (0 == month2) {
			month2 = 12;
			--year2;
		}

		sql += " and fixdate<'" + this.m_year + "-" + this.m_month + "-1'";
		sql += " and fixdate>='" + year2 + "-" + month2 + "-1'";
		sql += " order by fixdate desc";
		var result = await this.m_db.getHash(sql);

		if (0 < result.length) {
			sql = "insert into tel_" + table_no + "_tb";
			sql += " select * from tel_deleted_tb";
			sql += " where pactid=" + this.escape(this.m_pactid);
			sql += " and postid=" + this.escape(postid);
			if (carid.length) sql += " and carid=" + this.escape(carid);
			sql += " and telno='" + this.escape(telno) + "'";
			sql += " and fixdate<'" + this.m_year + "-" + this.m_month + "-1'";
			sql += " and fixdate>='" + year2 + "-" + month2 + "-1'";
			sql += " order by fixdate desc limit 1";
		} else {
			var telno_view = telno;

			if (11 == telno_view.length) {
				telno_view = telno_view.substr(0, 3) + "-" + telno_view.substr(3, 4) + "-" + telno_view.substr(7, 4);
			}

			sql = "insert into tel_" + table_no + "_tb";
			sql += "(pactid,postid,telno,telno_view,carid,arid,cirid";
			sql += ",recdate,fixdate)values";
			sql += "(" + this.escape(this.m_pactid);
			sql += "," + this.escape(postid);
			sql += ",'" + this.escape(telno) + "'";
			sql += ",'" + this.escape(telno_view) + "'";
			if (carid.length) sql += "," + this.escape(carid);else sql += "," + this.escape(G_CARRIER_UNKNOWN);
			sql += "," + G_AREA_UNKNOWN;
			sql += "," + G_CIRCUIT_UNKNOWN;
			sql += ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
			sql += ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "'";
			sql += ");";
		}

		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		this.putError(G_SCRIPT_INFO, "電話復活" + this.m_pactid + "/" + postid + "/" + carid + "/" + telno);
		return true;
	}

	async restore_assets(pactid: number, year: number, month: number, path: string) //assets_X_tbとtel_rel_assets_X_tbへの追加の準備をする
	//部署削除の情報を読み出す
	//削除された部署
	//期間内の情報をassets_deleted_tbから読み出す
	//期間内の情報をtel_rel_assets_deleted_tbから読み出す
	//(main_flgがtrueのみ)
	//-------------------------------------------------------------------
	//削除された資産に対してループ
	{
		var table_no = this.getTableNo(this.m_year, this.m_month);
		var O_ins_assets = new TableInserter(this.m_listener, this.m_db, path + "assets_" + table_no + "_tb.insert", true);
		var O_ins_rel = new TableInserter(this.m_listener, this.m_db, path + "tel_rel_assets_" + table_no + "_tb.insert", true);

		if (!O_ins_assets.begin("assets_" + table_no + "_tb")) {
			this.putError(G_SCRIPT_WARNING, "assets_X_tb保存準備失敗");
			return false;
		}

		if (!O_ins_rel.begin("tel_rel_assets_" + table_no + "_tb")) {
			this.putError(G_SCRIPT_WARNING, "tel_rel_assets_X_tb保存準備失敗");
			return false;
		}

		var last_year:number = year;
		var last_month:number = month;
		--last_month;

		if (0 == last_month) {
			last_month = 12;
			--last_year;
		}

		// var begin = date("Y-m-d", mktime(0, 0, 0, last_month, 1, last_year));
		var begin = new Date(last_year, last_month, 1);
		// var end = date("Y-m-d", mktime(0, 0, 0, month, 1, year));
		var end = new Date(year, month, 1);
		var sql = "select date,postid,postname,telno,carid,postidaft";
		sql += " from change_post_tb";
		sql += " where date<'" + year + "-" + month + "-1'";
		var month2 = month;
		var year2 = year;
		--month2;

		if (0 == month2) {
			month2 = 12;
			--year2;
		}

		sql += " and date>='" + year2 + "-" + month2 + "-1'";
		sql += " and status='DP'";
		sql += " and pactid=" + this.escape(pactid);
		sql += " order by date desc";
		sql += ";";
		var result = await this.m_db.getHash(sql);
		var A_post = Array();

		for (var line of result) {
			if (line.postid == line.postidaft) {
				this.putError(G_SCRIPT_INFO, "削除部署と親部署が同一" + pactid + "/" + line.postid + "/" + year + "/" + month);
				continue;
			}

			A_post.push({
				date: line.date,
				postid: line.postid,
				postidparent: line.postidaft,
				postname: line.postname
			});
		}

		sql = "select * from assets_deleted_tb" + " where pactid=" + this.escape(pactid) + " and fixdate is not null" + " and fixdate>='" + begin + "'" + " and fixdate<'" + end + "'" + " order by fixdate desc" + ";";
		var A_assets = await this.m_db.getHash(sql);
		var A_assets_ready_id = Array();
		var A_assets_ready_no = Array();
		sql = "select * from tel_rel_assets_deleted_tb" + " where pactid=" + this.escape(pactid) + " and main_flg=true" + " and fixdate is not null" + " and fixdate>='" + begin + "'" + " and fixdate<'" + end + "'" + " order by fixdate desc" + ";";
		var A_rel = await this.m_db.getHash(sql);
		var A_rel_ready = Array();

		for (var H_assets of A_assets) //その資産が復活済みでないか検査する
		{
			var assetsno_is_null = !(undefined !== H_assets.assetsno);
			var assetsno = undefined !== H_assets.assetsno ? H_assets.assetsno : "";
			var sql_id = "select count(*) from assets_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and assetsid=" + H_assets.assetsid + ";";
			var sql_no = "select count(*) from assets_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and assetsno='" + this.escape(assetsno) + "'" + " and assetstypeid=" + this.escape(H_assets.assetstypeid) + ";";
			var is_assets_ready = false;
			const sql_dt = await this.m_db.getOne(sql_id);
			if (0 < sql_dt) //復活済みなら処理しない(pactidとassetsid)
				{
					this.putError(G_SCRIPT_INFO, "既に同じ資産がある(id)(assetsid)" + "/pactid:=" + pactid + "/assetsid:=" + H_assets.assetsid);
					is_assets_ready = true;
				} else if (!assetsno_is_null && 0 < sql_dt) //復活済みなら処理しない(pactidとassetsnoとassetstypeid)
				//ただし、assetsnoがNULLなら処理する
				//assetsnoが空文字列なら、NULLではないのと同じ扱い
				{
					this.putError(G_SCRIPT_INFO, "既に同じ資産がある(no,type)(assetsno,assetstypeid)" + "/pactid:=" + pactid + "/assetsid:=" + H_assets.assetsid + "/assetsno:=" + assetsno + "/assetstypeid:=" + H_assets.assetstypeid);
				} else //資産を復活する
				//復活する資産が属する部署を復活させる
				//すでに追加済みでなければ、資産情報を追加する
				{
					var postid = H_assets.postid;
					if (!this.restorePost(postid, A_post)) return false;
					if (!postid.length) postid = this.m_toppostid;
					H_assets.postid = postid;
					var key_id = H_assets.pactid + "," + H_assets.assetsid;

					if (-1 !== A_assets_ready_id.indexOf(key_id)) {
						this.putError(G_SCRIPT_INFO, "既に同じ資産がassets_deleted_tbにあった(assetsid)" + "/pactid:=" + pactid + "/assetsid:=" + H_assets.assetsid);
					} else {
						var key_no = H_assets.pactid + "," + assetsno + "," + H_assets.assetstypeid;

						if (!assetsno_is_null && -1 !== A_assets_ready_no.indexOf(key_no)) //assetsnoがNULLではなく、
							//同じ資産が複数個assets_deleted_tbにあれば、
							//新しい方だけ復活する
							//assetsnoが空文字列なら、NULLではないのと同じ扱い
							{
								this.putError(G_SCRIPT_INFO, "既に同じ資産がassets_deleted_tbにあった(assetsno)" + "/pactid:=" + pactid + "/assetsid:=" + H_assets.assetsid + "/assetsno:=" + assetsno + "/assetstypeid:=" + H_assets.assetstypeid);
							} else //assetsnoがNULLでなければ、
							//重複検査のためにキーを保存する
							{
								A_assets_ready_id.push(key_id);
								if (!assetsno_is_null) A_assets_ready_no.push(key_no);
								var H_temp:any = Array();

								for (var key in H_assets) {
									var value = H_assets[key];

									if (value.length && (value.toUpperCase() === "\\n".toUpperCase())) //20180903追加 古いマックから直接SQLを流した場合の対処
										{
// 2022cvt_020
											var value:any = value.replace("\r\n" , "LFkaigyoLF");
// 2022cvt_020
											var value:any = value.replace("\n" , "LFkaigyoLF");
// 2022cvt_020
											var value:any = value.replace("\r" , "LFkaigyoLF");
										}

									H_temp[key] = value;
								}

								var H_assets = H_temp;
								H_assets.delete_flg = "false";

								if (!O_ins_assets.insert(H_assets)) {
									this.putError(G_SCRIPT_WARNING, "assets_X_tb追加処理失敗");
									return false;
								}

								this.putError(G_SCRIPT_INFO, "assets_" + table_no + "_tbに資産追加/pactid:=" + pactid + "/assetsid:=" + H_assets.assetsid + "/postid:=" + postid + "/assetstypeid:=" + H_assets.assetstypeid + "/assetsno:=" + assetsno + (assetsno_is_null ? "(NULL)" : ""));
								is_assets_ready = true;
							}
					}
				}
		}

		if (!O_ins_assets.end()) {
			this.putError(G_SCRIPT_WARNING, "assets_X_tb保存処理失敗");
			return false;
		}

		for (var H_rel of A_rel) //該当の電話がなければ無視する
		{
			sql = "select count(*) from tel_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and telno='" + this.escape(H_rel.telno) + "'" + " and carid=" + this.escape(H_rel.carid) + ";";
			const sql_dt = await this.m_db.getOne(sql);
			if (0 == sql_dt) {
				this.putError(G_SCRIPT_INFO, "連携先の電話がない" + "/pactid:=" + pactid + "/assetsid:=" + H_rel.assetsid + "/telno:=" + H_rel.telno + "/carid:=" + H_rel.carid);
				continue;
			}

			sql = "select count(*) from assets_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and assetsid=" + this.escape(H_rel.assetsid);

			if (0 == sql_dt) {
				this.putError(G_SCRIPT_INFO, "連携先の資産がない" + "/pactid:=" + pactid + "/assetsid:=" + H_rel.assetsid + "/telno:=" + H_rel.telno + "/carid:=" + H_rel.carid);
				continue;
			}

			sql = "select count(*) from tel_rel_assets_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and telno='" + this.escape(H_rel.telno) + "'" + " and carid=" + this.escape(H_rel.carid) + " and main_flg=true" + ";";

			if (0 < sql_dt) {
				this.putError(G_SCRIPT_INFO, "連係情報復活済み" + pactid + "/" + H_rel.assetsid + "/" + H_rel.telno + "/" + H_rel.carid);
				continue;
			}

			var key = H_rel.pactid + "," + H_rel.telno + "," + H_rel.carid;

			if (-1 !== A_rel_ready.indexOf(key)) //連係情報は既にinsert済み
				{} else {
				A_rel_ready.push(key);

				if (!O_ins_rel.insert(H_rel)) {
					this.putError(G_SCRIPT_WARNING, "tel_rel_assets_X_tb追加処理失敗");
					return false;
				}

				this.putError(G_SCRIPT_INFO, "tel_rel_assets_" + table_no + "tel_rel_assets_X_tb追加処理失敗/pactid:=" + pactid + "/telno:=" + H_rel.telno + "/carid:=" + H_rel.carid + "/assetsid:=" + H_rel.assetsid);
			}
		}

		if (!O_ins_rel.end()) {
			this.putError(G_SCRIPT_WARNING, "tel_rel_assets_X_tb保存処理失敗");
			return false;
		}

		return true;
	}

	restore_common(pactid: string, no: string, year: number, month: number, xxx_tb: string, xxx_X_tb: string, deleted_date: string, delete_flg = "delete_flg") //前月を求める
	//SQLのwhere節を作る
	//xxx_%1_tbの削除レコードの削除フラグを消す
	//xxx_tbの削除レコードを削除する
	{
		var begin = "";
		var end = "";
		this.get_begin_end(begin, end, year, month);
		var sql_where = " where " + delete_flg + "=true";
		if (pactid.length) sql_where += " and pactid=" + pactid;
		sql_where += " and " + deleted_date + " is not null";
		sql_where += " and " + deleted_date + ">='" + begin + "'";
		sql_where += " and " + deleted_date + "<'" + end + "'";
// 2022cvt_020
		var name = xxx_X_tb.replace("X" , no);
		var sql = "update " + name + " set " + delete_flg + "=false";
		sql += sql_where;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		this.putError(G_SCRIPT_INFO, name + "の削除フラグを落とす" + pactid + "/" + no + "/" + begin + "/" + end);
		name = xxx_tb;
		sql = "delete from " + name;
		sql += sql_where;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		this.putError(G_SCRIPT_INFO, name + "の削除フラグレコードを削除" + pactid + "/" + no + "/" + begin + "/" + end);
		return true;
	}

	get_begin_end(begin: any, end: any, year: any, month: any) //前月を求める
	{
		var last_year = year;
		var last_month = month;
		--last_month;

		if (0 == last_month) {
			last_month = 12;
			--last_year;
		}

		begin = new Date(last_year, last_month, 1);
		end = new Date(year, month, 1);
	}

	restore_iccard(pactid: number, no: any, year: number, month: number) //前月を求める
	//SQL文を作る
	{
		this.putError(G_SCRIPT_INFO, "iccard_tbのdelflgがtrueのカードの明細を、" + "iccard_history_tbから削除する");
		var begin = "";
		var end = "";
		this.get_begin_end(begin, end, year, month);
		var sql = "delete from iccard_history_tb" + " where pactid=" + pactid + " and exists (" + " select * from iccard_tb" + " where iccard_history_tb.pactid=iccard_tb.pactid" + " and iccard_history_tb.iccardcoid=iccard_tb.iccardcoid" + " and iccard_history_tb.iccardid=iccard_tb.iccardid" + " and iccard_history_tb.handflg=iccard_tb.handflg" + " and iccard_tb.delflg=true" + " and iccard_tb.fixdate" + ">='" + begin + "'" + " and iccard_tb.fixdate" + "<'" + end + "'" + " )" + ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	delete_sim(pactid: number, year: number, month: string | number, path: string, ext: string) //一年前にする
	//sim_detailsから削除する
	//sim_index_tbから削除する
	{
		--year;
		var sql_where = " where pactid=" + pactid;
		sql_where += " and (";
		sql_where += "year<" + year;
		sql_where += " or (";
		sql_where += "year=" + year;
		sql_where += " and month<" + month;
		sql_where += ")";
		sql_where += ")";
		sql_where += " and is_save=true";
		var sql_from = " from sim_details_tb where simid in (" + "select simid from sim_index_tb" + sql_where + ")";
		var fname = path + "sim_details_tb" + ext;

		if (!this.m_db.backup(fname, "select *" + sql_from + ";")) {
			this.putError(G_SCRIPT_WARNING, "ファイル保存失敗(sim_details_tb)" + fname);
			return false;
		}

		var sql = "delete" + sql_from + ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		sql_from = " from sim_index_tb " + sql_where;
		fname = path + "sim_index_tb" + ext;

		if (!this.m_db.backup(fname, "select *" + sql_from + ";")) {
			this.putError(G_SCRIPT_WARNING, "ファイル保存失敗(sim_index_tb)" + fname);
			return false;
		}

		sql = "delete" + sql_from + ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	copy_trend(pactid: number, year: number, month: number, no1: string) {
		var last_year = year;
		var last_month = month;
		--last_month;

		if (0 == last_month) {
			last_month = 12;
			--last_year;
		}

		var last_no = this.getTableNo(last_year, last_month);
		var sql = "insert into trend_" + no1 + "_tb";
		sql += " select * from trend_" + last_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and length(coalesce(telno,''))=0";
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

};
