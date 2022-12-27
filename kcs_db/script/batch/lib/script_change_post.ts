import script_db, { ScriptDB, ScriptDBAdaptor } from "../../batch/lib/script_db";
// import * as script_common from "../../batch/lib/script_common";
import { G_SCRIPT_INFO,G_SCRIPT_WARNING, ScriptLogBase } from "../../batch/lib/script_log";
import { G_FNCID_MULTI_MT, G_FNCID_STOP_MT } from "../../batch/lib/script_common";

//---------------------------------------------------------------------------
//機能：change_post_tbから按分情報を取得する

//処理中の顧客ID
//按分停止フラグ
//複数回按分フラグ
//処理中のキャリアID
//処理中の年
//処理中の月
//そのキャリアでの、電話番号から按分情報へのハッシュ
//按分情報は、以下の内容からなるハッシュ
//delete => 削除日(無い事もある)
//move => 移動情報の配列
//移動情報は、以下の内容からなるハッシュ
//date => 移動日
//from => 元の部署ID
//to => 移動先の部署ID
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：顧客IDで初期化する
//機能：按分情報を読み出す
//引数：キャリアID(空文字列なら全キャリア)
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：按分情報を取り出す
//引数：電話番号
//その電話の所属部署(tel_X_tbから読み出した値)
//その電話の契約日(tel_X_tbから読み出した値)
//結果を返す
//その電話の存在した秒数を返す
//返値：深刻なエラーが発生したらfalseを返す
//備考：結果は、部署IDから比率へのハッシュ
//-----------------------------------------------------------------------
//以下protected
//機能：電話削除・移動を読み出す
//備考：このメソッドが作る電話移動情報では、
//同一部署間での電話移動があった場合、
//それらの二つの部署に所属したとの情報を一つにまとめない。
//返値：深刻なエラーが発生したらfalseを返す
export default class ChangePostInfo extends ScriptDBAdaptor {
	m_stop_mt: any;
	m_multi_mt: any;
	m_pactid: any;
	m_H_change: any;
	m_carid: any;
	m_year: any;
	m_month: any;
	ScriptDBAdaptor: any;
	escape: any;
	m_db!: ScriptDB;
	putError: any;
	putOperator: any;
	getTableNo: any;

	ChangePostInfo(listener: ScriptLogBase, db: ScriptDB, table_no: script_db) {
	// constructor(listener, db, table_no) {
		this.ScriptDBAdaptor(listener, db, table_no);
		// super(listener, db, table_no);
		this.m_stop_mt = false;
		this.m_multi_mt = false;
	}

	async init(pactid: any) //按分しないフラグを読み出す
	{
		this.m_pactid = pactid;
		this.m_H_change = Array();
		this.m_stop_mt = false;
// 2022cvt_015
		var sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and fncid=" + this.escape(G_FNCID_STOP_MT);
		sql += ";";
// 2022cvt_015
		var result = await this.m_db.getAll(sql);

		if (result.length && result[0].length && 0 < result[0][0]) {
			this.putError(G_SCRIPT_INFO, `按分機能使用せず(${pactid})`);
			this.m_stop_mt = true;
		}

		this.m_multi_mt = false;
		sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and fncid=" + this.escape(G_FNCID_MULTI_MT);
		sql += ";";
		result = await this.m_db.getAll(sql);

		if (result.length && result[0].length && 0 < result[0][0]) {
			if (this.m_stop_mt) {
				this.putError(G_SCRIPT_INFO, `複数按分と複数停止フラグが重複している(${pactid})按分停止`);
			} else {
				this.putError(G_SCRIPT_INFO, `複数按分(${pactid})`);
				this.m_multi_mt = true;
			}
		}

		return true;
	}

	read(carid: any, year: any, month: any) //按分しない場合はここで処理終了
	{
		if (0 == this.m_pactid.length) {
			this.putError(G_SCRIPT_WARNING, "内部エラー(顧客ID未設定)");
			return false;
		}

		this.m_carid = carid;
		this.m_year = year;
		this.m_month = month;
		this.m_H_change = Array();
		if (this.m_stop_mt) return true;
		if (!this.getChange()) return false;
		return true;
	}

