//===========================================================================
/// @file update_summary.php
/// @brief summary_tel_bill_X_tbとsummary_bill_X_tbを作る
///
/// @date 2007/12/30 (森原) 新規作成
//===========================================================================
//---------------------------------------------------------------------------
//機能：tel_bill_X_tbからsummary_tel_bill_X_tbを作る

require("script_db.php");

require("script_common.php");

require("formula_parser.php");

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
class UpdateTelBillSummary extends UpdateTelBillBase {
	UpdateTelBillSummary(listener, db, table_no, inserter) {
		this.UpdateTelBillBase(listener, db, table_no, inserter);
		this.m_H_id = Array();

		for (var cnt = 0; cnt < 10; ++cnt) this.m_H_id["K" + (cnt + 1)] = "kamoku" + (cnt + 1);

		for (cnt = 0;; cnt < 2; ++cnt) this.m_H_id["H" + (cnt + 1)] = "calc" + (cnt + 1);

		for (cnt = 0;; cnt < 3; ++cnt) this.m_H_id["H" + (cnt + 3)] = "cond" + (cnt + 1);

		for (cnt = 0;; cnt < 3; ++cnt) this.m_H_id["S" + (cnt + 1)] = "sum" + (cnt + 1);

		this.m_div_by_zero = 0;
		this.m_H_summary = Array();
	}

	getTableNameTgt(table_no) {
		return "summary_tel_bill_" + table_no + "_tb";
	}

