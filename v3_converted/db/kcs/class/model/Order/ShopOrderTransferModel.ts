//
//受注振替用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/08/03
//@uses ShopOrderDetail
//
//
//
//受注振替用Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/08/03
//

require("OrderUtil.php");

require("ShopOrderDetailModel.php");

require("MtDateUtil.php");

require("MtMailUtil.php");

//
//受注情報を取得
//
//@author igarashi
//@since 2008/08/03
//
//@param $H_info
//@return hash
//
//
//現在の振替状態を取得する
//
//@author igarashi
//@since 2008/08/07
//
//@param $A_orderid
//
//@access public
//@return array
//
//
//振替が実行可能かチェックする
//
//@author igarashi
//@since 2008/08/07
//
//@param
//
//@access public
//@return boolean
//
//
//getTransferPreCount
//
//@author igarashi
//@since 2009/10/13
//
//@param mixed $H_orderid
//@access protected
//@return void
//
//
//振替実行<br>
//insert文を作成して実行する
//
//@author igarashi
//@since 2008/08/03
//
//@access public
//@return array
//
//
//makeInsertTransferchargeCount
//
//@author igarashi
//@since 2009/10/13
//
//@param mixed $H_material
//@param mixed $orderid
//@param mixed $shopid
//@access protected
//@return void
//
//
//振替元の処理台数を0にする
//
//@author igarashi
//@since 2009/10/13
//
//@param mixed $H_material
//@param mixed $orderid
//@access protected
//@return void
//
//
//振替のinsert文を作る<br>
//SQL生成時には毎回呼び出されるが、実処理は初めての振替の時のみ行われる<br>
//単独で外部から呼び出しての使用は考慮してない。updateTransferとセット。
//
//@author igarashi
//@since 2008/08/07
//
//@param $H_order 振替するように指定されたorderid
//@param $A_sql sql文
//@param $H_finish 既に処理されたorderid
//
//
//
//order_tbに全振替実行済みと記録する
//
//@author igarashi
//@since 2008/11/6
//
//@param $orderid
//
//@access public
//@return string
//
//
//updateOrderReTransferFlag
//振替元、振替済みからの振替の処理
//@author web
//@since 2018/03/22
//
//@param mixed $orderid
//@access public
//@return void
//
//
//振替通知メール用情報を取得して送信する
//
//@author igarashi
//@since 2008/10/01
//
//@param $H_g_sess
//@param $H_sess
//
//@access public
//@return boolean
//
//
//メールの内容を取得して返す
//
//@author igarashi
//@since 2008/10/02
//
//@param $H_g_sess
//@param $H_sess
//@param $H_mail
//
//@access protected
//@return hash
//
//
//多重振替の際、過去に通過した販売店へ振替えない様にチェックする
//
//@author igarashi
//@since 2008/10/01
//
//@param $H_sess
//@param $H_permit
//
//@access public
//@return hash
//
//
//getDeleteTransferTargetShop
//
//@author igarashi
//@since 2009/10/14
//
//@param mixed $H_order
//@param mixed $level
//@access protected
//@return void
//
//
//makeDeleteTransferCount
//
//@author igarashi
//@since 2009/10/14
//
//@param mixed $H_target
//@param mixed $orderid
//@access protected
//@return void
//
//
//makeUpdateTransferCount
//
//@author igarashi
//@since 2009/10/14
//
//@param mixed $H_target
//@param mixed $orderid
//@access protected
//@return void
//
//
//getFuncCO
//販売店権限の取得
//@author web
//@since 2018/03/22
//
//@param mixed $shopid
//@access private
//@return void
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/08/03
//
//@access public
//@return none
//
class ShopOrderTransferModel extends ShopOrderDetailModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess, ShopOrderTransferModel.SITE_SHOP);
	}

	getOrderInfo(H_info) {
		var sql = "SELECT " + "ord.status, stat.forshop, ord.ordertype, ord.postname, ord.ansdate, sub.expectdate, " + "sub.fixdate, ord.orderid, stat.forshop, car.carname, pat.ptnname, ord.postname, ord.transfer_type, " + "shmem.name, sub.expectdate, ord.ansdate, pact.compname, trns.fromshopid, trns.toshopid, trns.transfer_status, " + "ord.retransfer_from_shopid,ord.retransfer_to_shopid " + "FROM " + ShopOrderTransferModel.ORD_TB + " ord " + "INNER JOIN " + ShopOrderTransferModel.ORD_SUB_TB + " sub ON sub.orderid=ord.orderid " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "INNER JOIN carrier_tb car ON car.carid=ord.carid " + "INNER JOIN mt_order_pattern_tb pat ON pat.type=ord.ordertype AND ord.carid=pat.carid AND ord.cirid=pat.cirid " + "INNER JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + "INNER JOIN pact_tb pact ON ord.pactid=pact.pactid " + "LEFT JOIN mt_transfer_tb trns ON ord.orderid=trns.orderid " + "WHERE " + "ord.orderid in (" + H_info.join(", ") + ") " + "GROUP BY " + "ord.status, stat.forshop, ord.ordertype, ord.postname, ord.ansdate, sub.expectdate, " + "sub.fixdate, ord.orderid, stat.forshop, car.carname, pat.ptnname, ord.postname, ord.transfer_type, " + "shmem.name, sub.expectdate, ord.ansdate, pact.compname, trns.fromshopid, trns.toshopid, trns.transfer_status, " + "ord.retransfer_from_shopid,ord.retransfer_to_shopid " + "ORDER BY " + "ord.orderid ";
		return this.get_DB().queryHash(sql);
	}

	getTransferInfomation(H_info, shopid) {
		if (1 > H_info.length) {
			return undefined;
		}

		var sql = "SELECT " + "trns.orderid, ord.status, ord.transfer_type, max(trns.transfer_level) as transfer_level " + "FROM " + ShopOrderTransferModel.ORD_TB + " ord " + "INNER JOIN mt_transfer_tb trns ON ord.orderid=trns.orderid " + "WHERE " + "(ord.shopid IN (" + shopid.join(", ") + ") OR trns.toshopid IN (" + shopid.join(", ") + ")) " + "AND trns.orderid in (" + H_info.join(", ") + ") " + "GROUP BY " + "trns.orderid, ord.status, ord.transfer_type";
		return this.get_DB().queryHash(sql);
	}

	checkTransferPossible(H_g_sess, H_sess, H_trans, bReTrans = false) //振替できない受注がなければそれでいいじゃない
	//振替できないものはorderidでまとめる
	{
		H_fix.unperm = this.O_order.A_empty;
		H_fix.permit = this.O_order.A_empty;
		var A_temp = this.O_order.A_empty;
		A_temp = this.O_order.A_empty;

		for (var key in H_trans) //出荷済み以降は振替できない
		{
			var val = H_trans[key];

			if (this.O_order.st_sub_prcfin <= +val.status && this.O_order.st_loginpreq != +val.status) {
				H_fix.unperm[idx] = val;
				H_fix.unperm[idx].err = "\u51FA\u8377\u6E08(\u90E8\u5206)\u3001\u51E6\u7406\u6E08(\u90E8\u5206)\u4EE5\u964D\u306F\u632F\u66FF\u3067\u304D\u307E\u305B\u3093";
				A_temp.push(val.orderid);
				idx++;
				continue;
			}

			if (bReTrans) //再振替可能なやつ
				{
					if (H_g_sess.shopid == val.fromshopid && H_g_sess.shopid != val.retransfer_to_shopid) {
						H_fix.unperm[idx] = val;
						H_fix.unperm[idx].err = "\u65E2\u306B\u632F\u66FF\u3048\u3089\u308C\u3066\u3044\u307E\u3059";
						A_temp.push(val.orderid);
						idx++;
						continue;
					}
				} else //通常処理
				{
					if (H_g_sess.shopid == val.fromshopid) {
						H_fix.unperm[idx] = val;
						H_fix.unperm[idx].err = "\u65E2\u306B\u632F\u66FF\u3048\u3089\u308C\u3066\u3044\u307E\u3059";
						A_temp.push(val.orderid);
						idx++;
						continue;
					}
				}

			if ("part" == val.transfer_type) {
				H_fix.unperm[idx] = val;
				H_fix.unperm[idx].err = "\u90E8\u5206\u632F\u66FF\u304C\u884C\u308F\u308C\u305F\u53D7\u6CE8\u306E\u632F\u66FF\u306F\u51FA\u6765\u307E\u305B\u3093";
				A_temp.push(val.orderid);
				continue;
			}

			H_fix.permit.push(val);
		}

		if (0 == H_fix.unperm.length) {
			return H_fix;
		}

		A_temp = this.O_order.A_empty;
		var A_unperm = this.O_order.A_empty;

		for (var val of Object.values(H_fix.unperm)) {
			if (false == (undefined !== A_id[val.orderid])) {
				A_temp.push(val);
				A_id[val.orderid] = true;
				A_unperm.push(val.orderid);
			}
		}

		H_result.permitorder = this.O_order.A_empty;
		H_result.permit = this.O_order.A_empty;
		{
			let _tmp_0 = H_fix.permit;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];

				if (false == (-1 !== A_unperm.indexOf(val.orderid))) {
					H_result.permit.push(val);
					H_result.permitorder.push(val.orderid);
				}
			}
		}
		H_result.unperm = A_temp;
		return H_result;
	}

	getTransferPreCount(H_orderid) {
		var sql = "SELECT orderid, shopid, maccnt, acccnt " + "FROM " + "mt_transfer_charge_shop_tb " + "WHERE " + "orderid IN (" + H_orderid.join(", ") + ")";
		var H_temp = this.get_DB().queryHash(sql);
		sql = "SELECT orderid, transfer_level, toshopid " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid IN (" + H_orderid.join(", ") + ") " + "GROUP BY " + "orderid, transfer_level, toshopid";
		var H_box = this.get_DB().queryHash(sql);

		for (var key in H_box) {
			var val = H_box[key];

			if (false == H_level[val.orderid]) {
				H_level[val.orderid].shopid = val.toshopid;
				H_level[val.orderid].level = val.transfer_level;
			} else {
				if (H_level[val.orderid].level < val.tranfer_level) {
					H_level[val.orderid].shopid = val.toshopid;
					H_level[val.orderid].level = val.transfer_level;
				}
			}
		}

		for (var val of Object.values(H_temp)) {
			if (H_level[val.orderid].shopid == val.shopid) {
				H_result[val.orderid] = val;
			} else if (false == (undefined !== H_level[val.orderid].shopid)) {
				H_result[val.orderid].level = 0;
				H_result[val.orderid].shopid = val.shopid;
				H_result[val.orderid].orderid = val.orderid;
				H_result[val.orderid].maccnt = val.maccnt;
				H_result[val.orderid].acccnt = val.acccnt;
			}
		}

		return H_result;
	}

	retransferCancel(H_g_sess, H_trans, H_sess, H_orderid, H_retransfer_cancel_orderid = Array()) {
		var A_sql = this.O_order.A_empty;

		if (!!H_retransfer_cancel_orderid) {
			for (var key in H_retransfer_cancel_orderid) //キャンセル対象の振替のレベルを取得
			//振替キャンセルから持ってきた
			//キャンセルするぽよ
			//タイプ取得
			//振替件数管理テーブルから削除
			//振替元の台数に取消された分を足す
			{
				var orderid = H_retransfer_cancel_orderid[key];
				var level = 0;

				for (var t of Object.values(H_trans)) {
					if (orderid == t.orderid) {
						level = t.transfer_level;
						break;
					}
				}

				A_sql[orderid] = this.O_order.A_empty;
				A_sql[orderid].push("DELETE FROM mt_transfer_tb WHERE orderid=" + orderid + " AND transfer_level>=" + level);

				if (level > 0) //$A_sql["orderid"][] = "UPDATE " .self::ORD_TB. " SET transfer_type=NULL WHERE orderid=" .$orderid;
					{
						var sql_type = "SELECT true FROM mt_transfer_tb WHERE" + " orderid=" + orderid + " and transfer_level < " + level + " and transfer_type = 2 limit 1";
						var res = this.get_DB().queryOne(sql_type);

						if (res !== true) {
							var sql = "UPDATE " + ShopOrderTransferModel.ORD_TB + " SET transfer_type=NULL WHERE orderid=" + orderid;
							A_sql[orderid].push(sql);
						}
					}

				var H_target = this.getDeleteTransferTargetShop(orderid, level);
				A_sql[orderid].push(this.makeDeleteTransferCount(H_target, orderid, H_g_sess.shopid));
				A_sql[orderid].push(this.makeUpdateTransferCount(H_target, orderid, level));
			}
		}

		return A_sql;
	}

	makeTransferSQL(H_g_sess, H_trans, H_sess, H_orderid, H_retransfer_orderid = Array(), H_retransfer_cancel_orderid = Array()) //------------------------------------------------------------------------------------------
	//20180322伊達
	//販売店元、振替済みへの振替
	//販売元への振替の緊急対応
	//------------------------------------------------------------------------------------------
	{
		var H_finish = this.O_order.A_empty;
		var A_sql = this.O_order.A_empty;

		if (!!H_retransfer_orderid) {
			for (var key in H_retransfer_orderid) //振替元
			//振替先
			{
				var orderid = H_retransfer_orderid[key];
				A_sql[orderid] = Array();
				A_sql[orderid].push("UPDATE mt_order_tb SET" + " retransfer_from_shopid=" + this.get_DB().dbQuote(H_g_sess.shopid, "integer", true) + " WHERE orderid =" + this.get_DB().dbQuote(orderid, "integer", true));
				A_sql[orderid].push("UPDATE mt_order_tb SET" + " retransfer_to_shopid=" + this.get_DB().dbQuote(H_sess.SELF.shopselect, "integer", true) + " WHERE orderid =" + this.get_DB().dbQuote(orderid, "integer", true));
			}
		}

		if (this.O_order.A_empty != H_orderid) //登録済みの情報があればtransfer_levelを上げてinsert
			{
				var H_material = this.getTransferPreCount(H_orderid);
				var nowtime = MtDateUtil.getNow();

				if (0 < H_trans.length) //振替情報がなければ追加
					//更新と新規が混じってる可能性があるので、新規があればinsertする
					{
						for (var key in H_trans) {
							var val = H_trans[key];

							if (false == (-1 !== H_finish.indexOf(val.orderid))) {
								if (true == (-1 !== H_orderid.indexOf(val.orderid))) //detail_sort分まわす
									//for($idx = 0; $idx < $count; $idx++){
									//振替タイプがnullであれば値を入れる
									//振替先に処理台数を追加
									//振替元の処理台数を0件にする
									//消しておく
									{
										var A_id = this.getOrderDetailCount(val.orderid, "trans", val.transfer_level);

										for (var subid of Object.values(A_id)) //これ、何度もやる必要ないよ(´･ω･`)for外に出した
										//array_push($A_sql[$val["orderid"]], $this->updateOrderTransferFlag($val["orderid"]));
										{
											var sql = "INSERT INTO mt_transfer_tb " + "(orderid, ordersubid, fromshopid, toshopid, transfer_status, transfer_date, transfer_level, " + "transfer_type, detail_sort) " + "VALUES(" + this.get_DB().dbQuote(val.orderid, "int", true) + ", " + this.get_DB().dbQuote(subid.ordersubid, "int", true) + ", " + this.get_DB().dbQuote(H_g_sess.shopid, "int", true) + ", " + this.get_DB().dbQuote(H_sess.SELF.shopselect, "int", true) + ", " + this.get_DB().dbQuote(H_sess.SELF.saleform, "text", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(val.transfer_level + 1, "int", true) + ", " + this.get_DB().dbQuote(1, "int", true) + ", " + this.get_DB().dbQuote(subid.detail_sort, "int", true) + ")";

											if (false == Array.isArray(A_sql[val.orderid])) {
												A_sql[val.orderid] = this.O_order.A_empty;
											}

											A_sql[val.orderid].push(sql);
										}

										A_sql[val.orderid].push(this.updateOrderTransferFlag(val.orderid));
										A_sql[val.orderid].push(this.makeInsertTransferChargeCount(H_material, val.orderid, H_sess.SELF.shopselect, nowtime));
										A_sql[val.orderid].push(this.makeUpdateTransferChargeCount(H_material, val.orderid));
										A_sql[val.orderid].push(this.updateOrderReTransferFlag(val.orderid));
									}

								H_finish.push(val.orderid);
							}
						}

						A_sql = this.makeInsTransferSQL(H_g_sess, H_trans, H_sess, A_sql, H_finish, H_orderid);

						for (var val of Object.values(H_orderid)) {
							if (!(-1 !== H_finish.indexOf(val))) //振替先に処理台数を追加
								//振替元の処理台数を0件にする
								//振替元、振替済みへの振替の解消
								{
									A_sql[val].push(this.makeInsertTransferChargeCount(H_material, val, H_sess.SELF.shopselect, nowtime));
									A_sql[val].push(this.makeUpdateTransferChargeCount(H_material, val));
									A_sql[val].push(this.updateOrderReTransferFlag(val));
								}
						}
					} else //全てinsertの場合はこっち
					{
						A_sql = this.makeInsTransferSQL(H_g_sess, H_trans, H_sess, A_sql, H_finish, H_orderid);

						for (var val of Object.values(H_orderid)) //振替先に処理台数を追加
						//振替元の処理台数を0件にする
						//振替元、振替済みへの振替の解消
						{
							A_sql[val].push(this.makeInsertTransferChargeCount(H_material, val, H_sess.SELF.shopselect, nowtime));
							A_sql[val].push(this.makeUpdateTransferChargeCount(H_material, val));
							A_sql[val].push(this.updateOrderReTransferFlag(val));
						}
					}
			}

		var fp = fopen(KCS_DIR + "/log/transfer_debug.txt", "w");

		if (false !== fp) {
			for (var sqls of Object.values(A_sql)) {
				for (var log of Object.values(sqls)) {
					fwrite(fp, "[" + nowtime + "] " + log + "\n");
				}
			}

			fclose(fp);
		}

		return A_sql;
	}

	makeInsertTransferchargeCount(H_material, orderid, shopid, nowtime) {
		var sql = "INSERT INTO mt_transfer_charge_shop_tb (orderid, shopid, maccnt, acccnt, recdate) VALUES(" + this.get_DB().dbQuote(orderid, "int", true) + ", " + this.get_DB().dbQuote(shopid, "int", true) + ", " + this.get_DB().dbQuote(H_material[orderid].maccnt, "int", true) + ", " + this.get_DB().dbQuote(H_material[orderid].acccnt, "int", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ")";
		return sql;
	}

	makeUpdateTransferChargeCount(H_material, orderid) {
		var sql = "UPDATE mt_transfer_charge_shop_tb " + "SET " + "maccnt=" + this.get_DB().dbQuote(0, "int", true) + ", " + "acccnt=" + this.get_DB().dbQuote(0, "int", true) + " " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(H_material[orderid].shopid, "int", true);
		return sql;
	}

	makeInsTransferSQL(H_g_sess, H_trans, H_order, A_sql, H_finish, H_orderid) {
		for (var pkey in H_orderid) //作ったupdate以外に指定されたorderidがあればinsert
		{
			var pval = H_orderid[pkey];

			if (false == (-1 !== H_finish.indexOf(pval))) //detail_sort分まわす
				//for($idx = 0; $idx < $count; $idx++){
				{
					var A_id = this.getOrderDetailCount(pval, "all");

					for (var key in A_id) {
						var val = A_id[key];
						var sql = "INSERT INTO mt_transfer_tb " + "(orderid, ordersubid, fromshopid, toshopid, transfer_status, transfer_date, transfer_level, " + "transfer_type, detail_sort) " + "VALUES(" + this.get_DB().dbQuote(val.orderid, "int", true) + ", " + this.get_DB().dbQuote(val.ordersubid, "int", true) + ", " + this.get_DB().dbQuote(H_g_sess.shopid, "int,", true) + ", " + this.get_DB().dbQuote(H_order.SELF.shopselect, "int,", true) + ", " + this.get_DB().dbQuote(H_order.SELF.saleform, "text", true) + ", " + this.get_DB().dbQuote(MtDateutil.getNow(), "date", true) + ", " + this.get_DB().dbQuote(1, "int", true) + ", " + this.get_DB().dbQuote(1, "int", true) + ", " + this.get_DB().dbQuote(val.detail_sort, "int", true) + ")";

						if (false == Array.isArray(A_sql[val.orderid])) {
							A_sql[val.orderid] = this.O_order.A_empty;
						}

						A_sql[val.orderid].push(sql);
					}
				}

			if (true == Array.isArray(A_sql[pval])) {
				var upsql = this.updateOrderTransferFlag(pval);

				if ("" != upsql) {
					A_sql[pval].push(upsql);
				}
			}
		}

		return A_sql;
	}

	updateOrderTransferFlag(orderid) //現在の状態を取得
	//既に状態が記録されていたら上書きしない
	{
		var sql = "SELECT transfer_type FROM " + ShopOrderTransferModel.ORD_TB + " WHERE orderid=" + orderid;
		var flag = this.get_DB().queryOne(sql);
		sql = "";

		if (undefined == flag) {
			sql = "UPDATE " + ShopOrderTransferModel.ORD_TB + " " + "SET " + "transfer_type='all' " + "WHERE " + "orderid=" + orderid;
		}

		return sql;
	}

	updateOrderReTransferFlag(orderid) {
		var sql = "UPDATE " + ShopOrderTransferModel.ORD_TB + " SET " + " retransfer_from_shopid=null" + ",retransfer_to_shopid=null" + " WHERE" + " orderid=" + orderid;
		return sql;
	}

	sendOrderTransferMail(H_g_sess, H_sess, H_orderid) //振替先の販売店名、メンバー名、メアドを取得
	//振替元のメアドを取得
	{
		var sql = "SELECT " + "shop.name, shmem.name as memname, shmem.mail " + "FROM " + "shop_tb shop " + "INNER JOIN shop_member_tb shmem ON shop.memid=shmem.memid " + "WHERE " + "shop.shopid=" + H_sess.SELF.shopselect;
		H_mail.addr = this.get_DB().queryRowHash(sql);
		sql = "SELECT " + "shmem.mail " + "FROM " + "shop_tb shop " + "INNER JOIN shop_member_tb shmem ON shop.memid=shmem.memid " + "WHERE " + "shop.shopid=" + H_g_sess.shopid;
		var frommail = this.get_DB().queryOne(sql);
		H_mail.cont = this.getTransferMailContents(H_g_sess, H_sess, H_mail.cont, H_orderid);
		var O_mail = new MtMailUtil();
		O_mail.send(H_mail.addr.mail, H_mail.cont.message, frommail, H_mail.cont.subj, H_g_sess.shopname, H_mail.addr.name);
		return true;
	}

	getTransferMailContents(H_g_sess, H_sess, H_mail, H_orderid) {
		var A_contents = file(KCS_DIR + "/conf_sync/mail_template/v3transfer.txt");
		var H_ordinfo = this.getTransferMailInfo(H_orderid);

		if ("work" == H_sess.SELF.saleform) {
			var trnstype = "\u958B\u901A\u4F5C\u696D\u306E\u307F";
		} else if ("both" == H_sess.SELF.saleform) {
			trnstype = "\u958B\u901A\u4F5C\u696D\u3068\u58F2\u4E0A\u3068\u3082";
		}

		var O_grp = new GroupModel(O_db0);
		var lpmax = A_contents.length;

		for (var cnt = 0; cnt < lpmax; cnt++) {
			A_contents[cnt] = A_contents[cnt].replace(/FROMSHOP/g, H_g_sess.shopname);
			A_contents[cnt] = A_contents[cnt].replace(/TRANTYPE/g, trnstype);
			A_contents[cnt] = A_contents[cnt].replace(/ORDERCNT/g, H_orderid.length);
			A_contents[cnt] = A_contents[cnt].replace(/ORDERNO/g, H_ordinfo.join("\n"));
			A_contents[cnt] = A_contents[cnt].replace(/SHOPURL/g, this.getReturnURL(this.O_Sess.groupid, "shop", "M", O_grp.getGroupName(this.O_Sess.groupid)));
			A_contents[cnt] = A_contents[cnt].replace(/SYSTEMNAME/g, this.getSystemName(this.O_Sess.groupid, "JPN", "M"));
		}

		H_cont.subj = rtrim(A_contents.shift());
		H_cont.message = A_contents.join("");
		return H_cont;
	}

	checkDuplicateShopID(H_g_sess, H_sess, H_permit, A_shopid, bReTrans) //注文のエラーチェック用 20180320伊達
	//エラーを記録してく
	//エラーチェック
	//注文の振替先一覧を取得
	//振替対象を送る
	{
		if (this.O_order.A_empty == H_permit.permit) {
			return H_permit;
		}

		H_result.permit = this.O_order.A_empty;
		H_result.unperm = this.O_order.A_empty;
		H_result.reperm = this.O_order.A_empty;
		H_result.reperm_cancel = this.O_order.A_empty;
		var A_temp = this.O_order.A_empty;
		var check_order = Array();
		{
			let _tmp_1 = H_permit.permit;

			for (var key in _tmp_1) {
				var val = _tmp_1[key];
				A_temp.push(val.orderid);
			}
		}
		var sql = "SELECT " + "orderid, transfer_status " + "FROM " + "mt_transfer_tb " + "WHERE " + "toshopid IN (" + A_shopid.join(", ") + ")" + " AND orderid IN (" + A_temp.join(", ") + ")";
		var H_info = this.get_DB().queryKeyAssoc(sql);
		{
			let _tmp_2 = H_permit.permit;

			for (var key in _tmp_2) //初期化するよ
			{
				var val = _tmp_2[key];

				if (!(undefined !== check_order[val.orderid])) {
					check_order[val.orderid] = 0;
				}

				var shopsql = "SELECT shopid FROM mt_order_tb WHERE orderid=" + val.orderid;

				if (H_sess.SELF.shopselect == val.fromshopid) //振替元を指定できない
					{
						check_order[val.orderid] |= 1;
					} else if (this.get_DB().queryOne(shopsql) == H_sess.SELF.shopselect) //受注元の販売店を振替に指定している
					{
						check_order[val.orderid] |= 2;
					} else if (H_g_sess.shopid == val.fromshopid) //このショップは既に振替が行われている
					{
						check_order[val.orderid] |= 4;
					}

				if ("both" == H_sess.SELF.saleform) //フラグ立てる
					{
						if (true == (undefined !== H_info[val.orderid]) && "work" == H_info[val.orderid]) {
							check_order[val.orderid] |= 8;
						}
					}
			}
		}
		sql = "SELECT" + " orderid, toshopid,fromshopid" + " FROM " + " mt_transfer_tb " + " WHERE" + " orderid IN (" + A_temp.join(", ") + ")" + " GROUP BY" + " orderid,toshopid,fromshopid";
		var res = this.get_DB().queryHash(sql);
		var to_list = Array();

		for (var value of Object.values(res)) {
			if (!(undefined !== to_list[value.orderid])) {
				to_list[value.orderid] = Array();
			}

			to_list[value.orderid].push(value.toshopid);
			to_list[value.orderid].push(value.fromshopid);
		}

		for (var orderid in check_order) {
			var flag = check_order[orderid];

			if (flag & 1 && !bReTrans) {
				H_result.unperm.push({
					orderid: orderid,
					err: "\u632F\u66FF\u5143\u306E\u8CA9\u58F2\u5E97\u3092\u632F\u66FF\u5148\u306B\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093"
				});
			} else if (flag & 2 && !bReTrans) {
				H_result.unperm.push({
					orderid: orderid,
					err: "\u53D7\u6CE8\u5143\u306E\u8CA9\u58F2\u5E97\u3092\u632F\u66FF\u5148\u306B\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093"
				});
			} else if (flag & 4 && !bReTrans) {
				H_result.unperm.push({
					orderid: orderid,
					err: "\u65E2\u306B\u632F\u66FF\u6E08\u307F\u3067\u3059"
				});
			} else if (flag & 8) {
				H_result.unperm.push({
					orderid: orderid,
					err: "\u300C\u958B\u901A\u306E\u307F\u300D\u3067\u632F\u66FF\u3092\u53D7\u3051\u3066\u3044\u308B\u305F\u3081\u3001\u300C\u58F2\u4E0A\u3068\u3082\u300D\u306F\u9078\u629E\u3067\u304D\u307E\u305B\u3093"
				});
			} else //処理対象にする
				{
					if (flag == 0) //何もエラーがないなら振り返る
						{
							H_result.permit.push(orderid);
						} else //振替エラーがあるため色のみ変える
						{
							if (undefined !== to_list[orderid] && -1 !== to_list[orderid].indexOf(H_sess.SELF.shopselect)) //既に振替済みなら振替
								{
									H_result.reperm.push(orderid);
								} else //振替済みだが、別の販売店に振り替えたい場合はキャンセルしてから振替
								{
									H_result.reperm_cancel.push(orderid);
									H_result.permit.push(orderid);
								}
						}
				}
		}

		return H_result;
	}

	getDeleteTransferTargetShop(orderid, level) {
		var sql = "SELECT toshopid FROM mt_transfer_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " AND transfer_level>=" + this.get_DB().dbQuote(level, "int", true) + " GROUP BY toshopid";
		var H_result = this.get_DB().queryCol(sql);

		if (this.O_order.A_empty == H_result) {
			this.getOut().errorOut(19, "\u53D6\u6D88\u3055\u308C\u305F\u632F\u66FF\u53F0\u6570\u306E\u53D7\u3051\u53D6\u308A\u5148\u304C\u3042\u308A\u307E\u305B\u3093", false);
		}

		return H_result;
	}

	makeDeleteTransferCount(H_target, orderid, shopid) {
		var sql = "DELETE " + "FROM " + "mt_transfer_charge_shop_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " AND shopid!=" + this.get_DB().dbQuote(shopid, "int", true) + " AND shopid IN (" + H_target.join(", ") + ")";
		return sql;
	}

	makeUpdateTransferCount(H_target, orderid, level) //足したい台数を取得
	//振替元を取得(包括販売店じゃないなら自販売店でいい）
	{
		var sql = "SELECT " + "sum(maccnt) AS machine, " + "sum(acccnt) AS acce " + "FROM " + "mt_transfer_charge_shop_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " AND shopid IN (" + H_target.join(", ") + ")";
		var H_charge = this.get_DB().queryRowHash(sql);
		sql = "SELECT " + "fromshopid " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " AND transfer_level=" + this.get_DB().dbQuote(level, "int", true);
		var shopid = this.get_DB().queryOne(sql);
		sql = "UPDATE mt_transfer_charge_shop_tb " + "SET " + "maccnt=(maccnt + " + this.get_DB().dbQuote(H_charge.machine, "int", true) + "), " + "acccnt=(acccnt + " + this.get_DB().dbQuote(H_charge.acce, "int", true) + ") " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(shopid, "int", true);
		return sql;
	}

	getFuncCO(shopid) {
		var sql = "SELECT fncid FROM shop_fnc_relation_tb where shopid=" + this.get_DB().dbQuote(shopid, "integer", true);
		return this.get_DB().queryCol(sql);
	}

	__destruct() {
		super.__destruct();
	}

};