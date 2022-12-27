//
//エクセルダウンロードページView
//
//更新履歴：<br>
//2008/06/25 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/06/25
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//エクセルダウンロードページView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/06/25
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("view/MakePankuzuLink.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

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
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//年月がセッションが無ければ作る（デフォルトは前月）<br>
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//セッションのカレント部署とこのページのカレント部署が違っていたら同期してリロード
//
//@author houshiyama
//@since 2008/06/25
//
//@access private
//@return void
//
//
//CGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//ダウンロードが実行されたら配列に入れる<br>
//
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return mixed
//
//
//パラメータチェック <br>
//
//@author houshiyama
//@since 2008/06/25
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//配下のセッション消し
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//
//
//パンくずリンク作成
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//
//
//header部分のフォームを作成する<br>
//
//表示部署のタイプ配列を生成<br>
//管理情報共通フォーム用の配列を作成<br>
//管理情報共通フォーム用のオブジェクトを生成<br>
//
//@author houshiyama
//@since 2008/06/25
//
//@param $O_util（関数集オブジェクト）
//@access public
//@return void
//@uses QuickFormUtil
//
//
//フォームのエラーチェック作成
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//
//
//ダウンロードファイルのシリアル生成
//
//@author houshiyama
//@since 2008/06/25
//
//@access private
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//各データをSmartyにassign<br>
//jsもここでassignしています<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/06/25
//
//@param array $A_auth（権限一覧）
//@param array $H_data（表示データ）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/06/25
//
//@access public
//@return void
//
class ExcelDLMenuView extends ViewSmarty {
	static PUB = "/ExcelDL";

	constructor() {
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(ExcelDLMenuView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
	}

	setDefaultSession() //年月がセッションに無ければ作る
	{
		if (undefined !== this.H_Local.post.trgmonth == false) {
			this.H_Local.post.trgmonth = date("Ym", mktime(0, 0, 0, date("n"), 1, date("Y")));
		}

		if (undefined !== this.H_Dir.current_postid == false) {
			this.H_Dir.current_postid = _SESSION.current_postid;
		}

		if (_SESSION.current_postid != this.H_Dir.current_postid) {
			this.O_Sess.setGlobal("current_postid", this.H_Dir.current_postid);
			MtExceptReload.raise(undefined);
		}
	}

	checkCGIParam() //対象年月変更が実行された時
	{
		this.setDefaultSession();

		if (undefined !== _POST == true && _POST.length > 0) {
			_POST.recogpostid = "";
			_POST.recogpostname = "";
			this.H_Local.post = _POST;
		}

		this.O_Sess.setPub(ExcelDLMenuView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);
	}

	getLocalSession() {
		var H_sess = {
			[ExcelDLMenuView.PUB]: this.O_Sess.getPub(ExcelDLMenuView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		return H_sess;
	}

	get_View() {
		return this.H_View;
	}

	checkParamError(H_sess, H_g_sess) {}

	clearUnderSession() {
		this.clearLastForm();
		var A_exc = [ExcelDLMenuView.PUB, "/ExcelDL/menu.php"];
		this.O_Sess.clearSessionExcludeListPub(A_exc);
	}

	getHeaderJS() {
		var str = "<script language=\"Javascript\" src=\"/js/prototype.js\"></script>\n\n\t\t\t\t<script language=\"Javascript\" src=\"/js/ExcelDL/ExcelDLMenu.js\"></script>\n\n\t\t\t\t<script type=\"text/javascript\" src=\"/js/dataDownloadRunCheck.js\"></script>";
		return str;
	}

	makePankuzuLink() {
		var H_link = {
			"": "Excel\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
		};
		var str = MakePankuzuLink.makePankuzuLinkHTML(H_link);
		return str;
	}

	makeForm(O_util, O_model) //表示部署のタイプ配列を生成
	//年月配列取得
	//種別配列取得
	//フォーム要素の配列作成
	//クイックフォームオブジェクト生成
	{
		var H_posttarget = {
			"0": "\u914D\u4E0B\u5168\u3066\u306E\u90E8\u7F72",
			"2": "\u5BFE\u8C61\u90E8\u7F72\u306E\u307F"
		};
		var H_month = O_util.getMonthlyHash();
		var H_mtype = O_model.getMtypeKeyHash();
		var A_formelement = [{
			name: "trgmonth",
			label: "\u5BFE\u8C61\u5E74\u6708",
			inputtype: "select",
			options: {
				id: "trgmonth",
				onChange: "javascript:submit()"
			},
			data: H_month
		}, {
			name: "posttarget",
			label: "\u90E8\u7F72\u7D5E\u8FBC",
			inputtype: "select",
			options: {
				id: "posttarget"
			},
			data: H_posttarget
		}, {
			name: "freeword",
			label: "\u7BA1\u7406\u60C5\u5831\u5185\u691C\u7D22",
			inputtype: "text",
			options: {
				id: "freeword"
			}
		}, {
			name: "mtype",
			label: "\u7A2E\u5225",
			inputtype: "select",
			options: {
				id: "mtype"
			},
			data: H_mtype
		}, {
			name: "dlsubmit",
			label: "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",
			inputtype: "button",
			options: {
				onClick: "dataDownload(this); javascript:doPrintOpen( 'CreateDLFile.php?serial=" + this.getSerial() + "' );",
				class: "datadownloadDisabled"
			}
		}, {
			name: "back",
			label: "\u623B\u308B",
			inputtype: "button",
			options: {
				onClick: "javascript:location.href='/Menu/menu.php';"
			}
		}, {
			name: "recogpostid",
			label: "",
			inputtype: "hidden"
		}, {
			name: "recogpostname",
			label: "",
			inputtype: "hidden"
		}];
		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	makeRule() {
		var A_rule = [{
			name: "mtype",
			mess: "\u7A2E\u5225\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "recogpostid",
			mess: "\u90E8\u7F72\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
			type: "required",
			format: undefined,
			validation: "client"
		}];
		this.H_View.O_FormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.H_View.O_FormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.H_View.O_FormUtil.makeFormRule(A_rule);
	}

	getSerial() //pactid、時間をシリアルにする
	{
		return this.O_Sess.pactid + date("YmdHis");
	}

	displaySmarty(H_sess) //assaign
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("postname", H_sess.SELF.post.recogpostname);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};