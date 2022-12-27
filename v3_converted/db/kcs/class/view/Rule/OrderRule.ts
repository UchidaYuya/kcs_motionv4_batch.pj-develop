//
// 概要： 特定のフォームの値が入力されている場合に
//        もう一つの要素が入力されているかチェックする
// 必要パラメータ：
// value[0] = チェックする要素名
// value[1] = もう一つの要素
// options = もう一つの要素の値
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が入っているかをしらべる
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が入っているかをしらべる
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： ラジオボタンが特定のパラメータのとき、プルダウンのパラメータが正しいか調べる
// 必要パラメータ：
// value = rule_element array('ciridradio', 'buyselid')
// options = rule_format array(1,3)
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が入っているかをしらべる
// チェックボックス用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 20131104 date
// 概要： 特定のフォームの値が指定された値だともう一つの値が入っているかをしらべる
// チェックボックス＋日付用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が入っているかをしらべる
// チェックボックス用（複数対応）
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が入っているかをしらべる
// テキスト入力フィールド→チェックボックス用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定の複数のフォームの値が指定された値だともう一つの値が入っているかをしらべる
// チェックボックス＆ラジオボタン用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定の複数のフォームの値が指定された値だともう一つの値が入っているかをしらべる
// チェックボックス＆ラジオボタン用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定の複数のフォームの値が指定された値だともう一つの値が入っているかをしらべる（日付版）
// チェックボックス＆ラジオボタン用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が入っているかをしらべる(拡張版)
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[2] = nullかどうか調べる要素名
// 配列[3] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定のフォームの値が指定された値だともう6つの値が入っているかをしらべる(V3の送信先のために作った)
// 必須項目が一つ増えたのでこの関数の役目はRadioCompareExSevenElementに引き継がれた 20090915miya
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[2] = nullかどうか調べる要素名
// 配列[3] = nullかどうか調べる要素名
// 配列[4] = nullかどうか調べる要素名
// 配列[5] = nullかどうか調べる要素名
// 配列[6] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定のフォームの値が指定された値だともう7つの値が入っているかをしらべる(V3の送信先のために作った)
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[2] = nullかどうか調べる要素名
// 配列[3] = nullかどうか調べる要素名
// 配列[4] = nullかどうか調べる要素名
// 配列[5] = nullかどうか調べる要素名
// 配列[6] = nullかどうか調べる要素名
// 配列[7] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 宛先入力ですべて入力か未入力なら通過。部分入力はエラー（ただし、ビル名は除く）
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[2] = nullかどうか調べる要素名
// 配列[3] = nullかどうか調べる要素名
// 配列[4] = nullかどうか調べる要素名
// 配列[5] = nullかどうか調べる要素名
// 配列[6] = nullかどうか調べる要素名
// 配列[7] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が入っているかをしらべる(拡張版・複数のどれかが入っていればいい版)
// 必要パラメータ：
// value[0] = nullかどうか調べる要素名
// value[1] = nullかどうか調べる要素名
// value[2] = nullかどうか調べる要素名
// value[3] = nullかどうか調べる要素名
// value[4] = nullかどうか調べる要素名
// options[0] = ラジオボタン名
// options[1] = ラジオボタンの中での順番の数字（その要素を指すvalueでは指定できない！）
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が入っているかをしらべる
// テキスト入力フィールド→チェックボックス用
// 必要パラメータ：
// value[0] = nullかどうか調べる要素名
// value[1] = nullかどうか調べる要素名
// value[2] = nullかどうか調べる要素名
// value[3] = nullかどうか調べる要素名
// value[4] = nullかどうか調べる要素名
// options[0] = ラジオボタン名
// options[1] = ラジオボタンの中での順番の数字（javascriptのラジオボタンは、その要素を指すvalue名では指定できない！）
// options[2] = ラジオボタンのvalue名
//
//
// 概要： 日付が過去日付かどうか調べる
// 必要パラメータ：配列["m"],配列["d"],配列["Y"]
//
//
// 概要： 日付が過去日付かどうか調べる
// V2用。承認のときのみチェックするため
// 必要パラメータ：配列["m"],配列["d"],配列["Y"]
// value = array('answer','datechange','datechangeradio')
// option = "ok"
//
//
// 概要： 日付が過去日付かどうか調べる（ラジオボタンに関連付け）
// V3用に作成 20091021miya
// 必要パラメータ：配列["m"],配列["d"],配列["Y"]
// value = array('datechangeradio','datechange')
// options = "specify"
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が過去日付かどうか調べる
// チェックボックス用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 例）$value = array("dateradio","dateto")	$value[0]がspecifyかどうかロジック中で見る
// 例）$options = array('mask[dateradio]','dateto')
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が無効日付かどうか調べる
// チェックボックス用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 例）$value = array('dateradio','dateto')	$value[0]がspecifyかどうかロジック中で見る
// 例）$options = array('mask[dateradio]','dateto')
//
//
// 概要： 第１引数で指定された値が第２引数で指定された値の倍数かどうか調べる
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が一定の倍数になっているか調べる
// チェックボックス用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 例）$value = array('pointradio','point')	$value[0]がspecifyかどうかロジック中で見る
// 例）$options = array('mask[point]', 100)
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が入力規則にあっているか調べる
// チェックボックス用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 例）$value = array('pointradio','point')	$value[0]がspecifyかどうかロジック中で見る
// 例）$options = array('mask[point]', '/^[0-9]+$/')
//
//
// 概要： 特定のフォームの値が指定された値だともう一つの値が入力規則にあっているか調べる
// チェックボックス用
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 例）$value = applyprice
// 例）$options = array('mask[point]', '/^[0-9]+$/')
//
//
// 概要： 特定のフォームの値が指定された値の範囲内だともう一つの値が入っているかをしらべる
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値の範囲
//
//
// 概要： 特定のフォームの値が指定された値の範囲内だともう一つの値が入っているかをしらべる
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値の範囲
//
//
// 概要： 自作のJavaScriptを呼びだす
// 必要パラメータ：
// 第１引数 = エレメント名
// 第４引数 = エレメント名の先頭の文字 (例えばelements['option[xx]']ならoption)
//
//
// 概要： 日付の前後を検査する
// 必要パラメータ：
// 第１引数 = 開始日付のエレメント名
// 第２引数 = 終了日付のエレメント名
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
// 日付の大小チェック +チェックボックスの状態を考慮
// 移動予定キャンセル時は、部署は必須
// 必要パラメータ：
// 第１引数 = ラジオボタンの値
// 第２引数 = 対象日付１
// 第３引数 = 対象日付２
//
//
// 概要： メール受信設定があればメールアドレスは必須にする
// 必要パラメータ：
// 第１引数 = メールアドレス，メールアドレス受信設定の項目全部
//
//
// 概要： スペースしか入力されていない場合に警告を出す
// 必要パラメータ：
// 第１引数 = 入力された値
//

