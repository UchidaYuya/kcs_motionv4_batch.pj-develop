//
//ドコモ二段階認証
//
//更新履歴：<br>
//2018/05/25 森原浩司 作成
//
//@package script
//@author morihara<morihara@motion.ne.jp>
//@filesource
//@uses HttpClient
//@since 2018/05/25
//
//

require("HttpClient2.php");

//
//ログインに成功した
//
//
//
//ログインに失敗した
//
//
//
//通信エラーが発生した
//
//
//
//二段階認証が開始されていない
//
//
//
//ワンタイムパスワードが間違っている
//
//
//
//通信インスタンスを作る際のパラメータ
//
//@var array
//@access protected
//
//
//
//通信インスタンス
//
//@var HttpClient
//@access protected
//
//
//
//クランプログイン後の、ワンタイムパスワード登録時のarcv
//
//@var string
//@access protected
//
//
//
//二段階登録開始時の、ワンタイムパスワード登録時のupdauthkey
//
//@var string
//@access protected
//
//
//
//コンストラクタ
//
//@author morihara
//@since 2018/05/25
//
//@param array $H_param HTTP_Clientに渡すパラメータ
//@access public
//@return void
//
//
//
//通信インスタンスを作り直す
//
//@author morihara
//@since 2018/05/25
//
//@access public
//@return void
//
//
//
//デストラクタ
//
//@author morihara
//@since 2018/05/25
//
//@access public
//@return void
//
//
//
//クランプサイトにログインする
//
//@author morihara
//@since 2018/05/25
//
//@param string $id クランプID
//@param string $pass クランプパスワード
//@access public
//@return integer RESULT_*のいずれか
//
//
//public function loginClamp($id, $pass) {
//
//クランプサイトにログイン後に、ワンタイムパスワードの送信処理を行う
//
//@author morihara
//@since 2018/05/25
//
//@param string $onetime ワンタイムパスワード
//@param string $cookie クッキーを返す
//@access public
//@return integer RESULT_*のいずれか
//
//
//public function getCookie($onetime, &$cookie,$devicename = null ) {
//
//二段階認証を開始する
//
//@author morihara
//@since 2018/05/25
//
//@param string $id クランプID
//@param string $pass クランプパスワード
//@access public
//@return integer RESULT_*のいずれか(RESULT_PREだけは返さない)
//
//
//
//二段階認証を開始後に、ワンタイムパスワードの送信処理を行う
//
//@author morihara
//@since 2018/05/25
//
//@param string $onetime ワンタイムパスワード
//@access public
//@return boolean 登録に成功したらtrue
//
//
//
//サーバが返したレスポンスを分析して、特定のinputタグの値を取り出して返す
//
//@author morihara
//@since 2018/05/25
//
//@param string $key 探すinputタグのname
//@access protected
//@return string arcvの内容
//
//
//
//サーバが返したレスポンスを分析して、ログインに成功していたらtrueを返す
//
//@author morihara
//@since 2018/05/25
//
//@access protected
//@return boolean ログインに成功していたらtrue
//
//
//
//getBody
//どのようなレスポンスが返ってくるのか調べる
//@author date
//@since 2018/08/28
//
//@access public
//@return void
//
//
class DocomoTerminalRegistModel {
	static RESULT_LOGIN = 0;
	static RESULT_FAIL = 1;
	static RESULT_CONNECT = 2;
	static RESULT_PRE = 3;
	static RESULT_BADPASS = 4;
	static URL_CLAMP_TOP = "https://www.mydocomo.com/dcm/dfw/billing/bbilling/srv/ghadp001.srv";
	static URL_CLAMP_LOGIN = "https://cfg.smt.docomo.ne.jp/auth/cgi/idauth";
	static URL_REGIST_TOP = "https://id.smt.docomo.ne.jp/cgi7/id/menu";
	static URL_REGIST_LOGIN = "https://cfg.smt.docomo.ne.jp/auth/cgi/idauth";
	static URL_REGIST_MAIL = "https://id.smt.docomo.ne.jp/cgi7/id/otpconf";

	constructor(H_param: {} | any[]) //サーバのSSL証明書が古いので、証明書の検証は行わない
	{
		H_param.ssl_verify_peer = false;
		H_param.ssl_verify_host = false;
		this.H_param = H_param;
		this.recreate();
	}

	recreate() {
		this.O_client = new HTTP_Client(this.H_param);
	}

	__destruct() //何もしない
	{}

