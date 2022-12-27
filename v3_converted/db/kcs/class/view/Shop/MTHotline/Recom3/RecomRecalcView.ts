//
//シミュレーション再実行依頼
//
//更新履歴：<br>
//2008/11/21 中西達夫 作成
//
//@uses ViewSmarty
//@package Shop
//@subpackage View
//@author nakanita
//@since 2008/11/21
//
//
//error_reporting(E_ALL);
//
//シミュレーション再実行依頼
//
//@uses ViewSmarty
//@package Shop
//@subpackage View
//@author nakanita
//@since 2008/11/21
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewSmarty.php");

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
//protected $H_Dir;
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
//@since 2008/11/21
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
//@since 2008/11/21
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author nakanita
//@since 2008/11/21
//
//@access public
//@return mixed
//
//
//CGIパラメータのチェックを行う
//
//セッションにCGIパラメーターを付加する<br/>
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//入力値のチェックを行う
//
//@author nakanita
//@since 2008/11/21
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access public
//@return boolean
//
//
//Smartyを用いた画面表示
//
//@author nakanita
//@since 2008/11/21
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/11/21
//
//@access public
//@return void
//
class RecomRecalcView extends ViewSmarty {
	static PUB = "/Shop/MTHotline/Recom3";

	constructor(H_param: {} | any[] = Array()) //ショップ属性を付ける
	//$this->H_Dir = $this->O_Sess->getPub( self::PUB );
	{
		H_param.site = ViewBaseHtml.SITE_SHOP;
		super(H_param);
		this.O_Sess = MtSession.singleton();
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getSelfSession() //$H_sess = array( self::PUB => $this->O_Sess->getPub( self::PUB ),
	//"SELF" => $this->O_Sess->getSelfAll() );
	{
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	getView() {
		return this.H_View;
	}

	checkCGIParam() {
		var sess_flg = false;

		if (undefined !== _GET.carid == true && _GET.carid != "") {
			this.H_Local.get.carid = _GET.carid;
			sess_flg = true;
		}

		if (undefined !== _GET.year == true && _GET.year != "") {
			this.H_Local.get.year = _GET.year;
			sess_flg = true;
		}

		if (undefined !== _GET.month == true && _GET.month != "") {
			this.H_Local.get.month = _GET.month;
			sess_flg = true;
		}

		if (undefined !== _GET.pactid == true && _GET.pactid != "") {
			this.H_Local.get.pactid = _GET.pactid;
			sess_flg = true;
		}

		if (sess_flg == true) {
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}
	}

	checkParamError(H_sess, H_g_sess) {
		if (H_sess.get.carid == "" || is_numeric(H_sess.get.carid) == false || H_sess.get.year == "" || is_numeric(H_sess.get.year) == false || H_sess.get.month == "" || is_numeric(H_sess.get.month) == false || H_sess.get.pactid == "" || is_numeric(H_sess.get.pactid) == false) {
			return true;
		}

		return false;
	}

	displaySmarty() //表示に必要な項目を設定
	//表示
	{
		this.get_Smarty().assign("status", this.H_View.status);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};