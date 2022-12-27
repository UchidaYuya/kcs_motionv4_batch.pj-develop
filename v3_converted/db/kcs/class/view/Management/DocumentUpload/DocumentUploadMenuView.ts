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
class DocumentUploadMenuView extends ViewSmarty {
	static PUB = "/Management";

	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(DocumentUploadMenuView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[DocumentUploadMenuView.PUB]: this.O_Sess.getPub(DocumentUploadMenuView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() {
		if (!_POST) {
			this.clearLastForm();
		}

		if (undefined !== this.H_Local.limit == false) //クッキーに表示件数があればそれを使う
			{
				if (undefined !== _COOKIE.management_limit == true) {
					this.H_Local.limit = _COOKIE.management_limit;
				} else {
					this.H_Local.limit = 10;
				}
			}

		if (undefined !== _POST.limit) //0以上の時のみ代入する
			{
				if (_POST.limit > 0) {
					this.H_Local.limit = _POST.limit;
				}
			}

		if (undefined !== this.H_Local.sort == false) {
			this.H_Local.sort = "0,a";
		}

		if (undefined !== this.H_Local.offset == false) {
			this.H_Local.offset = 1;
		}

		if (!!_GET.p) {
			this.H_Local.offset = _GET.p;
			this.O_Sess.SetSelfAll(this.H_Local);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (!!_GET.s) {
			this.H_Local.sort = _GET.s;
			this.O_Sess.SetSelfAll(this.H_Local);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		this.O_Sess.SetPub(DocumentUploadMenuView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	getPankuzuLink() {
		var H_link = {
			"": "\u6DFB\u4ED8\u8CC7\u6599\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u4E00\u89A7"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	getFormElement() //フォーム要素の配列作成
	//$elem[] = array("name" => "viewchange",
	//						"label" => "変更",
	//						"inputtype" => "submit");
	//		$elem[] = array("name" => "freesearch",
	//						"label" => "検索",
	//						"inputtype" => "submit");
	//		
	//		$elem[] = array("name" => "freereset",
	//						"label" => "リセット",
	//						"inputtype" => "submit");
	{
		var elem = Array();
		elem.push({
			name: "add",
			label: "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='DocumentUploadAdd.php';",
				style: "height:22;width:90;"
			}
		});
		elem.push({
			name: "limit",
			label: "\u8868\u793A\u4EF6\u6570",
			inputtype: "text",
			options: {
				size: "3",
				maxlength: "3"
			}
		});
		elem.push({
			name: "view",
			label: "\u8868\u793A",
			inputtype: "submit"
		});
		elem.push({
			name: "delete",
			label: "\u524A\u9664\u3059\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:gotoDeletePage();"
			}
		});
		elem.push({
			name: "back",
			label: "\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='/Menu/menu.php';"
			}
		});
		return elem;
	}

	getFormDefault() {
		var default = Array();
		default.limit = this.H_Local.limit;
		return default;
	}

	makeForm() //フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	//フォームに初期値設定。
	//$util->setDefaultsWrapper( $default );
	//検索結果で0を指定された時に反映しないようにするためにこうした
	//登録するぽよ
	//smartyに設定
	{
		var element = this.getFormElement();
		var util = new QuickFormUtil("addform");
		util.setFormElement(element);
		var form = util.makeFormObject();
		var default = this.getFormDefault();
		form.setConstants(default);
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		form.accept(render);
		this.get_Smarty().assign("O_form", render.toArray());
	}

	displaySmarty(H_list, list_cnt) //$this->get_Smarty()->assign( "printdate",$printdate);
	//templateの取得
	//123456789のやつ
	//Formの登録
	//表示を返す・・・
	{
		var O_setting = this.getSetting();
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		this.get_Smarty().assign("H_list", H_list);
		this.get_Smarty().assign("list_cnt", list_cnt);
		var page_link = MakePageLink.makePageLinkHTML(list_cnt, this.H_Local.limit, this.H_Local.offset);
		this.get_Smarty().assign("page_link", page_link);
		this.makeForm();
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};