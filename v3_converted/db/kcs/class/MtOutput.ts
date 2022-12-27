//
//KCSMotion 出力系クラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//2009/02/19 石崎公久 writeAdminMnglog追加
//2009/08/26 前田 ログイン記録英語化対応
//@package Base
//@subpackage Output
//@filesource
//@author nakanita
//@since 2008-01-22
//
//
//バッチ側で呼ばないように利用する直前に移動
//require_once("view/ViewError.php");
//require_once("model/ActlogModel.php");
//
//KCSMotion 出力系クラス
//あらゆる出力を一手に引き受ける。<br>
//標準出力（print, echo)、ログ、エラーページ出力、メール出力。
//
//@package Base
//@subpackage Output
//@author nakanita
//@since 2008/02/08
//

require("MtSetting.php");

require("MtExcept.php");

require("MtMailUtil.php");

require("MtSession.php");

require("Log.php");

//
//共通設定
//
//@var integer
//@access private
//
//WEB側
//DB側
//
//サイト、SITE_WEB 又は SAITE_BATCH を指定する
//
//@var integer
//@access private
//
//開発中
//トライ環境
//本番
//
//ステージ、STAGE_DEV 又は STAGE_TRY 又は STAGE_HON を指定する
//
//@var integer
//@access private
//
//出力レベルは次の４段階とする
//開発時にのみ出力するもの
//問題なし、情報として出力するもの
//問題はあるが、処理続行するもの
//問題あり、即座に止めるべきもの
//
//ホットラインログインページのパス<br>
//index.htm又はHotline/<br>
//
//
//デバッグログ
//
//@var mixed
//@access private
//
//
//Infoログ
//
//@var mixed
//@access private
//
//
//エラーログ
//
//@var mixed
//@access private
//
//
//スクリプト共通のログファイル
//
//@var mixed
//@access private
//
//
//スクリプト固有のログファイル
//
//@var mixed
//@access private
//
//
//出力付帯情報、pactid、loginid など、付帯情報を保存する
//
//@var array
//@access private
//
//
//インメニューに戻るエラー種別
//
//@var mixed
//@access private
//
//
//トップに戻るエラー種別
//
//@var mixed
//@access private
//
//
//エラーメールの飛ばし先
//
//@var mixed
//@access public
//
//
//メッセージを一時的に蓄えるバッファ
//
//@var mixed
//@access private
//
//
//バッファに入った警告の数
//
//@var integer
//@access private
//
//
//バッファに入ったエラーの数
//
//@var integer
//@access private
//
//
//処理が無限ループに陥らないためのカウンタ
//
//@var integer
//@access private
//
//
//siteの設定を得る
//
//@author nakanita
//@since 2008/02/08
//
//@access protected
//@return integer
//
//
//Siteの設定を環境変数から自動的に取得する
//
//@author nakanita
//@since 2008/03/10
//
//@access private
//@return integer
//
//
//stageの設定を得る
//
//@author nakanita
//@since 2008/02/08
//
//@access protected
//@return integer
//
//
//付帯情報にpactidを設定する
//
//@author nakanita
//@since 2008/02/13
//
//@param mixed $pactid
//@access protected
//@return void
//
//
//付帯情報にloginidを設定する
//
//@author nakanita
//@since 2008/02/13
//
//@param mixed $loginid
//@access protected
//@return void
//
//
//付帯情報にuseridを設定する
//
//@author nakanita
//@since 2008/03/07
//
//@param mixed $userid
//@access protected
//@return void
//
//
//付帯情報にshipidを設定する
//
//@author nakanita
//@since 2008/03/07
//
//@param mixed $shopid
//@access protected
//@return void
//
//
//付帯情報にlanguageを設定する
//
//@author houshiyama
//@since 2009/01/15
//
//@param mixed $shopid
//@access protected
//@return void
//
//
//メッセージバッファー、エラーメッセージを含んだ配列を返す
//
//@author nakanita
//@since 2008/04/03
//
//@access public
//@return array
//
//
//メッセージバッファーに溜まったエラーの数を返す
//
//@author nakanita
//@since 2008/04/16
//
//@access public
//@return integer
//
//
//メッセージバッファーに溜まった警告の数を返す
//
//@author nakanita
//@since 2008/04/16
//
//@access public
//@return integer
//
//
//セッションの値をログに設定する
//
//@author nakanita
//@since 2008/03/11
//
//@param array $H_my_session
//@access protected
//@return void
//
//
//WEB側の場合のみセッション値をログに設定する
//直接 _SESSION を参照している
//
//@author nakanita
//@since 2008/03/11
//
//@access private
//@return void
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@final
//@param integer $site0 サイトの初期設定、SITE_WEB 又は SITE_DB
//@param array $H_param
//@access private
//@return void
//
//
//スクリプト固有のログファイルを設定
//
//@author ishizaki
//@since 2008/03/14
//
//@param String $logfile
//@access public
//@return void
//
//
//ただ１つしか無いこのクラスのインスタンスを取得する
//new の代わりに、このメソッドによってインスタンスを得ること
//
//@author nakanita
//@since 2008/02/20
//
//@param integer $site0 default="" SITE_WEB 又は SITE_BATCH、デフォルト自動判定
//@param array $H_param
//@static
//@access public
//@return object
//
//
//メインメニューに戻るエラー種別を追加する
//
//@author nakanita
//@since 2008/03/07
//
//@param integer $err エラー種別
//@access public
//@return void
//
//
//デバッグ情報出力関数
//
//@author nakanita
//@since 2008/03/11
//
//@param mixed $errstr
//@param integer $disp
//@access public
//@return void
//
//
//配列だった場合、展開してdebugOut。それ以外はそのままdebugOut
//
//@author ishizaki
//@since 2008/09/09
//
//@param mixed $errstr
//@param float $disp
//@access public
//@return void
//
//
//標準情報出力関数
//
//@author nakanita
//@since 2008/03/11
//
//@param mixed $errstr
//@param integer $disp
//@access public
//@return void
//
//
//警告時の出力関数、ErrorUtilと類似
//
//@author nakanita
//@since 2008/03/07
//
//@param integer $code
//@param string $errstr
//@param integer $disp
//@access public
//@return void
//
//
//エラー時の出力関数、ErrorUtilと類似
//
//@author nakanita
//@since 2008/03/07
//
//@param integer $code
//@param string $errstr
//@param integer $mailflg default=1 メール送信有り/無し
//@param string $goto
//@param string $buttonstr
//@access public
//@return void
//
//
//汎用出力関数<br>
//あらゆる出力を一手に引き受ける<br>
//内部で、各レベルに応じた出力関数を読んでいる
//
//@author nakanita
//@since 2008/02/08
//
//@param string $msg
//@param integer $level
//@param array $H_param
//@access public
//@return void
//
//Log 出力に指定できる数値は次の通り
//0：[emergency]
//1：[alert]
//2：[critical]
//3：[error]
//4：[warning]
//5：[notice]
//
//DEBUGレベルの出力関数
//
//@author nakanita
//@since 2008/02/08
//
//@param string $msg
//@param integer $level
//@param array $H_param
//@access protected
//@return void
//
//
//INFOレベルの出力関数
//
//@author nakanita
//@since 2008/02/08
//
//@param string $msg
//@param integer $level
//@param array $H_param
//@access protected
//@return void
//
//
//WARNレベルの出力関数
//
//@author nakanita
//@since 2008/02/08
//
//@param string $msg
//@param integer $level
//@param array $H_param
//@access protected
//@return void
//
//
//ERRORレベルの出力関数
//
//@author nakanita
//@since 2008/02/08
//
//@param mixed $msg
//@param mixed $level
//@param array $H_param
//@access protected
//@return void
//
//
//エラー画面表示を行う。
//ログ出力等を行わず、直接エラー画面だけを表示したいときに使用する。
//
//@author nakanita
//@since 2008/04/09
//
//@param mixed $disp_msg
//@param integer $code
//@param string $goto
//@param string $buttonstr
//@access public
//@return void
//
//
//型に応じたメッセージを標準出力に出す
//WEBの場合、PREタグで挟む
//
//@author nakanita
//@since 2008/02/08
//
//@param mixed $msg 様々な型の入力を受け付ける
//@access protected
//@return void
//
//
//型に応じたメッセージを標準出力に出す
//
//@author nakanita
//@since 2008/02/08
//
//@param mixed $msg 様々な型の入力を受け付ける
//@access private
//@return void
//
//
//スクリプトが起動／終了の際に基底ログファイルに動作を書き込むためのメソッド
//
//@author ishizaki
//@since 2008/03/14
//
//@param String $msg
//@param integer $level
//@access public
//@return void
//
//
//スクリプト固有のログに出力する
//
//スクリプト固有ログが未設定であれば、共通ログに出力する
//
//@author nakanita
//@since 2008/03/31
//
//@param string $msg
//@param integer $level
//@access private
//@return void
//
//
//メッセージバッファに蓄えたERROR/WARNINGをメール出力する。
//
//@author nakanita
//@since 2008/04/01
//
//@param boolean $mail
//@access public
//@return boolean メッセージがあればtrue
//
//
//メッセージを整形する
//配列だったら１列につなげる。また、文字列中の改行を除く
//
//@author nakanita
//@since 2008/03/12
//
//@param string $msg
//@access private
//@return string
//
//
//エラーメッセージを取得する
//
//旧バージョンで error_tb に設定されていたエラーメッセージは、
//そのまま"error.ini"に移行した。
//
//@author nakanita
//@since 2008/03/07
//
//@param integer $code
//@access private
//@return string
//
//
//エラーメールを送信する
//
//@author nakanita
//@since 2008/03/07
//
//@param mixed $errormessage
//@access public
//@return void
//
//
//エラーの飛ばし先変更（開発用）
//
//@author nakanita
//@since 2008/03/07
//
//@param mixed $address
//@access public
//@return void
//
//
//mnglog_tbへの書き込み
//
//@author katsushi
//@since 2008/03/18
//
//引数の$H_dataの連想配列
//<code>
//$H_data = array("pactid" => int,
//"postid" => int,
//"postname" => string,
//"userid" => int,
//"username" => string,
//"targetpostid" => int,
//"comment1" => string,
//"comment2" => string,
//"kind" => string,
//"type" => string,
//"joker_flag" => int
//);
//</code>
//@param array $H_data
//@access public
//@return boolean
//
//
//shop_mnglog_tbへの書き込み
//
//@author nakanita
//@since 2008/09/01
//
//引数の$H_dataの連想配列
//<code>
//$H_data = array("shopid" => int,
//"groupid" => int,
//"memid" => int,
//"name" => string,
//"postcode" => string,
//"comment1" => string,
//"comment2" => string,
//"kind" => string,
//"type" => string,
//"joker_flag" => int
//);
//</code>
//@param array $H_data
//@access public
//@return boolean
//
//
//管理者側管理記録への書き込みメソッド
//
//@author ishizaki
//@since 2009/02/19
//
//引数の$H_dataの連想配列
//<code>
//$H_data = array(
//"shopid" => int,
//"shopname" => string,
//"username" => string,
//"kind" => string,
//"type" => string,
//"comment" => string
//);
//</code>
//@param array $H_data
//@access public
//@return void
//
//
//デストラクター
//
//@author nakanita
//@since 2008/04/01
//
//@access public
//@return void
//
class MtOutput {
	static O_Instance = undefined;
	static SITE_WEB = 1;
	static SITE_BATCH = 2;
	static Site;
	static STAGE_DEV = "DEV";
	static STAGE_TRY = "TRY";
	static STAGE_HON = "HON";
	static LVL_DEBUG = 1;
	static LVL_INFO = 2;
	static LVL_WARN = 4;
	static LVL_ERROR = 8;
	static LOGDIR = "/log/";
	static HLINDEX_I = "/Hotline/index.htm";
	static HLINDEX_D = "/Hotline/";
	static LoopCount = 0;
	static MAX_LOOP_COUNT = 10;

