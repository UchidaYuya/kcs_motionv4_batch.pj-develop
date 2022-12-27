//
//受注一覧ダウンロード
//
//@package Order
//@subpackage Model
//@filesource
//@author igaashi
//@uses ShopOrderDetailModel
//
//
//受注一覧ダウンロードModel
//
//@uses ShopOrderDetailModel
//@package Order
//@author igarashi
//@since 2008/10/07
//

require("model/Order/ShopOrderMenuModel.php");

require("model/Order/ShopOrderDetailModel.php");

require("Post.php");

//
//コンストラクタ
//
//@author igarashi
//@since 2008/10/07
//
//@param $O_db0
//@param $H_g_sess
//
//@access public
//@return void
//
//
//操作中の販売店の受注振替情報を取得
//
//@author igarashi
//@since 2009/02/20
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//getSecRootFuncPact
//
//@author igarashi
//@since 2009/12/17
//
//@param mixed $A_keyshop
//@access public
//@return void
//
//
//getPostRelShopInfo
//
//@author igarashi
//@since 2009/12/17
//
//@param mixed $A_keyshop
//@access public
//@return void
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//DBから取得した情報を表示順に並び替え、
//表示用に結合／編集を行う
//
//@author igarashi
//@since 2009/02/18
//
//@param mixed $H_sub
//@access public
//@return void
//
//
//表示用にデータを成形する
//
//@author igarashi
//@since 2008/10/13
//
//@param $key カラム名
//@param $type 発注種別
//@param $value カラムのデータ
//
//
//replacePoint
//ポイント入力が必要ない注文はポイントを空にする
//@author web
//@since 2018/08/09
//
//@param mixed $H_sub
//@param mixed $H_order
//@access public
//@return void
//
//
//compDLData
//
//@author igarashi
//@since 2008/00/00
//
//@param mixed $H_data
//@access public
//@return void
//
//
//携帯キャリアのポイントあたりのレートを取得する
//
//@author igarashi
//@since 2009/02/18
//
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//DL権限がないときはDL見せない(url直打ち対策)
//
//@author igarashi
//@since 2008/11/12
//
//@access public
//@return none
//
//
//getNoLoanBuyID
//
//@author igarashi
//@since 2009/03/27
//
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//getCarrierName
//
//@author igarashi
//@since 2009/10/14
//
//@access public
//@return void
//
//
//getCircuitName
//
//@author igarashi
//@since 2009/10/14
//
//@access public
//@return void
//
//
//getChargeCount
//
//@author igarashi
//@since 2009/10/16
//
//@param mixed $shopid
//@param mixed $unify
//@access public
//@return void
//
//
//getTransferToInfo
//
//@author igarashi
//@since 2009/10/16
//
//@param mixed $shopid
//@access public
//@return void
//
//
//getTransferFromInfo
//
//@author igarashi
//@since 2009/10/16
//
//@param mixed $shopid
//@access public
//@return void
//
//
//checkAuditTarget
//
//@author igarashi
//@since 2010/01/26
//
//@param mixed $colum
//@access private
//@return void
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/10/06
//
//@access public
//@return void
//
class ShopOrderDownloadModel extends ShopOrderMenuModel {
	static FNC_SECROOT = 60;

	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess, ShopOrderDownloadModel.SITE_SHOP);
	}

	getOrderTB(where, orderby) //"LEFT JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid ".
	//"LEFT JOIN post_rel_shop_info_tb prel ON (prel.postid=ord.postid AND prel.shopid=ord.shopid) ";
	//var_dump( $this->get_DB()->queryHash("explain analyze ".$ordsql.$where.$group));
	{
		var lang = this.O_billView.getLangLists("billhow");
		var ordsql = "SELECT " + "DISTINCT(ord.orderid), " + "ord.pacttype, " + "ord.finishdate, " + "ord.actordershopid, " + "ord.pactid, " + "ord.postid, " + "ord.carid, " + "ord.cirid, " + "ptn.ptnname, " + "ord.postname, " + "p.userpostid, " + "stat.forshop, " + "ord.ansdate, " + "ord.fixdate, " + "ord.chargername, " + "ord.applyprice, " + "ord.billtotal, " + "ord.billsubtotal, " + "pact.compname, " + "ord.pointradio, " + "ord.pointsum, " + "ord.pointsum as pointrate, " + "ord.point, " + "ord.parent, " + "ord.billradio, " + "ord.fee, " + "ord.datefrom, " + "ord.dateto, " + "ord.datechange, " + "ord.billaddress, " + "ord.note, " + "ord.sendhow, " + "ord.sendname, " + "ord.zip1, " + "ord.zip2, " + "ord.sendpost, " + "ord.addr1, " + "ord.addr2, " + "ord.building, " + "ord.sendtel, " + "shop.postcode as frompostcode, " + "ord.service, " + "hist.shopperson, " + "ord.transfer, " + "ord.shopnote, " + "ord.ordertype, " + "ord.ordertype as mnpcheck, " + "ord.status, " + "buy.buyselname, " + "ord.destinationcode, " + "ord.buyselid, " + "ord.misctype, " + "ord.salepost, " + "ord.completedate, " + "ord.webreliefservice, " + "ord.recogcode, " + "ord.pbpostcode, " + "ord.cfbpostcode, " + "ord.pbpostcode_first, " + "ord.cfbpostcode_first, " + "ord.ioecode, " + "ord.coecode, " + "ord.commflag, " + "ord.billname, " + "ord.billpost, " + "ord.receiptname, " + "ord.billzip1, " + "ord.billzip2, " + "ord.billaddr1, " + "ord.billaddr2, " + "ord.billbuild, " + "ord.billtel, " + "ord.tdbcode as ord_tdbcode, " + "CASE ord.billhow " + "WHEN 'bank' THEN '" + lang.bank.JPN + "' " + "WHEN 'cash' THEN '" + lang.cash.JPN + "' " + "WHEN 'card' THEN '" + lang.card.JPN + "' " + "WHEN 'misc' THEN '" + lang.misc.JPN + "' " + "END AS billhowview, " + "ord.billtotal2, " + "ord.division " + "FROM " + ShopOrderDownloadModel.ORD_TB + " ord " + "INNER JOIN mt_transfer_charge_shop_tb trch ON ord.orderid=trch.orderid " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "INNER JOIN mt_order_pattern_tb ptn ON (ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid) " + "INNER JOIN shop_tb shop ON ord.shopid=shop.shopid " + "LEFT JOIN post_tb p ON ord.postid=p.postid " + "LEFT JOIN (SELECT * FROM mt_order_history_tb " + "WHERE " + "(orderid, chdate) IN (SELECT orderid, MAX(chdate) FROM mt_order_history_tb GROUP BY orderid)\n\t\t\t\t) AS hist ON ord.orderid=hist.orderid " + "LEFT JOIN pact_tb pact ON ord.pactid=pact.pactid " + "LEFT JOIN buyselect_tb buy ON ord.buyselid=buy.buyselid ";
		var group = "GROUP BY " + "ord.orderid, " + "ord.finishdate, " + "ord.pacttype, " + "ord.actordershopid, " + "ord.pactid, " + "ord.postid, " + "ord.carid, " + "ord.cirid, " + "ptn.ptnname, " + "ord.postname, " + "p.userpostid, " + "stat.forshop, " + "ord.ansdate, " + "ord.fixdate, " + "ord.chargername, " + "ord.applyprice, " + "ord.billtotal, " + "ord.billsubtotal, " + "pact.compname, " + "ord.pointradio, " + "ord.pointsum, " + "pointrate, " + "ord.point, " + "ord.parent, " + "ord.billradio, " + "ord.fee, " + "ord.datefrom, " + "ord.dateto, " + "ord.datechange, " + "ord.billaddress, " + "ord.note, " + "ord.sendhow, " + "ord.sendname, " + "ord.zip1, " + "ord.zip2, " + "ord.sendpost, " + "ord.addr1, " + "ord.addr2, " + "ord.building, " + "ord.sendtel, " + "frompostcode, " + "ord.service, " + "hist.shopperson, " + "ord.transfer, " + "ord.shopnote, " + "ord.ordertype, " + "mnpcheck, " + "ord.status, " + "buy.buyselname, " + "ord.destinationcode, " + "ord.buyselid, " + "ord.misctype, " + "ord.salepost, " + "ord.completedate, " + "ord.webreliefservice, " + "ord.recogcode, " + "ord.pbpostcode, " + "ord.cfbpostcode, " + "ord.pbpostcode_first, " + "ord.cfbpostcode_first, " + "ord.ioecode, " + "ord.coecode, " + "ord.commflag, " + "ord.billname, " + "ord.billpost, " + "ord.receiptname, " + "ord.billzip1, " + "ord.billzip2, " + "ord.billaddr1, " + "ord.billaddr2, " + "ord.billbuild, " + "ord.billtel, " + "billhowview, " + "ord.billtotal2, " + "ord.division, " + "ord_tdbcode ";
		return this.get_DB().queryHash(ordsql + where + group);
	}

	getOrderSubTB(where, orderby) //1108
	{
		var subsql = "SELECT " + "sub.orderid, " + "sub.ordersubid, " + "sub.deliverydate, " + "sub.expectdate, " + "sub.fixdate, " + "sub.productname, " + "sub.property, " + "sub.number, " + "sub.memory, " + "sub.recovery, " + "stat.forsub, " + "sub.detail_sort, " + "shmem.name as memname, " + "sub.saleprice, " + "sub.saleprice as subbill, " + "sub.anspassprice, " + "sub.shoppoint, " + "sub.shoppoint2, " + "ord.telcnt, " + "max(ord.finishdate) as finishdate, " + "sub.stockflg, " + "sub.machineflg, " + "ord.division " + "FROM " + ShopOrderDownloadModel.ORD_TB + " ord " + "INNER JOIN " + ShopOrderDownloadModel.ORD_SUB_TB + " sub ON ord.orderid=sub.orderid ";

		if (preg_match("/det\\./", orderby)) //1108
			{
				subsql += "INNER JOIN " + ShopOrderDownloadModel.ORD_DET_TB + " det ON ord.orderid=det.orderid ";
			}

		subsql += "INNER JOIN mt_transfer_charge_shop_tb trch ON ord.orderid=trch.orderid " + "INNER JOIN mt_status_tb stat ON sub.substatus=stat.status " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "INNER JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "INNER JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + where + "GROUP BY " + "sub.orderid, " + "sub.ordersubid, " + "sub.deliverydate, " + "sub.expectdate, " + "sub.fixdate, " + "sub.productname, " + "sub.property, " + "sub.number, " + "sub.memory, " + "sub.recovery, " + "ord.status, " + "stat.forsub, " + "sub.detail_sort, " + "memname, " + "sub.machineflg, " + "sub.saleprice, " + "subbill, " + "sub.anspassprice, " + "sub.shoppoint, " + "sub.shoppoint2, " + "ord.telcnt, " + "sub.stockflg, " + "ord.recdate, " + "car.carid, " + "ptn.ptnname, ";

		if (preg_match("/det\\./", orderby)) {
			subsql += "det.contractor, ";
		}

		subsql += "ord.ansdate, " + "ord.carid, " + "ord.orderid, " + "ord.division " + orderby;
		return this.get_DB().queryHash(subsql);
	}

	getOrderTelDetailTB(where, orderby) //以下、ソート用
	{
		var detsql = "SELECT " + "det.orderid, " + "det.ordersubid, " + "det.telno_view, " + "det.simcardno, " + "det.serialno, " + "det.telusername AS username, " + "tel.username AS telusername, " + "area.arname, " + "det.employeecode, " + "tel.employeecode AS telemployeecode, " + "det.deliverydate, " + "det.expectdate, " + "det.registdate, " + "det.cirid AS bulkcirid, " + "det.contractor, " + "plan.planname, " + "packet.packetname, " + "det.number, " + "tel.contractdate, " + "tel.orderdate, " + "tel.text1, " + "tel.text2, " + "tel.text3, " + "tel.int1, " + "tel.int2, " + "det.freeword1, " + "det.freeword2, " + "det.freeword3, " + "det.freeword4, " + "det.option, " + "det.waribiki, " + "det.discounttel, " + "det.mnpno, " + "det.substatus, " + "stat.forshop, " + "shmem.name as memname, " + "det.detail_sort, " + "det.pay_frequency, " + "det.saleprice, " + "det.saleprice as subbill, " + "det.shoppoint, " + "det.shoppoint2, " + "det.stockflg, " + "det.machineflg, " + "det.extensionno, " + "det.telorderdate, " + "ord.division," + "det.mnp_enable_date " + "FROM " + ShopOrderDownloadModel.ORD_TB + " ord ";

		if (preg_match("/sub\\./", orderby)) {
			detsql += "INNER JOIN " + ShopOrderDownloadModel.ORD_SUB_TB + " sub ON ord.orderid=sub.orderid ";
		}

		detsql += "INNER JOIN " + ShopOrderDownloadModel.ORD_DET_TB + " det ON ord.orderid=det.orderid " + "INNER JOIN mt_transfer_charge_shop_tb trch ON ord.orderid=trch.orderid " + "INNER JOIN mt_status_tb stat ON det.substatus=stat.status " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "INNER JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "INNER JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + "LEFT JOIN plan_tb plan ON det.plan=plan.planid " + "LEFT JOIN packet_tb packet ON det.packet=packet.packetid " + "LEFT JOIN user_tb usr ON det.userid=usr.userid " + "LEFT JOIN area_tb area ON det.arid=area.arid " + "LEFT JOIN post_tb post ON det.postid=post.postid " + "LEFT JOIN tel_tb tel ON (det.telno=tel.telno AND ord.pactid=tel.pactid AND ord.carid=tel.carid) " + "LEFT JOIN tel_rel_assets_tb tra ON (tel.telno=tra.telno AND ord.pactid=tra.pactid AND ord.carid=tra.carid) " + "LEFT JOIN assets_tb asts ON asts.assetsid=tra.assetsid " + where + "GROUP BY " + "det.orderid, " + "det.ordersubid, " + "det.telno_view, " + "det.simcardno, " + "det.serialno, " + "det.telusername, " + "tel.username, " + "area.arname, " + "det.employeecode, " + "tel.employeecode, " + "det.deliverydate, " + "det.expectdate, " + "det.registdate, " + "bulkcirid, " + "det.contractor, " + "plan.planname, " + "packet.packetname, " + "det.number, " + "tel.contractdate, " + "tel.orderdate, " + "tel.text1, " + "tel.text2, " + "tel.text3, " + "tel.int1, " + "tel.int2, " + "det.freeword1, " + "det.freeword2, " + "det.freeword3, " + "det.freeword4, " + "det.option, " + "det.waribiki, " + "det.discounttel, " + "det.mnpno, " + "ord.status, " + "det.substatus, " + "stat.forshop, " + "ord.recdate, " + "car.carid, " + "ptn.ptnname, ";

		if (preg_match("/sub\\.ordersubid/", orderby)) {
			detsql += "sub.ordersubid, ";
		}

		if (preg_match("/sub\\.productname/", orderby)) {
			detsql += "sub.productname, ";
		}

		if (preg_match("/sub\\.property/", orderby)) {
			detsql += "sub.property, ";
		}

		if (preg_match("/sub\\.fixdate/", orderby)) {
			detsql += "sub.fixdate, ";
		}

		if (preg_match("/sub\\.expectdate/", orderby)) {
			detsql += "sub.expectdate, ";
		}

		if (preg_match("/sub\\.deliverydate/", orderby)) {
			detsql += "sub.deliverydate, ";
		}

		detsql += "subbill, " + "ord.telcnt, " + "memname, " + "ord.ansdate, " + "det.registdate, " + "ord.orderid, " + "det.detail_sort, " + "det.pay_frequency, " + "det.saleprice, " + "det.shoppoint, " + "det.shoppoint2, " + "det.stockflg, " + "ord.carid, " + "det.machineflg, " + "det.extensionno, " + "det.telorderdate, " + "ord.division," + "det.mnp_enable_date " + "order by det.detail_sort";
		orderby;
		return this.get_DB().queryHash(detsql);
	}

	getOrderTransfer(H_sess) {
		var H_shopid = Object.keys(this.getChildShopID(H_sess.shopid, H_sess.shopname, this.checkUnifyShop(H_sess.shopid), true));
		var sql = "SELECT trns.orderid, trns.detail_sort, transfer_status, shop.postcode " + "FROM mt_transfer_tb trns " + "INNER JOIN shop_tb shop ON trns.toshopid=shop.shopid " + "WHERE fromshopid IN (" + H_shopid.join(", ") + ") " + "ORDER BY orderid, transfer_level";
		var H_temp = this.get_DB().queryHash(sql);

		for (var val of Object.values(H_temp)) {
			H_trans[val.orderid][val.detail_sort].postcode = val.postcode;
			H_trans[val.orderid][val.detail_sort].trstat = val.transfer_status;
		}

		return H_trans;
	}

	getSecRootFuncPact(A_keyshop) {
		var sql = "SELECT " + "pactid, pactid " + "FROM " + "fnc_relation_tb " + "WHERE " + "fncid=" + ShopOrderDownloadModel.FNC_SECROOT;
		return this.get_DB().queryAssoc(sql);
	}

	getPostRelShopInfo(A_keyshop) {
		var sql = "SELECT " + "prel.postid, prel.pactid, prel.pactcode, prel.knowledge, prel.tdbcode " + "FROM " + "post_rel_shop_info_tb prel " + "WHERE " + "shopid IN (" + A_keyshop.join(", ") + ")";
		var H_prel = this.get_DB().queryKeyAssoc(sql);
		return H_prel;
	}

	mergeOrderSubAndDetail(H_sub, H_detail) {
		var A_m_detail;
		var A_result = this.O_order.A_empty;
		var A_mac = A_m_detail = this.O_order.A_empty;
		var max = H_sub.length;
		var detail = H_detail.length;

		for (var i = 0; i < max; i++) {
			for (var j = 0; j < detail; j++) //orderidとordersubidが同じなら結合
			{
				var hitflg = false;

				if (H_sub[i].orderid == H_detail[j].orderid && H_sub[i].ordersubid == H_detail[j].ordersubid) //処理していないorderidならDL用に保存
					{
						if (false == (-1 !== A_mac.indexOf(H_sub[i].orderid))) {
							A_mac.push(H_sub[i].orderid);
							A_result.push(array_merge(H_sub[i], H_detail[j]));
							A_det[H_detail[j].orderid] = this.O_order.A_empty;
							A_det[H_detail[j].orderid].push(H_detail[j].detail_sort);
							hitflg = true;
						} else {
							if (false == (-1 !== A_det[H_detail[j].orderid].indexOf(H_detail[j].detail_sort))) {
								A_result.push(array_merge(H_sub[i], H_detail[j]));
								A_det[H_detail[j].orderid].push(H_detail[j].detail_sort);
								hitflg = true;
							}
						}
					} else if (H_sub[i].orderid == H_detail[j].orderid && false == H_sub[i].machineflg) //処理していないsubidならDL用に保存
					{
						if (true == Array.isArray(A_acc[H_sub[i].orderid]) && false == (-1 !== A_acc[H_sub[i].orderid].indexOf(H_sub[i].ordersubid))) {
							A_acc[H_sub[i].orderid].push(H_sub[i].ordersubid);
							A_result.push(H_sub[i]);
							hitflg = true;
						} else {
							if (false == Array.isArray(A_acc[H_sub[i].orderid])) {
								A_acc[H_sub[i].orderid] = this.O_order.A_empty;
								A_acc[H_sub[i].orderid].push(H_sub[i].ordersubid);
								A_result.push(H_sub[i]);
								hitflg = true;
							}
						}
					}
			}
		}

		return A_result;
	}

	mergeOrderAndSub(H_order, H_sub) {
		var A_result = this.O_order.A_empty;

		for (var key in H_sub) {
			var val = H_sub[key];

			for (var okey in H_order) //orderidが同じで端末ならこっち
			{
				var oval = H_order[okey];

				if (val.orderid == oval.orderid && true == val.machineflg) //処理したことがなければ結合
					{
						if (false == Array.isArray(A_temp[oval.orderid])) //処理済みに追加
							{
								A_temp[oval.orderid] = this.O_order.A_empty;
								A_mac[oval.orderid] = this.O_order.A_empty;
								A_result.push(array_merge(oval, val));
								A_temp[oval.orderid].push(val.ordersubid);
								A_mac[oval.orderid].push(val.detail_sort);
							} else if (false == (-1 !== A_mac[oval.orderid].indexOf(val.detail_sort))) {
							A_result.push(array_merge(oval, val));
							A_mac[oval.orderid].push(val.detail_sort);
						}
					} else if (val.orderid == oval.orderid) {
					if (true == Array.isArray(A_temp[oval.orderid]) && false == (-1 !== A_temp[oval.orderid].indexOf(val.ordersubid))) //登録部署などがないので追加する
						{
							val.postname = oval.postname;
							val.userpostid = oval.userpostid;
							A_result.push(val);
							A_temp[oval.orderid].push(val.ordersubid);
						}
				}
			}
		}

		return A_result;
	}

	getSortArray() {
		var A_sort = ["orderid", "detail_sort", "pacttype", "actordershopid", "ord_tdbcode", "pactid", "telno_view", "username", "arname", "employeecode", "pactcode", "carid", "ptnname", "buyselname", "pay_frequency", "forshop", "ansdate", "deliverydate", "expectdate", "fixdate", "registdate", "cirname", "chargername", "contractor", "compname", "postname", "userpostid", "applyprice", "machineflg", "productname", "property", "planname", "packetname", "number", "chargecnt", "option", "waribiki", "service", "webreliefservice", "discounttel", "mnpcheck", "mnpno", "transfer", "datefrom", "dateto", "datechange", "point", "pointsum", "recovery", "billradio", "parent", "fee", "billaddress", "sendhow", "sendname", "sendpost", "zip1", "addr1", "addr2", "building", "sendtel", "note", "contractdate", "telorderdate", "text1", "text2", "text3", "int1", "int2", "anspassprice", "saleprice", "shoppoint", "subbill", "billtotal", "salepost", "destinationcode", "frompostcode", "topostcode", "transfer_status", "shopperson", "knowledge", "shopnote", "serialno", "simcardno", "stockflg", "freeword1", "freeword2", "freeword3", "freeword4", "extensionno", "recogcode", "recogname", "pbpostcode", "pbpostname", "cfbpostcode", "cfbpostname", "ioecode", "coecode", "commflag", "billhowview", "billname", "billpost", "receiptname", "billzip1", "billaddr1", "billaddr2", "billbuild", "billtel", "shoppoint2", "subbill2", "billtotal2", "division", "mnp_enable_date"];
		return A_sort;
	}

	sortColumn(H_g_sess, H_sub, H_trans, H_view, H_data) {
		var O_model = new ShopOrderDetailModel(O_db0, H_g_sess);
		var O_post = new Post();
		var A_sort = this.getSortArray();
		A_sort = array_flip(A_sort);
		var max = A_sort.length;
		var relkey = 0;
		var continueflg = false;
		var nowdate = this.getDateUtil().getToday();

		for (var allkey in H_sub) {
			var allval = H_sub[allkey];
			MtTax.setDate(allval.finishdate);

			if (true == allval.machineflg && H_tempval.orderid != allval.orderid) {
				var H_tempval = allval;
			}

			if ("" != allval.completedate) {
				var completedate = allval.completedate;
			}

			if (!(undefined !== miscData[allval.orderid])) {
				miscData[allval.orderid] = {
					recogcode: allval.recogcode,
					pbpostcode: allval.pbpostcode_first,
					cfbpostcode: allval.cfbpostcode_first,
					pbpostcode_full: allval.pbpostcode,
					cfbpostcode_full: allval.cfbpostcode,
					ioecode: allval.ioecode,
					coecode: allval.coecode
				};
			}

			var maskflg = false;

			if (undefined != completedate && nowdate > completedate) {
				maskflg = true;
			}

			var A_sortarray = this.getSortArray();

			for (var key of Object.values(A_sortarray)) //orderidが空なら次へ
			{
				if (!key) {
					continue;
				}

				var keyno = A_sort[key];

				if (undefined == keyno && "orderid" != key) {
					continue;
				}

				if (true == maskflg) {
					if (false == this.checkAuditTarget(key)) {
						H_sub[allkey][key] = "";
						H_tempval[key] = "";
					}
				}

				if ("A" == H_sub[allkey].ordertype && 0 == H_sub[allkey].detail_sort) {
					H_acce[H_sub[allkey].orderid] = true;
					continue;
				}

				if ("B" == H_sub[allkey].ordertype && "cirname" == key) //一括プラン変更の場合は各電話のキャリアを表示する
					{
						H_result[relkey][keyno] = this.convOutColumn(key, H_sub[allkey], H_data.circuit[H_sub[allkey].bulkcirid], H_data.circuit[H_tempval.bulkcirid]);
					} else if ("cirname" == key) {
					H_result[relkey][keyno] = this.convOutColumn(key, H_sub[allkey], H_data.circuit[H_sub[allkey].cirid], H_data.circuit[H_tempval.cirid]);
				} else {
					H_result[relkey][keyno] = this.convOutColumn(key, H_sub[allkey], H_sub[allkey][key], H_tempval[key]);
				}

				switch (key) {
					case "pacttype":
					case "pactid":
					case "arname":
					case "buyselname":
					case "pay_frequency":
					case "chargername":
					case "contractor":
					case "applyprice":
					case "compname":
					case "billtotal":
					case "billtotal2":
					case "salepost":
					case "destinationcode":
					case "note":
					case "sendhow":
					case "frompostcode":
					case "freeword1":
					case "freeword2":
					case "freeword3":
					case "freeword4":
					case "sendname":
					case "sendpost":
					case "addr1":
					case "addr2":
					case "building":
					case "sendtel":
					case "billname":
					case "billpost":
					case "receiptname":
					case "billaddr1":
					case "billaddr2":
					case "billbuild":
					case "billtel":
					case "text1":
					case "text2":
					case "text3":
					case "int1":
					case "int2":
						if (false == H_sub[allkey].machineflg or this.O_order.type_mis == H_sub[0].ordertype) {
							H_result[relkey][keyno] = H_tempval[key];
						}

						break;

					case "forshop":
						if (!H_sub[allkey].machineflg) {
							H_result[relkey][keyno] = H_sub[allkey].forsub;
						}

						break;

					case "point":
						if (1 == allkey) {
							if (this.O_order.type_acc == H_sub[0].ordertype) {
								H_result[relkey][keyno] = H_sub[0].point;
							}
						}

						break;

					case "number":
						if (this.O_order.type_mis != allval.ordertype) {
							H_result[relkey][keyno] = allval.number;
						} else {
							if (is_null(allval.telcnt)) {
								H_result[relkey][keyno] = allval.number;
							} else {
								H_result[relkey][keyno] = allval.telcnt;
							}
						}

						var number = H_result[relkey][keyno];
						break;

					case "telno_view":
					case "parent":
						if (false == H_sub[allkey].machineflg) {
							if (true == maskflg) {
								H_result[relkey][keyno] = this.O_order.makeUnderMaskTelno(H_tempval[key].replace(/[^0-9a-zA-Z]/g, ""), 6, "*");
							} else {
								H_result[relkey][keyno] = H_tempval[key];
							}
						} else {
							if (true == maskflg) {
								H_result[relkey][keyno] = this.O_order.makeUnderMaskTelno(H_sub[allkey][key].replace(/[^0-9a-zA-Z]/g, ""), 6, "*");
							} else {
								H_result[relkey][keyno] = H_sub[allkey][key];
							}
						}

						break;

					case "pactcode":
					case "knowledge":
						if (true == maskflg && "knowledge" == key) {
							H_result[relkey][keyno] = "";
						} else {
							if (true == H_sub[allkey].machineflg) {
								var prelpost = H_sub[allkey].postid;

								if (true == (undefined !== H_data.secfunc[H_sub[allkey].pactid])) {
									if (false == (undefined !== A_prelpost[H_sub[allkey].postid])) {
										prelpost = O_post.getTargetRootPostId(H_sub[allkey].pactid, H_sub[allkey].postid, "post_relation_tb", 2);
										A_prelpost[H_sub[allkey].postid] = prelpost;
									} else {
										prelpost = A_prelpost[H_sub[allkey].postid];
									}

									H_result[relkey][keyno] = H_data.prel[prelpost][key];
								}

								H_result[relkey][keyno] = H_data.prel[prelpost][key];
							} else {
								prelpost = H_tempval.postid;

								if (true == (undefined !== H_data.secfunc[H_tempval.pactid])) {
									if (false == (undefined !== A_prelpost[H_tempval.postid])) {
										prelpost = O_post.getTargetRootPostId(H_tempval.pactid, H_tempval.postid, "post_relation_tb", 2);
										A_prelpost[H_tempval.postid] = prelpost;
									} else {
										prelpost = A_prelpost[H_tempval.postid];
									}
								}

								H_result[relkey][keyno] = H_data.prel[prelpost][key];
							}
						}

						break;

					case "ord_tdbcode":
						H_result[relkey][keyno] = H_tempval[key];
						break;

					case "chargecnt":
						if (false == H_sub[allkey].machineflg) {
							H_result[relkey][keyno] = H_data.charge[H_tempval.orderid].maccnt;
							H_result[relkey][keyno] += "(" + H_data.charge[H_tempval.orderid].acccnt + ")";
						}

						H_result[relkey][keyno] = H_data.charge[H_tempval.orderid].maccnt;
						H_result[relkey][keyno] += "(" + H_data.charge[H_tempval.orderid].acccnt + ")";
						break;

					case "carid":
						H_result[relkey][keyno] = H_data.carrier[H_tempval.carid];
						break;

					case "ptnname":
						H_result[relkey][keyno] = H_tempval[key];

						if ("" != H_tempval.misctype) {
							H_result[relkey][keyno] += "(" + H_tempval.misctype + ")";
						}

						break;

					case "machineflg":
						if (true == H_sub[allkey].machineflg) {
							H_result[relkey][keyno] = "\u7AEF\u672B";
						} else {
							H_result[relkey][keyno] = "\u4ED8\u5C5E\u54C1";
						}

						break;

					case "expectdate":
						if ("1999/01/01 00:00:00" == H_sub[allkey][key]) {
							H_result[relkey][keyno] = "";
							H_result[relkey][A_sort.forsub] += "(\u5165\u8377\u5F85\u3061)";
						}

						break;

					case "stockflg":
						if (true === H_sub[allkey].stockflg) {
							H_result[relkey][A_sort.stockflg] = "\u53D6\u7F6E\u5728\u5EAB";
						} else {
							H_result[relkey][A_sort.stockflg] = "\u901A\u5E38\u5728\u5EAB";
						}

						break;

					case "username":
						if (true == H_sub[allkey].machineflg) {
							if ("" != H_sub[allkey].telusername) {
								H_result[relkey][keyno] = H_sub[allkey].telusername;
							} else {
								if (true == maskflg) {
									H_result[relkey][keyno] = "";
								} else {
									H_result[relkey][keyno] = H_sub[allkey].username;
								}
							}
						} else {
							if ("" != H_tempval.telusername) {
								H_result[relkey][keyno] = H_tempval.telusername;
							} else {
								if (true == maskflg) {
									H_result[relkey][keyno] = "";
								} else {
									H_result[relkey][keyno] = H_tempval.username;
								}
							}
						}

						break;

					case "employeecode":
						if (true == H_sub[allkey].machineflg) {
							if ("" != H_sub[allkey].telusername) {
								H_result[relkey][keyno] = H_sub[allkey].telemployeecode;
							} else {
								if (true == maskflg) {
									H_result[relkey][keyno] = "";
								} else {
									H_result[relkey][keyno] = H_sub[allkey].employeecode;
								}
							}
						} else {
							if ("" != H_tempval.telusername) {
								H_result[relkey][keyno] = H_tempval.telemployeecode;
							} else {
								if (true == maskflg) {
									H_result[relkey][keyno] = "";
								} else {
									H_result[relkey][keyno] = H_tempval.employeecode;
								}
							}
						}

						break;

					case "mnpcheck":
						if ("Nmnp" != H_sub[allkey].ordertype) {
							H_result[relkey][A_sort.mnpcheck] = "";
						} else {
							H_result[relkey][A_sort.mnpcheck] = "\u3059\u308B";
						}

						break;

					case "transcomp":
						if ("Tcp" != type && "Tpc" != type && "Tcc" != type) {
							H_result[relkey][keyno] == "";
						} else {
							H_result[relkey][A_sort.transfer] = H_sub[allkey].transfer.replace(/名義/g, "");
						}

						break;

					case "cirname":
						if ("B" == type) {
							delete H_result[relkey][A_sort.cirname];
						}

						break;

					case "circuitname":
						if (true == maskflg) {
							H_result[relkey][A_sort.cirname] = "";
						} else {
							if (undefined != allval[key] && "B" == type) {
								H_result[relkey][A_sort.cirname] = allval[key];
							}
						}

						break;

					case "anspassprice":
						if (true == H_sub[allkey].machineflg) {
							if (true == (-1 !== H_view.notloan.indexOf(H_sub[allkey].buyselid)) || 1 == H_sub[allkey].pay_frequency) {
								if (0 < H_sub[allkey].anspassprice) //$O_model->correctNumeric(($H_sub[$allkey]["anspassprice"] / ($this->O_Set->excise_tax + 1)), "up");
									{
										H_result[relkey][A_sort.anspassprice] = MtTax.priceWithoutTax(H_sub[allkey].anspassprice);
									}
							} else //$H_result[$relkey][$A_sort["anspassprice"]] = $H_sub[$allkey]["anspassprice"];
								{
									H_result[relkey][A_sort.anspassprice] = MtTax.priceWithoutTax(H_sub[allkey].anspassprice);
								}
						} else //($O_model->correctNumeric(($H_sub[$allkey]["anspassprice"] / ($this->O_Set->excise_tax + 1)), "up") * $H_sub[$allkey]["number"]);
							{
								H_result[relkey][A_sort.anspassprice] = MtTax.priceWithoutTax(H_sub[allkey].anspassprice) * H_sub[alkey].number;
							}

						break;

					case "saleprice":
						H_result[relkey][A_sort.saleprice] = H_sub[allkey][key] * H_sub[allkey].number;
						break;

					case "pointsum":
						if (0 < H_view.pntinfo[H_data.carrier[H_tempval.carid]].rate) {
							if (true == H_sub[allkey].machineflg) {
								H_result[relkey][A_sort[key]] = +(H_sub[allkey].shoppoint * H_sub[allkey].number);
								H_result[relkey][A_sort[key]] = H_result[relkey][A_sort[key]] * H_view.pntinfo[H_data.carrier[H_sub[allkey].carid]].rate;
							} else {
								H_result[relkey][A_sort[key]] = +(H_sub[allkey].shoppoint * H_sub[allkey].number);
								H_result[relkey][A_sort[key]] = H_result[relkey][A_sort[key]] * H_view.pntinfo[H_data.carrier[H_tempval.carid]].rate;
							}
						} else {
							H_result[relkey][A_sort.pointsum] = "";
						}

						break;

					case "subbill":
						var shoppoint = H_sub[allkey].shoppoint * number;

						if (0 > shoppoint) {
							shoppoint = 0;
						}

						var subbill = H_sub[allkey][key] * number - shoppoint;
						H_result[relkey][A_sort.shoppoint] = shoppoint;

						if (0 > subbill) {
							H_result[relkey][A_sort.subbill] = 0;
						} else {
							H_result[relkey][A_sort.subbill] = subbill;
						}

						break;

					case "topostcode":
						H_result[relkey][A_sort.topostcode] = H_trans[H_sub[allkey].orderid][H_sub[allkey].detail_sort].postcode;
						break;

					case "transfer_status":
						if ("work" == H_trans[H_sub[allkey].orderid][H_sub[allkey].detail_sort].trstat) {
							H_result[relkey][A_sort.transfer_status] = "\u958B\u901A\u4F5C\u696D";
						} else if ("both" == result) {
							H_result[relkey][A_sort.transfer_status] = "\u5168\u3066";
						} else {
							H_result[relkey][A_sort.transfer_status] = "";
						}

						break;

					case "zip1":
						if (true == maskflg) {
							H_result[relkey][A_sort.zip1] = "";
						} else {
							if (true == H_sub[allkey].machineflg) {
								H_result[relkey][A_sort.zip1] = H_sub[allkey].zip1 + "-" + H_sub[allkey].zip2;
							} else {
								H_result[relkey][A_sort.zip1] = H_tempval.zip1 + "-" + H_tempval.zip2;
							}
						}

						break;

					case "billzip1":
						if (true == maskflg) {
							H_result[relkey][A_sort.billzip1] = "";
						} else {
							if (true == H_sub[allkey].machineflg) {
								H_result[relkey][A_sort.billzip1] = H_sub[allkey].billzip1 + "-" + H_sub[allkey].billzip2;
							} else {
								H_result[relkey][A_sort.billzip1] = H_tempval.billzip1 + "-" + H_tempval.billzip2;
							}
						}

						break;

					case "detail_sort":
						if (true == (undefined !== H_acce[H_sub[allkey].orderid])) {
							H_result[relkey][A_sort.detail_sort] = H_sub[allkey].detail_sort - 1;
						} else {
							H_result[relkey][A_sort.detail_sort] = H_sub[allkey].detail_sort;
						}

						break;

					case "webreliefservice":
						if ("stay" == H_sub[allkey].webreliefservice) {
							H_result[relkey][A_sort.webreliefservice] = "\u73FE\u72B6\u5F15\u304D\u7D99\u304E";
						}

						break;

					case "commflag":
						if ("auto" == H_tempval.commflag) {
							H_result[relkey][A_sort.commflag] = "\u81EA\u52D5\u66F4\u65B0\u3059\u308B";
						} else if ("manual" == H_tempval.commflag) {
							H_result[relkey][A_sort.commflag] = "\u81EA\u52D5\u66F4\u65B0\u3057\u306A\u3044";
						}

						break;

					case "division":
						if (1 == H_tempval.division) {
							H_result[relkey][A_sort.division] = "\u696D\u52D9\u7528";
						} else if (2 == H_tempval.division) {
							H_result[relkey][A_sort.division] = "\u30C7\u30E2\u7528";
						}

						break;

					case "recogname":
						if (!(undefined !== A_recogcode[miscData[allval.orderid].recogcode]) && !!miscData[allval.orderid].recogcode) {
							var sql = "SELECT username FROM user_tb WHERE employeecode=" + this.get_DB().dbQuote(miscData[allval.orderid].recogcode, "text", false);
							A_recogcode[miscData[allval.orderid].recogcode] = this.get_DB().queryOne(sql);
						}

						H_result[relkey][A_sort.recogname] = A_recogcode[miscData[allval.orderid].recogcode];
						break;

					case "pbpostname":
					case "cfbpostname":
						var keyname = key.replace(/name$/g, "code");

						if (!allval[key]) {
							if (!(undefined !== A_postcode[miscData[allval.orderid][keyname]]) && !!miscData[allval.orderid][keyname]) {
								sql = "SELECT postname FROM post_tb WHERE userpostid=" + this.get_DB().dbQuote(miscData[allval.orderid][keyname], "text", false);

								if (undefined !== H_sub[allkey].pactid && is_numeric(H_sub[allkey].pactid)) {
									sql += " AND pactid=" + this.get_DB().dbQuote(H_sub[allkey].pactid, "int", true);
								} else if (undefined !== H_tempval.pactid && is_numeric(H_tempval.pactid)) {
									sql += " AND pactid=" + this.get_DB().dbQuote(H_tempval.pactid, "int", true);
								}

								A_postcode[miscData[allval.orderid][keyname]] = this.get_DB().queryOne(sql);
							}

							H_result[relkey][A_sort[key]] = A_postcode[miscData[allval.orderid][keyname]];
						} else {
							H_result[relkey][A_sort[key]] = allval[key];
						}

						H_result[relkey][A_sort[keyname]] = miscData[allval.orderid][keyname + "_full"];
						break;

					case "ioecode":
					case "coecode":
						H_result[relkey][A_sort[key]] = miscData[allval.orderid][key];
						break;

					case "shoppoint2":
						H_result[relkey][A_sort[key]] = +(H_sub[allkey][key] * H_sub[allkey].number);
						break;

					case "subbill2":
						if (!is_null(number) and number != 0) {
							var tempPrice = H_result[relkey][A_sort.subbill] / number;
							var tempTax = MtTax.taxPrice(tempPrice);
							var subbill2 = (tempPrice + tempTax) * number - H_result[relkey][A_sort.shoppoint2];
						} else {
							subbill2 = MtTax.priceWithTax(H_result[relkey][A_sort.subbill]) - H_result[relkey][A_sort.shoppoint2];
						}

						if (allval.carid == 1 && subbill2 < 0) {
							subbill2 = 0;
						}

						H_result[relkey][A_sort[key]] = subbill2;
						break;

					default:
						break;
				}
			}

			relkey++;
		}

		return H_result;
	}

	convOutColumn(key, H_info, value, masterdata) {
		var sep1 = "\t";
		var sep2 = "|";
		var sep3 = ":";
		var retcode = "\r\n";
		var result = value;

		switch (key) {
			case "orderid":
				result = str_pad(result, 10, "0", STR_PAD_LEFT);
				break;

			case "actordershopid":
				if (undefined != value) {
					result = "\u4EE3\u884C";
				} else if (false == H_info.machineflg) {
					if ("" != masterdata) {
						result = "\u4EE3\u884C";
					}
				}

				break;

			case "option":
			case "waribiki":
				if (undefined == value || "" == value) {
					break;
				}

				var A_temp = unserialize(value);

				if (false == A_temp) {
					break;
				}

				var A_keys = Object.keys(A_temp);
				var sql = "SELECT opid, opname FROM option_tb " + "WHERE opid IN (" + A_keys.join(", ") + ")";
				var A_opt = this.get_DB().queryKeyAssoc(sql);
				result = "";

				if ("N" == H_info.ordertype || "Nmnp" == H_info.ordertype) {
					for (var key in A_opt) {
						var val = A_opt[key];
						result += val + sep3;
					}
				} else {
					for (var key in A_opt) {
						var val = A_opt[key];

						if ("stay" == A_temp[key]) {
							var status = "\u5909\u66F4\u306A\u3057";
						} else if ("remove" == A_temp[key]) {
							status = "\u5916\u3059";
						} else if ("put" == A_temp[key]) {
							status = "\u3064\u3051\u308B";
						}

						result += val + sep3 + status + sep2;
					}
				}

				break;

			case "discounttel":
				if (true == H_info.machineflg) {
					var temp = unserialize(value);

					if (false != temp) {
						result = temp.join(sep2);
					} else {
						result = undefined;
					}
				} else {
					result = undefined;
				}

				break;

			case "pointradio":
				if ("specify" == value) {
					result = "";
				} else if ("nouse" == value) {
					result = "\u4F7F\u7528\u3057\u306A\u3044";
				} else if ("maximam" == value) {
					result = "\u53EF\u80FD\u306A\u9650\u308A";
				} else if ("point_liquidate" == value) {
					result = "\u30DD\u30A4\u30F3\u30C8\u5185\u6E05\u7B97";
				}

				break;

			case "billradio":
				if (false == H_info.machineflg) {
					result = masterdata;
				}

				if ("all" == result) {
					result = "\u4E00\u62EC\u8ACB\u6C42\u7D44\u8FBC\u307F";
				} else if ("sep" == result) {
					result = "\u5225\u8ACB\u6C42";
				} else {
					result = "";
				}

				break;

			case "memory":
			case "recovery":
				if ("do" == result) {
					result = "\u3059\u308B";
				} else if ("dont" == result) {
					result = "\u3057\u306A\u3044";
				} else {
					result = "";
				}

				break;

			case "billaddress":
			case "addr1":
			case "addr2":
			case "sendpost":
			case "knowledge":
			case "billaddr2":
				result = preg_replace("/\r\n/", "|", result);
				result = preg_replace("/\r/", "|", result);
				result = preg_replace("/\n/", "|", result);
				result = result.replace(/	/g, "|");

			case "shopnote":
			case "note":
				result = preg_replace("/\r\n/", "|", masterdata);
				result = preg_replace("/\r/", "|", result);
				result = preg_replace("/\n/", "|", result);
				result = result.replace(/	/g, "|");
				break;

			case "recdate":
			case "expectdate":
			case "registdate":
			case "deliverydate":
			case "fixdate":
			case "contractdate":
			case "orderdate":
				result = value;

				if (!!result) {
					result = result.replace(/\-/g, "/");
					result = result.replace(/\.[0-9].*\+09$/g, "");
					result = result.replace(/\+09$/g, "");
					result = result.replace(/ 00:00:00$/g, "");
				}

				break;

			case "ansdate":
			case "dateto":
			case "datefrom":
			case "datechange":
				result = masterdata.replace(/\-/g, "/");
				result = result.replace(/\.[0-9].*\+09$/g, "");
				result = result.replace(/\+09$/g, "");
				result = result.replace(/ 00:00:00$/g, "");
				break;

			case "circuitname":
				result = result.replace(/不明/g, "");
				break;

			case "cirname":
				if (false == H_info.machineflg) {
					result = masterdata.replace(/不明/g, "");
				} else {
					result = result.replace(/不明/g, "");
				}

				break;

			case "service":
				if (undefined == value || "" == value) {
					break;
				}

				A_temp = unserialize(value);

				if (false == A_temp) {
					break;
				}

				A_keys = Object.keys(A_temp);
				sql = "SELECT opid, opname FROM service_tb " + "WHERE opid IN (" + A_keys.join(", ") + ")";
				A_opt = this.get_DB().queryKeyAssoc(sql);
				result = "";

				if ("N" == H_info.ordertype || ("Nmnp" == H_info.ordertype || "C" == H_info.ordertype) || "S" == H_info.ordertype) {
					for (var key in A_opt) {
						var val = A_opt[key];
						result += val + sep3;
					}
				}

				break;

			case "default":
				break;
		}

		return result;
	}

	recalcBilltotal2(H_sub) {
		var temp = H_sub;
		var total = undefined;
		var orderid = undefined;

		for (var record of Object.values(temp)) {
			for (var key in record) {
				var val = record[key];

				if (key == 0) {
					orderid = val;
				}

				if (key == 109) {
					total[orderid] += val;
				}
			}
		}

		for (var key1 in temp) {
			var record = temp[key1];

			for (var key2 in record) {
				var val = record[key2];

				if (key2 == 0) {
					orderid = val;
				}

				if (key2 == 110) {
					H_sub[key1][key2] = total[orderid];
				}
			}
		}

		return H_sub;
	}

	replacePoint(H_sub, H_order) //各キャリア、回線種別、タイプにポイント入力があるかリストを作成する
	//各注文にて、ポイント入力のあるもの一覧を作る
	//ポイント入力がないものはポイント関連を空にする
	{
		var req = Array();
		var pointreq = Array();
		var sql = "SELECT" + " carid || '_' || cirid || '_' || type" + ",true" + " FROM mt_order_item_tb" + " WHERE" + " inputname='pointradio'";
		var point_check = this.get_DB().queryKeyAssoc(sql);
		var req_point = Array();

		for (var key in H_order) {
			var value = H_order[key];
			var check = value.carid;
			check += "_" + value.cirid;
			check += "_" + value.ordertype;

			if (undefined !== point_check[check]) {
				req_point[value.orderid] = true;
			}
		}

		var A_sort = this.getSortArray();
		A_sort = array_flip(A_sort);

		for (var key in H_sub) {
			var value = H_sub[key];
			var orderid = Math.round(value[A_sort.orderid]);

			if (!(undefined !== req_point[orderid])) {
				H_sub[key][A_sort.point] = "";
				H_sub[key][A_sort.pointsum] = "";
				H_sub[key][A_sort.shoppoint] = "";
				H_sub[key][A_sort.shoppoint2] = "";
			}
		}

		return H_sub;
	}

	compDLData(H_data) {
		var A_col = this.getSortArray();

		for (var key in H_data) {
			var val = H_data[key];

			for (var col of Object.values(A_col)) {
				if (false == (undefined !== val[col])) {
					H_data[key][col] = undefined;
				}
			}
		}
	}

	getPointRate(H_g_sess) {
		var O_model = new ShopOrderDetailModel(O_db0, H_g_sess);
		var sql = "SELECT carname, carid FROM carrier_tb " + "WHERE carid IN (" + this.O_order.A_mobilecarrier.join(", ") + ")";
		var A_carid = this.get_DB().queryKeyAssoc(sql);

		for (var key in A_carid) {
			var val = A_carid[key];
			H_rate[key] = O_model.getCarrierPointInfo(val);
		}

		return H_rate;
	}

	writeShopMngLog(H_g_sess, H_sess) {
		var O_model = new ShopOrderDetailModel(O_db0, H_g_sess);
		O_model.writeShopMngLog(H_sess, "download");
	}

	exitNotAuth() {
		this.getOut().errorOut(6, "\u53D7\u6CE8\u4E00\u89A7\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093");
	}

	getNoLoanBuyID(H_g_sess) {
		var O_model = new ShopOrderDetailModel(O_db0, H_g_sess);
		return O_model.getNotLoanBuyselID();
	}

	getCarrierName() //WHERE carid IN (" .implode(", ", $this->O_order->A_mobilecarrier). ")";
	{
		var sql = "SELECT carid, carname FROM carrier_tb";
		return this.get_DB().queryKeyAssoc(sql);
	}

	getCircuitName() {
		var sql = "SELECT cirid, cirname FROM circuit_tb WHERE carid IN (" + this.O_order.A_mobilecarrier.join(", ") + ")";
		return this.get_DB().queryKeyAssoc(sql);
	}

	getChargeCount(shopid, unify) {
		if (false == unify) {
			var sql = "SELECT orderid, maccnt, acccnt " + "FROM " + "mt_transfer_charge_shop_tb " + "WHERE " + "shopid=" + this.get_DB().dbQuote(shopid[0], "int", true);
		} else {
			sql = "SELECT orderid, sum(maccnt) AS maccnt, sum(acccnt) AS acccnt " + "FROM " + "mt_transfer_charge_shop_tb " + "WHERE " + "shopid IN (" + shopid.join(", ") + ") " + "GROUP BY " + "orderid";
		}

		return this.get_DB().queryKeyAssoc(sql);
	}

	getTransferToInfo(shopid) {
		var sql = "SELECT orderid, toshopid, fromshopid, detail_sort, transfer_level " + "FROM " + "mt_transfer_tb " + "WHERE " + "toshopid IN (" + shopid.join(", ") + ") " + "ORDER BY " + "orderid, transfer_level";
		var H_temp = this.get_DB().queryHash(sql);

		for (var val of Object.values(H_temp)) {
			if (false == (undefined !== H_result[val.orderid][val.detail_sort])) {
				H_result[val.orderid][val.detail_sort] = val;
			} else {
				if (H_result[val.orderid][val.detail_sort].transfer_level < val.transfer_level) {
					H_result[val.orderid][val.detail_sort] = val;
				}
			}
		}

		return H_result;
	}

	getTransferFromInfo(shopid) {
		var sql = "SELECT orderid, toshopid, fromshopid, detail_sort, transfer_level " + "FROM " + "mt_transfer_tb " + "WHERE " + "fromshopid IN (" + shopid.join(", ") + ") " + "ORDER BY " + "orderid, transfer_level";
		var H_temp = this.get_DB().queryHash(sql);

		for (var val of Object.values(H_temp)) {
			if (false == (undefined !== H_result[val.orderid][val.detail_sort])) {
				H_result[val.orderid][val.detail_sort] = val;
			} else {
				if (H_result[val.orderid][val.detail_sort].transfer_level < val.transfer_level) {
					H_result[val.orderid][val.detail_sort] = val;
				}
			}
		}

		return H_result;
	}

	checkAuditTarget(colum) {
		switch (colum) {
			case "username":
			case "employeecode":
			case "chargername":
			case "compname":
			case "applyprice":
			case "service":
			case "datefrom":
			case "dateto":
			case "datechange":
			case "billaddress":
			case "sendname":
			case "sendpost":
			case "zip1":
			case "zip2":
			case "addr1":
			case "addr2":
			case "building":
			case "sendtel":
			case "note":
			case "text1":
			case "text2":
			case "text3":
			case "int1":
			case "int2":
			case "knowledge":
			case "shopnote":
				return false;
				break;

			default:
				return true;
				break;
		}

		return false;
	}

	__destruct() {
		super.__destruct();
	}

};