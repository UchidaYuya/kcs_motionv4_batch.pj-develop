//===========================================================================
//機能：クランプダウンロードリスト作成プロセス(ドコモ専用)
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//クランプ日次ダウンロードの権限番号
//---------------------------------------------------------------------------
//機能：クランプダウンロードリスト作成プロセス(ドコモ専用)
// error_reporting(E_ALL);// 2022cvt_011

import { G_CLAMP_ADMIN, G_CLAMP_ENV } from "../../conf/batch_setting";
import { G_LOG, G_LOG_ADMIN_DOCOMO_DB, sprintf } from "../../db_define/define";
import { ProcessDefault } from "./lib/process_base";
import { ScriptCommand } from "./lib/script_command";
import { G_CARRIER_DOCOMO, G_CLAMP_DOCOMO_BILL_TYPE, G_CLAMP_DOCOMO_COMM_TYPE, G_CLAMP_DOCOMO_INFO_TYPE, G_CLAMP_DOCOMO_TEL_TYPE, G_PHP } from "./lib/script_common";
import { ScriptDB } from "./lib/script_db";
import { G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING } from "./lib/script_log";

// 2022cvt_026
// require("lib/process_base.php");

export const G_PROCNAME_REGIST_CLAMP_DOCOMO = "regist_clamp_docomo";
export const G_OPENTIME_REGIST_CLAMP_DOCOMO = "0000,2400";
export const FNCID_CLAMP_DAILY = 87;


const { setTimeout } = require('timers/promises');
export default class ProcessRegistClampDocomo extends ProcessDefault {
	m_db_temp: any;
	ProcessDefault: any;
	constructor(procname: string, logpath: string, opentime: string) //clampweb_function_tbがrunでないのにclampweb_index_tbがrunなら警告
	{
		super(procname, logpath, opentime);

		if (global.G_dsn != global.G_dsn_temp) {
			this.m_db_temp = new ScriptDB(this.m_listener, global.G_dsn_temp);
		} else this.m_db_temp = this.m_db;

		var sql = "select count(*) from clampweb_function_tb";
		sql += " where command like '%run%'";
		sql += ";";

		if (0 == this.m_db_temp.getOne(sql)) {
			sql = "select count(*) from clampweb_index_tb";
			sql += " where coalesce(is_running,false)=true";
			sql += ";";

			if (0 < this.m_db_temp.getOne(sql)) {
				this.putError(G_SCRIPT_WARNING, "admin_docomo_web.phpが不正終了後にclear_clamptask.phpを" + "実行していない");
			}
		}

		this.m_is_skip_delflg = false;
	}

	getProcname() {
		return "クランプダウンロードリスト作成プロセス(ドコモ専用)";
	}

	begin_0() {
		if (!super.begin()) return false;
		return this.lockWeb(this.m_db_temp, "lock_regist_" + G_CLAMP_ENV);
	}

	end(status: boolean) {
		if (!this.unlockWeb(this.m_db_temp)) return false;
		return super.end(status);
	}

	beginDB() {
		this.m_db.begin();
		if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.begin();
		return true;
	}

	endDB(status: boolean) {
		if (this.m_debugflag) {
			if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.rollback();
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollbackデバッグモード");
		} else if (!status) {
			if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.rollback();
			this.m_db.rollback();
		} else {
			if (global.G_dsn != global.G_dsn_temp) this.m_db_temp.commit();
			this.m_db.commit();
		}

		return true;
	}

	async executePactid_0(pactid: number, logpath: string) //顧客情報の取得

