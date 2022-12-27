//
//au・softbankのシミュレーションバッチビュー
//
//更新履歴：<br>
//2009/10/28 宮澤龍彦 作成
//
//@uses ViewBaseScript
//@package AdminSim
//@filesource
//@subpackage View
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/10/27
//
//
//error_reporting(E_ALL);
//
//au・softbankのシミュレーションバッチビュー
//
//@uses ViewSmarty
//@package AdminSim
//@subpackage View
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/10/27
//

require("view/script/ViewBaseScript.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgs.php");

require("HTTP/Client.php");

//
//受け付け引数の処理クラス
//
//@var MtScriptArgsImport
//@access public
//
//
//clamp_index_tbのアップデートする年
//
//@var MtScriptArgsImport
//@access public
//
//
//clamp_index_tbのアップデートする月
//
//@var MtScriptArgsImport
//@access public
//
//
//clamp_index_tbのアップデートするcarid
//
//@var MtScriptArgsImport
//@access public
//
//
//バッチの実行環境
//
//@var MtScriptArgsImport
//@access public
//
//
//モーションかホットラインか（pact_tbのtype）
//
//@var MtScriptArgsImport
//@access public
//
//
//コンストラクター
//
//@author miyazawa
//@since 2009/10/27
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2009/10/27
//
//@access public
//@return void
//
class AdminSimView extends ViewBaseScript {
	constructor() //デフォルトではモーション、「H」が指定されたらホットライン
	{
		super();
		var A_arg_help = [["-y", "YYYYMMnone", "\u5E74\u6708\uFF08none\u306B\u3059\u308B\u3068\u5F53\u6708\uFF09"], ["-c", "pactidNotAll", "\u30AD\u30E3\u30EA\u30A2ID"], ["-e", "CharSwitch", "\u5B9F\u884C\u74B0\u5883\uFF08dev/try/check/pay/honban\uFF09", "dev,try,check,pay,honban"], ["-t", "CharSwitch", "\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u304B\u3069\u3046\u304B\uFF08H/all\uFF09", "H,all"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\n");
		}

		var argsflg_y = false;
		var argsflg_c = false;
		var argsflg_e = false;
		this.UpdPactType = "M";

		for (var value of Object.values(this.A_Argv)) //引数を=で分割
		{
			var A_each = value.split("=");

			if ("-y" == A_each[0] && "" != A_each[1]) {
				if ("none" != A_each[1] && 6 == A_each[1].length) {
					this.UpdYear = A_each[1].substr(0, 4);
					this.UpdMonth = A_each[1].substr(4, 2);
					argsflg_y = true;
				} else {
					this.UpdYear = date("Y");
					this.UpdMonth = date("m");
					argsflg_y = true;
				}
			} else if ("-c" == A_each[0] && "" != A_each[1]) {
				this.UpdCarid = A_each[1];
				argsflg_c = true;
			} else if ("-u" == A_each[0] && "" != A_each[1]) {
				this.UpdColumn = A_each[1];
				var argsflg_u = true;
			} else if ("-e" == A_each[0] && "" != A_each[1]) {
				this.UpdEnv = A_each[1];
				argsflg_e = true;
			} else if ("-t" == A_each[0] && "" != A_each[1]) {
				if ("H" == A_each[1]) {
					this.UpdPactType = "H";
				}
			}
		}

		if (false == argsflg_y) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\u3002clamp_index_tb\u306E\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3059\u308B\u5E74\u6708\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\uFF08YYYYMM/none\uFF09\n");
		}

		if (false == argsflg_c) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\u3002clamp_index_tb\u306E\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3059\u308Bcarid\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\n");
		}

		if (false == argsflg_e) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\u3002\u30D0\u30C3\u30C1\u306E\u5B9F\u884C\u74B0\u5883\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\uFF08dev/try/check/pay/honban\uFF09\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};