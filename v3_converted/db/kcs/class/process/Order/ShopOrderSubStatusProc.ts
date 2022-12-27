//
//個別出荷Proc
//
//更新履歴：<br>
//2008/07/27 igarashi 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author igarashi
//@since 2008/07/27
//
//
//error_reporting(E_ALL|E_STRICT);
//
//個別出荷Proc
//
//@uses OrderFormProcBase
//@package Order
//@author igarashi
//@since 2008/07/27
//

require("process/Order/ShopOrderDetailProcBase.php");

require("model/Order/ShopOrderDetailModel.php");

require("model/Order/ShopOrderSubStatusModel.php");

require("view/Order/ShopOrderSubStatusView.php");

require("model/Order/ShopOrderCancelTransferModel.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/07/27
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author igarashi
//@since 2008/07/27
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author igarashi
//@since 2008/07/27
//
//@param array $H_g_sess
//@param mixed $O_order
//@access protected
//@return void
//
//
//Smartyで表示
//
//@author igarashi
//@since 2008/07/27
//
//@param $H_param
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
//getUserAuth
//ユーザーの権限を返すよ
//現在は会社権限のみ返す。
//
//@since 20150313
//return array()
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/07/27
//
//@access public
//@return void
//
class ShopOrderSubStatusProc extends ShopOrderDetailProcBase {
	constructor(H_param: {} | any[] = Array()) //$this->debagmode=true;
	{
		super(H_param);
	}

	get_View() {
		return new ShopOrderSubStatusView();
	}

	get_Model(H_g_sess: {} | any[], flg = OrderModelBase.SITE_SHOP) {
		return new ShopOrderSubStatusModel(O_db0, H_g_sess, flg);
	}

	doExecute(H_param: {} | any[] = Array()) //view作成
	//CGI取得
	//GlobalSESSION取得
	//LocalSESSION取得
	//model作成
	//包括販売店は配下の販売店idも拾う
	//cssを取得
	//パンクズリンク取得
	//販売店一覧取得
	//サブステータス取得
	//
	//表示用情報取得
	//
	//包括販売店は配下の販売店idを拾う
	//$H_view["order"]["machine"] = $O_model->makeUniqueOrderData($H_view["order"]["machine"]);
	//$H_view["order"]["acce"] = $O_model->makeUniqueOrderData($H_view["order"]["acce"]);
	//振替えられた受注を取得
	//K76 納品日メール 20150313 date
	//ユーザー権限取得
	//
	//form作成
	//
	//端末の状態と電話番号を1カラムにまとめて表示できる様にする
	//$H_view["sum_stat"] = $O_model->summarySubStat($H_mergedata, $H_view["order"]["workdetail"], $H_view, $H_view["keyshop"], "forshop");
	//データがデカイので使ったら消す
	//unset($H_mergedata);
	//QuickFormにデフォルト値をセット
	//
	//更新
	//
	//改番予定の番号が既に電話管理にないか確認する
	//入力電話番号重複チェック
	//更新用sql生成
	//更新ボタンが押されたらupdateしたりinsertしたり
	//改番処理を入れる
	//新規以外はデータ取得をもう一度行う
	//$telno = array(implode(",",$H_sess["SELF"]["uptarget"] ));	//	キーが連番になってしまうのでやめた
	//改番の実行
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getLocalSession();
		var O_model = this.get_Model(H_g_sess, 1);
		var billModel = new BillingModelBase();
		var billView = new BillingViewBase();
		O_model.setBillView(billView);
		O_view.setBillView(billView);
		H_view.unify = O_model.checkUnifyShop(H_g_sess, H_g_sess.shopid, "parent");
		H_view.unifychild = O_model.getParentShopID(H_g_sess.shopid);
		var A_shopid = O_model.getChildShopID(H_g_sess, H_view.unify, true);

		if (true == Array.isArray(A_shopid)) {
			H_view.keyshop = Object.keys(A_shopid);
		}

		var A_auth = O_model.get_AuthIni();
		H_view.js = O_view.getHeaderJS();
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "shop");
		H_view.shoplist = O_model.getShopList(H_g_sess, O_view.gSess().groupid);
		H_order.substat = O_model.getOrderSubStatus();
		H_order.count = H_sess[ShopOrderSubStatusProc.PUB].count;
		H_order.transhop = O_model.getTransfer(H_view.keyshop, H_g_sess.shopid);
		H_view.order = O_model.getOrderInfo(H_g_sess, H_sess[ShopOrderSubStatusProc.PUB].orderid, H_g_sess.shopid, A_shopid, H_sess.SELF.area);
		H_view.assets = O_model.getAssetsAuth([H_view.order.order]);
		H_view.order.area = O_model.getAreaList(H_view.order.order.carid);

		var O_fjp = this._getFjpModel(H_view.order.order.pactid);

		O_model.setfjpModelObject(O_fjp);
		var H_mergedata = O_model.mergeCheckArray(H_view.order.machine, H_view.order.acce, "merge");
		H_view.order.workdetail = O_model.getWorkDetailNo(H_g_sess, H_view, H_mergedata, H_view.keyshop);

		if (true == H_view.unify) {
			H_view.order.transto = O_model.getToTransferDetail(H_sess[ShopOrderSubStatusProc.PUB].orderid, H_view.keyshop);
			H_view.order.transfrom = O_model.getFromTransferDetail(H_sess[ShopOrderSubStatusProc.PUB].orderid, H_view.keyshop);
		} else {
			H_view.order.transto = O_model.getToTransferDetail(H_sess[ShopOrderSubStatusProc.PUB].orderid, H_g_sess.shopid);
			H_view.order.transfrom = O_model.getFromTransferDetail(H_sess[ShopOrderSubStatusProc.PUB].orderid, H_g_sess.shopid);
		}

		O_model.setOrderTelno(H_view.order);
		O_model.addDispDetailSwitch(H_g_sess, H_view.order, H_view.keyshop);
		H_view.orderdate = O_model.getTelManageOrderDate(H_view.order);

		if (this.O_order.type_blp == H_view.order.order.ordertype) {
			O_model.adjustBalkPlan(H_view);
		}

		H_view.exists = O_model.checkExists(H_view.order);
		H_view.user_auth = this.getUserAuth(H_view.order.order.pactid);
		O_view.makeShopOrderSubStatusForm(H_order, H_view, O_model.makeDateHash(this.O_order.today));

		if (this.O_order.type_blp != H_view.order.order.ordertype) //$H_view["sum_tel"] = $O_model->summaryValue($H_mergedata, $H_view["order"]["workdetail"], "telno_view");
			{} else {
			H_view.sum_tel = O_model.summaryValue(H_mergedata, H_view.order.workdetail, "arname");
		}

		O_view.setDefaultsForm(O_model.getDefaultsForm(H_view));
		O_view.setFormRule();
		var detail_sorts = H_sess.SELF.uptarget;
		H_view.errmsg.kaiban_telno_multi = O_model.checkUserInputTelnoKaibanMulti(H_view.order.order.orderid, detail_sorts);

		if (this.O_order.type_new == H_view.order.order.ordertype && undefined !== H_sess.SELF.status) {
			if (this.O_order.st_prcfin > H_view.order.order.status && this.O_order.st_cancel != H_sess.SELF.status) {
				if (this.O_order.st_sub_prcfin <= H_sess.SELF.status) {
					H_view.errmsg.telno = O_model.checkUserInputTelno(H_sess.SELF, H_view.order.order.orderid, H_view.order);
				}
			}
		}

		if (true == (undefined !== H_sess.SELF.status) && this.O_order.st_sub_prcfin <= H_sess.SELF.status) {
			if (this.O_order.st_prcfin > H_view.order.order.status && this.O_order.st_cancel != H_sess.SELF.status) {
				H_view.errmsg.serno = O_model.checkUserInputSerialno(H_sess.SELF, H_view.order.order.orderid, H_view.order);
				H_view.errmsg.simno = O_model.checkUserInputSimno(H_sess.SELF, H_view.order, H_view.order.order.orderid);
			}
		}

		H_view.errmsg.date = O_model.checkDateRelated(H_sess.SELF);
		H_view.errmsg.expect = O_model.checkInputExpectDate(H_sess.SELF, H_view.order);
		H_view.errmsg.delivery = O_model.checkInputDeliveryDate(H_sess.SELF, H_view.order);
		O_view.validate(H_sess.SELF, H_view.errmsg);

		if (true == (undefined !== H_sess.SELF.execsub)) //更新許可判定フラグセット
			//sql文作成
			//メール送信取得
			//更新成功時だけ実行
			{
				O_model.setRegistType(H_view.order.order.pactid, "shop");
				O_model.setShopUser(true);
				O_model.setPostID(O_model.checkPostID(H_view.order.order.postid, H_view.order.order.pactid, true));
				var H_sql = O_model.makeUpdateSQLCtrl(H_g_sess, H_sess, H_view);
				H_view.err = H_sql.err;
				var H_trflg = O_model.getTransferFlag();

				if (true == H_trflg.cancel) {
					var H_addr = O_model.readyTransferCancelMail(H_g_sess, H_view.order.order.orderid);
				}

				H_view.upflg = O_model.execUpdateStatusHand(H_sql.sql, this.debagmode);

				if ("exec" == H_view.upflg.flg) {
					O_model.updateTelcnt(H_sess, H_view.order, this.debagmode);
					O_model.updateCancelOrderTransfer(H_sess, H_view);
					O_model.writeShopMngLog(H_sess, "update");
					O_model.updateStockTable(H_g_sess, H_sess.SELF, H_view.order, this.debagmode);
				}

				H_pro.sql = O_model.autoPromoteSQL(H_view.order.order.orderid);

				if (undefined != H_pro.sql) {
					O_model.execUpdateStatusHand(H_pro, this.debagmode);
				}

				H_charge.sql = O_model.cleanTransferCharge(H_sess);

				if (undefined != H_charge.sql) {
					O_model.execUpdateStatusHand(H_charge, this.debagmode);
				}

				if (true == H_trflg.trans) {
					O_model.sendTransferMail(H_g_sess, H_sess, H_view.order);
				} else if (true == H_trflg.cancel) {
					O_model.sendCancelTransferMail(H_g_sess, H_addr);
				}
			} else {
			H_view.upflg.flg = "unexec";
		}

		var kaiban_teldetail = O_model.getTelDetailByKaiban(H_sess[ShopOrderSubStatusProc.PUB].orderid, detail_sorts);

		if (false == !kaiban_teldetail && "exec" == H_view.upflg.flg) //更新用sql生成
			//更新成功時だけ実行
			{
				H_sql = O_model.makeUpdateSQLCtrl_kaiban(H_sess[ShopOrderSubStatusProc.PUB].orderid, kaiban_teldetail, H_g_sess);
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

		O_view.displaySmarty(H_g_sess, H_view);
	}

	_getFjpModel(A_auth) {
		if (!this.O_fjp instanceof fjpModel) {
			return this.O_fjp = new fjpModel(ShopOrderSubStatusProc.PUB, A_auth);
		}

		return this.O_fjp;
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