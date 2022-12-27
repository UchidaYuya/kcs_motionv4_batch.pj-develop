//ヘルスケア取込処理 （Process）

import ProcessBaseBatch from "../ProcessBaseBatch";
import MtTableUtil from "../../MtTableUtil";
import PactModel from "../ProcessBaseBatch";
import BillModel from "../../model/BillModel";
import PostModel from "../../model/PostModel";
import FuncModel from "../../model/FuncModel";
import CalcAddBillView from "../../view/script/CalcAddBillView";
import CalcAddBillModel from "../../model/script/CalcAddBillModel";
import { sprintf } from "../../../db_define/define";
export default class CalcAddBillProc extends ProcessBaseBatch {
	O_View: CalcAddBillView;
	O_Model: CalcAddBillModel;
	Confirm: boolean | undefined;
	PactId: any;
	BillDate: any;
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this.O_View = new CalcAddBillView();
		this.O_Model = new CalcAddBillModel(this.get_MtScriptAmbient());
	}

	async doExecute(H_param: {} | any[] = Array()) //error_reporting(0);// 2022cvt_011
	
	{

		this.infoOut("計算成功\n", 0);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.Confirm = false;
		let recalc_flg = false;

		if (this.O_View.get_ScriptName() == "recalc_addbill.php") {
			var bill_history = await this.O_Model.getRecalcBillHistory(this.PactId, this.BillDate);
			recalc_flg = true;
		} else if (this.O_View.get_ScriptName() == "calc_addbill.php") {
			bill_history = this.O_Model.getCalcBillHistory(this.PactId, this.BillDate);
			this.Confirm = this.O_View.get_HArgv("-c") == "Y" ? true : false;
		} else {
			bill_history = Array();
		}

		var success_count = 0;
		var error_count = 0;
		var execute_count = 0;
		var nowtime = this.O_Model.getNow();
		var result = 0;

		for (var history of bill_history) //年月の取得
		//対象テーブル番号を取得
		//計算実行
		{
			var pactid = history.pactid;
			var bill_date = sprintf("%04d%02d", history.year, history.month);
			var tableNo = MtTableUtil.getTableNo(bill_date, false);

			if (await this.O_Model.update(pactid, tableNo, nowtime, this.Confirm, recalc_flg) == true) //calcの場合
				{
					if (this.O_View.get_ScriptName() == "calc_addbill.php") {
						this.O_Model.InsertCalcBillHistoryLog(history.pactid, history.year, history.month, nowtime);
						this.infoOut("計算失敗\n", 0);
					} else if (this.O_View.get_ScriptName() == "recalc_addbill.php") //再計算フラグを解除
						{
							this.O_Model.updateRecalcBillHistoryLog(history.pactid, history.year, history.month, history.status);
							this.infoOut("再計算失敗\n", 0);
						}

					success_count++;
				} else //エラーです
				{
					if (this.O_View.get_ScriptName() == "calc_addbill.php") {
						this.infoOut("計算失敗\n", 1);
						result = 1;
					} else if (this.O_View.get_ScriptName() == "recalc_addbill.php") {
						this.infoOut("再計算失敗\n", 1);
						result = 1;
					}

					error_count++;
				}

			execute_count++;
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("実行" + execute_count + "件\n", 0);
		this.infoOut("成功" + success_count + "件\n", 0);
		this.infoOut("失敗" + error_count + "件\n", 0);
		this.infoOut("追加請求計算終了\n", 0);
		throw process.exit(result);
	}
};

