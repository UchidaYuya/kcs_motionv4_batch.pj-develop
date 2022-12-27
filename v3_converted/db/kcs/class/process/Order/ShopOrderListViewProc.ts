//
//販売店受注一覧<br>
//
//更新履歴:<br>
//2008/06/20
//
//@users OrderFormProcBase
//@packages Order
//@subpacckage Process
//@author igarashi
//@since 2008/06/20
//
//
//販売店受注一覧Proc
//
//@uses OrderListMenuProc
//@package Order
//@author igarashi
//@since 2008/08/03
//

require("process/Order/OrderListMenuProc.php");

require("model/Order/ShopOrderListViewModel.php");

require("view/Order/ShopOrderListViewView.php");

require("model/Order/ShopOrderModelBase.php");

require("OrderUtil.php");

require("MtDateUtil.php");

require("model/MiscModel.php");

//
//getMiscType
//その他取得
//@author web
//@since 2018/06/18
//
//@access private
//@return void
//
class ShopOrderListViewProc extends OrderListMenuProc {
	static PUB = "/Shop/MTOrder/rapid";

	consoleout(string) //出力しないようにする・・20180618伊達
	//
	{
		return;

		if (is_null(GLOBALS.start) or is_null(GLOBALS.fp)) {
			return;
		}

		fwrite(GLOBALS.fp, string + ":" + (Date.now() / 1000 - GLOBALS.start) + "\n");
	}

	constructor() {
		this.consoleout("start construct");
		super();
		this.O_order = OrderUtil.singleton();
		this.consoleout("end construct");
	}

