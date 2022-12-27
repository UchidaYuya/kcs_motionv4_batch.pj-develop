//
//注文履歴詳細用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/08/04
//@uses OrderModel
//@uses OrderUtil
//
//
//
//注文履歴詳細用Model
//
//@uses ModelBase
//@package Order
//@author miyazawa
//@since 2008/08/04
//

require("OrderFormModel.php");

require("Post.php");

require("view/Order/BillingViewBase.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//注文データ取得
//
//@author miyazawa
//@since 2008/10/03
//
//@param integer $orderid
//@param string $language
//@access public
//@return void
//
//
//注文データ取得
//障害25対応。電話複数代注文した時に端末代金が全部同じになっていたのを修正
//
//@author date
//@since 2014/08/28
//
//@param integer $orderid
//@param string $language
//@access public
//@return void
//
//
//履歴用取得
//
//@author miyazawa
//@since 2008/08/22
//
//@param mixed $H_sess
//@access public
//@return string
//
//
//承認用SQL作成
//
//@author miyazawa
//@since 2008/09/04
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $H_recog
//@param mixed $A_auth
//@param mixed $H_order
//@access public
//@return string
//
//
//承認用履歴更新SQL作成
//
//@author miyazawa
//@since 2008/09/04
//
//@param mixed $H_sess
//@access public
//@return string
//
//
//mt_order_tbにupdateする<br>
//失敗したらrollbackする
//
//@author miyazawa
//@since 2008/09/04
//
//@param $upd_sql
//
//@access public
//@return boolean
//
//
//mt_order_history_tbにinsertする<br>
//失敗したらrollbackする
//
//@author miyazawa
//@since 2008/09/04
//
//@param $upd_sql
//
//@access public
//@return boolean
//
//
//mt_order_tb、mt_order_history_tbにまとめてupdate・insertする<br>
//
//@author miyazawa
//@since 2008/09/04
//
//@access public
//@return boolean
//
//
//mt_order_history_tbからデータ取得<br>
//
//@author miyazawa
//@since 2008/09/04
//
//@access public
//@return array
//
//
//一括プラン変更の除外・戻し処理<br>
//失敗したらrollbackする
//
//@author miyazawa
//@since 2008/10/04
//
//@param $updtype
//@param $orderid
//@param $telno
//
//@access public
//@return boolean
//
//
//申請者と承認者のメールを取得
//
//@author miyazawa
//@since 2008/10/06
//
//@param $updtype
//@param $orderid
//@param $telno
//
//@access public
//@return boolean
//
//
//注文時の価格取得
//
//@author miyazawa
//@since 2010/01/07
//
//@param int $orderid
//@access public
//@return string
//
//
//hoge
//
//@author
//@since 2010/12/01
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $A_auth
//@param mixed $H_mailparam
//@param mixed $H_order
//@param mixed $H_view
//@access public
//@return void
//
//
//getRecogUserMail
//
//@author igarashi
//@since 2011/06/23
//
//@param mixed $userid
//@access protected
//@return void
//
//
//releaseExtensionNo
//
//@author igarashi
//@since 2011/11/08
//
//@param mixed $H_order
//@access public
//@return void
//
//
//getExtensionObject
//
//@author igarashi
//@since 2011/11/08
//
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
class OrderDetailFormModel extends OrderFormModel {
	constructor(O_db0, H_g_sess, site_flg = OrderDetailFormModel.SITE_USER) {
		super(O_db0, H_g_sess, site_flg);
	}

	getOrderInfo(orderid, language = "JPN") //英語化 20090428miya
	{
		if ("ENG" == language) {
			var buyselname_str = "buy.buyselname_eng AS buyselname";
		} else {
			buyselname_str = "buy.buyselname";
		}

		var billView = new BillingViewBase();
		var lang = billView.getLangLists("billhow");

		if (!language) {
			if ("string" === typeof billView.gSess().language) {
				language = billView.gSess().language;
			} else {
				language = "JPN";
			}
		}

		var ordsql = "SELECT " + "ord.orderid         ," + "ord.orderid_view    ," + "ord.finishdate      ," + "ord.pactid          ," + "ord.postid  as recogpostid," + "ord.postname        ," + "ord.pacttype        ," + "ord.ordertype       ," + "ord.status          ," + "ord.chargerid       ," + "ord.chargername     ," + "ord.shopid          ," + "ord.shopmemid       ," + "ord.salesshopid     ," + "ord.actorder        ," + "ord.actordershopid  ," + "ord.recdate         ," + "ord.carid           ," + "ord.cirid           ," + "ord.pointradio      ," + "ord.point           ," + "ord.pointsum        ," + "ord.applyprice      ," + "ord.billsubtotal    ," + "ord.billtotal       ," + "ord.billtotal2      ," + "ord.stockprice      ," + "ord.billradio       ," + "ord.parent          ," + "ord.billaddress     ," + "ord.dateradio       ," + "ord.datefrom        ," + "ord.dateto          ," + "ord.datechangeradio ," + "ord.datechange      ," + "ord.fee             ," + "ord.sendhow         ," + "ord.sendname        ," + "ord.sendpost        ," + "ord.zip1            ," + "ord.zip2            ," + "ord.addr1           ," + "ord.addr2           ," + "ord.building        ," + "ord.sendtel         ," + "ord.note            ," + "ord.reason          ," + "ord.shopnote        ," + "ord.transfer        ," + "ord.buyselid        ," + "ord.certificate     ," + "ord.certificatelimit," + "ord.matterno        ," + "ord.receipt         ," + "ord.settlement      ," + "ord.slipno          ," + "ord.message         ," + "ord.chpostid        ," + "ord.chpostname      ," + "ord.nextpostid      ," + "ord.nextpostname    ," + "ord.anspost         ," + "ord.ansuser         ," + "ord.ansdate         ," + "ord.destinationcode ," + "ord.salepost        ," + "ord.knowledge       ," + "ord.costprice       ," + "ord.pay_point       ," + "ord.paymentprice    ," + "ord.refercharge     ," + "ord.fixdate         ," + "ord.telcnt          ," + "ord.terminal_del    ," + "ord.service         ," + "ord.misctype        ," + "ord.applypostid     ," + "ord.applyuserid     ," + "stat.forshop,        " + "stat.forcustomer,    " + "car.carname,         " + "cir.cirname,         " + "ptn.ptnname,         " + "ptn.tplfile,         " + "pa.compname,         " + "pa.userid_ini,       " + "area.arid,           " + "area.arname,         " + "shmem.name as memname," + buyselname_str + ",  " + "prsi.signeddate,     " + "ord.disfee,          " + "ord.disfeecharge,    " + "ord.worldtel,        " + "ord.accountcomment,  " + "ord.existcircuit,    " + "ord.tdbcode,         " + "ord.webreliefservice," + "ord.smartphonetype, " + "ord.recoguserid, " + "ord.recogcode, " + "ord.pbpostcode, " + "ord.pbpostcode_first, " + "ord.pbpostcode_second, " + "ord.cfbpostcode, " + "ord.cfbpostcode_first, " + "ord.cfbpostcode_second, " + "ord.ioecode, " + "ord.coecode, " + "ord.commflag, " + "ord.billname, ord.billpost, ord.receiptname, ord.billzip1, ord.billzip2, ord.billaddr1, ord.billaddr2, " + "ord.billbuild, ord.billtel, ord.billhow, " + "CASE billhow " + "WHEN 'bank' THEN '" + lang.bank[language] + "' " + "WHEN 'card' THEN '" + lang.card[language] + "' " + "WHEN 'cash' THEN '" + lang.cash[language] + "' " + "ELSE '" + lang.misc[language] + "' " + "END AS billhowview ";
		var ordfrom = "FROM " + OrderDetailFormModel.ORD_TB + " ord " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "INNER JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "LEFT JOIN " + OrderDetailFormModel.ORD_DET_TB + " det ON ord.orderid=det.orderid " + "LEFT JOIN pact_tb pa ON ord.pactid=pa.pactid " + "LEFT JOIN circuit_tb cir ON ord.cirid=cir.cirid " + "LEFT JOIN area_tb area ON det.arid=area.arid AND ord.carid=area.carid " + "LEFT JOIN buyselect_tb buy ON ord.buyselid=buy.buyselid " + "LEFT JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + "LEFT JOIN post_rel_shop_info_tb prsi ON prsi.postid=ord.postid ";
		var subsql = "SELECT " + "sub.orderid      ," + "sub.ordersubid   ," + "sub.lineno       ," + "sub.substatus    ," + "sub.salesshopid  ," + "sub.expectflg    ," + "sub.expectdate   ," + "sub.fixdate      ," + "sub.finishdate   ," + "sub.shoppoint    ," + "sub.shoppoint2   ," + "sub.memory       ," + "sub.recovery     ," + "sub.number       ," + "sub.productid    ," + "sub.productname  ," + "sub.property     ," + "sub.branchid     ," + "sub.detail_sort  ," + "sub.subcomment   ," + "sub.machineflg   ," + "sub.anspassprice ," + "sub.saleprice    ," + "sub.deliverydate ," + "sub.totalprice   ," + "sub.fixedtotal   ," + "sub.taxprice     ," + "sub.subtotal     ," + "sub.fixedtaxprice," + "sub.fixedsubtotal," + "sub.recdate," + "sub.productname," + "sub.property," + "prl.dateto," + "stat.forshop," + "stat.forsub ";
		var subfrom = "FROM " + OrderDetailFormModel.ORD_TB + " ord " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "LEFT JOIN " + OrderDetailFormModel.ORD_SUB_TB + " sub ON ord.orderid=sub.orderid " + "LEFT JOIN pricelist_tb prl ON sub.pricelistid=prl.pricelistid ";
		var detsql = "SELECT DISTINCT " + "det.orderid         ," + "det.ordersubid      ," + "det.telno           ," + "det.registdate      ," + "det.contractor      ," + "det.holdername      ," + "det.userid          ," + "det.planradio       ," + "det.plan            ," + "det.packetradio     ," + "det.packet          ," + "det.option          ," + "det.waribiki        ," + "det.discounttel     ," + "det.passwd          ," + "det.pay_startdate   ," + "det.pay_monthly_sum ," + "det.pay_frequency   ," + "det.mail            ," + "det.telusername     ," + "det.simcardno as teldetail_simcardno," + "det.employeecode    ," + "det.text1           ," + "det.text2           ," + "det.text3           ," + "det.text4           ," + "det.text5           ," + "det.text6           ," + "det.text7           ," + "det.text8           ," + "det.text9           ," + "det.text10          ," + "det.text11          ," + "det.text12          ," + "det.text13          ," + "det.text14          ," + "det.text15          ," + "det.int1            ," + "det.int2            ," + "det.int3            ," + "det.int4            ," + "det.int5            ," + "det.int6            ," + "det.date1           ," + "det.date2           ," + "det.date3           ," + "det.date4           ," + "det.date5           ," + "det.date6           ," + "det.mail1\t\t\t ," + "det.mail2\t\t\t ," + "det.mail3\t\t\t ," + "det.url1\t\t\t ," + "det.url2\t\t\t ," + "det.url3\t\t\t ," + "det.memo            ," + "det.kousiradio      ," + "det.kousi as kousiid," + "det.detail_sort     ," + "det.machineflg      ," + "det.recdate         ," + "det.fixdate         ," + "det.buytype1        ," + "det.buytype2        ," + "det.pay_balance     ," + "det.formercarid     ," + "det.mnpno           ," + "det.mnp_enable_date ," + "det.freeword1       ," + "det.freeword2       ," + "det.freeword3       ," + "det.freeword4       ," + "det.freeword5       ," + "det.telno_view      ," + "det.number          ," + "det.substatus       ," + "det.shoppoint       ," + "det.shoppoint2      ," + "det.arid AS arid_det," + "tel.simcardno," + "tel.contractdate," + "tel.orderdate," + "tel.arid," + "plan.planname as planname," + "plan.viewflg as planview," + "packet.packetname," + "usr.username," + "area.arname, " + "kousi.patternname as kousiname," + "asts.serialno," + "formercar.carname as formercarname," + "cir.cirname," + "planbef.planname as bef_planname," + "packetbef.packetname as bef_packetname," + "pos.postname, " + "det.passwd, " + "det.extensionno ";
		var detfrom = "FROM " + OrderDetailFormModel.ORD_TB + " ord " + "LEFT JOIN " + OrderDetailFormModel.ORD_DET_TB + " det ON ord.orderid=det.orderid " + "LEFT JOIN plan_tb plan ON det.plan=plan.planid " + "LEFT JOIN plan_tb planbef ON det.bef_plan=planbef.planid " + "LEFT JOIN packet_tb packet ON det.packet=packet.packetid " + "LEFT JOIN packet_tb packetbef ON det.bef_packet=packetbef.packetid " + "LEFT JOIN user_tb usr ON det.userid=usr.userid " + "LEFT JOIN area_tb area ON det.arid=area.arid AND ord.carid=area.carid " + "LEFT JOIN kousi_pattern_tb kousi ON det.kousi=kousi.patternid " + "LEFT JOIN tel_tb tel ON det.telno=tel.telno AND ord.carid=tel.carid AND ord.pactid=tel.pactid " + "LEFT JOIN tel_rel_assets_tb tra ON tel.telno=tra.telno AND tel.carid=tra.carid AND tel.pactid=tra.pactid AND tra.main_flg=true " + "LEFT JOIN assets_tb asts ON asts.assetsid=tra.assetsid " + "LEFT JOIN circuit_tb cir ON det.cirid=cir.cirid " + "LEFT JOIN post_tb pos ON det.postid=pos.postid " + "LEFT JOIN carrier_tb formercar ON det.formercarid=formercar.carid ";
		var where = "WHERE " + "ord.orderid=" + orderid + " ";
		var ordsub = "ORDER BY sub.detail_sort ";
		var orddet = "ORDER BY det.detail_sort ";
		H_data.order = this.get_DB().queryRowHash(ordsql + ordfrom + where);
		H_data.sub = this.mergeOrderData(this.get_DB().queryHash(detsql + detfrom + where + orddet), this.get_DB().queryHash(subsql + subfrom + where + ordsub));
		return H_data;
	}

	getOrderInfo2(orderid, language = "JPN") //英語化 20090428miya
	//20140828伊達追加
	//20140828伊達追加
	{
		if ("ENG" == language) {
			var buyselname_str = "buy.buyselname_eng AS buyselname";
		} else {
			buyselname_str = "buy.buyselname";
		}

		var billView = new BillingViewBase();
		var lang = billView.getLangLists("billhow");

		if (!language) {
			if ("string" === typeof billView.gSess().language) {
				language = billView.gSess().language;
			} else {
				language = "JPN";
			}
		}

		var ordsql = "SELECT " + "ord.orderid         ," + "ord.orderid_view    ," + "ord.finishdate      ," + "ord.pactid          ," + "ord.postid  as recogpostid," + "ord.postname        ," + "ord.pacttype        ," + "ord.ordertype       ," + "ord.status          ," + "ord.chargerid       ," + "ord.chargername     ," + "ord.shopid          ," + "ord.shopmemid       ," + "ord.salesshopid     ," + "ord.actorder        ," + "ord.actordershopid  ," + "ord.recdate         ," + "ord.carid           ," + "ord.cirid           ," + "ord.pointradio      ," + "ord.point           ," + "ord.pointsum        ," + "ord.applyprice      ," + "ord.billsubtotal    ," + "ord.billtotal       ," + "ord.billtotal2      ," + "ord.stockprice      ," + "ord.billradio       ," + "ord.parent          ," + "ord.billaddress     ," + "ord.dateradio       ," + "ord.datefrom        ," + "ord.dateto          ," + "ord.datechangeradio ," + "ord.datechange      ," + "ord.fee             ," + "ord.sendhow         ," + "ord.sendname        ," + "ord.sendpost        ," + "ord.zip1            ," + "ord.zip2            ," + "ord.addr1           ," + "ord.addr2           ," + "ord.building        ," + "ord.sendtel         ," + "ord.note            ," + "ord.reason          ," + "ord.shopnote        ," + "ord.transfer        ," + "ord.buyselid        ," + "ord.certificate     ," + "ord.certificatelimit," + "ord.matterno        ," + "ord.receipt         ," + "ord.settlement      ," + "ord.slipno          ," + "ord.message         ," + "ord.chpostid        ," + "ord.chpostname      ," + "ord.nextpostid      ," + "ord.nextpostname    ," + "ord.anspost         ," + "ord.ansuser         ," + "ord.ansdate         ," + "ord.destinationcode ," + "ord.salepost        ," + "ord.knowledge       ," + "ord.costprice       ," + "ord.pay_point       ," + "ord.paymentprice    ," + "ord.refercharge     ," + "ord.fixdate         ," + "ord.telcnt          ," + "ord.terminal_del    ," + "ord.service         ," + "ord.misctype        ," + "ord.applypostid     ," + "ord.applyuserid     ," + "stat.forshop,        " + "stat.forcustomer,    " + "car.carname,         " + "cir.cirname,         " + "ptn.ptnname,         " + "ptn.tplfile,         " + "pa.compname,         " + "pa.userid_ini,       " + "area.arid,           " + "area.arname,         " + "shmem.name as memname," + buyselname_str + ",  " + "prsi.signeddate,     " + "ord.disfee,          " + "ord.disfeecharge,    " + "ord.worldtel,        " + "ord.accountcomment,  " + "ord.existcircuit,    " + "ord.tdbcode,         " + "ord.webreliefservice," + "ord.smartphonetype, " + "ord.recoguserid, " + "ord.recogcode, " + "ord.pbpostcode, " + "ord.pbpostcode_first, " + "ord.pbpostcode_second, " + "ord.cfbpostcode, " + "ord.cfbpostcode_first, " + "ord.cfbpostcode_second, " + "ord.ioecode, " + "ord.coecode, " + "ord.commflag, " + "ord.billname, ord.billpost, ord.receiptname, ord.billzip1, ord.billzip2, ord.billaddr1, ord.billaddr2, " + "ord.billbuild, ord.billtel, ord.billhow, " + "ord.chargermail, " + "CASE billhow " + "WHEN 'bank' THEN '" + lang.bank[language] + "' " + "WHEN 'card' THEN '" + lang.card[language] + "' " + "WHEN 'cash' THEN '" + lang.cash[language] + "' " + "ELSE '" + lang.misc[language] + "' " + "END AS billhowview," + "ord.is_not_delete_tel ";
		var ordfrom = "FROM " + OrderDetailFormModel.ORD_TB + " ord " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "INNER JOIN mt_order_pattern_tb ptn ON ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "LEFT JOIN " + OrderDetailFormModel.ORD_DET_TB + " det ON ord.orderid=det.orderid " + "LEFT JOIN pact_tb pa ON ord.pactid=pa.pactid " + "LEFT JOIN circuit_tb cir ON ord.cirid=cir.cirid " + "LEFT JOIN area_tb area ON det.arid=area.arid AND ord.carid=area.carid " + "LEFT JOIN buyselect_tb buy ON ord.buyselid=buy.buyselid " + "LEFT JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + "LEFT JOIN post_rel_shop_info_tb prsi ON prsi.postid=ord.postid ";
		var subsql = "SELECT " + "sub.orderid      ," + "sub.ordersubid   ," + "sub.lineno       ," + "sub.substatus    ," + "sub.salesshopid  ," + "sub.expectflg    ," + "sub.expectdate   ," + "sub.fixdate      ," + "sub.finishdate   ," + "sub.shoppoint    ," + "sub.shoppoint2   ," + "sub.memory       ," + "sub.recovery     ," + "sub.number       ," + "sub.productid    ," + "sub.productname  ," + "sub.property     ," + "sub.branchid     ," + "sub.detail_sort  ," + "sub.subcomment   ," + "sub.machineflg   ," + "sub.anspassprice ," + "sub.saleprice    ," + "sub.deliverydate ," + "sub.totalprice   ," + "sub.fixedtotal   ," + "sub.taxprice     ," + "sub.subtotal     ," + "sub.fixedtaxprice," + "sub.fixedsubtotal," + "sub.recdate," + "sub.productname," + "sub.property," + "prl.dateto," + "stat.forshop," + "stat.forsub, " + "sub.receiptdate, " + "sub.saleprice as saleprice_2," + "sub.fixedsubtotal as fixedsubtotal_2 ";
		var subfrom = "FROM " + OrderDetailFormModel.ORD_TB + " ord " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "LEFT JOIN " + OrderDetailFormModel.ORD_SUB_TB + " sub ON ord.orderid=sub.orderid " + "LEFT JOIN pricelist_tb prl ON sub.pricelistid=prl.pricelistid ";
		var detsql = "SELECT DISTINCT " + "det.orderid         ," + "det.ordersubid      ," + "det.telno           ," + "det.registdate      ," + "det.contractor      ," + "det.holdername      ," + "det.userid          ," + "det.planradio       ," + "det.plan            ," + "det.packetradio     ," + "det.packet          ," + "det.option          ," + "det.waribiki        ," + "det.discounttel     ," + "det.passwd          ," + "det.pay_startdate   ," + "det.pay_monthly_sum ," + "det.pay_frequency   ," + "det.mail            ," + "det.telusername     ," + "det.simcardno as teldetail_simcardno," + "det.employeecode    ," + "det.text1           ," + "det.text2           ," + "det.text3           ," + "det.text4           ," + "det.text5           ," + "det.text6           ," + "det.text7           ," + "det.text8           ," + "det.text9           ," + "det.text10          ," + "det.text11          ," + "det.text12          ," + "det.text13          ," + "det.text14          ," + "det.text15          ," + "det.int1            ," + "det.int2            ," + "det.int3            ," + "det.int4            ," + "det.int5            ," + "det.int6            ," + "det.date1           ," + "det.date2           ," + "det.date3           ," + "det.date4           ," + "det.date5           ," + "det.date6           ," + "det.mail1\t\t\t ," + "det.mail2\t\t\t ," + "det.mail3\t\t\t ," + "det.url1\t\t\t ," + "det.url2\t\t\t ," + "det.url3\t\t\t ," + "det.select1\t\t ," + "det.select2\t\t ," + "det.select3\t\t ," + "det.select4\t\t ," + "det.select5\t\t ," + "det.select6\t\t ," + "det.select7\t\t ," + "det.select8\t\t ," + "det.select9\t\t ," + "det.select10\t\t ," + "det.memo            ," + "det.kousiradio      ," + "det.kousi as kousiid," + "det.detail_sort     ," + "det.machineflg      ," + "det.recdate         ," + "det.fixdate         ," + "det.telorderdate\t," + "det.buytype1        ," + "det.buytype2        ," + "det.pay_balance     ," + "det.formercarid     ," + "det.mnpno           ," + "det.mnp_enable_date ," + "det.freeword1       ," + "det.freeword2       ," + "det.freeword3       ," + "det.freeword4       ," + "det.freeword5       ," + "det.telno_view      ," + "det.number          ," + "det.substatus       ," + "det.shoppoint       ," + "det.shoppoint2      ," + "det.arid AS arid_det," + "tel.simcardno," + "tel.contractdate," + "tel.orderdate," + "tel.arid," + "plan.planname as planname," + "plan.viewflg as planview," + "packet.packetname," + "usr.username," + "area.arname, " + "kousi.patternname as kousiname," + "asts.serialno," + "formercar.carname as formercarname," + "cir.cirname," + "planbef.planname as bef_planname," + "packetbef.packetname as bef_packetname," + "pos.postname, " + "det.passwd, " + "det.extensionno, " + "det.receiptdate as receiptdate," + "det.saleprice as saleprice_2 ";
		var detfrom = "FROM " + OrderDetailFormModel.ORD_TB + " ord " + "LEFT JOIN " + OrderDetailFormModel.ORD_DET_TB + " det ON ord.orderid=det.orderid " + "LEFT JOIN plan_tb plan ON det.plan=plan.planid " + "LEFT JOIN plan_tb planbef ON det.bef_plan=planbef.planid " + "LEFT JOIN packet_tb packet ON det.packet=packet.packetid " + "LEFT JOIN packet_tb packetbef ON det.bef_packet=packetbef.packetid " + "LEFT JOIN user_tb usr ON det.userid=usr.userid " + "LEFT JOIN area_tb area ON det.arid=area.arid AND ord.carid=area.carid " + "LEFT JOIN kousi_pattern_tb kousi ON det.kousi=kousi.patternid " + "LEFT JOIN tel_tb tel ON det.telno=tel.telno AND ord.carid=tel.carid AND ord.pactid=tel.pactid " + "LEFT JOIN tel_rel_assets_tb tra ON tel.telno=tra.telno AND tel.carid=tra.carid AND tel.pactid=tra.pactid AND tra.main_flg=true " + "LEFT JOIN assets_tb asts ON asts.assetsid=tra.assetsid " + "LEFT JOIN circuit_tb cir ON det.cirid=cir.cirid " + "LEFT JOIN post_tb pos ON det.postid=pos.postid " + "LEFT JOIN carrier_tb formercar ON det.formercarid=formercar.carid ";
		var where = "WHERE " + "ord.orderid=" + orderid + " ";
		var ordsub = "ORDER BY sub.detail_sort ";
		var orddet = "ORDER BY det.detail_sort ";
		H_data.order = this.get_DB().queryRowHash(ordsql + ordfrom + where);
		H_data.sub = this.mergeOrderData(this.get_DB().queryHash(detsql + detfrom + where + orddet), this.get_DB().queryHash(subsql + subfrom + where + ordsub));
		return H_data;
	}

	getSmartyTemplate(H_info) {
		var sql = "SELECT tplfile FROM mt_order_pattern_tb WHERE type='" + H_info.type + "' AND cirid=" + H_info.cirid + " AND carid=" + H_info.carid;
		var template = this.get_DB().queryOne(sql);
		template = str_replace(".tpl", "", template) + "_main.tpl";
		return template;
	}

	makeUpdateOrderStatusSQL(H_g_sess: {} | any[], H_sess: {} | any[], H_recog: {} | any[], A_auth: {} | any[], H_order: {} | any[]) //抜けてたので追加 20100531miya
	//お客様情報追加 20091126miya
	//お客様情報追加 20091126miya
	//お客様情報追加 20091126miya
	//お客様情報追加 20100412miya
	//mt_order_tbに書き込むためのSQLを生成
	//メールアドレス
	//mt_order_teldetail_tbに書き込むためのSQLを作成
	//一括プラン変更の除外を他と一緒に変えないようにするためsubstatus=210は除く
	//210だと完了時に区別がつかなくなってしまうので230（キャンセル）に変更 20091126miya
	//mt_order_sub_tbに書き込むためのSQLを作成
	{
		var destinationcode = undefined;
		var salepost = undefined;
		var knowledge = undefined;
		var certificate = undefined;
		var certificatelimit = undefined;
		var matterno = undefined;
		var worldtel = undefined;
		var accountcomment = undefined;
		var existcircuit = undefined;
		var tdbcode = undefined;

		if (H_sess.SELF.answer == "ok") //承認
			//承認権限のあるなし
			//スーパーユーザーは全ての承認ができる権限
			//自動承認 (ケツの||以降) 20101129iga
			//fjpの個別承認のみで受注行き追加(2段目)
			{
				var is_mt_recog = -1 !== A_auth.indexOf("fnc_mt_recog");
				var is_su_all_recog = -1 !== A_auth.indexOf("fnc_su_all_recog");

				if (is_mt_recog && H_recog.postidto == H_g_sess.postid || is_mt_recog && is_su_all_recog && H_g_sess.su || !H_recog.postidto && OrderDetailFormModel.PRIVATE_RECOG_STAT == H_order.order.status || true === H_recog.autorecog) //受注時には売り上げ部門等の情報を取ってきて入れる 20090410miya
					//引数にpactidを入れるべきところを$ordpostを入れていたのを修正 20091009miya
					//ルート部署非表示権限がある会社で、注文部署がルート部署でなければ第二階層の部署を取得
					{
						H_recog.status = 50;
						H_recog.postidto = undefined;
						H_recog.postname = undefined;
						var ansdate = MtDateUtil.getNow();
						var O_Post = new Post();

						if ("" != H_order.order.recogpostid) {
							var ordpost = H_order.order.recogpostid;
						} else {
							ordpost = H_g_sess.postid;
						}

						var rootpostid = O_Post.getRootPostid(H_g_sess.pactid);

						if (true == (-1 !== A_auth.indexOf("fnc_not_view_root")) && ordpost != rootpostid) {
							rootpostid = O_Post.getTargetRootPostid(H_g_sess.pactid, ordpost, "post_relation_tb", 2);
						}

						if ("" != rootpostid) //worldtel,accountcomment,existcircuit追加 20091126miya
							//tdbcode追加 20100412miya
							//第二証明書対応 20100531miya
							//第二証明書対応 20100531miya
							//証明書有効期限抜けてたので追加 20100531miya
							//お客様情報追加 20091126miya
							//お客様情報追加 20091126miya
							//お客様情報追加 20091126miya
							//お客様情報追加 20100412miya
							{
								var prsi_sql = "SELECT pactcode,salepost,knowledge,signedget,signed,signeddate,aobnumber,worldtel,accountcomment,existcircuit,tdbcode,idv_signedget," + "idv_signeduse_0,idv_signed_0,idv_signeddate_0," + "idv_signeduse_1,idv_signed_1,idv_signeddate_1," + "idv_signeduse_2,idv_signed_2,idv_signeddate_2," + "idv_signeduse_3,idv_signed_3,idv_signeddate_3," + "idv_signeduse_4,idv_signed_4,idv_signeddate_4," + "idv_signeduse_5,idv_signed_5,idv_signeddate_5," + "idv_signeduse_6,idv_signed_6,idv_signeddate_6," + "idv_signeduse_7,idv_signed_7,idv_signeddate_7," + "idv_signeduse_8,idv_signed_8,idv_signeddate_8," + "idv_signeduse_9,idv_signed_9,idv_signeddate_9" + " FROM post_rel_shop_info_tb WHERE pactid=" + H_g_sess.pactid + " AND postid=" + rootpostid + " AND shopid=" + H_sess[OrderDetailFormModel.PUB].shopid;
								var H_prsi = this.get_DB().queryRowHash(prsi_sql);
								destinationcode = H_prsi.pactcode;
								salepost = H_prsi.salepost;
								knowledge = H_prsi.knowledge;
								var A_certificate = Array();

								if ("anytime" != H_prsi.signedget) //随時取得でなければ第一証明書セット
									{
										if ("" != String(H_prsi.signed)) {
											A_certificate.push(H_prsi.signed);
											A_certificate.push("----------------------------------------");
										}
									}

								if ("anytime" != H_prsi.idv_signedget) //随時取得でなければ第二証明書セット
									{
										for (var ci = 0; ci < 10; ci++) {
											var idv_isset = false;

											if ("" != String(H_prsi["idv_signeduse_" + ci])) {
												A_certificate.push(H_prsi["idv_signeduse_" + ci]);
												idv_isset = true;
											}

											if ("" != String(H_prsi["idv_signed_" + ci])) {
												A_certificate.push(H_prsi["idv_signed_" + ci]);
												idv_isset = true;
											}

											if ("" != String(H_prsi["idv_signeddate_" + ci])) {
												A_certificate.push(H_prsi["idv_signeddate_" + ci]);
												idv_isset = true;
											}

											if (true == idv_isset) {
												A_certificate.push("----------------------------------------");
											}
										}
									}

								if (0 < A_certificate.length) {
									certificate = join("\n", A_certificate);
								} else {
									certificate = undefined;
								}

								certificatelimit = undefined;

								if (undefined != certificate && undefined != H_prsi.signeddate) {
									certificatelimit = H_prsi.signeddate;
								}

								matterno = H_prsi.aobnumber;
								worldtel = H_prsi.worldtel;
								accountcomment = H_prsi.accountcomment;
								existcircuit = H_prsi.existcircuit;
								tdbcode = H_prsi.tdbcode;
							}
					} else //if((in_array("fnc_mt_recog", $A_auth) == true && $H_recog["postidto"] == $H_g_sess["postid"] && $H_actord["actorder"] != true)
					{
						H_recog.status = 10;
						ansdate = MtDateUtil.getNow();
					}
			} else if (H_sess.SELF.answer == "30") //却下
			{
				H_recog.status = 30;
				H_recog.postidto = undefined;
				H_recog.postname = undefined;
				ansdate = MtDateUtil.getNow();
			} else //保留
			{
				H_recog.status = 20;

				if (5 == H_order.order.status) {
					H_recog.status = OrderDetailFormModel.PRIVATE_HOLD_STAT;
				}

				ansdate = undefined;
			}

		if ("" != H_g_sess.userid) //販売店からのメールを受け取る設定のみメールアドレスを入れる
			//最終承認時のみrecogmailを入れる
			{
				var get_selfmail_sql = "SELECT user_tb.mail, user_tb.acceptmail5 FROM user_tb WHERE userid=" + H_g_sess.userid;
				var H_selfmail = this.get_DB().queryRowHash(get_selfmail_sql);

				if (H_selfmail.mail != "" && H_selfmail.acceptmail5 == 1) {
					var selfmailstr = H_selfmail.mail;
				} else {
					selfmailstr = undefined;
				}

				if (50 == H_recog.status) {
					var recogmail = selfmailstr;
				} else {
					recogmail = undefined;
				}
			}

		var upd_sql = "UPDATE mt_order_tb SET " + (upd_sql += "status=" + H_recog.status + ",");
		upd_sql += "chpostid=" + this.get_DB().dbQuote(H_g_sess.postid, "integer", false) + ",";
		upd_sql += "chpostname=" + this.get_DB().dbQuote(H_g_sess.postname, "text", false) + ",";

		if (H_sess.SELF.answer != 20) //保留のときはnextpostid,nextpostname据え置き
			{
				upd_sql += "nextpostid=" + this.get_DB().dbQuote(H_recog.postidto, "integer", false) + ",";
				upd_sql += "nextpostname=" + this.get_DB().dbQuote(H_recog.postname, "text", false) + ",";
			}

		if (50 == H_recog.status && "" != recogmail) //最終承認のときはrecogmail入れる
			{
				upd_sql += "recogmail=" + this.get_DB().dbQuote(recogmail, "text", false) + ",";
			}

		if (50 == H_recog.status) //上のrecogmailと条件が一緒だったのを修正 20100408miya
			//お客様情報追加 20091126miya
			//お客様情報追加 20091126miya
			//お客様情報追加 20091126miya
			//お客様情報追加 20100412miya
			{
				upd_sql += "destinationcode=" + this.get_DB().dbQuote(destinationcode, "text", false) + ",";
				upd_sql += "salepost=" + this.get_DB().dbQuote(salepost, "text", false) + ",";
				upd_sql += "knowledge=" + this.get_DB().dbQuote(knowledge, "text", false) + ",";
				upd_sql += "certificate=" + this.get_DB().dbQuote(certificate, "text", false) + ",";
				upd_sql += "certificatelimit=" + this.get_DB().dbQuote(certificatelimit, "timestamp", false) + ",";
				upd_sql += "matterno=" + this.get_DB().dbQuote(matterno, "text", false) + ",";
				upd_sql += "worldtel=" + this.get_DB().dbQuote(worldtel, "text", false) + ",";
				upd_sql += "accountcomment=" + this.get_DB().dbQuote(accountcomment, "text", false) + ",";
				upd_sql += "existcircuit=" + this.get_DB().dbQuote(existcircuit, "text", false) + ",";
				upd_sql += "tdbcode=" + this.get_DB().dbQuote(tdbcode, "text", false) + ",";
			}

		upd_sql += "anspost=" + this.get_DB().dbQuote(H_g_sess.postname, "text", false) + ",";
		upd_sql += "ansuser=" + this.get_DB().dbQuote(H_g_sess.loginname, "text", false) + ",";
		upd_sql += "ansdate=" + this.get_DB().dbQuote(ansdate, "timestamp", false) + " ";
		upd_sql += "WHERE orderid = " + H_sess[OrderDetailFormModel.PUB].orderid + ";";
		var det_sql = "UPDATE mt_order_teldetail_tb SET substatus= " + H_recog.status + " ";
		det_sql += "WHERE orderid = " + H_sess[OrderDetailFormModel.PUB].orderid + " AND substatus != 230;";
		var sub_sql = "UPDATE mt_order_sub_tb SET substatus= " + H_recog.status + " ";
		sub_sql += "WHERE orderid = " + H_sess[OrderDetailFormModel.PUB].orderid + ";";
		return upd_sql + " " + det_sql + " " + sub_sql;
	}

	makeInsertOrderHistorySQL(H_g_sess: {} | any[], H_sess: {} | any[], H_recog: {} | any[]) //自動承認 201129iga
	{
		var ansdate = MtDateUtil.getNow();
		var answer = "";

		if (undefined !== H_recog.status) {
			var status = H_recog.status;
		} else {
			if (H_sess.SELF.answer == "ok") {
				status = 50;
			} else if (H_sess.SELF.answer == "20") {
				status = 20;
			} else if (H_sess.SELF.answer == "30") {
				status = 30;
			}
		}

		var chname = H_g_sess.loginname;
		var ins_sql = "INSERT INTO mt_order_history_tb (orderid,chpostid,chpostname,chname,chuserid,chdate,answercomment,status) ";
		ins_sql += "VALUES(";
		ins_sql += H_sess[OrderDetailFormModel.PUB].orderid + ",";
		ins_sql += this.get_DB().dbQuote(H_g_sess.postid, "integer", false) + ",";
		ins_sql += this.get_DB().dbQuote(H_g_sess.postname, "text", false) + ",";
		ins_sql += this.get_DB().dbQuote(chname, "text", false) + ",";
		ins_sql += this.get_DB().dbQuote(H_g_sess.userid, "integer", false) + ",";
		ins_sql += this.get_DB().dbQuote(ansdate, "timestamp", true) + ",";
		ins_sql += this.get_DB().dbQuote(H_sess.SELF.answercomment, "text", false) + ",";
		ins_sql += this.get_DB().dbQuote(status, "integer", false);
		ins_sql += ")";
		return ins_sql;
	}

	updateOrderStatusSQL(upd_sql) //sql文がなければ処理しない
	{
		if ("" != upd_sql) {
			this.get_DB().exec(upd_sql);
			return true;
		} else {
			var str = "OrderDetailFormModel::mt_order_tb\u306Esql\u672A\u5B9A\u7FA9";
		}

		this.get_DB().rollback();
		this.errorOut(0, str, false, "../Menu/menu.php");
		return false;
	}

	insertOrderHistorySQL(hist_sql) //sql文がなければ処理しない
	{
		if ("" != hist_sql) {
			this.get_DB().exec(hist_sql);
			return true;
		} else {
			var str = "OrderDetailFormModel::mt_order_history_tb\u306Esql\u672A\u5B9A\u7FA9";
		}

		this.get_DB().rollback();
		this.errorOut(0, str, false, "../Menu/menu.php");
		return false;
	}

	execUpdateOrderStatus(upd_sql, hist_sql) //transaction開始
	{
		this.get_DB().beginTransaction();
		this.updateOrderStatusSQL(upd_sql);
		this.insertOrderHistorySQL(hist_sql);

		if (!!extension_sql) {
			this.updateOrderStatusSQL(extension_sql);
		}

		this.get_DB().commit();
	}

	getOrderHistory(H_sess) //order_historyを読み込む
	{
		var hist_sql = "SELECT " + "hist.status as status_no," + "hist.chpostid," + "hist.chpostname," + "hist.chname," + "hist.chdate," + "hist.answercomment," + "hist.shopid," + "hist.shopname," + "hist.shopperson," + "hist.shopcomment," + "stat.forcustomer " + "FROM " + "mt_order_history_tb hist INNER JOIN mt_status_tb  stat ON hist.status=stat.status " + "WHERE " + "hist.orderid=" + H_sess[OrderDetailFormModel.PUB].orderid + " " + " AND hist.is_shop_comment != true " + "ORDER BY " + "hist.chdate";
		var H_history = this.get_DB().queryHash(hist_sql);
		return H_history;
	}

	updateBulkplan(updtype, orderid, telno) //まずdetail_sort取得
	//最新の振替先販売店を取得
	//sql文がなければ処理しない
	//$cnt_sql追加 20100317miya
	{
		var upd_sql = "";

		if ("del" == updtype) //210だと完了時に区別がつかなくなってしまうので230（キャンセル）に変更 20091126miya
			{
				upd_sql = "UPDATE mt_order_teldetail_tb SET substatus=230 WHERE orderid=" + orderid + " AND telno='" + telno + "'";
			} else if ("recover" == updtype) {
			var sql = "SELECT status FROM mt_order_tb WHERE orderid=" + orderid;
			var status = this.get_DB().queryOne(sql);

			if ("" != status) {
				upd_sql = "UPDATE mt_order_teldetail_tb SET substatus=" + status + " WHERE orderid=" + orderid + " AND telno='" + telno + "'";
			}
		}

		var cnt_sql = "";
		var detail_sort = this.get_DB().queryOne("SELECT detail_sort FROM mt_order_teldetail_tb WHERE orderid=" + orderid + " AND telno='" + telno + "'");

		if (true == is_numeric(detail_sort)) //振替テーブルに情報がなかったらmt_order_tbのshopidを引いてくる
			{
				var shopid = this.get_DB().queryOne("SELECT toshopid FROM mt_transfer_tb WHERE orderid=" + orderid + " AND detail_sort=" + detail_sort + " ORDER BY transfer_level DESC LIMIT 1");

				if (false == is_numeric(shopid)) {
					shopid = this.get_DB().queryOne("SELECT shopid FROM mt_order_tb WHERE orderid=" + orderid);
				}

				if (true == is_numeric(shopid)) {
					var maccnt_str = "";

					if ("del" == updtype) {
						maccnt_str += "maccnt=maccnt-1";
					} else if ("recover" == updtype) {
						maccnt_str += "maccnt=maccnt+1";
					}

					if ("" != maccnt_str) {
						cnt_sql = "UPDATE mt_transfer_charge_shop_tb SET " + maccnt_str + " WHERE orderid=" + orderid + " AND shopid=" + shopid;
					}
				}
			}

		this.get_DB().beginTransaction();

		if ("" != upd_sql && "" != cnt_sql) {
			this.get_DB().exec(upd_sql);
			this.get_DB().exec(cnt_sql);
			this.get_DB().commit();
			return true;
		} else {
			var str = "\u4E00\u62EC\u30D7\u30E9\u30F3\u5909\u66F4\u306E\u9664\u5916\u30FB\u623B\u3057\u51E6\u7406\u306Esql\u672A\u5B9A\u7FA9";
		}

		this.get_DB().rollback();
		this.errorOut(0, str, false, "../Menu/menu.php");
		return false;
	}

	getApplyAndRecogMail(applyuser, recoguser) {
		var A_mail = Array();

		if ("" != applyuser && "" != recoguser) {
			var mail_sql = "SELECT applyuser.mail AS applymail, applyuser.username AS applyname, applyuser.acceptmail4 AS applyaccept, applyuser.acceptmail5 AS applyacceptshop,";
			mail_sql += " recoguser.mail AS recogmail, recoguser.username AS recogname, recoguser.acceptmail4 AS recogaccept, recoguser.acceptmail5 AS recogacceptshop";
			mail_sql += " FROM user_tb applyuser, user_tb recoguser";
			mail_sql += " WHERE applyuser.userid=" + applyuser;
			mail_sql += " AND recoguser.userid=" + recoguser;
		} else if ("" == applyuser && "" != recoguser) {
			mail_sql = "SELECT null AS applymail, null AS applyname, null AS applyaccept, null AS applyacceptshop,";
			mail_sql += " recoguser.mail AS recogmail, recoguser.username AS recogname, recoguser.acceptmail4 AS recogaccept, recoguser.acceptmail5 AS recogacceptshop";
			mail_sql += " FROM user_tb applyuser, user_tb recoguser";
			mail_sql += " WHERE recoguser.userid=" + recoguser;
		} else if ("" != applyuser && "" == recoguser) {
			mail_sql = "SELECT applyuser.mail AS applymail, applyuser.username AS applyname, applyuser.acceptmail4 AS applyaccept, applyuser.acceptmail5 AS applyacceptshop,";
			mail_sql += " null AS recogmail, null AS recogname, null AS recogaccept, null AS recogacceptshop";
			mail_sql += " FROM user_tb applyuser, user_tb recoguser";
			mail_sql += " WHERE applyuser.userid=" + applyuser;
		}

		if ("" != mail_sql) //メールを受け取らない設定だったら空にする
			{
				A_mail = this.get_DB().queryRowHash(mail_sql);

				if (A_mail.applymail != "" && A_mail.applyacceptshop != 1) {
					A_mail.applymail = undefined;
				}

				if (A_mail.recogmail != "" && A_mail.recogacceptshop != 1) {
					A_mail.recogmail = undefined;
				}
			}

		return A_mail;
	}

	getFirstPrice(orderid) //productid,productname追加 20100701miya
	{
		var sql = "SELECT orderid,ordersubid,lineno,anspassprice,number,subtotal,machineflg, productid, productname from mt_order_sub_tb where orderid=" + orderid;
		var H_firstprice = this.get_DB().queryHash(sql);
		return H_firstprice;
	}

	settingOrderMail(O_view, H_g_sess, H_sess, A_auth, H_mailparam, H_order, H_view) //部署ツリー文字列取得（第二階層対応）
	//空白にしておけば共通メール設定のデフォルトメールアドレスが入る
	//$from_name = $H_view["compname"] . " " . $H_view["posttreestr"] . " " . $H_order["order"]["chargerid"];
	//販売店側受付メール
	//$H_addr = $this->getReceiptMailSendList($H_order["order"]["chargerid"], $H_view["posttreestr"], $H_order["order"]["chargername"]);
	//申請者(注文者にメール送る)
	//申請者の言語取得 20090417miya
	//証明書警告メール 20100608miya
	//ルート部署非表示権限がある会社で、自分がルート部署でなければ第二階層の部署を取得
	{
		var O_post = new PostModel();
		var H_param_for_tree = H_view;
		H_param_for_tree.recogpostid = H_order.order.recogpostid;
		H_param_for_tree.rootpostid = O_post.getRootPostid(H_g_sess.pactid);
		H_param_for_tree.postname = O_post.getPostNameOne(H_order.order.recogpostid);
		H_view.posttreestr = O_view.makePosttreeband(H_sess, H_g_sess, H_param_for_tree, A_auth);
		var H_addr = Array();
		var from = "";
		var from_name = this.getSystemName(H_g_sess.groupid, H_g_sess.language, H_mailparam.pacttype);
		var H_shop = {
			shopid: H_order.order.shopid,
			memid: H_order.order.shopmemid
		};
		H_addr = Array();
		H_addr = this.getOrderMailSendList(H_shop);
		var H_mailcontent = this.orderMailWrite("order", H_mailparam, H_order.order.shopid, "JPN");
		this.sendOrderMail(H_mailcontent, H_addr, from, from_name);
		H_addr = Array();
		H_addr = Array();
		var mail = this.getReceiveOrderMail(H_g_sess.pactid, H_order.order.chargerid, H_view.posttreestr, H_order.order.chargername, H_order.order.chargermail);

		if (!!mail) {
			H_addr.push(mail);
		}

		var language = this.getUserLanguage(H_order.order.chargerid);
		H_mailcontent = this.orderMailWrite("receipt", H_mailparam, H_order.order.shopid, language);

		if (this.O_fjp.checkAuth("co")) {
			var recogmail = this.getRecogUserMail(H_g_sess.userid);

			if ("string" === typeof recogmail) {
				H_addr.push({
					to_name: H_view.posttreestr + H_g_sess.loginname,
					to: recogmail
				});
			}
		}

		this.sendOrderMail(H_mailcontent, H_addr, from, from_name);
		var rootpostid = O_post.getRootPostid(H_g_sess.pactid);

		if (true == (-1 !== A_auth.indexOf("fnc_not_view_root")) && H_order.order.recogpostid != rootpostid) {
			rootpostid = O_post.getTargetRootPostid(H_g_sess.pactid, H_order.order.recogpostid, "post_relation_tb", 2);
		}

		var H_sd = this.getSignedDate(H_g_sess, H_sess, rootpostid);
		var signed_warn = this.makeSignedWarn(H_sd);
		H_mailparam.signed_warn = signed_warn;

		if ("" != signed_warn) {
			H_addr = Array();
			H_addr = this.getSignedWarnMailSendList(H_sess[OrderDetailFormModel.PUB], H_g_sess, rootpostid);
			H_mailcontent = this.orderMailWrite("signedwarn", H_mailparam, H_sess[OrderDetailFormModel.PUB].shopid, "JPN");
			this.sendOrderMail(H_mailcontent, H_addr, from, from_name);
		}
	}

	getRecogUserMail(userid) {
		var sql = "SELECT " + "mail " + "FROM " + "user_tb " + "WHERE " + "acceptmail5 = 1" + " AND userid=" + this.get_DB().dbQuote(userid, "int", true);
		var mail = this.get_DB().queryOne(sql);

		if (!mail) {
			return false;
		}

		return mail;
	}

	releaseExtensionNo(H_order) {
		var result = "";

		if ("N" == H_order.order.ordertype || "Nmnp" == H_order.order.ordertype) {
			require("model/ExtensionTelModel.php");

			var O_extension = this.getExtensionObject();
			{
				let _tmp_0 = H_order.sub;

				for (var key in _tmp_0) {
					var val = _tmp_0[key];

					if (val.machineflg && !!val.extensionno) {
						var tmp = O_extension.makeDeleteExtensionNoSQL(H_order.order.pactid, val.extensionno);

						if (!!tmp) {
							result += tmp + ";";
							tmp = "";
						}
					}
				}
			}
		}

		return result;
	}

	getExtensionObject() {
		if (!this.O_extension instanceof ExtensionTelModel) {
			this.O_extension = new ExtensionTelModel();
		}

		return this.O_extension;
	}

	__destruct() {
		super.__destruct();
	}

};