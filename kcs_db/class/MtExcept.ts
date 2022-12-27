const fs = require("fs"); 

export default class MtExcept extends Error {
	When: string;
	H_Param: any[];
	getMessage: any;
	constructor(message:string, H_param : any[] = Array()) //発生時刻
	//パラメータをそのまま取得する
	{
		super(message);
		this.When = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').split("-").join("/");
		this.H_Param = H_param;
	}

	getWhen() {
		return this.When;
	}

	getParam(key: string | number) {
		return this.H_Param[key];
	}

	static raise(message:string, H_param = Array()) {
		throw new this(message, H_param);
	}

	static pear(O_pear: any) {
		if (!O_pear) {
			MtExcept.raise(O_pear.getUserInfo());
		}

		return O_pear;
	}

	static finalMtExceptHandler(ex: MtExcept) {
		var msg = "[MtExcept例外発生: 設定、コンストラクタ等を見直してください]";
		console.log(msg);
		console.log(ex);
		MtExcept.finalLog(msg + ":" + ex.getMessage());
	}

	static finalExceptHandler(ex) {
		var msg = "[一般例外発生: 設定、コンストラクタ等を見直してください]";
		console.log(msg);
		console.log(ex);
		MtExcept.finalLog(msg + ":" + ex.message());
	}

	static finalErrorHandler(errno: string, errstr: string, errfile: any, errline: any) // ToDo *
	//こんなエラーが出力されてしまう。
	//[2048] Non-static method Log::singleton() should not be called statically,
	//assuming $this from incompatible context
	//原因が良くわからないので、とりあえず伏せた
	//self::finalLog( "PHP内部エラー発生 [" . $errno ."] ". $errstr );
	//exit(-1);	// ここでエラー終了する
	//以下はphpにあったサンプル
	//		switch( $errno ){
	//		case E_USER_ERROR:
	//			// echo "<b>My ERROR</b> [$errno] $errstr<br />\n";
	//			// echo "  Fatal error on line $errline in file $errfile";
	//			// echo ", PHP " . PHP_VERSION . " (" . PHP_OS . ")<br />\n";
	//			// echo "Aborting...<br />\n";
	//			exit(1);
	//			break;
	//		case E_USER_WARNING:
	//			// echo "<b>My WARNING</b> [$errno] $errstr<br />\n";
	//			break;
	//		
	//		case E_USER_NOTICE:
	//			// echo "<b>My NOTICE</b> [$errno] $errstr<br />\n";
	//			break;
	//		
	//		case E_RECOVERABLE_ERROR:
	//			// echo "<b>My RECOVERABLE</b> [$errno] $errstr<br />\n";
	//			exit(1); // 通常であれば処理継続するのだが、本番では処理中断すべき。
	//			break;
	//		
	//		default:
	//			// 警告レベルのメッセージがたくさん出るので、本番では抑制すべきかも。
	//			// echo "Unknown error type: [$errno] $errstr<br />\n";
	//			break;
	//		}
	//PHP の内部エラーハンドラを実行しません
	{
		var msg = "[finalErrorHandler: システムが一時的にご利用できない状態となっています]<br/>";
		console.log(msg);
		console.log("[" + errno + "] " + errstr);
		return true;
	}

	static finalLog(msg: string) //ログ出力先を探す
	//3:error
	{
		let logdir = "/kcs_db/data/log";

		if (false == fs.existsSync(logdir)) //無ければ苦し紛れにカレントを指定する
			{
				logdir = ".";
			}

		const logfile = logdir + "/billbat.log";
		var logopt = {
			mode: 600,
			timeFormat: "%Y/%m/%d %X"
		};
		// var O_errlog = Logger.singleton("file", logfile, process.PHP_SELF, logopt);
		// O_errlog.log(msg, 3);
	}
};