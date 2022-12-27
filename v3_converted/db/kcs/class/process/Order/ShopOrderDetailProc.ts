//
//受注詳細Proc
//
//更新履歴：<br>
//2008/06/30 igarashi 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author igarashi
//@since 2008/06/30
//
//
//error_reporting(E_ALL|E_STRICT);
//
//受注詳細Proc
//
//@uses OrderFormProcBase
//@package Order
//@author igarashi
//@since 2008/07/23
//

require("process/Order/ShopOrderDetailProcBase.php");

require("model/Order/ShopOrderDetailModel.php");

require("model/Order/ShopOrderUserInfoModel.php");

require("view/Order/ShopOrderDetailView.php");

require("view/Order/BillingViewBase.php");

require("model/Order/BillingModelBase.php");

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
//各ページのViewオブジェクト取得
//
//@author igarashi
//@since 2008/06/30
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author igarashi
//@since 2008/06/30
//
//@param array $H_g_sess
//@param mixed $O_order
//@access protected
//@return void
//
//
//お客様情報Modelオブジェクト取得
//
//@author igarashi
//@since 2008/07/22
//
//@param $H_g_sess
//
//@access protected
//@return none
//
//
//受注詳細メインループ
//
//@author igarashi
//
//@access public
//@return none
//
//
//_getFjpModel
//
//@author igarashi
//@since 2011/07/07
//
//@param mixed $A_auth
//@access protected
//@return void
//
//
//getBillingView
//
//@author web
//@since 2013/04/10
//
//@access protected
//@return void
//
//
//getBillModel
//
//@author web
//@since 2013/04/10
//
//@access protected
//@return void
//
//
//getUserAuth
//ユーザーの権限を返すよ
//現在は会社権限のみ返す。
//
//@since 20150128
//return array()
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/06/30
//
//@access public
//@return void
//
class ShopOrderDetailProc extends ShopOrderDetailProcBase {
	constructor(H_param: {} | any[] = Array()) //trueで全sqlがrollbackされる。
	//sql実行時にエラーを吐いたsqlがvar_dumpされる
	//$this->debagmode = true;
	{
		super(H_param);
	}

	get_View() {
		return new ShopOrderDetailView();
	}

