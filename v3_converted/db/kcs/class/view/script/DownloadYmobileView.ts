//Ymobileダウンロード
//    ソフトバンクのダウンロードを元にしている
//    (ソフトバンクとYmobileのサイト構成がドメイン以外同じなので・・)
//    2019527 伊達改造
//error_reporting(E_ALL);
//require_once("HTTP/Client.php");
//
//DownloadYmobileView
//
//@uses ViewBaseScript
//@package
//@author web
//@since 2019/05/27
//

require("view/script/ViewBaseScript.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgs.php");

require("HttpClient2.php");

//
//HTTP_Clientオブジェクト
//
//@var object
//@access private
//
//
//MtSettingオブジェクト
//
//@var object
//@access private
//
//
//設定ファイル名
//
//@var string
//@access private
//
//
//リファラ
//
//@var string
//@access private
//
//
//HTTP_Clientオブジェクトのオプション
//
//@var mixed
//@access private
//
//
//履歴
//
//@var mixed
//@access private
//
//
//ログイン状況
//
//@var mixed
//@access private
//
//
//ログ開始フラグ
//
//@var mixed
//@access private
//
//
//ログハンドラ
//
//@var mixed
//@access private
//
//
//DL実行連想配列
//
//@var mixed
//@access protected
//
//
//開始時間
//
//@var mixed
//@access private
//
//
//取得変数
//
//@var mixed
//@access private
//
//
//value_data_file
//
//@var mixed
//@access private
//
//
//value_save
//
//@var mixed
//@access private
//
//
//DLサイトログインID
//
//@var string
//@access public
//
//
//DLサイトログインパスワード
//
//@var string
//@access protectedpublic
//
//
//契約ID
//
//@var integer
//@access public
//
//
//detailno
//2013/05追加
//
//@var mixed
//@access public
//
//
//DLファイルの解凍フォルダ
//
//@var string
//@access private
//
//
//按分後の請求所方ファイル
//
//@var mixed
//@access public
//
//
//受け付け引数の処理クラス
//
//@var MtScriptArgsImport
//@access public
//
//
//DLファイルの年
//
//@var string
//@access private
//
//
//DLファイルの月
//
//@var string
//@access private
//
//
//DLサイトに渡す年 20090904miya
//
//@var string
//@access private
//
//
//DLサイトに渡す月 20090904miya
//
//@var string
//@access private
//
//
//エラー文格納変数
//
//@var array
//@access public
//
//
//成功・失敗の配列(pactとyyyymmごとに入れる)
//
//@var array
//@access public
//
//
//コンストラクター
//
//@author miyazawa
//@since 2009/06/05
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//H_client_optionのsetter
//
//@author miyazawa
//@since 2009/06/05
//
//@param array $H_req_option
//@access public
//@return void
//
//
//H_requestのsetter（ログイン用）
//
//@author miyazawa
//@since 2009/06/26
//
//@access private
//@return void
//
//
//H_requestのsetter（ダウンロード用）
//
//@author miyazawa
//@since 2009/06/05
//
//@access private
//@return void
//
//
//loginPattern
//
//@author miyazawa
//@since 2009/06/26
//
//@access protected
//@return
//
//
//dlPattern
//
//@author miyazawa
//@since 2009/06/01
//
//@access protected
//@return
//
//
//実処理
//継承先で記述したDLパターンの連想配列から順に実行していく
//
//@author miyazawa
//@since 2009/06/05
//
//@param exetype string	"dl"/"login"
//@access public
//@return void
//
//
//HTTPの送信処理
//
//@author miyazawa
//@since 2009/06/05
//
//@param string $url
//@param array $H_senddata
//@param string $method
//@param array $H_search
//@param string $logtitle
//@param boolean $dl
//@access protected
//@return void
//
//
//ログ書き込み処理<br>
//バッチ用のログ書き込み処理に変更
//
//@author miyazawa
//@since 2009/06/05
//
//@param string $logstr
//@access private
//@return void
//
//
//DLしたファイルが正常か
//
//@author miyazawa
//@since 2009/05/22
//
//@access private
//@return void
//
//
//fileExists
//
//@author miyazawa
//@since 2009/06/05
//
//@param mixed $file
//@access protected
//@return void
//
//
//getBodyValue
//
//@author miyazawa
//@since 2009/06/05
//
//@param array $H_search
//@param mixed $body
//@access protected
//@return void
//
//
//saveValueData
//
//@author miyazawa
//@since 2009/06/05
//
//@access protected
//@return void
//
//
//loadValueData
//
//@author miyazawa
//@since 2009/06/05
//
//@access protected
//@return void
//
//
//saveData
//
//@author miyazawa
//@since 2009/06/05
//
//@param mixed $flg
//@access protected
//@return void
//
//
//__get
//
//@author miyazawa
//@since 2009/06/05
//
//@param mixed $property_name
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2009/06/05
//
//@access public
//@return void
//
class DownloadYmobileView extends ViewBaseScript {
	static NEW_BILL_URL = "https://obms.business.ymobile.jp/obms/ab/AB005/";

