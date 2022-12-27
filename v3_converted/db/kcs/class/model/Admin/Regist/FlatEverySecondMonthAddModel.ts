//
//Shop管理記録Model
//
//@uses ModelBase
//@package ShopMenu
//@filesource
//@author houshiyama
//@since 2009/01/08
//
//
//
//ShopメニューModel
//
//@uses ModelBase
//@package ShopMenu
//@author houshiyama
//@since 2009/01/08
//

require("model/ModelBase.php");

//
//__construct
//
//@author houshiyama
//@since 2009/01/08
//
//@param mixed $O_db
//@access public
//@return void
//
//
//getFlatEverySecondMonth
//登録されている平準化を取得します。
//@author date
//@since 2015/09/15
//
//@param mixed $pactid gt
//@access public
//@return void
//
//
//getBillParent
//親番号の取得
//@author date
//@since 2015/09/15
//
//@param mixed $pactid
//@access public
//@return void
//
//
//makeEsmData
//insert,updateするデータ配列の取得
//@author web
//@since 2015/09/24
//
//@param mixed $H_sess
//@param mixed $flatid
//@param mixed $nowtime
//@access protected
//@return void
//
//
//makeEsmSQL
//基本情報のSQLを作成する
//@author web
//@since 2015/09/16
//
//@param mixed $sqltype 		insertかupdateか
//@param mixed $H_sess 		postなどの情報
//@param mixed $flatid 		flatid
//@param mixed $index_entry 	戻値のindexの開始値
//@access private
//@return void
//
//
//makeExcludeSQL
//除外リストの登録
//@author date
//@since 2015/09/16
//
//@param mixed $filename 	読み込むファイル名
//@param mixed $flatad 	顧客ID
//@param mixed $flattype 	平準化のタイプ(隔月、キャッシュバックなど)
//@param mixed $mcntype 	端末のタイプ(スマートフォン、フューチャーフォンなど)
//@param mixed $nowtime 	更新時間
//@param int $index_entry	戻値の初期key
//@access private
//@return void
//
//
//makeParentTelnoSQL
//除外リストの登録
//@author date
//@since 2015/09/16
//
//@param mixed $filename 	読み込むファイル名
//@param mixed $flatad 	顧客ID
//@param mixed $flattype 	平準化のタイプ(隔月、キャッシュバックなど)
//@param mixed $mcntype 	端末のタイプ(スマートフォン、フューチャーフォンなど)
//@param mixed $nowtime 	更新時間
//@param int $index_entry	戻値の初期key
//@access private
//@return void
//
//
//makeSQL
//
//@author web
//@since 2015/09/17
//
//@param mixed $data
//@access private
//@return void
//
//
//makeAddSQL
//SQLの作成
//@author web
//@since 2015/09/16
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//execDB
//DBの実行
//@author date
//@since 2015/09/17
//
//@param mixed $A_sql
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2009/01/08
//
//@access public
//@return void
//
class FlatEverySecondMonthAddModel extends ModelBase {
	constructor() {
		super();
		this.flats = Array();
		this.flats = {
			1: {
				prefix: "sp",
				label: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3"
			},
			2: {
				prefix: "fp",
				label: "\u30D5\u30E5\u30FC\u30C1\u30E3\u30FC\u30D5\u30A9\u30F3"
			},
			3: {
				prefix: "dc",
				label: "\u30C7\u30FC\u30BF\u30AB\u30FC\u30C9"
			},
			4: {
				prefix: "etc",
				label: "\u305D\u306E\u4ED6"
			},
			5: {
				prefix: "etc01",
				label: "\u305D\u306E\u4ED61"
			},
			6: {
				prefix: "etc02",
				label: "\u305D\u306E\u4ED62"
			},
			7: {
				prefix: "etc03",
				label: "\u305D\u306E\u4ED63"
			},
			8: {
				prefix: "etc04",
				label: "\u305D\u306E\u4ED64"
			},
			9: {
				prefix: "etc05",
				label: "\u305D\u306E\u4ED65"
			},
			10: {
				prefix: "etc06",
				label: "\u305D\u306E\u4ED66"
			}
		};
	}

