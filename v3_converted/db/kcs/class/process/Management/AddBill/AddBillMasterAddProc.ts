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

require("view/Management/AddBill/AddBillMasterAddView.php");

require("model/Management/AddBill/AddBillMasterAddModel.php");

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
class AddBillMasterAddProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new AddBillMasterAddView();
	}

	get_Model(H_g_sess) {
		return new AddBillMasterAddModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//権限チェック
	//マスターデータの取得(変更で使うよ！)
	//新規登録ボタンの設定
	//フォームにエラーが無い
	//Smartyによる表示
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

		if (_SERVER.REQUEST_URI == "/Management/AddBill/AddBillMasterMod.php") //変更の場合、データを取得する
			//取得したらpostに設定して取得しなおす
			//セッションを取得しなおす
			{
				var H_add_bill_temp_data = O_model.getAddBillTempData(H_g_sess.pactid, H_sess.SELF.tempid);
				var H_add_bill_temp_user_data = O_model.getAddBillTempUserData(H_g_sess.pactid, H_sess.SELF.tempid);
				O_view.setAddBillTempData(H_add_bill_temp_data, H_add_bill_temp_user_data);
				H_sess = O_view.getLocalSession();
			}

		var co_list = O_model.getCoList();
		O_view.makeForm(H_g_sess.pactid, co_list);

		if (O_view.validate() == true) {
			if (H_sess.SELF.post.addsubmit == O_view.NextName) //フォームをフリーズする
				{
					O_view.freezeForm();
				} else if (H_sess.SELF.post.addsubmit == O_view.RecName) //CSRF
				//sql文を作成
				//DB更新成功
				{
					var O_unique = MtUniqueString.singleton();
					O_unique.validate(H_sess.SELF.post.csrfid);
					var A_sql = O_model.makeAddSQL(H_g_sess.pactid, H_sess.SELF.post, H_sess.SELF.tempid);

					if (O_model.execDB(A_sql) == true) //完了画面
						{
							O_view.endAddView(H_sess);
							throw die();
						} else //エラー画面
						{
							this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Menu/menu.php");
						}
				}
		} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};