//
//価格表Excelアップロードプロセス
//
//更新履歴：
//2009/09/07 北村俊士 作成
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/07
//@filesource
//@uses ProcessBaseHtml
//@uses AdminPriceExcelUploadView
//
//
//価格表Excelアップロードプロセス
//
//更新履歴：
//2009/09/07 北村俊士 作成
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/07
//@uses ProcessBaseHtml
//@uses AdminPriceExcelUploadView
//

require("process/ProcessBaseHtml.php");

require("view/Admin/Price/AdminPriceExcelUploadView.php");

require("model/script/ImportPriceList/ImportPriceList.php");

require("model/Admin/Price/AdminPriceModel.php");

//
//O_model
//
//@var AdminPriceAdminPriceModel
//@access protected
//
//
//O_view
//
//@var AdminPriceExcelDownloadView
//@access protected
//
//
//Modelの取得
//
//@author kitamura
//@since 2009/09/10
//
//@access public
//@return AdminPriceModel
//
//
//Viewの取得
//
//@author kitamura
//@since 2009/09/10
//
//@access public
//@return AdminPriceExcelUploadView
//
//
//メイン処理
//
//@author kitamura
//@since 2009/09/07
//
//@access protected
//@return void
//
//
//入力画面処理
//
//@author kitamura
//@since 2009/09/10
//
//@access protected
//@return void
//
//
//確認画面処理
//
//@author kitamura
//@since 2009/10/06
//
//@access protected
//@return void
//
//
//完了画面処理
//
//@author kitamura
//@since 2009/10/06
//
//@access protected
//@return void
//
//
//インポート処理
//
//@author kitamura
//@since 2009/09/10
//
//@access protected
//@return void
//
class AdminPriceExcelUploadProc extends ProcessBaseHtml {
	getModel() {
		if (false == (undefined !== this.O_model)) {
			this.O_model = new AdminPriceModel();
		}

		return this.O_model;
	}

	getView() {
		if (false == (undefined !== this.O_view)) {
			this.O_view = new AdminPriceExcelUploadView();
		}

		return this.O_view;
	}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	//処理分岐
	{
		var O_view = this.getView();
		O_view.startCheck();

		switch (O_view.getExecType()) {
			case AdminPriceExcelUploadView.EXEC_FINISH:
				this.execFinish();
				break;

			case AdminPriceExcelUploadView.EXEC_CONFIRM:
				this.execConfirm();
				break;

			case AdminPriceExcelUploadView.EXEC_INPUT:
			default:
				this.execInput();
				break;
		}
	}

	execInput() {
		this.getView().display();
	}

	execConfirm() {
		var view = this.getView();
		view.setInsertData(this.execImport());
		view.isFinish(false);
		view.display(true);
	}

	execFinish() {
		var A_insert_data;
		var view = this.getView();

		if (false != (A_insert_data = view.getInsertData()) && false == view.isFinish()) {
			var O_model = this.getModel();

			for (var H_insert_data of Object.values(A_insert_data)) {
				O_model.insertPriceListAll(H_insert_data.H_pricelist, H_insert_data.H_data);
			}

			view.isFinish(true);
		}

		view.displayFinish();
	}

	execImport() //パラメータの取得
	//Excelデータの取得
	//価格表のバリデート
	//価格表のインサート
	{
		var O_model = this.getModel();
		var O_view = this.getView();
		var filename = O_view.getExcelFileName();
		var groupid = O_view.getGroupId();
		var shopid = O_view.getShopId();
		var personname = O_view.getPersonname();
		var O_excel = new ImportPriceList(filename, groupid, shopid);
		var A_sheet = O_excel.getSheets();
		var H_all_data = O_excel.readAll();
		var data_error = false;
		var A_insert_data = Array();

		for (var key in H_all_data) //エラー判定
		//追加する価格表
		{
			var H_data = H_all_data[key];
			var do_insert = true;
			var message_key = O_view.addMessage(A_sheet[key] + "\u306E\u4FA1\u683C\u8868");
			var A_line_error = H_data.H_error.LINE;
			delete H_data.H_error.LINE;

			if (false == (undefined !== H_data.H_data) || false == Array.isArray(H_data.H_data) || H_data.H_data.length < 1) {
				for (var error_message of Object.values(A_line_error)) {
					O_view.addMessage("WARNING: " + error_message, AdminPriceExcelUploadView.MESSAGE_TYPE_WARNING, message_key);
				}

				O_view.addMessage("\u6709\u52B9\u306A\u5546\u54C1\u304C1\u4EF6\u3082\u8A18\u5165\u3055\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u53D6\u308A\u8FBC\u307E\u308C\u307E\u305B\u3093", AdminPriceExcelUploadView.MESSAGE_TYPE_NORMAL, message_key);
				do_insert = false;
			} else if (H_data.H_error.length > 0) {
				for (var error_message of Object.values(H_data.H_error)) {
					O_view.addMessage("ERROR: " + error_message, AdminPriceExcelUploadView.MESSAGE_TYPE_ERROR, message_key);
				}

				data_error = true;
				do_insert = false;
			} else if (A_line_error.length > 0) {
				for (var error_message of Object.values(A_line_error)) {
					O_view.addMessage("WARNING: " + error_message, AdminPriceExcelUploadView.MESSAGE_TYPE_WARNING, message_key);
				}

				O_view.addMessage("\u8B66\u544A\u304C\u767A\u751F\u3057\u307E\u3057\u305F\uFF08\u4ED6\u306E\u4FA1\u683C\u8868\u306BERROR\u304C\u306A\u3044\u5834\u5408\u306F\u8B66\u544A\u4EE5\u5916\u304C\u53D6\u308A\u8FBC\u307E\u308C\u307E\u3059\uFF09", AdminPriceExcelUploadView.MESSAGE_TYPE_SUCCESS, message_key);
			} else {
				O_view.addMessage("\u6B63\u5E38\u306A\u30C7\u30FC\u30BF\u3067\u3059\uFF08\u4ED6\u306E\u4FA1\u683C\u8868\u306BERROR\u304C\u306A\u3044\u5834\u5408\u306F\u53D6\u308A\u8FBC\u307E\u308C\u307E\u3059\uFF09", AdminPriceExcelUploadView.MESSAGE_TYPE_SUCCESS, message_key);
			}

			if (true == do_insert) {
				H_data.H_pricelist.author = personname;
				A_insert_data.push({
					H_pricelist: H_data.H_pricelist,
					H_data: H_data.H_data
				});
			}
		}

		if (true == data_error) {
			O_view.addMessage("\u4FA1\u683C\u8868\u306BERROR\u304C\u3042\u308A\u307E\u3059\uFF08ERROR\u3092\u4FEE\u6B63\u3057\u3066\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3092\u3084\u308A\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\uFF09", AdminPriceExcelUploadView.MESSAGE_TYPE_ERROR);
			A_insert_data = false;
		} else if (A_insert_data.length < 1) {
			O_view.addMessage("\u53D6\u308A\u8FBC\u3080\u4FA1\u683C\u8868\u304C\u3042\u308A\u307E\u305B\u3093", AdminPriceExcelUploadView.MESSAGE_TYPE_ERROR);
			A_insert_data = false;
		} else {
			O_view.addMessage("\u4E0B\u8A18\u306E\u4FA1\u683C\u8868\u3092\u53D6\u308A\u8FBC\u307F\u307E\u3059\u3002\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F");
		}

		return A_insert_data;
	}

};