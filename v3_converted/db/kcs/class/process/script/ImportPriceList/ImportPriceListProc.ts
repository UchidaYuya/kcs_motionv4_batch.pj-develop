//
//価格表インポート
//
//更新履歴：<br>
//2008/10/21 上杉勝史 作成
//
//@uses ProcessBaseBatch
//@package PriceList
//@filesource
//@author katsushi
//@since 2008/10/21
//
//
//error_reporting(E_ALL|E_STRICT);
//
//価格表インポート
//
//@uses ProcessBaseBatch
//@package
//@author katsushi
//@since 2008/10/21
//

require("process/ProcessBase.php");

require("view/script/ImportPriceList/ImportPriceListBatchView.php");

require("MtOutput.php");

require("model/script/ImportPriceList/ImportPriceList.php");

require("model/Admin/Price/AdminPriceModel.php");

//
//インポートプロセス用Viewオブジェクト
//
//@var ImportPriceListView
//@access protected
//
//
//O_model
//
//@var mixed
//@access protected
//
//
//O_excel
//
//@var mixed
//@access protected
//
//
//site
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author katsushi
//@since 2008/10/30
//
//@param array $H_param
//@access public
//@return void
//
//
//newView
//
//@author katsushi
//@since 2008/11/10
//
//@access protected
//@return void
//
//
//getView
//
//@author katsushi
//@since 2008/11/11
//
//@access public
//@return void
//
//
//readExcel
//
//@author katsushi
//@since 2008/11/11
//
//@param mixed $import_file
//@param mixed $groupid
//@param mixed $shopid
//@access protected
//@return void
//
//
//getModel
//
//@author katsushi
//@since 2008/11/11
//
//@access protected
//@return void
//
//
//getExcel
//
//@author katsushi
//@since 2008/11/11
//
//@access protected
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author katsushi
//@since 2008/10/30
//
//@param array $H_param
//@access protected
//@return void
//
//
//readExec
//
//@author katsushi
//@since 2008/11/11
//
//@access protected
//@return void
//
//
//batchStart
//
//@author katsushi
//@since 2008/11/11
//
//@access protected
//@return void
//
//
//デストラクタ
//
//@author katsushi
//@since 2008/10/30
//
//@access public
//@return void
//
class ImportPriceListProc extends ProcessBase {
	constructor(H_param: {} | any[] = Array()) {
		if (undefined !== _SERVER.HTTP_HOST == true) {
			this.site = MtOutput.SITE_WEB;
		} else {
			this.site = MtOutput.SITE_BATCH;
		}

		super(this.site, H_param);
		this.getSetting().loadConfig("pricelist_import");
		this.O_model = new AdminPriceModel();
		this.A_sheets = Array();
		this.H_sheet_obj = Array();
		this.newView(this.site);
	}

	newView() {
		if (this.site == MtOutput.SITE_WEB) {
			this.O_view = new ImportPriceListView();
		} else {
			this.O_view = new ImportPriceListBatchView();
		}
	}

	getView() {
		return this.O_view;
	}

	readExcel(import_file, groupid, shopid) {
		this.O_excel = new ImportPriceList(import_file, groupid, shopid);
	}

	getModel() {
		return this.O_model;
	}

	getExcel() {
		return this.O_excel;
	}

	doExecute(H_param: {} | any[] = Array()) {
		switch (this.getView().step) {
			case "input":
				break;

			case "confirm":
				break;

			case "finish":
				break;

			default:
				this.batchStart();
				break;
		}
	}

	readExec() {
		this.readExcel(this.getView().getImportFileName(), this.getView().getGroupid(), this.getView().getShopid());
		this.A_sheets = this.getExcel().getSheets();
		this.H_sheet_obj = this.getExcel().readAll();
	}

	batchStart() //$this->getView()->echoSimple("終了");
	{
		this.getView().getArgs();
		this.getView().displayStart();
		this.readExec();
		var enable_sheets = 0;
		{
			let _tmp_0 = this.H_sheet_obj;

			for (var key in _tmp_0) //取り込み実行
			{
				var H_price_data = _tmp_0[key];
				var line_error = H_price_data.H_error.LINE;
				delete H_price_data.H_error.LINE;

				if (undefined !== H_price_data.H_error.pricename == true || H_price_data.H_pricelist.pricename === undefined) {
					var do_insert = false;
				} else {
					enable_sheets++;
					delete H_price_data.H_error.pricename;
					this.getView().echoSimple();
					this.getView().echoLine(this.A_sheets[key] + "\u306E\u4FA1\u683C\u8868\u3092\u53D6\u308A\u8FBC\u307F");

					if (H_price_data.H_error.length > 0) {
						this.getView().echoListMsg(Object.values(H_price_data.H_error));
						this.getView().echoSimple();
						this.getView().getSTDIN("\u4EE5\u4E0A\u306E\u30A8\u30E9\u30FC\u304C\u3042\u308B\u306E\u3067\u53D6\u308A\u8FBC\u307F\u3092\u4E2D\u6B62\u3057\u307E\u3059[Press Enter]");
						do_insert = false;
					} else {
						if (undefined !== H_price_data.H_data == false || Array.isArray(H_price_data.H_data) == false || H_price_data.H_data.length == 0) {
							this.getView().echoSimple();
							this.getView().getSTDIN("\u5546\u54C1\u304C1\u4EF6\u3082\u767B\u9332\u3055\u308C\u306A\u3044\u305F\u3081\u53D6\u308A\u8FBC\u307F\u3092\u4E2D\u6B62\u3057\u307E\u3059[Press Enter]");
							do_insert = false;
						} else {
							if (line_error.length > 0) {
								this.getView().echoListMsg(line_error);
								this.getView().echoSimple();
								this.getView().echoSimple("\u4EE5\u4E0A\u306E\u30A8\u30E9\u30FC\u4EE5\u5916\u3092\u53D6\u308A\u8FBC\u307F\u307E\u3059\u3002", false);
							} else {
								this.getView().echoSimple(this.A_sheets[key] + "\u306E\u4FA1\u683C\u8868\u3092\u53D6\u308A\u8FBC\u307F\u307E\u3059\u3002", false);
							}

							do_insert = this.getView().chkConfirm(this.getView().getSTDIN("\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F[Y/n]"));

							if (false == do_insert) {
								this.getView().echoSimple();
								this.getView().echoSimple("\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002");
							}

							this.getView().echoSimple();
						}
					}
				}

				if (true == do_insert) {
					this.getModel().insertPriceListAll(H_price_data.H_pricelist, H_price_data.H_data);
					this.getView().echoSimple(this.A_sheets[key] + "\u306E\u4FA1\u683C\u8868\u3092\u53D6\u308A\u8FBC\u307F\u307E\u3057\u305F\u3002");
				}
			}
		}

		if (enable_sheets == 0) {
			this.getView().echoSimple();
			this.getView().echoSimple("\u53D6\u308A\u8FBC\u307F\u5BFE\u8C61\u304C1\u4EF6\u3082\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
		}

		this.getView().echoSimple();
		this.getView().echoSimple();
		this.getView().echoLine("\u7D42 \u4E86", "-");
	}

	__destruct() {
		super.__destruct();
	}

};