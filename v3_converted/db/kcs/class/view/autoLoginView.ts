//
//自動ログイン
//
//@uses    ViewSmarty
//@uses    MtSettin
//@uses    MtOutput
//@uses    MtSession
//@package AutoLogin
//@author  ikeshima
//@since   2013/04/25
//
//
//error_reporting(E_ALL);
//
//自動ログイン
//
//@uses    ViewSmarty
//@package AutoLogin
//@author  ikeshima
//@since   2013/04/25
//

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("view/ViewSmarty.php");

//
//__construct
//
//@author ikeshima
//@since  2013/04/26
//
//@access public
//@return void
//
//
//autoLoginInitialize
//
//@author ikeshima
//@since  2013/04/25
//
//@access public
//@return void
//
//
//setParam
//
//@author ikeshima
//@since  2013/04/24
//
//@param  string $paramname
//@param  void   $val
//@access public
//@return void
//
//
//getParam
//
//@author ikeshima
//@since  2013/04/24
//
//@param  string $paramname
//@access public
//@return void
//
//
//viewBillMenu
//
//@author ikeshima
//@since  2013/04/24
//
//@param
//@access public
//@return void
//
//
//viewBillDetails
//
//@author ikeshima
//@since 2013/04/24
//
//@param  string $postid
//@param  string $carid
//@access public
//@return void
//
// getPactId
//
// @author ikeshima
// @since 2013/04/24
//
// @param
// @access public
// @return void
// getUserId
//
// @author ikeshima
// @since 2013/05/10
//
// @param
// @access public
// @return void
//
//checkParam
//
//@author ikeshima
//@since 2013/04/24
//
//@param
//@access private
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/06/17
//
//@access public
//@return void
//
class autoLoginView extends ViewSmarty {
    constructor() //セッションクリア
    //クラス群生成
    //parent::__construct($H_param);
    {
        var O_Sess = MtSession.singleton();
        O_Sess.clearSessionAll();
        var H_param = Array();
        H_param.language = this.O_Sess.language;
        super(H_param);
        this.param = _REQUEST;
        this.return = _SERVER.HTTP_REFERER;
        this.O_Login = MtLogin.singleton();
        this.O_Out = MtOutput.singleton();
    }

    autoLoginInitialize() //パラメータ確認
    //ユーザ情報の確認
    {
        this.checkParam();
        this.O_Login.setLogin(this.param.userid, this.param.loginid, this.param.password, this.param.group);
    }

    setParam(paramname, val) {
        this.param[paramname] = val;
    }

    getParam(paramname) {
        return this.param[paramname];
    }

    viewBillMenu() {
        header("Location: /Bill/Tel/menu.php?mode=tel&ym=" + this.param.y + this.param.m + "&person=1");
        throw die();
    }

    viewBillDetails() {
        _SESSION["/Bill/Tel/menu.php,person"] = 1;
        header("Location: /Bill/Tel/bill_details.php?telno=" + this.param.telno + "&telnopostid=" + this.param.postid + "&carid=" + this.param.carid + "&ym=" + this.param.y + this.param.m + "&person=1&mode=" + this.param.mode);
        throw die();
    }

    getPactId() {
        return this.gSess().pactid;
    }

    getUserId() {
        return this.gSess().userid;
    }

