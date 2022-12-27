//error_reporting(E_ALL|E_STRICT);
//
//AddBillMasterProc
//マスタ一覧の表示
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2015/11/11
//

require("process/ProcessBaseHtml.php");

require("view/Bill/AddBill/AddBillMenuView.php");

require("model/Bill/AddBill/AddBillMenuModel.php");

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
class AddBillMenuProc extends ProcessBaseHtml {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AddBillMenuView();
	}

	get_Model(H_g_sess) {
		return new AddBillMenuModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//セッション情報取得（ローカル）
	//権限のチェック
	//データの取得
	//検索フォーム
	//ツリー作成
	//部署ツリー作成
	//初期化
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();
		var H_sess = O_view.getLocalSession();

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

		O_model.initialize(H_sess[AddBillMenuProc.PUB].cym);

		if (H_sess.SELF.input_flg || H_sess[AddBillMenuProc.PUB].cym == "current") //受注内容入力について
			//請求数の取得
			{
				var userid = -1;

				if (-1 !== A_auth.indexOf("fnc_addbill_confirm")) {
					userid = undefined;
				} else if (-1 !== A_auth.indexOf("fnc_addbill_input")) {
					userid = H_g_sess.userid;
				}

				var H_list = O_model.getList(H_g_sess.pactid, H_sess.SELF.offset, H_sess.SELF.limit, H_sess.SELF.search, H_sess.SELF.sort, userid);
				var list_cnt = O_model.getListCount(H_g_sess.pactid, H_sess.SELF.search, userid);
			} else //部署単位の場合は部署一覧の取得
			{
				if (H_sess.SELF.mode == 0) //部署一覧取得
					//取得した部署がない場合は明細単位に切り返る
					{
						var postlist = O_model.getPostList(H_g_sess.pactid, H_sess[AddBillMenuProc.PUB].cym, H_sess[AddBillMenuProc.PUB].current_postid);

						if (postlist.length == 1) {
							O_view.setMode(1);
							H_sess = O_view.getLocalSession();
						}
					}

				if (H_sess.SELF.mode == "0") {
					if (!postlist) {
						H_list = Array();
						list_cnt = 9;
						O_view.assignPostBill(0, 0, 0, 0);
					} else //部署単位
						{
							H_list = O_model.getPostBillList(H_g_sess.pactid, postlist, H_sess[AddBillMenuProc.PUB].current_postid, H_sess.SELF.coid, H_sess.SELF.sort, H_sess.SELF.offset, H_sess.SELF.limit);
							list_cnt = O_model.getPostBillListCount(H_g_sess.pactid, postlist, H_sess[AddBillMenuProc.PUB].current_postid, H_sess.SELF.coid);
							var post_bill = O_model.getPostBill(H_g_sess.pactid, H_sess[AddBillMenuProc.PUB].current_postid, H_sess.SELF.coid, 1);
							O_view.assignPostBill(post_bill.cnt, post_bill.num, post_bill.price + post_bill.tax, post_bill.tax);
						}
				} else //明細単位
					{
						H_list = O_model.getBillList(H_g_sess.pactid, H_sess[AddBillMenuProc.PUB].cym, H_sess[AddBillMenuProc.PUB].current_postid, H_sess.SELF.coid, H_sess.SELF.sort, H_sess.SELF.search, H_sess.SELF.limit, H_sess.SELF.offset);
						list_cnt = O_model.getBillListCount(H_g_sess.pactid, H_sess[AddBillMenuProc.PUB].cym, H_sess[AddBillMenuProc.PUB].current_postid, H_sess.SELF.coid, H_sess.SELF.search);
						post_bill = O_model.getPostBill(H_g_sess.pactid, H_sess[AddBillMenuProc.PUB].current_postid, H_sess.SELF.coid, 1);
						O_view.assignPostBill(post_bill.cnt, post_bill.num, post_bill.price + post_bill.tax, post_bill.tax);
					}
			}

		var coid_sel = O_model.getCoid(H_g_sess.pactid);
		var search_validate = O_view.makeSearchForm(H_g_sess.pactid);
		var H_tree = O_model.getTreeJS(H_g_sess.pactid, H_g_sess.postid, H_sess[AddBillMenuProc.PUB].current_postid);
		var js = H_tree.js;
		var post_tree = O_model.getPostTree(H_sess[AddBillMenuProc.PUB].cym, "0", H_sess[AddBillMenuProc.PUB].current_postid);
		var recalc_flg = false;

		if (H_sess[AddBillMenuProc.PUB].cym != "current") {
			var year = H_sess[AddBillMenuProc.PUB].cym.substr(0, 4);
			var month = H_sess[AddBillMenuProc.PUB].cym.substr(4, 2);
			recalc_flg = O_model.checkInRecalc(year, month);
		}

		O_view.displaySmarty(A_auth, recalc_flg, H_list, list_cnt, post_tree, H_tree, js, coid_sel);
	}

	__destruct() {
		super.__destruct();
	}

};