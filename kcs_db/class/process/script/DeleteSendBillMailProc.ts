
import  MtTableUtil from '../../MtTableUtil';
import PactModel from '../../model/PactModel';
import BillModel from '../../model/BillModel';
import PostModel from '../../model/PostModel';
import FuncModel from '../../model/FuncModel';
import ProcessBaseBatch from '../ProcessBaseBatch';
import {DeleteSendBillMailView} from '../../view/script/DeleteSendBillMailView';
import {DeleteSendBillMailModel} from '../../model/script/DeleteSendBillMailModel';

export default class DeleteSendBillMailProc extends ProcessBaseBatch {

	O_View: DeleteSendBillMailView;
	O_Model: DeleteSendBillMailModel;

	PactId: string = "";

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//$this->getSetting()->loadConfig("docomo_health");
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.O_View = new DeleteSendBillMailView();
		this.O_Model = new DeleteSendBillMailModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		// this.infoOut("\u6DFB\u4ED8\u8CC7\u6599\u306E\u524A\u9664\u958B\u59CB\n", 0);
		this.infoOut("添付資料の削除開始\n", 0);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.O_Model.update(this.PactId);
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		throw process.exit();// 2022cvt_009
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
