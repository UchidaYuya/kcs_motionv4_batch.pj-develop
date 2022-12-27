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

import MtSession from "../MtSession";
import MtLogin from '../MtLogin';
import MtShopLogin from '.././MtShopLogin';
import MtAdminLogin from '../MtAdminLogin';
import MtAuthority from '../MtAuthority';
import MtShopAuthority from '../MtShopAuthority';
import MtAdminAuthority from '../MtAdminAuthority';
import ViewBase from '../view/ViewBase';
import ActlogModel from '../model/ActlogModel';

const fs = require("fs");
var _POST: { [value: string]: any }
var _GET: { [value: string]: any }
export default class ViewBaseHtml extends ViewBase {
	static SITE_USER = 0;
	static SITE_SHOP = 1;
	static SITE_ADMIN = 2;
	SkipCheck: any;
	O_Sess: MtSession;
	O_Auth: MtAuthority | any;
	SiteMode: any;
	errorOut: any;
	O_Login: MtLogin | MtShopLogin | MtAdminLogin | any;
	current_postname: any;
	getOut: any;

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
		let id;
		switch (this.getSiteMode()) {
			case ViewBaseHtml.SITE_USER:
				id = this.O_Sess.pactid;

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
		// header("Cache-Control: private");
		this.checkLogin();
		this.checkAuth();
		this.checkCGIParam();
		this.writeActlog("", true, false);
	}

	startCheckDownload() {
		// session_cache_limiter("public");
		this.startCheck();
	}

	writeActlog(memo: string, sessflag = false, forced = true) {
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
		H_sess.admin_groupid = this.O_Sess.admin_shopid;
		return H_sess;
	}

	checkLastForm() {
	}

	writeLastForm() {
	}

	clearLastForm() {
		this.gSess().clearSessionPub("/_lastform");
	}

	makeTestScriptParamText() //開発機のIPかつ社内Localからのアクセス以外では何もしないようにする
	{
		return false;
	}
};