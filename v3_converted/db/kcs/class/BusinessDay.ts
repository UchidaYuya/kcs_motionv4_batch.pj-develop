//
//夜間営業用　営業タイプ判定クラス
//
//※振替休日=その日以後において最も近い国民の祝日でない日<br>
//※国民の休日=祝日と祝日に挟まれた平日を休日とする
//
//@filesource
//@package Base
//@subpackage BusinessDay
//@author 上杉勝史
//@since 2008/02/06
//
//
//
//夜間営業用　営業タイプ判定クラス
//
//2007年以降の計算方法のみ<br>
//祝日一覧<br>
//1月<br>
//1日			元旦<br>
//第2月曜日	成人の日<br>
//2月<br>
//11日		建国記念の日<br>
//3月<br>
//21日前後	春分の日<br>
//4月<br>
//29日		昭和の日<br>
//5月<br>
//3日			憲法記念日<br>
//4日			みどりの日<br>
//5日			こどもの日<br>
//7月<br>
//第3月曜日	海の日<br>
//9月<br>
//第3月曜日	敬老の日<br>
//23日前後	敬老の日<br>
//10月<br>
//第2月曜日	体育の日<br>
//11月<br>
//3日			文化の日<br>
//23日		勤労感謝の日<br>
//12月<br>
//23日		天皇誕生日<br>
//
//※振替休日=その日以後において最も近い国民の祝日でない日<br>
//※国民の休日=祝日と祝日に挟まれた平日を休日とする
//
//@package Base
//@subpackage BusinessDay
//@author 上杉勝史
//@since 2008/02/06
//

require("define.php");

//コンストラクタ
//営業中、夜間営業、メンテナンス中を判定する
//newする場合はこっちを使う
//営業中、夜間営業、メンテナンス中を判定する
//静的呼び出し用
//指定された月の全ての祝日の割り出し
//引数1：年（4桁）
//引数2：月
//引数3：月末
//ハッピーマンデイの算出
//引数1：年（4桁）
//引数2：月
//引数3：第n月曜日
//春分、秋分の日の算出
//引数1：年（4桁）
//引数2：月（3月か9月）
//振替休日の付与
//引数1：年（4桁）
//引数2：月
//引数3：祝日の入った配列
//国民の休日の付与
//引数1：年（4桁）
//引数2：月
//引数3：祝日の入った配列
//土日は営業日から外す
//引数1：年（4桁）
//引数2：月
class BusinessDay {
	BusinessDay(year = "", month = "", day = "", hour = "") //引数チェック(数値）
	{
		if (is_numeric(year) == false || is_numeric(month) == false || is_numeric(day) == false || is_numeric(hour) == false) {
			this.year = date("Y");
			this.month = date("n");
			this.day = date("j");
			this.hour = date("G");
			this.endday = date("t");
		} else {
			var param_time = mktime(hour, 0, 0, month, day, year);
			this.year = date("Y", param_time);
			this.month = date("n", param_time);
			this.day = date("j", param_time);
			this.hour = date("G", param_time);
			this.endday = date("t", param_time);
		}
	}

