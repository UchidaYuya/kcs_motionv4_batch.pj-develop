// //error_reporting(E_ALL|E_STRICT);// 2022cvt_011
// 2022cvt_025
//require_once("model/TransitModel.php");	// ●未実装
//
//SendBillMailProc
//請求、管理、注文履歴メール送信
//@uses ProcessBaseBatch
//@package
//@author web
//@since 2016/11/04
//

import { SendBillMailModel } from "../../model/script/SendBillMailModel";
import SendBillMailView from "../../view/script/SendBillMailView";
import ProcessBaseBatch from "../ProcessBaseBatch";
import FuncModel from "../../model/FuncModel";
import PostModel from "../../model/PostModel";
import BillModel from "../../model/BillModel";
import MtTableUtil from "../../MtTableUtil";

// 2022cvt_026
// require("MtTableUtil.php");

// // 2022cvt_026
// require("model/PactModel.php");

// // 2022cvt_026
// require("model/BillModel.php");

// // 2022cvt_026
// require("model/PostModel.php");

// // 2022cvt_026
// require("model/FuncModel.php");

// 2022cvt_026
// require("process/ProcessBaseBatch.php");

// 2022cvt_026
// require("view/script/SendBillMailView.php");

// // 2022cvt_026
// require("model/script/SendBillMailModel.php");


export default class SendBillMailProc extends ProcessBaseBatch {
	O_View: SendBillMailView;
	O_Model: SendBillMailModel;
	pactid: string | undefined;
	
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.O_View = new SendBillMailView();
		this.O_Model = new SendBillMailModel();
	}

	doExecute(H_param: {} | any[] = Array()) {//error_reporting(0);

		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.pactid = this.O_View.get_HArgv("-p");

		while (this.O_Model.updateMail())

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		throw process.exit();
	}

};
