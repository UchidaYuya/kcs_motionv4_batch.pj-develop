//error_reporting(E_ALL|E_STRICT);
//
//シミュレーション電話１件のプラン変更（Hotline用）
//
//更新履歴：<br>
//2008/09/16 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/09/16
//
//
//
//シミュレーション電話１件のプラン変更（Hotline用）
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/08/20
//

require("process/Recom/RecomOrderProc.php");

require("view/Recom/RecomHotlineOrderView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/08/20
//
//@param array $H_param
//@access public
//@return void
//
//
//ここで必要となるViewを返す<br/>
//Hotline側と切り替えるための仕組み<br/>
//
//@author nakanita
//@since 2008/09/18
//
//@access protected
//@return void
//
class RecomHotlineOrderProc extends RecomOrderProc {
	constructor(H_param: {} | any[] = Array()) //ショップ属性を付ける
	{
		H_param.site = ViewBaseHtml.SITE_SHOP;
		super(H_param);
	}

	getRecomView() {
		return new RecomHotlineOrderView();
	}

};