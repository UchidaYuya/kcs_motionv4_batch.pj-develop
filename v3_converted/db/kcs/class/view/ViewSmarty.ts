//error_reporting(E_ALL|E_STRICT);
//
//Smartyを用いる基本ＶＩＥＷクラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ViewBase
//@package Base
//@subpackage View
//@filesource
//@author nakanita
//@since 2008/02/08
//
//
//
//Smartyを用いる基本ＶＩＥＷクラス
//
//@uses ViewBase
//@package Base
//@subpackage View
//@author nakanita
//@since 2008/02/08
//

require("Smarty.class.php");

// require("view/ViewBaseHtml.php");
import ViewBaseHtml from './ViewBaseHtml';

//
//Smartyオブジェクト
//
//@var object
//@access private
//
//
//表示言語
//
//@var mixed
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param	機能拡張のための変数
//@access public
//@return void
//
//
//Smartyオブジェクトを生成する
//
//@author nakanita
//@since 2008/03/07
//
//@param boolean $common 共通/ユーザー個別フラグ
//@param mixed $language 表示言語
//@access private
//@return void
//
//
//Smartyオブジェクトを得る
//
//@author nakanita
//@since 2008/02/08
//
//@access protected
//@return object
//
//
//呼び出しファイル名と同名のテンプレート名を返す
//デフォルトのテンプレート名として使う
//
//@author nakanita
//@since 2008/02/08
//
//@access protected
//@return string
//
//
//呼び出しファイル名と同名のテンプレート名を返す
//英語版のテンプレートディレクトリから表示
//
//@author nakanita
//@since 2008/02/08
//
//@access protected
//@return string
//protected function getEnglishTemplate(){
//return $this->getDefaultTemplate();
//}
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
const path = require('path');
export default class ViewSmarty extends ViewBaseHtml {
	O_Smarty: any;
	language: any;
	getSetting: any;
	constructor(H_param:any = Array()) //$common 共通/ユーザー個別フラグを得る
	//言語のフラグを取得
	//Smarty の生成
	{
		super(H_param);

		if (true == (undefined !== H_param.common)) {
			var common = H_param.common;
		} else {
			common = false;
		}

		if (true == (undefined !== H_param.language)) {
			this.language = H_param.language;
		} else {
			this.language = "JPN";
		}

		this.O_Smarty = this.newSmarty(common, this.language);
	}

	newSmarty(common = false, language = "JPN") //共通/ユーザー個別 によってディレクトリが異なる
	//設定を得る
	//Smarty用ディレクトリ
	//$this->infoOut( $smarty_dir );
	//Smarty の生成
	{
		if (common == true) //共通の場合は"common"
			{
				var lastdir = "/common";
			} else //一般の場合
			{
				lastdir = path.dirname(process.PHP_SELF);
			}

		var O_setting = this.getSetting();

		if ("ENG" == this.language) {
			var smarty_dir = O_setting.KCS_DIR + "/template/eng" + lastdir;
			var smarty_local = O_setting.KCS_DIR + "/smarty_compile/eng" + lastdir;
		} else {
			smarty_dir = O_setting.KCS_DIR + "/template" + lastdir;
			smarty_local = O_setting.KCS_DIR + "/smarty_compile" + lastdir;
		}

		var smarty_cache = smarty_local + "/cache";
		var smarty_compile = smarty_local + "/compile";
		var O_smarty = new Smarty();
		O_smarty.template_dir = smarty_dir;
		O_smarty.cache_dir = smarty_cache;
		O_smarty.compile_dir = smarty_compile;
		return O_smarty;
	}

	get_Smarty() {
		return this.O_Smarty;
	}

	getDefaultTemplate() //設定を得る
	//ファイル名の拡張子を置換する
	//表示言語分岐
	{
		var O_setting = this.getSetting();

		var php_self = process.PHP_SELF.replace(/\.php$/g, ".tpl");

		if ("ENG" == this.language) {
			var template = O_setting.KCS_DIR + "/template/eng" + php_self;
		} else {
			template = O_setting.KCS_DIR + "/template" + php_self;
		}

		return template;
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};