	constructor(O_Set0: MtSetting, O_Out0: MtOutput) //初期化
	//定義された引数と渡された引数の整合性を確認
	{
		super(O_Set0, O_Out0);
		var A_arg_help = [["-y", "YYYYMMnone", "\u8ACB\u6C42\u5E74\u6708\t\tYYYY:\u5E74,MM:\u6708,none:\u6307\u5B9A\u3057\u306A\u3044\uFF08\u5F53\u6708\u3067\u5B9F\u884C\uFF09"], ["-p", "pactid", "\u5951\u7D04\uFF29\uFF24\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"], ["-s", "CharSwitch", "\u5B9F\u884C\u6642\u9593\u5236\u9650\tY:\u6709\u308A,N:\u7121\u3057", "Y,N"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\n");
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

	setClientOption(H_client_option: {} | any[]) {
		if (this.getSetting().existsKey("PROXY") && this.getSetting().PROXY) {
			H_client_option.proxy_host = this.getSetting().PROXY;

			if (this.getSetting().existsKey("PROXY_PORT") && this.getSetting().PROXY_PORT) {
				H_client_option.proxy_port = this.getSetting().PROXY_PORT;
			}

			if (this.getSetting().existsKey("PROXY_USER") && this.getSetting().PROXY_USER) {
				H_client_option.proxy_user = this.getSetting().PROXY_USER;
			}

			if (this.getSetting().existsKey("PROXY_PASSWORD") && this.getSetting().PROXY_PASSWORD) {
				H_client_option.proxy_password = this.getSetting().PROXY_PASSWORD;
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
			title: "TOKEN\u53D6\u5F97",
			url: "https://portal.business.ymobile.jp/portal/BPS0101/login",
			SEARCH: {
				name: "token",
				match: "\"org\\.apache\\.struts\\.taglib\\.html\\.TOKEN\" value=\"([0-9a-zA-Z]+)\"",
				num: 1
			}
		}, {
			title: "\u30ED\u30B0\u30A4\u30F3",
			url: "https://portal.business.ymobile.jp/portal/BPS0101/login",
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
			title: "TOKEN\u53D6\u5F97",
			url: "https://portal.business.ymobile.jp/portal/BPS0101/login",
			SEARCH: {
				name: "token",
				match: "\"org\\.apache\\.struts\\.taglib\\.html\\.TOKEN\" value=\"([0-9a-zA-Z]+)\"",
				num: 1
			}
		}, {
			title: "\u30ED\u30B0\u30A4\u30F3",
			url: "https://portal.business.ymobile.jp/portal/BPS0101/login",
			LOGIN: true,
			POST: {
				authId: this.loginid,
				pwd: this.password,
				"org.apache.struts.taglib.html.TOKEN": "{{token}}"
			}
		}, {
			title: "OBMS\u306B\u30ED\u30B0\u30A4\u30F3\u3059\u308B\u70BA\u306EPOST\u5024\u306E\u53D6\u5F97",
			url: "https://portal.business.ymobile.jp/portal/BPS0001/analysis",
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
			title: "OBMS\u3078\u30ED\u30B0\u30A4\u30F3",
			url: "https://obms.business.ymobile.jp/obms/cm/login/",
			POST: {
				userid: "{{userid}}",
				billno: "{{billno}}",
				authflg: "{{authflg}}",
				beforeSwitchLoginUserId: "{{beforeSwitchLoginUserId}}",
				obmsscreenid: "{{obmsscreenid}}"
			}
		}, {
			title: "\u30C7\u30FC\u30BF\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\uFF08\u901A\u8A71\uFF09",
			url: "https://obms.business.ymobile.jp/obms/ab/AB006/",
			DL: true,
			POST: {
				billYm: +(this.date_y_dl + sprintf("%02d", +this.date_m_dl)),
				downloadBill: "%91%97%90M"
			}
		}, {
			title: "\u30C7\u30FC\u30BF\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\uFF08\u8ACB\u6C42\uFF09",
			url: DownloadYmobileView.NEW_BILL_URL,
			DL: true,
			POST: {
				downloadSelectBill: "%91%97%90M",
				billYm: +(this.date_y_dl + sprintf("%02d", +this.date_m_dl)),
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

	doExecute(exetype) //doExecuteでしか使用していない変数の為、ここで初期化 20130515ikeshima
	//接続オプション設定
	//オブジェクト生成
	//DLパターンをループして全て実行
	{
		this.H_result_py = Array();
		this.setClientOption({
			timeout: 60
		});
		var defheader = Array();
		defheader["User-Agent"] = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)";
		this.O_client = new HTTP_Client(this.H_client_option, defheader);

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
						if (strpos(url, "?") !== false) {
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
						url += join("&", A_param);
					}

					if (undefined !== this.H_request[i].FILES == true && Array.isArray(this.H_request[i].FILES) == true) {
						{
							let _tmp_1 = this.H_request[i].FILES;

							for (var param in _tmp_1) {
								var file = _tmp_1[param];
								var A_file_param = this.fileExists(file);

								if (A_file_param !== undefined) {
									A_file_param.unshift(param);
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

	doRequest(url, H_senddata: {} | any[] = Array(), method = "GET", H_search = Array(), logtitle = undefined, dl = false, login = false) //パラメータ置換
	//GET,POSTを送信
	//HTTPのリターンコードが200なら正常
	{
		if (this.H_values.length > 0) {
			{
				let _tmp_2 = this.H_values;

				for (var key in _tmp_2) {
					var val = _tmp_2[key];
					url = str_replace("{{" + key + "}}", val, url);
					H_senddata = str_replace("{{" + key + "}}", val, H_senddata);
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
					//文字列をUTF-8に変換
					//ファイル削除 20090904miya
					//$this->putLog("OK: " . $login_res . " を削除", 6);
					{
						this.start_time = Date.now() / 1000;
						this.login_status = true;
						this.logflg = true;
						var login_res = "login_" + this.pactid + "_" + this.date_y + this.date_m;
						file_put_contents(login_res, H_current_response.body);
						var instr = file_get_contents(login_res);
						var outstr = mb_convert_encoding(instr, "utf-8", "SJIS");
						outstr = str_replace(["\r\n", "\n", "\r"], "\n", outstr);

						if (0 < preg_match("/\u30ED\u30B0\u30A4\u30F3\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002/", outstr)) {
							this.putLog("NG: " + this.loginid + "\u3067\u30ED\u30B0\u30A4\u30F3\u5931\u6557", 6);
							this.H_error.push({
								type: "login",
								message: this.loginid + "\u3067\u30ED\u30B0\u30A4\u30F3\u5931\u6557"
							});
							this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].login = false;
						} else {
							this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].login = true;
						}

						exec("rm -f " + login_res);
					}

				if (true == dl) {
					if (DownloadYmobileView.NEW_BILL_URL === H_current_response.url) {
						var filename = this.loginid + "_" + this.date_y + this.date_m + ".csv";
						file_put_contents(filename, H_current_response.body);
						var utfData = str_replace(["\r\n", "\r"], "\n", mb_convert_encoding(H_current_response.body, "utf-8", "SJIS"));

						if (preg_match("/\\<html/i", utfData) || 0 < preg_match("/\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F/", utfData) || 0 < preg_match("/\u30D5\u30A1\u30A4\u30EB\u304C\u3042\u308A\u307E\u305B\u3093/", utfData)) {
							exec("rm -f " + filename);
							this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dlx = false;
						} else {
							exec("/bin/mv " + filename + " " + this.extractNewBillPath + "/" + filename);
							this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dlx = true;
						}
					} else //昔の請求情報
						//文字列をUTF-8に変換
						{
							filename = "sb_download_temp_" + this.pactid + "_" + this.date_y + this.date_m + ".zip";
							file_put_contents(filename, H_current_response.body);
							instr = file_get_contents(filename);
							outstr = mb_convert_encoding(instr, "utf-8", "SJIS");
							outstr = str_replace(["\r\n", "\n", "\r"], "\n", outstr);

							if (0 < preg_match("/\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F/", outstr)) //$this->putLog("NG: " . $filename . "この月のファイルはダウンロードできません", 6);	// 単にファイルがない場合はエラーメッセージ省略 20091208miya
								//$this->H_error[] = array("type" => "DL", "message" => $filename . "この月のファイルはダウンロードできません");	// 単にファイルがない場合はエラーメッセージ省略 20091208miya
								//削除 20090904miya
								//$this->putLog("OK: " . $filename . " を削除", 6);
								//ファイルがないときはスルー 2010702miya
								{
									this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dl = false;
									exec("rm -f " + filename);
								} else if (0 < preg_match("/\u30D5\u30A1\u30A4\u30EB\u304C\u3042\u308A\u307E\u305B\u3093/", outstr)) //「エラーが発生しました」の文言がなければZIPファイルのチェックに投げる
								{
									this.H_result_py[this.pactid + "_" + this.date_y + this.date_m].dl = false;
									exec("rm -f " + filename);
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

					if (strpos(H_current_response.body, "/images/worn_s.gif") !== false) {
						if (preg_match("/\u30B3\u30FC\u30C9[0-9]+\uFF1A/", H_current_response.body, A_match) == true) {
							var level = 4;

							if (A_match[0] == "\u30B3\u30FC\u30C91\uFF1A") {
								level = 3;
							}

							this.putLog("NG: " + A_match[0] + logtitle + " [\u5B9F\u884C\u6642\u9593: " + Math.round(req_time, 3) + "\u79D2]", level);
							this.H_error.push({
								type: "DL",
								message: logtitle
							});
						} else {
							this.putLog("NG: \u30B3\u30FC\u30C90\uFF1A" + logtitle + " [\u5B9F\u884C\u6642\u9593: " + Math.round(req_time, 3) + "\u79D2]", 3);
							this.H_error.push({
								type: "DL",
								message: logtitle
							});
						}
					} else if (strpos(H_current_response.body, "( ! )") !== false) {
						preg_match_all("/<span style='background\\-color: #cc0000; color: #fce94f; font\\-size: x\\-large;'>\\( \\! \\)<\\/span>(.*?)<\\/th>/", H_current_response.body, A_err);
						var A_err_message = Array();

						for (var e = 0; e < A_err[1].length; e++) {
							A_err_message.push(strip_tags(A_err[1][e]).trim());
						}

						this.putLog("NG: " + A_err_message.join(", ") + " (\u3053\u306E\u30A8\u30E9\u30FC\u306F\u672C\u756A\u74B0\u5883\u3067\u306F\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093) [\u5B9F\u884C\u6642\u9593: " + Math.round(req_time, 3) + "\u79D2]", 3);
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

	putLog(logstr = "") {
		this.infoOut(logstr + "\n", 1);
	}

	checkZipFile(zipfile) //ファイルが正常かチェック
	{
		var success = false;
		var result = exec("unzip -t " + zipfile);

		if (preg_match("/^No errors/", result)) //成功
			//対象外のファイルを消す
			//exec("zip " . $zipfile . " -d *Call1*.TXT");	//	親番号確認するために使うので消さないようにした
			//$extract_pathフォルダに解凍
			//$this->putLog("OK: " . $zipfile . " を解凍", 6);
			//元ファイル削除
			//$this->putLog("OK: " . $zipfile . " を削除", 6);
			{
				success = true;
				exec("zip " + zipfile + " -d *Call7*.TXT");
				exec("unzip -oj " + zipfile + " -d " + this.extract_path);
				exec("rm -f " + zipfile);
			} else //失敗
			//破損ファイル処理
			//削除 20090904miya
			//正常なZIPファイルではないときにファイルを見たいので削除しないようにコメントアウト 20100104miya
			//削除したくなったのでコメントアウトを外しました 20170623伊達
			{
				success = false;
				this.putLog("NG: " + zipfile + " \u306F\u6B63\u5E38\u306AZIP\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002", 6);
				this.H_error.push({
					type: "DL",
					message: zipfile + " \u306F\u6B63\u5E38\u306AZIP\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002"
				});
				exec("rm -f " + zipfile);
				this.putLog("OK: " + zipfile + " \u3092\u524A\u9664", 6);
			}

		return success;
	}

	fileExists(file) {
		if (file_exists(dirname(_SERVER.SCRIPT_FILENAME) + "/" + file) == true) //return array(dirname($_SERVER["SCRIPT_FILENAME"]) . "/" . $file, "application/octet-stream");
			{
				return [dirname(_SERVER.SCRIPT_FILENAME) + "/" + file];
			}

		return undefined;
	}

	getBodyValue(H_search: {} | any[], body) {
		if (undefined !== H_search.name == false) {
			return false;
		}

		if (undefined !== H_search.match == false) {
			return false;
		}

		if (undefined !== H_search.num == false || is_numeric(H_search.num) == false) {
			H_search.num = 0;
		}

		var reg = "/" + H_search.match + "/s";
		preg_match_all(reg, body, A_match);

		if (undefined !== A_match[H_search.num] == true) //DEBUG用 ページの中身
			//var_dump($body);
			//DEBUG用 検索語句にマッチした値
			//var_dump($this->H_values[$H_search["name"]]);
			{
				this.H_values[H_search.name] = A_match[H_search.num].shift();
			}
	}

	saveValueData() {
		if (false == is_dir(dirname(this.value_data_file))) {
			mkdir(dirname(this.value_data_file), 755, true);
		}

		var fp = fopen(this.value_data_file, "w");
		fwrite(fp, serialize(this.H_values));
		fclose(fp);
	}

	loadValueData() {
		if (true == file_exists(this.value_data_file)) {
			var data = file_get_contents(this.value_data_file);
			this.H_values = unserialize(data);
		} else {
			this.H_values = Array();
		}
	}

	saveData(flg = true) {
		this.value_save = flg;
	}

	__get(property_name) {
		if (undefined !== this.H_values[property_name] == false) {
			return undefined;
		}

		return this.H_values[property_name];
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};