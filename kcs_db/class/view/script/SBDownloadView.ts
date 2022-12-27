//ソフトバンクダウンロードビュー


import { execSync } from "node:child_process";
import { sprintf } from "../../../db_define/define";
import MtOutput from "../../MtOutput";
import MtScriptArgs from "../../MtScriptArgs";
import MtSetting from "../../MtSetting";
import ViewBaseScript from "./ViewBaseScript";

const fs = require("fs")
const path = require('path')
var striptags = require('striptags')
const Iconv  = require('iconv').Iconv;
const iconv = new Iconv('SJIS', 'UTF-8');

export default class SBDownloadView extends ViewBaseScript {
	static NEW_BILL_URL = "https://obms.business.mb.softbank.jp/obms/ab/AB005/";
	O_MtScriptArgs: MtScriptArgs;
	O_ini: MtSetting;
	H_history: any[];
	login_status: boolean;
	logflg: boolean;
	H_request: any[];
	H_error: any[];
	value_save: boolean;
	H_result_py: any;
	H_client_option: any;
	loginid: number | undefined;
	password: string | undefined
	date_y_dl: number | undefined;
	date_m_dl!: number;
	pactid: string | undefined;
	date_y!: number;
	date_m!: number;
	H_values: any;
	referer: any;
	O_client: any;
	start_time: number | undefined;
	extractNewBillPath: string | undefined;
	extract_path: string | undefined;
	value_data_file: any;


	constructor(O_Set0: MtSetting, O_Out0: MtOutput) //初期化
	//定義された引数と渡された引数の整合性を確認
	{
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
		this.checkArg(this.O_MtScriptArgs);
	}

	setClientOption(H_client_option: any) {
		if (this.getSetting().existsKey("PROXY") && this.getSetting().get("PROXY")) {
			H_client_option.proxy_host = this.getSetting().get("PROXY");

			if (this.getSetting().existsKey("PROXY_PORT") && this.getSetting().get("PROXY_PORT")) {
				H_client_option.proxy_port = this.getSetting().get("PROXY_PORT");
			}

			if (this.getSetting().existsKey("PROXY_USER") && this.getSetting().get("PROXY_USER")) {
				H_client_option.proxy_user = this.getSetting().get("PROXY_USE");
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
			title: "TOKEN取得",
			url: "https://portal.business.mb.softbank.jp/portal/BPS0101/login",
			SEARCH: {
				name: "token",
				match: "\"org\\.apache\\.struts\\.taglib\\.html\\.TOKEN\" value=\"([0-9a-zA-Z]+)\"",
				num: 1
			}
		}, {
			title: "ログイン",
			url: "https://portal.business.mb.softbank.jp/portal/BPS0101/login",
			LOGIN: true,
			POST: {
				authId: this.loginid,
				pwd: this.password,
				"org.apache.struts.taglib.html.TOKEN": "{{token}}"
			}
		}];
	}

