//
//注文履歴ダウンロードModel
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/11/13
//@uses RecogMenuModel
//
//
//
//注文履歴ダウンロードModel
//
//@package Order
//@subpackage Model
//@author miyazawa
//@since 2008/11/13
//@uses RecogMenuModel
//

require("model/Order/RecogMenuModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/05/26
//
//@param objrct $O_db0
//@param array $A_orderid
//@param objrct $O_order
//@access public
//@return void
//
//
//mt_order_tbからデータ取得<br>
//
//@author miyazawa
//@since 2008/11/14
//
//@param mixed $A_orderid	オーダーIDのリスト
//@param model $carid		キャリアID
//
//@access public
//@return mixed
//
//
//mt_order_tbからデータ取得（英語）<br>
//
//@author miyazawa
//@since 2008/11/14
//
//@param mixed $A_orderid	オーダーIDのリスト
//@param model $carid		キャリアID
//
//@access public
//@return mixed
//
//
//mt_order_sub_tbからデータ取得<br>
//
//@author miyazawa
//@since 2008/11/14
//
//@param mixed $A_orderid	オーダーIDのリスト
//
//@access public
//@return mixed
//
//
//mt_order_sub_tbからデータ取得（英語）<br>
//
//@author miyazawa
//@since 2008/11/14
//
//@param mixed $A_orderid	オーダーIDのリスト
//
//@access public
//@return mixed
//
//
//mt_order_teldetail_tbからデータ取得<br>
//
//@author miyazawa
//@since 2008/11/14
//
//@param mixed $A_orderid	オーダーIDのリスト
//
//@access public
//@return mixed
//
//
//mt_order_teldetail_tbからデータ取得（英語）<br>
//
//@author miyazawa
//@since 2008/11/14
//
//@param mixed $A_orderid	オーダーIDのリスト
//
//@access public
//@return mixed
//
//
//subとdetailのマージ（ShopOrderDownloadModelからコピペ）
//
//@author igarashi
//@since 2008/11/14
//
//@access public
//@return void
//
//
//orderを見て、ポイントが不要なオーダーを判別し、H_subからポイント空白にする
//
//@author date
//@since 2014/11/06
//
//@access public
//@return void
//
//
//orderとsubのマージ（ShopOrderDownloadModelからコピペ）
//
//@author igarashi
//@since 2008/11/14
//
//@access public
//@return void
//
//
//枝番０以外の任意のブランクを埋める。
//
//@author date
//@since 2014/12/11
//
//@access public
//@return ブランクを埋めたもの
//
//
//オプションを取得
//
//@author miyazawa
//@since 2008/11/14
//
//@access public
//@return void
//
//
//InsertMngLog
//ログの書き込み
//@author web
//@since 2016/03/31
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $postname
//@param mixed $userid
//@param mixed $username
//@param mixed $loginid
//@access public
//@return void
//
//
//オプションを取得（英語）
//
//@author miyazawa
//@since 2009/03/30
//
//@access public
//@return void
//
//
//setfjpModelObject
//
//@author web
//@since 2013/03/14
//
//@param mixed $fjp
//@access public
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
class OrderListDownloadModel extends RecogMenuModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
	}

	getOrderTB(A_orderid, carid = undefined, pactid = undefined) //注文履歴DLに端末種別追加など
	{
		var ptnname_str = "CASE " + "WHEN ord.ordertype='S' AND ord.cirid=1 AND ord.recdate < '2014-01-01 00:00:00' THEN '\u79FB\u884C\uFF1A\u30E0\u30FC\u30D0 => FOMA' " + "WHEN ord.ordertype='S' AND ord.cirid=9 AND ord.recdate < '2014-01-01 00:00:00' THEN '\u79FB\u884C\uFF1ACDMA1x => WIN' " + "ELSE ptn.ptnname " + "END as ptnname";
		var lang = this.O_billView.getLangLists();
		var ordsql = "SELECT " + "DISTINCT(ord.orderid), " + "ord.pactid, " + "ord.applypostid, " + "ord.carid, " + "ord.cirid, " + "ord.ordertype, " + "ord.shopid, " + "ord.ansdate, " + "ord.chargername, " + "charger.userid as check_userid," + "CASE ord.actorder " + "WHEN 'true' THEN NULL " + "ELSE ord.chargermail " + "END as chargermail, " + "ord.buyselid, " + "ord.pointradio, " + "ord.point, " + "ord.pointsum, " + "ord.parent, " + "ord.billradio, " + "ord.fee, " + "ord.datefrom, " + "ord.dateto, " + "ord.datechange, " + "ord.billaddress, " + "ord.note, " + "ord.sendhow, " + "ord.sendname, " + "ord.zip1, " + "ord.zip2, " + "ord.addr1, " + "ord.addr2, " + "ord.building, " + "ord.sendpost, " + "ord.sendtel, " + "ord.webreliefservice, " + "pact.compname, " + "ord.postname, " + "car.carname, " + ptnname_str + "," + "stat.forcustomer, " + "cir.cirname, " + "buysel.buyselname, " + "ord.billpost, " + "ord.billname, " + "ord.receiptname, " + "ord.billzip1, " + "ord.billzip2, " + "ord.billaddr1, " + "ord.billaddr2, " + "ord.billbuild, " + "ord.billtel, " + "ord.finishdate, " + "ord.recdate, " + "CASE billhow " + "WHEN 'card' THEN '" + lang.billhow.card.JPN + "' " + "WHEN 'bank' THEN '" + lang.billhow.bank.JPN + "' " + "WHEN 'cash' THEN '" + lang.billhow.cash.JPN + "' " + "ELSE '" + lang.billhow.misc.JPN + "' " + "END AS billhowview, " + "smtcir.smpcirname ";

		if (this.O_fjp.checkAuth("co")) {
			ordsql += ", ord.recogcode, " + "ord.pbpostcode, " + "ord.cfbpostcode, " + "ord.ioecode, " + "ord.coecode, " + "ord.commflag, " + "u.username AS recogname, " + "p1.postname AS pbpostname, " + "p2.postname AS cfbpostname ";
		}

		if (-1 !== this.A_Auth.indexOf("fnc_fjp_co") && -1 !== this.A_Auth.indexOf("fnc_tel_division")) {
			ordsql += ", " + "CASE division " + "WHEN 1 THEN '\u696D\u52D9\u7528' " + "WHEN 2 THEN '\u30C7\u30E2\u7528' " + "ELSE NULL " + "END AS division ";
		}

		ordsql += "FROM " + "mt_order_tb ord " + "LEFT JOIN pact_tb pact ON ord.pactid=pact.pactid " + "LEFT JOIN post_tb post ON ord.applypostid=post.postid " + "LEFT JOIN carrier_tb car ON ord.carid=car.carid " + "LEFT JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "LEFT JOIN mt_status_tb stat ON ord.status=stat.status " + "LEFT JOIN circuit_tb cir ON ord.carid=cir.cirid " + "LEFT JOIN buyselect_tb buysel ON ord.buyselid=buysel.buyselid " + "LEFT JOIN user_tb charger ON ord.chargerid=charger.userid " + "LEFT JOIN smart_circuit_tb smtcir ON smpcirid=ord.smartphonetype ";

		if (this.O_fjp.checkAuth("co")) {
			ordsql += "LEFT JOIN user_tb u ON u.employeecode=ord.recogcode AND u.pactid=" + pactid + " " + "LEFT JOIN post_tb p1 ON ord.pbpostcode_first=p1.userpostid AND p1.pactid=" + pactid + " " + "LEFT JOIN post_tb p2 ON ord.cfbpostcode_first=p2.userpostid AND p2.pactid=" + pactid;
		}

		var where = "WHERE ord.orderid IN (" + join(",", A_orderid) + ") ";

		if (undefined != carid) {
			if (carid != 0) {
				where += "AND ord.carid=" + carid + " ";
			} else //S189 その他スマートフォンを入れる
				{
					where += "AND ord.carid NOT IN( 1,3,2,4,15 ) ";
				}
		}

		return this.get_DB().queryHash(ordsql + where);
	}

	getOrderTBEng(A_orderid, carid = undefined, pactid = undefined) //注文履歴DLに端末種別追加など
	{
		var lang = this.O_billView.getLangLists();
		var ordsql = "SELECT " + "DISTINCT(ord.orderid), " + "ord.pactid, " + "ord.applypostid, " + "ord.carid, " + "ord.cirid, " + "ord.ordertype, " + "ord.shopid, " + "ord.ansdate, " + "ord.chargername, " + "charger.userid as check_userid," + "CASE ord.actorder " + "WHEN 'true' THEN NULL " + "ELSE ord.chargermail " + "END as chargermail, " + "ord.buyselid, " + "ord.pointradio, " + "ord.point, " + "ord.pointsum, " + "ord.parent, " + "ord.billradio, " + "ord.fee, " + "ord.datefrom, " + "ord.dateto, " + "ord.datechange, " + "ord.billaddress, " + "ord.note, " + "ord.sendhow, " + "ord.sendname, " + "ord.zip1, " + "ord.zip2, " + "ord.addr1, " + "ord.addr2, " + "ord.building, " + "ord.sendpost, " + "ord.sendtel, " + "ord.webreliefservice, " + "pact.compname, " + "ord.postname, " + "car.carname_eng AS carname, " + "ptn.ptnname_eng AS ptnname, " + "stat.forcustomer_eng AS forcustomer, " + "cir.cirname_eng AS cirname, " + "buysel.buyselname_eng AS buyselname, " + "ord.billpost, " + "ord.billname, " + "ord.receiptname, " + "ord.billzip1, " + "ord.billzip2, " + "ord.billaddr1, " + "ord.billaddr2, " + "ord.billbuild, " + "ord.billtel, " + "ord.finishdate, " + "ord.recdate, " + "CASE billhow " + "WHEN 'card' THEN '" + lang.billhow.card.ENG + "' " + "WHEN 'bank' THEN '" + lang.billhow.bank.ENG + "' " + "WHEN 'cash' THEN '" + lang.billhow.cash.ENG + "' " + "ELSE '" + lang.billhow.misc.ENG + "' " + "END AS billhowview, " + "smtcir.smpcirname ";

		if (this.O_fjp.checkAuth("co")) {
			ordsql += ", ord.recogcode, " + "ord.pbpostcode, " + "ord.cfbpostcode, " + "ord.ioecode, " + "ord.coecode, " + "ord.commflag, " + "u.username AS recogname, " + "p1.postname AS pbpostname, " + "p2.postname AS cfbpostname ";
		}

		if (-1 !== this.A_Auth.indexOf("fnc_fjp_co") && -1 !== this.A_Auth.indexOf("fnc_tel_division")) {
			ordsql += ",division ";
		}

		ordsql += "FROM " + "mt_order_tb ord " + "LEFT JOIN pact_tb pact ON ord.pactid=pact.pactid " + "LEFT JOIN post_tb post ON ord.applypostid=post.postid " + "LEFT JOIN carrier_tb car ON ord.carid=car.carid " + "LEFT JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "LEFT JOIN mt_status_tb stat ON ord.status=stat.status " + "LEFT JOIN circuit_tb cir ON ord.carid=cir.cirid " + "LEFT JOIN buyselect_tb buysel ON ord.buyselid=buysel.buyselid " + "LEFT JOIN user_tb charger ON ord.chargerid=charger.userid " + "LEFT JOIN smart_circuit_tb smtcir ON smpcirid=ord.smartphonetype ";

		if (this.O_fjp.checkAuth("co")) {
			ordsql += "LEFT JOIN user_tb u ON u.employeecode=ord.recogcode AND u.pactid=" + pactid + " " + "LEFT JOIN post_tb p1 ON ord.pbpostcode_first=p1.userpostid AND p1.pactid=" + pactid + " " + "LEFT JOIN post_tb p2 ON ord.cfbpostcode_first=p2.userpostid AND p2.pactid=" + pactid;
		}

		var where = "WHERE ord.orderid IN (" + join(",", A_orderid) + ") ";

		if (undefined != carid) {
			if (carid != 0) {
				where += "AND ord.carid=" + carid + " ";
			} else //S189 その他スマートフォンを入れる
				{
					where += "AND ord.carid NOT IN( 1,3,2,4,15 ) ";
				}
		}

		return this.get_DB().queryHash(ordsql + where);
	}

	getOrderSubTB(A_orderid) {
		var subsql = "SELECT " + "sub.orderid, " + "sub.ordersubid, " + "sub.substatus, " + "sub.productname, " + "sub.property, " + "sub.anspassprice, " + "sub.totalprice, " + "sub.saleprice, " + "sub.number as accnum, " + "sub.memory, " + "sub.recovery, " + "sub.machineflg, " + "sub.receiptdate, " + "sub.detail_sort, " + "CASE sub.machineflg " + "WHEN 'true'  THEN '\u7AEF\u672B' " + "WHEN 'false' THEN '\u4ED8\u5C5E\u54C1' " + "END as classification, " + "sum((sub.shoppoint + sub.shoppoint2) * sub.number) as shoppoint3, " + "max(sub.deliverydate) as deliverydate, " + "stat.forcustomer " + "FROM " + "mt_order_sub_tb sub " + "LEFT JOIN mt_status_tb stat ON sub.substatus=stat.status ";
		var where = "WHERE sub.orderid IN (" + join(",", A_orderid) + ") ";
		var group = " GROUP BY " + "sub.orderid, " + "sub.ordersubid, " + "sub.substatus, " + "sub.productname, " + "sub.property, " + "sub.anspassprice, " + "sub.totalprice, " + "sub.saleprice, " + "sub.number, " + "sub.memory, " + "sub.recovery, " + "sub.machineflg, " + "sub.receiptdate," + "sub.detail_sort, " + "stat.forcustomer";
		var order = " ORDER BY sub.orderid, sub.detail_sort";
		return this.get_DB().queryHash(subsql + where + group + order);
	}

	getOrderSubTBEng(A_orderid) {
		var subsql = "SELECT " + "sub.orderid, " + "sub.ordersubid, " + "sub.substatus, " + "sub.productname, " + "sub.property, " + "sub.anspassprice, " + "sub.totalprice, " + "sub.saleprice, " + "sub.number as accnum, " + "sub.memory, " + "sub.recovery, " + "sub.machineflg, " + "sub.receiptdate, " + "sub.detail_sort, " + "CASE sub.machineflg " + "WHEN 'true'  THEN '\u7AEF\u672B' " + "WHEN 'false' THEN '\u4ED8\u5C5E\u54C1' " + "END as classification, " + "sum((sub.shoppoint + sub.shoppoint2) * sub.number) as shoppoint3, " + "max(sub.deliverydate) as deliverydate, " + "stat.forcustomer_eng AS forcustomer " + "FROM " + "mt_order_sub_tb sub " + "LEFT JOIN mt_status_tb stat ON sub.substatus=stat.status ";
		var where = "WHERE sub.orderid IN (" + join(",", A_orderid) + ") ";
		var group = " GROUP BY " + "sub.orderid, " + "sub.ordersubid, " + "sub.substatus, " + "sub.productname, " + "sub.property, " + "sub.anspassprice, " + "sub.totalprice, " + "sub.saleprice, " + "sub.number, " + "sub.memory, " + "sub.recovery, " + "sub.machineflg, " + "sub.receiptdate," + "sub.detail_sort, " + "stat.forcustomer_eng";
		var order = " ORDER BY sub.orderid, sub.detail_sort";
		return this.get_DB().queryHash(subsql + where + group + order);
	}

	getOrderTelDetailTB(A_orderid) //注文履歴DLに端末種別追加など
	{
		var detsql = "SELECT " + "det.orderid, " + "det.ordersubid, " + "det.telno, " + "det.telno_view AS no_view, " + "det.telusername, " + "det.employeecode, " + "det.mnpno, " + "det.expectdate, " + "det.registdate, " + "det.cirid, " + "det.contractor, " + "det.pay_frequency, " + "det.pay_monthly_sum, " + "det.plan, " + "det.packet, " + "det.passwd, " + "det.discounttel, " + "det.option, " + "det.waribiki, " + "det.saleprice, " + "det.number, " + "det.text1, " + "det.text2, " + "det.text3, " + "det.text4, " + "det.text5, " + "det.text6, " + "det.text7, " + "det.text8, " + "det.text9, " + "det.text10, " + "det.text11, " + "det.text12, " + "det.text13, " + "det.text14, " + "det.text15, " + "det.int1, " + "det.int2, " + "det.int3, " + "det.int4, " + "det.int5, " + "det.int6, " + "det.date1, " + "det.date2, " + "det.date3, " + "det.date4, " + "det.date5, " + "det.date6, " + "det.mail1, " + "det.mail2, " + "det.mail3, " + "det.url1, " + "det.url2, " + "det.url3, " + "det.select1, " + "det.select2, " + "det.select3, " + "det.select4, " + "det.select5, " + "det.select6, " + "det.select7, " + "det.select8, " + "det.select9, " + "det.select10, " + "det.machineflg, " + "det.detail_sort, " + "det.shoppoint, " + "det.shoppoint2, " + "det.substatus, " + "tel.telno_view, " + "cir.cirname, " + "plan.planname, " + "packet.packetname, " + "stat.forcustomer, " + "det.receiptdate, " + "det.deliverydate, " + "prd.smart_type, " + "det.productid," + "det.mail," + "det.mnp_enable_date " + "FROM " + "mt_order_teldetail_tb det " + "INNER JOIN mt_order_tb o ON det.orderid=o.orderid " + "LEFT JOIN tel_tb tel ON det.telno=tel.telno " + "LEFT JOIN circuit_tb cir ON o.cirid=cir.cirid " + "LEFT JOIN plan_tb plan ON det.plan=plan.planid " + "LEFT JOIN packet_tb packet ON det.packet=packet.packetid " + "LEFT JOIN mt_status_tb stat ON det.substatus=stat.status " + "LEFT JOIN product_tb prd ON prd.productid=cast(det.productid as integer) ";
		var where = "WHERE det.orderid IN (" + join(",", A_orderid) + ") ";
		var order = " ORDER BY det.orderid, det.detail_sort";
		return this.get_DB().queryHash(detsql + where + order);
	}

	getOrderTelDetailTBEng(A_orderid) //注文履歴DLに端末種別追加など
	{
		var detsql = "SELECT " + "det.orderid, " + "det.ordersubid, " + "det.telno, " + "det.telno_view AS no_view, " + "det.telusername, " + "det.employeecode, " + "det.mnpno, " + "det.expectdate, " + "det.registdate, " + "det.cirid, " + "det.contractor, " + "det.pay_frequency, " + "det.pay_monthly_sum, " + "det.plan, " + "det.packet, " + "det.passwd, " + "det.discounttel, " + "det.option, " + "det.waribiki, " + "det.saleprice, " + "det.number, " + "det.text1, " + "det.text2, " + "det.text3, " + "det.text4, " + "det.text5, " + "det.text6, " + "det.text7, " + "det.text8, " + "det.text9, " + "det.text10, " + "det.text11, " + "det.text12, " + "det.text13, " + "det.text14, " + "det.text15, " + "det.int1, " + "det.int2, " + "det.int3, " + "det.int4, " + "det.int5, " + "det.int6, " + "det.date1, " + "det.date2, " + "det.date3, " + "det.date4, " + "det.date5, " + "det.date6, " + "det.mail1, " + "det.mail2, " + "det.mail3, " + "det.url1, " + "det.url2, " + "det.url3, " + "det.select1, " + "det.select2, " + "det.select3, " + "det.select4, " + "det.select5, " + "det.select6, " + "det.select7, " + "det.select8, " + "det.select9, " + "det.select10, " + "det.machineflg, " + "det.detail_sort, " + "det.shoppoint, " + "det.shoppoint2, " + "det.substatus, " + "tel.telno_view, " + "cir.cirname_eng AS cirname, " + "plan.planname_eng AS planname, " + "packet.packetname_eng AS packetname, " + "stat.forcustomer, " + "det.receiptdate, " + "det.deliverydate, " + "prd.smart_type, " + "det.productid," + "det.mail, " + "det.mnp_enable_date " + "FROM " + "mt_order_teldetail_tb det " + "INNER JOIN mt_order_tb o ON det.orderid=o.orderid " + "LEFT JOIN tel_tb tel ON det.telno=tel.telno " + "LEFT JOIN circuit_tb cir ON o.cirid=cir.cirid " + "LEFT JOIN plan_tb plan ON det.plan=plan.planid " + "LEFT JOIN packet_tb packet ON det.packet=packet.packetid " + "LEFT JOIN mt_status_tb stat ON det.substatus=stat.status " + "LEFT JOIN product_tb prd ON prd.productid=cast(det.productid as integer) ";
		var where = "WHERE det.orderid IN (" + join(",", A_orderid) + ") ";
		var order = " ORDER BY det.orderid, det.detail_sort";
		return this.get_DB().queryHash(detsql + where + order);
	}

	mergeOrderSubAndDetail(H_sub, H_detail) {
		var A_m_detail;
		var A_result = Array();
		var A_mac = A_m_detail = Array();
		var max = H_sub.length;
		var detail = H_detail.length;

		for (var i = 0; i < max; i++) {
			for (var j = 0; j < detail; j++) //orderidとordersubidが同じなら結合
			{
				if (H_sub[i].orderid == H_detail[j].orderid && H_sub[i].ordersubid == H_detail[j].ordersubid) //処理していないorderidならDL用に保存
					{
						if (false == (-1 !== A_mac.indexOf(H_sub[i].orderid))) {
							A_mac.push(H_sub[i].orderid);
							A_result.push(array_merge(H_sub[i], H_detail[j]));
							A_det[H_detail[j].orderid] = Array();
						} else {
							if (false == (-1 !== A_det[H_detail[j].orderid].indexOf(H_detail[j].detail_sort))) {
								A_result.push(array_merge(H_sub[i], H_detail[j]));
								A_det[H_detail[j].orderid].push(H_detail[j].detail_sort);
							}
						}
					} else if (H_sub[i].orderid == H_detail[j].orderid && false == H_sub[i].machineflg) //処理していないsubidならDL用に保存
					{
						if (true == Array.isArray(A_acc[H_sub[i].orderid]) && false == (-1 !== A_acc[H_sub[i].orderid].indexOf(H_sub[i].ordersubid))) {
							A_acc[H_sub[i].orderid].push(H_sub[i].ordersubid);
							A_result.push(H_sub[i]);
						} else {
							if (false == Array.isArray(A_acc[H_sub[i].orderid])) {
								A_acc[H_sub[i].orderid] = Array();
								A_acc[H_sub[i].orderid].push(H_sub[i].ordersubid);
								A_result.push(H_sub[i]);
							}
						}
					}
			}
		}

		return A_result;
	}

	replacePoint(H_sub, H_order) //orderidごとにポイントが不要なものを検出する
	//
	{
		var req = Array();
		var pointreq = Array();

		for (var key in H_order) //このcar_idとciridの組み合わせが既に登録されている？
		{
			var value = H_order[key];
			var req_key = value.carid + "_" + value.cirid;

			if (undefined !== req[req_key]) {
				if (req[req_key]) {
					pointreq[value.orderid] = true;
				} else {
					pointreq[value.orderid] = false;
				}
			} else {
				var sql = "SELECT * FROM mt_order_item_tb WHERE type='N' AND carid='" + value.carid + "' AND cirid='" + value.cirid + "' AND inputname='pointradio'";
				var res = this.get_DB().queryOne(sql);

				if (is_null(res)) {
					pointreq[value.orderid] = false;
					req[req_key] = false;
				} else {
					pointreq[value.orderid] = true;
					req[req_key] = true;
				}
			}
		}

		for (var key in H_sub) {
			var value = H_sub[key];

			if (pointreq[value.orderid] == false) {
				if (undefined !== H_sub[key].point == true) {
					H_sub[key].point = "";
				}

				if (undefined !== H_sub[key].pointsum == true) {
					H_sub[key].pointsum = "";
				}

				if (undefined !== H_sub[key].shoppoint == true) {
					H_sub[key].shoppoint = "";
				}

				if (undefined !== H_sub[key].shoppoint2 == true) {
					H_sub[key].shoppoint2 = "";
				}
			}
		}

		return H_sub;
	}

	mergeOrderAndSub(H_order, H_sub) {
		var A_result = Array();

		for (var key in H_sub) {
			var val = H_sub[key];

			for (var okey in H_order) //orderidが同じで端末ならこっち
			{
				var oval = H_order[okey];

				if (val.orderid == oval.orderid && true == val.machineflg) //処理したことがなければ結合
					{
						if (false == Array.isArray(A_temp[oval.orderid])) //処理済みに追加
							{
								A_temp[oval.orderid] = Array();
								A_mac[oval.orderid] = Array();
								A_result.push(array_merge(oval, val));
								A_temp[oval.orderid].push(val.ordersubid);
								A_mac[oval.orderid].push(val.detail_sort);
							} else if (false == (-1 !== A_mac[oval.orderid].indexOf(val.detail_sort))) {
							A_result.push(array_merge(oval, val));
							A_mac[oval.orderid].push(val.detail_sort);
						}
					} else if (val.orderid == oval.orderid) {
					if (true == Array.isArray(A_temp[oval.orderid]) && false == (-1 !== A_temp[oval.orderid].indexOf(val.ordersubid))) {
						A_result.push(val);
						A_temp[oval.orderid].push(val.ordersubid);
					}
				}
			}
		}

		return A_result;
	}

	setValueToBlank(temp) //辞書
	//枝番が0番のものをリスト化する、ユーザーが削除されている場合、chargermailをNULLにする
	//枝番が0以外のものに値を代入する
	{
		var A_result = Array();
		var dic = Array();
		var update_keys = ["pactid", "postname", "telno_view", "no_view", "telno", "telusername", "employeecode", "carname", "ptnname", "mnpno", "shopid", "expectdate", "cirname", "chargername", "chargermail", "contractor", "compname", "ansdate", "recdate"];

		for (var key in temp) {
			var value = temp[key];

			if (value.ordersubid == 0) {
				if (!(undefined !== dic[value.orderid])) {
					dic[value.orderid] = key;
				}
			}

			if (is_null(value.check_userid) && value.machineflg) //このユーザーは存在しない
				//メールを削除
				{
					temp[key].chargermail = undefined;
				}
		}

		for (var key in temp) //枝番が0以外である
		{
			var value = temp[key];

			if (value.ordersubid != 0) //オーダーIDの枝番0は存在する？
				{
					if (undefined !== dic[value.orderid]) {
						for (var name of Object.values(update_keys)) //値がない
						{
							if (!(undefined !== value[name]) || is_null(value[name])) //枝番0には値がある
								{
									if (undefined !== temp[dic[value.orderid]][name] && !is_null(temp[dic[value.orderid]][name])) //値をいれる
										{
											value[name] = temp[dic[value.orderid]][name];
										}
								}
						}
					}
				}

			A_result.push(value);
		}

		return A_result;
	}

	getOrderListOption(carid) //caridが指定されていない場合は外す S179 注文履歴検索 20141217 date
	{
		var sql = "SELECT opid, opname FROM option_tb";

		if (!is_null(carid)) {
			if (carid != 0) {
				sql += " WHERE carid=" + carid;
			} else //S189 その他スマートフォンを入れる
				{
					where += " WHERE carid NOT IN( 1,3,2,4,15 )";
				}
		}

		var H_option = this.get_DB().queryAssoc(sql);
		return H_option;
	}

	insertMngLog(pactid, postid, postname, userid, username, loginid, joker) {
		var data = Array();
		data.pactid = this.get_DB().dbQuote(pactid, "int", true);
		data.postid = this.get_DB().dbQuote(postid, "int", true);
		data.targetpostid = this.get_DB().dbQuote(postid, "int", true);
		data.postname = this.get_DB().dbQuote(postname, "text", true);
		data.userid = this.get_DB().dbQuote(userid, "int", true);
		data.username = this.get_DB().dbQuote(username, "text", true);
		data.recdate = this.get_DB().dbQuote(date("Y-m-d H:i:s"), "date", true);
		data.comment1 = this.get_DB().dbQuote("ID\uFF1A" + loginid, "text", true);
		data.comment2 = this.get_DB().dbQuote("\u6CE8\u6587\u5C65\u6B74\u306E\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9", "text", true);
		data.comment1_eng = this.get_DB().dbQuote("ID\uFF1A" + loginid, "text", true);
		data.comment2_eng = this.get_DB().dbQuote("download dorder history", "text", true);
		data.kind = this.get_DB().dbQuote("D", "text", true);
		data.type = this.get_DB().dbQuote("\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9", "text", true);
		data.joker_flag = this.get_DB().dbQuote(joker === 1 ? 1 : 0, "integer", true);
		var keys = Object.keys(data);
		var sql = "INSERT INTO mnglog_tb (" + keys.join(",") + ")VALUES(" + data.join(",") + ")";
		this.get_DB().query(sql);
	}

	getOrderListOptionEng(carid) //$sql = "SELECT opid, opname_eng AS opname FROM option_tb WHERE carid=" . $carid;
	//caridが指定されていない場合は外す S179 注文履歴検索 20141217 date
	{
		var sql = "SELECT opid, opname_eng AS opname FROM option_tb";

		if (!is_null(carid)) {
			if (carid != 0) {
				sql += " WHERE carid=" + carid;
			} else //S189 その他スマートフォンを入れる
				{
					where += " WHERE carid NOT IN( 1,3,2,4,15 )";
				}
		}

		var H_option = this.get_DB().queryAssoc(sql);
		return H_option;
	}

	setfjpModelObject(fjp) {
		require("model/Order/fjpModel.php");

		if (fjp instanceof fjpModel) {
			this.O_fjp = fjp;
		}
	}

	__destruct() {
		super.__destruct();
	}

};