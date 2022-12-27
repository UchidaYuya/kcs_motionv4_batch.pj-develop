//
// 電話()-を除いた同一チェック
// 必要パラメータ：
// 第１引数 = 元電話番号
//
//
// 電話()-を除いた同一チェック（電話管理の変更、変更予約用）
// 必要パラメータ：
// 第１引数 = 元電話番号
//
//
// 電話会社と地域会社の対の必須チェック
// 電話会社選択時は、地域会社は必須
// 必要パラメータ：
// 第１引数 = 電話会社ＩＤ
// 第２引数 = 地域会社ＩＤ
//
//
// 電話移動時の部署の必須チェック
// 移動予定キャンセル時は、部署は必須
// 必要パラメータ：
// 第１引数 = 部署名称
// 第２引数 = ラジオボタンの値
//
//
// 日付の大小チェック +チェックボックスの状態を考慮
// 移動予定キャンセル時は、部署は必須
// 必要パラメータ：
// 第１引数 = 対象日付１
// 第２引数 = 対象日付２
// 第３引数 = ラジオボタンの値
//
//
// 日付の正当性チェック +チェックボックスの状態を考慮
// 移動予定キャンセル時は、部署は必須
// 必要パラメータ：
// 第１引数 = 対象日付１
// 第２引数 = ラジオボタンの値
//
//end class HTML_QuickForm_Rule_Checkdate
//
// 概要： 電話登録・変更で「公私分計する」を選択している場合に
//        デフォルトパターンが指定されているかチェックする
// 必要パラメータ：
// value[0] = デフォルト設定（ラジオボタン）
// value[1] = 公私分計する際のデフォルトパターン（プルダウン）
// options = ラジオボタン「公私分計する」の値
//
//
// 日付の大小チェック +チェックボックスの状態を考慮
// 移動予定キャンセル時は、部署は必須
// 必要パラメータ：
// 第１引数 = ラジオボタンの値と日付プルダウンの値が入った配列
// 第２引数 = 日付範囲の過去limit
//
//
// 日付の大小チェック
// 移動予定キャンセル時は、部署は必須
// 必要パラメータ：
// 第１引数 = ラジオボタンの値と日付プルダウンの値が入った配列
// 第２引数 = 日付範囲の過去limit
//
//
// 概要： 電話登録日で「予約」にチェックしている場合に
//		予約日が入力されているかチェック
// 必要パラメータ：
// value[0] = 登録タイプ（ラジオボタン）
// value[1] = 予約日（プルダウン）
// options = ラジオボタンの値
//
//
// 概要： 電話登録日で「予約」にチェックしている場合に
// 		予約日が明日から２ヶ月の範囲にあるかチェック
// 必要パラメータ：
// value = 予約日（プルダウン）
//
//
// 概要：予約日が明日から２ヶ月の範囲にあるかチェック
// 必要パラメータ：
// value = 予約日（プルダウン）
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
class checkModTelno extends HTML_QuickForm_Rule {
	validate(value, options = undefined) {
		var telno_input = str_replace("-", "", value);
		telno_input = str_replace("(", "", telno_input);
		telno_input = str_replace(")", "", telno_input);
		var telno_org = str_replace("-", "", options);
		telno_org = str_replace("(", "", telno_org);
		telno_org = str_replace(")", "", telno_org);

		if (telno_org != telno_input) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) {
		var jsFirstProcess = "\n\t\torg_text = '" + options + "';\n\t\torg_text = org_text.split('(');\n\t\torg_text = org_text.join('');\n\t\torg_text = org_text.split(')');\n\t\torg_text = org_text.join('');\n\t\torg_text = org_text.split('-');\n\t\torg_text = org_text.join('');\n\t\ttext = firstForm.telno_view.value;\n\t\ttext = text.split('(');\n\t\ttext = text.join('');\n\t\ttext = text.split(')');\n\t\ttext = text.join('');\n\t\ttext = text.split('-');\n\t\ttext = text.join('');\n\t\t\n";
		var jsCheck = "(org_text != text)";
		return [`${jsFirstProcess}`, `${jsCheck}`];
	}

};

//end func getValidationScript
class checkModTelno2 extends HTML_QuickForm_Rule {
	validate(value, options = undefined) {
		var telno_input = str_replace("-", "", value);
		telno_input = str_replace("(", "", telno_input);
		telno_input = str_replace(")", "", telno_input);
		var telno_org = str_replace("-", "", options);
		telno_org = str_replace("(", "", telno_org);
		telno_org = str_replace(")", "", telno_org);

		if (telno_org != telno_input) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) {
		var jsFirstProcess = "\n\t\torg_text = '" + options + "';\n\t\torg_text = org_text.split('(');\n\t\torg_text = org_text.join('');\n\t\torg_text = org_text.split(')');\n\t\torg_text = org_text.join('');\n\t\torg_text = org_text.split('-');\n\t\torg_text = org_text.join('');\n\t\ttext = document.getElementById('telno_view').value;\n\t\ttext = text.split('(');\n\t\ttext = text.join('');\n\t\ttext = text.split(')');\n\t\ttext = text.join('');\n\t\ttext = text.split('-');\n\t\ttext = text.join('');\n\t\t\n";
		var jsCheck = "(org_text != text)";
		return [`${jsFirstProcess}`, `${jsCheck}`];
	}

};

