//
//FAQ用Model簡易モデル
//
//更新履歴：<br>
//
//@package FAQ
//@subpackage Model
//@author ishizaki
//@filesource
//@since 2011/03/09
//
//
//
//FAQ用Model簡易モデル
//
//更新履歴：<br>
//
//@package FAQ
//@subpackage Model
//@author ishizaki
//@since 2011/03/09
//

require("model/ModelBase.php");

//
//自動更新対象となるお問い合わせ番号を取得
//
//お問い合わせ詳細番号のUSERIDが入っているもの、お問い合わせステータスが0のもの、起動時より一ケ月以上前のもの
//
//@author igarashi
//@since 2011/03/10
//
//@access public
//@return void
//
//
//配列に格納されたお問い合わせ番号のステータスを更新する
//
//@author igarashi
//@since 2011/03/10
//
//@param mixed $inquiryids
//@param mixed $status
//@access public
//@return void
//
class FaqLightModel extends ModelBase {
	getChangeStatusInquiryIds() {
		var sql = "SELECT " + "i.inquiryid " + "FROM " + "inquiry_tb i " + "INNER JOIN " + "( SELECT " + "inquiryid, max(inquiry_detailid) detailid " + "FROM " + "inquiry_detail_tb " + "GROUP BY " + "inquiryid " + "ORDER BY inquiryid ) lastdetail ON i.inquiryid = lastdetail.inquiryid " + "INNER JOIN " + "inquiry_detail_tb id ON lastdetail.detailid = id.inquiry_detailid " + "WHERE " + "id.userid is null AND inquirystatus = 0 AND id.recdate <= " + this.getDB().dbQuote(date("Y-m-d", strtotime("-1 month")), "string", true);
		return this.getDB().queryCol(sql);
	}

	changeInquiryStatus(inquiryids, status) {
		var sql = "UPDATE " + "inquiry_tb " + "SET " + "inquirystatus = " + this.getDB().dbQuote(status, "integer", true) + ", " + "fixdate = " + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + " " + "WHERE " + "inquiryid IN ( " + inquiryids.join(", ") + " )";
		return this.getDB().exec(sql);
	}

};