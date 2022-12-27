//error_reporting(E_ALL);
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

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUtil.php");

require("view/ViewFinish.php");

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
//@author web
//@since 2015/11/13
//
//@access protected
//@return void
//
//
//makePankuzuLinkHash
//パンくずリスト
//@author date
//@since 2015/11/12
//
//@access public
//@return void
//
//
//getFormElement
//一覧表示のForm
//@author 伊達
//@since 2015/12/01
//
//@access private
//@return void
//
//
//getFormDefault
//Formの初期値の設定
//@author web
//@since 2015/12/01
//
//@access private
//@return void
//
//
//makeAddForm
//新規登録ボタンの作成
//@author web
//@since 2015/11/16
//
//@param ManagementUtil $O_manage
//@access public
//@return void
//
//
//endDelView
//完了画面
//@author date
//@since 2015/11/27
//
//@param array $H_sess
//@access public
//@return void
//
//
//displaySmarty
//displaySmarty
//@author date
//@since 2015/11/02
//
//@param array $H_sess
//@param array $A_data
//@param array $A_auth
//@param ManagementUtil $O_manage
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
class AddBillConfirmView extends ViewSmarty {
	static PUB = "/Bill";

	constructor() //ini読み込む
	//$this->H_ini = parse_ini_file(KCS_DIR."/conf_sync/add_bill.ini", true);
	{
		super();
		this.ConfirmName = "\u78BA\u5B9A\u3059\u308B";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillConfirmView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() //呼び出し元のセッションを取得する
	//現在のLocalと呼び出し元のローカルを足す
	{
		var H_sess = {
			[AddBillConfirmView.PUB]: this.O_Sess.getPub(AddBillConfirmView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		var key = dirname(_SERVER.PHP_SELF) + "/menu.php";
		var par_sess = this.O_Sess.getPub(key);
		H_sess.SELF += par_sess;
		return H_sess;
	}

	checkCGIParam() //削除対象のidを取得する
	//削除対象のIDがあるなら代入する
	//戻り先URIを取得する
	//セッションに記録する
	{
		var cfmid = Array();

		for (var key in _POST) {
			var value = _POST[key];

			if (strpos(key, "id") !== false && key != "csrfid") {
				cfmid.push(value);
			}
		}

		if (!!cfmid) {
			this.H_Local.cfmid = cfmid;
		}

		this.H_Local.post = _POST;
		var key = dirname(_SERVER.PHP_SELF) + "/menu.php";
		var menu_sess = this.O_Sess.getPub(key);
		this.H_Local.menu_uri = menu_sess.menu_uri;
		this.O_Sess.SetPub(AddBillConfirmView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	getPankuzuLink() {
		var H_link = {
			[this.H_Local.menu_uri]: "\u53D7\u6CE8\u5185\u5BB9\u4E00\u89A7",
			"": "\u78BA\u5B9A"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	getFormElement() //フォーム要素の配列作成
	{
		var elem = Array();
		elem.push({
			name: "csrfid",
			inputtype: "hidden"
		});
		elem.push({
			name: "submit",
			label: this.ConfirmName,
			inputtype: "submit"
		});
		elem.push({
			name: "back",
			label: "\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='menu.php';"
			}
		});
		return elem;
	}

	getFormDefault() //postの値があるならそれを初期値にしよう
	{
		var default = Array();

		if (!!this.H_Local.post) {
			default = this.H_Local.post;
		}

		if (undefined !== default.csrfid == false) {
			var O_unique = MtUniqueString.singleton();
			default.csrfid = O_unique.getNewUniqueId();
		}

		return default;
	}

	makeForm() //フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//フォームに初期値設定。
	//登録するぽよ
	//smartyに設定
	{
		var element = this.getFormElement();
		var util = new QuickFormUtil("addform");
		util.setFormElement(element);
		var form = util.makeFormObject();
		var default = this.getFormDefault();
		util.setDefaultsWrapper(default);
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		form.accept(render);
		this.get_Smarty().assign("O_form", render.toArray());
		return util.validateWrapper();
	}

	endDelView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		var menu_uri = this.H_Local.menu_uri;
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u53D7\u6CE8\u5185\u5BB9\u306E\u78BA\u5B9A", menu_uri, "\u53D7\u6CE8\u5185\u5BB9\u4E00\u89A7\u753B\u9762\u3078");
	}

	displaySmarty(H_list) //templateの取得
	//表示を返す・・・
	//$this->get_Smarty()->display($this->getDefaultTemplate());
	{
		var O_setting = this.getSetting();
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		this.get_Smarty().assign("H_list", H_list);
		this.get_Smarty().display(KCS_DIR + "/template/Bill/AddBill/AddBillConfirm.tpl");
	}

	__destruct() {
		super.__destruct();
	}

};