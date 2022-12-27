//
//エラークラス
//
//修正2004/06/25 中西 SHOPエラー時の戻り先追加.
//修正2004/06/29 森原 メインメニューに戻るエラー種別を追加可能に
//修正2004/07/09 宮澤 ワーニング画面の戻り先を指定できるように変更
//修正2004/07/30 宮澤 エラー画面の戻るボタンの文言を指定できるように変更
//修正2005/02/21 勝史 エラー画面からトップメニューにもどる機能を追加
//修正2006/12/06 石崎 二重ログイン防止用エラーコードを A_error_topmenu に追加
//修正2009/02/02 石崎　エラー時の戻りURLのグループ化抜け
//修正2009/08/12 宮澤　別ドメイン対応
//
//@filesource
//@package Base
//@subpackage ErrorUtility
//@since 2004/04/01
//@author 宮澤
//
//
//別ドメイン対応 20090812miya
//
//エラークラス
//
//修正2004/06/25 中西 SHOPエラー時の戻り先追加.
//修正2004/06/29 森原 メインメニューに戻るエラー種別を追加可能に
//修正2004/07/09 宮澤 ワーニング画面の戻り先を指定できるように変更
//修正2004/07/30 宮澤 エラー画面の戻るボタンの文言を指定できるように変更
//修正2005/02/21 勝史 エラー画面からトップメニューにもどる機能を追加
//修正2006/12/06 石崎 二重ログイン防止用エラーコードを A_error_topmenu に追加
//修正2009/02/02 石崎　エラー時の戻りURLのグループ化抜け
//修正2009/08/12 宮澤　別ドメイン対応
//
//@package Base
//@subpackage ErrorUtility
//@since 2004/04/01
//@author 宮澤
//

require("common.php");

require("DB.php");

require("db.conf");

require("MailUtil.php");

require("Log.php");

require("mail.conf");

require("model/GroupModel.php");

require("MtSetting.php");

//
//ホットラインログインページのパス<br>
//index.htm又はHotline/<br>
//
//
//エラーメッセージ
//
//@var mixed
//@access public
//
//
//エラーオブジェクト
//
//@var mixed
//@access public
//
//
//エラーメールの飛ばし先
//
//@var mixed
//@access public
//
//
//メインメニューに戻るエラー種別 20040629森原追加
//
//@var mixed
//@access public
//
//
//コンストラクタ
//
//@return void
//
//※参考：Pearのエラー処理はこんな感じ
//PEAR_Error($message, $code, $mode, $options, $userinfo)
//20040629森原追加ここから
//機能：メインメニューに戻るエラー種別を追加する
//引数：エラー種別
//
//addMain
//
//@author ishizaki
//@since 2008/02/06
//
//@param mixed $err
//@access public
//@return void
//
//20040629森原追加ここまで
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//エラー出力
//
//[引　数] $code：エラーコード
//$errstr：個別のエラーメッセージ（プログラム側で個別に指定できる）
//$mailflg：エラーフラグ（1ならエラー、0かそれ以外ならワーニング）
//[返り値] $：なし
//エラー処理：エラーログ吐く→メール飛ばす→エラー画面表示→処理停止
//ワーニング処理：ワーニングログを吐く→ワーニング画面表示→処理停止
//個別のエラーメッセージはログとメールに表示される。DBから引いてくるエラーメッセージはお客様用として画面に表示する。
//なお、$O_errlogに投げることのできるのは以下の数値。
//0：[emergency]
//1：[alert]
//2：[critical]
//3：[error]
//4：[warning]
//5：[notice]
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ワーニングでログだけ吐く
//
//[引　数] $code：エラーコード
//$errstr：個別のエラーメッセージ（プログラム側で個別に指定できる）
//$displayflg： 画面を出すか出さないか（1なら出す）
//$goto：戻るボタンの飛び先URL
//[返り値] $：なし
//ワーニング処理：処理停止→ワーニングログを吐く
//errorOutのヴァリアント。ワーニングでログだけ出す場合に使う
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//エラーメッセージ取得SQL
//
//[引　数] $code：エラーコード
//[返り値] $returnmsg：エラーメッセージ
//DBからメッセージ取得するのを止め、V3と同じく設定ファイルからメッセージを取得するように変更　20090414 houshi
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//エラーメール
//
//[引　数] $errormessage：エラーメッセージ
//[返り値] 無
//MailUtilクラスを使用して、mail.motion.ne.jp経由でSMTP送信
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//エラー画面表示
//
//[引　数] $message：エラーメッセージ
//$code：エラーコード
//$goro：戻り先
//[返り値] 無
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//エラーの飛ばし先変更（開発用）
//
//[引　数] $address：プロパティのアドレスをこれに変更
//[返り値] 無
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
class ErrorUtil {
	static HLINDEX_I = "/Hotline/index.htm";
	static HLINDEX_D = "/Hotline/";

