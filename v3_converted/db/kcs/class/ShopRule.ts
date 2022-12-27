//
//会社登録で会社全体割引率が登録された時のチェック
//
//@package Base
//@subpackage Admin
//
//
// 概要： 販売店お客様新規登録・変更で各キャリアの発注権限を選択している場合に
// 		 販売店担当者が指定されているかチェックする
// 必要パラメータ：
// value[0] = 発注権限設定（チェックボックス）サーバー側チェックの場合は特定できない
// value[1] = 販売店担当者（プルダウン）サーバー側チェックの場合は特定できない
// options = チェックボックス「各キャリア発注権限」の値 
//
//
// 概要： NTTドコモクランプIDかパスワードのどちらかが入力されていた場合に
// 		 全ての入力項目が入力されているかチェックする
// 必要パラメータ：
// value[0] = NTTドコモクランプID
// value[1] = NTTドコモクランプパスワード
// value[2] = NTTドコモクランプパスワード確認用
//
//
// 概要： (au)ご請求コード、ユーザーID、キーファイルのどちらかが入力されていた場合に
// 		 全ての入力項目が入力されているかチェックする(変更)
// 必要パラメータ：
// value[0] = ご請求コード 
// value[1] = ユーザーID
// value[2] = キーファイル
//
//
// 概要： (au)ご請求コード、ユーザーID、パスワード、キーファイル、キーファイルの
//        パスワードのどちらかが入力されていた場合に全ての入力項目が入力されて
//        いるかチェックする
// 必要パラメータ：
// value[0] = ご請求コード
// value[1] = ユーザーID
// value[2] = パスワード
// value[3] = パスワード確認用
// value[4] = キーファイル
//
//
// 概要： (SB)管理者IDかパスワードのどちらかが入力されていた場合に
// 		 全ての入力項目が入力されているかチェックする
// 必要パラメータ：
// value[0] = 管理者ID
// value[1] = パスワード
// value[2] = パスワード確認用
//
//
// 概要： 販売店お客様新規登録・変更で各キャリアの親番号名称が入力されている場合に
// 		 親番号が入力されているかチェックする
// 必要パラメータ：
// value[0] = 親番号名称
// value[1] = 親番号
// options = 親番号の値 
//
//
// 概要： 販売店お客様新規登録・変更で各キャリアの発注権限を選択している場合に
// 		 販売店担当者が指定されているかチェックする
// 必要パラメータ：
// value[0] = 発注権限設定（チェックボックス）
// value[1] = 販売店担当者（プルダウン）
// options = チェックボックス「各キャリア発注権限」の値 
//

require("HTML/QuickForm.php");

require("HTML/QuickForm/Rule.php");

//
//QuickFormサーバ側のチェックを行うルール
//
//
//QuickFormクライアント側のチェックを行うルール
//
class checkDisratio extends HTML_QuickForm_Rule {
	validate(value, options) {
		if ("" != value) {
			if (false == is_numeric(value)) {
				return false;
			}

			switch (options[2]) {
				case "minnum":
					return value >= options[0];

				case "maxnum":
					return value <= options[0];

				default:
					return value >= options[0] && value <= options[1];
			}
		}

		return true;
	}

	getValidationScript(options = undefined) {
		switch (options[2]) {
			case "minnum":
				var test = "{jsVar} < " + options[0];
				break;

			case "maxnum":
				test = "{jsVar} > " + options[0];
				break;

			default:
				test = "({jsVar} < " + options[0] + " || {jsVar} > " + options[1] + ")";
		}

		return ["", `{jsVar} != '' && (true == isNaN({jsVar}) || ${test})`];
	}

};

class checkShopMem extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (value[0] == options && value[1] == "") {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //発注権限を付与する場合は販売店担当者を指定する
	{
		var jsCheck = `({jsVar}[0] == ${options} && {jsVar}[1] == '') || ({jsVar}[0] != ${options} && {jsVar}[1] != '')`;
		return ["", `${jsCheck}`];
	}

};

class checkShopDocomo extends HTML_QuickForm_Rule {
	validate(value) {
		if (value[0] == "" && value[1] == "" && value[2] == "") {
			return false;
		}

		return true;
	}

	getValidationScript(value = undefined) {
		var jsCheck = "(({jsVar}[0] != '') || ({jsVar}[1] != '') || ({jsVar}[2] != '')) && (({jsVar}[0] == '') || ({jsVar}[1] == '') || ({jsVar}[2] == ''))";
		return ["", `${jsCheck}`];
	}

};

class checkShopAuMod extends HTML_QuickForm_Rule {
	validate(value) {
		if (value[0] == "" && value[1] == "" && value[2] == "") {
			return false;
		}

		return true;
	}

	getValidationScript(value = undefined) {
		var jsCheck = "(({jsVar}[0] != '') || ({jsVar}[1] != '') || ({jsVar}[2] != '')) && (({jsVar}[0] == '') || ({jsVar}[1] == '') || ({jsVar}[2] == ''))";
		return ["", `${jsCheck}`];
	}

};

class checkShopAu extends HTML_QuickForm_Rule {
	validate(value) {
		if (value[0] == "" && value[1] == "" && value[2] == "" && value[3] == "" && value[4] == "") {
			return false;
		}

		return true;
	}

	getValidationScript(value = undefined) {
		var jsCheck = "(({jsVar}[0] != '') || ({jsVar}[1] != '') || ({jsVar}[2] != '') || ({jsVar}[3] != '') || ({jsVar}[4] != '')) && (({jsVar}[0] == '') || ({jsVar}[1] == '') || ({jsVar}[2] == '') || ({jsVar}[3] == '') || ({jsVar}[4] == ''))";
		return ["", `${jsCheck}`];
	}

};

class checkShopSb extends HTML_QuickForm_Rule {
	validate(value) {
		if (value[0] == "" && value[1] == "" && value[2] == "") {
			return false;
		}

		return true;
	}

	getValidationScript(value = undefined) {
		var jsCheck = "(({jsVar}[0] != '') || ({jsVar}[1] != '') || ({jsVar}[2] != '')) && (({jsVar}[0] == '') || ({jsVar}[1] == '') || ({jsVar}[2] == ''))";
		return ["", `${jsCheck}`];
	}

};

class checkPrnameAndPrtel extends HTML_QuickForm_Rule {
	validate(value, options) //親番号名称が入力されている場合は親番号が必須になる
	{
		if (value[0] != options && value[1] == "") {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //親番号名称が入力されている場合は親番号が必須になる
	{
		var jsCheck = `{jsVar}[0] != ${options} && {jsVar}[1] == ''`;
		return ["", `${jsCheck}`];
	}

};

class checkHotOrderFunction extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (!value) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //発注権限を付与する場合は販売店担当者を指定する
	{
		var jsCheck = "(chkfunction([" + options.join(",") + "]) == false)";
		return ["", `${jsCheck}`];
	}

};