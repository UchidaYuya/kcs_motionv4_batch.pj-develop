//
// カード番号、半角スペース、-を除いた同一チェック
// 必要パラメータ：
// 第１引数 = 元カード番号
//
//
// カード移動時の部署の必須チェック
// 移動予定キャンセル時は、部署は必須
// 必要パラメータ：
// 第１引数 = 部署ID
//
//
// 概要：数値項目に数値以外が入力されていないかチェック（検索フォーム埋め込み）
// 必要パラメータ：
// value = 数値項目
//
//
// 概要：日付項目に不足がないかチェック（検索フォーム埋め込み）
// 必要パラメータ：
// value = 日付項目
//

require("HTML/QuickForm.php");

require("HTML/QuickForm/Rule.php");

//end func getValidationScript
class checkModCardno extends HTML_QuickForm_Rule {
	validate(value, options = undefined) {
		var cardno_input = value.replace(/(-|\s)/g, "");
		var cardno_org = options.replace(/(-|\s)/g, "");

		if (cardno_org != cardno_input) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) {
		var jsFirstProcess = "\n\t\torg_text = '" + options + "';\n\t\ttext = form.cardno_view.value;\n\t\ttext = text.split('-');\n\t\ttext = text.join('');\n\t\ttext = text.split(' ');\n\t\ttext = text.join('');\n\t\t\n";
		var jsCheck = "(org_text != text)";
		return [`${jsFirstProcess}`, `${jsCheck}`];
	}

};

//end func getValidationScript
class movePostRequire extends HTML_QuickForm_Rule {
	validate(values) {
		if (values == "") {
			return false;
		} else {
			return true;
		}
	}

	getValidationScript(options = undefined) {
		var jsCheck = "({jsVar} == '')";
		return ["", `${jsCheck}`];
	}

};

class checkNumericVal extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (value.column != "0" && value.val != "" && preg_match("/[^0-9]/", value.val) != 0) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) {
		var jsVars = "value = frm.elements['numeric[val]'].value;\n\t\t\t\tvar regex = /(^-?\\d\\d*\\.\\d*$)|(^-?\\d\\d*$)|(^-?\\.\\d\\d*$)/;\n";
		var jsCheck = "frm.elements['numeric[column]'].value != 0 && value != '' && !regex.test(value) && !errFlag['numeric[val]']\n";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

class checkDateVal extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (value.column != "0" && (value.val.Y != "" || value.val.m != "" || value.val.d != "")) {
			if (value.val.Y == "" || value.val.m == "" || value.val.d == "") {
				return false;
			} else {
				ltrim(value.val.m, "0");
				ltrim(value.val.d, "0");

				if (checkdate(value.val.m, value.val.d, value.val.Y) == false) {
					return false;
				}

				return true;
			}
		}

		return true;
	}

	getValidationScript(options = undefined) {
		var jsVars = "col = frm.elements['date[column]'].value;\n\n\t\t\t\terrcnt = 0;\n\t\t\t\tval_y = frm.elements['date[val][Y]'].value;\n\n\t\t\t\tval_m = frm.elements['date[val][m]'].value;\n\n\t\t\t\tval_d = frm.elements['date[val][d]'].value;\n\n\t\t\t\tif(val_m == 04 || val_m == 06 || val_m == 09 || val_m == 11){\n\t\t\t\t\tif(val_d > 30){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif(val_m == 02){\n\t\t\t\t\tif(val_d > 29){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t\tif(val_y%4 == 0){\n\t\t\t\t\t\tif(val_y%100 == 0 && val_y%400 != 0){\n\t\t\t\t\t\t\tif(val_d > 28){\n\t\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\telse{\n\t\t\t\t\t\tif(val_d > 28){\n\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t";
		var jsCheck = "col != 0 && (errcnt > 0 || (val_y != '' && (val_m == '' || val_d == '')) || (val_m != '' && (val_y == '' || val_d == '')) || (val_d != '' && (val_y == '' || val_m == '')))";
		return [`${jsVars}`, `${jsCheck}`];
	}

};