require("HTML/QuickForm/Rule.php");

class TextCompare extends HTML_QuickForm_Rule {
    validate(value, options) {
        if (value[0] != options && value[1] == "") {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `{jsVar}[0] != '${options}' && {jsVar}[1] == ''`;
        return ["", `${jsCheck}`];
    }

};

//end func getValidationScript
class RadioCompare extends HTML_QuickForm_Rule {
    validate(value, options) {
        if (value[0] == options && value[1].trim() == "") {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `== '${options}' && ({jsVar}[1] == '')`;
        return ["", `{jsVar}[0] ${jsCheck}`];
    }

};

//end func getValidationScript
class RadioCompareMulti extends HTML_QuickForm_Rule {
    validate(value, options) {
        if (value[0] == options[0] && value[1] == options[1] && value[2].trim() == "") {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `== '${options[0]}' && {jsVar}[1] == '${options[1]}' && ({jsVar}[2] == '')`;
        return ["", `{jsVar}[0] ${jsCheck}`];
    }

};

//end func getValidationScript
class RadioCompareSelectParam extends HTML_QuickForm_Rule {
    validate(value, options) {
        if (value[0] == options[0] && value[1] != options[1]) {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `== '${options[0]}' && {jsVar}[1] != ${options[1]}`;
        return ["", `{jsVar}[0] ${jsCheck}`];
    }

};

//end func getValidationScript
class CheckboxCompare extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options, "[");
        var lastkakko = strrpos(options, "]");
        var optstr0 = options.substr(0, firstkakko);
        var optstr1 = options.substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if ((value == "" || value == "_no_template_set") && _POST[optstr0][optstr1] == 1) {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `== '' && frm.elements['${options}'].checked`;
        return ["", `({jsVar} == '' || {jsVar} == '_no_template_set') && frm.elements['${options}'].checked`];
    }

};

//end func getValidationScript
class CheckboxCompareDateEmptyYMD extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options, "[");
        var lastkakko = strrpos(options, "]");
        var optstr0 = options.substr(0, firstkakko);
        var optstr1 = options.substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (value.y + value.m + value.d == "" && _POST[optstr0][optstr1] == 1) {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsVars = "  var year = value[0];\n  var month = value[1];\n  var day = value[2];\n";
        var jsCheck = `( year == '' && month == '' && day == '' ) && frm.elements['${options}'].checked`;
        return [`${jsVars}`, `${jsCheck}`];
    }

};