	doExecute(H_param: {} | any[] = Array()) //view生成
	//global session
	//session初期化
	//$O_view->clearSessionMenu();
	//menu用model取得
	//注文詳細modelbase呼出し
	//今日の日付を連想配列に入れる
	//loginチェック
	//localセッションを取得
	//必須sessionチェック
	//統括販売店かチェック 後付けカコワルイ…
	//統括販売店なら下位の販売店IDも取得する
	//ダウンロード権限の有無を取得
	//指定されたキャリアのみ表示する(0の場合はいつも通り、全てのキャリアを表示する)
	//この値は、ドコモ監査対応である
	//formの初期状態を取得する
	//$H_sess["SELF"]["post"] = $O_view->setDefaultSearchSession($H_sess["SELF"], $H_date);
	//ステータス一覧を取得する
	//発注種別一覧を取得する
	//購入方法を取得
	//受領確認を取得
	//その他取得
	//k76 予定日確定日
	//販売店名一覧を取得
	//キャリア一覧を取得する
	//sql句作成
	//検索実行
	//offsetしないとね
	//$H_data = $O_model->offsetListData(&$H_sess, &$H_data);
	//振替先を取得する
	//部門コードを取得する (部門コードは下位の販売店IDいらない)
	//form作成
	//formのdefalt値入力
	//$O_view->setSearchFormDefault($O_order, $H_sess["SELF"], $H_date);
	//検索条件の入力チェック
	//// 台数を別に取得する
	//		$H_data = $O_model->getOrderNumber($H_data);
	//ページリンク作成
	//display
	//$this->debugOut( "DEBUG: 表示してみたんだからねっ！" );
	{
		var H_box = Array();
		this.consoleout("start doExecute");
		var O_view = new ShopOrderListViewView();
		var H_g_sess = O_view.getGlobalShopSession();
		O_view.clearUnderSession([ShopOrderListViewProc.PUB]);
		var O_model = new ShopOrderListViewModel(O_db0, H_g_sess);
		var O_basemodel = new ShopOrderModelBase(O_db0, H_g_sess);
		var H_date = O_model.getTodayHash();
		this.consoleout("start startCheck");
		O_view.startCheck();
		this.consoleout("end startCheck");
		var H_sess = O_view.getLocalSession();
		O_view.checkParamError(H_sess, H_g_sess);
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), MT_SITE);
		H_flg.unify = H_box.unify = O_model.checkUnifyShop(H_g_sess.shopid);

		if (true == H_flg.unify) {
			var H_shopid = O_model.getChildShopID(H_g_sess.shopid, H_g_sess.shopname, H_box.unify, true);
			var A_shopid = Object.keys(H_shopid);
		} else {
			A_shopid = [H_g_sess.shopid];
		}

		H_flg.dlauth = O_model.getDLAuth(H_g_sess);
		var carid_only = undefined !== H_sess[ShopOrderListViewProc.PUB].carid_only ? H_sess[ShopOrderListViewProc.PUB].carid_only : 0;
		H_sess[ShopOrderListViewProc.PUB].post = O_view.setDefaultSearchSession(H_sess[ShopOrderListViewProc.PUB], H_date, carid_only);
		H_box.status = O_model.getOrderStatus([this.O_order.st_sub_trchkreq, this.O_order.st_receiptreq, this.O_order.st_receiptfin]);
		H_box.ordertype = O_model.getOrderType();
		H_box.buyselid = O_model.getOrderBuySelID();
		H_box.receipt = O_model.getOrderReceive();
		H_box.misctype = this.getMiscType(O_view.gSess().groupid, "misctype", "name", carid_only);
		H_box.deliverydate_type = O_model.getOrderDeliveryDateType();
		H_box.send_deliverydate_flg = O_model.getOrderSendDeliveryDateFlg();
		this.consoleout("start getShopList");
		var H_shoplist = O_model.getShopList(O_view.gSess().groupid);
		this.consoleout("end getShopList");
		this.consoleout("start getOrderCarrier");
		H_box.carid = O_model.getOrderCarrier();
		this.consoleout("end getOrderCarrier");
		this.consoleout("start makeSearchSql");
		var H_sql = O_model.makeSearchSql(H_sess, H_box, A_shopid);
		this.consoleout("end makeSearchSql");
		this.consoleout("start \u30C7\u30FC\u30BF\u53D6\u5F97");

		if (!O_view.getSearchMode()) //$H_data = $O_model->getSearchResult($H_sql["search"], $O_view);
			////	新旧の値比較用
			//$H_data = $O_model->getList($H_sess, $H_box, $A_shopid);
			//foreach( $H_data as $idx => $data ){
			//	foreach( $data as $key=>$value ){
			//		if( $value != $H_data2[$idx][$key] ){
			//			echo $key;
			//			var_dump( $value );
			//			var_dump( $H_data2[$idx][$key] );
			//		}
			//	}
			//}
			//$H_sql = $O_model->H_sql;
			//データをまとめたり分納探したり
			//処理台数ぽよ
			//
			//$H_info["chargecnt"] = $O_model->getChargeCount3($A_shopid, $orderids);
			{
				this.consoleout("\tstart getList");
				var H_data = O_model.getList2(H_sess, H_box, A_shopid);
				this.consoleout("\tend getList");
				this.consoleout("\tstart makeListData");
				H_data = O_model.makeListData(H_data);
				this.consoleout("\tend makeListData");
				this.consoleout("\tstart orderids");
				var orderids = Object.keys(H_data);
				this.consoleout("\tend orderids");
				this.consoleout("start getTransferShopId(from)");
				H_info.fromshop = O_model.getTransferShopId(A_shopid, H_shoplist, "from", orderids);
				this.consoleout("end getTransferShopId(from)");
				this.consoleout("start getTransferShopId(to)");
				H_info.toshop = O_model.getTransferShopId(A_shopid, H_shoplist, "to", orderids);
				this.consoleout("end getTransferShopId(to)");
				H_info.chargecnt = O_model.getChargeCount3(A_shopid, orderids);
				H_data = O_model.getOrderNumber(H_data);
			}

		this.consoleout("end \u30C7\u30FC\u30BF\u53D6\u5F97");
		this.consoleout("start offsetListData");
		this.consoleout("end offsetListData");
		this.consoleout("start \u691C\u7D22\u6642\u306E\u307F");

		if (!O_view.getSearchMode()) //$H_info["fromshop"] = $O_model->getTransferShopId($A_shopid, $H_shoplist, "from");
			//$H_info["toshop"] = $O_model->getTransferShopId($A_shopid, $H_shoplist, "to");
			//$this->consoleout("\tstart getChargeCount2");
			//				$H_info["chargecnt"] = $O_model->getChargeCount2($A_shopid, $orderids);
			//$this->consoleout("\tend getChargeCount2");
			{
				this.consoleout("\tstart getCarrierInfo");
				H_info.carrier = O_model.getCarrierInfo();
				this.consoleout("\tstart getStatusInfo");
				H_info.status = O_model.getStatusInfo();
			}

		this.consoleout("end \u691C\u7D22\u6642\u306E\u307F");
		this.consoleout("start getTransfer");
		H_select.trans = O_model.getTransfer(H_g_sess, A_shopid);
		this.consoleout("end getTransfer");
		H_select.section = O_model.getSectionCode(A_shopid);
		var O_prefmodel = new PrefectureModel();
		H_select.pref[""] = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
		H_select.pref += O_prefmodel.getPrefecture("JPN");
		O_view.makeSearchForm(H_box, H_select, carid_only);
		O_view.setSearchFormDefault(H_sess[ShopOrderListViewProc.PUB], H_date, carid_only);
		O_view.checkSearchRule(H_sess);
		var A_order = O_basemodel.extractOrderColumn(H_data, "orderid");

		if (0 < A_order.length) //$H_data = $O_model->addTransferInfo($H_data, $A_order, $H_g_sess["shopid"]);
			//$O_model->addTransferInfo(&$H_data, &$A_order, &$H_g_sess["shopid"]);
			{
				O_model.addTransferInfo(H_data, A_order, A_shopid);
			}

		var cnt = H_data.length;
		cnt = O_model.count;
		O_model.setOrderID(H_data, H_sql);
		var pagelink = O_model.getPageLink(H_sess, cnt);
		O_view.setSearchWhere(H_sql.down);
		O_view.displaySmarty(H_g_sess, H_data, H_flg, H_sess[ShopOrderListViewProc.PUB].limit, cnt, pagelink, H_view.pankuzu_link, H_shoplist, H_info);
	}

	getMiscType(groupid, _key, _name, carid = 0) //その他内容の名前一覧を取得
	//内容を編集して
	//返す
	////	その他に関しては、後ほどテーブルとかで管理したほうが良いかもしれん
	//		$res = array();
	//		$buf = array();
	//		//	読込む・・
	//		$ini = parse_ini_file( KCS_DIR."/conf_sync/order_misc.ini" );
	//		//	A_misctypeを初期値とする
	//		$A_misc = isset( $ini["A_misctype"] ) ? explode( ",",$ini["A_misctype"]) : array();
	//		foreach( $A_misc as $key => $value ){
	//			$buf[$value] = true;
	//		}
	//		//	追加分追加
	//		foreach( $ini as $key => $value ){
	//			if( strpos( $key,"A_add_" ) !== 0){
	//				continue;
	//			}
	//			
	//			$A_misc = explode( ",",$value );
	//			//	
	//			foreach( $A_misc as $key => $value ){
	//				$buf[$value] = true;
	//			}		
	//		}
	//		if( isset( $buf["選択してください"] ) ){
	//			unset( $buf["選択してください"] );
	//		}
	//		foreach( $buf as $key => $value ){
	//			$temp = array();
	//			$temp[$_key] = $key;
	//			$temp[$_name] = $key;
	//			$res[] = $temp;
	//		}
	//		return $res;
	{
		var res = Array();
		var O_misc = new MiscModel();
		var types = O_misc.getMiscTypeName(groupid, carid);

		for (var type of Object.values(types)) {
			res.push({
				[_key]: type,
				[_name]: type
			});
		}

		return res;
	}

	__destruct() {
		super.__destruct();
	}

};