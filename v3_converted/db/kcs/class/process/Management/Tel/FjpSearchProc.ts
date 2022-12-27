//require_once("model/Order/OrderModelBase.php");
//
//SearchPostProc
//
//@uses ProcessBaseHtml
//@package
//@author igarashi
//@since 2011/05/25
//

require("process/ProcessBaseHtml.php");

require("model/Order/SearchPostModel.php");

require("view/Management/Tel/FjpSearchView.php");

require("MtTableUtil.php");

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
//getView
//
//@author igarashi
//@since 2011/05/25
//
//@access protected
//@return void
//
//
//_getModel
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
class FjpSearchProc extends ProcessBaseHtml {
	static SEARCH = "/search";
	static MANAGEMENT = "/Management";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	_getView() {
		if (!this._view instanceof FjpSearchView) {
			this._view = new FjpSearchView();
		}

		return this._view;
	}

	_getModel() {
		if (!this._model instanceof SearchPostModel) {
			this._model = new SearchPostModel();
		}

		return this._model;
	}

	doExecute(H_param: {} | any[] = Array()) {
		var searchSession = this._getView().startCheck().gSess().getPub(FjpSearchProc.SEARCH);

		if (this._getView().type === "recog") {
			var lists = this._getModel().searchRecogUser(this._getView());
		} else {
			var util = new MtTableUtil();

			var tmp = this._getView().gSess().getPub(FjpSearchProc.MANAGEMENT);

			if (tmp.cym != date("Ym")) {
				this._getModel().setTableNo(util.getTableNo(tmp.cym, true));
			}

			lists = this._getModel().searchPost(this._getView());
		}

		var errmsg = this._getModel().getErrorMessage(this._getView().submit, lists.length);

		this._getView().assign("errmessage", errmsg);

		this._getView().assign("listcnt", lists.length);

		this._getView().assign("lists", lists);

		this._getView().displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};