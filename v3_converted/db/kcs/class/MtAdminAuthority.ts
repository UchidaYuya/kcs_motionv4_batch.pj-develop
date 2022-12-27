//
//管理者機能権限クラス
//
//権限関連のクラスライブラリ<br/>
//実質的に中身は空。形式だけ合わせた。
//
//更新履歴：<br>
//2008/07/09 中西達夫 作成<br>
//
//@package Base
//@subpackage Authority
//@filesource
//@author nakanita
//@since 2008/07/09
//
//
//
//管理者機能権限クラス
//
//権限関連のクラスライブラリ<br/>
//実質的に中身は空。形式だけ合わせた。
//
//@package Base
//@subpackage Authority
//@filesource
//@author nakanita
//@since 2008/07/09
//

require("MtExcept.php");

require("MtSetting.php");

require("MtOutput.php");

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
//@author nakanita
//@since 2008/07/09
//
//@param integer $shopid
//@static
//@access public
//@return self::$O_Instance
//
//
//getOut
//
//@author nakanita
//@since 2008/07/09
//
//@access public
//@return object
//
//
//getSetting
//
//@author nakanita
//@since 2008/07/09
//
//@access public
//@return object
//
//
//gFuncUser
//
//@author nakanita
//@since 2008/07/09
//
//@param integer $memid
//@param string $hhmm
//@access public
//@return array
//
//
//sFuncUser
//
//@author nakanita
//@since 2008/07/09
//
//@param integer $memid
//@param array $H_fnc
//@param string $hhmm
//@access public
//@return void
//
//
//全てのユーザー権限を取得してメンバー変数に格納する<br>
//
//@author nakanita
//@since 2008/07/09
//
//@param integer $memid
//@access public
//@return void
//
//
//ユーザー権限を連想配列で取得<br>
//キー: ininame, 値: fncid
//
//@author nakanita
//@since 2008/07/09
//
//@param integer $memid
//@param string $hhmm
//@access public
//@return void
//
//
//ユーザー権限(ininame)を配列で取得
//
//@author nakanita
//@since 2008/07/09
//
//@param integer $memid
//@param string $hhmm
//@access public
//@return array
//
//
//ユーザー権限(fncid)を配列で取得
//
//@author nakanita
//@since 2008/07/09
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
//@author nakanita
//@since 2008/07/09
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
//@author nakanita
//@since 2008/07/09
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
//@author nakanita
//@since 2008/07/09
//
//@param integer $memid
//@param string $path
//@param string $hhmm
//@access public
//@return boolean
//
class MtAdminAuthority {
	static OH_Instance = Array();

	constructor(shopid) //アウトプット
	//設定
	{
		this.O_Out = MtOutput.singleton();
		this.O_Setting = MtSetting.singleton();
	}

	static singleton(shopid) {
		if (is_numeric(shopid) == false) {
			MtExcept.raise("MtAdminAuthority::singleton() \u5F15\u6570(shopid)\u304C\u306A\u3044");
			throw die(-1);
		}
	}

	getOut() {
		return this.O_Out;
	}

	getSetting() {
		return this.O_Setting;
	}

	gFuncUser(memid, hhmm = "") //なにもしない
	{
		return false;
	}

	sFuncUser(memid, H_fnc: {} | any[], hhmm = "") //なにもしない
	{}

	setAllUserFunc(memid) //なにもしない
	{}

	getUserFunc(memid, hhmm = "") //空を返す
	{
		return Array();
	}

	getUserFuncIni(memid, hhmm = "") {
		return Object.keys(this.getUserFunc(memid, hhmm));
	}

	getUserFuncId(memid, hhmm = "") {
		return Object.values(this.getUserFunc(memid, hhmm));
	}

	chkUserFuncIni(memid, ininame, hhmm = "") //常にtrue
	{
		return true;
	}

	chkUserFuncId(memid, fncid, hhmm = "") //常にtrue
	{
		return true;
	}

	chkUserFuncPath(memid, path, hhmm = "") //常にtrue
	{
		return true;
	}

};