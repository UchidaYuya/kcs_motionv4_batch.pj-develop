//
//AddBillCopyBulkModel
//
//@uses AddBillAddModel
//@package
//@author web
//@since 2016/10/03
//

require("model/Bill/AddBill/AddBillModModel.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/12/21
//
//@param mixed $O_db0
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//makeModSQL
//SQL作成
//@author web
//@since 2016/10/03
//
//@param mixed $pactid
//@param mixed $post
//@param mixed $excise_tax
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
class AddBillCopyBulkModel extends AddBillModBulkModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess);
	}

	makeSQL(pactid, post, excise_tax) //戻値用
	//更新日の作成
	//受付番号のチェック
	{
		var res = Array();
		var date = this.get_DB().dbQuote(date("Y-m-d H:i:s"), "timestamp", true);
		var id = this.getNextId(pactid);
		var id_left = id.substr(0, 8);
		var id_right = +id.substr(9, 5);

		if (id_right + post.bill.length >= 99999) {
			this.errorOut(1, "\u53D7\u4ED8\u756A\u53F7\u306E\u4E0A\u9650\u30A8\u30E9\u30FC", false, "/Menu/menu.php");
		}

		{
			let _tmp_0 = post.bill;

			for (var key in _tmp_0) //データ作る
			//ID作る
			//登録されるidを保存する
			//足りない値を追加
			//登録日の設定
			//更新日の設定
			//SQL追加
			{
				var value = _tmp_0[key];
				var data = Array();
				data = this.makeSqlData(pactid, value, excise_tax);
				var addbillid = sprintf("%s-%05d", id_left, id_right);
				var addbillid_sub = 1;
				id_right++;
				this.sql_addbillid.push({
					addbillid: addbillid,
					addbillid_sub: addbillid_sub
				});
				data.addbillid = this.get_DB().dbQuote(addbillid, "text", true);
				data.addbillid_sub = this.get_DB().dbQuote(addbillid_sub, "integer", true);
				data.pactid = this.get_DB().dbQuote(pactid, "integer", true);
				data.userid = this.get_DB().dbQuote(this.H_G_Sess.userid, "integer", true);
				data.delete_flg = this.get_DB().dbQuote(false, "bool", true);
				data.dummy_flg = this.get_DB().dbQuote(false, "bool", true);
				data.recdate = date;
				data.update = date;
				var keys = Object.keys(data);
				res.push("INSERT INTO addbill_tb (" + keys.join(",") + ")VALUES(" + data.join(",") + ")");
			}
		}
		return res;
	}

	__destruct() {
		super.__destruct();
	}

};