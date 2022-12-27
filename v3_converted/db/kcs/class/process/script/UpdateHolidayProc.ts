//ClampTaskの監視
//error_reporting(E_ALL|E_STRICT);
//
//UpdateHolidayProc
//祝日の更新
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2017/12/14
//

require("process/ProcessBaseBatch.php");

require("view/script/UpdateHolidayView.php");

require("model/script/UpdateHolidayModel.php");

//
//__construct
//
//@author web
//@since 2017/12/14
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author web
//@since 2017/12/14
//
//@param array $H_param
//@access protected
//@return void
//
//
//getHoliday
//祝日の取得ぽよ
//@author web
//@since 2017/12/14
//
//@access private
//@return void
//
//
//__destruct
//デストラクタ
//@author web
//@since 2017/12/14
//
//@access public
//@return void
//
class UpdateHolidayProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.bUpdateFile = false;
	}

	doExecute(H_param: {} | any[] = Array()) //viewの作成
	//スクリプトの二重起動防止ロック
	//固有ログディレクトリの作成取得(これは必要なさそうな気もする)
	//グーグルからカレンダーを取得しなおすかどうか
	//ダウンロードは時間がかかるよ・・・
	//グーグル先生から祝日を取得
	//現状DBに登録されている祝日を取得
	//グーグル大先生から取得した祝日から、既に登録されているものを消す
	//未登録のものを登録
	{
		var O_view = new UpdateHolidayView();
		var O_model = new UpdateHolidayModel();
		this.lockProcess(O_view.get_ScriptName());
		this.set_Dirs(O_view.get_ScriptName());
		this.bUpdateFile = O_view.get_HArgv("-u") == "y" ? true : false;
		var holiday_file = this.getHolidayList(this.bUpdateFile);
		var holiday_db = O_model.getHolidayList();

		for (var key in holiday_db) {
			var value = holiday_db[key];

			if (undefined !== holiday_file[key]) {
				delete holiday_file[key];
			}
		}

		var bSuccess = true;

		if (!!holiday_file) {
			if (!O_model.updateHoliday(holiday_file)) {
				this.infoOut("\u66F4\u65B0\u30A8\u30E9\u30FC\u3067\u3059\n", 1);
			}
		}

		this.unLockProcess(O_view.get_ScriptName());
		this.infoOut("\u795D\u65E5\u767B\u9332\u7D42\u308F\u308A\n", 1);
		throw die(0);
	}

	getHolidayList(bDownload) //カレンダーの取得先
	//出力先
	//カレンダーのファイル名
	//カレンダーのダウンロード
	//祝日格納バッファ
	//1行ずつみていこう
	{
		var url = "https://calendar.google.com/calendar/ical/ja.japanese%23holiday%40group.v.calendar.google.com/public/basic.ics";
		var outdir = KCS_DIR + "/data/calnder";
		var filename = "basic.ics";

		if (bDownload) {
			var sh = sprintf("wget -N %s -P %s --no-check-certificate ", url, outdir);
			var res = shell_exec(sh);
		}

		res = file(outdir + "/" + filename);
		var summary = "";
		var date = "";
		var holiday_list = Array();

		for (var key in res) //開始
		{
			var value = res[key];
			var value = str_replace(["\r\n", "\r", "\n"], "", value);
			var temp = value.split(":");

			switch (temp[0]) {
				case "BEGIN":
					if (temp[1] == "VEVENT") {
						summary = "";
						date = "";
					}

					break;

				case "END":
					if (temp[1] == "VEVENT") //イベントの登録
						{
							var year = date.substr(0, 4);
							var month = date.substr(4, 2);
							var day = date.substr(6, 2);
							date = year + "-" + month + "-" + day;
							var data = {
								date: date,
								summary: summary
							};
							holiday_list[strtotime(date)] = data;
						}

					break;

				case "SUMMARY":
					summary = mb_convert_encoding(temp[1], "UTF-8");
					break;

				case "DTSTART;VALUE=DATE":
					date = temp[1];
					break;

				default:
					break;
			}
		}

		return holiday_list;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};