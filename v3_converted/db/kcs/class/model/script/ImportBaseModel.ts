require("MtTableUtil.php");

require("model/ModelBase.php");

//xxテーブルのxx部分
//recdateに入れる日付
//PostModel
//MtScriptAmbient
//テーブルデータ
//バックアップ対象のテーブル一覧を返す(arrayでテーブル名を返す事)
//
//__construct
//コンストラクタ
//@author web
//@since 2017/01/26
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//setScriptAmbient
//
//@author web
//@since 2017/02/23
//
//@param mixed $msa
//@access public
//@return void
//
//
//setBillDate
//
//@author web
//@since 2017/02/23
//
//@param mixed $billdate
//@access public
//@return void
//
//
//getTableColumn
//テーブルのカラムを取得する
//@author web
//@since 2017/02/27
//
//@param mixed $table_name
//@access public
//@return void
//
//
//createEmptyRecordData
//レコード挿入用の空配列を作成
//この関数はpgCopyを使用する際に、カラムの増減に対応できるように作成しました。
//
//@author date
//@since 2017/02/28
//
//@param mixed $table_name
//@access public
//@return void
//
//
//clearData
//
//@author web
//@since 2017/03/10
//
//@param mixed $tbname
//@access public
//@return void
//
//
//pushPgCopy
//Insert用データをプッシュする
//@author web
//@since 2017/03/10
//
//@param mixed $tbname
//@param mixed $data
//@access public
//@return void
//
//
//execInsertData
//
//@author web
//@since 2017/03/10
//
//@param mixed $tbname
//@param mixed $del_flag
//@access public
//@return void
//
//
//getTableNo
//テーブル番号の取得
//@author web
//@since 2017/02/09
//
//@access public
//@return void
//
class ImportBaseModel extends ModelBase {
	constructor() //親のコンストラクタを必ず呼ぶ
	//postモデルの作成
	{
		super();
		this.tbno = undefined;
		this.A_column_data = Array();
		this.A_pg_copy = Array();
		this.nowdate = this.get_DB().getNow();
		this.O_Post = new PostModel();
	}

	setScriptAmbient(msa) {
		this.O_msa = msa;
	}

	setBillDate(billdate) //テーブル番号を取得する
	{
		if (is_null(billdate)) {
			return false;
		}

		var tb_util = new MtTableUtil();
		this.tbno = tb_util.getTableNo(billdate);
		return true;
	}

	getTableColumn(table_name) {
		var sql = "select column_name,column_default,udt_name,data_type,is_nullable from information_schema.columns" + " where" + " table_name = " + this.get_DB().dbQuote(table_name, "text", true) + " and udt_catalog ='" + this.getSetting().db_name + "'" + " order by ordinal_position";
		return this.get_DB().queryKeyAssoc(sql);
	}

	creataEmptyRecordData(table_name) //カラムの情報を取得する
	//レコードの基本データ作成
	{
		var res = Array();

		if (!(undefined !== this.A_column_data[table_name])) //既に取得しているかをチェックして、取得してなければ取得
			{
				this.A_column_data[table_name] = this.getTableColumn(table_name);
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

				if (is_null(value.column_default)) {
					res[column_name] = undefined;
				} else {
					res[column_name] = this.get_DB().dbQuote(value.column_default, type);
				}
			}
		}
		return res;
	}

	clearData(tbname = undefined) {
		if (is_null(tbname)) {
			this.A_pg_copy = Array();
		} else {
			if (undefined !== this.A_pg_copy[tbname]) {
				delete this.A_pg_copy[tbname];
			}
		}
	}

	pushData(tbname, data) //配列作成
	//$baseの値を$dataで上書きする
	//プッシュ
	{
		if (!(undefined !== this.A_pg_copy[tbname])) {
			this.A_pg_copy[tbname] = Array();
		}

		var base = this.creataEmptyRecordData(tbname);

		for (var key in data) {
			var value = data[key];
			base[key] = data[key];
		}

		this.A_pg_copy[tbname].push(base);
	}

	execInsertData(tbname = undefined, del_flag = true) //tbnameがnullの場合は全てinsertする
	//del_flgがtrueの場合は、copy後にデータ削除を行う
	//トランザクション関連は、ここでやらないようにしたよ・・
	//pgCopyを行う
	{
		if (is_null(tbname)) //$this->get_DB()->beginTransaction();
			//全て実行
			//DBに反映する
			//$this->get_DB()->commit();
			{
				{
					let _tmp_1 = this.A_pg_copy;

					for (var name in _tmp_1) //エラーチェックだよお・・
					{
						var data = _tmp_1[name];
						var res = this.get_DB().pgCopyFromArray(name, data);

						if (res == false) //$this->get_DB()->rollback();
							{
								this.errorOut(1000, "\n" + name + "\u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
								return false;
							}

						if (del_flag) {
							delete this.A_pg_copy[name];
						}
					}
				}
			} else //データの有無チェック
			//エラーチェックだよお・・
			{
				if (!this.A_pg_copy[tbname]) //データがない
					{
						return true;
					}

				res = this.get_DB().pgCopyFromArray(tbname, this.A_pg_copy[tbname]);

				if (res == false) //$this->get_DB()->rollback();
					{
						this.errorOut(1000, "\n" + tbname + "\u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
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

};