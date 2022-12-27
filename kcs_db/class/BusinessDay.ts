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

export default class BusinessDay {
	hour: any;
	year: any;
	month: any;
	day: any;
	endday: any;
	static happyMonday: any;
	static equinoxDay: any;
	static closeDay: any;
	static holidayInLieu: any;
	static nationsHoliday: any;
	BusinessDay(year:number , month:number , day:number, hour:number) //引数チェック(数値）
	{
		var myDate = new Date();
		if (!isNaN(Number(year)) == false || !isNaN(Number(month)) == false || !isNaN(Number(day)) == false || !isNaN(Number(hour)) == false) {
// 2022cvt_017
			this.year = myDate.getFullYear();
			this.month = (myDate.getMonth()+1);
			this.day = +myDate.getDate();
			this.hour = myDate.getHours();
			this.endday = new Date();
		} else {
// 2022cvt_015
            var param_time = new Date(year,month,day,hour, 0, 0);
			this.year = param_time.getFullYear();
			this.month = param_time.getMonth();
			this.day = +param_time.getDate();
			this.hour = param_time.getHours();
			this.endday = new Date();
		}
	}

	chkBusinessTime() //8時から21時までは通常営業時間
	{
		return "normal";

// 		if (this.hour >= BIZ_START_TIME && this.hour < BIZ_END_TIME) {
// 			return "normal";
// 		} else if (this.hour >= MAINTE_START_TIME && this.hour < BIZ_START_TIME) {
// 			return "maintenance";
// 		} else //メンテナンス日ならメンテ画面を返す
// 			{
// 				if (this.day == this.endday) //月末は必ずメンテナンス
// 					{
// 						return "maintenance";
// 					} else if (this.day == SIMDAY) //シミュレーション日は必ずメンテナンス
// 					{
// 						return "maintenance";
// 					} else //1時と2時は前日の日付として評価する
// 					//UP日が祝日、営業外と重なっていないかを調べてメンテ日を取得
// 					//今日がメンテ日かを判断する
// 					{
// 						if (this.hour < BIZ_END_TIME) {
// // 2022cvt_015
// 							var beftime = mktime(0, 0, 0, this.month, this.day - 1, this.year);
// 							this.year = date("Y", beftime);
// 							this.month = date("n", beftime);
// 							this.day = date("j", beftime);
// 						}

// // 2022cvt_015
// 						var A_thisholiday = this.getHoliday(this.year, this.month, this.endday);
// // 2022cvt_015
// 						var A_nextbusinessday = Array();

// // 2022cvt_015
// 						for (var i = 0; i < GLOBALS.GA_UPDAYS.length; i++) {
// // 2022cvt_015
// 							var add = 0;

// 							while (-1 !== A_thisholiday.indexOf(+(GLOBALS.GA_UPDAYS[i] + add)) == true) {
// 								add++;
// 							}

// 							A_nextbusinessday.push(+(GLOBALS.GA_UPDAYS[i] + add));
// 						}

// 						if (-1 !== A_nextbusinessday.indexOf(+this.day) == true) //UP日はメンテ画面
// 							{
// 								return "maintenance";
// 							} else //それ以外は夜間画面
// 							{
// 								return "extend";
// 							}
// 					}
// 			}
	}

	chkBizTime(year = "", month = "", day = "", hour = "") //引数チェック(数値）
	//8時から21時までは通常営業時間
	{
		return "normal";

// 		if (is_numeric(year) == false || is_numeric(month) == false || is_numeric(day) == false || is_numeric(hour) == false) {
// // 2022cvt_017
// 			year = date("Y");
// 			month = date("n");
// 			day = date("j");
// 			hour = date("G");
// // 2022cvt_015
// 			var endday = date("t");
// 		} else {
// // 2022cvt_015
// 			var param_time = mktime(hour, 0, 0, month, day, year);
// 			year = date("Y", param_time);
// 			month = date("n", param_time);
// 			day = date("j", param_time);
// 			hour = date("G", param_time);
// 			endday = date("t", param_time);
// 		}

// 		if (hour >= BIZ_START_TIME && hour < BIZ_END_TIME) {
// 			return "normal";
// 		} else if (hour >= MAINTE_START_TIME && hour < BIZ_START_TIME) {
// 			return "maintenance";
// 		} else //メンテナンス日ならメンテ画面を返す
// 			{
// 				if (day == endday) //月末は必ずメンテナンス
// 					{
// 						return "maintenance";
// 					} else if (day == SIMDAY) //シミュレーション日は必ずメンテナンス
// 					{
// 						return "maintenance";
// 					} else //1時と2時は前日の日付として評価する
// 					//UP日が祝日、営業外と重なっていないかを調べてメンテ日を取得
// 					//今日がメンテ日かを判断する
// 					{
// 						if (hour < BIZ_END_TIME) {
// // 2022cvt_015
// 							var beftime = mktime(0, 0, 0, month, day - 1, year);
// 							year = date("Y", beftime);
// 							month = date("n", beftime);
// 							day = date("j", beftime);
// // 2022cvt_015
// 							var bef_endday = date("t", beftime);

// 							if (day == bef_endday) //月末は必ずメンテナンス
// 								{
// 									return "maintenance";
// 								}
// 						}

// // 2022cvt_015
// 						var A_thisholiday = BusinessDay.getHoliday(year, month, endday);
// // 2022cvt_015
// 						var A_nextbusinessday = Array();

// // 2022cvt_015
// 						for (var i = 0; i < GLOBALS.GA_UPDAYS.length; i++) {
// // 2022cvt_015
// 							var add = 0;

// 							while (-1 !== A_thisholiday.indexOf(+(GLOBALS.GA_UPDAYS[i] + add)) == true) {
// 								add++;
// 							}

// 							A_nextbusinessday.push(+(GLOBALS.GA_UPDAYS[i] + add));
// 						}

// 						if (-1 !== A_nextbusinessday.indexOf(+day) == true) //UP日はメンテ画面
// 							{
// 								return "maintenance";
// 							} else //それ以外は夜間画面
// 							{
// 								return "extend";
// 							}
// 					}
// 			}
	}