//end func getValidationScript
class CheckboxCompareMulti extends HTML_QuickForm_Rule {
    validate(value, options) //optionsが二次元配列に入ってくるので分解
    //複数の$valueに対応（指定割オプションの通話先指定など）
    {
        var firstkakko = strrpos(options, "[");
        var lastkakko = strrpos(options, "]");
        var optstr0 = options.substr(0, firstkakko);
        var optstr1 = options.substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (_POST[optstr0][optstr1] == 1 && (value[0].trim() == "" && value[1].trim() == "" && value[2].trim() == "" && value[3].trim() == "" && value[4].trim() == "") || _POST[optstr0][optstr1] == "" && (value[0].trim() != "" || value[1].trim() != "" || value[2].trim() != "" || value[3].trim() != "" || value[4].trim() != "")) {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `(frm.elements['${options}'].checked && ({jsVar}[0] == '' && {jsVar}[1] == '' && {jsVar}[2] == '' && {jsVar}[3] == '' && {jsVar}[4] == '')) || \n\t\t(frm.elements['${options}'].checked != true && ({jsVar}[0] != '' || {jsVar}[1] != '' || {jsVar}[2] != '' || {jsVar}[3] != '' || {jsVar}[4] != ''))`;
        return ["", `${jsCheck}`];
    }

};

//end func getValidationScript
class CheckboxCompareReverse extends HTML_QuickForm_Rule {
    validate(value, options) //optionsが二次元配列に入ってくるので分解
    //複数の$valueに対応（指定割オプションの通話先指定など）
    {
        var firstkakko = strrpos(options, "[");
        var lastkakko = strrpos(options, "]");
        var optstr0 = options.substr(0, firstkakko);
        var optstr1 = options.substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (_POST[optstr0][optstr1] == "" && (value[0].trim() != "" || value[1].trim() != "" || value[2].trim() != "" || value[3].trim() != "" || value[4].trim() != "")) {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `frm.elements['${options}'].checked != true && ({jsVar}[0] != '' || {jsVar}[1] != '' || {jsVar}[2] != '' || {jsVar}[3] != '' || {jsVar}[4] != '')`;
        return ["", `${jsCheck}`];
    }

};

//end func getValidationScript
class CheckboxAndRadioCompare extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (value[1] == "" && _POST[optstr0][optstr1] == 1) {
            if (-1 !== options[1].indexOf(value[0]) == false && value[1].trim() == "") {
                return false;
            }
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `== '' && frm.elements['${options[0]}'].checked`;

        for (var cnt = 0; cnt < options[1].length; cnt++) {
            if (0 == cnt) {
                jsCheck += " && (";
            } else {
                jsCheck += " && ";
            }

            jsCheck += `({jsVar}[0] != '${options[1][cnt]}')`;
        }

        jsCheck += ")";
        return ["", `{jsVar}[1] ${jsCheck}`];
    }

};

//end func getValidationScript
class CheckboxAndRadioCompareRegexMulti extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (value[1] != "" && _POST[optstr0][optstr1] == 1) {
            if (-1 !== options[1].indexOf(value[0]) == false) {
                if (preg_match(options[2], value[1]) == fales) {
                    return false;
                }
            }
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `!= '' && frm.elements['${options[0]}'].checked && ${options[2]}.test({jsVar}[1]) == false`;

