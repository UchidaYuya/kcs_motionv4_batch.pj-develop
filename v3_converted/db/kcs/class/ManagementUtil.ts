//
//管理情報用汎用関数集
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
//
//
//管理情報用汎用関数集
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

require("MtUtil.php");

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
//検索条件（AND、OR）の配列を返す
//
//@author houshiyama
//@since 2008/02/28
//
//@access public
//@return void
//
//
//日付条件のプルダウンを返す
//
//@author houshiyama
//@since 2008/02/27
//
//@access public
//@return array
//
//
//日付条件のプルダウンを返す（英語）
//
//@author houshiyama
//@since 2008/12/17
//
//@access public
//@return array
//
//
//数値条件のプルダウンを返す
//
//@author houshiyama
//@since 2008/03/25
//
//@access public
//@return void
//
//
//数値条件のプルダウンを返す（英語）
//
//@author houshiyama
//@since 2008/12/17
//
//@access public
//@return void
//
//
//電話新規登録のタイプを返す
//
//@author houshiyama
//@since 2008/06/05
//
//@access public
//@return array
//
//
//電話新規登録のタイプを返す（英語）
//
//@author houshiyama
//@since 2008/12/17
//
//@access public
//@return array
//
//
//電話変更のタイプを返す
//
//@author houshiyama
//@since 2008/06/17
//
//@access public
//@return array
//
//
//電話変更のタイプを返す
//
//@author houshiyama
//@since 2008/12/17
//
//@access public
//@return array
//
//
//電話移動のタイプを返す
//
//@author houshiyama
//@since 2008/06/17
//
//@access public
//@return array
//
//
//電話移動のタイプを返す（英語）
//
//@author houshiyama
//@since 2009/03/05
//
//@access public
//@return void
//
//
//電話移動のタイプを返す
//
//@author houshiyama
//@since 2008/06/17
//
//@access public
//@return array
//
//
//電話移動のタイプを返す（英語）
//
//@author houshiyama
//@since 2009/03/05
//
//@access public
//@return void
//
//
//電話削除のタイプを返す
//
//@author houshiyama
//@since 2008/08/07
//
//@access public
//@return array
//
//
//電話削除のタイプを返す（英語）
//
//@author houshiyama
//@since 2008/08/07
//
//@access public
//@return array
//
//
//クイックフォームの日付型のフォーマットを返す（移動、削除用）
//
//@author houshiyama
//@since 2008/06/18
//
//@access public
//@return array
//
//
//クイックフォームの日付型のフォーマットを返す（移動、削除英語用）
//
//@author houshiyama
//@since 2008/06/18
//
//@access public
//@return array
//
//
//予約用クイックフォームの日付型のフォーマットを返す
//
//@author houshiyama
//@since 2008/02/29
//
//@access public
//@return array
//
//
//予約用クイックフォームの日付型のフォーマットを返す（英語）
//
//@author houshiyama
//@since 2008/02/29
//
//@access public
//@return array
//
//
//○ヶ月後の年月日を作成
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $limit_month（何ヶ月先か？）
//@access public
//@return $A_date = array(yaer , month , date)
//
//
//○ヶ月前の年月日を作成
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $limit_month（何ヶ月前か？）
//@access public
//@return $A_date = array(yaer , month , date)
//
//
//翌日の日付取得（予約開始日用）
//
//@author houshiyama
//@since 2008/06/20
//
//@access public
//@return void
//
//
//公私分計についての配列を返す
//
//@author houshiyama
//@since 2008/06/20
//
//@access public
//@return array
//
//
//公私分計についての配列を返す（英語）
//
//@author houshiyama
//@since 2008/06/20
//
//@access public
//@return array
//
//
//公私分計についての配列を返す
//
//@author houshiyama
//@since 2008/06/20
//
//@access public
//@return array
//
//
//公私分計についての配列を返す（英語）
//
//@author houshiyama
//@since 2008/06/20
//
//@access public
//@return array
//
//
//端末のフォームに付いている印を取る
//
//@author houshiyama
//@since 2008/06/12
//
//@param mixed $H_post（フォームの値）
//@param mixed $formcnt（フォームの数）
//@access public
//@return void
//
//
//グループチェックボックス用の配列をカンマ区切りの文字列にする
//
//@author houshiyama
//@since 2008/06/11
//
//@param mixed $str
//@access public
//@return void
//
//
//端末紐付きに関するチェックボックス用
//
//@author houshiyama
//@since 2008/12/08
//
//@access public
//@return void
//
//
//端末紐付きに関するチェックボックス用（英語）
//
//@author houshiyama
//@since 2008/12/08
//
//@access public
//@return void
//
//
//警告状態のブルダウン作成
//
//@author houshiyama
//@since 2009/09/02
//
//@access public
//@return void
//
//
//警告状態のブルダウン作成（英語）
//
//@author houshiyama
//@since 2009/09/02
//
//@access public
//@return void
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
class ManagementUtil extends MtUtil {
	constructor() {
		super();
	}

