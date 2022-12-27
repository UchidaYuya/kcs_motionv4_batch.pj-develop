//
//注文履歴詳細画面ページプロセス
//
//更新履歴：<br>
//2008/08/04 宮澤龍彦 作成
//
//@uses OrderFormProc
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/08/04
//
//
//
//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装
//
//@uses OrderFormProc
//@package Order
//@author miyazawa
//@since 2008/08/04
//
//

require("process/Order/OrderFormProc.php");

require("model/Order/OrderDetailFormModel.php");

require("view/Order/OrderDetailFormView.php");

require("model/Order/fjpModel.php");

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
//
//各ページのViewオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@access protected
//@return void
//
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@param array $H_g_sess
//@access protected
//@return void
//
//
//
//プロセス処理の実質的なメイン<br>
//
//@author miyazawa
//@since 2008/04/01
//
//@param array $H_param
//@protected
//@access protected
//@return void
//@uses
//@uses
//
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
//
class OrderDetailFormProc extends OrderFormProc {
		constructor(H_param: {} | any[] = Array()) {
				super(H_param);
		}

		get_View() {
				return new OrderDetailFormView();
		}

		get_Model(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
				return new OrderDetailFormModel(O_db0, H_g_sess, site_flg);
		}

		doExecute(H_param: {} | any[] = Array()) //csrfidを消しておく 20190628 伊達
		//注文中のセッションを注文履歴で上書きされる事があったため・・
		//viewオブジェクトの生成
		//不要セッション削除
		//セッション情報取得（グローバル）
		//関数集のオブジェクトの生成
		//modelオブジェクトの生成
		//ログインチェック
		//セッション情報取得（ローカル）
		//権限一覧取得
		//英語化権限 20090210miya
		//注文データ取得
		//20140828date
		//20140828date
		//2次元配列じゃないとダメなので無理矢理arrayっておく
		//一括プラン変更の全件数
		//必要な情報をセッションにセットして読み込みなおし
		//Javascriptの生成
		//パンくずリンクの生成
		//CSSの決定
		//Smartyテンプレートの取得
		//価格表からのデータを作る
		//取得した注文データからカゴの中身を作る
		//一つの配列にまとめる
		//注文情報から電話情報整形
		//注文情報の違約金をチェック
		//MNPは元キャリアから違約金情報を持ってこなければいけない 20090114miya
		//電話詳細情報入力フォーム作成
		//1は電話のユーザ設定項目
		//会社名設定
		//第二階層参照しなければ$H_g_sess["compname"]と同じ
		//登録部署を設定
		//申請部署を設定 20090114miya
		//フォームオブジェクトを生成してフォーム要素を入れる
		//$H_ordersubが抜けてた、なぜ？ 20100126miya
		//$H_ordersubが抜けてた、なぜ？ 20100126miya
		//一括プラン変更
		//fjp
		//スタティック表示作成
		//権限追加 20091009miya
		//Smartyによる表示
		//$H_g_sess追加 20100331miya
		{
				MtUniqueString.singleton().deleteRowWrapper();
				var O_view = this.get_View();
				var O_telinfo_view = this.get_OrderTelInfoView();
				O_view.clearUnderSession();
				var H_g_sess = O_view.getGlobalSession();
				var O_order = OrderUtil.singleton(H_g_sess);
				var O_model = this.get_Model(H_g_sess);
				var O_telinfo_model = this.get_OrderTelInfoModel(H_g_sess);
				var O_order_modify_model = this.get_OrderModifyModel(H_g_sess);
				O_view.startCheck();
				var H_sess = O_view.getLocalSession();
				var A_auth = O_model.get_AuthIni();

				var O_fjp = this._getFjpModel(A_auth);

				O_view.setfjpModelObject(O_fjp);

				if ("ENG" == H_g_sess.language && "shop" != H_param.site) //ローカルセッション取り直し
						{
								O_view.setEnglish(true);
								H_sess = O_view.getLocalSession();
						}

				var H_view = O_view.get_View();
				var H_order = O_model.getOrderInfo2(H_sess[OrderDetailFormProc.PUB].orderid, H_g_sess.language);
				MtTax.setDate(H_order.order.finishdate);
				H_order.order = O_model.calcTotalTax(H_order.order);
				H_order.order = O_model.calcReferTotal(H_order.order, H_order.sub);
				H_order.order = O_model.calcBillTotal(H_order.order, H_order.sub);
				H_order.order.usepoint = O_model.calcUsePoint(H_order.sub);
				H_order.order = O_model.setMoneyFormat([H_order.order], true);
				H_order.sub = O_model.setMoneyFormat(H_order.sub, false);
				H_order.bulkcnt = H_order.sub.length;
				O_view.setOrderInfo(O_db0, H_g_sess, H_order);
				H_sess = O_view.getLocalSession();
				H_view.js = O_view.getHeaderJS();

				if ("ENG" == H_g_sess.language) {
						H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
				} else {
						H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "user");
				}

