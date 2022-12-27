//
//Voltaユーザ取込処理 （Model）
//
//更新履歴：<br>
//2010/08/05 石崎公久 作成
//
//@package script
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@filesource
//@since 2010/08/05
//@uses ImportVoltaModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//Voltaユーザ取込処理 （Model）
//
//@uses ModelBase
//@package script
//@author ishizaki
//@since 2010/08/05
//

require("model/script/ImportVoltaModel.php");

//
//evユーザの情報を更新または登録
//
//@author
//@since 2010/08/06
//
//@param array $userDetails
//@access public
//@return void
//
class ImportVoltaUserModel extends ImportVoltaModel {
	saveUserData(userDetails: {} | any[]) {
		var res = this.getPactidRootPostIdFromAgentIdPactcode(userDetails.agentid, userDetails.pactcode);

		if (is_null(res)) {
			throw new Error("agentid:" + userDetails.agentid + ", pactcode:" + userDetails.pactcode + "\u306B\u8A72\u5F53\u3059\u308B\u9867\u5BA2\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
		}

		var name = undefined !== userDetails.name ? userDetails.name : undefined;
		var delete_flg = undefined !== userDetails.enableflg ? false : true;
		var carno = undefined !== userDetails.carno ? userDetails.carno : undefined;
		var carname = undefined !== userDetails.carname ? userDetails.carname : undefined;
		var telno = undefined !== userDetails.telno ? userDetails.telno : undefined;
		var mail = undefined !== userDetails.mail ? userDetails.mail : undefined;
		var zip = undefined !== userDetails.zip ? userDetails.zip : undefined;
		var addr1 = undefined !== userDetails.addr1 ? userDetails.addr1 : undefined;
		var addr2 = undefined !== userDetails.addr2 ? userDetails.addr2 : undefined;
		var building = undefined !== userDetails.building ? userDetails.building : undefined;
		var exist = this.getEvModel().isExistEv(userDetails.loginid, res.pactid);

		if (exist) {
			var sql = "UPDATE " + "ev_tb " + "SET " + "username = " + this.getDB().dbQuote(name, "text", true) + ", " + "delete_flg = " + this.getDB().dbQuote(delete_flg, "boolean", true) + ", " + "sync_flg = true, " + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "text", true) + ", " + "ev_car_number = " + this.getDB().dbQuote(carno, "text") + ", " + "ev_car_type = " + this.getDB().dbQuote(carname, "text") + ", " + "ev_telno = " + this.getDB().dbQuote(telno, "text") + ", " + "ev_mail = " + this.getDB().dbQuote(mail, "text") + ", " + "ev_zip = " + this.getDB().dbQuote(zip, "text") + ", " + "ev_addr1 = " + this.getDB().dbQuote(addr1, "text") + ", " + "ev_addr2 = " + this.getDB().dbQuote(addr2, "text") + ", " + "ev_building = " + this.getDB().dbQuote(building, "text") + " " + "WHERE " + "pactid = " + this.getDB().dbQuote(res.pactid, "integer", true) + " AND " + "evid = " + this.getDB().dbQuote(userDetails.loginid, "text", true) + " AND " + "evcoid = " + ImportVoltaModel.EV_CO_ID;
		} else {
			sql = "INSERT INTO ev_tb (" + "evid, " + "pactid, " + "username, " + "postid, " + "evcoid, " + "delete_flg, " + "sync_flg, " + "ev_car_number, " + "ev_car_type, " + "ev_telno, " + "ev_mail, " + "ev_zip, " + "ev_addr1, " + "ev_addr2, " + "ev_building, " + "recdate, " + "fixdate " + ") VALUES (" + this.getDB().dbQuote(userDetails.loginid, "text", true) + ", " + this.getDB().dbQuote(res.pactid, "integer", true) + ", " + this.getDB().dbQuote(name, "text") + ", " + this.getDB().dbQuote(res.postid, "integer", true) + ", " + ImportVoltaModel.EV_CO_ID + ", " + this.getDB().dbQuote(delete_flg, "boolean", true) + ", " + "TRUE, " + this.getDB().dbQuote(carno, "text") + ", " + this.getDB().dbQuote(carname, "text") + ", " + this.getDB().dbQuote(telno, "text") + ", " + this.getDB().dbQuote(mail, "text") + ", " + this.getDB().dbQuote(zip, "text") + ", " + this.getDB().dbQuote(addr1, "text") + ", " + this.getDB().dbQuote(addr2, "text") + ", " + this.getDB().dbQuote(building, "text") + ", " + this.getDB().dbQuote(this.getDB().getNow(), "text", true) + ", " + this.getDB().dbQuote(this.getDB().getNow(), "text", true) + " " + ")";
		}

		return this.getDB().exec(sql);
	}

};