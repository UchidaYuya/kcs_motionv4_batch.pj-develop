//
//ＷＥＢ側のＶＩＥＷ基底となるクラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
//
//@package Base
//@subpackage View
//@filesource
//@author nakanita
//@since 2008/02/25
//
//
//error_reporting(E_ALL|E_STRICT);
//ショップの機能も同時に持たせる
//管理者の機能も同時に持たせる
//ショップの機能も同時に持たせる
//管理者の機能も同時に持たせる
//
//あらゆるＶＩＥＷの基底となるクラス
//
//@package Base
//@subpackage View
//@author nakanita
//@since 2008/02/08
//



// require("MtLogin.php");

// require("MtShopLogin.php");

// require("MtAdminLogin.php");

// require("MtAuthority.php");

// require("MtShopAuthority.php");

// require("MtAdminAuthority.php");

// require("view/ViewBase.php");

// require("model/ActlogModel.php");

// require("MtSession.php");

import MtSession from "../MtSession";
import MtLogin from '../MtLogin';
import MtShopLogin from '.././MtShopLogin';
import MtAdminLogin from '../MtAdminLogin';
import MtAuthority from '../MtAuthority';
import MtShopAuthority from '../MtShopAuthority';
import MtAdminAuthority from '../MtAdminAuthority';
import ViewBase from '../view/ViewBase';
import ActlogModel from '../model/ActlogModel';

//
//共通ログインクラス
//
//@var object
//@access private
//
//
//共通権限クラス
//
//@var object
//@access private
//
//
//セッションオブジェクト
//
//@var object
//@access private
//
//
//ユーザー、ショップの別を表すフラグ
//
//@var integer
//@access private
//
//
//チェックをスキップするフラグ
//
//@var boolean
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param array $H_param	機能拡張のための引数
//@access public
//@return void
//
//
//ユーザー、ショップの別を返す
//
//@author nakanita
//@since 2008/05/01
//
//@access public
//@return integer
//
//
//setSiteMode
//
//@author ishizaki
//@since 2008/09/12
//
//@param mixed $sitemode
//@access public
//@return void
//
//
//トップメニューのURLを返す
//
//@author nakanita
//@since 2008/08/27
//
//@access protected
//@return void
//
//
//共通権限を得る
//管理者側も実装 20090910miya
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//基準となるパラメータを得る、ユーザーの場合はpactid,ショップの場合はshopid.<BR>
//管理者側も実装 20090910miya
//
//@author nakanita
//@since 2008/05/14
//
//@access private
//@return integer
//
//
//サイトに合わせたユーザーIDを得る、ユーザーの場合はuserid,ショップの場合はmemid.
//管理者側も実装 20090910miya
//
//@author nakanita
//@since 2008/05/14
//
//@access private
//@return integer
//
//
//ログインチェックを行う
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//会社権限リストを取得する
//
//@author nakanita
//@since 2008/04/25
//
//@access public
//@return void
//
//
//ユーザー権限一覧を取得する
//
//@author nakanita
//@since 2008/04/25
//
//@access public
//@return void
//
//
//会社権限と部署権限、合わせたものを取得する
//
//@author nakanita
//@since 2008/04/25
//
//@access public
//@return void
//
//
//権限チェックを行う
//
//@author nakanita
//@since 2008/02/22
//
//EV対応 2010/07/20 s.maeda
//
//@access protected
//@return void
//
//
//各ページで行いたい権限チェックがあれば、ここを上書きする<br/>
//子クラスでチェック内容を実装すること<br>
//
//@author nakanita
//@since 2008/04/25
//
//@param array $A_param
//@access protected
//@return void
//
//
//CGIパラメータのチェックを行う<br>
//子クラスでチェック内容を実装すること<br>
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//ページの最初に行うべきチェックをまとめて実行する
//
//@author nakanita
//@since 2008/02/22
//
//@access public
//@return void
//
//
//ページの最初に行うべきチェックをまとめて実行する（ダウンロード用）
//
//@author nakanita
//@since 2008/05/14
//
//@access public
//@return void
//
//
//行動履歴ログを書き込む
//
//@author nakanita
//@since 2008/04/03
//
//@param string $memo
//@param boolean $sessflag=false セッションを書き込むかどうか
//@param boolean $forced=true 強制的に書き込む
//@access public
//@return void
//
//
//gSess
//
//@author katsushi
//@since 2008/04/04
//
//@access protected
//@return object
//
//
//グローバルセッションを取得 <br>
//
//取得出来ないものがあればエラー画面表示 <br>
//
//@author houshiyama
//@since 2008/03/13
//
//@access public
//@return void
//
//
//ショップのグローバルセッションを取得 <br>
//
//取得出来ないものがあればエラー画面表示 <br>
//
//@author nakanita
//@since 2008/05/21
//
//@access public
//@return void
//
//
//管理者のグローバルセッションを取得 <br>
//
//取得出来ないものがあればエラー画面表示 <br>
//
//@author miyazawa
//@since 2008/09/10
//
//@access public
//@return void
//
//
//最後に完了したフォームをチェックして２重の更新を防ぐ
//
//@author katsushi
//@since 2008/04/04
//
//@access public
//@return void
//
//
//フォームを完了したときに明示的にセットする<br>
//checkLastFormで使用する
//
//@author katsushi
//@since 2008/04/04
//
//@access public
//@return void
//
//
//最後に完了したフォームを明示的にクリアする<br>
//明示的に呼ばなくてもメニューで自動的に消える
//
//@author katsushi
//@since 2008/04/04
//
//@access protected
//@return void
//
//
//makeTestScriptParamText
//
//@author igarashi
//@since 2010/01/07
//
//@access private
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
const fs = require("fs");
export default class ViewBaseHtml extends ViewBase {
	static SITE_USER = 0;
	static SITE_SHOP = 1;
	static SITE_ADMIN = 2;
	SkipCheck: any;
	O_Sess;
	O_Auth: any;
	SiteMode: any;
	errorOut: any;
	O_Login: any;
	current_postname: any;