	getSearchCondition() {
		var H_res = {
			AND: ["AND"],
			OR: ["OR"]
		};
		return H_res;
	}

	getDateCondition() {
		var H_res = {
			"=": "\u3068\u7B49\u3057\u3044",
			"<": "\u3088\u308A\u524D",
			">": "\u3088\u308A\u5F8C"
		};
		return H_res;
	}

	getDateConditionEng() {
		var H_res = {
			"=": "equel to",
			"<": "before",
			">": "after"
		};
		return H_res;
	}

	getIntCondition() {
		var H_res = {
			"=": "\u3068\u7B49\u3057\u3044",
			"<": "\u3088\u308A\u5C0F\u3055\u3044",
			">": "\u3088\u308A\u5927\u304D\u3044"
		};
		return H_res;
	}

	getIntConditionEng() {
		var H_res = {
			"=": "equel to",
			"<": "smaller than",
			">": "bigger than"
		};
		return H_res;
	}

	getAddTypeHash() {
		var H_res = {
			now: ["\u4ECA\u3059\u3050\u767B\u9332", "onclick=\"disableAddradio()\""],
			reserve: ["\u4E88\u7D04", "onclick=\"disableAddradio()\""]
		};
		return H_res;
	}

	getAddTypeHashEng() {
		var H_res = {
			now: ["Register now", "onclick=\"disableAddradio()\""],
			reserve: ["Reserve", "onclick=\"disableAddradio()\""]
		};
		return H_res;
	}

	getModTypeHash() {
		var H_res = {
			now: ["\u4ECA\u3059\u3050\u5909\u66F4", "onclick=\"disableModradio()\""],
			reserve: ["\u4E88\u7D04", "onclick=\"disableModradio()\""]
		};
		return H_res;
	}

	getModTypeHashEng() {
		var H_res = {
			now: ["Update now", "onclick=\"disableModradio()\""],
			reserve: ["Reserve", "onclick=\"disableModradio()\""]
		};
		return H_res;
	}

	getMoveTypeHash() {
		var H_res = {
			first: ["\u5F53\u67081\u65E5\u4ED8\u3067\u79FB\u52D5", "onclick=\"disableMoveradio()\""],
			shitei: ["\u6307\u5B9A\u65E5\u3067\u79FB\u52D5", "onclick=\"disableMoveradio()\""]
		};
		return H_res;
	}

	getMoveTypeHashEng() {
		var H_res = {
			first: ["Shift as of the 1st of this month", "onclick=\"disableMoveradio()\""],
			shitei: ["Shift on specified date", "onclick=\"disableMoveradio()\""]
		};
		return H_res;
	}