	getFlatEverySecondMonth(pactid) {
		var sql = "select flatname from bill_flat_esm_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		return this.get_DB().queryRowHash(sql);
	}

	getBillParent(pactid, carid) {
		var sql = "select prtelname,prtelno from bill_prtel_tb" + " where" + " carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		return this.get_DB().queryHash(sql);
	}

	makeEsmData(H_sess, flatid, nowtime) //平準化ID
	//顧客ID
	//開始月
	//有効月数
	//備考
	//$data["comment"] = $this->get_DB()->dbQuote( $H_sess["post"]["comment"],"text" );
	//
	{
		var data = Array();
		data.flatid = this.get_DB().dbQuote(flatid, "integer", true);
		data.pactid = H_sess.pactid;
		var year = H_sess.post.start_year;
		var month = H_sess.post.start_month;
		var start_date = date("Y-m-d", mktime(0, 0, 0, month, 1, year));
		var end_date = date("Y-m-d", mktime(0, 0, 0, month + H_sess.post.month, 0, year));
		data.start_date = this.get_DB().dbQuote(start_date, "date", true);
		data.end_date = this.get_DB().dbQuote(end_date, "date", true);
		data.month = this.get_DB().dbQuote(H_sess.post.month, "integer", true);
		data.comment = this.get_DB().dbQuote("\u5272\u5F15\u5E73\u6E96\u5316", "text");
		{
			let _tmp_0 = this.flats;

			for (var id in _tmp_0) //停止フラグ
			{
				var value = _tmp_0[id];
				var pre = value.prefix;
				var fee = pre + "_fee";
				var stop = pre + "_stop";
				data[fee] = this.get_DB().dbQuote(H_sess.post[fee], "integer");

				if (undefined !== H_sess.post[stop] == true) {
					data[stop] = this.get_DB().dbQuote(true, "boolean");
				} else {
					data[stop] = this.get_DB().dbQuote(false, "boolean");
				}
			}
		}
		data.fixdate = this.get_DB().dbQuote(nowtime, "timestamp", true);
		return data;
	}

	makeEsmSQL(H_sess, flatid, nowtime, index_entry = 0) //新規登録
	{
		var res = Array();
		var data = this.makeEsmData(H_sess, flatid, nowtime);
		data.recdate = this.get_DB().dbQuote(nowtime, "timestamp", true);
		res[index_entry] = this.makeInsertSQL("bill_flat_esm_tb", data);
		return res;
	}

