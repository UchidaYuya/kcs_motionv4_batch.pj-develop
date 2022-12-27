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

require("model/FileUpload/FileUploadMenuModel.php");

require("view/FileUpload/FileUploadMenuView.php");

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
//downloadFile
//ダウンロード
//@author web
//@since 2018/05/11
//
//@param mixed $id
//@access private
//@return void
//
//
//deleteFile
//ファイル削除
//@author web
//@since 2018/05/11
//
//@param mixed $pactid
//@param mixed $id
//@param mixed $O_model
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
class FileUploadMenuProc extends ProcessBaseHtml {
	static PUB = "/FileUpload";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new FileUploadMenuView();
	}

	get_Model(H_g_sess) {
		return new FileUploadMenuModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//アップロード情報をセッションに書いたため、セッション情報の取り直しをします。
	//権限一覧取得
	//権限チェック
	//ファイルアップロードについて
	//データ数
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_file_upload") == false) {
			this.errorOut(6, "\u30D5\u30A1\u30A4\u30EB\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", false);
		}

		if (undefined !== _GET.id) //downloadFile内でexitしているため、ここで終わり
			{
				this.downloadFile(H_g_sess.pactid, _GET.id, O_model);
			}

		if (undefined !== _GET.del) {
			this.deleteFile(H_g_sess.pactid, _GET.del, O_model, O_view);
		}

		O_view.makeForm();

		if (_FILES.file.name != "") //ファイルのアップロード
			//エラーチェック
			{
				var uperr = O_view.uploadFile(H_g_sess.pactid, H_g_sess.userid, H_g_sess.loginname);

				if (!uperr) //アップロード成功
					//アップロード情報をセッションに書いたため、セッション情報の取り直しをします。
					//登録しよう
					//sql文を作成
					//失敗ならエラー画面
					{
						H_sess = O_view.getLocalSession();
						var O_unique = MtUniqueString.singleton();
						O_unique.validate(H_sess.SELF.post.uniqueid);
						var A_sql = O_model.makeAddSQL(H_g_sess.pactid, H_g_sess.postid, H_g_sess.userid, H_g_sess.loginname, H_sess.SELF.upload.dataname, H_sess.SELF.upload.filename);

						if (O_model.execDB(A_sql) == true) //ページ読み直し
							{
								O_view.endAddView("\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9");
								throw die();
							} else {
							this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Menu/menu.php");
						}
					} else //拡張子やサイズエラーのチェックぽよ
					{
						var msg = "<br><font color='red'>";
						msg += uperr.join("<br>") + "<br>";
						msg += "</font>";
						O_view.O_FormUtil.setElementErrorWrapper("file", msg);
					}
			}

		var file_list = O_model.getList(H_g_sess.pactid, H_sess.SELF.page, H_sess.SELF.limit);
		var file_list_cnt = !file_list ? 0 : file_list[0].full_count;
		O_view.displaySmarty(H_sess.SELF.page, file_list, file_list_cnt);
	}

	downloadFile(pactid, id, O_model) //ファイルタイプを指定
	//ファイルサイズを取得し、ダウンロードの進捗を表示
	//ファイルのダウンロード、リネームを指示
	//header('Content-Disposition: attachment; filename="'.$info["filename"].'"');
	//ファイルを読み込みダウンロードを実行
	{
		var info = O_model.getFileInfo(pactid, id);

		if (!info) {
			this.errorOut(8, "\u6307\u5B9A\u3055\u308C\u305FID\u306E\u30D5\u30A1\u30A4\u30EB\u306F\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3067\u304D\u307E\u305B\u3093", false, "/Menu/menu.php");
			throw die();
		}

		var filepath = "/kcs/files/FileUpload/" + pactid + "/" + info.dataname;
		header("Content-Type: application/force-download");
		header("Content-Length: " + filesize(filepath));
		var filename = mb_convert_encoding(info.filename, "SJIS-win", "UTF-8");
		header("Content-Disposition: attachment; filename=\"" + filename + "\"");
		readfile(filepath);

		if (undefined !== _COOKIE.dataDownloadRun) //セッションでダウンロード完了にする
			{
				_SESSION.dataDownloadCheck = 2;
			}

		throw die();
	}

	deleteFile(pactid, id, O_model, O_view) {
		var res = O_model.deleteFile(pactid, id);

		if (res === true) {
			O_view.endAddView("\u30D5\u30A1\u30A4\u30EB\u524A\u9664(ID:" + id + ")");
			throw die();
		}

		this.errorOut(8, res + "(id=" + id + ")", false, "/Menu/menu.php");
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};