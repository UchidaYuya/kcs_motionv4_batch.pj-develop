//
//DB基本クラス
//
//データベースへのインターフェイスライブラリ<br>
//PEAR MDB2を使用
//
//更新履歴：<br>
//2008/02/04 上杉勝史 作成<br>
//2008/09/03 上杉勝史 dbQuoteの挙動を変更（スタックしてSQLを出力する）<br>
//
//@package Base
//@subpackage DB
//@filesource
//@author katsushi
//@since 2008/02/04
//
//
//
//DB基本クラス
//
//@package Base
//@subpackage DB
//@access public
//@author katsushi
//@since 2008/02/04
//@uses MDB2
//@uses Log
//@uses MtExcept
//@uses MtSetting
//

require("MDB2.php");

require("MtSetting.php");

require("MtExcept.php");

require("MtOutput.php");

require("Log.php");

//
//インスタンス
//
//@var object
//@access private
//@static
//
//
//DBハンドル
//
//@var object
//@access private
//
//
//DSN（データソースネーム）
//
//@var string
//@access private
//
//
//DBのリザルトデータ形式設定
//
//@var boolean
//@access private
//
//
//設定一覧
//
//@var object
//@access private
//
//
//MtExceptに渡す引数（固定）
//
//@var array
//@access private
//
//
//ログオプション
//
//@var array
//@access private
//
//
//トレースログオブジェクト
//
//@var object
//@access private
//
//
//デバッグログオブジェクト
//
//@var object
//@access private
//
//
//リカバリーログオブジェクト
//
//@var object
//@access private
//
//
//SQLのカウンター
//
//@var integer
//@access private
//
//
//MtOutputオブジェクト
//
//@var object
//@access private
//
//
//dbQuoteのエラースタック
//
//@var array
//@access private
//
//
//コンストラクタ
//
//DBへの接続ハンドルを取得する
//
//@author katsushi
//@since 2008/02/06
//
//@param boolean $transaction
//@access public
//@return void
//@uses MtSetting
//@uses MDB2
//@uses MtExcept::raise
//
//
//singletonパターン<br>
//必ず一つだけしかインスタンスを生成しない為に実装
//
//@author katsushi
//@since 2008/03/14
//
//@static
//@access public
//@return void
//
//
//データベースハンドル
//
//@author katsushi
//@since 2008/03/06
//
//@final
//@access protected
//@return object
//
//
//DBのネイティブ接続リソースを取得する
//
//@author katsushi
//@since 2008/02/19
//
//@access public
//@return resource
//
//
//DBのリザルトデータ形式設定の変更
//
//@author katsushi
//@since 2008/02/10
//
//@param mixed $types
//@access public
//@return void
//
//
//DBのリザルトデータ形式設定の変更
//
//@author katsushi
//@since 2008/02/10
//
//@param mixed $types
//@access public
//@return void
//
//
//DBのオプション設定
//
//MDB2のsetOption()を呼び出す
//
//@author katsushi
//@since 2008/02/10
//
//@param string $option
//@param mixed $value
//@access public
//@return MDB2_OK
//@uses MDB2::setOption
//@uses exceptRaise
//
//
//DBのオプション設定の取得
//
//MDB2のgetOption()を呼び出す
//
//@author katsushi
//@since 2008/02/10
//
//@param string $option
//@access public
//@return mixed
//@uses MDB2::getOption
//@uses exceptRaise
//
//
//トランザクションの開始
//
//MDB2のbeginTransaction()を呼び出す
//
//@author katsushi
//@since 2008/02/08
//
//@access public
//@return MDB2_OK
//@uses MDB2::beginTransaction
//@uses exceptRaise
//
//
//ネストトランザクションの開始
//
//MDB2のbeginNestedTransaction()を呼び出す
//
//@author katsushi
//@since 2008/02/13
//
//@access public
//@return string $savepoint
//@uses MDB2::beginNestedTransaction
//@uses exceptRaise
//
//
//トランザクション中か調べる
//
//@author katsushi
//@since 2008/02/13
//
//@param $ignore_nested
//@access public
//@return intbool true or false or ネスト階層
//@uses MDB2::inTransaction
//
//
//モジュールの読み込み
//
//MDB2のloadModule()を呼び出す
//
//@author katsushi
//@since 2008/02/07
//
//@param string $module
//@param string $property
//@param string $phptype_specific
//@access public
//@return void
//@uses MDB2::loadModule
//@uses exceptRaise
//
//
//モジュールが読み込み済みかどうかを調べる
//
//@author katsushi
//@since 2008/02/10
//
//@param string $module
//@access public
//@return boolean
//
//
//データベースの接続解除
//
//MDB2のdisconnect()を呼び出す
//
//@author katsushi
//@since 2008/02/10
//
//@access public
//@return void
//@uses MDB2::disconnect
//
//
//データベースのCOMMIT
//
//MDB2のcommit()を呼び出す
//
//@author katsushi
//@since 2008/02/10
//
//@param string $savepoint
//@access public
//@return void
//@uses MDB2::commit
//@uses exceptRaise
//
//
//トランザクションのセーブポイントまでROLLBACK
//
//MDB2のrollback()を呼び出す
//
//@author katsushi
//@since 2008/02/10
//
//@param string $savepoint
//@access public
//@return void
//@uses MDB2::rollback
//
//
//トランザクション中の場合すべてのトランザクションのCOMMIT
//
//@author katsushi
//@since 2008/02/22
//
//@access public
//@return void
//@uses commit()
//
//
//トランザクション中の場合すべてのトランザクションのROLLBACK
//
//@author katsushi
//@since 2008/02/22
//
//@access public
//@return void
//@uses rollback()
//
//
//直近のトランザクション（ネスト含む）のCOMMIT
//
//@author katsushi
//@since 2008/02/22
//
//@access public
//@return void
//@uses completeNestedTransaction()
//
//
//直近のトランザクション（ネスト含む）のROLLBACK
//
//@author katsushi
//@since 2008/02/22
//
//@access public
//@return void
//@uses completeNestedTransaction()
//
//
//直近のネストトランザクションのcommit/rollback
//
//@author katsushi
//@since 2008/02/22
//
//@param boolean $force_rollback false/commit true/rollback
//@access protected
//@return void
//@uses MDB2::completeNestedTransaction
//
//
//ネストトランザクションのカウンターをリセットする
//
//@author katsushi
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//ロールバックを行ってMtExceptにメッセージを投げる
//
//@author katsushi
//@since 2008/02/13
//
//@param string $msg
//@access protected
//@return void
//@uses MtExcept::raise
//@uses rollbackAll()
//
//
//トレースログの出力
//
//@author katsushi
//@since 2008/02/12
//
//@param mixed $msg
//@access protected
//@return void
//
//
//クエリーの種類を判定する（更新系、参照系）
//
//@author katsushi
//@since 2008/02/12
//
//@param string $sql
//@access protected
//@return string "select" or "modify"
//@uses exceptRaise
//
//
//参照系SQLを実行してMDB2リザルトオブジェクトを取得
//
//MDB2のquery()を呼び出す
//更新系のSQLはexec()を使用すること
//
//@author katsushi
//@since 2008/02/08
//
//@param string $sql
//@param boolean $errchk default true
//@access public
//@return MDB2リザルトオブジェクト
//@uses MDB2::query
//@uses getQueryType
//@uses traceOut
//@uses exceptRaise
//
//
//更新系SQLを実行して更新した行数を返す
//
//MDB2のexec()を呼び出す
//参照系のSQLはquery()を使用すること
//
//@author katsushi
//@since 2008/02/11
//
//@param string $sql
//@param boolean $errchk
//@access public
//@return integer
//@uses MDB2::exec
//@uses traceOut
//@uses exceptRaise
//
//
//SQLを実行し、結果の列、行の2次元配列を取得
//
//MDB2のqueryAll(MDB2_FETCHMODE_ORDERED)を呼び出す
//オプションにより色々な形式で取得できる
//
//@author katsushi
//@since 2008/02/10
//
//@param string $sql
//@param integer $fetchmode default MDB2_FETCHMODE_ORDERED
//@param boolean $hashkey default false
//@access public
//@return array
//@uses MDB2::queryAll
//@uses getQueryType
//@uses traceOut
//@uses exceptRaise
//
//
//SQLを実行し、結果の1行を配列で取得<br>
//複数行を取得した場合も1行目のみしか取得できない
//
//MDB2のqueryRow()を呼び出す
//
//@author katsushi
//@since 2008/02/10
//
//@param string $sql
//@param integer $fetchmode default MDB2_FETCHMODE_ORDERED
//@access public
//@return array
//@uses MDB2::queryRow
//@uses getQueryType
//@uses traceOut
//@uses exceptRaise
//
//
//SQLを実行し、結果の1行目1列目を取得<br>
//複数行複数列を取得した場合も1行目1列目のみしか取得できない
//
//MDB2のqueryOne()を呼び出す
//
//@author katsushi
//@since 2008/02/10
//
//@param string $sql
//@access public
//@return mixed
//@uses MDB2::queryOne
//@uses getQueryType
//@uses traceOut
//@uses exceptRaise
//
//
//SQLを実行し、結果の$col列目を配列として取得<br>
//複数列を取得した場合も$col列目のみしか取得できない
//
//MDB2のqueryCol()を呼び出す
//
//@author katsushi
//@since 2008/02/10
//
//@param string $sql
//@param integer $col default = 0
//@access public
//@return array
//@uses MDB2::queryCol
//@uses getQueryType
//@uses traceOut
//@uses exceptRaise
//
//
//SQLを実行し、結果の列（連想配列）、行（配列）の2次元配列を取得
//
//queryAll()をオプションを付けて呼び出す<br>
//queryAll($sql, MDB2_FETCHMODE_ASSOC, false)　と同じ
//
//@author katsushi
//@since 2008/02/10
//
//@param string $sql
//@access public
//@return array
//@uses queryAll
//
//
//SQLを実行し、第1カラムの値をキーに残りの値を配列として返す
//
//queryAll()をオプションを付けて呼び出す<br>
//queryAll($sql, MDB2_FETCHMODE_ORDERED, true)　と同じ
//
//@author katsushi
//@since 2008/02/11
//
//@param string $sql
//@access public
//@return array
//@uses queryAll
//
//
//SQLを実行し、第1カラムの値をキーに残りの値を連想配列として返す
//
//queryAll()をオプションを付けて呼び出す<br>
//queryAll($sql, MDB2_FETCHMODE_ASSOC, true)　と同じ
//
//@author katsushi
//@since 2008/02/11
//
//@param string $sql
//@access public
//@return array
//@uses queryAll
//
//
//SQLを実行し、結果の1行をカラム名をキーにした連想配列で取得<br>
//複数行を取得した場合も1行目のみしか取得できない
//
//queryRow()をオプションを付けて呼び出す<br>
//queryRow($sql, MDB2_FETCHMODE_ASSOC)　と同じ
//
//@author katsushi
//@since 2008/02/11
//
//@param string $sql
//@access public
//@return array
//@uses queryRow
//
//
//文字列をSQLエスケープする
//
//@author katsushi
//@since 2008/02/11
//
//@param string $value
//@param boolean $escape_wildcards default false
//@access public
//@return string
//@uses MDB2::escape
//
//
//シーケンスの次の番号を取得する
//
//MDB2のnextID()を呼び出す
//
//@author katsushi
//@since 2008/02/11
//
//@param string $seqname
//@access public
//@return integer
//@uses MDB2::nextID
//@uses traceOut
//@uses exceptRaise
//
//
//次に発行するSQLにLimit,Offsetを制限する
//
//MDB2のsetLimit()を呼び出す
//SQLが発行されるとこの設定はリセットされる
//
//@author katsushi
//@since 2008/02/11
//
//@param integer $limit
//@param integer $offset
//@access public
//@return void
//@uses MDB2::setLimit
//@uses exceptRaise
//
//
//SQLを事前にコンパイルしたSQLステートメントを取得する
//
//MDB2のprepare()を呼び出す
//
//@author katsushi
//@since 2008/02/11
//
//@param string $sql
//@access public
//@return mixed
//@uses MDB2::prepare
//@uses traceOut
//@uses exceptRaise
//
//
//事前にコンパイルしたSQLステートメントに対し配列を渡し実行する
//
//MDB2のexecute()を呼び出す
//
//@author katsushi
//@since 2008/02/11
//
//@param mixed $O_sql コンパイル済SQL
//@param array $A_value プレースホルダ置換用配列
//@param boolean $errchk
//@access public
//@return mixed
//@uses MDB2::execute
//@uses traceOut
//@uses exceptRaise
//
//
//事前にコンパイルしたSQLステートメントに対し配列を渡し実行する
//
//MDB2のexecuteMultiple()を呼び出す
//
//@author katsushi
//@since 2008/02/11
//
//@param mixed $O_sql コンパイル済SQL
//@param array $A_value プレースホルダ置換用2次元配列
//@param boolean $errchk
//@access public
//@return mixed
//@uses MDB2::execute
//@uses traceOut
//@uses exceptRaise
//
//
//配列からテーブルにCOPY文で挿入する
//※pg_copy_fromを使用しているためPostgresqlのみ
//
//@author katsushi
//@since 2008/03/04
//
//@param string $tablename
//@param array $A_rows
//@param string $delimiter default \t(タブ)
//@param string $null_as defult \N(null)
//@access public
//@return boolean
//
//
//pgCopyFromArray
//
//@author katsushi
//@since 2008/04/04
//
//@param string $tablename
//@param array $A_rows
//@param string $delimiter default \t(タブ)
//@param string $null_as defult \N(null)
//@access public
//@return void
//
//
//SQLカウンターの取得
//
//@author katsushi
//@since 2008/02/19
//
//@access public
//@return integer
//
//
//__call 特殊メソッド
//
//その他MDB2のメソッドを呼び出す（非常用）
//
//@author katsushi
//@since 2008/02/12
//
//@param string $funcname
//@param mixed $args
//@access public
//@return mixed
//@uses exceptRaise
//
//
//resetDbQuoteError
//
//@author katsushi
//@since 2008/09/03
//
//@access public
//@return void
//
//
//addDbQuoteError
//
//@author katsushi
//@since 2008/09/03
//
//@param string $err
//@access protected
//@return void
//
//
//getDbQuoteError
//
//@author katsushi
//@since 2008/09/03
//
//@access protected
//@return void
//
//
//getDbQuoteErrorCount
//
//@author katsushi
//@since 2008/09/03
//
//@access protected
//@return void
//
//
//chkDbQuoteError
//
//@author katsushi
//@since 2008/09/03
//
//@param string $sql
//@param boolean $errout
//@access public
//@return void
//
//
//データ型に合わせてSQL用に処理をする
//
//@author katsushi
//@since 2008/03/18
//
//@param mixed $data
//@param string $type
//@param boolean $notnull
//@param mixed $mess
//@access public
//@return string
//
//
//現在のタイムスタンプ文字列(timestamp型)を取得する
//
//@author katsushi
//@since 2008/04/08
//
//@access public
//@return string
//
//
//今日の日付文字列(date型)を取得する
//
//@author katsushi
//@since 2008/04/10
//
//@access public
//@return string
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
class MtDBUtil {
	static SAVEPOINT_PREFIX = "MDB2_SAVEPOINT_";
	static LOGDIR = "/log/";
	static O_Instance = undefined;