	chkBusinessTime() //8時から21時までは通常営業時間
	{
		return "normal";

		if (this.hour >= BIZ_START_TIME && this.hour < BIZ_END_TIME) {
			return "normal";
		} else if (this.hour >= MAINTE_START_TIME && this.hour < BIZ_START_TIME) {
			return "maintenance";
		} else //メンテナンス日ならメンテ画面を返す
			{
				if (this.day == this.endday) //月末は必ずメンテナンス
					{
						return "maintenance";
					} else if (this.day == SIMDAY) //シミュレーション日は必ずメンテナンス
					{
						return "maintenance";
					} else //1時と2時は前日の日付として評価する
					//UP日が祝日、営業外と重なっていないかを調べてメンテ日を取得
					//今日がメンテ日かを判断する
					{
						if (this.hour < BIZ_END_TIME) {
							var beftime = mktime(0, 0, 0, this.month, this.day - 1, this.year);
							this.year = date("Y", beftime);
							this.month = date("n", beftime);
							this.day = date("j", beftime);
						}

						var A_thisholiday = this.getHoliday(this.year, this.month, this.endday);
						var A_nextbusinessday = Array();

						for (var i = 0; i < GLOBALS.GA_UPDAYS.length; i++) {
							var add = 0;

							while (-1 !== A_thisholiday.indexOf(+(GLOBALS.GA_UPDAYS[i] + add)) == true) {
								add++;
							}

							A_nextbusinessday.push(+(GLOBALS.GA_UPDAYS[i] + add));
						}

						if (-1 !== A_nextbusinessday.indexOf(+this.day) == true) //UP日はメンテ画面
							{
								return "maintenance";
							} else //それ以外は夜間画面
							{
								return "extend";
							}
					}
			}
	}

	chkBizTime(year = "", month = "", day = "", hour = "") //引数チェック(数値）
	//8時から21時までは通常営業時間
	{
		return "normal";

		if (is_numeric(year) == false || is_numeric(month) == false || is_numeric(day) == false || is_numeric(hour) == false) {
			year = date("Y");
			month = date("n");
			day = date("j");
			hour = date("G");
			var endday = date("t");
		} else {
			var param_time = mktime(hour, 0, 0, month, day, year);
			year = date("Y", param_time);
			month = date("n", param_time);
			day = date("j", param_time);
			hour = date("G", param_time);
			endday = date("t", param_time);
		}

		if (hour >= BIZ_START_TIME && hour < BIZ_END_TIME) {
			return "normal";
		} else if (hour >= MAINTE_START_TIME && hour < BIZ_START_TIME) {
			return "maintenance";
		} else //メンテナンス日ならメンテ画面を返す
			{
				if (day == endday) //月末は必ずメンテナンス
					{
						return "maintenance";
					} else if (day == SIMDAY) //シミュレーション日は必ずメンテナンス
					{
						return "maintenance";
					} else //1時と2時は前日の日付として評価する
					//UP日が祝日、営業外と重なっていないかを調べてメンテ日を取得
					//今日がメンテ日かを判断する
					{
						if (hour < BIZ_END_TIME) {
							var beftime = mktime(0, 0, 0, month, day - 1, year);
							year = date("Y", beftime);
							month = date("n", beftime);
							day = date("j", beftime);
							var bef_endday = date("t", beftime);

							if (day == bef_endday) //月末は必ずメンテナンス
								{
									return "maintenance";
								}
						}

						var A_thisholiday = BusinessDay.getHoliday(year, month, endday);
						var A_nextbusinessday = Array();

						for (var i = 0; i < GLOBALS.GA_UPDAYS.length; i++) {
							var add = 0;

							while (-1 !== A_thisholiday.indexOf(+(GLOBALS.GA_UPDAYS[i] + add)) == true) {
								add++;
							}

							A_nextbusinessday.push(+(GLOBALS.GA_UPDAYS[i] + add));
						}

						if (-1 !== A_nextbusinessday.indexOf(+day) == true) //UP日はメンテ画面
							{
								return "maintenance";
							} else //それ以外は夜間画面
							{
								return "extend";
							}
					}
			}
	}

