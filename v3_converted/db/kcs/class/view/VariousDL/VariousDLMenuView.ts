//
//ダウンロードパターン登録画面View
//
//更新履歴：<br>
//2009/02/17 宝子山浩平 作成
//
//@package VariousDL
//@subpackage View
//@author houshiyama
//@since 2009/02/17
//@filesource
//@uses ViewSmarty
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//@uses ViewFinish
//@uses MtOutput
//@uses MtSession
//@uses MtUtil
//@uses QuickFormUtil
//@uses ArraySmarty
//@uses VariousDLRule
//
//
//error_reporting(E_ALL);
//
//ダウンロードパターン登録画面View
//
//@package VariousDL
//@subpackage View
//@author houshiyama
//@since 2009/02/17
//@uses ViewSmarty
//@uses MtExceptReload
//@uses HTML_QuickForm_Renderer_ArraySmarty
//@uses ViewFinish
//@uses MtOutput
//@uses MtSession
//@uses QuickFormUtil
//@uses ArraySmarty
//@uses VariousDLRule
//
//
//

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("MtOutput.php");

require("MtSession.php");

require("MtUtil.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/Rule/VariousDLRule.php");

//
//ディレクトリ名
//
//
//管理種別ID
//
//
//モード
//
//交通費対応 20100527miya
//交通費対応 20100527miya
//
//メンバー変数
//
//@var mixed
//@access private
//
//MtSessionオブジェクト
//MtAuthorityオブジェクト
//権限一覧
//機能別セッション
//ローカルセッション
//MtSettingオブジェクト
//MtUtilオブジェクト
//表示用変数格納用
//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/03/17
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/03/11
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2009/02/17
//
//@access public
//@return void
//
//
//セッションが無い時デフォルト値を入れる
//
//
//@author houshiyama
//@since 2008/03/13
//
//@access private
//@return void
//
//
//前メーニュー共通のCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//submitが実行されたら配列に入れる<br>
//リセットが実行されたら配列を消してリロード<br>
//
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/03/13
//
//@access public
//@return void
//
//
//設定項目変更フォーム作成
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $O_model
//@param mixed $H_sess
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2009/02/24
//
//@param mixed $mode
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return void
//
//
//パラメータチェック <br>
//
//@author houshiyama
//@since 2008/03/18
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//フォームのルール作成
//
//@author houshiyama
//@since 2009/02/18
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//DBを使ったパラメータチェック <br>
//
//@author houshiyama
//@since 2009/02/19
//
//@param mixed $O_model
//@param mixed $H_post
//@access public
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//@author houshiyama
//@since 2008/03/03
//
//@param $H_sess
//@access public
//@return void
//
//
//ダウンロードphpへパラメータを送る
//
//@author houshiyama
//@since 2009/02/26
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class VariousDLMenuView extends ViewSmarty {
	static PUB = "/VariousDL";
	static TELMID = 1;
	static ETCMID = 2;
	static PURCHMID = 3;
	static COPYMID = 4;
	static ASSMID = 5;
	static ALLMODE = "all";
	static POSTMODE = "post";
	static TELMODE = "tel";
	static ETCMODE = "etc";
	static PURCHMODE = "purch";
	static COPYMODE = "copy";
	static ASSMODE = "assets";
	static POSTTELMODE = "posttel";
	static POSTETCMODE = "postetc";
	static POSTPURCHMODE = "postpurch";
	static POSTCOPYMODE = "postcopy";
	static POSTASSMODE = "postassets";
	static TELBILLMODE = "telbill";
	static ETCBILLMODE = "etcbill";
	static PURCHBILLMODE = "purchbill";
	static COPYBILLMODE = "copybill";
	static TELPOSTBILLMODE = "telpostbill";
	static ETCPOSTBILLMODE = "etcpostbill";
	static PURCHPOSTBILLMODE = "purchpostbill";
	static COPYPOSTBILLMODE = "copypostbill";
	static ICCARDPOSTBILLMODE = "iccardpostbill";
	static ICCARDUSERBILLMODE = "iccarduserbill";
	static TELALLMODE = "telall";
	static ETCALLMODE = "etcall";
	static PURCHALLMODE = "purchall";
	static COPYALLMODE = "copyall";

	constructor() {
		this.O_Sess = MtSession.singleton();
		var H_param = Array();
		H_param.language = this.O_Sess.language;
		super(H_param);
		this.H_Dir = this.O_Sess.getPub(VariousDLMenuView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();

		if (is_numeric(this.O_Sess.pactid) == true) {
			this.O_Auth = MtAuthority.singleton(this.O_Sess.pactid);
		} else {
			this.errorOut(10, "\u30BB\u30C3\u30B7\u30E7\u30F3\u306Bpactid\u304C\u7121\u3044", false);
		}

		this.A_Auth = this.O_Auth.getUserFuncIni(this.O_Sess.userid, false);
		this.O_Set = MtSetting.singleton();
		this.O_Util = new MtUtil();
		this.H_View = Array();
		this.Now = this.getDateUtil().getNow();
	}

	getLocalSession() {
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	get_View() {
		return this.H_View;
	}

	setDefaultSession() //メニューから来た時はゲットパラメータ補完
	{
		if (undefined !== this.H_Local.mode == false && preg_match("/\\/Menu\\/menu\\.php/", _SERVER.HTTP_REFERER) == true) {
			this.H_Local.mode = "all";
		}

		if (undefined !== this.H_Local.post.recogpostid == false) {
			this.H_Local.post.recogpostid = _SESSION.current_postid;
		}
	}

	checkCGIParam() //選択するパターンのモード
	//getパラメータは消す
	{
		this.setDefaultSession();

		if (undefined !== _GET.mode == true) //請求からきたら年月ずらし
			{
				this.H_Local.mode = _GET.mode;

				if (preg_match("/bill$/", _GET.mode) == true) {
					var yyyy = _GET.trg_month.substr(0, 4);

					var mm = _GET.trg_month.substr(4, 2);

					_GET.trg_month = date("Ym", mktime(0, 0, 0, mm - 1, 1, yyyy));
				}
			}

		if (undefined !== _GET.trg_month == true) //最新
			{
				this.H_Local.post.trg_month = _GET.trg_month;

				if (this.H_Local.post.trg_month == this.Now.replace(/-/g, "").substr(0, 6)) {
					this.H_Local.post.trg_month = "latest";
				}
			}

		if (undefined !== _GET.trg_postid == true) {
			this.H_Local.post.recogpostid = _GET.trg_postid;
		}

		if (undefined !== _POST == true && _POST.length > 0) {
			this.H_Local.post = _POST;
		}

		this.O_Sess.setPub(VariousDLMenuView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}

		switch (this.H_Local.mode) {
			case VariousDLMenuView.POSTMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Const/menu.php": "Department/user administration",
						"/Const/download.php": "Download",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Const/menu.php": "\u90E8\u7F72\u30FB\u30E6\u30FC\u30B6\u7BA1\u7406",
						"/Const/download.php": "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Const/download.php";
				this.H_View.css = "csConst";
				break;

			case VariousDLMenuView.TELMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Management/Tel/menu.php": "Admin information",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Management/Tel/menu.php": "\u7BA1\u7406\u60C5\u5831",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Management/Tel/menu.php";
				this.H_View.css = "csManageTel";
				break;

			case VariousDLMenuView.ETCMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Management/ETC/menu.php": "Admin information",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Management/ETC/menu.php": "\u7BA1\u7406\u60C5\u5831",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Management/ETC/menu.php";
				this.H_View.css = "csManageEtc";
				break;

			case VariousDLMenuView.PURCHMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Management/Purchase/menu.php": "Admin information",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Management/Purchase/menu.php": "\u7BA1\u7406\u60C5\u5831",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Management/Purchase/menu.php";
				this.H_View.css = "csManagePurch";
				break;

			case VariousDLMenuView.COPYMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Management/Copy/menu.php": "Admin information",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Management/Copy/menu.php": "\u7BA1\u7406\u60C5\u5831",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Management/Copy/menu.php";
				this.H_View.css = "csManageCopy";
				break;

			case VariousDLMenuView.ASSMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Management/Assets/menu.php": "Admin information",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Management/Assets/menu.php": "\u7BA1\u7406\u60C5\u5831",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Management/Assets/menu.php";
				this.H_View.css = "csManageAssets";
				break;

			case this.H_Local.mode == VariousDLMenuView.TELBILLMODE || this.H_Local.mode == VariousDLMenuView.TELPOSTBILLMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Bill/Tel/menu.php": "Billing information",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Bill/Tel/menu.php": "\u8ACB\u6C42\u60C5\u5831",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Bill/Tel/menu.php";
				this.H_View.css = "csManageTel";
				break;

			case this.H_Local.mode == VariousDLMenuView.ETCBILLMODE || this.H_Local.mode == VariousDLMenuView.ETCPOSTBILLMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Bill/Etc/menu.php": "Billing information",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Bill/Etc/menu.php": "\u8ACB\u6C42\u60C5\u5831",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Bill/Etc/menu.php";
				this.H_View.css = "csManageEtc";
				break;

			case this.H_Local.mode == VariousDLMenuView.PURCHBILLMODE || this.H_Local.mode == VariousDLMenuView.PURCHPOSTBILLMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Bill/Purchase/menu.php": "Billing information",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Bill/Purchase/menu.php": "\u8ACB\u6C42\u60C5\u5831",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Bill/Purchase/menu.php";
				this.H_View.css = "csManagePurch";
				break;

			case this.H_Local.mode == VariousDLMenuView.COPYBILLMODE || this.H_Local.mode == VariousDLMenuView.COPYPOSTBILLMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Bill/Copy/menu.php": "Billing information",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Bill/Copy/menu.php": "\u8ACB\u6C42\u60C5\u5831",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Bill/Copy/menu.php";
				this.H_View.css = "csManageCopy";
				break;

			case this.H_Local.mode == VariousDLMenuView.ICCARDPOSTBILLMODE || this.H_Local.mode == VariousDLMenuView.ICCARDUSERBILLMODE:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"/Bill/ICCard/menu.php": "Billing information",
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"/Bill/ICCard/menu.php": "\u8ACB\u6C42\u60C5\u5831",
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Bill/ICCard/menu.php";
				this.H_View.css = "csManageICCard";
				break;

			default:
				if (this.O_Sess.language == "ENG") {
					this.H_View.H_link = {
						"": "Pattern download"
					};
				} else {
					this.H_View.H_link = {
						"": "\u30D1\u30BF\u30FC\u30F3\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
					};
				}

				this.H_View.bkurl = "/Menu/menu.php";
				this.H_View.css = "csVariousDL";
				break;
		}
	}

	makePatternSelectForm(O_model, H_sess) //対象部署
	//表示言語分岐
	//パターン取得
	//表示言語分岐
	//クイックフォームオブジェクト生成
	{
		var H_trg_post = O_model.getPostTarget();

		if (this.O_Sess.language == "ENG") //対象年月
			{
				var H_trg_month = O_model.getMonthTargetEng();
			} else //対象年月
			{
				H_trg_month = O_model.getMonthTarget();
			}

		var H_pattern = O_model.getUsableDLPattern(H_sess.mode);

		if (this.O_Sess.language == "ENG") {
			var A_formelement = [{
				name: "trg_month",
				label: "Target month/year",
				inputtype: "select",
				data: H_trg_month,
				options: {
					id: "trg_month",
					onChange: "JavaScript:chgMonth();"
				}
			}, {
				name: "trg_type",
				label: "Range",
				inputtype: "select",
				data: H_trg_post,
				options: {
					id: "trg_post"
				}
			}, {
				name: "pattern",
				label: "Pattern selection",
				inputtype: "select",
				data: H_pattern,
				options: {
					id: "pattern"
				}
			}, {
				name: "download",
				label: "Download",
				inputtype: "submit"
			}, {
				name: "back",
				label: "Back",
				inputtype: "button",
				options: {
					onClick: "javascript:location.href='" + this.H_View.bkurl + "';"
				}
			}, {
				name: "recogpostid",
				label: "",
				inputtype: "hidden"
			}, {
				name: "recogpostname",
				label: "",
				inputtype: "hidden"
			}, {
				name: "flag",
				label: "",
				inputtype: "hidden"
			}];
		} else {
			A_formelement = [{
				name: "trg_month",
				label: "\u5BFE\u8C61\u5E74\u6708",
				inputtype: "select",
				data: H_trg_month,
				options: {
					id: "trg_month",
					onChange: "JavaScript:chgMonth();"
				}
			}, {
				name: "trg_type",
				label: "\u7BC4\u56F2",
				inputtype: "select",
				data: H_trg_post,
				options: {
					id: "trg_post"
				}
			}, {
				name: "pattern",
				label: "\u30D1\u30BF\u30FC\u30F3\u9078\u629E",
				inputtype: "select",
				data: H_pattern,
				options: {
					id: "pattern"
				}
			}, {
				name: "download",
				label: "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",
				inputtype: "submit"
			}, {
				name: "back",
				label: "\u623B\u308B",
				inputtype: "button",
				options: {
					onClick: "javascript:location.href='" + this.H_View.bkurl + "';"
				}
			}, {
				name: "recogpostid",
				label: "",
				inputtype: "hidden"
			}, {
				name: "recogpostname",
				label: "",
				inputtype: "hidden"
			}, {
				name: "flag",
				label: "",
				inputtype: "hidden"
			}];
		}

		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	makePankuzuLinkHash(mode) {
		return this.H_View.H_link;
	}

	getHeaderJS() {
		var str = "<script type=\"text/javascript\" language=\"JavaScript\" src=\"/js/VariousDL.js\"></script>";
		return str;
	}

	checkParamError(H_sess, H_g_sess) //モードが無ければエラー
	{
		if (undefined !== H_sess.mode == false) {
			this.errorOut(15, "\u5FC5\u9808GET\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u7121\u3044", false);
		}
	}

	makePatternSelectRule(O_model, H_sess) //部署名
	//ここで使用する自作関数の読込
	//表示言語分岐
	{
		if (H_sess.post.recogpostid != "") {
			var O_post = new MtPostUtil();
			H_sess.post.recogpostname = O_post.getPostTreeBand(this.O_Sess.pactid, this.O_Sess.postid, H_sess.post.recogpostid, O_model.H_Tb.tableno, " -> ", "", 1, true, false);
		}

		if (H_sess.post.recogpostname == false) {
			H_sess.post.recogpostid = "";
			H_sess.post.recogpostname = "";
			_POST.recogpostid = "";
			_POST.recogpostname = "";
		}

		if (this.O_Sess.language == "ENG") {
			var A_rule = [{
				name: "trg_month",
				mess: "Select a target other than the latest year and month for the pattern including billing",
				type: "QRCheckLatestAndType",
				format: undefined,
				validation: "client"
			}, {
				name: "recogpostid",
				mess: "Select department",
				type: "required",
				format: undefined,
				validation: "client"
			}, {
				name: "pattern",
				mess: "Select the pattern",
				type: "QRCheckPatternSelect",
				format: "-1",
				validation: "client"
			}];
		} else {
			A_rule = [{
				name: "trg_month",
				mess: "\u8ACB\u6C42\u3092\u542B\u3080\u30D1\u30BF\u30FC\u30F3\u306E\u6642\u306F\u5BFE\u8C61\u5E74\u6708\u306E\u6700\u65B0\u4EE5\u5916\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
				type: "QRCheckLatestAndType",
				format: undefined,
				validation: "client"
			}, {
				name: "recogpostid",
				mess: "\u90E8\u7F72\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
				type: "required",
				format: undefined,
				validation: "client"
			}, {
				name: "pattern",
				mess: "\u30D1\u30BF\u30FC\u30F3\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
				type: "QRCheckPatternSelect",
				format: "-1",
				validation: "client"
			}];
		}

		var A_orgrule = ["QRCheckLatestAndType", "QRCheckPatternSelect"];

		if (this.O_Sess.language == "ENG") {
			this.H_View.O_FormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_FormUtil.setDefaultWarningNote();
		}

		this.H_View.O_FormUtil.registerOriginalRules(A_orgrule);
		this.H_View.O_FormUtil.makeFormRule(A_rule);
	}

	checkInputError(O_model, H_post) {}

	displaySmarty(H_sess) //QuickFormとSmartyの合体
	//assign
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.get_Smarty().assign("H_post", H_sess.post);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("css", this.H_View.css);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("message", this.H_View.message);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	locationDownload(H_sess) {
		MtExceptReload.raise("./Download/VariousDownload.php");
	}

	__destruct() {
		super.__destruct();
	}

};