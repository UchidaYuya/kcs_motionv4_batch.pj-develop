//WILLCOMダウンロードビュー
//2009/05/28 宮澤龍彦 作成

import ViewBaseScript from "./ViewBaseScript";
import MtSetting from "../../MtSetting";
import MtOutput from "../../MtOutput";
import MtScriptArgs from "../../MtScriptArgs";
import { dirname, join } from "path";
import { exec } from "child_process";
import { writeSync } from "node:fs";
import HTTP_Client from "../../HttpClient2";
import { sprintf } from "../../../db_define/define";

const fs = require("fs");
var path = require('path');
path.dirname('/Users/Refsnes/demo_path.js');

export default class WillcomDownloadView extends ViewBaseScript {
	static DownloadURL = "https://obms1.business.ymobile.jp";
	O_client!: HTTP_Client;
	O_ini: MtSetting;
	O_MtScriptArgs: MtScriptArgs;
	referer: string | undefined;
	H_history: any[];
	H_client_option: any;
	login_status: boolean;
	logflg: boolean;
	start_time: any;
	H_values: any;
	value_save: boolean;
	loginid: string | undefined;
	password: string | undefined;
	pactid: number | undefined;
	detailno: any;
	extract_path: string | undefined;
	download_dir: any;
	date_y!: number;
	date_m!: number;
	H_error: any[];
	H_result_py: any;
	H_request: any;
	date_y_dl: number | undefined;
	date_m_dl!: number;

