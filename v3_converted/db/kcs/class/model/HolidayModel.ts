//
//HolidayModel
//休日モデル
//@uses ModelBase
//@package
//@author web
//@since 2017/12/18
//

require("model/ModelBase.php");

//
//__construct
//コンストラクタ
//@author 伊達
//@since 2017/12/18
//
//@access public
//@return void
//
//
//getHoliday
//
//@author web
//@since 2018/06/20
//
//@param mixed $from
//@param mixed $to
//@access public
//@return void
//
//
//getWorkdayAfter
//営業日の計算
//@author 伊達
//@since 2017/12/18
//
//@access public
//@return void
//
class HolidayModel extends ModelBase {
	constructor(groupid = 0) //親のコンストラクタを必ず呼ぶ
	//iniファイルの休日を設定
	//ini読込む
	{
		super();
		this.holiday_list = Array();
		this.ini = Array();
		this.holiday_list = Array();
		var ini_name = KCS_DIR + "/conf_sync/holiday.ini";

		if (file_exists(ini_name)) {
			var ini = parse_ini_file(ini_name, true);
			this.ini = undefined !== ini["group" + groupid] ? ini["group" + groupid] : Array();
		} else {
			this.ini = Array();
		}

		if (!!this.ini) //一時的な休日(年月日指定のもの)を処理
			//holiday="休み|20180102"
			{
				if (undefined !== this.ini.holiday) //カンマ区切りで休日を書いているので分割する
					{
						var holiday_list = this.ini.holiday.split(",");

						for (var value of Object.values(holiday_list)) {
							var holiday = value.split("|");
							var ymd = holiday[0].substr(0, 4) + "-" + holiday[0].substr(4, 2) + "-" + holiday[0].substr(6, 2);
							this.holiday_list[strtotime(holiday[0])] = {
								0: ymd,
								1: holiday[1]
							};
						}
					}

				if (undefined !== this.ini.holiday_r) //カンマ区切りで休日を書いているので分割する
					{
						var year = date("Y");
						holiday_list = this.ini.holiday_r.split(",");

						for (var value of Object.values(holiday_list)) {
							holiday = value.split("|");
							var md = "-" + holiday[0].substr(0, 2) + "-" + holiday[0].substr(2, 2);
							var date = year + md;
							this.holiday_list[strtotime(date)] = {
								0: date,
								1: holiday[1]
							};
							date = year + 1 + md;
							this.holiday_list[strtotime(date)] = {
								0: date,
								1: holiday[1]
							};
						}
					}
			}

		ksort(this.holiday_list);
	}

	getHoliday(date_from = undefined, date_to = undefined) //-----------------------------------------------------------------------------
	//休日を取得する
	//-----------------------------------------------------------------------------
	//-----------------------------------------------------------------------------
	//iniに設定された休日とまーじ
	//-----------------------------------------------------------------------------
	//from
	//ソートして返す
	{
		var sql = "SELECT time,date,summary FROM holiday_tb";
		var where = "";

		if (!is_null(date_from)) {
			where += where == "" ? "" : " AND ";
			where += "date >= " + this.get_DB().dbQuote(date_from, "date");
		}

		if (!is_null(date_to)) {
			where += where == "" ? "" : " AND ";
			where += "date <= " + this.get_DB().dbQuote(date_to, "date");
		}

		if (where != "") {
			sql += " WHERE " + where;
		}

		var holiday = this.get_DB().queryAssoc(sql);
		var holiday_ini = this.holiday_list;
		var unset_list = Array();

		if (!is_null(date_from)) {
			var time_from = strtotime(date_from);

			for (var time in holiday_ini) {
				var value = holiday_ini[time];

				if (time_from > time) {
					unset_list.push(time);
				}
			}

			for (var time of Object.values(unset_list)) {
				delete holiday_ini[time];
			}
		}

		unset_list = Array();

		if (!is_null(date_to)) {
			var time_to = strtotime(date_to);

			for (var time in holiday_ini) {
				var value = holiday_ini[time];

				if (time_to < time) {
					unset_list.push(time);
				}
			}

			for (var time of Object.values(unset_list)) {
				delete holiday_ini[time];
			}
		}

		if (!holiday) {
			var res = holiday_ini;
		} else {
			res = holiday_ini + holiday;
		}

		ksort(res);
		return res;
	}

	getWorkdayAfter(start_time, addday) //変数に初期日を代入
	//指定された日の曜日を取得する
	//営業日を足していく(当日分を1として加算する)
	//休日取得
	{
		var time = start_time;
		var week = date("w", time);
		var n = addday + 1;
		var holiday_list = this.getHoliday();

		while (n > 0) //祝日か土日ですか
		//曜日をずらす
		{
			var bWorkday = true;

			if (undefined !== holiday_list[time] || (week == 6 || week == 0)) //休みじゃあああ
				{
					bWorkday = false;
				}

			if (bWorkday) //残日数ある？
				{
					n--;

					if (n <= 0) //残数ない・・この日で決定
						{
							break;
						}
				}

			time += 60 * 60 * 24;
			week++;
			week %= 7;
		}

		return time;
	}

};