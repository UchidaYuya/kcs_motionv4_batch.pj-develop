//===========================================================================
/// @file formula_parser.php
/// @brief 四則演算の式パーサ
///
///
/// 入力された式を字句解析・構文解析し、構文木を作る。
/// @date 2007/11/29 (森原) 完成
//===========================================================================
//===========================================================================
/// @brief 字句解析器
///
/// 与えられた文字列を字句解析して、インスタンス内部の配列に
/// トークンを蓄積する。
///
/// 字句解析器では積極的なエラー処理は行わない。
/// 処理できないトークンが出現した場合は、種別をunknownとして
/// できるだけ処理を継続する。

/// @brief トークン一覧
///
/// 配列の各要素は、以下のハッシュである。
/// <table>
///  <tr><th>キー</th><th>内容</th></tr>
///  <tr><td>type</td><td>トークンの種別</td></tr>
///  <tr><td>reg</td><td>トークンを構成する正規表現</td></tr>
///  <tr><td>nest</td><td>正規表現に含まれるカッコの個数</td></tr>
///  <tr><td></td><td></td></tr>
/// </table>
/// 上記の内、nestは省略できる。省略した場合は1である。
/// regは、かならず全体をカッコで囲む事。
///
/// たとえば+と++のように、一方が他方を包括する場合は、
/// より長くヒットする方(先の例では++)を配列の前方に入れる。
/// それ以外では、配列中の順序は結果に影響しない。
/// @brief 解析結果
///
/// 配列の各要素は、以下のハッシュ。
/// <table>
///  <tr><th>キー</th><th>内容</th></tr>
///  <tr><td>type</td><td>出現したトークンの種別</td></tr>
///  <tr><td>value</td><td>実際に出現したトークン</td></tr>
///  <tr><td>pos</td><td>トークン開始位置(文字列の先頭ならゼロ)</td></tr>
/// </table>
/// @brief コンストラクタ
/// @brief 解析結果を初期化する
/// @brief トークンの個数を返す
/// @brief トークンを返す
/// @brief 文字列に対して字句解析を行う
///
/// このメソッドの返値が、数式の文字数よりも少ない場合は、
/// 式の途中で字句解析に失敗している。
/// @return 処理できた文字数を返す
class formula_lexer_type {
	formula_lexer_type(is_float) //四則演算
	//丸カッコ
	//比較演算子
	//空白文字
	//数値
	//識別子
	//初期化する
	{
		this.m_A_master = Array();
		this.m_A_master.push({
			type: "add",
			reg: "(\\+)"
		});
		this.m_A_master.push({
			type: "sub",
			reg: "(\\-)"
		});
		this.m_A_master.push({
			type: "mul",
			reg: "(\\*)"
		});
		this.m_A_master.push({
			type: "div",
			reg: "(\\/)"
		});
		this.m_A_master.push({
			type: "mod",
			reg: "(%)"
		});
		this.m_A_master.push({
			type: "begin",
			reg: "(\\()"
		});
		this.m_A_master.push({
			type: "end",
			reg: "(\\))"
		});
		this.m_A_master.push({
			type: "ne",
			reg: "(!=|<>)"
		});
		this.m_A_master.push({
			type: "le",
			reg: "(<=|=<)"
		});
		this.m_A_master.push({
			type: "ge",
			reg: "(>=|=>)"
		});
		this.m_A_master.push({
			type: "lt",
			reg: "(<)"
		});
		this.m_A_master.push({
			type: "gt",
			reg: "(>)"
		});
		this.m_A_master.push({
			type: "eq",
			reg: "(==|=)"
		});
		this.m_A_master.push({
			type: "space",
			reg: "([[:space:]\u3000]+)"
		});

		if (is_float) {
			this.m_A_master.push({
				type: "number",
				reg: "([0-9]+\\.[0-9]+|\\.[0-9]+|[0-9]+\\.|[0-9]+)"
			});
		} else {
			this.m_A_master.push({
				type: "number",
				reg: "([0-9]+)"
			});
		}

		this.m_A_master.push({
			type: "id",
			reg: "([a-zA-Z][0-9]+)"
		});
		this.clear();
	}

	clear() {
		this.m_A_token = Array();
	}

	size() {
		return this.m_A_token.length;
	}

	get(idx) {
		return this.m_A_token[idx];
	}

