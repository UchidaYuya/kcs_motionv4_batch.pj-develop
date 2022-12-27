//
//受注詳細Proc
//
//更新履歴：<br>
//2014/09/17 date 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author date
//@since 2014/0917
//
//
//error_reporting(E_ALL|E_STRICT);
//TCPDFの読み込み
//
//ShopOrderDeliveryPrintProc
//
//@uses ShopOrderDetailProcBase
//@package
//@author web
//@since 2018/12/19
//

require("process/Order/ShopOrderDetailProcBase.php");

require("model/Order/ShopOrderDeliveryPrintModel.php");

require("view/Order/ShopOrderDeliveryPrintView.php");

require("tcpdf/config/lang/eng.php");

require("tcpdf/tcpdf.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/06/30
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//
//@author web
//@since 2018/12/19
//
//@access protected
//@return void
//
//
//get_Model
//
//@author web
//@since 2018/12/19
//
//@param array $H_g_sess
//@param mixed $site_flg
//@access protected
//@return void
//
//
//get_ShopOrderUserInfoModel
//
//@author web
//@since 2018/12/19
//
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//doExecute
//
//@author web
//@since 2018/12/19
//
//@param array $H_param
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2018/12/19
//
//@access public
//@return void
//
class ShopOrderDeliveryPrintProc extends ShopOrderDetailProcBase {
	constructor(H_param: {} | any[] = Array()) //trueで全sqlがrollbackされる。
	//sql実行時にエラーを吐いたsqlがvar_dumpされる
	//$this->debagmode = true;
	{
		super(H_param);
	}

	get_View() {
		return new ShopOrderDeliveryPrintView();
	}

	get_Model(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new ShopOrderDeliveryPrintModel(O_db0, H_g_sess);
	}

	get_ShopOrderUserInfoModel(H_g_sess) {
		return new ShopOrderUserInfoModel(O_db0, H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //view作成
	//CGI取得
	//GlobalSESSION取得
	//LocalSESSION取得
	//model作成
	//["SELF"]以下のSESSIONを消す これやらないと別画面での更新がいつまでも「完了」になる
	//if(true == isset($H_sess["SELF"]["execsub"])){
	//}
	//フォーム作成
	//印刷ボタン表示
	//if ($O_model->checkShopAdminFuncId($H_g_sess["shopid"], self::FNC_PRINT_ALWAYS)) {
	//$O_view->viewPrintButton();
	//}
	//受注詳細画面でチェックを付けられた項目を確認し、assignする
	//$O_view->setDeliveryPrintCheck(&$H_view);
	//注文情報ぽよ
	//必要な情報を取得する
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getLocalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.clearUnderSession([ShopOrderDeliveryPrintProc.PUB, "/MTOrderList", "/Shop/MTOrder/rapid"]);
		O_view.makeShopOrderDetailForm();
		O_view.setFormRule(H_sess.SELF, H_view.order, H_view.property);
		O_view.validate(H_sess.SELF, H_view.errmsg);
		var orderid = H_sess.SELF.orderid;

		var _details = O_model.getOrderDetails(orderid);

		var details = Array();
		var contractor = undefined;

		for (var key in _details) //契約名義
		{
			var value = _details[key];

			if (is_null(contractor)) {
				contractor = value.contractor;
			}

			if (value.substatus == 230) {
				continue;
			}

			if (-1 !== H_sess.SELF.print.indexOf(key)) {
				details.push(value);
			}
		}

		if (_POST.submit == "\u5370\u5237") //契約名義をつけてしまう
			{
				var shop_info = O_model.getOrderInfo(orderid);
				shop_info.contractor = contractor;
				O_view.outputPDF(shop_info, details);
			} else //表示
			{
				O_view.displaySmarty();
			}
	}

	__destruct() {
		super.__destruct();
	}

};