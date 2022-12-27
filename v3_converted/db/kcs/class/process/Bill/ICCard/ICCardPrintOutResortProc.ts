//error_reporting(E_ALL|E_STRICT);
//
//運送管理情報一覧Proccess
//
//@package Management
//@subpackage Proccess
//@author houshiyama
//@since 2010/02/19
//@uses ManagementMenuProcBase
//@uses ManagementTransitMenuView
//@uses ManagementTransitMenuModel
//

require("process/ProcessBaseHtml.php");

require("view/Bill/ICCard/ICCardPrintOutResortView.php");

require("model/Bill/ICCard/ICCardPrintOutResortModel.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//viewオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@access protected
//@return void
//
//
//get_Model
//modelオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//doExecute
//
//@author date
//@since 2015/11/02
//
//@param array $H_param
//@access protected
//@return void
//
//
//checkAuth
//権限チェック
//@author web
//@since 2016/01/26
//
//@param mixed $A_auth
//@access private
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class ICCardPrintOutResortProc extends ProcessBaseHtml {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new ICCardPrintOutResortView();
	}

	get_Model(H_g_sess) {
		return new ICCardPrintOutResortModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//$O_view->startCheck();
	//権限一覧取得
	//権限チェック
	//セッション情報取得（ローカル）
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		var A_auth = O_model.get_AuthIni();
		this.checkAuth(A_auth);
		var H_sess = O_view.getLocalSession();
		var pactid = H_g_sess.pactid;
		var userid = _SESSION["/Bill/ICCard/ICCardPrintOut.php,view_userid"];

		if (undefined !== _SESSION["/Bill/ICCard/menu.php,iccardcoid"]) {
			var coid = _SESSION["/Bill/ICCard/menu.php,iccardcoid"];
		} else //個人別からだとこの値は存在しない・・
			{
				coid = 1;
			}

		var tblno = _SESSION["/Bill/ICCard/ICCardPrintOut.php,table_no"];
		var printdate = _SESSION["/Bill/ICCard/ICCardPrintOut.php,pdY"] + "-" + _SESSION["/Bill/ICCard/ICCardPrintOut.php,pdm"] + "-" + _SESSION["/Bill/ICCard/ICCardPrintOut.php,pdd"];
		var H_data = O_model.getList(pactid, coid, userid, tblno);
		var A_userinfo = O_model.getUserInfo(userid);
		O_view.outputPDF(H_data, A_userinfo, printdate);
	}

	checkAuth(A_auth) //交通費請求をチェック
	{
		if (-1 !== A_auth.indexOf("fnc_iccard_bill_view")) {
			return;
		}

		if (-1 !== A_auth.indexOf("fnc_iccard_bill_person")) {
			return;
		}

		this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", 0, "javascript:window.close();", "\u9589\u3058\u308B");
	}

	__destruct() {
		super.__destruct();
	}

};