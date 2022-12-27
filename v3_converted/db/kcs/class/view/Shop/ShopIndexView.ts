//
//ShopIndexViewクラス
//
//@uses ViewBaseHtml
//@package ShopMenu
//@filesource
//@author nakanita
//@since 2008/11/06
//
//
//error_reporting(E_ALL);
//
//ShopIndexViewクラス
//
//@uses ViewBaseHtml
//@package ShopMenu
//@author houshiyama
//@since 2008/11/06
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewBaseHtml.php");

require("Smarty.class.php");

//
//__construct
//
//@author nakanita
//@since 2008/11/06
//
//@access public
//@return void
//
//
//Smartyオブジェクトを生成する<br/>
//Indexの場合に限り、ディレクトリの位置が異なっているので独自に作成した
//
//@author nakanita
//@since 2008/11/06
//
//@access private
//@return void
//
//
//setAssign
//
//@author nakanita
//@since 2008/10/06
//
//@param mixed $key
//@param mixed $value
//@access public
//@return void
//
//
//assignSmarty
//
//@author nakanita
//@since 2008/11/06
//
//@access protected
//@return void
//
//
//displaySmarty
//
//@author nakanita
//@since 2008/11/06
//
//@access public
//@return void
//
//
//__destruct
//
//@author nakanita
//@since 2008/11/06
//
//@access public
//@return void
//
class ShopIndexView extends ViewBaseHtml {
	constructor() //ショップ属性を付ける
	//Smarty の生成
	{
		super({
			site: ViewBaseHtml.SITE_SHOP
		});
		this.O_Smarty = this.newIndexSmarty();
		this.H_assign = Array();
	}

	newIndexSmarty() //$lastdir = dirname($_SERVER["PHP_SELF"]);	// 一般の場合
	//設定を得る
	//Smarty用ディレクトリ
	//$smarty_dir   = $O_setting->KCS_DIR . "/template" . $lastdir;
	//		$smarty_local = $O_setting->KCS_DIR . "/smarty_compile" . $lastdir;
	//		$smarty_cache   = $smarty_local . "/cache";
	//		$smarty_compile = $smarty_local . "/compile";
	//20081128 ishizaki インデックスページのグループ化
	//!!!!!!!! ディレクトリを直値指定してます !!!!!!!!
	//'/kcs/template//compile' となってしまうので
	//$this->infoOut( $smarty_dir );
	//Smarty の生成
	{
		var O_setting = this.getSetting();
		var smarty_dir = O_setting.KCS_DIR + "/template" + lastdir;
		var smarty_local = O_setting.KCS_DIR + "/smarty_compile" + lastdir;
		var smarty_cache = smarty_local + "/cache";
		var smarty_compile = smarty_local + "/compile";
		smarty_compile = str_replace("//", "/Shop/", smarty_compile);
		var O_smarty = new Smarty();
		O_smarty.template_dir = smarty_dir;
		O_smarty.cache_dir = smarty_cache;
		O_smarty.compile_dir = smarty_compile;
		return O_smarty;
	}

	setAssign(key, value) {
		this.H_assign[key] = value;
	}

	assignSmarty() {
		{
			let _tmp_0 = this.H_assign;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				this.O_Smarty.assign(key, value);
			}
		}
	}

	displaySmarty() //!!!!!!!! テンプレート名を直値指定してます !!!!!!!!
	{
		this.assignSmarty();
		this.O_Smarty.display("Shop/index_shop.tpl");
	}

	__destruct() {
		super.__destruct();
	}

};