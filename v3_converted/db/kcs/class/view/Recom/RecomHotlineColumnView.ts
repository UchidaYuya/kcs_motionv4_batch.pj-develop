//
//シミュレーション表示カラム変更のＶｉｅｗ（HotLine用）
//
//更新履歴：<br>
//2008/10/15 中西達夫 作成
//
//@uses RecomColumnView
//@package Recom
//@subpackage View
//@author nakanita
//@since 2008/10/15
//
//
//error_reporting(E_ALL);
//
//シミュレーション表示カラム変更のＶｉｅｗ（HotLine用）
//
//@uses RecomColumnView
//@package Recom
//@subpackage View
//@author nakanita
//@since 2008/10/15
//

require("MtSetting.php");

require("MtOutput.php");

require("view/Recom/RecomColumnView.php");

require("view/Recom/RecomHotlineUtil.php");

//const PUB = "/Shop/Hotline/Recom3/";
//特別に/Recomに合わせる
//
//コンストラクター
//
//@author nakanita
//@since 2008/10/15
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//Hotline側の操作に必要なグローバルセッションを返す<br/>
//
//Shopでログインしつつ、ユーザー側と共通プログラムを扱うための処理<br/>
//ここでグローバルセッションを上書きしている、成り代わりに近い<br/>
//
//@author nakanita
//@since 2008/10/15
//
//@access public
//@return void
//
//
//結果のページにリダイレクトする
//
//@author nakanita
//@since 2008/10/15
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/10/15
//
//@access public
//@return void
//
class RecomHotlineColumnView extends RecomColumnView {
	static PUB = "/Recom3";

	constructor(H_param: {} | any[] = Array()) //ショップ属性を付ける
	{
		H_param.site = ViewBaseHtml.SITE_SHOP;
		super(H_param);
	}

	getGlobalSession() //グローバルセッションに、ユーザー側操作に必要な pactid,postidを付加して返す
	//ショップ側からユーザー側のgetGlobalSessionを呼んではいけない。
	{
		var O_util = new RecomHotlineUtil();
		return O_util.getGlobalSession();
	}

	gotoResult() //ショップ側の場合の飛び先
	{
		this.O_Sess.clearSessionSelf();
		MtExceptReload.raise("RecomHotlineResult.php");
	}

	__destruct() {
		super.__destruct();
	}

};