	getHoliday(year:number, month:number, endday:number) //祝日をセット
	//振替休日
	//国民の休日
	//祝日、振替休日、国民の休日をマージしてユニーク化
	{
// 2022cvt_015
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

// 2022cvt_015
		var A_close = BusinessDay.closeDay(year, month, endday);
// 2022cvt_015
		var A_lieu = BusinessDay.holidayInLieu(year, month, A_holiday);
// 2022cvt_015
		var A_nation = BusinessDay.nationsHoliday(year, month, A_holiday);
// 2022cvt_015
		var A_result = A_close.concat(A_holiday, A_lieu, A_nation).filter(function (value: string, index: number, self: string) {
				return self.indexOf(value) === index;
			});
		A_result.sort();
		return A_result;
	}

	happyMonday(year:number, month:number, n:number) //引数チェック(数値）
	{
		if (!isNaN(Number(year)) == false || !isNaN(Number(month)) == false || !isNaN(Number(n)) == false) {
			return false;
		}

		if (n < 1 || n >= 6) {
			return false;
		}

// 2022cvt_015
		for (var d = 1; d <= 7; d++) {
			if (new Date(year,month,d,0, 0, 0).getDay() == 1) {
				return d + 7 * (n - 1);
			}
		}

		return false;
	}

	equinoxDay(year:number, month:number) //引数チェック(数値）
	{
		if (!isNaN(Number(year)) == false || !isNaN(Number(month)) == false) {
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

	holidayInLieu(year:number, month:number, A_holiday:any) //引数チェック(数値）
	//祝日が日曜日なら振替休日を追加する
	{
		if (!isNaN(Number(year))  == false || !isNaN(Number(month)) == false) {
			return false;
		}

		if (Array.isArray(A_holiday) == false) {
			return Array();
		}

// 2022cvt_015
		var A_lieu = Array();

// 2022cvt_015
		for (var i = 0; i < A_holiday.length; i++) {
			if (new Date(year,month,0, 0, 0).getDay() == 0) //振替休日にする日が休日だったらその翌日、その翌日が・・・
				{
// 2022cvt_015
					var add = 1;

					while (-1 !== A_holiday.indexOf(A_holiday[i] + add) == true) {
						add++;
					}

					A_lieu.push(+(A_holiday[i] + add));
				}
		}

		return A_lieu;
	}

	nationsHoliday(year:number, month:number, A_holiday:any) //引数チェック(数値）
	//祝日と祝日の間が平日なら国民の休日
	{
		if (!isNaN(Number(year))  == false || !isNaN(Number(month)) == false) {
			return false;
		}

		if (Array.isArray(A_holiday) == false) {
			return Array();
		}

// 2022cvt_015
		var A_nation = Array();

// 2022cvt_015
		for (var i = 0; i < A_holiday.length; i++) {
			if (-1 !== A_holiday.indexOf(A_holiday[i] + 2) == true) {
				A_nation.push(+(A_holiday[i] + 1));
			}
		}

		return A_nation;
	}

	closeDay(year:number, month:number, endday:number) //引数チェック(数値）
	//土日を追加
	//最初の土曜日を調べる
	//月末までの土日を追加する
	{
	if (!isNaN(Number(year))  == false || !isNaN(Number(month)) == false) {
			return false;
		}

// 2022cvt_015
		var A_close = Array();

// 2022cvt_015
		for (var d = 1; d <= 7; d++) {
			if (new Date(year,month,d,0, 0, 0).getDay() == 6) {
				break;
			}
		}

// 2022cvt_015
		for (var i = d; i <= endday; i += 7) {
			A_close.push(+i);

			if (i + 1 <= endday) {
				A_close.push(+(i + 1));
			}
		}

		return A_close;
	}
};
