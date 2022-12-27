//
//機能権限クラス
//
//権限関連のクラスライブラリ
//
//更新履歴：<br>
//2008/04/09 上杉勝史 作成<br>
//
//@package Base
//@subpackage Authority
//@filesource
//@author katsushi
//@since 2008/04/09
//
//
//require_once("model/TelModel.php");
//
//機能権限クラス
//
//権限関連のクラスライブラリ
//
//@package Base
//@subpackage Authority
//@filesource
//@author katsushi
//@since 2008/04/09
//

require("MtExcept.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtBusinessDay.php");

require("model/FuncModel.php");

require("model/PactModel.php");

require("model/PostModel.php");

//
//インスタンス生成確認用
//
//@var object
//@access private
//@static
//
//
//O_Out
//
//@var mobjectixed
//@access private
//
//
//O_Setting
//
//@var object
//@access private
//
//
//O_Biz
//
//@var object
//@access private
//
//
//O_Func
//
//@var object
//@access private
//
//
//O_Post
//
//@var object
//@access private
//
//
//Pactid
//
//@var pactid
//@access private
//
//
//会社権限
//
//@var array
//@access private
//
//
//ユーザ権限
//
//@var array
//@access private
//
//
//現在時間
//
//@var string
//@access private
//
//
//営業区分
//
//@var string
//@access private
//
//
//夜間営業フラグ
//
//@var boolean
//@access private
//
//
//Jokerフラグ
//
//@var boolean
//@access private
//
//
//コンストラクタ<br>
//実行順番は変更してはいけない
//
//@access public
//@return void
//
//
//singletonパターン<br>
//必ず一つだけしかインスタンスを生成しない為の実装<br>
//pact毎にsingletonでオブジェクトが生成
//
//@author katsushi
//@since 2008/04/08
//
//@param integer $pactid
//@param boolean $joker
//@static
//@access public
//@return self::$O_Instance
//
//
//getOut
//
//@author katsushi
//@since 2008/04/08
//
//@access public
//@return object
//
//
//getSetting
//
//@author katsushi
//@since 2008/04/08
//
//@access public
//@return object
//
//
//getFunc
//
//@author katsushi
//@since 2008/04/09
//
//@access public
//@return object
//
//
//getPostModel
//
//@author katsushi
//@since 2008/04/10
//
//@access public
//@return object
//
//
//setJoker
//
//@author katsushi
//@since 2008/04/09
//
//@param boolean $bool
//@access public
//@return void
//
//
//setExtend
//
//@author katsushi
//@since 2008/04/09
//
//@param boolean $bool
//@access public
//@return void
//
//
//gExtend
//
//@author katsushi
//@since 2008/04/10
//
//@access public
//@return boolean
//
//
//checkExtend
//
//@author katsushi
//@since 2008/04/09
//
//@access private
//@return void
//
//
//setHelpFunc
//
//@author katsushi
//@since 2008/10/21
//
//@param mixed $userid
//@param mixed $hhmm
//@access public
//@return void
//
//
//setHelpFromId
//
//@author katsushi
//@since 2008/11/10
//
//@param mixed $fncid
//@access public
//@return void
//
//
//setHelpFromIni
//
//@author katsushi
//@since 2008/11/10
//
//@param mixed $ininame
//@access public
//@return void
//
//
//setHelpFile
//
//@author katsushi
//@since 2008/11/10
//
//@param mixed $helpfile
//@access public
//@return void
//
//
//gBizType
//
//@author katsushi
//@since 2008/04/10
//
//@access public
//@return void
//
//
//resetBizType
//
//@author katsushi
//@since 2008/04/10
//
//@param integer $year
//@param integer $month
//@param integer $day
//@param integer $hour
//@access public
//@return void
//
//
//gFuncPact
//
//@author katsushi
//@since 2008/04/09
//
//@param string $hhmm
//@access public
//@return array
//
//
//gFuncUser
//
//@author katsushi
//@since 2008/04/09
//
//@param integer $userid
//@param string $hhmm
//@access public
//@return array
//
//
//sFuncPact
//
//@author katsushi
//@since 2008/04/09
//
//@param array $H_fnc
//@param string $hhmm
//@access public
//@return void
//
//
//sFuncUser
//
//@author katsushi
//@since 2008/04/09
//
//@param integer $userid
//@param array $H_fnc
//@param string $hhmm
//@access public
//@return void
//
//
//setHHMM
//
//@author katsushi
//@since 2008/04/08
//
//@param string $hhmm default = null jokerならtrueを入れる
//@access public
//@return void
//
//
//gHHMM
//
//@author katsushi
//@since 2008/04/08
//
//@access public
//@return string
//
//
//時間で取得してあった権限をクリアする
//
//@author katsushi
//@since 2008/04/10
//
//@access public
//@return void
//
//
//全ての会社権限を取得してメンバー変数に格納する<br>
//時間(HHMM)は考慮しない
//
//@author katsushi
//@since 2008/04/08
//
//@access public
//@return void
//
//
//全てのユーザー権限を取得してメンバー変数に格納する<br>
//時間(HHMM)は考慮しない
//
//@author katsushi
//@since 2008/04/09
//
//@param integer $userid
//@access public
//@return void
//
//
//会社権限を連想配列で取得<br>
//キー: ininame, 値: fncid
//
//@author katsushi
//@since 2008/04/08
//
//@param string $hhmm
//@access public
//@return void
//
//
//会社権限(ininame)を配列で取得
//
//@author katsushi
//@since 2008/04/10
//
//@param string $hhmm
//@access public
//@return array
//
//
//会社権限(fncid)を配列で取得
//
//@author katsushi
//@since 2008/04/10
//
//@param string $hhmm
//@access public
//@return array
//
//
//会社権限の存在チェック<br>
//ininameで調べる
//
//@author katsushi
//@since 2008/04/09
//
//@param string $ininame
//@param string $hhmm
//@access public
//@return void
//
//
//会社権限の存在チェック<br>
//fncidで調べる
//
//@author katsushi
//@since 2008/04/09
//
//@param integer $fncid
//@param string $hhmm
//@access public
//@return void
//
//
//ユーザー権限を連想配列で取得<br>
//キー: ininame, 値: fncid
//
//@author katsushi
//@since 2008/04/09
//
//@param integer $userid
//@param string $hhmm
//@access public
//@return void
//
//
//ユーザー権限(ininame)を配列で取得
//
//@author katsushi
//@since 2008/04/10
//
//@param integer $userid
//@param string $hhmm
//@access public
//@return array
//
//
//ユーザー権限(fncid)を配列で取得
//
//@author katsushi
//@since 2008/04/10
//
//@param integer $userid
//@param string $hhmm
//@access public
//@return array
//
//
//ユーザー権限の存在チェック<br>
//ininameで調べる
//
//@author katsushi
//@since 2008/04/09
//
//@param integer $userid
//@param string $ininame
//@param string $hhmm
//@access public
//@return boolean
//
//
//ユーザー権限の存在チェック<br>
//fncidで調べる
//
//@author katsushi
//@since 2008/04/09
//
//@param integer $userid
//@param integer $fncid
//@param string $hhmm
//@access public
//@return boolean
//
//
//ユーザー権限の存在チェック<br>
//pathで調べる
//
//@author katsushi
//@since 2008/04/10
//
//@param integer $userid
//@param string $path
//@param string $hhmm
//@access public
//@return boolean
//
//
//指定されたユーザーが指定された部署の配下にいるかどうかを調べる
//
//@author katsushi
//@since 2008/04/10
//
//@param integer $target_userid
//@param integer $targer_postid
//@access public
//@return boolean
//
//
//指定された部署配下と自分を承認先に指定している部署IDを配列で返す
//
//@param int $orderid 受付番号、必須
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@return Array 部署IDの配列
//
//
//指定されたユーザが配下にいるかどうか
//
//@param int $targetuserid ユーザID
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@return bool true,false
//
//
//指定された電話番号が配下にいるかどうか
//
//2004.07.02 by suehiro : $telno と $carid で識別するように対応
//2004.09.14 by suehiro : 不要部分削除
//2004.09.14 by suehiro : false 時のロジックの最適化
//
//@param int $targettelno 電話番号(ハイフンなし)
//@param int $carid 電話会社
//@param int $tableno default = "" テーブル番号(tel_X_tb)
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@return bool true,false
//
//
//指定された予約電話番号が配下にいるかどうか
//
//@param int $targettelno 電話番号(ハイフンなし)
//@param int $carid 電話会社
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@return bool true,false
//
//
//指定されたETC番号が配下にいるかどうか
//
//@param int $etc_cardno ETCカード番号(ハイフンなし)
//@param int $tableno default = "" テーブル番号(tel_X_tb)
//@param int $postid default = "" 部署ＩＤ
//@param int $pactid default = "" 企業コード
//@return bool true,false
//
//
//表示言語取得関数
//（権限から決定）
//
//@author houshiyama
//@since 2008/11/28
//
//@param mixed $userid
//@access public
//@return void
//
class MtAuthority {
	static OH_Instance = Array();