	makeExcludeSQL(filename, flatid, flattype, mcntype, nowtime, index_entry = 0) //戻値
	//データが１行もなかった場合はエラー
	//ファイルを１行ずつ処理する
	{
		var res = Array();

		if (!filename) {
			return Array();
		}

		var A_fileData = file(filename);

		if (count(A_fileData) == 0) {
			var errFlg = true;
			this.warningOut(1000, filename + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		var count = 0;
		var data = Array();
		data.flatid = this.get_DB().dbQuote(flatid, "integer", true);
		data.flattype = this.get_DB().dbQuote(flattype, "integer", true);
		data.mcntype = this.get_DB().dbQuote(mcntype, "integer", true);
		data.recdate = this.get_DB().dbQuote(nowtime, "time", true);

		for (var lineData of Object.values(A_fileData)) //UTF-8に変換する
		{
			var line = mb_convert_encoding(rtrim(lineData, "\r\n"), "UTF8", "SJIS-WIN");
			line = line.split(",");

			for (var value of Object.values(line)) //telno_viewから-を抜く
			//sql作成
			{
				if (!value) continue;
				var telno_view = value;
				var telno = str_replace("-", "", telno_view);
				data.telno_view = this.get_DB().dbQuote(telno_view, "text", true);
				data.telno = this.get_DB().dbQuote(telno, "text", true);
				res[index_entry + count] = this.makeInsertSQL("bill_flat_exclude_tb", data);
				count++;
			}
		}

		return res;
	}

	makeParentTelnoSQL(filename, flatid, flattype, mcntype, nowtime, index_entry = 0) //戻値
	//データが１行もなかった場合はエラー
	//ファイルを１行ずつ処理する
	{
		var res = Array();

		if (!filename) {
			return Array();
		}

		var A_fileData = file(filename);

		if (count(A_fileData) == 0) {
			var errFlg = true;
			this.warningOut(1000, filename + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		var count = 0;
		var data = Array();
		data.flatid = this.get_DB().dbQuote(flatid, "integer", true);
		data.flattype = this.get_DB().dbQuote(flattype, "integer", true);
		data.mcntype = this.get_DB().dbQuote(mcntype, "integer", true);
		data.recdate = this.get_DB().dbQuote(nowtime, "time", true);

		for (var lineData of Object.values(A_fileData)) //UTF-8に変換する
		{
			var line = mb_convert_encoding(rtrim(lineData, "\r\n"), "UTF8", "SJIS-WIN");
			line = line.split(",");

			for (var value of Object.values(line)) //telno_viewから-を抜く
			//sql作成
			{
				if (!value) continue;
				var prtelname = value;
				var prtelno = str_replace("-", "", prtelname);
				data.prtelname = this.get_DB().dbQuote(prtelname, "text", true);
				data.prtelno = this.get_DB().dbQuote(prtelno, "text", true);
				res[index_entry + count] = this.makeInsertSQL("bill_flat_prtel_tb", data);
				count++;
			}
		}

		return res;
	}

	makeInsertSQL(tablename, data) {
		var colum = Object.keys(data);
		return "insert into " + tablename + " (" + colum.join(",") + ")values(" + data.join(",") + ")";
	}

	makeAddSQL(H_sess) //次のID
	//記録時間を取得
	//基本
	//$index_entry = count( $sql );		//	こっちでもいいかもしれん
	//sqlの数だけ足してく
	{
		var sql = "SELECT NEXTVAL('bill_flat_esm_tb_flatid_seq');";
		var flatid = this.get_db().queryOne(sql);
		var flattype = 1;
		var index_entry = 0;
		var res = Array();
		var nowtime = this.get_DB().getNow();
		sql = this.makeEsmSQL(H_sess, flatid, nowtime, index_entry);
		res = array_merge(res, sql);
		index_entry += sql.length;
		{
			let _tmp_1 = this.flats;

			for (var id in _tmp_1) //対象外回線の指定
			//親番号の指定
			{
				var data = _tmp_1[id];
				var pre = data.prefix;
				var exempt = pre + "_exempt";
				var prtel = pre + "_prtel";
				sql = this.makeExcludeSQL(H_sess.upload[exempt].up_file, flatid, flattype, id, nowtime, index_entry);
				res = array_merge(res, sql);
				index_entry += sql.length;
				sql = this.makeParentTelnoSQL(H_sess.upload[prtel].up_file, flatid, flattype, id, nowtime, index_entry);
				res = array_merge(res, sql);
				index_entry += sql.length;
			}
		}
		return res;
	}

	execDB(A_sql) //トランザクションの開始
	//更新ＳＱＬ実行
	//失敗
	{
		var cnt = 0;
		var error = false;
		this.get_DB().beginTransaction();

		for (var sql of Object.values(A_sql)) //delete以外のSQLで、レコードが余分にupdateされてないか確認する
		{
			var tmpcnt = this.get_DB().exec(sql);

			if (strpos(sql, "delete", 0) !== 0 && tmpcnt != 1) //echo ($sql) . "<br>" . $tmpcnt;
				{
					error = true;
					break;
				}
		}

		if (error == true) {
			this.get_DB().rollback();
			return false;
		}

		this.get_DB().commit();
		return true;
	}

	__destruct() {
		super.__destruct();
	}

};