				H_view.css = O_view.getCSS();
				H_view.smarty_template = "../MTOrder/" + O_model.getSmartyTemplate(H_sess[OrderDetailFormProc.PUB]);
				var H_pricedetail = Array();
				var H_accedetail = Array();
				H_pricedetail = O_model.getPriceDetailFromOrderData(H_order);
				H_accedetail = O_model.getRelatedProductFromOrderData(H_order);
				H_product.tel = H_pricedetail;
				H_product.acce = H_accedetail;
				H_product.purchase = O_view.convPurchaseId(H_sess[OrderDetailFormProc.PUB].carid, H_sess.SELF.purchace);
				H_product.pay_frequency = O_view.convPayCountId(H_sess.SELF.pay_frequency);
				var H_telinfo = O_view.makeTelInfoFromOrderData(H_order);
				H_telinfo = O_telinfo_model.checkOrderPenalty(H_g_sess.pactid, H_telinfo);

				if ("Nmnp" == H_sess[OrderDetailFormProc.PUB].type) {
						var H_sess_mnp = Array();
						var H_sess_mnp_SELF = Array();

						if (true == Array.isArray(H_order.sub)) {
								{
										let _tmp_0 = H_order.sub;

										for (var subky in _tmp_0) {
												var subvl = _tmp_0[subky];

												if (true == subvl.machineflg) {
														H_sess_mnp_SELF["telno_" + subky] = subvl.telno;
														H_sess_mnp_SELF["formercarid_" + subky] = subvl.formercarid;
														H_sess_mnp_SELF["mnpno_" + subky] = subvl.mnpno;
														H_sess_mnp_SELF["mnp_enable_date_" + subky] = subvl.mnp_enable_date;
												}
										}
								}
								H_sess_mnp.SELF = H_sess_mnp_SELF;
						}

						var H_telinfo_mnp = O_telinfo_model.getPenaltyInfoMNP(H_sess_mnp, H_g_sess, H_order.order.recogpostid);

						if ("" != H_telinfo_mnp) {
								for (var mnpky in H_telinfo_mnp) //違約金情報上書き
								{
										var mnpvl = H_telinfo_mnp[mnpky];
										H_telinfo[mnpky.replace(/^telno/g, "")].penalty = mnpvl.penalty;
								}
						}
				}

				if (H_product != "" || H_telinfo != "") //ローカルセッション取り直し
						{
								if (H_product != "") {
										O_view.setProductInfo(H_product);
								}

								if (H_telinfo != "") {
										O_view.setTelInfo(H_telinfo);
								}

								H_sess = O_view.getLocalSession();
						}

				var H_items = O_model.getOrderItem(H_sess[OrderDetailFormProc.PUB]);

				if ("M" != H_sess[OrderDetailFormProc.PUB].type) {
						var telcount = H_sess[OrderDetailFormProc.PUB].telcount;
						var totalTelCnt = 0;

						for (var value of Object.values(H_order.sub)) {
								if (value.machineflg) {
										totalTelCnt++;
								}
						}
				} else {
						telcount = 1;
						totalTelCnt = 1;
				}

				var O_mptm = new ManagementPropertyTbModel();
				var H_telproperty = O_mptm.getManagementPropertyDataForRequired(H_g_sess.pactid, 1);
				[H_telitems, H_telitemrules] = O_telinfo_view.makeTelInfoForm2(H_telproperty, totalTelCnt, H_g_sess.language);

				if (H_telitems.length > 0) {
						H_items = array_merge(H_items, H_telitems);
				}

				H_view.deleteOrderDisplayTelDetaile = false;

				if (true == (-1 !== ["D", "A", "P"].indexOf(H_sess[OrderDetailFormProc.PUB].type)) && -1 !== A_auth.indexOf("fnc_delete_order_display_tel_detaile")) {
						H_view.deleteOrderDisplayTelDetaile = true;
				}

				H_view.orderListDetailShippingMask = false;

				if (true == (-1 !== ["N", "Nmnp", "C", "A", "M"].indexOf(H_sess[OrderDetailFormProc.PUB].type)) && -1 !== A_auth.indexOf("fnc_order_shipping_mask") && !H_g_sess.su && H_order.order.chargerid != H_g_sess.userid) {
						H_view.orderListDetailShippingMask = true;
				}

