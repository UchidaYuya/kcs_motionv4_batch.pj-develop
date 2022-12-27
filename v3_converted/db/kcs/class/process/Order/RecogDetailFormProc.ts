//
//承認詳細画面ページプロセス
//
//更新履歴：<br>
//2008/09/04 宮澤龍彦 作成
//
//@uses OrderFormProc
//@package Order
//@subpackage Process
//@author miyazawa
//@since 2008/09/04
//
//
//error_reporting(E_ALL|E_STRICT);
//
//プロセス実装
//
//@uses OrderDetailFormProc
//@package Order
//@author miyazawa
//@since 2008/08/04
//

require("OrderDetailFormProc.php");

require("view/Order/RecogDetailFormView.php");

require("MtUniqueString.php");

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
//各ページのViewオブジェクト取得
//
//@author miyazawa
//@since 2008/04/17
//
//@access protected
//@return void
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
//_getFjpModel
//
//@author igarashi
//@since 2011/06/13
//
//@param mixed $A_auth
//@access protected
//@return void
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
class RecogDetailFormProc extends OrderDetailFormProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new RecogDetailFormView();
	}

	get_Model(H_g_sess: {} | any[], site_flg = OrderModelBase.SITE_USER) {
		return new OrderDetailFormModel(O_db0, H_g_sess, site_flg);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//不要セッション削除
	//セッション情報取得（グローバル）
	//関数集のオブジェクトの生成
	//modelオブジェクトの生成
	//ログインチェック
	//セッション情報取得（ローカル）
	//権限一覧取得
	//英語化権限 20090210miya
	//表示に必要なものを格納する配列を取得
	//一括プラン変更の除外・戻し処理
	//20141120date #33
	//20141120date  #33
	//20141120date  #33
	//2次元配列じゃないとダメなので無理矢理arrayっておく
	//一括プラン変更の全件数
	//一括プラン変更はマージ後のデータにlimitとoffsetを適用する必要がある
	//確認画面では全部表示
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
	//order_item_tbからフォーム表示項目を取得する
	//電話詳細情報入力フォーム作成
	//1は電話のユーザ設定項目
	//注文詳細をfreezeする
	//会社名設定
	//第二階層参照しなければ$H_g_sess["compname"]と同じ
	//登録部署を設定
	//申請部署を設定 20090226miya
	//フォームオブジェクトを生成してフォーム要素を入れる
	//注文フォームのデフォルト値作成、セット
	//$H_ordersubが抜けてた、なぜ？ 20100126miya
	//※第二階層部署なら成り代わり先の部署になる（未実装）
	//2011-08-08 確認画面から戻ってきたらセッションを消す
	//スタティック表示作成
	//権限追加 20091009miya
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var O_telinfo_view = this.get_OrderTelInfoView();
		O_view.clearUnderSession();
		var H_g_sess = O_view.getGlobalSession();
		var O_order = OrderUtil.singleton(H_g_sess);
		var O_model = this.get_Model(H_g_sess);
		var O_telinfo_model = this.get_OrderTelInfoModel(H_g_sess);
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();
		var A_auth = O_model.get_AuthIni();

		if ("ENG" == H_g_sess.language && "shop" != H_param.site) //ローカルセッション取り直し
			{
				O_view.setEnglish(true);
				H_sess = O_view.getLocalSession();
			}

		var O_unique = MtUniqueString.singleton();
		var H_view = O_view.get_View();

		if ("B" == H_sess[RecogDetailFormProc.PUB].type) {
			if ("" != H_sess.SELF.del) {
				O_model.updateBulkplan("del", H_sess[RecogDetailFormProc.PUB].orderid, H_sess.SELF.del);
			}

			if ("" != H_sess.SELF.recover) {
				O_model.updateBulkplan("recover", H_sess[RecogDetailFormProc.PUB].orderid, H_sess.SELF.recover);
			}
		}

		var H_order = O_model.getOrderInfo2(H_sess[RecogDetailFormProc.PUB].orderid, H_g_sess.language);
		MtTax.setDate(H_order.order.finishdate);
		H_order.order = O_model.calcTotalTax(H_order.order);
		H_order.order = O_model.calcReferTotal(H_order.order, H_order.sub);
		H_order.order = O_model.calcBillTotal(H_order.order, H_order.sub);
		H_order.order.usepoint = O_model.calcUsePoint(H_order.sub);
		H_order.order = O_model.setMoneyFormat([H_order.order], true);
		H_order.sub = O_model.setMoneyFormat(H_order.sub, false);
		H_order.bulkcnt = H_order.sub.length;

		var O_fjp = this._getFjpModel(A_auth);

		O_view.setfjpModelObject(O_fjp);
		O_model.setfjpModelObject(O_fjp);

		if ("B" == H_sess[RecogDetailFormProc.PUB].type && H_sess.SELF.submitName != RecogDetailFormView.NEXTNAME && H_sess.SELF.submitName != RecogDetailFormView.NEXTNAME_ENG) {
			var limit = undefined;
			var offset = 0;

			if ("" != H_sess[RecogDetailFormProc.PUB].limit) {
				limit = H_sess[RecogDetailFormProc.PUB].limit;
			}

			if ("" != H_sess[RecogDetailFormProc.PUB].offset) {
				offset = H_sess[RecogDetailFormProc.PUB].offset - 1;
			}

			if ("" != limit) {
				H_order.sub = H_order.sub.slice(limit * offset, limit);
			}
		}

		O_view.setOrderInfo(O_db0, H_g_sess, H_order);
		H_sess = O_view.getLocalSession();
		H_view.js = O_view.getHeaderJS();

		if ("ENG" == H_g_sess.language) {
			H_view.pankuzu_link = O_order.getPankuzuLinkEng(O_view.makePankuzuLinkHash(), "user", H_g_sess.language);
		} else {
			H_view.pankuzu_link = O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "user");
		}

		H_view.css = O_view.getCSS();
		H_view.smarty_template = "../MTOrder/" + O_model.getSmartyTemplate(H_sess[RecogDetailFormProc.PUB]);
		var H_pricedetail = Array();
		var H_accedetail = Array();
		H_pricedetail = O_model.getPriceDetailFromOrderData(H_order);
		H_accedetail = O_model.getRelatedProductFromOrderData(H_order);
		H_product.tel = H_pricedetail;
		H_product.acce = H_accedetail;
		H_product.purchase = O_view.convPurchaseId(H_sess[RecogDetailFormProc.PUB].carid, H_sess.SELF.purchace);
		H_product.pay_frequency = O_view.convPayCountId(H_sess.SELF.pay_frequency);
		var H_telinfo = O_view.makeTelInfoFromOrderData(H_order);
		H_telinfo = O_telinfo_model.checkOrderPenalty(H_g_sess.pactid, H_telinfo);

		if ("Nmnp" == H_sess[RecogDetailFormProc.PUB].type) {
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

			var H_telinfo_mnp = O_telinfo_model.checkTelInfoMNP(H_sess_mnp, H_g_sess, H_order.order.recogpostid);

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

		O_view.makeAnswerBox(O_model, H_sess);
		var H_items = O_model.getOrderItem(H_sess[RecogDetailFormProc.PUB]);
		var telcount = H_sess[RecogDetailFormProc.PUB].telcount;

		if ("M" == H_sess[RecogDetailFormProc.PUB].type) {
			telcount = 1;
		}

		var O_mptm = new ManagementPropertyTbModel();
		var H_telproperty = O_mptm.getManagementPropertyDataForRequired(H_g_sess.pactid, 1);
		[H_telitems, H_telitemrules] = O_telinfo_view.makeTelInfoForm2(H_telproperty, telcount, H_g_sess.language);

		if (H_telitems.length > 0) {
			H_items = array_merge(H_items, H_telitems);
		}

		H_view.deleteOrderDisplayTelDetaile = false;

		if (true == (-1 !== ["D", "A", "P"].indexOf(H_sess[RecogDetailFormProc.PUB].type)) && -1 !== A_auth.indexOf("fnc_delete_order_display_tel_detaile")) {
			H_view.deleteOrderDisplayTelDetaile = true;
		}

		var temp = O_view.getOrderForm(H_sess[RecogDetailFormProc.PUB].type, H_sess[RecogDetailFormProc.PUB].carid, H_sess[RecogDetailFormProc.PUB].cirid, telcount, A_auth);
		H_items = array_merge(H_items, temp);

		for (var key in H_items) //radio_childのinputdefをfrzにしてしまうと、ラジオボタンの値が上書きされてしまうため表示されなくなる
		{
			var val = H_items[key];

			if (H_items[key].inputtype != "radio_child") {
				H_items[key].inputdef = "frz";
			}
		}

		H_view.compname = H_g_sess.compname;
		H_view.recogpostid = H_order.order.recogpostid;
		H_view.applypostid = H_order.order.applypostid;
		O_view.withoutorderview = true;
		O_view.makeOrderForm(O_order, O_model, O_telinfo_model, H_items, H_sess[RecogDetailFormProc.PUB], H_g_sess, telcount, Array(), H_sess[RecogDetailFormProc.PUB].H_product, H_view, H_order.order.pactid);
		var H_def = O_view.makeOrderDefault(H_g_sess, H_sess, O_model, H_view, H_order, H_order.sub);

		if (!(undefined !== H_sess.SELF.csrfid)) {
			H_def.csrfid = O_unique.getInheritingUniqueId();
		}

		if ("B" == H_def.ordertype) //ページリンクの生成
			{
				H_view.bulkplan = H_def.bulkplan;
				H_view.page_link = O_order.getPageLink(H_order.bulkcnt, H_sess[RecogDetailFormProc.PUB].limit, H_sess[RecogDetailFormProc.PUB].offset);
			}

		H_view.O_OrderFormUtil.setDefaultsWrapper(H_def);

		if (H_sess[RecogDetailFormProc.PUB].telinfo.length > 0) //電話情報のデフォルト値作成、セット
			//電話詳細情報の電話番号表示部分作成
			//電話詳細情報のMNPアラート表示部分作成
			//電話の違約金表示部分作成
			{
				var H_telinfo_separated = O_telinfo_view.separateTelInfo(H_sess[RecogDetailFormProc.PUB].telinfo);
				H_view.O_OrderFormUtil.setDefaultsWrapper(H_telinfo_separated);
				H_view.teldisplay = O_view.makeTelInfoDisplay(H_sess[RecogDetailFormProc.PUB].telinfo);
				H_view.mnpalert = O_view.makeTelInfoMNPAlert(H_sess[RecogDetailFormProc.PUB].telinfo);

				if (true == (-1 !== ["N", "Nmnp", "C", "S", "P", "Ppl", "Pdc", "Pop", "D"].indexOf(H_sess[RecogDetailFormProc.PUB].type))) {
					H_view.telpenalty = O_view.makeTelPenalty(H_sess[RecogDetailFormProc.PUB].telinfo);
				}
			}

		var H_hist_all = O_model.getOrderHistory(H_sess);
		var curpostid = H_g_sess.postid;
		var curpostname = H_g_sess.postname;
		var H_actord = Array();
		var backsteps = false;

		if (H_sess.SELF.backName == RecogDetailFormView.BACKNAME || H_sess.SELF.backName == RecogDetailFormView.BACKNAME_ENG) //本来ならViewにbackNameを消すメソッドを作るべき
			{
				require("MtSession.php");

				var O_sess = MtSession.singleton();
				O_sess.clearSessionKeySelf("backName");
				backsteps = true;
			}

		if (H_view.O_OrderFormUtil.validateWrapper() == true && backsteps == false) //確認画面
			{
				if (H_sess.SELF.submitName == RecogDetailFormView.NEXTNAME || H_sess.SELF.submitName == RecogDetailFormView.NEXTNAME_ENG) //フォームをフリーズする
					//確認画面に入ったとき、承認履歴数をフォームにセット。hanashima20200302
					//完了画面
					{
						O_view.freezeForm();
						O_view.makeHistoryCount(H_hist_all.length);
					} else if (H_sess.SELF.submitName == RecogDetailFormView.RECNAME || H_sess.SELF.submitName == RecogDetailFormView.RECNAME_ENG) //確認画面に入ったときの承認履歴数と現在の承認履歴数が違う場合はエラー hanashima20200302
					{
						if (H_sess.SELF.history_count == H_hist_all.length) //承認部署取得
							//ルート部署が第2階層の販売店へ発注をする場合、承認先を第2階層部署の承認先に変更
							//最終承認部署かどうかチェック
							//ステータスアップデートSQL作成
							//完了画面でのorderid表示フラグ（下で最終承認時に発注メールを出すif文があるので、そこでtrueにする）20090109miya
							//承認時メール
							//パラメータセット
							//メール作成・送信
							//最終承認部署でなければ次の部署への申請メール
							//orderid_dispとかあっちこっちで制御するくらいならステータス撮り直して50だったら表示でいいと思う
							{
								O_unique.validate(H_sess.SELF.csrfid);
								var H_tmprecog = O_model.getRecogPost(H_g_sess, H_sess, curpostid, curpostname, H_actord);
								var H_recog = Array();

								if (H_tmprecog.postidto != undefined) {
									H_recog.postidto = H_tmprecog.postidto;
									H_recog.postname = H_tmprecog.postname;
								}

								if (RecogDetailFormProc.PRIVATE_RECOG_STAT == H_order.order.status) {
									H_recog.postidto = H_order.order.nextpostid;
								}

								require("model/Order/OrderModifyModel.php");

								var O_modify = new OrderModifyModel(O_db, H_g_sess, OrderModelBase.SITE_USER);
								O_modify.setfjpModelObject(O_fjp);
								H_recog.autorecog = O_modify.getAutoRecogCondition(H_g_sess.pactid, H_order.order.recogpostid, H_g_sess.userid, H_recog.postidto);
								var upd_sql = O_model.makeUpdateOrderStatusSQL(H_g_sess, H_sess, H_recog, A_auth, H_order);
								var hist_sql = O_model.makeInsertOrderHistorySQL(H_g_sess, H_sess, H_recog);

								if ("ok" == H_sess.SELF.answer && H_recog.autorecog) {
									O_modify.insertAutoRecogHistory(H_sess[RecogDetailFormProc.PUB].orderid, H_g_sess, H_sess, H_recog, false);
								}

								if (30 == H_sess.SELF.answer) {
									upd_sql += O_model.releaseExtensionNo(H_order);
								}

								O_model.execUpdateOrderStatus(upd_sql, hist_sql);
								var orderid_disp = false;
								var H_mailparam = {
									type: H_sess[RecogDetailFormProc.PUB].type,
									cirid: H_sess[RecogDetailFormProc.PUB].cirid,
									carid: H_sess[RecogDetailFormProc.PUB].carid,
									postname: curpostname,
									applypostname: H_order.order.postname,
									compname: H_view.compname,
									orderid: H_sess[RecogDetailFormProc.PUB].orderid,
									pactid: H_g_sess.pactid
								};

								if (H_recog.postidto != "" && H_recog.postidto != H_g_sess.postid && H_sess.SELF.answer == "ok") //自動承認はメール飛ばさない 20101129iga
									//却下メール
									{
										if (!H_recog.autorecog) //空白にしておけば共通メール設定のデフォルトメールアドレスが入る
											{
												var H_addr = Array();
												var from = "";
												var from_name = O_model.getSystemName(H_g_sess.groupid, H_g_sess.language, H_mailparam.pacttype);
												H_addr = O_model.getApplyMailSendList(H_g_sess.pactid, H_recog.postidto);
												var H_mailcontent = O_model.orderMailWrite("apply", H_mailparam, H_order.order.shopid, H_g_sess.language);
												O_model.sendOrderMail(H_mailcontent, H_addr, from, from_name);
											} else {
											O_model.settingOrderMail(O_view, H_g_sess, H_sess, A_auth, H_mailparam, H_order, H_view);
										}
									} else if (H_sess.SELF.answer == "30") //申請者と承認者のメールを取得
									//メールアドレスは入力時のものを使うようにする 20180309伊達
									//空白にしておけば共通メール設定のデフォルトメールアドレスが入る
									//申請部署に返す
									//申請者の言語取得 20090417miya
									{
										var H_apply_and_recog_mail = O_model.getApplyAndRecogMail(H_order.order.chargerid, H_g_sess.userid);
										H_apply_and_recog_mail.applymail = H_order.order.chargermail;
										H_addr = Array();
										from = "";
										from_name = O_model.getSystemName(H_g_sess.groupid, H_g_sess.language, H_mailparam.pacttype);

										if (H_apply_and_recog_mail.applymail != "" && H_apply_and_recog_mail.applyaccept == 1) {
											var H_mail_tmp = {
												to_name: strip_tags(H_order.order.chargername),
												to: H_apply_and_recog_mail.applymail
											};
											H_addr.push(H_mail_tmp);
										}

										var language = O_model.getUserLanguage(H_order.order.chargerid);
										H_mailcontent = O_model.orderMailWrite("cancel", H_mailparam, H_order.order.shopid, language);
										O_model.sendOrderMail(H_mailcontent, H_addr, from, from_name);
									} else //発注メール
									{
										if (H_sess.SELF.answer == "ok") //自動承認対応時クラス化20101129iga
											//最終承認部署で承認だったらorderidを表示する
											{
												O_model.settingOrderMail(O_view, H_g_sess, H_sess, A_auth, H_mailparam, H_order, H_view);
												orderid_disp = true;
											}
									}

								var checkstatus = O_model.getOrderInfo(H_sess[RecogDetailFormProc.PUB].orderid);

								if (50 <= checkstatus.order.status) {
									orderid_disp = true;
								}

								O_view.endOrderFormView(H_sess[RecogDetailFormProc.PUB].orderid, orderid_disp, H_order.order.shopid, H_g_sess.groupid);
								throw die();
							} else //承認エラー20200303hanashima
							//フォームをフリーズさせない
							{
								O_view.setApprovalErrorMessage();
								O_view.unfreezeForm();
							}
					} else //フォームをフリーズさせない
					{
						O_view.unfreezeForm();
					}
			} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.makeFormStatic(H_g_sess, H_order, A_auth);
		O_view.assignBillView();
		O_view.assignBillLang();
		O_view.assignRegisterdBillData(H_order.order);
		O_view.displaySmarty(H_sess, A_auth, H_order, H_hist_all, H_g_sess);
	}

	_getFjpModel(A_auth) {
		if (!this.O_fjp instanceof fjpModel) {
			return this.O_fjp = new fjpModel(RecogDetailFormProc.PUB, A_auth);
		}

		return this.O_fjp;
	}

	__destruct() {
		super.__destruct();
	}

};