	static getSite() {
		return MtOutput.Site;
	}

	static getSiteAuto() {
		if (undefined !== _SERVER.SERVER_NAME == true) {
			return MtOutput.SITE_WEB;
		} else {
			return MtOutput.SITE_BATCH;
		}
	}

	getStage() {
		return this.stage;
	}

	setPactid(pactid) {
		this.H_Attach.pactid = pactid;
	}

	setLoginid(loginid) {
		this.H_Attach.loginid = loginid;
	}

	setUserid(userid) {
		this.H_Attach.userid = userid;
	}

	setShopid(shopid) {
		this.H_Attach.shopid = shopid;
	}

	setLanguage(language) {
		this.H_Attach.language = language;
	}

	getBuffer() {
		return this.A_MessageBuffer();
	}

	getBufferErrorCnt() {
		return this.BufferErrorCnt;
	}

	getBufferWarningCnt() {
		return this.BufferWarningCnt;
	}

	setSessInfo(H_my_session: {} | any[]) //セッション値を取得する
	{
		if (undefined !== H_my_session.pactid == true) {
			this.setPactid(H_my_session.pactid);
		}

		if (undefined !== H_my_session.loginid == true) {
			this.setLoginid(H_my_session.loginid);
		}

		if (undefined !== H_my_session.userid == true) {
			this.setUserid(H_my_session.userid);
		}

		if (undefined !== H_my_session.shopid == true) {
			this.setShopid(H_my_session.shopid);
		}

		if (undefined !== H_my_session.language == true) {
			this.setLanguage(H_my_session.language);
		}
	}