	get_Model(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new ShopOrderDetailModel(O_db0, H_g_sess, site_flg);
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
	//包括販売店は配下の販売店idを拾う
	//パンクズリンク取得
	//
	//form作成
	//
	//全台数を取得
	//件数を取得
	//件数を取得
	//販売店ステータス取得
	//支払い方法取得
	//販売店一覧
	//
	//表示用情報取得
	//
	//オーダー情報取得
	//k76 改番取消しボタンが押された 20150519date
	//雛形から入れられた情報で端末種別名を取得
	//価格表を優先するのでproductidがあったら上書き
	//振替えられた受注を取得
	//振替先、振替元販売店コード、担当者取得
	//関係ない販売店なら見せない
	//みたらログに書いておく(確認画面と完了画面は除く)
	//発注種別によってはlinecnt減らす
	//$H_view["order"]["ordershopid"] = $O_model->setTargetOrderShopID(&$H_view["order"], &$A_shopid);
	//第2階層権限を持った会社かチェックする
	//受注更新履歴取得
	//価格入力欄のデフォルト値を税込みか税抜きか判断
	//振替られていない明細を表示しないようにフラグ追加
	//k90 「受注完了メール送信グレーアウト」会社権限追加 権限取得の位置を変更 hanashima 20201118
	//K76 納品日メール 20150128date
	//ユーザー権限取得
	//フォーム作成
	//現在の価格を取得
	//2014-09-05
	//k90 「受注完了メール送信グレーアウト」会社権限追加 権限取得の位置を変更 hanashima 20201118
	//K76 納品日メール 20150128date
	//ユーザー権限取得
	//$H_view["user_auth"] = $this->getUserAuth($H_view["order"]["order"]["pactid"]);
	//ポイントレートを取得する
	//端末の件数を取得する
	//存在しないデータを表示できる様にする(-で表示させる)
	//$H_view["order"]["machine"] = $O_model->repairOrderData($H_view["order"]["machine"], "telno", "-", true, false);
	//シリアライズされたオプションを表示用に変換する
	//地域会社がとれていなければ代表地域に変換
	//割引サービスを表示用に編集
	//割引通話先を表示用に編集
	//サービスを表示用に編集
	//販売店部門コード取得
	//端末の利用期間を取得
	//税率取得
	//所属販売店管理者の権限取得
	//k76 20150218 date
	//納品日の予定日確定日のルールの追加
	//渡すようにしました
	//印刷ボタン表示
	//
	//改番について
	//
	//新規以外はデータ取得をもう一度行う
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getLocalSession();
		var O_model = this.get_Model(H_g_sess);
		var O_m_user = this.get_ShopOrderUserInfoModel(H_g_sess);
		var billModel = new BillingModelBase();
		var billView = new BillingViewBase();
		O_model.setBillView(billView);
		O_view.setBillView(billView);
		O_view.clearUnderSession([ShopOrderDetailProc.PUB, "/MTOrderList", "/Shop/MTOrder/rapid"]);
		H_view.unify = O_model.checkUnifyShop(H_g_sess, H_g_sess.shopid);
		var A_shopid = O_model.getChildShopID(H_g_sess, H_view.unify, true);

		if (true == Array.isArray(A_shopid)) {
			var A_keyshop = Object.keys(A_shopid);
		}

		H_view.js = O_view.getHeaderJS();
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "shop");
		H_view.count = O_model.getOrderSubCount(H_sess[ShopOrderDetailProc.PUB].orderid, "count");
		H_view.linecnt = O_model.getOrderSubCount(H_sess[ShopOrderDetailProc.PUB].orderid, "line");
		H_view.telline = O_model.getOrderSubCount(H_sess[ShopOrderDetailProc.PUB].orderid, "telline");
		H_view.status = O_model.getShopOrderStatus(false);
		H_view.settlement = O_model.getSettlement();
		H_view.shoplist = O_model.getShopList(H_g_sess, O_view.gSess().groupid);
		H_view.order = O_model.getOrderInfo(H_g_sess, H_sess[ShopOrderDetailProc.PUB].orderid, H_g_sess.shopid, A_shopid);

		if (true != (undefined !== H_sess.SELF.execsub) && true == (undefined !== H_sess.SELF.kaiban_delete)) //改番フラグとフリーメッセージの修正を行う
			//SQLの実行
			//ログ
			//読み直す
			{
				var sql = O_model.makeKaibanDeleteSQLCtrl(H_sess, H_view.order);
				var upflg = O_model.execUpdateStatusHand(sql.sql, this.debagmode);

				if ("exec" == upflg.flg) //$O_model->writeShopMngLog(&$H_sess, "update");
					{} else {
					O_model.makeOrderErrLogSQL(H_view.order);
				}

				delete H_sess.SELF.kaiban_delete;
				header("location: order_detail.php");
				throw die();
			}

		MtTax.setDate(H_view.order.order.finishdate);
		O_view.registSubtractPointFromSubtotal(H_view.order.order.carid);

		var O_fjp = this._getFjpModel(H_view.order.order.pactid);

		O_model.setfjpModelObject(O_fjp);
		H_view.showfjp = O_fjp.checkAuth("co");
		H_view.showextension = O_model.checkExtensionNoFunction(H_view.order.order.pactid);
		var ordertype = H_view.order.order.ordertype;

		if (this.O_order.type_acc == ordertype) {
			H_view.count--;
			H_view.extensionno = O_model.regetExtensionNo(H_view.order.order.orderid);
		}

		H_view.smarttypeedit = true;
		H_view.smarttypename = O_model.getSmartPhoneType(H_view.order.order.smartphonetype);

		if (!!H_view.order.machine[0].productid) {
			H_view.smarttypename = O_model.getSmartType(H_view.order.machine[0].productid);
			H_view.smarttypeedit = false;
		} else if (!!H_sess.SELF.smarttypehidden || "0" == H_sess.SELF.smarttypehidden) {
			H_view.smarttypename = O_model.getSmartPhoneType(H_sess.SELF.smarttypehidden);
		} else {
			H_view.smarttypename = O_model.getSmartPhoneType(H_view.order.order.smartphonetype);
		}