//end func getValidationScript
class movePairRequire extends HTML_QuickForm_Rule {
	validate(values) {
		if (values[1] == -1) {
			return true;
		} else {
			if (values[0] == -1) {
				return false;
			} else {
				return true;
			}
		}
	}

	getValidationScript(options = undefined) {
		var jsCheck = "({jsVar}[0]!='-1' && {jsVar}[1]=='-1')";
		return ["", `${jsCheck}`];
	}

};

//end func getValidationScript
class movePostRequire extends HTML_QuickForm_Rule {
	validate(values) {
		if (values[1] == "movecancel") {
			return true;
		} else {
			if (values[0] == "") {
				return false;
			} else {
				return true;
			}
		}
	}

	getValidationScript(options = undefined) {
		var jsCheck = "({jsVar}[0]=='' && {jsVar}[1][0]=='hi_shitei') || ({jsVar}[0]=='' && {jsVar}[1][0]=='shitei')";
		return ["", `${jsCheck}`];
	}

};

class datecomparePlus extends HTML_QuickForm_Rule {
	constructor() {
		super(...arguments);
		this._operators = {
			eq: "==",
			neq: "!=",
			gt: ">",
			gte: ">=",
			lt: "<",
			lte: "<="
		};
	}

	_findOperator(name) {
		if (!name) {
			return "==";
		} else if (undefined !== this._operators[name]) {
			return this._operators[name];
		} else if (-1 !== this._operators.indexOf(name)) {
			return name;
		} else {
			return "==";
		}
	}

	validate(values, operator = undefined) {
		if (values[2] != "shitei") {
			return true;
		} else {
			operator = this._findOperator(operator);
			var new Function("$a, $b", "return mktime(0,0,0,$a[\"m\"],$a[\"d\"],$a[\"Y\"]) " + operator + " mktime(0,0,0,$b[\"m\"],$b[\"d\"],$b[\"Y\"]);");
			return compareFn(values[0], values[1]);
		}
	}

	getValidationScript(operator = undefined) {
		operator = this._findOperator(operator);
		var check1 = "{jsVar}[2][0] == 'shitei'";
		var check2 = `!(Number(makeTime({jsVar}[0])) ${operator} Number(makeTime({jsVar}[1])))`;
		return ["", `'' != {jsVar}[0] && ( ${check1} && ${check2} )`];
	}

};

//end func validate
//end func getValidationScript
class checkdatePlus extends HTML_QuickForm_Rule {
	validate(value, options = undefined) {
		if (values[1] != "shitei") {
			return true;
		} else {
			if (value.m + value.d + value.Y != "") {
				if (value.m == "" || value.d == "" || value.Y == "") {
					return false;
				}

				if (checkdate(value.m, value.d, value.Y) == false) {
					return false;
				}
			}
		}

		return true;
	}

	getValidationScript(options = undefined) {
		var check1 = "{jsVar}[1] == 'shitei'";
		return ["", `Check_Date({jsVar}[0]) && ${check1}`];
	}

};

class checkDefaultSel extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (value[0] == options && value[1] == -1) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //「公私分計する」を選択している場合はデフォルトパターンを指定する
	{
		var jsCheck = `{jsVar}[0] == ${options} && {jsVar}[1] == -1`;
		return ["", `${jsCheck}`];
	}

};

