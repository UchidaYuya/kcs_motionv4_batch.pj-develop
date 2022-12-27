//
//QuickForm自作Rule集<br>
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
//配列で渡された二つの数値内に収まっているか確認（以上、以内)
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author ishizaki
//@since 2008/10/27
//
//
//渡された日付に不足があればエラーを返す。
//
//@package Shared View
//@subpackage QuickForm
//@author houshiyama
//@since 2008/04/08
//@uses HTML_QuickForm_Rule
//
//
//渡された日付に不足があればエラーを返す。（年月）
//
//@package Shared View
//@subpackage QuickForm
//@author houshiyama
//@since 2008/08/23
//@uses HTML_QuickForm_Rule
//
//
//渡された日付が空だった場合エラーを返す
//
//@package Shared View
//@subpackage QuickForm
//@author date
//@since 2014/10/29
//@uses HTML_QuickForm_Rule
//
//
//QRDatecompareRule
//
//@uses HTML
//@uses _QuickForm_Rule
//@package Shared View
//@subpackage QuickForm
//@author katsushi
//@since 2008/08/11
//
//
//QRChkboxRequireDateRule
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author katsushi
//@since 2008/08/11
//
//
//QRForbiddenCharacter
//禁止文字の設定。
//formatに正規表現にて禁止文字を設定する
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author web
//@since 2016/02/08
//
//
//QRIntNumeric
//
//@uses HTML
//@uses _QuickForm_Rule
//@package Shared View
//@subpackage QuickForm
//@author katsushi
//@since 2008/08/11
//
//
//QRIntPositive
//正数かチェックする
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author date
//@since 2015/10/07
//
//
//QRIntNumericEven
//偶数かどうかチェックする
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author yukimura
//@since 2015/09/27
//
//
//QRmultiRequired
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author katsushi
//@since 2008/08/29
//
//
//QRAdvCheckBoxMulti
//以下の場合、エラーとして返すようにする
//test1["key"] = true;  test2["key"] = true;
//optionsには、key=array,tgt=array,myを渡す
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author web
//@since 2015/10/07
//
//
//QRcompareRequired
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author katsushi
//@since 2008/09/08
//
//
//QRRadioCompare
//value[0]がoptionsの値である時にvalueが空でないか確認する
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author web
//@since 2015/09/27
//
//
//QRcompareRequiredArray
//value[1]を配列に対応させた。advcheckboxの使用を想定している。
//チェックボックスをどれか一つ選択してほしい時などに使ってね
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author date
//@since 2015/09/25
//
//
//QRallRequired
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author katsushi
//@since 2008/09/08
//
//
//QRcallOriginalFunction
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author katsushi
//@since 2008/09/08
//
//
//管理情報の番号には必ず半角英数を含める
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author houshiyama
//@since 2010/02/02
//
//
//電話番号は半角英数字のみ
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author date
//@since 2014/12/18
//
//
//電話番号は半角英数字のみ
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author date
//@since 2014/12/18
//
//
//納品日のメール。メールアドレス未登録のチェック
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author date
//@since 2015/02/18
//
//
//納品日のメール。ユーザーがメールを受取る設定になっていない。
//
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author date
//@since 2015/02/18
//
//
//QRCheckDateYmdHi
//日付と時間チェック
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author web
//@since 2016/05/06
//
//
//QRMultiMailCheck
//s202のメール送信案件の、カンマ区切りでメールアドレス入力の書式チェック
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author date
//@since 2016/11/25
//

require("HTML/QuickForm/Rule.php");

//
//validate
//
//@author ishizaki
//@since 2008/10/27
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//
//@author ishizaki
//@since 2008/10/27
//
//@param mixed $options
//@access public
//@return void
//
class RangeInteger extends HTML_QuickForm_Rule {
  validate(value, options) {
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

    return ["", `true == isNaN({jsVar}) || {jsVar} == '' || ${test}`];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $options
//@access public
//@return void
//
class QRCheckDate extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (value.m + value.d + value.Y != "") {
      if (value.m == "" || value.d == "" || value.Y == "") {
        return false;
      }

      if (checkdate(value.m, value.d, value.Y) == false) {
        return false;
      }
    }

    return true;
  }