	get(telno: string, telnopostid: string, contract: any, H_ratio:any, seconds: number) //正しくない値
	//按分情報は前月である
	//この電話の按分情報が無ければ処理終了
	//部署移動情報が無ければ処理終了
	//日数がゼロなら処理終了
	{
		H_ratio = {
			[telnopostid]: 1
		};
		seconds = 0;
// 2022cvt_015
		var year1 = this.m_year;
// 2022cvt_015
		var month1 = this.m_month;
		--month1;

		if (0 == month1) {
			month1 = 12;
			--year1;
		}

		if (month1 < 10) month1 = "0" + month1;
// 2022cvt_015
		var year2 = this.m_year;
// 2022cvt_015
		var month2 = this.m_month;
		if (month2 < 10) month2 = "0" + month2;
// 2022cvt_015
		var begin = `${year1}-${month1}-01 00:00:00+09`;

		if (contract.length) {
			if (`${year1}-${month1}-01 00:00:00+09` <= contract && contract < `${year2}-${month2}-01 00:00:00+09`) {
				begin = contract;
			}
		}

// 2022cvt_015
		var end = `${year2}-${month2}-01 00:00:00+09`;
		if (undefined !== this.m_H_change[telno].delete) end = this.m_H_change[telno].delete;

		// if (strtotime(end) < strtotime(begin)) {
		if (Date.parse(end) < Date.parse(begin)) {
			this.putOperator(G_SCRIPT_WARNING, "按分開始日よりも終了日が先にある(" + this.m_pactid + "," + telnopostid + "," + this.m_carid + "," + telno + `,${begin}/${end})`);
			return true;
		}

		// seconds = strtotime(end) - strtotime(begin);
		seconds = Date.parse(end) - Date.parse(begin);
		if (!(undefined !== this.m_H_change[telno])) return true;
// 2022cvt_015
		var H_change = this.m_H_change[telno];
		if (!(undefined !== H_change.move) || 0 == H_change.move.length) return true;
// 2022cvt_015
		var cur = begin;
// 2022cvt_015
		// var total = (strtotime(end) - strtotime(begin)) / (3600 * 24);
		var total = (Date.parse(end) - Date.parse(begin)) / (3600 * 24);
		if (0 == total) return true;
		H_ratio = Array();

// 2022cvt_015
		for (var move of (H_change.move)) {
// 2022cvt_015
			var movedate = move.date;
			// if (strtotime(movedate) < strtotime(cur)) movedate = cur;
			// if (strtotime(end) < strtotime(movedate)) movedate = end;
			if (Date.parse(movedate) < Date.parse(cur)) movedate = cur;
			if (Date.parse(end) < Date.parse(movedate)) movedate = end;
// 2022cvt_015
			// var diff = (strtotime(movedate) - strtotime(cur)) / (3600 * 24);
			var diff = (Date.parse(movedate) - Date.parse(cur)) / (3600 * 24);
			diff = diff * 1 / total;
			if (0 == diff) continue;
			H_ratio[move.from] = diff;
			cur = movedate;
		}

		// diff = (strtotime(end) - strtotime(cur)) / (3600 * 24);
		diff = (Date.parse(end) - Date.parse(cur)) / (3600 * 24);
		diff = diff * 1 / total;
		if (0 != diff) H_ratio[telnopostid] = diff;
// 2022cvt_015
		var A_postid = Array();

// 2022cvt_015
		for (var key in H_ratio) {
// 2022cvt_015
			var value = H_ratio[key];
			if (!(-1 !== A_postid.indexOf(key))) A_postid.push(key);
		}

// 2022cvt_015
		var temp = Array();

// 2022cvt_015
		for (var postid of (A_postid)) {
			diff = 0;

// 2022cvt_015
			for (var key in H_ratio) {
// 2022cvt_015
				var value = H_ratio[key];
				if (postid == key) diff += value;
			}

			temp[postid] = diff;
		}

		H_ratio = temp;
		if (0 == H_ratio.length) H_ratio[telnopostid] = 1;
		return true;
	}

	async getChange() //按分情報は前月
	{
// 2022cvt_015
		var year = this.m_year;
// 2022cvt_015
		var month = this.m_month;
		this.m_H_change = Array();
// 2022cvt_015
		var table_no = this.getTableNo(year, month);
		--month;

		if (0 == month) {
			month = 12;
			--year;
		}

// 2022cvt_015
		var sql = "select telno,postid,postidaft,status";
		sql += ",to_char(date,'yyyy-mm-dd') as date";
		sql += " from change_post_tb";
		sql += " where pactid=" + this.escape(this.m_pactid);
		if (this.m_carid.length) sql += " and carid=" + this.escape(this.m_carid);
		sql += " and (status='MT' or status='DT')";
		sql += " and date>='" + year + "-" + month + "-1'";
// 2022cvt_015
		var year2 = year;
// 2022cvt_015
		var month2 = month;
		++month2;

		if (13 == month2) {
			month2 = 1;
			++year2;
		}

		sql += " and date<'" + year2 + "-" + month2 + "-1'";
		if (this.m_multi_mt) sql += " order by telno,date,fixdate";else sql += " order by telno,fixdate,date";
		sql += ";";
// 2022cvt_015
		var result = await this.m_db.getHash(sql);

// 2022cvt_015
		for (var line of (result)) {
// 2022cvt_015
			var telno = line.telno;
			if (!(undefined !== this.m_H_change[telno])) this.m_H_change[telno] = Array();
// 2022cvt_015
			var date = line.date;

// 2022cvt_022
			// if (0 == strcmp("MT", line.status)) {
			if (0 == "MT".localeCompare(line.status)) {
// 2022cvt_015
				var param = {
					date: date,
					from: line.postid,
					to: line.postidaft
				};

				if (!(undefined !== this.m_H_change[telno].move)) {
					this.m_H_change[telno].move = [param];
				} else {
					if (this.m_multi_mt) //複数按分
						{
							this.m_H_change[telno].move.push(param);
						} else //単一按分
						{
// 2022cvt_015
							var old_param = this.m_H_change[telno].move[0];
							param.from = old_param.from;
							this.m_H_change[telno].move[0] = param;
						}
				}
			} else {
				this.m_H_change[telno].delete = date;
			}
		}

		return true;
	}

};
