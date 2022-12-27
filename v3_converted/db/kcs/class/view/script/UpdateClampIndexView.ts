//
//clamp_index_tbアップデートビュー
//
//更新履歴：<br>
//2009/10/28 宮澤龍彦 作成
//
//@uses ViewBaseScript
//@package UpdateClampIndex
//@filesource
//@subpackage View
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/10/27
//
//
//error_reporting(E_ALL);
//
//clamptask_tb消去ビュー
//
//@uses ViewSmarty
//@package UpdateClampIndex
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
//clamp_index_tbのアップデートするpactid
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
//clamp_index_tbのアップデートするカラム名
//
//@var MtScriptArgsImport
//@access public
//
//
//clamp_index_tbのアップデートする内容
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
class UpdateClampIndexView extends ViewBaseScript {
	constructor() {
		super();
		var A_arg_help = [["-y", "YYYYMM", "\u5E74\u6708"], ["-p", "pactidNotAll", "\u5951\u7D04ID"], ["-c", "pactidNotAll", "\u30AD\u30E3\u30EA\u30A2ID"], ["-u", "CharSwitch", "\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3059\u308B\u30AB\u30E9\u30E0", "is_ready,is_details,is_comm,is_info,is_calc,is_trend,is_recom"], ["-r", "CharSwitch", "\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u5185\u5BB9\uFF08true/false\uFF09", "true,false"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\n");
		}

		var argsflg_y = false;
		var argsflg_p = false;
		var argsflg_c = false;
		var argsflg_u = false;
		var argsflg_r = false;

		for (var value of Object.values(this.A_Argv)) //引数を=で分割
		{
			var A_each = value.split("=");

			if ("-y" == A_each[0] && "" != A_each[1]) {
				if (6 == A_each[1].length) {
					this.UpdYear = A_each[1].substr(0, 4);
					this.UpdMonth = A_each[1].substr(4, 2);
					argsflg_y = true;
				}
			} else if ("-p" == A_each[0] && "" != A_each[1]) {
				this.UpdPactid = A_each[1];
				argsflg_p = true;
			} else if ("-c" == A_each[0] && "" != A_each[1]) {
				this.UpdCarid = A_each[1];
				argsflg_c = true;
			} else if ("-u" == A_each[0] && "" != A_each[1]) {
				this.UpdColumn = A_each[1];
				argsflg_u = true;
			} else if ("-r" == A_each[0] && "" != A_each[1]) {
				this.UpdResult = A_each[1];
				argsflg_r = true;
			}
		}

		if (false == argsflg_y) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\u3002clamp_index_tb\u306E\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3059\u308B\u5E74\u6708\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\n");
		}

		if (false == argsflg_p) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\u3002clamp_index_tb\u306E\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3059\u308Bpactid\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\n");
		}

		if (false == argsflg_c) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\u3002clamp_index_tb\u306E\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3059\u308Bcarid\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\n");
		}

		if (false == argsflg_u) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\u3002clamp_index_tb\u306E\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u3059\u308B\u30AB\u30E9\u30E0\u540D\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\n");
		}

		if (false == argsflg_r) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\u3002clamp_index_tb\u306E\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\u5185\u5BB9\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\n");
		}

		this.checkArg(this.O_MtScriptArgs);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};