	ErrorUtil() //20040629森原追加
	{
		var logopt = {
			mode: 600,
			timeFormat: "%Y/%m/%d %X"
		};
		this.O_errlog = Log.singleton("file", KCS_DIR + "/log/err.log", _SERVER.PHP_SELF, logopt);
		this.to_mail = GLOBALS.def_errorto;
		this.A_error_main = [7, 8, 9, 10, 32];
		this.A_error_topmenu = [1, 12];
	}

	addMain(err) {
		this.A_error_main.push(err);
	}

	errorOut(code, errstr = "", mailflg = 1) //ログ吐き出しオブジェクト
	//グループとホットラインの対応
	//画面表示
	{
		if (undefined !== _SESSION.language == true && _SESSION.language == "ENG") {
			var message = "CODE" + code + "\uFF1A" + this.getErrorMessage(code);
		} else {
			message = "\u30B3\u30FC\u30C9" + code + "\uFF1A" + this.getErrorMessage(code);
		}

		if (mailflg == 1) //1ならエラー
			//エラーログを吐く（3はエラー）
			//メール吐く
			{
				this.O_errlog.log("\"" + _SESSION.userid + ":" + message + errstr + "\"", 3);
				this.errorMail(message + errstr + "\nfrom: " + _SERVER.PHP_SELF + "\nuserid: " + _SESSION.userid);
			} else //0かそれ以外ならワーニング。メールは吐かない
			//エラーログを吐く（3はエラー）
			{
				this.O_errlog.log("\"" + _SESSION.userid + ":" + message + errstr + "\"", 3);
			}

		if (-1 !== this.A_error_topmenu.indexOf(code)) //20050221勝史追加
			{
				var go = "GOTOP";
			} else //Hotlineログインエラーの時はHotolineログインページへ　2008/4/22 houshiyama
			{
				go = "";
				var A_url = parse_url(_SERVER.HTTP_REFERER);

				if (A_url.path == ErrorUtil.HLINDEX_I || A_url.path == ErrorUtil.HLINDEX_D) {
					go = ErrorUtil.HLINDEX_D;
				}
			}

		if (true == (undefined !== _COOKIE.gid) && true == is_numeric(_COOKIE.gid) && 1 < _COOKIE.gid) {
			var O_group = new GroupModel();

			if (true == (undefined !== _COOKIE.type) && "H" == _COOKIE.type) {
				go = "/" + O_group.getGroupName(_COOKIE.gid) + "/hotline.php";
			} else {
				if (go != "GOTOP") {
					go = "/" + O_group.getGroupName(_COOKIE.gid);

					if (undefined !== _SESSION.pid && is_numeric(_SESSION.pid)) {
						var auth = new Authority();

						if (auth.chkPactAuth(206, _SESSION.pid)) {
							go += "/" + auth.getUseridIni(_SESSION.pid) + "/";
						}
					}
				}
			}
		} else {
			if (true == (undefined !== _COOKIE.type) && "H" == _COOKIE.type) {
				go = ErrorUtil.HLINDEX_D;
			}
		}

		this.errorView(message, code, go);
	}