	constructor() //MtOutput
	//エラースタック初期化
	//DSNの取得
	//DB接続
	//$this->O_DataBaseHundle =& MDB2::connect($this->DataSourceName, $H_dbopt);
	//$this->O_DataBaseHundle =& MDB2::factory($this->DataSourceName, $H_dbopt);
	//エラーチェック *ただしfactoryではここではエラーが起きない
	//リカバリー用（更新系SQL）ログオブジェクト生成
	//トレースログオブジェクト生成
	{
		this.DataSourceName = undefined;
		this.O_Out = MtOutput.singleton();
		this.resetDbQuoteError();

		if (this.DataSourceName == undefined) //db.iniから情報を取得
			{
				this.O_Conf = MtSetting.singleton();
				this.O_Conf.loadConfig("db");
				var db_pass = file_get_contents(this.O_Conf.db_pass).trim();
				this.DataSourceName = this.O_Conf.db_type + "://" + this.O_Conf.db_user + ":" + db_pass + "@" + this.O_Conf.db_host + "/" + this.O_Conf.db_name;
			}

		var H_dbopt = {
			persistent: this.O_Conf.db_pool,
			portability: MDB2_PORTABILITY_ALL ^ MDB2_PORTABILITY_EMPTY_TO_NULL
		};
		this.O_DataBaseHundle = MDB2.singleton(this.DataSourceName, H_dbopt);

		if (PEAR.isError(this.O_DataBaseHundle) == true) //エラー処理
			{
				MtExcept.raise("DB\u63A5\u7D9A\u5931\u6557: " + this.O_DataBaseHundle.getUserinfo(), this.H_ExType);
			}

		this.setResultType(true);
		this.H_ExType = {
			type: "DB"
		};
		this.SqlCount = 0;
		this.O_Recover = Log.singleton("file", this.O_Conf.KCS_DIR + MtDBUtil.LOGDIR + this.O_Conf.db_recoverlog_file, _SERVER.PHP_SELF, this.H_LogOpt);

		if (this.O_Conf.db_trace_level > 0) {
			this.H_LogOpt = {
				mode: 600,
				timeFormat: "%Y/%m/%d %X"
			};
			this.O_Trace = Log.singleton("file", this.O_Conf.KCS_DIR + MtDBUtil.LOGDIR + this.O_Conf.db_tracelog_file, _SERVER.PHP_SELF, this.H_LogOpt);

			if (this.O_Conf.db_trace_level == 2) {
				this.O_Debug = Log.singleton("file", this.O_Conf.KCS_DIR + MtDBUtil.LOGDIR + this.O_Conf.db_debuglog_file, _SERVER.PHP_SELF, this.H_LogOpt);
			}
		}
	}

