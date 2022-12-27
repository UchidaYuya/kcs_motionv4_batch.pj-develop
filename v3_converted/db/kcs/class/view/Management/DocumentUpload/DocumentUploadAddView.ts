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
class DocumentUploadAddView extends ViewSmarty {
	static PUB = "/Management";

	constructor() //define.iniを読み込む
	//$this->H_ini = parse_ini_file(KCS_DIR."/conf_sync/add_bill.ini", true);
	{
		super();
		this.NextName = "\u78BA\u8A8D\u753B\u9762\u3078";
		this.RecName = "\u767B\u9332\u3059\u308B";
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(DocumentUploadAddView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getLocalSession() {
		var H_sess = {
			[DocumentUploadAddView.PUB]: this.O_Sess.getPub(DocumentUploadAddView.PUB),
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

		if (_POST.length > 0) {
			this.H_Local.post = _POST;
			this.H_Local.post.comment = stripslashes(_POST.comment);
		}

		this.O_Sess.SetPub(DocumentUploadAddView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	getPankuzuLink() //return  MakePankuzuLink::makePankuzuLinkHTMLEng( $H_link,"user");
	{
		var H_link = {
			"/Management/DocumentUpload/menu.php": "\u6DFB\u4ED8\u8CC7\u6599\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u4E00\u89A7",
			"": "\u6DFB\u4ED8\u8CC7\u6599\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9"
		};
		return MakePankuzuLink.makePankuzuLinkHTML(H_link, "user");
	}

	uploadFile(pactid, userid) //ユニークファイル名を生成
	//ファイルは保持しないことになったのでtmpにおいてしまう
	//ファイル名の生成
	//ファイル情報の取得(元ファイル名など入ってる)
	//一意なファイル名を生成する
	//
	//リネームする
	//添付ファイルがある場合はファイルを/files以下に保存
	//セッション
	//$this->H_Dir["upload"] = $H_file_attr;
	//$this->O_Sess->setPub( self::PUB, $this->H_Dir );
	{
		var message = Array();

		if (_FILES.file.name == "") {
			return "";
		}

		if (_FILES.file.name != "" && preg_match("/\\.(csv|tsv)$/i", _FILES.file.name) == false) {
			message.push("\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u53EF\u80FD\u306A\u62E1\u5F35\u5B50\u306Fcsv\u3001tsv\u306E\u307F\u3067\u3059");
		}

		if (_FILES.file.size >= 1024 * 1024 * 3) {
			message.push("\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u53EF\u80FD\u306A\u30B5\u30A4\u30BA\u306F3Mbyte\u4EE5\u4E0B\u306B\u306A\u308A\u307E\u3059\u3002");
		}

		if (_FILES.file.size == 0) {
			message.push("\u30B5\u30A4\u30BA\u304C0\u306E\u30D5\u30A1\u30A4\u30EB\u306F\u30A2\u30C3\u30D7\u4E0D\u53EF\u3068\u306A\u308A\u307E\u3059\u3002");
		}

		if (!!message) {
			return message;
		}

		var upload_info = Array();
		mkdir(up_dir);
		var getfile = pathinfo(_FILES.file.name);
		var tmpf_name = tempnam(up_dir, "upload_" + userid + "_");
		var f_name = tmpf_name + "." + getfile.extension;
		rename(tmpf_name, f_name);

		if (move_uploaded_file(_FILES.file.tmp_name, f_name) == true) //添付のファイルサイズを取得
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
					up_file: f_name,
					up_type: up_type,
					up_filesize: up_filesize,
					up_name: _FILES.file.name,
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

	getDateFormat(empty_opt = false) {
		var temp = this.gSess().getSelf("postdata");

		if (true == is_null(temp.datefrom.Y)) {
			var date = date("Y");
		} else {
			if (+(temp.datefrom.Y > date("Y"))) {
				date = date("Y");
			} else {
				date = temp.datefrom.Y;
			}
		}

		var H_date = {
			minYear: date,
			maxYear: date("Y") + 1,
			format: "Y \u5E74 m \u6708 d \u65E5",
			language: "ja"
		};

		if (empty_opt === true) {
			H_date.addEmptyOption = true;
			H_date.emptyOptionValue = "";
			H_date.emptyOptionText = "--";
		}

		return H_date;
	}

	getFormElement() //日付入力フォーマット
	//フォーム要素の配列作成
	//ユニーク文字列生成用
	{
		var year = date("Y");
		var H_date = this.getDateFormat(year);
		var elem = Array();
		elem.push({
			name: "comment",
			label: "\u8AAC\u660E\u6587",
			inputtype: "textarea",
			options: {
				id: "memo",
				cols: "35",
				rows: "5"
			}
		});
		elem.push({
			name: "file",
			label: "\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB",
			inputtype: "file"
		});
		elem.push({
			name: "enddate",
			label: "\u63B2\u8F09\u671F\u9650",
			inputtype: "date",
			data: H_date
		});
		elem.push({
			name: "use_header",
			label: "\u30BF\u30A4\u30C8\u30EB\u884C\u306E\u6709\u7121",
			inputtype: "checkbox",
			options: {
				id: "use_header"
			}
		});
		elem.push({
			name: "cancel",
			label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
			inputtype: "button",
			options: {
				onClick: "javascript:ask_cancel()"
			}
		});
		elem.push({
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='?r=1'"
			}
		});
		elem.push({
			name: "back",
			label: "\u5165\u529B\u753B\u9762\u3078",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
			}
		});
		elem.push({
			name: "recogpostid",
			label: "",
			inputtype: "hidden"
		});
		elem.push({
			name: "recogpostname",
			label: "",
			inputtype: "hidden"
		});
		elem.push({
			name: "addsubmit",
			label: this.NextName,
			inputtype: "submit"
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
			mess: "\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "enddate",
			mess: "\u63B2\u8F09\u671F\u9650\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "enddate",
			mess: "\u63B2\u8F09\u671F\u9650\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRCheckdate",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "enddate",
			mess: "\u63B2\u8F09\u671F\u9650\u306F\u904E\u53BB\u306E\u65E5\u4ED8\u306F\u9078\u629E\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRManagementDateBefore",
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

		if (undefined !== default.enddate == false) {
			default.enddate = {
				Y: date("Y"),
				m: date("m"),
				d: date("d")
			};
		}

		return default;
	}

	makeForm() //フォームの取得
	//フォームオブジェクト生成
	//ルールの取得
	//ルールの設定
	//フォームに初期値設定。
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
		this.O_FormUtil.setDefaultsWrapper(default);
	}

	validate() {
		return this.O_FormUtil.validateWrapper();
	}

	freezeForm() {
		this.O_FormUtil.updateElementAttrWrapper("addsubmit", {
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
	}

	endAddView() //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u6DFB\u4ED8\u8CC7\u6599\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9", "/Management/DocumentUpload/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
	}

	displaySmarty(warning) //フォームの作成
	//ページングについて
	//assign
	//表示を返す・・・
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		this.get_Smarty().assign("upload", this.H_Local.upload);
		this.get_Smarty().assign("page_path", this.getPankuzuLink());
		this.get_Smarty().assign("warning", warning);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};