//
// 表示順の重複チェック
// 必要パラメータ：
// 第１引数 = フォームで入力された値
// 第２引数 = フォームのキーの基本名
//
//
// ソート順の重複チェック
// 必要パラメータ：
// 第１引数 = フォームで入力された値
// 第２引数 = フォームのキーの基本名
//
//
// パターンが選択されたかチェック
// 必要パラメータ：
// 第１引数 = フォームで入力された値
// 第２引数 = エラーになる値
//
//
// ダウンロード項目が0個でないかチェック
// 必要パラメータ：
// 第１引数 = フォームで入力された値
// 第２引数 = フォームのキーの基本名
//
//
// 最新を選択した時のダウンロードタイプチェック
// 必要パラメータ：
// 第１引数 = フォームで入力された値
// 第２引数 = フォームのキーの基本名
//
//
// 最新を選択した時のダウンロードタイプチェック
// 必要パラメータ：
// 第１引数 = フォームで入力された値
// 第２引数 = フォームのキーの基本名
//

require("HTML/QuickForm.php");

require("HTML/QuickForm/Rule.php");

class checkDupliNumberView extends HTML_QuickForm_Rule {
	validate(value, column, options = undefined) {
		var A_val = Array();

		for (var key in _POST) {
			var val = _POST[key];

			if (preg_match("/_v$/", key) == true && preg_match("/^" + column + "_v$/", key) == false && val != "") {
				A_val.push(val);
			}
		}

		if (-1 !== A_val.indexOf(value) == true) {
			return false;
		}

		return true;
	}

