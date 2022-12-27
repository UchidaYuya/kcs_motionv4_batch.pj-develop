//
//QuickForm自作Rule集（管理情報用）<br>
//
//ここのみ複数のクラスが入っています<br>
//
//更新履歴：<br>
//2008/04/08 宝子山浩平 作成<br>
//
//@package Shared View
//@subpackage QuickForm
//@author houshiyama
//@since 2008/04/04
//@filesource
//@uses QuickForm
//@uses Rule
//
//
//
//プルダウンと数値の組合せエラーチェック
//
//@package Shared View
//@subpackage QuickForm
//@author houshiyama
//@since 2008/04/08
//@uses HTML_QuickForm_Rule
//
//
//プルダウンと日付の組合せチェック（全て一覧） <br>
//
//@package Shared View
//@subpackage QuickForm
//@author houshiyama
//@since 2008/04/08
//@uses HTML_QuickForm_Rule
//
//
//プルダウンと日付の組合せチェック <br>
//
//@package Shared View
//@subpackage QuickForm
//@author houshiyama
//@since 2008/04/08
//@uses HTML_QuickForm_Rule
//
//
//概要： 電話登録日で「予約」にチェックしている場合に
//予約日が入力されているかチェック
//必要パラメータ：
//value[0] = 登録タイプ（ラジオボタン）
//value[1] = 予約日（プルダウン）
//options = ラジオボタンの値
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/06/18
//
//
//概要：予約日が明日から２ヶ月の範囲にあるかチェック
//必要パラメータ：
//value = 予約日（プルダウン）
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/06/18
//
//
//概要： 電話登録日で「予約」にチェックしている場合に
//予約日が明日から２ヶ月の範囲にあるかチェック
//必要パラメータ：
//value = 予約日（プルダウン）
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/06/18
//
//
//概要： 電話変更画面で使用中ラジオボタンが選択されているかチェック
//必要パラメータ：
//value[0] = 登録タイプ（ラジオボタン）
//value[1] = 予約日（プルダウン）
//options = ラジオボタンの値
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/06/18
//
//
//概要： 電話登録・変更画面で入力した関連項目が重複していないかチェック
//必要パラメータ：
//value[0] = 電話番号
//value[1] = 電話会社
//A_options[0] = 項目番号
//A_options[1] = 項目数
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/08/07
//
//
//概要：関連項目の電話番号と電話会社が共に入力されているかチェック
//必要パラメータ：
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/08/07
//
//
//概要： 電話登録・変更で「公私分計する」を選択している場合に
//デフォルトパターンが指定されているかチェックする
//必要パラメータ：
//value[0] = デフォルト設定（ラジオボタン）
//value[1] = 公私分計する際のデフォルトパターン（プルダウン）
//checkDefaultSel
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/06/18
//
//
//概要：予約日が明日から２ヶ月の範囲にあるかチェック
//必要パラメータ：
//value = 予約日（プルダウン）
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/06/18
//
//
//概要：数値項目に数値以外が入力されていないかチェック（検索フォーム埋め込み）
//必要パラメータ：
//value = 数値項目
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/06/18
//
//
//概要：日付項目に不足がないかチェック（検索フォーム埋め込み）
//必要パラメータ：
//value = 日付項目
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/06/18
//
//
//日付の大小チェック（電話削除）
//削除予定キャンセル時は、部署は必須
//必要パラメータ：
//第１引数 = ラジオボタンの値と日付プルダウンの値が入った配列
//第２引数 = 日付範囲の過去limit
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/06/18
//
//
//QRSelectAndTextInput
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2008/11/19
//
//
//getValidationScript
//
//@author houshiyama
//@since 2008/11/19
//
//@param mixed $options
//@access public
//@return void
//
//
// 概要： 日付が過去日付かどうか調べる
// 必要パラメータ：配列["m"],配列["d"],配列["Y"]
//
//
//QRManagementLogSearchCheckDate
//日付チェック。内容は基本的にOriginalRuleのCheckDateに時間の確認が入ったぐらい
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author web
//@since 2016/05/06
//

require("HTML/QuickForm/Rule.php");

