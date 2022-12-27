//
//価格表Excelアップロードビュー
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/07
//@filesource
//@uses ViewSamrty
//@uses ViewFinish
//@uses ViewError
//
//
//価格表Excelアップロードビュー
//
//@package Admin
//@subpackage Price
//@author kitamura
//@since 2009/09/07
//@uses ViewSamrty
//@uses ViewFinish
//@uses ViewError
//

require("view/ViewSmarty.php");

require("view/ViewFinish.php");

require("view/ViewError.php");

require("view/MakePankuzuLink.php");

//
//exec_type
//
//@var string
//@access protected
//
//
//error
//
//@var boolean
//@access protected
//
//
//excel_filename
//
//@var string
//@access protected
//
//
//A_message
//
//@var array
//@access protected
//
//
//H_default_assign
//
//@var mixed
//@access protected
//
//
//コンストラクタ
//
//@author kitamura
//@since 2009/09/07
//
//@access public
//@return void
//
//
//初期化
//
//@author kitamura
//@since 2009/09/10
//
//@access public
//@return void
//
//
//Excelファイル名を取得
//
//@author kitamura
//@since 2009/09/10
//
//@access public
//@return string
//
//
//グループIDの取得
//
//@author kitamura
//@since 2009/09/10
//
//@access public
//@return integer
//
//
//ショップIDの取得
//
//@author kitamura
//@since 2009/09/10
//
//@access public
//@return integer
//
//
//ユーザ名の取得
//
//@author kitamura
//@since 2009/09/10
//
//@access public
//@return string
//
//
//実行種別を取得
//
//@author kitamura
//@since 2009/09/10
//
//@access public
//@return void
//
//
//メッセージの取得
//
//@author kitamura
//@since 2009/10/06
//
//@access public
//@return array
//
//
//インポートするデータを設定
//
//@author kitamura
//@since 2009/10/06
//
//@param mixed $A_insert_data
//@access public
//@return void
//
//
//インポートするデータの取得
//
//@author kitamura
//@since 2009/10/06
//
//@access public
//@return mixed
//
//
//子のショップIDを取得
//
//@author kitamura
//@since 2009/11/06
//
//@access public
//@return integer
//
//
//完了画面を通過したか判別
//
//@author kitamura
//@since 2009/10/06
//
//@access public
//@return boolean
//
//
//エラーが存在するか
//
//@author kitamura
//@since 2009/09/10
//
//@access public
//@return boolean
//
//
//Smartyにアサイン
//
//@author kitamura
//@since 2009/09/07
//
//@param string $key
//@param mixed $value
//@access public
//@return void
//
//
//メッセージを設定
//
//@author kitamura
//@since 2009/09/10
//
//@param string $message,
//@param integer $type,
//@param integer $message_key
//@access public
//@return integer
//
//
//画面表示
//
//@author kitamura
//@since 2009/09/07
//
//@access public
//@return void
//
//
//完了画面表示
//
//@author kitamura
//@since 2009/10/06
//
//@access public
//@return void
//
//
//パラメータの検証
//
//@author kitamura
//@since 2009/09/10
//
//@access protected
//@return void
//
//
//パンくずリストの生成
//
//@author kitamura
//@since 2009/09/07
//
//@access protected
//@return string
//
//
//デストラクタ
//
//@author kitamura
//@since 2009/09/11
//
//@access public
//@return void
//
class AdminPriceExcelUploadView extends ViewSmarty {
	static EXEC_INPUT = "input";
	static EXEC_CONFIRM = "confirm";
	static EXEC_FINISH = "finish";
	static MESSAGE_TYPE_NORMAL = "normal";
	static MESSAGE_TYPE_SUCCESS = "success";
	static MESSAGE_TYPE_ERROR = "error";
	static MESSAGE_TYPE_WARNING = "warning";

	constructor(site = undefined) {
		if (true == is_null(site)) {
			site = ViewBaseHtml.SITE_ADMIN;
		}

		super({
			site: site
		});
		this.error = false;
		this.A_message = Array();
		this.init();
	}

	init() {
		this.H_default_assign = {
			admin_submenu: this.createTopicPath(),
			shop_person: this.gSess().admin_name + " " + this.gSess().admin_personname,
			admin_fncname: "\u4FA1\u683C\u8868Excel\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9"
		};
		this.assign(this.H_default_assign);
	}

	getExcelFileName() {
		return this.excel_filename;
	}

	getGroupId() {
		return this.gSess().admin_groupid;
	}

	getShopId() {
		return 0;
	}

	getPersonName() {
		return "\u7BA1\u7406\u8005";
	}

	getExecType() {
		return this.exec_type;
	}

	getMessage() {
		return this.A_message;
	}

	setInsertData(A_insert_data) {
		this.gSess().setSelf("A_insert_data", A_insert_data);
	}