	setSessInfoWeb() {
		if (undefined !== _SESSION == true && this.getSite() == MtOutput.SITE_WEB) {
			this.setSessInfo(_SESSION);
		}
	}

	constructor(site0, H_param: {} | any[] = Array()) //共通設定を取得する
	//メール関連設定の取得
	//開発-Try-本番の別を得る
	//デフォルトのメール飛び先指定
	//メインに戻るエラーコードの指定
	//トップに戻るエラーコードの設定
	//配列の初期化
	//各ログの作成
	//// WEB側の場合
	{
		this.H_Attach = Array();
		MtOutput.Site = site0;
		this.O_Set = MtSetting.singleton();
		this.O_Set.loadConfig("mail");
		this.stage = this.O_Set.STAGE;
		this.ToMail = this.O_Set.mail_def_errorto;
		this.A_error_main = [7, 8, 9, 10, 32];
		this.A_error_topmenu = [1, 12, 34];
		this.H_Attach = Array();
		this.H_Attach.pactid = undefined;
		this.H_Attach.loginid = undefined;
		this.H_Attach.userid = undefined;
		this.H_Attach.shopid = undefined;
		this.A_MessageBuffer = Array();
		this.BufferWarningCnt = 0;
		this.BufferErrorCnt = 0;
		var logopt = {
			mode: 600,
			timeFormat: "%Y/%m/%d %X"
		};

		if (this.getSite() == MtOutput.SITE_WEB) //デバッグログの生成
			//Ｉｎｆｏログの生成
			//エラーログの生成
			{
				this.O_debuglog = Log.singleton("file", this.O_Set.KCS_DIR + MtOutput.LOGDIR + "debug.log", _SERVER.PHP_SELF, logopt);
				this.O_infolog = Log.singleton("file", this.O_Set.KCS_DIR + MtOutput.LOGDIR + "info.log", _SERVER.PHP_SELF, logopt);
				this.O_errlog = Log.singleton("file", this.O_Set.KCS_DIR + MtOutput.LOGDIR + "err.log", _SERVER.PHP_SELF, logopt);
			} else //共通スクリプトログの作成
			{
				this.O_ScriptCommonLog = Log.singleton("file", this.O_Set.script_common_log, _SERVER.PHP_SELF, logopt);
			}
	}

