//夜間営業用　営業タイプ判定クラス
//
//※振替休日=その日以後において最も近い国民の祝日でない日<br>
//※国民の休日=祝日と祝日に挟まれた平日を休日とする<br>
//
//更新履歴：<br>
//2008/04/08 上杉勝史 作成
import MtSetting from "./MtSetting";

export default class MtBusinessDay {
	O_Setting: MtSetting;
	Hour!: number;
	Year!: number;
	Month!: number;
	Day!: number;
	constructor(year = "", month = "", day = "", hour = "") //define.iniを読み込む
	//メンバー変数を設定
	{
		this.O_Setting = MtSetting.singleton();
		this.O_Setting.loadConfig("define");
		this.setMember(year, month, day, hour);
	}

	setMember(year:any = "", month:any = "", day:any = "", hour:any = "") //引数チェック(数値）
	{
		var myDate = new Date();
		if (!isNaN(Number(year)) == false || !isNaN(Number(month)) == false || !isNaN(Number(day)) == false || !isNaN(Number(hour)) == false) {
			this.Year = myDate.getFullYear();
			this.Month = (myDate.getMonth()+1);
			this.Day = +myDate.getDate();
			this.Hour = myDate.getHours();
		} else {
			var param_time = new Date(year,month,day,hour, 0, 0);
			this.Year = param_time.getFullYear();
			this.Month = param_time.getMonth();
			this.Day = +param_time.getDate();
			this.Hour = param_time.getHours();
		}
	}

	chkBusinessType(year:any = "", month:any = "", day:any = "", hour:any = "") //biz_start_timeからbiz_end_timeまでは通常営業時間
	{
		if (this.Hour >= this.O_Setting.get("biz_start_time") && this.Hour < this.O_Setting.get("biz_end_time")) {
			return "normal";
		} else if (this.Hour >= this.O_Setting.get("mainte_start_time") && this.Hour < this.O_Setting.get("biz_start_time")) {
			return "maintenance";
		} else //biz_end_time以降は翌日の日付として評価する
			{
				if (this.Hour >= this.O_Setting.get("biz_end_time")) {
					var beftime = new Date(this.Year,this.Month,this.Day + 1,0, 0, 0);
					this.Year = beftime.getFullYear();
					this.Month = beftime.getMonth();
					this.Day = +beftime.getDate();
				}

				if (this.Day == 1) //1日は必ずメンテナンス
					{
						return "maintenance";
					} else if (this.Day == this.O_Setting.get("simday")) //シミュレーション日は必ずメンテナンス
					{
						return "maintenance";
					} else //指定した年月の祝日と営業していない日を取得する
					//UP日が祝日、営業外と重なっていないかを調べてメンテ日を取得(重なっていたら翌日がメンテ日)
					//今日がメンテ日かを判断する
					{
						var A_thisholiday = this.getHoliday(this.Year, this.Month);
						var A_nextbusinessday = Array();

						for (var i = 0; i < this.O_Setting.get("A_updays").length; i++) {
							var add = 0;

							while (-1 !== A_thisholiday.indexOf(+(this.O_Setting.get("A_updays")[i] + add)) == true) {
								add++;
							}

							A_nextbusinessday.push(+(this.O_Setting.get("A_updays")[i] + add));
						}

						if (-1 !== A_nextbusinessday.indexOf(+this.Day) == true) //UP日はメンテ
							{
								return "maintenance";
							} else //それ以外は夜間
							{
								return "extend";
							}
					}
			}
	}

	getHoliday(year: number, month: number) //祝日をセット
	{
		var A_holiday = Array();

		switch (month) {
			case 1:
				A_holiday.push(+1);
				A_holiday.push(+this.happyMonday(year, month, 2));
				break;

			case 2:
				A_holiday.push(+11);
				break;

			case 3:
				A_holiday.push(+this.equinoxDay(year, month));
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
				A_holiday.push(+this.happyMonday(year, month, 3));
				break;

			case 9:
				A_holiday.push(+this.happyMonday(year, month, 3));
				A_holiday.push(+this.equinoxDay(year, month));
				break;

			case 10:
				A_holiday.push(+this.happyMonday(year, month, 2));
				break;

			case 11:
				A_holiday.push(+3);
				A_holiday.push(+23);
				break;

			case 12:
				A_holiday.push(+23);
				break;
		}

		var A_close = this.closeDay(year, month);
		var A_lieu = this.holidayInLieu(year, month, A_holiday);
		var A_nation = this.nationsHoliday(year, month, A_holiday);
		// var A_result = A_close.concat(A_holiday, A_lieu, A_nation).filter(function (value: string, index: number, self: string) {
		// 		return self.indexOf(value) === index;
		// 	}); 一旦コメンアウト
		var A_result = Array();
		A_result.sort();
		return A_result;
	}

	happyMonday(year: number, month: number, n: number) //引数チェック(数値）
	{
		if (!isNaN(Number(year)) == false || !isNaN(Number(month)) == false || !isNaN(Number(n)) == false) {
			return false;
		}

		if (n < 1 || n >= 6) {
			return false;
		}

		for (var d = 1; d <= 7; d++) {
			if ( new Date(year,month,d,0, 0, 0).getDay() == 1) {
				return d + 7 * (n - 1);
			}
		}

		return false;
	}

	equinoxDay(year: number, month: number) //引数チェック(数値）
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

	holidayInLieu(year:number, month:number, A_holiday: any) //引数チェック(数値）
	//祝日が日曜日なら振替休日を追加する
	{
		if (!isNaN(Number(year)) == false || !isNaN(Number(month)) == false) {
			return false;
		}

		if (Array.isArray(A_holiday) == false) {
			return Array();
		}

		var A_lieu = Array();

		for (var i = 0; i < A_holiday.length; i++) {
			if (new Date(year,month,A_holiday[i],0, 0, 0).getDay() == 0) //振替休日にする日が休日だったらその翌日、その翌日が・・・
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

	nationsHoliday(year: number, month: number, A_holiday: any) //引数チェック(数値）
	//祝日と祝日の間が平日なら国民の休日
	{
		if (!isNaN(Number(year)) == false || !isNaN(Number(month)) == false) {
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

	closeDay(year: number, month: number) //引数チェック(数値）
	//最初の土曜日を調べる
	//月末までの土日を追加する
	{
		if (!isNaN(Number(year)) == false || !isNaN(Number(month)) == false) {
			return false;
		}

		var A_close = Array();

		for (var d = 1; d <= 7; d++) {
			if (new Date(year,month,d,0, 0, 0).getDay() == 6) {
				break;
			}
		}

		var endday = new Date(year,month,1).getDate();

		for (var i = d; i <= endday; i += 7) {
			A_close.push(+i);

			if (i + 1 <= endday) {
				A_close.push(+(i + 1));
			}
		}

		return A_close;
	}

};