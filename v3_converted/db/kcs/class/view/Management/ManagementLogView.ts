//
//管理情報管理記録viewクラス
//
//更新履歴：<br>
//2008/03/30 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/30
//@filesource
//@uses ManagementViewBase
//@uses MtExceptReload
//@uses QuickFormUtil
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//error_reporting(E_ALL);
//
//管理情報一覧の基底クラス
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/30
//@uses ManagementViewBase
//@uses MtExceptReload
//@uses QuickFormUtil
//@uses HTML_QuickForm_Renderer_ArraySmarty
//

require("view/Management/ManagementViewBase.php");

//
//ヘッダーフォームオブジェクト
//
//@var mixed
//@access protected
//
//
//検索フォームオブジェクト
//
//@var mixed
//@access private
//
//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/03/30
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションが無い時デフォルト値を入れる
//
//年月セッションが無ければ作る（デフォルトは今月）<br>
//カレント部署がセッションが無ければ作る（デフォルトは自部署）<br>
//表示件数セッションが無ければ作る（デフォルトは10）<br>
//種別の絞込みのセッションが無ければ作る（デフォルトは全て）<br>
//ソート条件セッションが無ければ作る（デフォルトは部署降順）<br>
//カレントページがセッションに無ければ作る<br>
//
//@author houshiyama
//@since 2008/03/30
//
//@access private
//@return void
//
//
//パラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//表示年月の変更がされたら配列に入れる <br>
//表示件数が変更されたら配列に入れるCookieも書き換える） <br>
//ソート条件が変更されたら配列に入れる<br>
//種別の絞込みが実行されたら配列に入れる<br>
//カレントページが変更されたら配列に入れる<br>
//
//配列をセッションに入れる<br>
//ページが指定された時以外はページを１に戻す<br>
//CGIパラメータがあればリロード<br>
//
//@author houshiyama
//@since 2008/03/30
//
//@access public
//@return void
//@uses MtExceptReload
//
//
//フォーム作成<br>
//
//@author houshiyama
//@since 2008/03/30
//
//@param mixed $O_model
//@access public
//@return void
//
//
//パンくずリンクを作成し返す
//
//@author houshiyama
//@since 2008/03/30
//
//@param object $backurl
//@protected
//@access public
//@return void
//
//
//ダウンロードリンクを作成し返す
//
//@author houshiyama
//@since 2008/03/30
//
//@access protected
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/03/30
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
//フォームのデフォルト値を作成
//
//@author houshiyama
//@since 2008/03/30
//
//@param mixed $H_sess
//@access protected
//@return array
//
//検索フォームここから
//
//getSearchFormElement
//フォームエレメント
//@author date
//@since 2015/11/27
//
//@param mixed $pactid
//@access private
//@return void
//
//
//getFormRule
//ルールの取得を行う
//@author date
//@since 2015/11/27
//
//@access private
//@return void
//
//
//makeSearchForm
//
//@author web
//@since 2015/11/30
//
//@param mixed $pactid
//@access public
//@return void
//
//
//Smartyを用いた画面表示<br>
//
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/03/30
//
//@param array $H_sesstion（CGIパラメータ）
//@param array $A_data（一覧データ）
//@param array $A_auth（権限一覧）
//@param array $O_manage（関数集オブジェクト）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/30
//
//@access public
//@return void
//
class ManagementLogView extends ManagementViewBase {
	constructor() {
		super();
	}

	setDefaultSession() //年月セッションが無ければ作る
	{
		if (undefined !== this.H_Local.cym == false) {
			this.H_Local.cym = date("Ym");
		}

		if (undefined !== this.H_Dir.current_postid == false) {
			this.H_Dir.current_postid = _SESSION.postid;
		}

		if (undefined !== this.H_Local.limit == false) //クッキーに表示件数があればそれを使う
			{
				if (undefined !== _COOKIE.management_limit == true) {
					this.H_Local.limit = _COOKIE.management_limit;
				} else {
					this.H_Local.limit = 10;
				}
			}

		if (undefined !== this.H_Local.mid == false) {
			this.H_Local.mid = "0";
		}

		if (undefined !== this.H_Local.sort == false) {
			this.H_Local.sort = "5,d";
		}

		if (undefined !== this.H_Local.offset == false) {
			this.H_Local.offset = 1;
		}
	}

