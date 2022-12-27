import MtScriptAmbient from "../../MtScriptAmbient";
import MtTableUtil from "../../MtTableUtil";
import ModelBase from "../ModelBase";
import PostModel from "../PostModel";

export default abstract class ImportBaseModel extends ModelBase {
	tbno!: string;
	nowdate: string;
	O_Post: PostModel;
	O_msa!: MtScriptAmbient;
	A_column_data: any[] = Array();
	A_pg_copy: any[] = Array();

	abstract getBackUpTableNameList() : string[];

	constructor() //親のコンストラクタを必ず呼ぶ
	//postモデルの作成
	{
		super();
		this.nowdate = this.get_DB().getNow();
		this.O_Post = new PostModel();
	}

	setScriptAmbient(msa : MtScriptAmbient) {
		this.O_msa = msa;
	}

	setBillDate(billdate: string) //テーブル番号を取得する
	{
		this.tbno = MtTableUtil.getTableNo(billdate);
		return true;
	}

	getTableColumn(table_name) {
		var sql = "select column_name,column_default,udt_name,data_type,is_nullable from information_schema.columns" + " where" + " table_name = " + this.get_DB().dbQuote(table_name, "text", true) + " and udt_catalog ='" + this.getSetting().get("db_name") + "'" + " order by ordinal_position";
		return this.get_DB().queryKeyAssoc(sql);
	}

	async creataEmptyRecordData(table_name) //カラムの情報を取得する
	//レコードの基本データ作成
	{
		var res = Array();

		if (!(undefined !== this.A_column_data[table_name])) //既に取得しているかをチェックして、取得してなければ取得
			{
				this.A_column_data[table_name] = await this.getTableColumn(table_name);
			}

		{
			let _tmp_0 = this.A_column_data[table_name];
			for (var column_name in _tmp_0) //type
			//timestampはtimestampにする
			{
				var value = _tmp_0[column_name];
				var type = value.data_type;

				if (type == "timestamp without time zone") {
					type = "timestamp";
				}

				if (!value.column_default) {
					res[column_name] = undefined;
				} else {
					res[column_name] = this.get_DB().dbQuote(value.column_default, type);
				}
			}
		}
		return res;
	}

	clearData(tbname = undefined) {
		if (!tbname) {
			this.A_pg_copy = Array();
		} else {
			if (undefined !== this.A_pg_copy[tbname]) {
				delete this.A_pg_copy[tbname];
			}
		}
	}

	async pushData(tbname, data) //配列作成
	{
		if (!(undefined !== this.A_pg_copy[tbname])) {
			this.A_pg_copy[tbname] = Array();
		}

		var base = await this.creataEmptyRecordData(tbname);

		for (var key in data) {
			var value = data[key];
			base[key] = data[key];
		}

		this.A_pg_copy[tbname].push(base);
	}

	async execInsertData(tbname:string|undefined = undefined, del_flag = true) //tbnameがnullの場合は全てinsertする
	{
		if (!tbname)
			{
				{
					let _tmp_1 = this.A_pg_copy;
					for (var name in _tmp_1) //エラーチェックだよお・・
					{
						var data = _tmp_1[name];
						var res = await this.get_DB().pgCopyFromArray(name, data);

						if (res == false) //$this->get_DB()->rollback();
							{
								this.errorOut(1000, "\n" + name + "へのデータ取込に失敗しました\n", 0, "", "");
								return false;
							}

						if (del_flag) {
							delete this.A_pg_copy[name];
						}
					}
				}
			} else //データの有無チェック
			{
				if (!this.A_pg_copy[tbname]) //データがない
					{
						return true;
					}

				res = await this.get_DB().pgCopyFromArray(tbname, this.A_pg_copy[tbname]);

				if (res == false) //$this->get_DB()->rollback();
					{
						this.errorOut(1000, "\n" + tbname + "へのデータ取込に失敗しました\n", 0, "", "");
						return false;
					}

				if (del_flag) {
					delete this.A_pg_copy[tbname];
				}
			}

		return true;
	}

	getTableNo() {
		return this.tbno;
	}

	setPactID(pactid, carid, ini_pact1, ini_pact2) {
	}

	async getPrtelnoList(pactid, carid) {
		return Array();
	}

	async getPostRelation(pactid) {
		return Array();
	}

	async checkProcessed(pactid, carid, prtelno, tdcomments) {
		return false;
	}

	async getTelBill(pactid, carid, prtelno,ini1,ini2,ini3,ini4,ini5,ini6,ini7) {
		return Array();
	}

	async update_details(pactid, carid, prtelno, H_tel, ini1, ini2, ini3, ini4, ini5, ini6, ini7, ini8, ini9, ini10, ini11, ini12, ini13, ini14, ini15, ini16, ini17, tax_rate, ini18, ini19) {
		return Array();
	}

};
