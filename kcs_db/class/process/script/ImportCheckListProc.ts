import ProcessBaseBatch from "../ProcessBaseBatch";
import ImportCheckListModel from "../../model/script/ImportCheckListModel";
import ImportCheckListView from "../../view/script/ImportCheckListView";

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
export default class ImportCheckListProc extends ProcessBaseBatch {
	_checkmodel!: ImportCheckListModel;
	_checkview!: ImportCheckListView;
	_Argv: string[];

	constructor(argv: string[]) {
		super();
		this._Argv = argv;
	}

	async doExecute(H_param: {} | any[] = Array()) {
// 2022cvt_015
		var listTable = this._getImportCheckListModel();

// 2022cvt_015
		var listView = this._getImportCheckListView();

		listTable.setView(listView);
		listView.checkArgv();
		listTable.setArgv(listView.get_Argv());
// 2022cvt_015
		var List = await listTable.getTarget();

		await listTable.initialize();
		await listTable.insertCheckList();
// 2022cvt_015
		for (var pact of List) {
			listTable.setPactId(pact);
			listTable.calc();
		}
	}

	_getImportCheckListModel() {
		if (!(this._checkmodel instanceof ImportCheckListModel)) {
			this._checkmodel = new ImportCheckListModel();
		}

		return this._checkmodel;
	}

	_getImportCheckListView() {
		if (!(this._checkview instanceof ImportCheckListView)) {
			this._checkview = new ImportCheckListView();
		}

		return this._checkview;
	}

};