	set_ScriptLog(logfile) //ログの作成
	//スクリプトログの生成
	{
		var logopt = {
			mode: 600,
			timeFormat: "%Y/%m/%d %X"
		};
		this.O_ScriptLog = Log.singleton("file", logfile, _SERVER.PHP_SELF, logopt);
	}

	static singleton(site0 = "", H_param: {} | any[] = Array()) {
		if (site0 == "") //環境変数からサイトを取得
			{
				site0 = MtOutput.getSiteAuto();
			}

		if (MtOutput.O_Instance != undefined && MtOutput.Site != 0 && MtOutput.Site != site0) {
			MtOutput.O_Instance.errorOut(0, "MtOutput \u65E2\u306B\u7570\u306A\u308B\u30B5\u30A4\u30C8\u3067\u30A4\u30F3\u30B9\u30BF\u30F3\u30B9\u304C\u751F\u6210\u3055\u308C\u3066\u3044\u307E\u3059\u3001" + MtOutput.Site + " != " + site0);
		}

		if (MtOutput.O_Instance == undefined) {
			MtOutput.O_Instance = new MtOutput(site0, H_param);
		}

		return MtOutput.O_Instance;
	}

	addMain(err) {
		this.A_error_main.push(err);
	}

	debugOut(errstr, disp = 1) {
		var H_param = Array();
		H_param.disp = disp;
		this.put(errstr, MtOutput.LVL_DEBUG, H_param);
	}

	debugOutEx(errstr, disp = 1, tab = "\t") {
		var H_param = Array();
		H_param.disp = disp;

		if (true == is_null(errstr)) {
			this.put(tab + "null", MtOutput.LVL_DEBUG, H_param);
			return true;
		}

		if (true == Array.isArray(errstr)) {
			for (var key in errstr) {
				var value = errstr[key];

				if (true == Array.isArray(value)) {
					this.debugOut(tab + key + ":Array[", disp);
					this.debugOutEx(value, disp, tab + "\t");
					this.debugOut(tab + "]", disp);
				} else {
					this.debugOut(tab + key + ":" + value, disp);
				}
			}
		} else {
			this.put(tab + errstr, MtOutput.LVL_DEBUG, H_param);
		}
	}

	infoOut(errstr, disp = 1) {
		var H_param = Array();
		H_param.disp = disp;
		this.put(errstr, MtOutput.LVL_INFO, H_param);
	}

	warningOut(code, errstr = "", disp = 0) //このcodeはダミー、互換性のためだけにある
	//バッチの場合、標準出力する/しない
	{
		var H_param = Array();
		H_param.code = code;
		H_param.disp = disp;
		this.put(errstr, MtOutput.LVL_WARN, H_param);
	}

	errorOut(code, errstr = "", mailflg = 1, goto = "", buttonstr = "") {
		var H_param = Array();
		H_param.code = code;
		H_param.mailflg = mailflg;
		H_param.goto = goto;
		H_param.buttonstr = buttonstr;
		this.put(errstr, MtOutput.LVL_ERROR, H_param);
	}

	put(msg, level, H_param = Array()) //セッション値を取得
	{
		this.setSessInfoWeb();

		if ((level & MtOutput.LVL_DEBUG) != 0) {
			this.putDebug(msg, H_param);
		}

		if ((level & MtOutput.LVL_INFO) != 0) {
			this.putInfo(msg, H_param);
		}

		if ((level & MtOutput.LVL_WARN) != 0) {
			this.putWarn(msg, H_param);
		}

		if ((level & MtOutput.LVL_ERROR) != 0) {
			this.putError(msg, H_param);
		}
	}

	putDebug(msg, H_param) //開発中のみ出力
	{
		if (this.getStage() == MtOutput.STAGE_DEV) //表示フラグを得る
			//WEB側の処理
			{
				if (undefined !== H_param.disp && H_param.disp != 0) {
					var disp = 1;
				} else {
					disp = 0;
				}

				if (this.getSite() == MtOutput.SITE_WEB) //メッセージを整形する
					//デバッグログを吐く（5はnotice）
					{
						if (disp == 1) {
							this.dbgPrintPre(msg);
						}

						var out_msg = this.arrangeMessage(msg);

						if (this.O_Set.trace_level != 0) {
							this.O_debuglog.log("\"" + this.H_Attach.userid + ":" + out_msg + "\"", 5);
						}
					} else {
					if (disp == 1) //標準出力表示
						{
							this.dbgPrint(msg);
						}

					this.scriptOut(msg, 5);
				}
			}
	}

