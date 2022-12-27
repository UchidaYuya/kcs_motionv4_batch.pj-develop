
import ViewBaseScript from '../script/ViewBaseScript';

export class DeleteOrderView extends ViewBaseScript {

	m_arg_error: boolean;
	m_args: any;

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
			// let _tmp_0 = _SERVER.argv;
			let _tmp_0 = process.argv;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];

				if (key == "0") {
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
			var value_2 = A_list[key];
			var arg = undefined !== this.m_args[value_2.name] ? this.m_args[value_2.name] : undefined;

			if (undefined !== value_2.require) {
				// if (is_null(arg)) {
				if (!arg) {
// 					echo(value.require + "\n");// 2022cvt_010
					error = true;
				}
			}

			if (undefined !== value_2.value && !(undefined !== value_2.value[arg])) {
// 				echo(key + "\u306E\u5024\u3092\u898B\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\n");// 2022cvt_010
				{
					let _tmp_1 = value_2.value;

					for (var arg_key in _tmp_1) {
						var arg_help = _tmp_1[arg_key];
// 						echo("\t" + key + "=" + arg_key + "(" + arg_help + ")\n");// 2022cvt_010
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

	getArg(name: string) {
		if (!(undefined !== this.m_args[name])) {
			return undefined;
		}

		return this.m_args[name];
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
