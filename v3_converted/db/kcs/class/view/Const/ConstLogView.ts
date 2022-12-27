//
//ConstLogView{
//部署ユーザー管理のVIEW
//@package
//@author date
//@since 2016/03/23
//

require("HTML/QuickForm.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/QuickFormUtil.php");

//
//__construct
//
//@author date
//@since 2016/03/23
//
//@access public
//@return void
//
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
class ConstLogView {
	constructor() //検索のPOSTを格納する
	{
		this.O_form = undefined;
		this.H_Local = Array();
		var uri = "/Const/constlog.php";
		var local = _SESSION[uri + ",post"];

		if (undefined !== _POST.search) {
			local.search = _POST;
		}

		if (!(undefined !== local.search)) {
			local.search = Array();

			if (undefined !== local.search.search_condition == false) {
				local.search.search_condition = "AND";
			}

			if (undefined !== local.search.post_condition == false) {
				local.search.post_condition = "not";
			}
		}

		if (!(undefined !== local.search.pid)) {
			local.search.pid = _SESSION.postid;
		}

		if (!!_GET.pid) {
			local.search.pid = _GET.pid;
			local.search.post_condition = "multi";
			local.search.search = "\u691C\u7D22";
		}

		_SESSION[uri + ",post"] = local;
		this.H_Local = local;
	}

	getLocalSession() {
		return this.H_Local;
	}

	getSearchFormElement() //"options" => array( "onClick" => "javascript:location.href='?r=1'" ) );
	{
		var elem = Array();
		elem.push({
			name: "comment_sel",
			label: "\u4F5C\u696D\u5185\u5BB9",
			inputtype: "select",
			data: {
				"": "--",
				"\u65B0\u898F\u8FFD\u52A0": "\u65B0\u898F\u8FFD\u52A0",
				"\u5185\u5BB9\u5909\u66F4": "\u5185\u5BB9\u5909\u66F4",
				"\u79FB\u52D5": "\u79FB\u52D5",
				"\u524A\u9664": "\u524A\u9664",
				"\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9": "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9"
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
			type: "QRCheckDateYmdHi",
			format: undefined,
			validation: "client"
		});
		A_rule.push({
			name: "recdate_to",
			mess: "\u4F5C\u696D\u65E5\u6642to\u306F\u5E74\u6708\u65E5\u6642\u5206\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRCheckDateYmdHi",
			format: undefined,
			validation: "client"
		});
		return A_rule;
	}

	makeSearchForm(smarty) //フォームの取得
	//フォームオブジェクト生成
	//ルールの取得
	//ルールの設定
	//フォームに初期値設定。
	//登録するぽよ
	//smartyに設定
	//validatorの値を返す
	//return $util->validateWrapper();
	{
		var elem = this.getSearchFormElement();
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
		var render = new HTML_QuickForm_Renderer_ArraySmarty(smarty);
		form.accept(render);
		smarty.assign("O_searchform", render.toArray());
	}

	smartyAssign(smarty, H_tree, tree_js) ////  ツリーについて
	//        $H_tree = $O_model->getTreeJS( $H_g_sess["pactid"],$H_g_sess["postid"],$H_sess["SELF"]["pid"]);
	//        $tree_js = $H_tree["js"];
	//検索フォームの表示について
	//検索フォームの表示について
	//部署ツリー
	{
		if (undefined !== this.H_Local.search.search) {
			smarty.assign("showform", "block");
		} else {
			smarty.assign("showform", "none");
		}

		if (this.H_Local.search.post_condition == "not") {
			smarty.assign("post_condition_show", "none");
		} else {
			smarty.assign("post_condition_show", "block");
		}

		smarty.assign("H_tree", H_tree);
		smarty.assign("tree_js", tree_js);
	}

};