	execute(line) //マスターの正規表現をOR結合したパターンを作る
	//結合したパターン
	//出現したカッコから、マスター添え字へのハッシュ
	//マッチさせていく
	//現在注目中の文字
	{
		var pattern = "";
		var H_nest = Array();
		var idx = 1;

		for (var gcnt = 0; gcnt < this.m_A_master.length; ++gcnt) {
			var H_master = this.m_A_master[gcnt];
			if (pattern.length) pattern += "|";
			pattern += H_master.reg;
			var nest = 1;
			if (undefined !== H_master.nest) nest = H_master.nest;

			for (var lcnt = 0; lcnt < nest; ++lcnt) H_nest[idx + lcnt] = gcnt;

			idx += nest;
		}

		pattern = "/" + pattern + "/";
		var pos = 0;

		while (pos < line.length) //まったくマッチしなければ、残りを不明なトークンとして処理を打ち切る
		//マッチした部分の種別を決定する
		//結果を保存する
		{
			var A_match = Array();
			preg_match(pattern, line, A_match, PREG_OFFSET_CAPTURE, pos);

			if (!(undefined !== A_match[0])) {
				this.m_A_token.push({
					type: "unknown",
					value: line.substr(pos),
					pos: pos
				});
				break;
			}

			if (pos < A_match[0][1]) {
				this.m_A_token.push({
					type: "unknown",
					value: line.substr(pos, A_match[0][1] - pos),
					pos: pos
				});
				pos = A_match[0][1];
			}

			var H_result = {
				type: "unknown",
				value: A_match[0][0],
				pos: pos
			};
			pos += A_match[0][0].length;

			for (var from in H_nest) {
				var to = H_nest[from];
				if (!(undefined !== A_match[from]) || !(undefined !== A_match[from][1])) continue;
				if (A_match[from][1] < 0) continue;
				H_result.type = this.m_A_master[to].type;
				break;
			}

			this.m_A_token.push(H_result);
		}

		return pos;
	}

};

/// @brief 生成した構文木
/// @brief コンストラクタ
/// @brief 内容を初期化する
/// @brief すべての比較演算子を配列に入れて返す
/// @protected
/// @brief 構文解析を行う
/// @return 失敗したらfalseを返す
/// @brief 終端記号を取り出す
/// @protected
/// @return 要素の取り出しに失敗したらfalseを返す
/// @brief カッコ非終端記号を取り出す
/// @protected
/// @return 要素の取り出しに失敗したらfalseを返す
/// @brief 単項非終端記号を取り出す
/// @protected
/// @return 要素の取り出しに失敗したらfalseを返す
/// @brief 乗除非終端記号を取り出す
/// @protected
/// @return 要素の取り出しに失敗したらfalseを返す
/// @brief 加減非終端記号を取り出す
/// @protected
/// @return 要素の取り出しに失敗したらfalseを返す
/// @brief 比較非終端記号を取り出す
/// @protected
/// @return 要素の取り出しに失敗したらfalseを返す
/// @brief 次のトークンを取り出す
/// @protected
/// @return 要素の取り出しに失敗したらfalseを返す
/// @brief エラー情報にエラーを追加する
/// @protected
/// @brief 構文木に対してエラーチェックを行う
/// @return エラーを検出したらfalseを返す
/// @brief 構文木に含まれる識別子が有効か確認する
/// @return エラーを検出したらfalseを返す
/// @brief 構文木に含まれる比較演算子をすべて取り出す
class formula_parser_type {
	formula_parser_type() {
		this.clear();
	}

	clear() {
		this.m_H_tree = Array();
	}

	get_compare_op() {
		return ["eq", "ne", "le", "ge", "lt", "gt"];
	}

	execute(A_err, O_lexer) //比較非終端記号を読み出す
	{
		A_err = Array();
		var idx = 0;
		if (!this.parse_compare(A_err, O_lexer, idx, this.m_H_tree)) return false;
		var H_token = Array();

		if (this.get_token(A_err, O_lexer, idx, H_token)) {
			this.add_error(A_err, "\u5F0F\u304C\u7D42\u4E86\u3057\u3066\u3044\u306A\u3044", [H_token.pos]);
			return false;
		}

		return true;
	}

	parse_leaf(A_err, O_lexer, idx, H_branch) //記号を読み出す
	{
		var H_token = Array();
		if (!this.get_token(A_err, O_lexer, idx, H_token)) return false;

		if ("id" != H_token.type && "number" != H_token.type) {
			this.add_error(A_err, "\u6F14\u7B97\u5B50\u304C\u9023\u7D9A\u3057\u3066\u3044\u308B", [H_token.pos]);
			return false;
		}

		H_branch = {
			type: H_token.type,
			pos: H_token.pos,
			value: H_token.value
		};
		return true;
	}

