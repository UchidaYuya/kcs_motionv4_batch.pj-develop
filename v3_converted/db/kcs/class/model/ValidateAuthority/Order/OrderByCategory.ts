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

//
//fire
//
//@author web
//@since 2013/09/27
//
//@param mixed $targets
//@access public
//@return void
//
class ValidateAuthorityOrderOrderByCategory {
	constructor() {
		this.targets = ["fnc_tel_division", "fnc_fjp_co"];
	}

	fire(targets) //販売店対応
	{
		for (var target of Object.values(this.targets)) {
			if (!(-1 !== targets.indexOf(target))) //FJP権限・用途区分権限のどちらか一方がない場合は普通の注文
				{
					return false;
				}
		}

		var session = MtSession.singleton();
		var mtactorder = session.getPub("/MTActorder");

		if (!is_null(mtactorder)) {
			session.OrderByCategory = mtactorder.division;
		}

		return session.OrderByCategory;
	}

};