	putInfo(msg, H_param) //表示フラグを得る
	//WEB側の処理
	{
		if (undefined !== H_param.disp && H_param.disp != 0) {
			var disp = 1;
		} else {
			disp = 0;
		}

		if (this.getSite() == MtOutput.SITE_WEB) //メッセージを整形する
			//Infoログを吐く（5はnotice）
			{
				if (disp == 1) {
					this.dbgPrintPre(msg);
				}

				var out_msg = this.arrangeMessage(msg);

				if (this.O_Set.trace_level != 0) {
					this.O_infolog.log("\"" + this.H_Attach.userid + ":" + out_msg + "\"", 6);
				}
			} else {
			if (disp == 1) //標準出力表示
				{
					this.dbgPrint(msg);
				}

			this.scriptOut(msg, 6);
		}
	}

	putWarn(msg, H_param) //WEB側の処理
	{
		if (this.getSite() == MtOutput.SITE_WEB) //WARNINGの場合は画面表示が無いので、codeは全く使わない
			//ログには引数に付けたメッセージのみを出力する
			//メッセージを整形する
			//ワーニングログを吐く（4はワーニング）
			{
				var log_msg = this.arrangeMessage(msg);

				if (this.O_Set.trace_level != 0) {
					this.O_errlog.log("\"" + this.H_Attach.userid + ":" + log_msg + "\"", 4);
				}
			} else //表示フラグを得る
			//メッセージバッファに蓄える
			{
				if (undefined !== H_param.disp && H_param.disp != 0) {
					var disp = 1;
				} else {
					disp = 0;
				}

				if (disp == 1) //標準出力表示
					{
						this.dbgPrint(msg);
					}

				this.scriptOut(msg, 4);
				this.A_MessageBuffer.push(msg);
				this.BufferWarningCnt++;
			}
	}

