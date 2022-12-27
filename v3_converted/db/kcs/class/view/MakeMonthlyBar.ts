//
//年月バー生成クラス
//
//@package Shared View
//@subpackage MonthlyBar
//@author houshiyama
//@since 2008/03/06
//@filesource
//
//
//
//
//年月バー生成クラス
//
//@package Shared View
//@subpackage MonthlyBar
//@author houshiyama
//@since 2008/02/27
//
//

//
//isLink
//
//@author houshiyama
//@since 2008/02/28
//
//@param mixed $year
//@param mixed $month
//@access public
//@return void
//
//
//
//年月バーを生成する
//
//@author houshiyama
//@since 2008/02/28
//
//@param mixed $cym
//@param int $start
//@param mixed $current
//@param mixed $setrootpost
//@param mixed $showall
//@param mixed $past
//@param mixed $billtype // EV対応で追加 20100916miya
//@access public
//@return void
//
//
//
//年月バーを生成する（英語）
//
//@author houshiyama
//@since 2008/02/28
//
//@param mixed $cym
//@param int $start
//@param mixed $current
//@param mixed $setrootpost
//@param mixed $showall
//@param mixed $past
//@param mixed $billtype // EV対応で追加 20100916miya
//@access public
//@return void
//
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
//
class MakeMonthlyBar {
	isLink(year, month) {
		return true;
	}

	makeMonthlyBarHTML(cym, start = 25, showall = false, past = false, billtype = "") //今月も含める場合は+1
	//繰り上げ繰り下げ処理
	//テーブル生成
	{
		var cy = cym.substr(0, 4);
		var cm = cym.substr(4, 2);
		var A_ym = Array();
		A_ym[0] = date("Y");
		A_ym[1] = date("n");

		if (false == past) {
			A_ym[1] = A_ym[1] + 1;
		}

		A_ym[1] = A_ym[1] - start;

		for (A_ym[1]; A_ym[1] < 1; ) {
			A_ym[1] = A_ym[1] + 12;
			A_ym[0] = A_ym[0] - 1;
		}

		var table = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"YM\">\n" + "\t<tr>\n";

		for (ymcnt = 0, addm = 0; ymcnt < start; ymcnt++, addm++) //月数が12を越えたら翌年へ
		{
			var year = A_ym[0];
			var month = A_ym[1] + addm;

			if (0 == ymcnt) {
				table += "<td>&nbsp;<span class=\"yy\">" + year + "\u5E74</span></td>\n";
			}

			if (cy == year && ltrim(cm, "0") == month) {
				table += "<td>&nbsp;<span class=\"curmm\">" + month + "\u6708</span></td>\n";
			} else {
				table += "<td>&nbsp;<a href=\"?ym=" + year + str_pad(month, 2, "0", STR_PAD_LEFT) + "\" class=\"mm\">" + month + "\u6708</a></td>\n";
			}

			if (month == 12) {
				table += "<td>&nbsp;<span class=\"yy\">" + (year + 1) + "\u5E74</span></td>\n";
				addm = 0;
				A_ym[0]++;
				A_ym[1] = 0;
			}
		}

		if (true == showall) {
			if (cym == "all") {
				table += "<td>&nbsp;<span class=\"curmm\">\u3059\u3079\u3066</span></td>\n";
			} else {
				table += "<td>&nbsp;<a href=\"?ym=all\" class=\"mm\">\u3059\u3079\u3066</a></td>\n";
			}
		}

		if ("ev" == billtype) {
			if (cym == "current") {
				table += "<td>&nbsp;<span class=\"curmm\">\u672A\u78BA\u5B9A</span></td>\n";
			} else {
				table += "<td>&nbsp;<a href=\"?ym=current\" class=\"mm\">\u672A\u78BA\u5B9A</a></td>\n";
			}
		}

		table += "</tr>\n" + "</table>\n";
		return table;
	}

	makeMonthlyBarHTMLEng(cym, start = 25, showall = false, past = false, billtype = "") //今月も含める場合は+1
	//繰り上げ繰り下げ処理
	//テーブル生成
	{
		var cy = cym.substr(0, 4);
		var cm = cym.substr(4, 2);
		var A_ym = Array();
		A_ym[0] = date("Y");
		A_ym[1] = date("n");

		if (false == past) {
			A_ym[1] = A_ym[1] + 1;
		}

		A_ym[1] = A_ym[1] - start;

		for (A_ym[1]; A_ym[1] < 1; ) {
			A_ym[1] = A_ym[1] + 12;
			A_ym[0] = A_ym[0] - 1;
		}

		var table = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"YM\">\n" + "\t<tr>\n";

		for (ymcnt = 0, addm = 0; ymcnt < start; ymcnt++, addm++) //月数が12を越えたら翌年へ
		{
			var year = A_ym[0];
			var month = A_ym[1] + addm;

			if (0 == ymcnt) {
				table += "<td>&nbsp;<span class=\"yy\">" + year + "</span></td>\n";
			}

			if (cy == year && ltrim(cm, "0") == month) {
				table += "<td>&nbsp;<span class=\"curmm\">" + date("M", mktime(0, 0, 0, month, 1, year)) + "</span></td>\n";
			} else {
				table += "<td>&nbsp;<a href=\"?ym=" + year + str_pad(month, 2, "0", STR_PAD_LEFT) + "\" class=\"mm\">" + date("M", mktime(0, 0, 0, month, 1, year)) + "</a></td>\n";
			}

			if (month == 12) {
				table += "<td>&nbsp;<span class=\"yy\">" + (year + 1) + "</span></td>\n";
				addm = 0;
				A_ym[0]++;
				A_ym[1] = 0;
			}
		}

		if (true == showall) {
			if (cym == "all") {
				table += "<td>&nbsp;<span class=\"curmm\">ALL</span></td>\n";
			} else {
				table += "<td>&nbsp;<a href=\"?ym=all\" class=\"mm\">ALL</a></td>\n";
			}
		}

		if ("ev" == billtype) {
			if (cym == "current") {
				table += "<td>&nbsp;<span class=\"curmm\">\u2605\u672A\u78BA\u5B9A</span></td>\n";
			} else {
				table += "<td>&nbsp;<a href=\"?ym=current\" class=\"mm\">\u2605\u672A\u78BA\u5B9A</a></td>\n";
			}
		}

		table += "</tr>\n" + "</table>\n";
		return table;
	}

	__destruct() {}

};