	constructor(H_param:any = Array()) //チェック回避フラグを得る
	//サイトの区別を取得する
	//ログインチェックの前に Authは作れない、pactが無いので。
	{
		super(H_param);

		if (true == (undefined !== H_param.skip)) {
			this.SkipCheck = H_param.skip;
		} else {
			this.SkipCheck = false;
		}

		this.setSiteMode(H_param.site);
		this.O_Sess = MtSession.singleton();
		this.O_Auth = undefined;

		if (false == this.SkipCheck) {
			this.checkLastForm();
		}
	}

	getSiteMode() {
		return this.SiteMode;
	}

	setSiteMode(sitemode: number | undefined) //サイトの区別を取得する
	{
		if (true == (undefined !== sitemode)) {
			if (sitemode == ViewBaseHtml.SITE_SHOP) {
				this.SiteMode = ViewBaseHtml.SITE_SHOP;
			} else if (sitemode == ViewBaseHtml.SITE_ADMIN) {
				this.SiteMode = ViewBaseHtml.SITE_ADMIN;
			} else {
				this.SiteMode = ViewBaseHtml.SITE_USER;
			}
		} else {
			this.SiteMode = ViewBaseHtml.SITE_USER;
		}
	}

	getTopMenu() {
		switch (this.getSiteMode()) {
			case ViewBaseHtml.SITE_USER:
				return "/Menu/menu.php";
				break;

			case ViewBaseHtml.SITE_SHOP:
				return "/Shop/menu.php";
				break;

			case ViewBaseHtml.SITE_ADMIN:
				return "/Admin/menu.php";
				break;

			default:
				this.errorOut(0, "サイトの区分(ユーザー、ショップ)が不明:" + this.getSiteMode());
				break;
		}
	}