	begin(O_cache) //基底型の同名メソッドを呼び出す
	//数式マスターに全合計が無ければ追加する
	{
		if (!UpdateTelBillBase.begin(O_cache)) return false;
		var sql = "select * from summary_formula_tb";
		sql += " where pactid=" + this.escape(O_cache.getPactid());
		var A_result = this.m_db.getHash(sql);
		this.m_H_summary = Array();
		var A_code = "calc1,calc2,cond1,cond2,cond3,sum1,sum2,sum3".split(",");
		var A_formula = ["formula_cond", "formula_true", "formula_false"];
		var is_sum3 = false;

		for (var H_result of Object.values(A_result)) if (!strcmp(H_result.code, "sum3")) is_sum3 = true;

		if (!is_sum3) {
			var H_result = {
				code: "sum3",
				formula_cond: "",
				formula_true: "K1+K2+K3+K4+K5+K6+K7+K8+K9+K10",
				formula_false: ""
			};
			A_result.push(H_result);
		}

		for (var H_result of Object.values(A_result)) //kamoku1～10は無視する
		{
			if (0 === strpos(H_result.code, "kamoku")) continue;

			if (!(-1 !== A_code.indexOf(H_result.code))) {
				this.putError(G_SCRIPT_WARNING, "\u7121\u52B9\u306A\u79D1\u76EE" + pactid + ":" + H_result.code);
				return false;
			}

			for (var formula of Object.values(A_formula)) //字句解析する
			{
				var line = undefined !== H_result[formula] ? H_result[formula] : "";
				var O_lexer = new formula_lexer_type(true);
				var pos = O_lexer.execute(line);

				if (pos != line.length) //字句解析にし残しがある
					{
						this.putError(G_SCRIPT_WARNING, "\u5B57\u53E5\u89E3\u6790\u306B\u5931\u6557" + H_result.code + ":" + formula + ":" + line);
						return false;
					} else if (0 == O_lexer.size()) //数式が空である(正常動作)
					{
						this.putError(G_SCRIPT_INFO, "\u5B57\u53E5\u304C\u30BC\u30ED\u500B\u3067\u3042\u308B" + H_result.code + ":" + formula + ":" + line);
						H_result[formula + "_tree"] = Array();
						continue;
					}

				var O_parser = new formula_parser_type();
				var A_err = Array();

				if (!O_parser.execute(A_err, O_lexer) || A_err.length) //構文解析に失敗した
					{
						this.putError(G_SCRIPT_WARNING, "\u69CB\u6587\u89E3\u6790\u306B\u5931\u6557(1)" + H_result.code + ":" + formula + ":" + line + ":" + serialize(A_err));
						return false;
					}

				var is_compare = !strcmp("formula_cond", formula);
				var A_id = Array();
				{
					let _tmp_0 = this.m_H_id;

					for (var from in _tmp_0) {
						var to = _tmp_0[from];
						if (!strcmp(to, H_result.code)) break;
						A_id.push(from);
					}
				}

				if (!O_parser.check(A_err, is_compare, A_id) || A_err.length) //構文木に問題がある
					{
						this.putError(G_SCRIPT_WARNING, "\u69CB\u6587\u89E3\u6790\u306B\u5931\u6557(2)" + H_result.code + ":" + formula + ":" + line + ":" + serialize(A_err));
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

	executeTelno(O_cache, telno, H_carid_details, H_carid_telinfo, H_tel_bill) //tel_billの集計結果に対してループする
	{
		for (var carid in H_tel_bill) {
			var A_src = H_tel_bill[carid];

			for (var H_src of Object.values(A_src)) {
				if (!this.execute_carid(O_cache.getPactid(), carid, O_cache.getYear(), O_cache.getMonth(), telno, H_src)) return false;
			}
		}

		return true;
	}

	execute_carid(pactid, carid, year, month, telno, H_src) //挿入するデータを作る
	//元のレコードから新しいレコードへコピーする項目を作る
	{
		var H_tgt = Array();
		var A_copy = "pactid,postid,carid,telno".split(",");

		for (var copy of Object.values(A_copy)) H_tgt[copy] = H_src[copy];

		H_tgt.recdate = date("Y-m-d H:i:s");
		var info_line = "";

		for (var copy of Object.values(A_copy)) info_line += "," + H_src[copy];

		if (!this.execute_summary(H_tgt, H_src, info_line)) return false;
		this.m_O_inserter.insert(H_tgt);
		return true;
	}

	execute_summary(H_tgt, H_src, info_line) {
		{
			let _tmp_1 = this.m_H_summary;

			for (var code in _tmp_1) //科目が「cond」で始まっていなければ条件式は無視する
			//数式を取り出して計算する
			{
				var H_line = _tmp_1[code];
				var H_tree = undefined !== H_line.formula_cond_tree ? H_line.formula_cond_tree : Array();
				if (!(0 === strpos(code, "cond"))) H_tree = Array();
				var is_true = false;
				var is_zero = false;
				if (!H_tree.length) is_true = true;else {
					var rval = this.execute_formula(is_zero, H_tgt, H_src, H_tree);
					if (0 != rval) is_true = true;

					if (is_zero) {
						this.putError(G_SCRIPT_INFO, "\u6761\u4EF6\u5F0F\u3067\u30BC\u30ED\u9664\u7B97\u767A\u751F:" + info_line);
						is_true = false;
					}
				}
				var key = is_true ? "formula_true_tree" : "formula_false_tree";
				H_tree = undefined !== H_line[key] ? H_line[key] : Array();
				is_zero = false;
				rval = this.execute_formula(is_zero, H_tgt, H_src, H_tree);

				if (is_zero) {
					this.putError(G_SCRIPT_INFO, "\u6570\u5F0F\u3067\u30BC\u30ED\u9664\u7B97\u767A\u751F:" + info_line);
				}

				H_tgt[code] = +Math.floor(rval);
			}
		}
		return true;
	}

	execute_formula(is_zero, H_tgt, H_src, H_tree) //すでにゼロ除算が発生していれば処理を打ち切る
	{
		if (is_zero) return this.m_div_by_zero;
		if (!H_tree.length) return 0;
		var left = undefined !== H_tree.left ? this.execute_formula(is_zero, H_tgt, H_src, H_tree.left) : 0;
		var right = undefined !== H_tree.right ? this.execute_formula(is_zero, H_tgt, H_src, H_tree.right) : 0;

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

		this.putError(G_SCRIPT_WARNING, "\u4E0D\u660E\u306A\u7A2E\u5225" + H_tree.type);
		return 0;
	}

	get_id(H_tgt, H_src, id) //識別子から、カラム名を取り出す
	{
		var name = "";
		{
			let _tmp_2 = this.m_H_id;

			for (var from in _tmp_2) {
				var to = _tmp_2[from];

				if (!strcasecmp(from, id)) {
					name = to;
					break;
				}
			}
		}

		if (!name.length) {
			this.putError(G_SCRIPT_WARNING, "\u4E0D\u660E\u306A\u8B58\u5225\u5B50" + id);
			return 0;
		}

		if (undefined !== H_tgt[name]) return H_tgt[name];
		if (undefined !== H_src[name]) return H_src[name];
		return 0;
	}

};