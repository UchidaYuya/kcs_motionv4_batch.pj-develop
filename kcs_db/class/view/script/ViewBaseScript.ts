//バッチの基底となるクラス
//
//更新履歴：<br>
//2008/02/25 石崎公久 作成
import MtScriptArgs from '../../MtScriptArgs';
import ViewBase from '../ViewBase';
const path = require('path');

export default class ViewBaseScript extends ViewBase {
	ArgCountCheck: boolean;
	ScriptName!: string;
	A_Argv: any[] = Array();
	H_Argv: any[] = Array();

	constructor() {
		super();
		this.ArgCountCheck = true;
		const argv = process.argv.filter(parameter => parameter.match("="));
		this.set_Argv(argv);
	}

	set_Argv(A_argv : string[] = Array()){
		A_argv = A_argv.filter(parameter => parameter.match("="));
		this.ScriptName = path.basename(__filename);
		this.A_Argv = A_argv;
	}

	showHelp(O_relation_Args: MtScriptArgs) {
		var H_relation = O_relation_Args.get_HArg();
		var viewLine = "";
		this.infoOut("\n");
		this.infoOut("　プログラムの使用方法が正しくありません。\n");
		this.infoOut("　" + this.get_ScriptName() + "\t");

		for (var key in H_relation) {
			var A_value = H_relation[key];
			switch (A_value[0]) {
				case "CharSwitch":
					this.infoOut(key + "=[");
					this.infoOut(A_value[2].replace(",", "|"));
					break;

				case "YYYYMM":
					this.infoOut(key + "=[");
					this.infoOut(A_value[0]);
					break;

				case "YYYYMMnone":
					this.infoOut(key + "=[");
					this.infoOut("YYYYMM|none");
					break;

				case "YYYYMMDDnone":
					this.infoOut(key + "=[");
					this.infoOut("YYYYMMDD|none");
					break;

				case "pactid":
					this.infoOut(key + "=[");
					this.infoOut("all|pactid");
					break;

				case "pactidNotAll":
					this.infoOut(key + "=[");
					this.infoOut("pactid(数字のみ)");
					break;

				case "tableno":
					this.infoOut(key + "=[");
					this.infoOut("tableno(数字のみ)");
					break;

				case "carid":
					this.infoOut(key + "=[");
					this.infoOut("carid(数字のみ)");
					break;

				case "pactidExcept":
					this.infoOut(key + "=[");
					this.infoOut("pactid(数字のみ)カンマ区切り|none");
					break;

				case "flag":
					this.infoOut("[" + key);
					break;

				case "postLevel":
					this.infoOut(key + "=[");
					this.infoOut("部署階層(数字のみ)");
					break;

				case "integer":
					this.infoOut(key + "=[");
					this.infoOut("数値");
					break;

				case "string":
					this.infoOut(key + "=[");
					this.infoOut("文字列");
					break;

				default:
					this.infoOut(key);
					this.errorOut(0, "予期せぬ引数形式です:" + A_value[0] + "\n");
					throw process.exit(-1);// 2022cvt_009
			}

			viewLine += "\t" + key + ": " + A_value[1] + "\n";
			this.infoOut("] ");
		}

		this.infoOut("\n");
		this.infoOut("\n");
		this.infoOut(viewLine);
		this.infoOut("\n");
		throw process.exit(-1);// 2022cvt_009
	}