	parse_parentheses(A_err, O_lexer, idx, H_branch) //記号を一個先読みする
	//先読みした記号が左カッコでなければ、終端記号を読み出して終了する
	//比較非終端記号を読み出す
	{
		var next = idx;
		var H_token = Array();
		if (!this.get_token(A_err, O_lexer, next, H_token)) return false;
		var pos = H_token.pos;
		if ("begin" != H_token.type) return this.parse_leaf(A_err, O_lexer, idx, H_branch);
		idx = next;

		if (!this.parse_compare(A_err, O_lexer, idx, H_branch)) {
			this.add_error(A_err, "\u5DE6\u30AB\u30C3\u30B3\u306E\u53F3\u5074\u304C\u7121\u3044", [pos]);
			return false;
		}

		if (!this.get_token(A_err, O_lexer, idx, H_token) || "end" != H_token.type) {
			this.add_error(A_err, "\u30AB\u30C3\u30B3\u304C\u9589\u3058\u3066\u3044\u306A\u3044", [H_token.pos]);
			return false;
		}

		return true;
	}

	parse_unary(A_err, O_lexer, idx, H_branch) //右側のカッコ非終端記号を取り出す
	{
		var A_op = ["add", "sub"];
		var A_stack = Array();
		var pos = 0;

		while (true) //記号を一個先読みする
		//先読みした記号が単項演算子でなければループを抜ける
		{
			var next = idx;
			var H_token = Array();
			if (!this.get_token(A_err, O_lexer, next, H_token)) return false;
			pos = H_token.pos;
			if (!(-1 !== A_op.indexOf(H_token.type))) break;
			A_stack.push(H_token.type);
			idx = next;
		}

		H_branch = Array();

		if (!this.parse_parentheses(A_err, O_lexer, idx, H_branch)) {
			if (A_stack.length) this.add_error(A_err, "\u5358\u9805\u6F14\u7B97\u5B50\u306E\u53F3\u5074\u304C\u7121\u3044", [pos]);
			return false;
		}

		while (A_stack.length) {
			var op = A_stack.pop();
			var H_right = H_branch;
			H_branch = {
				right: H_right,
				type: op,
				pos: H_token.pos
			};
		}

		return true;
	}

	parse_muldiv(A_err, O_lexer, idx, H_branch) //左端の単項非終端記号を取り出す
	{
		var A_op = ["mul", "div", "mod"];
		H_branch = Array();
		if (!this.parse_unary(A_err, O_lexer, idx, H_branch)) return false;

		while (true) //記号を一個先読みする
		//先読みした記号が乗除演算子でなければループを抜ける
		{
			var next = idx;
			var H_token = Array();
			if (!this.get_token(A_err, O_lexer, next, H_token)) break;
			var pos = H_token.pos;
			if (!(-1 !== A_op.indexOf(H_token.type))) break;
			idx = next;
			var H_right = Array();

			if (!this.parse_unary(A_err, O_lexer, idx, H_right)) {
				this.add_error(A_err, "\u4E57\u9664\u6F14\u7B97\u5B50\u306E\u53F3\u5074\u304C\u7121\u3044", [pos]);
				return false;
			}

			var H_left = H_branch;
			H_branch = {
				left: H_left,
				right: H_right,
				type: H_token.type,
				pos: H_token.pos
			};
		}

		return true;
	}

	parse_addsub(A_err, O_lexer, idx, H_branch) //左端の乗除非終端記号を取り出す
	{
		var A_op = ["add", "sub"];
		H_branch = Array();
		if (!this.parse_muldiv(A_err, O_lexer, idx, H_branch)) return false;

		while (true) //記号を一個先読みする
		//先読みした記号が加減演算子でなければループを抜ける
		{
			var next = idx;
			var H_token = Array();
			if (!this.get_token(A_err, O_lexer, next, H_token)) break;
			var pos = H_token.pos;
			if (!(-1 !== A_op.indexOf(H_token.type))) break;
			idx = next;
			var H_right = Array();

			if (!this.parse_muldiv(A_err, O_lexer, idx, H_right)) {
				this.add_error(A_err, "\u52A0\u6E1B\u6F14\u7B97\u5B50\u306E\u53F3\u5074\u304C\u7121\u3044", [pos]);
				return false;
			}

			var H_left = H_branch;
			H_branch = {
				left: H_left,
				right: H_right,
				type: H_token.type,
				pos: H_token.pos
			};
		}

		return true;
	}

