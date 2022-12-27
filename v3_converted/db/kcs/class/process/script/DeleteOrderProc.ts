//
//過去注文削除
//
//更新履歴：<br>
//
//@package script
//@subpackage Process
//@author igarashi
//@filesource
//@since 2011/09/13
//
//error_reporting(E_ALL|E_STRICT);

require("process/ProcessBaseBatch.php");

require("model/script/DeleteOrderModel.php");

require("view/script/DeleteOrderView.php");

//
//__construct
//
//@author igarashi
//@since 2011/09/13
//
//@access public
//@return void
//
//
//doExecute
//
//@author igarashi
//@since 2011/09/13
//
//@access public
//@return void
//
//
//_scriptEnd
//
//@author igarashi
//@since 2011/09/13
//
//@access protected
//@return void
//
//
//_getDeleteOrderObject
//
//@author igarashi
//@since 2011/09/13
//
//@access protected
//@return void
//
//
//_getDeleteOrderView
//
//@author igarashi
//@since 2011/09/13
//
//@access protected
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2011/09/13
//
//@access public
//@return void
//
class DeleteOrderProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //多重起動防止
	{
		var O_view = this._getDeleteOrderView();

		var O_model = this._getDeleteOrderModel();

		if (O_view.checkArgError()) {
			this.infoOut("\u5F15\u6570\u30A8\u30E9\u30FC\n", 1);
			throw die();
		}

		var files = O_view.getArg("files");

		if (!is_null(files)) {
			files += "/files/OrderFiles";

			if (!is_dir(files)) {
				this.infoOut("files\u306E\u6307\u5B9A\u304C\u5B58\u5728\u3057\u306A\u3044\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + files + ")\n", 1);
				throw die();
			}
		}

		this.set_Dirs(O_view.get_ScriptName());
		this.lockProcess(O_view.get_ScriptName());
		this.infoOut("\u6CE8\u6587\u904E\u53BB\u30C7\u30FC\u30BF\u524A\u9664\u51E6\u7406\u958B\u59CB\n", 1);

		try {
			var keyday = O_model.getFirstDay();
			O_model.deleteOrder(keyday, files);
		} catch (e) {
			this.infoOut(e.getMessage() + "\n", 1);
		}

		this._scriptEnd();
	}

	_scriptEnd() {
		var O_view = this._getDeleteOrderView();

		this.unLockProcess(O_view.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\u6CE8\u6587\u904E\u53BB\u30C7\u30FC\u30BF\u524A\u9664\u7D42\u4E86\n", 1);
		throw die();
	}

	_getDeleteOrderModel() {
		if (!this._deleteOrderModel instanceof DeleteOrderModel) {
			this._deleteOrderModel = new DeleteOrderModel();
		}

		return this._deleteOrderModel;
	}

	_getDeleteOrderView() {
		if (!this._deleteOrderView instanceof DeleteOrderView) {
			this._deleteOrderView = new DeleteOrderView();
		}

		return this._deleteOrderView;
	}

	__destruct() {
		super.__destruct();
	}

};