        for (var cnt = 0; cnt < options[1].length; cnt++) {
            if (0 == cnt) {
                jsCheck += " && (";
            } else {
                jsCheck += " && ";
            }

            jsCheck += `({jsVar}[0] != '${options[1][cnt]}')`;
        }

        jsCheck += ")";
        return ["", `{jsVar}[1] ${jsCheck}`];
    }

};

//end func getValidationScript
class CheckboxAndRadioCompareDate extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (_POST[optstr0][optstr1] == 1) {
            if ((options[2].Y == "" || options[2].m == "" || options[2].d == "") && value[0] == options[1]) {
                return false;
            }
        }

        return true;
    }

    getValidationScript(options) {
        var jsCheck = `(frm.elements['${options[2]}[Y]'].value == '' || frm.elements['${options[2]}[m]'].value == '' || frm.elements['${options[2]}[d]'].value == '') && frm.elements['${options[0]}'].checked && ({jsVar} == '${options[1]}')`;
        return ["", `${jsCheck}`];
    }

};

//end func getValidationScript
class RadioCompareEx extends HTML_QuickForm_Rule {
    validate(value, options) {
        if (value[0] == options) {
            return true;
        } else if (value[0] != options && value[1].trim() != "" && value[2].trim() != "" && value[3].trim() != "") {
            return true;
        }

        return false;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `!= '${options}' && ({jsVar}[1] == '' || {jsVar}[2] == '' || {jsVar}[3] == '')`;
        return ["", `{jsVar}[0] ${jsCheck}`];
    }

};

//end func getValidationScript
class RadioCompareExSixElement extends HTML_QuickForm_Rule {
    validate(value, options) {
        if (value[0] == options) {
            return true;
        } else if (value[0] != options && value[1].trim() != "" && value[2].trim() != "" && value[3].trim() != "" && value[4].trim() != "" && value[5].trim() != "" && value[6].trim() != "") {
            return true;
        }

        return false;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `!= '${options}' && ({jsVar}[1] == '' || {jsVar}[2] == '' || {jsVar}[3] == '' || {jsVar}[4] == '' || {jsVar}[5] == '' || {jsVar}[6] == '')`;
        return ["", `{jsVar}[0] ${jsCheck}`];
    }

};

//end func getValidationScript
class RadioCompareExSevenElement extends HTML_QuickForm_Rule {
    validate(value, options) {
        if (value[0] == options) {
            return true;
        } else if (value[0] != options && value[1].trim() != "" && value[2].trim() != "" && value[3].trim() != "" && value[4].trim() != "" && value[5].trim() != "" && value[6].trim() != "" && value[7].trim() != "") {
            return true;
        }

        return false;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `!= '${options}' && ({jsVar}[1] == '' || {jsVar}[2] == '' || {jsVar}[3] == '' || {jsVar}[4] == '' || {jsVar}[5] == '' || {jsVar}[6] == '' || {jsVar}[7] == '')`;
        return ["", `{jsVar}[0] ${jsCheck}`];
    }

};

//end func getValidationScript
class RadioCompareExMiscDestinationElement extends HTML_QuickForm_Rule {
    validate(value, options) //すべて入力済みかすべて未入力なら通過
    {
        var cnt = 7;

        for (var val of Object.values(value)) //空の入力欄はマイナスする
        {
            var temp = val.trim();

            if (!temp && "0" !== temp) {
                cnt--;
            }
        }

        if (7 == cnt || 0 == cnt) {
            return true;
        }

        return false;
    }

