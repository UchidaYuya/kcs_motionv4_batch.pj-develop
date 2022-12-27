//
//シミュレーション結果保存画面のＶｉｅｗ
//
//更新履歴：<br>
//2008/10/06 中西達夫 作成
//
//@uses ViewSmarty
//@package Recom
//@subpackage View
//@author nakanita
//@since 2008/10/06
//
//
//error_reporting(E_ALL);
//require_once("view/QuickFormUtil.php");
//require_once("HTML/QuickForm/Renderer/ArraySmarty.php");
//パンくずリンクを作る
//require_once("view/MakePageLink.php");  // ページリンクを作る
//
//シミュレーション結果保存画面のＶｉｅｗ
//
//@uses ViewSmarty
//@package Recom
//@subpackage View
//@author nakanita
//@since 2008/10/06
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("view/MakePankuzuLink.php");

//
//ディレクトリ名
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//フォームオブジェクト
//
//@var mixed
//@access protected
//
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
//自身のセッションを取得する
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return mixed
//
//
//ログインのチェックを行う
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//protected function checkLogin(){
//// ログインチェックを行わないときには、何もしないメソッドで親を上書きする
//}
//
//CGIパラメータのチェックを行う
//
//セッションにCGIパラメーターを付加する<br/>
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//パラメーターのチェックを行う
//
//@author nakanita
//@since 2008/07/23
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//Smartyを用いた画面表示
//
//@author nakanita
//@since 2008/02/08
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
class RecomSaveView extends ViewSmarty {
	static PUB = "/Recom3";

	constructor(H_param: {} | any[] = Array()) {
		this.O_Sess = MtSession.singleton();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(RecomSaveView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getSelfSession() //$H_sess = array( self::PUB => $this->O_Sess->getPub( self::PUB ),
	//"SELF" => $this->O_Sess->getSelfAll() );
	{
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	getView() {
		return this.H_View;
	}

	checkCGIParam() {
		var sess_flg = false;

		if (undefined !== _POST.range == true && _POST.range != "") {
			this.H_Local.post.range = _POST.range;
			sess_flg = true;
		}

		if (undefined !== _POST.period == true && _POST.period != "") {
			this.H_Local.post.period = _POST.period;
			sess_flg = true;
		}

		if (undefined !== _POST.telno == true && _POST.telno != "") {
			this.H_Local.post.telno = _POST.telno;
			sess_flg = true;
		}

		if (undefined !== _POST.carid == true && _POST.carid != "") {
			this.H_Local.post.carid = _POST.carid;
			sess_flg = true;
		}

		if (undefined !== _POST.buysel == true && _POST.buysel != "") {
			this.H_Local.post.buysel = _POST.buysel;
			sess_flg = true;
		} else //チェックボックスが空の場合
			{
				if (undefined !== _GET == false) //GETの場合は消さない
					{
						this.H_Local.post.buysel = "";
					}
			}

		if (undefined !== _POST.pakefree == true && _POST.pakefree.length) {
			this.H_Local.post.pakefree = _POST.pakefree;
			sess_flg = true;
		}

		if (_GET.pid != "") //ここだけはV2の互換性からセッションに直接値をかいている
			{
				_SESSION.current_postid = _GET.pid;
				sess_flg = true;
			}

		if (sess_flg == true) {
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}
	}

	checkParamError(H_sess, H_g_sess) {}

	makePankuzuLink() {
		var H_link = {
			"menu.php": "\u6599\u91D1\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
			"": "\u4FDD\u5B58\u7D50\u679C\u4E00\u89A7"
		};
		var O_link = new MakePankuzuLink();
		var method = "makePankuzuLinkHTML";

		switch (this.getSiteMode()) {
			case ViewBaseHtml.SITE_SHOP:
				var type = "shop";
				break;

			case ViewBaseHtml.SITE_USER:
			default:
				if (this.O_Sess.language === "ENG") {
					H_link = {
						"menu.php": "Plan simulation",
						"": "Save result list"
					};
					method = "makePankuzuLinkHTMLEng";
				}

				type = "user";
				break;
		}

		return O_link[method](H_link, type, true);
	}

	getHeaderJS() // ToDo * まだ使っていない
	{}

	displaySmarty() //表示に必要な項目を設定
	//$this->get_Smarty()->assign( "post_path", $this->H_View["post_path"] );
	//フォームを表示
	//権限を渡す
	//表示
	{
		if (this.getSiteMode() == ViewBaseHtml.SITE_SHOP) //ショップの場合、ショップ名、メンバー名を表示する
			{
				var page_path = "shop_submenu";
				var shop_person = this.O_Sess.name + " " + this.O_Sess.personname;
				this.get_Smarty().assign("shop_person", shop_person);
			} else {
			page_path = "page_path";
		}

		this.get_Smarty().assign(page_path, this.H_View.page_path);
		this.get_Smarty().assign("H_data", this.H_View.H_data);
		this.get_Smarty().assign("fnc_tel_division", this.H_View.fnc_tel_division);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};