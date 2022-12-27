//認証クラス

import ShopLoginModel from './model/ShopLoginModel';
import MtLogin from './MtLogin';
import MtShopAuthority from './MtShopAuthority';
import MtCryptUtil from './MtCryptUtil';
import MtSetting from './MtSetting';
import GroupModel from './model/GroupModel';

export default class MtShopLogin extends MtLogin {
	H_Group: any[];
	O_Model: ShopLoginModel;
	O_group: GroupModel
	constructor() //モデルを上書きする
	{
		super();
		this.O_Model = new ShopLoginModel();
		this.O_group = new GroupModel();
		const O_Conf = MtSetting.singleton();
		O_Conf.loadConfig("group");
		this.H_Group = Array();
		const max_gid = O_Conf.get("max_groupid");

		for (var idx = 0; idx <= max_gid; idx++) //groupid + 数字 という規則で登録されている
		{
			var key = "groupid" + idx;

			try {
				var prop = O_Conf[key];
			} catch (ex) //項目がなかったら空文字とする
			{
				prop = "";
			}

			if (prop != "") {
				this.H_Group[O_Conf[key]] = idx;
			} else //設定が無かった場合"groupidN"が販売店グループとなる
				{
					this.H_Group[key] = idx;
				}
		}
	}

	 static singleton() {
		// if (super.O_Instance == undefined) {
			this.O_Instance = new MtShopLogin();
		// }

		return this.O_Instance;
	}

	checkSession() //print "memid=" . $this->O_Sess->memid . ", and shopid=" . $this->O_Sess->shopid . "\n";	// DEBUG * セッションが付いてない？
	{
		if (!isNaN(Number(this.O_Sess.memid)) == true && !isNaN(Number(this.O_Sess.shopid)) == true) //ログインしている
			{
				return true;
			}

		return false;
	}

	checkSessionLimit() {
		if (!isNaN(Number(this.O_Sess.shop_limit_time)) == false || this.O_Sess.shop_limit_time < 1) //未ログインのエラー
			{
				this.errorPattern("Session", this.O_Sess.memid);
			}

		if (this.O_Sess.shop_limit_time > Date.now() / 1000) //有効
			{
				return true;
			} else //有効時間外
			{
				return false;
			}
	}

	checkPassword(H_userinfo: { passwd: any; }, input_passwd: string) 
	{
		this.O_Crypt = MtCryptUtil.singleton();

		if (H_userinfo.passwd != this.O_Crypt.getCrypt(input_passwd)) {
			return false;
		}

		return true;
	}

	checkMiscount(shopid: any, miscount: number) //会社権限でパスワード間違い回数のチェックがオンになっている場合のみ処理
	{
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkShopFuncIni("fnc_password_miscount") == true) 
		{
			if (miscount >= this.O_Conf.get("shop_passwd_miscount")) //設定している回数を超えたらエラー
				{
					return false;
				}
		}

