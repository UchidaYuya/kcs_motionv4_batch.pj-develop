
import ModelBase from '../ModelBase';
import MtScriptAmbient from '../../MtScriptAmbient';

export class DeleteDocumentModel extends ModelBase {
	O_msa: MtScriptAmbient;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	getNow() {
		return this.get_DB().getNow();
	}

	async deleteDocument(pactid: string) {
		var sql = "select docid from document_tb where" + " enddate < " + this.getDB().dbQuote(this.getNow(), "timestamp", true);

		if (pactid != "all") {
			sql += " and pactid=" + this.getDB().dbQuote(pactid, "integer", true);
		}

		var doc_list = await this.getDB().queryCol(sql);

		// for (var docid of Object.values(doc_list)) {
		for (var docid of doc_list) {

			// this.infoOut("docid=" + docid + "\u3092\u524A\u9664\n", 1);
			this.infoOut("docid=" + docid + "を削除\n", 1);
			sql = "delete from document_line_tb where docid=" + this.getDB().dbQuote(docid, "integer", true);
			this.getDB().query(sql);
			sql = "delete from document_tb where docid=" + this.getDB().dbQuote(docid, "integer", true);
			this.getDB().query(sql);
		}

		return true;
	}

	async update(pactid: string) //トランザクション開始
	//コミット
	{
		this.get_DB().beginTransaction();
		var rtn = await this.deleteDocument(pactid);

		if (rtn == false) {
			this.get_DB().rollback();
			// this.errorOut(1000, "\n" + "\u5931\u6557 \n", 0, "", "");
			this.errorOut(1000, "\n" + "失敗 \n", 0, "", "");
			return false;
		} else {
			// this.infoOut("\u6210\u529F\n", 0);
			this.infoOut("成功\n", 0);
		}

		this.get_DB().commit();
		return true;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
