//
//clamp_index_tbアップデートプロセス
//
//更新履歴：<br>
//2009/10/27 宮澤龍彦 作成
//
//@uses ProcessBaseBatch
//@package UpdateClampIndex
//@filesource
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/10/27
//
//
//error_reporting(E_ALL|E_STRICT);
//
//clamp_index_tbアップデートプロセス
//
//@uses ProcessBaseBatch
//@package SBDownload
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/10/27
//

require("process/ProcessBaseBatch.php");

require("model/script/UpdateClampIndexModel.php");

require("view/script/UpdateClampIndexView.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2009/10/27
//
//@param array $H_param
//@param array $H_argv
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author miyazawa
//@since 2009/10/27
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2009/10/27
//
//@access public
//@return void
//
class UpdateClampIndexProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this.O_View = new UpdateClampIndexView();
		this.O_Model = new UpdateClampIndexModel(this.get_DB());
	}

	doExecute(H_param: {} | any[] = Array()) //引数の値を配列に収めてモデルに渡す
	{
		var H_val = Array();
		H_val.year = this.O_View.UpdYear;
		H_val.month = this.O_View.UpdMonth;
		H_val.pactid = this.O_View.UpdPactid;
		H_val.carid = this.O_View.UpdCarid;
		H_val.column = this.O_View.UpdColumn;
		H_val.result = this.O_View.UpdResult;
		this.O_Model.updateIndex(H_val);
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};