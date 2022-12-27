require("process/ProcessBaseBatch.php");

require("model/script/ImportCheckListModel.php");

require("view/script/ImportCheckListView.php");

//
//_getImportCheckListModel
//
//@author web
//@since 2012/05/21
//
//@access protected
//@return void
//
//
//_getImportCheckListView
//
//@author web
//@since 2012/05/21
//
//@access protected
//@return void
//
class ImportCheckListProc extends ProcessBaseBatch {
	constructor(argv) {
		super();
		this._checkmodel = undefined;
		this._checkview = undefined;
		this._Argv = argv;
	}

	doExecute(H_param: {} | any[] = Array()) {
		var listTable = this._getImportCheckListModel();

		var listView = this._getImportCheckListView();

		listTable.setView(listView);
		listView.checkArgv();
		listTable.setArgv(listView.get_Argv());
		var List = listTable.getTarget();
		listTable.initialize();
		listTable.insertCheckList();

		for (var pact of Object.values(List)) {
			listTable.setPactId(pact);
			listTable.calc();
		}
	}

	_getImportCheckListModel() {
		if (!this._checkmodel instanceof ImportCheckListModel) {
			this._checkmodel = new ImportCheckListModel();
		}

		return this._checkmodel;
	}

	_getImportCheckListView() {
		if (!this._checkview instanceof ImportCheckListView) {
			this._checkview = new ImportCheckListView();
		}

		return this._checkview;
	}

};