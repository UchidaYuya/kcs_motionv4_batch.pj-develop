//
//Motion拡張例外
//
//@uses Exception
//@package Base
//@subpackage Exception
//@filesource
//@author nakanishi
//@since 2008/02/05
//
//
//
//Motion拡張例外
//
//@uses Exception
//@package Base
//@subpackage Exception
//@author nakanishi
//@since 2008/02/05
//

require("Log.php");

//
//例外が生じた時刻
//
//@var string
//@access private
//
//
//おおらかに何でも入る入れ物
//
//@var array
//@access private
//
//
//コンストラクタ
//
//@author nakanishi
//@since 2008/02/06
//
//@param mixed $message エラーメッセージ
//@param array $H_param
//@access public
//@return void
//
//
//例外発生時刻を取得する
//
//@author nakanishi
//@since 2008/02/06
//
//@access public
//@return void
//
//
//例外に付帯するパラメータを取得する
//
//@author nakanishi
//@since 2008/02/06
//
//@param mixed $key
//@access public
//@return void
//
//
//例外を送出する
//例外の記述を短くするための便利関数
//
//@author nakanishi
//@since 2008/02/06
//
//@param string $message エラーメッセージ
//@param array $H_param
//@static
//@access public
//@return void
//
//
//PEARエラー用のエラー処理
//PEARエラーなら例外を送出する
//
//@author nakanishi
//@since 2008/02/06
//
//@param mixed $O_pear
//@static
//@access public
//@return $O_pear ペアオブジェクト
//
//
//プロセス生成失敗のための最終的な例外ハンドラ、MtExcept用
//
//コンストラクター内部での例外、設定ミスなどで、
//オブジェクトが生成できなかった場合に用いられる。
//
//@author nakanita
//@since 2008/04/02
//
//@param MtExcept $ex
//@static
//@access public
//@return void
//
//
//プロセス生成失敗のための最終的な例外ハンドラ、一般例外用
//
//コンストラクター内部での例外、設定ミスなどで
//オブジェクトが生成できなかった場合に用いられる。
//
//@author nakanita
//@since 2008/04/02
//
//@param Exception $ex
//@static
//@access public
//@return void
//
//
//PHP自身の出力したエラーを受ける自前のハンドラ
//
//PHPのエラーを直接ユーザー画面に出さないためメソッド<br/>
//メッセージが見えなくなるので、開発機でこの設定は行わない。<br/>
//
//@author nakanita
//@since 2008/02/08
//
//@param integer $errno
//@param string $errstr
//@param string $errfile
//@param integer $errline
//@static
//@access public
//@return bool PHPの内部エラーハンドラに処理を渡すかどうか
//
//
//設定でエラーを起こしたときにログ出力する
//
//@author nakanita
//@since 2008/05/07
//
//@param string $msg
//@static
//@access private
//@return void
//
class MtExcept extends Error {
	constructor(message, H_param = Array()) //発生時刻
	//パラメータをそのまま取得する
	{
		this.When = date("Y/m/d_H:i:s");
		this.H_Param = H_param;
		super(message);
	}

	getWhen() {
		return this.When;
	}

	getParam(key) {
		return this.H_Param[key];
	}

	static raise(message, H_param = Array()) {
		throw new self(message, H_param);
	}

	static pear(O_pear) {
		if (PEAR.isError(O_pear)) {
			MtExcept.raise(O_pear.getUserInfo());
		}

		return O_pear;
	}

	static finalMtExceptHandler(ex: MtExcept) {
		var msg = "[MtExcept\u4F8B\u5916\u767A\u751F: \u8A2D\u5B9A\u3001\u30B3\u30F3\u30B9\u30C8\u30E9\u30AF\u30BF\u7B49\u3092\u898B\u76F4\u3057\u3066\u304F\u3060\u3055\u3044]";
		print(msg);
		console.log(ex);
		MtExcept.finalLog(msg + ":" + ex.getMessage());
	}

	static finalExceptHandler(ex: Exception) {
		var msg = "[\u4E00\u822C\u4F8B\u5916\u767A\u751F: \u8A2D\u5B9A\u3001\u30B3\u30F3\u30B9\u30C8\u30E9\u30AF\u30BF\u7B49\u3092\u898B\u76F4\u3057\u3066\u304F\u3060\u3055\u3044]";
		print(msg);
		console.log(ex);
		MtExcept.finalLog(msg + ":" + ex.getMessage());
	}

	static finalErrorHandler(errno, errstr, errfile, errline) // ToDo *
	//こんなエラーが出力されてしまう。
	//[2048] Non-static method Log::singleton() should not be called statically,
	//assuming $this from incompatible context
	//原因が良くわからないので、とりあえず伏せた
	//self::finalLog( "PHP内部エラー発生 [" . $errno ."] ". $errstr );
	//exit(-1);	// ここでエラー終了する
	//以下はphpにあったサンプル
	//		switch( $errno ){
	//		case E_USER_ERROR:
	//			echo "<b>My ERROR</b> [$errno] $errstr<br />\n";
	//			echo "  Fatal error on line $errline in file $errfile";
	//			echo ", PHP " . PHP_VERSION . " (" . PHP_OS . ")<br />\n";
	//			echo "Aborting...<br />\n";
	//			exit(1);
	//			break;
	//		case E_USER_WARNING:
	//			echo "<b>My WARNING</b> [$errno] $errstr<br />\n";
	//			break;
	//		
	//		case E_USER_NOTICE:
	//			echo "<b>My NOTICE</b> [$errno] $errstr<br />\n";
	//			break;
	//		
	//		case E_RECOVERABLE_ERROR:
	//			echo "<b>My RECOVERABLE</b> [$errno] $errstr<br />\n";
	//			exit(1); // 通常であれば処理継続するのだが、本番では処理中断すべき。
	//			break;
	//		
	//		default:
	//			// 警告レベルのメッセージがたくさん出るので、本番では抑制すべきかも。
	//			echo "Unknown error type: [$errno] $errstr<br />\n";
	//			break;
	//		}
	//PHP の内部エラーハンドラを実行しません
	{
		var msg = "[finalErrorHandler: \u30B7\u30B9\u30C6\u30E0\u304C\u4E00\u6642\u7684\u306B\u3054\u5229\u7528\u3067\u304D\u306A\u3044\u72B6\u614B\u3068\u306A\u3063\u3066\u3044\u307E\u3059]<br/>";
		print(msg);
		print("[" + errno + "] " + errstr);
		return true;
	}

	static finalLog(msg) //ログ出力先を探す
	//3:error
	{
		if (undefined !== _SERVER.SERVER_NAME == true) //セッションがあればWEB側
			//設定が期待できないので、直に指定する
			{
				var logdir = "/kcs/log";

				if (false == file_exists(logdir)) //無ければ苦し紛れにカレントを指定する
					{
						logdir = ".";
					}

				var logfile = logdir + "/err.log";
			} else //セッションが無ければバッチ側
			//設定が期待できないので、直に指定する
			{
				logdir = "/kcs_db/data/log";

				if (false == file_exists(logdir)) //無ければ苦し紛れにカレントを指定する
					{
						logdir = ".";
					}

				logfile = logdir + "/billbat.log";
			}

		var logopt = {
			mode: 600,
			timeFormat: "%Y/%m/%d %X"
		};
		var O_errlog = Log.singleton("file", logfile, _SERVER.PHP_SELF, logopt);
		O_errlog.log(msg, 3);
	}

};