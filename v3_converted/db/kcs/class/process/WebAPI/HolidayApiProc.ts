//error_reporting(E_ALL|E_STRICT);
//
//HolidayProc
//
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2018/06/20
//
header("Contet-Type: application/json; charset=UTF-8");

require("process/ProcessBaseHtml.php");

require("model/WebAPI/HolidayApiModel.php");

require("view/WebAPI/HolidayApiView.php");

require("model/HolidayModel.php");

//
//doExecute
//
//@author web
//@since 2018/06/20
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class HolidayApiProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_view = undefined;
		this.O_model = undefined;
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//modelオブジェクトの生成
	//
	{
		this.O_view = new HolidayApiView();
		this.O_model = new HolidayApiModel(this.get_DB());
		var res = this.getRes();

		if (res.error) {
			header("HTTP", true, 400);
		}

		echo(JSON.stringify(res));
	}

	getRes() //ログインチェック
	//タイプ指定確認
	{
		var res = Array();
		res.error = true;
		res.message = "";

		if (!this.O_view.checkLogin()) {
			res.message = "\u672A\u30ED\u30B0\u30A4\u30F3";
			return res;
		}

		var req = _GET.req;

		if (!req) {
			res.message = "type\u672A\u6307\u5B9A";
			return res;
		}

		var O_holiday = new HolidayModel(_SESSION.groupid);

		switch (req) {
			case "get":
				//to指定
				//keyを列挙の値にするよ・・
				{
					var from = undefined;
					var to = undefined;

					if (undefined !== _GET.from) {
						var date = _GET.from.split("-");

						if (!checkdate(date[1], date[2], date[0])) {
							res.message = "from\u306E\u5024\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059";
							return res;
						}

						from = _GET.from;
					}

					if (undefined !== _GET.to) {
						date = _GET.to.split("-");

						if (!checkdate(date[1], date[2], date[0])) {
							res.message = "to\u306E\u5024\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059";
							return res;
						}

						to = _GET.to;
					}

					var h = O_holiday.getHoliday(from, to);
					res.data = Array();

					for (var v of Object.values(h)) {
						res.data.push(v);
					}
				}
				break;
		}

		res.error = false;
		return res;
	}

	__destruct() {
		super.__destruct();
	}

};