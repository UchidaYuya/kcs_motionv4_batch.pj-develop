//error_reporting(E_ALL|E_STRICT);
//
//シミュレーションメニューのプロセス実装
//
//更新履歴：<br>
//2008/07/17 中西達夫 作成
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/07/17
//
//
//
//シミュレーションメニューのプロセス実装（Hotline用）
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/07/17
//

require("process/Recom/RecomMenuProc.php");

require("model/Recom/RecomModel.php");

require("view/Recom/RecomHotlineMenuView.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("PostLinkGet.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/07/17
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
//@since 2008/09/17
//
//@access protected
//@return void
//
class RecomHotlineMenuProc extends RecomMenuProc {
	constructor(H_param: {} | any[] = Array()) //ショップ属性を付ける
	{
		H_param.site = ViewBaseHtml.SITE_SHOP;
		super(H_param);
	}

	getRecomView() {
		return new RecomHotlineMenuView();
	}

};