//認証クラス


import MtOutput from "./MtOutput";
import MtSession from "./MtSession";
import MtAuthority from "./MtAuthority";
import MtCryptUtil from "./MtCryptUtil";
import MtPostUtil from "./MtPostUtil";
import GroupModel from "./model/GroupModel";
import MtSetting from "./MtSetting";
import LoginModel from "./model/LoginModel";
import PostModel from "./model/PostModel";

const MD5 = require("crypto-js/md5");
let _SESSION: any;
let _POST: any;
export default class MtLogin {
    static SAVE_SESSION_SHOP = "SAVE_SESSION_SHOP";
    static O_Instance: MtLogin;
    O_Out: MtOutput;
    O_Conf: MtSetting;
    O_Sess: MtSession;
    O_Model: LoginModel;
    O_group: GroupModel;
    O_Crypt: MtCryptUtil | undefined;
    loginid: number | undefined;
    constructor() {
        this.O_Out = MtOutput.singleton();
        this.O_Sess = MtSession.singleton();
        this.O_Conf = MtSetting.singleton();
        this.O_Conf.loadConfig("group");
        this.O_Model = new LoginModel();
        this.O_group = new GroupModel();
    }

    static singleton() { //まだインスタンスが生成されていなければ
        if (MtLogin.O_Instance == undefined) {
            MtLogin.O_Instance = new MtLogin();
        }

        return MtLogin.O_Instance;
    }

    checkSession() {
        if (
            !isNaN(Number(this.O_Sess.userid)) == true &&
            !isNaN(Number(this.O_Sess.pactid)) == true &&
            !isNaN(Number(this.O_Sess.postid)) == true
        ) {
            //ログインしている
            return true;
        }

        return false;
    }

    checkSessionLimit() {
        if (
            !isNaN(Number(this.O_Sess.limit_time)) == false ||
            this.O_Sess.limit_time < 1
        ) {
            //未ログインのエラー
            this.errorPattern("Session", this.O_Sess.userid);
        }

        if (this.O_Sess.limit_time > Date.now() / 1000) {
            //有効
            return true;
        } //有効時間外
        else {
            return false;
        }
    }

    checkPassword(H_userinfo: any, input_passwd: string) {
        this.O_Crypt = MtCryptUtil.singleton();

        if (H_userinfo.passwd != this.O_Crypt.getCrypt(input_passwd)) {
            //Hotlineのパスワードチェック
            if (H_userinfo.passwd == MD5(input_passwd).toString()) {
                    this.O_Model.updateUserPassword(H_userinfo.userid, this.O_Crypt.getCrypt(input_passwd)
                );
            } else {
                return false;
            }
        }

        return true;
    }

    async checkPassWordLimit(
        pactid: string,
        uid: number,
        type = false //まずはパス有効期限の権限がある会社か？
    ) {
        var O_auth = MtAuthority.singleton(pactid);

        if (O_auth.chkPactFuncIni("fnc_password_limit") == true) {
            //パスワードの有効時間を取得
            var pass_lim = await this.O_Model.getLoginPasschanged(uid);

            if (pass_lim == "") {
                //パスワード変更日が空（権限追加後初アクセスなど）
                //パスワード変更画面へ飛ばす
                this.jumpPassChage(pactid, uid, type, 0);
            } else {
                var date_exe = pass_lim.split(" ");
                date_exe[1] = new Date()
                    .toJSON()
                    .slice(0, 10)
                    .replace(/-/g, "-");
                var change_days =
                    (Date.parse(date_exe[1]) - Date.parse(date_exe[0])) /
                    (24 * 60 * 60);

                if (change_days > this.O_Conf.get("password_limit")) {
                    this.jumpPassChage(pactid, uid, type, 1);
                } else {
                    delete _SESSION.passOUT;
                }
            }
        }
    }

