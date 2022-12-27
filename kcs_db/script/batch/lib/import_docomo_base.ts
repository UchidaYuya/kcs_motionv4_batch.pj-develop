import script_db, { ScriptDB, ScriptDBAdaptor, TableInserter } from "../../batch/lib/script_db";
import { G_AREA_DOCOMO_UNKNOWN, G_CARRIER_DOCOMO, G_CIRCUIT_DOCOMO_OTHER, } from "../../batch/lib/script_common";
import { G_SCRIPT_WARNING, ScriptLogBase, } from "./script_log";
// const fs = require("fs");
import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import preg_match_all from "../../../class/preg_match_all";
const { execSync } = require('child_process')

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
export class ImportDocomoTelno extends ScriptDBAdaptor {
	ScriptDBAdaptor: any;
	m_use_tel: any;
	m_insert_tel: TableInserter;
	m_insert_tel_X: TableInserter;
	m_pactid: string | undefined;
	m_year: number | undefined;
	m_month: number | undefined;
	getTableNo: any;
	m_last_telno!: string;
	putError: any;
	escape: any;
	m_toppostid: string | undefined;
	putOperator: any;
	m_db!: ScriptDB;
	m_A_tel_X!: any[];
	m_A_tel!: any[];
	m_A_tel_tb!: any[];
	m_parent_accept: any;
    m_parent_error: any;

// 2022cvt_015

