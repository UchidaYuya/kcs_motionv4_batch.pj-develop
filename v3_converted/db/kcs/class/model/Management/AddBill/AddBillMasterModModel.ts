//
//ICCardPrintOutPersonalModel
//交通費出力PDFモデル
//@uses ModelBase
//@package
//@author date
//@since 2015/11/02
//

require("model/Management/AddBill/AddBillMasterAddModel.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param mixed $O_db0
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//makeAddSQL
//SQL作成ぽよ
//@author web
//@since 2015/11/27
//
//@param mixed $pactid
//@param mixed $H_post
//@access public
//@return void
//
//
//getAddBillTempData
//データ取得
//@author web
//@since 2015/12/04
//
//@param mixed $pactid
//@param mixed $tempid
//@access public
//@return void
//
//
//getAddBillTempUserData
//ユーザーID取得
//@author web
//@since 2015/12/04
//
//@param mixed $pactid
//@param mixed $tempid
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class AddBillMasterModModel extends AddBillMasterAddModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
	}

	makeAddSQL(pactid, H_post, tempid = 0) //戻値用バッファ
	//更新日の作成
	//SQL用データの作成
	//SQL作成する
	//column=valueの文字列を作成する
	//アップデート文の作成
	//既存のuserid削除
	//useridを追加
	{
		var sql = Array();
		var date = date("Y-m-d H:i:s");
		var data = this.makeData(pactid, H_post, date);
		var temp = "";

		for (var column in data) {
			var value = data[column];

			if (temp != "") {
				temp += ",";
			}

			temp += column + "=" + value;
		}

		sql.push("UPDATE addbill_temp_tb SET " + temp + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid=" + this.get_DB().dbQuote(tempid, "integer", true));
		var users = this.getValidUser(pactid, H_post.userid);
		sql.push("delete from addbill_temp_user_tb" + " where" + " tempid=" + this.get_DB().dbQuote(pactid, "integer", true));
		data = Array();
		data.tempid = this.get_DB().dbQuote(tempid, "integer", true);
		data.recdate = this.get_DB().dbQuote(date, "timestamp", true);
		data.userid = 0;
		var keys = Object.keys(data);

		for (var userid of Object.values(users)) {
			data.userid = userid;
			sql.push("INSERT INTO addbill_temp_user_tb( " + keys.join(",") + ")VALUES(" + data.join(",") + ")");
		}

		return sql;
	}

	getAddBillTempData(pactid, tempid) {
		var sql = "select * from addbill_temp_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tempid=" + this.get_DB().dbQuote(tempid, "integer", true);
		return this.get_DB().queryRowHash(sql);
	}

	getAddBillTempUserData(pactid, tempid) {
		var sql = "select tmp_usr.userid,usr.postid from addbill_temp_user_tb tmp_usr" + " join user_tb as usr on" + " usr.pactid = " + this.get_DB().dbQuote(pactid, "integer", true) + " and usr.userid = tmp_usr.userid" + " where" + " tmp_usr.tempid=" + this.get_DB().dbQuote(tempid, "integer", true);
		return this.get_DB().queryHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};