class checkMoveLimitDate extends HTML_QuickForm_Rule {
	validate(value, options = undefined) {
		var val = mktime(0, 0, 0, value[1].m, value[1].d, value[1].Y) * 1000;

		if (value[0] == "shitei" && (val < options[1] || val > options[0])) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //予約日の範囲を調べる
	{
		var jsCheck = `({jsVar}[0] == 'shitei' && (Check_Date({jsVar}[1]) || ${options[1]} > Number(makeTime({jsVar}[1])) || ${options[0]} < Number(makeTime({jsVar}[1]))))`;
		return [`${jsVars}`, `${jsCheck}`];
	}

};

class checkDelLimitDate extends HTML_QuickForm_Rule {
	validate(value, options = undefined) {
		var val = date("Ymd", mktime(0, 0, 0, value.m, value.d, value.Y));
		var max = date("Ymd", mktime(0, 0, 0, date("m") + 3, 0, date("Y")));

		if (val < options || val > max) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //予約日の範囲を調べる
	{
		var max = date("Ymd", mktime(0, 0, 0, date("m") + 3, 0, date("Y")));
		var jsVars = "var year = value[0];\n\t\t\t\tvar mon = value[1];\n\t\t\t\tvar day = value[2];\n\t\t\t\terrcnt = 0;\n\t\t\t\tif(mon < 10){\n\t\t\t\t\tmon = \"0\" + mon;\n\t\t\t\t}\n\t\t\t\tif(mon == 04 || mon == 06 || mon == 09 || mon == 11){\n\t\t\t\t\tif(day >30){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif(mon == 02){\n\t\t\t\t\tif(day > 29){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t\tif(year%4 == 0){\n\t\t\t\t\t\tif(year%100 == 0 && year%400 != 0){\n\t\t\t\t\t\t\tif(day > 28){\n\t\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\telse{\n\t\t\t\t\t\tif(day > 28){\n\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif(day < 10){\n\t\t\t\t\tday = \"0\" + day;\n\t\t\t\t}\n\t\t\t\tvar r_date = year + mon + day;\n\t\t\t\tvar max = " + max + ";\n";
		var jsCheck = `errcnt != 0 || ${options} > r_date || max < r_date`;
		return [`${jsVars}`, `${jsCheck}`];
	}

};

class checkReserveDateOnRadio extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (value[0] == options && (value[1].Y == "" || value[1].m == "" || value[1].d == "")) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //「予約」を選択している場合は年月日を指定する
	{
		var jsCheck = `{jsVar}[0] == '${options}' && ({jsVar}[1][0] == '' || {jsVar}[1][1] == '' || {jsVar}[1][2] == '')`;
		return ["", `${jsCheck}`];
	}

};

class checkLimitReserveDateOnRadio extends HTML_QuickForm_Rule {
	validate(value, options) {
		var val = date("Ymd", mktime(0, 0, 0, value[1].m, value[1].d, value[1].Y));
		var min = date("Ymd", mktime(0, 0, 0, date("m"), date("d") + 1, date("Y")));
		var max = date("Ymd", mktime(0, 0, 0, date("m") + 3, 0, date("Y")));

		if (value[0] == options && (min > val || val > max)) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //予約日の範囲を調べる
	{
		var min = date("Ymd", mktime(0, 0, 0, date("m"), date("d") + 1, date("Y")));
		var max = date("Ymd", mktime(0, 0, 0, date("m") + 3, 0, date("Y")));
		var jsVars = "var year = value[1][0];\n\t\t\t\tvar mon = value[1][1];\n\t\t\t\tvar day = value[1][2];\n\t\t\t\terrcnt = 0;\n\t\t\t\tif(mon < 10){\n\t\t\t\t\tmon = \"0\" + mon;\n\t\t\t\t}\n\t\t\t\tif(mon == 04 || mon == 06 || mon == 09 || mon == 11){\n\t\t\t\t\tif(day >30){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif(mon == 02){\n\t\t\t\t\tif(day > 29){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t\tif(year%4 == 0){\n\t\t\t\t\t\tif(year%100 == 0 && year%400 != 0){\n\t\t\t\t\t\t\tif(day > 28){\n\t\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\telse{\n\t\t\t\t\t\tif(day > 28){\n\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif(day < 10){\n\t\t\t\t\tday = \"0\" + day;\n\t\t\t\t}\n\t\t\t\tvar r_date = year + mon + day;\n\t\t\t\tvar min = " + min + ";\n\t\t\t\tvar max = " + max + ";\n";
		var jsCheck = `errcnt != 0 || ({jsVar}[0] == '${options}' && (min > r_date || max < r_date))`;
		return [`${jsVars}`, `${jsCheck}`];
	}

};

class checkLimitReserveDate extends HTML_QuickForm_Rule {
	validate(value, options = undefined) {
		var val = date("Ymd", mktime(0, 0, 0, value.m, value.d, value.Y));
		var min = date("Ymd", mktime(0, 0, 0, date("m"), date("d") + 1, date("Y")));

		if (options != undefined) {
			var max = options;
		} else {
			max = date("Ymd", mktime(0, 0, 0, date("m") + 3, 0, date("Y")));
		}

		if (min > val || val > max) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //予約日の範囲を調べる
	{
		var min = date("Ymd", mktime(0, 0, 0, date("m"), date("d") + 1, date("Y")));

		if (options != undefined) {
			var max = options;
		} else {
			max = date("Ymd", mktime(0, 0, 0, date("m") + 3, 0, date("Y")));
		}

		var jsVars = "var year = value[0];\n\t\t\t\tvar mon = value[1];\n\t\t\t\tvar day = value[2];\n\t\t\t\terrcnt = 0;\n\t\t\t\tif(mon < 10){\n\t\t\t\t\tmon = \"0\" + mon;\n\t\t\t\t}\n\t\t\t\tif(mon == 04 || mon == 06 || mon == 09 || mon == 11){\n\t\t\t\t\tif(day >30){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif(mon == 02){\n\t\t\t\t\tif(day > 29){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t\tif(year%4 == 0){\n\t\t\t\t\t\tif(year%100 == 0 && year%400 != 0){\n\t\t\t\t\t\t\tif(day > 28){\n\t\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\telse{\n\t\t\t\t\t\tif(day > 28){\n\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif(day < 10){\n\t\t\t\t\tday = \"0\" + day;\n\t\t\t\t}\n\t\t\t\tvar r_date = year + mon + day;\n\t\t\t\tvar min = " + min + ";\n\t\t\t\tvar max =" + max + ";\n";
		var jsCheck = "errcnt != 0 || min > r_date || max < r_date";
		return [`${jsVars}`, `${jsCheck}`];
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