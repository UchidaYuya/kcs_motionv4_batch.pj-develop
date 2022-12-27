//
//シミュレーションメニューのＶｉｅｗ（HotLine用）
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
//require_once("view/ViewSmarty.php");
//require_once("view/ViewFinish.php");
//require_once("view/QuickFormUtil.php");
//require_once("HTML/QuickForm/Renderer/ArraySmarty.php");
//
//シミュレーションメニューのＶｉｅｗ（HotLine用）
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/09/16
//

require("MtSetting.php");

require("MtOutput.php");

require("view/Recom/RecomMenuView.php");

require("view/Recom/RecomHotlineUtil.php");

//
//ディレクトリ名
//
//const PUB = "/Shop/Hotline/Recom3/";
//特別に/Recomに合わせる
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
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
//@since 2008/09/17
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class RecomHotlineMenuView extends RecomMenuView {
	static PUB = "/Recom3";

	constructor(H_param: {} | any[] = Array()) //ショップ属性を付ける
	{
		H_param.site = ViewBaseHtml.SITE_SHOP;
		super(H_param);
	}

	checkCGIParam() {
		var sess_flg = false;

		if (_GET.pactid != "") //pactidを特別にグローバルセッションに入れる
			//$_SESSION["pactid"] = (int)$_GET["pactid"];
			//このタイミング=メニューから飛んできた時点で "current_postid" をクリアーする。
			//前に一度部署ツリーで選択した現行部署を消す、かなりアクロバティックな処理。
			{
				this.O_Sess.setGlobal("pactid", +_GET.pactid);
				delete _SESSION.current_postid;
				sess_flg = true;
			}

		if (_GET.carid != "") //パブリックセッションに入れる
			//$_SESSION[self::PUB]["carid"] = (int)$_GET["carid"];
			{
				this.H_Dir.carid = +_GET.carid;
				sess_flg = true;
			}

		if (_GET.type != "") //M or H
			//パブリックセッションに入れる
			//$_SESSION[self::PUB]["type"] = $_GET["type"];
			{
				this.H_Dir.type = _GET.type;
				sess_flg = true;
			}

		if (sess_flg == true) //$this->O_Sess->setSelfAll( $this->H_Local );
			{
				this.O_Sess.setPub(RecomHotlineMenuView.PUB, this.H_Dir);
				MtExceptReload.raise(undefined);
			}

		if (_GET.pid != "") {
			_SESSION.current_postid = _GET.pid;
			header("Location: " + _SERVER.PHP_SELF);
			throw die(0);
		}

		super.checkCGIParam();
	}

	getGlobalSession() //グローバルセッションに、ユーザー側操作に必要な pactid,postidを付加して返す
	//ショップ側からユーザー側のgetGlobalSessionを呼んではいけない。
	{
		var O_util = new RecomHotlineUtil();
		return O_util.getGlobalSession();
	}

	__destruct() {
		super.__destruct();
	}

};