	constructor(O_Set0: MtSetting, O_Out0: MtOutput) //初期化
	//定義された引数と渡された引数の整合性を確認
	{
		// super(O_Set0, O_Out0);
		super();
		var A_arg_help = [["-y", "YYYYMMnone", "請求年月\t\tYYYY:年,MM:月,none:指定しない（当月で実行）"], ["-p", "pactid", "契約ＩＤ\t\tall:全顧客分を実行,PACTID:指定した契約ＩＤのみ実行"], ["-s", "CharSwitch", "実行時間制限\tY:有り,N:無し", "Y,N"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("パラメータが不正です\n");
		}

		this.O_ini = O_Set0;
		this.H_history = Array();
		this.login_status = false;
		this.logflg = false;
		this.H_request = Array();
		this.value_save = false;
		this.H_error = Array();
		this.H_result_py = undefined;
		this.download_dir = ".";
		this.checkArg(this.O_MtScriptArgs);
	}

	setClientOption(H_client_option: {} | any[] | any) {
		if (this.getSetting().existsKey("PROXY") && this.getSetting().get("PROXY")) {
			H_client_option.proxy_host = this.getSetting().get("PROXY");

			if (this.getSetting().existsKey("PROXY_PORT") && this.getSetting().get("PROXY_PORT")) {
				H_client_option.proxy_port = this.getSetting().get("PROXY_PORT");
			}

			if (this.getSetting().existsKey("PROXY_USER") && this.getSetting().get("PROXY_USER")) {
				H_client_option.proxy_user = this.getSetting().get("PROXY_USER");
			}

			if (this.getSetting().existsKey("PROXY_PASSWORD") && this.getSetting().get("PROXY_PASSWORD")) {
				H_client_option.proxy_password = this.getSetting().get("PROXY_PASSWORD");
			}
		}

		H_client_option.ssl_verify_peer = false;
		H_client_option.ssl_verify_host = false;
		this.H_client_option = H_client_option;
	}

	setLoginPattern() {
		this.H_request = this.loginPattern();
	}

	setDLPattern() {
		this.H_request = this.dlPattern();
	}

	loginPattern() {
		this.saveData();
		return [{
			title: "ログイン",
			url: WillcomDownloadView.DownloadURL + "/billing/auth/login",
			LOGIN: true,
			POST: {
				userId: this.loginid,
				password: this.password
			}
		}];
	}

	dlPattern() {
		this.saveData();
		return [{
			title: "ログイン",
			url: WillcomDownloadView.DownloadURL + "/billing/auth/login",
			LOGIN: true,
			POST: {
				userId: this.loginid,
				password: this.password
			}
		}, {
			title: "TOKEN取得",
			url: WillcomDownloadView.DownloadURL + "/billing/download/",
			SEARCH: [{
				name: "token",
				match: "\"org\\.apache\\.struts\\.taglib\\.html\\.TOKEN\" value=\"(.+?)\"",
				num: 1
			}, {
				name: "hiddenMessage",
				match: "\"downloadReadyMessage\" value=\"(.+?)\"",
				num: 1
			}]
		}, {
			title: "データダウンロードtuwa",
			url: WillcomDownloadView.DownloadURL + "/billing/download/",
			DL: true,
			POST: {
				"org.apache.struts.taglib.html.TOKEN": "{{token}}",
				downloadReadyMessage: "{{hiddenMessage}}",
// 2022cvt_021
				billYmPuldownSelected: +(this.date_y_dl + sprintf("%02d", String(this.date_m_dl))),
				billDecideDownload: "送信"
			}
		}, {
			title: "TOKEN取得",
			url: WillcomDownloadView.DownloadURL + "/billing/priceitem/",
			SEARCH: [{
				name: "token2",
				match: "\"org\\.apache\\.struts\\.taglib\\.html\\.TOKEN\" value=\"(.+?)\"",
				num: 1
			}, {
				name: "hiddenMessage2",
				match: "\"downloadMessage\" value=\"(.+?)\"",
				num: 1
			}]
		}, {
			title: "データダウンロードbill",
			url: WillcomDownloadView.DownloadURL + "/billing/priceitem/",
			DL: true,
			POST: {
				"org.apache.struts.taglib.html.TOKEN": "{{token2}}",
				downloadMessage: "{{hiddenMessage2}}",
				billYmStts: "0",
				searchType: "all",
				itemSearchType: "all",
				dispItemAll: "1",
				dispItemArr: ["groupCd", "prcPlanName", "prcItemId", "taxType", "subTotal"],
				divItemAll: "1",
				divItemArr: ["02", "07", "08", "09", "01", "06"],
				downloadSelect: "送信"
			}
		}];
	}

	doExecute(exetype: string) //doExecuteでしか使用していない変数の為、ここで初期化
	//接続オプション設定
	//オブジェクト生成
	//DLパターンをループして全て実行
	{
		this.H_result_py = Array();
		this.setClientOption({
			timeout: 60
		});
		// this.O_client = new HTTP_Client(this.H_client_option); //一旦コメンアウト

		if (this.getSetting().existsKey("WILLCOM_HTTP_USER") && this.getSetting().existsKey("WILLCOM_HTTP_PASSWD")) //認証の設定
			{
				var user = this.getSetting().get("WILLCOM_HTTP_USER");
				var pass = this.getSetting().get("WILLCOM_HTTP_PASSWD");
				this.O_client.setAuth(user, pass);
			}

		if ("login" == exetype) {
			this.setLoginPattern();
		} else {
			this.setDLPattern();
		}

		for (var i = 0; i < this.H_request.length; i++) //POSTの処理
		//タイトルが指定されていなかったらURLを使用する
		//検索
		//ログイン失敗してたらここで中断
		{
			if (undefined !== this.H_request[i].POST == true && Array.isArray(this.H_request[i].POST) == true && this.H_request[i].POST.length > 0) //POSTとGET混在の場合はGET配列をURLパラメータに変換する
				{
					var method = "POST";
					var H_data = this.H_request[i].POST;
					var url = this.H_request[i].url;

					if (undefined !== this.H_request[i].GET == true && Array.isArray(this.H_request[i].GET) == true) {
						if (url.indexOf("?") !== false) {
							url += "?";
						} else {
							url += "&";
						}

						var A_param = Array();
						{
							let _tmp_0 = this.H_request[i].GET;

							for (var key in _tmp_0) {
								var val = _tmp_0[key];
								A_param.push(key + "=" + val);
							}
						}
						// url += join("&", A_param);
					}

					if (undefined !== this.H_request[i].FILES == true && Array.isArray(this.H_request[i].FILES) == true) {
						{
							let _tmp_1 = this.H_request[i].FILES;

							for (var param in _tmp_1) {
								var file = _tmp_1[param];
								var A_file_param = this.fileExists(file);

								if (A_file_param !== undefined) {
									// A_file_param.unshift(param);
									H_data._FILES[param] = A_file_param;
								}
							}
						}
					}
				} else //GETの処理
				{
					method = "GET";

					if (undefined !== this.H_request[i].GET == true && Array.isArray(this.H_request[i].GET) == true) {
						H_data = this.H_request[i].GET;
					} else {
						H_data = Array();
					}

					url = this.H_request[i].url;
				}

			if (this.H_request[i].title != "") {
				var logtitle = this.H_request[i].title;
			} else {
				logtitle = undefined;
			}

			var H_search = Array();

			if (undefined !== this.H_request[i].SEARCH == true && Array.isArray(this.H_request[i].SEARCH) == true) {
				H_search = this.H_request[i].SEARCH;
			}

			var dl = false;

			if (undefined !== this.H_request[i].DL == true) {
				dl = true;
			}

			var login = false;

			if (undefined !== this.H_request[i].LOGIN == true) {
				login = true;
			}

			this.doRequest(url, H_data, method, H_search, logtitle, dl, login);

			if (true == (undefined !== this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].login) && false === this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].login) {
				return this.H_result_py;
			}
		}