    getValidationScript(options = undefined) {
        var jsCheck = "({jsVar}[0] == '' && ({jsVar}[1] != '' || {jsVar}[2] != '' || {jsVar}[3] != '' || {jsVar}[4] != '' || {jsVar}[5] != '' || {jsVar}[6] != ''))\n\t\t\t\t|| ({jsVar}[1] == '' && ({jsVar}[0] != '' || {jsVar}[2] != '' || {jsVar}[3] != '' || {jsVar}[4] != '' || {jsVar}[5] != '' || {jsVar}[6] != ''))\n\t\t\t\t|| ({jsVar}[2] == '' && ({jsVar}[1] != '' || {jsVar}[0] != '' || {jsVar}[3] != '' || {jsVar}[4] != '' || {jsVar}[5] != '' || {jsVar}[6] != ''))\n\t\t\t\t|| ({jsVar}[3] == '' && ({jsVar}[1] != '' || {jsVar}[2] != '' || {jsVar}[0] != '' || {jsVar}[4] != '' || {jsVar}[5] != '' || {jsVar}[6] != ''))\n\t\t\t\t|| ({jsVar}[4] == '' && ({jsVar}[1] != '' || {jsVar}[2] != '' || {jsVar}[3] != '' || {jsVar}[0] != '' || {jsVar}[5] != '' || {jsVar}[6] != ''))\n\t\t\t\t|| ({jsVar}[5] == '' && ({jsVar}[1] != '' || {jsVar}[2] != '' || {jsVar}[3] != '' || {jsVar}[4] != '' || {jsVar}[0] != '' || {jsVar}[6] != ''))\n\t\t\t\t|| ({jsVar}[6] == '' && ({jsVar}[1] != '' || {jsVar}[2] != '' || {jsVar}[3] != '' || {jsVar}[4] != '' || {jsVar}[5] != '' || {jsVar}[0] != ''))";
        return ["", jsCheck];
    }

};

//end func getValidationScript
class RadioCompareExMulti extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    //複数の$valueに対応（指定割オプションの通話先指定など）
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (_POST[optstr0][optstr1][options[1]] != "" && (value[0].trim() == "" && value[1].trim() == "" && value[2].trim() == "" && value[3].trim() == "" && value[4].trim() == "")) {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `frm.elements['${options[0]}'][${options[1]}].checked == true && ({jsVar}[0] == '' && {jsVar}[1] == '' && {jsVar}[2] == '' && {jsVar}[3] == '' && {jsVar}[4] == '')`;
        return ["", `${jsCheck}`];
    }

};

//end func getValidationScript
class RadioCompareExReverse extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    //複数の$valueに対応（指定割オプションの通話先指定など）
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (_POST[optstr0][optstr1] == options[2] && (value[0].trim() != "" || value[1].trim() != "" || value[2].trim() != "" || value[3].trim() != "" || value[4].trim() != "")) {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `frm.elements['${options[0]}'][${options[1]}].checked == true && ({jsVar}[0] != '' || {jsVar}[1] != '' || {jsVar}[2] != '' || {jsVar}[3] != '' || {jsVar}[4] != '')`;
        return ["", `${jsCheck}`];
    }

};

class DateBefore extends HTML_QuickForm_Rule {
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

class DateBeforeEx extends HTML_QuickForm_Rule {
    validate(value, options) {
        var time = mktime(0, 0, 0, date("m"), date("d") - 1, date("Y"));

        if (value[0] != options || value[2] != "specify" || mktime(0, 0, 0, value[1].m, value[1].d, value[1].Y) > time) {
            return true;
        }

        return false;
    }

    getValidationScript(options = undefined) //$time = mktime(0,0,0,date("m"),date("d"),date("Y"));
    {
        var time = "(makeTime(new Array(" + date("Y") + "," + date("n") + "," + date("j") + ")) - 1)";
        var check = `!(${time} < Number(makeTime({jsVar}[1])))`;
        return ["", `{jsVar}[0] == '${options}' && {jsVar}[2] == 'specify' && '' != {jsVar}[1] && ${check}`];
    }

};

class RadioDateBefore extends HTML_QuickForm_Rule {
    validate(value, options) {
        var time = mktime(0, 0, 0, date("m"), date("d") - 1, date("Y"));

        if (value[0] != options || mktime(0, 0, 0, value[1].m, value[1].d, value[1].Y) > time) {
            return true;
        }

        return false;
    }

    getValidationScript(options = undefined) {
        var time = "Number(makeTime(new Array(" + date("Y") + "," + date("n") + "," + date("j") + ")) - 1)";
        var check = `!(${time} < Number(makeTime({jsVar}[1])))`;
        return ["", `{jsVar}[0] == '${options}' && '' != {jsVar}[1] && ${check}`];
    }

};

//end func getValidationScript
class CheckboxCompareDateBefore extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (value[0] == "specify" && _POST[optstr0][optstr1] == 1) {
            var time = mktime(0, 0, 0, date("m"), date("d") - 1, date("Y"));

