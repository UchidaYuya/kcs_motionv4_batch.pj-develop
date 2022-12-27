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
class DeleteDocumentModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	getNow() {
		return this.get_DB().getNow();
	}

	deleteDocument(pactid) {
		var sql = "select docid from document_tb where" + " enddate < " + this.getDB().dbQuote(this.getNow(), "timestamp", true);

		if (pactid != "all") {
			sql += " and pactid=" + this.getDB().dbQuote(pactid, "integer", true);
		}

		var doc_list = this.getDB().queryCol(sql);

		for (var docid of Object.values(doc_list)) {
			this.infoOut("docid=" + docid + "\u3092\u524A\u9664\n", 1);
			sql = "delete from document_line_tb where docid=" + this.getDB().dbQuote(docid, "integer", true);
			this.getDB().query(sql);
			sql = "delete from document_tb where docid=" + this.getDB().dbQuote(docid, "integer", true);
			this.getDB().query(sql);
		}

		return true;
	}

	update(pactid) //トランザクション開始
	//コミット
	{
		this.get_DB().beginTransaction();
		var rtn = this.deleteDocument(pactid);

		if (rtn == false) {
			this.get_DB().rollback();
			this.errorOut(1000, "\n" + "\u5931\u6557 \n", 0, "", "");
			return false;
		} else {
			this.infoOut("\u6210\u529F\n", 0);
		}

		this.get_DB().commit();
		return true;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};