	static singleton() //インスタンスが既に生成されていない場合のみインスタンス生成
	{
		if (MtDBUtil.O_Instance == undefined) {
			MtDBUtil.O_Instance = new MtDBUtil();
		}

		return MtDBUtil.O_Instance;
	}

	getDBH() {
		return this.O_DataBaseHundle;
	}

	connection() //まだ接続されていなかったらダミーのSQLを発行して強制的に接続する
	{
		if (this.O_DataBaseHundle.connection === 0) {
			this.query("select 0");
		}

		return this.O_DataBaseHundle.getConnection();
	}

	setResultType(types) {
		this.ResultType = types;
	}

	getResultType() {
		return this.ResultType;
	}

	setOption(option, value) {
		var result = this.O_DataBaseHundle.setOption(option, value);

		if (PEAR.isError(result) == true) {
			this.exceptRaise("setOption\u5931\u6557: " + result.getUserinfo());
		}

		return result;
	}

	getOption(option) {
		var result = this.O_DataBaseHundle.getOption(option);

		if (PEAR.isError(result) == true) {
			this.exceptRaise("getOption\u5931\u6557: " + result.getUserinfo());
		}

		return result;
	}

	beginTransaction() {
		var result = this.O_DataBaseHundle.beginTransaction();

		if (PEAR.isError(result) == true) {
			this.exceptRaise("beginTransaction\u5931\u6557: " + result.getUserinfo());
		}

		return result;
	}

