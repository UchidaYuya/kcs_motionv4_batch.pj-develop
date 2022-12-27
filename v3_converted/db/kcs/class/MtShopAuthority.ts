//
//ショップ機能権限クラス
//
//権限関連のクラスライブラリ
//
//更新履歴：<br>
//2008/05/02 中西達夫 作成<br>
//
//@package Base
//@subpackage Authority
//@filesource
//@author nakanita
//@since 2008/05/02
//
//
//
//ショップ機能権限クラス
//
//権限関連のクラスライブラリ
//
//@package Base
//@subpackage Authority
//@filesource
//@author nakanita
//@since 2008/05/02
//

require("MtExcept.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtBusinessDay.php");

require("model/ShopFuncModel.php");

require("model/ShopModel.php");

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
//Shopid
//
//@var integer
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
//Jokerフラグ
//
//@var boolean
//@access private
//
//
//コンストラクタ<br>
//実行順番は変更してはいけない
//
//@access private
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
//@param integer $shopid
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
//gFuncShop
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
//@param integer $memid
//@param string $hhmm
//@access public
//@return array
//
//
//sFuncShop
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
//@param integer $memid
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
//@param integer $memid
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
//@param integer $memid
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
//@param integer $memid
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
//@param integer $memid
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
//@param integer $memid
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
//@param integer $memid
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
//@param integer $memid
//@param string $path
//@param string $hhmm
//@access public
//@return boolean
//
class MtShopAuthority {
	static OH_Instance = Array();

	constructor(shopid) //アウトプット
	//設定
	//$this->getSetting()->loadConfig("define");
	//権限の数値-文字列対応が含まれているのだが、Shopでは使わない.
	//権限モデル
	//営業区分
	//shopid
	//配列初期化
	//フラグ変数初期化
	//現在時間の設定
	//最初に全部の会社権限を読み込む
	{
		this.O_Out = MtOutput.singleton();
		this.O_Setting = MtSetting.singleton();
		this.O_Func = new ShopFuncModel();
		this.O_Biz = new MtBusinessDay();
		this.BizType = this.O_Biz.chkBusinessType();
		this.Shopid = shopid;
		this.H_FuncShop = Array();
		this.H_FuncUser = Array();
		this.setJoker(false);
		this.setHHMM();
		this.setAllShopFunc();
	}