		if (true == H_view.unify) {
			H_view.order.transto = O_model.getToTransferDetail(H_sess[ShopOrderDetailProc.PUB].orderid, A_keyshop);
			H_view.order.transfrom = O_model.getFromTransferDetail(H_sess[ShopOrderDetailProc.PUB].orderid, A_keyshop);
		} else {
			H_view.order.transto = O_model.getToTransferDetail(H_sess[ShopOrderDetailProc.PUB].orderid, H_g_sess.shopid);
			H_view.order.transfrom = O_model.getFromTransferDetail(H_sess[ShopOrderDetailProc.PUB].orderid, H_g_sess.shopid);
		}

		H_view.transhop = O_model.getDispTransferShop(H_view.order);
		O_model.isTransfer(H_view);
		O_model.setOrderTelno(H_view.order);
		O_model.exitNoAuth(H_g_sess, H_view, A_keyshop);

		if (false == (undefined !== H_sess.SELF.confirm) && false == (undefined !== H_sess.SELF.execsub)) {
			O_model.writeShopMngLog(H_sess, "reading");
		}

		H_view.assets = O_model.getAssetsAuth(H_view.order);
		var H_mergedata = O_model.mergeCheckArray(H_view.order.machine, H_view.order.acce, "merge");
		H_view.order.workdetail = O_model.getWorkDetailNo(H_g_sess, H_view, H_mergedata, A_keyshop);
		H_view.statusview = O_model.getDispStatusFlag(H_view.order, A_keyshop);

		if (this.O_order.type_blp != H_view.order.order.ordertype) {
			H_view.sum_tel = O_model.summaryValue(H_mergedata, H_view.order.workdetail, "telno_view");
			H_view.sum_tel_only = O_model.summaryTelno(O_model.getTelnoOnly(H_view.order.order.orderid), H_view.order.workdetail);
		} else {
			H_view.sum_tel = O_model.summaryValue(H_mergedata, H_view.order.workdetail, "arname");
		}

		H_view.sum_stat = O_model.summarySubStat(H_mergedata, H_view.order.workdetail, H_view, A_keyshop, "forshop");
		H_view.sum_comment = O_model.summaryValue(H_mergedata, H_view.order.workdetail, "subcomment");
		O_model.adjustLineCnt(H_view);
		H_view.flg.secondroot = O_model.getSecondRootAuth(H_view.order.order.pactid);
		O_model.convSecondRootOverWrite(H_view);
		H_view.history = O_model.getOrderHistory(H_sess[ShopOrderDetailProc.PUB].orderid);
		H_view.noloanid = O_model.getNotLoanBuyselID();
		H_view.area = O_model.getAreaList(H_view.order.order.carid, "select");
		H_view.property = O_model.getTelProperty(this.O_order.A_ordtelno, H_view.order.order);
		H_view.flg.taxflg = O_model.getTaxFlag(H_view.order.order, H_view.order.machine, H_view.noloanid);
		O_model.addDispDetailSwitch(H_g_sess, H_view.order, A_keyshop);
		H_view.exists = O_model.checkExists(H_view.order);
		H_view.user_auth = this.getUserAuth(H_view.order.order.pactid);
		H_view.tel_regist = O_model.getTelRegist(H_view.order);
		O_view.makeShopOrderDetailForm(H_sess.SELF, H_view, H_g_sess.shopid, O_model.makeDateHash(this.O_order.today));
		var H_price = O_model.getOrderPrice(H_view.order, H_view.noloanid, H_view.flg.taxflg);
		var pricelistenableflag = true;

		if (!is_null(H_price)) {
			for (var p of Object.values(H_price)) {
				if (is_null(p)) {
					pricelistenableflag = false;
					break;
				}
			}
		}

		if (!pricelistenableflag) {
			{
				let _tmp_0 = H_view.order.machine;

				for (var key in _tmp_0) {
					var val = _tmp_0[key];

					if (is_null(val.saleprice)) {
						H_view.saleprice_errorflag = true;
						break;
					}
				}
			}
		}

