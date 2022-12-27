//MtAdminLoginで使用するモデル

import LoginModel from "./LoginModel";

export default class AdminLoginModel extends LoginModel {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getUserInfo(admin_shopid: number) //$this->getOut()->debugOut( $sql );
	{
		if (!isNaN(Number(admin_shopid)) == false) {
			this.getOut().errorOut(5, "AdminショップID(admin_shopid)が正しく指定されていません", 0);
		}

		const sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.name," + "shop_member_tb.mail," + "shop_tb.postcode," + "shop_member_tb.name," + "shop_tb.fiscalmonth " + "from " + "shop_tb " + " inner join shop_member_tb on shop_tb.memid = shop_member_tb.memid " + "where " + "shop_tb.shopid = " + admin_shopid;
		return this.getDB().queryRowHash(sql);
	}

	getUserInfoAll(userid_ini = "", loginid = "") //$this->getOut()->debugOut( $sql );
	{
		if (loginid == "") {
			this.getOut().errorOut(5, "販売店コード(userid_ini)、ログインID(loginid)が正しく指定されていない", false);
		}

		const sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.passwd," + "shop_tb.name," + "shop_member_tb.name," + "shop_member_tb.mail," + "shop_tb.postcode," + "shop_tb.fiscalmonth " + "from " + "shop_tb inner join shop_member_tb on shop_tb.memid = shop_member_tb.memid " + "where " + "shop_tb.loginid = '" + loginid + "' " + "and shop_tb.type = 'A' " + "and shop_tb.delflg = false";
		return this.getDB().queryRowHash(sql);
	}

};
