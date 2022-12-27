//
//au・softbankの警告・電話カウント・計算バッチプロセス
//
//更新履歴：<br>
//2009/10/27 宮澤龍彦 作成
//
//@uses ProcessBaseBatch
//@package AdminAlertCountCalc
//@filesource
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/10/27
//
//
//error_reporting(E_ALL|E_STRICT);
//
//au・softbankの警告・電話カウント・計算バッチプロセス
//
//@uses ProcessBaseBatch
//@package SBDownload
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/10/27
//

require("process/ProcessBaseBatch.php");

require("model/script/AdminAlertCountCalcModel.php");

require("view/script/AdminAlertCountCalcView.php");

require("MtSetting.php");

require("MtMailUtil.php");

//
//メール
//
//@var mixed
//@access protected
//
//
//O_Set
//
//@var mixed
//@access protected
//
//
//キャリア名
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author miyazawa
//@since 2009/10/27
//
//@param array $H_param
//@param array $H_argv
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author miyazawa
//@since 2009/10/27
//
//@param array $H_param
//@access protected
//@return void
//
//
//エラーメールを送信する
//
//@author miyazawa
//@since 2009/07/03
//
//@access private
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2009/10/27
//
//@access public
//@return void
//
class AdminAlertCountCalcProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	//メールオブジェクト
	//セッティング
	//送信するメール情報
	{
		super(H_param);
		this.O_View = new AdminAlertCountCalcView();
		this.O_Model = new AdminAlertCountCalcModel(this.get_DB());
		this.O_mail = new MtMailUtil();
		this.O_set = MtSetting.singleton();
		this.H_mail = Array();
	}

	doExecute(H_param: {} | any[] = Array()) //引数の値を配列に収めてモデルに渡す
	//キャリア名
	//実行環境でバッチ実行ディレクトリを振り分け
	//exclude_notsim.listの除外pactを取得
	//20140530森原修正
	//リストに警告・電話カウント・計算バッチを実行
	{
		var H_val = Array();
		H_val.year = this.O_View.UpdYear;
		H_val.month = this.O_View.UpdMonth;
		H_val.carid = this.O_View.UpdCarid;
		H_val.env = this.O_View.UpdEnv;
		H_val.pacttype = this.O_View.UpdPactType;

		switch (H_val.carid) {
			case 1:
				this.carname = "NTT\u30C9\u30B3\u30E2";
				break;

			case 3:
				this.carname = "au";
				break;

			case 4:
				this.carname = "Softbank";
				break;

			default:
				this.carname = "carid=" + H_val.carid;
		}

		var H_error = Array();

		switch (H_val.env) {
			case "dev":
				var kcsdir = "/kcs_db";
				var batdir = "/kcs/script/batch";
				break;

			case "try":
				kcsdir = "/try_kcs";
				batdir = "/try_kcs/script/batch";
				break;

			case "check":
				kcsdir = "/kcs_db";
				batdir = "/kcs_db/script/batch";
				break;

			default:
				kcsdir = "/kcs";
				batdir = "/kcs/script/batch";
		}

		exec("cd " + batdir);
		var A_exclude = Array();
		var H_exclude = file(kcsdir + "/script/exclude_notsim.list");

		if (true == Array.isArray(H_exclude) && true == 0 < H_exclude.length) {
			for (var row of Object.values(H_exclude)) {
				var row = row.trim();

				if (true == is_numeric(row)) {
					A_exclude.push(row);
				}
			}
		}

		var A_pact = this.O_Model.getCalcList(H_val, true);

		if (true == Array.isArray(A_pact) && true == 0 < A_pact.length) {
			for (var pactid of Object.values(A_pact)) //除外pactに入っていれば実行しない
			{
				if (false == (-1 !== A_exclude.indexOf(pactid))) //複数のキャリアの請求があるとキャリア指定できないとのこと 20091104miya
					//alertの成功失敗を判断
					{
						var output_alert = undefined;
						var output_cnt = undefined;
						var output_calc = undefined;
						output_alert = shell_exec("/usr/local/bin/php alert.php -c=" + H_val.carid + " -p=" + pactid + " -m=0");
						output_cnt = shell_exec("/usr/local/bin/php recent_telcnt.php -c=" + H_val.carid + " -p=" + pactid + " -m=0");
						output_calc = shell_exec("/usr/local/bin/php calc.php -p=" + pactid + " -m=0");

						if ("" != output_alert) {
							H_error.push("alert.php\u306E\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
							H_error.push(output_alert);
						}

						if ("" != output_cnt) {
							H_error.push("recent_telcnt.php\u306E\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
							H_error.push(output_cnt);
						}

						if ("" != output_calc) {
							var calc_result = "false";
							H_error.push("calc.php\u306E\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
							H_error.push(output_calc);
						} else {
							calc_result = "true";
						}

						exec("/usr/local/bin/php update_clamp_index.php -y=" + H_val.year + H_val.month + " -p=" + pactid + " -c=" + H_val.carid + " -u=is_calc -r=" + calc_result);
					}
			}
		}

		if (true == 0 < H_error.length) //メールファイルをKCS_DIR . web_script/SendList/以下に作成
			{
				var to_mail = this.O_set.mail_def_errorto;
				var to_name = this.O_set.mail_error_to_name;
				var mess_str = "";

				for (var error of Object.values(H_error)) //宛先は一つなのでメッセージをまとめる
				{
					mess_str += error + "\n";
					this.H_mail[to_mail] = {
						to_name: to_name,
						message: mess_str
					};
				}

				if (0 < this.H_mail.length) {
					this.errorMailSend();
				} else {
					this.getOut().infoOut("\u30E1\u30FC\u30EB\u9001\u4FE1\u5BFE\u8C61\u30E6\u30FC\u30B6\u304C\u3044\u307E\u305B\u3093\u3002", false);
				}
			}
	}

	errorMailSend() {
		this.getOut().infoOut("\u30A8\u30E9\u30FC\u30E1\u30FC\u30EB\u9001\u4FE1", false);
		{
			let _tmp_0 = this.H_mail;

			for (var mail in _tmp_0) //メール送信
			{
				var H_value = _tmp_0[mail];
				var H_to = Array();
				H_to.push({
					to: mail,
					to_name: H_value.to_name
				});
				var message = H_value.message;
				var subject = this.carname + " \u8ACB\u6C42\u8A08\u7B97\u30A8\u30E9\u30FC";
				var from = this.O_set.mail_error_from;
				var from_name = this.O_set.mail_error_from_name;
				this.O_mail.multiSend(H_to, message, from, subject, from_name);
			}
		}
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};