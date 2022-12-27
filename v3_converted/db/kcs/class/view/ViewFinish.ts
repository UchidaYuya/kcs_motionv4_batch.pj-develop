//
//完了画面表示を行うＶＩＥＷ
//
//更新履歴：<br>
//2008/03/14 宝子山浩平 作成
//
//@uses ViewSmarty
//@package Base
//@subpackage View
//@filesource
//@author nakanita
//@since 2008/03/14
//
//
//
//完了画面表示を行うＶＩＥＷ
//
//@uses ViewSmarty
//@package Base
//@author houshiyama
//@since 2008/03/14
//@uses ViewSmarty
//

require("Log.php");

require("view/ViewSmarty.php");

//
//ショップＩＤ、ショップ側かどうかの判断に用いている
//
//@var integer
//@access private
//
//
//設定一覧
//
//@var mixed
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param integer $traceflg0 トレースを行うかどうかのフラグ
//@param integer $shopid default="" ショップＩＤ
//@access public
//@return void
//
//
//完了画面表示
//
//@author houshiyama
//@since 2008/03/14
//
//@param string $message エラーメッセージ
//@param string $goto 戻り先指定 "GOTOP" の場合はトップに戻る
//@param string $buttonstr 戻りボタンの表記
//@param string $outtxtafter 完了メッセージの後に出すメッセージ
//@access public
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class ViewFinish extends ViewSmarty {
	constructor(shopid = "") //commonテンプレートを使用
	{
		this.O_Conf = MtSetting.singleton();
		this.ShopID = shopid;
		var H_param = {
			common: true,
			skip: true
		};
		super(H_param);
	}

	displayFinish(message, goto = "", buttonstr = "\u623B \u308B", outtxtafter = "", language = "JPN") {
		var site = "user";

		if (true == preg_match("/^\\/Admin/", _SERVER.PHP_SELF)) {
			this.get_Smarty().assign("finish_site", "admin");
		} else if (true == preg_match("/^\\/Shop/", _SERVER.PHP_SELF)) {
			this.get_Smarty().assign("finish_site", "shop");
		}

		if (goto != "") {
			if (goto == "GOTOP") //ショップから来た場合はショップのトップに戻る
				{
					if (this.ShopID != "" || preg_match("/^\\/Shop/", _SERVER.PHP_SELF)) //ショップから来た場合はショップのメニューに戻る.
						{
							var backurl = "/Shop/menu.php";
						} else //通常メニューに戻る.
						{
							backurl = "/Menu/menu.php";
						}
				} else {
				backurl = goto;
			}
		} else {
			if (this.ShopID != "" || preg_match("/^\\/Shop/", _SERVER.PHP_SELF)) //ショップから来た場合はショップのトップに戻る.
				{
					backurl = "/index_shop.php";
				} else //通常の場合は通常トップに戻る.
				{
					backurl = "/";
				}
		}

		this.get_Smarty().assign("BackUrl", backurl);
		this.get_Smarty().assign("OutTxt", message);
		this.get_Smarty().assign("BackBtn", buttonstr);
		this.get_Smarty().assign("OutTxtAfter", outtxtafter);

		if (language == "ENG") {
			this.get_Smarty().display(KCS_DIR + "/template/eng/common/finish.tpl");
		} else {
			this.get_Smarty().display("finish.tpl");
		}
	}

	__destruct() {
		super.__destruct();
	}

};