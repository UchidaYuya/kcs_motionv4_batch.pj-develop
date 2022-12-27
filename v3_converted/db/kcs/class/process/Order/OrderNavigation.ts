//
//オーダー用呼び出しProcess選択クラス
//
//更新履歴:<br>
//2008/04/11 igarashi
//
//@package Base
//@subpackage Order
//@author igarashi
//@filesource
//@since 2008/04/11
//@uses Order
//
//

require("MtOutput.php");

require("MtSetting.php");

require("MtSession.php");

require("OrderUtil.php");

require("OrderMenuProc.php");

require("OrderInputProc.php");

require("OrderInputTelProc.php");

require("OrderInputMNPProc.php");

require("OrderInputPostProc.php");

require("OrderFormProc.php");

require("OrderDetailFormProc.php");

require("ShopOrderMenuProc.php");

require("ShopOrderDetailProc.php");

require("ShopOrderMenuDocomoProc.php");

//
//注文メニューオブジェクト取得
//
//@author miyazawa
//@since 2008/05/13
//
//@return object
//
//
//必須情報入力オブジェクト取得
//
//@author miyazawa
//@since 2008/05/15
//
//@return object
//
//
//電話情報入力オブジェクト取得
//
//@author miyazawa
//@since 2008/05/13
//
//@return object
//
//
//MNP情報入力オブジェクト取得
//
//@author miyazawa
//@since 2008/05/13
//
//@return object
//
//
//登録部署入力オブジェクト取得
//
//@author miyazawa
//@since 2008/05/13
//
//@return object
//
//
//必須情報入力不要時のオブジェクト取得
//
//@author miyazawa
//@since 2008/05/13
//
//@return object
//
//
//注文フォームオブジェクト取得
//
//@author miyazawa
//@since 2008/05/13
//
//@return object
//
//
//注文フォーム完了画面オブジェクト取得
//
//@author miyazawa
//@since 2008/05/13
//
//@return object
//
//
//注文フォーム雛型オブジェクト取得
//
//@author miyazawa
//@since 2008/05/13
//
//@return object
//
//
//注文詳細オブジェクト取得
//
//@author miyazawa
//@since 2008/08/04
//
//@return object
//
//
//受注一覧プロセス作成
//
//@author igarashi
//@since 2008/06/23
//
//@return object
//
//
//受注一覧プロセス作成
//
//@author igarashi
//@since 2008/06/23
//
//@return object
//
//
//受注詳細プロセス作成
//
//@author igarashi
//@since 2008/07/03
//
//@return object
//
//
//NavigatorのCGIパラメータをチェックし、<br>
//配列をセッションに入れる<br>
//
//
//@author igarashi
//@since 2008/05/26
//
//@access public
//@return void
//
//
//SESSIONからローカルに落とした情報があるか確認<br>
//個別に行うものをまとめただけ
//
//
//@author igarashi
//@since 2008/05/26
//
//@access public
//@return boolean
//
//
//SESSIONからローカルに落とした発注種別があるか確認<br>
//
//
//
//@author igarashi
//@since 2008/05/26
//
//@access public
//@return boolean
//
//
//SESSIONからローカルに落としたキャリアがあるか確認<br>
//
//
//@author igarashi
//@since 2008/05/26
//
//@access public
//@return boolean
//
//
//SESSIONからローカルに落とした回線種別があるか確認<br>
//
//
//@author igarashi
//@since 2008/05/26
//
//@access public
//@return boolean
//
class OrderNavigation {
	static PUB = "/MTOrder";

	constructor() {
		this.O_Out = MtOutput.singleton();
		this.O_set = MtSetting.singleton();
		this.O_Sess = MtSession.singleton();
		this.checkCGIParam();
		this.H_OrdSess = this.O_Sess.getPub(OrderNavigation.PUB);
		this.H_NaviSess = this.O_Sess.getSelfAll();
	}

	selectMenuProc() {
		var O_obj = new OrderMenuProc();
		return O_obj;
	}

