//ClampTaskの監視
//error_reporting(E_ALL|E_STRICT);
//
//clampTaskの監視
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2017/01/26
//

require("process/ProcessBaseBatch.php");

require("view/script/CheckClampTaskView.php");

require("model/script/CheckClampTaskModel.php");

//
//__construct
//コンストラクタ
//@author web
//@since 2017/02/22
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//実行
//@author web
//@since 2017/01/26
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author date
//@since 2015/07/10
//
//@access public
//@return void
//
class CheckClampTaskProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //viewの作成
	//固有ログディレクトリの作成取得(これは必要なさそうな気もする)
	//iniの読込
	//メール送信
	//returnpathつけない
	//送信先の設定
	//送信先が存在するかチェックする
	//基本死時間
	//特になければメールしない
	//メール送信するぽよ
	{
		var O_view = new CheckClampTaskView();
		var O_model = new CheckClampTaskModel();
		this.set_Dirs(O_view.get_ScriptName());
		var filename = KCS_DIR + "/conf_sync/check_clamptask.ini";
		var ini = file_exists(filename) ? parse_ini_file(filename, true) : Array();
		var O_mail = new MtMailUtil();
		O_mail.setUseReturnPathFlag(false);
		var A_to = this.createTo(ini.default.to);

		if (!A_to) {
			throw die();
		}

		var H_clamp = O_model.getClampTask();
		var comment = "";
		var def_time = this.getDeadTime(ini.default);

		for (var key in H_clamp) //このバッチが起動してからかかっている時間について
		//判定時間を決める
		//判定する
		//分
		//時
		//日
		//メール内容
		{
			var value = H_clamp[key];
			var dis = Date.now() / 1000 - strtotime(value.recdate);

			if (undefined !== ini[value.command]) {
				var t = this.getDeadTime(ini[value.command]);
			} else {
				t = def_time;
			}

			if (t > dis) //せふせふ
				{
					continue;
				}

			var second = dis % 60;
			dis /= 60;
			var minute = dis % 60;
			dis /= 60;
			var hour = dis % 24;
			dis /= 24;
			var day = +dis;
			comment += sprintf("%s\u306F\u8D77\u52D5\u3057\u3066\u304B\u3089%3s\u65E5 %2s\u6642\u9593 %2s\u5206 %2s\u79D2\u7D4C\u904E\u3057\u3066\u3044\u307E\u3059(%s)\n", value.command, day, hour, minute, second, value.recdate);
		}

		if (comment == "") {
			throw die(0);
		}

		comment = "\u4EE5\u4E0B\u306E\u30D0\u30C3\u30C1\u306F\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\n\n" + comment;
		O_mail.multiSend2(A_to, comment, ini.default.from_mail, "clamptask_tb\u306E\u72B6\u6CC1(" + O_view.get_HArgv("-e") + ")", ini.default.from_user);
		throw die(0);
	}

	createTo(to) //送信先の設定
	{
		var temp = to.split(",");
		var A_to = Array();

		for (var key in temp) //送信先の設定(To)
		{
			var value = temp[key];
			A_to.push({
				type: key == 0 ? "To" : "Cc",
				mail: value,
				name: ""
			});
		}

		return A_to;
	}

	getDeadTime(ini) {
		var t = 0;

		if (undefined !== ini.day) {
			t += +(ini.day * 60 * 60 * 24);
		}

		if (undefined !== ini.hour) {
			t += +(ini.hour * 60 * 60);
		}

		if (undefined !== ini.minute) {
			t += +(ini.minute * 60);
		}

		if (undefined !== ini.second) {
			t += +ini.second;
		}

		return t;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};