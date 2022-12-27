//
//Felicaダウンロードビュー
//
//更新履歴：<br>
//2009/05/28 宮澤龍彦 作成
//
//@uses ViewBaseScript
//@package SBDownload
//@filesource
//@subpackage View
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/05/28
//
//
//error_reporting(E_ALL);
//
//Felicaダウンロードビュー
//
//@uses ViewSmarty
//@package Base
//@subpackage View
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/05/28
//

require("view/script/ViewBaseScript.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtScriptArgs.php");

require("HTTP/Client.php");

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
//DLファイルの解凍フォルダ
//
//@var string
//@access private
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
//クラウズサーバのヘルスチェック
//
//@author miyazawa
//@since 2010/04/22
//
//@param int $pactid 契約ID
//@access public
//@return
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
class FelicaDownloadView extends ViewBaseScript {
	constructor(O_Set0: MtSetting, O_Out0: MtOutput) //接続オプション設定
	//オブジェクト生成
	//初期化
	//定義された引数と渡された引数の整合性を確認
	{
		super(O_Set0, O_Out0);
		var A_arg_help = [["-y", "YYYYMMDDnone", "\u8ACB\u6C42\u5E74\u6708\u65E5\t\tYYYY:\u5E74,MM:\u6708,DD:\u65E5,none:\u6307\u5B9A\u3057\u306A\u3044\uFF08\u5F53\u65E5\u3067\u5B9F\u884C\uFF09"], ["-p", "pactid", "\u5951\u7D04\uFF29\uFF24\t\tall:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C"], ["-s", "CharSwitch", "\u5B9F\u884C\u6642\u9593\u5236\u9650\tY:\u6709\u308A,N:\u7121\u3057", "Y,N"]];
		this.O_MtScriptArgs = new MtScriptArgs(A_arg_help);

		if (false == this.O_MtScriptArgs.get_MtScriptArgsFlag()) {
			this.errorOut("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059\n");
		}

		this.O_ini = O_Set0;
		this.setClientOption({
			timeout: 10,
			allowRedirects: false
		});
		this.O_client = new HTTP_Client(this.H_client_option);
		this.H_history = Array();
		this.login_status = false;
		this.logflg = false;
		this.H_request = Array();
		this.value_save = false;
		this.H_error = Array();
		this.H_result_py = Array();
		this.checkArg(this.O_MtScriptArgs);
	}

	setClientOption(H_client_option: {} | any[]) {
		this.H_client_option = H_client_option;
	}

	setLoginPattern() {
		this.H_request = this.loginPattern();
	}

	setDLPattern() {
		this.H_request = this.dlPattern();
	}

	checkHealth(url) //返値を受け取る
	{
		var O_req = new HTTP_Request(url);
		O_req.setMethod("GET");
		O_req.addHeader("User-Agent", "Mozilla/4.0 (Compatible; MSIE 5.5; Windows NT 5.1; SV1)");
		O_req.addHeader("Referer", "KCS Motion V3");

		if (PEAR.isError(O_req.sendRequest()) == false) //$response = $O_req->getResponseBody();
			//return $response;
			{
				var code = O_req.getResponseCode();
				return code;
			} else {
			return false;
		}
	}

	doRequest(url, H_param: {} | any[] = Array()) //返値を受け取る
	{
		var H_dl = Array();
		var param_str = "";

		for (var key in H_param) {
			var val = H_param[key];
			param_str += key + "=" + val + "&";
		}

		var dl_url = url + param_str;
		var O_req = new HTTP_Request(dl_url);
		O_req.setMethod("GET");
		O_req.addHeader("User-Agent", "Mozilla/4.0 (Compatible; MSIE 5.5; Windows NT 5.1; SV1)");
		O_req.addHeader("Referer", "KCS Motion V3");

		if (PEAR.isError(O_req.sendRequest()) == false) {
			var code = O_req.getResponseCode();
			var data = O_req.getResponseBody();
			H_dl.code = code;
			H_dl.data = data;
			return H_dl;
		} else {
			return false;
		}
	}

	putLog(logstr = "") {
		this.infoOut(logstr + "\n", 1);
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