	selectInputProc() //ナヴィゲーターでプロセスオブジェクトの生成
	{
		this.checkTypeParam();

		if (true == (-1 !== ["N"].indexOf(this.H_NaviSess.type))) {
			var O_obj = this.selectInputPostProc();
		} else if (true == (-1 !== ["Nmnp"].indexOf(this.H_NaviSess.type))) {
			O_obj = this.selectInputMNPProc();
		} else if (true == (-1 !== ["C", "S", "P", "D", "Dsimple"].indexOf(this.H_NaviSess.type))) {
			O_obj = this.selectInputTelProc();
		} else {
			O_obj = this.selectOrderInputProc();
		}

		return O_obj;
	}

	selectInputTelProc() {
		var O_obj = new OrderInputTelProc();
		return O_obj;
	}

	selectInputMNPProc() {
		var O_obj = new OrderInputMNPProc();
		return O_obj;
	}

	selectInputPostProc() {
		var O_obj = new OrderInputPostProc();
		return O_obj;
	}

	selectOrderInputProc() {
		var O_obj = new OrderInputProc();
		return O_obj;
	}

	selectOrderFormProc() {
		var O_obj = new OrderFormProc();
		return O_obj;
	}

	selectOrderFinishProc() {
		this.checkCarrierParam();

		switch (this.H_NaviSess.carid) {
			case O_set.car_emobile:
				var O_obj = new OrderFinishEmobDissProc();
				break;

			default:
				O_obj = new OrderFinishProc();
				break;
		}

		return O_obj;
	}

	selectTemplateFormProc() {
		return O_obj;
	}

	selectOrderDetailFormProc() {
		var O_obj = new OrderDetailFormProc();
		return O_obj;
	}

	selectShopOrderMenu() {
		return new ShopOrderMenuProc();
	}

	selectShopOrderMenuDocomo() {
		return new ShopOrderMenuDocomoProc();
	}

	selectShopOrderDetail() {
		return new ShopOrderDetailProc();
	}

	checkCGIParam() //GETパラメータがあれば取得
	//self::pubをSESSIONに入れると上書きされてしまうのでNaviではsetしない
	//$this->O_Sess->setPub( self::PUB, $this->H_Dir );
	{
		this.setDefaultSession();

		if (true == (undefined !== _GET.type)) {
			this.H_Local.type = _GET.type;
		}

		if (true == (undefined !== _GET.carid)) {
			this.H_Local.carid = _GET.carid;
		}

		if (true == (undefined !== _GET.cirid)) {
			this.H_Local.cirid = _GET.cirid;
		}

		this.checkCGIParamPeculiar();
		this.O_Sess.setSelfAll(this.H_Local);
	}

	checkAllParam() {
		this.checkTypeParam();
		this.checkCarrierParam();
		this.checkCircuitParam();
		return true;
	}

	checkTypeParam() //SESSIONがなければエラー出力して終了
	{
		if (false != (undefined !== this.H_NaviSess.type) || undefined != this.H_Navisess.type) {
			return true;
		}

		if (false != (undefined !== this.H_OrdSess.type) || undefined != this.H_OrdSess.type) {
			this.H_NaviSess.type = this.H_OrdSess.type;
			return true;
		}

		return false;
	}

	checkCarrierParam() //SESSIONがなければエラー出力して終了
	{
		if (false != (undefined !== this.H_NaviSess.carid) || undefined != this.H_Navisess.carid) {
			return true;
		}

		if (false != (undefined !== this.H_OrdSess.carid) || undefined != this.H_OrdSess.carid) {
			this.H_NaviSess.carid = this.H_OrdSess.carid;
			return true;
		}

		return false;
	}

	checkCircuitParam() //SESSIONがなければエラー出力して終了
	{
		if (false != (undefined !== this.H_NaviSess.cirid) || undefined != this.H_Navisess.cirid) {
			return true;
		}

		if (false != (undefined !== this.H_OrdSess.cirid) || undefined != this.H_OrdSess.cirid) {
			this.H_NaviSess.cirid = this.H_OrdSess.cirid;
			return true;
		}

		return false;
	}

	setDefaultSession() {
		this.setDefaultSessionPeculiar();
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

};