	constructor(pactid) //アウトプット
	//設定
	//権限モデル
	//部署モデル
	//営業区分
	//pactid
	//配列初期化
	//フラグ変数初期化
	//現在時間の設定
	//最初に全部の会社権限を読み込む
	//夜間注文フラグを設定
	{
		this.O_Out = MtOutput.singleton();
		this.O_Setting = MtSetting.singleton();
		this.getSetting().loadConfig("define");
		this.O_Func = new FuncModel();
		this.O_Post = new PostModel();
		this.O_Biz = new MtBusinessDay();
		this.BizType = this.O_Biz.chkBusinessType();
		this.Pactid = pactid;
		this.H_FuncPact = Array();
		this.H_FuncUser = Array();
		this.setJoker(false);
		this.setExtend(false);
		this.setHHMM();
		this.setAllPactFunc();
		this.checkExtend();
	}

	static singleton(pactid) {
		if (is_numeric(pactid) == false) {
			MtExcept.raise("MtAuthority::singleton() \u5F15\u6570(pactid)\u304C\u306A\u3044");
			throw die(-1);
		}
	}

	getOut() {
		return this.O_Out;
	}

	getSetting() {
		return this.O_Setting;
	}

	getFuncModel() {
		return this.O_Func;
	}

	getPostModel() {
		return this.O_Post;
	}

