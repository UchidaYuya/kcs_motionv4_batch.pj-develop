//認証クラス

import MtLogin from "./MtLogin";
import MtCryptUtil from "./MtCryptUtil";
import GroupModel from "./model/GroupModel";
import AdminLoginModel from "./model/AdminLoginModel";
import MtSetting from "./MtSetting";

export default class MtAdminLogin extends MtLogin {
	O_Model : AdminLoginModel;
	O_Crypt : any;

	constructor() //モデルを上書きする
	{
		super();
		this.O_Model = new AdminLoginModel();
	}

	static singleton() {
		if (this.O_Instance == undefined) {
			this.O_Instance = new MtAdminLogin();
		}

		return this.O_Instance;
	}

	checkSession() {
		// if (_SESSION.admin_logintype == "admin") //ログインしている
		// {
		// 		return true;
		// }

		return false;
	}

	checkPassword(H_userinfo:any, input_passwd: string) 
	{
		this.O_Crypt = MtCryptUtil.singleton();

		if (H_userinfo.passwd != this.O_Crypt.getCrypt(input_passwd)) {
			return false;
		}

		return true;
	}

	async SetLogin(userid_ini: string, loginid: string, password: string, loginname = "") //ユーザー情報の取得
	{
		var H_userinfo = await this.O_Model.getUserInfoAll(userid_ini, loginid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserNotFound", userid_ini + "," + loginid);
		}

		if (this.checkPassword(H_userinfo, password) == false) {
			this.errorPattern("Password", loginid);
		}

		this.O_Sess.clearSessionAll();
		this.setLoginCore(H_userinfo);
	}

	setLoginCore(H_userinfo: any) //セッションへの書き込み
	{
		this.O_Sess.setGlobal("admin_shopid", H_userinfo.shopid);
		this.O_Sess.setGlobal("admin_groupid", H_userinfo.groupid);
		this.O_Sess.setGlobal("admin_postcode", H_userinfo.postcode);
		this.O_Sess.setGlobal("admin_ownermail", H_userinfo.ownermail);
		this.O_Sess.setGlobal("admin_ownername", H_userinfo.personname);
		this.O_Sess.setGlobal("admin_shop_limit_time", Date.now() / 1000 + 60 * this.O_Conf.get("shop_sesslimit"));
		this.O_Sess.setGlobal("admin_fiscalmonth", H_userinfo.fiscalmonth);
		this.O_Sess.setGlobal("admin_pactid", H_userinfo.shopid);
		var O_set: any = MtSetting.singleton();
		O_set.loadConfig("group");
		global.LOGIN_GROUPNAME = O_set["groupid" + H_userinfo.groupid];
	}

	async refreshLogin() //ログインしているかのチェック
	{
		if (this.checkSession() == false) {
			this.errorPattern("Session");
		}

		var H_userinfo = await this.O_Model.getUserInfo(this.O_Sess.admin_shopid);

		if (H_userinfo.length < 1) {
			this.errorPattern("UserDeleted", this.O_Sess.admin_shopid);
		}

		global.GROUPID = H_userinfo.groupid;
		this.setLoginCore(H_userinfo);
	}

	logOut() //セッションのクリア
	{
		this.O_Sess.clearSessionAll();
	}

	errorPattern(pattern: string, info = "") {
		var O_group: any = "";
		var goto = "";

		if (undefined !== this.O_Sess.groupid) {
			O_group = new GroupModel();

			if (1 < this.O_Sess.groupid) {
				goto = "/" + O_group.getGroupName(this.O_Sess.groupid) + "/index_admin.php";
			} else {
				goto = "/index_admin.php";
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
				this.O_Out.errorOut(25, "ログイン中のユーザが削除された(pactid,userid: " + info + ")", true, "/", "ログインページへ");
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
