//
//CSRF用ユニーク文字列の一括管理ユーティリティ
//
//更新履歴：<br>
//2012/04/25 宝子山浩平 作成
//
//@package Base
//@subpackage UniqueString
//@author houshiyama
//@filesource
//@since 2012/04/25
//
//
//
//CSRF用ユニーク文字列の一括管理ユーティリティ<br>
//
//@package Base
//@subpackage UniqueString
//@author houshiyama
//@filesource
//@since 2012/04/25
//

require("MtOutput.php");

require("model/UniqueStringModel.php");

//
//インスタンス生成確認用
//
//@var object
//@access private
//@static
//
//
//_Out
//
//@var mobjectixed
//@access private
//
//
//コンストラクタ<br>
//privateなのでnewは出来ない（必ずsingletonを呼ぶ）
//
//@author houshiyama
//@since 2012/04/25
//
//@access private
//@return void
//
//
//singletonパターン<br>
//必ず一つだけしかインスタンスを生成しない為の実装
//
//@author houshiyama
//@since 2012/04/25
//
//@static
//@access public
//@return self::$_Instance
//
//
//setString
//
//@author web
//@since 2012/05/01
//
//@static
//@access public
//@return void
//
//
//セッションIDから行取得
//
//@author web
//@since 2012/05/02
//
//@static
//@access public
//@return void
//
//
//ユニークIDから行取得
//
//@author web
//@since 2012/05/02
//
//@static
//@access public
//@return void
//
//
//正当性チェック
//
//@author web
//@since 2012/05/07
//
//@param mixed $uniqueid
//@access public
//@return void
//
//
//deleteRowWrapper
//
//@author web
//@since 2012/06/20
//
//@access public
//@return void
//
//
//新しくユニーク文字列を生成
//
//@author web
//@since 2012/05/07
//
//@access public
//@return void
//
//
//sessionidに結びついたuniqueidがあればそれを返す
//なければ新しく作って返す
//
//@author web
//@since 2012/06/25
//
//@access public
//@return void
//
//
//getCol
//
//@author web
//@since 2012/05/07
//
//@param mixed $col
//@access public
//@return void
//
//
//checkExists
//
//@author web
//@since 2012/05/02
//
//@access private
//@return void
//
//
//UniqueStringModel取得
//
//@author web
//@since 2012/05/02
//
//@access private
//@return void
//
//
//_getUniqueString
//
//@author web
//@since 2012/05/02
//
//@access private
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2012/04/25
//
//@access public
//@return void
//
class MtUniqueString {
	static _Instance = undefined;

	constructor() //アウトプット
	{
		this._Out = MtOutput.singleton();
	}

	static singleton() //インスタンスが既に生成されていない場合のみインスタンス生成
	{
		if (MtUniqueString._Instance == undefined) {
			MtUniqueString._Instance = new MtUniqueString();
		}

		return MtUniqueString._Instance;
	}

	setString() {
		var sessionid = session_id();

		if (!this._checkExists()) {
			this._getUniqueStringModel().insertRow(sessionid, this._getUniqueString());
		} else {
			this._getUniqueStringModel().updateRow(sessionid, this._getUniqueString());
		}
	}

	getRowFromSessionId() {
		var sessionid = session_id();

		var res = this._getUniqueStringModel().getRowFromSessionId(sessionid);

		if (!res) {
			this.setString();
			res = this._getUniqueStringModel().getRowFromSessionId(sessionid);
		}

		return res;
	}

	getRowFromUniqueId(uniqueid) {
		var res = this._getUniqueStringModel().getRowFromUniqueId(uniqueid);

		return res;
	}

	validate(uniqueid, url_back = "/Menu/menu.php") {
		if (is_null(uniqueid)) {
			this._Out.errorOut(42, "\u30D5\u30A9\u30FC\u30E0\u306BCSRF\u7528\u6587\u5B57\u5217\u304C\u306A\u3044", false, url_back);
		}

		var res = this.getRowFromUniqueId(uniqueid);

		if (!res) {
			this._Out.errorOut(42, "DB\u306B\u672A\u767B\u9332\u306ECSRF\u7528\u6587\u5B57\u5217", false, url_back);
		}

		var dbsessionid = this.getCol("sessionid");
		var sessionid = session_id();

		if (dbsessionid !== sessionid) {
			this._Out.errorOut(42, "sessionid\u304C\u4E00\u81F4\u3057\u3066\u3044\u306A\u3044", false, url_back);
		}

		this._getUniqueStringModel().deleteRow(sessionid);

		return true;
	}

	deleteRowWrapper() {
		this._getUniqueStringModel().deleteRow(session_id());
	}

	getNewUniqueId() {
		this.setString();
		return this.getCol("uniqueid");
	}

	getInheritingUniqueId() {
		var res = this.getRowFromSessionId();

		if (!res) {
			var uniqueId = this.getNewUniqueId();
		} else {
			uniqueId = res.uniqueid;
		}

		return uniqueId;
	}

	getCol(col) {
		if (is_null(col)) {
			echo("\u30AB\u30E9\u30E0\u304C\u6307\u5B9A\u3055\u308C\u3066\u307E\u305B\u3093");
			throw die();
		}

		var res = this.getRowFromSessionId();

		if (!(col in res)) {
			echo(col + "\u3068\u3044\u3046\u30AB\u30E9\u30E0\u306F\u3042\u308A\u307E\u305B\u3093");
			throw die();
		}

		return res[col];
	}

	_checkExists() {
		if (is_null(this._sessionId)) {
			this._sessionId = session_id();
		}

		var model = this._getUniqueStringModel();

		var res = model.getRowFromSessionId(this._sessionId);

		if (!res) {
			return false;
		} else {
			return true;
		}
	}

	_getUniqueStringModel() {
		if (!(this._model instanceof UniqueStringModel)) {
			this._model = new UniqueStringModel();
		}

		return this._model;
	}

	_getUniqueString() {
		var base = uniqid(_SERVER.PHP_SELF + session_id(), true);
		var string = sha1(base);
		return string;
	}

	__destruct() {}

};