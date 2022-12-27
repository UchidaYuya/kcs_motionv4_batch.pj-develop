
import ProcessBaseBatch from '../ProcessBaseBatch';
import { AdminSimModel } from '../../model/script/AdminSimModel';
import {AdminSimView} from '../../view/script/AdminSimView';
import MtSetting from '../../MtSetting';
import MtMailUtil from '../../MtMailUtil';
import { execSync } from 'child_process';
import * as fs from 'fs';

export class AdminSimProc extends ProcessBaseBatch {

	O_View: AdminSimView;
	O_Model: AdminSimModel;
	O_mail:  MtMailUtil;
	O_set: any;
	H_mail: any;

	carname: any;

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	//メールオブジェクト
	//セッティング
	//送信するメール情報
	{
		super(H_param);
		this.O_View = new AdminSimView();
		this.O_Model = new AdminSimModel(this.get_DB());
		this.O_mail = new MtMailUtil();
		this.O_set = MtSetting.singleton();
		this.H_mail = Array();
	}

	async doExecute(H_param: {} | any[] = Array()) //引数の値を配列に収めてモデルに渡す
	//キャリア名
	//実行環境でバッチ実行ディレクトリを振り分け
	//exclude_dosim.listの除外pactを取得
	//注文権限のV2V3を見てリストを作る
	//recom3用logディレクトリの確認＆作成
	{
		var H_val: { [key: string]: any } = {};
		H_val.year = this.O_View.UpdYear;
		H_val.month = this.O_View.UpdMonth;
		H_val.carid = this.O_View.UpdCarid;
		H_val.env = this.O_View.UpdEnv;
		H_val.pacttype = this.O_View.UpdPactType;

		switch (H_val.carid) {
			case 1:
				// this.carname = "NTT\u30C9\u30B3\u30E2";
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
				kcsdir = "/kcs";
				batdir = "/kcs/script/batch";
		}

		// exec("cd " + batdir);
		execSync("cd " + batdir);
		var A_exclude = Array();
		// var H_exclude = file(kcsdir + "/script/exclude_dosim.list");
		var H_exclude = fs.readFileSync(kcsdir).toString().split('\r\n');;

		if (true == Array.isArray(H_exclude) && true == 0 < H_exclude.length) {
			// for (var row of Object.values(H_exclude)) {
			for (var row of H_exclude) {
				var row = row.trim();

				// if (true == is_numeric(row)) {
				if (true == !isNaN(Number(row))) {
					A_exclude.push(row);
				}
			}
		}

		var A_pact = await this.O_Model.getTrendList(H_val);
		var H_ordfnc: false | any[] = await this.O_Model.getOrdFnc(A_pact);
		// var logDir = kcsdir + "/log/batch/recom3_" + date("Ymd") + "/";
		var logDir = kcsdir + "/log/batch/recom3_" + new Date().toJSON().slice(0,10).replace(/-/g,'-') + "/";

		if (fs.existsSync(logDir) == false) //ディレクトリの作成// 2022cvt_003
		{
			try {
				fs.mkdirSync(logDir, 700)
			} catch (error) {
				H_error.push("recom3用ログディレクトリの作成に失敗しました " + logDir);
			}
			// if (mkdir(logDir, 700) == false) {
				// H_error.push("recom3\u7528\u30ED\u30B0\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + logDir);
			// }
		}

		if (true == Array.isArray(A_pact) && true == 0 < A_pact.length) {
			// for (var pactid of Object.values(A_pact)) //除外pactに入っていれば実行しない
			for (var pactid of A_pact) //除外pactに入っていれば実行しない
			{
				if (false == (-1 !== A_exclude.indexOf(pactid))) //20110725morihara trend_main以外が失敗した時も不正終了扱いとする
					//predataの成功失敗を判断
					//統計バッチが成功してたらシミュレーション実行
				{
					var output_predata;
					var output_trend_main;
					var output_trend_graph;
					var output_recom;
					// output_predata = shell_exec("/usr/local/bin/php predata.php -k=0 -c=" + H_val.carid + " -p=" + pactid + " -m=0");
					// output_trend_main = shell_exec("/usr/local/bin/php trend_main.php -y=" + H_val.year + H_val.month + " -c=" + H_val.carid + " -p=" + pactid + " -m=0");
					// output_trend_graph = shell_exec("/usr/local/bin/php trend_graph.php -y=" + H_val.year + H_val.month + " -c=" + H_val.carid + " -p=" + pactid + " -m=0");
					try {
						output_predata = execSync("/usr/local/bin/php predata.php -k=0 -c=" + H_val.carid + " -p=" + pactid + " -m=0");
					} catch (error) {
						trend_result = "false";
						H_error.push("predata.phpの実行に失敗しました pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
						H_error.push(output_predata);
					}
						
					try {
						output_trend_main = execSync("/usr/local/bin/php trend_main.php -y=" + H_val.year + H_val.month + " -c=" + H_val.carid + " -p=" + pactid + " -m=0");
					} catch (error) {
						trend_result = "false";
						H_error.push("trend_graph.phpの実行に失敗しました pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
						H_error.push(output_trend_graph);
					}

					try {
						output_trend_graph = execSync("/usr/local/bin/php trend_graph.php -y=" + H_val.year + H_val.month + " -c=" + H_val.carid + " -p=" + pactid + " -m=0");
					} catch (error) {
						trend_result = "false";
						H_error.push("trend_main.phpの実行に失敗しました pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
						H_error.push(output_trend_main);
					}
					
					var trend_result = "true";
					// if ("" != output_predata) //20110725morihara trend_main以外が失敗した時も不正終了扱いとする
					// 	{
					// 		trend_result = "false";
					// 		// H_error.push("predata.php\u306E\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
					// 		H_error.push("predata.phpの実行に失敗しました pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
					// 		H_error.push(output_predata);
					// 	}

					// if ("" != output_trend_graph) //20110725morihara trend_main以外が失敗した時も不正終了扱いとする
					// 	{
					// 		trend_result = "false";
					// 		// H_error.push("trend_graph.php\u306E\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
					// 		H_error.push("trend_graph.phpの実行に失敗しました pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
					// 		H_error.push(output_trend_graph);
					// 	}

					// if ("" != output_trend_main) {
					// 	trend_result = "false";
					// 	// H_error.push("trend_main.php\u306E\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
					// 	H_error.push("trend_main.phpの実行に失敗しました pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
					// 	H_error.push(output_trend_main);
					// }

					// exec("/usr/local/bin/php update_clamp_index.php -y=" + H_val.year + H_val.month + " -p=" + pactid + " -c=" + H_val.carid + " -u=is_trend -r=" + trend_result);
					execSync("/usr/local/bin/php update_clamp_index.php -y=" + H_val.year + H_val.month + " -p=" + pactid + " -c=" + H_val.carid + " -u=is_trend -r=" + trend_result);

					if ("true" === trend_result) //20110725morihara trend_main以外が失敗した時も不正終了扱いとする
					//成功したらシミュレーション実行、注文権限によってV2V3が分かれる
					//シミュレーション状況フラグを立てる
					//20110725morihara シミュレーション失敗時は統計情報抽出も失敗扱いとする
					{
						if ("V3" == H_ordfnc[pactid]) {
							var recomname = "recom3.php";
							// output_recom = shell_exec("/usr/local/bin/php recom3.php -k=0 -c=" + H_val.carid + " -p=" + pactid + " -m=0 -x=1 -l=" + logDir);
							output_recom = execSync("/usr/local/bin/php recom3.php -k=0 -c=" + H_val.carid + " -p=" + pactid + " -m=0 -x=1 -l=" + logDir);
						} else //V2シミュレーションはドコモ、AUにしか対応してないのでそれ以外は流す 20091125miya
						{
							if (false == (-1 !== [1, 3].indexOf(H_val.carid))) {
								continue;
							}

							recomname = "recom.php";
							// output_recom = shell_exec("/usr/local/bin/php recom.php -k=0 -c=" + H_val.carid + " -p=" + pactid + " -m=0");
							output_recom = execSync("/usr/local/bin/php recom.php -k=0 -c=" + H_val.carid + " -p=" + pactid + " -m=0");
						}

						if ("" != output_recom) {
							var recom_result = "false";
							// H_error.push(recomname + "\u306E\u5B9F\u884C\u306B\u5931\u6557\u3057\u307E\u3057\u305F pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
							H_error.push(recomname + "の実行に失敗しました pactid=" + pactid + " carid=" + H_val.carid + " -y=" + H_val.year + H_val.month);
							H_error.push(output_recom);
						} else {
							recom_result = "true";
						}

						// exec("/usr/local/bin/php update_clamp_index.php -y=" + H_val.year + H_val.month + " -p=" + pactid + " -c=" + H_val.carid + " -u=is_recom -r=" + recom_result);
						execSync("/usr/local/bin/php update_clamp_index.php -y=" + H_val.year + H_val.month + " -p=" + pactid + " -c=" + H_val.carid + " -u=is_recom -r=" + recom_result);

						if ("false" === recom_result) {
							// exec("/usr/local/bin/php update_clamp_index.php -y=" + H_val.year + H_val.month + " -p=" + pactid + " -c=" + H_val.carid + " -u=is_trend -r=" + recom_result);
							execSync("/usr/local/bin/php update_clamp_index.php -y=" + H_val.year + H_val.month + " -p=" + pactid + " -c=" + H_val.carid + " -u=is_trend -r=" + recom_result);
						}
					}
				}
			}
		}

		if (true == 0 < H_error.length) //メールファイルをKCS_DIR . web_script/SendList/以下に作成
			{
				var to_mail = this.O_set.mail_def_errorto;
				var to_name = this.O_set.mail_error_to_name;
				var mess_str = "";

				// for (var error of Object.values(H_error)) //宛先は一つなのでメッセージをまとめる
				for (var error of H_error) //宛先は一つなのでメッセージをまとめる
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
					// this.getOut().infoOut("\u30E1\u30FC\u30EB\u9001\u4FE1\u5BFE\u8C61\u30E6\u30FC\u30B6\u304C\u3044\u307E\u305B\u3093\u3002", false);
					this.getOut().infoOut("メール送信対象ユーザがいません。", 0);
				}
			}
	}

	errorMailSend() {
		// this.getOut().infoOut("\u30A8\u30E9\u30FC\u30E1\u30FC\u30EB\u9001\u4FE1", false);
		this.getOut().infoOut("エラーメール送信", 0);
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
				// var subject = this.carname + " \u8ACB\u6C42\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u30A8\u30E9\u30FC";
				var subject = this.carname + " 請求シミュレーションエラー";
				var from = this.O_set.mail_error_from;
				var from_name = this.O_set.mail_error_from_name;
				this.O_mail.multiSend(H_to, message, from, subject, from_name);
			}
		}
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
