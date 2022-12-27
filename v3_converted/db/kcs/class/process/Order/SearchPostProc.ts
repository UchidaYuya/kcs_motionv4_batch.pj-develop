//
//SearchPostProc
//
//@uses ProcessBaseHtml
//@package
//@author igarashi
//@since 2011/05/25
//

require("process/ProcessBaseHtml.php");

require("model/Order/OrderModelBase.php");

require("model/Order/SearchPostModel.php");

require("view/Order/SearchPostView.php");

//
//__construct
//
//@author igarashi
//@since 2011/05/25
//
//@param array( $arrayH_param
//@access public
//@return void
//
//
//get_View
//
//@author igarashi
//@since 2011/05/25
//
//@access protected
//@return void
//
//
//_get_Model
//
//@author igarashi
//@since 2011/05/25
//
//@access protected
//@return void
//
//
//doExecute
//
//@author igarashi
//@since 2011/05/25
//
//@param array $H_param
//@access public
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/05/25
//
//@access public
//@return void
//
class SearchPostProc extends ProcessBaseHtml {
	static ORDER = "/MTOrder";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	_get_View() {
		if (!this._view instanceof SearchPostView) {
			this._view = new SearchPostView();
		}

		return this._view;
	}

	_get_Model() {
		if (!this._model instanceof SearchPostModel) {
			this._model = new SearchPostModel();
		}

		return this._model;
	}

	doExecute(H_param: {} | any[] = Array()) {
		if (preg_match("/Shop\\/MTActorder/", _SERVER.PHP_SELF) || preg_match("/Shop\\/MTOrder/", _SERVER.PHP_SELF)) {
			this._get_View().setSiteMode(OrderModelBase.SITE_SHOP);

			var sessOrder = this._get_View().startCheck().gSess().getPub(SearchPostProc.ORDER);

			var sessGlobal = this._get_View().getGlobalShopSession();
		} else {
			this._get_View().setSiteMode(OrderModelBase.SITE_USER);

			sessOrder = this._get_View().startCheck().gSess().getPub(SearchPostProc.ORDER);
			sessGlobal = this._get_View().getGlobalSession();
		}

		var tplfile = "";

		if ("user" == this._get_View().mode) {
			var lists = this._get_Model().searchRecogUser(this._get_View());
		} else if ("tel" == this._get_View().mode) {
			lists = this._get_Model().searchTelInfo(this._get_View());
			tplfile = "gettelinfo.tpl";
		} else {
			lists = this._get_Model().searchPost(this._get_View());
			lists = this._get_Model().splitCode(lists, "userpostid");
		}

		var errmsg = this._get_Model().getErrorMessage(this._get_View().submit, lists.length);

		this._get_View().assign("errmessage", errmsg);

		this._get_View().assign("lists", lists);

		this._get_View().assign("pactid", pactid);

		this._get_View().assign("mode", this._get_View().mode);

		this._get_View().displaySmarty(tplfile);
	}

	__destruct() {
		super.__destruct();
	}

};