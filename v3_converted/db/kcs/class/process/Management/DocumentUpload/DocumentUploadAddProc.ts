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

require("view/Management/DocumentUpload/DocumentUploadAddView.php");

require("model/Management/DocumentUpload/DocumentUploadAddModel.php");

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
class DocumentUploadAddProc extends ProcessBaseHtml {
	static PUB = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new DocumentUploadAddView();
	}

	get_Model(H_g_sess) {
		return new DocumentUploadAddModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//アップロード情報をセッションに書いたため、セッション情報の取り直しをします。
	//権限一覧取得
	//権限チェック
	//ファイルアップロードについて
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_document_manage_up") == false) {
			this.errorOut(6, "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", false);
		}

		O_view.makeForm();

		if (_FILES.file.name != "") //ファイルのアップロード
			//エラーチェック
			{
				var uperr = O_view.uploadFile(H_g_sess.pactid, H_g_sess.userid);

				if (!uperr) //アップロード情報をセッションに書いたため、セッション情報の取り直しをします。
					//存在しないpostIDの取得を行う
					//警告として登録する
					{
						H_sess = O_view.getLocalSession();
						var notexistUserPostId = O_model.getNotExistsUserPostId(H_sess.SELF.upload.up_file, H_sess.SELF.post.use_header == 1 ? true : false);

						if (is_null(notexistUserPostId)) //拡張子やサイズエラー
							{
								var msg = "<br><font color='red'>";
								msg += "\u7121\u52B9\u306A\u30D5\u30A1\u30A4\u30EB\u3067\u3059\u3002<br>\u30D5\u30A1\u30A4\u30EB\u306E\u5185\u5BB9\u3092\u898B\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002<br>";
								msg += "</font>";
								O_view.O_FormUtil.setElementErrorWrapper("file", msg);
							} else if (!!notexistUserPostId) {
							warning.file += "<font color='red'>";
							warning.file += "<br><br>\u4EE5\u4E0B\u306E\u90E8\u7F72\u306F\u672A\u767B\u9332\u3067\u3059\u3002<br>";
							warning.file += notexistUserPostId.join(",") + "<br>";
							warning.file += "</font>";
						}
					} else //拡張子やサイズエラー
					{
						msg = "<br><font color='red'>";
						msg += uperr.join("<br>") + "<br>";
						msg += "</font>";
						O_view.O_FormUtil.setElementErrorWrapper("file", msg);
					}
			}

		if (O_view.validate() == true) {
			if (H_sess.SELF.post.addsubmit == O_view.NextName) //フォームをフリーズする
				{
					O_view.freezeForm();
				} else if (H_sess.SELF.post.addsubmit == O_view.RecName) //CSRF
				//sql文を作成
				//DB更新成功
				{
					var O_unique = MtUniqueString.singleton();
					O_unique.validate(H_sess.SELF.post.uniqueid);
					var A_sql = O_model.makeAddSQL(H_sess);

					if (O_model.execDB(A_sql) == true) //完了画面
						{
							O_view.endAddView();
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

		O_view.displaySmarty(warning);
	}

	__destruct() {
		super.__destruct();
	}

};