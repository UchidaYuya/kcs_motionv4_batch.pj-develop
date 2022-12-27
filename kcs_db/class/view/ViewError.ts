//エラー画面表示を行うＶＩＥＷ

import ViewSmarty from '../view/ViewSmarty';
import GroupModel from '../model/GroupModel';
import MtSetting from '../MtSetting';

const fs = require("fs"); 
const path = require('path');
export default class ViewError extends ViewSmarty {
	ShopID: string;
	A_error_main: any;
	O_Conf: MtSetting;
	O_group: GroupModel;
	constructor(shopid: string = "") {
		var H_param = {
			common: true,
			skip: true
		};
		super(H_param);
		this.O_Conf = MtSetting.singleton();
		this.O_group = new GroupModel();
		this.ShopID = shopid;
		this.A_error_main = Array();
		
	}

	setErrorMain(A_err: {} | any[]) {
		this.A_error_main = A_err;
	}

	display(errormessage: string, code = 0, goto = "", buttonstr = "戻 る") //エラー時の戻り先の指定.
	{}

	getHeaderJS() {
		var str = "<script language=\"Javascript\" src=\"/js/subwindow.js\"></script>";
		return str;
	}
};