	beginNestedTransaction() {
		var result = this.O_DataBaseHundle.beginNestedTransaction();

		if (PEAR.isError(result) == true) {
			this.exceptRaise("beginNestedTransaction\u5931\u6557: " + result.getUserinfo());
		}

		return result;
	}

	inTransaction(ignore_nested = false) {
		return this.O_DataBaseHundle.inTransaction();
	}

	loadModule(module, property = undefined, phptype_specific = undefined) {
		if (this.chkLoadedModule(module) == false) //MDB2のloadModuleを呼び出す
			{
				this.O_DataBaseHundle.loadModule(module, property, phptype_specific);
			}

		if (this.chkLoadedModule(module) == false) {
			this.exceptRaise("\u30E2\u30B8\u30E5\u30FC\u30EB\u8AAD\u307F\u8FBC\u307F\u5931\u6557: " + module);
		}
	}

	chkLoadedModule(module) {
		if (undefined !== this.O_DataBaseHundle.modules[module] == true) {
			return true;
		}

		return false;
	}

	disconnect() //エラーチェック
	{
		var result = this.O_DataBaseHundle.disconnect();

		if (PEAR.isError(result) == true) //disconnectの失敗なのでexceptRaiseを呼ばない
			{
				MtExcept.raise("disconnect\u5931\u6557: " + result.getUserinfo(), this.H_ExType);
			}
	}

	commit(savepoint = undefined) //ログ出力
	//エラーチェック
	{
		if (savepoint != undefined) {
			savepoint = MtDBUtil.SAVEPOINT_PREFIX + savepoint;
		}

		var result = this.O_DataBaseHundle.commit(savepoint);

		if (PEAR.isError(result) == true) {
			this.exceptRaise("commit\u5931\u6557: " + result.getUserinfo());
		}
	}

	rollback(savepoint = undefined) //エラーチェック
	{
		if (savepoint != undefined) {
			savepoint = MtDBUtil.SAVEPOINT_PREFIX + savepoint;
		}

		var result = this.O_DataBaseHundle.rollback(savepoint);

		if (PEAR.isError(result) == true) //rollbackの失敗なのでexceptRaiseを呼ばない
			{
				MtExcept.raise("rollback\u5931\u6557: " + result.getUserinfo(), this.H_ExType);
			}
	}

	commitAll() //トランザクション中はすべて
	//カウンターをリセット
	{
		var ret;

		while ((ret = this.inTransaction()) != false) //最後の１だけは自動で消さないので・・・
		//trueと1は違う
		{
			if (ret === 1) {
				this.commit(1);
				this.commit();
				break;
			} else {
				this.completeNestedTransaction(false);
			}
		}

		this.resetNestedCounter();
	}

	rollbackAll() //トランザクション中はすべて
	//カウンターをリセット
	{
		var ret;

		while ((ret = this.inTransaction()) != false) //最後の１だけは自動で消さないので・・・
		//trueと1は違う
		{
			if (ret === 1) {
				this.rollback(1);
				this.rollback();
				break;
			} else {
				this.completeNestedTransaction(true);
			}
		}

		this.resetNestedCounter();
	}

	commitCurrent() //1が返ってくるときだけ・・・
	{
		if (this.inTransaction() === 1) //カウンターをリセット
			{
				this.commit(1);
				this.resetNestedCounter();
			} else {
			this.completeNestedTransaction(false);
		}
	}

	rollbackCurrent() //1が返ってくるときだけ・・・
	{
		if (this.inTransaction() === 1) //カウンターをリセット
			{
				this.rollback(1);
				this.resetNestedCounter();
			} else {
			this.completeNestedTransaction(true);
		}
	}