	getAuth() //Authが無かったら、ここで初めて作成する
	{
		if (this.O_Auth == undefined) //pactid | shopid を得る
			{
				var id = this.getEssentialID();

				switch (this.getSiteMode()) {
					case ViewBaseHtml.SITE_USER:
						this.O_Auth = MtAuthority.singleton(id);
						this.O_Auth.setJoker(this.gSess().joker);
						break;

					case ViewBaseHtml.SITE_SHOP:
						this.O_Auth = MtShopAuthority.singleton(id);
						break;

					case ViewBaseHtml.SITE_ADMIN:
						this.O_Auth = MtAdminAuthority.singleton(id);
						break;

					default:
						this.errorOut(0, "サイトの区分(ユーザー、ショップ)が不明:" + this.getSiteMode());
						break;
				}
			}

		return this.O_Auth;
	}

	getEssentialID() {
		switch (this.getSiteMode()) {
			case ViewBaseHtml.SITE_USER:
				var id = this.O_Sess.pactid;

				if (undefined !== id == false || !isNaN(Number(id)) == false) {
					this.errorOut(8, "セッションにpactidが無い", false);
				}

				break;

			case ViewBaseHtml.SITE_SHOP:
				id = this.O_Sess.shopid;

				if (undefined !== id == false || !isNaN(Number(id)) == false) {
					this.errorOut(8, "セッションにshopidが無い", false);
				}

				break;

			case ViewBaseHtml.SITE_ADMIN:
				id = this.O_Sess.admin_shopid;

				if (undefined !== id == false || !isNaN(Number(id)) == false) {
					this.errorOut(8, "セッションにadmin_shopidが無い", false);
				}

				break;

			default:
				this.errorOut(0, "サイトの区分(ユーザー、ショップ)が不明:" + this.getSiteMode());
				break;
		}

		return id;
	}

	getUserMemberID() {
		switch (this.getSiteMode()) {
			case ViewBaseHtml.SITE_USER:
				var id = this.O_Sess.userid;

				if (undefined !== id == false || !isNaN(Number(id)) == false) {
					this.errorOut(8, "セッションにuseridが無い", false);
				}

				break;

			case ViewBaseHtml.SITE_SHOP:
				id = this.O_Sess.memid;

				if (undefined !== id == false || !isNaN(Number(id)) == false) {
					this.errorOut(8, "セッションにmemidが無い", false);
				}

				break;

			case ViewBaseHtml.SITE_ADMIN:
				id = this.O_Sess.admin_memid;

				if (undefined !== id == false || !isNaN(Number(id)) == false) {
					this.errorOut(8, "セッションにmemidが無い", false);
				}

				break;

			default:
				this.errorOut(0, "サイトの区分(ユーザー、ショップ)が不明:" + this.getSiteMode());
				break;
		}

		return id;
	}

	checkLogin() {
		switch (this.getSiteMode()) {
			case ViewBaseHtml.SITE_USER:
				this.O_Login = MtLogin.singleton();
				break;

			case ViewBaseHtml.SITE_SHOP:
				this.O_Login = MtShopLogin.singleton();
				break;

			case ViewBaseHtml.SITE_ADMIN:
				this.O_Login = MtAdminLogin.singleton();
				break;

			default:
				this.errorOut(0, "サイトの区分(ユーザー、ショップ)が不明:" + this.getSiteMode());
				break;
		}

		this.O_Login.checkLogin();
		this.makeTestScriptParamText();
	}

	getPactAuth() {
		return this.getAuth().getPactFuncIni();
	}

	getUserAuth() {
		var userid = this.getUserMemberID();

		if (undefined !== userid == false || !isNaN(Number(userid)) == false) {
			this.errorOut(8, "セッションにuseridが無い", false);
		}

		return this.getAuth().getUserFuncIni(userid);
	}