  getValidationScript(options = undefined) {
    return ["", "Check_Date({jsVar})"];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $options
//@access public
//@return void
//
class QRCheckMonth extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (value.m + value.Y != "") {
      if (value.m == "" || value.Y == "") {
        return false;
      }
    }

    return true;
  }

  getValidationScript(options = undefined) {
    var jsVars = "\n\t\t\t\t\tvar year = value[0];\n\t\t\t\t\tvar month = value[1];\n\t\t\t\t\t";
    var jsCheck = "\n\t\t\t\t\t( year == '' && month != '' ) || ( year != '' && month == '' )\n\t\t\t\t\t";
    return [`${jsVars}`, `${jsCheck}`];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $options
//@access public
//@return void
//
class QRCheckDateEmptyYMD extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (value.m + value.d + value.Y == "") {
      return false;
    }

    return true;
  }

  getValidationScript(options = undefined) {
    var jsVars = "  var year = value[0];\n  var month = value[1];\n  var day = value[2];\n";
    var jsCheck = "( year == '' && month == '' && day == '' )";
    return [`${jsVars}`, `${jsCheck}`];
  }

};

//
//比較するタイプ
//
//@var array
//@access private
//
//
//引数を対応する演算子で返す
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $name
//@access private
//@return void
//
//
//QuickFormが行うPHP側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $options
//@access public
//@return void
//
class QRDatecompareRule extends HTML_QuickForm_Rule {
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

  validate(value, options = undefined) {
    options = this._findOperator(options);
    var new Function("$a, $b", "return mktime(0,0,0,$a[\"m\"],$a[\"d\"],$a[\"Y\"]) " + options + " mktime(0,0,0,$b[\"m\"],$b[\"d\"],$b[\"Y\"]);");
    return compareFn(value[0], value[1]);
  }

  getValidationScript(options = undefined) {
    options = this._findOperator(options);
    var check = `{jsVar}[0] != ',,' && !(Number(makeTime({jsVar}[0])) ${options} Number(makeTime({jsVar}[1])))`;
    return ["", `'' != {jsVar}[0] && ${check}`];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $options
//@access public
//@return void
//
class QRChkboxRequireDateRule extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    return true;
  }

  getValidationScript(options = undefined) {
    return ["", "{jsVar}[0].length == 0 && {jsVar}[1] == ',,'"];
  }

};

//
//validate
//PHP側の処理
//@author web
//@since 2016/02/08
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//WEB側のチェック
//@author web
//@since 2016/02/08
//
//@param mixed $options
//@access public
//@return void
//
class QRForbiddenCharacter extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (preg_match(options, value)) {
      return false;
    }

    return true;
  }

  getValidationScript(options = undefined) {
    return ["", "value.match(" + options + ")"];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author katsushi
//@since 2008/08/11
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $options
//@access public
//@return void
//
class QRIntNumeric extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (options == "required" && value == "") {
      return true;
    }

    if (is_numeric(value) == false) {
      return false;
    }

    if (String(Math.floor(value) != String(value))) {
      return false;
    }

    return true;
  }

  getValidationScript(options = undefined) {
    if (options == "required") {
      return ["", "isNaN({jsVar}) || (Math.floor({jsVar}) + \"\") != ({jsVar} + \"\")"];
    } else {
      return ["", "{jsVar} != '' && (isNaN({jsVar}) || (Math.floor({jsVar}) + \"\") != ({jsVar} + \"\"))"];
    }
  }

};

