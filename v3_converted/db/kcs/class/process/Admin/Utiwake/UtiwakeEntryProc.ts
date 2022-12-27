//
//内訳コード登録プロセス
//
//@uses UtiwakeProcBase
//@package
//@author igarashi
//@since 2011/11/14
//

require("process/Admin/Utiwake/UtiwakeProcBase.php");

require("view/Admin/Utiwake/UtiwakeEntryView.php");

require("model/Admin/Utiwake/UtiwakeEntryModel.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/14
//
//@access public
//@return void
//
//
//doExecute
//
//@author igarashi
//@since 2011/11/14
//
//@access public
//@return void
//
//
//_getEntryView
//
//@author igarashi
//@since 2011/11/14
//
//@access protected
//@return void
//
//
//_getEntryModel
//
//@author igarashi
//@since 2011/11/14
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
class UtiwakeEntryProc extends UtiwakeProcBase {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) {
		var O_view = this._getEntryView();

		AdminLogin.getLogin();
		O_view.checkCGIParam();

		var O_model = this._getEntryModel();

		O_model.setView(O_view);
		O_view.makeQuickFormObject(O_model.makeFormPeculiar());
		O_view.setDefaults(O_model.getDefaults());
		O_model.makeRule();
		O_model.validate();
		O_model.insertUtiwake();
		O_view.setTitle("\u5185\u8A33\u30B3\u30FC\u30C9\u767B\u9332");
		O_view.setNavi({
			"/Admin/Utiwake/utiwake_list.php": "\u5185\u8A33\u30B3\u30FC\u30C9\u4E00\u89A7",
			"": "\u5185\u8A33\u30B3\u30FC\u30C9\u767B\u9332"
		});
		O_view.displaySmarty();
	}

	_getEntryView() {
		if (!this.entryView instanceof UtiwakeEntryView) {
			this.entryView = new UtiwakeEntryView();
		}

		return this.entryView;
	}

	_getEntryModel() {
		if (!this.entryModel instanceof UtiwakeEntryModel) {
			this.entryModel = new UtiwakeEntryModel();
		}

		return this.entryModel;
	}

	__destruct() {
		super.__destruct();
	}

};