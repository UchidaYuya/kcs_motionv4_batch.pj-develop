//error_reporting(E_ALL|E_STRICT);
//
//Excelテンプレートのダウンロード
//
//更新履歴：<br>
//2008/11/14 中西達夫 作成
//
//@uses RecomXLTProc
//@package Recom
//@author nakanita
//@since 2008/11/14
//
//
//require_once("view/MakePankuzuLink.php");	// ぱんくずリンクを作る
//makePankuzuLinkHTML( $H_link, $type = "user", $menulink = true )
//require_once("view/MakePageLink.php");	// ページリンクを作る
//
//Excelテンプレートのダウンロード
//
//@uses RecomXLTProc
//@package Recom
//@author nakanita
//@since 2008/11/14
//

require("process/Recom/RecomXLTProc.php");

require("view/Recom/RecomHotlineXLTView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/11/14
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
//@since 2008/10/15
//
//@access protected
//@return void
//
class RecomHotlineXLTProc extends RecomXLTProc {
	constructor(H_param: {} | any[] = Array()) //ショップ属性を付ける
	{
		H_param.site = ViewBaseHtml.SITE_SHOP;
		super(H_param);
	}

	getRecomView() {
		return new RecomHotlineXLTView();
	}

};