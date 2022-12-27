//
//BasicRule
//
//@uses HTML
//@uses _QuickForm_Rule
//@package Base
//@subpackage QuickForm
//@filesource
//@author ishizaki
//@since 2008/02/04
//
//
//
//指定された正規表現でチェックを行う。マッチしなければエラーにするルール。
//
//@uses HTML
//@uses _QuickForm_Rule
//@package Base
//@subpackage QuickForm
//@author ishizaki
//@since 2008/02/04
//
//
//渡された日付が空であればエラーを返す。
//
//@uses HTML
//@uses _QuickForm_Rule
//@package Base
//@subpackage QuickForm
//@author ishizaki
//@since 2008/02/04
//
//
//渡された日付が空であればエラーを返す。（英語化対応）
//
//@uses HTML
//@uses _QuickForm_Rule
//@package Base
//@subpackage QuickForm
//@author maeda
//@since 2009/09/30
//
//
//指定された拡張子にマッチしなければエラーを返す。
//
//@uses HTML
//@uses _QuickForm_Rule
//@package Base
//@subpackage QuickForm
//@author ishizaki
//@since 2008/02/04
//
//
//Datecompare
//
//@uses HTML
//@uses _QuickForm_Rule
//@package Base
//@subpackage QuickForm
//@author ishizaki
//@since 2008/02/04
//
//
//checkRequireMultiForm
//指定された項目のどれかに値が入っている場合、全て必須とする
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author web
//@since 2019/02/20
//
//
//hasChangedCheckRequireMultiForm
//指定された項目に変更がある場合、任意の項目全てを入力必須とする
//@uses HTML
//@uses _QuickForm_Rule
//@package
//@author web
//@since 2019/02/25
//

require("HTML/QuickForm.php");

require("HTML/QuickForm/Rule.php");

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
class NotRegexRule extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    if (preg_match(options, value)) {
      return false;
    }

    return true;
  }

  getValidationScript(options = undefined) {
    return ["  var regex = " + options + ";\n", "{jsVar} != '' && regex.test({jsVar})"];
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
class CheckdateRule extends HTML_QuickForm_Rule {
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
//@author maeda
//@since 2009/09/30
//
//@param mixed $value
//@param mixed $options
//@access public
//@return void
//
//
//QuickFormが行うJavascript側のチェック
//
//@author maeda
//@since 2009/09/30
//
//@param mixed $options
//@access public
//@return void
//
class CheckdateRuleEng extends HTML_QuickForm_Rule {
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

  getValidationScript(options = undefined) //表示言語設定
  {
    if ("ENG" == _SESSION.language) {
      return ["", "Check_Date_Eng({jsVar})"];
    } else {
      return ["", "Check_Date({jsVar})"];
    }
  }

};

//
//QuickFormが行うPHP側のチェック
//
//ファイルのアップロードの際に行うメソッドで<br>
//PHP側のチェックは行わない。
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
class FileregexRule extends HTML_QuickForm_Rule {
  validate(value, options = undefined) {
    return true;
  }

  getValidationScript(options = undefined) {
    return ["  var regex = " + options + ";\n", "{jsVar} != '' && !regex.test({jsVar})"];
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
class DatecompareRule extends HTML_QuickForm_Rule {
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
    var check = `!(Number(makeTime({jsVar}[0])) ${options} Number(makeTime({jsVar}[1])))`;
    return ["", `'' != {jsVar}[0] && ${check}`];
  }

};

class checkRequireMultiForm extends HTML_QuickForm_Rule {
  validate(values, options: {} | any[]) //空ではない項目数と項目数が一致すれば全て値が入っている
  //cntが0なら全ての項目が空なので、OK
  {
    var cnt = 0;

    for (var value of Object.values(values)) {
      if (value != "") {
        cnt++;
      }
    }

    if (cnt != options.length && cnt != 0) {
      return false;
    }

    return true;
  }

  getValidationScript(options: {} | any[]) //
  //変数宣言と値が入ってる項目のカウント
  //チェック関数
  {
    var cnt = options.length;
    var jsValues = sprintf("value[%d] = 0;\n for( var i=0;i < %d;i++){\n if( value[i] != ''){\n value[%d]++;\n }\n }\n ", cnt, cnt, cnt);
    var jsCheck = sprintf("(({jsVar}[%d] != %d) && ({jsVar}[%d] != 0))", cnt, cnt, cnt);
    return [jsValues, `${jsCheck}`];
  }

};

//$options["changed"]		= array("elemid" => "value" );	//	この項目が変更されている場合
//	$options["req"]			= array();		//	この項目は必須となる
//	$options["values"]		= array();		//	changed + reqの値
//	$options["allow_empty"]	= true;			//	req項目の空入力を許可する
//サーバー側
//web側
class hasChangedCheckRequireMultiForm extends HTML_QuickForm_Rule {
  validate(post: {} | any[], options: {} | any[]) //trueならvalidate通過
  //値が変更されたかチェックする項目
  //req項目の空を許可する
  //必須項目が全て空の場合、OKとする
  {
    var check = undefined;

    if (undefined !== options.changed) {
      var changed = options.changed;
    }

    if (undefined !== options.req) {
      var req = options.req;
    }

    if (undefined !== options.values) {
      var values = options.values;
    }

    var cnt = 0;
    var is_changed = false;

    for (var key in values) //必須項目に値が入っている
    {
      var value = values[key];

      if (undefined !== changed[value] && changed[value] != post[key]) //必須項目を必須にする
        {
          is_changed = true;
        }

      if (-1 !== req.indexOf(value) && post[key] != "") {
        cnt++;
      }
    }

    if (!!options.allow_empty) //必須項目に値ない
      {
        if (cnt == 0) {
          return true;
        }
      }

    if (!is_changed) {
      return true;
    }

    if (cnt != req.length && cnt != 0) {
      return false;
    }

    return true;
  }

  getValidationScript(options: {} | any[]) //値が変更されたかチェックする項目
  //チェック関数
  //changedの値が変更されていた際に、必須項目に値が入っているかを確認する
  //req項目の空を許可する
  //必須項目が全て空の場合、OKとする
  {
    if (undefined !== options.changed) {
      var changed = options.changed;
    }

    if (undefined !== options.req) {
      var req = options.req;
    }

    if (undefined !== options.values) {
      var values = options.values;
    }

    var idx_req_cnt = values.length;
    var idx_changed = idx_req_cnt + 1;
    jsValues += "\n";
    jsValues += "value[" + idx_req_cnt + "] = 0;\n";
    jsValues += "value[" + idx_changed + "] = 0;\n";

    for (var key in values) {
      var value = values[key];

      if (undefined !== changed[value]) {
        jsValues += "if( value[" + key + "] != '" + changed[value] + "') value[" + idx_changed + "] = 1;\n";
      }

      if (-1 !== req.indexOf(value)) {
        jsValues += "if( value[" + key + "] != '') value[" + idx_req_cnt + "]++;\n";
      }
    }

    jsValues += "\n";
    var jsCheck = "(({jsVar}[" + idx_req_cnt + "] != " + req.length + ") && ({jsVar}[" + idx_changed + "] != 0))";

    if (!!options.allow_empty) {
      jsCheck = "(" + jsCheck + " && " + "{jsVar}[" + idx_req_cnt + "] != 0 )";
    }

    return [jsValues, `${jsCheck}`];
  }

};