	getValidationScript(column) {
		var jsVars = "\n\t\t\t\tvar val = value;\n\t\t\t\tvar flg = true;\n\t\t\t\tA_val = new Array();\n\t\t\t\tfor(cnt = 0; cnt < document.form.length; cnt++){\n\t\t\t\t\tif(document.form.elements[cnt].name.match(/_v$/) != null \n\t\t\t\t\t\t&& document.form.elements[cnt].name.match(/" + column + "_v$/) == null\n\t\t\t\t\t\t&& document.form.elements[cnt].value != ''){\n\t\t\t\t\t\tA_val.push(document.form.elements[cnt].value);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tfor(iii = 0; iii < A_val.length; iii++){\n\t\t\t\t\tif(document.form." + column + "_v.value == A_val[iii]){\n\t\t\t\t\t\tflg = false;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t";
		var jsCheck = "flg == false";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

class checkDupliNumberSort extends HTML_QuickForm_Rule {
	validate(value, column, options = undefined) {
		var A_val = Array();

		for (var key in _POST) {
			var val = _POST[key];

			if (preg_match("/_s$/", key) == true && preg_match("/^" + column + "_s$/", key) == false && val != "") {
				A_val.push(val);
			}
		}

		if (-1 !== A_val.indexOf(value) == true) {
			return false;
		}

		return true;
	}

	getValidationScript(column) {
		var jsVars = "var val = value;\n\t\t\t\tvar flg = true;\n\t\t\t\tA_val = new Array();\n\t\t\t\tfor(cnt = 0; cnt < document.form.length; cnt++){\n\t\t\t\t\tif(document.form.elements[cnt].name.match(/_s$/) != null \n\t\t\t\t\t\t&& document.form.elements[cnt].name.match(/" + column + "_s$/) == null\n\t\t\t\t\t\t&& document.form.elements[cnt].value != ''){\n\t\t\t\t\t\tA_val.push(document.form.elements[cnt].value);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tfor(iii = 0; iii < A_val.length; iii++){\n\t\t\t\t\tif(document.form." + column + "_s.value == A_val[iii]){\n\t\t\t\t\t\tflg = false;\n\t\t\t\t\t}\n\t\t\t\t}";
		var jsCheck = "flg == false";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

class checkPatternSelect extends HTML_QuickForm_Rule {
	validate(val, errval) {
		if (val == errval) {
			return false;
		}

		return true;
	}

	getValidationScript(val) {
		var jsVars = "\n\t\t\t\t";
		var jsCheck = "document.form.pattern.value == " + val;
		return [`${jsVars}`, `${jsCheck}`];
	}

};

class checkNoCheck extends HTML_QuickForm_Rule {
	validate() {
		for (var key in _POST) {
			var val = _POST[key];

			if (preg_match("/_c$/", key) == true) {
				if (val == 1) {
					return true;
				}
			}
		}

		return false;
	}

	getValidationScript() {
		var jsVars = "\n\t\t\tvar hit = false;\n\t\t\tfor(cnt=0; cnt < document.form.length; cnt++) {\n\t\t\t\tif(document.form[cnt].name.match(/_c$/) != null){\n\t\t\t\t\tif(document.form[cnt].checked == true){\n\t\t\t\t\t\thit = true;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t";
		var jsCheck = "hit == false";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

class checkLatestAndType extends HTML_QuickForm_Rule {
	validate(value) {
		if (preg_match("/\\(all\\)$|\\(bill\\)$|\\(telbill\\)$/", _POST.pattern) == true && value == "latest") {
			return false;
		}

		return true;
	}

	getValidationScript() {
		var jsVars = "\n\t\t\t\tvar latestflg = false;\n\t\t\t\tvar billflg = false;\n\t\t\t\tif(document.form.trg_month.value == 'latest'){\n\t\t\t\t\tlatestflg = true;\n\t\t\t\t}\n\t\t\t\tvar val = document.form.pattern.value;\n\t\t\t\tif(val.match(\"all|bill|telbill\") != null){\n\t\t\t\t\tbillflg = true;\n\t\t\t\t}\n\t\t\t\t";
		var jsCheck = "latestflg == true && billflg == true";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

class checkDateJustis extends HTML_QuickForm_Rule {
	validate(value) {
		if (preg_match("/(\\d){4}-(\\d){2}-(\\d){2}/", value) == false) {
			return false;
		}

		var year_str = value.substr(0, 4);
		var mon_str = value.substr(5, 2);
		var day_str = value.substr(8, 2);

		if (checkdate(mon_str, day_str, year_str) == false) {
			return false;
		}

		return true;
	}

	getValidationScript(value) {
		var jsVars = "\n\t\t\t\tvar datestr = document.form." + value + ".value;\n\t\t\t\tvar errflg = true;\n\t\t\t\tif(datestr != ''){\n\t\t\t\t\tif(!datestr.match(/^(\\d){4}-(\\d){2}-(\\d){2}$/)){ \n\t\t\t\t\t\terrflg = false; \n\t\t\t\t\t} \n\t\t\t\t\telse{\n\t\t\t\t\t\tvar vYear = datestr.substr(0, 4) - 0; \n\t\t\t\t\t\tvar vMonth = datestr.substr(5, 2) - 1; // Javascript\u306F\u30010-11\u3067\u8868\u73FE \n\t\t\t\t\t\tvar vDay = datestr.substr(8, 2) - 0; \n\t\t\n\t\t\t\t\t\t// \u6708,\u65E5\u306E\u59A5\u5F53\u6027\u30C1\u30A7\u30C3\u30AF \n\t\t\t\t\t\tif(vMonth >= 0 && vMonth <= 11 && vDay >= 1 && vDay <= 31){ \n\t\t\t\t\t\t\tvar vDt = new Date(vYear, vMonth, vDay); \n\t\t\t\t\t\t\tif(isNaN(vDt)){ \n\t\t\t\t\t\t\t\terrflg = false; \n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\telse if(vDt.getFullYear() == vYear && vDt.getMonth() == vMonth && vDt.getDate() == vDay){ \n\t\t\t\t\t\t\t\terrflg = true; \n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\telse{ \n\t\t\t\t\t\t\t\terrflg = false; \n\t\t\t\t\t\t\t} \n\t\t\t\t\t\t}\n\t\t\t\t\t\telse{ \n\t\t\t\t\t\t\terrflg = false; \n\t\t\t\t\t\t} \n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t";
		var jsCheck = "errflg == false";
		return [`${jsVars}`, `${jsCheck}`];
	}

};