	putError(msg, H_param) //WEB側の処理
	{
		if (this.getSite() == MtOutput.SITE_WEB) //エラーが無限ループに陥らないための安全処理
			//mailflgを得る
			//mailの有無によってログレベルを変える 3:Error, 4:Warning.
			//gotoを得る
			//グループとホットラインの対応
			//buttonstrを得る
			//ボタン名が「閉じる」だったならWindowを閉じる
			//引数に渡したメッセージは開発機でのみ画面に表示される
			//メッセージを整形する
			//ログには引数に付けたメッセージのみを出力する
			//エラーログを吐く
			//エラー時にはここで終了
			{
				if (++this.LoopCount > MtOutput.MAX_LOOP_COUNT) //エラー出力自体に何らかの異常があるのだから、直に表示する
					//とにかく強制的に終了する
					{
						this.displayError("MtOutput::putError, \u30A8\u30E9\u30FC\u56DE\u6570\u304C" + MtOutput.MAX_LOOP_COUNT + "\u4EF6\u3092\u8D8A\u3048\u307E\u3057\u305F.", 0);
						throw die(-1);
					}

				if (undefined !== H_param.code && H_param.code != "" && H_param.code != 0) {
					var code = H_param.code;

					if (undefined !== this.H_Attach.language == true && this.H_Attach.language == "ENG") {
						var code_msg = "CODE" + code + "\uFF1A" + this.getErrorMessage(code);
					} else {
						code_msg = "\u30B3\u30FC\u30C9" + code + "\uFF1A" + this.getErrorMessage(code);
					}
				} else //code=0 の場合は共通エラーを表示する。raiseの場合はこれ。
					{
						code_msg = this.getErrorMessage(0);
					}

				if (undefined !== H_param.mailflg && H_param.mailflg == 1) {
					var mailflg = 1;
					var loglevel = 3;
				} else {
					mailflg = 0;
					loglevel = 4;
				}

				if (undefined !== H_param.goto && H_param.goto != "") {
					var goto = H_param.goto;
				} else //Hotlineログインエラーの時はHotolineログインページへ　2013/6/13 houshiyama
					{
						goto = "";
						var A_url = parse_url(_SERVER.HTTP_REFERER);

						if (A_url.path == MtOutput.HLINDEX_I || A_url.path == MtOutput.HLINDEX_D) {
							goto = MtOutput.HLINDEX_D;
						}

						if (true == (undefined !== _COOKIE.type) && "H" == _COOKIE.type) {
							goto = MtOutput.HLINDEX_D;
						}
					}

				if (true == (undefined !== _COOKIE.gid) && true == is_numeric(_COOKIE.gid) && 1 < _COOKIE.gid) {
					var O_group = new GroupModel();

					if (true == (undefined !== _COOKIE.type) && "H" == _COOKIE.type) {
						goto = "/" + O_group.getGroupName(_COOKIE.gid) + "/hotline.php";
					} else {
						if ((goto == "/" || goto == "") && 7 < H_param.code) {
							goto = "/" + O_group.getGroupName(_COOKIE.gid);
						}
					}
				} else {
					if (true == (undefined !== _COOKIE.type) && "H" == _COOKIE.type) {
						goto = MtOutput.HLINDEX_D;
					}
				}

				if (undefined !== H_param.buttonstr && H_param.buttonstr != "") {
					var buttonstr = H_param.buttonstr;
				} else {
					if (undefined !== this.H_Attach.language == true) {
						if (this.H_Attach.language == "ENG") //デフォルトのボタン表記
							{
								buttonstr = "Back";
							} else //デフォルトのボタン表記
							{
								buttonstr = "\u623B \u308B";
							}
					} else //デフォルトのボタン表記
						{
							buttonstr = "\u623B \u308B Back";
						}
				}

				if (buttonstr == "\u9589\u3058\u308B") {
					goto = "JavaScript:window.close()";
				}

				var userid = this.H_Attach.userid;

				if (this.getStage() == MtOutput.STAGE_DEV) {
					var disp_msg = code_msg + "<br/>[\u958B\u767A\u30E1\u30C3\u30BB\u30FC\u30B8]=\"" + msg + "\"<br/>";
				} else //画面に出力するのはコードメッセージのみ（本番）
					{
						disp_msg = code_msg;
					}

				disp_msg = this.arrangeMessage(disp_msg);
				var log_msg = this.arrangeMessage(msg);

				if (this.O_Set.trace_level != 0) {
					this.O_errlog.log("\"" + userid + ":" + log_msg + "\"", loglevel);
				}

				if (this.O_Set.trace_level == 2) {
					this.O_debuglog.log(debug_backtrace(), 1);
				}

				if (mailflg == 1) {
					this.errorMail(disp_msg + "\n" + log_msg + "\n" + "from: " + _SERVER.PHP_SELF + "\nuserid: " + userid);
				}

				if (-1 !== this.A_error_topmenu.indexOf(code)) //20050221勝史追加
					//トップに戻るキーワード
					{
						goto = "GOTOP";
					}

				try {
					require("model/ActlogModel.php");

					var O_actlog = ActlogModel.singleton();
					O_actlog.setActlog("ERROR: " + msg, _SERVER.PHP_SELF, true, true);
				} catch (ex) //ここで生じた例外はその場で処理する、でないと無限ループに落ち込むので。
				{
					this.O_errlog.log("\"" + userid + ":" + ex.getMessage() + "\"", loglevel);
				}

				this.displayError(disp_msg, code, goto, buttonstr);
				throw die(-1);
			} else //標準出力表示、エラーの場合は必ず表示する
			//ログに出力
			//バッチ共通ログにも出力する
			//メッセージバッファに蓄える
			//バッチの場合、エラーであっても終了するわけではない
			{
				this.dbgPrint(msg);
				this.scriptOut(msg, 3);
				this.scriptCommonOut(msg);
				this.A_MessageBuffer.push(msg);
				this.BufferErrorCnt++;
			}
	}

	displayError(disp_msg, code = 0, goto = "", buttonstr = "\u623B \u308B") //利用直前に呼ぶ
	//この場合は正常終了とする
	{
		require("view/ViewError.php");

		var O_ViewError = new ViewError(this.H_Attach.shopid);
		O_ViewError.setErrorMain(this.A_error_main);
		O_ViewError.display(disp_msg, code, goto, buttonstr);
		throw die(0);
	}

	dbgPrintPre(msg) {
		print("<pre>");
		this.dbgPrint(msg);
		print("</pre>");
	}

	dbgPrint(msg) {
		if ("string" === typeof msg || "number" === typeof msg || "number" === typeof msg || "boolean" === typeof msg) {
			print(String(msg));
		} else if (Array.isArray(msg)) {
			console.log(msg);
		} else if ("object" === typeof msg) {
			if (is_callable(msg, "__toString")) {
				print(msg);
			} else {
				console.log(msg);
			}
		} else if (is_null(msg)) //null の場合、この文字列を表示する
			{
				print("(dbgPrint: null)");
			} else {
			console.log(msg);
		}
	}

	scriptCommonOut(msg, level = 5) //ログに出力
	//5:notice
	{
		this.O_ScriptCommonLog.log(msg, level);
	}

	scriptOut(msg, level) {
		if (false == is_null(this.O_ScriptLog)) {
			this.O_ScriptLog.log(msg, level);
		} else //未設定であれば共通ログファイルに出力
			{
				this.scriptCommonOut(msg, level);
			}
	}

	flushMessage(mail = true) //メッセージが無ければ
	//メール送信する
	{
		if (this.A_MessageBuffer.length == 0) //エラーが無ければ何もしない
			{
				return false;
			}

		var all_msg = "";

		for (var msg of Object.values(this.A_MessageBuffer)) {
			all_msg += msg + "\n";
		}

		if (mail == true) //ex : V2エラーメッセージ
			{
				this.errorMail(all_msg, this.O_Set.mail_error_subj);
			}

		this.A_MessageBuffer = Array();
		this.BufferWarningCnt = 0;
		this.BufferErrorCnt = 0;
		return true;
	}

