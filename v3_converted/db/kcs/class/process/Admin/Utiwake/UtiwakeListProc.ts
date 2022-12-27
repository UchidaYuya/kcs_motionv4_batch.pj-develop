//
//仮登録内訳コード一覧プロセス
//
//@uses UtiwakeProcBase
//@package
//@author igarashi
//@since 2011/11/11
//

require("process/Admin/Utiwake/UtiwakeProcBase.php");

require("model/Admin/Utiwake/UtiwakeListModel.php");

require("view/Admin/Utiwake/UtiwakeListView.php");

require("MtUtil.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/10
//
//@access public
//@return void
//
//
//doExecute
//
//@author igarashi
//@since 2011/11/10
//
//@param array $H_param
//@access public
//@return void
//
//
//getListView
//
//@author igarashi
//@since 2011/11/10
//
//@access protected
//@return void
//
//
//_getListModel
//
//@author igarashi
//@since 2011/11/10
//
//@access protected
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/11/16
//
//@access public
//@return void
//
class UtiwakeListProc extends UtiwakeProcBase {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) {
		var O_view = this._getListView();

		AdminLogin.getLogin();
		O_view.checkCGIParam();

		var O_model = this._getListModel();

		O_model.setView(O_view);
		var codeList = O_model.getCodeListSet();
		O_view.makeQuickFormObject(O_model.makeForm(), O_model.getDefaults());
		O_view.assigns.list = codeList.codeList;
		O_view.assigns.count = codeList.count;
		O_model.setBulkbutton(codeList.count);
		var O_Util = new MtUtil();
		O_view.assigns.pageLink = O_Util.getPageLink(codeList.count, O_view.getLimit(), O_view.getPage());
		O_model.deleteCode();
		O_view.setTitle("\u5185\u8A33\u30B3\u30FC\u30C9\u4E00\u89A7");
		O_view.setNavi({
			"": "\u5185\u8A33\u30B3\u30FC\u30C9\u4E00\u89A7"
		});
		O_view.displaySmarty();
	}

	_getListView() {
		if (!this.listView instanceof UtiwakeListView) {
			this.listView = new UtiwakeListView();
		}

		return this.listView;
	}

	_getListModel() {
		if (!this.listModel instanceof UtiwakeListModel) {
			this.listModel = new UtiwakeListModel();
		}

		return this.listModel;
	}

	__destruct() {
		super.__destruct();
	}

};