		if (this.O_order.type_blp != ordertype) {
			O_model.getTaxoutAnserPrice(H_view.order.regist, H_view.flg.taxflg);
			O_model.getTaxoutAnserPrice(H_view.order.machine, H_view.flg.taxflg);
			O_model.getTaxoutAnserPrice(H_view.order.acce, H_view.flg.taxflg);
		}

		if (this.O_order.type_new != ordertype) //付属品とその他は端末情報を使わない
			{
				if (true == (-1 !== [this.O_order.type_acc, this.O_order.type_mis].indexOf(ordertype))) {
					H_view.manage = O_model.getTelManageInfo([O_model.getOrderTelno(H_view.order)], H_view.order, true);

					if (undefined != H_view.manage) //付属品、その他の注文でも表示するようにした(20181107date)
						//detail_sortが消えるので入れ直す
						{
							H_view.manage[0].pay_monthly_sum = H_view.order.machine[0].pay_monthly_sum;
							H_view.manage[0].substatus = H_view.order.machine[0].substatus;
							H_view.manage[0].extensionno = H_view.order.machine[0].extensionno;
							H_view.manage[0].telusername = H_view.order.machine[0].telusername;
							H_view.manage[0].employeecode = H_view.order.machine[0].employeecode;
							H_view.manage[0].arid = H_view.order.machine[0].arid;

							if (ordertype == this.O_order.type_mis) {
								H_view.manage[0].simcardno = H_view.order.machine[0].simcardno;
								H_view.manage[0].serialno = H_view.order.machine[0].serialno;
								H_view.manage[0].deliverydate = H_view.order.machine[0].deliverydate;
								H_view.manage[0].expectdate = H_view.order.machine[0].expectdate;
								H_view.manage[0].saleprice = H_view.order.machine[0].saleprice;
								H_view.manage[0].shoppoint = H_view.order.machine[0].shoppoint;
								H_view.manage[0].shoppoint2 = H_view.order.machine[0].shoppoint2;
							}

							var tempData = H_view.order.machine;
							H_view.order.machine = H_view.manage;

							if (this.O_order.type_mis == ordertype) {
								var misccnt = 0;
								{
									let _tmp_1 = H_view.order.machine;

									for (var key in _tmp_1) {
										var val = _tmp_1[key];
										H_view.order.machine[key].detail_sort = misccnt;
										H_view.order.machine[key].machineflg = true;
										H_view.order.machine[key].free_one = tempData[key].free_one;
										H_view.order.machine[key].free_two = tempData[key].free_two;
										H_view.order.machine[key].free_the = tempData[key].free_the;
										H_view.order.machine[key].free_for = tempData[key].free_for;
										H_view.order.machine[key].free_fiv = tempData[key].free_fiv;
										H_view.order.machine[key].kaiban_telno = tempData[key].kaiban_telno;
										H_view.order.machine[key].kaiban_telno_view = tempData[key].kaiban_telno_view;
										misccnt++;
									}
								}
							}
						}
				} else if (this.O_order.type_mnp == ordertype) //電話情報とオーダー情報をマージする
					{
						H_view.manage = O_model.getTelManageInfo(this.O_order.A_ordtelno, H_view.order, false);
						H_view.order.machine = O_model.mergeOrderAndManageData(H_view.order.machine, H_view.manage);
					} else if (this.O_order.type_blp == ordertype) {
					H_view.manage = O_model.getTelManageInfo(this.O_order.A_ordtelno, H_view.order, true, true);
					H_view.order.machine = O_model.mergeOrderAndManageDataBLP(H_view.order.machine, H_view.manage);
				} else //機種変更の場合、割賦回数をasset_tbから取得しない    20150310 date
					{
						H_view.manage = O_model.getTelManageInfo(this.O_order.A_ordtelno, H_view.order, true);

						if (H_view.order.order.ordertype == "C") {
							delete H_view.manage[0].pay_frequency;
						}

						H_view.order.machine = O_model.mergeOrderAndManageData(H_view.order.machine, H_view.manage);
					}
			}

		if (this.O_order.type_blp == ordertype) {
			O_model.adjustBalkPlan(H_view);
		}

