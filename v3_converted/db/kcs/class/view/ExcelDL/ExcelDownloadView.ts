//
//エクセルファイルダウンロードView
//
//更新履歴：<br>
//2008/07/02 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/07/02
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//エクセルファイルダウンロードView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/07/02
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

//
//ディレクトリ名
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/07/02
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//セッションのカレント部署とこのページのカレント部署が違っていたら同期してリロード
//
//@author houshiyama
//@since 2008/07/02
//
//@access private
//@return void
//
//
//CGIパラメータのチェックを行う<br>
//
//GETパラメータ（シリアル）を配列に入れる<br>
//
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/07/02
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/07/02
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2008/07/02
//
//@access public
//@return mixed
//
//
//対象ファイルの存在チェック <br>
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $fkey
//@access public
//@return void
//
//
//パラメータチェック <br>
//
//@author houshiyama
//@since 2008/07/02
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//ダウンロード実行
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $fkey
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ExcelDownloadView extends ViewSmarty {
	static PUB = "/ExcelDL";

	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(ExcelDownloadView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	setDefaultSession() {}

	checkCGIParam() //最初のアクセス時
	{
		this.setDefaultSession();

		if (undefined !== _POST.fkey == true) {
			this.H_Local.post = _POST;
			this.O_Sess.setSelfAll(this.H_Local);
		}
	}

	getLocalSession() {
		var pare_key = "/ExcelDL/menu.php";
		var H_sess = {
			[ExcelDownloadView.PUB]: this.O_Sess.getPub(ExcelDownloadView.PUB),
			SELF: array_merge(this.O_Sess.getSelfAll())
		};
		return H_sess;
	}

	get_View() {
		return this.H_View;
	}

	checkFileExist(fkey) {
		this.H_View.fname = this.O_Set.KCS_DIR + "/files/" + this.O_Sess.pactid + "-" + this.O_Sess.userid + "-" + fkey;

		if (file_exists(this.H_View.fname) == false) {
			echo("\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
			throw die();
		}
	}

	checkParamError(H_sess, H_g_sess) {}

	execDL(fkey) //ブラウザでファイルを保存しようとした時に表示されるファイル名
	//HTTPヘッダを付けてファイルを出力する
	{
		var pos = strpos(fkey, "_");
		var pre = fkey.substr("0", pos);
		var filename = pre + "_" + date("YmdHis") + ".xls";

		if (preg_match("/MSIE/i", _SERVER.HTTP_USER_AGENT) == true) {
			header("Pragma: private");
			header("Content-Disposition: attachment; filename=\"" + mb_convert_encoding(filename, "SJIS-win", "UTF-8") + "\"");
		} else if (preg_match("/Gecko/i", _SERVER.HTTP_USER_AGENT) == true) {
			header("Content-Disposition: attachment; filename=\"" + filename + "\"");
		}

		header("Content-type: application/octet-stream; name=\"" + basename(this.H_View.fname) + "\"");
		header("Content-Length: " + filesize(this.H_View.fname));
		header("Content-Transfer-Encoding: binary");
		readfile(this.H_View.fname);
	}

	__destruct() {
		super.__destruct();
	}

};