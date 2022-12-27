//===========================================================================
//バッチマネージャー、Dependのための構文解析
//Boolean変数を & | ( ) で連結した書式を扱う
//2007/12/06  T.Nakanishi
//===========================================================================
//// 定数定義：batch_manager本体に移行した
//define("ST_NORMAL", 0 );		// 正常
//define("ST_ERROR",  10 );	// エラー
////////////////////////////////////////////////////
//構文解析
//END TinyParser
////////////////////////////////////////////////////
//字句解析
//END TinyLex
////////////////////////////////////////////////////
//テスト用のメインルーチン
//$str = "( hoge & (gege | pass) | (hgoe | mogei) )";
//$str = "( hoge & (gege | pass) | (hgoe | mogei) ) & ";
//$str = "( pass & (hgoe | mogei) )";
//$str = "(hoge&gege|pass&(hgoe|mogei))";
//$str = " hoge | ( gege & pass ) ";
//$str = "hoge & gege & pass | hgoe & mogei";
//$str = "hoge | gege";
//$str = "hoge";
//構文解析のチェック
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
//字句解析のチェック
//$lex = new TinyLex( $str );
//while( ($token = $lex->nextToken()) != null ){
//print $token . "\n";
//}
//exit(0);

//字句解析
//名前 => flag となっているHashテーブル
//実際の利用の際には、ここにBoolean変数をセットする
//コンストラクター
//シンタックスチェック
//実行
//式の扱い: 式とは、アイテムを & か | で連結したもの
//Formula := Item & Item | Item
//ブロックの扱い、Blockとは、式を ( ) で囲んだもの
//Block := ( Formula )
//アイテムの扱い、アイテムとは、ブロック又は変数のこと
//Item := Block 又は Variable
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

	termFormula() //最初は必ずItemで始まる
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
		} else if (token == "&" || token == "|" || token == ")" || token == "") //ここにキーワードが来るのはシンタックスエラー
			{
				print("ERROR: Syntax error, " + token + ".\n");
				this.status = ST_ERROR;
				return result;
			} else {
			if (this.debug) //シンタックスチェックモード
				//print "DEBUG: Depend Item = " . $token . "\n";
				//チェック時には全て結果をtrueとした
				{
					result = true;
				} else //実行モード
				//名前テーブルから結果を引いてくる
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
					var ln = preg_split("/\\(|\\)|&|\\|/", this.str);
					this.str = this.str.substr(ln[0].length);
					return this.currentToken = ln[0].trim();
			}
		}

		return this.currentToken = undefined;
	}

};