	getMoveMethodHash() {
		var H_res = {
			only: ["\u9078\u629E\u3057\u305F\u5BFE\u8C61\u3092\u79FB\u52D5"],
			all: ["\u9078\u629E\u3057\u305F\u5BFE\u8C61\u3068\u95A2\u9023\u3059\u308B\u96FB\u8A71\u3082\u79FB\u52D5"]
		};
		return H_res;
	}

	getMoveMethodHashEng() {
		var H_res = {
			only: ["Shift selected target"],
			all: ["Shift phones related to the selected target"]
		};
		return H_res;
	}

	getDelMethodHash() {
		var H_res = {
			only: ["\u7AEF\u672B\u306F\u524A\u9664\u3057\u306A\u3044"],
			all: ["\u7AEF\u672B\u3082\u524A\u9664\u3059\u308B"]
		};
		return H_res;
	}

	getDelMethodHashEng() {
		var H_res = {
			only: ["Do not delete handset"],
			all: ["Delete handset as well"]
		};
		return H_res;
	}

	getMoveDelDateFormat(from, to) {
		var A_firstdate = ManagementUtil.makeLimitFirstDate(from);
		var A_lastdate = ManagementUtil.makeLimitLastDate(to);
		var H_date = {
			minYear: A_firstdate[0],
			maxYear: A_lastdate[0],
			addEmptyOption: true,
			format: "Y \u5E74 m \u6708 d \u65E5",
			language: "ja",
			addEmptyOption: true,
			emptyOptionValue: "",
			emptyOptionText: "--"
		};
		return H_date;
	}

	getMoveDelDateFormatEng(from, to) {
		var A_firstdate = ManagementUtil.makeLimitFirstDate(from);
		var A_lastdate = ManagementUtil.makeLimitLastDate(to);
		var H_date = {
			minYear: A_firstdate[0],
			maxYear: A_lastdate[0],
			addEmptyOption: true,
			format: "Y / m / d ",
			language: "ja",
			addEmptyOption: true,
			emptyOptionValue: "",
			emptyOptionText: "--"
		};
		return H_date;
	}

	getReserveDateFormat(limit = 2) //指定後の日付取得
	{
		var A_limitdate = ManagementUtil.makeLimitLastDate(limit);
		var H_date = {
			minYear: date("Y"),
			maxYear: A_limitdate[0],
			addEmptyOption: true,
			format: "Y \u5E74 m \u6708 d \u65E5",
			language: "ja",
			addEmptyOption: true,
			emptyOptionValue: "",
			emptyOptionText: "--"
		};
		return H_date;
	}

	getReserveDateFormatEng(limit = 2) //指定後の日付取得
	{
		var A_limitdate = ManagementUtil.makeLimitLastDate(limit);
		var H_date = {
			minYear: date("Y"),
			maxYear: A_limitdate[0],
			addEmptyOption: true,
			format: "Y / m / d ",
			language: "ja",
			addEmptyOption: true,
			emptyOptionValue: "",
			emptyOptionText: "--"
		};
		return H_date;
	}

	makeLimitLastDate(limit_month) //○ヶ月後の日付
	{
		var last_date = date("Y/m/d", mktime("0", "0", "0", date("m") + limit_month, date("t"), date("Y")));
		var A_date = last_date.split("/");
		A_date[2] = date("t", mktime("0", "0", "0", A_date[1], 1, A_date[0]));
		A_date[3] = date("Y-m-d", mktime("0", "0", "0", A_date[1], A_date[2], A_date[0]));
		return A_date;
	}

	makeLimitFirstDate(limit_month) //○ヶ月前の日付
	{
		var first_date = date("Y/m/d", mktime("0", "0", "0", date("m") - limit_month, 1, date("Y")));
		var A_date = first_date.split("/");
		A_date[3] = date("Y-m-d", mktime("0", "0", "0", date("m") - limit_month, 1, date("Y")));
		return A_date;
	}

	makeTommorowDate() {
		var first_date = date("Y/m/d", mktime("0", "0", "0", date("m"), date("d") + 1, date("Y")));
		var A_date = first_date.split("/");
		A_date[3] = date("Y-m-d", mktime("0", "0", "0", date("m"), date("d") + 1, date("Y")));
		return A_date;
	}