	getAllAuth() {
		return this.getPactAuth().concat(this.getUserAuth());
	}

	checkAuth() //戻るではなく閉じるにするページ
	{
		var A_close = ["/Management/Tel/TelDetail.php", "/Management/ETC/EtcDetail.php", "/Management/Purchase/PurchaseDetail.php", "/Management/Copy/CopyDetail.php", "/Managemenp/Assets/AssetsDetail.php", "/Managemenp/Transit/TransitDetail.php", "/ExcelDL/CreateDLFile.php", "/Managemenp/Ev/EvDetail.php"];
		var userid = this.getUserMemberID();
		var is_auth = this.getAuth().chkUserFuncPath(userid, process.PHP_SELF);

		if (is_auth == false) {
			if (-1 !== A_close.indexOf(process.PHP_SELF) == true) //エラーメール送信しない、ページを閉じる
				{
					this.errorOut(6, "chkUserFuncPath権限が無い", 0, "javascript:window.close();", "閉じる");
				} else //エラーメール送信しない、トップのメニューに戻る
				{
					this.errorOut(6, "chkUserFuncPath権限が無い", 0, this.getTopMenu());
				}
		}

		this.checkCustomAuth();
	}

	checkCustomAuth() //中身は空っぽ
	{}

	checkCGIParam() //中身は空っぽ
	{}

	startCheck() //ブラウザの「キャッシュの有効期限が切れました」を出さない対処
	//header("Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0");
	//header("Expires: 0");
	//セッションを記録に残す
	{
		header("Cache-Control: private");
		this.checkLogin();
		this.checkAuth();
		this.checkCGIParam();
		this.writeActlog("", true, false);
	}

	startCheckDownload() {
		session_cache_limiter("public");
		this.startCheck();
	}

	writeActlog(memo, sessflag = false, forced = true) {
		var O_actlog = ActlogModel.singleton();

		switch (this.getSiteMode()) {
			case ViewBaseHtml.SITE_USER:
				O_actlog.setActlog(memo, process.PHP_SELF, sessflag, forced);
				break;

			case ViewBaseHtml.SITE_SHOP:
				O_actlog.setShopActlog(memo, process.PHP_SELF, sessflag, forced);
				break;

			case ViewBaseHtml.SITE_ADMIN:
				O_actlog.setAdminActlog(memo, process.PHP_SELF, sessflag, forced);
				break;

			default:
				break;
		}
	}

	gSess() {
		return this.O_Sess;
	}

	getglobalession() {
		var H_sess:any = Array();
		H_sess.pactid = this.O_Sess.pactid;

		if (undefined !== H_sess.pactid == false || !isNaN(Number(H_sess.pactid)) == false) {
			this.errorOut(10, "セッションにpactidが無い", false);
		}

		H_sess.postid = this.O_Sess.postid;

		if (undefined !== H_sess.postid == false || !isNaN(Number(H_sess.postid)) == false) {
			this.errorOut(10, "セッションにpostidが無い", false);
		}

		if (true == !this.O_Sess.memid) {
			H_sess.userid = this.O_Sess.userid;

			if (undefined !== H_sess.userid == false || !isNaN(Number(H_sess.userid)) == false) {
				this.errorOut(10, "セッションにuseridが無い", false);
			}
		}

		H_sess.loginname = this.O_Sess.loginname;

		if (undefined !== H_sess.loginname == false || "" == H_sess.loginname) {
			this.errorOut(10, "セッションにloginnameが無い", false);
		}

		H_sess.compname = this.O_Sess.compname;
		H_sess.current_postid = this.O_Sess.current_postid;
		H_sess.postname = this.O_Sess.postname;
		H_sess.current_postname = this.current_postname.joker;
		H_sess.loginid = this.O_Sess.loginid;
		H_sess.logo = this.O_Sess.logo;
		H_sess.manual = this.O_Sess.manual;
		H_sess.inq_mail = this.O_Sess.inq_mail;
		H_sess.pacttype = this.O_Sess.pacttype;
		H_sess.helpfile = this.O_Sess.helpfile;
		H_sess.level = this.O_Sess.level;
		H_sess.limit_time = this.O_Sess.limit_time;
		H_sess.toppostname = this.O_Sess.toppostname;
		H_sess.copyright = this.O_Sess.copyright;
		H_sess.joker = this.O_Sess.joker;
		H_sess.su = this.O_Sess.su;
		H_sess.language = this.O_Sess.language;
		H_sess.groupid = this.O_Sess.groupid;
		return H_sess;
	}

