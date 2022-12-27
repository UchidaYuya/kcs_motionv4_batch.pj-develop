//
//ヘルスケア取込処理 （Process）
//
//更新履歴：<br>
//2015/0710 伊達 作成
//
//CalcHealthcareProc
//
//@package
//@subpackage Process
//@author date
//@filesource
//@since 2015/07/10
//
//
//error_reporting(E_ALL|E_STRICT);
//require_once("model/TransitModel.php");	// ●未実装

require("MtTableUtil.php");

require("model/PactModel.php");

require("model/BillModel.php");

require("model/PostModel.php");

require("model/FuncModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/CalcHealthcareView.php");

require("model/script/CalcHealthcareModel.php");

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
class CalcHealthcareProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//$this->getSetting()->loadConfig("docomo_health");
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.O_View = new CalcHealthcareView();
		this.O_Model = new CalcHealthcareModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) //処理開始
	//固有ログディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//$this->Mode = $this->O_View->get_HArgv("-m");
	//$this->healthcoid = $this->O_View->get_HArgv("-c");
	//echo "Mode=".$this->Mode."\n";
	//echo "PactId=".$this->PactId."\n";
	//echo "BillDate=".$this->BillDate."\n";
	//echo "healthcoid=".$this->healthcoid."\n";
	//再計算を行う会社と月を取得する
	//各種カウント
	//計算を行う
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.infoOut("\u30D8\u30EB\u30B9\u30B1\u30A2\u8A08\u7B97\u958B\u59CB\n", 0);
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.BillDate = this.O_View.get_HArgv("-y");

		if (this.O_View.get_ScriptName() == "recalc_healthcare.php") {
			var bill_history = this.O_Model.getBillHistory(this.PactId, this.BillDate);
		} else if (this.O_View.get_ScriptName() == "calc_healthcare.php") {
			bill_history = this.O_Model.getCalcBillHistory(this.PactId, this.BillDate);
		} else {
			bill_history = Array();
		}

		var success_count = 0;
		var error_count = 0;
		var execute_count = 0;
		var nowtime = this.O_Model.getNow();
		var result = 0;

		for (var history of Object.values(bill_history)) //年月の取得
		//対象テーブル番号を取得
		//再計算開始
		{
			var pactid = history.pactid;
			var bill_date = sprintf("%04d%02d", history.year, history.month);
			var tableNo = MtTableUtil.getTableNo(bill_date, false);
			var healthcoid = history.healthcoid;

			if (this.O_Model.update(pactid, healthcoid, tableNo, nowtime) == true) {
				if (this.O_View.get_ScriptName() == "calc_healthcare.php") {
					this.O_Model.InsertBillHistoryLog(history.pactid, history.year, history.month, history.healthcoid, nowtime);
					this.infoOut("\u8A08\u7B97\u6210\u529F\n", 0);
				} else if (this.O_View.get_ScriptName() == "recalc_healthcare.php") //再計算フラグを解除
					{
						this.O_Model.updateBillHistory(history.pactid, history.year, history.month, history.healthcoid, history.status);
						this.infoOut("\u518D\u8A08\u7B97\u6210\u529F\n", 0);
					}

				success_count++;
			} else {
				if (this.O_View.get_ScriptName() == "calc_healthcare.php") {
					this.infoOut("\u8A08\u7B97\u5931\u6557\n", 1);
					result = 1;
				} else if (this.O_View.get_ScriptName() == "recalc_healthcare.php") {
					this.infoOut("\u518D\u8A08\u7B97\u5931\u6557\n", 1);
					result = 1;
				}

				error_count++;
			}

			execute_count++;
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\u5B9F\u884C" + execute_count + "\u4EF6\n", 0);
		this.infoOut("\u6210\u529F" + success_count + "\u4EF6\n", 0);
		this.infoOut("\u5931\u6557" + error_count + "\u4EF6\n", 0);
		this.infoOut("\u30C9\u30B3\u30E2\u30D8\u30EB\u30B9\u30B1\u30A2\u8A08\u7B97\u7D42\u4E86\n", 0);
		throw die(result);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};