//
//clamp_index_tbアップデートモデル
//
//@uses ModelBase
//@package UpdateClampIndex
//@filesource
//@author miyazawa
//@since 2009/10/27
//
//
//
//UpdateHolidayModel
//
//@uses ModelBase
//@package
//@author web
//@since 2017/12/14
//

require("model/ModelBase.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2009/10/27
//
//@param objrct $O_db0
//@access public
//@return mixed
//
//
//getHolidayList
//現状登録されている祝日を取得
//@author web
//@since 2017/12/14
//
//@access public
//@return void
//
//
//insertHoliday
//祝日の追加
//@author web
//@since 2017/12/14
//
//@param array $holiday_list
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2017/12/14
//
//@access public
//@return void
//
class UpdateHolidayModel extends ModelBase {
	constructor() {
		super();
	}

	getHolidayList() {
		return this.get_DB().queryAssoc("select time,true from holiday_tb");
	}

	updateHoliday(holiday_list: {} | any[]) //DBに反映するぽよ
	//トランザクション開始
	//DB取込
	//エラーチェック
	//削除
	//コミット
	{
		var sql = "INSERT INTO holiday_tb (time,date,type,summary) VALUES ";
		var c = "";

		for (var key in holiday_list) {
			var value = holiday_list[key];
			sql += c + sprintf("(%s,%s,1,%s)", this.get_DB().dbQuote(key, "time", true), this.get_DB().dbQuote(value.date, "date", true), this.get_DB().dbQuote(value.summary, "text", true));
			c = ",";
		}

		this.get_DB().beginTransaction();
		var res = this.get_DB().query(sql);

		if (res == false) {
			this.get_DB().rollback();
			this.errorOut(1000, "\n\u795D\u65E5\u767B\u9332\u5931\u6557\n", 0, "", "");
			return false;
		}

		var year = date("Y") - 1;
		var time = strtotime(year + "-01-01");
		sql = "delete from holiday_tb where time < " + this.get_DB().dbQuote(time, "integer", true);
		res = this.get_DB().query(sql);
		this.get_DB().commit();
		return true;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};