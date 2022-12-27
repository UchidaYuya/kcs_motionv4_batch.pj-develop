//
//Excelテンプレートのダウンロード
//
//更新履歴：<br>
//2008/11/14 中西達夫 作成
//
//@uses ViewBaseHtml
//@package Recom
//@subpackage View
//@author nakanita
//@since 2008/11/14
//
//
//error_reporting(E_ALL);
//require_once("view/QuickFormUtil.php");
//require_once("HTML/QuickForm/Renderer/ArraySmarty.php");
//require_once("view/MakePankuzuLink.php");   // パンくずリンクを作る
//require_once("view/MakePageLink.php");  // ページリンクを作る
//
//シミュレーション結果保存画面のＶｉｅｗ
//
//@uses ViewBaseHtml
//@package Recom
//@subpackage View
//@author nakanita
//@since 2008/11/14
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

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
//フォームオブジェクト
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/10/08
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//自身のセッションを取得する
//
//@author nakanita
//@since 2008/10/08
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author nakanita
//@since 2008/10/08
//
//@access public
//@return mixed
//
//
//ログインのチェックを行う
//
//@author nakanita
//@since 2008/10/08
//
//@access protected
//@return void
//
//protected function checkLogin(){
//// ログインチェックを行わないときには、何もしないメソッドで親を上書きする
//}
//
//CGIパラメータのチェックを行う
//
//セッションにCGIパラメーターを付加する<br/>
//
//@author nakanita
//@since 2008/10/08
//
//@access protected
//@return void
//
//
//パラメーターのチェックを行う
//
//@author nakanita
//@since 2008/10/08
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//結果の画面表示
//
//@author nakanita
//@since 2008/10/08
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/10/08
//
//@access public
//@return void
//
class RecomXLTView extends ViewBaseHtml {
	static PUB = "/Recom3";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(RecomXLTView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getSelfSession() {
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	getView() {
		return this.H_View;
	}

	checkCGIParam() //特になし
	{}

	checkParamError(H_sess, H_g_sess) //特になし
	{}

	displayDownload() //これがないとhttpsでDLできない
	//ブラウザ判定
	{
		var downfname = "SimTemplate.xlt";

		if (this.O_Sess.language === "ENG") {
			var fname = this.getSetting().KCS_DIR + "/class/view/Recom/SimTemplate_eng.xlt";
		} else {
			fname = this.getSetting().KCS_DIR + "/class/view/Recom/" + downfname;
		}

		header("Pragma: private");

		if (preg_match("/MSIE/i", _SERVER.HTTP_USER_AGENT)) {
			header("Content-Disposition: attachment; filename=\"" + mb_convert_encoding(downfname, "SJIS", "UTF-8") + "\"");
		} else if (preg_match("/Gecko/i", _SERVER.HTTP_USER_AGENT)) {
			header("Content-Disposition: attachment; filename=\"" + downfname + "\"");
		}

		if (file_exists(fname) == false) {
			this.errorOut(4, "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30D5\u30A1\u30A4\u30EB " + fname + " \u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093.");
		}

		header("Content-type: application/octet-stream; name=\"" + downfname + "\"");
		header("Content-Length: " + filesize(fname));
		header("Content-Transfer-Encoding: binary");
		var handle = fopen(fname, "rb");

		if (!handle) {
			this.errorOut(4, "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30D5\u30A1\u30A4\u30EB " + fname + " \u30AA\u30FC\u30D7\u30F3\u30A8\u30E9\u30FC.");
		}

		while (!feof(handle)) {
			var ret = fread(handle, 4096);
			print(ret);
		}

		fclose(handle);
	}

	__destruct() {
		super.__destruct();
	}

};