	checkArg(O_relation_Args: MtScriptArgs) //実際の引数の数と引数の制約の数を比べる
	{
		const H_relation_args = O_relation_Args.get_HArg();
		const relation_quant = Object.keys(H_relation_args).length;

		if (this.ArgCountCheck == true && relation_quant != this.A_Argv.length) {
			this.showHelp(O_relation_Args);
		}

		for (var value of Object.values(this.A_Argv)) //引数を=で分割
		//引数の妥当性に設定された以外のタイプが渡された場合
		{
			var argv = value.split("=");
			if (undefined !== H_relation_args[argv[0]] == false) {
				this.showHelp(O_relation_Args);
			}

			switch (H_relation_args[argv[0]][0]) {
				case "CharSwitch":
					if (false == (undefined !== argv[1])) {
						this.showHelp(O_relation_Args);
					}

					var A_rule = H_relation_args[argv[0]][2].split(",");

					if (false == (-1 !== A_rule.indexOf(argv[1]))) {
						this.showHelp(O_relation_Args);
					}

					if (true == (undefined !== this.H_Argv[argv[0]])) {
						this.showHelp(O_relation_Args);
					}

					this.H_Argv[argv[0]] = argv[1];
					break;

				case "YYYYMM":
					if (false == (undefined !== argv[1])) {
						this.showHelp(O_relation_Args);
					}

					if (false == !isNaN(Number(argv[1])) || 6 != argv[1].length) {
						this.showHelp(O_relation_Args);
					}

					if (true == (undefined !== this.H_Argv[argv[0]])) {
						this.showHelp(O_relation_Args);
					}

					this.H_Argv[argv[0]] = argv[1];
					break;

				case "YYYYMMnone":
					if (false == (undefined !== argv[1])) {
						this.showHelp(O_relation_Args);
					}

					if ("none" != argv[1] && (false == !isNaN(Number(argv[1])) || 6 != argv[1].length)) {
						this.showHelp(O_relation_Args);
					}

					if (true == (undefined !== this.H_Argv[argv[0]])) {
						this.showHelp(O_relation_Args);
					}

					this.H_Argv[argv[0]] = argv[1];
					break;

				case "YYYYMMDDnone":
					if (false == (undefined !== argv[1])) {
						this.showHelp(O_relation_Args);
					}

					if ("none" != argv[1] && (false == !isNaN(Number(argv[1])) || 8 != argv[1].length)) {
						this.showHelp(O_relation_Args);
					}

					if (true == (undefined !== this.H_Argv[argv[0]])) {
						this.showHelp(O_relation_Args);
					}

					this.H_Argv[argv[0]] = argv[1];
					break;

				case "pactid":
					if (false == (undefined !== argv[1])) {
						this.showHelp(O_relation_Args);
					}

					if ("all" != argv[1] && false == !isNaN(Number(argv[1]))) {
						this.showHelp(O_relation_Args);
					}

					if (true == (undefined !== this.H_Argv[argv[0]])) {
						this.showHelp(O_relation_Args);
					}

					this.H_Argv[argv[0]] = argv[1];
					break;

				case "pactidNotAll":
				case "tableno":
				case "carid":
				case "postLevel":
				case "integer":
					if (false == (undefined !== argv[1])) {
						this.showHelp(O_relation_Args);
					}

					if (false == !isNaN(Number(argv[1]))) {
						this.showHelp(O_relation_Args);
					}

					if (true == (undefined !== this.H_Argv[argv[0]])) {
						this.showHelp(O_relation_Args);
					}

					this.H_Argv[argv[0]] = argv[1];
					break;

				case "pactidExcept":
					if (true == (undefined !== this.H_Argv[argv[0]])) {
						this.showHelp(O_relation_Args);
					}

					this.H_Argv[argv[0]] = argv[1];
					break;

				case "flag":
					if (true == (undefined !== this.H_Argv[argv[0]])) {
						this.showHelp(O_relation_Args);
					}

					this.H_Argv[argv[0]] = argv[1];
					break;

				case "string":
					this.H_Argv[argv[0]] = argv[1];
					break;

				default:
					this.errorOut(0, "予期せぬ引数形式です:" + argv[0] + "\n");
					break;
			}
		}
	}

	get_ScriptName() {
		return this.ScriptName;
	}

	get_Argv() {
		return this.A_Argv;
	}

	get_HArgv(type: string | undefined = undefined ) {
		if (type != undefined) {
			return this.H_Argv[type];
		}

		return this.H_Argv;
	}

	issetHArgv(type: string | number) {
		if (undefined !== this.H_Argv[type]) {
			return true;
		} else {
			return false;
		}
	}
};