	getHoliday(year, month, endday) //祝日をセット
	//振替休日
	//国民の休日
	//祝日、振替休日、国民の休日をマージしてユニーク化
	{
		var A_holiday = Array();

		switch (month) {
			case 1:
				A_holiday.push(+1);
				A_holiday.push(+BusinessDay.happyMonday(year, month, 2));
				break;

			case 2:
				A_holiday.push(+11);
				break;

			case 3:
				A_holiday.push(+BusinessDay.equinoxDay(year, month));
				break;

			case 4:
				A_holiday.push(+29);
				break;

			case 5:
				A_holiday.push(+3);
				A_holiday.push(+4);
				A_holiday.push(+5);
				break;

			case 7:
				A_holiday.push(+BusinessDay.happyMonday(year, month, 3));
				break;

			case 9:
				A_holiday.push(+BusinessDay.happyMonday(year, month, 3));
				A_holiday.push(+BusinessDay.equinoxDay(year, month));
				break;

			case 10:
				A_holiday.push(+BusinessDay.happyMonday(year, month, 2));
				break;

			case 11:
				A_holiday.push(+3);
				A_holiday.push(+23);
				break;

			case 12:
				A_holiday.push(+23);
				break;
		}

		var A_close = BusinessDay.closeDay(year, month, endday);
		var A_lieu = BusinessDay.holidayInLieu(year, month, A_holiday);
		var A_nation = BusinessDay.nationsHoliday(year, month, A_holiday);
		var A_result = array_unique(array_merge(A_close, A_holiday, A_lieu, A_nation));
		A_result.sort();
		return A_result;
	}

	happyMonday(year, month, n) //引数チェック(数値）
	{
		if (is_numeric(year) == false || is_numeric(month) == false || is_numeric(n) == false) {
			return false;
		}

		if (n < 1 || n >= 6) {
			return false;
		}

		for (var d = 1; d <= 7; d++) {
			if (date("w", mktime(0, 0, 0, month, d, year)) == 1) {
				return d + 7 * (n - 1);
			}
		}

		return false;
	}

	equinoxDay(year, month) //引数チェック(数値）
	{
		if (is_numeric(year) == false || is_numeric(month) == false) {
			return false;
		}

		if (month == 3) //春分の日の計算式
			{
				return Math.floor(20.8431 + (year - 1980) * 0.242194 - Math.floor((year - 1980) / 4));
			} else if (month == 9) //秋分の日の計算式
			{
				return Math.floor(23.2488 + (year - 1980) * 0.242194 - Math.floor((year - 1980) / 4));
			}

		return false;
	}

	holidayInLieu(year, month, A_holiday) //引数チェック(数値）
	//祝日が日曜日なら振替休日を追加する
	{
		if (is_numeric(year) == false || is_numeric(month) == false) {
			return false;
		}

		if (Array.isArray(A_holiday) == false) {
			return Array();
		}

		var A_lieu = Array();

		for (var i = 0; i < A_holiday.length; i++) {
			if (date("w", mktime(0, 0, 0, month, A_holiday[i], year)) == 0) //振替休日にする日が休日だったらその翌日、その翌日が・・・
				{
					var add = 1;

					while (-1 !== A_holiday.indexOf(A_holiday[i] + add) == true) {
						add++;
					}

					A_lieu.push(+(A_holiday[i] + add));
				}
		}

		return A_lieu;
	}

	nationsHoliday(year, month, A_holiday) //引数チェック(数値）
	//祝日と祝日の間が平日なら国民の休日
	{
		if (is_numeric(year) == false || is_numeric(month) == false) {
			return false;
		}

		if (Array.isArray(A_holiday) == false) {
			return Array();
		}

		var A_nation = Array();

		for (var i = 0; i < A_holiday.length; i++) {
			if (-1 !== A_holiday.indexOf(A_holiday[i] + 2) == true) {
				A_nation.push(+(A_holiday[i] + 1));
			}
		}

		return A_nation;
	}

	closeDay(year, month, endday) //引数チェック(数値）
	//土日を追加
	//最初の土曜日を調べる
	//月末までの土日を追加する
	{
		if (is_numeric(year) == false || is_numeric(month) == false) {
			return false;
		}

		var A_close = Array();

		for (var d = 1; d <= 7; d++) {
			if (date("w", mktime(0, 0, 0, month, d, year)) == 6) {
				break;
			}
		}

		for (var i = d; i <= endday; i += 7) {
			A_close.push(+i);

			if (i + 1 <= endday) {
				A_close.push(+(i + 1));
			}
		}

		return A_close;
	}

};