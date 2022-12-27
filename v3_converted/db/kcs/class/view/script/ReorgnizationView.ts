//
//祝日の更新
//
//error_reporting(E_ALL|E_STRICT);
//
//UpdateHolidayView
//
//@uses ViewBaseScript
//@package
//@author web
//@since 2017/12/14
//

require("view/script/ViewBaseScript.php");

require("MtScriptArgs.php");

//
//スクリプト実行オプション処理クラス
//
//@var mixed
//@access public
//
//var $O_MtScriptArgs;
//
//__construct
//
//@author web
//@since 2017/12/14
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2017/12/14
//
//@access public
//@return void
//
class ReorgnizationView extends ViewBaseScript {
	constructor() //親のコンストラクタを必ず呼ぶ
	//$A_arg_help[] = array(
	//                            "-u",
	//                            "CharSwitch",
	//                            "カレンダーデータの更新を行うかどうか（y/n）",
	//                            "y,n"
	//                        );
	//		$this->O_MtScriptArgs = new MtScriptArgs($A_arg_help);
	//		if(false == $this->O_MtScriptArgs->get_MtScriptArgsFlag()){
	//			$this->errorOut("パラメータが不正です\n");
	//		}
	//		// 定義された引数と渡された引数の整合性を確認
	////		$this->checkArg($this->O_MtScriptArgs);
	//-pがある場合、$A_args[pactid] = 引数として扱う
	//動作モードについて
	//idの指定
	//年月の指定
	//$m_argに値を入れていく
	//値チェックなど
	//エラーがあったら終わり
	{
		super();
		var A_arg_help = Array();
		var A_args = Array();
		var A_list = Array();
		A_list["-p"] = {
			name: "pactid",
			require: "-p(pactid)\u306F\u5FC5\u9808\u3067\u3059"
		};
		A_list["-m"] = {
			name: "mode",
			require: "-m(\u52D5\u4F5C\u30E2\u30FC\u30C9)\u5FC5\u9808\u3067\u3059",
			value: {
				read: "\u8AAD\u8FBC\u30E2\u30FC\u30C9",
				reorg: "\u7D44\u7E54\u306E\u518D\u7DE8\u6210\u3092\u884C\u3046",
				reorg2: "\u7D44\u7E54\u306E\u8AAD\u8FBC\u3068\u518D\u7DE8\u6210\u3092\u884C\u3046"
			}
		};
		A_list["-id"] = {
			name: "id"
		};
		A_list["-y"] = {
			name: "ym"
		};
		{
			let _tmp_0 = _SERVER.argv;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];

				if (key == 0) {
					continue;
				}

				var a = value.split("=");

				if (!(undefined !== A_list[a[0]])) {
					break;
				}

				var temp = A_list[a[0]];
				this.m_args[temp.name] = a[1];
			}
		}
		var error = false;

		for (var key in A_list) //必須チェック
		{
			var value = A_list[key];
			var arg = undefined !== this.m_args[value.name] ? this.m_args[value.name] : undefined;

			if (undefined !== value.require) {
				if (is_null(arg)) {
					echo(value.require + "\n");
					error = true;
				}
			}

			if (undefined !== value.value && !(undefined !== value.value[arg])) {
				echo(key + "\u306E\u5024\u3092\u898B\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\n");
			}
		}

		if (error) {
			this.errorOut("\u51E6\u7406\u7D42\u4E86\n");
		}
	}

	getArg(name) {
		if (!(undefined !== this.m_args[name])) {
			return undefined;
		}

		return this.m_args[name];
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};