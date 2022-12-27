//
//シミュレーション結果保存画面のＶｉｅｗ
//
//更新履歴：<br>
//2008/10/06 中西達夫 作成
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/10/06
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
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/10/06
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
class RecomDoSaveView extends ViewBaseHtml {
	static PUB = "/Recom3";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(RecomDoSaveView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getSelfSession() {
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	getView() {
		return this.H_View;
	}

	checkCGIParam() {
		var sess_flg = false;

		if (undefined !== _POST.label == true && _POST.label != "") {
			this.H_Local.post.label = _POST.label;
			sess_flg = true;
		}

		if (undefined !== _POST.simid == true && _POST.simid != "") {
			this.H_Local.post.simid = _POST.simid;
			sess_flg = true;
		}

		if (undefined !== _POST.carid == true && _POST.carid != "") {
			this.H_Local.post.carid = _POST.carid;
			sess_flg = true;
		}

		if (undefined !== _POST.range == true && _POST.range != "") {
			this.H_Local.post.range = _POST.range;
			sess_flg = true;
		}

		if (undefined !== _POST.postid == true && _POST.postid != "") {
			this.H_Local.post.postid = _POST.postid;
			sess_flg = true;
		}

		if (undefined !== _POST.telno == true && _POST.telno != "") {
			this.H_Local.post.telno = _POST.telno;
			sess_flg = true;
		}

		if (undefined !== _POST.period == true && _POST.period != "") {
			this.H_Local.post.period = _POST.period;
			sess_flg = true;
		}

		if (undefined !== _POST.buysel == true && _POST.buysel === "on") {
			this.H_Local.post.buysel = _POST.buysel;
			sess_flg = true;
		} else {
			this.H_Local.post.buysel = "off";
		}

		if (undefined !== _POST.pakefree == true && _POST.pakefree.length) {
			this.H_Local.post.pakefree = _POST.pakefree;
			sess_flg = true;
		}

		if (undefined !== _POST.border_sel == true && _POST.border_sel != "") {
			this.H_Local.post.border_sel = _POST.border_sel;
			sess_flg = true;
		}

		if (undefined !== _POST.border == true && _POST.border != "") {
			this.H_Local.post.border = _POST.border;
			sess_flg = true;
		}

		if (undefined !== _POST.slash == true && _POST.slash != "") {
			this.H_Local.post.slash = _POST.slash;
			sess_flg = true;
		}

		if (undefined !== _POST.division == true && _POST.division.length) {
			this.H_Local.post.division = _POST.division;
			sess_flg = true;
		}

		if (sess_flg == true) {
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}
	}

	checkParamError(H_sess, H_g_sess) // ToDo * label が空ならエラー、等々
	{}

	displayResult(result, label) {
		if (this.O_Sess.language === "ENG") {
			if (result == true) {
				print("<br>" + label + " Data save completed");
			} else {
				print("<br>" + label + " Data save failed\uFF01");
			}

			print("<form>");
			print("<input type=\"button\" name=\"CloseBtn\" value=\"close\" onClick=\"window.close();\">");
			print("</form>");
		} else {
			if (result == true) {
				print("<br>" + label + " \u30C7\u30FC\u30BF\u30BB\u30FC\u30D6\u3092\u5B8C\u4E86\u3057\u307E\u3057\u305F\u3002");
			} else {
				print("<br>" + label + " \u30C7\u30FC\u30BF\u4FDD\u5B58\u5931\u6557\uFF01");
			}

			print("<form>");
			print("<input type=\"button\" name=\"CloseBtn\" value=\"\u9589\u3058\u308B\" onClick=\"window.close();\">");
			print("</form>");
		}
	}

	__destruct() {
		super.__destruct();
	}

};