	warningOut(code, errstr = "", displayflg = 1, goto = "", buttonstr = "\u623B \u308B") //$displayflgのデフォルト値を1にした 20070723miya
	{
		if (undefined !== _SESSION.language == true && _SESSION.language == "ENG") {
			var message = "CODE" + code + "\uFF1A" + this.getErrorMessage(code);
		} else {
			message = "\u30B3\u30FC\u30C9" + code + "\uFF1A" + this.getErrorMessage(code);
		}

		if (displayflg == 1) //1なら画面表示する。
			//==じゃなくて=になっていたのを修正。またログの$messageと$errstrの間に"："を追加した 20070720miya
			//ワーニングログを吐く（4はワーニング）
			//個別のエラーメッセージを表示すると、エラーメールやログに吐いているpactidなどがお客様の目に触れるのでコメントアウトしておく（現状は個別のエラーは画面表示しない前提で使われている） 20070723miya
			//if ($errstr != "") {	// 画面表示修正 20070720miya
			//$message.= "<BR><BR>" . $errstr;
			//}
			//画面表示 20040730miya修正
			{
				this.O_errlog.log("\"" + _SESSION.userid + ":" + message + "\uFF1A" + errstr + "\"", 4);
				this.errorView(message, code, goto, buttonstr);
			} else //ワーニングログを吐く（4はワーニング）
			{
				this.O_errlog.log("\"" + _SESSION.userid + ":" + message + "\uFF1A" + errstr + "\"", 4);
			}
	}

	getErrorMessage(code) //// DBクラスを呼べない（呼ぶとループになってしまう）ので独自に接続
	//		$O_errdb = DB::connect( $GLOBALS["G_dsn"], $GLOBALS["H_dboption"]);
	//		// SQL文
	//		$sql_str = "SELECT message FROM error_tb WHERE code=" . $code;
	//		// DB接続エラーを検出してエラーメッセージを出力
	//		//if ( DB::isError( $O_errdb )  == true) {
	//		if ( DB::isError( $O_errdb )  == true) {
	//			$returnmsg = "エラークラスでのDB接続エラーが発生しました";
	//		}
	//		// 一行目一列目の値をgetOne()で取っている
	//		$returnmsg = $O_errdb->getOne($sql_str);
	//		// SQLエラーを検出してエラーメッセージを出力
	//		if ( $O_errdb->isError($returnmsg)  == true) {
	//			$returnmsg = "エラークラスでSQLエラーが発生：エラーメッセージの取得に失敗しました" . $sql_str;
	//		}
	//		// 取得結果が空だった場合
	//		if ( $returnmsg === "" ) {
	//			$returnmsg = "エラークラスでエラーメッセージの取得に失敗しました。エラーメッセージがありません";
	//		}
	//		// エラーメッセージを返す
	//		return $returnmsg;
	{
		if (undefined !== _SESSION.language == true && _SESSION.language == "ENG") {
			var A_mess = file(KCS_DIR + "/conf_sync/error_eng.ini");
		} else {
			A_mess = file(KCS_DIR + "/conf_sync/error.ini");
		}

		var H_mess = Array();

		for (var cnt = 0; cnt < A_mess.length; cnt++) {
			if (preg_match("/=/", A_mess[cnt]) == true) {
				var A_row = split("=", A_mess[cnt]);
				H_mess[A_row[0].trim()] = A_row[1];
			}
		}

		return H_mess["ERROR_" + code];
	}

	errorMail(errormessage) //エラーメールは別に送信設定　2008/11/12 houshiyama
	//ex: "info@motion.ne.jp"
	//ex: "株式会社モーション"
	//ex: "v2@kcs.motion.ne.jp"
	//ex: "KCS運営係"
	//$message = "テスト中です。\n";
	//$message .= "もし届いても無視してください。\n\n";
	{
		var O_mail_object = new MailUtil();

		if (GLOBALS.G_err_mailsend == 1) {
			GLOBALS.G_mailsend = 1;
		}

		var to = this.to_mail;
		var to_name = "\u682A\u5F0F\u4F1A\u793E\u30E2\u30FC\u30B7\u30E7\u30F3";
		var from = "info@kcs-next-dev.com";
		var from_name = "KCS\u904B\u55B6\u4FC2";
		var subject = GLOBALS.mail_error_subj;
		var message = errormessage;
		message += "\nHost: " + _SERVER.REMOTE_ADDR;
		O_mail_object.send(to, message, from, subject, from_name, to_name);
	}

