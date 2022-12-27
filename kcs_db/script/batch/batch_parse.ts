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

	termFormula() //$B:G=i$OI,$:(BItem$B$G;O$^$k(B
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
		} else if (token == "&" || token == "|" || token == ")" || token == "") //$B$3$3$K%-!<%o!<%I$,Mh$k$N$O%7%s%?%C%/%9%(%i!<(B
			{
				console.log("ERROR: Syntax error, " + token + ".\n");
				this.status = ST_ERROR;
				return result;
			} else {
			if (this.debug) //$B%7%s%?%C%/%9%A%'%C%/%b!<%I(B
				//console.log "DEBUG: Depend Item = " . $token . "\n";
				//$B%A%'%C%/;~$K$OA4$F7k2L$r(Btrue$B$H$7$?(B
				{
					result = true;
				} else //$B<B9T%b!<%I(B
				//$BL>A0%F!<%V%k$+$i7k2L$r0z$$$F$/$k(B
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
	//$BJ8;zNs=*N;(B
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
