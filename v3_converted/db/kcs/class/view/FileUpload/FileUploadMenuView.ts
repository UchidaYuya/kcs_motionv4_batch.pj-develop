//error_reporting(E_ALL);
//require_once("MtSetting.php");
//
//DocumentUploadAddView
//
//@uses ViewSmarty
//@package
//@author web
//@since 2016/02/16
//

require("view/ViewSmarty.php");

require("view/QuickFormUtil.php");

require("view/ViewFinish.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("MtUtil.php");

require("MtUniqueString.php");

require("view/Rule/ManagementRule.php");

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
//makePankuzuLinkHash
//パンくずリスト
//@author date
//@since 2015/11/12
//
//@access public
//@return void
//
//
//checkFilename
//ファイル名の確認
//@author web
//@since 2018/04/10
//
//@param mixed $filename
//@access private
//@return void
//
//
//運送ID新規登録、変更フォーム要素作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $O_manage
//@param mixed $O_model
//@access protected
//@return void
//
//
//運送ID新規登録フォームのエラーチェック作成
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
//
//getFormDefault
//formの初期値の設定
//@author date
//@since 2015/11/27
//
//@param mixed $H_post
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
//validate
//フォームの値チェック
//@author web
//@since 2015/11/27
//
//@access public
//@return void
//
//
//freezeForm
//freece処理を行う
//@author date
//@since 2015/11/27
//
//@access public
//@return void
//
//
//unfreezeForm
//
//@author date
//@since 2015/11/27
//
//@access public
//@return void
//
//
//endAddView
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
class FileUploadMenuView extends ViewSmarty {
	static PUB = "/FileUpload";

	constructor() //define.iniを読み込む
	//$this->H_ini = parse_ini_file(KCS_DIR."/conf_sync/add_bill.ini", true);
	{
		super();
		this.NextName = "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9";
		this.RecName = "\u767B\u9332\u3059\u308B";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(FileUploadMenuView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[FileUploadMenuView.PUB]: this.O_Sess.getPub(FileUploadMenuView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	checkCGIParam() {
		if (!_POST) //セッションクリア
			{
				this.O_Sess.clearSessionSelf();
			}

		if (_GET.r != "") {
			delete this.H_Local.post;
			this.O_Sess.SetSelfAll(this.H_Local);
			header("Location: " + _SERVER.PHP_SELF);
			throw die();
		}

		if (undefined !== _GET.p) {
			if (is_numeric(_GET.p) && _GET.p > 0) {
				this.H_Local.page = _GET.p;
			}

			header("Location: " + _SERVER.PHP_SELF);
		}

		if (_POST.length > 0) {
			if (undefined !== _POST.limit) {
				if (is_numeric(_POST.limit) && _POST.limit > 0) {
					this.H_Local.limit = _POST.limit;
					this.H_Local.page = 1;
				}
			} else {
				this.H_Local.post = _POST;
			}
		}

		if (!(undefined !== this.H_Local.page)) {
			this.H_Local.page = 1;
		}

		if (!(undefined !== this.H_Local.limit)) {
			this.H_Local.limit = 50;
		}

		this.O_Sess.SetPub(FileUploadMenuView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	getPankuzuLink() //return  MakePankuzuLink::makePankuzuLinkHTMLEng( $H_link,"user");
	{
		var H_link = {
			"": "\u30D5\u30A1\u30A4\u30EB\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9/\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	checkFilename(filename) {
		if (preg_match("/^RMI.*.csv$/", _FILES.file.name)) return true;
		if (preg_match("/^BL.*.csv$/", _FILES.file.name)) return true;
		return false;
	}

	uploadFile(pactid, userid, username) //ここがアップ先
	//アップ先なければ作る
	//セッション
	{
		var message = Array();

		if (_FILES.file.name == "") {
			return "";
		}

		if (_FILES.file.size >= 1024 * 1024 * 10) {
			message.push(_FILES.file.name + "\u306F\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u4E0A\u9650\u3092\u8D85\u3048\u3066\u3044\u307E\u3059");
		}

		if (_FILES.file.size == 0) {
			message.push("\u30B5\u30A4\u30BA\u304C0\u306E\u30D5\u30A1\u30A4\u30EB\u306F\u30A2\u30C3\u30D7\u4E0D\u53EF\u3068\u306A\u308A\u307E\u3059\u3002");
		}

		if (!!message) {
			return message;
		}

		var upload_info = Array();
		var updir = "/kcs/files/FileUpload/" + pactid;

		if (!file_exists(updir)) {
			mkdir(updir, 770, true);
		}

		var uid = uniqid();
		var cnt = 0;
		var filename = updir + "/" + uid;

		while (file_exists(filename)) {
			filename = updir + "/" + uid + cnt;
			cnt++;
		}

		if (move_uploaded_file(_FILES.file.tmp_name, filename) == true) //添付のファイルサイズを取得
			{
				var up_filesize = _FILES.file.size;

				if (up_filesize > 1024) {
					if (up_filesize > 1024 * 1024) {
						up_filesize = sprintf("%0.1f", up_filesize / (1024 * 1024)) + " Mbyte";
					} else {
						up_filesize = sprintf("%0.1f", up_filesize / 1024) + " Kbyte";
					}
				}

				var H_file_attr = {
					up_filesize: up_filesize,
					dataname: uid,
					filename: _FILES.file.name,
					filestat: _FILES.file.error
				};
			} else //失敗した
			{
				H_file_attr = {
					filestat: _FILES.file.error
				};
			}

		this.H_Local.upload = H_file_attr;
		this.O_Sess.setSelfAll(this.H_Local);
		return message;
	}

	getFormElement() //日付入力フォーマット
	//フォーム要素の配列作成
	//$elem[] = array(	"name" => "cancel",
	//							"label" => "キャンセル",
	//							"inputtype" => "button",
	//							"options" => array( "onClick" => "javascript:ask_cancel()" ) 
	//						);
	//		$elem[] = array(	"name" => "reset",
	//							"label" => "リセット",
	//							"inputtype" => "button",
	//							"options" => array( "onClick" => "javascript:location.href='?r=1'" )
	//						 );
	//		$elem[] = array( 	"name" => "back",
	//							"label" => "入力画面へ",
	//							"inputtype" => "button",
	//							"options" => array( "onClick" => "javascript:location.href='" . $_SERVER["PHP_SELF"] . "';" ) 
	//						);
	//ユニーク文字列生成用
	{
		var elem = Array();
		elem.push({
			name: "file",
			label: "\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB",
			inputtype: "file",
			options: {
				id: "file"
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
			name: "limitbutton",
			label: "\u8868\u793A",
			inputtype: "submit"
		});
		elem.push({
			name: "addsubmit",
			inputtype: "hidden"
		});
		elem.push({
			name: "submit",
			label: this.NextName,
			inputtype: "submit",
			options: {
				id: "submit"
			}
		});
		elem.push({
			name: "flag",
			label: "",
			inputtype: "hidden"
		});
		var O_unique = MtUniqueString.singleton();

		if (!(undefined !== this.H_Local.post.uniqueid)) {
			elem.push({
				name: "uniqueid",
				inputtype: "hidden",
				data: O_unique.getNewUniqueId(),
				options: {
					id: "uniqueid"
				}
			});
		} else {
			elem.push({
				name: "uniqueid",
				inputtype: "hidden",
				data: this.H_Local.post.uniqueid,
				options: {
					id: "uniqueid"
				}
			});
		}

		return elem;
	}

	getFormRule() //基底クラスから新規登録フォームルール取得
	{
		var A_rule = Array();
		A_rule.push({
			name: "file",
			mess: "\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		});
		return A_rule;
	}

	getFormDefault(H_post) //postの値がないなら初期値を設定しよう
	//postの値があるならそれを初期値にしよう
	{
		var default = Array();

		if (!!H_post) {
			default = H_post;
		}

		default.limit = this.H_Local.limit;
		return default;
	}

	makeForm() //フォームの取得
	//フォームオブジェクト生成
	//ルールの取得
	//ルールの設定
	//フォームに初期値設定。
	//マスタ適用時に値が反映されないのでこちらを使う
	//$this->O_FormUtil->setDefaultsWrapper( $default );
	{
		var elem = this.getFormElement();
		this.O_FormUtil = new QuickFormUtil("form");
		this.O_FormUtil.setFormElement(elem);
		this.O_Form = this.O_FormUtil.makeFormObject();
		var A_rule = this.getFormRule();
		var A_orgrule = ["QRCheckDate"];
		this.O_FormUtil.registerOriginalRules(A_orgrule);
		this.O_FormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.O_FormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.O_FormUtil.makeFormRule(A_rule);
		var default = this.getFormDefault(this.H_Local.post);
		this.O_Form.setConstants(default);
	}

	validate() {
		return this.O_FormUtil.validateWrapper();
	}

	freezeForm() {
		this.O_FormUtil.updateElementAttrWrapper("addsubmit", {
			value: this.RecName
		});
		this.O_FormUtil.updateElementAttrWrapper("submit", {
			value: this.RecName
		});
		this.O_FormUtil.updateAttributesWrapper({
			onsubmit: false
		});
		this.O_FormUtil.freezeWrapper();
	}

	unfreezeForm() {
		this.O_FormUtil.updateElementAttrWrapper("addsubmit", {
			value: this.NextName
		});
		this.O_FormUtil.updateElementAttrWrapper("submit", {
			value: this.NextName
		});
	}

	endAddView(message) //セッションクリア
	//2重登録防止メソッド
	//また後で復活するかも
	//$this->writeLastForm();
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		var O_finish = new ViewFinish();
		O_finish.displayFinish(message, "/FileUpload/menu.php", "\u4E00\u89A7\u3078\u623B\u308B");
	}

	displaySmarty(page, file_list, file_list_cnt) //フォームの作成
	//ページングについて
	//assign
	//$this->get_Smarty()->assign( "warning",$warning );
	//表示を返す・・・
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		this.get_Smarty().assign("upload", this.H_Local.upload);
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		this.get_Smarty().assign("H_list", file_list);
		var page_link = MakePageLink.makePageLinkHTML(file_list_cnt, this.H_Local.limit, page);
		this.get_Smarty().assign("page_link", page_link);
		this.get_Smarty().assign("limit", this.H_Local.limit);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};