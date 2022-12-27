//
//取込金額確認一覧プロセス
//
//@uses ImportProcBase
//@package
//@author web
//@since 2012/01/30
//

require("process/Admin/Import/ImportProcBase.php");

require("model/Admin/Import/ImportListModel.php");

require("view/Admin/Import/ImportListView.php");

//
//__construct
//
//@author web
//@since 2012/01/30
//
//@access public
//@return void
//
//
//doExecute
//
//@author web
//@since 2012/01/30
//
//@param array $H_param
//@access public
//@return void
//
//
//_getModel
//
//@author web
//@since 2012/01/30
//
//@access protected
//@return void
//
//
//_getView
//
//@author web
//@since 2012/01/30
//
//@access protected
//@return void
//
//
//__destruct
//
//@author web
//@since 2012/01/30
//
//@access public
//@return void
//
class ImportListProc extends ImportProcBase {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) {
		var importView = this._getView();

		AdminLogin.getLogin();
		importView.checkCGI();

		var importModel = this._getModel();

		importModel.setView(importView);
		importModel.setForm();
		importModel.setTargetDate();
		importModel.historyBar();
		importModel.saveConfirmation();
		importModel.updateConfirmation();
		importView.assigns.list = importModel.getList();
		importView.assigns.tyear = importModel.getTargetYear();
		importView.assigns.tmonth = importModel.getTargetMonth();
		importView.assigns.carList = importModel.getCarrierKeyHash();
		importView.assigns.compname = importView.gSess().getSelf("compname");
		importView.assigns.carname = importView.gSess().getSelf("carname");
		importView.assigns.display = importView.gSess().getSelf("display");
		importView.displaySmarty();
	}

	_getModel() {
		if (!this.ImportModel instanceof ImportListModel) {
			this.ImportModel = new ImportListModel();
		}

		return this.ImportModel;
	}

	_getView() {
		if (!this.ImportView instanceof ImportListView) {
			this.ImportView = new ImportListView();
		}

		return this.ImportView;
	}

	__destruct() {
		super.__destruct();
	}

};