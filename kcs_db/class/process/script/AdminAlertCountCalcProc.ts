//au・softbankの警告・電話カウント・計算バッチプロセス
//2009/10/27 宮澤龍彦 作成
import ProcessBaseBatch from "../ProcessBaseBatch"
import AdminAlertCountCalcModel from "../../model/script/AdminAlertCountCalcModel"
import AdminAlertCountCalcView from "../../view/script/AdminAlertCountCalcView"
import MtSetting from "../../MtSetting"
import MtMailUtil from "../../MtMailUtil"

const { execSync } = require('child_process')
const fs = require('fs');

export default class AdminAlertCountCalcProc extends ProcessBaseBatch {
	O_View: AdminAlertCountCalcView
	O_Model: AdminAlertCountCalcModel
	O_mail: MtMailUtil
	O_set: MtSetting
	H_mail: any[]
	carname: string | undefined

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.O_View = new AdminAlertCountCalcView();
		this.O_Model = new AdminAlertCountCalcModel(this.get_DB());
		this.O_mail = new MtMailUtil();
		this.O_set = MtSetting.singleton();
		this.H_mail = Array();
	}

	async doExecute(H_param: {} | any[] = Array()) //引数の値を配列に収めてモデルに渡す
	{
		var H_val : any[string] = Array();
		H_val.year = this.O_View.UpdYear;
		H_val.month = this.O_View.UpdMonth;
		H_val.carid = this.O_View.UpdCarid;
		H_val.env = this.O_View.UpdEnv;
		H_val.pacttype = this.O_View.UpdPactType;

		switch (H_val.carid) {
			case 1:
				this.carname = "NTTドコモ";
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
				kcsdir = "script";
				batdir = "script/script/batch";
				// kcsdir = "/kcs";
				// batdir = "/kcs/script/batch";
		}
		execSync("cd " + batdir);
		var A_exclude = Array();
		var H_exclude = fs.readFileSync(kcsdir + "/script/exclude_notsim.list");

		if (true == Array.isArray(H_exclude) && true == 0 < H_exclude.length) {
			for (var row of H_exclude) {
				var row = row.trim();

				if (true == !isNaN(Number(row))) {
					A_exclude.push(row);
				}
			}
		}

		var A_pact = await this.O_Model.getCalcList(H_val, true);
		if (true == Array.isArray(A_pact)) { 
			A_pact = Array(A_pact);
			if (true == Array.isArray(A_pact) && true == 0 < Object.values(A_pact).length) {
				for (var pactid of Object.values(A_pact)) //除外pactに入っていれば実行しない
				{
					if (false == (-1 !== A_exclude.indexOf(pactid))) //複数のキャリアの請求があるとキャリア指定できないとのこと 20091104miya
						//alertの成功失敗を判断
						{
							var output_alert = undefined;
							var output_cnt = undefined;
							var output_calc = undefined;
							// output_alert = execSync("/usr/local/bin/php alert.php -c=" + H_val.carid + " -p=" + pactid + " -m=0");
							// output_cnt = execSync("/usr/local/bin/php recent_telcnt.php -c=" + H_val.carid + " -p=" + pactid + " -m=0");
							// output_calc = execSync("/usr/local/bin/php calc.php -p=" + pactid + " -m=0");
							output_alert = execSync("./node_modules/.bin/ts-node script/script/batch/alert.ts -c=" + H_val.carid + " -p=" + pactid + " -m=0");
							output_cnt = execSync("./node_modules/.bin/ts-node script/script/batch/recent_telcnt.ts -c=" + H_val.carid + " -p=" + pactid + " -m=0");
							output_calc = execSync("./node_modules/.bin/ts-node script/script/batch/calc.ts -p=" + pactid + " -m=0");
	
							if ("" != output_alert) {
								H_error.push("alert.tsの実行に失敗しました pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
								H_error.push(output_alert);
							}
							if ("" != output_cnt) {
								H_error.push("recent_telcnt.tsの実行に失敗しました pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
								H_error.push(output_cnt);
							}
	
							if ("" != output_calc) {
								var calc_result = "false";
								H_error.push("calc.tsの実行に失敗しました pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
								H_error.push(output_calc);
							} else {
								calc_result = "true";
							}
	
							execSync("./node_modules/.bin/ts-node script/script/batch/update_clamp_index.ts -y=" + H_val.year + H_val.month + " -p=" + pactid + " -c=" + H_val.carid + " -u=is_calc -r=" + calc_result);
						}
				}
			}
		}

		if (true == 0 < H_error.length) //メールファイルをKCS_DIR . web_script/SendList/以下に作成
			{
				var to_mail = this.O_set.get("mail_def_errorto");
				var to_name = this.O_set.get("mail_error_to_name");
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
					this.getOut().infoOut("メール送信対象ユーザがいません。");
				}
			}
	}

	errorMailSend() {
		this.getOut().infoOut("エラーメール送信");
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
				var subject = this.carname + " 請求計算エラー";
				var from = this.O_set.get("mail_error_from");
				var from_name = this.O_set.get("mail_error_from_name");
				this.O_mail.multiSend(H_to, message, from, subject, from_name);
			}
		}
	}

};