		return this.H_result_py;
	}

	doRequest(url: string, H_senddata: any = Array() , method = "GET", H_search = Array(), logtitle = undefined, dl = false, login = false) //パラメータ置換
	//GET,POSTを送信
	//HTTPのリターンコードが200なら正常
	{
		if (this.H_values.length > 0) {
			{
				let _tmp_2 = this.H_values;

				for (var key in _tmp_2) {
					var val = _tmp_2[key];
					url = url.replace("{{" + key + "}}", val);
					// H_senddata = H_senddata.replace("{{" + key + "}}", val);
				}
			}
		}

		var req_start = Date.now() / 1000;
		var code;
		if (method.toUpperCase() === "GET") {
			code = this.O_client.get(url, H_senddata);
		} else if (method.toUpperCase() === "POST") {
			if (undefined !== H_senddata._FILES == true && Array.isArray(H_senddata._FILES) == true) {
				var H_files = H_senddata._FILES;
				delete H_senddata._FILES;
				code = this.O_client.post(url, H_senddata, false, H_files);
			} else {
				code = this.O_client.post(url, H_senddata);
			}
		}

		var req_time = Date.now() / 1000 - req_start;

		if (code == "200") //HTTPリターンオブジェクトの取得
			// DEBUG DLに失敗するときはここで取れてないパラメータがページの中にどう入ってるのか見る *
			//var_dump($H_current_response["body"]);
			//履歴に追加
			//ログインだったらログ記録開始
			{
				this.referer = url;
				var H_current_response = this.O_client.currentResponse();
				var H_current_data = {
					url: url
				};
				this.H_history.push(H_current_data);

				if (true == login) //$this->putLog("START: " . $this->loginid . "でログイン", 6);
					//ログイン失敗をキャッチ
					//writeSync($login_res, $H_current_response["body"]);
					//$this->putLog("OK: " . $login_res . " を削除", 6);
					{
						this.start_time = Date.now() / 1000;
						this.login_status = true;
						this.logflg = true;
						var login_res = "login_" + this.pactid + "_" + this.date_y + this.date_m;

						if (200 === H_current_response.code && "" === H_current_response.body) {
							this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].login = true;
						} else //ログイン失敗を取得する（文字列: error_message が本文にあるかないか）
							{
								if (false !== H_current_response.body.indexOf("error_message")) {
									this.putLog("NG: " + this.loginid + "でログイン失敗");
									// this.putLog("NG: " + this.loginid + "でログイン失敗", 6);
									this.H_error.push({
										type: "login",
										message: this.loginid + "でログイン失敗"
									});
									this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].login = false;
								} else {
									this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].login = true;
								}
							}
					}

				if (true == dl) {
					// if (1 === url.match("/priceitem\\/$/")) {
					// 	var filename = this.download_dir.replace(/zip$/g, "bill/" + this.pactid + "/" + this.loginid + "_" + this.date_y + this.date_m + ".csv");
					// 	const fd = fs.openSync(filename, "w");
					// 	writeSync(fd, H_current_response.body);
					// } 
					// else //DL成功/失敗をH_resultにセット
						// {
							let filename = this.download_dir + "/" + this.loginid + "_" + this.date_y + this.date_m + ".zip";
							const fd = fs.openSync(filename, "w");
							writeSync(fd, H_current_response.body);
							var isZip = this.checkZipFile(filename);
							this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dl = isZip;

							if (false == isZip) //$this->putLog("NG: " . $filename . "この月のファイルはダウンロードできません", 6);
								//$this->H_error[] = array("type" => "DL", "message" => $filename . "この月のファイルはダウンロードできません");
								//削除
								//$this->putLog("OK: " . $filename . " を削除", 6);
								{
									this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dl = false;
									exec("rm -f " + filename);
								}
						// }
				}

				if (H_search.length > 0) {
					this.getBodyValue(H_search, H_current_response.body);
				}

				if (this.logflg == true) {
					var logstr = url;

					if (logtitle !== undefined) {
						logstr = logtitle;
					}

					if (H_current_response.body.indexOf("/images/worn_s.gif") !== false) {
						// if (preg_match("/\u30B3\u30FC\u30C9[0-9]+\uFF1A/", H_current_response.body, A_match) == true) {
							var A_match = H_current_response.body.match(/コード[0-9]+：/);
						if (A_match == true) {
							var level = 4;

							if (A_match[0] == "コード1：s") {
								level = 3;
							}

							this.putLog("NG: " + A_match[0] + logtitle + " [実行時間: " + Math.round(req_time) + "秒]");
							// this.putLog("NG: " + A_match[0] + logtitle + " [実行時間: " + Math.round(req_time, 3) + "秒]", level);
							this.H_error.push({
								type: "DL",
								message: logtitle
							});
						} else {
							this.putLog("NG: コード0：" + logtitle + " [実行時間: " + Math.round(req_time) + "秒]");
							// this.putLog("NG: コード0：" + logtitle + " [実行時間: " + Math.round(req_time, 3) + "秒]", 3);
							this.H_error.push({
								type: "DL",
								message: logtitle
							});
						}
					} else if (H_current_response.body.indexOf("( ! )") !== false) {
						// preg_match_all("/<span style='background\\-color: #cc0000; color: #fce94f; font\\-size: x\\-large;'>\\( \\! \\)<\\/span>(.*?)<\\/th>/", H_current_response.body, A_err);
						H_current_response.body.MatchAll("/<span style='background\\-color: #cc0000; color: #fce94f; font\\-size: x\\-large;'>\\( \\! \\)<\\/span>(.*?)<\\/th>/");
						var A_err_message = Array();
						var A_err = Array();

						for (var e = 0; e < A_err[1].length; e++) {
							var striptags = require('striptags');
							A_err_message.push(striptags(A_err[1][e]).trim());
						}

						this.putLog("NG: " + A_err_message.join(", ") + " (このエラーは本番環境では取得できません) [実行時間: )" + Math.round(req_time) + "秒]");
						// this.putLog("NG: " + A_err_message.join(", ") + " (このエラーは本番環境では取得できません) [実行時間: )" + Math.round(req_time, 3) + "秒]", 3);
					} else //$this->putLog("OK: " . $logtitle . " [実行時間: " . round($req_time, 3) . "秒]", 6);
						{}
				}
			} else //最後にHTTPのリターンコード
			{
				this.putLog("NG: HTTP Error: " + code + ": " + url);
				// this.putLog("NG: HTTP Error: " + code + ": " + url, 3);
				this.H_error.push({
					type: "DL",
					message: "HTTP Error: " + code + ": " + url
				});
			}
	}

	putLog(logstr = "") {
		this.infoOut(logstr + "\n", 1);
	}

	checkZipFile(zipfile: string) //ファイルが正常かチェック
	{
		var success = false;
		var result:any = exec("unzip -t " + zipfile);

		if (result.match(/^No errors/)) //成功
			//対象外のファイルを消す
			//請求情報は別ファイルになったので削除
			//$extract_pathフォルダに解凍
			//$this->putLog("OK: " . $zipfile . " を解凍", 6);
			//元ファイル削除
			//exec("rm -f " . $zipfile);
			//$this->putLog("OK: " . $zipfile . " を削除", 6);
			{
				success = true;
				exec("zip " + zipfile + " -d *Call1*.TXT");
				exec("zip " + zipfile + " -d *Call7*.TXT");
				exec("zip " + zipfile + " -d *Call8*.TXT");
				exec("unzip -oj " + zipfile + " -d " + this.extract_path);
			} else //失敗
			//破損ファイル処理
			//正常なZIPファイルではないときにファイルを見たいので削除しないようにコメントアウト
			//exec("rm -f " . $zipfile);
			//$this->putLog("OK: " . $zipfile . " を削除", 6);
			{
				success = false;
				this.putLog("NG: " + zipfile + " は正常なZIPファイルではありません。");
				// this.putLog("NG: " + zipfile + " は正常なZIPファイルではありません。", 6);
				this.H_error.push({
					type: "DL",
					message: zipfile + " は正常なZIPファイルではありません。"
				});
			}

		return success;
	}

	fileExists(file: string) {
		// if (fs.existsSync(dirname(process.SCRIPT_FILENAME) + "/" + file) == true) //return array(dirname($_SERVER["SCRIPT_FILENAME"]) . "/" . $file, "application/octet-stream");
			{
				// return [dirname(process.SCRIPT_FILENAME) + "/" + file];
			}

		return undefined;
	}

	getBodyValue(patterns: any , body: any) //DEBUG用
// 	//echo "DEBUG:";// 2022cvt_010
	//var_dump($this->H_values);
	{
		if (undefined !== patterns.name == true) {
			var tmp = patterns;
			patterns = Array();
			patterns.push(tmp);
		}

		for (var H_search of patterns) {
			if (undefined !== H_search.name == false) {
				continue;
			}

			if (undefined !== H_search.match == false) {
				continue;
			}

			if (undefined !== H_search.num == false || !isNaN(Number(H_search.num)) == false) {
				H_search.num = 0;
			}

			var reg = "/" + H_search.match + "/s";
			var A_match = body.MatchAll(reg);
			// preg_match_all(reg, body, A_match);

			if (undefined !== A_match[H_search.num] == true) {
				this.H_values[H_search.name] = A_match[H_search.num].shift();
			}
		}
	}

	saveData(flg = true) {
		this.value_save = flg;
	}

	__get(property_name: string | number) {
		if (undefined !== this.H_values[property_name] == false) {
			return undefined;
		}

		return this.H_values[property_name];
	}
};
