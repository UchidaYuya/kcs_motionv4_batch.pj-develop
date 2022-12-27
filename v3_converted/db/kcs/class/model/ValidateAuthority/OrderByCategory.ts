//
//用途切り替え　権限チェック
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
//用途切り替え　権限チェック
//
//@uses ValidateAuthorityInterface
//@package kcsmotion
//@author web
//@since 2013/09/25
//

require("model/ValidateAuthority/Interface.php");

class ValidateAuthorityOrderByCategory {
  constructor() {
    this.targets = ["fnc_tel_division", "fnc_fjp_co"];
  }

  fire(targets) {
    for (var target of Object.values(this.targets)) {
      if (!(-1 !== targets.indexOf(target))) {
        return false;
      }
    }

    return true;
  }

};