	errorView(errormessage, code = false, goto = "", buttonstr = "\u623B \u308B") //エラー時の戻り先の指定.
	//if($code == 7 || $code == 8 || $code == 9 || $code == 10){
	//DEBUG *
	//		print( "<HTML><HEAD></HEAD><BODY>" );
	//		print( $errormessage );
	//		print( "<BR><BR><a href=\"javascript:history.back()\">戻る</a>" );
	//		print( "</BODY></HTML>" );
	{
		if (undefined !== _SESSION.language == true && _SESSION.language == "ENG" && buttonstr == "\u623B \u308B") {
			buttonstr = "Back";
		}

		require("Smarty.class.php");

		var O_smarty = new Smarty();
		O_smarty.template_dir = COMMON_SMARTY_DIR;
		O_smarty.compile_dir = COMMON_SMARTY_COMPILE;
		O_smarty.cache_dir = COMMON_SMARTY_CACHE;

		if (goto != "") //戻り先の指定があればそこへ 20040709miya修正
			{
				if (goto == "GOTOP") //ショップから来た場合はショップのトップに戻る.20061006naka修正
					{
						if (_SESSION.shopid != "" || preg_match("/^\\/Shop/", _SERVER.PHP_SELF)) //"/Shop"以下で実行
							//ショップから来た場合はショップのメニューに戻る.
							{
								var backurl = "/Shop/menu.php";
							} else //通常メニューに戻る.
							{
								backurl = "/Menu/menu.php";
							}
					} else {
					backurl = goto;
				}
			} else //戻り先の指定がなければ場合によって違う
			{
				if (-1 !== this.A_error_main.indexOf(code)) //20040629森原修正
					//別ドメイン対応 20090812miya
					{
						var O_group = new GroupModel();
						var O_conf = MtSetting.singleton();
						O_conf.loadConfig("group");

						if (true == O_conf.existsKey("groupid" + _SESSION.groupid + "_is_original_domain") && true == O_conf["groupid" + _SESSION.groupid + "_is_original_domain"]) {
							var original_domain = true;
						} else {
							original_domain = false;
						}

						if (_SESSION.shopid != "" || preg_match("/^\\/Shop/", _SERVER.PHP_SELF)) //"/Shop"以下で実行
							//ショップから来た場合はショップのトップに戻る.
							{
								if (1 < _SESSION.groupid && false == original_domain) {
									backurl = "/" + O_group.getGroupName(_SESSION.groupid) + "/index_shop.php";
								} else {
									backurl = "/index_shop.php";
								}
							} else //通常の場合は通常トップに戻る.
							{
								if ("H" == _SESSION.pacttype) {
									if (1 < _SESSION.groupid && false == original_domain) {
										backurl = "/" + O_group.getGroupName(_SESSION.groupid) + "/hotline.php";
									} else {
										backurl = "/Hotline";
									}
								} else {
									if (1 < _SESSION.groupid && false == original_domain) {
										backurl = "/" + O_group.getGroupName(_SESSION.groupid);
										var auth = new Authority();

										if (auth.chkPactAuth(206, _SESSION.pid)) {
											backurl += "/" + auth.getUseridIni(_SESSION.pid) + "/";
										}
									} else {
										backurl = "/";
									}
								}
							}
					} else //メニューに戻る.
					{
						if (file_exists(dirname(_SERVER.SCRIPT_FILENAME) + "/menu.php") == true) {
							backurl = dirname(_SERVER.PHP_SELF) + "/menu.php";
						} else //１つ前に戻る.
							{
								backurl = "javascript:history.back();";
							}
					}
			}

		O_smarty.assign("backurl", backurl);
		O_smarty.assign("msg", errormessage);
		O_smarty.assign("buttonstr", buttonstr);
		O_smarty.display("err.tpl");

		if (G_traceflg == 1) //トレースフラグが1ならバックトレースログを吐く
			{
				var O_debuglog = Log.singleton("file", KCS_DIR + "/log/debug.log", _SERVER.PHP_SELF, 1);
				O_debuglog.log(debug_backtrace(), 1);
			}

		throw die();
	}

	toMail(address) {
		this.to_mail = address;
	}

};