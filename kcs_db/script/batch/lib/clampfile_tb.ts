import TableNo, { ScriptDB, ScriptDBAdaptor } from "../lib/script_db";
// import * as script_common from "../lib/script_common";
import { G_SCRIPT_ERROR, G_SCRIPT_SQL, ScriptLogBase } from "../lib/script_log";
import { sprintf } from "../../../db_define/define";
// const fs = require('fs');
import  fs from "fs"

//テーブル名(テーブル番号部分は%s)
//unlinkでは%sの置換が機能しなくなっている
//ラージオブジェクト保存時の拡張子
//顧客ID
//キャリアID(空文字列なら全キャリア)
//年
//月
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//テーブル名(テーブル番号部分は%s)
//ラージオブジェクト保存時の拡張子
//機能：顧客ID・年月などで初期化する
//引数：顧客ID
//キャリアID(空文字列なら全キャリア)
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：ラージオブジェクトと既存レコードをファイルに取り出す
//備考：begin～commitの中で使用する事
//引数：ファイルの保存先ディレクトリ
//返値：深刻なエラーが発生したらfalseを返す
//機能：既存のレコードを削除する
//備考：begin～commitの中で使用する事
//備考：ラージオブジェクトも削除する
//引数：年月を無視するならfalse
//返値：深刻なエラーが発生したらfalseを返す
export class ClampFileTb extends ScriptDBAdaptor {
	ScriptDBAdaptor: any;
	m_table_name: string;
	m_ext: string;
	m_pactid: any;
	m_carid: any;
	m_year!: number;
	m_month!: number;


	// ClampFileTb(listener, db, table_no, table_name, ext) {
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, table_name:string, ext: any) {
		// this.ScriptDBAdaptor(listener, db, table_no);
		super(listener, db, table_no);
		this.m_table_name = table_name;
		this.m_ext = ext;
	}

	init(pactid: any, carid: number, year: number, month: number) {
		this.m_pactid = pactid;
		this.m_carid = carid;
		this.m_year = year;
		this.m_month = month;
		return true;
	}

	async export(path: any) //既存レコードの保存
	{
// 2022cvt_015
		var no = this.getTableNo(this.m_year, this.m_month);
// 2022cvt_020
// 2022cvt_015
		// var name = str_replace("%s", no, this.m_table_name);
		var name = this.m_table_name.replace("%s", no);
// 2022cvt_015
		var sqlwhere = " where pactid=" + this.escape(this.m_pactid);
		if (this.m_carid.length) sqlwhere += " and carid=" + this.escape(this.m_carid);
		sqlwhere += " and year=" + this.escape(this.m_year);
		sqlwhere += " and month=" + this.escape(this.m_month);
// 2022cvt_016
		sqlwhere += " order by carid,type";
// 2022cvt_015
		var fname = path + name + ".delete";

		if (!this.m_db.backup(fname, "select * from " + name + sqlwhere + ";")) {
			this.putError(G_SCRIPT_ERROR, "ファイル保存失敗" + fname + "/" + sqlwhere);
			return false;
		}

// 2022cvt_016
// 2022cvt_015
		var sql = "select carid,type,fid,detailno";
		sql += " from " + name + sqlwhere;
		sql += ";";
// 2022cvt_015
		var result = await this.m_db.getHash(sql);
// 2022cvt_015
		var carid = "";
// 2022cvt_015
		var gpath = path;
// 2022cvt_015
		var count: any;
// 2022cvt_016
// 2022cvt_015
		var type = "";

// 2022cvt_015
		for (var line of (result)) {
			if (0 == line.fid.length) continue;
// 2022cvt_015
			var A_fid = line.fid.split(",");
			// if (0 == count(A_fid)) continue;
			if (0 == A_fid.length) continue;

// 2022cvt_022
			// if (strcmp(carid, line.carid)) {
			if (carid.localeCompare(line.carid)) {
				carid = line.carid;
				path = gpath + carid + "/";

				try {
					fs.mkdirSync(path)
				} catch (e) {
					this.putError(G_SCRIPT_ERROR, `フォルダ作成失敗${path}`);
					return false;
				}
				
				// if (!fs.mkdirSync(path)) {
				// 	this.putError(G_SCRIPT_ERROR, `フォルダ作成失敗${path}`);
				// 	return false;
				// }
			}

// 2022cvt_022
// 2022cvt_016
			// if (strcmp(type, line.type)) {
			if (type.localeCompare(line.type)) {
				count = 0;
// 2022cvt_016
				type = line.type;
			}

// 2022cvt_015
			for (var fid of (A_fid)) {
// 2022cvt_021
// 2022cvt_016
				// fname = path + line.type + sprintf("%d", line.detailno) + sprintf("%02d", count) + this.m_ext;
				fname = path + line.type + sprintf("%d", line.detailno) + sprintf("%02d", count) + this.m_ext;
				this.m_db.loExport(fname, fid);
				++count;
			}
		}

		return true;
	}

	async unlink(check_year = true) //yearとmonthによる置換は行わない// 2022cvt_007
	//ラージオブジェクトの削除
	//テーブルから既存のレコードの削除
	{
// 2022cvt_015
		var sqlwhere = " where pactid=" + this.escape(this.m_pactid);
		if (this.m_carid.length) sqlwhere += " and carid=" + this.escape(this.m_carid);

		if (check_year) {
			sqlwhere += " and year=" + this.escape(this.m_year);
			sqlwhere += " and month=" + this.escape(this.m_month);
		}

// 2022cvt_015
		var name = this.m_table_name;
// 2022cvt_015
		var sql = "select fid from " + name + sqlwhere;
		sql += ";";
// 2022cvt_015
		var result = await this.m_db.getHash(sql);

// 2022cvt_015
		for (var line of (result)) {
			if (0 == line.fid.length) continue;
// 2022cvt_015
			var A_fid = line.fid.split(",");

// 2022cvt_015
			for (var fid of (A_fid)) {
				this.m_db.loUnlink(fid);
			}
		}

		sql = "delete from " + name + sqlwhere + ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

};
