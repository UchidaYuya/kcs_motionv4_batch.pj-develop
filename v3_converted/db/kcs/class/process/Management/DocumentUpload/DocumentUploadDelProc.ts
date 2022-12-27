//error_reporting(E_ALL|E_STRICT);
//
//DocumentUploadDelProc
//
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2016/02/15
//

require("process/ProcessBaseHtml.php");

require("MtUniqueString.php");

require("view/Management/DocumentUpload/DocumentUploadDelView.php");

require("model/Management/DocumentUpload/DocumentUploadDelModel.php");

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
class DocumentUploadDelProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new DocumentUploadDelView();
	}

	get_Model(H_g_sess) {
		return new DocumentUploadDelModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//権限一覧取得
	//権限チェック
	//スーパーユーザーならアップロードしたものを全て表示
	//Formの登録
	//フォームにエラーがないなら
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_document_manage_up") == false) {
			this.errorOut(6, "\u6DFB\u4ED8\u8CC7\u6599\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u6A29\u9650\u304C\u306A\u3044", false);
		}

		var H_sess = O_view.getLocalSession();

		if (H_g_sess.su) {
			var userid = undefined;
		} else {
			userid = H_g_sess.userid;
		}

		var H_list = O_model.getList(H_g_sess.pactid, userid, H_sess.SELF.delid, H_sess.SELF.sort);
		var validate = O_view.makeForm();

		if (validate) {
			if (H_sess.SELF.post.submit == O_view.DeleteName) //CSRF
				//sql文を作成
				//DB更新成功
				{
					var O_unique = MtUniqueString.singleton();
					O_unique.validate(H_sess.SELF.post.csrfid);
					var A_sql = O_model.makeDelSQL(H_g_sess.pactid, userid, H_sess.SELF.delid);

					if (O_model.execDB(A_sql) == true) //完了画面
						{
							O_view.endDelView(H_sess);
							throw die();
						} else //エラー画面
						{
							this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Menu/menu.php");
						}
				}
		}

		O_view.displaySmarty(H_list);
	}

	__destruct() {
		super.__destruct();
	}

};