	setJoker(bool = true) {
		if (bool == true) {
			this.Joker = true;
			this.setExtend(false);
			this.setHHMM(this.getSetting().joker_time);
		} else {
			this.Joker = false;
			this.setHHMM();
		}
	}

	setExtend(bool = true) {
		if (bool == true) {
			this.Extend = true;
		} else {
			this.Extend = false;
		}
	}

	gExtend() {
		return this.Extend;
	}

	checkExtend() {
		if (this.gBizType() == "extend" && this.chkPactFuncIni("fnc_extend", "all") == true) {
			this.setExtend(true);
		} else {
			this.setExtend(false);
		}
	}

	setHelpFunc(userid, hhmm = "") {
		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (undefined !== GLOBALS.G_HELP_DISPLAY == false) {
			if (this.chkUserFuncIni(userid, "fnc_help", hhmm) == true) {
				GLOBALS.G_HELP_DISPLAY = true;
				this.setHelpFile();
			} else {
				GLOBALS.G_HELP_DISPLAY = false;
			}
		}
	}

	setHelpFromId(fncid) {
		this.setHelpFile(this.getFuncModel().getHelpFromId(fncid));
	}

	setHelpFromIni(ininame) {
		this.setHelpFile(this.getFuncModel().getHelpFromIni(ininame));
	}

