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
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class AddBillCostPriceView extends ViewSmarty {
	static PUB = "/Bill";

	constructor() {
		super();
		this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
		this.RecName = "\u767B\u9332\u3059\u308B";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillCostPriceView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[AddBillCostPriceView.PUB]: this.O_Sess.getPub(AddBillCostPriceView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() //セッションに記録する
	{
		this.H_Local.post = _POST;
		this.O_Sess.SetPub(AddBillCostPriceView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	__destruct() {
		super.__destruct();
	}

};