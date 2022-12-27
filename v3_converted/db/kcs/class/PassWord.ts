//
//パスワード入力制限時のチェック
//
//@since 2006/12/15
//@author 石崎公久
//@filesource
//@package Base
//@subpackage Password
//
//
//パスワード文字列で同じ文字が何文字以上連続してはいけないか
//スーパーユーザーの最小文字数
//一般ユーザーの最小文字数
//パスワード入力制限なしの最小文字数
//
//パスワード入力制限時のチェック
//
//@since 2006/12/15
//@author 石崎公久
//@package Base
//@subpackage Password
//

require("DBUtil.php");

require("ErrorUtil.php");

require("common.php");

require("CryptUtil.php");

require("Authority.php");

global[REPEAT] = 3;
global[MINSU] = 8;
global[MINNO] = 6;
global[MINIDF] = 4;

//
//呼び出しもとの Pact にパスワード入力制限が掛かっているかのチェック
//
//セッションに格納されている顧客コードからその企業にパスワード入力制限が
//設定されているかを確認する。
//使用例
//<code>
//$havePW = new PassWord();
//$pass_flg = $havePW->havePassWD();
////パスワード制限時の処理を行う分岐を入れる
//if("true" == $pass_flg){
//</code>
//
//return bool 権限ありture 　権限なしfalse
//
//
//パスワード世代管理
//
//パスワードを変更するユーザの新しいパスワードが過去三世代に
//使われていないかを確認する。
//新しいパスワードはグローバルのポストハッシュに入れられている
//値を取得し、引数で渡された三つの文字列と同じものが無ければ
//正常値（1）を返す。
//
//@param $pass1 現在のパスワード
//@param $pass2 一世代前のパスワード
//@param $pass3 二世代前のパスワード
//@return int 正常1 現在と同じ-1 前回と同じ-2 前々回と同じ-3
//
//
//パスワード文字種チェック
//
//@param QuickForm
//@return QuickForm チェックエレメント追加後のオブジェクト
//2009/08/26 英語化対応 maeda
//
class PassWord {
	havePassWD() {
		var O_auth = new Authority();
		var A_co_auth = O_auth.getAllPactAuth(_SESSION.pactid);

		if (-1 !== A_co_auth.indexOf(72)) {
			return true;
		}

		return false;
	}

	passAgesCheck(pass1, pass2, pass3) {
		var O_crypt = new CryptUtil();

		if (O_crypt.getCrypt(_POST.passwd) == pass3) {
			return -3;
		}

		if (O_crypt.getCrypt(_POST.passwd) == pass2) {
			return -2;
		}

		if (O_crypt.getCrypt(_POST.passwd) == pass1) {
			return -1;
		}

		return 1;
	}

	passStrCheck(O_form) //パスワードが数字のみ
	{
		var oldchar = "";
		var repCnt = 1;

		for (var cnt = 0; cnt < mb_strlen(_POST.passwd); cnt++) //一文字ずつ取り出す
		//アルファベットマッチ
		//同一の文字が規定以上連続しているか
		{
			var character = _POST.passwd.substr(cnt, 1);

			if (preg_match("/[a-zA-Z]/", character)) {
				var charFlg = true;
			} else if (preg_match("/[0-9]/", character)) {
				var numFlg = true;
			}

			if (character == oldchar) {
				repCnt++;
			} else {
				repCnt = 1;
			}

			if (repCnt == REPEAT) //表示言語設定
				{
					if ("ENG" == _SESSION.language) {
						O_form.setElementError("passwd", "Identical characters (alphanumeric) cannot be used consecutively");
					} else {
						O_form.setElementError("passwd", "\u540C\u4E00\u6587\u5B57\uFF08\u82F1\u6570\u5B57\uFF09\u306E\u9023\u7D9A\u4F7F\u7528\u306F\u3067\u304D\u307E\u305B\u3093");
					}

					charFlg = numFlg = true;
					break;
				}

			oldchar = character;
		}

		if (charFlg == false) //表示言語設定
			{
				if ("ENG" == _SESSION.language) {
					O_form.setElementError("passwd", "Use a mixture of letters and numbers");
				} else {
					O_form.setElementError("passwd", "\u82F1\u6570\u5B57\u3092\u6DF7\u5728\u3057\u8A2D\u5B9A\u3057\u3066\u4E0B\u3055\u3044");
				}
			} else if (numFlg == false) //表示言語設定
			{
				if ("ENG" == _SESSION.language) {
					O_form.setElementError("passwd", "Use a mixture of letters and numbers");
				} else {
					O_form.setElementError("passwd", "\u82F1\u6570\u5B57\u3092\u6DF7\u5728\u3057\u8A2D\u5B9A\u3057\u3066\u4E0B\u3055\u3044");
				}
			}

		return O_form;
	}

};