	dlPattern() {
		this.saveData();
		return [{
			title: "TOKEN取得",
			url: "https://portal.business.mb.softbank.jp/portal/BPS0101/login",
			SEARCH: {
				name: "token",
				match: "\"org\\.apache\\.struts\\.taglib\\.html\\.TOKEN\" value=\"([0-9a-zA-Z]+)\"",
				num: 1
			}
		}, {
			title: "ログイン",
			url: "https://portal.business.mb.softbank.jp/portal/BPS0101/login",
			LOGIN: true,
			POST: {
				authId: this.loginid,
				pwd: this.password,
				"org.apache.struts.taglib.html.TOKEN": "{{token}}"
			}
		}, {
			title: "OBMSにログインする為のPOST値の取得",
			url: "https://portal.business.mb.softbank.jp/portal/BPS0001/analysis",
			SEARCH: [{
				name: "billno",
				match: "\"billno\" value=\"([0-9a-zA-Z\\+\\-\\=\\!\\#$\\%\\&\\@\\;\\?\\/]+)\"",
				num: 1
			}, {
				name: "userid",
				match: "\"userid\" value=\"([0-9a-zA-Z\\+\\-\\=\\!\\#$\\%\\&\\@\\;\\?\\/]+)\"",
				num: 1
			}, {
				name: "authflg",
				match: "\"authflg\" value=\"([0-9a-zA-Z\\+\\-\\=\\!\\#$\\%\\&\\@\\;\\?\\/]+)\"",
				num: 1
			}, {
				name: "beforeSwitchLoginUserId",
				match: "\"beforeSwitchLoginUserId\" value=\"([0-9a-zA-Z\\+\\-\\=\\!\\#$\\%\\&\\@\\;\\?\\/]+)\"",
				num: 1
			}, {
				name: "obmsscreenid",
				match: "\"obmsscreenid\" value=\"([0-9a-zA-Z\\+\\-\\=\\!\\#$\\%\\&\\@\\;\\?\\/]+)\"",
				num: 1
			}],
			POST: {
				"org.apache.struts.taglib.html.TOKEN": "{{token}}"
			}
		}, {
			title: "OBMSへログイン",
			url: "https://obms.business.mb.softbank.jp/obms/cm/login/",
			POST: {
				userid: "{{userid}}",
				billno: "{{billno}}",
				authflg: "{{authflg}}",
				beforeSwitchLoginUserId: "{{beforeSwitchLoginUserId}}",
				obmsscreenid: "{{obmsscreenid}}"
			}
		}, {
			title: "データダウンロード（通話）",
			url: "https://obms.business.mb.softbank.jp/obms/ab/AB006/",
			DL: true,
			POST: {
				billYm: +(this.date_y_dl + sprintf("%02d", String(this.date_m_dl))),
				downloadBill: "%91%97%90M"
			}
		}, {
			title: "データダウンロード（請求）",
			url: SBDownloadView.NEW_BILL_URL,
			DL: true,
			POST: {
				downloadSelectBill: "%91%97%90M",
				billYm: +(this.date_y_dl + sprintf("%02d", String(this.date_m_dl))),
				"msnConditionForm.showPhoneSet": 1,
				selPriceable: 1,
				selRangePriceItem: 1,
				showSection: 1,
				showSecUsrCode: 1,
				showPrcPlanName: 1,
				showPrcItemId: 1,
				taxDivision: 1,
				showPriceSubTotal: 1,
				multiMsnDiscountDividedPrice: 1,
				bigCallChargeBasicDiscountDividedPrice: 1,
				bigCallChargeDividedPrice: 1,
				otherDividedPrice: 1,
				taxDividedPrice: 1,
				othDividedPrice: 1
			}
		}];
	}

	doExecute(exetype: string) //doExecuteでしか使用していない変数の為、ここで初期化 20130515ikeshima
	{
		this.H_result_py = Array();
		this.setClientOption({
			timeout: 60
		});
		var defheader = {
			"User-Agent": "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)"
		};
		// this.O_client = new HTTP_Client(this.H_client_option, defheader); 一旦コメンアウト
		this.O_client =  [];

		if ("login" == exetype) {
			this.setLoginPattern();
		} else {
			this.setDLPattern();
		}

		for (var i = 0; i < this.H_request.length; i++) //POSTの処理
		//タイトルが指定されていなかったらURLを使用する
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
						url += A_param.join("&");
					}