		return true;
	}

	setPasswdMiscount(shopid: any, memid: any, flag: boolean) //会社権限でパスワード間違い回数のチェックがオンになっている場合のみ処理
	{
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkShopFuncIni("fnc_password_miscount") == true) {
			this.O_Model.setMiscount(shopid, memid, flag);
		}
	}

	async checkPassWordLimit(shopid: any, uid: any, type = false) //まずはパス有効期限の権限がある会社か？
	{
		const O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkShopFuncIni("fnc_password_limit") == true) //パスワードの有効時間を取得
			{
				var pass_lim = await this.O_Model.getLoginPasschanged(uid);

				if (pass_lim == "") //パスワード変更日が空（権限追加後初アクセスなど）
					{
						this.jumpPassChage_c(shopid, uid, type, 0);
					} else {
					var date_exe = pass_lim.split(" ");
					date_exe[1] = 	new Date().toJSON().slice(0,10).replace(/-/g,'-');;
					var change_days = (Date.parse(date_exe[1]) - Date.parse(date_exe[0])) / (24 * 60 * 60);

					if (change_days > this.O_Conf.get("shop_password_limit")) {
						this.jumpPassChage_c(shopid, uid, type, 1);
					} else {
						//delete _SESSION.shopPassOUT;
					}
				}
			}
	}

	jumpPassChage_c(shopid: number, uid: string, type: boolean, out: number) {
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkUserFuncIni(uid, "fnc_chg_pass") == true && type == false) //
			{
				// session_start();
				this.O_Sess.setGlobal("shopid_pass", shopid);
				this.O_Sess.setGlobal("memid_pass", uid);

				if (out == 0) {
					this.O_Sess.setGlobal("shopPassOUT", "ON");
				} else {
					this.O_Sess.setGlobal("shopPassOUT", "OFF");
				}

				// header("Location: /Shop/chg_password.php");
				throw process.exit(0);// 2022cvt_009
			}
	}

	async writeLoginRelSess(shopid: any, memid: any) //会社権限に二重ログイン禁止が設定されているか確認
	{
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkShopFuncIni("fnc_double_login") == true) //設定されている場合は、login_rel_sess_tb にログイン情報を書き込む
			{
				// var sess_id = session_id();
				let sess_id;
				var result = await this.O_Model.setLoginSessInfo(shopid, memid, sess_id);

				if (result == 0) //失敗
					{
						// session_unset();
						return false;
					}
			}

		return true;
	}

	async acheckDoubleLogin(shopid: number, memid: number) //成り代わりフラグがついていない場合のみ処理	// * ToDo *
	{
		var O_auth = MtShopAuthority.singleton(shopid);

		if (O_auth.chkShopFuncIni("fnc_double_login") == true) //, $narikawari );
			{
				// var sess_id = session_id();
				let sess_id;
				var A_pact_user_num = await this.O_Model.getLoginSessInfo(shopid, memid, sess_id);

				if (A_pact_user_num.length != 1) //自分がいなければ
					{
						// session_unset();
						this.O_Out.errorOut(32, "memid: " + memid + "-sess: " + sess_id, 0);
						return false;
					}
			}

		return true;
	}

	checkLogin() //POST["login"]があればログイン画面からの入力
	{
	}

	async setLogin(group: string, userid_ini: string, loginid: string , password: string, loginname = "") //グループIDの取得
	{
		if (undefined !== this.H_Group[group] == false) {
			this.errorPattern("GroupNotFound", group);
		}

		var groupid = this.H_Group[group];
		var H_userinfo = await this.O_Model.getUserInfoAll(userid_ini, loginid, groupid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserNotFound", userid_ini + "," + loginid);
		}

		var shopid = H_userinfo.shopid;
		var memid = H_userinfo.memid;

		if (this.checkMiscount(shopid, H_userinfo.miscount) == false) {
			this.errorPattern("Miscount", loginid);
		}

		if (this.checkPassword(H_userinfo, password) == false) //間違い回数カウント
			{
				this.setPasswdMiscount(shopid, memid, true);
				this.errorPattern("Password", loginid);
			}

		this.checkPassWordLimit(shopid, memid);

		if (await this.writeLoginRelSess(shopid, memid) == false) {
			this.errorPattern("DoubleLogin", memid);
		}

		if (await this.checkDoubleLogin(shopid, memid) == false) {
			this.errorPattern("DoubleLogin", memid);
		}

		if (await this.checkIPrestrict(shopid) == false) {
			this.errorPattern("IPRestrict", memid);
		}

		this.O_Sess.clearSessionAll();
		this.setLoginCore(H_userinfo);

		if (loginname != "") {
			this.O_Sess.setGlobal("loginname", loginname);
		} else {
			this.O_Sess.setGlobal("loginname", H_userinfo.personname);
		}

		this.setPasswdMiscount(shopid, memid, false);
		var H_log = {
			shopid: this.O_Sess.shopid,
			groupid: this.O_Sess.groupid,
			memid: this.O_Sess.memid,
			name: this.O_Sess.personname,
			postcode: this.O_Sess.postcode,
			comment1: "ID: " + this.O_Sess.memid,
			comment2: "ログイン処理",
			kind: "L",
			type: "ログイン",
			joker_flag: 0
		};
		this.O_Out.writeShopMnglog(H_log);
	}

	setLoginCore(H_userinfo: { memid: any; shopid: any; groupid: number; shopname: any; postcode: any; personname: any; ownermail: any; fiscalmonth: any; usertype: string; }) //セッションへの書き込み
	{
		this.O_Sess.setGlobal("memid", H_userinfo.memid);
		this.O_Sess.setGlobal("shopid", H_userinfo.shopid);
		this.O_Sess.setGlobal("groupid", H_userinfo.groupid);
		this.O_Sess.setGlobal("grouptitle", this.O_group.getGroupTitle(H_userinfo.groupid, "S"));
		this.O_Sess.setGlobal("name", H_userinfo.shopname);
		this.O_Sess.setGlobal("postcode", H_userinfo.postcode);
		this.O_Sess.setGlobal("personname", H_userinfo.personname);
		this.O_Sess.setGlobal("ownermail", H_userinfo.ownermail);
		this.O_Sess.setGlobal("ownername", H_userinfo.personname);
		this.O_Sess.setGlobal("shop_limit_time", Date.now() / 1000 + 60 * this.O_Conf.get("shop_sesslimit"));
		this.O_Sess.setGlobal("fiscalmonth", H_userinfo.fiscalmonth);
		if (H_userinfo.usertype == "SU") {
			this.O_Sess.setGlobal("su", true);
		} else {
			this.O_Sess.setGlobal("su", false);
		}
	}

	async refreshLogin() //ログインしているかのチェック
	{
		if (this.checkSession() == false) {
			this.errorPattern("Session");
		}

		if (this.checkSessionLimit() == false) {
			this.errorPattern("SessionLimit", this.O_Sess.memid);
		}

		if (await this.checkDoubleLogin(this.O_Sess.shopid, this.O_Sess.memid) == false) {
			this.errorPattern("DoubleLogin", this.O_Sess.memid);
		}

		var H_userinfo = await this.O_Model.getUserInfo(this.O_Sess.memid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserDeleted", this.O_Sess.shopid + "," + this.O_Sess.memid);
		}

		if (await this.checkIPrestrict(H_userinfo.shopid) == false) {
			this.errorPattern("IPRestrict", this.O_Sess.memid);
		}
		
		this.setLoginCore(H_userinfo);
		global.GROUPID = H_userinfo.groupid;
	}

	async ShopJoker(group: string  , userid_ini: string, loginid: string, loginname = "") //グループIDの取得
	{
		if (undefined !== this.H_Group[group] == false) {
			this.errorPattern("GroupNotFound", group);
		}

		var groupid = this.H_Group[group];
		var H_userinfo = await this.O_Model.getUserInfoAll(userid_ini, loginid, groupid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserNotFound", userid_ini + "," + loginid);
		}

		var shopid = H_userinfo.shopid;
		var memid = H_userinfo.memid;
		this.O_Sess.clearSessionAll();
		this.setLoginCore(H_userinfo);

		if (loginname != "") {
			this.O_Sess.setGlobal("loginname", loginname);
		} else {
			this.O_Sess.setGlobal("loginname", H_userinfo.personname);
		}
	}

	getShopSessionHash() {
		var A_ShopSessKey:any[] = ["memid", "shopid", "groupid", "name", "postcode", "personname", "ownermail", "ownername", "loginname", "shop_limit_time", "fiscalmonth", "su"];
		var H_shopkey = Array();

		for (var key of Object.values(A_ShopSessKey)) {
			H_shopkey[key] = this.O_Sess[key];
		}

		return H_shopkey;
	}

	logOut() //セッションのクリア
	{
		var H_log = {
			shopid: this.O_Sess.shopid,
			groupid: this.O_Sess.groupid,
			memid: this.O_Sess.memid,
			name: this.O_Sess.personname,
			postcode: this.O_Sess.postcode,
			comment1: "ID: " + this.O_Sess.memid,
			comment2: "ログアウト処理",
			kind: "L",
			type: "ログアウト",
			joker_flag: this.O_Sess.joker
		};
		this.O_Out.writeShopMnglog(H_log);
		this.O_Sess.clearSessionAll();
	}

	errorPattern(pattern: string, info = "") {
		var goto = "";

		if (undefined !== this.O_Sess.groupid) {
			if (1 < this.O_Sess.groupid) {
				goto = "/" + this.O_group.getGroupName(this.O_Sess.groupid) + "/index_shop.php";
			} else {
				goto = "/index_shop.php";
			}
		} else if ("" != global.GROUPID) {
			if (1 < global.GROUPID) {
				goto = "/" + this.O_group.getGroupName(global.GROUPID) + "/index_shop.php";
			} else {
				goto = "/index_shop.php";
			}
		}

		switch (pattern) {
			case "Session":
				this.O_Sess.clearSessionAll();
				// this.O_Out.errorOut(10, "セッションがないか、有効ではない(IP: " + process.REMOTE_ADDR + ")", false, goto);
				this.O_Out.errorOut(10, "セッションがないか、有効ではない(IP: " + "" + ")", false, goto);
				break;

			case "Password":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(9, "パスワード間違い(loginid: " + info + ")", false, goto);
				break;

			case "GroupNotFound":
				this.O_Out.errorOut(9, "グループが見つからない(group: " + info + ")", false, goto);
				break;

			case "UserNotFound":
				this.O_Out.errorOut(9, "ユーザ情報が見つからない(userid_ini,loginid: " + info + ")", false, goto);
				break;

			case "SessionLimit":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(7, "Session有効時間オーバー(userid: " + info + ")", false, goto);
				break;

			case "DoubleLogin":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(32, "二重ログインエラー", false, goto);
				break;

			case "Miscount":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(36, "パスワード間違い回数が制限を超えた(loginid: " + info + ")", false, goto);
				break;

			case "IPRestrict":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(29, "IP制限ログイン(userid: " + info + ")", false, goto);
				break;

			case "RemoteAddr":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(29, "接続元IPが不正(IP: " + info + ")", false, goto);
				break;

			case "UserDeleted":
				// this.O_Out.errorOut(25, "ログイン中のユーザが削除された(pactid,userid: " + info + ")", true, "/", "ログインページへ", goto);
				this.O_Out.errorOut(25, "ログイン中のユーザが削除された(pactid,userid: " + info + ")", true, "/ログインページへ", goto);
				break;

			case "NoInput":
				this.O_Sess.clearSessionAll();
				this.O_Out.errorOut(5, "顧客コード、ログインIDが入力されていません", false, goto);
				break;

			default:
				this.O_Out.errorOut(11, "MtLogin: その他のエラー(userid: " + this.O_Sess.userid + ")");
				break;
		}
	}

};


