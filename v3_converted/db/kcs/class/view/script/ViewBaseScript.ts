//
//バッチの基底となるクラス
//
//更新履歴：<br>
//2008/02/25 石崎公久 作成
//
//@package Base
//@subpackage View
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/02/25
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ViewBaseScript
//
//@uses ViewBase
//@abstract
//@package Base
//@subpackage View
//@author ishizaki
//@since 2008/02/25
//

require("view/ViewBase.php");

//
//コマンドラインからの引数を格納
//
//@var array
//@access private
//
//
//コマンドラインからの引数をハッシュ分割して格納
//
//@var array
//@access protected
//
//
//起動時のスクリプトの名前が格納される
//
//@var text
//@access protected
//
//
//コンストラクター
//
//@author ishizaki
//@since 2008/02/25
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//引数の配列を$A_Argvに格納する
//
//@author ishizaki
//@since 2008/02/25
//
//@param array $A_argv
//@access protected
//@return void
//
//
//起動したスクリプトのヘルプを表示
//
//起動時に設定した（デフォルト値を含むかは子クラスしだい）<br>
//ヘルプを表示しプログラムを終了する
//
//@author ishizaki
//@since 2008/03/05
//
//@param MtScriptArgs $O_relation_Args
//@access public
//@return void
//更新履歴
//タイプYYYYMMnoneを追加(請求データ自動ダウンロードで使用) 2009/06/03 s.Maeda
//タイプpostLevelを追加(大和ハウス請求データ調整で使用) 2009/06/18 s.Maeda
//タイプYYYYMMDDnoneを追加(交通費自動ダウンロードで使用) 2010/05/07 miyazawa
//タイプstringを追加 2011/01/21 houshiyama
//
//
//実際の引数と引数の妥当性を検証する。
//
//実際の引数と引数の妥当性を検証する。<br>
//1.実際の引数の数と引数の制約の数を比べる
//
//@author ishizaki
//@since 2008/02/27
//
//@param MtScriptArgsImport $O_relation_Args
//@access public
//@return void
//更新履歴
//タイプYYYYMMnoneを追加(請求データ自動ダウンロードで使用) 2009/06/03 s.Maeda
//タイプpostLevelを追加(大和ハウス請求データ調整で使用) 2009/06/18 s.Maeda
//タイプYYYYMMDDnoneを追加(交通費自動ダウンロードで使用) 2010/05/07 miyazawa
//
//
//起動時のスクリプトの名前を受け取る
//
//@author ishizaki
//@since 2008/03/06
//
//@final
//@access public
//@return void
//
//
//整形された引数を返す
//
//@author ishizaki
//@since 2008/03/06
//
//@final
//@access public
//@return void
//
//
//メンバー変数 H_Argv を返す
//
//引数が指定された場合は H_Argv から対応する
//値を返し、指定が無い場合はハッシュ全体を返す
//
//@author ishizaki
//@since 2008/03/06
//
//@param string $type default = null
//@final
//@access public
//@return void
//
//
//指定した引数が存在するかチェック
//
//@author web
//@since 2012/03/12
//
//@param mixed $type
//@access public
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class ViewBaseScript extends ViewBase {
	constructor() {
		super();
		this.ArgCountCheck = true;
		this.set_Argv(_SERVER.argv);
	}

	set_Argv(A_argv: {} | any[] = Array()) {
		A_argv.shift();
		this.ScriptName = basename(_SERVER.PHP_SELF);
		this.A_Argv = A_argv;
	}

	showHelp(O_relation_Args: MtScriptArgs) {
		var H_relation = O_relation_Args.get_HArg();
		var viewLine = "";
		this.infoOut("\n");
		this.infoOut("\u3000\u30D7\u30ED\u30B0\u30E9\u30E0\u306E\u4F7F\u7528\u65B9\u6CD5\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\n");
		this.infoOut("\u3000" + this.get_ScriptName() + "\t");

		for (var key in H_relation) {
			var A_value = H_relation[key];

			switch (A_value[0]) {
				case "CharSwitch":
					this.infoOut(key + "=[");
					this.infoOut(str_replace(",", "|", A_value[2]));
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
					this.infoOut("pactid(\u6570\u5B57\u306E\u307F)");
					break;

				case "tableno":
					this.infoOut(key + "=[");
					this.infoOut("tableno(\u6570\u5B57\u306E\u307F)");
					break;

				case "carid":
					this.infoOut(key + "=[");
					this.infoOut("carid(\u6570\u5B57\u306E\u307F)");
					break;

				case "pactidExcept":
					this.infoOut(key + "=[");
					this.infoOut("pactid(\u6570\u5B57\u306E\u307F)\u30AB\u30F3\u30DE\u533A\u5207\u308A|none");
					break;

				case "flag":
					this.infoOut("[" + key);
					break;

				case "postLevel":
					this.infoOut(key + "=[");
					this.infoOut("\u90E8\u7F72\u968E\u5C64(\u6570\u5B57\u306E\u307F)");
					break;

				case "integer":
					this.infoOut(key + "=[");
					this.infoOut("\u6570\u5024");
					break;

				case "string":
					this.infoOut(key + "=[");
					this.infoOut("\u6587\u5B57\u5217");
					break;

				default:
					this.infoOut(key);
					this.errorOut(0, "\u4E88\u671F\u305B\u306C\u5F15\u6570\u5F62\u5F0F\u3067\u3059:" + A_value[0] + "\n");
					throw die(-1);
			}

			viewLine += "\t" + key + ": " + A_value[1] + "\n";
			this.infoOut("] ");
		}

		this.infoOut("\n");
		this.infoOut("\n");
		this.infoOut(viewLine);
		this.infoOut("\n");
		throw die(-1);
	}

	checkArg(O_relation_Args: MtScriptArgs) //実際の引数の数と引数の制約の数を比べる
	{
		var H_relation_args = O_relation_Args.get_HArg();
		var relation_quant = H_relation_args.length;

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

					var A_rule = split(",", H_relation_args[argv[0]][2]);

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

					if (false == is_numeric(argv[1]) || 6 != argv[1].length) {
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

					if ("none" != argv[1] && (false == is_numeric(argv[1]) || 6 != argv[1].length)) {
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

					if ("none" != argv[1] && (false == is_numeric(argv[1]) || 8 != argv[1].length)) {
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

					if ("all" != argv[1] && false == is_numeric(argv[1])) {
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

					if (false == is_numeric(argv[1])) {
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
					this.errorOut(0, "\u4E88\u671F\u305B\u306C\u5F15\u6570\u5F62\u5F0F\u3067\u3059:" + A_value[0] + "\n");
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

	get_HArgv(type = undefined) {
		if (type != undefined) {
			return this.H_Argv[type];
		}

		return this.H_Argv;
	}

	issetHArgv(type) {
		if (undefined !== this.H_Argv[type]) {
			return true;
		} else {
			return false;
		}
	}

	__destruct() {
		super.__destruct();
	}

};