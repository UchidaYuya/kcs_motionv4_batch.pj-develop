//error_reporting(E_ALL);
//TCPDFの読み込み
//require_once("MtSetting.php");
//
//ICCardPrintOutPersonalView
//交通費PDF出力
//@uses ViewSmarty
//@package
//@author date
//@since 2015/11/02
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("view/ViewFinish.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUtil.php");

require("MtUniqueString.php");

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
//__construct
//コンストラクタ
//@author web
//@since 2015/11/13
//
//@access public
//@return void
//
//
//getLocalSession
//ローカルセッションの取得
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
//
//checkCGIParam
//
//@author date
//@since 2015/11/13
//
//@access protected
//@return void
//
//
//startCheck
//ログインできていればOK
//@author web
//@since 2016/03/28
//
//@access public
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
class FindUserView extends ViewSmarty {
	static PUB = "/Const";

	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(FindUserView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[FindUserView.PUB]: this.O_Sess.getPub(FindUserView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() //セッションに記録する
	{
		this.H_Local.post = _POST;
		this.O_Sess.SetPub(FindUserView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	startCheck() //ブラウザの「キャッシュの有効期限が切れました」を出さない対処
	//header("Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0");
	//header("Expires: 0");
	//$this->checkAuth();
	//セッションを記録に残す
	{
		header("Cache-Control: private");
		this.checkLogin();
		this.checkCGIParam();
		this.writeActlog("", true, false);
	}

	__destruct() {
		super.__destruct();
	}

};