	completeNestedTransaction(force_rollback = false) //エラーチェック
	{
		var result = this.O_DataBaseHundle.completeNestedTransaction(force_rollback);

		if (PEAR.isError(result) == true) //rollbackの失敗なのでexceptRaiseを呼ばない
			{
				MtExcept.raise("completeNestedTransaction\u5931\u6557: " + result.getUserinfo(), this.H_ExType);
			}
	}

	resetNestedCounter() {
		this.O_DataBaseHundle.nested_transaction_counter = undefined;
	}

	exceptRaise(msg) //WEBならロールバックする
	{
		if (this.O_Out.getSite() == MtOutput.SITE_WEB) {
			this.rollbackAll();
		}

		this.O_Out.errorOut(0, msg);
	}

	traceOut(msg) //トレースログ出力
	{
		if (this.O_Conf.db_trace_level > 0) {
			if (Array.isArray(msg) == true) {
				msg = "\u914D\u5217\u306F\u51FA\u529B\u3055\u308C\u307E\u305B\u3093";
			} else if ("object" === typeof msg == true) {
				msg = "\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u306F\u51FA\u529B\u3055\u308C\u307E\u305B\u3093";
			}

			this.O_Trace.log(preg_replace("/\n/", " ", msg), 6);

			if (this.O_Conf.db_trace_level == 2) {
				this.O_Debug.log(debug_backtrace(), 7);
			}
		}
	}

	getQueryType(sql) {
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::getQueryType: \u5F15\u6570\u306BSQL\u304C\u306A\u3044");
		}

		if (preg_match("/^\\s*(update|insert|delete)/i", sql) == true) {
			return "modify";
		}

