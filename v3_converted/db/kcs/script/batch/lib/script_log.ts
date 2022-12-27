//===========================================================================
//機能：エラー処理
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：文字コードを変換して出力する
//---------------------------------------------------------------------------
//機能：エラー処理の基底型
const G_SCRIPT_DEBUG = 1;
const G_SCRIPT_INFO = 2;
const G_SCRIPT_WARNING = 4;
const G_SCRIPT_ERROR = 8;
const G_SCRIPT_BEGIN = 16;
const G_SCRIPT_END = 32;
const G_SCRIPT_SQL = 64;
const G_SCRIPT_ALL = 127;

function fwrite_conv(msg, fd = STDOUT) {
	if ("mb_output_handler" == ini_get("output_handler") && (STDERR === fd || STDOUT === fd)) {
		fwrite(fd, msg);
	} else {
		fwrite(fd, msg);
	}
};

//他のエラー処理型への配列
//このエラー処理型が処理するメッセージ種別
//メッセージ種別から、処理したエラー個数への変換表
//共通ログの出力インスタンス
//機能：コンストラクタ
//引数：処理するメッセージ種別
//機能：他のエラー処理型を追加する
//機能：エラーを受け取る
//引数：メッセージ種別
//メッセージ
//機能：メッセージを整形せずに出力する
//備考：改行文字は付与しない
//引数：メッセージ
//機能：エラーを処理する仮装メソッド
//引数：メッセージ種別
//メッセージ
//機能：メッセージ種別に応じたラベルを返す
//引数：メッセージ種別
//返値：ラベル
//機能：行の先頭がメッセージ種別ならtrueを返す
//引数：検査する文字列
//機能：共通ログを出力する
//引数：メッセージ種別
//メッセージ
class ScriptLogBase {
	ScriptLogBase(type) {
		this.m_type = type;
		this.m_A_counter = Array();
		this.m_A_listener = Array();
	}

	putListener(listener) {
		if (undefined !== listener) this.m_A_listener.push(listener);
	}

	put(type, message) {
		for (var listener of Object.values(this.m_A_listener)) if (undefined !== listener) listener.put(type, message);

		if (type & this.m_type) {
			if (!(undefined !== this.m_A_counter[type])) this.m_A_counter[type] = 1;else this.m_A_counter[type] = 1 + this.m_A_counter[type];
			this.do_put(type, message);
		}
	}

	putRaw(message) {}

	do_put(type, message) {
		var subject = this.toLabel(type) + ">" + message + "\n";
		if (G_SCRIPT_SQL == type) subject = message + "\n";
		this.putRaw(subject);
	}

	toLabel(type) {
		switch (type) {
			case G_SCRIPT_DEBUG:
				return "@DEBUG" + date("Y/m/j H:i:s");

			case G_SCRIPT_INFO:
				return "@INFO" + date("Y/m/j H:i:s");

			case G_SCRIPT_WARNING:
				return "@WARNING" + date("Y/m/j H:i:s");

			case G_SCRIPT_ERROR:
				return "@ERROR" + date("Y/m/j H:i:s");

			case G_SCRIPT_BEGIN:
				return "@BEGIN" + date("Y/m/j H:i:s");

			case G_SCRIPT_END:
				return "@END" + date("Y/m/j H:i:s");

			case G_SCRIPT_SQL:
				return "";
		}

		return `unknown(${type})`;
	}

	isLabel(message) {
		if (preg_match("/@DEBUG/", message)) return true;
		if (preg_match("/@INFO/", message)) return true;
		if (preg_match("/@WARNING/", message)) return true;
		if (preg_match("/@ERROR/", message)) return true;
		if (preg_match("/@BEGIN/", message)) return true;
		if (preg_match("/@END/", message)) return true;
		return false;
	}

	putOperator(type, message) {
		if (undefined !== this.m_operator) this.m_operator.putOperator(type, message);
	}

};

//ログファイル名
//機能：日時をつけたファイル名を作る
//備考：ファイル名の中の%sが、yyyymmddhhmmssに置き換わる。
//同じ秒数にこのメソッドを呼び出すと、日付時刻部分が同じになる。
//備考：スタティック呼び出し可能
//引数：ファイル名
//機能：コンストラクタ
//引数：ファイル名
//処理するメッセージ種別
//機能：メッセージを整形せずに出力する
//備考：改行文字は付与しない
//引数：メッセージ
class ScriptLogFile extends ScriptLogBase {
	makeFileName(tgtname) {
		return str_replace("%s", date("YmdHis"), tgtname);
	}

	ScriptLogFile(type, tgtname) {
		this.ScriptLogBase(type);
		this.m_file_name = tgtname;
	}

	putRaw(message) {
		if (!strcasecmp(this.m_file_name, "stdout")) {
			fwrite_conv(message);
			return;
		}

		if (!strcasecmp(this.m_file_name, "stderr")) {
			fwrite_conv(message, STDERR);
			return;
		}

		var fp = fopen(this.m_file_name, "at");

		if (!fp) {
			fwrite_conv(message);
			return;
		}

		fwrite_conv(message, fp);
		fclose(fp);
	}

};

//エラー処理型
//ERROR種別でログ出力した時、exitするならtrue
//機能：コンストラクタ
//引数：エラー処理型
//ERROR種別でログ出力した時、exitするならtrue
//機能：ログ出力を行う
//引数：メッセージ種別
//メッセージ
//機能：共通ログを出力する
//引数：メッセージ種別
//メッセージ
class ScriptLogAdaptor {
	ScriptLogAdaptor(listener, exit_on_error) {
		this.m_listener = listener;
		this.m_exit_on_error = exit_on_error;
	}

	putError(type, message) {
		if (G_SCRIPT_SQL == type) this.m_listener.put(type, message);else this.m_listener.put(type, this.constructor.name + "::" + message);
		if (this.m_exit_on_error && G_SCRIPT_ERROR & type) throw die(1);
	}

	putOperator(type, message) {
		this.m_listener.putOperator(type, message);
	}

};