	checkCGIParam() //戻り先の設定
	//ページ変更以外はページを１に戻す
	{
		this.setDefaultSession();

		if (undefined !== _GET.from == true) {
			this.H_Local.from = _GET.from;
		}

		if (undefined !== _GET.ym == true && is_numeric(_GET.ym) == true) {
			this.H_Local.cym = _GET.ym;
		}

		if (undefined !== _POST.view == true) {
			if (is_numeric(_POST.limit) == true && _POST.limit > 0 && preg_match("/\\./", _POST.limit) == false) //クッキーセット
				{
					this.H_Local.limit = _POST.limit;
					setcookie("management_limit", _POST.limit, mktime(0, 0, 0, 12, 31, 2020));
				} else {
				this.H_Local.limit = 10;
				this.O_Sess.setSelfAll(this.H_Local);
				MtExceptReload.raise(undefined);
			}
		}

		if (undefined !== _GET.s == true) {
			this.H_Local.sort = _GET.s;
		}

		if (undefined !== _POST.mid == true) {
			this.H_Local.mid = _POST.mid;
		}

		if (undefined !== _GET.p == true) {
			this.H_Local.offset = _GET.p;
		}

		if (undefined !== _POST.search) {
			this.H_Local.search = _POST;
		}

		if (!(undefined !== this.H_Local.search)) {
			this.H_Local.search = Array();

			if (undefined !== this.H_Local.search.search_condition == false) {
				this.H_Local.search.search_condition = "AND";
			}

			if (undefined !== this.H_Local.search.post_condition == false) {
				this.H_Local.search.post_condition = "not";
			}
		}

		if (!!_GET.pid) {
			this.H_Local.pid = _GET.pid;
			this.H_Local.search.post_condition = "multi";
			this.H_Local.search.search = "\u691C\u7D22";
		}

		if (!this.H_Local.pid) {
			this.H_Local.pid = _SESSION.postid;
		}

		this.H_Local.search.pid = this.H_Local.pid;

		if ((_POST.length > 0 || _GET.length > 0) && undefined !== _GET.p == false) {
			this.H_Local.offset = 1;
		}

		this.O_Sess.setPub(ManagementLogView.PUB, this.H_Dir);
		this.O_Sess.setSelfAll(this.H_Local);

		if (_POST.length > 0 || _GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	makeForm(O_model) //フォーム要素の配列作成
	//表示言語分岐
	//クイックフォームオブジェクト生成
	{
		if (this.O_Sess.language == "ENG") {
			var H_mid = {
				"0": "All"
			};
			H_mid = H_mid + O_model.getUsableManagementTypeEng();
			var A_formelement = [{
				name: "mid",
				label: "Admin type",
				inputtype: "select",
				data: H_mid,
				options: {
					onChange: "document.form.submit();"
				}
			}, {
				name: "limit",
				label: "\u2605\u8868\u793A\u4EF6\u6570",
				inputtype: "text",
				options: {
					size: "3",
					maxlength: "3"
				}
			}, {
				name: "view",
				label: "Display",
				inputtype: "submit"
			}];
		} else {
			H_mid = {
				"0": "\u5168\u3066"
			};
			H_mid = H_mid + O_model.getUsableManagementType();
			A_formelement = [{
				name: "mid",
				label: "\u7BA1\u7406\u7A2E\u5225",
				inputtype: "select",
				data: H_mid,
				options: {
					onChange: "document.form.submit();"
				}
			}, {
				name: "limit",
				label: "\u8868\u793A\u4EF6\u6570",
				inputtype: "text",
				options: {
					size: "3",
					maxlength: "3"
				}
			}, {
				name: "view",
				label: "\u8868\u793A",
				inputtype: "submit"
			}];
		}

		this.H_View.O_FormUtil = new QuickFormUtil("form");
		this.H_View.O_FormUtil.setFormElement(A_formelement);
		this.O_Form = this.H_View.O_FormUtil.makeFormObject();
	}

	makePankuzuLinkHash(backurl) {
		if (this.O_Sess.language == "ENG") {
			var H_link = {
				[backurl]: "Admin informations",
				"": "Admin log"
			};
		} else {
			H_link = {
				[backurl]: "\u7BA1\u7406\u60C5\u5831",
				"": "\u7BA1\u7406\u8A18\u9332"
			};
		}

		return H_link;
	}

	getDownloadLink() {}

	getHeaderJS() {}

	checkParamError(H_sess, H_g_sess) //管理情報基底のパラメータチェック
	{
		this.checkBaseParamError(H_sess, H_g_sess);
	}

	makeDefaultValue(H_sess: {} | any[]) {
		var H_default = Array();
		H_default.mid = H_sess.SELF.mid;
		H_default.limit = H_sess.SELF.limit;
		return H_default;
	}

	getSearchFormElement(pactid) //"options" => array( "onClick" => "javascript:location.href='?r=1'" ) );
	{
		var elem = Array();
		elem.push({
			name: "comment_sel",
			label: "\u4F5C\u696D\u5185\u5BB9",
			inputtype: "select",
			data: {
				"": "--",
				"\u65B0\u898F\u767B\u9332": "\u65B0\u898F\u767B\u9332",
				"\u4E88\u7D04": "\u4E88\u7D04",
				"\u5909\u66F4": "\u5909\u66F4",
				"\u79FB\u52D5": "\u79FB\u52D5",
				"\u524A\u9664": "\u524A\u9664",
				"\u4E88\u7D04": "\u4E88\u7D04"
			}
		});
		elem.push({
			name: "comment",
			label: "\u4F5C\u696D\u5185\u5BB9",
			inputtype: "text",
			options: {
				style: "width:50%;"
			}
		});
		elem.push({
			name: "manageno",
			label: "\u7BA1\u7406\u756A\u53F7",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		elem.push({
			name: "username",
			label: "\u4F5C\u696D\u8005",
			inputtype: "text",
			options: {
				style: "width:86%;"
			}
		});
		var year = date("Y");
		elem.push({
			name: "recdate_to",
			label: "\u4F5C\u696D\u65E5\u6642&nbsp;to",
			inputtype: "date",
			data: {
				minYear: year - 1,
				maxYear: year,
				maxHour: 23,
				format: "Y \u5E74 m \u6708 d \u65E5 H \u6642 i \u5206",
				language: "ja",
				addEmptyOption: true,
				emptyOptionValue: "",
				emptyOptionText: "--"
			}
		});
		elem.push({
			name: "recdate_from",
			label: "\u4F5C\u696D\u65E5\u6642&nbsp;from",
			inputtype: "date",
			data: {
				minYear: year - 1,
				maxYear: year,
				maxHour: 23,
				format: "Y \u5E74 m \u6708 d \u65E5 H \u6642 i \u5206",
				language: "ja",
				addEmptyOption: true,
				emptyOptionValue: "",
				emptyOptionText: "--"
			}
		});
		elem.push({
			name: "search",
			label: "\u691C\u7D22",
			value: "\u691C\u7D22",
			inputtype: "submit"
		});
		elem.push({
			name: "reset",
			label: "\u30EA\u30BB\u30C3\u30C8",
			inputtype: "button",
			options: {
				onClick: "resetSearch();"
			}
		});
		elem.push({
			name: "search_condition",
			label: "\u691C\u7D22\u6761\u4EF6",
			inputtype: "radio",
			data: {
				AND: ["AND"],
				OR: ["OR"]
			}
		});
		elem.push({
			name: "post_condition",
			label: "\u90E8\u7F72\u691C\u7D22\u6761\u4EF6",
			inputtype: "radio",
			data: {
				not: ["\u90E8\u7F72\u691C\u7D22\u3057\u306A\u3044", "\"onClick=setSearchPostVisible(false)"],
				multi: ["\u90E8\u7F72\u6307\u5B9A\u3092\u884C\u3046", "\"onClick=setSearchPostVisible(true)"]
			}
		});
		elem.push({
			name: "csrfid",
			inputtype: "hidden"
		});
		return elem;
	}

	getSearchFormRule() {
		var A_rule = Array();
		A_rule.push({
			name: "recdate_from",
			mess: "\u4F5C\u696D\u65E5\u6642from\u306F\u5E74\u6708\u65E5\u6642\u5206\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRManagementLogSearchCheckDate",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "recdate_to",
			mess: "\u4F5C\u696D\u65E5\u6642to\u306F\u5E74\u6708\u65E5\u6642\u5206\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRManagementLogSearchCheckDate",
			format: undefined,
			validation: "client"
		});
		return A_rule;
	}

	makeSearchForm(pactid) //フォームの取得
	//フォームオブジェクト生成
	//ルールの取得
	//ルールの設定
	//フォームに初期値設定。
	//登録するぽよ
	//smartyに設定
	//validatorの値を返す
	//return $util->validateWrapper();
	{
		var elem = this.getSearchFormElement(pactid);
		var util = new QuickFormUtil("searchform");
		util.setFormElement(elem);
		var form = util.makeFormObject();
		var A_rule = this.getSearchFormRule();
		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex"];
		util.registerOriginalRules(A_orgrule);
		util.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		util.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		util.makeFormRule(A_rule);
		util.setDefaultsWrapper(this.H_Local.search);
		var render = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		form.accept(render);
		this.get_Smarty().assign("O_searchform", render.toArray());
	}

	displaySmarty(H_sess: {} | any[], A_data: {} | any[], A_auth: {} | any[], O_manage: ManagementUtil, H_tree, tree_js) //assaign
	//検索フォームの表示について
	//検索フォームの表示について
	//部署ツリー
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_Form.accept(O_renderer);
		this.makeSearchForm(this.O_Sess.pactid);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("H_sess", H_sess);
		this.get_Smarty().assign("monthly_bar", this.H_View.monthly_bar);
		this.get_Smarty().assign("page_link", this.H_View.page_link);
		this.get_Smarty().assign("list_cnt", A_data[0]);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("H_list", A_data[1]);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("css", this.getManagementCss(H_sess.SELF.mid));

		if (undefined !== this.H_Local.search.search) {
			this.get_Smarty().assign("showform", "block");
		} else {
			this.get_Smarty().assign("showform", "none");
		}

		if (this.H_Local.search.post_condition == "not") {
			this.get_Smarty().assign("post_condition_show", "none");
		} else {
			this.get_Smarty().assign("post_condition_show", "block");
		}

		this.get_Smarty().assign("H_tree", H_tree);
		this.get_Smarty().assign("tree_js", tree_js);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	__destruct() {
		super.__destruct();
	}

};