//
//内訳コード一括変更プロセス
//
//@uses UtiwakeListProc
//@package
//@author igarashi
//@since 2011/11/17
//

require("process/Admin/Utiwake/UtiwakeListProc.php");

require("model/Admin/Utiwake/UtiwakeBulkeditModel.php");

require("view/Admin/Utiwake/UtiwakeBulkeditView.php");

//
//__construct
//
//@author igarashi
//@since 2011/11/17
//
//@access public
//@return void
//
//
//doExecute
//
//@author igarashi
//@since 2011/11/17
//
//@param array $H_param
//@access public
//@return void
//
//
//_getBulkeditView
//
//@author igarashi
//@since 2011/11/17
//
//@access protected
//@return void
//
//
//_getBulkeditModel
//
//@author igarashi
//@since 2011/11/17
//
//@access protected
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/11/17
//
//@access public
//@return void
//
class UtiwakeBulkeditProc extends UtiwakeListProc {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) {
		var O_view = this._getBulkeditView();

		AdminLogin.getLogin();
		O_view.checkCGIParam();

		var O_model = this._getBulkeditModel();

		O_model.setView(O_view);
		var codeList = O_model.getCodeListSet();
		O_view.makeQuickFormObject(O_model.makeFormBulk(codeList));
		O_view.setDefaults(O_model.makeDefaults(codeList));
		O_model.makeRule(codeList);
		O_view.assigns.list = codeList.codeList;
		O_view.assigns.count = codeList.count;
		var O_Util = new MtUtil();
		O_view.assigns.pageLink = O_Util.getPageLink(codeList.count, O_view.getLimit(), O_view.getPage());

		if (false !== O_view.validate()) {
			O_model.updateCodes(codeList);
		}

		O_view.setTitle("\u5185\u8A33\u30B3\u30FC\u30C9\u4E00\u62EC\u7DE8\u96C6");
		O_view.setNavi({
			"/Admin/Utiwake/utiwake_list.php": "\u5185\u8A33\u30B3\u30FC\u30C9\u4E00\u89A7",
			"": "\u5185\u8A33\u30B3\u30FC\u30C9\u4E00\u62EC\u7DE8\u96C6"
		});
		O_view.displaySmarty();
	}

	_getBulkeditView() {
		if (!this.bulkeditview instanceof UtiwakeBulkeditView) {
			this.bulkeditview = new UtiwakeBulkeditView();
		}

		return this.bulkeditview;
	}

	_getBulkeditModel() {
		if (!this.bulkeditmodel instanceof UtiwakeBulkeditModel) {
			this.bulkeditmodel = new UtiwakeBulkeditModel();
		}

		return this.bulkeditmodel;
	}

	__destruct() {
		super.__destruct();
	}

};