	setHelpFile(helpfile = "help.pdf") {
		if (helpfile != "") {
			GLOBALS.G_HELP_FILE = helpfile;
		}

		if (undefined !== _SESSION.pacttype == true && _SESSION.pacttype == "H") {
			GLOBALS.G_HELP_FILE = "Hotline/" + GLOBALS.G_HELP_FILE;
		}

		if (undefined !== _SESSION.helpfile == true && _SESSION.helpfile == "on" && _SESSION.pactid != "") //存在確認
			{
				if (undefined !== _SESSION.pacttype == true && _SESSION.pacttype == "H") {
					if (file_exists(KCS_DIR + "/htdocs/Help/Hotline/" + _SESSION.pactid + "/" + helpfile) == true) {
						GLOBALS.G_HELP_FILE = "Hotline/" + _SESSION.pactid + "/" + helpfile;
					}
				} else {
					if (file_exists(KCS_DIR + "/htdocs/Help/" + _SESSION.pactid + "/" + GLOBALS.G_HELP_FILE) == true) {
						GLOBALS.G_HELP_FILE = _SESSION.pactid + "/" + GLOBALS.G_HELP_FILE;
					}
				}
			}
	}

	gBizType() {
		return this.BizType;
	}

	resetBizType(year, month, day, hour) //引数チェック
	//オブジェクト内の日付指定を元に戻す
	//
	{
		if (is_numeric(year) == false) {
			this.getOut().errorOut(0, "MtAuthority::resetBizType() year\u304C\u4E0D\u6B63", false);
		}

		if (is_numeric(month) == false) {
			this.getOut().errorOut(0, "MtAuthority::resetBizType() month\u304C\u4E0D\u6B63", false);
		}

		if (is_numeric(day) == false) {
			this.getOut().errorOut(0, "MtAuthority::resetBizType() day\u304C\u4E0D\u6B63", false);
		}

		if (is_numeric(hour) == false) {
			this.getOut().errorOut(0, "MtAuthority::resetBizType() hour\u304C\u4E0D\u6B63", false);
		}

		this.O_Biz.setMember(year, month, day, hour);
		this.BizType = this.O_Biz.chkBusinessType(year, month, day, hour);
		this.O_Biz.setMember();

		if (this.gHHMM() != str_pad(hour, 2, "0", STR_PAD_LEFT) + "00") {
			this.setHHMM(str_pad(hour, 2, "0", STR_PAD_LEFT) + "00");
		}
	}

	gFuncPact(hhmm = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (undefined !== this.H_FuncPact[hhmm] == true) {
			return this.H_FuncPact[hhmm];
		}

		return false;
	}

	gFuncUser(userid, hhmm = "") //引数チェック
	{
		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "MtAuthority::gFuncUser() userid\u304C\u4E0D\u6B63", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (undefined !== this.H_FuncUser[hhmm][userid] == true) {
			return this.H_FuncUser[hhmm][userid];
		}

		return false;
	}

	sFuncPact(H_fnc: {} | any[], hhmm = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		this.H_FuncPact[hhmm] = H_fnc;
	}

	sFuncUser(userid, H_fnc: {} | any[], hhmm = "") //引数チェック
	{
		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "MtAuthority::sFuncUser() userid\u304C\u4E0D\u6B63", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		this.H_FuncUser[hhmm][userid] = H_fnc;
	}

