//
//価格表テンプレートダウンロードプロセス
//
//更新履歴：
//2009/09/08 北村俊士 作成
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/08
//@filesource
//@uses ProcessBaseHtml
//@uses AdminPriceTemplateDownloadView
//
//
//価格表テンプレートダウンロードプロセス
//
//更新履歴：
//2009/09/08 北村俊士 作成
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/08
//@uses ProcessBaseHtml
//@uses AdminPriceTemplateDownloadView
//

require("process/ProcessBaseHtml.php");

require("view/Admin/Price/AdminPriceTemplateDownloadView.php");

//
//O_view
//
//@var AdminPriceTemplateDownloadView
//@access protected
//
//
//Viewの取得
//
//@author kitamura
//@since 2009/09/10
//
//@access public
//@return AdminPriceTemplateDownloadView
//
//
//メイン処理
//
//@author kitamura
//@since 2009/09/08
//
//@access protected
//@return void
//
class AdminPriceTemplateDownloadProc extends ProcessBaseHtml {
	getView() {
		if (false == (undefined !== this.O_view)) {
			this.O_view = new AdminPriceTemplateDownloadView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	{
		var O_view = this.getView();
		O_view.startCheck();
		O_view.display();
	}

};