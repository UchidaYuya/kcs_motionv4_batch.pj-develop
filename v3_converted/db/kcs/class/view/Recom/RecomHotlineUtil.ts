//
//シミュレーションHotline用の共通関数
//
//更新履歴：<br>
//2008/09/16 中西達夫 作成
//
//@uses RecomMenuView
//@package Recom
//@subpackage View
//@author nakanita
//@since 2008/09/16
//
//
//error_reporting(E_ALL);
//
//シミュレーションHotline用の共通関数
//
//@uses ViewSmarty
//@package Recom
//@subpackage View
//@author nakanita
//@since 2008/09/16
//

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("model/PostModel.php");

require("model/PactModel.php");

//
//セッションオブジェクト
//
//@var mixed
//@access private
//
//
//Hotline側の操作に必要なグローバルセッションを返す<br/>
//
//Shopでログインしつつ、ユーザー側と共通プログラムを扱うための処理<br/>
//ここでグローバルセッションを上書きしている、成り代わりに近い<br/>
//
//@author nakanita
//@since 2008/09/17
//
//@access public
//@return void
//
class RecomHotlineUtil {
	constructor() {
		this.O_Sess = MtSession.singleton();
	}

	getGlobalSession() //pactid が無ければ異常
	//現行部署が設定されていなければ付ける。初回は必ずrootが付く。
	//もしあれば、そのまま使う -- 部署ツリーで部署変更が行えるので。
	//}
	{
		if (is_null(_SESSION.pactid) == true || is_numeric(_SESSION.pactid) == false) {
			return;
		}

		var O_post_model = new PostModel();
		var root = O_post_model.getRootPostid(_SESSION.pactid);
		this.O_Sess.setGlobal("postid", root);

		if (is_null(_SESSION.current_postid) || _SESSION.current_postid == "") {
			this.O_Sess.setGlobal("current_postid", root);
		}

		var O_pact_model = new PactModel();
		var compname = O_pact_model.getCompname(_SESSION.pactid);
		this.O_Sess.setGlobal("compname", compname);
		return _SESSION;
	}

};