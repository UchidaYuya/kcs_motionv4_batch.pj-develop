import PactModel from "../../model/PactModel";
import BillModel from "../../model/BillModel";
import PostModel from "../../model/PostModel";
import FuncModel from "../../model/FuncModel";
import ProcessBaseBatch from "../ProcessBaseBatch";
import FlatEverySecondMonthModel from "../../model/script/FlatEverySecondMonthModel";
import FlatEverySecondMonthView from "../../view/script/FlatEverySecondMonthView";

//
//コンストラクタ
//
//@author date
//@since 2015/07/10
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author date
//@since 2015/07/10
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author date
//@since 2015/07/10
//
//@access public
//@return void
//
export default class FlatEverySecondMonthProc extends ProcessBaseBatch {
	O_View: FlatEverySecondMonthView;
	O_Model: FlatEverySecondMonthModel;
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//$this->getSetting()->loadConfig("docomo_health");
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.O_View = new FlatEverySecondMonthView();
		this.O_Model = new FlatEverySecondMonthModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.infoOut("平準化開始\n", 0);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
// 2022cvt_015
		var pactid = this.O_View.get_HArgv("-p");
// 2022cvt_015
		var bill_date = this.O_View.get_HArgv("-y");
// 2022cvt_015
		var mode = this.O_View.get_HArgv("-e");
		this.O_Model.update(pactid, bill_date, mode);
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		throw process.exit();// 2022cvt_009
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
