//
//運送請求明細ダウンロードProccess
//
//更新履歴：<br>
//2008/04/28 宝子山浩平 作成
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/28
//@filesource
//@uses BillDownloadProcBase
//@uses TransitDownloadView
//@uses TransitMenuModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//運送請求明細ダウンロードProccess
//
//@package Bill
//@subpackage Proccess
//@author houshiyama
//@since 2008/04/28
//@uses BillDownloadProcBase
//@uses TransitDownloadView
//@uses TransitMenuModel
//

require("process/ProcessBaseHtml.php");

require("BillUtil.php");

require("view/Bill/AddBill/AddBillPostBillDownloadView.php");

require("model/Bill/AddBill/AddBillMenuModel.php");

//
//ディレクトリ名
//
//
//doExecute
//だうんろーど
//@author web
//@since 2015/12/01
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/28
//
//@access public
//@return void
//
class AddBillPostBillDownloadProc extends ProcessBaseHtml {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AddBillPostBillDownloadView();
	}

	get_Model(H_g_sess: {} | any[]) {
		return new AddBillMenuModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//ログインチェック
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//セッション情報取得（ローカル）
	//パラメータのエラーチェック
	//権限一覧取得
	//権限のチェック
	//部署一覧取得
	////	請求数の取得
	//		$list_cnt = $O_model->getListCount($H_g_sess["pactid"],$H_sess["SELF"]["search"] );
	//CSV出力
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		var H_sess = O_view.getLocalSession();
		O_model.initialize(H_sess[AddBillPostBillDownloadProc.PUB].cym);
		O_view.checkParamError(H_sess, H_g_sess);
		var A_auth = O_model.get_AuthIni();

		if (H_sess.SELF.input_flg) //受注内容入力の権限を確認するよ
			{
				if (-1 !== A_auth.indexOf("fnc_addbill_input") == false) {
					this.errorOut(6, "\u53D7\u6CE8\u5185\u5BB9\u5165\u529B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", false);
				}
			} else //追加請求情報の権限を確認するぽよ
			{
				if (-1 !== A_auth.indexOf("fnc_addbill") == false) {
					this.errorOut(6, "\u8FFD\u52A0\u8ACB\u6C42\u60C5\u5831\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", false);
				}
			}

		var userid = undefined;

		if (-1 !== A_auth.indexOf("fnc_addbill_confirm")) {
			userid = undefined;
		} else if (-1 !== A_auth.indexOf("fnc_addbill_input")) {
			userid = H_g_sess.userid;
		}

		O_view.setDLProperty();
		var postlist = O_model.getPostList(H_g_sess.pactid, H_sess[AddBillPostBillDownloadProc.PUB].cym, H_sess[AddBillPostBillDownloadProc.PUB].current_postid);

		if (undefined !== _GET.full) //全部署
			{
				var H_list = O_model.getPostBillListFull(H_g_sess.pactid, postlist, H_sess.SELF.coid, H_sess.SELF.sort);
			} else //この部署のみ
			{
				H_list = O_model.getPostBillList(H_g_sess.pactid, postlist, H_sess[AddBillPostBillDownloadProc.PUB].current_postid, H_sess.SELF.coid, H_sess.SELF.sort, 0, 0);
			}

		O_view.displayCSV(H_list);
	}

	__destruct() {
		super.__destruct();
	}

};