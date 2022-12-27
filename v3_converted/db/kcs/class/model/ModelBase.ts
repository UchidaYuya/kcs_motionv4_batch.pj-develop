//error_reporting(E_ALL);
//
//あらゆるモデルの基底となるクラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@package Base
//@subpackage Model
//@filesource
//@author nakanita
//@since 2008/02/08
//
//
//
//あらゆるモデルの基底となるクラス
//
//@package Base
//@subpackage Model
//@author nakanita
//@since 2008/02/08
//

require("MtSetting.php");

require("MtOutput.php");

require("MtDateUtil.php");

require("MtDBUtil.php");

//
//共通設定クラス
//
//@var MtSetting
//@access private
//
//
//共通出力クラス
//
//@var MtOutput
//@access private
//
//
//共通日付操作クラス
//
//@var mixed
//@access private
//
//
//データベース接続オブジェクト
//
//@var object
//@access private
//
//
//テーブル構造格納用配列 <br>
//キー：テーブル名<br>
//
//@var array
//@access protected
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param object $O_db0 default=null ＤＢ接続オブジェクト
//@access public
//@return void
//
//
//基本設定を得る
//
//@author nakanita
//@since 2008/02/08
//
//@access protected
//@return object
//
//
//共通出力を得る
//
//@author nakanita
//@since 2008/02/08
//
//@access protected
//@return object
//
//
//日付操作クラスを得る
//
//@author nakanita
//@since 2008/06/30
//
//@access public
//@return void
//
//
//データベース接続オブジェクトを得る
//
//@author nakanita
//@since 2008/02/08
//
//@access protected
//@return void
//
//
//データベース接続オブジェクトを得る<br>
//エイリアス
//
//@author katsushi
//@since 2008/04/01
//
//@access protected
//@return void
//
//
//DEBUG出力
//
//@author nakanita
//@since 2008/02/08
//
//@param string $msg
//@param integer $disp
//@access protected
//@return void
//
//
//INFO出力
//
//@author nakanita
//@since 2008/02/08
//
//@param string $msg
//@param integer $disp
//@access protected
//@return void
//
//
//WARN出力
//
//@author nakanita
//@since 2008/02/08
//
//@param integer $code
//@param string $errstr
//@param integer $disp
//@access protected
//@return void
//
//
//ERROR出力
//
//@author nakanita
//@since 2008/02/08
//
//@param integer $code
//@param string $errstr
//@param integer $mailflg default=1 メール送信有り/無し
//@param string $goto
//@param string $buttonstr
//@access protected
//@return void
//
//
//出力用配列にセット <br>
//copy用
//
//@author
//@since 2010/12/02
//
//@param mixed $table
//@param mixed $A_outPut
//@param mixed $H_data
//@access public
//@return void
//
//
//テーブル構造取得
//
//@author
//@since 2010/12/02
//
//@param mixed $table
//@access public
//@return void
//
//
//fgetcsv拡張
//
//@author houshiyama
//@since 2011/04/19
//
//@param mixed $handle
//@param mixed $length
//@param string $d
//@param ' $'
//@param string $e
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ModelBase {
	constructor(O_db0 = undefined) {
		this.H_table = Array();
		this.O_Setting = MtSetting.singleton();
		this.O_Out = MtOutput.singleton();
		this.O_DateUtil = MtDateUtil.singleton();

		if (O_db0 === undefined) {
			this.O_Db = MtDBUtil.singleton();
		} else {
			this.O_Db = O_db0;
		}
	}

	getSetting() {
		return this.O_Setting;
	}

	getOut() {
		return this.O_Out;
	}

	getDateUtil() {
		return this.O_DateUtil;
	}

	get_DB() {
		return this.getDB();
	}

	getDB() {
		return this.O_Db;
	}

	debugOut(msg, disp = 1) {
		this.getOut().debugOut(msg, disp);
	}

	infoOut(msg, disp = 1) {
		this.getOut().infoOut(msg, disp);
	}

	warningOut(code, errstr = "", disp = 0) {
		this.getOut().warningOut(code, errstr, disp);
	}

	errorOut(code, errstr = "", mailflg = 1, goto = "", buttonstr = "") {
		this.getOut().errorOut(code, errstr, mailflg, goto, buttonstr);
	}

	setOutPut(table, A_outPut, H_data) {
		var H_table = this.getTableInfo(table);
		var H_tmp = Array();

		for (var col in H_table) {
			var H_info = H_table[col];

			if (-1 !== Object.keys(H_data).indexOf(col) == true) {
				H_tmp[col] = H_data[col];
			} else {
				if ("t" == H_info.notnull) {
					throw new Error(table + "\u306E" + col + "\u306Fnot null\u3067\u3059\n");
				}

				H_tmp[col] = undefined;
			}
		}

		A_outPut.push(H_tmp);
	}

	getTableInfo(table) {
		if (false == (-1 !== Object.keys(this.H_table).indexOf(table))) {
			var row;
			var sql = "SELECT\n\t                    a.attnum,\n\t                    n.nspname,\n\t                    c.relname,\n\t                    a.attname AS colname,\n\t                    t.typname AS type,\n\t                    a.atttypmod,\n\t                    FORMAT_TYPE(a.atttypid, a.atttypmod) AS complete_type,\n\t                    d.adsrc AS default_value,\n\t                    a.attnotnull AS notnull,\n\t                    a.attlen AS length,\n\t                    co.contype,\n\t                    ARRAY_TO_STRING(co.conkey, ',') AS conkey\n\t                FROM pg_attribute AS a\n\t                    JOIN pg_class AS c ON a.attrelid = c.oid\n\t                    JOIN pg_namespace AS n ON c.relnamespace = n.oid\n\t                    JOIN pg_type AS t ON a.atttypid = t.oid\n\t                    LEFT OUTER JOIN pg_constraint AS co ON (co.conrelid = c.oid\n\t                        AND a.attnum = ANY(co.conkey) AND co.contype = 'p')\n\t                    LEFT OUTER JOIN pg_attrdef AS d ON d.adrelid = c.oid AND d.adnum = a.attnum\n\t                WHERE a.attnum > 0 AND c.relname = '" + table + "' ORDER BY a.attnum";
			var res = pg_query(this.get_DB().getConnection(), sql);
			var H_table = Array();

			while (row = pg_fetch_assoc(res)) {
				H_table[row.colname] = row;
			}

			this.H_table[table] = H_table;
		}

		return this.H_table[table];
	}

	fgetcsv_reg(handle, length = undefined, d = ",", e = "\"") {
		d = preg_quote(d);
		e = preg_quote(e);
		var _line = "";
		var eof = false;

		while (eof != true) {
			_line += !length ? fgets(handle) : fgets(handle, length);
			var itemcnt = preg_match_all("/" + e + "/", _line, dummy);
			if (itemcnt % 2 == 0) eof = true;
		}

		var _csv_line = preg_replace("/(?:\r\n|[\r\n])?$/", d, _line.trim());

		var _csv_pattern = "/(" + e + "[^" + e + "]*(?:" + e + e + "[^" + e + "]*)*" + e + "|[^" + d + "]*)" + d + "/";

		preg_match_all(_csv_pattern, _csv_line, _csv_matches);
		var _csv_data = _csv_matches[1];

		for (var _csv_i = 0; _csv_i < _csv_data.length; _csv_i++) {
			_csv_data[_csv_i] = preg_replace("/^" + e + "(.*)" + e + "$/s", "$1", _csv_data[_csv_i]);
			_csv_data[_csv_i] = str_replace(e + e, e, _csv_data[_csv_i]);
		}

		return !_line ? false : _csv_data;
	}

	__destruct() {}

};