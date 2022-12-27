//
//請求DLエラーメール
//
//更新履歴：<br>
//2009/07/03 宮澤 作成
//
//@package script
//@subpackage View
//@users ViewBaseScript
//@uses MtSetting
//@uses MtOutput
//@uses MtScriptArgs
//@filesource
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/07/03
//
//
//error_reporting(E_ALL);
//
//価格表お知らせメール
//
//@package Shop
//@subpackage View
//@author miyazawa
//@since 2009/07/03
//

require("view/script/ViewBaseScript.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgs.php");

//メール送信しないフラグ追加20101129morihara
//
//スクリプト実行オプション処理クラス
//
//@var mixed
//@access public
//
//
//メールを送信しないならtrue
//
//@var boolean
//@access public
//
//
//コンストラクター
//
//@author miyazawa
//@since 2009/07/03
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2009/07/03
//
//@access public
//@return void
//
class DLErrorMailView extends ViewBaseScript {
	constructor() //メール送信しないフラグ追加20101129morihara
	{
		super();
		var A_arg_help = [["-s", "flag", "\u30E1\u30FC\u30EB\u9001\u4FE1\u3057\u306A\u3044"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\n");
		}

		this.is_dump = false;

		for (var value of Object.values(this.A_Argv)) //引数を=で分割
		{
			var A_each = value.split("=");
			if ("-s" === A_each[0]) this.is_dump = true;
		}
	}

	__destruct() {
		super.__destruct();
	}

};