//
//validate
//
//@author web
//@since 2015/10/07
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//
//@author web
//@since 2015/10/07
//
//@param mixed $options
//@access public
//@return void
//
class QRIntPositive extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (options == "required" && value == "") {
      return true;
    }

    if (is_numeric(value) == false) {
      return false;
    }

    if (String(Math.floor(value) != String(value))) {
      return false;
    }

    if (value < 0) {
      return false;
    }

    return true;
  }

  getValidationScript(options = undefined) {
    if (options == "required") {
      return ["", "isNaN({jsVar}) || {jsVar} < 0 || (Math.floor({jsVar}) + \"\") != ({jsVar} + \"\")"];
    } else {
      return ["", "{jsVar} != '' && (isNaN({jsVar}) || {jsVar} < 0 || (Math.floor({jsVar}) + \"\") != ({jsVar} + \"\"))"];
    }
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author katsushi
//@since 2008/08/11
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author ishizaki
//@since 2008/02/04
//
//@param mixed $options
//@access public
//@return void
//
class QRIntNumericEven extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (is_numeric(value) == false) {
      return false;
    }

    if (+(value % 2) != 0) {
      return false;
    }

    return true;
  }

  getValidationScript(options = undefined) {
    return ["", "({jsVar} % 2) != 0"];
  }

};

class QRmultiRequired extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    for (var i = 0; i < options; i++) {
      if (value[i] != "") {
        return true;
      }
    }

    return false;
  }

  getValidationScript(options = undefined) {
    var A_tmp = Array();

    for (var i = 0; i < options; i++) {
      A_tmp.push("{jsVar}[" + i + "] == ''");
    }

    var jsCheck = A_tmp.join(" && ");
    return ["", `${jsCheck}`];
  }

};

//
//validate
//
//@author web
//@since 2015/10/07
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//getValidationScript
//
//@author web
//@since 2015/10/07
//
//@param mixed $options
//@access public
//@return void
//
class QRAdvCheckBoxMulti extends HTML_QuickForm_Rule {
  validate(value, options = undefined) //他のチェックボックスの値が取れない・・
  {
    return true;
  }

  getValidationScript(options = undefined) //重複チェック元の各elementの値を取得する
  //重複チェック先と、重複してるか確認する
  {
    var jsVars = "  var check = false;\n" + "  var elem;\n" + "  var tgt;\n";
    var i = 0;

    for (var key of Object.values(options.key)) {
      jsVars += "  elem =  document.getElementsByName( '" + options.my + "[" + key + "]' );\n";
      jsVars += "  var my" + i + "=elem[1].checked;\n";
      i++;
    }

    for (var tgt of Object.values(options.tgt)) //重複チェック元と先が同じ名前の場合は無視する
    {
      if (options.my == tgt) {
        continue;
      }

      i = 0;

      for (var key of Object.values(options.key)) {
        jsVars += "  elem = document.getElementsByName( '" + tgt + "[" + key + "]' );\n";
        jsVars += "  if( my" + i + " && elem[1].checked ){\n";
        jsVars += "    check = true;\n";
        jsVars += "  }\n";
        i++;
      }
    }

    var jsCheck = "check";
    return [`${jsVars}`, `${jsCheck}`];
  }

};

class QRcompareRequired extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (value[0] != "" && value[1] == "" || value[1] != "" && value[0] == "") {
      return false;
    }

    return true;
  }

  getValidationScript(options = undefined) {
    var jsVar = "({jsVar}[0] != '' && {jsVar}[1] == '') || ({jsVar}[1] != '' && {jsVar}[0] == '')";
    return ["", `${jsVar}`];
  }

};

//end func getValidationScript
class QRRadioCompare extends HTML_QuickForm_Rule {
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

class QRNumInequalityArray extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    var str = value[1].join("");

    if (+(value[0] != options) && str == "") {
      return false;
    }

    return true;
  }

  getValidationScript(options = undefined) {
    var jsCheck = `!= '${options}' && ({jsVar}[1].join('') == '')`;
    return ["", `{jsVar}[0] ${jsCheck}`];
  }

};

class QRallRequired extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    for (var i = 0; i < options; i++) {
      if (value[i] == "") {
        return false;
      }
    }

    return true;
  }

  getValidationScript(options = undefined) {
    var A_tmp = Array();

    for (var i = 0; i < options; i++) {
      A_tmp.push("{jsVar}[" + i + "] == ''");
    }

    var jsCheck = A_tmp.join(" || ");
    return ["", `${jsCheck}`];
  }

};

