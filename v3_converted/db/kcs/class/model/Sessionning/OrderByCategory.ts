//
//用途区分切り替えよう　セッション管理
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
//用途区分切り替えよう　セッション管理
//
//@uses ValidateAuthorityInterface
//@package kcsmotion
//@author web
//@since 2013/09/25
//

require("model/Sessionning/Interface.php");

class SessionningOrderByCategory {
  static NAME = "OrderByCategory";

  constructor(session: MtSession, pattern) {
    this.session = session;
    this.pattern = pattern;
  }

  set() {
    this.session.setGlobal(SessionningOrderByCategory.NAME, this.pattern);
  }

  get() {
    return this.session.getPub(SessionningOrderByCategory.NAME);
  }

};