    checkParam() //グループID
    //請求月確認
    //モード
    {
        if (!(undefined !== this.param.group) || this.param.group.trim() == "") //NG
            {
                this.O_Out.errorOut(8, "\u30D1\u30E9\u30E1\u30FC\u30BF[group]\u304C\u5B58\u5728\u53C8\u306F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002", false, this.return);
            }

        if (!(undefined !== this.param.userid) || this.param.userid.trim() == "") //NG
            {
                this.O_Out.errorOut(8, "\u30D1\u30E9\u30E1\u30FC\u30BF[userid]\u304C\u5B58\u5728\u53C8\u306F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002", false, this.return);
            }

        if (!(undefined !== this.param.loginid) || this.param.loginid.trim() == "") //NG
            {
                this.O_Out.errorOut(8, "\u30D1\u30E9\u30E1\u30FC\u30BF[loginid]\u304C\u5B58\u5728\u53C8\u306F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002", false, this.return);
            }

        if (!(undefined !== this.param.password) || this.param.password.trim() == "") //NG
            {
                this.O_Out.errorOut(8, "\u30D1\u30E9\u30E1\u30FC\u30BF[password]\u304C\u5B58\u5728\u53C8\u306F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002", false, this.return);
            }

        if (undefined !== this.param.telno) {
            if (this.param.telno.trim() != "") {
                this.param.telno = str_replace(["-", "\u2010", "\uFF0D", "\u30FC"], "", this.param.telno);

                if (!is_numeric(this.param.telno)) //NG
                    {
                        this.O_Out.errorOut(8, "\u30D1\u30E9\u30E1\u30FC\u30BF[telno]\u306B\u6570\u5B57\u4EE5\u5916\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002", false, this.return);
                    }
            }
        } else //NG
            {
                this.O_Out.errorOut(8, "\u30D1\u30E9\u30E1\u30FC\u30BF[telno]\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002", false, this.return);
            }

        if (!(undefined !== this.param.y) || !(undefined !== this.param.m)) //NG
            {
                this.O_Out.errorOut(8, "\u30D1\u30E9\u30E1\u30FC\u30BF[y][m]\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002", false, this.return);
            }

        if (this.param.y.trim() != "") {
            if (!is_numeric(this.param.y.trim()) || mb_strlen(this.param.y.trim()) != 4) //NG
                {
                    this.O_Out.errorOut(8, "\u30D1\u30E9\u30E1\u30FC\u30BF[y]\u306F\u6570\u5B574\u6841\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002", false, this.return);
                }

            var m_year = this.param.y;
        }

        if (this.param.m.trim() != "") {
            if (!is_numeric(this.param.m) || mb_strlen(this.param.m.trim()) != 2) //NG
                {
                    this.O_Out.errorOut(8, "\u30D1\u30E9\u30E1\u30FC\u30BF[m]\u306F\u6570\u5B572\u6841\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002", false, this.return);
                }

            if (Math.round(this.param.m.trim()) <= 0 || Math.round(this.param.m.trim()) >= 13) //NG
                {
                    this.O_Out.errorOut(8, "\u30D1\u30E9\u30E1\u30FC\u30BF[m]\u306F01\uFF5E12\u307E\u3067\u306E2\u6841\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002", false, this.return);
                }

            var m_month = this.param.m;
        }

        if (m_year == "" && m_month == "") {
            this.param.y = date("Y");
            this.param.m = date("m");
        } else {
            if (!(m_year != "" && m_month != "")) //NG
                {
                    this.O_Out.errorOut(8, "\u8ACB\u6C42\u6708(\u30D1\u30E9\u30E1\u30FC\u30BF[y][m])\u306E\u5E74\u53C8\u306F\u6708\u3069\u3061\u3089\u304B\u306E\u307F\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u8ACB\u6C42\u6708\u3092\u6307\u5B9A\u3059\u308B\u5834\u5408\u306F[y][m]\u4E21\u65B9\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044", false, this.return);
                }
        }

        if (undefined !== this.param.mode) {
            if (this.param.mode.trim() != "") {
                if (this.param.mode.trim() != "0" && this.param.mode.trim() != "1" && this.param.mode.trim() != "4") //NG
                    {
                        this.O_Out.errorOut(8, "\u30E2\u30FC\u30C9(\u30D1\u30E9\u30E1\u30FC\u30BF[mode])\u306F\u901A\u8A71\u6599\u660E\u7D30= 1 \u3001\u8ACB\u6C42\u66F8\u60C5\u5831= 4 \u3001\u8ACB\u6C42\u660E\u7D30= 0(\u53C8\u306F\u7A7A) \u306E\u3069\u308C\u304B\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002", false, this.return);
                        return false;
                    }
            }

            this.param.mode = this.param.mode.trim();
        } else //NG
            {
                this.O_Out.errorOut(8, "\u30E2\u30FC\u30C9(\u30D1\u30E9\u30E1\u30FC\u30BF[mode])\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002", false, this.return);
            }
    }

    __destruct() {
        super.__destruct();
    }

};