	getInsertData() {
		return this.gSess().getSelf("A_insert_data");
	}

	getChildShopId() {
		return this.gSess().getSelf("child_shopid");
	}

	isFinish(finish = undefined) {
		if (false == is_null(finish)) {
			this.gSess().setSelf("finish", Bool(finish));
		}

		return this.gSess().getSelf("finish");
	}

	isError() {
		return this.error;
	}

	assign(key, value = undefined) {
		if (is_null(value) == true && Array.isArray(key) == true) {
			this.get_Smarty().assign(key);
		} else {
			this.get_Smarty().assign(key, value);
		}
	}

	addMessage(message, type = AdminPriceExcelUploadView.MESSAGE_TYPE_NORMAL, message_key = undefined) //メッセージ種別による個別処理
	{
		switch (type) {
			case AdminPriceExcelUploadView.MESSAGE_TYPE_ERROR:
				this.error = true;

			case AdminPriceExcelUploadView.MESSAGE_TYPE_NORMAL:
			case AdminPriceExcelUploadView.MESSAGE_TYPE_SUCCESS:
			case AdminPriceExcelUploadView.MESSAGE_TYPE_WARNING:
				break;

			default:
				type = AdminPriceExcelUploadView.MESSAGE_TYPE_NORMAL;
				break;
		}

		if (true == (undefined !== message_key)) {
			this.A_message[message_key].submessage.push({
				message: message,
				type: type
			});
		} else {
			message_key = this.A_message.length;
			this.A_message[message_key] = {
				message: message,
				type: type,
				submessage: Array()
			};
		}

		return message_key;
	}

	display(confirm = false) {
		var A_message = this.getMessage();
		var H_message = A_message.pop();
		this.assign("H_message", H_message);
		this.assign("A_message", A_message);
		this.assign("confirm", confirm);
		this.assign("error", this.isError());
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	displayFinish() {
		var H_default_assign = this.H_default_assign;

		if (true == (undefined !== H_default_assign.admin_submenu)) {
			delete H_default_assign.admin_submenu;
		}

		if (true == (undefined !== H_default_assign.shop_submenu)) {
			delete H_default_assign.shop_submenu;
		}

		var return_page = dirname(_SERVER.PHP_SELF) + "/menu.php";
		var view = new ViewFinish();
		view.get_Smarty().assign(H_default_assign);
		view.displayFinish("\u4FA1\u683C\u8868\u306E\u53D6\u308A\u8FBC\u307F", return_page, "\u4FA1\u683C\u8868\u4E00\u89A7\u3078");
	}

	checkCGIParam() //確認画面へ
	{
		this.exec_type = AdminPriceExcelUploadView.EXEC_INPUT;

		if (true == (undefined !== _POST.upload) && true == (undefined !== _FILES.excel_file)) {
			var filename = _FILES.excel_file.name;
			var tmpname = _FILES.excel_file.tmp_name;
			var error = _FILES.excel_file.error;
			var H_file = pathinfo(filename);

			if (filename.length < 1 || tmpname.length < 1) {
				this.addMessage("\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u30D5\u30A1\u30A4\u30EB\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044", AdminPriceExcelUploadView.MESSAGE_TYPE_ERROR);
			} else if (false == preg_match("/^xls$/i", H_file.extension)) {
				this.addMessage("Excel\u30D5\u30A1\u30A4\u30EB\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044", AdminPriceExcelUploadView.MESSAGE_TYPE_ERROR);
			} else if (error != UPLOAD_ERR_OK) {
				this.addMessage("\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F", AdminPriceExcelUploadView.MESSAGE_TYPE_ERROR);
			}

			if (false == this.isError() && false == is_uploaded_file(tmpname)) {
				this.errorOut(8, "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093");
			}

			if (false == this.isError()) {
				var newtmpname = tmpname + ".xls";
				rename(tmpname, newtmpname);
				this.excel_filename = newtmpname;
				this.exec_type = AdminPriceExcelUploadView.EXEC_CONFIRM;
			}
		} else if (true == (undefined !== _POST.entry)) {
			this.exec_type = AdminPriceExcelUploadView.EXEC_FINISH;
		} else if (true == (undefined !== _GET.shopid)) {
			this.gSess().setSelf("child_shopid", _GET.shopid);
		}
	}

	createTopicPath() {
		var O_tp = new MakePankuzuLink();
		var H_link = {
			"/Admin/Price/menu.php": "\u4FA1\u683C\u8868\u4E00\u89A7",
			"": "\u4FA1\u683C\u8868Excel\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9"
		};
		return O_tp.makePankuzuLinkHTML(H_link, "admin", true);
	}

	__destruct() {
		super.__destruct();

		if (file_exists(this.excel_filename)) {
			unlink(this.excel_filename);
		}
	}

};