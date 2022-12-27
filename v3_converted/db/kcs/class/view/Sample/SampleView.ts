//
//Ｖｉｅｗ実装のサンプル
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/02/08
//
//
//error_reporting(E_ALL);
//
//Ｖｉｅｗ実装のサンプル
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/02/08
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//ログインのチェックを行う
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//CGIパラメータのチェックを行う
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//シンプルな画面表示
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_data
//@access public
//@return void
//
//
//Smartyを用いた画面表示
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_data
//@access public
//@return void
//
class SampleView extends ViewSmarty {
	constructor() {
		super();
	}

	checkLogin() //ログインチェックを行わないときには、何もしないメソッドで親を上書きする
	{}

	checkCGIParam() //ここでは何もしていない
	{}

	display(H_data: {} | any[]) {
		print("<H3>Data List</H3>\n");

		for (var A_data of Object.values(H_data)) {
			print(A_data.pactid + " :: " + A_data.compname + "<br>\n");
		}
	}

	displaySmarty(H_data: {} | any[]) {
		this.get_Smarty().assign("H_data", H_data);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

};