	// ImportDocomoTelno(listener, db, table_no, use_tel, insert_tel, insert_tel_X) //電話番号先頭六桁毎の地域会社の読み出し
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: script_db, use_tel: any, insert_tel: TableInserter, insert_tel_X: TableInserter) //電話番号先頭六桁毎の地域会社の読み出し
	//総務省データの消滅に伴い、処理しなくなった
	{
		// this.ScriptDBAdaptor(listener, db, table_no);
		super(listener, db, table_no);
		this.m_use_tel = use_tel;
		this.m_insert_tel = insert_tel;
		this.m_insert_tel_X = insert_tel_X;
	}

	async begin(pactid: string, year: number, month: number) //電話番号のリストをtel_X_tb,tel_tbから読み出す
	//全カラムで共通の値を設定
	{
		this.m_pactid = pactid;
		this.m_year = year;
		this.m_month = month;
// 2022cvt_015
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

// 2022cvt_015
		var sql = "select postidparent from post_relation_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and level=0";
		sql += ";";
// 2022cvt_015
		var result = this.m_db.getAll(sql);

		if (0 == (await result).length) {
			this.m_toppostid = "";
			this.putOperator(G_SCRIPT_WARNING, "トップの部署IDが無い" + pactid);
			return false;
		}

		this.m_toppostid = result[0][0];
		sql = "select telno from tel_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(this.m_pactid);
		sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += ";";
		result = this.m_db.getAll(sql);
		this.m_A_tel_X = Array();

// 2022cvt_015
		for (var line of await (result)) this.m_A_tel_X.push(line[0]);

		if (this.m_use_tel) {
			sql = "select telno from tel_tb";
			sql += " where pactid=" + this.escape(this.m_pactid);
			sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
			sql += ";";
			result = this.m_db.getAll(sql);
			this.m_A_tel = Array();

// 2022cvt_015
			for (var line of await (result)) this.m_A_tel.push(line[0]);
		} else this.m_A_tel_tb = Array();

// 2022cvt_015
		var const_1 = {
			pactid: this.m_pactid,
			postid: this.m_toppostid,
			carid: G_CARRIER_DOCOMO,
			recdate: "now()",
			fixdate: "now()",
			handflg: "false"
		};

		if (this.m_use_tel) {
			if (!this.m_insert_tel.setConst(const_1)) {
				this.putError(G_SCRIPT_WARNING, "setConst(tel_tb)");
				return false;
			}
		}

		if (!this.m_insert_tel_X.setConst(const_1)) {
			this.putError(G_SCRIPT_WARNING, "setConst(tel_" + table_no + "_tb)");
			return false;
		}

		return true;
	}

	insert(telno: any, arid: any, cirid: any) {
// 2022cvt_022
		// if (0 == strcmp(this.m_last_telno, telno)) return true;
		if (0 == this.m_last_telno.localeCompare(telno)) return true;

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
		var table_no: any;
		if (is_X) {
			if (-1 !== this.m_A_tel_X.indexOf(telno)) return true;
		} else {
			if (-1 !== this.m_A_tel.indexOf(telno)) return true;
		}

		if (0 == arid.length) arid = G_AREA_DOCOMO_UNKNOWN;

		if (0 == cirid.length) {
			cirid = G_CIRCUIT_DOCOMO_OTHER;
		}

// 2022cvt_015
		var telno_view = telno;
		if (11 == telno_view.length && "0" == telno_view.substring(2, 1)) telno_view = telno.substring(0, 3) + "-" + telno.substring(3, 4) + "-" + telno.substring(7, 4);
// 2022cvt_015
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
		var table_no: any;
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
export class ImportDocomoBase extends ScriptDBAdaptor {
	ScriptDBAdaptor: any;
	m_tel_tb: any;
	m_check_parent_all: any;
	m_force: any;
	m_A_parent_error: string[];
	m_pactid: string | number | undefined;
	m_year: number | undefined;
	m_month: number | undefined;
	m_parent_ready: boolean | undefined;
	m_parent_accept: boolean | undefined;
	m_parent_error: boolean | undefined;
	escape: any;
	m_db!: ScriptDB;
	m_cur_detailno!: number;
	m_A_clampid!: string | any[];
	m_A_parent!: any[];
	putError: any;
	putOperator: any;

	constructor(listener:any, db:any, table_no:any, tel_tb:any, check_parent_all:any, force:any, A_parent_error:any) {
		super(listener, db, table_no);
		this.m_tel_tb = tel_tb;
		this.m_check_parent_all = check_parent_all;
		this.m_force = force;
		this.m_A_parent_error = A_parent_error;
	}

	async setPactid(pactid: number, year: number, month: number) //クランプIDを読み出す
	//親番号を読み出す
	{
		this.m_pactid = pactid;
		this.m_year = year;
		this.m_month = month;
		this.m_parent_ready = false;
		this.m_parent_accept = false;
		this.m_parent_error = false;
// 2022cvt_015
		var sql = "select detailno,clampid from clamp_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " order by detailno";
		sql += ";";
// 2022cvt_015
		var result = this.m_db.getAll(sql);
		if ((await result).length) this.m_cur_detailno = result[0][0];else this.m_cur_detailno = -1;
		this.m_A_clampid = Array();

// 2022cvt_015
		for (var line of await (result)) this.m_A_clampid[line[0]] = line[1];

		sql = "select prtelno from bill_prtel_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += ";";
		result = this.m_db.getAll(sql);
		this.m_A_parent = Array();

// 2022cvt_020
// 2022cvt_015
		// for (var telno of (result)) this.m_A_parent.push(str_replace("-", "", telno[0]));
		for (var telno of await (result)) this.m_A_parent.push(telno[0].replace("-", ""));

		return true;
	}

	setDetailno(detailno: any) {
		this.m_cur_detailno = detailno;
	}

	readAll(fname: any) {
// 2022cvt_015
		var flist = Array();
		// exec(`ls -1 ${fname} 2> /dev/null`, flist);
		execSync(`ls -1 ${fname} 2> /dev/null`, flist);

// 2022cvt_015
		for (var name of (flist)) if (!this.read(name)) return false;

		return true;
	}

	read(fname: string) //ファイルの存在チェックと、ファイルサイズの検査
	//改行をのぞく行サイズ
	//戻り値
	{
		this.m_parent_ready = false;

		// if (!file_exists(fname)) {
		if (!fs.existsSync(fname)) {
			this.putError(G_SCRIPT_WARNING, `ファイル存在せず(${fname})` + this.m_pactid);
			return false;
		}

// 2022cvt_015
		var linesize = this.getLineSize();
		var stat = fs.statSync(fname);

		// if (0 != filesize(fname) % (linesize + 2)) {
		if (0 != stat.size % (linesize + 2)) {
			this.putOperator(G_SCRIPT_WARNING, `ファイルサイズ不正(${fname})` + this.m_pactid + "/" + linesize);
			return false;
		}

// 2022cvt_015
		// var fp = fopen(fname, "rb");
		var fp = fs.openSync(fname, "rb");

		if (!fp) {
			this.putError(G_SCRIPT_WARNING, `ファイルオープン失敗(${fname})` + this.m_pactid);
			return false;
		}

// 2022cvt_015
		var status = true;

// 2022cvt_015
		for (var lineno = 1; status; ++lineno) {
// 2022cvt_015
			// var line = fread(fp, linesize + 2);
			var linebuff = Buffer.alloc(linesize + 2);
			var size = fs.readSync(fp, linebuff, 0, linesize + 2, 0);
// 2022cvt_015
			var size = linebuff.length;
			//if (0 == size) break;
			var line = this.toUTF(linebuff);//2022.12.9 いったんＵＴＦに変換

// 2022cvt_022
			// if (size != linesize + 2 || strcmp("\r\n", line.substr(linesize, 2))) {
			if (size != linesize + 2 || "\r\n".localeCompare(line.substring(linesize, 2))) {
				this.putOperator(G_SCRIPT_WARNING, `行サイズ不正(${fname}/${lineno})` + this.m_pactid + "/" + line);
				status = false;
				break;
			}

			if (!this.readLine(fname, lineno.toString(), line)) {
				status = false;
				break;
			}
		}

		// fclose(fp);
		fs.closeSync(fp);
		return status;
	}

	readLine(fname: string, lineno: string, line: string) {
		return true;
	}

	getLineSize() {
		return 0;
	}

	checkClampId(id: any) //常に成功とする
	//渡されたIDがすべて空白文字なら合格とする
	{
		return true;
// 2022cvt_015
		var not_space = false;

// 2022cvt_022
// 2022cvt_015
		// for (var cnt = 0; cnt < id.length; ++cnt) if (strcmp(" ", id[cnt])) not_space = true;
		for (var cnt = 0; cnt < id.length; ++cnt) if (" ".localeCompare(id[cnt])) not_space = true;

		if (!not_space) return true;
		if (0 == this.m_A_clampid.length) return true;
		if (!(undefined !== this.m_A_clampid[this.m_cur_detailno])) return true;
// 2022cvt_015
		var clampid = this.m_A_clampid[this.m_cur_detailno];

		if (clampid.length < id.length) {
// 2022cvt_015
			var len_id = id.length;
// 2022cvt_015
			var len_clampid = clampid.length;
			id = id.substr(len_id - len_clampid, len_clampid);
		}

		if (id.length < clampid.length) {
			len_id = id.length;
			len_clampid = clampid.length;
			clampid = clampid.substr(len_clampid - len_id, len_id);
		}

// 2022cvt_022
		// if (strcmp(id, clampid)) return false;
		if (id.localeCompare(clampid)) return false;
		return true;
	}

	checkParent(telno: string) {
		telno = telno.trim();
// 2022cvt_020
		// telno = str_replace("-", "", telno);
		telno = telno.replace("-", "");

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

	toInt(result: number, src:any) //$src = trim($src);
	//$minus = false;
	{
		src = src.trim();

		if (0 == src.length) {
			result = 0;
			return true;
		}

// 2022cvt_015
		var minus = false;

// 2022cvt_022
		// if (0 == strcmp("-", src.substr(0, 1))) {
		if (0 == "-".localeCompare(src.substring(0, 1))) {
			minus = true;
			src = src.substring(1);
		}

// 2022cvt_016
		// if (!ctype_digit(src)) return false;
		if (!isNaN(src)) return false;
		result = src;
		result += 0;
		if (minus) result = -result;
		return true;
	}

// 2022cvt_015
	toUTF(var_0) {
// 2022cvt_015
		// return mb_convert_encoding(var_0, "UTF-8", "SJIS");
		return Encoding.convert(var_0, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
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
export class ImportDocomoCsvBase extends ImportDocomoBase {
	constructor(listener: any, db: any, table_no: any, tel_tb: any, check_parent_all: any, force: any, A_parent_error: any) {
		super(listener, db, table_no, tel_tb, check_parent_all, force, A_parent_error);
	}

	static fgetcsv(fp: any) {
		var buffer = fs.readFileSync("utf8");
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var lines = text.toString().split("\r\n");

		// if (feof(fp)) return false;
// 2022cvt_015
		var line = "";

		// while (!feof(fp)) {
		for (line of lines) {
// 2022cvt_015
			// var buf = fgets(fp);
			var buf = lines[0];
			line += buf;
// 2022cvt_015
			var A_match = Array();
			if (0 == preg_match_all("/\"/", line, A_match) % 2) break;
		}

		if (!line.length) return false;
// 2022cvt_015
		var A_csv = Array();
		// line = preg_replace("/(?:\\x0D\\x0A|[\\x0D\\x0A])?$/", ",", line, 1);
		line = line.replace("/(?:\\x0D\\x0A|[\\x0D\\x0A])?$/", ",");
		A_match = Array();
		preg_match_all("/(\"[^\"]*(?:\"\"[^\"]*)*\"|[^,]*),/", line, A_match);

// 2022cvt_015
		for (var cnt = 0; cnt < A_match[1].length; ++cnt) {
// 2022cvt_015
			var A_sub = Array();
			A_sub = A_match[1][cnt].match("/^\"(.*)\"$/s")
// 2022cvt_019
			if (A_sub) {
				A_match[1][cnt] = A_sub[1].replace(/""/g, "\"");
			}

			A_csv.push(A_match[1][cnt]);
		}

		return A_csv;
	}

};
