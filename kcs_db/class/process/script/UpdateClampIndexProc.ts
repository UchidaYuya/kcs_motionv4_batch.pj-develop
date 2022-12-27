//clamp_index_tbアップデートプロセス
//2009/10/27 宮澤龍彦 作成

import ProcessBaseBatch from "../ProcessBaseBatch";
import UpdateClampIndexModel from "../../model/script/UpdateClampIndexModel";
import UpdateClampIndexView from "../../view/script/UpdateClampIndexView";
export default class UpdateClampIndexProc extends ProcessBaseBatch {
	O_View: UpdateClampIndexView;
	O_Model: UpdateClampIndexModel;
	constructor(H_param = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.O_View = new UpdateClampIndexView();
		this.O_Model = new UpdateClampIndexModel(this.get_DB());
	}

	doExecute(H_param: {} | any[] = Array()) //引数の値を配列に収めてモデルに渡す
	{
		var H_val: any[string | number] = Array();
		H_val.year = this.O_View.UpdYear;
		H_val.month = this.O_View.UpdMonth;
		H_val.pactid = this.O_View.UpdPactid;
		H_val.carid = this.O_View.UpdCarid;
		H_val.column = this.O_View.UpdColumn;
		H_val.result = this.O_View.UpdResult;
		this.O_Model.updateIndex(H_val);
	}
};
