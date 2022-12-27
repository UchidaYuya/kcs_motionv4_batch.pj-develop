//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//セキュア電話帳クラス
//
//作成日：2006/04/17
//作成者：前田
//
//修正履歴：
//2006/04/24 宮澤 getSecResultを追加
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//require_once("common.php");
//define("G_SECURETEL_URL", "https://192.168.2.111/test_telServer.php");
//define("G_SECURETEL_URL", "https://59.87.20.171/securebookadmin/kcsent");
//define("G_SECURETEL_URL","https://mobilegw.ddo.jp/securebook/index.jsp");

require("HTTP/Request.php");

const G_SECURETEL_URL = "https://kcsst.jp/securebookadmin/kcsent";

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//POSTパラメータを送信し、送信先プログラムから応答メッセージを受け取る
//
//[引　数] $H_param：POSTパラメータ
//[返り値] 成功：セキュア電話帳システムからの返り値(メッセージ抽出)
//失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//PSOTパラメータを送信し、送信先プログラムから応答メッセージを受け取る
//
//[引　数] $H_param：POSTパラメータ
//[返り値] 成功：セキュア電話帳システムからの返り値
//失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//POSTパラメータ送信の結果を場合分けし、true/falseとメッセージを返す
//
//[引　数] $O_result：このクラスのpostParamの結果
//[返り値] $H_secresult = array("result"=>true/false, "message"=>"メッセージ");
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
class SecureTelSsl {
	SecureTelSsl(url = "", method = "") {
		if (url == "") {
			this.url = G_SECURETEL_URL;
		} else {
			this.url = url;
		}

		if (method == "") {
			this.method = HTTP_REQUEST_METHOD_POST;
		} else {
			this.method = method;
		}
	}

	postParam(H_param) //パラメータチェック
	//POSTパラメータを設定
	//POSTできたら返値を受け取る
	{
		if (H_param.length == 0) {
			return false;
		}

		var O_req = new HTTP_Request(this.url);
		O_req.setMethod(this.method);
		O_req.addHeader("User-Agent", "Mozilla/4.0 (Compatible; MSIE 5.5; Windows NT 5.1; SV1)");
		O_req.addHeader("Referer", "KCS Motion V2");

		for (var key in H_param) {
			var val = H_param[key];
			O_req.addPostData(key, val);
		}

		if (PEAR.isError(O_req.sendRequest()) == false) //メッセージは<hr>で区切られてくる
			{
				var A_response = split("<hr>", O_req.getResponseBody());

				for (var data of Object.values(A_response)) //Normalの場合は返すコードがないのでtrueを返す
				{
					var trimdata = trim(data, " ");
					trimdata = str_replace("<p>", "", trimdata);
					trimdata = str_replace("</p>", "", trimdata);

					if (ereg("Normal", trimdata, match) == true) //Errorの場合はエラーコードを返す
						{
							return true;
						} else if (ereg("Error:", trimdata, match) == true) {
						return str_replace(match, "", trimdata).trim();
					}
				}
			} else {
			return false;
		}
	}

	postParamHtml(H_param) //パラメータチェック
	//POSTパラメータを設定
	//POSTできたら返値を受け取る
	{
		if (H_param.length == 0) {
			return false;
		}

		var O_req = new HTTP_Request(this.url);
		O_req.setMethod(this.method);
		O_req.addHeader("User-Agent", "Mozilla/4.0 (Compatible; MSIE 5.5; Windows NT 5.1; SV1)");
		O_req.addHeader("Referer", "KCS Motion V2");

		for (var key in H_param) {
			var val = H_param[key];
			O_req.addPostData(key, val);
		}

		if (PEAR.isError(O_req.sendRequest()) == false) {
			var response = O_req.getResponseBody();
			return response;
		} else {
			return false;
		}
	}

	getSecResult(O_result) {
		var H_secresult = {
			result: false,
			message: ""
		};

		if (O_result == "1") {
			H_secresult.result = true;
			H_secresult.message = "";
		} else {
			var message = "";

			if (O_result == 100001) //管理者承認エラー
				{
					message = "\u7BA1\u7406\u8005\u627F\u8A8D\u30A8\u30E9\u30FC\u3067\u3059\u3002<br>\u30E1\u30CB\u30E5\u30FC\u304B\u3089\u3084\u308A\u306A\u304A\u3057\u3066\u304F\u3060\u3055\u3044";
				} else if (O_result == 100002) //ID重複
				{
					message = "\u3053\u306E\u30E6\u30FC\u30B6ID\u306F\u65E2\u306B\u5B58\u5728\u3057\u3066\u3044\u307E\u3059\u3002<br>\u30E1\u30CB\u30E5\u30FC\u304B\u3089\u3084\u308A\u306A\u304A\u3057\u3066\u304F\u3060\u3055\u3044";
				} else if (O_result == 100003) //該当IDなし
				{
					message = "\u8A72\u5F53\u3059\u308B\u30E6\u30FC\u30B6ID\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002<br>\u30E1\u30CB\u30E5\u30FC\u304B\u3089\u3084\u308A\u306A\u304A\u3057\u3066\u304F\u3060\u3055\u3044";
				} else if (O_result == 100004) //シンタックスエラー（文字種,文字長）
				{
					message = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093";
				} else if (O_result == 100005) //DBアクセスエラー
				{
					message = "\u30BB\u30AD\u30E5\u30A2\u30C6\u30EB\u30D6\u30C3\u30AF\u30B5\u30FC\u30D0\u306B<br>\u30A2\u30AF\u30BB\u30B9\u3067\u304D\u307E\u305B\u3093\u3002<br>\u30E1\u30CB\u30E5\u30FC\u304B\u3089\u3084\u308A\u306A\u304A\u3057\u3066\u304F\u3060\u3055\u3044";
				} else if (O_result == 100006) //その他のエラー
				{
					message = "\u30BB\u30AD\u30E5\u30A2\u30C6\u30EB\u30D6\u30C3\u30AF\u30B5\u30FC\u30D0\u304C<br>\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3002<br>\u30E1\u30CB\u30E5\u30FC\u304B\u3089\u3084\u308A\u306A\u304A\u3057\u3066\u304F\u3060\u3055\u3044";
				} else {
				message = "\u30BB\u30AD\u30E5\u30A2\u30C6\u30EB\u30D6\u30C3\u30AF\u30B5\u30FC\u30D0\u304C<br>\u66F4\u65B0\u3067\u304D\u307E\u305B\u3093\u3002<br>\u30E1\u30CB\u30E5\u30FC\u304B\u3089\u3084\u308A\u306A\u304A\u3057\u3066\u304F\u3060\u3055\u3044";
			}

			H_secresult.result = false;
			H_secresult.message = message;
		}

		return H_secresult;
	}

};