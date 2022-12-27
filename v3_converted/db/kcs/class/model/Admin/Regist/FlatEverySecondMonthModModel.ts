//
//FlatEverySecondMonthModModel
//
//@uses FlatEverySecondMonthAddModel
//@package
//@author web
//@since 2015/09/24
//

require("model/Admin/Regist/FlatEverySecondMonthAddModel.php");

//
//__construct
//
//@author date
//@since 2015/09/24
//
//@access public
//@return void
//
//
//getEsmData
//
//@author date
//@since 2015/09/24
//
//@param mixed $pactid
//@access public
//@return void
//
//
//getParentTel
//親番号の取得
//@author date
//@since 2015/09/24
//
//@param mixed $flatid
//@access public
//@return void
//
//
//makeEsmSQL
//アップデートSQL作成
//@author web
//@since 2015/09/24
//
//@param mixed $H_sess
//@param mixed $flatid
//@param mixed $nowtime
//@param int $index_entry
//@access private
//@return void
//
//
//getPrtelCount
//親番号数の取得
//@author web
//@since 2015/11/24
//
//@param mixed $flatid
//@param mixed $flattype
//@param mixed $mcntype
//@access public
//@return void
//
//
//getExcludeCount
//除外リストの回線数を取得する
//@author web
//@since 2015/11/24
//
//@param mixed $flatid
//@param mixed $flattype
//@param mixed $mcntype
//@access public
//@return void
//
//
//getFlatId
//平準化IDの取得
//@author web
//@since 2015/09/25
//
//@param mixed $pactid
//@access private
//@return void
//
//
//makeDeleteExcludeSQL
//
//@author web
//@since 2015/09/25
//
//@param mixed $flatid
//@param mixed $flattype
//@param mixed $mcntype
//@param mixed $index_entry
//@access private
//@return void
//
//
//makeDeleteParentTelnoSQL
//親番号の削除
//@author web
//@since 2015/09/25
//
//@param mixed $flatid
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
//__destruct
//
//@author web
//@since 2015/09/24
//
//@access public
//@return void
//
class FlatEverySecondMonthModModel extends FlatEverySecondMonthAddModel {
	constructor() {
		super();
	}

	getEsmData(pactid) {
		var sql = "select * from bill_flat_esm_tb where pactid = " + this.getDB().dbQuote(pactid, "integer", true);
		var res = this.getDB().queryRowHash(sql);
		return res;
	}

	getParentTelData(flatid) {
		var sql = "select mcntype,prtelno,prtelname from bill_flat_prtel_tb" + " where" + " flatid = " + this.getDB().dbQuote(flatid, "integer", true) + " and flattype = " + this.getDB().dbQuote(1, "integer", true);
		var res = this.getDB().queryHash(sql);
		return res;
	}

	makeEsmSQL(H_sess, flatid, nowtime, index_entry = 0) //データの作成
	//アップデート
	{
		var res = Array();
		var data = this.makeEsmData(H_sess, flatid, nowtime);
		var sql = "";

		for (var key in data) {
			var value = data[key];

			if (sql != "") {
				sql += ",";
			}

			sql += key + "=" + value;
		}

		res[index_entry] = "update bill_flat_esm_tb set " + sql + " where" + " flatid=" + this.get_DB().dbQuote(flatid, "integer", true) + " and pactid=" + this.get_DB().dbQuote(H_sess.pactid, "integer", true);
		return res;
	}

	getPrtelCount(flatid, flattype, mcntype) {
		var sql = "select count(*) from bill_flat_prtel_tb where" + " flatid=" + this.get_DB().dbQuote(flatid, "integer", true) + " and flattype=" + this.get_DB().dbQuote(flattype, "integer", true) + " and mcntype=" + this.get_DB().dbQuote(mcntype, "integer", true);
		return this.get_DB().queryOne(sql);
	}

	getExcludeCount(flatid, flattype, mcntype) {
		var sql = "select count(*) from bill_flat_exclude_tb where " + " flatid=" + this.get_DB().dbQuote(flatid, "integer", true) + " and flattype=" + this.get_DB().dbQuote(flattype, "integer", true) + " and mcntype=" + this.get_DB().dbQuote(mcntype, "integer", true);
		return this.get_DB().queryOne(sql);
	}

	getFlatId(pactid) {
		var sql = "select flatid from bill_flat_esm_tb where pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		return this.get_DB().queryOne(sql);
	}

	makeDeleteExcludeSQL(flatid, flattype, mcntype, index_entry) {
		var res = Array();
		res[index_entry] = "delete from bill_flat_exclude_tb where" + " flatid=" + this.get_DB().dbQuote(flatid, "integer", true) + " and flattype=" + this.get_DB().dbQuote(flattype, "integer", true) + " and mcntype=" + this.get_DB().dbQuote(mcntype, "integer", true);
		return res;
	}

	makeDeleteParentTelnoSQL(flatid, flattype, mcntype, index_entry) {
		var res = Array();
		res[index_entry] = "delete from bill_flat_prtel_tb where" + " flatid = " + this.get_DB().dbQuote(flatid, "integer", true) + " and flattype=" + this.get_DB().dbQuote(flattype, "integer", true) + " and mcntype=" + this.get_DB().dbQuote(mcntype, "integer", true);
		return res;
	}

	makeModSQL(H_sess) //記録時間を取得
	{
		var flatid = this.getFlatId(H_sess.pactid);
		var flattype = 1;
		var res = Array();
		var nowtime = this.get_DB().getNow();
		res += this.makeEsmSQL(H_sess, flatid, nowtime, res.length);
		{
			let _tmp_0 = this.flats;

			for (var mcntype in _tmp_0) {
				var value = _tmp_0[mcntype];
				var exempt = value.prefix + "_exempt";
				var prtel = value.prefix + "_prtel";

				if (undefined !== H_sess.upload[exempt]) //除外リストの削除
					//新しい除外リストの作成
					{
						res += this.makeDeleteExcludeSQL(flatid, flattype, mcntype, res.length);
						res += this.makeExcludeSQL(H_sess.upload[exempt].up_file, flatid, flattype, mcntype, nowtime, res.length);
					}

				if (undefined !== H_sess.upload[prtel]) //スマートフォンの親番号の削除
					//スマートフォンの親番号の作成
					{
						res += this.makeDeleteParentTelnoSQL(flatid, flattype, mcntype, res.length);
						res += this.makeParentTelnoSQL(H_sess.upload[prtel].up_file, flatid, flattype, mcntype, nowtime, res.length);
					}
			}
		}
		return res;
	}

	__destruct() {
		super.__destruct();
	}

};