//
//日付操作クラス
//
//データベースへのインターフェイスライブラリ<br>
//
//更新履歴：<br>
//2006/06/30 中西達夫 作成<br>
//
//@package Base
//@subpackage DateUtil
//@filesource
//@author nakanita
//@since 2008/02/04
//
//
//
//日付操作クラス
//
//@package Base
//@subpackage DateUtil
//@access public
//@author nakanita
//@since 2008/06/30
//@uses MtDBUtil
//
//DEBUG * 動作確認 *
//$O_date = &MtDateUtil::singleton();
//print $O_date->getNow() . "\n";
//print $O_date->getToday() . "\n";

require("MtDBUtil.php");

//
//コンストラクタ
//
//@author nakanita
//@since 2008/06/30
//
//@access private
//@return void
//
//
//ただ１つしか無いこのクラスのインスタンスを取得する
//new の代わりに、このメソッドによってインスタンスを得ること
//
//@author nakanita
//@since 2008/06/30
//
//@static
//@access public
//@return void
//
// 現在のタイムスタンプ文字列(timestamp型)を取得する
// 
// @author nakanita 
// @since 2008/06/30
// 
// @static
// @access public
// @return void
//
//今日の日付文字列(date型)を取得する
//
//@author nakanita
//@since 2008/06/30
//
//@static
//@access public
//@return void
//
class MtDateUtil {
	static O_Instance = undefined;

	constructor() //いまのところ何もしていない
	{}

	static singleton() {
		if (MtDateUtil.O_Instance == undefined) {
			MtDateUtil.O_Instance = new MtDateUtil();
		}

		return MtDateUtil.O_Instance;
	}

	static getNow() //現状 MtDBUtil の中にある
	//内容は以下のものと同様
	//return date("Y-m-d H:i:s");
	{
		var O_db = MtDBUtil.singleton();
		return O_db.getNow();
	}

	static getToday() //現状 MtDBUtil の中にある
	//内容は以下のものと同様
	//return date("Y-m-d");
	{
		var O_db = MtDBUtil.singleton();
		return O_db.getToday();
	}

};