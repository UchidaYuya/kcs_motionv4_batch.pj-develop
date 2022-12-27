//
//夜間営業用　営業タイプ判定クラス
//
//※振替休日=その日以後において最も近い国民の祝日でない日<br>
//※国民の休日=祝日と祝日に挟まれた平日を休日とする<br>
//
//更新履歴：<br>
//2008/04/08 上杉勝史 作成
//
//@filesource
//@package Base
//@subpackage BusinessDay
//@author katsushi
//@since 2008/04/08
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
//@author katsushi
//@since 2008/04/08
//

require("MtSetting.php");

//
//コンストラクタ
//
//@author katsushi
//@since 2008/04/08
//
//@param string $year
//@param string $month
//@param string $day
//@param string $hour
//@access public
//@return void
//
//
//メンバー変数を設定する
//
//@author katsushi
//@since 2008/04/08
//
//@param string $year
//@param string $month
//@param string $day
//@param string $hour
//@access public
//@return void
//
//
//営業中、夜間営業、メンテナンス中を判定する
//
//@author katsushi
//@since 2008/04/08
//
//@access public
//@return string
//
//
//指定された月の全ての祝日を配列で返す<br>
//引数：年、月、月末の日付
//
//@author katsushi
//@since 2008/04/08
//
//@param integer $year
//@param integer $month
//@access public
//@return array
//
//
//ハッピーマンデイの算出<br>
//引数1：年（4桁）<br>
//引数2：月<br>
//引数3：第n月曜日<br>
//
//@author katsushi
//@since 2008/04/08
//
//@param integer $year
//@param integer $month
//@param integer $n
//@access public
//@return integer
//
//
//春分、秋分の日の算出<br>
//引数1：年（4桁）<br>
//引数2：月（3月か9月）
//
//@author katsushi
//@since 2008/04/08
//
//@param integer $year
//@param integer $month
//@access public
//@return integer
//
//
//振替休日の付与<br>
//引数1：年（4桁）<br>
//引数2：月<br>
//引数3：祝日の入った配列
//
//@author katsushi
//@since 2008/04/08
//
//@param integer $year
//@param integer $month
//@param array $A_holiday
//@access public
//@return array
//
//
//国民の休日の付与<br>
//引数1：年（4桁）<br>
//引数2：月<br>
//引数3：祝日の入った配列
//
//@author katsushi
//@since 2008/04/08
//
//@param integer $year
//@param integer $month
//@param array $A_holiday
//@access public
//@return array
//
//
//土日は営業日から外す<br>
//引数1：年（4桁）<br>
//引数2：月
//
//@author katsushi
//@since 2008/04/08
//
//@param integer $year
//@param integer $month
//@access public
//@return array
//
class MtBusinessDay {
	constructor(year = "", month = "", day = "", hour = "") //define.iniを読み込む
	//メンバー変数を設定
	{
		this.O_Setting = MtSetting.singleton();
		this.O_Setting.loadConfig("define");
		this.setMember(year, month, day, hour);
	}

	setMember(year = "", month = "", day = "", hour = "") //引数チェック(数値）
	{
		if (is_numeric(year) == false || is_numeric(month) == false || is_numeric(day) == false || is_numeric(hour) == false) {
			this.Year = date("Y");
			this.Month = date("n");
			this.Day = date("j");
			this.Hour = date("G");
		} else {
			var param_time = mktime(hour, 0, 0, month, day, year);
			this.Year = date("Y", param_time);
			this.Month = date("n", param_time);
			this.Day = date("j", param_time);
			this.Hour = date("G", param_time);
		}
	}

	chkBusinessType() //biz_start_timeからbiz_end_timeまでは通常営業時間
	{
		if (this.Hour >= this.O_Setting.biz_start_time && this.Hour < this.O_Setting.biz_end_time) {
			return "normal";
		} else if (this.Hour >= this.O_Setting.mainte_start_time && this.Hour < this.O_Setting.biz_start_time) {
			return "maintenance";
		} else //biz_end_time以降は翌日の日付として評価する
			{
				if (this.Hour >= this.O_Setting.biz_end_time) {
					var beftime = mktime(0, 0, 0, this.Month, this.Day + 1, this.Year);
					this.Year = date("Y", beftime);
					this.Month = date("n", beftime);
					this.Day = date("j", beftime);
				}

				if (this.Day == 1) //1日は必ずメンテナンス
					{
						return "maintenance";
					} else if (this.Day == this.O_Setting.simday) //シミュレーション日は必ずメンテナンス
					{
						return "maintenance";
					} else //指定した年月の祝日と営業していない日を取得する
					//UP日が祝日、営業外と重なっていないかを調べてメンテ日を取得(重なっていたら翌日がメンテ日)
					//今日がメンテ日かを判断する
					{
						var A_thisholiday = this.getHoliday(this.Year, this.Month);
						var A_nextbusinessday = Array();

						for (var i = 0; i < this.O_Setting.A_updays.length; i++) {
							var add = 0;

							while (-1 !== A_thisholiday.indexOf(+(this.O_Setting.A_updays[i] + add)) == true) {
								add++;
							}

							A_nextbusinessday.push(+(this.O_Setting.A_updays[i] + add));
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

	getHoliday(year, month) //祝日をセット
	//振替休日
	//国民の休日
	//祝日、振替休日、国民の休日をマージしてユニーク化
	{
		var A_holiday = Array();

		switch (month) {
			case 1:
				A_holiday.push(+1);
				A_holiday.push(+MtBusinessDay.happyMonday(year, month, 2));
				break;

			case 2:
				A_holiday.push(+11);
				break;

			case 3:
				A_holiday.push(+MtBusinessDay.equinoxDay(year, month));
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
				A_holiday.push(+MtBusinessDay.happyMonday(year, month, 3));
				break;

			case 9:
				A_holiday.push(+MtBusinessDay.happyMonday(year, month, 3));
				A_holiday.push(+MtBusinessDay.equinoxDay(year, month));
				break;

			case 10:
				A_holiday.push(+MtBusinessDay.happyMonday(year, month, 2));
				break;

			case 11:
				A_holiday.push(+3);
				A_holiday.push(+23);
				break;

			case 12:
				A_holiday.push(+23);
				break;
		}

		var A_close = MtBusinessDay.closeDay(year, month);
		var A_lieu = MtBusinessDay.holidayInLieu(year, month, A_holiday);
		var A_nation = MtBusinessDay.nationsHoliday(year, month, A_holiday);
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

	holidayInLieu(year, month, A_holiday: {} | any[]) //引数チェック(数値）
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

	nationsHoliday(year, month, A_holiday: {} | any[]) //引数チェック(数値）
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

	closeDay(year, month) //引数チェック(数値）
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

		var endday = date("t", mktime(0, 0, 0, month, 1, year));

		for (var i = d; i <= endday; i += 7) {
			A_close.push(+i);

			if (i + 1 <= endday) {
				A_close.push(+(i + 1));
			}
		}

		return A_close;
	}

};