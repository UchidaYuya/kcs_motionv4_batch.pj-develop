//
//部署ツリー・検索用AjaxのView
//
//更新履歴：<br>
//2009/05/07 宝子山浩平 作成
//
//@package XML
//@subpackage View
//@author houshiyama
//@since 2009/05/07
//@filesource
//@uses ManagementAjaxViewBase
//
//
//error_reporting(E_ALL);
//
//電話管理用AjaxのView
//
//@package XML
//@subpackage View
//@author houshiyama
//@since 2009/05/07
//@uses ManagementAjaxViewBase
//

require("view/ViewSmarty.php");

//
//コンストラクタ <br>
//
//ローカル変数格納用配列宣言<br>
//
//@author houshiyama
//@since 2009/05/07
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//電話一覧AJAX固有のcheckCGIParam
//
//@author houshiyama
//@since 2009/05/07
//
//@access protected
//@return void
//
//
//ローカルセッションを返す
//
//@author houshiyama
//@since 2009/05/07
//
//@access public
//@return void
//
//
//出力
//
//@author houshiyama
//@since 2009/05/07
//
//@param array $postname
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2009/05/07
//
//@access public
//@return void
//
class GetPostnameAjaxView extends ViewSmarty {
	constructor() {
		super();
	}

	checkCGIParam() {
		if (undefined !== _POST.postid == true) {
			this.H_Local.post.postid = _POST.postid;
		}

		if (undefined !== _POST.postidchild == true) {
			this.H_Local.post.postidchild = _POST.postidchild;
		}

		if (undefined !== _POST.tableno == true) {
			this.H_Local.post.tableno = _POST.tableno;
		}
	}

	getLocalSession() {
		return this.H_Local;
	}

	displayAjax(postname) {
		echo(postname);
	}

	__destruct() {
		super.__destruct();
	}

};