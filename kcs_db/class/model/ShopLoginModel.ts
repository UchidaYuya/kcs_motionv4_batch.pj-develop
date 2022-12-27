//MtShopLoginで使用するモデル
//@filesource
//@package Base
//@subpackage Login
//@author nakanita
//@since 2008/04/17
import LoginModel from '../model/LoginModel';

export default class ShopLoginModel extends LoginModel {
	constructor(O_db = undefined) {
		super(O_db);
	}

	getUserInfo(memid) {
		if (!isNaN(Number(memid))== false) {
			this.getOut().errorOut(5, "ショップメンバーID(memid)が正しく指定されていません", 0);
		}

// 2022cvt_015
		var sql = "select " + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.postcode," + "shop_tb.name as shopname," + "shop_member_tb.memid, " + "shop_member_tb.name as personname, " + "shop_member_tb.mail as ownermail, " + "shop_tb.fiscalmonth " + "from " + "(shop_member_tb inner join shop_tb on shop_member_tb.shopid = shop_tb.shopid) " + "where " + "shop_member_tb.memid = " + memid + " and shop_tb.delflg = false";
		return this.getDB().queryRowHash(sql);
	}

	getUserInfoAll(userid_ini: string, loginid: string, groupid: string) //$this->getOut()->debugOut( $sql );
	{
		if (userid_ini == "" || loginid == "") {
			this.getOut().errorOut(5, "販売店コード(userid_ini)、ログインID(loginid)が正しく指定されていない", false);
		}

		if (!isNaN(Number(groupid)) == false) {
			this.getOut().errorOut(5, "グループID(groupid)が正しく指定されていない", false);
		}

// 2022cvt_016
// 2022cvt_015
		var sql = "select " + "shop_member_tb.memid," + "shop_member_tb.name," + "shop_tb.shopid," + "shop_tb.groupid," + "shop_tb.postcode," + "shop_tb.name as shopname," + "shop_member_tb.name as personname, " + "shop_member_tb.mail as ownermail, " + "shop_member_tb.passwd, " + "shop_member_tb.miscount, " + "shop_member_tb.type as usertype, " + "shop_tb.fiscalmonth " + "from " + "shop_member_tb inner join shop_tb on shop_member_tb.shopid = shop_tb.shopid " + "where " + "shop_tb.loginid = '" + userid_ini + "' " + "and shop_tb.groupid = " + groupid + " " + "and shop_member_tb.loginid = '" + loginid + "' " + "and shop_tb.type != 'A' " + "and shop_tb.delflg = false";
		return this.getDB().queryRowHash(sql);
	}

	getIpRestrict(shopid: any) {
		if (!isNaN(Number(shopid)) == false) {
			this.getOut().errorOut(5, "ショップID(shopid)が正しく指定されていません", false);
		}

// 2022cvt_016
// 2022cvt_015
		var sql = "select " + "net," + "start_time," + "end_time," + "week," + "type " + "from " + "shop_ip_restrict_tb " + "where " + "shopid = " + shopid + " " + "order by " + "sort";
		return this.getDB().queryHash(sql);
	}

	async setLoginSessInfo(shopid: any, memid: any, sess_id: any) //まず $shopid, $memid だけで検索を行う
	//他に無ければ新規作成
	{
// 2022cvt_015
		var A_pact_user_num = await this.getLoginSessInfo(shopid, memid);

		if (A_pact_user_num.length == 0) {
// 2022cvt_015
			var pact_user_sql = "INSERT INTO shop_login_rel_sess_tb(shopid, memid, sess)values(" + shopid + "," + memid + ",'" + sess_id + "')";
// 2022cvt_015
			var cnt = this.getDB().exec(pact_user_sql);
		} else if (A_pact_user_num.length == 1) {
			pact_user_sql = "UPDATE shop_login_rel_sess_tb SET sess = '" + sess_id + "' WHERE shopid = " + shopid + " and memid = " + memid;
			cnt = this.getDB().exec(pact_user_sql);
		} else //２つ以上セッションがあった、これは異常
			{
				return 0;
			}

		return cnt;
	}

	getLoginSessInfo(shopid: string | number, memid: string | number, sess_id = "") //セッションID条件
	{
// 2022cvt_015
		var pact_user_sql = "SELECT * FROM shop_login_rel_sess_tb " + " WHERE shopid = " + shopid + " AND memid = " + memid;

		if (sess_id != "") {
			pact_user_sql += " AND sess ='" + sess_id + "'";
		}

		return this.getDB().queryHash(pact_user_sql);
	}

	getLoginPasschanged(memid: number) {
// 2022cvt_015
		var sql = "select passchanged from shop_member_tb where memid = " + memid;
		return this.getDB().queryOne(sql);
	}

	getMiscount(shopid: string, memid: string) //$this->debugOut( $sql );
	{
// 2022cvt_015
		var sql = "select " + "miscount " + "from " + "shop_member_tb " + "where " + "shopid = " + shopid + " and memid = " + memid;
		return this.getDB().queryOne(sql);
	}

	async setMiscount(shopid: string, memid: string, flag: boolean) //成功
	{
		if (flag == true) {
// 2022cvt_015
			var cnt = await this.getMiscount(shopid, memid);
			cnt++;
		} else {
			cnt = 0;
		}

// 2022cvt_015
		var sql = "update shop_member_tb set miscount = " + cnt + " where " + " shopid = " + shopid + " and memid = " + memid;
// 2022cvt_015
		var ret_line = await this.getDB().exec(sql);

		if (ret_line != 1) //更新された数が１ではない
			//失敗
			{
				return -1;
			}

		return cnt;
	}
};