	loginClamp(id) //トップページにアクセスする
	{
		if (200 != this.O_client.get(DocomoTerminalRegistModel.URL_CLAMP_TOP)) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		var H_param = {
			arcv: this.getArcv(),
			requrl: DocomoTerminalRegistModel.URL_CLAMP_TOP,
			authid: id,
			persistent: "",
			subForm: "",
			funcid: 7
		};

		if (200 != this.O_client.post(DocomoTerminalRegistModel.URL_CLAMP_LOGIN, H_param)) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		if (!this.isLogin()) {
			return DocomoTerminalRegistModel.RESULT_FAIL;
		}

		var arcv = this.getArcv();

		if (!arcv.length) {
			return DocomoTerminalRegistModel.RESULT_PRE;
		}

		this.arcv = arcv;
		return DocomoTerminalRegistModel.RESULT_LOGIN;
	}

	getCookie(pass, onetime, cookie, devicename = undefined) {
		cookie = "";

		if (is_null(devicename)) {
			devicename = date("YmdHis\u767B\u9332");
		}

		var H_param = {
			arcv: this.arcv,
			requrl: DocomoTerminalRegistModel.URL_CLAMP_TOP,
			funcid: "1",
			rotpwd: onetime,
			deviceflg: "1",
			devicename: devicename,
			buid2: "",
			authpass: pass
		};

		if (200 != this.O_client.post(DocomoTerminalRegistModel.URL_CLAMP_LOGIN, H_param)) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		if (this.getArcv().length) {
			return DocomoTerminalRegistModel.RESULT_BADPASS;
		}

		var O_cookie = this.O_client.getCookieManager();

		if (!(undefined !== O_cookie)) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		var is_cookie = false;

		for (var H_cookie of Object.values(O_cookie.getCookies())) {
			if (undefined !== H_cookie.name && "g_smt_omitbrowser" === H_cookie.name && undefined !== H_cookie.value) {
				is_cookie = true;
				cookie = H_cookie.value;
			}
		}

		if (!is_cookie) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		return DocomoTerminalRegistModel.RESULT_LOGIN;
	}

	beginRegist(id, pass) //トップページにアクセスする
	{
		if (200 != this.O_client.get(DocomoTerminalRegistModel.URL_REGIST_TOP)) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		var H_param = {
			arcv: this.getArcv(),
			requrl: DocomoTerminalRegistModel.URL_REGIST_TOP,
			authid: id,
			authpass: pass,
			persistent: "",
			subForm: ""
		};

		if (200 != this.O_client.post(DocomoTerminalRegistModel.URL_CLAMP_LOGIN, H_param)) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		if (!this.isLogin()) {
			return DocomoTerminalRegistModel.RESULT_FAIL;
		}

		if (200 != this.O_client.get(DocomoTerminalRegistModel.URL_REGIST_MAIL)) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		H_param = {
			scrid: "SEC001",
			buid1: ""
		};

		if (200 != this.O_client.post(DocomoTerminalRegistModel.URL_REGIST_MAIL, H_param)) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		H_param = {
			otpavlset: "1",
			slctsend: "5",
			buid1: "",
			scrid: "SEC002",
			updauthkey: this.getArcv("updauthkey")
		};

		if (200 != this.O_client.post(DocomoTerminalRegistModel.URL_REGIST_MAIL, H_param)) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		this.updauthkey = this.getArcv("updauthkey");
		return DocomoTerminalRegistModel.RESULT_LOGIN;
	}

	endRegist(onetime) {
		var H_param = {
			buid1: "",
			onetimekey: onetime,
			scrid: "SEC003",
			updauthkey: this.updauthkey,
			otpavlset: "1",
			slctsend: "5"
		};

		if (200 != this.O_client.post(DocomoTerminalRegistModel.URL_REGIST_MAIL, H_param)) {
			return DocomoTerminalRegistModel.RESULT_CONNECT;
		}

		var H_response = this.O_client.currentResponse();
		var body = H_response.body;

		if (false !== strpos(body, "\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u30B3\u30FC\u30C9\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059\u3002")) {
			return DocomoTerminalRegistModel.RESULT_BADPASS;
		}

		return DocomoTerminalRegistModel.RESULT_LOGIN;
	}

	getArcv(key = "arcv") {
		var H_response = this.O_client.currentResponse();
		var body = H_response.body;
		var A_match = Array();

		if (!preg_match("/name=\"" + key + "\" value=\"([^\"]+)\"/", body, A_match)) {
			return "";
		}

		if (A_match.length < 2) {
			return "";
		}

		return A_match[1];
	}

	isLogin() {
		var O_cookie = this.O_client.getCookieManager();

		if (!(undefined !== O_cookie)) {
			return false;
		}

		var is_cookie = false;

		for (var H_cookie of Object.values(O_cookie.getCookies())) {
			for (var key in H_cookie) {
				var value = H_cookie[key];

				if ("name" === key) {
					if ("chkck" === value) //chkckは、ログイン失敗時も存在するので無視する
						{} else //ログインできた
						{
							is_cookie = true;
						}
				}
			}
		}

		if (!is_cookie) {
			return false;
		}

		return true;
	}

	getBody() {
		var H_response = this.O_client.currentResponse();
		var body = H_response.body;
	}

};