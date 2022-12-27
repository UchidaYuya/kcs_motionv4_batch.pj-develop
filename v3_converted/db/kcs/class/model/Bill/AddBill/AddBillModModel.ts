//
//ICCardPrintOutPersonalModel
//交通費出力PDFモデル
//@uses ModelBase
//@package
//@author date
//@since 2015/11/02
//

require("model/Bill/AddBill/AddBillAddModel.php");

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
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class AddBillModModel extends AddBillAddModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
	}

	makeAddSQL(pactid, postid, userid, id, id_sub, H_post, tempid, productcode, productname, card_name) //戻値用バッファ
	//更新日の作成
	//SQL用データの作成
	//入力者は上書きしない
	//column=valueの文字列を作成する
	//アップデート文の作成
	{
		var sql = Array();
		var date = date("Y-m-d H:i:s");
		var data = this.makeData(pactid, postid, userid, H_post, tempid, productcode, productname, date, card_name);
		delete data.userid;
		var temp = "";

		for (var column in data) {
			var value = data[column];

			if (temp != "") {
				temp += ",";
			}

			temp += column + "=" + value;
		}

		sql.push("UPDATE addbill_tb SET " + temp + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and addbillid=" + this.get_DB().dbQuote(id, "text", true) + " and addbillid_sub=" + this.get_DB().dbQuote(id_sub, "integer", true));
		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};