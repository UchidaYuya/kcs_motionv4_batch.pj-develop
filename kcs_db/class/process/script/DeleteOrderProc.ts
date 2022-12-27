
import ProcessBaseBatch from '../ProcessBaseBatch';
import {DeleteOrderModel} from '../../model/script/DeleteOrderModel';
import {DeleteOrderView} from '../../view/script/DeleteOrderView';

import * as fs from 'fs';

export default class DeleteOrderProc extends ProcessBaseBatch {

	_deleteOrderModel: DeleteOrderModel | undefined;
	_deleteOrderView: DeleteOrderView | undefined;

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //多重起動防止
	{
		var O_view = this._getDeleteOrderView();

		var O_model = this._getDeleteOrderModel();

		if (O_view.checkArgError()) {
			// this.infoOut("\u5F15\u6570\u30A8\u30E9\u30FC\n", 1);
			this.infoOut("引数エラー\n", 1);
			throw process.exit();// 2022cvt_009
		}

		var files = O_view.getArg("files");

		// if (!is_null(files)) {
		if (files) {
			files += "/files/OrderFiles";

			if (!fs.existsSync(files)) {// 2022cvt_003
				// this.infoOut("files\u306E\u6307\u5B9A\u304C\u5B58\u5728\u3057\u306A\u3044\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + files + ")\n", 1);
				this.infoOut("filesの指定が存在しないディレクトリ(" + files + ")\n", 1);
				throw process.exit();// 2022cvt_009
			}
		}

		this.set_Dirs(O_view.get_ScriptName());
		this.lockProcess(O_view.get_ScriptName());
		// this.infoOut("\u6CE8\u6587\u904E\u53BB\u30C7\u30FC\u30BF\u524A\u9664\u51E6\u7406\u958B\u59CB\n", 1);
		this.infoOut("注文過去データ削除処理開始\n", 1);

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
		// this.infoOut("\u6CE8\u6587\u904E\u53BB\u30C7\u30FC\u30BF\u524A\u9664\u7D42\u4E86\n", 1);
		this.infoOut("注文過去データ削除終了\n", 1);
		throw process.exit();// 2022cvt_009
	}

	_getDeleteOrderModel() {
		if (!(this._deleteOrderModel instanceof DeleteOrderModel)) {
			this._deleteOrderModel = new DeleteOrderModel();
		}

		return this._deleteOrderModel;
	}

	_getDeleteOrderView() {
		if (!(this._deleteOrderView instanceof DeleteOrderView)) {
			this._deleteOrderView = new DeleteOrderView();
		}

		return this._deleteOrderView;
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
