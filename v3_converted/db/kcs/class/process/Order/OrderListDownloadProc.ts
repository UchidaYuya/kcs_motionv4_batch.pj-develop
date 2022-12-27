//
//注文履歴一覧ダウンロードProccess
//
//更新履歴：<br>
//2008/11/13 宮澤龍彦 作成
//
//@package Order
//@subpackage Proccess
//@author miyazawa
//@since 2008/11/13
//@filesource
//@uses OrderListMenuProcBase
//@uses OrderListMenuView
//@uses OrderListMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//注文履歴一覧トップページProccess
//
//@package Order
//@subpackage Proccess
//@author miyazawa
//@since 2008/11/13
//@uses OrderListMenuProc
//

require("process/Order/OrderListMenuProc.php");

require("model/Order/OrderListDownloadModel.php");

require("view/Order/OrderListDownloadView.php");

require("model/Order/OrderTelInfoModel.php");

require("model/Order/fjpModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/20
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author miyazawa
//@since 2008/11/13
//
//@access protected
//@return void
//@uses RecogMenuView
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2008/11/13
//
//@param array $H_g_sess
//@access protected
//@return void
//@uses OrderListDownloadModel
//
//
//電話情報Modelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//@author miyazawa
//@since 2008/11/13
//
//@param array $H_param
//@access protected
//@return void
//@uses ManagementUtil
//
//
//_getFjpModel
//
//@author igarashi
//@since 2011/06/30
//
//@param mixed $A_auth
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class OrderListDownloadProc extends OrderListMenuProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new OrderListDownloadView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new OrderListDownloadModel(O_db0, H_g_sess);
	}

	get_OrderTelInfoModel(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new OrderTelInfoModel(O_db0, H_g_sess, site_flg);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//csrf対策。
	//use_tstampがfalseの場合はfileidのチェック(csrf対策)を行わない
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//セッション情報取得（ローカル）
	//表示に必要なものを格納する配列を取得
	//配下の部署ID取得
	//データ作成準備
	//一覧画面からorderidのリストを引き継いでいるのでwhere句もorderby句も要らない
	//出力してexit
	{
		var O_view = this.get_View();

		if (undefined !== H_param.use_tstamp && "boolean" === typeof H_param.use_tstamp) {
			O_view.setUseTimeStamp(H_param.use_tstamp);
		}

		O_view.clearUnderSession();
		var H_g_sess = O_view.getGlobalSession();
		var O_order = OrderUtil.singleton();
		var O_model = this.get_Model(H_g_sess);
		var O_telinfo_model = this.get_OrderTelInfoModel(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();
		var H_sess = O_view.getLocalSession();
		var H_view = O_view.get_View();
		var A_post = O_model.getPostidList(H_g_sess.postid, 1);

		var O_fjp = this._getfjpModel(A_auth);

		O_view.setfjpModelObject(O_fjp);
		O_model.setfjpModelObject(O_fjp);
		var H_order = Array();
		var H_sub = Array();
		var H_detail = Array();

		if (true == 0 < H_sess[OrderListDownloadProc.PUB].A_orderid.length) //電話詳細情報のカラム取得
			//mt_order_tbからデータ取得
			//S179枝番0以外のブランクの値に設定する 20141209date
			//整形
			//$H_adjusted = $O_view->adjustOrderData($H_result, $O_model, $H_property);
			//ポイント表示が必要ない場合は表示されないようにする 20141106date
			//並べ替え
			//$H_sorted = $O_view->sortOrderData($H_adjusted, $A_fixed_orderid);
			//$H_sorted = $O_view->sortOrderData($H_point_replaced, $A_fixed_orderid);		//	ポイントの有無 20141106date
			//ポイントの有無 20141106date
			{
				var A_orderid = H_sess[OrderListDownloadProc.PUB].A_orderid;
				var H_property = O_telinfo_model.getTelProperty(H_g_sess.pactid);

				if ("ENG" == H_g_sess.language) //英語化権限 20090330miya
					{
						H_order = O_model.getOrderTBEng(A_orderid, H_sess.SELF.carid, H_g_sess.pactid);
					} else {
					H_order = O_model.getOrderTB(A_orderid, H_sess.SELF.carid, H_g_sess.pactid);
				}

				if (true == 0 < H_order.length) //ソートを画面と同じするため整列したorderidの配列を準備
					//mt_order_sub_tbからデータ取得
					//mt_order_detail_tbからデータ取得
					{
						for (var val of Object.values(H_order)) //getOrderTBにcaridを渡しているので、このキャリアのorderidが絞り込まれている
						{
							A_this_car_orderid.push(val.orderid);
						}

						var A_fixed_orderid = Array();

						for (var ky in A_orderid) {
							var oid = A_orderid[ky];

							if (true == (-1 !== A_this_car_orderid.indexOf(oid))) {
								A_fixed_orderid.push(oid);
							}
						}

						if ("ENG" == H_g_sess.language) //英語化権限 20090330miya
							{
								H_sub = O_model.getOrderSubTBEng(A_fixed_orderid);
							} else {
							H_sub = O_model.getOrderSubTB(A_fixed_orderid);
						}

						if ("ENG" == H_g_sess.language) //英語化権限 20090330miya
							{
								H_detail = O_model.getOrderTelDetailTBEng(A_fixed_orderid);
							} else {
							H_detail = O_model.getOrderTelDetailTB(A_fixed_orderid);
						}
					}

				H_sub = O_model.mergeOrderSubAndDetail(H_sub, H_detail);
				var H_result = O_model.mergeOrderAndSub(H_order, H_sub);
				H_result = O_model.setValueToBlank(H_result);
				var H_result2 = O_view.adjustTypeAData(H_result);
				var H_adjusted = O_view.adjustOrderData(H_result2, O_model, H_property, A_auth);
				var H_point_replaced = O_model.replacePoint(H_adjusted, H_order);
				var H_sorted = O_view.sortOrderData(H_point_replaced, A_fixed_orderid, H_sess[OrderListDownloadProc.PUB].search.post);
			}

		O_model.insertMngLog(H_g_sess.pactid, H_g_sess.postid, H_g_sess.postname, H_g_sess.userid, H_g_sess.loginname, H_g_sess.loginid, H_g_sess.joker);
		O_view.outOrderList(H_sorted, H_property, A_auth);
		throw die();
	}

	_getFjpModel(A_auth) {
		if (!this.O_fjp instanceof fjpModel) {
			return this.O_fjp = new fjpModel(OrderListDownloadProc.PUB, A_auth);
		}

		return this.O_fjp;
	}

	__destruct() {
		super.__destruct();
	}

};