            if (mktime(0, 0, 0, value[1].m, value[1].d, value[1].Y) > time) {
                return true;
            }

            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var time = "(makeTime(new Array(" + date("Y") + "," + date("n") + "," + date("j") + ")) - 1)";
        var check = `${time} > Number(makeTime({jsVar}[1])) && frm.elements['${options[0]}'].checked`;
        return ["", `'' != {jsVar}[1] && {jsVar}[0] == 'specify' && ${check}`];
    }

};

//end func getValidationScript
class CheckboxCompareDateRule extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (value[0] == "specify" && _POST[optstr0][optstr1] == 1) {
            if (value[1].m == "" || value[1].d == "" || value[1].Y == "") {
                return false;
            }

            if (checkdate(value[1].m, value[1].d, value[1].Y) == false) {
                return false;
            }
        }

        return true;
    }

    getValidationScript(options = undefined) {
        return ["", `{jsVar}[0] == 'specify' && frm.elements['${options[0]}'].checked && Check_Date({jsVar}[1])`];
    }

};

//end func getValidationScript
class checkMultiple extends HTML_QuickForm_Rule {
    validate(value, options) {
        if (value % options != 0) {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `% ${options} != 0`;
        return ["", `{jsVar} ${jsCheck}`];
    }

};

//end func getValidationScript
class CheckboxCompareMultiple extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (value[0] == "specify" && _POST[optstr0][optstr1] == 1) {
            if (value[1] % options[1] != 0) {
                return false;
            }

            return true;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `% ${options[1]} != 0 && frm.elements['${options[0]}'].checked `;
        var check = "== 'specify'";
        return ["", `{jsVar}[1] ${jsCheck} && {jsVar}[0] ${check}`];
    }

};

//end func getValidationScript
class CheckboxCompareRegexMulti extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (value[0] == "specify" && _POST[optstr0][optstr1] == 1) {
            if (preg_match(options[1], value[1]) == fales) {
                return false;
            }

            return true;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        return ["", `${options[1]}.test({jsVar}[1]) == false && frm.elements['${options[0]}'].checked && {jsVar}[0] == 'specify'`];
    }

};

//end func getValidationScript
class CheckboxCompareRegex extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (_POST[optstr0][optstr1] == 1) {
            if (preg_match(options[1], value) == fales) {
                return false;
            }

            return true;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        return ["", `${options[1]}.test({jsVar}) == false && frm.elements['${options[0]}'].checked`];
    }

};

//end func getValidationScript
class RadioCompareRange extends HTML_QuickForm_Rule {
    validate(value, options) {
        if (value[0] >= options[0] && value[0] <= options[1] && value[1].trim() == "") {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `>= ${options[0]} && {jsVar}[0] <= ${options[1]} && ({jsVar}[1] == '')`;
        return ["", `{jsVar}[0] ${jsCheck}`];
    }

};

//end func getValidationScript
class chkTelCnt extends HTML_QuickForm_Rule {
    validate(value, options) {
        var A_tmp = preg_split("/\r/", value[1].trim());
        A_tmp = preg_replace("/\n/", "", A_tmp);
        A_tmp = preg_replace("/\r/", "", A_tmp);
        A_tmp = A_tmp.replace(/\-/g, "");
        A_tmp = A_tmp.replace(/\(/g, "");
        A_tmp = A_tmp.replace(/\)/g, "");
        A_tmp = array_unique(A_tmp);

        if (value[0] >= options[0] && value[0] <= options[1] && A_tmp.length != options[2]) {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `>= ${options[0]} && {jsVar}[0] <= ${options[1]} && (checkTelCnt({jsVar}[1]) != ${options[2]})`;
        return ["", `{jsVar}[0] ${jsCheck}`];
    }

};

//end func getValidationScript
class orgFunc extends HTML_QuickForm_Rule {
    validate(value, options) {
        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `!= '' &&  ${options}(frm) == false`;
        return ["", `{jsVar}[0] ${jsCheck}`];
    }

};

//end func getValidationScript
class dateComp extends HTML_QuickForm_Rule {
    validate(values) {
        var new Function("$a, $b", "return mktime($a[\"H\"],0,0,$a[\"m\"],$a[\"d\"],$a[\"Y\"]) <= mktime($b[\"H\"],0,0,$b[\"m\"],$b[\"d\"],$b[\"Y\"]);");
        values[0].H = +values[0].H;
        values[0].m = +values[0].m;
        values[0].d = +values[0].d;
        values[0].Y = +values[0].Y;
        values[1].H = +values[1].H;
        values[1].m = +values[1].m;
        values[1].d = +values[1].d;
        values[1].Y = +values[1].Y;
        return compareFn(values[0], values[1]);
    }