	arrangeMessage(msg) //配列だったなら１列につなげる
	{
		if (Array.isArray(msg)) {
			msg = "array[" + msg.join(", ") + "]";
		}

		msg = preg_replace("/[\r\n]/", " ", msg);
		return msg;
	}

	getErrorMessage(code) //英語表示設定があるか否か
	//エラーコードは ERROR_(数字) という形式
	{
		if (undefined !== this.H_Attach.language == true && this.H_Attach.language == "ENG") //エラーメッセージの取得
			{
				this.O_Set.loadConfig("error_eng");
			} else //エラーメッセージの取得
			{
				this.O_Set.loadConfig("error");
			}

		var code_str = "ERROR_" + code;

		var retstr = this.O_Set.__get(code_str);

		return retstr;
	}

	errorMail(errormessage, subject = undefined) //ex: "info@motion.ne.jp"
	//ex: "株式会社モーション"
	//ex: info@kcs-next-dev.com
	//ex: KCS運営係
	//WEBの場合は、セッションを付加する
	{
		var O_mail_object = new MtMailUtil();
		var to = this.ToMail;
		var to_name = this.O_Set.mail_error_to_name;
		var from = this.O_Set.mail_error_from;
		var from_name = this.O_Set.mail_error_from_name;

		if (!subject) //ex : V2エラーメッセージ
			{
				subject = this.O_Set.mail_error_subj;
			}

		var message = errormessage;

		if (this.getSite() == MtOutput.SITE_WEB) {
			message += "\nHost: " + _SERVER.REMOTE_ADDR;
		}

		if (this.getStage() != MtOutput.STAGE_HON) {
			message += "\n\n\u30C6\u30B9\u30C8\u4E2D\u3067\u3059\u3002\n";
			message += "\u3082\u3057\u5C4A\u3044\u3066\u3082\u7121\u8996\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n\n";
		}

		message += "Stack Trace: \n";
		var A_trace = debug_backtrace();
		var idx = 0;

		for (var item of Object.values(A_trace)) {
			message += "[" + idx + "] file=" + item.file + "\n";
			message += "   class=" + item.class + "\n";
			message += "   line=" + item.line + "\n";
			message += "   function=" + item.function + "\n";
			idx++;
		}

		message += "\n";

		if (this.getSite() == MtOutput.SITE_WEB) {
			message += "Session Dump: \n";
			var sess = MtSession.singleton();
			var sess_serial = sess.getSerialize();
			message += sess_serial;
		}

		O_mail_object.sendByFlg(to, message, from, subject, from_name, to_name);
	}

	toMail(address) {
		this.ToMail = address;
	}