	parse_compare(A_err, O_lexer, idx, H_branch) //左端の加減非終端記号を取り出す
	{
		var A_op = this.get_compare_op();
		H_branch = Array();
		if (!this.parse_addsub(A_err, O_lexer, idx, H_branch)) return false;

		while (true) //記号を一個先読みする
		//先読みした記号が比較演算子でなければループを抜ける
		{
			var next = idx;
			var H_token = Array();
			if (!this.get_token(A_err, O_lexer, next, H_token)) break;
			var pos = H_token.pos;
			if (!(-1 !== A_op.indexOf(H_token.type))) break;
			idx = next;
			var H_right = Array();

			if (!this.parse_addsub(A_err, O_lexer, idx, H_right)) {
				this.add_error(A_err, "\u6BD4\u8F03\u6F14\u7B97\u5B50\u306E\u53F3\u5074\u304C\u7121\u3044", [pos]);
				return false;
			}

			var H_left = H_branch;
			H_branch = {
				left: H_left,
				right: H_right,
				type: H_token.type,
				pos: H_token.pos
			};
		}

		return true;
	}

	get_token(A_err, O_lexer, idx, H_token) //トークンが見つからなかった
	{
		for (; idx < O_lexer.size(); ++idx) //空白文字なら読み飛ばす
		{
			H_token = O_lexer.get(idx);

			if ("space" == H_token.type) {
				continue;
			}

			if ("unknown" == H_token.type) {
				this.add_error(A_err, "\u51E6\u7406\u3067\u304D\u306A\u3044\u6587\u5B57", [H_token.pos], H_token.value);
				return false;
			}

			++idx;
			return true;
		}

		return false;
	}

	add_error(A_err, msg, A_pos, label = "") {
		var H_err = {
			msg: msg
		};
		if (A_pos.length) H_err.pos = A_pos;
		if (label.length) H_err.label = label;
		A_err.push(H_err);
	}

	check(A_err, is_compare, A_id, is_ignore_case = true) //構文木に含まれる識別子がすべて有効か確認する
	{
		var status = true;
		status &= this.check_id(A_err, A_id, is_ignore_case, this.m_H_tree);
		var A_op = this.get_compare_op();

		if (is_compare) //条件式である
			//比較演算子の個数が1個でなければエラーとする
			{
				var A_pos = Array();
				this.find_compare(A_pos, A_op, this.m_H_tree);

				if (0 == A_pos.length) {
					this.add_error(A_err, "\u6BD4\u8F03\u6F14\u7B97\u5B50\u304C\u7121\u3044", [0]);
					status = false;
				} else if (1 < A_pos.length) {
					this.add_error(A_err, "\u6BD4\u8F03\u6F14\u7B97\u5B50\u304C\u8907\u6570\u3042\u308B", A_pos);
					status = false;
				}

				if (1 == A_pos.length) {
					if (!(undefined !== this.m_H_tree.type) || !(-1 !== A_op.indexOf(this.m_H_tree.type))) {
						this.add_error(A_err, "\u6BD4\u8F03\u6F14\u7B97\u5B50\u304C\u30AB\u30C3\u30B3\u306E\u4E2D\u306B\u3042\u308B", A_pos);
						status = false;
					}
				}
			} else //比較演算子が含まれていればエラーとする
			{
				A_pos = Array();
				this.find_compare(A_pos, A_op, this.m_H_tree);

				if (A_pos.length) {
					this.add_error(A_err, "\u6BD4\u8F03\u6F14\u7B97\u5B50\u304C\u542B\u307E\u308C\u3066\u3044\u308B", A_pos);
					status = false;
				}
			}

		return status;
	}

	check_id(A_err, A_id, is_ignore_case, H_tree) {
		var status = true;

		if (undefined !== H_tree.type && "id" == H_tree.type) //識別子が有効か確認する
			{
				var needle = H_tree.value;
				var is_find = false;

				for (var id of Object.values(A_id)) {
					if (is_ignore_case) {
						if (!strcasecmp(needle, id)) {
							is_find = true;
							break;
						}
					} else {
						if (!strcmp(needle, id)) {
							is_find = true;
							break;
						}
					}
				}

				if (!is_find) {
					var pos = undefined !== H_tree.pos ? H_tree.pos : 0;
					this.add_error(A_err, "\u4E0D\u660E\u306A\u8B58\u5225\u5B50", [pos], needle);
					status = false;
				}
			}

		if (undefined !== H_tree.left) status &= this.check_id(A_err, A_id, is_ignore_case, H_tree.left);
		if (undefined !== H_tree.right) status &= this.check_id(A_err, A_id, is_ignore_case, H_tree.right);
		return status;
	}

	find_compare(A_pos, A_op, H_tree) {
		if (undefined !== H_tree.type && -1 !== A_op.indexOf(H_tree.type)) //比較演算子が見つかったので、出現位置を記録する
			{
				var pos = undefined !== H_tree.pos ? H_tree.pos : 0;
				A_pos.push(pos);
			}

		if (undefined !== H_tree.left) this.find_compare(A_pos, A_op, H_tree.left);
		if (undefined !== H_tree.right) this.find_compare(A_pos, A_op, H_tree.right);
	}

};