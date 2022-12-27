//
//注文ファイルアップロードされたファイルの削除
//
//更新履歴：<br>
//
//@uses AttachFilesBase
//@package Order
//@subpackage Process
//@author ishizaki
//@since 2010/11/24
//
//
//error_reporting(E_ALL|E_STRICT);
//
//注文ファイルアップロードされたファイルの削除
//
//@uses AttachFilesBase
//@package Order
//@author ishizaki
//@since 2010/11/24
//

require("process/ProcessBaseHtml.php");

require("view/Order/AttachFileDownloadView.php");

require("model/Order/OrderModelBase.php");

//
//_view
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author miyazawa
//@since 2008/04/01
//
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_g_sess
//@param mixed $O_manage
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン<br>
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@access protected
//@return void
//@uses
//@uses
//
class AttachFileDownload extends ProcessBaseHtml {
	static SHOP = "\\/Shop\\/MTOrder\\/";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		if (!this._view instanceof AttachFileDownloadView) {
			this._view = new AttachFileDownloadView();
		}

		return this._view;
	}

	get_Model(H_g_sess: {} | any[], O_manage) {}

	doExecute(H_param: {} | any[] = Array()) {
		if (preg_match("/" + AttachFileDownload.SHOP + "/", _SERVER.PHP_SELF)) {
			this.get_View().setSiteMode(OrderModelBase.SITE_SHOP);
		}

		this.get_View().startCheck();
		this.get_View().displayHTML();
	}

};