	getKousiHash() {
		var H_res = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--",
			"2": "\u672A\u8A2D\u5B9A\uFF08\u4F1A\u793E\u306E\u57FA\u672C\u8A2D\u5B9A\u3092\u4F7F\u7528\uFF09",
			"1": "\u516C\u79C1\u5206\u8A08\u3057\u306A\u3044",
			"0": "\u516C\u79C1\u5206\u8A08\u3059\u308B"
		};
		return H_res;
	}

	getKousiHashEng() {
		var H_res = {
			"": "--Please select--",
			"2": "Not created (company's basic settings are applied)",
			"1": "Do not classify business and private uses",
			"0": "Classify business and private uses"
		};
		return H_res;
	}

	getKousiRadioHash() {
		var H_res = {
			"2": ["\u672A\u8A2D\u5B9A\uFF08\u4F1A\u793E\u306E\u57FA\u672C\u8A2D\u5B9A\u3092\u4F7F\u7528\uFF09", "onclick=\"disableKousiSel()\" id=\"kousiflg2\""],
			"1": ["\u516C\u79C1\u5206\u8A08\u3057\u306A\u3044", "onclick=\"disableKousiSel()\" id=\"kousiflg1\""],
			"0": ["\u516C\u79C1\u5206\u8A08\u3059\u308B", "onclick=\"disableKousiSel()\" id=\"kousiflg0\""]
		};
		return H_res;
	}

	getKousiRadioHashEng() {
		var H_res = {
			"2": ["Not created (company's basic settings are applied)", "onclick=\"disableKousiSel()\" id=\"kousiflg2\""],
			"1": ["Do not classify business and private uses", "onclick=\"disableKousiSel()\" id=\"kousiflg1\""],
			"0": ["Classify business and private uses", "onclick=\"disableKousiSel()\" id=\"kousiflg0\""]
		};
		return H_res;
	}

	getOneAssFormValue(H_post, formcnt) {
		var mark = "_" + formcnt;
		var H_res = Array();

		for (var key in H_post) {
			var val = H_post[key];

			if (preg_match("/" + mark + "$/", key) == true) {
				var res_key = preg_replace("/" + mark + "/", "", key);
				H_res[res_key] = val;
			}
		}

		return H_res;
	}

	convertCheckBoxStr(H_data) {
		var A_data = Array();
		var str = "";

		if (Array.isArray(H_data) == true) {
			for (var key in H_data) {
				var val = H_data[key];
				A_data.push(key);
			}

			str = "," + A_data.join(",");
		}

		return str;
	}

	getAssRelCheck() {
		var H_chk = {
			"1": "\u3053\u306E\u7AEF\u672B\u306E\u4F7F\u7528\u3092\u3084\u3081\u308B",
			"2": "\u3053\u306E\u7AEF\u672B\u3092\u524A\u9664\u3059\u308B"
		};
		return H_chk;
	}

	getAssRelCheckEng() {
		var H_chk = {
			"1": "Stop using this handset",
			"2": "Delete this handset"
		};
		return H_chk;
	}

	getAlertCondition() {
		var H_alert = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};
		H_alert[0] = "\u8B66\u544A\u3042\u308A";
		H_alert[1] = "\u8B66\u544A\uFF08\u5F37\uFF09";
		H_alert[2] = "\u8B66\u544A\uFF08\u5F31\uFF09";
		H_alert[3] = "\u8B66\u544A\u7121\u3057";
		return H_alert;
	}

	getAlertConditionEng() {
		var H_alert = {
			"": "--Please select--"
		};
		H_alert[0] = "Yellow or Blue";
		H_alert[1] = "Yellow";
		H_alert[2] = "Blue";
		H_alert[3] = "None";
		return H_alert;
	}

	__destruct() {}

};