		H_view.order.user = O_m_user.getUserInfomation(H_view.order.order, H_view.flg.secondroot);
		H_view.pnt_rate = O_model.getCarrierPointInfo(H_view.order.order.carid);
		O_model.getPointRate(H_view);
		H_view.mac_num = O_model.getOrderMachineNumber(H_sess[ShopOrderDetailProc.PUB].orderid, ordertype);
		H_view.order.option = O_model.getOptionName(H_view.order.machine[0].option, ordertype, H_view.order.order.carid);
		H_view.order.arname = O_model.getUnifyCircuitName(H_view.order.order.carid, H_view.order.regist[0]);
		H_view.order.waribiki = O_model.getOptionName(H_view.order.machine[0].waribiki, ordertype, H_view.order.order.carid);
		H_view.discounttel = O_model.unserializeArray(H_view.order.machine, "discounttel", "telno");
		H_view.order.service = O_model.getServiceName(H_view.order.order.service);
		H_view.postcode = O_model.getPostCode(H_view.order.order.shopid);
		H_view.orderdate = O_model.getTelManageOrderDate(H_view.order);
		O_model.calcUseTerm(H_view);
		H_view.excisetax = O_model.getExciseTax();
		H_view.order.order.tlementview = O_model.convTlementView(H_view.order.order.settlement);
		O_model.createAuthObjectForShopAdmin(H_g_sess.shopid);
		O_view.setDefaultsForm(O_model.makeDefaltsForm(H_g_sess, H_sess.SELF, H_view, H_price, H_mergedata, A_keyshop));
		O_view.setFormRule(H_sess.SELF, H_view.order, H_view.property);

		if (-1 !== H_view.user_auth.indexOf("fnc_recv_delivery_mail")) //ルールに渡すオプションを取得します
			//ルールを追加します
			{
				var recv_delivery_mail_rule_options = O_model.getRecvDeliveryMailRuleOptions(H_view.order);
				O_view.setFormRuleByRecvDeliveryMail(H_sess.SELF, H_view.order, recv_delivery_mail_rule_options);
			}

		if (Array.isArray(H_sess.SELF.telno) == true) {
			var detail_sorts = Object.keys(H_sess.SELF.telno);
		} else {
			detail_sorts = undefined;
		}

		var kaiban_teldetail_origin = O_model.getTelDetailByKaiban(H_sess[ShopOrderDetailProc.PUB].orderid, detail_sorts);
		var kaiban_teldetail_save = Array();
		var kaiban_teldetail = Array();

		if (!is_null(kaiban_teldetail_origin)) {
			for (var key in kaiban_teldetail_origin) //キャンセルは無視する
			{
				var value = kaiban_teldetail_origin[key];
				value.kaiban_telno_view = H_sess.SELF.telno[value.detail_sort];
				value.kaiban_telno = this.O_order.convertNoView(H_sess.SELF.telno[value.detail_sort]);
				if (value.substatus >= this.O_order.st_cancel) continue;

				if (H_sess.SELF.status < this.O_order.st_sub_prcfin) //formで処理済前が選択されている
					{
						if (H_view.order.order.ordertype != this.O_order.type_new) {
							kaiban_teldetail_save[value.detail_sort] = value;
						}
					} else //formで処理済以降が選択されている
					{
						if (H_view.order.order.ordertype == this.O_order.type_new && value.substatus < this.O_order.st_sub_prcfin) {
							continue;
						}

						if (H_sess.SELF.status != this.O_order.st_cancel) {
							kaiban_teldetail[value.detail_sort] = value;
						}
					}
			}
		}

		H_view.errmsg.indev.kaiban_telno = O_model.checkUserInputTelnoKaiban(H_view.order.order.pactid, H_view.order.order.carid, H_sess.SELF.telno, kaiban_teldetail);
		H_view.errmsg.indev.kaiban_tel_tb = O_model.checkKaibanSorceTelnoExists(H_sess[ShopOrderDetailProc.PUB].orderid, H_view.order.order.ordertype, H_view.order.order.pactid, H_view.order.order.carid, kaiban_teldetail);
		H_view.errmsg.indev.telno = O_model.checkUserInputTelno(H_sess.SELF, H_view.order);
		H_view.errmsg.indev.serno = O_model.checkUserInputSerialno(H_sess.SELF, H_view.order);
		H_view.errmsg.indev.simno = O_model.checkUserInputSimno(H_sess.SELF, H_view.order);
		H_view.errmsg.plan = O_model.checkStayPlanLight(H_view.order, H_view.order.machine, H_sess.SELF);
		H_view.errmsg.expectdate = O_model.checkInputExpectDate(H_sess.SELF, H_view.order);
		H_view.errmsg.deliverydate = O_model.checkInputDeliveryDate(H_sess.SELF, H_view.order);
		H_view.errmsg.extensionno = O_model.checkExtensionNo(H_sess.SELF, H_view.order);

