require("view/script/ViewBaseScript.php");

//
//__construct
//
//@author igarashi
//@since 2011/09/13
//
//@access public
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/09/13
//
//@access public
//@return void
//
class DeleteOrderView extends ViewBaseScript {
	constructor() //$m_argに値を入れていく
	//値チェックなど
	//エラーがあったら終わり
	//if( $error ){
	//$this->errorOut("処理終了\n");
	//}
	{
		super();
		this.m_arg_error = true;
		var A_arg_help = Array();
		var A_args = Array();
		var A_list = Array();
		A_list["-files"] = {
			name: "files"
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
				{
					let _tmp_1 = value.value;

					for (var arg_key in _tmp_1) {
						var arg_help = _tmp_1[arg_key];
						echo("\t" + key + "=" + arg_key + "(" + arg_help + ")\n");
					}
				}
				error = true;
			}
		}

		this.m_arg_error = error;
	}

	checkArgError() {
		return this.m_arg_error;
	}

	getArg(name) {
		if (!(undefined !== this.m_args[name])) {
			return undefined;
		}

		return this.m_args[name];
	}

	__destruct() {
		super.__destruct();
	}

};