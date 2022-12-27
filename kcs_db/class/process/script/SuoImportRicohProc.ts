
import ProcessBaseBatch from "../../process/ProcessBaseBatch";
import {SuoImportRicohView} from "../../view/script/SuoImportRicohView";
import { execSync } from 'child_process';

export class SuoImportRicohProc extends ProcessBaseBatch {
	
	PactId: string = "";
	BillDate: string = "";
	BackUpFlg: string = "";
	Mode: string = "";
	TargetTable: string = "";
	O_View: SuoImportRicohView;
	
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		//Viewの生成
		this.O_View = new SuoImportRicohView();
	}

	doExecute(H_param: {} | any[] = Array())
	{
		//処理開始
		this.infoOut("リコーコピー機データインポート開始\n", 1);

		//固有ログディレクトリの作成取得
		this.set_Dirs(this.O_View.get_ScriptName());

		//引数の値をメンバーに
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");
		this.BackUpFlg = this.O_View.get_HArgv("-b");
		this.Mode = this.O_View.get_HArgv("-e");
		this.TargetTable = this.O_View.get_HArgv("-t");

		try {
			var rtn = execSync("php " + this.getSetting().get("KCS_DIR") + "/script/SuoImportRicohBill.php -e=" + this.Mode + " -y=" + this.BillDate + " -p=" + this.PactId + " -b=" + this.BackUpFlg + " -t=" + this.TargetTable);
			!rtn.toString().split('\r\n')
		} catch (error) {
			this.errorOut(1000, "リコーコピー機請求データ取込処理でエラーが発生しました。\n処理を中断します。\n", 0, "", "");
			throw process.exit(-1);
		}
		//請求データ取込
		// system("php " + this.getSetting().KCS_DIR + "/script/SuoImportRicohBill.php -e=" + this.Mode + " -y=" + this.BillDate + " -p=" + this.PactId + " -b=" + this.BackUpFlg + " -t=" + this.TargetTable, rtn);
		var rtn = execSync("php " + this.getSetting().get("KCS_DIR") + "/script/SuoImportRicohBill.php -e=" + this.Mode + " -y=" + this.BillDate + " -p=" + this.PactId + " -b=" + this.BackUpFlg + " -t=" + this.TargetTable);

		//請求データ取込失敗した場合
		// if (!rtn.toString().split('\r\n')) {
		// 	this.errorOut(1000, "リコーコピー機請求データ取込処理でエラーが発生しました。\n処理を中断します。\n", 0, "", "");
		// 	throw process.exit(-1);
		// }

		execSync("php " + this.getSetting().get("KCS_DIR") + "/script/SuoImportRicohMeisai.php -e=" + this.Mode + " -y=" + this.BillDate + " -p=" + this.PactId + " -b=" + this.BackUpFlg);
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
