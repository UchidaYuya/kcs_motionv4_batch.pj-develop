//
//注文請求先編集プロセス
//
//@uses BillingProcBase
//@package
//@author web
//@since 2013/04/03
//

require("process/Order/BillingProcBase.php");

require("model/Order/BillingModModel.php");

require("view/Order/BillingModView.php");

//
//__construct
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
//
//doExecute
//
//@author web
//@since 2013/04/01
//
//@param array $H_param
//@access public
//@return void
//
//
//getModModel
//
//@author web
//@since 2013/04/01
//
//@access protected
//@return void
//
//
//getModView
//
//@author web
//@since 2013/04/01
//
//@access protected
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/04/01
//
//@access public
//@return void
//
class BillingModProc extends BillingProcBase {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) //$modModel->getPostTree();
	{
		var modView = this.getModView();
		var modModel = this.getModModel();
		var gSess = modView.getGlobalSession();
		modView.startCheck();
		var lSess = modView.getLocalSession();
		modModel.setView(modView);
		modView.setModel(modModel);
		var Form = modView.makeForms();
		var billData = modModel.getBillData();
		var progress = modView.getProgress();
		modView.setDefaults(billData);

		if (modView.validate()) {
			if (BillingModelBase.POST == progress) {
				Form.getForms().freeze("billname, billpost, receiptname, zip1, zip2, addr1, addr2, building, billtel, billhow, defaultflg");
				modView.setRules(this.modView.makePostRules().getPostRules());
			} else if (BillingModelBase.CONFIRM == progress) {
				modView.freeze();
			} else if (BillingModelBase.EXECUTE == progress) {
				modView.csrfValidate();
				modView.freeze();
				modModel.deletePastView();
				modModel.updateBillData();

				if (modModel.queryExecute()) {
					modView.endTemplate("billModEnd.tpl");
				}
			}
		}

		modView.displaySmarty();
	}

	getModModel() {
		if (!this.modModel instanceof BillingModModel) {
			this.modModel = new BillingModModel();
		}

		return this.modModel;
	}

	getModView() {
		if (!this.modView instanceof BillingModView) {
			this.modView = new BillingModView();
		}

		return this.modView;
	}

	__destruct() {
		super.__destruct();
	}

};