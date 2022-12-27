//===========================================================================
//機能：外部プロセス実行と、起動時パラメータの取得型
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：ARGV処理型
//ARGVの値は、-パラメータ固定部(追加パラメータ)=値

require("script_log.php");

//パラメータ固定部から設定へのハッシュ。
//パラメータ固定部が「*」なら固定部なし(ファイル名等)
//ハッシュの値部分は、そのパラメータの設定。
//パラメータの設定は以下のフォーマットに従う。
//type	パラメータの値としてとりうる型
//keytype	パラメータの固定部の後に付く型
//typeとkeytypeは{string|int}
//ARGVから取り出したパラメータ配列
//パラメータは{key,value,addkey}
//発生したエラー配列
//エラーは{type,message}で、typeはログ種別
//機能：コンストラクタ
//引数：処理パラメータ
//機能：処理パラメータを追加する
//備考：すでにある設定と衝突した場合は、新しく追加した方が優先される
//引数：処理パラメータ
//機能：エラーを保存する
//備考：protected
//引数：ログ種別
//ログメッセージ
//機能：ARGVを処理する
//引数：ARGV(nullならグローバルのARGVを使用する)
//最初の一個を無視するならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：ARGVの要素を処理する
//引数：ARGVの中の一つの要素
//返値：深刻なエラーが発生したらfalseを返す
//機能：型検査を行う
//備考：protected
//引数：型検査を行う値(変換を行う事もある)
//変換後の型({int|string})
//返値：深刻なエラーが発生したらfalseを返す
//機能：クラス内部に蓄積しているログを出力する
//引数：ログ型
//蓄積してあるログをクリアするならtrue
class ScriptArgs {
	ScriptArgs(A_setting) {
		this.m_A_setting = Array();
		this.addSetting(A_setting);
		this.m_A_args = Array();
		this.m_A_error = Array();
	}

	addSetting(A_setting) {
		for (var key in A_setting) {
			var value = A_setting[key];
			this.m_A_setting[key] = value;
		}
	}

	putError(type, message) {
		this.m_A_error.push({
			type: type,
			message: message
		});
	}

	readAll(A_argv, skip_first = true) {
		if (!(undefined !== A_argv)) A_argv = _SERVER.argv;
		var first = true;
		if (!skip_first) first = false;

		for (var argv of Object.values(A_argv)) {
			if (first) {
				first = false;
				continue;
			}

			if (!this.read(argv)) return false;
		}

		return true;
	}

	read(argv) {
		{
			let _tmp_0 = this.m_A_setting;

			for (var key in _tmp_0) {
				var setting = _tmp_0[key];
				if (0 == strcmp(key, "*")) var key = "";

				if (key.length) {
					var sub = argv.substr(1, key.length);
					if (strcmp(sub, key)) continue;
				}

				var param = Array();
				param.key = key;
				if (key.length) argv = argv.substr(1 + key.length);

				if (undefined !== setting.keytype) {
					var pos = strpos(argv, "=");

					if (0 == pos.length) {
						this.putError(G_SCRIPT_ERROR, `追加固定部の後にイコールがない${argv}`);
						return false;
					}

					param.addkey = argv.substr(0, pos);
					if (!this.checkType(param.addkey, setting.keytype)) return false;
					argv = argv.substr(pos);
				}

				if (undefined !== setting.type) {
					pos = strpos(argv, "=");

					if (0 == pos.length) {
						if (key.length) {
							this.putError(G_SCRIPT_ERROR, `値部の前にイコールがない${argv}`);
							return false;
						}

						pos = -1;
					}

					param.value = argv.substr(pos + 1);
					if (!this.checkType(param.value, setting.type)) return false;
				}

				this.m_A_args.push(param);
				return true;
			}
		}
		this.putError(G_SCRIPT_ERROR, `未定義引数${argv}`);
		return false;
	}

	checkType(value, type) {
		switch (type) {
			case "string":
				break;

			case "int":
				if (!ctype_digit(value)) {
					this.putError(G_SCRIPT_ERROR, `型チェック失敗int(${value})`);
					return false;
				}

				break;

			default:
				this.putError(G_SCRIPT_ERROR, `未定義の型${type}`);
				return false;
		}

		return true;
	}

	writeLog(log, clear_log = true) {
		for (var error of Object.values(this.m_A_error)) log.put(error.type, error.message);

		if (clear_log) this.m_A_error = Array();
	}

};

//子プロセスが標準出力に何か出したら不正終了
//ScriptLog型が出していない場合のログ種別
//ログをWARNINGとして出力しないならtrue
//機能：コンストラクタ
//引数：エラー処理型
//子プロセスが標準出力に何か出したら不正終了するならtrue
//ScriptLog型が出していない場合のログ種別
//機能：外部コマンドを実行する
//引数：コマンド名
//引数配列({key,value,addkey}の配列)
//追加引数
//返値：深刻なエラーが発生したらfalseを返す
//機能：外部コマンドを実行する
//引数：コマンド名
//コマンドラインオプション
//返値：深刻なエラーが発生したらfalseを返す
//機能：外部コマンドを実行する
//引数：コマンドライン文字列
//返値：深刻なエラーが発生したらfalseを返す
//機能：コマンドに使用する文字をエスケープする
//引数：変換元の文字列
//返値：変換後の文字列
class ScriptCommand extends ScriptLogAdaptor {
	ScriptCommand(listener, stdout_fault = false, unknown_type = G_SCRIPT_WARNING) {
		this.ScriptLogAdaptor(listener, false);
		this.m_stdout_fault = stdout_fault;
		this.m_unknown_type = unknown_type;
		this.m_stop_warning = false;
	}

	execute(cmd, A_args, A_addargs) {
		var A_newargs = Array();
		var all_args = [A_args, A_addargs];

		for (var one_args of Object.values(all_args)) {
			for (var args of Object.values(one_args)) {
				var arg = "";
				if (undefined !== args.key) arg += "-" + args.key;
				if (undefined !== args.addkey) arg += args.addkey;

				if (undefined !== args.value) {
					if (undefined !== args.key && args.key.length) arg += "=";
					arg += args.value;
				}

				if (arg.length) A_newargs.push(arg);
			}
		}

		return this.executeRaw(cmd, A_newargs);
	}

	executeRaw(cmd, A_args) {
		var line = cmd;

		for (var arg of Object.values(A_args)) line += " " + this.escape(arg);

		return this.executeCommand(line);
	}

	executeCommand(line) //実行結果がエラーならログ出力
	{
		var A_rval = Array();
		var rval = undefined;
		exec(line, A_rval, rval);
		var A_temp = Array();

		for (var msg of Object.values(A_rval)) {
			if (msg.length) A_temp.push(msg);
		}

		A_rval = A_temp;
		var status = true;

		if (0 != rval) {
			if (this.m_stop_warning) this.putError(G_SCRIPT_INFO, `プロセス実行結果${rval}(${line})`);else this.putError(G_SCRIPT_WARNING, `プロセス実行結果${rval}(${line})`);
			status = false;
		}

		for (var msg of Object.values(A_rval)) {
			mb_detect_order("UTF-8");
			var enc = mb_detect_encoding(msg);
			var msg = mb_convert_encoding(msg, "UTF-8", enc);
			if (this.m_stdout_fault) status = false;
			if (this.m_listener.isLabel(msg)) this.m_listener.put(this.m_unknown_type, msg);else if (0 != this.m_unknown_type) this.putError(this.m_unknown_type, `未定義出力 ${msg}`);
		}

		return status;
	}

	escape(var) {
		return escapeshellcmd(escapeshellarg(var));
	}

};