//
//QuickFormが行うPHP側のチェック
//
//@author houshiyama
//@since 2008/04/08
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author houshiyama
//@since 2008/04/08
//
//@param mixed $options
//@access public
//@return void
//
class QRSelectAndNumeric extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (value.column != "" && value.val != "" && String(Math.floor(value.val) != value.val || is_numeric(value.val) == false)) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) {
		var jsVars = "value = frm.elements['int[val]'].value;\n\t\t\t\tvar regex = /(^-?\\d\\d*\\d*$)|(^-?\\d\\d*$)|(^-?\\d\\d*$)/;\n";
		var jsCheck = "frm.elements['int[column]'].value != '' && value != '' && !regex.test(value) && !errFlag['int[val]']\n";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

//
//QuickFormが行うPHP側のチェック
//
//@author houshiyama
//@since 2008/04/08
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author houshiyama
//@since 2008/04/08
//
//@param mixed $options
//@access public
//@return void
//
class QRSelectAndCheckDateAllList extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (value.val.Y != "" || value.val.m != "" || value.val.d != "") {
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
		var jsVars = "errcnt = 0;\n\t\t\t\tval_y = frm.elements['contractdate[val][Y]'].value;\n\n\t\t\t\tval_m = frm.elements['contractdate[val][m]'].value;\n\n\t\t\t\tval_d = frm.elements['contractdate[val][d]'].value;\n\n\t\t\t\tif(val_m == 04 || val_m == 06 || val_m == 09 || val_m == 11){\n\t\t\t\t\tif(val_d > 30){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif(val_m == 02){\n\t\t\t\t\tif(val_d > 29){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t\tif(val_y%4 == 0){\n\t\t\t\t\t\tif(val_y%100 == 0 && val_y%400 != 0){\n\t\t\t\t\t\t\tif(val_d > 28){\n\t\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\telse{\n\t\t\t\t\t\tif(val_d > 28){\n\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t";
		var jsCheck = "errcnt > 0 || (val_y != '' && (val_m == '' || val_d == '')) || (val_m != '' && (val_y == '' || val_d == '')) || (val_d != '' && (val_y == '' || val_m == ''))";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

//
//QuickFormが行うPHP側のチェック
//
//@author houshiyama
//@since 2008/04/08
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author houshiyama
//@since 2008/04/08
//
//@param mixed $options
//@access public
//@return void
//
class QRSelectAndCheckDate extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (value.column != "" && (value.val.Y != "" || value.val.m != "" || value.val.d != "")) {
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
		var jsCheck = "col != '' && (errcnt > 0 || (val_y != '' && (val_m == '' || val_d == '')) || (val_m != '' && (val_y == '' || val_d == '')) || (val_d != '' && (val_y == '' || val_m == '')))";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

//
//validate
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $options
//@access public
//@return void
//
class QRCheckReserveDateOnRadio extends HTML_QuickForm_Rule {
	validate(value, options) {
		if (value[0] == options && (value[1].Y == "" || value[1].m == "" || value[1].d == "")) {
			return false;
		}

		if (value[0] == options && checkdate(value[1].m, value[1].d, value[1].Y) == false) {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) //「予約」を選択している場合は年月日を指定する
	{
		var jsVars = "\n\t\t\t\tvar year = value[1][0];\n\t\t\t\tvar mon = value[1][1];\n\t\t\t\tvar day = value[1][2];\n\t\t\t\terrcnt = 0;\n\t\t\t\tif(mon < 10){\n\t\t\t\t\tmon = \"0\" + mon;\n\t\t\t\t}\n\t\t\t\tif(mon == 04 || mon == 06 || mon == 09 || mon == 11){\n\t\t\t\t\tif(day >30){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif(mon == 02){\n\t\t\t\t\tif(day > 29){\n\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t}\n\t\t\t\t\tif(year%4 == 0){\n\t\t\t\t\t\tif(year%100 == 0 && year%400 != 0){\n\t\t\t\t\t\t\tif(day > 28){\n\t\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\telse{\n\t\t\t\t\t\tif(day > 28){\n\t\t\t\t\t\t\terrcnt++;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif(day < 10){\n\t\t\t\t\tday = \"0\" + day;\n\t\t\t\t}\n\t\t\t\tvar r_date = year + mon + day;\n\t\t\t";
		var jsCheck = `errcnt != 0 || ( {jsVar}[0] == '${options}' && ({jsVar}[1][0] == '' || {jsVar}[1][1] == '' || {jsVar}[1][2] == '' ) )`;
		return [`${jsVars}`, `${jsCheck}`];
	}

};

//
//validate
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $A_options
//@access public
//@return void
//
class QRCheckLimitReserveDate extends HTML_QuickForm_Rule {
	validate(value, A_options) {
		var val = value.Y + str_pad(value.m, 2, "0", STR_PAD_LEFT) + str_pad(value.d, 2, "0", STR_PAD_LEFT);
		var min = A_options[0][0] + A_options[0][1] + A_options[0][2];
		var max = A_options[1][0] + A_options[1][1] + A_options[1][2];

		if (min > val || val > max) {
			return false;
		}

		return true;
	}

