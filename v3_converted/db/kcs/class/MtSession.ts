//
//セッションの一括管理ユーティリティ
//
//更新履歴：<br>
//2008/03/10 上杉勝史 作成
//
//@package Base
//@subpackage Session
//@author katsushi
//@filesource
//@since 2008/03/10
//
//
//
//セッションの一括管理ユーティリティ<br>
//$_SESSIONを読み書きする
//
//@package Base
//@subpackage Session
//@author katsushi
//@filesource
//@since 2008/03/10
//
//使用例<br>
//<code>
//require_once("MtSession.php");
//$O_Sess =& MtSession::singleton();
//echo $O_Sess->pactid;			// 実際の値は$_SESSION["pactid"]
//echo $O_Sess->getSelf("limit");	// 実際の値は$_SESSION[$_SERVER["PHP_SELF"]]["limit"]
//</code>
//

require("MtOutput.php");

//
//インスタンス生成確認用
//
//@var object
//@access private
//@static
//
//
//コンストラクタ<br>
//privateなのでnewは出来ない（必ずsingletonを呼ぶ）
//
//@author katsushi
//@since 2008/03/10
//
//@access private
//@return void
//
//
//singletonパターン<br>
//必ず一つだけしかインスタンスを生成しない為の実装
//
//@author katsushi
//@since 2008/02/05
//
//@static
//@access public
//@return self::$O_Instance
//
//
//__get（特殊メソッド）
//
//存在しないメンバー変数にアクセスされた時に呼ばれる<br>
//グローバルセッションはメンバー変数的に扱う
//
//@author katsushi
//@since 2008/03/10
//
//@final
//@param string $key
//@access public
//@return mixed 対応するメンバー変数の値
//@uses MtExcept
//
//
//指定されたキーのセルフセッションを返す
//
//@author katsushi
//@since 2008/03/10
//
//@param string $key
//@access public
//@return mixed
//
//
//全てのセルフセッションを返す
//
//@author katsushi
//@since 2008/03/11
//
//@access public
//@return mixed
//
//
//指定されたキーのパブリックセッションを返す<br>
//※先頭に「/」が付いているセッションキーを指定すること
//
//@author katsushi
//@since 2008/03/10
//
//@param string $key
//@access public
//@return mixed
//
//
//パブリックセッションを全て連想配列で返す
//
//@author katsushi
//@since 2008/03/11
//
//@access public
//@return array
//
//
//指定されたキーのグローバルセッションに書き込む
//
//@author katsushi
//@since 2008/03/10
//
//@param string $key
//@param mixed $value
//@access public
//@return void
//
//
//セルフセッションの特定のキーに書き込む
//
//@author katsushi
//@since 2008/03/11
//
//@param string $key
//@param mixed $value
//@access public
//@return void
//
//
//セルフセッションに書き込む
//
//@author katsushi
//@since 2008/03/11
//
//@param mixed $value
//@access public
//@return void
//
//
//パブリックセッションに書き込む
//
//@author katsushi
//@since 2008/03/11
//
//@param string $key
//@param mixed $value
//@access public
//@return void
//
//
//全てのセッションを消す
//
//@author katsushi
//@since 2008/03/10
//
//@access public
//@return void
//
//
//グローバルセッション以外を消す
//
//@author katsushi
//@since 2008/03/10
//
//@access public
//@return void
//
//
//$_SERVER["PHP_SELF"]セッションを消す
//
//@author katsushi
//@since 2008/03/11
//
//@access public
//@return void
//
//
//指定されたキーのセルフセッションを消す
//
//@author katsushi
//@since 2008/04/01
//
//@param string $key
//@access public
//@return void
//
//
//指定されたキー以外のセルフセッションを消す
//
//@author katsushi
//@since 2008/04/01
//
//@param string $key
//@access public
//@return void
//
//
//指定されたキーのパブリックセッションを消す
//
//@author katsushi
//@since 2008/03/11
//
//@access public
//@return void
//
//
//指定された複数キーのパブリックセッションを消す
//
//@author katsushi
//@since 2008/03/14
//
//@param array $A_key
//@access public
//@return void
//
//
//指定されたキー以外のパブリックセッションを消す
//
//@author katsushi
//@since 2008/03/11
//
//@param string $key
//@access public
//@return void
//
//
//指定された複数キー以外のパブリックセッションを消す
//
//@author katsushi
//@since 2008/03/14
//
//@param array $A_key
//@access public
//@return void
//
//
//セッションをシリアライズして返す<br>
//Actlogでセッション値をそのまま保存する際に使用
//
//@author nakanita
//@since 2008/04/02
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author katsushi
//@since 2008/03/14
//
//@access public
//@return void
//
class MtSession {
	static O_Instance = undefined;