    getValidationScript(options = undefined) {
        var jsCheck = "!(Number(makeTime({jsVar}[0])+{jsVar}[0][3]) <= Number(makeTime({jsVar}[1])+{jsVar}[1][3]))";
        return ["", `'' != {jsVar}[0] && ${jsCheck}`];
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
        if (values[2] != "specify") {
            return true;
        } else {
            operator = this._findOperator(operator);
            var new Function("$a, $b", "return mktime($a[\"H\"],0,0,$a[\"m\"],$a[\"d\"],$a[\"Y\"]) " + operator + " mktime($b[\"H\"],0,0,$b[\"m\"],$b[\"d\"],$b[\"Y\"]);");
            values[0].H = +values[0].H;
            values[0].m = +values[0].m;
            values[0].d = +values[0].d;
            values[0].Y = +values[0].Y;
            values[1].H = +values[1].H;
            values[1].m = +values[1].m;
            values[1].d = +values[1].d;
            values[1].Y = +values[1].Y;
            return compareFn(values[0], values[1]);
        }
    }

    getValidationScript(operator = undefined) {
        operator = this._findOperator(operator);
        var check1 = "{jsVar}[2] == 'specify'";
        var check2 = `!(Number(makeTime({jsVar}[0])+{jsVar}[0][3]) ${operator} Number(makeTime({jsVar}[1])+{jsVar}[1][3]))`;
        return ["", `'' != {jsVar}[0] && ${check1} && ${check2}`];
    }

};

class CheckboxDatecomparePlus extends HTML_QuickForm_Rule {
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

    validate(values, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (values[0] == "specify" && _POST[optstr0][optstr1] == 1) {
            var operator = this._findOperator(options[1]);

            var new Function("$a, $b", "return mktime($a[\"H\"],0,0,$a[\"m\"],$a[\"d\"],$a[\"Y\"]) " + operator + " mktime($b[\"H\"],0,0,$b[\"m\"],$b[\"d\"],$b[\"Y\"]);");
            values[1].H = +values[1].H;
            values[1].m = +values[1].m;
            values[1].d = +values[1].d;
            values[1].Y = +values[1].Y;
            values[2].H = +values[2].H;
            values[2].m = +values[2].m;
            values[2].d = +values[2].d;
            values[2].Y = +values[2].Y;
            return compareFn(values[1], values[2]);
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var operator = this._findOperator(options[1]);

        var check1 = "{jsVar}[0] == 'specify'";
        var check2 = `!(Number(makeTime({jsVar}[1])+{jsVar}[1][3]) ${operator} Number(makeTime({jsVar}[2])+{jsVar}[2][3]))`;
        return ["", `'' != {jsVar}[1] && ${check1} && ${check2} && frm.elements['${options[0]}'].checked`];
    }

};

class MailSendCheck extends HTML_QuickForm_Rule {
    validate(value, options) {
        if ((value[1] == options || value[2] == options || value[3] == options || value[4] == options || value[5] == options) && value[0] == "") {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `== '' && ({jsVar}[1] == '${options}' || {jsVar}[2] == '${options}' || {jsVar}[3] == '${options}' || {jsVar}[4] == '${options}' || {jsVar}[5] == '${options}')`;
        return ["", `{jsVar}[0] ${jsCheck}`];
    }

};

class TrimChk extends HTML_QuickForm_Rule {
    validate(value) {
        if (value != "") {
            if (mb_convert_kana(value, "s").trim() == "") //全角スペースを半角に変換してからtrim
                {
                    return false;
                }
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = "{jsVar} != '' && {jsVar}.replace(/[\u3000\\s]/g,'').length == 0";
        return ["", `${jsCheck}`];
    }

};