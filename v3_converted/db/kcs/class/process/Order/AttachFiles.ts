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

require("view/Order/AttachFilesView.php");

require("view/Order/AttachFilesOrderListView.php");

require("view/Order/AttachFilesRecogView.php");

require("view/Order/AttachFilesActView.php");

require("view/Order/AttachFilesShopView.php");

require("model/Order/OrderLightModel.php");

require("model/Order/OrderModelBase.php");

//
//_view
//
//@var mixed
//@access protected
//
//
//_model
//
//@var mixed
//@access protected
//
//
//_modelUse
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
	static ORDER_MENU_KEY = "/MTOrderList";
	static ORDER_RAPID = "/Shop/MTOrder/rapid";
	static ORDER = "\\/MTOrder\\/";
	static ORDER_LIST = "\\/MTOrderList\\/";
	static RECOG = "\\/MTRecog\\/";
	static ACT = "\\/Shop\\/MTActorder\\/";
	static SHOP = "\\/Shop\\/MTOrder\\/";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		if (preg_match("/" + AttachFiles.ORDER_LIST + "/", _SERVER.PHP_SELF)) {
			if (!this._view instanceof AttachFilesOrderListView) {
				this._view = new AttachFilesOrderListView();
				this._modelUse = true;
			}
		} else if (preg_match("/" + AttachFiles.ACT + "/", _SERVER.PHP_SELF)) {
			if (!this._view instanceof AttachFilesActView) {
				this._view = new AttachFilesActView({
					site: OrderModelBase.SITE_SHOP
				});
				this._modelUse = false;

				this._view.setSiteMode(OrderModelBase.SITE_SHOP);
			}
		} else if (preg_match("/" + AttachFiles.SHOP + "/", _SERVER.PHP_SELF)) {
			if (!this._view instanceof AttachFilesShopView) {
				this._view = new AttachFilesShopView({
					site: OrderModelBase.SITE_SHOP
				});
				this._modelUse = false;

				this._view.setSiteMode(OrderModelBase.SITE_SHOP);
			}
		} else if (preg_match("/" + AttachFiles.ORDER + "/", _SERVER.PHP_SELF)) {
			if (!this._view instanceof AttachFilesView) {
				this._view = new AttachFilesView();
				this._modelUse = false;
			}
		} else if (preg_match("/" + AttachFiles.RECOG + "/", _SERVER.PHP_SELF)) {
			if (!this._view instanceof AttachFilesView) {
				this._view = new AttachFilesRecogView();
				this._modelUse = false;
			}
		}

		var session = this._view.gSess().getPub(AttachFiles.ORDER_KEY);

		if (is_null(session)) //k-47 メニュー画面でとり直す 20110215iga
			{
				session = this._view.gSess().getPub(AttachFiles.ORDER_MENU_KEY);

				if (is_null(session)) {
					session = this._view.gSess().getPub(AttachFiles.ORDER_RAPID);

					if (is_null(session)) {
						this._view.displayError();
					}
				}
			}

		return this._view;
	}

	get_Model() {
		if (!this._model instanceof OrderLightModel) {
			this._model = new OrderLightModel();
		}

		return this._model;
	}

	doExecute(H_param: {} | any[] = Array()) {
		var orderSession = this.get_View().startCheck().gSess().getPub(AttachFiles.ORDER_KEY);

		if (this._modelUse) //$applyuserid = $this->get_Model()->getApplyuserid($orderSession['orderid']);
			{
				var chargerid = this.get_Model().getChargerid(orderSession.orderid);

				if (this.get_View().gSess().userid == chargerid) {
					this.get_View().setAssign("deleteAgree", true);
				}
			}

		if (preg_match("/" + AttachFiles.SHOP + "/", _SERVER.PHP_SELF) || preg_match("/" + AttachFiles.ACT + "/", _SERVER.PHP_SELF)) {
			this.get_View().setAssign("fjpco", 0);
		} else {
			this.get_View().setAssign("fjpco", -1 !== this.get_View().getAllAuth().indexOf("fnc_fjp_co") ? 1 : 0);
		}

		this.get_View().setAssign("orderstatus", this.get_Model().getOrderStatus(orderSession.orderid));
		this.get_View().setModel(this.get_Model());
		this.get_View().displayHTML();
	}

};