	static singleton(shopid) {
		if (is_numeric(shopid) == false) {
			MtExcept.raise("MtShopAuthority::singleton() \u5F15\u6570(shopid)\u304C\u306A\u3044");
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

	setJoker(bool = true) {
		if (bool == true) {
			this.Joker = true;
			this.setHHMM(this.getSetting().joker_time);
		} else {
			this.Joker = false;
			this.setHHMM();
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
			this.getOut().errorOut(0, "MtShopAuthority::resetBizType() year\u304C\u4E0D\u6B63", false);
		}

		if (is_numeric(month) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::resetBizType() month\u304C\u4E0D\u6B63", false);
		}

		if (is_numeric(day) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::resetBizType() day\u304C\u4E0D\u6B63", false);
		}

		if (is_numeric(hour) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::resetBizType() hour\u304C\u4E0D\u6B63", false);
		}

		this.O_Biz.setMember(year, month, day, hour);
		this.BizType = this.O_Biz.chkBusinessType(year, month, day, hour);
		this.O_Biz.setMember();

		if (this.gHHMM() != str_pad(hour, 2, "0", STR_PAD_LEFT) + "00") {
			this.setHHMM(str_pad(hour, 2, "0", STR_PAD_LEFT) + "00");
		}
	}

	gFuncShop(hhmm = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (undefined !== this.H_FuncShop[hhmm] == true) {
			return this.H_FuncShop[hhmm];
		}

		return false;
	}

	gFuncUser(memid, hhmm = "") //引数チェック
	{
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::gFuncUser() memid\u304C\u4E0D\u6B63", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (undefined !== this.H_FuncUser[hhmm][memid] == true) {
			return this.H_FuncUser[hhmm][memid];
		}

		return false;
	}

	sFuncShop(H_fnc: {} | any[], hhmm = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		this.H_FuncShop[hhmm] = H_fnc;
	}

	sFuncUser(memid, H_fnc: {} | any[], hhmm = "") //引数チェック
	{
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::sFuncUser() memid\u304C\u4E0D\u6B63", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		this.H_FuncUser[hhmm][memid] = H_fnc;
	}

	setHHMM(hhmm = undefined) //引数がなかったら現在時間
	{
		if (hhmm === undefined) {
			this.HHMM = date("Hi");
		} else //引数のチェック
			{
				if (is_numeric(hhmm) == false) {
					this.getOut().errorOut(0, "MtShopAuthority::setHHMM() \u5F15\u6570\u306E\u6642\u9593(hhmm)\u304C\u4E0D\u6B63", false);
					throw die(-1);
				} else //Joker以外なら夜間注文フラグを再設定
					{
						if ("string" === typeof hhmm == false) {
							this.getOut().errorOut(0, "MtShopAuthority::setHHMM() \u5F15\u6570\u306E\u6642\u9593(hhmm)\u304C10\u9032\u3067\u306F\u306A\u3044?\u30C0\u30D6\u30EB\u30AF\u30A9\u30FC\u30C8\u5FD8\u308C\uFF1F", false);
							throw die(-1);
						}

						this.HHMM = hhmm;

						if (this.Joker == false) {
							this.resetBizType(date("Y"), date("m"), date("d"), str_pad(hhmm, 4, "0", STR_PAD_LEFT).substr(0, 2));
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
			let _tmp_0 = this.H_FuncShop;

			for (var key in _tmp_0) {
				var val = _tmp_0[key];

				if (key != "all") {
					delete this.H_FuncShop[key];
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

	setAllShopFunc() //既に取得済みなら取得済みデータを返す
	{
		if (is_null(this.gFuncShop("all")) == false) //DBから取得したものをメンバー変数に格納
			{
				this.sFuncShop(this.getFuncModel().getShopFunc(this.Shopid), "all");
			}
	}

	setAllUserFunc(memid) //入力チェック
	{
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::getUserFunc() \u5F15\u6570\u306Ememid\u304C\u4E0D\u6B63", false);
		}

		if (is_null(this.gFuncUser(memid, "all")) == false) //DBから取得したものをメンバー変数に格納
			{
				this.sFuncUser(memid, this.getFuncModel().getUserFunc(memid, this.Shopid, undefined, false), "all");
			}
	}

	getShopFunc(hhmm = "") {
		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (this.gFuncShop(hhmm) === false) {
			if (hhmm == "all") //引数が"all"なら時間関係なしで全ての権限
				{
					this.setAllShopFunc();
				} else //DBから取得したものをメンバー変数に格納
				{
					this.sFuncShop(this.getFuncModel().getShopFunc(this.Shopid, hhmm, false), hhmm);
				}
		}

		return this.gFuncShop(hhmm);
	}

	getShopFuncIni(hhmm = "") {
		return Object.keys(this.getShopFunc(hhmm));
	}

	getShopFuncId(hhmm = "") {
		return Object.values(this.getShopFunc(hhmm));
	}

	chkShopFuncIni(ininame, hhmm = "") //入力チェック
	{
		if (ininame == "") {
			this.getOut().errorOut(0, "MtShopAuthority::chkShopFuncIni() \u5F15\u6570\u306Eininame\u304C\u7A7A\u3067\u3059", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getShopFunc(hhmm);

		if (undefined !== H_func[ininame] == true) {
			return true;
		}

		return false;
	}

	chkShopFuncId(fncid, hhmm = "") //入力チェック
	{
		if (is_numeric(fncid) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::chkShopFuncId() \u5F15\u6570\u306Efncid\u304C\u4E0D\u6B63", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getShopFunc(hhmm);

		if (-1 !== H_func.indexOf(fncid) == true) {
			return true;
		}

		return false;
	}

	getUserFunc(memid, hhmm = "") //入力チェック
	{
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::getUserFunc() \u5F15\u6570\u306Ememid\u304C\u4E0D\u6B63", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		if (this.gFuncUser(memid, hhmm) === false) {
			if (hhmm == "all") //引数が"all"なら時間関係なしで全ての権限
				{
					this.setAllUserFunc(memid);
				} else //DBから取得したものをメンバー変数に格納
				{
					this.sFuncUser(memid, this.getFuncModel().getUserFunc(memid, this.Shopid, hhmm, false), hhmm);
				}
		}

		return this.gFuncUser(memid, hhmm);
	}

	getUserFuncIni(memid, hhmm = "") {
		return Object.keys(this.getUserFunc(memid, hhmm));
	}

	getUserFuncId(memid, hhmm = "") {
		return Object.values(this.getUserFunc(memid, hhmm));
	}

	chkUserFuncIni(memid, ininame, hhmm = "") //入力チェック
	{
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncIni() \u5F15\u6570\u306Ememid\u304C\u4E0D\u6B63", false);
		}

		if (ininame == "") {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncIni() \u5F15\u6570\u306Eininame\u304C\u7A7A\u3067\u3059", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getUserFunc(memid, hhmm);

		if (undefined !== H_func[ininame] == true) {
			return true;
		}

		return false;
	}

	chkUserFuncId(memid, fncid, hhmm = "") //入力チェック
	{
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncId() \u5F15\u6570\u306Ememid\u304C\u4E0D\u6B63", false);
		}

		if (is_numeric(fncid) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncId() \u5F15\u6570\u306Efncid\u304C\u4E0D\u6B63", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var H_func = this.getUserFunc(memid, hhmm);

		if (-1 !== H_func.indexOf(fncid) == true) {
			return true;
		}

		return false;
	}

	chkUserFuncPath(memid, path, hhmm = "") //入力チェック
	{
		if (is_numeric(memid) == false) {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncPath() \u5F15\u6570\u306Ememid\u304C\u4E0D\u6B63", false);
		}

		if (path == "") {
			this.getOut().errorOut(0, "MtShopAuthority::chkUserFuncPath() \u5F15\u6570\u306Eininame\u304C\u7A7A\u3067\u3059", false);
		}

		hhmm = hhmm.trim();

		if (hhmm == "") {
			hhmm = this.gHHMM();
		}

		var A_fncid = this.getFuncModel().getFuncidFromPath(path);
		var H_func = this.getUserFunc(memid, hhmm);

		if (-1 !== A_fncid.indexOf(26)) {
			A_fncid.push(203);
			A_fncid.push(206);
		}

		for (var i = 0; i < A_fncid.length; i++) {
			if (-1 !== H_func.indexOf(A_fncid[i]) == true) {
				return true;
			}
		}

		return false;
	}

};