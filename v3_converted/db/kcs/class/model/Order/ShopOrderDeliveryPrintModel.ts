//
//受注詳細用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author date
//@since 2014/09/29
//@uses OrderModel
//@uses OrderUtil
//
//
//
//納品書印刷Model
//
//@uses ModelBase
//@package Order
//@author date
//@since 2014/09/29
//

require("ShopOrderDetailModel.php");

//
//getOrderInfo
//注文情報を引き出す
//@author web
//@since 2017/11/08
//
//@param mixed $orderid
//@access public
//@return void
//
//
//デストラクタ
//
//@author date
//@since 2014/09/29
//
//@access public
//@return void
//
class ShopOrderDeliveryPrintModel extends ShopOrderDetailModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
	}

	getOrderInfo(orderid) {
		var sql = "select" + " ord.orderid" + ",ord.ordertype" + ",ord.zip1 as ord_zip1" + ",ord.zip2 as ord_zip2" + ",ord.addr1 as ord_addr1" + ",ord.addr2 as ord_addr2" + ",ord.building as ord_building" + ",ord.sendname as ord_sendname" + ",ord.sendpost as ord_sendpost" + ",ord.sendhow" + ",ord.slipno" + ",ord.carid" + ",car.carname" + ",shop.shopid" + ",shop.groupid" + ",shop.postcode" + ",shop.loginid" + ",shop.name as shopname" + ",shop.zip" + ",shop.pref" + ",shop.addr" + ",shop.build" + ",shop.tel" + ",shop.fax" + ",shop.fiscalmonth" + ",shop.companyname" + ",shop.memid as def_memid" + ",mem.name as person" + ",mem.mail as personmail " + " from" + " mt_order_tb as ord" + " inner join carrier_tb car on car.carid = ord.carid" + " inner join shop_tb  shop on shop.shopid=ord.shopid" + " left join shop_member_tb mem on" + " shop.shopid = mem.shopid" + " and shop.memid = mem.memid" + " and mem.type='SU' " + " where" + " ord.orderid = " + this.getDB().dbQuote(orderid, "integer", true);
		return this.get_DB().queryRowHash(sql);
	}

	getOrderDetails(orderid) //注文情報を返すよ
	{
		var sql = "select" + " CASE WHEN sub.machineflg THEN sub.ordersubid || '_' || det.detail_sort ELSE sub.ordersubid || '' END as id" + ",sub.productname" + ",sub.ordersubid" + ",sub.number" + ",sub.machineflg" + ",sub.property" + ",det.telno" + ",det.orderid" + ",det.detail_sort" + ",det.contractor" + ",det.serialno" + ",CASE WHEN sub.machineflg THEN det.saleprice ELSE sub.saleprice END as price" + ",CASE WHEN sub.machineflg THEN det.shoppoint ELSE sub.shoppoint END as point" + ",CASE WHEN sub.machineflg THEN det.shoppoint2 ELSE sub.shoppoint2 END as point2" + ",CASE WHEN sub.machineflg THEN det.deliverydate ELSE sub.deliverydate END as deliverydate" + ",CASE WHEN sub.machineflg THEN det.substatus ELSE sub.substatus END as substatus" + " from" + " mt_order_sub_tb as sub" + " LEFT JOIN mt_order_teldetail_tb det on det.orderid=sub.orderid and det.ordersubid = sub.ordersubid" + " where" + " sub.orderid=" + this.getDB().dbQuote(orderid, "integer", true) + " order by" + " sub.ordersubid" + ",det.detail_sort";
		return this.get_DB().queryKeyAssoc(sql);
	}

	__destruct() {
		super.__destruct();
	}

};