	getglobalhopSession() {
		var H_sess:any = Array();
		H_sess.shopid = this.O_Sess.shopid;

		if (undefined !== H_sess.shopid == false || !isNaN(Number(H_sess.shopid)) == false) {
			this.errorOut(10, "ショップセッションにshopidが無い", false);
		}

		H_sess.memid = this.O_Sess.memid;

		if (undefined !== H_sess.memid == false || !isNaN(Number(H_sess.memid)) == false) {
			this.errorOut(10, "ショップセッションにmemidが無い", false);
		}

		H_sess.shopname = this.O_Sess.name;

		if (undefined !== H_sess.shopname == false || "" == H_sess.shopname) {
			this.errorOut(10, "ショップセッションにshopnameが無い", false);
		}

		H_sess.personname = this.O_Sess.personname;

		if (undefined !== H_sess.personname == false || "" == H_sess.personname) {
			this.errorOut(10, "ショップセッションにpersonnameが無い", false);
		}

		H_sess.postcode = this.O_Sess.postcode;
		H_sess.joker = this.O_Sess.joker;
		H_sess.su = this.O_Sess.su;

		if (this.O_Sess.docomo_only == true) {
			H_sess.docomo_only = true;
		}

		return H_sess;
	}

	getGlobalAdminSession() {
		var H_sess:any = Array();
		H_sess.admin_shopid = this.O_Sess.admin_shopid;

		if (undefined !== H_sess.admin_shopid == false || !isNaN(Number(H_sess.admin_shopid)) == false) {
			this.errorOut(10, "管理者セッションにadmin_shopidが無い", false);
		}

		H_sess.admin_memid = this.O_Sess.admin_memid;

		if (undefined !== H_sess.admin_memid == false || !isNaN(Number(H_sess.admin_memid)) == false) {
			this.errorOut(10, "管理者セッションにadmin_memidが無い", false);
		}

		H_sess.admin_name = this.O_Sess.admin_name;

		if (undefined !== H_sess.admin_name == false || "" == H_sess.admin_name) {
			this.errorOut(10, "管理者セッションにadmin_nameが無い", false);
		}

		H_sess.admin_personname = this.O_Sess.admin_personname;
		H_sess.admin_name_eng = this.O_Sess.admin_name_eng;
		H_sess.admin_usertype = this.O_Sess.admin_usertype;
		H_sess.admin_logintype = this.O_Sess.admin_logintype;
		H_sess.admin_groupid = this.O_Sess.admin_groupid;
		return H_sess;
	}

	checkLastForm() {
		if (this.gSess().getPub("/_lastform") == process.PHP_SELF) {
			this.getOut().errorOut(34, "２重登録または変更処理あり", false);
		}
	}

	writeLastForm() {
		this.gSess().setPub("/_lastform", process.PHP_SELF);
	}

	clearLastForm() {
		this.gSess().clearSessionPub("/_lastform");
	}

