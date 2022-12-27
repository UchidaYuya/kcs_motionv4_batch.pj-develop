//===========================================================================
//$B%P%C%A%^%M!<%8%c!<!"(BDepend$B$N$?$a$N9=J82r@O(B
//Boolean$BJQ?t$r(B & | ( ) $B$GO"7k$7$?=q<0$r07$&(B
//2007/12/06  T.Nakanishi
//===========================================================================
//// $BDj?tDj5A!'(Bbatch_manager$BK\BN$K0\9T$7$?(B
//define("ST_NORMAL", 0 );		// $B@5>o(B
//define("ST_ERROR",  10 );	// $B%(%i!<(B
////////////////////////////////////////////////////
//$B9=J82r@O(B
//END TinyParser
////////////////////////////////////////////////////
//$B;z6g2r@O(B
//END TinyLex
////////////////////////////////////////////////////
//$B%F%9%HMQ$N%a%$%s%k!<%A%s(B
//$str = "( hoge & (gege | pass) | (hgoe | mogei) )";
//$str = "( hoge & (gege | pass) | (hgoe | mogei) ) & ";
//$str = "( pass & (hgoe | mogei) )";
//$str = "(hoge&gege|pass&(hgoe|mogei))";
//$str = " hoge | ( gege & pass ) ";
//$str = "hoge & gege & pass | hgoe & mogei";
//$str = "hoge | gege";
//$str = "hoge";
//$B9=J82r@O$N%A%'%C%/(B
//$parser = new TinyParser( $str );
//$parser->H_names = array(
//"hoge" => true,
//"gege" => false,
//"pass" => true,
//"hgoe" => false,
//"mogei" => true
//);
//
//$parser->check();
//$result = $parser->execute();
//print "DEBUG: result = " . $result . ".\n";
//$B;z6g2r@O$N%A%'%C%/(B
//$lex = new TinyLex( $str );
//while( ($token = $lex->nextToken()) != null ){
//print $token . "\n";
//}
//exit(0);

//$B;z6g2r@O(B
//$BL>A0(B => flag $B$H$J$C$F$$$k(BHash$B%F!<%V%k(B
//$B<B:]$NMxMQ$N:]$K$O!"$3$3$K(BBoolean$BJQ?t$r%;%C%H$9$k(B
//$B%3%s%9%H%i%/%?!<(B
//$B%7%s%?%C%/%9%A%'%C%/(B
//$B<B9T(B
//$B<0$N07$$(B: $B<0$H$O!"%"%$%F%`$r(B & $B$+(B | $B$GO"7k$7$?$b$N(B
//Formula := Item & Item | Item
//$B%V%m%C%/$N07$$!"(BBlock$B$H$O!"<0$r(B ( ) $B$G0O$s$@$b$N(B
//Block := ( Formula )
//$B%"%$%F%`$N07$$!"%"%$%F%`$H$O!"%V%m%C%/Kt$OJQ?t$N$3$H(B
//Item := Block $BKt$O(B Variable
class TinyParser {
	TinyParser(str) {
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
		var nextToken;

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
					print("Syntax Error, \"" + nextToken + "\"\n");
					return result;
			}
		}

		return result;
	}

	termBlock() {
		var result = this.termFormula();

		if (this.lex.currentToken != ")") {
			print("ERROR: Missing ), " + this.lex.currentToken + "\n");
			this.status = ST_ERROR;
		}

		return result;
	}

	termItem() {
		var token = this.lex.currentToken;

		if (token == "(") {
			var result = this.termBlock();
		} else if (token == "&" || token == "|" || token == ")" || token == "") //$B$3$3$K%-!<%o!<%I$,Mh$k$N$O%7%s%?%C%/%9%(%i!<(B
			{
				print("ERROR: Syntax error, " + token + ".\n");
				this.status = ST_ERROR;
				return result;
			} else {
			if (this.debug) //$B%7%s%?%C%/%9%A%'%C%/%b!<%I(B
				//print "DEBUG: Depend Item = " . $token . "\n";
				//$B%A%'%C%/;~$K$OA4$F7k2L$r(Btrue$B$H$7$?(B
				{
					result = true;
				} else //$B<B9T%b!<%I(B
				//$BL>A0%F!<%V%k$+$i7k2L$r0z$$$F$/$k(B
				//print "DEBUG: H_names[ ". $token  . "] = " . $this->H_names[ $token ] . "\n";
				{
					result = this.H_names[token];
				}
		}

		return result;
	}

};

class TinyLex {
	TinyLex(str0) {
		this.str = str0;
		this.currentToken = "";
	}

	nextToken() //print "DEBUG: str=" . $this->str . "\n";
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
					var ln = preg_split("/\\(|\\)|&|\\|/", this.str);
					this.str = this.str.substr(ln[0].length);
					return this.currentToken = ln[0].trim();
			}
		}

		return this.currentToken = undefined;
	}

};