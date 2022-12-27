//
//注文請求先編集ビュー
//
//@uses BillingViewBase
//@package
//@author web
//@since 2013/04/03
//

require("view/Order/BillingViewBase.php");

//
//__construct
//
//@author web
//@since 2013/04/02
//
//@access public
//@return void
//
//
//パンくずリンク作成
//
//@author web
//@since 2013/04/16
//
//@access public
//@return void
//
//
//画面描画
//
//@author web
//@since 2013/04/03
//
//@access public
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/04/02
//
//@access public
//@return void
//
class BillingModView extends BillingViewBase {
	constructor() {
		super();
	}

	setBreadCrumbs() {
		return this.assignBreadCrumbs({
			"./billMenu.php": this.langLists.bcMenu[this.gSess().language],
			"": this.langLists.bcMod[this.gSess().language]
		});
	}

	displaySmarty() {
		var formRender = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.forms.accept(formRender);
		this.assign("form", formRender.toArray());
		this.setBreadCrumbs();
		this.setJsFile();
		var data = this.getLocalSession();
		var billData = this.getModel().getBillData();

		if (undefined !== data.SELF.defaultflg || undefined !== billData.defaultflg && billData.defaultflg) {
			this.assign("postview", "hidden");
		}

		if (!this.tplFile) {
			this.tplFile = this.getDefaultTemplate();
		}

		this.get_Smarty().display(this.tplFile);
		return this;
	}

	__destruct() {
		super.__destruct();
	}

};