	setHHMM(hhmm = undefined) //引数がなかったら現在時間
	{
		if (hhmm === undefined) {
			this.HHMM = date("Hi");
		} else //引数のチェック
			{
				if (is_numeric(hhmm) == false) {
					this.getOut().errorOut(0, "MtAuthority::setHHMM() \u5F15\u6570\u306E\u6642\u9593(hhmm)\u304C\u4E0D\u6B63", false);
					throw die(-1);
				} else //Joker以外なら夜間注文フラグを再設定
					{
						if ("string" === typeof hhmm == false) {
							this.getOut().errorOut(0, "MtAuthority::setHHMM() \u5F15\u6570\u306E\u6642\u9593(hhmm)\u304C10\u9032\u3067\u306F\u306A\u3044?\u30C0\u30D6\u30EB\u30AF\u30A9\u30FC\u30C8\u5FD8\u308C\uFF1F", false);
							throw die(-1);
						}

						this.HHMM = hhmm;

						if (this.Joker == false) {
							this.resetBizType(date("Y"), date("m"), date("d"), str_pad(hhmm, 4, "0", STR_PAD_LEFT).substr(0, 2));
							this.checkExtend();
							this.clearFuncHHMM();
						}
					}
			}
	}

	gHHMM() {
		return this.HHMM;
	}

