//
//Felicaカード登録View
//
//更新履歴：<br>
//2010/05/13 宮澤龍彦 作成
//
//@package Clouds
//@subpackage View
//@author miyazawa
//@since 2010/04/27
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//Felicaカード登録View
//
//@package Clouds
//@subpackage View
//@author miyazawa
//@since 2010/04/27
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("HTTP/Client.php");

//
//ディレクトリ名
//
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//
//日付
//
//@var mixed
//@access protected
//
//
//HTTP_Clientオブジェクト
//
//@var object
//@access private
//
//
//
//HTTP_Clientオブジェクトのオプション
//
//@var mixed
//@access private
//
//
//
//コンストラクタ <br>
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return void
//
//
//CGIパラメータのチェックを配列に入れる<br>
//
//@author houshiyama
//@since 2008/03/13
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return mixed
//
//
//パラメータのエラーチェック
//
//@author miyazawa
//@since 2010/04/27
//
//@access protected
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
//
//クラウズへのHTTPの送信処理
//
//@author miyazawa
//@since 2010/04/27
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
//
//デストラクタ
//
//@author miyazawa
//@since 2010/04/27
//
//@access public
//@return void
//
class FelicaAddView extends ViewSmarty {
	static PUB = "/Clouds";

	constructor() //接続オプション設定
	//オブジェクト生成
	//if( is_numeric( $this->O_Sess->pactid ) == true ){
	//			$this->O_Auth = MtAuthority::singleton( $this->O_Sess->pactid );
	//		}
	//		else{
	//			$this->errorOut( 10, "セッションにpactidが無い", false );
	//		}
	{
		this.O_Sess = MtSession.singleton();
		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.O_Set = MtSetting.singleton();
		this.Now = this.getDateUtil().getNow();
		this.Today = this.getDateUtil().getToday();
		this.A_Time = split("-| |:", this.Now);
		this.YM = this.A_Time[0] + this.A_Time[1];
		this.setClientOption({
			timeout: 10,
			allowRedirects: false
		});
		this.O_client = new HTTP_Client(this.H_client_option);
	}

	checkCGIParam() //CGIパラメータを見る
	{
		if (true == Array.isArray(_POST)) //iccardcoidも入れておく（1決め打ち）
			{
				for (var key in _POST) {
					var val = _POST[key];
					this.H_View[key] = val;
				}

				this.H_View.iccardcoid = 1;
			}
	}

	get_View() {
		return this.H_View;
	}

	checkParamError() //最低限必要なパラメータが無ければエラー
	{
		if (undefined !== this.H_View.pactid == false || undefined == this.H_View.pactid || (undefined !== this.H_View.employee == false || undefined == this.H_View.employee) || undefined !== this.H_View.cid == false || undefined == this.H_View.cid) {
			var message = mb_convert_encoding("\u5165\u529B\u5024\u304C\u4E0D\u8DB3\u3057\u3066\u3044\u307E\u3059", "UTF-8");
			echo("r=1&e=101&m=" + message);
			throw die();
		}
	}

	setClientOption(H_client_option: {} | any[]) {
		this.H_client_option = H_client_option;
	}

	sendToClouds(url, api_key, H_param: {} | any[] = Array()) //返値を受け取る
	{
		var H_dl = Array();
		var param_str = "";
		param_str += "key=" + api_key + "&";
		param_str += "ver=1.0&";
		param_str += "card=" + H_param.cid + "&";
		param_str += "group=" + H_param.pactid;
		var send_url = url + param_str;
		var O_req = new HTTP_Request(send_url);
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

	__destruct() {
		super.__destruct();
	}

};