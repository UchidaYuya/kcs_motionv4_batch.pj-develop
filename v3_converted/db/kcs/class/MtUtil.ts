//
//汎用関数集
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Base
//@subpackage Management
//@author houshiyama
//@filesource
//@since 2008/02/27
//@uses MtDBUtil
//@uses MtDateUtil
//@uses PostLinkPost
//@uses TableMake
//@uses MakeMonthlyBar
//@uses MakePageLink
//@uses MakePankuzuLink
//
//
//
//汎用関数集
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Base
//@subpackage Management
//@author houshiyama
//@filesource
//@since 2008/02/27
//@uses MtDBUtil
//@uses PostLinkPost
//@uses TableMake
//@uses MakeMonthlyBar
//@uses MakePageLink
//@uses MakePankuzuLink
//

require("MtDBUtil.php");

require("MtDateUtil.php");

require("PostLinkPost.php");

require("TableMake.php");

require("view/MakeMonthlyBar.php");

require("view/MakePageLink.php");

require("view/MakePankuzuLink.php");

//
//今の時間・日付
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/03/04
//
//@param mixed $O_db
//@param mixed $pactid
//@access public
//@return void
//
//
//表示部署のタイプを返す
//
//@author houshiyama
//@since 2008/02/25
//
//@access public
//@return array
//
//
//表示部署のタイプを返す
//
//@author houshiyama
//@since 2008/02/25
//
//@access public
//@return array
//
//
//パンくずリンクの生成
//
//@author houshiyama
//@since 2008/03/07
//
//@param mixed $H_link
//@access public
//@return void
//
//
//パンくずリンクの生成（英語）
//
//@author houshiyama
//@since 2008/03/07
//
//@param mixed $H_link
//@access public
//@return void
//
//
//年月バーの生成
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $cym
//@param mixed $cnt
//@param mixed $all
//@param mixed $billtype  // EV対応で追加 20100916miya
//@access public
//@return void
//@uses MakeMonthlyBar
//
//
//年月バーの生成（英語）
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $cym
//@param mixed $cnt
//@param mixed $all
//@param mixed $billtype  // EV対応で追加 20100916miya
//@access public
//@return void
//@uses MakeMonthlyBar
//
//
//年月バーの生成
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $cym
//@param mixed $billtype  // EV対応で追加 20100916miya
//@access public
//@return string（HTML）
//@uses MakeMonthlyBar
//
//
//年月バーの生成
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $cym
//@param mixed $billtype  // EV対応で追加 20100916miya
//@access public
//@return string（HTML）
//@uses MakeMonthlyBar
//
//
//ページリンクを取得する
//
//@author houshiyama
//@since 2008/03/06
//
//@param mixed $cnt
//@param mixed $limit
//@param mixed $offset
//@access public
//@return string（HTML）
//@uses MakePageLink
//
//
//ページリンクを取得する（英語）
//
//@author houshiyama
//@since 2008/12/10
//
//@param mixed $cnt
//@param mixed $limit
//@param mixed $offset
//@access public
//@return string（HTML）
//@uses MakePageLink
//
//
//no_view型をno型に変更する
//
//@author houshiyama
//@since 2008/02/28
//
//@param mixed $telno
//@access public
//@return string
//
//
//クイックフォームの日付型のフォーマットを返す
//
//@author houshiyama
//@since 2008/02/29
//
//@access public
//@return array
//
//
//クイックフォームの日付型のフォーマットを返す（英語）
//
//@author houshiyama
//@since 2008/02/29
//
//@access public
//@return array
//
//
//クイックフォームの日付型のフォーマットを返す（年月のみ）
//
//@author houshiyama
//@since 2008/02/29
//
//@access public
//@return array
//
//
//クイックフォームの日付型のフォーマットを返す（年月のみ）（英語）
//
//@author houshiyama
//@since 2008/02/29
//
//@access public
//@return array
//
//
//クイックフォームの日付型のフォーマットを返す(年月日時)
//
//@author igarashi
//@since 2008/07/25
//
//@access public
//@return array
//
//
//請求月（利用月）の配列を返す（キーはYYYYMM）
//
//@author houshiyama
//@since 2008/06/24
//
//@access public
//@return void
//
//
//フォームの入力を日付型に整形する <br>
//QuickFormのinput type dateはこれを使ってDBのtimestamp型に入れる
//
//@author houshiyama
//@since 2008/03/13
//
//@param mixed $A_date
//@param mixed $sep（年月日を繋ぐ文字）
//@access public
//@return void
//
//
//渡された値を数値のみにして返す<br>
//flgがtrueなら全角数を半角に直す
//
//@author igarashi
//@since 2008/06/27
//
//@param $num
//@param $flg
//
//@access public
//@return integer
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class MtUtil {
	constructor() {
		this.Now = MtDateUtil.getNow();
		this.Today = MtDateUtil.getToday();
		this.A_Now = split("-| |:", this.Now);
		this.ThisYear = this.A_Now[0];
		this.ThisMonth = this.A_Now[1];
		this.ThisDate = this.A_Now[2];
		this.ThisHour = this.A_Now[3];
		this.ThisMin = this.A_Now[4];
		this.ThisSec = this.A_Now[5];
	}

	getHashPostTarget() {
		var H_res = {
			"0": ["\u5BFE\u8C61\u90E8\u7F72\u306E\u307F", "checked"],
			"1": ["\u914D\u4E0B\u5168\u3066\u306E\u90E8\u7F72"]
		};
		return H_res;
	}

	getHashPostTargetEng() {
		var H_res = {
			"0": ["Only object department", "checked"],
			"1": ["All child departments"]
		};
		return H_res;
	}

	getPankuzuLink(H_link, site = "user") {
		var str = MakePankuzuLink.makePankuzuLinkHTML(H_link, site);
		return str;
	}

	getPankuzuLinkEng(H_link, site = "user") {
		var str = MakePankuzuLink.makePankuzuLinkHTMLEng(H_link, site);
		return str;
	}

	getDateTree(cym, cnt = 24, all = "", billtype = "") {
		var date_tree = MakeMonthlyBar.makeMonthlyBarHTML(cym, cnt, all, false, billtype);
		return date_tree;
	}

	getDateTreeEng(cym, cnt = 24, all = "", billtype = "") {
		var date_tree = MakeMonthlyBar.makeMonthlyBarHTMLEng(cym, cnt, all, false, billtype);
		return date_tree;
	}

	getHalfDateTree(cym, billtype = "") {
		var date_tree = MakeMonthlyBar.makeMonthlyBarHTML(cym, 12, "", false, billtype);
		return date_tree;
	}

	getHalfDateTreeEng(cym, billtype = "") {
		var date_tree = MakeMonthlyBar.makeMonthlyBarHTMLEng(cym, 12, "", false, billtype);
		return date_tree;
	}

	getPageLink(cnt, limit, offset) {
		var page_link = MakePageLink.makePageLinkHTML(cnt, limit, offset);
		return page_link;
	}

	getPageLinkEng(cnt, limit, offset) {
		var page_link = MakePageLink.makePageLinkHTMLEng(cnt, limit, offset);
		return page_link;
	}

	convertNoView(no) {
		var res = no.replace(/(-|\(|\)|\s|　)/g, "");
		return res;
	}

	getDateFormat(min = undefined, max = 11) {
		if (is_null(min)) {
			var minimum = 1985;
		} else if ("string" == typeof min) {
			minimum = +min;
		} else {
			minimum = this.ThisYear - min;
		}

		var H_date = {
			minYear: minimum,
			maxYear: this.ThisYear + max,
			format: "Y \u5E74 m \u6708 d \u65E5",
			language: "ja",
			addEmptyOption: true,
			emptyOptionValue: "",
			emptyOptionText: "--"
		};
		return H_date;
	}

	getDateFormatEng(min = undefined, max = 11) {
		if (is_null(min)) {
			var minimum = 1985;
		} else if ("string" == typeof min) {
			minimum = +min;
		} else {
			minimum = this.ThisYear - min;
		}

		var H_date = {
			minYear: minimum,
			maxYear: this.ThisYear + max,
			format: "Y / m / d ",
			language: "ja",
			addEmptyOption: true,
			emptyOptionValue: "",
			emptyOptionText: "--"
		};
		return H_date;
	}

	getMonthFormat(min = 10, max = 2) {
		var H_date = {
			minYear: this.ThisYear - min,
			maxYear: this.ThisYear + max,
			format: "Y \u5E74 m \u6708",
			language: "ja",
			addEmptyOption: true,
			emptyOptionValue: "",
			emptyOptionText: "--"
		};
		return H_date;
	}

	getMonthFormatEng(min = 10, max = 2) {
		var H_date = {
			minYear: this.ThisYear - min,
			maxYear: this.ThisYear + max,
			format: "Y / m ",
			language: "ja",
			addEmptyOption: true,
			emptyOptionValue: "",
			emptyOptionText: "--"
		};
		return H_date;
	}

	getDateHourFormat(miny = 10, maxy = 2, minh = 0, maxh = 23) {
		var H_date = {
			minYear: this.ThisYear - miny,
			maxYear: this.ThisYear + maxy,
			minHour: minh,
			maxHour: maxh,
			addemptyOption: true,
			format: "Y \u5E74 m \u6708 d \u65E5 H \u6642",
			language: "ja",
			emptyOptionValue: "",
			emptyOptionText: "--"
		};
		return H_date;
	}

	getMonthlyHash() {
		var H_month = Array();

		for (var mon = 1; mon <= 12; mon++) //対象の年、月を取得
		//請求年、月を取得
		{
			var trg_year = date("Y", mktime(0, 0, 0, date("n") - mon, 1, date("Y")));
			var trg_mon = date("m", mktime(0, 0, 0, date("n") - mon, 1, date("Y")));
			var bill_year = date("Y", mktime(0, 0, 0, date("n") - mon + 1, 1, date("Y")));
			var bill_mon = date("m", mktime(0, 0, 0, date("n") - mon + 1, 1, date("Y")));
			var key = bill_year + bill_mon;
			H_month[key] = bill_year + "\u5E74" + bill_mon + "\u6708\u8ACB\u6C42\u5206(" + trg_year + "\u5E74" + trg_mon + "\u6708\u767B\u9332\u5206)";
		}

		return H_month;
	}

	convertDatetime(A_date, sep = "-") {
		if ("" != A_date.Y + A_date.m + A_date.d) //年無し
			{
				if ("" == A_date.Y) //今年を入れる
					{
						A_date.Y = date("Y");
					}

				if ("" == A_date.m) //1月を入れる
					{
						A_date.m = "01";
					}

				if ("" == A_date.d) //1日を入れる
					{
						A_date.d = "01";
					}

				var date = A_date.Y + sep + str_pad(A_date.m, 2, "0", STR_PAD_LEFT) + sep + str_pad(A_date.d, 2, "0", STR_PAD_LEFT);
			} else {
			date = "";
		}

		return date;
	}

	checkNumeric(num, flg = true) {
		num = num.replace(/^.*-/g, "");
		num = num.replace(/[^0-9０-９]/g, "");

		if (true == flg) {
			num = mb_convert_kana(num, n);
		}

		return num;
	}

	__destruct() {}

};