	constructor() {
		if (undefined !== _SESSION == false) {
			session_start();
		}

		if (true == (undefined !== _SESSION.pacttype)) {
			global.PACTTYPE = _SESSION.pacttype;
		}
	}

	static singleton() //インスタンスが既に生成されていない場合のみインスタンス生成
	{
		if (MtSession.O_Instance == undefined) {
			MtSession.O_Instance = new MtSession();
		}

		return MtSession.O_Instance;
	}

	__get(key) {
		if (undefined !== _SESSION[key] == false) //MtExcept::raise("指定されたグローバルセッションが見つかりません(" . $key . ")");
			{
				return undefined;
			}

		return _SESSION[key];
	}

	getSelf(key) {
		if (key == "") {
			MtExcept.raise("MtSession::getSelf: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (undefined !== _SESSION[_SERVER.PHP_SELF][key] == false) {
			return undefined;
		}

		return _SESSION[_SERVER.PHP_SELF][key];
	}

	getSelfAll() {
		if (undefined !== _SESSION[_SERVER.PHP_SELF] == false) {
			return undefined;
		}

		return _SESSION[_SERVER.PHP_SELF];
	}

	getPub(key) {
		if (key == "") {
			MtExcept.raise("MtSession::getPub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (strpos(key, "/") !== 0) {
			MtExcept.raise("MtSession::getPub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u300C/\u300D\u304B\u3089\u59CB\u307E\u3063\u3066\u3044\u307E\u305B\u3093\uFF08" + key + "\uFF09");
		}

		if (undefined !== _SESSION[key] == false) {
			return undefined;
		}

		return _SESSION[key];
	}

	getPubAll() {
		var H_pub = Array();

		for (var key in _SESSION) {
			var value = _SESSION[key];

			if (strpos(key, "/") === 0 && key != _SERVER.PHP_SELF) {
				H_pub[key] = value;
			}
		}

		return H_pub;
	}

	setGlobal(key, value = undefined) {
		if (key == "") {
			MtExcept.raise("MtSession::setGlobal: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (strpos(key, "/") === 0) {
			MtExcept.raise("MtSession::setGlobal: \u30B0\u30ED\u30FC\u30D0\u30EB\u30BB\u30C3\u30B7\u30E7\u30F3\u306F\u30AD\u30FC\u304C\u300C/\u300D\u304B\u3089\u59CB\u307E\u3063\u3066\u306F\u3044\u3051\u307E\u305B\u3093\uFF08" + key + "\uFF09");
		}

		_SESSION[key] = value;
	}

	setSelf(key, value = undefined) {
		if (key == "") {
			MtExcept.raise("MtSession::setSelf: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (undefined !== _SESSION[_SERVER.PHP_SELF] == false) {
			_SESSION[_SERVER.PHP_SELF] = Array();
		}

		_SESSION[_SERVER.PHP_SELF][key] = value;
	}

	setSelfAll(value = undefined) {
		_SESSION[_SERVER.PHP_SELF] = value;
	}

	setPub(key, value = undefined) {
		if (key == "") {
			MtExcept.raise("MtSession::setPub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (strpos(key, "/") !== 0) {
			MtExcept.raise("MtSession::setPub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u300C/\u300D\u304B\u3089\u59CB\u307E\u3063\u3066\u3044\u307E\u305B\u3093\uFF08" + key + "\uFF09");
		}

		_SESSION[key] = value;
	}

	clearSessionAll() {
		GLOBALS.GROUPID = this.groupid;
		session_unset();
	}

	clearSessionMenu() //これは戻すべき？
	{
		for (var key in _SESSION) {
			var value = _SESSION[key];

			if (strpos(key, "/") === 0) {
				delete _SESSION[key];
			}
		}

		if (undefined !== _SESSION.current_postid == true) {
			_SESSION.current_postid = _SESSION.postid;
		}

		if (undefined !== _SESSION.current_postname == true) {
			_SESSION.current_postname = _SESSION.postname;
		}
	}

	clearSessionSelf() {
		delete _SESSION[_SERVER.PHP_SELF];
	}

	clearSessionKeySelf(key) {
		if (key == "") {
			MtExcept.raise("MtSession::clearSessionKeySelf: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		delete _SESSION[_SERVER.PHP_SELF][key];
	}

	clearSessionExcludeKeySelf(key) {
		if (key == "") {
			MtExcept.raise("MtSession::clearSessionExcludeKeySelf: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		_SESSION[_SERVER.PHP_SELF] = _SESSION[_SERVER.PHP_SELF][key];
	}

	clearSessionPub(key) {
		if (key == "") {
			MtExcept.raise("MtSession::clearSessionPub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (strpos(key, "/") !== 0) {
			MtExcept.raise("MtSession::clearSessionPub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u300C/\u300D\u304B\u3089\u59CB\u307E\u3063\u3066\u3044\u307E\u305B\u3093\uFF08" + key + "\uFF09");
		}

		delete _SESSION[key];
	}

	clearSessionListPub(A_key: {} | any[]) {
		var keycnt = A_key.length;

		if (keycnt < 1) {
			MtExcept.raise("MtSession::clearSessionListPub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u30EA\u30B9\u30C8\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		for (var i = 0; i < keycnt; i++) {
			if (strpos(A_key[i], "/") !== 0) {
				MtExcept.raise("MtSession::clearSessionListPub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u300C/\u300D\u304B\u3089\u59CB\u307E\u3063\u3066\u3044\u307E\u305B\u3093\uFF08" + A_key[i] + "\uFF09");
			}
		}

		for (var sesskey in _SESSION) //「/」から始まっていないかセルフセッションの場合はスルーする
		{
			var value = _SESSION[sesskey];

			if (strpos(sesskey, "/") !== 0 || sesskey == _SERVER.PHP_SELF) {
				continue;
			}

			if (-1 !== A_key.indexOf(sesskey) == true) {
				delete _SESSION[sesskey];
			}
		}
	}

	clearSessionExcludePub(key) {
		if (key == "") {
			MtExcept.raise("MtSession::clearSessionExcludePub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		if (strpos(key, "/") !== 0) {
			MtExcept.raise("MtSession::clearSessionExcludePub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u300C/\u300D\u304B\u3089\u59CB\u307E\u3063\u3066\u3044\u307E\u305B\u3093\uFF08" + key + "\uFF09");
		}

		for (var sesskey in _SESSION) {
			var value = _SESSION[sesskey];

			if (strpos(sesskey, "/") === 0 && sesskey != _SERVER.PHP_SELF && sesskey != key) {
				delete _SESSION[sesskey];
			}
		}
	}

	clearSessionExcludeListPub(A_key: {} | any[]) {
		var keycnt = A_key.length;

		if (keycnt < 1) {
			MtExcept.raise("MtSession::clearSessionExcludeListPub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u30EA\u30B9\u30C8\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
		}

		for (var i = 0; i < keycnt; i++) {
			if (strpos(A_key[i], "/") !== 0) {
				MtExcept.raise("MtSession::clearSessionExcludeListPub: \u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u30AD\u30FC\u304C\u300C/\u300D\u304B\u3089\u59CB\u307E\u3063\u3066\u3044\u307E\u305B\u3093\uFF08" + A_key[i] + "\uFF09");
			}
		}

		for (var sesskey in _SESSION) //「/」から始まっていないかセルフセッションの場合はスルーする
		{
			var value = _SESSION[sesskey];

			if (strpos(sesskey, "/") !== 0 || sesskey == _SERVER.PHP_SELF) {
				continue;
			}

			if (-1 !== A_key.indexOf(sesskey) == false) {
				delete _SESSION[sesskey];
			}
		}
	}

	getSerialize() {
		return serialize(_SESSION);
	}

	__destruct() {}

};