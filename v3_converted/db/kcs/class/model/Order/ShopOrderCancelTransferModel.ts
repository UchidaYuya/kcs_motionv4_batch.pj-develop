//
//受注振替キャンセルModel
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
//受注振替キャンセルModel
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/08/03
//

require("OrderUtil.php");

require("ShopOrderDetailModel.php");

require("MtDateUtil.php");

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
//getChargeCount
//
//@author igarashi
//@since 2009/10/14
//
//@param mixed $H_order
//@access public
//@return void
//
//
//現在の振替状態を取得する<br>
//操作中の販売店に振替えられた受注のうち、<br>
//振替レベルの一番高いものだけ取得する
//
//@author igarashi
//@since 2008/08/17
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
//@since 2008/08/17
//
//@param
//
//@access public
//@return boolean
//
//
//振替を削除するsql文を作成する
//
//@author igarashi
//@since 2008/08/18
//
//@param $H_order
//
//@access public
//@return array
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
//振替削除対象の情報を削除前に確保しておく
//
//@author igarashi
//@since 2008/10/27
//
//@param $H_g_sess
//@param $H_sess
//
//@access public
//@return hash
//
//
//振替キャンセルメールを作成、送信する
//
//@author igarashi
//@since 2008/10/01
//
//@param mixed $H_g_sess
//@param mixed $H_flg
//@param mixed $H_data
//@access public
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
class ShopOrderCancelTransferModel extends ShopOrderDetailModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess, ShopOrderCancelTransferModel.SITE_SHOP);
	}

	getOrderInfo(H_info, shopid) {
		var sql = "SELECT " + "ord.status, stat.forshop, ord.ordertype, ord.postname, ord.ansdate, " + "sub.expectdate, sub.fixdate, ord.orderid, stat.forshop, car.carname, " + "pat.ptnname, ord.postname, shmem.name, sub.expectdate, ord.ansdate, " + "pact.compname, trns.fromshopid, trns.toshopid, trns.transfer_level, ord.shopid " + "FROM " + ShopOrderCancelTransferModel.ORD_TB + " ord " + "INNER JOIN " + ShopOrderCancelTransferModel.ORD_SUB_TB + " sub ON sub.orderid=ord.orderid " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "INNER JOIN carrier_tb car ON car.carid=ord.carid " + "INNER JOIN mt_order_pattern_tb pat ON pat.type=ord.ordertype AND ord.carid=pat.carid AND ord.cirid=pat.cirid " + "INNER JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + "INNER JOIN pact_tb pact ON ord.pactid=pact.pactid " + "LEFT JOIN mt_transfer_tb trns ON ord.orderid=trns.orderid " + "WHERE " + "ord.orderid in (" + H_info.join(", ") + ") " + "AND sub.ordersubid=0 " + "GROUP BY " + "ord.status, stat.forshop, ord.ordertype, ord.postname, ord.ansdate, " + "sub.expectdate, sub.fixdate, ord.orderid, stat.forshop, car.carname, " + "pat.ptnname, ord.postname, shmem.name, sub.expectdate, ord.ansdate, " + "pact.compname, trns.fromshopid, trns.toshopid, trns.transfer_level, ord.shopid " + "ORDER BY " + "ord.orderid ";
		var H_temp = this.get_DB().queryHash(sql);
		var A_id = this.O_order.A_empty;

		for (var val of Object.values(H_temp)) {
			if (false == (-1 !== A_id.indexOf(val.orderid))) {
				H_data[val.orderid] = val;
				A_id.push(val.orderid);
			} else //自販売店が振替えたものを使う
				{
					if (shopid == val.fromshopid) {
						H_data[val.orderid].fromshopid = val.fromshopid;
						H_data[val.orderid].transfer_level = val.transfer_level;
					}
				}
		}

		return H_data;
	}

	getChargeCount(H_order) {
		for (var val of Object.values(H_order)) {
			H_orderid[val.orderid] = val.orderid;
		}

		var sql = "SELECT orderid, shopid, maccnt, acccnt " + "FROM " + "mt_transfer_charge_shop_tb " + "WHERE orderid IN (" + H_orderid.join(", ") + ")";
		var H_temp = this.get_DB().queryHash(sql);

		for (var val of Object.values(H_temp)) {
			H_result[val.orderid][val.shopid] = val;
		}

		return H_result;
	}

	getTransferInfomation(H_info, shopid) {
		var sql = "SELECT " + "trns.orderid, trns.ordersubid, trns.transfer_level, trns.fromshopid, ord.status " + "FROM " + ShopOrderCancelTransferModel.ORD_TB + " ord " + "INNER JOIN mt_transfer_tb trns ON ord.orderid=trns.orderid " + "WHERE " + "trns.orderid IN (" + H_info[ShopOrderCancelTransferModel.PUB].orderid.join(", ") + ")" + " AND trns.transfer_level=(" + "SELECT " + "max(subtr.transfer_level) " + "FROM " + "mt_transfer_tb subtr " + "WHERE " + "(subtr.fromshopid IN (" + shopid.join(", ") + ") OR subtr.toshopid IN (" + shopid.join(", ") + "))" + " AND subtr.orderid IN (" + H_info[ShopOrderCancelTransferModel.PUB].orderid.join(", ") + ")) ";
		return this.get_DB().queryHash(sql);
	}

	checkCancelTransferPossible(H_trans, H_order, A_shopid) {
		if (0 >= H_trans.length) {
			var H_result;
			return H_result = this.O_order.A_empty;
		}

		var H_id = this.extractOrderColumn(H_trans, "orderid");
		H_result.unperm = this.O_order.A_empty;
		H_result.permit = this.O_order.A_empty;
		H_result.permitorder = this.O_order.A_empty;
		var idx = 0;

		for (var key in H_trans) //振替データのないものはキャンセルできない
		{
			var val = H_trans[key];

			if (false == (-1 !== H_id.indexOf(val.orderid))) {
				H_result.unperm[idx] = val;
				H_result.unperm[idx].err = "\u632F\u66FF\u3048\u3089\u308C\u3066\u3044\u307E\u305B\u3093";
				idx++;
			} else if (false == (-1 !== A_shopid.indexOf(val.fromshopid))) {
				H_result.unperm[idx] = val;
				H_result.unperm[idx].err = "\u632F\u66FF\u3048\u3089\u308C\u3066\u3044\u307E\u305B\u3093";
				idx++;
			} else if (this.O_order.st_sub_prcfin <= val.status && this.O_order.st_loginpreq != +val.status) {
				H_result.unperm[idx] = val;
				H_result.unperm[idx].err = "\u51E6\u7406\u6E08\u307F\u4EE5\u964D\u306F\u30AD\u30E3\u30F3\u30BB\u30EB\u3067\u304D\u307E\u305B\u3093";
				idx++;
			} else {
				H_result.permit.push(H_order[val.orderid]);
				H_result.permitorder.push(val.orderid);
			}
		}

		return H_result;
	}

	makeDeleteOrderTransfer(H_g_sess, H_order, H_charge, A_shopid) {
		var A_id = this.O_order.A_empty;

		for (var val of Object.values(H_order)) {
			A_id.push(val.orderid);
		}

		for (var val of Object.values(H_order)) //if(1 == $val["transfer_level"])	//	一つ目の振替しか対象にしかしてないので修正 20180326伊達
		//削除する振替先販売店idを取得
		//振替件数管理テーブルから削除
		//振替元の台数に取消された分を足す
		{
			A_sql[val.orderid] = this.O_order.A_empty;
			var sql = "DELETE " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid=" + val.orderid + " AND transfer_level>=" + val.transfer_level;
			A_sql[val.orderid].push(sql);
			{
				var sql_type = "SELECT true FROM mt_transfer_tb WHERE" + " orderid=" + val.orderid + " and transfer_level < " + val.transfer_level + " and transfer_type = 2 limit 1";
				var res = this.get_DB().queryOne(sql_type);

				if (res !== true) {
					sql = "UPDATE " + ShopOrderCancelTransferModel.ORD_TB + " SET transfer_type=NULL WHERE orderid=" + val.orderid;
					A_sql[val.orderid].push(sql);
				}
			}
			var H_target = this.getDeleteTransferTargetShop(val, val.transfer_level);
			A_sql[val.orderid].push(this.makeDeleteTransferCount(H_target, val.orderid, val.shopid));
			A_sql[val.orderid].push(this.makeUpdateTransferCount(H_target, val.orderid, val.transfer_level));
			A_sql[val.orderid].push("UPDATE mt_order_tb SET retransfer_from_shopid=null,retransfer_to_shopid=null WHERE orderid =" + val.orderid);
		}

		return A_sql;
	}

	getDeleteTransferTargetShop(H_order, level) {
		var sql = "SELECT toshopid FROM mt_transfer_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.orderid, "int", true) + " AND transfer_level>=" + this.get_DB().dbQuote(level, "int", true) + " GROUP BY toshopid";
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
	//
	//振替元を取得(包括販売店じゃないなら自販売店でいい）
	{
		var sql = "SELECT " + "sum(maccnt) AS machine, " + "sum(acccnt) AS acce " + "FROM " + "mt_transfer_charge_shop_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " AND shopid IN (" + H_target.join(", ") + ")";
		var H_charge = this.get_DB().queryRowHash(sql);
		sql = "SELECT " + "fromshopid " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " AND transfer_level=" + this.get_DB().dbQuote(level, "int", true);
		var shopid = this.get_DB().queryOne(sql);
		sql = "UPDATE mt_transfer_charge_shop_tb " + "SET " + "maccnt=(maccnt + " + this.get_DB().dbQuote(H_charge.machine, "int", true) + "), " + "acccnt=(acccnt + " + this.get_DB().dbQuote(H_charge.acce, "int", true) + ") " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " AND shopid=" + this.get_DB().dbQuote(shopid, "int", true);
		return sql;
	}

	readyTransferCancelMail(H_g_sess, H_sess) {
		var sql = "SELECT " + "trans.orderid, shop.shopid, trans.toshopid, trans.transfer_status, mem.mail, " + "pact.compname, shop.name, cir.cirname, car.carname, ord.ordertype, ptn.shoptypename " + "FROM " + "mt_transfer_tb trans " + "INNER JOIN " + ShopOrderCancelTransferModel.ORD_TB + " ord ON trans.orderid=ord.orderid " + "INNER JOIN shop_tb shop ON trans.toshopid=shop.shopid " + "INNER JOIN shop_member_tb mem ON shop.memid=mem.memid " + "INNER JOIN circuit_tb cir ON ord.cirid=cir.cirid " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "INNER JOIN pact_tb pact ON ord.pactid=pact.pactid " + "INNER JOIN mt_order_pattern_tb ptn ON ord.carid=ptn.carid AND ord.cirid=ptn.cirid AND ord.ordertype=ptn.type " + "WHERE " + "trans.orderid IN (" + H_sess.permitorder.join(", ") + ")" + " AND trans.transfer_level=1 " + "GROUP BY " + "trans.orderid, shop.shopid, trans.toshopid, trans.transfer_status, mem.mail, " + "pact.compname, shop.name, cir.cirname, car.carname, ord.ordertype, ptn.shoptypename";
		var H_addr = this.get_DB().queryHash(sql);
		return H_addr;
	}

	sendTransferCancelMail(H_g_sess, H_flg, H_data) //削除実行されなかったorderidを配列に入れる
	//メール成形
	{
		var A_ordid = this.O_order.A_empty;

		if (0 < H_flg.length) {
			for (var val of Object.values(H_flg)) {
				A_ordid.push(val.orderid);
			}
		}

		var H_addr = this.O_order.A_empty;

		for (var val of Object.values(H_data)) {
			if (false == (-1 !== A_ordid.indexOf(val.orderid))) {
				H_addr.push(val);
			}
		}

		for (var val of Object.values(H_addr)) {
			if (false == (undefined !== H_shop_mail[val.shopid].orderid)) {
				H_shop_mail[val.shopid].orderid = this.O_order.A_empty;
			}

			H_shop_mail[val.shopid].orderid.push(val.orderid);
			H_shop_mail[val.shopid].name = val.name;
			H_shop_mail[val.shopid].mail = val.mail;
		}

		if (0 < H_shop_mail.length) {
			for (var key in H_shop_mail) {
				var val = H_shop_mail[key];
				H_shop_mail[key].orderid = this.getTransferMailInfo(array_unique(H_shop_mail[key].orderid));
			}
		}

		var O_mail = new MtMailUtil();

		if (undefined == H_shop_mail) {
			return false;
		}

		for (var key in H_shop_mail) //メアドがなければ処理しない
		{
			var val = H_shop_mail[key];
			var message;
			var subject = message = undefined;

			if (undefined != val.mail) //本文の変数を置き換える
				//件名と本文を分ける
				{
					var A_mailbody = file(KCS_DIR + "/conf_sync/mail_template/v3transfer_cancel.txt");
					var O_grp = new GroupModel();
					var cnt = A_mailbody.length;

					for (var y = 0; y < cnt; y++) {
						A_mailbody[y] = A_mailbody[y].replace(/FROMSHOP/g, H_g_sess.shopname);
						A_mailbody[y] = A_mailbody[y].replace(/ORDERCNT/g, H_shop_mail[key].orderid.length);
						A_mailbody[y] = A_mailbody[y].replace(/ORDERNO/g, H_shop_mail[key].orderid.join("\n"));
						A_mailbody[y] = A_mailbody[y].replace(/SHOPURL/g, this.getReturnURL(this.O_Sess.groupid, "shop", "M", O_grp.getGroupName(this.O_Sess.groupid)));
						A_mailbody[y] = A_mailbody[y].replace(/SYSTEMNAME/g, this.getSystemName(this.O_Sess.groupid, "JPN", "M"));
					}

					subject = rtrim(A_mailbody.shift());
					message = join("", A_mailbody);

					if (undefined != subject && undefined != message) {
						O_mail.send(val.mail, message, frommail, subject, H_g_sess.shopname, val.name);
					}
				}
		}
	}

	__destruct() {
		super.__destruct();
	}

};