	{
		var is_admin = G_CLAMP_ADMIN == pactid;
		var sql = "select count(*) from fnc_relation_tb where pactid=" + pactid + " and fncid=" + FNCID_CLAMP_DAILY + ";";
		var is_daily = 0 < await this.m_db.getOne(sql);
		var compname = "";
		var is_hotline = false;
		sql = "select coalesce(type,'M'),compname from pact_tb";
		sql += " where pactid=" + pactid;
		sql += ";";
		var result = await this.m_db.getAll(sql);

		if (result.length) {
			if (!result[0][0].localeCompare("H")) is_hotline = true;
			compname = result[0][1];
		}

		var A_clamp = Array();
		sql = "select clampid,clamppasswd,detailno" + ",coalesce(login_status,0) as login_status" + ",coalesce(cookie1,'') as cookie1" + ",coalesce(pin,'') as pin";
		sql += " from clamp_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " and pactid not in(";
		sql += "select pactid from pact_tb";
		sql += " where delflg=true";
		sql += ")";
		sql += " order by detailno";
		sql += ";";
		result = await this.m_db.getHash(sql);

		if (0 == result.length) {
			sql = "delete from clampweb_index_tb" + " where pactid=" + pactid;
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db_temp.query(sql);
			return true;
		}

		A_clamp = result;
		var year = this.m_year;
		var month = this.m_month;
		var limit = 4;

		for (var cnt = 0; cnt < limit; ++cnt) {
			--month;

			if (0 == month) {
				month = 12;
				--year;
			}
		}

		for (cnt = 0; cnt < limit; ++cnt) {
			++month;

			if (13 == month) {
				month = 1;
				++year;
			}

			var cur_ym = month == this.m_month && year == this.m_year;
			var is_web_only = !cur_ym;
			if (is_hotline) is_web_only = false;
			if (!this.executePactid2(pactid, logpath, is_admin, is_daily, is_hotline, compname, A_clamp, year, month, cur_ym, is_web_only)) return false;
		}

		return true;
	}

	async executePactid2(pactid: number, logpath: string, is_admin: boolean, is_daily: boolean, is_hotline: boolean, compname: string, A_clamp: any[], year: number, month: number, cur_ym: boolean, is_web_only: boolean) //detailnoに対してループ
	{
		if (!is_web_only) //部署情報が無ければchangeover
			{
				var sql = "select count(*) from post_" + this.m_table_no.get(year, month) + "_tb where pactid=" + pactid + ";";

				if (0 == await this.m_db.getOne(sql)) //changeover実行
					{
						var proc = new ScriptCommand(this.m_listener, false);
						var arg_changeover = [{
							key: "m",
							value: 0
						}, {
							key: "l",
							value: logpath
						}, {
							key: "k",
							value: 0
						}, {
							key: "p",
							value: pactid
						}, {
							key: "y",
							value: sprintf("%04d%02d", String(year), String(month))
						}, {
							key: "r",
							value: this.m_repeatflag ? 1 : 0
						}, {
							key: "d",
							value: this.m_debugflag ? 1 : 0
						}, {
							key: "x",
							value: 0
						}];
						this.putError(G_SCRIPT_INFO, "changeover実行" + pactid + "/" + year + "/" + month);
						if (!proc.execute(G_PHP + " changeover.php", arg_changeover, Array())) return false;
						setTimeout(3000);
					}
			}

		var A_type = G_CLAMP_DOCOMO_TEL_TYPE.split(",");
		var temp = G_CLAMP_DOCOMO_COMM_TYPE.split(",");


		for (var type of Object.values(temp)) A_type.push(type);

		temp = G_CLAMP_DOCOMO_INFO_TYPE.split(",");

		for (var type of Object.values(temp)) A_type.push(type);

		temp = G_CLAMP_DOCOMO_BILL_TYPE.split(",");


		for (var type of Object.values(temp)) A_type.push(type);

		for (var H_clamp of A_clamp) //dbからwebへのコピーのみ実行するなら、
		{
			var id = H_clamp.clampid;
			var password = H_clamp.clamppasswd;
			var detailno = H_clamp.detailno;
			var login_status = H_clamp.login_status;
			var cookie1 = H_clamp.cookie1;
			var pin = H_clamp.pin;

			if (!is_web_only) //clampdb_index_tbへのダウンロードリストの作成
				{
					sql = "select count(*) from clampdb_index_tb" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + ";";

					if (0 == await this.m_db.getOne(sql)) {
						sql = "insert into clampdb_index_tb" + "(pactid,detailno,year,month,fixdate)" + "values(" + pactid + "," + detailno + "," + year + "," + month + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + ")" + ";";
						this.putError(G_SCRIPT_SQL, sql);
						this.m_db.query(sql);
					}

					for (var type of Object.values(A_type)) //clampdb_type_tbへのダウンロードリストの作成
					{
						sql = "select count(*) from clampdb_type_tb" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and type='" + this.m_db.escape(type) + "'" + ";";

						if (0 == await this.m_db.getOne(sql)) {
							sql = "insert into clampdb_type_tb" + "(pactid,detailno,year," + "month,type,is_ready,fixdate)" + "values(" + pactid + "," + detailno + "," + year + "," + month + ",'" + this.m_db.escape(type) + "'" + ",false" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + ")" + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db.query(sql);
						}
					}
				}

			sql = "select type from clampdb_type_tb" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and coalesce(is_ready,false)=false" + ";";
			var result = await this.m_db.getAll(sql);
			var A_rectype = Array();

			for (var H_line of result) A_rectype.push(H_line[0]);

			if (cur_ym) {
				sql = "select clampid,clamppassword" + ",coalesce(cookie1,'') as cookie1" + ",coalesce(pin,'') as pin" + ",(case when coalesce(is_fail,false)=false then 0" + " else 1 end) as is_fail" + ",(case when coalesce(is_daily,false)=false then 0" + " else 1 end) as is_daily" + ",(case when coalesce(is_admin,false)=false then 0" + " else 1 end) as is_admin" + ",(case when coalesce(is_hotline,false)=false then 0" + " else 1 end) as is_hotline" + " from clampweb_index_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + ";";
				var A_result = this.m_db_temp.getHash(sql);

				if (0 == A_result.length) //レコードを追加する
					{
						sql = "insert into clampweb_index_tb" + "(env,pactid,detailno,cookie1,pin," + "is_hotline,is_admin,is_daily,compname" + ",clampid,clamppassword,is_try,is_running" + ",is_fail,fixdate)" + "values" + "(" + G_CLAMP_ENV + "," + pactid + "," + detailno + ",'" + this.m_db_temp.escape(cookie1) + "'" + ",'" + this.m_db_temp.escape(pin) + "'" + "," + (is_hotline ? "true" : "false") + "," + (is_admin ? "true" : "false") + "," + (is_daily ? "true" : "false") + ",'" + this.m_db_temp.escape(compname) + "'" + ",'" + this.m_db_temp.escape(id) + "'" + ",'" + this.m_db_temp.escape(password) + "'" + ",false,false" + "," + (2 == login_status ? "true" : "false") + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + ")" + ";";
						this.putError(G_SCRIPT_SQL, sql);
						this.m_db_temp.query(sql);
					} else {
					for (var H_result of A_result) {
						if (H_result.clamppassword.localeCompare(password) || H_result.clampid.localeCompare(id) || H_result.cookie1.localeCompare(cookie1) || H_result.pin.localeCompare(pin) || H_result.is_daily != (is_daily ? 1 : 0) || H_result.is_hotline != (is_hotline ? 1 : 0) || H_result.is_admin != (is_admin ? 1 : 0)) //IDかパスワードが違えば反映する
							{
								sql = "update clampweb_index_tb" + " set clamppassword='" + this.m_db_temp.escape(password) + "'" + ",clampid='" + this.m_db_temp.escape(id) + "'" + ",compname='" + this.m_db_temp.escape(compname) + "'" + ",cookie1='" + this.m_db_temp.escape(cookie1) + "'" + ",pin='" + this.m_db_temp.escape(pin) + "'" + ",is_hotline=" + (is_hotline ? "true" : "false") + ",is_admin=" + (is_admin ? "true" : "false") + ",is_daily=" + (is_daily ? "true" : "false") + ",fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + ",is_fail=" + (2 == login_status ? "true" : "false") + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + ";";
								this.putError(G_SCRIPT_SQL, sql);
								this.m_db_temp.query(sql);
							} else //IDとパスワードが同じなら、ログイン状態を統一する
							{
								if (0 == login_status) //DB側が未検証なので、
									//strage側の情報をDB側に反映する
									{
										sql = "update clamp_tb";
										sql += " set login_status=" + (H_result.is_fail ? 2 : 1);
										sql += " where pactid=" + pactid;
										sql += " and detailno=" + detailno;
										sql += " and carid=" + G_CARRIER_DOCOMO;
										sql += ";";
										this.putError(G_SCRIPT_SQL, sql);
										this.m_db.query(sql);
									} else if (1 == login_status) //DB側は成功なので、
									//strage側が失敗ならDB側も失敗にする
									{
										if (H_result.is_fail) {
											sql = "update clamp_tb";
											sql += " set login_status=2";
											sql += " where pactid=" + pactid;
											sql += " and detailno=" + detailno;
											sql += " and carid=" + G_CARRIER_DOCOMO;
											sql += ";";
											this.putError(G_SCRIPT_SQL, sql);
											this.m_db.query(sql);
										}
									} else //DB側は失敗なので、
									//strage側も失敗にする
									{
										sql = "update clampweb_index_tb" + " set fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + ",is_fail=true" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + ";";
										this.putError(G_SCRIPT_SQL, sql);
										this.m_db_temp.query(sql);
									}
							}
					}
				}
			}

			for (let type of A_rectype) //clampweb_type_tbへのコピー
			{
				sql = "select count(*) from clampweb_type_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and type='" + this.m_db_temp.escape(type) + "'" + ";";

				if (0 == this.m_db_temp.getOne(sql)) {
					sql = "insert into clampweb_type_tb" + "(env,pactid,detailno,year,month,type,is_ready,fixdate)" + "values(" + G_CLAMP_ENV + "," + pactid + "," + detailno + "," + year + "," + month + ",'" + this.m_db_temp.escape(type) + "'" + ",false" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + ")" + ";";
					this.putError(G_SCRIPT_SQL, sql);
					this.m_db_temp.query(sql);
				}
			}

			var H_dl = {
				type: undefined,
				db: undefined,
				web: undefined
			};
			sql = "select * from clampdb_type_tb" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and coalesce(is_ready,false)=true" + " and fixdate is not null" + " order by fixdate desc" + " limit 1" + ";";
			var H_type = await this.m_db.getHash(sql);
			if (H_type.length) H_dl.type = H_type[0].fixdate;
			sql = "select * from clampdb_ready_tb" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and dldate is not null" + " order by dldate desc" + " limit 1" + ";";
			var H_db = await this.m_db.getHash(sql);
			if (H_db.length) H_dl.db = H_db[0].dldate;
			sql = "select * from clampweb_ready_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + " and dldate is not null" + " order by dldate desc" + " limit 1" + ";";
			var H_web = this.m_db_temp.getHash(sql);
			if (H_web.length) H_dl.web = H_web[0].dldate;
			var dldate = undefined;

			for (var key in H_dl) {
				var value = H_dl[key];
				if (!(undefined !== value)) continue;
				if (undefined !== dldate && value < dldate) continue;
				dldate = value;
			}

			if (undefined !== dldate) //DB側
				{
					if (!(undefined !== H_dl.db)) //DB側に追加する
						{
							sql = "insert into clampdb_ready_tb" + "(pactid,detailno,year,month,dldate,fixdate)" + "values" + "(" + pactid + "," + detailno + "," + year + "," + month + ",'" + dldate + "'" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + ")" + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db.query(sql);
						} else if (H_dl.db < dldate) //DB側を更新する
						{
							sql = "update clampdb_ready_tb" + " set dldate='" + dldate + "'" + " ,fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + " where pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db.query(sql);
						}

					if (!(undefined !== H_dl.web)) //WEB側に追加する
						{
							sql = "insert into clampweb_ready_tb" + "(env,pactid,detailno,year,month,dldate,fixdate)" + "values" + "(" + G_CLAMP_ENV + "," + pactid + "," + detailno + "," + year + "," + month + ",'" + dldate + "'" + ",'" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + ")" + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db_temp.query(sql);
						} else if (H_dl.web < dldate) //WEB側を更新する
						{
							sql = "update clampweb_ready_tb" + " set dldate='" + dldate + "'" + " ,fixdate='" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + "'" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid + " and detailno=" + detailno + " and year=" + year + " and month=" + month + ";";
							this.putError(G_SCRIPT_SQL, sql);
							this.m_db_temp.query(sql);
						}
				}
		}

		if (cur_ym) //削除されたクランプIDをダウンロードリストから取り除く
			{
				var A_detailno = Array();

				for (let H_clamp of A_clamp) A_detailno.push(H_clamp.detailno);

				sql = "delete from clampdb_index_tb" + " where pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
				sql = "delete from clampdb_type_tb" + " where pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
				sql = "delete from clampdb_ready_tb" + " where pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
				sql = "delete from clampweb_index_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db_temp.query(sql);
				sql = "delete from clampweb_type_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db_temp.query(sql);
				sql = "delete from clampweb_ready_tb" + " where env=" + G_CLAMP_ENV + " and pactid=" + pactid;
				if (A_detailno.length) sql += " and detailno not in(" + A_detailno.join(",") + ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db_temp.query(sql);
			}

		return true;
	}

};

// checkClient(G_CLIENT_BOTH);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_DB) log = G_LOG_ADMIN_DOCOMO_DB;
var proc = new ProcessRegistClampDocomo(G_PROCNAME_REGIST_CLAMP_DOCOMO, log, G_OPENTIME_REGIST_CLAMP_DOCOMO);
if (!proc.readArgs(undefined)) throw process.exit(1);
if (!proc.execute()) throw process.exit(1);
proc.putError(G_SCRIPT_WARNING, "正常終了");
throw process.exit(0);