class QRcallOriginalFunction extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    return true;
  }

  getValidationScript(options = undefined) {
    var jsVar = options + "() != true";
    return ["", `${jsVar}`];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author houshiyama
//@since 2010/02/02
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
//@since 2010/02/02
//
//@param mixed $options
//@access public
//@return void
//
class QRalnumRegex extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (preg_match("/[a-zA-Z0-9]/", value)) {
      return true;
    }

    return false;
  }

  getValidationScript(options = undefined) {
    return ["", "!value.match(/[a-zA-Z0-9]/)"];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author date
//@since 2014/12/18
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author date
//@since 2014/12/18
//
//@param mixed $options
//@access public
//@return void
//
class QRalnumTel extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (value != "" && preg_match("/[0-9\uFF10-\uFF19a-z\uFF41-\uFF5AA-Z\uFF21-\uFF3A]/", value)) {
      return true;
    }

    return false;
  }

  getValidationScript(options = undefined) //注文履歴からmatch条件持ってきたけど、全角も混じっている・・・
  //return array("", "!value.match(/[a-zA-Z0-9]/)");
  {
    return ["", "value != '' && value.match(/[0-9\uFF10-\uFF19a-z\uFF41-\uFF5AA-Z\uFF21-\uFF3A]/) == null"];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author date
//@since 2014/12/18
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author date
//@since 2014/12/18
//
//@param mixed $options
//@access public
//@return void
//
class QRSearchTelLength extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (value != "" && mb_strlen(value) >= 3) {
      return true;
    }

    return false;
  }

  getValidationScript(options = undefined) //注文履歴からmatch条件持ってきたけど、全角も混じっている・・・
  //return array("", "!value.match(/[a-zA-Z0-9]/)");
  {
    return ["", "value != '' && value.length < 3"];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author date
//@since 2015/02/18
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author date
//@since 2015/02/18
//
//@param mixed $options
//@access public
//@return void
//
class QRRecvDeliveryMail_1 extends HTML_QuickForm_Rule {
  validate(value, options = undefined) //確定日か予定日のメールを送るを選択した場合
  {
    if (value == "expected" || value == "fixed") //メールが登録されていますか
      {
        if (options.mail == "" || is_null(options.mail)) //登録されてないのでエラー
          {
            return false;
          }
      }

    return true;
  }

  getValidationScript(options = undefined) //書いてはみたけど、販売店ではjavascriptは使われないみたい・・
  {
    return ["", "(value == 'expected' || value == 'fixed') &&  ('" + options.mail + "' == '' )"];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author date
//@since 2015/02/18
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author date
//@since 2015/02/18
//
//@param mixed $options
//@access public
//@return void
//
class QRRecvDeliveryMail_2 extends HTML_QuickForm_Rule {
  validate(value, options = undefined) //確定日か予定日のメールを送るを選択した場合
  {
    if (value == "expected" || value == "fixed") //メールが登録されていますか
      {
        if (options.acceptmail5 == 0) //販売店からのメールを受取らない設定になっている
          {
            return false;
          }
      }

    return true;
  }

  getValidationScript(options = undefined) //販売店ではjavascriptは使われないみたい・・
  {
    return ["", "(value == 'expected' || value == 'fixed') &&  ('" + options.acceptmail5 + "' == '0' )"];
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
class QRCheckDateYmdHi extends HTML_QuickForm_Rule {
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
    return ["", "CheckDateYmdHi({jsVar})"];
  }

};

//
//QuickFormが行うPHP側のチェック
//
//@author date
//@since 2015/02/18
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author date
//@since 2015/02/18
//
//@param mixed $options
//@access public
//@return void
//
class QRMultiMailCheck extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    var mails = value.split(",");

    for (var mail of Object.values(mails)) {
      if (!preg_match("/^([a-zA-Z0-9])+([a-zA-Z0-9\\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\\._-]+)+$/", mail)) {
        return false;
      }
    }

    return true;
  }

  getValidationScript(options = undefined) {
    return ["\nvar mails123 = value.split(',');\nvar check123 = false;\nfor (i = 0; i < mails123.length; i++) {\n    if( !mails123[i].match(/^[A-Za-z0-9]+[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,}$/) ){\n\t\tcheck123 = true;\n\t\tbreak;\n\t}\n}\n", "check123"];
  }

};