	getValidationScript(A_options = undefined) //予約日の範囲を調べる
	{
		var min = A_options[0][0] + A_options[0][1] + A_options[0][2];
		var max = A_options[1][0] + A_options[1][1] + A_options[1][2];
		var jsVars = " \n\t\t\t\t\tvar year = value[0];\n\t\t\t\t\tvar mon = value[1];\n\t\t\t\t\tif(mon < 10){\n\t\t\t\t\t\tmon = \"0\" + mon;\n\t\t\t\t\t}\n\t\t\t\t\tvar day = value[2];\n\t\t\t\t\tif(day < 10){\n\t\t\t\t\t\tday = \"0\" + day;\n\t\t\t\t\t}\n\t\t\t\t\tvar r_date = year + mon + day;\n\n\t\t\t\t\tvar min = " + min + ";\n\t\t\t\t\tvar max = " + max + ";\n\n\t\t\t\t\t";
		var jsCheck = "min > r_date || max < r_date";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

//
//validate
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $A_options
//@access public
//@return void
//
class QRCheckLimitReserveDateOnRadio extends HTML_QuickForm_Rule {
	validate(value, options) {
		var val = value[1].Y + str_pad(value[1].m, 2, "0", STR_PAD_LEFT) + str_pad(value[1].d, 2, "0", STR_PAD_LEFT);
		var min = A_options[0][0] + A_options[0][1] + A_options[0][2];
		var max = A_options[1][0] + A_options[1][1] + A_options[1][2];

		if (value[0] == options && (min > val || val > max)) {
			return false;
		}

		return true;
	}

	getValidationScript(A_options = undefined) //予約日の範囲を調べる
	{
		var min = A_options[1][0] + A_options[1][1] + A_options[1][2];
		var max = A_options[2][0] + A_options[2][1] + A_options[2][2];
		var jsVars = " \n\t\t\t\t\tvar year = value[1][0];\n\t\t\t\t\tvar mon = value[1][1];\n\t\t\t\t\tif(mon < 10){\n\t\t\t\t\t\tmon = \"0\" + mon;\n\t\t\t\t\t}\n\t\t\t\t\tvar day = value[1][2];\n\t\t\t\t\tif(day < 10){\n\t\t\t\t\t\tday = \"0\" + day;\n\t\t\t\t\t}\n\t\t\t\t\tvar r_date = year + mon + day;\n\n\t\t\t\t\tvar min = " + min + ";\n\t\t\t\t\tvar max = " + max + ";\n\n\t\t\t\t\t";
		var jsCheck = `{jsVar}[0] == '${A_options[0]}' && ( min > r_date || max < r_date )`;
		return [`${jsVars}`, `${jsCheck}`];
	}

};

//
//validate
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//
//@author houshiyama
//@since 2008/07/30
//
//@param mixed $options
//@access public
//@return void
//
class QRCheckMainFlgRadio extends HTML_QuickForm_Rule {
	validate(value, options) {
		for (var cnt = 0; cnt < options; cnt++) {
			var key = "main_flg_" + cnt;

			if (undefined !== _POST[key] == true) {
				return true;
			}
		}

		return false;
	}

	getValidationScript(options = undefined) {
		var jsVars = " var chk_flg=false;\n\t\t\t\t\tfor( cnt = 0; cnt < form.length; cnt++ ){\n\t\t\t\t\t\tif( document.form.elements[cnt].name.match( /main_flg/ ) && document.form.elements[cnt].checked == true ){\n\t\t\t\t\t\t\tchk_flg = true;\n\t\t\t\t\t\t}\n\t\t\t\t\t}";
		var jsCheck = "chk_flg == false";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

//
//validate
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $value
//@param mixed $A_options
//@access public
//@return void
//
//
//getValidationScript
//
//@author houshiyama
//@since 2008/07/30
//
//@param mixed $A_options
//@access public
//@return void
//
class QRCheckRelTelDuplication extends HTML_QuickForm_Rule {
	validate(value, A_options) {
		var A_tmp = Array();

		for (var cnt = 1; cnt <= A_options[1]; cnt++) //チェック対象はスキップ
		{
			if (cnt === A_options[0]) {
				continue;
			}

			var telno_key = "rel_telno_view_" + cnt;
			var carid_key = "rel_carid_" + cnt;

			if ("" != telno_key + carid_key) {
				var str = "(" + _POST[telno_key] + ":" + _POST[carid_key] + ")";
				A_tmp.push(str);
			}
		}

		var trg_str = "(" + value[0] + ":" + value[1] + ")";

		if (-1 !== A_tmp.indexOf(trg_str) == true) {
			return false;
		}

		return true;
	}

	getValidationScript(A_options = undefined) {
		var jsVars = " var dupli_flg=false;\n\t\t\t\t\tA_val = new Array();\n\t\t\t\t\tfor( cnt = 1; cnt <= " + A_options[1] + "; cnt++ ){\n\t\t\t\t\t\tif( cnt == " + A_options[0] + " ){\n\t\t\t\t\t\t\tcontinue;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif( \"\" != document.form[\"rel_telno_view_\" + cnt].value + document.form[\"rel_carid_\" + cnt].value ){\n\t\t\t\t\t\t\tvar str = \"(\" + document.form[\"rel_telno_view_\" + cnt].value + \":\" + document.form[\"rel_carid_\" + cnt].value + \")\";\n\t\t\t\t\t\t\tA_val.push( str );\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\tvar trg_str = \"(\" + document.form[\"rel_telno_view_\" + " + A_options[0] + "].value + \":\" + document.form[\"rel_carid_\" + " + A_options[0] + "].value + \")\";\n\t\t\t\t\tfor( cnt = 0; cnt < A_val.length; cnt++ ){\n\t\t\t\t\t\tif( A_val.indexOf( trg_str ) >= 0 ){\n\t\t\t\t\t\t\tdupli_flg = true;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t";
		var jsCheck = "dupli_flg == true";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

//
//validate
//
//@author houshiyama
//@since 2008/08/07
//
//@param mixed $value
//@access public
//@return void
//
//
//getValidationScript
//
//@author houshiyama
//@since 2008/08/07
//
//@param mixed $options
//@access public
//@return void
//
class QRRelFormInput extends HTML_QuickForm_Rule {
	validate(options = undefined) {
		if (_POST.rel_telno_view != "" && _POST.rel_carid == "" || _POST.rel_telno_view == "" && _POST.rel_carid != "") {
			return false;
		}

		return true;
	}

	getValidationScript(options = undefined) {
		var jsVars = "\n\t\t\t\tvar errflg = false;\n\t\t\t\tvar\ttelno = form.elements['rel_telno_view'].value;\n\t\t\t\tvar\tcarid = form.elements['rel_carid'].value;\n\t\t\t\t";
		var jsCheck = "( telno != '' && carid == '' ) || ( telno == '' && carid != '' )";
		return [`${jsVars}`, `${jsCheck}`];
	}

};

//
//validate
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $options
//@access public
//@return void
//
class QRCheckDefaultSel extends HTML_QuickForm_Rule {
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

//
//validate
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $options
//@access public
//@return void
//
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

//
//validate
//
//@author houshiyama
//@since 2008/11/19
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//
//@author houshiyama
//@since 2008/11/19
//
//@param mixed $options
//@access public
//@return void
//
class QRSelectAndTextInput extends HTML_QuickForm_Rule {
	validate(value, options = undefined) {
		return true;
	}

	getValidationScript(options = undefined) {
		var jsVar = "var val1 = frm.elements['" + options + "[column]'].value;\n";

		if (options == "date") {
			jsVar += "var val2 = frm.elements['" + options + "[val][Y]'].value\n\t\t\t\t\t\t\t\t+ frm.elements['" + options + "[val][m]'].value\n\t\t\t\t\t\t\t\t+ frm.elements['" + options + "[val][d]'].value;";
		} else {
			jsVar += "var val2 = frm.elements['" + options + "[val]'].value;";
		}

		var jsCheck = "(( val1 == '' && val2 != '' ) || ( val1 != '' && val2 == '' ))";
		return [`${jsVar}`, `${jsCheck}`];
	}

};

class QRManagementPropertyFormatCheck extends HTML_QuickForm_Rule {
	validate(value, options = undefined) {
		var bError = false;

		if (value != "") //[名前:アイテム]の書式になっているか調べる
			{
				var temp = value.split(":");

				if (temp[0] != "" && temp.length == 2) //アイテムがあるかチェック
					{
						if (temp[1] != "") //アイテムが1個以上ある？
							{
								var items = temp[1].split(",");
								var item_count = items.length;

								if (item_count > 0) {
									var bCheck = true;

									for (var i = 0; i < item_count; i++) //それぞれのアイテムが空になってないか調べる
									{
										if (items[i] == "") {
											bCheck = false;
											break;
										}
									}

									if (bCheck) {
										bError = true;
									}
								}
							}
					}
			} else {
			bError = true;
		}

		return bError;
	}

	getValidationScript(options = undefined) {
		var jsVar = "\n\t\tvar bError = true;\n\t\tif( value != \"\" ){\n\t\t\tvar temp = value.split(\":\");\n\n\t\t\tif( (temp[0] != \"\") && (temp.length == 2) ){\t\n\t\t\t\tif( temp[1] != \"\" ){\n\t\t\t\t\tvar items = temp[1].split(\",\");\n\t\t\t\t\tvar num = items.length;\n\t\t\t\t\tif( num > 0 ){\n\t\t\t\t\t\tvar bCheck = true;\n\t\t\t\t\t\tfor( i = 0;i < num;i++){\n\t\t\t\t\t\t\tif( items[i] == \"\" ){\n\t\t\t\t\t\t\t\tbCheck = false;\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif( bCheck ){\n\t\t\t\t\t\t\tbError = false;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}else{\n\t\t\tbError = false;\n\t\t}";
		var jsCheck = "(bError)";
		return [`${jsVar}`, `${jsCheck}`];
	}

};

class QRManagementDateBefore extends HTML_QuickForm_Rule {
	validate(value, operator = undefined) {
		var time = mktime(0, 0, 0, date("m"), date("d") - 1, date("Y"));

		if (mktime(0, 0, 0, value.m, value.d, value.Y) > time) {
			return true;
		}

		return false;
	}

	getValidationScript(operator = undefined) //$time = mktime(0,0,0,date("m"),date("d"),date("Y"));
	{
		var time = "(makeTime(new Array(" + date("Y") + "," + date("n") + "," + date("j") + ")) - 1)";
		var check = `!(${time} < Number(makeTime({jsVar})))`;
		return ["", `'' != {jsVar} && ${check}`];
	}

};

//
//validate
//日付と時間チェック
//@author date
//@since 2016/05/06
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//日付と時間チェック
//@author web
//@since 2016/05/06
//
//@param mixed $options
//@access public
//@return void
//
class QRManagementLogSearchCheckDate extends HTML_QuickForm_Rule {
	validate(value, options = undefined) //年月日時日のどれかが入力されていたら値の確認をする
	{
		if (value.m + value.d + value.Y + value.H + value.i != "") //年月日に空が入っていないか確認する
			{
				if (value.m == "" || value.d == "" || value.Y == "" || value.H == "" || value.i == "") {
					return false;
				}

				if (+(value.H < 0 || +(value.H > 23 || !is_numeric(value.H)))) {
					return false;
				}

				if (+(value.i < 0 || +(value.i > 59 || !is_numeric(value.i)))) {
					return false;
				}

				if (checkdate(value.m, value.d, value.Y) == false) {
					return false;
				}
			}

		return true;
	}

	getValidationScript(options = undefined) //駄目な場合はtrue
	//return array('', "Check_Date({jsVar})");
	{
		return ["", "Check_DateTime({jsVar})"];
	}

};