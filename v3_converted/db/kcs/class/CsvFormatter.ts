//
//CSVファイルを作成する
//
//更新
//20040602森原 区切り文字をタブに/ダブルクォートを無しに
//
//@package Base
//@subpackage CsvFormatter
//@since 20040527
//@author 森原
//
//
//
//
//CSVファイルを作成する
//
//更新
//20040602森原 区切り文字をタブに/ダブルクォートを無しに
//
//@package Base
//@subpackage CsvFormatter
//@since 20040527
//@author 森原
//
//

//
//区切り文字
//
//@var mixed
//@access public
//
//
//
//改行文字
//
//@var mixed
//@access public
//
//
//
//セルを囲む文字
//
//@var mixed
//@access public
//
//
//
//コンストラクタ
//
//@param string $delim 区切り文字
//@param string $lf 改行文字
//@param string $qt 文字列クオート
//@access public
//@return void
//
//
//
//ダブルクォートをエスケープする
//
//@param str $str エスケープ対象文字列
//@access public
//@return str エスケープ後の文字列
//
//
//
//配列をつないで行を返す。末尾に改行文字がつく
//
//@param mixed $A_src 連結する配列
//@access public
//@return str CSVファイルを構成する文字列
//
//
//
//DB_ResultからCSVファイルを作る(CSVファイルのヘッダ行は作らない)
//
//@param mixed $O_src DB_Result型のインスタンス
//@access public
//@return str CSVファイルの中身
//
//
//
//二次元配列からCSVファイルを作る(CSVファイルのヘッダ行は作らない)
//
//@param mixed $A_src 二次元配列
//@access public
//@return str CSVファイルの中身
//
//
//
//実態は toFileO
//
//@param mixed $O_src DB_Result型のインスタンス
//@access public
//@return str CSVファイルの中身
//@use toFileO
//
//
//
//文字コードを変換する静的メソッド
//
//@param mixed $src CSVファイルの中身
//@access public
//@return str 変換した中身
//
//
class CsvFormatter {
	CsvFormatter(delim = "\t", lf = "\n", qt = "") {
		this.delimiter = delim;
		this.linefeed = lf;
		this.quote = qt;
	}

	toEscape(str) {
		if ("" == this.quote) return str;
		return str_replace(quote, quote + quote, str);
	}

	toLine(A_src) {
		var str = "";
		var limit = A_src.length;

		for (var cnt = 0; cnt < limit; ++cnt) {
			if (cnt) str += this.delimiter;
			str += this.quote + this.toEscape(A_src[cnt]) + this.quote;
		}

		return str + this.linefeed;
	}

	toFileO(O_src) {
		var limit = O_src.numRows();
		var str = "";

		for (var cnt = 0; cnt < limit; ++cnt) str += this.toLine(O_src.fetchRow(DB_FETCHMODE_ORDERED, cnt));

		return str;
	}

	toFileA(A_src) {
		var limit = A_src.length;
		var str = "";

		for (var cnt = 0; cnt < limit; ++cnt) str += this.toLine(A_src[cnt]);

		return str;
	}

	toFile(O_src) {
		return toFileO(O_src);
	}

	toSjis(src) {
		src = mb_convert_encoding(src, "SJIS-win", "UTF-8");
		return src;
	}

};