	makeTestScriptParamText() //開発機のIPかつ社内Localからのアクセス以外では何もしないようにする
	{
		if ("192.168.2.111" == process.HTTP_HOST && "192.168.99." == process.REMOTE_ADDR.substr(0, 11)) //ファイル保存先
			//保存ファイル名
			//階層をphpと合わせる
			{
				var basedir = "/home/motion_members/testscript";
				var phpfile = strrchr(process.SCRIPT_NAME, "/");

				var phppath = process.SCRIPT_NAME.substr(0, process.SCRIPT_NAME.length - phpfile.length);

				var A_execfile = phppath.split("/");
				var cnt = A_execfile.length;
				var pathadd = "/";

				for (var i = 1; i < cnt; i++) {
					if (false == fs.existsSync(basedir + pathadd + A_execfile[i])) {
						if (false == fs.mkdirSync(basedir + pathadd + A_execfile[i])) {
							// echo("ディレクトリ作成に失敗");
							throw process.exit();
						}
					}

					pathadd += "/" + A_execfile[i] + "/";
				}

				var H_post = _POST;
				var H_get = _GET;

				if (false == fs.existsSync(basedir + process.PHP_SELF.replace(/\.php/g, ".php"))) //if(false == file_exists($basedir.preg_replace("/\.php/", ".txt", $process["PHP_SELF"]))){
					{
						var A_header =  fs.createReadStream(basedir + "/templateheader.php");
						var A_fotter =  fs.createReadStream(basedir + "/templatefooter.php");
					}

				var fp =  fs.createReadStream(basedir + process.PHP_SELF, "a");

				if (undefined == fp) {
					// echo("ファイル作成失敗");
					throw process.exit();
				}

				if (true == (undefined !== A_header)) {
					var sitemode = "user";

					if ("Shop" == A_execfile[1]) {
						sitemode = "shop";
					} else if ("Admin" == A_execfile[1]) {
						sitemode = "admin";
					}

					fp.write("\n//ここからファイルのケツにコピーして\n");

					for (var val of A_fotter) {
						var val = val.replace(/SITEMODE/g, sitemode);
						fp.write(val);
					}

					fp.write("//ここまでファイルのケツにコピーして\n\n");

					for (var val of A_header) {
						fp.write(val);
					}
				}

				if (Array() != H_post) {
					fp.write("\t\t\tarray(\"title\" => \"PleaseTitleInput\",\n");
					fp.write("\t\t\t\t\t\"url\" => \"" + process.PHP_SELF + "\",\n");
					fp.write("\t\t\t\t\t\"POST\"=>array(\n");

					for (var key in H_post) {
						var val = H_post[key];

						if (false == Array.isArray(val)) {
							fp.write("\t\t\t\t\t\t\t\t\t\"" + key + "\" => \"" + val + "\",\n");
						} else {
							for (var ckey in val) {
								var cval = val[ckey];
								fp.write("\t\t\t\t\t\t\t\t\t\"" + key + "[" + ckey + "]" + "\" => \"" + cval + "\",\n");
							}
						}
					}

					fp.write("\t\t\t\t\t\t\t\t\t)),\n");
				}

				if (Array() != H_get) {
					if (Array() == H_post) {
						fp.write("\t\t\tarray(\"title\" => \"PleaseTitleInput\",\n");
						fp.write("\t\t\t\t\t\"url\" => \"" + process.PHP_SELF + "\",\n");
					}

					fp.write("\t\t\t\t\t\"GET\"=>array(\n");

					for (var key in H_get) {
						var val = H_get[key];

						if (false == Array.isArray(val)) {
							fp.write("\t\t\t\t\t\t\t\t\t\"" + key + "\" => \"" + val + "\",\n");
						} else {
							for (var ckey in val) {
								var cval = val[ckey];
								fp.write("\t\t\t\t\t\t\t\t\t\"" + key + "[" + ckey + "]" + "\" => \"" + cval + "\",\n");
							}
						}
					}

					fp.write("\t\t\t\t\t\t\t\t\t)),\n");
				}

				var makedate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("/").slice(0,-3);
				fp.write("\t\t\t\t\t//一画面終わり-" + makedate + "\n");
				fp.end();
				return true;
			}

		return false;
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};