					if (undefined !== this.H_request[i].FILES == true && Array.isArray(this.H_request[i].FILES) == true) {
						{
							let _tmp_1 = this.H_request[i].FILES;

							for (var param in _tmp_1) {
								var file = _tmp_1[param];
								var A_file_param = this.fileExists(file);

								if (A_file_param !== undefined) {
									// A_file_param.unshift(param);　一旦コメンアウト
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

	doRequest(url, H_senddata: any = Array(), method = "GET", H_search: any = Array(), logtitle = undefined, dl = false, login = false) //パラメータ置換
	{
		if (this.H_values.length > 0) {
			{
				let _tmp_2 = this.H_values;

				for (var key in _tmp_2) {
					var val = _tmp_2[key];
					url = url.replace("{{" + key + "}}", val);
					H_senddata = H_senddata.replace("{{" + key + "}}", val);
				}
			}
		}

		var req_start = Date.now() / 1000;

		if (method.toUpperCase() === "GET") {
			var header = {
				Referer: this.referer
			};
			var code = this.O_client.get(url, H_senddata, header);
		} else if (method.toUpperCase() === "POST") {
			if (undefined !== H_senddata._FILES == true && Array.isArray(H_senddata._FILES) == true) {
				var H_files = H_senddata._FILES;
				delete H_senddata._FILES;
				code = this.O_client.post(url, H_senddata, false, H_files);
			} else {
				header = {
					Referer: this.referer
				};
				code = this.O_client.post(url, H_senddata, header);
			}
		}

		var req_time = Date.now() / 1000 - req_start;

		if (code == "200") //HTTPリターンオブジェクトの取得

			{
				this.referer = url;
				var H_current_response = this.O_client.currentResponse();
				var H_current_data = {
					url: url
				};
				this.H_history.push(H_current_data);

				if (true == login) //$this->putLog("START: " . $this->loginid . "でログイン", 6);
					{
						this.start_time = Date.now() / 1000;
						this.login_status = true;
						this.logflg = true;
						var login_res = "login_" + this.pactid + "_" + this.date_y + this.date_m;
						fs.writeSync(login_res, H_current_response.body);
						var instr = fs.readdirSync(login_res);
						var outstr = iconv.convert(instr);
						outstr = outstr.replace(["\r\n", "\n", "\r"], "\n");

						if (0 < outstr.match("/ログインに失敗しました。/")) {
							this.putLog("NG: " + this.loginid + "でログイン失敗", 6);
							this.H_error.push({
								type: "login",
								message: this.loginid + "でログイン失敗"
							});
							this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].login = false;
						} else {
							this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].login = true;
						}

						execSync("rm -f " + login_res);
					}

				if (true == dl) {
					if (SBDownloadView.NEW_BILL_URL === H_current_response.url) {
						var filename = this.loginid + "_" + this.date_y + this.date_m + ".csv";
						fs.readdirSync(filename, H_current_response.body);
						var utfData = iconv.convert(H_current_response.body).replace(["\r\n", "\r"], "\n");

						if (utfData.match("/\\<html/i") || 0 < utfData.match("/エラーが発生しました/") || 0 < utfData.match("/ファイルがありません/")) {
							execSync("rm -f " + filename);
							this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dlx = false;
						} else {
							execSync("/bin/mv " + filename + " " + this.extractNewBillPath + "/" + filename);
							this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dlx = true;
						}
					} else //昔の請求情報
						//文字列をUTF-8に変換
						{
							filename = "sb_download_temp_" + this.pactid + "_" + this.date_y + this.date_m + ".zip";
							fs.readdirSync(filename, H_current_response.body);
							instr = fs.readdirSync(filename);
							outstr = iconv.convert(instr);
							outstr = outstr.replace(["\r\n", "\n", "\r"], "\n");

							if (0 < outstr.match("/エラーが発生しました/")) //$this->putLog("NG: " . $filename . "この月のファイルはダウンロードできません", 6);	// 単にファイルがない場合はエラーメッセージ省略 20091208miya
								{
									this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dl = false;
									execSync("rm -f " + filename);
								} else if (0 < outstr.match("/ファイルがありません/")) //「エラーが発生しました」の文言がなければZIPファイルのチェックに投げる
								{
									this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dl = false;
									execSync("rm -f " + filename);
								} else //DL成功/失敗をH_resultにセット
								{
									this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dl = this.checkZipFile(filename);
								}
						}
				}

				if (H_search.length > 0) {
					if (undefined !== H_search.name) {
						this.getBodyValue(H_search, H_current_response.body);
					} else {
						for (var search of Object.values(H_search)) {
							this.getBodyValue(search, H_current_response.body);
						}
					}
				}

				if (this.logflg == true) {
					var logstr = url;

					if (logtitle !== undefined) {
						logstr = logtitle;
					}

					if (H_current_response.body.indexOf("/images/worn_s.gif") !== false) {
					var	A_match = H_current_response.body.match("/コード[0-9]+：/")
						if ( A_match ) {
							var level = 4;

							if (A_match[0] == "コード1：") {
								level = 3;
							}

							this.putLog("NG: " + A_match[0] + logtitle + " [実行時間: " + Math.round(req_time * 1000) / 1000 + "秒]", level);
							this.H_error.push({
								type: "DL",
								message: logtitle
							});
						} else {
							this.putLog("NG: コード0：" + logtitle + " [実行時間: " + 	 + "秒]", 3);
							this.H_error.push({
								type: "DL",
								message: logtitle
							});
						}
					} else if (H_current_response.body.indexOf("( ! )") !== false) {
						var A_err =  H_current_response.body.matchAll("/<span style='background\\-color: #cc0000; color: #fce94f; font\\-size: x\\-large;'>\\( \\! \\)<\\/span>(.*?)<\\/th>/");
						var A_err_message = Array();

						for (var e = 0; e < A_err[1].length; e++) {
							A_err_message.push(striptags(A_err[1][e]).trim());
						}

						this.putLog("NG: " + A_err_message.join(", ") + " (このエラーは本番環境では取得できません) [実行時間: " + Math.round(req_time * 1000)/1000 + "秒]", 3);
					} else //$this->putLog("OK: " . $logtitle . " [実行時間: " . round($req_time, 3) . "秒]", 6);
						{}
				}
			} else //最後にHTTPのリターンコード
			{
				this.putLog("NG: HTTP Error: " + code + ": " + url, 3);
				this.H_error.push({
					type: "DL",
					message: "HTTP Error: " + code + ": " + url
				});
			}
	}

	putLog(logstr = "",level) {
		this.infoOut(logstr + "\n", 1);
	}

	checkZipFile(zipfile: string) //ファイルが正常かチェック
	{
		var success = false;
		var result: any = execSync("unzip -t " + zipfile);

		if (result.match("/^No errors/")) //成功
			{
				success = true;
				execSync("zip " + zipfile + " -d *Call1*.TXT");
				execSync("zip " + zipfile + " -d *Call7*.TXT");
				execSync("zip " + zipfile + " -d *Call8*.TXT");
				execSync("unzip -oj " + zipfile + " -d " + this.extract_path);
				execSync("rm -f " + zipfile);
			} else //失敗
			{
				success = false;
				this.putLog("NG: " + zipfile + " は正常なZIPファイルではありません。", 6);
				this.H_error.push({
					type: "DL",
					message: zipfile + " は正常なZIPファイルではありません。"
				});
				execSync("rm -f " + zipfile);
				this.putLog("OK: " + zipfile + " を削除", 6);
			}

		return success;
	}

	fileExists(file) {
		// if (fs.existsSync(path.dirname(process.SCRIPT_FILENAME) + "/" + file) == true) 
		// 	{
		// 		return [path.dirname(process.SCRIPT_FILENAME) + "/" + file];
		// 	}
		// 一旦コメンアウト

		return undefined;
	}

	getBodyValue(H_search: any, body) {
		if (undefined !== H_search.name == false) {
			return false;
		}

		if (undefined !== H_search.match == false) {
			return false;
		}

		if (undefined !== H_search.num == false || !isNaN(Number(H_search.num)) == false) {
			H_search.num = 0;
		}

		var reg = "/" + H_search.match + "/s";
		var A_match = body.matchAll(reg, body);

		if (undefined !== A_match[H_search.num] == true) //DEBUG用 ページの中身
			{
				this.H_values[H_search.name] = A_match[H_search.num].shift();
			}
	}

	saveValueData() {
		if (false == fs.existsSync(path.dirname(this.value_data_file))) {
			fs.mkdirSync(path.dirname(this.value_data_file), 755, true);
		}

		var fp =  fs.openSync(this.value_data_file, "w");
		fs.writeFileSync(fp, JSON.parse(this.H_values));
		fs.closeSync(fp);
	}

	loadValueData() {
		if (true == fs.existsSync(this.value_data_file)) {
			var data = fs.readdirSync(this.value_data_file);
			this.H_values = JSON.stringify(data);
		} else {
			this.H_values = Array();
		}
	}

	saveData(flg = true) {
		this.value_save = flg;
	}

	__get(property_name: string) {
		if (undefined !== this.H_values[property_name] == false) {
			return undefined;
		}

		return this.H_values[property_name];
	}


};
