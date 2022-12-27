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
// 概要： 特定のフォームの値が指定された値だともう一つの値が入っているかをしらべる
// チェックボックス用
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
// 必要パラメータ：配列["m"],配列["d"],配列["Y"]
//
//
// 概要： 第１引数で指定された値が第２引数で指定された値の倍数かどうか調べる
// 必要パラメータ：
// 配列[0] = チェックする要素名
// 配列[1] = nullかどうか調べる要素名
// 配列[0]の値
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
// 概要： メール受信設定があればメールアドレスは必須にする
// 必要パラメータ：
// 第１引数 = メールアドレス，メールアドレス受信設定の項目全部
//
//
// 概要： スペースしか入力されていない場合に警告を出す
// 必要パラメータ：
// 第１引数 = 入力された値
//

require("HTML/QuickForm.php");

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
class CheckboxCompare extends HTML_QuickForm_Rule {
    validate(value, options) //options[0]が二次元配列に入ってくるので分解
    {
        var firstkakko = strrpos(options[0], "[");
        var lastkakko = strrpos(options[0], "]");
        var optstr0 = options[0].substr(0, firstkakko);
        var optstr1 = options[0].substr(firstkakko + 1, lastkakko - firstkakko - 1);

        if (value == "" && _POST[optstr0][optstr1] == 1) {
            return false;
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `== '' && frm.elements['${options}'].checked`;
        return ["", `{jsVar} ${jsCheck}`];
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
            if (value[0] != options[1] && value[1].trim() == "") {
                return false;
            }
        }

        return true;
    }

    getValidationScript(options = undefined) {
        var jsCheck = `== '' && frm.elements['${options[0]}'].checked && ({jsVar}[0] != '${options[1]}')`;
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
        if (values[2] != "schedule") {
            return true;
        } else {
            operator = this._findOperator(operator);
            var new Function("$a, $b", "return mktime(0,0,0,$a[\"m\"],$a[\"d\"],$a[\"Y\"]) " + operator + " mktime(0,0,0,$b[\"m\"],$b[\"d\"],$b[\"Y\"]);");
            return compareFn(values[0], values[1]);
        }
    }

    getValidationScript(operator = undefined) {
        operator = this._findOperator(operator);
        var check1 = "{jsVar}[2][0] == 'schedule'";
        var check2 = `!(Number(makeTime({jsVar}[0])) ${operator} Number(makeTime({jsVar}[1])))`;
        return ["", `'' != {jsVar}[0] && ( ${check1} && ${check2} )`];
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