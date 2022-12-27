//
//受注ステータス一括更新Proc
//
//更新履歴：<br>
//2008/08/03 igarashi 作成
//
//@uses ProcessBaseHtml
//@package Order
//@subpackage Process
//@author igarashi
//@since 2008/08/07
//
//
//error_reporting(E_ALL|E_STRICT);
//
//受注ステータス一括更新Proc
//
//@uses OrderFormProcBase
//@package Order
//@author igarashi
//@since 2008/08/07
//

require("process/Order/ShopOrderDetailProcBase.php");

require("model/Order/ShopOrderChangeStatusModel.php");

require("view/Order/ShopOrderChangeStatusView.php");

require("view/Order/BillingViewBase.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/08/07
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author igarashi
//@since 2008/08/07
//
//@access protected
//@return void
//
//
//各ページのModelオブジェクト取得
//
//@author igarashi
//@since 2008/08/07
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
//@since 2008/08/03
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
//デストラクタ
//
//@author igarashi
//@since 2008/08/07
//
//@access public
//@return void
//
class ShopOrderChangeStatusProc extends ShopOrderDetailProcBase {
	constructor(H_param: {} | any[] = Array()) //$this->debagmode = true;
	{
		super(H_param);
	}

	get_View() {
		return new ShopOrderChangeStatusView();
	}

	get_Model(H_g_sess: {} | any[], flg = OrderModelBase.SITE_SHOP) {
		return new ShopOrderChangeStatusModel(O_db0, H_g_sess, flg);
	}

	doExecute(H_param: {} | any[] = Array()) //view作成
	//CGI取得
	//GlobalSESSION取得
	//LocalSESSION取得
	//model作成
	//権限一覧を取得
	//統括販売店は配下の販売店も拾う
	//統括販売店なら下位の販売店も拾う
	//振替先販売店を取得
	//formの初期値を取得
	//cssを取得
	//パンクズリンク取得
	//
	//form作成
	//
	//振替で指定可能なステータスを取得
	//販売店メンバーを取得
	//form作る
	//
	//表示用情報取得
	//
	//SESSIONに保存済みなら再取得はしません
	//オーダー情報取得
	//取得した情報をSESSIONに入れる
	//ステータス変更が可能なものと不可能なものに分ける
	//ステータス変更が可能な受注のorderidだけ別配列にしとく
	//
	//改番処理を行う
	//
	//削除する
	//削除する
	//会社に資産管理権限があるか
	//入力チェック
	//memberidからmembernameへ
	//更新ボタンが押されたら更新処理
	//表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalShopSession();
		var H_sess = O_view.getLocalSession();
		var O_model = this.get_Model(H_g_sess);
		var billView = new BillingViewBase();
		O_model.setBillView(billView);
		var A_auth = O_model.get_AuthIni();
		H_view.flg.unify = O_model.checkUnifyShop(H_g_sess, H_g_sess.shopid);

		if (H_view.flg.unify) {
			var A_shopid = O_model.getChildShopID(H_g_sess, H_view.flg.unify, true);
			A_shopid = Object.keys(A_shopid);
		} else {
			A_shopid = [H_g_sess.shopid];
		}

		H_view.transhop = O_model.getTransfer(A_shopid, H_g_sess.shopid);
		H_view.default = O_view.getDefaultForm();
		H_view.js = O_view.getHeaderJS();
		H_view.pankuzu_link = this.O_order.getPankuzuLink(O_view.makePankuzuLinkHash(), "shop");
		H_form.status = O_model.getSelectStatus(true);
		H_form.shopmem = O_model.getShopMember(H_g_sess.shopid, true);
		O_view.makeShopOrderChangeStatusForm(H_form);
		var H_order = O_model.getOrderInfoLump(H_sess[ShopOrderChangeStatusProc.PUB].orderid);
		O_view.setSessionOrderInfo("result", H_order);
		var H_result = O_model.checkChangeStatPossible(H_order, H_sess.SELF);
		var A_errmsg = O_model.checkInputExpectDate(H_sess.SELF);
		H_view.permit = H_result.permit;
		H_view.unperm = H_result.unperm;
		var unperm_list1 = Array();
		var unperm_list2 = Array();
		var H_permit = H_result.permitorder;
		{
			let _tmp_0 = H_view.permit;

			for (var key in _tmp_0) //取り消し以降は何もしない
			//改番元の番号が存在している？
			{
				var val = _tmp_0[key];

				if (val.status >= this.O_order.st_delete) {
					continue;
				}

				if (val.machineflg == false) {
					continue;
				}

				if (O_model.checkKaibanOrderByTelno(val.orderid, val.telno) == false) {
					continue;
				}

				if (val.ordertype == this.O_order.type_mnp) {
					if (val.status < this.O_order.st_sub_prcfin) //処理済前は前のキャリアを使用
						//もしかして元キャリアがNULLですか(エラー画面出したほうがいいかも)
						{
							var carid = O_model.getOrderFormercarid(val.orderid, val.telno);

							if (is_null(carid)) {
								carid = val.carid;
							}
						} else //処理済は今のキャリアを使用
						{
							carid = val.carid;
						}
				} else {
					carid = val.carid;
				}

				if (O_model.checkTelnoExists(val.pactid, carid, val.telno) == false) {
					unperm_list1.push(key);
					continue;
				}

				if (O_model.checkKaibanTelnoExistsByTelno(val.orderid, val.pactid, val.carid, val.telno) == true) {
					unperm_list2.push(key);
					continue;
				}
			}
		}

		for (var key in unperm_list1) //orderid削除
		//削除
		{
			var value = unperm_list1[key];
			H_view.unperm.push({
				orderid: H_view.permit[value].orderid,
				info: H_view.permit[value],
				err: "\u96FB\u8A71\u7BA1\u7406\u306B\u6539\u756A\u5143\u306E\u756A\u53F7\u304C\u3042\u308A\u307E\u305B\u3093"
			});

			for (var pkey in H_permit) {
				var pvalue = H_permit[pkey];

				if (pvalue == H_view.permit[value].orderid) {
					delete H_permit[key];
					break;
				}
			}

			delete H_view.permit[value];
		}

		for (var key in unperm_list2) //orderid削除
		//削除
		{
			var value = unperm_list2[key];
			H_view.unperm.push({
				orderid: H_view.permit[value].orderid,
				info: H_view.permit[value],
				err: "\u6539\u756A\u4E88\u5B9A\u306E\u756A\u53F7\u304C\u96FB\u8A71\u7BA1\u7406\u306B\u5B58\u5728\u3057\u3066\u3044\u307E\u3059"
			});

			for (var pkey in H_permit) {
				var pvalue = H_permit[pkey];

				if (pvalue == H_view.permit[value].orderid) {
					delete H_permit[key];
					break;
				}
			}

			delete H_view.permit[value];
		}

		if (0 < H_view.permit.length) {
			var asetlist = O_model.getAssetsAuth(H_view.permit);
		}

		if (0 < H_view.permit.length) //会社権限の受注完了メール送信デフォルトチェックの設定があるpactidを取得する hanashima 20201120
			//会社権限の受注完了メール送信グレーアウトの設定があるpactidを取得する hanashima 20201130
			//所属販売店管理者の権限取得
			//販売店の権限に受注完了メール送信デフォルトチェックの設定があるか確認する hanashima 20201130
			{
				var fncOrderFinishMailList = O_model.getAnyAuth(H_order, "fnc_order_finish_mail");
				var fncOrderFinishMailGrayOutList = O_model.getAnyAuth(H_order, "fnc_order_finish_mail_gray_out");
				O_model.createAuthObjectForShopAdmin(H_g_sess.shopid);
				var shopFncOrderFinishMail = O_model.checkShopAdminFuncId(H_g_sess.shopid, ShopOrderDetailModel.FNC_ORDERMAIL_SEND);
			}

		O_view.setDefaultsForm(O_model.getDefaultsForm(H_sess.SELF));
		O_view.setFormRule();
		O_view.validate(H_sess.SELF, errmsg);
		H_sess.SELF.memname = O_model.convShopMemberID(H_sess, H_form.shopmem);
		H_view.memname = H_sess.SELF.memname;

		if (true == (undefined !== H_sess.SELF.exitsub)) //2画面とかで許可されたorderがないのに来ちゃったらエラー
			//販売店担当者のメールアドレスを取得
			//order_tbのsql作成
			//$H_sql = $O_model->makeUpdateOrderSQL($H_sess["SELF"], $H_view["permit"]);
			//order_history_tbのsql作成
			//$H_sql = $O_model->makeInsertOrderHistorySQL($H_g_sess, $H_sess["SELF"], $H_permit, $H_sql);
			//tel_tbから電話を削除する
			//$H_Assets = $O_model->getAssetsAuth($H_view["permit"]);
			{
				if (this.O_order.A_empty == H_permit) {
					O_view.errorNonPermit();
				}

				H_mail.user = O_model.getHistoryMailAddr(H_permit);
				H_mail.shop = O_model.getShopMemberMailAddr(H_permit);
				var i = 0;
				{
					let _tmp_2 = H_view.permit;

					for (var key in _tmp_2) {
						var val = _tmp_2[key];

						if (50 <= +H_sess.SELF.lumpstatus && 220 > +val.status) //var_dump($H_sql["sql"]);
							//更新成功時だけ実行
							{
								var O_fjp = this._getFjpModel(val.pactid);

								O_model.setfjpModelObject(O_fjp);
								O_model.setRegistType(val.pactid, "shop");
								O_model.setShopUser(true);
								O_model.setPostID(O_model.checkPostID(val.postid, val.pactid, true));
								H_indiv.order = O_model.getOrderInfo(H_g_sess, val.orderid, H_g_sess.shopid);
								var H_t_sess = H_sess;
								H_t_sess.SELF.status = H_sess.SELF.lumpstatus;
								H_t_sess[ShopOrderChangeStatusProc.PUB].orderid = H_sess[ShopOrderChangeStatusProc.PUB].orderid[i];
								var H_sql = O_model.makeUpdateSQLCtrl(H_g_sess, H_t_sess, H_indiv);
								H_view.err = H_sql.err;
								H_view.upflg = O_model.execUpdateStatusHand(H_sql.sql, this.debagmode);

								if ("exec" == H_view.upflg.flg) {
									require("model/Order/ShopOrderSubStatusModel.php");

									var subModel = new ShopOrderSubStatusModel(O_db0, H_g_sess, OrderMOdelBase.SITE_SHOP);
									var data = Array();
									data.order = {
										orderid: val.orderid,
										ordertype: val.ordertype
									};
									subModel.updateTelcnt(H_sess, data, this.debagmode);
								}

								if (false == (-1 !== fncOrderFinishMailGrayOutList.indexOf(val.pactid)) && (true == (-1 !== fncOrderFinishMailList.indexOf(val.pactid)) || true == shopFncOrderFinishMail)) //mail本文作成〜送信まで
									{
										O_model.sendOrderFinishMail(H_sess.SELF, val, "lump");
									}

								if ("exec" == H_view.upflg.flg) //改番処理を入れる
									//新規以外はデータ取得をもう一度行う
									//$telno = array(implode(",",$H_sess["SELF"]["uptarget"] ));	//	キーが連番になってしまうのでやめた
									//改番の実行
									{
										var sess_telno = Array();
										{
											let _tmp_1 = H_indiv.order.machine;

											for (var iom_key in _tmp_1) {
												var iom_value = _tmp_1[iom_key];

												if (is_null(iom_value.kaiban_telno) == false) {
													sess_telno[iom_value.detail_sort] = iom_value.kaiban_telno;
												}
											}
										}

										if (Array.isArray(sess_telno) == true) {
											var detail_sorts = Object.keys(sess_telno);
										} else {
											detail_sorts = undefined;
										}

										var kaiban_teldetail = O_model.getTelDetailByKaiban(val.orderid, detail_sorts);

										if (false == !kaiban_teldetail && "exec" == H_view.upflg.flg) //更新用sql生成
											//更新成功時だけ実行
											{
												H_sql = O_model.makeUpdateSQLCtrl_kaiban(val.orderid, kaiban_teldetail, H_g_sess);
												H_view.err = H_sql.err;
												H_view.upflg = O_model.execUpdateStatusHand(H_sql.sql, this.debagmode);

												if ("exec" == H_view.upflg.flg) {
													var comment = "";

													for (var kt_key in kaiban_teldetail) {
														var kt_value = kaiban_teldetail[kt_key];

														if (!!comment) {
															comment += ",";
														}

														comment += kt_value.telno_view + "\u304B\u3089" + kt_value.kaiban_telno_view;
													}

													H_t_sess.shop_mng_comment = "\u6539\u756A:" + comment + "\u3092\u884C\u3044\u307E\u3057\u305F";
													O_model.writeShopMngLog(H_t_sess, "update_kaiban");
													delete H_t_sess.shop_mng_comment;
												} else {
													O_model.makeOrderErrLogSQL(H_indiv.order);
												}
											}

										delete H_sql;
									}
							}

						i++;
					}
				}
			} else {
			H_view.upflg.flg = "unexec";
		}

		O_view.displaySmarty(H_g_sess, H_view);
	}

	_getFjpModel(A_auth) {
		if (!this.O_fjp instanceof fjpModel) {
			return this.O_fjp = new fjpModel(ShopOrderChangeStatusProc.PUB, A_auth);
		}

		return this.O_fjp;
	}

	__destruct() {
		super.__destruct();
	}

};