		if (O_model.checkShopAdminFuncId(H_g_sess.shopid, ShopOrderDetailProc.FNC_PRINT_ALWAYS)) {
			O_view.viewPrintButton();
		}

		if (false == (undefined !== H_sess.SELF.confirm) && false == (undefined !== H_sess.SELF.execsub)) //権限を持っている確認します
			{
				if (O_model.checkShopFuncId(H_g_sess.memid, ShopOrderDetailProc.FNC_PRINT_DELIVERY)) {
					O_view.viewPrintDeliveryButton(H_view);
				}
			}

		var bExecute = true;

		if (true == (undefined !== H_sess.SELF.execsub) && false == !kaiban_teldetail) //改番元の電話の存在確認 mnp以外
			{
				if (H_view.order.order.ordertype != this.O_order.type_mnp) {
					var result = O_model.checkTelnoRegist(H_view.order.order.pactid, H_view.order.order.carid, kaiban_teldetail, H_sess.SELF.telno);

					if (result.result == false) {
						H_view.err.push({
							orderid: undefined,
							err: result.err
						});
						bExecute = false;
						H_view.upflg.flg = "fail";
					}
				}

				result = O_model.checkTelnoNotRegist(H_view.order.order.pactid, H_view.order.order.carid, kaiban_teldetail, H_sess.SELF.telno);

				if (result.result == false) {
					H_view.err.push({
						orderid: undefined,
						err: result.err
					});
					bExecute = false;
					H_view.upflg.flg = "fail";
				}
			}

		O_view.validate(H_sess.SELF, H_view.errmsg);

		if (true == (undefined !== H_sess.SELF.execsub) && bExecute == true) //k76各注文のアップデートに関して
			//更新許可判定フラグセット
			//更新用sql生成
			//更新成功時だけ実行
			//メール送信
			//一度実行したらsqlとsessionを消す
			//他のソースの様にView->writeLastForm呼ぶと受注詳細も表示できなくなるので注意
			//$O_view->clearUnderSession(array("/MTOrderList"));
			{
				var O_unique = MtUniqueString.singleton();
				O_unique.validate(_POST.csrfid, "/Shop/menu.php");
				H_view.order.deliverydate_type = O_model.getDeliveryDateTypeInfo(H_sess, H_view);
				O_model.setRegistType(H_view.order.order.pactid, "shop");
				O_model.setShopUser(true);
				O_model.setPostID(O_model.checkPostID(H_view.order.order.postid, H_view.order.order.pactid, true));
				var H_sql = O_model.makeUpdateSQLCtrl(H_g_sess, H_sess, H_view);
				H_view.err = H_sql.err;
				H_view.upflg = O_model.execUpdateStatusHand(H_sql.sql, this.debagmode);

				if ("exec" == H_view.upflg.flg) {
					var stkmsg = O_model.updateStockTable(H_g_sess, H_sess.SELF, H_view.order, this.debagmode);

					if ("" != stkmsg) {
						var A_stockerr = {
							orderid: undefined,
							err: stkmsg
						};
						H_view.err.push(A_stockerr);
					}

					O_model.writeShopMngLog(H_sess, "update");
				} else {
					O_model.makeOrderErrLogSQL(H_view.order);
				}

				if ("1" == H_sess.SELF.endmail) {
					var H_mail = O_model.sendOrderFinishMail(H_sess.SELF, H_view.order, "indiv", H_view.showfjp);
				}

				if (-1 !== H_view.user_auth.indexOf("fnc_recv_delivery_mail")) {
					if (H_sess.SELF.send_deliverydate == "true") {
						O_model.sendDeliveryDateMail(H_sess.SELF, H_view.order);
					}
				}

				delete H_sess.SELF.kaiban_delete;
				delete H_sql;
			} else {
			if (is_null(H_view.upflg.flg)) {
				H_view.upflg.flg = "unexec";
			}
		}