	writeMnglog(H_data: {} | any[]) {
		if (undefined !== H_data.pactid == false || is_numeric(H_data.pactid) == false) {
			this.errorOut(11, "mnglog\u306B\u306Fpactid\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.postid == false || is_numeric(H_data.postid) == false) {
			this.errorOut(11, "mnglog\u306B\u306Fpostid\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.userid == false || is_numeric(H_data.userid) == false) {
			this.errorOut(11, "mnglog\u306B\u306Fuserid\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.username == false) {
			this.errorOut(11, "mnglog\u306B\u306Fusername\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.comment1 == false) {
			this.errorOut(11, "mnglog\u306B\u306Fcomment1\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.kind == false) {
			this.errorOut(11, "mnglog\u306B\u306Fkind\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.type == false) {
			this.errorOut(11, "mnglog\u306B\u306Ftype\u304C\u5FC5\u8981", false);
		}

		var H_default = {
			pactid: undefined,
			postid: undefined,
			postname: undefined,
			userid: undefined,
			username: undefined,
			targetpostid: undefined,
			comment1: undefined,
			comment2: undefined,
			kind: undefined,
			type: undefined,
			joker_flag: 0,
			comment1_eng: undefined,
			comment2_eng: undefined
		};
		H_data = array_merge(H_default, H_data);

		if (H_data.joker_flag == "") {
			H_data.joker_flag = 0;
		}

		var O_db = MtDBUtil.singleton();
		var sql = "insert into mnglog_tb(" + "pactid," + "postid," + "postname," + "userid," + "username," + "targetpostid," + "recdate," + "comment1," + "comment2," + "kind," + "type," + "joker_flag," + "comment1_eng," + "comment2_eng " + ") values(" + O_db.dbQuote(H_data.pactid, "integer", true) + "," + O_db.dbQuote(H_data.postid, "integer", true) + "," + O_db.dbQuote(H_data.postname, "text") + "," + O_db.dbQuote(H_data.userid, "integer", true) + "," + O_db.dbQuote(H_data.username, "string", true) + "," + O_db.dbQuote(H_data.targetpostid, "integer") + "," + O_db.dbQuote(date("Y-m-d H:i:s"), "timestamp") + "," + O_db.dbQuote(H_data.comment1, "string", true) + "," + O_db.dbQuote(H_data.comment2, "string") + "," + O_db.dbQuote(H_data.kind, "string", true) + "," + O_db.dbQuote(H_data.type, "string", true) + "," + O_db.dbQuote(H_data.joker_flag, "integer") + "," + O_db.dbQuote(H_data.comment1_eng, "string", true) + "," + O_db.dbQuote(H_data.comment2_eng, "string") + ")";
		var cnt = O_db.exec(sql);

		if (cnt < 1) {
			this.warningOut(11, "mnglog\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557", 1);
			return false;
		}

		return true;
	}

	writeShopMnglog(H_data: {} | any[]) {
		if (undefined !== H_data.shopid == false || is_numeric(H_data.shopid) == false) {
			this.errorOut(11, "shop_mnglog\u306B\u306Fshopid\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.groupid == false || is_numeric(H_data.groupid) == false) {
			this.errorOut(11, "shop_mnglog\u306B\u306Fgroupid\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.memid == false || is_numeric(H_data.memid) == false) {
			this.errorOut(11, "shop_mnglog\u306B\u306Fmemid\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.name == false) {
			this.errorOut(11, "shop_mnglog\u306B\u306Fname\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.comment1 == false) {
			this.errorOut(11, "shop_mnglog\u306B\u306Fcomment1\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.kind == false) {
			this.errorOut(11, "shop_mnglog\u306B\u306Fkind\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.type == false) {
			this.errorOut(11, "shop_mnglog\u306B\u306Ftype\u304C\u5FC5\u8981", false);
		}

		var H_default = {
			shopid: undefined,
			groupid: undefined,
			memid: undefined,
			name: undefined,
			postcode: undefined,
			comment1: undefined,
			comment2: undefined,
			kind: undefined,
			type: undefined,
			joker_flag: 0
		};
		H_data = array_merge(H_default, H_data);

		if (H_data.joker_flag == "") {
			H_data.joker_flag = 0;
		}

		var O_db = MtDBUtil.singleton();
		var sql = "insert into shop_mnglog_tb(" + "shopid," + "groupid," + "memid," + "name," + "postcode," + "recdate," + "comment1," + "comment2," + "kind," + "type," + "joker_flag " + ") values(" + O_db.dbQuote(H_data.shopid, "integer", true) + "," + O_db.dbQuote(H_data.groupid, "integer", true) + "," + O_db.dbQuote(H_data.memid, "integer", true) + "," + O_db.dbQuote(H_data.name, "string", true) + "," + O_db.dbQuote(H_data.postcode, "string") + "," + O_db.dbQuote(date("Y-m-d H:i:s"), "timestamp") + "," + O_db.dbQuote(H_data.comment1, "string", true) + "," + O_db.dbQuote(H_data.comment2, "string") + "," + O_db.dbQuote(H_data.kind, "string", true) + "," + O_db.dbQuote(H_data.type, "string", true) + "," + O_db.dbQuote(H_data.joker_flag, "integer") + ")";
		var cnt = O_db.exec(sql);

		if (cnt < 1) {
			this.warningOut(11, "shop_mnglog\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557", 1);
			return false;
		}

		return true;
	}

	writeAdminMnglog(H_data: {} | any[]) {
		if (undefined !== H_data.shopid == false || is_numeric(H_data.shopid) == false) {
			this.errorOut(11, "admin_mnglog\u306B\u306Fshopid\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.shopname == false) {
			this.errorOut(11, "admin_mnglog\u306B\u306Fshopname\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.username == false) {
			this.errorOut(11, "admin_mnglog\u306B\u306Fusername\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.kind == false) {
			this.errorOut(11, "admin_mnglog\u306B\u306Fkind\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.type == false) {
			this.errorOut(11, "admin_mnglog\u306B\u306Ftype\u304C\u5FC5\u8981", false);
		}

		if (undefined !== H_data.comment == false) {
			this.errorOut(11, "shop_mnglog\u306B\u306Fcomment\u304C\u5FC5\u8981", false);
		}

		var H_default = {
			shopid: undefined,
			shopname: undefined,
			username: undefined,
			kind: undefined,
			type: undefined,
			comment: undefined
		};
		H_data = array_merge(H_default, H_data);
		var O_db = MtDBUtil.singleton();
		var sql = "INSERT INTO admin_mnglog_tb(" + "shopid," + "shopname," + "username," + "kind," + "type," + "comment," + "recdate" + ") VALUES (" + O_db.dbQuote(H_data.shopid, "integer", true) + "," + O_db.dbQuote(H_data.shopname, "string", true) + "," + O_db.dbQuote(H_data.username, "string", true) + "," + O_db.dbQuote(H_data.kind, "string", true) + "," + O_db.dbQuote(H_data.type, "string", true) + "," + O_db.dbQuote(H_data.comment, "string", true) + "," + O_db.dbQuote(date("Y-m-d H:i:s"), "timestamp") + ")";
		var cnt = O_db.exec(sql);

		if (cnt < 1) {
			this.warningOut(11, "admin_mnglog\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557", 1);
			return false;
		}

		return true;
	}

	__destruct() //特に何もしない
	{}

};