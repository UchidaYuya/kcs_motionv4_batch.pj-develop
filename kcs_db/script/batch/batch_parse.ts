const ST_NORMAL = 0;
const ST_ERROR = 10;

export class TinyParser {
	lex: TinyLex;
	debug: boolean;
	status: number;
	H_names: any;
	constructor(str: string) {
		this.lex = new TinyLex(str);
		this.status = ST_NORMAL;
		this.debug = false;
	}

	check() {
		this.debug = true;
		return this.termFormula();
	}

	execute() {
		this.debug = false;
		return this.termFormula();
	}

	termFormula() //最初は必ずItemで始まる
	{
		var nextToken: string;

		if ((nextToken = this.lex.nextToken()) == undefined) {
			return undefined;
		}

		var result = this.termItem();

		while ((nextToken = this.lex.nextToken()) != undefined) {
			switch (nextToken) {
				case "&":
					nextToken = this.lex.nextToken();
					var resultAnd = this.termItem();
					result = resultAnd && result;
					break;

				case "|":
					nextToken = this.lex.nextToken();
					var resultOr = this.termItem();
					result = resultOr || result;
					break;

				case ")":
					return result;

				default:
					console.log("Syntax Error, \"" + nextToken + "\"\n");
					return result;
			}
		}

		return result;
	}

	termBlock() {
		var result = this.termFormula();

		if (this.lex.currentToken != ")") {
			console.log("ERROR: Missing ), " + this.lex.currentToken + "\n");
			this.status = ST_ERROR;
		}

		return result;
	}

	termItem() {
		var token: any = this.lex.currentToken;

		if (token == "(") {
			var result = this.termBlock();
		} else if (token == "&" || token == "|" || token == ")" || token == "") //ここにキーワードが来るのはシンタックスエラー
			{
				console.log("ERROR: Syntax error, " + token + ".\n");
				this.status = ST_ERROR;
				return result;
			} else {
			if (this.debug) //シンタックスチェックモード
				//console.log "DEBUG: Depend Item = " . $token . "\n";
				//チェック時には全て結果をtrueとした
				{
					result = true;
				} else //実行モード
				//名前テーブルから結果を引いてくる
				//console.log "DEBUG: H_names[ ". $token  . "] = " . $this->H_names[ $token ] . "\n";
				{
					result = this.H_names[token];
				}
		}

		return result;
	}

};

export class TinyLex {
	str: any;
	currentToken: string | undefined;
	constructor(str0: any) {
		this.str = str0;
		this.currentToken = "";
	}

	nextToken() //console.log "DEBUG: str=" . $this->str . "\n";
	//文字列終了
	{
		for (var pos = 0; pos < this.str.length; pos++) {
			var letter = this.str[pos];

			switch (letter) {
				case "(":
					this.str = this.str.substr(pos + 1);
					return this.currentToken = "(";

				case ")":
					this.str = this.str.substr(pos + 1);
					return this.currentToken = ")";

				case "&":
					this.str = this.str.substr(pos + 1);
					return this.currentToken = "&";

				case "|":
					this.str = this.str.substr(pos + 1);
					return this.currentToken = "|";

				case " ":
				case "\t":
					break;

				default:
					var ln = this.str.split("/\\(|\\)|&|\\|/");
					this.str = this.str.substr(ln[0].length);
					return this.currentToken = ln[0].trim();
			}
		}

		return this.currentToken = undefined;
	}

};
