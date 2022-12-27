//
//注文用Model簡易モデル
//
//更新履歴：<br>
//
//@package Order
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2011/03/02
//
//
//
//注文用Model簡易モデル
//
//更新履歴：<br>
//
//@package Order
//@subpackage Model
//@author houshiyama
//@since 2011/03/02
//

require("model/ModelBase.php");

//
//__construct
//
//@author
//@since 2011/03/02
//
//@access public
//@return void
//
//
//getApplyuserid
//
//@author
//@since 2011/03/02
//
//@param mixed $orderid
//@access public
//@return void
//
//
//getApplyuserid
//
//@author
//@since 2011/03/01
//
//@param mixed $orderid
//@access public
//@return void
//
//
//添付ファイルが削除対象のorderid取得
//
//@author houshiyama
//@since 2011/03/02
//
//@access public
//@return void
//
//
//signedAttachFlag
//
//@author
//@since 2011/02/16
//
//@param mixed $orderid
//@param mixed $flag
//@access public
//@return void
//
//
//signedAttachShopFlag
//
//@author
//@since 2011/02/17
//
//@param mixed $orderid
//@param mixed $flag
//@access public
//@return void
//
//
//signedAttachDelete
//
//@author ishizaki
//@since 2011/03/03
//
//@param mixed $orderid
//@param mixed $flag
//@access public
//@return void
//
//
//uploadAble
//
//@author ishizaki
//@since 2011/03/03
//
//@param mixed $orderid
//@access public
//@return void
//
//
//getOrderStatus
//
//@author igarashi
//@since 2011/04/04
//
//@param mixed $orderid
//@access public
//@return void
//
class OrderLightModel extends ModelBase {
	constructor() {
		super();
	}

	getApplyuserid(orderid) {
		var sql = "select applyuserid from mt_order_tb where orderid = " + this.getDB().dbQuote(orderid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getChargerid(orderid) {
		var sql = "select chargerid from mt_order_tb where orderid = " + this.getDB().dbQuote(orderid, "integer", true);
		return this.getDB().queryOne(sql);
	}

	getDeletableAttachFilesOrderid() {
		var targetDate = date("Y-m-d H:i:s", mktime(0, 0, 0, date("m") - 3, date("d"), date("Y")));
		var sql = "SELECT orderid FROM mt_order_tb WHERE completedate < '" + targetDate + "' AND status in (30, 210, 220, 230) AND attachdelete = false";
		return this.getDB().queryCol(sql);
	}

	signedAttachFlag(orderid, flag = true) {
		var sql = "UPDATE mt_order_tb SET attachedfile = " + this.getDB().dbQuote(flag, "boolean", true) + " WHERE orderid = " + this.getDB().dbQuote(orderid, "integer", true);
		return this.getDB().exec(sql);
	}

	signedAttachShopFlag(orderid, flag = true) {
		var sql = "UPDATE mt_order_tb SET attachedshop = " + this.getDB().dbQuote(flag, "boolean", true) + " WHERE orderid = " + this.getDB().dbQuote(orderid, "integer", true);
		return this.getDB().exec(sql);
	}

	signedAttachDelete(orderid, flag = true) {
		var sql = "UPDATE mt_order_tb SET attachdelete = " + this.getDB().dbQuote(flag, "boolean", true) + " WHERE orderid = " + this.getDB().dbQuote(orderid, "integer", true);
		return this.getDB().exec(sql);
	}

	unUploadAble(orderid) {
		var sql = "SELECT orderid FROM mt_order_tb WHERE orderid = " + this.getDB().dbQuote(orderid, "integer", true) + " AND status in ( 210, 220, 230) AND completedate <= " + this.getDB().dbQuote(date("Y-m-d", strtotime("-3 month")), "string", true);
		return this.getDB().queryOne(sql);
	}

	getOrderStatus(orderid) {
		if (!!orderid) {
			var sql = "SELECT status FROM mt_order_tb WHERE orderid=" + this.getDB().dbQuote(orderid, "int", true);
			return this.getDB().queryOne(sql);
		}

		return 0;
	}

};