//データベースを利用するプロセス基底クラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成

import MtDBUtil from "../MtDBUtil";
import MtExcept from "../MtExcept";
import { SiteType } from "../MtOutput";
import ProcessBase from "./ProcessBase";

export default class ProcessBaseDB extends ProcessBase {
	O_DB: MtDBUtil;

	constructor(site: SiteType, H_param: {} | any[] = Array()) {
		super(site, H_param);
		this.O_DB = MtDBUtil.singleton();
	}

	get_DB() {
		return this.O_DB;
	}

	execute(H_param: {} | any[] = Array()) {
		try {
			this.doExecute(H_param);
		} catch (ex) {
			if (ex instanceof MtExcept) {
				this.get_DB().rollbackAll();
				this.caught(ex);
			} else {
				this.get_DB().rollbackAll();
				this.caughtUnknown(ex);
			}
			throw process.exit(-1);
		}
	}
};