		if (H_view.order.order.ordertype != this.O_order.type_new) //渡すようにしました
			{
				kaiban_teldetail_origin = O_model.getTelDetailByKaiban(H_sess[ShopOrderDetailProc.PUB].orderid, detail_sorts);
				kaiban_teldetail_save = Array();
				kaiban_teldetail = Array();

				if (!is_null(kaiban_teldetail_origin)) {
					for (var key in kaiban_teldetail_origin) {
						var value = kaiban_teldetail_origin[key];
						value.kaiban_telno_view = H_sess.SELF.telno[value.detail_sort];
						value.kaiban_telno = this.O_order.convertNoView(H_sess.SELF.telno[value.detail_sort]);

						if (value.substatus < this.O_order.st_prcfin) {
							kaiban_teldetail_save[value.detail_sort] = value;
						} else {
							if (value.substatus != this.O_order.st_cancel) {
								kaiban_teldetail[value.detail_sort] = value;
							}
						}
					}
				}
			}

		if (false == !kaiban_teldetail && "exec" == H_view.upflg.flg) //更新用sql生成
			//更新成功時だけ実行
			{
				H_sql = O_model.makeUpdateSQLCtrl_kaiban(H_sess[ShopOrderDetailProc.PUB].orderid, kaiban_teldetail, H_g_sess);
				H_view.err = H_sql.err;
				H_view.upflg = O_model.execUpdateStatusHand(H_sql.sql, this.debagmode);

				if ("exec" == H_view.upflg.flg) {
					var comment = "";

					for (var key in kaiban_teldetail) {
						var value = kaiban_teldetail[key];

						if (!!comment) {
							comment += ",";
						}

						comment += value.telno_view + "\u304B\u3089" + value.kaiban_telno_view;
					}

					H_sess.shop_mng_comment = "\u6539\u756A:" + comment + "\u3092\u884C\u3044\u307E\u3057\u305F";
					O_model.writeShopMngLog(H_sess, "update_kaiban");
					delete H_sess.shop_mng_comment;
				} else {
					O_model.makeOrderErrLogSQL(H_view.order);
				}

				delete H_sql;
			}

		if (false == !kaiban_teldetail_save && "exec" == H_view.upflg.flg) //更新成功時だけ実行
			{
				H_sql = O_model.makeUpdateSQLCtrl_kaibanSave(H_sess[ShopOrderDetailProc.PUB].orderid, kaiban_teldetail_save);
				H_view.err = H_sql.err;
				H_view.upflg = O_model.execUpdateStatusHand(H_sql.sql, this.debagmode);

				if ("exec" != H_view.upflg.flg) {
					O_model.makeOrderErrLogSQL(H_view.order);
				}

				delete H_sql;
			}

		O_view.displaySmarty(H_g_sess, H_sess, H_view);
	}

	_getFjpModel(A_auth) {
		if (!this.O_fjp instanceof fjpModel) {
			return this.O_fjp = new fjpModel(ShopOrderDetailProc.PUB, A_auth);
		}

		return this.O_fjp;
	}

	getBillingView() {
		if (!this.O_billView instanceof BillingViewBase) {
			this.O_billView = new BillingViewBase();
		}

		return this.O_billView();
	}

	getBillModel() {
		if (!this.O_billModel instanceof BillingModelBase) {
			this.O_billModel = new BillingModelBase();
		}

		return this.O_billModel;
	}

	getUserAuth(pactid) //$A_userauth = $O_Auth->getUserFuncIni( $userid, "all" );
	//return array_merge( $A_userauth, $A_pactauth );
	{
		var O_Auth = MtAuthority.singleton(pactid);
		var A_pactauth = O_Auth.getPactFuncIni("all");
		return A_pactauth;
	}

	__destruct() {
		super.__destruct();
	}

};