//error_reporting(E_ALL|E_STRICT);
//
//シミュレーション結果表示のプロセス実装（Hotline用）
//
//更新履歴：<br>
//2008/07/17 中西達夫 作成
//
//@uses RecomResultProc
//@package Recom
//@author nakanita
//@since 2008/09/17
//
//
//require_once("view/MakePankuzuLink.php");	// ぱんくずリンクを作る
//makePankuzuLinkHTML( $H_link, $type = "user", $menulink = true )
//require_once("view/MakePageLink.php");	// ページリンクを作る
//
//シミュレーション結果表示のプロセス実装
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/09/17
//

require("process/Recom/RecomResultProc.php");

require("view/Recom/RecomHotlineResultView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/09/17
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
class RecomHotlineResultProc extends RecomResultProc {
	constructor(H_param: {} | any[] = Array()) //ショップ属性を付ける
	{
		H_param.site = ViewBaseHtml.SITE_SHOP;
		super(H_param);
	}

	getRecomView() {
		return new RecomHotlineResultView();
	}

};