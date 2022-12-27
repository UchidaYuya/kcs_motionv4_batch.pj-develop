//
//内訳コード修正プロセス
//
//@uses UtiwakeEntryProc
//@package
//@author igarashi
//@since 2011/11/15
//

require("process/Admin/Utiwake/UtiwakeEntryProc.php");

require("model/Admin/Utiwake/UtiwakeEditModel.php");

require("view/Admin/Utiwake/UtiwakeEditView.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/15
//
//@access public
//@return void
//
//
//doExecute
//
//@author igarashi
//@since 2011/11/15
//
//@param array $H_param
//@access public
//@return void
//
//
//_getEditView
//
//@author igarashi
//@since 2011/11/15
//
//@access protected
//@return void
//
//
//_getEditModel
//
//@author igarashi
//@since 2011/11/15
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
class UtiwakeEditProc extends UtiwakeEntryProc {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) {
		var O_view = this._getEditView();

		AdminLogin.getLogin();
		O_view.checkCGIParam();

		var O_model = this._getEditModel();

		O_model.setView(O_view);
		O_view.makeQuickFormObject(O_model.makeFormPeculiar());
		var codeInfo = O_model.getCodeInfo();
		O_view.setDefaults(codeInfo);
		O_model.makeRule();
		O_view.validate();
		O_model.updateUtiwake();
		O_view.assigns.codeInfo = codeInfo;
		O_view.setTitle("\u5185\u8A33\u30B3\u30FC\u30C9\u7DE8\u96C6");
		O_view.setNavi({
			"/Admin/Utiwake/utiwake_list.php": "\u5185\u8A33\u30B3\u30FC\u30C9\u4E00\u89A7",
			"": "\u5185\u8A33\u30B3\u30FC\u30C9\u7DE8\u96C6"
		});
		O_view.displaySmarty();
	}

	_getEditView() {
		if (!this.editView instanceof UtiwakeEditView) {
			this.editView = new UtiwakeEditView();
		}

		return this.editView;
	}

	_getEditModel() {
		if (!this.editModel instanceof UtiwakeEditModel) {
			this.editModel = new UtiwakeEditModel();
		}

		return this.editModel;
	}

	__destruct() {
		super.__destruct();
	}

};