//
//管理者　会社登録時でのQuickFormルール
//
//@filesource
//@package Base
//@subpackage Admin
//
//
//
//会社登録で会社全体割引率が登録された時のチェック
//
//@package Base
//@subpackage Admin
//
//
//会社登録・変更で「公私分計」を選択している場合にデフォルトパターンが指定されているかチェックする
//
//@package Base
//@subpackage Admin
//
//
//会社登録・変更で親番号名称が登録されたときのチェックルール
//
//@package Base
//@subpackage Admin
//
//
// 概要： 会社新規登録画面でau請求DL情報が入力されていた場合に
//        全ての入力項目が入力されているかチェックする
//        20090928miya
// 必要パラメータ：
// value[0] = auご請求コード
// value[1] = auユーザーID
// value[2] = auパスワード
// value[3] = auパスワード確認用
// value[4] = auキーファイル
//
//
// 概要： 会社登録変更画面でau請求DL情報が入力されていた場合に
//        全ての入力項目が入力されているかチェックする
//        20090928miya
// 必要パラメータ：
// value[0] = auご請求コード
// value[1] = auユーザーID
// value[2] = auキーファイル
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

//
//QuickFormサーバ側のチェックを行うルール
//
//@param array [0]デフォルト設定（ラジオボタン） [1]公私分計する際のデフォルトパターン（プルダウン）
//@param str options ラジオボタン「公私分計する」の値
//@return bool
//
//
//QuickFormクライアント側のチェックを行うルール
//
//@param str options ラジオボタン「公私分計する」の値
//@return bool
//
class checkDefaultSel extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (value[0] == options && value[1] == "") {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //「公私分計する」を選択している場合はデフォルトパターンを指定する
	{
		var jsCheck = `{jsVar}[0] == ${options} && {jsVar}[1] == ''`;
		return ["", `${jsCheck}`];
	}

};

//
//QuickFormサーバ側のチェックを行うルール
//
//@param array [0]親番号名称 [1]公私分計する際のデフォルトパターン（プルダウン）
//@param str options クイックフォームのオプション
//@return bool
//
//
//QuickFormクライアント側のチェックを行うルール
//
//@param str options クリックフォームのオプション
//@return bool
//
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

class checkAuDownloadParamNew extends HTML_QuickForm_Rule {
	validate(value) {
		if (value[0] == "" && value[1] == "" && value[2] == "" && value[3] == "" && value[4] == "") {
			return false;
		}

		return true;
	}

	getValidationScript(value = undefined) //$jsCheck = "(({jsVar}[0] != '') || ({jsVar}[1] != '') || ({jsVar}[2] != '') || ({jsVar}[3] != '') || ({jsVar}[4] != '')) && (({jsVar}[0] == '') || ({jsVar}[1] == '') || ({jsVar}[2] == '') || ({jsVar}[3] == '') || ({jsVar}[4] == ''))";
	{
		var jsCheck = "(({jsVar}[0] != '') || ({jsVar}[1] != '') || ({jsVar}[2] != '') || ({jsVar}[3] != '')) && (({jsVar}[0] == '') || ({jsVar}[1] == '') || ({jsVar}[2] == '') || ({jsVar}[3] == ''))";
		return ["", `${jsCheck}`];
	}

};

class checkAuDownloadParamMod extends HTML_QuickForm_Rule {
	validate(value) {
		if (value[0] == "" && value[1] == "") {
			return false;
		}

		return true;
	}

	getValidationScript(value = undefined) {
		var jsCheck = "(({jsVar}[0] != '') || ({jsVar}[1] != '')) && (({jsVar}[0] == '') || ({jsVar}[1] == ''))";
		return ["", `${jsCheck}`];
	}

};