    jumpPassChage(pactid: string, uid: number, type: any, out: number) {
        // session_start();

        if (out == 0) {
            //初期パスワードはそのまま利用できません。新しいパスワードを設定してください
            _SESSION.passOUT = "ON";
        } //パスワードの有効期限が過ぎました。新しいパスワードを設定してください
        else {
            _SESSION.passOUT = "OFF";
        }

        var O_auth: any = MtAuthority.singleton(pactid);

        if (
            O_auth.chkUserFuncIni(uid, "fnc_chg_pass") == true &&
            type == false
        ) {
            // header("Location: /Menu/chg_password.php");
            throw process.exit(0);
        }
    }

    async writeLoginRelSess( pactid: string, userid: string ) //２重ログイン権限があれば
    {
        var O_auth: any = MtAuthority.singleton(pactid);

        if (O_auth.chkPactFuncIni("fnc_double_login") == true) {
            // var sess_id = session_id();
            let sess_id = 0;
            var result = await this.O_Model.setLoginSessInfo(pactid, userid, sess_id);

            if (result == 0) {
                //失敗
                // session_unset();
                return false;
            }
        }

        return true;
    }

    async checkDoubleLogin( pactid: string,userid: string ) {
        if (this.O_Sess.narikawari === undefined) {
            var O_auth = MtAuthority.singleton(pactid);

            if (O_auth.chkPactFuncIni("fnc_double_login") == true) {
                //, $narikawari );
                // var sess_id = session_id();
                var sess_id = "";
                var A_pact_user_num = await this.O_Model.getLoginSessInfo(pactid,userid,sess_id);

                if (A_pact_user_num.length != 1) {
                    //$this->O_Out->errorOut(32, "userid: " . $userid . "-sess: " . $sess_id, 0);
                    global.GROUPID = _SESSION.groupid;
                    var pid = _SESSION.pactid;
                    _SESSION.pid = pid;
                    return false;
                }
            }
        }

        return true;
    }