		return "select";
	}

	query(sql, errchk = true) //引数チェック
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::query: \u5F15\u6570\u306BSQL\u304C\u306A\u3044");
		}

		if (this.getQueryType(sql) == "modify") //更新系のSQLの場合はexec()に渡す
			//エラーチェックしない場合はDBリザルトオブジェクトを返す
			{
				var O_result = this.exec(sql, false);

				if (errchk === false) {
					return O_result;
				}
			} else //dbQuoteのエラーチェック
			//SQL実行
			//ログ出力
			//SQLカウンターのカウントアップ
			//エラーチェックしない場合はDBリザルトオブジェクトを返す
			{
				this.chkDbQuoteError(sql);
				O_result = this.O_DataBaseHundle.query(sql, this.ResultType);
				this.traceOut(sql);
				this.SqlCount++;

				if (errchk === false) {
					return O_result;
				}
			}

		if (PEAR.isError(O_result) == true) {
			this.exceptRaise("MtDBUtil::query: " + O_result.getUserinfo());
		}

		return O_result;
	}

	exec(sql, errchk = true) //引数チェック
	//SQL実行
	//ログ出力
	//更新系はリカバリーログにも出力
	//SQLカウンターのカウントアップ
	//エラーチェックしない場合はDBリザルトオブジェクトを返す
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::exec: \u5F15\u6570\u306BSQL\u304C\u306A\u3044");
		}

		this.chkDbQuoteError(sql);
		var result = this.O_DataBaseHundle.exec(sql);
		this.traceOut(sql);
		this.O_Recover.log(preg_replace("/\n/", " ", sql), 6);
		this.SqlCount++;

		if (errchk === false) {
			return result;
		}

		if (PEAR.isError(result) == true) {
			this.exceptRaise("MtDBUtil::exec: " + result.getUserinfo());
		}

		return result;
	}

	queryAll(sql, fetchmode = MDB2_FETCHMODE_ORDERED, hashkey = false) //SQL実行
	//ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::queryAll: \u5F15\u6570\u306BSQL\u304C\u306A\u3044");
		}

		if (this.getQueryType(sql) == "modify") {
			this.exceptRaise("MtDBUtil::queryAll: \u66F4\u65B0\u7CFB\u306ESQL\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\uFF08" + sql + "\uFF09");
		}

		this.chkDbQuoteError(sql);
		var A_result = this.O_DataBaseHundle.queryAll(sql, this.ResultType, fetchmode, hashkey);
		this.traceOut(sql);
		this.SqlCount++;

		if (PEAR.isError(A_result) == true) {
			this.exceptRaise("MtDBUtil::queryAll: " + A_result.getUserinfo());
		}

		return A_result;
	}

	queryRow(sql, fetchmode = MDB2_FETCHMODE_ORDERED) //SQL実行
	//ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::queryRow: \u5F15\u6570\u306BSQL\u304C\u306A\u3044");
		}

		if (this.getQueryType(sql) == "modify") {
			this.exceptRaise("MtDBUtil::queryRow: \u66F4\u65B0\u7CFB\u306ESQL\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\uFF08" + sql + "\uFF09");
		}

		this.chkDbQuoteError(sql);
		var A_result = this.O_DataBaseHundle.queryRow(sql, this.ResultType, fetchmode);
		this.traceOut(sql);
		this.SqlCount++;

		if (PEAR.isError(A_result) == true) {
			this.exceptRaise("MtDBUtil::queryRow: " + A_result.getUserinfo());
		}

		return A_result;
	}

	queryOne(sql) //SQL実行
	//ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::queryOne: \u5F15\u6570\u306BSQL\u304C\u306A\u3044");
		}

		if (this.getQueryType(sql) == "modify") {
			this.exceptRaise("MtDBUtil::queryRow: \u66F4\u65B0\u7CFB\u306ESQL\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\uFF08" + sql + "\uFF09");
		}

		this.chkDbQuoteError(sql);
		var result = this.O_DataBaseHundle.queryOne(sql, this.ResultType);
		this.traceOut(sql);
		this.SqlCount++;

		if (PEAR.isError(result) == true) {
			this.exceptRaise("MtDBUtil::queryOne: " + result.getUserinfo());
		}

		return result;
	}

	queryCol(sql, col = 0) //SQL実行
	//ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::queryCol: \u5F15\u6570\u306BSQL\u304C\u306A\u3044");
		}

		if (this.getQueryType(sql) == "modify") {
			this.exceptRaise("MtDBUtil::queryCol: \u66F4\u65B0\u7CFB\u306ESQL\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\uFF08" + sql + "\uFF09");
		}

		this.chkDbQuoteError(sql);
		var A_result = this.O_DataBaseHundle.queryCol(sql, this.ResultType, col);
		this.traceOut(sql);
		this.SqlCount++;

		if (PEAR.isError(A_result) == true) {
			this.exceptRaise("MtDBUtil::queryCol: " + A_result.getUserinfo());
		}

		return A_result;
	}

	queryHash(sql) //SQL実行
	{
		var A_result = this.queryAll(sql, MDB2_FETCHMODE_ASSOC, false);
		return A_result;
	}

	queryAssoc(sql) //SQL実行
	{
		var H_result = this.queryAll(sql, MDB2_FETCHMODE_ORDERED, true);
		return H_result;
	}

	queryKeyAssoc(sql) //SQL実行
	{
		var H_result = this.queryAll(sql, MDB2_FETCHMODE_ASSOC, true);
		return H_result;
	}

	queryRowHash(sql) //SQL実行
	{
		var H_result = this.queryRow(sql, MDB2_FETCHMODE_ASSOC);
		return H_result;
	}

	escape(value, escape_wildcards = false) //ログ出力
	//$this->traceOut($value);
	{
		return this.O_DataBaseHundle.escape(value, escape_wildcards);
	}

	nextID(seqname) //ログ出力
	//エラーチェック
	{
		if ("string" === typeof seqname == false || seqname == "") {
			this.exceptRaise("MtDBUtil::nextID: \u30B7\u30FC\u30B1\u30F3\u30B9\u540D\u304C\u306A\u3044");
		}

		var result = this.O_DataBaseHundle.nextID(seqname);
		this.traceOut(seqname + ": " + result);

		if (PEAR.isError(result) == true) {
			this.exceptRaise("MtDBUtil::nextID: " + result.getUserinfo());
		}

		return result;
	}

	setLimit(limit, offset) {
		if (is_numeric(limit) == false || is_numeric(offset) == false) {
			this.exceptRaise("MtDBUtil::setLimit: limit,offset\u306E\u3069\u3061\u3089\u304B\u304C\u6570\u5024\u3067\u306F\u306A\u3044");
		}

		var result = this.O_DataBaseHundle.setLimit(limit, offset);

		if (PEAR.isError(result) == true) {
			this.exceptRaise("MtDBUtil::setLimit: " + result.getUserinfo());
		}

		return result;
	}

	prepare(sql) //ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェック
	{
		if ("string" === typeof sql == false || sql == "") {
			this.exceptRaise("MtDBUtil::prepare: \u5F15\u6570\u306BSQL\u304C\u306A\u3044");
		}

		var O_sql = this.O_DataBaseHundle.prepare(sql);
		this.traceOut(sql);
		this.SqlCount++;

		if (PEAR.isError(O_sql) == true) {
			this.exceptRaise("MtDBUtil::prepare: " + O_sql.getUserinfo());
		}

		return O_sql;
	}

	execute(O_sql, A_value, errchk = true) //ログ出力
	//SQLカウンターのカウントアップ
	//エラーチェックしないならそのまま返す
	{
		if (undefined !== O_sql == false) {
			this.exceptRaise("MtDBUtil::execute: SQL\u30B9\u30C6\u30FC\u30C8\u30E1\u30F3\u30C8\u304C\u306A\u3044");
		}

		if (Array.isArray(A_value) == false) {
			this.exceptRaise("MtDBUtil::execute: \u7F6E\u63DB\u7528\u914D\u5217\u304C\u306A\u3044");
		}

		var O_result = O_sql.execute(A_value);
		this.traceOut(serialize(A_value));
		this.SqlCount++;

		if (errchk === false) {
			return O_result;
		}

		if (PEAR.isError(O_result) == true) {
			this.exceptRaise("MtDBUtil::execute: " + O_result.getUserinfo());
		}

		return O_result;
	}

	executeMultiple(O_sql, A_value, errchk = true) {
		if (undefined !== O_sql == false) {
			this.exceptRaise("MtDBUtil::executeMultiple: SQL\u30B9\u30C6\u30FC\u30C8\u30E1\u30F3\u30C8\u304C\u306A\u3044");
		}

		if (Array.isArray(A_value) == false) {
			this.exceptRaise("MtDBUtil::executeMultiple: \u7F6E\u63DB\u7528\u914D\u5217\u304C\u306A\u3044");
		}

		if (Array.isArray(A_value[0]) == false) {
			this.exceptRaise("MtDBUtil::executeMultiple: \u7F6E\u63DB\u7528\u914D\u5217\u304C2\u6B21\u5143\u914D\u5217\u3067\u306F\u306A\u3044");
		}

		var cnt = 0;

		for (var i = 0; i < A_value.length; i++) //$result = $O_sql->execute($A_value[$i]);
		//ログ出力
		{
			var O_result = this.execute(O_sql, A_value[i], false);
			this.traceOut(serialize(A_value[i]));

			if (PEAR.isError(O_result) == true) //エラーチェックしないならそのまま返す
				{
					if (errchk === false) {
						return O_result;
					}

					this.exceptRaise("MtDBUtil::executeMultiple: " + O_result.getUserinfo());
				} else {
				cnt++;
			}
		}

		return cnt;
	}

	pgCopyFrom(tablename, A_rows: {} | any[], delimiter = undefined, null_as = undefined) {
		if (A_rows.length > 0) {
			var A_arg = [this.connection(), tablename, A_rows];

			if (delimiter !== undefined) {
				A_arg.push(delimiter);

				if (null_as !== undefined) {
					A_arg.push(null_as);
				}
			}

			var res = call_user_func_array("pg_copy_from", A_arg);
			var H_error = error_get_last();

			if (strpos(H_error.message, "pg_copy_from()") === 0) {
				this.exceptRaise("MtDBUtil::pgCopyFrom: " + str_replace("\n", " ", H_error.message));
			}
		} else {
			this.exceptRaise("MtDBUtil::pgCopyFrom: \u5F15\u6570\u306E\u914D\u5217\u304C\u3042\u308A\u307E\u305B\u3093");
		}

		if (res === false) {
			this.exceptRaise("MtDBUtil::pgCopyFrom: COPY\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
		}

		return res;
	}

	pgCopyFromArray(tablename, A_rows: {} | any[], delimiter = undefined, null_as = undefined) //引数の配列はもう使わないので削除
	{
		var A_data = Array();

		for (var i = 0; i < A_rows.length; i++) //タブ区切りに変換
		{
			{
				let _tmp_0 = A_rows[i];

				for (var key in _tmp_0) {
					var value = _tmp_0[key];

					if (value === undefined) //NULLは\Nに置き換える
						{
							A_rows[i][key] = "\\N";
						} else //改行、タブをエスケープ
						{
							A_rows[i][key] = str_replace(["\r", "\n", "\t"], ["\\r", "\\n", "\\t"], value);
						}
				}
			}
			var line = A_rows[i].join("\t");
			A_data.push(line);
		}

		delete A_rows;
		return this.pgCopyFrom(tablename, A_data, delimiter = undefined, null_as = undefined);
	}

	getSqlCount() {
		return this.SqlCount;
	}

	__call(funcname, args) //MDB2のメソッドを呼び出す
	//ログ出力
	//if(PEAR::isError($result) == true){
	//$this->exceptRaise("MtDBUtil::__call(" . $funcname . "): " . $result->getUserinfo());
	//}
	//エラーオブジェクトが特定できないのでエラーチェックなしで返す
	//$this->exceptRaise("MtDBUtilエラー: メソッド名[" . $funcname . "]がない");
	{
		var result = call_user_func_array([this.O_DataBaseHundle, funcname], args);
		this.traceOut("MtDBUtil::__call(" + funcname + "): " + serialize(args));
		return result;
	}

	resetDbQuoteError() {
		this.A_dbquote_err = Array();
	}

	addDbQuoteError(err = "") {
		this.A_dbquote_err.push(err);
	}

	getDbQuoteError() {
		return this.A_dbquote_err;
	}

	getDbQuoteErrorCount() {
		return this.getDbQuoteError().length;
	}

	chkDbQuoteError(sql = "") {
		if (this.getDbQuoteErrorCount() == 0) {
			return true;
		}

		var A_err = this.getDbQuoteError();
		this.resetDbQuoteError();
		this.exceptRaise("DBUtil::dbQuote: " + A_err.join(", ") + " ::\u4F5C\u6210\u3057\u305FSQL:: " + sql);
	}

	dbQuote(data, type, notnull = false, mess = "") {
		if (undefined !== type == false) {
			var btrace = debug_backtrace();
			mess = "[" + basename(btrace[0].file) + ":" + btrace[0].line + "] " + mess;
			this.addDbQuoteError("type\u304C\u306A\u3044");
		}

		if (type == "integer" || type == "int" || type == "float") {
			if (notnull === true && data !== 0 && data == "") {
				btrace = debug_backtrace();
				mess = "[" + basename(btrace[0].file) + ":" + btrace[0].line + "] " + mess;
				this.addDbQuoteError("not null\u306A\u306E\u306B\u30C7\u30FC\u30BF\u304C\u306A\u3044(int) " + mess);
				return undefined;
			}

			if (data === 0) {
				return 0;
			}

			if (data == "") {
				return "NULL";
			}

			if (is_numeric(data) == false) {
				btrace = debug_backtrace();
				mess = "[" + basename(btrace[0].file) + ":" + btrace[0].line + "] " + mess;
				this.addDbQuoteError("integer\u306A\u306E\u306B\u6570\u5024\u4EE5\u5916(" + data + ") " + mess);
				return undefined;
			} else {
				return data.trim();
			}
		} else if (type == "char" || type == "varchar" || type == "string" || type == "str" || type == "text") {
			if (data == "") {
				if (notnull == true) {
					return "''";
				} else {
					return "NULL";
				}
			} else {
				return "'" + this.escape(data) + "'";
			}
		} else if (type == "timestamp" || type == "date" || type == "time") {
			if (data == "") {
				if (notnull == true) {
					return "''";
				} else {
					return "NULL";
				}
			} else {
				return "'" + this.escape(data) + "'";
			}
		} else if (type == "boolean" || type == "bool") {
			if (notnull == true && (data === "" || data === undefined)) {
				btrace = debug_backtrace();
				mess = "[" + basename(btrace[0].file) + ":" + btrace[0].line + "] " + mess;
				this.addDbQuoteError("not null\u306A\u306E\u306B\u30C7\u30FC\u30BF\u304C\u306A\u3044 " + mess);
				return undefined;
			}

			if (data == 1 || data == "TRUE" || data == "true" || data === true) {
				return "TRUE";
			} else if (data == 0 || data == "FALSE" || data == "false" || data === false) {
				return "FALSE";
			} else {
				return "NULL";
			}
		} else {
			return data;
		}
	}

	execInsertUpdate(tablename, A_data: {} | any[]) //インサートの件数
	//アップデートの件数
	//テーブルのカラム一覧
	//テーブルのprimary,unique key の一覧
	//NotNULLの一覧
	//テーブル情報の取得
	//var_dump($A_tableinfo);
	//引数の配列をループ
	{
		var insert_cnt = 0;
		var update_cnt = 0;
		var H_colunm = Array();
		var A_primary = Array();
		var A_notnull = Array();
		this.loadModule("Reverse");
		var A_tableinfo = this.tableInfo(tablename);

		for (var i = 0; i < A_tableinfo.length; i++) //カラム一覧
		//primaryキーの追加
		//if(preg_match("/^(primary_key|unique_key|multiple_key)/", $A_tableinfo[$i]["flags"]) == true){
		{
			H_colunm[A_tableinfo[i].name].type = A_tableinfo[i].mdb2type;
			H_colunm[A_tableinfo[i].name].notnull = A_tableinfo[i].notnull;

			if (undefined !== A_tableinfo[i].autoincrement == true) {
				H_colunm[A_tableinfo[i].name].autoincrement = true;
			} else {
				H_colunm[A_tableinfo[i].name].autoincrement = false;
			}

			if (strpos(A_tableinfo[i].flags, "primary_key") !== false) {
				A_primary.push(A_tableinfo[i].name);
			}

			if (A_tableinfo[i].notnull == true) {
				A_notnull.push(A_tableinfo[i].name);
			}
		}

		for (i = 0;; i < A_data.length; i++) //Not NULLのデータが存在するかチェックする
		//データ行の処理
		//insert文生成
		//SQL実行
		//var_dump($sql);
		{
			var ins_error_flg = false;

			for (var x = 0; x < A_notnull.length; x++) {
				if (undefined !== A_data[i][A_notnull[x]] == false) //Not NULLが指定されていないのでupdateが出来ない
					//ERROR
					{
						console.log("miss");
						ins_error_flg = true;
						break;
					}
			}

			if (ins_error_flg == true) {
				continue;
			}

			var H_values = Array();
			{
				let _tmp_1 = A_data[i];

				for (var key in _tmp_1) //serial型の処理
				{
					var value = _tmp_1[key];

					if (H_colunm[key].autoincrement == true) //データがなければインサート文から除外
						{
							if (value == "") {
								continue;
							} else {
								if (is_numeric(value) == false) {
									this.exceptRaise("MtDBUtil::execInsertUpdate: serial\u578B\u306A\u306E\u306B\u6570\u5024\u3067\u306F\u306A\u3044");
								}

								var currid = this.queryOne("select last_value from " + tablename + "_" + key + "_seq");

								if (currid < value) {
									this.query("select setval('" + tablename + "_" + key + "_seq'," + value + ")");
								}
							}
						}

					H_values[key] = this.dbQuote(value, H_colunm[key].type, H_colunm[key].notnull);
				}
			}
			var sql = "insert into " + tablename + "(" + Object.keys(H_values).join(",") + ") values(";
			sql += Object.values(H_values).join(",") + ")";
			var res = this.exec(sql, false);

			if (PEAR.isError(res) == true) //重複エラー(duplicate key violates unique constraint)
				{
					if (res.getCode() === -3) //エラーフラグ
						//プライマリ、ユニークキーのデータが存在するかチェックする
						//Not NULLのデータが存在するかチェックする
						{
							var upd_error_flg = false;

							for (x = 0;; x < A_primary.length; x++) {
								if (undefined !== H_values[A_primary[x]] == false) //プライマリ、ユニークキーが指定されていないのでupdateが出来ない
									//ERROR
									{
										console.log("miss");
										upd_error_flg = true;
										break;
									}
							}

							for (x = 0;; x < A_notnull.length; x++) {
								if (undefined !== H_values[A_notnull[x]] == false) //Not NULLが指定されていないのでupdateが出来ない
									//ERROR
									{
										console.log("miss");
										upd_error_flg = true;
										break;
									}
							}

							if (upd_error_flg == false) //var_dump($upd_sql);
								{
									var A_where = Array();
									var A_set = Array();

									for (var upd_key in H_values) //プライマリ、ユニークキーの場合はwhere句へ
									{
										var upd_value = H_values[upd_key];

										if (-1 !== A_primary.indexOf(upd_key) == true) {
											A_where.push(upd_key + " = " + upd_value);
										} else {
											A_set.push(upd_key + " = " + upd_value);
										}
									}

									var upd_sql = "update " + tablename + " set ";
									upd_sql += A_set.join(",");
									upd_sql += " where " + A_where.join(" and ");
									var upd_res = this.exec(upd_sql, false);

									if (PEAR.isError(upd_res) == true) //更新も失敗
										//ERROR
										{
											echo("update\u5931\u6557\n");
										} else {
										if (upd_res < 1) //1件も更新されなかった
											//ERROR
											{
												console.log("miss: " + upd_sql);
											} else {
											update_cnt++;
										}
									}
								}
						}
				} else {
				insert_cnt++;
			}
		}

		echo("\u6E21\u3055\u308C\u305F\u914D\u5217\u306E\u6570" + A_data.length + "<br>\n");
		echo("\u30A4\u30F3\u30B5\u30FC\u30C8\uFF1A" + insert_cnt + "<br>\n");
		echo("\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8\uFF1A" + update_cnt + "<br>\n");
		return insert_cnt + update_cnt;
	}

	getNow() //DBから取得する場合の処理
	//処理は遅くなるが本当はこれがベスト
	//$sql = "select current_timestamp";
	//return $this->queryOne($sql);
	//PHPの関数で取得
	{
		return date("Y-m-d H:i:s");
	}

	getToday() //DBから取得する場合の処理
	//処理は遅くなるが本当はこれがベスト
	//$sql = "select current_date";
	//return $this->queryOne($sql);
	//PHPの関数で取得
	{
		return date("Y-m-d");
	}

	__destruct() {}

};