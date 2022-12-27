//error_reporting(E_ALL|E_STRICT);
//
//AddBillMasterProc
//マスタ一覧の表示
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2015/11/11
//

require("MtUniqueString.php");

require("process/ProcessBaseHtml.php");

require("view/Management/AddBill/AddBillMasterUserView.php");

require("model/Management/AddBill/AddBillMasterUserModel.php");

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
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class AddBillMasterUserProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AddBillMasterUserView();
	}

	get_Model(H_g_sess) {
		return new AddBillMasterUserModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//権限チェック
	//ツリーについて
	//ユーザー情報の取得
	//ユーザー数の取得
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_addbill_confirm") == false) {
			this.errorOut(6, "", false);
		}

		var H_sess = O_view.getLocalSession();
		var H_tree = O_model.getTreeJS(H_g_sess.pactid, H_g_sess.postid, H_sess[AddBillMasterUserProc.PUB].pid);
		var tree_js = H_tree.js;
		var userlist = O_model.getUserList(H_g_sess.pactid, H_sess[AddBillMasterUserProc.PUB].pid, H_sess[AddBillMasterUserProc.PUB].posttarget, H_sess.SELF.offset, H_sess.SELF.limit, H_sess.SELF.sort);
		var usercnt = O_model.getUserCnt(H_g_sess.pactid, H_sess[AddBillMasterUserProc.PUB].pid, H_sess[AddBillMasterUserProc.PUB].posttarget);

		if (H_sess.SELF.post.setuser == O_view.RecName) {
			O_view.endView();
		} else //Smartyによる表示
			{
				O_view.displaySmarty(H_tree, tree_js, userlist, usercnt);
			}
	}

	__destruct() {
		super.__destruct();
	}

};