	clearFuncHHMM() {
		{
			let _tmp_0 = this.H_FuncPact;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];

				if (key != "all") {
					delete this.H_FuncPact[key];
				}
			}
		}
		{
			let _tmp_1 = this.H_FuncUser;

			for (var key in _tmp_1) {
				var val = _tmp_1[key];

				if (key != "all") {
					delete this.H_FuncUser[key];
				}
			}
		}
	}

	setAllPactFunc() //既に取得済みなら取得済みデータを返す
	{
		if (is_null(this.gFuncPact("all")) == false) //DBから取得したものをメンバー変数に格納
			{
				this.sFuncPact(this.getFuncModel().getPactFunc(this.Pactid), "all");
			}
	}

	setAllUserFunc(userid) //入力チェック
	{
		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "MtAuthority::getUserFunc() \u5F15\u6570\u306Euserid\u304C\u4E0D\u6B63", false);
		}

		if (is_null(this.gFuncUser(userid, "all")) == false) //DBから取得したものをメンバー変数に格納
			{
				this.sFuncUser(userid, this.getFuncModel().getUserFunc(userid, this.Pactid, undefined, this.gExtend()), "all");
			}
	}

	getPactFunc(hhmm = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (this.gFuncPact(hhmm) === false) {
			if (hhmm == "all") //引数が"all"なら時間関係なしで全ての権限
				{
					this.setAllPactFunc();
				} else //DBから取得したものをメンバー変数に格納
				{
					this.sFuncPact(this.getFuncModel().getPactFunc(this.Pactid, hhmm, this.gExtend()), hhmm);
				}
		}

		return this.gFuncPact(hhmm);
	}

	getPactFuncIni(hhmm = "") {
		return Object.keys(this.getPactFunc(hhmm));
	}

	getPactFuncId(hhmm = "") {
		return Object.values(this.getPactFunc(hhmm));
	}

	chkPactFuncIni(ininame, hhmm = "") //入力チェック
	{
		if (ininame == "") {
			this.getOut().errorOut(0, "MtAuthority::chkPactFuncIni() \u5F15\u6570\u306Eininame\u304C\u7A7A\u3067\u3059", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getPactFunc(hhmm);

		if (undefined !== H_func[ininame] == true) {
			return true;
		}

		return false;
	}

	chkPactFuncId(fncid, hhmm = "") //入力チェック
	{
		if (is_numeric(fncid) == false) {
			this.getOut().errorOut(0, "MtAuthority::chkPactFuncId() \u5F15\u6570\u306Efncid\u304C\u4E0D\u6B63", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getPactFunc(hhmm);

		if (-1 !== H_func.indexOf(fncid) == true) {
			return true;
		}

		return false;
	}

	getUserFunc(userid, hhmm = "") //入力チェック
	{
		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "MtAuthority::getUserFunc() \u5F15\u6570\u306Euserid\u304C\u4E0D\u6B63", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (this.gFuncUser(userid, hhmm) === false) //ヘルプ表示の権限チェック(V2互換の為)
			{
				if (hhmm == "all") //引数が"all"なら時間関係なしで全ての権限
					{
						this.setAllUserFunc(userid);
					} else //DBから取得したものをメンバー変数に格納
					{
						this.sFuncUser(userid, this.getFuncModel().getUserFunc(userid, this.Pactid, hhmm, this.gExtend()), hhmm);
					}

				this.setHelpFunc(userid, hhmm);
			}

		return this.gFuncUser(userid, hhmm);
	}

	getUserFuncIni(userid, hhmm = "") {
		return Object.keys(this.getUserFunc(userid, hhmm));
	}

	getUserFuncId(userid, hhmm = "") {
		return Object.values(this.getUserFunc(userid, hhmm));
	}

	chkUserFuncIni(userid, ininame, hhmm = "") //入力チェック
	{
		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncIni() \u5F15\u6570\u306Euserid\u304C\u4E0D\u6B63", false);
		}

		if (ininame == "") {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncIni() \u5F15\u6570\u306Eininame\u304C\u7A7A\u3067\u3059", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getUserFunc(userid, hhmm);

		if (undefined !== H_func[ininame] == true) {
			return true;
		}

		return false;
	}

	chkUserFuncId(userid, fncid, hhmm = "") //入力チェック
	{
		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncId() \u5F15\u6570\u306Euserid\u304C\u4E0D\u6B63", false);
		}

		if (is_numeric(fncid) == false) {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncId() \u5F15\u6570\u306Efncid\u304C\u4E0D\u6B63", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getUserFunc(userid, hhmm);

		if (-1 !== H_func.indexOf(fncid) == true) {
			return true;
		}

		return false;
	}

	chkUserFuncPath(userid, path, hhmm = "") //入力チェック
	//ヘルプファイル
	{
		if (is_numeric(userid) == false) {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncPath() \u5F15\u6570\u306Euserid\u304C\u4E0D\u6B63", false);
		}

		if (path == "") {
			this.getOut().errorOut(0, "MtAuthority::chkUserFuncPath() \u5F15\u6570\u306Eininame\u304C\u7A7A\u3067\u3059", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var A_fncid = this.getFuncModel().getFuncidFromPath(path);
		var H_func = this.getUserFunc(userid, hhmm);

		if (A_fncid.length == 1 && GLOBALS.G_HELP_DISPLAY == true) {
			var helpfile = this.getFuncModel().getHelpFromId(A_fncid[0]);

			if (helpfile != "") {
				this.setHelpFile(helpfile);
			}
		}

		for (var i = 0; i < A_fncid.length; i++) {
			if (-1 !== H_func.indexOf(A_fncid[i]) == true) {
				return true;
			}
		}

		return false;
	}

	checkFollowerUser(target_userid, targer_postid) //入力チェック
	{
		if (is_numeric(target_userid) == true) {
			this.getOut().warningOut(14, "MtAuthority::checkFollowerUser() \u5F15\u6570\u306Etarget_userid\u304C\u4E0D\u6B63");
		}

		if (is_numeric(target_postid) == true) {
			this.getOut().warningOut(14, "MtAuthority::checkFollowerUser() \u5F15\u6570\u306Etarget_postid\u304C\u4E0D\u6B63");
		}
	}

	getFollowerAndRecogPost(orderid, postid = "", pactid = "") {}

	checkFollowerUser2(targetuserid, postid = "", pactid = "") {
		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (is_numeric(targetuserid) == false) {
			GLOBALS.GO_errlog.warningOut(14, "usercd: " + _SESSION.userid, 1, "/Menu/menu.php", "\u30E1\u30CB\u30E5\u30FC\u3078");
		}

		var check_sql = "select postid from user_tb where userid = " + targetuserid;
		var targetpostid = GLOBALS.GO_db.getOne(check_sql);
		var sql_str = "select postidparent,postidchild,level from post_relation_tb where pactid=" + _SESSION.pactid + " order by level";
		var H_post = GLOBALS.GO_db.getHash(sql_str);
		var H_postid = Array();
		var A_postid_list = Array();
		var chk = false;

		for (var i = 0; i < H_post.length; i++) {
			var lvl = H_post[i].level;
			var pid = H_post[i].postidparent;
			var cid = H_post[i].postidchild;

			if (chk == false) {
				if (cid == postid) {
					chk = true;
					var level = lvl;
					H_postid[cid] = true;
					A_postid_list.push(cid);
				}
			} else {
				if (lvl > level) {
					if (H_postid[pid] == true) {
						H_postid[cid] = true;
						A_postid_list.push(cid);
					}
				}
			}
		}

		delete H_postid;

		if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
			GLOBALS.GO_errlog.warningOut(14, "usercd: " + _SESSION.userid, 1, "/Menu/menu.php", "\u30E1\u30CB\u30E5\u30FC\u3078");
		}

		return true;
	}

	checkFollowerTel(targettelno, carid, tableno = "", postid = "", pactid = "") //電話の部署ＩＤ取得
	{
		var res = true;

		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (tableno == "") {
			var tablename = "tel_tb";
		} else {
			tablename = "tel_" + tableno + "_tb";
		}

		if (tableno == "") {
			var post_relation_name = "post_relation_tb";
		} else {
			post_relation_name = "post_relation_" + tableno + "_tb";
		}

		var check_sql = "select postid from " + tablename + " where telno = '" + targettelno + "' and carid=" + carid + " and pactid=" + pactid;

		if (DEBUG == 1) {
			echo(`${check_sql}<br>`);
		}

		var targetpostid = GLOBALS.GO_db.getOne(check_sql);

		if (targetpostid == "") {
			res = false;
		} else {
			var A_postid_list = this.getFollowerPost(postid, pactid, tableno);

			if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
				res = false;
			}
		}

		return res;
	}

	checkFollowerTelReserve(targettelno, carid, postid = "", pactid = "") {
		var res = true;

		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		var check_sql = "select postid from tel_reserve_tb where telno = '" + targettelno + "' and carid=" + carid + " and pactid=" + pactid;

		if (DEBUG == 1) {
			echo(`${check_sql}<br>`);
		}

		var targetpostid = GLOBALS.GO_db.getOne(check_sql);

		if (targetpostid == "") {
			res = false;
		} else {
			var A_postid_list = this.getFollowerPost(postid, pactid);

			if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
				res = false;
			}
		}

		return res;
	}

	checkFollowerETC(etc_cardno, tableno = "", postid = "", pactid = "") //電話の部署ＩＤ取得
	{
		var res = true;

		if (postid == "") {
			postid = _SESSION.postid;
		}

		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (tableno == "") {
			var tablename = "card_tb";
		} else {
			tablename = "card_" + tableno + "_tb";
		}

		if (tableno == "") {
			var post_relation_name = "post_relation_tb";
		} else {
			post_relation_name = "post_relation_" + tableno + "_tb";
		}

		var check_sql = "select postid from " + tablename + " where cardno = '" + etc_cardno + "' and pactid=" + pactid;

		if (DEBUG == 1) {
			echo(`${check_sql}<br>`);
		}

		var targetpostid = GLOBALS.GO_db.getOne(check_sql);

		if (targetpostid == "") {
			res = false;
		} else {
			var A_postid_list = this.getFollowerPost(postid, pactid, tableno);

			if (-1 !== A_postid_list.indexOf(targetpostid) == false) {
				res = false;
			}
		}

		return res;
	}

	isLanguage(userid) {
		if (this.chkUserFuncIni(userid, "fnc_view_english") == true) {
			return "ENG";
		} else {
			return "JPN";
		}
	}

};