    async checkIPrestrict( pactid: number )
    {
        var remote = ""; //process.REMOTE_ADDR;

        if (remote == "") {
            this.errorPattern("RemoteAddr", remote);
        }

        this.O_Conf.loadConfig("iprestrict");

        if ((-1 !== this.O_Conf.get("A_ip_exclude").indexOf(remote)) == true) {
            return true;
        }

        const A_list = await this.O_Model.getIpRestrict(pactid);
        const cnt = A_list.length;

        if (cnt === 0) {
            return true;
        }

        const A_now: any = new Date().toLocaleTimeString().split(":");
        const now = new Date(2000, 1, 1, A_now[0], A_now[1], A_now[2]);

        for (var i = 0; i < cnt; i++) {
            // if (A_list[i].net == remote || NET_IPv4.ipInNetwork(remote, A_list[i].net) == true) //時間帯
            {
                const A_stime = A_list[i].start_time.split(":");
                const stime = new Date(
                    2000,
                    1,
                    1,
                    A_stime[0],
                    A_stime[1],
                    A_stime[2]
                );
                const A_etime = A_list[i].end_time.split(":");
                const etime = new Date(
                    2000,
                    1,
                    1,
                    A_etime[0],
                    A_etime[1],
                    A_etime[2]
                );

                if (
                    now >= stime &&
                    now <= etime &&
                    A_list[i].week[new Date().getDay()] == 1
                ) {
                    //制限
                    if (A_list[i].type == "allow") {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }

        return false;
    }

    async modify2ndLevel( pactid: string,postid: number,level: number, postname: any ) 
    {
        var O_auth: any = MtAuthority.singleton(pactid);
        var lv1flag = await O_auth.chkPactFuncIni("fnc_not_view_root");
        let O_postmodel: PostModel;
        if (lv1flag == true) {
            var O_post = new MtPostUtil();
            let lv1postid = await O_post.getTargetLevelPostid(postid, 2);

            if (lv1postid == false) {
                lv1postid = await O_post.getTargetLevelPostid(postid, 0);
            }

            O_postmodel = new PostModel();
            var H_postdata = await O_postmodel.getPostData(lv1postid);
            this.O_Sess.setGlobal("compname", H_postdata.postname);
            this.O_Sess.setGlobal("toppostname", H_postdata.postname);

            if (this.O_Sess.level > 0) {
                //スーパーユーザーでもマイナスにならないように
                //部署レベルを１段下げる
                this.O_Sess.setGlobal("level", level - 1);
            }
        }
        else {
            if (level == 0) {
                this.O_Sess.setGlobal("toppostname", postname);
            } 
            else {
                O_post = new MtPostUtil();
                const rootpostid = await O_post.getTargetLevelPostid(postid, 0);
                O_postmodel = new PostModel();
                H_postdata = O_postmodel.getPostData(rootpostid);
                this.O_Sess.setGlobal("toppostname", H_postdata.postname);
            }
        }
    }

    checkCopyRight(pactid: string) 
    {
        var O_auth = MtAuthority.singleton(pactid);
        return O_auth.chkPactFuncIni("fnc_copyright");
    }

    checkLogin() { //POST["login"]があればログイン画面からの入力
        if ((undefined !== _POST.login) == true && _POST.login == "login") {
            //POSTデータチェック
            if (
                (undefined !== _POST.userid_ini) == false ||
                (undefined !== _POST.loginid) == false ||
                (undefined !== _POST.password) == false ||
                (undefined !== _POST.group) == false
            ) {
                this.errorPattern("NoInput");
            }

            this.setLogin(
                _POST.userid_ini.trim(),
                _POST.loginid.trim(),
                _POST.password.trim(),
                _POST.group.trim()
            );
            // header("Location: " + process.PHP_SELF);
            throw process.exit(0);
        } //ログイン中の場合は情報の更新処理
        else {
            this.refreshLogin();
        }
    }

    async setLogin( userid_ini: string,loginid: string,password: string,groupid: string,loginname = "") //パスワードチェック
    {
        var H_userinfo = await this.O_Model.getUserInfoAll(
            userid_ini,
            loginid,
            groupid
        );

        if (H_userinfo.length < 1) {
            this.errorPattern(
                "UserNotFound",
                userid_ini + "," + loginid + "," + groupid
            );
        }

        var pactid = H_userinfo.pactid;
        var userid = H_userinfo.userid;

        if (this.checkPassword(H_userinfo, password) == false) {
            this.errorPattern("Password", loginid);
        }

        if (await this.writeLoginRelSess(pactid, userid) == false) {
            this.errorPattern("DoubleLogin", userid);
        }

        if (await this.checkDoubleLogin(pactid, userid) == false) {
            this.errorPattern("DoubleLogin", userid);
        }

        if (await this.checkIPrestrict(pactid) == false) {
            this.errorPattern("IPRestrict", userid);
        }

        this.O_Sess.clearSessionAll();
        this.setLoginCore(H_userinfo);
        this.O_Sess.setGlobal("loginid", loginid);

        if (loginname != "") {
            this.O_Sess.setGlobal("loginname", loginname);
        } else {
            this.O_Sess.setGlobal("loginname", H_userinfo.username);
        }

        this.modify2ndLevel(
            pactid,
            H_userinfo.postid,
            H_userinfo.level,
            H_userinfo.postname
        );

        if (this.checkCopyRight(pactid) == true) {
            this.O_Sess.setGlobal("copyright", 1);
        } else {
            this.O_Sess.setGlobal("copyright", 0);
        }

        var H_log = {
            pactid: this.O_Sess.pactid,
            postid: this.O_Sess.postid,
            postname: this.O_Sess.postname,
            userid: this.O_Sess.userid,
            username: this.O_Sess.loginname,
            comment1: "ID：" + this.O_Sess.loginid,
            comment2: "ログイン処理",
            kind: "L",
            type: "ログイン",
            joker_flag: 0,
            comment1_eng: "ID：" + this.O_Sess.loginid,
            comment2_eng: "LOGIN",
        };
        this.O_Out.writeMnglog(H_log);
        this.checkPassWordLimit(pactid, userid);
        // setcookie("ini", userid_ini, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
        // setcookie("uid", loginid, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
        // setcookie("gid", groupid, Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
    }

    setLoginCore(
        H_userinfo: any,
        joker = false //セッションへの書き込み
    ) //currentにもpostidを入れておく
    {
        this.O_Sess.setGlobal("userid", H_userinfo.userid);
        this.O_Sess.setGlobal("groupid", H_userinfo.groupid);
        this.O_Sess.setGlobal("pactid", H_userinfo.pactid);
        this.O_Sess.setGlobal("compname", H_userinfo.compname);
        this.O_Sess.setGlobal("postid", H_userinfo.postid);
        this.O_Sess.setGlobal("current_postid", H_userinfo.postid);
        this.O_Sess.setGlobal("postname", H_userinfo.postname);
        this.O_Sess.setGlobal("userpostid", H_userinfo.userpostid);
        this.O_Sess.setGlobal("loginid", this.loginid);
        this.O_Sess.setGlobal("logo", H_userinfo.logo);
        this.O_Sess.setGlobal("manual", H_userinfo.manual);
        this.O_Sess.setGlobal("inq_mail", H_userinfo.inquiry);
        this.O_Sess.setGlobal("pacttype", H_userinfo.pacttype);
        this.O_Sess.setGlobal("helpfile", H_userinfo.helpfile);
        this.O_Sess.setGlobal("level", H_userinfo.level);
        this.O_Sess.setGlobal(
            "limit_time",
            Date.now() / 1000 + 60 * this.O_Conf.get("sesslimit")
        );

        if (H_userinfo.usertype == "SU") {
            this.O_Sess.setGlobal("su", true);
        } else {
            this.O_Sess.setGlobal("su", false);
        }

        if (false == joker && "H" == H_userinfo.pacttype) {
            // setcookie("type", "H", Date.now() / 1000 + 60 * 60 * 24 * 30, "/");
        }
    }

    async refreshLogin() 
    {
        if (this.checkSession() == false) {
            this.errorPattern("Session");
        }

        if (this.checkSessionLimit() == false) {
            this.errorPattern("SessionLimit", this.O_Sess.userid);
        }

        if (
            await this.checkDoubleLogin(this.O_Sess.pactid, this.O_Sess.userid) == false) {
            this.errorPattern("DoubleLogin", this.O_Sess.userid);
        }

        const H_userinfo = await this.O_Model.getUserInfo(this.O_Sess.userid);

        if (H_userinfo.length < 1) {
            this.errorPattern(
                "UserDeleted",
                this.O_Sess.pactid + "," + this.O_Sess.userid
            );
        }

        if (await this.checkIPrestrict(H_userinfo.pactid) == false) {
            this.errorPattern("IPRestrict", this.O_Sess.userid);
        }

        if (await this.checkIPrestrict(H_userinfo.pactid) == false) {
            this.errorPattern("IPRestrict", this.O_Sess.userid);
        }

        this.O_Sess.setGlobal("pactid", H_userinfo.pactid);
        this.O_Sess.setGlobal("postid", H_userinfo.postid);
        this.O_Sess.setGlobal("postname", H_userinfo.postname);
        this.O_Sess.setGlobal("userpostid", H_userinfo.userpostid);
        this.O_Sess.setGlobal("userid", H_userinfo.userid);
        this.O_Sess.setGlobal("pacttype", H_userinfo.pacttype);
        this.O_Sess.setGlobal("helpfile", H_userinfo.helpfile);
        this.O_Sess.setGlobal(
            "limit_time",
            Date.now() / 1000 + 60 * this.O_Conf.get("sesslimit")
        );
        this.O_Sess.setGlobal(
            "groupname",
            this.O_Conf["groupid" + H_userinfo.groupid]
        );
        this.O_Sess.setGlobal(
            "grouptitle",
            this.O_group.getGroupTitle(
                H_userinfo.groupid,
                H_userinfo.pacttype,
                H_userinfo.language
            )
        );
        this.O_Sess.setGlobal("language", H_userinfo.language);
        global.GROUPID = H_userinfo.groupid;

        if (H_userinfo.usertype == "SU") {
            this.O_Sess.setGlobal("su", true);
        } else {
            this.O_Sess.setGlobal("su", false);
        }
    }

    async JokerLogin( userid_ini: any,loginid: string, groupid: string,loginname = "") 
    {
        const O_login = new LoginModel();
        const H_userinfo = await O_login.getUserInfoAll(userid_ini, loginid, groupid);

        if (H_userinfo.length < 1) {
            this.errorPattern("UserNotFound", userid_ini + "," + loginid);
        }

        var pactid = H_userinfo.pactid;

        if (
            !this.O_Sess.shopid == false &&
            !isNaN(Number(this.O_Sess.shopid)) &&
            !this.O_Sess.memid == false &&
            !isNaN(Number(this.O_Sess.memid))
        ) {

            // const O_shoplogin = MtShopLogin.singleton();
            // const H_shopkey = O_shoplogin.getShopSessionHash();
            const H_shopkey = "";
            this.O_Sess.clearSessionAll();
            this.O_Sess.setGlobal(MtLogin.SAVE_SESSION_SHOP, H_shopkey);
        } //セッションをクリアする
        else {
            this.O_Sess.clearSessionAll();
        }

        this.setLoginCore(H_userinfo);

        if (loginname != "") {
            this.O_Sess.setGlobal("loginname", loginname);
        } else {
            this.O_Sess.setGlobal("loginname", "KCS Motion成り代わりユーザー");
        }

        this.modify2ndLevel(
            pactid,
            H_userinfo.postid,
            H_userinfo.level,
            H_userinfo.postname
        );

        if (this.checkCopyRight(pactid) == true) {
            this.O_Sess.setGlobal("copyright", 1);
        } else {
            this.O_Sess.setGlobal("copyright", 0);
        }

        var H_log = {
            pactid: this.O_Sess.pactid,
            postid: this.O_Sess.postid,
            postname: this.O_Sess.postname,
            userid: this.O_Sess.userid,
            username: this.O_Sess.loginname,
            comment1: "ID：" + this.O_Sess.loginid,
            comment2: "ログイン処理",
            kind: "L",
            type: "ログイン",
            joker_flag: 1,
        };
        this.O_Out.writeMnglog(H_log);
    }

    logOut() //セッションのクリア //ショップから成り代わっていた場合、ショップに戻る
    {
        var H_log = {
            pactid: this.O_Sess.pactid,
            postid: this.O_Sess.postid,
            postname: this.O_Sess.postname,
            userid: this.O_Sess.userid,
            username: this.O_Sess.loginname,
            comment1: "ID：" + this.O_Sess.loginid,
            comment2: "ログアウト処理",
            kind: "L",
            type: "ログアウト",
            joker_flag: this.O_Sess.joker,
        };
        this.O_Out.writeMnglog(H_log);
        this.restoreShop();
        this.O_Sess.clearSessionAll();
    }

    restoreShop() //if( isset( $this->O_Sess->SAVE_SESSION_SHOP ) == false ){ //ショップセッションが無ければ、何事もなくリターン
    {
        if (this.O_Sess.get("SAVE_SESSION_SHOP") === undefined) {
            return;
        }

        var H_shopkey: any = Array();
        {
            let _tmp_0: any = this.O_Sess.get("SAVE_SESSION_SHOP");

            for (var key in _tmp_0) {
                var val = _tmp_0[key];
                H_shopkey[key] = val;
            }
        }
        this.O_Sess.clearSessionAll();

        for (var key in H_shopkey) {
            var val_0 = H_shopkey[key];
            this.O_Sess.setGlobal(key, val_0);
        }

        // header("Location: /Shop/menu.php");
        throw process.exit(0);
    }

    errorPattern(pattern: string,info: string = "")
	{}
}