				var temp = O_view.getOrderForm(H_sess[OrderDetailFormProc.PUB].type, H_sess[OrderDetailFormProc.PUB].carid, H_sess[OrderDetailFormProc.PUB].cirid, telcount, A_auth);
				H_items = array_merge(H_items, temp);
				H_view.compname = H_g_sess.compname;
				H_view.recogpostid = H_order.order.recogpostid;
				H_view.applypostid = H_order.order.applypostid;
				O_view.withoutorderview = true;
				O_view.makeOrderForm(O_order, O_model, O_telinfo_model, H_items, H_sess[OrderDetailFormProc.PUB], H_g_sess, totalTelCnt, Array(), H_sess[OrderDetailFormProc.PUB].H_product, H_view);
				var H_ordersub = H_order.sub;
				var A_nodisptel = Array();

				if ("B" == H_sess[OrderDetailFormProc.PUB].type) {
						var limit = undefined;
						var offset = 0;

						if ("" != H_sess[OrderDetailFormProc.PUB].limit_d) {
								limit = H_sess[OrderDetailFormProc.PUB].limit_d;
						}

						if ("" != H_sess[OrderDetailFormProc.PUB].offset) {
								offset = H_sess[OrderDetailFormProc.PUB].offset - 1;
						}

						if ("" != limit) //処理前の電話番号リスト作成
								//必要な部分だけ切り取り
								//処理後の電話番号リスト作成
								//画面に表示されない電話番号リスト作成
								//表示用にテンプレートに渡す
								{
										var A_beftel = Array();

										for (var H_subbef of Object.values(H_order.sub)) {
												A_beftel.push(H_subbef.telno);
										}

										H_ordersub = H_order.sub.slice(limit * offset, limit);
										var A_afttel = Array();

										for (var H_subaft of Object.values(H_ordersub)) {
												A_afttel.push(H_subaft.telno);
										}

										A_nodisptel = array_diff(A_beftel, A_afttel);
										H_view.A_nodisptel = A_nodisptel;
								}
				}

				var H_def = O_view.makeOrderDefault(H_g_sess, H_sess, O_model, H_view, H_order, H_ordersub);
				H_view.O_OrderFormUtil.setDefaultsWrapper(H_def);

				if ("B" == H_def.ordertype) //ページリンクの生成
						{
								H_view.bulkplan = H_def.bulkplan;
								H_view.page_link = O_order.getPageLink(H_order.bulkcnt, H_sess[OrderDetailFormProc.PUB].limit_d, H_sess[OrderDetailFormProc.PUB].offset);
						}

				if (H_sess[OrderDetailFormProc.PUB].telinfo.length > 0) //電話情報のデフォルト値作成、セット
						//電話詳細情報の電話番号表示部分作成
						//電話詳細情報のMNPアラート表示部分作成
						//電話の違約金表示部分作成
						{
								var H_telinfo_separated = O_telinfo_view.separateTelInfo(H_sess[OrderDetailFormProc.PUB].telinfo);
								H_view.O_OrderFormUtil.setDefaultsWrapper(H_telinfo_separated);
								H_view.teldisplay = O_view.makeTelInfoDisplay(H_sess[OrderDetailFormProc.PUB].telinfo);
								H_view.mnpalert = O_view.makeTelInfoMNPAlert(H_sess[OrderDetailFormProc.PUB].telinfo);

								if (true == (-1 !== ["N", "Nmnp", "C", "S", "P", "Ppl", "Pdc", "Pop", "D"].indexOf(H_sess[OrderDetailFormProc.PUB].type))) //販売店受付後にユーザ側注文履歴で表示するため新規も追加 20100326miya
										{
												H_view.telpenalty = O_view.makeTelPenalty(H_sess[OrderDetailFormProc.PUB].telinfo);
										}
						}

				var H_hist_all = O_model.getOrderHistory(H_sess);

				if (H_order.order.chargerid == H_g_sess.userid) {
						O_view.userid_eq_chargerid = true;
				}

				O_view.freezeForm();
				O_view.setModel(O_model);
				O_view.makeFormStatic(H_g_sess, H_order, A_auth);
				O_view.assignBillView();
				O_view.assignBillLang();
				O_view.assignRegisterdBillData(H_order.order);
				O_view.displaySmarty(H_sess, A_auth, H_order, H_hist_all, H_g_sess);
		}

		__destruct() {
				super.__destruct();
		}

};