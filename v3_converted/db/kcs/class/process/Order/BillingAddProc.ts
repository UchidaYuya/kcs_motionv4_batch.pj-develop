//
//注文請求先追加プロセス
//
//@uses BillingProcBase
//@package
//@author web
//@since 2013/03/27
//

require("process/Order/BillingProcBase.php");

require("model/Order/BillingAddModel.php");

require("view/Order/BillingAddView.php");

//
//__construct
//
//@author web
//@since 2013/03/27
//
//@access public
//@return void
//
//
//doExecute
//
//@author web
//@since 2013/03/27
//
//@param array $H_param
//@access protected
//@return void
//
//
//モデル取得
//
//@author web
//@since 2013/03/27
//
//@access private
//@return void
//
//
//ビュー取得
//
//@author web
//@since 2013/03/27
//
//@access private
//@return void
//
//
//__destruct
//
//@author web
//@since 2013/03/27
//
//@access public
//@return void
//
class BillingAddProc extends BillingProcBase {
	constructor() {
		super();
	}

	doExecute(H_param: {} | any[] = Array()) //フォームバリデート
	{
		var addView = this.getAddView();
		var addModel = this.getAddModel();
		var gSess = addView.getGlobalSession();
		addView.startCheck();
		var lSess = addView.getLocalSession();
		addModel.setView(addView);
		addView.setModel(addModel);
		var Form = addView.makeForms();
		var progress = addView.getProgress();
		addView.setDefaults(Array());

		if (addView.validate()) {
			if (BillingModelBase.POST == progress) {} else if (BillingModelBase.CONFIRM == progress) //前フォームフリーズ
				{
					addView.freeze();
				} else if (BillingModelBase.EXECUTE == progress) //csrf対応
				//過去の請求先を削除
				//追加
				{
					addView.csrfValidate();
					addView.freeze();
					addModel.deletePastView();
					addModel.insertBillData();

					if (addModel.queryExecute()) {
						addView.endTemplate("billAddEnd.tpl");
					}
				}
		}

		addView.displaySmarty();
	}

	getAddModel() {
		if (!this.addModel instanceof BillingAddModel) {
			this.addModel = new BillingAddModel();
		}

		return this.addModel;
	}

	getAddView() {
		if (!this.addView instanceof BillingAddView) {
			this.addView = new BillingAddView();
		}

		return this.addView;
	}

	__destruct() {
		super.__destruct();
	}

};