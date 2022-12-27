//
//用途区分切り替えページ用　リダイレクト制御
//
//更新履歴：<br>
//2013/09/25 石崎公久 作成
//
//@package kcsmotion
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2013/09/25
//@filesource
//@uses ProcessBaseHtml
//
//
//error_reporting(E_ALL|E_STRICT);
//
//用途区分切り替えページ用　リダイレクト制御
//
//@uses ValidateAuthorityInterface
//@package kcsmotion
//@author web
//@since 2013/09/25
//

require("model/Redirecter/Interface.php");

class RedirecterOrderByCategory {
  fire() {
    header("Location: /Menu/menu.php");
    throw die();
  }

};