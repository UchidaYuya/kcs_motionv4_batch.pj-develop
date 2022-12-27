//error_reporting(E_ALL|E_STRICT);
//
//シミュレーションＣＳＶダウンロード（Hotline用）
//
//更新履歴：<br>
//2008/10/15 中西達夫 作成
//
//@uses RecomDownloadProc
//@package Recom
//@author nakanita
//@since 2008/10/15
//
//
//require_once("model/Recom/RecomModel.php");
//
//シミュレーションＣＳＶダウンロード（Hotline用）
//
//@uses ProcessBaseHtml
//@package Recom
//@author nakanita
//@since 2008/10/15
//

require("process/Recom/RecomDownloadProc.php");

require("view/Recom/RecomHotlineDownloadView.php");

//
//コンストラクター
//
//@author nakanita
//@since 2008/10/15
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
class RecomHotlineDownloadProc extends RecomDownloadProc {
	constructor(H_param: {} | any[] = Array()) //ショップ属性を付ける
	{
		H_param.site = ViewBaseHtml.SITE_SHOP;
		super(H_param);
	}

	getRecomView() {
		return new RecomHotlineDownloadView();
	}

};