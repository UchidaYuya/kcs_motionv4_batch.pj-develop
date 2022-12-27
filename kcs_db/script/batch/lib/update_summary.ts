import { ScriptDB } from "../../batch/lib/script_db";
import { G_SCRIPT_WARNING, G_SCRIPT_INFO, ScriptLogBase } from "../../batch/lib/script_log";
import * as script_common from "../../batch/lib/script_common";
import { formula_lexer_type, formula_parser_type} from "../../batch/lib/formula_parser";

import { TelDetailsCache, UpdateTelBillBase } from "../../batch/lib/update_tel_bill";
import TableNo from "../../batch/lib/script_db";

/// @brief 数式内の識別子からテーブルのカラム名へのハッシュ
///
/// ハッシュでの出現順は、数式内部での出現順である。
/// @brief ゼロ除算時に代入する値
/// @brief 数式マスター
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データ挿入型
//機能：書き込むテーブル名を返す
//引数：テーブル番号
//機能：処理を開始する
//引数：請求明細読み出しインスタンス
//返値：深刻なエラーが発生したらfalseを返す
//機能：数式マスターを返す
//機能：一件の電話のすべてのキャリアを処理する
//引数：請求明細読み出しインスタンス
//処理する電話番号
//array(キャリアID => 処理する請求明細)
//array(キャリアID => 電話情報)
//array(キャリアID => array(tel_billの集計結果))
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
/// @brief 一個のキャリアで、summary_tel_billを作る
/// @return 深刻なエラーが発生したらfalseを返す
/// @protected
/// @brief 数式を処理してコピーを行う
/// @return 深刻なエラーが発生したらfalseを返す
/// @protected
/// @brief 数式を再帰的に処理する
/// @protected
/// @brief 終端記号を取り出す
/// @protected
export default class UpdateTelBillSummary extends UpdateTelBillBase {
	m_H_id: any[];
	m_div_by_zero: number;
	m_H_summary: any[];
	// UpdateTelBillSummary(listener, db, table_no, inserter) {
	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, inserter:any) {
		// this.UpdateTelBillBase(listener, db, table_no, inserter);
		super(listener, db, table_no, inserter);
		this.m_H_id = Array();

// 2022cvt_015
		for (var cnt = 0; cnt < 10; ++cnt) this.m_H_id["K" + (cnt + 1)] = "kamoku" + (cnt + 1);

		for (cnt = 0; cnt < 2; ++cnt) this.m_H_id["H" + (cnt + 1)] = "calc" + (cnt + 1);

		for (cnt = 0; cnt < 3; ++cnt) this.m_H_id["H" + (cnt + 3)] = "cond" + (cnt + 1);

		for (cnt = 0; cnt < 3; ++cnt) this.m_H_id["S" + (cnt + 1)] = "sum" + (cnt + 1);

		this.m_div_by_zero = 0;
		this.m_H_summary = Array();
	}

	getTableNameTgt(table_no: string) {
		return "summary_tel_bill_" + table_no + "_tb";
	}

	async begin(O_cache: TelDetailsCache) //基底型の同名メソッドを呼び出す
	//数式マスターに全合計が無ければ追加する
	{
		// if (!UpdateTelBillBase.begin(O_cache)) return false;
		if (!super.begin(O_cache)) return false;

// 2022cvt_015
		var sql = "select * from summary_formula_tb";
		sql += " where pactid=" + this.escape(O_cache.getPactid());
// 2022cvt_015
		var A_result = await this.m_db.getHash(sql);
		this.m_H_summary = Array();
// 2022cvt_015
		var A_code = "calc1,calc2,cond1,cond2,cond3,sum1,sum2,sum3".split(",");
// 2022cvt_015
		var A_formula = ["formula_cond", "formula_true", "formula_false"];
// 2022cvt_015
		var is_sum3 = false;
		var H_result;

		var pactid: any;

// 2022cvt_022
// 2022cvt_015
		// for (var H_result of (A_result)) if (!strcmp(H_result.code, "sum3")) is_sum3 = true;
		for (var H_result of (A_result)) if (!H_result.code.localeCompare("sum3")) is_sum3 = true;

		if (!is_sum3) {
// 2022cvt_015
			H_result = {
				code: "sum3",
				formula_cond: "",
				formula_true: "K1+K2+K3+K4+K5+K6+K7+K8+K9+K10",
				formula_false: ""
			};
			A_result.push(H_result);
		}

// 2022cvt_015
		for (var H_result of (A_result)) //kamoku1～10は無視する
		{
			// if (0 === strpos(H_result.code, "kamoku")) continue;
			if (0 === H_result.code.indexOf("kamoku")) continue;

			if (!(-1 !== A_code.indexOf(H_result.code))) {
				this.putError(G_SCRIPT_WARNING, "無効な科目" + pactid + ":" + H_result.code);
				return false;
			}

// 2022cvt_015
			for (var formula of (A_formula)) //字句解析する
			{
// 2022cvt_015
				var line = undefined !== H_result[formula] ? H_result[formula] : "";
// 2022cvt_016
// 2022cvt_015
				var O_lexer = new formula_lexer_type(true);
// 2022cvt_015
				var pos = O_lexer.execute(line);

				if (pos != line.length) //字句解析にし残しがある
					{
						this.putError(G_SCRIPT_WARNING, "字句解析に失敗" + H_result.code + ":" + formula + ":" + line);
						return false;
					} else if (0 == O_lexer.size()) //数式が空である(正常動作)
					{
						this.putError(G_SCRIPT_INFO, "字句がゼロ個である" + H_result.code + ":" + formula + ":" + line);
						H_result[formula + "_tree"] = Array();
						continue;
					}

// 2022cvt_016
// 2022cvt_015
				var O_parser = new formula_parser_type();
// 2022cvt_015
				var A_err = "";

				if (!O_parser.execute(A_err, O_lexer) || A_err.length) //構文解析に失敗した
					{
						// this.putError(G_SCRIPT_WARNING, "\u69CB\u6587\u89E3\u6790\u306B\u5931\u6557(1)" + H_result.code + ":" + formula + ":" + line + ":" + serialize(A_err));
						this.putError(G_SCRIPT_WARNING, "構文解析に失敗(1)" + H_result.code + ":" + formula + ":" + line + ":" + JSON.parse(A_err));
						return false;
					}

// 2022cvt_022
// 2022cvt_015
				// var is_compare = !strcmp("formula_cond", formula);
				var is_compare = !"formula_cond".localeCompare(formula);
// 2022cvt_015
				var A_id = Array();
				{
					let _tmp_0 = this.m_H_id;

// 2022cvt_015
					for (var from in _tmp_0) {
// 2022cvt_015
						var to = _tmp_0[from];
// 2022cvt_022
						// if (!strcmp(to, H_result.code)) break;
						if (!to.localeCompare(H_result.code)) break;
						A_id.push(from);
					}
				}

				if (!O_parser.check(A_err, is_compare, A_id) || A_err.length) //構文木に問題がある
					{
						// this.putError(G_SCRIPT_WARNING, "\u69CB\u6587\u89E3\u6790\u306B\u5931\u6557(2)" + H_result.code + ":" + formula + ":" + line + ":" + serialize(A_err));
						this.putError(G_SCRIPT_WARNING, "構文解析に失敗(2)" + H_result.code + ":" + formula + ":" + line + ":" + JSON.parse(A_err));
						return false;
					}

				H_result[formula + "_tree"] = O_parser.m_H_tree;
			}

			this.m_H_summary[H_result.code] = H_result;
		}

		return true;
	}

	getSummary() {
		return this.m_H_summary;
	}

	executeTelno(O_cache: { getPactid: () => any; getYear: () => any; getMonth: () => any; }, telno: any, H_carid_details: any, H_carid_telinfo: any, H_tel_bill: { [key: string]: any; }) //tel_billの集計結果に対してループする
	{
// 2022cvt_015
		for (var carid in H_tel_bill) {
// 2022cvt_015
			var A_src = H_tel_bill[carid];

// 2022cvt_015
			for (var H_src of (A_src)) {
				if (!this.execute_carid(O_cache.getPactid(), carid, O_cache.getYear(), O_cache.getMonth(), telno, H_src)) return false;
			}
		}

		return true;
	}

	execute_carid(pactid: any, carid: string, year: any, month: any, telno: any, H_src: { [key: string]: string; }) //挿入するデータを作る
	//元のレコードから新しいレコードへコピーする項目を作る
	{
// 2022cvt_015
		var H_tgt: { [key: string]: any } = {};
// 2022cvt_015
		var A_copy = "pactid,postid,carid,telno".split(",");

// 2022cvt_015
		for (var copy of (A_copy)) H_tgt[copy] = H_src[copy];

		// H_tgt.recdate = date("Y-m-d H:i:s");
		H_tgt.recdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
// 2022cvt_015
		var info_line = "";

// 2022cvt_015
		for (var copy of (A_copy)) info_line += "," + H_src[copy];

		if (!this.execute_summary(H_tgt, H_src, info_line)) return false;
		this.m_O_inserter.insert(H_tgt);
		return true;
	}

	execute_summary(H_tgt: { [key: string]: any; }, H_src: { [key: string]: string; }, info_line: string) {
		{
			let _tmp_1 = this.m_H_summary;

// 2022cvt_015
			for (var code in _tmp_1) //科目が「cond」で始まっていなければ条件式は無視する
			//数式を取り出して計算する
			{
// 2022cvt_015
				var H_line = _tmp_1[code];
// 2022cvt_015
				var H_tree = undefined !== H_line.formula_cond_tree ? H_line.formula_cond_tree : Array();
				// if (!(0 === strpos(code, "cond"))) H_tree = Array();
				if (!(0 === code.indexOf("cond"))) H_tree = Array();
// 2022cvt_015
				var is_true = false;
// 2022cvt_015
				var is_zero = false;
				if (!H_tree.length) is_true = true;else {
// 2022cvt_015
					var rval = this.execute_formula(is_zero, H_tgt, H_src, H_tree);
					if (0 != rval) is_true = true;

					if (is_zero) {
						this.putError(G_SCRIPT_INFO, "条件式でゼロ除算発生:" + info_line);
						is_true = false;
					}
				}
// 2022cvt_015
				var key = is_true ? "formula_true_tree" : "formula_false_tree";
				H_tree = undefined !== H_line[key] ? H_line[key] : Array();
				is_zero = false;
				rval = this.execute_formula(is_zero, H_tgt, H_src, H_tree);

				if (is_zero) {
					this.putError(G_SCRIPT_INFO, "数式でゼロ除算発生:" + info_line);
				}

				H_tgt[code] = +Math.floor(rval);
			}
		}
		return true;
	}

	execute_formula(is_zero: boolean, H_tgt: { [key: string]: any; }, H_src: { [key: string]: string; }, H_tree: { length: any; left: undefined; right: undefined; type: string; value: any; }) //すでにゼロ除算が発生していれば処理を打ち切る
	{
		if (is_zero) return this.m_div_by_zero;
		if (!H_tree.length) return 0;
// 2022cvt_015
		var left = undefined !== H_tree.left ? this.execute_formula(is_zero, H_tgt, H_src, H_tree.left) : 0;
// 2022cvt_015
		var right = undefined !== H_tree.right ? this.execute_formula(is_zero, H_tgt, H_src, H_tree.right) : 0;

// 2022cvt_016
		switch (H_tree.type) {
			case "add":
				return left + right;

			case "sub":
				return left - right;

			case "mul":
				return left * right;

			case "div":
				if (0 == right) {
					is_zero = true;
					return this.m_div_by_zero;
				}

				return left / right;

			case "mod":
				if (0 == right) {
					is_zero = true;
					return this.m_div_by_zero;
				}

				return left % right;

			case "eq":
				return left == right ? 1 : 0;

			case "ne":
				return left != right ? 1 : 0;

			case "le":
				return left <= right ? 1 : 0;

			case "lt":
				return left < right ? 1 : 0;

			case "ge":
				return left >= right ? 1 : 0;

			case "gt":
				return left > right ? 1 : 0;

			case "id":
				return this.get_id(H_tgt, H_src, H_tree.value);

			case "number":
				return undefined !== H_tree.value ? H_tree.value : 0;
		}

// 2022cvt_016
		this.putError(G_SCRIPT_WARNING, "不明な種別" + H_tree.type);
		return 0;
	}

	get_id(H_tgt: { [key: string]: any; }, H_src: { [key: string]: any; }, id: string) //識別子から、カラム名を取り出す
	{
// 2022cvt_015
		var name = "";
		{
			let _tmp_2 = this.m_H_id;

// 2022cvt_015
			for (var from in _tmp_2) {
// 2022cvt_015
				var to = _tmp_2[from];

				// if (!strcasecmp(from, id)) {
				if (!(id.toUpperCase() === from.toUpperCase())) {
					name = to;
					break;
				}
			}
		}

		if (!name.length) {
			this.putError(G_SCRIPT_WARNING, "不明な識別子" + id);
			return 0;
		}

		if (undefined !== H_tgt[name]) return H_tgt[name];
		if (undefined !== H_src[name]) return H_src[name];
		return 0;
	}

};
