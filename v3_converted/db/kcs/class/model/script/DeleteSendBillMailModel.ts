//
//ドコモヘルスケア計算（Model）
//
//更新履歴：<br>
//2015/06/25 date 作成
//
//
//
//@package SUO
//@subpackage Model
//@author date<date@motion.co.jp>
//@filesource
//@since 2015/06/25
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author date
//@since 2015/08/20
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//deleteHealthcareBill
//指定した会社の削除を行う
//@author web
//@since 2015/06/23
//
//@param mixed $tableNo
//@param mixed $pactid
//@param mixed $healthcoid
//@access public
//@return void
//
//
//update
//削除を行う
//@author date
//@since 2015/08/20
//
//@param mixed $pactid
//@access public
//@return void
//
//
//__destruct
//
//@author miyazawa
//@since 2010/02/03
//
//@access public
//@return void
//
class DeleteSendBillMailModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	getNow() {
		return this.get_DB().getNow();
	}

	deleteSQL(pactid) //2年後の日付を取得
	//削除対象のメール
	//削除対象のpactidが指定されている？
	//対象がないなら空を返す
	{
		var sqls = Array();
		var today = this.getNow();
		var year = +today.substr(0, 4);
		var month = +today.substr(5, 2);
		var date = date("Y-m-d", mktime(0, 0, 0, month, 1, year - 2));
		date = this.get_DB().dbQuote(date, "timestamp", true);
		var sql = "select id from bill_mail_history_tb where" + " recdate < " + date;

		if (pactid != "all") {
			sql += " and pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		}

		var mail_list = this.get_DB().queryCol(sql);

		if (!mail_list) {
			return Array();
		}

		var text = mail_list.join(",");
		sqls.bill_mail_to_tb = "delete from bill_mail_to_tb where hid in (" + text + ")";
		sqls.bill_mail_history_tb = "delete from bill_mail_history_tb where id in (" + text + ")";
		return sqls;
	}

	update(pactid) //トランザクション開始
	//コミット
	{
		this.get_DB().beginTransaction();
		var sqls = this.deleteSQL(pactid);

		if (!sqls) {
			this.getOut().infoOut("\u524A\u9664\u5BFE\u8C61\u306A\u3057\n", 1);
		}

		for (var tableName in sqls) {
			var sql = sqls[tableName];
			var result = this.getDB().exec(sql, false);

			if (PEAR.isError(result)) {
				this.getDB().rollback();
				return false;
			}

			this.getOut().infoOut(tableName + ":" + result + "\u4EF6\u524A\u9664\n", 1);
		}

		this.get_DB().commit();
		return true;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};