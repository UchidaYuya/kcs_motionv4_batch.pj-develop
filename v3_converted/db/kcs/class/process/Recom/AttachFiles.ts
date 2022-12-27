//
//注文ファイルアップロード
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
//注文ファイルアップロード
//
//@uses AttachFilesBase
//@package Order
//@author ishizaki
//@since 2010/11/24
//

require("process/Order/AttachFilesBase.php");

require("view/Recom/AttachFilesView.php");

require("view/Recom/AttachFilesActView.php");

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
class AttachFiles extends AttachFilesBase {
	static ORDER_KEY = "/MTOrder";
	static RECOM_KEY = "/Recom3/RecomResult.php";
	static SHOP_RECOM_KEY = "/Shop/MTHotline/Recom3/RecomHotlineResult.php";
	static SHOP = "\\/Shop\\/MTHotline\\/Recom3\\/";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		if (preg_match("/" + AttachFiles.SHOP + "/", _SERVER.PHP_SELF)) {
			if (!this._view instanceof AttachFilesActView) {
				this._view = new AttachFilesActView({
					site: OrderModelBase.SITE_SHOP
				});

				this._view.setSiteMode(OrderModelBase.SITE_SHOP);
			}

			var session = this._view.gSess().getPub(AttachFiles.SHOP_RECOM_KEY);
		} else {
			if (!this._view instanceof AttachFilesView) {
				this._view = new AttachFilesView();
			}

			session = this._view.gSess().getPub(AttachFiles.RECOM_KEY);
		}

		if (is_null(session)) {
			this._view.displayError();
		}

		return this._view;
	}

	get_Model() {}

	doExecute(H_param: {} | any[] = Array()) {
		var orderSession = this.get_View().startCheck().gSess().getPub(AttachFiles.ORDER_KEY);
		this.get_View().setModel(this.get_Model());
		this.get_View().displayHTML();
	}

};