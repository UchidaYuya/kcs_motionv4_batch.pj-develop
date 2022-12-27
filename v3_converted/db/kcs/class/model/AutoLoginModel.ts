//error_reporting(E_ALL);
//
//自動ログイン
//
//更新履歴：<br>
//2013/04/25 池島麻美 作成
//
//@package AutoLogin
//@author  ikeshima
//@since   2013/04/25
//
//
//
//自動ログイン
//
//@package AutoLogin
//@author  ikeshima
//@since   2013/04/25
//

require("MtDBUtil.php");

require("MtTableUtil.php");

//
//データベース接続オブジェクト
//
//@var object
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param object $O_db0 default=null ＤＢ接続オブジェクト
//@access public
//@return void
//
//
//対象のテーブル月を取得する
//getTableNo
//
//@author ikeshima
//@since 2013/04/25
//
//@param  integer $year
//@param  integer $month
//@access public
//@return void
//
//
//テーブル存在チェック
//checkExistsTable
//
//@author ikeshima
//@since 2013/04/25
//
//@param  string  $tableName
//@access private
//@return Boolean
//
//
//getHistoryData
//
//@author ikeshima
//@since 2013/04/25
//
//@param  integer $tableNo
//@param  string  $tableName
//@param  integer $pactid
//@access public
//@return array
//
//
//キャリア絞込
//getCarid
//
//@author ikeshima
//@since 2013/04/25
//
//@param array $data
//@access private
//@return array
//
//
//getTelData
//
//@author ikeshima
//@since 2013/04/25
//
//@param  integer $pactid
//@param  string  $telno
//@access public
//@return array
//
//
//getTelNo
//
//@author ikeshima
//@since 2013/04/25
//
//@param  integer $pactid
//@param  integer $uid
//@access public
//@return array
//
class AutoLoginModel {
	constructor(O_db0 = undefined) //DBクラス生成
	//Tableクラス生成
	{
		if (O_db0 === undefined) {
			this.O_Db = MtDBUtil.singleton();
		} else {
			this.O_Db = O_db0;
		}

		this.O_Ym = new MtTableUtil();
	}

	getTableNo(year, month) {
		this.tableNo = this.O_Ym.getTableNo(year + month);
	}

	checkExistsTable(tableName) {
		switch (tableName) {
			case "commhistory":
				if (this.tableNo > 12) return false;
				break;

			case "billhistory":
				if (this.tableNo > 12) return false;
				break;

			default:
				if (this.tableNo > 24) return false();
		}

		return true;
	}

	getHistoryData(tableName, pactid, telno) //テーブル存在確認
	//キャリア絞込
	{
		if (!this.checkExistsTable(tableName)) {
			return Array();
		}

		var sql = "SELECT " + "telTB.postid, " + "tagetTB.carid  " + "FROM " + tableName + "_" + this.tableNo + "_tb AS tagetTB INNER JOIN tel_" + this.tableNo + "_tb AS telTB ON " + "tagetTB.pactid = telTB.pactid AND " + "tagetTB.telno = telTB.telno AND " + "tagetTB.carid = telTB.carid " + "WHERE " + "tagetTB.pactid = " + this.O_Db.dbQuote(pactid, "integer", true) + " and " + "tagetTB.telno = " + this.O_Db.dbQuote(telno, "string", true) + " " + "GROUP BY telTB.postid, tagetTB.carid ORDER BY carid ASC";
		var result = this.O_Db.queryHash(sql);
		return this.getCarid(result);
	}

	getCarid(data) //キャリアが複数
	{
		if (data.length > 0) {
			if (data.length > 1) //キャリア=0は、全部の為、除外
				{
					if (data[0].carid == 0) {
						return data[1];
					}
				}

			return data[0];
		}

		return Array();
	}

	getTelData(pactid, telno) //テーブル存在確認
	//キャリア絞込
	{
		if (!this.checkExistsTable("tel")) {
			return Array();
		}

		var sql = "SELECT " + "postid, " + "carid  " + "FROM " + "tel_" + this.tableNo + "_tb " + "WHERE " + "pactid = " + this.O_Db.dbQuote(pactid, "integer", true) + " and " + "telno = " + this.O_Db.dbQuote(telno, "string", true) + " " + "GROUP BY postid, carid ORDER BY carid ASC";
		var result = this.O_Db.queryHash(sql);
		return this.getCarid(result);
	}

	getTelNo(pactid, uid) //テーブル存在確認
	//キャリア絞込
	//請求データ無
	{
		if (!this.checkExistsTable("tel")) {
			return "";
		}

		var commSql = "FROM " + "tel_bill_" + this.tableNo + "_tb AS bt INNER JOIN " + "tel_" + this.tableNo + "_tb AS xt ON " + "bt.pactid = xt.pactid AND " + "bt.postid = xt.postid AND " + "bt.telno = xt.telno AND " + "bt.carid = xt.carid " + "INNER JOIN " + "post_" + this.tableNo + "_tb AS pt ON " + "bt.pactid = pt.pactid AND " + "bt.postid = pt.postid " + "WHERE " + "bt.pactid = " + this.O_Db.dbQuote(pactid, "integer", true) + " AND " + "xt.userid = " + this.O_Db.dbQuote(uid, "integer", true) + " ";
		var sql = "SELECT " + "bt.carid ";
		sql = sql + commSql + "GROUP BY bt.carid ORDER BY bt.carid ASC";
		var result = this.O_Db.queryHash(sql);
		var carid = this.getCarid(result);
		if (carid.length == 0) return "";
		sql = "SELECT " + "bt.telno ";
		sql = sql + commSql + "AND " + "xt.carid = " + carid.carid + " AND " + "xt.userid = " + this.O_Db.dbQuote(uid, "integer", true) + " " + "ORDER BY pt.userpostid ASC, xt.telno_view";
		result = this.O_Db.queryRowHash(sql);
		return result.telno;
	}

};