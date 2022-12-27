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
//H_ini
//add_bill.iniの中身
//@var mixed
//@access protected
//
//protected $H_ini;
//
//O_Form
//フォームオブジェクト
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
//makeOption
//オプションデータの作成
//@author web
//@since 2016/01/13
//
//@param mixed $options
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
class AddBillViewBase extends ViewSmarty {
	static PUB = "/Bill";

	constructor() //define.iniを読み込む
	//$this->H_ini = parse_ini_file(KCS_DIR."/conf_sync/add_bill.ini", true);
	{
		super();
		this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
		this.RecName = "\u767B\u9332\u3059\u308B";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillViewBase.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[AddBillViewBase.PUB]: this.O_Sess.getPub(AddBillViewBase.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() //-------------------------------------------------------------
	//大中小項目、商品コード、商品名が変更されたので項目をリセットする
	//-------------------------------------------------------------
	//セッションに記録する
	//GETパラメーターは削除する
	{
		var post = _POST;

		if (!!_POST.elem) {
			if (post.elem == "productcode") {
				post.productname = post.productcode;
			} else if (post.elem == "productname") {
				post.productcode = post.productname;
			} else //大中小分類が変更されたら
				{
					var column_list = ["class1", "class2", "class3", "cost", "price"];
					var reset_flag = false;

					for (var column of Object.values(column_list)) {
						if (reset_flag || undefined !== post[column]) {
							post[column] = "";
						}

						if (column == post.submit_elem) {
							reset_flag = true;
						}
					}
				}
		}

		this.H_Local.post = _POST;
		this.O_Sess.SetPub(AddBillViewBase.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (!!_GET) {
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}
	}

	makeOption(options, key_use = false) {
		var str = "<option value=\"\">--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--</option>";

		for (var key in options) {
			var value = options[key];

			if (key_use) {
				str += "<option value=\"" + key + "\">" + value + "</option>";
			} else {
				str += "<option value=\"" + value + "\">" + value + "</option>";
			}
		}

		return str;
	}

	__destruct() {
		super.__destruct();
	}

};